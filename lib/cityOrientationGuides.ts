import { cities, getCityByMarketSlug } from './cities';
import { getDecisionGuideRegistryEntry } from './coloradoDecisionGuideRegistry';
import {
  buildCityOrientationGuidePath,
  CITY_ORIENTATION_GUIDE_INTENT_SLUGS,
  CITY_ORIENTATION_GUIDE_STATUS,
  CITY_ORIENTATION_GUIDE_TARGET_CITY_SLUGS,
  type CityOrientationGuide,
  type CityOrientationGuideIntentSlug,
  type CityOrientationGuideTargetCitySlug,
} from './cityOrientationGuideContract';
import { buildMarketAeoContract } from './marketAeoPilot';
import { buildCityMarketExperience } from './marketIntelligenceExperience';
import { neighborhoods } from './neighborhoods';

const SITE_URL = 'https://davidquinngroup.com';

type GuideIntentTemplate = {
  slug: CityOrientationGuideIntentSlug;
  label: string;
  customerQuestion: string;
  editorialQuestion: string;
  answer: (cityName: string) => string;
  evidenceBasis: (cityName: string, marketSourceLabel: string) => string;
  marketPeriod: (marketPeriod: string) => string;
  freshnessState: CityOrientationGuide['freshness']['state'];
  freshnessLabel: (marketFreshnessLabel: string) => string;
  limitation: (cityName: string) => string;
  verificationPath: (cityName: string) => string;
  claimEligibility: CityOrientationGuide['claimEligibility'];
};

const GUIDE_INTENTS: GuideIntentTemplate[] = [
  {
    slug: 'orienting-before-search',
    label: 'Orienting Before Searching',
    customerQuestion: 'What geographic and practical place questions should I investigate before narrowing property listings in this city?',
    editorialQuestion: 'Which place questions should frame the first search pass before a customer treats listings as comparable options?',
    answer: (cityName) =>
      `Start with ${cityName} as a geography and daily-life question before treating listings as the answer. Identify the market route, search path, known local context, and the specific facts that still need verification.`,
    evidenceBasis: (cityName, marketSourceLabel) =>
      `${cityName} guide orientation uses the certified city-market route, Local Decision Intelligence framing, Search continuity, Grand Plan decision framing, and Sources & Methodology. ${marketSourceLabel}`,
    marketPeriod: () => 'Durable orientation; not a period-based market or event claim.',
    freshnessState: 'DURABLE_ORIENTATION',
    freshnessLabel: () => 'Durable orientation that still requires current verification before reliance.',
    limitation: (cityName) =>
      `${cityName} orientation does not rank neighborhoods, verify commute or school facts, prove fit, or establish property quality.`,
    verificationPath: (cityName) =>
      `Use the ${cityName} market route, active Search, property evidence, official sources, and professional review before relying on place assumptions.`,
    claimEligibility: 'ELIGIBLE_LIMITED',
  },
  {
    slug: 'reading-market-context',
    label: 'Reading Market Context',
    customerQuestion: 'What does the currently supported market context tell me, what does it not tell me, and how should I understand its freshness?',
    editorialQuestion: 'Which market signal is visible, what is its period and freshness, and which claims are excluded?',
    answer: (cityName) =>
      `${cityName} market context is usable as route-level orientation only. Read the visible signal with its period, freshness, and limitations, then separate market context from property value, suitability, or forecast claims.`,
    evidenceBasis: (_cityName, marketSourceLabel) => marketSourceLabel,
    marketPeriod: (marketPeriod) => marketPeriod,
    freshnessState: 'PERIODIC_MARKET_EVIDENCE',
    freshnessLabel: (marketFreshnessLabel) => marketFreshnessLabel,
    limitation: (cityName) =>
      `${cityName} market context is not a live feed, valuation, future price projection, investment conclusion, ranking, or property-specific recommendation.`,
    verificationPath: (cityName) =>
      `Use the ${cityName} market page, Sources & Methodology, active listings, lender/professional review, and property-specific evidence before reliance.`,
    claimEligibility: 'ELIGIBLE_LIMITED',
  },
  {
    slug: 'place-questions-to-property-verification',
    label: 'Place Questions To Property Verification',
    customerQuestion:
      'How should I connect Market, Search, Property evidence, verification needs, and professional questions without treating place information as a property conclusion?',
    editorialQuestion: 'How should a customer move from place context to property evidence without converting context into a conclusion?',
    answer: (cityName) =>
      `Use ${cityName} place questions to decide what to verify next, not to conclude that a property is good, bad, suitable, or superior. Market, Search, Property evidence, Grand Plan, Sources, and professional review each own a different part of the decision.`,
    evidenceBasis: (cityName, marketSourceLabel) =>
      `${cityName} property-verification orientation uses existing Market, Search, Property, Grand Plan, and Sources continuity without passing hidden customer state. ${marketSourceLabel}`,
    marketPeriod: () => 'Durable decision continuity; property facts require current source review.',
    freshnessState: 'DURABLE_ORIENTATION',
    freshnessLabel: () => 'Durable workflow guidance; current property, financing, HOA, tax, title, inspection, and insurance facts must be verified.',
    limitation: (cityName) =>
      `${cityName} place context does not establish condition, value, title status, financing readiness, HOA details, taxes, insurance, or legal risk for any property.`,
    verificationPath: (cityName) =>
      `Move from ${cityName} Market to Search, then inspect the selected Property evidence and prepare professional questions before relying on assumptions.`,
    claimEligibility: 'ELIGIBLE_LIMITED',
  },
];

function getNeighborhoodCount(cityName: string) {
  return neighborhoods.filter((neighborhood) => neighborhood.city === cityName).length;
}

