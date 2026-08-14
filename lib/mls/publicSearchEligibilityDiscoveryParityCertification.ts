import {
  evaluatePublicSearchEligibilityRuntime,
  type PublicSearchEligibilityRuntimeInput,
  type PublicSearchEligibilityRuntimeDecision,
} from './publicSearchEligibilityRuntimeContract.js';

export const PUBLIC_SEARCH_ELIGIBILITY_DISCOVERY_PARITY_CERTIFICATION_STATUS =
  'PUBLIC_SEARCH_ELIGIBILITY_DISCOVERY_PARITY_CERTIFICATION_ARCHITECTURE';

export type PublicSearchEligibilityDiscoveryParityClassification = 'PARITY' | 'DIVERGENCE' | 'INSUFFICIENT_EVIDENCE';

export type PublicSearchEligibilityDiscoverySurface =
  | 'PUBLIC_SEARCH_DISCOVERY'
  | 'TYPESENSE_INDEX_INCLUSION'
  | 'DATABASE_SEARCH_FALLBACK'
  | 'SAVED_SEARCH'
  | 'NEW_LISTING_ALERT';

export type PublicSearchEligibilityPlannedDiscoverySemantics = {
  publicSearchDiscoveryEligible: boolean | null;
  typesenseIndexInclusionEligible: boolean | null;
  databaseSearchFallbackEligible: boolean | null;
  savedSearchEligible: boolean | null;
  newListingAlertCandidate: boolean | null;
};

export type PublicSearchEligibilityDiscoveryParityCertificationInput = {
  runtimeInput: PublicSearchEligibilityRuntimeInput;
  plannedSemantics: PublicSearchEligibilityPlannedDiscoverySemantics;
  evidence: {
    publicSearchPlanSupplied: boolean;
    typesensePlanSupplied: boolean;
    databaseFallbackPlanSupplied: boolean;
    savedSearchPlanSupplied: boolean;
    newListingPlanSupplied: boolean;
  };
  certificationOnlyBoundary: {
    runtimeActivationPerformed: false;
    searchMutationPerformed: false;
    typesenseMutationPerformed: false;
    databaseAccessPerformed: false;
    savedSearchMutationPerformed: false;
    alertEventCreated: false;
    alertQueueCreated: false;
    emailSent: false;
    providerCallPerformed: false;
  };
};

export type PublicSearchEligibilityDiscoveryParityMismatch = {
  surface: PublicSearchEligibilityDiscoverySurface;
  expected: boolean;
  planned: boolean | null;
  reason: PublicSearchEligibilityDiscoveryParityReason;
};

export type PublicSearchEligibilityDiscoveryParityReason =
  | 'PARITY_WITH_CANONICAL_PUBLIC_DISCOVERY_PREDICATE'
  | 'MISSING_PUBLIC_SEARCH_PLAN'
  | 'MISSING_TYPESENSE_PLAN'
  | 'MISSING_DATABASE_FALLBACK_PLAN'
  | 'MISSING_SAVED_SEARCH_PLAN'
  | 'MISSING_NEW_LISTING_PLAN'
  | 'PUBLIC_SEARCH_DIVERGES_FROM_CANONICAL_PREDICATE'
  | 'TYPESENSE_DIVERGES_FROM_CANONICAL_PREDICATE'
  | 'DATABASE_FALLBACK_DIVERGES_FROM_CANONICAL_PREDICATE'
  | 'SAVED_SEARCH_DIVERGES_FROM_CANONICAL_SAVED_SEARCH_PREDICATE'
  | 'NEW_LISTING_DIVERGES_FROM_CANONICAL_ALERT_PREDICATE'
  | 'RUNTIME_ACTIVATION_ATTEMPTED'
  | 'SEARCH_MUTATION_ATTEMPTED'
  | 'TYPESENSE_MUTATION_ATTEMPTED'
  | 'DATABASE_ACCESS_ATTEMPTED'
  | 'SAVED_SEARCH_MUTATION_ATTEMPTED'
  | 'ALERT_EVENT_ATTEMPTED'
  | 'ALERT_QUEUE_ATTEMPTED'
  | 'EMAIL_ATTEMPTED'
  | 'PROVIDER_CALL_ATTEMPTED';

