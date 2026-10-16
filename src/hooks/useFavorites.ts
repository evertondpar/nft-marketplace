import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "./useAuth";

export function useFavorites() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  // Busca a lista de IDs favoritados (só executa se o usuário estiver logado)
  const { data: favorites = [], isLoading } = useQuery<string[]>({
    queryKey: ["favorites"],
    queryFn: async () => {
      const res = await api.get("/favorites");
      return res.data.favorites;
    },
    enabled: isAuthenticated,
  });

  // Mutation para favoritar / desfavoritar
  const toggleFavoriteMutation = useMutation({
    mutationFn: async (nftId: string) => {
      const res = await api.post("/favorites", { nftId });
      return res.data.favorites;
    },
    onMutate: async (nftId) => {
      // Atualização otimista para a UI responder na hora, sem esperar a API
      await queryClient.cancelQueries({ queryKey: ["favorites"] });
      const previousFavorites = queryClient.getQueryData<string[]>([
        "favorites",
      ]);

      queryClient.setQueryData<string[]>(["favorites"], (old = []) =>
        old.includes(nftId)
          ? old.filter((id) => id !== nftId)
          : [...old, nftId],
      );

      return { previousFavorites };
    },
    onError: (_err, _nftId, context) => {
      // Reverte em caso de erro
      if (context?.previousFavorites) {
        queryClient.setQueryData(["favorites"], context.previousFavorites);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  return {
    favorites,
    isLoading,
    toggleFavorite: toggleFavoriteMutation.mutate,
    isToggling: toggleFavoriteMutation.isPending,
  };
}
