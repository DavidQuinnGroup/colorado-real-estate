export type ExactReferenceVersionPin = Readonly<{
  referenceVersionId: string;
  versionRef: string;
  formalizedAt: Date | string | null;
}>;

export type ExactReferenceVersionPinValidation =
  | Readonly<{ valid: true; exactReferenceVersion: ExactReferenceVersionPin }>
  | Readonly<{
      valid: false;
      reason: 'INVALID_EXACT_REFERENCE_VERSION' | 'LATEST_OR_CURRENT_VERSION_FORBIDDEN' | 'VERSION_NOT_FORMAL';
    }>;

const isExactIdentifier = (value: string): boolean => value.length > 0 && value.trim() === value;

export function validateExactReferenceVersionPin(
  referenceVersion: ExactReferenceVersionPin,
): ExactReferenceVersionPinValidation {
  if (
    !isExactIdentifier(referenceVersion.referenceVersionId) ||
    !isExactIdentifier(referenceVersion.versionRef)
  ) {
    return Object.freeze({ valid: false, reason: 'INVALID_EXACT_REFERENCE_VERSION' });
  }

  if (['latest', 'current'].includes(referenceVersion.versionRef.toLowerCase())) {
    return Object.freeze({ valid: false, reason: 'LATEST_OR_CURRENT_VERSION_FORBIDDEN' });
  }

  if (referenceVersion.formalizedAt === null) {
    return Object.freeze({ valid: false, reason: 'VERSION_NOT_FORMAL' });
  }

  const formalizedTimestamp = referenceVersion.formalizedAt instanceof Date
    ? referenceVersion.formalizedAt.getTime()
    : Date.parse(referenceVersion.formalizedAt);
  if (!Number.isFinite(formalizedTimestamp)) {
    return Object.freeze({ valid: false, reason: 'VERSION_NOT_FORMAL' });
  }

  const exactReferenceVersion = Object.freeze({ ...referenceVersion });
  return Object.freeze({ valid: true, exactReferenceVersion });
}
