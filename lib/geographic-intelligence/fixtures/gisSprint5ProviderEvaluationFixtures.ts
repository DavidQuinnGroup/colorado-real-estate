import { GIS_FAIL_CLOSED_ACTIVATION } from "../activationContract.js";
import { GIS_SPRINT_3_PROVIDER_INVENTORY, GIS_SPRINT_3_PROVIDER_OVERLAPS } from "./gisSprint3ProviderInventoryFixtures.js";
import { buildGisProviderEvaluationGates } from "../providerEvaluationGates.js";
import { buildGisSprint5ProviderEvaluationRecord } from "../providerSelectionGovernance.js";
import {
  GIS_1_0_SPRINT_5_CERTIFICATION,
  GIS_SPRINT_5_BOUNDARY_NOTE,
  GIS_SPRINT_5_REFERENCE_DATE,
  type GisProviderCandidateEvaluation,
  type GisProviderEvaluationCriterionId,
  type GisProviderEvaluationDisposition,
  type GisProviderEvaluationRecord,
  type GisProviderEvaluationScenarioResult,
} from "../providerEvaluationContract.js";
import {
  GIS_SPRINT_5_EVALUATION_CRITERIA,
  evaluationFingerprint,
  scoreGisProviderCandidate,
  weightedScore,
} from "../providerEvaluationScoring.js";
import { type GisProviderInventoryEntry } from "../providerInventoryContract.js";

export const GIS_SPRINT_5_CAPABILITY_REQUIREMENT = Object.freeze({
  capabilityRequirementId: "ENVIRONMENTAL_GEOGRAPHIC_EVIDENCE_PROVIDER_EVALUATION",
  evaluationSubject: "Environmental geographic evidence provider evaluation",
  intendedInternalUse: "INTERNAL_GOVERNANCE_EVALUATION_ONLY",
  geographicCoverageRequirement: "VARIABLE",
  jurisdictionRequirement: "Colorado governance context with variable source coverage retained",
  requiredDomains: Object.freeze(["ENVIRONMENTAL_INTELLIGENCE"] as const),
  requiredEvidenceCategories: Object.freeze(["environmental risk", "geologic context", "weather context", "air quality context", "fallback research context"]),
  requiredAuthorityLevel: "GOVERNMENTAL",
  minimumFreshnessExpectation: "UNKNOWN",
  minimumQualityExpectation: "UNVERIFIED",
  licensingRequirement: "CONTRACTUAL_INTERNAL_USE",
  permittedUseRequirement: "INTERNAL_RESEARCH_ONLY",
  attributionConstraints: "UNKNOWN_ALLOWED_ONLY_AS_GATE",
  customerDisplayRequired: false,
  redistributionRequired: false,
  technicalAccessRequirement: "EVALUATION_ONLY_UNKNOWN_ALLOWED",
  continuityRequirement: "GOVERNANCE_REVIEW_REQUIRED",
  resilienceRequirement: "AT_LEAST_ONE_AUTHORITY_AND_ONE_FALLBACK_OR_SUPPLEMENTAL",
  budgetClassification: "UNKNOWN",
  implementationComplexityTolerance: "MODERATE",
} satisfies GisProviderEvaluationRecord["capabilityRequirement"]);

