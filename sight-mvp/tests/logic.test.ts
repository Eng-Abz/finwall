/**
 * Lightweight assertion tests for the pure logic layer.
 * Run with: npm test   (uses tsx; no build required)
 */
import { CARDS, getCardById } from "@/lib/cards";
import {
  creditReadiness,
  debtBurdenRatio,
  evaluateCards,
  scoreCard,
} from "@/lib/eligibility";
import { computeCardValue, rankCardsByValue, totalMonthlySpend, EMPTY_SPEND } from "@/lib/rewards";
import type { EligibilityInput, SpendProfile } from "@/types";

let passed = 0;
let failed = 0;

function assert(cond: boolean, msg: string) {
  if (cond) {
    passed++;
  } else {
    failed++;
    console.error("  ✗ FAIL:", msg);
  }
}

function approx(a: number, b: number, tol = 0.5): boolean {
  return Math.abs(a - b) <= tol;
}

// ---- Data integrity ----
console.log("Data integrity");
assert(CARDS.length >= 8, "at least 8 sample cards");
const ids = new Set(CARDS.map((c) => c.id));
assert(ids.size === CARDS.length, "card ids are unique");
assert(CARDS.some((c) => c.shariaCompliant), "has Shariah-compliant cards");
assert(CARDS.some((c) => !c.shariaCompliant), "has conventional cards");
assert(
  CARDS.every((c) => c.annualFeeSAR >= 0 && c.minMonthlyIncomeSAR > 0 && c.minAge >= 18),
  "all cards have sane fee/income/age"
);
assert(
  CARDS.every((c) => (c.rewards.type === "points" ? (c.rewards.pointValue ?? 0) > 0 : true)),
  "points cards define a pointValue"
);
assert(getCardById(CARDS[0].id)?.id === CARDS[0].id, "getCardById works");

// ---- Debt burden ratio ----
console.log("Debt burden ratio");
assert(approx(debtBurdenRatio({ monthlyIncomeSAR: 10000, monthlyObligationsSAR: 2000 } as EligibilityInput), 0.2, 0.001), "DBR = 0.2");
assert(debtBurdenRatio({ monthlyIncomeSAR: 0, monthlyObligationsSAR: 500 } as EligibilityInput) === 1, "DBR guards zero income");

// ---- Eligibility gates ----
console.log("Eligibility gates");
const lowIncome: EligibilityInput = {
  monthlyIncomeSAR: 3500,
  employmentType: "private",
  nationality: "resident",
  monthlyObligationsSAR: 0,
  age: 30,
  hasBankRelationship: false,
};
const eliteCard = getCardById("snb-rewards-world-elite")!;
assert(scoreCard(eliteCard, lowIncome).band === "ineligible", "low income -> ineligible for elite card");

const young: EligibilityInput = { ...lowIncome, monthlyIncomeSAR: 30000, age: 19 };
const infinite = getCardById("alinma-travel-infinite")!; // minAge 25
assert(scoreCard(infinite, young).band === "ineligible", "under-age -> ineligible");

const overIndebted: EligibilityInput = {
  monthlyIncomeSAR: 10000,
  employmentType: "private",
  nationality: "saudi",
  monthlyObligationsSAR: 6000, // DBR 0.6 > 0.5
  age: 35,
  hasBankRelationship: true,
};
const basic = getCardById("alinma-basic")!;
assert(scoreCard(basic, overIndebted).band === "ineligible", "DBR>0.5 -> ineligible");

// ---- Eligibility strength ordering ----
console.log("Eligibility scoring");
const strong: EligibilityInput = {
  monthlyIncomeSAR: 25000,
  employmentType: "government",
  nationality: "saudi",
  monthlyObligationsSAR: 500,
  age: 35,
  hasBankRelationship: true,
};
const weak: EligibilityInput = {
  monthlyIncomeSAR: 6100,
  employmentType: "self_employed",
  nationality: "resident",
  monthlyObligationsSAR: 2500,
  age: 24,
  hasBankRelationship: false,
};
const rajhi = getCardById("rajhi-cashback-platinum")!;
const strongScore = scoreCard(rajhi, strong).score;
const weakScore = scoreCard(rajhi, weak).score;
assert(strongScore > weakScore, "stronger profile scores higher on same card");
assert(scoreCard(rajhi, strong).band === "high", "strong profile -> high band on entry card");

