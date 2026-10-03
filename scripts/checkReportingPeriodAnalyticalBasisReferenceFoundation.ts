import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { validateExactReferenceVersionPin } from '../lib/periodBasisReferenceValidation';

const schemaPath = 'prisma/schema.prisma';
const migrationPath = 'prisma/migrations/20261004040000_add_reporting_period_analytical_basis_reference_foundation_v1/migration.sql';
const helperPath = 'lib/periodBasisReferenceValidation.ts';
const certifierPath = 'scripts/checkReportingPeriodAnalyticalBasisReferenceFoundation.ts';
const priorMigrationHashes = {
  'prisma/migrations/20261003210000_add_method_result_registry_persistence_foundation/migration.sql': '6c28594b434519e937dcbe3fd819d82e3250448ac976275198596f7766c2f3d0',
  'prisma/migrations/20261003230000_add_method_result_version_lineage_v1/migration.sql': '7c386907227ac00adc37a50a382c53c263589c8164202c712371b18fcb8878ab',
  'prisma/migrations/20261003235000_add_method_result_legacy_alias_adapter_v1/migration.sql': 'fd3998b9ba00d92dc3aca2bda01bfd2691c25b979d72dea369b0022271583fcf',
  'prisma/migrations/20261004000000_add_shared_primitive_contract_reference_controls_v1/migration.sql': 'f5be91c11e539101ce05cad0b950893aa7ad3a3da3849e934bd3337b2417c24b',
  'prisma/migrations/20261004010000_add_product_result_role_binding_controls_v1/migration.sql': 'a2bbf7fa201afbc1f72b2115bcee69c11442cb6f2757b3a17c6c54c1e5026013',
  'prisma/migrations/20261004020000_add_semantic_composition_snapshot_pins_v1/migration.sql': '48b9538f3cbceab64b0b59d4b199626729dff78a4dac5988d3f70c871130bd53',
  'prisma/migrations/20261004030000_add_typed_baseline_reference_envelope_v1/migration.sql': '3afd6b85241e6b217673a4a408d6b74c64110d4645478c83ff58fe23588db543',
} as const;

const schema = readFileSync(schemaPath, 'utf8');
const migration = readFileSync(migrationPath, 'utf8');
const helper = readFileSync(helperPath, 'utf8');

for (const [path, expectedHash] of Object.entries(priorMigrationHashes)) {
  assert.equal(createHash('sha256').update(readFileSync(path)).digest('hex'), expectedHash, `${path} bytes changed.`);
}

const modelBlock = (source: string, name: string): string =>
  source.match(new RegExp(`model ${name} \\{[\\s\\S]*?\\n\\}`))?.[0] ?? '';

const periodReference = modelBlock(schema, 'ReportingPeriodReference');
const periodVersion = modelBlock(schema, 'ReportingPeriodReferenceVersion');
const basisReference = modelBlock(schema, 'AnalyticalBasisReference');
const basisVersion = modelBlock(schema, 'AnalyticalBasisReferenceVersion');
const periodPin = modelBlock(schema, 'OutputSemanticCompositionReportingPeriodVersionPin');
const basisPin = modelBlock(schema, 'OutputSemanticCompositionAnalyticalBasisVersionPin');

for (const [block, required] of [
  [periodReference, /periodTypeRef\s+String/],
  [periodReference, /governingAuthorityRef\s+String/],
  [periodVersion, /versionRef\s+String/],
  [periodVersion, /asOfAt\s+DateTime\?/],
  [periodVersion, /periodStartAt\s+DateTime\?/],
  [periodVersion, /periodEndAt\s+DateTime\?/],
  [periodVersion, /timezoneRef\s+String\?/],
  [periodVersion, /endpointRuleRef\s+String\?/],
  [periodVersion, /dataThroughAt\s+DateTime\?/],
  [basisReference, /governingAuthorityRef\s+String/],
  [basisVersion, /semanticDimensions\s+Json/],
  [basisVersion, /unitsRef\s+String\?/],
  [basisVersion, /currencyRef\s+String\?/],
  [basisVersion, /truthClassRef\s+String\?/],
  [periodPin, /reportingPeriodReferenceVersionId\s+String/],
  [basisPin, /analyticalBasisReferenceVersionId\s+String/],
] as const) assert.match(block, required);

for (const required of [
  'ReportingPeriodReference_nonempty_identity',
  'ReportingPeriodReferenceVersion_exact_identity',
  'ReportingPeriodReferenceVersion_lineagePredecessor_key',
  'ReportingPeriodReferenceVersion_lineage_guard',
  'ReportingPeriodReferenceVersion_immutability_guard',
  'Reporting Period reference Version cannot reference itself',
  'AnalyticalBasisReference_nonempty_identity',
  'AnalyticalBasisReferenceVersion_exact_identity',
  'AnalyticalBasisReferenceVersion_lineagePredecessor_key',
  'AnalyticalBasisReferenceVersion_lineage_guard',
  'AnalyticalBasisReferenceVersion_immutability_guard',
  'Analytical Basis reference Version cannot reference itself',
  'OutputSemanticPeriodPin_exact_role_key',
  'OutputSemanticPeriodPin_role_ordinal_key',
  'OutputSemanticBasisPin_exact_role_key',
  'OutputSemanticBasisPin_role_ordinal_key',
  'Reporting Period Version pins require a formal exact Version',
  'Analytical Basis Version pins require a formal exact Version',
  'OutputSemanticCompositionPeriodPin_immutability_guard',
  'OutputSemanticCompositionBasisPin_immutability_guard',
]) assert.ok(migration.includes(required), `Missing F3A-2 invariant: ${required}`);

