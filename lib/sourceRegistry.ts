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

export type ReieSourceLifecyclePosture =
  | 'NON_OPERATIONAL_DISCOVERY_VERIFICATION_CONTEXT';

export type ReieSourceQualityAdvancementEligibility =
  | 'NOT_ELIGIBLE_NON_OPERATIONAL_CONTEXT';

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
  category:
    | CityIntelligenceSourceCategory
    | 'BCOD_ADDRESS_POINTS'
    | 'BCOD_PARK_BOUNDARIES'
    | 'PARCEL_GEOMETRY'
    | 'RECORDED_DOCUMENT_INDEX'
    | 'REIE_FINANCING_SCENARIO_CALCULATOR'
    | 'REIE_PROPERTY_COMPARISON_INTELLIGENCE';
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
  lifecyclePosture?: ReieSourceLifecyclePosture;
  sourceQualityAdvancementEligibility?: ReieSourceQualityAdvancementEligibility;
  supersededOperationalSourceIds?: readonly string[];
  nonOperationalFirewalls?: readonly string[];
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

function boulderCountyParcelGisRecord(): ReieSourceRegistryRecord {
  return {
    sourceId: 'SRC-BOULDER-COUNTY-PARCEL-GIS',
    publicName: 'Boulder County GIS Parcel Boundaries / Parcels',
    responsibleOrganization: "Boulder County Assessor's Office",
    sourceClass: 'AUTHORITATIVE_SOURCE',
    category: 'PARCEL_GEOMETRY',
    domains: ['Parcel geometry source identity', 'Parcel boundary/reference context', 'Future governed spatial reference'],
    jurisdiction: { state: 'Colorado', county: 'Boulder County', coverage: 'Boulder County parcel geometry / cadastral boundary dataset identity only' },
    officialUrl: 'https://bouldercounty.gov/government/open-data/',
    accessMethod: 'Source-specific provider, rights, and technical-access review required before retrieval, download, feature-service access, ingestion, display, or reuse',
    updateCadence: 'metadata-dependent and not certified',
    freshnessExpectation: 'unknown until source-specific evidence review',
    authorizationState: 'AWAITING_PROVIDER_CONFIRMATION',
    permittedUse: 'registry identity and source-governance review only; no data retrieval, geometry use, spatial join, redistribution, legal-use, or customer-display authority',
    productionActivationState: 'BLOCKED_NOT_AUTHORIZED',
    claimEligible: false,
    customerDisclosureEligible: true,
    customerStatus: 'Blocked / not authorized',
    currentReieUse: 'Exact source identity only for future-governed parcel geometry review; no parcel geometry, parcel identifier, ownership, assessor-record, title, tax, permit, zoning, legal-description, customer display, retrieval, feature-service call, download, ingestion, map rendering, or runtime use is active.',
    limitations: [
      'PARCEL_GEOMETRY_NOT_OWNERSHIP.',
      'PARCEL_GEOMETRY_NOT_LEGAL_DESCRIPTION.',
      'PARCEL_GEOMETRY_NOT_ASSESSOR_RECORD.',
      'PARCEL_GEOMETRY_NOT_TITLE.',
      'GIS_DATASET_NOT_DISPLAY_OR_USE_AUTHORITY.',
      'OPEN_DATA_NOT_UNRESTRICTED_OR_REUSE_READY.',
      'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE.',
      'Address Points cannot confirm parcel identity or substitute for Parcel GIS.',
      'Park Boundaries cannot establish parcel or property facts or substitute for Parcel GIS.',
      'Boulder County organizational or platform overlap does not grant evidence, rights, freshness, attribution, access, or governance inheritance between sources.',
      'Technical access, freshness, attribution, disclaimer, rights, and provenance remain unresolved until separately governed source evidence review.',
    ],
    attributionRequirement: 'unknown until source-specific review',
    lastSourceVerificationDate: REIE_SOURCE_REGISTRY_REFERENCE_DATE,
    lastSuccessfulDataRefresh: null,
    sourcePaths: [
      'lib/sourceRegistry.ts/SRC-BOULDER-COUNTY-PARCEL-GIS',
      'Boulder County Geospatial Open Data Site / official ArcGIS Hub source-identity research handoff',
      'BOULDER_COUNTY_PARCEL_GIS_EXACT_SOURCE_REGISTRY_MVV',
    ],
  };
}

function arapahoeCountyAssessorRecord(): ReieSourceRegistryRecord {
  return {
    sourceId: 'SRC-ARAPAHOE-COUNTY-ASSESSOR',
    publicName: 'Arapahoe County Assessor',
    responsibleOrganization: "Arapahoe County Assessor's Office",
    sourceClass: 'AUTHORITATIVE_SOURCE',
    category: 'COUNTY_ASSESSOR',
    domains: ['Assessor property-record source identity', 'Assessment records', 'Future governed county assessor evidence'],
    jurisdiction: { state: 'Colorado', county: 'Arapahoe County', coverage: 'Arapahoe County assessor/property records source identity only' },
    officialUrl: 'https://files.arapahoeco.gov/your_county/county_departments/assessor/index.php',
    accessMethod: 'Source-specific provider, rights, and technical-access review required before public-search use, Data Mart export, GIS access, retrieval, automation, ingestion, display, or reuse',
    updateCadence: 'source-specific and not certified',
    freshnessExpectation: 'unknown until source-specific evidence review',
    authorizationState: 'AWAITING_PROVIDER_CONFIRMATION',
    permittedUse: 'registry identity and source-governance review only; no property search submission, API access, Data Mart export, GIS access, retrieval, automation, storage, redistribution, legal-use, or customer-display authority',
    productionActivationState: 'BLOCKED_NOT_AUTHORIZED',
    claimEligible: false,
    customerDisclosureEligible: true,
    customerStatus: 'Blocked / not authorized',
    currentReieUse: 'Exact source identity only for future-governed Arapahoe County Assessor review; no property search submission, Assessor Data Mart export, GIS access, property-record retrieval, owner/address lookup, parcel/account lookup, valuation claim, ownership claim, title claim, tax claim, customer display, ingestion, automation, or runtime use is active.',
    limitations: [
      'ASSESSOR_RECORD_NOT_TITLE.',
      'ASSESSOR_RECORD_NOT_DEED_VALIDITY.',
      'ASSESSOR_RECORD_NOT_TREASURER_TAX_STATUS.',
      'ASSESSOR_RECORD_NOT_CURRENT_OWNERSHIP_GUARANTEE.',
      'ASSESSED_VALUE_NOT_MARKET_VALUE.',
      'PUBLIC_SEARCH_NOT_AUTOMATION_AUTHORITY.',
      'PUBLIC_ACCESS_NOT_REUSE_OR_DISPLAY_AUTHORITY.',
      'GOVERNMENT_SOURCE_NOT_VERIFIED_COMPLETE_OR_UNRESTRICTED.',
      'COUNTY_ASSESSOR_NOT_COUNTY_TREASURER.',
      'COUNTY_ASSESSOR_NOT_RECORDER.',
      'COUNTY_ASSESSOR_NOT_PARCEL_GIS.',
      'parcelsearch.arapahoegov.com is a public search interface only and does not become the Registry source identity.',
      'Assessor Data Mart extracts are an extract/download channel only and do not become the Registry source identity.',
      'Arapahoe GIS, ArapaMAP, and GIS downloads are GIS channels only and do not become the Registry source identity.',
      'Boulder County Assessor, Treasurer, Recorder, Parcel GIS, Address Points, Park Boundaries, permit sources, and Source Quality evidence do not grant rights, access, freshness, attribution, provenance, findings, or governance inheritance to Arapahoe County Assessor.',
      'Rights, technical access, freshness, attribution, fees, privacy approval, field sensitivity, and provenance remain unknown until separately governed source evidence review.',
    ],
    attributionRequirement: 'unknown until source-specific review',
    lastSourceVerificationDate: REIE_SOURCE_REGISTRY_REFERENCE_DATE,
    lastSuccessfulDataRefresh: null,
    sourcePaths: [
      'lib/sourceRegistry.ts/SRC-ARAPAHOE-COUNTY-ASSESSOR',
      'Arapahoe County Assessor official-source identity research handoff',
      'ARAPAHOE_COUNTY_ASSESSOR_EXACT_SOURCE_REGISTRY_MVV',
    ],
  };
}

