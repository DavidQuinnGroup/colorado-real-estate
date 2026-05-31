/**
 * DQG Strategy Synthesis Engine.
 * Produces the private expert-layer brief used after a client has crossed the
 * REIE strategy gate.
 */

import { getAuthorAttribution } from "./authors";
import { getResilienceAdvice, type Neighborhood } from "./neighborhoods";

type LeadMetadata = {
  lead_heat_score?: number | null;
  aestheticProfile?: string | null;
  financial_intent?: {
    estimated_equity?: number | null;
  } | null;
};

type StrategyNorthStar = {
  name?: string | null;
};

export type StrategyLead = {
  name?: string | null;
  email?: string | null;
  metadata?: LeadMetadata | null;
  northStars?: StrategyNorthStar[] | null;
};

export type StrategyTcolData = {
  hardCashOutflow?: number | null;
  trueEconomicCost?: number | null;
  timeTaxBreakdown?: number | null;
  reserveAllocation?: number | null;
};

export type StrategyBrief = {
  clientName: string;
  heatScore: number;
  aestheticProfile: string;
  efficiencyAudit: {
    weeklyTimeSavings: string;
    primaryAnchor: string;
    monthlyTimeTax: string;
  };
  structuralForensics: {
    analysis: string;
    redFlags: string[];
  };
  negotiationPlaybook: {
    openingStrategy: string;
    leveragePoints: string[];
  };
  attribution: string;
};

const defaultClientName = "Private Client";
const defaultAestheticProfile = "Modern-Industrial";
const defaultNorthStar = "Not Defined";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  maximumFractionDigits: 0,
  style: "currency",
});

function getFiniteNumber(value: number | null | undefined, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function getClientName(lead: StrategyLead) {
  const name = lead.name?.trim();
  return name || defaultClientName;
}

function getAestheticProfile(lead: StrategyLead) {
  const profile = lead.metadata?.aestheticProfile?.trim();
  return profile || defaultAestheticProfile;
}

function getPrimaryAnchor(lead: StrategyLead) {
  const primaryAnchor = lead.northStars?.[0]?.name?.trim();
  return primaryAnchor || defaultNorthStar;
}

function getWeeklyTimeSavings(timeTaxBreakdown: number) {
  return `${(timeTaxBreakdown / 100).toFixed(1)} Hours`;
}

function getRedFlags(neighborhood: Neighborhood) {
  const redFlags: string[] = [];

  if (neighborhood.fireRisk === "High" || neighborhood.fireRisk === "Extreme") {
    redFlags.push("Wildfire insurance underwriting complexity identified.");
  }

  if (!neighborhood.waterRights) {
    redFlags.push("No deeded water rights; utility cost reconciliation needed.");
  }

  if (neighborhood.insuranceComplexity !== "Standard") {
    redFlags.push(
      `${neighborhood.insuranceComplexity} insurance posture requires carrier review before offer strategy hardens.`
    );
  }

  return redFlags;
}

function getOpeningStrategy(estimatedEquity: number) {
  if (estimatedEquity > 100000) {
    return "Aggressive value-add play: leverage structural equity potential.";
  }

  if (estimatedEquity > 0) {
    return "Balanced proceeds strategy: preserve equity while limiting concession exposure.";
  }

  return "Conservative alignment: focus on low-concession closing and liquidity protection.";
}

/**
 * Generates the private master strategy brief after REIE has gathered client,
 * location, resilience, and cost-of-living signals.
 */
export async function generateMasterStrategyBrief(
  lead: StrategyLead,
  neighborhood: Neighborhood,
  tcolData: StrategyTcolData
): Promise<StrategyBrief> {
  const resilience = getResilienceAdvice(neighborhood);
  const timeTaxBreakdown = getFiniteNumber(tcolData.timeTaxBreakdown);
  const estimatedEquity = getFiniteNumber(lead.metadata?.financial_intent?.estimated_equity);

  return {
    clientName: getClientName(lead),
    heatScore: getFiniteNumber(lead.metadata?.lead_heat_score),
    aestheticProfile: getAestheticProfile(lead),
    efficiencyAudit: {
      weeklyTimeSavings: getWeeklyTimeSavings(timeTaxBreakdown),
      primaryAnchor: getPrimaryAnchor(lead),
      monthlyTimeTax: currencyFormatter.format(timeTaxBreakdown),
    },
    structuralForensics: {
      analysis: resilience.analysis,
      redFlags: getRedFlags(neighborhood),
    },
    negotiationPlaybook: {
      openingStrategy: getOpeningStrategy(estimatedEquity),
      leveragePoints: [
        `Efficiency Gain: saves client ${currencyFormatter.format(timeTaxBreakdown)} in monthly economic value.`,
        `GC Insight: ${resilience.tacticalLever}`,
      ],
    },
    attribution: getAuthorAttribution("david-quinn"),
  };
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/strategyGenerator.ts
