import {
  evaluatePublicSearchEligibilityState,
  isPublicScopeStatus,
  PUBLIC_SEARCH_ELIGIBILITY_STATES,
  type PublicSearchEligibilityDecision,
  type PublicSearchEligibilityState,
} from './publicSearchEligibilityStateContract.js';

export type PublicScopeSnapshotCertification = {
  complete: boolean;
  scopeFingerprint: string;
  capturedAt: string;
  providerSource: string;
  sourceIds: readonly string[];
};

export type LocalPublicSearchEligibilityRow = {
  propertyId: string;
  sourceIdentity: string | null | undefined;
  status: string | null | undefined;
  isPrivateExclusive: boolean;
  currentEligibility: PublicSearchEligibilityState | null | undefined;
};

export type AuthoritativeStatusResolution = {
  sourceIdentity: string | null | undefined;
  resolvedStatus?: string | null;
  success: boolean;
  effectiveAt?: string | null;
};

export type PublicSearchEligibilityPlanAction =
  | 'SET_CERTIFIED_ELIGIBLE'
  | 'SET_PUBLIC_SCOPE_UNVERIFIED'
  | 'SET_CERTIFIED_INELIGIBLE'
  | 'NO_CHANGE'
  | 'BLOCKED_IDENTITY'
  | 'BLOCKED_SNAPSHOT_INCOMPLETE'
  | 'BLOCKED_MISSING_AUTHORITY';

export type PublicSearchEligibilityPlanReason =
  | 'SNAPSHOT_MEMBER_PUBLIC_SCOPE_STATUS'
  | 'SNAPSHOT_ABSENT_PUBLIC_ACTIVE_REQUIRES_VERIFICATION'
  | 'SNAPSHOT_INCOMPLETE_NO_ABSENCE_CLASSIFICATION'
  | 'PRIVATE_EXCLUSIVE_NOT_PUBLIC_SEARCH_ELIGIBLE'
  | 'MISSING_SOURCE_IDENTITY'
  | 'DUPLICATE_SOURCE_IDENTITY'
  | 'LEGACY_NULL_AWAITING_EVIDENCE'
  | 'ALREADY_CERTIFIED_ELIGIBLE'
  | 'ALREADY_PUBLIC_SCOPE_UNVERIFIED'
  | 'ALREADY_CERTIFIED_INELIGIBLE'
  | 'RESOLVED_PUBLIC_SCOPE_STATUS'
  | 'RESOLVED_NON_PUBLIC_SCOPE_STATUS'
  | 'RESOLUTION_MISSING_AUTHORITY'
  | 'RESOLUTION_STATUS_AMBIGUOUS'
  | 'LOCAL_STATUS_NOT_PUBLIC_ACTIVE';

export type PublicSearchEligibilityPlanRow = {
  propertyId: string;
  sourceIdentity: string | null;
  currentStatus: string;
  currentEligibility: PublicSearchEligibilityState | null;
  proposedEligibility: PublicSearchEligibilityState | null;
  action: PublicSearchEligibilityPlanAction;
  reason: PublicSearchEligibilityPlanReason;
  statusMutationPermitted: boolean;
  statusMutationRequiredSeparately: boolean;
  publicSearchEligibleAfterTransition: boolean;
  typesenseEligibleAfterTransition: boolean;
  savedSearchEligibleAfterTransition: boolean;
  alertEligibleAfterTransition: boolean;
};

export type PublicSearchEligibilityPlanSummary = {
  totalConsidered: number;
  proposedEligible: number;
  proposedUnverified: number;
  proposedIneligible: number;
  noChange: number;
  blockedIdentity: number;
  blockedAuthority: number;
  incompleteSnapshotBlocked: number;
};

export type PublicSearchEligibilityInitializationPlan = {
  snapshot: {
    complete: boolean;
    scopeFingerprint: string;
    capturedAt: string;
    providerSource: string;
    sourceIdCount: number;
  };
  rows: PublicSearchEligibilityPlanRow[];
  summary: PublicSearchEligibilityPlanSummary;
  writeSetSafety: {
    immutablePlanRequired: true;
    broadUpdateManyAllowed: false;
    statusMutationFromFilteredAbsenceAllowed: false;
    privacyMutationAllowed: false;
  };
  downstreamGates: {
    typesenseRebuildBlocked: true;
    savedSearchAlertActivationBlocked: true;
  };
};

