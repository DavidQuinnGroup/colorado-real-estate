import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  ATLAS_ANALYTICAL_GRAINS,
  ATLAS_COHORT_COMPARATIVE_CONTRACT_NEXT_GATE,
  ATLAS_COHORT_COMPARATIVE_CONTRACT_STATUS,
  ATLAS_COHORT_COMPARATIVE_PROTECTED_BOUNDARIES,
  ATLAS_COHORT_TYPES,
  ATLAS_FIELD_ADMISSION_STATES,
  ATLAS_NULL_MISSING_STATES,
  ATLAS_OBSERVATION_ARTIFACT_REQUIREMENTS,
  ATLAS_PERIOD_BASES,
  ATLAS_PERIOD_FORMS,
  ATLAS_STOCK_FLOW_CLASSES,
  classifyStockFlowCompatibility,
  validateAtlasCohortDefinition,
  validateAtlasPeriodContract,
} from '../lib/atlasCohortComparativeContract';
import {
  INVALID_IRES_NATIVE_DUPLICATE_FIXTURE,
  VALID_FLOW_COHORT_FIXTURE,
  VALID_SCENARIO_COHORT_FIXTURE,
  VALID_STOCK_COHORT_FIXTURE,
} from '../lib/atlasCohortComparativeContractFixtures';

assert.equal(ATLAS_COHORT_COMPARATIVE_CONTRACT_STATUS, 'ATLAS_COHORT_COMPARATIVE_MARKET_INTELLIGENCE_CONTRACT_MVV_BLOCK_1_FOUNDATION');
assert.equal(ATLAS_COHORT_COMPARATIVE_CONTRACT_NEXT_GATE, 'ATLAS_COHORT_COMPARATIVE_CONTRACT_MVV_BLOCK_1_COMPLETE_READY_FOR_BLOCK_2');

for (const grain of ['PHYSICAL_PROPERTY', 'MLS_LISTING', 'LISTING_EPISODE', 'TRANSACTION', 'EVENT', 'AS_OF_SNAPSHOT_MEMBER', 'SCENARIO_MODEL_OBSERVATION']) {
  assert(ATLAS_ANALYTICAL_GRAINS.includes(grain as (typeof ATLAS_ANALYTICAL_GRAINS)[number]), `Missing analytical grain: ${grain}`);
}

for (const cohortType of ['SEARCH_FILTER_COHORT', 'PHYSICAL_PROPERTY_COHORT', 'MLS_LISTING_COHORT', 'LISTING_EPISODE_COHORT', 'TRANSACTION_COHORT', 'STOCK_AS_OF_SNAPSHOT_COHORT', 'STATUS_EVENT_FLOW_COHORT', 'GEOGRAPHIC_COHORT', 'PROPERTY_BENCHMARK_COHORT', 'SUBJECT_PROPERTY_COHORT', 'SCENARIO_COHORT']) {
  assert(ATLAS_COHORT_TYPES.includes(cohortType as (typeof ATLAS_COHORT_TYPES)[number]), `Missing cohort type: ${cohortType}`);
}

for (const basis of ['LISTING_CONTRACT_DATE', 'ON_MARKET_DATE', 'LISTING_DATE', 'PENDING_DATE', 'CLOSE_SOLD_DATE', 'STATUS_CHANGE_DATE', 'OFF_MARKET_DATE', 'PRICE_CHANGE_DATE', 'ADMITTED_EVENT_TIMESTAMP', 'OBSERVATION_AS_OF_TIMESTAMP']) {
  assert(ATLAS_PERIOD_BASES.includes(basis as (typeof ATLAS_PERIOD_BASES)[number]), `Missing period basis: ${basis}`);
}

assert(ATLAS_PERIOD_FORMS.includes('AS_OF_INSTANT_SNAPSHOT'));
assert(ATLAS_STOCK_FLOW_CLASSES.includes('STOCK'));
assert(ATLAS_STOCK_FLOW_CLASSES.includes('FLOW'));
assert(ATLAS_FIELD_ADMISSION_STATES.includes('FIELD_ELIGIBLE_FOR_ANALYTICS'));
assert(ATLAS_NULL_MISSING_STATES.includes('SOURCE_PROVIDES_NULL'));
assert(ATLAS_NULL_MISSING_STATES.includes('EXCLUDED_BY_SOURCE_RIGHTS'));
assert(ATLAS_NULL_MISSING_STATES.includes('EXCLUDED_BY_AUDIENCE_OUTPUT_POLICY'));

