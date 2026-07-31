export type DecisionGuideMaturity = 'FOUNDATION' | 'ENHANCED_FOUNDATION' | 'EVIDENCE_BACKED' | 'EDITORIALLY_CERTIFIED';

type CityLike = {
  name: string;
};

export type DecisionGuideRegistryEntry = {
  canonicalName: string;
  routeSlug: string;
  state: 'CO';
  searchValue: string;
  marketRoute: string | null;
  neighborhoodAvailability: boolean;
  neighborhoodCount: number;
  listingDataAvailability: boolean;
  marketDataAvailability: boolean;
  knowledgeSourceAvailability: boolean;
  imageryAvailability: boolean;
  guideMaturity: DecisionGuideMaturity;
  publicEligibility: boolean;
  freshness: string;
  optionalEditorialOverride: boolean;
  eligibilityReasons: string[];
  ineligibilityReasons: string[];
};

const REGISTRY_FRESHNESS = '2026-07-29';
const STATE = 'CO' as const;

function publicEntry({
  canonicalName,
  routeSlug,
  marketRoute,
  neighborhoodCount,
  guideMaturity,
  optionalEditorialOverride = false,
}: {
  canonicalName: string;
  routeSlug: string;
  marketRoute: string;
  neighborhoodCount: number;
  guideMaturity: DecisionGuideMaturity;
  optionalEditorialOverride?: boolean;
}): DecisionGuideRegistryEntry {
  return {
    canonicalName,
    routeSlug,
    state: STATE,
    searchValue: canonicalName,
    marketRoute,
    neighborhoodAvailability: neighborhoodCount > 0,
    neighborhoodCount,
    listingDataAvailability: true,
    marketDataAvailability: true,
    knowledgeSourceAvailability: true,
    imageryAvailability: optionalEditorialOverride,
    guideMaturity,
    publicEligibility: true,
    freshness: REGISTRY_FRESHNESS,
    optionalEditorialOverride,
    eligibilityReasons: [
      'canonical-content-city',
      'valid-market-route',
      'search-city-supported',
      'market-data-supported',
      neighborhoodCount > 0 ? 'neighborhood-evidence-supported' : 'foundation-city-market-supported',
      optionalEditorialOverride ? 'editorial-override-supported' : 'standard-foundation-supported',
    ],
    ineligibilityReasons: [],
  };
}

function ineligibleEntry({
  canonicalName,
  routeSlug,
  marketRoute,
  neighborhoodCount = 0,
  guideMaturity = 'FOUNDATION',
  ineligibilityReasons,
}: {
  canonicalName: string;
  routeSlug: string;
  marketRoute: string | null;
  neighborhoodCount?: number;
  guideMaturity?: DecisionGuideMaturity;
  ineligibilityReasons: string[];
}): DecisionGuideRegistryEntry {
  return {
    canonicalName,
    routeSlug,
    state: STATE,
    searchValue: canonicalName,
    marketRoute,
    neighborhoodAvailability: neighborhoodCount > 0,
    neighborhoodCount,
    listingDataAvailability: !ineligibilityReasons.includes('missing-search-city-support'),
    marketDataAvailability: !ineligibilityReasons.includes('missing-market-data'),
    knowledgeSourceAvailability: true,
    imageryAvailability: false,
    guideMaturity,
    publicEligibility: false,
    freshness: REGISTRY_FRESHNESS,
    optionalEditorialOverride: false,
    eligibilityReasons: [
      'canonical-content-city',
      marketRoute ? 'valid-market-route' : null,
      neighborhoodCount > 0 ? 'neighborhood-evidence-supported' : null,
    ].filter((reason): reason is string => Boolean(reason)),
    ineligibilityReasons,
  };
}

