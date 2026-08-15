import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { buildTaskIntent } from '../lib/crm/taskIntentGovernance';
import { buildTaskIntentPersistenceMapping } from '../lib/crm/taskIntentPersistenceMappingContract';
import {
  createTaskWriteReadinessFingerprint,
  evaluateCRMTaskWriteReadiness,
} from '../lib/crm/taskWriteReadinessContract';

const generatedAt = '2026-08-15T12:00:00.000Z';
const observedAt = '2026-08-15T12:05:00.000Z';
const subjectId = 'usr_write_proof_001';
const leadId = 'usr_write_proof_001';

const intentResult = buildTaskIntent({
  schemaVersion: 'REIE_TASK_INTENT_V1',
  intentType: 'PROPERTY_INQUIRY_REVIEW',
  sourceCapability: 'PROPERTY_INQUIRY_SUBMISSION',
  subject: { kind: 'INTERNAL_SUBJECT_ID', id: subjectId },
  property: { kind: 'INTERNAL_PROPERTY_ID', id: 'prop_write_proof_001' },
  ownerPosture: { state: 'HUMAN_OWNER_REQUIRED' },
  priority: { level: 'high', reason: 'TIME_SENSITIVE_HUMAN_REVIEW' },
  dueDatePosture: 'HUMAN_DUE_DATE_ASSIGNMENT_REQUIRED',
  sourceEvent: { kind: 'INTERNAL_SOURCE_EVENT_ID', id: 'evt_write_proof_001' },
  evidenceCodes: ['PROPERTY_INQUIRY_RECEIVED'],
  lifecycleClass: 'HUMAN_REVIEW_ONLY',
  communicationAuthority: 'CUSTOMER_COMMUNICATION_NOT_AUTHORIZED',
  consentPosture: 'NOT_APPLICABLE_TO_TASK_ONLY',
  expirationPosture: 'NO_EXPIRATION',
  generatedAt,
});
assert.equal(intentResult.classification, 'VALID_TASK_INTENT');
const mapping = buildTaskIntentPersistenceMapping(intentResult);
assert.equal(mapping.classification, 'LEAD_RESOLUTION_REQUIRED');
if (mapping.classification !== 'LEAD_RESOLUTION_REQUIRED') throw new Error('Expected canonical lead-resolution-required persistence mapping.');
if (!mapping.envelope) throw new Error('Expected canonical persistence envelope.');
const mappingEnvelope = mapping.envelope;

function fingerprinted(kind: string, fields: Record<string, unknown>) {
  return { ...fields, evidenceFingerprint: createTaskWriteReadinessFingerprint(kind, { ...fields, evidenceFingerprint: undefined }) };
}

const leadResolutionEvidence = fingerprinted('lead-resolution', {
  subjectInternalId: subjectId,
  resolvedLeadId: leadId,
  resolutionMethod: 'INTERNAL_SUBJECT_ID_TO_USER_PRIMARY_KEY',
  resolverAuthority: 'DEDICATED_WRITE_PROOF_RESOLVER',
  queryScopeFingerprint: 'LEAD-SCOPE-001',
  matchCardinality: 'EXACTLY_ONE_MATCH',
  observedAt,
  piiExposurePosture: 'NO_PII_FIELDS_SELECTED',
});

const metadata = mapping.envelope.createTemplate.metadata;
const taskIntent = metadata.taskIntent;
const dedupeEvidence = fingerprinted('dedupe', {
  dedupeKey: taskIntent.dedupeKey,
  auditFingerprint: taskIntent.auditFingerprint,
  resolvedLeadId: leadId,
  readScopeFingerprint: 'DEDUPE-SCOPE-001',
  observedAt,
  outcome: 'NO_MATCH',
  matchingCount: 0,
  matchingStatusSummary: [],
});

