export const ATLAS_COHORT_COMPARATIVE_CONTRACT_STATUS =
  'ATLAS_COHORT_COMPARATIVE_MARKET_INTELLIGENCE_CONTRACT_MVV_BLOCK_1_FOUNDATION' as const;

export const ATLAS_COHORT_COMPARATIVE_CONTRACT_NEXT_GATE =
  'ATLAS_COHORT_COMPARATIVE_CONTRACT_MVV_BLOCK_1_COMPLETE_READY_FOR_BLOCK_2' as const;

export const ATLAS_COHORT_CONTRACT_VERSION = 'ATLAS_COHORT_CONTRACT_V1_BLOCK_1' as const;

export const ATLAS_ANALYTICAL_GRAINS = [
  'PHYSICAL_PROPERTY',
  'PROVIDER_RECORD',
  'MLS_LISTING',
  'LISTING_EPISODE',
  'TRANSACTION',
  'EVENT',
  'AS_OF_SNAPSHOT_MEMBER',
  'GEOGRAPHY',
  'BENCHMARK_PROPERTY',
  'SUBJECT_PROPERTY',
  'SCENARIO_MODEL_OBSERVATION',
] as const;

export type AtlasAnalyticalGrain = (typeof ATLAS_ANALYTICAL_GRAINS)[number];

export const ATLAS_COHORT_TYPES = [
  'SEARCH_FILTER_COHORT',
  'PHYSICAL_PROPERTY_COHORT',
  'MLS_LISTING_COHORT',
  'LISTING_EPISODE_COHORT',
  'TRANSACTION_COHORT',
  'STOCK_AS_OF_SNAPSHOT_COHORT',
  'STATUS_EVENT_FLOW_COHORT',
  'GEOGRAPHIC_COHORT',
  'PROPERTY_BENCHMARK_COHORT',
  'SUBJECT_PROPERTY_COHORT',
  'SCENARIO_COHORT',
] as const;

export type AtlasCohortType = (typeof ATLAS_COHORT_TYPES)[number];

export const ATLAS_PERIOD_BASES = [
  'LISTING_CONTRACT_DATE',
  'ON_MARKET_DATE',
  'LISTING_DATE',
  'PENDING_DATE',
  'CLOSE_SOLD_DATE',
  'STATUS_CHANGE_DATE',
  'OFF_MARKET_DATE',
  'PRICE_CHANGE_DATE',
  'ADMITTED_EVENT_TIMESTAMP',
  'OBSERVATION_AS_OF_TIMESTAMP',
] as const;

export type AtlasPeriodBasis = (typeof ATLAS_PERIOD_BASES)[number];

export const ATLAS_PERIOD_FORMS = [
  'CUSTOM_BOUNDED_PERIOD',
  'CALENDAR_MONTH',
  'CALENDAR_QUARTER',
  'CALENDAR_YEAR',
  'YTD',
  'TRAILING_N_DAYS',
  'ROLLING_PERIOD',
  'PRIOR_PERIOD',
  'SAME_PERIOD_PRIOR_YEAR',
  'AS_OF_INSTANT_SNAPSHOT',
] as const;

export type AtlasPeriodForm = (typeof ATLAS_PERIOD_FORMS)[number];

export const ATLAS_STOCK_FLOW_CLASSES = ['STOCK', 'FLOW', 'SCENARIO'] as const;
export type AtlasStockFlowClass = (typeof ATLAS_STOCK_FLOW_CLASSES)[number];

export const ATLAS_FIELD_ADMISSION_STATES = [
  'FIELD_EXISTS',
  'FIELD_INGESTED',
  'FIELD_POPULATED',
  'FIELD_SEMANTICS_ADMITTED',
  'FIELD_RIGHTS_ADMITTED',
  'FIELD_ELIGIBLE_FOR_ANALYTICS',
] as const;

export type AtlasFieldAdmissionState = (typeof ATLAS_FIELD_ADMISSION_STATES)[number];

