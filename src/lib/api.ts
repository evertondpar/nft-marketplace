import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  // Aqui depois podemos colocar os interceptors para tratar tokens de sessão
});
