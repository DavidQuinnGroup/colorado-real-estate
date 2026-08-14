import {
  PUBLIC_SEARCH_ELIGIBILITY_STATES,
  isPublicScopeStatus,
  type PublicSearchEligibilityState,
} from './publicSearchEligibilityStateContract.js';

export const PUBLIC_SEARCH_ELIGIBILITY_ACTIVATION_MODES = {
  legacy: 'LEGACY',
  certifiedEligibility: 'CERTIFIED_ELIGIBILITY',
} as const;

export type PublicSearchEligibilityActivationMode =
  (typeof PUBLIC_SEARCH_ELIGIBILITY_ACTIVATION_MODES)[keyof typeof PUBLIC_SEARCH_ELIGIBILITY_ACTIVATION_MODES];

export type PublicSearchEligibilityRuntimeInput = {
  activationMode: PublicSearchEligibilityActivationMode;
  publicSearchEligibility: PublicSearchEligibilityState | null;
  authoritativeStatus: string | null | undefined;
  isPrivateExclusive: boolean;
  otherPublicReadRestriction?: boolean;
  sourceFreshForSavedSearch?: boolean;
  savedSearchMatch?: boolean;
  consentForAlert?: boolean;
  duplicateAlertEvent?: boolean;
};

export type PublicSearchEligibilityRuntimeDecision = {
  publicSearchEligible: boolean;
  typesenseEligible: boolean;
  databaseFallbackEligible: boolean;
  savedSearchEligible: boolean;
  newListingAlertCandidate: boolean;
  historicalPropertyRouteRetained: true;
  eligibilityStateRequiredForPublicDiscovery: boolean;
  reason: PublicSearchEligibilityRuntimeReason;
};

export type PublicSearchEligibilityRuntimeReason =
  | 'LEGACY_PUBLIC_CRITERIA_APPLIED'
  | 'LEGACY_PUBLIC_CRITERIA_BLOCKED'
  | 'CERTIFIED_ELIGIBLE_PUBLIC_CRITERIA_APPLIED'
  | 'CERTIFIED_ELIGIBILITY_REQUIRED_NULL_FAIL_CLOSED'
  | 'PUBLIC_SCOPE_UNVERIFIED_FAIL_CLOSED'
  | 'CERTIFIED_INELIGIBLE_FAIL_CLOSED'
  | 'CERTIFIED_ELIGIBLE_PRIVATE_EXCLUSIVE_BLOCKED'
  | 'CERTIFIED_ELIGIBLE_STATUS_NOT_PUBLIC'
  | 'CERTIFIED_ELIGIBLE_OTHER_PUBLIC_RESTRICTION_BLOCKED';

export type PublicSearchEligibilityActivationReadinessInput = {
  providerSnapshotCertifiedComplete: boolean;
  transitionWritesExecuted: boolean;
  absentRowsReconciledOrAcceptedFailClosed: boolean;
  dbEligibilityDistributionCertified: boolean;
  expectedNullPopulationUnderstood: boolean;
  unresolvedStateDriftFailures: number;
  searchIndexActivationPlanCertified: boolean;
  typesenseRebuildReady: boolean;
  savedSearchBehaviorReady: boolean;
  alertBehaviorSeparatelyGated: boolean;
  dbDistribution: {
    nullCount: number;
    certifiedEligibleCount: number;
    publicScopeUnverifiedCount: number;
    certifiedIneligibleCount: number;
  };
};

export type PublicSearchEligibilityActivationReadinessReason =
  | 'READY_ALL_ACTIVATION_PRECONDITIONS_PRESENT'
  | 'PROVIDER_SNAPSHOT_NOT_CERTIFIED_COMPLETE'
  | 'TRANSITION_WRITES_NOT_EXECUTED'
  | 'ABSENT_ROWS_NOT_RECONCILED_OR_ACCEPTED_FAIL_CLOSED'
  | 'DB_ELIGIBILITY_DISTRIBUTION_NOT_CERTIFIED'
  | 'EXPECTED_NULL_POPULATION_NOT_UNDERSTOOD'
  | 'UNRESOLVED_STATE_DRIFT_FAILURES_PRESENT'
  | 'SEARCH_INDEX_ACTIVATION_PLAN_NOT_CERTIFIED'
  | 'TYPESENSE_REBUILD_NOT_READY'
  | 'SAVED_SEARCH_BEHAVIOR_NOT_READY'
  | 'ALERT_BEHAVIOR_NOT_SEPARATELY_GATED'
  | 'DB_REMAINS_ALL_NULL';

