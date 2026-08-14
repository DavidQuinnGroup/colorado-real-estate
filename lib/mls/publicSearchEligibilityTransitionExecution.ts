import crypto from 'node:crypto';

import {
  type PublicSearchEligibilityInitializationPlan,
  type PublicSearchEligibilityPlanAction,
  type PublicSearchEligibilityPlanReason,
  type PublicSearchEligibilityPlanRow,
} from './publicSearchEligibilityInitializationPlan.js';
import {
  PUBLIC_SEARCH_ELIGIBILITY_STATES,
  type PublicSearchEligibilityState,
} from './publicSearchEligibilityStateContract.js';

export const WRITABLE_PUBLIC_SEARCH_ELIGIBILITY_ACTIONS = [
  'SET_CERTIFIED_ELIGIBLE',
  'SET_PUBLIC_SCOPE_UNVERIFIED',
  'SET_CERTIFIED_INELIGIBLE',
] as const satisfies readonly PublicSearchEligibilityPlanAction[];

export const PUBLIC_SEARCH_ELIGIBILITY_EXECUTION_WRITABLE_FIELDS = ['publicSearchEligibility'] as const;

export const PUBLIC_SEARCH_ELIGIBILITY_EXECUTION_PROHIBITED_FIELDS = [
  'status',
  'isPrivateExclusive',
  'sourceModifiedAt',
  'ListingKey',
  'sourceIdentity',
  'price',
  'updatedAt',
] as const;

export const DEFAULT_PUBLIC_SEARCH_ELIGIBILITY_TRANSITION_BATCH_SIZE = 100;

export type WritablePublicSearchEligibilityAction = (typeof WRITABLE_PUBLIC_SEARCH_ELIGIBILITY_ACTIONS)[number];

export type PublicSearchEligibilityExecutionResultState =
  | 'APPLIED'
  | 'NO_CHANGE'
  | 'BLOCKED_STATE_DRIFT'
  | 'BLOCKED_MISSING_ROW'
  | 'BLOCKED_IDENTITY_MISMATCH'
  | 'FAILED_WRITE';

export type PublicSearchEligibilityTransitionCandidate = {
  propertyId: string;
  sourceIdentityFingerprint: string | null;
  expectedCurrentEligibility: PublicSearchEligibilityState | null;
  proposedEligibility: PublicSearchEligibilityState;
  action: WritablePublicSearchEligibilityAction;
  reason: PublicSearchEligibilityPlanReason;
};

export type PublicSearchEligibilityTransitionBatch = {
  batchIndex: number;
  entries: PublicSearchEligibilityTransitionCandidate[];
  expectedWriteCount: number;
  expectedBeforeStateCounts: Record<string, number>;
  proposedStateCounts: Record<PublicSearchEligibilityState, number>;
  fingerprint: string;
};

export type PublicSearchEligibilityPlanCertificationInput = {
  plan: PublicSearchEligibilityInitializationPlan;
  planIdentity: string;
  expectedPlanFingerprint?: string;
  expectedScopeFingerprint?: string;
  batchSize?: number;
};

export type PublicSearchEligibilityTransitionCertificationIssue = {
  code:
    | 'PLAN_FINGERPRINT_MISMATCH'
    | 'SCOPE_FINGERPRINT_MISMATCH'
    | 'MISSING_PROPERTY_ID'
    | 'DUPLICATE_PROPERTY_ID'
    | 'CONFLICTING_TRANSITION'
    | 'INVALID_WRITABLE_ACTION'
    | 'MISSING_PROPOSED_ELIGIBILITY'
    | 'INVALID_BATCH_SIZE';
  propertyId?: string;
  expected?: string | number | null;
  actual?: string | number | null;
};

export type PublicSearchEligibilityCertifiedTransitionPlan = {
  certified: boolean;
  planIdentity: string;
  planFingerprint: string;
  snapshotScopeFingerprint: string;
  generatedAt: string;
  totalPlanRows: number;
  candidates: PublicSearchEligibilityTransitionCandidate[];
  excludedRows: PublicSearchEligibilityExcludedTransitionRow[];
  batches: PublicSearchEligibilityTransitionBatch[];
  issues: PublicSearchEligibilityTransitionCertificationIssue[];
  writableFields: typeof PUBLIC_SEARCH_ELIGIBILITY_EXECUTION_WRITABLE_FIELDS;
  prohibitedFields: typeof PUBLIC_SEARCH_ELIGIBILITY_EXECUTION_PROHIBITED_FIELDS;
  executionSafety: {
    compareAndSetRequired: true;
    broadUpdateManyAllowed: false;
    statusMutationAllowed: false;
    privacyMutationAllowed: false;
    providerCallsAllowed: false;
    databaseWritesPerformed: false;
    typesenseMutationAllowed: false;
    alertMutationAllowed: false;
  };
};

