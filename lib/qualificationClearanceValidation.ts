export type QualificationClearanceValidationInput = Readonly<{
  qualificationApplicationVersionId: string;
  replacementApplicationVersionId: string | null;
  actorRef: string;
  authorityRef: string;
  reasonRef: string;
  clearedAt: string;
  effectiveAt: string;
  provenance: Readonly<Record<string, unknown>>;
}>;

export type QualificationClearanceValidationFailure =
  | 'APPLICATION_VERSION_REQUIRED'
  | 'REPLACEMENT_VERSION_INVALID'
  | 'SELF_REPLACEMENT_FORBIDDEN'
  | 'ACTOR_REFERENCE_REQUIRED'
  | 'AUTHORITY_REFERENCE_REQUIRED'
  | 'REASON_REFERENCE_REQUIRED'
  | 'CLEARED_AT_REQUIRED'
  | 'EFFECTIVE_AT_REQUIRED'
  | 'PROVENANCE_REQUIRED';

export type QualificationClearanceValidationResult = Readonly<{
  valid: boolean;
  failure: QualificationClearanceValidationFailure | null;
}>;

export type QualificationReplacementEdge = Readonly<{
  qualificationApplicationVersionId: string;
  replacementApplicationVersionId: string;
}>;

function exactReference(value: string): boolean {
  const trimmed = value.trim();
  const normalized = trimmed.toLowerCase();
  return value === trimmed && trimmed.length > 0 && normalized !== 'latest' && normalized !== 'current';
}

function exactTimestamp(value: string): boolean {
  return value.trim() === value && value.length > 0 && !Number.isNaN(Date.parse(value));
}

export function validateQualificationClearance(
  input: QualificationClearanceValidationInput,
): QualificationClearanceValidationResult {
  if (!exactReference(input.qualificationApplicationVersionId)) {
    return Object.freeze({ valid: false, failure: 'APPLICATION_VERSION_REQUIRED' });
  }
  if (input.replacementApplicationVersionId !== null) {
    if (!exactReference(input.replacementApplicationVersionId)) {
      return Object.freeze({ valid: false, failure: 'REPLACEMENT_VERSION_INVALID' });
    }
    if (input.replacementApplicationVersionId === input.qualificationApplicationVersionId) {
      return Object.freeze({ valid: false, failure: 'SELF_REPLACEMENT_FORBIDDEN' });
    }
  }
  if (!exactReference(input.actorRef)) {
    return Object.freeze({ valid: false, failure: 'ACTOR_REFERENCE_REQUIRED' });
  }
  if (!exactReference(input.authorityRef)) {
    return Object.freeze({ valid: false, failure: 'AUTHORITY_REFERENCE_REQUIRED' });
  }
  if (!exactReference(input.reasonRef)) {
    return Object.freeze({ valid: false, failure: 'REASON_REFERENCE_REQUIRED' });
  }
  if (!exactTimestamp(input.clearedAt)) {
    return Object.freeze({ valid: false, failure: 'CLEARED_AT_REQUIRED' });
  }
  if (!exactTimestamp(input.effectiveAt)) {
    return Object.freeze({ valid: false, failure: 'EFFECTIVE_AT_REQUIRED' });
  }
  if (input.provenance === null || Array.isArray(input.provenance) || Object.keys(input.provenance).length === 0) {
    return Object.freeze({ valid: false, failure: 'PROVENANCE_REQUIRED' });
  }
  return Object.freeze({ valid: true, failure: null });
}

export function hasQualificationReplacementCycle(edges: readonly QualificationReplacementEdge[]): boolean {
  const replacements = new Map<string, string[]>();
  for (const edge of edges) {
    const targets = replacements.get(edge.qualificationApplicationVersionId) ?? [];
    targets.push(edge.replacementApplicationVersionId);
    replacements.set(edge.qualificationApplicationVersionId, targets);
  }

  const visiting = new Set<string>();
  const visited = new Set<string>();
  const visit = (id: string): boolean => {
    if (visiting.has(id)) return true;
    if (visited.has(id)) return false;
    visiting.add(id);
    for (const replacementId of replacements.get(id) ?? []) {
      if (visit(replacementId)) return true;
    }
    visiting.delete(id);
    visited.add(id);
    return false;
  };

  return [...replacements.keys()].some(visit);
}
