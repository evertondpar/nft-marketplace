import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      {/* O Outlet é onde as páginas (Início, Carrinho, etc) vão ser renderizadas */}
      <Outlet />
      <Footer />
    </div>
  ),
});
