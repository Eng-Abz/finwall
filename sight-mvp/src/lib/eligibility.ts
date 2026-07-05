import type {
  CardEligibility,
  CreditCard,
  CreditReadiness,
  EligibilityBand,
  EligibilityInput,
} from "@/types";
import { CARDS } from "@/lib/cards";

/**
 * MOCK ELIGIBILITY ENGINE.
 *
 * This is an illustrative heuristic, NOT a real credit decision and NOT a SIMAH
 * score. It estimates approval likelihood from income, debt burden, employment
 * and profile signals so the MVP can demonstrate the "eligibility-first" UX.
 * A production version would integrate SIMAH / Qarar / open banking.
 */

const EMPLOYMENT_WEIGHT: Record<EligibilityInput["employmentType"], number> = {
  government: 1.0,
  private: 0.85,
  retired: 0.7,
  self_employed: 0.6,
};

/** SAMA-style debt burden ratio (existing obligations / income). */
export function debtBurdenRatio(input: EligibilityInput): number {
  if (input.monthlyIncomeSAR <= 0) return 1;
  return Math.min(1, input.monthlyObligationsSAR / input.monthlyIncomeSAR);
}

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n));
}

function bandFromScore(score: number): EligibilityBand {
  if (score >= 70) return "high";
  if (score >= 45) return "medium";
  return "low";
}

/** Estimate approval likelihood for a single card. */
export function scoreCard(card: CreditCard, input: EligibilityInput): CardEligibility {
  const reasonKeys: string[] = [];

  // Hard gates -> ineligible.
  if (input.age < card.minAge) {
    return { card, band: "ineligible", score: 0, reasonKeys: ["elig_reason_age"] };
  }
  if (input.monthlyIncomeSAR < card.minMonthlyIncomeSAR) {
    return { card, band: "ineligible", score: 0, reasonKeys: ["elig_reason_income_below"] };
  }

  const dbr = debtBurdenRatio(input);
  // SAMA caps total monthly obligations well under half of income; treat > 0.5 as a block.
  if (dbr > 0.5) {
    return { card, band: "ineligible", score: 0, reasonKeys: ["elig_reason_dbr_high"] };
  }

  let score = 50;

  // Income headroom above the requirement.
  const headroom = input.monthlyIncomeSAR / card.minMonthlyIncomeSAR;
  if (headroom >= 2) {
    score += 22;
    reasonKeys.push("elig_reason_income_strong");
  } else if (headroom >= 1.4) {
    score += 14;
    reasonKeys.push("elig_reason_income_ok");
  } else {
    score += 5;
    reasonKeys.push("elig_reason_income_meets");
  }

  // Debt burden (lower is better).
  if (dbr <= 0.1) {
    score += 18;
    reasonKeys.push("elig_reason_dbr_low");
  } else if (dbr <= 0.33) {
    score += 8;
    reasonKeys.push("elig_reason_dbr_ok");
  } else {
    score -= 6;
    reasonKeys.push("elig_reason_dbr_moderate");
  }

  // Employment stability.
  const empWeight = EMPLOYMENT_WEIGHT[input.employmentType];
  score += (empWeight - 0.6) * 25; // 0 .. +10
  if (empWeight >= 0.85) reasonKeys.push("elig_reason_employment_stable");

  // Existing banking relationship.
  if (input.hasBankRelationship) {
    score += 6;
    reasonKeys.push("elig_reason_bank_relationship");
  }

  score = clamp(Math.round(score));
  return { card, band: bandFromScore(score), score, reasonKeys };
}

/** Score every card and sort best-fit first (eligible cards before ineligible). */
export function evaluateCards(input: EligibilityInput): CardEligibility[] {
  return CARDS.map((c) => scoreCard(c, input)).sort((a, b) => {
    if ((a.band === "ineligible") !== (b.band === "ineligible")) {
      return a.band === "ineligible" ? 1 : -1;
    }
    return b.score - a.score;
  });
}

/**
 * General "credit readiness" estimate (0-100). Explicitly NOT a SIMAH score —
 * a directional indicator based on debt burden, income and employment.
 */
export function creditReadiness(input: EligibilityInput): CreditReadiness {
  const dbr = debtBurdenRatio(input);
  const tipKeys: string[] = [];

  let score = 60;

  // Debt burden component (heaviest).
  if (dbr <= 0.1) score += 20;
  else if (dbr <= 0.33) score += 8;
  else if (dbr <= 0.45) {
    score -= 8;
    tipKeys.push("tip_reduce_dbr");
  } else {
    score -= 22;
    tipKeys.push("tip_reduce_dbr");
  }

  // Income component.
  if (input.monthlyIncomeSAR >= 15000) score += 14;
  else if (input.monthlyIncomeSAR >= 8000) score += 8;
  else if (input.monthlyIncomeSAR >= 4000) score += 3;
  else {
    score -= 4;
    tipKeys.push("tip_income");
  }

  // Employment component.
  score += (EMPLOYMENT_WEIGHT[input.employmentType] - 0.6) * 20;
  if (input.employmentType === "self_employed") tipKeys.push("tip_document_income");

  // Banking relationship.
  if (input.hasBankRelationship) score += 6;
  else tipKeys.push("tip_bank_relationship");

  score = clamp(Math.round(score));

  let band: CreditReadiness["band"];
  if (score >= 80) band = "excellent";
  else if (score >= 65) band = "good";
  else if (score >= 45) band = "fair";
  else band = "poor";

  if (band === "excellent" && tipKeys.length === 0) tipKeys.push("tip_maintain");

  return {
    score,
    band,
    dbrPercent: Math.round(dbr * 100),
    tipKeys,
  };
}
