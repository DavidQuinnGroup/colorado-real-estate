import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  buildTaskIntentDryRun,
  type ReadyToProposeTaskResult,
  type TaskIntentDryRunResult,
} from '../lib/crm/taskIntentDryRunMapping';

const generatedAt = '2026-08-15T12:00:00.000Z';

function ready(result: TaskIntentDryRunResult): ReadyToProposeTaskResult {
  if (result.classification !== 'READY_TO_PROPOSE_TASK') throw new Error(`Expected ready result, got ${result.reasons.join(', ')}`);
  assert.equal(result.classification, 'READY_TO_PROPOSE_TASK');
  assert.equal(result.persistence, 'NOT_ATTEMPTED');
  assert.equal(result.communication, 'NOT_AUTHORIZED');
  return result;
}

function humanInput(result: TaskIntentDryRunResult, reason: string) {
  if (result.classification !== 'HUMAN_INPUT_REQUIRED') throw new Error(`Expected human-input result, got ${result.classification}`);
  assert.equal(result.classification, 'HUMAN_INPUT_REQUIRED');
  assert.ok(result.reasons.includes(reason as never), `Expected ${reason}; got ${result.reasons.join(', ')}`);
  assert.equal(result.intent, null);
  assert.equal(result.persistence, 'NOT_ATTEMPTED');
  assert.equal(result.communication, 'NOT_AUTHORIZED');
}

function failed(result: TaskIntentDryRunResult, reason: string) {
  if (result.classification !== 'FAIL_CLOSED') throw new Error(`Expected fail-closed result, got ${result.classification}`);
  assert.equal(result.classification, 'FAIL_CLOSED');
  assert.ok(result.reasons.includes(reason as never), `Expected ${reason}; got ${result.reasons.join(', ')}`);
  assert.equal(result.intent, null);
  assert.equal(result.persistence, 'NOT_ATTEMPTED');
  assert.equal(result.communication, 'NOT_AUTHORIZED');
}

const propertyHigh = ready(buildTaskIntentDryRun({
  source: 'PROPERTY_INQUIRY',
  subjectId: 'usr_property',
  propertyId: 'prop_property',
  sourceEventId: 'evt_property',
  timeline: 'tour',
  generatedAt,
}));
assert.equal(propertyHigh.intent.intentType, 'PROPERTY_INQUIRY_REVIEW');
assert.equal(propertyHigh.intent.priority.level, 'high');
assert.equal(propertyHigh.intent.priority.reason, 'TIME_SENSITIVE_HUMAN_REVIEW');
assert.equal(propertyHigh.intent.property?.id, 'prop_property');

const propertyLow = ready(buildTaskIntentDryRun({
  source: 'PROPERTY_INQUIRY',
  subjectId: 'usr_property',
  propertyId: 'prop_property',
  sourceEventId: 'evt_property_low',
  timeline: 'unspecified',
  generatedAt,
}));
assert.equal(propertyLow.intent.priority.level, 'low');

const savedSearch = ready(buildTaskIntentDryRun({
  source: 'SAVED_SEARCH_STRATEGY_INTAKE',
  subjectId: 'usr_search',
  sourceEventId: 'evt_search',
  intakeSource: 'search-map',
  timeline: 'research',
  creationBasis: 'STRUCTURED_SOURCE',
  generatedAt,
}));
assert.equal(savedSearch.intent.intentType, 'SAVED_SEARCH_STRATEGY_REVIEW');
assert.equal(savedSearch.intent.priority.level, 'medium');
assert.equal(savedSearch.intent.property, null);
humanInput(buildTaskIntentDryRun({
  source: 'SAVED_SEARCH_STRATEGY_INTAKE',
  subjectId: 'usr_search',
  sourceEventId: 'evt_search_notes',
  intakeSource: 'unknown',
  timeline: 'unspecified',
  creationBasis: 'FREE_FORM_NOTES_ONLY',
  generatedAt,
}), 'FREE_FORM_ONLY_CREATION_BASIS');

const seller = ready(buildTaskIntentDryRun({
  source: 'SELLER_VALUATION_INTAKE',
  subjectId: 'usr_seller',
  sourceEventId: 'evt_seller',
  timeline: 'ninety-days',
  generatedAt,
}));
assert.equal(seller.intent.intentType, 'SELLER_VALUATION_INTAKE_REVIEW');
assert.equal(seller.intent.priority.level, 'medium');
assert.equal(seller.intent.property, null);

