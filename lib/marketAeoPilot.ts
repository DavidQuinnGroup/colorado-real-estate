import type { CityData } from './cities';
import type { CityMarketExperience } from './marketIntelligenceExperience';
import type { FAQItem } from './schema/faqSchema';

export const MARKET_AEO_BOULDER_PILOT_STATUS = 'REIE_MARKET_AEO_BOULDER_PILOT_IMPLEMENTED';
export const MARKET_AEO_BOULDER_PILOT_ROUTE = 'boulder-co-housing-market';
export const MARKET_AEO_BOULDER_PILOT_SOURCE_ID = 'REIE_GOVERNED_CITY_MARKET_CONTEXT';
export const MARKET_AEO_MULTI_CITY_WAVE_STATUS = 'REIE_MARKET_AEO_MULTI_CITY_WAVE_IMPLEMENTED';
export const MARKET_AEO_WAVE_2_STATUS = 'REIE_MARKET_AEO_WAVE_2_IMPLEMENTED';
export const MARKET_AEO_MULTI_CITY_SOURCE_ID = 'REIE_GOVERNED_CITY_MARKET_CONTEXT';
export const MARKET_AEO_MULTI_CITY_AUTHORIZED_ROUTES = [
  'boulder-co-housing-market',
  'louisville-co-housing-market',
  'lafayette-co-housing-market',
  'denver-co-housing-market',
  'longmont-co-housing-market',
  'broomfield-co-housing-market',
  'superior-co-housing-market',
  'erie-co-housing-market',
  'westminster-co-housing-market',
] as const;

export const MARKET_AEO_WAVE_1_ROUTES = [
  'boulder-co-housing-market',
  'louisville-co-housing-market',
  'lafayette-co-housing-market',
  'denver-co-housing-market',
  'longmont-co-housing-market',
] as const;

export const MARKET_AEO_WAVE_2_ROUTES = [
  'broomfield-co-housing-market',
  'superior-co-housing-market',
  'erie-co-housing-market',
  'westminster-co-housing-market',
] as const;

export type MarketAeoFreshnessStatus = 'CURRENT' | 'AGING' | 'UNKNOWN';
export type MarketAeoEvidenceState = 'CURRENT' | 'AGING' | 'UNKNOWN' | 'EXPLICIT_CONFLICT';
export type MarketAeoRoute = (typeof MARKET_AEO_MULTI_CITY_AUTHORIZED_ROUTES)[number];

export type MarketAeoPilotAnswer = {
  question: string;
  answer: string;
  claimEligible: boolean;
  limitation: string;
};

export type MarketAeoContract = {
  status: typeof MARKET_AEO_BOULDER_PILOT_STATUS | typeof MARKET_AEO_MULTI_CITY_WAVE_STATUS | typeof MARKET_AEO_WAVE_2_STATUS;
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
  evidenceState: MarketAeoEvidenceState;
  conflictState: 'NONE' | 'EXPLICIT_CONFLICT';
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
  freshnessStatus: MarketAeoFreshnessStatus;
  freshnessLabel: string;
  qualification: string;
  evidenceState: MarketAeoEvidenceState;
  conflictState?: 'NONE' | 'EXPLICIT_CONFLICT';
  claimSignalEligible?: boolean;
  routeLimitations?: string[];
};

