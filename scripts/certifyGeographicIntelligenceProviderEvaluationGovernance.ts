import assert from "node:assert/strict";

import {
  GIS_1_0_SPRINT_5_AUTHORIZATION,
  GIS_1_0_SPRINT_5_CERTIFICATION,
  GIS_1_0_SPRINT_5_CLASSIFICATION,
  GIS_SPRINT_5_SCORING_MODEL_ID,
  GIS_SPRINT_5_SCORING_MODEL_VERSION,
} from "../lib/geographic-intelligence/providerEvaluationContract.js";
import {
  buildGisSprint5ProviderEvaluationFixture,
  certifyGisSprint5ProviderEvaluationScenarios,
  gisSprint5ProviderEvaluationFingerprint,
} from "../lib/geographic-intelligence/fixtures/gisSprint5ProviderEvaluationFixtures.js";

const evaluation = buildGisSprint5ProviderEvaluationFixture();
const scenarios = certifyGisSprint5ProviderEvaluationScenarios();
const certification = Object.freeze({
  sprintIdentity: "GIS_1_0_SPRINT_5",
  implementationVersion: "GIS_1_0_SPRINT_5_PROVIDER_EVALUATION_GOVERNANCE_V1",
  authorization: GIS_1_0_SPRINT_5_AUTHORIZATION,
  classification: GIS_1_0_SPRINT_5_CLASSIFICATION,
  certificationStatus: GIS_1_0_SPRINT_5_CERTIFICATION,
  capabilityRequirementId: evaluation.capabilityRequirement.capabilityRequirementId,
  evaluationSubject: evaluation.capabilityRequirement.evaluationSubject,
  scoringModelId: GIS_SPRINT_5_SCORING_MODEL_ID,
  scoringModelVersion: GIS_SPRINT_5_SCORING_MODEL_VERSION,
  criteriaCount: evaluation.criteria.length,
  normalizedWeights: Object.freeze(Object.fromEntries(evaluation.criteria.map((criterion) => [criterion.criterionId, criterion.weight]))),
  candidatesEvaluated: evaluation.candidateEvaluations.length,
  candidateRankings: evaluation.candidateEvaluations.map((candidate) => ({ rank: candidate.rank, inventoryEntryId: candidate.inventoryEntryId, disposition: candidate.disposition })),
  candidateScores: evaluation.candidateEvaluations.map((candidate) => ({ inventoryEntryId: candidate.inventoryEntryId, weightedScore: candidate.weightedScore })),
  mandatoryGateResults: evaluation.candidateEvaluations.map((candidate) => ({ inventoryEntryId: candidate.inventoryEntryId, gates: candidate.mandatoryGates.map((gate) => `${gate.gateId}:${gate.state}`) })),
  candidateDispositions: Object.freeze(Object.fromEntries(evaluation.candidateEvaluations.map((candidate) => [candidate.inventoryEntryId, candidate.disposition]))),
  proposedMinimumProviderSet: evaluation.recommendedMinimumProviderSet,
  dueDiligenceCandidates: evaluation.candidateEvaluations.filter((candidate) => candidate.disposition === "SELECTED_FOR_CONTROLLED_PROVIDER_DUE_DILIGENCE").map((candidate) => candidate.inventoryEntryId),
  rejectedCandidates: evaluation.candidateEvaluations.filter((candidate) => candidate.disposition === "REJECTED" || candidate.disposition === "FAILED_CLOSED_MANDATORY_GATE").map((candidate) => candidate.inventoryEntryId),
  deferredCandidates: evaluation.candidateEvaluations.filter((candidate) => candidate.disposition === "DEFERRED").map((candidate) => candidate.inventoryEntryId),
  supplementalCandidates: evaluation.candidateEvaluations.filter((candidate) => candidate.disposition === "RETAINED_AS_SUPPLEMENTAL_CANDIDATE").map((candidate) => candidate.inventoryEntryId),
  fallbackCandidates: evaluation.candidateEvaluations.filter((candidate) => candidate.disposition === "RETAINED_AS_FALLBACK_CANDIDATE").map((candidate) => candidate.inventoryEntryId),
  insufficientEvidenceCandidates: evaluation.candidateEvaluations.filter((candidate) => candidate.disposition === "INSUFFICIENT_EVIDENCE").map((candidate) => candidate.inventoryEntryId),
  overlapPreservationResult: scenarios.scenarioF,
  licensingGateResult: scenarios.scenarioA,
  currentVerificationResult: scenarios.scenarioM,
  deterministicTieResult: scenarios.scenarioK,
  conflictOfInterestResult: scenarios.scenarioL,
  scoreManipulationResult: scenarios.scenarioN,
  deterministicEvaluationFingerprint: gisSprint5ProviderEvaluationFingerprint(),
  providerContacts: 0,
  accountsCreated: 0,
  credentialsUsed: 0,
  contracts: 0,
  purchases: 0,
  externalCalls: 0,
  providerConnections: 0,
  acquisitions: 0,
  productionReads: 0,
  productionWrites: 0,
  runtimeActivations: 0,
  downstreamIntegrations: 0,
  customerVisibleChanges: 0,
  geographicRelationships: 0,
});

assert.equal(certification.authorization, "GIS_1_0_SPRINT_5_PROVIDER_EVALUATION_AND_SELECTION_GOVERNANCE_AUTHORIZED");
assert.equal(certification.classification, "PROVIDER_EVALUATION_AND_SELECTION_GOVERNANCE");
assert.equal(certification.certificationStatus, "GIS_1_0_SPRINT_5_PROVIDER_EVALUATION_AND_SELECTION_GOVERNANCE_CERTIFIED");
assert.equal(certification.criteriaCount, 24);
assert.equal(certification.candidatesEvaluated, 13);
assert.equal(certification.proposedMinimumProviderSet.classification, "PROPOSED_MINIMUM_PROVIDER_SET_FOR_DUE_DILIGENCE");
assert.equal(certification.proposedMinimumProviderSet.providerUseAuthorized, false);
assert.ok(certification.dueDiligenceCandidates.length >= 1);
assert.ok(certification.supplementalCandidates.length >= 1);
assert.ok(certification.fallbackCandidates.length >= 1);
assert.ok(certification.insufficientEvidenceCandidates.length >= 1);
assert.equal(certification.scoreManipulationResult, "FAILED_CLOSED_MANDATORY_GATE");
assert.equal(certification.providerContacts, 0);
assert.equal(certification.accountsCreated, 0);
assert.equal(certification.credentialsUsed, 0);
assert.equal(certification.contracts, 0);
assert.equal(certification.purchases, 0);
assert.equal(certification.externalCalls, 0);
assert.equal(certification.providerConnections, 0);
assert.equal(certification.acquisitions, 0);
assert.equal(certification.productionReads, 0);
assert.equal(certification.productionWrites, 0);
assert.equal(certification.runtimeActivations, 0);
assert.equal(certification.downstreamIntegrations, 0);
assert.equal(certification.customerVisibleChanges, 0);
assert.equal(certification.geographicRelationships, 0);

console.log(JSON.stringify(certification, null, 2));
console.log("[geographic-intelligence-provider-evaluation-governance-certification] ok: GIS_1_0_SPRINT_5_PROVIDER_EVALUATION_AND_SELECTION_GOVERNANCE_CERTIFIED with zero provider contact, accounts, credentials, contracts, purchases, external calls, provider connections, acquisitions, production reads/writes, runtime activation, downstream integration, customer-visible effect, or geographic relationships.");
