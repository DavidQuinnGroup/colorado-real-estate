import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  AGENT_COHORT_ADMITTED_METRICS,
  AGENT_COHORT_AGGREGATION_VERSION,
  type AgentCohortMetricArtifact,
  type AgentCohortMetricId,
} from '../lib/agentCohortAggregation';
import { normalizeAgentCohortDefinition, type AgentCohortInput } from '../lib/agentCohortBuilder';
import { mapBuyerCriteriaToAgentCohort } from '../lib/agentBuyerCriteriaComparisonAdapter';
import { AGENT_COMPARISON_SURFACE_CONFIGS } from '../lib/agentCurrentSnapshotComparisonSurfaceConfig';
import {
  AGENT_CURRENT_SNAPSHOT_COMPARISON_VERSION,
  COHORT_N_MULTI_MARKET_COMPARATIVE_INTELLIGENCE_NEXT_GATE,
  COHORT_N_MULTI_MARKET_COMPARATIVE_INTELLIGENCE_WAVE_5_STATUS,
  classifyAgentCohortRelationship,
  compareAgentCurrentSnapshotCohorts,
  compareAgentCurrentSnapshotMetricArtifacts,
  parseAgentComparisonSearchParams,
} from '../lib/agentCurrentSnapshotComparison';
import { createPropertyCriteriaProfile, updatePropertyCriteriaChoice, updatePropertyCriteriaRange } from '../lib/agent-advisory-workbench/propertyCriteriaProfile';

const source = (path: string) => fs.readFileSync(path, 'utf8');

const cohortInput = (city: string, extra: AgentCohortInput['filters'] = {}, interval = 'CLOSED'): AgentCohortInput => Object.freeze({
  purpose: 'Wave 5 deterministic cohort-N comparison check',
  filters: Object.freeze({ city, propertyType: 'Residential', statusScope: 'Active', ...extra }),
  intervals: Object.freeze({ price: Object.freeze({ boundary: interval }) }),
  asOf: '2026-08-25T12:00:00.000Z',
});

const normalized = {
  boulder: normalizeAgentCohortDefinition(cohortInput('Boulder')),
  louisville: normalizeAgentCohortDefinition(cohortInput('Louisville')),
  lafayette: normalizeAgentCohortDefinition(cohortInput('Lafayette')),
  lowBand: normalizeAgentCohortDefinition(cohortInput('Boulder', { priceMin: 500000, priceMax: 1000000 }, 'LOWER_INCLUSIVE_UPPER_EXCLUSIVE')),
  midBand: normalizeAgentCohortDefinition(cohortInput('Boulder', { priceMin: 1000000, priceMax: 1500000 }, 'LOWER_INCLUSIVE_UPPER_EXCLUSIVE')),
  highBand: normalizeAgentCohortDefinition(cohortInput('Boulder', { priceMin: 1500000, priceMax: 2000000 }, 'LOWER_INCLUSIVE_UPPER_EXCLUSIVE')),
};

function metricArtifact(metricId: AgentCohortMetricId, value: number | null, cohort = normalized.boulder, overrides: Partial<AgentCohortMetricArtifact> = {}): AgentCohortMetricArtifact {
  const metric = AGENT_COHORT_ADMITTED_METRICS[metricId];
  const included = value === null && metric.aggregation !== 'COUNT' ? 0 : 8;
  return Object.freeze({
    metricId,
    label: metric.label,
    state: value === null && metric.aggregation !== 'COUNT' ? 'NO_DATA' : 'READY',
    value,
    unit: metric.unit,
    aggregation: metric.aggregation,
    fieldBasis: metric.fieldBasis,
    calculationVersion: AGENT_COHORT_AGGREGATION_VERSION,
    cohortDefinitionId: cohort.cohort.cohortDefinitionId,
    cohortDefinitionVersion: cohort.cohort.cohortDefinitionVersion,
    analyticalGrain: 'MLS_LISTING',
    sourceScope: 'CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION',
    temporalBasis: 'OBSERVATION_AS_OF_TIMESTAMP',
    periodForm: 'AS_OF_INSTANT_SNAPSHOT',
    asOf: cohort.cohort.period.asOf ?? '2026-08-25T12:00:00.000Z',
    eligibleCohortCount: 10,
    includedPopulationCount: metric.aggregation === 'COUNT' ? 10 : included,
    nullMissingCount: metric.aggregation === 'COUNT' ? 0 : 10 - included,
    excludedPopulationCount: metric.aggregation === 'COUNT' ? 0 : 10 - included,
    audience: 'AGENT_ONLY',
    rights: Object.freeze({ agentOnly: 'PERMITTED', publicDisplay: 'BLOCKED', clientReport: 'BLOCKED', export: 'BLOCKED' }),
    limitations: metric.limitations,
    provenance: Object.freeze(['scripts/checkCohortNMultiMarketComparativeIntelligenceWave5.ts']),
    ...overrides,
  });
}

