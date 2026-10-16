import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { HomeSearch } from "@/types";
import HeroBanner from "@/components/home/HeroBanner";
import SidebarFilters from "@/components/home/SidebarFilters";
import NFTGridSection from "@/components/home/NFTGridSection";
import BlogSection from "@/components/home/BlogSection";
import { useSocket } from "@/hooks/useSocket";

export const Route = createFileRoute("/")({
  // Tipagem e parsing da URL
  validateSearch: (search: Record<string, unknown>): HomeSearch => {
    return {
      tab: (search.tab as "all" | "new" | "trending") || "all",
      collection: (search.collection as string) || undefined,
      network: (search.network as string) || undefined,
      minPrice: search.minPrice ? Number(search.minPrice) : undefined,
      maxPrice: search.maxPrice ? Number(search.maxPrice) : undefined,
      sort: (search.sort as "recent" | "price_asc" | "price_desc") || "recent",
      page: search.page ? Number(search.page) : 1,
    };
  },
  component: Home,
});

function Home() {
  // Pega os parâmetros validados da URL em tempo real
  const searchParams = Route.useSearch();
  useSocket();
  // A Query depende dos searchParams. Se a URL mudar, a requisição refaz automaticamente!
  const { data, isLoading, isError } = useQuery({
    queryKey: ["nfts", searchParams],
    queryFn: async () => {
      const res = await api.get("/nfts", { params: searchParams });
      return res.data;
    },
  });

  return (
    <main className="flex-1 container mx-auto px-4 md:px-8 py-12">
      {/* SECÇÃO 1: HERO BANNER (Topo) */}
      <HeroBanner />

      {/* SECÇÃO 2: SIDEBAR + GRID DE NFTS */}
      <SidebarFilters
        data={data?.items}
        totalPages={data?.totalPages}
        currentPage={data?.page}
        currentParams={searchParams}
        isLoading={isLoading}
        isError={isError}
      />

      {/* SECÇÃO 3: BANNERS SECUNDÁRIOS */}
      <NFTGridSection />

      {/* SECÇÃO 4: DIÁRIO DA CUNHAGEM (Blog) */}
      <BlogSection />
    </main>
  );
}
