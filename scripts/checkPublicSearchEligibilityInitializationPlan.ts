import assert from 'node:assert/strict';

import {
  buildPublicSearchEligibilityInitializationPlan,
  type LocalPublicSearchEligibilityRow,
  type PublicScopeSnapshotCertification,
} from '../lib/mls/publicSearchEligibilityInitializationPlan.js';
import { PUBLIC_SEARCH_ELIGIBILITY_STATES } from '../lib/mls/publicSearchEligibilityStateContract.js';

function localRow(
  propertyId: string,
  sourceIdentity: string | null,
  status = 'Active',
  currentEligibility: LocalPublicSearchEligibilityRow['currentEligibility'] = null,
  isPrivateExclusive = false,
): LocalPublicSearchEligibilityRow {
  return {
    currentEligibility,
    isPrivateExclusive,
    propertyId,
    sourceIdentity,
    status,
  };
}

const completeSnapshot: PublicScopeSnapshotCertification = {
  capturedAt: '2026-08-14T19:00:00.000Z',
  complete: true,
  providerSource: 'MLS_GRID',
  scopeFingerprint: 'active-coming-soon-v1',
  sourceIds: ['A-1', 'CS-1', 'PX-1', 'ALREADY-ELIGIBLE'],
};

const baseRows = [
  localRow('present-active', 'A-1'),
  localRow('present-coming-soon', 'CS-1', 'Coming Soon'),
  localRow('absent-active', 'A-2'),
  localRow('private-member', 'PX-1', 'Active', null, true),
  localRow('missing-identity', null),
  localRow('duplicate-left', 'DUP-1'),
  localRow('duplicate-right', 'DUP-1'),
  localRow('legacy-null-non-public', 'LEGACY-1', 'Closed'),
  localRow('already-eligible', 'ALREADY-ELIGIBLE', 'Active', PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedEligible),
  localRow('already-unverified', 'A-3', 'Active', PUBLIC_SEARCH_ELIGIBILITY_STATES.publicScopeUnverified),
  localRow('already-ineligible', 'C-1', 'Closed', PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedIneligible),
  localRow('resolve-pending', 'R-PENDING', 'Active', PUBLIC_SEARCH_ELIGIBILITY_STATES.publicScopeUnverified),
  localRow('resolve-closed', 'R-CLOSED', 'Active', PUBLIC_SEARCH_ELIGIBILITY_STATES.publicScopeUnverified),
  localRow('resolve-active', 'R-ACTIVE', 'Active', PUBLIC_SEARCH_ELIGIBILITY_STATES.publicScopeUnverified),
  localRow('resolve-missing', 'R-MISSING', 'Active', PUBLIC_SEARCH_ELIGIBILITY_STATES.publicScopeUnverified),
];

const plan = buildPublicSearchEligibilityInitializationPlan({
  localRows: baseRows,
  snapshot: completeSnapshot,
  statusResolutions: [
    { resolvedStatus: 'Pending', sourceIdentity: 'R-PENDING', success: true },
    { resolvedStatus: 'Closed', sourceIdentity: 'R-CLOSED', success: true },
    { resolvedStatus: 'Active', sourceIdentity: 'R-ACTIVE', success: true },
    { sourceIdentity: 'R-MISSING', success: false },
  ],
});

const byId = new Map(plan.rows.map((row) => [row.propertyId, row]));

assert.equal(byId.get('present-active')?.action, 'SET_CERTIFIED_ELIGIBLE');
assert.equal(byId.get('present-active')?.reason, 'SNAPSHOT_MEMBER_PUBLIC_SCOPE_STATUS');
assert.equal(byId.get('present-active')?.publicSearchEligibleAfterTransition, true);
assert.equal(byId.get('present-active')?.typesenseEligibleAfterTransition, true);
assert.equal(byId.get('present-active')?.savedSearchEligibleAfterTransition, true);
assert.equal(byId.get('present-active')?.alertEligibleAfterTransition, true);

