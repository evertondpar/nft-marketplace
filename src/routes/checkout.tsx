import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { CollectorForm } from "@/components/checkout/CollectorForm";
import { CartSummary } from "@/components/checkout/CartSummary";
import { SuccessModal } from "@/components/checkout/SuccessModal";
import type { OrderSnapshot } from "@/types";

export const Route = createFileRoute("/checkout")({
  beforeLoad: () => {
    if (!localStorage.getItem("auth_token")) {
      throw redirect({ to: "/" });
    }
  },
  component: CheckoutPage,
});

function CheckoutPage() {
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
  // 1. Buscar itens do carrinho
  const { data: cartItems = [] } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await api.get("/cart");
      return res.data.items;
    },
  });

  // 2. Buscar Cotação em Tempo Real
  const { data: quote, isLoading: isLoadingQuote } = useQuery({
    queryKey: ["quote", cartItems, couponCode],
    queryFn: async () => {
      if (cartItems.length === 0) return null;
      try {
        const res = await api.post("/quote", {
          items: cartItems,
          coupon: couponCode,
        });
        setCouponError(null);
        return res.data;
      } catch (err: any) {
        setCouponError(err?.response?.data?.message || "Erro ao calcular");
        setCouponCode(""); // Reseta o cupom em caso de erro
        return null;
      }
    },
    enabled: cartItems.length > 0,
  });

  // 3. Mutation de Pedido com Chave de Idempotência
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
      return res.data.order;
    },
    onSuccess: (orderSnapshot) => {
      setConfirmedOrder(orderSnapshot);
      queryClient.invalidateQueries({ queryKey: ["cart"] }); // Esvazia o carrinho visualmente
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

  // 4. Validação e Submissão
  const handleConfirmPurchase = (e: React.FormEvent) => {
    e.preventDefault();

    // Opcional: validações manuais antes de disparar (além do `required` do HTML)
    if (cartItems.length === 0) return;
    if (!quote) return;

    orderMutation.mutate();
  };

  return (
    <main className="flex-1 container mx-auto px-4 md:px-8 py-12">
      <div className="text-sm font-mono text-muted-foreground mb-8">
        Início / Mercado / <span className="text-foreground">Pagamento</span>
      </div>

      <form
        onSubmit={handleConfirmPurchase}
        className="grid grid-cols-1 lg:grid-cols-12 gap-12"
      >
        <CollectorForm />

        <CartSummary
          cartItems={cartItems}
          quote={quote}
          isLoadingQuote={isLoadingQuote}
          couponError={couponError}
          onApplyCoupon={handleApplyCoupon}
          selectedWallet={selectedWallet}
          setSelectedWallet={setSelectedWallet}
          isSubmitting={orderMutation.isPending}
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
