import type { AtlasCohortDefinition } from './atlasCohortComparativeContract';
import { ATLAS_COHORT_CONTRACT_VERSION, validateAtlasCohortDefinition } from './atlasCohortComparativeContract';

export const REUSABLE_AGENT_COHORT_BUILDER_WAVE_1_STATUS =
  'REUSABLE_AGENT_COHORT_BUILDER_BOUNDED_IMPLEMENTATION_WAVE_1_CERTIFIED' as const;
export const REUSABLE_AGENT_COHORT_BUILDER_NEXT_GATE = 'READY_FOR_ADMITTED_BASIC_AGGREGATION_WAVE_2' as const;
export const AGENT_COHORT_BUILDER_VERSION = 'AGENT_COHORT_BUILDER_V1' as const;
export const AGENT_COHORT_COUNT_LABEL = 'Matching current MLS listing records' as const;

export const AGENT_COHORT_SUPPORTED_CITIES = [
  { id: 'boulder', label: 'Boulder', sourceGeographyId: 'boulder-co-housing-market' },
  { id: 'louisville', label: 'Louisville', sourceGeographyId: 'louisville-co-housing-market' },
  { id: 'lafayette', label: 'Lafayette', sourceGeographyId: 'lafayette-co-housing-market' },
  { id: 'superior', label: 'Superior', sourceGeographyId: 'superior-co-housing-market' },
  { id: 'erie', label: 'Erie', sourceGeographyId: 'erie-co-housing-market' },
  { id: 'longmont', label: 'Longmont', sourceGeographyId: 'longmont-co-housing-market' },
] as const;

export const AGENT_COHORT_SUPPORTED_PROPERTY_TYPES = [
  { id: 'residential', label: 'Residential', sourceValue: 'Residential' },
] as const;

export const AGENT_COHORT_SUPPORTED_STATUS_SCOPES = [
  { id: 'active', label: 'Active', sourceValue: 'Active' },
] as const;

export const AGENT_COHORT_SUPPORTED_FILTER_KEYS = [
  'city',
  'propertyType',
  'statusScope',
  'priceMin',
  'priceMax',
  'bedsMin',
  'bathsMin',
  'sqftMin',
  'sqftMax',
  'yearBuiltMin',
  'yearBuiltMax',
] as const;

export type AgentCohortFilterKey = (typeof AGENT_COHORT_SUPPORTED_FILTER_KEYS)[number];
export type AgentCohortCityId = (typeof AGENT_COHORT_SUPPORTED_CITIES)[number]['id'];
export type AgentCohortPropertyTypeId = (typeof AGENT_COHORT_SUPPORTED_PROPERTY_TYPES)[number]['id'];
export type AgentCohortStatusScopeId = (typeof AGENT_COHORT_SUPPORTED_STATUS_SCOPES)[number]['id'];

export type AgentCohortQuickFilters = Readonly<{
  city: AgentCohortCityId | null;
  propertyType: AgentCohortPropertyTypeId | null;
  statusScope: AgentCohortStatusScopeId;
  priceMin: number | null;
  priceMax: number | null;
  bedsMin: number | null;
  bathsMin: number | null;
  sqftMin: number | null;
  sqftMax: number | null;
  yearBuiltMin: number | null;
  yearBuiltMax: number | null;
}>;

export type AgentCohortInput = Readonly<{
  purpose: string;
  filters: Partial<Record<AgentCohortFilterKey, string | number | null | undefined>>;
  unsupportedFilters?: readonly string[];
  analyticalGrain?: string | null;
  temporalBasis?: string | null;
  periodForm?: string | null;
  scenarioBoundary?: string | null;
  asOf?: string | null;
}>;

export type AgentCohortNormalizedDefinition = Readonly<{
  version: typeof AGENT_COHORT_BUILDER_VERSION;
  filters: AgentCohortQuickFilters;
  serializedFilters: string;
  cohort: AtlasCohortDefinition;
  validation: ReturnType<typeof validateAtlasCohortDefinition>;
  rejectedFilters: readonly string[];
}>;

export type AgentCohortCountContract = Readonly<{
  label: typeof AGENT_COHORT_COUNT_LABEL;
  value: number | null;
  available: boolean;
  cohortDefinitionId: string;
  analyticalGrain: 'MLS_LISTING';
  temporalBasis: 'OBSERVATION_AS_OF_TIMESTAMP';
  periodForm: 'AS_OF_INSTANT_SNAPSHOT';
  sourceScope: 'CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION';
  asOf: string;
  limitations: readonly string[];
}>;

