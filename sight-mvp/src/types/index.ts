// Core domain types for the Sight credit-card MVP.

export type Locale = "ar" | "en";

export interface LocalizedText {
  ar: string;
  en: string;
}

export type CardType = "cashback" | "rewards" | "travel" | "basic";

export type SpendCategory =
  | "dining"
  | "groceries"
  | "fuel"
  | "travel"
  | "online"
  | "international"
  | "other";

export const SPEND_CATEGORIES: SpendCategory[] = [
  "dining",
  "groceries",
  "fuel",
  "travel",
  "online",
  "international",
  "other",
];

/**
 * Reward rule for a card.
 * - For `cashback` cards, rates are fractions (0.05 = 5% back).
 * - For `points` cards, rates are points earned per 1 SAR, and `pointValue`
 *   converts a point to SAR when computing monetary value.
 */
export interface RewardRule {
  type: "cashback" | "points";
  base: number; // rate for uncategorised ("other") spend
  categories: Partial<Record<SpendCategory, number>>; // per-category rates
  annualCapSAR?: number; // max reward value per year in SAR
  pointValue?: number; // SAR per point (points cards only)
}

export interface CreditCard {
  id: string;
  issuer: LocalizedText;
  name: LocalizedText;
  network: "visa" | "mastercard" | "mada";
  type: CardType;
  shariaCompliant: boolean;
  annualFeeSAR: number; // 0 = no annual fee
  annualFeeWaiverSpendSAR?: number; // annual spend that waives the fee
  minMonthlyIncomeSAR: number;
  minAge: number;
  /** Annual profit/interest rate shown for transparency (percent). */
  aprPercent: number;
  rewards: RewardRule;
  benefits: LocalizedText[];
  accent: string; // hex accent for the card visual
}

export type EmploymentType =
  | "government"
  | "private"
  | "self_employed"
  | "retired";

export type Nationality = "saudi" | "resident";

export interface EligibilityInput {
  monthlyIncomeSAR: number;
  employmentType: EmploymentType;
  nationality: Nationality;
  monthlyObligationsSAR: number; // existing loan/card repayments
  age: number;
  hasBankRelationship: boolean;
}

export type EligibilityBand = "high" | "medium" | "low" | "ineligible";

export interface CardEligibility {
  card: CreditCard;
  band: EligibilityBand;
  score: number; // 0-100 likelihood for this specific card
  /** i18n keys explaining the result (see dictionaries `elig_reason_*`). */
  reasonKeys: string[];
}

export interface CreditReadiness {
  score: number; // 0-100 general readiness estimate (NOT a real SIMAH score)
  band: "excellent" | "good" | "fair" | "poor";
  dbrPercent: number; // debt burden ratio
  tipKeys: string[]; // i18n keys for improvement tips
}

/** Monthly spend by category, in SAR. */
export type SpendProfile = Record<SpendCategory, number>;

export interface CardRewardResult {
  card: CreditCard;
  grossAnnualRewardSAR: number;
  annualFeeSAR: number; // after waiver logic
  netAnnualValueSAR: number;
  perCategorySAR: Partial<Record<SpendCategory, number>>;
  feeWaived: boolean;
}
