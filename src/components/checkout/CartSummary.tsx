import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, AlertTriangle } from "lucide-react";
import type { CartItem, Quote } from "@/types";
import { useState } from "react";

interface CartSummaryProps {
  cartItems: CartItem[];
  quote: Quote | null | undefined;
  isLoadingQuote: boolean;
  couponError: string | null;
  onApplyCoupon: (coupon: string) => void;
  selectedWallet: string;
  setSelectedWallet: (wallet: string) => void;
  isSubmitting: boolean;
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
}: CartSummaryProps) {
  const [couponInput, setCouponInput] = useState("");
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  // 1. Calcula o subtotal direto dos itens do carrinho para comparar com a cotação
  const currentCartSubtotal = cartItems.reduce(
    (acc, item) => acc + parseFloat(item.price || "0") * item.quantity,
    0,
  );

  // 2. Deteta se a cotação está desincronizada com o valor atual do carrinho
  const isQuoteStale =
    !!quote && Math.abs(currentCartSubtotal - quote.subtotal) > 0.0001;

  // 3. Trava de segurança para desativar a compra com cotação inválida/desatualizada
  const isButtonDisabled =
    isSubmitting ||
    isLoadingQuote ||
    isQuoteStale ||
    !quote ||
    cartItems.length === 0;

  return (
    <div className="lg:col-span-5 space-y-6">
      <div className="p-6 bg-secondary/30 border border-border rounded-xl space-y-6">
        <h3 className="font-bold text-foreground font-mono text-base">
          Seus NFTs
        </h3>

        {/* ALERTA DE COTAÇÃO DESATUALIZADA / ALTERAÇÃO DE PREÇO */}
        {(isLoadingQuote || isQuoteStale) && (
          <div
            role="alert"
            aria-live="polite"
            className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-500 text-xs font-mono flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4 shrink-0 animate-pulse" />
            <span>
              {isLoadingQuote
                ? "A recalcular a cotação em tempo real..."
                : "O preço de um NFT mudou! A atualizar valores..."}
            </span>
          </div>
        )}

        {/* LISTA DE ITENS NO CARRINHO */}
        <div
          role="region"
          aria-label="Itens selecionados para compra"
          className="space-y-4 max-h-64 overflow-y-auto pr-2"
        >
          {cartItems?.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b border-border/40 pb-3 text-xs font-mono"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-secondary overflow-hidden shrink-0 relative">
                  {!loadedImages[item.id] && (
                    <Skeleton className="absolute inset-0 w-full h-full" />
                  )}
                  <img
                    src={item.image}
                    alt={`Thumbnail da NFT ${item.name}`}
                    onLoad={() => handleImageLoad(item.id)}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                      loadedImages[item.id] ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </div>
                <div>
                  <p className="font-bold text-foreground">
                    {item.name} #{item.id}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Qtde: {item.quantity}
                  </p>
                </div>
              </div>
              <span className="font-bold text-primary">
                {(parseFloat(item.price) * item.quantity).toFixed(2)} ETH
              </span>
            </div>
          ))}
        </div>

        {/* CUPÃO DE DESCONTO */}
        <div className="space-y-2">
          <label
            htmlFor="checkout-coupon-input"
            className="text-xs font-mono text-muted-foreground block"
          >
            Cupom promocional
          </label>
          <div className="flex gap-2">
            <input
              id="checkout-coupon-input"
              type="text"
              placeholder="Código promocional (ex: KURIO20)"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-xs text-foreground font-mono focus:outline-none focus-visible:ring-2 focus-visible:ring-primary uppercase"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => onApplyCoupon(couponInput)}
              disabled={isLoadingQuote || !couponInput}
              className="text-xs font-bold focus-visible:ring-2 focus-visible:ring-primary"
            >
              Aplicar
            </Button>
          </div>
          {couponError && (
            <p role="alert" className="text-[10px] text-red-500 font-mono">
              {couponError}
            </p>
          )}
          {quote?.validCoupon && (
            <p role="status" className="text-[10px] text-primary font-mono">
              Cupão {quote.validCoupon} aplicado com sucesso!
            </p>
          )}
        </div>

        {/* VALORES DINÂMICOS DA COTAÇÃO (COM SKELETONS) */}
        <div
          aria-live="polite"
          className="space-y-2 text-xs font-mono border-t border-border/50 pt-4 text-muted-foreground"
        >
          <div className="flex justify-between items-center">
            <span>Subtotal</span>
            {isLoadingQuote ? (
              <Skeleton className="h-4 w-16" />
            ) : (
              <span className="text-foreground font-bold">
                {quote?.subtotal.toFixed(2) || "0.00"} ETH
              </span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <span>Desconto</span>
            {isLoadingQuote ? (
              <Skeleton className="h-4 w-16" />
            ) : (
              <span className="text-primary font-bold">
                {quote && quote.discount > 0
                  ? `(-) ${quote.discount.toFixed(2)} ETH`
                  : "0.00 ETH"}
              </span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <span>Taxa de rede</span>
            {isLoadingQuote ? (
              <Skeleton className="h-4 w-16" />
            ) : (
              <span className="text-foreground">
                {quote?.networkFee.toFixed(3) || "0.000"} ETH
              </span>
            )}
          </div>
        </div>

        {/* TOTAL GERAL */}
        <div className="border-t border-border pt-4 flex justify-between items-center font-mono">
          <span className="font-bold text-foreground">Total</span>
          {isLoadingQuote ? (
            <Skeleton className="h-6 w-24" />
          ) : (
            <span
              aria-label={`Valor total: ${quote?.total.toFixed(3) || "0.000"} ETH`}
              className="text-lg font-bold text-primary"
            >
              {`${quote?.total.toFixed(3) || "0.000"} ETH`}
            </span>
          )}
        </div>

        {/* SELEÇÃO DE CARTEIRA (SELETOR ACESSÍVEL) */}
        <div
          role="radiogroup"
          aria-label="Carteira para recebimento da NFT"
          className="space-y-3 pt-2"
        >
          <span className="text-xs font-mono text-muted-foreground block">
            Carteira para recebimento
          </span>
          {["MetaMask", "WalletConnect", "Coinbase Wallet"].map((wallet) => (
            <button
              type="button"
              key={wallet}
              role="radio"
              aria-checked={selectedWallet === wallet}
              onClick={() => setSelectedWallet(wallet)}
              className={`w-full p-3 rounded-lg border text-left font-mono text-xs flex items-center justify-between transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                selectedWallet === wallet
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{wallet}</span>
              <span className="w-3 h-3 rounded-full border border-primary flex items-center justify-center">
                {selectedWallet === wallet && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                )}
              </span>
            </button>
          ))}
        </div>

        {/* BOTÃO DE CONFIRMAÇÃO */}
        <Button
          type="submit"
          disabled={isButtonDisabled}
          aria-busy={isSubmitting || isLoadingQuote}
          aria-label="Confirmar e finalizar compra de NFTs"
          className="w-full py-6 font-bold bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          {(isSubmitting || isLoadingQuote) && (
            <Loader2 className="w-4 h-4 animate-spin" />
          )}
          {isLoadingQuote || isQuoteStale
            ? "A recalcular cotação..."
            : "Confirmar compra"}
        </Button>
      </div>
    </div>
  );
}
