import fs from 'node:fs';
import path from 'node:path';

import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import pLimit from 'p-limit';

import {
  BOULDER_COUNTY_ACCOUNT_PARCELS_DATASET,
  BOULDER_COUNTY_ACCOUNT_PARCELS_URL,
  BOULDER_COUNTY_ASSESSOR_SOURCE_ID,
  BOULDER_COUNTY_IDENTITY_RIGHTS_POSTURE,
  BOULDER_COUNTY_JURISDICTION_CODE,
  boulderCountyObservationFingerprint,
  boulderCountyRelationshipFingerprint,
  parseBoulderCountyAccountParcelsCsv,
} from '../lib/property/boulderCountyIdentityPopulation';

dotenv.config({ path: '.env.local', quiet: true });
dotenv.config({ quiet: true });

const CHUNK_SIZE = 5_000;
const WRITE_CONCURRENCY = 4;
const FIELD_SEMANTICS_REFERENCE = 'BOULDER_COUNTY_PROPERTY_DATA_DOWNLOAD_HELP:strap=account;Parcelno=12-character-text-parcel';
const ATTRIBUTION_REFERENCE = 'BOULDER_COUNTY_ASSESSOR_ATTRIBUTION_REQUIRED_NON_ENDORSEMENT';

const argumentValue = (name: string): string | null => {
  const index = process.argv.indexOf(name);
  return index < 0 ? null : process.argv[index + 1] ?? null;
};

const chunks = <T>(values: readonly T[]): T[][] => {
  const result: T[][] = [];
  for (let index = 0; index < values.length; index += CHUNK_SIZE) result.push(values.slice(index, index + CHUNK_SIZE));
  return result;
};