export const AGENT_COHORT_EMPTY_FILTERS: AgentCohortQuickFilters = Object.freeze({
  city: null,
  propertyType: null,
  statusScope: 'active',
  priceMin: null,
  priceMax: null,
  bedsMin: null,
  bathsMin: null,
  sqftMin: null,
  sqftMax: null,
  yearBuiltMin: null,
  yearBuiltMax: null,
});

function text(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeNumber(value: unknown) {
  if (value === null || value === undefined || value === '') return null;
  const parsed = typeof value === 'number' ? value : Number(String(value).replace(/[$,]/g, '').trim());
  if (!Number.isFinite(parsed)) return Number.NaN;
  return Math.floor(parsed);
}

function cityById(value: unknown) {
  const normalized = text(value).toLowerCase();
  return AGENT_COHORT_SUPPORTED_CITIES.find((city) => city.id === normalized || city.label.toLowerCase() === normalized) ?? null;
}

function propertyTypeById(value: unknown) {
  const normalized = text(value).toLowerCase();
  if (!normalized) return null;
  return AGENT_COHORT_SUPPORTED_PROPERTY_TYPES.find((type) => type.id === normalized || type.sourceValue.toLowerCase() === normalized) ?? null;
}

function statusById(value: unknown) {
  const normalized = text(value).toLowerCase();
  if (!normalized) return AGENT_COHORT_SUPPORTED_STATUS_SCOPES[0];
  return AGENT_COHORT_SUPPORTED_STATUS_SCOPES.find((status) => status.id === normalized || status.sourceValue.toLowerCase() === normalized) ?? null;
}

function stableSerialize(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableSerialize).join(',')}]`;
  if (value && typeof value === 'object') {
    const entries = Object.entries(value).sort(([left], [right]) => left.localeCompare(right));
    return `{${entries.map(([key, entry]) => `${JSON.stringify(key)}:${stableSerialize(entry)}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function currentIso(value: string | null | undefined) {
  if (value && !Number.isNaN(Date.parse(value))) return new Date(value).toISOString();
  return new Date().toISOString();
}

export function parseAgentCohortSearchParams(searchParams: URLSearchParams): AgentCohortInput {
  const filters: Partial<Record<AgentCohortFilterKey, string>> = {};
  for (const key of AGENT_COHORT_SUPPORTED_FILTER_KEYS) {
    const value = searchParams.get(key);
    if (value !== null) filters[key] = value;
  }
  return Object.freeze({
    purpose: searchParams.get('purpose') || 'Agent-defined recurring analytical preparation cohort.',
    filters,
    unsupportedFilters: searchParams.getAll('unsupportedFilter'),
    analyticalGrain: searchParams.get('analyticalGrain'),
    temporalBasis: searchParams.get('temporalBasis'),
    periodForm: searchParams.get('periodForm'),
    scenarioBoundary: searchParams.get('scenarioBoundary'),
    asOf: searchParams.get('asOf'),
  });
}

export function normalizeAgentCohortDefinition(input: AgentCohortInput): AgentCohortNormalizedDefinition {
  const rejected = new Set<string>(input.unsupportedFilters ?? []);
  if (input.analyticalGrain && input.analyticalGrain !== 'MLS_LISTING') rejected.add('analyticalGrain');
  if (input.temporalBasis && input.temporalBasis !== 'OBSERVATION_AS_OF_TIMESTAMP') rejected.add('temporalBasis');
  if (input.periodForm && input.periodForm !== 'AS_OF_INSTANT_SNAPSHOT') rejected.add('periodForm');
  if (input.scenarioBoundary && input.scenarioBoundary !== 'NOT_SCENARIO') rejected.add('scenarioBoundary');

  const city = cityById(input.filters.city);
  if (text(input.filters.city) && !city) rejected.add('city');
  const propertyType = propertyTypeById(input.filters.propertyType);
  if (text(input.filters.propertyType) && !propertyType) rejected.add('propertyType');
  const status = statusById(input.filters.statusScope);
  if (!status) rejected.add('statusScope');

  const numbers = {
    priceMin: normalizeNumber(input.filters.priceMin),
    priceMax: normalizeNumber(input.filters.priceMax),
    bedsMin: normalizeNumber(input.filters.bedsMin),
    bathsMin: normalizeNumber(input.filters.bathsMin),
    sqftMin: normalizeNumber(input.filters.sqftMin),
    sqftMax: normalizeNumber(input.filters.sqftMax),
    yearBuiltMin: normalizeNumber(input.filters.yearBuiltMin),
    yearBuiltMax: normalizeNumber(input.filters.yearBuiltMax),
  };
  for (const [key, value] of Object.entries(numbers)) {
    if (Number.isNaN(value)) rejected.add(key);
    if (typeof value === 'number' && value < 0) rejected.add(key);
  }
  if (numbers.priceMin !== null && numbers.priceMax !== null && numbers.priceMin > numbers.priceMax) rejected.add('priceRange');
  if (numbers.sqftMin !== null && numbers.sqftMax !== null && numbers.sqftMin > numbers.sqftMax) rejected.add('sqftRange');
  if (numbers.yearBuiltMin !== null && numbers.yearBuiltMax !== null && numbers.yearBuiltMin > numbers.yearBuiltMax) rejected.add('yearBuiltRange');

  const filters: AgentCohortQuickFilters = Object.freeze({
    city: city?.id ?? null,
    propertyType: propertyType?.id ?? null,
    statusScope: status?.id ?? 'active',
    priceMin: Number.isNaN(numbers.priceMin) ? null : numbers.priceMin,
    priceMax: Number.isNaN(numbers.priceMax) ? null : numbers.priceMax,
    bedsMin: Number.isNaN(numbers.bedsMin) ? null : numbers.bedsMin,
    bathsMin: Number.isNaN(numbers.bathsMin) ? null : numbers.bathsMin,
    sqftMin: Number.isNaN(numbers.sqftMin) ? null : numbers.sqftMin,
    sqftMax: Number.isNaN(numbers.sqftMax) ? null : numbers.sqftMax,
    yearBuiltMin: Number.isNaN(numbers.yearBuiltMin) ? null : numbers.yearBuiltMin,
    yearBuiltMax: Number.isNaN(numbers.yearBuiltMax) ? null : numbers.yearBuiltMax,
  });
  const serializedFilters = stableSerialize(filters);
  const asOf = currentIso(input.asOf);
  const cohort: AtlasCohortDefinition = Object.freeze({
    cohortDefinitionId: `agent-cohort:${AGENT_COHORT_BUILDER_VERSION}:${serializedFilters}`,
    cohortDefinitionVersion: ATLAS_COHORT_CONTRACT_VERSION,
    cohortType: 'MLS_LISTING_COHORT',
    humanPurpose: text(input.purpose) || 'Agent-defined recurring analytical preparation cohort.',
    analyticalPurpose: 'Count current repository listing records matching explicit Agent quick filters.',
    creatorOrigin: 'AGENT_DEFINED',
    lifecycleStatus: 'ACTIVE_CONTRACT',
    reproducibilityPosture: 'REPRODUCIBLE',
    analyticalGrain: 'MLS_LISTING',
    stockFlowClass: 'STOCK',
    sourceScope: Object.freeze({
      sourceIds: Object.freeze(['CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION']),
      mlsSources: Object.freeze(['MLS_GRID_DERIVED_PROPERTY_PROJECTION']),
      sourceAdmission: 'ADMITTED',
      populationCoverage: 'CERTIFIED',
      sourceAsOf: asOf,
      knownExclusions: Object.freeze(['Historical listing events', 'Transactions and closed-sale facts', 'Provider-native hidden duplicates']),
      limitations: Object.freeze(['Current projection only; not a sales, DOM, CDOM, absorption, or price-change metric.']),
    }),
    identityDuplicatePolicy: Object.freeze({
      canonicalIdentityBasis: 'SOURCE_IDENTITY',
      duplicateResolutionPolicy: 'NONE',
      crossSourceMatchingPolicy: 'NOT_APPLICABLE',
      listingEpisodeTreatment: 'NOT_APPLICABLE',
      relistingTreatment: 'NOT_APPLICABLE',
      confidence: 'CONFIRMED',
      coverage: 'PARTIAL',
    }),
    geography: Object.freeze({
      basis: city ? 'MUNICIPALITY_CITY' : 'UNRESOLVED',
      sourceGeographyId: city?.sourceGeographyId ?? null,
      atlasGeographyId: city?.id ?? null,
      version: 'AGENT_SUPPORTED_CITY_SCOPE_V1',
      provenance: Object.freeze(['Repository-supported Agent market preparation city list']),
      mappingState: city ? 'MAPPED' : 'REQUIRES_RECONCILIATION',
    }),
    period: Object.freeze({
      periodBasis: 'OBSERVATION_AS_OF_TIMESTAMP',
      form: 'AS_OF_INSTANT_SNAPSHOT',
      start: null,
      end: null,
      asOf,
      timezone: 'America/Denver',
      boundarySemantics: 'AS_OF_INSTANT',
      partialPeriodPolicy: 'ALLOW_WITH_LABEL',
      comparisonAlignmentPolicy: 'EXACT_MATCH',
    }),
    fieldAdmissionStates: Object.freeze(['FIELD_EXISTS', 'FIELD_INGESTED', 'FIELD_POPULATED', 'FIELD_SEMANTICS_ADMITTED', 'FIELD_ELIGIBLE_FOR_ANALYTICS'] as const),
    nullMissingPolicy: Object.freeze(['SOURCE_PROVIDES_NULL', 'UNKNOWN', 'EXCLUDED_BY_COHORT_DEFINITION'] as const),
    coverage: Object.freeze({
      sourceCoverage: Object.freeze({
        representedSources: Object.freeze(['CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION']),
        missingSources: Object.freeze([]),
        admittedPopulation: 'Current repository listing records matching explicit quick filters.',
      }),
      fieldCoverage: Object.freeze({ eligibleCount: null, populatedCount: null, missingNullCount: null }),
      temporalCoverage: Object.freeze({ earliestEvidence: null, latestSourceAsOf: asOf, historicalGaps: Object.freeze([]), restatementLimitations: Object.freeze(['Current projection can change after source synchronization.']) }),
      geographicCoverage: Object.freeze({ definitionVersion: 'AGENT_SUPPORTED_CITY_SCOPE_V1', mappingGaps: Object.freeze([]), unresolvedGeography: Object.freeze(city ? [] : ['CITY_REQUIRED_FOR_WAVE_1_COUNT']) }),
      identityCoverage: Object.freeze({ resolvedIdentities: null, unresolvedIdentities: null, duplicateConflicts: null }),
      provenanceRefs: Object.freeze(['lib/agentCohortBuilder.ts', 'lib/agentCohortCount.ts']),
    }),
    scenarioBoundary: 'NOT_SCENARIO',
  });

  const baseValidation = validateAtlasCohortDefinition(cohort);
  const rejectedFilters = Object.freeze([...rejected].sort());
  const validation = Object.freeze({
    ...baseValidation,
    ready: baseValidation.ready && rejectedFilters.length === 0,
    reasons: Object.freeze([...new Set([...baseValidation.reasons, ...rejectedFilters.map((filter) => `FILTER_REJECTED:${filter}`)])].sort()),
  });

  return Object.freeze({ version: AGENT_COHORT_BUILDER_VERSION, filters, serializedFilters, cohort, validation, rejectedFilters });
}

export function buildAgentCohortCountContract(input: Readonly<{
  normalized: AgentCohortNormalizedDefinition;
  count: number | null;
  available: boolean;
  asOf?: string | null;
}>): AgentCohortCountContract {
  const asOf = currentIso(input.asOf ?? input.normalized.cohort.period.asOf);
  return Object.freeze({
    label: AGENT_COHORT_COUNT_LABEL,
    value: input.available ? input.count : null,
    available: input.available,
    cohortDefinitionId: input.normalized.cohort.cohortDefinitionId,
    analyticalGrain: 'MLS_LISTING',
    temporalBasis: 'OBSERVATION_AS_OF_TIMESTAMP',
    periodForm: 'AS_OF_INSTANT_SNAPSHOT',
    sourceScope: 'CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION',
    asOf,
    limitations: Object.freeze([
      'Count is current listing-record stock, not physical properties, listing episodes, sales, recommendations, scenarios, or historical flow.',
      'Null fields are not coerced to zero; records with null values fail the matching predicate for minimum or maximum numeric filters.',
      'Only explicitly supported Wave 1 quick filters are admitted.',
    ]),
  });
}

export function getAgentCohortCityLabel(cityId: AgentCohortCityId | null) {
  return AGENT_COHORT_SUPPORTED_CITIES.find((city) => city.id === cityId)?.label ?? null;
}

export function getAgentCohortPropertyTypeValue(propertyTypeId: AgentCohortPropertyTypeId | null) {
  return AGENT_COHORT_SUPPORTED_PROPERTY_TYPES.find((type) => type.id === propertyTypeId)?.sourceValue ?? null;
}

export function getAgentCohortStatusValue(statusId: AgentCohortStatusScopeId) {
  return AGENT_COHORT_SUPPORTED_STATUS_SCOPES.find((status) => status.id === statusId)?.sourceValue ?? 'Active';
}
