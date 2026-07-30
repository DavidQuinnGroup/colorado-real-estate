import type { CityData } from './cities';
import type { CityMarketExperience } from './marketIntelligenceExperience';

export const MARKET_PRODUCT_3_STATUS = 'MARKET_PRODUCT_3_VIS_ACTIVATION_COMPLETE';

export const MARKET_PRODUCT_3_AUTHORIZED_CITY_SLUGS = [
  'boulder-co-housing-market',
  'lafayette-co-housing-market',
  'louisville-co-housing-market',
] as const;

export type MarketProduct3EvidenceState = 'complete' | 'sparse' | 'missing' | 'conflict';

export type MarketProduct3PulseFactor = {
  label: string;
  exactValue: string;
  interpretation: string;
};

export type MarketProduct3Experience = {
  scope: 'state' | 'city';
  subject: string;
  evidenceState: MarketProduct3EvidenceState;
  authorizedRichInterpretation: boolean;
  condition: string;
  observedDirection: string;
  period: string;
  oneSentence: string;
  whatChanged: string;
  whyItMatters: string;
  buyerInterpretation: string;
  sellerInterpretation: string;
  localVariation: string;
  verificationPrompt: string;
  nextExploration: {
    label: string;
    href: string;
  };
  pulseFactors: MarketProduct3PulseFactor[];
  confidenceLayer: {
    sourceAuthority: string;
    freshness: string;
    completeness: string;
    limitations: string;
    conflicts: string;
    verification: string;
  };
};

