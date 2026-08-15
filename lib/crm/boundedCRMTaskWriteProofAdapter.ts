import type {
  ProposedBoundedCRMTaskWritePlan,
  TaskWriteReadinessResult,
} from './taskWriteReadinessContract';

export const BOUNDED_CRM_TASK_WRITE_PROOF_ADAPTER_SCHEMA_VERSION = 'REIE_CRM_BOUNDED_LIVE_PROOF_ADAPTER_FOUNDATION_V1' as const;
export const BOUNDED_CRM_TASK_WRITE_PROOF_ADAPTER_ID = 'REIE_BOUNDED_CRM_TASK_WRITE_PROOF_ADAPTER' as const;
export const BOUNDED_CRM_TASK_WRITE_PROOF_ADAPTER_VERSION = 'V1' as const;

export const BOUNDED_LIVE_PROOF_OPERATIONS = [
  'RESOLVE_SUBJECT_TO_LEAD',
  'INTENT_SPECIFIC_DEDUPE_READ',
  'CREATE_ONE_CRM_TASK',
  'VERIFY_CREATED_CRM_TASK',
] as const;

export type BoundedLiveProofOperation = (typeof BOUNDED_LIVE_PROOF_OPERATIONS)[number];

export type BoundedLiveProofStopCondition =
  | 'SAFE_DB_ACCESS_NOT_APPROVED'
  | 'CANONICAL_REVISION_MISMATCH'
  | 'WRITE_PLAN_FINGERPRINT_MISMATCH'
  | 'ADAPTER_VERSION_MISMATCH'
  | 'AUTHORIZATION_MISSING'
  | 'AUTHORIZATION_EXPIRED'
  | 'AUTHORIZATION_SCOPE_MISMATCH'
  | 'SUBJECT_RESOLUTION_NOT_EXACT'
  | 'PII_REQUIRED'
  | 'DEDUPE_MATCH_PRESENT'
  | 'DEDUPE_CONFLICT'
  | 'COMMUNICATION_ADJACENCY'
  | 'WRITE_COUNT_NOT_ONE'
  | 'RETRY_NOT_ZERO'
  | 'TRANSACTION_POSTURE_UNAVAILABLE'
  | 'UNEXPECTED_SCHEMA_STATE'
  | 'POST_WRITE_VERIFICATION_UNAVAILABLE'
  | 'SECOND_WRITE_REQUESTED'
  | 'INVALID_READINESS_AUTHORITY';

export type OneUseExecutiveAuthorizationFixture = Readonly<{
  schemaVersion: typeof BOUNDED_CRM_TASK_WRITE_PROOF_ADAPTER_SCHEMA_VERSION;
  authorizationId: string;
  authorizedWritePlanFingerprint: string;
  authorizedCanonicalRevision: string;
  authorizedAdapterId: typeof BOUNDED_CRM_TASK_WRITE_PROOF_ADAPTER_ID;
  authorizedAdapterVersion: typeof BOUNDED_CRM_TASK_WRITE_PROOF_ADAPTER_VERSION;
  maximumAuthorizedWrites: 1;
  retryCount: 0;
  issuedAt: string;
  expiresAt: string;
  authorityClass: 'EXECUTIVE_HQ_ONE_USE_WRITE_PROOF';
  authorizationFingerprint: string;
}>;

export type CertifiedBoundedLiveProofPlanBinding = Readonly<{
  canonicalRevision: string;
  writePlanFingerprint: string;
  adapterId: typeof BOUNDED_CRM_TASK_WRITE_PROOF_ADAPTER_ID;
  adapterVersion: typeof BOUNDED_CRM_TASK_WRITE_PROOF_ADAPTER_VERSION;
  selectedCategory: string;
  leadResolutionEvidenceFingerprint: string;
  dedupeEvidenceFingerprint: string;
  requestedWriteCount: 1;
  maximumAuthorizedWrites: 1;
  retryCount: 0;
}>;

