import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  ADMITTED_BASIC_AGGREGATION_NEXT_GATE,
  ADMITTED_BASIC_AGGREGATION_WAVE_2_STATUS,
  AGENT_COHORT_ADMITTED_METRICS,
  AGENT_COHORT_AGGREGATION_VERSION,
  AGENT_COHORT_METRIC_IDS,
  normalizeAgentCohortMetricIds,
} from '../lib/agentCohortAggregation';
import { normalizeAgentCohortDefinition } from '../lib/agentCohortBuilder';

assert.equal(ADMITTED_BASIC_AGGREGATION_WAVE_2_STATUS, 'ADMITTED_BASIC_AGGREGATION_BOUNDED_IMPLEMENTATION_WAVE_2_CERTIFIED');
assert.equal(ADMITTED_BASIC_AGGREGATION_NEXT_GATE, 'READY_FOR_COMPARATIVE_INTELLIGENCE_FOUNDATION_ADMISSION_REVIEW');
assert.equal(AGENT_COHORT_AGGREGATION_VERSION, 'AGENT_COHORT_BASIC_AGGREGATION_V1');

for (const id of [
  'agent.cohort.current-mls-listing-record-count.v1',
  'agent.cohort.current-asking-list-price-min.v1',
  'agent.cohort.current-asking-list-price-max.v1',
  'agent.cohort.current-asking-list-price-median.v1',
  'agent.cohort.current-asking-list-price-mean.v1',
  'agent.cohort.bedrooms-median.v1',
  'agent.cohort.bathrooms-median.v1',
  'agent.cohort.listed-square-feet-median.v1',
  'agent.cohort.year-built-median.v1',
]) {
  assert(AGENT_COHORT_METRIC_IDS.includes(id as never), `Missing admitted metric ${id}`);
}

for (const metric of Object.values(AGENT_COHORT_ADMITTED_METRICS)) {
  assert.equal(metric.calculationVersion, AGENT_COHORT_AGGREGATION_VERSION);
  assert.equal(metric.audience, 'AGENT_ONLY');
  assert.notEqual(metric.label.toLowerCase().includes('sale price'), true);
  assert.notEqual(metric.label.toLowerCase().includes('market value'), true);
  assert.notEqual(metric.label.toLowerCase().includes('home price'), true);
  assert.notEqual(metric.label.toLowerCase().includes('dom'), true);
}

assert.equal(AGENT_COHORT_ADMITTED_METRICS['agent.cohort.current-mls-listing-record-count.v1'].aggregation, 'COUNT');
assert.equal(AGENT_COHORT_ADMITTED_METRICS['agent.cohort.current-mls-listing-record-count.v1'].fieldBasis, 'record');
assert.equal(AGENT_COHORT_ADMITTED_METRICS['agent.cohort.current-asking-list-price-median.v1'].fieldBasis, 'price');
assert.equal(AGENT_COHORT_ADMITTED_METRICS['agent.cohort.current-asking-list-price-median.v1'].aggregation, 'MEDIAN');
assert.equal(AGENT_COHORT_ADMITTED_METRICS['agent.cohort.current-asking-list-price-mean.v1'].aggregation, 'ARITHMETIC_MEAN');
assert.equal(AGENT_COHORT_ADMITTED_METRICS['agent.cohort.listed-square-feet-median.v1'].unit, 'listed square feet');

const metrics = normalizeAgentCohortMetricIds([
  'agent.cohort.current-asking-list-price-median.v1',
  'agent.cohort.dom-average.v1',
  'agent.cohort.sale-price-median.v1',
]);
assert.deepEqual(metrics.admittedMetricIds, ['agent.cohort.current-asking-list-price-median.v1']);
assert.deepEqual(metrics.rejectedMetricIds, ['agent.cohort.dom-average.v1', 'agent.cohort.sale-price-median.v1']);

const cohort = normalizeAgentCohortDefinition({
  purpose: 'Wave 2 deterministic cohort',
  filters: { city: 'Boulder', propertyType: 'Residential', statusScope: 'Active', priceMin: 500000, priceMax: 1250000 },
  asOf: '2026-08-25T12:00:00.000Z',
});
assert.equal(cohort.validation.ready, true);
assert.equal(cohort.cohort.analyticalGrain, 'MLS_LISTING');
assert.equal(cohort.cohort.period.periodBasis, 'OBSERVATION_AS_OF_TIMESTAMP');
assert.equal(cohort.cohort.period.form, 'AS_OF_INSTANT_SNAPSHOT');

const aggregationSource = fs.readFileSync('lib/agentCohortAggregation.ts', 'utf8');
assert.match(aggregationSource, /prisma\.property\.findMany/);
assert.match(aggregationSource, /eligibleCohortCount/);
assert.match(aggregationSource, /includedPopulationCount/);
assert.match(aggregationSource, /nullMissingCount/);
assert.match(aggregationSource, /state: input\.value === null/);
assert.match(aggregationSource, /publicDisplay: 'BLOCKED'/);
assert.match(aggregationSource, /clientReport: 'BLOCKED'/);
assert.match(aggregationSource, /export: 'BLOCKED'/);
assert.doesNotMatch(aggregationSource, /create\(|update\(|upsert\(|delete\(|deleteMany|createMany|updateMany|fetch\(|new Typesense|sendEmail|CRMTask|supabase/i, 'Aggregation layer must remain read-only and provider-free.');

const routeSource = fs.readFileSync('app/api/agent/cohort-count/route.ts', 'utf8');
assert.match(routeSource, /aggregateAgentCohort/);
assert.match(routeSource, /searchParams\.getAll\('metricId'\)/);
assert.match(routeSource, /metrics/);
assert.doesNotMatch(routeSource, /POST|PUT|PATCH|DELETE/);

const componentSource = fs.readFileSync('components/agent/AgentCohortBuilder.tsx', 'utf8');
assert.match(componentSource, /agent-cohort-aggregations/);
assert.match(componentSource, /agent-cohort-metric-artifact/);
assert.match(componentSource, /Included/);
assert.match(componentSource, /Null\/missing/);
assert.match(componentSource, /Agent-only, current as-of snapshot/);
assert.doesNotMatch(componentSource, /Median Home Price|Median Sale Price|Market Value|Property Value/i);

console.log('ADMITTED_BASIC_AGGREGATION_BOUNDED_IMPLEMENTATION_WAVE_2_CHECK: PASS');
