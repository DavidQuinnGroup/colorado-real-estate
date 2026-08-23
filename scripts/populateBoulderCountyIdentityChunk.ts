import fs from 'node:fs';
import path from 'node:path';

import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

import {
  BOULDER_COUNTY_ACCOUNT_PARCELS_DATASET,
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
const FIELD_SEMANTICS_REFERENCE = 'BOULDER_COUNTY_PROPERTY_DATA_DOWNLOAD_HELP:strap=account;Parcelno=12-character-text-parcel';
const ATTRIBUTION_REFERENCE = 'BOULDER_COUNTY_ASSESSOR_ATTRIBUTION_REQUIRED_NON_ENDORSEMENT';
type Stage = 'accounts' | 'parcels' | 'account-observations' | 'parcel-observations' | 'relationships';

const argumentValue = (name: string): string | null => {
  const index = process.argv.indexOf(name);
  return index < 0 ? null : process.argv[index + 1] ?? null;
};

async function main(): Promise<void> {
  const sourceFile = argumentValue('--source-file');
  const stage = argumentValue('--stage') as Stage | null;
  const chunkIndex = Number(argumentValue('--chunk'));
  if (!sourceFile || !stage || !Number.isInteger(chunkIndex) || chunkIndex < 0) throw new Error('Usage: jiti scripts/populateBoulderCountyIdentityChunk.ts --source-file <file> --stage <stage> --chunk <zero-based-index>');
  if (!['accounts', 'parcels', 'account-observations', 'parcel-observations', 'relationships'].includes(stage)) throw new Error('Unsupported bounded population stage.');
  if (!process.argv.includes('--execute-governed-identity-import')) {
    throw new Error('Database population is disabled until Supabase recovery and a separate authorized execution.');
  }

  const snapshot = parseBoulderCountyAccountParcelsCsv(fs.readFileSync(path.resolve(sourceFile), 'utf8'));
  const retrievedAt = new Date();
  const payloadReference = `sha256:${snapshot.shape.sourceChecksum};dataset:${BOULDER_COUNTY_ACCOUNT_PARCELS_DATASET}`;
  const accounts = new Map<string, string>();
  const parcels = new Map<string, string>();
  const relationships = new Map<string, { accountNormalizedValue: string; parcelNormalizedValue: string }>();
  for (const row of snapshot.rows) {
    accounts.set(row.accountNormalizedValue, row.accountSourceValue);
    if (row.parcelNormalizedValue && row.parcelSourceValue) {
      parcels.set(row.parcelNormalizedValue, row.parcelSourceValue);
      relationships.set(`${row.accountNormalizedValue}\u0000${row.parcelNormalizedValue}`, { accountNormalizedValue: row.accountNormalizedValue, parcelNormalizedValue: row.parcelNormalizedValue });
    }
  }

  const allValues = stage === 'accounts' || stage === 'account-observations'
    ? [...accounts.entries()]
    : stage === 'parcels' || stage === 'parcel-observations'
      ? [...parcels.entries()]
      : [...relationships.values()];
  const values = allValues.slice(chunkIndex * CHUNK_SIZE, (chunkIndex + 1) * CHUNK_SIZE);
  if (!values.length) {
    console.log(JSON.stringify({ stage, chunkIndex, status: 'EMPTY_CHUNK' }));
    return;
  }

  const prisma = new PrismaClient();
  try {
    let created = 0;
    if (stage === 'accounts' || stage === 'parcels') {
      const identifierType = stage === 'accounts' ? 'ASSESSOR_ACCOUNT' : 'PARCEL';
      const result = await prisma.propertySourceIdentity.createMany({
        data: (values as [string, string][]).map(([normalizedValue, sourceValue]) => ({
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
      });
      created = result.count;
    } else if (stage === 'account-observations' || stage === 'parcel-observations') {
      const identifierType = stage === 'account-observations' ? 'ASSESSOR_ACCOUNT' : 'PARCEL';
      const entries = values as [string, string][];
      const identities = await prisma.propertySourceIdentity.findMany({
        where: { sourceId: BOULDER_COUNTY_ASSESSOR_SOURCE_ID, jurisdictionCode: BOULDER_COUNTY_JURISDICTION_CODE, identifierType, normalizedValue: { in: entries.map(([normalizedValue]) => normalizedValue) } },
        select: { id: true, normalizedValue: true },
      });
      const identityIds = new Map(identities.map((identity) => [identity.normalizedValue, identity.id]));
      if (identityIds.size !== entries.length) throw new Error('Identity chunk is incomplete; observations cannot be populated.');
      const result = await prisma.propertySourceIdentityObservation.createMany({
        data: entries.map(([normalizedValue, sourceValue]) => ({
          identityId: identityIds.get(normalizedValue)!,
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
      });
      created = result.count;
    } else {
      const entries = values as { accountNormalizedValue: string; parcelNormalizedValue: string }[];
      const [accountIdentities, parcelIdentities] = await Promise.all([
        prisma.propertySourceIdentity.findMany({ where: { sourceId: BOULDER_COUNTY_ASSESSOR_SOURCE_ID, jurisdictionCode: BOULDER_COUNTY_JURISDICTION_CODE, identifierType: 'ASSESSOR_ACCOUNT', normalizedValue: { in: entries.map((entry) => entry.accountNormalizedValue) } }, select: { id: true, normalizedValue: true } }),
        prisma.propertySourceIdentity.findMany({ where: { sourceId: BOULDER_COUNTY_ASSESSOR_SOURCE_ID, jurisdictionCode: BOULDER_COUNTY_JURISDICTION_CODE, identifierType: 'PARCEL', normalizedValue: { in: entries.map((entry) => entry.parcelNormalizedValue) } }, select: { id: true, normalizedValue: true } }),
      ]);
      const accountIds = new Map(accountIdentities.map((identity) => [identity.normalizedValue, identity.id]));
      const parcelIds = new Map(parcelIdentities.map((identity) => [identity.normalizedValue, identity.id]));
      const observations = await prisma.propertySourceIdentityObservation.findMany({
        where: { sourcePayloadReference: payloadReference, identityId: { in: accountIdentities.map((identity) => identity.id) } },
        select: { id: true, identity: { select: { normalizedValue: true } } },
      });
      const observationIds = new Map(observations.map((observation) => [observation.identity.normalizedValue, observation.id]));
      if (accountIds.size !== entries.length || parcelIds.size !== entries.length || observationIds.size !== entries.length) throw new Error('Relationship chunk lacks its required identity or observation evidence.');
      const result = await prisma.propertySourceIdentityRelationship.createMany({
        data: entries.map((entry) => ({
          sourceIdentityId: accountIds.get(entry.accountNormalizedValue)!,
          targetIdentityId: parcelIds.get(entry.parcelNormalizedValue)!,
          relationshipType: 'ACCOUNT_TO_PARCEL',
          status: 'ACTIVE',
          confidence: 'SOURCE_REPORTED',
          observationId: observationIds.get(entry.accountNormalizedValue)!,
          isCurrent: true,
          relationshipFingerprint: boulderCountyRelationshipFingerprint(snapshot.shape.sourceChecksum, entry.accountNormalizedValue, entry.parcelNormalizedValue),
        })),
        skipDuplicates: true,
      });
      created = result.count;
    }
    console.log(JSON.stringify({ stage, chunkIndex, chunkSize: values.length, created, status: 'COMPLETE' }));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Boulder County identity chunk population failed.');
  process.exitCode = 1;
});