export type PublicSearchEligibilityDiscoveryParityCertification = {
  status: typeof PUBLIC_SEARCH_ELIGIBILITY_DISCOVERY_PARITY_CERTIFICATION_STATUS;
  classification: PublicSearchEligibilityDiscoveryParityClassification;
  reasons: readonly PublicSearchEligibilityDiscoveryParityReason[];
  canonicalDecision: PublicSearchEligibilityRuntimeDecision;
  mismatches: readonly PublicSearchEligibilityDiscoveryParityMismatch[];
  sharedPredicate: {
    publicSearchDiscoveryEligible: boolean;
    typesenseIndexInclusionEligible: boolean;
    databaseSearchFallbackEligible: boolean;
  };
  savedSearchPredicate: {
    savedSearchEligible: boolean;
    newListingAlertCandidate: boolean;
    requiresCanonicalPublicDiscoveryPredicate: true;
    requiresExactActiveStatus: true;
    requiresSourceFreshness: true;
    requiresSavedSearchMatch: true;
    requiresConsent: true;
    requiresNoDuplicateAlertEvent: true;
  };
  zeroSideEffects: PublicSearchEligibilityDiscoveryParityCertificationInput['certificationOnlyBoundary'];
};

function plannedValueMissing(value: boolean | null) {
  return value === null;
}

function addMissingEvidenceReasons(
  input: PublicSearchEligibilityDiscoveryParityCertificationInput,
  reasons: PublicSearchEligibilityDiscoveryParityReason[],
) {
  if (!input.evidence.publicSearchPlanSupplied || plannedValueMissing(input.plannedSemantics.publicSearchDiscoveryEligible)) {
    reasons.push('MISSING_PUBLIC_SEARCH_PLAN');
  }
  if (!input.evidence.typesensePlanSupplied || plannedValueMissing(input.plannedSemantics.typesenseIndexInclusionEligible)) {
    reasons.push('MISSING_TYPESENSE_PLAN');
  }
  if (!input.evidence.databaseFallbackPlanSupplied || plannedValueMissing(input.plannedSemantics.databaseSearchFallbackEligible)) {
    reasons.push('MISSING_DATABASE_FALLBACK_PLAN');
  }
  if (!input.evidence.savedSearchPlanSupplied || plannedValueMissing(input.plannedSemantics.savedSearchEligible)) {
    reasons.push('MISSING_SAVED_SEARCH_PLAN');
  }
  if (!input.evidence.newListingPlanSupplied || plannedValueMissing(input.plannedSemantics.newListingAlertCandidate)) {
    reasons.push('MISSING_NEW_LISTING_PLAN');
  }
}

function addBoundaryReasons(
  input: PublicSearchEligibilityDiscoveryParityCertificationInput,
  reasons: PublicSearchEligibilityDiscoveryParityReason[],
) {
  if (input.certificationOnlyBoundary.runtimeActivationPerformed) reasons.push('RUNTIME_ACTIVATION_ATTEMPTED');
  if (input.certificationOnlyBoundary.searchMutationPerformed) reasons.push('SEARCH_MUTATION_ATTEMPTED');
  if (input.certificationOnlyBoundary.typesenseMutationPerformed) reasons.push('TYPESENSE_MUTATION_ATTEMPTED');
  if (input.certificationOnlyBoundary.databaseAccessPerformed) reasons.push('DATABASE_ACCESS_ATTEMPTED');
  if (input.certificationOnlyBoundary.savedSearchMutationPerformed) reasons.push('SAVED_SEARCH_MUTATION_ATTEMPTED');
  if (input.certificationOnlyBoundary.alertEventCreated) reasons.push('ALERT_EVENT_ATTEMPTED');
  if (input.certificationOnlyBoundary.alertQueueCreated) reasons.push('ALERT_QUEUE_ATTEMPTED');
  if (input.certificationOnlyBoundary.emailSent) reasons.push('EMAIL_ATTEMPTED');
  if (input.certificationOnlyBoundary.providerCallPerformed) reasons.push('PROVIDER_CALL_ATTEMPTED');
}

function mismatch(
  surface: PublicSearchEligibilityDiscoverySurface,
  expected: boolean,
  planned: boolean | null,
  reason: PublicSearchEligibilityDiscoveryParityReason,
): PublicSearchEligibilityDiscoveryParityMismatch | null {
  return planned !== null && planned !== expected ? { expected, planned, reason, surface } : null;
}

