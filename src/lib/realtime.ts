import { db } from "@/mocks/store";
import type { NFTItem } from "@/types";

// Canal de transmissão nativo do navegador (simula o Socket.IO)
export class RealtimeServer {
  private static channel = new BroadcastChannel("nft-marketplace-socket");

  private static listeners = new Set<(event: string, payload: any) => void>();

  static emit(event: string, payload: any) {
    // Notifica os assinantes desta mesma aba
    this.listeners.forEach((callback) => {
      callback(event, payload);
    });

    // Notifica as outras abas
    this.channel.postMessage({ event, payload });
  }

  static subscribe(callback: (event: string, payload: any) => void) {
    const handler = (msg: MessageEvent) => {
      if (msg.data?.event) {
        callback(msg.data.event, msg.data.payload);
      }
    };

    this.listeners.add(callback);
    this.channel.addEventListener("message", handler);

    return () => {
      this.listeners.delete(callback);
      this.channel.removeEventListener("message", handler);
    };
  }
}

// export class RealtimeServer {
//   private static channel = new BroadcastChannel("nft-marketplace-socket");
//   private static localListeners: Array<(event: string, payload: any) => void> =
//     [];

//   static emit(event: string, payload: any) {
//     // Dispara para outras abas
//     this.channel.postMessage({ event, payload });
//     // Dispara para a aba ATUAL (resolve a limitação do BroadcastChannel)
//     this.localListeners.forEach((listener) => listener(event, payload));
//   }

//   static subscribe(callback: (event: string, payload: any) => void) {
//     // Listener para outras abas
//     const handleBroadcast = (msg: MessageEvent) => {
//       if (msg.data?.event) {
//         callback(msg.data.event, msg.data.payload);
//       }
//     };
//     this.channel.addEventListener("message", handleBroadcast);

//     // Listener para a aba atual
//     this.localListeners.push(callback);

//     return () => {
//       this.channel.removeEventListener("message", handleBroadcast);
//       this.localListeners = this.localListeners.filter((cb) => cb !== callback);
//     };
//   }
// }

// Helper para simular alteração de preço
export function simulatePriceChange(nftId: string, newPrice: string) {
  const data = db.read();
  const nfts = [...((data.nfts as NFTItem[]) || [])];
  const cart = [...((data.cart as any[]) || [])];

  const index = nfts.findIndex((n) => n.id === nftId);

  if (index !== -1) {
    // 1. Atualiza no catálogo geral
    nfts[index] = { ...nfts[index], price: newPrice };

    // 2. Atualiza no carrinho (se o NFT estiver no carrinho)
    const updatedCart = cart.map((item) =>
      item.id === nftId ? { ...item, price: newPrice } : item,
    );

    // Persiste ambas as alterações no localStorage
    db.write({ nfts, cart: updatedCart });

    console.log(
      `[Socket.IO Simulado] Preço alterado: NFT #${nftId} -> ${newPrice} ETH`,
    );

    // 3. Emite o evento em tempo real
    RealtimeServer.emit("nft.updated", {
      id: nftId,
      nft: nfts[index],
      version: Date.now(),
    });
  }
}

// Registrar no window para testar no F12
if (typeof window !== "undefined") {
  (window as any).simulatePriceChange = simulatePriceChange;
}

export function simulateAllPriceChanges() {
  const data = db.read();
  const nfts = [...(data.nfts as NFTItem[])];

  if (!nfts.length) return;

  const updatedNfts = nfts.map((nft) => {
    const currentPrice = parseFloat(nft.price);
    const variation = Math.random() * 0.1 - 0.05;

    const newPrice = Math.max(0.01, currentPrice * (1 + variation)).toFixed(2);

    return {
      ...nft,
      price: newPrice,
    };
  });

  // Atualiza todas as NFTs de uma vez
  db.write({ nfts: updatedNfts });

  console.log("⚡ Preços de todas as NFTs atualizados.");

  // Emite um único evento com os dados atualizados
  RealtimeServer.emit("nfts.updated", {
    nfts: updatedNfts,
    version: Date.now(),
  });
}

let simulationInterval: number | null = null;

export function startAutoPriceSimulation(intervalMs = 5000) {
  if (simulationInterval !== null) return;

  console.log("⚡ Simulador de mercado em tempo real INICIADO.");

  simulationInterval = window.setInterval(() => {
    simulateAllPriceChanges();
  }, intervalMs);
}

export function stopAutoPriceSimulation() {
  if (simulationInterval !== null) {
    clearInterval(simulationInterval);
    simulationInterval = null;

    console.log("⚡ Simulador de mercado em tempo real PARADO.");
  }
}

if (typeof window !== "undefined") {
  (window as any).startAutoSimulation = startAutoPriceSimulation;
  (window as any).stopAutoSimulation = stopAutoPriceSimulation;
  (window as any).simulateAllPriceChanges = simulateAllPriceChanges;
}

export function simulateOrderUpdate(
  orderId: string,
  status: "confirmed" | "rejected",
) {
  console.log(
    `[Socket.IO Simulado] Atualizando pedido #${orderId} para ${status}`,
  );

  RealtimeServer.emit("order.updated", {
    orderId,
    status,
    version: Date.now(),
  });
}

// Expõe na window para testes no console
if (typeof window !== "undefined") {
  (window as any).simulatePriceChange = simulatePriceChange;
  (window as any).simulateOrderUpdate = simulateOrderUpdate;
}
