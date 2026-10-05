import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import {
  CURRENTNESS_EVENT_TARGET_KINDS,
  hasCurrentnessEventLineageCycle,
  validateCurrentnessEvent,
} from '../lib/currentnessEventHistoryValidation';

const schemaPath = 'prisma/schema.prisma';
const migrationPath = 'prisma/migrations/20261004090000_add_immutable_currentness_event_history_foundation_v1/migration.sql';
const helperPath = 'lib/currentnessEventHistoryValidation.ts';
const certifierPath = 'scripts/checkCurrentnessEventHistoryFoundation.ts';
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
} as const;

const schema = readFileSync(schemaPath, 'utf8');
const migration = readFileSync(migrationPath, 'utf8');
const helper = readFileSync(helperPath, 'utf8');
const modelBlock = (source: string, name: string): string =>
  source.match(new RegExp(`model ${name} \\{[\\s\\S]*?\\n\\}`))?.[0] ?? '';

for (const [path, expectedHash] of Object.entries(priorMigrationHashes)) {
  assert.equal(createHash('sha256').update(readFileSync(path)).digest('hex'), expectedHash, `${path} bytes changed.`);
}

const eventTypeReference = modelBlock(schema, 'CurrentnessEventTypeReference');
const eventTypeVersion = modelBlock(schema, 'CurrentnessEventTypeVersion');
const event = modelBlock(schema, 'CurrentnessEvent');
const primarySubject = modelBlock(schema, 'CurrentnessEventPrimarySubject');
const dependency = modelBlock(schema, 'CurrentnessEventDependency');

for (const [block, required] of [
  [eventTypeReference, [/eventTypeKey\s+String\s+@unique/, /authorityRef\s+String/, /versions\s+CurrentnessEventTypeVersion\[\]/]],
  [eventTypeVersion, [/eventTypeReferenceId\s+String/, /versionKey\s+String/, /lifecycleState\s+MethodResultRegistryLifecycleState/, /admittedAt\s+DateTime\?/, /supersedesEventTypeVersionId\s+String\?\s+@unique/, /correctionOfEventTypeVersionId\s+String\?\s+@unique/]],
  [event, [/eventTypeVersionId\s+String/, /occurredAt\s+DateTime\?/, /effectiveAt\s+DateTime\?/, /recordedAt\s+DateTime\s+@default\(now\(\)\)/, /primarySubject\s+CurrentnessEventPrimarySubject\?/, /dependencies\s+CurrentnessEventDependency\[\]/]],
  [primarySubject, [/eventId\s+String\s+@unique/, /provenance\s+Json/, /integrityFingerprint\s+String\s+@unique/]],
  [dependency, [/eventId\s+String/, /roleRef\s+String/, /ordinal\s+Int/, /provenance\s+Json/, /integrityFingerprint\s+String\s+@unique/]],
] as const) for (const pattern of required) assert.match(block, pattern);

assert.deepEqual(CURRENTNESS_EVENT_TARGET_KINDS, [
  'CANONICAL_METHOD_VERSION',
  'CANONICAL_RESULT_VERSION',
  'BASELINE_REFERENCE_VERSION',
  'REPORTING_PERIOD_REFERENCE_VERSION',
  'ANALYTICAL_BASIS_REFERENCE_VERSION',
  'PERIOD_BASIS_COMPATIBILITY_RESULT_CONTEXT',
  'QUALIFICATION_APPLICATION_VERSION',
  'OUTPUT_SEMANTIC_COMPOSITION_SNAPSHOT',
  'OUTPUT_EVIDENCE_SNAPSHOT',
  'EVIDENCE_ADMISSION',
  'PRODUCT_DEFINITION_REFERENCE',
]);

const targetFields = [
  ['methodVersionId', 'CanonicalMethodVersion'],
  ['resultVersionId', 'CanonicalResultVersion'],
  ['baselineReferenceVersionId', 'BaselineReferenceVersion'],
  ['reportingPeriodVersionId', 'ReportingPeriodReferenceVersion'],
  ['analyticalBasisVersionId', 'AnalyticalBasisReferenceVersion'],
  ['compatibilityContextId', 'OutputSemanticCompositionCompatibilityContext'],
  ['qualificationApplicationVersionId', 'QualificationApplicationVersion'],
  ['outputSnapshotId', 'OutputSemanticCompositionSnapshot'],
  ['outputEvidenceSnapshotId', 'OutputEvidenceSnapshot'],
  ['evidenceAdmissionId', 'EvidenceAdmission'],
  ['productDefinitionReferenceId', 'ProductDefinitionReference'],
] as const;

