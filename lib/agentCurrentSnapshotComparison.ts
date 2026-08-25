import {
  CURRENT_SNAPSHOT_COMPARISON_OPERATION_POLICY,
  type CohortRelationshipAdmission,
} from './agentComparativeAdmissionReview';
import {
  AGENT_COHORT_ADMITTED_METRICS,
  AGENT_COHORT_AGGREGATION_VERSION,
  AGENT_COHORT_METRIC_IDS,
  aggregateAgentCohort,
  normalizeAgentCohortMetricIds,
  type AgentCohortAggregationResult,
  type AgentCohortMetricArtifact,
  type AgentCohortMetricId,
} from './agentCohortAggregation';
import {
  AGENT_COHORT_SUPPORTED_FILTER_KEYS,
  normalizeAgentCohortDefinition,
  type AgentCohortFilterKey,
  type AgentCohortInput,
  type AgentCohortNormalizedDefinition,
  type AgentCohortQuickFilters,
} from './agentCohortBuilder';
import type { AtlasAudienceOutput, AtlasComparabilityState } from './atlasCohortComparativeContract';
import { classifyAgentNumericIntervals, type AgentNumericIntervalDimension } from './agentNumericInterval';

export const CURRENT_SNAPSHOT_COMPARATIVE_INTELLIGENCE_WAVE_3_STATUS =
  'CURRENT_SNAPSHOT_COMPARATIVE_INTELLIGENCE_BOUNDED_IMPLEMENTATION_WAVE_3_CERTIFIED' as const;
export const COHORT_N_MULTI_MARKET_COMPARATIVE_INTELLIGENCE_WAVE_5_STATUS =
  'COHORT_N_MULTI_MARKET_COMPARATIVE_INTELLIGENCE_BOUNDED_IMPLEMENTATION_WAVE_5_CERTIFIED' as const;
export const CURRENT_SNAPSHOT_COMPARATIVE_INTELLIGENCE_NEXT_GATE =
  'READY_FOR_AGENT_COMPARISON_REUSE_AND_SEGMENT_EXPANSION_REVIEW' as const;
export const COHORT_N_MULTI_MARKET_COMPARATIVE_INTELLIGENCE_NEXT_GATE =
  'READY_FOR_ADVANCED_SEGMENTATION_HISTORICAL_EVIDENCE_AND_SUBJECT_PROPERTY_BENCHMARK_AUTHORIZATION' as const;
export const AGENT_CURRENT_SNAPSHOT_COMPARISON_VERSION = 'AGENT_CURRENT_SNAPSHOT_COMPARISON_V1' as const;
export const AGENT_CURRENT_SNAPSHOT_COMPARISON_AS_OF_TOLERANCE_MS = 5000;

export type AgentComparisonOperation = 'SIDE_BY_SIDE' | 'ABSOLUTE_DELTA' | 'PERCENTAGE_DELTA' | 'DIRECTION' | 'RANK';
export type AgentComparisonOperationAdmission = 'ADMITTED' | 'ADMITTED_WITH_LIMITATIONS' | 'NOT_ADMITTED';
export type AgentComparisonDirection = 'HIGHER' | 'LOWER' | 'SAME' | 'UNDEFINED';
export type AgentComparisonAsOfAlignmentStatus = 'ALIGNED_WITHIN_SINGLE_REQUEST_TOLERANCE' | 'COMPARABLE_WITH_AS_OF_LIMITATION' | 'AS_OF_EVIDENCE_INSUFFICIENT';

export type AgentComparisonCohortInput = Readonly<{
  label: string;
  cohort: AgentCohortInput;
  surface?: string | null;
}>;

export type AgentComparisonRequest = Readonly<{
  cohorts: readonly AgentComparisonCohortInput[];
  metricIds?: readonly string[];
  requestedOperations?: readonly AgentComparisonOperation[];
  audience?: AtlasAudienceOutput;
  requestAsOf?: string | null;
}>;

export type AgentComparisonAsOfAlignment = Readonly<{
  requestAsOf: string;
  observationAsOf: readonly string[];
  maxSkewMs: number | null;
  toleranceMs: typeof AGENT_CURRENT_SNAPSHOT_COMPARISON_AS_OF_TOLERANCE_MS;
  status: AgentComparisonAsOfAlignmentStatus;
  limitation: string | null;
}>;

export type AgentComparisonOperationPolicy = Readonly<Record<AgentComparisonOperation, AgentComparisonOperationAdmission>>;

