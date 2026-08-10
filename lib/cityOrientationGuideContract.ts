export const CITY_ORIENTATION_GUIDE_STATUS = 'FIVE_CITY_LOCAL_ORIENTATION_DECISION_GUIDE_AUTHORITY_WAVE';

export const CITY_ORIENTATION_GUIDE_TARGET_CITY_SLUGS = [
  'boulder-co-housing-market',
  'denver-co-housing-market',
  'louisville-co-housing-market',
  'lafayette-co-housing-market',
  'longmont-co-housing-market',
] as const;

export const CITY_ORIENTATION_GUIDE_INTENT_SLUGS = [
  'orienting-before-search',
  'reading-market-context',
  'place-questions-to-property-verification',
] as const;

export type CityOrientationGuideTargetCitySlug = (typeof CITY_ORIENTATION_GUIDE_TARGET_CITY_SLUGS)[number];
export type CityOrientationGuideIntentSlug = (typeof CITY_ORIENTATION_GUIDE_INTENT_SLUGS)[number];
export type CityOrientationGuideFreshnessState = 'DURABLE_ORIENTATION' | 'PERIODIC_MARKET_EVIDENCE' | 'UNAVAILABLE_OR_CONFLICTED';
export type CityOrientationGuideClaimEligibility = 'ELIGIBLE_LIMITED' | 'EXCLUDED_UNSUPPORTED';

export type CityOrientationGuideContinuityLink = {
  label: string;
  href: string;
  note: string;
  destination: 'city-market' | 'search' | 'property' | 'grand-plan' | 'sources' | 'professional-handoff';
};

export type CityOrientationGuide = {
  status: typeof CITY_ORIENTATION_GUIDE_STATUS;
  city: {
    name: string;
    state: 'Colorado';
    marketSlug: CityOrientationGuideTargetCitySlug;
    marketRoute: string;
  };
  intent: {
    slug: CityOrientationGuideIntentSlug;
    label: string;
    customerQuestion: string;
    editorialQuestion: string;
  };
  canonicalPath: string;
  canonicalUrl: string;
  title: string;
  description: string;
  visibleAnswer: string;
  evidenceBasis: string;
  sourceIdentity: string;
  marketPeriod: string;
  freshness: {
    state: CityOrientationGuideFreshnessState;
    label: string;
  };
  limitation: string;
  verificationPath: string;
  claimEligibility: CityOrientationGuideClaimEligibility;
  structuredDataEligible: boolean;
  structuredDataType: 'WebPage';
  continuityLinks: CityOrientationGuideContinuityLink[];
  protectedBoundaries: {
    countySourceDependency: false;
    hiddenStateTransfer: false;
    personalization: false;
    ranking: false;
    scoring: false;
    suitabilityConclusion: false;
    investmentConclusion: false;
    protectedClassInference: false;
    providerActivation: false;
  };
};

export function isCityOrientationGuideTargetCitySlug(value: string): value is CityOrientationGuideTargetCitySlug {
  return CITY_ORIENTATION_GUIDE_TARGET_CITY_SLUGS.includes(value as CityOrientationGuideTargetCitySlug);
}

export function isCityOrientationGuideIntentSlug(value: string): value is CityOrientationGuideIntentSlug {
  return CITY_ORIENTATION_GUIDE_INTENT_SLUGS.includes(value as CityOrientationGuideIntentSlug);
}

export function buildCityOrientationGuidePath(citySlug: CityOrientationGuideTargetCitySlug, guideSlug: CityOrientationGuideIntentSlug) {
  return `/market/${citySlug}/guides/${guideSlug}`;
}
