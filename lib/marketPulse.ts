/**
 * DQG Market Pulse Generator.
 * Builds city-level velocity, leverage, and authority narratives for REIE
 * market intelligence surfaces.
 */

import {
  calculateMarketVelocity,
  calculateNegotiationLeverage,
  getMarketIntegrityLevel,
} from "./marketAnalytics";
import { cities, type CityData } from "./cities";
import { marketTrends } from "./marketTrends";

export type TrendDirection = "Ascending" | "Descending" | "Stable";

export type MarketPulseReport = {
  city: string;
  velocityScore: number;
  leverageScore: number;
  integrityLevel: ReturnType<typeof getMarketIntegrityLevel>;
  trendDirection: TrendDirection;
  authorityNarrative: string;
  socialInfographicData: {
    headline: string;
    subheadline: string;
    statValue: string;
  };
};

type MarketTrendPoint = {
  month: string;
  price: number;
};

const historicalDomBaseline = 30;
const defaultDemandIndex = 0.65;
const defaultSaleToListRatio = 1.02;
const absorptionInventoryDivisor = 20;

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function parseMetricNumber(value: string) {
  const numeric = Number.parseFloat(value.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
}

function findCity(citySlug: string) {
  const normalizedSlug = normalize(citySlug);

  return cities.find(
    (city) =>
      normalize(city.marketSlug) === normalizedSlug ||
      normalize(city.slug) === normalizedSlug ||
      normalize(city.name) === normalizedSlug
  );
}

function getTrendPoints(city: CityData): MarketTrendPoint[] {
  const trendKey = normalize(city.name) as keyof typeof marketTrends;
  return marketTrends[trendKey] || [];
}

function getTrendDirection(trends: MarketTrendPoint[]): TrendDirection {
  if (trends.length < 2) {
    return "Stable";
  }

  const lastPrice = trends[trends.length - 1]?.price ?? 0;
  const previousPrice = trends[trends.length - 2]?.price ?? lastPrice;

  if (lastPrice > previousPrice) return "Ascending";
  if (lastPrice < previousPrice) return "Descending";
  return "Stable";
}

function buildAuthorityNarrative({
  city,
  integrityLevel,
  leverageScore,
  trendDirection,
  velocityScore,
}: {
  city: CityData;
  integrityLevel: MarketPulseReport["integrityLevel"];
  leverageScore: number;
  trendDirection: TrendDirection;
  velocityScore: number;
}) {
  const scarcitySignal =
    leverageScore > 70 ? "extreme scarcity" : "a balanced tactical environment";

  return `The ${city.name} market is currently showing ${integrityLevel} integrity. With velocity moving ${velocityScore}% faster than the local baseline, buyers are facing ${scarcitySignal}. From a GC-informed perspective, the ${trendDirection.toLowerCase()} valuation trend is being shaped by construction quality, inventory pressure, and the Time Tax efficiency of local daily rituals.`;
}

/**
 * Builds the market pulse report for a city, city slug, or market slug.
 */
export function generateMarketPulse(citySlug: string): MarketPulseReport | null {
  const city = findCity(citySlug);

  if (!city) {
    return null;
  }

  const currentDom = parseMetricNumber(city.stats.daysOnMarket);
  const inventory = parseMetricNumber(city.stats.inventory);
  const velocityScore = calculateMarketVelocity(currentDom, historicalDomBaseline);
  const leverageScore = calculateNegotiationLeverage(
    inventory / absorptionInventoryDivisor,
    defaultDemandIndex,
    defaultSaleToListRatio
  );
  const integrityLevel = getMarketIntegrityLevel(leverageScore);
  const trendDirection = getTrendDirection(getTrendPoints(city));
  const authorityNarrative = buildAuthorityNarrative({
    city,
    integrityLevel,
    leverageScore,
    trendDirection,
    velocityScore,
  });

  return {
    city: city.name,
    velocityScore,
    leverageScore,
    integrityLevel,
    trendDirection,
    authorityNarrative,
    socialInfographicData: {
      headline: `${city.name} Market Velocity: ${velocityScore}% Pulse`,
      subheadline: `Negotiation Leverage: ${leverageScore}/100 [${integrityLevel}]`,
      statValue: city.stats.medianPrice,
    },
  };
}

/**
 * Formats market pulse data for social distribution.
 */
export function formatSocialPulse(report: MarketPulseReport): string {
  const tacticalAdvantage = report.leverageScore > 50 ? "Sellers" : "Buyers";

  return `
    [COLORADO MARKET PULSE: ${report.city.toUpperCase()}]

    Status: ${report.integrityLevel}
    Velocity: ${report.velocityScore}% Speed Increase vs Historical Norm
    Leverage: ${report.leverageScore}/100 (Tactical Advantage: ${tacticalAdvantage})

    "${report.authorityNarrative}"

    #ColoradoRealEstate #DQGIntelligence #MarketVelocity #BoulderRealEstate
  `;
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/marketPulse.ts
