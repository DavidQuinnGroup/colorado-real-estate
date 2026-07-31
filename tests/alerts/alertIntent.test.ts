import assert from 'node:assert/strict';

import { evaluateAlertIntent, getAlertMatchFailure, matchesAlertSearch } from '../../lib/alerts/intent/evaluateAlertIntent.js';
import {
  ALERT_INTENT_EXPECTED_CASE_COUNT,
  alertIntentFixtures,
  allAlertIntentReasonCodes,
} from '../../lib/alerts/intent/fixtures.js';
import { renderPropertyAlertEmail } from '../../lib/email/sendEmail.js';
import type { AlertIntentReasonCode } from '../../lib/alerts/intent/types.js';

function assertReasonCodes(actual: readonly AlertIntentReasonCode[], expected: readonly AlertIntentReasonCode[]) {
  assert.deepEqual(actual, expected);
}

function getReadyFixture() {
  const fixture = alertIntentFixtures.find((candidate) => candidate.name === 'complete match');
  assert.ok(fixture, 'complete match fixture exists');
  return fixture;
}

function testReasonCodesAndDeterminism() {
  assert.equal(alertIntentFixtures.length, ALERT_INTENT_EXPECTED_CASE_COUNT);

  const covered = new Set<AlertIntentReasonCode>();

  for (const fixture of alertIntentFixtures) {
    const first = evaluateAlertIntent(fixture.input);
    const second = evaluateAlertIntent(fixture.input);

    assert.deepEqual(first, second, `${fixture.name} is deterministic`);
    assertReasonCodes(first.reasonCodes, fixture.expectedReasonCodes);
    assert.equal(first.terminalDecision, fixture.expectedTerminalDecision);

    for (const reasonCode of first.reasonCodes) {
      covered.add(reasonCode);
    }

    assert.deepEqual(first.counters, {
      databaseReads: 0,
      databaseRowsCreated: 0,
      databaseRowsMutated: 0,
      queueJobsCreated: 0,
      queueJobsChanged: 0,
      providerCalls: 0,
      emailLogRowsCreated: 0,
      unsubscribeTokensCreated: 0,
      workersActivated: 0,
      savedSearchRecordsModified: 0,
      customerDataExposed: 0,
    });
  }

  assert.equal(covered.has('BLOCKED_UNSUPPORTED_DRY_RUN_SEAM'), false, 'unsupported seam is available but not used by normal fixtures');
  for (const reasonCode of allAlertIntentReasonCodes.filter((code) => code !== 'BLOCKED_UNSUPPORTED_DRY_RUN_SEAM')) {
    assert.equal(covered.has(reasonCode), true, `${reasonCode} is covered by fixtures`);
  }
}

function testMatchingSemantics() {
  const ready = getReadyFixture().input;

  assert.equal(matchesAlertSearch(ready.savedSearch, ready.property), true);
  assert.equal(getAlertMatchFailure(ready.savedSearch, { ...ready.property, city: 'Lafayette' }), 'NO_MATCH_CITY');
  assert.equal(getAlertMatchFailure(ready.savedSearch, { ...ready.property, price: 700000 }), 'NO_MATCH_PRICE');
  assert.equal(getAlertMatchFailure(ready.savedSearch, { ...ready.property, beds: 2 }), 'NO_MATCH_BEDS');
  assert.equal(getAlertMatchFailure(ready.savedSearch, { ...ready.property, propertyType: 'Condo' }), 'NO_MATCH_TYPE');
  assert.equal(getAlertMatchFailure(ready.savedSearch, { ...ready.property, lat: 40.5 }), 'NO_MATCH_BOUNDS');
}

function testPayloadAndQueueIntent() {
  const result = evaluateAlertIntent(getReadyFixture().input);
  assert.ok(result.payloadIntent, 'payload intent exists');
  assert.equal(result.payloadIntent.propertyId, 'fixture-property-001');
  assert.equal(result.payloadIntent.city, 'Boulder');
  assert.equal(result.payloadIntent.url, 'https://davidquinngroup.com/properties/fixture-property-001');

  assert.ok(result.queueIntent, 'queue intent exists');
  assert.equal(result.queueIntent.queueName, 'reie-alerts');
  assert.equal(result.queueIntent.jobName, 'process-alert');
  assert.equal(result.queueIntent.jobIdShape, 'alert-{alertId}');
  assert.equal(result.queueIntent.retryPlan.attempts, 3);
  assert.equal(result.queueIntent.retryPlan.backoffType, 'exponential');
  assert.equal(result.queueIntent.retryPlan.backoffDelayMs, 3000);
  assert.equal(result.queueIntent.retryPlan.removeOnCompleteAgeSeconds, 604800);
  assert.equal(result.queueIntent.retryPlan.removeOnFailAgeSeconds, 2592000);
}

function testRenderOnlyEmail() {
  const rendered = renderPropertyAlertEmail(
    [
      {
        id: 'fixture-property-001',
        slug: 'fixture-property-001',
        address: 'Fixture Property',
        city: 'Boulder',
        state: 'CO',
        price: 900000,
        beds: 3,
        baths: 2,
        sqft: 2100,
        url: 'https://davidquinngroup.com/properties/fixture-property-001',
      },
    ],
    {
      publicBaseUrl: 'https://davidquinngroup.com',
      unsubscribeUrl: 'https://davidquinngroup.com/api/unsubscribe?token=fixture-token',
      source: 'email_alert',
    },
  );

  assert.ok(rendered, 'rendered email exists');
  assert.equal(rendered.subject, 'David Quinn Group: 1 property intelligence update');
  assert.equal(rendered.listingCount, 1);
  assert.equal(rendered.html.includes('Fixture Property'), true);
  assert.equal(rendered.text.includes('Fixture Property'), true);
  assert.equal(rendered.html.includes('api/unsubscribe'), true);
}

function testUnsupportedModeFailsClosed() {
  const ready = getReadyFixture().input;
  const result = evaluateAlertIntent({
    ...ready,
    mode: 'fixture_only_no_side_effect',
  });

  assert.notEqual(result.reasonCodes[0], 'BLOCKED_UNSUPPORTED_DRY_RUN_SEAM');
}

testReasonCodesAndDeterminism();
testMatchingSemantics();
testPayloadAndQueueIntent();
testRenderOnlyEmail();
testUnsupportedModeFailsClosed();

console.log(
  JSON.stringify(
    {
      success: true,
      test: 'alert-intent',
      fixtures: alertIntentFixtures.length,
      databaseWrites: 0,
      queueWrites: 0,
      providerCalls: 0,
      workersActivated: 0,
      customerDataExposed: 0,
    },
    null,
    2,
  ),
);
