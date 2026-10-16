import { Search, ShoppingCart, LogIn, Menu } from "lucide-react";
// Importando o botão do Shadcn (ajuste o caminho se necessário)
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthModal } from "../auth/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";
import { useCart } from "@/hooks/useCart";

export function Header() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
          {/* LOGO */}
          <div className="flex items-center">
            <a
              href="/"
              className="text-xl font-mono font-bold tracking-widest text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
            >
              KURIO
            </a>
          </div>

          {/* NAVEGAÇÃO CENTRAL */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <a
              href="/"
              className="text-primary border-b-2 border-primary py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              Início
            </a>
            <a
              href="/mercado"
              className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              Mercado
            </a>
            <a
              href="/criadores"
              className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              Criadores
            </a>
          </nav>

          {/* AÇÕES */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Busca - Usando Button do Shadcn com variant="ghost" (sem fundo) e size="icon" (quadrado perfeito) */}
            <Button
              variant="ghost"
              size="icon"
              className="hover:text-primary"
              aria-label="Buscar NFTs"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Carrinho */}
            <Link to="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:text-primary"
                aria-label="Carrinho de compras"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-in zoom-in">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Botão Entrar (Desktop) - Usando variant="default" (que pega nossa cor laranja automaticamente) */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/profile">
                  <div className="flex items-center gap-2 font-mono text-xs text-foreground">
                    <img
                      src={user?.avatar}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full object-cover border border-primary"
                    />
                    <span className="hidden sm:inline font-bold">
                      {user?.username}
                    </span>
                  </div>
                </Link>
                <Button
                  onClick={() => logout()}
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-red-500"
                  title="Sair"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setIsAuthOpen(true)}
                className="hidden md:flex font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                aria-label="Entrar na sua conta"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Entrar
              </Button>
            )}

            {/* Menu Mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:text-primary"
              aria-label="Menu principal"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
