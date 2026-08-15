export const CRM_READ_ROLE_SECRET_DELIVERY_SCHEMA_VERSION = 'REIE_CRM_READ_ROLE_SECRET_DELIVERY_V1' as const;
export const DEDICATED_CRM_READ_ONLY_ROLE_ID = 'reie_crm_read_only_evidence' as const;

export type CRMReadRoleSecretPurpose = 'DEDICATED_CRM_DB_READ_ONLY_ROLE_CREDENTIAL';
export type CRMReadRoleSecretStorageClass = 'MACOS_KEYCHAIN_OPERATOR_LOCAL' | 'PLAINTEXT_FILE' | 'REPOSITORY_ENV_FILE' | 'COMMAND_ARGUMENT' | 'PROMPT_CONTENT' | 'CLIPBOARD_TRANSFER' | 'CHAT_TRANSCRIPT' | 'GENERIC_UNREVIEWED_SECRET_STORE';
export type CRMReadRoleCreationPosture = 'OPERATOR_GENERATED_OUTSIDE_CHATGPT_CODEX' | 'PLATFORM_GENERATED_OUTSIDE_CHATGPT_CODEX' | 'UNAPPROVED_CREATION_METHOD';
export type CRMReadRoleDeliveryMethod = 'KEYCHAIN_TO_PROCESS_ENVIRONMENT_DIRECT' | 'COMMAND_ARGUMENT' | 'PROMPT_TRANSFER' | 'CLIPBOARD_TRANSFER' | 'LONG_LIVED_ENVIRONMENT_EXPORT';
export type CRMReadRoleExecutionDestination = 'PRIMARY_MACOS_TERMINAL' | 'SECONDARY_CODEX_TERMINAL' | 'GENERIC_UNCONTROLLED_CONTEXT';
export type CRMReadRoleProcessClass = 'FOREGROUND_ONE_SHOT_PROCESS' | 'NO_BACKGROUND_DAEMON' | 'NO_PERSISTENT_SERVER' | 'NO_WORKER' | 'NO_QUEUE' | 'NO_RETRY_LOOP';
export type CRMReadRoleEnvironmentClass = 'ISOLATED_NON_PRODUCTION' | 'PRODUCTION' | 'UNVERIFIED_ENVIRONMENT';

export type CRMReadRoleSecretHandlingAssertion =
  | 'SECRET_NOT_IN_PROMPT'
  | 'SECRET_NOT_IN_COMMAND_ARGUMENT'
  | 'SECRET_NOT_IN_REPOSITORY'
  | 'SECRET_NOT_IN_CLIPBOARD'
  | 'SECRET_NOT_ECHOED'
  | 'SECRET_NOT_LOGGED'
  | 'SECRET_NOT_WRITTEN_TO_TEMP_FILE'
  | 'SECRET_RETRIEVED_AT_PROCESS_RUNTIME_ONLY'
  | 'FOREGROUND_ONE_SHOT_PROCESS'
  | 'PROCESS_DISCONNECTS_AND_EXITS'
  | 'ENVIRONMENT_CLEARED_ON_PROCESS_EXIT';

export type CRMReadRoleStorageWriteAssertion =
  | 'SECRET_WRITTEN_DIRECTLY_TO_APPROVED_STORE'
  | 'SECRET_NOT_DISPLAYED'
  | 'SECRET_NOT_COPIED_THROUGH_PROMPT'
  | 'SECRET_NOT_COMMITTED'
  | 'SECRET_NOT_WRITTEN_TO_REPOSITORY'
  | 'SECRET_NOT_WRITTEN_TO_LOG'
  | 'SECRET_NOT_LEFT_IN_TEMP_FILE';

export type CRMReadRoleKeychainIdentifier = Readonly<{
  serviceIdentifier: string;
  accountLabelClass: 'CRM_READ_ONLY_EVIDENCE_ROLE';
  roleIdentifier: typeof DEDICATED_CRM_READ_ONLY_ROLE_ID;
}>;

