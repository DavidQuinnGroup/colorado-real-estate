import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import {
  validateCurrentnessPinConfiguration,
  validateCurrentnessPolicyPin,
  validateCurrentnessProjectionPin,
} from '../lib/outputSemanticCompositionCurrentnessPinValidation';

const certifiedParent = '7586ac6e53dedbdd384721ce7a2de7f211ac8813';
const schemaPath = 'prisma/schema.prisma';
const migrationPath = 'prisma/migrations/20261004120000_add_f1_formalization_time_currentness_context_pins_v1/migration.sql';
const helperPath = 'lib/outputSemanticCompositionCurrentnessPinValidation.ts';
const certifierPath = 'scripts/checkOutputSemanticCompositionCurrentnessPins.ts';
const priorMigrationHashes = {
  'prisma/migrations/20261003210000_add_method_result_registry_persistence_foundation/migration.sql': '6c28594b434519e937dcbe3fd819d82e3250448ac976275198596f7766c2f3d0',
  'prisma/migrations/20261003230000_add_method_result_version_lineage_v1/migration.sql': '7c386907227ac00adc37a50a382c53c263589c8164202c712371b18fcb8878ab',
  'prisma/migrations/20261003235000_add_method_result_legacy_alias_adapter_v1/migration.sql': 'fd3998b9ba00d92dc3aca2bda01bfd2691c25b979d72dea369b0022271583fcf',
  'prisma/migrations/20261004000000_add_shared_primitive_contract_reference_controls_v1/migration.sql': 'f5be91c11e539101ce05cad0b950893aa7ad3a3da3849e934bd3337b2417c24b',
  'prisma/migrations/20261004010000_add_product_result_role_binding_controls_v1/migration.sql': 'a2bbf7fa201afbc1f72b2115bcee69c11442cb6f2757b3a17c6c54c1e5026013',
  'prisma/migrations/20261004020000_add_semantic_composition_snapshot_pins_v1/migration.sql': '48b9538f3cbceab64b0b59d4b199626729dff78a4dac5988d3f70c871130bd53',
  'prisma/migrations/20261004030000_add_typed_baseline_reference_envelope_v1/migration.sql': '3afd6b85241e6b217673a4a408d6b74c64110d4645478c83ff58fe23588db543',
  'prisma/migrations/20261004040000_add_reporting_period_analytical_basis_reference_foundation_v1/migration.sql': 'f1b127fb8c4f4f05a7b5265e43128c788d161fcf2ad1d077163352f060cdd53c',
  'prisma/migrations/20261004050000_add_period_basis_compatibility_result_context_v1/migration.sql': '42528fa26ad13564e371d92781fb39502d2a188de71e8f9e136ccdbe098986cb',
  'prisma/migrations/20261004060000_add_qualification_definition_typed_application_foundation_v1/migration.sql': '66becd1d8c3337b5093a1e166cf67db03123bce963b5a576292d0875f48f61f3',
  'prisma/migrations/20261004070000_add_qualification_clearance_replacement_lineage_v1/migration.sql': '589ad5ebfad5d14c5af46769ab504167211af640a7b4ce5bcb1175a06a8eec83',
  'prisma/migrations/20261004080000_add_qualification_snapshot_compatibility_links_v1/migration.sql': '321a6b3f7de5961db99610deb401473896b5793eaf51aeda50c158254f43ad0e',
  'prisma/migrations/20261004090000_add_immutable_currentness_event_history_foundation_v1/migration.sql': '36b6274d390f53c25718915452a2c1714d1afb5a36e86d3b38527205efcc0171',
  'prisma/migrations/20261004100000_add_currentness_policy_reference_version_foundation_v1/migration.sql': '56d431b799313a652987cd7d02b54d325788ebb5ea1c1f121fdf9d473655562d',
  'prisma/migrations/20261004110000_add_currentness_projection_envelope_foundation_v1/migration.sql': '110dc7dccf4a86ad14602f0065e2290744e572581accb6127ccfd5b7d0b36d19',
} as const;

