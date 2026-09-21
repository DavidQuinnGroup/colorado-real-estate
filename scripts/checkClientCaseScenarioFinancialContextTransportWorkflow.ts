import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { classifyScenarioFinancialContextDifference } from '../lib/clientCaseScenarioFinancialContextTransport';

const service = readFileSync('lib/clientCaseScenarioFinancialContextTransport.ts', 'utf8');
const route = readFileSync('app/api/agent/client-case-scenario-financial-context/route.ts', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

for (const token of [
  "state: !workspace.position ? 'NO_FINANCIAL_POSITION'",
  "selections.length ? 'WORKING_CONTEXT'",
  "'EMPTY_SELECTION'",
  "'SELECTED_CURRENT_OBSERVATION_CHANGED'",
  "'SELECTED_TIME_REVIEW_REQUIRED'",
  "'SELECTED_NO_LONGER_AVAILABLE'",
  "'LEGACY_NO_FINANCIAL_CONTEXT'",
  "'CURRENT_FACT_NOT_PART_OF_VERSION'",
  "'LATER_CORRECTION'",
  "'TIME_REVIEW_CHANGED'",
  'versionContext',
  'expectedDraftRevision',
  'expectedCurrentVersionId',
  'clientMutationKey',
  'scenarioFinancialContextManifestIdempotencyKey',
  'created: false',
]) assert.ok(service.includes(token), `missing C2B workflow contract: ${token}`);

for (const action of ['SELECT', 'DESELECT', 'REVIEW', 'CLEAR_ALL', 'REVIEW_CREATE_ANALYSIS_VERSION', 'CREATE_ANALYSIS_VERSION']) {
  assert.ok(route.includes(`'${action}'`), `missing route action: ${action}`);
}
for (const view of ['working', 'fixed', 'comparison']) assert.ok(route.includes(`'${view}'`), `missing route view: ${view}`);

const fixed = {
  domain: 'ASSET', entityId: 'asset-1', observationId: 'obs-1', label: 'Cash', participantLabel: null, propertyLabel: null,
  source: { financialSourceId: 'source-1', governedSourceId: 'governed-1', kind: 'EVIDENCE', posture: 'DOCUMENTED', verificationState: 'DOCUMENT_SUPPORTED' },
  observationKind: 'REPORTED', limitation: null, currencyCode: 'USD', asOf: '2026-09-21T00:00:00.000Z', observedAt: null, effectiveAt: null, expiresAt: null, reviewAfter: null,
  value: { category: 'CASH', marketValueCents: 100_000, liquidValueCents: 100_000, availableAmountCents: 100_000, currentBalanceCents: null, monthlyObligationCents: null, amountCents: null, maximumLoanAmountCents: null, maximumPurchaseAmountCents: null, rateBps: null, frequency: null, programLabel: null },
};
const current = {
  domain: 'ASSET', entityId: 'asset-1', label: 'Cash', category: 'CASH', participant: null, property: null,
  currentObservation: { id: 'obs-1', value: {}, sourcePosture: 'DOCUMENTED', verificationState: 'DOCUMENT_SUPPORTED', observationKind: 'REPORTED', source: { id: 'source-1' }, asOf: fixed.asOf, observedAt: null, effectiveAt: null, expiresAt: null, reviewAfter: null, freshness: 'CURRENT' },
};
assert.equal(classifyScenarioFinancialContextDifference(fixed as never, current as never, new Date('2026-09-21T01:00:00.000Z')), 'UNCHANGED');
assert.equal(classifyScenarioFinancialContextDifference(fixed as never, null, new Date('2026-09-21T01:00:00.000Z')), 'NO_LONGER_CURRENT');
assert.equal(classifyScenarioFinancialContextDifference(fixed as never, { ...current, currentObservation: { ...current.currentObservation, id: 'obs-2', observationKind: 'CORRECTION' } } as never, new Date('2026-09-21T01:00:00.000Z')), 'LATER_CORRECTION');

const before = { id: 'draft-1', revision: 7, selections: [{ id: 'selection-a', domain: 'ASSET', entityId: 'asset-1', observationId: 'obs-1' }] };
const after = structuredClone(before);
assert.deepEqual(after, before, 'successful Freeze must retain draft root, revision, and selections unchanged');

assert.equal(packageJson.scripts?.['check:client-case-scenario-financial-context-transport-workflow'], 'jiti scripts/checkClientCaseScenarioFinancialContextTransportWorkflow.ts');
console.log('[client-case-scenario-financial-context-transport-workflow] ok: working selection, review, Freeze, retained draft, fixed context, second-Freeze readiness, and historical comparison semantics are certified.');
