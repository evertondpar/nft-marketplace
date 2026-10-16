import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="w-full bg-secondary/30 pt-16 pb-8 border-t border-border mt-20">
      <div className="container mx-auto px-4 md:px-8">
        {/* Topo do Rodapé: Benefícios e Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 border-b border-border/50 pb-12">
          {/* Benefício 1 */}
          <div>
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl mb-4">
              W
            </div>
            <h4 className="font-bold text-foreground mb-2">
              Segurança da carteira
            </h4>
            <p className="text-sm text-muted-foreground">
              Proteja sua carteira e colecione arte digital verificada com
              confiança.
            </p>
          </div>

          {/* Benefício 2 */}
          <div>
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl mb-4">
              C
            </div>
            <h4 className="font-bold text-foreground mb-2">
              Criadores em destaque
            </h4>
            <p className="text-sm text-muted-foreground">
              Conheça artistas, estúdios e comunidades que moldam a cultura
              digital na rede.
            </p>
          </div>

          {/* Benefício 3 */}
          <div>
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl mb-4">
              D
            </div>
            <h4 className="font-bold text-foreground mb-2">
              Alertas de lançamentos
            </h4>
            <p className="text-sm text-muted-foreground">
              Receba calendários de cunhagem, novidades de listas de acesso e
              análises do mercado.
            </p>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-foreground mb-4">
              Antecipe-se ao próximo lançamento
            </h4>
            <div className="flex gap-2 mb-4">
              <input
                type="email"
                placeholder="digite seu e-mail..."
                className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              />
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Enviar
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Receba lançamentos selecionados, histórias de criadores e
              novidades do mercado.
            </p>
          </div>
        </div>

        {/* Links do Rodapé */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-bold text-foreground mb-4">Meu perfil</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-primary cursor-pointer">Meu perfil</li>
              <li className="hover:text-primary cursor-pointer">
                Minha coleção
              </li>
              <li className="hover:text-primary cursor-pointer">Atividade</li>
              <li className="hover:text-primary cursor-pointer">
                Estúdio do criador
              </li>
              <li className="hover:text-primary cursor-pointer">
                Lista de interesse
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-4">Central de ajuda</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-primary cursor-pointer">
                Central de ajuda
              </li>
              <li className="hover:text-primary cursor-pointer">
                Como comprar NFTs
              </li>
              <li className="hover:text-primary cursor-pointer">
                Carteira e segurança
              </li>
              <li className="hover:text-primary cursor-pointer">
                Política do mercado
              </li>
              <li className="hover:text-primary cursor-pointer">
                Denunciar item
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-4">Coleções</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-primary cursor-pointer">
                Arte digital
              </li>
              <li className="hover:text-primary cursor-pointer">Fotografia</li>
              <li className="hover:text-primary cursor-pointer">Música</li>
              <li className="hover:text-primary cursor-pointer">Arte 3D</li>
              <li className="hover:text-primary cursor-pointer">Utilidade</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-4">Redes sociais</h4>
            <div className="flex gap-4 mb-8">
              <div className="w-8 h-8 border border-border rounded flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary cursor-pointer">
                f
              </div>
              <div className="w-8 h-8 border border-border rounded flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary cursor-pointer">
                ig
              </div>
              <div className="w-8 h-8 border border-border rounded flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary cursor-pointer">
                in
              </div>
              <div className="w-8 h-8 border border-border rounded flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary cursor-pointer">
                yt
              </div>
            </div>
            <h4 className="font-bold text-foreground mb-4">
              Carteiras compatíveis
            </h4>
            <div className="text-[10px] uppercase font-mono text-primary flex gap-2 border border-primary/30 p-2 rounded inline-flex">
              <span>Metamask</span> • <span>Walletconnect</span> •{" "}
              <span>Coinbase</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs text-muted-foreground pt-8 border-t border-border/50">
          © 2026 Kurio. Propriedade digital para todos.
        </div>
      </div>
    </footer>
  );
}
