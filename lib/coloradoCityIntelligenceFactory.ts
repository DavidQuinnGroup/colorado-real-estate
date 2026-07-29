import { GIS_FAIL_CLOSED_ACTIVATION } from './geographic-intelligence/activationContract.js';

export const COLORADO_CITY_INTELLIGENCE_FACTORY_STATUS = 'COLORADO_CITY_INTELLIGENCE_ACQUISITION_ENRICHMENT_1_COMPLETE';
export const COLORADO_CITY_INTELLIGENCE_FACTORY_VERSION = '1.0.0';
export const COLORADO_CITY_INTELLIGENCE_REFERENCE_DATE = '2026-07-29';

export type CityIntelligenceDomain =
  | 'HOUSING_PATTERNS'
  | 'NEIGHBORHOOD_RELATIONSHIPS'
  | 'LOCAL_ACCESS_PRACTICAL_CONTEXT'
  | 'BALANCED_TRADEOFFS'
  | 'LOCAL_IMAGERY'
  | 'MARKET_INTERPRETATION'
  | 'VERIFICATION_QUESTIONS';

export type CityIntelligenceMaturity =
  | 'FOUNDATION'
  | 'EVIDENCE_IN_PROGRESS'
  | 'EVIDENCE_COMPLETE'
  | 'EDITORIALLY_CERTIFIED'
  | 'CONTINUOUSLY_MAINTAINED';

export type CityIntelligenceSourceCategory =
  | 'MLS_LISTING_DATA'
  | 'COUNTY_ASSESSOR'
  | 'COUNTY_TREASURER_TAX'
  | 'RECORDER_DEED'
  | 'BUILDING_PERMITS'
  | 'ZONING_LAND_USE'
  | 'MUNICIPAL_PLANNING'
  | 'SUBDIVISION_PARCEL_RELATIONSHIPS'
  | 'TRANSPORTATION_TRANSIT'
  | 'CENSUS_ECONOMIC'
  | 'ENVIRONMENTAL_HAZARD'
  | 'PUBLIC_AMENITIES'
  | 'SCHOOL_DISTRICT_BOUNDARIES'
  | 'LOCAL_GOVERNMENT_INFORMATION'
  | 'LICENSED_EDITORIAL_IMAGERY'
  | 'DQG_OWNED_KNOWLEDGE'
  | 'APPROVED_SECONDARY_PUBLIC_RESEARCH';

export type SourceAuthorityLevel = 'UNKNOWN' | 'LOW' | 'MODERATE' | 'HIGH' | 'AUTHORITATIVE';
export type SourceAccessMethod = 'EXISTING_REPOSITORY_DATA' | 'GOVERNED_RECORD_REFERENCE' | 'FUTURE_ADAPTER' | 'MANUAL_EDITORIAL_REVIEW';
export type SourceReadiness = 'READY_FIXTURE' | 'CONTRACT_DEFINED' | 'REQUIRES_CREDENTIAL' | 'REQUIRES_LICENSE_REVIEW' | 'DEFERRED';
export type DomainCompleteness = 'MISSING' | 'PARTIAL' | 'COMPLETE' | 'CERTIFIED';
export type EvidenceConfidence = 'UNKNOWN' | 'LOW' | 'MODERATE' | 'HIGH' | 'AUTHORITATIVE';
export type EvidenceFreshness = 'UNKNOWN' | 'CURRENT' | 'AGING' | 'STALE' | 'EXPIRED';
export type PublicEligibility = 'PUBLIC_ELIGIBLE' | 'INTERNAL_ONLY' | 'BLOCKED';

export type CitySourceDomainProfile = Readonly<{
  category: CityIntelligenceSourceCategory;
  intelligenceDomains: readonly CityIntelligenceDomain[];
  geographicCoverage: string;
  authorityLevel: SourceAuthorityLevel;
  accessMethod: SourceAccessMethod;
  licensingOrPermittedUse: 'CONFIRMED_INTERNAL' | 'CONFIRMED_PUBLIC_DISPLAY' | 'UNKNOWN_REVIEW_REQUIRED' | 'PROHIBITED';
  updateFrequency: 'UNKNOWN' | 'STATIC' | 'EVENT_DRIVEN' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'CONTINUOUS';
  expectedReliability: SourceAuthorityLevel;
  publicDisplayEligibility: PublicEligibility;
  storageEligibility: 'CONTRACT_ONLY' | 'FIXTURE_ONLY' | 'DURABLE_STORAGE_REQUIRES_SCHEMA' | 'ELIGIBLE_AFTER_REVIEW' | 'NOT_ELIGIBLE';
  attributionRequirement: 'NONE' | 'SOURCE_NAME' | 'SOURCE_AND_LICENSE' | 'CUSTOM_ATTRIBUTION' | 'LEGAL_REVIEW_REQUIRED';
  knownLimitations: readonly string[];
  adapterReadiness: SourceReadiness;
  implementationPriority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'DEFERRED';
}>;

export type CityEvidenceReference = Readonly<{
  evidenceId: string;
  sourceCategory: CityIntelligenceSourceCategory;
  sourceIdentity: string;
  acquisitionRecordId: string;
  evidenceVersionId: string;
  observationDate: string;
  effectiveDate: string | null;
  geographicSubject: string;
  domain: CityIntelligenceDomain;
  confidence: EvidenceConfidence;
  freshness: EvidenceFreshness;
  permittedUse: PublicEligibility;
  publicDisplayEligible: boolean;
  supersessionStatus: 'CURRENT' | 'SUPERSEDED' | 'RETAINED_HISTORICAL';
  conflictStatus: 'NONE' | 'PRESERVED_UNRESOLVED' | 'GOVERNED_REVIEW_REQUIRED';
  claimText: string;
}>;

