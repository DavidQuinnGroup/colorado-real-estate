import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  ATLAS_ANALYTICAL_GRAINS,
  ATLAS_ADMISSION_GATES,
  ATLAS_AUDIENCE_OUTPUTS,
  ATLAS_COHORT_COMPARATIVE_CONTRACT_NEXT_GATE,
  ATLAS_COHORT_COMPARATIVE_CONTRACT_STATUS,
  ATLAS_COHORT_COMPARATIVE_PROTECTED_BOUNDARIES,
  ATLAS_COHORT_TYPES,
  ATLAS_COMPARABILITY_REASON_CODES,
  ATLAS_COMPARABILITY_STATES,
  ATLAS_IMPLEMENTATION_READINESS_MATRIX,
  ATLAS_FIELD_ADMISSION_STATES,
  ATLAS_NULL_MISSING_STATES,
  ATLAS_OBSERVATION_ARTIFACT_REQUIREMENTS,
  ATLAS_PERIOD_BASES,
  ATLAS_PERIOD_FORMS,
  ATLAS_STOCK_FLOW_CLASSES,
  calculateAtlasComparativeResult,
  classifyStockFlowCompatibility,
  evaluateAtlasAdmissionGates,
  evaluateAtlasComparability,
  validateAtlasCohortDefinition,
  validateAtlasMetricArtifact,
  validateAtlasPeriodContract,
} from '../lib/atlasCohortComparativeContract';
import {
  IRES_COMPARE_TWO_YEARS_FAILURE_ARTIFACT,
  INVALID_IRES_NATIVE_DUPLICATE_FIXTURE,
  LIMITED_NULL_COVERAGE_METRIC_ARTIFACT,
  PUBLIC_RIGHTS_BLOCKED_METRIC_ARTIFACT,
  SCENARIO_METRIC_ARTIFACT,
  UNKNOWN_METHODOLOGY_METRIC_ARTIFACT,
  VALID_FLOW_COHORT_FIXTURE,
  VALID_CURRENT_METRIC_ARTIFACT,
  VALID_PRIOR_METRIC_ARTIFACT,
  VALID_SCENARIO_COHORT_FIXTURE,
  VALID_STOCK_COHORT_FIXTURE,
  ZERO_DENOMINATOR_PRIOR_METRIC_ARTIFACT,
} from '../lib/atlasCohortComparativeContractFixtures';

assert.equal(ATLAS_COHORT_COMPARATIVE_CONTRACT_STATUS, 'ATLAS_COHORT_AND_COMPARATIVE_MARKET_INTELLIGENCE_CONTRACT_MVV_CERTIFIED');
assert.equal(ATLAS_COHORT_COMPARATIVE_CONTRACT_NEXT_GATE, 'ATLAS_COHORT_AND_COMPARATIVE_MARKET_INTELLIGENCE_CONTRACT_MVV_CERTIFIED');

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
assert(ATLAS_AUDIENCE_OUTPUTS.includes('AGENT_ONLY'));
assert(ATLAS_AUDIENCE_OUTPUTS.includes('PUBLIC_DISPLAY'));
assert(ATLAS_COMPARABILITY_STATES.includes('COMPARABLE_WITH_LIMITATIONS'));
for (const reason of ['METRIC_MISMATCH', 'GRAIN_MISMATCH', 'SOURCE_POPULATION_MISMATCH', 'IDENTITY_POLICY_MISMATCH', 'GEOGRAPHY_MISMATCH', 'EVENT_BASIS_MISMATCH', 'STOCK_FLOW_MISMATCH', 'HISTORICAL_COVERAGE_INSUFFICIENT', 'FIELD_COVERAGE_INSUFFICIENT', 'CALCULATION_VERSION_MISMATCH', 'RIGHTS_INCOMPATIBLE', 'UNKNOWN_METHODOLOGY']) {
  assert(ATLAS_COMPARABILITY_REASON_CODES.includes(reason as (typeof ATLAS_COMPARABILITY_REASON_CODES)[number]), `Missing comparability reason: ${reason}`);
}
assert.equal(ATLAS_ADMISSION_GATES.length, 9);

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