type PlannerInput = {
  snapshot: PublicScopeSnapshotCertification;
  localRows: readonly LocalPublicSearchEligibilityRow[];
  statusResolutions?: readonly AuthoritativeStatusResolution[];
};

const PUBLIC_ACTIVE_LOCAL_STATUS_KEYS = new Set(['active']);

function normalizeIdentity(value: string | null | undefined) {
  const cleaned = value?.trim() ?? '';
  return cleaned || null;
}

function normalizeStatus(value: string | null | undefined) {
  return (value ?? '').trim();
}

function statusKey(value: string | null | undefined) {
  return normalizeStatus(value).replace(/\s+/g, ' ').toLowerCase();
}

function isLocalPublicActiveStatus(status: string | null | undefined) {
  return PUBLIC_ACTIVE_LOCAL_STATUS_KEYS.has(statusKey(status));
}

function hasPublicScopeStatus(status: string | null | undefined) {
  return isPublicScopeStatus(status);
}

function getResolutionKey(resolution: AuthoritativeStatusResolution) {
  return normalizeIdentity(resolution.sourceIdentity);
}

function summarize(rows: PublicSearchEligibilityPlanRow[]): PublicSearchEligibilityPlanSummary {
  return {
    totalConsidered: rows.length,
    proposedEligible: rows.filter((row) => row.action === 'SET_CERTIFIED_ELIGIBLE').length,
    proposedUnverified: rows.filter((row) => row.action === 'SET_PUBLIC_SCOPE_UNVERIFIED').length,
    proposedIneligible: rows.filter((row) => row.action === 'SET_CERTIFIED_INELIGIBLE').length,
    noChange: rows.filter((row) => row.action === 'NO_CHANGE').length,
    blockedIdentity: rows.filter((row) => row.action === 'BLOCKED_IDENTITY').length,
    blockedAuthority: rows.filter((row) => row.action === 'BLOCKED_MISSING_AUTHORITY').length,
    incompleteSnapshotBlocked: rows.filter((row) => row.action === 'BLOCKED_SNAPSHOT_INCOMPLETE').length,
  };
}

function actionForTransition(
  currentEligibility: PublicSearchEligibilityState | null,
  proposedEligibility: PublicSearchEligibilityState,
): PublicSearchEligibilityPlanAction {
  if (currentEligibility === proposedEligibility) return 'NO_CHANGE';
  if (proposedEligibility === PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedEligible) return 'SET_CERTIFIED_ELIGIBLE';
  if (proposedEligibility === PUBLIC_SEARCH_ELIGIBILITY_STATES.publicScopeUnverified) return 'SET_PUBLIC_SCOPE_UNVERIFIED';
  return 'SET_CERTIFIED_INELIGIBLE';
}

function noChangeReason(currentEligibility: PublicSearchEligibilityState): PublicSearchEligibilityPlanReason {
  if (currentEligibility === PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedEligible) return 'ALREADY_CERTIFIED_ELIGIBLE';
  if (currentEligibility === PUBLIC_SEARCH_ELIGIBILITY_STATES.publicScopeUnverified) return 'ALREADY_PUBLIC_SCOPE_UNVERIFIED';
  return 'ALREADY_CERTIFIED_INELIGIBLE';
}

function decisionFor(
  row: LocalPublicSearchEligibilityRow,
  proposedEligibility: PublicSearchEligibilityState,
  authoritativeStatus: string | null | undefined = row.status,
  statusMutationPermitted = false,
): PublicSearchEligibilityDecision {
  return evaluatePublicSearchEligibilityState({
    authoritativeStatus,
    currentEligibility: proposedEligibility,
    isPrivateExclusive: row.isPrivateExclusive,
    sourceIdentity: row.sourceIdentity,
    providerPublicScopeMembership: proposedEligibility === PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedEligible ? 'member' : 'unknown',
    providerSnapshotComplete: true,
    ...(statusMutationPermitted
      ? {
          providerStatusVerification: {
            found: true,
            status: authoritativeStatus,
          },
        }
      : {}),
  });
}

