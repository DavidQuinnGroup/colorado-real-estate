import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  TASK_INTENT_SCHEMA_VERSION,
  buildTaskIntent,
  type TaskIntentInput,
  type TaskIntentType,
  type TaskIntentSourceCapability,
} from '../lib/crm/taskIntentGovernance';

const fixedGeneratedAt = '2026-08-15T12:00:00.000Z';

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

function fixture(intentType: TaskIntentType, priority: TaskIntentInput['priority'] = { level: 'medium', reason: 'STANDARD_HUMAN_REVIEW' }): TaskIntentInput {
  return {
    schemaVersion: TASK_INTENT_SCHEMA_VERSION,
    intentType,
    sourceCapability: sourceByIntent[intentType],
    subject: { kind: 'INTERNAL_SUBJECT_ID', id: 'usr_7f3a91' },
    ownerPosture: { state: 'HUMAN_OWNER_REQUIRED' },
    priority,
    dueDatePosture: 'NO_DUE_DATE',
    sourceEvent: { kind: 'INTERNAL_SOURCE_EVENT_ID', id: `evt_${intentType.toLowerCase()}` },
    evidenceCodes: [evidenceByIntent[intentType]],
    lifecycleClass: 'HUMAN_REVIEW_ONLY',
    communicationAuthority: 'CUSTOMER_COMMUNICATION_NOT_AUTHORIZED',
    consentPosture: 'NOT_APPLICABLE_TO_TASK_ONLY',
    expirationPosture: 'NO_EXPIRATION',
    generatedAt: fixedGeneratedAt,
  };
}

function valid(input: unknown) {
  const result = buildTaskIntent(input);
  if (result.classification !== 'VALID_TASK_INTENT') {
    throw new Error(`Expected valid result, got ${result.reasons.join(', ')}`);
  }
  return result.intent;
}

function rejected(input: unknown, reason: string) {
  const result = buildTaskIntent(input);
  if (result.classification !== 'FAIL_CLOSED') throw new Error('Expected fail-closed result.');
  assert.ok(result.reasons.includes(reason as never), `Expected ${reason}; got ${result.reasons.join(', ')}`);
}

for (const intentType of Object.keys(sourceByIntent) as TaskIntentType[]) valid(fixture(intentType));

const propertyIntent = valid({ ...fixture('PROPERTY_INQUIRY_REVIEW', { level: 'high', reason: 'TIME_SENSITIVE_HUMAN_REVIEW' }), property: { kind: 'INTERNAL_PROPERTY_ID', id: 'prop_8e91c' } });
assert.equal(propertyIntent.property?.id, 'prop_8e91c');
valid(fixture('SAVED_SEARCH_STRATEGY_REVIEW', { level: 'low', reason: 'ROUTINE_HUMAN_REVIEW' }));
valid({ ...fixture('INTERACTION_PROMOTION_REVIEW'), ownerPosture: { state: 'UNASSIGNED' }, dueDatePosture: 'HUMAN_DUE_DATE_ASSIGNMENT_REQUIRED', consentPosture: 'HUMAN_CONSENT_REVIEW_REQUIRED_FOR_ANY_FUTURE_COMMUNICATION' });

