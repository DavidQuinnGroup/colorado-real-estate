import crypto from 'node:crypto';

import {
  PUBLIC_SEARCH_ELIGIBILITY_EXECUTION_WRITABLE_FIELDS,
  type PublicSearchEligibilityCertifiedTransitionPlan,
  type PublicSearchEligibilityDryRunSummary,
  type PublicSearchEligibilityTransitionBatch,
} from './publicSearchEligibilityTransitionExecution.js';
import {
  PUBLIC_SEARCH_ELIGIBILITY_STATES,
  type PublicSearchEligibilityState,
} from './publicSearchEligibilityStateContract.js';

export type PublicSearchEligibilityFirstWriteReadinessStatus = 'READY_TO_WRITE' | 'NOT_READY_TO_WRITE';

export type ProviderSnapshotTraversalCertification = {
  complete: boolean;
  activeComingSoonScope: boolean;
  snapshotFingerprint: string | null;
  capturedAt: string | null;
  nextLinkTraversalCertified: boolean;
  rateGoverned: boolean;
  providerCountCertified: boolean;
  terminalSignalCertified: boolean;
  uniqueIdentityPopulationCertified: boolean;
};

export type PublicSearchEligibilityDbDistributionSnapshot = {
  capturedAt: string;
  totalPropertyRows: number;
  nullCount: number;
  certifiedEligibleCount: number;
  publicScopeUnverifiedCount: number;
  certifiedIneligibleCount: number;
  targetPropertyIds: readonly string[];
  expectedBeforeStateCounts: Record<string, number>;
};

export type PublicSearchEligibilityRuntimePosture = {
  runtimeEligibilityPredicateActive: boolean;
  legacyRuntimeStillActive: boolean;
};

export type PublicSearchEligibilityTypesensePosture = {
  mutationEnabled: boolean;
  rebuildQueued: boolean;
};

export type PublicSearchEligibilityAlertPosture = {
  savedSearchEligibilityChanged: boolean;
  alertMutationEnabled: boolean;
  alertQueueEnabled: boolean;
  emailSendEnabled: boolean;
};

export type PublicSearchEligibilityProviderSafetyPosture = {
  mlsGridLiveCallsPaused: boolean;
  mlsGridRateLimitClarified: boolean;
  lightBoxCallsConsumed: number;
  attomPendingProviderResponse: boolean;
};

export type PublicSearchEligibilityFirstWriteReadinessInput = {
  snapshot: ProviderSnapshotTraversalCertification;
  certifiedPlan: PublicSearchEligibilityCertifiedTransitionPlan;
  dryRun: PublicSearchEligibilityDryRunSummary;
  currentDbDistribution: PublicSearchEligibilityDbDistributionSnapshot;
  runtime: PublicSearchEligibilityRuntimePosture;
  typesense: PublicSearchEligibilityTypesensePosture;
  alerts: PublicSearchEligibilityAlertPosture;
  providerSafety: PublicSearchEligibilityProviderSafetyPosture;
  proposedFirstBatch: PublicSearchEligibilityTransitionBatch | null;
  requestedBatchSize: number;
  maximumAllowedFirstWriteCount?: number;
  allowProviderHoldOverride?: boolean;
};

