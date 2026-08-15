import type { LeadResolutionRequiredResult } from './taskIntentPersistenceMappingContract';

export const TASK_WRITE_READINESS_SCHEMA_VERSION = 'REIE_CRM_TASK_WRITE_READINESS_V1' as const;

export type WriteReadinessClassification =
  | 'FAIL_CLOSED'
  | 'LEAD_RESOLUTION_EVIDENCE_REQUIRED'
  | 'DEDUPE_EVIDENCE_REQUIRED'
  | 'COMMUNICATION_ISOLATION_EVIDENCE_REQUIRED'
  | 'ROLLBACK_PLAN_REQUIRED'
  | 'POST_WRITE_VERIFICATION_PLAN_REQUIRED'
  | 'RACE_RISK_ACKNOWLEDGEMENT_REQUIRED'
  | 'EXECUTIVE_WRITE_AUTHORIZATION_REQUIRED'
  | 'READY_FOR_EXPLICIT_EXECUTIVE_WRITE_AUTHORIZATION';

export type WriteReadinessFailureReason =
  | 'INVALID_INPUT_SHAPE'
  | 'INVALID_PERSISTENCE_MAPPING_AUTHORITY'
  | 'INVALID_PERSISTENCE_MAPPING_POSTURE'
  | 'INVALID_LEAD_RESOLUTION_EVIDENCE'
  | 'LEAD_RESOLUTION_NOT_EXACTLY_ONE'
  | 'UNSAFE_LEAD_RESOLUTION_METHOD'
  | 'LEAD_RESOLUTION_PII_EXPOSURE'
  | 'LEAD_RESOLUTION_FINGERPRINT_MISMATCH'
  | 'INVALID_DEDUPE_EVIDENCE'
  | 'DEDUPE_EVIDENCE_NOT_NO_MATCH'
  | 'DEDUPE_FINGERPRINT_MISMATCH'
  | 'PAYLOAD_DRIFT'
  | 'PAYLOAD_PII_FIELD'
  | 'UNSUPPORTED_SELLER_LEAD_ID'
  | 'INVALID_WRITE_BOUND'
  | 'INVALID_COMMUNICATION_ISOLATION'
  | 'COMMUNICATION_ADJACENCY_DETECTED'
  | 'INVALID_TRANSACTION_POSTURE'
  | 'INVALID_POST_WRITE_VERIFICATION_PLAN'
  | 'INVALID_DISPOSITION_PLAN'
  | 'RACE_RISK_NOT_ACKNOWLEDGED'
  | 'SECOND_WRITE_REQUESTED'
  | 'INVALID_AGGREGATE_AUDIT_POSTURE';

export type SubjectLeadResolutionEvidence = Readonly<{
  subjectInternalId: string;
  resolvedLeadId: string;
  resolutionMethod: 'INTERNAL_SUBJECT_ID_TO_USER_PRIMARY_KEY';
  resolverAuthority: 'DEDICATED_WRITE_PROOF_RESOLVER';
  queryScopeFingerprint: string;
  matchCardinality: 'EXACTLY_ONE_MATCH' | 'ZERO_MATCHES' | 'MULTIPLE_MATCHES' | 'UNVERIFIED';
  observedAt: string;
  piiExposurePosture: 'NO_PII_FIELDS_SELECTED' | 'PII_EXPOSURE';
  evidenceFingerprint: string;
}>;

export type IntentSpecificDedupeEvidence = Readonly<{
  dedupeKey: string;
  auditFingerprint: string;
  resolvedLeadId: string;
  readScopeFingerprint: string;
  observedAt: string;
  outcome: 'NO_MATCH' | 'ONE_EXISTING_EQUIVALENT' | 'MULTIPLE_MATCHES' | 'CONFLICTING_MATCH' | 'UNVERIFIED';
  matchingCount: number;
  matchingStatusSummary: readonly ('pending' | 'reviewing' | 'dismissed' | 'completed' | 'unknown')[];
  evidenceFingerprint: string;
}>;

