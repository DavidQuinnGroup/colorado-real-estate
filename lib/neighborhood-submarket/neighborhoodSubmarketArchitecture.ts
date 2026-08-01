import {
  type EvidenceDepthConflictStatus,
  type EvidenceDepthFreshnessStatus,
  type EvidenceDepthLimitationCategory,
  type EvidenceDepthRightsStatus,
  type EvidenceDepthSupportLevel,
} from "../evidence-depth/evidencePosture.js";
import {
  type GkcKnowledgeClassification,
  type GkcSourceClass,
} from "../gkc/fixtureGovernance.js";

export const NEIGHBORHOOD_SUBMARKET_INTELLIGENCE_ARCHITECTURE =
  "NEIGHBORHOOD_SUBMARKET_INTELLIGENCE_ARCHITECTURE";
export const NEIGHBORHOOD_SUBMARKET_ARCHITECTURE_STATUS =
  "NEIGHBORHOOD_SUBMARKET_ARCHITECTURE_INTERNAL_FOUNDATION_READY";
export const NEIGHBORHOOD_SUBMARKET_ARCHITECTURE_VERSION = "1.0.0";

export type NeighborhoodSubmarketObjectType =
  | "NEIGHBORHOOD"
  | "SUBDIVISION"
  | "DISTRICT"
  | "CORRIDOR"
  | "MARKET_AREA"
  | "UNINCORPORATED_COMMUNITY"
  | "COMMUNITY"
  | "PLANNED_COMMUNITY"
  | "CENSUS_DESIGNATED_PLACE"
  | "ZIP_CODE_AREA"
  | "COUNTY"
  | "MUNICIPALITY"
  | "CITY"
  | "TOWN"
  | "HOA"
  | "METROPOLITAN_DISTRICT"
  | "SPECIAL_DISTRICT"
  | "IMPROVEMENT_DISTRICT"
  | "PROPERTY_CLUSTER"
  | "PARCEL"
  | "PROPERTY";

export type NeighborhoodSubmarketBoundaryPosture =
  | "AUTHORITATIVE_BOUNDARY"
  | "GOVERNED_DERIVED_BOUNDARY"
  | "APPROXIMATE_BOUNDARY"
  | "DESCRIPTIVE_AREA_ONLY"
  | "OVERLAPPING_BOUNDARY"
  | "DISPUTED_OR_CONFLICTING_BOUNDARY"
  | "UNAVAILABLE"
  | "UNRESOLVED"
  | "PROHIBITED_FOR_PUBLIC_USE";

export type NeighborhoodSubmarketAuthorityPosture =
  | "LEGALLY_INCORPORATED"
  | "OFFICIALLY_DESIGNATED"
  | "CENSUS_DEFINED"
  | "COUNTY_RECOGNIZED"
  | "MUNICIPAL_PLANNING_DESIGNATION"
  | "RECORDED_SUBDIVISION"
  | "LOCALLY_RECOGNIZED_NON_AUTHORITATIVE"
  | "PLATFORM_DEFINED_MARKET_AREA"
  | "UNRESOLVED"
  | "UNSUPPORTED";

export type NeighborhoodSubmarketRouteReadiness =
  | "NOT_EVALUATED"
  | "BLOCKED"
  | "ARCHITECTURE_READY"
  | "CONTENT_PREREQUISITES_INCOMPLETE"
  | "EVIDENCE_PREREQUISITES_INCOMPLETE"
  | "SOURCE_RIGHTS_PREREQUISITES_INCOMPLETE"
  | "SEARCH_SUPPORT_PREREQUISITES_INCOMPLETE"
  | "BOUNDARY_PREREQUISITES_INCOMPLETE"
  | "FAIR_HOUSING_REVIEW_REQUIRED"
  | "CERTIFICATION_READY"
  | "PUBLICLY_ELIGIBLE_ONLY_AFTER_SEPARATE_AUTHORIZATION";

export type NeighborhoodSubmarketRegistryReadiness =
  | "ABSENT"
  | "CANDIDATE"
  | "IDENTITY_GOVERNED"
  | "EVIDENCE_INCOMPLETE"
  | "AUTHORITY_UNRESOLVED"
  | "CLASSIFICATION_UNRESOLVED"
  | "SEARCH_UNSUPPORTED"
  | "ROUTE_BLOCKED"
  | "CERTIFICATION_PENDING"
  | "PUBLIC_ACTIVATION_PROHIBITED"
  | "ELIGIBLE_ONLY_AFTER_SEPARATE_AUTHORIZATION";

export type NeighborhoodSubmarketSearchSupport =
  | "UNSUPPORTED"
  | "ALIAS_ONLY"
  | "CITY_FILTER_COMPATIBLE"
  | "NEIGHBORHOOD_FILTER_COMPATIBLE"
  | "SUBDIVISION_FILTER_COMPATIBLE"
  | "GEOGRAPHIC_LOOKUP_AVAILABLE"
  | "DATA_COVERAGE_INCOMPLETE"
  | "AMBIGUOUS"
  | "BLOCKED"
  | "UNRESOLVED";

