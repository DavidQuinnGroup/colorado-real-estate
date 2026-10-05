import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { validateQualificationApplication } from '../lib/qualificationApplicationValidation';

const schemaPath = 'prisma/schema.prisma';
const migrationPath = 'prisma/migrations/20261004060000_add_qualification_definition_typed_application_foundation_v1/migration.sql';
const helperPath = 'lib/qualificationApplicationValidation.ts';
const certifierPath = 'scripts/checkQualificationDefinitionTypedApplicationFoundation.ts';
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
} as const;

const schema = readFileSync(schemaPath, 'utf8');
const migration = readFileSync(migrationPath, 'utf8');
const helper = readFileSync(helperPath, 'utf8');

for (const [path, expectedHash] of Object.entries(priorMigrationHashes)) {
  assert.equal(createHash('sha256').update(readFileSync(path)).digest('hex'), expectedHash, `${path} bytes changed.`);
}

const modelBlock = (source: string, name: string): string =>
  source.match(new RegExp(`model ${name} \\{[\\s\\S]*?\\n\\}`))?.[0] ?? '';

const definition = modelBlock(schema, 'QualificationDefinition');
const definitionVersion = modelBlock(schema, 'QualificationDefinitionVersion');
const application = modelBlock(schema, 'QualificationApplication');
const applicationVersion = modelBlock(schema, 'QualificationApplicationVersion');

for (const [block, required] of [
  [definition, [/definitionKey\s+String\s+@unique/, /authorityRef\s+String/, /versions\s+QualificationDefinitionVersion\[\]/]],
  [definitionVersion, [/qualificationDefinitionId\s+String/, /governedCodeRef\s+String/, /formalizedAt\s+DateTime\?/, /admittedAt\s+DateTime\?/, /supersedesDefinitionVersionId\s+String\?\s+@unique/, /correctionOfDefinitionVersionId\s+String\?\s+@unique/]],
  [application, [/applicationKey\s+String\s+@unique/, /qualificationDefinitionId\s+String/, /versions\s+QualificationApplicationVersion\[\]/]],
  [applicationVersion, [/qualificationApplicationId\s+String/, /qualificationDefinitionVersionId\s+String/, /scope\s+QualificationApplicationScope/, /formalizedAt\s+DateTime\?/, /admittedAt\s+DateTime\?/, /supersedesApplicationVersionId\s+String\?\s+@unique/, /correctionOfApplicationVersionId\s+String\?\s+@unique/]],
] as const) for (const pattern of required) assert.match(block, pattern);

for (const field of ['blocksFormalization', 'blocksDelivery', 'requiresReview', 'requiresDisplay', 'informationalOnly']) {
  assert.match(definitionVersion, new RegExp(`${field}\\s+Boolean\\?`));
  assert.match(applicationVersion, new RegExp(`${field}\\s+Boolean\\?`));
  assert.doesNotMatch(definitionVersion, new RegExp(`${field}[^\\n]*@default`));
  assert.doesNotMatch(applicationVersion, new RegExp(`${field}[^\\n]*@default`));
}

const subjectModels = [
  ['QualificationResultVersionSubject', 'resultVersionId', 'CanonicalResultVersion'],
  ['QualificationMethodVersionSubject', 'methodVersionId', 'CanonicalMethodVersion'],
  ['QualificationBaselineVersionSubject', 'baselineReferenceVersionId', 'BaselineReferenceVersion'],
  ['QualificationReportingPeriodVersionSubject', 'reportingPeriodReferenceVersionId', 'ReportingPeriodReferenceVersion'],
  ['QualificationAnalyticalBasisVersionSubject', 'analyticalBasisReferenceVersionId', 'AnalyticalBasisReferenceVersion'],
  ['QualificationCompatibilityContextSubject', 'compatibilityContextId', 'OutputSemanticCompositionCompatibilityContext'],
  ['QualificationOutputSnapshotSubject', 'snapshotId', 'OutputSemanticCompositionSnapshot'],
  ['QualificationProductDefinitionSubject', 'productDefinitionReferenceId', 'ProductDefinitionReference'],
  ['QualificationOutputEvidenceSubject', 'outputEvidenceSnapshotId', 'OutputEvidenceSnapshot'],
  ['QualificationEvidenceAdmissionSubject', 'evidenceAdmissionId', 'EvidenceAdmission'],
] as const;

