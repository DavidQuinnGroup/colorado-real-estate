/**
 * DQG Market Data Synthesis.
 * Connects authority market baselines with North Star time-tax and investment
 * narrative logic.
 */

import { marketData, type MarketStats } from "./marketData";
import { calculateRitualPulse, type Coordinates } from "./utils/geo-logic";

export type MarketNorthStarAnchor = Coordinates & {
  frequency: number;
  label?: string;
};

export type FinancialMetrics = {
  totalMonthlyCost: number;
  timeTaxMonthly: number;
  monthlyTravelMinutes: number;
  appreciationProjection: number[];
  cashFlowEstimate?: number;
};

const defaultHourlyValue = 150;
const monthlyWeeks = 4.33;
const annualGrowthBaseline = 0.05;
const vehicleCostPerLostHour = 25;

function normalizeCity(city: string) {
  return city.trim().toLowerCase();
}

function clampFrequency(frequency: number) {
  if (!Number.isFinite(frequency)) return 0;
  return Math.max(0, Math.min(7, frequency));
}

function getMonthlyTravelMinutes(propertyCoords: Coordinates, userAnchors: MarketNorthStarAnchor[]) {
  return userAnchors.reduce((totalMinutes, anchor) => {
    const frequency = clampFrequency(anchor.frequency);

    if (frequency === 0) {
      return totalMinutes;
    }

    const pulse = calculateRitualPulse(propertyCoords, {
      lat: anchor.lat,
      lng: anchor.lng,
    });

    return totalMinutes + pulse.time * 2 * frequency * monthlyWeeks;
  }, 0);
}

function getAppreciationProjection(price: number) {
  return Array.from({ length: 10 }, (_, index) =>
    Math.round(price * Math.pow(1 + annualGrowthBaseline, index + 1))
  );
}

/**
 * Retrieves the authority baseline for a specific city or market slug.
 */
export async function getMarketContext(city: string): Promise<MarketStats | null> {
  const normalizedCity = normalizeCity(city);

  return (
    marketData.find(
      (stats) =>
        normalizeCity(stats.city) === normalizedCity ||
        normalizeCity(stats.name) === normalizedCity ||
        normalizeCity(stats.slug) === normalizedCity
    ) || null
  );
}

/**
 * Calculates total cost of living using PITI plus North Star transit cost.
 */
export function calculateTCOL(
  price: number,
  monthlyPITI: number,
  propertyCoords: Coordinates,
  userAnchors: MarketNorthStarAnchor[],
  hourlyValue: number = defaultHourlyValue
): FinancialMetrics {
  const monthlyTravelMinutes = getMonthlyTravelMinutes(propertyCoords, userAnchors);
  const monthlyHoursLost = monthlyTravelMinutes / 60;
  const timeTaxMonthly = monthlyHoursLost * hourlyValue;

  return {
    totalMonthlyCost: monthlyPITI + monthlyHoursLost * vehicleCostPerLostHour,
    timeTaxMonthly,
    monthlyTravelMinutes,
    appreciationProjection: getAppreciationProjection(price),
  };
}

/**
 * Evaluates the asset posture as income, appreciation, or balanced preservation.
 */
export function getInvestmentNarrative(yieldRate: number, appreciationRate: number): string {
  if (yieldRate > 0.06) {
    return "This property is a steady-income asset, ideal for long-term legacy funding.";
  }

  if (appreciationRate > 0.07) {
    return "High-velocity appreciation play: strategic exit recommended at 5-7 years.";
  }

  return "Balanced portfolio asset: low-volatility wealth preservation.";
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/getMarketData.ts
