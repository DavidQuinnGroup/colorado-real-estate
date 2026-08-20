import { cities } from './cities';
import { getColoradoDecisionGuideRegistry } from './coloradoDecisionGuideRegistry';
import {
  COLORADO_CITY_INTELLIGENCE_REFERENCE_DATE,
  REQUIRED_CITY_INTELLIGENCE_DOMAINS,
  type CityIntelligenceDomain,
  type CityIntelligenceMaturity,
  type CityIntelligenceSourceCategory,
  type DomainCompleteness,
} from './coloradoCityIntelligenceFactory';
import { neighborhoods } from './neighborhoods';

export const COLORADO_CITY_EVIDENCE_EXPANSION_STATUS = 'COLORADO_CITY_INTELLIGENCE_EVIDENCE_EXPANSION_1_COMPLETE';

export type EvidenceExpansionDomain = 'ASSESSOR' | 'BUILDING_PERMITS' | 'MUNICIPAL_PLANNING' | 'IMAGERY_RIGHTS' | 'MLS_DERIVED';

export type SourceRightsStatus = 'PUBLIC_TERMS_IDENTIFIED' | 'OPEN_DATA_REVIEW_REQUIRED' | 'ACCESSIBLE_REVIEW_REQUIRED' | 'BLOCKED_PENDING_RIGHTS';
export type DryRunEvidenceStatus = 'CANDIDATE_CREATED' | 'SOURCE_REVIEW_ONLY' | 'BLOCKED_PENDING_RIGHTS';

export type EvidenceExpansionSource = Readonly<{
  sourceId: string;
  domain: EvidenceExpansionDomain;
  exactSource: string;
  url: string;
  geographicCoverage: readonly string[];
  accessMethod: 'REPOSITORY_LOCAL' | 'PUBLIC_WEB_DISCOVERY' | 'PUBLIC_PORTAL_REVIEW' | 'OPEN_DATA_CATALOG_REVIEW' | 'MANUAL_RIGHTS_REVIEW';
  authorityLevel: 'AUTHORITATIVE_GOVERNMENT' | 'AUTHORITATIVE_INDUSTRY' | 'FIRST_PARTY_REIE' | 'SECONDARY_PUBLIC';
  licensingOrTerms: string;
  permittedStorage: 'YES_REPOSITORY_LOCAL' | 'INTERNAL_REVIEW_ONLY' | 'UNKNOWN_REQUIRES_REVIEW' | 'NO';
  permittedPublicDisplay: 'YES_WITH_ATTRIBUTION' | 'CUSTOMER_DISPLAY_REQUIRES_REVIEW' | 'UNKNOWN_REQUIRES_REVIEW' | 'NO';
  attributionRequirement: string;
  freshness: string;
  updateCadence: 'CONTINUOUS' | 'EVENT_DRIVEN' | 'PERIODIC' | 'UNKNOWN' | 'STATIC';
  credentialRequirement: 'NONE_IDENTIFIED' | 'ACCOUNT_OPTIONAL' | 'CREDENTIAL_REQUIRED' | 'UNKNOWN';
  expectedCost: 'NONE_IDENTIFIED' | 'POSSIBLE_RECORD_FEES' | 'LICENSE_COST_REVIEW_REQUIRED' | 'UNKNOWN';
  automationFeasibility: 'READY_REPOSITORY_LOCAL' | 'DRY_RUN_ONLY' | 'POSSIBLE_AFTER_RIGHTS_REVIEW' | 'BLOCKED_PENDING_TERMS';
  knownLimitations: readonly string[];
  rightsStatus: SourceRightsStatus;
}>;

export type EvidenceCandidate = Readonly<{
  evidenceCandidateId: string;
  city: string;
  domain: CityIntelligenceDomain;
  sourceId: string;
  status: DryRunEvidenceStatus;
  normalizedSubject: string;
  sourceCategory: CityIntelligenceSourceCategory;
  assertionKind: string;
  supportedObservation: string;
  provenance: {
    sourceIdentity: string;
    acquisitionRecordId: string;
    evidenceVersionId: string;
    observedAt: string;
    permittedStorage: EvidenceExpansionSource['permittedStorage'];
    permittedPublicDisplay: EvidenceExpansionSource['permittedPublicDisplay'];
  };
  duplicateKey: string;
  conflictKey: string | null;
  customerVisible: false;
}>;

