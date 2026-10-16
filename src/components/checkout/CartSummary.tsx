import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle,
  ChevronLeft,
  Loader2,
  MoreVertical,
  Wallet,
} from "lucide-react";
import type { CartItem, Quote } from "@/types";
import { useState } from "react";

interface ConnectedWallet {
  id: string;
  label: string;
  address: string;
  network: string;
}

interface CartSummaryProps {
  cartItems: CartItem[];
  quote: Quote | null | undefined;
  isLoadingQuote: boolean;
  couponError: string | null;
  onApplyCoupon: (coupon: string) => void;
  selectedWallet: string;
  setSelectedWallet: (wallet: string) => void;
  isSubmitting: boolean;
  /** Carteiras conectadas (tela mobile). Opcional. */
  connectedWallets?: ConnectedWallet[];
  onBack?: () => void;
  onChangeWallet?: () => void;
}

const WALLET_OPTIONS = [
  { name: "WalletConnect", badge: "W" },
  { name: "MetaMask", badge: "M" },
  { name: "Coinbase Wallet", badge: null },
];

const defaultConnectedWallets: ConnectedWallet[] = [
  {
    id: "reserve",
    label: "Reserva",
    address: "nova.kurio.eth",
    network: "Rede Polygon",
  },
  {
    id: "main",
    label: "Principal",
    address: "0xA91F…E82C",
    network: "Rede principal Ethereum",
  },
];

