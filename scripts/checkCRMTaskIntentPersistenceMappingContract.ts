import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  TASK_INTENT_SCHEMA_VERSION,
  buildTaskIntent,
  type TaskIntentInput,
  type TaskIntentType,
  type TaskIntentSourceCapability,
} from '../lib/crm/taskIntentGovernance';
import {
  CRM_TASK_TITLE_BY_INTENT,
  CRM_TASK_TYPE_BY_INTENT,
  buildTaskIntentPersistenceMapping,
  type LeadResolutionRequiredResult,
  type TaskIntentPersistenceMappingResult,
} from '../lib/crm/taskIntentPersistenceMappingContract';

const generatedAt = '2026-08-15T12:00:00.000Z';

const sourceByIntent: Record<TaskIntentType, TaskIntentSourceCapability> = {
  PROPERTY_INQUIRY_REVIEW: 'PROPERTY_INQUIRY_SUBMISSION',
  SAVED_SEARCH_STRATEGY_REVIEW: 'SAVED_SEARCH_SUBMISSION',
  SELLER_VALUATION_INTAKE_REVIEW: 'SELLER_VALUATION_SUBMISSION',
  PRE_DISCOVERY_BRIEF_REVIEW: 'PRE_DISCOVERY_SIGNAL',
  INTERACTION_PROMOTION_REVIEW: 'INTERACTION_PROMOTION',
};

const evidenceByIntent: Record<TaskIntentType, TaskIntentInput['evidenceCodes'][number]> = {
  PROPERTY_INQUIRY_REVIEW: 'PROPERTY_INQUIRY_RECEIVED',
  SAVED_SEARCH_STRATEGY_REVIEW: 'SAVED_SEARCH_SUBMITTED',
  SELLER_VALUATION_INTAKE_REVIEW: 'SELLER_VALUATION_REQUEST_RECEIVED',
  PRE_DISCOVERY_BRIEF_REVIEW: 'PRE_DISCOVERY_SIGNAL_RECORDED',
  INTERACTION_PROMOTION_REVIEW: 'INTERACTION_PROMOTION_REQUESTED',
};

function taskIntentInput(intentType: TaskIntentType, overrides: Partial<TaskIntentInput> = {}): TaskIntentInput {
  return {
    schemaVersion: TASK_INTENT_SCHEMA_VERSION,
    intentType,
    sourceCapability: sourceByIntent[intentType],
    subject: { kind: 'INTERNAL_SUBJECT_ID', id: `usr_${intentType.toLowerCase()}` },
    property: intentType === 'PROPERTY_INQUIRY_REVIEW' ? { kind: 'INTERNAL_PROPERTY_ID', id: 'prop_property_review' } : null,
    ownerPosture: { state: 'HUMAN_OWNER_REQUIRED' },
    priority: { level: 'medium', reason: 'STANDARD_HUMAN_REVIEW' },
    dueDatePosture: 'HUMAN_DUE_DATE_ASSIGNMENT_REQUIRED',
    sourceEvent: { kind: 'INTERNAL_SOURCE_EVENT_ID', id: `evt_${intentType.toLowerCase()}` },
    evidenceCodes: [evidenceByIntent[intentType]],
    lifecycleClass: 'HUMAN_REVIEW_ONLY',
    communicationAuthority: 'CUSTOMER_COMMUNICATION_NOT_AUTHORIZED',
    consentPosture: 'NOT_APPLICABLE_TO_TASK_ONLY',
    expirationPosture: 'NO_EXPIRATION',
    generatedAt,
    ...overrides,
  };
}

function canonicalSuccess(input: TaskIntentInput) {
  const result = buildTaskIntent(input);
  if (result.classification !== 'VALID_TASK_INTENT') {
    throw new Error(`Expected valid TaskIntent, got ${result.reasons.join(', ')}`);
  }
  return result;
}

function mapped(result: TaskIntentPersistenceMappingResult): LeadResolutionRequiredResult {
  if (result.classification !== 'LEAD_RESOLUTION_REQUIRED') {
    throw new Error(`Expected lead-resolution result, got ${result.reasons.join(', ')}`);
  }
  assert.equal(result.persistence, 'NOT_ATTEMPTED');
  assert.equal(result.communication, 'NOT_AUTHORIZED');
  assert.equal(result.leadResolution, 'REQUIRED_BEFORE_WRITE');
  assert.equal(result.idempotency, 'IDEMPOTENCY_NOT_YET_PROVEN');
  return result;
}

