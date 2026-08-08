import {
  CITY_INTELLIGENCE_SOURCE_DOMAIN_MATRIX,
  COLORADO_CITY_INTELLIGENCE_RECORDS,
  type CityIntelligenceSourceCategory,
  type CitySourceDomainProfile,
} from '../coloradoCityIntelligenceFactory.js';

export const PROPERTY_GEOGRAPHIC_SOURCE_INTELLIGENCE_STATUS = 'PROPERTY_GEOGRAPHIC_SOURCE_INTELLIGENCE_IMPLEMENTED';
export const PROPERTY_GEOGRAPHIC_SOURCE_INTELLIGENCE_VERSION = '1.0.0';

export type PropertySourceReadiness =
  | 'READY_EXISTING_REPOSITORY_DATA'
  | 'GOVERNED_REFERENCE_ONLY'
  | 'FAIL_CLOSED_REVIEW_REQUIRED'
  | 'BLOCKED_NOT_AUTHORIZED';

export type PropertyAuthoritativeSourceItem = {
  category: CityIntelligenceSourceCategory | 'BCOD_ADDRESS_POINTS' | 'BCOD_PARK_BOUNDARIES';
  label: string;
  readiness: PropertySourceReadiness;
  sourcePath: string;
  evidence: string;
  limitation: string;
  customerUse: string;
  claimEligible: boolean;
};

export type PropertyGeographicSourceIntelligence = {
  status: typeof PROPERTY_GEOGRAPHIC_SOURCE_INTELLIGENCE_STATUS;
  version: typeof PROPERTY_GEOGRAPHIC_SOURCE_INTELLIGENCE_VERSION;
  geography: {
    city: string;
    neighborhood: string | null;
    state: 'Colorado';
    source: 'LISTING_FIELD' | 'UNKNOWN';
  };
  summary: string;
  selectedSources: PropertyAuthoritativeSourceItem[];
  verificationPrompts: string[];
  protectedBoundaries: {
    bcodAddressPoints: false;
    bcodParkBoundaries: false;
    providerActivation: false;
    externalAcquisition: false;
    publicGis: false;
    persistence: false;
    prismaChange: false;
    telemetry: false;
    customerDataMutation: false;
  };
};

export type PropertyGeographicSourceInput = {
  city?: string | null;
  neighborhood?: string | null;
  propertyType?: string | null;
  status?: string | null;
  price?: number | null;
  sqft?: number | null;
  yearBuilt?: number | null;
  lotSize?: number | null;
  soilType?: string | null;
  altitude?: number | null;
  relatedListingCount?: number;
};

function findSourceProfile(category: CityIntelligenceSourceCategory) {
  const profile = CITY_INTELLIGENCE_SOURCE_DOMAIN_MATRIX.find((candidate) => candidate.category === category);
  if (!profile) {
    throw new Error(`Missing City Intelligence source profile: ${category}`);
  }

  return profile;
}

function normalizeCityKey(city: string | null | undefined) {
  return city?.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') ?? '';
}

function cityRecordFor(input: PropertyGeographicSourceInput) {
  const cityKey = normalizeCityKey(input.city);
  if (!cityKey) return null;

  return COLORADO_CITY_INTELLIGENCE_RECORDS.find((record) => record.cityKey === cityKey || normalizeCityKey(record.canonicalName) === cityKey) ?? null;
}

function listingFactSummary(input: PropertyGeographicSourceInput) {
  const facts = [
    input.price ? 'price' : null,
    input.sqft ? 'square footage' : null,
    input.propertyType ? 'property type' : null,
    input.status ? 'listing status' : null,
    input.yearBuilt ? 'year built' : null,
    input.lotSize ? 'lot size' : null,
    input.soilType ? 'soil text' : null,
    input.altitude ? 'elevation context' : null,
  ].filter(Boolean);

  return facts.length
    ? `Existing property route fields expose ${facts.join(', ')}.`
    : 'Existing property route fields are sparse; missing facts remain verification prompts.';
}

function sourceItem({
  profile,
  label,
  readiness,
  evidence,
  limitation,
  customerUse,
  claimEligible,
}: {
  profile: CitySourceDomainProfile;
  label: string;
  readiness: PropertySourceReadiness;
  evidence: string;
  limitation: string;
  customerUse: string;
  claimEligible: boolean;
}): PropertyAuthoritativeSourceItem {
  return {
    category: profile.category,
    label,
    readiness,
    sourcePath: `${profile.category} / ${profile.accessMethod} / ${profile.adapterReadiness}`,
    evidence,
    limitation,
    customerUse,
    claimEligible,
  };
}

function blockedBcodItem(category: 'BCOD_ADDRESS_POINTS' | 'BCOD_PARK_BOUNDARIES'): PropertyAuthoritativeSourceItem {
  const isAddressPoints = category === 'BCOD_ADDRESS_POINTS';

  return {
    category,
    label: isAddressPoints ? 'Boulder County Address Points' : 'Boulder County Park Boundaries',
    readiness: 'BLOCKED_NOT_AUTHORIZED',
    sourcePath: `${category} / PROVIDER_CONFIRMATION_REQUIRED_FIRST`,
    evidence: 'BCOD remains separately gated by provider confirmation and counsel interpretation.',
    limitation: 'No acquisition, API consumption, persistence, transformation, derived intelligence, map rendering, or customer display is authorized.',
    customerUse: 'Do not use for this property experience.',
    claimEligible: false,
  };
}

