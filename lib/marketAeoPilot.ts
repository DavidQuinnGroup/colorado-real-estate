import type { CityData } from './cities';
import type { CityMarketExperience } from './marketIntelligenceExperience';
import type { FAQItem } from './schema/faqSchema';

export const MARKET_AEO_BOULDER_PILOT_STATUS = 'REIE_MARKET_AEO_BOULDER_PILOT_IMPLEMENTED';
export const MARKET_AEO_BOULDER_PILOT_ROUTE = 'boulder-co-housing-market';
export const MARKET_AEO_BOULDER_PILOT_SOURCE_ID = 'REIE_GOVERNED_CITY_MARKET_CONTEXT';
export const MARKET_AEO_MULTI_CITY_WAVE_STATUS = 'REIE_MARKET_AEO_MULTI_CITY_WAVE_IMPLEMENTED';
export const MARKET_AEO_MULTI_CITY_SOURCE_ID = 'REIE_GOVERNED_CITY_MARKET_CONTEXT';
export const MARKET_AEO_MULTI_CITY_AUTHORIZED_ROUTES = [
  'boulder-co-housing-market',
  'louisville-co-housing-market',
  'lafayette-co-housing-market',
  'denver-co-housing-market',
  'longmont-co-housing-market',
] as const;

export type MarketAeoFreshnessStatus = 'CURRENT' | 'AGING' | 'STALE' | 'UNKNOWN';
export type MarketAeoRoute = (typeof MARKET_AEO_MULTI_CITY_AUTHORIZED_ROUTES)[number];

export type MarketAeoPilotAnswer = {
  question: string;
  answer: string;
  claimEligible: boolean;
  limitation: string;
};

export type MarketAeoContract = {
  status: typeof MARKET_AEO_BOULDER_PILOT_STATUS | typeof MARKET_AEO_MULTI_CITY_WAVE_STATUS;
  route: MarketAeoRoute;
  geography: {
    city: string;
    state: 'Colorado';
    scope: 'city-market';
  };
  source: {
    id: typeof MARKET_AEO_BOULDER_PILOT_SOURCE_ID | typeof MARKET_AEO_MULTI_CITY_SOURCE_ID;
    label: string;
  };
  marketPeriod: string;
  freshness: {
    status: MarketAeoFreshnessStatus;
    label: string;
  };
  limitations: string[];
  visibleAnswers: MarketAeoPilotAnswer[];
  structuredDataFaqs: FAQItem[];
};

export type BoulderMarketAeoPilot = MarketAeoContract & {
  status: typeof MARKET_AEO_BOULDER_PILOT_STATUS;
  route: typeof MARKET_AEO_BOULDER_PILOT_ROUTE;
  geography: {
    city: 'Boulder';
    state: 'Colorado';
    scope: 'city-market';
  };
};

type MarketAeoCityConfig = {
  route: MarketAeoRoute;
  city: string;
  sourceLabel: string;
  marketPeriod: string;
  freshnessLabel: string;
  qualification: string;
};

const MARKET_AEO_CITY_CONFIGS: Record<MarketAeoRoute, MarketAeoCityConfig> = {
  'boulder-co-housing-market': {
    route: 'boulder-co-housing-market',
    city: 'Boulder',
    sourceLabel: 'Existing REIE governed city-market data and certified public market-page context.',
    marketPeriod: 'Current published REIE Boulder city-market briefing',
    freshnessLabel: 'Current as published REIE context; not a live MLS or provider feed.',
    qualification: 'production-certified reference implementation',
  },
  'louisville-co-housing-market': {
    route: 'louisville-co-housing-market',
    city: 'Louisville',
    sourceLabel: 'Existing REIE governed city-market data and certified Louisville Decision Guide context.',
    marketPeriod: 'Current published REIE Louisville city-market briefing',
    freshnessLabel: 'Current as published REIE context; not a live MLS or provider feed.',
    qualification: 'high-readiness certified Decision Guide extension',
  },
  'lafayette-co-housing-market': {
    route: 'lafayette-co-housing-market',
    city: 'Lafayette',
    sourceLabel: 'Existing REIE governed city-market data and certified Lafayette Decision Guide context.',
    marketPeriod: 'Current published REIE Lafayette city-market briefing',
    freshnessLabel: 'Current as published REIE context after focused source/freshness qualification; not a live MLS or provider feed.',
    qualification: 'source/freshness-qualified certified Decision Guide extension',
  },
  'denver-co-housing-market': {
    route: 'denver-co-housing-market',
    city: 'Denver',
    sourceLabel: 'Existing REIE governed city-market data and certified enhanced-foundation Denver context.',
    marketPeriod: 'Current published REIE Denver city-market briefing',
    freshnessLabel: 'Current as published REIE context; not a live MLS or provider feed.',
    qualification: 'enhanced-foundation city-market extension',
  },
  'longmont-co-housing-market': {
    route: 'longmont-co-housing-market',
    city: 'Longmont',
    sourceLabel: 'Existing REIE governed city-market data and certified enhanced-foundation Longmont context.',
    marketPeriod: 'Current published REIE Longmont city-market briefing',
    freshnessLabel: 'Current as published REIE context with explicit freshness limitation; not a live MLS or provider feed.',
    qualification: 'enhanced-foundation city-market extension with explicit freshness treatment',
  },
};

