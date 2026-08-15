import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  CRM_SAFE_ACCESS_PLAN_SCHEMA_VERSION,
  createCRMSafeAccessPlanFingerprint,
  validateCRMSafeAccessPlan,
} from '../lib/crm/safeAccessPlanContract';

const revision = '7bacc0e86eda13bbff00348c24b48c7f365e15af';
const expiresAt = '2026-08-16T12:00:00.000Z';
const secretHandling = ['SECRET_NOT_IN_PROMPT', 'SECRET_NOT_IN_COMMAND_ARGUMENT', 'SECRET_NOT_IN_REPOSITORY', 'SECRET_NOT_ECHOED', 'SECRET_NOT_LOGGED', 'SECRET_INJECTED_AT_PROCESS_RUNTIME_ONLY', 'FOREGROUND_ONE_SHOT_PROCESS', 'PROCESS_DISCONNECTS_AND_EXITS'];
const outputRedaction = ['CONNECTION_ERRORS_REDACTED', 'QUERY_PARAMETERS_NOT_LOGGED', 'RAW_ROW_VALUES_NOT_LOGGED', 'RAW_METADATA_NOT_LOGGED', 'PII_NOT_SELECTED', 'OUTPUT_PRIVACY_MINIMIZED'];

const templates = {
  aggregate: { accessPurpose: 'CRM_TASK_AGGREGATE_AUDIT', allowedTable: 'CRMTask', approvedQueryTemplateId: 'CRM_TASK_AGGREGATE_STATUS_PRIORITY_TYPE', fixedPredicateClass: 'AGGREGATE_ALL_CRM_TASKS', maximumRows: 250, allowedProjections: ['CRMTask.aggregateCount', 'CRMTask.status', 'CRMTask.priority', 'CRMTask.type'], authorityClass: 'READ_ONLY_AGGREGATE_AUDIT_AUTHORIZATION' },
  resolution: { accessPurpose: 'SUBJECT_TO_LEAD_RESOLUTION', allowedTable: 'User', approvedQueryTemplateId: 'SUBJECT_TO_LEAD_ID_ONLY', fixedPredicateClass: 'USER_INTERNAL_PRIMARY_ID_EXACT', maximumRows: 1, allowedProjections: ['User.id'], authorityClass: 'BOUNDED_SUBJECT_RESOLUTION_READ_AUTHORIZATION' },
  dedupe: { accessPurpose: 'INTENT_SPECIFIC_DEDUPE_READ', allowedTable: 'CRMTask', approvedQueryTemplateId: 'CRM_TASK_INTENT_DEDUPE_FINGERPRINT_LOOKUP', fixedPredicateClass: 'CRM_TASK_LEAD_TYPE_AND_GOVERNANCE_FINGERPRINTS', maximumRows: 2, allowedProjections: ['CRMTask.leadId', 'CRMTask.type', 'CRMTask.status', 'CRMTask.metadata.taskIntent.dedupeKey', 'CRMTask.metadata.taskIntent.auditFingerprint'], authorityClass: 'BOUNDED_DEDUPE_READ_AUTHORIZATION' },
  verify: { accessPurpose: 'POST_WRITE_VERIFICATION_READ', allowedTable: 'CRMTask', approvedQueryTemplateId: 'CRM_TASK_POST_WRITE_BOUNDED_VERIFICATION', fixedPredicateClass: 'CRM_TASK_CREATED_ID_LEAD_AND_GOVERNANCE_FINGERPRINTS', maximumRows: 1, allowedProjections: ['CRMTask.id', 'CRMTask.leadId', 'CRMTask.type', 'CRMTask.status', 'CRMTask.priority', 'CRMTask.title', 'CRMTask.metadata.taskIntent.schemaVersion', 'CRMTask.metadata.taskIntent.intentType', 'CRMTask.metadata.taskIntent.sourceCapability', 'CRMTask.metadata.taskIntent.ownerPosture', 'CRMTask.metadata.taskIntent.priorityReason', 'CRMTask.metadata.taskIntent.dueDatePosture', 'CRMTask.metadata.taskIntent.sourceEventFingerprint', 'CRMTask.metadata.taskIntent.dedupeKey', 'CRMTask.metadata.taskIntent.auditFingerprint', 'CRMTask.metadata.taskIntent.evidenceCodes', 'CRMTask.metadata.taskIntent.lifecycleClass', 'CRMTask.metadata.taskIntent.communicationAuthority', 'CRMTask.metadata.taskIntent.consentPosture', 'CRMTask.metadata.taskIntent.expirationPosture', 'CRMTask.metadata.taskIntent.generatedAt'], authorityClass: 'POST_WRITE_VERIFICATION_READ_AUTHORIZATION' },
} as const;

