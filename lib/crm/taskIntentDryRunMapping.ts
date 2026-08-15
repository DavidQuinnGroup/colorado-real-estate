import {
  TASK_INTENT_SCHEMA_VERSION,
  buildTaskIntent,
  type NormalizedTaskIntent,
  type TaskIntentFailureReason,
  type TaskIntentInput,
  type TaskIntentPriority,
} from './taskIntentGovernance';

export const TASK_INTENT_DRY_RUN_SOURCES = [
  'PROPERTY_INQUIRY',
  'SAVED_SEARCH_STRATEGY_INTAKE',
  'SELLER_VALUATION_INTAKE',
  'PRE_DISCOVERY_BRIEF',
  'INTERACTION_PROMOTION',
] as const;

export type TaskIntentDryRunSource = (typeof TASK_INTENT_DRY_RUN_SOURCES)[number];

export type TaskIntentDryRunFailureReason =
  | 'INVALID_SOURCE_EVIDENCE'
  | 'UNKNOWN_SOURCE'
  | 'UNSUPPORTED_SOURCE_EVIDENCE_FIELD';

export type TaskIntentHumanInputReason =
  | 'FREE_FORM_ONLY_CREATION_BASIS'
  | 'MISSING_DURABLE_SOURCE_EVENT'
  | 'MISSING_EXPLICIT_HUMAN_PRIORITY'
  | 'DORMANT_SOURCE_REQUIRES_PROVENANCE';

type TaskIntentDryRunPosture = {
  persistence: 'NOT_ATTEMPTED';
  communication: 'NOT_AUTHORIZED';
};

export type ReadyToProposeTaskResult = TaskIntentDryRunPosture & {
  classification: 'READY_TO_PROPOSE_TASK';
  intent: NormalizedTaskIntent;
  reasons: readonly [];
};

export type HumanInputRequiredResult = TaskIntentDryRunPosture & {
  classification: 'HUMAN_INPUT_REQUIRED';
  intent: null;
  reasons: readonly TaskIntentHumanInputReason[];
};

export type FailClosedResult = TaskIntentDryRunPosture & {
  classification: 'FAIL_CLOSED';
  intent: null;
  reasons: readonly (TaskIntentDryRunFailureReason | TaskIntentFailureReason)[];
};

export type TaskIntentDryRunResult = ReadyToProposeTaskResult | HumanInputRequiredResult | FailClosedResult;

export type PropertyInquiryDryRunEvidence = {
  source: 'PROPERTY_INQUIRY';
  subjectId: string;
  propertyId: string;
  sourceEventId: string;
  timeline: 'now' | 'tour' | 'ninety-days' | 'research' | 'unspecified';
  generatedAt: string;
};

export type SavedSearchStrategyDryRunEvidence = {
  source: 'SAVED_SEARCH_STRATEGY_INTAKE';
  subjectId: string;
  sourceEventId: string;
  intakeSource: 'search-map' | 'city-market-page' | 'property-detail' | 'grand-plan' | 'unknown';
  timeline: 'now' | 'ninety-days' | 'six-months' | 'research' | 'unspecified';
  creationBasis: 'STRUCTURED_SOURCE' | 'STRUCTURED_GOAL' | 'STRUCTURED_TIMELINE' | 'FREE_FORM_NOTES_ONLY';
  generatedAt: string;
};

export type SellerValuationDryRunEvidence = {
  source: 'SELLER_VALUATION_INTAKE';
  subjectId: string;
  sourceEventId: string;
  timeline: 'now' | 'ninety-days' | 'six-months' | 'research' | 'unspecified';
  generatedAt: string;
};

export type PreDiscoveryBriefDryRunEvidence = {
  source: 'PRE_DISCOVERY_BRIEF';
  subjectId: string;
  sourceEventId?: string;
  trigger: 'HEAT_SCORE' | 'GRAND_PLAN_COMPLETE' | 'MANUAL';
  humanPriority?: TaskIntentPriority;
  generatedAt: string;
};

export type InteractionPromotionDryRunEvidence = {
  source: 'INTERACTION_PROMOTION';
  subjectId: string;
  sourceEventId: string;
  promotionRequested: true;
  humanPriority?: TaskIntentPriority;
  generatedAt: string;
};

