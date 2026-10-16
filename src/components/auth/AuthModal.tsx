import { useState } from "react";
import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mobile (< md): visual do Figma, sem rótulos, campos arredondados e transparentes.
// Desktop (>= md): mantém o visual anterior do modal.
const inputClass =
  "w-full bg-transparent md:bg-background border border-border rounded-xl md:rounded-md px-4 md:px-3 py-3.5 md:py-2.5 text-sm md:text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary md:focus:ring-1 md:focus:ring-primary";
const labelClass =
  "sr-only md:not-sr-only md:block text-[11px] text-muted-foreground mb-1";
const eyeButtonClass =
  "absolute right-4 md:right-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-foreground";
const socialButtonClass =
  "w-full h-10 md:h-auto md:py-2.5 px-4 border border-border rounded md:rounded-md bg-transparent md:bg-background text-[13px] md:text-xs font-bold md:font-normal text-muted-foreground md:text-foreground flex items-center justify-center gap-3 md:gap-2 hover:bg-secondary/50 transition-colors";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 5.04c1.94 0 3.51.68 4.75 1.81l3.47-3.47C18.1 1.43 15.3.3 12 .3 7.4.3 3.43 2.93 1.5 6.77l4.04 3.14C6.5 7.2 9 5.04 12 5.04z"
      />
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.85-.07-1.46-.22-2.09H12v3.8h6.6c-.13 1.05-.85 2.63-2.45 3.69l3.77 2.92c2.25-2.08 3.58-5.14 3.58-8.32z"
      />
      <path
        fill="#FBBC05"
        d="M5.54 14.09A7.2 7.2 0 0 1 5.16 12c0-.73.13-1.43.36-2.09L1.5 6.77A11.7 11.7 0 0 0 .3 12c0 1.88.45 3.66 1.2 5.23l4.04-3.14z"
      />
      <path
        fill="#34A853"
        d="M12 23.7c3.3 0 6.07-1.09 8.09-2.96l-3.77-2.92c-1.05.7-2.38 1.2-4.32 1.2-3 0-5.5-2.16-6.46-5.06l-4.04 3.14C3.43 21.07 7.4 23.7 12 23.7z"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <path
        fill="#3B5998"
        d="M13.5 22v-8.2h2.8l.5-3.3h-3.3V8.4c0-.95.45-1.7 1.8-1.7h1.6V3.8S15.6 3.5 14.3 3.5c-2.7 0-4.3 1.6-4.3 4.5v2.5H7.2v3.3H10V22h3.5z"
      />
    </svg>
  );
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

  const eyeIcon = showPassword ? (
    <EyeOff className="w-4 h-4" />
  ) : (
    <Eye className="w-4 h-4" />
  );
  const eyeLabel = showPassword ? "Ocultar senha" : "Exibir senha";

  return (
    <div className="fixed inset-0 z-50 bg-background/90 md:bg-background/80 md:backdrop-blur-sm flex items-center justify-center md:p-4">
      <div className="relative w-full h-full md:h-auto md:max-w-md bg-background md:bg-secondary/90 border-0 md:border md:border-border md:rounded-2xl px-7 pt-32 pb-6 md:p-8 flex flex-col justify-start shadow-2xl overflow-y-auto">
        {/* Fechar */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 md:right-8 md:top-8 text-muted-foreground hover:text-foreground p-2"
          aria-label="Fechar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Topo */}
        <div className="flex flex-col items-center mb-8 md:mb-6">
          <h2 className="text-3xl tracking-widest font-mono font-bold text-foreground mb-20 md:text-xl md:tracking-normal md:mb-6 md:hidden">
            KURIO
          </h2>

          {/* Título mobile (sem abas) */}
          <h3 className="md:hidden text-lg font-mono font-bold text-foreground text-center">
            {tab === "login" ? "Entrar" : "Criar perfil de colecionador"}
          </h3>

          {/* Abas Entrar | Criar conta (desktop) */}
          <div className="hidden md:flex items-center space-x-4 text-sm font-mono font-bold">
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

        {/* Descrição curta (desktop) */}
        <p className="hidden md:block text-xs font-mono text-muted-foreground text-center mb-6">
          {tab === "login"
            ? "Entre para gerenciar sua carteira, coleção e perfil de criador."
            : "Crie seu perfil de colecionador e conecte uma carteira quando quiser."}
        </p>

        {/* Mensagem de Erro da API/Validação */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-md text-red-500 text-xs font-mono text-center"
          >
            {errorMessage}
          </div>
        )}

        {/* Formulários */}
        {tab === "login" ? (
          <form
            onSubmit={handleLoginSubmit}
            className="flex flex-col gap-3 md:gap-4 font-mono"
          >
            <div>
              <label htmlFor="login-email" className={labelClass}>
                E-mail
              </label>
              <input
                id="login-email"
                type="email"
                placeholder="contato@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="login-password" className={labelClass}>
                Senha
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="***********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={eyeLabel}
                  className={eyeButtonClass}
                >
                  {eyeIcon}
                </button>
              </div>
            </div>

            <div className="text-right">
              <a
                href="#"
                className="text-sm md:text-[11px] text-primary hover:underline"
              >
                Esqueceu a senha?
              </a>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-[60px] md:h-auto md:py-6 rounded-xl md:rounded-md text-base md:text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 mt-6 md:mt-2 flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Entrar
            </Button>
          </form>
        ) : (
          <form
            onSubmit={handleRegisterSubmit}
            className="flex flex-col gap-3 md:gap-4 font-mono"
          >
            <div>
              <label htmlFor="register-username" className={labelClass}>
                Nome de usuário
              </label>
              <input
                id="register-username"
                type="text"
                placeholder="Nome de usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="register-email" className={labelClass}>
                E-mail
              </label>
              <input
                id="register-email"
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="register-password" className={labelClass}>
                Senha
              </label>
              <div className="relative">
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={eyeLabel}
                  className={eyeButtonClass}
                >
                  {eyeIcon}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="register-confirm-password" className={labelClass}>
                Confirmar senha
              </label>
              <div className="relative">
                <input
                  id="register-confirm-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirmar senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={eyeLabel}
                  className={eyeButtonClass}
                >
                  {eyeIcon}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-[60px] md:h-auto md:py-6 rounded-xl md:rounded-md text-base md:text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 mt-7 md:mt-2 flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span className="md:hidden">Criar perfil</span>
              <span className="hidden md:inline">Criar conta</span>
            </Button>
          </form>
        )}

        {/* Divisor */}
        <div className="relative mt-10 mb-3 md:my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <span className="relative bg-background md:bg-secondary/90 px-3 text-xs md:text-[10px] font-mono text-foreground md:text-muted-foreground normal-case md:uppercase">
            Ou continue com
          </span>
        </div>

        {/* Botões Sociais */}
        <div className="space-y-4 md:space-y-3 font-mono">
          <button type="button" className={socialButtonClass}>
            <GoogleIcon />
            Continuar com Google
          </button>
          <button type="button" className={socialButtonClass}>
            <FacebookIcon />
            Continuar com Facebook
          </button>
        </div>

        {/* Rodapé interno alternativo */}
        <div className="mt-10 md:mt-8 text-center font-mono text-sm md:text-xs text-muted-foreground pb-4 md:pb-0">
          {tab === "login" ? (
            <p>
              Novo na Kurio?{" "}
              <button
                type="button"
                onClick={() => {
                  setTab("register");
                  setErrorMessage(null);
                }}
                className="text-muted-foreground md:text-primary hover:underline"
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
                className="text-muted-foreground md:text-primary hover:underline"
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