export function buildGisSprint5ProviderEvaluationFixture(): GisProviderEvaluationRecord {
  const candidates = [
    candidate("colorado-geological-survey", "SELECTED_FOR_CONTROLLED_PROVIDER_DUE_DILIGENCE", true, true, "NONE_KNOWN", baseScores({
      SOURCE_AUTHORITY: 92,
      SUBJECT_RELEVANCE: 90,
      DOMAIN_RELEVANCE: 95,
      GEOGRAPHIC_COVERAGE: 84,
      UNIQUE_VALUE_CONTRIBUTION: 88,
      RESILIENCE_CONTRIBUTION: 72,
      EXPLAINABILITY: 90,
      AUDITABILITY: 85,
    }), ["geologic context"], "Strong authority and relevance; licensing and permitted-use gates remain unresolved."),
    candidate("attom-data", "COMMERCIAL_REVIEW_REQUIRED", true, true, "NONE_KNOWN", baseScores({
      SOURCE_AUTHORITY: 62,
      SUBJECT_RELEVANCE: 72,
      DOMAIN_RELEVANCE: 60,
      GEOGRAPHIC_COVERAGE: 88,
      EVIDENCE_COMPLETENESS: 78,
      CONTRACT_COMPLEXITY: 80,
      COMMERCIAL_COST: 85,
      IMPLEMENTATION_COMPLEXITY: 70,
      UNIQUE_VALUE_CONTRIBUTION: 62,
    }), ["commercial analytics context"], "Commercial breadth may be useful but contract, licensing, and technical access are unknown."),
    candidate("zillow", "RESEARCH_REFERENCE_ONLY", true, true, "NONE_KNOWN", baseScores({
      SOURCE_AUTHORITY: 24,
      SUBJECT_RELEVANCE: 45,
      DOMAIN_RELEVANCE: 30,
      CUSTOMER_VALUE_POTENTIAL: 72,
      EXPLAINABILITY: 35,
    }), ["supplemental research context"], "Consumer portal remains research-reference-only without authority or use-rights evidence."),
    candidate("showingtime", "OPERATIONAL_TOOL_ONLY", false, false, "NONE_KNOWN", baseScores({
      SOURCE_AUTHORITY: 10,
      SUBJECT_RELEVANCE: 5,
      DOMAIN_RELEVANCE: 5,
      GEOGRAPHIC_COVERAGE: 10,
      EVIDENCE_COMPLETENESS: 10,
    }), ["operational tool context"], "Operational workflow tool is outside the environmental evidence capability."),
    candidate("boulder-county-gis", "OUTSIDE_CAPABILITY_SCOPE", true, false, "NONE_KNOWN", baseScores({
      SOURCE_AUTHORITY: 82,
      SUBJECT_RELEVANCE: 78,
      DOMAIN_RELEVANCE: 80,
      GEOGRAPHIC_COVERAGE: 30,
      AUDITABILITY: 80,
    }), ["county GIS context"], "County-specific coverage is not aligned to the variable statewide/fixture coverage requirement."),
    candidate("fema-flood-map-source-class", "RETAINED_AS_FALLBACK_CANDIDATE", true, true, "NONE_KNOWN", baseScores({
      SOURCE_AUTHORITY: 82,
      SUBJECT_RELEVANCE: 84,
      DOMAIN_RELEVANCE: 92,
      GEOGRAPHIC_COVERAGE: 78,
      OVERLAP_OR_REDUNDANCY: 55,
      RESILIENCE_CONTRIBUTION: 82,
      AUDITABILITY: 80,
    }), ["environmental risk"], "Potentially authoritative fallback; remains generic and licensing/technical gates unresolved.", ["GIS-S3-OVERLAP-GIS-ASSESSOR"]),
    candidate("air-quality-source-class", "RETAINED_AS_SUPPLEMENTAL_CANDIDATE", true, true, "NONE_KNOWN", baseScores({
      SOURCE_AUTHORITY: 45,
      SUBJECT_RELEVANCE: 76,
      DOMAIN_RELEVANCE: 88,
      GEOGRAPHIC_COVERAGE: 68,
      UNIQUE_VALUE_CONTRIBUTION: 90,
      RESILIENCE_CONTRIBUTION: 65,
    }), ["air quality context"], "Unique supplemental evidence category, but cannot satisfy the capability alone."),
    candidate("wildfire-risk-source-class", "INSUFFICIENT_EVIDENCE", true, true, "NONE_KNOWN", baseScores({
      SOURCE_AUTHORITY: "UNKNOWN",
      SUBJECT_RELEVANCE: 76,
      DOMAIN_RELEVANCE: 90,
      GEOGRAPHIC_COVERAGE: "UNKNOWN",
      EVIDENCE_COMPLETENESS: "UNKNOWN",
      CURRENT_VERIFICATION_STATE: "UNKNOWN",
    }), ["environmental risk"], "Inventory evidence is too generic for a stronger disposition."),
    candidate("national-weather-service", "REJECTED", true, true, "NONE_KNOWN", baseScores({
      SOURCE_AUTHORITY: 95,
      SUBJECT_RELEVANCE: 82,
      DOMAIN_RELEVANCE: 88,
      GEOGRAPHIC_COVERAGE: 86,
      EVIDENCE_COMPLETENESS: 80,
      LICENSING_CERTAINTY: 0,
      PERMITTED_USE_CERTAINTY: 0,
    }), ["weather context"], "High authority cannot bypass intentionally failed licensing gate.", [], true),
    candidate("u-s-geological-survey", "SELECTED_FOR_CONTROLLED_PROVIDER_DUE_DILIGENCE", true, true, "NONE_KNOWN", baseScores({
      SOURCE_AUTHORITY: 92,
      SUBJECT_RELEVANCE: 90,
      DOMAIN_RELEVANCE: 95,
      GEOGRAPHIC_COVERAGE: 84,
      UNIQUE_VALUE_CONTRIBUTION: 88,
      RESILIENCE_CONTRIBUTION: 72,
      EXPLAINABILITY: 90,
      AUDITABILITY: 85,
    }), ["geologic context"], "Tie fixture with Colorado Geological Survey; deterministic tie-breaker uses stable inventory-entry ID."),
    candidate("colorado-open-records-act-request-channels", "GOVERNANCE_REVIEW_REQUIRED", true, true, "UNKNOWN", baseScores({
      SOURCE_AUTHORITY: 70,
      SUBJECT_RELEVANCE: 62,
      DOMAIN_RELEVANCE: 55,
      GEOGRAPHIC_COVERAGE: 60,
      AUDITABILITY: 75,
    }), ["fallback research context"], "Conflict-of-interest and workflow suitability remain unknown."),
    staleCandidate("realtors-property-resource"),
    candidate("titlepro247", "REJECTED", true, true, "NONE_KNOWN", baseScores({
      SOURCE_AUTHORITY: 80,
      SUBJECT_RELEVANCE: 82,
      DOMAIN_RELEVANCE: 75,
      GEOGRAPHIC_COVERAGE: 86,
      EVIDENCE_COMPLETENESS: 86,
      CUSTOMER_VALUE_POTENTIAL: 90,
      LICENSING_CERTAINTY: 0,
      PERMITTED_USE_CERTAINTY: 0,
    }), ["score manipulation fixture"], "Mandatory licensing and permitted-use gates block favorable non-gating scores.", [], true),
  ];

  return buildGisSprint5ProviderEvaluationRecord(candidates, GIS_SPRINT_5_CAPABILITY_REQUIREMENT);
}

