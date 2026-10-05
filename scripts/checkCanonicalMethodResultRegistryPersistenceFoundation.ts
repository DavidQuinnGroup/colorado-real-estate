import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const migrationPath = 'prisma/migrations/20261003210000_add_method_result_registry_persistence_foundation/migration.sql';
const checkPath = 'scripts/checkCanonicalMethodResultRegistryPersistenceFoundation.ts';
const schemaPath = 'prisma/schema.prisma';

const schema = readFileSync(schemaPath, 'utf8');
const migration = readFileSync(migrationPath, 'utf8');

const expectedModels = [
  'CanonicalMethod',
  'CanonicalMethodVersion',
  'CanonicalResult',
  'CanonicalResultVersion',
  'MethodResultProductionEdge',
  'CanonicalResultOwner',
  'ProductResultRole',
  'MethodResultAlias',
  'MethodVersionGovernanceReference',
  'ResultVersionConstituent',
] as const;

const expectedEnums = [
  'MethodResultRegistryLifecycleState',
  'ProductResultRoleKind',
  'MethodResultAliasKind',
  'MethodResultAliasAdjudicationState',
  'MethodVersionGovernanceReferenceKind',
] as const;

for (const model of expectedModels) {
  assert.match(schema, new RegExp(`model ${model} \\{`), `Missing ${model} schema model.`);
  assert.match(migration, new RegExp(`CREATE TABLE "${model}"`), `Missing ${model} migration table.`);
}

for (const registryEnum of expectedEnums) {
  assert.match(schema, new RegExp(`enum ${registryEnum} \\{`), `Missing ${registryEnum} schema enum.`);
  assert.match(migration, new RegExp(`CREATE TYPE "${registryEnum}"`), `Missing ${registryEnum} migration enum.`);
}

for (const lifecycle of [
  'ADMITTED',
  'ADMITTED_WITH_QUALIFICATIONS',
  'CANDIDATE',
  'GOVERNED_BUT_UNADMITTED',
  'HELD_PENDING_GOVERNANCE',
  'SUPERSEDED',
  'CORRECTED',
  'WITHDRAWN',
  'HISTORICAL_ONLY',
  'NOT_A_METHOD_PROFESSIONAL_JUDGMENT',
  'UNKNOWN',
]) assert.match(schema, new RegExp(`\\b${lifecycle}\\b`));

