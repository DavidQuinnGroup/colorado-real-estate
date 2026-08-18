import {
  getPublicSourceRegistryRecords,
  type ReieCustomerSourceStatus,
  type ReieSourceRegistryRecord,
} from './sourceRegistry';

export const COLORADO_SOURCE_TRUST_EXPERIENCE_STATUS = 'COLORADO_SOURCE_TRUST_EXPERIENCE_IMPLEMENTED';

export type ColoradoSourceTrustCustomerStatus =
  | 'IN USE'
  | 'BEING EVALUATED'
  | 'AWAITING SOURCE CONFIRMATION'
  | 'LIMITED / MANUAL ACCESS'
  | 'NOT CURRENTLY AVAILABLE'
  | 'RESTRICTED'
  | 'REIE CALCULATION';

export type ColoradoSourceCoverageDomain =
  | 'ASSESSOR / PROPERTY RECORDS'
  | 'GIS / PARCEL'
  | 'TREASURER / TAX'
  | 'BUILDING / PERMITS'
  | 'MLS'
  | 'MARKET / STATISTICAL'
  | 'OTHER AUTHORITATIVE SOURCES';

export type ColoradoSourceTrustRecord = Readonly<{
  sourceId: string;
  sourceName: string;
  responsibleAgency: string;
  sourceType: string;
  geographicCoverage: string;
  domains: readonly string[];
  customerStatus: ColoradoSourceTrustCustomerStatus;
  currentReieUseStatus: string;
  officialSourceLink: string | null;
  freshness: string;
  whatItSupports: string;
  limitations: readonly string[];
  attributionDisclaimer: string;
  verifyAtSource: string;
  isInUse: boolean;
}>;

export type ColoradoCountySourceCoverage = Readonly<{
  county: string;
  customerStatus: ColoradoSourceTrustCustomerStatus;
  domains: readonly ColoradoSourceCoverageDomain[];
  sourceNames: readonly string[];
  officialSourceLinks: readonly string[];
  freshness: string;
  limitations: readonly string[];
  currentReieUse: string;
  isIntegrated: boolean;
}>;

export type ColoradoSourceTrustExperience = Readonly<{
  status: typeof COLORADO_SOURCE_TRUST_EXPERIENCE_STATUS;
  sourceRecords: readonly ColoradoSourceTrustRecord[];
  countyCoverage: readonly ColoradoCountySourceCoverage[];
  statusLegend: readonly { status: ColoradoSourceTrustCustomerStatus; explanation: string }[];
  methodology: readonly string[];
  protectedBoundaries: {
    providerActivation: false;
    sourceActivation: false;
    countyDataAcquisition: false;
    publicRecordRetrieval: false;
    statewideCountyIngestion: false;
    prismaChange: false;
    telemetry: false;
    customerDataMutation: false;
    scoring: false;
  };
}>;

const COLORADO_COUNTIES = Object.freeze([
  'Adams',
  'Alamosa',
  'Arapahoe',
  'Archuleta',
  'Baca',
  'Bent',
  'Boulder',
  'Broomfield',
  'Chaffee',
  'Cheyenne',
  'Clear Creek',
  'Conejos',
  'Costilla',
  'Crowley',
  'Custer',
  'Delta',
  'Denver',
  'Dolores',
  'Douglas',
  'Eagle',
  'El Paso',
  'Elbert',
  'Fremont',
  'Garfield',
  'Gilpin',
  'Grand',
  'Gunnison',
  'Hinsdale',
  'Huerfano',
  'Jackson',
  'Jefferson',
  'Kiowa',
  'Kit Carson',
  'La Plata',
  'Lake',
  'Larimer',
  'Las Animas',
  'Lincoln',
  'Logan',
  'Mesa',
  'Mineral',
  'Moffat',
  'Montezuma',
  'Montrose',
  'Morgan',
  'Otero',
  'Ouray',
  'Park',
  'Phillips',
  'Pitkin',
  'Prowers',
  'Pueblo',
  'Rio Blanco',
  'Rio Grande',
  'Routt',
  'Saguache',
  'San Juan',
  'San Miguel',
  'Sedgwick',
  'Summit',
  'Teller',
  'Washington',
  'Weld',
  'Yuma',
] as const);

