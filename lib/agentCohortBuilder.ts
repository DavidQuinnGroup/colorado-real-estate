import type { AtlasCohortDefinition } from './atlasCohortComparativeContract';
import { ATLAS_COHORT_CONTRACT_VERSION, validateAtlasCohortDefinition } from './atlasCohortComparativeContract';
import { legacyClosedInterval, normalizeAgentNumericInterval, type AgentNumericInterval, type AgentNumericIntervalBoundaryKind, type AgentNumericIntervalDimension, type AgentNumericIntervalInput } from './agentNumericInterval';
import { AGENT_ADMITTED_FILTER_REGISTRY, isAgentAdmittedFilterKey, isAgentUnadmittedFilterKey } from './agentAdmittedFilterRegistry';
import { normalizeZipPostalListingFilterSet } from './agentZipPostalListingFilterAdmissionReview';

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
  'zip',
  'propertyType',
  'statusScope',
  'priceMin',
  'priceMax',
  'bedsMin',
  'bedsMax',
  'bedsExact',
  'bathsMin',
  'bathsMax',
  'bathsExact',
  'sqftMin',
  'sqftMax',
  'yearBuiltMin',
  'yearBuiltMax',
  'lotSizeMin',
  'lotSizeMax',
] as const;

export type AgentCohortFilterKey = (typeof AGENT_COHORT_SUPPORTED_FILTER_KEYS)[number];
export type AgentCohortCityId = (typeof AGENT_COHORT_SUPPORTED_CITIES)[number]['id'];
export type AgentCohortPropertyTypeId = (typeof AGENT_COHORT_SUPPORTED_PROPERTY_TYPES)[number]['id'];
export type AgentCohortStatusScopeId = (typeof AGENT_COHORT_SUPPORTED_STATUS_SCOPES)[number]['id'];

export type AgentCohortQuickFilters = Readonly<{
  city: AgentCohortCityId | null;
  zip: readonly string[];
  propertyType: AgentCohortPropertyTypeId | null;
  statusScope: AgentCohortStatusScopeId;
  priceMin: number | null;
  priceMax: number | null;
  bedsMin: number | null;
  bedsMax: number | null;
  bedsExact: number | null;
  bathsMin: number | null;
  bathsMax: number | null;
  bathsExact: number | null;
  sqftMin: number | null;
  sqftMax: number | null;
  yearBuiltMin: number | null;
  yearBuiltMax: number | null;
  lotSizeMin: number | null;
  lotSizeMax: number | null;
}>;

export type AgentCohortInput = Readonly<{
  purpose: string;
  filters: Partial<Record<AgentCohortFilterKey, string | number | readonly string[] | null | undefined>>;
  intervals?: Partial<Record<AgentNumericIntervalDimension, AgentNumericIntervalInput>>;
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
  intervalSemantics: Readonly<Record<AgentNumericIntervalDimension, AgentNumericInterval>>;
  serializedFilters: string;
  serializedCohortIdentity: string;
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
  zip: Object.freeze([]),
  propertyType: null,
  statusScope: 'active',
  priceMin: null,
  priceMax: null,
  bedsMin: null,
  bedsMax: null,
  bedsExact: null,
  bathsMin: null,
  bathsMax: null,
  bathsExact: null,
  sqftMin: null,
  sqftMax: null,
  yearBuiltMin: null,
  yearBuiltMax: null,
  lotSizeMin: null,
  lotSizeMax: null,
});