export type ImageryRightsRecord = Readonly<{
  imageId: string;
  cityOrLocation: string;
  subject: string;
  ownerOrProvider: string;
  license: 'DQG_OWNED' | 'LICENSED_STOCK' | 'MUNICIPAL_PUBLIC_DOMAIN_CANDIDATE' | 'ATTRIBUTION_REQUIRED_CANDIDATE' | 'UNKNOWN' | 'PROHIBITED';
  attribution: string | null;
  permittedUse: 'PUBLIC_DISPLAY_CONFIRMED' | 'INTERNAL_REVIEW_ONLY' | 'UNKNOWN_REQUIRES_REVIEW' | 'PROHIBITED';
  editorialApproval: boolean;
  publicEligibility: boolean;
  fallback: string;
}>;

export type CityDomainCoverage = Readonly<{
  city: string;
  currentMaturity: CityIntelligenceMaturity;
  coverage: Readonly<Record<CityIntelligenceDomain, DomainCompleteness>>;
  evidenceCurrentlyAvailable: readonly string[];
  evidenceAcquiredInDryRun: readonly string[];
  evidenceMissing: readonly CityIntelligenceDomain[];
  blockedSources: readonly string[];
  rightsLimitations: readonly string[];
  credentialsRequired: readonly string[];
  expectedCost: readonly string[];
  resultingMaturityPotential: CityIntelligenceMaturity;
}>;

const PRIORITY_CITIES = ['Boulder', 'Louisville', 'Lafayette', 'Superior', 'Erie', 'Longmont'] as const;

