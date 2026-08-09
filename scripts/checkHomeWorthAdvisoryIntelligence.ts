import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  ADVISORY_HANDOFF_INTELLIGENCE_STATUS,
  HOME_WORTH_INTELLIGENCE_ADVANCEMENT_STATUS,
  buildAdvisoryPreparationIntelligenceModel,
  buildHomeWorthIntelligenceModel,
} from '../lib/homeWorthAdvisoryIntelligence.js';
import { getReieSourceRegistry } from '../lib/sourceRegistry.js';

function read(path: string) {
  return readFileSync(path, 'utf8');
}

function assertIncludes(source: string, value: string, message: string) {
  assert(source.includes(value), message);
}

function assertNotIncludes(source: string, value: string, message: string) {
  assert(!source.includes(value), message);
}

const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfig = read('tsconfig.worker.json');
const homeWorthPage = read('app/home-worth/page.tsx');
const advisoryGuide = read('components/AdvisoryHandoffGuide.tsx');
const sharedModelSource = read('lib/homeWorthAdvisoryIntelligence.ts');
const chatStart = read('docs/CHAT_START.md');
const executiveRecord = read('docs/project-atlas/executive-library/REIE-HOME-WORTH-ADVISORY-INTELLIGENCE-IMPLEMENTATION.md');

assert.equal(
  packageJson.scripts?.['check:home-worth-advisory-intelligence'],
  'npm run worker:build && node dist/scripts/checkHomeWorthAdvisoryIntelligence.js',
  'package.json must expose the Home Worth + Advisory Intelligence check.',
);
assertIncludes(tsconfig, 'scripts/checkHomeWorthAdvisoryIntelligence.ts', 'Worker build must include the new check.');
assertIncludes(tsconfig, 'lib/homeWorthAdvisoryIntelligence.ts', 'Worker build must include the shared Home Worth + Advisory model.');

const homeWorthModel = buildHomeWorthIntelligenceModel();
assert.equal(homeWorthModel.status, HOME_WORTH_INTELLIGENCE_ADVANCEMENT_STATUS);
assert.equal(homeWorthModel.governingQuestion, 'What evidence can REIE help me understand about my property and current market context before I discuss value and pricing with a real estate professional?');
assert.deepEqual(
  homeWorthModel.steps.map((step) => step.key),
  ['PROPERTY_EVIDENCE', 'MARKET_CONTEXT', 'DERIVED_CONTEXT', 'UNKNOWN_VERIFICATION', 'PROFESSIONAL_VALUE_QUESTIONS'],
  'Home Worth must expose the authorized evidence-preparation sequence.',
);
assert.deepEqual(
  homeWorthModel.customerSequence,
  ['PROPERTY_EVIDENCE', 'MARKET_CONTEXT', 'WHAT_IS_UNKNOWN', 'WHAT_TO_VERIFY', 'WHAT_TO_DISCUSS_NEXT'],
  'Home Worth customer sequence must match the authorized preparation model.',
);

for (const step of homeWorthModel.steps) {
  assert(step.label.length > 0, `Home Worth step ${step.key} must have a label.`);
  assert(step.evidence.length > 0, `Home Worth step ${step.key} must have evidence.`);
  assert(step.meaning.length > 0, `Home Worth step ${step.key} must have meaning.`);
  assert(step.unknown.length > 0, `Home Worth step ${step.key} must have unknowns.`);
  assert(step.verify.length > 0, `Home Worth step ${step.key} must have verification guidance.`);
  assert(step.href.startsWith('/') || step.href.startsWith('#'), `Home Worth step ${step.key} must use internal continuation.`);
  assert(step.sourceIds.length > 0, `Home Worth step ${step.key} must have source traceability.`);
}

for (const boundary of Object.values(homeWorthModel.protectedBoundaries)) {
  assert.equal(boundary, false, 'Home Worth protected boundaries must remain false.');
}

assert(homeWorthModel.continuityLinks.some((link) => link.href === '/sell'), 'Home Worth must continue to Seller.');
assert(homeWorthModel.continuityLinks.some((link) => link.href === '/sources'), 'Home Worth must continue to Source Registry.');
assert(homeWorthModel.continuityLinks.some((link) => link.href === '/contact#advisory-readiness'), 'Home Worth must continue to Advisory.');

const advisoryModel = buildAdvisoryPreparationIntelligenceModel();
assert.equal(advisoryModel.status, ADVISORY_HANDOFF_INTELLIGENCE_STATUS);
assert.equal(advisoryModel.governingQuestion, 'What have I learned, what remains unresolved, and what should I discuss with a professional next?');
assert.deepEqual(
  advisoryModel.contexts.map((context) => context.key),
  ['BUYING', 'SELLING', 'PROPERTY_SPECIFIC', 'COMPARISON', 'FINANCING', 'PLACE_MARKET', 'LINKED_BUY_SELL'],
  'Advisory must expose the authorized decision contexts.',
);
assert.deepEqual(
  advisoryModel.professionalDomains.map((domain) => domain.key),
  [
    'REAL_ESTATE_AGENT_DISCUSSION',
    'LENDER_DISCUSSION',
    'INSPECTOR_ENGINEER_DISCUSSION',
    'ATTORNEY_DISCUSSION',
    'TAX_PROFESSIONAL_DISCUSSION',
    'APPRAISER_DISCUSSION',
  ],
  'Advisory must expose the authorized professional routing domains.',
);

