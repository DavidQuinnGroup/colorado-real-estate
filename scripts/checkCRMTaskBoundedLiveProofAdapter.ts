import { strict as assert } from 'node:assert';
import { readFile } from 'node:fs/promises';

import {
  BOUNDED_CRM_TASK_WRITE_PROOF_ADAPTER_ID,
  BOUNDED_CRM_TASK_WRITE_PROOF_ADAPTER_SCHEMA_VERSION,
  BOUNDED_CRM_TASK_WRITE_PROOF_ADAPTER_VERSION,
  BOUNDED_LIVE_PROOF_OPERATIONS,
  createBoundedLiveProofAdapterFingerprint,
  isBoundedLiveProofOperationSet,
  validateBoundedCRMTaskWriteProofFoundation,
} from '../lib/crm/boundedCRMTaskWriteProofAdapter';
import { buildTaskIntentDryRun } from '../lib/crm/taskIntentDryRunMapping';
import { buildTaskIntentPersistenceMapping } from '../lib/crm/taskIntentPersistenceMappingContract';
import { createTaskWriteReadinessFingerprint, evaluateCRMTaskWriteReadiness } from '../lib/crm/taskWriteReadinessContract';

const canonicalRevision = '0eaa2e38f637d453cf60d4e661cd5189e6e4b654';
const observedAt = '2026-08-15T12:00:00.000Z';
const evaluationAt = '2026-08-15T12:05:00.000Z';
const subjectId = 'usr_adapter_proof_001';
const leadId = 'usr_adapter_proof_001';

function fingerprinted(kind: string, value: Record<string, unknown>) {
  return { ...value, evidenceFingerprint: createTaskWriteReadinessFingerprint(kind, { ...value, evidenceFingerprint: undefined }) };
}

const dryRun = buildTaskIntentDryRun({
  source: 'INTERACTION_PROMOTION',
  subjectId,
  sourceEventId: 'evt_adapter_proof_001',
  promotionRequested: true,
  humanPriority: 'low',
  generatedAt: observedAt,
});
assert.equal(dryRun.classification, 'READY_TO_PROPOSE_TASK');
if (dryRun.classification !== 'READY_TO_PROPOSE_TASK') throw new Error('Expected certified dry-run fixture.');
const persistence = buildTaskIntentPersistenceMapping({ classification: 'VALID_TASK_INTENT', intent: dryRun.intent, reasons: [] });
assert.equal(persistence.classification, 'LEAD_RESOLUTION_REQUIRED');
if (persistence.classification !== 'LEAD_RESOLUTION_REQUIRED') throw new Error('Expected canonical persistence mapping.');

const leadResolutionEvidence = fingerprinted('lead-resolution', {
  subjectInternalId: subjectId,
  resolvedLeadId: leadId,
  resolutionMethod: 'INTERNAL_SUBJECT_ID_TO_USER_PRIMARY_KEY',
  resolverAuthority: 'DEDICATED_WRITE_PROOF_RESOLVER',
  queryScopeFingerprint: 'scope_adapter_lead_001',
  matchCardinality: 'EXACTLY_ONE_MATCH',
  observedAt,
  piiExposurePosture: 'NO_PII_FIELDS_SELECTED',
});
const taskIntent = persistence.envelope.createTemplate.metadata.taskIntent;
const dedupeEvidence = fingerprinted('dedupe', {
  dedupeKey: taskIntent.dedupeKey,
  auditFingerprint: taskIntent.auditFingerprint,
  resolvedLeadId: leadId,
  readScopeFingerprint: 'scope_adapter_dedupe_001',
  observedAt,
  outcome: 'NO_MATCH',
  matchingCount: 0,
  matchingStatusSummary: [],
});
const isolationEvidence = fingerprinted('isolation', {
  adapterId: 'DEDICATED-WRITE-PROOF-ADAPTER',
  adapterVersion: 'V01',
  writePlanScope: 'ONE_CRM_TASK_CREATE',
  staticCertificationReference: 'CERT-ADAPTER-ISOLATION-001',
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
  racePosture: 'SINGLE_WRITE_WINDOW_ONLY',
});
const readiness = evaluateCRMTaskWriteReadiness({
  persistenceMapping: persistence,
  leadResolutionEvidence,
  dedupeEvidence,
  finalCreatePayload: {
    leadId,
    type: persistence.envelope.createTemplate.type,
    status: persistence.envelope.createTemplate.status,
    priority: persistence.envelope.createTemplate.priority,
    title: persistence.envelope.createTemplate.title,
    metadata: persistence.envelope.createTemplate.metadata,
  },
  writeCountBoundary: { requestedWriteCount: 1, maximumAuthorizedWrites: 1, retryCount: 0, secondWritePosture: 'SECOND_WRITE_NOT_AUTHORIZED' },
  communicationIsolationEvidence: isolationEvidence,
  transactionPlan,
  postWriteVerificationPlan: {
    verificationScope: 'ONE_CRM_TASK_POST_WRITE_READ',
    expectedMatchingCount: 1,
    requiredChecks: ['WRITE_PLAN_FINGERPRINT', 'CREATED_TASK_INTERNAL_ID', 'DEDUPE_AND_AUDIT_FINGERPRINT', 'LEAD_RELATION', 'TYPE_STATUS_PRIORITY_TITLE', 'BOUNDED_METADATA', 'NO_PII', 'COMMUNICATION_PROHIBITION', 'NO_ADJACENT_CUSTOMER_MUTATION', 'NO_COMMUNICATION_SENT'],
    evidencePlanFingerprint: 'verify_adapter_001',
  },
  dispositionPlan: {
    posture: 'RETAIN_PENDING_FOR_HUMAN_REVIEW',
    automaticDisposition: 'PROHIBITED',
    destructiveDeletion: 'PROHIBITED',
    reviewerAuthority: 'HUMAN_REVIEW_REQUIRED',
    evidencePlanFingerprint: 'disposition_adapter_001',
  },
  raceRiskAcknowledged: true,
  aggregateAuditPosture: 'BLOCKED_BY_SAFE_ACCESS_GATE',
});
assert.equal(readiness.classification, 'READY_FOR_EXPLICIT_EXECUTIVE_WRITE_AUTHORIZATION');
if (!readiness.plan) throw new Error('Expected certified non-executable readiness plan.');
const certifiedPlan = readiness.plan;