export type CityImageryEligibility = Readonly<{
  imageIdentity: string;
  cityOrLocation: string;
  role: 'CITY_HERO' | 'NEIGHBORHOOD' | 'HOUSING_PATTERN' | 'COMMUNITY_CONTEXT' | 'EDITORIAL_SUPPORTING' | 'FALLBACK';
  ownerOrProvider: string;
  licenseOrPermittedUse: 'CONFIRMED_PUBLIC_DISPLAY' | 'CONFIRMED_INTERNAL' | 'UNKNOWN_REVIEW_REQUIRED' | 'PROHIBITED';
  attribution: string | null;
  freshness: EvidenceFreshness;
  editorialApproval: boolean;
  publicEligibility: boolean;
  fallbackAsset: string;
}>;

export type CityGeographicKnowledge = Readonly<{
  state: 'Colorado';
  county: readonly string[];
  municipalityOrCensusPlace: string;
  city: string;
  neighborhoods: readonly string[];
  subdivisionsOrDistricts: readonly string[];
  parcelOrPropertyRelationshipStatus: 'NOT_MODELED' | 'CONTRACT_DEFINED' | 'EVIDENCE_IN_PROGRESS';
  aliases: readonly string[];
  overlappingBoundaries: readonly string[];
  sourceDisagreements: readonly string[];
  temporalChangeSupport: boolean;
  publicGisActivated: false;
}>;

export type CityIntelligenceRecord = Readonly<{
  cityKey: string;
  canonicalName: string;
  maturity: CityIntelligenceMaturity;
  publicEligibility: boolean;
  editorialStatus: 'NOT_REVIEWED' | 'REVIEW_QUEUE' | 'APPROVED' | 'MAINTENANCE_REVIEW';
  geographic: CityGeographicKnowledge;
  domainCompleteness: Readonly<Record<CityIntelligenceDomain, DomainCompleteness>>;
  evidence: readonly CityEvidenceReference[];
  imagery: readonly CityImageryEligibility[];
  balancedTradeoffs: readonly string[];
  verificationQuestions: readonly string[];
  missingSourceCategories: readonly CityIntelligenceSourceCategory[];
  unresolvedConflicts: readonly string[];
  freshness: EvidenceFreshness;
  confidence: EvidenceConfidence;
  blockedReasons: readonly string[];
}>;

export type CityAcquisitionAdapter = Readonly<{
  adapterId: string;
  sourceCategory: CityIntelligenceSourceCategory;
  sourceIdentity: string;
  modeSupport: readonly ['dry-run', 'execute'];
  executeAuthorized: false;
  idempotencyKeyPattern: string;
  evidenceDeduplication: true;
  versioning: true;
  conflictPreservation: true;
  sourceFailureIsolation: true;
  retryBoundary: 'NO_RETRY_WITHOUT_OPERATOR' | 'SAFE_FIXTURE_RETRY_ONLY' | 'FUTURE_PROVIDER_POLICY_REQUIRED';
  customerVisiblePartialClaims: false;
  batchProcessing: 'CONTROLLED_BATCH_ONLY';
  progressReporting: 'CITY_DOMAIN_STATUS';
}>;

export type CityAcquisitionResult = Readonly<{
  adapterId: string;
  cityKey: string;
  mode: 'dry-run' | 'execute';
  status: 'DRY_RUN_READY' | 'EXECUTE_BLOCKED' | 'SOURCE_DEFERRED';
  activation: typeof GIS_FAIL_CLOSED_ACTIVATION;
  evidenceVersionCreated: false;
  customerVisibleChange: false;
  reason: string;
}>;

export type SynthesizedCityGuideIntelligence = Readonly<{
  cityKey: string;
  maturity: CityIntelligenceMaturity;
  publishable: boolean;
  facts: readonly string[];
  interpretations: readonly string[];
  tradeoffs: readonly string[];
  verificationQuestions: readonly string[];
  missingDomains: readonly CityIntelligenceDomain[];
  evidenceIds: readonly string[];
  failClosedReason: string | null;
}>;

export const REQUIRED_CITY_INTELLIGENCE_DOMAINS: readonly CityIntelligenceDomain[] = Object.freeze([
  'HOUSING_PATTERNS',
  'NEIGHBORHOOD_RELATIONSHIPS',
  'LOCAL_ACCESS_PRACTICAL_CONTEXT',
  'BALANCED_TRADEOFFS',
  'LOCAL_IMAGERY',
  'MARKET_INTERPRETATION',
  'VERIFICATION_QUESTIONS',
]);

export const PROHIBITED_CITY_INTELLIGENCE_OUTPUTS = Object.freeze({
  protectedClassRecommendations: false,
  demographicTargeting: false,
  schoolRankings: false,
  safetyRankings: false,
  crimeScoring: false,
  placeSuperlatives: false,
  lifestyleStereotypes: false,
  appreciationPredictions: false,
  investmentRecommendations: false,
  urgencyClaims: false,
  unsupportedLocalClaims: false,
  unlicensedImagery: false,
  customerFacingAi: false,
  publicGis: false,
  telemetry: false,
  personalization: false,
  providerActivation: false,
  schemaMutation: false,
});