function statusFromRecord(record: ReieSourceRegistryRecord): ColoradoSourceTrustCustomerStatus {
  if (record.productionActivationState === 'ACTIVE_AUTHORIZED') return 'IN USE';
  if (record.productionActivationState === 'REIE_DERIVED') return 'REIE CALCULATION';
  if (record.productionActivationState === 'AWAITING_PROVIDER_CONFIRMATION') return 'AWAITING SOURCE CONFIRMATION';
  if (record.productionActivationState === 'AUTHORIZED_NOT_ACTIVE') return 'BEING EVALUATED';
  if (record.productionActivationState === 'REFERENCE_ONLY') return 'LIMITED / MANUAL ACCESS';
  if (record.productionActivationState === 'TECHNICAL_CONFIRMATION_REQUIRED') return 'BEING EVALUATED';
  if (record.productionActivationState === 'TERMS_REVIEW_REQUIRED') return 'BEING EVALUATED';
  return 'RESTRICTED';
}

function domainFromRecord(record: ReieSourceRegistryRecord): ColoradoSourceCoverageDomain {
  if (record.category === 'COUNTY_ASSESSOR') return 'ASSESSOR / PROPERTY RECORDS';
  if (record.category === 'COUNTY_TREASURER_TAX') return 'TREASURER / TAX';
  if (record.category === 'BUILDING_PERMITS') return 'BUILDING / PERMITS';
  if (record.category === 'BCOD_ADDRESS_POINTS' || record.category === 'BCOD_PARK_BOUNDARIES') return 'GIS / PARCEL';
  if (record.category === 'MLS_LISTING_DATA') return 'MLS';
  if (record.category === 'MUNICIPAL_PLANNING') return 'MARKET / STATISTICAL';
  return 'OTHER AUTHORITATIVE SOURCES';
}

function sourceType(record: ReieSourceRegistryRecord): string {
  return record.sourceClass.replace(/_/g, ' ').toLowerCase();
}

function summarizeReieUse(record: ReieSourceRegistryRecord, status: ColoradoSourceTrustCustomerStatus): string {
  if (status === 'IN USE') return 'Currently used where existing certified repository evidence supports the claim.';
  if (status === 'REIE CALCULATION') return 'Currently used as a labeled REIE calculation or synthesis, not as an external source record.';
  if (status === 'AWAITING SOURCE CONFIRMATION') return 'Identified for customer-safe transparency only; not used as active customer evidence.';
  if (status === 'RESTRICTED') return 'Not currently used as customer evidence.';
  return record.currentReieUse;
}