export type CRMReadRoleSecretDeliveryPlanInput = Readonly<{
  schemaVersion: typeof CRM_READ_ROLE_SECRET_DELIVERY_SCHEMA_VERSION;
  secretPurpose: CRMReadRoleSecretPurpose;
  storageClass: CRMReadRoleSecretStorageClass;
  creationPosture: CRMReadRoleCreationPosture;
  storageWriteAssertions: readonly CRMReadRoleStorageWriteAssertion[];
  deliveryMethod: CRMReadRoleDeliveryMethod;
  executionDestination: CRMReadRoleExecutionDestination;
  processPostures: readonly CRMReadRoleProcessClass[];
  environmentClass: CRMReadRoleEnvironmentClass;
  targetIdentifier: string;
  targetConfirmation: 'EXECUTIVELY_CONFIRMED' | 'TARGET_ENVIRONMENT_CONFIRMATION_REQUIRED';
  roleIdentifier: typeof DEDICATED_CRM_READ_ONLY_ROLE_ID;
  canonicalRoleViewRevision: string;
  safeAccessPlanFingerprint: string;
  expiresAt: string;
  handlingAssertions: readonly CRMReadRoleSecretHandlingAssertion[];
  keychainIdentifier: CRMReadRoleKeychainIdentifier;
}>;

export type CRMReadRoleSecretDeliveryAuthorization = Readonly<{
  schemaVersion: typeof CRM_READ_ROLE_SECRET_DELIVERY_SCHEMA_VERSION;
  authorizationId: string;
  authorityClass: 'CRM_READ_ONLY_SECRET_DELIVERY_AUTHORIZATION';
  authorizedTargetIdentifier: string;
  authorizedRoleIdentifier: typeof DEDICATED_CRM_READ_ONLY_ROLE_ID;
  authorizedExecutionDestination: 'PRIMARY_MACOS_TERMINAL';
  authorizedSafeAccessPlanFingerprint: string;
  authorizedDeliveryPlanFingerprint: string;
  issuedAt: string;
  expiresAt: string;
  authorizationFingerprint: string;
}>;

export type NormalizedCRMReadRoleSecretDeliveryPlan = Readonly<{
  schemaVersion: typeof CRM_READ_ROLE_SECRET_DELIVERY_SCHEMA_VERSION;
  secretPurpose: 'DEDICATED_CRM_DB_READ_ONLY_ROLE_CREDENTIAL';
  storageClass: 'MACOS_KEYCHAIN_OPERATOR_LOCAL';
  creationPosture: 'OPERATOR_GENERATED_OUTSIDE_CHATGPT_CODEX' | 'PLATFORM_GENERATED_OUTSIDE_CHATGPT_CODEX';
  storageWriteAssertions: readonly CRMReadRoleStorageWriteAssertion[];
  deliveryMethod: 'KEYCHAIN_TO_PROCESS_ENVIRONMENT_DIRECT';
  executionDestination: 'PRIMARY_MACOS_TERMINAL';
  processPostures: readonly CRMReadRoleProcessClass[];
  environmentClass: Exclude<CRMReadRoleEnvironmentClass, 'UNVERIFIED_ENVIRONMENT'>;
  targetIdentifier: string;
  roleIdentifier: typeof DEDICATED_CRM_READ_ONLY_ROLE_ID;
  canonicalRoleViewRevision: string;
  safeAccessPlanFingerprint: string;
  expiresAt: string;
  handlingAssertions: readonly CRMReadRoleSecretHandlingAssertion[];
  keychainIdentifier: CRMReadRoleKeychainIdentifier;
  adminSessionBoundary: 'ADMIN_PROVISIONING_SESSION_SEPARATE_AND_NOT_A_READ_CREDENTIAL';
  deliveryPlanFingerprint: string;
}>;

export type CRMReadRoleSecretDeliveryResult = Readonly<{
  classification:
    | 'SECRET_DELIVERY_PLAN_READY_FOR_OPERATOR_REVIEW'
    | 'TARGET_CONFIRMATION_REQUIRED'
    | 'STORAGE_CLASS_UNAPPROVED'
    | 'CREATION_METHOD_UNAPPROVED'
    | 'DELIVERY_METHOD_UNAPPROVED'
    | 'EXECUTION_DESTINATION_UNAPPROVED'
    | 'PROCESS_POSTURE_UNSAFE'
    | 'HANDLING_ASSERTION_MISSING'
    | 'AUTHORITY_REQUIRED'
    | 'FAIL_CLOSED';
  plan: NormalizedCRMReadRoleSecretDeliveryPlan | null;
  reasons: readonly string[];
  safeAccessPosture: 'SAFE_ACCESS_PATH_NOT_YET_ESTABLISHED';
  aggregateAuditPosture: 'AGGREGATE_AUDIT_NOT_AUTHORIZED';
  liveProofPosture: 'LIVE_PROOF_NOT_AUTHORIZED';
  writeCredentialPosture: 'WRITE_CREDENTIAL_SEPARATE_AND_NOT_IN_SCOPE';
  provisioningPosture: 'NO_PROVISIONING_AUTHORIZATION';
  adminSessionBoundary: 'ADMIN_PROVISIONING_SESSION_SEPARATE_AND_NOT_A_READ_CREDENTIAL';
}>;