export type PublicSearchEligibilityActivationReadiness = {
  status: 'READY_TO_ACTIVATE_CERTIFIED_ELIGIBILITY' | 'NOT_READY_TO_ACTIVATE_CERTIFIED_ELIGIBILITY';
  reasons: PublicSearchEligibilityActivationReadinessReason[];
  zeroSideEffects: {
    databaseWritesPerformed: false;
    providerCallsPerformed: false;
    runtimeActivationPerformed: false;
    typesenseMutationPerformed: false;
    alertMutationPerformed: false;
  };
};

function normalizeStatus(value: string | null | undefined) {
  return (value ?? '').trim().replace(/\s+/g, ' ').toLowerCase();
}

function isActiveStatus(value: string | null | undefined) {
  return normalizeStatus(value) === 'active';
}

function currentPublicCriteriaSatisfied(input: PublicSearchEligibilityRuntimeInput) {
  return isPublicScopeStatus(input.authoritativeStatus) && !input.isPrivateExclusive && !input.otherPublicReadRestriction;
}

function savedSearchCriteriaSatisfied(input: PublicSearchEligibilityRuntimeInput) {
  return (
    isActiveStatus(input.authoritativeStatus) &&
    input.sourceFreshForSavedSearch === true &&
    input.savedSearchMatch === true &&
    input.consentForAlert === true &&
    input.duplicateAlertEvent !== true
  );
}

function blockedCertifiedReason(input: PublicSearchEligibilityRuntimeInput): PublicSearchEligibilityRuntimeReason {
  if (input.publicSearchEligibility === null) return 'CERTIFIED_ELIGIBILITY_REQUIRED_NULL_FAIL_CLOSED';
  if (input.publicSearchEligibility === PUBLIC_SEARCH_ELIGIBILITY_STATES.publicScopeUnverified) return 'PUBLIC_SCOPE_UNVERIFIED_FAIL_CLOSED';
  if (input.publicSearchEligibility === PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedIneligible) return 'CERTIFIED_INELIGIBLE_FAIL_CLOSED';
  if (input.isPrivateExclusive) return 'CERTIFIED_ELIGIBLE_PRIVATE_EXCLUSIVE_BLOCKED';
  if (!isPublicScopeStatus(input.authoritativeStatus)) return 'CERTIFIED_ELIGIBLE_STATUS_NOT_PUBLIC';
  return 'CERTIFIED_ELIGIBLE_OTHER_PUBLIC_RESTRICTION_BLOCKED';
}

export function evaluatePublicSearchEligibilityRuntime(
  input: PublicSearchEligibilityRuntimeInput,
): PublicSearchEligibilityRuntimeDecision {
  const legacyPublicEligible = currentPublicCriteriaSatisfied(input);

  if (input.activationMode === PUBLIC_SEARCH_ELIGIBILITY_ACTIVATION_MODES.legacy) {
    const savedSearchEligible = legacyPublicEligible && savedSearchCriteriaSatisfied(input);
    return {
      publicSearchEligible: legacyPublicEligible,
      typesenseEligible: legacyPublicEligible,
      databaseFallbackEligible: legacyPublicEligible,
      savedSearchEligible,
      newListingAlertCandidate: savedSearchEligible,
      historicalPropertyRouteRetained: true,
      eligibilityStateRequiredForPublicDiscovery: false,
      reason: legacyPublicEligible ? 'LEGACY_PUBLIC_CRITERIA_APPLIED' : 'LEGACY_PUBLIC_CRITERIA_BLOCKED',
    };
  }

  const certifiedStateEligible = input.publicSearchEligibility === PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedEligible;
  const certifiedPublicEligible = certifiedStateEligible && legacyPublicEligible;
  const savedSearchEligible = certifiedPublicEligible && savedSearchCriteriaSatisfied(input);

  return {
    publicSearchEligible: certifiedPublicEligible,
    typesenseEligible: certifiedPublicEligible,
    databaseFallbackEligible: certifiedPublicEligible,
    savedSearchEligible,
    newListingAlertCandidate: savedSearchEligible,
    historicalPropertyRouteRetained: true,
    eligibilityStateRequiredForPublicDiscovery: true,
    reason: certifiedPublicEligible ? 'CERTIFIED_ELIGIBLE_PUBLIC_CRITERIA_APPLIED' : blockedCertifiedReason(input),
  };
}

