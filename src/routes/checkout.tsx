import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { CollectorForm } from "@/components/checkout/CollectorForm";
import { CartSummary } from "@/components/checkout/CartSummary";
import { SuccessModal } from "@/components/checkout/SuccessModal";
import type { OrderSnapshot, Quote } from "@/types";
import { useSocket } from "@/hooks/useSocket";

export const Route = createFileRoute("/checkout")({
  beforeLoad: () => {
    if (!localStorage.getItem("auth_token")) {
      throw redirect({ to: "/" });
    }
  },
  component: CheckoutPage,
});

function CheckoutPage() {
  const { priceChangeAlert, clearAlert } = useSocket();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Ref para guardar a chave de idempotência desta tentativa de checkout
  const idempotencyKey = useRef(crypto.randomUUID());

  const [selectedWallet, setSelectedWallet] = useState("MetaMask");
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);

  const [confirmedOrder, setConfirmedOrder] = useState<OrderSnapshot | null>(
    null,
  );

  // 1. Estado reativo do ID do pedido pendente salvo na sessão
  const [activeOrderId, setActiveOrderId] = useState<string | null>(() =>
    typeof window !== "undefined"
      ? sessionStorage.getItem("activeOrderId")
      : null,
  );

  // 2. Reconciliação via REST no carregamento/re-mount (F5 ou reconexão)
  const { data: reconciledOrder, isLoading: isReconciling } =
    useQuery<OrderSnapshot>({
      queryKey: ["order", activeOrderId],
      queryFn: async () => {
        const res = await api.get(`/orders/${activeOrderId}`);
        return res.data;
      },
      enabled: !!activeOrderId, // Só dispara se houver pedido pendente no sessionStorage
      staleTime: 0,
    });

  // 3. Efeito para restaurar o estado se a API retornar um pedido já confirmado ou recusado
  useEffect(() => {
    if (!reconciledOrder) return;

    if (reconciledOrder.status === "confirmed") {
      setConfirmedOrder(reconciledOrder);
      sessionStorage.removeItem("activeOrderId");
      setActiveOrderId(null);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    } else if (reconciledOrder.status === "rejected") {
      sessionStorage.removeItem("activeOrderId");
      setActiveOrderId(null);
      alert("Seu pedido foi recusado ou cancelado.");
    }
  }, [reconciledOrder, queryClient]);

  // 4. Buscar itens do carrinho

  const { data: cartItems = [] } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await api.get("/cart");
      return res.data.items;
    },
    staleTime: 0, // Garante que os dados são considerados caducos para re-buscar
    refetchOnMount: true, // Força a requisição GET /cart sempre que entrar na página
  });

  // 5. Buscar Cotação em Tempo Real (com trava de recálculo)
  const {
    data: quote,
    isLoading: isLoadingQuote,
    isFetching: isFetchingQuote,
  } = useQuery<Quote | null>({
    queryKey: ["quote", cartItems, couponCode],
    queryFn: async () => {
      if (cartItems.length === 0) return null;
      try {
        // ⏱️ DELAY ARTIFICIAL PARA TESTES (Simula latência de rede)
        // await new Promise((resolve) => setTimeout(resolve, 2000));
        const res = await api.post("/quote", {
          items: cartItems,
          coupon: couponCode,
        });
        setCouponError(null);
        return res.data;
      } catch (err: any) {
        setCouponError(
          err?.response?.data?.message || "Erro ao calcular cotação",
        );
        setCouponCode(""); // Reseta o cupom em caso de erro
        return null;
      }
    },
    enabled: cartItems.length > 0,
  });

  // 6. Mutation de Pedido com Chave de Idempotência
  const orderMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(
        "/orders",
        {
          items: cartItems,
          quote: quote,
          wallet: selectedWallet,
        },
        {
          headers: {
            "Idempotency-Key": idempotencyKey.current, // Garante segurança em falhas/retries
          },
        },
      );

      return res.data.order as OrderSnapshot;
    },
    onSuccess: (orderSnapshot) => {
      console.log("RESS ", orderSnapshot);
      if (orderSnapshot.status === "confirmed") {
        setConfirmedOrder(orderSnapshot);
        sessionStorage.removeItem("activeOrderId");
        setActiveOrderId(null);
        queryClient.invalidateQueries({ queryKey: ["cart"] }); // Esvazia o carrinho visualmente
      } else {
        // Pedido pendente (processamento assíncrono / tempo real)
        sessionStorage.setItem("activeOrderId", orderSnapshot.id);
        setActiveOrderId(orderSnapshot.id);
        queryClient.setQueryData(["order", orderSnapshot.id], orderSnapshot);
      }
    },
    onError: () => {
      alert(
        "Houve um erro de conexão. Tente novamente (a cobrança está protegida).",
      );
    },
  });

  const handleApplyCoupon = (code: string) => {
    setCouponCode(code);
  };

  // 7. Validação e Submissão
  const handleConfirmPurchase = (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) return;
    if (!quote || isFetchingQuote) return; // Bloqueia cotações em recálculo/desatualizadas

    orderMutation.mutate();
  };

  const isSubmitting = orderMutation.isPending || isReconciling;

  useEffect(() => {
    console.log("snapshot: ", confirmedOrder);
  }, [confirmedOrder]);
  return (
    <main className="flex-1 container mx-auto px-4 md:px-8 py-12">
      <div className="text-sm font-mono text-muted-foreground mb-8">
        Início / Mercado / <span className="text-foreground">Pagamento</span>
      </div>
      {/* BANNER DE ALERTA DE MUDANÇA DE PREÇO */}
      {priceChangeAlert && (
        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/40 rounded-xl text-yellow-500 text-xs font-mono flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{priceChangeAlert}</span>
          </div>
          <button
            onClick={clearAlert}
            className="text-xs underline font-bold hover:text-yellow-400 cursor-pointer"
          >
            Entendi
          </button>
        </div>
      )}
      <form
        onSubmit={handleConfirmPurchase}
        className="grid grid-cols-1 lg:grid-cols-12 gap-12"
      >
        <CollectorForm />

        <CartSummary
          cartItems={cartItems}
          quote={quote}
          isLoadingQuote={isLoadingQuote || isFetchingQuote}
          couponError={couponError}
          onApplyCoupon={handleApplyCoupon}
          selectedWallet={selectedWallet}
          setSelectedWallet={setSelectedWallet}
          isSubmitting={isSubmitting}
        />
      </form>

      {/* MODAL DE SUCESSO: Renderizado EXCLUSIVAMENTE com os dados do confirmedOrder (Snapshot) */}
      {confirmedOrder && (
        <SuccessModal
          isOpen={!!confirmedOrder}
          onClose={() => {
            setConfirmedOrder(null);
            navigate({ to: "/" });
          }}
          orderSnapshot={confirmedOrder} // Repassa apenas o Recibo Congelado
        />
      )}
    </main>
  );
}