export type AgentCurrentSnapshotComparisonResult = Readonly<{
  comparisonArtifactId: string;
  comparisonVersion: typeof AGENT_CURRENT_SNAPSHOT_COMPARISON_VERSION;
  metricId: AgentCohortMetricId;
  metricVersion: typeof AGENT_COHORT_AGGREGATION_VERSION;
  label: string;
  cohortLabels: readonly string[];
  cohortDefinitionIds: readonly string[];
  values: readonly (number | null)[];
  unit: AgentCohortMetricArtifact['unit'];
  operationPolicy: AgentComparisonOperationPolicy;
  absoluteDelta: number | null;
  percentageDelta: number | null;
  direction: AgentComparisonDirection;
  ranks: readonly (number | null)[];
  comparabilityStatus: AtlasComparabilityState;
  comparabilityReasons: readonly string[];
  cohortRelationship: CohortRelationshipAdmission;
  coverage: readonly Readonly<{
    eligibleCohortCount: number;
    includedPopulationCount: number;
    nullMissingCount: number;
    includedCoverageRatio: number | null;
  }>[];
  observationAsOf: readonly string[];
  asOfAlignment: AgentComparisonAsOfAlignment;
  sourceScope: 'CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION';
  analyticalGrain: 'MLS_LISTING';
  temporalBasis: 'OBSERVATION_AS_OF_TIMESTAMP';
  periodForm: 'AS_OF_INSTANT_SNAPSHOT';
  calculationVersion: typeof AGENT_COHORT_AGGREGATION_VERSION;
  audience: 'AGENT_ONLY';
  limitations: readonly string[];
  createdAt: string;
}>;

export type AgentCurrentSnapshotComparisonResponse = Readonly<{
  status: 'READY' | 'NOT_AVAILABLE';
  overallComparabilityStatus: AtlasComparabilityState | 'PARTIAL';
  certification: typeof CURRENT_SNAPSHOT_COMPARATIVE_INTELLIGENCE_WAVE_3_STATUS;
  cohortNCertification: typeof COHORT_N_MULTI_MARKET_COMPARATIVE_INTELLIGENCE_WAVE_5_STATUS;
  cohortNReadiness: 'COHORT_N_RUNTIME_READY';
  requestAsOf: string;
  cohorts: readonly Readonly<{
    label: string;
    status: AgentCohortAggregationResult['status'] | 'INVALID_COHORT';
    normalized: AgentCohortNormalizedDefinition;
    rejectionReasons: readonly string[];
  }>[];
  rejectedMetricIds: readonly string[];
  rejectedOperations: readonly AgentComparisonOperation[];
  results: readonly AgentCurrentSnapshotComparisonResult[];
  rejectionReasons: readonly string[];
}>;

const operationByPolicyToken: Readonly<Record<string, AgentComparisonOperation>> = Object.freeze({
  SIDE_BY_SIDE_ONLY: 'SIDE_BY_SIDE',
  ABSOLUTE_DELTA_ALLOWED: 'ABSOLUTE_DELTA',
  PERCENTAGE_DELTA_ALLOWED: 'PERCENTAGE_DELTA',
  DIRECTION_ALLOWED: 'DIRECTION',
  RANK_ALLOWED: 'RANK',
});

const allOperations: readonly AgentComparisonOperation[] = Object.freeze(['SIDE_BY_SIDE', 'ABSOLUTE_DELTA', 'PERCENTAGE_DELTA', 'DIRECTION', 'RANK']);

function nowIso(value: string | null | undefined) {
  if (value && !Number.isNaN(Date.parse(value))) return new Date(value).toISOString();
  return new Date().toISOString();
}

