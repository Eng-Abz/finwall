"use client";

import { useState } from "react";
import type { CardEligibility, CreditReadiness, EligibilityInput } from "@/types";
import { creditReadiness, evaluateCards } from "@/lib/eligibility";
import { useI18n } from "@/lib/i18n";
import { EligibilityForm } from "@/components/EligibilityForm";
import { EligibilityResults } from "@/components/EligibilityResults";
import { SampleDataBanner } from "@/components/SampleDataBanner";

interface Outcome {
  results: CardEligibility[];
  readiness: CreditReadiness;
}

export default function EligibilityPage() {
  const { t } = useI18n();
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  function handleSubmit(input: EligibilityInput) {
    setOutcome({
      results: evaluateCards(input),
      readiness: creditReadiness(input),
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-navy">{t("elig_title")}</h1>
        <p className="mt-1 text-muted">{t("elig_subtitle")}</p>
      </div>

      <SampleDataBanner />

      <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start">
        <div className="lg:sticky lg:top-24">
          <EligibilityForm onSubmit={handleSubmit} />
        </div>

        <div>
          {outcome ? (
            <EligibilityResults results={outcome.results} readiness={outcome.readiness} />
          ) : (
            <div className="grid h-full min-h-[300px] place-items-center rounded-2xl border border-dashed border-line bg-white p-10 text-center text-muted">
              {t("elig_subtitle")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
