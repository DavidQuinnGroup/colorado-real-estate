import {
  buildReieDecisionIntelligenceCohesionProfile,
  type ReieDecisionCohesionSurface,
} from './reieDecisionIntelligenceCohesion.js';

export const SEARCH_MAP_LOCAL_TRUST_ADVANCEMENT_STATUS = 'SEARCH_MAP_LOCAL_TRUST_ADVANCEMENT_IMPLEMENTED';

export type LocalSourceFreshnessSurface = 'market' | 'city' | 'neighborhood';

export type LocalSourceFreshnessPresentation = {
  status: typeof SEARCH_MAP_LOCAL_TRUST_ADVANCEMENT_STATUS;
  surface: LocalSourceFreshnessSurface;
  title: string;
  source: string;
  observedUpdated: string;
  representation: string;
  limitation: string;
  methodologyHref: '/sources';
  evidenceLanguage: readonly ['SUPPORTED FACT', 'DERIVED / CALCULATED', 'UNAVAILABLE', 'VERIFICATION REQUIRED'];
  protectedBoundaries: {
    sourceRegistryChange: false;
    providerActivation: false;
    countyActivation: false;
    bcodActivation: false;
    prediction: false;
    ranking: false;
    protectedClassInference: false;
    telemetry: false;
    persistence: false;
  };
};

export type SearchMapIntelligencePresentation = {
  status: typeof SEARCH_MAP_LOCAL_TRUST_ADVANCEMENT_STATUS;
  surface: 'search-map';
  title: string;
  source: string;
  observedUpdated: string;
  representation: string;
  limitation: string;
  methodologyHref: '/sources';
  mapListRelationship: string;
  cues: readonly {
    label: string;
    body: string;
  }[];
  continuityPath: readonly ['SEARCH MAP', 'PLACE ORIENTATION', 'LOCAL INTELLIGENCE', 'PROPERTY', 'COMPARE'];
  protectedBoundaries: {
    searchApiChange: false;
    mapBehaviorChange: false;
    ranking: false;
    scoring: false;
    recommendation: false;
    suitabilityInference: false;
    protectedClassInference: false;
    hiddenPersonalization: false;
    persistence: false;
    telemetry: false;
    providerActivation: false;
  };
};

const protectedBoundaries = Object.freeze({
  searchApiChange: false,
  mapBehaviorChange: false,
  ranking: false,
  scoring: false,
  recommendation: false,
  suitabilityInference: false,
  protectedClassInference: false,
  hiddenPersonalization: false,
  persistence: false,
  telemetry: false,
  providerActivation: false,
} satisfies SearchMapIntelligencePresentation['protectedBoundaries']);

const localTrustBoundaries = Object.freeze({
  sourceRegistryChange: false,
  providerActivation: false,
  countyActivation: false,
  bcodActivation: false,
  prediction: false,
  ranking: false,
  protectedClassInference: false,
  telemetry: false,
  persistence: false,
} satisfies LocalSourceFreshnessPresentation['protectedBoundaries']);

function getCohesionSurface(surface: LocalSourceFreshnessSurface): ReieDecisionCohesionSurface {
  if (surface === 'city') return 'city';
  if (surface === 'neighborhood') return 'neighborhood';
  return 'market';
}

export function buildSearchMapIntelligencePresentation(input: {
  visibleListingCount: number;
  mappedListingCount: number;
  selectedPropertyLabel: string | null;
  generatedAt: string | null;
}): SearchMapIntelligencePresentation {
  const cohesionProfile = buildReieDecisionIntelligenceCohesionProfile('search');
  const selectedLabel = input.selectedPropertyLabel || 'No selected property';
  const observedUpdated = input.generatedAt || 'Current visible search response';

  return {
    status: SEARCH_MAP_LOCAL_TRUST_ADVANCEMENT_STATUS,
    surface: 'search-map',
    title: 'Search Map Decision Context',
    source: 'Visible REIE search result set and public listing coordinates available to this view.',
    observedUpdated,
    representation: `${input.mappedListingCount} mapped properties from ${input.visibleListingCount} visible search results.`,
    limitation:
      'The map is place orientation. The list, property pages, source records, inspections, lender review, and professional review carry verification.',
    methodologyHref: cohesionProfile.sourceMethodologyHref,
    mapListRelationship:
      'Map shows where visible listings sit in place context; list compares property facts; selection pins one property for closer review.',
    cues: Object.freeze([
      {
        label: 'Place orientation',
        body: 'Use coordinates, clusters, nearby towns, and the selected marker to decide whether an area deserves a property-level look.',
      },
      {
        label: 'Evidence available now',
        body: `${selectedLabel} can be compared against visible price, property facts, media posture, and any review cues already present in Search.`,
      },
      {
        label: 'Verification required',
        body: 'Condition, records, taxes, insurance, HOA, title, financing, and inspection questions remain outside Search until verified.',
      },
    ]),
    continuityPath: Object.freeze(['SEARCH MAP', 'PLACE ORIENTATION', 'LOCAL INTELLIGENCE', 'PROPERTY', 'COMPARE']),
    protectedBoundaries,
  };
}

export function buildLocalSourceFreshnessPresentation(input: {
  surface: LocalSourceFreshnessSurface;
  title: string;
  source: string;
  observedUpdated: string;
  representation: string;
  limitation: string;
}): LocalSourceFreshnessPresentation {
  const cohesionProfile = buildReieDecisionIntelligenceCohesionProfile(getCohesionSurface(input.surface));

  return {
    status: SEARCH_MAP_LOCAL_TRUST_ADVANCEMENT_STATUS,
    surface: input.surface,
    title: input.title,
    source: input.source,
    observedUpdated: input.observedUpdated,
    representation: input.representation,
    limitation: input.limitation,
    methodologyHref: cohesionProfile.sourceMethodologyHref,
    evidenceLanguage: Object.freeze(['SUPPORTED FACT', 'DERIVED / CALCULATED', 'UNAVAILABLE', 'VERIFICATION REQUIRED']),
    protectedBoundaries: localTrustBoundaries,
  };
}
