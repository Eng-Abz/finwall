import type { Locale } from "@/types";

const LOCALE_TAG: Record<Locale, string> = {
  ar: "ar-SA",
  en: "en-US",
};

/** Format a SAR amount, locale-aware, no fractional halalas by default. */
export function formatSAR(amount: number, locale: Locale, maxFractionDigits = 0): string {
  const value = Math.round(amount * 100) / 100;
  const nf = new Intl.NumberFormat(LOCALE_TAG[locale], {
    maximumFractionDigits: maxFractionDigits,
    minimumFractionDigits: 0,
  });
  const num = nf.format(value);
  return locale === "ar" ? `${num} ر.س` : `SAR ${num}`;
}

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(LOCALE_TAG[locale]).format(value);
}

export function formatPercent(fraction: number, locale: Locale, digits = 0): string {
  return new Intl.NumberFormat(LOCALE_TAG[locale], {
    style: "percent",
    maximumFractionDigits: digits,
  }).format(fraction);
}
