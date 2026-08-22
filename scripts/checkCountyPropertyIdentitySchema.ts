import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { buildCountyPropertyIdentityReadContract } from '../lib/property/propertyCountyIdentity';
import { COUNTY_PROPERTY_IDENTITY_FIXTURES } from '../lib/property/propertyCountyIdentityFixtures';

const root = path.resolve(__dirname, '..');
const source = (relativePath: string) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const schema = source('prisma/schema.prisma');
const migration = source('prisma/migrations/20260822190000_add_county_property_identity_foundation/migration.sql');
const packageJson = JSON.parse(source('package.json')) as { scripts?: Record<string, string> };

for (const model of ['PropertySourceIdentity', 'PropertySourceIdentityObservation', 'PropertySourceIdentityRelationship', 'PropertyCountyIdentityMapping']) {
  assert.ok(schema.includes(`model ${model} {`), `Missing ${model} model.`);
  assert.ok(migration.includes(`CREATE TABLE \"${model}\"`), `Migration must create ${model}.`);
}

for (const enumValue of ['ASSESSOR_ACCOUNT', 'PARCEL', 'BUILDING', 'SCHEDULE_NUMBER', 'TAX_ACCOUNT', 'PROPERTY_NUMBER', 'OTHER_COUNTY_NATIVE_ID']) {
  assert.ok(schema.includes(enumValue), `Missing generic identifier type ${enumValue}.`);
}
for (const relationshipType of ['ACCOUNT_TO_PARCEL', 'ACCOUNT_TO_BUILDING', 'ACCOUNT_TO_PROPERTY', 'PARCEL_TO_PROPERTY', 'SUPERSEDES']) {
  assert.ok(schema.includes(relationshipType), `Missing relationship type ${relationshipType}.`);
}
for (const status of ['MATCHED', 'AMBIGUOUS', 'CONFLICTING', 'UNMATCHED', 'STALE', 'SUPERSEDED']) {
  assert.ok(schema.includes(status), `Missing mapping status ${status}.`);
}

assert.ok(schema.includes('@@unique([sourceId, jurisdictionCode, identifierType, normalizedValue], map: "PSI_source_jurisdiction_type_value_uq")'));
assert.ok(schema.includes('@@unique([propertyId, identityId], map: "PCIM_property_identity_uq")'));
assert.ok(schema.includes('observationFingerprint String                           @unique(map: "PSIO_fingerprint_uq")'));
assert.ok(schema.includes('relationshipFingerprint String                                  @unique(map: "PSIR_fingerprint_uq")'));
assert.ok(migration.includes('PropertyCountyIdentityMapping_no_fuzzy_address_match'));
assert.ok(!/DROP\s+/i.test(migration), 'Migration must not drop schema objects.');
assert.ok(!/ALTER TABLE\s+"Property"\s+(?:DROP|ALTER)/i.test(migration), 'Migration must not alter existing Property columns.');
assert.ok(!/\b(owner|customer|crm|protectedclass|demographic)\b/i.test(schema.match(/model PropertySourceIdentity[\s\S]*?model MlsSyncState/)?.[0] ?? ''), 'County identity schema must not add owner or customer fields.');

const textParcel = buildCountyPropertyIdentityReadContract(COUNTY_PROPERTY_IDENTITY_FIXTURES.boulderTextParcel);
assert.deepEqual(textParcel.parcels, ['12AB34CD56EF']);
assert.equal(textParcel.admitted, true);

const multi = buildCountyPropertyIdentityReadContract(COUNTY_PROPERTY_IDENTITY_FIXTURES.multiAccountMultiParcel);
assert.equal(multi.accounts.length, 2);
assert.equal(multi.parcels.length, 2);

const fuzzy = buildCountyPropertyIdentityReadContract(COUNTY_PROPERTY_IDENTITY_FIXTURES.fuzzyAddress);
assert.equal(fuzzy.admitted, false);
assert.ok(fuzzy.verificationRequirements.includes('FUZZY_ADDRESS_CANNOT_CREATE_MATCH'));

const ambiguous = buildCountyPropertyIdentityReadContract(COUNTY_PROPERTY_IDENTITY_FIXTURES.ambiguous);
assert.equal(ambiguous.state, 'REVIEW_REQUIRED');
const conflicting = buildCountyPropertyIdentityReadContract(COUNTY_PROPERTY_IDENTITY_FIXTURES.conflicting);
assert.equal(conflicting.state, 'CONFLICTING');
const superseded = buildCountyPropertyIdentityReadContract(COUNTY_PROPERTY_IDENTITY_FIXTURES.superseded);
assert.equal(superseded.admitted, false);
assert.ok(superseded.identityStatus.includes('SUPERSEDED'));

const observationFingerprints = new Set(['observation:account-1001', 'observation:account-1001']);
const relationshipFingerprints = new Set(['relationship:account-1001:parcel-12AB34CD56EF', 'relationship:account-1001:parcel-12AB34CD56EF']);
assert.equal(observationFingerprints.size, 1, 'Observation replay fingerprint must be idempotent.');
assert.equal(relationshipFingerprints.size, 1, 'Relationship replay fingerprint must be idempotent.');
assert.equal(packageJson.scripts?.['check:county-property-identity-schema'], 'jiti scripts/checkCountyPropertyIdentitySchema.ts');

console.log('COUNTY_PROPERTY_IDENTITY_SCHEMA_CHECK: PASS');