function adamsCountyAssessorRecord(): ReieSourceRegistryRecord {
  return {
    sourceId: 'SRC-ADAMS-COUNTY-ASSESSOR',
    publicName: 'Adams County Assessor',
    responsibleOrganization: "Adams County Assessor's Office",
    sourceClass: 'AUTHORITATIVE_SOURCE',
    category: 'COUNTY_ASSESSOR',
    domains: ['Assessor property-record source identity', 'Assessment records', 'Future governed county assessor evidence'],
    jurisdiction: { state: 'Colorado', county: 'Adams County', coverage: 'Adams County assessor/property assessment and Property Portal source identity only' },
    officialUrl: 'https://www.adcogov.org/assessor',
    accessMethod: 'Source-specific provider, rights, and technical-access review required before public-search use, Property Portal automation, GIS Interactive Maps, Downloadable GIS Data, Assessor Data Dump, retrieval, automation, ingestion, display, or reuse',
    updateCadence: 'source-specific and not certified',
    freshnessExpectation: 'unknown until source-specific evidence review',
    authorizationState: 'AWAITING_PROVIDER_CONFIRMATION',
    permittedUse: 'registry identity and source-governance review only; no Property Portal search submission, GIS Interactive Maps, Downloadable GIS Data, Assessor Data Dump, retrieval, automation, storage, redistribution, legal-use, or customer-display authority',
    productionActivationState: 'BLOCKED_NOT_AUTHORIZED',
    claimEligible: false,
    customerDisclosureEligible: true,
    customerStatus: 'Blocked / not authorized',
    currentReieUse: 'Exact source identity only for future-governed Adams County Assessor review; no Property Portal search submission, no GIS Interactive Maps access, no Downloadable GIS Data, no Assessor Data Dump, no property-record retrieval, no owner/address lookup, no parcel/account lookup, no valuation claim, no ownership claim, no title claim, no tax claim, no customer display, no ingestion, no automation, or runtime use is active.',
    limitations: [
      'ASSESSOR_RECORD_NOT_TITLE.',
      'ASSESSOR_RECORD_NOT_DEED_VALIDITY.',
      'ASSESSOR_RECORD_NOT_TREASURER_TAX_STATUS.',
      'ASSESSOR_RECORD_NOT_CURRENT_OWNERSHIP_GUARANTEE.',
      'ASSESSED_VALUE_NOT_MARKET_VALUE.',
      'PUBLIC_SEARCH_NOT_AUTOMATION_AUTHORITY.',
      'PUBLIC_ACCESS_NOT_REUSE_OR_DISPLAY_AUTHORITY.',
      'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE.',
      'ASSESSOR_GIS_NOT_ASSESSOR_RECORD_AUTHORITY.',
      'ASSESSOR_DATA_DUMP_NOT_AUTHORIZED_BY_REGISTRY_MVV.',
      'DOWNLOADABLE_GIS_DATA_NOT_UNRESTRICTED_OR_REUSE_READY.',
      'PROPERTY_PORTAL_NOT_AUTOMATION_AUTHORITY.',
      'COUNTY_ASSESSOR_NOT_PLANNING_OR_ZONING.',
      'COUNTY_ASSESSOR_NOT_PERMITS.',
      'COUNTY_ASSESSOR_NOT_PUBLIC_TRUSTEE.',
      'COUNTY_ASSESSOR_NOT_COUNTY_TREASURER.',
      'COUNTY_ASSESSOR_NOT_RECORDER.',
      'COUNTY_ASSESSOR_NOT_PARCEL_GIS.',
      'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_REGISTRY_MVV.',
      'CUSTOMER_DISPLAY_NOT_GRANTED_BY_REGISTRY_MVV.',
      'LEGAL_USE_NOT_APPROVED_BY_REGISTRY_MVV.',
      'Adams County GIS Interactive Maps, Downloadable GIS Data, Assessor Data Dump, other GIS/property-map services, Treasurer and Public Trustee, Clerk and Recorder, Planning and Development, Permits and Licensing, public-record datasets, and restricted owner or authorized-agent procedures are separately governed and do not become the Assessor Registry source identity.',
      'Boulder County, Arapahoe County, Broomfield, Jefferson County, Larimer County, and Weld County Assessor findings, evidence, rights, access, freshness, attribution, provenance, and provider terms do not transfer to Adams County Assessor.',
      'Rights, technical access, freshness, attribution, fees, privacy approval, field sensitivity, and provenance remain unknown until separately governed source evidence review.',
    ],
    attributionRequirement: 'unknown until source-specific review',
    lastSourceVerificationDate: REIE_SOURCE_REGISTRY_REFERENCE_DATE,
    lastSuccessfulDataRefresh: null,
    sourcePaths: [
      'lib/sourceRegistry.ts/SRC-ADAMS-COUNTY-ASSESSOR',
      'Adams County Assessor official-source identity research handoff',
      'ADAMS_COUNTY_ASSESSOR_EXACT_SOURCE_REGISTRY_MVV',
    ],
  };
}

