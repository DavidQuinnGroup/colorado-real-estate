import { createHash } from 'node:crypto';

export const BOULDER_COUNTY_ASSESSOR_SOURCE_ID = 'SRC-BOULDER-COUNTY-ASSESSOR' as const;
export const BOULDER_COUNTY_JURISDICTION_CODE = 'US-CO-BOULDER' as const;
export const BOULDER_COUNTY_ACCOUNT_PARCELS_URL = 'https://assessor.boco.solutions/ASR_PublicDataFiles/Account_Parcels.csv' as const;
export const BOULDER_COUNTY_ACCOUNT_PARCELS_DATASET = 'Account_Parcels.csv' as const;
export const BOULDER_COUNTY_IDENTITY_RIGHTS_POSTURE = 'RECONCILED_FOR_COVERED_BOULDER_OPEN_DATA' as const;
export const BOULDER_COUNTY_IDENTITY_ACTIVATION = 'AUTHORIZED_FOR_BOUNDED_ACCOUNT_PARCEL_IDENTITY_USE' as const;
export const BOULDER_COUNTY_IDENTITY_DATABASE_POPULATION_STATUS = 'PENDING_SUPABASE_RECOVERY' as const;

export const BOULDER_COUNTY_ACCOUNT_PARCELS_OFFICIAL_EVIDENCE = Object.freeze({
  status: 'BOULDER_COUNTY_OPEN_DATA_RIGHTS_AND_IDENTITY_SOURCE_CERTIFIED',
  observedAndReconciledAt: '2026-08-23',
  sourceId: BOULDER_COUNTY_ASSESSOR_SOURCE_ID,
  dataset: BOULDER_COUNTY_ACCOUNT_PARCELS_DATASET,
  datasetUrl: BOULDER_COUNTY_ACCOUNT_PARCELS_URL,
  historicalBroaderAssessorPosture: 'AWAITING_PROVIDER_CONFIRMATION',
  rightsPosture: BOULDER_COUNTY_IDENTITY_RIGHTS_POSTURE,
  identityDatasetPosture: BOULDER_COUNTY_IDENTITY_ACTIVATION,
  technicalAccessPosture: 'OFFICIAL_PUBLIC_BULK_DOWNLOAD_PUBLISHED',
  runtimeActivation: 'NOT_ACTIVE',
  databasePopulation: BOULDER_COUNTY_IDENTITY_DATABASE_POPULATION_STATUS,
  propertyFactAdmission: 'NOT_AUTHORIZED_SEPARATE_GATE',
  customerDisplay: 'NOT_AUTHORIZED_SEPARATE_GATE',
  publicDisplay: 'NOT_AUTHORIZED_SEPARATE_GATE',
  ownerData: 'EXCLUDED',
  officialSources: Object.freeze({
    termsOfUse: 'https://bouldercounty.gov/government/open-data/terms-of-use/',
    openDataPolicy: 'https://bouldercounty.gov/government/open-data/open-data-policy/',
    assessorDataDownload: 'https://bouldercounty.gov/property-and-land/assessor/data-download/',
    assessorFieldDocumentation: 'https://bouldercounty.gov/property-and-land/assessor/sales/codes-and-descriptions/',
    dataDownloadHelpManual: 'https://assets.bouldercounty.gov/wp-content/uploads/2017/02/ar-property-data-download-help.pdf',
  }),
  attribution: 'Boulder County Assessor; Account_Parcels.csv; source record date when available; ATLAS observedAt and ingestedAt.',
  nonEndorsement: 'Use must not imply Boulder County endorsement.',
  relianceDisclaimer: 'County accuracy, completeness, reliability, suitability, and user-reliance disclaimers remain attached to every use.',
  freshness: 'Published data refreshes daily at approximately 4 a.m.; the manual describes nightly updates. Preserve source date or CreatedDate when available without inventing an expiry period.',
  identifierSemantics: 'strap is the assessor account identifier. Parcelno or folio is a 12-character textual parcel identifier that can contain letters.',
  scopeLimitations: Object.freeze([
    'Account and parcel identifiers plus their reported relationships only.',
    'No Owners and Addresses retrieval, owner names, mailing addresses, targeting, profiling, ownership inference, or ownership guarantee.',
    'No property facts, valuation, sales, permits, tax, title, legal-description, GIS geometry, property mapping, Search, Map, public route, or customer display authority.',
    'No automatic external retrieval or database population under this certification.',
  ]),
});

export type BoulderCountyAccountParcelRow = Readonly<{
  accountSourceValue: string;
  accountNormalizedValue: string;
  parcelSourceValue: string | null;
  parcelNormalizedValue: string | null;
}>;

export type BoulderCountyAccountParcelShape = Readonly<{
  recordCount: number;
  relationshipRecordCount: number;
  uniqueAccountCount: number;
  uniqueParcelCount: number;
  uniqueRelationshipCount: number;
  duplicateRelationshipCount: number;
  blankAccountCount: number;
  blankParcelCount: number;
  multiParcelAccountCount: number;
  multiAccountParcelCount: number;
  addressAvailability: 'NOT_PRESENT_IN_ADMITTED_DATASET';
  unitAvailability: 'NOT_PRESENT_IN_ADMITTED_DATASET';
  sourceChecksum: string;
}>;

export type BoulderCountyAccountParcelSnapshot = Readonly<{
  rows: readonly BoulderCountyAccountParcelRow[];
  shape: BoulderCountyAccountParcelShape;
}>;

