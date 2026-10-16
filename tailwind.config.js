/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "#2A221C",
        input: "#2A221C",
        ring: "#D9834A",
        background: "#130D0A", // O fundo escuro principal do Kurio
        foreground: "#F2EBE3", // Texto claro padrão
        primary: {
          DEFAULT: "#D9834A", // O laranja/cobre dos botões e preços
          foreground: "#130D0A",
        },
        secondary: {
          DEFAULT: "#231913", // Fundos de cards e painéis
          foreground: "#F2EBE3",
        },
        muted: {
          DEFAULT: "#2A221C",
          foreground: "#8E8279", // Texto de apoio/secundário
        },
        accent: {
          DEFAULT: "#231913",
          foreground: "#D9834A",
        },
      },
      fontFamily: {
        // Vamos usar tipografias padrão do Google Fonts que combinam com o layout
        sans: ['Inter', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'], // Usado nos IDs, preços e detalhes
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [],
}