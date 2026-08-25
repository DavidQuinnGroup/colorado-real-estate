export const ATLAS_COHORT_COMPARATIVE_CONTRACT_STATUS =
  'ATLAS_COHORT_AND_COMPARATIVE_MARKET_INTELLIGENCE_CONTRACT_MVV_CERTIFIED' as const;

export const ATLAS_COHORT_COMPARATIVE_CONTRACT_NEXT_GATE =
  'ATLAS_COHORT_AND_COMPARATIVE_MARKET_INTELLIGENCE_CONTRACT_MVV_CERTIFIED' as const;

export const ATLAS_COHORT_CONTRACT_VERSION = 'ATLAS_COHORT_CONTRACT_V1_BLOCK_1' as const;
export const ATLAS_COMPARABILITY_CONTRACT_VERSION = 'ATLAS_COMPARABILITY_CONTRACT_V1_BLOCK_2' as const;
export const ATLAS_METRIC_ARTIFACT_CONTRACT_VERSION = 'ATLAS_METRIC_ARTIFACT_CONTRACT_V1_BLOCK_2' as const;
export const ATLAS_COMPARATIVE_RESULT_CONTRACT_VERSION = 'ATLAS_COMPARATIVE_RESULT_CONTRACT_V1_BLOCK_2' as const;

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

export const ATLAS_AUDIENCE_OUTPUTS = [
  'AGENT_ONLY',
  'CLIENT_PROFESSIONAL_REPORT',
  'PUBLIC_DISPLAY',
  'EXPORT',
  'INTERNAL_ARCHITECTURE',
] as const;

export type AtlasAudienceOutput = (typeof ATLAS_AUDIENCE_OUTPUTS)[number];

export const ATLAS_COMPARABILITY_STATES = [
  'COMPARABLE',
  'COMPARABLE_WITH_LIMITATIONS',
  'NOT_COMPARABLE',
  'EVIDENCE_INSUFFICIENT',
  'RIGHTS_BLOCKED',
] as const;

export type AtlasComparabilityState = (typeof ATLAS_COMPARABILITY_STATES)[number];

export const ATLAS_COMPARABILITY_REASON_CODES = [
  'METRIC_MISMATCH',
  'GRAIN_MISMATCH',
  'SOURCE_POPULATION_MISMATCH',
  'IDENTITY_POLICY_MISMATCH',
  'GEOGRAPHY_MISMATCH',
  'EVENT_BASIS_MISMATCH',
  'STOCK_FLOW_MISMATCH',
  'HISTORICAL_COVERAGE_INSUFFICIENT',
  'FIELD_COVERAGE_INSUFFICIENT',
  'CALCULATION_VERSION_MISMATCH',
  'RIGHTS_INCOMPATIBLE',
  'UNKNOWN_METHODOLOGY',
  'UNKNOWN_COMPARABILITY',
  'UNKNOWN_ATTRIBUTION_REQUIREMENT',
  'UNKNOWN_RETENTION_EXPORT_PERMISSION',
  'UNRESOLVED_SOURCE_CONFLICT',
  'UNRESOLVED_IDENTITY_CONFLICT',
  'UNRESOLVED_GEOGRAPHY_CONFLICT',
  'UNRESOLVED_NULL_MISSING_DATA_MATERIALITY',
  'SCENARIO_OBSERVED_EVIDENCE_AMBIGUITY',
] as const;

export type AtlasComparabilityReasonCode = (typeof ATLAS_COMPARABILITY_REASON_CODES)[number];

export const ATLAS_ADMISSION_GATES = [
  'SOURCE_ADMISSION',
  'FIELD_ADMISSION',
  'METRIC_METHODOLOGY_ADMISSION',
  'IDENTITY_DUPLICATION_ADMISSION',
  'GEOGRAPHY_ADMISSION',
  'TEMPORAL_HISTORY_ADMISSION',
  'COMPARABILITY_ADMISSION',
  'RIGHTS_AUDIENCE_ADMISSION',
  'PRESENTATION_INTERPRETATION_ADMISSION',
] as const;

