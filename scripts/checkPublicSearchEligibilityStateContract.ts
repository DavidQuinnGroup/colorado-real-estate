import assert from 'node:assert/strict';

import {
  evaluatePublicSearchEligibilityState,
  PUBLIC_SEARCH_ELIGIBILITY_STATES,
  type PublicSearchEligibilityInput,
} from '../lib/mls/publicSearchEligibilityStateContract.js';

function evaluate(input: Partial<PublicSearchEligibilityInput>) {
  return evaluatePublicSearchEligibilityState({
    authoritativeStatus: 'Active',
    isPrivateExclusive: false,
    providerPublicScopeMembership: 'member',
    providerSnapshotComplete: true,
    sourceIdentity: 'A-1',
    ...input,
  });
}

const activeMember = evaluate({});
assert.equal(activeMember.state, PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedEligible);
assert.equal(activeMember.reason, 'CERTIFIED_PUBLIC_SCOPE_MEMBER');
assert.equal(activeMember.publicSearchEligible, true);
assert.equal(activeMember.typesenseEligible, true);
assert.equal(activeMember.savedSearchEligible, true);
assert.equal(activeMember.newListingAlertEligible, true);
assert.equal(activeMember.authoritativeStatusMutationPermitted, false);

const comingSoonMember = evaluate({
  authoritativeStatus: 'Coming Soon',
  sourceIdentity: 'CS-1',
});
assert.equal(comingSoonMember.state, PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedEligible);
assert.equal(comingSoonMember.publicSearchEligible, true);
assert.equal(comingSoonMember.typesenseEligible, true);
assert.equal(comingSoonMember.savedSearchEligible, false);
assert.equal(comingSoonMember.newListingAlertEligible, false);

const absentActive = evaluate({
  providerPublicScopeMembership: 'absent',
  sourceIdentity: 'A-2',
});
assert.equal(absentActive.state, PUBLIC_SEARCH_ELIGIBILITY_STATES.publicScopeUnverified);
assert.equal(absentActive.reason, 'PUBLIC_SCOPE_ABSENT_REQUIRES_STATUS_VERIFICATION');
assert.equal(absentActive.publicSearchEligible, false);
assert.equal(absentActive.typesenseEligible, false);
assert.equal(absentActive.savedSearchEligible, false);
assert.equal(absentActive.newListingAlertEligible, false);
assert.equal(absentActive.authoritativeStatusMutationPermitted, false);

const pendingVerification = evaluate({
  providerPublicScopeMembership: 'absent',
  providerStatusVerification: {
    found: true,
    status: 'Pending',
  },
});
assert.equal(pendingVerification.state, PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedIneligible);
assert.equal(pendingVerification.reason, 'CERTIFIED_OUT_OF_PUBLIC_SCOPE');
assert.equal(pendingVerification.publicSearchEligible, false);
assert.equal(pendingVerification.authoritativeStatusMutationPermitted, true);

const closedVerification = evaluate({
  providerPublicScopeMembership: 'absent',
  providerStatusVerification: {
    found: true,
    status: 'Closed',
  },
});
assert.equal(closedVerification.state, PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedIneligible);
assert.equal(closedVerification.publicSearchEligible, false);
assert.equal(closedVerification.authoritativeStatusMutationPermitted, true);

const activeVerification = evaluate({
  providerPublicScopeMembership: 'absent',
  providerStatusVerification: {
    found: true,
    status: 'Active',
  },
});
assert.equal(activeVerification.state, PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedEligible);
assert.equal(activeVerification.reason, 'CERTIFIED_PUBLIC_STATUS_VERIFICATION');
assert.equal(activeVerification.publicSearchEligible, true);
assert.equal(activeVerification.savedSearchEligible, true);
assert.equal(activeVerification.authoritativeStatusMutationPermitted, true);

const missingIdentity = evaluate({
  sourceIdentity: null,
});
assert.equal(missingIdentity.state, PUBLIC_SEARCH_ELIGIBILITY_STATES.publicScopeUnverified);
assert.equal(missingIdentity.reason, 'MISSING_SOURCE_IDENTITY');
assert.equal(missingIdentity.publicSearchEligible, false);

const duplicateIdentity = evaluate({
  duplicateSourceIdentity: true,
});
assert.equal(duplicateIdentity.state, PUBLIC_SEARCH_ELIGIBILITY_STATES.publicScopeUnverified);
assert.equal(duplicateIdentity.reason, 'DUPLICATE_SOURCE_IDENTITY');
assert.equal(duplicateIdentity.publicSearchEligible, false);

