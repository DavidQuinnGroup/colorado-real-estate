import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const schemaPath = 'prisma/schema.prisma';
const workstreamAMigrationPath = 'prisma/migrations/20261003210000_add_method_result_registry_persistence_foundation/migration.sql';
const workstreamBMigrationPath = 'prisma/migrations/20261003230000_add_method_result_version_lineage_v1/migration.sql';
const certifierPath = 'scripts/checkMethodResultVersionLineage.ts';

const schema = readFileSync(schemaPath, 'utf8');
const workstreamAMigration = readFileSync(workstreamAMigrationPath, 'utf8');
const workstreamBMigration = readFileSync(workstreamBMigrationPath, 'utf8');

assert.equal(
  createHash('sha256').update(workstreamAMigration).digest('hex'),
  '6c28594b434519e937dcbe3fd819d82e3250448ac976275198596f7766c2f3d0',
  'Workstream A migration bytes changed.',
);

assert.match(schema, /enum ResultVersionMethodRequirement \{[\s\S]*METHOD_VERSION_REQUIRED[\s\S]*METHOD_VERSION_NOT_APPLICABLE[\s\S]*\}/);
assert.match(schema, /model CanonicalResultVersion \{[\s\S]*methodRequirement\s+ResultVersionMethodRequirement\?/);

for (const required of [
  'CanonicalMethodVersion_lineagePredecessor_key',
  'CanonicalResultVersion_lineagePredecessor_key',
  'CanonicalMethodVersion_lineage_guard',
  'CanonicalResultVersion_lineage_guard',
  'MethodResultProductionEdge_lineage_guard',
  'ResultVersionConstituent_lineage_guard',
  'MethodVersion lineage must remain within one CanonicalMethod',
  'ResultVersion lineage must remain within one CanonicalResult',
  'Formal MethodVersion requires a formal CanonicalMethod',
  'Formal ResultVersion requires a formal CanonicalResult',
  'Computational ResultVersion requires exactly one MethodVersion producer',
  'Non-computational ResultVersion cannot have a MethodVersion producer',
  'MethodResultProductionEdge rows are immutable',
  'ResultVersionConstituent rows are immutable',
  'MethodVersion lineage cycle is not allowed',
  'ResultVersion lineage cycle is not allowed',
  'Composite ResultVersion constituent cycle is not allowed',
]) assert.ok(workstreamBMigration.includes(required), `Missing Workstream B invariant: ${required}`);

for (const forbidden of [
  /^\s*INSERT\b/im,
  /^\s*UPDATE\b/im,
  /^\s*DELETE\b/im,
  /^\s*TRUNCATE\b/im,
  /^\s*DROP\b/im,
  /ALTER TABLE "(?:OutputProduct|OutputVersion|ClientCaseScenario|ClientCaseScenarioVersion)"/,
]) assert.doesNotMatch(workstreamBMigration, forbidden, `Workstream B migration contains forbidden operation ${forbidden}.`);

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
  assert.doesNotMatch(`${schema}\n${workstreamBMigration}`, new RegExp(forbiddenIdentity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
}

const trackedDiff = execFileSync('git', ['diff', '--name-only', 'HEAD'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const untracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const changed = [...new Set([...trackedDiff, ...untracked])].sort();
const allowed = [schemaPath, workstreamBMigrationPath, certifierPath].sort();
assert.deepEqual(changed, allowed, 'Workstream B changed files outside the bounded lineage scope.');

const schemaNumstat = execFileSync('git', ['diff', '--numstat', 'HEAD', '--', schemaPath], { encoding: 'utf8' }).trim();
assert.match(schemaNumstat, /^\d+\s+0\s+prisma\/schema\.prisma$/, 'Workstream B schema change must be additive only.');

const protectedPrefixes = [
  'app/',
  'components/',
  'lib/admin/adminAuth.ts',
  'lib/clientCaseScenario',
  'middleware.ts',
  'package.json',
  'scripts/certifyClientCaseScenario',
  'scripts/checkClientCaseScenario',
  'scripts/seedClientCaseScenario',
];
assert.equal(changed.some((path) => protectedPrefixes.some((prefix) => path.startsWith(prefix))), false, 'Protected C2C, route, UI, middleware, or package path changed.');

console.log('[method-result-version-lineage] ok: Workstream A integrity, immutable same-identity acyclic version lineage, exact producer semantics, constituent lineage, no seed/backfill, and protected path checks passed.');