export type ExecutionPathIsolationCertification = Readonly<{
  adapterId: string;
  adapterVersion: string;
  writePlanScope: 'ONE_CRM_TASK_CREATE';
  staticCertificationReference: string;
  reviewedAt: string;
  reviewerAuthority: 'EXECUTIVE_REVIEWED' | 'SECURITY_REVIEWED';
  isolationPosture: 'COMMUNICATION_ISOLATED' | 'ADJACENCY_DETECTED';
  evidenceFingerprint: string;
}>;

export type TransactionPlanEvidence = Readonly<{
  posture: 'DEDUPE_READ_AND_ONE_CREATE_TRANSACTION_WHERE_FEASIBLE';
  retryCount: 0;
  userInteractionMutation: 'PROHIBITED';
  sellerLeadMutation: 'PROHIBITED';
  savedSearchMutation: 'PROHIBITED';
  communicationSideEffect: 'PROHIBITED';
  racePosture: 'SINGLE_WRITE_WINDOW_ONLY' | 'RACE_CONDITION_NOT_ELIMINATED';
  evidenceFingerprint: string;
}>;

export type WriteCountBoundary = Readonly<{
  requestedWriteCount: 1;
  maximumAuthorizedWrites: 1;
  retryCount: 0;
  secondWritePosture: 'SECOND_WRITE_NOT_AUTHORIZED';
}>;

export type PostWriteVerificationPlan = Readonly<{
  verificationScope: 'ONE_CRM_TASK_POST_WRITE_READ';
  expectedMatchingCount: 1;
  requiredChecks: readonly [
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
  ];
  evidencePlanFingerprint: string;
}>;

export type DispositionPlan = Readonly<{
  posture: 'RETAIN_PENDING_FOR_HUMAN_REVIEW';
  automaticDisposition: 'PROHIBITED';
  destructiveDeletion: 'PROHIBITED';
  reviewerAuthority: 'HUMAN_REVIEW_REQUIRED';
  evidencePlanFingerprint: string;
}>;

export type FinalCRMTaskCreatePayload = Readonly<{
  leadId: string;
  type: string;
  status: string;
  priority: string;
  title: string;
  metadata: Readonly<Record<string, unknown>>;
}>;

export type ProposedBoundedCRMTaskWritePlan = Readonly<{
  classification: 'NON_EXECUTABLE_BOUNDED_CRM_TASK_WRITE_PLAN';
  persistenceMapping: LeadResolutionRequiredResult;
  leadResolutionEvidence: SubjectLeadResolutionEvidence;
  dedupeEvidence: IntentSpecificDedupeEvidence;
  finalCreatePayload: FinalCRMTaskCreatePayload;
  transactionPlan: TransactionPlanEvidence;
  writeCountBoundary: WriteCountBoundary;
  communicationIsolation: ExecutionPathIsolationCertification;
  postWriteVerification: PostWriteVerificationPlan & Readonly<{ expectedWritePlanFingerprint: string }>;
  disposition: DispositionPlan;
  racePosture: 'SINGLE_WRITE_WINDOW_ONLY' | 'RACE_CONDITION_NOT_ELIMINATED';
  executiveAuthorization: 'EXECUTIVE_WRITE_AUTHORIZATION_REQUIRED';
  aggregateAuditPosture: 'BLOCKED_BY_SAFE_ACCESS_GATE';
  secondWritePosture: 'SECOND_WRITE_NOT_AUTHORIZED';
  writePlanFingerprint: string;
}>;

export type TaskWriteReadinessResult = Readonly<{
  classification: WriteReadinessClassification;
  plan: ProposedBoundedCRMTaskWritePlan | null;
  reasons: readonly WriteReadinessFailureReason[];
}>;

const ID_PATTERN = /^[A-Za-z0-9._:-]{3,160}$/;
const ISO_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;
const PII_KEY_TOKENS = ['name', 'email', 'phone', 'address', 'message', 'note', 'customer', 'inquiry', 'narrative'];
const POST_WRITE_CHECKS: PostWriteVerificationPlan['requiredChecks'] = [
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
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
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

function hash(value: string) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return (result >>> 0).toString(16).padStart(8, '0');
}

