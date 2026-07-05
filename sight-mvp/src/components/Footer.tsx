"use client";

import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-16 border-t border-line bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted">
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-navy text-xs font-bold text-white">
            S
          </span>
          <span className="font-bold text-navy">{t("brand_name")}</span>
        </div>
        <p className="mt-3 max-w-2xl leading-relaxed">{t("footer_disclaimer")}</p>
        <p className="mt-1 text-xs text-muted/80">{t("footer_rights")}</p>
      </div>
    </footer>
  );
}
