import assert from 'node:assert/strict';

import {
  buildPublicSearchEligibilityBatchCheckpoint,
  buildCompareAndSetRollbackRecord,
  certifyPublicSearchEligibilityTransitionPlan,
  dryRunPublicSearchEligibilityTransitionExecution,
  PUBLIC_SEARCH_ELIGIBILITY_EXECUTION_PROHIBITED_FIELDS,
  PUBLIC_SEARCH_ELIGIBILITY_EXECUTION_WRITABLE_FIELDS,
  representPublicSearchEligibilityBatchFailure,
  type PublicSearchEligibilityCertifiedTransitionPlan,
} from '../lib/mls/publicSearchEligibilityTransitionExecution.js';
import {
  buildPublicSearchEligibilityInitializationPlan,
  type LocalPublicSearchEligibilityRow,
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

const initializationPlan = buildPublicSearchEligibilityInitializationPlan({
  localRows: [
    localRow('eligible-id', 'SRC-ELIGIBLE'),
    localRow('unverified-id', 'SRC-ABSENT'),
    localRow('ineligible-id', 'SRC-CLOSED', 'Active', PUBLIC_SEARCH_ELIGIBILITY_STATES.publicScopeUnverified),
    localRow('certified-before-id', 'SRC-CERTIFIED-BEFORE', 'Active', PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedIneligible),
    localRow('already-eligible-id', 'SRC-ALREADY', 'Active', PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedEligible),
    localRow('blocked-missing-identity-id', null),
  ],
  snapshot: {
    capturedAt: '2026-08-14T22:00:00.000Z',
    complete: true,
    providerSource: 'MLS_GRID',
    scopeFingerprint: 'public-search-execution-scope-v1',
    sourceIds: ['SRC-ELIGIBLE', 'SRC-CERTIFIED-BEFORE', 'SRC-ALREADY'],
  },
  statusResolutions: [{ resolvedStatus: 'Closed', sourceIdentity: 'SRC-CLOSED', success: true }],
});

const bootstrapCertification = certifyPublicSearchEligibilityTransitionPlan({
  batchSize: 2,
  plan: initializationPlan,
  planIdentity: 'fixture-plan',
});
const certifiedPlan = certifyPublicSearchEligibilityTransitionPlan({
  batchSize: 2,
  expectedPlanFingerprint: bootstrapCertification.planFingerprint,
  expectedScopeFingerprint: initializationPlan.snapshot.scopeFingerprint,
  plan: initializationPlan,
  planIdentity: 'fixture-plan',
});

assert.equal(certifiedPlan.certified, true);
assert.equal(certifiedPlan.issues.length, 0);
assert.equal(certifiedPlan.candidates.length, 4);

const byId = new Map(certifiedPlan.candidates.map((candidate) => [candidate.propertyId, candidate]));

assert.equal(byId.get('eligible-id')?.action, 'SET_CERTIFIED_ELIGIBLE');
assert.equal(byId.get('eligible-id')?.proposedEligibility, PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedEligible);
assert.equal(byId.get('unverified-id')?.action, 'SET_PUBLIC_SCOPE_UNVERIFIED');
assert.equal(byId.get('unverified-id')?.proposedEligibility, PUBLIC_SEARCH_ELIGIBILITY_STATES.publicScopeUnverified);
assert.equal(byId.get('ineligible-id')?.action, 'SET_CERTIFIED_INELIGIBLE');
assert.equal(byId.get('ineligible-id')?.proposedEligibility, PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedIneligible);

assert.equal(certifiedPlan.excludedRows.some((row) => row.propertyId === 'already-eligible-id' && row.exclusion === 'NO_CHANGE'), true);
assert.equal(
  certifiedPlan.excludedRows.some((row) => row.propertyId === 'blocked-missing-identity-id' && row.exclusion === 'BLOCKED'),
  true,
);

assert.deepEqual(certifiedPlan.writableFields, PUBLIC_SEARCH_ELIGIBILITY_EXECUTION_WRITABLE_FIELDS);
assert.deepEqual(certifiedPlan.writableFields, ['publicSearchEligibility']);
assert.equal(certifiedPlan.prohibitedFields.includes('status'), true);
assert.equal(certifiedPlan.prohibitedFields.includes('isPrivateExclusive'), true);
assert.deepEqual(certifiedPlan.prohibitedFields, PUBLIC_SEARCH_ELIGIBILITY_EXECUTION_PROHIBITED_FIELDS);
assert.equal(certifiedPlan.executionSafety.databaseWritesPerformed, false);
assert.equal(certifiedPlan.executionSafety.providerCallsAllowed, false);
assert.equal(certifiedPlan.executionSafety.typesenseMutationAllowed, false);
assert.equal(certifiedPlan.executionSafety.alertMutationAllowed, false);
assert.equal(certifiedPlan.executionSafety.statusMutationAllowed, false);
assert.equal(certifiedPlan.executionSafety.privacyMutationAllowed, false);
assert.equal(certifiedPlan.executionSafety.broadUpdateManyAllowed, false);
assert.equal(certifiedPlan.executionSafety.compareAndSetRequired, true);

const duplicatePlan = certifyPublicSearchEligibilityTransitionPlan({
  plan: {
    ...initializationPlan,
    rows: [...initializationPlan.rows, { ...initializationPlan.rows[0]! }],
  },
  planIdentity: 'duplicate-plan',
});
assert.equal(duplicatePlan.certified, false);
assert.equal(duplicatePlan.issues.some((issue) => issue.code === 'DUPLICATE_PROPERTY_ID'), true);

const conflictingPlan = certifyPublicSearchEligibilityTransitionPlan({
  plan: {
    ...initializationPlan,
    rows: [
      ...initializationPlan.rows,
      {
        ...initializationPlan.rows[0]!,
        action: 'SET_CERTIFIED_INELIGIBLE',
        proposedEligibility: PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedIneligible,
      },
    ],
  },
  planIdentity: 'conflicting-plan',
});
assert.equal(conflictingPlan.certified, false);
assert.equal(conflictingPlan.issues.some((issue) => issue.code === 'CONFLICTING_TRANSITION'), true);

const missingPropertyPlan = certifyPublicSearchEligibilityTransitionPlan({
  plan: {
    ...initializationPlan,
    rows: [
      ...initializationPlan.rows,
      {
        ...initializationPlan.rows[0]!,
        propertyId: '   ',
      },
    ],
  },
  planIdentity: 'missing-property-plan',
});
assert.equal(missingPropertyPlan.certified, false);
assert.equal(missingPropertyPlan.issues.some((issue) => issue.code === 'MISSING_PROPERTY_ID'), true);

assert.equal(byId.get('eligible-id')?.expectedCurrentEligibility, null);
assert.equal(byId.get('ineligible-id')?.expectedCurrentEligibility, PUBLIC_SEARCH_ELIGIBILITY_STATES.publicScopeUnverified);
assert.equal(byId.get('certified-before-id')?.expectedCurrentEligibility, PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedIneligible);

const driftDryRun = dryRunPublicSearchEligibilityTransitionExecution({
  certifiedPlan,
  completedBatchCount: 1,
  observedBeforeStates: [
    {
      currentEligibility: PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedIneligible,
      exists: true,
      propertyId: 'eligible-id',
      sourceIdentityFingerprint: byId.get('eligible-id')?.sourceIdentityFingerprint,
    },
    {
      currentEligibility: null,
      exists: false,
      propertyId: 'unverified-id',
      sourceIdentityFingerprint: byId.get('unverified-id')?.sourceIdentityFingerprint,
    },
    {
      currentEligibility: PUBLIC_SEARCH_ELIGIBILITY_STATES.publicScopeUnverified,
      exists: true,
      propertyId: 'ineligible-id',
      sourceIdentityFingerprint: 'identity-mismatch',
    },
  ],
});
assert.equal(
  driftDryRun.conflictingOrDriftedEntries.some((entry) => entry.resultState === 'BLOCKED_STATE_DRIFT'),
  true,
);
assert.equal(
  driftDryRun.conflictingOrDriftedEntries.some((entry) => entry.resultState === 'BLOCKED_MISSING_ROW'),
  true,
);
assert.equal(
  driftDryRun.conflictingOrDriftedEntries.some((entry) => entry.resultState === 'BLOCKED_IDENTITY_MISMATCH'),
  true,
);

const fingerprintMismatch = certifyPublicSearchEligibilityTransitionPlan({
  expectedPlanFingerprint: 'not-the-plan-fingerprint',
  plan: initializationPlan,
  planIdentity: 'fingerprint-mismatch-plan',
});
assert.equal(fingerprintMismatch.certified, false);
assert.equal(fingerprintMismatch.issues.some((issue) => issue.code === 'PLAN_FINGERPRINT_MISMATCH'), true);

const scopeMismatch = certifyPublicSearchEligibilityTransitionPlan({
  expectedScopeFingerprint: 'not-the-scope-fingerprint',
  plan: initializationPlan,
  planIdentity: 'scope-mismatch-plan',
});
assert.equal(scopeMismatch.certified, false);
assert.equal(scopeMismatch.issues.some((issue) => issue.code === 'SCOPE_FINGERPRINT_MISMATCH'), true);

assert.equal(certifiedPlan.batches.length, 2);
assert.equal(certifiedPlan.batches[0]?.expectedWriteCount, 2);
assert.equal(certifiedPlan.batches[0]?.fingerprint, bootstrapCertification.batches[0]?.fingerprint);

const repeatedDryRun = dryRunPublicSearchEligibilityTransitionExecution({ certifiedPlan, completedBatchCount: 1 });
assert.deepEqual(dryRunPublicSearchEligibilityTransitionExecution({ certifiedPlan, completedBatchCount: 1 }), repeatedDryRun);
assert.equal(repeatedDryRun.totalPlanRows, 6);
assert.equal(repeatedDryRun.writableRows, 4);
assert.equal(repeatedDryRun.blockedRows, 1);
assert.equal(repeatedDryRun.noChangeRows, 1);
assert.equal(repeatedDryRun.batchCount, 2);
assert.equal(repeatedDryRun.perTargetStateCounts.CERTIFIED_ELIGIBLE, 2);
assert.equal(repeatedDryRun.perTargetStateCounts.PUBLIC_SCOPE_UNVERIFIED, 1);
assert.equal(repeatedDryRun.perTargetStateCounts.CERTIFIED_INELIGIBLE, 1);
assert.equal(repeatedDryRun.expectedBeforeStateDistribution.NULL, 2);
assert.equal(repeatedDryRun.expectedBeforeStateDistribution.PUBLIC_SCOPE_UNVERIFIED, 1);
assert.equal(repeatedDryRun.expectedBeforeStateDistribution.CERTIFIED_INELIGIBLE, 1);
assert.equal(repeatedDryRun.nextBatchIndex, 1);
assert.equal(repeatedDryRun.replaySafeCompletedBatchCount, 1);
assert.equal(repeatedDryRun.databaseWritesPerformed, false);
assert.equal(repeatedDryRun.providerCallsPerformed, false);
assert.equal(repeatedDryRun.typesenseMutationsPerformed, false);
assert.equal(repeatedDryRun.alertMutationsPerformed, false);

const checkpoint = buildPublicSearchEligibilityBatchCheckpoint(certifiedPlan, 1);
assert.equal(checkpoint.lastCompletedBatchIndex, 0);
assert.equal(checkpoint.nextBatchIndex, 1);
assert.equal(checkpoint.completedBatchFingerprints.length, 1);
assert.equal(checkpoint.resumeRequiresBeforeStateRevalidation, true);
assert.equal(checkpoint.replaySafe, true);

const replayCheckpoint = buildPublicSearchEligibilityBatchCheckpoint(certifiedPlan, 99);
assert.equal(replayCheckpoint.nextBatchIndex, null);
assert.equal(replayCheckpoint.lastCompletedBatchIndex, 1);

const partialFailure = representPublicSearchEligibilityBatchFailure({
  appliedPropertyIds: [certifiedPlan.batches[0]!.entries[0]!.propertyId],
  batch: certifiedPlan.batches[0]!,
  failedPropertyIds: [certifiedPlan.batches[0]!.entries[1]!.propertyId],
});
assert.equal(partialFailure.resultState, 'FAILED_WRITE');
assert.equal(partialFailure.appliedCount, 1);
assert.equal(partialFailure.unresolvedRemainderPropertyIds.length, 1);
assert.equal(partialFailure.rowResults.some((row) => row.resultState === 'FAILED_WRITE'), true);

const rollbackRecord = buildCompareAndSetRollbackRecord(certifiedPlan.candidates[0]!);
assert.equal(rollbackRecord.propertyId, certifiedPlan.candidates[0]!.propertyId);
assert.equal(rollbackRecord.rollbackFrom, certifiedPlan.candidates[0]!.proposedEligibility);
assert.equal(rollbackRecord.rollbackAllowedOnlyIfCurrentStateEquals, certifiedPlan.candidates[0]!.proposedEligibility);

function summarizeCertification(plan: PublicSearchEligibilityCertifiedTransitionPlan) {
  return {
    batchCount: plan.batches.length,
    blockedRows: plan.excludedRows.filter((row) => row.exclusion === 'BLOCKED').length,
    noChangeRows: plan.excludedRows.filter((row) => row.exclusion === 'NO_CHANGE').length,
    totalPlanRows: plan.totalPlanRows,
    writableRows: plan.candidates.length,
  };
}

console.log(
  JSON.stringify(
    {
      status: 'SUCCESS',
      mode: 'FIXTURE_ONLY_ZERO_DB_WRITE_ZERO_PROVIDER_ZERO_TYPESENSE_ZERO_ALERT',
      classification: 'ELIGIBILITY_TRANSITION_EXECUTION_CONTRACT_IMPLEMENTED_AND_LOCALLY_CERTIFIED',
      cases: {
        validEligibleTransition: 'PASS',
        validUnverifiedTransition: 'PASS',
        validIneligibleTransition: 'PASS',
        noChangeExcluded: 'PASS',
        blockedActionExcluded: 'PASS',
        duplicatePropertyId: 'PASS',
        conflictingTransitions: 'PASS',
        missingPropertyId: 'PASS',
        expectedNullBeforeState: 'PASS',
        expectedCertifiedBeforeState: 'PASS',
        simulatedStateDrift: 'PASS',
        missingRow: 'PASS',
        planFingerprintMismatch: 'PASS',
        scopeFingerprintMismatch: 'PASS',
        batchFingerprintDeterminism: 'PASS',
        repeatedDryRunDeterminism: 'PASS',
        batchResumeContract: 'PASS',
        replaySafety: 'PASS',
        partialFailureRepresentation: 'PASS',
        onlyPublicSearchEligibilityWritable: 'PASS',
        statusNeverWritable: 'PASS',
        isPrivateExclusiveNeverWritable: 'PASS',
        noProvider: 'PASS',
        noDatabaseWrite: 'PASS',
        noTypesense: 'PASS',
        noAlerts: 'PASS',
      },
      summary: summarizeCertification(certifiedPlan),
      dryRun: repeatedDryRun,
      checkpoint,
      writableFields: certifiedPlan.writableFields,
      prohibitedFields: certifiedPlan.prohibitedFields,
    },
    null,
    2,
  ),
);
