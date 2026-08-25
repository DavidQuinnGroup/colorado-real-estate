import {
  AGENT_COHORT_ADMITTED_METRICS,
  AGENT_COHORT_METRIC_IDS,
  aggregateAgentCohort,
  type AgentCohortMetricArtifact,
  type AgentCohortMetricId,
} from './agentCohortAggregation';
import {
  AGENT_COHORT_SUPPORTED_CITIES,
  AGENT_COHORT_SUPPORTED_PROPERTY_TYPES,
  AGENT_COHORT_SUPPORTED_STATUS_SCOPES,
  normalizeAgentCohortDefinition,
  type AgentCohortFilterKey,
  type AgentCohortInput,
  type AgentCohortQuickFilters,
} from './agentCohortBuilder';
import { countAgentCohortListings } from './agentCohortCount';
import { getAgentMetricOperationPolicy, type AgentComparisonOperationPolicy } from './agentCurrentSnapshotComparison';
import type { AtlasAudienceOutput } from './atlasCohortComparativeContract';
import type { AgentPropertyConversationCandidate } from './agent-advisory-workbench/agentPropertyConversationPreparation';

export const CURRENT_COMPETING_LISTING_CONTEXT_WAVE_6_STATUS =
  'CURRENT_COMPETING_LISTING_CONTEXT_BOUNDED_IMPLEMENTATION_WAVE_6_CERTIFIED' as const;
export const CURRENT_COMPETING_LISTING_CONTEXT_VERSION = 'SUBJECT_LISTING_CONTEXT_V1' as const;
export const CURRENT_COMPETING_LISTING_CONTEXT_NEXT_GATE =
  'READY_FOR_ADVANCED_PROPERTY_SEGMENTATION_AND_GEOGRAPHY_ADMISSION_REVIEW' as const;

export type SubjectListingContextRequest = Readonly<{
  subjectGrain?: 'MLS_LISTING' | 'PHYSICAL_PROPERTY' | 'SOURCE_RECORD' | null;
  audience?: AtlasAudienceOutput | null;
  historical?: boolean;
  dom?: boolean;
  soldComparable?: boolean;
  filters?: Partial<Record<AgentCohortFilterKey, string | number | null | undefined>>;
  unsupportedFilters?: readonly string[];
}>;

export type SubjectPositioningStatus =
  | 'ABOVE'
  | 'BELOW'
  | 'SAME'
  | 'SUBJECT_VALUE_UNAVAILABLE'
  | 'COHORT_NO_DATA'
  | 'NOT_ADMITTED'
  | 'COMPARABLE_WITH_LIMITATIONS';

export type SubjectPositioningArtifact = Readonly<{
  field: 'price' | 'sqft' | 'beds' | 'baths' | 'yearBuilt';
  label: string;
  subjectValue: number | null;
  cohortMetricId: AgentCohortMetricId;
  cohortMetricValue: number | null;
  cohortMeanMetricValue: number | null;
  unit: AgentCohortMetricArtifact['unit'];
  operationPolicy: AgentComparisonOperationPolicy;
  absoluteDeltaFromMedian: number | null;
  percentageDeltaFromMedian: number | null;
  direction: SubjectPositioningStatus;
  status: SubjectPositioningStatus;
  coverage: Readonly<{
    eligibleCohortCount: number;
    includedPopulationCount: number;
    nullMissingCount: number;
  }>;
  limitations: readonly string[];
}>;

type SubjectListingContext = NonNullable<CurrentCompetingListingContextResult['subject']>;

