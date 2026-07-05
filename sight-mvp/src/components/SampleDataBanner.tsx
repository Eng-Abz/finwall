"use client";

import { useI18n } from "@/lib/i18n";

export function SampleDataBanner() {
  const { t } = useI18n();
  return (
    <div className="rounded-xl border border-amber/30 bg-amber/5 px-4 py-3 text-sm text-amber">
      <span className="font-semibold">{t("disclaimer_sample")}:</span>{" "}
      {t("disclaimer_sample_full")}
    </div>
  );
}