export function createTaskWriteReadinessFingerprint(kind: string, value: unknown) {
  return 'task-write-readiness:' + kind + ':v1:' + hash(stable(value));
}

function hasPiiKey(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(hasPiiKey);
  if (!isRecord(value)) return false;
  return Object.entries(value).some(([key, nested]) => {
    const normalized = key.replace(/[^a-z]/gi, '').toLowerCase();
    return PII_KEY_TOKENS.some((token) => normalized.includes(token)) || hasPiiKey(nested);
  });
}

function exactKeys(value: Record<string, unknown>, keys: readonly string[]) {
  return Object.keys(value).every((key) => keys.includes(key)) && keys.every((key) => key in value);
}

function invalid(...reasons: WriteReadinessFailureReason[]): TaskWriteReadinessResult {
  return { classification: 'FAIL_CLOSED', plan: null, reasons: [...new Set(reasons)].sort() };
}

function required(classification: Exclude<WriteReadinessClassification, 'FAIL_CLOSED' | 'READY_FOR_EXPLICIT_EXECUTIVE_WRITE_AUTHORIZATION'>, reason: WriteReadinessFailureReason): TaskWriteReadinessResult {
  return { classification, plan: null, reasons: [reason] };
}

function persistenceMapping(value: unknown): LeadResolutionRequiredResult | null {
  if (!isRecord(value) || value.classification !== 'LEAD_RESOLUTION_REQUIRED' || !isRecord(value.envelope)) return null;
  const envelope = value.envelope;
  if (
    envelope.target !== 'CRMTask'
    || envelope.executable !== false
    || value.persistence !== 'NOT_ATTEMPTED'
    || value.communication !== 'NOT_AUTHORIZED'
    || value.leadResolution !== 'REQUIRED_BEFORE_WRITE'
    || value.idempotency !== 'IDEMPOTENCY_NOT_YET_PROVEN'
    || !Array.isArray(envelope.unresolvedFields)
    || envelope.unresolvedFields.length !== 1
    || envelope.unresolvedFields[0] !== 'leadId'
    || !Array.isArray(envelope.omittedSystemFields)
    || !envelope.omittedSystemFields.includes('sellerLeadId')
    || !isRecord(envelope.createTemplate)
  ) return null;
  return value as LeadResolutionRequiredResult;
}

function leadEvidence(value: unknown, expectedSubject: unknown): SubjectLeadResolutionEvidence | null {
  if (!isRecord(value) || !exactKeys(value, ['subjectInternalId', 'resolvedLeadId', 'resolutionMethod', 'resolverAuthority', 'queryScopeFingerprint', 'matchCardinality', 'observedAt', 'piiExposurePosture', 'evidenceFingerprint'])) return null;
  if (!validId(value.subjectInternalId) || !validId(value.resolvedLeadId) || !validId(value.queryScopeFingerprint) || !validIso(value.observedAt)) return null;
  if (value.subjectInternalId !== expectedSubject || value.resolutionMethod !== 'INTERNAL_SUBJECT_ID_TO_USER_PRIMARY_KEY' || value.resolverAuthority !== 'DEDICATED_WRITE_PROOF_RESOLVER' || value.matchCardinality !== 'EXACTLY_ONE_MATCH' || value.piiExposurePosture !== 'NO_PII_FIELDS_SELECTED') return null;
  const basis = { ...value, evidenceFingerprint: undefined };
  if (value.evidenceFingerprint !== createTaskWriteReadinessFingerprint('lead-resolution', basis)) return null;
  return value as SubjectLeadResolutionEvidence;
}