const HANDLING_ASSERTIONS: readonly CRMReadRoleSecretHandlingAssertion[] = [
  'SECRET_NOT_IN_PROMPT', 'SECRET_NOT_IN_COMMAND_ARGUMENT', 'SECRET_NOT_IN_REPOSITORY', 'SECRET_NOT_IN_CLIPBOARD', 'SECRET_NOT_ECHOED', 'SECRET_NOT_LOGGED', 'SECRET_NOT_WRITTEN_TO_TEMP_FILE', 'SECRET_RETRIEVED_AT_PROCESS_RUNTIME_ONLY', 'FOREGROUND_ONE_SHOT_PROCESS', 'PROCESS_DISCONNECTS_AND_EXITS', 'ENVIRONMENT_CLEARED_ON_PROCESS_EXIT',
];
const STORAGE_WRITE_ASSERTIONS: readonly CRMReadRoleStorageWriteAssertion[] = [
  'SECRET_WRITTEN_DIRECTLY_TO_APPROVED_STORE', 'SECRET_NOT_DISPLAYED', 'SECRET_NOT_COPIED_THROUGH_PROMPT', 'SECRET_NOT_COMMITTED', 'SECRET_NOT_WRITTEN_TO_REPOSITORY', 'SECRET_NOT_WRITTEN_TO_LOG', 'SECRET_NOT_LEFT_IN_TEMP_FILE',
];
const PROCESS_POSTURES: readonly CRMReadRoleProcessClass[] = [
  'FOREGROUND_ONE_SHOT_PROCESS', 'NO_BACKGROUND_DAEMON', 'NO_PERSISTENT_SERVER', 'NO_WORKER', 'NO_QUEUE', 'NO_RETRY_LOOP',
];
const REVISION_PATTERN = /^[a-f0-9]{40}$/;
const ID_PATTERN = /^[A-Za-z0-9._:-]{3,160}$/;
const ISO_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function exactKeys(value: Record<string, unknown>, keys: readonly string[]): boolean {
  return Object.keys(value).length === keys.length && keys.every((key) => key in value);
}

function sameSet(value: unknown, expected: readonly string[]): boolean {
  return Array.isArray(value) && value.length === expected.length && new Set(value).size === value.length && value.every((entry) => typeof entry === 'string' && expected.includes(entry));
}

function validId(value: unknown): value is string {
  return typeof value === 'string' && ID_PATTERN.test(value);
}

function validIso(value: unknown): value is string {
  return typeof value === 'string' && ISO_PATTERN.test(value) && Number.isFinite(Date.parse(value));
}

function stable(value: unknown): string {
  if (Array.isArray(value)) return '[' + value.map(stable).join(',') + ']';
  if (isRecord(value)) return '{' + Object.keys(value).sort().map((key) => JSON.stringify(key) + ':' + stable(value[key])).join(',') + '}';
  return JSON.stringify(value);
}

function hash(value: string): string {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return (result >>> 0).toString(16).padStart(8, '0');
}

export function createCRMReadRoleSecretDeliveryFingerprint(value: unknown): string {
  return 'crm-read-role-secret-delivery:v1:' + hash(stable(value));
}

function result(classification: CRMReadRoleSecretDeliveryResult['classification'], plan: NormalizedCRMReadRoleSecretDeliveryPlan | null, reasons: readonly string[]): CRMReadRoleSecretDeliveryResult {
  return {
    classification,
    plan,
    reasons: [...new Set(reasons)].sort(),
    safeAccessPosture: 'SAFE_ACCESS_PATH_NOT_YET_ESTABLISHED',
    aggregateAuditPosture: 'AGGREGATE_AUDIT_NOT_AUTHORIZED',
    liveProofPosture: 'LIVE_PROOF_NOT_AUTHORIZED',
    writeCredentialPosture: 'WRITE_CREDENTIAL_SEPARATE_AND_NOT_IN_SCOPE',
    provisioningPosture: 'NO_PROVISIONING_AUTHORIZATION',
    adminSessionBoundary: 'ADMIN_PROVISIONING_SESSION_SEPARATE_AND_NOT_A_READ_CREDENTIAL',
  };
}