for (const [model, targetField, targetModel] of subjectModels) {
  const block = modelBlock(schema, model);
  assert.match(block, /applicationVersionId\s+String\s+@unique/);
  assert.match(block, new RegExp(`${targetField}\\s+String`));
  assert.ok(block.includes(targetModel));
  assert.match(block, /onDelete: Restrict/);
  assert.ok(migration.includes(`CREATE TABLE "${model}"`));
  assert.ok(migration.includes(`CREATE TRIGGER "${model}_guard"`));
}

for (const required of [
  'qualificationApplicationSubjectCount',
  'Formal or admitted Qualification Application Version requires exactly one typed subject',
  'Qualification Application Version accepts exactly one typed subject',
  'Qualification typed subject does not match Application Version scope',
  'Qualification Application Version requires an exact Definition Version from its Definition',
  'Qualification Definition Version semantic content is immutable',
  'Qualification Application Version semantic content is immutable',
  'Qualification typed subject bindings are immutable',
  'Qualification Definition Version cannot reference itself',
  'Qualification Application Version cannot reference itself',
  'Qualification Definition Version supersession must remain within one Definition',
  'Qualification Application Version correction must remain within one Application',
]) assert.ok(migration.includes(required), `Missing F3B-1 invariant: ${required}`);

for (const forbidden of [
  /^\s*INSERT\s+INTO\b/im,
  /^\s*UPDATE\s+"/im,
  /^\s*DELETE\s+FROM\b/im,
  /^\s*TRUNCATE\b/im,
  /^\s*DROP\b/im,
  /ALTER TABLE "(?:CanonicalMethodVersion|CanonicalResultVersion|OutputSemanticCompositionSnapshot|OutputSemanticCompositionCompatibilityContext|OutputEvidenceSnapshot|EvidenceAdmission)"/,
]) assert.doesNotMatch(migration, forbidden, `F3B-1 migration contains forbidden operation ${forbidden}.`);

const boundedSources = [definition, definitionVersion, application, applicationVersion, ...subjectModels.map(([name]) => modelBlock(schema, name)), migration, helper].join('\n');
for (const forbiddenSemantic of [
  /blocksComputation/i,
  /severity/i,
  /materiality/i,
  /clear(?:ed|ance|edBy|edAt)/i,
  /stale(?:At|Boolean)?/i,
  /currentness/i,
  /qualificationApplicationVersionPin/i,
  /deliverySubject/i,
  /genericSubject/i,
]) assert.doesNotMatch(boundedSources, forbiddenSemantic, `F3B-1 crossed a held semantic boundary: ${forbiddenSemantic}.`);