const schema = readFileSync(schemaPath, 'utf8');
const migration = readFileSync(migrationPath, 'utf8');
const helper = readFileSync(helperPath, 'utf8');
const modelBlock = (source: string, name: string): string =>
  source.match(new RegExp(`model ${name} \\{[\\s\\S]*?\\n\\}`))?.[0] ?? '';

assert.equal(execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), certifiedParent);
for (const [path, expectedHash] of Object.entries(priorMigrationHashes)) {
  assert.equal(createHash('sha256').update(readFileSync(path)).digest('hex'), expectedHash, `${path} bytes changed.`);
}

const policyPin = modelBlock(schema, 'OutputSemanticCompositionCurrentnessPolicyPin');
const projectionPin = modelBlock(schema, 'OutputSemanticCompositionCurrentnessProjectionPin');
for (const [model, targetField, targetModel] of [
  [policyPin, 'policyVersionId', 'CurrentnessPolicyVersion'],
  [projectionPin, 'projectionVersionId', 'CurrentnessProjectionVersion'],
] as const) {
  assert.notEqual(model, '');
  for (const required of [
    /snapshotId\s+String/,
    new RegExp(`${targetField}\\s+String`),
    /roleRef\s+String/,
    /ordinal\s+Int/,
    /provenance\s+Json/,
    /integrityFingerprint\s+String\s+@unique/,
    /createdAt\s+DateTime\s+@default\(now\(\)\)/,
    /immutableAt\s+DateTime\s+@default\(now\(\)\)/,
    /OutputSemanticCompositionSnapshot/,
    new RegExp(targetModel),
    /onDelete: Restrict/,
  ]) assert.match(model, required);
}
assert.match(policyPin, /@@unique\(\[snapshotId, policyVersionId, roleRef\]/);
assert.match(policyPin, /@@unique\(\[snapshotId, roleRef, ordinal\]/);
assert.match(projectionPin, /@@unique\(\[snapshotId, projectionVersionId, roleRef\]/);
assert.match(projectionPin, /@@unique\(\[snapshotId, roleRef, ordinal\]/);

assert.deepEqual(
  [...migration.matchAll(/CREATE TABLE "([^"]+)"/g)].map((match) => match[1]),
  [
    'OutputSemanticCompositionCurrentnessPolicyPin',
    'OutputSemanticCompositionCurrentnessProjectionPin',
  ],
);
assert.doesNotMatch(migration, /CREATE TYPE|ALTER TYPE|DROP TABLE|TRUNCATE/i);
for (const forbiddenOperation of [
  /^\s*INSERT\s+INTO\b/im,
  /^\s*UPDATE\s+"[^\"]+"\s+SET\b/im,
  /^\s*DELETE\s+FROM\b/im,
]) assert.doesNotMatch(migration, forbiddenOperation);

for (const required of [
  'OutputSemanticCurrentnessPolicyPin_snapshot_fkey',
  'OutputSemanticCurrentnessPolicyPin_policyVersion_fkey',
  'OutputSemanticCurrentnessProjectionPin_snapshot_fkey',
  'OutputSemanticCurrentnessProjectionPin_projectionVersion_fkey',
  'ON DELETE RESTRICT',
  'Currentness Policy pin requires an exact formal admitted Policy Version',
  'Currentness Projection pin requires an exact formal admitted Projection Version',
  'Aligned Currentness Policy and Projection pins must use the same exact Policy Version',
  'Output semantic composition cannot formalize with policy-inconsistent Currentness pins',
  'Currentness Projection pin cannot circularly reference the same Output semantic composition snapshot',
  'FOR UPDATE',
  'CREATE OR REPLACE FUNCTION "guardOutputSemanticCompositionSnapshotImmutability"',
]) assert.ok(migration.includes(required), `Missing F3C-4A invariant: ${required}`);
assert.equal((migration.match(/FOR UPDATE/g) ?? []).length, 2);
assert.equal((migration.match(/lifecycleState"::TEXT/g) ?? []).length, 2);
assert.ok((migration.match(/ADMITTED_WITH_QUALIFICATIONS/g) ?? []).length >= 2);
assert.ok((migration.match(/lower\("[^"]+"\) NOT IN \('latest', 'current'\)/g) ?? []).length >= 6);
assert.ok((migration.match(/OutputSemanticCurrentnessPolicyPin_(?:exact_role|role_ordinal)_key/g) ?? []).length >= 2);
assert.ok((migration.match(/OutputSemanticCurrentnessProjectionPin_(?:exact_role|role_ordinal)_key/g) ?? []).length >= 2);

const boundedSources = `${policyPin}\n${projectionPin}\n${migration}\n${helper}`;
for (const forbiddenSemantic of [
  /QualificationApplication/,
  /QualificationClearance/,
  /blocksFormalization/,
  /blocksDelivery/,
  /OutputReview/,
  /OutputInvalidationState/,
  /freshness(?:Duration|Threshold|Score)/i,
  /recencyScore|ageScore|materiality/i,
  /ScenarioVersion|ClientCaseScenario/,
  /latestProjectionId|currentVersionId/,
]) assert.doesNotMatch(boundedSources, forbiddenSemantic, `F3C-4A crossed a held boundary: ${forbiddenSemantic}.`);
assert.doesNotMatch(migration, /ORDER BY[\s\S]*LIMIT\s+1/i);

const validPolicyPin = Object.freeze({
  snapshotId: 'test-only-snapshot',
  policyVersionId: 'test-only-policy-version',
  roleRef: 'test-only-currentness-context',
  ordinal: 0,
  provenance: Object.freeze({ testOnly: true }),
  integrityFingerprint: 'test-only-policy-pin-fingerprint',
});
const validProjectionPin = Object.freeze({
  snapshotId: 'test-only-snapshot',
  projectionVersionId: 'test-only-projection-version',
  roleRef: 'test-only-currentness-context',
  ordinal: 0,
  provenance: Object.freeze({ testOnly: true }),
  integrityFingerprint: 'test-only-projection-pin-fingerprint',
});
const matchingProjectionPolicy = Object.freeze({
  projectionVersionId: validProjectionPin.projectionVersionId,
  policyVersionId: validPolicyPin.policyVersionId,
});

assert.deepEqual(validateCurrentnessPolicyPin(validPolicyPin), { valid: true, failure: null });
assert.deepEqual(validateCurrentnessProjectionPin(validProjectionPin), { valid: true, failure: null });
assert.deepEqual(validateCurrentnessPinConfiguration([], [], []), { valid: true, failure: null });
assert.deepEqual(validateCurrentnessPinConfiguration([validPolicyPin], [], []), { valid: true, failure: null });
assert.deepEqual(validateCurrentnessPinConfiguration([], [validProjectionPin], []), { valid: true, failure: null });
assert.deepEqual(
  validateCurrentnessPinConfiguration([validPolicyPin], [validProjectionPin], [matchingProjectionPolicy]),
  { valid: true, failure: null },
);
assert.equal(validateCurrentnessPolicyPin({ ...validPolicyPin, snapshotId: 'latest' }).failure, 'SNAPSHOT_ID_REQUIRED');
assert.equal(validateCurrentnessPolicyPin({ ...validPolicyPin, policyVersionId: 'current' }).failure, 'POLICY_VERSION_ID_REQUIRED');
assert.equal(validateCurrentnessProjectionPin({ ...validProjectionPin, projectionVersionId: '' }).failure, 'PROJECTION_VERSION_ID_REQUIRED');
assert.equal(validateCurrentnessProjectionPin({ ...validProjectionPin, roleRef: ' role ' }).failure, 'ROLE_REQUIRED');
assert.equal(validateCurrentnessPolicyPin({ ...validPolicyPin, ordinal: -1 }).failure, 'ORDINAL_INVALID');
assert.equal(validateCurrentnessPolicyPin({ ...validPolicyPin, provenance: {} }).failure, 'PROVENANCE_REQUIRED');
assert.equal(validateCurrentnessProjectionPin({ ...validProjectionPin, integrityFingerprint: ' ' }).failure, 'INTEGRITY_FINGERPRINT_REQUIRED');
assert.equal(validateCurrentnessPinConfiguration([
  validPolicyPin,
  { ...validPolicyPin, ordinal: 1, integrityFingerprint: 'test-only-other-policy-fingerprint' },
], [], []).failure, 'DUPLICATE_POLICY_EXACT_ROLE');
assert.equal(validateCurrentnessPinConfiguration([
  validPolicyPin,
  { ...validPolicyPin, policyVersionId: 'test-only-other-policy', integrityFingerprint: 'test-only-other-policy-fingerprint' },
], [], []).failure, 'DUPLICATE_POLICY_SLOT');
assert.equal(validateCurrentnessPinConfiguration([], [
  validProjectionPin,
  { ...validProjectionPin, ordinal: 1, integrityFingerprint: 'test-only-other-projection-fingerprint' },
], []).failure, 'DUPLICATE_PROJECTION_EXACT_ROLE');
assert.equal(validateCurrentnessPinConfiguration([], [
  validProjectionPin,
  { ...validProjectionPin, projectionVersionId: 'test-only-other-projection', integrityFingerprint: 'test-only-other-projection-fingerprint' },
], []).failure, 'DUPLICATE_PROJECTION_SLOT');
assert.equal(
  validateCurrentnessPinConfiguration([validPolicyPin], [validProjectionPin], []).failure,
  'PROJECTION_POLICY_CONTEXT_REQUIRED',
);
assert.equal(validateCurrentnessPinConfiguration(
  [validPolicyPin],
  [validProjectionPin],
  [{ ...matchingProjectionPolicy, policyVersionId: 'test-only-other-policy' }],
).failure, 'ALIGNED_POLICY_MISMATCH');

const headSchema = execFileSync('git', ['show', 'HEAD:prisma/schema.prisma'], { encoding: 'utf8' });
assert.equal(modelBlock(headSchema, 'OutputSemanticCompositionCurrentnessPolicyPin'), '');
assert.equal(modelBlock(headSchema, 'OutputSemanticCompositionCurrentnessProjectionPin'), '');
const normalizeAddedRelations = (source: string, name: string): string => modelBlock(source, name)
  .split('\n')
  .filter((line) => !line.includes('currentnessPolicyVersionPins'))
  .filter((line) => !line.includes('currentnessProjectionVersionPins'))
  .filter((line) => !line.includes('semanticCompositionPins'))
  .map((line) => line.trim().replace(/\s+/g, ' '))
  .join('\n');
for (const changedRelationModel of [
  'OutputSemanticCompositionSnapshot',
  'CurrentnessPolicyVersion',
  'CurrentnessProjectionVersion',
]) assert.equal(normalizeAddedRelations(schema, changedRelationModel), normalizeAddedRelations(headSchema, changedRelationModel));

const trackedDiff = execFileSync('git', ['diff', '--name-only', 'HEAD'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const untracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const changed = [...new Set([...trackedDiff, ...untracked])].sort();
const allowed = [schemaPath, migrationPath, helperPath, certifierPath].sort();
assert.deepEqual(changed, allowed, 'F3C-4A changed files outside the bounded implementation scope.');
const staged = execFileSync('git', ['diff', '--cached', '--name-only'], { encoding: 'utf8' }).trim();
assert.equal(staged, '', 'F3C-4A must remain unstaged and uncommitted.');

const schemaNumstat = execFileSync('git', ['diff', '--numstat', 'HEAD', '--', schemaPath], { encoding: 'utf8' }).trim();
assert.match(schemaNumstat, /^\d+\s+0\s+prisma\/schema\.prisma$/, 'F3C-4A schema change must be additive only.');
const forbiddenPaths = [
  'app/',
  'components/',
  'middleware.ts',
  'package.json',
  'package-lock.json',
  'lib/outputPersistenceFoundation.ts',
  'lib/clientCaseScenario',
  'lib/admin/',
];
assert.equal(changed.some((path) => forbiddenPaths.some((prefix) => path.startsWith(prefix))), false);
execFileSync('git', ['diff', '--check'], { stdio: 'pipe' });

console.log('[output-semantic-currentness-pins] ok: exact admitted targets, serialized same-policy alignment, formalization closure, historical immutability, empty state, and held boundaries passed.');
