import type { HomeSearch, NFTItem } from "@/types";
import { NFTCard } from "../nft/NFTCard";
import { Button } from "../ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { ChevronDown, ChevronRight } from "lucide-react";

interface SidebarFiltersProps {
  data: NFTItem[] | undefined;
  totalPages: number | undefined;
  currentPage: number | undefined;
  currentParams: HomeSearch;
  isLoading: boolean;
  isError: boolean;
  featuredImage?: string;
}

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

const DEFAULT_MIN = 0.02;
const DEFAULT_MAX = 12.3;

const formatEth = (value: number) =>
  value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function SidebarFilters({
  isLoading,
  isError,
  data,
  currentParams,
  currentPage,
  totalPages,
  featuredImage = "/monkey3.png",
}: SidebarFiltersProps) {
  const navigate = useNavigate({ from: "/" });

  const updateFilter = (newFilters: Partial<HomeSearch>) => {
    navigate({ search: (prev) => ({ ...prev, ...newFilters, page: 1 }) });
  };

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

  const handleKeyDownFilter = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action();
    }
  };

  const activeTab = currentParams.tab ?? "all";
  const tabs: { id: NonNullable<HomeSearch["tab"]>; label: string }[] = [
    { id: "all", label: "Todos os NFTs" },
    { id: "new", label: "Novos lançamentos" },
    { id: "trending", label: "Em alta" },
  ];

  const hasPagination = (totalPages ?? 0) > 1;

  const filterItemClass = (isSelected: boolean, tone: "primary" | "muted") =>
    `flex justify-between cursor-pointer transition-colors rounded px-3 py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
      isSelected
        ? "bg-primary/15 text-primary font-bold"
        : tone === "primary"
          ? "text-primary/90 hover:text-primary"
          : "text-muted-foreground hover:text-primary"
    }`;

  return (
    <section
      aria-label="Catálogo e Filtros de NFTs"
      className="flex flex-col lg:flex-row gap-12"
    >
      {/* SIDEBAR (Esquerda) */}
      <aside
        className="hidden lg:flex w-[310px] flex-col gap-6 shrink-0"
        aria-label="Filtros laterais"
      >
        {/* Painel de filtros */}
        <div className="bg-secondary rounded-md p-5 space-y-10 font-mono">
          <div>
            <h3
              className="font-bold text-foreground mb-5 text-lg"
              id="collection-filter-heading"
            >
              Coleções
            </h3>
            <ul
              className="space-y-4 text-sm"
              aria-labelledby="collection-filter-heading"
            >
              {collections.map((col) => {
                const isSelected = currentParams.collection === col.id;
                const action = () =>
                  updateFilter({ collection: isSelected ? undefined : col.id });
                return (
                  <li
                    key={col.id}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    onClick={action}
                    onKeyDown={(e) => handleKeyDownFilter(e, action)}
                    className={filterItemClass(isSelected, "primary")}
                  >
                    <span>{col.id}</span>
                    <span className="font-bold">({col.count})</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3
              className="font-bold text-foreground mb-5 text-lg"
              id="price-filter-heading"
            >
              Faixa de preço
            </h3>
            {/* Slider visual: trilho cheio com dois marcadores */}
            <div
              className="h-1 w-full bg-primary rounded-full mb-5 relative"
              aria-hidden="true"
            >
              <div className="absolute left-[3%] -top-1.5 h-4 w-4 -translate-x-1/2 bg-primary rounded-full border-2 border-background" />
              <div className="absolute left-[71%] -top-1.5 h-4 w-4 -translate-x-1/2 bg-primary rounded-full border-2 border-background" />
            </div>
            <p
              className="text-xs text-muted-foreground mb-4"
              aria-labelledby="price-filter-heading"
            >
              Preço: {formatEth(currentParams.minPrice ?? DEFAULT_MIN)} -{" "}
              {formatEth(currentParams.maxPrice ?? DEFAULT_MAX)} ETH
            </p>
            <Button
              size="sm"
              onClick={() =>
                updateFilter({ minPrice: DEFAULT_MIN, maxPrice: DEFAULT_MAX })
              }
              className="h-8 w-24 rounded-sm bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold focus-visible:ring-2 focus-visible:ring-primary"
            >
              Aplicar
            </Button>
          </div>

          <div>
            <h3
              className="font-bold text-foreground mb-5 text-lg"
              id="network-filter-heading"
            >
              Rede
            </h3>
            <ul
              className="space-y-4 text-sm"
              aria-labelledby="network-filter-heading"
            >
              {networks.map((net) => {
                const isSelected = currentParams.network === net.id;
                const action = () =>
                  updateFilter({ network: isSelected ? undefined : net.id });
                return (
                  <li
                    key={net.id}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    onClick={action}
                    onKeyDown={(e) => handleKeyDownFilter(e, action)}
                    className={filterItemClass(isSelected, "muted")}
                  >
                    <span>{net.id}</span>
                    <span>({net.count})</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* NFT em destaque */}
        <div className="rounded-md overflow-hidden bg-secondary font-mono">
          <div className="px-5 pt-5 pb-4">
            <h3 className="text-primary font-bold text-2xl leading-tight">
              NFT EM DESTAQUE
            </h3>
            <p className="text-foreground font-bold text-xl text-center mt-3">
              OFERTA LIMITADA
            </p>
          </div>
          <img
            src={featuredImage}
            alt="NFT em destaque - oferta limitada"
            className="w-full aspect-[218/257] object-cover rounded-2xl"
          />
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL (Direita) */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Abas e Ordenação */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 lg:mb-8 gap-4 font-mono">
          <div
            role="tablist"
            aria-label="Categorias do Catálogo"
            className="flex w-full sm:w-auto gap-x-4 sm:gap-x-6 text-[15px] sm:text-sm overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => updateTab(tab.id)}
                  className={`shrink-0 pb-1 border-b-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-t ${
                    isActive
                      ? "text-primary border-primary"
                      : "text-foreground border-transparent hover:text-primary"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="hidden sm:flex text-sm text-foreground items-center gap-2">
            <label htmlFor="sort-select">Ordenar por:</label>
            <div className="relative">
              <select
                id="sort-select"
                value={currentParams.sort || "recent"}
                onChange={updateSort}
                className="appearance-none bg-transparent border-none text-foreground rounded pl-1 pr-6 py-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <option value="recent">Listados recentemente</option>
                <option value="price_asc">Menor preço</option>
                <option value="price_desc">Maior preço</option>
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 h-4 w-4"
              />
            </div>
          </div>
        </div>

        {/* ESTADO DE CARREGAMENTO (SKELETONS) */}
        {isLoading && (
          <div
            aria-busy="true"
            aria-live="polite"
            className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-6 md:gap-y-12 pb-8 lg:pb-0 [&>*:nth-child(even)]:translate-y-8 lg:[&>*:nth-child(even)]:translate-y-0"
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex flex-col space-y-3">
                <Skeleton className="aspect-[175/190] w-full rounded-3xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div role="alert" className="text-red-500 py-10 font-mono text-sm">
            Erro ao carregar o catálogo. Tente recarregar a página.
          </div>
        )}

        {!isLoading && !isError && data?.length === 0 && (
          <div className="text-muted-foreground font-mono py-10 text-sm">
            Nenhum NFT encontrado com estes filtros.
          </div>
        )}

        {!isLoading && !isError && data && data.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-6 md:gap-y-12 pb-8 lg:pb-0 [&>*:nth-child(even)]:translate-y-8 lg:[&>*:nth-child(even)]:translate-y-0">
            {data.map((nft) => (
              <NFTCard key={nft.id} {...nft} />
            ))}
          </div>
        )}

        {/* Paginação */}
        {hasPagination && (
          <nav
            aria-label="Paginação do catálogo"
            className="mt-16 flex justify-end gap-2"
          >
            {Array.from({ length: totalPages as number }, (_, i) => i + 1).map(
              (page) => {
                const isCurrent = currentPage === page;
                return (
                  <Button
                    key={page}
                    variant="ghost"
                    size="sm"
                    aria-label={`Ir para a página ${page}`}
                    aria-current={isCurrent ? "page" : undefined}
                    onClick={() => updatePage(page)}
                    className={`w-9 h-9 p-0 rounded-sm font-mono text-sm focus-visible:ring-2 focus-visible:ring-primary ${
                      isCurrent
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
                        : "bg-secondary text-foreground hover:bg-secondary/70"
                    }`}
                  >
                    {page}
                  </Button>
                );
              },
            )}
            {(currentPage ?? 1) < (totalPages ?? 1) && (
              <Button
                variant="ghost"
                size="sm"
                aria-label="Próxima página"
                onClick={() => updatePage((currentPage ?? 1) + 1)}
                className="w-9 h-9 p-0 rounded-sm bg-secondary text-foreground hover:bg-secondary/70 focus-visible:ring-2 focus-visible:ring-primary"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            )}
          </nav>
        )}
      </div>
    </section>
  );
}