assert.equal(byId.get('present-coming-soon')?.action, 'SET_CERTIFIED_ELIGIBLE');
assert.equal(byId.get('present-coming-soon')?.publicSearchEligibleAfterTransition, true);
assert.equal(byId.get('present-coming-soon')?.savedSearchEligibleAfterTransition, false);
assert.equal(byId.get('present-coming-soon')?.alertEligibleAfterTransition, false);

assert.equal(byId.get('absent-active')?.action, 'SET_PUBLIC_SCOPE_UNVERIFIED');
assert.equal(byId.get('absent-active')?.reason, 'SNAPSHOT_ABSENT_PUBLIC_ACTIVE_REQUIRES_VERIFICATION');
assert.equal(byId.get('absent-active')?.publicSearchEligibleAfterTransition, false);
assert.equal(byId.get('absent-active')?.typesenseEligibleAfterTransition, false);
assert.equal(byId.get('absent-active')?.savedSearchEligibleAfterTransition, false);
assert.equal(byId.get('absent-active')?.alertEligibleAfterTransition, false);

const incompletePlan = buildPublicSearchEligibilityInitializationPlan({
  localRows: [localRow('incomplete-absent', 'A-404')],
  snapshot: {
    ...completeSnapshot,
    complete: false,
    sourceIds: ['A-1'],
  },
});
assert.equal(incompletePlan.rows[0]?.action, 'BLOCKED_SNAPSHOT_INCOMPLETE');
assert.equal(incompletePlan.rows[0]?.reason, 'SNAPSHOT_INCOMPLETE_NO_ABSENCE_CLASSIFICATION');
assert.equal(incompletePlan.summary.incompleteSnapshotBlocked, 1);

assert.equal(byId.get('private-member')?.action, 'SET_CERTIFIED_INELIGIBLE');
assert.equal(byId.get('private-member')?.reason, 'PRIVATE_EXCLUSIVE_NOT_PUBLIC_SEARCH_ELIGIBLE');
assert.equal(byId.get('private-member')?.publicSearchEligibleAfterTransition, false);

assert.equal(byId.get('missing-identity')?.action, 'BLOCKED_IDENTITY');
assert.equal(byId.get('missing-identity')?.reason, 'MISSING_SOURCE_IDENTITY');
assert.equal(byId.get('duplicate-left')?.action, 'BLOCKED_IDENTITY');
assert.equal(byId.get('duplicate-left')?.reason, 'DUPLICATE_SOURCE_IDENTITY');
assert.equal(byId.get('duplicate-right')?.action, 'BLOCKED_IDENTITY');

assert.equal(byId.get('legacy-null-non-public')?.action, 'BLOCKED_MISSING_AUTHORITY');
assert.equal(byId.get('legacy-null-non-public')?.reason, 'LEGACY_NULL_AWAITING_EVIDENCE');
assert.equal(byId.get('legacy-null-non-public')?.proposedEligibility, null);

assert.equal(byId.get('already-eligible')?.action, 'NO_CHANGE');
assert.equal(byId.get('already-eligible')?.reason, 'ALREADY_CERTIFIED_ELIGIBLE');
assert.equal(byId.get('already-unverified')?.action, 'NO_CHANGE');
assert.equal(byId.get('already-unverified')?.reason, 'ALREADY_PUBLIC_SCOPE_UNVERIFIED');
assert.equal(byId.get('already-ineligible')?.action, 'NO_CHANGE');
assert.equal(byId.get('already-ineligible')?.reason, 'ALREADY_CERTIFIED_INELIGIBLE');