export type NeighborhoodSubmarketMaturity =
  | "IDENTITY_ONLY"
  | "ARCHITECTURE_FOUNDATION"
  | "EVIDENCE_FOUNDATION"
  | "CONTENT_FOUNDATION"
  | "ENHANCED_FOUNDATION"
  | "EDITORIALLY_CERTIFIED"
  | "BLOCKED"
  | "UNRESOLVED";

export type NeighborhoodSubmarketAmbiguity =
  | "NO_KNOWN_AMBIGUITY"
  | "NAMING_AMBIGUITY"
  | "OBJECT_TYPE_AMBIGUITY"
  | "PARENT_AMBIGUITY"
  | "JURISDICTION_AMBIGUITY"
  | "BOUNDARY_AMBIGUITY"
  | "OVERLAPPING_IDENTITY"
  | "HISTORICAL_IDENTITY"
  | "LOCALLY_RECOGNIZED_BUT_UNOFFICIAL"
  | "INSUFFICIENT_EVIDENCE"
  | "UNRESOLVED_CONFLICT";

export type NeighborhoodSubmarketRelationshipType =
  | "WITHIN"
  | "OVERLAPS"
  | "PART_OF"
  | "CONTAINS"
  | "ADJACENT_TO"
  | "ASSOCIATED_WITH"
  | "SERVED_BY"
  | "CROSSES"
  | "HAS_MARKET_CONTEXT"
  | "HAS_MUNICIPAL_CONTEXT"
  | "HAS_COUNTY_CONTEXT";

export type NeighborhoodSubmarketEvidenceRequirement =
  | "CANONICAL_IDENTITY_EVIDENCE"
  | "JURISDICTION_EVIDENCE"
  | "PARENT_CHILD_RELATIONSHIP_EVIDENCE"
  | "GEOGRAPHIC_SCOPE_OR_BOUNDARY_EVIDENCE"
  | "NAMING_AND_ALIAS_EVIDENCE"
  | "HOUSING_FORM_CONTEXT"
  | "DEVELOPMENT_PATTERN_CONTEXT"
  | "MARKET_CONTEXT_SCOPE"
  | "MUNICIPAL_AND_COUNTY_CONTEXT"
  | "SOURCE_RIGHTS_POSTURE"
  | "FRESHNESS"
  | "PROVENANCE"
  | "CONFLICT_STATUS"
  | "PROFESSIONAL_VERIFICATION_NEEDS"
  | "LIMITATIONS";

export type NeighborhoodSubmarketFairHousingSafeguard =
  | "NO_DEMOGRAPHIC_TARGETING"
  | "NO_PROTECTED_CLASS_PROXIES"
  | "NO_CODED_PREFERENCE_LANGUAGE"
  | "NO_DESIRABILITY_LABELS"
  | "NO_SUITABILITY_CONCLUSIONS"
  | "NO_BEST_NEIGHBORHOOD_CLAIMS"
  | "NO_IDEAL_FOR_CLAIMS"
  | "NO_SCHOOL_RATINGS_OR_RANKINGS"
  | "NO_SAFETY_OR_CRIME_STEERING"
  | "NO_SOCIOECONOMIC_RANKING"
  | "NO_CULTURAL_OR_DEMOGRAPHIC_PROFILING"
  | "NO_FAMILY_STATUS_STEERING"
  | "NO_INVESTMENT_RECOMMENDATIONS"
  | "NO_APPRECIATION_FORECASTS"
  | "NO_NEIGHBORHOOD_SUPERIORITY_CLAIMS";

export type NeighborhoodSubmarketPermittedContext =
  | "HOUSING_FORM"
  | "DEVELOPMENT_PATTERN"
  | "JURISDICTION"
  | "INFRASTRUCTURE"
  | "ACCESS"
  | "LAND_USE_CONTEXT"
  | "DOCUMENTED_AMENITIES"
  | "PROPERTY_SPECIFIC_DUE_DILIGENCE"
  | "MUNICIPAL_REVIEW"
  | "HOA_REVIEW"
  | "INSURANCE_REVIEW"
  | "TITLE_REVIEW"
  | "INSPECTION_REVIEW"
  | "ENVIRONMENTAL_REVIEW"
  | "STRUCTURAL_REVIEW"
  | "QUALIFIED_SOURCE_REVIEW";

export type NeighborhoodSubmarketActivationBlocker =
  | "PUBLIC_ROUTE_NOT_AUTHORIZED"
  | "PUBLIC_REGISTRY_NOT_AUTHORIZED"
  | "SEARCH_SUPPORT_NOT_AUTHORIZED"
  | "MAP_BOUNDARY_NOT_AUTHORIZED"
  | "GIS_RUNTIME_NOT_AUTHORIZED"
  | "PROVIDER_ACQUISITION_NOT_AUTHORIZED"
  | "PERSISTENCE_NOT_AUTHORIZED"
  | "SCHEMA_NOT_AUTHORIZED"
  | "OBJECT_TYPE_UNRESOLVED"
  | "AUTHORITY_UNRESOLVED"
  | "BOUNDARY_UNRESOLVED"
  | "SOURCE_RIGHTS_UNRESOLVED"
  | "FAIR_HOUSING_REVIEW_REQUIRED"
  | "PUBLIC_EVIDENCE_CONCLUSION_PROHIBITED"
  | "SEPARATE_AUTHORIZATION_REQUIRED";