const noEffect = Object.freeze({
  effectAuthorityRef: null,
  blocksFormalization: null,
  blocksDelivery: null,
  requiresReview: null,
  requiresDisplay: null,
  informationalOnly: null,
});
const valid = Object.freeze({
  definitionVersionId: 'test-only-definition-version',
  scope: 'RESULT' as const,
  subjects: Object.freeze([{ kind: 'RESULT_VERSION' as const, id: 'test-only-result-version' }]),
  effects: noEffect,
});
assert.deepEqual(validateQualificationApplication(valid), { valid: true, failure: null });
assert.equal(validateQualificationApplication({ ...valid, subjects: [] }).failure, 'EXACTLY_ONE_SUBJECT_REQUIRED');
assert.equal(validateQualificationApplication({ ...valid, subjects: [...valid.subjects, ...valid.subjects] }).failure, 'EXACTLY_ONE_SUBJECT_REQUIRED');
assert.equal(validateQualificationApplication({ ...valid, subjects: [{ kind: 'METHOD_VERSION', id: 'test-only-method-version' }] }).failure, 'SUBJECT_SCOPE_MISMATCH');
assert.equal(validateQualificationApplication({ ...valid, subjects: [{ kind: 'RESULT_VERSION', id: 'latest' }] }).failure, 'LATEST_OR_CURRENT_REFERENCE_FORBIDDEN');
assert.equal(validateQualificationApplication({ ...valid, definitionVersionId: ' test-only-definition-version' }).failure, 'DEFINITION_VERSION_REQUIRED');
assert.equal(validateQualificationApplication({ ...valid, subjects: [{ kind: 'RESULT_VERSION', id: 'test-only-result-version ' }] }).failure, 'LATEST_OR_CURRENT_REFERENCE_FORBIDDEN');
assert.equal(validateQualificationApplication({ ...valid, effects: { ...noEffect, requiresReview: true } }).failure, 'EFFECT_AUTHORITY_REQUIRED');
assert.equal(validateQualificationApplication({ ...valid, effects: { ...noEffect, effectAuthorityRef: ' test-only-authority', requiresReview: true } }).failure, 'EFFECT_AUTHORITY_REQUIRED');
assert.deepEqual(validateQualificationApplication({
  ...valid,
  effects: { ...noEffect, effectAuthorityRef: 'test-only-authority', requiresReview: true, blocksDelivery: false },
}), { valid: true, failure: null });

const headSchema = execFileSync('git', ['show', 'HEAD:prisma/schema.prisma'], { encoding: 'utf8' });
const normalizedExistingModel = (source: string, name: string): string => modelBlock(source, name)
  .split('\n')
  .filter((line) => !line.includes('qualificationSubjects'))
  .map((line) => line.trim().replace(/\s+/g, ' '))
  .join('\n');
for (const model of [
  'CanonicalMethodVersion',
  'CanonicalResultVersion',
  'BaselineReferenceVersion',
  'ReportingPeriodReferenceVersion',
  'AnalyticalBasisReferenceVersion',
  'OutputSemanticCompositionSnapshot',
  'OutputSemanticCompositionCompatibilityContext',
  'ProductDefinitionReference',
  'OutputEvidenceSnapshot',
  'EvidenceAdmission',
]) assert.equal(normalizedExistingModel(schema, model), normalizedExistingModel(headSchema, model), `${model} changed beyond its additive reverse relation.`);

for (const unchangedModel of ['OutputReview', 'OutputDecision', 'OutputCheckpoint', 'ClientFinancialQualification']) {
  assert.equal(modelBlock(schema, unchangedModel), modelBlock(headSchema, unchangedModel), `${unchangedModel} changed.`);
}

const trackedDiff = execFileSync('git', ['diff', '--name-only', 'HEAD'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const untracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const changed = [...new Set([...trackedDiff, ...untracked])].sort();
const allowed = [schemaPath, migrationPath, helperPath, certifierPath].sort();
assert.deepEqual(changed, allowed, 'F3B-1 changed files outside the bounded implementation scope.');

const schemaNumstat = execFileSync('git', ['diff', '--numstat', 'HEAD', '--', schemaPath], { encoding: 'utf8' }).trim();
assert.match(schemaNumstat, /^\d+\s+\d+\s+prisma\/schema\.prisma$/, 'Missing bounded F3B-1 schema change.');
const [added, removed] = schemaNumstat.split(/\s+/).map(Number);
assert.ok(added > 0 && removed <= 1, 'F3B-1 schema change must remain additive apart from relation-line formatting.');

const forbiddenPaths = ['app/', 'components/', 'middleware.ts', 'package.json', 'lib/outputPersistenceFoundation.ts', 'lib/clientCaseScenario', 'lib/admin/'];
assert.equal(changed.some((path) => forbiddenPaths.some((prefix) => path.startsWith(prefix))), false);

console.log('[qualification-definition-typed-application] ok: empty versioned qualification foundation, ten strong typed subjects, exact-one enforcement, explicit effects, and protected boundaries passed.');
