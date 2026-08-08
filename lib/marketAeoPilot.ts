import type { CityData } from './cities';
import type { CityMarketExperience } from './marketIntelligenceExperience';
import type { FAQItem } from './schema/faqSchema';

export const MARKET_AEO_BOULDER_PILOT_STATUS = 'REIE_MARKET_AEO_BOULDER_PILOT_IMPLEMENTED';
export const MARKET_AEO_BOULDER_PILOT_ROUTE = 'boulder-co-housing-market';
export const MARKET_AEO_BOULDER_PILOT_SOURCE_ID = 'REIE_GOVERNED_CITY_MARKET_CONTEXT';

export type MarketAeoFreshnessStatus = 'CURRENT' | 'AGING' | 'STALE' | 'UNKNOWN';

export type MarketAeoPilotAnswer = {
  question: string;
  answer: string;
  claimEligible: boolean;
  limitation: string;
};

export type BoulderMarketAeoPilot = {
  status: typeof MARKET_AEO_BOULDER_PILOT_STATUS;
  route: typeof MARKET_AEO_BOULDER_PILOT_ROUTE;
  geography: {
    city: 'Boulder';
    state: 'Colorado';
    scope: 'city-market';
  };
  source: {
    id: typeof MARKET_AEO_BOULDER_PILOT_SOURCE_ID;
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

export function buildBoulderMarketAeoPilot({
  city,
  marketExperience,
  neighborhoodCount,
}: {
  city: CityData;
  marketExperience: CityMarketExperience;
  neighborhoodCount: number;
}): BoulderMarketAeoPilot | null {
  if (city.marketSlug !== MARKET_AEO_BOULDER_PILOT_ROUTE) return null;

  const limitations = [
    'This is the current published REIE city-market briefing, not a live feed or period-over-period market report.',
    'It does not predict appreciation, estimate property value, rank neighborhoods, or determine suitability.',
    'Property condition, disclosures, comparable sales, financing, insurance, taxes, HOA context, and advisor review still require verification.',
  ];

  const visibleAnswers: MarketAeoPilotAnswer[] = [
    {
      question: 'What is the current Boulder market signal?',
      answer: `Boulder is framed as ${marketExperience.directionLabel.toLowerCase()} with ${marketExperience.competitivenessLabel.toLowerCase()}, based on the current published REIE city-market briefing.`,
      claimEligible: true,
      limitation: 'Eligible as route-level context only; it is not a prediction or property-specific conclusion.',
    },
    {
      question: 'What evidence is safe to use from this Boulder briefing?',
      answer: `Use the ${city.stats.medianPrice} median price context, ${city.stats.inventory} active inventory signal, ${city.stats.daysOnMarket} days-on-market pace, and ${neighborhoodCount} neighborhood context paths to decide what to verify next.`,
      claimEligible: true,
      limitation: 'Eligible only as customer orientation from existing governed REIE data and public search signals where available.',
    },
    {
      question: 'What should I not conclude from the Boulder market signal?',
      answer: 'Do not treat the signal as a valuation, forecast, neighborhood ranking, live availability guarantee, or advice that any specific home is a good fit.',
      claimEligible: false,
      limitation: 'Unsupported claims are intentionally excluded from the visible answer and FAQ contract.',
    },
  ];

  return {
    status: MARKET_AEO_BOULDER_PILOT_STATUS,
    route: MARKET_AEO_BOULDER_PILOT_ROUTE,
    geography: {
      city: 'Boulder',
      state: 'Colorado',
      scope: 'city-market',
    },
    source: {
      id: MARKET_AEO_BOULDER_PILOT_SOURCE_ID,
      label: 'Existing REIE governed city-market data and certified public market-page context.',
    },
    marketPeriod: 'Current published REIE Boulder city-market briefing',
    freshness: {
      status: 'CURRENT',
      label: 'Current as published REIE context; not a live MLS or provider feed.',
    },
    limitations,
    visibleAnswers,
    structuredDataFaqs: visibleAnswers.map(({ question, answer }) => ({
      question,
      answer,
    })),
  };
}