export const EVIDENCE_EXPANSION_SOURCE_RIGHTS_MATRIX: readonly EvidenceExpansionSource[] = Object.freeze([
  source({
    sourceId: 'EXP-SRC-REIE-CITY-MARKET-DATA',
    domain: 'MLS_DERIVED',
    exactSource: 'Repository-local city market statistics and Decision Guide registry',
    url: 'repository:lib/cities.ts + lib/coloradoDecisionGuideRegistry.ts',
    geographicCoverage: [...PRIORITY_CITIES],
    accessMethod: 'REPOSITORY_LOCAL',
    authorityLevel: 'FIRST_PARTY_REIE',
    licensingOrTerms: 'Existing governed repository data derived from current REIE market/listing systems; public use remains bounded by existing market-source controls.',
    permittedStorage: 'YES_REPOSITORY_LOCAL',
    permittedPublicDisplay: 'CUSTOMER_DISPLAY_REQUIRES_REVIEW',
    attributionRequirement: 'Existing REIE market source controls.',
    freshness: COLORADO_CITY_INTELLIGENCE_REFERENCE_DATE,
    updateCadence: 'CONTINUOUS',
    credentialRequirement: 'NONE_IDENTIFIED',
    expectedCost: 'NONE_IDENTIFIED',
    automationFeasibility: 'READY_REPOSITORY_LOCAL',
    knownLimitations: ['Aggregated city stats do not prove parcel-level housing forms, ownership, permits, or condition.'],
    rightsStatus: 'PUBLIC_TERMS_IDENTIFIED',
  }),
  source({
    sourceId: 'EXP-SRC-BOULDER-COUNTY-OPEN-DATA',
    domain: 'ASSESSOR',
    exactSource: 'Boulder County Open Data catalog',
    url: 'https://bouldercounty.gov/government/open-data/',
    geographicCoverage: ['Boulder County'],
    accessMethod: 'OPEN_DATA_CATALOG_REVIEW',
    authorityLevel: 'AUTHORITATIVE_GOVERNMENT',
    licensingOrTerms: 'Open Data page states a broad license for datasets but directs users to review terms and dataset-specific limitations.',
    permittedStorage: 'UNKNOWN_REQUIRES_REVIEW',
    permittedPublicDisplay: 'UNKNOWN_REQUIRES_REVIEW',
    attributionRequirement: 'Source and dataset terms required before reuse.',
    freshness: 'Observed July 29, 2026',
    updateCadence: 'PERIODIC',
    credentialRequirement: 'NONE_IDENTIFIED',
    expectedCost: 'NONE_IDENTIFIED',
    automationFeasibility: 'POSSIBLE_AFTER_RIGHTS_REVIEW',
    knownLimitations: ['Dataset-specific license, field meaning, and redistribution rights must be reviewed before durable storage.'],
    rightsStatus: 'OPEN_DATA_REVIEW_REQUIRED',
  }),
  source({
    sourceId: 'EXP-SRC-BOULDER-COUNTY-ASSESSOR',
    domain: 'ASSESSOR',
    exactSource: 'Boulder County Assessor property search and Assessor Office property information',
    url: 'https://bouldercounty.gov/departments/assessor/',
    geographicCoverage: ['Boulder County'],
    accessMethod: 'PUBLIC_PORTAL_REVIEW',
    authorityLevel: 'AUTHORITATIVE_GOVERNMENT',
    licensingOrTerms: 'Public property information is discoverable; bulk storage, reuse, and customer display rights require terms review.',
    permittedStorage: 'UNKNOWN_REQUIRES_REVIEW',
    permittedPublicDisplay: 'UNKNOWN_REQUIRES_REVIEW',
    attributionRequirement: 'Boulder County Assessor attribution and field-level limitations required if approved.',
    freshness: 'Assessor page observed July 29, 2026',
    updateCadence: 'PERIODIC',
    credentialRequirement: 'NONE_IDENTIFIED',
    expectedCost: 'UNKNOWN',
    automationFeasibility: 'BLOCKED_PENDING_TERMS',
    knownLimitations: ['Do not expose individual owner intelligence; valuation context is not appraisal advice.'],
    rightsStatus: 'ACCESSIBLE_REVIEW_REQUIRED',
  }),
  source({
    sourceId: 'EXP-SRC-BOULDER-COUNTY-ACCELA',
    domain: 'BUILDING_PERMITS',
    exactSource: 'Boulder County Accela Citizen Access',
    url: 'https://aca-prod.accela.com/BOCO/',
    geographicCoverage: ['Boulder County unincorporated and supported county permit records'],
    accessMethod: 'PUBLIC_PORTAL_REVIEW',
    authorityLevel: 'AUTHORITATIVE_GOVERNMENT',
    licensingOrTerms: 'Portal access is visible; automation, storage, and reuse rights are not established.',
    permittedStorage: 'UNKNOWN_REQUIRES_REVIEW',
    permittedPublicDisplay: 'UNKNOWN_REQUIRES_REVIEW',
    attributionRequirement: 'Boulder County Community Planning & Permitting attribution if approved.',
    freshness: 'Portal observed July 29, 2026',
    updateCadence: 'EVENT_DRIVEN',
    credentialRequirement: 'ACCOUNT_OPTIONAL',
    expectedCost: 'UNKNOWN',
    automationFeasibility: 'BLOCKED_PENDING_TERMS',
    knownLimitations: ['Permit records cannot support individual property-condition conclusions without review.'],
    rightsStatus: 'ACCESSIBLE_REVIEW_REQUIRED',
  }),
  source({
    sourceId: 'EXP-SRC-CITY-BOULDER-PERMIT-PLANNING-RECORDS',
    domain: 'BUILDING_PERMITS',
    exactSource: 'City of Boulder Planning & Development Services records request resources',
    url: 'https://bouldercolorado.gov/planning-development-services-records-request-resources',
    geographicCoverage: ['City of Boulder'],
    accessMethod: 'PUBLIC_WEB_DISCOVERY',
    authorityLevel: 'AUTHORITATIVE_GOVERNMENT',
    licensingOrTerms: 'City records page explains permit and planning research resources and limits CORA requests to records, not interpretation.',
    permittedStorage: 'INTERNAL_REVIEW_ONLY',
    permittedPublicDisplay: 'CUSTOMER_DISPLAY_REQUIRES_REVIEW',
    attributionRequirement: 'City of Boulder Planning & Development Services attribution and record date.',
    freshness: 'Observed July 29, 2026',
    updateCadence: 'EVENT_DRIVEN',
    credentialRequirement: 'ACCOUNT_OPTIONAL',
    expectedCost: 'POSSIBLE_RECORD_FEES',
    automationFeasibility: 'DRY_RUN_ONLY',
    knownLimitations: ['City states records requests do not create summaries or custom research; REIE must not imply official interpretation.'],
    rightsStatus: 'OPEN_DATA_REVIEW_REQUIRED',
  }),
  source({
    sourceId: 'EXP-SRC-CITY-BOULDER-PLANNING-DEVELOPMENT',
    domain: 'MUNICIPAL_PLANNING',
    exactSource: 'City of Boulder Planning & Development Services and project/open data references',
    url: 'https://bouldercolorado.gov/government/departments/planning-development-services',
    geographicCoverage: ['City of Boulder'],
    accessMethod: 'PUBLIC_WEB_DISCOVERY',
    authorityLevel: 'AUTHORITATIVE_GOVERNMENT',
    licensingOrTerms: 'Public planning pages and open data references are discoverable; plan status, effective dates, and reuse terms require record-level review.',
    permittedStorage: 'INTERNAL_REVIEW_ONLY',
    permittedPublicDisplay: 'CUSTOMER_DISPLAY_REQUIRES_REVIEW',
    attributionRequirement: 'City of Boulder source, plan name, effective date, and access date.',
    freshness: 'Observed July 29, 2026',
    updateCadence: 'EVENT_DRIVEN',
    credentialRequirement: 'NONE_IDENTIFIED',
    expectedCost: 'NONE_IDENTIFIED',
    automationFeasibility: 'DRY_RUN_ONLY',
    knownLimitations: ['Planning documents must not be framed as forecasts or guarantees.'],
    rightsStatus: 'OPEN_DATA_REVIEW_REQUIRED',
  }),
  source({
    sourceId: 'EXP-SRC-BOULDER-COUNTY-RECORDER',
    domain: 'ASSESSOR',
    exactSource: 'Boulder County Clerk and Recorder official records search',
    url: 'https://boulder.co.ds.search.govos.com/',
    geographicCoverage: ['Boulder County recorded documents'],
    accessMethod: 'PUBLIC_PORTAL_REVIEW',
    authorityLevel: 'AUTHORITATIVE_GOVERNMENT',
    licensingOrTerms: 'Search portal is accessible; document reuse, OCR/full-text use, fees, and public display rights require review.',
    permittedStorage: 'UNKNOWN_REQUIRES_REVIEW',
    permittedPublicDisplay: 'UNKNOWN_REQUIRES_REVIEW',
    attributionRequirement: 'Boulder County Clerk and Recorder attribution and document identity if approved.',
    freshness: 'Observed July 29, 2026',
    updateCadence: 'EVENT_DRIVEN',
    credentialRequirement: 'UNKNOWN',
    expectedCost: 'POSSIBLE_RECORD_FEES',
    automationFeasibility: 'BLOCKED_PENDING_TERMS',
    knownLimitations: ['Recorded documents may support verification prompts but not legal interpretation.'],
    rightsStatus: 'ACCESSIBLE_REVIEW_REQUIRED',
  }),
  source({
    sourceId: 'EXP-SRC-DQG-IMAGERY-INVENTORY',
    domain: 'IMAGERY_RIGHTS',
    exactSource: 'DQG-owned or separately licensed imagery inventory',
    url: 'repository:public imagery assets + future rights ledger',
    geographicCoverage: [...PRIORITY_CITIES],
    accessMethod: 'MANUAL_RIGHTS_REVIEW',
    authorityLevel: 'FIRST_PARTY_REIE',
    licensingOrTerms: 'Requires asset-level proof of ownership, license, attribution, editorial approval, and public eligibility.',
    permittedStorage: 'INTERNAL_REVIEW_ONLY',
    permittedPublicDisplay: 'CUSTOMER_DISPLAY_REQUIRES_REVIEW',
    attributionRequirement: 'Asset-specific.',
    freshness: 'Rights ledger not yet complete',
    updateCadence: 'STATIC',
    credentialRequirement: 'NONE_IDENTIFIED',
    expectedCost: 'LICENSE_COST_REVIEW_REQUIRED',
    automationFeasibility: 'DRY_RUN_ONLY',
    knownLimitations: ['Unknown or absent rights fail closed to existing fallback imagery.'],
    rightsStatus: 'BLOCKED_PENDING_RIGHTS',
  }),
]);