export const CITY_INTELLIGENCE_SOURCE_DOMAIN_MATRIX: readonly CitySourceDomainProfile[] = Object.freeze([
  source('MLS_LISTING_DATA', ['HOUSING_PATTERNS', 'MARKET_INTERPRETATION', 'VERIFICATION_QUESTIONS'], 'Supported listing markets in repository', 'HIGH', 'EXISTING_REPOSITORY_DATA', 'CONFIRMED_INTERNAL', 'CONTINUOUS', 'HIGH', 'INTERNAL_ONLY', 'CONTRACT_ONLY', 'SOURCE_NAME', ['Public display depends on existing MLS attribution and listing-display controls.'], 'READY_FIXTURE', 'CRITICAL'),
  source('COUNTY_ASSESSOR', ['HOUSING_PATTERNS', 'NEIGHBORHOOD_RELATIONSHIPS', 'VERIFICATION_QUESTIONS'], 'County parcel and property records', 'AUTHORITATIVE', 'FUTURE_ADAPTER', 'UNKNOWN_REVIEW_REQUIRED', 'ANNUAL', 'AUTHORITATIVE', 'INTERNAL_ONLY', 'DURABLE_STORAGE_REQUIRES_SCHEMA', 'SOURCE_AND_LICENSE', ['County coverage, fields, licensing, and redistribution terms vary.'], 'REQUIRES_LICENSE_REVIEW', 'HIGH'),
  source('COUNTY_TREASURER_TAX', ['VERIFICATION_QUESTIONS'], 'County tax records', 'AUTHORITATIVE', 'FUTURE_ADAPTER', 'UNKNOWN_REVIEW_REQUIRED', 'ANNUAL', 'AUTHORITATIVE', 'INTERNAL_ONLY', 'DURABLE_STORAGE_REQUIRES_SCHEMA', 'SOURCE_AND_LICENSE', ['Useful for questions, not customer-facing conclusions without review.'], 'REQUIRES_LICENSE_REVIEW', 'MEDIUM'),
  source('RECORDER_DEED', ['VERIFICATION_QUESTIONS'], 'County recording offices', 'AUTHORITATIVE', 'FUTURE_ADAPTER', 'UNKNOWN_REVIEW_REQUIRED', 'EVENT_DRIVEN', 'AUTHORITATIVE', 'INTERNAL_ONLY', 'DURABLE_STORAGE_REQUIRES_SCHEMA', 'SOURCE_AND_LICENSE', ['Document access fees and redistribution restrictions may apply.'], 'REQUIRES_CREDENTIAL', 'MEDIUM'),
  source('BUILDING_PERMITS', ['HOUSING_PATTERNS', 'VERIFICATION_QUESTIONS'], 'Municipal and county permit portals', 'HIGH', 'FUTURE_ADAPTER', 'UNKNOWN_REVIEW_REQUIRED', 'EVENT_DRIVEN', 'HIGH', 'INTERNAL_ONLY', 'DURABLE_STORAGE_REQUIRES_SCHEMA', 'SOURCE_AND_LICENSE', ['Permit availability and address matching vary by jurisdiction.'], 'REQUIRES_LICENSE_REVIEW', 'HIGH'),
  source('ZONING_LAND_USE', ['LOCAL_ACCESS_PRACTICAL_CONTEXT', 'VERIFICATION_QUESTIONS'], 'Municipal planning and zoning sources', 'AUTHORITATIVE', 'GOVERNED_RECORD_REFERENCE', 'UNKNOWN_REVIEW_REQUIRED', 'EVENT_DRIVEN', 'AUTHORITATIVE', 'INTERNAL_ONLY', 'ELIGIBLE_AFTER_REVIEW', 'SOURCE_AND_LICENSE', ['Public use must preserve official-source limitations and avoid legal advice.'], 'CONTRACT_DEFINED', 'HIGH'),
  source('MUNICIPAL_PLANNING', ['LOCAL_ACCESS_PRACTICAL_CONTEXT', 'BALANCED_TRADEOFFS', 'VERIFICATION_QUESTIONS'], 'Municipal planning documents', 'HIGH', 'GOVERNED_RECORD_REFERENCE', 'UNKNOWN_REVIEW_REQUIRED', 'QUARTERLY', 'HIGH', 'INTERNAL_ONLY', 'ELIGIBLE_AFTER_REVIEW', 'SOURCE_AND_LICENSE', ['Planning documents can change and should not be framed as guarantees.'], 'CONTRACT_DEFINED', 'HIGH'),
  source('SUBDIVISION_PARCEL_RELATIONSHIPS', ['NEIGHBORHOOD_RELATIONSHIPS', 'VERIFICATION_QUESTIONS'], 'Recorded plats, parcel references, and internal neighborhood records', 'HIGH', 'FUTURE_ADAPTER', 'UNKNOWN_REVIEW_REQUIRED', 'EVENT_DRIVEN', 'HIGH', 'INTERNAL_ONLY', 'DURABLE_STORAGE_REQUIRES_SCHEMA', 'SOURCE_AND_LICENSE', ['Boundary conflicts must be preserved, not silently resolved.'], 'REQUIRES_LICENSE_REVIEW', 'MEDIUM'),
  source('TRANSPORTATION_TRANSIT', ['LOCAL_ACCESS_PRACTICAL_CONTEXT', 'BALANCED_TRADEOFFS'], 'Public transportation and roadway sources', 'HIGH', 'GOVERNED_RECORD_REFERENCE', 'UNKNOWN_REVIEW_REQUIRED', 'QUARTERLY', 'HIGH', 'INTERNAL_ONLY', 'ELIGIBLE_AFTER_REVIEW', 'SOURCE_AND_LICENSE', ['Travel times and routes should be verification prompts, not promises.'], 'CONTRACT_DEFINED', 'MEDIUM'),
  source('CENSUS_ECONOMIC', ['LOCAL_ACCESS_PRACTICAL_CONTEXT'], 'Neutral federal statistical geography', 'AUTHORITATIVE', 'GOVERNED_RECORD_REFERENCE', 'UNKNOWN_REVIEW_REQUIRED', 'ANNUAL', 'AUTHORITATIVE', 'INTERNAL_ONLY', 'ELIGIBLE_AFTER_REVIEW', 'SOURCE_NAME', ['Must not be used for steering, suitability, or protected-class recommendations.'], 'CONTRACT_DEFINED', 'LOW'),
  source('ENVIRONMENTAL_HAZARD', ['VERIFICATION_QUESTIONS'], 'Government hazard and environmental sources', 'HIGH', 'FUTURE_ADAPTER', 'UNKNOWN_REVIEW_REQUIRED', 'EVENT_DRIVEN', 'HIGH', 'INTERNAL_ONLY', 'ELIGIBLE_AFTER_REVIEW', 'LEGAL_REVIEW_REQUIRED', ['Customer display and reliance language require separate authorization.'], 'REQUIRES_LICENSE_REVIEW', 'DEFERRED'),
  source('PUBLIC_AMENITIES', ['LOCAL_ACCESS_PRACTICAL_CONTEXT', 'BALANCED_TRADEOFFS'], 'Municipal parks, trails, libraries, and public facilities', 'HIGH', 'GOVERNED_RECORD_REFERENCE', 'UNKNOWN_REVIEW_REQUIRED', 'QUARTERLY', 'HIGH', 'INTERNAL_ONLY', 'ELIGIBLE_AFTER_REVIEW', 'SOURCE_NAME', ['Amenity presence should not imply suitability for any customer group.'], 'CONTRACT_DEFINED', 'MEDIUM'),
  source('SCHOOL_DISTRICT_BOUNDARIES', ['VERIFICATION_QUESTIONS'], 'District and boundary references', 'HIGH', 'GOVERNED_RECORD_REFERENCE', 'UNKNOWN_REVIEW_REQUIRED', 'ANNUAL', 'HIGH', 'INTERNAL_ONLY', 'ELIGIBLE_AFTER_REVIEW', 'SOURCE_AND_LICENSE', ['Neutral boundary verification only; no school scoring or ranking.'], 'CONTRACT_DEFINED', 'LOW'),
  source('LOCAL_GOVERNMENT_INFORMATION', ['LOCAL_ACCESS_PRACTICAL_CONTEXT', 'VERIFICATION_QUESTIONS'], 'Official local government pages', 'HIGH', 'GOVERNED_RECORD_REFERENCE', 'UNKNOWN_REVIEW_REQUIRED', 'QUARTERLY', 'HIGH', 'INTERNAL_ONLY', 'ELIGIBLE_AFTER_REVIEW', 'SOURCE_NAME', ['Official content must be cited and not copied beyond permitted use.'], 'CONTRACT_DEFINED', 'MEDIUM'),
  source('LICENSED_EDITORIAL_IMAGERY', ['LOCAL_IMAGERY'], 'Licensed imagery sources and approvals', 'HIGH', 'MANUAL_EDITORIAL_REVIEW', 'UNKNOWN_REVIEW_REQUIRED', 'STATIC', 'HIGH', 'BLOCKED', 'ELIGIBLE_AFTER_REVIEW', 'CUSTOM_ATTRIBUTION', ['No public image is eligible without confirmed rights and editorial approval.'], 'REQUIRES_LICENSE_REVIEW', 'CRITICAL'),
  source('DQG_OWNED_KNOWLEDGE', ['HOUSING_PATTERNS', 'BALANCED_TRADEOFFS', 'VERIFICATION_QUESTIONS', 'LOCAL_IMAGERY'], 'DQG-owned editorial knowledge and media', 'MODERATE', 'MANUAL_EDITORIAL_REVIEW', 'CONFIRMED_INTERNAL', 'EVENT_DRIVEN', 'MODERATE', 'INTERNAL_ONLY', 'ELIGIBLE_AFTER_REVIEW', 'NONE', ['Must be separated from authoritative public records and reviewed before publication.'], 'CONTRACT_DEFINED', 'HIGH'),
  source('APPROVED_SECONDARY_PUBLIC_RESEARCH', ['LOCAL_ACCESS_PRACTICAL_CONTEXT', 'VERIFICATION_QUESTIONS'], 'Approved secondary public research sources', 'MODERATE', 'GOVERNED_RECORD_REFERENCE', 'UNKNOWN_REVIEW_REQUIRED', 'UNKNOWN', 'MODERATE', 'INTERNAL_ONLY', 'ELIGIBLE_AFTER_REVIEW', 'SOURCE_AND_LICENSE', ['Secondary sources can corroborate but should not become authoritative facts alone.'], 'CONTRACT_DEFINED', 'LOW'),
]);

