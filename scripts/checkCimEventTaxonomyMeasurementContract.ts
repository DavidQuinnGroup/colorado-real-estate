import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  CIM_ACTIVATION_STATUS,
  cimEventDefinitions,
  cimKpiMappings,
  cimProhibitedPayloadFields,
  validateCimMeasurementContract,
  type CimEventDefinition,
} from '../lib/cim/index.js';

const REQUIRED_EVENTS = [
  'search_started',
  'search_refined',
  'search_completed',
  'property_viewed',
  'property_scrolled',
  'property_inquiry_started',
  'property_tour_started',
  'market_viewed',
  'neighborhood_market_viewed',
  'valuation_started',
  'valuation_completed',
  'journey_started',
  'journey_completed',
  'journey_abandoned',
  'navigation_transition',
  'measurement_blocked',
  'consent_missing',
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

function cloneEvent(partial: Partial<CimEventDefinition> = {}): CimEventDefinition {
  return {
    ...cimEventDefinitions[0],
    ...partial,
    kpiMappings: partial.kpiMappings ?? [...cimEventDefinitions[0].kpiMappings],
    allowedPayload: partial.allowedPayload ?? [...cimEventDefinitions[0].allowedPayload],
    prohibitedPayload: partial.prohibitedPayload ?? [...cimEventDefinitions[0].prohibitedPayload],
  };
}

function assertRequiredEvents() {
  const identifiers = new Set(cimEventDefinitions.map((event) => event.identifier));

  for (const identifier of REQUIRED_EVENTS) {
    assert.ok(identifiers.has(identifier), `Missing required CIM event: ${identifier}`);
  }

  assert.equal(cimEventDefinitions.length, REQUIRED_EVENTS.length);
}

function assertContractValid() {
  assert.equal(CIM_ACTIVATION_STATUS, 'INACTIVE');

  const validation = validateCimMeasurementContract();
  assert.equal(validation.valid, true, validation.issues.join('; '));

  for (const event of cimEventDefinitions) {
    assert.equal(event.activationStatus, 'INACTIVE', `${event.identifier} must remain inactive.`);
    assert.ok(event.description.length > 20, `${event.identifier} must include a meaningful description.`);
    assert.ok(event.owner.length > 3, `${event.identifier} must include an owner.`);
    assert.ok(event.kpiMappings.length > 0, `${event.identifier} must include KPI mappings.`);
    assert.ok(event.allowedPayload.length > 0, `${event.identifier} must define allowed payload.`);
    assert.deepEqual(event.prohibitedPayload, cimProhibitedPayloadFields, `${event.identifier} must carry full prohibited payload list.`);
  }

  for (const mapping of cimKpiMappings) {
    assert.equal(mapping.activationStatus, 'INACTIVE', `${mapping.id} mapping must remain inactive.`);
  }
}

function assertFailureModes() {
  const duplicate = validateCimMeasurementContract([
    ...cimEventDefinitions,
    cloneEvent({ identifier: cimEventDefinitions[0].identifier }),
  ]);
  assert.equal(duplicate.valid, false);
  assert.match(duplicate.issues.join('; '), /duplicate event identifier/);

  const prohibitedAllowed = validateCimMeasurementContract([
    cloneEvent({ allowedPayload: ['name' as never] }),
  ]);
  assert.equal(prohibitedAllowed.valid, false);
  assert.match(prohibitedAllowed.issues.join('; '), /unsupported allowed payload field|prohibited payload field/);

  const undefinedKpi = validateCimMeasurementContract([
    cloneEvent({ identifier: 'test_undefined_kpi', kpiMappings: ['KPI-UNKNOWN-999'] }),
  ]);
  assert.equal(undefinedKpi.valid, false);
  assert.match(undefinedKpi.issues.join('; '), /undefined KPI mapping/);

  const activated = validateCimMeasurementContract([
    cloneEvent({ identifier: 'test_activated', activationStatus: 'ACTIVE' as never }),
  ]);
  assert.equal(activated.valid, false);
  assert.match(activated.issues.join('; '), /activation status must remain INACTIVE/);
}

async function assertNoActivationPrimitives() {
  const [contractSource, indexSource] = await Promise.all([
    readFile('lib/cim/measurementContract.ts', 'utf8'),
    readFile('lib/cim/index.ts', 'utf8'),
  ]);
  const source = `${contractSource}\n${indexSource}`;

  for (const pattern of ACTIVATION_PATTERNS) {
    assert.equal(pattern.test(source), false, `CIM Sprint 1 contract must not include activation primitive: ${pattern}`);
  }
}

async function main() {
  assertRequiredEvents();
  assertContractValid();
  assertFailureModes();
  await assertNoActivationPrimitives();

  console.log('[cim-event-taxonomy-measurement-contract] ok: canonical events, KPI mappings, privacy payload rules, inactive defaults, and fail-closed validation verified.');
}

main().catch((error) => {
  console.error('[cim-event-taxonomy-measurement-contract] failed:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
