import type { AgentCohortMetricId } from './agentCohortAggregation';

export const CURRENT_SNAPSHOT_COMPARATIVE_ADMISSION_REVIEW_STATUS =
  'CURRENT_SNAPSHOT_COMPARATIVE_INTELLIGENCE_FOUNDATION_ADMITTED' as const;
export const CURRENT_SNAPSHOT_COMPARATIVE_ADMISSION_NEXT_GATE =
  'READY_FOR_CURRENT_SNAPSHOT_COMPARATIVE_INTELLIGENCE_BOUNDED_IMPLEMENTATION_WAVE_3' as const;
export const CURRENT_SNAPSHOT_COMPARATIVE_ADMISSION_VERSION =
  'CURRENT_SNAPSHOT_COMPARATIVE_ADMISSION_REVIEW_V1' as const;

export const CURRENT_SNAPSHOT_COMPARISON_FAMILIES = [
  'CITY_VS_CITY_CURRENT_SNAPSHOT',
  'SEGMENT_VS_SEGMENT_CURRENT_SNAPSHOT',
  'SUBSEGMENT_VS_PARENT_CURRENT_SNAPSHOT',
  'PROPERTY_CHARACTERISTIC_SEGMENT_CURRENT_SNAPSHOT',
  'MULTI_COHORT_CURRENT_SNAPSHOT',
] as const;

export type CurrentSnapshotComparisonFamily = (typeof CURRENT_SNAPSHOT_COMPARISON_FAMILIES)[number];
export type ComparativeReadinessState =
  | 'READY_NOW_FOR_BOUNDED_IMPLEMENTATION'
  | 'READY_AFTER_SMALL_REPOSITORY_LOCAL_FOUNDATION'
  | 'BLOCKED_BY_HISTORICAL_DATA'
  | 'BLOCKED_BY_METHODOLOGY'
  | 'BLOCKED_BY_SOURCE_POPULATION'
  | 'BLOCKED_BY_IDENTITY_DEDUPLICATION'
  | 'BLOCKED_BY_GEOGRAPHY'
  | 'BLOCKED_BY_RIGHTS'
  | 'BLOCKED_BY_EXECUTIVE_DECISION';

export type CohortRelationshipAdmission =
  | 'DISJOINT'
  | 'OVERLAPPING'
  | 'SUBSET'
  | 'SUPERSET'
  | 'SAME_POPULATION'
  | 'UNKNOWN_RELATIONSHIP';

export type MetricOperationPolicy = readonly (
  | 'SIDE_BY_SIDE_ONLY'
  | 'ABSOLUTE_DELTA_ALLOWED'
  | 'PERCENTAGE_DELTA_ALLOWED'
  | 'DIRECTION_ALLOWED'
  | 'RANK_ALLOWED'
)[];

export type ComparativeAdmissionFixture = Readonly<{
  metricId: string;
  metricVersion: string;
  comparisonMetricId: string;
  comparisonMetricVersion: string;
  analyticalGrain: string;
  comparisonAnalyticalGrain: string;
  sourceScope: string;
  comparisonSourceScope: string;
  temporalBasis: string;
  comparisonTemporalBasis: string;
  periodForm: string;
  comparisonPeriodForm: string;
  fieldBasis: string;
  comparisonFieldBasis: string;
  calculationVersion: string;
  comparisonCalculationVersion: string;
  artifactState: 'READY' | 'NO_DATA';
  comparisonArtifactState: 'READY' | 'NO_DATA';
  rights: 'AGENT_ONLY' | 'PUBLIC' | 'CLIENT_PRIVATE' | 'EXPORT_PDF';
  comparisonRights: 'AGENT_ONLY' | 'PUBLIC' | 'CLIENT_PRIVATE' | 'EXPORT_PDF';
  cohortRelationship: CohortRelationshipAdmission;
  scenarioClass: 'OBSERVED_CURRENT_SNAPSHOT' | 'HISTORICAL' | 'SCENARIO';
}>;

