export const REIE_DECISION_EVIDENCE_CLASSIFICATIONS = [
  'FACT',
  'USER_ASSUMPTION',
  'DERIVED_ILLUSTRATION',
  'UNVERIFIED_INPUT',
  'PROFESSIONAL_VERIFICATION_REQUIRED',
  'NOT_AVAILABLE',
  'PROHIBITED_OUTPUT',
] as const;

export type ReieDecisionEvidenceClassification = (typeof REIE_DECISION_EVIDENCE_CLASSIFICATIONS)[number];
export type ReieDecisionEvidenceValue = string | number | boolean | null;

export type ReieDecisionEvidenceProvenance = Readonly<{
  origin: 'EXPLICIT_CUSTOMER_INPUT' | 'GOVERNED_SOURCE_FACT' | 'VISIBLE_ASSUMPTION_ILLUSTRATION' | 'EXPLICIT_PROFESSIONAL_OR_ADMIN_CONTEXT' | 'NONE';
  reference: string | null;
  sourceId: string | null;
  freshness: 'CURRENT' | 'DATED' | 'UNKNOWN' | 'NOT_APPLICABLE';
  rights: 'REVIEWED' | 'UNKNOWN_OR_UNRESOLVED' | 'NOT_APPLICABLE';
}>;

export type ReieDecisionEvidenceItem = Readonly<{
  id: string;
  label: string;
  value: ReieDecisionEvidenceValue;
  classification: ReieDecisionEvidenceClassification;
  provenance: ReieDecisionEvidenceProvenance;
  visibility: 'PUBLIC' | 'GUIDED' | 'PRIVATE_CLIENT' | 'AGENT_ONLY' | 'ADMIN_ONLY' | 'NOT_AUTHORIZED' | 'NOT_READY' | 'DATA_INSUFFICIENT' | 'COMPLIANCE_BLOCKED';
  verification: 'NOT_REQUIRED' | 'REQUIRED' | 'PENDING' | 'COMPLETE';
  prohibitedUse: readonly string[];
}>;

export type ReieDecisionEvidenceTransition = Readonly<{
  from: ReieDecisionEvidenceClassification;
  to: ReieDecisionEvidenceClassification;
  authorization: 'EXPLICIT_GOVERNED_INPUT' | 'SYSTEM_DERIVATION_FROM_VISIBLE_ASSUMPTIONS' | 'PROFESSIONAL_CONFIRMATION';
}>;

export function validateReieDecisionEvidenceItem(item: ReieDecisionEvidenceItem): readonly string[] {
  const reasons: string[] = [];
  if (!item.id.trim()) reasons.push('EVIDENCE_ID_REQUIRED');
  if (!item.label.trim()) reasons.push('EVIDENCE_LABEL_REQUIRED');
  if (!REIE_DECISION_EVIDENCE_CLASSIFICATIONS.includes(item.classification)) reasons.push('EVIDENCE_CLASSIFICATION_INVALID');
  if (item.classification === 'NOT_AVAILABLE' && item.value !== null) reasons.push('NOT_AVAILABLE_MUST_HAVE_NULL_VALUE');
  if (item.classification === 'PROHIBITED_OUTPUT' && item.value !== null) reasons.push('PROHIBITED_OUTPUT_MUST_HAVE_NULL_VALUE');
  if (item.classification === 'PROHIBITED_OUTPUT' && item.visibility !== 'COMPLIANCE_BLOCKED') reasons.push('PROHIBITED_OUTPUT_MUST_BE_COMPLIANCE_BLOCKED');
  if (item.classification === 'FACT' && item.provenance.origin !== 'GOVERNED_SOURCE_FACT' && item.provenance.origin !== 'EXPLICIT_PROFESSIONAL_OR_ADMIN_CONTEXT') reasons.push('FACT_REQUIRES_GOVERNED_OR_EXPLICIT_PROVENANCE');
  if (item.classification === 'USER_ASSUMPTION' && item.provenance.origin !== 'EXPLICIT_CUSTOMER_INPUT') reasons.push('USER_ASSUMPTION_REQUIRES_EXPLICIT_INPUT');
  if (item.classification === 'DERIVED_ILLUSTRATION' && item.provenance.origin !== 'VISIBLE_ASSUMPTION_ILLUSTRATION') reasons.push('DERIVED_ILLUSTRATION_REQUIRES_VISIBLE_ASSUMPTION_PROVENANCE');
  if (item.classification === 'PROFESSIONAL_VERIFICATION_REQUIRED' && item.verification !== 'REQUIRED' && item.verification !== 'PENDING') reasons.push('PROFESSIONAL_VERIFICATION_STATE_REQUIRED');
  if (item.classification === 'NOT_AVAILABLE' && item.visibility !== 'DATA_INSUFFICIENT' && item.visibility !== 'NOT_READY') reasons.push('NOT_AVAILABLE_REQUIRES_DATA_INSUFFICIENT_OR_NOT_READY');
  return Object.freeze([...new Set(reasons)]);
}

export function validateReieDecisionEvidenceTransition(transition: ReieDecisionEvidenceTransition): readonly string[] {
  if (transition.from === transition.to) return Object.freeze([]);
  if (transition.to === 'FACT' && transition.authorization !== 'EXPLICIT_GOVERNED_INPUT' && transition.authorization !== 'PROFESSIONAL_CONFIRMATION') return Object.freeze(['FACT_PROMOTION_REQUIRES_EXPLICIT_AUTHORITY']);
  if (transition.to === 'DERIVED_ILLUSTRATION' && transition.authorization !== 'SYSTEM_DERIVATION_FROM_VISIBLE_ASSUMPTIONS') return Object.freeze(['DERIVED_PROMOTION_REQUIRES_VISIBLE_ASSUMPTIONS']);
  if (transition.to === 'PROHIBITED_OUTPUT') return Object.freeze([]);
  if (transition.to === 'USER_ASSUMPTION' && transition.authorization !== 'EXPLICIT_GOVERNED_INPUT') return Object.freeze(['USER_ASSUMPTION_REQUIRES_EXPLICIT_INPUT']);
  return Object.freeze([]);
}