function authorization(overrides: Record<string, unknown> = {}) {
  const value = {
    schemaVersion: BOUNDED_CRM_TASK_WRITE_PROOF_ADAPTER_SCHEMA_VERSION,
    authorizationId: 'auth_adapter_proof_001',
    authorizedWritePlanFingerprint: readiness.plan?.writePlanFingerprint,
    authorizedCanonicalRevision: canonicalRevision,
    authorizedAdapterId: BOUNDED_CRM_TASK_WRITE_PROOF_ADAPTER_ID,
    authorizedAdapterVersion: BOUNDED_CRM_TASK_WRITE_PROOF_ADAPTER_VERSION,
    maximumAuthorizedWrites: 1,
    retryCount: 0,
    issuedAt: observedAt,
    expiresAt: '2026-08-15T13:00:00.000Z',
    authorityClass: 'EXECUTIVE_HQ_ONE_USE_WRITE_PROOF',
    ...overrides,
  };
  return { ...value, authorizationFingerprint: createBoundedLiveProofAdapterFingerprint('one-use-authorization', { ...value, authorizationFingerprint: undefined }) };
}

function input(overrides: Record<string, unknown> = {}) {
  return { canonicalRevision, readiness, authorization: authorization(), evaluationAt, ...overrides };
}

const foundation = validateBoundedCRMTaskWriteProofFoundation(input());
assert.equal(foundation.classification, 'FOUNDATION_VALID');
assert.equal(foundation.execution, 'NOT_IMPLEMENTED');
assert.equal(foundation.safeAccessPosture, 'SAFE_ACCESS_PATH_NOT_YET_ESTABLISHED');
assert.equal(foundation.aggregateAuditPosture, 'BLOCKED_BY_SAFE_ACCESS_GATE');
assert.equal(foundation.proofCategoryPosture.recommendedCategory, 'INTERACTION_PROMOTION_REVIEW');
assert.equal(foundation.proofCategoryPosture.subjectOrEventHardcoded, false);
assert.ok(foundation.operationPlan);
assert.deepEqual(foundation.operationPlan?.operations.map((operation) => operation.operation), BOUNDED_LIVE_PROOF_OPERATIONS);
assert.deepEqual(foundation.operationPlan?.operations[0].select, ['id']);
assert.equal(foundation.operationPlan?.operations[1].rawMetadata, 'PROHIBITED');
assert.equal('sellerLeadId' in (foundation.operationPlan?.operations[2].payload ?? {}), false);

