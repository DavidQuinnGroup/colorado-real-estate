import type {
  NeighborhoodSubmarketActivationBlocker,
  NeighborhoodSubmarketAmbiguity,
  NeighborhoodSubmarketAuthorityPosture,
  NeighborhoodSubmarketBoundaryPosture,
  NeighborhoodSubmarketEvidenceRequirement,
  NeighborhoodSubmarketMaturity,
  NeighborhoodSubmarketObjectType,
  NeighborhoodSubmarketRegistryReadiness,
  NeighborhoodSubmarketRelationshipType,
  NeighborhoodSubmarketRouteReadiness,
  NeighborhoodSubmarketSearchSupport,
} from "./neighborhoodSubmarketArchitecture.js";
import type {
  EvidenceDepthConflictStatus,
  EvidenceDepthFreshnessStatus,
  EvidenceDepthLimitationCategory,
  EvidenceDepthRightsStatus,
  EvidenceDepthSupportLevel,
} from "../evidence-depth/evidencePosture.js";

export type FirstGovernedNeighborhoodSubmarketDisposition =
  | "EXISTING_ROUTE_PRESERVED"
  | "INTERNAL_READINESS_ONLY"
  | "IDENTITY_RECONCILIATION_REQUIRED"
  | "EVIDENCE_INCOMPLETE"
  | "SOURCE_RIGHTS_INCOMPLETE"
  | "BOUNDARY_UNRESOLVED"
  | "SEARCH_UNSUPPORTED"
  | "MAP_UNSUPPORTED"
  | "FAIR_HOUSING_REVIEW_REQUIRED"
  | "PUBLIC_ACTIVATION_BLOCKED"
  | "FUTURE_CERTIFICATION_CANDIDATE"
  | "DEFERRED"
  | "UNRESOLVED";

export type FirstGovernedNeighborhoodSubmarketRepositorySupport =
  | "EXISTING_PUBLIC_ROUTE"
  | "REPOSITORY_NEIGHBORHOOD_RECORD"
  | "CERTIFIED_ARCHITECTURE_FIXTURE"
  | "PROTECTED_NON_ACTIVATION_GUARD";

export type FirstGovernedNeighborhoodSubmarketRelationship = Readonly<{
  relationshipId: string;
  fromObjectId: string;
  toObjectId: string;
  relationshipType: NeighborhoodSubmarketRelationshipType;
  evidenceRequirement: NeighborhoodSubmarketEvidenceRequirement;
  sourceRightsPosture: EvidenceDepthRightsStatus;
  conflictStatus: EvidenceDepthConflictStatus;
  preservesOverlap: boolean;
  forcesExclusiveParent: false;
  limitations: readonly string[];
}>;

export type FirstGovernedNeighborhoodSubmarketCandidate = Readonly<{
  candidateId: string;
  fixtureCoverage: string;
  repositorySupport: FirstGovernedNeighborhoodSubmarketRepositorySupport;
  includedInWave: boolean;
  protectedGuard: boolean;
  canonicalObjectId: string;
  objectType: NeighborhoodSubmarketObjectType;
  canonicalName: string;
  slug: string;
  aliases: readonly string[];
  existingPublicRoute: string | null;
  parentObjectIds: readonly string[];
  contextualObjectIds: readonly string[];
  municipalityContext: string | null;
  countyContext: string;
  authorityPosture: NeighborhoodSubmarketAuthorityPosture;
  boundaryPosture: NeighborhoodSubmarketBoundaryPosture;
  routeReadiness: NeighborhoodSubmarketRouteReadiness;
  registryReadiness: NeighborhoodSubmarketRegistryReadiness;
  searchSupport: NeighborhoodSubmarketSearchSupport;
  mapSupport:
    | "EXISTING_BEHAVIOR_PRESERVED"
    | "UNSUPPORTED"
    | "NO_PUBLIC_BOUNDARY"
    | "BOUNDARY_RIGHTS_INCOMPLETE"
    | "APPROXIMATE_ONLY"
    | "FUTURE_REVIEW_REQUIRED"
    | "BLOCKED";
  evidencePosture: Readonly<{
    requirements: readonly NeighborhoodSubmarketEvidenceRequirement[];
    rightsStatus: EvidenceDepthRightsStatus;
    freshnessStatus: EvidenceDepthFreshnessStatus;
    supportLevel: EvidenceDepthSupportLevel;
    conflictStatus: EvidenceDepthConflictStatus;
    limitations: readonly EvidenceDepthLimitationCategory[];
  }>;
  sourceRightsPosture: EvidenceDepthRightsStatus;
  attributionRequired: boolean;
  maturityPosture: NeighborhoodSubmarketMaturity;
  certificationReadiness:
    | "NOT_CERTIFICATION_READY"
    | "INTERNAL_REVIEW_READY"
    | "FUTURE_CERTIFICATION_CANDIDATE"
    | "BLOCKED_PENDING_SEPARATE_AUTHORIZATION"
    | "DEFERRED"
    | "UNRESOLVED";
  ambiguityPosture: NeighborhoodSubmarketAmbiguity;
  fairHousingPosture: "SAFE_CONTEXT_ONLY" | "REVIEW_REQUIRED" | "PROHIBITED_OUTPUT_GUARD";
  dispositions: readonly FirstGovernedNeighborhoodSubmarketDisposition[];
  relationships: readonly FirstGovernedNeighborhoodSubmarketRelationship[];
  blockers: readonly NeighborhoodSubmarketActivationBlocker[];
  limitations: readonly string[];
  futureReadinessOutcome: string;
  routePreservation: Readonly<{
    existingRouteAlreadyExisted: boolean;
    canonicalUrlUnchanged: true;
    httpBehaviorUnchanged: true;
    sitemapBehaviorUnchanged: true;
    searchBehaviorUnchanged: true;
    mapBehaviorUnchanged: true;
    contentUnchanged: true;
    metadataUnchanged: true;
    maturityPromoted: false;
    routeAliasIntroduced: false;
    redirectIntroduced: false;
    routeEligibilityExpanded: false;
  }>;
  activation: Readonly<{
    newPublicRouteCreated: false;
    publicRouteEligibilityChanged: false;
    publicRegistryEligibilityChanged: false;
    publicSitemapChanged: false;
    publicCanonicalUrlChanged: false;
    publicMetadataChanged: false;
    publicContentChanged: false;
    publicUiChanged: false;
    publicApiCreated: false;
    searchBehaviorChanged: false;
    searchRankingChanged: false;
    mapBehaviorChanged: false;
    mapBoundaryChanged: false;
    gisRuntimeActivated: false;
    providerCalls: 0;
    networkAcquisition: false;
    databaseWrites: false;
    persistenceWrites: false;
    schemaChanged: false;
    productionWrites: false;
    customerDataAccess: false;
    niwotActivated: false;
    gunbarrelActivated: false;
    ldiWave4Activated: false;
    publicConclusionGenerated: false;
  }>;
  prohibitedOutputs: Readonly<{
    rank: null;
    score: null;
    recommendation: null;
    desirability: null;
    suitability: null;
    valuation: null;
    forecast: null;
    demographicProfile: null;
    schoolConclusion: null;
    safetyConclusion: null;
    investmentConclusion: null;
    publicActivationDecision: null;
  }>;
}>;

