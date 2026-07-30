import type { CityData } from './cities';
import type { Neighborhood } from './neighborhoods';

export type MarketSignal = {
  label: string;
  value: string;
  explanation: string;
};

export type MarketNextStep = {
  label: string;
  href: string;
  intent: 'search' | 'property' | 'seller' | 'context';
};

export type CityMarketExperience = {
  directionLabel: string;
  competitivenessLabel: string;
  pricingLabel: string;
  timingLabel: string;
  summary: string;
  sourceNote: string;
  signals: MarketSignal[];
  nextSteps: MarketNextStep[];
};

export type NeighborhoodMarketExperience = {
  inventoryLabel: string;
  competitivenessLabel: string;
  timingLabel: string;
  summary: string;
  sourceNote: string;
  signals: MarketSignal[];
  nextSteps: MarketNextStep[];
};

type InventoryState = {
  count: number;
  source: 'typesense' | 'fallback';
};

function parseNumber(value: string) {
  const parsed = Number(value.replace(/[^0-9.]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatSearchHref(city: string) {
  const params = new URLSearchParams({ city });
  return `/search?${params.toString()}`;
}

function getDirectionLabel(marketHealthScore: number) {
  if (marketHealthScore >= 85) return 'Strong seller pressure';
  if (marketHealthScore >= 72) return 'Competitive but selective';
  if (marketHealthScore >= 62) return 'Balanced with negotiation room';
  return 'Buyer caution market';
}

function getCompetitivenessLabel(inventory: number, daysOnMarket: number) {
  if (inventory <= 45 && daysOnMarket <= 21) return 'Tight inventory';
  if (inventory <= 100 && daysOnMarket <= 30) return 'Active competition';
  if (inventory >= 150 || daysOnMarket >= 34) return 'More selection';
  return 'Selective competition';
}

function getPricingLabel(medianPrice: string, pricePerSqFt: string) {
  return `${medianPrice} median / ${pricePerSqFt} per sq ft`;
}

function getTimingLabel(daysOnMarket: number) {
  if (daysOnMarket <= 18) return 'Prepare early for well-matched homes';
  if (daysOnMarket <= 30) return 'Prepare before touring';
  return 'Use time for deeper diligence';
}

export function buildCityMarketExperience(city: CityData, neighborhoodCount: number): CityMarketExperience {
  const inventory = parseNumber(city.stats.inventory);
  const daysOnMarket = parseNumber(city.stats.daysOnMarket);
  const directionLabel = getDirectionLabel(city.stats.marketHealthScore);
  const competitivenessLabel = getCompetitivenessLabel(inventory, daysOnMarket);
  const pricingLabel = getPricingLabel(city.stats.medianPrice, city.stats.pricePerSqFt);
  const timingLabel = getTimingLabel(daysOnMarket);

  return {
    directionLabel,
    competitivenessLabel,
    pricingLabel,
    timingLabel,
    summary: `${city.name} is currently framed as ${directionLabel.toLowerCase()} with ${competitivenessLabel.toLowerCase()}. Use the market signal to decide how prepared to be before search, touring, or seller review.`,
    sourceNote:
      'Market Intelligence uses governed city data, public search signals where available, and existing market-page context. It is not a forecast, appraisal, automated valuation, or provider-fed geographic analysis.',
    signals: [
      {
        label: 'Direction',
        value: directionLabel,
        explanation: `Market health is ${city.stats.marketHealthScore}/100, so the page frames pace and preparation without promising future movement.`,
      },
      {
        label: 'Pricing',
        value: pricingLabel,
        explanation: 'Median price and price-per-square-foot orient search expectations; condition and location still control property-level value.',
      },
      {
        label: 'Inventory',
        value: `${city.stats.inventory} active signal`,
        explanation: `${neighborhoodCount} neighborhood hubs provide context before narrowing into search or property review.`,
      },
      {
        label: 'Timing',
        value: timingLabel,
        explanation: `${city.stats.daysOnMarket} days on market is treated as a preparation signal, not a guarantee of negotiating outcome.`,
      },
    ],
    nextSteps: [
      {
        label: `Search ${city.name} homes`,
        href: formatSearchHref(city.name),
        intent: 'search',
      },
      {
        label: 'Request seller review',
        href: '/sell',
        intent: 'seller',
      },
      {
        label: 'Compare neighborhood context',
        href: '#market-neighborhood-context',
        intent: 'context',
      },
    ],
  };
}

export function buildNeighborhoodMarketExperience(
  neighborhood: Neighborhood,
  inventoryState: InventoryState,
): NeighborhoodMarketExperience {
  const inventoryLabel = inventoryState.source === 'typesense' ? 'Indexed inventory signal' : 'Modeled inventory context';
  const competitivenessLabel = inventoryState.count <= 3 ? 'Very limited selection' : inventoryState.count <= 8 ? 'Selective options' : 'Broader options';
  const timingLabel = neighborhood.fireRisk === 'High' || neighborhood.insuranceComplexity === 'Complex'
    ? 'Plan diligence before writing'
    : 'Compare context before touring';

  return {
    inventoryLabel,
    competitivenessLabel,
    timingLabel,
    summary: `${neighborhood.name} is framed through ${inventoryLabel.toLowerCase()}, ${competitivenessLabel.toLowerCase()}, and local condition context. Use this page to decide what to verify before search, touring, or property-specific review.`,
    sourceNote:
      'Neighborhood Market Intelligence uses governed neighborhood data and public inventory signals where available. It does not predict appreciation or availability and does not activate GIS providers, external geographic services, or AI-generated recommendations.',
    signals: [
      {
        label: 'Inventory',
        value: `${inventoryState.count} active`,
        explanation: inventoryState.source === 'typesense'
          ? 'Current count came from the existing listing index.'
          : 'Count uses the existing static fallback when listing-index neighborhood facets are unavailable.',
      },
      {
        label: 'Competitiveness',
        value: competitivenessLabel,
        explanation: 'Selection level helps frame search urgency without changing search result eligibility.',
      },
      {
        label: 'Pricing context',
        value: 'Verification context',
        explanation: 'Soil, insurance, and condition context help explain why property-level due diligence still matters.',
      },
      {
        label: 'Timing',
        value: timingLabel,
        explanation: 'Timing guidance is preparation-oriented and does not predict appreciation, availability, or tour access.',
      },
    ],
    nextSteps: [
      {
        label: `Search ${neighborhood.name}`,
        href: `/search?${new URLSearchParams({ city: neighborhood.city, query: neighborhood.name }).toString()}`,
        intent: 'search',
      },
      {
        label: `${neighborhood.city} market context`,
        href: `/market/${neighborhood.city.toLowerCase()}-co-housing-market`,
        intent: 'context',
      },
      {
        label: 'Request seller review',
        href: '/sell',
        intent: 'seller',
      },
    ],
  };
}
