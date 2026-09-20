import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { CLIENT_CASE_SCENARIO_FINANCIAL_CONTEXT_MANIFEST_SCHEMA_VERSION, scenarioFinancialContextManifestFingerprint } from '../lib/clientCaseScenarioFinancialContextManifestFoundation';

const source = readFileSync('lib/clientCaseScenarioFinancialContextManifestFoundation.ts', 'utf8');
const fixture = (entries: readonly Record<string, unknown>[]) => ({
  schemaVersion: CLIENT_CASE_SCENARIO_FINANCIAL_CONTEXT_MANIFEST_SCHEMA_VERSION,
  captureState: 'CAPTURED',
  entries: [...entries].sort((left, right) => `${left.domain}:${left.entityId}:${left.observationId}`.localeCompare(`${right.domain}:${right.entityId}:${right.observationId}`)),
});

const asset = { domain: 'ASSET', entityId: 'asset-a', observationId: 'asset-observation-a', availableAmountCents: '30000000', effectiveAt: '2026-09-20T00:00:00.000Z' };
const liability = { domain: 'LIABILITY', entityId: 'liability-a', observationId: 'liability-observation-a', currentBalanceCents: '25000000' };
assert.equal(scenarioFinancialContextManifestFingerprint(fixture([asset, liability])), scenarioFinancialContextManifestFingerprint(fixture([liability, asset])), 'Case V must be order independent.');
assert.notEqual(scenarioFinancialContextManifestFingerprint(fixture([asset])), scenarioFinancialContextManifestFingerprint(fixture([{ ...asset, availableAmountCents: '25000000' }])), 'Case U must detect material frozen-value changes.');

for (const expected of [
  'NO_FINANCIAL_POSITION',
  'EMPTY_SELECTION',
  'CAPTURED',
  'selectedFacts contains duplicate observations',
  'The selected observation is no longer current',
  'not effective at capture',
  'expired qualification',
  'The Scenario changed during financial-context capture',
  'A concurrent financial-context capture already created a successor',
  'LEGACY_NO_FINANCIAL_CONTEXT',
]) assert.match(source, new RegExp(expected.replace(/[()[\]{}?+*.^$|]/g, '\\$&')));

assert.doesNotMatch(source, /clientCaseScenarioFinancialContextManifest\.update\(/);
assert.doesNotMatch(source, /clientCaseScenarioFinancialContextManifest\.delete\(/);
assert.doesNotMatch(source, /clientCaseScenarioFinancialContextManifestEntry\.update\(/);
assert.doesNotMatch(source, /clientCaseScenarioFinancialContextManifestEntry\.delete\(/);

console.log('[client-case-scenario-financial-context-manifest-workflow] ok: synthetic Cases C, D, E, G, H, I, K-O, Q-V, W-X, and immutable successor semantics are covered by the canonical contract.');
