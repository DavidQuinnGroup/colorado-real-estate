export const CRM_SAFE_ACCESS_PLAN_SCHEMA_VERSION = 'REIE_CRM_SAFE_ACCESS_PLAN_V1' as const;

export const CRM_SAFE_ACCESS_PURPOSES = [
  'CRM_TASK_AGGREGATE_AUDIT',
  'SUBJECT_TO_LEAD_RESOLUTION',
  'INTENT_SPECIFIC_DEDUPE_READ',
  'POST_WRITE_VERIFICATION_READ',
] as const;

export type CRMSafeAccessPurpose = (typeof CRM_SAFE_ACCESS_PURPOSES)[number];

export type CRMSafeAccessCredentialClass =
  | 'DEDICATED_DB_READ_ONLY'
  | 'APPLICATION_WRITE_CAPABLE_UNVERIFIED'
  | 'SUPABASE_SERVICE_ROLE_UNVERIFIED'
  | 'UNKNOWN_CREDENTIAL_CLASS';

export type CRMSafeAccessEnvironmentClass = 'ISOLATED_NON_PRODUCTION' | 'PRODUCTION' | 'UNVERIFIED_ENVIRONMENT';

export type CRMSafeAccessTable = 'CRMTask' | 'User';

export type CRMSafeAccessProjection =
  | 'CRMTask.aggregateCount'
  | 'CRMTask.status'
  | 'CRMTask.priority'
  | 'CRMTask.type'
  | 'CRMTask.createdAtAgeBucket'
  | 'CRMTask.sellerLeadPresenceCount'
  | 'CRMTask.leadId'
  | 'CRMTask.id'
  | 'CRMTask.title'
  | 'CRMTask.metadata.taskIntent.schemaVersion'
  | 'CRMTask.metadata.taskIntent.intentType'
  | 'CRMTask.metadata.taskIntent.sourceCapability'
  | 'CRMTask.metadata.taskIntent.ownerPosture'
  | 'CRMTask.metadata.taskIntent.priorityReason'
  | 'CRMTask.metadata.taskIntent.dueDatePosture'
  | 'CRMTask.metadata.taskIntent.sourceEventFingerprint'
  | 'CRMTask.metadata.taskIntent.dedupeKey'
  | 'CRMTask.metadata.taskIntent.auditFingerprint'
  | 'CRMTask.metadata.taskIntent.evidenceCodes'
  | 'CRMTask.metadata.taskIntent.lifecycleClass'
  | 'CRMTask.metadata.taskIntent.communicationAuthority'
  | 'CRMTask.metadata.taskIntent.consentPosture'
  | 'CRMTask.metadata.taskIntent.expirationPosture'
  | 'CRMTask.metadata.taskIntent.generatedAt'
  | 'User.id';

export const CRM_SAFE_ACCESS_QUERY_TEMPLATES = [
  'CRM_TASK_AGGREGATE_STATUS_PRIORITY_TYPE',
  'CRM_TASK_AGGREGATE_AGE_BUCKETS',
  'CRM_TASK_AGGREGATE_RELATION_COUNTS',
  'CRM_TASK_GOVERNANCE_METADATA_PATH_AGGREGATES',
  'SUBJECT_TO_LEAD_ID_ONLY',
  'CRM_TASK_INTENT_DEDUPE_FINGERPRINT_LOOKUP',
  'CRM_TASK_POST_WRITE_BOUNDED_VERIFICATION',
] as const;

export type CRMSafeAccessQueryTemplateId = (typeof CRM_SAFE_ACCESS_QUERY_TEMPLATES)[number];

