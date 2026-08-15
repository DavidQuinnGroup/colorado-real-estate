export const TASK_INTENT_SCHEMA_VERSION = 'REIE_TASK_INTENT_V1' as const;

export const TASK_INTENT_TYPES = [
  'PROPERTY_INQUIRY_REVIEW',
  'SAVED_SEARCH_STRATEGY_REVIEW',
  'SELLER_VALUATION_INTAKE_REVIEW',
  'PRE_DISCOVERY_BRIEF_REVIEW',
  'INTERACTION_PROMOTION_REVIEW',
] as const;

export const TASK_INTENT_SOURCE_CAPABILITIES = [
  'PROPERTY_INQUIRY_SUBMISSION',
  'SAVED_SEARCH_SUBMISSION',
  'SELLER_VALUATION_SUBMISSION',
  'PRE_DISCOVERY_SIGNAL',
  'INTERACTION_PROMOTION',
] as const;

export const TASK_INTENT_PRIORITIES = ['high', 'medium', 'low'] as const;

export const TASK_INTENT_PRIORITY_REASONS = [
  'TIME_SENSITIVE_HUMAN_REVIEW',
  'STANDARD_HUMAN_REVIEW',
  'ROUTINE_HUMAN_REVIEW',
] as const;

export const TASK_INTENT_EVIDENCE_CODES = [
  'PROPERTY_INQUIRY_RECEIVED',
  'SAVED_SEARCH_SUBMITTED',
  'SELLER_VALUATION_REQUEST_RECEIVED',
  'PRE_DISCOVERY_SIGNAL_RECORDED',
  'INTERACTION_PROMOTION_REQUESTED',
] as const;

export type TaskIntentType = (typeof TASK_INTENT_TYPES)[number];
export type TaskIntentSourceCapability = (typeof TASK_INTENT_SOURCE_CAPABILITIES)[number];
export type TaskIntentPriority = (typeof TASK_INTENT_PRIORITIES)[number];
export type TaskIntentPriorityReason = (typeof TASK_INTENT_PRIORITY_REASONS)[number];
export type TaskIntentEvidenceCode = (typeof TASK_INTENT_EVIDENCE_CODES)[number];

export type TaskIntentFailureReason =
  | 'INVALID_INPUT_SHAPE'
  | 'UNSUPPORTED_FIELD'
  | 'PROHIBITED_PII_FIELD'
  | 'INVALID_SCHEMA_VERSION'
  | 'UNKNOWN_INTENT_TYPE'
  | 'UNKNOWN_SOURCE_CAPABILITY'
  | 'INTENT_SOURCE_MISMATCH'
  | 'MISSING_SUBJECT_REFERENCE'
  | 'INVALID_SUBJECT_REFERENCE'
  | 'INVALID_PROPERTY_REFERENCE'
  | 'UNSUPPORTED_PROPERTY_REFERENCE'
  | 'INVALID_OWNER_POSTURE'
  | 'INVALID_PRIORITY'
  | 'INVALID_PRIORITY_REASON'
  | 'INVALID_DUE_DATE_POSTURE'
  | 'INVALID_SOURCE_EVENT_REFERENCE'
  | 'INVALID_EVIDENCE_CODES'
  | 'INVALID_LIFECYCLE_CLASS'
  | 'CUSTOMER_COMMUNICATION_NOT_AUTHORIZED'
  | 'INVALID_CONSENT_POSTURE'
  | 'INVALID_EXPIRATION_POSTURE'
  | 'INVALID_GENERATED_AT';

type InternalReference = {
  kind: 'INTERNAL_SUBJECT_ID' | 'INTERNAL_PROPERTY_ID' | 'INTERNAL_OWNER_ID' | 'INTERNAL_SOURCE_EVENT_ID';
  id: string;
};

export type TaskIntentInput = {
  schemaVersion: typeof TASK_INTENT_SCHEMA_VERSION;
  intentType: TaskIntentType;
  sourceCapability: TaskIntentSourceCapability;
  subject: InternalReference;
  property?: InternalReference | null;
  ownerPosture:
    | { state: 'UNASSIGNED' }
    | { state: 'HUMAN_OWNER_REQUIRED' }
    | { state: 'EXPLICIT_HUMAN_OWNER'; owner: InternalReference };
  priority: { level: TaskIntentPriority; reason: TaskIntentPriorityReason };
  dueDatePosture: 'NO_DUE_DATE' | 'HUMAN_DUE_DATE_ASSIGNMENT_REQUIRED';
  sourceEvent: InternalReference;
  evidenceCodes: readonly TaskIntentEvidenceCode[];
  lifecycleClass: 'HUMAN_REVIEW_ONLY';
  communicationAuthority: 'CUSTOMER_COMMUNICATION_NOT_AUTHORIZED';
  consentPosture: 'NOT_APPLICABLE_TO_TASK_ONLY' | 'HUMAN_CONSENT_REVIEW_REQUIRED_FOR_ANY_FUTURE_COMMUNICATION';
  expirationPosture: 'NO_EXPIRATION' | 'HUMAN_EXPIRATION_REVIEW_REQUIRED';
  generatedAt: string;
};

