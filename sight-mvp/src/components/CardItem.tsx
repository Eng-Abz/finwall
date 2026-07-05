"use client";

import type { CreditCard } from "@/types";
import { useI18n } from "@/lib/i18n";
import { formatNumber, formatPercent, formatSAR } from "@/lib/format";
import { Badge } from "@/components/Badge";
import { CardVisual } from "@/components/CardVisual";

function headlineReward(card: CreditCard) {
  const rates = [card.rewards.base, ...Object.values(card.rewards.categories)];
  return Math.max(...rates);
}

const TYPE_KEY: Record<CreditCard["type"], string> = {
  cashback: "type_cashback",
  rewards: "type_rewards",
  travel: "type_travel",
  basic: "type_basic",
};

export function CardItem({ card }: { card: CreditCard }) {
  const { t, locale } = useI18n();
  const maxRate = headlineReward(card);
  const rewardHeadline =
    card.rewards.type === "cashback"
      ? t("up_to_cashback", { rate: formatPercent(maxRate, locale) })
      : t("up_to_points", { rate: formatNumber(maxRate, locale) });

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 shadow-card transition hover:shadow-card-hover">
      <CardVisual card={card} />

      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="type">{t(TYPE_KEY[card.type])}</Badge>
        {card.shariaCompliant && (
          <Badge tone="sharia">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2a10 10 0 1 0 6.9 17.2 8 8 0 1 1 0-14.4A9.96 9.96 0 0 0 12 2z" />
            </svg>
            {t("card_sharia_badge")}
          </Badge>
        )}
      </div>

      <div>
        <p className="text-sm text-muted">{card.issuer[locale]}</p>
        <h3 className="text-lg font-bold text-navy">{card.name[locale]}</h3>
        <p className="mt-1 text-sm font-semibold text-accent">{rewardHeadline}</p>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div>
          <dt className="text-muted">{t("card_annual_fee")}</dt>
          <dd className="font-semibold text-ink">
            {card.annualFeeSAR === 0
              ? t("card_no_fee")
              : `${formatSAR(card.annualFeeSAR, locale)}${t("per_year")}`}
          </dd>
        </div>
        <div>
          <dt className="text-muted">{t("card_min_income")}</dt>
          <dd className="font-semibold text-ink">
            {`${formatSAR(card.minMonthlyIncomeSAR, locale)}${t("per_month")}`}
          </dd>
        </div>
        <div>
          <dt className="text-muted">{t("card_min_age")}</dt>
          <dd className="font-semibold text-ink">
            {formatNumber(card.minAge, locale)} {t("years")}
          </dd>
        </div>
        <div>
          <dt className="text-muted">{t("card_apr")}</dt>
          <dd className="font-semibold text-ink">
            {card.shariaCompliant ? t("card_apr_sharia") : `${formatNumber(card.aprPercent, locale)}%`}
          </dd>
        </div>
      </dl>

      {card.annualFeeSAR > 0 && card.annualFeeWaiverSpendSAR ? (
        <p className="-mt-2 text-xs text-muted">
          {t("card_fee_waiver", { amount: formatSAR(card.annualFeeWaiverSpendSAR, locale) })}
        </p>
      ) : null}

      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
          {t("card_benefits")}
        </p>
        <ul className="space-y-1">
          {card.benefits.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-ink">
              <svg
                className="mt-0.5 shrink-0 text-accent"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                aria-hidden
              >
                <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {b[locale]}
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        className="mt-auto rounded-xl bg-navy py-2.5 text-sm font-semibold text-white transition hover:bg-navy/90"
      >
        {t("card_apply")}
      </button>
    </article>
  );
}