const ALL_EVIDENCE_REQUIREMENTS: readonly NeighborhoodSubmarketEvidenceRequirement[] = Object.freeze([
  "CANONICAL_IDENTITY_EVIDENCE",
  "JURISDICTION_EVIDENCE",
  "PARENT_CHILD_RELATIONSHIP_EVIDENCE",
  "GEOGRAPHIC_SCOPE_OR_BOUNDARY_EVIDENCE",
  "NAMING_AND_ALIAS_EVIDENCE",
  "HOUSING_FORM_CONTEXT",
  "DEVELOPMENT_PATTERN_CONTEXT",
  "MARKET_CONTEXT_SCOPE",
  "MUNICIPAL_AND_COUNTY_CONTEXT",
  "SOURCE_RIGHTS_POSTURE",
  "FRESHNESS",
  "PROVENANCE",
  "CONFLICT_STATUS",
  "PROFESSIONAL_VERIFICATION_NEEDS",
  "LIMITATIONS",
]);

const DEFAULT_EVIDENCE_LIMITATIONS: readonly EvidenceDepthLimitationCategory[] = Object.freeze([
  "CITYWIDE_NOT_PROPERTY_SPECIFIC",
  "PROFESSIONAL_VERIFICATION_REQUIRED",
]);

const DEFAULT_BLOCKERS: readonly NeighborhoodSubmarketActivationBlocker[] = Object.freeze([
  "PUBLIC_ROUTE_NOT_AUTHORIZED",
  "PUBLIC_REGISTRY_NOT_AUTHORIZED",
  "SEARCH_SUPPORT_NOT_AUTHORIZED",
  "MAP_BOUNDARY_NOT_AUTHORIZED",
  "SEPARATE_AUTHORIZATION_REQUIRED",
]);

const DEFAULT_LIMITATIONS = Object.freeze([
  "First-wave posture is internal and does not authorize public activation.",
  "Existing route preservation does not certify content maturity or boundary readiness.",
  "Evidence posture remains categorical and must not be converted into a public conclusion.",
]);

const NO_ACTIVATION = Object.freeze({
  newPublicRouteCreated: false,
  publicRouteEligibilityChanged: false,
  publicRegistryEligibilityChanged: false,
  publicSitemapChanged: false,
  publicCanonicalUrlChanged: false,
  publicMetadataChanged: false,
  publicContentChanged: false,
  publicUiChanged: false,
  publicApiCreated: false,
  searchBehaviorChanged: false,
  searchRankingChanged: false,
  mapBehaviorChanged: false,
  mapBoundaryChanged: false,
  gisRuntimeActivated: false,
  providerCalls: 0,
  networkAcquisition: false,
  databaseWrites: false,
  persistenceWrites: false,
  schemaChanged: false,
  productionWrites: false,
  customerDataAccess: false,
  niwotActivated: false,
  gunbarrelActivated: false,
  ldiWave4Activated: false,
  publicConclusionGenerated: false,
} as const);

const NO_PROHIBITED_OUTPUTS = Object.freeze({
  rank: null,
  score: null,
  recommendation: null,
  desirability: null,
  suitability: null,
  valuation: null,
  forecast: null,
  demographicProfile: null,
  schoolConclusion: null,
  safetyConclusion: null,
  investmentConclusion: null,
  publicActivationDecision: null,
} as const);

function routePreservation(existingRouteAlreadyExisted: boolean) {
  return Object.freeze({
    existingRouteAlreadyExisted,
    canonicalUrlUnchanged: true,
    httpBehaviorUnchanged: true,
    sitemapBehaviorUnchanged: true,
    searchBehaviorUnchanged: true,
    mapBehaviorUnchanged: true,
    contentUnchanged: true,
    metadataUnchanged: true,
    maturityPromoted: false,
    routeAliasIntroduced: false,
    redirectIntroduced: false,
    routeEligibilityExpanded: false,
  } as const);
}

function relationship(
  relationshipId: string,
  fromObjectId: string,
  toObjectId: string,
  relationshipType: NeighborhoodSubmarketRelationshipType,
  options: Partial<FirstGovernedNeighborhoodSubmarketRelationship> = {},
): FirstGovernedNeighborhoodSubmarketRelationship {
  return Object.freeze({
    relationshipId,
    fromObjectId,
    toObjectId,
    relationshipType,
    evidenceRequirement: options.evidenceRequirement ?? "PARENT_CHILD_RELATIONSHIP_EVIDENCE",
    sourceRightsPosture: options.sourceRightsPosture ?? "DERIVED_OR_SUMMARY_USE_ONLY",
    conflictStatus: options.conflictStatus ?? "NO_KNOWN_CONFLICT",
    preservesOverlap: options.preservesOverlap ?? false,
    forcesExclusiveParent: false,
    limitations: options.limitations ?? ["Relationship is internal and does not create route, registry, Search, or map activation."],
  });
}

function candidate(
  input: Omit<
    FirstGovernedNeighborhoodSubmarketCandidate,
    "evidencePosture" | "routePreservation" | "activation" | "prohibitedOutputs"
  > &
    Readonly<{
      evidencePosture?: FirstGovernedNeighborhoodSubmarketCandidate["evidencePosture"];
    }>,
): FirstGovernedNeighborhoodSubmarketCandidate {
  return Object.freeze({
    ...input,
    evidencePosture:
      input.evidencePosture ??
      Object.freeze({
        requirements: ALL_EVIDENCE_REQUIREMENTS,
        rightsStatus: input.sourceRightsPosture,
        freshnessStatus: "UNDATED",
        supportLevel: "CONTEXTUAL",
        conflictStatus: "NO_KNOWN_CONFLICT",
        limitations: DEFAULT_EVIDENCE_LIMITATIONS,
      }),
    routePreservation: routePreservation(Boolean(input.existingPublicRoute)),
    activation: NO_ACTIVATION,
    prohibitedOutputs: NO_PROHIBITED_OUTPUTS,
  });
}

