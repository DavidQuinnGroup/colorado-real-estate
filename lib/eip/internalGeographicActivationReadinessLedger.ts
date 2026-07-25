import {
  createEipSprint2InternalGeographicReadModel,
  type EipSprint2InternalGeographicView,
} from "./internalGeographicReadModel.js";
import {
  assessEnterpriseKnowledgeQuality,
  qualityInputFromGeographicView,
  type EnterpriseKnowledgeQualityAssessment,
  type EnterpriseKnowledgeQualityStatus,
} from "./enterpriseKnowledgeQualityEngine.js";

export const EIP_SPRINT_4_LEDGER_VERSION = "EIP_1.0_SPRINT_4_INTERNAL_GEOGRAPHIC_ACTIVATION_READINESS_LEDGER_V1";
export const EIP_SPRINT_4_EVALUATION_TIMESTAMP = "2026-07-25T00:00:00.000Z";

export type EipSprint4ActivationGate =
  | "INTERNAL_DEVELOPMENT_PERSISTENCE"
  | "INTERNAL_RETRIEVAL"
  | "INTERNAL_MAPPING"
  | "PRODUCTION_INTERNAL_ONLY_PERSISTENCE"
  | "PROPERTY_RELATIONSHIP"
  | "SEARCH"
  | "MAP"
  | "PUBLIC_PAGE"
  | "INDEXING"
  | "MARKET_ANALYTICS"
  | "CUSTOMER_PRESENTATION"
  | "AI_ASSISTED_SYNTHESIS";

export type EipSprint4GateStatus =
  | "NOT_EVALUATED"
  | "EVIDENCE_INCOMPLETE"
  | "BLOCKED"
  | "NEEDS_REVIEW"
  | "READY_FOR_INTERNAL_PROOF"
  | "INTERNAL_PROOF_COMPLETE"
  | "READY_FOR_EXECUTIVE_REVIEW"
  | "NOT_AUTHORIZED"
  | "REJECTED"
  | "SUPERSEDED";

export type EipSprint4AuthorizationStatus = "NOT_AUTHORIZED";
export type EipSprint4ReadinessFlag = "READY" | "WARNING" | "FAILED";

export type EipSprint4ReadinessRequirement = Readonly<{
  category:
    | "IDENTITY"
    | "SOURCE_AND_TRUST"
    | "FRESHNESS"
    | "CONFLICT"
    | "HUMAN_REVIEW"
    | "GOVERNANCE"
    | "TECHNICAL_SAFETY";
  requirement: string;
  passed: boolean;
  flag: EipSprint4ReadinessFlag;
  evidence: string;
}>;

export type EipSprint4LedgerEntry = Readonly<{
  ledgerEntryId: string;
  knowledgeObjectId: string;
  objectType: EipSprint2InternalGeographicView["identity"]["objectType"];
  canonicalName: string;
  gate: EipSprint4ActivationGate;
  qualityEngineResult: EnterpriseKnowledgeQualityStatus;
  gateStatus: EipSprint4GateStatus;
  technicallyReady: boolean;
  governanceReady: boolean;
  authorized: false;
  active: false;
  requirementsEvaluated: readonly EipSprint4ReadinessRequirement[];
  requirementsPassed: readonly string[];
  requirementsFailed: readonly string[];
  blockingConditions: readonly string[];
  warnings: readonly string[];
  supportingEvidenceReferences: readonly string[];
  sourceStatus: "SOURCE_PRESENT" | "SOURCE_MISSING" | "SOURCE_RESTRICTED" | "SOURCE_REQUIRES_AUTHORITY_REVIEW";
  freshnessStatus: EipSprint2InternalGeographicView["trust"]["freshness"];
  conflictStatus: "NO_CONFLICT" | "CONFLICT_PRESENT" | "DUPLICATE_CANDIDATE" | "AMBIGUITY_PRESENT";
  reviewStatus: EipSprint2InternalGeographicView["governance"]["reviewStatus"];
  editorialSeparationStatus: "PASS" | "EDITORIAL_ONLY_BLOCKED";
  authorizationStatus: EipSprint4AuthorizationStatus;
  authorizingAuthorityRequired: "EXECUTIVE_AUTHORIZATION_REQUIRED";
  nextPermittedAction: string;
  prohibitedActions: readonly string[];
  deterministicEvaluationTimestamp: typeof EIP_SPRINT_4_EVALUATION_TIMESTAMP;
  ledgerVersion: typeof EIP_SPRINT_4_LEDGER_VERSION;
}>;