export type NeighborhoodSubmarketObjectTypeDefinition = Readonly<{
  objectType: NeighborhoodSubmarketObjectType;
  meaning: string;
  permittedParentTypes: readonly NeighborhoodSubmarketObjectType[];
  permittedChildTypes: readonly NeighborhoodSubmarketObjectType[];
  futurePublicRoutePossible: boolean;
  futureOrRestricted: boolean;
  evidenceRequirements: readonly NeighborhoodSubmarketEvidenceRequirement[];
  boundaryRequirements: readonly NeighborhoodSubmarketBoundaryPosture[];
  namingRequirements: readonly string[];
  ambiguityRisks: readonly NeighborhoodSubmarketAmbiguity[];
  fairHousingRisks: readonly NeighborhoodSubmarketFairHousingSafeguard[];
  activationPrerequisites: readonly NeighborhoodSubmarketActivationBlocker[];
  failClosedBehavior: readonly NeighborhoodSubmarketActivationBlocker[];
}>;

export type NeighborhoodSubmarketCanonicalObject = Readonly<{
  objectId: string;
  objectType: NeighborhoodSubmarketObjectType;
  canonicalName: string;
  normalizedSlug: string;
  alternateNames: readonly string[];
  parentObjectIds: readonly string[];
  jurisdiction: string | null;
  counties: readonly string[];
  state: "Colorado";
  authoritySource: GkcSourceClass;
  identityStatus: "GOVERNED" | "CANDIDATE" | "UNRESOLVED" | "BLOCKED";
  boundaryStatus: NeighborhoodSubmarketBoundaryPosture;
  routePosture: NeighborhoodSubmarketRouteReadiness;
  registryPosture: NeighborhoodSubmarketRegistryReadiness;
  searchSupportPosture: NeighborhoodSubmarketSearchSupport;
  evidenceRequirements: readonly NeighborhoodSubmarketEvidenceRequirement[];
  sourceRightsPosture: EvidenceDepthRightsStatus;
  evidenceFreshness: EvidenceDepthFreshnessStatus;
  evidenceSupportLevel: EvidenceDepthSupportLevel;
  evidenceConflictStatus: EvidenceDepthConflictStatus;
  evidenceLimitations: readonly EvidenceDepthLimitationCategory[];
  gkcClassification: GkcKnowledgeClassification;
  maturityPosture: NeighborhoodSubmarketMaturity;
  ambiguityStatus: NeighborhoodSubmarketAmbiguity;
  publicEligibility: "BLOCKED" | "UNRESOLVED" | "ELIGIBLE_ONLY_AFTER_SEPARATE_AUTHORIZATION";
  limitations: readonly string[];
  publicRouteCreated: false;
  publicRegistryEntryCreated: false;
  searchBehaviorChanged: false;
  mapBoundaryChanged: false;
  publicConclusionGenerated: false;
}>;

export type NeighborhoodSubmarketRelationship = Readonly<{
  relationshipId: string;
  fromObjectId: string;
  toObjectId: string;
  relationshipType: NeighborhoodSubmarketRelationshipType;
  direction: "DIRECTED" | "SYMMETRIC";
  evidenceRequirement: NeighborhoodSubmarketEvidenceRequirement;
  sourceRightsPosture: EvidenceDepthRightsStatus;
  conflictStatus: EvidenceDepthConflictStatus;
  limitations: readonly string[];
  forcesExclusiveParent: false;
}>;

export type NeighborhoodSubmarketArchitectureFixture = Readonly<{
  fixtureId: string;
  label: string;
  objects: readonly NeighborhoodSubmarketCanonicalObject[];
  relationships: readonly NeighborhoodSubmarketRelationship[];
  expectedBlockers: readonly NeighborhoodSubmarketActivationBlocker[];
  fairHousingProbe: boolean;
  prohibitedOutputProbe: boolean;
}>;