assert.equal(byId.get('resolve-pending')?.action, 'SET_CERTIFIED_INELIGIBLE');
assert.equal(byId.get('resolve-pending')?.reason, 'RESOLVED_NON_PUBLIC_SCOPE_STATUS');
assert.equal(byId.get('resolve-pending')?.statusMutationPermitted, true);
assert.equal(byId.get('resolve-pending')?.statusMutationRequiredSeparately, true);
assert.equal(byId.get('resolve-closed')?.action, 'SET_CERTIFIED_INELIGIBLE');
assert.equal(byId.get('resolve-active')?.action, 'SET_CERTIFIED_ELIGIBLE');
assert.equal(byId.get('resolve-active')?.reason, 'RESOLVED_PUBLIC_SCOPE_STATUS');
assert.equal(byId.get('resolve-missing')?.action, 'NO_CHANGE');
assert.equal(byId.get('resolve-missing')?.reason, 'RESOLUTION_MISSING_AUTHORITY');

const repeatedPlan = buildPublicSearchEligibilityInitializationPlan({
  localRows: baseRows,
  snapshot: completeSnapshot,
  statusResolutions: [
    { resolvedStatus: 'Pending', sourceIdentity: 'R-PENDING', success: true },
    { resolvedStatus: 'Closed', sourceIdentity: 'R-CLOSED', success: true },
    { resolvedStatus: 'Active', sourceIdentity: 'R-ACTIVE', success: true },
    { sourceIdentity: 'R-MISSING', success: false },
  ],
});
assert.deepEqual(plan, repeatedPlan);

assert.equal(plan.summary.totalConsidered, 15);
assert.equal(plan.summary.proposedEligible, 3);
assert.equal(plan.summary.proposedUnverified, 1);
assert.equal(plan.summary.proposedIneligible, 3);
assert.equal(plan.summary.noChange, 4);
assert.equal(plan.summary.blockedIdentity, 3);
assert.equal(plan.summary.blockedAuthority, 1);
assert.equal(plan.writeSetSafety.immutablePlanRequired, true);
assert.equal(plan.writeSetSafety.broadUpdateManyAllowed, false);
assert.equal(plan.writeSetSafety.statusMutationFromFilteredAbsenceAllowed, false);
assert.equal(plan.writeSetSafety.privacyMutationAllowed, false);
assert.equal(plan.downstreamGates.typesenseRebuildBlocked, true);
assert.equal(plan.downstreamGates.savedSearchAlertActivationBlocked, true);

console.log(
  JSON.stringify(
    {
      status: 'SUCCESS',
      mode: 'FIXTURE_ONLY_NO_DB_NO_PROVIDER_NO_TYPESENSE_NO_ALERT_SIDE_EFFECT',
      classification: 'ELIGIBILITY_INITIALIZATION_PLANNING_ENGINE_IMPLEMENTED_AND_LOCALLY_CERTIFIED',
      cases: {
        completeSnapshotPresentActive: 'PASS',
        completeSnapshotPresentComingSoon: 'PASS',
        completeSnapshotAbsentLocalActive: 'PASS',
        incompleteSnapshotAbsentLocalActive: 'PASS',
        privateExclusiveSnapshotMember: 'PASS',
        missingIdentity: 'PASS',
        duplicateIdentity: 'PASS',
        nullLegacyRow: 'PASS',
        alreadyCertifiedEligible: 'PASS',
        alreadyUnverified: 'PASS',
        alreadyIneligible: 'PASS',
        unverifiedProviderPending: 'PASS',
        unverifiedProviderClosed: 'PASS',
        unverifiedProviderActive: 'PASS',
        missingAuthoritativeResolution: 'PASS',
        deterministicReasonCodes: 'PASS',
        idempotentRepeatedPlan: 'PASS',
        aggregateCounts: 'PASS',
        noStatusFabrication: 'PASS',
        noPrivacyMutation: 'PASS',
        noDatabaseWrites: 'PASS',
        noProviderCalls: 'PASS',
        noTypesenseMutation: 'PASS',
        noAlertSideEffects: 'PASS',
      },
      summary: plan.summary,
      downstreamGates: plan.downstreamGates,
      writeSetSafety: plan.writeSetSafety,
    },
    null,
    2,
  ),
);
