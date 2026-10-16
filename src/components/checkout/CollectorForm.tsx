import { useState } from "react";
import { ChevronDown } from "lucide-react";

const fieldBase =
  "w-full rounded-sm border border-primary/20 bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary";
const inputClass = `${fieldBase} h-10`;
const selectClass = `${fieldBase} h-10 appearance-none pr-9 invalid:text-muted-foreground [&>option]:bg-secondary [&>option]:text-foreground`;

function Label({
  htmlFor,
  required,
  children,
}: {
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1 block text-[15px] leading-6 text-foreground"
    >
      {children}
      {required && (
        <span
          aria-hidden="true"
          className="ml-0.5 text-lg leading-none text-primary"
        >
          *
        </span>
      )}
    </label>
  );
}

function SelectWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground"
      />
    </div>
  );
}

export function CollectorForm() {
  const [useSecondaryWallet, setUseSecondaryWallet] = useState(false);

  return (
    <div className="lg:col-span-7 font-mono">
      <h2 className="mb-2 text-[17px] font-bold text-foreground">
        Perfil do colecionador
      </h2>

      <div className="grid grid-cols-1 gap-x-6 gap-y-3.5 md:grid-cols-2">
        {/* Linha 1 */}
        <div>
          <Label htmlFor="display-name" required>
            Nome de exibição
          </Label>
          <input
            id="display-name"
            name="displayName"
            type="text"
            required
            aria-required="true"
            className={inputClass}
          />
        </div>
        <div>
          <Label htmlFor="username" required>
            Nome de usuário
          </Label>
          <input
            id="username"
            name="username"
            type="text"
            required
            aria-required="true"
            className={inputClass}
          />
        </div>

        {/* Linha 2 */}
        <div>
          <Label htmlFor="network-select" required>
            Rede
          </Label>
          <SelectWrapper>
            <select
              id="network-select"
              name="network"
              required
              aria-required="true"
              defaultValue=""
              className={selectClass}
            >
              <option value="">Selecione uma rede</option>
              <option value="ethereum">Ethereum</option>
              <option value="polygon">Polygon</option>
              <option value="solana">Solana</option>
            </select>
          </SelectWrapper>
        </div>
        <div>
          <Label htmlFor="profile-name" required>
            Nome do perfil
          </Label>
          <input
            id="profile-name"
            name="profileName"
            type="text"
            required
            aria-required="true"
            className={inputClass}
          />
        </div>

        {/* Linha 3 */}
        <div>
          <Label htmlFor="wallet-address" required>
            Endereço da carteira
          </Label>
          <input
            id="wallet-address"
            name="walletAddress"
            type="text"
            placeholder="Endereço 0x da carteira"
            required
            aria-required="true"
            className={`${inputClass} pl-[22px]`}
          />
        </div>
        <div>
          {/* Espaçador para alinhar com a linha ao lado (campo sem rótulo no Figma) */}
          <span aria-hidden="true" className="mb-1 block h-6" />
          <input
            id="secondary-wallet-address"
            name="secondaryWalletAddress"
            type="text"
            aria-label="ENS ou carteira secundária (opcional)"
            placeholder="ENS ou carteira secundária (opcional)"
            className={`${inputClass} pl-[22px]`}
          />
        </div>

        {/* Linha 4 */}
        <div>
          <Label htmlFor="wallet-type-select" required>
            Tipo de carteira
          </Label>
          <SelectWrapper>
            <select
              id="wallet-type-select"
              name="walletType"
              required
              aria-required="true"
              defaultValue=""
              className={selectClass}
            >
              <option value="">Selecione uma carteira</option>
              <option value="metamask">MetaMask</option>
              <option value="walletconnect">WalletConnect</option>
              <option value="coinbase">Coinbase</option>
            </select>
          </SelectWrapper>
        </div>
        <div>
          <Label htmlFor="referral-code" required>
            Código de indicação
          </Label>
          <input
            id="referral-code"
            name="referralCode"
            type="text"
            className={inputClass}
          />
        </div>

        {/* Linha 5 */}
        <div>
          <Label htmlFor="collector-email" required>
            E-mail
          </Label>
          <input
            id="collector-email"
            name="email"
            type="email"
            required
            aria-required="true"
            className={inputClass}
          />
        </div>
        <div>
          <Label htmlFor="ens-suffix" required>
            Nome ENS
          </Label>
          <div className="relative w-[78px]">
            <select
              id="ens-suffix"
              name="ensSuffix"
              defaultValue=".eth"
              className={`${fieldBase} h-10 appearance-none pr-8 [&>option]:bg-secondary`}
            >
              <option value=".eth">.eth</option>
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground"
            />
          </div>
        </div>
      </div>

      {/* Alternar carteira de recebimento */}
      <label className="mt-5 inline-flex cursor-pointer items-center gap-2 text-[15px] text-foreground">
        <input
          type="checkbox"
          name="useSecondaryWallet"
          checked={useSecondaryWallet}
          onChange={(e) => setUseSecondaryWallet(e.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background"
        >
          {useSecondaryWallet && (
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          )}
        </span>
        Usar outra carteira?
      </label>

      <div className="mt-5">
        <label
          htmlFor="collector-notes"
          className="mb-1 block text-[15px] leading-6 text-foreground"
        >
          Observação do colecionador (opcional)
        </label>
        <textarea
          id="collector-notes"
          name="notes"
          rows={6}
          className={`${fieldBase} h-[152px] max-w-[350px] resize-none py-2`}
        />
      </div>
    </div>
  );
}
