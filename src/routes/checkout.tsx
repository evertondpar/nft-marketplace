import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { CollectorForm } from "@/components/checkout/CollectorForm";
import { CartSummary } from "@/components/checkout/CartSummary";
import { SuccessModal } from "@/components/checkout/SuccessModal";
import type { CartItem } from "@/types";

export const Route = createFileRoute("/checkout")({
  // Proteção da rota: verifica se existe token no localStorage antes de carregar
  beforeLoad: () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      // Redireciona para o início se o utilizador não estiver autenticado
      throw redirect({
        to: "/",
        search: { redirect: "/checkout" },
      });
    }
  },
  component: CheckoutPage,
});

function CheckoutPage() {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState("MetaMask");

  // Buscar itens do carrinho para exibir na lateral direita
  const { data: cartItems } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await api.get("/cart");
      return res.data.items;
    },
  });

  const subtotal =
    cartItems?.reduce(
      (acc: number, item: CartItem) =>
        acc + parseFloat(item.price) * item.quantity,
      0,
    ) || 0;
  const networkFee = 0.016;
  const total = subtotal + networkFee;

  const handleConfirmPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccessModalOpen(true);
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
          subtotal={subtotal}
          networkFee={networkFee}
          total={total}
          selectedWallet={selectedWallet}
          setSelectedWallet={setSelectedWallet}
        />
      </form>

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        cartItems={cartItems}
        total={total}
        networkFee={networkFee}
        selectedWallet={selectedWallet}
      />
    </main>
  );
}