export type CRMSafeAccessStopCondition =
  | 'SECRET_EXPOSURE_RISK'
  | 'DATABASE_TARGET_UNCLEAR'
  | 'CREDENTIAL_CLASS_UNAPPROVED'
  | 'READ_ONLY_ENFORCEMENT_UNVERIFIED'
  | 'QUERY_TEMPLATE_UNAPPROVED'
  | 'TABLE_SCOPE_UNAPPROVED'
  | 'COLUMN_SCOPE_UNAPPROVED'
  | 'PII_REQUIRED'
  | 'FULL_METADATA_REQUIRED'
  | 'CARDINALITY_LIMIT_EXCEEDED'
  | 'WRITE_OPERATION_DETECTED'
  | 'ENVIRONMENT_MISMATCH'
  | 'CANONICAL_REVISION_MISMATCH'
  | 'AUTHORIZATION_FINGERPRINT_MISMATCH'
  | 'QUERY_ENGINE_UNAPPROVED'
  | 'OUTPUT_REDACTION_UNSAFE';

export type CRMSafeAccessPlanReadiness =
  | 'SAFE_ACCESS_PLAN_READY_FOR_INFRASTRUCTURE_REVIEW'
  | 'CREDENTIAL_CLASS_NOT_APPROVED'
  | 'ENVIRONMENT_NOT_APPROVED'
  | 'QUERY_TEMPLATE_NOT_APPROVED'
  | 'COLUMN_SCOPE_UNSAFE'
  | 'METADATA_SCOPE_UNSAFE'
  | 'CARDINALITY_BOUND_UNSAFE'
  | 'SECRET_HANDLING_UNSAFE'
  | 'READ_ONLY_ENFORCEMENT_UNVERIFIED'
  | 'AUTHORITY_SCOPE_MISMATCH'
  | 'FAIL_CLOSED';

export type CRMSafeAccessPlanInput = Readonly<{
  schemaVersion: typeof CRM_SAFE_ACCESS_PLAN_SCHEMA_VERSION;
  accessPurpose: CRMSafeAccessPurpose;
  allowedTable: CRMSafeAccessTable;
  allowedOperation: 'SELECT';
  allowedProjections: readonly CRMSafeAccessProjection[];
  fixedPredicateClass: string;
  maximumRows: number;
  credentialClass: CRMSafeAccessCredentialClass;
  credentialDelivery: 'EPHEMERAL_OPERATOR_INJECTED_READ_ONLY';
  environmentClass: CRMSafeAccessEnvironmentClass;
  environmentIdentity: string;
  environmentApproval: 'EXPLICITLY_APPROVED' | 'UNAPPROVED';
  canonicalRevision: string;
  approvedQueryTemplateId: CRMSafeAccessQueryTemplateId;
  expiresAt: string;
  authorityClass:
    | 'SAFE_READ_ACCESS_SETUP_AUTHORIZATION'
    | 'READ_ONLY_AGGREGATE_AUDIT_AUTHORIZATION'
    | 'BOUNDED_SUBJECT_RESOLUTION_READ_AUTHORIZATION'
    | 'BOUNDED_DEDUPE_READ_AUTHORIZATION'
    | 'POST_WRITE_VERIFICATION_READ_AUTHORIZATION';
  authorizationFingerprint: string;
  secretHandling: readonly string[];
  outputRedaction: readonly string[];
  queryEngine: 'FIXED_PARAMETERIZED_SELECT_TEMPLATE' | 'UNAPPROVED_QUERY_ENGINE';
  readOnlyEnforcement: 'DATABASE_ENFORCED_READ_ONLY' | 'COMMAND_POLICY_READ_ONLY';
}>;

export type NormalizedCRMSafeAccessPlan = Readonly<{
  schemaVersion: typeof CRM_SAFE_ACCESS_PLAN_SCHEMA_VERSION;
  accessPurpose: CRMSafeAccessPurpose;
  allowedTable: CRMSafeAccessTable;
  allowedOperation: 'SELECT';
  allowedProjections: readonly CRMSafeAccessProjection[];
  fixedPredicateClass: string;
  maximumRows: number;
  credentialClass: 'DEDICATED_DB_READ_ONLY';
  credentialDelivery: 'EPHEMERAL_OPERATOR_INJECTED_READ_ONLY';
  environmentClass: Exclude<CRMSafeAccessEnvironmentClass, 'UNVERIFIED_ENVIRONMENT'>;
  environmentIdentity: string;
  canonicalRevision: string;
  approvedQueryTemplateId: CRMSafeAccessQueryTemplateId;
  expiresAt: string;
  authorityClass: CRMSafeAccessPlanInput['authorityClass'];
  authorizationFingerprint: string;
  secretHandling: readonly string[];
  outputRedaction: readonly string[];
  queryEngine: 'FIXED_PARAMETERIZED_SELECT_TEMPLATE';
  readOnlyEnforcement: 'DATABASE_ENFORCED_READ_ONLY';
  accessPlanFingerprint: string;
}>;

