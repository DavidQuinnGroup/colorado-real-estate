import { getCityByName, type CityData } from './cities';
import {
  getColoradoDecisionGuideRegistry,
  getPublicDecisionGuideRegistryEntries,
  type DecisionGuideMaturity,
  type DecisionGuideRegistryEntry,
} from './coloradoDecisionGuideRegistry';
import {
  buildDecisionGuide,
  buildDecisionGuideContinuityLinks,
  type DecisionGuide,
  type DecisionGuideContinuityLink,
} from './decisionGuidePlatform';
import { buildCityMarketExperience } from './marketIntelligenceExperience';
import { neighborhoods } from './neighborhoods';

export const CROSS_CITY_COMPARISON_ROUTE = '/compare';
export const CROSS_CITY_COMPARISON_MIN_SELECTIONS = 2;
export const CROSS_CITY_COMPARISON_MAX_SELECTIONS = 3;
export const CROSS_CITY_COMPARISON_SUPPORTED_MATURITIES: readonly DecisionGuideMaturity[] = [
  'ENHANCED_FOUNDATION',
  'EDITORIALLY_CERTIFIED',
];

export type CrossCityComparisonRejectedSelection = {
  slug: string;
  reason: 'unknown-or-unsupported' | 'duplicate' | 'selection-limit';
};

export type CrossCityComparisonMarket = {
  name: string;
  slug: string;
  maturity: DecisionGuideMaturity;
  maturityLabel: string;
  maturityExplanation: string;
  registryFreshness: string;
  marketRoute: string;
  searchHref: string;
  evidencePosture: string;
  decisionSnapshot: DecisionGuide['decisionSnapshot'];
  dimensions: {
    localCharacter: string;
    housingForm: string;
    marketDrivers: string;
    buyerConsiderations: string;
    sellerConsiderations: string;
    dueDiligence: string;
    nextInvestigation: string;
  };
  continuityLinks: readonly DecisionGuideContinuityLink[];
};

export type CrossCityComparisonDimensionKey = keyof CrossCityComparisonMarket['dimensions'] | 'maturity' | 'evidence';

export type CrossCityComparisonDimension = {
  key: CrossCityComparisonDimensionKey;
  label: string;
  prompt: string;
  values: Array<{
    cityName: string;
    value: string;
  }>;
};

export type CrossCityComparisonSourceTransparencyItem = {
  label: 'Source' | 'Period / Freshness' | 'Limitation' | 'Verify';
  value: string;
  detail: string;
  href?: string;
};

