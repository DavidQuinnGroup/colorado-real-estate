import { PUBLIC_SEARCH_ELIGIBILITY_STATES } from './publicSearchEligibilityStateContract.js';

export const PUBLIC_SEARCH_ELIGIBILITY_DB_DISTRIBUTION_CERTIFICATION_STATUS =
  'PUBLIC_SEARCH_ELIGIBILITY_DB_DISTRIBUTION_CERTIFICATION_ARCHITECTURE';

export type PublicSearchEligibilityDbDistributionPhase =
  | 'PRE_WRITE'
  | 'FIRST_BOUNDED_WRITE'
  | 'INITIALIZATION_IN_PROGRESS'
  | 'INITIALIZATION_COMPLETE'
  | 'UNVERIFIED_RESOLUTION_IN_PROGRESS'
  | 'FINAL_PRE_ACTIVATION_CERTIFICATION';

export type PublicSearchEligibilityDbDistributionClassification =
  | 'CERTIFIED'
  | 'NOT_READY'
  | 'DIVERGENT'
  | 'FAIL_CLOSED';

export type PublicSearchEligibilityDbDistributionCounts = Readonly<{
  totalPropertyRows: number | null;
  nullCount: number | null;
  certifiedEligibleCount: number | null;
  publicScopeUnverifiedCount: number | null;
  certifiedIneligibleCount: number | null;
  totalClassifiedCount?: number | null;
  excludedOutOfScopeCount?: number | null;
}>;

export type PublicSearchEligibilityDbTransitionEvidence = Readonly<{
  transitionWritesExecuted: boolean | null;
  expectedWriteCount: number | null;
  observedWriteCount: number | null;
  expectedBeforeDistribution: PublicSearchEligibilityDbDistributionCounts | null;
  expectedAfterDistribution: PublicSearchEligibilityDbDistributionCounts | null;
  planFingerprint: string | null;
  observedPlanFingerprint: string | null;
  writeSetFingerprint: string | null;
  observedWriteSetFingerprint: string | null;
  providerSnapshotFingerprintRequired: boolean;
  providerSnapshotFingerprint: string | null;
  observedProviderSnapshotFingerprint: string | null;
  batchFingerprint?: string | null;
  observedBatchFingerprint?: string | null;
}>;

export type PublicSearchEligibilityDbActivationPrerequisiteEvidence = Readonly<{
  providerSnapshotCertified: boolean;
  transitionWriteChainCertified: boolean;
  discoveryParityCertified: boolean;
  searchReadinessCertified: boolean;
  typesenseReadinessCertified: boolean;
  databaseFallbackReadinessCertified: boolean;
  savedSearchReadinessCertified: boolean;
  activationOperationsReadinessCertified: boolean;
  operatorAuthorizationSupplied: boolean;
}>;

export type PublicSearchEligibilityDbDistributionProtectedBoundary = Readonly<{
  providerCallAttempted: boolean;
  databaseAccessAttempted: boolean;
  databaseWriteAttempted: boolean;
  runtimeActivationAttempted: boolean;
  searchMutationAttempted: boolean;
  typesenseMutationAttempted: boolean;
  savedSearchMutationAttempted: boolean;
  alertOrEmailAttempted: boolean;
  deploymentAttempted: boolean;
}>;

export type PublicSearchEligibilityDbDistributionCertificationInput = Readonly<{
  phase: PublicSearchEligibilityDbDistributionPhase;
  distribution: PublicSearchEligibilityDbDistributionCounts | null;
  transitionEvidence: PublicSearchEligibilityDbTransitionEvidence | null;
  activationPrerequisites: PublicSearchEligibilityDbActivationPrerequisiteEvidence | null;
  capturedAt: string | null;
  certificationContext: string | null;
  unresolvedIdentityCount?: number | null;
  unresolvedStatusCount?: number | null;
  expectedNullPopulationUnderstood: boolean | null;
  finalActivationCertificationRequested: boolean;
  protectedBoundary: PublicSearchEligibilityDbDistributionProtectedBoundary;
}>;

