import { useState } from "react";
import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { login, register, isSubmitting } = useAuth();

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setUsername("");
    setConfirmPassword("");
    setErrorMessage(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      await login({ email, password });
      handleClose();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Falha ao realizar login. Verifique suas credenciais.";
      setErrorMessage(msg);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage("As senhas não coincidem.");
      return;
    }

    try {
      await register({ username, email, password });
      handleClose();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Falha ao criar conta. Tente novamente.";
      setErrorMessage(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/90 md:bg-background/80 md:backdrop-blur-sm flex items-center justify-center md:p-4">
      <div className="relative w-full h-full md:h-auto md:max-w-md bg-background md:bg-secondary/90 border-0 md:border md:border-border md:rounded-2xl p-6 md:p-8 flex flex-col justify-between md:justify-start shadow-2xl overflow-y-auto">
        {/* Topo / Fechar */}
        <div className="flex flex-col items-center relative mb-6">
          <button
            onClick={handleClose}
            className="absolute right-0 top-0 text-muted-foreground hover:text-foreground p-2"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-xl font-mono font-bold text-foreground mb-6 md:hidden">
            KURIO
          </h2>

          {/* Abas Entrar | Criar conta */}
          <div className="flex items-center space-x-4 text-sm font-mono font-bold">
            <button
              onClick={() => {
                setTab("login");
                setErrorMessage(null);
              }}
              className={`pb-1 transition-colors ${tab === "login" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              Entrar
            </button>
            <span className="text-muted-foreground/40">|</span>
            <button
              onClick={() => {
                setTab("register");
                setErrorMessage(null);
              }}
              className={`pb-1 transition-colors ${tab === "register" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              Criar conta
            </button>
          </div>
        </div>

        {/* Descrição curta */}
        <p className="text-xs font-mono text-muted-foreground text-center mb-6">
          {tab === "login"
            ? "Entre para gerenciar sua carteira, coleção e perfil de criador."
            : "Crie seu perfil de colecionador e conecte uma carteira quando quiser."}
        </p>

        {/* Mensagem de Erro da API/Validação */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-md text-red-500 text-xs font-mono text-center">
            {errorMessage}
          </div>
        )}

        {/* Formulários */}
        {tab === "login" ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4 font-mono">
            <div>
              <label className="text-[11px] text-muted-foreground block mb-1">
                E-mail
              </label>
              <input
                type="email"
                placeholder="contato@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-background border border-border rounded-md px-3 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="relative">
              <label className="text-[11px] text-muted-foreground block mb-1">
                Senha
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="***********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-background border border-border rounded-md px-3 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="text-right">
              <a href="#" className="text-[11px] text-primary hover:underline">
                Esqueceu a senha?
              </a>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-6 font-bold bg-primary text-primary-foreground hover:bg-primary/90 mt-2 flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Entrar
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-4 font-mono">
            <div>
              <label className="text-[11px] text-muted-foreground block mb-1">
                Nome de usuário
              </label>
              <input
                type="text"
                placeholder="satoshi_nakamoto"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-background border border-border rounded-md px-3 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-[11px] text-muted-foreground block mb-1">
                E-mail
              </label>
              <input
                type="email"
                placeholder="seuemail@dominio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-background border border-border rounded-md px-3 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="relative">
              <label className="text-[11px] text-muted-foreground block mb-1">
                Senha
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-background border border-border rounded-md px-3 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="relative">
              <label className="text-[11px] text-muted-foreground block mb-1">
                Confirmar senha
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirmar senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-background border border-border rounded-md px-3 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary pr-10"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-6 font-bold bg-primary text-primary-foreground hover:bg-primary/90 mt-2 flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Criar conta
            </Button>
          </form>
        )}

        {/* Divisor */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <span className="relative bg-background md:bg-secondary/90 px-3 text-[10px] font-mono text-muted-foreground uppercase">
            Ou continue com
          </span>
        </div>

        {/* Botões Sociais */}
        <div className="space-y-3 font-mono">
          <button
            type="button"
            className="w-full py-2.5 px-4 border border-border rounded-md bg-background text-xs text-foreground flex items-center justify-center gap-2 hover:bg-secondary/50 transition-colors"
          >
            <span className="font-bold text-blue-400">G</span> Continuar com
            Google
          </button>
          <button
            type="button"
            className="w-full py-2.5 px-4 border border-border rounded-md bg-background text-xs text-foreground flex items-center justify-center gap-2 hover:bg-secondary/50 transition-colors"
          >
            <span className="font-bold text-blue-600">f</span> Continuar com
            Facebook
          </button>
        </div>

        {/* Rodapé interno alternativo */}
        <div className="mt-8 text-center font-mono text-xs text-muted-foreground pb-4 md:pb-0">
          {tab === "login" ? (
            <p>
              Novo na Kurio?{" "}
              <button
                type="button"
                onClick={() => {
                  setTab("register");
                  setErrorMessage(null);
                }}
                className="text-primary hover:underline"
              >
                Crie uma conta
              </button>
            </p>
          ) : (
            <p>
              Já tem uma conta?{" "}
              <button
                type="button"
                onClick={() => {
                  setTab("login");
                  setErrorMessage(null);
                }}
                className="text-primary hover:underline"
              >
                Entre
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
