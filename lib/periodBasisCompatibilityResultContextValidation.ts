export const FORMAL_METHOD_RESULT_LIFECYCLE_STATES = Object.freeze([
  'ADMITTED',
  'ADMITTED_WITH_QUALIFICATIONS',
  'SUPERSEDED',
  'CORRECTED',
  'WITHDRAWN',
  'HISTORICAL_ONLY',
] as const);

type FormalLifecycleState = (typeof FORMAL_METHOD_RESULT_LIFECYCLE_STATES)[number];

export type CompatibilityContextValidationFailure =
  | 'REFERENCE_REQUIRED'
  | 'LATEST_OR_CURRENT_REFERENCE_FORBIDDEN'
  | 'CROSS_SNAPSHOT_PIN_MIXING'
  | 'RESULT_VERSION_NOT_FORMAL'
  | 'REPORTING_PERIOD_VERSION_NOT_FORMAL'
  | 'ANALYTICAL_BASIS_VERSION_NOT_FORMAL'
  | 'METHOD_REQUIREMENT_MISSING'
  | 'PRODUCING_METHOD_EDGE_MISSING'
  | 'PRODUCING_METHOD_VERSION_NOT_FORMAL'
  | 'UNEXPECTED_PRODUCING_METHOD_EDGE';

export type PeriodBasisCompatibilityResultContextInput = Readonly<{
  snapshotId: string;
  resultPin: Readonly<{
    id: string;
    snapshotId: string;
    resultVersionId: string;
    resultVersionLifecycleState: string;
    methodRequirement: 'METHOD_VERSION_REQUIRED' | 'METHOD_VERSION_NOT_APPLICABLE' | null;
  }>;
  reportingPeriodPin: Readonly<{
    id: string;
    snapshotId: string;
    reportingPeriodReferenceVersionId: string;
    referenceVersionFormalizedAt: Date | string | null;
  }>;
  analyticalBasisPin: Readonly<{
    id: string;
    snapshotId: string;
    analyticalBasisReferenceVersionId: string;
    referenceVersionFormalizedAt: Date | string | null;
  }>;
  productionEdge: Readonly<{
    resultVersionId: string;
    methodVersionId: string;
    methodVersionLifecycleState: string;
  }> | null;
}>;

export type PeriodBasisCompatibilityResultContextValidation = Readonly<{
  valid: boolean;
  failure: CompatibilityContextValidationFailure | null;
  producingMethodVersionId: string | null;
}>;

const forbiddenMovingReference = /^(?:latest|current)(?::|$)/i;

function hasExactReference(value: string): boolean {
  return value.trim().length > 0 && !forbiddenMovingReference.test(value.trim());
}

function isFormalLifecycleState(value: string): value is FormalLifecycleState {
  return (FORMAL_METHOD_RESULT_LIFECYCLE_STATES as readonly string[]).includes(value);
}

function isFormalizedReference(value: Date | string | null): boolean {
  if (value === null) return false;
  const timestamp = value instanceof Date ? value.getTime() : Date.parse(value);
  return Number.isFinite(timestamp);
}

function invalid(
  failure: CompatibilityContextValidationFailure,
): PeriodBasisCompatibilityResultContextValidation {
  return Object.freeze({ valid: false, failure, producingMethodVersionId: null });
}

export function validatePeriodBasisCompatibilityResultContext(
  input: PeriodBasisCompatibilityResultContextInput,
): PeriodBasisCompatibilityResultContextValidation {
  const exactReferences = [
    input.snapshotId,
    input.resultPin.id,
    input.resultPin.resultVersionId,
    input.reportingPeriodPin.id,
    input.reportingPeriodPin.reportingPeriodReferenceVersionId,
    input.analyticalBasisPin.id,
    input.analyticalBasisPin.analyticalBasisReferenceVersionId,
  ];
  if (exactReferences.some((value) => value.trim().length === 0)) return invalid('REFERENCE_REQUIRED');
  if (exactReferences.some((value) => !hasExactReference(value))) {
    return invalid('LATEST_OR_CURRENT_REFERENCE_FORBIDDEN');
  }

  if (
    input.resultPin.snapshotId !== input.snapshotId
    || input.reportingPeriodPin.snapshotId !== input.snapshotId
    || input.analyticalBasisPin.snapshotId !== input.snapshotId
  ) return invalid('CROSS_SNAPSHOT_PIN_MIXING');

  if (!isFormalLifecycleState(input.resultPin.resultVersionLifecycleState)) {
    return invalid('RESULT_VERSION_NOT_FORMAL');
  }
  if (!isFormalizedReference(input.reportingPeriodPin.referenceVersionFormalizedAt)) {
    return invalid('REPORTING_PERIOD_VERSION_NOT_FORMAL');
  }
  if (!isFormalizedReference(input.analyticalBasisPin.referenceVersionFormalizedAt)) {
    return invalid('ANALYTICAL_BASIS_VERSION_NOT_FORMAL');
  }

  if (input.resultPin.methodRequirement === null) return invalid('METHOD_REQUIREMENT_MISSING');
  if (input.resultPin.methodRequirement === 'METHOD_VERSION_NOT_APPLICABLE') {
    if (input.productionEdge !== null) return invalid('UNEXPECTED_PRODUCING_METHOD_EDGE');
    return Object.freeze({ valid: true, failure: null, producingMethodVersionId: null });
  }

  if (input.productionEdge === null || input.productionEdge.resultVersionId !== input.resultPin.resultVersionId) {
    return invalid('PRODUCING_METHOD_EDGE_MISSING');
  }
  if (!hasExactReference(input.productionEdge.methodVersionId)) {
    return invalid('LATEST_OR_CURRENT_REFERENCE_FORBIDDEN');
  }
  if (!isFormalLifecycleState(input.productionEdge.methodVersionLifecycleState)) {
    return invalid('PRODUCING_METHOD_VERSION_NOT_FORMAL');
  }

  return Object.freeze({
    valid: true,
    failure: null,
    producingMethodVersionId: input.productionEdge.methodVersionId,
  });
}
