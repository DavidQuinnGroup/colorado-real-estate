import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { validatePeriodBasisCompatibilityResultContext } from '../lib/periodBasisCompatibilityResultContextValidation';

const schemaPath = 'prisma/schema.prisma';
const migrationPath = 'prisma/migrations/20261004050000_add_period_basis_compatibility_result_context_v1/migration.sql';
const helperPath = 'lib/periodBasisCompatibilityResultContextValidation.ts';
const certifierPath = 'scripts/checkPeriodBasisCompatibilityResultContext.ts';
const priorMigrationHashes = {
  'prisma/migrations/20261003210000_add_method_result_registry_persistence_foundation/migration.sql': '6c28594b434519e937dcbe3fd819d82e3250448ac976275198596f7766c2f3d0',
  'prisma/migrations/20261003230000_add_method_result_version_lineage_v1/migration.sql': '7c386907227ac00adc37a50a382c53c263589c8164202c712371b18fcb8878ab',
  'prisma/migrations/20261003235000_add_method_result_legacy_alias_adapter_v1/migration.sql': 'fd3998b9ba00d92dc3aca2bda01bfd2691c25b979d72dea369b0022271583fcf',
  'prisma/migrations/20261004000000_add_shared_primitive_contract_reference_controls_v1/migration.sql': 'f5be91c11e539101ce05cad0b950893aa7ad3a3da3849e934bd3337b2417c24b',
  'prisma/migrations/20261004010000_add_product_result_role_binding_controls_v1/migration.sql': 'a2bbf7fa201afbc1f72b2115bcee69c11442cb6f2757b3a17c6c54c1e5026013',
  'prisma/migrations/20261004020000_add_semantic_composition_snapshot_pins_v1/migration.sql': '48b9538f3cbceab64b0b59d4b199626729dff78a4dac5988d3f70c871130bd53',
  'prisma/migrations/20261004030000_add_typed_baseline_reference_envelope_v1/migration.sql': '3afd6b85241e6b217673a4a408d6b74c64110d4645478c83ff58fe23588db543',
  'prisma/migrations/20261004040000_add_reporting_period_analytical_basis_reference_foundation_v1/migration.sql': 'f1b127fb8c4f4f05a7b5265e43128c788d161fcf2ad1d077163352f060cdd53c',
} as const;

const schema = readFileSync(schemaPath, 'utf8');
const migration = readFileSync(migrationPath, 'utf8');
const helper = readFileSync(helperPath, 'utf8');

for (const [path, expectedHash] of Object.entries(priorMigrationHashes)) {
  assert.equal(createHash('sha256').update(readFileSync(path)).digest('hex'), expectedHash, `${path} bytes changed.`);
}

const modelBlock = (source: string, name: string): string =>
  source.match(new RegExp(`model ${name} \\{[\\s\\S]*?\\n\\}`))?.[0] ?? '';