function dedupeEvidence(value: unknown, envelope: LeadResolutionRequiredResult, leadId: string): IntentSpecificDedupeEvidence | null {
  if (!isRecord(value) || !exactKeys(value, ['dedupeKey', 'auditFingerprint', 'resolvedLeadId', 'readScopeFingerprint', 'observedAt', 'outcome', 'matchingCount', 'matchingStatusSummary', 'evidenceFingerprint'])) return null;
  const metadata = envelope.envelope.createTemplate.metadata as unknown as Record<string, unknown>;
  const taskIntent = isRecord(metadata.taskIntent) ? metadata.taskIntent : null;
  if (!taskIntent || value.dedupeKey !== taskIntent.dedupeKey || value.auditFingerprint !== taskIntent.auditFingerprint || value.resolvedLeadId !== leadId || !validId(value.readScopeFingerprint) || !validIso(value.observedAt) || !Array.isArray(value.matchingStatusSummary) || !value.matchingStatusSummary.every((status) => ['pending', 'reviewing', 'dismissed', 'completed', 'unknown'].includes(status))) return null;
  if (value.outcome !== 'NO_MATCH' || value.matchingCount !== 0 || value.matchingStatusSummary.length !== 0) return null;
  const basis = { ...value, evidenceFingerprint: undefined };
  if (value.evidenceFingerprint !== createTaskWriteReadinessFingerprint('dedupe', basis)) return null;
  return value as IntentSpecificDedupeEvidence;
}

function isolationEvidence(value: unknown): ExecutionPathIsolationCertification | null {
  if (!isRecord(value) || !exactKeys(value, ['adapterId', 'adapterVersion', 'writePlanScope', 'staticCertificationReference', 'reviewedAt', 'reviewerAuthority', 'isolationPosture', 'evidenceFingerprint'])) return null;
  if (!validId(value.adapterId) || !validId(value.adapterVersion) || !validId(value.staticCertificationReference) || !validIso(value.reviewedAt)) return null;
  if (value.writePlanScope !== 'ONE_CRM_TASK_CREATE' || (value.reviewerAuthority !== 'EXECUTIVE_REVIEWED' && value.reviewerAuthority !== 'SECURITY_REVIEWED') || value.isolationPosture !== 'COMMUNICATION_ISOLATED') return null;
  const basis = { ...value, evidenceFingerprint: undefined };
  if (value.evidenceFingerprint !== createTaskWriteReadinessFingerprint('isolation', basis)) return null;
  return value as ExecutionPathIsolationCertification;
}

function transactionEvidence(value: unknown): TransactionPlanEvidence | null {
  if (!isRecord(value) || !exactKeys(value, ['posture', 'retryCount', 'userInteractionMutation', 'sellerLeadMutation', 'savedSearchMutation', 'communicationSideEffect', 'racePosture', 'evidenceFingerprint'])) return null;
  if (value.posture !== 'DEDUPE_READ_AND_ONE_CREATE_TRANSACTION_WHERE_FEASIBLE' || value.retryCount !== 0 || value.userInteractionMutation !== 'PROHIBITED' || value.sellerLeadMutation !== 'PROHIBITED' || value.savedSearchMutation !== 'PROHIBITED' || value.communicationSideEffect !== 'PROHIBITED' || (value.racePosture !== 'SINGLE_WRITE_WINDOW_ONLY' && value.racePosture !== 'RACE_CONDITION_NOT_ELIMINATED')) return null;
  const basis = { ...value, evidenceFingerprint: undefined };
  if (value.evidenceFingerprint !== createTaskWriteReadinessFingerprint('transaction', basis)) return null;
  return value as TransactionPlanEvidence;
}

function writeBound(value: unknown): WriteCountBoundary | null {
  if (!isRecord(value) || !exactKeys(value, ['requestedWriteCount', 'maximumAuthorizedWrites', 'retryCount', 'secondWritePosture'])) return null;
  if (value.requestedWriteCount !== 1 || value.maximumAuthorizedWrites !== 1 || value.retryCount !== 0 || value.secondWritePosture !== 'SECOND_WRITE_NOT_AUTHORIZED') return null;
  return value as WriteCountBoundary;
}