function parseStat(value: string) {
  const parsed = Number(value.replace(/[^0-9.]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function hasCoreCityEvidence(city: CityData) {
  return Boolean(
    city.stats.medianPrice &&
      city.stats.pricePerSqFt &&
      parseStat(city.stats.daysOnMarket) > 0 &&
      parseStat(city.stats.inventory) > 0 &&
      city.stats.marketHealthScore > 0,
  );
}

function isAuthorizedRichCity(city: CityData) {
  return MARKET_PRODUCT_3_AUTHORIZED_CITY_SLUGS.includes(
    city.marketSlug as (typeof MARKET_PRODUCT_3_AUTHORIZED_CITY_SLUGS)[number],
  );
}

function getCityEvidenceState(city: CityData): MarketProduct3EvidenceState {
  if (!hasCoreCityEvidence(city)) return 'missing';
  return isAuthorizedRichCity(city) ? 'complete' : 'sparse';
}

export function buildCityMarketProduct3Experience({
  city,
  marketExperience,
  neighborhoodCount,
}: {
  city: CityData;
  marketExperience: CityMarketExperience;
  neighborhoodCount: number;
}): MarketProduct3Experience {
  const evidenceState = getCityEvidenceState(city);
  const authorizedRichInterpretation = evidenceState === 'complete';
  const daysOnMarket = parseStat(city.stats.daysOnMarket);
  const inventory = parseStat(city.stats.inventory);
  const period = 'Current governed REIE city market snapshot';

  const boundedIntro = authorizedRichInterpretation
    ? `${city.name} has enough governed city and guide context for public visual interpretation.`
    : `${city.name} has foundation market data, so REIE keeps interpretation bounded until editorial certification is complete.`;

  return {
    scope: 'city',
    subject: city.name,
    evidenceState,
    authorizedRichInterpretation,
    condition: marketExperience.directionLabel,
    observedDirection: `${marketExperience.competitivenessLabel}; ${marketExperience.timingLabel.toLowerCase()}.`,
    period,
    oneSentence: `${city.name} is best read as ${marketExperience.directionLabel.toLowerCase()} with ${marketExperience.competitivenessLabel.toLowerCase()}, based on existing REIE market facts rather than a forecast.`,
    whatChanged:
      'The governed data set does not include period-over-period movement, so REIE does not claim a recent market change.',
    whyItMatters: `${boundedIntro} Buyers and sellers can separate pace, price context, inventory, and verification questions before making the next decision.`,
    buyerInterpretation:
      inventory <= 45 || daysOnMarket <= 21
        ? 'Buyers should define must-haves, verification questions, and decision thresholds before touring because matching homes may require faster review.'
        : 'Buyers should use the available selection to compare criteria, condition, ownership costs, and neighborhood context before narrowing too quickly.',
    sellerInterpretation:
      inventory <= 45 || daysOnMarket <= 21
        ? 'Sellers should prepare pricing evidence, condition documentation, and competing-inventory context before assuming demand alone will answer buyer questions.'
        : 'Sellers should understand competing inventory and property-specific trade-offs before deciding how to position the home.',
    localVariation:
      neighborhoodCount > 0
        ? `${city.name} includes ${neighborhoodCount} neighborhood context paths, so city-level signals should be verified against the exact area and property.`
        : `${city.name} currently has city-level market context without certified neighborhood-depth expansion, so REIE avoids detailed local-authority claims.`,
    verificationPrompt:
      'Verify current inventory, property condition, comparable context, disclosures, and advisor guidance before relying on any market signal.',
    nextExploration: {
      label: `Search ${city.name} homes`,
      href: `/search?${new URLSearchParams({ city: city.name }).toString()}`,
    },
    pulseFactors: [
      {
        label: 'Condition',
        exactValue: marketExperience.directionLabel,
        interpretation: 'Explains current market posture without predicting future price movement.',
      },
      {
        label: 'Inventory',
        exactValue: `${city.stats.inventory} active signal`,
        interpretation: 'Frames selection depth and preparation needs before search.',
      },
      {
        label: 'Pace',
        exactValue: `${city.stats.daysOnMarket} days on market`,
        interpretation: 'Helps customers decide how much diligence to prepare before touring.',
      },
      {
        label: 'Price Context',
        exactValue: `${city.stats.medianPrice} median / ${city.stats.pricePerSqFt} per sq ft`,
        interpretation: 'Orients expectations while preserving property-level verification.',
      },
    ],
    confidenceLayer: {
      sourceAuthority: 'Existing REIE governed city market data and certified Decision Guide registry where available.',
      freshness: period,
      completeness: authorizedRichInterpretation
        ? 'Complete evidence for bounded public interpretation across Boulder, Lafayette, and Louisville.'
        : 'Limited evidence; public presentation is intentionally limited.',
      limitations: 'No AI, forecasting, valuation model, provider GIS, customer telemetry, or external source activation is used.',
      conflicts: 'No conflicting evidence is represented in the current repository data contract.',
      verification: 'Treat the pulse as decision guidance, then verify live listings, disclosures, condition, and advisor context.',
    },
  };
}

export function buildStateMarketProduct3Experience({
  cityCount,
  neighborhoodCount,
  certifiedGuideCount,
  primaryCondition,
  primaryPricing,
}: {
  cityCount: number;
  neighborhoodCount: number;
  certifiedGuideCount: number;
  primaryCondition: string;
  primaryPricing: string;
}): MarketProduct3Experience {
  return {
    scope: 'state',
    subject: 'Colorado Front Range',
    evidenceState: 'complete',
    authorizedRichInterpretation: true,
    condition: primaryCondition,
    observedDirection: 'City-by-city comparison is required before narrowing into property search.',
    period: 'Current governed REIE market discovery snapshot',
    oneSentence:
      'Colorado market intelligence is most useful when customers compare city context, certified local guides, and search paths before choosing where to focus.',
    whatChanged:
      'Market interpretation reorganizes existing market facts into a visual decision report without adding providers, predictions, or source activation.',
    whyItMatters:
      'Customers see the market story, available guide depth, and verification path before entering a dense list of city links.',
    buyerInterpretation:
      'Buyers should compare market pace, inventory depth, and neighborhood context before treating any single listing as the obvious next step.',
    sellerInterpretation:
      'Sellers should compare local demand signals, competing inventory, and preparation needs before deciding how to frame a sale conversation.',
    localVariation: `${cityCount} city market paths, ${neighborhoodCount} neighborhood paths, and ${certifiedGuideCount} certified Decision Guides are represented.`,
    verificationPrompt:
      'Use city pages, search results, property detail pages, and advisor review to verify what the statewide view cannot decide.',
    nextExploration: {
      label: 'Explore certified guides',
      href: '#certified-decision-guides',
    },
    pulseFactors: [
      {
        label: 'Primary Condition',
        exactValue: primaryCondition,
        interpretation: 'Uses the strongest current city signal as an orientation point, not a statewide prediction.',
      },
      {
        label: 'Pricing Context',
        exactValue: primaryPricing,
        interpretation: 'Shows the leading city reference while requiring city and property verification.',
      },
      {
        label: 'City Paths',
        exactValue: `${cityCount} market paths`,
        interpretation: 'Keeps market discovery broad before customers narrow into one city.',
      },
      {
        label: 'Certified Guides',
        exactValue: `${certifiedGuideCount} certified guides`,
        interpretation: 'Highlights only editorially certified local-authority guides.',
      },
    ],
    confidenceLayer: {
      sourceAuthority: 'Existing REIE market summaries and certified Decision Guide registry.',
      freshness: 'Current governed REIE market discovery snapshot',
      completeness: 'Complete evidence for statewide market discovery; city depth varies by certification state.',
      limitations: 'No AI, forecasting, valuation model, provider GIS, customer telemetry, or external source activation is used.',
      conflicts: 'No conflicting evidence is represented in the current repository data contract.',
      verification: 'Use the statewide pulse to choose a city path, then verify live listings, local guide depth, and property context.',
    },
  };
}
