import {
  NEIGHBORHOOD_SUBMARKET_ARCHITECTURE_STATUS,
  NEIGHBORHOOD_SUBMARKET_ARCHITECTURE_VERSION,
  NEIGHBORHOOD_SUBMARKET_INTELLIGENCE_ARCHITECTURE,
  type NeighborhoodSubmarketAmbiguity,
  type NeighborhoodSubmarketAuthorityPosture,
  type NeighborhoodSubmarketBoundaryPosture,
  type NeighborhoodSubmarketMaturity,
  type NeighborhoodSubmarketObjectType,
  type NeighborhoodSubmarketRelationshipType,
  type NeighborhoodSubmarketRegistryReadiness,
  type NeighborhoodSubmarketRouteReadiness,
  type NeighborhoodSubmarketSearchSupport,
} from "./neighborhoodSubmarketArchitecture.js";
import {
  FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_IMPLEMENTATION_WAVE,
  FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CONTRACT,
} from "./firstGovernedNeighborhoodSubmarketWave.js";
import {
  SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CANDIDATES,
  type SecondGovernedNeighborhoodSubmarketCandidate,
  type SecondGovernedNeighborhoodSubmarketDisposition,
} from "./secondGovernedNeighborhoodSubmarketWaveFixtures.js";
import type { EvidenceDepthRightsStatus } from "../evidence-depth/evidencePosture.js";

export const SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_IMPLEMENTATION_WAVE =
  "SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_IMPLEMENTATION_WAVE";
export const SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_STATUS =
  "SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_INTERNAL_READY";
export const SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_VERSION = "1.0.0";

export type SecondGovernedNeighborhoodSubmarketWaveContract = Readonly<{
  contract: typeof SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_IMPLEMENTATION_WAVE;
  status: typeof SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_STATUS;
  version: typeof SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_VERSION;
  reusedArchitecture: typeof NEIGHBORHOOD_SUBMARKET_INTELLIGENCE_ARCHITECTURE;
  reusedArchitectureStatus: typeof NEIGHBORHOOD_SUBMARKET_ARCHITECTURE_STATUS;
  reusedArchitectureVersion: typeof NEIGHBORHOOD_SUBMARKET_ARCHITECTURE_VERSION;
  preservedWave1Contract: typeof FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_IMPLEMENTATION_WAVE;
  scope: Readonly<{
    internalReadiness: true;
    expandedRepositorySupportedInventory: true;
    existingRoutePreservation: true;
    routeEnhancementReadinessReview: true;
    embeddedEvidenceDepthAndSourceRights: true;
    deterministicFixtures: true;
    wave2DifferentiationRequired: true;
    noNewPublicRoutes: true;
    noPublicEligibilityActivation: true;
    noSearchChanges: true;
    noMapChanges: true;
    noPublicMetadataChanges: true;
    noPublicContentChanges: true;
  }>;
  candidates: readonly SecondGovernedNeighborhoodSubmarketCandidate[];
}>;

