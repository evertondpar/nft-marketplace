import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface Post {
  img: string;
  title: string;
  excerpt: string;
  time: string;
}

interface BlogSectionProps {
  isLoading?: boolean;
  posts?: Post[];
}

const defaultPosts: Post[] = [
  {
    img: "13",
    title: "Como funciona a propriedade de NFTs",
    excerpt: "Aprenda a colecionar, negociar e verificar ativos digitais.",
    time: "12 de setembro | Leitura de 6 min",
  },
  {
    img: "14",
    title: "10 artistas digitais para acompanhar",
    excerpt: "Conheça criadores que moldam a cultura digital.",
    time: "13 de setembro | Leitura de 2 min",
  },
  {
    img: "15",
    title: "Raridade, atributos e procedência",
    excerpt: "Entenda raridade, procedência, direitos autorais e utilidade.",
    time: "15 de setembro | Leitura de 3 min",
  },
  {
    img: "16",
    title: "Como proteger sua carteira",
    excerpt: "Proteja sua carteira, seus ativos e sua identidade.",
    time: "15 de setembro | Leitura de 2 min",
  },
];

export default function BlogSection({
  isLoading = false,
  posts = defaultPosts,
}: BlogSectionProps) {
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => ({ ...prev, [index]: true }));
  };

  const handleCardKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      // Ação de navegação para o artigo
    }
  };

  return (
    <section aria-labelledby="blog-section-title" className="mt-24 mb-10">
      <div className="text-center mb-10">
        <h2
          id="blog-section-title"
          className="text-2xl md:text-[28px] font-mono font-bold text-foreground mb-3"
        >
          Diário da Cunhagem
        </h2>
        <p className="text-muted-foreground text-xs sm:text-sm font-mono">
          Histórias, guias e insights para colecionadores sobre o universo da
          propriedade digital.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-secondary rounded-lg overflow-hidden">
                <div className="aspect-[4/3]">
                  <Skeleton className="w-full h-full" />
                </div>
                <div className="p-4 space-y-3">
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))
          : posts.map((post, i) => (
              <article
                key={i}
                tabIndex={0}
                onKeyDown={handleCardKeyDown}
                className="bg-secondary rounded-lg overflow-hidden cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="aspect-[4/3] bg-secondary overflow-hidden relative">
                  {!loadedImages[i] && (
                    <Skeleton className="absolute inset-0 w-full h-full" />
                  )}
                  <img
                    src={
                      post.img.startsWith("http")
                        ? post.img
                        : `https://i.pravatar.cc/400?img=${post.img}`
                    }
                    alt={`Imagem do artigo: ${post.title}`}
                    onLoad={() => handleImageLoad(i)}
                    className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${
                      loadedImages[i] ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </div>
                <div className="p-4 font-mono">
                  <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed">
                    {post.time.split("|").map((part, idx) => (
                      <span key={idx}>
                        {idx > 0 && (
                          <span className="mx-2" aria-hidden="true">
                            |
                          </span>
                        )}
                        {part.trim()}
                      </span>
                    ))}
                  </p>
                  <h3 className="font-bold text-foreground mb-2 text-sm leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {post.excerpt}
                  </p>
                  <p className="text-[11px] text-primary mt-3 group-hover:underline">
                    Ler mais →
                  </p>
                </div>
              </article>
            ))}
      </div>
    </section>
  );
}
