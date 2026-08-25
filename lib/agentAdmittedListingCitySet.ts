export const VERSIONED_AGENT_LISTING_CITY_SET_WAVE_9_STATUS =
  'VERSIONED_AGENT_LISTING_CITY_SET_AND_PRIORITY_CITY_EXPANSION_BOUNDED_IMPLEMENTATION_WAVE_9_CERTIFIED' as const;
export const VERSIONED_AGENT_LISTING_CITY_SET_WAVE_9_NEXT_GATE =
  'READY_FOR_HISTORICAL_EVIDENCE_FOUNDATION_ADMISSION_REVIEW' as const;
export const AGENT_ADMITTED_LISTING_CITY_SET_VERSION = 'AGENT_ADMITTED_LISTING_CITY_SET_V1' as const;

export type AgentListingCityState = 'ACTIVE' | 'DEFERRED' | 'BLOCKED';
export type AgentListingCitySemanticType =
  | 'INCORPORATED_MUNICIPALITY'
  | 'CITY_AND_COUNTY'
  | 'LISTING_CITY_LABEL_WITH_CROSS_COUNTY_GEOGRAPHY'
  | 'UNINCORPORATED_COMMUNITY';

export type AgentListingCitySetEntry = Readonly<{
  id: string;
  label: string;
  queryValue: string;
  sourceGeographyId: string | null;
  semanticType: AgentListingCitySemanticType;
  state: AgentListingCityState;
  versionIntroduced: 'CURRENT_SIX_CITY_BASELINE' | 'WAVE_9_PRIORITY_CITY_EXPANSION' | null;
  analyticalGrain: 'MLS_LISTING';
  sourceScope: 'CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION';
  rightsAudience: 'AGENT_ONLY';
  zipCompatible: boolean;
  comparisonCompatible: boolean;
  surfaceAvailability: Readonly<{
    sharedCohortEngine: boolean;
    cohortNComparison: boolean;
    currentCompetingListingContext: boolean;
    propertyPreparation: boolean;
    buyerPreparation: boolean;
    marketPreparation: boolean;
    locationPreparation: boolean;
  }>;
  limitations: readonly string[];
}>;

const standardActiveSurfaces = Object.freeze({
  sharedCohortEngine: true,
  cohortNComparison: true,
  currentCompetingListingContext: true,
  propertyPreparation: true,
  buyerPreparation: true,
  marketPreparation: true,
  locationPreparation: false,
} as const);

const locationActiveSurfaces = Object.freeze({
  ...standardActiveSurfaces,
  locationPreparation: true,
} as const);

const inactiveSurfaces = Object.freeze({
  sharedCohortEngine: false,
  cohortNComparison: false,
  currentCompetingListingContext: false,
  propertyPreparation: false,
  buyerPreparation: false,
  marketPreparation: false,
  locationPreparation: false,
} as const);

function activeCity(input: Readonly<{
  id: string;
  label: string;
  sourceGeographyId: string;
  semanticType?: AgentListingCitySemanticType;
  versionIntroduced: 'CURRENT_SIX_CITY_BASELINE' | 'WAVE_9_PRIORITY_CITY_EXPANSION';
  locationPreparation?: boolean;
}>): AgentListingCitySetEntry {
  return Object.freeze({
    id: input.id,
    label: input.label,
    queryValue: input.label,
    sourceGeographyId: input.sourceGeographyId,
    semanticType: input.semanticType ?? 'INCORPORATED_MUNICIPALITY',
    state: 'ACTIVE',
    versionIntroduced: input.versionIntroduced,
    analyticalGrain: 'MLS_LISTING',
    sourceScope: 'CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION',
    rightsAudience: 'AGENT_ONLY',
    zipCompatible: true,
    comparisonCompatible: true,
    surfaceAvailability: input.locationPreparation ? locationActiveSurfaces : standardActiveSurfaces,
    limitations: Object.freeze([
      'Listing city is an admitted current Property.city label, not a canonical municipal boundary, neighborhood, county, polygon, radius, or source geography object.',
      'Admission is limited to agent-only current MLS listing-record analytical preparation over the repository property search projection.',
    ]),
  });
}

function inactiveCity(input: Readonly<{
  id: string;
  label: string;
  semanticType: AgentListingCitySemanticType;
  state: Exclude<AgentListingCityState, 'ACTIVE'>;
  reason: string;
}>): AgentListingCitySetEntry {
  return Object.freeze({
    id: input.id,
    label: input.label,
    queryValue: input.label,
    sourceGeographyId: null,
    semanticType: input.semanticType,
    state: input.state,
    versionIntroduced: null,
    analyticalGrain: 'MLS_LISTING',
    sourceScope: 'CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION',
    rightsAudience: 'AGENT_ONLY',
    zipCompatible: false,
    comparisonCompatible: false,
    surfaceAvailability: inactiveSurfaces,
    limitations: Object.freeze([input.reason]),
  });
}