export function evaluatePublicSearchEligibilityActivationReadiness(
  input: PublicSearchEligibilityActivationReadinessInput,
): PublicSearchEligibilityActivationReadiness {
  const reasons: PublicSearchEligibilityActivationReadinessReason[] = [];

  if (!input.providerSnapshotCertifiedComplete) reasons.push('PROVIDER_SNAPSHOT_NOT_CERTIFIED_COMPLETE');
  if (!input.transitionWritesExecuted) reasons.push('TRANSITION_WRITES_NOT_EXECUTED');
  if (!input.absentRowsReconciledOrAcceptedFailClosed) reasons.push('ABSENT_ROWS_NOT_RECONCILED_OR_ACCEPTED_FAIL_CLOSED');
  if (!input.dbEligibilityDistributionCertified) reasons.push('DB_ELIGIBILITY_DISTRIBUTION_NOT_CERTIFIED');
  if (!input.expectedNullPopulationUnderstood) reasons.push('EXPECTED_NULL_POPULATION_NOT_UNDERSTOOD');
  if (input.unresolvedStateDriftFailures > 0) reasons.push('UNRESOLVED_STATE_DRIFT_FAILURES_PRESENT');
  if (!input.searchIndexActivationPlanCertified) reasons.push('SEARCH_INDEX_ACTIVATION_PLAN_NOT_CERTIFIED');
  if (!input.typesenseRebuildReady) reasons.push('TYPESENSE_REBUILD_NOT_READY');
  if (!input.savedSearchBehaviorReady) reasons.push('SAVED_SEARCH_BEHAVIOR_NOT_READY');
  if (!input.alertBehaviorSeparatelyGated) reasons.push('ALERT_BEHAVIOR_NOT_SEPARATELY_GATED');

  const distribution = input.dbDistribution;
  if (
    distribution.nullCount > 0 &&
    distribution.certifiedEligibleCount === 0 &&
    distribution.publicScopeUnverifiedCount === 0 &&
    distribution.certifiedIneligibleCount === 0
  ) {
    reasons.push('DB_REMAINS_ALL_NULL');
  }

  const ready = reasons.length === 0;
  return {
    status: ready ? 'READY_TO_ACTIVATE_CERTIFIED_ELIGIBILITY' : 'NOT_READY_TO_ACTIVATE_CERTIFIED_ELIGIBILITY',
    reasons: ready ? ['READY_ALL_ACTIVATION_PRECONDITIONS_PRESENT'] : reasons,
    zeroSideEffects: {
      databaseWritesPerformed: false,
      providerCallsPerformed: false,
      runtimeActivationPerformed: false,
      typesenseMutationPerformed: false,
      alertMutationPerformed: false,
    },
  };
}

export const PUBLIC_SEARCH_ELIGIBILITY_ACTIVATION_SEQUENCE = [
  'provider rate clearance',
  'scoped ingest recertification',
  'complete public snapshot',
  'deterministic eligibility plan',
  'first bounded write',
  'complete eligibility initialization',
  'resolve unverified population',
  'certify DB distribution',
  'activate shared runtime predicate',
  'rebuild Typesense',
  'certify Search/fallback parity',
  'certify Saved Search predicate',
  'later authorize one-send alert proof',
] as const;

export const PUBLIC_SEARCH_ELIGIBILITY_DEACTIVATION_DESIGN = {
  activationConfigSeparateFromStoredEligibility: true,
  rollbackToLegacyModeWithoutRewritingEligibilityRows: true,
  materialSearchRegressionReturnsToLegacyMode: true,
} as const;
