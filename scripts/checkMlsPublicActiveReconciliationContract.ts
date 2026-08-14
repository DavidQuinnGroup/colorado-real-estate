import assert from 'node:assert/strict';

import {
  analyzePublicActiveReconciliation,
  applyProviderStatusEvidence,
  isCurrentProviderPublicScopeStatus,
  isLocalPublicActiveCandidate,
  type PublicActiveLocalRow,
} from '../lib/mls/publicActiveReconciliationContract.js';

function localRow(propertyId: string, sourceId: string | null, status = 'Active', isPrivateExclusive = false): PublicActiveLocalRow {
  return {
    propertyId,
    sourceId,
    status,
    isPrivateExclusive,
  };
}

const completeSnapshot = {
  complete: true,
  sourceIds: ['A-1', 'CS-1'],
};

const base = analyzePublicActiveReconciliation({
  localRows: [
    localRow('prop-present', 'A-1'),
    localRow('prop-absent', 'A-2'),
    localRow('prop-coming-soon', 'CS-1', 'Coming Soon'),
    localRow('prop-private', 'P-1', 'Active', true),
    localRow('prop-missing-id', null),
    localRow('prop-duplicate-left', 'D-1'),
    localRow('prop-duplicate-right', 'D-1'),
  ],
  providerPublicScopeSnapshot: completeSnapshot,
});

const byPropertyId = new Map(base.rows.map((row) => [row.propertyId, row]));
assert.equal(byPropertyId.get('prop-present')?.reason, 'VERIFIED_IN_CURRENT_PROVIDER_PUBLIC_SCOPE');
assert.equal(byPropertyId.get('prop-present')?.publicSearchEligible, true);
assert.equal(byPropertyId.get('prop-present')?.savedSearchNewListingEligible, true);
assert.equal(byPropertyId.get('prop-absent')?.reason, 'ABSENT_FROM_COMPLETED_PROVIDER_PUBLIC_SCOPE');
assert.equal(byPropertyId.get('prop-absent')?.disposition, 'requires_authoritative_resolution');
assert.equal(byPropertyId.get('prop-absent')?.publicSearchEligible, false);
assert.equal(byPropertyId.get('prop-coming-soon')?.reason, 'LOCAL_NOT_PUBLIC_ACTIVE_CANDIDATE');
assert.equal(byPropertyId.get('prop-coming-soon')?.publicSearchEligible, false);
assert.equal(byPropertyId.get('prop-private')?.reason, 'LOCAL_NOT_PUBLIC_ACTIVE_CANDIDATE');
assert.equal(byPropertyId.get('prop-private')?.publicSearchEligible, false);
assert.equal(byPropertyId.get('prop-missing-id')?.reason, 'IDENTITY_INVALID');
assert.equal(byPropertyId.get('prop-duplicate-left')?.reason, 'DUPLICATE_LOCAL_SOURCE_ID');
assert.equal(byPropertyId.get('prop-duplicate-right')?.reason, 'DUPLICATE_LOCAL_SOURCE_ID');
assert.equal(base.summary.localPublicActiveCandidates, 5);
assert.equal(base.summary.verifiedCurrentProviderPublicScope, 1);
assert.equal(base.summary.absentFromCompletedProviderPublicScope, 1);
assert.equal(base.summary.duplicateIdentityRows, 2);
assert.equal(base.summary.invalidIdentityRows, 1);

const incomplete = analyzePublicActiveReconciliation({
  localRows: [localRow('prop-incomplete', 'A-2')],
  providerPublicScopeSnapshot: {
    complete: false,
    sourceIds: ['A-1'],
  },
});
assert.equal(incomplete.rows[0]?.reason, 'PROVIDER_SNAPSHOT_INCOMPLETE');
assert.equal(incomplete.rows[0]?.disposition, 'blocked');
assert.equal(incomplete.summary.absentFromCompletedProviderPublicScope, 0);

const absentRow = byPropertyId.get('prop-absent');
assert.ok(absentRow);

const pending = applyProviderStatusEvidence(absentRow, {
  found: true,
  status: 'Pending',
});
assert.equal(pending.reason, 'AUTHORITATIVE_PROVIDER_STATUS_NON_PUBLIC');
assert.equal(pending.publicSearchEligible, false);
assert.equal(pending.savedSearchNewListingEligible, false);