export function buildPropertyGeographicSourceIntelligence(
  input: PropertyGeographicSourceInput,
): PropertyGeographicSourceIntelligence {
  const cityRecord = cityRecordFor(input);
  const listingProfile = findSourceProfile('MLS_LISTING_DATA');
  const assessorProfile = findSourceProfile('COUNTY_ASSESSOR');
  const taxProfile = findSourceProfile('COUNTY_TREASURER_TAX');
  const permitProfile = findSourceProfile('BUILDING_PERMITS');
  const planningProfile = findSourceProfile('MUNICIPAL_PLANNING');
  const cityLabel = input.city?.trim() || cityRecord?.canonicalName || 'Colorado';
  const neighborhoodLabel = input.neighborhood?.trim() || null;

  const selectedSources: PropertyAuthoritativeSourceItem[] = [
    sourceItem({
      profile: listingProfile,
      label: 'Existing property and listing facts',
      readiness: 'READY_EXISTING_REPOSITORY_DATA',
      evidence: listingFactSummary(input),
      limitation: 'Listing facts can orient review but do not verify condition, value, taxes, title, insurance, permits, or legal status.',
      customerUse: 'Use for public-fact orientation, factual comparison, and deciding which assumptions need verification.',
      claimEligible: true,
    }),
    sourceItem({
      profile: planningProfile,
      label: cityRecord ? `${cityRecord.canonicalName} governed place context` : 'Governed place context',
      readiness: cityRecord ? 'GOVERNED_REFERENCE_ONLY' : 'FAIL_CLOSED_REVIEW_REQUIRED',
      evidence: cityRecord
        ? `${cityRecord.canonicalName} has repository geographic intelligence with ${cityRecord.evidence.length} evidence references and ${cityRecord.freshness} freshness.`
        : 'No matching certified city intelligence record is available for this property city.',
      limitation: cityRecord
        ? 'Place context is city or neighborhood orientation only; it does not establish parcel boundaries, zoning compliance, legal use, safety, or suitability.'
        : 'Without a governed city record, geographic context must remain a search or advisor-review prompt.',
      customerUse: cityRecord
        ? 'Use to route the customer toward market, neighborhood, and verification questions.'
        : 'Use only as a prompt to verify place context through supported routes.',
      claimEligible: Boolean(cityRecord),
    }),
    sourceItem({
      profile: assessorProfile,
      label: 'Assessor and parcel records',
      readiness: 'FAIL_CLOSED_REVIEW_REQUIRED',
      evidence: 'County assessor and parcel source classes exist in geographic intelligence governance but are not activated for this property route.',
      limitation: 'Parcel, owner, assessment, subdivision, boundary, and account-level facts require source, licensing, field, retention, and display review before use.',
      customerUse: 'Carry assessor and parcel questions into professional or source review; do not present parcel facts here.',
      claimEligible: false,
    }),
    sourceItem({
      profile: taxProfile,
      label: 'Tax and ownership-cost records',
      readiness: 'FAIL_CLOSED_REVIEW_REQUIRED',
      evidence: 'County treasurer tax records are a governed future source category, not an activated customer-facing property feed.',
      limitation: 'Tax amounts, transfer effects, special assessments, and ownership-cost facts require current source or professional verification.',
      customerUse: 'Treat taxes and ownership costs as verification questions, not conclusions.',
      claimEligible: false,
    }),
    sourceItem({
      profile: permitProfile,
      label: 'Permit and construction records',
      readiness: 'FAIL_CLOSED_REVIEW_REQUIRED',
      evidence: 'Building permit sources are represented as future adapters with jurisdiction-specific availability and rights review.',
      limitation: 'Permit status, remodel legality, system age, structural condition, and construction quality are not determined by this page.',
      customerUse: 'Use public listing construction cues to prepare records questions for qualified review.',
      claimEligible: false,
    }),
    blockedBcodItem('BCOD_ADDRESS_POINTS'),
    blockedBcodItem('BCOD_PARK_BOUNDARIES'),
  ];

  return {
    status: PROPERTY_GEOGRAPHIC_SOURCE_INTELLIGENCE_STATUS,
    version: PROPERTY_GEOGRAPHIC_SOURCE_INTELLIGENCE_VERSION,
    geography: {
      city: cityLabel,
      neighborhood: neighborhoodLabel,
      state: 'Colorado',
      source: input.city ? 'LISTING_FIELD' : 'UNKNOWN',
    },
    summary:
      'Authoritative-source readiness separates existing property facts from geographic context and blocked public-record source classes before customer reliance.',
    selectedSources,
    verificationPrompts: [
      'Which listing facts are current enough to compare, and which need direct confirmation?',
      'Which place context belongs at city or neighborhood level rather than being treated as a parcel fact?',
      'Which assessor, tax, permit, title, HOA, insurance, or disclosure questions require a current source or qualified professional?',
      'Which BCOD-dependent question must wait for provider confirmation and counsel interpretation?',
    ],
    protectedBoundaries: {
      bcodAddressPoints: false,
      bcodParkBoundaries: false,
      providerActivation: false,
      externalAcquisition: false,
      publicGis: false,
      persistence: false,
      prismaChange: false,
      telemetry: false,
      customerDataMutation: false,
    },
  };
}
