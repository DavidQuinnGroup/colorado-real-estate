import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  CANONICAL_PHYSICAL_PROPERTY_IDENTITY_STATUS,
  PROPERTY_IDENTITY_GAPS,
  PROPERTY_IDENTITY_SOURCE_ADAPTER_CONTRACTS,
  buildCanonicalPhysicalPropertyIdentityReadModel,
} from '../lib/property/canonicalPhysicalPropertyIdentity';
import { CANONICAL_PHYSICAL_PROPERTY_IDENTITY_FIXTURES as fixtures } from '../lib/property/canonicalPhysicalPropertyIdentityFixtures';

const source = (file: string) => readFileSync(resolve(process.cwd(), file), 'utf8');
const schema = source('prisma/schema.prisma');
const migration = source('prisma/migrations/20260824000000_add_canonical_physical_property_identity/migration.sql');
const packageJson = JSON.parse(source('package.json')) as { scripts?: Record<string, string> };

assert.equal(CANONICAL_PHYSICAL_PROPERTY_IDENTITY_STATUS, 'REIE_CANONICAL_PHYSICAL_PROPERTY_IDENTITY_AND_SOURCE_OBSERVATION_ARCHITECTURE_MVV');
for (const model of ['CanonicalPhysicalProperty', 'CanonicalPhysicalPropertySourceIdentityMapping', 'CanonicalPhysicalPropertyObservation', 'CanonicalPropertyListingEvent']) {
  assert.match(schema, new RegExp(`model ${model} \\{`));
  assert.match(migration, new RegExp(`CREATE TABLE \\"${model}\\"`));
}
assert.match(schema, /MLS_LISTING/);
assert.match(schema, /SOURCE_PROPERTY_RECORD/);
assert.match(schema, /normalizedSitusAddress/);
assert.match(migration, /CanonicalPhysicalPropertySourceIdentityMapping_no_fuzzy_confirmed/);
assert.ok(!/INSERT\s+INTO|UPDATE\s+"(?:Property|CanonicalPhysicalProperty)"|DELETE\s+FROM/i.test(migration), 'Migration must create architecture only.');
assert.ok(!/ALTER TABLE\s+"Property"\s+(?:DROP|ALTER|ADD)/i.test(migration), 'Legacy Property must remain unchanged.');
assert.ok(!/\b(owner|mailing|customer|crm|protectedclass|demographic)\b/i.test(schema.match(/model CanonicalPhysicalProperty[\s\S]*?model MlsSyncState/)?.[0] ?? ''), 'Canonical property models must remain property-centric.');

const complete = buildCanonicalPhysicalPropertyIdentityReadModel(fixtures.completeInternalGovernanceReady);
assert.equal(complete.readiness, 'CERTIFICATION_READY');
assert.equal(complete.activation, 'NOT_AUTHORIZED');
assert.equal(complete.currentListingEvidence, 'AVAILABLE_FOR_FUTURE_REVIEW');
assert.equal(complete.historicalListingEvidence, 'NOT_ADMITTED');
assert.equal(complete.publicRecordEvidence, 'NOT_ADMITTED');
assert.deepEqual(complete.globalGaps, PROPERTY_IDENTITY_GAPS);
assert.equal(Object.values(complete.protectedBoundaries).every((value) => value === false), true);

const multipleSourceIds = buildCanonicalPhysicalPropertyIdentityReadModel(fixtures.multipleSourceIds);
assert.equal(multipleSourceIds.sourceIdentities.length, 2);
assert.equal(multipleSourceIds.parcelIdentities.length, 1);
const multipleListingEvents = buildCanonicalPhysicalPropertyIdentityReadModel(fixtures.multipleListingEvents);
assert.equal(multipleListingEvents.currentListingEvidence, 'AVAILABLE_FOR_FUTURE_REVIEW');
assert.equal(multipleListingEvents.historicalListingEvidence, 'NOT_ADMITTED');

for (const [name, expected] of [
  ['unknownRights', 'REVIEW_REQUIRED'],
  ['staleSource', 'REVIEW_REQUIRED'],
  ['conflictingIdentity', 'REVIEW_REQUIRED'],
  ['possibleMatch', 'REVIEW_REQUIRED'],
  ['missingSourceIdentity', 'REVIEW_REQUIRED'],
  ['incompleteObservationProvenance', 'REVIEW_REQUIRED'],
  ['activationRequested', 'REVIEW_REQUIRED'],
] as const) {
  const model = buildCanonicalPhysicalPropertyIdentityReadModel(fixtures[name]);
  assert.equal(model.readiness, expected, `${name} must fail closed.`);
  assert.equal(model.activation, 'NOT_AUTHORIZED', `${name} must not activate.`);
}
assert.equal(buildCanonicalPhysicalPropertyIdentityReadModel(fixtures.conflictingIdentity).identityState, 'CONFLICTING');
assert.ok(buildCanonicalPhysicalPropertyIdentityReadModel(fixtures.missingSourceIdentity).verificationRequirements.includes('SOURCE_IDENTITY_REQUIRED'));
assert.ok(buildCanonicalPhysicalPropertyIdentityReadModel(fixtures.activationRequested).verificationRequirements.includes('ACTIVATION_NOT_AUTHORIZED'));
assert.ok(buildCanonicalPhysicalPropertyIdentityReadModel(fixtures.activationRequested).verificationRequirements.includes('HISTORICAL_MLS_USE_RECONCILIATION_REQUIRED'));

assert.equal(PROPERTY_IDENTITY_SOURCE_ADAPTER_CONTRACTS.length, 4);
for (const adapter of PROPERTY_IDENTITY_SOURCE_ADAPTER_CONTRACTS) {
  assert.equal(adapter.sourceAdmission, 'REQUIRED');
  assert.equal(adapter.dataPopulation, 'NOT_AUTHORIZED');
  assert.equal(adapter.activation, 'NOT_AUTHORIZED');
}
assert.equal(packageJson.scripts?.['check:canonical-physical-property-identity'], 'jiti scripts/checkCanonicalPhysicalPropertyIdentity.ts');
console.log('CANONICAL_PHYSICAL_PROPERTY_IDENTITY_CHECK: PASS');
