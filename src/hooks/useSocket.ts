import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { RealtimeServer } from "@/lib/realtime";
import type {
  NFTItem,
  OrderSnapshot,
  OrderUpdatedEvent,
  UserProfile,
} from "@/types";

export function useSocket() {
  const queryClient = useQueryClient();
  const [priceChangeAlert, setPriceChangeAlert] = useState<string | null>(null);

  function handleOrderUpdated(
    event: OrderUpdatedEvent,
    currentUser: UserProfile | null,
  ) {
    // 1. Isolamento de sessão: Ignora eventos de outros usuários ou sessões
    if (!currentUser || event.userId !== currentUser.id) return;

    const currentOrder = queryClient.getQueryData<OrderSnapshot>([
      "order",
      event.orderId,
    ]);

    if (currentOrder) {
      // 2. Proteção de Estado Terminal: Confirmado ou Recusado não regridem nem re-executam efeitos
      if (
        currentOrder.status === "confirmed" ||
        currentOrder.status === "rejected"
      ) {
        return;
      }

      // 3. Tolerância a eventos antigos/duplicados: Ignora versões <= à versão atual
      if (event.version <= (currentOrder.version || 0)) {
        return;
      }
    }

    // Atualiza o estado no React Query com a versão mais recente
    queryClient.setQueryData(["order", event.orderId], {
      ...event.snapshot,
      status: event.status,
      version: event.version,
    });
  }

  useEffect(() => {
    const unsubscribe = RealtimeServer.subscribe((event, data) => {
      if (event === "nfts.updated") {
        console.log("⚡ Preços das NFTs atualizados:", data);

        const updatedById = new Map<string, NFTItem>(
          data.nfts.map((nft: NFTItem) => [nft.id, nft]),
        );

        // Atualiza o catálogo no cache sem novos GETs
        queryClient.setQueriesData({ queryKey: ["nfts"] }, (oldData: any) => {
          if (!oldData) return oldData;

          if (Array.isArray(oldData.items)) {
            return {
              ...oldData,
              items: oldData.items.map(
                (nft: NFTItem) => updatedById.get(nft.id) ?? nft,
              ),
            };
          }

          if (Array.isArray(oldData)) {
            return oldData.map(
              (nft: NFTItem) => updatedById.get(nft.id) ?? nft,
            );
          }

          return oldData;
        });

        // Verifica se alguma NFT atualizada está no carrinho
        const cartItems = queryClient.getQueryData<NFTItem[]>(["cart"]) ?? [];

        const changedCartNft = cartItems.find((item) =>
          updatedById.has(item.id),
        );

        if (changedCartNft) {
          const updatedNft = updatedById.get(changedCartNft.id)!;

          setPriceChangeAlert(
            `O preço de "${updatedNft.name}" foi atualizado para ${updatedNft.price} ETH!`,
          );

          // Solicita uma nova cotação
          queryClient.invalidateQueries({ queryKey: ["quote"] });
        }
      }
      if (event === "nft.updated") {
        console.log("⚡ Evento nft.updated recebido:", data);
        queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey[0] === "nfts" || query.queryKey[0] === "nft",
        });

        const currentCart = queryClient.getQueryData<any[]>(["cart"]);
        const isItemInCart = currentCart?.some((item) => item.id === data.id);
        if (isItemInCart) {
          setPriceChangeAlert(
            `O preço de "${data.nft.name}" foi alterado para ${data.nft.price} ETH!`,
          );
          queryClient.invalidateQueries({ queryKey: ["quote"] });
        }
        // 1. Atualiza o cache do carrinho OTIMISTICAMENTE
        queryClient.setQueryData(["cart"], (oldCartData: any) => {
          if (!oldCartData) return oldCartData;

          // Se o retorno do carrinho for um array direto
          if (Array.isArray(oldCartData)) {
            return oldCartData.map((item: any) =>
              item.id === data.id ? { ...item, price: data.nft.price } : item,
            );
          }

          // Se for um objeto { items: [...] }
          if (oldCartData.items && Array.isArray(oldCartData.items)) {
            return {
              ...oldCartData,
              items: oldCartData.items.map((item: any) =>
                item.id === data.id ? { ...item, price: data.nft.price } : item,
              ),
            };
          }

          return oldCartData;
        });

        // 2. Invalida as queries para sincronizar com a API REST em segundo plano
        queryClient.invalidateQueries({
          queryKey: ["cart"],
          refetchType: "all",
        });
        queryClient.invalidateQueries({
          queryKey: ["nfts"],
          refetchType: "all",
        });
        queryClient.invalidateQueries({
          queryKey: ["nft", data.id],
          refetchType: "all",
        });
        queryClient.invalidateQueries({
          queryKey: ["quote"],
          refetchType: "all",
        });
      }
      // if (event === "nft.updated") {
      //   console.log(
      //     "⚡ Evento nft.updated recebido. Recarregando React Query...",
      //     data,
      //   );
      //   // FORÇA O REACT QUERY A REFAZER O GET /api/nfts IMEDIATAMENTE!
      //   // Como o localStorage já foi atualizado pelo simulatePriceChange, o novo GET traz os dados atualizados.
      //   console.log("não recarregou");
      //   queryClient.invalidateQueries({
      //     predicate: (query) =>
      //       query.queryKey[0] === "nfts" || query.queryKey[0] === "nft",
      //   });
      //   console.log(" recarregou");

      //   // Alerta caso o item esteja no carrinho
      //   const currentCart = queryClient.getQueryData<any[]>(["cart"]);
      //   const isItemInCart = currentCart?.some((item) => item.id === data.id);

      //   console.log(
      //     "currentCart",
      //     currentCart,
      //     "isItemInCart",
      //     isItemInCart,
      //     "data",
      //     data,
      //   );

      //   if (isItemInCart) {
      //     setPriceChangeAlert(
      //       `O preço de "${data.nft.name}" foi alterado para ${data.nft.price} ETH!`,
      //     );
      //     queryClient.invalidateQueries({ queryKey: ["quote"] });
      //   }
      // }
      // if (event === "nft.updated") {
      //   console.log("⚡ Evento nft.updated no Checkout:", data);

      //   // 1. Atualiza as queries do catálogo/detalhes
      //   queryClient.invalidateQueries({
      //     queryKey: ["nfts"],
      //     refetchType: "all",
      //   });
      //   queryClient.invalidateQueries({
      //     queryKey: ["nft", data.id],
      //     refetchType: "all",
      //   });

      //   // 2. FUNDAMENTAL PARA O CHECKOUT: Re-busca o carrinho para pegar os novos preços dos itens
      //   queryClient.invalidateQueries({
      //     queryKey: ["cart"],
      //     refetchType: "all",
      //   });

      //   // 3. Força o recálculo imediato da cotação
      //   queryClient.invalidateQueries({
      //     queryKey: ["quote"],
      //     refetchType: "all",
      //   });
      // }
      if (event === "order.updated") {
        console.log("⚡ Evento order.updated recebido:", data);

        queryClient.setQueryData(["order", data.orderId], (oldOrder: any) => {
          // Proteção de estado terminal: se já estiver confirmado ou recusado, ignora eventos antigos
          if (
            oldOrder?.status === "confirmed" ||
            oldOrder?.status === "rejected"
          ) {
            return oldOrder;
          }
          return {
            ...oldOrder,
            status: data.status,
            version: data.version,
          };
        });

        queryClient.invalidateQueries({ queryKey: ["order", data.orderId] });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient]);

  return {
    priceChangeAlert,
    clearAlert: () => setPriceChangeAlert(null),
    handleOrderUpdated,
  };
}
