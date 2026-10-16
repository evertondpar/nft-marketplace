import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useSocket } from "@/hooks/useSocket"; // <-- Importar hook

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  // Ativa a escuta do Socket.IO em toda a aplicação
  const { priceChangeAlert, clearAlert } = useSocket();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      {/* Banner de alerta dinâmico se o preço de um item no carrinho mudar */}
      {priceChangeAlert && (
        <div className="bg-yellow-500/20 border-y border-yellow-500/40 px-4 py-2 text-xs font-mono text-yellow-500 flex justify-between items-center">
          <span>⚠️ {priceChangeAlert}</span>
          <button onClick={clearAlert} className="underline font-bold">
            Entendi
          </button>
        </div>
      )}

      <Outlet />
      <Footer />
    </div>
  );
}
