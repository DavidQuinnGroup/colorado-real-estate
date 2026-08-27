import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  buildSellerDecisionBriefV2,
  SELLER_DECISION_BRIEF_NARRATIVE_KINDS,
  SELLER_DECISION_BRIEF_NARRATIVE_VERSION,
  SELLER_DECISION_BRIEF_STRATEGY_VERSION,
  SELLER_DECISION_BRIEF_V2_NEXT_GATE,
  SELLER_DECISION_BRIEF_V2_PRODUCT_STATUS,
  SELLER_DECISION_BRIEF_V2_STATUS,
  SELLER_DECISION_BRIEF_V2_VERSION,
  visualComponentForNarrative,
} from '../lib/sellerDecisionBriefV2';
import {
  SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_STATUS,
  SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_VERSION,
} from '../lib/sellerDecisionBriefCompositionPreview';
import { SELLER_DECISION_BRIEF_CONTENT_VERSION } from '../lib/sellerDecisionBriefFoundation';

const contract = readFileSync('lib/sellerDecisionBriefV2.ts', 'utf8');
const component = readFileSync('components/agent/SellerDecisionBriefCompositionPreview.tsx', 'utf8');
const report = readFileSync('docs/project-atlas/executive-library/SELLER-DECISION-BRIEF-V2-CERTIFICATION.md', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

assert.equal(SELLER_DECISION_BRIEF_V2_STATUS, 'SELLER_DECISION_BRIEF_V2_CERTIFIED');
assert.equal(SELLER_DECISION_BRIEF_V2_VERSION, 'SELLER_DECISION_BRIEF_V2');
assert.equal(SELLER_DECISION_BRIEF_NARRATIVE_VERSION, 'SELLER_DECISION_BRIEF_NARRATIVE_V1');
assert.equal(SELLER_DECISION_BRIEF_STRATEGY_VERSION, 'SELLER_DECISION_BRIEF_STRATEGY_V1');
assert.equal(SELLER_DECISION_BRIEF_V2_NEXT_GATE, 'READY_FOR_SELLER_PRICING_POSITIONING_DECISION_ARCHITECTURE');
assert.equal(SELLER_DECISION_BRIEF_V2_PRODUCT_STATUS, 'SELLER_DECISION_BRIEF_V2_NARRATIVE_STRATEGY_DEPTH_CERTIFIED_PRICING_FINANCIAL_PDF_SHARE_HELD');

const v2 = buildSellerDecisionBriefV2();
assert.equal(v2.status, SELLER_DECISION_BRIEF_V2_STATUS);
assert.equal(v2.version, SELLER_DECISION_BRIEF_V2_VERSION);
assert.equal(v2.baseV1Version, SELLER_DECISION_BRIEF_CONTENT_VERSION);
assert.equal(v2.compositionPreviewVersion, SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_VERSION);
assert.equal(v2.compositionPreviewStatus, SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_STATUS);
assert.equal(v2.route, '/agent/prepare/seller/presentation');
assert.equal(v2.sectionPresentations.length, 13);
assert.equal(v2.narratives.length, 13);
assert.equal(v2.sectionTransitions.length, 11);
assert.equal(v2.differentiators.length, 3);
assert.equal(v2.strategyElements.length, 4);
assert.equal(v2.alternatives.length, 3);
assert.equal(v2.nextDecisions.length, 3);
assert.equal(v2.storyLayers.length, 10);
assert.equal(v2.v1ToV2Trace.length, 19);
assert.equal(v2.questionCoverageV2.length, 16);
assert.equal(v2.readiness.narrative, 'EVIDENCE_LINKED_AGENT_REVIEW_REQUIRED');
assert.equal(v2.readiness.recommendation, 'IMPLEMENTED_AGENT_RECOMMENDATION_REVIEW_REQUIRED');
assert.equal(v2.readiness.pdf, 'NOT_IMPLEMENTED');
assert.equal(v2.readiness.shareDelivery, 'NOT_IMPLEMENTED');
assert.equal(v2.readiness.pricingDecisionArchitecture, 'NEXT_GATE');

for (const kind of SELLER_DECISION_BRIEF_NARRATIVE_KINDS) {
  assert(v2.narratives.some((unit) => unit.kind === kind), `missing narrative kind ${kind}`);
  assert(contract.includes(kind), `contract missing narrative kind token ${kind}`);
  assert(visualComponentForNarrative(kind), `missing visual mapping for ${kind}`);
}

for (const unit of v2.narratives) {
  assert(unit.id.startsWith('seller-v2-'), `${unit.id} must use the V2 namespace`);
  assert.equal(unit.product, 'SELLER_PRESENTATION');
  assert.equal(unit.audience, 'SELLER');
  assert.equal(unit.version, SELLER_DECISION_BRIEF_NARRATIVE_VERSION);
  assert(unit.headline.length > 0, `${unit.id} must have a headline`);
  assert(unit.summary.length > 0, `${unit.id} must have a summary`);
  assert(unit.points.length > 0, `${unit.id} must have points`);
  assert(unit.evidenceReferenceIds.length > 0, `${unit.id} must have evidence`);
  assert(unit.limitations.length > 0, `${unit.id} must preserve limitations`);
  assert(unit.agentAuthorship.authorIdentity === 'PROJECT_ATLAS_REFERENCE_AGENT');
  assert.equal(unit.agentAuthorship.editState, 'SESSION_SAFE_REVIEW_ONLY');
  if (['AGENT_INTERPRETATION', 'AGENT_RECOMMENDATION'].includes(unit.classification)) {
    assert.equal(unit.agentAuthorship.required, true, `${unit.id} must require Agent authorship`);
  }
}

for (const transition of v2.sectionTransitions) {
  assert(transition.fromSectionId.startsWith('seller-brief-'));
  assert(transition.toSectionId.startsWith('seller-brief-'));
  assert(transition.sellerQuestion.length > 0);
  assert(transition.bridgeMessage.length > 0);
  assert(transition.evidenceReferenceIds.length > 0);
  assert.equal(transition.reviewState, 'AGENT_REVIEW_REQUIRED');
}

for (const differentiator of v2.differentiators) {
  assert(['LEAD', 'SUPPORT', 'CONTEXT'].includes(differentiator.type));
  assert(differentiator.sourceFact.length > 0);
  assert(differentiator.agentInterpretation.length > 0);
  assert(differentiator.buyerRelevance.length > 0);
  assert(differentiator.evidenceReferenceIds.length > 0);
}

for (const strategy of v2.strategyElements) {
  assert(['POSITIONING', 'PREPARATION', 'LAUNCH', 'RECOMMENDATION'].includes(strategy.id));
  assert(strategy.inputs.length > 0);
  assert(strategy.evidenceReferenceIds.length > 0);
  assert(strategy.agentRationale.length > 0);
  assert(strategy.alternatives.length > 0);
}

for (const alternative of v2.alternatives) {
  assert(alternative.name.length > 0);
  assert(alternative.potentialAdvantages.length > 0);
  assert(alternative.tradeoffs.length > 0);
  assert(alternative.dependencies.length > 0);
  assert(alternative.evidenceReferenceIds.length > 0);
}

for (const key of ['property', 'location', 'market', 'competition', 'agentInput', 'handoff'] as const) {
  assert(v2.recommendationEvidenceMap[key].length > 0, `recommendation evidence map missing ${key}`);
}

for (const question of [
  'What are we trying to accomplish?',
  'What makes my property distinctive?',
  'How does my location shape the sale?',
  'What market are we entering?',
  'What choices will buyers see?',
  'How does my property compare to those choices?',
  'Where does my property stand out?',
  'What requires context?',
  'What should we prepare?',
  'How should we present and launch?',
  'What strategy does my Agent recommend?',
  'Why?',
  'What alternatives exist?',
  'What are the tradeoffs?',
  'What do I need to decide next?',
  'What evidence supports this?',
]) {
  assert(v2.questionCoverageV2.some((row) => row.question === question), `missing V2 Seller question ${question}`);
}

for (const primitive of [
  'NARRATIVE CONTRACT',
  'SECTION TRANSITION',
  'EVIDENCE-LINKED INTERPRETATION',
  'POSITIONING / STRATEGY THEME',
  'ALTERNATIVE STRATEGY',
  'RECOMMENDATION',
  'RECOMMENDATION EVIDENCE MAP',
  'NEXT DECISION',
]) {
  assert(v2.productFamilyReuse.some((row) => row.primitive === primitive), `missing reuse primitive ${primitive}`);
}

for (const token of [
  'data-testid="seller-brief-v2-story-flow"',
  'data-testid="seller-brief-v2-section-narrative"',
  'data-testid="seller-brief-v2-section-transition"',
  'data-testid="seller-brief-v2-module-narrative"',
  'Recommendation evidence / alternatives',
  'Agent authorship',
  'SELLER_DECISION_BRIEF_V2',
]) {
  assert(component.includes(token), `V2 UI missing token ${token}`);
}

for (const forbidden of [
  'fetch(',
  'new PrismaClient',
  'prisma.',
  'supabase.',
  'typesense.',
  'MLS_GRID_TOKEN',
  'DATABASE_URL',
  'sendEmail',
  'resend',
  'localStorage',
  'sessionStorage',
  'document.cookie',
  'navigator.share',
]) {
  assert.equal(contract.includes(forbidden), false, `V2 contract must not include runtime token ${forbidden}`);
}

for (const token of [
  'SELLER_DECISION_BRIEF_V2_CERTIFIED',
  'SELLER_DECISION_BRIEF_V2',
  'SELLER_DECISION_BRIEF_NARRATIVE_V1',
  'SELLER_DECISION_BRIEF_STRATEGY_V1',
  'READY_FOR_SELLER_PRICING_POSITIONING_DECISION_ARCHITECTURE',
]) {
  assert(report.includes(token), `certification report missing ${token}`);
}

assert.equal(
  packageJson.scripts?.['check:seller-decision-brief-v2'],
  'jiti scripts/checkSellerDecisionBriefV2.ts',
);

const deterministicAgain = buildSellerDecisionBriefV2();
assert.deepEqual(deterministicAgain, v2, 'Seller Decision Brief V2 must be deterministic for fixed input');

console.log('SELLER_DECISION_BRIEF_V2_CHECK: PASS');