for (const [field, target] of targetFields) {
  for (const block of [primarySubject, dependency]) {
    assert.match(block, new RegExp(`${field}\\s+String\\?`));
    assert.ok(block.includes(target));
    assert.match(block, /onDelete: Restrict/);
  }
  assert.ok(migration.includes(`"${field}"`));
}

assert.deepEqual(
  [...migration.matchAll(/CREATE TABLE "([^"]+)"/g)].map((match) => match[1]),
  [
    'CurrentnessEventTypeReference',
    'CurrentnessEventTypeVersion',
    'CurrentnessEvent',
    'CurrentnessEventPrimarySubject',
    'CurrentnessEventDependency',
  ],
);
assert.doesNotMatch(migration, /CREATE TYPE/);

for (const required of [
  'CurrentnessPrimarySubject_exact_one_target',
  'CurrentnessDependency_exact_one_target',
  'Currentness Event requires an exact admitted Event Type Version',
  'Currentness Event requires exactly one strong typed primary subject',
  'Currentness Event lineage cannot contain a cycle',
  'Currentness Event Type Version supersession must remain within one Event Type Reference',
  'Currentness Event Type Version correction must remain within one Event Type Reference',
  'DEFERRABLE INITIALLY DEFERRED',
  'rejectCurrentnessMutation',
  'ON DELETE RESTRICT',
]) assert.ok(migration.includes(required), `Missing F3C-1 invariant: ${required}`);

for (const forbiddenOperation of [
  /^\s*INSERT\s+INTO\b/im,
  /^\s*UPDATE\s+"/im,
  /^\s*DELETE\s+FROM\b/im,
  /^\s*TRUNCATE\b/im,
  /^\s*DROP\b/im,
]) assert.doesNotMatch(migration, forbiddenOperation);

const boundedSources = [eventTypeReference, eventTypeVersion, event, primarySubject, dependency, migration, helper].join('\n');
for (const forbiddenSemantic of [
  /CurrentnessPolicy/,
  /CurrentnessProjection/,
  /ScenarioVersion/,
  /ClientCaseScenario/,
  /OutputDependency/,
  /OutputInvalidationState/,
  /freshnessRefs/,
  /CURRENTNESS_CONCERN/,
  /\bstale\b/i,
  /\bisCurrent\b/,
  /\bcurrentState\b/,
  /\bprojectedState\b/,
  /\binvalidation\b/i,
  /\bexpiration\b/i,
  /\bexpiresAt\b/,
  /\bfreshnessDuration\b/,
  /\brecencyScore\b/,
  /\bageScore\b/,
  /\bseverity\b/i,
  /\bmateriality\b/i,
]) assert.doesNotMatch(boundedSources, forbiddenSemantic, `F3C-1 crossed a held boundary: ${forbiddenSemantic}.`);

