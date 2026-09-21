import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { ClientCaseScenarioFinancialContextDraftError, createClientCaseScenarioFinancialContextDraftService } from '../lib/clientCaseScenarioFinancialContextDraftFoundation';

const serviceSource = readFileSync('lib/clientCaseScenarioFinancialContextDraftFoundation.ts', 'utf8');
const manifestSource = readFileSync('lib/clientCaseScenarioFinancialContextManifestFoundation.ts', 'utf8');
const schema = readFileSync('prisma/schema.prisma', 'utf8');
const migration = readFileSync('prisma/migrations/20260921010000_client_case_scenario_financial_context_draft_foundation_v1/migration.sql', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

const parser = createClientCaseScenarioFinancialContextDraftService({} as never);
assert.deepEqual(parser.parseDraftSelectionForCertification({ domain: 'ASSET', entityId: 'asset-a', observationId: 'asset-observation-a' }), {
  domain: 'ASSET',
  entityId: 'asset-a',
  observationId: 'asset-observation-a',
});
assert.equal(parser.optionalDraftSelectionIdentifierForCertification(null), null);
assert.throws(
  () => parser.parseDraftSelectionForCertification({ domain: 'ASSET', entityId: 'asset-a', observationId: 'asset-observation-a', amountCents: 100 }),
  (error) => error instanceof ClientCaseScenarioFinancialContextDraftError && error.code === 'INVALID_REQUEST',
);

for (const expected of [
  'await authorizeScenario(database, ownerAgentSubject, clientCaseId, scenarioId)',
  'return Object.freeze({ draft, state: draft ? \'DRAFT_AVAILABLE\' as const : \'NO_DRAFT\' as const })',
  'if (!existing) {',
  'expectedRevision !== null',
  'revision: { increment: 1 }',
  'advanced.count !== 1',
  'The Scenario Financial Context draft revision is stale.',
  'deleteMany({ where: entityDeleteWhere(draft.id, resolved) })',
  'deleteMany({ where: { draftId: draft.id, clientCaseId } })',
  'mutationKind: \'REVIEW\'',
  'clientCase: { ownerAgentSubject }',
  'status !== \'ACTIVE\'',
  'clientCaseId, assetId: input.entityId, supersededAt: null',
  'clientCaseId, liabilityId: input.entityId, supersededAt: null',
  'clientCaseId, incomeSourceId: input.entityId, supersededAt: null',
  'clientCaseId, qualificationId: input.entityId, supersededAt: null',
  'clientCaseId, constraintId: input.entityId, supersededAt: null',
]) assert.ok(serviceSource.includes(expected), `missing workflow contract: ${expected}`);

for (const expected of [
  'CSFCD_case_owner_fk',
  'CSFCD_scenario_fk',
  'CSFCDS_asset_fk',
  'CSFCDS_asset_obs_fk',
  'CSFCDS_liability_fk',
  'CSFCDS_liability_obs_fk',
  'CSFCDS_income_fk',
  'CSFCDS_income_obs_fk',
  'CSFCDS_qualification_fk',
  'CSFCDS_qualification_obs_fk',
  'CSFCDS_constraint_fk',
  'CSFCDS_constraint_obs_fk',
  'CSFCDS_party_fk',
  'CSFCDS_property_fk',
  'CSFCDS_source_fk',
  'CSFCDS_governed_source_fk',
]) assert.ok(schema.includes(expected) || migration.includes(expected), `missing same-Case FK: ${expected}`);

for (const forbidden of [
  'marketValueCents',
  'liquidValueCents',
  'availableAmountCents',
  'currentBalanceCents',
  'monthlyObligationCents',
  'incomeAmountCents',
  'qualificationMaximumLoanAmountCents',
  'constraintAmountCents',
  'entityLabel',
  'participantDisplayLabel',
  'propertyDisplayLabel',
  'fingerprint',
  'capturedAt',
]) {
  const draftOnly = schema.slice(schema.indexOf('model ClientCaseScenarioFinancialContextDraft'), schema.indexOf('model ClientCaseScenarioFinancialContextManifest'));
  assert.equal(draftOnly.includes(forbidden), false, `Draft schema must not freeze/copy ${forbidden}`);
}

for (const forbidden of [
  'clientFinancialPosition.create(',
  'clientFinancialPosition.update(',
  'clientFinancialAssetObservation.create(',
  'clientFinancialAssetObservation.update(',
  'clientFinancialLiabilityObservation.create(',
  'clientFinancialLiabilityObservation.update(',
  'clientFinancialIncomeObservation.create(',
  'clientFinancialIncomeObservation.update(',
  'clientCaseScenarioVersion.create(',
  'clientCaseScenario.update({',
  'clientCaseScenarioFinancialContextManifest.create(',
  'clientCaseScenarioFinancialContextManifestEntry.create(',
]) assert.doesNotMatch(serviceSource, new RegExp(forbidden.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

assert.match(manifestSource, /freezeScenarioForAnalysisWithFinancialContext/);
assert.doesNotMatch(serviceSource, /freezeScenarioForAnalysisWithFinancialContext/);
assert.equal(packageJson.scripts?.['check:client-case-scenario-financial-context-draft-workflow'], 'jiti scripts/checkClientCaseScenarioFinancialContextDraftWorkflow.ts');

console.log('[client-case-scenario-financial-context-draft-workflow] ok: synthetic C2A draft read/create/select/deselect/review/clear/CAS/cross-Case/financial-integrity/no-manifest/no-Financial-Position mutation contracts certified.');