export type CurrentCompetingListingContextResult = Readonly<{
  status: 'READY' | 'NOT_AVAILABLE';
  certification: typeof CURRENT_COMPETING_LISTING_CONTEXT_WAVE_6_STATUS;
  contractVersion: typeof CURRENT_COMPETING_LISTING_CONTEXT_VERSION;
  rejectionReasons: readonly string[];
  subject: Readonly<{
    identityType: 'PROPERTY_SLUG';
    repositoryIdentity: string;
    listingReference: string;
    analyticalGrain: 'MLS_LISTING';
    sourceScope: 'CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION';
    observationAsOf: string;
    currentStatus: string;
    fields: Readonly<{
      city: string;
      propertyType: string;
      price: number | null;
      beds: number | null;
      baths: number | null;
      sqft: number | null;
      yearBuilt: number | null;
    }>;
    missingFields: readonly string[];
  }> | null;
  cohort: Readonly<{
    derivation: 'SYSTEM_DERIVED_DEFAULT_COMPETING_COHORT' | 'AGENT_ADJUSTED_COMPETING_COHORT';
    criteria: AgentCohortQuickFilters;
    visibleCriteria: readonly string[];
    validationReasons: readonly string[];
    cohortDefinitionId: string;
    preExclusionCount: number | null;
    postExclusionCount: number | null;
    subjectExclusion: Readonly<{
      state: 'EXCLUDED_BY_LISTING_REFERENCE' | 'EXCLUSION_NOT_DETERMINISTIC' | 'NOT_EVALUATED';
      identityBasis: 'mlsId' | 'none';
      preMinusPost: number | null;
      limitation: string | null;
    }>;
    smallCohortLimitation: string | null;
    metrics: readonly AgentCohortMetricArtifact[];
    asOf: string | null;
  }> | null;
  positioning: readonly SubjectPositioningArtifact[];
  protectedBoundaries: Readonly<{
    agentOnly: true;
    currentSnapshotOnly: true;
    mlsListingGrain: true;
    physicalPropertyBenchmark: false;
    cma: false;
    valuation: false;
    pricingRecommendation: false;
    soldComparable: false;
    historicalAnalytics: false;
    publicClientExport: false;
    providerActivity: false;
    persistence: false;
  }>;
}>;

const medianMetricByField = Object.freeze({
  price: 'agent.cohort.current-asking-list-price-median.v1',
  sqft: 'agent.cohort.listed-square-feet-median.v1',
  beds: 'agent.cohort.bedrooms-median.v1',
  baths: 'agent.cohort.bathrooms-median.v1',
  yearBuilt: 'agent.cohort.year-built-median.v1',
} satisfies Record<SubjectPositioningArtifact['field'], AgentCohortMetricId>);

const meanMetricByField = Object.freeze({
  price: 'agent.cohort.current-asking-list-price-mean.v1',
} satisfies Partial<Record<SubjectPositioningArtifact['field'], AgentCohortMetricId>>);

const fieldLabels = Object.freeze({
  price: 'Current asking/list price',
  sqft: 'Listed square feet',
  beds: 'Bedrooms',
  baths: 'Bathrooms',
  yearBuilt: 'Year built',
} satisfies Record<SubjectPositioningArtifact['field'], string>);

const protectedBoundaries = Object.freeze({
  agentOnly: true,
  currentSnapshotOnly: true,
  mlsListingGrain: true,
  physicalPropertyBenchmark: false,
  cma: false,
  valuation: false,
  pricingRecommendation: false,
  soldComparable: false,
  historicalAnalytics: false,
  publicClientExport: false,
  providerActivity: false,
  persistence: false,
} as const);

function cityIdFor(label: string) {
  return AGENT_COHORT_SUPPORTED_CITIES.find((city) => city.label.toLowerCase() === label.toLowerCase())?.id ?? null;
}

function propertyTypeIdFor(label: string) {
  return AGENT_COHORT_SUPPORTED_PROPERTY_TYPES.find((type) => type.sourceValue.toLowerCase() === label.toLowerCase() || type.id === label.toLowerCase())?.id ?? null;
}

function statusScopeFor(label: string) {
  return AGENT_COHORT_SUPPORTED_STATUS_SCOPES.find((status) => status.sourceValue.toLowerCase() === label.toLowerCase() || status.id === label.toLowerCase())?.id ?? null;
}