export type BoundedLiveProofOperationPlan = Readonly<{
  operations: readonly [
    Readonly<{ operation: 'RESOLVE_SUBJECT_TO_LEAD'; model: 'User'; filter: 'INTERNAL_PRIMARY_ID_ONLY'; select: readonly ['id']; maximumCardinality: 1; pii: 'PROHIBITED'; execution: 'NOT_EXECUTED' }>,
    Readonly<{ operation: 'INTENT_SPECIFIC_DEDUPE_READ'; model: 'CRMTask'; scope: 'RESOLVED_LEAD_ID_AND_EXACT_GOVERNED_TYPE_AND_CANONICAL_FINGERPRINTS'; return: 'BOUNDED_COUNTS_AND_STATUS_EVIDENCE_ONLY'; rawMetadata: 'PROHIBITED'; pii: 'PROHIBITED'; execution: 'NOT_EXECUTED' }>,
    Readonly<{ operation: 'CREATE_ONE_CRM_TASK'; model: 'CRMTask'; payload: ProposedBoundedCRMTaskWritePlan['finalCreatePayload']; sellerLeadId: 'PROHIBITED'; execution: 'NOT_EXECUTED' }>,
    Readonly<{ operation: 'VERIFY_CREATED_CRM_TASK'; model: 'CRMTask'; scope: 'CREATED_TASK_ID_AND_RESOLVED_LEAD_AND_CANONICAL_FINGERPRINTS'; return: 'CONTROLLED_VERIFICATION_EVIDENCE_ONLY'; rawMetadata: 'PROHIBITED'; pii: 'PROHIBITED'; execution: 'NOT_EXECUTED' }>,
  ];
  transaction: 'DEDUPE_READ_AND_SINGLE_CREATE_IF_SUPPORTED';
  racePosture: 'SINGLE_WRITE_WINDOW_ONLY' | 'RACE_CONDITION_NOT_ELIMINATED';
  retry: 'NO_RETRY';
  otherMutations: 'NO_OTHER_MUTATIONS';
  communication: 'COMMUNICATION_ISOLATED';
}>;

export type BoundedLiveProofFoundationInput = Readonly<{
  canonicalRevision: string;
  readiness: TaskWriteReadinessResult;
  authorization?: OneUseExecutiveAuthorizationFixture;
  evaluationAt: string;
}>;

export type BoundedLiveProofFoundationResult = Readonly<{
  classification: 'FOUNDATION_VALID' | 'EXECUTION_NOT_AUTHORIZED' | 'EXECUTION_PREREQUISITES_INCOMPLETE' | 'FAIL_CLOSED';
  execution: 'NOT_IMPLEMENTED';
  safeAccessPosture: 'SAFE_ACCESS_PATH_NOT_YET_ESTABLISHED';
  aggregateAuditPosture: 'BLOCKED_BY_SAFE_ACCESS_GATE';
  proofCategoryPosture: Readonly<{
    recommendedCategory: 'INTERACTION_PROMOTION_REVIEW';
    conditionalOnly: true;
    subjectOrEventHardcoded: false;
  }>;
  binding: CertifiedBoundedLiveProofPlanBinding | null;
  operationPlan: BoundedLiveProofOperationPlan | null;
  reasons: readonly BoundedLiveProofStopCondition[];
}>;

