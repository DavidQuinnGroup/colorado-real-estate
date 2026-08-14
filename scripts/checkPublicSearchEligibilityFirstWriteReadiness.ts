import assert from 'node:assert/strict';

import {
  evaluatePublicSearchEligibilityFirstWriteReadiness,
  type PublicSearchEligibilityAlertPosture,
  type PublicSearchEligibilityDbDistributionSnapshot,
  type PublicSearchEligibilityFirstWriteReadinessInput,
  type ProviderSnapshotTraversalCertification,
} from '../lib/mls/publicSearchEligibilityFirstWriteReadiness.js';
import {
  buildPublicSearchEligibilityInitializationPlan,
  type LocalPublicSearchEligibilityRow,
} from '../lib/mls/publicSearchEligibilityInitializationPlan.js';
import {
  certifyPublicSearchEligibilityTransitionPlan,
  dryRunPublicSearchEligibilityTransitionExecution,
} from '../lib/mls/publicSearchEligibilityTransitionExecution.js';
import { PUBLIC_SEARCH_ELIGIBILITY_STATES } from '../lib/mls/publicSearchEligibilityStateContract.js';

function localRow(
  propertyId: string,
  sourceIdentity: string,
  status = 'Active',
  currentEligibility: LocalPublicSearchEligibilityRow['currentEligibility'] = null,
): LocalPublicSearchEligibilityRow {
  return {
    currentEligibility,
    isPrivateExclusive: false,
    propertyId,
    sourceIdentity,
    status,
  };
}

const readyInitializationPlan = buildPublicSearchEligibilityInitializationPlan({
  localRows: [
    localRow('eligible-a', 'SRC-A'),
    localRow('eligible-b', 'SRC-B'),
  ],
  snapshot: {
    capturedAt: '2026-08-14T23:00:00.000Z',
    complete: true,
    providerSource: 'MLS_GRID',
    scopeFingerprint: 'ready-active-coming-soon-scope',
    sourceIds: ['SRC-A', 'SRC-B'],
  },
});

const readyTransitionPlan = certifyPublicSearchEligibilityTransitionPlan({
  batchSize: 100,
  plan: readyInitializationPlan,
  planIdentity: 'ready-first-write-fixture-plan',
});
const readyDryRun = dryRunPublicSearchEligibilityTransitionExecution({
  certifiedPlan: readyTransitionPlan,
  observedBeforeStates: readyTransitionPlan.candidates.map((candidate) => ({
    currentEligibility: candidate.expectedCurrentEligibility,
    exists: true,
    propertyId: candidate.propertyId,
    sourceIdentityFingerprint: candidate.sourceIdentityFingerprint,
  })),
});

const readySnapshot: ProviderSnapshotTraversalCertification = {
  activeComingSoonScope: true,
  capturedAt: '2026-08-14T23:00:00.000Z',
  complete: true,
  nextLinkTraversalCertified: true,
  providerCountCertified: true,
  rateGoverned: true,
  snapshotFingerprint: 'snapshot-ready-fingerprint',
  terminalSignalCertified: true,
  uniqueIdentityPopulationCertified: true,
};

const readyDbDistribution: PublicSearchEligibilityDbDistributionSnapshot = {
  capturedAt: '2026-08-14T23:05:00.000Z',
  certifiedEligibleCount: 0,
  certifiedIneligibleCount: 0,
  expectedBeforeStateCounts: readyDryRun.expectedBeforeStateDistribution,
  nullCount: 75490,
  publicScopeUnverifiedCount: 0,
  targetPropertyIds: readyTransitionPlan.candidates.map((candidate) => candidate.propertyId),
  totalPropertyRows: 75490,
};

const readyAlerts: PublicSearchEligibilityAlertPosture = {
  alertMutationEnabled: false,
  alertQueueEnabled: false,
  emailSendEnabled: false,
  savedSearchEligibilityChanged: false,
};

function readyInput(): PublicSearchEligibilityFirstWriteReadinessInput {
  const certifiedPlan = structuredClone(readyTransitionPlan);
  const dryRun = structuredClone(readyDryRun);
  const currentDbDistribution = structuredClone(readyDbDistribution);

  return {
    alerts: structuredClone(readyAlerts),
    allowProviderHoldOverride: true,
    certifiedPlan,
    currentDbDistribution,
    dryRun,
    maximumAllowedFirstWriteCount: 100,
    proposedFirstBatch: certifiedPlan.batches[0]!,
    providerSafety: {
      attomPendingProviderResponse: false,
      lightBoxCallsConsumed: 0,
      mlsGridLiveCallsPaused: false,
      mlsGridRateLimitClarified: true,
    },
    requestedBatchSize: 100,
    runtime: {
      legacyRuntimeStillActive: true,
      runtimeEligibilityPredicateActive: false,
    },
    snapshot: structuredClone(readySnapshot),
    typesense: {
      mutationEnabled: false,
      rebuildQueued: false,
    },
  };
}