export const CITY_INTELLIGENCE_ACQUISITION_ADAPTERS: readonly CityAcquisitionAdapter[] = Object.freeze([
  adapter('city-market-repository-adapter', 'MLS_LISTING_DATA', 'existing-market-and-listing-data'),
  adapter('city-government-reference-adapter', 'LOCAL_GOVERNMENT_INFORMATION', 'future-local-government-record-reference'),
  adapter('city-imagery-rights-adapter', 'LICENSED_EDITORIAL_IMAGERY', 'future-imagery-rights-review'),
]);

export const COLORADO_CITY_INTELLIGENCE_RECORDS: readonly CityIntelligenceRecord[] = Object.freeze([
  cityRecord({
    cityKey: 'boulder',
    canonicalName: 'Boulder',
    maturity: 'EDITORIALLY_CERTIFIED',
    publicEligibility: true,
    editorialStatus: 'APPROVED',
    counties: ['Boulder County'],
    neighborhoods: ['Downtown Boulder', 'North Boulder', 'South Boulder', 'Gunbarrel', 'Table Mesa', 'Mapleton Hill', 'Chautauqua', 'Wonderland Hills'],
    domainCompleteness: certifiedCompleteness(),
    evidence: [
      evidence('CIF-EVD-BOU-MARKET', 'MLS_LISTING_DATA', 'Boulder', 'MARKET_INTERPRETATION', 'Boulder governed market metrics support market context.'),
      evidence('CIF-EVD-BOU-NEIGHBORHOODS', 'DQG_OWNED_KNOWLEDGE', 'Boulder', 'NEIGHBORHOOD_RELATIONSHIPS', 'Repository neighborhood records support Boulder neighborhood continuity.'),
      evidence('CIF-EVD-BOU-TRADEOFFS', 'DQG_OWNED_KNOWLEDGE', 'Boulder', 'BALANCED_TRADEOFFS', 'Reviewed editorial guidance supports neutral Boulder trade-off prompts.'),
    ],
    imagery: [approvedFallbackImage('CIF-IMG-BOU-FALLBACK', 'Boulder')],
    balancedTradeoffs: ['Compare city-market context, neighborhood evidence, and property condition separately before deciding whether an individual home deserves attention.'],
    verificationQuestions: ['Which property records, condition items, disclosures, insurance questions, and neighborhood evidence should be verified before touring?'],
    missingSourceCategories: [],
    unresolvedConflicts: [],
    freshness: 'CURRENT',
    confidence: 'HIGH',
    blockedReasons: [],
  }),
  cityRecord({
    cityKey: 'louisville',
    canonicalName: 'Louisville',
    maturity: 'EDITORIALLY_CERTIFIED',
    publicEligibility: true,
    editorialStatus: 'APPROVED',
    counties: ['Boulder County'],
    neighborhoods: ['Old Town Louisville', 'Coal Creek Ranch', 'Centennial Valley', 'North End', 'Steel Ranch'],
    domainCompleteness: certifiedCompleteness(),
    evidence: [
      evidence('CIF-EVD-LOU-MARKET', 'MLS_LISTING_DATA', 'Louisville', 'MARKET_INTERPRETATION', 'Louisville governed market metrics support market context.'),
      evidence('CIF-EVD-LOU-NEIGHBORHOODS', 'DQG_OWNED_KNOWLEDGE', 'Louisville', 'NEIGHBORHOOD_RELATIONSHIPS', 'Repository neighborhood records support Louisville neighborhood continuity.'),
      evidence('CIF-EVD-LOU-TRADEOFFS', 'DQG_OWNED_KNOWLEDGE', 'Louisville', 'BALANCED_TRADEOFFS', 'Reviewed editorial guidance supports neutral Louisville trade-off prompts.'),
    ],
    imagery: [approvedFallbackImage('CIF-IMG-LOU-FALLBACK', 'Louisville')],
    balancedTradeoffs: ['Use Louisville city context to frame questions, then verify property-specific age, condition, records, costs, and financing preparation.'],
    verificationQuestions: ['Which Louisville neighborhood pattern and property-specific facts should be checked before comparing this home against alternatives?'],
    missingSourceCategories: [],
    unresolvedConflicts: [],
    freshness: 'CURRENT',
    confidence: 'HIGH',
    blockedReasons: [],
  }),
  cityRecord({
    cityKey: 'broomfield',
    canonicalName: 'Broomfield',
    maturity: 'FOUNDATION',
    publicEligibility: false,
    editorialStatus: 'NOT_REVIEWED',
    counties: ['Broomfield County'],
    neighborhoods: [],
    domainCompleteness: partialCompleteness(['MARKET_INTERPRETATION', 'VERIFICATION_QUESTIONS']),
    evidence: [evidence('CIF-EVD-BRO-MARKET', 'MLS_LISTING_DATA', 'Broomfield', 'MARKET_INTERPRETATION', 'Broomfield governed market metrics support a foundation market context.')],
    imagery: [blockedImage('CIF-IMG-BRO-REVIEW', 'Broomfield')],
    balancedTradeoffs: [],
    verificationQuestions: ['Which property facts and records should be verified before narrowing search results?'],
    missingSourceCategories: ['COUNTY_ASSESSOR', 'BUILDING_PERMITS', 'LICENSED_EDITORIAL_IMAGERY'],
    unresolvedConflicts: [],
    freshness: 'CURRENT',
    confidence: 'MODERATE',
    blockedReasons: ['Domain completeness is below evidence-complete threshold for the acquisition system.'],
  }),
  cityRecord({
    cityKey: 'superior',
    canonicalName: 'Superior',
    maturity: 'EVIDENCE_IN_PROGRESS',
    publicEligibility: false,
    editorialStatus: 'REVIEW_QUEUE',
    counties: ['Boulder County', 'Jefferson County'],
    neighborhoods: ['Rock Creek', 'Original Superior', 'Downtown Superior'],
    domainCompleteness: partialCompleteness(['NEIGHBORHOOD_RELATIONSHIPS', 'LOCAL_ACCESS_PRACTICAL_CONTEXT', 'VERIFICATION_QUESTIONS']),
    evidence: [
      evidence('CIF-EVD-SUP-NEIGHBORHOODS', 'DQG_OWNED_KNOWLEDGE', 'Superior', 'NEIGHBORHOOD_RELATIONSHIPS', 'Repository neighborhood records exist but market route requirements remain incomplete.'),
      conflictEvidence('CIF-EVD-SUP-BOUNDARY-CONFLICT', 'SUBDIVISION_PARCEL_RELATIONSHIPS', 'Superior', 'NEIGHBORHOOD_RELATIONSHIPS', 'County and municipal relationship evidence requires governed review.'),
    ],
    imagery: [blockedImage('CIF-IMG-SUP-REVIEW', 'Superior')],
    balancedTradeoffs: [],
    verificationQuestions: ['Which municipal, county, and subdivision boundaries should be verified before making location assumptions?'],
    missingSourceCategories: ['MLS_LISTING_DATA', 'LICENSED_EDITORIAL_IMAGERY'],
    unresolvedConflicts: ['CIF-CONFLICT-SUP-BOUNDARY'],
    freshness: 'AGING',
    confidence: 'MODERATE',
    blockedReasons: ['Market-route/data requirements are incomplete and boundary conflict must be preserved.'],
  }),
  cityRecord({
    cityKey: 'niwot',
    canonicalName: 'Niwot',
    maturity: 'FOUNDATION',
    publicEligibility: false,
    editorialStatus: 'NOT_REVIEWED',
    counties: ['Boulder County'],
    neighborhoods: [],
    domainCompleteness: partialCompleteness(['MARKET_INTERPRETATION']),
    evidence: [evidence('CIF-EVD-NIW-MARKET', 'MLS_LISTING_DATA', 'Niwot', 'MARKET_INTERPRETATION', 'Niwot has market context but lacks supported search-city guide eligibility.')],
    imagery: [blockedImage('CIF-IMG-NIW-REVIEW', 'Niwot')],
    balancedTradeoffs: [],
    verificationQuestions: [],
    missingSourceCategories: ['MLS_LISTING_DATA', 'COUNTY_ASSESSOR', 'LICENSED_EDITORIAL_IMAGERY'],
    unresolvedConflicts: [],
    freshness: 'CURRENT',
    confidence: 'LOW',
    blockedReasons: ['Search-city support is absent; public guide publication must fail closed.'],
  }),
]);