export const AGENT_LISTING_CITY_SET_REGISTRY = Object.freeze([
  activeCity({ id: 'boulder', label: 'Boulder', sourceGeographyId: 'boulder-co-housing-market', versionIntroduced: 'CURRENT_SIX_CITY_BASELINE', locationPreparation: true }),
  activeCity({ id: 'louisville', label: 'Louisville', sourceGeographyId: 'louisville-co-housing-market', versionIntroduced: 'CURRENT_SIX_CITY_BASELINE', locationPreparation: true }),
  activeCity({ id: 'lafayette', label: 'Lafayette', sourceGeographyId: 'lafayette-co-housing-market', versionIntroduced: 'CURRENT_SIX_CITY_BASELINE', locationPreparation: true }),
  activeCity({ id: 'superior', label: 'Superior', sourceGeographyId: 'superior-co-housing-market', versionIntroduced: 'CURRENT_SIX_CITY_BASELINE' }),
  activeCity({ id: 'erie', label: 'Erie', sourceGeographyId: 'erie-co-housing-market', semanticType: 'LISTING_CITY_LABEL_WITH_CROSS_COUNTY_GEOGRAPHY', versionIntroduced: 'CURRENT_SIX_CITY_BASELINE' }),
  activeCity({ id: 'longmont', label: 'Longmont', sourceGeographyId: 'longmont-co-housing-market', semanticType: 'LISTING_CITY_LABEL_WITH_CROSS_COUNTY_GEOGRAPHY', versionIntroduced: 'CURRENT_SIX_CITY_BASELINE' }),
  activeCity({ id: 'denver', label: 'Denver', sourceGeographyId: 'denver-co-housing-market', semanticType: 'CITY_AND_COUNTY', versionIntroduced: 'WAVE_9_PRIORITY_CITY_EXPANSION' }),
  activeCity({ id: 'broomfield', label: 'Broomfield', sourceGeographyId: 'broomfield-co-housing-market', semanticType: 'CITY_AND_COUNTY', versionIntroduced: 'WAVE_9_PRIORITY_CITY_EXPANSION' }),
  activeCity({ id: 'westminster', label: 'Westminster', sourceGeographyId: 'westminster-co-housing-market', semanticType: 'LISTING_CITY_LABEL_WITH_CROSS_COUNTY_GEOGRAPHY', versionIntroduced: 'WAVE_9_PRIORITY_CITY_EXPANSION' }),
  activeCity({ id: 'brighton', label: 'Brighton', sourceGeographyId: 'brighton-co-housing-market', semanticType: 'LISTING_CITY_LABEL_WITH_CROSS_COUNTY_GEOGRAPHY', versionIntroduced: 'WAVE_9_PRIORITY_CITY_EXPANSION' }),
  activeCity({ id: 'arvada', label: 'Arvada', sourceGeographyId: 'arvada-co-housing-market', semanticType: 'LISTING_CITY_LABEL_WITH_CROSS_COUNTY_GEOGRAPHY', versionIntroduced: 'WAVE_9_PRIORITY_CITY_EXPANSION' }),
  inactiveCity({ id: 'aurora', label: 'Aurora', semanticType: 'LISTING_CITY_LABEL_WITH_CROSS_COUNTY_GEOGRAPHY', state: 'DEFERRED', reason: 'Aurora has repository evidence but is deferred from Wave 9 priority activation.' }),
  inactiveCity({ id: 'niwot', label: 'Niwot', semanticType: 'UNINCORPORATED_COMMUNITY', state: 'BLOCKED', reason: 'Niwot remains blocked for listing-city admission until place identity and governance are resolved.' }),
] as const satisfies readonly AgentListingCitySetEntry[]);

export const AGENT_ADMITTED_LISTING_CITY_SET = Object.freeze(
  AGENT_LISTING_CITY_SET_REGISTRY.filter((city) => city.state === 'ACTIVE'),
);

export const AGENT_ADMITTED_LISTING_CITY_OPTIONS = Object.freeze(
  AGENT_ADMITTED_LISTING_CITY_SET.map((city) => Object.freeze({
    id: city.id,
    label: city.label,
    sourceGeographyId: city.sourceGeographyId ?? '',
  })),
);

export const AGENT_LOCATION_PREPARATION_CITY_KEYS = Object.freeze(
  AGENT_ADMITTED_LISTING_CITY_SET
    .filter((city) => city.surfaceAvailability.locationPreparation)
    .map((city) => city.id),
);

export type AgentAdmittedListingCityId = (typeof AGENT_ADMITTED_LISTING_CITY_SET)[number]['id'];

export function normalizeAgentListingCityKey(value: unknown) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').toLowerCase() : '';
}

export function getAgentListingCityEntry(value: unknown) {
  const normalized = normalizeAgentListingCityKey(value);
  if (!normalized) return null;
  return AGENT_LISTING_CITY_SET_REGISTRY.find((city) => city.id === normalized || city.label.toLowerCase() === normalized || city.queryValue.toLowerCase() === normalized) ?? null;
}

export function getActiveAgentListingCity(value: unknown) {
  const entry = getAgentListingCityEntry(value);
  return entry?.state === 'ACTIVE' ? entry : null;
}

export function getAgentListingCityLabel(cityId: string | null) {
  return getActiveAgentListingCity(cityId)?.label ?? null;
}

export function classifyAgentListingCity(value: unknown) {
  const normalized = normalizeAgentListingCityKey(value);
  if (!normalized) return Object.freeze({ state: 'MALFORMED' as const, reason: 'CITY_MALFORMED' as const, entry: null });
  const entry = getAgentListingCityEntry(value);
  if (!entry) return Object.freeze({ state: 'UNKNOWN' as const, reason: 'CITY_NOT_ADMITTED' as const, entry: null });
  if (entry.state === 'ACTIVE') return Object.freeze({ state: 'ACTIVE' as const, reason: 'CITY_ACTIVE' as const, entry });
  if (entry.state === 'DEFERRED') return Object.freeze({ state: 'DEFERRED' as const, reason: 'CITY_DEFERRED' as const, entry });
  return Object.freeze({ state: 'BLOCKED' as const, reason: 'CITY_BLOCKED' as const, entry });
}