assert.deepEqual(validateAtlasCohortDefinition(VALID_STOCK_COHORT_FIXTURE).reasons, []);
assert.equal(validateAtlasCohortDefinition(VALID_STOCK_COHORT_FIXTURE).ready, true);
assert.deepEqual(validateAtlasCohortDefinition(VALID_FLOW_COHORT_FIXTURE).reasons, []);
assert.equal(validateAtlasCohortDefinition(VALID_SCENARIO_COHORT_FIXTURE).ready, true);

const stockAsFlow = validateAtlasCohortDefinition({
  ...VALID_STOCK_COHORT_FIXTURE,
  stockFlowClass: 'FLOW',
});
assert(stockAsFlow.reasons.includes('FLOW_REQUIRES_PERIOD_RANGE'));

const unresolvedIres = validateAtlasCohortDefinition(INVALID_IRES_NATIVE_DUPLICATE_FIXTURE);
for (const reason of [
  'SOURCE_ADMISSION_REQUIRED',
  'SOURCE_POPULATION_COVERAGE_REQUIRED',
  'SOURCE_NATIVE_DUPLICATES_NOT_ATLAS_IDENTITY',
  'IDENTITY_CONFIDENCE_REQUIRED',
  'GEOGRAPHY_RECONCILIATION_REQUIRED',
]) {
  assert(unresolvedIres.reasons.includes(reason), `Expected unresolved IRES fixture reason: ${reason}`);
}

assert(validateAtlasPeriodContract({ ...VALID_FLOW_COHORT_FIXTURE.period, periodBasis: null }).includes('PERIOD_BASIS_REQUIRED'));
assert(validateAtlasPeriodContract({ ...VALID_FLOW_COHORT_FIXTURE.period, timezone: null }).includes('TIMEZONE_REQUIRED'));
assert(validateAtlasPeriodContract({ ...VALID_FLOW_COHORT_FIXTURE.period, comparisonAlignmentPolicy: 'NOT_COMPARABLE_YET' }).includes('COMPARISON_ALIGNMENT_POLICY_REQUIRED'));

assert.deepEqual(classifyStockFlowCompatibility({
  requestedClass: 'STOCK',
  periodForm: 'AS_OF_INSTANT_SNAPSHOT',
  artifactClass: 'AS_OF_SNAPSHOT',
}), { compatible: true, reasons: [] });
assert(classifyStockFlowCompatibility({
  requestedClass: 'STOCK',
  periodForm: 'CUSTOM_BOUNDED_PERIOD',
  artifactClass: 'CURRENT_PROJECTION',
}).reasons.includes('CURRENT_PROJECTION_NOT_HISTORICAL_EVIDENCE'));
assert(classifyStockFlowCompatibility({
  requestedClass: 'FLOW',
  periodForm: 'AS_OF_INSTANT_SNAPSHOT',
  artifactClass: 'HISTORICAL_EVENT',
}).reasons.includes('FLOW_REQUIRES_EVENT_PERIOD'));
assert(classifyStockFlowCompatibility({
  requestedClass: 'SCENARIO',
  periodForm: 'CUSTOM_BOUNDED_PERIOD',
  artifactClass: 'SOURCE_OBSERVATION',
}).reasons.includes('SCENARIO_REQUIRES_MODELED_ARTIFACT_BOUNDARY'));

assert(ATLAS_OBSERVATION_ARTIFACT_REQUIREMENTS.CURRENT_PROJECTION.includes('NOT_HISTORICAL_EVIDENCE_BY_DEFAULT'));
assert(ATLAS_OBSERVATION_ARTIFACT_REQUIREMENTS.DERIVED_METRIC_ARTIFACT.includes('CALCULATION_VERSION_REQUIRED'));
assert(Object.values(ATLAS_COHORT_COMPARATIVE_PROTECTED_BOUNDARIES).every((value) => value === false));

const contractSource = fs.readFileSync('lib/atlasCohortComparativeContract.ts', 'utf8');
assert.doesNotMatch(contractSource, /fetch\(|PrismaClient|prisma\.|process\.env|from ['"]next|from ['"]@prisma|new Typesense|CRMTask|sendEmail\(|resend\./i, 'Contract must remain side-effect free.');

console.log('ATLAS_COHORT_COMPARATIVE_CONTRACT_MVV_BLOCK_1_CHECK: PASS');
