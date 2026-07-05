"use client";

import type { CreditReadiness } from "@/types";
import { useI18n } from "@/lib/i18n";

const BAND_COLOR: Record<CreditReadiness["band"], string> = {
  excellent: "#1E7A46",
  good: "#2E75B6",
  fair: "#9C6A00",
  poor: "#C2410C",
};

const BAND_KEY: Record<CreditReadiness["band"], string> = {
  excellent: "readiness_excellent",
  good: "readiness_good",
  fair: "readiness_fair",
  poor: "readiness_poor",
};

export function ScoreGauge({ readiness }: { readiness: CreditReadiness }) {
  const { t } = useI18n();
  const color = BAND_COLOR[readiness.band];
  const r = 52;
  const circumference = 2 * Math.PI * r;
  const progress = (readiness.score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      {/* Gauge is direction-neutral: force LTR so the arc always starts at top. */}
      <div className="relative h-36 w-36" dir="ltr">
        <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
          <circle cx="64" cy="64" r={r} fill="none" stroke="#E3E9F0" strokeWidth="12" />
          <circle
            cx="64"
            cy="64"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${progress} ${circumference}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-navy">{readiness.score}</span>
          <span className="text-xs text-muted">/ 100</span>
        </div>
      </div>
      <span
        className="mt-2 rounded-full px-3 py-1 text-sm font-bold"
        style={{ backgroundColor: `${color}1a`, color }}
      >
        {t(BAND_KEY[readiness.band])}
      </span>
    </div>
  );
}