function broomfieldCountyAssessorRecord(): ReieSourceRegistryRecord {
  return {
    sourceId: 'SRC-BROOMFIELD-COUNTY-ASSESSOR',
    publicName: 'Broomfield Assessor Department',
    responsibleOrganization: 'City and County of Broomfield — Assessor Department',
    sourceClass: 'AUTHORITATIVE_SOURCE',
    category: 'COUNTY_ASSESSOR',
    domains: ['Assessor property-record source identity', 'Assessment records', 'Future governed county assessor evidence'],
    jurisdiction: { state: 'Colorado', county: 'City and County of Broomfield', municipality: 'Broomfield', coverage: 'City and County of Broomfield assessor/property records source identity only' },
    officialUrl: 'https://www.broomfield.org/156/Assessor',
    accessMethod: 'Source-specific provider, rights, and technical-access review required before public-search use, GIS access, retrieval, automation, ingestion, display, or reuse',
    updateCadence: 'source-specific and not certified',
    freshnessExpectation: 'unknown until source-specific evidence review',
    authorizationState: 'AWAITING_PROVIDER_CONFIRMATION',
    permittedUse: 'registry identity and source-governance review only; no property search submission, GIS access, retrieval, automation, storage, redistribution, legal-use, or customer-display authority',
    productionActivationState: 'BLOCKED_NOT_AUTHORIZED',
    claimEligible: false,
    customerDisclosureEligible: true,
    customerStatus: 'Blocked / not authorized',
    currentReieUse: 'Exact source identity only for future-governed Broomfield Assessor review; no property search submission, GIS access, property-record retrieval, owner/address lookup, parcel/account lookup, valuation claim, ownership claim, title claim, tax claim, customer display, ingestion, automation, or runtime use is active.',
    limitations: [
      'ASSESSOR_RECORD_NOT_TITLE.',
      'ASSESSOR_RECORD_NOT_DEED_VALIDITY.',
      'ASSESSOR_RECORD_NOT_TREASURER_TAX_STATUS.',
      'ASSESSOR_RECORD_NOT_CURRENT_OWNERSHIP_GUARANTEE.',
      'ASSESSED_VALUE_NOT_MARKET_VALUE.',
      'PUBLIC_SEARCH_NOT_AUTOMATION_AUTHORITY.',
      'PUBLIC_ACCESS_NOT_REUSE_OR_DISPLAY_AUTHORITY.',
      'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE.',
      'COUNTY_ASSESSOR_NOT_COUNTY_TREASURER.',
      'COUNTY_ASSESSOR_NOT_RECORDER.',
      'COUNTY_ASSESSOR_NOT_PARCEL_GIS.',
      'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_REGISTRY_MVV.',
      'CUSTOMER_DISPLAY_NOT_GRANTED_BY_REGISTRY_MVV.',
      'LEGAL_USE_NOT_APPROVED_BY_REGISTRY_MVV.',
      'Broomfield consolidated City and County status does not create a Broomfield government aggregate source.',
      'Broomfield GIS, Treasurer/tax, Clerk and Recorder, title/deed authority, market-value guarantee, and current-ownership guarantee remain separate source domains.',
      'Boulder County and Arapahoe County Assessor findings, evidence, rights, access, freshness, attribution, provenance, and provider terms do not transfer to Broomfield Assessor.',
      'Rights, technical access, freshness, attribution, fees, privacy approval, field sensitivity, and provenance remain unknown until separately governed source evidence review.',
    ],
    attributionRequirement: 'unknown until source-specific review',
    lastSourceVerificationDate: REIE_SOURCE_REGISTRY_REFERENCE_DATE,
    lastSuccessfulDataRefresh: null,
    sourcePaths: [
      'lib/sourceRegistry.ts/SRC-BROOMFIELD-COUNTY-ASSESSOR',
      'Broomfield Assessor Department official-source identity research handoff',
      'BROOMFIELD_COUNTY_ASSESSOR_EXACT_SOURCE_REGISTRY_MVV',
    ],
  };
}