function compactMismatches(
  values: Array<PublicSearchEligibilityDiscoveryParityMismatch | null>,
): readonly PublicSearchEligibilityDiscoveryParityMismatch[] {
  return Object.freeze(values.filter((value): value is PublicSearchEligibilityDiscoveryParityMismatch => Boolean(value)));
}

export function certifyPublicSearchEligibilityDiscoveryParity(
  input: PublicSearchEligibilityDiscoveryParityCertificationInput,
): PublicSearchEligibilityDiscoveryParityCertification {
  const canonicalDecision = evaluatePublicSearchEligibilityRuntime(input.runtimeInput);
  const reasons: PublicSearchEligibilityDiscoveryParityReason[] = [];
  addMissingEvidenceReasons(input, reasons);
  addBoundaryReasons(input, reasons);

  const mismatches = compactMismatches([
    mismatch(
      'PUBLIC_SEARCH_DISCOVERY',
      canonicalDecision.publicSearchEligible,
      input.plannedSemantics.publicSearchDiscoveryEligible,
      'PUBLIC_SEARCH_DIVERGES_FROM_CANONICAL_PREDICATE',
    ),
    mismatch(
      'TYPESENSE_INDEX_INCLUSION',
      canonicalDecision.publicSearchEligible,
      input.plannedSemantics.typesenseIndexInclusionEligible,
      'TYPESENSE_DIVERGES_FROM_CANONICAL_PREDICATE',
    ),
    mismatch(
      'DATABASE_SEARCH_FALLBACK',
      canonicalDecision.publicSearchEligible,
      input.plannedSemantics.databaseSearchFallbackEligible,
      'DATABASE_FALLBACK_DIVERGES_FROM_CANONICAL_PREDICATE',
    ),
    mismatch(
      'SAVED_SEARCH',
      canonicalDecision.savedSearchEligible,
      input.plannedSemantics.savedSearchEligible,
      'SAVED_SEARCH_DIVERGES_FROM_CANONICAL_SAVED_SEARCH_PREDICATE',
    ),
    mismatch(
      'NEW_LISTING_ALERT',
      canonicalDecision.newListingAlertCandidate,
      input.plannedSemantics.newListingAlertCandidate,
      'NEW_LISTING_DIVERGES_FROM_CANONICAL_ALERT_PREDICATE',
    ),
  ]);

  reasons.push(...mismatches.map((item) => item.reason));

  const hasInsufficientEvidence = reasons.some((reason) => reason.startsWith('MISSING_'));
  const hasDivergence = mismatches.length > 0 || reasons.some((reason) => reason.endsWith('_ATTEMPTED'));
  const classification: PublicSearchEligibilityDiscoveryParityClassification = hasInsufficientEvidence
    ? 'INSUFFICIENT_EVIDENCE'
    : hasDivergence
      ? 'DIVERGENCE'
      : 'PARITY';

  return Object.freeze({
    status: PUBLIC_SEARCH_ELIGIBILITY_DISCOVERY_PARITY_CERTIFICATION_STATUS,
    classification,
    reasons: Object.freeze(
      reasons.length > 0
        ? reasons
        : (['PARITY_WITH_CANONICAL_PUBLIC_DISCOVERY_PREDICATE'] satisfies PublicSearchEligibilityDiscoveryParityReason[]),
    ),
    canonicalDecision,
    mismatches,
    sharedPredicate: {
      publicSearchDiscoveryEligible: canonicalDecision.publicSearchEligible,
      typesenseIndexInclusionEligible: canonicalDecision.publicSearchEligible,
      databaseSearchFallbackEligible: canonicalDecision.publicSearchEligible,
    },
    savedSearchPredicate: {
      savedSearchEligible: canonicalDecision.savedSearchEligible,
      newListingAlertCandidate: canonicalDecision.newListingAlertCandidate,
      requiresCanonicalPublicDiscoveryPredicate: true as const,
      requiresExactActiveStatus: true as const,
      requiresSourceFreshness: true as const,
      requiresSavedSearchMatch: true as const,
      requiresConsent: true as const,
      requiresNoDuplicateAlertEvent: true as const,
    },
    zeroSideEffects: input.certificationOnlyBoundary,
  });
}