export type CRMSafeAccessPlanResult = Readonly<{
  classification: CRMSafeAccessPlanReadiness;
  plan: NormalizedCRMSafeAccessPlan | null;
  reasons: readonly CRMSafeAccessStopCondition[];
  aggregateAuditPosture: 'AGGREGATE_AUDIT_READY_FOR_ACCESS_SETUP_REVIEW' | 'AGGREGATE_AUDIT_NOT_READY';
  liveProofPosture: 'LIVE_PROOF_NOT_AUTHORIZED';
  writeCredentialPosture: 'WRITE_CREDENTIAL_SEPARATE_AND_NOT_IN_SCOPE';
}>;

export type CRMSafeAccessExecutionEvidence = Readonly<{
  accessPlanFingerprint: string;
  canonicalRevision: string;
  queryTemplateId: CRMSafeAccessQueryTemplateId;
  selectedProjectionIdentifiers: readonly CRMSafeAccessProjection[];
  predicateClass: string;
  returnedCardinalityOrCount: number;
  executedAt: string;
  resultClassification: 'NOT_EXECUTED' | 'COMPLETED_PRIVACY_MINIMIZED' | 'STOPPED';
  noPiiSelectionAssertion: 'PII_NOT_SELECTED';
  stopOrAbortReason?: CRMSafeAccessStopCondition;
}>;

type TemplatePolicy = Readonly<{
  purpose: CRMSafeAccessPurpose;
  table: CRMSafeAccessTable;
  predicate: string;
  maximumRows: number;
  projections: readonly CRMSafeAccessProjection[];
  authority: CRMSafeAccessPlanInput['authorityClass'];
}>;

const SECRET_HANDLING_REQUIREMENTS = [
  'SECRET_NOT_IN_PROMPT',
  'SECRET_NOT_IN_COMMAND_ARGUMENT',
  'SECRET_NOT_IN_REPOSITORY',
  'SECRET_NOT_ECHOED',
  'SECRET_NOT_LOGGED',
  'SECRET_INJECTED_AT_PROCESS_RUNTIME_ONLY',
  'FOREGROUND_ONE_SHOT_PROCESS',
  'PROCESS_DISCONNECTS_AND_EXITS',
] as const;

const OUTPUT_REDACTION_REQUIREMENTS = [
  'CONNECTION_ERRORS_REDACTED',
  'QUERY_PARAMETERS_NOT_LOGGED',
  'RAW_ROW_VALUES_NOT_LOGGED',
  'RAW_METADATA_NOT_LOGGED',
  'PII_NOT_SELECTED',
  'OUTPUT_PRIVACY_MINIMIZED',
] as const;