export function runCityIntelligenceAcquisition({
  adapterId,
  cityKey,
  mode,
}: {
  adapterId: string;
  cityKey: string;
  mode: 'dry-run' | 'execute';
}): CityAcquisitionResult {
  const adapterConfig = CITY_INTELLIGENCE_ACQUISITION_ADAPTERS.find((item) => item.adapterId === adapterId);
  if (!adapterConfig) throw new Error(`Unknown city intelligence adapter: ${adapterId}`);
  const city = getCityIntelligenceRecord(cityKey);
  if (!city) throw new Error(`Unknown city intelligence record: ${cityKey}`);

  if (mode === 'execute') {
    return {
      adapterId,
      cityKey,
      mode,
      status: 'EXECUTE_BLOCKED',
      activation: GIS_FAIL_CLOSED_ACTIVATION,
      evidenceVersionCreated: false,
      customerVisibleChange: false,
      reason: 'Execute mode is contract-defined but blocked until source rights, credentials, and persistence authorization are separately approved.',
    };
  }

  return {
    adapterId,
    cityKey,
    mode,
    status: adapterConfig.executeAuthorized ? 'SOURCE_DEFERRED' : 'DRY_RUN_READY',
    activation: GIS_FAIL_CLOSED_ACTIVATION,
    evidenceVersionCreated: false,
    customerVisibleChange: false,
    reason: 'Dry-run validates adapter identity, source identity, idempotency boundary, and city/domain progress without acquiring external data.',
  };
}