assert.equal(validateAtlasMetricArtifact(VALID_CURRENT_METRIC_ARTIFACT).valid, true);
assert.equal(validateAtlasMetricArtifact(UNKNOWN_METHODOLOGY_METRIC_ARTIFACT).valid, false);
assert(validateAtlasMetricArtifact(UNKNOWN_METHODOLOGY_METRIC_ARTIFACT).reasons.includes('UNKNOWN_METHODOLOGY'));
assert(validateAtlasMetricArtifact(UNKNOWN_METHODOLOGY_METRIC_ARTIFACT).reasons.includes('CALCULATION_VERSION_MISMATCH'));

const validComparison = evaluateAtlasComparability({
  left: VALID_CURRENT_METRIC_ARTIFACT,
  right: VALID_PRIOR_METRIC_ARTIFACT,
  requestedAudience: 'AGENT_ONLY',
  allowLimitedComparability: false,
});
assert.equal(validComparison.state, 'COMPARABLE');
assert.deepEqual(validComparison.reasons, []);

const limitedComparison = evaluateAtlasComparability({
  left: VALID_CURRENT_METRIC_ARTIFACT,
  right: LIMITED_NULL_COVERAGE_METRIC_ARTIFACT,
  requestedAudience: 'AGENT_ONLY',
  allowLimitedComparability: true,
});
assert.equal(limitedComparison.state, 'COMPARABLE_WITH_LIMITATIONS');
assert(limitedComparison.reasons.includes('FIELD_COVERAGE_INSUFFICIENT'));

const publicRights = evaluateAtlasComparability({
  left: VALID_CURRENT_METRIC_ARTIFACT,
  right: PUBLIC_RIGHTS_BLOCKED_METRIC_ARTIFACT,
  requestedAudience: 'PUBLIC_DISPLAY',
  allowLimitedComparability: false,
});
assert.equal(publicRights.state, 'RIGHTS_BLOCKED');
assert(publicRights.reasons.includes('RIGHTS_INCOMPATIBLE'));

const unknownMethodology = evaluateAtlasComparability({
  left: UNKNOWN_METHODOLOGY_METRIC_ARTIFACT,
  right: VALID_PRIOR_METRIC_ARTIFACT,
  requestedAudience: 'AGENT_ONLY',
  allowLimitedComparability: false,
});
assert.equal(unknownMethodology.state, 'EVIDENCE_INSUFFICIENT');
assert(unknownMethodology.reasons.includes('UNKNOWN_METHODOLOGY'));

const metricMismatch = evaluateAtlasComparability({
  left: { ...VALID_CURRENT_METRIC_ARTIFACT, metricDefinitionVersion: 'metric-v2' },
  right: VALID_PRIOR_METRIC_ARTIFACT,
  requestedAudience: 'AGENT_ONLY',
  allowLimitedComparability: false,
});
assert.equal(metricMismatch.state, 'NOT_COMPARABLE');
assert(metricMismatch.reasons.includes('METRIC_MISMATCH'));

const grainMismatch = evaluateAtlasComparability({
  left: { ...VALID_CURRENT_METRIC_ARTIFACT, analyticalGrain: 'MLS_LISTING' },
  right: VALID_PRIOR_METRIC_ARTIFACT,
  requestedAudience: 'AGENT_ONLY',
  allowLimitedComparability: false,
});
assert(grainMismatch.reasons.includes('GRAIN_MISMATCH'));

const geographyMismatch = evaluateAtlasComparability({
  left: { ...VALID_CURRENT_METRIC_ARTIFACT, coverage: { ...VALID_CURRENT_METRIC_ARTIFACT.coverage, geographicCoverage: { ...VALID_CURRENT_METRIC_ARTIFACT.coverage.geographicCoverage, definitionVersion: 'other-geo-v1' } } },
  right: VALID_PRIOR_METRIC_ARTIFACT,
  requestedAudience: 'AGENT_ONLY',
  allowLimitedComparability: false,
});
assert(geographyMismatch.reasons.includes('GEOGRAPHY_MISMATCH'));

const duplicatePolicyMismatch = evaluateAtlasComparability({
  left: { ...VALID_CURRENT_METRIC_ARTIFACT, identityPolicyVersion: 'identity-policy-v2' },
  right: VALID_PRIOR_METRIC_ARTIFACT,
  requestedAudience: 'AGENT_ONLY',
  allowLimitedComparability: false,
});
assert(duplicatePolicyMismatch.reasons.includes('IDENTITY_POLICY_MISMATCH'));