export const FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CANDIDATES: readonly FirstGovernedNeighborhoodSubmarketCandidate[] =
  Object.freeze([
    candidate({
      candidateId: "existing-route-downtown-boulder",
      fixtureCoverage: "Existing public neighborhood route preserved.",
      repositorySupport: "EXISTING_PUBLIC_ROUTE",
      includedInWave: true,
      protectedGuard: false,
      canonicalObjectId: "neighborhood:boulder:downtown-boulder",
      objectType: "NEIGHBORHOOD",
      canonicalName: "Downtown Boulder",
      slug: "downtown-boulder",
      aliases: ["Downtown", "Pearl Street area"],
      existingPublicRoute: "/market/boulder/downtown-boulder",
      parentObjectIds: ["city:boulder"],
      contextualObjectIds: ["county:boulder", "market-area:boulder-core"],
      municipalityContext: "Boulder",
      countyContext: "Boulder County",
      authorityPosture: "LOCALLY_RECOGNIZED_NON_AUTHORITATIVE",
      boundaryPosture: "DESCRIPTIVE_AREA_ONLY",
      routeReadiness: "CERTIFICATION_READY",
      registryReadiness: "IDENTITY_GOVERNED",
      searchSupport: "NEIGHBORHOOD_FILTER_COMPATIBLE",
      mapSupport: "EXISTING_BEHAVIOR_PRESERVED",
      sourceRightsPosture: "DERIVED_OR_SUMMARY_USE_ONLY",
      attributionRequired: false,
      maturityPosture: "CONTENT_FOUNDATION",
      certificationReadiness: "INTERNAL_REVIEW_READY",
      ambiguityPosture: "NO_KNOWN_AMBIGUITY",
      fairHousingPosture: "SAFE_CONTEXT_ONLY",
      dispositions: ["EXISTING_ROUTE_PRESERVED", "FUTURE_CERTIFICATION_CANDIDATE"],
      relationships: [
        relationship("downtown-boulder-within-boulder", "neighborhood:boulder:downtown-boulder", "city:boulder", "WITHIN"),
        relationship("downtown-boulder-county-context", "neighborhood:boulder:downtown-boulder", "county:boulder", "HAS_COUNTY_CONTEXT"),
      ],
      blockers: DEFAULT_BLOCKERS,
      limitations: DEFAULT_LIMITATIONS,
      futureReadinessOutcome: "Existing route may remain preserved while future certification reviews evidence and boundary readiness.",
    }),
    candidate({
      candidateId: "existing-route-mapleton-hill-boundary-limited",
      fixtureCoverage: "Existing route with descriptive or limited boundary posture.",
      repositorySupport: "EXISTING_PUBLIC_ROUTE",
      includedInWave: true,
      protectedGuard: false,
      canonicalObjectId: "neighborhood:boulder:mapleton-hill",
      objectType: "NEIGHBORHOOD",
      canonicalName: "Mapleton Hill",
      slug: "mapleton-hill",
      aliases: ["Mapleton"],
      existingPublicRoute: "/market/boulder/mapleton-hill",
      parentObjectIds: ["city:boulder"],
      contextualObjectIds: ["county:boulder"],
      municipalityContext: "Boulder",
      countyContext: "Boulder County",
      authorityPosture: "LOCALLY_RECOGNIZED_NON_AUTHORITATIVE",
      boundaryPosture: "APPROXIMATE_BOUNDARY",
      routeReadiness: "BOUNDARY_PREREQUISITES_INCOMPLETE",
      registryReadiness: "IDENTITY_GOVERNED",
      searchSupport: "NEIGHBORHOOD_FILTER_COMPATIBLE",
      mapSupport: "APPROXIMATE_ONLY",
      sourceRightsPosture: "DERIVED_OR_SUMMARY_USE_ONLY",
      attributionRequired: false,
      maturityPosture: "CONTENT_FOUNDATION",
      certificationReadiness: "INTERNAL_REVIEW_READY",
      ambiguityPosture: "BOUNDARY_AMBIGUITY",
      fairHousingPosture: "SAFE_CONTEXT_ONLY",
      dispositions: ["EXISTING_ROUTE_PRESERVED", "BOUNDARY_UNRESOLVED"],
      relationships: [relationship("mapleton-hill-within-boulder", "neighborhood:boulder:mapleton-hill", "city:boulder", "WITHIN")],
      blockers: ["BOUNDARY_UNRESOLVED", ...DEFAULT_BLOCKERS],
      limitations: ["Approximate route context is not a governed public boundary.", ...DEFAULT_LIMITATIONS],
      futureReadinessOutcome: "Boundary review is required before any public boundary or map representation can be certified.",
    }),
    candidate({
      candidateId: "existing-route-north-boulder-context",
      fixtureCoverage: "Existing neighborhood with municipality and county context.",
      repositorySupport: "EXISTING_PUBLIC_ROUTE",
      includedInWave: true,
      protectedGuard: false,
      canonicalObjectId: "neighborhood:boulder:north-boulder",
      objectType: "NEIGHBORHOOD",
      canonicalName: "North Boulder",
      slug: "north-boulder",
      aliases: ["NoBo"],
      existingPublicRoute: "/market/boulder/north-boulder",
      parentObjectIds: ["city:boulder"],
      contextualObjectIds: ["county:boulder", "market-area:north-boulder-context"],
      municipalityContext: "Boulder",
      countyContext: "Boulder County",
      authorityPosture: "LOCALLY_RECOGNIZED_NON_AUTHORITATIVE",
      boundaryPosture: "DESCRIPTIVE_AREA_ONLY",
      routeReadiness: "CONTENT_PREREQUISITES_INCOMPLETE",
      registryReadiness: "IDENTITY_GOVERNED",
      searchSupport: "NEIGHBORHOOD_FILTER_COMPATIBLE",
      mapSupport: "NO_PUBLIC_BOUNDARY",
      sourceRightsPosture: "DERIVED_OR_SUMMARY_USE_ONLY",
      attributionRequired: false,
      maturityPosture: "ARCHITECTURE_FOUNDATION",
      certificationReadiness: "INTERNAL_REVIEW_READY",
      ambiguityPosture: "NO_KNOWN_AMBIGUITY",
      fairHousingPosture: "SAFE_CONTEXT_ONLY",
      dispositions: ["EXISTING_ROUTE_PRESERVED", "EVIDENCE_INCOMPLETE"],
      relationships: [
        relationship("north-boulder-within-boulder", "neighborhood:boulder:north-boulder", "city:boulder", "WITHIN"),
        relationship("north-boulder-market-context", "neighborhood:boulder:north-boulder", "market-area:north-boulder-context", "HAS_MARKET_CONTEXT"),
      ],
      blockers: ["PUBLIC_EVIDENCE_CONCLUSION_PROHIBITED", ...DEFAULT_BLOCKERS],
      limitations: DEFAULT_LIMITATIONS,
      futureReadinessOutcome: "Candidate can support future review only after evidence and content prerequisites are certified.",
    }),
    candidate({
      candidateId: "internal-subdivision-coal-creek-ranch",
      fixtureCoverage: "Internal-only subdivision candidate.",
      repositorySupport: "REPOSITORY_NEIGHBORHOOD_RECORD",
      includedInWave: true,
      protectedGuard: false,
      canonicalObjectId: "subdivision:louisville:coal-creek-ranch",
      objectType: "SUBDIVISION",
      canonicalName: "Coal Creek Ranch",
      slug: "coal-creek-ranch",
      aliases: ["Coal Creek Ranch subdivision"],
      existingPublicRoute: "/market/louisville/coal-creek-ranch",
      parentObjectIds: ["city:louisville"],
      contextualObjectIds: ["county:boulder"],
      municipalityContext: "Louisville",
      countyContext: "Boulder County",
      authorityPosture: "RECORDED_SUBDIVISION",
      boundaryPosture: "UNRESOLVED",
      routeReadiness: "EVIDENCE_PREREQUISITES_INCOMPLETE",
      registryReadiness: "EVIDENCE_INCOMPLETE",
      searchSupport: "SUBDIVISION_FILTER_COMPATIBLE",
      mapSupport: "FUTURE_REVIEW_REQUIRED",
      sourceRightsPosture: "UNKNOWN_OR_UNRESOLVED",
      attributionRequired: false,
      maturityPosture: "IDENTITY_ONLY",
      certificationReadiness: "BLOCKED_PENDING_SEPARATE_AUTHORIZATION",
      ambiguityPosture: "OBJECT_TYPE_AMBIGUITY",
      fairHousingPosture: "SAFE_CONTEXT_ONLY",
      dispositions: ["INTERNAL_READINESS_ONLY", "SOURCE_RIGHTS_INCOMPLETE", "PUBLIC_ACTIVATION_BLOCKED"],
      relationships: [relationship("coal-creek-ranch-part-of-louisville", "subdivision:louisville:coal-creek-ranch", "city:louisville", "PART_OF")],
      blockers: ["OBJECT_TYPE_UNRESOLVED", "SOURCE_RIGHTS_UNRESOLVED", ...DEFAULT_BLOCKERS],
      limitations: ["Subdivision posture is internal and does not alter the existing route or public label.", ...DEFAULT_LIMITATIONS],
      futureReadinessOutcome: "Object-type and source-rights review must precede any public subdivision posture.",
    }),
    candidate({
      candidateId: "internal-market-area-boulder-foothills",
      fixtureCoverage: "Internal market-area context.",
      repositorySupport: "CERTIFIED_ARCHITECTURE_FIXTURE",
      includedInWave: true,
      protectedGuard: false,
      canonicalObjectId: "market-area:boulder-foothills-context",
      objectType: "MARKET_AREA",
      canonicalName: "Boulder Foothills Context",
      slug: "boulder-foothills-context",
      aliases: ["Foothills context"],
      existingPublicRoute: null,
      parentObjectIds: ["county:boulder"],
      contextualObjectIds: ["city:boulder"],
      municipalityContext: "Boulder",
      countyContext: "Boulder County",
      authorityPosture: "PLATFORM_DEFINED_MARKET_AREA",
      boundaryPosture: "DESCRIPTIVE_AREA_ONLY",
      routeReadiness: "BLOCKED",
      registryReadiness: "PUBLIC_ACTIVATION_PROHIBITED",
      searchSupport: "UNSUPPORTED",
      mapSupport: "BLOCKED",
      sourceRightsPosture: "INTERNAL_ANALYSIS_ONLY",
      attributionRequired: false,
      maturityPosture: "ARCHITECTURE_FOUNDATION",
      certificationReadiness: "BLOCKED_PENDING_SEPARATE_AUTHORIZATION",
      ambiguityPosture: "OVERLAPPING_IDENTITY",
      fairHousingPosture: "SAFE_CONTEXT_ONLY",
      dispositions: ["INTERNAL_READINESS_ONLY", "SEARCH_UNSUPPORTED", "MAP_UNSUPPORTED", "PUBLIC_ACTIVATION_BLOCKED"],
      relationships: [
        relationship("boulder-foothills-associated-boulder", "market-area:boulder-foothills-context", "city:boulder", "ASSOCIATED_WITH", {
          preservesOverlap: true,
        }),
      ],
      blockers: ["SEARCH_SUPPORT_NOT_AUTHORIZED", "MAP_BOUNDARY_NOT_AUTHORIZED", ...DEFAULT_BLOCKERS],
      limitations: ["Market area is not a legal jurisdiction and is not eligible for public activation in this wave.", ...DEFAULT_LIMITATIONS],
      futureReadinessOutcome: "Future use requires separate market-area content, Search, route, and fair-housing certification.",
    }),
    candidate({
      candidateId: "existing-route-old-town-louisville-rights-limited",
      fixtureCoverage: "Candidate with source-rights limitation.",
      repositorySupport: "EXISTING_PUBLIC_ROUTE",
      includedInWave: true,
      protectedGuard: false,
      canonicalObjectId: "neighborhood:louisville:old-town-louisville",
      objectType: "NEIGHBORHOOD",
      canonicalName: "Old Town Louisville",
      slug: "old-town-louisville",
      aliases: ["Old Town"],
      existingPublicRoute: "/market/louisville/old-town-louisville",
      parentObjectIds: ["city:louisville"],
      contextualObjectIds: ["county:boulder"],
      municipalityContext: "Louisville",
      countyContext: "Boulder County",
      authorityPosture: "LOCALLY_RECOGNIZED_NON_AUTHORITATIVE",
      boundaryPosture: "DESCRIPTIVE_AREA_ONLY",
      routeReadiness: "SOURCE_RIGHTS_PREREQUISITES_INCOMPLETE",
      registryReadiness: "IDENTITY_GOVERNED",
      searchSupport: "NEIGHBORHOOD_FILTER_COMPATIBLE",
      mapSupport: "NO_PUBLIC_BOUNDARY",
      sourceRightsPosture: "DERIVED_OR_SUMMARY_USE_ONLY",
      attributionRequired: true,
      maturityPosture: "ARCHITECTURE_FOUNDATION",
      certificationReadiness: "INTERNAL_REVIEW_READY",
      ambiguityPosture: "NO_KNOWN_AMBIGUITY",
      fairHousingPosture: "SAFE_CONTEXT_ONLY",
      dispositions: ["EXISTING_ROUTE_PRESERVED", "SOURCE_RIGHTS_INCOMPLETE"],
      relationships: [relationship("old-town-louisville-within-louisville", "neighborhood:louisville:old-town-louisville", "city:louisville", "WITHIN")],
      blockers: ["SOURCE_RIGHTS_UNRESOLVED", ...DEFAULT_BLOCKERS],
      limitations: ["Attribution and derivative-use posture must remain internal until future certification.", ...DEFAULT_LIMITATIONS],
      futureReadinessOutcome: "Existing route remains preserved; any expanded evidence display requires rights certification.",
    }),
    candidate({
      candidateId: "existing-route-centennial-valley-evidence-incomplete",
      fixtureCoverage: "Candidate with incomplete evidence.",
      repositorySupport: "EXISTING_PUBLIC_ROUTE",
      includedInWave: true,
      protectedGuard: false,
      canonicalObjectId: "neighborhood:louisville:centennial-valley",
      objectType: "NEIGHBORHOOD",
      canonicalName: "Centennial Valley",
      slug: "centennial-valley",
      aliases: [],
      existingPublicRoute: "/market/louisville/centennial-valley",
      parentObjectIds: ["city:louisville"],
      contextualObjectIds: ["county:boulder"],
      municipalityContext: "Louisville",
      countyContext: "Boulder County",
      authorityPosture: "LOCALLY_RECOGNIZED_NON_AUTHORITATIVE",
      boundaryPosture: "UNAVAILABLE",
      routeReadiness: "EVIDENCE_PREREQUISITES_INCOMPLETE",
      registryReadiness: "EVIDENCE_INCOMPLETE",
      searchSupport: "DATA_COVERAGE_INCOMPLETE",
      mapSupport: "UNSUPPORTED",
      sourceRightsPosture: "UNKNOWN_OR_UNRESOLVED",
      attributionRequired: false,
      maturityPosture: "IDENTITY_ONLY",
      certificationReadiness: "NOT_CERTIFICATION_READY",
      ambiguityPosture: "INSUFFICIENT_EVIDENCE",
      fairHousingPosture: "SAFE_CONTEXT_ONLY",
      dispositions: ["EXISTING_ROUTE_PRESERVED", "EVIDENCE_INCOMPLETE", "SOURCE_RIGHTS_INCOMPLETE"],
      relationships: [relationship("centennial-valley-within-louisville", "neighborhood:louisville:centennial-valley", "city:louisville", "WITHIN")],
      blockers: ["SOURCE_RIGHTS_UNRESOLVED", "PUBLIC_EVIDENCE_CONCLUSION_PROHIBITED", ...DEFAULT_BLOCKERS],
      limitations: ["Available repository posture is insufficient for public evidence conclusions.", ...DEFAULT_LIMITATIONS],
      futureReadinessOutcome: "Future certification requires evidence completeness and rights review.",
    }),
    candidate({
      candidateId: "existing-route-old-town-lafayette-search-no-map",
      fixtureCoverage: "Candidate with Search support but no map support.",
      repositorySupport: "EXISTING_PUBLIC_ROUTE",
      includedInWave: true,
      protectedGuard: false,
      canonicalObjectId: "neighborhood:lafayette:old-town-lafayette",
      objectType: "NEIGHBORHOOD",
      canonicalName: "Old Town Lafayette",
      slug: "old-town-lafayette",
      aliases: ["Old Town"],
      existingPublicRoute: "/market/lafayette/old-town-lafayette",
      parentObjectIds: ["city:lafayette"],
      contextualObjectIds: ["county:boulder"],
      municipalityContext: "Lafayette",
      countyContext: "Boulder County",
      authorityPosture: "LOCALLY_RECOGNIZED_NON_AUTHORITATIVE",
      boundaryPosture: "DESCRIPTIVE_AREA_ONLY",
      routeReadiness: "BOUNDARY_PREREQUISITES_INCOMPLETE",
      registryReadiness: "IDENTITY_GOVERNED",
      searchSupport: "NEIGHBORHOOD_FILTER_COMPATIBLE",
      mapSupport: "UNSUPPORTED",
      sourceRightsPosture: "DERIVED_OR_SUMMARY_USE_ONLY",
      attributionRequired: false,
      maturityPosture: "ARCHITECTURE_FOUNDATION",
      certificationReadiness: "INTERNAL_REVIEW_READY",
      ambiguityPosture: "BOUNDARY_AMBIGUITY",
      fairHousingPosture: "SAFE_CONTEXT_ONLY",
      dispositions: ["EXISTING_ROUTE_PRESERVED", "MAP_UNSUPPORTED", "BOUNDARY_UNRESOLVED"],
      relationships: [relationship("old-town-lafayette-within-lafayette", "neighborhood:lafayette:old-town-lafayette", "city:lafayette", "WITHIN")],
      blockers: ["BOUNDARY_UNRESOLVED", "MAP_BOUNDARY_NOT_AUTHORIZED", ...DEFAULT_BLOCKERS],
      limitations: ["Search posture remains separate from public map or boundary readiness.", ...DEFAULT_LIMITATIONS],
      futureReadinessOutcome: "Future public map context requires separately governed boundary rights.",
    }),
    candidate({
      candidateId: "existing-route-waneka-lake-map-rights-limited",
      fixtureCoverage: "Candidate with map context but no public boundary rights.",
      repositorySupport: "EXISTING_PUBLIC_ROUTE",
      includedInWave: true,
      protectedGuard: false,
      canonicalObjectId: "neighborhood:lafayette:waneka-lake",
      objectType: "NEIGHBORHOOD",
      canonicalName: "Waneka Lake",
      slug: "waneka-lake",
      aliases: ["Waneka"],
      existingPublicRoute: "/market/lafayette/waneka-lake",
      parentObjectIds: ["city:lafayette"],
      contextualObjectIds: ["county:boulder"],
      municipalityContext: "Lafayette",
      countyContext: "Boulder County",
      authorityPosture: "LOCALLY_RECOGNIZED_NON_AUTHORITATIVE",
      boundaryPosture: "PROHIBITED_FOR_PUBLIC_USE",
      routeReadiness: "BOUNDARY_PREREQUISITES_INCOMPLETE",
      registryReadiness: "IDENTITY_GOVERNED",
      searchSupport: "NEIGHBORHOOD_FILTER_COMPATIBLE",
      mapSupport: "BOUNDARY_RIGHTS_INCOMPLETE",
      sourceRightsPosture: "RESTRICTED",
      attributionRequired: false,
      maturityPosture: "ARCHITECTURE_FOUNDATION",
      certificationReadiness: "BLOCKED_PENDING_SEPARATE_AUTHORIZATION",
      ambiguityPosture: "BOUNDARY_AMBIGUITY",
      fairHousingPosture: "SAFE_CONTEXT_ONLY",
      dispositions: ["EXISTING_ROUTE_PRESERVED", "SOURCE_RIGHTS_INCOMPLETE", "MAP_UNSUPPORTED"],
      relationships: [relationship("waneka-lake-within-lafayette", "neighborhood:lafayette:waneka-lake", "city:lafayette", "WITHIN")],
      blockers: ["SOURCE_RIGHTS_UNRESOLVED", "MAP_BOUNDARY_NOT_AUTHORIZED", ...DEFAULT_BLOCKERS],
      limitations: ["Map context does not authorize public boundary display.", ...DEFAULT_LIMITATIONS],
      futureReadinessOutcome: "Boundary display remains blocked unless future rights and map certification are authorized.",
    }),
    candidate({
      candidateId: "existing-route-annas-farm-alias-ambiguous",
      fixtureCoverage: "Candidate with ambiguous alias.",
      repositorySupport: "EXISTING_PUBLIC_ROUTE",
      includedInWave: true,
      protectedGuard: false,
      canonicalObjectId: "neighborhood:lafayette:annas-farm",
      objectType: "NEIGHBORHOOD",
      canonicalName: "Anna's Farm",
      slug: "annas-farm",
      aliases: ["Annas Farm", "Anna Farm"],
      existingPublicRoute: "/market/lafayette/annas-farm",
      parentObjectIds: ["city:lafayette"],
      contextualObjectIds: ["county:boulder"],
      municipalityContext: "Lafayette",
      countyContext: "Boulder County",
      authorityPosture: "LOCALLY_RECOGNIZED_NON_AUTHORITATIVE",
      boundaryPosture: "DESCRIPTIVE_AREA_ONLY",
      routeReadiness: "ARCHITECTURE_READY",
      registryReadiness: "IDENTITY_GOVERNED",
      searchSupport: "ALIAS_ONLY",
      mapSupport: "NO_PUBLIC_BOUNDARY",
      sourceRightsPosture: "DERIVED_OR_SUMMARY_USE_ONLY",
      attributionRequired: false,
      maturityPosture: "ARCHITECTURE_FOUNDATION",
      certificationReadiness: "INTERNAL_REVIEW_READY",
      ambiguityPosture: "NAMING_AMBIGUITY",
      fairHousingPosture: "SAFE_CONTEXT_ONLY",
      dispositions: ["EXISTING_ROUTE_PRESERVED", "IDENTITY_RECONCILIATION_REQUIRED"],
      relationships: [relationship("annas-farm-within-lafayette", "neighborhood:lafayette:annas-farm", "city:lafayette", "WITHIN")],
      blockers: ["OBJECT_TYPE_UNRESOLVED", ...DEFAULT_BLOCKERS],
      limitations: ["Alias ambiguity is preserved and does not create new Search or route aliases.", ...DEFAULT_LIMITATIONS],
      futureReadinessOutcome: "Alias review must precede Search-support or registry certification.",
    }),
    candidate({
      candidateId: "existing-route-indian-peaks-overlap",
      fixtureCoverage: "Candidate with overlapping relationships.",
      repositorySupport: "EXISTING_PUBLIC_ROUTE",
      includedInWave: true,
      protectedGuard: false,
      canonicalObjectId: "neighborhood:lafayette:indian-peaks",
      objectType: "NEIGHBORHOOD",
      canonicalName: "Indian Peaks",
      slug: "lafayette-indian-peaks",
      aliases: ["Indian Peaks Lafayette"],
      existingPublicRoute: "/market/lafayette/lafayette-indian-peaks",
      parentObjectIds: ["city:lafayette"],
      contextualObjectIds: ["county:boulder", "market-area:east-boulder-county-context"],
      municipalityContext: "Lafayette",
      countyContext: "Boulder County",
      authorityPosture: "LOCALLY_RECOGNIZED_NON_AUTHORITATIVE",
      boundaryPosture: "OVERLAPPING_BOUNDARY",
      routeReadiness: "ARCHITECTURE_READY",
      registryReadiness: "IDENTITY_GOVERNED",
      searchSupport: "NEIGHBORHOOD_FILTER_COMPATIBLE",
      mapSupport: "FUTURE_REVIEW_REQUIRED",
      sourceRightsPosture: "DERIVED_OR_SUMMARY_USE_ONLY",
      attributionRequired: false,
      maturityPosture: "ARCHITECTURE_FOUNDATION",
      certificationReadiness: "INTERNAL_REVIEW_READY",
      ambiguityPosture: "OVERLAPPING_IDENTITY",
      fairHousingPosture: "SAFE_CONTEXT_ONLY",
      dispositions: ["EXISTING_ROUTE_PRESERVED", "FUTURE_CERTIFICATION_CANDIDATE"],
      relationships: [
        relationship("indian-peaks-within-lafayette", "neighborhood:lafayette:indian-peaks", "city:lafayette", "WITHIN"),
        relationship("indian-peaks-market-context", "neighborhood:lafayette:indian-peaks", "market-area:east-boulder-county-context", "OVERLAPS", {
          preservesOverlap: true,
        }),
      ],
      blockers: DEFAULT_BLOCKERS,
      limitations: ["Overlapping market context remains visible and does not force a single exclusive parent.", ...DEFAULT_LIMITATIONS],
      futureReadinessOutcome: "Candidate may proceed only after overlap and evidence certification.",
    }),
    candidate({
      candidateId: "existing-route-chautauqua-fair-housing-review",
      fixtureCoverage: "Candidate blocked by fair-housing review.",
      repositorySupport: "EXISTING_PUBLIC_ROUTE",
      includedInWave: true,
      protectedGuard: false,
      canonicalObjectId: "neighborhood:boulder:chautauqua",
      objectType: "NEIGHBORHOOD",
      canonicalName: "Chautauqua",
      slug: "chautauqua",
      aliases: [],
      existingPublicRoute: "/market/boulder/chautauqua",
      parentObjectIds: ["city:boulder"],
      contextualObjectIds: ["county:boulder"],
      municipalityContext: "Boulder",
      countyContext: "Boulder County",
      authorityPosture: "LOCALLY_RECOGNIZED_NON_AUTHORITATIVE",
      boundaryPosture: "DESCRIPTIVE_AREA_ONLY",
      routeReadiness: "FAIR_HOUSING_REVIEW_REQUIRED",
      registryReadiness: "CERTIFICATION_PENDING",
      searchSupport: "NEIGHBORHOOD_FILTER_COMPATIBLE",
      mapSupport: "NO_PUBLIC_BOUNDARY",
      sourceRightsPosture: "DERIVED_OR_SUMMARY_USE_ONLY",
      attributionRequired: false,
      maturityPosture: "ARCHITECTURE_FOUNDATION",
      certificationReadiness: "BLOCKED_PENDING_SEPARATE_AUTHORIZATION",
      ambiguityPosture: "NO_KNOWN_AMBIGUITY",
      fairHousingPosture: "REVIEW_REQUIRED",
      dispositions: ["EXISTING_ROUTE_PRESERVED", "FAIR_HOUSING_REVIEW_REQUIRED", "PUBLIC_ACTIVATION_BLOCKED"],
      relationships: [relationship("chautauqua-within-boulder", "neighborhood:boulder:chautauqua", "city:boulder", "WITHIN")],
      blockers: ["FAIR_HOUSING_REVIEW_REQUIRED", ...DEFAULT_BLOCKERS],
      limitations: ["Any future content expansion must remain free of desirability, suitability, school, safety, and demographic claims.", ...DEFAULT_LIMITATIONS],
      futureReadinessOutcome: "Candidate remains blocked until fair-housing review is separately certified.",
    }),
    candidate({
      candidateId: "existing-route-steel-ranch-public-activation-blocked",
      fixtureCoverage: "Candidate blocked from public activation.",
      repositorySupport: "EXISTING_PUBLIC_ROUTE",
      includedInWave: true,
      protectedGuard: false,
      canonicalObjectId: "neighborhood:louisville:steel-ranch",
      objectType: "NEIGHBORHOOD",
      canonicalName: "Steel Ranch",
      slug: "steel-ranch",
      aliases: [],
      existingPublicRoute: "/market/louisville/steel-ranch",
      parentObjectIds: ["city:louisville"],
      contextualObjectIds: ["county:boulder"],
      municipalityContext: "Louisville",
      countyContext: "Boulder County",
      authorityPosture: "LOCALLY_RECOGNIZED_NON_AUTHORITATIVE",
      boundaryPosture: "UNRESOLVED",
      routeReadiness: "BLOCKED",
      registryReadiness: "PUBLIC_ACTIVATION_PROHIBITED",
      searchSupport: "UNRESOLVED",
      mapSupport: "BLOCKED",
      sourceRightsPosture: "UNKNOWN_OR_UNRESOLVED",
      attributionRequired: false,
      maturityPosture: "BLOCKED",
      certificationReadiness: "BLOCKED_PENDING_SEPARATE_AUTHORIZATION",
      ambiguityPosture: "INSUFFICIENT_EVIDENCE",
      fairHousingPosture: "SAFE_CONTEXT_ONLY",
      dispositions: ["EXISTING_ROUTE_PRESERVED", "PUBLIC_ACTIVATION_BLOCKED", "UNRESOLVED"],
      relationships: [relationship("steel-ranch-associated-louisville", "neighborhood:louisville:steel-ranch", "city:louisville", "ASSOCIATED_WITH")],
      blockers: ["SOURCE_RIGHTS_UNRESOLVED", "BOUNDARY_UNRESOLVED", ...DEFAULT_BLOCKERS],
      limitations: ["The existing route is preserved, but first-wave posture blocks any new public activation.", ...DEFAULT_LIMITATIONS],
      futureReadinessOutcome: "Requires identity, boundary, source-rights, and Search review before certification candidacy.",
    }),
    candidate({
      candidateId: "existing-route-south-boulder-deferred",
      fixtureCoverage: "Candidate deferred pending certification.",
      repositorySupport: "EXISTING_PUBLIC_ROUTE",
      includedInWave: true,
      protectedGuard: false,
      canonicalObjectId: "neighborhood:boulder:south-boulder",
      objectType: "NEIGHBORHOOD",
      canonicalName: "South Boulder",
      slug: "south-boulder",
      aliases: ["SoBo"],
      existingPublicRoute: "/market/boulder/south-boulder",
      parentObjectIds: ["city:boulder"],
      contextualObjectIds: ["county:boulder"],
      municipalityContext: "Boulder",
      countyContext: "Boulder County",
      authorityPosture: "LOCALLY_RECOGNIZED_NON_AUTHORITATIVE",
      boundaryPosture: "DESCRIPTIVE_AREA_ONLY",
      routeReadiness: "CONTENT_PREREQUISITES_INCOMPLETE",
      registryReadiness: "CERTIFICATION_PENDING",
      searchSupport: "NEIGHBORHOOD_FILTER_COMPATIBLE",
      mapSupport: "NO_PUBLIC_BOUNDARY",
      sourceRightsPosture: "DERIVED_OR_SUMMARY_USE_ONLY",
      attributionRequired: false,
      maturityPosture: "ARCHITECTURE_FOUNDATION",
      certificationReadiness: "DEFERRED",
      ambiguityPosture: "NO_KNOWN_AMBIGUITY",
      fairHousingPosture: "SAFE_CONTEXT_ONLY",
      dispositions: ["EXISTING_ROUTE_PRESERVED", "DEFERRED"],
      relationships: [relationship("south-boulder-within-boulder", "neighborhood:boulder:south-boulder", "city:boulder", "WITHIN")],
      blockers: DEFAULT_BLOCKERS,
      limitations: DEFAULT_LIMITATIONS,
      futureReadinessOutcome: "Candidate is deferred until a future bounded certification wave is separately authorized.",
    }),
    candidate({
      candidateId: "protected-gunbarrel-non-activation",
      fixtureCoverage: "Gunbarrel non-activation guard.",
      repositorySupport: "PROTECTED_NON_ACTIVATION_GUARD",
      includedInWave: false,
      protectedGuard: true,
      canonicalObjectId: "protected:gunbarrel",
      objectType: "COMMUNITY",
      canonicalName: "Gunbarrel",
      slug: "gunbarrel",
      aliases: ["Gunbarrel Boulder"],
      existingPublicRoute: "/market/boulder/gunbarrel",
      parentObjectIds: ["city:boulder", "county:boulder"],
      contextualObjectIds: ["market-area:boulder-county-context"],
      municipalityContext: "Boulder",
      countyContext: "Boulder County",
      authorityPosture: "UNRESOLVED",
      boundaryPosture: "UNRESOLVED",
      routeReadiness: "BLOCKED",
      registryReadiness: "PUBLIC_ACTIVATION_PROHIBITED",
      searchSupport: "AMBIGUOUS",
      mapSupport: "BLOCKED",
      sourceRightsPosture: "UNKNOWN_OR_UNRESOLVED",
      attributionRequired: false,
      maturityPosture: "UNRESOLVED",
      certificationReadiness: "DEFERRED",
      ambiguityPosture: "OBJECT_TYPE_AMBIGUITY",
      fairHousingPosture: "SAFE_CONTEXT_ONLY",
      dispositions: ["DEFERRED", "UNRESOLVED", "PUBLIC_ACTIVATION_BLOCKED"],
      relationships: [
        relationship("gunbarrel-boulder-context", "protected:gunbarrel", "city:boulder", "HAS_MUNICIPAL_CONTEXT", { preservesOverlap: true }),
        relationship("gunbarrel-county-context", "protected:gunbarrel", "county:boulder", "HAS_COUNTY_CONTEXT", { preservesOverlap: true }),
      ],
      blockers: ["OBJECT_TYPE_UNRESOLVED", "AUTHORITY_UNRESOLVED", "BOUNDARY_UNRESOLVED", ...DEFAULT_BLOCKERS],
      limitations: ["Gunbarrel remains a protected non-activation guard and is not an activated wave candidate.", ...DEFAULT_LIMITATIONS],
      futureReadinessOutcome: "Deferred until separate object-type, authority, boundary, route, registry, Search, rights, and fair-housing governance.",
    }),
    candidate({
      candidateId: "protected-niwot-non-activation",
      fixtureCoverage: "Niwot non-activation guard.",
      repositorySupport: "PROTECTED_NON_ACTIVATION_GUARD",
      includedInWave: false,
      protectedGuard: true,
      canonicalObjectId: "protected:niwot",
      objectType: "UNINCORPORATED_COMMUNITY",
      canonicalName: "Niwot",
      slug: "niwot",
      aliases: ["Niwot Colorado"],
      existingPublicRoute: null,
      parentObjectIds: ["county:boulder"],
      contextualObjectIds: ["city:boulder", "city:longmont"],
      municipalityContext: null,
      countyContext: "Boulder County",
      authorityPosture: "UNRESOLVED",
      boundaryPosture: "UNRESOLVED",
      routeReadiness: "BLOCKED",
      registryReadiness: "PUBLIC_ACTIVATION_PROHIBITED",
      searchSupport: "UNRESOLVED",
      mapSupport: "BLOCKED",
      sourceRightsPosture: "UNKNOWN_OR_UNRESOLVED",
      attributionRequired: false,
      maturityPosture: "UNRESOLVED",
      certificationReadiness: "DEFERRED",
      ambiguityPosture: "JURISDICTION_AMBIGUITY",
      fairHousingPosture: "SAFE_CONTEXT_ONLY",
      dispositions: ["DEFERRED", "UNRESOLVED", "PUBLIC_ACTIVATION_BLOCKED"],
      relationships: [
        relationship("niwot-county-context", "protected:niwot", "county:boulder", "HAS_COUNTY_CONTEXT", { preservesOverlap: true }),
        relationship("niwot-market-context-boulder", "protected:niwot", "city:boulder", "HAS_MARKET_CONTEXT", { preservesOverlap: true }),
        relationship("niwot-market-context-longmont", "protected:niwot", "city:longmont", "HAS_MARKET_CONTEXT", { preservesOverlap: true }),
      ],
      blockers: ["OBJECT_TYPE_UNRESOLVED", "AUTHORITY_UNRESOLVED", "BOUNDARY_UNRESOLVED", "SEARCH_SUPPORT_NOT_AUTHORIZED", ...DEFAULT_BLOCKERS],
      limitations: ["Niwot remains unauthorized for Local Decision Intelligence Wave 4 and public activation.", ...DEFAULT_LIMITATIONS],
      futureReadinessOutcome: "Deferred until separate Niwot governance reconciliation is authorized.",
    }),
    candidate({
      candidateId: "protected-zip-hoa-conversion-guard",
      fixtureCoverage: "ZIP/HOA/object-type prohibited-conversion guard.",
      repositorySupport: "CERTIFIED_ARCHITECTURE_FIXTURE",
      includedInWave: false,
      protectedGuard: true,
      canonicalObjectId: "protected:zip-hoa-conversion",
      objectType: "ZIP_CODE_AREA",
      canonicalName: "ZIP and HOA Conversion Guard",
      slug: "zip-hoa-conversion-guard",
      aliases: ["HOA guard", "ZIP guard"],
      existingPublicRoute: null,
      parentObjectIds: ["county:boulder"],
      contextualObjectIds: [],
      municipalityContext: null,
      countyContext: "Boulder County",
      authorityPosture: "UNSUPPORTED",
      boundaryPosture: "PROHIBITED_FOR_PUBLIC_USE",
      routeReadiness: "BLOCKED",
      registryReadiness: "PUBLIC_ACTIVATION_PROHIBITED",
      searchSupport: "BLOCKED",
      mapSupport: "BLOCKED",
      sourceRightsPosture: "PROHIBITED",
      attributionRequired: false,
      maturityPosture: "BLOCKED",
      certificationReadiness: "BLOCKED_PENDING_SEPARATE_AUTHORIZATION",
      ambiguityPosture: "OBJECT_TYPE_AMBIGUITY",
      fairHousingPosture: "PROHIBITED_OUTPUT_GUARD",
      dispositions: ["PUBLIC_ACTIVATION_BLOCKED", "UNRESOLVED"],
      relationships: [],
      blockers: ["OBJECT_TYPE_UNRESOLVED", "PUBLIC_ROUTE_NOT_AUTHORIZED", "PUBLIC_REGISTRY_NOT_AUTHORIZED", "SEPARATE_AUTHORIZATION_REQUIRED"],
      limitations: ["ZIP code is not a community; HOA is not a neighborhood by default; market area is not a jurisdiction."],
      futureReadinessOutcome: "Prohibited conversion remains blocked.",
    }),
    candidate({
      candidateId: "protected-prohibited-output-guard",
      fixtureCoverage: "Prohibited-output guard.",
      repositorySupport: "CERTIFIED_ARCHITECTURE_FIXTURE",
      includedInWave: false,
      protectedGuard: true,
      canonicalObjectId: "protected:prohibited-output-guard",
      objectType: "NEIGHBORHOOD",
      canonicalName: "Prohibited Output Guard",
      slug: "prohibited-output-guard",
      aliases: [],
      existingPublicRoute: null,
      parentObjectIds: [],
      contextualObjectIds: [],
      municipalityContext: null,
      countyContext: "Boulder County",
      authorityPosture: "UNSUPPORTED",
      boundaryPosture: "UNAVAILABLE",
      routeReadiness: "BLOCKED",
      registryReadiness: "PUBLIC_ACTIVATION_PROHIBITED",
      searchSupport: "BLOCKED",
      mapSupport: "BLOCKED",
      sourceRightsPosture: "PROHIBITED",
      attributionRequired: false,
      maturityPosture: "BLOCKED",
      certificationReadiness: "BLOCKED_PENDING_SEPARATE_AUTHORIZATION",
      ambiguityPosture: "INSUFFICIENT_EVIDENCE",
      fairHousingPosture: "PROHIBITED_OUTPUT_GUARD",
      dispositions: ["PUBLIC_ACTIVATION_BLOCKED"],
      relationships: [],
      blockers: ["FAIR_HOUSING_REVIEW_REQUIRED", "PUBLIC_EVIDENCE_CONCLUSION_PROHIBITED", "SEPARATE_AUTHORIZATION_REQUIRED"],
      limitations: ["No rank, score, recommendation, valuation, forecast, demographic profile, school or safety conclusion, or investment conclusion may be produced."],
      futureReadinessOutcome: "Guard exists only to prove prohibited outputs remain absent.",
    }),
  ]);
