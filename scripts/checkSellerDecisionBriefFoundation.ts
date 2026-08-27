import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  ATLAS_OUTPUT_MODULE_KINDS,
  ATLAS_OUTPUT_SECTION_KINDS,
} from '../lib/sharedOutputProductComposition';
import {
  buildSellerDecisionBrief,
  SELLER_DECISION_BRIEF_ADAPTERS,
  SELLER_DECISION_BRIEF_CONTENT_VERSION,
  SELLER_DECISION_BRIEF_FOUNDATION_STATUS,
  SELLER_DECISION_BRIEF_NEXT_GATE,
  SELLER_DECISION_BRIEF_QUESTION_COVERAGE,
  SELLER_DECISION_BRIEF_REFERENCE_PREPARATION,
} from '../lib/sellerDecisionBriefFoundation';

const source = readFileSync('lib/sellerDecisionBriefFoundation.ts', 'utf8');
const shared = readFileSync('lib/sharedOutputProductComposition.ts', 'utf8');
const report = readFileSync('docs/project-atlas/executive-library/SELLER-DECISION-BRIEF-FOUNDATION-V1-CERTIFICATION.md', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

assert.equal(SELLER_DECISION_BRIEF_FOUNDATION_STATUS, 'SELLER_DECISION_BRIEF_FOUNDATION_V1_CERTIFIED');
assert.equal(SELLER_DECISION_BRIEF_CONTENT_VERSION, 'SELLER_DECISION_BRIEF_FOUNDATION_V1');
assert.equal(SELLER_DECISION_BRIEF_NEXT_GATE, 'READY_FOR_SELLER_PRESENTATION_COMPOSITION_REVIEW_EXPERIENCE');

for (const sectionKind of ['CONTEXT', 'PROPERTY', 'LOCATION', 'MARKET', 'COMPETITION', 'POSITIONING', 'PREPARATION', 'LAUNCH', 'RECOMMENDATIONS', 'TIMELINE', 'NEXT_DECISIONS', 'EVIDENCE_APPENDIX']) {
  assert(ATLAS_OUTPUT_SECTION_KINDS.includes(sectionKind as never), `shared registry missing Seller section kind ${sectionKind}`);
}

for (const moduleKind of ['DECISION_SNAPSHOT', 'OBJECTIVES', 'TIMING_CONSTRAINTS', 'PROPERTY_HERO', 'FACT_GRID', 'PROPERTY_STRENGTHS', 'LOCATION_STORY', 'POSITIONING_THEMES', 'PREPARATION_PLAN', 'ASSET_PLAN', 'LAUNCH_PLAN', 'RECOMMENDATION_CARD', 'SELLER_JOURNEY', 'NEXT_DECISIONS', 'EVIDENCE_PANEL']) {
  assert(ATLAS_OUTPUT_MODULE_KINDS.includes(moduleKind as never), `shared registry missing Seller module kind ${moduleKind}`);
}

const brief = buildSellerDecisionBrief(SELLER_DECISION_BRIEF_REFERENCE_PREPARATION);
assert.equal(brief.status, SELLER_DECISION_BRIEF_FOUNDATION_STATUS);
assert.equal(brief.contentVersion, SELLER_DECISION_BRIEF_CONTENT_VERSION);
assert.equal(brief.outputProduct.productKind, 'SELLER_PRESENTATION');
assert.equal(brief.outputProduct.context.audience, 'SELLER');
assert.equal(brief.outputProduct.context.subject.kind, 'PROPERTY');
assert.equal(brief.outputProduct.readiness, 'AGENT_REVIEW_REQUIRED');
assert.equal(brief.readiness.product, 'AGENT_REVIEW_REQUIRED');
assert.equal(brief.readiness.visualPresentation, 'NOT_IMPLEMENTED');
assert.equal(brief.readiness.ui, 'NOT_IMPLEMENTED');
assert.equal(brief.readiness.printPdf, 'NOT_IMPLEMENTED');
assert.equal(brief.nextGate, SELLER_DECISION_BRIEF_NEXT_GATE);

assert.equal(brief.sectionRegistry.length, 13, 'Seller Decision Brief must have 13 V1 sections.');
assert.equal(brief.moduleRegistry.length, 19, 'Seller Decision Brief must have 19 P0 modules.');
assert.equal(brief.outputProduct.sections.length, 13);
assert.equal(brief.outputProduct.sections[0].id, 'seller-brief-executive-summary');
assert.equal(brief.outputProduct.sections.at(-1)?.id, 'seller-brief-evidence-appendix');
assert.deepEqual(brief.outputProduct.sections.map((section) => section.order), [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130]);
assert.deepEqual(brief.outputProduct.sections.flatMap((section) => section.modules).map((module) => module.order), Array.from({ length: 19 }, (_, index) => (index + 1) * 10));

for (const entry of brief.moduleRegistry) {
  assert(entry.moduleId.startsWith('seller-module-'), `${entry.moduleId} must use Seller module namespace.`);
  assert(brief.sectionRegistry.includes(entry.sectionId), `${entry.moduleId} references unknown section.`);
  assert(entry.evidenceIds.length > 0, `${entry.moduleId} must carry evidence references.`);
  assert(entry.priority === 'P0' || entry.priority === 'APPENDIX', `${entry.moduleId} must be P0 or appendix in V1.`);
  assert(['SOURCE_FACT', 'ATLAS_INTELLIGENCE', 'ATLAS_ANALYSIS_REFERENCE', 'AGENT_INTERPRETATION', 'AGENT_RECOMMENDATION', 'ASSUMPTION', 'LIMITATION', 'PROFESSIONAL_HANDOFF'].includes(entry.classification));
}

const atlasModules = brief.outputProduct.sections.flatMap((section) => section.modules);
assert(atlasModules.some((module) => module.id === 'seller-module-property-hero' && module.inputType === 'ATLAS_INTELLIGENCE'));
assert(atlasModules.some((module) => module.id === 'seller-module-recommendation-card' && module.inputType === 'AGENT_INPUT'));
assert(atlasModules.some((module) => module.id === 'seller-module-evidence-panel' && module.inputType === 'EVIDENCE_APPENDIX'));
assert.equal(atlasModules.some((module) => module.id === 'seller-module-condition-review'), false, 'legacy condition-review module must not appear in V1 registry.');

const recommendation = atlasModules.find((module) => module.id === 'seller-module-recommendation-card');
assert(recommendation, 'recommendation card must exist');
assert.equal(recommendation.inclusionState, 'UNAVAILABLE_RIGHTS');
assert(recommendation.blockingReasons.includes('MODULE_RIGHTS_REVIEW_REQUIRED'));

const conditionDependent = atlasModules.find((module) => module.id === 'seller-module-preparation-plan');
assert(conditionDependent, 'preparation plan must exist');
assert.equal(conditionDependent.inclusionState, 'UNAVAILABLE_EVIDENCE');

assert.equal(SELLER_DECISION_BRIEF_ADAPTERS.length, 8);
for (const family of ['SELLER_PREPARATION', 'PROPERTY', 'LOCATION', 'MARKET', 'COMPETITION', 'AGENT_INPUT', 'EVIDENCE_FRESHNESS', 'ADVISORY_HANDOFF']) {
  assert(SELLER_DECISION_BRIEF_ADAPTERS.some((adapter) => adapter.family === family), `missing adapter ${family}`);
}

assert.equal(SELLER_DECISION_BRIEF_QUESTION_COVERAGE.length, 12);
for (const requiredQuestion of [
  'What are we deciding?',
  'What will buyers see in my property?',
  'How does my location affect the sale?',
  'What market am I entering?',
  'What else can buyers choose?',
  'How does my property sit in that choice set?',
  'What positioning choices matter?',
  'What should we prepare?',
  'How will we launch?',
  'What does my Agent recommend?',
  'What happens next?',
  'What evidence supports this?',
]) {
  assert(brief.questionCoverage.some((coverage) => coverage.question === requiredQuestion), `missing seller question ${requiredQuestion}`);
}
assert(brief.questionCoverage.some((coverage) => coverage.question === 'What evidence supports this?' && coverage.coverage === 'STRONG'));
assert(brief.questionCoverage.some((coverage) => coverage.question === 'What does my Agent recommend?' && coverage.coverage === 'INPUT_REQUIRED'));

const deterministicAgain = buildSellerDecisionBrief(SELLER_DECISION_BRIEF_REFERENCE_PREPARATION);
assert.deepEqual(deterministicAgain, brief, 'Seller Decision Brief must be deterministic for fixed input.');

for (const token of ['SellerDecisionBriefContentClassification', 'AGENT_RECOMMENDATION', 'AGENT_INTERPRETATION', 'SOURCE_FACT', 'ATLAS_ANALYSIS_REFERENCE', 'PROFESSIONAL_HANDOFF']) {
  assert(source.includes(token), `fact/analysis/Agent-judgment separation missing ${token}`);
}

for (const runtimeToken of ['fetch(', 'new PrismaClient', 'prisma.', 'supabase.', 'typesense.', 'MLS_GRID_TOKEN', 'DATABASE_URL', 'sendEmail', 'resend', 'localStorage', 'sessionStorage', 'document.cookie']) {
  assert.equal(source.includes(runtimeToken), false, `Seller Decision Brief foundation must not include runtime token ${runtimeToken}`);
}
assert(shared.includes('AtlasOutputModulePriority'), 'shared registry must carry module priority metadata.');
assert(shared.includes('AtlasOutputModuleInputType'), 'shared registry must carry module input metadata.');

for (const token of [
  'SELLER_DECISION_BRIEF_FOUNDATION_V1_CERTIFIED',
  'SELLER_DECISION_BRIEF_FOUNDATION_V1',
  'READY_FOR_SELLER_PRESENTATION_COMPOSITION_REVIEW_EXPERIENCE',
  'SELLER_DECISION_BRIEF_FOUNDATION_V1_CERTIFIED',
]) {
  assert(report.includes(token), `certification report missing ${token}`);
}

assert.equal(
  packageJson.scripts?.['check:seller-decision-brief-foundation'],
  'jiti scripts/checkSellerDecisionBriefFoundation.ts',
);

console.log('SELLER_DECISION_BRIEF_FOUNDATION_CHECK: PASS');