export function certifyGisSprint5ProviderEvaluationScenarios(): Readonly<Record<string, GisProviderEvaluationScenarioResult>> {
  const evaluation = buildGisSprint5ProviderEvaluationFixture();
  const byId = new Map(evaluation.candidateEvaluations.map((item) => [item.inventoryEntryId, item]));
  const allScenariosValid = [
    byId.get("colorado-geological-survey")?.disposition === "SELECTED_FOR_CONTROLLED_PROVIDER_DUE_DILIGENCE",
    byId.get("attom-data")?.disposition === "COMMERCIAL_REVIEW_REQUIRED",
    byId.get("zillow")?.disposition === "RESEARCH_REFERENCE_ONLY",
    byId.get("showingtime")?.disposition === "OPERATIONAL_TOOL_ONLY",
    byId.get("boulder-county-gis")?.disposition === "FAILED_CLOSED_MANDATORY_GATE",
    byId.get("fema-flood-map-source-class")?.disposition === "RETAINED_AS_FALLBACK_CANDIDATE",
    byId.get("air-quality-source-class")?.disposition === "RETAINED_AS_SUPPLEMENTAL_CANDIDATE",
    byId.get("wildfire-risk-source-class")?.disposition === "INSUFFICIENT_EVIDENCE",
    byId.get("national-weather-service")?.disposition === "REJECTED",
    evaluation.recommendedMinimumProviderSet.classification === "PROPOSED_MINIMUM_PROVIDER_SET_FOR_DUE_DILIGENCE",
    byId.get("colorado-geological-survey")?.weightedScore === byId.get("u-s-geological-survey")?.weightedScore,
    (byId.get("colorado-geological-survey")?.rank ?? 0) < (byId.get("u-s-geological-survey")?.rank ?? 0),
    byId.get("colorado-open-records-act-request-channels")?.disposition === "GOVERNANCE_REVIEW_REQUIRED",
    byId.get("realtors-property-resource")?.disposition === "TECHNICAL_REVIEW_REQUIRED",
    byId.get("titlepro247")?.disposition === "REJECTED",
    GIS_1_0_SPRINT_5_CERTIFICATION === "GIS_1_0_SPRINT_5_PROVIDER_EVALUATION_AND_SELECTION_GOVERNANCE_CERTIFIED",
    GIS_SPRINT_5_BOUNDARY_NOTE === "PROVIDER_EVALUATION_DOES_NOT_AUTHORIZE_PROVIDER_USE",
  ].every(Boolean);
  if (!allScenariosValid) throw new Error("GIS Sprint 5 provider evaluation scenario certification failed.");

  return Object.freeze({
    scenarioA: "SELECTED_FOR_CONTROLLED_PROVIDER_DUE_DILIGENCE",
    scenarioB: "COMMERCIAL_REVIEW_REQUIRED",
    scenarioC: "RESEARCH_REFERENCE_ONLY",
    scenarioD: "OPERATIONAL_TOOL_ONLY",
    scenarioE: "OUTSIDE_CAPABILITY_SCOPE",
    scenarioF: "RETAINED_AS_FALLBACK_CANDIDATE",
    scenarioG: "RETAINED_AS_SUPPLEMENTAL_CANDIDATE",
    scenarioH: "INSUFFICIENT_EVIDENCE",
    scenarioI: "REJECTED",
    scenarioJ: "PROPOSED_MINIMUM_PROVIDER_SET_FOR_DUE_DILIGENCE",
    scenarioK: "DETERMINISTIC_TIE_RESOLVED",
    scenarioL: "GOVERNANCE_REVIEW_REQUIRED",
    scenarioM: "TECHNICAL_REVIEW_REQUIRED",
    scenarioN: "FAILED_CLOSED_MANDATORY_GATE",
  });
}