export type PublicSearchEligibilityFirstWriteReadinessReason =
  | 'READY_ALL_PREREQUISITES_PRESENT'
  | 'PROVIDER_SNAPSHOT_INCOMPLETE'
  | 'SNAPSHOT_SCOPE_NOT_ACTIVE_COMING_SOON'
  | 'SNAPSHOT_FINGERPRINT_MISSING'
  | 'SNAPSHOT_CAPTURE_TIMESTAMP_MISSING'
  | 'SNAPSHOT_NEXTLINK_NOT_CERTIFIED'
  | 'SNAPSHOT_RATE_GOVERNOR_NOT_CERTIFIED'
  | 'SNAPSHOT_PROVIDER_COUNT_NOT_CERTIFIED'
  | 'SNAPSHOT_TERMINAL_SIGNAL_NOT_CERTIFIED'
  | 'SNAPSHOT_UNIQUE_IDENTITY_NOT_CERTIFIED'
  | 'MLS_GRID_RATE_LIMIT_CLARIFICATION_PENDING'
  | 'CERTIFIED_PLAN_NOT_CERTIFIED'
  | 'PLAN_FINGERPRINT_MISSING'
  | 'WRITE_SET_FINGERPRINT_MISSING'
  | 'BLOCKED_POPULATION_PRESENT'
  | 'DRY_RUN_BEFORE_STATE_CONFLICT'
  | 'DB_DISTRIBUTION_TOTAL_MISMATCH'
  | 'DB_TARGET_IDS_MISMATCH'
  | 'DB_BEFORE_STATE_DISTRIBUTION_MISMATCH'
  | 'BATCH_MISSING'
  | 'BATCH_SIZE_INVALID'
  | 'BATCH_TOO_LARGE'
  | 'BATCH_FINGERPRINT_MISSING'
  | 'DUPLICATE_BATCH_PROPERTY_ID'
  | 'INVALID_TARGET_ACTION'
  | 'RUNTIME_ACTIVATION_ENABLED'
  | 'RUNTIME_LEGACY_DISABLED'
  | 'TYPESENSE_MUTATION_ENABLED'
  | 'TYPESENSE_REBUILD_QUEUED'
  | 'SAVED_SEARCH_CHANGED'
  | 'ALERT_MUTATION_ENABLED'
  | 'ALERT_QUEUE_ENABLED'
  | 'EMAIL_SEND_ENABLED'
  | 'UNEXPECTED_LIGHTBOX_CALLS'
  | 'ATTOM_PROVIDER_RESPONSE_NOT_RESOLVED_FOR_WRITE';

export type PublicSearchEligibilityFirstWriteProof = {
  snapshotFingerprint: string | null;
  planFingerprint: string;
  writeSetFingerprint: string;
  batchFingerprint: string | null;
  batchSize: number;
  exactPropertyIdCount: number;
  expectedBeforeStateCounts: Record<string, number>;
  proposedTargetStateCounts: Record<PublicSearchEligibilityState, number>;
  blockedOrUnresolvedCount: number;
  runtimeActivation: false;
  typesenseMutation: false;
  alertsEnabled: false;
};

export type PublicSearchEligibilityFutureWriteCommandContract = {
  command: string;
  acceptsCertifiedPlanFingerprint: true;
  acceptsWriteSetFingerprint: true;
  acceptsExplicitBatchFingerprint: true;
  compareAndSetSemantics: true;
  allowedField: typeof PUBLIC_SEARCH_ELIGIBILITY_EXECUTION_WRITABLE_FIELDS[number];
  abortsOnFingerprintMismatch: true;
  abortsOnBeforeStateDrift: true;
  reportsPerRowOutcomes: true;
  broadUpdateManyAllowed: false;
  implementationRequiredBeforeExecution: true;
};

export type PublicSearchEligibilityPostWriteCertificationContract = {
  appliedCountRequired: true;
  noChangeCountRequired: true;
  blockedCountRequired: true;
  failedCountRequired: true;
  eligibilityDistributionDeltaRequired: true;
  propertyTotalUnchangedRequired: true;
  statusUnchangedRequired: true;
  privateExclusiveUnchangedRequired: true;
  noTypesenseMutationRequired: true;
  noSearchActivationRequired: true;
  noAlertOrEmailRequired: true;
  runtimeRemainsLegacyRequired: true;
};

export type PublicSearchEligibilityRollbackReadiness = {
  compareAndSetRollbackRequired: true;
  rollbackFingerprint: string;
  requiresCurrentStateEqualsJustWrittenTarget: true;
  blindBulkRestoreAllowed: false;
};

export type PublicSearchEligibilityExecutiveAuthorizationTemplate = {
  when: string;
  what: string;
  where: string;
  maximumWriteCount: number;
  allowedField: typeof PUBLIC_SEARCH_ELIGIBILITY_EXECUTION_WRITABLE_FIELDS[number];
  providerSnapshotFingerprint: string;
  planFingerprint: string;
  writeSetFingerprint: string;
  batchFingerprint: string;
  runtimeActivation: false;
  typesense: false;
  alerts: false;
};