function jeffersonCountyAssessorRecord(): ReieSourceRegistryRecord {
  return {
    sourceId: 'SRC-JEFFERSON-COUNTY-ASSESSOR',
    publicName: 'Jefferson County Assessor',
    responsibleOrganization: "Jefferson County Assessor's Office",
    sourceClass: 'AUTHORITATIVE_SOURCE',
    category: 'COUNTY_ASSESSOR',
    domains: ['Assessor property-record source identity', 'Assessment records', 'Future governed county assessor evidence'],
    jurisdiction: { state: 'Colorado', county: 'Jefferson County', coverage: 'Jefferson County assessor/property records source identity only' },
    officialUrl: 'https://www.jeffco.us/87/Assessor',
    accessMethod: 'Source-specific provider, rights, and technical-access review required before public-search use, ASPIN or GIS access, retrieval, automation, ingestion, display, or reuse',
    updateCadence: 'source-specific and not certified',
    freshnessExpectation: 'unknown until source-specific evidence review',
    authorizationState: 'AWAITING_PROVIDER_CONFIRMATION',
    permittedUse: 'registry identity and source-governance review only; no property search submission, ASPIN or GIS access, retrieval, automation, storage, redistribution, legal-use, or customer-display authority',
    productionActivationState: 'BLOCKED_NOT_AUTHORIZED',
    claimEligible: false,
    customerDisclosureEligible: true,
    customerStatus: 'Blocked / not authorized',
    currentReieUse: 'Exact source identity only for future-governed Jefferson County Assessor review; no property search submission, ASPIN or GIS access, property-record retrieval, owner/address lookup, parcel/account lookup, valuation claim, ownership claim, title claim, tax claim, customer display, ingestion, automation, or runtime use is active.',
    limitations: [
      'ASSESSOR_RECORD_NOT_TITLE.',
      'ASSESSOR_RECORD_NOT_DEED_VALIDITY.',
      'ASSESSOR_RECORD_NOT_TREASURER_TAX_STATUS.',
      'ASSESSOR_RECORD_NOT_CURRENT_OWNERSHIP_GUARANTEE.',
      'ASSESSED_VALUE_NOT_MARKET_VALUE.',
      'PUBLIC_SEARCH_NOT_AUTOMATION_AUTHORITY.',
      'PUBLIC_ACCESS_NOT_REUSE_OR_DISPLAY_AUTHORITY.',
      'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE.',
      'COUNTY_ASSESSOR_NOT_COUNTY_TREASURER.',
      'COUNTY_ASSESSOR_NOT_RECORDER.',
      'COUNTY_ASSESSOR_NOT_PARCEL_GIS.',
      'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_REGISTRY_MVV.',
      'CUSTOMER_DISPLAY_NOT_GRANTED_BY_REGISTRY_MVV.',
      'LEGAL_USE_NOT_APPROVED_BY_REGISTRY_MVV.',
      'Jefferson County ASPIN, parcel map, interactive maps, and GIS channels are separately governed and do not become the Assessor Registry source identity.',
      'Jefferson County Treasurer property records, tax status, and tax-payment channels remain separate source domains.',
      'Jefferson County Clerk and Recorder records, recorded documents, title, deed validity, and legal-description authority remain separate source domains.',
      'Boulder County, Arapahoe County, and Broomfield Assessor findings, evidence, rights, access, freshness, attribution, provenance, and provider terms do not transfer to Jefferson County Assessor.',
      'Rights, technical access, freshness, attribution, fees, privacy approval, field sensitivity, and provenance remain unknown until separately governed source evidence review.',
    ],
    attributionRequirement: 'unknown until source-specific review',
    lastSourceVerificationDate: REIE_SOURCE_REGISTRY_REFERENCE_DATE,
    lastSuccessfulDataRefresh: null,
    sourcePaths: [
      'lib/sourceRegistry.ts/SRC-JEFFERSON-COUNTY-ASSESSOR',
      'Jefferson County Assessor official-source identity research handoff',
      'JEFFERSON_COUNTY_ASSESSOR_EXACT_SOURCE_REGISTRY_MVV',
    ],
  };
}

function larimerCountyAssessorRecord(): ReieSourceRegistryRecord {
  return {
    sourceId: 'SRC-LARIMER-COUNTY-ASSESSOR',
    publicName: 'Larimer County Assessor',
    responsibleOrganization: "Larimer County Assessor's Office",
    sourceClass: 'AUTHORITATIVE_SOURCE',
    category: 'COUNTY_ASSESSOR',
    domains: ['Assessor property-record source identity', 'Assessment records', 'Future governed county assessor evidence'],
    jurisdiction: { state: 'Colorado', county: 'Larimer County', coverage: 'Larimer County assessor/property records source identity only' },
    officialUrl: 'https://www.larimer.gov/assessor',
    accessMethod: 'Source-specific provider, rights, and technical-access review required before public-search use, Public Data Center download, GIS or map access, retrieval, automation, ingestion, display, or reuse',
    updateCadence: 'source-specific and not certified',
    freshnessExpectation: 'unknown until source-specific evidence review',
    authorizationState: 'AWAITING_PROVIDER_CONFIRMATION',
    permittedUse: 'registry identity and source-governance review only; no property search submission, Public Data Center download, GIS or map access, retrieval, automation, storage, redistribution, legal-use, or customer-display authority',
    productionActivationState: 'BLOCKED_NOT_AUTHORIZED',
    claimEligible: false,
    customerDisclosureEligible: true,
    customerStatus: 'Blocked / not authorized',
    currentReieUse: 'Exact source identity only for future-governed Larimer County Assessor review; no property search submission, Public Data Center download or automation, GIS or map access, property-record retrieval, owner/address lookup, parcel/account lookup, valuation claim, ownership claim, title claim, tax claim, customer display, ingestion, automation, or runtime use is active.',
    limitations: [
      'ASSESSOR_RECORD_NOT_TITLE.',
      'ASSESSOR_RECORD_NOT_DEED_VALIDITY.',
      'ASSESSOR_RECORD_NOT_TREASURER_TAX_STATUS.',
      'ASSESSOR_RECORD_NOT_CURRENT_OWNERSHIP_GUARANTEE.',
      'ASSESSED_VALUE_NOT_MARKET_VALUE.',
      'PUBLIC_SEARCH_NOT_AUTOMATION_AUTHORITY.',
      'PUBLIC_ACCESS_NOT_REUSE_OR_DISPLAY_AUTHORITY.',
      'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE.',
      'PUBLIC_DATA_CENTER_NOT_DOWNLOAD_OR_AUTOMATION_AUTHORITY.',
      'GIS_OR_MAP_CHANNEL_NOT_ASSESSOR_RECORD_AUTHORITY.',
      'PLANNING_OR_ZONING_NOT_ASSESSOR_RECORD_AUTHORITY.',
      'PUBLIC_TRUSTEE_NOT_ASSESSOR_RECORD_AUTHORITY.',
      'COUNTY_ASSESSOR_NOT_COUNTY_TREASURER.',
      'COUNTY_ASSESSOR_NOT_RECORDER.',
      'COUNTY_ASSESSOR_NOT_PARCEL_GIS.',
      'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_REGISTRY_MVV.',
      'CUSTOMER_DISPLAY_NOT_GRANTED_BY_REGISTRY_MVV.',
      'LEGAL_USE_NOT_APPROVED_BY_REGISTRY_MVV.',
      'Larimer County Public Data Center, public search, download, GIS, map, planning, zoning, Public Trustee, Treasurer, and Recorder channels are separately governed and do not become the Assessor Registry source identity.',
      'Boulder County, Arapahoe County, Broomfield, and Jefferson County Assessor findings, evidence, rights, access, freshness, attribution, provenance, and provider terms do not transfer to Larimer County Assessor.',
      'Rights, technical access, freshness, attribution, fees, privacy approval, field sensitivity, and provenance remain unknown until separately governed source evidence review.',
    ],
    attributionRequirement: 'unknown until source-specific review',
    lastSourceVerificationDate: REIE_SOURCE_REGISTRY_REFERENCE_DATE,
    lastSuccessfulDataRefresh: null,
    sourcePaths: [
      'lib/sourceRegistry.ts/SRC-LARIMER-COUNTY-ASSESSOR',
      'Larimer County Assessor official-source identity research handoff',
      'LARIMER_COUNTY_ASSESSOR_EXACT_SOURCE_REGISTRY_MVV',
    ],
  };
}