function buildPlanRow(input: {
  row: LocalPublicSearchEligibilityRow;
  sourceIdentity: string | null;
  proposedEligibility: PublicSearchEligibilityState | null;
  action: PublicSearchEligibilityPlanAction;
  reason: PublicSearchEligibilityPlanReason;
  statusMutationPermitted?: boolean;
  authoritativeStatus?: string | null;
}): PublicSearchEligibilityPlanRow {
  const decision = input.proposedEligibility
    ? decisionFor(input.row, input.proposedEligibility, input.authoritativeStatus, input.statusMutationPermitted ?? false)
    : null;

  return {
    propertyId: input.row.propertyId,
    sourceIdentity: input.sourceIdentity,
    currentStatus: normalizeStatus(input.row.status),
    currentEligibility: input.row.currentEligibility ?? null,
    proposedEligibility: input.proposedEligibility,
    action: input.action,
    reason: input.reason,
    statusMutationPermitted: input.statusMutationPermitted ?? false,
    statusMutationRequiredSeparately: input.statusMutationPermitted ?? false,
    publicSearchEligibleAfterTransition: decision?.publicSearchEligible ?? false,
    typesenseEligibleAfterTransition: decision?.typesenseEligible ?? false,
    savedSearchEligibleAfterTransition: decision?.savedSearchEligible ?? false,
    alertEligibleAfterTransition: decision?.newListingAlertEligible ?? false,
  };
}

function getIdentityCounts(rows: readonly LocalPublicSearchEligibilityRow[]) {
  const counts = new Map<string, number>();

  for (const row of rows) {
    const sourceIdentity = normalizeIdentity(row.sourceIdentity);
    if (!sourceIdentity) continue;
    counts.set(sourceIdentity, (counts.get(sourceIdentity) ?? 0) + 1);
  }

  return counts;
}

