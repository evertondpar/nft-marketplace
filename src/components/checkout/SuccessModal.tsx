import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { X, ExternalLink } from "lucide-react";
import type { CartItem } from "@/types";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  total: number;
  networkFee: number;
  selectedWallet: string;
}

export function SuccessModal({
  isOpen,
  onClose,
  cartItems,
  total,
  networkFee,
  selectedWallet,
}: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-secondary border border-border rounded-2xl p-8 shadow-2xl space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary flex items-center justify-center mx-auto text-primary font-mono font-bold text-xs">
            ✓
          </div>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            Seus NFTs agora estão na sua carteira
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2 py-4 border-y border-border/50 text-center font-mono text-[11px]">
          <div>
            <span className="text-muted-foreground block text-[9px] uppercase">
              ID da transação
            </span>
            <span className="text-primary font-bold">0xA91F..E82C</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[9px] uppercase">
              Data
            </span>
            <span className="text-foreground">29 Jul, 2026</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[9px] uppercase">
              Total
            </span>
            <span className="text-primary font-bold">
              {total.toFixed(3)} ETH
            </span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[9px] uppercase">
              Carteira
            </span>
            <span className="text-foreground">{selectedWallet}</span>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-mono text-muted-foreground uppercase">
            Detalhes da transação
          </p>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {cartItems?.map((item: CartItem) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-xs font-mono border-b border-border/30 pb-2"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-8 h-8 rounded object-cover"
                  />
                  <div>
                    <p className="font-bold text-foreground">
                      {item.name} #{item.id}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      ID do token: #{item.id}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-muted-foreground text-[10px] block">
                    (x {item.quantity})
                  </span>
                  <span className="font-bold text-primary">
                    {(parseFloat(item.price) * item.quantity).toFixed(2)} ETH
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center text-xs font-mono border-t border-border/50 pt-3">
          <span className="text-muted-foreground">Taxa de rede</span>
          <span className="text-foreground">{networkFee} ETH</span>
        </div>
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="font-bold text-foreground">Total</span>
          <span className="font-bold text-primary text-sm">
            {total.toFixed(3)} ETH
          </span>
        </div>

        <p className="text-[11px] font-mono text-muted-foreground text-center leading-relaxed">
          Transação confirmada na Ethereum. A propriedade foi transferida para
          sua carteira conectada e registrada na rede.
        </p>

        <div className="pt-2">
          <Link to="/">
            <Button className="w-full bg-primary text-primary-foreground font-bold py-6 flex items-center justify-center gap-2">
              Ver no Etherscan <ExternalLink className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