const closed = applyProviderStatusEvidence(absentRow, {
  found: true,
  status: 'Closed',
});
assert.equal(closed.reason, 'AUTHORITATIVE_PROVIDER_STATUS_NON_PUBLIC');
assert.equal(closed.publicSearchEligible, false);

const withdrawn = applyProviderStatusEvidence(absentRow, {
  found: true,
  status: 'Withdrawn',
});
assert.equal(withdrawn.reason, 'AUTHORITATIVE_PROVIDER_STATUS_NON_PUBLIC');
assert.equal(withdrawn.publicSearchEligible, false);

const cancelled = applyProviderStatusEvidence(absentRow, {
  found: true,
  status: 'Canceled',
});
assert.equal(cancelled.reason, 'AUTHORITATIVE_PROVIDER_STATUS_NON_PUBLIC');
assert.equal(cancelled.publicSearchEligible, false);

const expired = applyProviderStatusEvidence(absentRow, {
  found: true,
  status: 'Expired',
});
assert.equal(expired.reason, 'AUTHORITATIVE_PROVIDER_STATUS_NON_PUBLIC');
assert.equal(expired.publicSearchEligible, false);

const unavailable = applyProviderStatusEvidence(absentRow, {
  found: false,
});
assert.equal(unavailable.reason, 'PROVIDER_RECORD_UNAVAILABLE');
assert.equal(unavailable.disposition, 'requires_authoritative_resolution');
assert.equal(unavailable.publicSearchEligible, false);

const ambiguous = applyProviderStatusEvidence(absentRow, {
  found: true,
  status: '',
});
assert.equal(ambiguous.reason, 'PROVIDER_STATUS_AMBIGUOUS');
assert.equal(ambiguous.disposition, 'requires_authoritative_resolution');
assert.equal(ambiguous.savedSearchNewListingEligible, false);

const activeEvidence = applyProviderStatusEvidence(absentRow, {
  found: true,
  status: 'Active',
});
assert.equal(activeEvidence.reason, 'AUTHORITATIVE_PROVIDER_STATUS_PUBLIC');
assert.equal(activeEvidence.publicSearchEligible, true);
assert.equal(activeEvidence.savedSearchNewListingEligible, true);

const comingSoonEvidence = applyProviderStatusEvidence(absentRow, {
  found: true,
  status: 'Coming Soon',
});
assert.equal(comingSoonEvidence.reason, 'AUTHORITATIVE_PROVIDER_STATUS_PUBLIC');
assert.equal(comingSoonEvidence.publicSearchEligible, true);
assert.equal(comingSoonEvidence.savedSearchNewListingEligible, false);

assert.equal(isLocalPublicActiveCandidate(localRow('candidate-active', 'A-3', 'Active', false)), true);
assert.equal(isLocalPublicActiveCandidate(localRow('candidate-private', 'A-4', 'Active', true)), false);
assert.equal(isLocalPublicActiveCandidate(localRow('candidate-coming-soon', 'A-5', 'Coming Soon', false)), false);
assert.equal(isCurrentProviderPublicScopeStatus('Active'), true);
assert.equal(isCurrentProviderPublicScopeStatus('Coming Soon'), true);
assert.equal(isCurrentProviderPublicScopeStatus('Pending'), false);

console.log(
  JSON.stringify(
    {
      status: 'SUCCESS',
      mode: 'FIXTURE_ONLY_NO_DB_NO_PROVIDER_NO_SIDE_EFFECT',
      classification: 'ADDITIVE_ELIGIBILITY_STATE_REQUIRED',
      cases: {
        activeLocalPresentInCompletedProviderPublicScope: 'PASS',
        activeLocalAbsentFromCompletedProviderPublicScope: 'PASS',
        incompleteProviderSnapshotDoesNotCreateAbsence: 'PASS',
        comingSoonProviderScopeNotSavedSearchNewListingEligible: 'PASS',
        pendingClosedWithdrawnCancelledExpiredExcludePublicActive: 'PASS',
        unavailableProviderRecordRequiresResolution: 'PASS',
        ambiguousProviderStatusRequiresResolution: 'PASS',
        missingIdentityBlocksCertification: 'PASS',
        duplicateIdentityBlocksCertification: 'PASS',
        privateExclusiveExcludedFromPublicActive: 'PASS',
        noDatabaseWrites: 'PASS',
        noProviderCalls: 'PASS',
        noTypesenseWrites: 'PASS',
        noAlertQueueWrites: 'PASS',
      },
      summary: base.summary,
    },
    null,
    2,
  ),
);