export function gisSprint5ProviderEvaluationFingerprint(): string {
  const evaluation = buildGisSprint5ProviderEvaluationFixture();
  return evaluationFingerprint({
    evaluationId: evaluation.evaluationId,
    fingerprint: evaluation.deterministicFingerprint,
    scenarios: certifyGisSprint5ProviderEvaluationScenarios(),
    minimumSet: evaluation.recommendedMinimumProviderSet,
  });
}

function candidate(
  inventoryEntryId: string,
  requestedDisposition: GisProviderEvaluationDisposition,
  capabilityRelevant: boolean,
  coverageAligned: boolean,
  conflictOfInterestState: GisProviderCandidateEvaluation["conflictOfInterestState"],
  rawScores: Readonly<Record<GisProviderEvaluationCriterionId, number | "UNKNOWN">>,
  evidenceCategoryRelevance: readonly string[],
  rationale: string,
  overlapReferences: readonly string[] = [],
  forceLicensingFailure = false,
): GisProviderCandidateEvaluation {
  const entry = inventory(inventoryEntryId);
  const gates = buildGisProviderEvaluationGates(entry, capabilityRelevant, coverageAligned, conflictOfInterestState, false)
    .map((gate) => forceLicensingFailure && (gate.gateId === "LICENSING_GATE" || gate.gateId === "PERMITTED_USE_GATE") ? Object.freeze({ ...gate, state: "FAIL" as const }) : gate);
  const scores = scoreGisProviderCandidate(entry, rawScores);
  const disposition = forcedDisposition(requestedDisposition, entry, gates);
  return Object.freeze({
    inventoryEntryId: entry.inventoryEntryId,
    candidateCanonicalName: entry.canonicalName,
    entityTypes: entry.entityTypes,
    providerRoles: entry.providerRoles,
    verificationState: entry.verificationState,
    authorityAssessment: entry.authorityClassification,
    geographicCoverageAssessment: entry.geographicCoverageType,
    domainRelevance: entry.potentialGisDomainRelevance,
    evidenceCategoryRelevance: Object.freeze(evidenceCategoryRelevance),
    freshnessAssessment: entry.freshnessExpectation,
    qualityAssessment: entry.verificationState === "INVENTORY_DOCUMENT_ONLY" ? "UNVERIFIED" : "UNKNOWN",
    licensingCertainty: forceLicensingFailure ? "PROHIBITED" : entry.licensingClassification,
    permittedUseCertainty: forceLicensingFailure ? "PROHIBITED" : entry.permittedUse,
    attributionRequirement: entry.attributionRequired,
    technicalAccessCertainty: "UNKNOWN",
    contractRequirement: entry.contractRequired,
    accountRequirement: entry.accountOrMembershipRequired,
    authenticationRequirement: entry.authenticationRequired,
    costClassification: entry.costClassification,
    implementationComplexity: entry.entityTypes.includes("GENERIC_SOURCE_CLASS") ? "HIGH" : entry.entityTypes.includes("COMMERCIAL_VENDOR") ? "HIGH" : "MODERATE",
    dependencyRisk: entry.dependencyRisks,
    continuityRisk: "UNKNOWN",
    overlapReferences: Object.freeze(overlapReferences),
    uniqueValueAssessment: rawScores.UNIQUE_VALUE_CONTRIBUTION === "UNKNOWN" ? "UNKNOWN" : rawScores.UNIQUE_VALUE_CONTRIBUTION >= 80 ? "HIGH" : rawScores.UNIQUE_VALUE_CONTRIBUTION >= 50 ? "MODERATE" : "LOW",
    resilienceContribution: rawScores.RESILIENCE_CONTRIBUTION === "UNKNOWN" ? "UNKNOWN" : rawScores.RESILIENCE_CONTRIBUTION >= 80 ? "HIGH" : rawScores.RESILIENCE_CONTRIBUTION >= 50 ? "MODERATE" : "LOW",
    legalReviewRequired: true,
    commercialReviewRequired: entry.entityTypes.includes("COMMERCIAL_VENDOR") || entry.costClassification === "ENTERPRISE_CONTRACT",
    technicalReviewRequired: true,
    authorityReviewRequired: entry.authorityClassification === "UNKNOWN",
    dataGovernanceReviewRequired: true,
    knownUnknowns: Object.freeze(["licensing", "permitted use", "technical access", "current availability", "pricing", "contract terms"]),
    disqualifyingConditions: Object.freeze(gates.filter((gate) => gate.state === "FAIL").map((gate) => gate.gateId)),
    criterionScores: scores,
    mandatoryGates: Object.freeze(gates),
    weightedScore: weightedScore(scores),
    confidenceInEvaluation: entry.verificationState === "INVENTORY_DOCUMENT_ONLY" ? "LOW" : "LOW",
    disposition,
    rank: 0,
    rationale,
    evidenceReferences: Object.freeze([`GIS_SPRINT_3_PROVIDER_INVENTORY:${entry.inventoryEntryId}`, ...entry.classificationEvidence]),
    reconsiderationConditions: Object.freeze(["Separate controlled due diligence authorization", "Licensing review", "Permitted-use review", "Technical feasibility review", "Conflict disclosure review"]),
    conflictOfInterestState,
    internalOnly: true,
    activation: GIS_FAIL_CLOSED_ACTIVATION,
    customerDisplayAuthorized: false,
    redistributionAuthorized: false,
  });
}

