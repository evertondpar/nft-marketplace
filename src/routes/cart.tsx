import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { CartItem } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

function CartPage() {
  const queryClient = useQueryClient();

  const { data: cartItems, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await api.get("/cart");
      return res.data.items;
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      await api.patch(`/cart/${id}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // Mutação para Remover Item
  const removeItemMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/cart/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // Funções de ação
  const handleIncrease = (id: string, currentQty: number) => {
    updateQuantityMutation.mutate({ id, quantity: currentQty + 1 });
  };

  const handleDecrease = (id: string, currentQty: number) => {
    if (currentQty > 1) {
      updateQuantityMutation.mutate({ id, quantity: currentQty - 1 });
    } else {
      removeItemMutation.mutate(id);
    }
  };

  const handleRemove = (id: string) => {
    removeItemMutation.mutate(id);
  };

  // Estado para controlar o carregamento individual das imagens das NFTs no carrinho
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  // 1. TELA DE SKELETON ESTRUTURAL (Enquanto busca o carrinho na API)
  if (isLoading) {
    return (
      <main
        aria-busy="true"
        aria-live="polite"
        aria-label="Carregando carrinho de compras"
        className="flex-1 container mx-auto px-4 md:px-8 py-12"
      >
        {/* Breadcrumb Skeleton */}
        <Skeleton className="h-4 w-48 mb-8" />

        {/* Título Skeleton */}
        <Skeleton className="h-9 w-64 mb-8" />

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Tabela Skeleton (Esquerda) */}
          <div className="flex-1 overflow-x-auto">
            <div className="min-w-[600px] border border-border/40 rounded-xl bg-secondary/20 p-4 space-y-4">
              <Skeleton className="h-6 w-full mb-4" />
              {[1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-4 py-3 border-b border-border/30 last:border-none"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <Skeleton className="w-12 h-12 rounded-lg shrink-0" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-8 w-20 rounded" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </div>

          {/* Resumo da Carteira Skeleton (Direita) */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="p-6 bg-secondary/30 border border-border/40 rounded-xl space-y-6">
              <Skeleton className="h-5 w-40" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-10 w-full rounded" />
              </div>
              <div className="space-y-3 border-t border-border/50 pt-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-12 w-full rounded-md" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Cálculo financeiro
  const subtotal =
    cartItems?.reduce(
      (acc: number, item: CartItem) =>
        acc + parseFloat(item.price) * item.quantity,
      0,
    ) || 0;
  const networkFee = 0.016;
  const total = subtotal + networkFee;

  return (
    <main className="flex-1 container mx-auto px-4 md:px-8 py-12">
      {/* Breadcrumb de navegação */}
      <nav
        aria-label="Navegação estrutural"
        className="text-sm font-mono text-muted-foreground mb-8"
      >
        Início / Mercado / <span className="text-foreground">Carrinho</span>
      </nav>

      <h1 className="text-3xl font-bold text-foreground mb-8">
        Carrinho de NFTs
      </h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Tabela de Produtos (Esquerda) */}
        <div className="flex-1 overflow-x-auto">
          <div className="min-w-[600px] border border-border rounded-xl bg-secondary/20 overflow-hidden">
            {/* Cabeçalho da Tabela */}
            <div
              role="row"
              className="grid grid-cols-12 bg-secondary/50 p-4 text-xs font-mono text-muted-foreground uppercase border-b border-border"
            >
              <div role="columnheader" className="col-span-6">
                NFTs
              </div>
              <div role="columnheader" className="col-span-2 text-center">
                Preço
              </div>
              <div role="columnheader" className="col-span-2 text-center">
                Edições
              </div>
              <div role="columnheader" className="col-span-2 text-right">
                Total
              </div>
            </div>

            {cartItems?.length === 0 ? (
              <div
                role="status"
                className="p-8 text-center text-muted-foreground font-mono text-sm"
              >
                Seu carrinho está vazio.
              </div>
            ) : (
              cartItems?.map((item: CartItem) => {
                const itemTotal = (
                  parseFloat(item.price) * item.quantity
                ).toFixed(2);

                return (
                  <div
                    key={item.id}
                    role="row"
                    className="grid grid-cols-12 items-center p-4 border-b border-border/50 last:border-none text-sm font-mono"
                  >
                    {/* Item & Imagem com Skeleton de Carregamento */}
                    <div className="col-span-6 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-secondary overflow-hidden shrink-0 relative">
                        {!loadedImages[item.id] && (
                          <Skeleton className="absolute inset-0 w-full h-full" />
                        )}
                        <img
                          src={item.image}
                          alt={`Arte digital do NFT ${item.name}`}
                          onLoad={() => handleImageLoad(item.id)}
                          className={`w-full h-full object-cover transition-opacity duration-300 ${
                            loadedImages[item.id] ? "opacity-100" : "opacity-0"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          ID do token: #{item.id}
                        </p>
                      </div>
                    </div>

                    {/* Preço Unitário */}
                    <div className="col-span-2 text-center text-primary font-bold">
                      {item.price} ETH
                    </div>

                    {/* Controles de Quantidade */}
                    <div className="col-span-2 flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDecrease(item.id, item.quantity)}
                        disabled={updateQuantityMutation.isPending}
                        aria-label={`Diminuir quantidade de ${item.name}`}
                        className="w-6 h-6 rounded bg-background border border-border text-primary font-bold hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
                      >
                        -
                      </button>
                      <span
                        aria-label={`Quantidade atual: ${item.quantity}`}
                        aria-live="polite"
                      >
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleIncrease(item.id, item.quantity)}
                        disabled={updateQuantityMutation.isPending}
                        aria-label={`Aumentar quantidade de ${item.name}`}
                        className="w-6 h-6 rounded bg-background border border-border text-primary font-bold hover:bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal e Remover Item */}
                    <div className="col-span-2 text-right font-bold text-foreground flex items-center justify-end gap-3">
                      <span>{itemTotal} ETH</span>
                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        disabled={removeItemMutation.isPending}
                        aria-label={`Remover ${item.name} do carrinho`}
                        className="text-muted-foreground hover:text-red-500 transition-colors p-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Resumo da Carteira (Direita) */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="p-6 bg-secondary/30 border border-border rounded-xl space-y-6">
            <h2 className="font-bold text-foreground font-mono text-base">
              Resumo da carteira
            </h2>

            {/* Formulário de Código Promocional */}
            <div>
              <label
                htmlFor="promo-code-input"
                className="text-xs font-mono text-muted-foreground block mb-2"
              >
                Código promocional
              </label>
              <div className="flex gap-2">
                <input
                  id="promo-code-input"
                  type="text"
                  placeholder="Digite o código..."
                  className="flex-1 bg-background border border-border rounded px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="bg-primary/20 text-primary hover:bg-primary/30 text-xs font-bold focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Aplicar
                </Button>
              </div>
            </div>

            {/* Valores Detalhados */}
            <div className="space-y-3 text-xs font-mono border-t border-border/50 pt-4 text-muted-foreground">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-foreground font-bold">
                  {subtotal.toFixed(3)} ETH
                </span>
              </div>
              <div className="flex justify-between">
                <span>Desconto do lançamento</span>
                <span className="text-foreground">(-) 0.00 ETH</span>
              </div>
              <div className="flex justify-between">
                <span>
                  Taxa de rede{" "}
                  <span className="text-[10px] block text-muted-foreground">
                    Taxa estimada
                  </span>
                </span>
                <span className="text-foreground">{networkFee} ETH</span>
              </div>
            </div>

            {/* Total Geral */}
            <div className="border-t border-border pt-4 flex justify-between items-center font-mono">
              <span className="font-bold text-foreground">Total</span>
              <span
                aria-live="polite"
                aria-label={`Total da compra: ${total.toFixed(3)} ETH`}
                className="text-lg font-bold text-primary"
              >
                {total.toFixed(3)} ETH
              </span>
            </div>

            {/* Botão de Finalização */}
            <Link
              to="/checkout"
              className="block w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md"
            >
              <Button
                type="button"
                className="w-full py-6 font-bold bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary"
              >
                Conectar e finalizar
              </Button>
            </Link>

            <div className="text-center">
              <Link
                to="/"
                className="text-xs font-mono text-muted-foreground hover:text-foreground underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Continuar explorando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