export type TaskIntentDryRunEvidence =
  | PropertyInquiryDryRunEvidence
  | SavedSearchStrategyDryRunEvidence
  | SellerValuationDryRunEvidence
  | PreDiscoveryBriefDryRunEvidence
  | InteractionPromotionDryRunEvidence;

type TaskIntentDraft = Pick<
  TaskIntentInput,
  'intentType' | 'sourceCapability' | 'subject' | 'property' | 'priority' | 'sourceEvent' | 'evidenceCodes' | 'generatedAt'
>;

const POSTURE: TaskIntentDryRunPosture = {
  persistence: 'NOT_ATTEMPTED',
  communication: 'NOT_AUTHORIZED',
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function hasOnlyEvidenceKeys(value: Record<string, unknown>, allowed: readonly string[]) {
  return Object.keys(value).every((key) => allowed.includes(key));
}

function stringEvidence(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function failClosed(...reasons: readonly (TaskIntentDryRunFailureReason | TaskIntentFailureReason)[]): FailClosedResult {
  return { classification: 'FAIL_CLOSED', intent: null, reasons: [...new Set(reasons)].sort(), ...POSTURE };
}

function humanInputRequired(...reasons: readonly TaskIntentHumanInputReason[]): HumanInputRequiredResult {
  return { classification: 'HUMAN_INPUT_REQUIRED', intent: null, reasons: [...new Set(reasons)].sort(), ...POSTURE };
}

function priority(level: TaskIntentPriority): TaskIntentInput['priority'] {
  if (level === 'high') return { level, reason: 'TIME_SENSITIVE_HUMAN_REVIEW' };
  if (level === 'medium') return { level, reason: 'STANDARD_HUMAN_REVIEW' };
  return { level, reason: 'ROUTINE_HUMAN_REVIEW' };
}

function proposeTask(draft: TaskIntentDraft): TaskIntentDryRunResult {
  const result = buildTaskIntent({
    schemaVersion: TASK_INTENT_SCHEMA_VERSION,
    ...draft,
    ownerPosture: { state: 'HUMAN_OWNER_REQUIRED' },
    dueDatePosture: 'HUMAN_DUE_DATE_ASSIGNMENT_REQUIRED',
    lifecycleClass: 'HUMAN_REVIEW_ONLY',
    communicationAuthority: 'CUSTOMER_COMMUNICATION_NOT_AUTHORIZED',
    consentPosture: 'NOT_APPLICABLE_TO_TASK_ONLY',
    expirationPosture: 'NO_EXPIRATION',
  });

  if (result.classification === 'FAIL_CLOSED') return failClosed(...result.reasons);

  return { classification: 'READY_TO_PROPOSE_TASK', intent: result.intent, reasons: [], ...POSTURE };
}

function validPropertyTimeline(value: unknown): value is PropertyInquiryDryRunEvidence['timeline'] {
  return value === 'now' || value === 'tour' || value === 'ninety-days' || value === 'research' || value === 'unspecified';
}

function validSavedSearchTimeline(value: unknown): value is SavedSearchStrategyDryRunEvidence['timeline'] {
  return value === 'now' || value === 'ninety-days' || value === 'six-months' || value === 'research' || value === 'unspecified';
}

function validIntakeSource(value: unknown): value is SavedSearchStrategyDryRunEvidence['intakeSource'] {
  return value === 'search-map' || value === 'city-market-page' || value === 'property-detail' || value === 'grand-plan' || value === 'unknown';
}

function validCreationBasis(value: unknown): value is SavedSearchStrategyDryRunEvidence['creationBasis'] {
  return value === 'STRUCTURED_SOURCE' || value === 'STRUCTURED_GOAL' || value === 'STRUCTURED_TIMELINE' || value === 'FREE_FORM_NOTES_ONLY';
}

function validPreDiscoveryTrigger(value: unknown): value is PreDiscoveryBriefDryRunEvidence['trigger'] {
  return value === 'HEAT_SCORE' || value === 'GRAND_PLAN_COMPLETE' || value === 'MANUAL';
}

function validPriority(value: unknown): value is TaskIntentPriority {
  return value === 'high' || value === 'medium' || value === 'low';
}

export function mapPropertyInquiryEvidence(evidence: unknown): TaskIntentDryRunResult {
  if (!isRecord(evidence)) return failClosed('INVALID_SOURCE_EVIDENCE');
  if (!hasOnlyEvidenceKeys(evidence, ['source', 'subjectId', 'propertyId', 'sourceEventId', 'timeline', 'generatedAt'])) {
    return failClosed('UNSUPPORTED_SOURCE_EVIDENCE_FIELD');
  }
  if (evidence.source !== 'PROPERTY_INQUIRY' || !validPropertyTimeline(evidence.timeline)) return failClosed('INVALID_SOURCE_EVIDENCE');

  const level = evidence.timeline === 'now' || evidence.timeline === 'tour' ? 'high' : evidence.timeline === 'ninety-days' ? 'medium' : 'low';
  return proposeTask({
    intentType: 'PROPERTY_INQUIRY_REVIEW',
    sourceCapability: 'PROPERTY_INQUIRY_SUBMISSION',
    subject: { kind: 'INTERNAL_SUBJECT_ID', id: stringEvidence(evidence.subjectId) },
    property: { kind: 'INTERNAL_PROPERTY_ID', id: stringEvidence(evidence.propertyId) },
    priority: priority(level),
    sourceEvent: { kind: 'INTERNAL_SOURCE_EVENT_ID', id: stringEvidence(evidence.sourceEventId) },
    evidenceCodes: ['PROPERTY_INQUIRY_RECEIVED'],
    generatedAt: stringEvidence(evidence.generatedAt),
  });
}

export function mapSavedSearchStrategyEvidence(evidence: unknown): TaskIntentDryRunResult {
  if (!isRecord(evidence)) return failClosed('INVALID_SOURCE_EVIDENCE');
  if (!hasOnlyEvidenceKeys(evidence, ['source', 'subjectId', 'sourceEventId', 'intakeSource', 'timeline', 'creationBasis', 'generatedAt'])) {
    return failClosed('UNSUPPORTED_SOURCE_EVIDENCE_FIELD');
  }
  if (evidence.source !== 'SAVED_SEARCH_STRATEGY_INTAKE' || !validIntakeSource(evidence.intakeSource) || !validSavedSearchTimeline(evidence.timeline) || !validCreationBasis(evidence.creationBasis)) {
    return failClosed('INVALID_SOURCE_EVIDENCE');
  }
  if (evidence.creationBasis === 'FREE_FORM_NOTES_ONLY') return humanInputRequired('FREE_FORM_ONLY_CREATION_BASIS');

  const level = evidence.timeline === 'now' ? 'high' : evidence.timeline === 'ninety-days' || evidence.intakeSource === 'search-map' ? 'medium' : 'low';
  return proposeTask({
    intentType: 'SAVED_SEARCH_STRATEGY_REVIEW',
    sourceCapability: 'SAVED_SEARCH_SUBMISSION',
    subject: { kind: 'INTERNAL_SUBJECT_ID', id: stringEvidence(evidence.subjectId) },
    property: null,
    priority: priority(level),
    sourceEvent: { kind: 'INTERNAL_SOURCE_EVENT_ID', id: stringEvidence(evidence.sourceEventId) },
    evidenceCodes: ['SAVED_SEARCH_SUBMITTED'],
    generatedAt: stringEvidence(evidence.generatedAt),
  });
}

export function mapSellerValuationEvidence(evidence: unknown): TaskIntentDryRunResult {
  if (!isRecord(evidence)) return failClosed('INVALID_SOURCE_EVIDENCE');
  if (!hasOnlyEvidenceKeys(evidence, ['source', 'subjectId', 'sourceEventId', 'timeline', 'generatedAt'])) {
    return failClosed('UNSUPPORTED_SOURCE_EVIDENCE_FIELD');
  }
  if (evidence.source !== 'SELLER_VALUATION_INTAKE' || !validSavedSearchTimeline(evidence.timeline)) return failClosed('INVALID_SOURCE_EVIDENCE');

  const level = evidence.timeline === 'now' ? 'high' : evidence.timeline === 'ninety-days' ? 'medium' : 'low';
  return proposeTask({
    intentType: 'SELLER_VALUATION_INTAKE_REVIEW',
    sourceCapability: 'SELLER_VALUATION_SUBMISSION',
    subject: { kind: 'INTERNAL_SUBJECT_ID', id: stringEvidence(evidence.subjectId) },
    property: null,
    priority: priority(level),
    sourceEvent: { kind: 'INTERNAL_SOURCE_EVENT_ID', id: stringEvidence(evidence.sourceEventId) },
    evidenceCodes: ['SELLER_VALUATION_REQUEST_RECEIVED'],
    generatedAt: stringEvidence(evidence.generatedAt),
  });
}

export function mapPreDiscoveryBriefEvidence(evidence: unknown): TaskIntentDryRunResult {
  if (!isRecord(evidence)) return failClosed('INVALID_SOURCE_EVIDENCE');
  if (!hasOnlyEvidenceKeys(evidence, ['source', 'subjectId', 'sourceEventId', 'trigger', 'humanPriority', 'generatedAt'])) {
    return failClosed('UNSUPPORTED_SOURCE_EVIDENCE_FIELD');
  }
  if (evidence.source !== 'PRE_DISCOVERY_BRIEF' || !validPreDiscoveryTrigger(evidence.trigger)) return failClosed('INVALID_SOURCE_EVIDENCE');
  if (typeof evidence.sourceEventId !== 'string' || !evidence.sourceEventId.trim()) {
    return humanInputRequired('DORMANT_SOURCE_REQUIRES_PROVENANCE', 'MISSING_DURABLE_SOURCE_EVENT');
  }
  if (!validPriority(evidence.humanPriority)) return humanInputRequired('MISSING_EXPLICIT_HUMAN_PRIORITY');

  return proposeTask({
    intentType: 'PRE_DISCOVERY_BRIEF_REVIEW',
    sourceCapability: 'PRE_DISCOVERY_SIGNAL',
    subject: { kind: 'INTERNAL_SUBJECT_ID', id: stringEvidence(evidence.subjectId) },
    property: null,
    priority: priority(evidence.humanPriority),
    sourceEvent: { kind: 'INTERNAL_SOURCE_EVENT_ID', id: evidence.sourceEventId },
    evidenceCodes: ['PRE_DISCOVERY_SIGNAL_RECORDED'],
    generatedAt: stringEvidence(evidence.generatedAt),
  });
}

export function mapInteractionPromotionEvidence(evidence: unknown): TaskIntentDryRunResult {
  if (!isRecord(evidence)) return failClosed('INVALID_SOURCE_EVIDENCE');
  if (!hasOnlyEvidenceKeys(evidence, ['source', 'subjectId', 'sourceEventId', 'promotionRequested', 'humanPriority', 'generatedAt'])) {
    return failClosed('UNSUPPORTED_SOURCE_EVIDENCE_FIELD');
  }
  if (evidence.source !== 'INTERACTION_PROMOTION' || evidence.promotionRequested !== true) return failClosed('INVALID_SOURCE_EVIDENCE');
  if (!validPriority(evidence.humanPriority)) return humanInputRequired('MISSING_EXPLICIT_HUMAN_PRIORITY');

  return proposeTask({
    intentType: 'INTERACTION_PROMOTION_REVIEW',
    sourceCapability: 'INTERACTION_PROMOTION',
    subject: { kind: 'INTERNAL_SUBJECT_ID', id: stringEvidence(evidence.subjectId) },
    property: null,
    priority: priority(evidence.humanPriority),
    sourceEvent: { kind: 'INTERNAL_SOURCE_EVENT_ID', id: stringEvidence(evidence.sourceEventId) },
    evidenceCodes: ['INTERACTION_PROMOTION_REQUESTED'],
    generatedAt: stringEvidence(evidence.generatedAt),
  });
}

export function buildTaskIntentDryRun(evidence: unknown): TaskIntentDryRunResult {
  if (!isRecord(evidence) || typeof evidence.source !== 'string') return failClosed('INVALID_SOURCE_EVIDENCE');

  switch (evidence.source) {
    case 'PROPERTY_INQUIRY':
      return mapPropertyInquiryEvidence(evidence);
    case 'SAVED_SEARCH_STRATEGY_INTAKE':
      return mapSavedSearchStrategyEvidence(evidence);
    case 'SELLER_VALUATION_INTAKE':
      return mapSellerValuationEvidence(evidence);
    case 'PRE_DISCOVERY_BRIEF':
      return mapPreDiscoveryBriefEvidence(evidence);
    case 'INTERACTION_PROMOTION':
      return mapInteractionPromotionEvidence(evidence);
    default:
      return failClosed('UNKNOWN_SOURCE');
  }
}