export const ATLAS_NULL_MISSING_STATES = [
  'FIELD_ABSENT_FROM_SOURCE',
  'FIELD_NOT_INGESTED',
  'SOURCE_PROVIDES_NULL',
  'UNKNOWN',
  'NOT_APPLICABLE',
  'UNRESOLVED_CONFLICT',
  'EXCLUDED_BY_COHORT_DEFINITION',
  'EXCLUDED_BY_METHODOLOGY_ADMISSION',
  'EXCLUDED_BY_SOURCE_RIGHTS',
  'EXCLUDED_BY_AUDIENCE_OUTPUT_POLICY',
] as const;

export type AtlasNullMissingState = (typeof ATLAS_NULL_MISSING_STATES)[number];

export const ATLAS_OBSERVATION_ARTIFACT_CLASSES = [
  'CURRENT_PROJECTION',
  'SOURCE_OBSERVATION',
  'HISTORICAL_EVENT',
  'AS_OF_SNAPSHOT',
  'DERIVED_METRIC_ARTIFACT',
] as const;

export type AtlasObservationArtifactClass = (typeof ATLAS_OBSERVATION_ARTIFACT_CLASSES)[number];

export type AtlasSourceScope = Readonly<{
  sourceIds: readonly string[];
  mlsSources: readonly string[];
  sourceAdmission: 'ADMITTED' | 'PARTIALLY_ADMITTED' | 'NOT_ADMITTED' | 'REQUIRES_EVIDENCE';
  populationCoverage: 'CERTIFIED' | 'PARTIAL' | 'UNKNOWN';
  sourceAsOf: string | null;
  knownExclusions: readonly string[];
  limitations: readonly string[];
}>;

export type AtlasIdentityDuplicatePolicy = Readonly<{
  canonicalIdentityBasis: 'ATLAS_CANONICAL_PROPERTY' | 'SOURCE_IDENTITY' | 'LISTING_EPISODE' | 'TRANSACTION' | 'UNRESOLVED';
  duplicateResolutionPolicy: 'NONE' | 'SOURCE_NATIVE_HIDDEN' | 'ATLAS_CANONICAL_IDENTITY' | 'SOURCE_LISTING_EVENT' | 'UNRESOLVED';
  crossSourceMatchingPolicy: 'NOT_APPLICABLE' | 'REQUIRES_ADMISSION' | 'ADMITTED_VERSIONED_POLICY';
  listingEpisodeTreatment: 'NOT_APPLICABLE' | 'REQUIRED' | 'ADMITTED_VERSIONED_POLICY' | 'UNRESOLVED';
  relistingTreatment: 'NOT_APPLICABLE' | 'REQUIRES_METHODOLOGY' | 'ADMITTED_VERSIONED_POLICY';
  confidence: 'CONFIRMED' | 'PROBABLE' | 'POSSIBLE' | 'UNVERIFIED' | 'CONFLICTING';
  coverage: 'COMPLETE' | 'PARTIAL' | 'UNKNOWN';
}>;

export type AtlasGeographyScope = Readonly<{
  basis:
    | 'ATLAS_CANONICAL_GEOGRAPHY'
    | 'MUNICIPALITY_CITY'
    | 'COUNTY'
    | 'ZIP'
    | 'SUBDIVISION'
    | 'NEIGHBORHOOD'
    | 'MLS_AREA_SUBAREA'
    | 'SOURCE_SPECIFIC_GEOGRAPHY'
    | 'POLYGON_MAP_DEFINED'
    | 'SUBJECT_PROPERTY_MICRO_MARKET'
    | 'ADDRESS_DEFINED_CONTEXT'
    | 'UNRESOLVED';
  sourceGeographyId: string | null;
  atlasGeographyId: string | null;
  version: string | null;
  provenance: readonly string[];
  mappingState: 'MAPPED' | 'NOT_MAPPED' | 'REQUIRES_RECONCILIATION' | 'CONFLICTING';
}>;

export type AtlasPeriodContract = Readonly<{
  periodBasis: AtlasPeriodBasis | null;
  form: AtlasPeriodForm;
  start: string | null;
  end: string | null;
  asOf: string | null;
  timezone: string | null;
  boundarySemantics: 'INCLUSIVE_START_EXCLUSIVE_END' | 'INCLUSIVE_BOTH' | 'AS_OF_INSTANT' | 'REQUIRES_POLICY';
  partialPeriodPolicy: 'ALLOW_WITH_LABEL' | 'REJECT' | 'REQUIRES_POLICY';
  comparisonAlignmentPolicy: 'EXACT_MATCH' | 'CALENDAR_ALIGNED' | 'TOLERANCE_REQUIRED' | 'NOT_COMPARABLE_YET';
}>;