export type PublicSearchEligibilityDbDistributionReason =
  | 'CERTIFIED_DISTRIBUTION_EVIDENCE_RECONCILED'
  | 'MISSING_DISTRIBUTION_EVIDENCE'
  | 'MISSING_TOTAL_PROPERTY_ROWS'
  | 'MISSING_STATE_COUNT_EVIDENCE'
  | 'MISSING_CERTIFICATION_CONTEXT'
  | 'MISSING_CAPTURE_TIMESTAMP'
  | 'NEGATIVE_COUNT'
  | 'NON_INTEGER_COUNT'
  | 'COUNTS_EXCEED_TOTAL'
  | 'COUNTS_BELOW_TOTAL_WITHOUT_EXCLUDED_SCOPE'
  | 'TOTAL_CLASSIFIED_COUNT_MISMATCH'
  | 'EXCLUDED_SCOPE_NEGATIVE'
  | 'ALL_NULL_DISTRIBUTION_NOT_READY'
  | 'NULL_POPULATION_UNRESOLVED'
  | 'FINAL_CERTIFICATION_HAS_NULL_ROWS'
  | 'FINAL_CERTIFICATION_HAS_PUBLIC_SCOPE_UNVERIFIED_ROWS'
  | 'PUBLIC_SCOPE_UNVERIFIED_REMAINS_UNRESOLVED'
  | 'UNRESOLVED_IDENTITY_OR_STATUS_POPULATION_PRESENT'
  | 'CERTIFIED_INELIGIBLE_REMAINS_INELIGIBLE'
  | 'PHASE_PRE_WRITE_CANNOT_CERTIFY_POST_WRITE_DISTRIBUTION'
  | 'FIRST_BOUNDED_WRITE_REMAINS_PARTIAL'
  | 'INITIALIZATION_STILL_IN_PROGRESS'
  | 'INITIALIZATION_COMPLETE_REQUIRES_NO_NULL_ROWS'
  | 'UNVERIFIED_RESOLUTION_STILL_IN_PROGRESS'
  | 'FINAL_PRE_ACTIVATION_PHASE_REQUIRED'
  | 'MISSING_TRANSITION_EVIDENCE'
  | 'TRANSITION_WRITES_NOT_EXECUTED'
  | 'MISSING_EXPECTED_WRITE_COUNT'
  | 'MISSING_OBSERVED_WRITE_COUNT'
  | 'TRANSITION_WRITE_COUNT_MISMATCH'
  | 'MISSING_EXPECTED_AFTER_DISTRIBUTION'
  | 'EXPECTED_AFTER_DISTRIBUTION_MISMATCH'
  | 'PLAN_FINGERPRINT_MISSING'
  | 'PLAN_FINGERPRINT_MISMATCH'
  | 'WRITE_SET_FINGERPRINT_MISSING'
  | 'WRITE_SET_FINGERPRINT_MISMATCH'
  | 'PROVIDER_SNAPSHOT_FINGERPRINT_MISSING'
  | 'PROVIDER_SNAPSHOT_FINGERPRINT_MISMATCH'
  | 'BATCH_FINGERPRINT_MISMATCH'
  | 'PROVIDER_SNAPSHOT_NOT_CERTIFIED'
  | 'TRANSITION_WRITE_CHAIN_NOT_CERTIFIED'
  | 'DISCOVERY_PARITY_NOT_CERTIFIED'
  | 'SEARCH_READINESS_NOT_CERTIFIED'
  | 'TYPESENSE_READINESS_NOT_CERTIFIED'
  | 'DATABASE_FALLBACK_READINESS_NOT_CERTIFIED'
  | 'SAVED_SEARCH_READINESS_NOT_CERTIFIED'
  | 'ACTIVATION_OPERATIONS_READINESS_NOT_CERTIFIED'
  | 'OPERATOR_AUTHORIZATION_NOT_SUPPLIED'
  | 'DISTRIBUTION_DOES_NOT_AUTHORIZE_RUNTIME_ACTIVATION'
  | 'PROVIDER_CALL_ATTEMPTED'
  | 'DATABASE_ACCESS_ATTEMPTED'
  | 'DATABASE_WRITE_ATTEMPTED'
  | 'RUNTIME_ACTIVATION_ATTEMPTED'
  | 'SEARCH_MUTATION_ATTEMPTED'
  | 'TYPESENSE_MUTATION_ATTEMPTED'
  | 'SAVED_SEARCH_MUTATION_ATTEMPTED'
  | 'ALERT_OR_EMAIL_ATTEMPTED'
  | 'DEPLOYMENT_ATTEMPTED';