export type PublicSearchEligibilityExcludedTransitionRow = {
  propertyId: string | null;
  action: PublicSearchEligibilityPlanAction;
  reason: PublicSearchEligibilityPlanReason;
  exclusion: 'NO_CHANGE' | 'BLOCKED' | 'NOT_WRITABLE';
};

export type PublicSearchEligibilityObservedBeforeState = {
  propertyId: string;
  currentEligibility: PublicSearchEligibilityState | null;
  sourceIdentityFingerprint?: string | null;
  exists: boolean;
};

export type PublicSearchEligibilityDryRunInput = {
  certifiedPlan: PublicSearchEligibilityCertifiedTransitionPlan;
  observedBeforeStates?: readonly PublicSearchEligibilityObservedBeforeState[];
  completedBatchCount?: number;
};

export type PublicSearchEligibilityDryRunConflict = {
  propertyId: string;
  expectedCurrentEligibility: PublicSearchEligibilityState | null;
  observedCurrentEligibility: PublicSearchEligibilityState | null;
  resultState: Extract<
    PublicSearchEligibilityExecutionResultState,
    'BLOCKED_STATE_DRIFT' | 'BLOCKED_MISSING_ROW' | 'BLOCKED_IDENTITY_MISMATCH'
  >;
};

export type PublicSearchEligibilityDryRunSummary = {
  totalPlanRows: number;
  writableRows: number;
  blockedRows: number;
  noChangeRows: number;
  batchCount: number;
  perTargetStateCounts: Record<PublicSearchEligibilityState, number>;
  expectedBeforeStateDistribution: Record<string, number>;
  conflictingOrDriftedEntries: PublicSearchEligibilityDryRunConflict[];
  writeSetFingerprint: string;
  nextBatchIndex: number | null;
  replaySafeCompletedBatchCount: number;
  databaseWritesPerformed: false;
  providerCallsPerformed: false;
  typesenseMutationsPerformed: false;
  alertMutationsPerformed: false;
};

export type PublicSearchEligibilityBatchCheckpoint = {
  planFingerprint: string;
  lastCompletedBatchIndex: number | null;
  nextBatchIndex: number | null;
  completedBatchFingerprints: readonly string[];
  resumeRequiresBeforeStateRevalidation: true;
  replaySafe: true;
};

export type PublicSearchEligibilityFutureBatchResult = {
  batchIndex: number;
  batchFingerprint: string;
  expectedWriteCount: number;
  appliedCount: number;
  resultState: 'APPLIED' | 'FAILED_WRITE';
  rowResults: readonly PublicSearchEligibilityFutureRowResult[];
  unresolvedRemainderPropertyIds: readonly string[];
};

export type PublicSearchEligibilityFutureRowResult = {
  propertyId: string;
  expectedCurrentEligibility: PublicSearchEligibilityState | null;
  proposedEligibility: PublicSearchEligibilityState;
  resultState: PublicSearchEligibilityExecutionResultState;
};

export type PublicSearchEligibilityCompareAndSetRollbackRecord = {
  propertyId: string;
  rollbackFrom: PublicSearchEligibilityState;
  rollbackTo: PublicSearchEligibilityState | null;
  rollbackAllowedOnlyIfCurrentStateEquals: PublicSearchEligibilityState;
};

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

function sourceIdentityFingerprint(value: string | null) {
  return value ? fingerprint({ sourceIdentity: value }) : null;
}

function isWritableAction(action: PublicSearchEligibilityPlanAction): action is WritablePublicSearchEligibilityAction {
  return WRITABLE_PUBLIC_SEARCH_ELIGIBILITY_ACTIONS.includes(action as WritablePublicSearchEligibilityAction);
}

function stateCountKey(state: PublicSearchEligibilityState | null) {
  return state ?? 'NULL';
}