export type ComparativeAdmissionResult = Readonly<{
  admissible: boolean;
  state: 'COMPARISON_ADMISSIBLE_WITH_LIMITATIONS' | 'NOT_COMPARISON_ADMISSIBLE';
  reasons: readonly string[];
}>;

export const CURRENT_SNAPSHOT_COMPARISON_OPERATION_POLICY: Readonly<Record<AgentCohortMetricId, MetricOperationPolicy>> = Object.freeze({
  'agent.cohort.current-mls-listing-record-count.v1': Object.freeze([
    'SIDE_BY_SIDE_ONLY',
    'ABSOLUTE_DELTA_ALLOWED',
    'PERCENTAGE_DELTA_ALLOWED',
    'DIRECTION_ALLOWED',
    'RANK_ALLOWED',
  ] as const),
  'agent.cohort.current-asking-list-price-min.v1': Object.freeze(['SIDE_BY_SIDE_ONLY', 'ABSOLUTE_DELTA_ALLOWED', 'DIRECTION_ALLOWED', 'RANK_ALLOWED'] as const),
  'agent.cohort.current-asking-list-price-max.v1': Object.freeze(['SIDE_BY_SIDE_ONLY', 'ABSOLUTE_DELTA_ALLOWED', 'DIRECTION_ALLOWED', 'RANK_ALLOWED'] as const),
  'agent.cohort.current-asking-list-price-median.v1': Object.freeze([
    'SIDE_BY_SIDE_ONLY',
    'ABSOLUTE_DELTA_ALLOWED',
    'PERCENTAGE_DELTA_ALLOWED',
    'DIRECTION_ALLOWED',
    'RANK_ALLOWED',
  ] as const),
  'agent.cohort.current-asking-list-price-mean.v1': Object.freeze([
    'SIDE_BY_SIDE_ONLY',
    'ABSOLUTE_DELTA_ALLOWED',
    'PERCENTAGE_DELTA_ALLOWED',
    'DIRECTION_ALLOWED',
    'RANK_ALLOWED',
  ] as const),
  'agent.cohort.bedrooms-median.v1': Object.freeze(['SIDE_BY_SIDE_ONLY', 'ABSOLUTE_DELTA_ALLOWED', 'DIRECTION_ALLOWED', 'RANK_ALLOWED'] as const),
  'agent.cohort.bathrooms-median.v1': Object.freeze(['SIDE_BY_SIDE_ONLY', 'ABSOLUTE_DELTA_ALLOWED', 'DIRECTION_ALLOWED', 'RANK_ALLOWED'] as const),
  'agent.cohort.listed-square-feet-median.v1': Object.freeze([
    'SIDE_BY_SIDE_ONLY',
    'ABSOLUTE_DELTA_ALLOWED',
    'PERCENTAGE_DELTA_ALLOWED',
    'DIRECTION_ALLOWED',
    'RANK_ALLOWED',
  ] as const),
  'agent.cohort.year-built-median.v1': Object.freeze(['SIDE_BY_SIDE_ONLY', 'ABSOLUTE_DELTA_ALLOWED', 'DIRECTION_ALLOWED', 'RANK_ALLOWED'] as const),
});

