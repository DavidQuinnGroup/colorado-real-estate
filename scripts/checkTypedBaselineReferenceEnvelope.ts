import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import {
  resolveExactBaselineResourceReference,
  type BaselineReferenceAdapter,
  type ExactBaselineResourceReference,
} from '../lib/baselineReferenceAdapterContract';

const schemaPath = 'prisma/schema.prisma';
const migrationPath = 'prisma/migrations/20261004030000_add_typed_baseline_reference_envelope_v1/migration.sql';
const helperPath = 'lib/baselineReferenceAdapterContract.ts';
const certifierPath = 'scripts/checkTypedBaselineReferenceEnvelope.ts';
const priorMigrationHashes = {
  'prisma/migrations/20261003210000_add_method_result_registry_persistence_foundation/migration.sql': '6c28594b434519e937dcbe3fd819d82e3250448ac976275198596f7766c2f3d0',
  'prisma/migrations/20261003230000_add_method_result_version_lineage_v1/migration.sql': '7c386907227ac00adc37a50a382c53c263589c8164202c712371b18fcb8878ab',
  'prisma/migrations/20261003235000_add_method_result_legacy_alias_adapter_v1/migration.sql': 'fd3998b9ba00d92dc3aca2bda01bfd2691c25b979d72dea369b0022271583fcf',
  'prisma/migrations/20261004000000_add_shared_primitive_contract_reference_controls_v1/migration.sql': 'f5be91c11e539101ce05cad0b950893aa7ad3a3da3849e934bd3337b2417c24b',
  'prisma/migrations/20261004010000_add_product_result_role_binding_controls_v1/migration.sql': 'a2bbf7fa201afbc1f72b2115bcee69c11442cb6f2757b3a17c6c54c1e5026013',
  'prisma/migrations/20261004020000_add_semantic_composition_snapshot_pins_v1/migration.sql': '48b9538f3cbceab64b0b59d4b199626729dff78a4dac5988d3f70c871130bd53',
} as const;

const schema = readFileSync(schemaPath, 'utf8');
const migration = readFileSync(migrationPath, 'utf8');
const helper = readFileSync(helperPath, 'utf8');

for (const [path, expectedHash] of Object.entries(priorMigrationHashes)) {
  assert.equal(createHash('sha256').update(readFileSync(path)).digest('hex'), expectedHash, `${path} bytes changed.`);
}

const modelBlock = (source: string, name: string): string =>
  source.match(new RegExp(`model ${name} \\{[\\s\\S]*?\\n\\}`))?.[0] ?? '';

const baselineReference = modelBlock(schema, 'BaselineReference');
const baselineReferenceVersion = modelBlock(schema, 'BaselineReferenceVersion');
assert.match(baselineReference, /referenceKey\s+String\s+@unique/);
assert.match(baselineReference, /baselineFamilyRef\s+String/);
assert.match(baselineReference, /governingOwnerRef\s+String/);
assert.match(baselineReference, /productReference\s+ProductDefinitionReference\?/);
assert.match(baselineReferenceVersion, /targetResourceType\s+String/);
assert.match(baselineReferenceVersion, /targetResourceId\s+String/);
assert.match(baselineReferenceVersion, /targetResourceVersion\s+String/);
assert.match(baselineReferenceVersion, /supersedesReferenceVersionId\s+String\?\s+@unique/);
assert.match(baselineReferenceVersion, /correctionOfReferenceVersionId\s+String\?\s+@unique/);

for (const required of [
  'BaselineReference_nonempty_identity',
  'BaselineReference_product_reference_pair',
  'BaselineReferenceVersion_exact_target',
  'BaselineReferenceVersion_lineage_exclusive',
  'BaselineReferenceVersion_no_self_reference',
  'BaselineReferenceVersion_lineagePredecessor_key',
  'BaselineReference_productReference_fkey',
  'BaselineReferenceVersion_immutability_guard',
  'BaselineReferenceVersion_lineage_guard',
  'Baseline reference identity is immutable',
  'Baseline reference Version lineage must remain within one Baseline reference identity',
  'Baseline reference Version lineage predecessor must be formal',
  'Formal Baseline reference Versions are immutable',
]) assert.ok(migration.includes(required), `Missing F3A-1 invariant: ${required}`);

for (const forbidden of [
  /^\s*INSERT\b/im,
  /^\s*UPDATE\b/im,
  /^\s*DELETE\b/im,
  /^\s*TRUNCATE\b/im,
  /^\s*DROP\b/im,
  /ALTER TABLE "(?:OutputSemanticCompositionSnapshot|OutputVersion|OutputEvidenceSnapshot|OutputDependency|ClientCaseScenario|ClientCaseScenarioVersion)"/,
]) assert.doesNotMatch(migration, forbidden, `F3A-1 migration contains forbidden operation ${forbidden}.`);

const headSchema = execFileSync('git', ['show', 'HEAD:prisma/schema.prisma'], { encoding: 'utf8' });
for (const f1Model of [
  'OutputSemanticCompositionSnapshot',
  'OutputSemanticCompositionMethodVersionPin',
  'OutputSemanticCompositionResultVersionPin',
]) {
  assert.equal(modelBlock(schema, f1Model), modelBlock(headSchema, f1Model), `F1 model ${f1Model} changed.`);
}

