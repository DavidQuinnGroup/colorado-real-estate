import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';

import { NextRequest } from 'next/server';

import { AGENT_SESSION_COOKIE, authorizeAdminRequest, createAgentSessionCookieValue } from '../lib/admin/adminAuth';
import { AGENT_COHORT_ADMITTED_METRICS, AGENT_COHORT_AGGREGATION_VERSION, type AgentCohortMetricArtifact, type AgentCohortMetricId } from '../lib/agentCohortAggregation';
import { normalizeAgentCohortDefinition, type AgentCohortInput } from '../lib/agentCohortBuilder';
import {
  AGENT_CURRENT_SNAPSHOT_COMPARISON_AS_OF_TOLERANCE_MS,
  AGENT_CURRENT_SNAPSHOT_COMPARISON_VERSION,
  CURRENT_SNAPSHOT_COMPARATIVE_INTELLIGENCE_NEXT_GATE,
  CURRENT_SNAPSHOT_COMPARATIVE_INTELLIGENCE_WAVE_3_STATUS,
  classifyAgentCohortRelationship,
  compareAgentCurrentSnapshotMetricArtifacts,
  getAgentMetricOperationPolicy,
  normalizeAgentComparisonOperations,
} from '../lib/agentCurrentSnapshotComparison';

Object.assign(process.env, {
  NODE_ENV: 'production',
  REIE_ADMIN_API_KEY: 'deterministic-admin-key',
  REIE_AGENT_CREDENTIAL: createHash('sha256').update('CURRENT_SNAPSHOT_COMPARISON_CHECK').digest('base64url'),
  REIE_AGENT_SUBJECT: 'atlas-current-snapshot-comparison-check',
  REIE_AGENT_SUBJECT_STATUS: 'ACTIVE',
  REIE_AGENT_SESSION_VERSION: '1',
});

const source = (path: string) => fs.readFileSync(path, 'utf8');
const request = (path: string, cookie?: string) => new NextRequest(`https://davidquinngroup.com${path}`, { headers: cookie ? { cookie } : undefined });

const cohortInput = (city: string, extra: AgentCohortInput['filters'] = {}): AgentCohortInput => Object.freeze({
  purpose: 'Deterministic current-snapshot comparison check',
  filters: Object.freeze({ city, propertyType: 'Residential', statusScope: 'Active', ...extra }),
  asOf: '2026-08-25T12:00:00.000Z',
});

const normalized = {
  boulder: normalizeAgentCohortDefinition(cohortInput('Boulder')),
  louisville: normalizeAgentCohortDefinition(cohortInput('Louisville')),
  lowBand: normalizeAgentCohortDefinition(cohortInput('Boulder', { priceMin: 500000, priceMax: 999999 })),
  highBand: normalizeAgentCohortDefinition(cohortInput('Boulder', { priceMin: 1000000, priceMax: 2000000 })),
  broadBedrooms: normalizeAgentCohortDefinition(cohortInput('Boulder', { bedsMin: 2 })),
  narrowBedrooms: normalizeAgentCohortDefinition(cohortInput('Boulder', { bedsMin: 4 })),
  overlappingPrice: normalizeAgentCohortDefinition(cohortInput('Boulder', { priceMin: 800000, priceMax: 1200000 })),
  unknown: normalizeAgentCohortDefinition({ purpose: 'Unresolved geography fixture', filters: { statusScope: 'Active' }, asOf: '2026-08-25T12:00:00.000Z' }),
};

function artifact(metricId: AgentCohortMetricId, value: number | null, normalizedCohort = normalized.boulder, overrides: Partial<AgentCohortMetricArtifact> = {}): AgentCohortMetricArtifact {
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
    cohortDefinitionId: normalizedCohort.cohort.cohortDefinitionId,
    cohortDefinitionVersion: normalizedCohort.cohort.cohortDefinitionVersion,
    analyticalGrain: 'MLS_LISTING',
    sourceScope: 'CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION',
    temporalBasis: 'OBSERVATION_AS_OF_TIMESTAMP',
    periodForm: 'AS_OF_INSTANT_SNAPSHOT',
    asOf: normalizedCohort.cohort.period.asOf ?? '2026-08-25T12:00:00.000Z',
    eligibleCohortCount: 10,
    includedPopulationCount: metric.aggregation === 'COUNT' ? 10 : included,
    nullMissingCount: metric.aggregation === 'COUNT' ? 0 : 10 - included,
    excludedPopulationCount: metric.aggregation === 'COUNT' ? 0 : 10 - included,
    audience: 'AGENT_ONLY',
    rights: Object.freeze({ agentOnly: 'PERMITTED', publicDisplay: 'BLOCKED', clientReport: 'BLOCKED', export: 'BLOCKED' }),
    limitations: metric.limitations,
    provenance: Object.freeze(['scripts/checkCurrentSnapshotComparativeIntelligence.ts']),
    ...overrides,
  });
}

