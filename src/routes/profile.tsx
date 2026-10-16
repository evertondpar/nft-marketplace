// src/routes/profile.tsx
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useWallets } from "@/hooks/useWallets";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import {
  User,
  Wallet,
  Activity,
  Heart,
  Tag,
  Download,
  HelpCircle,
  LogOut,
  Eye,
  EyeOff,
  Check,
  Loader2,
  Circle,
} from "lucide-react";
import type { UserProfile, WalletItem } from "@/types";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/profile")({
  beforeLoad: () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw redirect({ to: "/" });
    }
  },
  component: ProfilePage,
});

function ProfilePage() {
  const queryClient = useQueryClient();
  const { user, logout, isLoading: isLoadingAuth } = useAuth();
  const {
    wallets,
    saveWallet,
    isSaving: isSavingWallet,
    setPrimaryWallet,
  } = useWallets();
  const [activeTab, setActiveTab] = useState<"profile" | "wallets">("profile");

  // Estados de Dados do Perfil
  const [displayName, setDisplayName] = useState(user?.name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [ensName, setEnsName] = useState("");
  const [walletAlias, setWalletAlias] = useState("");
  const [avatar, setAvatar] = useState(
    user?.avatar || "https://i.pravatar.cc/150?img=3",
  );
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Estados de Senha
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Estados do Formulário de Carteira
  const [editingWalletId, setEditingWalletId] = useState<string | null>(null);
  const [walletDisplayName, setWalletDisplayName] = useState("");
  const [walletNameAlias, setWalletNameAlias] = useState("");
  const [walletNetwork, setWalletNetwork] = useState("");
  const [walletProfileName, setWalletProfileName] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [walletEnsSecondary, setWalletEnsSecondary] = useState("");
  const [walletType, setWalletType] = useState("");
  const [walletReferral, setWalletReferral] = useState("");
  const [walletEmail, setWalletEmail] = useState("");
  const [walletEnsName, setWalletEnsName] = useState("");
  const [walletSuccess, setWalletSuccess] = useState(false);

  useEffect(() => {
    const handleFillUserData = (userData: UserProfile) => {
      setDisplayName(userData.name || "");
      setUsername(userData.username || "");
      setEmail(userData.email || "");
      setAvatar(userData.avatar || "https://i.pravatar.cc/150?img=3");
    };
    if (user) {
      handleFillUserData(user);
    }
  }, [user]);

  // CRUD: Salvar dados do Perfil
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSuccess(false);

    try {
      await api.put("/profile", {
        name: displayName,
        username,
        email,
        avatar,
      });
      await queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch {
      alert("Erro ao atualizar perfil.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // CRUD: Alterar Senha
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword !== confirmPassword) {
      setPasswordError("As senhas não coincidem.");
      return;
    }

    setIsSavingPassword(true);
    try {
      await api.put("/profile/password", { currentPassword, newPassword });
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: any) {
      setPasswordError(
        err?.response?.data?.message || "Erro ao alterar senha.",
      );
    } finally {
      setIsSavingPassword(false);
    }
  };

  // Lógica de Formulário de Carteiras
  const handleAddNewWallet = () => {
    setEditingWalletId(null);
    setWalletDisplayName("");
    setWalletNameAlias("");
    setWalletNetwork("");
    setWalletProfileName("");
    setWalletAddress("");
    setWalletEnsSecondary("");
    setWalletType("");
    setWalletReferral("");
    setWalletEmail("");
    setWalletEnsName("");
  };

  const handleEditWallet = (w: WalletItem) => {
    setEditingWalletId(w.id);
    setWalletDisplayName(w.name);
    setWalletNameAlias(""); // Limpa ou mapeia do seu objeto caso exista
    setWalletNetwork(w.network);
    setWalletAddress(w.address);
    // Demais campos podem ser mapeados aqui se adicionados ao tipo WalletItem

    // Rola a página para o formulário
    document
      .getElementById("wallet-form-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDuplicatePrimary = async () => {
    const primary = wallets.find((w) => w.isPrimary);
    if (!primary) {
      alert("Nenhuma carteira principal encontrada para duplicar.");
      return;
    }

    const duplicatedWallet: WalletItem = {
      ...primary,
      id: Date.now().toString(),
      name: `${primary.name} (Secundária)`,
      isPrimary: false,
    };

    try {
      await saveWallet(duplicatedWallet);
      setWalletSuccess(true);
      setTimeout(() => setWalletSuccess(false), 3000);
    } catch {
      alert("Erro ao duplicar carteira principal.");
    }
  };

  const handleSaveWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress || !walletNetwork) return;

    // Se estiver a editar, preserva a flag isPrimary; senão, a primeira é sempre principal
    const isPrimaryFlag = editingWalletId
      ? wallets.find((w) => w.id === editingWalletId)?.isPrimary || false
      : wallets.length === 0;

    const walletPayload: WalletItem = {
      id: editingWalletId || Date.now().toString(),
      name: walletDisplayName || "Nova Carteira",
      address: walletAddress,
      network: walletNetwork,
      isPrimary: isPrimaryFlag,
    };

    try {
      await saveWallet(walletPayload);
      setWalletSuccess(true);
      handleAddNewWallet(); // Limpa o formulário após salvar com sucesso
      setTimeout(() => setWalletSuccess(false), 3000);
    } catch {
      alert("Erro ao salvar carteira.");
    }
  };

  // TELA DE SKELETON (Enquanto os dados do usuário carregam)
  if (isLoadingAuth || (!user && activeTab === "profile")) {
    return (
      <main
        aria-busy="true"
        aria-live="polite"
        className="flex-1 container mx-auto px-4 md:px-8 py-10 font-mono"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <aside className="md:col-span-3 bg-secondary/20 border border-border/60 rounded-xl p-4 space-y-4">
            <Skeleton className="h-6 w-28" />
            <div className="space-y-2">
              <Skeleton className="h-9 w-full rounded-lg" />
              <Skeleton className="h-9 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
          </aside>
          <section className="md:col-span-9 space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-12 w-36 rounded-md" />
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 container mx-auto px-4 md:px-8 py-10 font-mono">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* SIDEBAR ESQUERDA */}
        <aside
          aria-label="Menu de navegação do perfil"
          className="md:col-span-3 bg-secondary/20 border border-border/60 rounded-xl p-4 h-fit"
        >
          <h2 className="text-base font-bold text-foreground px-3 py-2 mb-2">
            Meu perfil
          </h2>

          <nav
            role="tablist"
            aria-label="Abas do painel do perfil"
            className="space-y-1 text-xs"
          >
            <button
              type="button"
              role="tab"
              id="tab-profile"
              aria-controls="panel-profile"
              aria-selected={activeTab === "profile"}
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                activeTab === "profile"
                  ? "bg-primary/10 text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
              }`}
            >
              <User className="w-4 h-4" />
              <span>Dados do perfil</span>
            </button>

            <button
              type="button"
              role="tab"
              id="tab-wallets"
              aria-controls="panel-wallets"
              aria-selected={activeTab === "wallets"}
              onClick={() => setActiveTab("wallets")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                activeTab === "wallets"
                  ? "bg-primary/10 text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>Carteiras</span>
            </button>

            {/* Links Desativados */}
            <div
              role="group"
              aria-label="Recursos em breve"
              className="pt-2 border-t border-border/40 space-y-1 opacity-60"
            >
              <div
                aria-disabled="true"
                className="flex items-center gap-3 px-3 py-2 text-muted-foreground cursor-not-allowed"
              >
                <Activity className="w-4 h-4" />
                <span>Atividade</span>
              </div>
              <div
                aria-disabled="true"
                className="flex items-center gap-3 px-3 py-2 text-muted-foreground cursor-not-allowed"
              >
                <Heart className="w-4 h-4" />
                <span>Lista de interesse</span>
              </div>
              <div
                aria-disabled="true"
                className="flex items-center gap-3 px-3 py-2 text-muted-foreground cursor-not-allowed"
              >
                <Tag className="w-4 h-4" />
                <span>Ofertas</span>
              </div>
              <div
                aria-disabled="true"
                className="flex items-center gap-3 px-3 py-2 text-muted-foreground cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                <span>Arquivos baixados</span>
              </div>
              <div
                aria-disabled="true"
                className="flex items-center gap-3 px-3 py-2 text-muted-foreground cursor-not-allowed"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Suporte</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border/40">
              <button
                type="button"
                onClick={() => logout()}
                aria-label="Encerrar sessão da conta"
                className="w-full flex items-center gap-3 px-3 py-2 text-xs text-muted-foreground hover:text-red-500 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* CONTEÚDO DIREITO */}
        <section className="md:col-span-9 space-y-8">
          {/* ==================================
              ABA 1: DADOS DO PERFIL
          ================================== */}
          {activeTab === "profile" && (
            <div
              id="panel-profile"
              role="tabpanel"
              aria-labelledby="tab-profile"
              className="space-y-8 animate-fadeIn"
            >
              <h1 className="text-xl font-bold text-foreground">
                Perfil do colecionador
              </h1>

              <form onSubmit={handleSaveProfile} className="space-y-6 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="profile-display-name"
                      className="text-muted-foreground block mb-2"
                    >
                      Nome de exibição<span className="text-primary">*</span>
                    </label>
                    <input
                      id="profile-display-name"
                      type="text"
                      required
                      aria-required="true"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-secondary/30 border border-border rounded-md px-3 py-2.5 text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="profile-username"
                      className="text-muted-foreground block mb-2"
                    >
                      Nome de usuário<span className="text-primary">*</span>
                    </label>
                    <input
                      id="profile-username"
                      type="text"
                      required
                      aria-required="true"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-secondary/30 border border-border rounded-md px-3 py-2.5 text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="profile-email"
                      className="text-muted-foreground block mb-2"
                    >
                      E-mail<span className="text-primary">*</span>
                    </label>
                    <input
                      id="profile-email"
                      type="email"
                      required
                      aria-required="true"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-secondary/30 border border-border rounded-md px-3 py-2.5 text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="profile-ens-name"
                      className="text-muted-foreground block mb-2"
                    >
                      Nome ENS (opcional)
                    </label>
                    <div className="flex gap-2">
                      <span
                        aria-hidden="true"
                        className="bg-secondary border border-border rounded-md px-3 py-2.5 text-muted-foreground flex items-center"
                      >
                        .eth
                      </span>
                      <div className="relative flex-1">
                        <input
                          id="profile-ens-name"
                          type="text"
                          value={ensName}
                          onChange={(e) => setEnsName(e.target.value)}
                          className="w-full bg-secondary/30 border border-border rounded-md px-3 py-2.5 text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        />
                        <img
                          src={avatar}
                          alt="Avatar do ENS"
                          className="absolute right-2 top-1.5 w-7 h-7 rounded-full object-cover border border-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                  <div>
                    <label
                      htmlFor="profile-wallet-alias"
                      className="text-muted-foreground block mb-2"
                    >
                      Apelido da carteira (opcional)
                    </label>
                    <input
                      id="profile-wallet-alias"
                      type="text"
                      value={walletAlias}
                      onChange={(e) => setWalletAlias(e.target.value)}
                      className="w-full bg-secondary/30 border border-border rounded-md px-3 py-2.5 text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block mb-2">
                      Avatar
                    </span>
                    <div className="flex items-center gap-3">
                      <img
                        src={avatar}
                        alt="Foto de perfil do colecionador"
                        className="w-9 h-9 rounded-full object-cover border border-primary"
                      />
                      <Button
                        type="button"
                        onClick={() =>
                          setAvatar(
                            `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
                          )
                        }
                        aria-label="Gerar avatar aleatório"
                        className="bg-primary/20 text-primary hover:bg-primary/30 text-xs py-2 px-4 focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        Alterar
                      </Button>
                      <button
                        type="button"
                        onClick={() =>
                          setAvatar("https://i.pravatar.cc/150?img=1")
                        }
                        aria-label="Restaurar avatar padrão"
                        className="text-muted-foreground hover:text-red-500 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <Button
                    type="submit"
                    disabled={isSavingProfile}
                    aria-busy={isSavingProfile}
                    className="bg-primary text-primary-foreground font-bold px-8 py-5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    {isSavingProfile ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Salvar Alterações"
                    )}
                  </Button>
                  {profileSuccess && (
                    <span
                      role="status"
                      className="text-xs text-primary flex items-center gap-1"
                    >
                      <Check className="w-4 h-4" /> Perfil atualizado com
                      sucesso!
                    </span>
                  )}
                </div>
              </form>

              {/* FORMULÁRIO DE ALTERAR SENHA */}
              <div className="pt-8 border-t border-border/40 space-y-4">
                <h2 className="text-sm font-bold text-foreground">
                  Alterar senha
                </h2>

                {passwordError && (
                  <div
                    role="alert"
                    className="p-3 bg-red-500/10 border border-red-500/30 rounded text-red-500 text-xs font-mono"
                  >
                    {passwordError}
                  </div>
                )}

                <form
                  onSubmit={handleChangePassword}
                  className="max-w-md space-y-4 text-xs"
                >
                  <div>
                    <label
                      htmlFor="current-password"
                      className="text-muted-foreground block mb-2"
                    >
                      Senha atual<span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="current-password"
                        type={showPasswords ? "text" : "password"}
                        required
                        aria-required="true"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full bg-secondary/30 border border-border rounded-md px-3 py-2.5 text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(!showPasswords)}
                        aria-label={
                          showPasswords
                            ? "Ocultar texto das senhas"
                            : "Exibir texto das senhas"
                        }
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                      >
                        {showPasswords ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="new-password"
                      className="text-muted-foreground block mb-2"
                    >
                      Nova senha<span className="text-primary">*</span>
                    </label>
                    <input
                      id="new-password"
                      type={showPasswords ? "text" : "password"}
                      required
                      aria-required="true"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-secondary/30 border border-border rounded-md px-3 py-2.5 text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="confirm-password"
                      className="text-muted-foreground block mb-2"
                    >
                      Confirmar nova senha
                      <span className="text-primary">*</span>
                    </label>
                    <input
                      id="confirm-password"
                      type={showPasswords ? "text" : "password"}
                      required
                      aria-required="true"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-secondary/30 border border-border rounded-md px-3 py-2.5 text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    />
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <Button
                      type="submit"
                      disabled={isSavingPassword}
                      aria-busy={isSavingPassword}
                      className="bg-primary text-primary-foreground font-bold px-8 py-5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      {isSavingPassword ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Atualizar Senha"
                      )}
                    </Button>
                    {passwordSuccess && (
                      <span
                        role="status"
                        className="text-xs text-primary flex items-center gap-1"
                      >
                        <Check className="w-4 h-4" /> Senha alterada com
                        sucesso!
                      </span>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ==================================
              ABA 2: CARTEIRAS
          ================================== */}
          {activeTab === "wallets" && (
            <div
              id="panel-wallets"
              role="tabpanel"
              aria-labelledby="tab-wallets"
              className="space-y-10 animate-fadeIn"
            >
              {/* CABEÇALHO COM BOTÃO "ADICIONAR" */}
              <div className="flex justify-between items-start border-b border-border/40 pb-4">
                <div>
                  <h1 className="text-xl font-bold text-foreground">
                    Carteira principal
                  </h1>
                  <p className="text-xs text-muted-foreground mt-1">
                    Estas carteiras ficam disponíveis no pagamento e para
                    receber NFTs comprados.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddNewWallet}
                  aria-label="Adicionar nova carteira e limpar formulário"
                  className="text-primary font-bold text-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-2 py-1"
                >
                  Adicionar
                </button>
              </div>

              {/* FORMULÁRIO FIEL AO FIGMA */}
              <form
                id="wallet-form-section"
                onSubmit={handleSaveWallet}
                className="space-y-6 text-xs"
              >
                {/* Linha 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="wallet-display-name"
                      className="text-muted-foreground block mb-2"
                    >
                      Nome de exibição<span className="text-primary">*</span>
                    </label>
                    <input
                      id="wallet-display-name"
                      type="text"
                      required
                      aria-required="true"
                      value={walletDisplayName}
                      onChange={(e) => setWalletDisplayName(e.target.value)}
                      className="w-full bg-secondary/20 border border-border rounded px-3 py-2.5 text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="wallet-alias"
                      className="text-muted-foreground block mb-2"
                    >
                      Apelido da carteira<span className="text-primary">*</span>
                    </label>
                    <input
                      id="wallet-alias"
                      type="text"
                      required
                      aria-required="true"
                      value={walletNameAlias}
                      onChange={(e) => setWalletNameAlias(e.target.value)}
                      className="w-full bg-secondary/20 border border-border rounded px-3 py-2.5 text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                    />
                  </div>
                </div>

                {/* Linha 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="wallet-network-select"
                      className="text-muted-foreground block mb-2"
                    >
                      Rede <span className="text-primary">*</span>
                    </label>
                    <select
                      id="wallet-network-select"
                      required
                      aria-required="true"
                      value={walletNetwork}
                      onChange={(e) => setWalletNetwork(e.target.value)}
                      className="w-full bg-secondary/20 border border-border rounded px-3 py-2.5 text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-primary appearance-none"
                    >
                      <option value="">Selecione uma rede</option>
                      <option value="Ethereum">Ethereum</option>
                      <option value="Polygon">Polygon</option>
                      <option value="Solana">Solana</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="wallet-profile-name"
                      className="text-muted-foreground block mb-2"
                    >
                      Nome do perfil<span className="text-primary">*</span>
                    </label>
                    <input
                      id="wallet-profile-name"
                      type="text"
                      required
                      aria-required="true"
                      value={walletProfileName}
                      onChange={(e) => setWalletProfileName(e.target.value)}
                      className="w-full bg-secondary/20 border border-border rounded px-3 py-2.5 text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                    />
                  </div>
                </div>

                {/* Linha 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="wallet-address-input"
                      className="text-muted-foreground block mb-2"
                    >
                      Endereço da carteira
                      <span className="text-primary">*</span>
                    </label>
                    <input
                      id="wallet-address-input"
                      type="text"
                      required
                      aria-required="true"
                      placeholder="Endereço 0x da carteira"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      className="w-full bg-secondary/20 border border-border rounded px-3 py-2.5 text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-primary font-mono"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="wallet-ens-secondary"
                      className="text-muted-foreground block mb-2"
                    >
                      ENS ou carteira secundária (opcional)
                    </label>
                    <input
                      id="wallet-ens-secondary"
                      type="text"
                      value={walletEnsSecondary}
                      onChange={(e) => setWalletEnsSecondary(e.target.value)}
                      className="w-full bg-secondary/20 border border-border rounded px-3 py-2.5 text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                    />
                  </div>
                </div>

                {/* Linha 4 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="wallet-type-select"
                      className="text-muted-foreground block mb-2"
                    >
                      Tipo de carteira<span className="text-primary">*</span>
                    </label>
                    <select
                      id="wallet-type-select"
                      required
                      aria-required="true"
                      value={walletType}
                      onChange={(e) => setWalletType(e.target.value)}
                      className="w-full bg-secondary/20 border border-border rounded px-3 py-2.5 text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-primary appearance-none"
                    >
                      <option value="">Selecione uma carteira</option>
                      <option value="MetaMask">MetaMask</option>
                      <option value="Coinbase">Coinbase</option>
                      <option value="WalletConnect">WalletConnect</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="wallet-referral"
                      className="text-muted-foreground block mb-2"
                    >
                      Código de indicação<span className="text-primary">*</span>
                    </label>
                    <input
                      id="wallet-referral"
                      type="text"
                      required
                      aria-required="true"
                      value={walletReferral}
                      onChange={(e) => setWalletReferral(e.target.value)}
                      className="w-full bg-secondary/20 border border-border rounded px-3 py-2.5 text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                    />
                  </div>
                </div>

                {/* Linha 5 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="wallet-email-input"
                      className="text-muted-foreground block mb-2"
                    >
                      E-mail<span className="text-primary">*</span>
                    </label>
                    <input
                      id="wallet-email-input"
                      type="email"
                      required
                      aria-required="true"
                      value={walletEmail}
                      onChange={(e) => setWalletEmail(e.target.value)}
                      className="w-full bg-secondary/20 border border-border rounded px-3 py-2.5 text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="wallet-ens-name-input"
                      className="text-muted-foreground block mb-2"
                    >
                      Nome ENS <span className="text-primary">*</span>
                    </label>
                    <div className="flex gap-2">
                      <select
                        aria-label="Extensão ENS"
                        className="w-24 bg-secondary/20 border border-border rounded px-3 py-2.5 text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-primary appearance-none"
                      >
                        <option>.eth</option>
                      </select>
                      <input
                        id="wallet-ens-name-input"
                        type="text"
                        required
                        aria-required="true"
                        value={walletEnsName}
                        onChange={(e) => setWalletEnsName(e.target.value)}
                        className="flex-1 bg-secondary/20 border border-border rounded px-3 py-2.5 text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* Botão de Salvar */}
                <div className="pt-2 flex items-center gap-4">
                  <Button
                    type="submit"
                    disabled={isSavingWallet}
                    aria-busy={isSavingWallet}
                    className="bg-primary text-primary-foreground font-bold px-6 py-2.5 rounded hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    {isSavingWallet ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Salvar carteira"
                    )}
                  </Button>
                  {walletSuccess && (
                    <span
                      role="status"
                      className="text-xs text-primary flex items-center gap-1"
                    >
                      <Check className="w-4 h-4" />
                      {editingWalletId
                        ? "Carteira atualizada!"
                        : "Carteira adicionada!"}
                    </span>
                  )}
                </div>
              </form>

              {/* SESSÃO: CARTEIRA SECUNDÁRIA (CLONAR) */}
              <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    Carteira secundária
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    {wallets.length <= 1
                      ? "Você ainda não adicionou uma carteira secundária."
                      : "Gira as suas carteiras secundárias abaixo."}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-2" aria-hidden="true">
                    <Circle className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Igual à carteira principal
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleDuplicatePrimary}
                    aria-label="Adicionar uma cópia da sua carteira principal como secundária"
                    className="text-primary font-bold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1"
                  >
                    Adicionar
                  </button>
                </div>
              </div>

              {/* LISTA DE CARTEIRAS CADASTRADAS (CLICÁVEIS PARA EDITAR) */}
              <div className="pt-8 border-t border-border/40 space-y-4">
                <h2 className="text-base font-bold text-foreground">
                  Carteiras cadastradas ({wallets.length})
                </h2>
                {wallets.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    Nenhuma carteira salva até o momento.
                  </p>
                ) : (
                  <div
                    role="region"
                    aria-label="Lista de carteiras salvas para edição"
                    className="space-y-3"
                  >
                    {wallets.map((w) => (
                      <div
                        key={w.id}
                        onClick={() => handleEditWallet(w)}
                        role="button"
                        tabIndex={0}
                        aria-label={`Editar carteira ${w.name}`}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleEditWallet(w);
                          }
                        }}
                        className="p-4 bg-secondary/10 border border-border/40 rounded-lg flex items-center justify-between text-xs cursor-pointer hover:border-primary/50 hover:bg-secondary/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        <div>
                          <p className="font-bold text-foreground">
                            {w.name}
                            {w.isPrimary && (
                              <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded ml-2">
                                PRINCIPAL
                              </span>
                            )}
                          </p>
                          <p className="text-muted-foreground text-[11px] mt-1">
                            {w.address} • {w.network}
                          </p>
                        </div>
                        {!w.isPrimary && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation(); // Evita ativar a edição ao clicar em "Tornar principal"
                              setPrimaryWallet(w.id);
                            }}
                            aria-label={`Definir ${w.name} como carteira principal`}
                            className="text-xs border-border hover:text-primary hover:border-primary focus-visible:ring-2 focus-visible:ring-primary"
                          >
                            Tornar principal
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