export type EipSprint4ObjectSummary = Readonly<{
  knowledgeObjectId: string;
  canonicalName: string;
  objectType: EipSprint2InternalGeographicView["identity"]["objectType"];
  technicallyReadyGateCount: number;
  governanceReadyGateCount: number;
  authorizedGateCount: 0;
  activeGateCount: 0;
  strongestPermittedStatus: EipSprint4GateStatus;
  primaryBlockingCondition: string;
  requiredExecutiveDecision: string;
}>;

export type EipSprint4GateSummary = Readonly<{
  gate: EipSprint4ActivationGate;
  totalEntries: number;
  technicallyReadyCount: number;
  governanceReadyCount: number;
  authorizedCount: 0;
  activeCount: 0;
  byStatus: Readonly<Record<string, number>>;
  requiredExecutiveDecision: string;
}>;

export type EipSprint4ReadinessLedger = Readonly<{
  entries: readonly EipSprint4LedgerEntry[];
  objectSummaries: readonly EipSprint4ObjectSummary[];
  gateSummaries: readonly EipSprint4GateSummary[];
  statusSummaries: readonly { status: EipSprint4GateStatus; count: number }[];
  history: readonly {
    ledgerVersion: typeof EIP_SPRINT_4_LEDGER_VERSION;
    deterministicEvaluationTimestamp: typeof EIP_SPRINT_4_EVALUATION_TIMESTAMP;
    entryCount: number;
    sourceReadModelVersion: string;
    sourceQualityEngineVersion: string;
  }[];
}>;

export const EIP_SPRINT_4_ACTIVATION_GATES: readonly EipSprint4ActivationGate[] = Object.freeze([
  "INTERNAL_DEVELOPMENT_PERSISTENCE",
  "INTERNAL_RETRIEVAL",
  "INTERNAL_MAPPING",
  "PRODUCTION_INTERNAL_ONLY_PERSISTENCE",
  "PROPERTY_RELATIONSHIP",
  "SEARCH",
  "MAP",
  "PUBLIC_PAGE",
  "INDEXING",
  "MARKET_ANALYTICS",
  "CUSTOMER_PRESENTATION",
  "AI_ASSISTED_SYNTHESIS",
]);

const internalProofGates = new Set<EipSprint4ActivationGate>([
  "INTERNAL_DEVELOPMENT_PERSISTENCE",
  "INTERNAL_RETRIEVAL",
  "INTERNAL_MAPPING",
]);

const customerFacingGates = new Set<EipSprint4ActivationGate>([
  "PROPERTY_RELATIONSHIP",
  "SEARCH",
  "MAP",
  "PUBLIC_PAGE",
  "INDEXING",
  "MARKET_ANALYTICS",
  "CUSTOMER_PRESENTATION",
  "AI_ASSISTED_SYNTHESIS",
]);

const prohibitedActions = Object.freeze([
  "DO_NOT_CREATE_GIO_ROWS",
  "DO_NOT_CREATE_PROPERTY_RELATIONSHIPS",
  "DO_NOT_EXPOSE_SEARCH",
  "DO_NOT_EXPOSE_MAPS",
  "DO_NOT_CREATE_PUBLIC_PAGES",
  "DO_NOT_INDEX",
  "DO_NOT_PRESENT_TO_CUSTOMERS",
  "DO_NOT_ACTIVATE_AI_SYNTHESIS",
]);