function evaluateMutation(
  mutate: (input: PublicSearchEligibilityFirstWriteReadinessInput) => void,
) {
  const input = readyInput();
  mutate(input);
  return evaluatePublicSearchEligibilityFirstWriteReadiness(input);
}

const readyResult = evaluatePublicSearchEligibilityFirstWriteReadiness(readyInput());
assert.equal(readyResult.status, 'READY_TO_WRITE');
assert.deepEqual(readyResult.reasons, ['READY_ALL_PREREQUISITES_PRESENT']);
assert.equal(readyResult.recommendedFirstWriteBatchSize, 100);
assert.equal(readyResult.recommendedFirstWriteContent, 'ONLY_CERTIFIED_ELIGIBLE');
assert.equal(readyResult.writeProof.exactPropertyIdCount, 2);
assert.equal(readyResult.writeProof.proposedTargetStateCounts.CERTIFIED_ELIGIBLE, 2);
assert.equal(readyResult.writeProof.blockedOrUnresolvedCount, 0);
assert.equal(readyResult.futureWriteCommand.allowedField, 'publicSearchEligibility');
assert.equal(readyResult.futureWriteCommand.compareAndSetSemantics, true);
assert.equal(readyResult.futureWriteCommand.broadUpdateManyAllowed, false);
assert.equal(readyResult.futureWriteCommand.implementationRequiredBeforeExecution, true);
assert.equal(readyResult.postWriteCertification.propertyTotalUnchangedRequired, true);
assert.equal(readyResult.postWriteCertification.statusUnchangedRequired, true);
assert.equal(readyResult.postWriteCertification.privateExclusiveUnchangedRequired, true);
assert.equal(readyResult.rollbackReadiness.compareAndSetRollbackRequired, true);
assert.equal(readyResult.rollbackReadiness.blindBulkRestoreAllowed, false);
assert.equal(readyResult.executiveAuthorizationTemplate?.maximumWriteCount, 100);
assert.equal(readyResult.executiveAuthorizationTemplate?.allowedField, 'publicSearchEligibility');
assert.equal(readyResult.executiveAuthorizationTemplate?.runtimeActivation, false);
assert.equal(readyResult.executiveAuthorizationTemplate?.typesense, false);
assert.equal(readyResult.executiveAuthorizationTemplate?.alerts, false);
assert.equal(readyResult.stopThresholds.identityMismatchTolerance, 0);
assert.equal(readyResult.stopThresholds.missingRowTolerance, 0);
assert.equal(readyResult.stopThresholds.stateDriftTolerance, 0);
assert.equal(readyResult.zeroSideEffects.databaseWritesPerformed, false);
assert.equal(readyResult.zeroSideEffects.providerCallsPerformed, false);

assert.equal(evaluateMutation((input) => { input.snapshot.complete = false; }).reasons.includes('PROVIDER_SNAPSHOT_INCOMPLETE'), true);
assert.equal(evaluateMutation((input) => { input.snapshot.snapshotFingerprint = null; }).reasons.includes('SNAPSHOT_FINGERPRINT_MISSING'), true);
assert.equal(evaluateMutation((input) => { input.certifiedPlan.planFingerprint = ''; }).reasons.includes('PLAN_FINGERPRINT_MISSING'), true);
assert.equal(evaluateMutation((input) => { input.dryRun.writeSetFingerprint = ''; }).reasons.includes('WRITE_SET_FINGERPRINT_MISSING'), true);
assert.equal(evaluateMutation((input) => { input.dryRun.blockedRows = 1; }).reasons.includes('BLOCKED_POPULATION_PRESENT'), true);
assert.equal(
  evaluateMutation((input) => {
    input.dryRun.conflictingOrDriftedEntries = [
      {
        expectedCurrentEligibility: null,
        observedCurrentEligibility: PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedIneligible,
        propertyId: 'eligible-a',
        resultState: 'BLOCKED_STATE_DRIFT',
      },
    ];
  }).reasons.includes('DRY_RUN_BEFORE_STATE_CONFLICT'),
  true,
);
assert.equal(
  evaluateMutation((input) => { input.runtime.runtimeEligibilityPredicateActive = true; }).reasons.includes('RUNTIME_ACTIVATION_ENABLED'),
  true,
);
assert.equal(evaluateMutation((input) => { input.typesense.mutationEnabled = true; }).reasons.includes('TYPESENSE_MUTATION_ENABLED'), true);
assert.equal(evaluateMutation((input) => { input.alerts.alertMutationEnabled = true; }).reasons.includes('ALERT_MUTATION_ENABLED'), true);
assert.equal(evaluateMutation((input) => { input.requestedBatchSize = 101; }).reasons.includes('BATCH_TOO_LARGE'), true);
assert.equal(
  evaluateMutation((input) => {
    input.proposedFirstBatch = {
      ...input.proposedFirstBatch!,
      entries: [input.proposedFirstBatch!.entries[0]!, input.proposedFirstBatch!.entries[0]!],
    };
  }).reasons.includes('DUPLICATE_BATCH_PROPERTY_ID'),
  true,
);
assert.equal(
  evaluateMutation((input) => {
    input.proposedFirstBatch = {
      ...input.proposedFirstBatch!,
      entries: [
        {
          ...input.proposedFirstBatch!.entries[0]!,
          action: 'SET_PUBLIC_SCOPE_UNVERIFIED',
          proposedEligibility: PUBLIC_SEARCH_ELIGIBILITY_STATES.publicScopeUnverified,
        },
      ],
      proposedStateCounts: {
        CERTIFIED_ELIGIBLE: 0,
        CERTIFIED_INELIGIBLE: 0,
        PUBLIC_SCOPE_UNVERIFIED: 1,
      },
    };
  }).reasons.includes('INVALID_TARGET_ACTION'),
  true,
);
assert.equal(
  evaluateMutation((input) => {
    input.currentDbDistribution.nullCount = 75489;
  }).reasons.includes('DB_DISTRIBUTION_TOTAL_MISMATCH'),
  true,
);

