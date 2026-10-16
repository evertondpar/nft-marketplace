import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Heart,
  // Linkedin,
  Mail,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  Star,
  // Twitter,
} from "lucide-react";
import { NFTCard } from "@/components/nft/NFTCard";
import type { NFTItem } from "@/types";
import { useCart } from "@/hooks/useCart";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

const EDITIONS = ["1/1", "1/10", "1/50", "ABERTA"];
const RELATED_PAGE_SIZE = 5;

/* ---------- Controle de quantidade (cápsulas laranja) ---------- */
function QuantityControl({
  quantity,
  onChange,
  compact = false,
}: {
  quantity: number;
  onChange: (value: number) => void;
  compact?: boolean;
}) {
  const btn = compact ? "h-[26px] w-[18px]" : "h-11 w-8";
  const icon = compact ? "h-3 w-3" : "h-5 w-5";
  const base =
    "flex items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  return (
    <div
      role="group"
      aria-label="Seleção de quantidade"
      className={`flex items-center font-mono ${compact ? "gap-3" : "gap-4"}`}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(1, quantity - 1))}
        aria-label="Diminuir quantidade"
        className={`${base} ${btn}`}
      >
        <Minus className={icon} strokeWidth={3} aria-hidden="true" />
      </button>
      <span
        aria-live="polite"
        aria-label={`Quantidade selecionada: ${quantity}`}
        className={`text-foreground text-center min-w-[1ch] ${compact ? "text-sm" : "text-base"}`}
      >
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        aria-label="Aumentar quantidade"
        className={`${base} ${btn}`}
      >
        <Plus className={icon} strokeWidth={3} aria-hidden="true" />
      </button>
    </div>
  );
}

/* ---------- Chips de edição ---------- */
function EditionChips({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Edição do NFT"
      className="flex flex-wrap gap-2"
    >
      {EDITIONS.map((edition) => {
        const selected = value === edition;
        return (
          <button
            key={edition}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(edition)}
            className={`rounded-full border px-3 py-1 text-xs font-mono transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              selected
                ? "border-primary text-primary"
                : "border-primary/30 text-muted-foreground hover:border-primary/60"
            }`}
          >
            {edition}
          </button>
        );
      })}
    </div>
  );
}

