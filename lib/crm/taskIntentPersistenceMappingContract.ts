import type {
  NormalizedTaskIntent,
  TaskIntentPriority,
  TaskIntentPriorityReason,
  TaskIntentResult,
  TaskIntentSourceCapability,
  TaskIntentType,
} from './taskIntentGovernance';

export const TASK_INTENT_PERSISTENCE_MAPPING_STATUS = 'REIE_CRM_TASK_INTENT_PERSISTENCE_MAPPING_CONTRACT_MVV' as const;

export const CRM_TASK_TYPE_BY_INTENT: Record<TaskIntentType, TaskIntentType> = {
  PROPERTY_INQUIRY_REVIEW: 'PROPERTY_INQUIRY_REVIEW',
  SAVED_SEARCH_STRATEGY_REVIEW: 'SAVED_SEARCH_STRATEGY_REVIEW',
  SELLER_VALUATION_INTAKE_REVIEW: 'SELLER_VALUATION_INTAKE_REVIEW',
  PRE_DISCOVERY_BRIEF_REVIEW: 'PRE_DISCOVERY_BRIEF_REVIEW',
  INTERACTION_PROMOTION_REVIEW: 'INTERACTION_PROMOTION_REVIEW',
};

export const CRM_TASK_TITLE_BY_INTENT: Record<TaskIntentType, string> = {
  PROPERTY_INQUIRY_REVIEW: 'Property inquiry review',
  SAVED_SEARCH_STRATEGY_REVIEW: 'Saved search strategy review',
  SELLER_VALUATION_INTAKE_REVIEW: 'Seller valuation intake review',
  PRE_DISCOVERY_BRIEF_REVIEW: 'Pre-discovery brief review',
  INTERACTION_PROMOTION_REVIEW: 'Interaction promotion review',
};

export type TaskIntentPersistenceMappingFailureReason =
  | 'INVALID_INPUT_AUTHORITY'
  | 'UNSAFE_INPUT_FIELD'
  | 'UNSAFE_INTENT_FIELD'
  | 'UNSUPPORTED_INTENT_TYPE'
  | 'UNSUPPORTED_SOURCE_CAPABILITY'
  | 'UNSUPPORTED_LIFECYCLE'
  | 'COMMUNICATION_AUTHORITY_NOT_PROHIBITED'
  | 'MISSING_GOVERNANCE_EVIDENCE'
  | 'PROPERTY_UNSUPPORTED_FOR_INTENT'
  | 'UNSUPPORTED_OWNER_POSTURE'
  | 'UNSUPPORTED_DUE_DATE_POSTURE'
  | 'UNSUPPORTED_STATUS'
  | 'UNSUPPORTED_PRIORITY'
  | 'NON_REGISTRY_TITLE';

export type TaskIntentPersistencePosture = {
  persistence: 'NOT_ATTEMPTED';
  communication: 'NOT_AUTHORIZED';
  leadResolution: 'REQUIRED_BEFORE_WRITE';
  idempotency: 'IDEMPOTENCY_NOT_YET_PROVEN';
};

export type CRMTaskGovernanceMetadata = {
  taskIntent: {
    schemaVersion: NormalizedTaskIntent['schemaVersion'];
    intentType: TaskIntentType;
    sourceCapability: TaskIntentSourceCapability;
    subject: NormalizedTaskIntent['subject'];
    property?: NonNullable<NormalizedTaskIntent['property']>;
    ownerPosture: NormalizedTaskIntent['ownerPosture'];
    priorityReason: TaskIntentPriorityReason;
    dueDatePosture: NormalizedTaskIntent['dueDatePosture'];
    sourceEventFingerprint: string;
    dedupeKey: string;
    auditFingerprint: string;
    evidenceCodes: readonly NormalizedTaskIntent['evidenceCodes'][number][];
    lifecycleClass: 'HUMAN_REVIEW_ONLY';
    communicationAuthority: 'CUSTOMER_COMMUNICATION_NOT_AUTHORIZED';
    consentPosture: NormalizedTaskIntent['consentPosture'];
    expirationPosture: NormalizedTaskIntent['expirationPosture'];
    generatedAt: string;
  };
};

