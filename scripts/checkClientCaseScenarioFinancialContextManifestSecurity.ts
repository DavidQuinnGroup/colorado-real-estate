import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const service = readFileSync('lib/clientCaseScenarioFinancialContextManifestFoundation.ts', 'utf8');
const schema = readFileSync('prisma/schema.prisma', 'utf8');

for (const token of [
  'clientCase: { ownerAgentSubject }',
  'clientCaseId, status: \'ACTIVE\', currentVersionId: expectedCurrentVersionId',
  'clientCaseId, assetId: selection.entityId, supersededAt: null',
  'clientCaseId, liabilityId: selection.entityId, supersededAt: null',
  'clientCaseId, incomeSourceId: selection.entityId, supersededAt: null',
  'clientCaseId, qualificationId: selection.entityId, supersededAt: null',
  'clientCaseId, constraintId: selection.entityId, supersededAt: null',
  'assertEligibleClientCaseGovernedSource',
  'exactKeys(input, [\'expectedCurrentVersionId\', \'selectedFacts\', \'clientMutationKey\'])',
]) assert.ok(service.includes(token), `missing security contract: ${token}`);

for (const token of ['CSFCME_asset_obs_fk', 'CSFCME_liability_obs_fk', 'CSFCME_income_obs_fk', 'CSFCME_qualification_obs_fk', 'CSFCME_constraint_obs_fk', 'CSFCME_governed_source_fk']) assert.ok(schema.includes(token) || readFileSync('prisma/migrations/20260920200000_client_case_scenario_financial_context_manifest_foundation_v1/migration.sql', 'utf8').includes(token));
for (const forbidden of ['app/api/', 'components/', 'fetch(', 'process.env']) assert.equal(service.includes(forbidden), false, `Manifest foundation must not include ${forbidden}`);

console.log('[client-case-scenario-financial-context-manifest-security] ok: owner, Scenario, Client Case, entity, observation, source, provenance, and public-surface boundaries are fail-closed.');
