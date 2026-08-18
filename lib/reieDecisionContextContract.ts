import {
  REIE_DECISION_EVIDENCE_CLASSIFICATIONS,
  type ReieDecisionEvidenceItem,
  validateReieDecisionEvidenceItem,
} from './reieDecisionEvidenceClassification';
import {
  type ReieProfessionalHandoffRequest,
  validateReieProfessionalHandoffRequest,
} from './reieProfessionalHandoffTaxonomy';

export const REIE_DECISION_CONTEXT_SCHEMA_VERSION = 'REIE_DECISION_CONTEXT_V1' as const;
export const REIE_DECISION_CONTEXT_MODE = 'EXPLICIT_CONTEXT_ONLY' as const;

export const REIE_DECISION_CONTEXT_DOMAINS = [
  'BUYER',
  'SELLER',
  'PROPERTY',
  'MARKET',
  'FINANCING',
  'TIMING',
  'MOVING_TRANSITION',
  'PROFESSIONAL_VERIFICATION',
] as const;

export type ReieDecisionContextDomain = (typeof REIE_DECISION_CONTEXT_DOMAINS)[number];
export type ReieDecisionContextRole = 'CUSTOMER' | 'AGENT' | 'ADMIN' | 'PROFESSIONAL_REVIEW';

export type ReieDecisionContextItem = Readonly<{
  id: string;
  domain: ReieDecisionContextDomain;
  evidence: ReieDecisionEvidenceItem;
}>;

export type ReieDecisionContext = Readonly<{
  schemaVersion: typeof REIE_DECISION_CONTEXT_SCHEMA_VERSION;
  mode: typeof REIE_DECISION_CONTEXT_MODE;
  role: ReieDecisionContextRole;
  selectedGoals: readonly ReieDecisionContextItem[];
  items: readonly ReieDecisionContextItem[];
  professionalHandoffs: readonly ReieProfessionalHandoffRequest[];
  sourcePosture: Readonly<{
    state: 'EXPLICIT_SOURCE_STATE' | 'UNVERIFIED' | 'NOT_AVAILABLE';
    rights: 'EXPLICIT_REVIEWED' | 'UNKNOWN_OR_UNRESOLVED' | 'NOT_APPLICABLE';
    freshness: 'CURRENT' | 'DATED' | 'UNKNOWN' | 'NOT_APPLICABLE';
  }>;
  persistencePosture: 'NOT_PERSISTED';
  hiddenTransferPosture: 'PROHIBITED';
  prohibitedOutputs: readonly string[];
}>;

export type ReieDecisionContextValidation = Readonly<{
  classification: 'VALID_EXPLICIT_CONTEXT' | 'FAIL_CLOSED';
  context: ReieDecisionContext | null;
  reasons: readonly string[];
}>;

export type ReieDecisionContextInput = Omit<ReieDecisionContext, 'schemaVersion' | 'mode'>;

function validateContextItem(item: ReieDecisionContextItem, seen: Set<string>, label: string) {
  const reasons = [...validateReieDecisionEvidenceItem(item.evidence)];
  if (!item.id.trim()) reasons.push(`${label}_ID_REQUIRED`);
  if (seen.has(item.id)) reasons.push('DUPLICATE_CONTEXT_ITEM_ID');
  seen.add(item.id);
  if (!REIE_DECISION_CONTEXT_DOMAINS.includes(item.domain)) reasons.push('CONTEXT_DOMAIN_INVALID');
  if (!REIE_DECISION_EVIDENCE_CLASSIFICATIONS.includes(item.evidence.classification)) reasons.push('CONTEXT_EVIDENCE_CLASSIFICATION_INVALID');
  return reasons;
}

export function validateReieDecisionContext(input: ReieDecisionContextInput): ReieDecisionContextValidation {
  const reasons: string[] = [];
  const seen = new Set<string>();
  input.selectedGoals.forEach((item) => reasons.push(...validateContextItem(item, seen, 'SELECTED_GOAL')));
  input.items.forEach((item) => reasons.push(...validateContextItem(item, seen, 'CONTEXT_ITEM')));
  input.professionalHandoffs.forEach((handoff) => reasons.push(...validateReieProfessionalHandoffRequest(handoff)));
  if (input.persistencePosture !== 'NOT_PERSISTED') reasons.push('PERSISTENCE_MUST_REMAIN_NOT_PERSISTED');
  if (input.hiddenTransferPosture !== 'PROHIBITED') reasons.push('HIDDEN_TRANSFER_MUST_REMAIN_PROHIBITED');
  if (input.prohibitedOutputs.length === 0) reasons.push('PROHIBITED_OUTPUTS_MUST_BE_DECLARED');
  if (input.sourcePosture.rights === 'EXPLICIT_REVIEWED' && input.sourcePosture.state !== 'EXPLICIT_SOURCE_STATE') reasons.push('REVIEWED_RIGHTS_REQUIRE_EXPLICIT_SOURCE_STATE');
  if (reasons.length > 0) return { classification: 'FAIL_CLOSED', context: null, reasons: Object.freeze([...new Set(reasons)].sort()) };
  return {
    classification: 'VALID_EXPLICIT_CONTEXT',
    context: Object.freeze({ schemaVersion: REIE_DECISION_CONTEXT_SCHEMA_VERSION, mode: REIE_DECISION_CONTEXT_MODE, ...input }),
    reasons: Object.freeze([]),
  };
}