function getTargetCity(citySlug: CityOrientationGuideTargetCitySlug) {
  return getCityByMarketSlug(citySlug);
}

function buildContinuityLinks(cityName: string, marketRoute: string): CityOrientationGuide['continuityLinks'] {
  const encodedCity = encodeURIComponent(cityName);

  return [
    { label: 'City Market', href: marketRoute, note: 'Read the source market context', destination: 'city-market' },
    { label: 'Search', href: `/search?city=${encodedCity}`, note: 'Review active homes', destination: 'search' },
    { label: 'Property', href: `/search?city=${encodedCity}`, note: 'Open a listing for evidence', destination: 'property' },
    { label: 'Grand Plan', href: '/grand-plan', note: 'Organize decision questions', destination: 'grand-plan' },
    { label: 'Sources', href: '/sources', note: 'Check evidence boundaries', destination: 'sources' },
    { label: 'Advisor', href: '/contact#advisory-readiness', note: 'Prepare professional questions', destination: 'professional-handoff' },
  ];
}

function buildGuide(citySlug: CityOrientationGuideTargetCitySlug, guideSlug: CityOrientationGuideIntentSlug): CityOrientationGuide | null {
  const city = getTargetCity(citySlug);
  const intent = GUIDE_INTENTS.find((item) => item.slug === guideSlug);
  if (!city || !intent) return null;

  const registryEntry = getDecisionGuideRegistryEntry(city);
  if (!registryEntry?.publicEligibility || registryEntry.marketRoute !== `/market/${city.marketSlug}`) return null;

  const neighborhoodCount = getNeighborhoodCount(city.name);
  const marketExperience = buildCityMarketExperience(city, neighborhoodCount);
  const marketAeo = buildMarketAeoContract({ city, marketExperience, neighborhoodCount });
  if (!marketAeo) return null;

  const canonicalPath = buildCityOrientationGuidePath(citySlug, guideSlug);
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;
  const title = `${city.name} ${intent.label} | David Quinn Group`;
  const marketSourceLabel = `${marketAeo.source.label} Market period: ${marketAeo.marketPeriod}. Freshness: ${marketAeo.freshness.label}`;

  return {
    status: CITY_ORIENTATION_GUIDE_STATUS,
    city: {
      name: city.name,
      state: 'Colorado',
      marketSlug: citySlug,
      marketRoute: `/market/${city.marketSlug}`,
    },
    intent: {
      slug: guideSlug,
      label: intent.label,
      customerQuestion: intent.customerQuestion,
      editorialQuestion: intent.editorialQuestion,
    },
    canonicalPath,
    canonicalUrl,
    title,
    description: `${city.name}, Colorado decision guide for ${intent.label.toLowerCase()} with source, freshness, limitation, and verification boundaries.`,
    visibleAnswer: intent.answer(city.name),
    evidenceBasis: intent.evidenceBasis(city.name, marketSourceLabel),
    sourceIdentity: 'David Quinn Group REIE using certified public city-market, Local Decision Intelligence, Grand Plan, Search, Property, and Sources continuity.',
    marketPeriod: intent.marketPeriod(marketAeo.marketPeriod),
    freshness: {
      state: intent.freshnessState,
      label: intent.freshnessLabel(marketAeo.freshness.label),
    },
    limitation: intent.limitation(city.name),
    verificationPath: intent.verificationPath(city.name),
    claimEligibility: intent.claimEligibility,
    structuredDataEligible: true,
    structuredDataType: 'WebPage',
    continuityLinks: buildContinuityLinks(city.name, `/market/${city.marketSlug}`),
    protectedBoundaries: {
      countySourceDependency: false,
      hiddenStateTransfer: false,
      personalization: false,
      ranking: false,
      scoring: false,
      suitabilityConclusion: false,
      investmentConclusion: false,
      protectedClassInference: false,
      providerActivation: false,
    },
  };
}

export function getCityOrientationGuide(citySlug: string, guideSlug: string): CityOrientationGuide | null {
  if (!CITY_ORIENTATION_GUIDE_TARGET_CITY_SLUGS.includes(citySlug as CityOrientationGuideTargetCitySlug)) return null;
  if (!CITY_ORIENTATION_GUIDE_INTENT_SLUGS.includes(guideSlug as CityOrientationGuideIntentSlug)) return null;
  return buildGuide(citySlug as CityOrientationGuideTargetCitySlug, guideSlug as CityOrientationGuideIntentSlug);
}

export function getCityOrientationGuidesForCity(citySlug: string): CityOrientationGuide[] {
  if (!CITY_ORIENTATION_GUIDE_TARGET_CITY_SLUGS.includes(citySlug as CityOrientationGuideTargetCitySlug)) return [];

  return CITY_ORIENTATION_GUIDE_INTENT_SLUGS
    .map((guideSlug) => buildGuide(citySlug as CityOrientationGuideTargetCitySlug, guideSlug))
    .filter((guide): guide is CityOrientationGuide => Boolean(guide));
}

export function getCityOrientationGuideRoutes(): CityOrientationGuide[] {
  return CITY_ORIENTATION_GUIDE_TARGET_CITY_SLUGS.flatMap((citySlug) => getCityOrientationGuidesForCity(citySlug));
}

export function getCityOrientationGuideStaticParams() {
  return getCityOrientationGuideRoutes().map((guide) => ({
    city: guide.city.marketSlug,
    slug: guide.intent.slug,
  }));
}

export function getCityOrientationGuideTargetCities() {
  return cities.filter((city) => CITY_ORIENTATION_GUIDE_TARGET_CITY_SLUGS.includes(city.marketSlug as CityOrientationGuideTargetCitySlug));
}