export type PublicSearchEligibilityDbDistributionCertification = Readonly<{
  status: typeof PUBLIC_SEARCH_ELIGIBILITY_DB_DISTRIBUTION_CERTIFICATION_STATUS;
  classification: PublicSearchEligibilityDbDistributionClassification;
  phase: PublicSearchEligibilityDbDistributionPhase;
  reasons: readonly PublicSearchEligibilityDbDistributionReason[];
  reconciliation: {
    totalPropertyRows: number | null;
    totalClassifiedCount: number | null;
    excludedOutOfScopeCount: number;
    reconciledToCertificationScope: boolean;
    impossibleStateDetected: boolean;
  };
  stateSemantics: {
    nullRowsEligible: false;
    publicScopeUnverifiedEligible: false;
    certifiedIneligibleEligible: false;
    certifiedEligiblePotentiallyEligibleOnlyAfterCanonicalRuntimePredicate: true;
  };
  activationAuthority: {
    distributionAloneAuthorizesRuntimeActivation: false;
    certifiedEligibilityModeActivated: false;
    finalActivationStillRequiresSeparateGates: readonly string[];
  };
  transitionEvidence: {
    movementMatchesExpectedDistribution: boolean;
    planFingerprintMatches: boolean;
    writeSetFingerprintMatches: boolean;
    providerSnapshotFingerprintMatches: boolean | null;
    batchFingerprintMatches: boolean | null;
  };
  zeroSideEffects: {
    providerCallsPerformed: false;
    databaseAccessPerformed: false;
    databaseWritesPerformed: false;
    runtimeActivationPerformed: false;
    searchMutationPerformed: false;
    typesenseMutationPerformed: false;
    savedSearchMutationPerformed: false;
    alertOrEmailPerformed: false;
    deploymentPerformed: false;
  };
}>;

const FINAL_ACTIVATION_GATES = Object.freeze([
  'provider snapshot certification',
  'transition/write chain certification',
  'discovery parity certification',
  'Search readiness certification',
  'Typesense readiness certification',
  'database fallback readiness certification',
  'Saved Search readiness certification',
  'Activation Operations Readiness',
  'explicit operator authorization',
]);

function isMissing(value: unknown) {
  return value === null || value === undefined;
}

function numberFields(distribution: PublicSearchEligibilityDbDistributionCounts) {
  return [
    distribution.totalPropertyRows,
    distribution.nullCount,
    distribution.certifiedEligibleCount,
    distribution.publicScopeUnverifiedCount,
    distribution.certifiedIneligibleCount,
  ];
}

function isNonNegativeInteger(value: number | null | undefined) {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}

function countSum(distribution: PublicSearchEligibilityDbDistributionCounts) {
  return (
    (distribution.nullCount ?? 0) +
    (distribution.certifiedEligibleCount ?? 0) +
    (distribution.publicScopeUnverifiedCount ?? 0) +
    (distribution.certifiedIneligibleCount ?? 0)
  );
}

function excludedCount(distribution: PublicSearchEligibilityDbDistributionCounts | null) {
  return distribution?.excludedOutOfScopeCount ?? 0;
}

