import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  buildPriorReviewedBaseline,
  buildSellerPostLaunchCurrentContextReview,
  checkpointTransitionAllowed,
  reviewStateForFinancialDependencyChange,
  reviewStateForPricingDependencyChange,
  SELLER_POST_LAUNCH_CHANGE_CLASSES,
  SELLER_POST_LAUNCH_CHECKPOINT_STATES,
  SELLER_POST_LAUNCH_CHECKPOINT_TYPES,
  SELLER_POST_LAUNCH_COMPARABILITY_STATES,
  SELLER_POST_LAUNCH_CURRENT_CONTEXT_REVIEW_NEXT_GATE,
  SELLER_POST_LAUNCH_CURRENT_CONTEXT_REVIEW_PRODUCT_STATUS,
  SELLER_POST_LAUNCH_CURRENT_CONTEXT_REVIEW_STATUS,
  SELLER_POST_LAUNCH_CURRENT_CONTEXT_REVIEW_VERSION,
  SELLER_POST_LAUNCH_DECISION_TYPES,
  SELLER_POST_LAUNCH_EVIDENCE_CLASSES,
  SELLER_POST_LAUNCH_RESPONSE_INPUT_CLASSES,
  SELLER_POST_LAUNCH_REVIEW_VERSION,
  SELLER_POST_LAUNCH_TRIGGER_TYPES,
  SELLER_UPDATE_PRODUCT_VERSION,
  SELLER_UPDATE_VISUAL_COMPONENTS,
} from '../lib/sellerPostLaunchCurrentContextReview';
import { SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_VERSION } from '../lib/sellerPricingPositioningDecisionFramework';
import { SELLER_DECISION_BRIEF_V2_VERSION } from '../lib/sellerDecisionBriefV2';
import { CURRENT_COMPETING_LISTING_CONTEXT_VERSION } from '../lib/agentCurrentCompetingListingContext';
import { AGENT_CURRENT_SNAPSHOT_COMPARISON_VERSION } from '../lib/agentCurrentSnapshotComparison';
import { REIE_FINANCIAL_DECISION_PREPARATION_VERSION } from '../lib/financialDecisionPreparationContract';

