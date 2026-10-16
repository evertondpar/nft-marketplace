import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { NFTItem, CartItem } from "@/types";

export function useCart() {
  const queryClient = useQueryClient();

  // Quantidade total de itens para o badge do Header
  const { data: cartItems = [] } = useQuery<CartItem[]>({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await api.get("/cart");
      return res.data.items;
    },
  });

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Mutation para Adicionar ao Carrinho
  const addToCartMutation = useMutation({
    mutationFn: async (nft: NFTItem) => {
      const res = await api.post("/cart", {
        id: nft.id,
        name: nft.name,
        price: nft.price,
        currency: nft.currency,
        image: nft.image,
        quantity: 1,
      });
      return res.data;
    },
    onSuccess: () => {
      // Invalida a query 'cart' para atualizar o badge e a página de carrinho automaticamente
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  return {
    cartItems,
    cartCount,
    addToCart: addToCartMutation.mutate,
    isAdding: addToCartMutation.isPending,
  };
}
