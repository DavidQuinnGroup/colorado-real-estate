import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import {
  hasDuplicateQualificationVersionLink,
  validateQualificationVersionLink,
} from '../lib/qualificationVersionLinkValidation';

const schemaPath = 'prisma/schema.prisma';
const migrationPath = 'prisma/migrations/20261004080000_add_qualification_snapshot_compatibility_links_v1/migration.sql';
const helperPath = 'lib/qualificationVersionLinkValidation.ts';
const certifierPath = 'scripts/checkQualificationSnapshotCompatibilityLinkFoundation.ts';
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
} as const;

const schema = readFileSync(schemaPath, 'utf8');
const migration = readFileSync(migrationPath, 'utf8');
const helper = readFileSync(helperPath, 'utf8');
const modelBlock = (source: string, name: string): string =>
  source.match(new RegExp(`model ${name} \\{[\\s\\S]*?\\n\\}`))?.[0] ?? '';

for (const [path, expectedHash] of Object.entries(priorMigrationHashes)) {
  assert.equal(createHash('sha256').update(readFileSync(path)).digest('hex'), expectedHash, `${path} bytes changed.`);
}

const snapshotPin = modelBlock(schema, 'OutputSemanticCompositionQualificationPin');
const compatibilityLink = modelBlock(schema, 'OutputSemanticCompatibilityQualificationLink');
for (const model of [snapshotPin, compatibilityLink]) {
  for (const required of [
    /qualificationApplicationVersionId\s+String/,
    /roleRef\s+String/,
    /ordinal\s+Int/,
    /provenance\s+Json/,
    /integrityFingerprint\s+String\s+@unique/,
    /QualificationApplicationVersion/,
    /onDelete: Restrict/,
  ]) assert.match(model, required);
}
assert.match(snapshotPin, /snapshotId\s+String/);
assert.match(snapshotPin, /OutputSemanticCompositionSnapshot/);
assert.match(compatibilityLink, /compatibilityContextId\s+String/);
assert.match(compatibilityLink, /OutputSemanticCompositionCompatibilityContext/);

assert.deepEqual(
  [...migration.matchAll(/CREATE TABLE "([^"]+)"/g)].map((match) => match[1]),
  ['OutputSemanticCompositionQualificationPin', 'OutputSemanticCompatibilityQualificationLink'],
);
assert.doesNotMatch(migration, /CREATE TYPE/);
for (const required of [
  'OutputSemanticQualificationPin_snapshot_fkey',
  'OutputSemanticQualificationPin_applicationVersion_fkey',
  'OutputSemanticCompatibilityQualification_context_fkey',
  'OutputSemanticCompatibilityQualification_application_fkey',
  'ON DELETE RESTRICT',
  'requires a formal admitted Application Version',
  'does not accept qualification pins',
  'does not accept qualification links',
  'qualification pins are immutable',
  'qualification links are immutable',
  'cannot circularly link an Application Version targeting the same snapshot',
  'cannot circularly link an Application Version targeting the same context',
]) assert.ok(migration.includes(required), `Missing F3B-3 invariant: ${required}`);

for (const forbiddenOperation of [
  /^\s*INSERT\s+INTO\b/im,
  /^\s*UPDATE\s+"/im,
  /^\s*DELETE\s+FROM\b/im,
  /^\s*TRUNCATE\b/im,
  /^\s*DROP\b/im,
]) assert.doesNotMatch(migration, forbiddenOperation);

const boundedSources = `${snapshotPin}\n${compatibilityLink}\n${migration}\n${helper}`;
for (const forbiddenSemantic of [
  /QualificationClearance/,
  /blocksFormalization/,
  /blocksDelivery/,
  /requiresReview/,
  /requiresDisplay/,
  /informationalOnly/,
  /compatibility(?:Status|Score|Outcome)/i,
  /currentness/i,
  /materiality/i,
  /ScenarioVersion/,
  /Manifest/,
]) assert.doesNotMatch(boundedSources, forbiddenSemantic, `F3B-3 crossed a held boundary: ${forbiddenSemantic}.`);
assert.doesNotMatch(migration, /ORDER BY[\s\S]*LIMIT\s+1/i);

const valid = Object.freeze({
  ownerId: 'test-only-owner',
  qualificationApplicationVersionId: 'test-only-qualification-version',
  roleRef: 'test-only-role',
  ordinal: 0,
  provenance: Object.freeze({ testOnly: true }),
});
assert.deepEqual(validateQualificationVersionLink(valid), { valid: true, failure: null });
assert.equal(validateQualificationVersionLink({ ...valid, ownerId: 'latest' }).failure, 'OWNER_ID_REQUIRED');
assert.equal(validateQualificationVersionLink({ ...valid, qualificationApplicationVersionId: 'current' }).failure, 'APPLICATION_VERSION_REQUIRED');
assert.equal(validateQualificationVersionLink({ ...valid, roleRef: '' }).failure, 'ROLE_REQUIRED');
assert.equal(validateQualificationVersionLink({ ...valid, ordinal: -1 }).failure, 'ORDINAL_INVALID');
assert.equal(validateQualificationVersionLink({ ...valid, provenance: {} }).failure, 'PROVENANCE_REQUIRED');
assert.equal(hasDuplicateQualificationVersionLink([
  valid,
  { ...valid, qualificationApplicationVersionId: 'test-only-other-version', ordinal: 1 },
]), false);
assert.equal(hasDuplicateQualificationVersionLink([valid, { ...valid, ordinal: 1 }]), true);
assert.equal(hasDuplicateQualificationVersionLink([
  valid,
  { ...valid, qualificationApplicationVersionId: 'test-only-other-version' },
]), true);

const headSchema = execFileSync('git', ['show', 'HEAD:prisma/schema.prisma'], { encoding: 'utf8' });
const normalizeAddedRelations = (source: string, name: string): string => modelBlock(source, name)
  .split('\n')
  .filter((line) => !line.includes('qualificationVersionPins'))
  .filter((line) => !line.includes('qualificationVersionLinks'))
  .filter((line) => !line.includes('semanticCompositionPins'))
  .filter((line) => !line.includes('compatibilityContextLinks'))
  .map((line) => line.trim().replace(/\s+/g, ' '))
  .join('\n');
for (const changedRelationModel of [
  'OutputSemanticCompositionSnapshot',
  'OutputSemanticCompositionCompatibilityContext',
  'QualificationApplicationVersion',
]) assert.equal(normalizeAddedRelations(schema, changedRelationModel), normalizeAddedRelations(headSchema, changedRelationModel));
for (const unchangedModel of [
  'QualificationDefinition',
  'QualificationDefinitionVersion',
  'QualificationApplication',
  'QualificationClearance',
  'OutputReview',
]) assert.equal(modelBlock(schema, unchangedModel), modelBlock(headSchema, unchangedModel), `${unchangedModel} changed.`);

const trackedDiff = execFileSync('git', ['diff', '--name-only', 'HEAD'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const untracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const changed = [...new Set([...trackedDiff, ...untracked])].sort();
const allowed = [schemaPath, migrationPath, helperPath, certifierPath].sort();
assert.deepEqual(changed, allowed, 'F3B-3 changed files outside the bounded implementation scope.');

const schemaNumstat = execFileSync('git', ['diff', '--numstat', 'HEAD', '--', schemaPath], { encoding: 'utf8' }).trim();
assert.match(schemaNumstat, /^\d+\s+0\s+prisma\/schema\.prisma$/, 'F3B-3 schema change must be additive only.');
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

console.log('[qualification-snapshot-compatibility-links] ok: exact admitted version links, formalization immutability, empty state, and held policy boundaries passed.');