const ID_PATTERN = /^[A-Za-z0-9._:-]{3,160}$/;
const REVISION_PATTERN = /^[a-f0-9]{40}$/;
const ISO_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;
const PII_KEY_TOKENS = ['name', 'email', 'phone', 'address', 'message', 'note', 'customer', 'inquiry', 'narrative'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function exactKeys(value: Record<string, unknown>, keys: readonly string[]) {
  return Object.keys(value).every((key) => keys.includes(key)) && keys.every((key) => key in value);
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

export function createBoundedLiveProofAdapterFingerprint(kind: string, value: unknown): string {
  return 'bounded-live-proof-adapter:' + kind + ':v1:' + hash(stable(value));
}

function hasPiiKey(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(hasPiiKey);
  if (!isRecord(value)) return false;
  return Object.entries(value).some(([key, nested]) => {
    const normalized = key.replace(/[^a-z]/gi, '').toLowerCase();
    return PII_KEY_TOKENS.some((token) => normalized.includes(token)) || hasPiiKey(nested);
  });
}

function result(
  classification: BoundedLiveProofFoundationResult['classification'],
  binding: CertifiedBoundedLiveProofPlanBinding | null,
  operationPlan: BoundedLiveProofOperationPlan | null,
  reasons: readonly BoundedLiveProofStopCondition[],
): BoundedLiveProofFoundationResult {
  return {
    classification,
    execution: 'NOT_IMPLEMENTED',
    safeAccessPosture: 'SAFE_ACCESS_PATH_NOT_YET_ESTABLISHED',
    aggregateAuditPosture: 'BLOCKED_BY_SAFE_ACCESS_GATE',
    proofCategoryPosture: {
      recommendedCategory: 'INTERACTION_PROMOTION_REVIEW',
      conditionalOnly: true,
      subjectOrEventHardcoded: false,
    },
    binding,
    operationPlan,
    reasons: [...new Set(reasons)].sort(),
  };
}

function certifiedPlan(value: unknown): ProposedBoundedCRMTaskWritePlan | null {
  if (!isRecord(value) || value.classification !== 'READY_FOR_EXPLICIT_EXECUTIVE_WRITE_AUTHORIZATION' || !isRecord(value.plan) || !Array.isArray(value.reasons) || value.reasons.length !== 0) return null;
  const plan = value.plan as unknown as ProposedBoundedCRMTaskWritePlan;
  if (
    plan.classification !== 'NON_EXECUTABLE_BOUNDED_CRM_TASK_WRITE_PLAN'
    || plan.executiveAuthorization !== 'EXECUTIVE_WRITE_AUTHORIZATION_REQUIRED'
    || plan.aggregateAuditPosture !== 'BLOCKED_BY_SAFE_ACCESS_GATE'
    || plan.writeCountBoundary.requestedWriteCount !== 1
    || plan.writeCountBoundary.maximumAuthorizedWrites !== 1
    || plan.writeCountBoundary.retryCount !== 0
    || plan.secondWritePosture !== 'SECOND_WRITE_NOT_AUTHORIZED'
    || plan.communicationIsolation.isolationPosture !== 'COMMUNICATION_ISOLATED'
    || plan.leadResolutionEvidence.matchCardinality !== 'EXACTLY_ONE_MATCH'
    || plan.leadResolutionEvidence.piiExposurePosture !== 'NO_PII_FIELDS_SELECTED'
    || plan.dedupeEvidence.outcome !== 'NO_MATCH'
    || plan.dedupeEvidence.matchingCount !== 0
    || plan.dedupeEvidence.matchingStatusSummary.length !== 0
    || plan.transactionPlan.retryCount !== 0
    || plan.transactionPlan.communicationSideEffect !== 'PROHIBITED'
    || plan.transactionPlan.userInteractionMutation !== 'PROHIBITED'
    || plan.transactionPlan.sellerLeadMutation !== 'PROHIBITED'
    || plan.transactionPlan.savedSearchMutation !== 'PROHIBITED'
    || plan.disposition.posture !== 'RETAIN_PENDING_FOR_HUMAN_REVIEW'
    || plan.disposition.automaticDisposition !== 'PROHIBITED'
    || plan.disposition.destructiveDeletion !== 'PROHIBITED'
    || 'sellerLeadId' in plan.finalCreatePayload
    || hasPiiKey(plan.finalCreatePayload)
  ) return null;
  return plan;
}

function bindingFor(canonicalRevision: string, plan: ProposedBoundedCRMTaskWritePlan): CertifiedBoundedLiveProofPlanBinding | null {
  const taskIntent = plan.persistenceMapping.envelope.createTemplate.metadata.taskIntent;
  if (!REVISION_PATTERN.test(canonicalRevision) || !validId(plan.writePlanFingerprint) || !validId(taskIntent.intentType)) return null;
  return {
    canonicalRevision,
    writePlanFingerprint: plan.writePlanFingerprint,
    adapterId: BOUNDED_CRM_TASK_WRITE_PROOF_ADAPTER_ID,
    adapterVersion: BOUNDED_CRM_TASK_WRITE_PROOF_ADAPTER_VERSION,
    selectedCategory: taskIntent.intentType,
    leadResolutionEvidenceFingerprint: plan.leadResolutionEvidence.evidenceFingerprint,
    dedupeEvidenceFingerprint: plan.dedupeEvidence.evidenceFingerprint,
    requestedWriteCount: 1,
    maximumAuthorizedWrites: 1,
    retryCount: 0,
  };
}

function operationPlanFor(plan: ProposedBoundedCRMTaskWritePlan): BoundedLiveProofOperationPlan {
  return {
    operations: [
      { operation: 'RESOLVE_SUBJECT_TO_LEAD', model: 'User', filter: 'INTERNAL_PRIMARY_ID_ONLY', select: ['id'], maximumCardinality: 1, pii: 'PROHIBITED', execution: 'NOT_EXECUTED' },
      { operation: 'INTENT_SPECIFIC_DEDUPE_READ', model: 'CRMTask', scope: 'RESOLVED_LEAD_ID_AND_EXACT_GOVERNED_TYPE_AND_CANONICAL_FINGERPRINTS', return: 'BOUNDED_COUNTS_AND_STATUS_EVIDENCE_ONLY', rawMetadata: 'PROHIBITED', pii: 'PROHIBITED', execution: 'NOT_EXECUTED' },
      { operation: 'CREATE_ONE_CRM_TASK', model: 'CRMTask', payload: plan.finalCreatePayload, sellerLeadId: 'PROHIBITED', execution: 'NOT_EXECUTED' },
      { operation: 'VERIFY_CREATED_CRM_TASK', model: 'CRMTask', scope: 'CREATED_TASK_ID_AND_RESOLVED_LEAD_AND_CANONICAL_FINGERPRINTS', return: 'CONTROLLED_VERIFICATION_EVIDENCE_ONLY', rawMetadata: 'PROHIBITED', pii: 'PROHIBITED', execution: 'NOT_EXECUTED' },
    ],
    transaction: 'DEDUPE_READ_AND_SINGLE_CREATE_IF_SUPPORTED',
    racePosture: plan.racePosture,
    retry: 'NO_RETRY',
    otherMutations: 'NO_OTHER_MUTATIONS',
    communication: 'COMMUNICATION_ISOLATED',
  };
}

export function isBoundedLiveProofOperationSet(value: unknown): value is readonly BoundedLiveProofOperation[] {
  return Array.isArray(value)
    && value.length === BOUNDED_LIVE_PROOF_OPERATIONS.length
    && value.every((operation, index) => operation === BOUNDED_LIVE_PROOF_OPERATIONS[index]);
}

function authorizationStop(
  authorization: unknown,
  binding: CertifiedBoundedLiveProofPlanBinding,
  evaluationAt: unknown,
): BoundedLiveProofStopCondition | null {
  if (authorization === undefined || authorization === null) return 'AUTHORIZATION_MISSING';
  if (!isRecord(authorization) || !exactKeys(authorization, ['schemaVersion', 'authorizationId', 'authorizedWritePlanFingerprint', 'authorizedCanonicalRevision', 'authorizedAdapterId', 'authorizedAdapterVersion', 'maximumAuthorizedWrites', 'retryCount', 'issuedAt', 'expiresAt', 'authorityClass', 'authorizationFingerprint'])) return 'AUTHORIZATION_SCOPE_MISMATCH';
  if (!validIso(evaluationAt) || !validId(authorization.authorizationId) || !validIso(authorization.issuedAt) || !validIso(authorization.expiresAt)) return 'AUTHORIZATION_SCOPE_MISMATCH';
  const evaluatedAt = evaluationAt as string;
  const issuedAt = authorization.issuedAt as string;
  const expiresAt = authorization.expiresAt as string;
  if (Date.parse(issuedAt) >= Date.parse(expiresAt) || Date.parse(expiresAt) <= Date.parse(evaluatedAt)) return 'AUTHORIZATION_EXPIRED';
  if (
    authorization.schemaVersion !== BOUNDED_CRM_TASK_WRITE_PROOF_ADAPTER_SCHEMA_VERSION
    || authorization.authorizedWritePlanFingerprint !== binding.writePlanFingerprint
    || authorization.authorizedCanonicalRevision !== binding.canonicalRevision
    || authorization.authorizedAdapterId !== binding.adapterId
    || authorization.authorizedAdapterVersion !== binding.adapterVersion
    || authorization.maximumAuthorizedWrites !== 1
    || authorization.retryCount !== 0
    || authorization.authorityClass !== 'EXECUTIVE_HQ_ONE_USE_WRITE_PROOF'
  ) return authorization.authorizedCanonicalRevision !== binding.canonicalRevision ? 'CANONICAL_REVISION_MISMATCH' : authorization.authorizedWritePlanFingerprint !== binding.writePlanFingerprint ? 'WRITE_PLAN_FINGERPRINT_MISMATCH' : authorization.authorizedAdapterVersion !== binding.adapterVersion ? 'ADAPTER_VERSION_MISMATCH' : 'AUTHORIZATION_SCOPE_MISMATCH';
  const basis = { ...authorization, authorizationFingerprint: undefined };
  return authorization.authorizationFingerprint === createBoundedLiveProofAdapterFingerprint('one-use-authorization', basis) ? null : 'AUTHORIZATION_SCOPE_MISMATCH';
}

export function validateBoundedCRMTaskWriteProofFoundation(input: unknown): BoundedLiveProofFoundationResult {
  if (!isRecord(input)) return result('FAIL_CLOSED', null, null, ['INVALID_READINESS_AUTHORITY']);
  const plan = certifiedPlan(input.readiness);
  if (!plan) return result('FAIL_CLOSED', null, null, ['INVALID_READINESS_AUTHORITY']);
  if (typeof input.canonicalRevision !== 'string') return result('FAIL_CLOSED', null, null, ['CANONICAL_REVISION_MISMATCH']);
  const binding = bindingFor(input.canonicalRevision, plan);
  if (!binding) return result('FAIL_CLOSED', null, null, ['CANONICAL_REVISION_MISMATCH']);
  const operations = operationPlanFor(plan);
  if (!isBoundedLiveProofOperationSet(operations.operations.map((operation) => operation.operation))) return result('FAIL_CLOSED', binding, null, ['SECOND_WRITE_REQUESTED']);
  const authorizationReason = authorizationStop(input.authorization, binding, input.evaluationAt);
  if (authorizationReason) return result('EXECUTION_PREREQUISITES_INCOMPLETE', binding, operations, [authorizationReason, 'SAFE_DB_ACCESS_NOT_APPROVED']);
  return result('FOUNDATION_VALID', binding, operations, ['SAFE_DB_ACCESS_NOT_APPROVED']);
}
