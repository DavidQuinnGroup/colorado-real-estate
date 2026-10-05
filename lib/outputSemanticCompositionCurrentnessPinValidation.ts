export type CurrentnessPolicyPinValidationInput = Readonly<{
  snapshotId: string;
  policyVersionId: string;
  roleRef: string;
  ordinal: number;
  provenance: Readonly<Record<string, unknown>>;
  integrityFingerprint: string;
}>;

export type CurrentnessProjectionPinValidationInput = Readonly<{
  snapshotId: string;
  projectionVersionId: string;
  roleRef: string;
  ordinal: number;
  provenance: Readonly<Record<string, unknown>>;
  integrityFingerprint: string;
}>;

export type CurrentnessProjectionPolicyIdentity = Readonly<{
  projectionVersionId: string;
  policyVersionId: string;
}>;

export type CurrentnessPinValidationFailure =
  | 'SNAPSHOT_ID_REQUIRED'
  | 'POLICY_VERSION_ID_REQUIRED'
  | 'PROJECTION_VERSION_ID_REQUIRED'
  | 'ROLE_REQUIRED'
  | 'ORDINAL_INVALID'
  | 'PROVENANCE_REQUIRED'
  | 'INTEGRITY_FINGERPRINT_REQUIRED'
  | 'DUPLICATE_POLICY_EXACT_ROLE'
  | 'DUPLICATE_POLICY_SLOT'
  | 'DUPLICATE_PROJECTION_EXACT_ROLE'
  | 'DUPLICATE_PROJECTION_SLOT'
  | 'PROJECTION_POLICY_CONTEXT_REQUIRED'
  | 'ALIGNED_POLICY_MISMATCH';

export type CurrentnessPinValidationResult = Readonly<{
  valid: boolean;
  failure: CurrentnessPinValidationFailure | null;
}>;

function exactIdentifier(value: string): boolean {
  const trimmed = value.trim();
  const normalized = trimmed.toLowerCase();
  return value === trimmed && trimmed.length > 0 && normalized !== 'latest' && normalized !== 'current';
}

function validProvenance(value: Readonly<Record<string, unknown>>): boolean {
  return value !== null && !Array.isArray(value) && Object.keys(value).length > 0;
}

function validateSharedPin(input: Readonly<{
  snapshotId: string;
  roleRef: string;
  ordinal: number;
  provenance: Readonly<Record<string, unknown>>;
  integrityFingerprint: string;
}>): CurrentnessPinValidationResult {
  if (!exactIdentifier(input.snapshotId)) {
    return Object.freeze({ valid: false, failure: 'SNAPSHOT_ID_REQUIRED' });
  }
  if (!exactIdentifier(input.roleRef)) {
    return Object.freeze({ valid: false, failure: 'ROLE_REQUIRED' });
  }
  if (!Number.isInteger(input.ordinal) || input.ordinal < 0) {
    return Object.freeze({ valid: false, failure: 'ORDINAL_INVALID' });
  }
  if (!validProvenance(input.provenance)) {
    return Object.freeze({ valid: false, failure: 'PROVENANCE_REQUIRED' });
  }
  if (
    input.integrityFingerprint !== input.integrityFingerprint.trim()
    || input.integrityFingerprint.length === 0
  ) {
    return Object.freeze({ valid: false, failure: 'INTEGRITY_FINGERPRINT_REQUIRED' });
  }
  return Object.freeze({ valid: true, failure: null });
}

export function validateCurrentnessPolicyPin(
  input: CurrentnessPolicyPinValidationInput,
): CurrentnessPinValidationResult {
  const shared = validateSharedPin(input);
  if (!shared.valid) return shared;
  if (!exactIdentifier(input.policyVersionId)) {
    return Object.freeze({ valid: false, failure: 'POLICY_VERSION_ID_REQUIRED' });
  }
  return Object.freeze({ valid: true, failure: null });
}

export function validateCurrentnessProjectionPin(
  input: CurrentnessProjectionPinValidationInput,
): CurrentnessPinValidationResult {
  const shared = validateSharedPin(input);
  if (!shared.valid) return shared;
  if (!exactIdentifier(input.projectionVersionId)) {
    return Object.freeze({ valid: false, failure: 'PROJECTION_VERSION_ID_REQUIRED' });
  }
  return Object.freeze({ valid: true, failure: null });
}

export function validateCurrentnessPinConfiguration(
  policyPins: readonly CurrentnessPolicyPinValidationInput[],
  projectionPins: readonly CurrentnessProjectionPinValidationInput[],
  projectionPolicies: readonly CurrentnessProjectionPolicyIdentity[],
): CurrentnessPinValidationResult {
  const policyExactRoles = new Set<string>();
  const policySlots = new Map<string, CurrentnessPolicyPinValidationInput>();
  for (const pin of policyPins) {
    const valid = validateCurrentnessPolicyPin(pin);
    if (!valid.valid) return valid;

    const exactRole = JSON.stringify([pin.snapshotId, pin.policyVersionId, pin.roleRef]);
    if (policyExactRoles.has(exactRole)) {
      return Object.freeze({ valid: false, failure: 'DUPLICATE_POLICY_EXACT_ROLE' });
    }
    policyExactRoles.add(exactRole);

    const slot = JSON.stringify([pin.snapshotId, pin.roleRef, pin.ordinal]);
    if (policySlots.has(slot)) {
      return Object.freeze({ valid: false, failure: 'DUPLICATE_POLICY_SLOT' });
    }
    policySlots.set(slot, pin);
  }

  const projectionExactRoles = new Set<string>();
  const projectionSlots = new Set<string>();
  const projectionPolicyByVersion = new Map<string, string>();
  for (const identity of projectionPolicies) {
    if (!exactIdentifier(identity.projectionVersionId) || !exactIdentifier(identity.policyVersionId)) {
      return Object.freeze({ valid: false, failure: 'PROJECTION_POLICY_CONTEXT_REQUIRED' });
    }
    const existing = projectionPolicyByVersion.get(identity.projectionVersionId);
    if (existing !== undefined && existing !== identity.policyVersionId) {
      return Object.freeze({ valid: false, failure: 'ALIGNED_POLICY_MISMATCH' });
    }
    projectionPolicyByVersion.set(identity.projectionVersionId, identity.policyVersionId);
  }

  for (const pin of projectionPins) {
    const valid = validateCurrentnessProjectionPin(pin);
    if (!valid.valid) return valid;

    const exactRole = JSON.stringify([pin.snapshotId, pin.projectionVersionId, pin.roleRef]);
    if (projectionExactRoles.has(exactRole)) {
      return Object.freeze({ valid: false, failure: 'DUPLICATE_PROJECTION_EXACT_ROLE' });
    }
    projectionExactRoles.add(exactRole);

    const slot = JSON.stringify([pin.snapshotId, pin.roleRef, pin.ordinal]);
    if (projectionSlots.has(slot)) {
      return Object.freeze({ valid: false, failure: 'DUPLICATE_PROJECTION_SLOT' });
    }
    projectionSlots.add(slot);

    const alignedPolicy = policySlots.get(slot);
    if (alignedPolicy !== undefined) {
      const projectionPolicyId = projectionPolicyByVersion.get(pin.projectionVersionId);
      if (projectionPolicyId === undefined) {
        return Object.freeze({ valid: false, failure: 'PROJECTION_POLICY_CONTEXT_REQUIRED' });
      }
      if (projectionPolicyId !== alignedPolicy.policyVersionId) {
        return Object.freeze({ valid: false, failure: 'ALIGNED_POLICY_MISMATCH' });
      }
    }
  }

  return Object.freeze({ valid: true, failure: null });
}
