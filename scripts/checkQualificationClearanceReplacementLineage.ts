import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import {
  hasQualificationReplacementCycle,
  validateQualificationClearance,
} from '../lib/qualificationClearanceValidation';

const schemaPath = 'prisma/schema.prisma';
const migrationPath = 'prisma/migrations/20261004070000_add_qualification_clearance_replacement_lineage_v1/migration.sql';
const helperPath = 'lib/qualificationClearanceValidation.ts';
const certifierPath = 'scripts/checkQualificationClearanceReplacementLineage.ts';
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
} as const;

const schema = readFileSync(schemaPath, 'utf8');
const migration = readFileSync(migrationPath, 'utf8');
const helper = readFileSync(helperPath, 'utf8');
const modelBlock = (source: string, name: string): string =>
  source.match(new RegExp(`model ${name} \\{[\\s\\S]*?\\n\\}`))?.[0] ?? '';

for (const [path, expectedHash] of Object.entries(priorMigrationHashes)) {
  assert.equal(createHash('sha256').update(readFileSync(path)).digest('hex'), expectedHash, `${path} bytes changed.`);
}

const clearance = modelBlock(schema, 'QualificationClearance');
for (const required of [
  /qualificationApplicationVersionId\s+String/,
  /replacementApplicationVersionId\s+String\?/,
  /actorRef\s+String/,
  /authorityRef\s+String/,
  /reasonRef\s+String/,
  /clearedAt\s+DateTime(?![^\n]*@default)/,
  /effectiveAt\s+DateTime(?![^\n]*@default)/,
  /provenance\s+Json/,
  /integrityFingerprint\s+String\s+@unique/,
  /supersedesClearanceId\s+String\?\s+@unique/,
  /correctionOfClearanceId\s+String\?\s+@unique/,
  /QualificationClearanceTarget/,
  /QualificationClearanceReplacement/,
  /onDelete: Restrict/,
]) assert.match(clearance, required);

for (const forbiddenField of [
  /\bscope\b/i,
  /partial/i,
  /expires/i,
  /severity/i,
  /materiality/i,
  /currentness/i,
  /deliveryAuthority/i,
  /professionalConclusion/i,
]) assert.doesNotMatch(clearance, forbiddenField);

