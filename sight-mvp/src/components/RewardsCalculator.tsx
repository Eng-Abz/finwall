"use client";

import { useMemo, useState } from "react";
import type { SpendCategory, SpendProfile } from "@/types";
import { SPEND_CATEGORIES } from "@/types";
import { useI18n } from "@/lib/i18n";
import { formatSAR } from "@/lib/format";
import { rankCardsByValue, totalMonthlySpend } from "@/lib/rewards";
import { Badge } from "@/components/Badge";

const CATEGORY_KEY: Record<SpendCategory, string> = {
  dining: "cat_dining",
  groceries: "cat_groceries",
  fuel: "cat_fuel",
  travel: "cat_travel",
  online: "cat_online",
  international: "cat_international",
  other: "cat_other",
};

const DEFAULT_SPEND: SpendProfile = {
  dining: 1200,
  groceries: 2000,
  fuel: 800,
  travel: 600,
  online: 900,
  international: 300,
  other: 1500,
};

const SLIDER_MAX = 10000;

export function RewardsCalculator() {
  const { t, locale } = useI18n();
  const [spend, setSpend] = useState<SpendProfile>(DEFAULT_SPEND);

  const total = totalMonthlySpend(spend);
  const ranked = useMemo(() => rankCardsByValue(spend), [spend]);
  const top = ranked.slice(0, 5);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      {/* Inputs */}
      <section className="space-y-5 rounded-2xl border border-line bg-white p-6 shadow-card">
        <div>
          <h2 className="text-base font-bold text-navy">{t("calc_spend_label")}</h2>
          <p className="mt-1 text-sm text-muted">{t("per_month")}</p>
        </div>

        <div className="space-y-4">
          {SPEND_CATEGORIES.map((cat) => (
            <div key={cat}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <label className="font-medium text-ink">{t(CATEGORY_KEY[cat])}</label>
                <span className="font-semibold text-navy">{formatSAR(spend[cat], locale)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={SLIDER_MAX}
                step={100}
                value={spend[cat]}
                onChange={(e) => setSpend((s) => ({ ...s, [cat]: Number(e.target.value) }))}
                className="w-full"
                dir="ltr"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between rounded-xl bg-surface px-4 py-3">
          <span className="text-sm font-medium text-muted">{t("calc_total_monthly")}</span>
          <span className="text-lg font-extrabold text-navy">{formatSAR(total, locale)}</span>
        </div>
      </section>

      {/* Results */}
      <section>
        <h2 className="mb-3 text-lg font-bold text-navy">{t("calc_results_title")}</h2>
        <ul className="space-y-3">
          {top.map((r, i) => {
            const best = i === 0 && r.netAnnualValueSAR > 0;
            return (
              <li
                key={r.card.id}
                className={`rounded-2xl border bg-white p-4 shadow-card transition ${
                  best ? "border-accent ring-1 ring-accent/40" : "border-line"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-muted">{r.card.issuer[locale]}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-navy">{r.card.name[locale]}</h3>
                      {best && <Badge tone="high">{t("best_match")}</Badge>}
                      {r.card.shariaCompliant && (
                        <Badge tone="sharia">{t("card_sharia_badge")}</Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-end">
                    <p className="text-xs text-muted">{t("calc_net_value")}</p>
                    <p className="text-xl font-extrabold text-accent">
                      {formatSAR(r.netAnnualValueSAR, locale)}
                    </p>
                  </div>
                </div>

                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                  <span>
                    {t("calc_gross")}: {formatSAR(r.grossAnnualRewardSAR, locale)}
                  </span>
                  <span>
                    {t("calc_fee")}:{" "}
                    {r.feeWaived ? t("calc_fee_waived") : formatSAR(r.annualFeeSAR, locale)}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