function planInput(value: unknown): CRMReadRoleSecretDeliveryPlanInput | null {
  if (!isRecord(value)) return null;
  const keys = ['schemaVersion', 'secretPurpose', 'storageClass', 'creationPosture', 'storageWriteAssertions', 'deliveryMethod', 'executionDestination', 'processPostures', 'environmentClass', 'targetIdentifier', 'targetConfirmation', 'roleIdentifier', 'canonicalRoleViewRevision', 'safeAccessPlanFingerprint', 'expiresAt', 'handlingAssertions', 'keychainIdentifier'];
  if (!exactKeys(value, keys)) return null;
  return value as unknown as CRMReadRoleSecretDeliveryPlanInput;
}

function normalized(input: CRMReadRoleSecretDeliveryPlanInput): NormalizedCRMReadRoleSecretDeliveryPlan {
  const plan: Omit<NormalizedCRMReadRoleSecretDeliveryPlan, 'deliveryPlanFingerprint'> = {
    schemaVersion: CRM_READ_ROLE_SECRET_DELIVERY_SCHEMA_VERSION,
    secretPurpose: 'DEDICATED_CRM_DB_READ_ONLY_ROLE_CREDENTIAL',
    storageClass: 'MACOS_KEYCHAIN_OPERATOR_LOCAL',
    creationPosture: input.creationPosture as NormalizedCRMReadRoleSecretDeliveryPlan['creationPosture'],
    storageWriteAssertions: [...input.storageWriteAssertions].sort(),
    deliveryMethod: 'KEYCHAIN_TO_PROCESS_ENVIRONMENT_DIRECT',
    executionDestination: 'PRIMARY_MACOS_TERMINAL',
    processPostures: [...input.processPostures].sort() as CRMReadRoleProcessClass[],
    environmentClass: input.environmentClass as NormalizedCRMReadRoleSecretDeliveryPlan['environmentClass'],
    targetIdentifier: input.targetIdentifier,
    roleIdentifier: DEDICATED_CRM_READ_ONLY_ROLE_ID,
    canonicalRoleViewRevision: input.canonicalRoleViewRevision,
    safeAccessPlanFingerprint: input.safeAccessPlanFingerprint,
    expiresAt: input.expiresAt,
    handlingAssertions: [...input.handlingAssertions].sort(),
    keychainIdentifier: input.keychainIdentifier,
    adminSessionBoundary: 'ADMIN_PROVISIONING_SESSION_SEPARATE_AND_NOT_A_READ_CREDENTIAL',
  };
  return { ...plan, deliveryPlanFingerprint: createCRMReadRoleSecretDeliveryFingerprint(plan) };
}

function authorizationMatches(value: unknown, plan: NormalizedCRMReadRoleSecretDeliveryPlan, evaluationAt: unknown): boolean {
  if (!isRecord(value) || !validIso(evaluationAt)) return false;
  const keys = ['schemaVersion', 'authorizationId', 'authorityClass', 'authorizedTargetIdentifier', 'authorizedRoleIdentifier', 'authorizedExecutionDestination', 'authorizedSafeAccessPlanFingerprint', 'authorizedDeliveryPlanFingerprint', 'issuedAt', 'expiresAt', 'authorizationFingerprint'];
  if (!exactKeys(value, keys) || !validId(value.authorizationId) || !validId(value.authorizationFingerprint) || !validIso(value.issuedAt) || !validIso(value.expiresAt)) return false;
  return value.schemaVersion === CRM_READ_ROLE_SECRET_DELIVERY_SCHEMA_VERSION
    && value.authorityClass === 'CRM_READ_ONLY_SECRET_DELIVERY_AUTHORIZATION'
    && value.authorizedTargetIdentifier === plan.targetIdentifier
    && value.authorizedRoleIdentifier === plan.roleIdentifier
    && value.authorizedExecutionDestination === plan.executionDestination
    && value.authorizedSafeAccessPlanFingerprint === plan.safeAccessPlanFingerprint
    && value.authorizedDeliveryPlanFingerprint === plan.deliveryPlanFingerprint
    && Date.parse(value.issuedAt as string) < Date.parse(value.expiresAt as string)
    && Date.parse(value.expiresAt as string) > Date.parse(evaluationAt as string);
}

