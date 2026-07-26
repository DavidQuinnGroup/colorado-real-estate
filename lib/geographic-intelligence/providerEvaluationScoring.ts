import { GIS_FAIL_CLOSED_ACTIVATION } from "./activationContract.js";
import { stableGisEvidenceFingerprint } from "./evidenceFingerprint.js";
import {
  GIS_SPRINT_5_SCORING_MODEL_ID,
  GIS_SPRINT_5_SCORING_MODEL_VERSION,
  type GisProviderCandidateEvaluation,
  type GisProviderEvaluationCriterion,
  type GisProviderEvaluationCriterionId,
  type GisProviderEvaluationDisposition,
  type GisProviderEvaluationGate,
  type GisProviderEvaluationScore,
} from "./providerEvaluationContract.js";
import { type GisProviderInventoryEntry } from "./providerInventoryContract.js";

export const GIS_SPRINT_5_EVALUATION_CRITERIA = Object.freeze([
  criterion("SOURCE_AUTHORITY", "Source authority", 0.07, "BENEFIT", "UNCERTAINTY_PENALTY"),
  criterion("SUBJECT_RELEVANCE", "Subject relevance", 0.05, "BENEFIT", "GOVERNANCE_BLOCK"),
  criterion("DOMAIN_RELEVANCE", "Domain relevance", 0.05, "BENEFIT", "GOVERNANCE_BLOCK"),
  criterion("GEOGRAPHIC_COVERAGE", "Geographic coverage", 0.05, "BENEFIT", "GOVERNANCE_BLOCK"),
  criterion("EVIDENCE_COMPLETENESS", "Evidence completeness", 0.04, "BENEFIT", "UNCERTAINTY_PENALTY"),
  criterion("FRESHNESS_POTENTIAL", "Freshness potential", 0.04, "BENEFIT", "UNCERTAINTY_PENALTY"),
  criterion("QUALITY_POTENTIAL", "Quality potential", 0.04, "BENEFIT", "UNCERTAINTY_PENALTY"),
  criterion("LICENSING_CERTAINTY", "Licensing certainty", 0.07, "BENEFIT", "GOVERNANCE_BLOCK"),
  criterion("PERMITTED_USE_CERTAINTY", "Permitted-use certainty", 0.07, "BENEFIT", "GOVERNANCE_BLOCK"),
  criterion("ATTRIBUTION_BURDEN", "Attribution burden", 0.03, "BURDEN", "UNCERTAINTY_PENALTY"),
  criterion("TECHNICAL_ACCESS_CERTAINTY", "Technical-access certainty", 0.04, "BENEFIT", "GOVERNANCE_BLOCK"),
  criterion("CONTRACT_COMPLEXITY", "Contract complexity", 0.03, "BURDEN", "UNCERTAINTY_PENALTY"),
  criterion("COMMERCIAL_COST", "Commercial cost", 0.03, "BURDEN", "UNCERTAINTY_PENALTY"),
  criterion("IMPLEMENTATION_COMPLEXITY", "Implementation complexity", 0.03, "BURDEN", "UNCERTAINTY_PENALTY"),
  criterion("CONTINUITY_RISK", "Continuity risk", 0.03, "BURDEN", "UNCERTAINTY_PENALTY"),
  criterion("DEPENDENCY_RISK", "Dependency risk", 0.03, "BURDEN", "UNCERTAINTY_PENALTY"),
  criterion("OVERLAP_OR_REDUNDANCY", "Overlap or redundancy", 0.03, "BURDEN", "UNCERTAINTY_PENALTY"),
  criterion("UNIQUE_VALUE_CONTRIBUTION", "Unique-value contribution", 0.05, "BENEFIT", "UNCERTAINTY_PENALTY"),
  criterion("RESILIENCE_CONTRIBUTION", "Resilience contribution", 0.04, "BENEFIT", "UNCERTAINTY_PENALTY"),
  criterion("CURRENT_VERIFICATION_STATE", "Current verification state", 0.04, "BENEFIT", "GOVERNANCE_BLOCK"),
  criterion("PRIVACY_SECURITY_RISK", "Privacy and security risk", 0.03, "BURDEN", "UNCERTAINTY_PENALTY"),
  criterion("CUSTOMER_VALUE_POTENTIAL", "Customer-value potential", 0.03, "BENEFIT", "UNCERTAINTY_PENALTY"),
  criterion("EXPLAINABILITY", "Explainability", 0.03, "BENEFIT", "UNCERTAINTY_PENALTY"),
  criterion("AUDITABILITY", "Auditability", 0.05, "BENEFIT", "UNCERTAINTY_PENALTY"),
] as const);