export function createEipSprint4InternalGeographicActivationReadinessLedger(
  views: readonly EipSprint2InternalGeographicView[] = createEipSprint2InternalGeographicReadModel().listAll(),
): EipSprint4ReadinessLedger {
  const entries = Object.freeze(views.flatMap((view) => {
    const quality = assessEnterpriseKnowledgeQuality(qualityInputFromGeographicView(view));
    return EIP_SPRINT_4_ACTIVATION_GATES.map((gate) => createLedgerEntry(view, quality, gate));
  }));

  return Object.freeze({
    entries,
    objectSummaries: summarizeByObject(entries),
    gateSummaries: summarizeByGate(entries),
    statusSummaries: summarizeByStatus(entries),
    history: Object.freeze([
      Object.freeze({
        ledgerVersion: EIP_SPRINT_4_LEDGER_VERSION,
        deterministicEvaluationTimestamp: EIP_SPRINT_4_EVALUATION_TIMESTAMP,
        entryCount: entries.length,
        sourceReadModelVersion: views[0]?.metadata.internalVersion ?? "NO_SOURCE_RECORDS",
        sourceQualityEngineVersion: entries[0]?.supportingEvidenceReferences.find((item) => item.startsWith("quality:")) ?? "NO_QUALITY_ASSESSMENT",
      }),
    ]),
  });
}

export function validateEipSprint4LedgerEntry(entry: EipSprint4LedgerEntry): void {
  if (entry.ledgerVersion !== EIP_SPRINT_4_LEDGER_VERSION) throw new Error("Unsupported Sprint 4 ledger version");
  if (entry.deterministicEvaluationTimestamp !== EIP_SPRINT_4_EVALUATION_TIMESTAMP) throw new Error("Sprint 4 ledger timestamp must be deterministic");
  if (entry.authorized !== false || entry.authorizationStatus !== "NOT_AUTHORIZED") throw new Error("Sprint 4 ledger cannot authorize activation");
  if (entry.active !== false) throw new Error("Sprint 4 ledger cannot activate any capability");
  if (entry.gateStatus === "READY_FOR_EXECUTIVE_REVIEW" && entry.authorized !== false) throw new Error("Executive-review readiness cannot grant authorization");
  if (entry.qualityEngineResult === "READY" && entry.authorizationStatus !== "NOT_AUTHORIZED") throw new Error("Quality READY cannot grant authorization");
  if (customerFacingGates.has(entry.gate) && entry.gateStatus === "INTERNAL_PROOF_COMPLETE") throw new Error("Customer-facing gates cannot be completed in Sprint 4");
}

