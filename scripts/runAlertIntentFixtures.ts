import { evaluateAlertIntent } from '../lib/alerts/intent/evaluateAlertIntent.js';
import {
  ALERT_INTENT_BASELINE_SHA,
  ALERT_INTENT_EXPECTED_CASE_COUNT,
  alertIntentFixtures,
  allAlertIntentReasonCodes,
} from '../lib/alerts/intent/fixtures.js';
import type { AlertIntentReasonCode, AlertIntentResult } from '../lib/alerts/intent/types.js';

type FixtureDryRunOutput = {
  status: 'SUCCESS' | 'FAILURE';
  mode: 'FIXTURE_ONLY_NO_SIDE_EFFECT';
  baselineSha: string;
  casesEvaluated: number;
  reasonCodeCounts: Record<AlertIntentReasonCode, number>;
  matchCount: number;
  nonMatchCount: number;
  dedupeCount: number;
  ineligibleCount: number;
  staleBlockedCount: number;
  payloadIntentCount: number;
  queueIntentCount: number;
  renderReadyCount: number;
  deliveryBlockedCount: number;
  databaseReads: 0;
  databaseRowsCreated: 0;
  databaseRowsMutated: 0;
  queueJobsCreated: 0;
  queueJobsChanged: 0;
  providerCalls: 0;
  emailLogRowsCreated: 0;
  unsubscribeTokensCreated: 0;
  workersActivated: 0;
  customerDataExposed: 0;
};

function emptyReasonCodeCounts(): Record<AlertIntentReasonCode, number> {
  return Object.fromEntries(allAlertIntentReasonCodes.map((reason) => [reason, 0])) as Record<AlertIntentReasonCode, number>;
}

function assertExpectedResult(result: AlertIntentResult, fixtureName: string, expectedReasonCodes: readonly AlertIntentReasonCode[]) {
  const actual = result.reasonCodes.join('|');
  const expected = expectedReasonCodes.join('|');

  if (actual !== expected) {
    throw new Error(`Fixture "${fixtureName}" returned ${actual || 'NO_REASON'} instead of ${expected || 'NO_REASON'}.`);
  }
}

function runFixtureDryRun(): FixtureDryRunOutput {
  if (alertIntentFixtures.length !== ALERT_INTENT_EXPECTED_CASE_COUNT) {
    throw new Error(`Expected ${ALERT_INTENT_EXPECTED_CASE_COUNT} alert-intent fixtures; found ${alertIntentFixtures.length}.`);
  }

  const reasonCodeCounts = emptyReasonCodeCounts();
  const results = alertIntentFixtures.map((fixture) => {
    const first = evaluateAlertIntent(fixture.input);
    const second = evaluateAlertIntent(fixture.input);

    assertExpectedResult(first, fixture.name, fixture.expectedReasonCodes);

    if (JSON.stringify(first) !== JSON.stringify(second)) {
      throw new Error(`Fixture "${fixture.name}" produced nondeterministic output.`);
    }

    if (first.terminalDecision !== fixture.expectedTerminalDecision) {
      throw new Error(
        `Fixture "${fixture.name}" returned terminal decision ${first.terminalDecision} instead of ${fixture.expectedTerminalDecision}.`,
      );
    }

    for (const reasonCode of first.reasonCodes) {
      reasonCodeCounts[reasonCode]++;
    }

    return first;
  });

  return {
    status: 'SUCCESS',
    mode: 'FIXTURE_ONLY_NO_SIDE_EFFECT',
    baselineSha: ALERT_INTENT_BASELINE_SHA,
    casesEvaluated: results.length,
    reasonCodeCounts,
    matchCount: results.filter((result) => result.match).length,
    nonMatchCount: results.filter((result) => result.terminalDecision === 'no_match').length,
    dedupeCount: reasonCodeCounts.DUPLICATE_EVENT,
    ineligibleCount: reasonCodeCounts.SEARCH_INACTIVE + reasonCodeCounts.USER_UNSUBSCRIBED + reasonCodeCounts.USER_MISSING_EMAIL,
    staleBlockedCount: reasonCodeCounts.PROPERTY_STALE,
    payloadIntentCount: results.filter((result) => result.payloadIntent !== null).length,
    queueIntentCount: results.filter((result) => result.queueIntent !== null).length,
    renderReadyCount: results.filter((result) => result.renderReady).length,
    deliveryBlockedCount: reasonCodeCounts.DELIVERY_BLOCKED_NO_SEND_MODE,
    databaseReads: 0,
    databaseRowsCreated: 0,
    databaseRowsMutated: 0,
    queueJobsCreated: 0,
    queueJobsChanged: 0,
    providerCalls: 0,
    emailLogRowsCreated: 0,
    unsubscribeTokensCreated: 0,
    workersActivated: 0,
    customerDataExposed: 0,
  };
}

try {
  console.log(JSON.stringify(runFixtureDryRun(), null, 2));
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
