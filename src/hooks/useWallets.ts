import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { WalletItem } from "@/types";

export function useWallets() {
  const queryClient = useQueryClient();

  // 1. Buscar carteiras do usuário
  const { data: wallets = [], isLoading } = useQuery<WalletItem[]>({
    queryKey: ["wallets"],
    queryFn: async () => {
      const res = await api.get("/wallets");
      return res.data.wallets;
    },
  });

  // 2. Cadastrar / Atualizar Carteira
  const saveWalletMutation = useMutation({
    mutationFn: async (wallet: WalletItem) => {
      const res = await api.post("/wallets", wallet);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    },
  });

  const setPrimaryWalletMutation = useMutation({
    mutationFn: async (walletId: string) => {
      const res = await api.put(`/wallets/${walletId}/primary`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    },
  });

  return {
    wallets,
    isLoading,
    saveWallet: saveWalletMutation.mutateAsync,
    setPrimaryWallet: setPrimaryWalletMutation.mutateAsync,
    isSaving: saveWalletMutation.isPending,
  };
}
