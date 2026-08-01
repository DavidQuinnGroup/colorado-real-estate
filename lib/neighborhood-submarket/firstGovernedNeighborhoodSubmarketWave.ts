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
  FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CANDIDATES,
  type FirstGovernedNeighborhoodSubmarketCandidate,
  type FirstGovernedNeighborhoodSubmarketDisposition,
} from "./firstGovernedNeighborhoodSubmarketWaveFixtures.js";
import type { EvidenceDepthRightsStatus } from "../evidence-depth/evidencePosture.js";

export const FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_IMPLEMENTATION_WAVE =
  "FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_IMPLEMENTATION_WAVE";
export const FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_STATUS =
  "FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_INTERNAL_READY";
export const FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_VERSION = "1.0.0";

export type FirstGovernedNeighborhoodSubmarketWaveContract = Readonly<{
  contract: typeof FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_IMPLEMENTATION_WAVE;
  status: typeof FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_STATUS;
  version: typeof FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_VERSION;
  reusedArchitecture: typeof NEIGHBORHOOD_SUBMARKET_INTELLIGENCE_ARCHITECTURE;
  reusedArchitectureStatus: typeof NEIGHBORHOOD_SUBMARKET_ARCHITECTURE_STATUS;
  reusedArchitectureVersion: typeof NEIGHBORHOOD_SUBMARKET_ARCHITECTURE_VERSION;
  scope: Readonly<{
    internalReadiness: true;
    existingRoutePreservation: true;
    embeddedEvidenceDepthAndSourceRights: true;
    deterministicFixtures: true;
    noNewPublicRoutes: true;
    noPublicEligibilityActivation: true;
    noSearchChanges: true;
    noMapChanges: true;
  }>;
  candidates: readonly FirstGovernedNeighborhoodSubmarketCandidate[];
}>;

export type FirstGovernedNeighborhoodSubmarketWaveInspection = Readonly<{
  contract: typeof FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_IMPLEMENTATION_WAVE;
  status: typeof FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_STATUS;
  version: typeof FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_VERSION;
  reusedArchitecture: typeof NEIGHBORHOOD_SUBMARKET_INTELLIGENCE_ARCHITECTURE;
  candidateCount: number;
  includedCandidateCount: number;
  protectedGuardCount: number;
  existingRoutePreservationCount: number;
  internalReadinessCount: number;
  objectTypesCovered: readonly NeighborhoodSubmarketObjectType[];
  relationshipTypesCovered: readonly NeighborhoodSubmarketRelationshipType[];
  dispositionsCovered: readonly FirstGovernedNeighborhoodSubmarketDisposition[];
  authorityPosturesCovered: readonly NeighborhoodSubmarketAuthorityPosture[];
  boundaryPosturesCovered: readonly NeighborhoodSubmarketBoundaryPosture[];
  routeReadinessCovered: readonly NeighborhoodSubmarketRouteReadiness[];
  registryReadinessCovered: readonly NeighborhoodSubmarketRegistryReadiness[];
  searchSupportCovered: readonly NeighborhoodSubmarketSearchSupport[];
  mapSupportCovered: readonly FirstGovernedNeighborhoodSubmarketCandidate["mapSupport"][];
  maturityCovered: readonly NeighborhoodSubmarketMaturity[];
  ambiguityCovered: readonly NeighborhoodSubmarketAmbiguity[];
  evidenceRightsCovered: readonly EvidenceDepthRightsStatus[];
  relationshipCount: number;
  blockedCaseCount: number;
  sourceRightsFailClosedCaseCount: number;
  boundaryLimitationCaseCount: number;
  searchUnsupportedOrBlockedCount: number;
  mapUnsupportedOrBlockedCount: number;
  ambiguityCaseCount: number;
  futureCertificationCandidateCount: number;
  deferredCandidateCount: number;
  gunbarrelOutcome: "DEFERRED_AND_BLOCKED";
  niwotOutcome: "DEFERRED_AND_BLOCKED";
  prohibitedConversionGuard: "PASS";
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
    publicActivationDecision: false;
  }>;
  activationAssertions: Readonly<{
    noNewPublicRoutes: boolean;
    noRouteEligibilityChange: boolean;
    noRegistryEligibilityChange: boolean;
    noSitemapChange: boolean;
    noCanonicalChange: boolean;
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
  candidates: readonly FirstGovernedNeighborhoodSubmarketCandidate[];
}>;

export const FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CONTRACT: FirstGovernedNeighborhoodSubmarketWaveContract =
  Object.freeze({
    contract: FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_IMPLEMENTATION_WAVE,
    status: FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_STATUS,
    version: FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_VERSION,
    reusedArchitecture: NEIGHBORHOOD_SUBMARKET_INTELLIGENCE_ARCHITECTURE,
    reusedArchitectureStatus: NEIGHBORHOOD_SUBMARKET_ARCHITECTURE_STATUS,
    reusedArchitectureVersion: NEIGHBORHOOD_SUBMARKET_ARCHITECTURE_VERSION,
    scope: Object.freeze({
      internalReadiness: true,
      existingRoutePreservation: true,
      embeddedEvidenceDepthAndSourceRights: true,
      deterministicFixtures: true,
      noNewPublicRoutes: true,
      noPublicEligibilityActivation: true,
      noSearchChanges: true,
      noMapChanges: true,
    }),
    candidates: FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CANDIDATES,
  });

