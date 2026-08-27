import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  bandForPrice,
  belongsToSearchBand,
  buildSellerPricingPositioningDecisionFramework,
  financialReviewStateForPricingChange,
  hasAdjacentBandDoubleCount,
  SELLER_PRICING_OBJECTIVE_TYPES,
  SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_NEXT_GATE,
  SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_PRODUCT_STATUS,
  SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_STATUS,
  SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_VERSION,
  SELLER_PRICING_REASSESSMENT_TRIGGER_TYPES,
  SELLER_PRICING_SCENARIO_VERSION,
  SELLER_PRICING_SEARCH_BAND_VERSION,
  SELLER_PRICING_SUBJECT_POSITION_STATES,
  SELLER_PRICING_TRADEOFF_TYPES,
  SELLER_PRICING_VISUAL_COMPONENTS,
  subjectPositionForPrice,
} from '../lib/sellerPricingPositioningDecisionFramework';
import { SELLER_DECISION_BRIEF_V2_VERSION } from '../lib/sellerDecisionBriefV2';
import { CURRENT_COMPETING_LISTING_CONTEXT_VERSION } from '../lib/agentCurrentCompetingListingContext';
import { AGENT_CURRENT_SNAPSHOT_COMPARISON_VERSION } from '../lib/agentCurrentSnapshotComparison';
import { ATLAS_COHORT_CONTRACT_VERSION } from '../lib/atlasCohortComparativeContract';
import { REIE_FINANCIAL_DECISION_PREPARATION_VERSION } from '../lib/financialDecisionPreparationContract';