function compareN(values: readonly (number | null)[]) {
  const metricId = 'agent.cohort.current-mls-listing-record-count.v1';
  return compareAgentCurrentSnapshotMetricArtifacts({
    metricId,
    artifacts: Object.freeze(values.map((value, index) => metricArtifact(metricId, value, [normalized.boulder, normalized.louisville, normalized.lafayette, normalized.lowBand, normalized.midBand, normalized.highBand][index] ?? normalized.boulder))),
    cohorts: Object.freeze(values.map((_, index) => ({ label: `Cohort ${index + 1}`, cohort: cohortInput(['Boulder', 'Louisville', 'Lafayette', 'Boulder', 'Boulder', 'Boulder'][index] ?? 'Boulder') }))),
    normalized: Object.freeze([normalized.boulder, normalized.louisville, normalized.lafayette, normalized.lowBand, normalized.midBand, normalized.highBand].slice(0, values.length)),
    requestedOperations: Object.freeze(['SIDE_BY_SIDE', 'ABSOLUTE_DELTA', 'PERCENTAGE_DELTA', 'DIRECTION', 'RANK']),
    requestAsOf: '2026-08-25T12:00:00.000Z',
  });
}

async function main() {
  assert.equal(COHORT_N_MULTI_MARKET_COMPARATIVE_INTELLIGENCE_WAVE_5_STATUS, 'COHORT_N_MULTI_MARKET_COMPARATIVE_INTELLIGENCE_BOUNDED_IMPLEMENTATION_WAVE_5_CERTIFIED');
  assert.equal(COHORT_N_MULTI_MARKET_COMPARATIVE_INTELLIGENCE_NEXT_GATE, 'READY_FOR_ADVANCED_SEGMENTATION_HISTORICAL_EVIDENCE_AND_SUBJECT_PROPERTY_BENCHMARK_AUTHORIZATION');
  assert.equal(AGENT_CURRENT_SNAPSHOT_COMPARISON_VERSION, 'AGENT_CURRENT_SNAPSHOT_COMPARISON_V1');

  const parsed2 = parseAgentComparisonSearchParams(new URLSearchParams('cohortCount=2&cohort.0.city=boulder&cohort.0.propertyType=residential&cohort.0.statusScope=active&cohort.0.label=Boulder&cohort.1.city=louisville&cohort.1.propertyType=residential&cohort.1.statusScope=active&cohort.1.label=Louisville'));
  const parsed3 = parseAgentComparisonSearchParams(new URLSearchParams('cohortCount=3&cohort.0.city=boulder&cohort.0.propertyType=residential&cohort.0.statusScope=active&cohort.0.label=Boulder&cohort.1.city=louisville&cohort.1.propertyType=residential&cohort.1.statusScope=active&cohort.1.label=Louisville&cohort.2.city=lafayette&cohort.2.propertyType=residential&cohort.2.statusScope=active&cohort.2.label=Lafayette'));
  const parsed6 = parseAgentComparisonSearchParams(new URLSearchParams('cohortCount=6&cohort.0.city=boulder&cohort.0.propertyType=residential&cohort.0.statusScope=active&cohort.1.city=louisville&cohort.1.propertyType=residential&cohort.1.statusScope=active&cohort.2.city=lafayette&cohort.2.propertyType=residential&cohort.2.statusScope=active&cohort.3.city=superior&cohort.3.propertyType=residential&cohort.3.statusScope=active&cohort.4.city=erie&cohort.4.propertyType=residential&cohort.4.statusScope=active&cohort.5.city=longmont&cohort.5.propertyType=residential&cohort.5.statusScope=active'));
  assert.equal(parsed2.cohorts.length, 2);
  assert.equal(parsed3.cohorts.length, 3);
  assert.equal(parsed6.cohorts.length, 6);
  assert.deepEqual(parsed3.cohorts.map((cohort) => cohort.label), ['Boulder', 'Louisville', 'Lafayette']);
  assert.equal(parsed3.cohorts[0].cohort.filters.city, 'boulder');
  assert.equal(parsed3.cohorts[1].cohort.filters.city, 'louisville');
  assert.equal(parsed3.cohorts[2].cohort.filters.city, 'lafayette');

  const tooFew = await compareAgentCurrentSnapshotCohorts({ cohorts: Object.freeze([parsed2.cohorts[0]]), requestAsOf: '2026-08-25T12:00:00.000Z' });
  assert.equal(tooFew.status, 'NOT_AVAILABLE');
  assert(tooFew.rejectionReasons.includes('COHORT_COUNT_OUT_OF_BOUNDS'));
  const tooMany = await compareAgentCurrentSnapshotCohorts({ cohorts: Object.freeze([...parsed6.cohorts, parsed2.cohorts[0]]), requestAsOf: '2026-08-25T12:00:00.000Z' });
  assert.equal(tooMany.status, 'NOT_AVAILABLE');
  assert(tooMany.rejectionReasons.includes('COHORT_COUNT_OUT_OF_BOUNDS'));
  const publicAudience = await compareAgentCurrentSnapshotCohorts({ ...parsed2, audience: 'PUBLIC' as never, requestAsOf: '2026-08-25T12:00:00.000Z' });
  assert.equal(publicAudience.overallComparabilityStatus, 'RIGHTS_BLOCKED');
  assert(publicAudience.rejectionReasons.includes('RIGHTS_INCOMPATIBLE'));
  const unsupportedMetric = await compareAgentCurrentSnapshotCohorts({ ...parsed2, metricIds: Object.freeze(['agent.cohort.dom-median.v1']), requestAsOf: '2026-08-25T12:00:00.000Z' });
  assert.equal(unsupportedMetric.status, 'NOT_AVAILABLE');
  assert(unsupportedMetric.rejectionReasons.includes('UNSUPPORTED_METRIC_ID'));
  const unsupportedOperation = await compareAgentCurrentSnapshotCohorts({ ...parsed2, requestedOperations: Object.freeze(['DOM_AVERAGE' as never]), requestAsOf: '2026-08-25T12:00:00.000Z' });
  assert.equal(unsupportedOperation.status, 'NOT_AVAILABLE');
  assert(unsupportedOperation.rejectionReasons.includes('UNSUPPORTED_OPERATION'));

  const invalidMiddle = parseAgentComparisonSearchParams(new URLSearchParams('cohortCount=3&cohort.0.city=boulder&cohort.0.propertyType=residential&cohort.0.statusScope=active&cohort.1.city=aurora&cohort.1.propertyType=residential&cohort.1.statusScope=active&cohort.2.city=lafayette&cohort.2.propertyType=residential&cohort.2.statusScope=active'));
  assert.equal(normalizeAgentCohortDefinition(invalidMiddle.cohorts[1].cohort).validation.ready, false);
  const historical = parseAgentComparisonSearchParams(new URLSearchParams('cohortCount=3&cohort.0.city=boulder&cohort.0.propertyType=residential&cohort.0.statusScope=active&cohort.1.city=louisville&cohort.1.propertyType=residential&cohort.1.statusScope=active&cohort.2.city=lafayette&cohort.2.propertyType=residential&cohort.2.statusScope=active&cohort.2.temporalBasis=CLOSE_SOLD_DATE'));
  assert.equal(normalizeAgentCohortDefinition(historical.cohorts[2].cohort).validation.reasons.includes('FILTER_REJECTED:temporalBasis'), true);
  const scenario = parseAgentComparisonSearchParams(new URLSearchParams('cohortCount=2&cohort.0.city=boulder&cohort.0.propertyType=residential&cohort.0.statusScope=active&cohort.1.city=louisville&cohort.1.propertyType=residential&cohort.1.statusScope=active&cohort.1.scenarioBoundary=HYPOTHETICAL'));
  const fewerThanTwoValid = await compareAgentCurrentSnapshotCohorts(scenario);
  assert.equal(fewerThanTwoValid.status, 'NOT_AVAILABLE');
  assert(fewerThanTwoValid.rejectionReasons.includes('FEWER_THAN_TWO_VALID_COHORTS'));
  assert(fewerThanTwoValid.cohorts.some((cohort) => cohort.status === 'INVALID_COHORT'));

  const rankResult = compareN([12, 8, 12, 0, null]);
  assert.equal(rankResult.cohortLabels.length, 5);
  assert.deepEqual(rankResult.values, [12, 8, 12, 0, null]);
  assert.deepEqual(rankResult.ranks, [1, 2, 1, 3, null]);
  assert.equal(rankResult.percentageDelta, 0.5);
  const zeroBaseline = compareN([7, 0, 3]);
  assert.equal(zeroBaseline.percentageDelta, null);
  assert(zeroBaseline.limitations.some((item) => item.includes('baseline is zero')));
  const noData = compareAgentCurrentSnapshotMetricArtifacts({
    metricId: 'agent.cohort.current-asking-list-price-median.v1',
    artifacts: Object.freeze([
      metricArtifact('agent.cohort.current-asking-list-price-median.v1', 900000, normalized.boulder),
      metricArtifact('agent.cohort.current-asking-list-price-median.v1', null, normalized.louisville),
      metricArtifact('agent.cohort.current-asking-list-price-median.v1', 875000, normalized.lafayette),
    ]),
    cohorts: Object.freeze([{ label: 'Boulder', cohort: cohortInput('Boulder') }, { label: 'Louisville', cohort: cohortInput('Louisville') }, { label: 'Lafayette', cohort: cohortInput('Lafayette') }]),
    normalized: Object.freeze([normalized.boulder, normalized.louisville, normalized.lafayette]),
    requestedOperations: Object.freeze(['SIDE_BY_SIDE', 'ABSOLUTE_DELTA', 'PERCENTAGE_DELTA', 'DIRECTION', 'RANK']),
    requestAsOf: '2026-08-25T12:00:00.000Z',
  });
  assert.equal(noData.comparabilityStatus, 'NOT_COMPARABLE');
  assert(noData.comparabilityReasons.includes('COHORT_2:ARTIFACT_NO_DATA'));
  const incompatible = compareAgentCurrentSnapshotMetricArtifacts({
    metricId: 'agent.cohort.current-asking-list-price-median.v1',
    artifacts: Object.freeze([
      metricArtifact('agent.cohort.current-asking-list-price-median.v1', 900000, normalized.boulder),
      metricArtifact('agent.cohort.current-asking-list-price-median.v1', 875000, normalized.louisville, { calculationVersion: 'OTHER_VERSION' as never }),
      metricArtifact('agent.cohort.current-asking-list-price-median.v1', 925000, normalized.lafayette, { sourceScope: 'IRES_NATIVE_EXPORT' as never }),
    ]),
    cohorts: Object.freeze([{ label: 'Boulder', cohort: cohortInput('Boulder') }, { label: 'Louisville', cohort: cohortInput('Louisville') }, { label: 'Lafayette', cohort: cohortInput('Lafayette') }]),
    normalized: Object.freeze([normalized.boulder, normalized.louisville, normalized.lafayette]),
    requestedOperations: Object.freeze(['SIDE_BY_SIDE', 'ABSOLUTE_DELTA', 'PERCENTAGE_DELTA', 'DIRECTION', 'RANK']),
    requestAsOf: '2026-08-25T12:00:00.000Z',
  });
  assert(incompatible.comparabilityReasons.includes('COHORT_2:CALCULATION_VERSION_MISMATCH'));
  assert(incompatible.comparabilityReasons.includes('COHORT_3:SOURCE_SCOPE_MISMATCH'));
  const publicArtifact = compareAgentCurrentSnapshotMetricArtifacts({
    metricId: 'agent.cohort.current-asking-list-price-median.v1',
    artifacts: Object.freeze([
      metricArtifact('agent.cohort.current-asking-list-price-median.v1', 900000, normalized.boulder),
      metricArtifact('agent.cohort.current-asking-list-price-median.v1', 875000, normalized.louisville, { audience: 'PUBLIC' as never }),
    ]),
    cohorts: Object.freeze([{ label: 'Boulder', cohort: cohortInput('Boulder') }, { label: 'Louisville', cohort: cohortInput('Louisville') }]),
    normalized: Object.freeze([normalized.boulder, normalized.louisville]),
    requestedOperations: Object.freeze(['SIDE_BY_SIDE', 'ABSOLUTE_DELTA', 'PERCENTAGE_DELTA', 'DIRECTION', 'RANK']),
    requestAsOf: '2026-08-25T12:00:00.000Z',
  });
  assert.equal(publicArtifact.comparabilityStatus, 'RIGHTS_BLOCKED');
  const skew = compareAgentCurrentSnapshotMetricArtifacts({
    metricId: 'agent.cohort.current-asking-list-price-median.v1',
    artifacts: Object.freeze([
      metricArtifact('agent.cohort.current-asking-list-price-median.v1', 900000, normalized.boulder, { asOf: '2026-08-25T12:00:00.000Z' }),
      metricArtifact('agent.cohort.current-asking-list-price-median.v1', 875000, normalized.louisville, { asOf: '2026-08-25T12:00:03.000Z' }),
      metricArtifact('agent.cohort.current-asking-list-price-median.v1', 925000, normalized.lafayette, { asOf: '2026-08-25T12:00:04.000Z' }),
    ]),
    cohorts: Object.freeze([{ label: 'Boulder', cohort: cohortInput('Boulder') }, { label: 'Louisville', cohort: cohortInput('Louisville') }, { label: 'Lafayette', cohort: cohortInput('Lafayette') }]),
    normalized: Object.freeze([normalized.boulder, normalized.louisville, normalized.lafayette]),
    requestedOperations: Object.freeze(['SIDE_BY_SIDE', 'ABSOLUTE_DELTA', 'PERCENTAGE_DELTA', 'DIRECTION', 'RANK']),
    requestAsOf: '2026-08-25T12:00:00.000Z',
  });
  assert.equal(skew.asOfAlignment.status, 'ALIGNED_WITHIN_SINGLE_REQUEST_TOLERANCE');
  assert.equal(skew.asOfAlignment.observationAsOf.length, 3);

  assert.equal(classifyAgentCohortRelationship(normalized.boulder, normalized.louisville), 'DISJOINT');
  assert.equal(classifyAgentCohortRelationship(normalized.lowBand, normalized.midBand), 'DISJOINT');
  assert.equal(classifyAgentCohortRelationship(normalized.lowBand, normalizeAgentCohortDefinition(cohortInput('Boulder', { priceMin: 900000, priceMax: 1200000 }))), 'OVERLAPPING');

  let buyerProfile = createPropertyCriteriaProfile('BUYER_PREFERENCE');
  buyerProfile = updatePropertyCriteriaRange(buyerProfile, 'bedrooms', { min: 2 });
  buyerProfile = updatePropertyCriteriaRange(buyerProfile, 'bathrooms', { min: 2 });
  buyerProfile = updatePropertyCriteriaRange(buyerProfile, 'squareFeet', { min: 1200, max: 2400 });
  buyerProfile = updatePropertyCriteriaChoice(buyerProfile, 'propertyTypes', ['SINGLE_FAMILY'], 'PREFERRED');
  const buyerMapping = mapBuyerCriteriaToAgentCohort(buyerProfile, AGENT_COMPARISON_SURFACE_CONFIGS.BUYER_PREPARATION.defaultLeft);
  assert.equal(buyerMapping.status, 'READY');
  assert(buyerMapping.mappedCriteria.includes('minimum bedrooms'));
  buyerProfile = updatePropertyCriteriaRange(buyerProfile, 'garageSpaces', { min: 2 });
  const limitedBuyerMapping = mapBuyerCriteriaToAgentCohort(buyerProfile, AGENT_COMPARISON_SURFACE_CONFIGS.BUYER_PREPARATION.defaultLeft);
  assert.equal(limitedBuyerMapping.status, 'LIMITED_BY_UNMAPPED_CRITERIA');
  assert(limitedBuyerMapping.unmappedCriteria.includes('garage or parking spaces'));

  assert.equal(AGENT_COMPARISON_SURFACE_CONFIGS.LOCATION_PREPARATION.defaultCohorts.length, 3);
  assert.deepEqual(AGENT_COMPARISON_SURFACE_CONFIGS.LOCATION_PREPARATION.defaultCohorts.map((cohort) => cohort.city), ['boulder', 'louisville', 'lafayette']);
  assert.equal(AGENT_COMPARISON_SURFACE_CONFIGS.BUYER_PREPARATION.defaultCohorts.length, 3);
  assert.equal(AGENT_COMPARISON_SURFACE_CONFIGS.MARKET_PREPARATION.defaultCohorts.length, 3);

  const ui = source('components/agent/AgentCurrentSnapshotComparison.tsx');
  for (const marker of ['cohortCount', 'cohort.${index}.${key}', 'Add cohort', 'Remove cohort', 'Request order is preserved separately from rank', 'Current snapshot:', 'Rank {metric.ranks[index]}']) assert(ui.includes(marker), `missing UI marker: ${marker}`);
  for (const marker of ['data-agent-comparison-public-output="false"', 'data-agent-comparison-provider-activity="false"', 'data-agent-comparison-persistence="false"', 'data-agent-comparison-historical="false"', 'data-agent-comparison-scenario="false"']) assert(ui.includes(marker), `missing protected marker: ${marker}`);
  assert.doesNotMatch(ui, /Median Sale Price|Market Value|Property Value|better market|hotter|stronger|leverage|appreciating faster|recommend where|recommend that/i);
  const config = source('lib/agentCurrentSnapshotComparisonSurfaceConfig.ts');
  assert.match(config, /defaultCohorts/);
  assert.match(config, /priceMin: 500000, priceMax: 1000000/);
  assert.match(config, /priceMin: 1000000, priceMax: 1500000/);
  assert.match(config, /priceMin: 1500000, priceMax: 2000000/);
  const engine = source('lib/agentCurrentSnapshotComparison.ts');
  for (const marker of ['cohortNCertification', 'COHORT_COUNT_OUT_OF_BOUNDS', 'FEWER_THAN_TWO_VALID_COHORTS', 'INVALID_COHORT', 'PARTIAL', 'COHORT_N_RUNTIME_READY']) assert(engine.includes(marker), `missing engine marker: ${marker}`);
  assert.doesNotMatch(engine, /create\(|upsert\(|deleteMany|createMany|updateMany|new Typesense|sendEmail|CRMTask|supabase/i);
  const route = source('app/api/agent/current-snapshot-comparison/route.ts');
  assert.match(route, /method: 'GET'/);
  assert.doesNotMatch(route, /POST|PUT|PATCH|DELETE/);

  const certification = source('docs/project-atlas/executive-library/COHORT-N-MULTI-MARKET-COMPARATIVE-INTELLIGENCE-BOUNDED-IMPLEMENTATION-WAVE-5-CERTIFICATION.md');
  assert(certification.includes(COHORT_N_MULTI_MARKET_COMPARATIVE_INTELLIGENCE_WAVE_5_STATUS));
  assert(certification.includes('READY_FOR_ADVANCED_SEGMENTATION_HISTORICAL_EVIDENCE_AND_SUBJECT_PROPERTY_BENCHMARK_AUTHORIZATION'));
  assert(certification.includes('DATABASE MUTATION: NONE'));

  console.log('COHORT_N_MULTI_MARKET_COMPARATIVE_INTELLIGENCE_WAVE_5_CHECK: PASS');
}

main().catch((error) => {
  console.error('COHORT_N_MULTI_MARKET_COMPARATIVE_INTELLIGENCE_WAVE_5_CHECK: FAIL', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