export function getCityIntelligenceRecord(cityKey: string): CityIntelligenceRecord | null {
  return COLORADO_CITY_INTELLIGENCE_RECORDS.find((record) => record.cityKey === cityKey) ?? null;
}

export function isEvidenceComplete(record: CityIntelligenceRecord): boolean {
  return REQUIRED_CITY_INTELLIGENCE_DOMAINS.every((domain) => {
    const status = record.domainCompleteness[domain];
    return status === 'COMPLETE' || status === 'CERTIFIED';
  });
}

export function isEditorialCertificationEligible(record: CityIntelligenceRecord): boolean {
  return isEvidenceComplete(record)
    && record.editorialStatus === 'APPROVED'
    && record.imagery.every((image) => image.publicEligibility && image.editorialApproval)
    && record.unresolvedConflicts.length === 0
    && record.blockedReasons.length === 0;
}

export function synthesizeCityGuideIntelligence(record: CityIntelligenceRecord): SynthesizedCityGuideIntelligence {
  const missingDomains = REQUIRED_CITY_INTELLIGENCE_DOMAINS.filter((domain) => {
    const completeness = record.domainCompleteness[domain];
    return completeness !== 'COMPLETE' && completeness !== 'CERTIFIED';
  });

  if (missingDomains.length > 0 || record.blockedReasons.length > 0 || record.unresolvedConflicts.length > 0) {
    return {
      cityKey: record.cityKey,
      maturity: record.maturity,
      publishable: false,
      facts: [],
      interpretations: [],
      tradeoffs: [],
      verificationQuestions: record.verificationQuestions,
      missingDomains,
      evidenceIds: record.evidence.map((item) => item.evidenceId),
      failClosedReason: [...record.blockedReasons, ...record.unresolvedConflicts, ...missingDomains].join('; '),
    };
  }

  return {
    cityKey: record.cityKey,
    maturity: record.maturity,
    publishable: record.publicEligibility,
    facts: record.evidence.map((item) => item.claimText),
    interpretations: [`${record.canonicalName} has certified city intelligence suitable for guide-ready bounded interpretation.`],
    tradeoffs: record.balancedTradeoffs,
    verificationQuestions: record.verificationQuestions,
    missingDomains: [],
    evidenceIds: record.evidence.map((item) => item.evidenceId),
    failClosedReason: record.publicEligibility ? null : 'Record is internally complete but not public eligible.',
  };
}