export type CrossCityComparisonWorkspace = {
  eligibleMarkets: CrossCityComparisonMarket[];
  selectedMarkets: CrossCityComparisonMarket[];
  selectedSlugs: string[];
  rejectedSelections: CrossCityComparisonRejectedSelection[];
  canCompare: boolean;
  dimensions: CrossCityComparisonDimension[];
  sourceTransparency: CrossCityComparisonSourceTransparencyItem[];
  queryHref: string;
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function slugify(value: string) {
  return normalize(value).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function getCityNeighborhoods(city: CityData) {
  return neighborhoods
    .filter((neighborhood) => normalize(neighborhood.city) === normalize(city.name))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function firstExplanations(items: Array<{ explanation: string }>, count: number) {
  return items
    .slice(0, count)
    .map((item) => item.explanation)
    .join(' ');
}

function buildComparisonSafeDueDiligence(city: CityData, guide: DecisionGuide) {
  const evidenceStructure =
    guide.maturity === 'EDITORIALLY_CERTIFIED'
      ? 'editorial guide context'
      : 'Enhanced Foundation guide context';

  return `${city.name}: Use the ${evidenceStructure} to identify property records, condition documentation, location-specific tradeoffs, financing assumptions, insurance review, title or HOA documents where applicable, and advisory questions that require deeper verification. Citywide guidance cannot replace neighborhood or property-specific review.`;
}

function getMaturityLabel(maturity: DecisionGuideMaturity) {
  if (maturity === 'ENHANCED_FOUNDATION') return 'Enhanced Foundation';
  if (maturity === 'EDITORIALLY_CERTIFIED') return 'Editorially Certified';
  if (maturity === 'EVIDENCE_BACKED') return 'Evidence Backed';
  return 'Foundation';
}

function getMaturityExplanation(maturity: DecisionGuideMaturity) {
  if (maturity === 'ENHANCED_FOUNDATION') {
    return 'Structured Local Decision Intelligence with durable local context, governed continuity, and explicit evidence limits.';
  }
  if (maturity === 'EDITORIALLY_CERTIFIED') {
    return 'Editorial Decision Guide with reviewed local framing and its own evidence posture. It is shown without relabeling it as Enhanced Foundation.';
  }
  return 'The current maturity does not satisfy the first comparison workspace contract.';
}

function buildComparisonMarket(entry: DecisionGuideRegistryEntry): CrossCityComparisonMarket | null {
  if (!entry.publicEligibility || !entry.marketRoute) return null;
  if (!CROSS_CITY_COMPARISON_SUPPORTED_MATURITIES.includes(entry.guideMaturity)) return null;

  const city = getCityByName(entry.canonicalName);
  if (!city) return null;

  const cityNeighborhoods = getCityNeighborhoods(city);
  const marketExperience = buildCityMarketExperience(city, cityNeighborhoods.length);
  const guide = buildDecisionGuide({
    city,
    cityNeighborhoods,
    marketSignal: marketExperience.directionLabel,
    eligibility: entry,
  });
  if (!guide) return null;

  const searchHref = `/search?city=${encodeURIComponent(city.name)}`;
  const continuityLinks = buildDecisionGuideContinuityLinks({
    guide,
    marketHref: entry.marketRoute,
    searchHref,
  });

  return {
    name: city.name,
    slug: slugify(city.name),
    maturity: guide.maturity,
    maturityLabel: getMaturityLabel(guide.maturity),
    maturityExplanation: getMaturityExplanation(guide.maturity),
    registryFreshness: entry.freshness,
    marketRoute: entry.marketRoute,
    searchHref,
    evidencePosture: firstExplanations(guide.evidenceLimitations, 2),
    decisionSnapshot: guide.decisionSnapshot,
    dimensions: {
      localCharacter: firstExplanations(guide.communityContext, 2),
      housingForm: firstExplanations(guide.housingContext, 2),
      marketDrivers: firstExplanations(guide.marketContext, 2),
      buyerConsiderations: firstExplanations(guide.buyerConsiderations, 2),
      sellerConsiderations: firstExplanations(guide.sellerConsiderations, 2),
      dueDiligence: buildComparisonSafeDueDiligence(city, guide),
      nextInvestigation: guide.decisionSnapshot.bestNextStep,
    },
    continuityLinks,
  };
}

export function getCrossCityComparisonEligibleMarkets(): CrossCityComparisonMarket[] {
  return getPublicDecisionGuideRegistryEntries()
    .map(buildComparisonMarket)
    .filter((market): market is CrossCityComparisonMarket => Boolean(market))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getCrossCityComparisonIneligibleSlugs() {
  return getColoradoDecisionGuideRegistry()
    .filter((entry) => !entry.publicEligibility || !entry.marketRoute || !CROSS_CITY_COMPARISON_SUPPORTED_MATURITIES.includes(entry.guideMaturity))
    .map((entry) => slugify(entry.canonicalName))
    .sort();
}

export function parseCrossCityComparisonSelection(
  rawCities?: string | string[] | null,
): {
  selectedSlugs: string[];
  rejectedSelections: CrossCityComparisonRejectedSelection[];
} {
  const eligibleSlugs = new Set(getCrossCityComparisonEligibleMarkets().map((market) => market.slug));
  const values = Array.isArray(rawCities) ? rawCities : rawCities ? [rawCities] : [];
  const tokens = values
    .flatMap((value) => value.split(','))
    .map(slugify)
    .filter(Boolean);
  const selectedSlugs: string[] = [];
  const rejectedSelections: CrossCityComparisonRejectedSelection[] = [];

  for (const slug of tokens) {
    if (!eligibleSlugs.has(slug)) {
      rejectedSelections.push({ slug, reason: 'unknown-or-unsupported' });
      continue;
    }

    if (selectedSlugs.includes(slug)) {
      rejectedSelections.push({ slug, reason: 'duplicate' });
      continue;
    }

    if (selectedSlugs.length >= CROSS_CITY_COMPARISON_MAX_SELECTIONS) {
      rejectedSelections.push({ slug, reason: 'selection-limit' });
      continue;
    }

    selectedSlugs.push(slug);
  }

  return { selectedSlugs, rejectedSelections };
}

function buildDimensions(selectedMarkets: CrossCityComparisonMarket[]): CrossCityComparisonDimension[] {
  const dimensions: Array<{
    key: CrossCityComparisonDimensionKey;
    label: string;
    prompt: string;
    getValue: (market: CrossCityComparisonMarket) => string;
  }> = [
    {
      key: 'maturity',
      label: 'Maturity and evidence structure',
      prompt: 'Compare what the certified guide type supports before treating city context as equivalent.',
      getValue: (market) => `${market.maturityLabel}: ${market.maturityExplanation}`,
    },
    {
      key: 'localCharacter',
      label: 'Local character',
      prompt: 'Look for durable local patterns that may shape review questions.',
      getValue: (market) => market.dimensions.localCharacter,
    },
    {
      key: 'housingForm',
      label: 'Housing form and condition context',
      prompt: 'Use housing structure as a prompt for records, condition, and property-specific diligence.',
      getValue: (market) => market.dimensions.housingForm,
    },
    {
      key: 'marketDrivers',
      label: 'Market drivers',
      prompt: 'Use market signals as orientation, not as a forecast or property conclusion.',
      getValue: (market) => market.dimensions.marketDrivers,
    },
    {
      key: 'buyerConsiderations',
      label: 'Buyer considerations',
      prompt: 'Compare the investigation topics that should shape search and touring.',
      getValue: (market) => market.dimensions.buyerConsiderations,
    },
    {
      key: 'sellerConsiderations',
      label: 'Seller considerations',
      prompt: 'Compare preparation topics without treating city context as a pricing answer.',
      getValue: (market) => market.dimensions.sellerConsiderations,
    },
    {
      key: 'dueDiligence',
      label: 'What to investigate',
      prompt: 'Turn citywide context into qualified-source and property-specific questions.',
      getValue: (market) => market.dimensions.dueDiligence,
    },
    {
      key: 'evidence',
      label: 'Evidence boundaries',
      prompt: 'Separate certified guide context from property, neighborhood, financing, insurance, and records verification.',
      getValue: (market) => market.evidencePosture,
    },
  ];

  return dimensions.map((dimension) => ({
    key: dimension.key,
    label: dimension.label,
    prompt: dimension.prompt,
    values: selectedMarkets.map((market) => ({
      cityName: market.name,
      value: dimension.getValue(market),
    })),
  }));
}

function formatSelectedRegistryFreshness(selectedMarkets: CrossCityComparisonMarket[]) {
  const uniqueFreshness = Array.from(new Set(selectedMarkets.map((market) => market.registryFreshness)));
  if (uniqueFreshness.length === 1) return `Guide Registry freshness ${uniqueFreshness[0]}`;

  return selectedMarkets.map((market) => `${market.name}: ${market.registryFreshness}`).join('; ');
}

function buildSourceTransparency(selectedMarkets: CrossCityComparisonMarket[]): CrossCityComparisonSourceTransparencyItem[] {
  if (selectedMarkets.length < CROSS_CITY_COMPARISON_MIN_SELECTIONS) return [];

  return [
    {
      label: 'Source',
      value: 'Public eligible Decision Guide context',
      detail: 'This comparison uses the selected public eligible city Decision Guide context only, without internal source IDs or provenance metadata.',
    },
    {
      label: 'Period / Freshness',
      value: formatSelectedRegistryFreshness(selectedMarkets),
      detail: 'Freshness comes from the existing Decision Guide Registry for the selected markets. It is durable guide context, not a live market feed.',
    },
    {
      label: 'Limitation',
      value: 'Citywide context is not a conclusion',
      detail: 'It does not establish property-specific facts, property condition or value, personal fit, a better city, or any ranking.',
    },
    {
      label: 'Verify',
      value: 'Review methodology and investigate specifics',
      detail: 'Use Sources & Methodology, then preserve each selected city guide and search path for specific investigation.',
      href: '/sources',
    },
  ];
}

export function getCrossCityComparisonHref(slugs: readonly string[]) {
  const normalizedSlugs = slugs.map(slugify).filter(Boolean).slice(0, CROSS_CITY_COMPARISON_MAX_SELECTIONS);
  if (!normalizedSlugs.length) return CROSS_CITY_COMPARISON_ROUTE;

  return `${CROSS_CITY_COMPARISON_ROUTE}?cities=${encodeURIComponent(normalizedSlugs.join(','))}`;
}

export function buildCrossCityComparisonWorkspace(rawCities?: string | string[] | null): CrossCityComparisonWorkspace {
  const eligibleMarkets = getCrossCityComparisonEligibleMarkets();
  const { selectedSlugs, rejectedSelections } = parseCrossCityComparisonSelection(rawCities);
  const selectedMarkets = selectedSlugs
    .map((slug) => eligibleMarkets.find((market) => market.slug === slug))
    .filter((market): market is CrossCityComparisonMarket => Boolean(market));

  return {
    eligibleMarkets,
    selectedMarkets,
    selectedSlugs,
    rejectedSelections,
    canCompare: selectedMarkets.length >= CROSS_CITY_COMPARISON_MIN_SELECTIONS,
    dimensions: buildDimensions(selectedMarkets),
    sourceTransparency: buildSourceTransparency(selectedMarkets),
    queryHref: getCrossCityComparisonHref(selectedSlugs),
  };
}
