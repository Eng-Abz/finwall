"use client";

import type { CardEligibility, CreditReadiness, EligibilityBand } from "@/types";
import { useI18n } from "@/lib/i18n";
import { formatNumber, formatSAR } from "@/lib/format";
import { Badge } from "@/components/Badge";
import { ScoreGauge } from "@/components/ScoreGauge";

const BAND_TONE: Record<EligibilityBand, "high" | "medium" | "low" | "ineligible"> = {
  high: "high",
  medium: "medium",
  low: "low",
  ineligible: "ineligible",
};
const BAND_KEY: Record<EligibilityBand, string> = {
  high: "elig_band_high",
  medium: "elig_band_medium",
  low: "elig_band_low",
  ineligible: "elig_band_ineligible",
};

export function EligibilityResults({
  results,
  readiness,
}: {
  results: CardEligibility[];
  readiness: CreditReadiness;
}) {
  const { t, locale } = useI18n();

  return (
    <div className="animate-fade-in-up space-y-6">
      {/* Readiness */}
      <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <ScoreGauge readiness={readiness} />
          <div className="flex-1">
            <h2 className="text-lg font-bold text-navy">{t("elig_readiness_title")}</h2>
            <p className="mt-1 text-sm text-muted">{t("elig_readiness_note")}</p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-surface px-3 py-1.5 text-sm">
              <span className="text-muted">{t("elig_dbr")}:</span>
              <span className="font-bold text-navy">{readiness.dbrPercent}%</span>
            </div>

            {readiness.tipKeys.length > 0 && (
              <div className="mt-4">
                <p className="mb-1 text-sm font-semibold text-navy">{t("elig_tips_title")}</p>
                <ul className="space-y-1">
                  {readiness.tipKeys.map((k) => (
                    <li key={k} className="flex items-start gap-2 text-sm text-ink">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                      {t(k)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Matches */}
      <section>
        <h2 className="mb-3 text-lg font-bold text-navy">{t("elig_results_title")}</h2>
        <ul className="space-y-3">
          {results.map((r) => {
            const ineligible = r.band === "ineligible";
            return (
              <li
                key={r.card.id}
                className={`rounded-2xl border bg-white p-4 shadow-card ${
                  ineligible ? "border-line opacity-70" : "border-line"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm text-muted">{r.card.issuer[locale]}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-navy">{r.card.name[locale]}</h3>
                      {r.card.shariaCompliant && (
                        <Badge tone="sharia">{t("card_sharia_badge")}</Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-end">
                    <Badge tone={BAND_TONE[r.band]}>{t(BAND_KEY[r.band])}</Badge>
                    {!ineligible && (
                      <p className="mt-1 text-xs text-muted">
                        {formatNumber(r.score, locale)}% {t("elig_likelihood")}
                      </p>
                    )}
                  </div>
                </div>

                {/* Likelihood bar */}
                {!ineligible && (
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-line" dir="ltr">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${r.score}%` }}
                    />
                  </div>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                  <span>
                    {t("card_min_income")}: {formatSAR(r.card.minMonthlyIncomeSAR, locale)}
                    {t("per_month")}
                  </span>
                  <span>
                    {t("card_annual_fee")}:{" "}
                    {r.card.annualFeeSAR === 0
                      ? t("card_no_fee")
                      : formatSAR(r.card.annualFeeSAR, locale)}
                  </span>
                </div>

                {r.reasonKeys.length > 0 && (
                  <p className="mt-2 text-sm text-ink">
                    <span className="font-semibold text-muted">{t("elig_why")}: </span>
                    {r.reasonKeys.map((k) => t(k)).join(" ")}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
