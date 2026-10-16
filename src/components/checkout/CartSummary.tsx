import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { CartItem, Quote } from "@/types";

interface CartSummaryProps {
  cartItems: CartItem[];
  quote: Quote;
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
  return (
    <div className="lg:col-span-5 space-y-6">
      <div className="p-6 bg-secondary/30 border border-border rounded-xl space-y-6">
        <h3 className="font-bold text-foreground font-mono">Seus NFTs</h3>

        <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
          {cartItems?.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b border-border/40 pb-3 text-xs font-mono"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-10 h-10 rounded object-cover"
                />
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

        {/* CUPOM DE DESCONTO */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Código promocional (ex: KURIO20)"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-xs text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary uppercase"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => onApplyCoupon(couponInput)}
              disabled={isLoadingQuote || !couponInput}
              className="text-xs font-bold"
            >
              Aplicar
            </Button>
          </div>
          {couponError && (
            <p className="text-[10px] text-red-500 font-mono">{couponError}</p>
          )}
          {quote?.validCoupon && (
            <p className="text-[10px] text-primary font-mono">
              Cupom {quote.validCoupon} aplicado com sucesso!
            </p>
          )}
        </div>

        {/* VALORES DINÂMICOS (VINDOS DA API) */}
        <div className="space-y-2 text-xs font-mono border-t border-border/50 pt-4 text-muted-foreground">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="text-foreground">
              {quote?.subtotal.toFixed(2) || "0.00"} ETH
            </span>
          </div>
          <div className="flex justify-between">
            <span>Desconto</span>
            <span className="text-primary">
              {quote?.discount > 0
                ? `(-) ${quote.discount.toFixed(2)} ETH`
                : "0.00 ETH"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Taxa de rede</span>
            <span className="text-foreground">
              {quote?.networkFee.toFixed(3) || "0.000"} ETH
            </span>
          </div>
        </div>

        <div className="border-t border-border pt-4 flex justify-between items-center font-mono">
          <span className="font-bold text-foreground">Total</span>
          <span className="text-lg font-bold text-primary">
            {isLoadingQuote
              ? "Calculando..."
              : `${quote?.total.toFixed(3) || "0.000"} ETH`}
          </span>
        </div>

        <div className="space-y-3 pt-2">
          <span className="text-xs font-mono text-muted-foreground block">
            Carteira para recebimento
          </span>
          {["MetaMask", "WalletConnect", "Coinbase Wallet"].map((wallet) => (
            <button
              type="button"
              key={wallet}
              onClick={() => setSelectedWallet(wallet)}
              className={`w-full p-3 rounded-lg border text-left font-mono text-xs flex items-center justify-between ${
                selectedWallet === wallet
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-background text-muted-foreground"
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

        <Button
          type="submit"
          disabled={isSubmitting || isLoadingQuote || cartItems?.length === 0}
          className="w-full py-6 font-bold bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Confirmar compra
        </Button>
      </div>
    </div>
  );
}
