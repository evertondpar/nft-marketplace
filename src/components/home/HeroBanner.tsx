import { useState } from "react";
import { Button } from "../ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface HeroBannerProps {
  isLoading?: boolean;
  imageUrl?: string;
  title?: string;
  description?: string;
}

export default function HeroBanner({
  isLoading = false,
  imageUrl = "https://i.pravatar.cc/600?img=11",
  title,
  description,
}: HeroBannerProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Estado de carregamento geral da API/Banco
  if (isLoading) {
    return (
      <section
        aria-label="Destaque principal Kurio"
        className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8"
      >
        <div className="flex-1 max-w-2xl w-full space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-12 w-1/2" />
          <Skeleton className="h-16 w-full max-w-lg" />
          <Skeleton className="h-12 w-36 rounded-md" />
        </div>
        <div className="w-full md:w-[400px] lg:w-[480px] aspect-square rounded-2xl overflow-hidden">
          <Skeleton className="w-full h-full" />
        </div>
      </section>
    );
  }

  return (
    <section
      aria-label="Destaque principal Kurio"
      className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8"
    >
      <div className="flex-1 max-w-2xl">
        <p className="text-muted-foreground font-mono text-sm mb-4 tracking-widest uppercase">
          Bem-vindo à Kurio
        </p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] mb-6">
          {title || (
            <>
              SEJA DONO DO FUTURO
              <br />
              DA ARTE DIGITAL
            </>
          )}
        </h1>
        <p className="text-muted-foreground mb-8 max-w-lg text-sm md:text-base leading-relaxed">
          {description ||
            "Descubra NFTs selecionados de criadores emergentes e consagrados. Colecione arte digital rara, apoie artistas e tenha uma parte da cultura da internet."}
        </p>
        <Button className="font-bold px-8 py-6 text-sm bg-primary hover:bg-primary/90 text-primary-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none">
          EXPLORAR
        </Button>
      </div>

      <div className="w-full md:w-[400px] lg:w-[480px] aspect-square rounded-2xl overflow-hidden bg-secondary relative">
        {/* Skeleton individual da Imagem enquanto ela carrega na rede */}
        {!isImageLoaded && (
          <Skeleton className="absolute inset-0 w-full h-full rounded-2xl" />
        )}
        <img
          src={imageUrl}
          alt="Destaque de Arte Digital Kurio - Personagem ilustrado"
          onLoad={() => setIsImageLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isImageLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </section>
  );
}