function plan(template: Record<string, unknown>, overrides: Record<string, unknown> = {}) {
  return {
    schemaVersion: CRM_SAFE_ACCESS_PLAN_SCHEMA_VERSION,
    ...template,
    allowedOperation: 'SELECT',
    credentialClass: 'DEDICATED_DB_READ_ONLY',
    credentialDelivery: 'EPHEMERAL_OPERATOR_INJECTED_READ_ONLY',
    environmentClass: 'ISOLATED_NON_PRODUCTION',
    environmentIdentity: 'crm-proof-isolated-001',
    environmentApproval: 'EXPLICITLY_APPROVED',
    canonicalRevision: revision,
    expiresAt,
    authorizationFingerprint: 'safe_access_authorization_001',
    secretHandling,
    outputRedaction,
    queryEngine: 'FIXED_PARAMETERIZED_SELECT_TEMPLATE',
    readOnlyEnforcement: 'DATABASE_ENFORCED_READ_ONLY',
    ...overrides,
  };
}

const aggregate = validateCRMSafeAccessPlan(plan(templates.aggregate));
const resolution = validateCRMSafeAccessPlan(plan(templates.resolution));
const dedupe = validateCRMSafeAccessPlan(plan(templates.dedupe));
const verify = validateCRMSafeAccessPlan(plan(templates.verify));
for (const result of [aggregate, resolution, dedupe, verify]) assert.equal(result.classification, 'SAFE_ACCESS_PLAN_READY_FOR_INFRASTRUCTURE_REVIEW');
assert.equal(aggregate.aggregateAuditPosture, 'AGGREGATE_AUDIT_READY_FOR_ACCESS_SETUP_REVIEW');
assert.equal(resolution.liveProofPosture, 'LIVE_PROOF_NOT_AUTHORIZED');
assert.equal(dedupe.writeCredentialPosture, 'WRITE_CREDENTIAL_SEPARATE_AND_NOT_IN_SCOPE');
assert.deepEqual(resolution.plan?.allowedProjections, ['User.id']);

assert.equal(validateCRMSafeAccessPlan(plan(templates.aggregate, { accessPurpose: 'UNKNOWN' })).classification, 'FAIL_CLOSED');
assert.equal(validateCRMSafeAccessPlan(plan(templates.aggregate, { credentialClass: 'APPLICATION_WRITE_CAPABLE_UNVERIFIED' })).classification, 'CREDENTIAL_CLASS_NOT_APPROVED');
assert.equal(validateCRMSafeAccessPlan(plan(templates.aggregate, { credentialClass: 'SUPABASE_SERVICE_ROLE_UNVERIFIED' })).classification, 'CREDENTIAL_CLASS_NOT_APPROVED');
assert.equal(validateCRMSafeAccessPlan(plan(templates.aggregate, { credentialClass: 'UNKNOWN_CREDENTIAL_CLASS' })).classification, 'CREDENTIAL_CLASS_NOT_APPROVED');
assert.equal(validateCRMSafeAccessPlan(plan(templates.aggregate, { environmentClass: 'UNVERIFIED_ENVIRONMENT' })).classification, 'ENVIRONMENT_NOT_APPROVED');
assert.equal(validateCRMSafeAccessPlan(plan(templates.aggregate, { environmentClass: 'PRODUCTION', environmentApproval: 'UNAPPROVED' })).classification, 'ENVIRONMENT_NOT_APPROVED');
assert.equal(validateCRMSafeAccessPlan(plan(templates.aggregate, { allowedOperation: 'DELETE' })).classification, 'FAIL_CLOSED');
assert.equal(validateCRMSafeAccessPlan(plan(templates.aggregate, { allowedTable: 'SellerLead' })).classification, 'FAIL_CLOSED');
assert.equal(validateCRMSafeAccessPlan(plan(templates.aggregate, { approvedQueryTemplateId: 'ARBITRARY_SQL' })).classification, 'QUERY_TEMPLATE_NOT_APPROVED');
assert.equal(validateCRMSafeAccessPlan(plan(templates.aggregate, { fixedPredicateClass: 'ANYTHING' })).classification, 'QUERY_TEMPLATE_NOT_APPROVED');
assert.equal(validateCRMSafeAccessPlan(plan(templates.resolution, { allowedProjections: ['User.email'] })).classification, 'COLUMN_SCOPE_UNSAFE');
assert.equal(validateCRMSafeAccessPlan(plan(templates.resolution, { allowedProjections: ['User.phone'] })).classification, 'COLUMN_SCOPE_UNSAFE');
assert.equal(validateCRMSafeAccessPlan(plan(templates.resolution, { allowedProjections: ['User.name'] })).classification, 'COLUMN_SCOPE_UNSAFE');
assert.equal(validateCRMSafeAccessPlan(plan(templates.dedupe, { allowedProjections: ['CRMTask.metadata'] })).classification, 'METADATA_SCOPE_UNSAFE');
assert.equal(validateCRMSafeAccessPlan(plan(templates.dedupe, { allowedProjections: ['CRMTask.metadata.taskIntent.*'] })).classification, 'METADATA_SCOPE_UNSAFE');
assert.equal(validateCRMSafeAccessPlan(plan(templates.dedupe, { allowedProjections: ['CRMTask.metadata.anything'] })).classification, 'METADATA_SCOPE_UNSAFE');
assert.equal(validateCRMSafeAccessPlan(plan(templates.resolution, { maximumRows: 2 })).classification, 'CARDINALITY_BOUND_UNSAFE');
assert.equal(validateCRMSafeAccessPlan(plan(templates.resolution, { maximumRows: undefined })).classification, 'CARDINALITY_BOUND_UNSAFE');
assert.equal(validateCRMSafeAccessPlan(plan(templates.aggregate, { secretHandling: secretHandling.filter((value) => value !== 'SECRET_NOT_IN_PROMPT') })).classification, 'SECRET_HANDLING_UNSAFE');
assert.equal(validateCRMSafeAccessPlan(plan(templates.aggregate, { secretHandling: secretHandling.filter((value) => value !== 'SECRET_NOT_IN_COMMAND_ARGUMENT') })).classification, 'SECRET_HANDLING_UNSAFE');
assert.equal(validateCRMSafeAccessPlan(plan(templates.aggregate, { secretHandling: secretHandling.filter((value) => value !== 'SECRET_NOT_LOGGED') })).classification, 'SECRET_HANDLING_UNSAFE');
assert.equal(validateCRMSafeAccessPlan(plan(templates.aggregate, { outputRedaction: outputRedaction.filter((value) => value !== 'CONNECTION_ERRORS_REDACTED') })).classification, 'SECRET_HANDLING_UNSAFE');
assert.equal(validateCRMSafeAccessPlan(plan(templates.aggregate, { readOnlyEnforcement: 'COMMAND_POLICY_READ_ONLY' })).classification, 'READ_ONLY_ENFORCEMENT_UNVERIFIED');
assert.equal(validateCRMSafeAccessPlan(plan(templates.aggregate, { queryEngine: 'UNAPPROVED_QUERY_ENGINE' })).classification, 'QUERY_TEMPLATE_NOT_APPROVED');
assert.equal(validateCRMSafeAccessPlan(plan(templates.aggregate, { authorityClass: 'SAFE_READ_ACCESS_SETUP_AUTHORIZATION' })).classification, 'AUTHORITY_SCOPE_MISMATCH');
assert.equal(validateCRMSafeAccessPlan(plan(templates.aggregate, { canonicalRevision: 'bad' })).classification, 'AUTHORITY_SCOPE_MISMATCH');
assert.equal(validateCRMSafeAccessPlan(plan(templates.aggregate, { authorizationFingerprint: 'x' })).classification, 'AUTHORITY_SCOPE_MISMATCH');