export const IMAGERY_RIGHTS_INVENTORY: readonly ImageryRightsRecord[] = Object.freeze([
  image('IMG-DQG-FALLBACK-HOME', 'All supported cities', 'Existing fallback listing/home visual', 'DQG approved fallback visual system', 'DQG_OWNED', null, 'PUBLIC_DISPLAY_CONFIRMED', true, true, '/placeholder-home.jpg'),
  image('IMG-BOULDER-HERO-CANDIDATE', 'Boulder', 'City hero / Flatirons or streetscape candidate', 'To be confirmed', 'UNKNOWN', null, 'UNKNOWN_REQUIRES_REVIEW', false, false, '/placeholder-home.jpg'),
  image('IMG-LOUISVILLE-HERO-CANDIDATE', 'Louisville', 'City hero candidate', 'To be confirmed', 'UNKNOWN', null, 'UNKNOWN_REQUIRES_REVIEW', false, false, '/placeholder-home.jpg'),
  image('IMG-LAFAYETTE-HERO-CANDIDATE', 'Lafayette', 'City hero candidate', 'To be confirmed', 'UNKNOWN', null, 'UNKNOWN_REQUIRES_REVIEW', false, false, '/placeholder-home.jpg'),
  image('IMG-SUPERIOR-HERO-CANDIDATE', 'Superior', 'City hero candidate', 'To be confirmed', 'UNKNOWN', null, 'UNKNOWN_REQUIRES_REVIEW', false, false, '/placeholder-home.jpg'),
  image('IMG-ERIE-HERO-CANDIDATE', 'Erie', 'City hero candidate', 'To be confirmed', 'UNKNOWN', null, 'UNKNOWN_REQUIRES_REVIEW', false, false, '/placeholder-home.jpg'),
  image('IMG-LONGMONT-HERO-CANDIDATE', 'Longmont', 'City hero candidate', 'To be confirmed', 'UNKNOWN', null, 'UNKNOWN_REQUIRES_REVIEW', false, false, '/placeholder-home.jpg'),
]);