function distributionsEqual(
  left: PublicSearchEligibilityDbDistributionCounts | null,
  right: PublicSearchEligibilityDbDistributionCounts | null,
) {
  return Boolean(
    left &&
      right &&
      left.totalPropertyRows === right.totalPropertyRows &&
      left.nullCount === right.nullCount &&
      left.certifiedEligibleCount === right.certifiedEligibleCount &&
      left.publicScopeUnverifiedCount === right.publicScopeUnverifiedCount &&
      left.certifiedIneligibleCount === right.certifiedIneligibleCount &&
      excludedCount(left) === excludedCount(right),
  );
}

function addDistributionReasons(
  input: PublicSearchEligibilityDbDistributionCertificationInput,
  reasons: PublicSearchEligibilityDbDistributionReason[],
) {
  const distribution = input.distribution;
  if (!distribution) {
    reasons.push('MISSING_DISTRIBUTION_EVIDENCE');
    return;
  }

  if (isMissing(distribution.totalPropertyRows)) reasons.push('MISSING_TOTAL_PROPERTY_ROWS');
  if (
    isMissing(distribution.nullCount) ||
    isMissing(distribution.certifiedEligibleCount) ||
    isMissing(distribution.publicScopeUnverifiedCount) ||
    isMissing(distribution.certifiedIneligibleCount)
  ) {
    reasons.push('MISSING_STATE_COUNT_EVIDENCE');
  }
  if (!input.certificationContext?.trim()) reasons.push('MISSING_CERTIFICATION_CONTEXT');
  if (!input.capturedAt?.trim()) reasons.push('MISSING_CAPTURE_TIMESTAMP');

  if (numberFields(distribution).some((value) => typeof value === 'number' && !Number.isInteger(value))) {
    reasons.push('NON_INTEGER_COUNT');
  }
  if (numberFields(distribution).some((value) => typeof value === 'number' && value < 0)) reasons.push('NEGATIVE_COUNT');
  if (typeof distribution.excludedOutOfScopeCount === 'number' && distribution.excludedOutOfScopeCount < 0) {
    reasons.push('EXCLUDED_SCOPE_NEGATIVE');
  }

  if (!numberFields(distribution).every(isNonNegativeInteger)) return;

  const totalClassifiedCount = countSum(distribution);
  const totalClassifiedEvidence = distribution.totalClassifiedCount;
  const excluded = excludedCount(distribution);
  const total = distribution.totalPropertyRows ?? 0;
  const nullCount = distribution.nullCount ?? 0;
  const certifiedEligibleCount = distribution.certifiedEligibleCount ?? 0;
  const publicScopeUnverifiedCount = distribution.publicScopeUnverifiedCount ?? 0;
  const certifiedIneligibleCount = distribution.certifiedIneligibleCount ?? 0;

  if (typeof totalClassifiedEvidence === 'number' && totalClassifiedEvidence !== totalClassifiedCount) {
    reasons.push('TOTAL_CLASSIFIED_COUNT_MISMATCH');
  }
  if (totalClassifiedCount + excluded > total) reasons.push('COUNTS_EXCEED_TOTAL');
  if (totalClassifiedCount + excluded < total) reasons.push('COUNTS_BELOW_TOTAL_WITHOUT_EXCLUDED_SCOPE');

  if (
    total > 0 &&
    nullCount === total &&
    certifiedEligibleCount === 0 &&
    publicScopeUnverifiedCount === 0 &&
    certifiedIneligibleCount === 0
  ) {
    reasons.push('ALL_NULL_DISTRIBUTION_NOT_READY');
  }
  if (nullCount > 0 && input.expectedNullPopulationUnderstood !== true) reasons.push('NULL_POPULATION_UNRESOLVED');
  if (publicScopeUnverifiedCount > 0) reasons.push('PUBLIC_SCOPE_UNVERIFIED_REMAINS_UNRESOLVED');
  if ((input.unresolvedIdentityCount ?? 0) > 0 || (input.unresolvedStatusCount ?? 0) > 0) {
    reasons.push('UNRESOLVED_IDENTITY_OR_STATUS_POPULATION_PRESENT');
  }
}

