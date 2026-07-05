"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { CARDS } from "@/lib/cards";

function FeatureCard({
  href,
  title,
  desc,
  icon,
}: {
  href: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 rounded-2xl border border-line bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand/10 text-brand-dark">
        {icon}
      </span>
      <h3 className="text-base font-bold text-navy">{title}</h3>
      <p className="text-sm leading-relaxed text-muted">{desc}</p>
    </Link>
  );
}

export default function HomePage() {
  const { t } = useI18n();
  const banks = new Set(CARDS.map((c) => c.issuer.en)).size;

  return (
    <div className="space-y-14">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-navy px-6 py-14 text-white sm:px-12">
        <div className="pointer-events-none absolute -top-16 end-[-40px] h-64 w-64 rounded-full bg-brand/30 blur-3xl" />
        <div className="relative max-w-2xl">
          <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
            {t("tagline")}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
            {t("home_hero_title")}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-white/85">{t("home_hero_sub")}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/eligibility"
              className="rounded-xl bg-accent px-5 py-3 text-sm font-bold text-white transition hover:bg-accent/90"
            >
              {t("home_cta_check")}
            </Link>
            <Link
              href="/cards"
              className="rounded-xl bg-white/10 px-5 py-3 text-sm font-bold text-white ring-1 ring-white/25 transition hover:bg-white/20"
            >
              {t("home_cta_browse")}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-4 text-center">
        <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
          <p className="text-2xl font-extrabold text-navy">{CARDS.length}</p>
          <p className="mt-1 text-sm text-muted">{t("home_stat_cards")}</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
          <p className="text-2xl font-extrabold text-navy">{banks}</p>
          <p className="mt-1 text-sm text-muted">{t("home_stat_banks")}</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
          <p className="text-2xl font-extrabold text-accent">{t("home_free")}</p>
          <p className="mt-1 text-sm text-muted">{t("home_stat_free")}</p>
        </div>
      </section>

      {/* Features */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <FeatureCard
          href="/cards"
          title={t("home_feature_compare_title")}
          desc={t("home_feature_compare_desc")}
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 10h18" strokeLinecap="round" />
            </svg>
          }
        />
        <FeatureCard
          href="/eligibility"
          title={t("home_feature_eligibility_title")}
          desc={t("home_feature_eligibility_desc")}
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3l8 4v5c0 4.5-3 7.5-8 9-5-1.5-8-4.5-8-9V7l8-4z" strokeLinejoin="round" />
              <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        />
        <FeatureCard
          href="/cards"
          title={t("home_feature_sharia_title")}
          desc={t("home_feature_sharia_desc")}
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a10 10 0 1 0 6.9 17.2 8 8 0 1 1 0-14.4A9.96 9.96 0 0 0 12 2z" />
            </svg>
          }
        />
        <FeatureCard
          href="/calculator"
          title={t("home_feature_rewards_title")}
          desc={t("home_feature_rewards_desc")}
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="4" y="3" width="16" height="18" rx="2" />
              <path d="M8 7h8M8 11h8M8 15h5" strokeLinecap="round" />
            </svg>
          }
        />
      </section>
    </div>
  );
}