export type AtlasCoverageProvenanceContract = Readonly<{
  sourceCoverage: Readonly<{ representedSources: readonly string[]; missingSources: readonly string[]; admittedPopulation: string | null }>;
  fieldCoverage: Readonly<{ eligibleCount: number | null; populatedCount: number | null; missingNullCount: number | null }>;
  temporalCoverage: Readonly<{ earliestEvidence: string | null; latestSourceAsOf: string | null; historicalGaps: readonly string[]; restatementLimitations: readonly string[] }>;
  geographicCoverage: Readonly<{ definitionVersion: string | null; mappingGaps: readonly string[]; unresolvedGeography: readonly string[] }>;
  identityCoverage: Readonly<{ resolvedIdentities: number | null; unresolvedIdentities: number | null; duplicateConflicts: number | null }>;
  provenanceRefs: readonly string[];
}>;

export type AtlasCohortDefinition = Readonly<{
  cohortDefinitionId: string;
  cohortDefinitionVersion: string;
  cohortType: AtlasCohortType;
  humanPurpose: string;
  analyticalPurpose: string;
  creatorOrigin: 'EXECUTIVE_SUPPLIED' | 'AGENT_DEFINED' | 'SYSTEM_CONTRACT' | 'REPOSITORY_FIXTURE';
  lifecycleStatus: 'DRAFT' | 'CERTIFIED_ARCHITECTURE' | 'ACTIVE_CONTRACT' | 'DEPRECATED';
  reproducibilityPosture: 'REPRODUCIBLE' | 'PARTIALLY_REPRODUCIBLE' | 'NOT_REPRODUCIBLE';
  analyticalGrain: AtlasAnalyticalGrain;
  stockFlowClass: AtlasStockFlowClass;
  sourceScope: AtlasSourceScope;
  identityDuplicatePolicy: AtlasIdentityDuplicatePolicy;
  geography: AtlasGeographyScope;
  period: AtlasPeriodContract;
  fieldAdmissionStates: readonly AtlasFieldAdmissionState[];
  nullMissingPolicy: readonly AtlasNullMissingState[];
  coverage: AtlasCoverageProvenanceContract;
  scenarioBoundary: 'NOT_SCENARIO' | 'MODELED_DATA_NEVER_OBSERVED_MARKET_EVIDENCE';
}>;

export type AtlasCohortValidationResult = Readonly<{
  ready: boolean;
  reasons: readonly string[];
  nextGate: typeof ATLAS_COHORT_COMPARATIVE_CONTRACT_NEXT_GATE;
  protectedBoundaries: typeof ATLAS_COHORT_COMPARATIVE_PROTECTED_BOUNDARIES;
}>;

export const COHORT_TYPE_ALLOWED_GRAINS: Readonly<Record<AtlasCohortType, readonly AtlasAnalyticalGrain[]>> = Object.freeze({
  SEARCH_FILTER_COHORT: ['MLS_LISTING', 'PHYSICAL_PROPERTY'] as const,
  PHYSICAL_PROPERTY_COHORT: ['PHYSICAL_PROPERTY'] as const,
  MLS_LISTING_COHORT: ['MLS_LISTING'] as const,
  LISTING_EPISODE_COHORT: ['LISTING_EPISODE'] as const,
  TRANSACTION_COHORT: ['TRANSACTION'] as const,
  STOCK_AS_OF_SNAPSHOT_COHORT: ['AS_OF_SNAPSHOT_MEMBER'] as const,
  STATUS_EVENT_FLOW_COHORT: ['EVENT'] as const,
  GEOGRAPHIC_COHORT: ['GEOGRAPHY'] as const,
  PROPERTY_BENCHMARK_COHORT: ['BENCHMARK_PROPERTY'] as const,
  SUBJECT_PROPERTY_COHORT: ['SUBJECT_PROPERTY', 'BENCHMARK_PROPERTY'] as const,
  SCENARIO_COHORT: ['SCENARIO_MODEL_OBSERVATION'] as const,
});