function addPhaseReasons(
  input: PublicSearchEligibilityDbDistributionCertificationInput,
  reasons: PublicSearchEligibilityDbDistributionReason[],
) {
  const distribution = input.distribution;
  if (!distribution) return;

  if (input.finalActivationCertificationRequested && input.phase !== 'FINAL_PRE_ACTIVATION_CERTIFICATION') {
    reasons.push('FINAL_PRE_ACTIVATION_PHASE_REQUIRED');
  }
  if (input.phase === 'PRE_WRITE') reasons.push('PHASE_PRE_WRITE_CANNOT_CERTIFY_POST_WRITE_DISTRIBUTION');
  if (input.phase === 'FIRST_BOUNDED_WRITE' && (distribution.nullCount ?? 0) > 0) {
    reasons.push('FIRST_BOUNDED_WRITE_REMAINS_PARTIAL');
  }
  if (input.phase === 'INITIALIZATION_IN_PROGRESS') reasons.push('INITIALIZATION_STILL_IN_PROGRESS');
  if (input.phase === 'INITIALIZATION_COMPLETE' && (distribution.nullCount ?? 0) > 0) {
    reasons.push('INITIALIZATION_COMPLETE_REQUIRES_NO_NULL_ROWS');
  }
  if (input.phase === 'UNVERIFIED_RESOLUTION_IN_PROGRESS') reasons.push('UNVERIFIED_RESOLUTION_STILL_IN_PROGRESS');
  if (input.phase === 'FINAL_PRE_ACTIVATION_CERTIFICATION') {
    if ((distribution.nullCount ?? 0) > 0) reasons.push('FINAL_CERTIFICATION_HAS_NULL_ROWS');
    if ((distribution.publicScopeUnverifiedCount ?? 0) > 0) reasons.push('FINAL_CERTIFICATION_HAS_PUBLIC_SCOPE_UNVERIFIED_ROWS');
  }
}

function addTransitionReasons(
  input: PublicSearchEligibilityDbDistributionCertificationInput,
  reasons: PublicSearchEligibilityDbDistributionReason[],
) {
  const transition = input.transitionEvidence;
  if (!transition) {
    reasons.push('MISSING_TRANSITION_EVIDENCE');
    return;
  }

  if (transition.transitionWritesExecuted !== true) reasons.push('TRANSITION_WRITES_NOT_EXECUTED');
  if (!isNonNegativeInteger(transition.expectedWriteCount)) reasons.push('MISSING_EXPECTED_WRITE_COUNT');
  if (!isNonNegativeInteger(transition.observedWriteCount)) reasons.push('MISSING_OBSERVED_WRITE_COUNT');
  if (
    isNonNegativeInteger(transition.expectedWriteCount) &&
    isNonNegativeInteger(transition.observedWriteCount) &&
    transition.expectedWriteCount !== transition.observedWriteCount
  ) {
    reasons.push('TRANSITION_WRITE_COUNT_MISMATCH');
  }
  if (!transition.expectedAfterDistribution) reasons.push('MISSING_EXPECTED_AFTER_DISTRIBUTION');
  if (transition.expectedAfterDistribution && !distributionsEqual(input.distribution, transition.expectedAfterDistribution)) {
    reasons.push('EXPECTED_AFTER_DISTRIBUTION_MISMATCH');
  }
  if (!transition.planFingerprint || !transition.observedPlanFingerprint) reasons.push('PLAN_FINGERPRINT_MISSING');
  if (transition.planFingerprint && transition.observedPlanFingerprint && transition.planFingerprint !== transition.observedPlanFingerprint) {
    reasons.push('PLAN_FINGERPRINT_MISMATCH');
  }
  if (!transition.writeSetFingerprint || !transition.observedWriteSetFingerprint) reasons.push('WRITE_SET_FINGERPRINT_MISSING');
  if (
    transition.writeSetFingerprint &&
    transition.observedWriteSetFingerprint &&
    transition.writeSetFingerprint !== transition.observedWriteSetFingerprint
  ) {
    reasons.push('WRITE_SET_FINGERPRINT_MISMATCH');
  }
  if (transition.providerSnapshotFingerprintRequired && (!transition.providerSnapshotFingerprint || !transition.observedProviderSnapshotFingerprint)) {
    reasons.push('PROVIDER_SNAPSHOT_FINGERPRINT_MISSING');
  }
  if (
    transition.providerSnapshotFingerprint &&
    transition.observedProviderSnapshotFingerprint &&
    transition.providerSnapshotFingerprint !== transition.observedProviderSnapshotFingerprint
  ) {
    reasons.push('PROVIDER_SNAPSHOT_FINGERPRINT_MISMATCH');
  }
  if (
    transition.batchFingerprint &&
    transition.observedBatchFingerprint &&
    transition.batchFingerprint !== transition.observedBatchFingerprint
  ) {
    reasons.push('BATCH_FINGERPRINT_MISMATCH');
  }
}

