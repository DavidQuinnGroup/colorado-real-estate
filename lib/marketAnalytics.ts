/**
 * DQG INTELLIGENCE ENGINE: STRATEGIC MARKET ANALYTICS
 * Implements Module 9.1 (Transparency Log) and Module 9.2 (Integrity Meter).
 */

/**
 * 1. MARKET VELOCITY METER (Module 9.2)
 * Compares current speed against a 5-year rolling average to detect "Integrity Gaps."
 */
export function calculateMarketVelocity(currentDOM: number, fiveYearAvgDOM: number): number {
  if (fiveYearAvgDOM === 0) return 0;
  // A positive number means the market is moving faster than the historical baseline
  const velocityDelta = ((fiveYearAvgDOM - currentDOM) / fiveYearAvgDOM) * 100;
  return Math.round(velocityDelta);
}

/**
 * 2. NEGOTIATION LEVERAGE SCORE (Module 9.2 [506])
 * A calculated metric that identifies which party holds the tactical advantage.
 * Scale: 0 (Extreme Buyer Favor) - 100 (Extreme Seller Favor)
 */
export function calculateNegotiationLeverage(
  absorptionRate: number, // In months of inventory
  demandIndex: number,    // Pending vs Active ratio
  saleToListRatio: number
): number {
  // Absorption Impact (0-40 pts): Lower inventory = Higher Seller Leverage
  const absorptionScore = Math.max(0, 40 - (absorptionRate * 8));

  // Demand Impact (0-30 pts): Higher Pending ratio = Higher Seller Leverage
  const demandScore = Math.min(30, demandIndex * 50);

  // List Integrity Impact (0-30 pts): Above-list sales = Maximum Seller Leverage
  const listScore = saleToListRatio >= 1 ? 30 : Math.max(0, (saleToListRatio - 0.90) * 300);

  return Math.round(absorptionScore + demandScore + listScore);
}

/**
 * 3. RECONCILIATION ALGORITHM (Module 9.1 [502])
 * Used in the "Unfiltered Truth" Report to justify an offer price.
 */
export function reconcileValuation(
  subjectiveValue: number, // The "Opposing Agent's" price
  optimizedValue: number,  // David Quinn Optimized (GC-Grade)
  leverageScore: number
): { delta: number; tacticalRecommendation: string } {
  const delta = subjectiveValue - optimizedValue;

  let recommendation = "";
  if (leverageScore < 40) {
    recommendation = "Buyer-favorable market; emphasize low-concession, quick-close offer based on optimized value.";
  } else if (leverageScore > 70) {
    recommendation = "Seller-dominant velocity; prioritize clean contingency logic while maintaining structural integrity price.";
  } else {
    recommendation = "Balanced alignment; focus on GC-grade repair offsets (Module 5.2) during counter-proposals.";
  }

  return { delta, tacticalRecommendation: recommendation };
}

/**
 * 4. MARKET INTEGRITY GAUGE (Module 9.2)
 * Categorizes the market based on real-time absorption and velocity.
 */
export function getMarketIntegrityLevel(leverageScore: number): "Buyer's Market" | "Balanced" | "Seller's Market" | "Extreme Scarcity" {
  if (leverageScore < 35) return "Buyer's Market";
  if (leverageScore < 65) return "Balanced";
  if (leverageScore < 85) return "Seller's Market";
  return "Extreme Scarcity";
}