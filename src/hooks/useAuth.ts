import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { UserProfile } from "@/types";

export function useAuth() {
  const queryClient = useQueryClient();

  // Buscar usuário logado
  const { data: user, isLoading } = useQuery<UserProfile | null>({
    queryKey: ["auth-user"],
    queryFn: async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) return null;

        // Injeta o token nas requisições
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const res = await api.get("/auth/me");
        return res.data.user;
      } catch {
        localStorage.removeItem("auth_token");
        delete api.defaults.headers.common["Authorization"];
        return null;
      }
    },
    retry: false,
    staleTime: Infinity,
  });

  // Mutation de Login
  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const res = await api.post("/auth/login", credentials);
      return res.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("auth_token", data.token);
      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      queryClient.setQueryData(["auth-user"], data.user);

      // Atualiza e sincroniza os dados do carrinho e favoritos do utilizador
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  // Mutation de Registro
  const registerMutation = useMutation({
    mutationFn: async (userData: {
      name?: string;
      username: string;
      email: string;
      password: string;
    }) => {
      const res = await api.post("/auth/register", userData);
      return res.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("auth_token", data.token);
      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      queryClient.setQueryData(["auth-user"], data.user);
    },
  });

  // Mutation de Logout
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout");
    },
    onSuccess: () => {
      localStorage.removeItem("auth_token");
      delete api.defaults.headers.common["Authorization"];
      queryClient.setQueryData(["auth-user"], null);
      queryClient.invalidateQueries();
    },
  });

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    isSubmitting: loginMutation.isPending || registerMutation.isPending,
  };
}