const contractSource = readFileSync('lib/sellerPricingPositioningDecisionFramework.ts', 'utf8');
const componentSource = readFileSync('components/agent/SellerDecisionBriefCompositionPreview.tsx', 'utf8');
const reportSource = readFileSync('docs/project-atlas/executive-library/SELLER-PRICING-POSITIONING-DECISION-FRAMEWORK-V1-CERTIFICATION.md', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

assert.equal(SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_STATUS, 'SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_V1_CERTIFIED_WITH_HOLDS');
assert.equal(SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_VERSION, 'SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_V1');
assert.equal(SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_NEXT_GATE, 'READY_FOR_SELLER_POST_LAUNCH_RESPONSE_INTELLIGENCE_ARCHITECTURE');
assert.equal(
  SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_PRODUCT_STATUS,
  'SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_V1_CERTIFIED_WITH_POST_LAUNCH_FINANCIAL_PDF_SHARE_HELD',
);

const framework = buildSellerPricingPositioningDecisionFramework();
assert.equal(framework.status, SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_STATUS);
assert.equal(framework.version, SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_VERSION);
assert.equal(framework.scenarioVersion, SELLER_PRICING_SCENARIO_VERSION);
assert.equal(framework.sellerBriefVersion, SELLER_DECISION_BRIEF_V2_VERSION);
assert.equal(framework.route, '/agent/prepare/seller/presentation');
assert.equal(framework.objectives.length, 10);
assert.equal(framework.currentContext.searchBands.length, 3);
assert.equal(framework.scenarios.length, 3);
assert.equal(framework.tradeoffs.length, 11);
assert.equal(framework.positioningThemes.length, 3);
assert.equal(framework.responseCheckpoints.length, 3);
assert.equal(framework.reassessmentTriggers.length, 6);
assert.equal(framework.modules.length, 12);
assert.equal(framework.questionCoverage.length, 15);
assert.equal(framework.evidenceReferences.length, 7);
assert.equal(framework.v2Integration.length, 9);
assert.equal(framework.productFamilyReuse.length, 8);
assert.equal(framework.currentContext.cohort.version, ATLAS_COHORT_CONTRACT_VERSION);
assert.equal(framework.currentContext.cohort.currentSnapshotVersion, AGENT_CURRENT_SNAPSHOT_COMPARISON_VERSION);
assert.equal(framework.currentContext.competition.version, CURRENT_COMPETING_LISTING_CONTEXT_VERSION);
assert.equal(framework.currentContext.searchBands.every((band) => band.version === SELLER_PRICING_SEARCH_BAND_VERSION), true);
assert.equal(framework.scenarios.every((scenario) => scenario.financialLink.financialPreparationVersion === REIE_FINANCIAL_DECISION_PREPARATION_VERSION), true);
assert.equal(framework.fixtureResult.selectedScenario, framework.sellerDecision.selectedScenarioId);
assert.equal(framework.fixtureResult.overallReadiness, 'READY_FOR_AGENT_REVIEW');

for (const objectiveType of SELLER_PRICING_OBJECTIVE_TYPES) {
  assert(framework.objectives.some((objective) => objective.id === objectiveType), `missing objective ${objectiveType}`);
}

for (const tradeoffType of SELLER_PRICING_TRADEOFF_TYPES) {
  assert(framework.tradeoffs.some((tradeoff) => tradeoff.id === tradeoffType), `missing tradeoff ${tradeoffType}`);
}

for (const triggerType of SELLER_PRICING_REASSESSMENT_TRIGGER_TYPES) {
  assert(framework.reassessmentTriggers.some((trigger) => trigger.type === triggerType), `missing trigger ${triggerType}`);
}

for (const component of SELLER_PRICING_VISUAL_COMPONENTS) {
  assert(framework.modules.some((module) => module.visual === component), `missing module for ${component}`);
  assert(componentSource.includes(component), `UI missing pricing visual token ${component}`);
}

const [lower, current, upper] = framework.currentContext.searchBands;
assert.equal(belongsToSearchBand(1_099_999, lower), true);
assert.equal(belongsToSearchBand(1_100_000, lower), false);
assert.equal(belongsToSearchBand(1_100_000, current), true);
assert.equal(belongsToSearchBand(1_299_999, current), true);
assert.equal(belongsToSearchBand(1_300_000, current), false);
assert.equal(belongsToSearchBand(1_300_000, upper), true);
assert.equal(belongsToSearchBand(1_500_000, upper), true);
assert.equal(hasAdjacentBandDoubleCount(1_100_000, framework.currentContext.searchBands), false);
assert.equal(hasAdjacentBandDoubleCount(1_300_000, framework.currentContext.searchBands), false);
assert.equal(bandForPrice(1_195_000, framework.currentContext.searchBands)?.id, 'seller-pricing-band-current');
assert.equal(subjectPositionForPrice(1_075_000, framework.currentContext.searchBands), 'LOWER_RANGE');
assert.equal(subjectPositionForPrice(1_195_000, framework.currentContext.searchBands), 'MID_RANGE');
assert.equal(subjectPositionForPrice(1_325_000, framework.currentContext.searchBands), 'UPPER_RANGE');
for (const position of ['LOWER_RANGE', 'MID_RANGE', 'UPPER_RANGE'] satisfies typeof SELLER_PRICING_SUBJECT_POSITION_STATES[number][]) {
  assert(framework.scenarios.some((scenario) => scenario.subjectPosition.state === position), `missing scenario position ${position}`);
}

const selected = framework.scenarios.find((scenario) => scenario.id === framework.sellerDecision.selectedScenarioId);
assert(selected);
assert.equal(selected.sellerSelectionState, 'SELLER_SELECTED');
assert.equal(selected.financialLink.financialLinkReviewState, 'READY_FOR_REVIEW');
assert.equal(financialReviewStateForPricingChange(
  { id: selected.id, version: selected.version, asOf: selected.asOf, agentRationaleVersion: selected.agentRationaleVersion, priceAssumptionValue: selected.priceAssumption.value },
  { id: selected.id, version: selected.version, asOf: selected.asOf, agentRationaleVersion: selected.agentRationaleVersion, priceAssumptionValue: selected.priceAssumption.value },
), 'READY_FOR_REVIEW');
assert.equal(financialReviewStateForPricingChange(
  { id: selected.id, version: selected.version, asOf: selected.asOf, agentRationaleVersion: selected.agentRationaleVersion, priceAssumptionValue: selected.priceAssumption.value },
  { id: selected.id, version: selected.version, asOf: selected.asOf, agentRationaleVersion: selected.agentRationaleVersion, priceAssumptionValue: selected.priceAssumption.value + 25_000 },
), 'REVIEW_REQUIRED');
assert.equal(financialReviewStateForPricingChange(
  { id: selected.id, version: selected.version, asOf: selected.asOf, agentRationaleVersion: selected.agentRationaleVersion, priceAssumptionValue: selected.priceAssumption.value },
  { id: 'seller-pricing-scenario-upper-test', version: selected.version, asOf: selected.asOf, agentRationaleVersion: selected.agentRationaleVersion, priceAssumptionValue: selected.priceAssumption.value },
), 'REVIEW_REQUIRED');
assert.equal(financialReviewStateForPricingChange(
  { id: selected.id, version: selected.version, asOf: selected.asOf, agentRationaleVersion: selected.agentRationaleVersion, priceAssumptionValue: selected.priceAssumption.value },
  { id: selected.id, version: 'SELLER_PRICING_SCENARIO_V2' as typeof selected.version, asOf: selected.asOf, agentRationaleVersion: selected.agentRationaleVersion, priceAssumptionValue: selected.priceAssumption.value },
), 'REVIEW_REQUIRED');
assert.equal(financialReviewStateForPricingChange(
  { id: selected.id, version: selected.version, asOf: selected.asOf, agentRationaleVersion: selected.agentRationaleVersion, priceAssumptionValue: selected.priceAssumption.value },
  { id: selected.id, version: selected.version, asOf: '2026-08-28', agentRationaleVersion: selected.agentRationaleVersion, priceAssumptionValue: selected.priceAssumption.value },
), 'REVIEW_REQUIRED');
assert.equal(financialReviewStateForPricingChange(
  { id: selected.id, version: selected.version, asOf: selected.asOf, agentRationaleVersion: selected.agentRationaleVersion, priceAssumptionValue: selected.priceAssumption.value },
  { id: selected.id, version: selected.version, asOf: selected.asOf, agentRationaleVersion: 'SELLER_PRICING_AGENT_RATIONALE_V2' as typeof selected.agentRationaleVersion, priceAssumptionValue: selected.priceAssumption.value },
), 'REVIEW_REQUIRED');

for (const token of [
  'seller-pricing-positioning-decision-framework',
  'pricing-executive-summary',
  'pricing-objective',
  'pricing-search-band-ladder',
  'pricing-option-card',
  'pricing-scenario-comparison',
  'pricing-positioning-effect',
  'pricing-tradeoff-matrix',
  'pricing-response-checkpoint-timeline',
  'pricing-reassessment-panel',
  'pricing-evidence-panel',
  'seller-pricing-decision-state',
  'data-financial-advice="false"',
  'Pricing framework',
]) {
  assert(componentSource.includes(token), `UI missing required pricing token ${token}`);
}

for (const boundary of Object.entries(framework.protectedBoundaries)) {
  assert.equal(boundary[1], false, `protected boundary ${boundary[0]} must remain false`);
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
  assert.equal(contractSource.includes(forbidden), false, `pricing contract must not include runtime token ${forbidden}`);
}

for (const token of [
  'SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_V1_CERTIFIED_WITH_HOLDS',
  'SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_V1',
  'SELLER_PRICING_SCENARIO_V1',
  'SELLER_PRICING_SEARCH_BAND_V1',
  'READY_FOR_SELLER_POST_LAUNCH_RESPONSE_INTELLIGENCE_ARCHITECTURE',
]) {
  assert(reportSource.includes(token), `certification report missing ${token}`);
}

assert.equal(
  packageJson.scripts?.['check:seller-pricing-positioning-decision-framework'],
  'jiti scripts/checkSellerPricingPositioningDecisionFramework.ts',
);
assert.deepEqual(buildSellerPricingPositioningDecisionFramework(), framework, 'pricing framework fixture must be deterministic');

console.log('SELLER_PRICING_POSITIONING_DECISION_FRAMEWORK_CHECK: PASS');
