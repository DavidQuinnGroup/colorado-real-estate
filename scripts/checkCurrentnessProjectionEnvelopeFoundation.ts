import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import {
  CURRENTNESS_PROJECTION_TARGET_KINDS,
  hasCurrentnessProjectionVersionLineageCycle,
  validateCurrentnessProjectionEventManifest,
  validateCurrentnessProjectionReference,
  validateCurrentnessProjectionVersion,
} from '../lib/currentnessProjectionEnvelopeValidation';

const expectedParent = 'c6ccd8f0870a963224d207a8786a1aa2942696fa';
const schemaPath = 'prisma/schema.prisma';
const migrationPath = 'prisma/migrations/20261004110000_add_currentness_projection_envelope_foundation_v1/migration.sql';
const helperPath = 'lib/currentnessProjectionEnvelopeValidation.ts';
const certifierPath = 'scripts/checkCurrentnessProjectionEnvelopeFoundation.ts';
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
} as const;

const schema = readFileSync(schemaPath, 'utf8');
const migration = readFileSync(migrationPath, 'utf8');
const helper = readFileSync(helperPath, 'utf8');
const modelBlock = (source: string, name: string): string =>
  source.match(new RegExp(`model ${name} \\{[\\s\\S]*?\\n\\}`))?.[0] ?? '';

assert.equal(execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), expectedParent);

for (const [path, expectedHash] of Object.entries(priorMigrationHashes)) {
  assert.equal(
    createHash('sha256').update(readFileSync(path)).digest('hex'),
    expectedHash,
    `${path} bytes changed.`,
  );
}

const reference = modelBlock(schema, 'CurrentnessProjectionReference');
const primarySubject = modelBlock(schema, 'CurrentnessProjectionPrimarySubject');
const version = modelBlock(schema, 'CurrentnessProjectionVersion');
const dependency = modelBlock(schema, 'CurrentnessProjectionDependency');
const membership = modelBlock(schema, 'CurrentnessProjectionEventMembership');
for (const block of [reference, primarySubject, version, dependency, membership]) assert.notEqual(block, '');

for (const pattern of [
  /projectionKey\s+String\s+@unique/,
  /policyReferenceId\s+String/,
  /purposeRef\s+String\?/,
  /authorityRef\s+String/,
  /provenance\s+Json/,
  /integrityFingerprint\s+String\s+@unique/,
  /primarySubject\s+CurrentnessProjectionPrimarySubject\?/,
  /versions\s+CurrentnessProjectionVersion\[\]/,
]) assert.match(reference, pattern);

for (const pattern of [
  /projectionReferenceId\s+String\s+@unique/,
  /provenance\s+Json/,
  /integrityFingerprint\s+String\s+@unique/,
]) assert.match(primarySubject, pattern);

for (const pattern of [
  /projectionReferenceId\s+String/,
  /versionKey\s+String/,
  /lifecycleState\s+MethodResultRegistryLifecycleState/,
  /policyVersionId\s+String/,
  /projectedStateAuthorityRef\s+String/,
  /projectedStateKey\s+String/,
  /projectedStateVersionRef\s+String/,
  /projectedStateGoverningSourceRef\s+String\?/,
  /projectedStateIntegrityFingerprint\s+String/,
  /evaluatedAt\s+DateTime/,
  /evaluationCutoffAt\s+DateTime\?/,
  /recordedThroughAt\s+DateTime/,
  /projectedAt\s+DateTime/,
  /eventManifestCount\s+Int/,
  /eventManifestFingerprint\s+String/,
  /formalizedAt\s+DateTime\?/,
  /admittedAt\s+DateTime\?/,
  /supersedesProjectionVersionId\s+String\?\s+@unique/,
  /correctionOfProjectionVersionId\s+String\?\s+@unique/,
]) assert.match(version, pattern);

for (const pattern of [
  /projectionVersionId\s+String/,
  /roleRef\s+String/,
  /ordinal\s+Int/,
  /provenance\s+Json/,
  /integrityFingerprint\s+String\s+@unique/,
]) assert.match(dependency, pattern);

