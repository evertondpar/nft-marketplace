import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { NFTCard } from "@/components/nft/NFTCard";
import type { NFTItem } from "@/types";
import { useCart } from "@/hooks/useCart";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

function NFTDetails() {
  const { nftId } = Route.useParams();
  const { addToCart } = useCart();

  // Estados interativos locais
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"details" | "reviews">("details");
  const [isMainImageLoaded, setIsMainImageLoaded] = useState(false);
  const [selectedThumb, setSelectedThumb] = useState(0);

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

  // 1. TELA DE SKELETON COMPLETA (Enquanto os detalhes principais carregam)
  if (isLoading) {
    return (
      <main
        aria-busy="true"
        aria-live="polite"
        aria-label="Carregando detalhes do NFT"
        className="flex-1 container mx-auto px-4 md:px-8 py-12"
      >
        {/* Breadcrumb Skeleton */}
        <Skeleton className="h-4 w-48 mb-8" />

        <div className="flex flex-col md:flex-row gap-12">
          {/* Coluna Esquerda: Skeletons de Imagem */}
          <div className="flex gap-4 md:w-1/2">
            <div className="hidden md:flex flex-col gap-4 w-20 shrink-0">
              <Skeleton className="aspect-square rounded-lg w-full" />
              <Skeleton className="aspect-square rounded-lg w-full" />
              <Skeleton className="aspect-square rounded-lg w-full" />
            </div>
            <Skeleton className="flex-1 aspect-square rounded-2xl w-full" />
          </div>

          {/* Coluna Direita: Skeletons de Informação */}
          <div className="md:w-1/2 flex flex-col justify-center space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-1/2" />

            <div className="p-6 bg-secondary/30 border border-border/40 rounded-xl space-y-4">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-16 w-full" />

              <div className="space-y-2 pt-2">
                <Skeleton className="h-3 w-16" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-12 rounded" />
                  <Skeleton className="h-6 w-12 rounded" />
                  <Skeleton className="h-6 w-24 rounded" />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-6">
                <Skeleton className="h-12 w-28 rounded-md" />
                <Skeleton className="h-12 flex-1 rounded-md" />
                <Skeleton className="h-12 w-12 rounded-md" />
              </div>
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
        className="container mx-auto px-8 py-12 text-red-500 font-mono text-sm"
      >
        Erro: NFT não encontrado ou falha ao carregar os dados.
      </div>
    );
  }

  const relatedNfts =
    allNfts?.filter((item: NFTItem) => item.id !== nftId).slice(0, 5) || [];

  return (
    <main className="flex-1 container mx-auto px-4 md:px-8 py-12">
      {/* Breadcrumb de navegação */}
      <nav
        aria-label="Navegação estrutural"
        className="text-sm font-mono text-muted-foreground mb-8"
      >
        Início / Mercado / <span className="text-foreground">{nft.name}</span>
      </nav>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Coluna da Esquerda: Imagens e Miniaturas */}
        <div className="flex gap-4 md:w-1/2">
          {/* Miniaturas laterais acessíveis por teclado */}
          <div
            role="group"
            aria-label="Galeria de miniaturas do NFT"
            className="hidden md:flex flex-col gap-4 w-20 shrink-0"
          >
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedThumb(index)}
                aria-label={`Ver imagem miniatura ${index + 1}`}
                aria-pressed={selectedThumb === index}
                className={`aspect-square rounded-lg border-2 overflow-hidden transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  selectedThumb === index
                    ? "border-primary opacity-100"
                    : "border-transparent opacity-50 hover:opacity-100"
                }`}
              >
                <img
                  src={nft.image}
                  className={`w-full h-full object-cover ${index > 0 ? "grayscale" : ""}`}
                  alt={`Miniatura ${index + 1} de ${nft.name}`}
                />
              </button>
            ))}
          </div>

          {/* Imagem Principal com Skeleton de Carregamento */}
          <div className="flex-1 aspect-square rounded-2xl overflow-hidden bg-secondary relative">
            {!isMainImageLoaded && (
              <Skeleton className="absolute inset-0 w-full h-full rounded-2xl" />
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

        {/* Coluna da Direita: Informações e Compra */}
        <div className="md:w-1/2 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
            {nft.name} <span className="text-muted-foreground">#{nft.id}</span>
          </h1>

          <div className="flex items-center gap-4 mb-8">
            <span className="text-2xl font-mono font-bold text-primary">
              {nft.price} {nft.currency}
            </span>
            <span
              className="text-sm text-muted-foreground"
              aria-label="Classificação: 5 de 5 estrelas baseada em 19 avaliações"
            >
              ★★★★★ 19 avaliações
            </span>
          </div>

          <div className="mb-8 p-6 bg-secondary/30 border border-border rounded-xl">
            <h2 className="font-bold text-foreground mb-4 text-base">
              Sobre este NFT:
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Um colecionável digital finalizado à mão da coleção{" "}
              {nft.collection}, verificado na Ethereum, com arte desbloqueável e
              acesso para colecionadores.
            </p>

            <div className="mb-4">
              <span className="text-xs uppercase font-mono text-muted-foreground block mb-2">
                Edição:
              </span>
              <div className="flex gap-2">
                <span className="text-xs font-mono px-2 py-1 bg-background border border-border rounded">
                  1/1
                </span>
                <span className="text-xs font-mono px-2 py-1 bg-background border border-border rounded">
                  1/10
                </span>
                <span className="text-xs font-mono px-2 py-1 bg-primary/20 border border-primary text-primary rounded">
                  1/50 ABERTA
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-8">
              {/* Controle de Quantidade */}
              <div
                role="group"
                aria-label="Seleção de quantidade"
                className="flex items-center border border-border rounded-md bg-background"
              >
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  aria-label="Diminuir quantidade"
                  className="px-3 py-2 text-primary hover:bg-secondary transition-colors font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-l-md"
                >
                  -
                </button>
                <span
                  aria-live="polite"
                  aria-label={`Quantidade selecionada: ${quantity}`}
                  className="px-3 py-2 font-mono text-sm border-x border-border"
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => prev + 1)}
                  aria-label="Aumentar quantidade"
                  className="px-3 py-2 text-primary hover:bg-secondary transition-colors font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-r-md"
                >
                  +
                </button>
              </div>

              {/* Botão de Compra */}
              <Button
                type="button"
                onClick={() => addToCart({ ...nft, quantity })}
                aria-label={`Comprar ${nft.name} por ${nft.price} ${nft.currency}`}
                className="flex-1 py-6 bg-primary text-primary-foreground font-bold hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                COMPRAR
              </Button>

              {/* Botão de Favorito */}
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Adicionar este NFT aos favoritos"
                className="h-[50px] w-[50px] border-border hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Metadados Técnicos */}
            <div className="space-y-2 text-xs font-mono text-muted-foreground border-t border-border/50 pt-4 mt-6">
              <p>
                <span className="text-foreground">ID do token:</span> #{nft.id}
              </p>
              <p>
                <span className="text-foreground">Coleção:</span>{" "}
                {nft.collection || "Kurio Apes"}
              </p>
              <p>
                <span className="text-foreground">Atributos:</span>{" "}
                {nft.attributes?.join(", ") || "Óculos, Esmeralda, Raro"}
              </p>

              {/* Redes Sociais / Compartilhamento */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-foreground">Compartilhar este NFT:</span>
                <button
                  type="button"
                  aria-label="Compartilhar este NFT no LinkedIn"
                  className="text-primary hover:underline cursor-pointer flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1"
                >
                  in
                </button>
                <button
                  type="button"
                  aria-label="Compartilhar este NFT no X (antigo Twitter)"
                  className="text-primary hover:underline cursor-pointer flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1"
                >
                  𝕏
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção Inferior: Abas de Detalhes e Avaliações */}
      <div className="border-t border-border pt-12 mb-16">
        <div
          role="tablist"
          aria-label="Informações detalhadas do NFT"
          className="flex gap-8 border-b border-border mb-6 pb-2 text-sm font-mono"
        >
          <button
            type="button"
            role="tab"
            id="tab-details"
            aria-controls="panel-details"
            aria-selected={activeTab === "details"}
            onClick={() => setActiveTab("details")}
            className={`pb-2 -mb-[10px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-t ${
              activeTab === "details"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
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
            className={`pb-2 -mb-[10px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-t ${
              activeTab === "reviews"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Avaliações de colecionadores (19)
          </button>
        </div>

        {/* Conteúdo da Aba: Detalhes do NFT */}
        {activeTab === "details" && (
          <div
            id="panel-details"
            role="tabpanel"
            aria-labelledby="tab-details"
            className="text-sm text-muted-foreground space-y-4 max-w-4xl font-mono leading-relaxed animate-fadeIn"
          >
            <p>
              {nft.name} #{nft.id} é uma obra digital 1/50 finalizada à mão da
              coleção {nft.collection || "Kurio Editions"}. Cada atributo fica
              armazenado nos metadados do token e verificado na Ethereum. A obra
              explora identidade, movimento e luz em um mundo digital sem
              fronteiras.
            </p>
            <p>
              A propriedade inclui a arte em alta resolução, lançamentos
              exclusivos para colecionadores e um registro permanente de
              procedência registrada na rede.
            </p>

            <div className="pt-4">
              <p className="text-foreground font-bold mb-1">Rede:</p>
              <p>
                Cunhado na Ethereum com procedência imutável e metadados
                armazenados no IPFS.
              </p>
            </div>

            <div className="pt-2">
              <p className="text-foreground font-bold mb-1">Contrato:</p>
              <p>
                Direitos autorais do criador: 5% nas vendas secundárias, pagos
                automaticamente pelos mercados compatíveis.
              </p>
            </div>

            <div className="pt-2">
              <p className="text-foreground font-bold mb-1">
                Direitos autorais:
              </p>
              <p className="text-primary">
                0x7442...19E8 - Contrato inteligente ERC-721 verificado.
              </p>
            </div>
          </div>
        )}

        {/* Conteúdo da Aba: Avaliações */}
        {activeTab === "reviews" && (
          <div
            id="panel-reviews"
            role="tabpanel"
            aria-labelledby="tab-reviews"
            className="text-sm text-muted-foreground font-mono space-y-4 max-w-4xl animate-fadeIn"
          >
            <p className="text-foreground font-bold">
              Avaliações verificadas de colecionadores:
            </p>
            <div className="p-4 bg-secondary/20 rounded-lg border border-border/40">
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-foreground">0x91A...3B4</span>
                <span className="text-primary">★★★★★</span>
              </div>
              <p className="text-xs">
                Excelente qualidade de imagem no IPFS. Transação na rede
                concluída super rápido.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Seção "Mais desta coleção" com Skeletons */}
      <section aria-label="Mais NFTs desta coleção" className="mt-20">
        <h3 className="text-lg font-bold text-foreground mb-6 font-mono">
          Mais desta coleção
        </h3>

        {isLoadingAllNfts ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col space-y-3 bg-secondary/30 p-3 rounded-xl border border-border/40"
              >
                <Skeleton className="h-36 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {relatedNfts.map((item: NFTItem) => (
              <NFTCard key={item.id} {...item} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export const Route = createFileRoute("/nft/$nftId")({
  component: NFTDetails,
});
