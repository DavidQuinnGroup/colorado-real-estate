import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import {
  hasCurrentnessPolicyVersionLineageCycle,
  validateCurrentnessPolicyReference,
  validateCurrentnessPolicyVersion,
} from '../lib/currentnessPolicyReferenceValidation';

const schemaPath = 'prisma/schema.prisma';
const migrationPath = 'prisma/migrations/20261004100000_add_currentness_policy_reference_version_foundation_v1/migration.sql';
const helperPath = 'lib/currentnessPolicyReferenceValidation.ts';
const certifierPath = 'scripts/checkCurrentnessPolicyReferenceVersionFoundation.ts';
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
} as const;

const schema = readFileSync(schemaPath, 'utf8');
const migration = readFileSync(migrationPath, 'utf8');
const helper = readFileSync(helperPath, 'utf8');
const modelBlock = (source: string, name: string): string =>
  source.match(new RegExp(`model ${name} \\{[\\s\\S]*?\\n\\}`))?.[0] ?? '';

for (const [path, expectedHash] of Object.entries(priorMigrationHashes)) {
  assert.equal(createHash('sha256').update(readFileSync(path)).digest('hex'), expectedHash, `${path} bytes changed.`);
}

const policyReference = modelBlock(schema, 'CurrentnessPolicyReference');
const policyVersion = modelBlock(schema, 'CurrentnessPolicyVersion');
assert.notEqual(policyReference, '');
assert.notEqual(policyVersion, '');

for (const pattern of [
  /policyKey\s+String\s+@unique/,
  /authorityRef\s+String/,
  /productDefinitionReferenceId\s+String\?/,
  /productDefinitionReference\s+ProductDefinitionReference\?/,
  /provenance\s+Json/,
  /integrityFingerprint\s+String\s+@unique/,
  /versions\s+CurrentnessPolicyVersion\[\]/,
]) assert.match(policyReference, pattern);

for (const pattern of [
  /policyReferenceId\s+String/,
  /versionKey\s+String/,
  /lifecycleState\s+MethodResultRegistryLifecycleState/,
  /authorityRef\s+String/,
  /methodVersionId\s+String\?/,
  /methodVersion\s+CanonicalMethodVersion\?/,
  /formalizedAt\s+DateTime\?/,
  /admittedAt\s+DateTime\?/,
  /supersedesPolicyVersionId\s+String\?\s+@unique/,
  /correctionOfPolicyVersionId\s+String\?\s+@unique/,
]) assert.match(policyVersion, pattern);

assert.deepEqual(
  [...migration.matchAll(/CREATE TABLE "([^"]+)"/g)].map((match) => match[1]),
  ['CurrentnessPolicyReference', 'CurrentnessPolicyVersion'],
);
assert.doesNotMatch(migration, /CREATE TYPE/);

for (const required of [
  'CurrentnessPolicyReference_productDefinition_fkey',
  'CurrentnessPolicyVersion_methodVersion_fkey',
  'Currentness Policy Version supersession must remain within one Policy Reference',
  'Currentness Policy Version correction must remain within one Policy Reference',
  'Currentness Policy Version lineage cannot contain a cycle',
  'rejectCurrentnessPolicyMutation',
  'ON DELETE RESTRICT',
  'ADMITTED_WITH_QUALIFICATIONS',
]) assert.ok(migration.includes(required), `Missing F3C-2 invariant: ${required}`);

for (const forbiddenOperation of [
  /^\s*INSERT\s+INTO\b/im,
  /^\s*UPDATE\s+"/im,
  /^\s*DELETE\s+FROM\b/im,
  /^\s*TRUNCATE\b/im,
  /^\s*DROP\b/im,
]) assert.doesNotMatch(migration, forbiddenOperation);

const boundedSources = [policyReference, policyVersion, migration, helper].join('\n');
for (const forbiddenSemantic of [
  /CurrentnessProjection/,
  /CurrentnessEvent/,
  /ScenarioVersion/,
  /ClientCaseScenario/,
  /QualificationApplication/,
  /OutputDependency/,
  /OutputInvalidationState/,
  /freshnessRefs/,
  /staleAt/i,
  /freshnessDuration/i,
  /\bthreshold/i,
  /\bmateriality\b/i,
  /\brecencyScore\b/i,
  /\bageScore\b/i,
  /eventToState/i,
  /stateVocabulary/i,
  /\bnormalization\b/i,
  /\bconversion\b/i,
  /automaticInvalidation/i,
]) assert.doesNotMatch(boundedSources, forbiddenSemantic, `F3C-2 crossed a held boundary: ${forbiddenSemantic}.`);