export function runEvidenceExpansionDryRun(): readonly EvidenceCandidate[] {
  const decisionGuideRegistry = getColoradoDecisionGuideRegistry();
  return PRIORITY_CITIES.flatMap((cityName) => {
    const city = cities.find((cityRecord) => cityRecord.name === cityName);
    const registryEntry = decisionGuideRegistry.find((entry) => entry.canonicalName === cityName);

    if (!city) {
      return [
        blockedCandidate(cityName, 'VERIFICATION_QUESTIONS', 'EXP-SRC-REIE-CITY-MARKET-DATA', 'MLS_LISTING_DATA', 'missing-city-market-record', `${cityName} remains blocked for evidence acquisition because no repository-local city market record is available.`),
      ];
    }

    const cityNeighborhoods = neighborhoods.filter((neighborhood) => neighborhood.city === city.name);
    const candidates: EvidenceCandidate[] = [
      candidate(city.name, 'MARKET_INTERPRETATION', 'EXP-SRC-REIE-CITY-MARKET-DATA', 'MLS_LISTING_DATA', 'city-market-statistics', `Repository city data has ${city.stats.inventory} active inventory signal, ${city.stats.daysOnMarket} days-on-market context, and ${city.stats.medianPrice} median-price context.`),
      candidate(city.name, 'HOUSING_PATTERNS', 'EXP-SRC-REIE-CITY-MARKET-DATA', 'MLS_LISTING_DATA', 'housing-market-foundation', `Repository city data supports bounded market-level housing context for ${city.name}; parcel-level housing forms remain unverified.`),
    ];

    if (cityNeighborhoods.length > 0) {
      candidates.push(
        candidate(city.name, 'NEIGHBORHOOD_RELATIONSHIPS', 'EXP-SRC-REIE-CITY-MARKET-DATA', 'DQG_OWNED_KNOWLEDGE', 'repository-neighborhood-relationships', `${city.name} has ${cityNeighborhoods.length} repository neighborhood relationships available for internal review.`),
      );
    }

    if (!registryEntry?.publicEligibility) {
      candidates.push(blockedCandidate(city.name, 'VERIFICATION_QUESTIONS', 'EXP-SRC-REIE-CITY-MARKET-DATA', 'MLS_LISTING_DATA', 'guide-eligibility-gap', `${city.name} remains blocked for public guide maturity advancement until registry eligibility gaps are resolved.`));
    }

    return candidates;
  });
}