function createLedgerEntry(
  view: EipSprint2InternalGeographicView,
  quality: EnterpriseKnowledgeQualityAssessment,
  gate: EipSprint4ActivationGate,
): EipSprint4LedgerEntry {
  const requirements = Object.freeze(requirementsFor(view, quality, gate));
  const failed = Object.freeze(requirements.filter((item) => !item.passed).map((item) => `${item.category}:${item.requirement}`));
  const warnings = Object.freeze(requirements.filter((item) => item.flag === "WARNING").map((item) => `${item.category}:${item.requirement}`));
  const blockers = Object.freeze(blockingConditionsFor(view, quality, gate, failed));
  const gateStatus = gateStatusFor(view, quality, gate, blockers, warnings);
  const technicallyReady = blockers.length === 0 && quality.overallInternalStatus === "READY";
  const governanceReady = technicallyReady && internalProofGates.has(gate) && gateStatus === "INTERNAL_PROOF_COMPLETE";

  const entry: EipSprint4LedgerEntry = {
    ledgerEntryId: `EIP_SPRINT_4_LEDGER|${view.identity.id}|${gate}`,
    knowledgeObjectId: view.identity.id,
    objectType: view.identity.objectType,
    canonicalName: view.identity.canonicalName,
    gate,
    qualityEngineResult: quality.overallInternalStatus,
    gateStatus,
    technicallyReady,
    governanceReady,
    authorized: false as const,
    active: false as const,
    requirementsEvaluated: requirements,
    requirementsPassed: Object.freeze(requirements.filter((item) => item.passed).map((item) => `${item.category}:${item.requirement}`)),
    requirementsFailed: failed,
    blockingConditions: blockers,
    warnings,
    supportingEvidenceReferences: Object.freeze([
      `read-model:${view.metadata.internalVersion}`,
      `quality:${quality.metadata.engineVersion}`,
      `source-decision:${view.metadata.sourceDecisionId}`,
      `source-queue-item:${view.metadata.sourceQueueItemId}`,
      `source-preview-record:${view.metadata.sourcePreviewRecordId}`,
    ]),
    sourceStatus: sourceStatusFor(view),
    freshnessStatus: view.trust.freshness,
    conflictStatus: conflictStatusFor(view),
    reviewStatus: view.governance.reviewStatus,
    editorialSeparationStatus: view.classification.knowledgeClassification === "EDITORIAL_KNOWLEDGE" ? "EDITORIAL_ONLY_BLOCKED" as const : "PASS" as const,
    authorizationStatus: "NOT_AUTHORIZED" as const,
    authorizingAuthorityRequired: "EXECUTIVE_AUTHORIZATION_REQUIRED" as const,
    nextPermittedAction: nextPermittedActionFor(gateStatus, gate),
    prohibitedActions,
    deterministicEvaluationTimestamp: EIP_SPRINT_4_EVALUATION_TIMESTAMP,
    ledgerVersion: EIP_SPRINT_4_LEDGER_VERSION,
  };

  validateEipSprint4LedgerEntry(entry);
  return Object.freeze(entry);
}