function addActivationPrerequisiteReasons(
  input: PublicSearchEligibilityDbDistributionCertificationInput,
  reasons: PublicSearchEligibilityDbDistributionReason[],
) {
  const prerequisites = input.activationPrerequisites;
  if (!prerequisites) {
    reasons.push('PROVIDER_SNAPSHOT_NOT_CERTIFIED');
    reasons.push('TRANSITION_WRITE_CHAIN_NOT_CERTIFIED');
    reasons.push('DISCOVERY_PARITY_NOT_CERTIFIED');
    reasons.push('SEARCH_READINESS_NOT_CERTIFIED');
    reasons.push('TYPESENSE_READINESS_NOT_CERTIFIED');
    reasons.push('DATABASE_FALLBACK_READINESS_NOT_CERTIFIED');
    reasons.push('SAVED_SEARCH_READINESS_NOT_CERTIFIED');
    reasons.push('ACTIVATION_OPERATIONS_READINESS_NOT_CERTIFIED');
    reasons.push('OPERATOR_AUTHORIZATION_NOT_SUPPLIED');
    return;
  }

  if (!prerequisites.providerSnapshotCertified) reasons.push('PROVIDER_SNAPSHOT_NOT_CERTIFIED');
  if (!prerequisites.transitionWriteChainCertified) reasons.push('TRANSITION_WRITE_CHAIN_NOT_CERTIFIED');
  if (!prerequisites.discoveryParityCertified) reasons.push('DISCOVERY_PARITY_NOT_CERTIFIED');
  if (!prerequisites.searchReadinessCertified) reasons.push('SEARCH_READINESS_NOT_CERTIFIED');
  if (!prerequisites.typesenseReadinessCertified) reasons.push('TYPESENSE_READINESS_NOT_CERTIFIED');
  if (!prerequisites.databaseFallbackReadinessCertified) reasons.push('DATABASE_FALLBACK_READINESS_NOT_CERTIFIED');
  if (!prerequisites.savedSearchReadinessCertified) reasons.push('SAVED_SEARCH_READINESS_NOT_CERTIFIED');
  if (!prerequisites.activationOperationsReadinessCertified) reasons.push('ACTIVATION_OPERATIONS_READINESS_NOT_CERTIFIED');
  if (!prerequisites.operatorAuthorizationSupplied) reasons.push('OPERATOR_AUTHORIZATION_NOT_SUPPLIED');
}

