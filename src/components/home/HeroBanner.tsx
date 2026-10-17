import { useState } from "react";
import { Button } from "../ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface HeroBannerProps {
  isLoading?: boolean;
  imageUrl?: string;
  secondaryImageUrl?: string;
  title?: string;
  description?: string;
  mobileTitle?: string;
  mobileDescription?: string;
}

export default function HeroBanner({
  isLoading = false,
  imageUrl = "/monkey1.png",
  secondaryImageUrl = "https://i.pravatar.cc/200?img=12",
  title,
  description,
  mobileTitle = "SEJA DONO DA CULTURA DIGITAL",
  mobileDescription = "Descubra NFTs selecionados de criadores do mundo todo.",
}: HeroBannerProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isThumbLoaded, setIsThumbLoaded] = useState(false);

  if (isLoading) {
    return (
      <>
        <section
          aria-label="Destaque principal Kurio"
          className="md:hidden mb-8 rounded-[28px] bg-secondary p-4 flex gap-3 h-[190px]"
        >
          <div className="flex-1 space-y-3 pt-1">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-5 w-3/5" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="w-[138px] h-[138px] rounded-2xl shrink-0" />
        </section>
        <section
          aria-label="Destaque principal Kurio"
          className="hidden md:flex flex-row justify-between items-center mb-16 gap-8"
        >
          <div className="flex-1 max-w-[640px] w-full space-y-4 md:pl-10">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-4/5" />
            <Skeleton className="h-10 w-3/5" />
            <Skeleton className="h-16 w-full max-w-[560px]" />
            <Skeleton className="h-10 w-36 rounded-sm" />
          </div>
          <div className="w-full md:w-[400px] lg:w-[450px] aspect-square rounded-2xl overflow-hidden shrink-0">
            <Skeleton className="w-full h-full" />
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {/* ========== MOBILE: card com texto à esquerda e imagem à direita ========== */}
      <section
        aria-label="Destaque principal Kurio"
        className="md:hidden relative overflow-hidden rounded-[28px] bg-secondary px-4 pt-3.5 pb-9 mb-8 flex gap-3 font-mono"
      >
        {/* Círculo decorativo de fundo */}
        <div
          aria-hidden="true"
          className="absolute -top-6 left-[34%] h-64 w-64 rounded-full bg-primary/10"
        />

        <div className="relative z-10 flex-1 min-w-0">
          <p className="text-xs text-foreground mb-2">Bem-vindo à Kurio</p>
          <h1 className="text-[17px] font-bold text-foreground leading-[1.7] mb-2">
            {mobileTitle}
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed mb-2">
            {mobileDescription}
          </p>
          <button
            type="button"
            className="text-xs font-bold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            EXPLORAR →
          </button>
        </div>

        <div className="relative z-10 w-[138px] shrink-0 self-start mt-1">
          <div className="aspect-square rounded-2xl overflow-hidden bg-background/40 relative">
            {!isImageLoaded && (
              <Skeleton className="absolute inset-0 w-full h-full" />
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
          {/* Miniatura sobreposta */}
          <div className="absolute -bottom-2 left-0 w-[70px] h-[58px] rounded-xl overflow-hidden border-[3px] border-secondary bg-background/40">
            {!isThumbLoaded && (
              <Skeleton className="absolute inset-0 w-full h-full" />
            )}
            <img
              src={secondaryImageUrl}
              alt=""
              aria-hidden="true"
              onLoad={() => setIsThumbLoaded(true)}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                isThumbLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        </div>

        {/* Indicadores decorativos */}
        <div
          aria-hidden="true"
          className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2"
        >
          <span className="h-2 w-2 rounded-full bg-primary" />
          <span className="h-2 w-2 rounded-full bg-primary" />
          <span className="h-2 w-2 rounded-full bg-primary" />
        </div>
      </section>

      {/* ========== DESKTOP / TABLET ========== */}
      <section
        aria-label="Destaque principal Kurio"
        className="hidden md:flex flex-row justify-between items-center mb-16 gap-8"
      >
        {/* Texto: recuo de 40px à esquerda (alinhado ao Figma) */}
        <div className="flex-1 w-full max-w-[640px] md:pl-10">
          <p className="text-foreground font-mono text-xs mb-5 tracking-wide">
            Bem-vindo à Kurio
          </p>
          <h1 className="font-mono text-3xl sm:text-4xl md:text-[44px] font-bold text-foreground leading-[1.6] mb-4">
            {title || (
              <>
                SEJA DONO DO FUTURO
                <br />
                DA ARTE DIGITAL
              </>
            )}
          </h1>
          <p className="font-mono text-muted-foreground mb-8 max-w-[560px] text-xs sm:text-sm leading-relaxed">
            {description ||
              "Descubra NFTs selecionados de criadores emergentes e consagrados. Colecione arte digital rara, apoie artistas e tenha uma parte da cultura da internet."}
          </p>
          <Button className="h-10 px-6 rounded-sm font-mono font-bold text-xs bg-primary hover:bg-primary/90 text-primary-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none">
            EXPLORAR
          </Button>

          {/* Indicadores decorativos do carrossel */}
          <div
            aria-hidden="true"
            className="hidden md:flex justify-end gap-2 mt-12 pr-4"
          >
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="h-2 w-2 rounded-full bg-primary" />
          </div>
        </div>

        <div className="w-full md:w-[400px] lg:w-[450px] shrink-0 aspect-square rounded-2xl overflow-hidden bg-secondary relative">
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
    </>
  );
}
