import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import {
  resolveExactMethodResultAlias,
  type MethodResultAliasRecord,
} from '../lib/methodResultLegacyAliasResolution';

const schemaPath = 'prisma/schema.prisma';
const workstreamAMigrationPath = 'prisma/migrations/20261003210000_add_method_result_registry_persistence_foundation/migration.sql';
const workstreamBMigrationPath = 'prisma/migrations/20261003230000_add_method_result_version_lineage_v1/migration.sql';
const workstreamCMigrationPath = 'prisma/migrations/20261003235000_add_method_result_legacy_alias_adapter_v1/migration.sql';
const resolverPath = 'lib/methodResultLegacyAliasResolution.ts';
const certifierPath = 'scripts/checkMethodResultLegacyAliasAdapter.ts';

const schema = readFileSync(schemaPath, 'utf8');
const workstreamAMigration = readFileSync(workstreamAMigrationPath, 'utf8');
const workstreamBMigration = readFileSync(workstreamBMigrationPath, 'utf8');
const workstreamCMigration = readFileSync(workstreamCMigrationPath, 'utf8');
const resolver = readFileSync(resolverPath, 'utf8');

assert.equal(createHash('sha256').update(workstreamAMigration).digest('hex'), '6c28594b434519e937dcbe3fd819d82e3250448ac976275198596f7766c2f3d0');
assert.equal(createHash('sha256').update(workstreamBMigration).digest('hex'), '7c386907227ac00adc37a50a382c53c263589c8164202c712371b18fcb8878ab');
assert.match(schema, /enum MethodResultAliasAdjudicationState \{[\s\S]*UNADJUDICATED[\s\S]*ADJUDICATED[\s\S]*HELD[\s\S]*UNMAPPED[\s\S]*REJECTED[\s\S]*\}/);

for (const required of [
  'MethodResultAlias_nonempty_source_identity',
  'MethodResultAlias_compatibility_guard',
  'MethodResultAlias rows preserve legacy label history and cannot be deleted',
  'MethodResultAlias source identity, provenance, and fingerprint are immutable',
  'Unresolved MethodResultAlias rows cannot carry a semantic target',
  'Adjudicated MethodResultAlias requires exactly one semantic target',
  'Adjudicated MethodResultAlias target must exist and be formal',
]) assert.ok(workstreamCMigration.includes(required), `Missing Workstream C invariant: ${required}`);

for (const forbidden of [
  /^\s*INSERT\b/im,
  /^\s*UPDATE\b/im,
  /^\s*DELETE\b/im,
  /^\s*TRUNCATE\b/im,
  /^\s*DROP\b/im,
  /ALTER TABLE "(?!MethodResultAlias")/,
  /ALTER TABLE "(?:OutputProduct|OutputVersion|ClientCaseScenario|ClientCaseScenarioVersion)"/,
]) assert.doesNotMatch(workstreamCMigration, forbidden, `Workstream C migration contains forbidden operation ${forbidden}.`);

for (const forbiddenIdentity of [
  'AGENT_COHORT_BASIC_AGGREGATION_V1',
  'CURRENT_MARKET_METRICS_V1',
  'SELLER_FINANCIAL_ESTIMATED_SCENARIO_CALCULATION_V1',
  'INVESTMENT_BREAKEVEN_CALCULATION_V1',
  'MULTI_PROPERTY_FINANCIAL_SCENARIO_ENGINE_V1',
]) assert.doesNotMatch(`${schema}\n${workstreamCMigration}\n${resolver}`, new RegExp(forbiddenIdentity));

const baseAlias: MethodResultAliasRecord = Object.freeze({
  aliasNamespace: 'test-only-runtime-label',
  aliasKind: 'CALCULATION_VERSION',
  aliasValue: 'test-only-calculation-v1',
  adjudicationState: 'ADJUDICATED',
  methodId: null,
  methodVersionId: 'test-only-method-version',
  resultId: null,
  resultVersionId: null,
});
const query = Object.freeze({ aliasNamespace: baseAlias.aliasNamespace, aliasKind: baseAlias.aliasKind, aliasValue: baseAlias.aliasValue });

assert.deepEqual(resolveExactMethodResultAlias(query, [baseAlias]), {
  resolved: true,
  target: { type: 'METHOD_VERSION', id: 'test-only-method-version' },
});
assert.deepEqual(resolveExactMethodResultAlias({ ...query, aliasValue: 'TEST-ONLY-CALCULATION-V1' }, [baseAlias]), { resolved: false, reason: 'MISSING' });
assert.deepEqual(resolveExactMethodResultAlias({ ...query, aliasValue: `${query.aliasValue} ` }, [baseAlias]), { resolved: false, reason: 'MISSING' });
assert.deepEqual(resolveExactMethodResultAlias(query, []), { resolved: false, reason: 'MISSING' });
assert.deepEqual(resolveExactMethodResultAlias(query, [baseAlias, baseAlias]), { resolved: false, reason: 'AMBIGUOUS' });

for (const adjudicationState of ['UNADJUDICATED', 'HELD', 'UNMAPPED', 'REJECTED'] as const) {
  assert.deepEqual(
    resolveExactMethodResultAlias(query, [{ ...baseAlias, adjudicationState, methodVersionId: null }]),
    { resolved: false, reason: adjudicationState },
  );
}

assert.deepEqual(
  resolveExactMethodResultAlias(query, [{ ...baseAlias, resultVersionId: 'test-only-result-version' }]),
  { resolved: false, reason: 'INVALID_TARGET_CARDINALITY' },
);
assert.deepEqual(
  resolveExactMethodResultAlias(query, [{ ...baseAlias, methodVersionId: null }]),
  { resolved: false, reason: 'INVALID_TARGET_CARDINALITY' },
);

const trackedDiff = execFileSync('git', ['diff', '--name-only', 'HEAD'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const untracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const changed = [...new Set([...trackedDiff, ...untracked])].sort();
const allowed = [schemaPath, workstreamCMigrationPath, resolverPath, certifierPath].sort();
assert.deepEqual(changed, allowed, 'Workstream C changed files outside the bounded alias compatibility scope.');

const schemaNumstat = execFileSync('git', ['diff', '--numstat', 'HEAD', '--', schemaPath], { encoding: 'utf8' }).trim();
assert.match(schemaNumstat, /^\d+\s+0\s+prisma\/schema\.prisma$/, 'Workstream C schema change must be additive only.');

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
assert.equal(changed.some((path) => protectedPrefixes.some((prefix) => path.startsWith(prefix))), false);

console.log('[method-result-legacy-alias-adapter] ok: exact fail-closed resolution, formal exclusive targets, immutable source labels, no rewrite/backfill, and protected path checks passed.');