function visibleCriteria(filters: AgentCohortQuickFilters) {
  return Object.freeze([
    filters.city && `City: ${AGENT_COHORT_SUPPORTED_CITIES.find((city) => city.id === filters.city)?.label}`,
    filters.propertyType && `Property type: ${AGENT_COHORT_SUPPORTED_PROPERTY_TYPES.find((type) => type.id === filters.propertyType)?.label}`,
    `Status: ${AGENT_COHORT_SUPPORTED_STATUS_SCOPES.find((status) => status.id === filters.statusScope)?.label ?? filters.statusScope}`,
    filters.priceMin !== null && `Minimum current asking/list price: ${filters.priceMin}`,
    filters.priceMax !== null && `Maximum current asking/list price: ${filters.priceMax}`,
    filters.bedsMin !== null && `Minimum bedrooms: ${filters.bedsMin}`,
    filters.bathsMin !== null && `Minimum bathrooms: ${filters.bathsMin}`,
    filters.sqftMin !== null && `Minimum listed square feet: ${filters.sqftMin}`,
    filters.sqftMax !== null && `Maximum listed square feet: ${filters.sqftMax}`,
    filters.yearBuiltMin !== null && `Minimum year built: ${filters.yearBuiltMin}`,
    filters.yearBuiltMax !== null && `Maximum year built: ${filters.yearBuiltMax}`,
  ].filter(Boolean) as string[]);
}

function missingFields(fields: SubjectListingContext['fields']) {
  return Object.freeze(Object.entries(fields).filter(([, value]) => value === null || value === '').map(([key]) => key).sort());
}

export function buildSubjectListingContext(candidate: AgentPropertyConversationCandidate) {
  const subjectFields = Object.freeze({
    city: candidate.property.city ?? '',
    propertyType: candidate.property.propertyType ?? '',
    price: candidate.property.price,
    beds: candidate.property.beds,
    baths: candidate.property.baths,
    sqft: candidate.property.sqft,
    yearBuilt: candidate.property.yearBuilt,
  });
  return Object.freeze({
    identityType: 'PROPERTY_SLUG' as const,
    repositoryIdentity: candidate.property.slug,
    listingReference: candidate.property.mlsId ?? '',
    analyticalGrain: 'MLS_LISTING' as const,
    sourceScope: 'CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION' as const,
    observationAsOf: candidate.sourcePosture.observedAt ?? '',
    currentStatus: candidate.property.status ?? '',
    fields: subjectFields,
    missingFields: missingFields(subjectFields),
  });
}

function baseRejections(request: SubjectListingContextRequest) {
  return Object.freeze([
    request.subjectGrain && request.subjectGrain !== 'MLS_LISTING' && 'SUBJECT_GRAIN_NOT_ADMITTED',
    request.audience && request.audience !== 'AGENT_ONLY' && 'RIGHTS_INCOMPATIBLE',
    request.historical && 'HISTORICAL_CONTEXT_NOT_ADMITTED',
    request.dom && 'DOM_NOT_ADMITTED',
    request.soldComparable && 'SOLD_COMPARABLE_NOT_ADMITTED',
    request.unsupportedFilters?.length && 'UNADMITTED_FILTER',
  ].filter(Boolean) as string[]);
}

export function deriveCompetingCohortInput(candidate: AgentPropertyConversationCandidate, request: SubjectListingContextRequest = Object.freeze({})): Readonly<{
  derivation: 'SYSTEM_DERIVED_DEFAULT_COMPETING_COHORT' | 'AGENT_ADJUSTED_COMPETING_COHORT';
  input: AgentCohortInput;
}> {
  const city = cityIdFor(candidate.property.city ?? '');
  const propertyType = propertyTypeIdFor(candidate.property.propertyType ?? '');
  const statusScope = statusScopeFor(candidate.property.status ?? '') ?? 'active';
  const filters: Partial<Record<AgentCohortFilterKey, string | number | null | undefined>> = {
    city,
    propertyType,
    statusScope,
    ...(request.filters ?? {}),
  };
  const derivation = request.filters && Object.keys(request.filters).length > 0
    ? 'AGENT_ADJUSTED_COMPETING_COHORT'
    : 'SYSTEM_DERIVED_DEFAULT_COMPETING_COHORT';

  return Object.freeze({
    derivation,
    input: Object.freeze({
      purpose: derivation === 'SYSTEM_DERIVED_DEFAULT_COMPETING_COHORT'
        ? 'System-derived current competing listing context for one subject listing.'
        : 'Agent-adjusted current competing listing context for one subject listing.',
      filters,
      unsupportedFilters: request.unsupportedFilters,
      analyticalGrain: request.subjectGrain ?? 'MLS_LISTING',
      temporalBasis: request.historical ? 'HISTORICAL' : 'OBSERVATION_AS_OF_TIMESTAMP',
      periodForm: request.historical ? 'PERIOD_RANGE' : 'AS_OF_INSTANT_SNAPSHOT',
      scenarioBoundary: 'NOT_SCENARIO',
      asOf: candidate.sourcePosture.observedAt,
    }),
  });
}