const isolationEvidence = fingerprinted('isolation', {
  adapterId: 'DEDICATED-WRITE-PROOF-ADAPTER',
  adapterVersion: 'V01',
  writePlanScope: 'ONE_CRM_TASK_CREATE',
  staticCertificationReference: 'CERT-WRITE-ISOLATION-001',
  reviewedAt: observedAt,
  reviewerAuthority: 'SECURITY_REVIEWED',
  isolationPosture: 'COMMUNICATION_ISOLATED',
});

const transactionPlan = fingerprinted('transaction', {
  posture: 'DEDUPE_READ_AND_ONE_CREATE_TRANSACTION_WHERE_FEASIBLE',
  retryCount: 0,
  userInteractionMutation: 'PROHIBITED',
  sellerLeadMutation: 'PROHIBITED',
  savedSearchMutation: 'PROHIBITED',
  communicationSideEffect: 'PROHIBITED',
  racePosture: 'RACE_CONDITION_NOT_ELIMINATED',
});

function payload() {
  return {
    leadId,
    type: mappingEnvelope.createTemplate.type,
    status: mappingEnvelope.createTemplate.status,
    priority: mappingEnvelope.createTemplate.priority,
    title: mappingEnvelope.createTemplate.title,
    metadata: JSON.parse(JSON.stringify(mappingEnvelope.createTemplate.metadata)) as Record<string, unknown>,
  };
}

function input(overrides: Record<string, unknown> = {}) {
  return {
    persistenceMapping: mapping,
    leadResolutionEvidence,
    dedupeEvidence,
    finalCreatePayload: payload(),
    writeCountBoundary: {
      requestedWriteCount: 1,
      maximumAuthorizedWrites: 1,
      retryCount: 0,
      secondWritePosture: 'SECOND_WRITE_NOT_AUTHORIZED',
    },
    communicationIsolationEvidence: isolationEvidence,
    transactionPlan,
    postWriteVerificationPlan: {
      verificationScope: 'ONE_CRM_TASK_POST_WRITE_READ',
      expectedMatchingCount: 1,
      requiredChecks: [
        'WRITE_PLAN_FINGERPRINT',
        'CREATED_TASK_INTERNAL_ID',
        'DEDUPE_AND_AUDIT_FINGERPRINT',
        'LEAD_RELATION',
        'TYPE_STATUS_PRIORITY_TITLE',
        'BOUNDED_METADATA',
        'NO_PII',
        'COMMUNICATION_PROHIBITION',
        'NO_ADJACENT_CUSTOMER_MUTATION',
        'NO_COMMUNICATION_SENT',
      ],
      evidencePlanFingerprint: 'POST-WRITE-VERIFY-001',
    },
    dispositionPlan: {
      posture: 'RETAIN_PENDING_FOR_HUMAN_REVIEW',
      automaticDisposition: 'PROHIBITED',
      destructiveDeletion: 'PROHIBITED',
      reviewerAuthority: 'HUMAN_REVIEW_REQUIRED',
      evidencePlanFingerprint: 'DISPOSITION-PLAN-001',
    },
    raceRiskAcknowledged: true,
    aggregateAuditPosture: 'BLOCKED_BY_SAFE_ACCESS_GATE',
    ...overrides,
  };
}

function fail(value: unknown, reason: string) {
  const result = evaluateCRMTaskWriteReadiness(value);
  assert.equal(result.classification, 'FAIL_CLOSED');
  assert.ok(result.reasons.includes(reason as never), 'Expected ' + reason + '; got ' + result.reasons.join(', '));
}