export type PublicSearchEligibilityFirstWriteReadinessResult = {
  status: PublicSearchEligibilityFirstWriteReadinessStatus;
  reasons: PublicSearchEligibilityFirstWriteReadinessReason[];
  recommendedFirstWriteBatchSize: number;
  recommendedFirstWriteContent: 'ONLY_CERTIFIED_ELIGIBLE';
  writeProof: PublicSearchEligibilityFirstWriteProof;
  futureWriteCommand: PublicSearchEligibilityFutureWriteCommandContract;
  postWriteCertification: PublicSearchEligibilityPostWriteCertificationContract;
  rollbackReadiness: PublicSearchEligibilityRollbackReadiness;
  executiveAuthorizationTemplate: PublicSearchEligibilityExecutiveAuthorizationTemplate | null;
  stopThresholds: {
    identityMismatchTolerance: 0;
    missingRowTolerance: 0;
    stateDriftTolerance: 0;
    attemptedWriteOutsideWhitelistTolerance: 0;
    batchFingerprintMismatchTolerance: 0;
    runtimeActivationEnabledTolerance: 0;
    typesenseMutationObservedTolerance: 0;
    alertMutationObservedTolerance: 0;
  };
  zeroSideEffects: {
    databaseWritesPerformed: false;
    providerCallsPerformed: false;
    runtimeActivationPerformed: false;
    typesenseMutationPerformed: false;
    alertMutationPerformed: false;
  };
};

const DEFAULT_FIRST_WRITE_BATCH_SIZE = 100;

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).sort(([left], [right]) => left.localeCompare(right));
    return `{${entries.map(([key, entry]) => `${JSON.stringify(key)}:${stableStringify(entry)}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function fingerprint(value: unknown) {
  return crypto.createHash('sha256').update(stableStringify(value)).digest('hex');
}

function emptyTargetStateCounts(): Record<PublicSearchEligibilityState, number> {
  return {
    [PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedEligible]: 0,
    [PUBLIC_SEARCH_ELIGIBILITY_STATES.publicScopeUnverified]: 0,
    [PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedIneligible]: 0,
  };
}

function countDuplicateIds(ids: readonly string[]) {
  return ids.length - new Set(ids).size;
}

function batchHasOnlyCertifiedEligible(batch: PublicSearchEligibilityTransitionBatch | null) {
  return Boolean(
    batch &&
      batch.entries.length > 0 &&
      batch.entries.every(
        (entry) =>
          entry.action === 'SET_CERTIFIED_ELIGIBLE' &&
          entry.proposedEligibility === PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedEligible,
      ),
  );
}

function buildAuthorizationTemplate(input: {
  snapshotFingerprint: string | null;
  planFingerprint: string;
  writeSetFingerprint: string;
  batchFingerprint: string | null;
  maximumWriteCount: number;
}): PublicSearchEligibilityExecutiveAuthorizationTemplate | null {
  if (!input.snapshotFingerprint || !input.batchFingerprint) return null;

  return {
    when: 'After MLS Grid support clears rate-governed live snapshot traversal and Executive HQ supplies exact fingerprints.',
    what: 'Execute the first bounded compare-and-set publicSearchEligibility write batch.',
    where: '/Users/davidquinn/david-quinn-group/colorado-real-estate on branch main',
    maximumWriteCount: input.maximumWriteCount,
    allowedField: 'publicSearchEligibility',
    providerSnapshotFingerprint: input.snapshotFingerprint,
    planFingerprint: input.planFingerprint,
    writeSetFingerprint: input.writeSetFingerprint,
    batchFingerprint: input.batchFingerprint,
    runtimeActivation: false,
    typesense: false,
    alerts: false,
  };
}