function rejected(input: unknown, reason: string) {
  const result = buildTaskIntentPersistenceMapping(input);
  if (result.classification !== 'FAIL_CLOSED') throw new Error('Expected fail-closed mapping result.');
  assert.ok(result.reasons.includes(reason as never), `Expected ${reason}; got ${result.reasons.join(', ')}`);
  assert.equal(result.envelope, null);
  assert.equal(result.persistence, 'NOT_ATTEMPTED');
  assert.equal(result.communication, 'NOT_AUTHORIZED');
}

const mappedByIntent = new Map<TaskIntentType, LeadResolutionRequiredResult>();

for (const intentType of Object.keys(sourceByIntent) as TaskIntentType[]) {
  const success = canonicalSuccess(taskIntentInput(intentType));
  const result = mapped(buildTaskIntentPersistenceMapping(success));
  mappedByIntent.set(intentType, result);

  assert.equal(result.envelope.target, 'CRMTask');
  assert.equal(result.envelope.executable, false);
  assert.equal(result.envelope.createTemplate.type, CRM_TASK_TYPE_BY_INTENT[intentType]);
  assert.equal(result.envelope.createTemplate.status, 'pending');
  assert.equal(result.envelope.createTemplate.priority, success.intent.priority.level);
  assert.equal(result.envelope.createTemplate.metadata.taskIntent.priorityReason, success.intent.priority.reason);
  assert.equal(result.envelope.createTemplate.title, CRM_TASK_TITLE_BY_INTENT[intentType]);
  assert.equal(result.envelope.createTemplate.metadata.taskIntent.intentType, intentType);
  assert.equal(result.envelope.createTemplate.metadata.taskIntent.sourceCapability, sourceByIntent[intentType]);
  assert.equal(result.envelope.createTemplate.metadata.taskIntent.subject.id, success.intent.subject.id);
  assert.deepEqual(result.envelope.createTemplate.metadata.taskIntent.ownerPosture, success.intent.ownerPosture);
  assert.equal(result.envelope.createTemplate.metadata.taskIntent.dueDatePosture, success.intent.dueDatePosture);
  assert.equal(result.envelope.createTemplate.metadata.taskIntent.communicationAuthority, 'CUSTOMER_COMMUNICATION_NOT_AUTHORIZED');
  assert.equal(result.envelope.createTemplate.metadata.taskIntent.consentPosture, success.intent.consentPosture);
  assert.equal(result.envelope.createTemplate.metadata.taskIntent.expirationPosture, success.intent.expirationPosture);
  assert.equal(result.envelope.createTemplate.metadata.taskIntent.sourceEventFingerprint, success.intent.sourceEventFingerprint);
  assert.equal(result.envelope.createTemplate.metadata.taskIntent.dedupeKey, success.intent.dedupeKey);
  assert.equal(result.envelope.createTemplate.metadata.taskIntent.auditFingerprint, success.intent.auditFingerprint);
  assert.deepEqual(result.envelope.createTemplate.metadata.taskIntent.evidenceCodes, success.intent.evidenceCodes);
  assert.equal(result.envelope.createTemplate.metadata.taskIntent.generatedAt, generatedAt);
  assert.deepEqual(result.envelope.unresolvedFields, ['leadId']);
  assert.deepEqual(result.envelope.omittedSystemFields, ['id', 'createdAt', 'sellerLeadId']);

  const template = result.envelope.createTemplate as Record<string, unknown>;
  assert.equal('leadId' in template, false);
  assert.equal('sellerLeadId' in template, false);
  assert.equal('id' in template, false);
  assert.equal('createdAt' in template, false);
}

assert.ok(mappedByIntent.get('PROPERTY_INQUIRY_REVIEW')?.envelope.createTemplate.metadata.taskIntent.property);
for (const intentType of ['SAVED_SEARCH_STRATEGY_REVIEW', 'SELLER_VALUATION_INTAKE_REVIEW', 'PRE_DISCOVERY_BRIEF_REVIEW', 'INTERACTION_PROMOTION_REVIEW'] as const) {
  assert.equal('property' in mappedByIntent.get(intentType)!.envelope.createTemplate.metadata.taskIntent, false);
}

const highPriority = canonicalSuccess(taskIntentInput('PROPERTY_INQUIRY_REVIEW', { priority: { level: 'high', reason: 'TIME_SENSITIVE_HUMAN_REVIEW' } }));
assert.equal(mapped(buildTaskIntentPersistenceMapping(highPriority)).envelope.createTemplate.priority, 'high');
const lowPriority = canonicalSuccess(taskIntentInput('INTERACTION_PROMOTION_REVIEW', { priority: { level: 'low', reason: 'ROUTINE_HUMAN_REVIEW' } }));
assert.equal(mapped(buildTaskIntentPersistenceMapping(lowPriority)).envelope.createTemplate.priority, 'low');

