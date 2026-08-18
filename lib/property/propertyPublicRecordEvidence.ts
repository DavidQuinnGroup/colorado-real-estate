import { COLORADO_CITY_INTELLIGENCE_RECORDS } from '../coloradoCityIntelligenceFactory';

export const AUTHORITATIVE_PROPERTY_RECORD_INTELLIGENCE_STATUS =
  'AUTHORITATIVE_PROPERTY_RECORD_INTELLIGENCE_ARCHITECTURE_READY_SOURCE_CONFIRMATION_REQUIRED';
export const AUTHORITATIVE_PROPERTY_RECORD_INTELLIGENCE_VERSION = '1.0.0';

export type PropertyRecordDomain = 'ASSESSOR' | 'TAX' | 'PERMIT';

export type PropertyRecordDomainDisposition =
  | 'IMPLEMENTED_WITH_AUTHORIZED_SOURCE'
  | 'ARCHITECTURE_READY_SOURCE_CONFIRMATION_REQUIRED'
  | 'REMAINS_FAIL_CLOSED';

export type PropertyRecordSourceClassification =
  | 'OFFICIAL_PUBLIC_SOURCE_CANDIDATE'
  | 'TERMS_REVIEW_REQUIRED'
  | 'TECHNICAL_CONFIRMATION_REQUIRED'
  | 'JURISDICTION_SOURCE_CONFIRMATION_REQUIRED';

export type PropertyRecordSourceCandidate = {
  sourceName: string;
  jurisdiction: string;
  locator: string;
  classification: PropertyRecordSourceClassification;
  sourceObservation: string;
  blocker: string;
};

export type PropertyRecordDomainProfile = {
  domain: PropertyRecordDomain;
  label: string;
  implementationDisposition: PropertyRecordDomainDisposition;
  claimEligible: false;
  propertyEvidenceAvailable: false;
  jurisdiction: string;
  evidenceFingerprint: string;
  candidates: PropertyRecordSourceCandidate[];
  verificationRequirement: string;
  customerUse: string;
};

export type PropertyPublicRecordEvidenceProfile = {
  status: typeof AUTHORITATIVE_PROPERTY_RECORD_INTELLIGENCE_STATUS;
  version: typeof AUTHORITATIVE_PROPERTY_RECORD_INTELLIGENCE_VERSION;
  jurisdictionCertainty: 'SINGLE_COUNTY_FROM_GOVERNED_CITY_RECORD' | 'REQUIRES_MANUAL_JURISDICTION_CONFIRMATION';
  propertyCorrelation: {
    availableIdentifiers: string[];
    missingIdentifiers: string[];
    correlationConfidence: 'LIMITED';
    limitation: string;
  };
  domainProfiles: PropertyRecordDomainProfile[];
  protectedBoundaries: {
    providerActivation: false;
    externalAcquisition: false;
    recordRetrieval: false;
    bulkRecordIngestion: false;
    persistence: false;
    prismaChange: false;
    customerRecordDisplay: false;
    ownerIdentityDisplay: false;
    telemetry: false;
    customerDataMutation: false;
  };
};

export type PropertyPublicRecordEvidenceInput = {
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  neighborhood?: string | null;
  subdivision?: string | null;
  yearBuilt?: number | null;
  lotSize?: number | null;
};

function normalizeCityKey(city: string | null | undefined) {
  return city?.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') ?? '';
}

function resolveJurisdiction(input: PropertyPublicRecordEvidenceInput) {
  const cityKey = normalizeCityKey(input.city);
  const cityRecord = cityKey
    ? COLORADO_CITY_INTELLIGENCE_RECORDS.find((record) => record.cityKey === cityKey || normalizeCityKey(record.canonicalName) === cityKey)
    : null;
  const counties = cityRecord?.geographic.county ?? [];

  if (counties.length === 1) {
    return {
      jurisdiction: counties[0],
      certainty: 'SINGLE_COUNTY_FROM_GOVERNED_CITY_RECORD' as const,
    };
  }

  return {
    jurisdiction: input.city?.trim() ? `${input.city.trim()} jurisdiction review` : 'Colorado jurisdiction review',
    certainty: 'REQUIRES_MANUAL_JURISDICTION_CONFIRMATION' as const,
  };
}