function getMarketAeoConfig(city: CityData) {
  return MARKET_AEO_CITY_CONFIGS[city.marketSlug as MarketAeoRoute] ?? null;
}

export function isMarketAeoAuthorizedRoute(route: string): route is MarketAeoRoute {
  return MARKET_AEO_MULTI_CITY_AUTHORIZED_ROUTES.includes(route as MarketAeoRoute);
}

export function buildMarketAeoContract({
  city,
  marketExperience,
  neighborhoodCount,
}: {
  city: CityData;
  marketExperience: CityMarketExperience;
  neighborhoodCount: number;
}): MarketAeoContract | null {
  const config = getMarketAeoConfig(city);
  if (!config) return null;

  const limitations = [
    'This is the current published REIE city-market briefing, not a live feed or period-over-period market report.',
    'It does not predict appreciation, estimate property value, rank neighborhoods, or determine suitability.',
    'Property condition, disclosures, comparable sales, financing, insurance, taxes, HOA context, and advisor review still require verification.',
  ];

  const visibleAnswers: MarketAeoPilotAnswer[] = [
    {
      question: `What is the current ${config.city} market signal?`,
      answer: `${config.city} is framed as ${marketExperience.directionLabel.toLowerCase()} with ${marketExperience.competitivenessLabel.toLowerCase()}, based on the current published REIE city-market briefing.`,
      claimEligible: true,
      limitation: 'Eligible as route-level context only; it is not a prediction or property-specific conclusion.',
    },
    {
      question: `What evidence is safe to use from this ${config.city} briefing?`,
      answer: `Use the ${city.stats.medianPrice} median price context, ${city.stats.inventory} active inventory signal, ${city.stats.daysOnMarket} days-on-market pace, and ${neighborhoodCount} neighborhood context paths to decide what to verify next.`,
      claimEligible: true,
      limitation: 'Eligible only as customer orientation from existing governed REIE data and public search signals where available.',
    },
    {
      question: `What should I not conclude from the ${config.city} market signal?`,
      answer: 'Do not treat the signal as a valuation, forecast, neighborhood ranking, live availability guarantee, or advice that any specific home is a good fit.',
      claimEligible: false,
      limitation: 'Unsupported claims are intentionally excluded from the visible answer and FAQ contract.',
    },
  ];

  return {
    status: config.route === MARKET_AEO_BOULDER_PILOT_ROUTE ? MARKET_AEO_BOULDER_PILOT_STATUS : MARKET_AEO_MULTI_CITY_WAVE_STATUS,
    route: config.route,
    geography: {
      city: config.city,
      state: 'Colorado',
      scope: 'city-market',
    },
    source: {
      id: config.route === MARKET_AEO_BOULDER_PILOT_ROUTE ? MARKET_AEO_BOULDER_PILOT_SOURCE_ID : MARKET_AEO_MULTI_CITY_SOURCE_ID,
      label: `${config.sourceLabel} Qualification: ${config.qualification}.`,
    },
    marketPeriod: config.marketPeriod,
    freshness: {
      status: 'CURRENT',
      label: config.freshnessLabel,
    },
    limitations,
    visibleAnswers,
    structuredDataFaqs: visibleAnswers.map(({ question, answer }) => ({
      question,
      answer,
    })),
  };
}

export function buildBoulderMarketAeoPilot(args: {
  city: CityData;
  marketExperience: CityMarketExperience;
  neighborhoodCount: number;
}): BoulderMarketAeoPilot | null {
  const contract = buildMarketAeoContract(args);
  if (!contract || contract.route !== MARKET_AEO_BOULDER_PILOT_ROUTE) return null;
  return contract as BoulderMarketAeoPilot;
}