function weldCountyAssessorRecord(): ReieSourceRegistryRecord {
  return {
    sourceId: 'SRC-WELD-COUNTY-ASSESSOR',
    publicName: 'Weld County Assessor',
    responsibleOrganization: "Weld County Assessor's Office",
    sourceClass: 'AUTHORITATIVE_SOURCE',
    category: 'COUNTY_ASSESSOR',
    domains: ['Assessor property-record source identity', 'Assessment records', 'Future governed county assessor evidence'],
    jurisdiction: { state: 'Colorado', county: 'Weld County', coverage: 'Weld County assessor/property records source identity only' },
    officialUrl: 'https://www.weld.gov/Government/Departments/Assessor',
    accessMethod: 'Source-specific provider, rights, and technical-access review required before public-search use, Data Download, Property Card Search, Property Map Search, Property Data Search, Sales and Account Data Explorer, retrieval, automation, ingestion, display, or reuse',
    updateCadence: 'source-specific and not certified',
    freshnessExpectation: 'unknown until source-specific evidence review',
    authorizationState: 'AWAITING_PROVIDER_CONFIRMATION',
    permittedUse: 'registry identity and source-governance review only; no property search submission, Data Download, Property Card Search, Property Map Search, Property Data Search, Sales and Account Data Explorer, retrieval, automation, storage, redistribution, legal-use, or customer-display authority',
    productionActivationState: 'BLOCKED_NOT_AUTHORIZED',
    claimEligible: false,
    customerDisclosureEligible: true,
    customerStatus: 'Blocked / not authorized',
    currentReieUse: 'Exact source identity only for future-governed Weld County Assessor review; no property search submission, no Data Download, no Property Card Search, no Property Map Search, no Property Data Search, no Sales and Account Data Explorer, no property-record retrieval, no owner/address lookup, no parcel/account lookup, no valuation claim, no ownership claim, no title claim, no tax claim, no customer display, no ingestion, no automation, or runtime use is active. Weld Property Card Search is historical-only and not current evidence.',
    limitations: [
      'ASSESSOR_RECORD_NOT_TITLE.',
      'ASSESSOR_RECORD_NOT_DEED_VALIDITY.',
      'ASSESSOR_RECORD_NOT_TREASURER_TAX_STATUS.',
      'ASSESSOR_RECORD_NOT_CURRENT_OWNERSHIP_GUARANTEE.',
      'ASSESSED_VALUE_NOT_MARKET_VALUE.',
      'PUBLIC_SEARCH_NOT_AUTOMATION_AUTHORITY.',
      'PUBLIC_ACCESS_NOT_REUSE_OR_DISPLAY_AUTHORITY.',
      'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE.',
      'DATA_DOWNLOAD_NOT_AUTHORIZED_BY_REGISTRY_MVV.',
      'PROPERTY_CARD_HISTORY_NOT_CURRENT_EVIDENCE.',
      'PROPERTY_MAP_NOT_PARCEL_OR_TITLE_AUTHORITY.',
      'PROPERTY_DATA_CHANNEL_NOT_UNRESTRICTED_OR_REUSE_READY.',
      'SALES_DATA_NOT_MARKET_VALUE_OR_APPRAISAL.',
      'COUNTY_ASSESSOR_NOT_PERMITS_OR_RECORDS.',
      'COUNTY_ASSESSOR_NOT_COUNTY_TREASURER.',
      'COUNTY_ASSESSOR_NOT_RECORDER.',
      'COUNTY_ASSESSOR_NOT_PARCEL_GIS.',
      'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_REGISTRY_MVV.',
      'CUSTOMER_DISPLAY_NOT_GRANTED_BY_REGISTRY_MVV.',
      'LEGAL_USE_NOT_APPROVED_BY_REGISTRY_MVV.',
      'Weld County Data Download, Property Card Search, Property Map Search, Property Data Search, Sales and Account Data Explorer, Treasurer, Recorder, permits/records, GIS, and third-party aggregate channels are separately governed and do not become the Assessor Registry source identity.',
      'Weld County Property Card Search is historical-only and has not been updated since 2002 according to official source research; it must not be treated as current evidence.',
      'Boulder County, Arapahoe County, Broomfield, Jefferson County, and Larimer County Assessor findings, evidence, rights, access, freshness, attribution, provenance, and provider terms do not transfer to Weld County Assessor.',
      'Rights, technical access, freshness, attribution, fees, privacy approval, field sensitivity, and provenance remain unknown until separately governed source evidence review.',
    ],
    attributionRequirement: 'unknown until source-specific review',
    lastSourceVerificationDate: REIE_SOURCE_REGISTRY_REFERENCE_DATE,
    lastSuccessfulDataRefresh: null,
    sourcePaths: [
      'lib/sourceRegistry.ts/SRC-WELD-COUNTY-ASSESSOR',
      'Weld County Assessor official-source identity research handoff',
      'WELD_COUNTY_ASSESSOR_EXACT_SOURCE_REGISTRY_MVV',
    ],
  };
}