export const CURRENT_SNAPSHOT_COMPARISON_READINESS_MATRIX: readonly Readonly<{
  capability: string;
  track: 'CURRENT_SNAPSHOT' | 'HISTORICAL_TEMPORAL' | 'ADVANCED';
  state: ComparativeReadinessState;
  value: 'HIGH_AGENT_VALUE' | 'MODERATE_AGENT_VALUE' | 'LOW_AGENT_VALUE';
  blockers: readonly string[];
}>[] = Object.freeze([
  row('city vs city listing count', 'CURRENT_SNAPSHOT', 'READY_NOW_FOR_BOUNDED_IMPLEMENTATION', 'HIGH_AGENT_VALUE', ['Must disclose raw count and geography-size limitations.']),
  row('city vs city current asking/list-price median', 'CURRENT_SNAPSHOT', 'READY_NOW_FOR_BOUNDED_IMPLEMENTATION', 'HIGH_AGENT_VALUE', ['Must not label as sale price or market value.']),
  row('city vs city current asking/list-price mean', 'CURRENT_SNAPSHOT', 'READY_NOW_FOR_BOUNDED_IMPLEMENTATION', 'MODERATE_AGENT_VALUE', ['Mean is outlier-sensitive and needs coverage display.']),
  row('city vs city asking-price range', 'CURRENT_SNAPSHOT', 'READY_NOW_FOR_BOUNDED_IMPLEMENTATION', 'MODERATE_AGENT_VALUE', ['Range can be outlier-sensitive and must remain asking/list price.']),
  row('city vs city bedrooms median', 'CURRENT_SNAPSHOT', 'READY_NOW_FOR_BOUNDED_IMPLEMENTATION', 'MODERATE_AGENT_VALUE', ['Characteristic comparison only.']),
  row('city vs city bathrooms median', 'CURRENT_SNAPSHOT', 'READY_NOW_FOR_BOUNDED_IMPLEMENTATION', 'MODERATE_AGENT_VALUE', ['Characteristic comparison only.']),
  row('city vs city listed-square-feet median', 'CURRENT_SNAPSHOT', 'READY_NOW_FOR_BOUNDED_IMPLEMENTATION', 'HIGH_AGENT_VALUE', ['Use listed square-footage label.']),
  row('city vs city year-built median', 'CURRENT_SNAPSHOT', 'READY_NOW_FOR_BOUNDED_IMPLEMENTATION', 'MODERATE_AGENT_VALUE', ['Percentage delta not admitted.']),
  row('price-band vs price-band', 'CURRENT_SNAPSHOT', 'READY_NOW_FOR_BOUNDED_IMPLEMENTATION', 'HIGH_AGENT_VALUE', ['Relationship may be disjoint or parent/subset and must be identified.']),
  row('characteristic segment vs segment', 'CURRENT_SNAPSHOT', 'READY_NOW_FOR_BOUNDED_IMPLEMENTATION', 'HIGH_AGENT_VALUE', ['Overlap/nesting metadata required where knowable.']),
  row('subsegment vs parent', 'CURRENT_SNAPSHOT', 'READY_NOW_FOR_BOUNDED_IMPLEMENTATION', 'HIGH_AGENT_VALUE', ['Must disclose subset relationship and avoid independence claims.']),
  row('multi-city side-by-side', 'CURRENT_SNAPSHOT', 'READY_AFTER_SMALL_REPOSITORY_LOCAL_FOUNDATION', 'HIGH_AGENT_VALUE', ['Needs bounded orchestration, deterministic ordering, partial-failure handling, and as-of alignment metadata.']),
  row('rank by admitted current metric', 'CURRENT_SNAPSHOT', 'READY_AFTER_SMALL_REPOSITORY_LOCAL_FOUNDATION', 'MODERATE_AGENT_VALUE', ['Ranking needs operation policy and limitation display.']),
  row('absolute delta', 'CURRENT_SNAPSHOT', 'READY_NOW_FOR_BOUNDED_IMPLEMENTATION', 'HIGH_AGENT_VALUE', ['Only for operation-admitted same-metric artifacts.']),
  row('percentage delta', 'CURRENT_SNAPSHOT', 'READY_AFTER_SMALL_REPOSITORY_LOCAL_FOUNDATION', 'MODERATE_AGENT_VALUE', ['Requires zero-denominator and no-data handling in runtime implementation.']),
  row('MoM/QoQ/YoY/YTD/rolling periods', 'HISTORICAL_TEMPORAL', 'BLOCKED_BY_HISTORICAL_DATA', 'HIGH_AGENT_VALUE', ['No admitted historical snapshot/event population.']),
  row('historical active inventory trend', 'HISTORICAL_TEMPORAL', 'BLOCKED_BY_HISTORICAL_DATA', 'HIGH_AGENT_VALUE', ['Requires admitted historical reconstruction.']),
  row('historical asking/list-price trend', 'HISTORICAL_TEMPORAL', 'BLOCKED_BY_HISTORICAL_DATA', 'HIGH_AGENT_VALUE', ['Requires admitted historical source snapshots and methodology.']),
  row('subject property vs benchmark', 'ADVANCED', 'READY_AFTER_SMALL_REPOSITORY_LOCAL_FOUNDATION', 'HIGH_AGENT_VALUE', ['Requires subject-property binding and benchmark cohort request contract.']),
  row('seller pricing comparison', 'ADVANCED', 'BLOCKED_BY_METHODOLOGY', 'HIGH_AGENT_VALUE', ['Automated pricing recommendation boundary must be governed.']),
  row('buyer competitive positioning', 'ADVANCED', 'BLOCKED_BY_METHODOLOGY', 'HIGH_AGENT_VALUE', ['Offer/recommendation boundary must be governed.']),
  row('scenario vs observed benchmark', 'ADVANCED', 'BLOCKED_BY_METHODOLOGY', 'MODERATE_AGENT_VALUE', ['Scenario engine not admitted.']),
]);

