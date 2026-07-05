"use client";

import type { CardType } from "@/types";
import { useI18n } from "@/lib/i18n";

export type SortKey = "reward" | "fee" | "income";

export interface CardFilters {
  type: CardType | "all";
  shariaOnly: boolean;
  maxFee: number | null;
  income: number | null;
  sort: SortKey;
}

export const DEFAULT_FILTERS: CardFilters = {
  type: "all",
  shariaOnly: false,
  maxFee: null,
  income: null,
  sort: "reward",
};

const TYPE_OPTIONS: { value: CardType | "all"; key: string }[] = [
  { value: "all", key: "filter_type_all" },
  { value: "cashback", key: "type_cashback" },
  { value: "rewards", key: "type_rewards" },
  { value: "travel", key: "type_travel" },
  { value: "basic", key: "type_basic" },
];

const FEE_OPTIONS = [
  { value: "", labelKey: "filter_type_all" },
  { value: "0", labelKey: "card_no_fee" },
  { value: "300", labelRaw: "≤ 300" },
  { value: "600", labelRaw: "≤ 600" },
  { value: "1000", labelRaw: "≤ 1000" },
];

const SORT_OPTIONS: { value: SortKey; key: string }[] = [
  { value: "reward", key: "sort_reward" },
  { value: "fee", key: "sort_fee" },
  { value: "income", key: "sort_income" },
];

const fieldClass =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand";

export function Filters({
  value,
  onChange,
  onReset,
}: {
  value: CardFilters;
  onChange: (patch: Partial<CardFilters>) => void;
  onReset: () => void;
}) {
  const { t } = useI18n();

  return (
    <div className="space-y-5 rounded-2xl border border-line bg-white p-5 shadow-card">
      <h2 className="text-base font-bold text-navy">{t("filter_title")}</h2>

      {/* Sharia toggle — first-class */}
      <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-accent/30 bg-accent-soft/50 px-3 py-2.5">
        <span className="text-sm font-semibold text-accent">{t("filter_sharia_only")}</span>
        <span className="relative inline-flex">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={value.shariaOnly}
            onChange={(e) => onChange({ shariaOnly: e.target.checked })}
          />
          <span className="h-6 w-11 rounded-full bg-line transition peer-checked:bg-accent" />
          <span className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ltr:left-0.5 ltr:peer-checked:left-[1.375rem] rtl:right-0.5 rtl:peer-checked:right-[1.375rem]" />
        </span>
      </label>

      <div>
        <label className="mb-1 block text-sm font-medium text-muted">{t("filter_type")}</label>
        <select
          className={fieldClass}
          value={value.type}
          onChange={(e) => onChange({ type: e.target.value as CardType | "all" })}
        >
          {TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {t(o.key)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-muted">{t("filter_max_fee")}</label>
        <select
          className={fieldClass}
          value={value.maxFee === null ? "" : String(value.maxFee)}
          onChange={(e) => onChange({ maxFee: e.target.value === "" ? null : Number(e.target.value) })}
        >
          {FEE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.labelRaw ?? t(o.labelKey as string)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-muted">
          {t("filter_min_income")}
        </label>
        <input
          type="number"
          min={0}
          inputMode="numeric"
          className={fieldClass}
          value={value.income ?? ""}
          onChange={(e) => onChange({ income: e.target.value === "" ? null : Number(e.target.value) })}
          placeholder="—"
        />
        <p className="mt-1 text-xs text-muted">{t("filter_income_hint")}</p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-muted">{t("sort_label")}</label>
        <select
          className={fieldClass}
          value={value.sort}
          onChange={(e) => onChange({ sort: e.target.value as SortKey })}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {t(o.key)}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="w-full rounded-lg border border-line py-2 text-sm font-semibold text-muted transition hover:border-brand hover:text-brand"
      >
        {t("filter_reset")}
      </button>
    </div>
  );
}