function arapahoeCountyTreasurerRecord(): ReieSourceRegistryRecord {
  return {
    sourceId: 'SRC-ARAPAHOE-COUNTY-TREASURER',
    publicName: 'Arapahoe County Treasurer',
    responsibleOrganization: 'Arapahoe County Treasurer',
    sourceClass: 'AUTHORITATIVE_SOURCE',
    category: 'COUNTY_TREASURER_TAX',
    domains: ['Treasurer tax-record source identity', 'Property-tax records', 'Future governed county treasurer evidence'],
    jurisdiction: { state: 'Colorado', county: 'Arapahoe County', coverage: 'Arapahoe County Treasurer property-tax information and Tax Search source identity only' },
    officialUrl: 'https://www.arapahoeco.gov/your_county/county_departments/treasurer/index.php',
    accessMethod: 'Source-specific provider, rights, and technical-access review required before Tax Search use, payment, extract access, certificate use, lien operations, Public Trustee operations, retrieval, automation, ingestion, display, or reuse',
    updateCadence: 'source-specific and not certified',
    freshnessExpectation: 'unknown until source-specific evidence review',
    authorizationState: 'AWAITING_PROVIDER_CONFIRMATION',
    permittedUse: 'registry identity and source-governance review only; no Tax Search submission, payment, extract access, Certificate of Taxes Due purchase or use, lien operation, Public Trustee operation, retrieval, automation, storage, redistribution, legal-use, or customer-display authority',
    productionActivationState: 'BLOCKED_NOT_AUTHORIZED',
    claimEligible: false,
    customerDisclosureEligible: true,
    customerStatus: 'Blocked / not authorized',
    currentReieUse: 'Exact source identity only for future-governed Arapahoe County Treasurer review; no Tax Search submission, no online payment, no daily or yearly tax extract access, no tax statement or receipt retrieval, no Certificate of Taxes Due purchase or use, no delinquent-tax publication use, no tax-lien operation, no Public Trustee operation, no assessor-record use, no recorder-record use, no GIS use, no tax-record retrieval, no parcel/account lookup, no tax-status claim, no lien-clearance claim, no title claim, no customer display, no ingestion, no automation, or runtime use is active.',
    limitations: [
      'TREASURER_RECORD_NOT_ASSESSOR_VALUE_AUTHORITY.',
      'TREASURER_RECORD_NOT_TITLE.',
      'TREASURER_RECORD_NOT_RECORDER_INDEX.',
      'TAX_PAYMENT_CHANNEL_NOT_DATA_REUSE_AUTHORITY.',
      'PUBLIC_TAX_SEARCH_NOT_AUTOMATION_AUTHORITY.',
      'PUBLIC_ACCESS_NOT_REUSE_OR_DISPLAY_AUTHORITY.',
      'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE.',
      'PUBLIC_TRUSTEE_NOT_AUTOMATICALLY_TREASURER_DATA_AUTHORITY.',
      'TAX_EXTRACT_NOT_UNRESTRICTED_OR_REUSE_READY.',
      'CERTIFICATE_OF_TAXES_DUE_NOT_TITLE_OR_LIEN_CLEARANCE_GUARANTEE.',
      'FEE_STATUS_SOURCE_SPECIFIC.',
      'TAX_CURRENTNESS_SOURCE_SPECIFIC.',
      'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_REGISTRY_MVV.',
      'CUSTOMER_DISPLAY_NOT_GRANTED_BY_REGISTRY_MVV.',
      'LEGAL_USE_NOT_APPROVED_BY_REGISTRY_MVV.',
      'Arapahoe County Tax Search, online payment, daily and yearly tax extracts, tax statements and receipts, Certificate of Taxes Due, delinquent-tax publications, tax liens, Public Trustee, Assessor, Recorder, and GIS channels are separately governed and do not become the Treasurer Registry source identity.',
      'Boulder County Treasurer, Arapahoe County Assessor, other County Assessor, Recorder, Parcel GIS, Address Points, Park Boundaries, permit sources, and Source Quality evidence do not grant rights, access, freshness, attribution, fee, provenance, findings, or governance inheritance to Arapahoe County Treasurer.',
      'Rights, technical access, freshness, attribution, fees, privacy approval, field sensitivity, and provenance remain unknown until separately governed source evidence review.',
    ],
    attributionRequirement: 'unknown until source-specific review',
    lastSourceVerificationDate: REIE_SOURCE_REGISTRY_REFERENCE_DATE,
    lastSuccessfulDataRefresh: null,
    sourcePaths: [
      'lib/sourceRegistry.ts/SRC-ARAPAHOE-COUNTY-TREASURER',
      'Arapahoe County Treasurer official-source identity research handoff',
      'ARAPAHOE_COUNTY_TREASURER_EXACT_SOURCE_REGISTRY_MVV',
    ],
  };
}

function adamsCountyTreasurerRecord(): ReieSourceRegistryRecord {
  return {
    sourceId: 'SRC-ADAMS-COUNTY-TREASURER',
    publicName: 'Adams County Treasurer',
    responsibleOrganization: 'Adams County Treasurer / Treasurer Division',
    sourceClass: 'AUTHORITATIVE_SOURCE',
    category: 'COUNTY_TREASURER_TAX',
    domains: ['Treasurer tax-record source identity', 'Property-tax records', 'Future governed county treasurer evidence'],
    jurisdiction: { state: 'Colorado', county: 'Adams County', coverage: 'Adams County Treasurer property-tax information source identity only' },
    officialUrl: 'https://adcogov.org/treasurer',
    accessMethod: 'Source-specific provider, rights, and technical-access review required before tax search use, payment, tax-lien use, Treasurer deed workflows, certificate use, report use, retrieval, automation, ingestion, display, or reuse',
    updateCadence: 'source-specific and not certified',
    freshnessExpectation: 'unknown until source-specific evidence review',
    authorizationState: 'AWAITING_PROVIDER_CONFIRMATION',
    permittedUse: 'registry identity and source-governance review only; no tax search submission, payment, lien operation, Treasurer deed action, certificate use, fee-schedule reliance, report use, Public Trustee operation, retrieval, automation, storage, redistribution, legal-use, or customer-display authority',
    productionActivationState: 'BLOCKED_NOT_AUTHORIZED',
    claimEligible: false,
    customerDisclosureEligible: true,
    customerStatus: 'Blocked / not authorized',
    currentReieUse: 'Exact source identity only for future-governed Adams County Treasurer review; no tax search submission, no payment, no tax-lien action, no Treasurer deed action, no certificate action, no fee-schedule reliance, no report or distribution-statement use, no Public Trustee operation, no assessor-record use, no recorder-record use, no GIS use, no tax-record retrieval, no parcel/account lookup, no tax-status claim, no redemption conclusion, no lien-clearance claim, no title claim, no customer display, no ingestion, no automation, or runtime use is active.',
    limitations: [
      'TREASURER_RECORD_NOT_ASSESSOR_VALUE_AUTHORITY.',
      'TREASURER_RECORD_NOT_TITLE.',
      'TREASURER_RECORD_NOT_RECORDER_INDEX.',
      'TAX_PAYMENT_CHANNEL_NOT_DATA_REUSE_AUTHORITY.',
      'PUBLIC_TAX_SEARCH_NOT_AUTOMATION_AUTHORITY.',
      'PUBLIC_ACCESS_NOT_REUSE_OR_DISPLAY_AUTHORITY.',
      'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE.',
      'PUBLIC_TRUSTEE_NOT_AUTOMATICALLY_TREASURER_DATA_AUTHORITY.',
      'TREASURER_DEED_NOT_TITLE_CLEARANCE.',
      'TAX_LIEN_DATA_NOT_OWNERSHIP_OR_REDEMPTION_CONCLUSION.',
      'TREASURER_FEE_STATUS_SOURCE_SPECIFIC.',
      'TAX_CURRENTNESS_SOURCE_SPECIFIC.',
      'TREASURER_REPORTS_NOT_COMPLETE_TAX_RECORD_UNIVERSE.',
      'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_REGISTRY_MVV.',
      'CUSTOMER_DISPLAY_NOT_GRANTED_BY_REGISTRY_MVV.',
      'LEGAL_USE_NOT_APPROVED_BY_REGISTRY_MVV.',
      'Adams County tax search, payment, tax-lien sale, Treasurer deed, deed application, certificates, fee schedules, reports and distribution statements, Public Trustee, Assessor, Clerk and Recorder, GIS, and permit channels are separately governed and do not become the Treasurer Registry source identity.',
      'Boulder County Treasurer, Arapahoe County Treasurer, Adams County Assessor, other County Assessor, Recorder, Parcel GIS, Address Points, Park Boundaries, permit sources, and Source Quality evidence do not grant rights, access, freshness, attribution, fee, provenance, findings, or governance inheritance to Adams County Treasurer.',
      'Rights, technical access, freshness, attribution, fees, privacy approval, field sensitivity, and provenance remain unknown until separately governed source evidence review.',
    ],
    attributionRequirement: 'unknown until source-specific review',
    lastSourceVerificationDate: REIE_SOURCE_REGISTRY_REFERENCE_DATE,
    lastSuccessfulDataRefresh: null,
    sourcePaths: [
      'lib/sourceRegistry.ts/SRC-ADAMS-COUNTY-TREASURER',
      'Adams County Treasurer official-source identity research handoff',
      'ADAMS_COUNTY_TREASURER_EXACT_SOURCE_REGISTRY_MVV',
    ],
  };
}