const MARKET_AEO_CITY_CONFIGS: Record<MarketAeoRoute, MarketAeoCityConfig> = {
  'boulder-co-housing-market': {
    route: 'boulder-co-housing-market',
    city: 'Boulder',
    sourceLabel: 'Existing REIE governed city-market data and certified public market-page context.',
    marketPeriod: 'Current published REIE Boulder city-market briefing',
    freshnessStatus: 'CURRENT',
    freshnessLabel: 'Current as published REIE context; not a live MLS or provider feed.',
    qualification: 'production-certified reference implementation',
    evidenceState: 'CURRENT',
  },
  'louisville-co-housing-market': {
    route: 'louisville-co-housing-market',
    city: 'Louisville',
    sourceLabel: 'Existing REIE governed city-market data and certified Louisville Decision Guide context.',
    marketPeriod: 'Current published REIE Louisville city-market briefing',
    freshnessStatus: 'CURRENT',
    freshnessLabel: 'Current as published REIE context; not a live MLS or provider feed.',
    qualification: 'high-readiness certified Decision Guide extension',
    evidenceState: 'CURRENT',
  },
  'lafayette-co-housing-market': {
    route: 'lafayette-co-housing-market',
    city: 'Lafayette',
    sourceLabel: 'Existing REIE governed city-market data and certified Lafayette Decision Guide context.',
    marketPeriod: 'Current published REIE Lafayette city-market briefing',
    freshnessStatus: 'CURRENT',
    freshnessLabel: 'Current as published REIE context after focused source/freshness qualification; not a live MLS or provider feed.',
    qualification: 'source/freshness-qualified certified Decision Guide extension',
    evidenceState: 'CURRENT',
  },
  'denver-co-housing-market': {
    route: 'denver-co-housing-market',
    city: 'Denver',
    sourceLabel: 'Existing REIE governed city-market data and certified enhanced-foundation Denver context.',
    marketPeriod: 'Current published REIE Denver city-market briefing',
    freshnessStatus: 'CURRENT',
    freshnessLabel: 'Current as published REIE context; not a live MLS or provider feed.',
    qualification: 'enhanced-foundation city-market extension',
    evidenceState: 'CURRENT',
  },
  'longmont-co-housing-market': {
    route: 'longmont-co-housing-market',
    city: 'Longmont',
    sourceLabel: 'Existing REIE governed city-market data and certified enhanced-foundation Longmont context.',
    marketPeriod: 'Current published REIE Longmont city-market briefing',
    freshnessStatus: 'CURRENT',
    freshnessLabel: 'Current as published REIE context with explicit freshness limitation; not a live MLS or provider feed.',
    qualification: 'enhanced-foundation city-market extension with explicit freshness treatment',
    evidenceState: 'CURRENT',
  },
  'broomfield-co-housing-market': {
    route: 'broomfield-co-housing-market',
    city: 'Broomfield',
    sourceLabel: 'Existing REIE governed city-market data and certified enhanced-foundation Broomfield context.',
    marketPeriod: 'Current published REIE Broomfield city-market briefing',
    freshnessStatus: 'CURRENT',
    freshnessLabel: 'Current as published REIE context after route-level source and freshness qualification; not a live MLS or provider feed.',
    qualification: 'enhanced-foundation city-market extension with source/freshness qualification and limitation-bound claims',
    evidenceState: 'CURRENT',
    routeLimitations: [
      'Broomfield source completeness is not treated as evidence-complete; incomplete local evidence remains limitation-bound.',
      'Older foundation fields are not promoted into affirmative claims without current route-level support.',
    ],
  },
  'superior-co-housing-market': {
    route: 'superior-co-housing-market',
    city: 'Superior',
    sourceLabel: 'Existing REIE governed city-market data and certified enhanced-foundation Superior context.',
    marketPeriod: 'Aging/conflict-bounded published REIE Superior city-market briefing',
    freshnessStatus: 'AGING',
    freshnessLabel: 'Aging and conflict-bounded as published REIE context; current certainty is not asserted.',
    qualification: 'enhanced-foundation city-market extension with explicit aging, unknown, and conflict fail-closed treatment',
    evidenceState: 'EXPLICIT_CONFLICT',
    conflictState: 'EXPLICIT_CONFLICT',
    claimSignalEligible: false,
    routeLimitations: [
      'Superior market context must not imply current certainty; current certainty is not asserted where period, freshness, or geography evidence is unresolved.',
      'Rebuilding, hazard, insurance, environmental, structural, drainage, soil, and property-condition topics require separate professional or public-source verification.',
      'Those topics are not converted into safety, suitability, desirability, prediction, or property-specific claims.',
    ],
  },
  'erie-co-housing-market': {
    route: 'erie-co-housing-market',
    city: 'Erie',
    sourceLabel: 'Existing REIE governed city-market data and certified enhanced-foundation Erie context.',
    marketPeriod: 'Current published REIE Erie city-market briefing',
    freshnessStatus: 'CURRENT',
    freshnessLabel: 'Current as published REIE context; not a live MLS or provider feed.',
    qualification: 'additive city-market answer contract preserving existing local decision context',
    evidenceState: 'CURRENT',
  },
  'westminster-co-housing-market': {
    route: 'westminster-co-housing-market',
    city: 'Westminster',
    sourceLabel: 'Existing REIE governed city-market data and certified enhanced-foundation Westminster context.',
    marketPeriod: 'Current published REIE Westminster city-market briefing',
    freshnessStatus: 'CURRENT',
    freshnessLabel: 'Current as published REIE context; not a live MLS or provider feed.',
    qualification: 'additive city-market answer contract preserving existing local decision context',
    evidenceState: 'CURRENT',
  },
};

function getMarketAeoConfig(city: CityData) {
  return MARKET_AEO_CITY_CONFIGS[city.marketSlug as MarketAeoRoute] ?? null;
}

export function isMarketAeoAuthorizedRoute(route: string): route is MarketAeoRoute {
  return MARKET_AEO_MULTI_CITY_AUTHORIZED_ROUTES.includes(route as MarketAeoRoute);
}

function getMarketAeoStatus(route: MarketAeoRoute): MarketAeoContract['status'] {
  if (route === MARKET_AEO_BOULDER_PILOT_ROUTE) return MARKET_AEO_BOULDER_PILOT_STATUS;
  if (MARKET_AEO_WAVE_2_ROUTES.includes(route as (typeof MARKET_AEO_WAVE_2_ROUTES)[number])) return MARKET_AEO_WAVE_2_STATUS;
  return MARKET_AEO_MULTI_CITY_WAVE_STATUS;
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
    config.freshnessStatus === 'CURRENT'
      ? 'This is the current published REIE city-market briefing, not a live feed or period-over-period market report.'
      : 'This is an aging or unresolved published REIE city-market briefing, not a live feed, current certainty claim, or period-over-period market report.',
    'It does not predict appreciation, estimate property value, rank neighborhoods, or determine suitability.',
    'Property condition, disclosures, comparable sales, financing, insurance, taxes, HOA context, and advisor review still require verification.',
    ...(config.routeLimitations ?? []),
  ];
  const signalClaimEligible = config.claimSignalEligible ?? true;

  const visibleAnswers: MarketAeoPilotAnswer[] = [
    {
      question: `What is the current ${config.city} market signal?`,
      answer: signalClaimEligible
        ? `${config.city} is framed as ${marketExperience.directionLabel.toLowerCase()} with ${marketExperience.competitivenessLabel.toLowerCase()}, based on the current published REIE city-market briefing.`
        : `${config.city} should be treated as an aging, conflict-bounded briefing here; current certainty is not asserted until freshness, period, and route-specific evidence are verified.`,
      claimEligible: signalClaimEligible,
      limitation: signalClaimEligible
        ? 'Eligible as route-level context only; it is not a prediction or property-specific conclusion.'
        : 'Fails closed where freshness, period, or geography conflict could make a current-signal claim stronger than the evidence supports.',
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
    status: getMarketAeoStatus(config.route),
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
      status: config.freshnessStatus,
      label: config.freshnessLabel,
    },
    evidenceState: config.evidenceState,
    conflictState: config.conflictState ?? 'NONE',
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