const valid = Object.freeze({
  eventId: 'test-only-event',
  eventTypeVersionId: 'test-only-event-type-version',
  primarySubjects: Object.freeze([{ kind: 'CANONICAL_METHOD_VERSION' as const, id: 'test-only-method-version' }]),
  dependencies: Object.freeze([{
    roleRef: 'test-only-dependency-role',
    ordinal: 0,
    target: Object.freeze({ kind: 'CANONICAL_RESULT_VERSION' as const, id: 'test-only-result-version' }),
  }]),
  lineage: Object.freeze({ predecessorEventId: null, correctionOfEventId: null, causalEventId: null }),
});
assert.deepEqual(validateCurrentnessEvent(valid), { valid: true, failure: null });
assert.equal(validateCurrentnessEvent({ ...valid, primarySubjects: [] }).failure, 'EXACTLY_ONE_PRIMARY_SUBJECT_REQUIRED');
assert.equal(validateCurrentnessEvent({ ...valid, primarySubjects: [...valid.primarySubjects, ...valid.primarySubjects] }).failure, 'EXACTLY_ONE_PRIMARY_SUBJECT_REQUIRED');
assert.equal(validateCurrentnessEvent({ ...valid, eventTypeVersionId: 'latest' }).failure, 'EVENT_TYPE_VERSION_REQUIRED');
assert.equal(validateCurrentnessEvent({ ...valid, primarySubjects: [{ ...valid.primarySubjects[0], id: 'current' }] }).failure, 'PRIMARY_SUBJECT_ID_REQUIRED');
assert.equal(validateCurrentnessEvent({ ...valid, dependencies: [{ ...valid.dependencies[0], ordinal: -1 }] }).failure, 'DEPENDENCY_ORDINAL_INVALID');
assert.equal(validateCurrentnessEvent({ ...valid, dependencies: [...valid.dependencies, valid.dependencies[0]] }).failure, 'DUPLICATE_DEPENDENCY_TARGET');
assert.equal(validateCurrentnessEvent({
  ...valid,
  dependencies: [...valid.dependencies, { ...valid.dependencies[0], target: { kind: 'EVIDENCE_ADMISSION', id: 'test-only-evidence' } }],
}).failure, 'DUPLICATE_DEPENDENCY_ORDINAL');
assert.equal(validateCurrentnessEvent({
  ...valid,
  lineage: { ...valid.lineage, predecessorEventId: valid.eventId },
}).failure, 'LINEAGE_SELF_REFERENCE');
assert.equal(validateCurrentnessEvent({
  ...valid,
  lineage: { ...valid.lineage, predecessorEventId: 'test-only-prior', correctionOfEventId: 'test-only-corrected' },
}).failure, 'LINEAGE_ROLE_CONFLICT');
assert.equal(hasCurrentnessEventLineageCycle([
  { id: 'test-only-a', predecessorEventId: 'test-only-b', correctionOfEventId: null, causalEventId: null },
  { id: 'test-only-b', predecessorEventId: null, correctionOfEventId: null, causalEventId: null },
]), false);
assert.equal(hasCurrentnessEventLineageCycle([
  { id: 'test-only-a', predecessorEventId: 'test-only-b', correctionOfEventId: null, causalEventId: null },
  { id: 'test-only-b', predecessorEventId: null, correctionOfEventId: null, causalEventId: 'test-only-a' },
]), true);

const headSchema = execFileSync('git', ['show', 'HEAD:prisma/schema.prisma'], { encoding: 'utf8' });
const normalizeAddedRelations = (source: string, name: string): string => modelBlock(source, name)
  .split('\n')
  .filter((line) => !line.includes('currentnessPrimarySubjects'))
  .filter((line) => !line.includes('currentnessDependencies'))
  .map((line) => line.trim().replace(/\s+/g, ' '))
  .join('\n');
for (const changedRelationModel of [
  'CanonicalMethodVersion',
  'CanonicalResultVersion',
  'BaselineReferenceVersion',
  'ReportingPeriodReferenceVersion',
  'AnalyticalBasisReferenceVersion',
  'OutputSemanticCompositionCompatibilityContext',
  'QualificationApplicationVersion',
  'OutputSemanticCompositionSnapshot',
  'OutputEvidenceSnapshot',
  'EvidenceAdmission',
  'ProductDefinitionReference',
]) assert.equal(
  normalizeAddedRelations(schema, changedRelationModel),
  normalizeAddedRelations(headSchema, changedRelationModel),
  `${changedRelationModel} changed beyond additive currentness reverse relations.`,
);

for (const unchangedModel of [
  'OutputDependency',
  'OutputReview',
  'QualificationDefinition',
  'QualificationDefinitionVersion',
  'QualificationApplication',
  'OutputSemanticCompositionQualificationPin',
  'OutputSemanticCompatibilityQualificationLink',
  'ClientCaseScenarioVersion',
]) assert.equal(modelBlock(schema, unchangedModel), modelBlock(headSchema, unchangedModel), `${unchangedModel} changed.`);

const trackedDiff = execFileSync('git', ['diff', '--name-only', 'HEAD'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const untracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const changed = [...new Set([...trackedDiff, ...untracked])].sort();
const allowed = [schemaPath, migrationPath, helperPath, certifierPath].sort();
assert.deepEqual(changed, allowed, 'F3C-1 changed files outside the bounded implementation scope.');

const schemaNumstat = execFileSync('git', ['diff', '--numstat', 'HEAD', '--', schemaPath], { encoding: 'utf8' }).trim();
assert.match(schemaNumstat, /^\d+\s+0\s+prisma\/schema\.prisma$/, 'F3C-1 schema change must be additive only.');
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

console.log('[currentness-event-history-foundation] ok: immutable event types/events, exact typed subjects/dependencies, lineage guards, empty state, and held boundaries passed.');