export function buildPublicSearchEligibilityInitializationPlan(
  input: PlannerInput,
): PublicSearchEligibilityInitializationPlan {
  const snapshotSourceIds = new Set(input.snapshot.sourceIds.map(normalizeIdentity).filter((id): id is string => Boolean(id)));
  const identityCounts = getIdentityCounts(input.localRows);
  const resolutions = new Map(
    (input.statusResolutions ?? [])
      .map((resolution) => [getResolutionKey(resolution), resolution] as const)
      .filter((entry): entry is [string, AuthoritativeStatusResolution] => Boolean(entry[0])),
  );

  const rows = input.localRows.map((row) => {
    const sourceIdentity = normalizeIdentity(row.sourceIdentity);
    const currentEligibility = row.currentEligibility ?? null;

    if (!sourceIdentity) {
      return buildPlanRow({
        row,
        sourceIdentity,
        proposedEligibility: PUBLIC_SEARCH_ELIGIBILITY_STATES.publicScopeUnverified,
        action: 'BLOCKED_IDENTITY',
        reason: 'MISSING_SOURCE_IDENTITY',
      });
    }

    if ((identityCounts.get(sourceIdentity) ?? 0) > 1) {
      return buildPlanRow({
        row,
        sourceIdentity,
        proposedEligibility: PUBLIC_SEARCH_ELIGIBILITY_STATES.publicScopeUnverified,
        action: 'BLOCKED_IDENTITY',
        reason: 'DUPLICATE_SOURCE_IDENTITY',
      });
    }

    const resolution = resolutions.get(sourceIdentity);
    if (resolution) {
      if (!resolution.success) {
        return buildPlanRow({
          row,
          sourceIdentity,
          proposedEligibility: PUBLIC_SEARCH_ELIGIBILITY_STATES.publicScopeUnverified,
          action: actionForTransition(currentEligibility, PUBLIC_SEARCH_ELIGIBILITY_STATES.publicScopeUnverified),
          reason: 'RESOLUTION_MISSING_AUTHORITY',
        });
      }

      if (!normalizeStatus(resolution.resolvedStatus)) {
        return buildPlanRow({
          row,
          sourceIdentity,
          proposedEligibility: PUBLIC_SEARCH_ELIGIBILITY_STATES.publicScopeUnverified,
          action: actionForTransition(currentEligibility, PUBLIC_SEARCH_ELIGIBILITY_STATES.publicScopeUnverified),
          reason: 'RESOLUTION_STATUS_AMBIGUOUS',
        });
      }

      const proposedEligibility = hasPublicScopeStatus(resolution.resolvedStatus)
        ? PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedEligible
        : PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedIneligible;
      const transitionAction = actionForTransition(currentEligibility, proposedEligibility);

      return buildPlanRow({
        row,
        sourceIdentity,
        proposedEligibility,
        action: transitionAction,
        reason:
          transitionAction === 'NO_CHANGE'
            ? noChangeReason(proposedEligibility)
            : hasPublicScopeStatus(resolution.resolvedStatus)
              ? 'RESOLVED_PUBLIC_SCOPE_STATUS'
              : 'RESOLVED_NON_PUBLIC_SCOPE_STATUS',
        statusMutationPermitted: true,
        authoritativeStatus: resolution.resolvedStatus,
      });
    }

    if (!input.snapshot.complete) {
      return buildPlanRow({
        row,
        sourceIdentity,
        proposedEligibility: PUBLIC_SEARCH_ELIGIBILITY_STATES.publicScopeUnverified,
        action: 'BLOCKED_SNAPSHOT_INCOMPLETE',
        reason: 'SNAPSHOT_INCOMPLETE_NO_ABSENCE_CLASSIFICATION',
      });
    }

    if (row.isPrivateExclusive) {
      const proposedEligibility = PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedIneligible;
      const transitionAction = actionForTransition(currentEligibility, proposedEligibility);
      return buildPlanRow({
        row,
        sourceIdentity,
        proposedEligibility,
        action: transitionAction,
        reason: transitionAction === 'NO_CHANGE' ? noChangeReason(proposedEligibility) : 'PRIVATE_EXCLUSIVE_NOT_PUBLIC_SEARCH_ELIGIBLE',
      });
    }

    if (snapshotSourceIds.has(sourceIdentity) && hasPublicScopeStatus(row.status)) {
      const proposedEligibility = PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedEligible;
      const transitionAction = actionForTransition(currentEligibility, proposedEligibility);
      return buildPlanRow({
        row,
        sourceIdentity,
        proposedEligibility,
        action: transitionAction,
        reason: transitionAction === 'NO_CHANGE' ? noChangeReason(proposedEligibility) : 'SNAPSHOT_MEMBER_PUBLIC_SCOPE_STATUS',
      });
    }

    if (isLocalPublicActiveStatus(row.status)) {
      const proposedEligibility = PUBLIC_SEARCH_ELIGIBILITY_STATES.publicScopeUnverified;
      const transitionAction = actionForTransition(currentEligibility, proposedEligibility);
      return buildPlanRow({
        row,
        sourceIdentity,
        proposedEligibility,
        action: transitionAction,
        reason:
          transitionAction === 'NO_CHANGE'
            ? noChangeReason(proposedEligibility)
            : 'SNAPSHOT_ABSENT_PUBLIC_ACTIVE_REQUIRES_VERIFICATION',
      });
    }

    if (currentEligibility) {
      return buildPlanRow({
        row,
        sourceIdentity,
        proposedEligibility: currentEligibility,
        action: 'NO_CHANGE',
        reason: noChangeReason(currentEligibility),
      });
    }

    return buildPlanRow({
      row,
      sourceIdentity,
      proposedEligibility: null,
      action: 'BLOCKED_MISSING_AUTHORITY',
      reason: 'LEGACY_NULL_AWAITING_EVIDENCE',
    });
  });

  return {
    snapshot: {
      complete: input.snapshot.complete,
      scopeFingerprint: input.snapshot.scopeFingerprint,
      capturedAt: input.snapshot.capturedAt,
      providerSource: input.snapshot.providerSource,
      sourceIdCount: snapshotSourceIds.size,
    },
    rows,
    summary: summarize(rows),
    writeSetSafety: {
      immutablePlanRequired: true,
      broadUpdateManyAllowed: false,
      statusMutationFromFilteredAbsenceAllowed: false,
      privacyMutationAllowed: false,
    },
    downstreamGates: {
      typesenseRebuildBlocked: true,
      savedSearchAlertActivationBlocked: true,
    },
  };
}
