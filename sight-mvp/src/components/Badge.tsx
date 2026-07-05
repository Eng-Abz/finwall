import React from "react";

type Tone = "sharia" | "neutral" | "type" | "high" | "medium" | "low" | "ineligible";

const TONE_CLASSES: Record<Tone, string> = {
  sharia: "bg-accent-soft text-accent",
  neutral: "bg-line text-muted",
  type: "bg-brand/10 text-brand-dark",
  high: "bg-accent-soft text-accent",
  medium: "bg-amber/10 text-amber",
  low: "bg-line text-muted",
  ineligible: "bg-red-50 text-red-600",
};

export function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${TONE_CLASSES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