const TEMPLATE_POLICIES: Readonly<Record<CRMSafeAccessQueryTemplateId, TemplatePolicy>> = {
  CRM_TASK_AGGREGATE_STATUS_PRIORITY_TYPE: {
    purpose: 'CRM_TASK_AGGREGATE_AUDIT', table: 'CRMTask', predicate: 'AGGREGATE_ALL_CRM_TASKS', maximumRows: 250,
    projections: ['CRMTask.aggregateCount', 'CRMTask.status', 'CRMTask.priority', 'CRMTask.type'], authority: 'READ_ONLY_AGGREGATE_AUDIT_AUTHORIZATION',
  },
  CRM_TASK_AGGREGATE_AGE_BUCKETS: {
    purpose: 'CRM_TASK_AGGREGATE_AUDIT', table: 'CRMTask', predicate: 'AGGREGATE_OPEN_CRM_TASK_AGE_BUCKETS', maximumRows: 32,
    projections: ['CRMTask.aggregateCount', 'CRMTask.createdAtAgeBucket'], authority: 'READ_ONLY_AGGREGATE_AUDIT_AUTHORIZATION',
  },
  CRM_TASK_AGGREGATE_RELATION_COUNTS: {
    purpose: 'CRM_TASK_AGGREGATE_AUDIT', table: 'CRMTask', predicate: 'AGGREGATE_SELLER_LEAD_PRESENCE', maximumRows: 8,
    projections: ['CRMTask.aggregateCount', 'CRMTask.sellerLeadPresenceCount'], authority: 'READ_ONLY_AGGREGATE_AUDIT_AUTHORIZATION',
  },
  CRM_TASK_GOVERNANCE_METADATA_PATH_AGGREGATES: {
    purpose: 'CRM_TASK_AGGREGATE_AUDIT', table: 'CRMTask', predicate: 'AGGREGATE_ALLOWLISTED_GOVERNANCE_METADATA_PATHS', maximumRows: 32,
    projections: ['CRMTask.aggregateCount', 'CRMTask.metadata.taskIntent.lifecycleClass', 'CRMTask.metadata.taskIntent.communicationAuthority'], authority: 'READ_ONLY_AGGREGATE_AUDIT_AUTHORIZATION',
  },
  SUBJECT_TO_LEAD_ID_ONLY: {
    purpose: 'SUBJECT_TO_LEAD_RESOLUTION', table: 'User', predicate: 'USER_INTERNAL_PRIMARY_ID_EXACT', maximumRows: 1,
    projections: ['User.id'], authority: 'BOUNDED_SUBJECT_RESOLUTION_READ_AUTHORIZATION',
  },
  CRM_TASK_INTENT_DEDUPE_FINGERPRINT_LOOKUP: {
    purpose: 'INTENT_SPECIFIC_DEDUPE_READ', table: 'CRMTask', predicate: 'CRM_TASK_LEAD_TYPE_AND_GOVERNANCE_FINGERPRINTS', maximumRows: 2,
    projections: ['CRMTask.leadId', 'CRMTask.type', 'CRMTask.status', 'CRMTask.metadata.taskIntent.dedupeKey', 'CRMTask.metadata.taskIntent.auditFingerprint'], authority: 'BOUNDED_DEDUPE_READ_AUTHORIZATION',
  },
  CRM_TASK_POST_WRITE_BOUNDED_VERIFICATION: {
    purpose: 'POST_WRITE_VERIFICATION_READ', table: 'CRMTask', predicate: 'CRM_TASK_CREATED_ID_LEAD_AND_GOVERNANCE_FINGERPRINTS', maximumRows: 1,
    projections: ['CRMTask.id', 'CRMTask.leadId', 'CRMTask.type', 'CRMTask.status', 'CRMTask.priority', 'CRMTask.title', 'CRMTask.metadata.taskIntent.schemaVersion', 'CRMTask.metadata.taskIntent.intentType', 'CRMTask.metadata.taskIntent.sourceCapability', 'CRMTask.metadata.taskIntent.ownerPosture', 'CRMTask.metadata.taskIntent.priorityReason', 'CRMTask.metadata.taskIntent.dueDatePosture', 'CRMTask.metadata.taskIntent.sourceEventFingerprint', 'CRMTask.metadata.taskIntent.dedupeKey', 'CRMTask.metadata.taskIntent.auditFingerprint', 'CRMTask.metadata.taskIntent.evidenceCodes', 'CRMTask.metadata.taskIntent.lifecycleClass', 'CRMTask.metadata.taskIntent.communicationAuthority', 'CRMTask.metadata.taskIntent.consentPosture', 'CRMTask.metadata.taskIntent.expirationPosture', 'CRMTask.metadata.taskIntent.generatedAt'], authority: 'POST_WRITE_VERIFICATION_READ_AUTHORIZATION',
  },
};