for (const context of advisoryModel.contexts) {
  assert(context.knownEvidence.length > 0, `Advisory context ${context.key} must identify known evidence.`);
  assert(context.unresolved.length > 0, `Advisory context ${context.key} must identify unresolved questions.`);
  assert(context.nextQuestion.length > 0, `Advisory context ${context.key} must include a next question.`);
}

for (const domain of advisoryModel.professionalDomains) {
  assert(domain.routeBy.length > 0, `Advisory domain ${domain.key} must include routing guidance.`);
  assert(domain.bring.length > 0, `Advisory domain ${domain.key} must include what to bring.`);
  assert(domain.boundary.length > 0, `Advisory domain ${domain.key} must include a boundary.`);
}

for (const boundary of Object.values(advisoryModel.protectedBoundaries)) {
  assert.equal(boundary, false, 'Advisory protected boundaries must remain false.');
}

const registry = getReieSourceRegistry();
const assessor = registry.records.find((record) => record.sourceId === 'SRC-BOULDER-COUNTY-ASSESSOR');
const bcodAddress = registry.records.find((record) => record.sourceId === 'SRC-BCOD-ADDRESS-POINTS');
const bcodParks = registry.records.find((record) => record.sourceId === 'SRC-BCOD-PARK-BOUNDARIES');
assert.equal(assessor?.productionActivationState, 'AWAITING_PROVIDER_CONFIRMATION', 'Boulder County Assessor must remain awaiting provider confirmation.');
assert.equal(assessor?.claimEligible, false, 'Boulder County Assessor must remain not claim eligible.');
assert.equal(bcodAddress?.productionActivationState, 'BLOCKED_NOT_AUTHORIZED', 'BCOD Address Points must remain blocked.');
assert.equal(bcodParks?.productionActivationState, 'BLOCKED_NOT_AUTHORIZED', 'BCOD Park Boundaries must remain blocked.');
assert.equal(registry.protectedBoundaries.providerActivation, false);
assert.equal(registry.protectedBoundaries.bcodActivation, false);
assert.equal(registry.protectedBoundaries.assessorRetrieval, false);
assert.equal(registry.protectedBoundaries.persistence, false);
assert.equal(registry.protectedBoundaries.telemetry, false);
assert.equal(registry.protectedBoundaries.customerDataMutation, false);

for (const marker of [
  'buildHomeWorthIntelligenceModel',
  'data-testid="home-worth-intelligence-advancement"',
  'data-testid="home-worth-intelligence-step"',
  'data-testid="home-worth-intelligence-source-posture"',
  'data-testid="home-worth-advisory-continuity"',
  'data-home-worth-intelligence-automated-value={String(homeWorthIntelligence.protectedBoundaries.automatedHomeValue)}',
  'data-home-worth-intelligence-avm={String(homeWorthIntelligence.protectedBoundaries.avm)}',
  'data-home-worth-intelligence-appraisal={String(homeWorthIntelligence.protectedBoundaries.appraisal)}',
  'data-home-worth-intelligence-guaranteed-sale-price={String(homeWorthIntelligence.protectedBoundaries.guaranteedSalePrice)}',
  'data-home-worth-intelligence-definitive-listing-price={String(homeWorthIntelligence.protectedBoundaries.definitiveListingPrice)}',
  'data-home-worth-intelligence-expected-appreciation={String(homeWorthIntelligence.protectedBoundaries.expectedAppreciation)}',
  'data-home-worth-intelligence-predicted-buyer-demand={String(homeWorthIntelligence.protectedBoundaries.predictedBuyerDemand)}',
  'data-home-worth-intelligence-predicted-days-on-market={String(homeWorthIntelligence.protectedBoundaries.predictedDaysOnMarket)}',
  'data-home-worth-intelligence-guaranteed-net-proceeds={String(homeWorthIntelligence.protectedBoundaries.guaranteedNetProceeds)}',
  'data-home-worth-intelligence-provider-activation={String(homeWorthIntelligence.protectedBoundaries.providerActivation)}',
  'data-home-worth-intelligence-bcod-activation={String(homeWorthIntelligence.protectedBoundaries.bcodActivation)}',
  'data-home-worth-intelligence-hidden-state-transfer={String(homeWorthIntelligence.protectedBoundaries.hiddenStateTransfer)}',
]) {
  assertIncludes(homeWorthPage, marker, `Home Worth page missing marker: ${marker}`);
}