for (const unsafeField of ['customerName', 'email', 'phone', 'address', 'notes', 'message', 'metadata', 'title', 'leadId', 'sellerLeadId', 'id', 'createdAt']) {
  rejected({ ...canonicalSuccess(taskIntentInput('PROPERTY_INQUIRY_REVIEW')), [unsafeField]: 'unsafe' }, 'UNSAFE_INPUT_FIELD');
}

const baseSuccess = canonicalSuccess(taskIntentInput('PROPERTY_INQUIRY_REVIEW'));
rejected({ ...baseSuccess, classification: 'FAIL_CLOSED' }, 'INVALID_INPUT_AUTHORITY');
rejected(baseSuccess.intent, 'UNSAFE_INPUT_FIELD');
rejected({ classification: 'HUMAN_INPUT_REQUIRED', intent: null, reasons: [] }, 'INVALID_INPUT_AUTHORITY');
rejected({ classification: 'FAIL_CLOSED', intent: null, reasons: ['INVALID_INPUT_SHAPE'] }, 'INVALID_INPUT_AUTHORITY');

rejected({ ...baseSuccess, intent: { ...baseSuccess.intent, intentType: 'UNKNOWN_REVIEW' } }, 'UNSUPPORTED_INTENT_TYPE');
rejected({ ...baseSuccess, intent: { ...baseSuccess.intent, lifecycleClass: 'AUTOMATED_OUTREACH' } }, 'UNSUPPORTED_LIFECYCLE');
rejected({ ...baseSuccess, intent: { ...baseSuccess.intent, communicationAuthority: 'EMAIL_AUTHORIZED' } }, 'COMMUNICATION_AUTHORITY_NOT_PROHIBITED');
rejected({ ...baseSuccess, intent: { ...baseSuccess.intent, property: { kind: 'INTERNAL_PROPERTY_ID', id: 'prop_not_allowed' }, intentType: 'SAVED_SEARCH_STRATEGY_REVIEW' } }, 'PROPERTY_UNSUPPORTED_FOR_INTENT');
rejected({ ...baseSuccess, intent: { ...baseSuccess.intent, ownerPosture: { state: 'AUTO_ASSIGNED' } } }, 'UNSUPPORTED_OWNER_POSTURE');
rejected({ ...baseSuccess, intent: { ...baseSuccess.intent, dueDatePosture: 'AUTO_SCHEDULED' } }, 'UNSUPPORTED_DUE_DATE_POSTURE');
rejected({ ...baseSuccess, intent: { ...baseSuccess.intent, priority: { level: 'urgent', reason: 'TIME_SENSITIVE_HUMAN_REVIEW' } } }, 'UNSUPPORTED_PRIORITY');
rejected({ ...baseSuccess, intent: { ...baseSuccess.intent, sourceEventFingerprint: '' } }, 'MISSING_GOVERNANCE_EVIDENCE');
rejected({ ...baseSuccess, intent: { ...baseSuccess.intent, email: 'person@example.test' } }, 'UNSAFE_INTENT_FIELD');

const deterministicOne = mapped(buildTaskIntentPersistenceMapping(baseSuccess)).envelope;
const deterministicTwo = mapped(buildTaskIntentPersistenceMapping(baseSuccess)).envelope;
assert.deepEqual(deterministicOne, deterministicTwo);

const serializedEnvelope = JSON.stringify(deterministicOne);
for (const forbiddenValue of ['person@example.test', '555-0100', '1 Main Street', 'customer narrative', 'seller narrative', 'clickedListings']) {
  assert.equal(serializedEnvelope.includes(forbiddenValue), false, `Envelope must not include ${forbiddenValue}`);
}

const contractSource = await readFile(new URL('../lib/crm/taskIntentPersistenceMappingContract.ts', import.meta.url), 'utf8');
for (const prohibitedReference of [
  '@prisma/client',
  "from '../prisma'",
  "from './createTask'",
  'prisma',
  'cRMTask',
  'fetch(',
  'http://',
  'https://',
  'sendPropertyInquiryNotification',
  'nodemailer',
  'resend',
  'twilio',
  'queue',
  'worker',
  'provider',
  'fs.write',
  'writeFile',
  'NextRequest',
  'NextResponse',
]) {
  assert.equal(contractSource.includes(prohibitedReference), false, `Persistence mapping contract must not reference ${prohibitedReference}`);
}

console.log('[crm-task-intent-persistence-mapping-contract] ok: deterministic unresolved CRMTask envelope mapping is certified without lead resolution, persistence, communication, DB, queue, worker, provider, route, or filesystem behavior.');
