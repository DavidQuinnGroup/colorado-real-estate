import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  CLIENT_CASE_SCENARIO_FINANCIAL_CONTEXT_MANIFEST_SCHEMA_VERSION,
  scenarioFinancialContextManifestFingerprint,
} from '../lib/clientCaseScenarioFinancialContextManifestFoundation';

const schema = readFileSync('prisma/schema.prisma', 'utf8');
const migration = readFileSync('prisma/migrations/20260920200000_client_case_scenario_financial_context_manifest_foundation_v1/migration.sql', 'utf8');
const service = readFileSync('lib/clientCaseScenarioFinancialContextManifestFoundation.ts', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

for (const token of [
  'enum ClientCaseScenarioFinancialContextCaptureState',
  'CAPTURED',
  'NO_FINANCIAL_POSITION',
  'EMPTY_SELECTION',
  'model ClientCaseScenarioFinancialContextManifest',
  'model ClientCaseScenarioFinancialContextManifestEntry',
  'scenarioVersionId     String                                           @unique',
  'CSFCM_case_id_key',
  'CSFCME_case_id_key',
  'ClientCaseScenarioFinancialContextEntryDomain',
  'assetObservationId',
  'liabilityObservationId',
  'incomeObservationId',
  'qualificationObservationId',
  'constraintObservationId',
]) assert.match(schema, new RegExp(token.replace(/[()[\]{}?+*.^$|]/g, '\\$&')));

for (const token of [
  'CREATE TABLE "ClientCaseScenarioFinancialContextManifest"',
  'CREATE TABLE "ClientCaseScenarioFinancialContextManifestEntry"',
  'CSFCME_shape_ck',
  'CSFCME_manifest_fk',
  'CSFCME_asset_obs_fk',
  'CSFCME_liability_obs_fk',
  'CSFCME_income_obs_fk',
  'CSFCME_qualification_obs_fk',
  'CSFCME_constraint_obs_fk',
  'ON DELETE RESTRICT',
]) assert.match(migration, new RegExp(token.replace(/[()[\]{}?+*.^$|]/g, '\\$&')));

const executableMigration = migration.replace(/^--.*$/gm, '').replace(/ON DELETE RESTRICT/g, '').replace(/ON UPDATE CASCADE/g, '');
assert.doesNotMatch(executableMigration, /\b(INSERT|UPDATE|DELETE|TRUNCATE|DROP)\b/i, 'Wave C1 migration must be additive DDL only.');

for (const token of [
  'freezeScenarioForAnalysisWithFinancialContext',
  'readScenarioFinancialContextManifest',
  'listObservationManifestLineage',
  'assertEligibleClientCaseGovernedSource',
  'lockCurrentObservation',
  'idempotencyKey',
  'canonicalManifestContent',
  'definitionFromClientCaseScenarioVersion',
  'updateMany',
  'LEGACY_NO_FINANCIAL_CONTEXT',
]) assert.match(service, new RegExp(token.replace(/[()[\]{}?+*.^$|]/g, '\\$&')));

for (const forbidden of ['app/api/', 'components/', 'fetch(', 'outputVersion.create(', 'transaction.create(', 'clientFinancialAsset.update(', 'clientCaseGovernedSource.create(']) {
  assert.doesNotMatch(service, new RegExp(forbidden.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
}

const captured = {
  schemaVersion: CLIENT_CASE_SCENARIO_FINANCIAL_CONTEXT_MANIFEST_SCHEMA_VERSION,
  captureState: 'CAPTURED',
  entries: [{ domain: 'ASSET', observationId: 'observation-a', availableAmountCents: '30000000' }],
};
assert.equal(scenarioFinancialContextManifestFingerprint(captured), scenarioFinancialContextManifestFingerprint(structuredClone(captured)));
assert.notEqual(scenarioFinancialContextManifestFingerprint(captured), scenarioFinancialContextManifestFingerprint({ ...captured, entries: [{ ...captured.entries[0], availableAmountCents: '25000000' }] }));
assert.equal(packageJson.scripts?.['check:client-case-scenario-financial-context-manifest-foundation'], 'jiti scripts/checkClientCaseScenarioFinancialContextManifestFoundation.ts');

console.log('[client-case-scenario-financial-context-manifest-foundation] ok: additive typed Manifest schema, restrictive direct observation lineage, server-only capture, no backfill, no UI, and no consumer integration.');