for (const marker of [
  'buildAdvisoryPreparationIntelligenceModel',
  'data-testid="advisory-preparation-intelligence"',
  'data-testid="advisory-decision-context"',
  'data-testid="advisory-professional-domain-route"',
  'data-advisory-hidden-search-transfer={String(advisoryPreparation.protectedBoundaries.hiddenSearchTransfer)}',
  'data-advisory-hidden-comparison-transfer={String(advisoryPreparation.protectedBoundaries.hiddenComparisonTransfer)}',
  'data-advisory-hidden-financing-transfer={String(advisoryPreparation.protectedBoundaries.hiddenFinancingTransfer)}',
  'data-advisory-hidden-grand-plan-transfer={String(advisoryPreparation.protectedBoundaries.hiddenGrandPlanTransfer)}',
  'data-advisory-hidden-seller-transfer={String(advisoryPreparation.protectedBoundaries.hiddenSellerTransfer)}',
  'data-advisory-new-required-fields={String(advisoryPreparation.protectedBoundaries.newRequiredFields)}',
  'data-advisory-contact-mutation={String(advisoryPreparation.protectedBoundaries.contactMutation)}',
  'data-advisory-property-inquiry-mutation={String(advisoryPreparation.protectedBoundaries.propertyInquiryMutation)}',
  'data-advisory-crm-email={String(advisoryPreparation.protectedBoundaries.crmEmail)}',
  'data-advisory-lead-scoring={String(advisoryPreparation.protectedBoundaries.leadScoring)}',
  'data-advisory-brokerage-relationship={String(advisoryPreparation.protectedBoundaries.brokerageRelationship)}',
  'data-advisory-provider-activation={String(advisoryPreparation.protectedBoundaries.providerActivation)}',
]) {
  assertIncludes(advisoryGuide, marker, `Advisory guide missing marker: ${marker}`);
}

for (const forbiddenRuntime of [
  'fetch(',
  'PrismaClient',
  'createClient(',
  'process.env',
  'localStorage',
  'sessionStorage',
  'document.cookie',
  'navigator.sendBeacon',
  '<form',
  '<input',
  '<textarea',
  'FormData',
  'sendEmail',
  'sendPropertyInquiryNotification',
]) {
  assertNotIncludes(sharedModelSource, forbiddenRuntime, `Shared model must not use runtime/provider/persistence/contact primitive: ${forbiddenRuntime}`);
  assertNotIncludes(advisoryGuide, forbiddenRuntime, `Advisory guide must not add runtime/provider/persistence/contact primitive: ${forbiddenRuntime}`);
}

for (const prohibitedActivation of [
  'data-home-worth-intelligence-automated-value="true"',
  'data-home-worth-intelligence-avm="true"',
  'data-home-worth-intelligence-appraisal="true"',
  'data-home-worth-intelligence-guaranteed-sale-price="true"',
  'data-home-worth-intelligence-definitive-listing-price="true"',
  'data-home-worth-intelligence-expected-appreciation="true"',
  'data-home-worth-intelligence-predicted-buyer-demand="true"',
  'data-home-worth-intelligence-predicted-days-on-market="true"',
  'data-home-worth-intelligence-guaranteed-net-proceeds="true"',
  'data-home-worth-intelligence-provider-activation="true"',
  'data-home-worth-intelligence-bcod-activation="true"',
  'data-advisory-contact-mutation="true"',
  'data-advisory-crm-email="true"',
  'data-advisory-lead-scoring="true"',
  'data-advisory-brokerage-relationship="true"',
  'data-advisory-provider-activation="true"',
  'brokerage relationship is created',
  'agency relationship is created',
  'representation is created',
  'fiduciary relationship is created',
]) {
  assertNotIncludes([homeWorthPage, advisoryGuide, sharedModelSource].join('\n'), prohibitedActivation, `Home Worth + Advisory must not include prohibited activation: ${prohibitedActivation}`);
}

for (const recordMarker of [
  'HOME_WORTH_ADVISORY_INTELLIGENCE_LOCALLY_CERTIFIED',
  'PROPERTY EVIDENCE -> MARKET CONTEXT -> WHAT IS UNKNOWN -> WHAT TO VERIFY -> WHAT TO DISCUSS NEXT',
  'Boulder County Assessor remains AWAITING_PROVIDER_CONFIRMATION',
  'BCOD Address Points remains BLOCKED_NOT_AUTHORIZED',
  'No push occurred',
  'No deployment occurred',
]) {
  assertIncludes(executiveRecord, recordMarker, `Executive record missing marker: ${recordMarker}`);
}

assertIncludes(chatStart, 'HOME_WORTH_ADVISORY_INTELLIGENCE_LOCALLY_CERTIFIED', 'CHAT_START must expose the latest local handoff.');
assertIncludes(chatStart, 'READY_FOR_HOME_WORTH_ADVISORY_INTELLIGENCE_PRODUCTION_PUSH_AUTHORIZATION', 'CHAT_START must expose the next push gate.');

console.log('Home Worth + Advisory Intelligence validation passed.');
