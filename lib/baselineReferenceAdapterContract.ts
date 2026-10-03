export type ExactBaselineResourceReference = Readonly<{
  resourceType: string;
  resourceId: string;
  resourceVersion: string;
}>;

export type BaselineReferenceAdapterExpectation = Readonly<{
  ownerRef: string;
  familyRef: string;
  requiredFinalityStateRef?: string;
}>;

export type BaselineReferenceAdapterValidation =
  | Readonly<{
      valid: true;
      exactReference: ExactBaselineResourceReference;
      ownerRef: string;
      familyRef: string;
      finalityStateRef?: string;
    }>
  | Readonly<{
      valid: false;
      reason: 'NOT_FOUND' | 'HELD' | 'NOT_FINAL' | 'OWNER_FAMILY_MISMATCH' | 'INVALID_REFERENCE';
    }>;

export type BaselineReferenceAdapter = Readonly<{
  resourceType: string;
  validateExactReference: (reference: ExactBaselineResourceReference) => BaselineReferenceAdapterValidation;
}>;

export type BaselineReferenceAdapterResolution =
  | Readonly<{
      resolved: true;
      validation: Extract<BaselineReferenceAdapterValidation, { valid: true }>;
    }>
  | Readonly<{
      resolved: false;
      reason:
        | 'INVALID_EXACT_REFERENCE'
        | 'INVALID_EXPECTATION'
        | 'LATEST_OR_CURRENT_VERSION_FORBIDDEN'
        | 'NO_ADAPTER'
        | 'RESOURCE_TYPE_MISMATCH'
        | 'ADAPTER_REFERENCE_MISMATCH'
        | 'ADAPTER_OWNER_FAMILY_MISMATCH'
        | 'ADAPTER_FINALITY_MISMATCH'
        | Exclude<BaselineReferenceAdapterValidation, { valid: true }>['reason'];
    }>;

const noResolution = (
  reason: Exclude<BaselineReferenceAdapterResolution, { resolved: true }>['reason'],
): BaselineReferenceAdapterResolution => Object.freeze({ resolved: false, reason });

const isExactIdentifier = (value: string): boolean => value.length > 0 && value.trim() === value;

export function resolveExactBaselineResourceReference(
  reference: ExactBaselineResourceReference,
  expectation: BaselineReferenceAdapterExpectation,
  adapter?: BaselineReferenceAdapter,
): BaselineReferenceAdapterResolution {
  if (
    !isExactIdentifier(reference.resourceType) ||
    !isExactIdentifier(reference.resourceId) ||
    !isExactIdentifier(reference.resourceVersion)
  ) {
    return noResolution('INVALID_EXACT_REFERENCE');
  }

  if (['latest', 'current'].includes(reference.resourceVersion.toLowerCase())) {
    return noResolution('LATEST_OR_CURRENT_VERSION_FORBIDDEN');
  }

  if (
    !isExactIdentifier(expectation.ownerRef) ||
    !isExactIdentifier(expectation.familyRef) ||
    (expectation.requiredFinalityStateRef !== undefined && !isExactIdentifier(expectation.requiredFinalityStateRef))
  ) {
    return noResolution('INVALID_EXPECTATION');
  }

  if (!adapter) return noResolution('NO_ADAPTER');
  if (adapter.resourceType !== reference.resourceType) return noResolution('RESOURCE_TYPE_MISMATCH');

  const validation = adapter.validateExactReference(Object.freeze({ ...reference }));
  if (!validation.valid) return noResolution(validation.reason);

  if (
    validation.exactReference.resourceType !== reference.resourceType ||
    validation.exactReference.resourceId !== reference.resourceId ||
    validation.exactReference.resourceVersion !== reference.resourceVersion
  ) {
    return noResolution('ADAPTER_REFERENCE_MISMATCH');
  }

  if (validation.ownerRef !== expectation.ownerRef || validation.familyRef !== expectation.familyRef) {
    return noResolution('ADAPTER_OWNER_FAMILY_MISMATCH');
  }
  if (
    expectation.requiredFinalityStateRef !== undefined &&
    validation.finalityStateRef !== expectation.requiredFinalityStateRef
  ) {
    return noResolution('ADAPTER_FINALITY_MISMATCH');
  }

  return Object.freeze({ resolved: true, validation: Object.freeze(validation) });
}
