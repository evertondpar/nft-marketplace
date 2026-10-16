import type { HomeSearch, NFTItem } from "@/types";
import { NFTCard } from "../nft/NFTCard";
import { Button } from "../ui/button";
import { useNavigate } from "@tanstack/react-router";

interface NFTGridSectionProps {
  data: NFTItem[] | undefined;
  totalPages: number | undefined;
  currentPage: number | undefined;
  currentParams: HomeSearch;
  isLoading: boolean;
  isError: boolean;
}

export default function SidebarFilters({
  isLoading,
  isError,
  data,
  currentParams,
  currentPage,
  totalPages,
}: NFTGridSectionProps) {
  const navigate = useNavigate({ from: "/" });
  const updateFilter = (newFilters: Partial<HomeSearch>) => {
    navigate({
      search: (prev) => ({
        ...prev,
        ...newFilters,
        page: 1, // Reinicia a paginação ao filtrar
      }),
    });
  };

  const collections = [
    { id: "Arte digital", count: 33 },
    { id: "Fotografia", count: 12 },
    { id: "Música", count: 65 },
    { id: "Arte 3D", count: 39 },
    { id: "Colecionáveis", count: 23 },
    { id: "Generativa", count: 17 },
    { id: "Jogos", count: 19 },
    { id: "Assinaturas", count: 13 },
    { id: "Utilidade", count: 18 },
  ];

  const networks = [
    { id: "Ethereum", count: 119 },
    { id: "Polygon", count: 78 },
    { id: "Solana", count: 86 },
  ];

  const updateTab = (tab: HomeSearch["tab"]) => {
    navigate({ search: (prev) => ({ ...prev, tab, page: 1 }) });
  };

  const updateSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    navigate({
      search: (prev) => ({
        ...prev,
        sort: e.target.value as HomeSearch["sort"],
        page: 1,
      }),
    });
  };

  const updatePage = (page: number) => {
    navigate({ search: (prev) => ({ ...prev, page }) });
  };

  return (
    <section className="flex flex-col lg:flex-row gap-12">
      {/* SIDEBAR (Esquerda) - Oculta em ecrãs pequenos */}
      <aside className="hidden lg:flex w-64 flex-col space-y-10 shrink-0">
        <div>
          <h3 className="font-bold text-foreground mb-5 text-sm">Coleções</h3>
          <ul className="space-y-4 text-sm text-muted-foreground font-mono">
            {collections.map((col) => (
              <li
                key={col.id}
                onClick={() =>
                  updateFilter({
                    collection:
                      currentParams.collection === col.id ? undefined : col.id,
                  })
                }
                className={`flex justify-between cursor-pointer transition-colors ${
                  currentParams.collection === col.id
                    ? "text-primary font-bold"
                    : "hover:text-primary"
                }`}
              >
                <span>{col.id}</span> <span>({col.count})</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-foreground mb-5 text-sm">
            Faixa de preço
          </h3>
          {/* Componente visual do slider simplificado */}
          <div className="h-1 w-full bg-muted rounded-full mb-5 relative">
            <div className="absolute left-0 w-2/3 h-full bg-primary rounded-full"></div>
            <div className="absolute left-0 -top-1.5 h-4 w-4 bg-primary rounded-full border-2 border-background"></div>
            <div className="absolute left-2/3 -top-1.5 h-4 w-4 bg-primary rounded-full border-2 border-background"></div>
          </div>
          <p className="text-[11px] font-mono text-muted-foreground mb-4 uppercase">
            Preço: {currentParams.minPrice || 0} -{" "}
            {currentParams.maxPrice || 12.3} ETH
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => updateFilter({ minPrice: 0.02, maxPrice: 12.3 })}
            className="bg-primary/20 text-primary hover:bg-primary/30 w-24 text-xs font-bold"
          >
            Aplicar
          </Button>
        </div>

        <div>
          <h3 className="font-bold text-foreground mb-5 text-sm">Rede</h3>
          <ul className="space-y-4 text-sm text-muted-foreground font-mono">
            {networks.map((net) => (
              <li
                key={net.id}
                onClick={() =>
                  updateFilter({
                    network:
                      currentParams.network === net.id ? undefined : net.id,
                  })
                }
                className={`flex justify-between cursor-pointer transition-colors ${
                  currentParams.network === net.id
                    ? "text-primary font-bold"
                    : "hover:text-primary"
                }`}
              >
                <span>{net.id}</span> <span>({net.count})</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL (Direita) */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Abas e Ordenação */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-border/50 pb-4">
          <div className="flex space-x-6 text-sm font-medium">
            <button
              onClick={() => updateTab("all")}
              className={`pb-4 -mb-[18px] transition-colors ${currentParams.tab === "all" || !currentParams.tab ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              Todos os NFTs
            </button>
            <button
              onClick={() => updateTab("new")}
              className={`pb-4 -mb-[18px] transition-colors ${currentParams.tab === "new" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              Novos lançamentos
            </button>
            <button
              onClick={() => updateTab("trending")}
              className={`pb-4 -mb-[18px] transition-colors ${currentParams.tab === "trending" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              Em alta
            </button>
          </div>

          <div className="text-[11px] text-muted-foreground font-mono uppercase flex items-center gap-2">
            Ordenar por:
            <select
              value={currentParams.sort || "recent"}
              onChange={updateSort}
              className="bg-transparent border-none text-foreground focus:ring-0 cursor-pointer"
            >
              <option value="recent">Listados recentemente</option>
              <option value="price_asc">Menor preço</option>
              <option value="price_desc">Maior preço</option>
            </select>
          </div>
        </div>

        {/* Estados de Carregamento e Grid */}
        {isLoading && (
          <div className="text-primary font-mono animate-pulse py-10">
            A carregar catálogo...
          </div>
        )}
        {isError && (
          <div className="text-red-500 py-10">Erro ao carregar o catálogo.</div>
        )}

        {!isLoading && !isError && data?.length === 0 && (
          <div className="text-muted-foreground font-mono py-10">
            Nenhum NFT encontrado com estes filtros.
          </div>
        )}

        {data && data.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {data.map((nft) => (
              <NFTCard key={nft.id} {...nft} />
            ))}
          </div>
        )}

        {/* Paginação */}
        {totalPages && totalPages > 1 && (
          <div className="mt-12 flex justify-end gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => updatePage(page)}
                className={`w-8 h-8 p-0 ${currentPage === page ? "bg-primary text-primary-foreground border-none" : "border-border text-muted-foreground hover:text-foreground"}`}
              >
                {page}
              </Button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