function staleCandidate(inventoryEntryId: string): GisProviderCandidateEvaluation {
  const base = candidate(inventoryEntryId, "TECHNICAL_REVIEW_REQUIRED", true, true, "NONE_KNOWN", baseScores({
    SOURCE_AUTHORITY: 60,
    SUBJECT_RELEVANCE: 60,
    DOMAIN_RELEVANCE: 55,
    GEOGRAPHIC_COVERAGE: 70,
    CURRENT_VERIFICATION_STATE: "UNKNOWN",
  }), ["stale verification fixture"], "Historical or possibly stale inventory state blocks current technical claims.");
  return Object.freeze({
    ...base,
    verificationState: "HISTORICAL_OR_POSSIBLY_STALE",
    disposition: "TECHNICAL_REVIEW_REQUIRED",
  });
}

function baseScores(overrides: Partial<Record<GisProviderEvaluationCriterionId, number | "UNKNOWN">>): Readonly<Record<GisProviderEvaluationCriterionId, number | "UNKNOWN">> {
  const base = Object.fromEntries(GIS_SPRINT_5_EVALUATION_CRITERIA.map((criterion) => [criterion.criterionId, 50])) as Record<GisProviderEvaluationCriterionId, number | "UNKNOWN">;
  base.LICENSING_CERTAINTY = "UNKNOWN";
  base.PERMITTED_USE_CERTAINTY = "UNKNOWN";
  base.TECHNICAL_ACCESS_CERTAINTY = "UNKNOWN";
  base.CURRENT_VERIFICATION_STATE = 35;
  return Object.freeze({ ...base, ...overrides });
}

