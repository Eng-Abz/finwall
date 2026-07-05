"use client";

import { useI18n } from "@/lib/i18n";
import { RewardsCalculator } from "@/components/RewardsCalculator";
import { SampleDataBanner } from "@/components/SampleDataBanner";

export default function CalculatorPage() {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-navy">{t("calc_title")}</h1>
        <p className="mt-1 text-muted">{t("calc_subtitle")}</p>
      </div>

      <SampleDataBanner />

      <RewardsCalculator />
    </div>
  );
}
