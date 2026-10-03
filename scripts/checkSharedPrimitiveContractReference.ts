import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import {
  resolveExactMethodVersionGovernanceReference,
  type GovernanceDependencyReference,
} from '../lib/methodVersionGovernanceReferenceResolution';

const schemaPath = 'prisma/schema.prisma';
const workstreamAMigrationPath = 'prisma/migrations/20261003210000_add_method_result_registry_persistence_foundation/migration.sql';
const workstreamBMigrationPath = 'prisma/migrations/20261003230000_add_method_result_version_lineage_v1/migration.sql';
const workstreamCMigrationPath = 'prisma/migrations/20261003235000_add_method_result_legacy_alias_adapter_v1/migration.sql';
const workstreamDMigrationPath = 'prisma/migrations/20261004000000_add_shared_primitive_contract_reference_controls_v1/migration.sql';
const resolverPath = 'lib/methodVersionGovernanceReferenceResolution.ts';
const certifierPath = 'scripts/checkSharedPrimitiveContractReference.ts';

const schema = readFileSync(schemaPath, 'utf8');
const workstreamAMigration = readFileSync(workstreamAMigrationPath, 'utf8');
const workstreamBMigration = readFileSync(workstreamBMigrationPath, 'utf8');
const workstreamCMigration = readFileSync(workstreamCMigrationPath, 'utf8');
const workstreamDMigration = readFileSync(workstreamDMigrationPath, 'utf8');
const resolver = readFileSync(resolverPath, 'utf8');

assert.equal(createHash('sha256').update(workstreamAMigration).digest('hex'), '6c28594b434519e937dcbe3fd819d82e3250448ac976275198596f7766c2f3d0');
assert.equal(createHash('sha256').update(workstreamBMigration).digest('hex'), '7c386907227ac00adc37a50a382c53c263589c8164202c712371b18fcb8878ab');
assert.equal(createHash('sha256').update(workstreamCMigration).digest('hex'), 'fd3998b9ba00d92dc3aca2bda01bfd2691c25b979d72dea369b0022271583fcf');

assert.match(schema, /model MethodVersionGovernanceReference \{[\s\S]*versionRef\s+String\s[\s\S]*@@unique\(\[methodVersionId, referenceKind, semanticRef, versionRef\]\)/);
assert.match(schema, /enum MethodVersionGovernanceReferenceKind \{[\s\S]*SHARED_PRIMITIVE[\s\S]*SHARED_CONTRACT[\s\S]*\}/);

for (const required of [
  'MethodVersionGovernanceReference_nonempty_identity',
  'MethodVersionGovernanceReference_exact_dependency_key',
  'MethodVersionGovernanceReference_immutability_guard',
  'MethodVersion governance dependency references are immutable',
  'MethodVersion governance dependency reference must be pinned before MethodVersion formalization',
  'Formal MethodVersion governance dependency references are immutable',
]) assert.ok(workstreamDMigration.includes(required), `Missing Workstream D invariant: ${required}`);

for (const forbidden of [
  /^\s*INSERT\b/im,
  /^\s*UPDATE\b/im,
  /^\s*DELETE\b/im,
  /^\s*TRUNCATE\b/im,
  /^\s*DROP\b/im,
  /ALTER TABLE "(?!MethodVersionGovernanceReference")/,
  /ALTER TABLE "(?:OutputProduct|OutputVersion|ClientCaseScenario|ClientCaseScenarioVersion)"/,
]) assert.doesNotMatch(workstreamDMigration, forbidden, `Workstream D migration contains forbidden operation ${forbidden}.`);

for (const forbiddenSemantic of [
  'mortgage amortization',
  'median',
  'price/square foot',
  'Materiality',
  'Period/Basis Compatibility',
]) assert.equal(`${schema}\n${workstreamDMigration}\n${resolver}`.includes(forbiddenSemantic), false, `Workstream D invented or admitted semantic literal: ${forbiddenSemantic}`);

const availablePrimitive: GovernanceDependencyReference = Object.freeze({
  referenceKind: 'SHARED_PRIMITIVE',
  semanticRef: 'test-only-primitive',
  versionRef: 'test-only-primitive-version',
  admissionState: 'AVAILABLE',
});
const availableContract: GovernanceDependencyReference = Object.freeze({
  referenceKind: 'SHARED_CONTRACT',
  semanticRef: 'test-only-contract',
  versionRef: 'test-only-contract-version',
  admissionState: 'AVAILABLE',
});
const heldContract: GovernanceDependencyReference = Object.freeze({
  referenceKind: 'SHARED_CONTRACT',
  semanticRef: 'test-only-held-contract',
  versionRef: 'test-only-held-contract-version',
  admissionState: 'HELD',
});
const query = Object.freeze({
  referenceKind: availablePrimitive.referenceKind,
  semanticRef: availablePrimitive.semanticRef,
  versionRef: availablePrimitive.versionRef,
});

assert.deepEqual(resolveExactMethodVersionGovernanceReference(query, [availablePrimitive]), {
  resolved: true,
  reference: availablePrimitive,
});
assert.deepEqual(resolveExactMethodVersionGovernanceReference({ ...query, semanticRef: `${query.semanticRef} ` }, [availablePrimitive]), {
  resolved: false,
  reason: 'INVALID_REFERENCE',
});
assert.deepEqual(resolveExactMethodVersionGovernanceReference({ ...query, versionRef: 'test-only-other-version' }, [availablePrimitive]), {
  resolved: false,
  reason: 'MISSING',
});
assert.deepEqual(resolveExactMethodVersionGovernanceReference(query, [availablePrimitive, availablePrimitive]), {
  resolved: false,
  reason: 'AMBIGUOUS',
});
assert.deepEqual(resolveExactMethodVersionGovernanceReference({
  referenceKind: availableContract.referenceKind,
  semanticRef: availableContract.semanticRef,
  versionRef: availableContract.versionRef,
}, [availableContract]), {
  resolved: true,
  reference: availableContract,
});
assert.deepEqual(resolveExactMethodVersionGovernanceReference({
  referenceKind: heldContract.referenceKind,
  semanticRef: heldContract.semanticRef,
  versionRef: heldContract.versionRef,
}, [heldContract]), {
  resolved: false,
  reason: 'HELD',
});

const trackedDiff = execFileSync('git', ['diff', '--name-only', 'HEAD'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const untracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const changed = [...new Set([...trackedDiff, ...untracked])].sort();
const allowed = [schemaPath, workstreamDMigrationPath, resolverPath, certifierPath].sort();
assert.deepEqual(changed, allowed, 'Workstream D changed files outside the bounded primitive/contract reference scope.');

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

console.log('[shared-primitive-contract-reference] ok: exact version-pinned primitive/contract references, immutable formal dependencies, fail-closed held resolution, no semantic population, and protected path checks passed.');