export type ProposedCRMTaskPersistenceEnvelope = {
  target: 'CRMTask';
  executable: false;
  createTemplate: {
    type: TaskIntentType;
    status: 'pending';
    priority: TaskIntentPriority;
    title: string;
    metadata: CRMTaskGovernanceMetadata;
  };
  unresolvedFields: readonly ['leadId'];
  omittedSystemFields: readonly ['id', 'createdAt', 'sellerLeadId'];
  fieldClassification: {
    existingColumns: readonly ['type', 'status', 'priority', 'title', 'metadata'];
    boundedGovernanceMetadata: readonly [
      'schemaVersion',
      'intentType',
      'sourceCapability',
      'subject',
      'property',
      'ownerPosture',
      'priorityReason',
      'dueDatePosture',
      'sourceEventFingerprint',
      'dedupeKey',
      'auditFingerprint',
      'evidenceCodes',
      'lifecycleClass',
      'communicationAuthority',
      'consentPosture',
      'expirationPosture',
      'generatedAt',
    ];
    notSuppliedByPureMapper: readonly ['CRMTask.id', 'CRMTask.createdAt', 'CRMTask.leadId', 'CRMTask.sellerLeadId'];
    futureSchemaCandidates: readonly [
      'taskOwner',
      'dueDate',
      'propertyForeignKey',
      'uniqueDedupeKey',
      'indexedAuditFingerprint',
      'constrainedLifecycleStatus',
      'completionTimestamps',
    ];
  };
};

export type LeadResolutionRequiredResult = TaskIntentPersistencePosture & {
  classification: 'LEAD_RESOLUTION_REQUIRED';
  envelope: ProposedCRMTaskPersistenceEnvelope;
  reasons: readonly [];
};

export type PersistenceMappingFailClosedResult = TaskIntentPersistencePosture & {
  classification: 'FAIL_CLOSED';
  envelope: null;
  reasons: readonly TaskIntentPersistenceMappingFailureReason[];
};

export type TaskIntentPersistenceMappingResult = LeadResolutionRequiredResult | PersistenceMappingFailClosedResult;

const POSTURE: TaskIntentPersistencePosture = {
  persistence: 'NOT_ATTEMPTED',
  communication: 'NOT_AUTHORIZED',
  leadResolution: 'REQUIRED_BEFORE_WRITE',
  idempotency: 'IDEMPOTENCY_NOT_YET_PROVEN',
};

const VALID_SOURCE_CAPABILITIES = new Set<TaskIntentSourceCapability>([
  'PROPERTY_INQUIRY_SUBMISSION',
  'SAVED_SEARCH_SUBMISSION',
  'SELLER_VALUATION_SUBMISSION',
  'PRE_DISCOVERY_SIGNAL',
  'INTERACTION_PROMOTION',
]);

const VALID_PRIORITIES = new Set<TaskIntentPriority>(['high', 'medium', 'low']);
const VALID_PRIORITY_REASONS = new Set<TaskIntentPriorityReason>([
  'TIME_SENSITIVE_HUMAN_REVIEW',
  'STANDARD_HUMAN_REVIEW',
  'ROUTINE_HUMAN_REVIEW',
]);
const VALID_OWNER_POSTURES = new Set(['UNASSIGNED', 'HUMAN_OWNER_REQUIRED', 'EXPLICIT_HUMAN_OWNER']);
const VALID_DUE_DATE_POSTURES = new Set(['NO_DUE_DATE', 'HUMAN_DUE_DATE_ASSIGNMENT_REQUIRED']);
const VALID_CONSENT_POSTURES = new Set([
  'NOT_APPLICABLE_TO_TASK_ONLY',
  'HUMAN_CONSENT_REVIEW_REQUIRED_FOR_ANY_FUTURE_COMMUNICATION',
]);
const VALID_EXPIRATION_POSTURES = new Set(['NO_EXPIRATION', 'HUMAN_EXPIRATION_REVIEW_REQUIRED']);

