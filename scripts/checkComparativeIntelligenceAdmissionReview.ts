import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  COMPARATIVE_ADMISSION_PROTECTED_BOUNDARIES,
  CURRENT_SNAPSHOT_COMPARATIVE_ADMISSION_NEXT_GATE,
  CURRENT_SNAPSHOT_COMPARATIVE_ADMISSION_REVIEW_STATUS,
  CURRENT_SNAPSHOT_COMPARATIVE_ADMISSION_VERSION,
  CURRENT_SNAPSHOT_COMPARISON_FAMILIES,
  CURRENT_SNAPSHOT_COMPARISON_OPERATION_POLICY,
  CURRENT_SNAPSHOT_COMPARISON_READINESS_MATRIX,
  evaluateComparativeAdmissionFixture,
  type ComparativeAdmissionFixture,
} from '../lib/agentComparativeAdmissionReview';

assert.equal(CURRENT_SNAPSHOT_COMPARATIVE_ADMISSION_REVIEW_STATUS, 'CURRENT_SNAPSHOT_COMPARATIVE_INTELLIGENCE_FOUNDATION_ADMITTED');
assert.equal(CURRENT_SNAPSHOT_COMPARATIVE_ADMISSION_NEXT_GATE, 'READY_FOR_CURRENT_SNAPSHOT_COMPARATIVE_INTELLIGENCE_BOUNDED_IMPLEMENTATION_WAVE_3');
assert.equal(CURRENT_SNAPSHOT_COMPARATIVE_ADMISSION_VERSION, 'CURRENT_SNAPSHOT_COMPARATIVE_ADMISSION_REVIEW_V1');

for (const family of ['CITY_VS_CITY_CURRENT_SNAPSHOT', 'SEGMENT_VS_SEGMENT_CURRENT_SNAPSHOT', 'SUBSEGMENT_VS_PARENT_CURRENT_SNAPSHOT', 'PROPERTY_CHARACTERISTIC_SEGMENT_CURRENT_SNAPSHOT', 'MULTI_COHORT_CURRENT_SNAPSHOT']) {
  assert(CURRENT_SNAPSHOT_COMPARISON_FAMILIES.includes(family as never), `Missing family ${family}`);
}

const base: ComparativeAdmissionFixture = Object.freeze({
  metricId: 'agent.cohort.current-asking-list-price-median.v1',
  metricVersion: 'AGENT_COHORT_BASIC_AGGREGATION_V1',
  comparisonMetricId: 'agent.cohort.current-asking-list-price-median.v1',
  comparisonMetricVersion: 'AGENT_COHORT_BASIC_AGGREGATION_V1',
  analyticalGrain: 'MLS_LISTING',
  comparisonAnalyticalGrain: 'MLS_LISTING',
  sourceScope: 'CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION',
  comparisonSourceScope: 'CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION',
  temporalBasis: 'OBSERVATION_AS_OF_TIMESTAMP',
  comparisonTemporalBasis: 'OBSERVATION_AS_OF_TIMESTAMP',
  periodForm: 'AS_OF_INSTANT_SNAPSHOT',
  comparisonPeriodForm: 'AS_OF_INSTANT_SNAPSHOT',
  fieldBasis: 'price',
  comparisonFieldBasis: 'price',
  calculationVersion: 'AGENT_COHORT_BASIC_AGGREGATION_V1',
  comparisonCalculationVersion: 'AGENT_COHORT_BASIC_AGGREGATION_V1',
  artifactState: 'READY',
  comparisonArtifactState: 'READY',
  rights: 'AGENT_ONLY',
  comparisonRights: 'AGENT_ONLY',
  cohortRelationship: 'DISJOINT',
  scenarioClass: 'OBSERVED_CURRENT_SNAPSHOT',
});

