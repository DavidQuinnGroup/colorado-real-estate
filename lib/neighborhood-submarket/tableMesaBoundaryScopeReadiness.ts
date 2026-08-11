import type {
  EvidenceDepthConflictStatus,
  EvidenceDepthFreshnessStatus,
  EvidenceDepthLimitationCategory,
  EvidenceDepthRightsStatus,
  EvidenceDepthSupportLevel,
} from "../evidence-depth/evidencePosture.js";
import { SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CANDIDATES } from "./secondGovernedNeighborhoodSubmarketWaveFixtures.js";

export const TABLE_MESA_BOUNDARY_SCOPE_READINESS_CONTRACT =
  "TABLE_MESA_BOUNDARY_SCOPE_READINESS_FOUNDATION";
export const TABLE_MESA_BOUNDARY_SCOPE_READINESS_STATUS =
  "TABLE_MESA_BOUNDARY_SCOPE_READY_FOR_FUTURE_LIMITATION_FORWARD_REVIEW";
export const TABLE_MESA_BOUNDARY_SCOPE_READINESS_VERSION = "1.0.0";

export type TableMesaForbiddenBoundaryMeaning =
  | "LEGAL_BOUNDARY"
  | "HOA_BOUNDARY"
  | "SCHOOL_ATTENDANCE_BOUNDARY"
  | "SAFETY_BOUNDARY"
  | "HAZARD_BOUNDARY"
  | "INSURANCE_BOUNDARY"
  | "PROPERTY_BOUNDARY"
  | "PARCEL_BOUNDARY";

export type TableMesaForbiddenClassification =
  | "SUBDIVISION"
  | "HOA"
  | "MUNICIPALITY"
  | "PARCEL"
  | "LEGAL_JURISDICTION";

export type TableMesaEvidenceRequirement = Readonly<{
  label:
    | "Table Mesa name"
    | "Table Mesa area alias"
    | "Boulder relationship"
    | "South Boulder contextual association"
    | "permitted place and housing context"
    | "verification freshness";
  sourcePosture: EvidenceDepthRightsStatus;
  supportLevel: EvidenceDepthSupportLevel;
  freshness: EvidenceDepthFreshnessStatus;
  conflict: EvidenceDepthConflictStatus;
  publicUse: "LIMITATION_FORWARD_ORIENTATION_ONLY" | "FAIL_CLOSED";
  limitation: EvidenceDepthLimitationCategory;
}>;

export type TableMesaBoundaryScopeReadiness = Readonly<{
  contract: typeof TABLE_MESA_BOUNDARY_SCOPE_READINESS_CONTRACT;
  status: typeof TABLE_MESA_BOUNDARY_SCOPE_READINESS_STATUS;
  version: typeof TABLE_MESA_BOUNDARY_SCOPE_READINESS_VERSION;
  route: "/market/boulder/table-mesa";
  canonicalObjectId: "neighborhood:boulder:table-mesa";
  canonicalName: "Table Mesa";
  objectType: "NEIGHBORHOOD";
  alias: "Table Mesa area";
  parentObjectId: "city:boulder";
  contextualObjectIds: readonly ("county:boulder" | "market-area:south-boulder-context")[];
  authorityPosture: "LOCALLY_RECOGNIZED_NON_AUTHORITATIVE";
  boundaryScope: Readonly<{
    posture: "APPROXIMATE_BOUNDARY";
    ambiguity: "BOUNDARY_AMBIGUITY";
    publicSemantics: "APPROXIMATE_DESCRIPTIVE_NEIGHBORHOOD_AREA_FOR_ORIENTATION";
    mustNotReclassifyAs: readonly TableMesaForbiddenClassification[];
    forbiddenMeanings: readonly TableMesaForbiddenBoundaryMeaning[];
    southBoulderAssociation: "CONTEXTUAL_ASSOCIATION_ONLY";
    doesNotClaimIdenticalBoundaries: true;
    doesNotClaimExclusiveContainment: true;
    doesNotClaimExactParentageBeyondGovernedEvidence: true;
  }>;
  evidenceRequirements: readonly TableMesaEvidenceRequirement[];
  conflictBehavior: Readonly<{
    conflictingBoundaryEvidence: "FAIL_CLOSED";
    unavailableBoundaryEvidence: "FAIL_CLOSED";
    staleBoundaryEvidence: "FAIL_CLOSED";
    unsupportedPublicGeometry: "FAIL_CLOSED";
    substituteInferenceAllowed: false;
  }>;
  searchBoundary: Readonly<{
    existingSearchNavigationOnly: true;
    discoveryPathOnly: true;
    certifiesCompleteInventory: false;
    certifiesExactBoundaryFilteredListings: false;
    certifiesGeographicExhaustiveness: false;
    changesSearchEligibility: false;
  }>;
  mapBoundary: Readonly<{
    polygonCreated: false;
    markerLayerCreated: false;
    gisAcquisition: false;
    externalGeometry: false;
    mapEligibilityChanged: false;
  }>;
  publicRouteEnhancementAuthorized: false;
  protectedClaims: Readonly<{
    ranking: false;
    suitability: false;
    desirability: false;
    valuation: false;
    investmentConclusion: false;
    appreciationPrediction: false;
    demographicComparison: false;
    schoolQualityJudgment: false;
    safetyJudgment: false;
  }>;
}>;