assert.match(schema, /model CanonicalMethodVersion[\s\S]*methodId\s+String[\s\S]*method\s+CanonicalMethod/);
assert.match(schema, /model CanonicalResultVersion[\s\S]*resultId\s+String[\s\S]*result\s+CanonicalResult/);
assert.match(schema, /model MethodResultProductionEdge[\s\S]*resultVersionId\s+String\s+@unique/);
assert.match(schema, /model CanonicalResultOwner[\s\S]*resultId\s+String\s+@unique/);
assert.match(schema, /enum ProductResultRoleKind \{[\s\S]*CONSUMER[\s\S]*COMMUNICATOR[\s\S]*PROJECTION_COMPOSITION[\s\S]*\}/);
assert.doesNotMatch(schema.match(/enum ProductResultRoleKind \{[\s\S]*?\}/)?.[0] ?? '', /\bOWNER\b/);
assert.match(schema, /model ResultVersionConstituent[\s\S]*compositeResultVersionId[\s\S]*constituentResultVersionId/);
assert.match(schema, /model MethodVersionGovernanceReference[\s\S]*SHARED_PRIMITIVE|enum MethodVersionGovernanceReferenceKind \{[\s\S]*SHARED_PRIMITIVE/);
assert.match(migration, /MethodResultAlias_target_by_state/);
assert.match(migration, /CanonicalMethod_immutability_guard/);
assert.match(migration, /CanonicalMethodVersion_immutability_guard/);
assert.match(migration, /CanonicalResult_immutability_guard/);
assert.match(migration, /CanonicalResultVersion_immutability_guard/);
assert.match(migration, /MethodResultAlias_immutability_guard/);
assert.equal((migration.match(/lifecycle cannot return to a mutable state/g) ?? []).length, 4);
assert.match(migration, /ResultVersionConstituent_no_self_reference/);
assert.match(migration, /CanonicalResultOwner_resultId_key/);
assert.match(migration, /MethodResultProductionEdge_resultVersionId_key/);

const createdTables = [...migration.matchAll(/CREATE TABLE "([^"]+)"/g)].map((match) => match[1]);
assert.deepEqual(createdTables.sort(), [...expectedModels].sort(), 'Migration must create only the empty registry foundation tables.');

const alteredTables = [...migration.matchAll(/ALTER TABLE "([^"]+)"/g)].map((match) => match[1]);
assert.equal(
  alteredTables.every((table) => expectedModels.includes(table as (typeof expectedModels)[number])),
  true,
  'Migration must alter only newly created registry foundation tables.',
);

for (const forbidden of [
  /^\s*INSERT\b/im,
  /^\s*UPDATE\b/im,
  /^\s*DELETE\b/im,
  /^\s*TRUNCATE\b/im,
  /^\s*DROP\b/im,
]) assert.doesNotMatch(migration, forbidden, `Migration contains forbidden mutation pattern ${forbidden}.`);

for (const forbiddenIdentity of [
  'AGENT_COHORT_BASIC_AGGREGATION_V1',
  'CURRENT_MARKET_METRICS_V1',
  'AGENT_CURRENT_SNAPSHOT_COMPARISON_V1',
  'SELLER_FINANCIAL_ESTIMATED_SCENARIO_CALCULATION_V1',
  'INVESTMENT_BREAKEVEN_CALCULATION_V1',
  'ADVANCED_INVESTMENT_RETURN_CALCULATION_V2',
  'MULTI_DIMENSIONAL_STRATEGY_CALCULATION_V1',
  'MULTI_PROPERTY_FINANCIAL_SCENARIO_ENGINE_V1',
  'REIE.',
]) {
  assert.doesNotMatch(`${schema}\n${migration}`, new RegExp(forbiddenIdentity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
}

const trackedDiff = execFileSync('git', ['diff', '--name-only', 'HEAD'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const untracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const changed = [...new Set([...trackedDiff, ...untracked])].sort();
const allowed = [schemaPath, migrationPath, checkPath].sort();
assert.deepEqual(changed, allowed, 'Workstream A changed files outside the bounded persistence foundation.');

const schemaNumstat = execFileSync('git', ['diff', '--numstat', 'HEAD', '--', schemaPath], { encoding: 'utf8' }).trim();
assert.match(schemaNumstat, /^\d+\s+0\s+prisma\/schema\.prisma$/, 'The existing Prisma schema may receive additions only.');

const protectedC2CPrefixes = [
  'app/agent/clients/',
  'app/api/agent/client-case-scenarios/',
  'components/agent/ClientCaseScenario',
  'components/agent/ClientCommandCenter.tsx',
  'components/agent/clientCaseScenarioTypes.ts',
  'components/agent/clientCommandCenterTypes.ts',
  'lib/admin/adminAuth.ts',
  'lib/clientCaseScenario',
  'middleware.ts',
  'package.json',
  'scripts/certifyClientCaseScenarioC2CLocal.ts',
  'scripts/checkClientCaseScenario',
  'scripts/seedClientCaseScenarioC2CLocalFixture.ts',
];
assert.equal(changed.some((path) => protectedC2CPrefixes.some((prefix) => path.startsWith(prefix))), false, 'Protected C2C path changed.');
assert.equal(changed.some((path) => path.startsWith('app/')), false, 'Routes or application pages changed.');
assert.equal(changed.some((path) => path.startsWith('components/')), false, 'UI files changed.');
assert.equal(changed.includes('package.json'), false, 'package.json changed.');

console.log('[canonical-method-result-registry-persistence-foundation] ok: empty additive schema, migration, immutability, ownership, lineage, alias, no-seed, no-backfill, and C2C boundary checks passed.');