export function assertGisSprint5WeightsNormalized(criteria: readonly GisProviderEvaluationCriterion[] = GIS_SPRINT_5_EVALUATION_CRITERIA): void {
  const total = Number(criteria.reduce((sum, item) => sum + item.weight, 0).toFixed(8));
  if (total !== 1) throw new Error(`GIS Sprint 5 weights must normalize to 1.0; received ${total}`);
}

export function scoreGisProviderCandidate(
  entry: GisProviderInventoryEntry,
  rawScores: Readonly<Record<GisProviderEvaluationCriterionId, number | "UNKNOWN">>,
): readonly GisProviderEvaluationScore[] {
  return Object.freeze(GIS_SPRINT_5_EVALUATION_CRITERIA.map((item) => {
    const rawScore = rawScores[item.criterionId];
    const normalizedScore = rawScore === "UNKNOWN" ? 20 : item.direction === "BURDEN" ? 100 - rawScore : rawScore;
    return Object.freeze({
      criterionId: item.criterionId,
      rawScore,
      normalizedScore,
      weight: item.weight,
      weightedContribution: Number((normalizedScore * item.weight).toFixed(4)),
      evidenceReference: `${entry.inventoryEntryId}:${item.criterionId}`,
    });
  }));
}

export function weightedScore(scores: readonly GisProviderEvaluationScore[]): number {
  return Number(scores.reduce((sum, item) => sum + item.weightedContribution, 0).toFixed(4));
}

export function dispositionFromGates(
  requested: GisProviderEvaluationDisposition,
  gates: readonly GisProviderEvaluationGate[],
  entry: GisProviderInventoryEntry,
): GisProviderEvaluationDisposition {
  if (gates.some((gate) => gate.state === "FAIL")) return requested === "REJECTED" ? "REJECTED" : "FAILED_CLOSED_MANDATORY_GATE";
  if (entry.providerRoles.includes("OPERATIONAL_TOOL")) return "OPERATIONAL_TOOL_ONLY";
  if (entry.providerRoles.includes("CONSUMER_PORTAL")) return "RESEARCH_REFERENCE_ONLY";
  if (gates.some((gate) => gate.gateId === "LICENSING_GATE" && gate.state === "UNKNOWN")) return requested === "SELECTED_FOR_CONTROLLED_PROVIDER_DUE_DILIGENCE" ? requested : "LICENSING_REVIEW_REQUIRED";
  if (gates.some((gate) => gate.gateId === "TECHNICAL_FEASIBILITY_GATE" && gate.state === "UNKNOWN")) return requested === "SELECTED_FOR_CONTROLLED_PROVIDER_DUE_DILIGENCE" ? requested : "TECHNICAL_REVIEW_REQUIRED";
  return requested;
}

export function rankGisProviderCandidates(candidates: readonly GisProviderCandidateEvaluation[]): readonly GisProviderCandidateEvaluation[] {
  return Object.freeze([...candidates]
    .sort((left, right) =>
      right.weightedScore - left.weightedScore
      || dispositionRank(left.disposition) - dispositionRank(right.disposition)
      || left.inventoryEntryId.localeCompare(right.inventoryEntryId),
    )
    .map((candidate, index) => Object.freeze({ ...candidate, rank: index + 1 })));
}

export function evaluationFingerprint(value: unknown): string {
  return stableGisEvidenceFingerprint({
    scoringModelId: GIS_SPRINT_5_SCORING_MODEL_ID,
    scoringModelVersion: GIS_SPRINT_5_SCORING_MODEL_VERSION,
    value,
  });
}

export const GIS_SPRINT_5_ZERO_AUTHORIZATION = GIS_FAIL_CLOSED_ACTIVATION;

function criterion(
  criterionId: GisProviderEvaluationCriterionId,
  label: string,
  weight: number,
  direction: GisProviderEvaluationCriterion["direction"],
  unknownTreatment: GisProviderEvaluationCriterion["unknownTreatment"],
): GisProviderEvaluationCriterion {
  return Object.freeze({ criterionId, label, weight, direction, unknownTreatment });
}

function dispositionRank(disposition: GisProviderEvaluationDisposition): number {
  if (disposition === "SELECTED_FOR_CONTROLLED_PROVIDER_DUE_DILIGENCE") return 0;
  if (disposition === "RETAINED_AS_SUPPLEMENTAL_CANDIDATE") return 1;
  if (disposition === "RETAINED_AS_FALLBACK_CANDIDATE") return 2;
  if (disposition.endsWith("_REVIEW_REQUIRED")) return 3;
  if (disposition === "DEFERRED") return 4;
  if (disposition === "INSUFFICIENT_EVIDENCE") return 5;
  if (disposition === "REJECTED" || disposition === "FAILED_CLOSED_MANDATORY_GATE") return 6;
  return 7;
}
