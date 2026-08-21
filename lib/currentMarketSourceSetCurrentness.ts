export const REIE_CURRENT_MARKET_SOURCE_SET_CURRENTNESS_STATUS = 'REIE_CURRENT_MARKET_SOURCE_SET_CURRENTNESS_CONTRACT_CERTIFIED' as const;

export type CurrentMarketSourceSetCompletionState = 'COMPLETE' | 'PARTIAL' | 'FAILED';
export type CurrentMarketSourceSetTerminalSignal = 'NEXT_LINK_ABSENT' | 'EMPTY_PAGE' | 'NOT_TERMINAL';

export type CurrentMarketSourceSetCompletion = Readonly<{
  sourceSetId: string;
  syncRunId: string;
  startedAt: string | Date;
  completedAt: string | Date | null;
  completionState: CurrentMarketSourceSetCompletionState;
  sourceCutoffAt: string | Date | null;
  sourceReportedRecordCount: number | null;
  recordsFetched: number;
  recordsProcessed: number;
  pagesProcessed: number;
  terminalSignal: CurrentMarketSourceSetTerminalSignal;
  errorCount: number;
}>;

export type CurrentMarketSourceSetCurrentnessResult = Readonly<{
  certified: boolean;
  state: 'CERTIFIED_SOURCE_SET_CURRENTNESS' | 'SOURCE_SET_NOT_CERTIFIED';
  sourceSetCurrentAsOf: string | null;
  sourceCutoffAt: string | null;
  reasons: readonly string[];
}>;

function text(value: string) {
  return value.trim();
}

function date(value: string | Date | null) {
  if (value instanceof Date) return Number.isFinite(value.getTime()) ? value : null;
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isFinite(parsed.getTime()) ? parsed : null;
}

function nonNegativeInteger(value: number) {
  return Number.isInteger(value) && value >= 0;
}

export function evaluateCurrentMarketSourceSetCurrentness(
  sourceSet: CurrentMarketSourceSetCompletion,
  computedAt: string | Date,
): CurrentMarketSourceSetCurrentnessResult {
  const reasons: string[] = [];
  const startedAt = date(sourceSet.startedAt);
  const completedAt = date(sourceSet.completedAt);
  const sourceCutoffAt = date(sourceSet.sourceCutoffAt);
  const aggregateComputedAt = date(computedAt);

  if (!text(sourceSet.sourceSetId)) reasons.push('SOURCE_SET_ID_REQUIRED');
  if (!text(sourceSet.syncRunId)) reasons.push('SYNC_RUN_ID_REQUIRED');
  if (!startedAt) reasons.push('SYNC_STARTED_AT_REQUIRED');
  if (!completedAt) reasons.push('SYNC_COMPLETED_AT_REQUIRED');
  if (!sourceCutoffAt) reasons.push('SOURCE_CUTOFF_REQUIRED');
  if (!aggregateComputedAt) reasons.push('AGGREGATE_COMPUTED_AT_INVALID');
  if (startedAt && completedAt && completedAt < startedAt) reasons.push('SYNC_COMPLETION_PRECEDES_START');
  if (completedAt && aggregateComputedAt && aggregateComputedAt < completedAt) reasons.push('AGGREGATE_COMPUTED_BEFORE_SOURCE_SET_COMPLETION');
  if (sourceSet.completionState !== 'COMPLETE') reasons.push('SOURCE_SET_COMPLETION_REQUIRED');
  if (sourceSet.terminalSignal === 'NOT_TERMINAL') reasons.push('TERMINAL_SOURCE_TRAVERSAL_REQUIRED');
  if (sourceSet.errorCount !== 0) reasons.push('SOURCE_SET_ERRORS_PRESENT');
  if (!nonNegativeInteger(sourceSet.recordsFetched) || !nonNegativeInteger(sourceSet.recordsProcessed) || !nonNegativeInteger(sourceSet.pagesProcessed)) {
    reasons.push('SOURCE_SET_COUNTER_INVALID');
  }
  if (sourceSet.recordsProcessed > sourceSet.recordsFetched) reasons.push('PROCESSED_RECORD_COUNT_EXCEEDS_FETCHED');
  if (sourceSet.pagesProcessed < 1) reasons.push('SOURCE_SET_PAGE_EVIDENCE_REQUIRED');
  if (sourceSet.sourceReportedRecordCount !== null && (!nonNegativeInteger(sourceSet.sourceReportedRecordCount) || sourceSet.recordsFetched > sourceSet.sourceReportedRecordCount)) {
    reasons.push('SOURCE_REPORTED_COUNT_INVALID');
  }

  const certified = reasons.length === 0;
  return Object.freeze({
    certified,
    state: certified ? 'CERTIFIED_SOURCE_SET_CURRENTNESS' : 'SOURCE_SET_NOT_CERTIFIED',
    sourceSetCurrentAsOf: certified && completedAt ? completedAt.toISOString() : null,
    sourceCutoffAt: certified && sourceCutoffAt ? sourceCutoffAt.toISOString() : null,
    reasons: Object.freeze(reasons.sort()),
  });
}