const REVISION_PATTERN = /^[a-f0-9]{40}$/;
const ID_PATTERN = /^[A-Za-z0-9._:-]{3,160}$/;
const ISO_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
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

export function createCRMSafeAccessPlanFingerprint(value: unknown): string {
  return 'crm-safe-access-plan:v1:' + hash(stable(value));
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

function fail(classification: Exclude<CRMSafeAccessPlanReadiness, 'SAFE_ACCESS_PLAN_READY_FOR_INFRASTRUCTURE_REVIEW'>, ...reasons: CRMSafeAccessStopCondition[]): CRMSafeAccessPlanResult {
  return {
    classification,
    plan: null,
    reasons: [...new Set(reasons)].sort(),
    aggregateAuditPosture: 'AGGREGATE_AUDIT_NOT_READY',
    liveProofPosture: 'LIVE_PROOF_NOT_AUTHORIZED',
    writeCredentialPosture: 'WRITE_CREDENTIAL_SEPARATE_AND_NOT_IN_SCOPE',
  };
}

function planInput(value: unknown): CRMSafeAccessPlanInput | null {
  if (!isRecord(value)) return null;
  const keys = ['schemaVersion', 'accessPurpose', 'allowedTable', 'allowedOperation', 'allowedProjections', 'fixedPredicateClass', 'maximumRows', 'credentialClass', 'credentialDelivery', 'environmentClass', 'environmentIdentity', 'environmentApproval', 'canonicalRevision', 'approvedQueryTemplateId', 'expiresAt', 'authorityClass', 'authorizationFingerprint', 'secretHandling', 'outputRedaction', 'queryEngine', 'readOnlyEnforcement'];
  if (Object.keys(value).length !== keys.length || !keys.every((key) => key in value)) return null;
  return value as unknown as CRMSafeAccessPlanInput;
}

export function validateCRMSafeAccessPlan(value: unknown): CRMSafeAccessPlanResult {
  const input = planInput(value);
  if (!input) return fail('FAIL_CLOSED', 'QUERY_TEMPLATE_UNAPPROVED');
  if (input.schemaVersion !== CRM_SAFE_ACCESS_PLAN_SCHEMA_VERSION || !CRM_SAFE_ACCESS_PURPOSES.includes(input.accessPurpose)) return fail('FAIL_CLOSED', 'QUERY_TEMPLATE_UNAPPROVED');
  if (input.allowedOperation !== 'SELECT') return fail('FAIL_CLOSED', 'WRITE_OPERATION_DETECTED');
  if (input.allowedTable !== 'CRMTask' && input.allowedTable !== 'User') return fail('FAIL_CLOSED', 'TABLE_SCOPE_UNAPPROVED');
  if (input.credentialClass !== 'DEDICATED_DB_READ_ONLY' || input.credentialDelivery !== 'EPHEMERAL_OPERATOR_INJECTED_READ_ONLY') return fail('CREDENTIAL_CLASS_NOT_APPROVED', 'CREDENTIAL_CLASS_UNAPPROVED');
  if (input.environmentClass === 'UNVERIFIED_ENVIRONMENT' || input.environmentApproval !== 'EXPLICITLY_APPROVED' || !validId(input.environmentIdentity)) return fail('ENVIRONMENT_NOT_APPROVED', 'DATABASE_TARGET_UNCLEAR', 'ENVIRONMENT_MISMATCH');
  if (!REVISION_PATTERN.test(input.canonicalRevision)) return fail('AUTHORITY_SCOPE_MISMATCH', 'CANONICAL_REVISION_MISMATCH');
  if (!validIso(input.expiresAt) || !validId(input.authorizationFingerprint)) return fail('AUTHORITY_SCOPE_MISMATCH', 'AUTHORIZATION_FINGERPRINT_MISMATCH');
  if (input.queryEngine !== 'FIXED_PARAMETERIZED_SELECT_TEMPLATE') return fail('QUERY_TEMPLATE_NOT_APPROVED', 'QUERY_ENGINE_UNAPPROVED');
  if (input.readOnlyEnforcement !== 'DATABASE_ENFORCED_READ_ONLY') return fail('READ_ONLY_ENFORCEMENT_UNVERIFIED', 'READ_ONLY_ENFORCEMENT_UNVERIFIED');
  if (!sameSet(input.secretHandling, SECRET_HANDLING_REQUIREMENTS)) return fail('SECRET_HANDLING_UNSAFE', 'SECRET_EXPOSURE_RISK');
  if (!sameSet(input.outputRedaction, OUTPUT_REDACTION_REQUIREMENTS)) return fail('SECRET_HANDLING_UNSAFE', 'OUTPUT_REDACTION_UNSAFE');

  const policy = TEMPLATE_POLICIES[input.approvedQueryTemplateId];
  if (!policy || policy.purpose !== input.accessPurpose || policy.table !== input.allowedTable || policy.predicate !== input.fixedPredicateClass) return fail('QUERY_TEMPLATE_NOT_APPROVED', 'QUERY_TEMPLATE_UNAPPROVED');
  if (policy.authority !== input.authorityClass) return fail('AUTHORITY_SCOPE_MISMATCH', 'AUTHORIZATION_FINGERPRINT_MISMATCH');
  if (!sameSet(input.allowedProjections, policy.projections)) {
    const hasMetadata = Array.isArray(input.allowedProjections) && input.allowedProjections.some((projection) => typeof projection === 'string' && projection.includes('metadata'));
    return fail(hasMetadata ? 'METADATA_SCOPE_UNSAFE' : 'COLUMN_SCOPE_UNSAFE', hasMetadata ? 'FULL_METADATA_REQUIRED' : 'COLUMN_SCOPE_UNAPPROVED');
  }
  if (!Number.isInteger(input.maximumRows) || input.maximumRows !== policy.maximumRows || input.maximumRows < 1) return fail('CARDINALITY_BOUND_UNSAFE', 'CARDINALITY_LIMIT_EXCEEDED');

  const normalized: NormalizedCRMSafeAccessPlan = {
    schemaVersion: input.schemaVersion,
    accessPurpose: input.accessPurpose,
    allowedTable: input.allowedTable,
    allowedOperation: 'SELECT',
    allowedProjections: [...input.allowedProjections].sort() as CRMSafeAccessProjection[],
    fixedPredicateClass: input.fixedPredicateClass,
    maximumRows: input.maximumRows,
    credentialClass: 'DEDICATED_DB_READ_ONLY',
    credentialDelivery: 'EPHEMERAL_OPERATOR_INJECTED_READ_ONLY',
    environmentClass: input.environmentClass,
    environmentIdentity: input.environmentIdentity,
    canonicalRevision: input.canonicalRevision,
    approvedQueryTemplateId: input.approvedQueryTemplateId,
    expiresAt: input.expiresAt,
    authorityClass: input.authorityClass,
    authorizationFingerprint: input.authorizationFingerprint,
    secretHandling: [...input.secretHandling].sort(),
    outputRedaction: [...input.outputRedaction].sort(),
    queryEngine: 'FIXED_PARAMETERIZED_SELECT_TEMPLATE',
    readOnlyEnforcement: 'DATABASE_ENFORCED_READ_ONLY',
    accessPlanFingerprint: '',
  };
  const accessPlanFingerprint = createCRMSafeAccessPlanFingerprint({ ...normalized, accessPlanFingerprint: undefined });
  return {
    classification: 'SAFE_ACCESS_PLAN_READY_FOR_INFRASTRUCTURE_REVIEW',
    plan: { ...normalized, accessPlanFingerprint },
    reasons: [],
    aggregateAuditPosture: input.accessPurpose === 'CRM_TASK_AGGREGATE_AUDIT' ? 'AGGREGATE_AUDIT_READY_FOR_ACCESS_SETUP_REVIEW' : 'AGGREGATE_AUDIT_NOT_READY',
    liveProofPosture: 'LIVE_PROOF_NOT_AUTHORIZED',
    writeCredentialPosture: 'WRITE_CREDENTIAL_SEPARATE_AND_NOT_IN_SCOPE',
  };
}