const boundedSurface = `${baselineReference}\n${baselineReferenceVersion}\n${migration}\n${helper}`;
for (const forbiddenSemantic of [
  /\bP09\b/i,
  /\bP15\b/i,
  /\bP23\b/i,
  /\bP29\b/i,
  /\bP30\b/i,
  /\bP33\b/i,
  /\bP35\b/i,
  /CANONICAL_BASELINE/i,
  /EIAInitiativeBaseline/i,
  /ReportingPeriodReference/i,
  /AnalyticalBasisReference/i,
  /\bMateriality\b/i,
  /\bCurrentness\b/i,
  /\bQualification\b/i,
  /currentVersionId/i,
]) assert.doesNotMatch(boundedSurface, forbiddenSemantic, `F3A-1 crossed a held semantic boundary: ${forbiddenSemantic}.`);

const exactReference: ExactBaselineResourceReference = Object.freeze({
  resourceType: 'test-only-resource-type',
  resourceId: 'test-only-resource-id',
  resourceVersion: 'test-only-resource-version-v1',
});
const adapter: BaselineReferenceAdapter = Object.freeze({
  resourceType: exactReference.resourceType,
  validateExactReference: (reference) => Object.freeze({
    valid: true as const,
    exactReference: Object.freeze({ ...reference }),
    ownerRef: 'test-only-owner',
    familyRef: 'test-only-family',
    finalityStateRef: 'test-only-final',
  }),
});
const expectation = Object.freeze({
  ownerRef: 'test-only-owner',
  familyRef: 'test-only-family',
  requiredFinalityStateRef: 'test-only-final',
});

assert.equal(resolveExactBaselineResourceReference(exactReference, expectation, adapter).resolved, true);
assert.deepEqual(resolveExactBaselineResourceReference({ ...exactReference, resourceVersion: 'latest' }, expectation, adapter), {
  resolved: false,
  reason: 'LATEST_OR_CURRENT_VERSION_FORBIDDEN',
});
assert.deepEqual(resolveExactBaselineResourceReference({ ...exactReference, resourceId: `${exactReference.resourceId} ` }, expectation, adapter), {
  resolved: false,
  reason: 'INVALID_EXACT_REFERENCE',
});
assert.deepEqual(resolveExactBaselineResourceReference(exactReference, expectation), { resolved: false, reason: 'NO_ADAPTER' });
assert.deepEqual(resolveExactBaselineResourceReference(exactReference, expectation, { ...adapter, resourceType: 'test-only-other-type' }), {
  resolved: false,
  reason: 'RESOURCE_TYPE_MISMATCH',
});
assert.deepEqual(resolveExactBaselineResourceReference(exactReference, expectation, {
  ...adapter,
  validateExactReference: () => Object.freeze({ valid: false as const, reason: 'HELD' as const }),
}), { resolved: false, reason: 'HELD' });
assert.deepEqual(resolveExactBaselineResourceReference(exactReference, expectation, {
  ...adapter,
  validateExactReference: () => Object.freeze({
    valid: true as const,
    exactReference: Object.freeze({ ...exactReference, resourceVersion: 'test-only-other-version' }),
    ownerRef: 'test-only-owner',
    familyRef: 'test-only-family',
  }),
}), { resolved: false, reason: 'ADAPTER_REFERENCE_MISMATCH' });
assert.deepEqual(resolveExactBaselineResourceReference(exactReference, expectation, {
  ...adapter,
  validateExactReference: () => Object.freeze({
    valid: true as const,
    exactReference,
    ownerRef: 'test-only-other-owner',
    familyRef: 'test-only-family',
    finalityStateRef: 'test-only-final',
  }),
}), { resolved: false, reason: 'ADAPTER_OWNER_FAMILY_MISMATCH' });
assert.deepEqual(resolveExactBaselineResourceReference(exactReference, expectation, {
  ...adapter,
  validateExactReference: () => Object.freeze({
    valid: true as const,
    exactReference,
    ownerRef: 'test-only-owner',
    familyRef: 'test-only-family',
    finalityStateRef: 'test-only-draft',
  }),
}), { resolved: false, reason: 'ADAPTER_FINALITY_MISMATCH' });

const trackedDiff = execFileSync('git', ['diff', '--name-only', 'HEAD'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const untracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const changed = [...new Set([...trackedDiff, ...untracked])].sort();
const allowed = [schemaPath, migrationPath, helperPath, certifierPath].sort();
assert.deepEqual(changed, allowed, 'F3A-1 changed files outside the bounded implementation scope.');

const schemaNumstat = execFileSync('git', ['diff', '--numstat', 'HEAD', '--', schemaPath], { encoding: 'utf8' }).trim();
assert.match(schemaNumstat, /^\d+\s+0\s+prisma\/schema\.prisma$/, 'F3A-1 schema change must be additive only.');

const forbiddenPaths = [
  'app/',
  'components/',
  'lib/admin/',
  'lib/clientCaseScenario',
  'middleware.ts',
  'package.json',
  'lib/outputPersistenceFoundation.ts',
];
assert.equal(changed.some((path) => forbiddenPaths.some((prefix) => path.startsWith(prefix))), false);

console.log('[typed-baseline-reference-envelope] ok: exact immutable resource references, fail-closed adapter contract, lineage, empty additive foundation, unchanged F1 models, and protected boundaries passed.');