const deterministicA = evaluatePublicSearchEligibilityFirstWriteReadiness(readyInput());
const deterministicB = evaluatePublicSearchEligibilityFirstWriteReadiness(readyInput());
assert.deepEqual(deterministicA, deterministicB);

const providerHoldResult = evaluatePublicSearchEligibilityFirstWriteReadiness({
  ...readyInput(),
  allowProviderHoldOverride: false,
  providerSafety: {
    attomPendingProviderResponse: true,
    lightBoxCallsConsumed: 0,
    mlsGridLiveCallsPaused: true,
    mlsGridRateLimitClarified: false,
  },
  snapshot: {
    ...readySnapshot,
    complete: false,
    snapshotFingerprint: null,
  },
});
assert.equal(providerHoldResult.status, 'NOT_READY_TO_WRITE');
assert.equal(providerHoldResult.reasons.includes('MLS_GRID_RATE_LIMIT_CLARIFICATION_PENDING'), true);
assert.equal(providerHoldResult.reasons.includes('PROVIDER_SNAPSHOT_INCOMPLETE'), true);

console.log(
  JSON.stringify(
    {
      status: 'SUCCESS',
      mode: 'FIXTURE_ONLY_ZERO_DB_WRITE_ZERO_PROVIDER_ZERO_TYPESENSE_ZERO_ALERT',
      classification: 'FIRST_WRITE_READINESS_CONTRACT_IMPLEMENTED_AND_LOCALLY_CERTIFIED_PROVIDER_SNAPSHOT_PENDING',
      cases: {
        allPrerequisitesPresentReady: 'PASS',
        incompleteSnapshot: 'PASS',
        missingSnapshotFingerprint: 'PASS',
        missingPlanFingerprint: 'PASS',
        missingWriteSetFingerprint: 'PASS',
        blockedPopulationPresent: 'PASS',
        beforeStateMismatch: 'PASS',
        runtimeActivationTrue: 'PASS',
        typesenseMutationEnabled: 'PASS',
        alertsEnabled: 'PASS',
        oversizedFirstBatch: 'PASS',
        duplicateIds: 'PASS',
        invalidTargetAction: 'PASS',
        currentDbDistributionMismatch: 'PASS',
        deterministicReadinessOutput: 'PASS',
        postWriteEvidenceContract: 'PASS',
        rollbackPrecondition: 'PASS',
        providerHoldForcesNotReady: 'PASS',
        noDatabaseWrite: 'PASS',
        noProviderCall: 'PASS',
      },
      readyFixture: {
        status: readyResult.status,
        reasons: readyResult.reasons,
        writeProof: readyResult.writeProof,
        recommendedFirstWriteBatchSize: readyResult.recommendedFirstWriteBatchSize,
        recommendedFirstWriteContent: readyResult.recommendedFirstWriteContent,
      },
      providerHoldFixture: {
        status: providerHoldResult.status,
        reasons: providerHoldResult.reasons,
      },
      futureWriteCommand: readyResult.futureWriteCommand,
      postWriteCertification: readyResult.postWriteCertification,
      rollbackReadiness: readyResult.rollbackReadiness,
      zeroSideEffects: readyResult.zeroSideEffects,
    },
    null,
    2,
  ),
);