function createStateCounts(): Record<PublicSearchEligibilityState, number> {
  return {
    [PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedEligible]: 0,
    [PUBLIC_SEARCH_ELIGIBILITY_STATES.publicScopeUnverified]: 0,
    [PUBLIC_SEARCH_ELIGIBILITY_STATES.certifiedIneligible]: 0,
  };
}

function incrementCount<T extends string>(counts: Record<T, number>, key: T) {
  counts[key] = (counts[key] ?? 0) + 1;
}

function buildPlanFingerprint(plan: PublicSearchEligibilityInitializationPlan) {
  return fingerprint({
    rows: plan.rows.map((row) => ({
      action: row.action,
      currentEligibility: row.currentEligibility,
      propertyId: row.propertyId,
      proposedEligibility: row.proposedEligibility,
      reason: row.reason,
      sourceIdentityFingerprint: sourceIdentityFingerprint(row.sourceIdentity),
    })),
    snapshot: plan.snapshot,
    summary: plan.summary,
  });
}

function candidateSignature(candidate: PublicSearchEligibilityTransitionCandidate) {
  return stableStringify({
    action: candidate.action,
    expectedCurrentEligibility: candidate.expectedCurrentEligibility,
    proposedEligibility: candidate.proposedEligibility,
  });
}

function excludeRow(
  row: PublicSearchEligibilityPlanRow,
  exclusion: PublicSearchEligibilityExcludedTransitionRow['exclusion'],
): PublicSearchEligibilityExcludedTransitionRow {
  return {
    propertyId: row.propertyId.trim() || null,
    action: row.action,
    reason: row.reason,
    exclusion,
  };
}

function buildBatch(
  entries: PublicSearchEligibilityTransitionCandidate[],
  batchIndex: number,
): PublicSearchEligibilityTransitionBatch {
  const expectedBeforeStateCounts: Record<string, number> = {};
  const proposedStateCounts = createStateCounts();

  for (const entry of entries) {
    expectedBeforeStateCounts[stateCountKey(entry.expectedCurrentEligibility)] =
      (expectedBeforeStateCounts[stateCountKey(entry.expectedCurrentEligibility)] ?? 0) + 1;
    incrementCount(proposedStateCounts, entry.proposedEligibility);
  }

  return {
    batchIndex,
    entries,
    expectedWriteCount: entries.length,
    expectedBeforeStateCounts,
    proposedStateCounts,
    fingerprint: fingerprint({
      batchIndex,
      entries,
      expectedBeforeStateCounts,
      proposedStateCounts,
    }),
  };
}

function buildBatches(candidates: PublicSearchEligibilityTransitionCandidate[], batchSize: number) {
  const batches: PublicSearchEligibilityTransitionBatch[] = [];

  for (let start = 0; start < candidates.length; start += batchSize) {
    batches.push(buildBatch(candidates.slice(start, start + batchSize), batches.length));
  }

  return batches;
}

