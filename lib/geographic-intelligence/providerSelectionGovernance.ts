import { GIS_FAIL_CLOSED_ACTIVATION } from "./activationContract.js";
import { stableGisEvidenceFingerprint } from "./evidenceFingerprint.js";
import { buildGisSprint5MinimumProviderSet } from "./minimumProviderSet.js";
import { type GisProviderCandidateEvaluation, type GisProviderEvaluationRecord } from "./providerEvaluationContract.js";
import {
  GIS_SPRINT_5_EVALUATION_CRITERIA,
  assertGisSprint5WeightsNormalized,
  rankGisProviderCandidates,
} from "./providerEvaluationScoring.js";

export function buildGisSprint5ProviderEvaluationRecord(
  candidates: readonly GisProviderCandidateEvaluation[],
  capabilityRequirement: GisProviderEvaluationRecord["capabilityRequirement"],
): GisProviderEvaluationRecord {
  assertGisSprint5WeightsNormalized();
  const ranked = rankGisProviderCandidates(candidates);
  const minimumSet = buildGisSprint5MinimumProviderSet(capabilityRequirement.capabilityRequirementId, ranked);
  const fingerprintInput = {
    capabilityRequirement,
    candidates: ranked.map((candidate) => ({
      id: candidate.inventoryEntryId,
      score: candidate.weightedScore,
      rank: candidate.rank,
      disposition: candidate.disposition,
      gates: candidate.mandatoryGates,
    })),
    minimumSet,
  };
  return Object.freeze({
    evaluationId: `GIS-S5-EVALUATION-${stableGisEvidenceFingerprint(fingerprintInput).slice(0, 20)}`,
    evaluationVersion: "GIS_SPRINT_5_PROVIDER_EVALUATION_V1",
    capabilityRequirement,
    evaluationDate: "2026-07-26",
    evaluationEvidenceReferences: Object.freeze(["GIS Sprint 3 provider inventory", "GIS Sprint 5 deterministic fixture evaluations"]),
    evaluatorIdentity: "PROJECT_ATLAS_GIS_SPRINT_5_FIXTURE_GOVERNANCE",
    conflictOfInterestState: "UNKNOWN",
    scoringModelId: "GIS_SPRINT_5_PROVIDER_EVALUATION_SCORING_MODEL",
    scoringModelVersion: "1.0.0",
    criteria: GIS_SPRINT_5_EVALUATION_CRITERIA,
    candidateEvaluations: ranked,
    recommendedMinimumProviderSet: minimumSet,
    decisionRationale: "Evaluation is capability-bounded and due-diligence-only; unresolved gates block implementation readiness.",
    finalGovernanceDisposition: "PROVIDER_EVALUATION_ONLY",
    deterministicFingerprint: stableGisEvidenceFingerprint(fingerprintInput),
    internalOnly: true,
    activation: GIS_FAIL_CLOSED_ACTIVATION,
    customerDisplayAuthorized: false,
    redistributionAuthorized: false,
  });
}