const context = modelBlock(schema, 'OutputSemanticCompositionCompatibilityContext');
for (const required of [
  /snapshotId\s+String/,
  /resultVersionPinId\s+String/,
  /reportingPeriodVersionPinId\s+String/,
  /analyticalBasisVersionPinId\s+String/,
  /authorityRef\s+String/,
  /roleRef\s+String/,
  /ordinal\s+Int/,
  /provenance\s+Json/,
  /integrityFingerprint\s+String\s+@unique/,
  /formalizedAt\s+DateTime\?/,
  /OutputSemanticCompositionResultVersionPin/,
  /OutputSemanticCompositionReportingPeriodVersionPin/,
  /OutputSemanticCompositionAnalyticalBasisVersionPin/,
  /@@unique\(\[snapshotId, resultVersionPinId, reportingPeriodVersionPinId, analyticalBasisVersionPinId, roleRef\]/,
  /@@unique\(\[snapshotId, roleRef, ordinal\]/,
]) assert.match(context, required);

for (const forbiddenField of [
  /compatibilityStatus/i,
  /compatibilityOutcome/i,
  /compatibilityScore/i,
  /compatibilityBoolean/i,
  /normalizationMethodVersionId/i,
  /qualification/i,
  /currentness/i,
  /materiality/i,
  /productDefinition/i,
  /methodVersionId/i,
]) assert.doesNotMatch(context, forbiddenField, `Context model crossed a held semantic boundary: ${forbiddenField}.`);

for (const required of [
  'OutputSemanticCompatibilityContext_exact_metadata',
  'OutputSemanticCompatibilityContext_fingerprint_key',
  'OutputSemanticCompatibilityContext_exact_tuple_key',
  'OutputSemanticCompatibilityContext_role_ordinal_key',
  'OutputSemanticCompatibilityContext_snapshot_fkey',
  'OutputSemanticCompatibilityContext_resultPin_fkey',
  'OutputSemanticCompatibilityContext_periodPin_fkey',
  'OutputSemanticCompatibilityContext_basisPin_fkey',
  'Compatibility context pins must belong to the same semantic snapshot',
  'Compatibility context requires a formal exact ResultVersion',
  'Compatibility context requires a formal exact Reporting Period Version',
  'Compatibility context requires a formal exact Analytical Basis Version',
  'Computational compatibility context requires one formal producing MethodVersion edge',
  'Non-computational compatibility context cannot have a producing MethodVersion edge',
  'Output semantic composition compatibility context identity and provenance are immutable',
  'Semantic snapshot formalization requires formal compatibility contexts',
  'MethodResultProductionEdge',
]) assert.ok(migration.includes(required), `Missing F3A-3 invariant: ${required}`);

for (const forbidden of [
  /^\s*INSERT\b/im,
  /^\s*UPDATE\b/im,
  /^\s*DELETE\b/im,
  /^\s*TRUNCATE\b/im,
  /^\s*DROP\b/im,
  /ALTER TABLE "(?:OutputSemanticCompositionSnapshot|OutputSemanticCompositionResultVersionPin|OutputSemanticCompositionReportingPeriodVersionPin|OutputSemanticCompositionAnalyticalBasisVersionPin|CanonicalMethodVersion|CanonicalResultVersion|MethodResultProductionEdge)"/,
  /CREATE TYPE/i,
]) assert.doesNotMatch(migration, forbidden, `F3A-3 migration contains forbidden operation ${forbidden}.`);

for (const forbiddenSemantic of [
  /DIRECTLY_COMPARABLE/,
  /GOVERNED_NORMALIZATION_REQUIRED/,
  /COMPARABLE_WITH_QUALIFICATION/,
  /NON_COMPARABLE/,
  /INSUFFICIENT_DATA/,
  /REVIEW_REQUIRED/,
  /compatibility(?:Status|Outcome|Score|Boolean)/i,
  /normalization(?:Engine|Rule|Formula)/i,
  /conversion(?:Engine|Rule|Formula)/i,
  /materiality/i,
  /currentness/i,
]) assert.doesNotMatch([context, migration, helper].join('\n'), forbiddenSemantic, `F3A-3 crossed a held semantic boundary: ${forbiddenSemantic}.`);

const headSchema = execFileSync('git', ['show', 'HEAD:prisma/schema.prisma'], { encoding: 'utf8' });
const stripContextReverseRelation = (block: string): string => block
  .split('\n')
  .filter((line) => !line.includes('compatibilityContexts'))
  .join('\n');
for (const model of [
  'OutputSemanticCompositionSnapshot',
  'OutputSemanticCompositionResultVersionPin',
  'OutputSemanticCompositionReportingPeriodVersionPin',
  'OutputSemanticCompositionAnalyticalBasisVersionPin',
]) {
  assert.equal(stripContextReverseRelation(modelBlock(schema, model)), modelBlock(headSchema, model), `${model} changed beyond its additive reverse relation.`);
}
for (const unchangedModel of [
  'CanonicalMethod',
  'CanonicalMethodVersion',
  'CanonicalResult',
  'CanonicalResultVersion',
  'MethodResultProductionEdge',
  'ReportingPeriodReference',
  'ReportingPeriodReferenceVersion',
  'AnalyticalBasisReference',
  'AnalyticalBasisReferenceVersion',
  'BaselineReference',
  'BaselineReferenceVersion',
]) assert.equal(modelBlock(schema, unchangedModel), modelBlock(headSchema, unchangedModel), `${unchangedModel} changed.`);

const validComputational = Object.freeze({
  snapshotId: 'test-only-snapshot-id',
  resultPin: {
    id: 'test-only-result-pin-id',
    snapshotId: 'test-only-snapshot-id',
    resultVersionId: 'test-only-result-version-id',
    resultVersionLifecycleState: 'ADMITTED',
    methodRequirement: 'METHOD_VERSION_REQUIRED' as const,
  },
  reportingPeriodPin: {
    id: 'test-only-period-pin-id',
    snapshotId: 'test-only-snapshot-id',
    reportingPeriodReferenceVersionId: 'test-only-period-version-id',
    referenceVersionFormalizedAt: '2026-10-03T00:00:00.000Z',
  },
  analyticalBasisPin: {
    id: 'test-only-basis-pin-id',
    snapshotId: 'test-only-snapshot-id',
    analyticalBasisReferenceVersionId: 'test-only-basis-version-id',
    referenceVersionFormalizedAt: '2026-10-03T00:00:00.000Z',
  },
  productionEdge: {
    resultVersionId: 'test-only-result-version-id',
    methodVersionId: 'test-only-method-version-id',
    methodVersionLifecycleState: 'ADMITTED',
  },
});

assert.deepEqual(validatePeriodBasisCompatibilityResultContext(validComputational), {
  valid: true,
  failure: null,
  producingMethodVersionId: 'test-only-method-version-id',
});
for (const [input, failure] of [
  [{ ...validComputational, snapshotId: 'latest' }, 'LATEST_OR_CURRENT_REFERENCE_FORBIDDEN'],
  [{ ...validComputational, reportingPeriodPin: { ...validComputational.reportingPeriodPin, snapshotId: 'test-only-other-snapshot' } }, 'CROSS_SNAPSHOT_PIN_MIXING'],
  [{ ...validComputational, resultPin: { ...validComputational.resultPin, resultVersionLifecycleState: 'CANDIDATE' } }, 'RESULT_VERSION_NOT_FORMAL'],
  [{ ...validComputational, reportingPeriodPin: { ...validComputational.reportingPeriodPin, referenceVersionFormalizedAt: null } }, 'REPORTING_PERIOD_VERSION_NOT_FORMAL'],
  [{ ...validComputational, reportingPeriodPin: { ...validComputational.reportingPeriodPin, referenceVersionFormalizedAt: 'not-a-timestamp' } }, 'REPORTING_PERIOD_VERSION_NOT_FORMAL'],
  [{ ...validComputational, analyticalBasisPin: { ...validComputational.analyticalBasisPin, referenceVersionFormalizedAt: null } }, 'ANALYTICAL_BASIS_VERSION_NOT_FORMAL'],
  [{ ...validComputational, analyticalBasisPin: { ...validComputational.analyticalBasisPin, referenceVersionFormalizedAt: 'not-a-timestamp' } }, 'ANALYTICAL_BASIS_VERSION_NOT_FORMAL'],
  [{ ...validComputational, productionEdge: null }, 'PRODUCING_METHOD_EDGE_MISSING'],
  [{ ...validComputational, productionEdge: { ...validComputational.productionEdge, resultVersionId: 'test-only-other-result-version' } }, 'PRODUCING_METHOD_EDGE_MISSING'],
  [{ ...validComputational, productionEdge: { ...validComputational.productionEdge, methodVersionLifecycleState: 'CANDIDATE' } }, 'PRODUCING_METHOD_VERSION_NOT_FORMAL'],
] as const) assert.equal(validatePeriodBasisCompatibilityResultContext(input).failure, failure);

const validNonComputational = {
  ...validComputational,
  resultPin: { ...validComputational.resultPin, methodRequirement: 'METHOD_VERSION_NOT_APPLICABLE' as const },
  productionEdge: null,
};
assert.deepEqual(validatePeriodBasisCompatibilityResultContext(validNonComputational), {
  valid: true,
  failure: null,
  producingMethodVersionId: null,
});
assert.equal(validatePeriodBasisCompatibilityResultContext({
  ...validNonComputational,
  productionEdge: validComputational.productionEdge,
}).failure, 'UNEXPECTED_PRODUCING_METHOD_EDGE');

const trackedDiff = execFileSync('git', ['diff', '--name-only', 'HEAD'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const untracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const changed = [...new Set([...trackedDiff, ...untracked])].sort();
const allowed = [schemaPath, migrationPath, helperPath, certifierPath].sort();
assert.deepEqual(changed, allowed, 'F3A-3 changed files outside the bounded implementation scope.');

const schemaNumstat = execFileSync('git', ['diff', '--numstat', 'HEAD', '--', schemaPath], { encoding: 'utf8' }).trim();
assert.match(schemaNumstat, /^\d+\s+0\s+prisma\/schema\.prisma$/, 'F3A-3 schema change must be additive only.');

const forbiddenPaths = [
  'app/',
  'components/',
  'middleware.ts',
  'package.json',
  'lib/outputPersistenceFoundation.ts',
  'lib/clientCaseScenario',
  'lib/admin/',
];
assert.equal(changed.some((path) => forbiddenPaths.some((prefix) => path.startsWith(prefix))), false);

console.log('[period-basis-compatibility-result-context] ok: exact same-snapshot pin tuple, governed ResultVersion producer resolution, empty additive foundation, no compatibility calculation, and protected boundaries passed.');