export type NormalizedTaskIntent = {
  schemaVersion: typeof TASK_INTENT_SCHEMA_VERSION;
  classification: 'VALID_TASK_INTENT';
  intentType: TaskIntentType;
  sourceCapability: TaskIntentSourceCapability;
  subject: { kind: 'INTERNAL_SUBJECT_ID'; id: string };
  property: { kind: 'INTERNAL_PROPERTY_ID'; id: string } | null;
  ownerPosture:
    | { state: 'UNASSIGNED' }
    | { state: 'HUMAN_OWNER_REQUIRED' }
    | { state: 'EXPLICIT_HUMAN_OWNER'; owner: { kind: 'INTERNAL_OWNER_ID'; id: string } };
  priority: { level: TaskIntentPriority; reason: TaskIntentPriorityReason };
  dueDatePosture: 'NO_DUE_DATE' | 'HUMAN_DUE_DATE_ASSIGNMENT_REQUIRED';
  sourceEventFingerprint: string;
  evidenceCodes: readonly TaskIntentEvidenceCode[];
  lifecycleClass: 'HUMAN_REVIEW_ONLY';
  communicationAuthority: 'CUSTOMER_COMMUNICATION_NOT_AUTHORIZED';
  consentPosture: 'NOT_APPLICABLE_TO_TASK_ONLY' | 'HUMAN_CONSENT_REVIEW_REQUIRED_FOR_ANY_FUTURE_COMMUNICATION';
  expirationPosture: 'NO_EXPIRATION' | 'HUMAN_EXPIRATION_REVIEW_REQUIRED';
  generatedAt: string;
  dedupeKey: string;
  auditFingerprint: string;
};

export type TaskIntentResult =
  | { classification: 'VALID_TASK_INTENT'; intent: NormalizedTaskIntent; reasons: readonly [] }
  | { classification: 'FAIL_CLOSED'; intent: null; reasons: readonly TaskIntentFailureReason[] };

const SOURCE_BY_INTENT: Record<TaskIntentType, TaskIntentSourceCapability> = {
  PROPERTY_INQUIRY_REVIEW: 'PROPERTY_INQUIRY_SUBMISSION',
  SAVED_SEARCH_STRATEGY_REVIEW: 'SAVED_SEARCH_SUBMISSION',
  SELLER_VALUATION_INTAKE_REVIEW: 'SELLER_VALUATION_SUBMISSION',
  PRE_DISCOVERY_BRIEF_REVIEW: 'PRE_DISCOVERY_SIGNAL',
  INTERACTION_PROMOTION_REVIEW: 'INTERACTION_PROMOTION',
};

const EVIDENCE_BY_SOURCE: Record<TaskIntentSourceCapability, TaskIntentEvidenceCode> = {
  PROPERTY_INQUIRY_SUBMISSION: 'PROPERTY_INQUIRY_RECEIVED',
  SAVED_SEARCH_SUBMISSION: 'SAVED_SEARCH_SUBMITTED',
  SELLER_VALUATION_SUBMISSION: 'SELLER_VALUATION_REQUEST_RECEIVED',
  PRE_DISCOVERY_SIGNAL: 'PRE_DISCOVERY_SIGNAL_RECORDED',
  INTERACTION_PROMOTION: 'INTERACTION_PROMOTION_REQUESTED',
};

const PRIORITY_REASON_BY_LEVEL: Record<TaskIntentPriority, TaskIntentPriorityReason> = {
  high: 'TIME_SENSITIVE_HUMAN_REVIEW',
  medium: 'STANDARD_HUMAN_REVIEW',
  low: 'ROUTINE_HUMAN_REVIEW',
};

const PII_FIELD_TOKENS = ['name', 'email', 'phone', 'address', 'message', 'note', 'customer', 'inquiry', 'seller'];
const ID_PATTERN = /^[A-Za-z0-9._~-]{3,160}$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function isOneOf<T extends readonly string[]>(value: unknown, options: T): value is T[number] {
  return typeof value === 'string' && (options as readonly string[]).includes(value);
}

function hasOnlyKeys(value: Record<string, unknown>, allowed: readonly string[], reasons: Set<TaskIntentFailureReason>) {
  for (const key of Object.keys(value)) {
    const normalized = key.replace(/[^a-z]/gi, '').toLowerCase();
    if (PII_FIELD_TOKENS.some((token) => normalized.includes(token))) reasons.add('PROHIBITED_PII_FIELD');
    else if (!allowed.includes(key)) reasons.add('UNSUPPORTED_FIELD');
  }
}