async function main(): Promise<void> {
  const sourceFile = argumentValue('--source-file');
  const sourceUrl = argumentValue('--source-url') ?? BOULDER_COUNTY_ACCOUNT_PARCELS_URL;
  const validateOnly = process.argv.includes('--validate-only');
  if (!sourceFile) throw new Error('Usage: jiti scripts/populateBoulderCountyIdentity.ts --source-file <Account_Parcels.csv> [--source-url <official-url>]');
  if (sourceUrl !== BOULDER_COUNTY_ACCOUNT_PARCELS_URL) throw new Error('Only the canonical official Boulder County Account_Parcels URL is allowed.');

  const contents = fs.readFileSync(path.resolve(sourceFile), 'utf8');
  const snapshot = parseBoulderCountyAccountParcelsCsv(contents);
  if (validateOnly) {
    console.log(JSON.stringify({ status: 'BOULDER_COUNTY_ACCOUNT_PARCELS_SOURCE_SHAPE_VALIDATED', sourceUrl, sourceShape: snapshot.shape }));
    return;
  }
  if (!process.argv.includes('--execute-governed-identity-import')) {
    throw new Error('Database population is disabled until Supabase recovery and a separate authorized execution. Use --validate-only for non-mutating validation.');
  }
  const retrievedAt = new Date();
  const payloadReference = `sha256:${snapshot.shape.sourceChecksum};dataset:${BOULDER_COUNTY_ACCOUNT_PARCELS_DATASET}`;
  const accounts = new Map<string, string>();
  const parcels = new Map<string, string>();
  const relationships = new Map<string, { accountNormalizedValue: string; parcelNormalizedValue: string }>();

  for (const row of snapshot.rows) {
    accounts.set(row.accountNormalizedValue, row.accountSourceValue);
    if (row.parcelNormalizedValue && row.parcelSourceValue) {
      parcels.set(row.parcelNormalizedValue, row.parcelSourceValue);
      relationships.set(`${row.accountNormalizedValue}\u0000${row.parcelNormalizedValue}`, row as { accountNormalizedValue: string; parcelNormalizedValue: string });
    }
  }

  const prisma = new PrismaClient();
  try {
    let identitiesCreated = 0;
    const existingIdentities = await prisma.propertySourceIdentity.findMany({
      where: { sourceId: BOULDER_COUNTY_ASSESSOR_SOURCE_ID, jurisdictionCode: BOULDER_COUNTY_JURISDICTION_CODE, identifierType: { in: ['ASSESSOR_ACCOUNT', 'PARCEL'] } },
      select: { identifierType: true, normalizedValue: true },
    });
    const existingIdentityKeys = new Set(existingIdentities.map((identity) => `${identity.identifierType}\u0000${identity.normalizedValue}`));
    for (const [identifierType, identities] of [
      ['ASSESSOR_ACCOUNT', accounts] as const,
      ['PARCEL', parcels] as const,
    ]) {
      const missingIdentities = [...identities.entries()].filter(([normalizedValue]) => !existingIdentityKeys.has(`${identifierType}\u0000${normalizedValue}`));
      const limit = pLimit(WRITE_CONCURRENCY);
      const results = await Promise.all(chunks(missingIdentities).map((group) => limit(() => prisma.propertySourceIdentity.createMany({
          data: group.map(([normalizedValue, sourceValue]) => ({
            sourceId: BOULDER_COUNTY_ASSESSOR_SOURCE_ID,
            jurisdictionType: 'COUNTY',
            jurisdictionCode: BOULDER_COUNTY_JURISDICTION_CODE,
            identifierType,
            sourceValue,
            normalizedValue,
            status: 'ACTIVE',
            firstObservedAt: retrievedAt,
            lastObservedAt: retrievedAt,
            isCurrent: true,
          })),
          skipDuplicates: true,
        }))));
      identitiesCreated += results.reduce((total, result) => total + result.count, 0);
    }

    await prisma.propertySourceIdentity.updateMany({
      where: { sourceId: BOULDER_COUNTY_ASSESSOR_SOURCE_ID, jurisdictionCode: BOULDER_COUNTY_JURISDICTION_CODE, identifierType: { in: ['ASSESSOR_ACCOUNT', 'PARCEL'] } },
      data: { status: 'ACTIVE', lastObservedAt: retrievedAt, isCurrent: true },
    });

    const identities = await prisma.propertySourceIdentity.findMany({
      where: { sourceId: BOULDER_COUNTY_ASSESSOR_SOURCE_ID, jurisdictionCode: BOULDER_COUNTY_JURISDICTION_CODE, identifierType: { in: ['ASSESSOR_ACCOUNT', 'PARCEL'] } },
      select: { id: true, identifierType: true, normalizedValue: true },
    });
    const identityIdByKey = new Map(identities.map((identity) => [`${identity.identifierType}\u0000${identity.normalizedValue}`, identity.id]));
    if (identityIdByKey.size !== accounts.size + parcels.size) throw new Error('Persisted identities do not match the admitted Account_Parcels snapshot.');

    let observationsCreated = 0;
    const existingObservations = await prisma.propertySourceIdentityObservation.findMany({
      where: { sourcePayloadReference: payloadReference, identity: { sourceId: BOULDER_COUNTY_ASSESSOR_SOURCE_ID, jurisdictionCode: BOULDER_COUNTY_JURISDICTION_CODE } },
      select: { observationFingerprint: true },
    });
    const existingObservationFingerprints = new Set(existingObservations.map((observation) => observation.observationFingerprint));
    for (const [identifierType, identitiesForType] of [
      ['ASSESSOR_ACCOUNT', accounts] as const,
      ['PARCEL', parcels] as const,
    ]) {
      const missingObservations = [...identitiesForType.entries()].filter(([normalizedValue]) =>
        !existingObservationFingerprints.has(boulderCountyObservationFingerprint(snapshot.shape.sourceChecksum, identifierType, normalizedValue)));
      const limit = pLimit(WRITE_CONCURRENCY);
      const results = await Promise.all(chunks(missingObservations).map((group) => limit(() => prisma.propertySourceIdentityObservation.createMany({
          data: group.map(([normalizedValue, sourceValue]) => ({
            identityId: identityIdByKey.get(`${identifierType}\u0000${normalizedValue}`)!,
            sourceRecordReference: `${BOULDER_COUNTY_ACCOUNT_PARCELS_DATASET}#${identifierType}:${sourceValue}`,
            fieldSemanticsReference: FIELD_SEMANTICS_REFERENCE,
            rightsPostureReference: BOULDER_COUNTY_IDENTITY_RIGHTS_POSTURE,
            attributionReference: ATTRIBUTION_REFERENCE,
            sourcePayloadReference: payloadReference,
            freshness: 'FRESH',
            confidence: 'SOURCE_REPORTED',
            observedAt: retrievedAt,
            ingestedAt: retrievedAt,
            observationFingerprint: boulderCountyObservationFingerprint(snapshot.shape.sourceChecksum, identifierType, normalizedValue),
          })),
          skipDuplicates: true,
        }))));
      observationsCreated += results.reduce((total, result) => total + result.count, 0);
    }

    const observations = await prisma.propertySourceIdentityObservation.findMany({
      where: { sourcePayloadReference: payloadReference, identity: { sourceId: BOULDER_COUNTY_ASSESSOR_SOURCE_ID, jurisdictionCode: BOULDER_COUNTY_JURISDICTION_CODE } },
      select: { id: true, identity: { select: { identifierType: true, normalizedValue: true } } },
    });
    const observationIdByKey = new Map(observations.map((observation) => [`${observation.identity.identifierType}\u0000${observation.identity.normalizedValue}`, observation.id]));

    let relationshipsCreated = 0;
    const existingRelationships = await prisma.propertySourceIdentityRelationship.findMany({
      where: {
        relationshipType: 'ACCOUNT_TO_PARCEL',
        sourceIdentity: { sourceId: BOULDER_COUNTY_ASSESSOR_SOURCE_ID, jurisdictionCode: BOULDER_COUNTY_JURISDICTION_CODE },
        targetIdentity: { sourceId: BOULDER_COUNTY_ASSESSOR_SOURCE_ID, jurisdictionCode: BOULDER_COUNTY_JURISDICTION_CODE },
      },
      select: { relationshipFingerprint: true },
    });
    const existingRelationshipFingerprints = new Set(existingRelationships.map((relationship) => relationship.relationshipFingerprint));
    const missingRelationships = [...relationships.values()].filter((relationship) =>
      !existingRelationshipFingerprints.has(boulderCountyRelationshipFingerprint(snapshot.shape.sourceChecksum, relationship.accountNormalizedValue, relationship.parcelNormalizedValue)));
    const limit = pLimit(WRITE_CONCURRENCY);
    const relationshipResults = await Promise.all(chunks(missingRelationships).map((group) => limit(() => prisma.propertySourceIdentityRelationship.createMany({
        data: group.map((relationship) => ({
          sourceIdentityId: identityIdByKey.get(`ASSESSOR_ACCOUNT\u0000${relationship.accountNormalizedValue}`)!,
          targetIdentityId: identityIdByKey.get(`PARCEL\u0000${relationship.parcelNormalizedValue}`)!,
          relationshipType: 'ACCOUNT_TO_PARCEL',
          status: 'ACTIVE',
          confidence: 'SOURCE_REPORTED',
          observationId: observationIdByKey.get(`ASSESSOR_ACCOUNT\u0000${relationship.accountNormalizedValue}`)!,
          isCurrent: true,
          relationshipFingerprint: boulderCountyRelationshipFingerprint(snapshot.shape.sourceChecksum, relationship.accountNormalizedValue, relationship.parcelNormalizedValue),
        })),
        skipDuplicates: true,
      }))));
    relationshipsCreated += relationshipResults.reduce((total, result) => total + result.count, 0);

    console.log(JSON.stringify({
      status: 'BOULDER_COUNTY_ACCOUNT_PARCEL_IDENTITIES_POPULATED',
      sourceUrl,
      sourceChecksum: snapshot.shape.sourceChecksum,
      sourceShape: snapshot.shape,
      identitiesCreated,
      observationsCreated,
      relationshipsCreated,
      mappingsCreated: 0,
      mappingDisposition: 'NO_MAPPING_CANDIDATES: admitted dataset has no non-owner situs-address or unit evidence',
    }));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Boulder County identity population failed.');
  process.exitCode = 1;
});
