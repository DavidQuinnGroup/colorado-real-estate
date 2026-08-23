import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { REIE_SOURCE_REGISTRY } from '../lib/sourceRegistry';
import { decideBoulderCountyPropertyMapping } from '../lib/property/boulderCountyIdentityMapping';
import {
  BOULDER_COUNTY_ACCOUNT_PARCELS_OFFICIAL_EVIDENCE,
  boulderCountyObservationFingerprint,
  boulderCountyRelationshipFingerprint,
  parseBoulderCountyAccountParcelsCsv,
} from '../lib/property/boulderCountyIdentityPopulation';
import { BOULDER_COUNTY_IDENTITY_POPULATION_FIXTURES } from '../lib/property/boulderCountyIdentityPopulationFixtures';

const root = path.resolve(__dirname, '..');
const source = (relativePath: string) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const packageJson = JSON.parse(source('package.json')) as { scripts?: Record<string, string> };
const snapshot = parseBoulderCountyAccountParcelsCsv(BOULDER_COUNTY_IDENTITY_POPULATION_FIXTURES.accountParcelCsv);

assert.equal(snapshot.shape.recordCount, 3);
assert.equal(snapshot.shape.relationshipRecordCount, 3);
assert.equal(snapshot.shape.uniqueAccountCount, 2);
assert.equal(snapshot.shape.uniqueParcelCount, 2);
assert.equal(snapshot.shape.duplicateRelationshipCount, 0);
assert.equal(snapshot.shape.multiParcelAccountCount, 1);
assert.equal(snapshot.shape.multiAccountParcelCount, 1);
assert.equal(snapshot.rows[0].parcelNormalizedValue, '00AB00CD00EF');
assert.equal(snapshot.shape.addressAvailability, 'NOT_PRESENT_IN_ADMITTED_DATASET');
assert.equal(parseBoulderCountyAccountParcelsCsv('"strap","Parcelno"\n"R0001",""\n').shape.blankParcelCount, 1);
assert.throws(() => parseBoulderCountyAccountParcelsCsv('"strap","Parcelno"\n"R0001","123"\n'));
assert.throws(() => parseBoulderCountyAccountParcelsCsv('"account","parcel"\n"R0001","00AB00CD00EF"\n'));

assert.equal(decideBoulderCountyPropertyMapping(BOULDER_COUNTY_IDENTITY_POPULATION_FIXTURES.cleanSinglePropertyMatch).status, 'MATCHED');
assert.equal(decideBoulderCountyPropertyMapping(BOULDER_COUNTY_IDENTITY_POPULATION_FIXTURES.multiParcelProperty).status, 'MATCHED');
assert.equal(decideBoulderCountyPropertyMapping(BOULDER_COUNTY_IDENTITY_POPULATION_FIXTURES.multiAccountProperty).status, 'MATCHED');
assert.equal(decideBoulderCountyPropertyMapping(BOULDER_COUNTY_IDENTITY_POPULATION_FIXTURES.condoUnitAmbiguity).status, 'AMBIGUOUS');
assert.equal(decideBoulderCountyPropertyMapping(BOULDER_COUNTY_IDENTITY_POPULATION_FIXTURES.addressMismatch).status, 'UNMATCHED');
assert.equal(decideBoulderCountyPropertyMapping(BOULDER_COUNTY_IDENTITY_POPULATION_FIXTURES.duplicateCollision).status, 'CONFLICTING');
assert.equal(decideBoulderCountyPropertyMapping(BOULDER_COUNTY_IDENTITY_POPULATION_FIXTURES.missingAddress).status, 'NO_MAPPING_CANDIDATE');
assert.equal(decideBoulderCountyPropertyMapping(BOULDER_COUNTY_IDENTITY_POPULATION_FIXTURES.missingParcel).status, 'NO_MAPPING_CANDIDATE');
assert.equal(decideBoulderCountyPropertyMapping(BOULDER_COUNTY_IDENTITY_POPULATION_FIXTURES.conflictingCandidate).status, 'CONFLICTING');