export type AtlasAdmissionGate = (typeof ATLAS_ADMISSION_GATES)[number];

export const ATLAS_READINESS_STATES = [
  'READY_NOW_FOR_BOUNDED_IMPLEMENTATION',
  'READY_AFTER_REPOSITORY_LOCAL_FOUNDATION',
  'BLOCKED_BY_SOURCE_DATA',
  'BLOCKED_BY_HISTORICAL_DATA',
  'BLOCKED_BY_METHODOLOGY',
  'BLOCKED_BY_IDENTITY_DEDUPLICATION',
  'BLOCKED_BY_GEOGRAPHY',
  'BLOCKED_BY_RIGHTS',
  'BLOCKED_BY_EXECUTIVE_DECISION',
] as const;

export type AtlasReadinessState = (typeof ATLAS_READINESS_STATES)[number];

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

export type AtlasMetricArtifact = Readonly<{
  metricArtifactId: string;
  metricDefinitionId: string;
  metricDefinitionVersion: string | null;
  metricFamily: string;
  cohortDefinitionId: string;
  cohortDefinitionVersion: string;
  analyticalGrain: AtlasAnalyticalGrain;
  period: AtlasPeriodContract;
  observationAsOf: string | null;
  sourceAsOf: string | null;
  calculationVersion: string | null;
  value: number | null;
  unit: string;
  aggregation: string;
  eligiblePopulationCount: number | null;
  includedPopulationCount: number | null;
  excludedPopulationCount: number | null;
  nullPopulationCount: number | null;
  unknownPopulationCount: number | null;
  coverage: AtlasCoverageProvenanceContract;
  sourceProvenance: readonly string[];
  geographyProvenance: readonly string[];
  identityPolicyVersion: string | null;
  methodologyEvidence: readonly string[];
  limitations: readonly string[];
  rightsPolicy: Readonly<Record<AtlasAudienceOutput, 'PERMITTED' | 'BLOCKED' | 'UNKNOWN'>>;
  createdAt: string | null;
  restatementState: 'ORIGINAL' | 'RESTATED' | 'SUPERSEDED' | 'INVALIDATED' | 'REQUIRES_POLICY';
  artifactClass: AtlasObservationArtifactClass;
  calculationKind: 'OBSERVED_MARKET_EVIDENCE' | 'DERIVED_FROM_OBSERVED_EVIDENCE' | 'SCENARIO_MODEL';
}>;

export type AtlasMetricArtifactValidationResult = Readonly<{
  valid: boolean;
  reasons: readonly AtlasComparabilityReasonCode[];
}>;

export type AtlasComparabilityInput = Readonly<{
  left: AtlasMetricArtifact;
  right: AtlasMetricArtifact;
  requestedAudience: AtlasAudienceOutput;
  allowLimitedComparability: boolean;
}>;

export type AtlasComparabilityResult = Readonly<{
  state: AtlasComparabilityState;
  reasons: readonly AtlasComparabilityReasonCode[];
  limitations: readonly string[];
}>;

export type AtlasComparativeResultArtifact = Readonly<{
  comparisonArtifactId: string;
  comparisonDefinitionVersion: typeof ATLAS_COMPARATIVE_RESULT_CONTRACT_VERSION;
  metricIdentity: string;
  cohortArtifactIds: readonly string[];
  comparability: AtlasComparabilityResult;
  values: readonly (number | null)[];
  absoluteDelta: number | null;
  percentageDelta: number | null;
  zeroDenominatorPolicy: 'RETURN_UNDEFINED_WITH_REASON' | 'NOT_APPLICABLE';
  direction: 'UP' | 'DOWN' | 'FLAT' | 'UNDEFINED';
  periodAlignment: string;
  coverageComparison: readonly string[];
  provenance: readonly string[];
  calculationVersion: string | null;
  requestedAudience: AtlasAudienceOutput;
}>;

export type AtlasAdmissionGateEvaluation = Readonly<{
  gate: AtlasAdmissionGate;
  state: 'PASS' | 'FAIL' | 'LIMITED';
  reason: string;
}>;

