import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  CIM_FIRST_PARTY_MEASUREMENT_ADAPTER_DEFAULT_STATUS,
  CIM_FIRST_PARTY_MEASUREMENT_READINESS_ADAPTER_VERSION,
  cimMeasurementCategoryPolicies,
  evaluateCimFirstPartyMeasurementReadiness,
  validateCimFirstPartyMeasurementReadinessAdapter,
  validateCimMeasurementContract,
  validateCimPrivacyConsentDataMinimizationGate,
  type CimMeasurementCategoryPolicy,
} from '../lib/cim/index.js';

const ACTIVATION_PATTERNS = [
  /fetch\s*\(/,
  /navigator\.sendBeacon/,
  /XMLHttpRequest/,
  /gtag/,
  /GoogleAnalytics/,
  /Google Tag Manager/,
  /\bSegment\b/,
  /Mixpanel/,
  /Amplitude/,
  /posthog/i,
  /document\.cookie/,
  /localStorage\.setItem/,
  /sessionStorage\.setItem/,
  /trackClick\s*\(/,
  /trackForensicInteraction\s*\(/,
  /prisma\./,
  /PrismaClient/,
  /createClient\s*\(/,
  /SUPABASE_SERVICE_ROLE_KEY/,
  /OpenAI/,
  /GIS Sprint 9/,
];

function assertPositiveInactiveReadiness() {
  assert.equal(CIM_FIRST_PARTY_MEASUREMENT_ADAPTER_DEFAULT_STATUS, 'FAIL_CLOSED');
  assert.equal(CIM_FIRST_PARTY_MEASUREMENT_READINESS_ADAPTER_VERSION, 'CIM-1.0-SPRINT-3');

  const taxonomyValidation = validateCimMeasurementContract();
  assert.equal(taxonomyValidation.valid, true, taxonomyValidation.issues.join('; '));

  const privacyValidation = validateCimPrivacyConsentDataMinimizationGate();
  assert.equal(privacyValidation.valid, true, privacyValidation.issues.join('; '));

  const adapterValidation = validateCimFirstPartyMeasurementReadinessAdapter();
  assert.equal(adapterValidation.valid, true, adapterValidation.issues.join('; '));

  const decision = evaluateCimFirstPartyMeasurementReadiness({
    eventIdentifier: 'search_started',
    payload: {
      page_identifier: 'search',
      route: '/search',
      feature_identifier: 'search-entry',
      event_version: 'CIM-1.0-SPRINT-3',
      consent_state: 'present',
    },
    consentState: 'PRESENT',
  });

  assert.equal(decision.status, 'READY_INACTIVE');
  assert.equal(decision.activationStatus, 'INACTIVE');
  assert.equal(decision.canEmit, false);
  assert.equal(decision.canTransmit, false);
  assert.equal(decision.canPersist, false);
  assert.deepEqual(decision.issues, []);
}

function assertFailureModes() {
  const unknownEvent = evaluateCimFirstPartyMeasurementReadiness({ eventIdentifier: 'unknown_event', consentState: 'PRESENT' });
  assert.equal(unknownEvent.status, 'FAIL_CLOSED');
  assert.match(unknownEvent.issues.join('; '), /unknown CIM event/);

  const prohibitedPayload = evaluateCimFirstPartyMeasurementReadiness({
    eventIdentifier: 'search_started',
    payload: { email: 'blocked@example.com' },
    consentState: 'PRESENT',
  });
  assert.equal(prohibitedPayload.status, 'FAIL_CLOSED');
  assert.match(prohibitedPayload.issues.join('; '), /prohibited payload field email/);

  const invalidConsent = evaluateCimFirstPartyMeasurementReadiness({
    eventIdentifier: 'search_started',
    payload: { page_identifier: 'search' },
    consentState: 'MISSING',
  });
  assert.equal(invalidConsent.status, 'FAIL_CLOSED');
  assert.match(invalidConsent.issues.join('; '), /Consent is required/);

  const invalidPrivacyPolicy: CimMeasurementCategoryPolicy = {
    ...cimMeasurementCategoryPolicies.find((policy) => policy.id === 'search_engagement')!,
    privacyLevel: 'PUBLIC',
  };
  const invalidPrivacy = validateCimFirstPartyMeasurementReadinessAdapter([
    invalidPrivacyPolicy,
    ...cimMeasurementCategoryPolicies.filter((policy) => policy.id !== 'search_engagement'),
  ]);
  assert.equal(invalidPrivacy.valid, false);
  assert.match(invalidPrivacy.issues.join('; '), /privacy classification is incompatible/);

  const activationAttempted = evaluateCimFirstPartyMeasurementReadiness({
    eventIdentifier: 'search_started',
    consentState: 'PRESENT',
    activationAttempted: true,
  });
  assert.equal(activationAttempted.status, 'FAIL_CLOSED');
  assert.match(activationAttempted.issues.join('; '), /activation attempt rejected/);

  const transmissionAttempted = evaluateCimFirstPartyMeasurementReadiness({
    eventIdentifier: 'search_started',
    consentState: 'PRESENT',
    transmissionAttempted: true,
  });
  assert.equal(transmissionAttempted.status, 'FAIL_CLOSED');
  assert.match(transmissionAttempted.issues.join('; '), /transmission attempt rejected/);

  const persistenceAttempted = evaluateCimFirstPartyMeasurementReadiness({
    eventIdentifier: 'search_started',
    consentState: 'PRESENT',
    persistenceAttempted: true,
  });
  assert.equal(persistenceAttempted.status, 'FAIL_CLOSED');
  assert.match(persistenceAttempted.issues.join('; '), /persistence attempt rejected/);

  const blockedCategory = evaluateCimFirstPartyMeasurementReadiness({
    eventIdentifier: 'journey_abandoned',
    payload: { page_identifier: 'search' },
    consentState: 'PRESENT',
  });
  assert.equal(blockedCategory.status, 'FAIL_CLOSED');
  assert.match(blockedCategory.issues.join('; '), /blocked by policy/);
}

async function assertNoActivationPrimitives() {
  const source = await readFile('lib/cim/firstPartyMeasurementReadinessAdapter.ts', 'utf8');
  for (const pattern of ACTIVATION_PATTERNS) {
    assert.equal(pattern.test(source), false, `CIM Sprint 3 adapter must not include activation primitive: ${pattern}`);
  }
}

async function main() {
  assertPositiveInactiveReadiness();
  assertFailureModes();
  await assertNoActivationPrimitives();

  console.log(
    '[cim-first-party-measurement-readiness-adapter] ok: canonical taxonomy, privacy, consent, payload, inactive defaults, and fail-closed adapter behavior verified.',
  );
}

main().catch((error) => {
  console.error('[cim-first-party-measurement-readiness-adapter] failed:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