export function validateCRMReadRoleSecretDeliveryPlan(value: unknown, authorization?: unknown, evaluationAt?: unknown): CRMReadRoleSecretDeliveryResult {
  const input = planInput(value);
  if (!input || input.schemaVersion !== CRM_READ_ROLE_SECRET_DELIVERY_SCHEMA_VERSION || input.secretPurpose !== 'DEDICATED_CRM_DB_READ_ONLY_ROLE_CREDENTIAL') return result('FAIL_CLOSED', null, ['SECRET_PURPOSE_INVALID']);
  if (input.storageClass !== 'MACOS_KEYCHAIN_OPERATOR_LOCAL') return result('STORAGE_CLASS_UNAPPROVED', null, ['STORAGE_CLASS_UNAPPROVED']);
  if (input.creationPosture === 'UNAPPROVED_CREATION_METHOD') return result('CREATION_METHOD_UNAPPROVED', null, ['CREATION_METHOD_UNAPPROVED']);
  if (!sameSet(input.storageWriteAssertions, STORAGE_WRITE_ASSERTIONS)) return result('HANDLING_ASSERTION_MISSING', null, ['STORAGE_WRITE_POSTURE_UNSAFE']);
  if (input.deliveryMethod !== 'KEYCHAIN_TO_PROCESS_ENVIRONMENT_DIRECT') return result('DELIVERY_METHOD_UNAPPROVED', null, ['DELIVERY_METHOD_UNAPPROVED']);
  if (input.executionDestination !== 'PRIMARY_MACOS_TERMINAL') return result('EXECUTION_DESTINATION_UNAPPROVED', null, ['EXECUTION_DESTINATION_UNAPPROVED']);
  if (!sameSet(input.processPostures, PROCESS_POSTURES)) return result('PROCESS_POSTURE_UNSAFE', null, ['PROCESS_POSTURE_UNSAFE']);
  if (!sameSet(input.handlingAssertions, HANDLING_ASSERTIONS)) return result('HANDLING_ASSERTION_MISSING', null, ['HANDLING_ASSERTION_MISSING']);
  if (!validId(input.targetIdentifier) || !validId(input.safeAccessPlanFingerprint) || !validIso(input.expiresAt) || input.roleIdentifier !== DEDICATED_CRM_READ_ONLY_ROLE_ID || !REVISION_PATTERN.test(input.canonicalRoleViewRevision)) return result('FAIL_CLOSED', null, ['TARGET_OR_BINDING_INVALID']);
  if (!isRecord(input.keychainIdentifier) || !exactKeys(input.keychainIdentifier, ['serviceIdentifier', 'accountLabelClass', 'roleIdentifier']) || !validId(input.keychainIdentifier.serviceIdentifier) || input.keychainIdentifier.accountLabelClass !== 'CRM_READ_ONLY_EVIDENCE_ROLE' || input.keychainIdentifier.roleIdentifier !== DEDICATED_CRM_READ_ONLY_ROLE_ID) return result('FAIL_CLOSED', null, ['KEYCHAIN_IDENTIFIER_INVALID']);
  if (input.targetConfirmation !== 'EXECUTIVELY_CONFIRMED' || input.environmentClass === 'UNVERIFIED_ENVIRONMENT') return result('TARGET_CONFIRMATION_REQUIRED', null, ['TARGET_ENVIRONMENT_CONFIRMATION_REQUIRED']);
  const plan = normalized(input);
  if (authorization === undefined || authorization === null) return result('AUTHORITY_REQUIRED', plan, ['CRM_READ_ONLY_SECRET_DELIVERY_AUTHORIZATION_REQUIRED']);
  if (!authorizationMatches(authorization, plan, evaluationAt)) return result('FAIL_CLOSED', plan, ['AUTHORIZATION_SCOPE_MISMATCH']);
  return result('SECRET_DELIVERY_PLAN_READY_FOR_OPERATOR_REVIEW', plan, []);
}