function stableFingerprint(values: string[]) {
  const joined = values
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
    .sort()
    .join('|');

  let hash = 5381;
  for (const char of joined) {
    hash = ((hash << 5) + hash + char.charCodeAt(0)) >>> 0;
  }

  return `pr-${hash.toString(16).padStart(8, '0')}`;
}

function availableIdentifiers(input: PropertyPublicRecordEvidenceInput) {
  return [
    input.address ? 'property address' : null,
    input.city ? 'city' : null,
    input.state ? 'state' : null,
    input.zip ? 'ZIP code' : null,
    input.neighborhood ? 'neighborhood' : null,
    input.subdivision ? 'subdivision' : null,
    input.yearBuilt ? 'year built' : null,
    input.lotSize ? 'lot size' : null,
  ].filter((value): value is string => Boolean(value));
}

function boulderCountyProfiles(jurisdiction: string): Record<PropertyRecordDomain, PropertyRecordSourceCandidate[]> {
  return {
    ASSESSOR: [
      {
        sourceName: 'Boulder County Assessor Property Search',
        jurisdiction,
        locator: 'https://maps.bouldercounty.org/boco/PropertySearch/?page=Home',
        classification: 'TERMS_REVIEW_REQUIRED',
        sourceObservation:
          'Official county search supports property lookup paths such as address, parcel, account, subdivision, and related property-detail fields.',
        blocker:
          'Permitted use, display, retention, field mapping, and property-correlation authority are not confirmed for customer-facing use.',
      },
      {
        sourceName: 'Boulder County Assessor public data tables',
        jurisdiction,
        locator: 'https://bouldercounty.gov/property-and-land/assessor/data-download/',
        classification: 'TERMS_REVIEW_REQUIRED',
        sourceObservation:
          'Official county materials describe recurring public assessor data tables for accounts, parcels, buildings, land, permits, sales, tax areas, and values.',
        blocker:
          'The county disclaimer and repository boundaries require provider confirmation before ingestion, retention, transformation, or customer display.',
      },
    ],
    TAX: [
      {
        sourceName: 'Boulder County Treasurer property tax lookup',
        jurisdiction,
        locator: 'https://bouldercounty.gov/departments/treasurer/',
        classification: 'TERMS_REVIEW_REQUIRED',
        sourceObservation:
          'Official treasurer materials identify property-tax lookup and payment paths for real property, mobile homes, and business personal property.',
        blocker:
          'Tax amounts, account matching, current payoff status, special assessments, and display rights require current source confirmation.',
      },
      {
        sourceName: 'Boulder County Treasurer EagleWeb',
        jurisdiction,
        locator: 'https://treasurer.bouldercounty.org/treasurer/treasurerweb/',
        classification: 'TECHNICAL_CONFIRMATION_REQUIRED',
        sourceObservation:
          'The official tax lookup path is application mediated and may require browser state, precise identifiers, and source-specific terms review.',
        blocker:
          'No repository adapter is authorized to query, store, transform, or display tax records from this source.',
      },
    ],
    PERMIT: [
      {
        sourceName: 'City of Boulder building permits and inspections',
        jurisdiction: 'City of Boulder',
        locator: 'https://bouldercolorado.gov/services/building-permits-and-inspections',
        classification: 'TECHNICAL_CONFIRMATION_REQUIRED',
        sourceObservation:
          'Official city materials identify a path for previous permit and property-information searches through the customer self-service portal.',
        blocker:
          'Municipal boundary, permit-field mapping, portal behavior, terms, and display authorization require source confirmation.',
      },
      {
        sourceName: 'Boulder County Accela Citizen Access Building',
        jurisdiction,
        locator: 'https://accelapublicdev.bouldercounty.org/CitizenAccess/Cap/CapHome.aspx?TabName=Home&module=Building',
        classification: 'TECHNICAL_CONFIRMATION_REQUIRED',
        sourceObservation:
          'Official county permit-search surface references site address, parcel number, permit number, permit type, and contractor search paths.',
        blocker:
          'Portal reliability, jurisdiction split, source terms, and customer-display authorization remain unconfirmed.',
      },
    ],
  };
}

