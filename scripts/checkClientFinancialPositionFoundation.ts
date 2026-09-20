import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const schema = readFileSync('prisma/schema.prisma', 'utf8');
const migration = readFileSync('prisma/migrations/20260920000000_client_financial_position_foundation_v1/migration.sql', 'utf8');
const service = readFileSync('lib/clientFinancialPositionFoundation.ts', 'utf8');

for (const model of [
  'ClientFinancialPosition',
  'ClientFinancialSource',
  'ClientFinancialAsset',
  'ClientFinancialAssetObservation',
  'ClientFinancialLiability',
  'ClientFinancialLiabilityObservation',
  'ClientFinancialIncomeSource',
  'ClientFinancialIncomeObservation',
  'ClientFinancialQualification',
  'ClientFinancialQualificationObservation',
  'ClientFinancialConstraint',
  'ClientFinancialConstraintObservation',
]) assert.match(schema, new RegExp(`model ${model} \\{`));

for (const token of [
  'ClientCaseGovernedSourceKind',
  'ClientFinancialSourcePosture',
  'ClientFinancialVerificationState',
  'ClientFinancialObservationKind',
  'BigInt',
  'supersedesObservationId',
  'supersededAt',
  'ClientFinancialPosition_clientCaseId_id_key',
  'ClientCaseParty_clientCaseId_id_key',
]) assert.match(schema, new RegExp(token));

for (const token of [
  'CREATE TYPE "ClientFinancialAssetCategory"',
  'ClientFinancialSource_shape_ck',
  'CFPAO_one_current_per_asset_uq',
  'CFPLO_one_current_per_liability_uq',
  'CFPIO_one_current_per_income_source_uq',
  'CFPQO_one_current_per_qualification_uq',
  'CFPCO_one_current_per_constraint_uq',
  'ON DELETE RESTRICT',
]) assert.match(migration, new RegExp(token));
const executableMigration = migration.replace(/^--.*$/gm, '').replace(/ON UPDATE CASCADE/g, '').replace(/ON DELETE RESTRICT/g, '');
assert.doesNotMatch(executableMigration, /\bINSERT\b|\bUPDATE\b|\bDELETE\b/i, 'The Financial Position migration must be DDL only.');

for (const token of [
  'ensureClientFinancialPosition',
  'bindFinancialSource',
  'createAsset',
  'recordAssetObservation',
  'createLiability',
  'recordLiabilityObservation',
  'createIncomeSource',
  'recordIncomeObservation',
  'createQualification',
  'recordQualificationObservation',
  'createConstraint',
  'recordConstraintObservation',
  'getCurrentFinancialPosition',
  'listCurrentAssets',
  'listCurrentLiabilities',
  'listCurrentIncome',
  'listCurrentQualifications',
  'listCurrentConstraints',
  'listObservationHistory',
  'listAssetHistory',
  'assertProvenance',
  'rejectUnexpectedKeys',
]) assert.match(service, new RegExp(token));

for (const forbidden of ['app/api/', 'components/', 'fetch(', 'router.', 'transaction.update(', 'outputVersion.create(']) {
  assert.doesNotMatch(service, new RegExp(forbidden.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
}

console.log('[client-financial-position-foundation] ok: typed Case-owned financial domains, DDL-only migration, source-shape protection, current/history indexes, and transport-independent service are present.');