export function buildStatewideCityIntelligenceCoverageReport() {
  const maturityCounts = COLORADO_CITY_INTELLIGENCE_RECORDS.reduce<Record<CityIntelligenceMaturity, number>>(
    (counts, record) => ({ ...counts, [record.maturity]: counts[record.maturity] + 1 }),
    {
      FOUNDATION: 0,
      EVIDENCE_IN_PROGRESS: 0,
      EVIDENCE_COMPLETE: 0,
      EDITORIALLY_CERTIFIED: 0,
      CONTINUOUSLY_MAINTAINED: 0,
    },
  );

  const completenessByDomain = REQUIRED_CITY_INTELLIGENCE_DOMAINS.reduce<Record<CityIntelligenceDomain, number>>((counts, domain) => {
    counts[domain] = COLORADO_CITY_INTELLIGENCE_RECORDS.filter((record) => {
      const status = record.domainCompleteness[domain];
      return status === 'COMPLETE' || status === 'CERTIFIED';
    }).length;
    return counts;
  }, {} as Record<CityIntelligenceDomain, number>);

  return {
    totalRegisteredCities: COLORADO_CITY_INTELLIGENCE_RECORDS.length,
    maturityCounts,
    completenessByDomain,
    missingSourceCategories: Array.from(new Set(COLORADO_CITY_INTELLIGENCE_RECORDS.flatMap((record) => record.missingSourceCategories))).sort(),
    staleEvidence: COLORADO_CITY_INTELLIGENCE_RECORDS.filter((record) => record.freshness === 'STALE' || record.freshness === 'EXPIRED').map((record) => record.cityKey),
    unresolvedConflicts: COLORADO_CITY_INTELLIGENCE_RECORDS.flatMap((record) => record.unresolvedConflicts),
    missingImagery: COLORADO_CITY_INTELLIGENCE_RECORDS.filter((record) => !record.imagery.some((image) => image.publicEligibility)).map((record) => record.cityKey),
    editorialReviewQueue: COLORADO_CITY_INTELLIGENCE_RECORDS.filter((record) => record.editorialStatus === 'REVIEW_QUEUE').map((record) => record.cityKey),
    publiclyEligibleGuides: COLORADO_CITY_INTELLIGENCE_RECORDS.filter((record) => record.publicEligibility).map((record) => record.cityKey),
    blockedGuides: COLORADO_CITY_INTELLIGENCE_RECORDS.filter((record) => record.blockedReasons.length > 0).map((record) => ({
      cityKey: record.cityKey,
      reasons: record.blockedReasons,
    })),
  } as const;
}

function source(
  category: CityIntelligenceSourceCategory,
  intelligenceDomains: readonly CityIntelligenceDomain[],
  geographicCoverage: string,
  authorityLevel: SourceAuthorityLevel,
  accessMethod: SourceAccessMethod,
  licensingOrPermittedUse: CitySourceDomainProfile['licensingOrPermittedUse'],
  updateFrequency: CitySourceDomainProfile['updateFrequency'],
  expectedReliability: SourceAuthorityLevel,
  publicDisplayEligibility: PublicEligibility,
  storageEligibility: CitySourceDomainProfile['storageEligibility'],
  attributionRequirement: CitySourceDomainProfile['attributionRequirement'],
  knownLimitations: readonly string[],
  adapterReadiness: SourceReadiness,
  implementationPriority: CitySourceDomainProfile['implementationPriority'],
): CitySourceDomainProfile {
  return {
    category,
    intelligenceDomains,
    geographicCoverage,
    authorityLevel,
    accessMethod,
    licensingOrPermittedUse,
    updateFrequency,
    expectedReliability,
    publicDisplayEligibility,
    storageEligibility,
    attributionRequirement,
    knownLimitations,
    adapterReadiness,
    implementationPriority,
  };
}