function direction(subjectValue: number, cohortValue: number): SubjectPositioningStatus {
  if (subjectValue > cohortValue) return 'ABOVE';
  if (subjectValue < cohortValue) return 'BELOW';
  return 'SAME';
}

function positioningFor(field: SubjectPositioningArtifact['field'], subjectValue: number | null, metrics: readonly AgentCohortMetricArtifact[]): SubjectPositioningArtifact {
  const medianMetricId = medianMetricByField[field];
  const meanMetricId: AgentCohortMetricId | null = field === 'price' ? meanMetricByField.price : null;
  const metric = metrics.find((artifact) => artifact.metricId === medianMetricId) ?? null;
  const meanMetric = meanMetricId ? metrics.find((artifact) => artifact.metricId === meanMetricId) ?? null : null;
  const operationPolicy = getAgentMetricOperationPolicy(medianMetricId);
  const cohortValue = metric?.value ?? null;
  const status =
    subjectValue === null
      ? 'SUBJECT_VALUE_UNAVAILABLE'
      : !metric || metric.state !== 'READY' || cohortValue === null
        ? 'COHORT_NO_DATA'
        : direction(subjectValue, cohortValue);
  const absoluteDelta = status === 'ABOVE' || status === 'BELOW' || status === 'SAME' ? subjectValue! - cohortValue! : null;
  const percentageDelta =
    field === 'price' && operationPolicy.PERCENTAGE_DELTA !== 'NOT_ADMITTED' && absoluteDelta !== null && cohortValue
      ? absoluteDelta / cohortValue
      : null;

  return Object.freeze({
    field,
    label: fieldLabels[field],
    subjectValue,
    cohortMetricId: medianMetricId,
    cohortMetricValue: cohortValue,
    cohortMeanMetricValue: meanMetric?.value ?? null,
    unit: metric?.unit ?? AGENT_COHORT_ADMITTED_METRICS[medianMetricId].unit,
    operationPolicy: field === 'yearBuilt' ? Object.freeze({ ...operationPolicy, PERCENTAGE_DELTA: 'NOT_ADMITTED' as const }) : operationPolicy,
    absoluteDeltaFromMedian: absoluteDelta,
    percentageDeltaFromMedian: field === 'price' ? percentageDelta : null,
    direction: status,
    status,
    coverage: Object.freeze({
      eligibleCohortCount: metric?.eligibleCohortCount ?? 0,
      includedPopulationCount: metric?.includedPopulationCount ?? 0,
      nullMissingCount: metric?.nullMissingCount ?? 0,
    }),
    limitations: Object.freeze([
      subjectValue === null && 'Subject value is unavailable and is not coerced to zero.',
      (!metric || metric.state !== 'READY' || cohortValue === null) && 'Cohort metric is unavailable; no positioning delta is calculated.',
      field === 'price' && 'Current asking/list price only; not sale price, market value, or recommended price.',
      field === 'yearBuilt' && 'Percentage delta is not admitted for year built.',
      'Positioning is factual relation to current competing listing cohort median only.',
    ].filter(Boolean) as string[]),
  });
}

