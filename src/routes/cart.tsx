import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem, NFTItem } from "@/types";
import { NFTCard } from "@/components/nft/NFTCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

const RELATED_PAGE_SIZE = 5;
const NETWORK_FEE = 0.016;

/* Colunas da tabela desktop: NFTs | Preço | Edições | Total | Remover */
const TABLE_COLS = "grid-cols-[minmax(0,1fr)_139px_136px_140px_60px]";

/* ---------- Botão redondo de quantidade ---------- */
function QtyButton({
  kind,
  dimmed = false,
  onClick,
  disabled,
  label,
}: {
  kind: "minus" | "plus";
  dimmed?: boolean;
  onClick: () => void;
  disabled?: boolean;
  label: string;
}) {
  const Icon = kind === "minus" ? Minus : Plus;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 lg:h-[26px] lg:w-[18px] ${
        dimmed
          ? "bg-primary/25 text-primary/60"
          : "bg-primary text-primary-foreground hover:bg-primary/90"
      }`}
    >
      <Icon className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
    </button>
  );
}

function CartPage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: cartItems, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await api.get("/cart");
      return res.data.items;
    },
  });

  // NFTs sugeridos para "Colecionadores também viram"
  const { data: allNfts, isLoading: isLoadingAllNfts } = useQuery({
    queryKey: ["nfts"],
    queryFn: async () => {
      const response = await api.get("/nfts");
      return response.data.items;
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

  // Estados locais
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [promoCode, setPromoCode] = useState("");
  const [relatedPage, setRelatedPage] = useState(0);

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

  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  // 1. SKELETON ESTRUTURAL
  if (isLoading) {
    return (
      <main
        aria-busy="true"
        aria-live="polite"
        aria-label="Carregando carrinho de compras"
        className="mx-auto w-full max-w-[1248px] flex-1 px-7 pb-24 pt-8 lg:px-6 lg:pt-7"
      >
        {/* Mobile */}
        <div className="lg:hidden space-y-5">
          <div className="flex justify-center">
            <Skeleton className="h-7 w-48" />
          </div>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[100px] w-full rounded-2xl" />
          ))}
        </div>

        {/* Desktop */}
        <div className="hidden lg:block">
          <Skeleton className="mb-3 h-4 w-48" />
          <div className="grid grid-cols-[1fr_332px] gap-[86px]">
            <div className="space-y-3">
              <Skeleton className="h-6 w-full" />
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-[70px] w-full rounded-sm" />
              ))}
            </div>
            <div className="space-y-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Cálculo financeiro
  const items: CartItem[] = cartItems ?? [];
  const subtotal = items.reduce(
    (acc: number, item: CartItem) =>
      acc + parseFloat(item.price) * item.quantity,
    0,
  );
  const total = subtotal + NETWORK_FEE;

  // Sugestões (exclui o que já está no carrinho)
  const cartIds = new Set(items.map((item) => String(item.id)));
  const relatedAll: NFTItem[] = (allNfts ?? []).filter(
    (nft: NFTItem) => !cartIds.has(String(nft.id)),
  );
  const totalRelatedPages = Math.max(
    1,
    Math.ceil(relatedAll.length / RELATED_PAGE_SIZE),
  );
  const currentRelatedPage = Math.min(relatedPage, totalRelatedPages - 1);
  const relatedNfts = relatedAll.slice(
    currentRelatedPage * RELATED_PAGE_SIZE,
    (currentRelatedPage + 1) * RELATED_PAGE_SIZE,
  );

  const tokenId = (id: string | number) => String(id).padStart(4, "0");
  const editionOf = (item: CartItem) =>
    (item as CartItem & { edition?: string }).edition;

  const itemImage = (item: CartItem, className: string) => (
    <div
      className={`relative shrink-0 overflow-hidden bg-secondary ${className}`}
    >
      {!loadedImages[item.id] && (
        <Skeleton className="absolute inset-0 h-full w-full" />
      )}
      <img
        src={item.image}
        alt={`Arte digital do NFT ${item.name}`}
        onLoad={() => handleImageLoad(item.id)}
        className={`h-full w-full object-cover transition-opacity duration-300 ${
          loadedImages[item.id] ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );

  return (
    <main className="mx-auto w-full max-w-[1248px] flex-1 px-7 pb-[380px] pt-8 font-mono lg:px-6 lg:pb-24 lg:pt-7">
      {/* =====================================================
          MOBILE — cabeçalho
          ===================================================== */}
      <div className="relative mb-5 flex h-9 items-center lg:hidden">
        <button
          type="button"
          onClick={() => router.history.back()}
          aria-label="Voltar"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-xl font-bold text-foreground">
          Carrinho de NFTs
        </h1>
      </div>

      {/* DESKTOP — breadcrumb */}
      <h1 className="sr-only hidden lg:block">Carrinho de NFTs</h1>
      <nav
        aria-label="Navegação estrutural"
        className="mb-0.5 hidden text-[15px] font-bold leading-6 text-foreground lg:block"
      >
        Início / Mercado / Carrinho
      </nav>

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_332px] lg:gap-[86px]">
        {/* =====================================================
            ITENS — DESKTOP (tabela)
            ===================================================== */}
        <div
          role="table"
          aria-label="Itens do carrinho"
          className="hidden lg:block"
        >
          <div
            role="row"
            className={`grid ${TABLE_COLS} border-b border-primary/30 pb-2 text-[15px] font-bold leading-6 text-foreground`}
          >
            <div role="columnheader">NFTs</div>
            <div role="columnheader">Preço</div>
            <div role="columnheader">Edições</div>
            <div role="columnheader">Total</div>
            <div role="columnheader" className="sr-only">
              Remover
            </div>
          </div>

          <div className="mt-3 space-y-3">
            {items.length === 0 ? (
              <div
                role="status"
                className="rounded-sm bg-secondary p-8 text-center text-sm text-muted-foreground"
              >
                Seu carrinho está vazio.
              </div>
            ) : (
              items.map((item) => {
                const itemTotal = (
                  parseFloat(item.price) * item.quantity
                ).toFixed(2);
                return (
                  <div
                    key={item.id}
                    role="row"
                    className={`grid ${TABLE_COLS} h-[70px] items-center rounded-sm bg-secondary`}
                  >
                    <div
                      role="cell"
                      className="flex min-w-0 items-center gap-4"
                    >
                      {itemImage(item, "h-[70px] w-[70px] rounded-sm")}
                      <div className="min-w-0">
                        <p className="truncate text-[15px] font-bold text-foreground">
                          {item.name} #{item.id}
                        </p>
                        <p className="text-[13px] text-muted-foreground">
                          ID do token: #{tokenId(item.id)}
                        </p>
                      </div>
                    </div>

                    <div
                      role="cell"
                      className="text-base font-bold text-primary"
                    >
                      {item.price} ETH
                    </div>

                    <div role="cell" className="flex items-center gap-3">
                      <QtyButton
                        kind="minus"
                        dimmed={item.quantity <= 1}
                        onClick={() => handleDecrease(item.id, item.quantity)}
                        disabled={updateQuantityMutation.isPending}
                        label={
                          item.quantity > 1
                            ? `Diminuir quantidade de ${item.name}`
                            : `Remover ${item.name} do carrinho`
                        }
                      />
                      <span
                        aria-label={`Quantidade atual: ${item.quantity}`}
                        aria-live="polite"
                        className="w-3 text-center text-foreground"
                      >
                        {item.quantity}
                      </span>
                      <QtyButton
                        kind="plus"
                        onClick={() => handleIncrease(item.id, item.quantity)}
                        disabled={updateQuantityMutation.isPending}
                        label={`Aumentar quantidade de ${item.name}`}
                      />
                    </div>

                    <div
                      role="cell"
                      className="text-base font-bold text-primary"
                    >
                      {itemTotal} ETH
                    </div>

                    <div role="cell" className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        disabled={removeItemMutation.isPending}
                        aria-label={`Remover ${item.name} do carrinho`}
                        className="rounded p-1 text-primary/90 transition-colors hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
                      >
                        <Trash2 className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* =====================================================
            ITENS — MOBILE (cards)
            ===================================================== */}
        <div className="space-y-5 lg:hidden">
          {items.length === 0 ? (
            <div
              role="status"
              className="rounded-2xl bg-secondary p-8 text-center text-sm text-muted-foreground"
            >
              Seu carrinho está vazio.
            </div>
          ) : (
            items.map((item) => {
              const edition = editionOf(item);
              return (
                <div
                  key={item.id}
                  className="flex h-[100px] overflow-hidden rounded-2xl bg-secondary"
                >
                  {itemImage(item, "h-[100px] w-[100px]")}
                  <div className="flex min-w-0 flex-1 items-center justify-between gap-2 pl-[9px] pr-4">
                    <div className="min-w-0">
                      <p className="truncate text-[15px] font-bold leading-5 text-foreground">
                        {item.name} #{item.id}
                      </p>
                      <p className="mt-1 truncate text-sm leading-5 text-muted-foreground">
                        {edition
                          ? `Edição: ${edition}`
                          : `ID do token: #${tokenId(item.id)}`}
                      </p>
                      <p className="mt-2 text-xl font-bold leading-7 text-primary">
                        {item.price} ETH
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <QtyButton
                        kind="minus"
                        dimmed={item.quantity <= 1}
                        onClick={() => handleDecrease(item.id, item.quantity)}
                        disabled={
                          updateQuantityMutation.isPending ||
                          removeItemMutation.isPending
                        }
                        label={
                          item.quantity > 1
                            ? `Diminuir quantidade de ${item.name}`
                            : `Remover ${item.name} do carrinho`
                        }
                      />
                      <span
                        aria-label={`Quantidade atual: ${item.quantity}`}
                        aria-live="polite"
                        className="w-2 text-center text-foreground"
                      >
                        {item.quantity}
                      </span>
                      <QtyButton
                        kind="plus"
                        onClick={() => handleIncrease(item.id, item.quantity)}
                        disabled={updateQuantityMutation.isPending}
                        label={`Aumentar quantidade de ${item.name}`}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* =====================================================
            RESUMO — DESKTOP
            ===================================================== */}
        <aside aria-label="Resumo da carteira" className="hidden lg:block">
          <h2 className="border-b border-primary/30 pb-2 text-[17px] font-bold leading-6 text-foreground">
            Resumo da carteira
          </h2>

          <div className="mt-5">
            <label
              htmlFor="promo-code-input"
              className="block text-sm font-bold leading-6 text-foreground"
            >
              Código promocional
            </label>
            <div className="mt-1 flex">
              <input
                id="promo-code-input"
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Digite o código promocional..."
                className="h-10 min-w-0 flex-1 rounded-l-sm border border-primary bg-secondary px-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
              <Button
                type="button"
                className="h-10 w-[101px] rounded-l-none rounded-r-sm bg-primary font-mono text-sm font-bold text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary"
              >
                Aplicar
              </Button>
            </div>
          </div>

          <div className="mt-[18px] text-[15px] leading-8 text-foreground">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="text-[17px]">{subtotal.toFixed(2)} ETH</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Desconto do lançamento</span>
              <span className="text-sm">(-) 00.00</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Taxa de rede</span>
              <span className="text-[17px]">{NETWORK_FEE} ETH</span>
            </div>
            <p className="mt-1.5 text-right text-[11px] leading-4 text-primary">
              Taxa estimada
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between leading-8">
            <span className="text-[15px] font-bold text-foreground">Total</span>
            <span
              aria-live="polite"
              aria-label={`Total da compra: ${total.toFixed(3)} ETH`}
              className="text-lg font-bold text-primary"
            >
              {total.toFixed(3)} ETH
            </span>
          </div>

          <Button className="mt-4 h-10 w-full rounded-sm bg-primary font-mono text-sm font-bold text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
            <Link to="/checkout">Conectar e finalizar</Link>
          </Button>

          <div className="mt-3 text-center">
            <Link
              to="/"
              className="rounded text-[15px] leading-6 text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Continuar explorando
            </Link>
          </div>
        </aside>
      </div>

      {/* =====================================================
          COLECIONADORES TAMBÉM VIRAM (desktop)
          ===================================================== */}
      <section
        aria-label="Colecionadores também viram"
        className="mt-24 hidden lg:block"
      >
        <h2 className="mb-8 border-b border-primary/30 pb-2 text-[17px] font-bold text-primary">
          Colecionadores também viram
        </h2>

        {isLoadingAllNfts ? (
          <div className="grid grid-cols-5 gap-x-[26px]">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-5 gap-x-[26px]">
              {relatedNfts.map((nft: NFTItem) => (
                <NFTCard key={nft.id} {...nft} />
              ))}
            </div>

            {totalRelatedPages > 1 && (
              <div
                role="group"
                aria-label="Páginas de NFTs sugeridos"
                className="mt-8 flex justify-center gap-2"
              >
                {Array.from({ length: totalRelatedPages }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRelatedPage(i)}
                    aria-label={`Ir para o grupo ${i + 1} de NFTs`}
                    aria-current={i === currentRelatedPage ? "true" : undefined}
                    className={`h-3 w-3 rounded-full border border-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                      i === currentRelatedPage ? "bg-primary" : "bg-transparent"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* =====================================================
          RESUMO — MOBILE (sheet fixo na base)
          ===================================================== */}
      <aside
        aria-label="Resumo da carteira"
        className="fixed inset-x-0 bottom-0 z-40 rounded-t-[32px] bg-secondary px-6 pb-9 pt-6 shadow-[0_-8px_24px_rgba(0,0,0,0.35)] lg:hidden"
      >
        <div className="flex h-[50px] items-center overflow-hidden rounded-full border border-primary/20 bg-background/40 pl-4">
          <label htmlFor="promo-code-input-mobile" className="sr-only">
            Código promocional
          </label>
          <input
            id="promo-code-input-mobile"
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Digite o código promocional..."
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <Button
            type="button"
            className="h-[50px] w-[97px] rounded-full bg-gradient-to-br from-primary to-primary/60 font-mono text-[15px] font-bold text-primary-foreground hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary"
          >
            Aplicar
          </Button>
        </div>

        <div className="mt-1.5 text-base leading-8 text-foreground">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span>{subtotal.toFixed(2)} ETH</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Desconto do lançamento</span>
            <span>(-) 00.00</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Taxa de rede</span>
            <span>{NETWORK_FEE} ETH</span>
          </div>
          <p className="-mt-1.5 text-right text-[11px] leading-4 text-primary">
            Taxa estimada
          </p>
        </div>

        <div className="mt-1.5 flex items-center justify-between leading-8">
          <span className="text-base font-bold text-foreground">Total</span>
          <span
            aria-live="polite"
            aria-label={`Total da compra: ${total.toFixed(3)} ETH`}
            className="text-xl font-bold text-primary"
          >
            {total.toFixed(3)} ETH
          </span>
        </div>

        <Button className="mt-6 h-[60px] w-full rounded-full bg-gradient-to-br from-primary to-primary/60 font-mono text-base font-bold text-primary-foreground hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
          <Link to="/checkout">Conectar e finalizar</Link>
        </Button>
      </aside>
    </main>
  );
}