function row(
  capability: string,
  track: 'CURRENT_SNAPSHOT' | 'HISTORICAL_TEMPORAL' | 'ADVANCED',
  state: ComparativeReadinessState,
  value: 'HIGH_AGENT_VALUE' | 'MODERATE_AGENT_VALUE' | 'LOW_AGENT_VALUE',
  blockers: readonly string[],
) {
  return Object.freeze({ capability, track, state, value, blockers });
}

export function evaluateComparativeAdmissionFixture(input: ComparativeAdmissionFixture): ComparativeAdmissionResult {
  const reasons = [
    input.metricId !== input.comparisonMetricId && 'METRIC_ID_MISMATCH',
    input.metricVersion !== input.comparisonMetricVersion && 'METRIC_VERSION_MISMATCH',
    input.analyticalGrain !== input.comparisonAnalyticalGrain && 'GRAIN_MISMATCH',
    input.sourceScope !== input.comparisonSourceScope && 'SOURCE_SCOPE_MISMATCH',
    input.temporalBasis !== input.comparisonTemporalBasis && 'TEMPORAL_BASIS_MISMATCH',
    input.periodForm !== input.comparisonPeriodForm && 'PERIOD_FORM_MISMATCH',
    input.fieldBasis !== input.comparisonFieldBasis && 'FIELD_BASIS_MISMATCH',
    input.calculationVersion !== input.comparisonCalculationVersion && 'CALCULATION_VERSION_MISMATCH',
    input.artifactState === 'NO_DATA' && 'LEFT_ARTIFACT_NO_DATA',
    input.comparisonArtifactState === 'NO_DATA' && 'RIGHT_ARTIFACT_NO_DATA',
    input.rights !== 'AGENT_ONLY' && 'LEFT_RIGHTS_NOT_AGENT_ONLY',
    input.comparisonRights !== 'AGENT_ONLY' && 'RIGHT_RIGHTS_NOT_AGENT_ONLY',
    input.scenarioClass !== 'OBSERVED_CURRENT_SNAPSHOT' && 'OBSERVATION_CLASS_NOT_CURRENT_SNAPSHOT',
  ].filter(Boolean) as string[];
  return Object.freeze({
    admissible: reasons.length === 0,
    state: reasons.length === 0 ? 'COMPARISON_ADMISSIBLE_WITH_LIMITATIONS' : 'NOT_COMPARISON_ADMISSIBLE',
    reasons: Object.freeze([...new Set(reasons)].sort()),
  });
}

export const COMPARATIVE_ADMISSION_PROTECTED_BOUNDARIES = Object.freeze({
  runtimeComparisonEngineImplemented: false,
  comparativeAgentUiImplemented: false,
  databaseMutation: false,
  schemaMigration: false,
  providerActivity: false,
  mlsGridOrIresCall: false,
  sourceActivation: false,
  publicClientPublication: false,
  pdfExport: false,
  scenarioEngine: false,
});