function adapter(adapterId: string, sourceCategory: CityIntelligenceSourceCategory, sourceIdentity: string): CityAcquisitionAdapter {
  return {
    adapterId,
    sourceCategory,
    sourceIdentity,
    modeSupport: ['dry-run', 'execute'],
    executeAuthorized: false,
    idempotencyKeyPattern: `${adapterId}:{cityKey}:{sourceIdentity}:{evidenceVersion}`,
    evidenceDeduplication: true,
    versioning: true,
    conflictPreservation: true,
    sourceFailureIsolation: true,
    retryBoundary: 'NO_RETRY_WITHOUT_OPERATOR',
    customerVisiblePartialClaims: false,
    batchProcessing: 'CONTROLLED_BATCH_ONLY',
    progressReporting: 'CITY_DOMAIN_STATUS',
  };
}

function certifiedCompleteness(): Record<CityIntelligenceDomain, DomainCompleteness> {
  return {
    HOUSING_PATTERNS: 'CERTIFIED',
    NEIGHBORHOOD_RELATIONSHIPS: 'CERTIFIED',
    LOCAL_ACCESS_PRACTICAL_CONTEXT: 'CERTIFIED',
    BALANCED_TRADEOFFS: 'CERTIFIED',
    LOCAL_IMAGERY: 'CERTIFIED',
    MARKET_INTERPRETATION: 'CERTIFIED',
    VERIFICATION_QUESTIONS: 'CERTIFIED',
  };
}

function partialCompleteness(completeDomains: readonly CityIntelligenceDomain[]): Record<CityIntelligenceDomain, DomainCompleteness> {
  return REQUIRED_CITY_INTELLIGENCE_DOMAINS.reduce<Record<CityIntelligenceDomain, DomainCompleteness>>((completeness, domain) => {
    completeness[domain] = completeDomains.includes(domain) ? 'COMPLETE' : 'MISSING';
    return completeness;
  }, {} as Record<CityIntelligenceDomain, DomainCompleteness>);
}

function cityRecord(input: Omit<CityIntelligenceRecord, 'geographic'> & {
  counties: readonly string[];
  neighborhoods: readonly string[];
}): CityIntelligenceRecord {
  return {
    ...input,
    geographic: {
      state: 'Colorado',
      county: input.counties,
      municipalityOrCensusPlace: input.canonicalName,
      city: input.canonicalName,
      neighborhoods: input.neighborhoods,
      subdivisionsOrDistricts: [],
      parcelOrPropertyRelationshipStatus: 'CONTRACT_DEFINED',
      aliases: [],
      overlappingBoundaries: input.counties.length > 1 ? input.counties : [],
      sourceDisagreements: input.unresolvedConflicts,
      temporalChangeSupport: true,
      publicGisActivated: false,
    },
  };
}

function evidence(
  evidenceId: string,
  sourceCategory: CityIntelligenceSourceCategory,
  geographicSubject: string,
  domain: CityIntelligenceDomain,
  claimText: string,
): CityEvidenceReference {
  return {
    evidenceId,
    sourceCategory,
    sourceIdentity: `source:${sourceCategory}`,
    acquisitionRecordId: `acquisition:${evidenceId}`,
    evidenceVersionId: `version:${evidenceId}:1`,
    observationDate: COLORADO_CITY_INTELLIGENCE_REFERENCE_DATE,
    effectiveDate: null,
    geographicSubject,
    domain,
    confidence: sourceCategory === 'MLS_LISTING_DATA' ? 'HIGH' : 'MODERATE',
    freshness: 'CURRENT',
    permittedUse: 'INTERNAL_ONLY',
    publicDisplayEligible: false,
    supersessionStatus: 'CURRENT',
    conflictStatus: 'NONE',
    claimText,
  };
}

function conflictEvidence(
  evidenceId: string,
  sourceCategory: CityIntelligenceSourceCategory,
  geographicSubject: string,
  domain: CityIntelligenceDomain,
  claimText: string,
): CityEvidenceReference {
  return {
    ...evidence(evidenceId, sourceCategory, geographicSubject, domain, claimText),
    conflictStatus: 'PRESERVED_UNRESOLVED',
  };
}

function approvedFallbackImage(imageIdentity: string, cityOrLocation: string): CityImageryEligibility {
  return {
    imageIdentity,
    cityOrLocation,
    role: 'FALLBACK',
    ownerOrProvider: 'DQG approved fallback visual system',
    licenseOrPermittedUse: 'CONFIRMED_PUBLIC_DISPLAY',
    attribution: null,
    freshness: 'CURRENT',
    editorialApproval: true,
    publicEligibility: true,
    fallbackAsset: '/placeholder-home.jpg',
  };
}

function blockedImage(imageIdentity: string, cityOrLocation: string): CityImageryEligibility {
  return {
    imageIdentity,
    cityOrLocation,
    role: 'CITY_HERO',
    ownerOrProvider: 'Not yet approved',
    licenseOrPermittedUse: 'UNKNOWN_REVIEW_REQUIRED',
    attribution: null,
    freshness: 'UNKNOWN',
    editorialApproval: false,
    publicEligibility: false,
    fallbackAsset: '/placeholder-home.jpg',
  };
}