function jeffersonCountyTreasurerRecord(): ReieSourceRegistryRecord {
  return {
    sourceId: 'SRC-JEFFERSON-COUNTY-TREASURER',
    publicName: 'Jefferson County Treasurer',
    responsibleOrganization: "Jefferson County Treasurer's Office",
    sourceClass: 'AUTHORITATIVE_SOURCE',
    category: 'COUNTY_TREASURER_TAX',
    domains: ['Treasurer tax-record source identity', 'Property-tax records', 'Future governed county treasurer evidence'],
    jurisdiction: { state: 'Colorado', county: 'Jefferson County', coverage: 'Jefferson County Treasurer property-tax information and Property Search & Pay Taxes source identity only' },
    officialUrl: 'https://www.jeffco.us/treasurer',
    accessMethod: 'Source-specific provider, rights, and technical-access review required before Property Search & Pay Taxes use, payment, tax-lien sale use, deed application use, certificate use, Public Trustee operations, retrieval, automation, ingestion, display, or reuse',
    updateCadence: 'source-specific and not certified',
    freshnessExpectation: 'unknown until source-specific evidence review',
    authorizationState: 'AWAITING_PROVIDER_CONFIRMATION',
    permittedUse: 'registry identity and source-governance review only; no Property Search & Pay Taxes submission, payment, tax-lien sale action, deed application action, certificate use, Public Trustee operation, retrieval, automation, storage, redistribution, legal-use, or customer-display authority',
    productionActivationState: 'BLOCKED_NOT_AUTHORIZED',
    claimEligible: false,
    customerDisclosureEligible: true,
    customerStatus: 'Blocked / not authorized',
    currentReieUse: 'Exact source identity only for future-governed Jefferson County Treasurer review; no Property Search & Pay Taxes submission, no payment, no tax-lien sale action, no deed application action, no certificate action or portal certificate claim, no Public Trustee operation, no assessor-record use, no recorder-record use, no GIS use, no tax-record retrieval, no parcel/account lookup, no tax-status claim, no redemption conclusion, no lien-clearance claim, no title claim, no customer display, no ingestion, no automation, or runtime use is active.',
    limitations: [
      'TREASURER_RECORD_NOT_ASSESSOR_VALUE_AUTHORITY.',
      'TREASURER_RECORD_NOT_TITLE.',
      'TREASURER_RECORD_NOT_RECORDER_INDEX.',
      'TAX_PAYMENT_CHANNEL_NOT_DATA_REUSE_AUTHORITY.',
      'PUBLIC_TAX_SEARCH_NOT_AUTOMATION_AUTHORITY.',
      'PUBLIC_ACCESS_NOT_REUSE_OR_DISPLAY_AUTHORITY.',
      'PUBLIC_OR_GOVERNMENT_SOURCE_NOT_UNRESTRICTED_OR_VERIFIED_OR_COMPLETE.',
      'PUBLIC_TRUSTEE_NOT_AUTOMATICALLY_TREASURER_DATA_AUTHORITY.',
      'FEE_STATUS_SOURCE_SPECIFIC.',
      'TAX_CURRENTNESS_SOURCE_SPECIFIC.',
      'TAX_CERTIFICATES_NOT_AVAILABLE_THROUGH_PORTAL.',
      'TAX_LIEN_SALE_NOT_OWNERSHIP_OR_REDEMPTION_CONCLUSION.',
      'DEED_APPLICATION_NOT_TITLE_CLEARANCE.',
      'SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_REGISTRY_MVV.',
      'CUSTOMER_DISPLAY_NOT_GRANTED_BY_REGISTRY_MVV.',
      'LEGAL_USE_NOT_APPROVED_BY_REGISTRY_MVV.',
      'Jefferson County Property Search & Pay Taxes, payment, tax-lien sale, deed application, certificates, Public Trustee, Assessor, Recorder, and GIS channels are separately governed and do not become the Treasurer Registry source identity.',
      'Tax Certificates are not available through the website/portal according to the reviewed official metadata; this portal limitation is not a general legal impossibility statement.',
      'Boulder County Treasurer, Arapahoe County Treasurer, Adams County Treasurer, Jefferson County Assessor, other County Assessor, Recorder, Parcel GIS, Address Points, Park Boundaries, permit sources, and Source Quality evidence do not grant rights, access, freshness, attribution, fee, provenance, findings, or governance inheritance to Jefferson County Treasurer.',
      'Rights, technical access, freshness, attribution, fees, privacy approval, field sensitivity, and provenance remain unknown until separately governed source evidence review.',
    ],
    attributionRequirement: 'unknown until source-specific review',
    lastSourceVerificationDate: REIE_SOURCE_REGISTRY_REFERENCE_DATE,
    lastSuccessfulDataRefresh: null,
    sourcePaths: [
      'lib/sourceRegistry.ts/SRC-JEFFERSON-COUNTY-TREASURER',
      'Jefferson County Treasurer official-source identity research handoff',
      'JEFFERSON_COUNTY_TREASURER_EXACT_SOURCE_REGISTRY_MVV',
    ],
  };
}