function text(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeNumber(value: unknown, mode: 'INTEGER' | 'DECIMAL' = 'INTEGER') {
  if (value === null || value === undefined || value === '') return null;
  const parsed = typeof value === 'number' ? value : Number(String(value).replace(/[$,]/g, '').trim());
  if (!Number.isFinite(parsed)) return Number.NaN;
  return mode === 'DECIMAL' ? parsed : Math.floor(parsed);
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

function normalizeZipFilter(value: unknown) {
  if (value === null || value === undefined || value === '') return Object.freeze({ values: Object.freeze([] as string[]), rejected: Object.freeze([] as string[]) });
  const rawValues = Array.isArray(value) ? value : typeof value === 'string' ? value.split(',') : [value];
  const normalized = normalizeZipPostalListingFilterSet(rawValues.map((item) => typeof item === 'string' ? item : item));
  if (normalized.ready && normalized.normalized) {
    return Object.freeze({ values: Object.freeze(normalized.normalized.split(',')), rejected: Object.freeze([] as string[]) });
  }
  return Object.freeze({ values: Object.freeze([] as string[]), rejected: normalized.reasons.length ? normalized.reasons : Object.freeze(['ZIP_MALFORMED']) });
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

const intervalDimensions = ['price', 'sqft', 'yearBuilt', 'beds', 'baths', 'lotSize'] as const satisfies readonly AgentNumericIntervalDimension[];

function explicitIntervalBoundary(input: AgentCohortInput, dimension: AgentNumericIntervalDimension): AgentNumericIntervalBoundaryKind | null {
  const value = input.intervals?.[dimension]?.boundary;
  return value ? value as AgentNumericIntervalBoundaryKind : null;
}

export function parseAgentCohortSearchParams(searchParams: URLSearchParams): AgentCohortInput {
  const filters: Partial<Record<AgentCohortFilterKey, string>> = {};
  for (const key of AGENT_COHORT_SUPPORTED_FILTER_KEYS) {
    const values = searchParams.getAll(key);
    if (values.length > 1 && key === 'zip') {
      filters[key] = values.join(',');
    } else {
      const value = searchParams.get(key);
      if (value !== null) filters[key] = value;
    }
  }
  const unsupportedFilters = new Set(searchParams.getAll('unsupportedFilter'));
  for (const key of searchParams.keys()) {
    if (isAgentUnadmittedFilterKey(key)) unsupportedFilters.add(key);
  }
  return Object.freeze({
    purpose: searchParams.get('purpose') || 'Agent-defined recurring analytical preparation cohort.',
    filters,
    unsupportedFilters: Object.freeze([...unsupportedFilters].sort()),
    intervals: Object.freeze({
      price: Object.freeze({ boundary: searchParams.get('priceInterval') }),
      sqft: Object.freeze({ boundary: searchParams.get('sqftInterval') }),
      yearBuilt: Object.freeze({ boundary: searchParams.get('yearBuiltInterval') }),
      beds: Object.freeze({ boundary: searchParams.get('bedsInterval') }),
      baths: Object.freeze({ boundary: searchParams.get('bathsInterval') }),
      lotSize: Object.freeze({ boundary: searchParams.get('lotSizeInterval') }),
    }),
    analyticalGrain: searchParams.get('analyticalGrain'),
    temporalBasis: searchParams.get('temporalBasis'),
    periodForm: searchParams.get('periodForm'),
    scenarioBoundary: searchParams.get('scenarioBoundary'),
    asOf: searchParams.get('asOf'),
  });
}

export function normalizeAgentCohortDefinition(input: AgentCohortInput): AgentCohortNormalizedDefinition {
  const rejected = new Set<string>(input.unsupportedFilters ?? []);
  for (const key of Object.keys(input.filters)) {
    if (!isAgentAdmittedFilterKey(key)) rejected.add(key);
  }
  if (input.analyticalGrain && input.analyticalGrain !== 'MLS_LISTING') rejected.add('analyticalGrain');
  if (input.temporalBasis && input.temporalBasis !== 'OBSERVATION_AS_OF_TIMESTAMP') rejected.add('temporalBasis');
  if (input.periodForm && input.periodForm !== 'AS_OF_INSTANT_SNAPSHOT') rejected.add('periodForm');
  if (input.scenarioBoundary && input.scenarioBoundary !== 'NOT_SCENARIO') rejected.add('scenarioBoundary');

  const city = cityById(input.filters.city);
  if (text(input.filters.city) && !city) rejected.add('city');
  const zip = normalizeZipFilter(input.filters.zip);
  for (const reason of zip.rejected) rejected.add(`zip:${reason}`);
  if (zip.values.length && !city) rejected.add('zip:ZIP_REQUIRES_ADMITTED_CITY');
  const propertyType = propertyTypeById(input.filters.propertyType);
  if (text(input.filters.propertyType) && !propertyType) rejected.add('propertyType');
  const status = statusById(input.filters.statusScope);
  if (!status) rejected.add('statusScope');

  const numbers = {
    priceMin: normalizeNumber(input.filters.priceMin),
    priceMax: normalizeNumber(input.filters.priceMax),
    bedsMin: normalizeNumber(input.filters.bedsMin),
    bedsMax: normalizeNumber(input.filters.bedsMax),
    bedsExact: normalizeNumber(input.filters.bedsExact),
    bathsMin: normalizeNumber(input.filters.bathsMin, 'DECIMAL'),
    bathsMax: normalizeNumber(input.filters.bathsMax, 'DECIMAL'),
    bathsExact: normalizeNumber(input.filters.bathsExact, 'DECIMAL'),
    sqftMin: normalizeNumber(input.filters.sqftMin),
    sqftMax: normalizeNumber(input.filters.sqftMax),
    yearBuiltMin: normalizeNumber(input.filters.yearBuiltMin),
    yearBuiltMax: normalizeNumber(input.filters.yearBuiltMax),
    lotSizeMin: normalizeNumber(input.filters.lotSizeMin, 'DECIMAL'),
    lotSizeMax: normalizeNumber(input.filters.lotSizeMax, 'DECIMAL'),
  };
  for (const [key, value] of Object.entries(numbers)) {
    if (Number.isNaN(value)) rejected.add(key);
    if (typeof value === 'number' && value < 0) rejected.add(key);
  }
  if (numbers.priceMin !== null && numbers.priceMax !== null && numbers.priceMin > numbers.priceMax) rejected.add('priceRange');
  if (numbers.bedsMin !== null && numbers.bedsMax !== null && numbers.bedsMin > numbers.bedsMax) rejected.add('bedsRange');
  if (numbers.bathsMin !== null && numbers.bathsMax !== null && numbers.bathsMin > numbers.bathsMax) rejected.add('bathsRange');
  if (numbers.sqftMin !== null && numbers.sqftMax !== null && numbers.sqftMin > numbers.sqftMax) rejected.add('sqftRange');
  if (numbers.yearBuiltMin !== null && numbers.yearBuiltMax !== null && numbers.yearBuiltMin > numbers.yearBuiltMax) rejected.add('yearBuiltRange');
  if (numbers.lotSizeMin !== null && numbers.lotSizeMax !== null && numbers.lotSizeMin > numbers.lotSizeMax) rejected.add('lotSizeRange');
  if (numbers.bedsExact !== null && numbers.bedsMin !== null && numbers.bedsExact < numbers.bedsMin) rejected.add('bedsExactOutsideRange');
  if (numbers.bedsExact !== null && numbers.bedsMax !== null && numbers.bedsExact > numbers.bedsMax) rejected.add('bedsExactOutsideRange');
  if (numbers.bathsExact !== null && numbers.bathsMin !== null && numbers.bathsExact < numbers.bathsMin) rejected.add('bathsExactOutsideRange');
  if (numbers.bathsExact !== null && numbers.bathsMax !== null && numbers.bathsExact > numbers.bathsMax) rejected.add('bathsExactOutsideRange');

  const canonicalBedsExact = numbers.bedsExact ?? (numbers.bedsMin !== null && numbers.bedsMax !== null && numbers.bedsMin === numbers.bedsMax ? numbers.bedsMin : null);
  const canonicalBathsExact = numbers.bathsExact ?? (numbers.bathsMin !== null && numbers.bathsMax !== null && numbers.bathsMin === numbers.bathsMax ? numbers.bathsMin : null);

  const filters: AgentCohortQuickFilters = Object.freeze({
    city: city?.id ?? null,
    zip: zip.values,
    propertyType: propertyType?.id ?? null,
    statusScope: status?.id ?? 'active',
    priceMin: Number.isNaN(numbers.priceMin) ? null : numbers.priceMin,
    priceMax: Number.isNaN(numbers.priceMax) ? null : numbers.priceMax,
    bedsMin: canonicalBedsExact !== null ? null : Number.isNaN(numbers.bedsMin) ? null : numbers.bedsMin,
    bedsMax: canonicalBedsExact !== null ? null : Number.isNaN(numbers.bedsMax) ? null : numbers.bedsMax,
    bedsExact: Number.isNaN(canonicalBedsExact) ? null : canonicalBedsExact,
    bathsMin: canonicalBathsExact !== null ? null : Number.isNaN(numbers.bathsMin) ? null : numbers.bathsMin,
    bathsMax: canonicalBathsExact !== null ? null : Number.isNaN(numbers.bathsMax) ? null : numbers.bathsMax,
    bathsExact: Number.isNaN(canonicalBathsExact) ? null : canonicalBathsExact,
    sqftMin: Number.isNaN(numbers.sqftMin) ? null : numbers.sqftMin,
    sqftMax: Number.isNaN(numbers.sqftMax) ? null : numbers.sqftMax,
    yearBuiltMin: Number.isNaN(numbers.yearBuiltMin) ? null : numbers.yearBuiltMin,
    yearBuiltMax: Number.isNaN(numbers.yearBuiltMax) ? null : numbers.yearBuiltMax,
    lotSizeMin: Number.isNaN(numbers.lotSizeMin) ? null : numbers.lotSizeMin,
    lotSizeMax: Number.isNaN(numbers.lotSizeMax) ? null : numbers.lotSizeMax,
  });
  const intervalSemantics = Object.freeze({
    price: explicitIntervalBoundary(input, 'price')
      ? normalizeAgentNumericInterval('price', { min: filters.priceMin, max: filters.priceMax, boundary: explicitIntervalBoundary(input, 'price') })
      : legacyClosedInterval('price', filters.priceMin, filters.priceMax),
    sqft: explicitIntervalBoundary(input, 'sqft')
      ? normalizeAgentNumericInterval('sqft', { min: filters.sqftMin, max: filters.sqftMax, boundary: explicitIntervalBoundary(input, 'sqft') })
      : legacyClosedInterval('sqft', filters.sqftMin, filters.sqftMax),
    yearBuilt: explicitIntervalBoundary(input, 'yearBuilt')
      ? normalizeAgentNumericInterval('yearBuilt', { min: filters.yearBuiltMin, max: filters.yearBuiltMax, boundary: explicitIntervalBoundary(input, 'yearBuilt') })
      : legacyClosedInterval('yearBuilt', filters.yearBuiltMin, filters.yearBuiltMax),
    beds: explicitIntervalBoundary(input, 'beds')
      ? normalizeAgentNumericInterval('beds', { min: filters.bedsExact ?? filters.bedsMin, max: filters.bedsExact ?? filters.bedsMax, boundary: explicitIntervalBoundary(input, 'beds') })
      : legacyClosedInterval('beds', filters.bedsExact ?? filters.bedsMin, filters.bedsExact ?? filters.bedsMax),
    baths: explicitIntervalBoundary(input, 'baths')
      ? normalizeAgentNumericInterval('baths', { min: filters.bathsExact ?? filters.bathsMin, max: filters.bathsExact ?? filters.bathsMax, boundary: explicitIntervalBoundary(input, 'baths') })
      : legacyClosedInterval('baths', filters.bathsExact ?? filters.bathsMin, filters.bathsExact ?? filters.bathsMax),
    lotSize: explicitIntervalBoundary(input, 'lotSize')
      ? normalizeAgentNumericInterval('lotSize', { min: filters.lotSizeMin, max: filters.lotSizeMax, boundary: explicitIntervalBoundary(input, 'lotSize') })
      : legacyClosedInterval('lotSize', filters.lotSizeMin, filters.lotSizeMax),
  } satisfies Record<AgentNumericIntervalDimension, AgentNumericInterval>);
  for (const dimension of intervalDimensions) {
    if (!intervalSemantics[dimension].validation.ready) {
      for (const reason of intervalSemantics[dimension].validation.reasons) rejected.add(`${dimension}Interval:${reason}`);
    }
  }
  const serializedFilters = stableSerialize(filters);
  const hasExplicitIntervals = intervalDimensions.some((dimension) => explicitIntervalBoundary(input, dimension));
  const serializedCohortIdentity = hasExplicitIntervals ? stableSerialize({ filters, intervalSemantics: Object.fromEntries(intervalDimensions.map((dimension) => [dimension, intervalSemantics[dimension].serialized])) }) : serializedFilters;
  const asOf = currentIso(input.asOf);
  const cohort: AtlasCohortDefinition = Object.freeze({
    cohortDefinitionId: `agent-cohort:${AGENT_COHORT_BUILDER_VERSION}:${serializedCohortIdentity}`,
    cohortDefinitionVersion: ATLAS_COHORT_CONTRACT_VERSION,
    cohortType: 'MLS_LISTING_COHORT',
    humanPurpose: text(input.purpose) || 'Agent-defined recurring analytical preparation cohort.',
    analyticalPurpose: 'Count current repository listing records matching explicit registry-admitted Agent filters.',
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
        admittedPopulation: 'Current repository listing records matching explicit registry-admitted filters.',
      }),
      fieldCoverage: Object.freeze({ eligibleCount: null, populatedCount: null, missingNullCount: null }),
      temporalCoverage: Object.freeze({ earliestEvidence: null, latestSourceAsOf: asOf, historicalGaps: Object.freeze([]), restatementLimitations: Object.freeze(['Current projection can change after source synchronization.']) }),
      geographicCoverage: Object.freeze({ definitionVersion: 'AGENT_SUPPORTED_CITY_SCOPE_V1', mappingGaps: Object.freeze([]), unresolvedGeography: Object.freeze(city ? [] : ['CITY_REQUIRED_FOR_WAVE_1_COUNT']) }),
      identityCoverage: Object.freeze({ resolvedIdentities: null, unresolvedIdentities: null, duplicateConflicts: null }),
      provenanceRefs: Object.freeze(['lib/agentAdmittedFilterRegistry.ts', 'lib/agentCohortBuilder.ts', 'lib/agentCohortCount.ts']),
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

  return Object.freeze({ version: AGENT_COHORT_BUILDER_VERSION, filters, intervalSemantics, serializedFilters, serializedCohortIdentity, cohort, validation, rejectedFilters });
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
      'Only explicitly registered Agent filters are admitted.',
      'ZIP filters are listing-level postal-code predicates, require one admitted city, and are not canonical geography, neighborhood, or market-area claims.',
      'Lot acreage filters use the persisted Property.lotSize acres field for filtering only; no lot-size metric is admitted.',
    ]),
  });
}

export function getAgentCohortFilterRegistration(key: AgentCohortFilterKey) {
  return AGENT_ADMITTED_FILTER_REGISTRY[key];
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
