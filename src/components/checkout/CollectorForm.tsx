import { useState } from "react";

export function CollectorForm() {
  const [showSecondaryWallet, setShowSecondaryWallet] = useState(false);

  return (
    <div className="lg:col-span-7 space-y-6">
      <h2 className="text-xl font-bold text-foreground font-mono mb-4">
        Perfil do colecionador
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="display-name"
            className="text-xs font-mono text-muted-foreground block mb-2"
          >
            Nome de exibição*
          </label>
          <input
            id="display-name"
            type="text"
            required
            aria-required="true"
            className="w-full bg-secondary/30 border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
        <div>
          <label
            htmlFor="username"
            className="text-xs font-mono text-muted-foreground block mb-2"
          >
            Nome de usuário*
          </label>
          <input
            id="username"
            type="text"
            required
            aria-required="true"
            className="w-full bg-secondary/30 border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="network-select"
            className="text-xs font-mono text-muted-foreground block mb-2"
          >
            Rede*
          </label>
          <select
            id="network-select"
            required
            aria-required="true"
            className="w-full bg-secondary/30 border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <option value="">Selecione uma rede</option>
            <option value="ethereum">Ethereum</option>
            <option value="polygon">Polygon</option>
            <option value="solana">Solana</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="profile-name"
            className="text-xs font-mono text-muted-foreground block mb-2"
          >
            Nome do perfil*
          </label>
          <input
            id="profile-name"
            type="text"
            required
            aria-required="true"
            className="w-full bg-secondary/30 border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="wallet-address"
            className="text-xs font-mono text-muted-foreground block mb-2"
          >
            Endereço da carteira*
          </label>
          <input
            id="wallet-address"
            type="text"
            placeholder="Endereço 0x da carteira"
            required
            aria-required="true"
            className="w-full bg-secondary/30 border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary font-mono"
          />
        </div>
        <div>
          <label
            htmlFor="ens-name"
            className="text-xs font-mono text-muted-foreground block mb-2"
          >
            Nome ENS (opcional)
          </label>
          <div className="flex gap-2">
            <input
              id="ens-name"
              type="text"
              placeholder="ex: vitalik"
              className="flex-1 bg-secondary/30 border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
            <span
              aria-hidden="true"
              className="bg-secondary border border-border rounded-md px-3 py-2 text-xs font-mono text-muted-foreground flex items-center"
            >
              .eth
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="wallet-type-select"
            className="text-xs font-mono text-muted-foreground block mb-2"
          >
            Tipo de carteira*
          </label>
          <select
            id="wallet-type-select"
            required
            aria-required="true"
            className="w-full bg-secondary/30 border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <option value="">Selecione uma carteira</option>
            <option value="metamask">MetaMask</option>
            <option value="walletconnect">WalletConnect</option>
            <option value="coinbase">Coinbase</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="collector-email"
            className="text-xs font-mono text-muted-foreground block mb-2"
          >
            E-mail*
          </label>
          <input
            id="collector-email"
            type="email"
            required
            aria-required="true"
            className="w-full bg-secondary/30 border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
      </div>

      {/* AÇÃO EXPANSÍVEL TECLÁVEL E ACESSÍVEL */}
      <div>
        <button
          type="button"
          onClick={() => setShowSecondaryWallet(!showSecondaryWallet)}
          aria-expanded={showSecondaryWallet}
          aria-controls="secondary-wallet-field"
          className="text-xs font-mono text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 py-0.5"
        >
          {showSecondaryWallet
            ? "－ Ocultar carteira secundária"
            : "＋ Usar outra carteira?"}
        </button>
      </div>

      {showSecondaryWallet && (
        <div id="secondary-wallet-field" className="animate-fadeIn">
          <label
            htmlFor="secondary-wallet-address"
            className="text-xs font-mono text-muted-foreground block mb-2"
          >
            Endereço da carteira alternativa
          </label>
          <input
            id="secondary-wallet-address"
            type="text"
            placeholder="Endereço 0x secundário"
            className="w-full bg-secondary/30 border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary font-mono"
          />
        </div>
      )}

      <div>
        <label
          htmlFor="collector-notes"
          className="text-xs font-mono text-muted-foreground block mb-2"
        >
          Observação do colecionador (opcional)
        </label>
        <textarea
          id="collector-notes"
          rows={4}
          className="w-full bg-secondary/30 border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        ></textarea>
      </div>
    </div>
  );
}
