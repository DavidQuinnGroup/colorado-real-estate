import {
  CITY_INTELLIGENCE_SOURCE_DOMAIN_MATRIX,
  COLORADO_CITY_INTELLIGENCE_RECORDS,
  type CityIntelligenceSourceCategory,
  type CitySourceDomainProfile,
} from './coloradoCityIntelligenceFactory.js';

export const REIE_SOURCE_REGISTRY_STATUS = 'REIE_SOURCE_REGISTRY_IMPLEMENTED';
export const REIE_SOURCE_REGISTRY_VERSION = '1.0.0';
export const REIE_SOURCE_REGISTRY_REFERENCE_DATE = '2026-08-08';

export type ReieSourceClass =
  | 'AUTHORITATIVE_SOURCE'
  | 'LICENSED_PROFESSIONAL_SOURCE'
  | 'SUPPLEMENTAL_SOURCE'
  | 'REIE_DERIVED_INTELLIGENCE';

export type ReieSourceActivationState =
  | 'ACTIVE_AUTHORIZED'
  | 'AUTHORIZED_NOT_ACTIVE'
  | 'AWAITING_PROVIDER_CONFIRMATION'
  | 'TERMS_REVIEW_REQUIRED'
  | 'TECHNICAL_CONFIRMATION_REQUIRED'
  | 'BLOCKED_NOT_AUTHORIZED'
  | 'REFERENCE_ONLY'
  | 'REIE_DERIVED';

export type ReieCustomerSourceStatus =
  | 'Active'
  | 'Authorized / not yet active'
  | 'Awaiting confirmation'
  | 'Terms review required'
  | 'Technical confirmation required'
  | 'Blocked / not authorized'
  | 'Reference only'
  | 'REIE calculation';

export type ReieSourceJurisdiction = Readonly<{
  state: 'Colorado' | 'Multi-state' | 'REIE';
  county?: string;
  municipality?: string;
  coverage: string;
}>;

export type ReieSourceRegistryRecord = Readonly<{
  sourceId: string;
  publicName: string;
  responsibleOrganization: string;
  sourceClass: ReieSourceClass;
  category: CityIntelligenceSourceCategory | 'BCOD_ADDRESS_POINTS' | 'BCOD_PARK_BOUNDARIES' | 'RECORDED_DOCUMENT_INDEX' | 'REIE_FINANCING_SCENARIO_CALCULATOR' | 'REIE_PROPERTY_COMPARISON_INTELLIGENCE';
  domains: readonly string[];
  jurisdiction: ReieSourceJurisdiction;
  officialUrl: string | null;
  accessMethod: string;
  updateCadence: string;
  freshnessExpectation: string;
  authorizationState: ReieSourceActivationState;
  permittedUse: string;
  productionActivationState: ReieSourceActivationState;
  claimEligible: boolean;
  customerDisclosureEligible: boolean;
  customerStatus: ReieCustomerSourceStatus;
  currentReieUse: string;
  limitations: readonly string[];
  attributionRequirement: string;
  lastSourceVerificationDate: string;
  lastSuccessfulDataRefresh: string | null;
  sourcePaths: readonly string[];
}>;

export type ReieSourceRegistry = Readonly<{
  status: typeof REIE_SOURCE_REGISTRY_STATUS;
  version: typeof REIE_SOURCE_REGISTRY_VERSION;
  referenceDate: typeof REIE_SOURCE_REGISTRY_REFERENCE_DATE;
  records: readonly ReieSourceRegistryRecord[];
  customerTrustContract: readonly string[];
  statewideScalingContract: readonly string[];
  protectedBoundaries: {
    providerActivation: false;
    externalAcquisition: false;
    bcodActivation: false;
    assessorRetrieval: false;
    taxRetrieval: false;
    permitRetrieval: false;
    statewideCountyIngestion: false;
    persistence: false;
    prismaChange: false;
    credentials: false;
    telemetry: false;
    customerDataMutation: false;
  };
}>;