humanInput(buildTaskIntentDryRun({
  source: 'PRE_DISCOVERY_BRIEF',
  subjectId: 'usr_pre',
  trigger: 'HEAT_SCORE',
  generatedAt,
}), 'DORMANT_SOURCE_REQUIRES_PROVENANCE');
const preDiscovery = ready(buildTaskIntentDryRun({
  source: 'PRE_DISCOVERY_BRIEF',
  subjectId: 'usr_pre',
  sourceEventId: 'evt_pre',
  trigger: 'MANUAL',
  humanPriority: 'high',
  generatedAt,
}));
assert.equal(preDiscovery.intent.intentType, 'PRE_DISCOVERY_BRIEF_REVIEW');
assert.equal(preDiscovery.intent.priority.reason, 'TIME_SENSITIVE_HUMAN_REVIEW');

humanInput(buildTaskIntentDryRun({
  source: 'INTERACTION_PROMOTION',
  subjectId: 'usr_interaction',
  sourceEventId: 'evt_interaction',
  promotionRequested: true,
  generatedAt,
}), 'MISSING_EXPLICIT_HUMAN_PRIORITY');
const interaction = ready(buildTaskIntentDryRun({
  source: 'INTERACTION_PROMOTION',
  subjectId: 'usr_interaction',
  sourceEventId: 'evt_interaction',
  promotionRequested: true,
  humanPriority: 'low',
  generatedAt,
}));
assert.equal(interaction.intent.intentType, 'INTERACTION_PROMOTION_REVIEW');
assert.equal(interaction.intent.priority.reason, 'ROUTINE_HUMAN_REVIEW');

failed(buildTaskIntentDryRun({
  source: 'PROPERTY_INQUIRY',
  subjectId: 'usr_property',
  propertyId: 'prop_property',
  sourceEventId: 'evt_property',
  timeline: 'now',
  generatedAt,
  email: 'not-accepted@example.test',
}), 'UNSUPPORTED_SOURCE_EVIDENCE_FIELD');
failed(buildTaskIntentDryRun({
  source: 'SAVED_SEARCH_STRATEGY_INTAKE',
  subjectId: 'usr_search',
  sourceEventId: 'evt_search',
  intakeSource: 'search-map',
  timeline: 'research',
  creationBasis: 'STRUCTURED_SOURCE',
  generatedAt,
  propertyId: 'prop_not_applicable',
}), 'UNSUPPORTED_SOURCE_EVIDENCE_FIELD');
failed(buildTaskIntentDryRun({
  source: 'PROPERTY_INQUIRY',
  subjectId: '',
  propertyId: 'prop_property',
  sourceEventId: 'evt_property',
  timeline: 'now',
  generatedAt,
}), 'INVALID_SUBJECT_REFERENCE');
failed(buildTaskIntentDryRun({ source: 'UNKNOWN_SOURCE' }), 'UNKNOWN_SOURCE');

const sameEvent = ready(buildTaskIntentDryRun({
  source: 'PROPERTY_INQUIRY',
  subjectId: 'usr_property',
  propertyId: 'prop_property',
  sourceEventId: 'evt_deterministic',
  timeline: 'now',
  generatedAt,
}));
const sameEventAgain = ready(buildTaskIntentDryRun({
  source: 'PROPERTY_INQUIRY',
  subjectId: 'usr_property',
  propertyId: 'prop_property',
  sourceEventId: 'evt_deterministic',
  timeline: 'now',
  generatedAt,
}));
const differentEvent = ready(buildTaskIntentDryRun({
  source: 'PROPERTY_INQUIRY',
  subjectId: 'usr_property',
  propertyId: 'prop_property',
  sourceEventId: 'evt_different',
  timeline: 'now',
  generatedAt,
}));
assert.equal(sameEvent.intent.sourceEventFingerprint, sameEventAgain.intent.sourceEventFingerprint);
assert.equal(sameEvent.intent.dedupeKey, sameEventAgain.intent.dedupeKey);
assert.notEqual(sameEvent.intent.dedupeKey, differentEvent.intent.dedupeKey);
assert.equal(sameEvent.intent.ownerPosture.state, 'HUMAN_OWNER_REQUIRED');
assert.equal(sameEvent.intent.dueDatePosture, 'HUMAN_DUE_DATE_ASSIGNMENT_REQUIRED');
assert.equal(sameEvent.intent.communicationAuthority, 'CUSTOMER_COMMUNICATION_NOT_AUTHORIZED');

const mapperSource = await readFile(new URL('../lib/crm/taskIntentDryRunMapping.ts', import.meta.url), 'utf8');
for (const prohibitedReference of [
  '@prisma/client',
  "from './prisma'",
  'fetch(',
  'http://',
  'https://',
  'sendPropertyInquiryNotification',
  'nodemailer',
  'resend',
  'queue',
  'worker',
  'NextRequest',
  'NextResponse',
]) {
  assert.equal(mapperSource.includes(prohibitedReference), false, `Dry-run mapper must not reference ${prohibitedReference}`);
}

console.log('[crm-task-intent-dry-run-mapping] ok: all governed sources map through canonical TaskIntentV1 with no persistence or communication behavior.');
