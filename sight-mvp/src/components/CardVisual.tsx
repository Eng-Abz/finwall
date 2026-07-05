"use client";

import type { CreditCard } from "@/types";
import { useI18n } from "@/lib/i18n";

const NETWORK_LABEL: Record<CreditCard["network"], string> = {
  visa: "VISA",
  mastercard: "Mastercard",
  mada: "mada",
};

export function CardVisual({ card }: { card: CreditCard }) {
  const { locale } = useI18n();
  return (
    <div
      className="relative flex h-40 w-full flex-col justify-between overflow-hidden rounded-xl p-4 text-white shadow-card"
      style={{
        background: `linear-gradient(135deg, ${card.accent} 0%, ${card.accent}cc 55%, ${card.accent}99 100%)`,
      }}
    >
      <div className="flex items-start justify-between">
        <span className="text-sm font-semibold leading-tight opacity-95">
          {card.issuer[locale]}
        </span>
        <span className="text-xs font-bold uppercase tracking-wide opacity-90">
          {NETWORK_LABEL[card.network]}
        </span>
      </div>

      {/* chip */}
      <div className="h-7 w-10 rounded-md bg-white/70" />

      <div className="flex items-end justify-between">
        <span className="text-base font-bold drop-shadow-sm">{card.name[locale]}</span>
        <span className="font-mono text-xs tracking-widest opacity-80">•••• 04</span>
      </div>
    </div>
  );
}
