"use client";

import { useI18n } from "@/lib/i18n";

export function LanguageToggle() {
  const { t, toggleLocale } = useI18n();
  return (
    <button
      type="button"
      onClick={toggleLocale}
      className="rounded-lg border border-line bg-white px-3 py-1.5 text-sm font-semibold text-navy transition hover:border-brand hover:text-brand"
      aria-label="Switch language"
    >
      {t("lang_switch")}
    </button>
  );
}