export type NeighborhoodSubmarketObjectGraph = Readonly<{
  architecture: typeof NEIGHBORHOOD_SUBMARKET_INTELLIGENCE_ARCHITECTURE;
  status: typeof NEIGHBORHOOD_SUBMARKET_ARCHITECTURE_STATUS;
  version: typeof NEIGHBORHOOD_SUBMARKET_ARCHITECTURE_VERSION;
  objectTypes: readonly NeighborhoodSubmarketObjectTypeDefinition[];
  objects: readonly NeighborhoodSubmarketCanonicalObject[];
  relationships: readonly NeighborhoodSubmarketRelationship[];
  ambiguityStates: readonly NeighborhoodSubmarketAmbiguity[];
  routeReadinessStates: readonly NeighborhoodSubmarketRouteReadiness[];
  registryReadinessStates: readonly NeighborhoodSubmarketRegistryReadiness[];
  searchSupportStates: readonly NeighborhoodSubmarketSearchSupport[];
  blockers: readonly NeighborhoodSubmarketActivationBlocker[];
  fairHousingSafeguards: readonly NeighborhoodSubmarketFairHousingSafeguard[];
  permittedContext: readonly NeighborhoodSubmarketPermittedContext[];
  activation: Readonly<{
    publicRouteCreated: false;
    publicRouteEligibilityChanged: false;
    publicRegistryEntryCreated: false;
    publicSitemapChanged: false;
    publicCanonicalUrlChanged: false;
    publicUiChanged: false;
    publicApiCreated: false;
    searchBehaviorChanged: false;
    searchRankingChanged: false;
    mapBoundaryChanged: false;
    gisRuntimeActivated: false;
    providerCalls: 0;
    networkAcquisition: false;
    persistenceReads: false;
    persistenceWrites: false;
    schemaChanged: false;
    productionWrites: false;
    customerDataAccess: false;
    niwotActivated: false;
    gunbarrelActivated: false;
  }>;
  neighborhoodRecommendation: null;
  desirability: null;
  suitability: null;
  rank: null;
  score: null;
  investmentConclusion: null;
  valuation: null;
  forecast: null;
  safetyConclusion: null;
  schoolConclusion: null;
  demographicProfile: null;
  publicActivationDecision: null;
}>;