/* Indicador de rádio compartilhado */
function Radio({
  checked,
  className = "",
}: {
  checked: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
        checked ? "border-primary" : "border-primary/25"
      } ${className}`}
    >
      {checked && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
    </span>
  );
}

export function CartSummary({
  cartItems,
  quote,
  isLoadingQuote,
  couponError,
  onApplyCoupon,
  selectedWallet,
  setSelectedWallet,
  isSubmitting,
  connectedWallets = defaultConnectedWallets,
  onBack,
  onChangeWallet,
}: CartSummaryProps) {
  const [couponInput, setCouponInput] = useState("");
  const [showCoupon, setShowCoupon] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [connectedId, setConnectedId] = useState(connectedWallets[0]?.id ?? "");

  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  // 1. Subtotal direto dos itens do carrinho para comparar com a cotação
  const currentCartSubtotal = cartItems.reduce(
    (acc, item) => acc + parseFloat(item.price || "0") * item.quantity,
    0,
  );

  // 2. Cotação desincronizada com o valor atual do carrinho
  const isQuoteStale =
    !!quote && Math.abs(currentCartSubtotal - quote.subtotal) > 0.0001;

  // 3. Trava de segurança: desativa a compra com cotação inválida/desatualizada
  const isButtonDisabled =
    isSubmitting ||
    isLoadingQuote ||
    isQuoteStale ||
    !quote ||
    cartItems.length === 0;

  const couponOpen = showCoupon || !!couponError || !!quote?.validCoupon;
  const totalLabel = `${quote?.total.toFixed(3) || "0.000"} ETH`;
  const confirmLabel =
    isLoadingQuote || isQuoteStale
      ? "A recalcular cotação..."
      : "Confirmar compra";

  const spinner = (isSubmitting || isLoadingQuote) && (
    <Loader2 className="h-4 w-4 animate-spin" />
  );

  /* Lista de carteiras: rádio à esquerda no desktop, ícone + rádio à direita no mobile */
  const walletOptions = (
    <div
      role="radiogroup"
      aria-label="Carteira para recebimento da NFT"
      className="space-y-4"
    >
      {WALLET_OPTIONS.map((wallet) => {
        const selected = selectedWallet === wallet.name;
        return (
          <button
            type="button"
            key={wallet.name}
            role="radio"
            aria-checked={selected}
            onClick={() => setSelectedWallet(wallet.name)}
            className={`flex w-full items-center gap-3 text-left text-sm font-mono text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
              h-[66px] rounded-2xl bg-secondary px-3.5
              lg:h-11 lg:gap-2.5 lg:rounded-sm lg:border lg:bg-transparent lg:px-3.5 lg:text-[15px] ${
                selected ? "lg:border-foreground/70" : "lg:border-primary/20"
              }`}
          >
            <span
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/15 bg-background/50 text-sm font-bold text-primary lg:hidden"
            >
              {wallet.badge ?? <Wallet className="h-5 w-5" />}
            </span>
            <span className="flex-1">{wallet.name}</span>
            <Radio
              checked={selected}
              className="order-last lg:order-first lg:h-4 lg:w-4 lg:border-primary"
            />
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="lg:col-span-5 font-mono">
      {/* =====================================================
          MOBILE — tela "Pagamento com carteira"
          ===================================================== */}
      <div className="pb-28 lg:hidden">
        <div className="mb-6 flex items-center gap-6">
          <button
            type="button"
            onClick={onBack ?? (() => window.history.back())}
            aria-label="Voltar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <h2 className="text-xl font-bold text-foreground">
            Pagamento com carteira
          </h2>
        </div>

        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground">
            Carteira conectada
          </h3>
          <button
            type="button"
            onClick={onChangeWallet}
            className="text-sm font-bold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            Trocar carteira
          </button>
        </div>

        <div
          role="radiogroup"
          aria-label="Carteira conectada"
          className="space-y-5"
        >
          {connectedWallets.map((wallet) => {
            const selected = connectedId === wallet.id;
            return (
              <div
                key={wallet.id}
                className="flex items-center gap-4 rounded-2xl bg-secondary px-4 py-4"
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-label={`Usar carteira ${wallet.label}`}
                  onClick={() => setConnectedId(wallet.id)}
                  className="flex flex-1 items-center gap-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                >
                  <Radio checked={selected} />
                  <span className="min-w-0 text-sm leading-[22px] text-muted-foreground">
                    <span className="block text-base font-bold text-foreground">
                      {wallet.label}
                    </span>
                    <span className="block truncate">{wallet.address}</span>
                    <span className="block">{wallet.network}</span>
                  </span>
                </button>
                <button
                  type="button"
                  aria-label={`Mais opções da carteira ${wallet.label}`}
                  className="text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                >
                  <MoreVertical className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            );
          })}
        </div>

        <h3 className="mb-3 mt-3.5 text-base font-bold text-foreground">
          Carteira e rede
        </h3>
        {walletOptions}

        <div
          aria-live="polite"
          className="mt-5 flex items-center justify-end gap-8"
        >
          <span className="text-base font-bold text-foreground">Total:</span>
          {isLoadingQuote ? (
            <Skeleton className="h-6 w-24" />
          ) : (
            <span
              aria-label={`Valor total: ${totalLabel}`}
              className="text-xl font-bold text-primary"
            >
              {totalLabel}
            </span>
          )}
        </div>

        {/* Botão fixo na base */}
        <div className="fixed inset-x-0 bottom-0 z-40 bg-gradient-to-t from-background via-background to-transparent px-7 pb-8 pt-6">
          <Button
            type="submit"
            disabled={isButtonDisabled}
            aria-busy={isSubmitting || isLoadingQuote}
            aria-label="Confirmar e finalizar compra de NFTs"
            className="flex h-[60px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-primary to-primary/70 font-mono text-[15px] font-bold text-primary-foreground hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {spinner}
            {confirmLabel}
          </Button>
        </div>
      </div>

      {/* =====================================================
          DESKTOP
          ===================================================== */}
      <div className="hidden lg:block">
        <h3 className="mb-1.5 text-[17px] font-bold text-foreground">
          Seus NFTs
        </h3>
        <div className="flex justify-between text-[15px] font-bold text-foreground">
          <span>NFTs</span>
          <span>Subtotal</span>
        </div>

        {/* ALERTA DE COTAÇÃO DESATUALIZADA / ALTERAÇÃO DE PREÇO */}
        {(isLoadingQuote || isQuoteStale) && (
          <div
            role="alert"
            aria-live="polite"
            className="mt-3 flex items-center gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-xs text-yellow-500"
          >
            <AlertTriangle className="h-4 w-4 shrink-0 animate-pulse" />
            <span>
              {isLoadingQuote
                ? "A recalcular a cotação em tempo real..."
                : "O preço de um NFT mudou! A atualizar valores..."}
            </span>
          </div>
        )}

        {/* LISTA DE ITENS */}
        <div
          role="region"
          aria-label="Itens selecionados para compra"
          className="mt-5 max-h-[330px] space-y-3 overflow-y-auto"
        >
          {cartItems?.map((item) => (
            <div
              key={item.id}
              className="flex h-[70px] items-center gap-2 rounded-sm bg-secondary pr-3"
            >
              <div className="relative h-[70px] w-[70px] shrink-0 overflow-hidden rounded-md bg-secondary">
                {!loadedImages[item.id] && (
                  <Skeleton className="absolute inset-0 h-full w-full" />
                )}
                <img
                  src={item.image}
                  alt={`Thumbnail da NFT ${item.name}`}
                  onLoad={() => handleImageLoad(item.id)}
                  className={`h-full w-full object-cover transition-opacity duration-300 ${
                    loadedImages[item.id] ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold text-foreground">
                  {item.name} #{item.id}
                </p>
                <p className="text-[13px] text-muted-foreground">
                  ID do token: #{String(item.id).padStart(4, "0")}
                </p>
              </div>
              <span className="text-sm text-muted-foreground">
                (x {item.quantity})
              </span>
              <span className="ml-3 text-lg font-bold text-primary">
                {(parseFloat(item.price) * item.quantity).toFixed(2)} ETH
              </span>
            </div>
          ))}
        </div>

        {/* CUPOM */}
        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={() => setShowCoupon((prev) => !prev)}
            aria-expanded={couponOpen}
            aria-controls="checkout-coupon-area"
            className="rounded text-sm text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Tem um código promocional? Aplique aqui
          </button>
        </div>
        {couponOpen && (
          <div id="checkout-coupon-area" className="mt-3 space-y-2">
            <label htmlFor="checkout-coupon-input" className="sr-only">
              Cupom promocional
            </label>
            <div className="flex gap-2">
              <input
                id="checkout-coupon-input"
                type="text"
                placeholder="Código promocional (ex: KURIO20)"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="h-10 flex-1 rounded-sm border border-primary/20 bg-secondary px-3 text-xs uppercase text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => onApplyCoupon(couponInput)}
                disabled={isLoadingQuote || !couponInput}
                className="h-10 rounded-sm text-xs font-bold focus-visible:ring-2 focus-visible:ring-primary"
              >
                Aplicar
              </Button>
            </div>
            {couponError && (
              <p role="alert" className="text-[11px] text-red-500">
                {couponError}
              </p>
            )}
            {quote?.validCoupon && (
              <p role="status" className="text-[11px] text-primary">
                Cupom {quote.validCoupon} aplicado com sucesso!
              </p>
            )}
          </div>
        )}

        {/* VALORES DA COTAÇÃO */}
        <div
          aria-live="polite"
          className="mt-2 space-y-0 text-[15px] leading-8 text-foreground"
        >
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            {isLoadingQuote ? (
              <Skeleton className="h-4 w-16" />
            ) : (
              <span className="text-[17px]">
                {quote?.subtotal.toFixed(2) || "0.00"} ETH
              </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span>Desconto do lançamento</span>
            {isLoadingQuote ? (
              <Skeleton className="h-4 w-16" />
            ) : (
              <span className="text-[17px]">
                {quote && quote.discount > 0
                  ? `(-) ${quote.discount.toFixed(2)} ETH`
                  : "(-) 00.00"}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span>Taxa de rede</span>
            {isLoadingQuote ? (
              <Skeleton className="h-4 w-16" />
            ) : (
              <span className="text-[17px]">
                {quote?.networkFee.toFixed(3) || "0.000"} ETH
              </span>
            )}
          </div>
        </div>
        <p className="text-center text-[11px] text-primary">Taxa estimada</p>

        {/* TOTAL */}
        <div className="mt-4 flex items-center justify-between border-t border-primary/20 px-10 pt-1 leading-7">
          <span className="text-[15px] font-bold text-foreground">Total</span>
          {isLoadingQuote ? (
            <Skeleton className="h-6 w-24" />
          ) : (
            <span
              aria-label={`Valor total: ${totalLabel}`}
              className="text-lg font-bold text-primary"
            >
              {totalLabel}
            </span>
          )}
        </div>

        <h3 className="mt-3 text-center text-base font-bold text-foreground">
          Carteira e rede
        </h3>
        <div className="mt-4">{walletOptions}</div>

        <Button
          type="submit"
          disabled={isButtonDisabled}
          aria-busy={isSubmitting || isLoadingQuote}
          aria-label="Confirmar e finalizar compra de NFTs"
          className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-sm bg-primary font-mono text-sm font-bold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          {spinner}
          {confirmLabel}
        </Button>
      </div>
    </div>
  );
}
