import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { OrderSnapshot } from "@/types";
import { useEffect } from "react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderSnapshot: OrderSnapshot;
}

const MONTHS = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

const formatDate = (value: string | number | Date) => {
  const d = new Date(value);
  return `${String(d.getDate()).padStart(2, "0")} ${MONTHS[d.getMonth()]}, ${d.getFullYear()}`;
};

const shortHash = (value: string) =>
  value.length > 12 ? `${value.slice(0, 6)}…${value.slice(-4)}` : value;

function ThankYouIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 66 80"
      width="66"
      height="80"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mx-auto text-primary"
    >
      {/* cartão */}
      <rect x="7" y="6" width="52" height="46" rx="3" />
      <path d="M26 6c1-5 13-5 14 0" />
      <text
        x="33"
        y="26"
        textAnchor="middle"
        fontSize="11"
        fontWeight="800"
        fill="currentColor"
        stroke="none"
        fontFamily="inherit"
      >
        THANK
      </text>
      <text
        x="33"
        y="40"
        textAnchor="middle"
        fontSize="11"
        fontWeight="800"
        fill="currentColor"
        stroke="none"
        fontFamily="inherit"
      >
        YOU
      </text>
      {/* envelope */}
      <path d="M3 44v32a2 2 0 0 0 2 2h56a2 2 0 0 0 2-2V44" />
      <path d="M3 46l30 20 30-20" />
    </svg>
  );
}

export function SuccessModal({
  isOpen,
  onClose,
  orderSnapshot,
}: SuccessModalProps) {
  // Fecha com ESC
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen || !orderSnapshot) return null;

  const meta = [
    {
      label: "ID da transação",
      value: shortHash(orderSnapshot.id),
      bold: true,
    },
    { label: "Data", value: formatDate(orderSnapshot.createdAt) },
    { label: "Total", value: `${orderSnapshot.total.toFixed(3)} ETH` },
    { label: "Carteira", value: orderSnapshot.wallet, bold: true },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-modal-title"
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/80 p-4 backdrop-blur-sm sm:items-center"
    >
      <div className="relative w-full max-w-[578px] bg-secondary font-mono text-foreground shadow-2xl">
        {/* Fechar */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar modal"
          className="absolute right-4 top-3.5 text-primary hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Cabeçalho */}
        <div className="px-6 pb-[18px] pt-[22px] text-center">
          <ThankYouIcon />
          <p
            id="success-modal-title"
            className="mt-3 text-base font-bold leading-6 text-muted-foreground"
          >
            Seus NFTs agora estão na sua carteira
          </p>
        </div>

        {/* Metadados da transação */}
        <div className="border-y border-primary/60 px-6 py-[15px] sm:px-9">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm leading-[19px] text-muted-foreground sm:flex sm:items-center sm:justify-between sm:gap-0">
            {meta.map((item, i) => (
              <div key={item.label} className="flex items-center sm:contents">
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className="mx-4 hidden h-8 w-px bg-primary/70 sm:block"
                  />
                )}
                <div className="min-w-0">
                  <dt className={item.bold ? "font-bold" : ""}>{item.label}</dt>
                  <dd className="truncate" title={item.value}>
                    {item.value}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>

        {/* Corpo */}
        <div className="px-6 pb-12 pt-4 sm:px-11">
          <h3 className="text-sm font-bold leading-6 text-foreground">
            Detalhes da transação
          </h3>

          <div className="mt-1 grid grid-cols-[1fr_72px_96px] gap-x-2 border-b border-primary/30 pb-2 text-[15px] font-bold text-foreground sm:grid-cols-[1fr_96px_112px]">
            <span>NFTs</span>
            <span className="text-center">Edições</span>
            <span className="text-right">Subtotal</span>
          </div>

          <ul className="mt-3 max-h-[260px] space-y-3 overflow-y-auto">
            {orderSnapshot.items.map((item) => (
              <li
                key={item.id}
                className="grid min-h-[70px] grid-cols-[1fr_72px_96px] items-center gap-x-2 sm:grid-cols-[1fr_96px_112px]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-[70px] w-[68px] shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-bold text-foreground">
                      {item.name} #{item.id}
                    </p>
                    <p className="text-[13px] text-muted-foreground">
                      ID do token: #{String(item.id).padStart(4, "0")}
                    </p>
                  </div>
                </div>
                <span className="text-center text-sm text-muted-foreground">
                  (x {item.quantity})
                </span>
                <span className="text-right text-lg font-bold text-primary">
                  {(parseFloat(item.price) * item.quantity).toFixed(2)} ETH
                </span>
              </li>
            ))}
          </ul>

          {/* Totais */}
          <div className="mt-3 space-y-0.5 border-b border-primary/30 pb-2 sm:pl-[169px]">
            {orderSnapshot.discount > 0 && (
              <div className="flex items-center justify-between leading-7 text-primary">
                <span className="text-sm">Desconto</span>
                <span>(-) {orderSnapshot.discount.toFixed(2)} ETH</span>
              </div>
            )}
            <div className="flex items-center justify-between leading-7 text-foreground">
              <span className="text-sm">Taxa de rede</span>
              <span className="text-base">
                {orderSnapshot.networkFee.toFixed(3)} ETH
              </span>
            </div>
            <div className="flex items-center justify-between leading-7">
              <span className="text-[15px] font-bold text-foreground">
                Total
              </span>
              <span className="text-lg font-bold text-primary">
                {orderSnapshot.total.toFixed(3)} ETH
              </span>
            </div>
          </div>

          <p className="mx-auto mt-3 max-w-[470px] text-center text-sm leading-[22px] text-muted-foreground">
            Transação confirmada na Ethereum. A propriedade foi transferida para
            sua carteira conectada e registrada na rede.
          </p>

          <div className="mt-5 flex justify-center">
            <Button className="h-12 w-[186px] rounded-sm bg-primary font-mono text-base font-bold text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
              <Link to="/" onClick={onClose}>
                Ver no Etherscan
              </Link>
            </Button>
          </div>
        </div>

        {/* Barra inferior */}
        <div aria-hidden="true" className="h-2.5 w-full bg-primary" />
      </div>
    </div>
  );
}
