"use client";

import { useMemo, useState } from "react";
import type { CreditCard } from "@/types";
import { CARDS } from "@/lib/cards";
import { useI18n } from "@/lib/i18n";
import { formatNumber } from "@/lib/format";
import { CardItem } from "@/components/CardItem";
import { Filters, DEFAULT_FILTERS, type CardFilters } from "@/components/Filters";
import { SampleDataBanner } from "@/components/SampleDataBanner";

function headlineRate(card: CreditCard): number {
  const rates = [card.rewards.base, ...Object.values(card.rewards.categories)];
  const max = Math.max(...rates);
  // Normalise cashback fractions vs points-per-SAR onto a comparable scale.
  return card.rewards.type === "cashback" ? max : max * (card.rewards.pointValue ?? 0);
}

export default function CardsPage() {
  const { t, locale } = useI18n();
  const [filters, setFilters] = useState<CardFilters>(DEFAULT_FILTERS);

  const filtered = useMemo(() => {
    let list = CARDS.filter((c) => {
      if (filters.type !== "all" && c.type !== filters.type) return false;
      if (filters.shariaOnly && !c.shariaCompliant) return false;
      if (filters.maxFee !== null && c.annualFeeSAR > filters.maxFee) return false;
      if (filters.income !== null && c.minMonthlyIncomeSAR > filters.income) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      switch (filters.sort) {
        case "fee":
          return a.annualFeeSAR - b.annualFeeSAR;
        case "income":
          return a.minMonthlyIncomeSAR - b.minMonthlyIncomeSAR;
        case "reward":
        default:
          return headlineRate(b) - headlineRate(a);
      }
    });
    return list;
  }, [filters]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-navy">{t("cards_title")}</h1>
        <p className="mt-1 text-muted">{t("cards_subtitle")}</p>
      </div>

      <SampleDataBanner />

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Filters
            value={filters}
            onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))}
            onReset={() => setFilters(DEFAULT_FILTERS)}
          />
        </aside>

        <div>
          <p className="mb-4 text-sm text-muted">
            {formatNumber(filtered.length, locale)} {t("cards_count")}
          </p>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center text-muted">
              {t("no_results")}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {filtered.map((card) => (
                <CardItem key={card.id} card={card} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