export const COLORADO_DECISION_GUIDE_REGISTRY: DecisionGuideRegistryEntry[] = [
  publicEntry({
    canonicalName: 'Boulder',
    routeSlug: 'boulder-co-real-estate',
    marketRoute: '/market/boulder-co-housing-market',
    neighborhoodCount: 8,
    guideMaturity: 'EDITORIALLY_CERTIFIED',
    optionalEditorialOverride: true,
  }),
  publicEntry({
    canonicalName: 'Broomfield',
    routeSlug: 'broomfield-co-real-estate',
    marketRoute: '/market/broomfield-co-housing-market',
    neighborhoodCount: 0,
    guideMaturity: 'ENHANCED_FOUNDATION',
  }),
  ineligibleEntry({
    canonicalName: 'Brighton',
    routeSlug: 'brighton-co-real-estate',
    marketRoute: '/market/brighton-co-housing-market',
    ineligibilityReasons: ['missing-search-city-support'],
  }),
  publicEntry({
    canonicalName: 'Denver',
    routeSlug: 'denver-co-real-estate',
    marketRoute: '/market/denver-co-housing-market',
    neighborhoodCount: 1,
    guideMaturity: 'ENHANCED_FOUNDATION',
  }),
  publicEntry({
    canonicalName: 'Erie',
    routeSlug: 'erie-co-real-estate',
    marketRoute: '/market/erie-co-housing-market',
    neighborhoodCount: 0,
    guideMaturity: 'ENHANCED_FOUNDATION',
  }),
  ineligibleEntry({
    canonicalName: 'Firestone',
    routeSlug: 'firestone-co-real-estate',
    marketRoute: '/market/firestone-co-housing-market',
    ineligibilityReasons: ['missing-search-city-support'],
  }),
  ineligibleEntry({
    canonicalName: 'Frederick',
    routeSlug: 'frederick-co-real-estate',
    marketRoute: '/market/frederick-co-housing-market',
    ineligibilityReasons: ['missing-search-city-support'],
  }),
  ineligibleEntry({
    canonicalName: 'Gunbarrel',
    routeSlug: 'gunbarrel-co-real-estate',
    marketRoute: '/market/gunbarrel-co-housing-market',
    ineligibilityReasons: ['missing-canonical-content-city', 'missing-search-city-support'],
  }),
  publicEntry({
    canonicalName: 'Lafayette',
    routeSlug: 'lafayette-co-real-estate',
    marketRoute: '/market/lafayette-co-housing-market',
    neighborhoodCount: 4,
    guideMaturity: 'EDITORIALLY_CERTIFIED',
    optionalEditorialOverride: true,
  }),
  publicEntry({
    canonicalName: 'Longmont',
    routeSlug: 'longmont-co-real-estate',
    marketRoute: '/market/longmont-co-housing-market',
    neighborhoodCount: 0,
    guideMaturity: 'ENHANCED_FOUNDATION',
  }),
  publicEntry({
    canonicalName: 'Louisville',
    routeSlug: 'louisville-co-real-estate',
    marketRoute: '/market/louisville-co-housing-market',
    neighborhoodCount: 5,
    guideMaturity: 'EDITORIALLY_CERTIFIED',
    optionalEditorialOverride: true,
  }),
  ineligibleEntry({
    canonicalName: 'Niwot',
    routeSlug: 'niwot-co-real-estate',
    marketRoute: '/market/niwot-co-housing-market',
    ineligibilityReasons: ['missing-search-city-support'],
  }),
  publicEntry({
    canonicalName: 'Superior',
    routeSlug: 'superior-co-real-estate',
    marketRoute: '/market/superior-co-housing-market',
    neighborhoodCount: 3,
    guideMaturity: 'ENHANCED_FOUNDATION',
  }),
  ineligibleEntry({
    canonicalName: 'Thornton',
    routeSlug: 'thornton-co-real-estate',
    marketRoute: '/market/thornton-co-housing-market',
    ineligibilityReasons: ['missing-canonical-content-city', 'missing-search-city-support'],
  }),
  publicEntry({
    canonicalName: 'Westminster',
    routeSlug: 'westminster-co-real-estate',
    marketRoute: '/market/westminster-co-housing-market',
    neighborhoodCount: 0,
    guideMaturity: 'ENHANCED_FOUNDATION',
  }),
];

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export function getColoradoDecisionGuideRegistry(): DecisionGuideRegistryEntry[] {
  return [...COLORADO_DECISION_GUIDE_REGISTRY];
}

export function getDecisionGuideRegistryEntry(city: CityLike): DecisionGuideRegistryEntry | null {
  return COLORADO_DECISION_GUIDE_REGISTRY.find((entry) => normalize(entry.canonicalName) === normalize(city.name)) ?? null;
}

export function getPublicDecisionGuideRegistryEntries(): DecisionGuideRegistryEntry[] {
  return COLORADO_DECISION_GUIDE_REGISTRY.filter((entry) => entry.publicEligibility && entry.marketRoute);
}

export function getRepresentativeDecisionGuideCity({
  maturity,
  publicEligibility,
}: {
  maturity: DecisionGuideMaturity;
  publicEligibility?: boolean;
}) {
  return COLORADO_DECISION_GUIDE_REGISTRY.find(
    (entry) =>
      entry.guideMaturity === maturity &&
      (typeof publicEligibility === 'boolean' ? entry.publicEligibility === publicEligibility : true),
  ) ?? null;
}