assert.deepEqual(validateCurrentnessPolicyReference({
  policyKey: 'test-only-policy',
  authorityRef: 'test-only-authority',
  productDefinitionReferenceId: 'test-only-product-definition',
}), { valid: true, failure: null });
assert.equal(validateCurrentnessPolicyReference({
  policyKey: 'test-only-policy',
  authorityRef: 'test-only-authority',
  productDefinitionReferenceId: 'latest',
}).failure, 'PRODUCT_DEFINITION_REFERENCE_INVALID');

const validVersion = Object.freeze({
  policyVersionId: 'test-only-policy-version',
  policyReferenceId: 'test-only-policy-reference',
  versionKey: 'test-only-v1',
  lifecycleState: 'ADMITTED',
  authorityRef: 'test-only-authority',
  methodVersionId: 'test-only-method-version',
  formalizedAt: '2026-10-04T00:00:00.000Z',
  admittedAt: '2026-10-04T00:00:00.000Z',
  lineage: Object.freeze({ supersedesPolicyVersionId: null, correctionOfPolicyVersionId: null }),
});
assert.deepEqual(validateCurrentnessPolicyVersion(validVersion), { valid: true, failure: null });
assert.equal(validateCurrentnessPolicyVersion({ ...validVersion, methodVersionId: 'current' }).failure, 'METHOD_VERSION_REFERENCE_INVALID');
assert.equal(validateCurrentnessPolicyVersion({ ...validVersion, formalizedAt: null }).failure, 'ADMITTED_VERSION_REQUIRES_FORMALIZATION');
assert.equal(validateCurrentnessPolicyVersion({ ...validVersion, admittedAt: null }).failure, 'ADMITTED_VERSION_REQUIRES_ADMISSION');
assert.equal(validateCurrentnessPolicyVersion({
  ...validVersion,
  lineage: { supersedesPolicyVersionId: validVersion.policyVersionId, correctionOfPolicyVersionId: null },
}).failure, 'LINEAGE_SELF_REFERENCE');
assert.equal(validateCurrentnessPolicyVersion({
  ...validVersion,
  lineage: { supersedesPolicyVersionId: 'test-only-prior', correctionOfPolicyVersionId: 'test-only-corrected' },
}).failure, 'LINEAGE_ROLE_CONFLICT');

assert.equal(hasCurrentnessPolicyVersionLineageCycle([
  { id: 'test-only-a', supersedesPolicyVersionId: 'test-only-b', correctionOfPolicyVersionId: null },
  { id: 'test-only-b', supersedesPolicyVersionId: null, correctionOfPolicyVersionId: null },
]), false);
assert.equal(hasCurrentnessPolicyVersionLineageCycle([
  { id: 'test-only-a', supersedesPolicyVersionId: 'test-only-b', correctionOfPolicyVersionId: null },
  { id: 'test-only-b', supersedesPolicyVersionId: null, correctionOfPolicyVersionId: 'test-only-a' },
]), true);

const headSchema = execFileSync('git', ['show', 'HEAD:prisma/schema.prisma'], { encoding: 'utf8' });
const normalizeAddedRelations = (source: string, name: string): string => modelBlock(source, name)
  .split('\n')
  .filter((line) => !line.includes('currentnessPolicyReferences'))
  .filter((line) => !line.includes('currentnessPolicyVersions'))
  .map((line) => line.trim().replace(/\s+/g, ' '))
  .join('\n');
for (const changedRelationModel of ['ProductDefinitionReference', 'CanonicalMethodVersion']) {
  assert.equal(
    normalizeAddedRelations(schema, changedRelationModel),
    normalizeAddedRelations(headSchema, changedRelationModel),
    `${changedRelationModel} changed beyond additive F3C-2 reverse relations.`,
  );
}

for (const unchangedModel of [
  'CurrentnessEventTypeReference',
  'CurrentnessEventTypeVersion',
  'CurrentnessEvent',
  'CurrentnessEventPrimarySubject',
  'CurrentnessEventDependency',
  'OutputSemanticCompositionSnapshot',
  'QualificationApplicationVersion',
  'ClientCaseScenarioVersion',
]) assert.equal(modelBlock(schema, unchangedModel), modelBlock(headSchema, unchangedModel), `${unchangedModel} changed.`);

const trackedDiff = execFileSync('git', ['diff', '--name-only', 'HEAD'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const untracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const changed = [...new Set([...trackedDiff, ...untracked])].sort();
const allowed = [schemaPath, migrationPath, helperPath, certifierPath].sort();
assert.deepEqual(changed, allowed, 'F3C-2 changed files outside the bounded implementation scope.');

const schemaNumstat = execFileSync('git', ['diff', '--numstat', 'HEAD', '--', schemaPath], { encoding: 'utf8' }).trim();
assert.match(schemaNumstat, /^\d+\s+0\s+prisma\/schema\.prisma$/, 'F3C-2 schema change must be additive only.');
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

console.log('[currentness-policy-reference-version-foundation] ok: immutable policy identity/version, exact optional Product/Method references, lineage guards, empty state, and held semantic boundaries passed.');
