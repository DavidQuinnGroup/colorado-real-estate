export type QualificationVersionLinkValidationInput = Readonly<{
  ownerId: string;
  qualificationApplicationVersionId: string;
  roleRef: string;
  ordinal: number;
  provenance: Readonly<Record<string, unknown>>;
}>;

export type QualificationVersionLinkValidationFailure =
  | 'OWNER_ID_REQUIRED'
  | 'APPLICATION_VERSION_REQUIRED'
  | 'ROLE_REQUIRED'
  | 'ORDINAL_INVALID'
  | 'PROVENANCE_REQUIRED';

export type QualificationVersionLinkValidationResult = Readonly<{
  valid: boolean;
  failure: QualificationVersionLinkValidationFailure | null;
}>;

export type QualificationVersionLinkIdentity = Readonly<{
  ownerId: string;
  qualificationApplicationVersionId: string;
  roleRef: string;
  ordinal: number;
}>;

function exactReference(value: string): boolean {
  const trimmed = value.trim();
  const normalized = trimmed.toLowerCase();
  return value === trimmed && trimmed.length > 0 && normalized !== 'latest' && normalized !== 'current';
}

export function validateQualificationVersionLink(
  input: QualificationVersionLinkValidationInput,
): QualificationVersionLinkValidationResult {
  if (!exactReference(input.ownerId)) {
    return Object.freeze({ valid: false, failure: 'OWNER_ID_REQUIRED' });
  }
  if (!exactReference(input.qualificationApplicationVersionId)) {
    return Object.freeze({ valid: false, failure: 'APPLICATION_VERSION_REQUIRED' });
  }
  if (!exactReference(input.roleRef)) {
    return Object.freeze({ valid: false, failure: 'ROLE_REQUIRED' });
  }
  if (!Number.isInteger(input.ordinal) || input.ordinal < 0) {
    return Object.freeze({ valid: false, failure: 'ORDINAL_INVALID' });
  }
  if (input.provenance === null || Array.isArray(input.provenance) || Object.keys(input.provenance).length === 0) {
    return Object.freeze({ valid: false, failure: 'PROVENANCE_REQUIRED' });
  }
  return Object.freeze({ valid: true, failure: null });
}

export function hasDuplicateQualificationVersionLink(
  links: readonly QualificationVersionLinkIdentity[],
): boolean {
  const exactRoles = new Set<string>();
  const roleOrdinals = new Set<string>();
  for (const link of links) {
    const exactRole = JSON.stringify([
      link.ownerId,
      link.qualificationApplicationVersionId,
      link.roleRef,
    ]);
    const roleOrdinal = JSON.stringify([link.ownerId, link.roleRef, link.ordinal]);
    if (exactRoles.has(exactRole) || roleOrdinals.has(roleOrdinal)) return true;
    exactRoles.add(exactRole);
    roleOrdinals.add(roleOrdinal);
  }
  return false;
}