const ready = evaluateCRMTaskWriteReadiness(input());
assert.equal(ready.classification, 'READY_FOR_EXPLICIT_EXECUTIVE_WRITE_AUTHORIZATION');
assert.ok(ready.plan);
assert.equal(ready.plan?.classification, 'NON_EXECUTABLE_BOUNDED_CRM_TASK_WRITE_PLAN');
assert.equal(ready.plan?.executiveAuthorization, 'EXECUTIVE_WRITE_AUTHORIZATION_REQUIRED');
assert.equal(ready.plan?.secondWritePosture, 'SECOND_WRITE_NOT_AUTHORIZED');
assert.equal(ready.plan?.aggregateAuditPosture, 'BLOCKED_BY_SAFE_ACCESS_GATE');
assert.equal(ready.plan?.finalCreatePayload.leadId, leadId);
assert.equal('sellerLeadId' in (ready.plan?.finalCreatePayload ?? {}), false);

assert.equal(evaluateCRMTaskWriteReadiness(input({ persistenceMapping: { classification: 'FAIL_CLOSED' } })).classification, 'FAIL_CLOSED');
assert.equal(evaluateCRMTaskWriteReadiness(input({ leadResolutionEvidence: undefined })).classification, 'LEAD_RESOLUTION_EVIDENCE_REQUIRED');
fail(input({ leadResolutionEvidence: { ...leadResolutionEvidence, matchCardinality: 'ZERO_MATCHES' } }), 'LEAD_RESOLUTION_NOT_EXACTLY_ONE');
fail(input({ leadResolutionEvidence: { ...leadResolutionEvidence, matchCardinality: 'MULTIPLE_MATCHES' } }), 'LEAD_RESOLUTION_NOT_EXACTLY_ONE');
fail(input({ leadResolutionEvidence: { ...leadResolutionEvidence, resolutionMethod: 'EMAIL_LOOKUP' } }), 'UNSAFE_LEAD_RESOLUTION_METHOD');
fail(input({ leadResolutionEvidence: { ...leadResolutionEvidence, piiExposurePosture: 'PII_EXPOSURE' } }), 'LEAD_RESOLUTION_PII_EXPOSURE');

assert.equal(evaluateCRMTaskWriteReadiness(input({ dedupeEvidence: undefined })).classification, 'DEDUPE_EVIDENCE_REQUIRED');
for (const outcome of ['ONE_EXISTING_EQUIVALENT', 'MULTIPLE_MATCHES', 'CONFLICTING_MATCH', 'UNVERIFIED']) {
  fail(input({ dedupeEvidence: { ...dedupeEvidence, outcome } }), 'DEDUPE_EVIDENCE_NOT_NO_MATCH');
}

const typeDrift = { ...payload(), type: 'UNSUPPORTED' };
fail(input({ finalCreatePayload: typeDrift }), 'PAYLOAD_DRIFT');
const priorityDrift = payload();
priorityDrift.priority = 'low';
fail(input({ finalCreatePayload: priorityDrift }), 'PAYLOAD_DRIFT');
const statusDrift = { ...payload(), status: 'reviewing' };
fail(input({ finalCreatePayload: statusDrift }), 'PAYLOAD_DRIFT');
const titleDrift = payload();
titleDrift.title = 'Different title';
fail(input({ finalCreatePayload: titleDrift }), 'PAYLOAD_DRIFT');
const metadataDrift = payload();
(metadataDrift.metadata.taskIntent as Record<string, unknown>).dedupeKey = 'dedupe-drift';
fail(input({ finalCreatePayload: metadataDrift }), 'PAYLOAD_DRIFT');
const piiPayload = payload();
(piiPayload.metadata as Record<string, unknown>).email = 'not-allowed';
fail(input({ finalCreatePayload: piiPayload }), 'PAYLOAD_PII_FIELD');
fail(input({ finalCreatePayload: { ...payload(), sellerLeadId: 'seller-001' } }), 'UNSUPPORTED_SELLER_LEAD_ID');