function NFTDetails() {
  const { nftId } = Route.useParams();
  const { addToCart } = useCart();
  const router = useRouter();

  // Estados interativos locais
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"details" | "reviews">("details");
  const [isMainImageLoaded, setIsMainImageLoaded] = useState(false);
  const [selectedThumb, setSelectedThumb] = useState(0);
  const [edition, setEdition] = useState("1/50");
  const [isFavorite, setIsFavorite] = useState(false);
  const [relatedPage, setRelatedPage] = useState(0);

  // Busca dos detalhes do NFT atual
  const {
    data: nft,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["nft", nftId],
    queryFn: async () => {
      const response = await api.get(`/nfts/${nftId}`);
      return response.data;
    },
  });

  // Busca de todos os NFTs para "Mais desta coleção"
  const { data: allNfts, isLoading: isLoadingAllNfts } = useQuery({
    queryKey: ["nfts"],
    queryFn: async () => {
      const response = await api.get("/nfts");
      return response.data.items;
    },
  });

  // 1. SKELETON COMPLETO
  if (isLoading) {
    return (
      <main
        aria-busy="true"
        aria-live="polite"
        aria-label="Carregando detalhes do NFT"
        className="flex-1 w-full pb-8"
      >
        {/* Mobile */}
        <div className="md:hidden">
          <div className="bg-secondary px-6 pt-6 pb-10">
            <div className="flex justify-between mb-2">
              <Skeleton className="h-9 w-9 rounded-full" />
              <Skeleton className="h-9 w-9 rounded-full" />
            </div>
            <Skeleton className="aspect-square w-full rounded-3xl" />
          </div>
          <div className="relative -mt-9 rounded-t-[32px] bg-background px-6 pt-8 space-y-4">
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden md:block mx-auto w-full max-w-[1248px] px-6 pt-7">
          <Skeleton className="h-4 w-40 mb-3" />
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.04fr)] gap-8">
            <div className="flex gap-7">
              <div className="flex flex-col gap-4 w-16 lg:w-[100px] shrink-0">
                {[0, 1, 2, 3].map((i) => (
                  <Skeleton
                    key={i}
                    className="aspect-square rounded-xl w-full"
                  />
                ))}
              </div>
              <Skeleton className="flex-1 aspect-square rounded-lg" />
            </div>
            <div className="space-y-5">
              <Skeleton className="h-9 w-3/5" />
              <Skeleton className="h-7 w-2/5" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-11 w-full" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (isError || !nft) {
    return (
      <div
        role="alert"
        className="mx-auto max-w-[1248px] px-6 py-12 text-red-500 font-mono text-sm"
      >
        Erro: NFT não encontrado ou falha ao carregar os dados.
      </div>
    );
  }

  const relatedAll: NFTItem[] =
    allNfts?.filter((item: NFTItem) => item.id !== nftId) ?? [];
  const totalRelatedPages = Math.max(
    1,
    Math.ceil(relatedAll.length / RELATED_PAGE_SIZE),
  );
  const currentRelatedPage = Math.min(relatedPage, totalRelatedPages - 1);
  const relatedNfts = relatedAll.slice(
    currentRelatedPage * RELATED_PAGE_SIZE,
    (currentRelatedPage + 1) * RELATED_PAGE_SIZE,
  );

  const tokenId = String(nft.id).padStart(4, "0");
  const attributes = nft.attributes?.join(", ") || "Óculos, Esmeralda, Raro";
  const collection = nft.collection || "Kurio Apes";
  const handleBuy = () => addToCart({ ...nft, quantity });

  return (
    <main className="flex-1 w-full pb-[190px] md:pb-0">
      {/* =====================================================
          MOBILE — topo: voltar / favoritar + imagem
          ===================================================== */}
      <div className="md:hidden bg-secondary px-6 pt-6 pb-0">
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={() => router.history.back()}
            aria-label="Voltar"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/40 text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setIsFavorite((prev) => !prev)}
            aria-label={
              isFavorite
                ? "Remover este NFT dos favoritos"
                : "Adicionar este NFT aos favoritos"
            }
            aria-pressed={isFavorite}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/40 text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Heart
              className={`h-4 w-4 ${isFavorite ? "fill-primary" : ""}`}
              aria-hidden="true"
            />
          </button>
        </div>

        <div className="aspect-square w-full rounded-3xl overflow-hidden bg-background/40 relative">
          {!isMainImageLoaded && (
            <Skeleton className="absolute inset-0 w-full h-full" />
          )}
          <img
            src={nft.image}
            alt={`Imagem principal do NFT ${nft.name}`}
            onLoad={() => setIsMainImageLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isMainImageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </div>

      {/* MOBILE — sheet de informações (sobrepõe a base da imagem) */}
      <section
        aria-label="Informações do NFT"
        className="md:hidden relative -mt-9 rounded-t-[32px] bg-background px-6 pt-8 pb-2 font-mono"
      >
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <h1 className="text-xl font-bold text-foreground leading-7">
            {nft.name} <span>#{nft.id}</span>
          </h1>
          <span
            className="flex shrink-0 items-center gap-1 rounded-full border border-primary/40 px-2.5 py-1 text-[13px]"
            aria-label="Nota 4,8 de 5 com 19 avaliações"
          >
            <Star
              className="h-3.5 w-3.5 fill-primary text-primary"
              aria-hidden="true"
            />
            <span className="font-bold text-foreground">4.8</span>
            <span className="text-muted-foreground">(19)</span>
          </span>
        </div>

        <p className="text-sm text-muted-foreground leading-[25px]">
          Um colecionável digital 1/50 finalizado à mão da coleção Kurio
          Editions, verificado na Ethereum.
        </p>

        <p className="mt-1.5 mb-1 text-sm font-bold text-foreground">Edição:</p>
        <EditionChips value={edition} onChange={setEdition} />

        <div className="mt-3 space-y-0 text-sm text-muted-foreground leading-8">
          <p>ID do token: #{tokenId}</p>
          <p>Coleção: {collection}</p>
          <p>Atributos: {attributes}</p>
        </div>
      </section>

      {/* =====================================================
          CONTEÚDO COMUM (desktop completo + abas/relacionados no mobile)
          ===================================================== */}
      <div className="mx-auto w-full max-w-[1248px] px-6 pt-0 md:pt-7">
        {/* Breadcrumb (desktop) */}
        <nav
          aria-label="Navegação estrutural"
          className="hidden md:block text-[15px] font-mono font-bold text-foreground mb-3"
        >
          Início / Mercado
        </nav>

        {/* DESKTOP — galeria + informações */}
        <div className="hidden md:grid grid-cols-[minmax(0,1fr)_minmax(0,1.04fr)] gap-8">
          {/* Esquerda: miniaturas + imagem principal */}
          <div className="flex gap-7">
            <div
              role="group"
              aria-label="Galeria de miniaturas do NFT"
              className="flex flex-col gap-4 w-16 lg:w-[100px] shrink-0"
            >
              {[0, 1, 2, 3].map((index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedThumb(index)}
                  aria-label={`Ver imagem miniatura ${index + 1}`}
                  aria-pressed={selectedThumb === index}
                  className={`aspect-square rounded-xl border-2 overflow-hidden transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    selectedThumb === index
                      ? "border-primary"
                      : "border-transparent hover:border-primary/50"
                  }`}
                >
                  <img
                    src={nft.image}
                    className="w-full h-full object-cover"
                    alt={`Miniatura ${index + 1} de ${nft.name}`}
                  />
                </button>
              ))}
            </div>

            <div className="flex-1 aspect-square rounded-lg bg-secondary p-3 lg:p-5">
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-background/40">
                {!isMainImageLoaded && (
                  <Skeleton className="absolute inset-0 w-full h-full" />
                )}
                <img
                  src={nft.image}
                  alt={`Imagem principal do NFT ${nft.name}`}
                  onLoad={() => setIsMainImageLoaded(true)}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    isMainImageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => window.open(nft.image, "_blank", "noopener")}
                  aria-label="Ampliar imagem"
                  className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Search className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {/* Direita: informações e compra */}
          <div className="font-mono min-w-0">
            <h1 className="text-[28px] font-bold text-foreground leading-9 mb-1">
              {nft.name} <span>#{nft.id}</span>
            </h1>

            <div className="flex items-center justify-between gap-4 pb-2 mr-5 border-b border-primary/20">
              <span className="text-[22px] font-bold text-primary leading-7">
                {nft.price} {nft.currency}
              </span>
              <span
                className="flex items-center gap-2 text-sm text-foreground"
                aria-label="Classificação: 5 de 5 estrelas baseada em 19 avaliações"
              >
                <span className="flex gap-0.5" aria-hidden="true">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 fill-primary text-primary"
                    />
                  ))}
                </span>
                19 avaliações de colecionadores
              </span>
            </div>

            <h2 className="mt-3 text-sm font-bold text-foreground leading-6">
              Sobre este NFT:
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-6">
              Um colecionável digital finalizado à mão da coleção Kurio
              Editions, verificado na Ethereum, com arte desbloqueável e acesso
              para colecionadores.
            </p>

            <p className="mt-1 text-sm font-bold text-foreground leading-6">
              Edição:
            </p>
            <div className="mt-2">
              <EditionChips value={edition} onChange={setEdition} />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <QuantityControl quantity={quantity} onChange={setQuantity} />
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={handleBuy}
                  aria-label={`Comprar ${nft.name} por ${nft.price} ${nft.currency}`}
                  className="h-10 w-[130px] rounded-md bg-primary text-primary-foreground font-mono text-xs font-bold hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  COMPRAR
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFavorite((prev) => !prev)}
                  aria-pressed={isFavorite}
                  aria-label="Adicionar este NFT aos favoritos"
                  className="h-10 w-[130px] gap-2 rounded-md border-primary bg-transparent font-mono text-sm text-primary hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Heart
                    className={`h-5 w-5 ${isFavorite ? "fill-primary" : ""}`}
                    aria-hidden="true"
                  />
                  Favoritar
                </Button>
              </div>
            </div>

            <div className="mt-4 text-sm text-muted-foreground leading-8">
              <p>ID do token: #{tokenId}</p>
              <p>Coleção: {collection}</p>
              <p>Atributos: {attributes}</p>
              <div className="flex items-center gap-3 text-foreground">
                <span className="font-bold">Compartilhar este NFT:</span>
                <button
                  type="button"
                  aria-label="Compartilhar este NFT no LinkedIn"
                  className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  L{/* <Linkedin className="h-4 w-4" aria-hidden="true" /> */}
                </button>
                <button
                  type="button"
                  aria-label="Compartilhar este NFT por e-mail"
                  className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Compartilhar este NFT no X (antigo Twitter)"
                  className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  X{/* <Twitter className="h-4 w-4" aria-hidden="true" /> */}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Abas de detalhes e avaliações */}
        <div className="mt-12 md:mt-20">
          <div
            role="tablist"
            aria-label="Informações detalhadas do NFT"
            className="flex gap-8 border-b border-primary/30 font-mono text-sm md:text-[17px] overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <button
              type="button"
              role="tab"
              id="tab-details"
              aria-controls="panel-details"
              aria-selected={activeTab === "details"}
              onClick={() => setActiveTab("details")}
              className={`shrink-0 px-1 pb-2 -mb-px border-b-[3px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-t ${
                activeTab === "details"
                  ? "text-primary font-bold border-primary"
                  : "text-foreground border-transparent hover:text-primary"
              }`}
            >
              Detalhes do NFT
            </button>
            <button
              type="button"
              role="tab"
              id="tab-reviews"
              aria-controls="panel-reviews"
              aria-selected={activeTab === "reviews"}
              onClick={() => setActiveTab("reviews")}
              className={`shrink-0 px-1 pb-2 -mb-px border-b-[3px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-t ${
                activeTab === "reviews"
                  ? "text-primary font-bold border-primary"
                  : "text-foreground border-transparent hover:text-primary"
              }`}
            >
              Avaliações de colecionadores (19)
            </button>
          </div>

          {activeTab === "details" && (
            <div
              id="panel-details"
              role="tabpanel"
              aria-labelledby="tab-details"
              className="pt-3 text-sm text-muted-foreground font-mono leading-6"
            >
              <div className="space-y-6">
                <p>
                  {nft.name} #{nft.id} é uma obra digital 1/50 finalizada à mão
                  da coleção Kurio Editions. Cada atributo fica armazenado nos
                  metadados do token e verificado na Ethereum. A obra explora
                  identidade, movimento e luz em um mundo digital sem
                  fronteiras.
                </p>
                <p>
                  A propriedade inclui a arte em alta resolução, lançamentos
                  exclusivos para colecionadores e um registro permanente de
                  procedência registrada na rede. Nova Sato recebe 5% de
                  direitos autorais nas vendas secundárias, apoiando novos
                  trabalhos e lançamentos da comunidade.
                </p>
              </div>

              <div className="mt-3">
                <p className="text-foreground font-bold">Rede:</p>
                <p>
                  Cunhado na Ethereum com procedência imutável e metadados
                  armazenados no IPFS.
                </p>
              </div>
              <div className="mt-3">
                <p className="text-foreground font-bold">Contrato:</p>
                <p>
                  Direitos autorais do criador: 5% nas vendas secundárias, pagos
                  automaticamente pelos mercados compatíveis.
                </p>
              </div>
              <div className="mt-3">
                <p className="text-foreground font-bold">Direitos autorais:</p>
                <p>0x7A42...19E8 • Contrato inteligente ERC-721 verificado.</p>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div
              id="panel-reviews"
              role="tabpanel"
              aria-labelledby="tab-reviews"
              className="pt-4 text-sm text-muted-foreground font-mono space-y-4"
            >
              <p className="text-foreground font-bold">
                Avaliações verificadas de colecionadores:
              </p>
              <div className="p-4 bg-secondary rounded-lg">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-foreground">0x91A...3B4</span>
                  <span className="text-primary" aria-label="5 de 5 estrelas">
                    ★★★★★
                  </span>
                </div>
                <p className="text-xs">
                  Excelente qualidade de imagem no IPFS. Transação na rede
                  concluída super rápido.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Mais desta coleção */}
        <section
          aria-label="Mais NFTs desta coleção"
          className="mt-14 md:mt-24"
        >
          <h3 className="text-[17px] font-bold text-primary font-mono pb-2 mb-6 md:mb-8 border-b border-primary/30">
            Mais desta coleção
          </h3>

          {isLoadingAllNfts ? (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-x-4 md:gap-x-[26px] gap-y-6 [&>*:nth-child(5)]:hidden md:[&>*:nth-child(5)]:block">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="aspect-square w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-x-4 md:gap-x-[26px] gap-y-6 [&>*:nth-child(5)]:hidden md:[&>*:nth-child(5)]:block">
                {relatedNfts.map((item: NFTItem) => (
                  <NFTCard key={item.id} {...item} />
                ))}
              </div>

              {totalRelatedPages > 1 && (
                <div
                  role="group"
                  aria-label="Páginas de NFTs relacionados"
                  className="mt-9 flex justify-center gap-2"
                >
                  {Array.from({ length: totalRelatedPages }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRelatedPage(i)}
                      aria-label={`Ir para o grupo ${i + 1} de NFTs`}
                      aria-current={
                        i === currentRelatedPage ? "true" : undefined
                      }
                      className={`h-3 w-3 rounded-full border border-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                        i === currentRelatedPage
                          ? "bg-primary"
                          : "bg-transparent"
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {/* =====================================================
          MOBILE — barra de compra fixa
          ===================================================== */}
      <div className="md:hidden fixed inset-x-0 bottom-0 z-40 rounded-t-[32px] bg-secondary px-6 pt-6 pb-6 shadow-[0_-8px_24px_rgba(0,0,0,0.35)] font-mono">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-muted-foreground">
              Qtd.
            </span>
            <QuantityControl
              quantity={quantity}
              onChange={setQuantity}
              compact
            />
          </div>
          <span className="text-xl font-bold text-primary">
            {nft.price} {nft.currency}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            onClick={handleBuy}
            aria-label={`Comprar ${nft.name} por ${nft.price} ${nft.currency}`}
            className="h-[60px] w-[196px] rounded-full bg-gradient-to-b from-primary to-primary/75 text-primary-foreground font-mono text-base font-bold hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Comprar NFT
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleBuy}
            aria-label="Adicionar ao carrinho"
            className="h-[60px] w-[60px] rounded-full border border-primary/20 bg-background/40 text-primary hover:bg-background/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ShoppingCart className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </main>
  );
}

export const Route = createFileRoute("/nft/$nftId")({
  component: NFTDetails,
});