export const ATLAS_OBSERVATION_ARTIFACT_REQUIREMENTS: Readonly<Record<AtlasObservationArtifactClass, readonly string[]>> = Object.freeze({
  CURRENT_PROJECTION: Object.freeze([
    'PRESENT_STATE_USE_ONLY',
    'NOT_HISTORICAL_EVIDENCE_BY_DEFAULT',
    'SOURCE_AS_OF_REQUIRED_FOR_ANALYTICS',
  ]),
  SOURCE_OBSERVATION: Object.freeze([
    'SOURCE_IDENTITY_REQUIRED',
    'SOURCE_AS_OF_REQUIRED',
    'RIGHTS_AND_PROVENANCE_REQUIRED',
  ]),
  HISTORICAL_EVENT: Object.freeze([
    'ADMITTED_EVENT_TIME_REQUIRED',
    'EVENT_TYPE_METHODOLOGY_REQUIRED',
    'ORDERING_AND_RESTATEMENT_POLICY_REQUIRED',
  ]),
  AS_OF_SNAPSHOT: Object.freeze([
    'AS_OF_SEMANTICS_REQUIRED',
    'SOURCE_REVISION_REQUIRED',
    'HISTORICAL_RECONSTRUCTION_POLICY_REQUIRED',
  ]),
  DERIVED_METRIC_ARTIFACT: Object.freeze([
    'COHORT_DEFINITION_VERSION_REQUIRED',
    'METRIC_DEFINITION_VERSION_REQUIRED',
    'CALCULATION_VERSION_REQUIRED',
    'LIMITATIONS_REQUIRED',
  ]),
});

export const ATLAS_COHORT_COMPARATIVE_PROTECTED_BOUNDARIES = Object.freeze({
  runtimeAnalyticalEngineImplemented: false,
  providerActivity: false,
  mlsGridOrIresCall: false,
  databaseRead: false,
  databaseWrite: false,
  schemaMigration: false,
  sourceActivation: false,
  typesenseMutation: false,
  crmEmailMutation: false,
  publicClientPublication: false,
  deployment: false,
  scenarioPresentedAsObservedEvidence: false,
});

function hasValue(value: string | null | undefined) {
  return Boolean(value && value.trim());
}

function invalidDate(value: string | null) {
  return Boolean(value && Number.isNaN(Date.parse(value)));
}

export function validateAtlasPeriodContract(period: AtlasPeriodContract): readonly string[] {
  const reasons = [
    !period.periodBasis && 'PERIOD_BASIS_REQUIRED',
    !period.timezone && 'TIMEZONE_REQUIRED',
    invalidDate(period.start) && 'VALID_PERIOD_START_REQUIRED',
    invalidDate(period.end) && 'VALID_PERIOD_END_REQUIRED',
    invalidDate(period.asOf) && 'VALID_AS_OF_REQUIRED',
    period.form === 'AS_OF_INSTANT_SNAPSHOT' && !period.asOf && 'AS_OF_REQUIRED_FOR_STOCK_SNAPSHOT',
    period.form !== 'AS_OF_INSTANT_SNAPSHOT' && !period.start && 'START_REQUIRED_FOR_PERIOD_FORM',
    period.form !== 'AS_OF_INSTANT_SNAPSHOT' && !period.end && 'END_REQUIRED_FOR_PERIOD_FORM',
    period.comparisonAlignmentPolicy === 'NOT_COMPARABLE_YET' && 'COMPARISON_ALIGNMENT_POLICY_REQUIRED',
  ].filter(Boolean) as string[];
  return Object.freeze([...new Set(reasons)].sort());
}

