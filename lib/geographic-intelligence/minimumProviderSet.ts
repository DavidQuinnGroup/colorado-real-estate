import { GIS_FAIL_CLOSED_ACTIVATION } from "./activationContract.js";
import { evaluationFingerprint } from "./providerEvaluationScoring.js";
import { type GisProviderCandidateEvaluation, type GisProviderMinimumProviderSet } from "./providerEvaluationContract.js";

export function buildGisSprint5MinimumProviderSet(
  capabilityRequirementId: string,
  candidates: readonly GisProviderCandidateEvaluation[],
): GisProviderMinimumProviderSet {
  const selected = candidates.filter((candidate) =>
    candidate.disposition === "SELECTED_FOR_CONTROLLED_PROVIDER_DUE_DILIGENCE"
    || candidate.disposition === "RETAINED_AS_SUPPLEMENTAL_CANDIDATE"
    || candidate.disposition === "RETAINED_AS_FALLBACK_CANDIDATE",
  );
  const limitedSet = [...selected]
    .sort((left, right) => left.rank - right.rank || left.inventoryEntryId.localeCompare(right.inventoryEntryId))
    .slice(0, 4);
  return Object.freeze({
    setId: `GIS-S5-MINIMUM-SET-${evaluationFingerprint(limitedSet.map((candidate) => candidate.inventoryEntryId)).slice(0, 16)}`,
    classification: "PROPOSED_MINIMUM_PROVIDER_SET_FOR_DUE_DILIGENCE",
    capabilityRequirementId,
    candidateInventoryEntryIds: Object.freeze(limitedSet.map((candidate) => candidate.inventoryEntryId)),
    evidenceCategoriesCovered: Object.freeze([...new Set(limitedSet.flatMap((candidate) => candidate.evidenceCategoryRelevance))].sort()),
    overlapPreserved: limitedSet.some((candidate) => candidate.overlapReferences.length > 0),
    resilienceRationale: "Minimum set preserves one or more authority candidates plus fallback or supplemental candidates while retaining unresolved gates.",
    unresolvedGates: Object.freeze([...new Set(limitedSet.flatMap((candidate) =>
      candidate.mandatoryGates.filter((gate) => gate.state === "UNKNOWN" || gate.state === "CONDITIONAL").map((gate) => `${candidate.inventoryEntryId}:${gate.gateId}:${gate.state}`),
    ))].sort()),
    dueDiligenceOnly: true,
    providerUseAuthorized: false,
    activation: GIS_FAIL_CLOSED_ACTIVATION,
  });
}