function addProtectedBoundaryReasons(
  input: PublicSearchEligibilityDbDistributionCertificationInput,
  reasons: PublicSearchEligibilityDbDistributionReason[],
) {
  if (input.protectedBoundary.providerCallAttempted) reasons.push('PROVIDER_CALL_ATTEMPTED');
  if (input.protectedBoundary.databaseAccessAttempted) reasons.push('DATABASE_ACCESS_ATTEMPTED');
  if (input.protectedBoundary.databaseWriteAttempted) reasons.push('DATABASE_WRITE_ATTEMPTED');
  if (input.protectedBoundary.runtimeActivationAttempted) reasons.push('RUNTIME_ACTIVATION_ATTEMPTED');
  if (input.protectedBoundary.searchMutationAttempted) reasons.push('SEARCH_MUTATION_ATTEMPTED');
  if (input.protectedBoundary.typesenseMutationAttempted) reasons.push('TYPESENSE_MUTATION_ATTEMPTED');
  if (input.protectedBoundary.savedSearchMutationAttempted) reasons.push('SAVED_SEARCH_MUTATION_ATTEMPTED');
  if (input.protectedBoundary.alertOrEmailAttempted) reasons.push('ALERT_OR_EMAIL_ATTEMPTED');
  if (input.protectedBoundary.deploymentAttempted) reasons.push('DEPLOYMENT_ATTEMPTED');
}

function failClosedReason(reason: PublicSearchEligibilityDbDistributionReason) {
  return [
    'MISSING_DISTRIBUTION_EVIDENCE',
    'MISSING_TOTAL_PROPERTY_ROWS',
    'MISSING_STATE_COUNT_EVIDENCE',
    'MISSING_CERTIFICATION_CONTEXT',
    'MISSING_CAPTURE_TIMESTAMP',
    'NEGATIVE_COUNT',
    'NON_INTEGER_COUNT',
    'COUNTS_EXCEED_TOTAL',
    'COUNTS_BELOW_TOTAL_WITHOUT_EXCLUDED_SCOPE',
    'TOTAL_CLASSIFIED_COUNT_MISMATCH',
    'EXCLUDED_SCOPE_NEGATIVE',
    'PROVIDER_CALL_ATTEMPTED',
    'DATABASE_ACCESS_ATTEMPTED',
    'DATABASE_WRITE_ATTEMPTED',
    'RUNTIME_ACTIVATION_ATTEMPTED',
    'SEARCH_MUTATION_ATTEMPTED',
    'TYPESENSE_MUTATION_ATTEMPTED',
    'SAVED_SEARCH_MUTATION_ATTEMPTED',
    'ALERT_OR_EMAIL_ATTEMPTED',
    'DEPLOYMENT_ATTEMPTED',
  ].includes(reason);
}

function divergentReason(reason: PublicSearchEligibilityDbDistributionReason) {
  return [
    'TRANSITION_WRITE_COUNT_MISMATCH',
    'EXPECTED_AFTER_DISTRIBUTION_MISMATCH',
    'PLAN_FINGERPRINT_MISMATCH',
    'WRITE_SET_FINGERPRINT_MISMATCH',
    'PROVIDER_SNAPSHOT_FINGERPRINT_MISMATCH',
    'BATCH_FINGERPRINT_MISMATCH',
  ].includes(reason);
}

