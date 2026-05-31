/**
 * DQG INTELLIGENCE ENGINE: EQUITY VISION 2.0 DATA BACKBONE
 * Implements Module 5.1 Multi-Level Valuation & Module 5.2 GC Lens.
 */

export type MarketStats = {
  slug: string;
  name: string;
  city: string;
  county: string;
  medianPrice: number;
  priceChange: number;
  avgDaysOnMarket: number;
  inventory: number;
  salesLast30: number;
  // Module 5.1: Tiered valuation baselines ($/sqft)
  basePricePerSqFt: number;
  basementFinishedMultiplier: number; // e.g., 0.70 (70% of above-grade)
  basementUnfinishedValue: number;    // e.g., $50/sqft for shell
};

/**
 * EQUITY VISION 2.0 VALUATION LOGIC (Module 5.1)
 * Calculates the "David Quinn Optimized Value" vs. Market Standard.
 */
export function calculateGCOptimizedValue(
  property: { aboveGradeSqFt: number; basementFinishedSqFt: number; basementUnfinishedSqFt: number },
  stats: MarketStats,
  adjustments: { craftsmanshipPremium: number; deferredMaint: number }
): number {
  // Tier 1: Above-Grade at 100% [cite: 362]
  const aboveGradeValue = property.aboveGradeSqFt * stats.basePricePerSqFt;

  // Tier 2: Finished Below-Grade [cite: 363]
  const basementFinishedValue =
    property.basementFinishedSqFt * (stats.basePricePerSqFt * stats.basementFinishedMultiplier);

  // Tier 3: Unfinished Shell [cite: 364]
  const basementShellValue = property.basementUnfinishedSqFt * stats.basementUnfinishedValue;

  const structuralBaseline = aboveGradeValue + basementFinishedValue + basementShellValue;

  // Apply "GC Lens" Adjustments [cite: 365, 378]
  return structuralBaseline + adjustments.craftsmanshipPremium - adjustments.deferredMaint;
}

export const marketData: MarketStats[] = [
  {
    slug: "boulder-central-co-housing-market",
    name: "Central Boulder Housing Market",
    city: "Boulder",
    county: "Boulder County",
    medianPrice: 1450000,
    priceChange: 5.2,
    avgDaysOnMarket: 22,
    inventory: 58,
    salesLast30: 19,
    basePricePerSqFt: 850,
    basementFinishedMultiplier: 0.70, // Standard finished basement ROI [cite: 363]
    basementUnfinishedValue: 75       // Utility value for unfinished shell [cite: 364]
  },
  {
    slug: "gunbarrel-boulder-co-housing-market",
    name: "Gunbarrel Housing Market",
    city: "Boulder",
    county: "Boulder County",
    medianPrice: 865000,
    priceChange: 4.8,
    avgDaysOnMarket: 18,
    inventory: 42,
    salesLast30: 26,
    basePricePerSqFt: 525,
    basementFinishedMultiplier: 0.60,
    basementUnfinishedValue: 50
  },
  {
    slug: "louisville-co-housing-market",
    name: "Louisville Housing Market",
    city: "Louisville",
    county: "Boulder County",
    medianPrice: 925000,
    priceChange: 5.3,
    avgDaysOnMarket: 14,
    inventory: 35,
    salesLast30: 22,
    basePricePerSqFt: 580,
    basementFinishedMultiplier: 0.65,
    basementUnfinishedValue: 55
  }
];