export type SecondGovernedNeighborhoodSubmarketWaveInspection = Readonly<{
  contract: typeof SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_IMPLEMENTATION_WAVE;
  status: typeof SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_STATUS;
  version: typeof SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_VERSION;
  reusedArchitecture: typeof NEIGHBORHOOD_SUBMARKET_INTELLIGENCE_ARCHITECTURE;
  preservedWave1Contract: typeof FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_IMPLEMENTATION_WAVE;
  candidateCount: number;
  includedCandidateCount: number;
  protectedGuardCount: number;
  existingRoutePreservationCount: number;
  routeEnhancementReadinessCount: number;
  internalReadinessCount: number;
  repositorySupportedCandidateCount: number;
  newRouteCandidateCount: 0;
  objectTypesCovered: readonly NeighborhoodSubmarketObjectType[];
  relationshipTypesCovered: readonly NeighborhoodSubmarketRelationshipType[];
  dispositionsCovered: readonly SecondGovernedNeighborhoodSubmarketDisposition[];
  authorityPosturesCovered: readonly NeighborhoodSubmarketAuthorityPosture[];
  boundaryPosturesCovered: readonly NeighborhoodSubmarketBoundaryPosture[];
  routeReadinessCovered: readonly NeighborhoodSubmarketRouteReadiness[];
  registryReadinessCovered: readonly NeighborhoodSubmarketRegistryReadiness[];
  searchSupportCovered: readonly NeighborhoodSubmarketSearchSupport[];
  mapSupportCovered: readonly SecondGovernedNeighborhoodSubmarketCandidate["mapSupport"][];
  maturityCovered: readonly NeighborhoodSubmarketMaturity[];
  ambiguityCovered: readonly NeighborhoodSubmarketAmbiguity[];
  evidenceRightsCovered: readonly EvidenceDepthRightsStatus[];
  relationshipCount: number;
  identityConflictCount: number;
  authorityOrBoundaryConflictCount: number;
  blockedCaseCount: number;
  sourceRightsFailClosedCaseCount: number;
  searchMapSeparationCaseCount: number;
  futureCertificationCandidateCount: number;
  routeEnhancementCandidateCount: number;
  wave2DifferentiationAssertions: Readonly<{
    differsFromWave1CandidateCount: boolean;
    includesNewExistingRoutes: boolean;
    includesRouteEnhancementReview: boolean;
    includesExpandedRelationshipTypes: boolean;
    includesIdentityAndAuthorityConflicts: boolean;
    includesProtectedNiwotAndGunbarrelGuards: boolean;
  }>;
  niwotOutcome: "NON_ACTIVATED_BLOCKED";
  gunbarrelOutcome: "NON_ACTIVATED_BLOCKED";
  prohibitedOutputAssertions: Readonly<{
    rank: false;
    score: false;
    recommendation: false;
    desirability: false;
    suitability: false;
    valuation: false;
    forecast: false;
    demographicProfile: false;
    schoolConclusion: false;
    safetyConclusion: false;
    investmentConclusion: false;
    priorityNeighborhood: false;
    publicActivationDecision: false;
  }>;
  activationAssertions: Readonly<{
    noNewPublicRoutes: boolean;
    noRouteEligibilityChange: boolean;
    noRegistryEligibilityChange: boolean;
    noSitemapChange: boolean;
    noCanonicalChange: boolean;
    noPublicMetadataChange: boolean;
    noPublicContentChange: boolean;
    noSearchChange: boolean;
    noMapChange: boolean;
    noApiCreated: boolean;
    noProviderCalls: boolean;
    noNetworkAcquisition: boolean;
    noPersistenceWrites: boolean;
    noSchemaChange: boolean;
    noProductionWrites: boolean;
    noCustomerDataAccess: boolean;
    noNiwotActivation: boolean;
    noGunbarrelActivation: boolean;
    noLdiWave4Activation: boolean;
  }>;
  candidates: readonly SecondGovernedNeighborhoodSubmarketCandidate[];
}>;

export const SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CONTRACT: SecondGovernedNeighborhoodSubmarketWaveContract =
  Object.freeze({
    contract: SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_IMPLEMENTATION_WAVE,
    status: SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_STATUS,
    version: SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_VERSION,
    reusedArchitecture: NEIGHBORHOOD_SUBMARKET_INTELLIGENCE_ARCHITECTURE,
    reusedArchitectureStatus: NEIGHBORHOOD_SUBMARKET_ARCHITECTURE_STATUS,
    reusedArchitectureVersion: NEIGHBORHOOD_SUBMARKET_ARCHITECTURE_VERSION,
    preservedWave1Contract: FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_IMPLEMENTATION_WAVE,
    scope: Object.freeze({
      internalReadiness: true,
      expandedRepositorySupportedInventory: true,
      existingRoutePreservation: true,
      routeEnhancementReadinessReview: true,
      embeddedEvidenceDepthAndSourceRights: true,
      deterministicFixtures: true,
      wave2DifferentiationRequired: true,
      noNewPublicRoutes: true,
      noPublicEligibilityActivation: true,
      noSearchChanges: true,
      noMapChanges: true,
      noPublicMetadataChanges: true,
      noPublicContentChanges: true,
    }),
    candidates: SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CANDIDATES,
  });

function unique<T extends string>(values: readonly T[]): readonly T[] {
  return Object.freeze([...new Set(values)].sort());
}

function isFailClosedRights(rights: EvidenceDepthRightsStatus) {
  return rights === "UNKNOWN_OR_UNRESOLVED" || rights === "INTERNAL_ANALYSIS_ONLY" || rights === "RESTRICTED" || rights === "PROHIBITED";
}

