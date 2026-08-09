import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  DECISION_JOURNEY_CONTINUITY_DEEPENING_STATUS,
  PROPERTY_INQUIRY_DECISION_CONTINUITY_STATUS,
  PROPERTY_INQUIRY_PREPARATION_INTELLIGENCE_STATUS,
  buildDecisionJourneyContinuityDeepening,
  buildPropertyInquiryPreparationIntelligence,
} from '../lib/propertyInquiryDecisionContinuity.js';
import { buildPropertyProduct31Model } from '../lib/propertyProduct31.js';

function read(filePath: string) {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string) {
  assert(source.includes(value), message);
}

function assertNotIncludes(source: string, value: string, message: string) {
  assert(!source.includes(value), message);
}

const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfig = read('tsconfig.worker.json');
const propertyPage = read('app/properties/[id]/page.tsx');
const productExperience = read('components/PropertyProduct31Experience.tsx');
const inquiryForm = read('components/PropertyInquiryForm.tsx');
const inquiryApi = read('app/api/property-inquiry/route.ts');
const modelSource = read('lib/propertyInquiryDecisionContinuity.ts');
const chatStart = read('docs/CHAT_START.md');
const executiveRecord = read('docs/project-atlas/executive-library/REIE-PROPERTY-INQUIRY-DECISION-CONTINUITY-IMPLEMENTATION.md');

assert.equal(
  packageJson.scripts?.['check:property-inquiry-decision-continuity'],
  'npm run worker:build && node dist/scripts/checkPropertyInquiryDecisionContinuity.js',
  'package.json must expose the Property Inquiry + Decision Continuity check.',
);
assertIncludes(tsconfig, 'scripts/checkPropertyInquiryDecisionContinuity.ts', 'Worker build must include the new check.');
assertIncludes(tsconfig, 'lib/propertyInquiryDecisionContinuity.ts', 'Worker build must include the shared continuity model.');

const propertyModel = buildPropertyProduct31Model({
  address: '100 Main St',
  city: 'Boulder',
  state: 'CO',
  zip: '80302',
  neighborhood: 'Mapleton Hill',
  propertyType: 'Residential',
  status: 'Active',
  price: 1200000,
  sqft: 2400,
  beds: 4,
  baths: 3,
  yearBuilt: 1976,
  lotSize: 0.22,
  altitude: 5400,
  soilType: 'Front Range Mixed',
  photoCount: 8,
  relatedListings: [
    {
      id: 'related-1',
      address: '102 Main St',
      city: 'Boulder',
      state: 'CO',
      neighborhood: 'Mapleton Hill',
      price: 1275000,
      beds: 4,
      baths: 3,
      sqft: 2600,
      status: 'Active',
    },
  ],
});

const inquiryPreparation = buildPropertyInquiryPreparationIntelligence({
  deepening: propertyModel.deepening,
  authoritativeSources: propertyModel.authoritativeSources,
  comparisonIntelligence: propertyModel.comparisonIntelligence,
  checklist: propertyModel.checklist,
});
const decisionContinuity = buildDecisionJourneyContinuityDeepening();

assert.equal(PROPERTY_INQUIRY_DECISION_CONTINUITY_STATUS, 'PROPERTY_INQUIRY_DECISION_CONTINUITY_IMPLEMENTED');
assert.equal(inquiryPreparation.status, PROPERTY_INQUIRY_PREPARATION_INTELLIGENCE_STATUS);
assert.equal(decisionContinuity.status, DECISION_JOURNEY_CONTINUITY_DEEPENING_STATUS);
assert.equal(
  inquiryPreparation.governingQuestion,
  'What do I know about this property, what remains uncertain, and what would be useful to ask before I contact someone about it?',
);
assert.equal(
  inquiryPreparation.relationship,
  'SOURCE_EVIDENCE_PROPERTY_INTELLIGENCE_PRE_INQUIRY_PREPARATION_USER_CONTROLLED_INQUIRY',
);
assert.deepEqual(
  inquiryPreparation.categories.map((category) => category.key),
  ['PROPERTY_FACTS', 'DERIVED_CONTEXT', 'SOURCE_EVIDENCE_POSTURE', 'UNVERIFIED_UNAVAILABLE', 'QUESTIONS_TO_CONSIDER'],
  'Inquiry preparation must expose the authorized categories.',
);
assert.deepEqual(
  inquiryPreparation.categories.map((category) => category.professionalDomain).sort(),
  ['APPRAISER', 'ATTORNEY', 'INSPECTOR_ENGINEER', 'LENDER', 'REAL_ESTATE_AGENT'],
  'Inquiry preparation must route questions to the authorized professional domains.',
);
assert(inquiryPreparation.categories.every((category) => category.href.startsWith('#')), 'Preparation categories must remain same-page and user-controlled.');
for (const boundary of Object.values(inquiryPreparation.protectedBoundaries)) {
  assert.equal(boundary, false, 'Property Inquiry preparation boundaries must remain false.');
}

