import { useState } from "react";
import { Button } from "../ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Banner {
  img: string;
  alt: string;
  title: React.ReactNode;
  description: string;
  ariaLabel: string;
}

interface NFTGridSectionProps {
  isLoading?: boolean;
  banners?: Banner[];
}

const defaultBanners: Banner[] = [
  {
    img: "/monkey1.png",
    alt: "Arte NFT da coleção Lançamentos Gênesis",
    title: (
      <>
        Lançamentos gênesis
        <br />
        de edição limitada
      </>
    ),
    description:
      "Colecione edições escassas diretamente dos criadores antes da revelação pública.",
    ariaLabel: "Explorar lançamentos gênesis",
  },
  {
    img: "/monkey2.png",
    alt: "Arte NFT da coleção de arte digital selecionada",
    title: (
      <>
        Arte digital selecionada
        <br />e muito mais
      </>
    ),
    description:
      "Explore novos artistas, coleções verificadas e obras digitais que definem a cultura.",
    ariaLabel: "Explorar arte digital selecionada",
  },
];

export default function NFTGridSection({
  isLoading = false,
  banners = defaultBanners,
}: NFTGridSectionProps) {
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});

  if (isLoading) {
    return (
      <section
        aria-label="Coleções em destaque e edições limitadas"
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-20"
      >
        {[1, 2].map((item) => (
          <div
            key={item}
            className="flex bg-secondary rounded-2xl overflow-hidden min-h-[250px]"
          >
            <div className="w-1/2">
              <Skeleton className="w-full h-full" />
            </div>
            <div className="w-1/2 p-5 flex flex-col justify-center items-end space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-9 w-28 rounded-sm" />
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
      {banners.map((banner, i) => (
        <div
          key={i}
          className="flex bg-secondary rounded-2xl overflow-hidden min-h-[250px]"
        >
          {/* Imagem: metade esquerda, sangrando até as bordas */}
          <div className="w-1/2 bg-secondary relative">
            {!loaded[i] && (
              <Skeleton className="absolute inset-0 w-full h-full" />
            )}
            <img
              src={banner.img}
              alt={banner.alt}
              onLoad={() => setLoaded((prev) => ({ ...prev, [i]: true }))}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                loaded[i] ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>

          {/* Texto alinhado à direita */}
          <div className="w-1/2 p-5 flex flex-col justify-center items-end text-right">
            <h2 className="font-mono font-bold text-foreground mb-3 text-sm lg:text-base leading-snug">
              {banner.title}
            </h2>
            <p className="font-mono text-xs lg:text-sm text-muted-foreground mb-5 leading-relaxed">
              {banner.description}
            </p>
            <Button
              size="sm"
              aria-label={banner.ariaLabel}
              className="h-9 px-6 rounded-sm font-mono font-bold text-xs bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            >
              Explorar →
            </Button>
          </div>
        </div>
      ))}
    </section>
  );
}
