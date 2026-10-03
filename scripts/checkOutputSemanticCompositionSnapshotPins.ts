import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const schemaPath = 'prisma/schema.prisma';
const migrationPaths = {
  A: 'prisma/migrations/20261003210000_add_method_result_registry_persistence_foundation/migration.sql',
  B: 'prisma/migrations/20261003230000_add_method_result_version_lineage_v1/migration.sql',
  C: 'prisma/migrations/20261003235000_add_method_result_legacy_alias_adapter_v1/migration.sql',
  D: 'prisma/migrations/20261004000000_add_shared_primitive_contract_reference_controls_v1/migration.sql',
  E: 'prisma/migrations/20261004010000_add_product_result_role_binding_controls_v1/migration.sql',
  F1: 'prisma/migrations/20261004020000_add_semantic_composition_snapshot_pins_v1/migration.sql',
} as const;
const certifierPath = 'scripts/checkOutputSemanticCompositionSnapshotPins.ts';

const expectedMigrationHashes = {
  A: '6c28594b434519e937dcbe3fd819d82e3250448ac976275198596f7766c2f3d0',
  B: '7c386907227ac00adc37a50a382c53c263589c8164202c712371b18fcb8878ab',
  C: 'fd3998b9ba00d92dc3aca2bda01bfd2691c25b979d72dea369b0022271583fcf',
  D: 'f5be91c11e539101ce05cad0b950893aa7ad3a3da3849e934bd3337b2417c24b',
  E: 'a2bbf7fa201afbc1f72b2115bcee69c11442cb6f2757b3a17c6c54c1e5026013',
} as const;

const schema = readFileSync(schemaPath, 'utf8');
const migrations = Object.fromEntries(
  Object.entries(migrationPaths).map(([key, path]) => [key, readFileSync(path, 'utf8')]),
) as Record<keyof typeof migrationPaths, string>;

for (const [workstream, expectedHash] of Object.entries(expectedMigrationHashes)) {
  assert.equal(
    createHash('sha256').update(migrations[workstream as keyof typeof migrations]).digest('hex'),
    expectedHash,
    `Workstream ${workstream} migration bytes changed.`,
  );
}

const snapshotModel = schema.match(/model OutputSemanticCompositionSnapshot \{[\s\S]*?\n\}/)?.[0] ?? '';
const methodPinModel = schema.match(/model OutputSemanticCompositionMethodVersionPin \{[\s\S]*?\n\}/)?.[0] ?? '';
const resultPinModel = schema.match(/model OutputSemanticCompositionResultVersionPin \{[\s\S]*?\n\}/)?.[0] ?? '';

assert.match(snapshotModel, /outputVersionId\s+String\s+@unique/);
assert.match(snapshotModel, /productReference\s+ProductDefinitionReference/);
assert.match(snapshotModel, /integrityFingerprint\s+String\s+@unique/);
assert.match(snapshotModel, /formalizedAt\s+DateTime\?/);
assert.match(methodPinModel, /methodVersion\s+CanonicalMethodVersion/);
assert.match(methodPinModel, /@@unique\(\[snapshotId, methodVersionId, roleRef\]/);
assert.match(methodPinModel, /@@unique\(\[snapshotId, roleRef, ordinal\]/);
assert.match(resultPinModel, /resultVersion\s+CanonicalResultVersion/);
assert.match(resultPinModel, /@@unique\(\[snapshotId, resultVersionId, roleRef\]/);
assert.match(resultPinModel, /@@unique\(\[snapshotId, roleRef, ordinal\]/);

for (const required of [
  'OutputSemanticCompositionSnapshot_outputVersionId_key',
  'OutputSemanticCompositionSnapshot_productReference_fkey',
  'OutputSemanticMethodPin_methodVersion_fkey',
  'OutputSemanticResultPin_resultVersion_fkey',
  'OutputSemanticMethodPin_exact_role_key',
  'OutputSemanticMethodPin_role_ordinal_key',
  'OutputSemanticResultPin_exact_role_key',
  'OutputSemanticResultPin_role_ordinal_key',
  'OutputSemanticCompositionSnapshot_immutability_guard',
  'OutputSemanticCompositionMethodPin_immutability_guard',
  'OutputSemanticCompositionResultPin_immutability_guard',
  'Formal Output semantic composition snapshots are immutable',
  'Formal Output semantic composition MethodVersion pins are immutable',
  'Formal Output semantic composition ResultVersion pins are immutable',
  'Formal Output semantic composition does not accept additional MethodVersion pins',
  'Formal Output semantic composition does not accept additional ResultVersion pins',
]) assert.ok(migrations.F1.includes(required), `Missing Workstream F1 invariant: ${required}`);
assert.equal((migrations.F1.match(/FOR UPDATE;/g) ?? []).length, 2, 'Both pin guards must serialize with snapshot formalization.');

for (const forbidden of [
  /^\s*INSERT\b/im,
  /^\s*UPDATE\b/im,
  /^\s*DELETE\b/im,
  /^\s*TRUNCATE\b/im,
  /^\s*DROP\b/im,
  /ALTER TABLE "(?:OutputVersion|OutputEvidenceSnapshot|OutputDependency)"/,
]) assert.doesNotMatch(migrations.F1, forbidden, `Workstream F1 migration contains forbidden operation ${forbidden}.`);

const semanticSurface = `${snapshotModel}\n${methodPinModel}\n${resultPinModel}\n${migrations.F1}`;
for (const forbiddenSemantic of [
  'ClientCaseScenario',
  'FinancialContextManifest',
  'currentVersionId',
  'Baseline',
  'Currentness',
  'OutputDraft',
  'OutputEvidenceSnapshot',
  'OutputDependency',
  'calculationContract',
  'latestMethod',
  'latestResult',
]) assert.doesNotMatch(semanticSurface, new RegExp(forbiddenSemantic, 'i'));

const trackedDiff = execFileSync('git', ['diff', '--name-only', 'HEAD'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const untracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const changed = [...new Set([...trackedDiff, ...untracked])].sort();
const allowed = [schemaPath, migrationPaths.F1, certifierPath].sort();
assert.deepEqual(changed, allowed, 'Workstream F1 changed files outside the bounded semantic snapshot scope.');

const schemaNumstat = execFileSync('git', ['diff', '--numstat', 'HEAD', '--', schemaPath], { encoding: 'utf8' }).trim();
assert.match(schemaNumstat, /^\d+\s+0\s+prisma\/schema\.prisma$/, 'Workstream F1 schema change must be additive only.');

const protectedPrefixes = [
  'app/',
  'components/',
  'lib/',
  'middleware.ts',
  'package.json',
  'scripts/certifyClientCaseScenario',
  'scripts/checkClientCaseScenario',
  'scripts/seedClientCaseScenario',
];
assert.equal(changed.some((path) => protectedPrefixes.some((prefix) => path.startsWith(prefix))), false);

console.log('[output-semantic-composition-snapshot-pins] ok: one immutable companion snapshot per OutputVersion, exact Product/MethodVersion/ResultVersion pins, no latest substitution, no population, and protected boundaries passed.');