assert.deepEqual([...migration.matchAll(/CREATE TABLE "([^"]+)"/g)].map((match) => match[1]), ['QualificationClearance']);
assert.doesNotMatch(migration, /CREATE TYPE/);
for (const required of [
  'QualificationClearance_applicationVersion_fkey',
  'QualificationClearance_replacementVersion_fkey',
  'QualificationClearance_supersedes_fkey',
  'QualificationClearance_correction_fkey',
  'ON DELETE RESTRICT',
  'Qualification Clearance records are immutable',
  'Qualification Clearance records cannot be deleted',
  'requires an exact existing Application Version target',
  'replacement requires an exact existing Application Version',
  'replacement cannot reference its target Application Version',
  'replacement must remain within one Qualification Application',
  'replacement cycle is not allowed',
  'lineage cannot reference itself',
  'lineage must remain on one exact Application Version target',
  'predecessor already has a successor',
  'correction or supersession cycle is not allowed',
]) assert.ok(migration.includes(required), `Missing F3B-2 invariant: ${required}`);

for (const forbiddenOperation of [
  /^\s*INSERT\s+INTO\b/im,
  /^\s*UPDATE\s+"/im,
  /^\s*DELETE\s+FROM\b/im,
  /^\s*TRUNCATE\b/im,
  /^\s*DROP\b/im,
]) assert.doesNotMatch(migration, forbiddenOperation);

const boundedSources = `${clearance}\n${migration}\n${helper}`;
for (const forbiddenSemantic of [
  /OutputReview/,
  /qualificationApplicationVersionPin/i,
  /qualifiedCompatibility/i,
  /blocksDelivery\s*=/,
  /deliveryAuthority/i,
  /materiality/i,
  /severity/i,
  /currentness/i,
  /stale(?:At|Boolean)?/i,
  /genericSubject/i,
  /latest\s+lookup/i,
]) assert.doesNotMatch(boundedSources, forbiddenSemantic, `F3B-2 crossed a held boundary: ${forbiddenSemantic}.`);

const valid = Object.freeze({
  qualificationApplicationVersionId: 'test-only-application-version-a',
  replacementApplicationVersionId: 'test-only-application-version-b',
  actorRef: 'test-only-actor',
  authorityRef: 'test-only-authority',
  reasonRef: 'test-only-reason',
  clearedAt: '2026-10-03T12:00:00.000Z',
  effectiveAt: '2026-10-03T12:00:00.000Z',
  provenance: Object.freeze({ testOnly: true }),
});
assert.deepEqual(validateQualificationClearance(valid), { valid: true, failure: null });
assert.equal(validateQualificationClearance({ ...valid, qualificationApplicationVersionId: 'latest' }).failure, 'APPLICATION_VERSION_REQUIRED');
assert.equal(validateQualificationClearance({ ...valid, replacementApplicationVersionId: valid.qualificationApplicationVersionId }).failure, 'SELF_REPLACEMENT_FORBIDDEN');
assert.equal(validateQualificationClearance({ ...valid, actorRef: '' }).failure, 'ACTOR_REFERENCE_REQUIRED');
assert.equal(validateQualificationClearance({ ...valid, authorityRef: ' authority' }).failure, 'AUTHORITY_REFERENCE_REQUIRED');
assert.equal(validateQualificationClearance({ ...valid, reasonRef: '' }).failure, 'REASON_REFERENCE_REQUIRED');
assert.equal(validateQualificationClearance({ ...valid, clearedAt: '' }).failure, 'CLEARED_AT_REQUIRED');
assert.equal(validateQualificationClearance({ ...valid, effectiveAt: 'not-a-time' }).failure, 'EFFECTIVE_AT_REQUIRED');
assert.equal(validateQualificationClearance({ ...valid, provenance: {} }).failure, 'PROVENANCE_REQUIRED');
assert.equal(hasQualificationReplacementCycle([
  { qualificationApplicationVersionId: 'test-only-a', replacementApplicationVersionId: 'test-only-b' },
  { qualificationApplicationVersionId: 'test-only-b', replacementApplicationVersionId: 'test-only-c' },
]), false);
assert.equal(hasQualificationReplacementCycle([
  { qualificationApplicationVersionId: 'test-only-a', replacementApplicationVersionId: 'test-only-b' },
  { qualificationApplicationVersionId: 'test-only-b', replacementApplicationVersionId: 'test-only-a' },
]), true);

const headSchema = execFileSync('git', ['show', 'HEAD:prisma/schema.prisma'], { encoding: 'utf8' });
const normalizedApplicationVersion = (source: string): string => modelBlock(source, 'QualificationApplicationVersion')
  .split('\n')
  .filter((line) => !line.includes('clearances') && !line.includes('replacementForClearances'))
  .map((line) => line.trim().replace(/\s+/g, ' '))
  .join('\n');
assert.equal(normalizedApplicationVersion(schema), normalizedApplicationVersion(headSchema));
for (const unchangedModel of [
  'QualificationDefinition',
  'QualificationDefinitionVersion',
  'QualificationApplication',
  'OutputReview',
  'OutputDecision',
  'OutputCheckpoint',
]) assert.equal(modelBlock(schema, unchangedModel), modelBlock(headSchema, unchangedModel), `${unchangedModel} changed.`);

const trackedDiff = execFileSync('git', ['diff', '--name-only', 'HEAD'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const untracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const changed = [...new Set([...trackedDiff, ...untracked])].sort();
const allowed = [schemaPath, migrationPath, helperPath, certifierPath].sort();
assert.deepEqual(changed, allowed, 'F3B-2 changed files outside the bounded implementation scope.');

const schemaNumstat = execFileSync('git', ['diff', '--numstat', 'HEAD', '--', schemaPath], { encoding: 'utf8' }).trim();
assert.match(schemaNumstat, /^\d+\s+0\s+prisma\/schema\.prisma$/, 'F3B-2 schema change must be additive only.');
const forbiddenPaths = ['app/', 'components/', 'middleware.ts', 'package.json', 'lib/outputPersistenceFoundation.ts', 'lib/clientCaseScenario', 'lib/admin/'];
assert.equal(changed.some((path) => forbiddenPaths.some((prefix) => path.startsWith(prefix))), false);

console.log('[qualification-clearance-replacement-lineage] ok: exact-target append-only clearance, replacement and lineage guards, empty state, and held boundaries passed.');