rejected({ ...fixture('PROPERTY_INQUIRY_REVIEW'), intentType: 'UNKNOWN' }, 'UNKNOWN_INTENT_TYPE');
rejected({ ...fixture('PROPERTY_INQUIRY_REVIEW'), sourceCapability: 'UNKNOWN' }, 'UNKNOWN_SOURCE_CAPABILITY');
rejected({ ...fixture('PROPERTY_INQUIRY_REVIEW'), subject: undefined }, 'MISSING_SUBJECT_REFERENCE');
rejected({ ...fixture('PROPERTY_INQUIRY_REVIEW'), subject: { kind: 'INTERNAL_SUBJECT_ID', id: 'not an internal id' } }, 'INVALID_SUBJECT_REFERENCE');
rejected({ ...fixture('SAVED_SEARCH_STRATEGY_REVIEW'), property: { kind: 'INTERNAL_PROPERTY_ID', id: 'prop_8e91c' } }, 'UNSUPPORTED_PROPERTY_REFERENCE');
rejected({ ...fixture('PROPERTY_INQUIRY_REVIEW'), priority: { level: 'urgent', reason: 'TIME_SENSITIVE_HUMAN_REVIEW' } }, 'INVALID_PRIORITY');
rejected({ ...fixture('PROPERTY_INQUIRY_REVIEW'), priority: { level: 'high', reason: 'ROUTINE_HUMAN_REVIEW' } }, 'INVALID_PRIORITY_REASON');
rejected({ ...fixture('PROPERTY_INQUIRY_REVIEW'), communicationAuthority: 'EMAIL_AUTHORIZED' }, 'CUSTOMER_COMMUNICATION_NOT_AUTHORIZED');
rejected({ ...fixture('PROPERTY_INQUIRY_REVIEW'), lifecycleClass: 'AUTOMATED_OUTREACH' }, 'INVALID_LIFECYCLE_CLASS');
rejected({ ...fixture('PROPERTY_INQUIRY_REVIEW'), subject: { kind: 'INTERNAL_SUBJECT_ID', id: 'usr_7f3a91', email: 'person@example.test' } }, 'PROHIBITED_PII_FIELD');
rejected({ ...fixture('PROPERTY_INQUIRY_REVIEW'), customerName: 'Person' }, 'PROHIBITED_PII_FIELD');
rejected({ ...fixture('PROPERTY_INQUIRY_REVIEW'), email: 'person@example.test' }, 'PROHIBITED_PII_FIELD');
rejected({ ...fixture('PROPERTY_INQUIRY_REVIEW'), phone: '555-0100' }, 'PROHIBITED_PII_FIELD');
rejected({ ...fixture('PROPERTY_INQUIRY_REVIEW'), address: '1 Main Street' }, 'PROHIBITED_PII_FIELD');
rejected({ ...fixture('PROPERTY_INQUIRY_REVIEW'), notes: 'customer narrative' }, 'PROHIBITED_PII_FIELD');
rejected({ ...fixture('PROPERTY_INQUIRY_REVIEW'), evidenceCodes: ['UNSUPPORTED_EVIDENCE'] }, 'INVALID_EVIDENCE_CODES');
rejected({ ...fixture('PROPERTY_INQUIRY_REVIEW'), dueDatePosture: '2026-08-16T09:00:00Z' }, 'INVALID_DUE_DATE_POSTURE');
rejected({ ...fixture('PROPERTY_INQUIRY_REVIEW'), ownerPosture: { state: 'EXPLICIT_HUMAN_OWNER', owner: { kind: 'INTERNAL_OWNER_ID', id: 'bad owner' } } }, 'INVALID_OWNER_POSTURE');
rejected({ ...fixture('PROPERTY_INQUIRY_REVIEW'), sourceCapability: 'SAVED_SEARCH_SUBMISSION' }, 'INTENT_SOURCE_MISMATCH');

const normalizedOne = valid(fixture('PROPERTY_INQUIRY_REVIEW'));
const normalizedTwo = valid({ ...fixture('PROPERTY_INQUIRY_REVIEW'), evidenceCodes: ['PROPERTY_INQUIRY_RECEIVED', 'PROPERTY_INQUIRY_RECEIVED'] });
assert.deepEqual(normalizedOne.evidenceCodes, normalizedTwo.evidenceCodes);
assert.equal(normalizedOne.sourceEventFingerprint, normalizedTwo.sourceEventFingerprint);
assert.equal(normalizedOne.dedupeKey, normalizedTwo.dedupeKey);
assert.equal(normalizedOne.auditFingerprint, normalizedTwo.auditFingerprint);
const materiallyDifferent = valid({ ...fixture('PROPERTY_INQUIRY_REVIEW'), sourceEvent: { kind: 'INTERNAL_SOURCE_EVENT_ID', id: 'evt_different' } });
assert.notEqual(normalizedOne.auditFingerprint, materiallyDifferent.auditFingerprint);
assert.equal(normalizedOne.communicationAuthority, 'CUSTOMER_COMMUNICATION_NOT_AUTHORIZED');
assert.equal(normalizedOne.lifecycleClass, 'HUMAN_REVIEW_ONLY');
assert.equal(normalizedOne.dueDatePosture, 'NO_DUE_DATE');

const contractSource = await readFile(new URL('../lib/crm/taskIntentGovernance.ts', import.meta.url), 'utf8');
for (const prohibitedReference of [
  '@prisma/client',
  "from '../prisma'",
  'CRMTask',
  'fetch(',
  'http://',
  'https://',
  'nodemailer',
  'resend',
  'queue',
  'worker',
  'calendar',
  "node:fs",
]) {
  assert.ok(!contractSource.includes(prohibitedReference), `Pure contract must not reference ${prohibitedReference}`);
}

console.log('[crm-task-intent-governance] ok: deterministic, PII-minimized, human-review-only task intent governance is certified without CRM, database, communication, queue, worker, provider, or network behavior.');