function requirementsFor(
  view: EipSprint2InternalGeographicView,
  quality: EnterpriseKnowledgeQualityAssessment,
  gate: EipSprint4ActivationGate,
): readonly EipSprint4ReadinessRequirement[] {
  const hasAmbiguity = hasRelatedValue(view, "ambiguity:");
  const hasConflict = hasRelatedValue(view, "conflict:");
  const duplicateCandidate = view.governance.mappingEligibility === "DUPLICATE_CANDIDATE_ONLY";
  const sourcePresent = Boolean(view.source.sourceAsset && view.source.repositoryLocation && view.source.sourceValue);
  const permittedSource = view.trust.authority !== "REQUIRES_AUTHORITY_REVIEW";
  const humanReviewComplete = view.governance.reviewStatus === "APPROVED_AS_PREVIEW_CANDIDATE" || view.governance.reviewStatus === "APPROVED_AS_ALIAS_CANDIDATE";
  const materialFactGate = gate !== "INTERNAL_DEVELOPMENT_PERSISTENCE" && gate !== "INTERNAL_RETRIEVAL";
  const customerGate = customerFacingGates.has(gate);

  return Object.freeze([
    requirement("IDENTITY", "canonical identity certainty", quality.identityQuality.status !== "INCOMPLETE", "Canonical identity preserved by Sprint 2 read model."),
    requirement("IDENTITY", "object-type certainty", !hasAmbiguity, `Object-type ambiguity: ${hasAmbiguity ? "present" : "none"}.`),
    requirement("IDENTITY", "alias ambiguity", !hasAmbiguity && view.governance.mappingEligibility !== "ALIAS_CANDIDATE_ONLY", `Mapping eligibility: ${view.governance.mappingEligibility}.`, view.governance.mappingEligibility === "ALIAS_CANDIDATE_ONLY" ? "WARNING" : undefined),
    requirement("IDENTITY", "duplicate status", !duplicateCandidate, `Duplicate candidate: ${duplicateCandidate}.`),
    requirement("SOURCE_AND_TRUST", "source present", sourcePresent, `Source asset: ${view.source.sourceAsset}.`),
    requirement("SOURCE_AND_TRUST", "permitted source class", permittedSource || !materialFactGate, `Authority: ${view.trust.authority}.`),
    requirement("SOURCE_AND_TRUST", "authority", view.trust.authority === "INTERNAL_PROOF_ONLY" || !materialFactGate, `Authority: ${view.trust.authority}.`),
    requirement("SOURCE_AND_TRUST", "license state", view.classification.knowledgeClassification !== "RESTRICTED_KNOWLEDGE" || !customerGate, `Classification: ${view.classification.knowledgeClassification}.`),
    requirement("SOURCE_AND_TRUST", "confidence", view.trust.confidence !== "INSUFFICIENT" && view.trust.confidence !== "LOW" || !customerGate, `Confidence: ${view.trust.confidence}.`, view.trust.confidence === "LOW" ? "WARNING" : undefined),
    requirement("SOURCE_AND_TRUST", "evidence sufficiency", quality.trustQuality.status !== "INSUFFICIENT_SOURCE", `Quality status: ${quality.trustQuality.status}.`),
    requirement("FRESHNESS", "effective date", view.trust.freshness !== "UNKNOWN" || !materialFactGate, `Freshness: ${view.trust.freshness}.`),
    requirement("FRESHNESS", "verification date", view.trust.freshness !== "STALE", `Freshness: ${view.trust.freshness}.`),
    requirement("FRESHNESS", "freshness state", quality.freshnessQuality.status !== "STALE", `Quality status: ${quality.freshnessQuality.status}.`, view.trust.freshness === "AGING" || view.trust.freshness === "UNKNOWN" ? "WARNING" : undefined),
    requirement("FRESHNESS", "review-due state", quality.freshnessQuality.status === "READY" || !customerGate, `Quality status: ${quality.freshnessQuality.status}.`, quality.freshnessQuality.status === "READY_WITH_WARNINGS" ? "WARNING" : undefined),
    requirement("CONFLICT", "unresolved conflicts", !hasConflict || !customerGate, `Conflict: ${hasConflict ? "present" : "none"}.`),
    requirement("CONFLICT", "duplicate candidates", !duplicateCandidate || !customerGate, `Duplicate candidate: ${duplicateCandidate}.`),
    requirement("CONFLICT", "preserved competing evidence", !hasConflict || gate === "INTERNAL_RETRIEVAL", `Conflict preservation: ${hasConflict ? "required" : "not required"}.`, hasConflict ? "WARNING" : undefined),
    requirement("CONFLICT", "ambiguity", !hasAmbiguity || !customerGate, `Ambiguity: ${hasAmbiguity ? "present" : "none"}.`),
    requirement("HUMAN_REVIEW", "required review completed", humanReviewComplete || !customerGate, `Review status: ${view.governance.reviewStatus}.`),
    requirement("HUMAN_REVIEW", "reviewer role", Boolean(view.metadata.sourceDecisionId), `Decision: ${view.metadata.sourceDecisionId}.`),
    requirement("HUMAN_REVIEW", "rationale", Boolean(view.source.sourceRequirementResult), view.source.sourceRequirementResult),
    requirement("HUMAN_REVIEW", "escalation state", view.governance.reviewStatus !== "ESCALATED" || gate === "INTERNAL_RETRIEVAL", `Review status: ${view.governance.reviewStatus}.`),
    requirement("GOVERNANCE", "lifecycle", view.governance.lifecycle === "INTERNAL_PROOF_ONLY", `Lifecycle: ${view.governance.lifecycle}.`),
    requirement("GOVERNANCE", "classification", view.classification.knowledgeClassification !== "EDITORIAL_KNOWLEDGE" || !materialFactGate, `Classification: ${view.classification.knowledgeClassification}.`),
    requirement("GOVERNANCE", "Editorial Separation compliance", view.governance.editorialSeparationEnforced && view.classification.knowledgeClassification !== "EDITORIAL_KNOWLEDGE" || !materialFactGate, `Editorial status: ${view.classification.knowledgeClassification}.`),
    requirement("GOVERNANCE", "eligibility defaults", !view.governance.eligibility.customerEligible && !view.governance.eligibility.searchEligible && !view.governance.eligibility.mapEligible && !view.governance.eligibility.publicPageEligible && !view.governance.eligibility.indexingEligible, "All customer/runtime eligibility defaults remain false."),
    requirement("GOVERNANCE", "activation approval", false, "No Sprint 4 executive activation approval exists."),
    requirement("TECHNICAL_SAFETY", "internal-only contract", view.governance.restrictedKnowledgeInternalOnly && view.governance.noCustomerRetrievalPath, "Read model remains internal-only."),
    requirement("TECHNICAL_SAFETY", "runtime isolation", view.governance.noRuntimeActivation, "No runtime activation flag is present."),
    requirement("TECHNICAL_SAFETY", "rollback or reversibility", true, "Ledger is deterministic and repository-local."),
    requirement("TECHNICAL_SAFETY", "deterministic retrieval", view.metadata.retrievalStatus === "FOUND", `Retrieval status: ${view.metadata.retrievalStatus}.`),
    requirement("TECHNICAL_SAFETY", "no customer visibility", view.governance.noSearchVisibility && view.governance.noMapVisibility && view.governance.noSeoVisibility && view.governance.noPageVisibility, "Search/map/page/SEO visibility remain false."),
  ]);
}