export function buildColoradoSourceTrustExperience(): ColoradoSourceTrustExperience {
  const records = getPublicSourceRegistryRecords();
  const sourceRecords = records.map((record): ColoradoSourceTrustRecord => {
    const customerStatus = statusFromRecord(record);

    return {
      sourceId: record.sourceId,
      sourceName: record.publicName,
      responsibleAgency: record.responsibleOrganization,
      sourceType: sourceType(record),
      geographicCoverage: record.jurisdiction.coverage,
      domains: record.domains,
      customerStatus,
      currentReieUseStatus: summarizeReieUse(record, customerStatus),
      officialSourceLink: record.officialUrl,
      freshness: `${record.updateCadence}; ${record.freshnessExpectation}`,
      whatItSupports: record.currentReieUse,
      limitations: record.limitations.slice(0, 4),
      attributionDisclaimer: record.attributionRequirement,
      verifyAtSource: record.officialUrl ? 'Open the official source before relying on current details.' : 'Use the visible REIE limitation and verify with the responsible source or professional before relying on it.',
      isInUse: customerStatus === 'IN USE' || customerStatus === 'REIE CALCULATION',
    };
  });

  const countyCoverage = COLORADO_COUNTIES.map((county): ColoradoCountySourceCoverage => {
    const countyRecords = records.filter((record) => record.jurisdiction.county === `${county} County`);
    const domains = [...new Set(countyRecords.map(domainFromRecord))];
    const officialSourceLinks = [...new Set(countyRecords.map((record) => record.officialUrl).filter((url): url is string => Boolean(url)))];
    const hasActive = countyRecords.some((record) => statusFromRecord(record) === 'IN USE');
    const hasAwaiting = countyRecords.some((record) => statusFromRecord(record) === 'AWAITING SOURCE CONFIRMATION');
    const hasRestricted = countyRecords.some((record) => statusFromRecord(record) === 'RESTRICTED');
    const status: ColoradoSourceTrustCustomerStatus = hasActive
      ? 'IN USE'
      : hasAwaiting
        ? 'AWAITING SOURCE CONFIRMATION'
        : hasRestricted
          ? 'RESTRICTED'
          : 'NOT CURRENTLY AVAILABLE';

    return {
      county,
      customerStatus: status,
      domains,
      sourceNames: countyRecords.map((record) => record.publicName),
      officialSourceLinks,
      freshness: countyRecords.length ? 'Record-specific; verify at source before relying on current details.' : 'No certified customer-facing county source record is available.',
      limitations: countyRecords.length
        ? [
            'County source availability does not mean county source integration.',
            'Source gaps are neutral and do not indicate property quality, condition, safety, or desirability.',
          ]
        : ['No customer-facing county source record is currently certified for REIE use.'],
      currentReieUse: countyRecords.length ? 'Customer-safe source transparency only unless the source is explicitly marked IN USE.' : 'Not currently used.',
      isIntegrated: hasActive,
    };
  });

  return {
    status: COLORADO_SOURCE_TRUST_EXPERIENCE_STATUS,
    sourceRecords,
    countyCoverage,
    statusLegend: [
      { status: 'IN USE', explanation: 'Certified active source used only where existing evidence supports the customer-facing claim.' },
      { status: 'BEING EVALUATED', explanation: 'Identified or authorized for review, but not active customer evidence.' },
      { status: 'AWAITING SOURCE CONFIRMATION', explanation: 'Responsible source confirmation is required before REIE can treat it as active evidence.' },
      { status: 'LIMITED / MANUAL ACCESS', explanation: 'Useful for orientation or manual verification, not an automated evidence feed.' },
      { status: 'NOT CURRENTLY AVAILABLE', explanation: 'No certified customer-facing source record is available for this county or domain.' },
      { status: 'RESTRICTED', explanation: 'Not authorized for current customer evidence or integration.' },
      { status: 'REIE CALCULATION', explanation: 'A labeled REIE calculation or synthesis from stated inputs and visible evidence.' },
    ],
    methodology: [
      'REIE combines authoritative public records, listing information, market and statistical sources, calculated context, and clearly labeled assumptions.',
      'Source identity, geography, period, freshness, and limitations affect claim strength.',
      'Important information may require independent verification at the responsible source.',
      'REIE does not guarantee government, professional, or third-party data.',
      'SOURCE AVAILABILITY does not equal property quality.',
      'MISSING COUNTY DATA does not equal negative property condition.',
      'MORE AVAILABLE DATA does not mean a better property.',
    ],
    protectedBoundaries: {
      providerActivation: false,
      sourceActivation: false,
      countyDataAcquisition: false,
      publicRecordRetrieval: false,
      statewideCountyIngestion: false,
      prismaChange: false,
      telemetry: false,
      customerDataMutation: false,
      scoring: false,
    },
  };
}

export function getCustomerSourceStatusLabel(status: ReieCustomerSourceStatus): ColoradoSourceTrustCustomerStatus {
  if (status === 'Active') return 'IN USE';
  if (status === 'Authorized / not yet active') return 'BEING EVALUATED';
  if (status === 'Awaiting confirmation') return 'AWAITING SOURCE CONFIRMATION';
  if (status === 'Reference only') return 'LIMITED / MANUAL ACCESS';
  if (status === 'REIE calculation') return 'REIE CALCULATION';
  if (status === 'Blocked / not authorized') return 'RESTRICTED';
  return 'BEING EVALUATED';
}