const INPUT_ALLOWED_KEYS = ['classification', 'intent', 'reasons'] as const;
const INTENT_ALLOWED_KEYS = [
  'schemaVersion',
  'classification',
  'intentType',
  'sourceCapability',
  'subject',
  'property',
  'ownerPosture',
  'priority',
  'dueDatePosture',
  'sourceEventFingerprint',
  'evidenceCodes',
  'lifecycleClass',
  'communicationAuthority',
  'consentPosture',
  'expirationPosture',
  'generatedAt',
  'dedupeKey',
  'auditFingerprint',
] as const;
const PII_FIELD_TOKENS = ['name', 'email', 'phone', 'address', 'message', 'note', 'customer', 'inquiryNarrative', 'sellerNarrative'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function failClosed(...reasons: readonly TaskIntentPersistenceMappingFailureReason[]): PersistenceMappingFailClosedResult {
  return { classification: 'FAIL_CLOSED', envelope: null, reasons: [...new Set(reasons)].sort(), ...POSTURE };
}

function hasUnsafeKeys(value: Record<string, unknown>, allowed: readonly string[]) {
  return Object.keys(value).some((key) => {
    const normalized = key.replace(/[^a-z]/gi, '').toLowerCase();
    return !allowed.includes(key) || PII_FIELD_TOKENS.some((token) => normalized.includes(token.toLowerCase()));
  });
}

function isTaskIntentSuccess(value: unknown): value is Extract<TaskIntentResult, { classification: 'VALID_TASK_INTENT' }> {
  if (!isRecord(value)) return false;
  if (hasUnsafeKeys(value, INPUT_ALLOWED_KEYS)) return false;
  return value.classification === 'VALID_TASK_INTENT' && isRecord(value.intent) && Array.isArray(value.reasons) && value.reasons.length === 0;
}

function validateIntent(intent: Record<string, unknown>): TaskIntentPersistenceMappingFailureReason[] {
  const reasons = new Set<TaskIntentPersistenceMappingFailureReason>();
  if (hasUnsafeKeys(intent, INTENT_ALLOWED_KEYS)) reasons.add('UNSAFE_INTENT_FIELD');

  if (intent.classification !== 'VALID_TASK_INTENT') reasons.add('INVALID_INPUT_AUTHORITY');
  if (typeof intent.intentType !== 'string' || !(intent.intentType in CRM_TASK_TYPE_BY_INTENT)) reasons.add('UNSUPPORTED_INTENT_TYPE');
  if (typeof intent.sourceCapability !== 'string' || !VALID_SOURCE_CAPABILITIES.has(intent.sourceCapability as TaskIntentSourceCapability)) reasons.add('UNSUPPORTED_SOURCE_CAPABILITY');
  if (intent.lifecycleClass !== 'HUMAN_REVIEW_ONLY') reasons.add('UNSUPPORTED_LIFECYCLE');
  if (intent.communicationAuthority !== 'CUSTOMER_COMMUNICATION_NOT_AUTHORIZED') reasons.add('COMMUNICATION_AUTHORITY_NOT_PROHIBITED');

  const priority = isRecord(intent.priority) ? intent.priority : null;
  if (!priority || !VALID_PRIORITIES.has(priority.level as TaskIntentPriority) || !VALID_PRIORITY_REASONS.has(priority.reason as TaskIntentPriorityReason)) {
    reasons.add('UNSUPPORTED_PRIORITY');
  }

  const ownerPosture = isRecord(intent.ownerPosture) ? intent.ownerPosture : null;
  if (!ownerPosture || !VALID_OWNER_POSTURES.has(String(ownerPosture.state))) reasons.add('UNSUPPORTED_OWNER_POSTURE');
  if (typeof intent.dueDatePosture !== 'string' || !VALID_DUE_DATE_POSTURES.has(intent.dueDatePosture)) reasons.add('UNSUPPORTED_DUE_DATE_POSTURE');
  if (typeof intent.consentPosture !== 'string' || !VALID_CONSENT_POSTURES.has(intent.consentPosture)) reasons.add('MISSING_GOVERNANCE_EVIDENCE');
  if (typeof intent.expirationPosture !== 'string' || !VALID_EXPIRATION_POSTURES.has(intent.expirationPosture)) reasons.add('MISSING_GOVERNANCE_EVIDENCE');

  if (!isRecord(intent.subject) || intent.subject.kind !== 'INTERNAL_SUBJECT_ID' || typeof intent.subject.id !== 'string') reasons.add('MISSING_GOVERNANCE_EVIDENCE');
  if (intent.property !== null && intent.property !== undefined) {
    if (intent.intentType !== 'PROPERTY_INQUIRY_REVIEW') reasons.add('PROPERTY_UNSUPPORTED_FOR_INTENT');
    if (!isRecord(intent.property) || intent.property.kind !== 'INTERNAL_PROPERTY_ID' || typeof intent.property.id !== 'string') reasons.add('MISSING_GOVERNANCE_EVIDENCE');
  }

  for (const key of ['schemaVersion', 'sourceEventFingerprint', 'dedupeKey', 'auditFingerprint', 'generatedAt'] as const) {
    if (typeof intent[key] !== 'string' || !intent[key]) reasons.add('MISSING_GOVERNANCE_EVIDENCE');
  }
  if (!Array.isArray(intent.evidenceCodes) || intent.evidenceCodes.length === 0 || !intent.evidenceCodes.every((code) => typeof code === 'string')) {
    reasons.add('MISSING_GOVERNANCE_EVIDENCE');
  }

  const title = typeof intent.intentType === 'string' && intent.intentType in CRM_TASK_TITLE_BY_INTENT
    ? CRM_TASK_TITLE_BY_INTENT[intent.intentType as TaskIntentType]
    : null;
  if (!title) reasons.add('NON_REGISTRY_TITLE');

  return [...reasons].sort();
}

function buildMetadata(intent: NormalizedTaskIntent): CRMTaskGovernanceMetadata {
  return {
    taskIntent: {
      schemaVersion: intent.schemaVersion,
      intentType: intent.intentType,
      sourceCapability: intent.sourceCapability,
      subject: intent.subject,
      ...(intent.property ? { property: intent.property } : {}),
      ownerPosture: intent.ownerPosture,
      priorityReason: intent.priority.reason,
      dueDatePosture: intent.dueDatePosture,
      sourceEventFingerprint: intent.sourceEventFingerprint,
      dedupeKey: intent.dedupeKey,
      auditFingerprint: intent.auditFingerprint,
      evidenceCodes: intent.evidenceCodes,
      lifecycleClass: intent.lifecycleClass,
      communicationAuthority: intent.communicationAuthority,
      consentPosture: intent.consentPosture,
      expirationPosture: intent.expirationPosture,
      generatedAt: intent.generatedAt,
    },
  };
}

export function buildTaskIntentPersistenceMapping(input: unknown): TaskIntentPersistenceMappingResult {
  if (!isTaskIntentSuccess(input)) {
    if (isRecord(input) && hasUnsafeKeys(input, INPUT_ALLOWED_KEYS)) return failClosed('UNSAFE_INPUT_FIELD');
    return failClosed('INVALID_INPUT_AUTHORITY');
  }

  const intentRecord = input.intent as unknown as Record<string, unknown>;
  const validationReasons = validateIntent(intentRecord);
  if (validationReasons.length > 0) return failClosed(...validationReasons);

  const intent = input.intent;
  const type = CRM_TASK_TYPE_BY_INTENT[intent.intentType];
  const title = CRM_TASK_TITLE_BY_INTENT[intent.intentType];
  if (!type) return failClosed('UNSUPPORTED_INTENT_TYPE');
  if (!title) return failClosed('NON_REGISTRY_TITLE');

  return {
    classification: 'LEAD_RESOLUTION_REQUIRED',
    reasons: [],
    envelope: {
      target: 'CRMTask',
      executable: false,
      createTemplate: {
        type,
        status: 'pending',
        priority: intent.priority.level,
        title,
        metadata: buildMetadata(intent),
      },
      unresolvedFields: ['leadId'],
      omittedSystemFields: ['id', 'createdAt', 'sellerLeadId'],
      fieldClassification: {
        existingColumns: ['type', 'status', 'priority', 'title', 'metadata'],
        boundedGovernanceMetadata: [
          'schemaVersion',
          'intentType',
          'sourceCapability',
          'subject',
          'property',
          'ownerPosture',
          'priorityReason',
          'dueDatePosture',
          'sourceEventFingerprint',
          'dedupeKey',
          'auditFingerprint',
          'evidenceCodes',
          'lifecycleClass',
          'communicationAuthority',
          'consentPosture',
          'expirationPosture',
          'generatedAt',
        ],
        notSuppliedByPureMapper: ['CRMTask.id', 'CRMTask.createdAt', 'CRMTask.leadId', 'CRMTask.sellerLeadId'],
        futureSchemaCandidates: [
          'taskOwner',
          'dueDate',
          'propertyForeignKey',
          'uniqueDedupeKey',
          'indexedAuditFingerprint',
          'constrainedLifecycleStatus',
          'completionTimestamps',
        ],
      },
    },
    ...POSTURE,
  };
}