function requirement(
  category: EipSprint4ReadinessRequirement["category"],
  requirementName: string,
  passed: boolean,
  evidence: string,
  warningWhenPassed?: "WARNING",
): EipSprint4ReadinessRequirement {
  return Object.freeze({
    category,
    requirement: requirementName,
    passed,
    flag: passed ? warningWhenPassed ?? "READY" : "FAILED",
    evidence,
  });
}

function blockingConditionsFor(
  view: EipSprint2InternalGeographicView,
  quality: EnterpriseKnowledgeQualityAssessment,
  gate: EipSprint4ActivationGate,
  failedRequirements: readonly string[],
): readonly string[] {
  const blockers = new Set<string>();
  if (failedRequirements.length > 0) blockers.add("READINESS_REQUIREMENTS_FAILED");
  if (quality.overallInternalStatus === "INSUFFICIENT_SOURCE") blockers.add("MISSING_OR_INSUFFICIENT_SOURCE");
  if (
    view.trust.authority === "REQUIRES_AUTHORITY_REVIEW" &&
    view.governance.reviewStatus !== "ESCALATED" &&
    gate !== "INTERNAL_DEVELOPMENT_PERSISTENCE" &&
    gate !== "INTERNAL_RETRIEVAL"
  ) {
    blockers.add("MISSING_OR_INSUFFICIENT_SOURCE");
  }
  if (quality.overallInternalStatus === "CONFLICT_PRESENT") {
    if (view.governance.mappingEligibility === "DUPLICATE_CANDIDATE_ONLY" || hasRelatedValue(view, "conflict:")) {
      blockers.add("CONFLICT_OR_DUPLICATE_PRESENT");
    } else if (hasRelatedValue(view, "ambiguity:")) {
      blockers.add("AMBIGUOUS_MAPPING_REQUIRES_REVIEW");
    }
  }
  if (quality.overallInternalStatus === "STALE") blockers.add("STALE_KNOWLEDGE");
  if (quality.overallInternalStatus === "INCOMPLETE") blockers.add("INCOMPLETE_KNOWLEDGE");
  if (quality.overallInternalStatus === "NEEDS_REVIEW") blockers.add("HUMAN_REVIEW_REQUIRED");
  if (view.classification.knowledgeClassification === "EDITORIAL_KNOWLEDGE" && gate !== "INTERNAL_RETRIEVAL") blockers.add("EDITORIAL_ONLY_BLOCKED_FROM_FACTUAL_ACTIVATION");
  if (view.classification.knowledgeClassification === "RESTRICTED_KNOWLEDGE" && customerFacingGates.has(gate)) blockers.add("RESTRICTED_KNOWLEDGE_NOT_PUBLICLY_ELIGIBLE");
  if (view.governance.mappingEligibility === "DUPLICATE_CANDIDATE_ONLY" && gate !== "INTERNAL_RETRIEVAL") blockers.add("DUPLICATE_CANDIDATE_CANNOT_BECOME_CANONICAL");
  if (hasRelatedValue(view, "ambiguity:") && customerFacingGates.has(gate)) blockers.add("AMBIGUOUS_MAPPING_REQUIRES_REVIEW");
  if (!internalProofGates.has(gate)) blockers.add("EXPLICIT_EXECUTIVE_AUTHORIZATION_REQUIRED");
  return Object.freeze([...blockers].sort());
}