assert.equal(boulderCountyObservationFingerprint('checksum', 'PARCEL', '00AB00CD00EF'), boulderCountyObservationFingerprint('checksum', 'PARCEL', '00AB00CD00EF'));
assert.equal(boulderCountyRelationshipFingerprint('checksum', 'R0001', '00AB00CD00EF'), boulderCountyRelationshipFingerprint('checksum', 'R0001', '00AB00CD00EF'));

const assessor = REIE_SOURCE_REGISTRY.records.find((record) => record.sourceId === 'SRC-BOULDER-COUNTY-ASSESSOR');
assert.ok(assessor?.boundedUsePosture, 'Boulder County Assessor must carry the explicit bounded identity-slice posture.');
assert.equal(assessor.authorizationState, 'AWAITING_PROVIDER_CONFIRMATION', 'Broader Assessor records must preserve their historical pending posture.');
assert.equal(assessor.boundedUsePosture.historicalBroaderAssessorPosture, 'AWAITING_PROVIDER_CONFIRMATION');
assert.equal(assessor.boundedUsePosture.evidenceStatus, 'BOULDER_COUNTY_OPEN_DATA_RIGHTS_AND_IDENTITY_SOURCE_CERTIFIED');
assert.equal(assessor.boundedUsePosture.rights, 'RECONCILED_FOR_COVERED_BOULDER_OPEN_DATA');
assert.equal(assessor.boundedUsePosture.technicalAccess, 'OFFICIAL_PUBLIC_BULK_DOWNLOAD_PUBLISHED');
assert.equal(assessor.boundedUsePosture.identityDataset, 'AUTHORIZED_FOR_BOUNDED_ACCOUNT_PARCEL_IDENTITY_USE');
assert.equal(assessor.boundedUsePosture.runtimeActivation, 'NOT_ACTIVE');
assert.equal(assessor.boundedUsePosture.ownerData, 'EXCLUDED');
assert.equal(assessor.boundedUsePosture.propertyFactAdmission, 'NOT_AUTHORIZED_SEPARATE_GATE');
assert.equal(assessor.boundedUsePosture.customerDisplay, 'NOT_AUTHORIZED_SEPARATE_GATE');
assert.equal(assessor.boundedUsePosture.publicDisplay, 'NOT_AUTHORIZED_SEPARATE_GATE');
assert.equal(BOULDER_COUNTY_ACCOUNT_PARCELS_OFFICIAL_EVIDENCE.datasetUrl, 'https://assessor.boco.solutions/ASR_PublicDataFiles/Account_Parcels.csv');
assert.equal(BOULDER_COUNTY_ACCOUNT_PARCELS_OFFICIAL_EVIDENCE.ownerData, 'EXCLUDED');
assert.match(BOULDER_COUNTY_ACCOUNT_PARCELS_OFFICIAL_EVIDENCE.freshness, /daily at approximately 4 a\.m/);
assert.equal(packageJson.scripts?.['check:boulder-county-identity-population'], 'jiti scripts/checkBoulderCountyIdentityPopulation.ts');
assert.doesNotMatch(source('scripts/populateBoulderCountyIdentity.ts'), /owner_name|mailing address|Owner_Address/i, 'Population source must not accept owner-bearing fields.');
assert.doesNotMatch(source('scripts/populateBoulderCountyIdentityChunk.ts'), /owner_name|mailing address|Owner_Address/i, 'Chunk population source must not accept owner-bearing fields.');
const boundedImporter = source('scripts/populateBoulderCountyIdentityBounded.ts');
assert.doesNotMatch(boundedImporter, /Promise\.all\(chunks|p-limit|WRITE_CONCURRENCY/i, 'Bounded importer must not schedule the full source concurrently.');
assert.match(boundedImporter, /connection_limit', '1'/, 'Bounded importer must use one database connection.');
assert.match(boundedImporter, /--max-chunks/, 'Bounded importer must use an explicit resumable chunk range.');
for (const populationScript of ['scripts/populateBoulderCountyIdentity.ts', 'scripts/populateBoulderCountyIdentityBounded.ts', 'scripts/populateBoulderCountyIdentityChunk.ts']) {
  assert.match(source(populationScript), /--execute-governed-identity-import/, `${populationScript} must require explicit future database-population confirmation.`);
}

console.log('BOULDER_COUNTY_IDENTITY_POPULATION_CHECK: PASS');