function compare(metricId: AgentCohortMetricId, left: AgentCohortMetricArtifact, right: AgentCohortMetricArtifact, leftNormalized = normalized.boulder, rightNormalized = normalized.louisville) {
  return compareAgentCurrentSnapshotMetricArtifacts({
    metricId,
    artifacts: Object.freeze([left, right]),
    cohorts: Object.freeze([{ label: 'Cohort A', cohort: cohortInput('Boulder') }, { label: 'Cohort B', cohort: cohortInput('Louisville') }]),
    normalized: Object.freeze([leftNormalized, rightNormalized]),
    requestedOperations: Object.freeze(['SIDE_BY_SIDE', 'ABSOLUTE_DELTA', 'PERCENTAGE_DELTA', 'DIRECTION', 'RANK']),
    requestAsOf: '2026-08-25T12:00:00.000Z',
  });
}

async function main() {
  assert.equal(CURRENT_SNAPSHOT_COMPARATIVE_INTELLIGENCE_WAVE_3_STATUS, 'CURRENT_SNAPSHOT_COMPARATIVE_INTELLIGENCE_BOUNDED_IMPLEMENTATION_WAVE_3_CERTIFIED');
  assert.equal(CURRENT_SNAPSHOT_COMPARATIVE_INTELLIGENCE_NEXT_GATE, 'READY_FOR_AGENT_COMPARISON_REUSE_AND_SEGMENT_EXPANSION_REVIEW');
  assert.equal(AGENT_CURRENT_SNAPSHOT_COMPARISON_VERSION, 'AGENT_CURRENT_SNAPSHOT_COMPARISON_V1');
  assert.equal(AGENT_CURRENT_SNAPSHOT_COMPARISON_AS_OF_TOLERANCE_MS, 5000);

  assert.equal(classifyAgentCohortRelationship(normalized.boulder, normalized.louisville), 'DISJOINT');
  assert.equal(classifyAgentCohortRelationship(normalized.lowBand, normalized.highBand), 'DISJOINT');
  assert.equal(classifyAgentCohortRelationship(normalized.narrowBedrooms, normalized.broadBedrooms), 'SUBSET');
  assert.equal(classifyAgentCohortRelationship(normalized.broadBedrooms, normalized.narrowBedrooms), 'SUPERSET');
  assert.equal(classifyAgentCohortRelationship(normalized.lowBand, normalized.overlappingPrice), 'OVERLAPPING');
  assert.equal(classifyAgentCohortRelationship(normalized.unknown, normalized.boulder), 'UNKNOWN_RELATIONSHIP');

  const count = compare('agent.cohort.current-mls-listing-record-count.v1', artifact('agent.cohort.current-mls-listing-record-count.v1', 12), artifact('agent.cohort.current-mls-listing-record-count.v1', 8, normalized.louisville));
  assert.equal(count.comparabilityStatus, 'COMPARABLE');
  assert.equal(count.absoluteDelta, 4);
  assert.equal(count.percentageDelta, 0.5);
  assert.equal(count.direction, 'HIGHER');
  assert.deepEqual(count.ranks, [1, 2]);
  assert.equal(count.operationPolicy.PERCENTAGE_DELTA, 'ADMITTED_WITH_LIMITATIONS');
  assert(count.limitations.some((item) => item.includes('not supply')));

  const median = compare('agent.cohort.current-asking-list-price-median.v1', artifact('agent.cohort.current-asking-list-price-median.v1', 900000), artifact('agent.cohort.current-asking-list-price-median.v1', 750000, normalized.louisville));
  assert.equal(median.label, 'Current asking/list price median');
  assert.equal(median.absoluteDelta, 150000);
  assert.equal(median.percentageDelta, 0.2);
  assert.equal(median.direction, 'HIGHER');

  const yearBuilt = compare('agent.cohort.year-built-median.v1', artifact('agent.cohort.year-built-median.v1', 1995), artifact('agent.cohort.year-built-median.v1', 1985, normalized.louisville));
  assert.equal(yearBuilt.operationPolicy.PERCENTAGE_DELTA, 'NOT_ADMITTED');
  assert.equal(yearBuilt.percentageDelta, null);
  assert(yearBuilt.comparabilityReasons.includes('OPERATION_NOT_ADMITTED:PERCENTAGE_DELTA'));

  const noData = compare('agent.cohort.listed-square-feet-median.v1', artifact('agent.cohort.listed-square-feet-median.v1', null), artifact('agent.cohort.listed-square-feet-median.v1', 2100, normalized.louisville));
  assert.equal(noData.comparabilityStatus, 'NOT_COMPARABLE');
  assert.equal(noData.absoluteDelta, null);
  assert(noData.comparabilityReasons.includes('LEFT_ARTIFACT_NO_DATA'));

  const zeroBaseline = compare('agent.cohort.current-mls-listing-record-count.v1', artifact('agent.cohort.current-mls-listing-record-count.v1', 7), artifact('agent.cohort.current-mls-listing-record-count.v1', 0, normalized.louisville));
  assert.equal(zeroBaseline.percentageDelta, null);
  assert(zeroBaseline.limitations.some((item) => item.includes('baseline is zero')));

  const versionMismatch = compare('agent.cohort.current-asking-list-price-median.v1', artifact('agent.cohort.current-asking-list-price-median.v1', 1), artifact('agent.cohort.current-asking-list-price-median.v1', 1, normalized.louisville, { calculationVersion: 'OTHER_VERSION' as typeof AGENT_COHORT_AGGREGATION_VERSION }));
  assert(versionMismatch.comparabilityReasons.includes('CALCULATION_VERSION_MISMATCH'));

  const grainMismatch = compare('agent.cohort.current-asking-list-price-median.v1', artifact('agent.cohort.current-asking-list-price-median.v1', 1), artifact('agent.cohort.current-asking-list-price-median.v1', 1, normalized.louisville, { analyticalGrain: 'PHYSICAL_PROPERTY' as 'MLS_LISTING' }));
  assert(grainMismatch.comparabilityReasons.includes('GRAIN_MISMATCH'));

  const sourceMismatch = compare('agent.cohort.current-asking-list-price-median.v1', artifact('agent.cohort.current-asking-list-price-median.v1', 1), artifact('agent.cohort.current-asking-list-price-median.v1', 1, normalized.louisville, { sourceScope: 'IRES_NATIVE_EXPORT' as 'CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION' }));
  assert(sourceMismatch.comparabilityReasons.includes('SOURCE_SCOPE_MISMATCH'));

  const historical = compare('agent.cohort.current-asking-list-price-median.v1', artifact('agent.cohort.current-asking-list-price-median.v1', 1), artifact('agent.cohort.current-asking-list-price-median.v1', 1, normalized.louisville, { temporalBasis: 'CLOSE_SOLD_DATE' as 'OBSERVATION_AS_OF_TIMESTAMP', periodForm: 'CALENDAR_YEAR' as 'AS_OF_INSTANT_SNAPSHOT' }));
  assert(historical.comparabilityReasons.includes('TEMPORAL_BASIS_MISMATCH'));
  assert(historical.comparabilityReasons.includes('PERIOD_FORM_MISMATCH'));

  const salePrice = compare('agent.cohort.current-asking-list-price-median.v1', artifact('agent.cohort.current-asking-list-price-median.v1', 1), artifact('agent.cohort.current-asking-list-price-median.v1', 1, normalized.louisville, { metricId: 'agent.cohort.sale-price-median.v1' as AgentCohortMetricId, fieldBasis: 'salePrice' as 'price' }));
  assert(salePrice.comparabilityReasons.includes('METRIC_ID_MISMATCH'));

  const rights = compare('agent.cohort.current-asking-list-price-median.v1', artifact('agent.cohort.current-asking-list-price-median.v1', 1), artifact('agent.cohort.current-asking-list-price-median.v1', 1, normalized.louisville, { audience: 'PUBLIC' as 'AGENT_ONLY' }));
  assert.equal(rights.comparabilityStatus, 'RIGHTS_BLOCKED');

  const skew = compare('agent.cohort.current-asking-list-price-median.v1', artifact('agent.cohort.current-asking-list-price-median.v1', 1, normalized.boulder, { asOf: '2026-08-25T12:00:00.000Z' }), artifact('agent.cohort.current-asking-list-price-median.v1', 1, normalized.louisville, { asOf: '2026-08-25T12:00:10.000Z' }));
  assert.equal(skew.asOfAlignment.status, 'COMPARABLE_WITH_AS_OF_LIMITATION');

  const operations = normalizeAgentComparisonOperations(['SIDE_BY_SIDE', 'DOM_AVERAGE' as never]);
  assert.deepEqual(operations.requestedOperations, ['SIDE_BY_SIDE']);
  assert.deepEqual(operations.rejectedOperations, ['DOM_AVERAGE']);

  for (const metricId of Object.keys(AGENT_COHORT_ADMITTED_METRICS) as AgentCohortMetricId[]) {
    const policy = getAgentMetricOperationPolicy(metricId);
    assert.equal(policy.SIDE_BY_SIDE, 'ADMITTED');
    assert(['ADMITTED', 'ADMITTED_WITH_LIMITATIONS', 'NOT_ADMITTED'].includes(policy.ABSOLUTE_DELTA));
    assert(['ADMITTED', 'ADMITTED_WITH_LIMITATIONS', 'NOT_ADMITTED'].includes(policy.PERCENTAGE_DELTA));
    assert(['ADMITTED', 'ADMITTED_WITH_LIMITATIONS', 'NOT_ADMITTED'].includes(policy.DIRECTION));
    assert(['ADMITTED', 'ADMITTED_WITH_LIMITATIONS', 'NOT_ADMITTED'].includes(policy.RANK));
  }

  const lib = source('lib/agentCurrentSnapshotComparison.ts');
  assert.doesNotMatch(lib, /create\(|update\(|upsert\(|delete\(|deleteMany|createMany|updateMany|fetch\(|new Typesense|sendEmail|CRMTask|supabase/i);
  assert.match(lib, /CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION/);
  assert.match(lib, /OBSERVATION_AS_OF_TIMESTAMP/);
  assert.match(lib, /AS_OF_INSTANT_SNAPSHOT/);
  assert.match(lib, /COHORT_N_RUNTIME_READY/);

  const route = source('app/api/agent/current-snapshot-comparison/route.ts');
  assert.match(route, /authorizeAdminRequest\(request, \{ pathname: AGENT_COMPARISON_API_PATH, method: 'GET' \}\)/);
  assert.match(route, /'Cache-Control': 'private, no-store'/);
  assert.doesNotMatch(route, /POST|PUT|PATCH|DELETE/);

  const auth = source('lib/admin/adminAuth.ts');
  assert.match(auth, /surface\('\/api\/agent\/current-snapshot-comparison', 'READ_ONLY_ADMIN_API', \['HUMAN_AGENT'\], \['AGENT'\], \['HUMAN_AGENT_SESSION'\], 'READ_ONLY'/);
  assert.equal(auth.includes("surface('/api/agent/:path*'"), false);

  const ui = source('components/agent/AgentCurrentSnapshotComparison.tsx');
  for (const label of ['Matching current MLS listing records', 'Current asking/list price median', 'Current asking/list price mean', 'Listed square feet median']) assert.match(ui, new RegExp(label.replace('/', '\\/')));
  assert.doesNotMatch(ui, /Median Home Price|Median Sale Price|Market Value|Property Value|better market|hotter|stronger|leverage|appreciating faster/i);
  assert.match(ui, /credentials: 'same-origin'/);
  assert.match(ui, /data-agent-comparison-public-output="false"/);
  assert.match(ui, /data-agent-comparison-provider-activity="false"/);
  assert.match(ui, /data-agent-comparison-historical="false"/);

  const marketUpdate = source('components/agent/MarketUpdatePreparationExperience.tsx');
  assert.match(marketUpdate, /<AgentCurrentSnapshotComparison surface="MARKET_UPDATE_PREPARATION" \/>/);

  const certification = source('docs/project-atlas/executive-library/CURRENT-SNAPSHOT-COMPARATIVE-INTELLIGENCE-BOUNDED-IMPLEMENTATION-WAVE-3-CERTIFICATION.md');
  assert.match(certification, /CURRENT_SNAPSHOT_COMPARATIVE_INTELLIGENCE_BOUNDED_IMPLEMENTATION_WAVE_3_CERTIFIED/);
  assert.match(certification, /PER-METRIC ALLOWED OPERATIONS/);
  assert.match(certification, /DATABASE MUTATION: NONE/);

  const session = await createAgentSessionCookieValue();
  const cookie = `${AGENT_SESSION_COOKIE}=${session}`;
  const allowed = await authorizeAdminRequest(request('/api/agent/current-snapshot-comparison', cookie), { pathname: '/api/agent/current-snapshot-comparison', method: 'GET' });
  assert.equal(allowed.authenticated, true);
  if (allowed.authenticated) {
    assert.equal(allowed.identityType, 'HUMAN_AGENT');
    assert.equal(allowed.canMutate, false);
  }
  assert.equal((await authorizeAdminRequest(request('/api/agent/current-snapshot-comparison'), { pathname: '/api/agent/current-snapshot-comparison', method: 'GET' })).authenticated, false);

  console.log('CURRENT_SNAPSHOT_COMPARATIVE_INTELLIGENCE_BOUNDED_IMPLEMENTATION_WAVE_3_CHECK: PASS');
}

main().catch((error) => {
  console.error('CURRENT_SNAPSHOT_COMPARATIVE_INTELLIGENCE_BOUNDED_IMPLEMENTATION_WAVE_3_CHECK: FAIL', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
