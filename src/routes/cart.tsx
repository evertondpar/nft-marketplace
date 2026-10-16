import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { CartItem } from "@/types";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

function CartPage() {
  const { data: cartItems, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await api.get("/cart");
      return res.data.items;
    },
  });

  if (isLoading)
    return (
      <div className="container mx-auto px-8 py-12 text-primary font-mono animate-pulse">
        A carregar carrinho...
      </div>
    );

  // Cálculo financeiro simples baseado no Figma
  const subtotal =
    cartItems?.reduce(
      (acc: number, item: CartItem) =>
        acc + parseFloat(item.price) * item.quantity,
      0,
    ) || 0;
  const networkFee = 0.016; // Taxa fixa vista no Figma
  const total = subtotal + networkFee;

  return (
    <main className="flex-1 container mx-auto px-4 md:px-8 py-12">
      <div className="text-sm font-mono text-muted-foreground mb-8">
        Início / Mercado / <span className="text-foreground">Carrinho</span>
      </div>

      <h1 className="text-3xl font-bold text-foreground mb-8">
        Carrinho de NFTs
      </h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Tabela de Produtos (Esquerda) */}
        <div className="flex-1 overflow-x-auto">
          <div className="min-w-[600px] border border-border rounded-xl bg-secondary/20 overflow-hidden">
            <div className="grid grid-cols-12 bg-secondary/50 p-4 text-xs font-mono text-muted-foreground uppercase border-b border-border">
              <div className="col-span-6">NFTs</div>
              <div className="col-span-2 text-center">Preço</div>
              <div className="col-span-2 text-center">Edições</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {cartItems?.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground font-mono">
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
                    className="grid grid-cols-12 items-center p-4 border-b border-border/50 last:border-none text-sm font-mono"
                  >
                    <div className="col-span-6 flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-bold text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          ID do token: #{item.id}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-2 text-center text-primary">
                      {item.price} ETH
                    </div>
                    <div className="col-span-2 flex items-center justify-center gap-2">
                      <button className="w-6 h-6 rounded bg-background border border-border text-primary font-bold">
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button className="w-6 h-6 rounded bg-background border border-border text-primary font-bold">
                        +
                      </button>
                    </div>
                    <div className="col-span-2 text-right font-bold text-foreground flex items-center justify-end gap-3">
                      <span>{itemTotal} ETH</span>
                      <button className="text-muted-foreground hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Resumo da Carteira (Direita - Fiel ao Figma) */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="p-6 bg-secondary/30 border border-border rounded-xl space-y-6">
            <h3 className="font-bold text-foreground font-mono">
              Resumo da carteira
            </h3>

            <div>
              <label className="text-xs font-mono text-muted-foreground block mb-2">
                Código promocional
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Digite o código..."
                  className="flex-1 bg-background border border-border rounded px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-primary/20 text-primary hover:bg-primary/30 text-xs"
                >
                  Aplicar
                </Button>
              </div>
            </div>

            <div className="space-y-3 text-xs font-mono border-t border-border/50 pt-4 text-muted-foreground">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-foreground">
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

            <div className="border-t border-border pt-4 flex justify-between items-center font-mono">
              <span className="font-bold text-foreground">Total</span>
              <span className="text-lg font-bold text-primary">
                {total.toFixed(3)} ETH
              </span>
            </div>

            <Link to="/checkout" className="block w-full">
              <Button className="w-full py-6 font-bold bg-primary text-primary-foreground hover:bg-primary/90">
                Conectar e finalizar
              </Button>
            </Link>

            <div className="text-center">
              <Link
                to="/"
                className="text-xs font-mono text-muted-foreground hover:text-foreground underline"
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
