import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { NFTCard } from "@/components/nft/NFTCard";
import type { NFTItem } from "@/types";
import { useCart } from "@/hooks/useCart";

function NFTDetails() {
  // Extraímos o ID da URL automaticamente e com tipagem segura!
  const { nftId } = Route.useParams();

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

  // Buscar todos os NFTs para exibir a secção "Mais desta coleção"
  const { data: allNfts } = useQuery({
    queryKey: ["nfts"],
    queryFn: async () => {
      const response = await api.get("/nfts");
      return response.data.items;
    },
  });

  if (isLoading)
    return (
      <div className="container mx-auto px-8 py-12 text-primary font-mono animate-pulse">
        A carregar os detalhes da obra...
      </div>
    );
  if (isError || !nft)
    return (
      <div className="container mx-auto px-8 py-12 text-red-500">
        Erro: NFT não encontrado.
      </div>
    );

  // Filtrar outros NFTs para a secção inferior
  const relatedNfts =
    allNfts?.filter((item: NFTItem) => item.id !== nftId).slice(0, 5) || [];

  const { addToCart } = useCart();
  return (
    <main className="flex-1 container mx-auto px-4 md:px-8 py-12">
      {/* Breadcrumb de navegação */}
      <div className="text-sm font-mono text-muted-foreground mb-8">
        Início / Mercado / <span className="text-foreground">{nft.name}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Coluna da Esquerda: Imagens */}
        <div className="flex gap-4 md:w-1/2">
          {/* Miniaturas laterais (Mockadas visualmente) */}
          <div className="hidden md:flex flex-col gap-4 w-20 shrink-0">
            <div className="aspect-square rounded-lg border-2 border-primary overflow-hidden opacity-100">
              <img
                src={nft.image}
                className="w-full h-full object-cover"
                alt="Thumb 1"
              />
            </div>
            <div className="aspect-square rounded-lg overflow-hidden opacity-50 hover:opacity-100 cursor-pointer">
              <img
                src={nft.image}
                className="w-full h-full object-cover grayscale"
                alt="Thumb 2"
              />
            </div>
            <div className="aspect-square rounded-lg overflow-hidden opacity-50 hover:opacity-100 cursor-pointer">
              <img
                src={nft.image}
                className="w-full h-full object-cover grayscale"
                alt="Thumb 3"
              />
            </div>
          </div>
          {/* Imagem Principal */}
          <div className="flex-1 aspect-square rounded-2xl overflow-hidden bg-secondary">
            <img
              src={nft.image}
              alt={nft.name}
              className="w-full h-full object-cover"
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
            <span className="text-sm text-muted-foreground">
              ★★★★★ 19 avaliações
            </span>
          </div>

          <div className="mb-8 p-6 bg-secondary/30 border border-border rounded-xl">
            <h3 className="font-bold text-foreground mb-4">Sobre este NFT:</h3>
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
              {/* Botões do Figma: Quantidade e Ações */}
              <div className="flex items-center border border-border rounded-md bg-background">
                <button className="px-3 py-2 text-primary hover:bg-secondary transition-colors font-bold">
                  -
                </button>
                <span className="px-3 py-2 font-mono text-sm border-x border-border">
                  1
                </span>
                <button className="px-3 py-2 text-primary hover:bg-secondary transition-colors font-bold">
                  +
                </button>
              </div>
              <Button
                onClick={() => addToCart(nft)}
                className="flex-1 py-6 bg-primary text-primary-foreground font-bold hover:bg-primary/90"
              >
                COMPRAR
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-[50px] w-[50px] border-border hover:text-primary"
              >
                <Heart className="h-5 w-5" />
              </Button>
            </div>
            {/* Metadados específicos do Figma */}
            <div className="space-y-2 text-xs font-mono text-muted-foreground border-t border-border/50 pt-4">
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
              <div className="flex items-center gap-2 pt-1">
                <span className="text-foreground">Compartilhar este NFT:</span>
                <span className="text-primary hover:underline cursor-pointer flex items-center gap-1">
                  in
                </span>
                <span className="text-primary hover:underline cursor-pointer flex items-center gap-1">
                  𝕏{" "}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secção Inferior: Detalhes Técnicos e Avaliações */}
      <div className="border-t border-border pt-12 mb-16">
        <div className="flex gap-8 border-b border-border mb-6 pb-2 text-sm font-mono">
          <button className="text-primary border-b-2 border-primary pb-2 -mb-[10px] font-bold">
            Detalhes do NFT
          </button>
          <button className="text-muted-foreground hover:text-foreground pb-2 -mb-[10px]">
            Avaliações de colecionadores (19)
          </button>
        </div>

        <div className="text-sm text-muted-foreground space-y-4 max-w-4xl font-mono leading-relaxed">
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
            procedência registrada na rede[cite: 16].
          </p>

          <div className="pt-4">
            <p className="text-foreground font-bold mb-1">Rede:</p>
            <p>
              Cunhado na Ethereum com procedência imutável e metadados
              armazenados no IPFS[cite: 16].
            </p>
          </div>

          <div className="pt-2">
            <p className="text-foreground font-bold mb-1">Contrato:</p>
            <p>
              Direitos autorais do criador: 5% nas vendas secundárias, pagos
              automaticamente pelos mercados compatíveis[cite: 16].
            </p>
          </div>

          <div className="pt-2">
            <p className="text-foreground font-bold mb-1">Direitos autorais:</p>
            <p className="text-primary">
              0x7442...19E8 - Contrato inteligente ERC-721 verificado[cite: 16].
            </p>
          </div>
        </div>
      </div>

      {/* Secção "Mais desta coleção" */}
      <div className="mt-20">
        <h3 className="text-lg font-bold text-foreground mb-6 font-mono">
          Mais desta coleção
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {relatedNfts.map((item: NFTItem) => (
            <NFTCard key={item.id} {...item} />
          ))}
        </div>
      </div>
    </main>
  );
}

// O TanStack regista a rota automaticamente baseada no nome do ficheiro
export const Route = createFileRoute("/nft/$nftId")({
  component: NFTDetails,
});