export const BOULDER_PERMIT_CANDIDATES_SOURCE_ID = 'SRC-BOULDER-PERMIT-CANDIDATES' as const;
export const BOULDER_PERMIT_CANDIDATES_LIFECYCLE_POSTURE = 'NON_OPERATIONAL_DISCOVERY_VERIFICATION_CONTEXT' as const;
export const BOULDER_PERMIT_CANDIDATES_SOURCE_QUALITY_ADVANCEMENT_ELIGIBILITY = 'NOT_ELIGIBLE_NON_OPERATIONAL_CONTEXT' as const;
export const BOULDER_PERMIT_CANDIDATES_SUPERSEDED_OPERATIONAL_SOURCE_IDS = Object.freeze([
  'SRC-BOULDER-COUNTY-ACCELA-PERMITS',
  'SRC-CITY-BOULDER-OPEN-DATA-PERMITS',
  'SRC-CITY-BOULDER-BUILDING-PERMITS-PORTAL',
] as const);
export const BOULDER_PERMIT_CANDIDATES_NON_OPERATIONAL_FIREWALLS = Object.freeze([
  'NOT_SOURCE_QUALITY_EVIDENCE_AUTHORITY',
  'NOT_CONVERSION_AUTHORITY',
  'NOT_OPERATIONAL_MANIFEST_SOURCE',
  'NOT_ACTIVATION_AUTHORITY',
  'NOT_AGGREGATE_SOURCE',
  'NOT_PARENT_SOURCE',
  'NOT_MEMBER_SOURCE',
  'NOT_EVIDENCE_INHERITANCE_AUTHORITY',
  'NOT_RIGHTS_ACCESS_FRESHNESS_ATTRIBUTION_OR_PROVENANCE_AUTHORITY',
] as const);

function boulderPermitCandidatesRecord(): ReieSourceRegistryRecord {
  const sourceProfile = profile('BUILDING_PERMITS');

  return {
    sourceId: BOULDER_PERMIT_CANDIDATES_SOURCE_ID,
    publicName: 'Boulder permit source candidates',
    responsibleOrganization: 'City of Boulder and Boulder County permit authorities',
    sourceClass: 'AUTHORITATIVE_SOURCE',
    category: 'BUILDING_PERMITS',
    domains: sourceProfile.intelligenceDomains,
    jurisdiction: { state: 'Colorado', county: 'Boulder County', municipality: 'Boulder', coverage: 'Boulder County and City of Boulder permit candidates' },
    officialUrl: 'https://bouldercolorado.gov/planning-development-services-records-request-resources',
    accessMethod: sourceProfile.accessMethod.replace(/_/g, ' ').toLowerCase(),
    updateCadence: sourceProfile.updateFrequency.replace(/_/g, ' ').toLowerCase(),
    freshnessExpectation: sourceProfile.expectedReliability.toLowerCase(),
    authorizationState: 'AWAITING_PROVIDER_CONFIRMATION',
    permittedUse: sourceProfile.licensingOrPermittedUse.replace(/_/g, ' ').toLowerCase(),
    productionActivationState: 'BLOCKED_NOT_AUTHORIZED',
    claimEligible: false,
    customerDisclosureEligible: true,
    customerStatus: 'Blocked / not authorized',
    currentReieUse: 'Source-candidate and verification-prompt context only; no permit record is retrieved or displayed.',
    limitations: [
      ...sourceProfile.knownLimitations,
      'Permit availability, address matching, privacy, and automation rights vary by jurisdiction and portal.',
      'Non-operational discovery context only; not eligible for Source Quality evidence, conversion, Operational Manifest inclusion, source activation, or evidence inheritance.',
      'Operational permit-source review is superseded by the exact independently governed permit channels listed in supersededOperationalSourceIds.',
    ],
    attributionRequirement: sourceProfile.attributionRequirement.replace(/_/g, ' ').toLowerCase(),
    lastSourceVerificationDate: REIE_SOURCE_REGISTRY_REFERENCE_DATE,
    lastSuccessfulDataRefresh: null,
    sourcePaths: [
      `CITY_INTELLIGENCE_SOURCE_DOMAIN_MATRIX/BUILDING_PERMITS`,
      `COLORADO_CITY_INTELLIGENCE_RECORDS/${COLORADO_CITY_INTELLIGENCE_RECORDS.length}-governed-city-records`,
      'REIE-BOULDER-PERMIT-EXACT-SOURCE-REGISTRY-MVV-CERTIFICATION/candidate-firewall',
    ],
    lifecyclePosture: BOULDER_PERMIT_CANDIDATES_LIFECYCLE_POSTURE,
    sourceQualityAdvancementEligibility: BOULDER_PERMIT_CANDIDATES_SOURCE_QUALITY_ADVANCEMENT_ELIGIBILITY,
    supersededOperationalSourceIds: BOULDER_PERMIT_CANDIDATES_SUPERSEDED_OPERATIONAL_SOURCE_IDS,
    nonOperationalFirewalls: BOULDER_PERMIT_CANDIDATES_NON_OPERATIONAL_FIREWALLS,
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
    boulderCountyParcelGisRecord(),
    adamsCountyAssessorRecord(),
    arapahoeCountyAssessorRecord(),
    broomfieldCountyAssessorRecord(),
    jeffersonCountyAssessorRecord(),
    larimerCountyAssessorRecord(),
    weldCountyAssessorRecord(),
    adamsCountyTreasurerRecord(),
    arapahoeCountyTreasurerRecord(),
    jeffersonCountyTreasurerRecord(),
    boulderPermitCandidatesRecord(),
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