function verificationPlan(value: unknown): PostWriteVerificationPlan | null {
  if (!isRecord(value) || !exactKeys(value, ['verificationScope', 'expectedMatchingCount', 'requiredChecks', 'evidencePlanFingerprint'])) return null;
  if (value.verificationScope !== 'ONE_CRM_TASK_POST_WRITE_READ' || value.expectedMatchingCount !== 1 || !Array.isArray(value.requiredChecks) || stable(value.requiredChecks) !== stable(POST_WRITE_CHECKS) || !validId(value.evidencePlanFingerprint)) return null;
  return value as PostWriteVerificationPlan;
}

function dispositionPlan(value: unknown): DispositionPlan | null {
  if (!isRecord(value) || !exactKeys(value, ['posture', 'automaticDisposition', 'destructiveDeletion', 'reviewerAuthority', 'evidencePlanFingerprint'])) return null;
  if (value.posture !== 'RETAIN_PENDING_FOR_HUMAN_REVIEW' || value.automaticDisposition !== 'PROHIBITED' || value.destructiveDeletion !== 'PROHIBITED' || value.reviewerAuthority !== 'HUMAN_REVIEW_REQUIRED' || !validId(value.evidencePlanFingerprint)) return null;
  return value as DispositionPlan;
}

function payload(value: unknown, envelope: LeadResolutionRequiredResult, leadId: string): FinalCRMTaskCreatePayload | null {
  if (!isRecord(value) || !exactKeys(value, ['leadId', 'type', 'status', 'priority', 'title', 'metadata'])) return null;
  if ('sellerLeadId' in value) return null;
  const template = envelope.envelope.createTemplate;
  if (value.leadId !== leadId || value.type !== template.type || value.status !== template.status || value.priority !== template.priority || value.title !== template.title || !isRecord(value.metadata) || stable(value.metadata) !== stable(template.metadata) || hasPiiKey(value)) return null;
  return value as FinalCRMTaskCreatePayload;
}