const identical = validateCRMSafeAccessPlan(plan(templates.dedupe));
assert.equal(identical.plan?.accessPlanFingerprint, dedupe.plan?.accessPlanFingerprint);
const changed = validateCRMSafeAccessPlan(plan(templates.dedupe, { environmentIdentity: 'crm-proof-isolated-002' }));
assert.notEqual(changed.plan?.accessPlanFingerprint, dedupe.plan?.accessPlanFingerprint);
assert.ok(createCRMSafeAccessPlanFingerprint({ a: 1 }) === createCRMSafeAccessPlanFingerprint({ a: 1 }));

const evidence = {
  accessPlanFingerprint: dedupe.plan?.accessPlanFingerprint,
  canonicalRevision: revision,
  queryTemplateId: 'CRM_TASK_INTENT_DEDUPE_FINGERPRINT_LOOKUP',
  selectedProjectionIdentifiers: dedupe.plan?.allowedProjections,
  predicateClass: dedupe.plan?.fixedPredicateClass,
  returnedCardinalityOrCount: 0,
  executedAt: '2026-08-15T12:00:00.000Z',
  resultClassification: 'NOT_EXECUTED',
  noPiiSelectionAssertion: 'PII_NOT_SELECTED',
};
assert.equal(JSON.stringify(evidence).includes('secret'), false);
assert.equal(JSON.stringify(evidence).includes('metadata"'), false);

const runtimeSource = await readFile(new URL('../lib/crm/safeAccessPlanContract.ts', import.meta.url), 'utf8');
for (const prohibited of ['@prisma/client', 'PrismaClient', 'prisma.', '$query', 'fetch(', 'http://', 'https://', 'process.env', 'node:fs', 'keychain', 'createClient', 'sendPropertyInquiryNotification', 'nodemailer', 'resend', 'twilio', 'Typesense', 'next/', 'queue', 'worker']) assert.ok(!runtimeSource.includes(prohibited), 'Runtime must not reference ' + prohibited);

console.log('[crm-safe-access-plan-contract] ok: fixtures prove fixed SELECT-only scope, database-enforced read-only posture, ephemeral secret handling, privacy-minimized projections, bounded cardinality, and preserved non-authorization.');