assert.deepEqual(evaluateComparativeAdmissionFixture(base), {
  admissible: true,
  state: 'COMPARISON_ADMISSIBLE_WITH_LIMITATIONS',
  reasons: [],
});
assert(evaluateComparativeAdmissionFixture({ ...base, comparisonMetricVersion: 'OTHER_VERSION' }).reasons.includes('METRIC_VERSION_MISMATCH'));
assert(evaluateComparativeAdmissionFixture({ ...base, comparisonAnalyticalGrain: 'PHYSICAL_PROPERTY' }).reasons.includes('GRAIN_MISMATCH'));
assert(evaluateComparativeAdmissionFixture({ ...base, comparisonSourceScope: 'IRES_NATIVE_EXPORT' }).reasons.includes('SOURCE_SCOPE_MISMATCH'));
assert(evaluateComparativeAdmissionFixture({ ...base, comparisonTemporalBasis: 'CLOSE_SOLD_DATE' }).reasons.includes('TEMPORAL_BASIS_MISMATCH'));
assert(evaluateComparativeAdmissionFixture({ ...base, comparisonMetricId: 'agent.cohort.sale-price-median.v1', comparisonFieldBasis: 'salePrice' }).reasons.includes('METRIC_ID_MISMATCH'));
assert.equal(evaluateComparativeAdmissionFixture({ ...base, cohortRelationship: 'DISJOINT' }).admissible, true);
assert.equal(evaluateComparativeAdmissionFixture({ ...base, cohortRelationship: 'SUBSET' }).admissible, true);
assert(evaluateComparativeAdmissionFixture({ ...base, comparisonArtifactState: 'NO_DATA' }).reasons.includes('RIGHT_ARTIFACT_NO_DATA'));
assert(evaluateComparativeAdmissionFixture({ ...base, comparisonRights: 'PUBLIC' }).reasons.includes('RIGHT_RIGHTS_NOT_AGENT_ONLY'));
assert(evaluateComparativeAdmissionFixture({ ...base, scenarioClass: 'HISTORICAL', comparisonTemporalBasis: 'LISTING_DATE', comparisonPeriodForm: 'CUSTOM_BOUNDED_PERIOD' }).reasons.includes('OBSERVATION_CLASS_NOT_CURRENT_SNAPSHOT'));

const countPolicy = CURRENT_SNAPSHOT_COMPARISON_OPERATION_POLICY['agent.cohort.current-mls-listing-record-count.v1'];
assert(countPolicy.includes('SIDE_BY_SIDE_ONLY'));
assert(countPolicy.includes('ABSOLUTE_DELTA_ALLOWED'));
assert(countPolicy.includes('PERCENTAGE_DELTA_ALLOWED'));
assert(countPolicy.includes('RANK_ALLOWED'));
assert(CURRENT_SNAPSHOT_COMPARISON_OPERATION_POLICY['agent.cohort.year-built-median.v1'].includes('ABSOLUTE_DELTA_ALLOWED'));
assert.equal(CURRENT_SNAPSHOT_COMPARISON_OPERATION_POLICY['agent.cohort.year-built-median.v1'].includes('PERCENTAGE_DELTA_ALLOWED'), false);

assert(CURRENT_SNAPSHOT_COMPARISON_READINESS_MATRIX.some((item) => item.capability === 'city vs city current asking/list-price median' && item.state === 'READY_NOW_FOR_BOUNDED_IMPLEMENTATION'));
assert(CURRENT_SNAPSHOT_COMPARISON_READINESS_MATRIX.some((item) => item.capability === 'multi-city side-by-side' && item.state === 'READY_AFTER_SMALL_REPOSITORY_LOCAL_FOUNDATION'));
assert(CURRENT_SNAPSHOT_COMPARISON_READINESS_MATRIX.some((item) => item.capability === 'MoM/QoQ/YoY/YTD/rolling periods' && item.state === 'BLOCKED_BY_HISTORICAL_DATA'));
assert(CURRENT_SNAPSHOT_COMPARISON_READINESS_MATRIX.some((item) => item.capability === 'seller pricing comparison' && item.state === 'BLOCKED_BY_METHODOLOGY'));

assert.equal(Object.values(COMPARATIVE_ADMISSION_PROTECTED_BOUNDARIES).every((value) => value === false), true);

const source = fs.readFileSync('lib/agentComparativeAdmissionReview.ts', 'utf8');
assert.doesNotMatch(source, /prisma\.|PrismaClient|fetch\(|process\.env|NextResponse|useState|calculateAtlasComparativeResult|percentageDelta|absoluteDelta =|new Typesense|sendEmail|CRMTask|supabase/i, 'Admission review must remain inert and must not implement runtime comparison.');

const doc = fs.readFileSync('docs/project-atlas/executive-library/COMPARATIVE-INTELLIGENCE-FOUNDATION-ADMISSION-REVIEW.md', 'utf8');
for (const required of [
  'Track A current-snapshot findings',
  'Track B historical/temporal findings',
  'Per-metric allowed comparison operations',
  'IRES Compare Two Years',
  'READY_FOR_CURRENT_SNAPSHOT_COMPARATIVE_INTELLIGENCE_BOUNDED_IMPLEMENTATION_WAVE_3',
]) {
  assert(doc.includes(required), `Admission review doc missing ${required}`);
}

console.log('COMPARATIVE_INTELLIGENCE_FOUNDATION_ADMISSION_REVIEW_CHECK: PASS');