function profile(category: CityIntelligenceSourceCategory): CitySourceDomainProfile {
  const match = CITY_INTELLIGENCE_SOURCE_DOMAIN_MATRIX.find((item) => item.category === category);
  if (!match) throw new Error(`Missing source profile: ${category}`);
  return match;
}

function customerStatus(state: ReieSourceActivationState): ReieCustomerSourceStatus {
  if (state === 'ACTIVE_AUTHORIZED') return 'Active';
  if (state === 'AUTHORIZED_NOT_ACTIVE') return 'Authorized / not yet active';
  if (state === 'AWAITING_PROVIDER_CONFIRMATION') return 'Awaiting confirmation';
  if (state === 'TERMS_REVIEW_REQUIRED') return 'Terms review required';
  if (state === 'TECHNICAL_CONFIRMATION_REQUIRED') return 'Technical confirmation required';
  if (state === 'BLOCKED_NOT_AUTHORIZED') return 'Blocked / not authorized';
  if (state === 'REFERENCE_ONLY') return 'Reference only';
  return 'REIE calculation';
}

function sourceFromProfile({
  sourceId,
  publicName,
  responsibleOrganization,
  sourceClass,
  category,
  officialUrl,
  jurisdiction,
  authorizationState,
  productionActivationState,
  claimEligible,
  customerDisclosureEligible,
  currentReieUse,
  limitations,
  lastSourceVerificationDate,
  lastSuccessfulDataRefresh = null,
}: {
  sourceId: string;
  publicName: string;
  responsibleOrganization: string;
  sourceClass: ReieSourceClass;
  category: CityIntelligenceSourceCategory;
  officialUrl: string | null;
  jurisdiction: ReieSourceJurisdiction;
  authorizationState: ReieSourceActivationState;
  productionActivationState: ReieSourceActivationState;
  claimEligible: boolean;
  customerDisclosureEligible: boolean;
  currentReieUse: string;
  limitations: readonly string[];
  lastSourceVerificationDate: string;
  lastSuccessfulDataRefresh?: string | null;
}): ReieSourceRegistryRecord {
  const sourceProfile = profile(category);

  return {
    sourceId,
    publicName,
    responsibleOrganization,
    sourceClass,
    category,
    domains: sourceProfile.intelligenceDomains,
    jurisdiction,
    officialUrl,
    accessMethod: sourceProfile.accessMethod.replace(/_/g, ' ').toLowerCase(),
    updateCadence: sourceProfile.updateFrequency.replace(/_/g, ' ').toLowerCase(),
    freshnessExpectation: sourceProfile.expectedReliability.toLowerCase(),
    authorizationState,
    permittedUse: sourceProfile.licensingOrPermittedUse.replace(/_/g, ' ').toLowerCase(),
    productionActivationState,
    claimEligible,
    customerDisclosureEligible,
    customerStatus: customerStatus(productionActivationState),
    currentReieUse,
    limitations: [...sourceProfile.knownLimitations, ...limitations],
    attributionRequirement: sourceProfile.attributionRequirement.replace(/_/g, ' ').toLowerCase(),
    lastSourceVerificationDate,
    lastSuccessfulDataRefresh,
    sourcePaths: [
      `CITY_INTELLIGENCE_SOURCE_DOMAIN_MATRIX/${category}`,
      `COLORADO_CITY_INTELLIGENCE_RECORDS/${COLORADO_CITY_INTELLIGENCE_RECORDS.length}-governed-city-records`,
    ],
  };
}

