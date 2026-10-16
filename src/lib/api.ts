import axios from "axios";

export const api = axios.create({
  baseURL: "/api", // ou a sua baseURL
});

// Adiciona o token no cabeçalho de todas as requisições
api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceta respostas globais para tratar a EXPIRAÇÃO (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se o backend disser que a sessão expirou ou é inválida
    if (error.response && error.response.status === 401) {
      console.warn("Sessão expirada. Redirecionando para login...");

      // 1. Limpa o token
      localStorage.removeItem("auth_token");

      // 2. Opcional: Dispara um evento para limpar o cache do TanStack Query
      window.dispatchEvent(new Event("session_expired"));

      // 3. Redireciona para a home (se não estiver já lá)
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  },
);