for (const pattern of [
  /projectionVersionId\s+String/,
  /eventId\s+String/,
  /provenance\s+Json/,
  /integrityFingerprint\s+String\s+@unique/,
  /@@unique\(\[projectionVersionId, eventId\]/,
]) assert.match(membership, pattern);

assert.deepEqual(CURRENTNESS_PROJECTION_TARGET_KINDS, [
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
    'CurrentnessProjectionReference',
    'CurrentnessProjectionPrimarySubject',
    'CurrentnessProjectionVersion',
    'CurrentnessProjectionDependency',
    'CurrentnessProjectionEventMembership',
  ],
);
assert.doesNotMatch(migration, /CREATE TYPE/);

for (const required of [
  'CurrentnessProjectionPrimary_exact_one_target',
  'CurrentnessProjectionDependency_exact_one_target',
  'Currentness Projection Reference requires exactly one strong typed primary subject',
  'Currentness Projection Policy Version must belong to the Projection Reference Policy Reference',
  'Formal Currentness Projection Version requires an exact admitted Policy Version',
  'Currentness Projection event manifest count must equal explicit membership count',
  'Currentness Projection Dependency duplicates role and exact target membership',
  'Currentness Projection Version lineage cannot contain a cycle',
  'DEFERRABLE INITIALLY DEFERRED',
  'ON DELETE RESTRICT',
]) assert.ok(migration.includes(required), `Missing F3C-3 invariant: ${required}`);

for (const forbiddenOperation of [
  /^\s*INSERT\s+INTO\b/im,
  /^\s*UPDATE\s+"/im,
  /^\s*DELETE\s+FROM\b/im,
  /^\s*TRUNCATE\b/im,
  /^\s*DROP\b/im,
]) assert.doesNotMatch(migration, forbiddenOperation);

const boundedSources = [reference, primarySubject, version, dependency, membership, migration, helper].join('\n');
for (const forbiddenSemantic of [
  /ScenarioVersion/,
  /ClientCaseScenario/,
  /OutputDependency/,
  /OutputInvalidationState/,
  /freshnessRefs/,
  /CurrentnessProjectedStateReference/,
  /CurrentnessProjectedStateVersion/,
  /currentVersionId/,
  /latestProjectionId/,
  /freshnessDuration/i,
  /\bstaleAt\b/i,
  /\brecencyScore\b/i,
  /\bageScore\b/i,
  /\bmateriality\b/i,
  /automaticInvalidation/i,
  /CURRENTNESS_CONCERN/,
]) assert.doesNotMatch(boundedSources, forbiddenSemantic, `F3C-3 crossed a held boundary: ${forbiddenSemantic}.`);

assert.equal((schema.match(/^model CurrentnessProjection/gm) ?? []).length, 5);
assert.doesNotMatch(schema, /^enum .*CurrentnessProjection/gm);
assert.doesNotMatch(schema, /latestProjection|currentProjection|projectionToQualification/i);

const validReference = Object.freeze({
  projectionKey: 'test-only-projection',
  policyReferenceId: 'test-only-policy-reference',
  purposeRef: 'test-only-purpose',
  authorityRef: 'test-only-authority',
  primarySubjects: Object.freeze([
    Object.freeze({ kind: 'CANONICAL_METHOD_VERSION' as const, id: 'test-only-method-version' }),
  ]),
});
assert.deepEqual(validateCurrentnessProjectionReference(validReference), { valid: true, failure: null });
assert.equal(validateCurrentnessProjectionReference({ ...validReference, projectionKey: 'latest' }).failure, 'PROJECTION_KEY_REQUIRED');
assert.equal(validateCurrentnessProjectionReference({ ...validReference, primarySubjects: [] }).failure, 'EXACTLY_ONE_PRIMARY_SUBJECT_REQUIRED');
assert.equal(validateCurrentnessProjectionReference({ ...validReference, primarySubjects: [...validReference.primarySubjects, ...validReference.primarySubjects] }).failure, 'EXACTLY_ONE_PRIMARY_SUBJECT_REQUIRED');

const validVersion = Object.freeze({
  projectionVersionId: 'test-only-projection-version',
  projectionReferenceId: 'test-only-projection-reference',
  versionKey: 'test-only-v1',
  lifecycleState: 'CANDIDATE',
  policyVersionId: 'test-only-policy-version',
  projectedStateAuthorityRef: 'test-only-state-authority',
  projectedStateKey: 'test-only-state',
  projectedStateVersionRef: 'test-only-state-v1',
  projectedStateGoverningSourceRef: 'test-only-source-v1',
  projectedStateIntegrityFingerprint: 'test-only-state-fingerprint',
  evaluatedAt: '2026-10-04T01:00:00.000Z',
  evaluationCutoffAt: '2026-10-04T00:30:00.000Z',
  recordedThroughAt: '2026-10-04T00:45:00.000Z',
  projectedAt: '2026-10-04T01:15:00.000Z',
  eventManifestCount: 1,
  eventManifestFingerprint: 'test-only-manifest-fingerprint',
  authorityRef: 'test-only-authority',
  formalizedAt: null,
  admittedAt: null,
  dependencies: Object.freeze([Object.freeze({
    roleRef: 'test-only-dependency',
    ordinal: 0,
    target: Object.freeze({ kind: 'CANONICAL_RESULT_VERSION' as const, id: 'test-only-result-version' }),
  })]),
  eventIds: Object.freeze(['test-only-event']),
  lineage: Object.freeze({
    supersedesProjectionVersionId: null,
    correctionOfProjectionVersionId: null,
  }),
});
assert.deepEqual(validateCurrentnessProjectionVersion(validVersion), { valid: true, failure: null });
assert.equal(validateCurrentnessProjectionVersion({ ...validVersion, policyVersionId: 'current' }).failure, 'POLICY_VERSION_REQUIRED');
assert.equal(validateCurrentnessProjectionVersion({ ...validVersion, projectedStateVersionRef: 'latest' }).failure, 'PROJECTED_STATE_VERSION_REQUIRED');
assert.equal(validateCurrentnessProjectionVersion({ ...validVersion, eventManifestCount: 2 }).failure, 'EVENT_MANIFEST_COUNT_MISMATCH');
assert.equal(validateCurrentnessProjectionVersion({ ...validVersion, eventIds: ['test-only-event', 'test-only-event'], eventManifestCount: 2 }).failure, 'DUPLICATE_EVENT_MEMBERSHIP');
assert.equal(validateCurrentnessProjectionVersion({ ...validVersion, projectedAt: '2026-10-04T00:00:00.000Z' }).failure, 'TEMPORAL_METADATA_INVALID');
assert.equal(validateCurrentnessProjectionVersion({ ...validVersion, lifecycleState: 'ADMITTED' }).failure, 'ADMITTED_FINALITY_REQUIRED');
assert.deepEqual(validateCurrentnessProjectionVersion({
  ...validVersion,
  lifecycleState: 'ADMITTED',
  formalizedAt: '2026-10-04T01:16:00.000Z',
  admittedAt: '2026-10-04T01:17:00.000Z',
}), { valid: true, failure: null });
assert.equal(validateCurrentnessProjectionVersion({
  ...validVersion,
  dependencies: [...validVersion.dependencies, { ...validVersion.dependencies[0], ordinal: 1 }],
}).failure, 'DUPLICATE_DEPENDENCY_TARGET');
assert.equal(validateCurrentnessProjectionVersion({
  ...validVersion,
  dependencies: [...validVersion.dependencies, {
    ...validVersion.dependencies[0],
    target: { kind: 'EVIDENCE_ADMISSION' as const, id: 'test-only-evidence' },
  }],
}).failure, 'DUPLICATE_DEPENDENCY_ORDINAL');
assert.equal(validateCurrentnessProjectionVersion({
  ...validVersion,
  lineage: { supersedesProjectionVersionId: validVersion.projectionVersionId, correctionOfProjectionVersionId: null },
}).failure, 'LINEAGE_SELF_REFERENCE');
assert.equal(validateCurrentnessProjectionVersion({
  ...validVersion,
  lineage: { supersedesProjectionVersionId: 'test-only-prior', correctionOfProjectionVersionId: 'test-only-corrected' },
}).failure, 'LINEAGE_ROLE_CONFLICT');
assert.deepEqual(validateCurrentnessProjectionEventManifest([], 0, 'test-only-empty-manifest'), { valid: true, failure: null });

assert.equal(hasCurrentnessProjectionVersionLineageCycle([
  { id: 'test-only-a', supersedesProjectionVersionId: 'test-only-b', correctionOfProjectionVersionId: null },
  { id: 'test-only-b', supersedesProjectionVersionId: null, correctionOfProjectionVersionId: null },
]), false);
assert.equal(hasCurrentnessProjectionVersionLineageCycle([
  { id: 'test-only-a', supersedesProjectionVersionId: 'test-only-b', correctionOfProjectionVersionId: null },
  { id: 'test-only-b', supersedesProjectionVersionId: null, correctionOfProjectionVersionId: 'test-only-a' },
]), true);

const headSchema = execFileSync('git', ['show', 'HEAD:prisma/schema.prisma'], { encoding: 'utf8' });
const newModelNames = [
  'CurrentnessProjectionReference',
  'CurrentnessProjectionPrimarySubject',
  'CurrentnessProjectionVersion',
  'CurrentnessProjectionDependency',
  'CurrentnessProjectionEventMembership',
];
const stripAuthorizedAdditions = (source: string): string => {
  let stripped = source;
  for (const name of newModelNames) {
    stripped = stripped.replace(new RegExp(`\\nmodel ${name} \\{[\\s\\S]*?\\n\\}\\n`, 'g'), '\n');
  }
  return stripped
    .split('\n')
    .filter((line) => !line.includes('currentnessProjectionPrimarySubjects'))
    .filter((line) => !line.includes('currentnessProjectionDependencies'))
    .filter((line) => !line.includes('projectionReferences'))
    .filter((line) => !line.includes('projectionVersions'))
    .filter((line) => !line.includes('projectionMemberships'))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};
assert.equal(stripAuthorizedAdditions(schema), stripAuthorizedAdditions(headSchema), 'Existing schema changed beyond authorized additive reverse relations.');

const trackedDiff = execFileSync('git', ['diff', '--name-only', 'HEAD'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const untracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const changed = [...new Set([...trackedDiff, ...untracked])].sort();
const allowed = [schemaPath, migrationPath, helperPath, certifierPath].sort();
assert.deepEqual(changed, allowed, 'F3C-3 changed files outside the bounded implementation scope.');

const schemaNumstat = execFileSync('git', ['diff', '--numstat', 'HEAD', '--', schemaPath], { encoding: 'utf8' }).trim();
assert.match(schemaNumstat, /^\d+\s+0\s+prisma\/schema\.prisma$/, 'F3C-3 schema change must be additive only.');

for (const path of allowed) {
  const source = readFileSync(path, 'utf8');
  assert.equal(source.endsWith('\n'), true, `${path} must end with a newline.`);
  assert.equal(source.split('\n').some((line) => /[ \t]+$/.test(line)), false, `${path} contains trailing whitespace.`);
}

const forbiddenPaths = [
  'app/',
  'components/',
  'middleware.ts',
  'package.json',
  'package-lock.json',
  'lib/outputPersistenceFoundation.ts',
  'lib/outputVersionLineageInvalidationFoundation.ts',
  'lib/clientCaseScenario',
];
assert.equal(changed.some((path) => forbiddenPaths.some((prefix) => path.startsWith(prefix))), false);

execFileSync('git', ['diff', '--check'], { stdio: 'inherit' });

console.log('[currentness-projection-envelope-foundation] ok: exact policy/subject identity, opaque state tuple, explicit immutable event manifest, typed dependencies, one-way finalization, lineage guards, empty state, and held boundaries passed.');