assert.equal(
  decisionContinuity.governingQuestion,
  "After learning something here, is the customer's next useful REIE action clear?",
);
assert.equal(
  decisionContinuity.standard,
  'CURRENT_DECISION_RELEVANT_NEXT_QUESTION_RELEVANT_REIE_TOOL_OPTIONAL_PROFESSIONAL_HANDOFF',
);
assert.equal(decisionContinuity.primaryActions.length, 3, 'Decision continuity must expose only the three most useful next actions.');
assert.deepEqual(
  decisionContinuity.primaryActions.map((action) => action.href),
  ['#property-comparable-context', '#property-source-readiness', '#property-contact'],
  'Decision continuity must route to compare, verify, and inquiry actions.',
);
for (const boundary of Object.values(decisionContinuity.protectedBoundaries)) {
  assert.equal(boundary, false, 'Decision continuity protected boundaries must remain false.');
}
for (const alternative of ['Search', 'Market/Place', 'Financing', 'Advisory', 'Grand Plan', 'Sources']) {
  assert(decisionContinuity.preservedAlternatives.includes(alternative), `Decision continuity must preserve ${alternative}.`);
}

for (const marker of [
  'buildPropertyInquiryPreparationIntelligence',
  'data-testid="property-inquiry-preparation-intelligence"',
  'data-testid="property-inquiry-preparation-category"',
  'data-property-inquiry-preparation-status={inquiryPreparation.status}',
  'data-property-inquiry-preparation-category-count={inquiryPreparation.categories.length}',
  'data-property-inquiry-preparation-api-mutation={String(inquiryPreparation.protectedBoundaries.apiMutation)}',
  'data-property-inquiry-preparation-required-field-expansion={String(inquiryPreparation.protectedBoundaries.requiredFieldExpansion)}',
  'data-property-inquiry-preparation-hidden-payload={String(inquiryPreparation.protectedBoundaries.hiddenPayloadExpansion)}',
  'data-property-inquiry-preparation-auto-populate-notes={String(inquiryPreparation.protectedBoundaries.autoPopulateNotes)}',
  'data-property-inquiry-preparation-crm-email-change={String(inquiryPreparation.protectedBoundaries.crmEmailChange)}',
  'data-property-inquiry-preparation-persistence-change={String(inquiryPreparation.protectedBoundaries.persistenceChange)}',
  'data-property-inquiry-preparation-notification-change={String(inquiryPreparation.protectedBoundaries.notificationChange)}',
]) {
  assertIncludes(productExperience, marker, `Property Product experience missing inquiry-preparation marker: ${marker}`);
}

for (const marker of [
  'buildDecisionJourneyContinuityDeepening',
  'data-testid="property-decision-continuity-deepening"',
  'data-testid="property-decision-continuity-action"',
  'data-decision-continuity-action-count={decisionContinuityDeepening.primaryActions.length}',
  'data-decision-continuity-preserved-alternatives={decisionContinuityDeepening.preservedAlternatives.join',
  'data-decision-continuity-hidden-state-transfer={String(decisionContinuityDeepening.protectedBoundaries.hiddenStateTransfer)}',
  'data-decision-continuity-comparison-state-transfer={String(decisionContinuityDeepening.protectedBoundaries.comparisonStateTransfer)}',
  'data-decision-continuity-financing-state-transfer={String(decisionContinuityDeepening.protectedBoundaries.financingStateTransfer)}',
  'data-decision-continuity-crm-state-transfer={String(decisionContinuityDeepening.protectedBoundaries.crmStateTransfer)}',
  'data-decision-continuity-telemetry-expansion={String(decisionContinuityDeepening.protectedBoundaries.telemetryExpansion)}',
  'data-decision-continuity-suitability-scoring={String(decisionContinuityDeepening.protectedBoundaries.suitabilityScoring)}',
  'data-decision-continuity-protected-class-inference={String(decisionContinuityDeepening.protectedBoundaries.protectedClassInference)}',
]) {
  assertIncludes(propertyPage, marker, `Property page missing decision-continuity marker: ${marker}`);
}

for (const marker of [
  'data-property-inquiry-required-field-contract="email-only"',
  'data-property-inquiry-preparation-separated="true"',
  'data-property-inquiry-hidden-transfer="false"',
  'data-property-inquiry-auto-populated-notes="false"',
  'data-property-inquiry-api-change="false"',
  'data-property-inquiry-crm-email-change="false"',
  'data-property-inquiry-persistence-change="false"',
  'data-property-inquiry-notification-change="false"',
  'data-testid="property-inquiry-customer-control-notice"',
  'data-property-inquiry-customer-typed-only="true"',
  'data-property-inquiry-preparation-auto-transfer="false"',
]) {
  assertIncludes(inquiryForm, marker, `Property Inquiry form missing customer-control marker: ${marker}`);
}