function bcodRecord(category: 'BCOD_ADDRESS_POINTS' | 'BCOD_PARK_BOUNDARIES'): ReieSourceRegistryRecord {
  const isAddress = category === 'BCOD_ADDRESS_POINTS';

  return {
    sourceId: isAddress ? 'SRC-BCOD-ADDRESS-POINTS' : 'SRC-BCOD-PARK-BOUNDARIES',
    publicName: isAddress ? 'Boulder County Address Points' : 'Boulder County Park Boundaries',
    responsibleOrganization: 'Boulder County Open Data',
    sourceClass: 'AUTHORITATIVE_SOURCE',
    category,
    domains: isAddress ? ['Address and location reference'] : ['Park and public-boundary reference'],
    jurisdiction: { state: 'Colorado', county: 'Boulder County', coverage: 'Boulder County only' },
    officialUrl: 'https://bouldercounty.gov/government/open-data/',
    accessMethod: 'Provider-confirmation-gated public data source',
    updateCadence: 'Dataset-specific',
    freshnessExpectation: 'unknown until provider confirmation',
    authorizationState: 'AWAITING_PROVIDER_CONFIRMATION',
    permittedUse: 'provider confirmation required before use',
    productionActivationState: 'BLOCKED_NOT_AUTHORIZED',
    claimEligible: false,
    customerDisclosureEligible: true,
    customerStatus: 'Blocked / not authorized',
    currentReieUse: 'Listed as a blocked source category only; not used for customer intelligence.',
    limitations: [
      'Provider confirmation is required before acquisition or use.',
      'No API use, download, persistence, transformation, geometry, map rendering, derived intelligence, or customer display is authorized.',
      isAddress ? 'Address-point evidence cannot be used to confirm a parcel or property record.' : 'Park-boundary interpretation requires focused counsel review after provider confirmation.',
    ],
    attributionRequirement: 'Boulder County attribution if separately authorized later',
    lastSourceVerificationDate: REIE_SOURCE_REGISTRY_REFERENCE_DATE,
    lastSuccessfulDataRefresh: null,
    sourcePaths: ['Property Product 3.1 source-readiness contract', 'BCOD provider-confirmation gate records'],
  };
}

function boulderCountyRecorderIndexRecord(): ReieSourceRegistryRecord {
  return {
    sourceId: 'SRC-BOULDER-COUNTY-RECORDER-INDEX',
    publicName: 'Boulder County Clerk and Recorder recorded-document index',
    responsibleOrganization: 'Boulder County Clerk and Recorder',
    sourceClass: 'AUTHORITATIVE_SOURCE',
    category: 'RECORDED_DOCUMENT_INDEX',
    domains: ['Recorded-document index/search reference', 'Verification metadata', 'Future Source Quality evidence review'],
    jurisdiction: { state: 'Colorado', county: 'Boulder County', coverage: 'Boulder County recorded-document index/search metadata only' },
    officialUrl: 'https://boulder.co.ds.search.govos.com/',
    accessMethod: 'Source-specific review required before retrieval, automation, scraping, ingestion, or display',
    updateCadence: 'unknown until source-specific review',
    freshnessExpectation: 'unknown until source-specific review',
    authorizationState: 'AWAITING_PROVIDER_CONFIRMATION',
    permittedUse: 'registry identity and source-governance review only; no rights, access, retrieval, automation, storage, redistribution, legal-use, or customer-display authority',
    productionActivationState: 'BLOCKED_NOT_AUTHORIZED',
    claimEligible: false,
    customerDisclosureEligible: true,
    customerStatus: 'Blocked / not authorized',
    currentReieUse: 'Recorded-document search/index reference, verification metadata, source-governance review, and future structured Source Quality evidence only; no document bodies, document images, OCR, signatures, legal-description extraction, certified-copy workflows, bulk document redistribution, retrieval, automation, or customer display is active.',
    limitations: [
      'INDEX_OR_SEARCH_METADATA_NOT_DOCUMENT_CONTENT.',
      'Document images, scanned instruments, OCR, full text, signatures, legal descriptions extracted from document bodies, certified-copy fulfillment, document-content storage, and document-content redistribution are excluded.',
      'Public-record or government-source status does not establish unrestricted reuse, automated extraction, redistribution, legal-use approval, customer display, completeness, or freshness.',
      'Rights, technical access, freshness, attribution, fees, privacy approval, and provenance remain unknown until source-specific review.',
      'EXP-SRC-BOULDER-COUNTY-RECORDER remains discovery-only context and is not Source Quality evidence authority.',
      'SRA-BOULDER-COUNTY-RECORDER remains readiness/risk context only and grants no SRC authority inheritance.',
      'Future Public Record/County conversion support is expected to use COUNTY_RECORDED_DOCUMENT_INDEX only after a separate authorized MVV.',
    ],
    attributionRequirement: 'unknown until source-specific review',
    lastSourceVerificationDate: REIE_SOURCE_REGISTRY_REFERENCE_DATE,
    lastSuccessfulDataRefresh: null,
    sourcePaths: [
      'lib/sourceRegistry.ts/SRC-BOULDER-COUNTY-RECORDER-INDEX',
      'SOURCE-RIGHTS-ACTIVATION-READINESS-1-MATRIX/SRA-BOULDER-COUNTY-RECORDER-readiness-context-only',
      'COLORADO_CITY_INTELLIGENCE_SOURCE_DOMAIN_MATRIX/RECORDER_DEED-category-superseded-for-index-boundary',
    ],
  };
}

