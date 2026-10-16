import { ShoppingCart, Heart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import type { NFTItem } from "@/types";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites"; // <-- 1. Importar hook de favoritos
import { useAuth } from "@/hooks/useAuth";

export function NFTCard({
  id,
  name,
  price,
  originalPrice,
  currency,
  image,
}: NFTItem) {
  const { addToCart, isAdding } = useCart();
  const { favorites, toggleFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();

  // Verifica se este NFT específico está nos favoritos
  const isFavorited = favorites.includes(id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Evita navegar para a tela de detalhes ao clicar no botão
    e.stopPropagation();
    addToCart({ id, name, price, originalPrice, currency, image });
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      alert("Faça login para adicionar NFTs aos favoritos!"); // Simples alerta (você pode trocar por abrir o AuthModal)
      return;
    }

    toggleFavorite(id);
  };
  return (
    <Link // Isso avisa ao navegador que o elemento recebe foco do Tab
      to="/nft/$nftId"
      params={{ nftId: id }}
      role="link" // Avisa ao leitor de tela que isso funciona como um link
      aria-label={`Ver detalhes do NFT ${name}`} // Narração para deficientes visuais
      className="flex flex-col group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl transition-all"
    >
      {/* Container da Imagem */}
      <div className="relative aspect-square overflow-hidden rounded-[1rem] bg-secondary/50">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Overlay escuro que aparece no Hover - Os botões internos também recebem foco individualmente! */}
        <div className="absolute inset-0 bg-background/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus-within:opacity-100 flex items-center justify-center gap-3">
          <Button
            onClick={handleAddToCart}
            disabled={isAdding}
            variant="secondary"
            size="icon"
            className="h-10 w-10 rounded-full bg-background/90 hover:bg-background text-foreground hover:text-primary transition-transform active:scale-95"
            title="Adicionar ao Carrinho"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleToggleFavorite}
            variant="secondary"
            size="icon"
            className={`h-10 w-10 rounded-full transition-transform active:scale-95 ${
              isFavorited
                ? "bg-background text-red-500 hover:bg-background/90 hover:text-red-600"
                : "bg-background/90 text-foreground hover:bg-background hover:text-red-500"
            }`}
            title={
              isFavorited ? "Remover dos Favoritos" : "Adicionar aos Favoritos"
            }
          >
            {/* fill-current preenche o coração se favoritado */}
            <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-10 w-10 rounded-full bg-background/90 hover:bg-background text-foreground hover:text-primary"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Informações do NFT */}
      <div className="mt-3 flex flex-col space-y-1">
        <h3 className="text-[15px] font-semibold text-foreground">
          {name} <span className="font-mono text-muted-foreground">#{id}</span>
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-mono font-bold text-primary">
            {price} {currency}
          </span>
          {originalPrice && (
            <span className="text-[11px] font-mono text-muted-foreground line-through">
              {originalPrice} {currency}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
