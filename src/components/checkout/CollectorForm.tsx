export function CollectorForm() {
  return (
    <div className="lg:col-span-7 space-y-6">
      <h2 className="text-xl font-bold text-foreground font-mono mb-4">
        Perfil do colecionador
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-mono text-muted-foreground block mb-2">
            Nome de exibição*
          </label>
          <input
            type="text"
            required
            className="w-full bg-secondary/30 border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="text-xs font-mono text-muted-foreground block mb-2">
            Nome de usuário*
          </label>
          <input
            type="text"
            required
            className="w-full bg-secondary/30 border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-mono text-muted-foreground block mb-2">
            Rede*
          </label>
          <select className="w-full bg-secondary/30 border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
            <option>Selecione uma rede</option>
            <option>Ethereum</option>
            <option>Polygon</option>
            <option>Solana</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-mono text-muted-foreground block mb-2">
            Nome do perfil*
          </label>
          <input
            type="text"
            className="w-full bg-secondary/30 border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-mono text-muted-foreground block mb-2">
            Endereço da carteira*
          </label>
          <input
            type="text"
            placeholder="Endereço 0x da carteira"
            required
            className="w-full bg-secondary/30 border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
          />
        </div>
        <div>
          <label className="text-xs font-mono text-muted-foreground block mb-2">
            Nome ENS*
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="ex: vitalik"
              className="flex-1 bg-secondary/30 border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <span className="bg-secondary border border-border rounded-md px-3 py-2 text-xs font-mono text-muted-foreground flex items-center">
              .eth
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-mono text-muted-foreground block mb-2">
            Tipo de carteira*
          </label>
          <select className="w-full bg-secondary/30 border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
            <option>Selecione uma carteira</option>
            <option>MetaMask</option>
            <option>WalletConnect</option>
            <option>Coinbase</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-mono text-muted-foreground block mb-2">
            E-mail*
          </label>
          <input
            type="email"
            required
            className="w-full bg-secondary/30 border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-mono text-primary cursor-pointer hover:underline">
          ＋ Usar outra carteira?
        </label>
      </div>

      <div>
        <label className="text-xs font-mono text-muted-foreground block mb-2">
          Observação do colecionador (opcional)
        </label>
        <textarea
          rows={4}
          className="w-full bg-secondary/30 border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        ></textarea>
      </div>
    </div>
  );
}