function derivedRecord({
  sourceId,
  publicName,
  category,
  domains,
  currentReieUse,
  limitations,
}: {
  sourceId: string;
  publicName: string;
  category: 'REIE_FINANCING_SCENARIO_CALCULATOR' | 'REIE_PROPERTY_COMPARISON_INTELLIGENCE';
  domains: readonly string[];
  currentReieUse: string;
  limitations: readonly string[];
}): ReieSourceRegistryRecord {
  return {
    sourceId,
    publicName,
    responsibleOrganization: 'David Quinn Group Real Estate Intelligence Engine',
    sourceClass: 'REIE_DERIVED_INTELLIGENCE',
    category,
    domains,
    jurisdiction: { state: 'REIE', coverage: 'Derived from stated inputs and identified source records' },
    officialUrl: null,
    accessMethod: 'Deterministic REIE calculation or synthesis',
    updateCadence: 'Changes only when user inputs or source facts change',
    freshnessExpectation: 'inherits source and input limitations',
    authorizationState: 'REIE_DERIVED',
    permittedUse: 'customer-facing explanation when assumptions and source limitations are visible',
    productionActivationState: 'REIE_DERIVED',
    claimEligible: true,
    customerDisclosureEligible: true,
    customerStatus: 'REIE calculation',
    currentReieUse,
    limitations,
    attributionRequirement: 'Identify as REIE calculation; do not present as external source.',
    lastSourceVerificationDate: REIE_SOURCE_REGISTRY_REFERENCE_DATE,
    lastSuccessfulDataRefresh: null,
    sourcePaths: ['lib/financingScenarioCalculator.ts', 'lib/propertyComparisonIntelligence.ts'],
  };
}