const parseCsvLine = (line: string): string[] => {
  const fields: string[] = [];
  let value = '';
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        value += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === ',' && !quoted) {
      fields.push(value);
      value = '';
    } else {
      value += character;
    }
  }

  if (quoted) throw new Error('Account_Parcels.csv contains an unterminated quoted field.');
  fields.push(value);
  return fields;
};

export const normalizeBoulderCountyAccount = (value: string): string => value.trim().toUpperCase();
export const normalizeBoulderCountyParcel = (value: string): string => value.trim().toUpperCase();

export const fingerprintBoulderCountyIdentity = (...parts: readonly string[]): string =>
  createHash('sha256').update(parts.join('|')).digest('hex');

export function parseBoulderCountyAccountParcelsCsv(contents: string): BoulderCountyAccountParcelSnapshot {
  const lines = contents.split(/\r?\n/).filter((line) => line.length > 0);
  if (lines.length < 2) throw new Error('Account_Parcels.csv must contain a header and at least one record.');

  const header = parseCsvLine(lines[0]).map((field) => field.trim().toLowerCase());
  const accountIndex = header.indexOf('strap');
  const parcelIndex = header.indexOf('parcelno');
  if (header.length !== 2 || accountIndex < 0 || parcelIndex < 0) {
    throw new Error(`Unexpected Account_Parcels.csv header: ${header.join(',')}`);
  }

  const rows: BoulderCountyAccountParcelRow[] = [];
  const accountToParcels = new Map<string, Set<string>>();
  const parcelToAccounts = new Map<string, Set<string>>();
  const relationships = new Set<string>();
  let blankAccountCount = 0;
  let blankParcelCount = 0;

  for (const line of lines.slice(1)) {
    const fields = parseCsvLine(line);
    if (fields.length !== header.length) throw new Error('Account_Parcels.csv record does not match the expected two-column shape.');
    const accountSourceValue = fields[accountIndex].trim();
    const parcelSourceValue = fields[parcelIndex].trim();
    const accountNormalizedValue = normalizeBoulderCountyAccount(accountSourceValue);
    const parcelNormalizedValue = normalizeBoulderCountyParcel(parcelSourceValue);

    if (!accountNormalizedValue) {
      blankAccountCount += 1;
      continue;
    }
    if (!parcelNormalizedValue) {
      blankParcelCount += 1;
      rows.push({ accountSourceValue, accountNormalizedValue, parcelSourceValue: null, parcelNormalizedValue: null });
      if (!accountToParcels.has(accountNormalizedValue)) accountToParcels.set(accountNormalizedValue, new Set());
      continue;
    }
    if (parcelNormalizedValue.length !== 12) {
      throw new Error(`Account_Parcels.csv contains a non-12-character parcel identifier (${parcelNormalizedValue.length}).`);
    }

    rows.push({ accountSourceValue, accountNormalizedValue, parcelSourceValue, parcelNormalizedValue });
    const relationshipKey = `${accountNormalizedValue}\u0000${parcelNormalizedValue}`;
    relationships.add(relationshipKey);
    if (!accountToParcels.has(accountNormalizedValue)) accountToParcels.set(accountNormalizedValue, new Set());
    if (!parcelToAccounts.has(parcelNormalizedValue)) parcelToAccounts.set(parcelNormalizedValue, new Set());
    accountToParcels.get(accountNormalizedValue)?.add(parcelNormalizedValue);
    parcelToAccounts.get(parcelNormalizedValue)?.add(accountNormalizedValue);
  }

  if (blankAccountCount) throw new Error(`Account_Parcels.csv contains blank account identifiers: accounts=${blankAccountCount}.`);

  return Object.freeze({
    rows: Object.freeze(rows),
    shape: Object.freeze({
      recordCount: rows.length,
      relationshipRecordCount: rows.filter((row) => row.parcelNormalizedValue !== null).length,
      uniqueAccountCount: accountToParcels.size,
      uniqueParcelCount: parcelToAccounts.size,
      uniqueRelationshipCount: relationships.size,
      duplicateRelationshipCount: rows.filter((row) => row.parcelNormalizedValue !== null).length - relationships.size,
      blankAccountCount,
      blankParcelCount,
      multiParcelAccountCount: [...accountToParcels.values()].filter((parcels) => parcels.size > 1).length,
      multiAccountParcelCount: [...parcelToAccounts.values()].filter((accounts) => accounts.size > 1).length,
      addressAvailability: 'NOT_PRESENT_IN_ADMITTED_DATASET',
      unitAvailability: 'NOT_PRESENT_IN_ADMITTED_DATASET',
      sourceChecksum: fingerprintBoulderCountyIdentity(contents),
    }),
  });
}

export const boulderCountyObservationFingerprint = (sourceChecksum: string, identifierType: 'ASSESSOR_ACCOUNT' | 'PARCEL', normalizedValue: string): string =>
  fingerprintBoulderCountyIdentity('boulder-county-account-parcels-observation-v1', sourceChecksum, identifierType, normalizedValue);

export const boulderCountyRelationshipFingerprint = (sourceChecksum: string, accountNormalizedValue: string, parcelNormalizedValue: string): string =>
  fingerprintBoulderCountyIdentity('boulder-county-account-parcels-relationship-v1', sourceChecksum, accountNormalizedValue, parcelNormalizedValue);