function forcedDisposition(
  requestedDisposition: GisProviderEvaluationDisposition,
  entry: GisProviderInventoryEntry,
  gates: readonly ReturnType<typeof buildGisProviderEvaluationGates>[number][],
): GisProviderEvaluationDisposition {
  if (requestedDisposition === "REJECTED") return "REJECTED";
  if (requestedDisposition === "INSUFFICIENT_EVIDENCE") return "INSUFFICIENT_EVIDENCE";
  if (requestedDisposition === "TECHNICAL_REVIEW_REQUIRED") return "TECHNICAL_REVIEW_REQUIRED";
  if (entry.providerRoles.includes("OPERATIONAL_TOOL")) return "OPERATIONAL_TOOL_ONLY";
  if (entry.providerRoles.includes("CONSUMER_PORTAL")) return "RESEARCH_REFERENCE_ONLY";
  if (gates.some((gate) => gate.state === "FAIL")) return "FAILED_CLOSED_MANDATORY_GATE";
  return requestedDisposition;
}

function inventory(inventoryEntryId: string): GisProviderInventoryEntry {
  const entry = GIS_SPRINT_3_PROVIDER_INVENTORY.find((candidateEntry) => candidateEntry.inventoryEntryId === inventoryEntryId);
  if (!entry) throw new Error(`Missing Sprint 3 provider inventory entry ${inventoryEntryId}`);
  return entry;
}

export const GIS_SPRINT_5_OVERLAP_REFERENCE_IDS = Object.freeze(GIS_SPRINT_3_PROVIDER_OVERLAPS.map((overlap) => overlap.overlapId));
export const GIS_SPRINT_5_CANDIDATE_COUNT = 13;
export const GIS_SPRINT_5_CRITERIA_COUNT = GIS_SPRINT_5_EVALUATION_CRITERIA.length;
export const GIS_SPRINT_5_REFERENCE_DATE_USED = GIS_SPRINT_5_REFERENCE_DATE;
