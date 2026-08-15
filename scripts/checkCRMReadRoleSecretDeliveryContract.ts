import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  CRM_READ_ROLE_SECRET_DELIVERY_SCHEMA_VERSION,
  DEDICATED_CRM_READ_ONLY_ROLE_ID,
  createCRMReadRoleSecretDeliveryFingerprint,
  validateCRMReadRoleSecretDeliveryPlan,
} from '../lib/crm/readRoleSecretDeliveryContract';

const revision = '43186d69ffa015374e807541cce420074181d1f5';
const evaluationAt = '2026-08-15T14:00:00.000Z';
const handling = ['SECRET_NOT_IN_PROMPT', 'SECRET_NOT_IN_COMMAND_ARGUMENT', 'SECRET_NOT_IN_REPOSITORY', 'SECRET_NOT_IN_CLIPBOARD', 'SECRET_NOT_ECHOED', 'SECRET_NOT_LOGGED', 'SECRET_NOT_WRITTEN_TO_TEMP_FILE', 'SECRET_RETRIEVED_AT_PROCESS_RUNTIME_ONLY', 'FOREGROUND_ONE_SHOT_PROCESS', 'PROCESS_DISCONNECTS_AND_EXITS', 'ENVIRONMENT_CLEARED_ON_PROCESS_EXIT'];
const storageWrites = ['SECRET_WRITTEN_DIRECTLY_TO_APPROVED_STORE', 'SECRET_NOT_DISPLAYED', 'SECRET_NOT_COPIED_THROUGH_PROMPT', 'SECRET_NOT_COMMITTED', 'SECRET_NOT_WRITTEN_TO_REPOSITORY', 'SECRET_NOT_WRITTEN_TO_LOG', 'SECRET_NOT_LEFT_IN_TEMP_FILE'];
const processPostures = ['FOREGROUND_ONE_SHOT_PROCESS', 'NO_BACKGROUND_DAEMON', 'NO_PERSISTENT_SERVER', 'NO_WORKER', 'NO_QUEUE', 'NO_RETRY_LOOP'];

function plan(overrides: Record<string, unknown> = {}) {
  return {
    schemaVersion: CRM_READ_ROLE_SECRET_DELIVERY_SCHEMA_VERSION,
    secretPurpose: 'DEDICATED_CRM_DB_READ_ONLY_ROLE_CREDENTIAL',
    storageClass: 'MACOS_KEYCHAIN_OPERATOR_LOCAL',
    creationPosture: 'OPERATOR_GENERATED_OUTSIDE_CHATGPT_CODEX',
    storageWriteAssertions: storageWrites,
    deliveryMethod: 'KEYCHAIN_TO_PROCESS_ENVIRONMENT_DIRECT',
    executionDestination: 'PRIMARY_MACOS_TERMINAL',
    processPostures,
    environmentClass: 'ISOLATED_NON_PRODUCTION',
    targetIdentifier: 'crm_nonprod_001',
    targetConfirmation: 'EXECUTIVELY_CONFIRMED',
    roleIdentifier: DEDICATED_CRM_READ_ONLY_ROLE_ID,
    canonicalRoleViewRevision: revision,
    safeAccessPlanFingerprint: 'crm-safe-access-plan:v1:001',
    expiresAt: '2026-08-15T15:00:00.000Z',
    handlingAssertions: handling,
    keychainIdentifier: { serviceIdentifier: 'project-atlas-crm-read-only', accountLabelClass: 'CRM_READ_ONLY_EVIDENCE_ROLE', roleIdentifier: DEDICATED_CRM_READ_ONLY_ROLE_ID },
    ...overrides,
  };
}

const withoutAuthority = validateCRMReadRoleSecretDeliveryPlan(plan());
assert.equal(withoutAuthority.classification, 'AUTHORITY_REQUIRED');
assert.ok(withoutAuthority.plan);
if (!withoutAuthority.plan) throw new Error('Expected normalized plan.');

function authorization(overrides: Record<string, unknown> = {}) {
  const value = {
    schemaVersion: CRM_READ_ROLE_SECRET_DELIVERY_SCHEMA_VERSION,
    authorizationId: 'auth_secret_delivery_001',
    authorityClass: 'CRM_READ_ONLY_SECRET_DELIVERY_AUTHORIZATION',
    authorizedTargetIdentifier: withoutAuthority.plan?.targetIdentifier,
    authorizedRoleIdentifier: DEDICATED_CRM_READ_ONLY_ROLE_ID,
    authorizedExecutionDestination: 'PRIMARY_MACOS_TERMINAL',
    authorizedSafeAccessPlanFingerprint: withoutAuthority.plan?.safeAccessPlanFingerprint,
    authorizedDeliveryPlanFingerprint: withoutAuthority.plan?.deliveryPlanFingerprint,
    issuedAt: '2026-08-15T13:00:00.000Z',
    expiresAt: '2026-08-15T16:00:00.000Z',
    ...overrides,
  };
  return { ...value, authorizationFingerprint: createCRMReadRoleSecretDeliveryFingerprint({ ...value, authorizationFingerprint: undefined }) };
}

