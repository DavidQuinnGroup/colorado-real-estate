import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  cimExplicitlyProhibitedData,
  cimMeasurementCategoryPolicies,
  validateCimPrivacyConsentDataMinimizationGate,
  type CimMeasurementCategoryPolicy,
} from '../lib/cim/index.js';

const REQUIRED_CATEGORIES = [
  'search_engagement',
  'property_engagement',
  'market_engagement',
  'seller_engagement',
  'cta_engagement',
  'journey_completion',
  'journey_abandonment',
  'navigation_transition',
  'lead_attribution',
  'measurement_governance',
];

const REQUIRED_PROHIBITED_FIELDS = [
  'name',
  'email',
  'phone',
  'message_body',
  'free_text_search_terms',
  'precise_address',
  'internal_identifier',
  'protected_intelligence',
  'crm_identifier',
  'seller_lead_identifier',
  'alert_identifier',
  'raw_ip_address',
  'device_fingerprint',
];

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

function clonePolicy(partial: Partial<CimMeasurementCategoryPolicy> = {}): CimMeasurementCategoryPolicy {
  return {
    ...cimMeasurementCategoryPolicies[0],
    ...partial,
    allowedData: partial.allowedData ?? [...cimMeasurementCategoryPolicies[0].allowedData],
    prohibitedData: partial.prohibitedData ?? [...cimMeasurementCategoryPolicies[0].prohibitedData],
  };
}

function assertRequiredCategories() {
  const ids = new Set<string>(cimMeasurementCategoryPolicies.map((policy) => policy.id));
  for (const id of REQUIRED_CATEGORIES) {
    assert.ok(ids.has(id), `Missing required CIM measurement category: ${id}`);
  }
  assert.equal(cimMeasurementCategoryPolicies.length, REQUIRED_CATEGORIES.length);
}

function assertValidPolicySet() {
  const validation = validateCimPrivacyConsentDataMinimizationGate();
  assert.equal(validation.valid, true, validation.issues.join('; '));

  assert.deepEqual(cimExplicitlyProhibitedData, REQUIRED_PROHIBITED_FIELDS);

  for (const policy of cimMeasurementCategoryPolicies) {
    assert.equal(policy.activationStatus, 'INACTIVE', `${policy.id} must remain inactive.`);
    assert.ok(policy.description.length > 20, `${policy.id} must include a meaningful description.`);
    assert.deepEqual(policy.prohibitedData, cimExplicitlyProhibitedData, `${policy.id} must include the complete prohibited data list.`);
    if (policy.consentPrerequisite === 'BLOCKED') {
      assert.equal(policy.activationPrerequisite, 'BLOCKED_BY_POLICY', `${policy.id} blocked consent must fail closed.`);
    }
  }
}

function assertFailureModes() {
  const prohibitedAllowed = validateCimPrivacyConsentDataMinimizationGate([
    clonePolicy({ allowedData: ['name' as never] }),
  ]);
  assert.equal(prohibitedAllowed.valid, false);
  assert.match(prohibitedAllowed.issues.join('; '), /unsupported allowed data field|prohibited data field/);

  const invalidConsent = validateCimPrivacyConsentDataMinimizationGate([
    clonePolicy({ id: 'journey_abandonment', consentPrerequisite: 'BLOCKED', activationPrerequisite: 'EXPLICIT_CONSENT_REQUIRED' }),
  ]);
  assert.equal(invalidConsent.valid, false);
  assert.match(invalidConsent.issues.join('; '), /blocked consent requires BLOCKED_BY_POLICY/);

  const invalidRetention = validateCimPrivacyConsentDataMinimizationGate([
    clonePolicy({ retention: 'LONG_TERM', deletion: 'USER_REQUEST' }),
  ]);
  assert.equal(invalidRetention.valid, false);
  assert.match(invalidRetention.issues.join('; '), /LONG_TERM retention requires LEGAL_EXCEPTION/);

  const activated = validateCimPrivacyConsentDataMinimizationGate([
    clonePolicy({ activationStatus: 'ACTIVE' as never }),
  ]);
  assert.equal(activated.valid, false);
  assert.match(activated.issues.join('; '), /activation status must remain INACTIVE/);

  const identityConflict = validateCimPrivacyConsentDataMinimizationGate([
    clonePolicy({ identityLevel: 'IDENTIFIED', privacyLevel: 'CONFIDENTIAL' }),
  ]);
  assert.equal(identityConflict.valid, false);
  assert.match(identityConflict.issues.join('; '), /identified measurement is prohibited/);
}

async function assertNoActivationPrimitives() {
  const source = await readFile('lib/cim/privacyConsentDataMinimization.ts', 'utf8');
  for (const pattern of ACTIVATION_PATTERNS) {
    assert.equal(pattern.test(source), false, `CIM Sprint 2 contract must not include activation primitive: ${pattern}`);
  }
}

async function main() {
  assertRequiredCategories();
  assertValidPolicySet();
  assertFailureModes();
  await assertNoActivationPrimitives();

  console.log('[cim-privacy-consent-data-minimization-gate] ok: privacy, consent, identity, retention, deletion, prohibited data, inactive defaults, and fail-closed validation verified.');
}

main().catch((error) => {
  console.error('[cim-privacy-consent-data-minimization-gate] failed:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