export const REIE_SOURCE_REGISTRY: ReieSourceRegistry = Object.freeze({
  status: REIE_SOURCE_REGISTRY_STATUS,
  version: REIE_SOURCE_REGISTRY_VERSION,
  referenceDate: REIE_SOURCE_REGISTRY_REFERENCE_DATE,
  records: Object.freeze([
    sourceFromProfile({
      sourceId: 'SRC-MLS-LISTING-DATA',
      publicName: 'MLS / professional listing facts',
      responsibleOrganization: 'Licensed professional listing data sources',
      sourceClass: 'LICENSED_PROFESSIONAL_SOURCE',
      category: 'MLS_LISTING_DATA',
      officialUrl: null,
      jurisdiction: { state: 'Colorado', coverage: 'Supported listing markets in repository' },
      authorizationState: 'ACTIVE_AUTHORIZED',
      productionActivationState: 'ACTIVE_AUTHORIZED',
      claimEligible: true,
      customerDisclosureEligible: true,
      currentReieUse: 'Property facts, listing context, market orientation, and comparison inputs where existing repository data supports the claim.',
      limitations: ['Listing data can be delayed, incomplete, changed by source systems, or subject to provider display rules.'],
      lastSourceVerificationDate: REIE_SOURCE_REGISTRY_REFERENCE_DATE,
      lastSuccessfulDataRefresh: 'Existing repository data; exact provider refresh is governed by listing pipeline controls.',
    }),
    sourceFromProfile({
      sourceId: 'SRC-BOULDER-COUNTY-ASSESSOR',
      publicName: 'Boulder County Assessor',
      responsibleOrganization: 'Boulder County Assessor',
      sourceClass: 'AUTHORITATIVE_SOURCE',
      category: 'COUNTY_ASSESSOR',
      officialUrl: 'https://bouldercounty.gov/departments/assessor/',
      jurisdiction: { state: 'Colorado', county: 'Boulder County', coverage: 'Boulder County assessor/property records' },
      authorizationState: 'AWAITING_PROVIDER_CONFIRMATION',
      productionActivationState: 'AWAITING_PROVIDER_CONFIRMATION',
      claimEligible: false,
      customerDisclosureEligible: true,
      currentReieUse: 'Identified source candidate only; no automated retrieval, parcel confirmation, owner display, valuation claim, or property-record claim is active.',
      limitations: ['External confirmation remains pending.', 'Public accessibility does not equal permission for automated or customer-facing REIE use.'],
      lastSourceVerificationDate: REIE_SOURCE_REGISTRY_REFERENCE_DATE,
    }),
    sourceFromProfile({
      sourceId: 'SRC-BOULDER-COUNTY-TREASURER',
      publicName: 'Boulder County Treasurer / tax records',
      responsibleOrganization: 'Boulder County Treasurer',
      sourceClass: 'AUTHORITATIVE_SOURCE',
      category: 'COUNTY_TREASURER_TAX',
      officialUrl: 'https://bouldercounty.gov/departments/treasurer/',
      jurisdiction: { state: 'Colorado', county: 'Boulder County', coverage: 'Boulder County tax records' },
      authorizationState: 'TERMS_REVIEW_REQUIRED',
      productionActivationState: 'BLOCKED_NOT_AUTHORIZED',
      claimEligible: false,
      customerDisclosureEligible: true,
      currentReieUse: 'Verification prompt only; not used as retrieved tax evidence.',
      limitations: ['No property-specific tax record retrieval is authorized.', 'Tax conclusions require source and professional verification.'],
      lastSourceVerificationDate: REIE_SOURCE_REGISTRY_REFERENCE_DATE,
    }),
    boulderCountyRecorderIndexRecord(),
    sourceFromProfile({
      sourceId: 'SRC-BOULDER-PERMIT-CANDIDATES',
      publicName: 'Boulder permit source candidates',
      responsibleOrganization: 'City of Boulder and Boulder County permit authorities',
      sourceClass: 'AUTHORITATIVE_SOURCE',
      category: 'BUILDING_PERMITS',
      officialUrl: 'https://bouldercolorado.gov/planning-development-services-records-request-resources',
      jurisdiction: { state: 'Colorado', county: 'Boulder County', municipality: 'Boulder', coverage: 'Boulder County and City of Boulder permit candidates' },
      authorizationState: 'AWAITING_PROVIDER_CONFIRMATION',
      productionActivationState: 'BLOCKED_NOT_AUTHORIZED',
      claimEligible: false,
      customerDisclosureEligible: true,
      currentReieUse: 'Source-candidate and verification-prompt context only; no permit record is retrieved or displayed.',
      limitations: ['Permit availability, address matching, privacy, and automation rights vary by jurisdiction and portal.'],
      lastSourceVerificationDate: REIE_SOURCE_REGISTRY_REFERENCE_DATE,
    }),
    sourceFromProfile({
      sourceId: 'SRC-CITY-BOULDER-OPEN-DATA-PERMITS',
      publicName: 'City of Boulder Open Data permit/planning exports',
      responsibleOrganization: 'City of Boulder',
      sourceClass: 'AUTHORITATIVE_SOURCE',
      category: 'BUILDING_PERMITS',
      officialUrl: 'https://bouldercolorado.gov/planning-development-services-records-request-resources',
      jurisdiction: { state: 'Colorado', county: 'Boulder County', municipality: 'Boulder', coverage: 'City of Boulder Open Data permit/planning exports' },
      authorizationState: 'AWAITING_PROVIDER_CONFIRMATION',
      productionActivationState: 'BLOCKED_NOT_AUTHORIZED',
      claimEligible: false,
      customerDisclosureEligible: true,
      currentReieUse: 'Verification prompt only; no permit or planning record retrieval or customer display is active.',
      limitations: [
        'Open-data availability does not establish unrestricted reuse, redistribution, automation, or customer display.',
        'Dataset terms, field privacy, attribution, freshness, and technical access remain source-specific and unconfirmed.',
        'City channel only; no Boulder County authority inference.',
      ],
      lastSourceVerificationDate: REIE_SOURCE_REGISTRY_REFERENCE_DATE,
    }),
    sourceFromProfile({
      sourceId: 'SRC-CITY-BOULDER-BUILDING-PERMITS-PORTAL',
      publicName: 'City of Boulder building permits and inspections portal',
      responsibleOrganization: 'City of Boulder',
      sourceClass: 'AUTHORITATIVE_SOURCE',
      category: 'BUILDING_PERMITS',
      officialUrl: 'https://bouldercolorado.gov/services/building-permits-and-inspections',
      jurisdiction: { state: 'Colorado', county: 'Boulder County', municipality: 'Boulder', coverage: 'City of Boulder building-permit and inspection portal' },
      authorizationState: 'AWAITING_PROVIDER_CONFIRMATION',
      productionActivationState: 'BLOCKED_NOT_AUTHORIZED',
      claimEligible: false,
      customerDisclosureEligible: true,
      currentReieUse: 'Verification prompt only; no permit or inspection record retrieval or customer display is active.',
      limitations: [
        'Portal availability does not establish approved automated access, scraping permission, API stability, or customer display.',
        'Permit-field mapping, privacy, attribution, freshness, and technical access remain source-specific and unconfirmed.',
        'City portal channel only; no Open Data or Boulder County authority inference.',
      ],
      lastSourceVerificationDate: REIE_SOURCE_REGISTRY_REFERENCE_DATE,
    }),
    sourceFromProfile({
      sourceId: 'SRC-BOULDER-COUNTY-ACCELA-PERMITS',
      publicName: 'Boulder County Community Planning & Permitting / Accela permits',
      responsibleOrganization: 'Boulder County Community Planning & Permitting / Accela',
      sourceClass: 'AUTHORITATIVE_SOURCE',
      category: 'BUILDING_PERMITS',
      officialUrl: 'https://aca-prod.accela.com/BOCO/',
      jurisdiction: { state: 'Colorado', county: 'Boulder County', coverage: 'Boulder County permit portal only' },
      authorizationState: 'AWAITING_PROVIDER_CONFIRMATION',
      productionActivationState: 'BLOCKED_NOT_AUTHORIZED',
      claimEligible: false,
      customerDisclosureEligible: true,
      currentReieUse: 'Verification prompt only; no County permit record retrieval or customer display is active.',
      limitations: [
        'Portal existence does not establish approved automation, scraping permission, API stability, or customer display.',
        'County portal rights, field privacy, attribution, freshness, and technical access remain source-specific and unconfirmed.',
        'Boulder County channel only; no municipal authority inference.',
      ],
      lastSourceVerificationDate: REIE_SOURCE_REGISTRY_REFERENCE_DATE,
    }),
    sourceFromProfile({
      sourceId: 'SRC-MUNICIPAL-PLANNING-CONTEXT',
      publicName: 'Municipal planning and place context',
      responsibleOrganization: 'Colorado municipalities and governed REIE city records',
      sourceClass: 'SUPPLEMENTAL_SOURCE',
      category: 'MUNICIPAL_PLANNING',
      officialUrl: null,
      jurisdiction: { state: 'Colorado', coverage: 'Governed city records currently represented in REIE' },
      authorizationState: 'AUTHORIZED_NOT_ACTIVE',
      productionActivationState: 'REFERENCE_ONLY',
      claimEligible: true,
      customerDisclosureEligible: true,
      currentReieUse: 'Reference context for market, neighborhood, and property verification questions where governed city records exist.',
      limitations: ['Planning context is orientation only and does not establish parcel boundaries, zoning compliance, legal use, safety, or suitability.'],
      lastSourceVerificationDate: REIE_SOURCE_REGISTRY_REFERENCE_DATE,
    }),
    bcodRecord('BCOD_ADDRESS_POINTS'),
    bcodRecord('BCOD_PARK_BOUNDARIES'),
    derivedRecord({
      sourceId: 'SRC-REIE-FINANCING-SCENARIO-CALCULATOR',
      publicName: 'REIE financing scenario calculator',
      category: 'REIE_FINANCING_SCENARIO_CALCULATOR',
      domains: ['Financing assumptions', 'Monthly principal-and-interest estimate', 'User-entered cost assumptions'],
      currentReieUse: 'Deterministic scenario calculation in the Buyer Financing Decision Planner.',
      limitations: [
        'Uses user-entered assumptions only.',
        'Does not provide current rates, lender quotes, approval, qualification, affordability, buying-power conclusions, tax advice, or financial advice.',
      ],
    }),
    derivedRecord({
      sourceId: 'SRC-REIE-PROPERTY-COMPARISON-INTELLIGENCE',
      publicName: 'REIE property comparison intelligence',
      category: 'REIE_PROPERTY_COMPARISON_INTELLIGENCE',
      domains: ['Property comparison', 'Factual differences', 'Missing evidence', 'Verification prompts'],
      currentReieUse: 'Deterministic comparison synthesis from existing property facts and related-listing context.',
      limitations: [
        'Does not rank, score, value, recommend, infer suitability, select winners, or make investment conclusions.',
        'Comparison quality depends on existing listing facts and visible evidence availability.',
      ],
    }),
  ]),
  customerTrustContract: Object.freeze([
    'REIE identifies source categories and limitations before making customer-facing claims.',
    'Official or professional sources may still contain delays, errors, omissions, revisions, or conflicts.',
    'REIE-derived calculations are labeled as calculations or scenarios, not as external source records.',
    'When evidence is missing, stale, unresolved, or unauthorized, REIE fails closed and surfaces verification questions.',
  ]),
  statewideScalingContract: Object.freeze([
    'Each Colorado county/domain can carry its own provider, authorization state, access method, freshness, activation state, and limitations.',
    'A Boulder County source decision does not authorize another county or a statewide feed.',
    'Assessor, treasurer, permit, GIS, parcel, planning, and zoning domains remain independently governable by jurisdiction.',
  ]),
  protectedBoundaries: Object.freeze({
    providerActivation: false,
    externalAcquisition: false,
    bcodActivation: false,
    assessorRetrieval: false,
    taxRetrieval: false,
    permitRetrieval: false,
    statewideCountyIngestion: false,
    persistence: false,
    prismaChange: false,
    credentials: false,
    telemetry: false,
    customerDataMutation: false,
  } as const),
});

export function getReieSourceRegistry() {
  return REIE_SOURCE_REGISTRY;
}

export function getPublicSourceRegistryRecords() {
  return REIE_SOURCE_REGISTRY.records.filter((record) => record.customerDisclosureEligible);
}