const evalResults = evaluateCards(strong);
assert(evalResults.length === CARDS.length, "evaluateCards returns all cards");
// eligible cards sorted before ineligible
const firstIneligible = evalResults.findIndex((r) => r.band === "ineligible");
if (firstIneligible !== -1) {
  assert(
    evalResults.slice(firstIneligible).every((r) => r.band === "ineligible"),
    "ineligible cards grouped at the end"
  );
}
// scores non-increasing among eligible
const eligibleScores = evalResults.filter((r) => r.band !== "ineligible").map((r) => r.score);
assert(
  eligibleScores.every((s, i) => i === 0 || eligibleScores[i - 1] >= s),
  "eligible cards sorted by descending score"
);

// ---- Credit readiness ----
console.log("Credit readiness");
const rExcellent = creditReadiness(strong);
const rPoor = creditReadiness({
  monthlyIncomeSAR: 4000,
  employmentType: "self_employed",
  nationality: "resident",
  monthlyObligationsSAR: 1900,
  age: 28,
  hasBankRelationship: false,
});
assert(rExcellent.score >= 0 && rExcellent.score <= 100, "readiness score in range");
assert(rExcellent.score > rPoor.score, "healthier profile has higher readiness");
assert(rExcellent.dbrPercent === 2, "dbrPercent computed (500/25000 = 2%)");
assert(rPoor.tipKeys.length > 0, "poor profile gets improvement tips");

// ---- Rewards calculator ----
console.log("Rewards calculator");
assert(totalMonthlySpend(EMPTY_SPEND) === 0, "empty spend totals 0");

const spend: SpendProfile = {
  dining: 1000,
  groceries: 2000,
  fuel: 800,
  travel: 500,
  online: 700,
  international: 0,
  other: 1000,
};
assert(totalMonthlySpend(spend) === 6000, "total monthly spend sums correctly");

// Cashback card math check: Al Rajhi groceries 5%, dining 3%, fuel 4%, base 1%
const rajhiVal = computeCardValue(rajhi, spend);
// gross before cap: groceries 2000*12*.05=1200; dining 1000*12*.03=360; fuel 800*12*.04=384;
// base categories (travel/online/other) at 1%: (500+700+1000)*12*.01=264. total=2208, under 3000 cap.
assert(approx(rajhiVal.grossAnnualRewardSAR, 2208, 1), `Al Rajhi gross ~2208 (got ${rajhiVal.grossAnnualRewardSAR})`);
assert(rajhiVal.feeWaived, "Al Rajhi has no fee -> waived");
assert(rajhiVal.netAnnualValueSAR === rajhiVal.grossAnnualRewardSAR, "no-fee card net == gross");

// Cap enforcement: build spend that exceeds a small cap (Alinma basic cap 1000, base .5%)
const bigSpend: SpendProfile = { ...EMPTY_SPEND, other: 50000 };
const basicVal = computeCardValue(basic, bigSpend);
assert(basicVal.grossAnnualRewardSAR <= (basic.rewards.annualCapSAR ?? Infinity), "reward respects annual cap");

// Fee waiver by spend threshold
const anb = getCardById("anb-cashback-titanium")!; // fee 250, waiver 25000/yr
const belowWaiver: SpendProfile = { ...EMPTY_SPEND, other: 1000 }; // 12000/yr < 25000
const aboveWaiver: SpendProfile = { ...EMPTY_SPEND, other: 3000 }; // 36000/yr >= 25000
assert(computeCardValue(anb, belowWaiver).annualFeeSAR === 250, "fee applies below waiver spend");
assert(computeCardValue(anb, aboveWaiver).annualFeeSAR === 0, "fee waived above waiver spend");

// Ranking is sorted by net value desc
const ranked = rankCardsByValue(spend);
assert(ranked.length === CARDS.length, "ranking returns all cards");
assert(
  ranked.every((r, i) => i === 0 || ranked[i - 1].netAnnualValueSAR >= r.netAnnualValueSAR),
  "cards ranked by descending net value"
);

// ---- Summary ----
console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
