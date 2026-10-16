import { Button } from "@/components/ui/button";
import type { CartItem } from "@/types";

interface CartSummaryProps {
  cartItems: CartItem[];
  subtotal: number;
  networkFee: number;
  total: number;
  selectedWallet: string;
  setSelectedWallet: (wallet: string) => void;
}

export function CartSummary({
  cartItems,
  subtotal,
  networkFee,
  total,
  selectedWallet,
  setSelectedWallet,
}: CartSummaryProps) {
  return (
    <div className="lg:col-span-5 space-y-6">
      <div className="p-6 bg-secondary/30 border border-border rounded-xl space-y-6">
        <h3 className="font-bold text-foreground font-mono">Seus NFTs</h3>

        <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
          {cartItems?.map((item: CartItem) => (
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
                    ID do token: #{item.id} (x {item.quantity})
                  </p>
                </div>
              </div>
              <span className="font-bold text-primary">
                {(parseFloat(item.price) * item.quantity).toFixed(2)} ETH
              </span>
            </div>
          ))}
        </div>

        <div className="text-xs text-muted-foreground font-mono">
          Tem um código promocional? Aplique aqui
        </div>

        <div className="space-y-2 text-xs font-mono border-t border-border/50 pt-4 text-muted-foreground">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="text-foreground">{subtotal.toFixed(2)} ETH</span>
          </div>
          <div className="flex justify-between">
            <span>Desconto do lançamento</span>
            <span className="text-foreground">(-) 00.00 ETH</span>
          </div>
          <div className="flex justify-between">
            <span>
              Taxa de rede{" "}
              <span className="text-[9px] block text-muted-foreground">
                Taxa estimada
              </span>
            </span>
            <span className="text-foreground">{networkFee} ETH</span>
          </div>
        </div>

        <div className="border-t border-border pt-4 flex justify-between items-center font-mono">
          <span className="font-bold text-foreground">Total</span>
          <span className="text-lg font-bold text-primary">
            {total.toFixed(3)} ETH
          </span>
        </div>

        <div className="space-y-3 pt-2">
          <span className="text-xs font-mono text-muted-foreground block">
            Carteira e rede
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
          className="w-full py-6 font-bold bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Confirmar compra
        </Button>
      </div>
    </div>
  );
}
