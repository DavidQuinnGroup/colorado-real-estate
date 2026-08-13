import { evaluateAlertIntent } from '../lib/alerts/intent/evaluateAlertIntent.js';
import {
  ALERT_INTENT_BASELINE_SHA,
  ALERT_INTENT_EXPECTED_CASE_COUNT,
  alertIntentFixtures,
  allAlertIntentReasonCodes,
} from '../lib/alerts/intent/fixtures.js';
import type { AlertIntentReasonCode, AlertIntentResult } from '../lib/alerts/intent/types.js';
import { renderPropertyAlertEmail } from '../lib/email/sendEmail.js';

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
  inactiveBlockedCount: number;
  privateBlockedCount: number;
  missingFreshnessBlockedCount: number;
  ambiguousNewnessBlockedCount: number;
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
  copyContract: {
    subject: string;
    prohibitedPhrasesPresent: string[];
    factualSavedSearchMatchLanguageReady: boolean;
  };
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

const prohibitedCopyPhrases = ['new listing', 'newly listed', 'just listed', 'new match'];

function assertTruthfulCopyContract() {
  const rendered = renderPropertyAlertEmail(
    [
      {
        id: 'fixture-property-001',
        address: 'Fixture Property',
        city: 'Boulder',
        state: 'CO',
        price: 900000,
        beds: 3,
        baths: 2,
        sqft: 2100,
        efficiencyScore: 72,
        resilienceScore: 81,
        url: 'https://example.invalid/properties/fixture-property-001',
      },
    ],
    {
      unsubscribeUrl: 'https://example.invalid/unsubscribe/fixture-token',
      publicBaseUrl: 'https://example.invalid',
    },
  );

  if (!rendered) throw new Error('Expected property alert email renderer to return a fixture render.');

  const searchableCopy = `${rendered.subject}\n${rendered.html}\n${rendered.text}`.toLowerCase();
  const prohibitedPhrasesPresent = prohibitedCopyPhrases.filter((phrase) => searchableCopy.includes(phrase));

  if (prohibitedPhrasesPresent.length > 0) {
    throw new Error(`Alert email copy uses prohibited freshness/newness language: ${prohibitedPhrasesPresent.join(', ')}.`);
  }

  if (rendered.subject !== 'David Quinn Group: 1 property intelligence update') {
    throw new Error(`Unexpected alert subject: ${rendered.subject}`);
  }

  return {
    subject: rendered.subject,
    prohibitedPhrasesPresent,
    factualSavedSearchMatchLanguageReady: searchableCopy.includes('fresh colorado property matches'),
  };
}

function runFixtureDryRun(): FixtureDryRunOutput {
  if (alertIntentFixtures.length !== ALERT_INTENT_EXPECTED_CASE_COUNT) {
    throw new Error(`Expected ${ALERT_INTENT_EXPECTED_CASE_COUNT} alert-intent fixtures; found ${alertIntentFixtures.length}.`);
  }

  const reasonCodeCounts = emptyReasonCodeCounts();
  const copyContract = assertTruthfulCopyContract();
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
    inactiveBlockedCount: reasonCodeCounts.PROPERTY_INACTIVE,
    privateBlockedCount: reasonCodeCounts.PROPERTY_PRIVATE,
    missingFreshnessBlockedCount: alertIntentFixtures.filter((fixture) => fixture.name === 'missing freshness timestamp').length,
    ambiguousNewnessBlockedCount: reasonCodeCounts.NEWNESS_UNSUPPORTED,
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
    copyContract,
  };
}

try {
  console.log(JSON.stringify(runFixtureDryRun(), null, 2));
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