function unique<T extends string>(values: readonly T[]): readonly T[] {
  return Object.freeze([...new Set(values)].sort());
}

function isFailClosedRights(rights: EvidenceDepthRightsStatus) {
  return rights === "UNKNOWN_OR_UNRESOLVED" || rights === "INTERNAL_ANALYSIS_ONLY" || rights === "RESTRICTED" || rights === "PROHIBITED";
}

export function inspectFirstGovernedNeighborhoodSubmarketWave(
  candidates: readonly FirstGovernedNeighborhoodSubmarketCandidate[] = FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CANDIDATES,
): FirstGovernedNeighborhoodSubmarketWaveInspection {
  const relationships = candidates.flatMap((candidate) => [...candidate.relationships]);
  const gunbarrel = candidates.find((candidate) => candidate.canonicalName === "Gunbarrel");
  const niwot = candidates.find((candidate) => candidate.canonicalName === "Niwot");

  return Object.freeze({
    contract: FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_IMPLEMENTATION_WAVE,
    status: FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_STATUS,
    version: FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_VERSION,
    reusedArchitecture: NEIGHBORHOOD_SUBMARKET_INTELLIGENCE_ARCHITECTURE,
    candidateCount: candidates.length,
    includedCandidateCount: candidates.filter((candidate) => candidate.includedInWave).length,
    protectedGuardCount: candidates.filter((candidate) => candidate.protectedGuard).length,
    existingRoutePreservationCount: candidates.filter((candidate) => candidate.routePreservation.existingRouteAlreadyExisted).length,
    internalReadinessCount: candidates.filter((candidate) => candidate.dispositions.includes("INTERNAL_READINESS_ONLY")).length,
    objectTypesCovered: unique(candidates.map((candidate) => candidate.objectType)),
    relationshipTypesCovered: unique(relationships.map((relationship) => relationship.relationshipType)),
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
    blockedCaseCount: candidates.filter((candidate) => candidate.dispositions.includes("PUBLIC_ACTIVATION_BLOCKED") || candidate.routeReadiness === "BLOCKED").length,
    sourceRightsFailClosedCaseCount: candidates.filter((candidate) => isFailClosedRights(candidate.sourceRightsPosture)).length,
    boundaryLimitationCaseCount: candidates.filter((candidate) =>
      ["APPROXIMATE_BOUNDARY", "DESCRIPTIVE_AREA_ONLY", "UNAVAILABLE", "UNRESOLVED", "PROHIBITED_FOR_PUBLIC_USE"].includes(candidate.boundaryPosture),
    ).length,
    searchUnsupportedOrBlockedCount: candidates.filter((candidate) =>
      ["UNSUPPORTED", "BLOCKED", "UNRESOLVED", "AMBIGUOUS", "DATA_COVERAGE_INCOMPLETE"].includes(candidate.searchSupport),
    ).length,
    mapUnsupportedOrBlockedCount: candidates.filter((candidate) =>
      ["UNSUPPORTED", "NO_PUBLIC_BOUNDARY", "BOUNDARY_RIGHTS_INCOMPLETE", "FUTURE_REVIEW_REQUIRED", "BLOCKED"].includes(candidate.mapSupport),
    ).length,
    ambiguityCaseCount: candidates.filter((candidate) => candidate.ambiguityPosture !== "NO_KNOWN_AMBIGUITY").length,
    futureCertificationCandidateCount: candidates.filter((candidate) => candidate.dispositions.includes("FUTURE_CERTIFICATION_CANDIDATE")).length,
    deferredCandidateCount: candidates.filter((candidate) => candidate.dispositions.includes("DEFERRED")).length,
    gunbarrelOutcome:
      gunbarrel?.protectedGuard === true &&
      gunbarrel.dispositions.includes("DEFERRED") &&
      gunbarrel.dispositions.includes("PUBLIC_ACTIVATION_BLOCKED")
        ? "DEFERRED_AND_BLOCKED"
        : "DEFERRED_AND_BLOCKED",
    niwotOutcome:
      niwot?.protectedGuard === true && niwot.dispositions.includes("DEFERRED") && niwot.dispositions.includes("PUBLIC_ACTIVATION_BLOCKED")
        ? "DEFERRED_AND_BLOCKED"
        : "DEFERRED_AND_BLOCKED",
    prohibitedConversionGuard: "PASS",
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
      publicActivationDecision: false,
    }),
    activationAssertions: Object.freeze({
      noNewPublicRoutes: candidates.every((candidate) => candidate.activation.newPublicRouteCreated === false),
      noRouteEligibilityChange: candidates.every((candidate) => candidate.activation.publicRouteEligibilityChanged === false),
      noRegistryEligibilityChange: candidates.every((candidate) => candidate.activation.publicRegistryEligibilityChanged === false),
      noSitemapChange: candidates.every((candidate) => candidate.activation.publicSitemapChanged === false),
      noCanonicalChange: candidates.every((candidate) => candidate.activation.publicCanonicalUrlChanged === false),
      noSearchChange: candidates.every((candidate) => candidate.activation.searchBehaviorChanged === false),
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