export type NeighborhoodSubmarketArchitectureInspection = Readonly<{
  architecture: typeof NEIGHBORHOOD_SUBMARKET_INTELLIGENCE_ARCHITECTURE;
  status: typeof NEIGHBORHOOD_SUBMARKET_ARCHITECTURE_STATUS;
  version: typeof NEIGHBORHOOD_SUBMARKET_ARCHITECTURE_VERSION;
  objectTypeCount: number;
  fixtureCount: number;
  objectCount: number;
  relationshipCount: number;
  objectTypesCovered: readonly NeighborhoodSubmarketObjectType[];
  relationshipTypesCovered: readonly NeighborhoodSubmarketRelationshipType[];
  ambiguityStatesCovered: readonly NeighborhoodSubmarketAmbiguity[];
  routeReadinessStatesCovered: readonly NeighborhoodSubmarketRouteReadiness[];
  registryReadinessStatesCovered: readonly NeighborhoodSubmarketRegistryReadiness[];
  searchSupportStatesCovered: readonly NeighborhoodSubmarketSearchSupport[];
  blockedActivationCaseCount: number;
  sourceRightsFailClosedCaseCount: number;
  fairHousingSafeguardsCovered: readonly NeighborhoodSubmarketFairHousingSafeguard[];
  gunbarrelOutcome: "DEFERRED_AND_BLOCKED";
  niwotOutcome: "DEFERRED_AND_BLOCKED";
  prohibitedOutputAssertions: Readonly<{
    recommendations: false;
    desirability: false;
    suitability: false;
    rankings: false;
    scores: false;
    valuation: false;
    forecasts: false;
    safetyConclusions: false;
    schoolConclusions: false;
    demographicProfiles: false;
    investmentAdvice: false;
    publicActivation: false;
  }>;
  graphs: readonly NeighborhoodSubmarketObjectGraph[];
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

export const NEIGHBORHOOD_SUBMARKET_FAIR_HOUSING_SAFEGUARDS: readonly NeighborhoodSubmarketFairHousingSafeguard[] = Object.freeze([
  "NO_DEMOGRAPHIC_TARGETING",
  "NO_PROTECTED_CLASS_PROXIES",
  "NO_CODED_PREFERENCE_LANGUAGE",
  "NO_DESIRABILITY_LABELS",
  "NO_SUITABILITY_CONCLUSIONS",
  "NO_BEST_NEIGHBORHOOD_CLAIMS",
  "NO_IDEAL_FOR_CLAIMS",
  "NO_SCHOOL_RATINGS_OR_RANKINGS",
  "NO_SAFETY_OR_CRIME_STEERING",
  "NO_SOCIOECONOMIC_RANKING",
  "NO_CULTURAL_OR_DEMOGRAPHIC_PROFILING",
  "NO_FAMILY_STATUS_STEERING",
  "NO_INVESTMENT_RECOMMENDATIONS",
  "NO_APPRECIATION_FORECASTS",
  "NO_NEIGHBORHOOD_SUPERIORITY_CLAIMS",
]);

export const NEIGHBORHOOD_SUBMARKET_PERMITTED_CONTEXT: readonly NeighborhoodSubmarketPermittedContext[] = Object.freeze([
  "HOUSING_FORM",
  "DEVELOPMENT_PATTERN",
  "JURISDICTION",
  "INFRASTRUCTURE",
  "ACCESS",
  "LAND_USE_CONTEXT",
  "DOCUMENTED_AMENITIES",
  "PROPERTY_SPECIFIC_DUE_DILIGENCE",
  "MUNICIPAL_REVIEW",
  "HOA_REVIEW",
  "INSURANCE_REVIEW",
  "TITLE_REVIEW",
  "INSPECTION_REVIEW",
  "ENVIRONMENTAL_REVIEW",
  "STRUCTURAL_REVIEW",
  "QUALIFIED_SOURCE_REVIEW",
]);

const DEFAULT_BLOCKERS: readonly NeighborhoodSubmarketActivationBlocker[] = Object.freeze([
  "PUBLIC_ROUTE_NOT_AUTHORIZED",
  "PUBLIC_REGISTRY_NOT_AUTHORIZED",
  "SEARCH_SUPPORT_NOT_AUTHORIZED",
  "MAP_BOUNDARY_NOT_AUTHORIZED",
  "SEPARATE_AUTHORIZATION_REQUIRED",
]);

const DEFAULT_BOUNDARY_REQUIREMENTS: readonly NeighborhoodSubmarketBoundaryPosture[] = Object.freeze([
  "DESCRIPTIVE_AREA_ONLY",
  "UNRESOLVED",
]);

const DEFAULT_AMBIGUITY_RISKS: readonly NeighborhoodSubmarketAmbiguity[] = Object.freeze([
  "NAMING_AMBIGUITY",
  "OBJECT_TYPE_AMBIGUITY",
  "BOUNDARY_AMBIGUITY",
]);

const NAMING_REQUIREMENTS: readonly string[] = Object.freeze([
  "canonical name",
  "normalized slug",
  "alternate names",
  "source-backed identity",
]);

const restrictedActivationPrerequisites: readonly NeighborhoodSubmarketActivationBlocker[] = Object.freeze([
  "PUBLIC_ROUTE_NOT_AUTHORIZED",
  "PUBLIC_REGISTRY_NOT_AUTHORIZED",
  "SEARCH_SUPPORT_NOT_AUTHORIZED",
  "MAP_BOUNDARY_NOT_AUTHORIZED",
  "GIS_RUNTIME_NOT_AUTHORIZED",
  "PROVIDER_ACQUISITION_NOT_AUTHORIZED",
  "PERSISTENCE_NOT_AUTHORIZED",
  "SCHEMA_NOT_AUTHORIZED",
  "SOURCE_RIGHTS_UNRESOLVED",
  "FAIR_HOUSING_REVIEW_REQUIRED",
  "SEPARATE_AUTHORIZATION_REQUIRED",
]);

function definition(
  objectType: NeighborhoodSubmarketObjectType,
  meaning: string,
  permittedParentTypes: readonly NeighborhoodSubmarketObjectType[],
  permittedChildTypes: readonly NeighborhoodSubmarketObjectType[],
  options: Readonly<{
    futurePublicRoutePossible: boolean;
    futureOrRestricted?: boolean;
    boundaryRequirements?: readonly NeighborhoodSubmarketBoundaryPosture[];
    ambiguityRisks?: readonly NeighborhoodSubmarketAmbiguity[];
    activationPrerequisites?: readonly NeighborhoodSubmarketActivationBlocker[];
  }>,
): NeighborhoodSubmarketObjectTypeDefinition {
  return Object.freeze({
    objectType,
    meaning,
    permittedParentTypes,
    permittedChildTypes,
    futurePublicRoutePossible: options.futurePublicRoutePossible,
    futureOrRestricted: options.futureOrRestricted ?? false,
    evidenceRequirements: ALL_EVIDENCE_REQUIREMENTS,
    boundaryRequirements: options.boundaryRequirements ?? DEFAULT_BOUNDARY_REQUIREMENTS,
    namingRequirements: NAMING_REQUIREMENTS,
    ambiguityRisks: options.ambiguityRisks ?? DEFAULT_AMBIGUITY_RISKS,
    fairHousingRisks: NEIGHBORHOOD_SUBMARKET_FAIR_HOUSING_SAFEGUARDS,
    activationPrerequisites: options.activationPrerequisites ?? DEFAULT_BLOCKERS,
    failClosedBehavior: options.activationPrerequisites ?? DEFAULT_BLOCKERS,
  });
}

export const NEIGHBORHOOD_SUBMARKET_OBJECT_TYPE_DEFINITIONS: readonly NeighborhoodSubmarketObjectTypeDefinition[] = Object.freeze([
  definition("NEIGHBORHOOD", "A locally meaningful residential area that may be editorially mediated and may not have a legal boundary.", ["MUNICIPALITY", "CITY", "TOWN", "UNINCORPORATED_COMMUNITY", "MARKET_AREA", "COUNTY"], ["SUBDIVISION", "PLANNED_COMMUNITY", "PROPERTY_CLUSTER"], { futurePublicRoutePossible: true }),
  definition("SUBDIVISION", "A recorded, MLS, builder, plat, or locally recognized subdivision construct distinct from a broad neighborhood.", ["MUNICIPALITY", "CITY", "TOWN", "UNINCORPORATED_COMMUNITY", "NEIGHBORHOOD"], ["HOA", "PROPERTY_CLUSTER"], { futurePublicRoutePossible: true, boundaryRequirements: ["AUTHORITATIVE_BOUNDARY", "GOVERNED_DERIVED_BOUNDARY", "UNRESOLVED"] }),
  definition("DISTRICT", "A named district, planning area, or place construct that must not be confused with a special district.", ["MUNICIPALITY", "CITY", "TOWN", "COUNTY"], ["NEIGHBORHOOD", "CORRIDOR"], { futurePublicRoutePossible: true, ambiguityRisks: ["OBJECT_TYPE_AMBIGUITY", "JURISDICTION_AMBIGUITY", "BOUNDARY_AMBIGUITY"] }),
  definition("CORRIDOR", "A linear access, development, or market context crossing one or more places.", ["MUNICIPALITY", "CITY", "TOWN", "COUNTY", "MARKET_AREA"], ["NEIGHBORHOOD", "DISTRICT"], { futurePublicRoutePossible: true, boundaryRequirements: ["DESCRIPTIVE_AREA_ONLY", "OVERLAPPING_BOUNDARY", "UNRESOLVED"] }),
  definition("MARKET_AREA", "A platform-defined real estate market grouping, not a legal jurisdiction.", ["MUNICIPALITY", "CITY", "TOWN", "COUNTY", "COMMUNITY"], ["NEIGHBORHOOD", "SUBDIVISION", "CORRIDOR"], { futurePublicRoutePossible: true, ambiguityRisks: ["OBJECT_TYPE_AMBIGUITY", "OVERLAPPING_IDENTITY"] }),
  definition("UNINCORPORATED_COMMUNITY", "A locally recognized or census-recognized community outside municipal incorporation.", ["COUNTY", "MARKET_AREA"], ["NEIGHBORHOOD", "SUBDIVISION", "PLANNED_COMMUNITY"], { futurePublicRoutePossible: true, ambiguityRisks: ["OBJECT_TYPE_AMBIGUITY", "JURISDICTION_AMBIGUITY", "LOCALLY_RECOGNIZED_BUT_UNOFFICIAL"] }),
  definition("COMMUNITY", "A customer-facing or enterprise community construct distinct from a legal jurisdiction.", ["MUNICIPALITY", "CITY", "TOWN", "COUNTY", "MARKET_AREA"], ["NEIGHBORHOOD", "SUBDIVISION", "PLANNED_COMMUNITY"], { futurePublicRoutePossible: true, ambiguityRisks: ["OBJECT_TYPE_AMBIGUITY", "LOCALLY_RECOGNIZED_BUT_UNOFFICIAL"] }),
  definition("PLANNED_COMMUNITY", "A master-planned, phased, or planned residential community that must not imply municipal status.", ["MUNICIPALITY", "CITY", "TOWN", "UNINCORPORATED_COMMUNITY", "SUBDIVISION"], ["SUBDIVISION", "HOA", "PROPERTY_CLUSTER"], { futurePublicRoutePossible: true, boundaryRequirements: ["AUTHORITATIVE_BOUNDARY", "GOVERNED_DERIVED_BOUNDARY", "DESCRIPTIVE_AREA_ONLY", "UNRESOLVED"] }),
  definition("CENSUS_DESIGNATED_PLACE", "A census-defined place that may not be incorporated and may not match local market identity.", ["COUNTY", "MARKET_AREA"], ["NEIGHBORHOOD", "SUBDIVISION"], { futurePublicRoutePossible: true, ambiguityRisks: ["OBJECT_TYPE_AMBIGUITY", "JURISDICTION_AMBIGUITY"] }),
  definition("ZIP_CODE_AREA", "A postal delivery geography that must not be treated as a community or legal boundary.", ["MUNICIPALITY", "CITY", "TOWN", "COUNTY", "MARKET_AREA"], [], { futurePublicRoutePossible: false, boundaryRequirements: ["APPROXIMATE_BOUNDARY", "UNAVAILABLE", "UNRESOLVED"], activationPrerequisites: restrictedActivationPrerequisites }),
  definition("COUNTY", "A county administrative context used internally for containment and authority review.", [], ["MUNICIPALITY", "UNINCORPORATED_COMMUNITY", "CENSUS_DESIGNATED_PLACE", "MARKET_AREA", "CORRIDOR"], { futurePublicRoutePossible: false, futureOrRestricted: true, boundaryRequirements: ["AUTHORITATIVE_BOUNDARY", "GOVERNED_DERIVED_BOUNDARY"], activationPrerequisites: restrictedActivationPrerequisites }),
  definition("MUNICIPALITY", "An incorporated municipal government unit.", ["COUNTY"], ["CITY", "TOWN", "NEIGHBORHOOD", "SUBDIVISION", "DISTRICT", "CORRIDOR"], { futurePublicRoutePossible: true, boundaryRequirements: ["AUTHORITATIVE_BOUNDARY", "GOVERNED_DERIVED_BOUNDARY"] }),
  definition("CITY", "A municipal label commonly used for an incorporated city; it does not itself resolve enterprise identity.", ["MUNICIPALITY", "COUNTY"], ["NEIGHBORHOOD", "SUBDIVISION", "DISTRICT"], { futurePublicRoutePossible: true }),
  definition("TOWN", "A municipal label commonly used for an incorporated town; it does not itself resolve enterprise identity.", ["MUNICIPALITY", "COUNTY"], ["NEIGHBORHOOD", "SUBDIVISION", "DISTRICT"], { futurePublicRoutePossible: true }),
  definition("HOA", "A homeowners association or covenant-governed entity requiring high-trust review.", ["SUBDIVISION", "PLANNED_COMMUNITY", "NEIGHBORHOOD"], ["PROPERTY_CLUSTER"], { futurePublicRoutePossible: false, futureOrRestricted: true, activationPrerequisites: restrictedActivationPrerequisites }),
  definition("METROPOLITAN_DISTRICT", "A quasi-governmental district that must not be treated as a neighborhood.", ["COUNTY", "MUNICIPALITY"], [], { futurePublicRoutePossible: false, futureOrRestricted: true, activationPrerequisites: restrictedActivationPrerequisites }),
  definition("SPECIAL_DISTRICT", "A special-purpose governmental district with limited authority.", ["COUNTY", "MUNICIPALITY"], [], { futurePublicRoutePossible: false, futureOrRestricted: true, activationPrerequisites: restrictedActivationPrerequisites }),
  definition("IMPROVEMENT_DISTRICT", "A local improvement or funding district with defined scope.", ["MUNICIPALITY", "COUNTY"], [], { futurePublicRoutePossible: false, futureOrRestricted: true, activationPrerequisites: restrictedActivationPrerequisites }),
  definition("PROPERTY_CLUSTER", "An internal grouping of properties that is not a public market or neighborhood conclusion.", ["NEIGHBORHOOD", "SUBDIVISION", "PLANNED_COMMUNITY"], ["PROPERTY"], { futurePublicRoutePossible: false, futureOrRestricted: true, activationPrerequisites: restrictedActivationPrerequisites }),
  definition("PARCEL", "A parcel or assessor geography requiring public-record and legal-boundary review.", ["MUNICIPALITY", "COUNTY"], ["PROPERTY"], { futurePublicRoutePossible: false, futureOrRestricted: true, activationPrerequisites: restrictedActivationPrerequisites }),
  definition("PROPERTY", "An individual property context and current runtime anchor, not a public neighborhood object.", ["PARCEL", "SUBDIVISION", "NEIGHBORHOOD"], [], { futurePublicRoutePossible: false, futureOrRestricted: true, activationPrerequisites: restrictedActivationPrerequisites }),
]);

export function buildNeighborhoodSubmarketObjectGraph(
  fixture: NeighborhoodSubmarketArchitectureFixture,
): NeighborhoodSubmarketObjectGraph {
  const blockers = new Set<NeighborhoodSubmarketActivationBlocker>(fixture.expectedBlockers);
  for (const object of fixture.objects) {
    if (object.routePosture === "BLOCKED") blockers.add("PUBLIC_ROUTE_NOT_AUTHORIZED");
    if (object.registryPosture === "PUBLIC_ACTIVATION_PROHIBITED" || object.registryPosture === "ROUTE_BLOCKED") blockers.add("PUBLIC_REGISTRY_NOT_AUTHORIZED");
    if (object.searchSupportPosture === "UNSUPPORTED" || object.searchSupportPosture === "AMBIGUOUS" || object.searchSupportPosture === "BLOCKED" || object.searchSupportPosture === "UNRESOLVED") blockers.add("SEARCH_SUPPORT_NOT_AUTHORIZED");
    if (object.boundaryStatus === "UNRESOLVED" || object.boundaryStatus === "DISPUTED_OR_CONFLICTING_BOUNDARY" || object.boundaryStatus === "PROHIBITED_FOR_PUBLIC_USE") blockers.add("BOUNDARY_UNRESOLVED");
    if (object.sourceRightsPosture === "UNKNOWN_OR_UNRESOLVED" || object.sourceRightsPosture === "RESTRICTED" || object.sourceRightsPosture === "PROHIBITED") blockers.add("SOURCE_RIGHTS_UNRESOLVED");
    if (object.ambiguityStatus !== "NO_KNOWN_AMBIGUITY") blockers.add("OBJECT_TYPE_UNRESOLVED");
    if (object.authoritySource !== "AUTHORITATIVE_GOVERNMENT") blockers.add("AUTHORITY_UNRESOLVED");
    blockers.add("SEPARATE_AUTHORIZATION_REQUIRED");
  }

  return Object.freeze({
    architecture: NEIGHBORHOOD_SUBMARKET_INTELLIGENCE_ARCHITECTURE,
    status: NEIGHBORHOOD_SUBMARKET_ARCHITECTURE_STATUS,
    version: NEIGHBORHOOD_SUBMARKET_ARCHITECTURE_VERSION,
    objectTypes: NEIGHBORHOOD_SUBMARKET_OBJECT_TYPE_DEFINITIONS,
    objects: fixture.objects,
    relationships: fixture.relationships,
    ambiguityStates: unique(fixture.objects.map((object) => object.ambiguityStatus)),
    routeReadinessStates: unique(fixture.objects.map((object) => object.routePosture)),
    registryReadinessStates: unique(fixture.objects.map((object) => object.registryPosture)),
    searchSupportStates: unique(fixture.objects.map((object) => object.searchSupportPosture)),
    blockers: Array.from(blockers).sort(),
    fairHousingSafeguards: NEIGHBORHOOD_SUBMARKET_FAIR_HOUSING_SAFEGUARDS,
    permittedContext: NEIGHBORHOOD_SUBMARKET_PERMITTED_CONTEXT,
    activation: {
      publicRouteCreated: false,
      publicRouteEligibilityChanged: false,
      publicRegistryEntryCreated: false,
      publicSitemapChanged: false,
      publicCanonicalUrlChanged: false,
      publicUiChanged: false,
      publicApiCreated: false,
      searchBehaviorChanged: false,
      searchRankingChanged: false,
      mapBoundaryChanged: false,
      gisRuntimeActivated: false,
      providerCalls: 0,
      networkAcquisition: false,
      persistenceReads: false,
      persistenceWrites: false,
      schemaChanged: false,
      productionWrites: false,
      customerDataAccess: false,
      niwotActivated: false,
      gunbarrelActivated: false,
    } as const,
    neighborhoodRecommendation: null,
    desirability: null,
    suitability: null,
    rank: null,
    score: null,
    investmentConclusion: null,
    valuation: null,
    forecast: null,
    safetyConclusion: null,
    schoolConclusion: null,
    demographicProfile: null,
    publicActivationDecision: null,
  });
}

export function inspectNeighborhoodSubmarketArchitecture(
  fixtures: readonly NeighborhoodSubmarketArchitectureFixture[],
): NeighborhoodSubmarketArchitectureInspection {
  const graphs = fixtures.map(buildNeighborhoodSubmarketObjectGraph);
  const objects = graphs.flatMap((graph) => graph.objects);
  const relationships = graphs.flatMap((graph) => graph.relationships);
  const blockedObjects = objects.filter((object) => object.publicEligibility !== "ELIGIBLE_ONLY_AFTER_SEPARATE_AUTHORIZATION");
  const failClosedObjects = objects.filter((object) =>
    object.sourceRightsPosture === "UNKNOWN_OR_UNRESOLVED" ||
    object.sourceRightsPosture === "RESTRICTED" ||
    object.sourceRightsPosture === "PROHIBITED" ||
    object.sourceRightsPosture === "INTERNAL_ANALYSIS_ONLY",
  );

  return Object.freeze({
    architecture: NEIGHBORHOOD_SUBMARKET_INTELLIGENCE_ARCHITECTURE,
    status: NEIGHBORHOOD_SUBMARKET_ARCHITECTURE_STATUS,
    version: NEIGHBORHOOD_SUBMARKET_ARCHITECTURE_VERSION,
    objectTypeCount: NEIGHBORHOOD_SUBMARKET_OBJECT_TYPE_DEFINITIONS.length,
    fixtureCount: fixtures.length,
    objectCount: objects.length,
    relationshipCount: relationships.length,
    objectTypesCovered: unique(objects.map((object) => object.objectType)),
    relationshipTypesCovered: unique(relationships.map((relationship) => relationship.relationshipType)),
    ambiguityStatesCovered: unique(objects.map((object) => object.ambiguityStatus)),
    routeReadinessStatesCovered: unique(objects.map((object) => object.routePosture)),
    registryReadinessStatesCovered: unique(objects.map((object) => object.registryPosture)),
    searchSupportStatesCovered: unique(objects.map((object) => object.searchSupportPosture)),
    blockedActivationCaseCount: blockedObjects.length,
    sourceRightsFailClosedCaseCount: failClosedObjects.length,
    fairHousingSafeguardsCovered: NEIGHBORHOOD_SUBMARKET_FAIR_HOUSING_SAFEGUARDS,
    gunbarrelOutcome: "DEFERRED_AND_BLOCKED",
    niwotOutcome: "DEFERRED_AND_BLOCKED",
    prohibitedOutputAssertions: {
      recommendations: false,
      desirability: false,
      suitability: false,
      rankings: false,
      scores: false,
      valuation: false,
      forecasts: false,
      safetyConclusions: false,
      schoolConclusions: false,
      demographicProfiles: false,
      investmentAdvice: false,
      publicActivation: false,
    } as const,
    graphs,
  });
}

function unique<T extends string>(values: readonly T[]): readonly T[] {
  return Array.from(new Set(values)).sort();
}
