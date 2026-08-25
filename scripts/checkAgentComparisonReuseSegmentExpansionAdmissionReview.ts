import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  AGENT_COMPARISON_COHORT_N_REVIEW,
  AGENT_COMPARISON_NEXT_IMPLEMENTATION_PACKAGE,
  AGENT_COMPARISON_REUSE_SEGMENT_EXPANSION_NEXT_GATE,
  AGENT_COMPARISON_REUSE_SEGMENT_EXPANSION_REVIEW_STATUS,
  AGENT_COMPARISON_REUSE_SEGMENT_EXPANSION_REVIEW_VERSION,
  AGENT_COMPARISON_REVIEW_PROTECTED_BOUNDARIES,
  AGENT_COMPARISON_SEGMENTATION_REVIEW,
  AGENT_COMPARISON_SURFACE_REUSE_REVIEW,
  classifyAdmissionReviewRangeRelationship,
  evaluateMultiCohortFailurePolicy,
  evaluateSegmentFieldAdmission,
} from '../lib/agentComparisonReuseSegmentExpansionAdmissionReview';
import { CURRENT_SNAPSHOT_COMPARATIVE_INTELLIGENCE_NEXT_GATE } from '../lib/agentCurrentSnapshotComparison';

assert.equal(AGENT_COMPARISON_REUSE_SEGMENT_EXPANSION_REVIEW_STATUS, 'AGENT_COMPARISON_REUSE_AND_SEGMENT_EXPANSION_REVIEW_CERTIFIED');
assert.equal(AGENT_COMPARISON_REUSE_SEGMENT_EXPANSION_NEXT_GATE, 'READY_FOR_AGENT_DECISION_COMPARISON_REUSE_AND_INTERVAL_SEMANTICS_BOUNDED_IMPLEMENTATION_WAVE_4');
assert.equal(AGENT_COMPARISON_REUSE_SEGMENT_EXPANSION_REVIEW_VERSION, 'AGENT_COMPARISON_REUSE_SEGMENT_EXPANSION_ADMISSION_REVIEW_V1');
assert.equal(CURRENT_SNAPSHOT_COMPARATIVE_INTELLIGENCE_NEXT_GATE, 'READY_FOR_AGENT_COMPARISON_REUSE_AND_SEGMENT_EXPANSION_REVIEW');

const surface = (name: string) => AGENT_COMPARISON_SURFACE_REUSE_REVIEW.find((item) => item.surface === name);
assert.equal(surface('LOCATION_PREPARATION')?.reuseState, 'REUSE_NOW_AFTER_SMALL_LOCAL_FOUNDATION');
assert.equal(surface('LOCATION_PREPARATION')?.requiredFoundation.includes('CITY_SET_ALIGNMENT'), true);
assert.equal(surface('BUYER_PREPARATION')?.reuseState, 'REUSE_NOW_AFTER_SMALL_LOCAL_FOUNDATION');
assert.equal(surface('BUYER_PREPARATION')?.requiredFoundation.includes('NO_SUITABILITY_OR_OFFER_STRATEGY'), true);
assert.equal(surface('MARKET_PREPARATION')?.reuseState, 'REUSE_NOW_AFTER_SMALL_LOCAL_FOUNDATION');
assert.equal(surface('MARKET_UPDATE_PREPARATION')?.reuseState, 'ALREADY_IMPLEMENTED');
assert.equal(surface('SELLER_PREPARATION')?.reuseState, 'REUSE_AFTER_SUBJECT_PROPERTY_BENCHMARK');
assert.equal(surface('LISTING_PREPARATION')?.reuseState, 'REUSE_AFTER_SUBJECT_PROPERTY_BENCHMARK');
assert.equal(surface('PROPERTY_PREPARATION')?.reuseState, 'DEFER_UNTIL_GRAIN_CONTRACT_EXISTS');

assert.equal(classifyAdmissionReviewRangeRelationship({ min: 500000, max: 1000000 }, { min: 1000000, max: 1500000 }, 'CURRENT_INCLUSIVE'), 'OVERLAPPING');
assert.equal(classifyAdmissionReviewRangeRelationship({ min: 500000, max: 1000000 }, { min: 1000000, max: 1500000 }, 'PROPOSED_HALF_OPEN_ADJACENT_SAFE'), 'DISJOINT');
assert.equal(classifyAdmissionReviewRangeRelationship({ min: null, max: 1000000 }, { min: 1000000, max: null }, 'PROPOSED_HALF_OPEN_ADJACENT_SAFE'), 'DISJOINT');
assert.equal(classifyAdmissionReviewRangeRelationship({ min: 750000, max: 900000 }, { min: null, max: 1000000 }, 'PROPOSED_HALF_OPEN_ADJACENT_SAFE'), 'SUBSET');

