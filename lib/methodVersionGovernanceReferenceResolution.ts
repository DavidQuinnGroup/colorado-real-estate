export const METHOD_VERSION_GOVERNANCE_REFERENCE_KINDS = [
  'SHARED_PRIMITIVE',
  'SHARED_CONTRACT',
] as const;

export type MethodVersionGovernanceReferenceKind =
  (typeof METHOD_VERSION_GOVERNANCE_REFERENCE_KINDS)[number];

export type GovernanceDependencyAdmissionState = 'AVAILABLE' | 'HELD';

export type GovernanceDependencyReference = Readonly<{
  referenceKind: MethodVersionGovernanceReferenceKind;
  semanticRef: string;
  versionRef: string;
  admissionState: GovernanceDependencyAdmissionState;
}>;

export type GovernanceDependencyQuery = Readonly<{
  referenceKind: MethodVersionGovernanceReferenceKind;
  semanticRef: string;
  versionRef: string;
}>;

export type GovernanceDependencyResolution =
  | Readonly<{
      resolved: true;
      reference: GovernanceDependencyReference;
    }>
  | Readonly<{
      resolved: false;
      reason: 'MISSING' | 'HELD' | 'AMBIGUOUS' | 'INVALID_REFERENCE';
    }>;

const noResolution = (
  reason: Exclude<GovernanceDependencyResolution, { resolved: true }>['reason'],
): GovernanceDependencyResolution => Object.freeze({ resolved: false, reason });

export function resolveExactMethodVersionGovernanceReference(
  query: GovernanceDependencyQuery,
  references: readonly GovernanceDependencyReference[],
): GovernanceDependencyResolution {
  if (!query.semanticRef || !query.versionRef || query.semanticRef.trim() !== query.semanticRef || query.versionRef.trim() !== query.versionRef) {
    return noResolution('INVALID_REFERENCE');
  }

  const matches = references.filter(
    (reference) =>
      reference.referenceKind === query.referenceKind &&
      reference.semanticRef === query.semanticRef &&
      reference.versionRef === query.versionRef,
  );

  if (matches.length === 0) return noResolution('MISSING');
  if (matches.length !== 1) return noResolution('AMBIGUOUS');
  if (matches[0].admissionState === 'HELD') return noResolution('HELD');

  return Object.freeze({ resolved: true, reference: matches[0] });
}