function gateStatusFor(
  view: EipSprint2InternalGeographicView,
  quality: EnterpriseKnowledgeQualityAssessment,
  gate: EipSprint4ActivationGate,
  blockers: readonly string[],
  warnings: readonly string[],
): EipSprint4GateStatus {
  if (gate === "INTERNAL_DEVELOPMENT_PERSISTENCE" || gate === "INTERNAL_RETRIEVAL") return "INTERNAL_PROOF_COMPLETE";
  if (quality.overallInternalStatus === "READY" && !internalProofGates.has(gate)) return "READY_FOR_EXECUTIVE_REVIEW";
  if (internalProofGates.has(gate) && gate !== "INTERNAL_MAPPING" && quality.overallInternalStatus === "READY") return "INTERNAL_PROOF_COMPLETE";
  if (gate === "INTERNAL_MAPPING" && quality.overallInternalStatus === "READY") return "READY_FOR_INTERNAL_PROOF";
  if (blockers.some((item) => item.includes("SOURCE"))) return "EVIDENCE_INCOMPLETE";
  if (blockers.some((item) => item.includes("CONFLICT") || item.includes("DUPLICATE") || item.includes("RESTRICTED") || item.includes("EDITORIAL"))) return "BLOCKED";
  if (blockers.some((item) => item.includes("AMBIGUOUS")) || view.governance.reviewStatus === "ESCALATED") return "NEEDS_REVIEW";
  if (blockers.some((item) => item.includes("REVIEW"))) return "NEEDS_REVIEW";
  if (warnings.length > 0) return "NEEDS_REVIEW";
  return "NOT_AUTHORIZED";
}

function sourceStatusFor(view: EipSprint2InternalGeographicView): EipSprint4LedgerEntry["sourceStatus"] {
  if (!view.source.sourceAsset || !view.source.repositoryLocation || !view.source.sourceValue) return "SOURCE_MISSING";
  if (view.classification.knowledgeClassification === "RESTRICTED_KNOWLEDGE") return "SOURCE_RESTRICTED";
  if (view.trust.authority === "REQUIRES_AUTHORITY_REVIEW") return "SOURCE_REQUIRES_AUTHORITY_REVIEW";
  return "SOURCE_PRESENT";
}

function conflictStatusFor(view: EipSprint2InternalGeographicView): EipSprint4LedgerEntry["conflictStatus"] {
  if (view.governance.mappingEligibility === "DUPLICATE_CANDIDATE_ONLY") return "DUPLICATE_CANDIDATE";
  if (hasRelatedValue(view, "conflict:")) return "CONFLICT_PRESENT";
  if (hasRelatedValue(view, "ambiguity:")) return "AMBIGUITY_PRESENT";
  return "NO_CONFLICT";
}

function nextPermittedActionFor(status: EipSprint4GateStatus, gate: EipSprint4ActivationGate): string {
  if (status === "INTERNAL_PROOF_COMPLETE") return "Record internal proof completion; do not activate production or customer runtime.";
  if (status === "READY_FOR_INTERNAL_PROOF") return "Prepare a separate internal proof authorization package.";
  if (status === "READY_FOR_EXECUTIVE_REVIEW") return `Prepare executive review for ${gate}; authorization remains absent.`;
  if (status === "EVIDENCE_INCOMPLETE") return "Collect required source, trust, or freshness evidence before further gate review.";
  if (status === "NEEDS_REVIEW") return "Complete human governance review before any additional gate.";
  if (status === "BLOCKED") return "Resolve blocking governance, conflict, duplicate, editorial, or restricted condition.";
  return "No activation action permitted.";
}