export function evaluatePublicSearchEligibilityFirstWriteReadiness(
  input: PublicSearchEligibilityFirstWriteReadinessInput,
): PublicSearchEligibilityFirstWriteReadinessResult {
  const reasons: PublicSearchEligibilityFirstWriteReadinessReason[] = [];
  const maximumAllowedFirstWriteCount = input.maximumAllowedFirstWriteCount ?? DEFAULT_FIRST_WRITE_BATCH_SIZE;
  const proposedBatch = input.proposedFirstBatch;
  const batchSize = proposedBatch?.expectedWriteCount ?? 0;
  const targetIds = proposedBatch?.entries.map((entry) => entry.propertyId) ?? [];
  const proposedTargetStateCounts = proposedBatch?.proposedStateCounts ?? emptyTargetStateCounts();
  const expectedBeforeStateCounts = proposedBatch?.expectedBeforeStateCounts ?? {};
  const blockedOrUnresolvedCount = input.dryRun.blockedRows + input.dryRun.conflictingOrDriftedEntries.length;

  if (!input.snapshot.complete) reasons.push('PROVIDER_SNAPSHOT_INCOMPLETE');
  if (!input.snapshot.activeComingSoonScope) reasons.push('SNAPSHOT_SCOPE_NOT_ACTIVE_COMING_SOON');
  if (!input.snapshot.snapshotFingerprint) reasons.push('SNAPSHOT_FINGERPRINT_MISSING');
  if (!input.snapshot.capturedAt) reasons.push('SNAPSHOT_CAPTURE_TIMESTAMP_MISSING');
  if (!input.snapshot.nextLinkTraversalCertified) reasons.push('SNAPSHOT_NEXTLINK_NOT_CERTIFIED');
  if (!input.snapshot.rateGoverned) reasons.push('SNAPSHOT_RATE_GOVERNOR_NOT_CERTIFIED');
  if (!input.snapshot.providerCountCertified) reasons.push('SNAPSHOT_PROVIDER_COUNT_NOT_CERTIFIED');
  if (!input.snapshot.terminalSignalCertified) reasons.push('SNAPSHOT_TERMINAL_SIGNAL_NOT_CERTIFIED');
  if (!input.snapshot.uniqueIdentityPopulationCertified) reasons.push('SNAPSHOT_UNIQUE_IDENTITY_NOT_CERTIFIED');

  if (!input.allowProviderHoldOverride && (!input.providerSafety.mlsGridRateLimitClarified || input.providerSafety.mlsGridLiveCallsPaused)) {
    reasons.push('MLS_GRID_RATE_LIMIT_CLARIFICATION_PENDING');
  }

  if (!input.certifiedPlan.certified) reasons.push('CERTIFIED_PLAN_NOT_CERTIFIED');
  if (!input.certifiedPlan.planFingerprint) reasons.push('PLAN_FINGERPRINT_MISSING');
  if (!input.dryRun.writeSetFingerprint) reasons.push('WRITE_SET_FINGERPRINT_MISSING');
  if (input.dryRun.blockedRows > 0) reasons.push('BLOCKED_POPULATION_PRESENT');
  if (input.dryRun.conflictingOrDriftedEntries.length > 0) reasons.push('DRY_RUN_BEFORE_STATE_CONFLICT');

  const dbDistributionTotal =
    input.currentDbDistribution.nullCount +
    input.currentDbDistribution.certifiedEligibleCount +
    input.currentDbDistribution.publicScopeUnverifiedCount +
    input.currentDbDistribution.certifiedIneligibleCount;
  if (dbDistributionTotal !== input.currentDbDistribution.totalPropertyRows) reasons.push('DB_DISTRIBUTION_TOTAL_MISMATCH');
  if (input.currentDbDistribution.targetPropertyIds.length !== input.dryRun.writableRows) reasons.push('DB_TARGET_IDS_MISMATCH');
  if (stableStringify(input.currentDbDistribution.expectedBeforeStateCounts) !== stableStringify(input.dryRun.expectedBeforeStateDistribution)) {
    reasons.push('DB_BEFORE_STATE_DISTRIBUTION_MISMATCH');
  }

  if (!proposedBatch) reasons.push('BATCH_MISSING');
  if (!Number.isInteger(input.requestedBatchSize) || input.requestedBatchSize < 1) reasons.push('BATCH_SIZE_INVALID');
  if (batchSize > maximumAllowedFirstWriteCount || input.requestedBatchSize > maximumAllowedFirstWriteCount) reasons.push('BATCH_TOO_LARGE');
  if (proposedBatch && !proposedBatch.fingerprint) reasons.push('BATCH_FINGERPRINT_MISSING');
  if (countDuplicateIds(targetIds) > 0) reasons.push('DUPLICATE_BATCH_PROPERTY_ID');
  if (!batchHasOnlyCertifiedEligible(proposedBatch)) reasons.push('INVALID_TARGET_ACTION');

  if (input.runtime.runtimeEligibilityPredicateActive) reasons.push('RUNTIME_ACTIVATION_ENABLED');
  if (!input.runtime.legacyRuntimeStillActive) reasons.push('RUNTIME_LEGACY_DISABLED');
  if (input.typesense.mutationEnabled) reasons.push('TYPESENSE_MUTATION_ENABLED');
  if (input.typesense.rebuildQueued) reasons.push('TYPESENSE_REBUILD_QUEUED');
  if (input.alerts.savedSearchEligibilityChanged) reasons.push('SAVED_SEARCH_CHANGED');
  if (input.alerts.alertMutationEnabled) reasons.push('ALERT_MUTATION_ENABLED');
  if (input.alerts.alertQueueEnabled) reasons.push('ALERT_QUEUE_ENABLED');
  if (input.alerts.emailSendEnabled) reasons.push('EMAIL_SEND_ENABLED');
  if (input.providerSafety.lightBoxCallsConsumed !== 0) reasons.push('UNEXPECTED_LIGHTBOX_CALLS');
  if (input.providerSafety.attomPendingProviderResponse) reasons.push('ATTOM_PROVIDER_RESPONSE_NOT_RESOLVED_FOR_WRITE');

  const writeProof: PublicSearchEligibilityFirstWriteProof = {
    snapshotFingerprint: input.snapshot.snapshotFingerprint,
    planFingerprint: input.certifiedPlan.planFingerprint,
    writeSetFingerprint: input.dryRun.writeSetFingerprint,
    batchFingerprint: proposedBatch?.fingerprint ?? null,
    batchSize,
    exactPropertyIdCount: targetIds.length,
    expectedBeforeStateCounts,
    proposedTargetStateCounts,
    blockedOrUnresolvedCount,
    runtimeActivation: false,
    typesenseMutation: false,
    alertsEnabled: false,
  };

  const rollbackReadiness: PublicSearchEligibilityRollbackReadiness = {
    compareAndSetRollbackRequired: true,
    rollbackFingerprint: fingerprint({
      batchFingerprint: writeProof.batchFingerprint,
      expectedBeforeStateCounts,
      proposedTargetStateCounts,
      targetIds,
    }),
    requiresCurrentStateEqualsJustWrittenTarget: true,
    blindBulkRestoreAllowed: false,
  };

  const status: PublicSearchEligibilityFirstWriteReadinessStatus = reasons.length === 0 ? 'READY_TO_WRITE' : 'NOT_READY_TO_WRITE';

  return {
    status,
    reasons: status === 'READY_TO_WRITE' ? ['READY_ALL_PREREQUISITES_PRESENT'] : reasons,
    recommendedFirstWriteBatchSize: Math.min(DEFAULT_FIRST_WRITE_BATCH_SIZE, maximumAllowedFirstWriteCount),
    recommendedFirstWriteContent: 'ONLY_CERTIFIED_ELIGIBLE',
    writeProof,
    futureWriteCommand: {
      command:
        'npm run run:public-search-eligibility-first-write -- --plan-fingerprint <plan> --write-set-fingerprint <write-set> --batch-fingerprint <batch>',
      acceptsCertifiedPlanFingerprint: true,
      acceptsWriteSetFingerprint: true,
      acceptsExplicitBatchFingerprint: true,
      compareAndSetSemantics: true,
      allowedField: 'publicSearchEligibility',
      abortsOnFingerprintMismatch: true,
      abortsOnBeforeStateDrift: true,
      reportsPerRowOutcomes: true,
      broadUpdateManyAllowed: false,
      implementationRequiredBeforeExecution: true,
    },
    postWriteCertification: {
      appliedCountRequired: true,
      noChangeCountRequired: true,
      blockedCountRequired: true,
      failedCountRequired: true,
      eligibilityDistributionDeltaRequired: true,
      propertyTotalUnchangedRequired: true,
      statusUnchangedRequired: true,
      privateExclusiveUnchangedRequired: true,
      noTypesenseMutationRequired: true,
      noSearchActivationRequired: true,
      noAlertOrEmailRequired: true,
      runtimeRemainsLegacyRequired: true,
    },
    rollbackReadiness,
    executiveAuthorizationTemplate: buildAuthorizationTemplate({
      snapshotFingerprint: writeProof.snapshotFingerprint,
      planFingerprint: writeProof.planFingerprint,
      writeSetFingerprint: writeProof.writeSetFingerprint,
      batchFingerprint: writeProof.batchFingerprint,
      maximumWriteCount: maximumAllowedFirstWriteCount,
    }),
    stopThresholds: {
      identityMismatchTolerance: 0,
      missingRowTolerance: 0,
      stateDriftTolerance: 0,
      attemptedWriteOutsideWhitelistTolerance: 0,
      batchFingerprintMismatchTolerance: 0,
      runtimeActivationEnabledTolerance: 0,
      typesenseMutationObservedTolerance: 0,
      alertMutationObservedTolerance: 0,
    },
    zeroSideEffects: {
      databaseWritesPerformed: false,
      providerCallsPerformed: false,
      runtimeActivationPerformed: false,
      typesenseMutationPerformed: false,
      alertMutationPerformed: false,
    },
  };
}
