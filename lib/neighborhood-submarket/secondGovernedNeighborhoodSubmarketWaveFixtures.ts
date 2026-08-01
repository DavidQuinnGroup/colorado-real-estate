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

export type SecondGovernedNeighborhoodSubmarketDisposition =
  | "EXISTING_ROUTE_PRESERVED"
  | "ROUTE_ENHANCEMENT_READINESS_REVIEW"
  | "INTERNAL_READINESS_ONLY"
  | "IDENTITY_RECONCILIATION_REQUIRED"
  | "RELATIONSHIP_RECONCILIATION_REQUIRED"
  | "AUTHORITY_REVIEW_REQUIRED"
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

export type SecondGovernedNeighborhoodSubmarketRepositorySupport =
  | "EXISTING_PUBLIC_ROUTE"
  | "REPOSITORY_NEIGHBORHOOD_RECORD"
  | "CERTIFIED_ARCHITECTURE_FIXTURE"
  | "PROTECTED_NON_ACTIVATION_GUARD";

export type SecondGovernedNeighborhoodSubmarketRelationship = Readonly<{
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

export type SecondGovernedNeighborhoodSubmarketCandidate = Readonly<{
  candidateId: string;
  fixtureCoverage: string;
  wave2Differentiation: string;
  repositorySupport: SecondGovernedNeighborhoodSubmarketRepositorySupport;
  includedInWave: boolean;
  protectedGuard: boolean;
  canonicalObjectId: string;
  objectType: NeighborhoodSubmarketObjectType;
  canonicalName: string;
  slug: string;
  aliases: readonly string[];
  existingPublicRoute: string | null;
  parentObjectIds: readonly string[];
  childObjectIds: readonly string[];
  contextualObjectIds: readonly string[];
  municipalityContext: string | null;
  countyContext: string;
  state: "Colorado";
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
    | "INCOMPLETE_GEOMETRY"
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
    | "ROUTE_ENHANCEMENT_REVIEW_READY"
    | "FUTURE_CERTIFICATION_CANDIDATE"
    | "BLOCKED_PENDING_SEPARATE_AUTHORIZATION"
    | "DEFERRED"
    | "UNRESOLVED";
  routeEnhancementReadiness: Readonly<{
    reviewed: boolean;
    canonicalIdentityResolved: boolean;
    objectTypeResolved: boolean;
    relationshipsGoverned: boolean;
    authorityAcceptable: boolean;
    boundaryLimitationsDocumented: boolean;
    evidenceSufficient: boolean;
    sourceRightsSufficient: boolean;
    fairHousingContentStandardRequired: true;
    existingRoutePreserved: boolean;
    searchAndMapDependenciesIdentified: boolean;
    canonicalAndSitemapPreservationRequired: true;
    responsiveReviewRequired: true;
    deterministicValidationRequired: true;
    productionCertificationRequired: true;
    publicEnhancementAuthorized: false;
  }>;
  ambiguityPosture: NeighborhoodSubmarketAmbiguity;
  fairHousingPosture: "SAFE_CONTEXT_ONLY" | "REVIEW_REQUIRED" | "PROHIBITED_OUTPUT_GUARD";
  dispositions: readonly SecondGovernedNeighborhoodSubmarketDisposition[];
  relationships: readonly SecondGovernedNeighborhoodSubmarketRelationship[];
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
    priorityNeighborhood: null;
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
  "NON_PUBLIC_USE_RESTRICTION",
]);

const DEFAULT_BLOCKERS: readonly NeighborhoodSubmarketActivationBlocker[] = Object.freeze([
  "PUBLIC_ROUTE_NOT_AUTHORIZED",
  "PUBLIC_REGISTRY_NOT_AUTHORIZED",
  "SEARCH_SUPPORT_NOT_AUTHORIZED",
  "MAP_BOUNDARY_NOT_AUTHORIZED",
  "SEPARATE_AUTHORIZATION_REQUIRED",
]);

const DEFAULT_LIMITATIONS = Object.freeze([
  "Wave 2 posture is internal and does not authorize public activation.",
  "Route-specific readiness review does not change public content or eligibility.",
  "Evidence posture remains internal and must not be converted into a public conclusion.",
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
  priorityNeighborhood: null,
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

function routeEnhancementReadiness(
  input: Partial<SecondGovernedNeighborhoodSubmarketCandidate["routeEnhancementReadiness"]> = {},
) {
  return Object.freeze({
    reviewed: input.reviewed ?? false,
    canonicalIdentityResolved: input.canonicalIdentityResolved ?? false,
    objectTypeResolved: input.objectTypeResolved ?? false,
    relationshipsGoverned: input.relationshipsGoverned ?? false,
    authorityAcceptable: input.authorityAcceptable ?? false,
    boundaryLimitationsDocumented: input.boundaryLimitationsDocumented ?? false,
    evidenceSufficient: input.evidenceSufficient ?? false,
    sourceRightsSufficient: input.sourceRightsSufficient ?? false,
    fairHousingContentStandardRequired: true,
    existingRoutePreserved: input.existingRoutePreserved ?? false,
    searchAndMapDependenciesIdentified: input.searchAndMapDependenciesIdentified ?? false,
    canonicalAndSitemapPreservationRequired: true,
    responsiveReviewRequired: true,
    deterministicValidationRequired: true,
    productionCertificationRequired: true,
    publicEnhancementAuthorized: false,
  } as const);
}

function relationship(
  relationshipId: string,
  fromObjectId: string,
  toObjectId: string,
  relationshipType: NeighborhoodSubmarketRelationshipType,
  options: Partial<SecondGovernedNeighborhoodSubmarketRelationship> = {},
): SecondGovernedNeighborhoodSubmarketRelationship {
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
    SecondGovernedNeighborhoodSubmarketCandidate,
    "evidencePosture" | "routePreservation" | "routeEnhancementReadiness" | "activation" | "prohibitedOutputs"
  > &
    Readonly<{
      evidencePosture?: SecondGovernedNeighborhoodSubmarketCandidate["evidencePosture"];
      routeEnhancementReadiness?: Partial<SecondGovernedNeighborhoodSubmarketCandidate["routeEnhancementReadiness"]>;
    }>,
): SecondGovernedNeighborhoodSubmarketCandidate {
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
    routeEnhancementReadiness: routeEnhancementReadiness(input.routeEnhancementReadiness),
    activation: NO_ACTIVATION,
    prohibitedOutputs: NO_PROHIBITED_OUTPUTS,
  });
}