assert.equal(validateBoundedCRMTaskWriteProofFoundation({}).classification, 'FAIL_CLOSED');
assert.equal(validateBoundedCRMTaskWriteProofFoundation(input({ readiness: { classification: 'FAIL_CLOSED', plan: null, reasons: [] } })).classification, 'FAIL_CLOSED');
assert.ok(validateBoundedCRMTaskWriteProofFoundation(input({ authorization: undefined })).reasons.includes('AUTHORIZATION_MISSING'));
assert.ok(validateBoundedCRMTaskWriteProofFoundation(input({ authorization: authorization({ expiresAt: evaluationAt }) })).reasons.includes('AUTHORIZATION_EXPIRED'));
assert.ok(validateBoundedCRMTaskWriteProofFoundation(input({ authorization: authorization({ authorizedWritePlanFingerprint: 'wrong_plan' }) })).reasons.includes('WRITE_PLAN_FINGERPRINT_MISMATCH'));
assert.ok(validateBoundedCRMTaskWriteProofFoundation(input({ authorization: authorization({ authorizedCanonicalRevision: 'f'.repeat(40) }) })).reasons.includes('CANONICAL_REVISION_MISMATCH'));
assert.ok(validateBoundedCRMTaskWriteProofFoundation(input({ authorization: authorization({ authorizedAdapterVersion: 'V2' }) })).reasons.includes('ADAPTER_VERSION_MISMATCH'));
assert.ok(validateBoundedCRMTaskWriteProofFoundation(input({ authorization: authorization({ maximumAuthorizedWrites: 2 }) })).reasons.includes('AUTHORIZATION_SCOPE_MISMATCH'));
assert.ok(validateBoundedCRMTaskWriteProofFoundation(input({ authorization: authorization({ retryCount: 1 }) })).reasons.includes('AUTHORIZATION_SCOPE_MISMATCH'));
assert.equal(isBoundedLiveProofOperationSet(BOUNDED_LIVE_PROOF_OPERATIONS), true);
assert.equal(isBoundedLiveProofOperationSet([...BOUNDED_LIVE_PROOF_OPERATIONS, 'SECOND_CREATE']), false);

const badPlan = { ...readiness, plan: { ...certifiedPlan, writeCountBoundary: { ...certifiedPlan.writeCountBoundary, requestedWriteCount: 2 } } };
assert.equal(validateBoundedCRMTaskWriteProofFoundation(input({ readiness: badPlan })).classification, 'FAIL_CLOSED');
const retryPlan = { ...readiness, plan: { ...certifiedPlan, transactionPlan: { ...certifiedPlan.transactionPlan, retryCount: 1 } } };
assert.equal(validateBoundedCRMTaskWriteProofFoundation(input({ readiness: retryPlan })).classification, 'FAIL_CLOSED');
const adjacencyPlan = { ...readiness, plan: { ...certifiedPlan, communicationIsolation: { ...certifiedPlan.communicationIsolation, isolationPosture: 'ADJACENCY_DETECTED' } } };
assert.equal(validateBoundedCRMTaskWriteProofFoundation(input({ readiness: adjacencyPlan })).classification, 'FAIL_CLOSED');
const dedupePlan = { ...readiness, plan: { ...certifiedPlan, dedupeEvidence: { ...certifiedPlan.dedupeEvidence, outcome: 'ONE_EXISTING_EQUIVALENT' } } };
assert.equal(validateBoundedCRMTaskWriteProofFoundation(input({ readiness: dedupePlan })).classification, 'FAIL_CLOSED');
const piiPlan = { ...readiness, plan: { ...certifiedPlan, finalCreatePayload: { ...certifiedPlan.finalCreatePayload, metadata: { ...certifiedPlan.finalCreatePayload.metadata, email: 'not-allowed' } } } };
assert.equal(validateBoundedCRMTaskWriteProofFoundation(input({ readiness: piiPlan })).classification, 'FAIL_CLOSED');

const runtimeSource = await readFile(new URL('../lib/crm/boundedCRMTaskWriteProofAdapter.ts', import.meta.url), 'utf8');
for (const prohibitedReference of [
  '@prisma/client',
  'PrismaClient',
  'prisma.',
  '$query',
  'fetch(',
  'http://',
  'https://',
  'process.env',
  'node:fs',
  'keychain',
  'sendPropertyInquiryNotification',
  'nodemailer',
  'resend',
  'twilio',
  'Typesense',
  'next/',
  "from './createTask'",
  "from '../prisma'",
  'queue',
  'worker',
]) assert.ok(!runtimeSource.includes(prohibitedReference), 'Foundation runtime must not reference ' + prohibitedReference);

console.log('[bounded-crm-task-write-proof-adapter] ok: foundation validates only supplied certified plans and fixture authorization structure while retaining non-execution, deferred safe access, blocked aggregate audit, no retry, one-write, and communication-isolated postures.');