export function certifyPublicSearchEligibilityTransitionPlan(
  input: PublicSearchEligibilityPlanCertificationInput,
): PublicSearchEligibilityCertifiedTransitionPlan {
  const batchSize = input.batchSize ?? DEFAULT_PUBLIC_SEARCH_ELIGIBILITY_TRANSITION_BATCH_SIZE;
  const planFingerprint = buildPlanFingerprint(input.plan);
  const issues: PublicSearchEligibilityTransitionCertificationIssue[] = [];
  const excludedRows: PublicSearchEligibilityExcludedTransitionRow[] = [];
  const candidates: PublicSearchEligibilityTransitionCandidate[] = [];
  const seenCandidates = new Map<string, PublicSearchEligibilityTransitionCandidate>();

  if (!Number.isInteger(batchSize) || batchSize < 1 || batchSize > DEFAULT_PUBLIC_SEARCH_ELIGIBILITY_TRANSITION_BATCH_SIZE) {
    issues.push({
      code: 'INVALID_BATCH_SIZE',
      expected: `1-${DEFAULT_PUBLIC_SEARCH_ELIGIBILITY_TRANSITION_BATCH_SIZE}`,
      actual: batchSize,
    });
  }

  if (input.expectedPlanFingerprint && input.expectedPlanFingerprint !== planFingerprint) {
    issues.push({
      code: 'PLAN_FINGERPRINT_MISMATCH',
      expected: input.expectedPlanFingerprint,
      actual: planFingerprint,
    });
  }

  if (input.expectedScopeFingerprint && input.expectedScopeFingerprint !== input.plan.snapshot.scopeFingerprint) {
    issues.push({
      code: 'SCOPE_FINGERPRINT_MISMATCH',
      expected: input.expectedScopeFingerprint,
      actual: input.plan.snapshot.scopeFingerprint,
    });
  }

  for (const row of input.plan.rows) {
    const propertyId = row.propertyId.trim();

    if (!isWritableAction(row.action)) {
      excludedRows.push(excludeRow(row, row.action === 'NO_CHANGE' ? 'NO_CHANGE' : 'BLOCKED'));
      continue;
    }

    if (!propertyId) {
      issues.push({ code: 'MISSING_PROPERTY_ID', actual: row.propertyId });
      continue;
    }

    if (!row.proposedEligibility) {
      issues.push({ code: 'MISSING_PROPOSED_ELIGIBILITY', propertyId });
      continue;
    }

    const candidate: PublicSearchEligibilityTransitionCandidate = {
      propertyId,
      sourceIdentityFingerprint: sourceIdentityFingerprint(row.sourceIdentity),
      expectedCurrentEligibility: row.currentEligibility,
      proposedEligibility: row.proposedEligibility,
      action: row.action,
      reason: row.reason,
    };
    const previous = seenCandidates.get(propertyId);

    if (previous) {
      issues.push({ code: 'DUPLICATE_PROPERTY_ID', propertyId });
      if (candidateSignature(previous) !== candidateSignature(candidate)) {
        issues.push({ code: 'CONFLICTING_TRANSITION', propertyId });
      }
      continue;
    }

    seenCandidates.set(propertyId, candidate);
    candidates.push(candidate);
  }

  const sortedCandidates = [...candidates].sort((left, right) => left.propertyId.localeCompare(right.propertyId));
  const batches = issues.some((issue) => issue.code === 'INVALID_BATCH_SIZE') ? [] : buildBatches(sortedCandidates, batchSize);

  return {
    certified: issues.length === 0,
    planIdentity: input.planIdentity,
    planFingerprint,
    snapshotScopeFingerprint: input.plan.snapshot.scopeFingerprint,
    generatedAt: input.plan.snapshot.capturedAt,
    totalPlanRows: input.plan.rows.length,
    candidates: sortedCandidates,
    excludedRows,
    batches,
    issues,
    writableFields: PUBLIC_SEARCH_ELIGIBILITY_EXECUTION_WRITABLE_FIELDS,
    prohibitedFields: PUBLIC_SEARCH_ELIGIBILITY_EXECUTION_PROHIBITED_FIELDS,
    executionSafety: {
      compareAndSetRequired: true,
      broadUpdateManyAllowed: false,
      statusMutationAllowed: false,
      privacyMutationAllowed: false,
      providerCallsAllowed: false,
      databaseWritesPerformed: false,
      typesenseMutationAllowed: false,
      alertMutationAllowed: false,
    },
  };
}

