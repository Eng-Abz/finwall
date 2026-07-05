"use client";

import { useState } from "react";
import type { EligibilityInput, EmploymentType, Nationality } from "@/types";
import { useI18n } from "@/lib/i18n";

const fieldClass =
  "w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand";
const labelClass = "mb-1 block text-sm font-medium text-navy";

const EMPLOYMENT: { value: EmploymentType; key: string }[] = [
  { value: "government", key: "emp_government" },
  { value: "private", key: "emp_private" },
  { value: "self_employed", key: "emp_self_employed" },
  { value: "retired", key: "emp_retired" },
];

export const DEFAULT_ELIGIBILITY: EligibilityInput = {
  monthlyIncomeSAR: 10000,
  employmentType: "private",
  nationality: "saudi",
  monthlyObligationsSAR: 1500,
  age: 30,
  hasBankRelationship: true,
};

export function EligibilityForm({
  onSubmit,
  initial = DEFAULT_ELIGIBILITY,
}: {
  onSubmit: (input: EligibilityInput) => void;
  initial?: EligibilityInput;
}) {
  const { t } = useI18n();
  const [form, setForm] = useState<EligibilityInput>(initial);

  function update<K extends keyof EligibilityInput>(key: K, val: EligibilityInput[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="space-y-4 rounded-2xl border border-line bg-white p-5 shadow-card"
    >
      <div>
        <label className={labelClass}>{t("elig_income")}</label>
        <input
          type="number"
          min={0}
          inputMode="numeric"
          required
          className={fieldClass}
          value={form.monthlyIncomeSAR || ""}
          onChange={(e) => update("monthlyIncomeSAR", Number(e.target.value))}
        />
      </div>

      <div>
        <label className={labelClass}>{t("elig_employment")}</label>
        <select
          className={fieldClass}
          value={form.employmentType}
          onChange={(e) => update("employmentType", e.target.value as EmploymentType)}
        >
          {EMPLOYMENT.map((o) => (
            <option key={o.value} value={o.value}>
              {t(o.key)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>{t("elig_nationality")}</label>
        <div className="grid grid-cols-2 gap-2">
          {(["saudi", "resident"] as Nationality[]).map((n) => (
            <button
              type="button"
              key={n}
              onClick={() => update("nationality", n)}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                form.nationality === n
                  ? "border-brand bg-brand/10 text-brand-dark"
                  : "border-line text-muted hover:border-brand/50"
              }`}
            >
              {t(n === "saudi" ? "nat_saudi" : "nat_resident")}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass}>{t("elig_obligations")}</label>
        <input
          type="number"
          min={0}
          inputMode="numeric"
          className={fieldClass}
          value={form.monthlyObligationsSAR || ""}
          onChange={(e) => update("monthlyObligationsSAR", Number(e.target.value))}
        />
        <p className="mt-1 text-xs text-muted">{t("elig_obligations_hint")}</p>
      </div>

      <div>
        <label className={labelClass}>{t("elig_age")}</label>
        <input
          type="number"
          min={18}
          max={100}
          inputMode="numeric"
          required
          className={fieldClass}
          value={form.age || ""}
          onChange={(e) => update("age", Number(e.target.value))}
        />
      </div>

      <div>
        <label className={labelClass}>{t("elig_bank_rel")}</label>
        <div className="grid grid-cols-2 gap-2">
          {[true, false].map((v) => (
            <button
              type="button"
              key={String(v)}
              onClick={() => update("hasBankRelationship", v)}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                form.hasBankRelationship === v
                  ? "border-brand bg-brand/10 text-brand-dark"
                  : "border-line text-muted hover:border-brand/50"
              }`}
            >
              {t(v ? "yes" : "no")}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-accent py-3 text-sm font-bold text-white transition hover:bg-accent/90"
      >
        {t("elig_submit")}
      </button>
    </form>
  );
}
