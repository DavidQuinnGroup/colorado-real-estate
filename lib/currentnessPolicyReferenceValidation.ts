export type CurrentnessPolicyReferenceValidationInput = Readonly<{
  policyKey: string;
  authorityRef: string;
  productDefinitionReferenceId: string | null;
}>;

export type CurrentnessPolicyVersionLineage = Readonly<{
  supersedesPolicyVersionId: string | null;
  correctionOfPolicyVersionId: string | null;
}>;

export type CurrentnessPolicyVersionValidationInput = Readonly<{
  policyVersionId: string;
  policyReferenceId: string;
  versionKey: string;
  lifecycleState: string;
  authorityRef: string;
  methodVersionId: string | null;
  formalizedAt: string | null;
  admittedAt: string | null;
  lineage: CurrentnessPolicyVersionLineage;
}>;

export type CurrentnessPolicyValidationFailure =
  | 'POLICY_KEY_REQUIRED'
  | 'AUTHORITY_REFERENCE_REQUIRED'
  | 'PRODUCT_DEFINITION_REFERENCE_INVALID'
  | 'POLICY_VERSION_ID_REQUIRED'
  | 'POLICY_REFERENCE_ID_REQUIRED'
  | 'VERSION_KEY_REQUIRED'
  | 'METHOD_VERSION_REFERENCE_INVALID'
  | 'ADMITTED_VERSION_REQUIRES_FORMALIZATION'
  | 'ADMITTED_VERSION_REQUIRES_ADMISSION'
  | 'LINEAGE_REFERENCE_INVALID'
  | 'LINEAGE_SELF_REFERENCE'
  | 'LINEAGE_ROLE_CONFLICT';

export type CurrentnessPolicyValidationResult = Readonly<{
  valid: boolean;
  failure: CurrentnessPolicyValidationFailure | null;
}>;

export type CurrentnessPolicyVersionLineageRecord = Readonly<{
  id: string;
  supersedesPolicyVersionId: string | null;
  correctionOfPolicyVersionId: string | null;
}>;

const ADMITTED_LIFECYCLE_STATES = new Set([
  'ADMITTED',
  'ADMITTED_WITH_QUALIFICATIONS',
]);

function exactIdentifier(value: string): boolean {
  const trimmed = value.trim();
  const normalized = trimmed.toLowerCase();
  return value === trimmed && trimmed.length > 0 && normalized !== 'latest' && normalized !== 'current';
}

export function validateCurrentnessPolicyReference(
  input: CurrentnessPolicyReferenceValidationInput,
): CurrentnessPolicyValidationResult {
  if (!exactIdentifier(input.policyKey)) {
    return Object.freeze({ valid: false, failure: 'POLICY_KEY_REQUIRED' });
  }
  if (!exactIdentifier(input.authorityRef)) {
    return Object.freeze({ valid: false, failure: 'AUTHORITY_REFERENCE_REQUIRED' });
  }
  if (
    input.productDefinitionReferenceId !== null
    && !exactIdentifier(input.productDefinitionReferenceId)
  ) {
    return Object.freeze({ valid: false, failure: 'PRODUCT_DEFINITION_REFERENCE_INVALID' });
  }
  return Object.freeze({ valid: true, failure: null });
}

export function validateCurrentnessPolicyVersion(
  input: CurrentnessPolicyVersionValidationInput,
): CurrentnessPolicyValidationResult {
  if (!exactIdentifier(input.policyVersionId)) {
    return Object.freeze({ valid: false, failure: 'POLICY_VERSION_ID_REQUIRED' });
  }
  if (!exactIdentifier(input.policyReferenceId)) {
    return Object.freeze({ valid: false, failure: 'POLICY_REFERENCE_ID_REQUIRED' });
  }
  if (!exactIdentifier(input.versionKey)) {
    return Object.freeze({ valid: false, failure: 'VERSION_KEY_REQUIRED' });
  }
  if (!exactIdentifier(input.authorityRef)) {
    return Object.freeze({ valid: false, failure: 'AUTHORITY_REFERENCE_REQUIRED' });
  }
  if (input.methodVersionId !== null && !exactIdentifier(input.methodVersionId)) {
    return Object.freeze({ valid: false, failure: 'METHOD_VERSION_REFERENCE_INVALID' });
  }
  if (ADMITTED_LIFECYCLE_STATES.has(input.lifecycleState) && input.formalizedAt === null) {
    return Object.freeze({ valid: false, failure: 'ADMITTED_VERSION_REQUIRES_FORMALIZATION' });
  }
  if (ADMITTED_LIFECYCLE_STATES.has(input.lifecycleState) && input.admittedAt === null) {
    return Object.freeze({ valid: false, failure: 'ADMITTED_VERSION_REQUIRES_ADMISSION' });
  }

  const lineageIds = [
    input.lineage.supersedesPolicyVersionId,
    input.lineage.correctionOfPolicyVersionId,
  ].filter((value): value is string => value !== null);
  if (lineageIds.some((value) => !exactIdentifier(value))) {
    return Object.freeze({ valid: false, failure: 'LINEAGE_REFERENCE_INVALID' });
  }
  if (lineageIds.includes(input.policyVersionId)) {
    return Object.freeze({ valid: false, failure: 'LINEAGE_SELF_REFERENCE' });
  }
  if (
    input.lineage.supersedesPolicyVersionId !== null
    && input.lineage.correctionOfPolicyVersionId !== null
  ) {
    return Object.freeze({ valid: false, failure: 'LINEAGE_ROLE_CONFLICT' });
  }

  return Object.freeze({ valid: true, failure: null });
}

export function hasCurrentnessPolicyVersionLineageCycle(
  records: readonly CurrentnessPolicyVersionLineageRecord[],
): boolean {
  const byId = new Map(records.map((record) => [record.id, record]));
  const visiting = new Set<string>();
  const visited = new Set<string>();

  const visit = (id: string): boolean => {
    if (visiting.has(id)) return true;
    if (visited.has(id)) return false;
    const record = byId.get(id);
    if (!record) return false;

    visiting.add(id);
    const nextIds = [record.supersedesPolicyVersionId, record.correctionOfPolicyVersionId]
      .filter((value): value is string => value !== null);
    if (nextIds.some(visit)) return true;
    visiting.delete(id);
    visited.add(id);
    return false;
  };

  return records.some((record) => visit(record.id));
}