function summarizeByObject(entries: readonly EipSprint4LedgerEntry[]): readonly EipSprint4ObjectSummary[] {
  const byObject = new Map<string, readonly EipSprint4LedgerEntry[]>();
  for (const entry of entries) byObject.set(entry.knowledgeObjectId, [...(byObject.get(entry.knowledgeObjectId) ?? []), entry]);
  return Object.freeze([...byObject.entries()].map(([, objectEntries]) => {
    const first = objectEntries[0];
    const blockers = objectEntries.flatMap((entry) => entry.blockingConditions);
    return Object.freeze({
      knowledgeObjectId: first.knowledgeObjectId,
      canonicalName: first.canonicalName,
      objectType: first.objectType,
      technicallyReadyGateCount: objectEntries.filter((entry) => entry.technicallyReady).length,
      governanceReadyGateCount: objectEntries.filter((entry) => entry.governanceReady).length,
      authorizedGateCount: 0 as const,
      activeGateCount: 0 as const,
      strongestPermittedStatus: strongestStatus(objectEntries),
      primaryBlockingCondition: blockers[0] ?? "EXPLICIT_EXECUTIVE_AUTHORIZATION_REQUIRED",
      requiredExecutiveDecision: "Separate executive authorization required before production, customer, runtime, or AI activation.",
    });
  }).sort((left, right) => left.knowledgeObjectId.localeCompare(right.knowledgeObjectId)));
}

function summarizeByGate(entries: readonly EipSprint4LedgerEntry[]): readonly EipSprint4GateSummary[] {
  return Object.freeze(EIP_SPRINT_4_ACTIVATION_GATES.map((gate) => {
    const gateEntries = entries.filter((entry) => entry.gate === gate);
    return Object.freeze({
      gate,
      totalEntries: gateEntries.length,
      technicallyReadyCount: gateEntries.filter((entry) => entry.technicallyReady).length,
      governanceReadyCount: gateEntries.filter((entry) => entry.governanceReady).length,
      authorizedCount: 0 as const,
      activeCount: 0 as const,
      byStatus: countBy(gateEntries, (entry) => entry.gateStatus),
      requiredExecutiveDecision: internalProofGates.has(gate)
        ? "Internal proof accounting only; no production or customer activation."
        : "Explicit executive activation authorization required.",
    });
  }));
}

function summarizeByStatus(entries: readonly EipSprint4LedgerEntry[]) {
  return Object.freeze(Object.entries(countBy(entries, (entry) => entry.gateStatus))
    .map(([status, count]) => Object.freeze({ status: status as EipSprint4GateStatus, count }))
    .sort((left, right) => left.status.localeCompare(right.status)));
}

function strongestStatus(entries: readonly EipSprint4LedgerEntry[]): EipSprint4GateStatus {
  const order: readonly EipSprint4GateStatus[] = [
    "INTERNAL_PROOF_COMPLETE",
    "READY_FOR_INTERNAL_PROOF",
    "READY_FOR_EXECUTIVE_REVIEW",
    "NEEDS_REVIEW",
    "NOT_AUTHORIZED",
    "EVIDENCE_INCOMPLETE",
    "BLOCKED",
    "REJECTED",
    "SUPERSEDED",
    "NOT_EVALUATED",
  ];
  return order.find((status) => entries.some((entry) => entry.gateStatus === status)) ?? "NOT_EVALUATED";
}

function countBy<T>(items: readonly T[], keyFor: (item: T) => string): Readonly<Record<string, number>> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const key = keyFor(item);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return Object.freeze(counts);
}

function hasRelatedValue(view: EipSprint2InternalGeographicView, prefix: "conflict:" | "ambiguity:") {
  return view.relationships.relatedObjects.some((item) => item.startsWith(prefix) && !item.endsWith(":NONE"));
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/eip/internalGeographicActivationReadinessLedger.ts