function stableSerialize(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableSerialize).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.entries(value).sort(([left], [right]) => left.localeCompare(right)).map(([key, entry]) => `${JSON.stringify(key)}:${stableSerialize(entry)}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

export function getAgentMetricOperationPolicy(metricId: AgentCohortMetricId): AgentComparisonOperationPolicy {
  const admitted = new Set(CURRENT_SNAPSHOT_COMPARISON_OPERATION_POLICY[metricId].map((token) => operationByPolicyToken[token]));
  return Object.freeze({
    SIDE_BY_SIDE: 'ADMITTED',
    ABSOLUTE_DELTA: admitted.has('ABSOLUTE_DELTA') ? 'ADMITTED' : 'NOT_ADMITTED',
    PERCENTAGE_DELTA: admitted.has('PERCENTAGE_DELTA') ? 'ADMITTED_WITH_LIMITATIONS' : 'NOT_ADMITTED',
    DIRECTION: admitted.has('DIRECTION') ? 'ADMITTED' : 'NOT_ADMITTED',
    RANK: admitted.has('RANK') ? 'ADMITTED_WITH_LIMITATIONS' : 'NOT_ADMITTED',
  });
}

export function normalizeAgentComparisonOperations(input: readonly string[] | null | undefined) {
  const requested = input?.length ? input : allOperations;
  const admitted = new Set(allOperations);
  return Object.freeze({
    requestedOperations: Object.freeze(requested.filter((operation): operation is AgentComparisonOperation => admitted.has(operation as AgentComparisonOperation))),
    rejectedOperations: Object.freeze(requested.filter((operation) => !admitted.has(operation as AgentComparisonOperation)).sort() as AgentComparisonOperation[]),
  });
}

function sameBasePopulation(left: AgentCohortQuickFilters, right: AgentCohortQuickFilters) {
  return left.city === right.city && left.propertyType === right.propertyType && left.statusScope === right.statusScope;
}

const relationshipDimensions = ['price', 'sqft', 'yearBuilt', 'beds', 'baths'] as const satisfies readonly AgentNumericIntervalDimension[];

function isSubset(left: AgentCohortQuickFilters, right: AgentCohortQuickFilters) {
  if (!sameBasePopulation(left, right)) return false;
  return true;
}

export function classifyAgentCohortRelationship(left: AgentCohortNormalizedDefinition, right: AgentCohortNormalizedDefinition): CohortRelationshipAdmission {
  const leftFilters = left.filters;
  const rightFilters = right.filters;
  if (left.serializedCohortIdentity === right.serializedCohortIdentity) return 'SAME_POPULATION';
  if (leftFilters.city && rightFilters.city && leftFilters.city !== rightFilters.city) return 'DISJOINT';
  if (!sameBasePopulation(leftFilters, rightFilters)) return 'UNKNOWN_RELATIONSHIP';
  const intervalRelationships = relationshipDimensions.map((dimension) => classifyAgentNumericIntervals(left.intervalSemantics[dimension], right.intervalSemantics[dimension]));
  if (intervalRelationships.includes('DISJOINT')) {
    return 'DISJOINT';
  }
  const leftSubset = isSubset(leftFilters, rightFilters) && intervalRelationships.every((relationship) => relationship === 'SAME_INTERVAL' || relationship === 'SUBSET');
  const rightSubset = isSubset(rightFilters, leftFilters) && intervalRelationships.every((relationship) => relationship === 'SAME_INTERVAL' || relationship === 'SUPERSET');
  if (leftSubset && !rightSubset) return 'SUBSET';
  if (rightSubset && !leftSubset) return 'SUPERSET';
  if (leftFilters.city && rightFilters.city && leftFilters.city === rightFilters.city) return 'OVERLAPPING';
  return 'UNKNOWN_RELATIONSHIP';
}

function asOfAlignment(artifacts: readonly AgentCohortMetricArtifact[], requestAsOf: string): AgentComparisonAsOfAlignment {
  const observationAsOf = artifacts.map((artifact) => artifact.asOf);
  const parsed = observationAsOf.map((value) => Date.parse(value)).filter((value) => Number.isFinite(value));
  const maxSkewMs = parsed.length === observationAsOf.length ? Math.max(...parsed) - Math.min(...parsed) : null;
  const status =
    maxSkewMs === null
      ? 'AS_OF_EVIDENCE_INSUFFICIENT'
      : maxSkewMs <= AGENT_CURRENT_SNAPSHOT_COMPARISON_AS_OF_TOLERANCE_MS
        ? 'ALIGNED_WITHIN_SINGLE_REQUEST_TOLERANCE'
        : 'COMPARABLE_WITH_AS_OF_LIMITATION';
  return Object.freeze({
    requestAsOf,
    observationAsOf: Object.freeze(observationAsOf),
    maxSkewMs,
    toleranceMs: AGENT_CURRENT_SNAPSHOT_COMPARISON_AS_OF_TOLERANCE_MS,
    status,
    limitation: status === 'ALIGNED_WITHIN_SINGLE_REQUEST_TOLERANCE' ? null : 'Cohort artifacts were not observed within the same bounded request tolerance.',
  });
}

function coverageFor(artifact: AgentCohortMetricArtifact) {
  const includedCoverageRatio = artifact.eligibleCohortCount > 0 ? artifact.includedPopulationCount / artifact.eligibleCohortCount : null;
  return Object.freeze({
    eligibleCohortCount: artifact.eligibleCohortCount,
    includedPopulationCount: artifact.includedPopulationCount,
    nullMissingCount: artifact.nullMissingCount,
    includedCoverageRatio,
  });
}

function coverageLimitations(coverage: readonly ReturnType<typeof coverageFor>[]) {
  const ratios = coverage.map((item) => item.includedCoverageRatio).filter((value): value is number => value !== null);
  const materialDifference = ratios.length > 1 && Math.max(...ratios) - Math.min(...ratios) >= 0.25;
  return Object.freeze([
    coverage.some((item) => item.nullMissingCount > 0) && 'Field/null coverage is displayed; null values are not coerced to zero.',
    materialDifference && 'Material included-population coverage differences may limit interpretation.',
  ].filter(Boolean) as string[]);
}

function direction(left: number | null, right: number | null): AgentComparisonDirection {
  if (left === null || right === null) return 'UNDEFINED';
  if (left > right) return 'HIGHER';
  if (left < right) return 'LOWER';
  return 'SAME';
}

function ranks(values: readonly (number | null)[]) {
  const sortedValues = [...new Set(values.filter((value): value is number => value !== null))].sort((left, right) => right - left);
  return values.map((value) => {
    if (value === null) return null;
    return sortedValues.findIndex((item) => item === value) + 1;
  });
}

export function compareAgentCurrentSnapshotMetricArtifacts(input: Readonly<{
  metricId: AgentCohortMetricId;
  artifacts: readonly AgentCohortMetricArtifact[];
  cohorts: readonly AgentComparisonCohortInput[];
  normalized: readonly AgentCohortNormalizedDefinition[];
  requestedOperations: readonly AgentComparisonOperation[];
  requestAsOf: string;
}>): AgentCurrentSnapshotComparisonResult {
  const artifactA = input.artifacts[0];
  const artifactB = input.artifacts[1];
  const operationPolicy = getAgentMetricOperationPolicy(input.metricId);
  const coverage = Object.freeze(input.artifacts.map(coverageFor));
  const coverageLimits = coverageLimitations(coverage);
  const alignment = asOfAlignment(input.artifacts, input.requestAsOf);
  const values = Object.freeze(input.artifacts.map((artifact) => artifact.value));
  const baseReasons = [
    ...input.artifacts.flatMap((artifact, index) => [
      artifact.metricId !== input.metricId && `COHORT_${index + 1}:METRIC_ID_MISMATCH`,
      artifact.metricId !== artifactA.metricId && `COHORT_${index + 1}:METRIC_ID_MISMATCH`,
      artifact.calculationVersion !== artifactA.calculationVersion && `COHORT_${index + 1}:CALCULATION_VERSION_MISMATCH`,
      artifact.fieldBasis !== artifactA.fieldBasis && `COHORT_${index + 1}:FIELD_BASIS_MISMATCH`,
      artifact.aggregation !== artifactA.aggregation && `COHORT_${index + 1}:AGGREGATION_MISMATCH`,
      artifact.unit !== artifactA.unit && `COHORT_${index + 1}:UNIT_MISMATCH`,
      artifact.analyticalGrain !== 'MLS_LISTING' && `COHORT_${index + 1}:GRAIN_MISMATCH`,
      artifact.sourceScope !== 'CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION' && `COHORT_${index + 1}:SOURCE_SCOPE_MISMATCH`,
      artifact.temporalBasis !== 'OBSERVATION_AS_OF_TIMESTAMP' && `COHORT_${index + 1}:TEMPORAL_BASIS_MISMATCH`,
      artifact.periodForm !== 'AS_OF_INSTANT_SNAPSHOT' && `COHORT_${index + 1}:PERIOD_FORM_MISMATCH`,
      artifact.audience !== 'AGENT_ONLY' && `COHORT_${index + 1}:RIGHTS_INCOMPATIBLE`,
      artifact.state !== 'READY' && `COHORT_${index + 1}:ARTIFACT_NO_DATA`,
    ]),
    artifactA.metricId !== input.metricId && 'METRIC_ID_MISMATCH',
    artifactB.metricId !== input.metricId && 'METRIC_ID_MISMATCH',
    artifactA.metricId !== artifactB.metricId && 'METRIC_ID_MISMATCH',
    artifactA.calculationVersion !== artifactB.calculationVersion && 'CALCULATION_VERSION_MISMATCH',
    artifactA.fieldBasis !== artifactB.fieldBasis && 'FIELD_BASIS_MISMATCH',
    artifactA.aggregation !== artifactB.aggregation && 'AGGREGATION_MISMATCH',
    artifactA.unit !== artifactB.unit && 'UNIT_MISMATCH',
    artifactA.analyticalGrain !== 'MLS_LISTING' && 'GRAIN_MISMATCH',
    artifactB.analyticalGrain !== 'MLS_LISTING' && 'GRAIN_MISMATCH',
    artifactA.sourceScope !== 'CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION' && 'SOURCE_SCOPE_MISMATCH',
    artifactB.sourceScope !== 'CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION' && 'SOURCE_SCOPE_MISMATCH',
    artifactA.temporalBasis !== 'OBSERVATION_AS_OF_TIMESTAMP' && 'TEMPORAL_BASIS_MISMATCH',
    artifactB.temporalBasis !== 'OBSERVATION_AS_OF_TIMESTAMP' && 'TEMPORAL_BASIS_MISMATCH',
    artifactA.periodForm !== 'AS_OF_INSTANT_SNAPSHOT' && 'PERIOD_FORM_MISMATCH',
    artifactB.periodForm !== 'AS_OF_INSTANT_SNAPSHOT' && 'PERIOD_FORM_MISMATCH',
    artifactA.audience !== 'AGENT_ONLY' && 'RIGHTS_INCOMPATIBLE',
    artifactB.audience !== 'AGENT_ONLY' && 'RIGHTS_INCOMPATIBLE',
    artifactA.state !== 'READY' && 'LEFT_ARTIFACT_NO_DATA',
    artifactB.state !== 'READY' && 'RIGHT_ARTIFACT_NO_DATA',
    alignment.status === 'AS_OF_EVIDENCE_INSUFFICIENT' && 'AS_OF_EVIDENCE_INSUFFICIENT',
    ...input.requestedOperations.filter((operation) => operationPolicy[operation] === 'NOT_ADMITTED').map((operation) => `OPERATION_NOT_ADMITTED:${operation}`),
  ].filter(Boolean) as string[];
  const reasons = Object.freeze([...new Set(baseReasons)].sort());
  const hardBlock = reasons.some((reason) => !['FIELD_COVERAGE_LIMITATION'].includes(reason));
  const comparable = reasons.length === 0;
  const comparabilityStatus: AtlasComparabilityState =
    reasons.includes('RIGHTS_INCOMPATIBLE')
      ? 'RIGHTS_BLOCKED'
      : hardBlock
        ? 'NOT_COMPARABLE'
        : coverageLimits.length > 0 || alignment.status === 'COMPARABLE_WITH_AS_OF_LIMITATION'
          ? 'COMPARABLE_WITH_LIMITATIONS'
          : 'COMPARABLE';
  const leftValue = values[0] ?? null;
  const rightValue = values[1] ?? null;
  const mayCalculate = comparabilityStatus === 'COMPARABLE' || comparabilityStatus === 'COMPARABLE_WITH_LIMITATIONS';
  const absoluteDelta = mayCalculate && operationPolicy.ABSOLUTE_DELTA !== 'NOT_ADMITTED' && leftValue !== null && rightValue !== null ? leftValue - rightValue : null;
  const percentageDelta =
    mayCalculate && operationPolicy.PERCENTAGE_DELTA !== 'NOT_ADMITTED' && absoluteDelta !== null && rightValue !== null && rightValue !== 0
      ? absoluteDelta / rightValue
      : null;
  const limitations = Object.freeze([
    ...artifactA.limitations,
    ...artifactB.limitations,
    ...coverageLimits,
    alignment.limitation,
    rightValue === 0 && operationPolicy.PERCENTAGE_DELTA !== 'NOT_ADMITTED' && 'Percentage delta is omitted when the comparison baseline is zero.',
    input.metricId === 'agent.cohort.current-mls-listing-record-count.v1' && 'Count difference is only relative difference in matching current MLS listing-record counts; it is not supply, demand, absorption, or market strength.',
  ].filter(Boolean) as string[]);

  return Object.freeze({
    comparisonArtifactId: `agent-comparison:${AGENT_CURRENT_SNAPSHOT_COMPARISON_VERSION}:${input.metricId}:${stableSerialize(input.normalized.map((item) => item.serializedCohortIdentity))}`,
    comparisonVersion: AGENT_CURRENT_SNAPSHOT_COMPARISON_VERSION,
    metricId: input.metricId,
    metricVersion: AGENT_COHORT_AGGREGATION_VERSION,
    label: AGENT_COHORT_ADMITTED_METRICS[input.metricId].label,
    cohortLabels: Object.freeze(input.cohorts.map((cohort) => cohort.label)),
    cohortDefinitionIds: Object.freeze(input.normalized.map((item) => item.cohort.cohortDefinitionId)),
    values,
    unit: artifactA.unit,
    operationPolicy,
    absoluteDelta,
    percentageDelta,
    direction: mayCalculate && operationPolicy.DIRECTION !== 'NOT_ADMITTED' ? direction(leftValue, rightValue) : 'UNDEFINED',
    ranks: Object.freeze(mayCalculate && operationPolicy.RANK !== 'NOT_ADMITTED' ? ranks(values) : values.map(() => null)),
    comparabilityStatus: comparable && (coverageLimits.length > 0 || alignment.status === 'COMPARABLE_WITH_AS_OF_LIMITATION') ? 'COMPARABLE_WITH_LIMITATIONS' : comparabilityStatus,
    comparabilityReasons: reasons,
    cohortRelationship: classifyAgentCohortRelationship(input.normalized[0], input.normalized[1]),
    coverage,
    observationAsOf: Object.freeze(input.artifacts.map((artifact) => artifact.asOf)),
    asOfAlignment: alignment,
    sourceScope: 'CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION',
    analyticalGrain: 'MLS_LISTING',
    temporalBasis: 'OBSERVATION_AS_OF_TIMESTAMP',
    periodForm: 'AS_OF_INSTANT_SNAPSHOT',
    calculationVersion: AGENT_COHORT_AGGREGATION_VERSION,
    audience: 'AGENT_ONLY',
    limitations,
    createdAt: input.requestAsOf,
  });
}

export async function compareAgentCurrentSnapshotCohorts(request: AgentComparisonRequest): Promise<AgentCurrentSnapshotComparisonResponse> {
  const requestAsOf = nowIso(request.requestAsOf);
  const audience = request.audience ?? 'AGENT_ONLY';
  const { admittedMetricIds, rejectedMetricIds } = normalizeAgentCohortMetricIds(request.metricIds);
  const metricIds = admittedMetricIds.length ? admittedMetricIds : AGENT_COHORT_METRIC_IDS;
  const { requestedOperations, rejectedOperations } = normalizeAgentComparisonOperations(request.requestedOperations);
  const normalizedOnly = request.cohorts.map((cohort) => normalizeAgentCohortDefinition(cohort.cohort));
  const invalidIndexes = new Set(normalizedOnly.map((cohort, index) => cohort.validation.ready ? null : index).filter((index): index is number => index !== null));
  const validRequests = request.cohorts.filter((_, index) => !invalidIndexes.has(index));
  const validNormalized = normalizedOnly.filter((_, index) => !invalidIndexes.has(index));
  const requestRejections = [
    (request.cohorts.length < 2 || request.cohorts.length > 6) && 'COHORT_COUNT_OUT_OF_BOUNDS',
    audience !== 'AGENT_ONLY' && 'RIGHTS_INCOMPATIBLE',
    rejectedMetricIds.length > 0 && 'UNSUPPORTED_METRIC_ID',
    rejectedOperations.length > 0 && 'UNSUPPORTED_OPERATION',
    validRequests.length < 2 && invalidIndexes.size > 0 && 'FEWER_THAN_TWO_VALID_COHORTS',
  ].filter(Boolean) as string[];

  if (requestRejections.length > 0) {
    return Object.freeze({
      status: 'NOT_AVAILABLE',
      overallComparabilityStatus: audience !== 'AGENT_ONLY' ? 'RIGHTS_BLOCKED' : 'NOT_COMPARABLE',
      certification: CURRENT_SNAPSHOT_COMPARATIVE_INTELLIGENCE_WAVE_3_STATUS,
      cohortNCertification: COHORT_N_MULTI_MARKET_COMPARATIVE_INTELLIGENCE_WAVE_5_STATUS,
      cohortNReadiness: 'COHORT_N_RUNTIME_READY',
      requestAsOf,
      cohorts: Object.freeze(normalizedOnly.map((normalized, index) => Object.freeze({
        label: request.cohorts[index]?.label ?? `Cohort ${index + 1}`,
        status: normalized.validation.ready ? 'NOT_AVAILABLE' as const : 'INVALID_COHORT' as const,
        normalized,
        rejectionReasons: normalized.validation.ready ? Object.freeze([]) : normalized.validation.reasons,
      }))),
      rejectedMetricIds,
      rejectedOperations,
      results: Object.freeze([]),
      rejectionReasons: Object.freeze([...new Set([
        ...requestRejections,
        ...normalizedOnly.flatMap((cohort, index) => cohort.validation.ready ? [] : cohort.validation.reasons.map((reason) => `COHORT_${index + 1}:${reason}`)),
      ])].sort()),
    });
  }

  const aggregations = await Promise.all(validRequests.map((cohort) => aggregateAgentCohort(cohort.cohort, metricIds)));
  const validOriginalIndexes = request.cohorts.map((_, index) => index).filter((index) => !invalidIndexes.has(index));
  const aggregationRejections = aggregations.flatMap((aggregation, index) => aggregation.status === 'READY' ? [] : [`COHORT_${validOriginalIndexes[index] + 1}:AGGREGATION_NOT_AVAILABLE`]);
  const readyAggregations = aggregations.filter((aggregation) => aggregation.status === 'READY');
  if (readyAggregations.length < 2) {
    return Object.freeze({
      status: 'NOT_AVAILABLE',
      overallComparabilityStatus: 'EVIDENCE_INSUFFICIENT',
      certification: CURRENT_SNAPSHOT_COMPARATIVE_INTELLIGENCE_WAVE_3_STATUS,
      cohortNCertification: COHORT_N_MULTI_MARKET_COMPARATIVE_INTELLIGENCE_WAVE_5_STATUS,
      cohortNReadiness: 'COHORT_N_RUNTIME_READY',
      requestAsOf,
      cohorts: Object.freeze([
        ...aggregations.map((aggregation, index) => Object.freeze({ label: validRequests[index].label, status: aggregation.status, normalized: aggregation.normalized, rejectionReasons: aggregation.status === 'READY' ? Object.freeze([]) : Object.freeze(['AGGREGATION_NOT_AVAILABLE']) })),
        ...normalizedOnly.flatMap((normalized, index) => invalidIndexes.has(index) ? [Object.freeze({ label: request.cohorts[index].label, status: 'INVALID_COHORT' as const, normalized, rejectionReasons: normalized.validation.reasons })] : []),
      ]),
      rejectedMetricIds,
      rejectedOperations,
      results: Object.freeze([]),
      rejectionReasons: Object.freeze(aggregationRejections),
    });
  }

  const readyRequests = validRequests.filter((_, index) => aggregations[index].status === 'READY');
  const results = metricIds.map((metricId) => {
    const artifacts = readyAggregations.map((aggregation) => aggregation.artifacts.find((artifact) => artifact.metricId === metricId)).filter((artifact): artifact is AgentCohortMetricArtifact => Boolean(artifact));
    return compareAgentCurrentSnapshotMetricArtifacts({ metricId, artifacts, cohorts: readyRequests, normalized: readyAggregations.map((item) => item.normalized), requestedOperations, requestAsOf });
  });
  const partialRejections = Object.freeze([
    ...normalizedOnly.flatMap((cohort, index) => cohort.validation.ready ? [] : cohort.validation.reasons.map((reason) => `COHORT_${index + 1}:${reason}`)),
    ...aggregationRejections,
  ].sort());
  return Object.freeze({
    status: 'READY',
    overallComparabilityStatus: partialRejections.length ? 'PARTIAL' : results.some((result) => result.comparabilityStatus === 'COMPARABLE_WITH_LIMITATIONS') ? 'COMPARABLE_WITH_LIMITATIONS' : 'COMPARABLE',
    certification: CURRENT_SNAPSHOT_COMPARATIVE_INTELLIGENCE_WAVE_3_STATUS,
    cohortNCertification: COHORT_N_MULTI_MARKET_COMPARATIVE_INTELLIGENCE_WAVE_5_STATUS,
    cohortNReadiness: 'COHORT_N_RUNTIME_READY',
    requestAsOf,
    cohorts: Object.freeze(request.cohorts.map((cohort, index) => {
      if (invalidIndexes.has(index)) return Object.freeze({ label: cohort.label, status: 'INVALID_COHORT' as const, normalized: normalizedOnly[index], rejectionReasons: normalizedOnly[index].validation.reasons });
      const validIndex = validNormalized.indexOf(normalizedOnly[index]);
      const aggregation = aggregations[validIndex];
      return Object.freeze({ label: cohort.label, status: aggregation.status, normalized: aggregation.normalized, rejectionReasons: aggregation.status === 'READY' ? Object.freeze([]) : Object.freeze(['AGGREGATION_NOT_AVAILABLE']) });
    })),
    rejectedMetricIds,
    rejectedOperations,
    results: Object.freeze(results),
    rejectionReasons: partialRejections,
  });
}

export function parseAgentComparisonSearchParams(searchParams: URLSearchParams): AgentComparisonRequest {
  const cohortCountValue = searchParams.get('cohortCount');
  const cohortCount = cohortCountValue ? Number(cohortCountValue) : null;
  if (Number.isInteger(cohortCount) && cohortCount !== null) {
    const cohorts = Array.from({ length: cohortCount }, (_, index): AgentComparisonCohortInput => {
      const filters: Partial<Record<AgentCohortFilterKey, string>> = {};
      for (const key of AGENT_COHORT_SUPPORTED_FILTER_KEYS) {
        const value = searchParams.get(`cohort.${index}.${key}`);
        if (value !== null) filters[key] = value;
      }
      return Object.freeze({
        label: searchParams.get(`cohort.${index}.label`) || `Cohort ${index + 1}`,
        surface: searchParams.get(`cohort.${index}.surface`),
        cohort: Object.freeze({
          purpose: searchParams.get('purpose') || 'Agent current-snapshot multi-cohort comparative preparation cohort.',
          filters,
          intervals: Object.freeze({
            price: Object.freeze({ boundary: searchParams.get(`cohort.${index}.priceInterval`) }),
            sqft: Object.freeze({ boundary: searchParams.get(`cohort.${index}.sqftInterval`) }),
            yearBuilt: Object.freeze({ boundary: searchParams.get(`cohort.${index}.yearBuiltInterval`) }),
            beds: Object.freeze({ boundary: searchParams.get(`cohort.${index}.bedsInterval`) }),
            baths: Object.freeze({ boundary: searchParams.get(`cohort.${index}.bathsInterval`) }),
          }),
          unsupportedFilters: searchParams.getAll(`cohort.${index}.unsupportedFilter`),
          analyticalGrain: searchParams.get(`cohort.${index}.analyticalGrain`),
          temporalBasis: searchParams.get(`cohort.${index}.temporalBasis`),
          periodForm: searchParams.get(`cohort.${index}.periodForm`),
          scenarioBoundary: searchParams.get(`cohort.${index}.scenarioBoundary`),
          asOf: searchParams.get(`cohort.${index}.asOf`),
        }),
      });
    });
    return Object.freeze({
      cohorts: Object.freeze(cohorts),
      metricIds: Object.freeze(searchParams.getAll('metricId')),
      requestedOperations: Object.freeze(searchParams.getAll('operation') as AgentComparisonOperation[]),
      audience: (searchParams.get('audience') as AtlasAudienceOutput | null) ?? 'AGENT_ONLY',
      requestAsOf: searchParams.get('requestAsOf'),
    });
  }
  const cohortFromPrefix = (prefix: 'a' | 'b'): AgentComparisonCohortInput => {
    const filters: Partial<Record<AgentCohortFilterKey, string>> = {};
    for (const key of AGENT_COHORT_SUPPORTED_FILTER_KEYS) {
      const value = searchParams.get(`${prefix}.${key}`);
      if (value !== null) filters[key] = value;
    }
    return Object.freeze({
      label: searchParams.get(`${prefix}.label`) || (prefix === 'a' ? 'Cohort A' : 'Cohort B'),
      cohort: Object.freeze({
        purpose: searchParams.get('purpose') || 'Agent current-snapshot comparative preparation cohort.',
        filters,
        intervals: Object.freeze({
          price: Object.freeze({ boundary: searchParams.get(`${prefix}.priceInterval`) }),
          sqft: Object.freeze({ boundary: searchParams.get(`${prefix}.sqftInterval`) }),
          yearBuilt: Object.freeze({ boundary: searchParams.get(`${prefix}.yearBuiltInterval`) }),
          beds: Object.freeze({ boundary: searchParams.get(`${prefix}.bedsInterval`) }),
          baths: Object.freeze({ boundary: searchParams.get(`${prefix}.bathsInterval`) }),
        }),
        unsupportedFilters: searchParams.getAll(`${prefix}.unsupportedFilter`),
        analyticalGrain: searchParams.get(`${prefix}.analyticalGrain`),
        temporalBasis: searchParams.get(`${prefix}.temporalBasis`),
        periodForm: searchParams.get(`${prefix}.periodForm`),
        scenarioBoundary: searchParams.get(`${prefix}.scenarioBoundary`),
        asOf: searchParams.get(`${prefix}.asOf`),
      }),
    });
  };
  return Object.freeze({
    cohorts: Object.freeze([cohortFromPrefix('a'), cohortFromPrefix('b')]),
    metricIds: Object.freeze(searchParams.getAll('metricId')),
    requestedOperations: Object.freeze(searchParams.getAll('operation') as AgentComparisonOperation[]),
    audience: (searchParams.get('audience') as AtlasAudienceOutput | null) ?? 'AGENT_ONLY',
    requestAsOf: searchParams.get('requestAsOf'),
  });
}