const ready = validateCRMReadRoleSecretDeliveryPlan(plan(), authorization(), evaluationAt);
assert.equal(ready.classification, 'SECRET_DELIVERY_PLAN_READY_FOR_OPERATOR_REVIEW');
assert.equal(ready.safeAccessPosture, 'SAFE_ACCESS_PATH_NOT_YET_ESTABLISHED');
assert.equal(ready.aggregateAuditPosture, 'AGGREGATE_AUDIT_NOT_AUTHORIZED');
assert.equal(ready.liveProofPosture, 'LIVE_PROOF_NOT_AUTHORIZED');
assert.equal(ready.writeCredentialPosture, 'WRITE_CREDENTIAL_SEPARATE_AND_NOT_IN_SCOPE');
assert.equal(ready.provisioningPosture, 'NO_PROVISIONING_AUTHORIZATION');
assert.equal(ready.adminSessionBoundary, 'ADMIN_PROVISIONING_SESSION_SEPARATE_AND_NOT_A_READ_CREDENTIAL');
assert.equal(validateCRMReadRoleSecretDeliveryPlan(plan({ targetConfirmation: 'TARGET_ENVIRONMENT_CONFIRMATION_REQUIRED' })).classification, 'TARGET_CONFIRMATION_REQUIRED');
assert.equal(validateCRMReadRoleSecretDeliveryPlan(plan({ executionDestination: 'SECONDARY_CODEX_TERMINAL' })).classification, 'EXECUTION_DESTINATION_UNAPPROVED');
for (const storageClass of ['PLAINTEXT_FILE', 'REPOSITORY_ENV_FILE', 'COMMAND_ARGUMENT', 'PROMPT_CONTENT', 'CLIPBOARD_TRANSFER', 'CHAT_TRANSCRIPT', 'GENERIC_UNREVIEWED_SECRET_STORE']) assert.equal(validateCRMReadRoleSecretDeliveryPlan(plan({ storageClass })).classification, 'STORAGE_CLASS_UNAPPROVED');
assert.equal(validateCRMReadRoleSecretDeliveryPlan(plan({ creationPosture: 'UNAPPROVED_CREATION_METHOD' })).classification, 'CREATION_METHOD_UNAPPROVED');
for (const deliveryMethod of ['COMMAND_ARGUMENT', 'PROMPT_TRANSFER', 'CLIPBOARD_TRANSFER', 'LONG_LIVED_ENVIRONMENT_EXPORT']) assert.equal(validateCRMReadRoleSecretDeliveryPlan(plan({ deliveryMethod })).classification, 'DELIVERY_METHOD_UNAPPROVED');
assert.equal(validateCRMReadRoleSecretDeliveryPlan(plan({ processPostures: processPostures.slice(0, -1) })).classification, 'PROCESS_POSTURE_UNSAFE');
assert.equal(validateCRMReadRoleSecretDeliveryPlan(plan({ handlingAssertions: handling.slice(0, -1) })).classification, 'HANDLING_ASSERTION_MISSING');
assert.equal(validateCRMReadRoleSecretDeliveryPlan(plan({ storageWriteAssertions: storageWrites.slice(0, -1) })).classification, 'HANDLING_ASSERTION_MISSING');
assert.equal(validateCRMReadRoleSecretDeliveryPlan(plan({ secretPurpose: 'SUPABASE_SERVICE_ROLE_KEY' })).classification, 'FAIL_CLOSED');
assert.equal(validateCRMReadRoleSecretDeliveryPlan(plan({ roleIdentifier: 'application_write_credential' })).classification, 'FAIL_CLOSED');
assert.equal(validateCRMReadRoleSecretDeliveryPlan({ ...plan(), connectionString: 'not-representable' }).classification, 'FAIL_CLOSED');
assert.equal(validateCRMReadRoleSecretDeliveryPlan({ ...plan(), secretValue: 'not-representable' }).classification, 'FAIL_CLOSED');
assert.equal(validateCRMReadRoleSecretDeliveryPlan(plan(), authorization({ authorizedTargetIdentifier: 'wrong_target' }), evaluationAt).classification, 'FAIL_CLOSED');
assert.equal(validateCRMReadRoleSecretDeliveryPlan(plan(), authorization({ expiresAt: '2026-08-15T13:30:00.000Z' }), evaluationAt).classification, 'FAIL_CLOSED');
assert.equal(createCRMReadRoleSecretDeliveryFingerprint(plan()), createCRMReadRoleSecretDeliveryFingerprint(plan()));
assert.notEqual(createCRMReadRoleSecretDeliveryFingerprint(plan()), createCRMReadRoleSecretDeliveryFingerprint(plan({ targetIdentifier: 'crm_nonprod_002' })));

const runtime = await readFile(new URL('../lib/crm/readRoleSecretDeliveryContract.ts', import.meta.url), 'utf8');
for (const prohibited of ['process.env', 'child_process', 'node:child_process', 'exec(', 'spawn(', 'security find', '@prisma/client', 'PrismaClient', 'prisma.', '$query', 'fetch(', 'http://', 'https://', 'CRMTask', 'User', 'nodemailer', 'resend', 'twilio', 'Typesense', 'queue.add', 'worker_threads']) assert.equal(runtime.includes(prohibited), false, 'Runtime contract must not reference ' + prohibited);
assert.equal(/secret(Value|Password|Credential)\s*:/i.test(runtime), false, 'Runtime contract must not model a secret value field.');
assert.equal(runtime.includes('Math.random'), false);
assert.equal(runtime.includes('Date.now'), false);
console.log('[crm-read-role-secret-delivery] ok: pure non-secret delivery governance validates only metadata, fails closed, preserves all read/audit/proof firewalls, and has no secret-store, shell, database, or network runtime capability.');
