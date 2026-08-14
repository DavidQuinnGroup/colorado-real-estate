export const PUBLIC_SEARCH_ELIGIBILITY_STATES = {
  certifiedEligible: 'CERTIFIED_ELIGIBLE',
  publicScopeUnverified: 'PUBLIC_SCOPE_UNVERIFIED',
  certifiedIneligible: 'CERTIFIED_INELIGIBLE',
} as const;

export type PublicSearchEligibilityState =
  (typeof PUBLIC_SEARCH_ELIGIBILITY_STATES)[keyof typeof PUBLIC_SEARCH_ELIGIBILITY_STATES];

export type ProviderPublicScopeMembership = 'member' | 'absent' | 'unknown';

export type ProviderStatusVerification = {
  found: boolean;
  status?: string | null;
};

export type PublicSearchEligibilityReason =
  | 'CERTIFIED_PUBLIC_SCOPE_MEMBER'
  | 'CERTIFIED_PUBLIC_STATUS_VERIFICATION'
  | 'PUBLIC_SCOPE_ABSENT_REQUIRES_STATUS_VERIFICATION'
  | 'CERTIFIED_OUT_OF_PUBLIC_SCOPE'
  | 'PUBLIC_SCOPE_UNVERIFIED'
  | 'LEGACY_ELIGIBILITY_UNSET'
  | 'PRIVATE_EXCLUSIVE_NOT_PUBLIC_SEARCH_ELIGIBLE'
  | 'MISSING_SOURCE_IDENTITY'
  | 'DUPLICATE_SOURCE_IDENTITY'
  | 'PROVIDER_SNAPSHOT_INCOMPLETE'
  | 'PROVIDER_RECORD_UNAVAILABLE'
  | 'PROVIDER_STATUS_AMBIGUOUS'
  | 'STATUS_NOT_PUBLIC_SEARCH_ELIGIBLE';

export type PublicSearchEligibilityInput = {
  currentEligibility?: PublicSearchEligibilityState | null;
  authoritativeStatus?: string | null;
  providerPublicScopeMembership?: ProviderPublicScopeMembership;
  providerSnapshotComplete?: boolean;
  providerStatusVerification?: ProviderStatusVerification | null;
  isPrivateExclusive: boolean;
  sourceIdentity?: string | null;
  duplicateSourceIdentity?: boolean;
};

export type PublicSearchEligibilityDecision = {
  state: PublicSearchEligibilityState;
  publicSearchEligible: boolean;
  typesenseEligible: boolean;
  savedSearchEligible: boolean;
  newListingAlertEligible: boolean;
  historicalPropertyRecordRetained: boolean;
  authoritativeStatusMutationPermitted: boolean;
  reason: PublicSearchEligibilityReason;
};

const PUBLIC_SCOPE_STATUS_KEYS = new Set(['active', 'coming soon']);
const ACTIVE_STATUS_KEY = 'active';

export function normalizePublicSearchEligibilityStatus(value: string | null | undefined) {
  return (value ?? '').trim();
}

function statusKey(value: string | null | undefined) {
  return normalizePublicSearchEligibilityStatus(value).replace(/\s+/g, ' ').toLowerCase();
}

function hasSourceIdentity(input: PublicSearchEligibilityInput) {
  return Boolean(input.sourceIdentity?.trim());
}

export function isPublicScopeStatus(status: string | null | undefined) {
  return PUBLIC_SCOPE_STATUS_KEYS.has(statusKey(status));
}

function isActiveStatus(status: string | null | undefined) {
  return statusKey(status) === ACTIVE_STATUS_KEY;
}

function baseDecision(
  input: PublicSearchEligibilityInput,
  state: PublicSearchEligibilityState,
  reason: PublicSearchEligibilityReason,
  authoritativeStatusMutationPermitted = false,
): PublicSearchEligibilityDecision {
  const searchEligible =
    state === PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedEligible &&
    input.isPrivateExclusive === false &&
    isPublicScopeStatus(input.authoritativeStatus);
  const savedSearchEligible = searchEligible && isActiveStatus(input.authoritativeStatus);

  return {
    state,
    publicSearchEligible: searchEligible,
    typesenseEligible: searchEligible,
    savedSearchEligible,
    newListingAlertEligible: savedSearchEligible,
    historicalPropertyRecordRetained: true,
    authoritativeStatusMutationPermitted,
    reason,
  };
}