assert.equal(evaluateSegmentFieldAdmission('city').admissionState, 'ADMITTED_NOW');
assert.equal(evaluateSegmentFieldAdmission('priceMin/priceMax').admissionState, 'READY_AFTER_INTERVAL_CONTRACT');
assert.equal(evaluateSegmentFieldAdmission('zip').admissionState, 'READY_AFTER_SMALL_LOCAL_FOUNDATION');
assert.equal(evaluateSegmentFieldAdmission('garage/hoa/basement/style/condition/newConstruction/waterfront/zoning/county').admissionState, 'BLOCKED_BY_FIELD_ABSENCE');
assert.equal(evaluateSegmentFieldAdmission('unknownField').filterSafe, false);

const filterSafeButNotAggregate = AGENT_COMPARISON_SEGMENTATION_REVIEW.find((item) => item.field === 'zip');
assert.equal(filterSafeButNotAggregate?.filterSafe, true);
assert.equal(filterSafeButNotAggregate?.aggregationAdmitted, false);

assert.equal(AGENT_COMPARISON_COHORT_N_REVIEW.runtimeEngine, 'READY_FOR_2_TO_6_COHORTS');
assert.equal(AGENT_COMPARISON_COHORT_N_REVIEW.currentApiUi, 'A_B_ONLY');
assert.equal(evaluateMultiCohortFailurePolicy(['READY', 'READY', 'READY']), 'ALL_COHORTS_COMPARABLE');
assert.equal(evaluateMultiCohortFailurePolicy(['READY', 'NO_DATA', 'READY']), 'RETURN_VALID_COHORTS_WITH_EXPLICIT_FAILED_COHORTS_NO_RANK');
assert.equal(evaluateMultiCohortFailurePolicy(['READY', 'RIGHTS_BLOCKED']), 'FAIL_AFFECTED_COMPARISON_RIGHTS_BLOCKED');

assert.equal(AGENT_COMPARISON_NEXT_IMPLEMENTATION_PACKAGE.gate, AGENT_COMPARISON_REUSE_SEGMENT_EXPANSION_NEXT_GATE);
assert(AGENT_COMPARISON_NEXT_IMPLEMENTATION_PACKAGE.includedScope.some((item) => item.includes('Location Preparation')));
assert(AGENT_COMPARISON_NEXT_IMPLEMENTATION_PACKAGE.includedScope.some((item) => item.includes('Buyer Preparation')));
assert(AGENT_COMPARISON_NEXT_IMPLEMENTATION_PACKAGE.excludedScope.some((item) => item.includes('Cohort-N')));
assert.equal(Object.values(AGENT_COMPARISON_REVIEW_PROTECTED_BOUNDARIES).every((value) => value === false), true);

const reviewSource = fs.readFileSync('lib/agentComparisonReuseSegmentExpansionAdmissionReview.ts', 'utf8');
assert.doesNotMatch(reviewSource, /from ['"]next\/server|from ['"]react|PrismaClient|fetch\(|process\.env|sendEmail|CRMTask|\.create\(|\.update\(|\.upsert\(|\.delete\(/);

const doc = fs.readFileSync('docs/project-atlas/executive-library/AGENT-COMPARISON-REUSE-AND-SEGMENT-EXPANSION-ADMISSION-REVIEW.md', 'utf8');
for (const required of [
  'AGENT_COMPARISON_REUSE_AND_SEGMENT_EXPANSION_REVIEW_CERTIFIED',
  'Wave 3 implementation audit',
  'Surface reuse ranking',
  'Per-field admission classification',
  'READY_FOR_AGENT_DECISION_COMPARISON_REUSE_AND_INTERVAL_SEMANTICS_BOUNDED_IMPLEMENTATION_WAVE_4',
]) {
  assert(doc.includes(required), `Admission review doc missing ${required}`);
}

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };
assert.equal(packageJson.scripts?.['check:agent-comparison-reuse-segment-expansion-admission-review'], 'jiti scripts/checkAgentComparisonReuseSegmentExpansionAdmissionReview.ts');

console.log('AGENT_COMPARISON_REUSE_SEGMENT_EXPANSION_ADMISSION_REVIEW_CHECK: PASS');