fail(input({ writeCountBoundary: { requestedWriteCount: 2, maximumAuthorizedWrites: 1, retryCount: 0, secondWritePosture: 'SECOND_WRITE_NOT_AUTHORIZED' } }), 'INVALID_WRITE_BOUND');
fail(input({ writeCountBoundary: { requestedWriteCount: 1, maximumAuthorizedWrites: 2, retryCount: 0, secondWritePosture: 'SECOND_WRITE_NOT_AUTHORIZED' } }), 'INVALID_WRITE_BOUND');
fail(input({ writeCountBoundary: { requestedWriteCount: 1, maximumAuthorizedWrites: 1, retryCount: 1, secondWritePosture: 'SECOND_WRITE_NOT_AUTHORIZED' } }), 'INVALID_WRITE_BOUND');
fail(input({ writeCountBoundary: { requestedWriteCount: 1, maximumAuthorizedWrites: 1, retryCount: 0, secondWritePosture: 'SECOND_WRITE_REQUESTED' } }), 'SECOND_WRITE_REQUESTED');
assert.equal(evaluateCRMTaskWriteReadiness(input({ communicationIsolationEvidence: undefined })).classification, 'COMMUNICATION_ISOLATION_EVIDENCE_REQUIRED');
fail(input({ communicationIsolationEvidence: { ...isolationEvidence, isolationPosture: 'ADJACENCY_DETECTED' } }), 'COMMUNICATION_ADJACENCY_DETECTED');
fail(input({ transactionPlan: undefined }), 'INVALID_TRANSACTION_POSTURE');
assert.equal(evaluateCRMTaskWriteReadiness(input({ postWriteVerificationPlan: undefined })).classification, 'POST_WRITE_VERIFICATION_PLAN_REQUIRED');
assert.equal(evaluateCRMTaskWriteReadiness(input({ dispositionPlan: undefined })).classification, 'ROLLBACK_PLAN_REQUIRED');
fail(input({ dispositionPlan: { ...input().dispositionPlan, automaticDisposition: 'DISMISS' } }), 'INVALID_DISPOSITION_PLAN');
assert.equal(evaluateCRMTaskWriteReadiness(input({ raceRiskAcknowledged: false })).classification, 'RACE_RISK_ACKNOWLEDGEMENT_REQUIRED');
fail(input({ aggregateAuditPosture: 'COMPLETE' }), 'INVALID_AGGREGATE_AUDIT_POSTURE');

const same = evaluateCRMTaskWriteReadiness(input());
assert.equal(ready.plan?.writePlanFingerprint, same.plan?.writePlanFingerprint);
const changedLead = fingerprinted('lead-resolution', { ...leadResolutionEvidence, resolvedLeadId: 'usr_write_proof_002', evidenceFingerprint: undefined });
const changed = evaluateCRMTaskWriteReadiness(input({
  leadResolutionEvidence: changedLead,
  dedupeEvidence: fingerprinted('dedupe', { ...dedupeEvidence, resolvedLeadId: 'usr_write_proof_002', evidenceFingerprint: undefined }),
  finalCreatePayload: { ...payload(), leadId: 'usr_write_proof_002' },
}));
assert.equal(changed.classification, 'READY_FOR_EXPLICIT_EXECUTIVE_WRITE_AUTHORIZATION');
assert.notEqual(ready.plan?.writePlanFingerprint, changed.plan?.writePlanFingerprint);

const runtimeSource = await readFile(new URL('../lib/crm/taskWriteReadinessContract.ts', import.meta.url), 'utf8');
for (const prohibitedReference of [
  '@prisma/client',
  'node:fs',
  'fetch(',
  'http://',
  'https://',
  "from './createTask'",
  "from '../prisma'",
  'prisma.',
  'sendPropertyInquiryNotification',
  'nodemailer',
  'resend',
  'Typesense',
  'next/',
  'queue',
  'worker',
  'sendPropertyInquiryNotification(',
]) assert.ok(!runtimeSource.includes(prohibitedReference), 'Pure readiness contract must not reference ' + prohibitedReference);

console.log('[crm-task-write-readiness] ok: supplied evidence produces only finite readiness or a non-executable one-write plan without CRM, database, communication, provider, route, queue, worker, or deployment behavior.');
