import { Search, ShoppingCart, LogIn, Menu, X, LogOut } from "lucide-react";
// Importando o botão do Shadcn (ajuste o caminho se necessário)
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AuthModal } from "../auth/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";

export function Header() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();

  const closeMenu = () => setIsMenuOpen(false);

  // Fecha o menu com a tecla Esc
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

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
            {/* Busca (somente desktop) */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:inline-flex hover:text-primary"
              aria-label="Buscar NFTs"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Carrinho (somente desktop) */}
            <Link to="/cart" className="hidden md:block">
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

            {/* Entrar / Perfil (somente desktop) */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-3">
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

            {/* Menu Mobile (botão hambúrguer) */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:text-primary"
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu principal"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* PAINEL DO MENU MOBILE */}
        {isMenuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden border-t border-border bg-background animate-in fade-in slide-in-from-top-2"
          >
            <div className="container mx-auto flex flex-col gap-1 px-4 py-4">
              {/* 1. Entrar / Perfil */}
              {isAuthenticated ? (
                <Link to="/profile" onClick={closeMenu}>
                  <Button
                    variant="ghost"
                    className="h-12 w-full justify-start gap-3 font-mono text-sm font-bold hover:text-primary"
                  >
                    <img
                      src={user?.avatar}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full object-cover border border-primary"
                    />
                    Perfil
                  </Button>
                </Link>
              ) : (
                <Button
                  onClick={() => {
                    closeMenu();
                    setIsAuthOpen(true);
                  }}
                  className="h-12 w-full justify-start font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                  aria-label="Entrar na sua conta"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Entrar
                </Button>
              )}

              {/* 2. Busca */}
              <Button
                variant="ghost"
                className="h-12 w-full justify-start hover:text-primary"
                aria-label="Buscar NFTs"
                onClick={closeMenu}
              >
                <Search className="mr-3 h-5 w-5" />
                Buscar
              </Button>

              {/* 3. Carrinho */}
              <Link to="/cart" onClick={closeMenu}>
                <Button
                  variant="ghost"
                  className="h-12 w-full justify-start hover:text-primary"
                  aria-label="Carrinho de compras"
                >
                  <ShoppingCart className="mr-3 h-5 w-5" />
                  Carrinho
                  {cartCount > 0 && (
                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Navegação (oculta no mobile fora do menu) */}
              <nav className="mt-2 flex flex-col gap-1 border-t border-border pt-3 text-sm font-medium">
                <a
                  href="/"
                  onClick={closeMenu}
                  className="rounded-sm px-4 py-3 text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Início
                </a>
                <a
                  href="/mercado"
                  onClick={closeMenu}
                  className="rounded-sm px-4 py-3 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Mercado
                </a>
                <a
                  href="/criadores"
                  onClick={closeMenu}
                  className="rounded-sm px-4 py-3 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Criadores
                </a>
              </nav>

              {/* Sair (apenas logado) */}
              {isAuthenticated && (
                <Button
                  onClick={() => {
                    closeMenu();
                    logout();
                  }}
                  variant="ghost"
                  className="mt-2 h-12 w-full justify-start border-t border-border rounded-none text-muted-foreground hover:text-red-500"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Sair
                </Button>
              )}
            </div>
          </div>
        )}
      </header>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