export function dryRunPublicSearchEligibilityTransitionExecution(
  input: PublicSearchEligibilityDryRunInput,
): PublicSearchEligibilityDryRunSummary {
  const observed = new Map(input.observedBeforeStates?.map((state) => [state.propertyId, state]) ?? []);
  const conflicts: PublicSearchEligibilityDryRunConflict[] = [];
  const perTargetStateCounts = createStateCounts();
  const expectedBeforeStateDistribution: Record<string, number> = {};
  const completedBatchCount = input.completedBatchCount ?? 0;
  const nextBatchIndex = completedBatchCount >= input.certifiedPlan.batches.length ? null : completedBatchCount;

  for (const candidate of input.certifiedPlan.candidates) {
    incrementCount(perTargetStateCounts, candidate.proposedEligibility);
    expectedBeforeStateDistribution[stateCountKey(candidate.expectedCurrentEligibility)] =
      (expectedBeforeStateDistribution[stateCountKey(candidate.expectedCurrentEligibility)] ?? 0) + 1;

    const observedState = observed.get(candidate.propertyId);
    if (!observedState) continue;

    if (!observedState.exists) {
      conflicts.push({
        propertyId: candidate.propertyId,
        expectedCurrentEligibility: candidate.expectedCurrentEligibility,
        observedCurrentEligibility: null,
        resultState: 'BLOCKED_MISSING_ROW',
      });
      continue;
    }

    if (
      candidate.sourceIdentityFingerprint &&
      observedState.sourceIdentityFingerprint &&
      candidate.sourceIdentityFingerprint !== observedState.sourceIdentityFingerprint
    ) {
      conflicts.push({
        propertyId: candidate.propertyId,
        expectedCurrentEligibility: candidate.expectedCurrentEligibility,
        observedCurrentEligibility: observedState.currentEligibility,
        resultState: 'BLOCKED_IDENTITY_MISMATCH',
      });
      continue;
    }

    if (observedState.currentEligibility !== candidate.expectedCurrentEligibility) {
      conflicts.push({
        propertyId: candidate.propertyId,
        expectedCurrentEligibility: candidate.expectedCurrentEligibility,
        observedCurrentEligibility: observedState.currentEligibility,
        resultState: 'BLOCKED_STATE_DRIFT',
      });
    }
  }

  return {
    totalPlanRows: input.certifiedPlan.totalPlanRows,
    writableRows: input.certifiedPlan.candidates.length,
    blockedRows: input.certifiedPlan.excludedRows.filter((row) => row.exclusion === 'BLOCKED').length + input.certifiedPlan.issues.length,
    noChangeRows: input.certifiedPlan.excludedRows.filter((row) => row.exclusion === 'NO_CHANGE').length,
    batchCount: input.certifiedPlan.batches.length,
    perTargetStateCounts,
    expectedBeforeStateDistribution,
    conflictingOrDriftedEntries: conflicts,
    writeSetFingerprint: fingerprint(input.certifiedPlan.candidates),
    nextBatchIndex,
    replaySafeCompletedBatchCount: Math.min(completedBatchCount, input.certifiedPlan.batches.length),
    databaseWritesPerformed: false,
    providerCallsPerformed: false,
    typesenseMutationsPerformed: false,
    alertMutationsPerformed: false,
  };
}

export function buildPublicSearchEligibilityBatchCheckpoint(
  certifiedPlan: PublicSearchEligibilityCertifiedTransitionPlan,
  completedBatchCount: number,
): PublicSearchEligibilityBatchCheckpoint {
  const boundedCompletedCount = Math.min(Math.max(completedBatchCount, 0), certifiedPlan.batches.length);
  const completedBatches = certifiedPlan.batches.slice(0, boundedCompletedCount);

  return {
    planFingerprint: certifiedPlan.planFingerprint,
    lastCompletedBatchIndex: boundedCompletedCount === 0 ? null : boundedCompletedCount - 1,
    nextBatchIndex: boundedCompletedCount >= certifiedPlan.batches.length ? null : boundedCompletedCount,
    completedBatchFingerprints: completedBatches.map((batch) => batch.fingerprint),
    resumeRequiresBeforeStateRevalidation: true,
    replaySafe: true,
  };
}

export function representPublicSearchEligibilityBatchFailure(input: {
  batch: PublicSearchEligibilityTransitionBatch;
  appliedPropertyIds?: readonly string[];
  failedPropertyIds: readonly string[];
}): PublicSearchEligibilityFutureBatchResult {
  const applied = new Set(input.appliedPropertyIds ?? []);
  const failed = new Set(input.failedPropertyIds);

  return {
    batchIndex: input.batch.batchIndex,
    batchFingerprint: input.batch.fingerprint,
    expectedWriteCount: input.batch.expectedWriteCount,
    appliedCount: applied.size,
    resultState: 'FAILED_WRITE',
    rowResults: input.batch.entries.map((entry) => ({
      propertyId: entry.propertyId,
      expectedCurrentEligibility: entry.expectedCurrentEligibility,
      proposedEligibility: entry.proposedEligibility,
      resultState: applied.has(entry.propertyId) ? 'APPLIED' : failed.has(entry.propertyId) ? 'FAILED_WRITE' : 'NO_CHANGE',
    })),
    unresolvedRemainderPropertyIds: input.batch.entries
      .filter((entry) => !applied.has(entry.propertyId))
      .map((entry) => entry.propertyId),
  };
}

export function buildCompareAndSetRollbackRecord(
  candidate: PublicSearchEligibilityTransitionCandidate,
): PublicSearchEligibilityCompareAndSetRollbackRecord {
  return {
    propertyId: candidate.propertyId,
    rollbackFrom: candidate.proposedEligibility,
    rollbackTo: candidate.expectedCurrentEligibility,
    rollbackAllowedOnlyIfCurrentStateEquals: candidate.proposedEligibility,
  };
}