for (const forbidden of [
  /^\s*INSERT\b/im,
  /^\s*UPDATE\b/im,
  /^\s*DELETE\b/im,
  /^\s*TRUNCATE\b/im,
  /^\s*DROP\b/im,
  /ALTER TABLE "(?:OutputSemanticCompositionSnapshot|OutputVersion|OutputEvidenceSnapshot|OutputDependency|BaselineReference|BaselineReferenceVersion|ClientCaseScenario|ClientCaseScenarioVersion)"/,
]) assert.doesNotMatch(migration, forbidden, `F3A-2 migration contains forbidden operation ${forbidden}.`);

const headSchema = execFileSync('git', ['show', 'HEAD:prisma/schema.prisma'], { encoding: 'utf8' });
for (const unchangedModel of [
  'OutputSemanticCompositionMethodVersionPin',
  'OutputSemanticCompositionResultVersionPin',
  'BaselineReference',
  'BaselineReferenceVersion',
]) {
  assert.equal(modelBlock(schema, unchangedModel), modelBlock(headSchema, unchangedModel), `${unchangedModel} changed.`);
}

const stripNewReverseRelations = (block: string): string => block
  .split('\n')
  .filter((line) => !line.includes('reportingPeriodVersionPins') && !line.includes('analyticalBasisVersionPins'))
  .join('\n');
assert.equal(
  stripNewReverseRelations(modelBlock(schema, 'OutputSemanticCompositionSnapshot')),
  modelBlock(headSchema, 'OutputSemanticCompositionSnapshot'),
  'F1 snapshot changed beyond additive reverse relations.',
);

const boundedSurface = [periodReference, periodVersion, basisReference, basisVersion, periodPin, basisPin, migration, helper].join('\n');
for (const forbiddenSemantic of [
  /compatibility(?:Status|Score|Result|Method|Boolean)/i,
  /normalization(?:Engine|Method|Rule)/i,
  /conversion(?:Engine|Method|Rule)/i,
  /materiality/i,
  /qualification/i,
  /currentness/i,
  /ScenarioVersion/i,
  /currentVersionId/i,
  /ProductResultRole/i,
  /OutputEvidenceSnapshot/i,
  /OutputDependency/i,
  /\b(?:monthly|quarterly|annual|rolling|calendar|market-day)\b/i,
]) assert.doesNotMatch(boundedSurface, forbiddenSemantic, `F3A-2 crossed a held semantic boundary: ${forbiddenSemantic}.`);

const formalExact = Object.freeze({
  referenceVersionId: 'test-only-period-version-id',
  versionRef: 'test-only-period-version-v1',
  formalizedAt: '2026-10-03T00:00:00.000Z',
});
assert.deepEqual(validateExactReferenceVersionPin(formalExact), {
  valid: true,
  exactReferenceVersion: formalExact,
});
assert.deepEqual(validateExactReferenceVersionPin({ ...formalExact, versionRef: 'latest' }), {
  valid: false,
  reason: 'LATEST_OR_CURRENT_VERSION_FORBIDDEN',
});
assert.deepEqual(validateExactReferenceVersionPin({ ...formalExact, referenceVersionId: ' test-only-id' }), {
  valid: false,
  reason: 'INVALID_EXACT_REFERENCE_VERSION',
});
assert.deepEqual(validateExactReferenceVersionPin({ ...formalExact, formalizedAt: null }), {
  valid: false,
  reason: 'VERSION_NOT_FORMAL',
});
assert.deepEqual(validateExactReferenceVersionPin({ ...formalExact, formalizedAt: 'not-a-timestamp' }), {
  valid: false,
  reason: 'VERSION_NOT_FORMAL',
});

const trackedDiff = execFileSync('git', ['diff', '--name-only', 'HEAD'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const untracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const changed = [...new Set([...trackedDiff, ...untracked])].sort();
const allowed = [schemaPath, migrationPath, helperPath, certifierPath].sort();
assert.deepEqual(changed, allowed, 'F3A-2 changed files outside the bounded implementation scope.');

const schemaNumstat = execFileSync('git', ['diff', '--numstat', 'HEAD', '--', schemaPath], { encoding: 'utf8' }).trim();
assert.match(schemaNumstat, /^\d+\s+0\s+prisma\/schema\.prisma$/, 'F3A-2 schema change must be additive only.');

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

console.log('[reporting-period-analytical-basis-reference-foundation] ok: exact immutable references, formal F1 pins, no defaults, no normalization or compatibility, empty additive foundation, and protected boundaries passed.');
