# Sight — Credit Card MVP

Arabic-first (RTL) credit-card comparison, eligibility, and rewards web app for the Saudi market. This is **Phase 1** of the Sight GTM plan: the acquisition front door built around card comparison and a free eligibility/credit-readiness check, with a rewards calculator as a shareable hook.

Built with **Next.js 14 (App Router) · TypeScript · Tailwind CSS**.

> ⚠️ **Sample data only.** Bank names are real, but all card names, fees, profit/interest rates, rewards, and eligibility thresholds are illustrative placeholders for this MVP — **not** verified product terms. The eligibility engine is a heuristic for demonstration, **not** a real credit decision or a SIMAH score. Replace `src/lib/cards.ts` and integrate real data (SIMAH / Qarar / open banking) before any launch.

## Features

- **Compare cards** (`/cards`) — filter by type, annual fee, income requirement, and Shariah compliance; sort by reward rate, fee, or income.
- **Free eligibility check** (`/eligibility`) — enter income, employment, obligations, age → per-card approval likelihood plus an overall credit-readiness gauge and improvement tips. The differentiating "eligibility-first" wedge.
- **Shariah-compliant filter** — first-class toggle, prominent throughout.
- **Rewards calculator** (`/calculator`) — enter monthly spend by category → ranked cards by net annual value (rewards minus fees, with caps and fee-waiver logic).
- **Arabic-first, RTL** with a one-tap English toggle (layout mirrors automatically; choice persists in `localStorage`).

## Getting started

```bash
npm install
npm run dev       # http://localhost:3000
```

Other scripts:

```bash
npm run build     # production build
npm run start     # run the production build
npm run lint      # next lint
npm test          # run the pure-logic unit tests (via tsx, no build needed)
```

> Requires Node.js 18.17+.

## Project structure

```
src/
  app/
    layout.tsx            Root layout: <html lang="ar" dir="rtl">, providers, header/footer
    page.tsx              Home (hero, stats, feature entry points)
    cards/page.tsx        Comparison + filters
    eligibility/page.tsx  Eligibility checker
    calculator/page.tsx   Rewards calculator
    globals.css           Tailwind + base styles (RTL helpers, slider, animations)
  components/             Header, Footer, LanguageToggle, Filters, CardItem, CardVisual,
                          EligibilityForm, EligibilityResults, ScoreGauge, RewardsCalculator, ...
  lib/
    i18n.tsx              Locale/RTL context + `t()` translator (client)
    dictionaries.ts       AR + EN strings (131 keys each, kept at parity)
    cards.ts              Sample card catalog + types
    eligibility.ts        Approval-likelihood + credit-readiness heuristics (pure)
    rewards.ts            Rewards/net-value computation (pure)
    format.ts             Locale-aware SAR / number / percent formatting
  types/index.ts          Shared domain types
tests/logic.test.ts       30 assertions over the pure logic layer
```

## Internationalization

- Default locale is Arabic (`ar`, RTL). The English toggle flips `document.dir` and persists the choice.
- All UI copy lives in `src/lib/dictionaries.ts`. Add a key to **both** `en` and `ar` (they are kept at parity) and use it via `t("key")`, with optional `{token}` interpolation, e.g. `t("card_fee_waiver", { amount })`.
- Use Tailwind logical utilities (`ms-*`, `me-*`, `ps-*`, `pe-*`, `text-start`, `text-end`) so layouts mirror correctly.

## The logic layer (verified)

The scoring and rewards math is isolated from React so it can be unit-tested without a build:

- **Eligibility** — hard gates on age, income, and debt-burden ratio (>50% ⇒ ineligible); a 0–100 likelihood per card from income headroom, DBR, employment stability, and banking relationship. `creditReadiness()` returns a separate general 0–100 estimate with tips.
- **Rewards** — per-category cashback fractions or points-per-SAR (× point value), annual reward caps, and spend-based fee-waiver logic; cards ranked by net annual value.

`npm test` runs 30 assertions covering data integrity, eligibility gates and ordering, readiness, reward math, caps, fee waivers, and ranking.

## Roadmap hooks (Phase 1 → Phase 2)

- Replace sample catalog with partner-provided card data (schema in `src/types`).
- Swap the heuristic eligibility engine for real SIMAH / Qarar / Tarabut open-banking integration.
- Add lead capture on "View details" / eligibility results (the cards-to-loans funnel).
- Add loan products once the SAMA Finance Aggregation license is granted.