export function evaluateCRMTaskWriteReadiness(input: unknown): TaskWriteReadinessResult {
  if (!isRecord(input)) return invalid('INVALID_INPUT_SHAPE');
  const mapping = persistenceMapping(input.persistenceMapping);
  if (!mapping) return invalid('INVALID_PERSISTENCE_MAPPING_AUTHORITY', 'INVALID_PERSISTENCE_MAPPING_POSTURE');
  const metadata = mapping.envelope.createTemplate.metadata as unknown as Record<string, unknown>;
  const taskIntent = isRecord(metadata.taskIntent) ? metadata.taskIntent : null;
  const subject = taskIntent && isRecord(taskIntent.subject) ? taskIntent.subject.id : null;
  if (isRecord(input.leadResolutionEvidence)) {
    if (input.leadResolutionEvidence.resolutionMethod !== 'INTERNAL_SUBJECT_ID_TO_USER_PRIMARY_KEY') return invalid('UNSAFE_LEAD_RESOLUTION_METHOD');
    if (input.leadResolutionEvidence.matchCardinality !== 'EXACTLY_ONE_MATCH') return invalid('LEAD_RESOLUTION_NOT_EXACTLY_ONE');
    if (input.leadResolutionEvidence.piiExposurePosture !== 'NO_PII_FIELDS_SELECTED') return invalid('LEAD_RESOLUTION_PII_EXPOSURE');
  }
  const lead = leadEvidence(input.leadResolutionEvidence, subject);
  if (!lead) return required('LEAD_RESOLUTION_EVIDENCE_REQUIRED', 'INVALID_LEAD_RESOLUTION_EVIDENCE');
  if (isRecord(input.dedupeEvidence) && input.dedupeEvidence.outcome !== 'NO_MATCH') return invalid('DEDUPE_EVIDENCE_NOT_NO_MATCH');
  const dedupe = dedupeEvidence(input.dedupeEvidence, mapping, lead.resolvedLeadId);
  if (!dedupe) return required('DEDUPE_EVIDENCE_REQUIRED', 'INVALID_DEDUPE_EVIDENCE');
  if (hasPiiKey(input.finalCreatePayload)) return invalid('PAYLOAD_PII_FIELD');
  if (isRecord(input.finalCreatePayload) && 'sellerLeadId' in input.finalCreatePayload) return invalid('UNSUPPORTED_SELLER_LEAD_ID');
  const finalPayload = payload(input.finalCreatePayload, mapping, lead.resolvedLeadId);
  if (!finalPayload) return invalid('PAYLOAD_DRIFT', 'UNSUPPORTED_SELLER_LEAD_ID');
  const bound = writeBound(input.writeCountBoundary);
  if (!bound) return invalid('INVALID_WRITE_BOUND', 'SECOND_WRITE_REQUESTED');
  if (isRecord(input.communicationIsolationEvidence) && input.communicationIsolationEvidence.isolationPosture === 'ADJACENCY_DETECTED') return invalid('COMMUNICATION_ADJACENCY_DETECTED');
  const isolation = isolationEvidence(input.communicationIsolationEvidence);
  if (!isolation) return required('COMMUNICATION_ISOLATION_EVIDENCE_REQUIRED', 'INVALID_COMMUNICATION_ISOLATION');
  const transaction = transactionEvidence(input.transactionPlan);
  if (!transaction) return invalid('INVALID_TRANSACTION_POSTURE');
  const verification = verificationPlan(input.postWriteVerificationPlan);
  if (!verification) return required('POST_WRITE_VERIFICATION_PLAN_REQUIRED', 'INVALID_POST_WRITE_VERIFICATION_PLAN');
  if (isRecord(input.dispositionPlan) && (input.dispositionPlan.automaticDisposition !== 'PROHIBITED' || input.dispositionPlan.destructiveDeletion !== 'PROHIBITED' || input.dispositionPlan.posture !== 'RETAIN_PENDING_FOR_HUMAN_REVIEW')) return invalid('INVALID_DISPOSITION_PLAN');
  const disposition = dispositionPlan(input.dispositionPlan);
  if (!disposition) return required('ROLLBACK_PLAN_REQUIRED', 'INVALID_DISPOSITION_PLAN');
  if (input.raceRiskAcknowledged !== true) return required('RACE_RISK_ACKNOWLEDGEMENT_REQUIRED', 'RACE_RISK_NOT_ACKNOWLEDGED');
  if (input.aggregateAuditPosture !== 'BLOCKED_BY_SAFE_ACCESS_GATE') return invalid('INVALID_AGGREGATE_AUDIT_POSTURE');

  const planBasis = {
    schemaVersion: TASK_WRITE_READINESS_SCHEMA_VERSION,
    mapping,
    lead,
    dedupe,
    finalPayload,
    transaction,
    bound,
    isolation,
    verification,
    disposition,
    aggregateAuditPosture: input.aggregateAuditPosture,
  };
  const writePlanFingerprint = createTaskWriteReadinessFingerprint('plan', planBasis);
  const plan: ProposedBoundedCRMTaskWritePlan = {
    classification: 'NON_EXECUTABLE_BOUNDED_CRM_TASK_WRITE_PLAN',
    persistenceMapping: mapping,
    leadResolutionEvidence: lead,
    dedupeEvidence: dedupe,
    finalCreatePayload: finalPayload,
    transactionPlan: transaction,
    writeCountBoundary: bound,
    communicationIsolation: isolation,
    postWriteVerification: { ...verification, expectedWritePlanFingerprint: writePlanFingerprint },
    disposition,
    racePosture: transaction.racePosture,
    executiveAuthorization: 'EXECUTIVE_WRITE_AUTHORIZATION_REQUIRED',
    aggregateAuditPosture: 'BLOCKED_BY_SAFE_ACCESS_GATE',
    secondWritePosture: 'SECOND_WRITE_NOT_AUTHORIZED',
    writePlanFingerprint,
  };
  return { classification: 'READY_FOR_EXPLICIT_EXECUTIVE_WRITE_AUTHORIZATION', plan, reasons: [] };
}