export const SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CANDIDATES: readonly SecondGovernedNeighborhoodSubmarketCandidate[] =
  Object.freeze([
    candidate({
      candidateId: "wave2-route-south-boulder-preserved",
      fixtureCoverage: "Additional existing neighborhood route preserved.",
      wave2Differentiation: "Adds a Boulder route not included in Wave 1 and records route-specific public-enhancement prerequisites.",
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
      childObjectIds: [],
      contextualObjectIds: ["county:boulder", "market-area:south-boulder-context"],
      municipalityContext: "Boulder",
      countyContext: "Boulder County",
      state: "Colorado",
      authorityPosture: "LOCALLY_RECOGNIZED_NON_AUTHORITATIVE",
      boundaryPosture: "DESCRIPTIVE_AREA_ONLY",
      routeReadiness: "CONTENT_PREREQUISITES_INCOMPLETE",
      registryReadiness: "IDENTITY_GOVERNED",
      searchSupport: "NEIGHBORHOOD_FILTER_COMPATIBLE",
      mapSupport: "NO_PUBLIC_BOUNDARY",
      sourceRightsPosture: "DERIVED_OR_SUMMARY_USE_ONLY",
      attributionRequired: false,
      maturityPosture: "CONTENT_FOUNDATION",
      certificationReadiness: "ROUTE_ENHANCEMENT_REVIEW_READY",
      routeEnhancementReadiness: {
        reviewed: true,
        canonicalIdentityResolved: true,
        objectTypeResolved: true,
        relationshipsGoverned: true,
        authorityAcceptable: true,
        boundaryLimitationsDocumented: true,
        evidenceSufficient: false,
        sourceRightsSufficient: true,
        existingRoutePreserved: true,
        searchAndMapDependenciesIdentified: true,
      },
      ambiguityPosture: "NO_KNOWN_AMBIGUITY",
      fairHousingPosture: "SAFE_CONTEXT_ONLY",
      dispositions: ["EXISTING_ROUTE_PRESERVED", "ROUTE_ENHANCEMENT_READINESS_REVIEW", "EVIDENCE_INCOMPLETE"],
      relationships: [
        relationship("south-boulder-within-boulder", "neighborhood:boulder:south-boulder", "city:boulder", "WITHIN"),
        relationship("south-boulder-market-context", "neighborhood:boulder:south-boulder", "market-area:south-boulder-context", "HAS_MARKET_CONTEXT"),
        relationship("south-boulder-county-context", "neighborhood:boulder:south-boulder", "county:boulder", "HAS_COUNTY_CONTEXT"),
      ],
      blockers: ["PUBLIC_EVIDENCE_CONCLUSION_PROHIBITED", ...DEFAULT_BLOCKERS],
      limitations: DEFAULT_LIMITATIONS,
      futureReadinessOutcome: "Possible future bounded route enhancement candidate after evidence and public-copy certification.",
    }),
    candidate({
      candidateId: "wave2-route-table-mesa-enhancement-review",
      fixtureCoverage: "Route-specific enhancement-readiness review.",
      wave2Differentiation: "Adds route-specific readiness criteria for a preserved Boulder route with boundary limitations.",
      repositorySupport: "EXISTING_PUBLIC_ROUTE",
      includedInWave: true,
      protectedGuard: false,
      canonicalObjectId: "neighborhood:boulder:table-mesa",
      objectType: "NEIGHBORHOOD",
      canonicalName: "Table Mesa",
      slug: "table-mesa",
      aliases: ["Table Mesa area"],
      existingPublicRoute: "/market/boulder/table-mesa",
      parentObjectIds: ["city:boulder"],
      childObjectIds: [],
      contextualObjectIds: ["county:boulder", "market-area:south-boulder-context"],
      municipalityContext: "Boulder",
      countyContext: "Boulder County",
      state: "Colorado",
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
      routeEnhancementReadiness: {
        reviewed: true,
        canonicalIdentityResolved: true,
        objectTypeResolved: true,
        relationshipsGoverned: true,
        authorityAcceptable: true,
        boundaryLimitationsDocumented: true,
        evidenceSufficient: false,
        sourceRightsSufficient: true,
        existingRoutePreserved: true,
        searchAndMapDependenciesIdentified: true,
      },
      ambiguityPosture: "BOUNDARY_AMBIGUITY",
      fairHousingPosture: "SAFE_CONTEXT_ONLY",
      dispositions: ["EXISTING_ROUTE_PRESERVED", "ROUTE_ENHANCEMENT_READINESS_REVIEW", "BOUNDARY_UNRESOLVED"],
      relationships: [
        relationship("table-mesa-within-boulder", "neighborhood:boulder:table-mesa", "city:boulder", "WITHIN"),
        relationship("table-mesa-associated-south-boulder", "neighborhood:boulder:table-mesa", "neighborhood:boulder:south-boulder", "ASSOCIATED_WITH", {
          preservesOverlap: true,
        }),
      ],
      blockers: ["BOUNDARY_UNRESOLVED", ...DEFAULT_BLOCKERS],
      limitations: ["Approximate boundary posture is not public geometry authority.", ...DEFAULT_LIMITATIONS],
      futureReadinessOutcome: "Future enhancement requires boundary-limit copy and responsive certification.",
    }),
    candidate({
      candidateId: "wave2-route-chautauqua-incomplete-evidence",
      fixtureCoverage: "Candidate with complete identity but incomplete evidence.",
      wave2Differentiation: "Adds property-diligence-sensitive neighborhood context while preserving non-conclusive evidence posture.",
      repositorySupport: "EXISTING_PUBLIC_ROUTE",
      includedInWave: true,
      protectedGuard: false,
      canonicalObjectId: "neighborhood:boulder:chautauqua",
      objectType: "NEIGHBORHOOD",
      canonicalName: "Chautauqua",
      slug: "chautauqua",
      aliases: ["Chautauqua area"],
      existingPublicRoute: "/market/boulder/chautauqua",
      parentObjectIds: ["city:boulder"],
      childObjectIds: [],
      contextualObjectIds: ["county:boulder", "market-area:boulder-foothills-context"],
      municipalityContext: "Boulder",
      countyContext: "Boulder County",
      state: "Colorado",
      authorityPosture: "LOCALLY_RECOGNIZED_NON_AUTHORITATIVE",
      boundaryPosture: "OVERLAPPING_BOUNDARY",
      routeReadiness: "EVIDENCE_PREREQUISITES_INCOMPLETE",
      registryReadiness: "EVIDENCE_INCOMPLETE",
      searchSupport: "NEIGHBORHOOD_FILTER_COMPATIBLE",
      mapSupport: "NO_PUBLIC_BOUNDARY",
      sourceRightsPosture: "INTERNAL_ANALYSIS_ONLY",
      attributionRequired: false,
      maturityPosture: "CONTENT_FOUNDATION",
      certificationReadiness: "INTERNAL_REVIEW_READY",
      routeEnhancementReadiness: {
        reviewed: true,
        canonicalIdentityResolved: true,
        objectTypeResolved: true,
        relationshipsGoverned: true,
        authorityAcceptable: false,
        boundaryLimitationsDocumented: true,
        evidenceSufficient: false,
        sourceRightsSufficient: false,
        existingRoutePreserved: true,
        searchAndMapDependenciesIdentified: true,
      },
      ambiguityPosture: "OVERLAPPING_IDENTITY",
      fairHousingPosture: "REVIEW_REQUIRED",
      dispositions: ["EXISTING_ROUTE_PRESERVED", "EVIDENCE_INCOMPLETE", "FAIR_HOUSING_REVIEW_REQUIRED"],
      relationships: [
        relationship("chautauqua-within-boulder", "neighborhood:boulder:chautauqua", "city:boulder", "WITHIN"),
        relationship("chautauqua-overlaps-foothills", "neighborhood:boulder:chautauqua", "market-area:boulder-foothills-context", "OVERLAPS", {
          preservesOverlap: true,
          sourceRightsPosture: "INTERNAL_ANALYSIS_ONLY",
        }),
      ],
      blockers: ["FAIR_HOUSING_REVIEW_REQUIRED", "PUBLIC_EVIDENCE_CONCLUSION_PROHIBITED", ...DEFAULT_BLOCKERS],
      limitations: ["Environmental or terrain context must remain question-preparation only.", ...DEFAULT_LIMITATIONS],
      futureReadinessOutcome: "Future enhancement requires fair-housing and boundary limitation review.",
    }),
    candidate({
      candidateId: "wave2-route-wonderland-hills-alias-conflict",
      fixtureCoverage: "Alias conflict.",
      wave2Differentiation: "Adds alias reconciliation for a repository route with overlapping local naming.",
      repositorySupport: "EXISTING_PUBLIC_ROUTE",
      includedInWave: true,
      protectedGuard: false,
      canonicalObjectId: "neighborhood:boulder:wonderland-hills",
      objectType: "NEIGHBORHOOD",
      canonicalName: "Wonderland Hills",
      slug: "wonderland-hills",
      aliases: ["Wonderland", "Wonderland Lake area"],
      existingPublicRoute: "/market/boulder/wonderland-hills",
      parentObjectIds: ["city:boulder"],
      childObjectIds: [],
      contextualObjectIds: ["county:boulder", "market-area:north-boulder-context"],
      municipalityContext: "Boulder",
      countyContext: "Boulder County",
      state: "Colorado",
      authorityPosture: "LOCALLY_RECOGNIZED_NON_AUTHORITATIVE",
      boundaryPosture: "DESCRIPTIVE_AREA_ONLY",
      routeReadiness: "CONTENT_PREREQUISITES_INCOMPLETE",
      registryReadiness: "IDENTITY_GOVERNED",
      searchSupport: "ALIAS_ONLY",
      mapSupport: "NO_PUBLIC_BOUNDARY",
      sourceRightsPosture: "DERIVED_OR_SUMMARY_USE_ONLY",
      attributionRequired: false,
      maturityPosture: "ARCHITECTURE_FOUNDATION",
      certificationReadiness: "NOT_CERTIFICATION_READY",
      ambiguityPosture: "NAMING_AMBIGUITY",
      fairHousingPosture: "SAFE_CONTEXT_ONLY",
      dispositions: ["EXISTING_ROUTE_PRESERVED", "IDENTITY_RECONCILIATION_REQUIRED", "SEARCH_UNSUPPORTED"],
      relationships: [
        relationship("wonderland-hills-within-boulder", "neighborhood:boulder:wonderland-hills", "city:boulder", "WITHIN"),
        relationship("wonderland-hills-market-context", "neighborhood:boulder:wonderland-hills", "market-area:north-boulder-context", "HAS_MARKET_CONTEXT"),
      ],
      blockers: ["OBJECT_TYPE_UNRESOLVED", ...DEFAULT_BLOCKERS],
      limitations: ["Alias-only Search posture does not authorize a public Search filter.", ...DEFAULT_LIMITATIONS],
      futureReadinessOutcome: "Alias reconciliation must precede any route enhancement.",
    }),
    candidate({
      candidateId: "wave2-route-rock-creek-parent-child",
      fixtureCoverage: "Parent/child reconciliation.",
      wave2Differentiation: "Adds Superior context and parent/child posture outside the Boulder/Louisville/Lafayette Wave 1 center.",
      repositorySupport: "EXISTING_PUBLIC_ROUTE",
      includedInWave: true,
      protectedGuard: false,
      canonicalObjectId: "neighborhood:superior:rock-creek",
      objectType: "NEIGHBORHOOD",
      canonicalName: "Rock Creek",
      slug: "rock-creek",
      aliases: ["Rock Creek Superior"],
      existingPublicRoute: "/market/superior/rock-creek",
      parentObjectIds: ["town:superior"],
      childObjectIds: ["subdivision:superior:rock-creek-subareas"],
      contextualObjectIds: ["county:boulder", "county:jefferson"],
      municipalityContext: "Superior",
      countyContext: "Boulder County",
      state: "Colorado",
      authorityPosture: "LOCALLY_RECOGNIZED_NON_AUTHORITATIVE",
      boundaryPosture: "OVERLAPPING_BOUNDARY",
      routeReadiness: "EVIDENCE_PREREQUISITES_INCOMPLETE",
      registryReadiness: "IDENTITY_GOVERNED",
      searchSupport: "NEIGHBORHOOD_FILTER_COMPATIBLE",
      mapSupport: "INCOMPLETE_GEOMETRY",
      sourceRightsPosture: "DERIVED_OR_SUMMARY_USE_ONLY",
      attributionRequired: false,
      maturityPosture: "ARCHITECTURE_FOUNDATION",
      certificationReadiness: "FUTURE_CERTIFICATION_CANDIDATE",
      ambiguityPosture: "PARENT_AMBIGUITY",
      fairHousingPosture: "SAFE_CONTEXT_ONLY",
      dispositions: ["EXISTING_ROUTE_PRESERVED", "RELATIONSHIP_RECONCILIATION_REQUIRED", "FUTURE_CERTIFICATION_CANDIDATE"],
      relationships: [
        relationship("rock-creek-part-of-superior", "neighborhood:superior:rock-creek", "town:superior", "PART_OF"),
        relationship("rock-creek-contains-subareas", "neighborhood:superior:rock-creek", "subdivision:superior:rock-creek-subareas", "CONTAINS"),
        relationship("rock-creek-county-context", "neighborhood:superior:rock-creek", "county:boulder", "HAS_COUNTY_CONTEXT"),
      ],
      blockers: ["PUBLIC_EVIDENCE_CONCLUSION_PROHIBITED", ...DEFAULT_BLOCKERS],
      limitations: ["Parent/child posture remains internal and does not create subdivision public eligibility.", ...DEFAULT_LIMITATIONS],
      futureReadinessOutcome: "Candidate may support a later route-enhancement review after parent/child evidence certification.",
    }),
    candidate({
      candidateId: "wave2-route-sagmore-overlap-context",
      fixtureCoverage: "Overlapping market and municipal context.",
      wave2Differentiation: "Adds overlap reconciliation for a Superior repository route.",
      repositorySupport: "EXISTING_PUBLIC_ROUTE",
      includedInWave: true,
      protectedGuard: false,
      canonicalObjectId: "neighborhood:superior:sagmore",
      objectType: "NEIGHBORHOOD",
      canonicalName: "Sagmore",
      slug: "sagmore",
      aliases: ["Sagamore", "Sagmore Superior"],
      existingPublicRoute: "/market/superior/sagmore",
      parentObjectIds: ["town:superior"],
      childObjectIds: [],
      contextualObjectIds: ["county:boulder", "market-area:us-36-corridor-context"],
      municipalityContext: "Superior",
      countyContext: "Boulder County",
      state: "Colorado",
      authorityPosture: "LOCALLY_RECOGNIZED_NON_AUTHORITATIVE",
      boundaryPosture: "DISPUTED_OR_CONFLICTING_BOUNDARY",
      routeReadiness: "BOUNDARY_PREREQUISITES_INCOMPLETE",
      registryReadiness: "IDENTITY_GOVERNED",
      searchSupport: "ALIAS_ONLY",
      mapSupport: "FUTURE_REVIEW_REQUIRED",
      sourceRightsPosture: "UNKNOWN_OR_UNRESOLVED",
      attributionRequired: false,
      maturityPosture: "IDENTITY_ONLY",
      certificationReadiness: "NOT_CERTIFICATION_READY",
      ambiguityPosture: "NAMING_AMBIGUITY",
      fairHousingPosture: "SAFE_CONTEXT_ONLY",
      dispositions: ["EXISTING_ROUTE_PRESERVED", "IDENTITY_RECONCILIATION_REQUIRED", "BOUNDARY_UNRESOLVED", "SOURCE_RIGHTS_INCOMPLETE"],
      relationships: [
        relationship("sagmore-part-of-superior", "neighborhood:superior:sagmore", "town:superior", "PART_OF"),
        relationship("sagmore-corridor-context", "neighborhood:superior:sagmore", "market-area:us-36-corridor-context", "HAS_MARKET_CONTEXT", {
          preservesOverlap: true,
          sourceRightsPosture: "UNKNOWN_OR_UNRESOLVED",
        }),
      ],
      blockers: ["BOUNDARY_UNRESOLVED", "SOURCE_RIGHTS_UNRESOLVED", ...DEFAULT_BLOCKERS],
      limitations: ["Name and boundary conflict remain unresolved and activation-blocked.", ...DEFAULT_LIMITATIONS],
      futureReadinessOutcome: "Requires identity, naming, and boundary reconciliation before any public enhancement.",
    }),
    candidate({
      candidateId: "wave2-route-original-superior-authority-conflict",
      fixtureCoverage: "Authority conflict.",
      wave2Differentiation: "Adds official-town versus local-area distinction for an existing route.",
      repositorySupport: "EXISTING_PUBLIC_ROUTE",
      includedInWave: true,
      protectedGuard: false,
      canonicalObjectId: "neighborhood:superior:original-superior",
      objectType: "NEIGHBORHOOD",
      canonicalName: "Original Superior",
      slug: "original-superior",
      aliases: ["Old Superior"],
      existingPublicRoute: "/market/superior/original-superior",
      parentObjectIds: ["town:superior"],
      childObjectIds: [],
      contextualObjectIds: ["county:boulder"],
      municipalityContext: "Superior",
      countyContext: "Boulder County",
      state: "Colorado",
      authorityPosture: "LOCALLY_RECOGNIZED_NON_AUTHORITATIVE",
      boundaryPosture: "APPROXIMATE_BOUNDARY",
      routeReadiness: "NOT_EVALUATED",
      registryReadiness: "AUTHORITY_UNRESOLVED",
      searchSupport: "NEIGHBORHOOD_FILTER_COMPATIBLE",
      mapSupport: "APPROXIMATE_ONLY",
      sourceRightsPosture: "DERIVED_OR_SUMMARY_USE_ONLY",
      attributionRequired: true,
      maturityPosture: "IDENTITY_ONLY",
      certificationReadiness: "NOT_CERTIFICATION_READY",
      ambiguityPosture: "JURISDICTION_AMBIGUITY",
      fairHousingPosture: "SAFE_CONTEXT_ONLY",
      dispositions: ["EXISTING_ROUTE_PRESERVED", "AUTHORITY_REVIEW_REQUIRED"],
      relationships: [relationship("original-superior-part-of-town", "neighborhood:superior:original-superior", "town:superior", "PART_OF")],
      blockers: ["AUTHORITY_UNRESOLVED", ...DEFAULT_BLOCKERS],
      limitations: ["Local naming does not create legal authority or incorporated-place posture.", ...DEFAULT_LIMITATIONS],
      futureReadinessOutcome: "Authority posture must be clarified before public limitation copy changes.",
    }),
    candidate({
      candidateId: "wave2-route-washington-park-attribution-required",
      fixtureCoverage: "Attribution-required evidence.",
      wave2Differentiation: "Adds Denver route preservation outside the Boulder County cluster.",
      repositorySupport: "EXISTING_PUBLIC_ROUTE",
      includedInWave: true,
      protectedGuard: false,
      canonicalObjectId: "neighborhood:denver:washington-park",
      objectType: "NEIGHBORHOOD",
      canonicalName: "Washington Park",
      slug: "washington-park",
      aliases: ["Wash Park"],
      existingPublicRoute: "/market/denver/washington-park",
      parentObjectIds: ["city:denver"],
      childObjectIds: [],
      contextualObjectIds: ["county:denver", "market-area:central-denver-context"],
      municipalityContext: "Denver",
      countyContext: "Denver County",
      state: "Colorado",
      authorityPosture: "LOCALLY_RECOGNIZED_NON_AUTHORITATIVE",
      boundaryPosture: "DESCRIPTIVE_AREA_ONLY",
      routeReadiness: "SOURCE_RIGHTS_PREREQUISITES_INCOMPLETE",
      registryReadiness: "EVIDENCE_INCOMPLETE",
      searchSupport: "NEIGHBORHOOD_FILTER_COMPATIBLE",
      mapSupport: "NO_PUBLIC_BOUNDARY",
      sourceRightsPosture: "DERIVED_OR_SUMMARY_USE_ONLY",
      attributionRequired: true,
      maturityPosture: "CONTENT_FOUNDATION",
      certificationReadiness: "INTERNAL_REVIEW_READY",
      ambiguityPosture: "NO_KNOWN_AMBIGUITY",
      fairHousingPosture: "SAFE_CONTEXT_ONLY",
      dispositions: ["EXISTING_ROUTE_PRESERVED", "SOURCE_RIGHTS_INCOMPLETE"],
      relationships: [
        relationship("washington-park-within-denver", "neighborhood:denver:washington-park", "city:denver", "WITHIN"),
        relationship("washington-park-county-context", "neighborhood:denver:washington-park", "county:denver", "HAS_COUNTY_CONTEXT"),
      ],
      blockers: ["SOURCE_RIGHTS_UNRESOLVED", ...DEFAULT_BLOCKERS],
      limitations: ["Attribution posture must be certified before any expanded public evidence display.", ...DEFAULT_LIMITATIONS],
      futureReadinessOutcome: "Future enhancement requires Denver-specific source-rights and public-copy review.",
    }),
    candidate({
      candidateId: "wave2-internal-us36-corridor-rights-unknown",
      fixtureCoverage: "Unknown-rights evidence.",
      wave2Differentiation: "Adds corridor context as internal relationship support rather than a route or jurisdiction.",
      repositorySupport: "CERTIFIED_ARCHITECTURE_FIXTURE",
      includedInWave: true,
      protectedGuard: false,
      canonicalObjectId: "corridor:us-36-boulder-denver-context",
      objectType: "CORRIDOR",
      canonicalName: "US 36 Boulder-Denver Context",
      slug: "us-36-boulder-denver-context",
      aliases: ["US 36 corridor context"],
      existingPublicRoute: null,
      parentObjectIds: ["state:colorado"],
      childObjectIds: [],
      contextualObjectIds: ["city:boulder", "town:superior", "city:denver"],
      municipalityContext: null,
      countyContext: "Multiple Colorado counties",
      state: "Colorado",
      authorityPosture: "PLATFORM_DEFINED_MARKET_AREA",
      boundaryPosture: "DESCRIPTIVE_AREA_ONLY",
      routeReadiness: "BLOCKED",
      registryReadiness: "PUBLIC_ACTIVATION_PROHIBITED",
      searchSupport: "UNSUPPORTED",
      mapSupport: "BLOCKED",
      sourceRightsPosture: "UNKNOWN_OR_UNRESOLVED",
      attributionRequired: false,
      maturityPosture: "ARCHITECTURE_FOUNDATION",
      certificationReadiness: "BLOCKED_PENDING_SEPARATE_AUTHORIZATION",
      ambiguityPosture: "OVERLAPPING_IDENTITY",
      fairHousingPosture: "SAFE_CONTEXT_ONLY",
      dispositions: ["INTERNAL_READINESS_ONLY", "SOURCE_RIGHTS_INCOMPLETE", "SEARCH_UNSUPPORTED", "MAP_UNSUPPORTED", "PUBLIC_ACTIVATION_BLOCKED"],
      relationships: [
        relationship("us36-served-by-state-context", "corridor:us-36-boulder-denver-context", "state:colorado", "SERVED_BY", {
          sourceRightsPosture: "UNKNOWN_OR_UNRESOLVED",
        }),
        relationship("us36-crosses-boulder-context", "corridor:us-36-boulder-denver-context", "county:boulder", "CROSSES", {
          preservesOverlap: true,
          sourceRightsPosture: "UNKNOWN_OR_UNRESOLVED",
        }),
      ],
      blockers: ["SOURCE_RIGHTS_UNRESOLVED", "MAP_BOUNDARY_NOT_AUTHORIZED", ...DEFAULT_BLOCKERS],
      limitations: ["Corridor context is internal and is not a public route, jurisdiction, or ranking dimension.", ...DEFAULT_LIMITATIONS],
      futureReadinessOutcome: "May support relationship context only after rights and boundary posture remain fail-closed.",
    }),
    candidate({
      candidateId: "wave2-internal-central-denver-market-context",
      fixtureCoverage: "Internal-only evidence.",
      wave2Differentiation: "Adds internal market-area context connected to an existing Denver route without public activation.",
      repositorySupport: "CERTIFIED_ARCHITECTURE_FIXTURE",
      includedInWave: true,
      protectedGuard: false,
      canonicalObjectId: "market-area:central-denver-context",
      objectType: "MARKET_AREA",
      canonicalName: "Central Denver Context",
      slug: "central-denver-context",
      aliases: ["Central Denver market context"],
      existingPublicRoute: null,
      parentObjectIds: ["city:denver"],
      childObjectIds: [],
      contextualObjectIds: ["neighborhood:denver:washington-park"],
      municipalityContext: "Denver",
      countyContext: "Denver County",
      state: "Colorado",
      authorityPosture: "PLATFORM_DEFINED_MARKET_AREA",
      boundaryPosture: "PROHIBITED_FOR_PUBLIC_USE",
      routeReadiness: "BLOCKED",
      registryReadiness: "PUBLIC_ACTIVATION_PROHIBITED",
      searchSupport: "UNSUPPORTED",
      mapSupport: "NO_PUBLIC_BOUNDARY",
      sourceRightsPosture: "INTERNAL_ANALYSIS_ONLY",
      attributionRequired: false,
      maturityPosture: "ARCHITECTURE_FOUNDATION",
      certificationReadiness: "BLOCKED_PENDING_SEPARATE_AUTHORIZATION",
      ambiguityPosture: "OVERLAPPING_IDENTITY",
      fairHousingPosture: "SAFE_CONTEXT_ONLY",
      dispositions: ["INTERNAL_READINESS_ONLY", "MAP_UNSUPPORTED", "PUBLIC_ACTIVATION_BLOCKED"],
      relationships: [
        relationship("central-denver-context-associated-washington-park", "market-area:central-denver-context", "neighborhood:denver:washington-park", "ASSOCIATED_WITH", {
          preservesOverlap: true,
          sourceRightsPosture: "INTERNAL_ANALYSIS_ONLY",
        }),
      ],
      blockers: ["MAP_BOUNDARY_NOT_AUTHORIZED", ...DEFAULT_BLOCKERS],
      limitations: ["Market area is not a legal jurisdiction and has no public route authority.", ...DEFAULT_LIMITATIONS],
      futureReadinessOutcome: "Internal context may support future evidence review only.",
    }),
    candidate({
      candidateId: "wave2-internal-rock-creek-subareas",
      fixtureCoverage: "Internal subdivision context.",
      wave2Differentiation: "Adds internal child-object posture for a preserved Superior route.",
      repositorySupport: "CERTIFIED_ARCHITECTURE_FIXTURE",
      includedInWave: true,
      protectedGuard: false,
      canonicalObjectId: "subdivision:superior:rock-creek-subareas",
      objectType: "SUBDIVISION",
      canonicalName: "Rock Creek Subareas",
      slug: "rock-creek-subareas",
      aliases: ["Rock Creek filings"],
      existingPublicRoute: null,
      parentObjectIds: ["neighborhood:superior:rock-creek"],
      childObjectIds: [],
      contextualObjectIds: ["town:superior", "county:boulder"],
      municipalityContext: "Superior",
      countyContext: "Boulder County",
      state: "Colorado",
      authorityPosture: "RECORDED_SUBDIVISION",
      boundaryPosture: "UNRESOLVED",
      routeReadiness: "BLOCKED",
      registryReadiness: "PUBLIC_ACTIVATION_PROHIBITED",
      searchSupport: "SUBDIVISION_FILTER_COMPATIBLE",
      mapSupport: "FUTURE_REVIEW_REQUIRED",
      sourceRightsPosture: "RESTRICTED",
      attributionRequired: false,
      maturityPosture: "IDENTITY_ONLY",
      certificationReadiness: "BLOCKED_PENDING_SEPARATE_AUTHORIZATION",
      ambiguityPosture: "INSUFFICIENT_EVIDENCE",
      fairHousingPosture: "SAFE_CONTEXT_ONLY",
      dispositions: ["INTERNAL_READINESS_ONLY", "SOURCE_RIGHTS_INCOMPLETE", "BOUNDARY_UNRESOLVED", "PUBLIC_ACTIVATION_BLOCKED"],
      relationships: [relationship("rock-creek-subareas-part-of-rock-creek", "subdivision:superior:rock-creek-subareas", "neighborhood:superior:rock-creek", "PART_OF")],
      blockers: ["SOURCE_RIGHTS_UNRESOLVED", "BOUNDARY_UNRESOLVED", ...DEFAULT_BLOCKERS],
      limitations: ["Subdivision evidence is internal and creates no public registry eligibility.", ...DEFAULT_LIMITATIONS],
      futureReadinessOutcome: "Requires recorded-subdivision evidence and rights review before any public consideration.",
    }),
    candidate({
      candidateId: "wave2-route-park-context-map-blocked",
      fixtureCoverage: "Search-supported but map-blocked.",
      wave2Differentiation: "Adds Search/map separation for a Denver route where public boundary use remains blocked.",
      repositorySupport: "EXISTING_PUBLIC_ROUTE",
      includedInWave: true,
      protectedGuard: false,
      canonicalObjectId: "neighborhood:denver:washington-park-search-context",
      objectType: "DISTRICT",
      canonicalName: "Washington Park Search Context",
      slug: "washington-park",
      aliases: ["Wash Park search context"],
      existingPublicRoute: "/market/denver/washington-park",
      parentObjectIds: ["city:denver"],
      childObjectIds: [],
      contextualObjectIds: ["neighborhood:denver:washington-park"],
      municipalityContext: "Denver",
      countyContext: "Denver County",
      state: "Colorado",
      authorityPosture: "PLATFORM_DEFINED_MARKET_AREA",
      boundaryPosture: "PROHIBITED_FOR_PUBLIC_USE",
      routeReadiness: "BOUNDARY_PREREQUISITES_INCOMPLETE",
      registryReadiness: "PUBLIC_ACTIVATION_PROHIBITED",
      searchSupport: "NEIGHBORHOOD_FILTER_COMPATIBLE",
      mapSupport: "BLOCKED",
      sourceRightsPosture: "INTERNAL_ANALYSIS_ONLY",
      attributionRequired: false,
      maturityPosture: "ARCHITECTURE_FOUNDATION",
      certificationReadiness: "BLOCKED_PENDING_SEPARATE_AUTHORIZATION",
      ambiguityPosture: "OBJECT_TYPE_AMBIGUITY",
      fairHousingPosture: "SAFE_CONTEXT_ONLY",
      dispositions: ["EXISTING_ROUTE_PRESERVED", "MAP_UNSUPPORTED", "PUBLIC_ACTIVATION_BLOCKED"],
      relationships: [relationship("washington-park-search-associated-route", "neighborhood:denver:washington-park-search-context", "neighborhood:denver:washington-park", "ASSOCIATED_WITH")],
      blockers: ["MAP_BOUNDARY_NOT_AUTHORIZED", ...DEFAULT_BLOCKERS],
      limitations: ["Search compatibility does not create public boundary authority.", ...DEFAULT_LIMITATIONS],
      futureReadinessOutcome: "Future route work must preserve Search/map separation.",
    }),
    candidate({
      candidateId: "wave2-internal-north-boulder-market-map-prohibited",
      fixtureCoverage: "Map-context available but public boundary prohibited.",
      wave2Differentiation: "Deepens Wave 1 North Boulder context without changing the existing route.",
      repositorySupport: "CERTIFIED_ARCHITECTURE_FIXTURE",
      includedInWave: true,
      protectedGuard: false,
      canonicalObjectId: "market-area:north-boulder-context",
      objectType: "MARKET_AREA",
      canonicalName: "North Boulder Context",
      slug: "north-boulder-context",
      aliases: ["NoBo context"],
      existingPublicRoute: null,
      parentObjectIds: ["city:boulder"],
      childObjectIds: ["neighborhood:boulder:wonderland-hills"],
      contextualObjectIds: ["county:boulder"],
      municipalityContext: "Boulder",
      countyContext: "Boulder County",
      state: "Colorado",
      authorityPosture: "PLATFORM_DEFINED_MARKET_AREA",
      boundaryPosture: "PROHIBITED_FOR_PUBLIC_USE",
      routeReadiness: "BLOCKED",
      registryReadiness: "PUBLIC_ACTIVATION_PROHIBITED",
      searchSupport: "UNSUPPORTED",
      mapSupport: "BOUNDARY_RIGHTS_INCOMPLETE",
      sourceRightsPosture: "PROHIBITED",
      attributionRequired: false,
      maturityPosture: "ARCHITECTURE_FOUNDATION",
      certificationReadiness: "BLOCKED_PENDING_SEPARATE_AUTHORIZATION",
      ambiguityPosture: "OVERLAPPING_IDENTITY",
      fairHousingPosture: "SAFE_CONTEXT_ONLY",
      dispositions: ["INTERNAL_READINESS_ONLY", "MAP_UNSUPPORTED", "PUBLIC_ACTIVATION_BLOCKED"],
      relationships: [
        relationship("north-boulder-context-contains-wonderland-hills", "market-area:north-boulder-context", "neighborhood:boulder:wonderland-hills", "CONTAINS", {
          sourceRightsPosture: "PROHIBITED",
        }),
      ],
      blockers: ["MAP_BOUNDARY_NOT_AUTHORIZED", "SOURCE_RIGHTS_UNRESOLVED", ...DEFAULT_BLOCKERS],
      limitations: ["Internal context may not be displayed as a public map boundary.", ...DEFAULT_LIMITATIONS],
      futureReadinessOutcome: "Public boundary use remains prohibited.",
    }),
    candidate({
      candidateId: "wave2-fair-housing-review-guard",
      fixtureCoverage: "Fair-housing review guard.",
      wave2Differentiation: "Adds a dedicated public-copy blocker for any future route enhancement.",
      repositorySupport: "CERTIFIED_ARCHITECTURE_FIXTURE",
      includedInWave: true,
      protectedGuard: true,
      canonicalObjectId: "guard:fair-housing-route-enhancement-copy",
      objectType: "NEIGHBORHOOD",
      canonicalName: "Route Enhancement Fair Housing Guard",
      slug: "route-enhancement-fair-housing-guard",
      aliases: [],
      existingPublicRoute: null,
      parentObjectIds: ["platform:reie"],
      childObjectIds: [],
      contextualObjectIds: [],
      municipalityContext: null,
      countyContext: "Colorado",
      state: "Colorado",
      authorityPosture: "UNSUPPORTED",
      boundaryPosture: "UNAVAILABLE",
      routeReadiness: "FAIR_HOUSING_REVIEW_REQUIRED",
      registryReadiness: "PUBLIC_ACTIVATION_PROHIBITED",
      searchSupport: "BLOCKED",
      mapSupport: "BLOCKED",
      sourceRightsPosture: "INTERNAL_ANALYSIS_ONLY",
      attributionRequired: false,
      maturityPosture: "BLOCKED",
      certificationReadiness: "BLOCKED_PENDING_SEPARATE_AUTHORIZATION",
      ambiguityPosture: "INSUFFICIENT_EVIDENCE",
      fairHousingPosture: "PROHIBITED_OUTPUT_GUARD",
      dispositions: ["FAIR_HOUSING_REVIEW_REQUIRED", "PUBLIC_ACTIVATION_BLOCKED"],
      relationships: [],
      blockers: ["FAIR_HOUSING_REVIEW_REQUIRED", ...DEFAULT_BLOCKERS],
      limitations: ["Future public copy must remain neutral, non-ranking, and non-suitability based.", ...DEFAULT_LIMITATIONS],
      futureReadinessOutcome: "Any public enhancement requires separate fair-housing review.",
    }),
    candidate({
      candidateId: "wave2-future-certification-without-activation",
      fixtureCoverage: "Future certification candidate without activation.",
      wave2Differentiation: "Separates future certification candidacy from public activation authority.",
      repositorySupport: "REPOSITORY_NEIGHBORHOOD_RECORD",
      includedInWave: true,
      protectedGuard: false,
      canonicalObjectId: "neighborhood:boulder:south-boulder-certification-candidate",
      objectType: "NEIGHBORHOOD",
      canonicalName: "South Boulder Certification Candidate",
      slug: "south-boulder",
      aliases: ["South Boulder route candidate"],
      existingPublicRoute: "/market/boulder/south-boulder",
      parentObjectIds: ["city:boulder"],
      childObjectIds: [],
      contextualObjectIds: ["neighborhood:boulder:south-boulder"],
      municipalityContext: "Boulder",
      countyContext: "Boulder County",
      state: "Colorado",
      authorityPosture: "LOCALLY_RECOGNIZED_NON_AUTHORITATIVE",
      boundaryPosture: "DESCRIPTIVE_AREA_ONLY",
      routeReadiness: "PUBLICLY_ELIGIBLE_ONLY_AFTER_SEPARATE_AUTHORIZATION",
      registryReadiness: "ELIGIBLE_ONLY_AFTER_SEPARATE_AUTHORIZATION",
      searchSupport: "NEIGHBORHOOD_FILTER_COMPATIBLE",
      mapSupport: "NO_PUBLIC_BOUNDARY",
      sourceRightsPosture: "DERIVED_OR_SUMMARY_USE_ONLY",
      attributionRequired: false,
      maturityPosture: "CONTENT_FOUNDATION",
      certificationReadiness: "FUTURE_CERTIFICATION_CANDIDATE",
      routeEnhancementReadiness: {
        reviewed: true,
        canonicalIdentityResolved: true,
        objectTypeResolved: true,
        relationshipsGoverned: true,
        authorityAcceptable: true,
        boundaryLimitationsDocumented: true,
        evidenceSufficient: true,
        sourceRightsSufficient: true,
        existingRoutePreserved: true,
        searchAndMapDependenciesIdentified: true,
      },
      ambiguityPosture: "NO_KNOWN_AMBIGUITY",
      fairHousingPosture: "SAFE_CONTEXT_ONLY",
      dispositions: ["ROUTE_ENHANCEMENT_READINESS_REVIEW", "FUTURE_CERTIFICATION_CANDIDATE", "PUBLIC_ACTIVATION_BLOCKED"],
      relationships: [relationship("south-boulder-candidate-associated-route", "neighborhood:boulder:south-boulder-certification-candidate", "neighborhood:boulder:south-boulder", "ASSOCIATED_WITH")],
      blockers: ["SEPARATE_AUTHORIZATION_REQUIRED", ...DEFAULT_BLOCKERS],
      limitations: ["Future certification candidacy is not activation authority.", ...DEFAULT_LIMITATIONS],
      futureReadinessOutcome: "Potential route enhancement candidate only after separate implementation and certification authorization.",
    }),
    candidate({
      candidateId: "wave2-public-activation-blocked-guard",
      fixtureCoverage: "Public activation blocked.",
      wave2Differentiation: "Adds explicit guard that Wave 2 readiness cannot be converted into public eligibility.",
      repositorySupport: "PROTECTED_NON_ACTIVATION_GUARD",
      includedInWave: false,
      protectedGuard: true,
      canonicalObjectId: "guard:wave2-public-activation-blocked",
      objectType: "NEIGHBORHOOD",
      canonicalName: "Wave 2 Public Activation Guard",
      slug: "wave2-public-activation-blocked",
      aliases: [],
      existingPublicRoute: null,
      parentObjectIds: ["platform:reie"],
      childObjectIds: [],
      contextualObjectIds: [],
      municipalityContext: null,
      countyContext: "Colorado",
      state: "Colorado",
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
      dispositions: ["PUBLIC_ACTIVATION_BLOCKED", "DEFERRED"],
      relationships: [],
      blockers: DEFAULT_BLOCKERS,
      limitations: ["Wave 2 creates no public eligibility.", ...DEFAULT_LIMITATIONS],
      futureReadinessOutcome: "Activation remains blocked.",
    }),
    candidate({
      candidateId: "wave2-niwot-non-activation-guard",
      fixtureCoverage: "Niwot non-activation guard.",
      wave2Differentiation: "Preserves Niwot as unresolved and blocked while other inventory expands.",
      repositorySupport: "PROTECTED_NON_ACTIVATION_GUARD",
      includedInWave: false,
      protectedGuard: true,
      canonicalObjectId: "unincorporated-community:boulder-county:niwot",
      objectType: "UNINCORPORATED_COMMUNITY",
      canonicalName: "Niwot",
      slug: "niwot",
      aliases: ["Niwot CDP"],
      existingPublicRoute: null,
      parentObjectIds: ["county:boulder"],
      childObjectIds: [],
      contextualObjectIds: ["city:boulder", "city:longmont"],
      municipalityContext: null,
      countyContext: "Boulder County",
      state: "Colorado",
      authorityPosture: "UNRESOLVED",
      boundaryPosture: "UNRESOLVED",
      routeReadiness: "BLOCKED",
      registryReadiness: "PUBLIC_ACTIVATION_PROHIBITED",
      searchSupport: "UNRESOLVED",
      mapSupport: "BLOCKED",
      sourceRightsPosture: "UNKNOWN_OR_UNRESOLVED",
      attributionRequired: false,
      maturityPosture: "UNRESOLVED",
      certificationReadiness: "UNRESOLVED",
      ambiguityPosture: "OBJECT_TYPE_AMBIGUITY",
      fairHousingPosture: "SAFE_CONTEXT_ONLY",
      dispositions: ["UNRESOLVED", "DEFERRED", "PUBLIC_ACTIVATION_BLOCKED"],
      relationships: [
        relationship("niwot-county-context-wave2", "unincorporated-community:boulder-county:niwot", "county:boulder", "HAS_COUNTY_CONTEXT", {
          sourceRightsPosture: "UNKNOWN_OR_UNRESOLVED",
        }),
        relationship("niwot-market-context-boulder-longmont", "unincorporated-community:boulder-county:niwot", "market-area:boulder-longmont-context", "HAS_MARKET_CONTEXT", {
          preservesOverlap: true,
          sourceRightsPosture: "UNKNOWN_OR_UNRESOLVED",
        }),
      ],
      blockers: ["OBJECT_TYPE_UNRESOLVED", "AUTHORITY_UNRESOLVED", "BOUNDARY_UNRESOLVED", "SOURCE_RIGHTS_UNRESOLVED", ...DEFAULT_BLOCKERS],
      limitations: ["Niwot remains non-public, route-ineligible, registry-ineligible, Search-unresolved, and map-blocked.", ...DEFAULT_LIMITATIONS],
      futureReadinessOutcome: "Governance-only reconciliation requires separate authorization.",
    }),
    candidate({
      candidateId: "wave2-gunbarrel-non-activation-guard",
      fixtureCoverage: "Gunbarrel non-activation guard.",
      wave2Differentiation: "Preserves Gunbarrel ambiguity while expanding other governed inventory.",
      repositorySupport: "PROTECTED_NON_ACTIVATION_GUARD",
      includedInWave: false,
      protectedGuard: true,
      canonicalObjectId: "guard:gunbarrel-ambiguity",
      objectType: "COMMUNITY",
      canonicalName: "Gunbarrel",
      slug: "gunbarrel",
      aliases: ["Gunbarrel Boulder", "Gunbarrel community"],
      existingPublicRoute: "/market/boulder/gunbarrel",
      parentObjectIds: ["city:boulder", "county:boulder"],
      childObjectIds: [],
      contextualObjectIds: ["market-area:northeast-boulder-context"],
      municipalityContext: "Boulder",
      countyContext: "Boulder County",
      state: "Colorado",
      authorityPosture: "UNRESOLVED",
      boundaryPosture: "DISPUTED_OR_CONFLICTING_BOUNDARY",
      routeReadiness: "BLOCKED",
      registryReadiness: "CLASSIFICATION_UNRESOLVED",
      searchSupport: "AMBIGUOUS",
      mapSupport: "BLOCKED",
      sourceRightsPosture: "UNKNOWN_OR_UNRESOLVED",
      attributionRequired: false,
      maturityPosture: "UNRESOLVED",
      certificationReadiness: "UNRESOLVED",
      ambiguityPosture: "UNRESOLVED_CONFLICT",
      fairHousingPosture: "SAFE_CONTEXT_ONLY",
      dispositions: ["UNRESOLVED", "DEFERRED", "PUBLIC_ACTIVATION_BLOCKED"],
      relationships: [
        relationship("gunbarrel-overlaps-boulder-wave2", "guard:gunbarrel-ambiguity", "city:boulder", "OVERLAPS", {
          preservesOverlap: true,
          sourceRightsPosture: "UNKNOWN_OR_UNRESOLVED",
        }),
      ],
      blockers: ["OBJECT_TYPE_UNRESOLVED", "AUTHORITY_UNRESOLVED", "BOUNDARY_UNRESOLVED", "SOURCE_RIGHTS_UNRESOLVED", ...DEFAULT_BLOCKERS],
      limitations: ["Existing dynamic route behavior is preserved; Gunbarrel is not activated by Wave 2.", ...DEFAULT_LIMITATIONS],
      futureReadinessOutcome: "Gunbarrel remains blocked pending separate governance reconciliation.",
    }),
    candidate({
      candidateId: "wave2-object-type-conversion-guard",
      fixtureCoverage: "Object-type conversion guard.",
      wave2Differentiation: "Adds explicit ZIP/HOA/jurisdiction conversion protection to the expanded wave.",
      repositorySupport: "PROTECTED_NON_ACTIVATION_GUARD",
      includedInWave: false,
      protectedGuard: true,
      canonicalObjectId: "guard:zip-hoa-jurisdiction-conversion",
      objectType: "ZIP_CODE_AREA",
      canonicalName: "ZIP And HOA Conversion Guard",
      slug: "zip-hoa-conversion-guard",
      aliases: ["HOA conversion guard"],
      existingPublicRoute: null,
      parentObjectIds: ["platform:reie"],
      childObjectIds: [],
      contextualObjectIds: [],
      municipalityContext: null,
      countyContext: "Colorado",
      state: "Colorado",
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
      ambiguityPosture: "OBJECT_TYPE_AMBIGUITY",
      fairHousingPosture: "PROHIBITED_OUTPUT_GUARD",
      dispositions: ["PUBLIC_ACTIVATION_BLOCKED", "DEFERRED"],
      relationships: [],
      blockers: ["OBJECT_TYPE_UNRESOLVED", ...DEFAULT_BLOCKERS],
      limitations: ["ZIP, HOA, market area, and jurisdiction concepts must remain distinct.", ...DEFAULT_LIMITATIONS],
      futureReadinessOutcome: "Object-type conversion remains blocked.",
    }),
    candidate({
      candidateId: "wave2-prohibited-output-guard",
      fixtureCoverage: "Prohibited-output guard.",
      wave2Differentiation: "Adds explicit non-ranking and conclusion-free portfolio output protection.",
      repositorySupport: "PROTECTED_NON_ACTIVATION_GUARD",
      includedInWave: false,
      protectedGuard: true,
      canonicalObjectId: "guard:wave2-prohibited-output",
      objectType: "NEIGHBORHOOD",
      canonicalName: "Wave 2 Prohibited Output Guard",
      slug: "wave2-prohibited-output-guard",
      aliases: [],
      existingPublicRoute: null,
      parentObjectIds: ["platform:reie"],
      childObjectIds: [],
      contextualObjectIds: [],
      municipalityContext: null,
      countyContext: "Colorado",
      state: "Colorado",
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
      dispositions: ["PUBLIC_ACTIVATION_BLOCKED", "DEFERRED"],
      relationships: [],
      blockers: DEFAULT_BLOCKERS,
      limitations: ["Inspection must return posture only and no ranking, scoring, valuation, forecast, or suitability output.", ...DEFAULT_LIMITATIONS],
      futureReadinessOutcome: "Prohibited output assertions must remain passing.",
    }),
    candidate({
      candidateId: "wave2-mixed-portfolio-summary",
      fixtureCoverage: "Mixed portfolio summary.",
      wave2Differentiation: "Validates that a mixed Wave 2 portfolio can summarize readiness without ranking candidates.",
      repositorySupport: "CERTIFIED_ARCHITECTURE_FIXTURE",
      includedInWave: true,
      protectedGuard: false,
      canonicalObjectId: "summary:wave2-neighborhood-submarket-portfolio",
      objectType: "MARKET_AREA",
      canonicalName: "Wave 2 Internal Portfolio Summary",
      slug: "wave2-internal-portfolio-summary",
      aliases: [],
      existingPublicRoute: null,
      parentObjectIds: ["platform:reie"],
      childObjectIds: [],
      contextualObjectIds: ["neighborhood:boulder:south-boulder", "neighborhood:superior:rock-creek", "neighborhood:denver:washington-park"],
      municipalityContext: null,
      countyContext: "Colorado",
      state: "Colorado",
      authorityPosture: "PLATFORM_DEFINED_MARKET_AREA",
      boundaryPosture: "DESCRIPTIVE_AREA_ONLY",
      routeReadiness: "BLOCKED",
      registryReadiness: "PUBLIC_ACTIVATION_PROHIBITED",
      searchSupport: "UNSUPPORTED",
      mapSupport: "BLOCKED",
      sourceRightsPosture: "INTERNAL_ANALYSIS_ONLY",
      attributionRequired: false,
      maturityPosture: "ARCHITECTURE_FOUNDATION",
      certificationReadiness: "INTERNAL_REVIEW_READY",
      ambiguityPosture: "NO_KNOWN_AMBIGUITY",
      fairHousingPosture: "SAFE_CONTEXT_ONLY",
      dispositions: ["INTERNAL_READINESS_ONLY", "PUBLIC_ACTIVATION_BLOCKED"],
      relationships: [],
      blockers: DEFAULT_BLOCKERS,
      limitations: ["Summary reports counts and posture only.", ...DEFAULT_LIMITATIONS],
      futureReadinessOutcome: "Portfolio summary can guide future authorization without choosing an automatic activation target.",
    }),
    candidate({
      candidateId: "wave2-differentiation-guard",
      fixtureCoverage: "Explicit Wave 2 differentiation guard.",
      wave2Differentiation: "Confirms Wave 2 adds new candidates, route-readiness review, relationship types, and differentiation assertions beyond Wave 1.",
      repositorySupport: "CERTIFIED_ARCHITECTURE_FIXTURE",
      includedInWave: true,
      protectedGuard: true,
      canonicalObjectId: "guard:wave2-differentiation",
      objectType: "MARKET_AREA",
      canonicalName: "Wave 2 Differentiation Guard",
      slug: "wave2-differentiation-guard",
      aliases: [],
      existingPublicRoute: null,
      parentObjectIds: ["platform:reie"],
      childObjectIds: [],
      contextualObjectIds: [],
      municipalityContext: null,
      countyContext: "Colorado",
      state: "Colorado",
      authorityPosture: "PLATFORM_DEFINED_MARKET_AREA",
      boundaryPosture: "DESCRIPTIVE_AREA_ONLY",
      routeReadiness: "BLOCKED",
      registryReadiness: "PUBLIC_ACTIVATION_PROHIBITED",
      searchSupport: "UNSUPPORTED",
      mapSupport: "BLOCKED",
      sourceRightsPosture: "INTERNAL_ANALYSIS_ONLY",
      attributionRequired: false,
      maturityPosture: "ARCHITECTURE_FOUNDATION",
      certificationReadiness: "INTERNAL_REVIEW_READY",
      ambiguityPosture: "NO_KNOWN_AMBIGUITY",
      fairHousingPosture: "SAFE_CONTEXT_ONLY",
      dispositions: ["INTERNAL_READINESS_ONLY", "PUBLIC_ACTIVATION_BLOCKED"],
      relationships: [],
      blockers: DEFAULT_BLOCKERS,
      limitations: ["Wave 2 must not duplicate Wave 1 fixture totals or candidate mix.", ...DEFAULT_LIMITATIONS],
      futureReadinessOutcome: "Differentiation assertions must pass before local certification.",
    }),
  ]);