const historicalFailure = evaluateAtlasComparability({
  left: VALID_CURRENT_METRIC_ARTIFACT,
  right: IRES_COMPARE_TWO_YEARS_FAILURE_ARTIFACT,
  requestedAudience: 'AGENT_ONLY',
  allowLimitedComparability: false,
});
assert.equal(historicalFailure.state, 'EVIDENCE_INSUFFICIENT');
assert(historicalFailure.reasons.includes('HISTORICAL_COVERAGE_INSUFFICIENT'));

const scenarioAmbiguity = evaluateAtlasComparability({
  left: VALID_CURRENT_METRIC_ARTIFACT,
  right: SCENARIO_METRIC_ARTIFACT,
  requestedAudience: 'AGENT_ONLY',
  allowLimitedComparability: false,
});
assert(scenarioAmbiguity.reasons.includes('SCENARIO_OBSERVED_EVIDENCE_AMBIGUITY'));

const currentProjectionBoundary = validateAtlasMetricArtifact({
  ...VALID_CURRENT_METRIC_ARTIFACT,
  artifactClass: 'CURRENT_PROJECTION',
  observationAsOf: null,
});
assert(currentProjectionBoundary.reasons.includes('HISTORICAL_COVERAGE_INSUFFICIENT'));

const ordinaryResult = calculateAtlasComparativeResult({
  comparisonArtifactId: 'atlas.comparison.fixture.valid',
  left: VALID_CURRENT_METRIC_ARTIFACT,
  right: VALID_PRIOR_METRIC_ARTIFACT,
  requestedAudience: 'AGENT_ONLY',
  allowLimitedComparability: false,
});
assert.equal(ordinaryResult.absoluteDelta, 5);
assert.equal(ordinaryResult.percentageDelta, 0.25);
assert.equal(ordinaryResult.direction, 'UP');

const zeroDenominator = calculateAtlasComparativeResult({
  comparisonArtifactId: 'atlas.comparison.fixture.zero-denominator',
  left: VALID_CURRENT_METRIC_ARTIFACT,
  right: ZERO_DENOMINATOR_PRIOR_METRIC_ARTIFACT,
  requestedAudience: 'AGENT_ONLY',
  allowLimitedComparability: false,
});
assert.equal(zeroDenominator.absoluteDelta, 25);
assert.equal(zeroDenominator.percentageDelta, null);
assert.equal(zeroDenominator.zeroDenominatorPolicy, 'RETURN_UNDEFINED_WITH_REASON');

const gates = evaluateAtlasAdmissionGates({
  sourceAdmitted: true,
  fieldAdmitted: true,
  methodologyAdmitted: false,
  identityAdmitted: true,
  geographyAdmitted: true,
  temporalHistoryAdmitted: false,
  comparabilityAdmitted: false,
  rightsAudienceAdmitted: false,
  presentationInterpretationAdmitted: false,
});
assert.equal(gates.filter((gate) => gate.state === 'FAIL').length, 5);
assert(ATLAS_IMPLEMENTATION_READINESS_MATRIX.some((item) => item.capability === 'Reusable Agent cohort builder' && item.state === 'READY_NOW_FOR_BOUNDED_IMPLEMENTATION'));
assert(ATLAS_IMPLEMENTATION_READINESS_MATRIX.some((item) => item.capability === 'DOM-family analysis' && item.state === 'BLOCKED_BY_METHODOLOGY'));
assert(ATLAS_IMPLEMENTATION_READINESS_MATRIX.some((item) => item.capability === 'Client-facing market reports / PDF / public reporting' && item.state === 'BLOCKED_BY_RIGHTS'));

const contractSource = fs.readFileSync('lib/atlasCohortComparativeContract.ts', 'utf8');
assert.doesNotMatch(contractSource, /fetch\(|PrismaClient|prisma\.|process\.env|from ['"]next|from ['"]@prisma|new Typesense|CRMTask|sendEmail\(|resend\./i, 'Contract must remain side-effect free.');

console.log('ATLAS_COHORT_AND_COMPARATIVE_MARKET_INTELLIGENCE_CONTRACT_MVV_CHECK: PASS');