export type AtlasCapabilityReadiness = Readonly<{
  capability: string;
  state: AtlasReadinessState;
  blockers: readonly string[];
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

export function validateAtlasMetricArtifact(artifact: AtlasMetricArtifact): AtlasMetricArtifactValidationResult {
  const reasons = [
    !hasValue(artifact.metricArtifactId) && 'UNKNOWN_COMPARABILITY',
    !hasValue(artifact.metricDefinitionId) && 'METRIC_MISMATCH',
    !artifact.metricDefinitionVersion && 'UNKNOWN_METHODOLOGY',
    !hasValue(artifact.cohortDefinitionId) && 'UNKNOWN_COMPARABILITY',
    artifact.cohortDefinitionVersion !== ATLAS_COHORT_CONTRACT_VERSION && 'UNKNOWN_COMPARABILITY',
    !artifact.period.periodBasis && 'EVENT_BASIS_MISMATCH',
    !artifact.observationAsOf && 'HISTORICAL_COVERAGE_INSUFFICIENT',
    !artifact.sourceAsOf && 'SOURCE_POPULATION_MISMATCH',
    !artifact.calculationVersion && 'CALCULATION_VERSION_MISMATCH',
    artifact.includedPopulationCount === null && 'FIELD_COVERAGE_INSUFFICIENT',
    artifact.nullPopulationCount === null && 'UNRESOLVED_NULL_MISSING_DATA_MATERIALITY',
    artifact.unknownPopulationCount === null && 'UNRESOLVED_NULL_MISSING_DATA_MATERIALITY',
    artifact.coverage.provenanceRefs.length === 0 && 'UNKNOWN_ATTRIBUTION_REQUIREMENT',
    artifact.sourceProvenance.length === 0 && 'UNKNOWN_ATTRIBUTION_REQUIREMENT',
    !artifact.identityPolicyVersion && 'IDENTITY_POLICY_MISMATCH',
    artifact.methodologyEvidence.length === 0 && 'UNKNOWN_METHODOLOGY',
    artifact.limitations.length === 0 && 'UNKNOWN_COMPARABILITY',
    artifact.calculationKind === 'SCENARIO_MODEL' && artifact.artifactClass !== 'DERIVED_METRIC_ARTIFACT' && 'SCENARIO_OBSERVED_EVIDENCE_AMBIGUITY',
  ].filter(Boolean) as AtlasComparabilityReasonCode[];
  return Object.freeze({ valid: reasons.length === 0, reasons: Object.freeze([...new Set(reasons)].sort()) });
}

function audienceBlocked(artifact: AtlasMetricArtifact, audience: AtlasAudienceOutput) {
  return artifact.rightsPolicy[audience] !== 'PERMITTED';
}

export function evaluateAtlasComparability(input: AtlasComparabilityInput): AtlasComparabilityResult {
  const leftValidation = validateAtlasMetricArtifact(input.left);
  const rightValidation = validateAtlasMetricArtifact(input.right);
  const structuralReasons = [
    ...leftValidation.reasons,
    ...rightValidation.reasons,
    input.left.metricDefinitionId !== input.right.metricDefinitionId && 'METRIC_MISMATCH',
    input.left.metricDefinitionVersion !== input.right.metricDefinitionVersion && 'METRIC_MISMATCH',
    input.left.metricFamily !== input.right.metricFamily && 'METRIC_MISMATCH',
    input.left.unit !== input.right.unit && 'METRIC_MISMATCH',
    input.left.aggregation !== input.right.aggregation && 'METRIC_MISMATCH',
    input.left.analyticalGrain !== input.right.analyticalGrain && 'GRAIN_MISMATCH',
    input.left.period.periodBasis !== input.right.period.periodBasis && 'EVENT_BASIS_MISMATCH',
    input.left.period.form !== input.right.period.form && 'EVENT_BASIS_MISMATCH',
    input.left.coverage.sourceCoverage.admittedPopulation !== input.right.coverage.sourceCoverage.admittedPopulation && 'SOURCE_POPULATION_MISMATCH',
    input.left.coverage.geographicCoverage.definitionVersion !== input.right.coverage.geographicCoverage.definitionVersion && 'GEOGRAPHY_MISMATCH',
    input.left.identityPolicyVersion !== input.right.identityPolicyVersion && 'IDENTITY_POLICY_MISMATCH',
    input.left.calculationVersion !== input.right.calculationVersion && 'CALCULATION_VERSION_MISMATCH',
    (input.left.coverage.temporalCoverage.historicalGaps.length > 0 || input.right.coverage.temporalCoverage.historicalGaps.length > 0) && 'HISTORICAL_COVERAGE_INSUFFICIENT',
    ((input.left.nullPopulationCount ?? 0) > 0 || (input.right.nullPopulationCount ?? 0) > 0 || (input.left.unknownPopulationCount ?? 0) > 0 || (input.right.unknownPopulationCount ?? 0) > 0) && 'FIELD_COVERAGE_INSUFFICIENT',
    input.left.coverage.sourceCoverage.missingSources.length > 0 && 'SOURCE_POPULATION_MISMATCH',
    input.right.coverage.sourceCoverage.missingSources.length > 0 && 'SOURCE_POPULATION_MISMATCH',
    input.left.coverage.geographicCoverage.unresolvedGeography.length > 0 && 'UNRESOLVED_GEOGRAPHY_CONFLICT',
    input.right.coverage.geographicCoverage.unresolvedGeography.length > 0 && 'UNRESOLVED_GEOGRAPHY_CONFLICT',
    input.left.calculationKind !== input.right.calculationKind && 'SCENARIO_OBSERVED_EVIDENCE_AMBIGUITY',
    audienceBlocked(input.left, input.requestedAudience) && 'RIGHTS_INCOMPATIBLE',
    audienceBlocked(input.right, input.requestedAudience) && 'RIGHTS_INCOMPATIBLE',
  ].filter(Boolean) as AtlasComparabilityReasonCode[];
  const reasons = Object.freeze([...new Set(structuralReasons)].sort());
  if (reasons.includes('RIGHTS_INCOMPATIBLE')) return Object.freeze({ state: 'RIGHTS_BLOCKED', reasons, limitations: Object.freeze(['Analytical validity does not grant requested output rights.']) });
  if (reasons.includes('UNKNOWN_METHODOLOGY') || reasons.includes('HISTORICAL_COVERAGE_INSUFFICIENT') || reasons.includes('UNKNOWN_ATTRIBUTION_REQUIREMENT')) return Object.freeze({ state: 'EVIDENCE_INSUFFICIENT', reasons, limitations: Object.freeze(['Required evidence, methodology, history, or provenance is incomplete.']) });
  if (reasons.length > 0 && input.allowLimitedComparability && reasons.every((reason) => reason === 'FIELD_COVERAGE_INSUFFICIENT')) {
    return Object.freeze({ state: 'COMPARABLE_WITH_LIMITATIONS', reasons, limitations: Object.freeze(['Field/null coverage differences must be displayed with the result.']) });
  }
  if (reasons.length > 0) return Object.freeze({ state: 'NOT_COMPARABLE', reasons, limitations: Object.freeze(['Compared artifacts are not meaningfully compatible.']) });
  return Object.freeze({ state: 'COMPARABLE', reasons, limitations: Object.freeze([]) });
}

export function calculateAtlasComparativeResult(input: Readonly<{
  comparisonArtifactId: string;
  left: AtlasMetricArtifact;
  right: AtlasMetricArtifact;
  requestedAudience: AtlasAudienceOutput;
  allowLimitedComparability: boolean;
}>): AtlasComparativeResultArtifact {
  const comparability = evaluateAtlasComparability(input);
  const comparable = comparability.state === 'COMPARABLE' || comparability.state === 'COMPARABLE_WITH_LIMITATIONS';
  const leftValue = input.left.value;
  const rightValue = input.right.value;
  const absoluteDelta = comparable && leftValue !== null && rightValue !== null ? leftValue - rightValue : null;
  const percentageDelta = comparable && absoluteDelta !== null && rightValue !== null && rightValue !== 0 ? absoluteDelta / rightValue : null;
  const zeroDenominatorPolicy = comparable && rightValue === 0 ? 'RETURN_UNDEFINED_WITH_REASON' : 'NOT_APPLICABLE';
  const direction = absoluteDelta === null ? 'UNDEFINED' : absoluteDelta > 0 ? 'UP' : absoluteDelta < 0 ? 'DOWN' : 'FLAT';
  return Object.freeze({
    comparisonArtifactId: input.comparisonArtifactId,
    comparisonDefinitionVersion: ATLAS_COMPARATIVE_RESULT_CONTRACT_VERSION,
    metricIdentity: input.left.metricDefinitionId,
    cohortArtifactIds: Object.freeze([input.left.metricArtifactId, input.right.metricArtifactId]),
    comparability,
    values: Object.freeze([leftValue, rightValue]),
    absoluteDelta,
    percentageDelta,
    zeroDenominatorPolicy,
    direction,
    periodAlignment: `${input.left.period.form}:${input.left.period.periodBasis ?? 'UNKNOWN'}::${input.right.period.form}:${input.right.period.periodBasis ?? 'UNKNOWN'}`,
    coverageComparison: Object.freeze([...comparability.reasons]),
    provenance: Object.freeze([...input.left.sourceProvenance, ...input.right.sourceProvenance]),
    calculationVersion: input.left.calculationVersion === input.right.calculationVersion ? input.left.calculationVersion : null,
    requestedAudience: input.requestedAudience,
  });
}

export function evaluateAtlasAdmissionGates(input: Readonly<{
  sourceAdmitted: boolean;
  fieldAdmitted: boolean;
  methodologyAdmitted: boolean;
  identityAdmitted: boolean;
  geographyAdmitted: boolean;
  temporalHistoryAdmitted: boolean;
  comparabilityAdmitted: boolean;
  rightsAudienceAdmitted: boolean;
  presentationInterpretationAdmitted: boolean;
}>): readonly AtlasAdmissionGateEvaluation[] {
  const rows: readonly [AtlasAdmissionGate, boolean, string][] = [
    ['SOURCE_ADMISSION', input.sourceAdmitted, 'Source identified and admitted for intended analytical use.'],
    ['FIELD_ADMISSION', input.fieldAdmitted, 'Required fields exist, are populated, and have admitted semantics.'],
    ['METRIC_METHODOLOGY_ADMISSION', input.methodologyAdmitted, 'Definition, formula, aggregation, null handling, and event basis are admitted.'],
    ['IDENTITY_DUPLICATION_ADMISSION', input.identityAdmitted, 'Counting grain, duplicate handling, and relisting behavior are controlled.'],
    ['GEOGRAPHY_ADMISSION', input.geographyAdmitted, 'Geographic semantics and mapping are controlled.'],
    ['TEMPORAL_HISTORY_ADMISSION', input.temporalHistoryAdmitted, 'Historical/event/as-of evidence exists for the requested analysis.'],
    ['COMPARABILITY_ADMISSION', input.comparabilityAdmitted, 'Comparison populations satisfy the comparability contract.'],
    ['RIGHTS_AUDIENCE_ADMISSION', input.rightsAudienceAdmitted, 'Intended audience/output use is permitted.'],
    ['PRESENTATION_INTERPRETATION_ADMISSION', input.presentationInterpretationAdmitted, 'Interpretation and recommendation output satisfies governance/review requirements.'],
  ];
  return Object.freeze(rows.map(([gate, pass, reason]) => Object.freeze({ gate, state: pass ? 'PASS' as const : 'FAIL' as const, reason })));
}

export const ATLAS_IMPLEMENTATION_READINESS_MATRIX: readonly AtlasCapabilityReadiness[] = Object.freeze([
  Object.freeze({ capability: 'Reusable Agent cohort builder', state: 'READY_NOW_FOR_BOUNDED_IMPLEMENTATION', blockers: Object.freeze([]) }),
  Object.freeze({ capability: 'Quick Filters', state: 'READY_NOW_FOR_BOUNDED_IMPLEMENTATION', blockers: Object.freeze([]) }),
  Object.freeze({ capability: 'Advanced Property Filters', state: 'READY_AFTER_REPOSITORY_LOCAL_FOUNDATION', blockers: Object.freeze(['FIELD_SEMANTICS_ADMISSION']) }),
  Object.freeze({ capability: 'Expert/MLS Filters', state: 'BLOCKED_BY_SOURCE_DATA', blockers: Object.freeze(['MLS_FIELD_ADMISSION', 'RIGHTS_REVIEW']) }),
  Object.freeze({ capability: 'Simple admitted counts', state: 'READY_NOW_FOR_BOUNDED_IMPLEMENTATION', blockers: Object.freeze([]) }),
  Object.freeze({ capability: 'Min/max/median/average for admitted fields', state: 'READY_AFTER_REPOSITORY_LOCAL_FOUNDATION', blockers: Object.freeze(['AGGREGATION_CONTRACT_IMPLEMENTATION']) }),
  Object.freeze({ capability: 'Multi-city comparison', state: 'READY_AFTER_REPOSITORY_LOCAL_FOUNDATION', blockers: Object.freeze(['COMPARATIVE_RESULT_IMPLEMENTATION']) }),
  Object.freeze({ capability: 'Month-over-month / year-over-year / YTD / trend charts', state: 'BLOCKED_BY_HISTORICAL_DATA', blockers: Object.freeze(['HISTORICAL_MLS_USE_RECONCILIATION_REQUIRED']) }),
  Object.freeze({ capability: 'Active inventory', state: 'BLOCKED_BY_METHODOLOGY', blockers: Object.freeze(['ACTIVE_STATUS_METHODOLOGY_REQUIRED']) }),
  Object.freeze({ capability: 'New / pending / sold activity', state: 'BLOCKED_BY_METHODOLOGY', blockers: Object.freeze(['STATUS_EVENT_METHODOLOGY_REQUIRED']) }),
  Object.freeze({ capability: 'DOM-family analysis', state: 'BLOCKED_BY_METHODOLOGY', blockers: Object.freeze(['DOM_CDOM_DTS_DTO_METHODOLOGY_REQUIRED']) }),
  Object.freeze({ capability: 'SP/LP and original/final-list-to-sale', state: 'BLOCKED_BY_METHODOLOGY', blockers: Object.freeze(['PRICE_SEMANTICS_REQUIRED']) }),
  Object.freeze({ capability: 'Months of supply and absorption', state: 'BLOCKED_BY_HISTORICAL_DATA', blockers: Object.freeze(['HISTORICAL_EVENT_COVERAGE_REQUIRED']) }),
  Object.freeze({ capability: 'Listing episode / relist / failed-listing analysis', state: 'BLOCKED_BY_IDENTITY_DEDUPLICATION', blockers: Object.freeze(['LISTING_EPISODE_POLICY_REQUIRED']) }),
  Object.freeze({ capability: 'Subject-property benchmark cohorts', state: 'READY_AFTER_REPOSITORY_LOCAL_FOUNDATION', blockers: Object.freeze(['BENCHMARK_SELECTION_POLICY_REQUIRED']) }),
  Object.freeze({ capability: 'Seller pricing and buyer competitive positioning', state: 'BLOCKED_BY_EXECUTIVE_DECISION', blockers: Object.freeze(['PROFESSIONAL_RECOMMENDATION_POLICY_REQUIRED']) }),
  Object.freeze({ capability: 'Scenario / investment / proceeds / breakeven analysis', state: 'BLOCKED_BY_EXECUTIVE_DECISION', blockers: Object.freeze(['SCENARIO_MODEL_GOVERNANCE_REQUIRED']) }),
  Object.freeze({ capability: 'Client-facing market reports / PDF / public reporting', state: 'BLOCKED_BY_RIGHTS', blockers: Object.freeze(['CLIENT_PUBLIC_EXPORT_RIGHTS_REQUIRED']) }),
]);

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
