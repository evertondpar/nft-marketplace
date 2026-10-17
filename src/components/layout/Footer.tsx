import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

const benefits = [
  {
    letter: "W",
    title: "Segurança da carteira",
    text: "Proteja sua carteira e colecione arte digital verificada com confiança.",
  },
  {
    letter: "C",
    title: "Criadores em destaque",
    text: "Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.",
  },
  {
    letter: "D",
    title: "Alertas de lançamentos",
    text: "Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.",
  },
];

const linkColumns = [
  {
    title: "Meu perfil",
    links: [
      "Meu perfil",
      "Minha coleção",
      "Atividade",
      "Estúdio do criador",
      "Lista de interesse",
    ],
  },
  {
    title: "Central de ajuda",
    links: [
      "Central de ajuda",
      "Como comprar NFTs",
      "Carteira e segurança",
      "Política do mercado",
      "Denunciar item",
    ],
  },
  {
    title: "Coleções",
    links: ["Arte digital", "Fotografia", "Música", "Arte 3D", "Utilidade"],
  },
];

const socials = [
  { label: "Facebook", Icon: Phone },
  { label: "Instagram", Icon: Phone },
  { label: "Twitter", Icon: Phone },
  { label: "LinkedIn", Icon: Phone },
  { label: "YouTube", Icon: Phone },
];

/* Colunas alinhadas às do Figma (topo: 297/266/266/resto · demais: 303 ×3) */
const TOP_COLS = "lg:grid-cols-[297px_266px_266px_minmax(0,1fr)]";
const ROW_COLS = "lg:grid-cols-[303px_303px_303px_minmax(0,1fr)]";

export function Footer() {
  return (
    <footer className="mt-24 w-full font-mono">
      <div className="mx-auto w-full max-w-[1248px] px-6 pb-7">
        <div className="bg-secondary">
          {/* ========== Topo: benefícios + newsletter ========== */}
          <div
            className={`grid grid-cols-1 gap-8 px-6 pb-4 pt-8 md:grid-cols-2 lg:gap-0 lg:px-0 ${TOP_COLS}`}
          >
            {benefits.map((item, i) => (
              <div
                key={item.title}
                className={`lg:pr-6 ${
                  i === 0
                    ? "lg:pl-12"
                    : "lg:border-l lg:border-primary/70 lg:pl-[17px]"
                }`}
              >
                <div
                  aria-hidden="true"
                  className="flex h-[74px] w-[74px] items-center justify-center rounded-full bg-primary text-[26px] font-bold text-primary-foreground"
                >
                  {item.letter}
                </div>
                <h4 className="mt-2.5 text-[17px] font-bold leading-6 text-foreground">
                  {item.title}
                </h4>
                <p className="mt-1.5 max-w-[200px] text-sm leading-[22px] text-muted-foreground">
                  {item.text}
                </p>
              </div>
            ))}

            {/* Newsletter */}
            <div className="lg:border-l lg:border-primary/70 lg:pl-4">
              <h4 className="text-[17px] font-bold leading-4 text-foreground">
                Antecipe-se ao próximo lançamento
              </h4>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="mt-4 flex max-w-[325px]"
              >
                <input
                  type="email"
                  aria-label="E-mail para receber lançamentos"
                  placeholder="digite seu e-mail..."
                  className="h-10 min-w-0 flex-1 rounded-l-sm bg-primary/10 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
                <Button
                  type="submit"
                  className="h-10 w-[85px] rounded-l-none rounded-r-sm bg-primary font-mono text-lg font-bold text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Enviar
                </Button>
              </form>
              <p className="mt-3 max-w-[300px] text-[13px] leading-[22px] text-muted-foreground">
                Receba lançamentos selecionados, histórias de criadores e
                novidades do mercado.
              </p>
            </div>
          </div>

          {/* ========== Faixa de contato ========== */}
          <div
            className={`grid grid-cols-1 items-center gap-3 bg-primary/15 px-6 py-5 text-sm leading-[22px] text-foreground sm:grid-cols-2 lg:min-h-[87px] lg:gap-0 lg:py-0 lg:pl-8 lg:pr-0 ${ROW_COLS}`}
          >
            <span className="font-bold tracking-widest">KURIO</span>
            <p className="max-w-[240px]">
              Feito para colecionadores, criadores e cultura
            </p>
            <a
              href="mailto:contato@email.com"
              className="rounded hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              contato@email.com
            </a>
            <a
              href="tel:+551140028922"
              className="rounded hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              +55 11 4002 8922
            </a>
          </div>

          {/* ========== Links ========== */}
          <nav
            aria-label="Links do rodapé"
            className={`grid grid-cols-1 gap-8 px-6 py-[30px] sm:grid-cols-2 lg:gap-0 lg:pl-8 lg:pr-0 ${ROW_COLS}`}
          >
            {linkColumns.map((col) => (
              <div key={col.title}>
                <h4 className="text-lg font-bold leading-6 text-foreground">
                  {col.title}
                </h4>
                <ul className="mt-0.5 text-sm text-foreground">
                  {col.links.map((link) => (
                    <li
                      key={link}
                      className="cursor-pointer leading-[30px] transition-colors hover:text-primary"
                    >
                      {link}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h4 className="text-lg font-bold leading-6 text-foreground">
                Redes sociais
              </h4>
              <div className="mt-3.5 flex gap-2">
                {socials.map(({ label, Icon }) => (
                  <button
                    key={label}
                    type="button"
                    aria-label={label}
                    className="flex h-8 w-8 items-center justify-center rounded-sm border border-primary text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </button>
                ))}
              </div>

              <h4 className="mt-7 text-lg font-bold leading-6 text-foreground">
                Carteiras compatíveis
              </h4>
              <div className="mt-2 inline-flex h-6 items-center gap-2 rounded-sm border border-primary/30 bg-primary/10 px-2.5 text-[9px] font-bold uppercase text-primary">
                <span>Metamask</span>
                <span aria-hidden="true">•</span>
                <span>Walletconnect</span>
                <span aria-hidden="true">•</span>
                <span>Coinbase</span>
              </div>
            </div>
          </nav>
        </div>

        {/* Copyright */}
        <p className="mt-2.5 text-center text-sm leading-6 text-foreground">
          © 2026 Kurio. Propriedade digital para todos.
        </p>
      </div>
    </footer>
  );
}
