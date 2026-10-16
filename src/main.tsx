import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import {
  simulatePriceChange,
  startAutoPriceSimulation,
  stopAutoPriceSimulation,
  simulateAllPriceChanges,
} from "./lib/realtime";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Os dados ficam "frescos" por 5 minutos por padrão
      retry: 1, // Tenta novamente 1 vez em caso de falha
    },
  },
});

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

async function enableMocking() {
  if (!import.meta.env.DEV) {
    return;
  }

  const { worker } = await import("./mocks/browser");

  // Isso inicia o Service Worker no navegador
  return worker.start({
    onUnhandledRequest: "bypass", // Ignora requisições reais (como as do Vite)
  });
}
if (typeof window !== "undefined") {
  (window as any).simulatePriceChange = simulatePriceChange;
  (window as any).startAutoSimulation = startAutoPriceSimulation;
  (window as any).stopAutoSimulation = stopAutoPriceSimulation;
  (window as any).simulateAllPriceChanges = simulateAllPriceChanges;
}
enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  );
});
