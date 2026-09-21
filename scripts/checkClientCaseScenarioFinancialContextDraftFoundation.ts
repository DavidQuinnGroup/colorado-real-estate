import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  CLIENT_CASE_SCENARIO_FINANCIAL_CONTEXT_DRAFT_SCHEMA_VERSION,
  createClientCaseScenarioFinancialContextDraftService,
} from '../lib/clientCaseScenarioFinancialContextDraftFoundation';

const schema = readFileSync('prisma/schema.prisma', 'utf8');
const migration = readFileSync('prisma/migrations/20260921010000_client_case_scenario_financial_context_draft_foundation_v1/migration.sql', 'utf8');
const service = readFileSync('lib/clientCaseScenarioFinancialContextDraftFoundation.ts', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

assert.equal(CLIENT_CASE_SCENARIO_FINANCIAL_CONTEXT_DRAFT_SCHEMA_VERSION, 1);
assert.equal(typeof createClientCaseScenarioFinancialContextDraftService, 'function');

for (const token of [
  'enum ClientCaseScenarioFinancialContextDraftMutationKind',
  'model ClientCaseScenarioFinancialContextDraft',
  'model ClientCaseScenarioFinancialContextDraftSelection',
  'scenarioId         String   @unique',
  'revision           Int      @default(1)',
  'CSFCD_case_owner_fk',
  'ClientCaseScenario_clientCaseId_id_key',
  'CSFCD_case_scenario_key',
  'CSFCD_id_revision_key',
  'CSFCDS_asset_obs_fk',
  'CSFCDS_liability_obs_fk',
  'CSFCDS_income_obs_fk',
  'CSFCDS_qualification_obs_fk',
  'CSFCDS_constraint_obs_fk',
  'CSFCDS_party_fk',
  'CSFCDS_property_fk',
  'CSFCDS_governed_source_fk',
]) assert.match(schema, new RegExp(token.replace(/[()[\]{}?+*.^$|]/g, '\\$&')));

for (const token of [
  'CREATE TYPE "ClientCaseScenarioFinancialContextDraftMutationKind"',
  'CREATE TABLE "ClientCaseScenarioFinancialContextDraft"',
  'CREATE TABLE "ClientCaseScenarioFinancialContextDraftSelection"',
  'CSFCD_revision_positive_ck',
  'CSFCDS_shape_ck',
  'CSFCDS_review_pair_ck',
  'CSFCD_case_owner_fk',
  'CSFCD_scenario_fk',
  'ClientCaseScenario_clientCaseId_id_key',
  'CSFCDS_draft_fk',
  'CSFCDS_asset_obs_fk',
  'CSFCDS_liability_obs_fk',
  'CSFCDS_income_obs_fk',
  'CSFCDS_qualification_obs_fk',
  'CSFCDS_constraint_obs_fk',
  'CSFCDS_party_fk',
  'CSFCDS_property_fk',
  'ON DELETE RESTRICT',
]) assert.match(migration, new RegExp(token.replace(/[()[\]{}?+*.^$|]/g, '\\$&')));

const executableMigration = migration.replace(/^--.*$/gm, '').replace(/ON DELETE RESTRICT/g, '').replace(/ON UPDATE CASCADE/g, '');
assert.doesNotMatch(executableMigration, /\b(INSERT|UPDATE "ClientFinancial|UPDATE "ClientCaseScenarioVersion|DELETE|TRUNCATE|DROP)\b/i, 'Wave C2A migration must be additive DDL only with no financial/manifest backfill.');

for (const token of [
  'readDraft',
  'selectFinancialContext',
  'deselectFinancialContext',
  'reviewFinancialContextSelection',
  'clearDraftSelections',
  'authorizeScenario',
  'resolveSelection',
  'assertEligibleClientCaseGovernedSource',
  'advanceRevision',
  'updateMany',
  'revision is stale',
  'NO_DRAFT',
  'Selected financial facts require a Client Financial Position',
]) assert.match(service, new RegExp(token.replace(/[()[\]{}?+*.^$|]/g, '\\$&')));

for (const forbidden of [
  'app/api/',
  'components/',
  'fetch(',
  'clientFinancialAsset.update(',
  'clientFinancialLiability.update(',
  'clientFinancialIncomeSource.update(',
  'clientCaseScenarioFinancialContextManifest.create(',
  'clientCaseScenarioFinancialContextManifest.update(',
  'clientCaseScenarioVersion.create(',
  'outputVersion.create(',
]) assert.doesNotMatch(service, new RegExp(forbidden.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

assert.equal(packageJson.scripts?.['check:client-case-scenario-financial-context-draft-foundation'], 'jiti scripts/checkClientCaseScenarioFinancialContextDraftFoundation.ts');

console.log('[client-case-scenario-financial-context-draft-foundation] ok: additive draft schema, one draft per Scenario, same-Case financial references, CAS revision state, no UI, no consumer, no backfill.');