function tableMesaCandidate() {
  const candidate = SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CANDIDATES.find(
    (item) => item.canonicalObjectId === "neighborhood:boulder:table-mesa",
  );

  if (!candidate) {
    throw new Error("Table Mesa governed candidate is missing.");
  }

  return candidate;
}

export function buildTableMesaBoundaryScopeReadiness(): TableMesaBoundaryScopeReadiness {
  const candidate = tableMesaCandidate();
  const evidenceRequirements: readonly TableMesaEvidenceRequirement[] = Object.freeze([
    {
      label: "Table Mesa name",
      sourcePosture: candidate.sourceRightsPosture,
      supportLevel: candidate.evidencePosture.supportLevel,
      freshness: candidate.evidencePosture.freshnessStatus,
      conflict: candidate.evidencePosture.conflictStatus,
      publicUse: "LIMITATION_FORWARD_ORIENTATION_ONLY",
      limitation: "CITYWIDE_NOT_PROPERTY_SPECIFIC",
    },
    {
      label: "Table Mesa area alias",
      sourcePosture: candidate.sourceRightsPosture,
      supportLevel: candidate.evidencePosture.supportLevel,
      freshness: candidate.evidencePosture.freshnessStatus,
      conflict: candidate.evidencePosture.conflictStatus,
      publicUse: "LIMITATION_FORWARD_ORIENTATION_ONLY",
      limitation: "PROFESSIONAL_VERIFICATION_REQUIRED",
    },
    {
      label: "Boulder relationship",
      sourcePosture: candidate.sourceRightsPosture,
      supportLevel: candidate.evidencePosture.supportLevel,
      freshness: candidate.evidencePosture.freshnessStatus,
      conflict: candidate.evidencePosture.conflictStatus,
      publicUse: "LIMITATION_FORWARD_ORIENTATION_ONLY",
      limitation: "CITYWIDE_NOT_PROPERTY_SPECIFIC",
    },
    {
      label: "South Boulder contextual association",
      sourcePosture: candidate.sourceRightsPosture,
      supportLevel: candidate.evidencePosture.supportLevel,
      freshness: candidate.evidencePosture.freshnessStatus,
      conflict: "INSUFFICIENT_INFORMATION_TO_RECONCILE",
      publicUse: "LIMITATION_FORWARD_ORIENTATION_ONLY",
      limitation: "UNRESOLVED_CONFLICT",
    },
    {
      label: "permitted place and housing context",
      sourcePosture: candidate.sourceRightsPosture,
      supportLevel: candidate.evidencePosture.supportLevel,
      freshness: candidate.evidencePosture.freshnessStatus,
      conflict: candidate.evidencePosture.conflictStatus,
      publicUse: "LIMITATION_FORWARD_ORIENTATION_ONLY",
      limitation: "PROFESSIONAL_VERIFICATION_REQUIRED",
    },
    {
      label: "verification freshness",
      sourcePosture: candidate.sourceRightsPosture,
      supportLevel: candidate.evidencePosture.supportLevel,
      freshness: candidate.evidencePosture.freshnessStatus,
      conflict: candidate.evidencePosture.conflictStatus,
      publicUse: "FAIL_CLOSED",
      limitation: "STALE_EVIDENCE",
    },
  ]);

  return Object.freeze({
    contract: TABLE_MESA_BOUNDARY_SCOPE_READINESS_CONTRACT,
    status: TABLE_MESA_BOUNDARY_SCOPE_READINESS_STATUS,
    version: TABLE_MESA_BOUNDARY_SCOPE_READINESS_VERSION,
    route: "/market/boulder/table-mesa",
    canonicalObjectId: "neighborhood:boulder:table-mesa",
    canonicalName: "Table Mesa",
    objectType: "NEIGHBORHOOD",
    alias: "Table Mesa area",
    parentObjectId: "city:boulder",
    contextualObjectIds: ["county:boulder", "market-area:south-boulder-context"] as const,
    authorityPosture: "LOCALLY_RECOGNIZED_NON_AUTHORITATIVE",
    boundaryScope: Object.freeze({
      posture: "APPROXIMATE_BOUNDARY",
      ambiguity: "BOUNDARY_AMBIGUITY",
      publicSemantics: "APPROXIMATE_DESCRIPTIVE_NEIGHBORHOOD_AREA_FOR_ORIENTATION",
      mustNotReclassifyAs: ["SUBDIVISION", "HOA", "MUNICIPALITY", "PARCEL", "LEGAL_JURISDICTION"] as const,
      forbiddenMeanings: [
        "LEGAL_BOUNDARY",
        "HOA_BOUNDARY",
        "SCHOOL_ATTENDANCE_BOUNDARY",
        "SAFETY_BOUNDARY",
        "HAZARD_BOUNDARY",
        "INSURANCE_BOUNDARY",
        "PROPERTY_BOUNDARY",
        "PARCEL_BOUNDARY",
      ] as const,
      southBoulderAssociation: "CONTEXTUAL_ASSOCIATION_ONLY",
      doesNotClaimIdenticalBoundaries: true,
      doesNotClaimExclusiveContainment: true,
      doesNotClaimExactParentageBeyondGovernedEvidence: true,
    }),
    evidenceRequirements,
    conflictBehavior: Object.freeze({
      conflictingBoundaryEvidence: "FAIL_CLOSED",
      unavailableBoundaryEvidence: "FAIL_CLOSED",
      staleBoundaryEvidence: "FAIL_CLOSED",
      unsupportedPublicGeometry: "FAIL_CLOSED",
      substituteInferenceAllowed: false,
    }),
    searchBoundary: Object.freeze({
      existingSearchNavigationOnly: true,
      discoveryPathOnly: true,
      certifiesCompleteInventory: false,
      certifiesExactBoundaryFilteredListings: false,
      certifiesGeographicExhaustiveness: false,
      changesSearchEligibility: false,
    }),
    mapBoundary: Object.freeze({
      polygonCreated: false,
      markerLayerCreated: false,
      gisAcquisition: false,
      externalGeometry: false,
      mapEligibilityChanged: false,
    }),
    publicRouteEnhancementAuthorized: false,
    protectedClaims: Object.freeze({
      ranking: false,
      suitability: false,
      desirability: false,
      valuation: false,
      investmentConclusion: false,
      appreciationPrediction: false,
      demographicComparison: false,
      schoolQualityJudgment: false,
      safetyJudgment: false,
    }),
  });
}