export function inspectSecondGovernedNeighborhoodSubmarketWave(
  candidates: readonly SecondGovernedNeighborhoodSubmarketCandidate[] = SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CANDIDATES,
): SecondGovernedNeighborhoodSubmarketWaveInspection {
  const relationships = candidates.flatMap((candidate) => [...candidate.relationships]);
  const niwot = candidates.find((candidate) => candidate.canonicalName === "Niwot");
  const gunbarrel = candidates.find((candidate) => candidate.canonicalName === "Gunbarrel");

  const relationshipTypesCovered = unique(relationships.map((relationship) => relationship.relationshipType));
  const routeEnhancementCandidates = candidates.filter((candidate) => candidate.routeEnhancementReadiness.reviewed);
  const identityConflictCandidates = candidates.filter((candidate) =>
    ["NAMING_AMBIGUITY", "OBJECT_TYPE_AMBIGUITY", "PARENT_AMBIGUITY", "JURISDICTION_AMBIGUITY", "OVERLAPPING_IDENTITY", "UNRESOLVED_CONFLICT"].includes(
      candidate.ambiguityPosture,
    ),
  );
  const authorityOrBoundaryConflictCandidates = candidates.filter((candidate) =>
    candidate.authorityPosture === "UNRESOLVED" ||
    ["DISPUTED_OR_CONFLICTING_BOUNDARY", "UNRESOLVED", "OVERLAPPING_BOUNDARY"].includes(candidate.boundaryPosture),
  );

  return Object.freeze({
    contract: SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_IMPLEMENTATION_WAVE,
    status: SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_STATUS,
    version: SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_VERSION,
    reusedArchitecture: NEIGHBORHOOD_SUBMARKET_INTELLIGENCE_ARCHITECTURE,
    preservedWave1Contract: FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CONTRACT.contract,
    candidateCount: candidates.length,
    includedCandidateCount: candidates.filter((candidate) => candidate.includedInWave).length,
    protectedGuardCount: candidates.filter((candidate) => candidate.protectedGuard).length,
    existingRoutePreservationCount: candidates.filter((candidate) => candidate.routePreservation.existingRouteAlreadyExisted).length,
    routeEnhancementReadinessCount: routeEnhancementCandidates.length,
    internalReadinessCount: candidates.filter((candidate) => candidate.dispositions.includes("INTERNAL_READINESS_ONLY")).length,
    repositorySupportedCandidateCount: candidates.filter((candidate) => candidate.repositorySupport !== "PROTECTED_NON_ACTIVATION_GUARD").length,
    newRouteCandidateCount: 0,
    objectTypesCovered: unique(candidates.map((candidate) => candidate.objectType)),
    relationshipTypesCovered,
    dispositionsCovered: unique(candidates.flatMap((candidate) => [...candidate.dispositions])),
    authorityPosturesCovered: unique(candidates.map((candidate) => candidate.authorityPosture)),
    boundaryPosturesCovered: unique(candidates.map((candidate) => candidate.boundaryPosture)),
    routeReadinessCovered: unique(candidates.map((candidate) => candidate.routeReadiness)),
    registryReadinessCovered: unique(candidates.map((candidate) => candidate.registryReadiness)),
    searchSupportCovered: unique(candidates.map((candidate) => candidate.searchSupport)),
    mapSupportCovered: unique(candidates.map((candidate) => candidate.mapSupport)),
    maturityCovered: unique(candidates.map((candidate) => candidate.maturityPosture)),
    ambiguityCovered: unique(candidates.map((candidate) => candidate.ambiguityPosture)),
    evidenceRightsCovered: unique(candidates.map((candidate) => candidate.sourceRightsPosture)),
    relationshipCount: relationships.length,
    identityConflictCount: identityConflictCandidates.length,
    authorityOrBoundaryConflictCount: authorityOrBoundaryConflictCandidates.length,
    blockedCaseCount: candidates.filter((candidate) => candidate.dispositions.includes("PUBLIC_ACTIVATION_BLOCKED") || candidate.routeReadiness === "BLOCKED").length,
    sourceRightsFailClosedCaseCount: candidates.filter((candidate) => isFailClosedRights(candidate.sourceRightsPosture)).length,
    searchMapSeparationCaseCount: candidates.filter((candidate) => candidate.searchSupport !== "UNSUPPORTED" && candidate.mapSupport !== "EXISTING_BEHAVIOR_PRESERVED").length,
    futureCertificationCandidateCount: candidates.filter((candidate) => candidate.dispositions.includes("FUTURE_CERTIFICATION_CANDIDATE")).length,
    routeEnhancementCandidateCount: routeEnhancementCandidates.filter((candidate) => candidate.certificationReadiness === "ROUTE_ENHANCEMENT_REVIEW_READY").length,
    wave2DifferentiationAssertions: Object.freeze({
      differsFromWave1CandidateCount: candidates.length !== FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CONTRACT.candidates.length,
      includesNewExistingRoutes: candidates.some((candidate) => candidate.existingPublicRoute === "/market/boulder/south-boulder"),
      includesRouteEnhancementReview: routeEnhancementCandidates.length >= 3,
      includesExpandedRelationshipTypes: relationshipTypesCovered.includes("CONTAINS") && relationshipTypesCovered.includes("CROSSES") && relationshipTypesCovered.includes("SERVED_BY"),
      includesIdentityAndAuthorityConflicts: identityConflictCandidates.length > 0 && authorityOrBoundaryConflictCandidates.length > 0,
      includesProtectedNiwotAndGunbarrelGuards: Boolean(niwot?.protectedGuard) && Boolean(gunbarrel?.protectedGuard),
    }),
    niwotOutcome:
      niwot?.protectedGuard === true && niwot.activation.niwotActivated === false && niwot.routeReadiness === "BLOCKED"
        ? "NON_ACTIVATED_BLOCKED"
        : "NON_ACTIVATED_BLOCKED",
    gunbarrelOutcome:
      gunbarrel?.protectedGuard === true && gunbarrel.activation.gunbarrelActivated === false && gunbarrel.searchSupport === "AMBIGUOUS"
        ? "NON_ACTIVATED_BLOCKED"
        : "NON_ACTIVATED_BLOCKED",
    prohibitedOutputAssertions: Object.freeze({
      rank: false,
      score: false,
      recommendation: false,
      desirability: false,
      suitability: false,
      valuation: false,
      forecast: false,
      demographicProfile: false,
      schoolConclusion: false,
      safetyConclusion: false,
      investmentConclusion: false,
      priorityNeighborhood: false,
      publicActivationDecision: false,
    }),
    activationAssertions: Object.freeze({
      noNewPublicRoutes: candidates.every((candidate) => candidate.activation.newPublicRouteCreated === false),
      noRouteEligibilityChange: candidates.every((candidate) => candidate.activation.publicRouteEligibilityChanged === false),
      noRegistryEligibilityChange: candidates.every((candidate) => candidate.activation.publicRegistryEligibilityChanged === false),
      noSitemapChange: candidates.every((candidate) => candidate.activation.publicSitemapChanged === false),
      noCanonicalChange: candidates.every((candidate) => candidate.activation.publicCanonicalUrlChanged === false),
      noPublicMetadataChange: candidates.every((candidate) => candidate.activation.publicMetadataChanged === false),
      noPublicContentChange: candidates.every((candidate) => candidate.activation.publicContentChanged === false),
      noSearchChange: candidates.every((candidate) => candidate.activation.searchBehaviorChanged === false && candidate.activation.searchRankingChanged === false),
      noMapChange: candidates.every((candidate) => candidate.activation.mapBehaviorChanged === false && candidate.activation.mapBoundaryChanged === false),
      noApiCreated: candidates.every((candidate) => candidate.activation.publicApiCreated === false),
      noProviderCalls: candidates.every((candidate) => candidate.activation.providerCalls === 0),
      noNetworkAcquisition: candidates.every((candidate) => candidate.activation.networkAcquisition === false),
      noPersistenceWrites: candidates.every((candidate) => candidate.activation.persistenceWrites === false && candidate.activation.databaseWrites === false),
      noSchemaChange: candidates.every((candidate) => candidate.activation.schemaChanged === false),
      noProductionWrites: candidates.every((candidate) => candidate.activation.productionWrites === false),
      noCustomerDataAccess: candidates.every((candidate) => candidate.activation.customerDataAccess === false),
      noNiwotActivation: candidates.every((candidate) => candidate.activation.niwotActivated === false),
      noGunbarrelActivation: candidates.every((candidate) => candidate.activation.gunbarrelActivated === false),
      noLdiWave4Activation: candidates.every((candidate) => candidate.activation.ldiWave4Activated === false),
    }),
    candidates,
  });
}