export function certifyPublicSearchEligibilityDbDistribution(
  input: PublicSearchEligibilityDbDistributionCertificationInput,
): PublicSearchEligibilityDbDistributionCertification {
  const reasons: PublicSearchEligibilityDbDistributionReason[] = [];

  addDistributionReasons(input, reasons);
  addPhaseReasons(input, reasons);
  addTransitionReasons(input, reasons);
  addActivationPrerequisiteReasons(input, reasons);
  addProtectedBoundaryReasons(input, reasons);
  reasons.push('DISTRIBUTION_DOES_NOT_AUTHORIZE_RUNTIME_ACTIVATION');

  const uniqueReasons = [...new Set(reasons)];
  const distribution = input.distribution;
  const totalClassifiedCount = distribution ? countSum(distribution) : null;
  const excluded = excludedCount(distribution);
  const reconciledToCertificationScope = Boolean(
    distribution &&
      isNonNegativeInteger(distribution.totalPropertyRows) &&
      totalClassifiedCount !== null &&
      totalClassifiedCount + excluded === distribution.totalPropertyRows,
  );

  const classification: PublicSearchEligibilityDbDistributionClassification = uniqueReasons.some(failClosedReason)
    ? 'FAIL_CLOSED'
    : uniqueReasons.some(divergentReason)
      ? 'DIVERGENT'
      : uniqueReasons.length > 1
        ? 'NOT_READY'
        : 'CERTIFIED';

  const transition = input.transitionEvidence;

  return Object.freeze({
    status: PUBLIC_SEARCH_ELIGIBILITY_DB_DISTRIBUTION_CERTIFICATION_STATUS,
    classification,
    phase: input.phase,
    reasons: Object.freeze(
      classification === 'CERTIFIED'
        ? (['CERTIFIED_DISTRIBUTION_EVIDENCE_RECONCILED'] satisfies PublicSearchEligibilityDbDistributionReason[])
        : uniqueReasons,
    ),
    reconciliation: {
      totalPropertyRows: distribution?.totalPropertyRows ?? null,
      totalClassifiedCount,
      excludedOutOfScopeCount: excluded,
      reconciledToCertificationScope,
      impossibleStateDetected: uniqueReasons.some(failClosedReason),
    },
    stateSemantics: {
      nullRowsEligible: false as const,
      publicScopeUnverifiedEligible: false as const,
      certifiedIneligibleEligible: false as const,
      certifiedEligiblePotentiallyEligibleOnlyAfterCanonicalRuntimePredicate: true as const,
    },
    activationAuthority: {
      distributionAloneAuthorizesRuntimeActivation: false as const,
      certifiedEligibilityModeActivated: false as const,
      finalActivationStillRequiresSeparateGates: FINAL_ACTIVATION_GATES,
    },
    transitionEvidence: {
      movementMatchesExpectedDistribution: Boolean(transition?.expectedAfterDistribution && distributionsEqual(input.distribution, transition.expectedAfterDistribution)),
      planFingerprintMatches: Boolean(transition?.planFingerprint && transition.observedPlanFingerprint && transition.planFingerprint === transition.observedPlanFingerprint),
      writeSetFingerprintMatches: Boolean(
        transition?.writeSetFingerprint &&
          transition.observedWriteSetFingerprint &&
          transition.writeSetFingerprint === transition.observedWriteSetFingerprint,
      ),
      providerSnapshotFingerprintMatches:
        transition?.providerSnapshotFingerprintRequired === true
          ? Boolean(
              transition.providerSnapshotFingerprint &&
                transition.observedProviderSnapshotFingerprint &&
                transition.providerSnapshotFingerprint === transition.observedProviderSnapshotFingerprint,
            )
          : null,
      batchFingerprintMatches:
        transition?.batchFingerprint || transition?.observedBatchFingerprint
          ? Boolean(transition.batchFingerprint && transition.observedBatchFingerprint && transition.batchFingerprint === transition.observedBatchFingerprint)
          : null,
    },
    zeroSideEffects: {
      providerCallsPerformed: false as const,
      databaseAccessPerformed: false as const,
      databaseWritesPerformed: false as const,
      runtimeActivationPerformed: false as const,
      searchMutationPerformed: false as const,
      typesenseMutationPerformed: false as const,
      savedSearchMutationPerformed: false as const,
      alertOrEmailPerformed: false as const,
      deploymentPerformed: false as const,
    },
  });
}

export const PUBLIC_SEARCH_ELIGIBILITY_DB_DISTRIBUTION_STATE_NAMES = Object.freeze({
  null: 'NULL',
  certifiedEligible: PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedEligible,
  publicScopeUnverified: PUBLIC_SEARCH_ELIGIBILITY_STATES.publicScopeUnverified,
  certifiedIneligible: PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedIneligible,
});
