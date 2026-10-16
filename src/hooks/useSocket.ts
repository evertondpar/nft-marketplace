import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { RealtimeServer } from "@/lib/realtime";
import type { NFTItem } from "@/types";

export function useSocket() {
  const queryClient = useQueryClient();
  const [priceChangeAlert, setPriceChangeAlert] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = RealtimeServer.subscribe((event, data) => {
      if (event === "nfts.updated") {
        console.log("⚡ Preços das NFTs atualizados:", data);

        queryClient.setQueriesData({ queryKey: ["nfts"] }, (oldData: any) => {
          if (!oldData) return oldData;

          // Query de catálogo com paginação no formato { items: [...] }
          if (Array.isArray(oldData.items)) {
            const updatedById = new Map(
              data.nfts.map((nft: NFTItem) => [nft.id, nft]),
            );

            return {
              ...oldData,
              items: oldData.items.map(
                (nft: NFTItem) => updatedById.get(nft.id) ?? nft,
              ),
            };
          }

          // Query que retorna diretamente um array
          if (Array.isArray(oldData)) {
            const updatedById = new Map(
              data.nfts.map((nft: NFTItem) => [nft.id, nft]),
            );

            return oldData.map(
              (nft: NFTItem) => updatedById.get(nft.id) ?? nft,
            );
          }

          return oldData;
        });
      }
      if (event === "nft.updated") {
        console.log(
          "⚡ Evento nft.updated recebido. Recarregando React Query...",
          data,
        );

        // FORÇA O REACT QUERY A REFAZER O GET /api/nfts IMEDIATAMENTE!
        // Como o localStorage já foi atualizado pelo simulatePriceChange, o novo GET traz os dados atualizados.
        queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey[0] === "nfts" || query.queryKey[0] === "nft",
        });

        // Alerta caso o item esteja no carrinho
        const currentCart = queryClient.getQueryData<{ items: any[] }>([
          "cart",
        ]);
        const isItemInCart = currentCart?.items?.some(
          (item) => item.id === data.id,
        );

        if (isItemInCart) {
          setPriceChangeAlert(
            `O preço de "${data.nft.name}" foi alterado para ${data.nft.price} ETH!`,
          );
          queryClient.invalidateQueries({ queryKey: ["quote"] });
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient]);

  return {
    priceChangeAlert,
    clearAlert: () => setPriceChangeAlert(null),
  };
}