function normalizedId(value: unknown) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return ID_PATTERN.test(trimmed) ? trimmed : null;
}

function normalizeReference<K extends InternalReference['kind']>(value: unknown, expectedKind: K): { kind: K; id: string } | null {
  if (!isRecord(value)) return null;
  const id = normalizedId(value.id);
  return value.kind === expectedKind && id ? { kind: expectedKind, id } : null;
}

function normalizeIso(value: unknown) {
  if (typeof value !== 'string') return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function stableHash(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

function fingerprint(kind: string, value: string) {
  return `${kind}:v1:${stableHash(value)}`;
}

function fail(reasons: Set<TaskIntentFailureReason>): TaskIntentResult {
  return { classification: 'FAIL_CLOSED', intent: null, reasons: [...reasons].sort() };
}

export function buildTaskIntent(input: unknown): TaskIntentResult {
  const reasons = new Set<TaskIntentFailureReason>();
  if (!isRecord(input)) return fail(new Set(['INVALID_INPUT_SHAPE']));

  hasOnlyKeys(
    input,
    [
      'schemaVersion',
      'intentType',
      'sourceCapability',
      'subject',
      'property',
      'ownerPosture',
      'priority',
      'dueDatePosture',
      'sourceEvent',
      'evidenceCodes',
      'lifecycleClass',
      'communicationAuthority',
      'consentPosture',
      'expirationPosture',
      'generatedAt',
    ],
    reasons,
  );

  if (input.schemaVersion !== TASK_INTENT_SCHEMA_VERSION) reasons.add('INVALID_SCHEMA_VERSION');
  if (!isOneOf(input.intentType, TASK_INTENT_TYPES)) reasons.add('UNKNOWN_INTENT_TYPE');
  if (!isOneOf(input.sourceCapability, TASK_INTENT_SOURCE_CAPABILITIES)) reasons.add('UNKNOWN_SOURCE_CAPABILITY');

  const intentType = isOneOf(input.intentType, TASK_INTENT_TYPES) ? input.intentType : null;
  const sourceCapability = isOneOf(input.sourceCapability, TASK_INTENT_SOURCE_CAPABILITIES) ? input.sourceCapability : null;
  if (intentType && sourceCapability && SOURCE_BY_INTENT[intentType] !== sourceCapability) reasons.add('INTENT_SOURCE_MISMATCH');

  if (isRecord(input.subject)) hasOnlyKeys(input.subject, ['kind', 'id'], reasons);
  const subject = normalizeReference(input.subject, 'INTERNAL_SUBJECT_ID');
  if (!subject) reasons.add(input.subject === undefined || input.subject === null ? 'MISSING_SUBJECT_REFERENCE' : 'INVALID_SUBJECT_REFERENCE');

  if (isRecord(input.property)) hasOnlyKeys(input.property, ['kind', 'id'], reasons);
  const property = input.property === undefined || input.property === null ? null : normalizeReference(input.property, 'INTERNAL_PROPERTY_ID');
  if (input.property !== undefined && input.property !== null && !property) reasons.add('INVALID_PROPERTY_REFERENCE');
  if (property && intentType !== 'PROPERTY_INQUIRY_REVIEW') reasons.add('UNSUPPORTED_PROPERTY_REFERENCE');

  let ownerPosture: NormalizedTaskIntent['ownerPosture'] | null = null;
  if (!isRecord(input.ownerPosture)) {
    reasons.add('INVALID_OWNER_POSTURE');
  } else if (input.ownerPosture.state === 'UNASSIGNED' || input.ownerPosture.state === 'HUMAN_OWNER_REQUIRED') {
    hasOnlyKeys(input.ownerPosture, ['state'], reasons);
    ownerPosture = { state: input.ownerPosture.state };
  } else if (input.ownerPosture.state === 'EXPLICIT_HUMAN_OWNER') {
    hasOnlyKeys(input.ownerPosture, ['state', 'owner'], reasons);
    if (isRecord(input.ownerPosture.owner)) hasOnlyKeys(input.ownerPosture.owner, ['kind', 'id'], reasons);
    const owner = normalizeReference(input.ownerPosture.owner, 'INTERNAL_OWNER_ID');
    if (!owner) reasons.add('INVALID_OWNER_POSTURE');
    else ownerPosture = { state: 'EXPLICIT_HUMAN_OWNER', owner };
  } else {
    reasons.add('INVALID_OWNER_POSTURE');
  }

  let priority: NormalizedTaskIntent['priority'] | null = null;
  if (!isRecord(input.priority)) {
    reasons.add('INVALID_PRIORITY');
  } else if (!isOneOf(input.priority.level, TASK_INTENT_PRIORITIES)) {
    reasons.add('INVALID_PRIORITY');
  } else if (!isOneOf(input.priority.reason, TASK_INTENT_PRIORITY_REASONS) || PRIORITY_REASON_BY_LEVEL[input.priority.level] !== input.priority.reason) {
    reasons.add('INVALID_PRIORITY_REASON');
  } else {
    hasOnlyKeys(input.priority, ['level', 'reason'], reasons);
    priority = { level: input.priority.level, reason: input.priority.reason };
  }

  const dueDatePosture =
    input.dueDatePosture === 'NO_DUE_DATE' || input.dueDatePosture === 'HUMAN_DUE_DATE_ASSIGNMENT_REQUIRED'
      ? input.dueDatePosture
      : null;
  if (!dueDatePosture) reasons.add('INVALID_DUE_DATE_POSTURE');

  if (isRecord(input.sourceEvent)) hasOnlyKeys(input.sourceEvent, ['kind', 'id'], reasons);
  const sourceEvent = normalizeReference(input.sourceEvent, 'INTERNAL_SOURCE_EVENT_ID');
  if (!sourceEvent) reasons.add('INVALID_SOURCE_EVENT_REFERENCE');

  const evidenceCodes = Array.isArray(input.evidenceCodes) && input.evidenceCodes.every((code) => isOneOf(code, TASK_INTENT_EVIDENCE_CODES))
    ? [...new Set(input.evidenceCodes)].sort() as TaskIntentEvidenceCode[]
    : null;
  if (!evidenceCodes || evidenceCodes.length === 0 || !sourceCapability || !evidenceCodes.includes(EVIDENCE_BY_SOURCE[sourceCapability])) reasons.add('INVALID_EVIDENCE_CODES');

  if (input.lifecycleClass !== 'HUMAN_REVIEW_ONLY') reasons.add('INVALID_LIFECYCLE_CLASS');
  if (input.communicationAuthority !== 'CUSTOMER_COMMUNICATION_NOT_AUTHORIZED') reasons.add('CUSTOMER_COMMUNICATION_NOT_AUTHORIZED');
  const consentPosture =
    input.consentPosture === 'NOT_APPLICABLE_TO_TASK_ONLY' || input.consentPosture === 'HUMAN_CONSENT_REVIEW_REQUIRED_FOR_ANY_FUTURE_COMMUNICATION'
      ? input.consentPosture
      : null;
  if (!consentPosture) reasons.add('INVALID_CONSENT_POSTURE');
  const expirationPosture = input.expirationPosture === 'NO_EXPIRATION' || input.expirationPosture === 'HUMAN_EXPIRATION_REVIEW_REQUIRED'
    ? input.expirationPosture
    : null;
  if (!expirationPosture) reasons.add('INVALID_EXPIRATION_POSTURE');
  const generatedAt = normalizeIso(input.generatedAt);
  if (!generatedAt) reasons.add('INVALID_GENERATED_AT');

  if (reasons.size > 0 || !intentType || !sourceCapability || !subject || !ownerPosture || !priority || !dueDatePosture || !sourceEvent || !evidenceCodes || !consentPosture || !expirationPosture || !generatedAt) {
    return fail(reasons);
  }

  const sourceEventFingerprint = fingerprint('source-event', `${sourceCapability}|${sourceEvent.id}`);
  const dedupeKey = fingerprint('dedupe', [TASK_INTENT_SCHEMA_VERSION, sourceCapability, intentType, subject.id, property?.id || 'NO_PROPERTY', sourceEventFingerprint].join('|'));
  const auditFingerprint = fingerprint('audit', [
    TASK_INTENT_SCHEMA_VERSION,
    intentType,
    sourceCapability,
    subject.id,
    property?.id || 'NO_PROPERTY',
    ownerPosture.state,
    ownerPosture.state === 'EXPLICIT_HUMAN_OWNER' ? ownerPosture.owner.id : 'NO_OWNER',
    priority.level,
    priority.reason,
    dueDatePosture,
    sourceEventFingerprint,
    evidenceCodes.join(','),
    consentPosture,
    expirationPosture,
    generatedAt,
  ].join('|'));

  return {
    classification: 'VALID_TASK_INTENT',
    reasons: [],
    intent: {
      schemaVersion: TASK_INTENT_SCHEMA_VERSION,
      classification: 'VALID_TASK_INTENT',
      intentType,
      sourceCapability,
      subject,
      property,
      ownerPosture,
      priority,
      dueDatePosture,
      sourceEventFingerprint,
      evidenceCodes,
      lifecycleClass: 'HUMAN_REVIEW_ONLY',
      communicationAuthority: 'CUSTOMER_COMMUNICATION_NOT_AUTHORIZED',
      consentPosture,
      expirationPosture,
      generatedAt,
      dedupeKey,
      auditFingerprint,
    },
  };
}