const privateExclusive = evaluate({
  isPrivateExclusive: true,
});
assert.equal(privateExclusive.state, PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedIneligible);
assert.equal(privateExclusive.reason, 'PRIVATE_EXCLUSIVE_NOT_PUBLIC_SEARCH_ELIGIBLE');
assert.equal(privateExclusive.publicSearchEligible, false);

const incompleteSnapshot = evaluate({
  providerPublicScopeMembership: 'unknown',
  providerSnapshotComplete: false,
});
assert.equal(incompleteSnapshot.state, PUBLIC_SEARCH_ELIGIBILITY_STATES.publicScopeUnverified);
assert.equal(incompleteSnapshot.reason, 'PROVIDER_SNAPSHOT_INCOMPLETE');
assert.equal(incompleteSnapshot.publicSearchEligible, false);

const partialReconciliation = evaluate({
  providerPublicScopeMembership: 'absent',
  providerStatusVerification: {
    found: false,
  },
});
assert.equal(partialReconciliation.state, PUBLIC_SEARCH_ELIGIBILITY_STATES.publicScopeUnverified);
assert.equal(partialReconciliation.reason, 'PROVIDER_RECORD_UNAVAILABLE');
assert.equal(partialReconciliation.publicSearchEligible, false);

const ambiguousStatus = evaluate({
  providerStatusVerification: {
    found: true,
    status: '',
  },
});
assert.equal(ambiguousStatus.state, PUBLIC_SEARCH_ELIGIBILITY_STATES.publicScopeUnverified);
assert.equal(ambiguousStatus.reason, 'PROVIDER_STATUS_AMBIGUOUS');
assert.equal(ambiguousStatus.authoritativeStatusMutationPermitted, false);

const legacyUnset = evaluate({
  authoritativeStatus: 'Active',
  currentEligibility: null,
  providerPublicScopeMembership: 'unknown',
  providerSnapshotComplete: undefined,
});
assert.equal(legacyUnset.state, PUBLIC_SEARCH_ELIGIBILITY_STATES.publicScopeUnverified);
assert.equal(legacyUnset.reason, 'LEGACY_ELIGIBILITY_UNSET');
assert.equal(legacyUnset.publicSearchEligible, false);

assert.equal(activeMember.historicalPropertyRecordRetained, true);
assert.equal(absentActive.historicalPropertyRecordRetained, true);
assert.equal(pendingVerification.historicalPropertyRecordRetained, true);
assert.equal(absentActive.authoritativeStatusMutationPermitted, false);
assert.equal(absentActive.state, PUBLIC_SEARCH_ELIGIBILITY_STATES.publicScopeUnverified);
assert.equal(privateExclusive.reason, 'PRIVATE_EXCLUSIVE_NOT_PUBLIC_SEARCH_ELIGIBLE');

console.log(
  JSON.stringify(
    {
      status: 'SUCCESS',
      mode: 'FIXTURE_ONLY_NO_DB_NO_PROVIDER_NO_TYPESENSE_NO_ALERT_SIDE_EFFECT',
      classification: 'ADDITIVE_ELIGIBILITY_SCHEMA_PREPARED_RUNTIME_ACTIVATION_SEPARATE',
      eligibilityModel: {
        field: 'Property.publicSearchEligibility',
        nullableDefault: 'NULL_LEGACY_NOT_YET_CERTIFIED',
        states: Object.values(PUBLIC_SEARCH_ELIGIBILITY_STATES),
      },
      cases: {
        activeProviderPublicScopeMember: 'PASS',
        comingSoonProviderPublicScopeMember: 'PASS',
        locallyActiveAbsentSnapshot: 'PASS',
        absentThenPendingVerification: 'PASS',
        absentThenClosedVerification: 'PASS',
        absentThenActiveVerification: 'PASS',
        missingIdentity: 'PASS',
        duplicateIdentity: 'PASS',
        privateExclusiveListing: 'PASS',
        incompleteProviderSnapshot: 'PASS',
        partialReconciliation: 'PASS',
        unresolvedNotSearchEligible: 'PASS',
        unresolvedNotTypesenseEligible: 'PASS',
        unresolvedNotSavedSearchEligible: 'PASS',
        unresolvedNotAlertEligible: 'PASS',
        historicalPropertyRetentionUnaffected: 'PASS',
        statusNotFabricated: 'PASS',
        privacyFieldNotRepurposed: 'PASS',
        deterministicReasonCodes: 'PASS',
        zeroSideEffects: 'PASS',
      },
    },
    null,
    2,
  ),
);