for (const payloadMarker of [
  'propertyId,',
  'name: normalizedName || null,',
  'email: normalizedEmail,',
  'phone: normalizedPhone || null,',
  'timeline,',
  'notes: normalizedNotes || null,',
  "source: 'property-page',",
]) {
  assertIncludes(inquiryForm, payloadMarker, `Property Inquiry submission payload must retain ${payloadMarker}`);
}

for (const schemaMarker of [
  'type PropertyInquiryBody = {',
  'propertyId?: unknown;',
  'email?: unknown;',
  'name?: unknown;',
  'phone?: unknown;',
  'timeline?: unknown;',
  'notes?: unknown;',
  'source?: unknown;',
  "schemaVersion: 'reie-property-inquiry-v1'",
]) {
  assertIncludes(inquiryApi, schemaMarker, `Property Inquiry API contract must retain ${schemaMarker}`);
}

for (const forbidden of [
  'autoFill:',
  'autoPopulate:',
  'prefill:',
  'propertyAnalysis:',
  'comparisonState:',
  'financingAssumptions:',
  'grandPlanState:',
  'browsingHistory:',
  'savedSearch',
  'leadMetadata:',
  'leadScore',
  'hiddenContext',
  'navigator.sendBeacon',
  'document.cookie',
  'localStorage.setItem',
  'sessionStorage.setItem',
]) {
  assertNotIncludes(inquiryForm, forbidden, `Property Inquiry form must not introduce hidden transfer or tracking primitive: ${forbidden}`);
  assertNotIncludes(modelSource, forbidden, `Shared model must not introduce hidden transfer or tracking primitive: ${forbidden}`);
}

for (const forbiddenRuntime of [
  'fetch(',
  'PrismaClient',
  'createClient(',
  'process.env',
  '<form',
  '<input',
  '<textarea',
  'FormData',
  'sendEmail',
  'sendPropertyInquiryNotification',
]) {
  assertNotIncludes(modelSource, forbiddenRuntime, `Shared continuity model must remain deterministic and presentational: ${forbiddenRuntime}`);
}

for (const prohibitedActivation of [
  'data-property-inquiry-preparation-api-mutation="true"',
  'data-property-inquiry-preparation-hidden-payload="true"',
  'data-property-inquiry-preparation-auto-populate-notes="true"',
  'data-property-inquiry-preparation-crm-email-change="true"',
  'data-decision-continuity-telemetry-expansion="true"',
  'data-decision-continuity-suitability-scoring="true"',
  'data-decision-continuity-protected-class-inference="true"',
  'data-property-inquiry-hidden-transfer="true"',
  'data-property-inquiry-auto-populated-notes="true"',
  'data-property-inquiry-api-change="true"',
  'data-property-inquiry-crm-email-change="true"',
  'recommend this property',
  'best property',
  'safest neighborhood',
  'school ranking',
  'guaranteed value',
  'pre-approved',
]) {
  assertNotIncludes([propertyPage, productExperience, inquiryForm, modelSource].join('\n'), prohibitedActivation, `Implementation must not include prohibited activation or copy: ${prohibitedActivation}`);
}

for (const recordMarker of [
  'PROPERTY_INQUIRY_DECISION_CONTINUITY_LOCALLY_CERTIFIED',
  'PROPERTY_INQUIRY_PREPARATION_INTELLIGENCE_IMPLEMENTED',
  'DECISION_JOURNEY_CONTINUITY_DEEPENED',
  'SOURCE / EVIDENCE -> PROPERTY INTELLIGENCE -> PRE-INQUIRY PREPARATION -> USER-CONTROLLED INQUIRY',
  'Property Inquiry API changed: `false`',
  'Property Inquiry required field contract changed: `false`',
  'No push occurred',
  'No deployment occurred',
]) {
  assertIncludes(executiveRecord, recordMarker, `Executive implementation record missing marker: ${recordMarker}`);
}

assertIncludes(chatStart, 'PROPERTY_INQUIRY_DECISION_CONTINUITY_LOCALLY_CERTIFIED', 'CHAT_START must expose the latest local handoff.');
assertIncludes(chatStart, 'READY_FOR_PROPERTY_INQUIRY_DECISION_CONTINUITY_PUSH_AUTHORIZATION', 'CHAT_START must expose the next push gate.');

console.log('[property-inquiry-decision-continuity] ok: pre-inquiry preparation, decision continuity, user-controlled inquiry, and protected boundaries verified.');