const contractSource = readFileSync('lib/sellerPostLaunchCurrentContextReview.ts', 'utf8');
const componentSource = readFileSync('components/agent/SellerDecisionBriefCompositionPreview.tsx', 'utf8');
const reportSource = readFileSync('docs/project-atlas/executive-library/SELLER-POST-LAUNCH-CURRENT-CONTEXT-REVIEW-V1-CERTIFICATION.md', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

assert.equal(SELLER_POST_LAUNCH_CURRENT_CONTEXT_REVIEW_STATUS, 'SELLER_POST_LAUNCH_CURRENT_CONTEXT_REVIEW_V1_CERTIFIED_WITH_HOLDS');
assert.equal(SELLER_POST_LAUNCH_CURRENT_CONTEXT_REVIEW_VERSION, 'SELLER_POST_LAUNCH_CURRENT_CONTEXT_REVIEW_V1');
assert.equal(SELLER_POST_LAUNCH_REVIEW_VERSION, 'SELLER_POST_LAUNCH_REVIEW_V1');
assert.equal(SELLER_UPDATE_PRODUCT_VERSION, 'SELLER_UPDATE_PRODUCT_V1');
assert.equal(SELLER_POST_LAUNCH_CURRENT_CONTEXT_REVIEW_NEXT_GATE, 'READY_FOR_OUTPUT_VERSION_AND_REUSE_ARCHITECTURE');
assert.equal(
  SELLER_POST_LAUNCH_CURRENT_CONTEXT_REVIEW_PRODUCT_STATUS,
  'SELLER_POST_LAUNCH_CURRENT_CONTEXT_REVIEW_V1_CERTIFIED_WITH_OUTPUT_REUSE_FINANCIAL_PDF_SHARE_HELD',
);

const review = buildSellerPostLaunchCurrentContextReview();
assert.equal(review.status, SELLER_POST_LAUNCH_CURRENT_CONTEXT_REVIEW_STATUS);
assert.equal(review.version, SELLER_POST_LAUNCH_CURRENT_CONTEXT_REVIEW_VERSION);
assert.equal(review.reviewVersion, SELLER_POST_LAUNCH_REVIEW_VERSION);
assert.equal(review.sellerBriefVersion, SELLER_DECISION_BRIEF_V2_VERSION);
assert.equal(review.pricingFrameworkVersion, SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_VERSION);
assert.equal(review.route, '/agent/prepare/seller/presentation');
assert.equal(review.priorReviewedBaseline.state, 'AVAILABLE');
assert.equal(review.currentCheckpoint.currentState, 'SELLER_DECISION_REQUIRED');
assert.equal(review.nextCheckpoint.currentState, 'NEXT_CHECKPOINT_PLANNED');
assert.equal(review.currentMarket.version, AGENT_CURRENT_SNAPSHOT_COMPARISON_VERSION);
assert.equal(review.currentCompetition.version, CURRENT_COMPETING_LISTING_CONTEXT_VERSION);
assert.equal(review.sellerDecision.financialEffect, 'REVIEW_REQUIRED');
assert.equal(review.sellerDecision.pricingEffect, 'PRICING_UNCHANGED');
assert.equal(review.sellerUpdateProduct.previewReadiness, 'READY_FOR_SELLER_UPDATE');
assert.equal(review.sellerUpdateProduct.printPreview, 'FOUNDATION_IMPLEMENTED');

assert.equal(review.responseInputs.length, 9);
assert.equal(review.currentMarket.facts.length, 3);
assert.equal(review.currentCompetition.facts.length, 3);
assert.equal(review.currentSubject.facts.length, 3);
assert.equal(review.currentPricing.facts.length, 3);
assert.equal(review.marketChangeSet.length, 3);
assert.equal(review.competitionChangeSet.length, 3);
assert.equal(review.subjectChangeSet.length, 3);
assert.equal(review.reassessmentTriggers.length, 8);
assert.equal(review.sellerUpdateProduct.modules.length, 12);
assert.equal(review.questionCoverage.length, 13);
assert.equal(review.evidenceReferences.length, 9);
assert.equal(review.versionLineage.length, 18);
assert.equal(review.pricingContinuity.length, 7);
assert.equal(review.financialContinuity.length, 4);
assert.equal(review.productFamilyReuse.length, 9);
assert.equal(review.inheritedProductReuse.length, 8);

for (const state of SELLER_POST_LAUNCH_CHECKPOINT_STATES) {
  assert(contractSource.includes(state), `missing checkpoint state ${state}`);
}
for (const type of SELLER_POST_LAUNCH_CHECKPOINT_TYPES) {
  assert(contractSource.includes(type), `missing checkpoint type ${type}`);
}
for (const inputClass of SELLER_POST_LAUNCH_RESPONSE_INPUT_CLASSES) {
  assert(review.responseInputs.some((input) => input.sourceClass === inputClass), `missing response input ${inputClass}`);
}
for (const evidenceClass of SELLER_POST_LAUNCH_EVIDENCE_CLASSES) {
  assert(review.evidenceReferences.some((evidence) => evidence.evidenceClass === evidenceClass), `missing evidence class ${evidenceClass}`);
}
const allChanges = [...review.marketChangeSet, ...review.competitionChangeSet, ...review.subjectChangeSet];
for (const changeClass of SELLER_POST_LAUNCH_CHANGE_CLASSES) {
  assert(allChanges.some((entry) => entry.changeClass === changeClass) || review.currentPricing.facts.some((fact) => fact.changeClass === changeClass), `missing change class ${changeClass}`);
}
for (const comparability of SELLER_POST_LAUNCH_COMPARABILITY_STATES) {
  assert(contractSource.includes(comparability), `missing comparability state ${comparability}`);
}
for (const triggerType of SELLER_POST_LAUNCH_TRIGGER_TYPES) {
  assert(review.reassessmentTriggers.some((trigger) => trigger.type === triggerType), `missing trigger type ${triggerType}`);
}
for (const priority of ['MONITOR', 'REVIEW', 'DECISION_REQUIRED']) {
  assert(review.reassessmentTriggers.some((trigger) => trigger.priority === priority), `missing trigger priority ${priority}`);
}
for (const decisionType of SELLER_POST_LAUNCH_DECISION_TYPES) {
  assert(contractSource.includes(decisionType), `missing decision type ${decisionType}`);
  assert(reportSource.includes(decisionType), `report missing decision type ${decisionType}`);
}
for (const visual of SELLER_UPDATE_VISUAL_COMPONENTS) {
  assert(review.sellerUpdateProduct.modules.some((module) => module.visual === visual), `missing Seller Update module visual ${visual}`);
  assert(componentSource.includes(visual), `UI missing visual token ${visual}`);
}

assert.equal(checkpointTransitionAllowed('PLANNED', 'READY_FOR_REVIEW'), true);
assert.equal(checkpointTransitionAllowed('READY_FOR_REVIEW', 'IN_REVIEW'), true);
assert.equal(checkpointTransitionAllowed('IN_REVIEW', 'AGENT_INTERPRETATION_REQUIRED'), true);
assert.equal(checkpointTransitionAllowed('AGENT_INTERPRETATION_REQUIRED', 'SELLER_DECISION_REQUIRED'), true);
assert.equal(checkpointTransitionAllowed('SELLER_DECISION_REQUIRED', 'COMPLETE'), true);
assert.equal(checkpointTransitionAllowed('COMPLETE', 'NEXT_CHECKPOINT_PLANNED'), true);
assert.equal(checkpointTransitionAllowed('PLANNED', 'COMPLETE'), false);
assert.equal(buildPriorReviewedBaseline(false).state, 'BASELINE_UNAVAILABLE');
assert.equal(reviewStateForPricingDependencyChange(false), 'READY_FOR_REVIEW');
assert.equal(reviewStateForPricingDependencyChange(true), 'REVIEW_REQUIRED');
assert.equal(reviewStateForFinancialDependencyChange(false), 'READY_FOR_REVIEW');
assert.equal(reviewStateForFinancialDependencyChange(true), 'REVIEW_REQUIRED');

assert.deepEqual(
  [review.currentMarket.domain, review.currentCompetition.domain, review.currentSubject.domain, review.currentPricing.domain],
  ['MARKET', 'COMPETITION', 'SUBJECT', 'PRICING'],
);
assert.equal(review.financialContinuity.some((row) => row.version === REIE_FINANCIAL_DECISION_PREPARATION_VERSION), true);
assert.equal(review.financialContinuity.some((row) => row.resultingReviewState === 'REVIEW_REQUIRED'), true);
assert.equal(review.pricingContinuity.some((row) => row.pricingReviewState === 'REVIEW_REQUIRED'), true);

for (const token of [
  'data-testid="seller-post-launch-current-context-review"',
  'data-testid="post-launch-review-timeline"',
  'data-testid="seller-update-preview"',
  'data-testid="post-launch-change-summary"',
  'post-launch-current-prior-market',
  'post-launch-current-prior-competition',
  'data-testid="post-launch-response-summary"',
  'data-testid="post-launch-change-card"',
  'data-testid="post-launch-positioning-status"',
  'data-testid="post-launch-pricing-status"',
  'data-testid="post-launch-agent-interpretation"',
  'data-testid="post-launch-updated-recommendation"',
  'data-testid="post-launch-seller-decision"',
  'data-testid="post-launch-next-checkpoint"',
  'data-testid="post-launch-evidence-panel"',
  'data-persistence="false"',
  'data-provider-activity="false"',
  'data-customer-data="false"',
  'data-pdf-generation="false"',
  'data-share-delivery="false"',
  'data-financial-advice="false"',
  'data-automated-pricing-recommendation="false"',
  'Post-launch review',
]) {
  assert(componentSource.includes(token), `UI missing post-launch token ${token}`);
}

for (const token of [
  'SELLER_POST_LAUNCH_CURRENT_CONTEXT_REVIEW_V1_CERTIFIED_WITH_HOLDS',
  'SELLER_POST_LAUNCH_CURRENT_CONTEXT_REVIEW_V1',
  'SELLER_POST_LAUNCH_REVIEW_V1',
  'SELLER_UPDATE_PRODUCT_V1',
  'READY_FOR_OUTPUT_VERSION_AND_REUSE_ARCHITECTURE',
  'SELLER_POST_LAUNCH_CURRENT_CONTEXT_REVIEW_V1_CERTIFIED_WITH_OUTPUT_REUSE_FINANCIAL_PDF_SHARE_HELD',
]) {
  assert(reportSource.includes(token), `certification report missing ${token}`);
}

for (const [boundary, value] of Object.entries(review.protectedBoundaries)) {
  assert.equal(value, false, `protected boundary ${boundary} must remain false`);
}

for (const forbidden of [
  'PrismaClient',
  'prisma.',
  'supabase.',
  'typesense.',
  'fetch(',
  'MLS_GRID_TOKEN',
  'DATABASE_URL',
  'sendEmail',
  'resend',
  'localStorage',
  'sessionStorage',
  'document.cookie',
  'navigator.share',
]) {
  assert.equal(contractSource.includes(forbidden), false, `post-launch contract must not include runtime token ${forbidden}`);
}

assert.equal(
  packageJson.scripts?.['check:seller-post-launch-current-context-review'],
  'jiti scripts/checkSellerPostLaunchCurrentContextReview.ts',
);
assert.deepEqual(buildSellerPostLaunchCurrentContextReview(), review, 'post-launch review fixture must be deterministic');

console.log('SELLER_POST_LAUNCH_CURRENT_CONTEXT_REVIEW_CHECK: PASS');