export function validateAtlasCohortDefinition(cohort: AtlasCohortDefinition): AtlasCohortValidationResult {
  const allowedGrains = COHORT_TYPE_ALLOWED_GRAINS[cohort.cohortType];
  const reasons = [
    !hasValue(cohort.cohortDefinitionId) && 'COHORT_DEFINITION_ID_REQUIRED',
    cohort.cohortDefinitionVersion !== ATLAS_COHORT_CONTRACT_VERSION && 'COHORT_VERSION_MISMATCH',
    !hasValue(cohort.humanPurpose) && 'HUMAN_PURPOSE_REQUIRED',
    !hasValue(cohort.analyticalPurpose) && 'ANALYTICAL_PURPOSE_REQUIRED',
    !allowedGrains.includes(cohort.analyticalGrain) && 'COHORT_TYPE_GRAIN_MISMATCH',
    cohort.stockFlowClass === 'STOCK' && cohort.period.form !== 'AS_OF_INSTANT_SNAPSHOT' && 'STOCK_REQUIRES_AS_OF_PERIOD',
    cohort.stockFlowClass === 'FLOW' && cohort.period.form === 'AS_OF_INSTANT_SNAPSHOT' && 'FLOW_REQUIRES_PERIOD_RANGE',
    cohort.cohortType === 'SCENARIO_COHORT' && cohort.scenarioBoundary !== 'MODELED_DATA_NEVER_OBSERVED_MARKET_EVIDENCE' && 'SCENARIO_OBSERVED_EVIDENCE_FIREWALL_REQUIRED',
    cohort.cohortType !== 'SCENARIO_COHORT' && cohort.scenarioBoundary !== 'NOT_SCENARIO' && 'NON_SCENARIO_BOUNDARY_MISMATCH',
    cohort.sourceScope.sourceAdmission !== 'ADMITTED' && 'SOURCE_ADMISSION_REQUIRED',
    cohort.sourceScope.populationCoverage !== 'CERTIFIED' && 'SOURCE_POPULATION_COVERAGE_REQUIRED',
    cohort.identityDuplicatePolicy.duplicateResolutionPolicy === 'SOURCE_NATIVE_HIDDEN' && 'SOURCE_NATIVE_DUPLICATES_NOT_ATLAS_IDENTITY',
    cohort.identityDuplicatePolicy.confidence !== 'CONFIRMED' && 'IDENTITY_CONFIDENCE_REQUIRED',
    cohort.geography.mappingState !== 'MAPPED' && 'GEOGRAPHY_RECONCILIATION_REQUIRED',
    cohort.fieldAdmissionStates.length > 0 && !cohort.fieldAdmissionStates.includes('FIELD_ELIGIBLE_FOR_ANALYTICS') && 'FIELD_ANALYTICS_ELIGIBILITY_REQUIRED',
    !cohort.nullMissingPolicy.length && 'NULL_MISSING_POLICY_REQUIRED',
    !cohort.coverage.provenanceRefs.length && 'PROVENANCE_REQUIRED',
    ...validateAtlasPeriodContract(cohort.period),
  ].filter(Boolean) as string[];
  return Object.freeze({
    ready: reasons.length === 0,
    reasons: Object.freeze([...new Set(reasons)].sort()),
    nextGate: ATLAS_COHORT_COMPARATIVE_CONTRACT_NEXT_GATE,
    protectedBoundaries: ATLAS_COHORT_COMPARATIVE_PROTECTED_BOUNDARIES,
  });
}

export function classifyStockFlowCompatibility(input: Readonly<{
  requestedClass: AtlasStockFlowClass;
  periodForm: AtlasPeriodForm;
  artifactClass: AtlasObservationArtifactClass;
}>): Readonly<{ compatible: boolean; reasons: readonly string[] }> {
  const reasons = [
    input.requestedClass === 'STOCK' && input.periodForm !== 'AS_OF_INSTANT_SNAPSHOT' && 'STOCK_REQUIRES_AS_OF_INSTANT',
    input.requestedClass === 'FLOW' && input.periodForm === 'AS_OF_INSTANT_SNAPSHOT' && 'FLOW_REQUIRES_EVENT_PERIOD',
    input.requestedClass !== 'SCENARIO' && input.artifactClass === 'CURRENT_PROJECTION' && 'CURRENT_PROJECTION_NOT_HISTORICAL_EVIDENCE',
    input.requestedClass === 'SCENARIO' && input.artifactClass !== 'DERIVED_METRIC_ARTIFACT' && 'SCENARIO_REQUIRES_MODELED_ARTIFACT_BOUNDARY',
  ].filter(Boolean) as string[];
  return Object.freeze({ compatible: reasons.length === 0, reasons: Object.freeze(reasons.sort()) });
}