export function buildBoulderCountyEvidenceCoverageMatrix(): readonly CityDomainCoverage[] {
  const candidates = runEvidenceExpansionDryRun();
  return PRIORITY_CITIES.map((cityName) => {
    const cityCandidates = candidates.filter((candidateItem) => candidateItem.city === cityName);
    const completeDomains = new Set(cityCandidates.filter((candidateItem) => candidateItem.status === 'CANDIDATE_CREATED').map((candidateItem) => candidateItem.domain));
    const missing = REQUIRED_CITY_INTELLIGENCE_DOMAINS.filter((domain) => !completeDomains.has(domain));
    const blockedSources = EVIDENCE_EXPANSION_SOURCE_RIGHTS_MATRIX
      .filter((sourceItem) => sourceItem.geographicCoverage.includes(cityName) || sourceItem.geographicCoverage.includes('Boulder County'))
      .filter((sourceItem) => sourceItem.rightsStatus !== 'PUBLIC_TERMS_IDENTIFIED')
      .map((sourceItem) => sourceItem.sourceId);
    const registry = getColoradoDecisionGuideRegistry().find((entry) => entry.canonicalName === cityName);

    return {
      city: cityName,
      currentMaturity: registry?.guideMaturity === 'EDITORIALLY_CERTIFIED' ? 'EDITORIALLY_CERTIFIED' : 'FOUNDATION',
      coverage: REQUIRED_CITY_INTELLIGENCE_DOMAINS.reduce<Record<CityIntelligenceDomain, DomainCompleteness>>((coverage, domain) => {
        coverage[domain] = completeDomains.has(domain) ? 'PARTIAL' : 'MISSING';
        return coverage;
      }, {} as Record<CityIntelligenceDomain, DomainCompleteness>),
      evidenceCurrentlyAvailable: cityCandidates.map((candidateItem) => candidateItem.evidenceCandidateId),
      evidenceAcquiredInDryRun: cityCandidates.filter((candidateItem) => candidateItem.status === 'CANDIDATE_CREATED').map((candidateItem) => candidateItem.evidenceCandidateId),
      evidenceMissing: missing,
      blockedSources,
      rightsLimitations: blockedSources,
      credentialsRequired: EVIDENCE_EXPANSION_SOURCE_RIGHTS_MATRIX.filter((sourceItem) => sourceItem.credentialRequirement !== 'NONE_IDENTIFIED').map((sourceItem) => sourceItem.sourceId),
      expectedCost: EVIDENCE_EXPANSION_SOURCE_RIGHTS_MATRIX.filter((sourceItem) => sourceItem.expectedCost !== 'NONE_IDENTIFIED').map((sourceItem) => sourceItem.sourceId),
      resultingMaturityPotential: resultingMaturity(registry?.guideMaturity === 'EDITORIALLY_CERTIFIED', missing.length, blockedSources.length),
    };
  });
}

