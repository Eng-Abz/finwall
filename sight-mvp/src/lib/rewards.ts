import type {
  CardRewardResult,
  CreditCard,
  SpendCategory,
  SpendProfile,
} from "@/types";
import { SPEND_CATEGORIES } from "@/types";
import { CARDS } from "@/lib/cards";

export const EMPTY_SPEND: SpendProfile = {
  dining: 0,
  groceries: 0,
  fuel: 0,
  travel: 0,
  online: 0,
  international: 0,
  other: 0,
};

export function totalMonthlySpend(spend: SpendProfile): number {
  return SPEND_CATEGORIES.reduce((sum, cat) => sum + (spend[cat] || 0), 0);
}

/** Reward value (SAR) earned on a single category over a year, before caps/fees. */
function categoryRewardSAR(card: CreditCard, cat: SpendCategory, monthly: number): number {
  const annualSpend = monthly * 12;
  const rate = card.rewards.categories[cat] ?? card.rewards.base;
  if (card.rewards.type === "cashback") {
    return annualSpend * rate; // rate is a fraction
  }
  // points: rate = points per SAR, converted via pointValue
  const points = annualSpend * rate;
  return points * (card.rewards.pointValue ?? 0);
}

/** Compute the annual net value of a card for a given spend profile. */
export function computeCardValue(card: CreditCard, spend: SpendProfile): CardRewardResult {
  const perCategorySAR: Partial<Record<SpendCategory, number>> = {};
  let gross = 0;

  for (const cat of SPEND_CATEGORIES) {
    const monthly = spend[cat] || 0;
    if (monthly <= 0) continue;
    const value = categoryRewardSAR(card, cat, monthly);
    perCategorySAR[cat] = value;
    gross += value;
  }

  // Apply annual reward cap if present.
  if (card.rewards.annualCapSAR != null && gross > card.rewards.annualCapSAR) {
    const scale = card.rewards.annualCapSAR / gross;
    for (const cat of Object.keys(perCategorySAR) as SpendCategory[]) {
      perCategorySAR[cat] = (perCategorySAR[cat] as number) * scale;
    }
    gross = card.rewards.annualCapSAR;
  }

  // Annual fee with spend-based waiver.
  const annualSpend = totalMonthlySpend(spend) * 12;
  const feeWaived =
    card.annualFeeSAR === 0 ||
    (card.annualFeeWaiverSpendSAR != null && annualSpend >= card.annualFeeWaiverSpendSAR);
  const annualFeeSAR = feeWaived ? 0 : card.annualFeeSAR;

  return {
    card,
    grossAnnualRewardSAR: Math.round(gross),
    annualFeeSAR,
    netAnnualValueSAR: Math.round(gross - annualFeeSAR),
    perCategorySAR,
    feeWaived,
  };
}

/** Rank all cards by net annual value for the given spend profile. */
export function rankCardsByValue(spend: SpendProfile): CardRewardResult[] {
  return CARDS.map((c) => computeCardValue(c, spend)).sort(
    (a, b) => b.netAnnualValueSAR - a.netAnnualValueSAR
  );
}