export function evaluatePublicSearchEligibilityState(
  input: PublicSearchEligibilityInput,
): PublicSearchEligibilityDecision {
  if (input.isPrivateExclusive) {
    return baseDecision(
      input,
      PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedIneligible,
      'PRIVATE_EXCLUSIVE_NOT_PUBLIC_SEARCH_ELIGIBLE',
    );
  }

  if (!hasSourceIdentity(input)) {
    return baseDecision(input, PUBLIC_SEARCH_ELIGIBILITY_STATES.publicScopeUnverified, 'MISSING_SOURCE_IDENTITY');
  }

  if (input.duplicateSourceIdentity) {
    return baseDecision(input, PUBLIC_SEARCH_ELIGIBILITY_STATES.publicScopeUnverified, 'DUPLICATE_SOURCE_IDENTITY');
  }

  if (input.providerStatusVerification) {
    if (!input.providerStatusVerification.found) {
      return baseDecision(input, PUBLIC_SEARCH_ELIGIBILITY_STATES.publicScopeUnverified, 'PROVIDER_RECORD_UNAVAILABLE');
    }

    if (!normalizePublicSearchEligibilityStatus(input.providerStatusVerification.status)) {
      return baseDecision(input, PUBLIC_SEARCH_ELIGIBILITY_STATES.publicScopeUnverified, 'PROVIDER_STATUS_AMBIGUOUS');
    }

    const verifiedInput = {
      ...input,
      authoritativeStatus: input.providerStatusVerification.status,
    };

    if (isPublicScopeStatus(input.providerStatusVerification.status)) {
      return baseDecision(
        verifiedInput,
        PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedEligible,
        'CERTIFIED_PUBLIC_STATUS_VERIFICATION',
        true,
      );
    }

    return baseDecision(
      verifiedInput,
      PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedIneligible,
      'CERTIFIED_OUT_OF_PUBLIC_SCOPE',
      true,
    );
  }

  if (input.providerSnapshotComplete === false) {
    return baseDecision(input, PUBLIC_SEARCH_ELIGIBILITY_STATES.publicScopeUnverified, 'PROVIDER_SNAPSHOT_INCOMPLETE');
  }

  if (input.providerPublicScopeMembership === 'member' && isPublicScopeStatus(input.authoritativeStatus)) {
    return baseDecision(input, PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedEligible, 'CERTIFIED_PUBLIC_SCOPE_MEMBER');
  }

  if (input.providerPublicScopeMembership === 'absent' && input.providerSnapshotComplete === true) {
    return baseDecision(
      input,
      PUBLIC_SEARCH_ELIGIBILITY_STATES.publicScopeUnverified,
      'PUBLIC_SCOPE_ABSENT_REQUIRES_STATUS_VERIFICATION',
    );
  }

  if (input.currentEligibility === PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedEligible) {
    return baseDecision(input, PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedEligible, 'CERTIFIED_PUBLIC_SCOPE_MEMBER');
  }

  if (input.currentEligibility === PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedIneligible) {
    return baseDecision(input, PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedIneligible, 'CERTIFIED_OUT_OF_PUBLIC_SCOPE');
  }

  if (input.currentEligibility === PUBLIC_SEARCH_ELIGIBILITY_STATES.publicScopeUnverified) {
    return baseDecision(input, PUBLIC_SEARCH_ELIGIBILITY_STATES.publicScopeUnverified, 'PUBLIC_SCOPE_UNVERIFIED');
  }

  return baseDecision(input, PUBLIC_SEARCH_ELIGIBILITY_STATES.publicScopeUnverified, 'LEGACY_ELIGIBILITY_UNSET');
}