export function getCitiesEligibleForMaturityAdvancement(): readonly { city: string; from: CityIntelligenceMaturity; to: CityIntelligenceMaturity; blockers: readonly string[] }[] {
  return buildBoulderCountyEvidenceCoverageMatrix().map((row) => ({
    city: row.city,
    from: row.currentMaturity,
    to: row.resultingMaturityPotential,
    blockers: [...row.evidenceMissing, ...row.blockedSources],
  }));
}

function source(input: EvidenceExpansionSource): EvidenceExpansionSource {
  return input;
}

function candidate(
  city: string,
  domain: CityIntelligenceDomain,
  sourceId: string,
  sourceCategory: CityIntelligenceSourceCategory,
  assertionKind: string,
  supportedObservation: string,
): EvidenceCandidate {
  const sourceItem = EVIDENCE_EXPANSION_SOURCE_RIGHTS_MATRIX.find((sourceRecord) => sourceRecord.sourceId === sourceId);
  if (!sourceItem) throw new Error(`Unknown evidence expansion source: ${sourceId}`);
  return {
    evidenceCandidateId: `EXP-EVD-${city.toUpperCase().replace(/[^A-Z0-9]/g, '-')}-${domain}`,
    city,
    domain,
    sourceId,
    status: sourceItem.automationFeasibility === 'READY_REPOSITORY_LOCAL' ? 'CANDIDATE_CREATED' : 'SOURCE_REVIEW_ONLY',
    normalizedSubject: `Colorado|${city}`,
    sourceCategory,
    assertionKind,
    supportedObservation,
    provenance: {
      sourceIdentity: sourceId,
      acquisitionRecordId: `EXP-DRYRUN-${sourceId}-${city}`,
      evidenceVersionId: `EXP-V1-${sourceId}-${city}-${domain}`,
      observedAt: COLORADO_CITY_INTELLIGENCE_REFERENCE_DATE,
      permittedStorage: sourceItem.permittedStorage,
      permittedPublicDisplay: sourceItem.permittedPublicDisplay,
    },
    duplicateKey: `${city}:${domain}:${sourceId}:${assertionKind}`,
    conflictKey: null,
    customerVisible: false,
  };
}

function blockedCandidate(
  city: string,
  domain: CityIntelligenceDomain,
  sourceId: string,
  sourceCategory: CityIntelligenceSourceCategory,
  assertionKind: string,
  supportedObservation: string,
): EvidenceCandidate {
  return {
    ...candidate(city, domain, sourceId, sourceCategory, assertionKind, supportedObservation),
    status: 'BLOCKED_PENDING_RIGHTS',
    conflictKey: `BLOCKED-${city}-${domain}`,
  };
}

function image(
  imageId: string,
  cityOrLocation: string,
  subject: string,
  ownerOrProvider: string,
  license: ImageryRightsRecord['license'],
  attribution: string | null,
  permittedUse: ImageryRightsRecord['permittedUse'],
  editorialApproval: boolean,
  publicEligibility: boolean,
  fallback: string,
): ImageryRightsRecord {
  return { imageId, cityOrLocation, subject, ownerOrProvider, license, attribution, permittedUse, editorialApproval, publicEligibility, fallback };
}

function resultingMaturity(editoriallyCertified: boolean, missingDomainCount: number, blockedSourceCount: number): CityIntelligenceMaturity {
  if (editoriallyCertified) return 'EDITORIALLY_CERTIFIED';
  if (missingDomainCount === 0 && blockedSourceCount === 0) return 'EVIDENCE_COMPLETE';
  if (missingDomainCount < REQUIRED_CITY_INTELLIGENCE_DOMAINS.length) return 'EVIDENCE_IN_PROGRESS';
  return 'FOUNDATION';
}