export async function buildCurrentCompetingListingContext(
  candidate: AgentPropertyConversationCandidate | null,
  request: SubjectListingContextRequest = Object.freeze({}),
): Promise<CurrentCompetingListingContextResult> {
  const baseReasons = baseRejections(request);
  if (!candidate) return unavailable(['UNKNOWN_SUBJECT']);
  const subject = buildSubjectListingContext(candidate);
  if (!subject.listingReference || !subject.observationAsOf || !subject.fields.city || !subject.fields.propertyType || subject.currentStatus.toLowerCase() !== 'active') {
    return unavailable(['SUBJECT_LISTING_IDENTITY_OR_CURRENT_ACTIVE_STATUS_UNAVAILABLE'], subject);
  }
  if (baseReasons.length) return unavailable(baseReasons, subject);

  const { derivation, input } = deriveCompetingCohortInput(candidate, request);
  const normalized = normalizeAgentCohortDefinition(input);
  if (!normalized.validation.ready) return unavailable(normalized.validation.reasons, subject);

  const preExclusion = await countAgentCohortListings(input);
  const aggregation = await aggregateAgentCohort(input, AGENT_COHORT_METRIC_IDS, { excludeMlsIds: [subject.listingReference] });
  if (aggregation.status !== 'READY') return unavailable(['AGGREGATION_NOT_AVAILABLE'], subject);

  const postCount = aggregation.count.value;
  const preCount = preExclusion.count.value;
  const exclusionCertain = Boolean(subject.listingReference && preCount !== null && postCount !== null);
  const preMinusPost = preCount !== null && postCount !== null ? preCount - postCount : null;
  const subjectExcluded = exclusionCertain && preMinusPost === 1;
  const count = postCount ?? 0;
  const positioning = Object.freeze([
    positioningFor('price', subject.fields.price, aggregation.artifacts),
    positioningFor('sqft', subject.fields.sqft, aggregation.artifacts),
    positioningFor('beds', subject.fields.beds, aggregation.artifacts),
    positioningFor('baths', subject.fields.baths, aggregation.artifacts),
    positioningFor('yearBuilt', subject.fields.yearBuilt, aggregation.artifacts),
  ]);

  return Object.freeze({
    status: 'READY',
    certification: CURRENT_COMPETING_LISTING_CONTEXT_WAVE_6_STATUS,
    contractVersion: CURRENT_COMPETING_LISTING_CONTEXT_VERSION,
    rejectionReasons: Object.freeze([]),
    subject,
    cohort: Object.freeze({
      derivation,
      criteria: aggregation.normalized.filters,
      visibleCriteria: visibleCriteria(aggregation.normalized.filters),
      validationReasons: aggregation.normalized.validation.reasons,
      cohortDefinitionId: aggregation.normalized.cohort.cohortDefinitionId,
      preExclusionCount: preCount,
      postExclusionCount: postCount,
      subjectExclusion: Object.freeze({
        state: subjectExcluded ? 'EXCLUDED_BY_LISTING_REFERENCE' : exclusionCertain ? 'EXCLUSION_NOT_DETERMINISTIC' : 'NOT_EVALUATED',
        identityBasis: subject.listingReference ? 'mlsId' : 'none',
        preMinusPost,
        limitation: subjectExcluded ? null : 'Exact subject exclusion cannot be claimed because the count delta was not exactly one.',
      }),
      smallCohortLimitation: count === 0 ? 'NO_COMPETING_LISTINGS' : count < 3 ? 'SMALL_COHORT_COUNT_VISIBLE_NO_STATISTICAL_CONFIDENCE_CLAIM' : null,
      metrics: aggregation.artifacts,
      asOf: aggregation.count.asOf,
    }),
    positioning,
    protectedBoundaries,
  });
}

function unavailable(rejectionReasons: readonly string[], subject: CurrentCompetingListingContextResult['subject'] = null): CurrentCompetingListingContextResult {
  return Object.freeze({
    status: 'NOT_AVAILABLE',
    certification: CURRENT_COMPETING_LISTING_CONTEXT_WAVE_6_STATUS,
    contractVersion: CURRENT_COMPETING_LISTING_CONTEXT_VERSION,
    rejectionReasons: Object.freeze([...rejectionReasons].sort()),
    subject,
    cohort: null,
    positioning: Object.freeze([]),
    protectedBoundaries,
  });
}
