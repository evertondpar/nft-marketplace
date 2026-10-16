import { useState } from "react";
import { Button } from "../ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface NFTGridSectionProps {
  isLoading?: boolean;
}

export default function NFTGridSection({
  isLoading = false,
}: NFTGridSectionProps) {
  const [img1Loaded, setImg1Loaded] = useState(false);
  const [img2Loaded, setImg2Loaded] = useState(false);

  // Estado de carregamento geral da API/Banco
  if (isLoading) {
    return (
      <section
        aria-label="Coleções em destaque e edições limitadas"
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-20"
      >
        {[1, 2].map((item) => (
          <div
            key={item}
            className="flex bg-secondary/40 rounded-2xl overflow-hidden border border-border/50 h-56"
          >
            <div className="w-1/2">
              <Skeleton className="w-full h-full" />
            </div>
            <div className="w-1/2 p-6 flex flex-col justify-center space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section
      aria-label="Coleções em destaque e edições limitadas"
      className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-20"
    >
      {/* Banner 1 */}
      <div className="flex bg-secondary/40 rounded-2xl overflow-hidden border border-border/50">
        <div className="w-1/2 bg-secondary relative">
          {!img1Loaded && (
            <Skeleton className="absolute inset-0 w-full h-full" />
          )}
          <img
            src="https://i.pravatar.cc/400?img=11"
            alt="Arte NFT da coleção Lançamentos Gênesis"
            onLoad={() => setImg1Loaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              img1Loaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
        <div className="w-1/2 p-6 flex flex-col justify-center">
          <h2 className="font-mono font-bold text-foreground mb-2 text-sm uppercase">
            Lançamentos gênesis
            <br />
            de edição limitada
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            Colecione edições escassas diretamente dos criadores antes da
            revelação pública.
          </p>
          <Button
            variant="secondary"
            size="sm"
            aria-label="Explorar lançamentos gênesis"
            className="w-fit bg-primary/20 text-primary hover:bg-primary/30 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            Explorar →
          </Button>
        </div>
      </div>

      {/* Banner 2 */}
      <div className="flex bg-secondary/40 rounded-2xl overflow-hidden border border-border/50">
        <div className="w-1/2 bg-secondary relative">
          {!img2Loaded && (
            <Skeleton className="absolute inset-0 w-full h-full" />
          )}
          <img
            src="https://i.pravatar.cc/400?img=12"
            alt="Arte NFT da coleção de arte digital selecionada"
            onLoad={() => setImg2Loaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              img2Loaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
        <div className="w-1/2 p-6 flex flex-col justify-center">
          <h2 className="font-mono font-bold text-foreground mb-2 text-sm uppercase">
            Arte digital selecionada
            <br />e muito mais
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            Explore novos artistas, coleções verificadas e obras digitais que
            definem a cultura.
          </p>
          <Button
            variant="secondary"
            size="sm"
            aria-label="Explorar arte digital selecionada"
            className="w-fit bg-primary/20 text-primary hover:bg-primary/30 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            Explorar →
          </Button>
        </div>
      </div>
    </section>
  );
}
