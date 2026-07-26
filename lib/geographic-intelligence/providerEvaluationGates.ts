import { type GisProviderEvaluationGate, type GisProviderEvaluationGateState } from "./providerEvaluationContract.js";
import { type GisProviderInventoryEntry } from "./providerInventoryContract.js";

export function buildGisProviderEvaluationGates(
  entry: GisProviderInventoryEntry,
  capabilityRelevant: boolean,
  coverageAligned: boolean,
  conflictState: "NONE_KNOWN" | "KNOWN_CONFLICT" | "UNKNOWN",
  manipulationGateFailure = false,
): readonly GisProviderEvaluationGate[] {
  return Object.freeze([
    gate("LICENSING_GATE", entry.licensingClassification === "UNKNOWN" ? "UNKNOWN" : entry.licensingClassification === "PROHIBITED" ? "FAIL" : "CONDITIONAL", "Licensing is retained from Sprint 3 inventory and is not externally verified."),
    gate("PERMITTED_USE_GATE", entry.permittedUse === "UNKNOWN" ? "UNKNOWN" : entry.permittedUse === "PROHIBITED" ? "FAIL" : "CONDITIONAL", "Permitted use is retained from Sprint 3 inventory and does not authorize acquisition or display."),
    gate("CAPABILITY_RELEVANCE_GATE", capabilityRelevant ? "PASS" : "FAIL", "Candidate must match the fixture capability requirement."),
    gate("GEOGRAPHIC_COVERAGE_GATE", coverageAligned ? "PASS" : "FAIL", "Coverage must match the fixture geography requirement without inference."),
    gate("VERIFICATION_GATE", entry.verificationState === "HISTORICAL_OR_POSSIBLY_STALE" ? "UNKNOWN" : entry.verificationState === "INVENTORY_DOCUMENT_ONLY" ? "CONDITIONAL" : "UNKNOWN", "Sprint 5 does not perform current external verification."),
    gate("LEGAL_REVIEW_GATE", entry.licensingClassification === "UNKNOWN" ? "UNKNOWN" : "CONDITIONAL", "Legal review remains unresolved and non-authorized."),
    gate("PRIVACY_SECURITY_GATE", manipulationGateFailure ? "FAIL" : "CONDITIONAL", "Privacy and security review is represented as a governance gate only."),
    gate("TECHNICAL_FEASIBILITY_GATE", entry.verificationState === "TECHNICALLY_VERIFIED" ? "PASS" : "UNKNOWN", "No live technical access is verified in Sprint 5."),
    gate("CONFLICT_OF_INTEREST_DISCLOSURE_GATE", conflictState === "UNKNOWN" ? "UNKNOWN" : conflictState === "KNOWN_CONFLICT" ? "FAIL" : "PASS", "Conflict-of-interest status must be represented and not assumed away."),
  ]);
}

export function mandatoryGateBlocksImplementation(gates: readonly GisProviderEvaluationGate[]): boolean {
  return gates.some((gate) => gate.state === "FAIL" || gate.state === "UNKNOWN");
}

function gate(gateId: GisProviderEvaluationGate["gateId"], state: GisProviderEvaluationGateState, rationale: string): GisProviderEvaluationGate {
  return Object.freeze({ gateId, state, rationale });
}