function fallbackCandidate(domain: PropertyRecordDomain, jurisdiction: string): PropertyRecordSourceCandidate {
  return {
    sourceName: `${jurisdiction} ${domain.toLowerCase()} source confirmation`,
    jurisdiction,
    locator: 'SOURCE_CONFIRMATION_REQUIRED',
    classification: 'JURISDICTION_SOURCE_CONFIRMATION_REQUIRED',
    sourceObservation: 'The repository can route this domain through governed architecture, but no authorized source is confirmed for this jurisdiction.',
    blocker: 'Confirm official source, terms, identifiers, field mapping, retention, display, and technical access before use.',
  };
}

function buildDomainProfile(domain: PropertyRecordDomain, jurisdiction: string, candidates: PropertyRecordSourceCandidate[]): PropertyRecordDomainProfile {
  const labelByDomain: Record<PropertyRecordDomain, string> = {
    ASSESSOR: 'Assessor and parcel records',
    TAX: 'Tax and ownership-cost records',
    PERMIT: 'Permit and construction records',
  };
  const verificationByDomain: Record<PropertyRecordDomain, string> = {
    ASSESSOR: 'Confirm official assessor source rights, parcel/account correlation fields, display limits, and retention rules.',
    TAX: 'Confirm official treasurer source rights, tax-account correlation fields, freshness, display limits, and payoff limitations.',
    PERMIT: 'Confirm municipal or county permit jurisdiction, search fields, portal behavior, source rights, and display limits.',
  };

  return {
    domain,
    label: labelByDomain[domain],
    implementationDisposition: 'ARCHITECTURE_READY_SOURCE_CONFIRMATION_REQUIRED',
    claimEligible: false,
    propertyEvidenceAvailable: false,
    jurisdiction,
    evidenceFingerprint: stableFingerprint([domain, jurisdiction, ...candidates.map((candidate) => candidate.sourceName)]),
    candidates,
    verificationRequirement: verificationByDomain[domain],
    customerUse: 'Use as a records-question prompt only; do not present source facts as verified for this property.',
  };
}

export function buildPropertyPublicRecordEvidenceProfile(
  input: PropertyPublicRecordEvidenceInput,
): PropertyPublicRecordEvidenceProfile {
  const jurisdiction = resolveJurisdiction(input);
  const knownBoulderCounty = jurisdiction.jurisdiction === 'Boulder County';
  const candidates = knownBoulderCounty ? boulderCountyProfiles(jurisdiction.jurisdiction) : null;

  return {
    status: AUTHORITATIVE_PROPERTY_RECORD_INTELLIGENCE_STATUS,
    version: AUTHORITATIVE_PROPERTY_RECORD_INTELLIGENCE_VERSION,
    jurisdictionCertainty: jurisdiction.certainty,
    propertyCorrelation: {
      availableIdentifiers: availableIdentifiers(input),
      missingIdentifiers: ['parcel number', 'assessor account number', 'tax account id', 'permit number'],
      correlationConfidence: 'LIMITED',
      limitation:
        'Existing listing fields can route record questions, but they do not establish a verified parcel, tax account, permit record, owner identity, or legal property record.',
    },
    domainProfiles: (['ASSESSOR', 'TAX', 'PERMIT'] as const).map((domain) =>
      buildDomainProfile(domain, jurisdiction.jurisdiction, candidates?.[domain] ?? [fallbackCandidate(domain, jurisdiction.jurisdiction)]),
    ),
    protectedBoundaries: {
      providerActivation: false,
      externalAcquisition: false,
      recordRetrieval: false,
      bulkRecordIngestion: false,
      persistence: false,
      prismaChange: false,
      customerRecordDisplay: false,
      ownerIdentityDisplay: false,
      telemetry: false,
      customerDataMutation: false,
    },
  };
}
