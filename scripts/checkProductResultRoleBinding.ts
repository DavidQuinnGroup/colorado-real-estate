import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const schemaPath = 'prisma/schema.prisma';
const migrationAPath = 'prisma/migrations/20261003210000_add_method_result_registry_persistence_foundation/migration.sql';
const migrationBPath = 'prisma/migrations/20261003230000_add_method_result_version_lineage_v1/migration.sql';
const migrationCPath = 'prisma/migrations/20261003235000_add_method_result_legacy_alias_adapter_v1/migration.sql';
const migrationDPath = 'prisma/migrations/20261004000000_add_shared_primitive_contract_reference_controls_v1/migration.sql';
const migrationEPath = 'prisma/migrations/20261004010000_add_product_result_role_binding_controls_v1/migration.sql';
const certifierPath = 'scripts/checkProductResultRoleBinding.ts';

const schema = readFileSync(schemaPath, 'utf8');
const migrationA = readFileSync(migrationAPath, 'utf8');
const migrationB = readFileSync(migrationBPath, 'utf8');
const migrationC = readFileSync(migrationCPath, 'utf8');
const migrationD = readFileSync(migrationDPath, 'utf8');
const migrationE = readFileSync(migrationEPath, 'utf8');

assert.equal(createHash('sha256').update(migrationA).digest('hex'), '6c28594b434519e937dcbe3fd819d82e3250448ac976275198596f7766c2f3d0');
assert.equal(createHash('sha256').update(migrationB).digest('hex'), '7c386907227ac00adc37a50a382c53c263589c8164202c712371b18fcb8878ab');
assert.equal(createHash('sha256').update(migrationC).digest('hex'), 'fd3998b9ba00d92dc3aca2bda01bfd2691c25b979d72dea369b0022271583fcf');
assert.equal(createHash('sha256').update(migrationD).digest('hex'), 'f5be91c11e539101ce05cad0b950893aa7ad3a3da3849e934bd3337b2417c24b');

assert.match(schema, /model ProductDefinitionReference \{[\s\S]*@@unique\(\[productDefinitionRef, productDefinitionVersionRef\]\)/);
assert.match(schema, /model CanonicalResultOwner \{[\s\S]*productReference\s+ProductDefinitionReference/);
assert.match(schema, /model ProductResultRole \{[\s\S]*productReference\s+ProductDefinitionReference/);
const roleEnum = schema.match(/enum ProductResultRoleKind \{[\s\S]*?\}/)?.[0] ?? '';
for (const role of ['CONSUMER', 'COMMUNICATOR', 'PROJECTION', 'COMPOSITION']) assert.match(roleEnum, new RegExp(`\\b${role}\\b`));
assert.doesNotMatch(roleEnum, /\bOWNER\b/);

for (const required of [
  'ProductDefinitionReference_nonempty_identity',
  'CanonicalResultOwner_productReference_fkey',
  'ProductResultRole_productReference_fkey',
  'ProductDefinitionReference_immutability_guard',
  'NEW."id" IS DISTINCT FROM OLD."id"',
  'CanonicalResultOwner_binding_guard',
  'CanonicalResult_owner_admission_guard',
  'ProductResultRole_binding_guard',
  'Formal Canonical Result requires exactly one governing Product owner',
  'Canonical Result owner cannot also hold a non-owner role for the same Result',
  'Product Result non-owner role requires a formal Canonical Result',
  'Product Result non-owner role requires a formal ProductDefinitionReference',
]) assert.ok(migrationE.includes(required), `Missing Workstream E invariant: ${required}`);

for (const forbidden of [
  /^\s*INSERT\b/im,
  /^\s*UPDATE\b/im,
  /^\s*DELETE\b/im,
  /^\s*TRUNCATE\b/im,
  /^\s*DROP\b/im,
  /ALTER TABLE "(?:OutputProduct|OutputVersion|ClientCaseScenario|ClientCaseScenarioVersion)"/,
]) assert.doesNotMatch(migrationE, forbidden, `Workstream E migration contains forbidden operation ${forbidden}.`);

for (const forbiddenIdentity of [
  'PRODUCT_11',
  'PRODUCT_16',
  'PRODUCT_33',
  'PRODUCT_34',
  'PRODUCT_35',
  'PRODUCT_36',
  'PRODUCT_37',
  'PRODUCT_38',
  'PRODUCT_39',
]) assert.doesNotMatch(`${schema}\n${migrationE}`, new RegExp(forbiddenIdentity));

const trackedDiff = execFileSync('git', ['diff', '--name-only', 'HEAD'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const untracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const changed = [...new Set([...trackedDiff, ...untracked])].sort();
const allowed = [schemaPath, migrationEPath, certifierPath].sort();
assert.deepEqual(changed, allowed, 'Workstream E changed files outside the bounded Product/Result role scope.');

const protectedPrefixes = [
  'app/',
  'components/',
  'lib/',
  'middleware.ts',
  'package.json',
  'scripts/certifyClientCaseScenario',
  'scripts/checkClientCaseScenario',
  'scripts/seedClientCaseScenario',
];
assert.equal(changed.some((path) => protectedPrefixes.some((prefix) => path.startsWith(prefix))), false);

console.log('[product-result-role-binding] ok: one formal Product owner per Result, immutable owner and non-owner roles, exact Product references, no OutputVersion ownership, no population, and protected path checks passed.');
