import {
  createEipSprint4InternalGeographicActivationReadinessLedger,
  type EipSprint4ActivationGate,
  type EipSprint4LedgerEntry,
  type EipSprint4ReadinessLedger,
} from "./internalGeographicActivationReadinessLedger.js";

export const EIP_SPRINT_5_APPROVAL_SYSTEM_VERSION = "EIP_1.0_SPRINT_5_ENTERPRISE_KNOWLEDGE_APPROVAL_SYSTEM_V1";
export const EIP_SPRINT_5_APPROVAL_TIMESTAMP = "2026-07-25T00:00:00.000Z";
export const EIP_SPRINT_5_REVIEW_DATE = "2026-10-25T00:00:00.000Z";
export const EIP_SPRINT_5_EXPIRATION_DATE = "2026-08-25T00:00:00.000Z";

export type EnterpriseKnowledgeApprovalDomain =
  | "GEOGRAPHIC_INTELLIGENCE"
  | "PROPERTY_INTELLIGENCE"
  | "MARKET_INTELLIGENCE"
  | "CONSTRUCTION_INTELLIGENCE"
  | "ENVIRONMENTAL_INTELLIGENCE"
  | "COMMUNITY_INTELLIGENCE"
  | "FINANCIAL_INTELLIGENCE"
  | "REGULATORY_INTELLIGENCE"
  | "EXECUTIVE_INTELLIGENCE"
  | "FUTURE_GOVERNED_DOMAIN";

export type EnterpriseKnowledgeApprovalSubjectType =
  | "KNOWLEDGE_OBJECT"
  | "KNOWLEDGE_GROUP"
  | "RELATIONSHIP"
  | "DATASET"
  | "GOVERNED_CAPABILITY";

export type EnterpriseKnowledgeApprovalType =
  | "APPROVE_FOR_INTERNAL_PROOF"
  | "APPROVE_FOR_INTERNAL_REVIEW"
  | "APPROVE_FOR_PRODUCTION_INTERNAL_PERSISTENCE_REVIEW"
  | "APPROVE_FOR_RELATIONSHIP_PROOF_REVIEW"
  | "APPROVE_FOR_RUNTIME_INTEGRATION_DESIGN"
  | "APPROVE_FOR_CUSTOMER_ACTIVATION_REVIEW"
  | "APPROVE_FOR_REVIEW_ONLY"
  | "APPROVE_EXCEPTION_REVIEW"
  | "APPROVE_REMEDIATION"
  | "APPROVE_RETIREMENT"
  | "APPROVE_SUPERSESSION";

export type EnterpriseKnowledgeDecisionState =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "EVIDENCE_REQUIRED"
  | "DEFERRED"
  | "CONDITIONALLY_APPROVED"
  | "APPROVED_FOR_DEFINED_NEXT_STEP"
  | "REJECTED"
  | "REVOKED"
  | "EXPIRED"
  | "SUPERSEDED"
  | "CLOSED_WITHOUT_ACTION";

export type EnterpriseKnowledgeAuthorityRole =
  | "EXECUTIVE_SPONSOR"
  | "CHIEF_ENTERPRISE_ARCHITECT"
  | "CHIEF_PRODUCT_OFFICER"
  | "DOMAIN_STEWARD"
  | "DATA_GOVERNANCE_REVIEWER"
  | "TECHNICAL_REVIEWER"
  | "LEGAL_OR_LICENSING_REVIEWER"
  | "SECURITY_OR_PRIVACY_REVIEWER"
  | "OPERATOR"
  | "OBSERVER";

export type EnterpriseKnowledgeRecommendation =
  | "RECOMMEND_APPROVAL_FOR_INTERNAL_PROOF"
  | "RECOMMEND_CONDITIONAL_APPROVAL"
  | "RECOMMEND_DEFERRAL"
  | "RECOMMEND_REJECTION"
  | "INSUFFICIENT_EVIDENCE_FOR_RECOMMENDATION";

export type EnterpriseKnowledgeAuditEventType =
  | "REQUEST_CREATED"
  | "REQUEST_REVISED"
  | "REVIEW_PACKET_GENERATED"
  | "REVIEWER_ASSIGNED"
  | "EVIDENCE_CHANGED"
  | "DECISION_RECORDED"
  | "CONDITIONAL_APPROVAL_RECORDED"
  | "REJECTION_RECORDED"
  | "DEFERRAL_RECORDED"
  | "EXPIRATION_RECORDED"
  | "REVOCATION_RECORDED"
  | "SUPERSESSION_RECORDED"
  | "RE_REVIEW_REQUIRED";

export type EnterpriseKnowledgeApprovalRequest = Readonly<{
  approvalRequestId: string;
  domain: EnterpriseKnowledgeApprovalDomain;
  subjectType: EnterpriseKnowledgeApprovalSubjectType;
  subjectId: string;
  requestedApprovalType: EnterpriseKnowledgeApprovalType;
  requestedNextStage: string;
  submittingAuthority: EnterpriseKnowledgeAuthorityRole;
  submissionTimestamp: typeof EIP_SPRINT_5_APPROVAL_TIMESTAMP;
  businessRationale: string;
  customerValueRationale: string;
  enterpriseValueRationale: string;
  scopeBoundaries: readonly string[];
  supportingReadinessLedgerEntryIds: readonly string[];
  supportingQualityAssessmentRefs: readonly string[];
  supportingSourceAndTrustEvidence: readonly string[];
  knownBlockers: readonly string[];
  knownWarnings: readonly string[];
  unresolvedConflicts: readonly string[];
  requiredReviewers: readonly EnterpriseKnowledgeAuthorityRole[];
  decisionDeadlineOrReviewWindow: string;
  prohibitedOutcomes: readonly string[];
  requestVersion: typeof EIP_SPRINT_5_APPROVAL_SYSTEM_VERSION;
}>;

export type EnterpriseKnowledgeExecutiveReviewPacket = Readonly<{
  packetId: string;
  approvalRequestId: string;
  identity: {
    subject: string;
    objectType: string;
    domain: EnterpriseKnowledgeApprovalDomain;
    canonicalIdentityState: string;
    duplicateOrAmbiguityState: string;
  };
  knowledgeQuality: {
    overallInternalQualityStatus: string;
    qualityDimensions: readonly string[];
    warnings: readonly string[];
    deficiencies: readonly string[];
    recommendations: readonly string[];
  };
  readiness: {
    requestedGate: EipSprint4ActivationGate;
    currentGateStatus: string;
    requirementsPassed: readonly string[];
    requirementsFailed: readonly string[];
    blockingConditions: readonly string[];
    nextPermittedAction: string;
  };
  trustAndEvidence: {
    sourceClass: string;
    sourceAuthority: string;
    confidence: string;
    freshness: string;
    licensingOrUsageConstraints: string;
    evidenceReferences: readonly string[];
  };
  governance: {
    lifecycle: string;
    classification: string;
    editorialSeparationCompliance: string;
    restrictedKnowledgeStatus: string;
    humanReviewStatus: string;
    conflictPreservationStatus: string;
  };
  risk: {
    customerRisk: string;
    runtimeRisk: string;
    legalOrLicensingRisk: string;
    dataIntegrityRisk: string;
    reputationalRisk: string;
    reversibility: string;
  };
  decisionRequest: {
    exactDecisionRequested: string;
    allowableDecisions: readonly EnterpriseKnowledgeDecisionState[];
    conditionsThatMayBeImposed: readonly string[];
    actionsThatRemainProhibited: readonly string[];
  };
  executiveValueStatement: string;
  automatedRecommendation: EnterpriseKnowledgeRecommendation;
  generatedTimestamp: typeof EIP_SPRINT_5_APPROVAL_TIMESTAMP;
  packetVersion: typeof EIP_SPRINT_5_APPROVAL_SYSTEM_VERSION;
}>;

export type EnterpriseKnowledgeApprovalDecisionRecord = Readonly<{
  decisionId: string;
  approvalRequestId: string;
  subjectId: string;
  domain: EnterpriseKnowledgeApprovalDomain;
  requestedApprovalType: EnterpriseKnowledgeApprovalType;
  decision: EnterpriseKnowledgeDecisionState;
  decisionRationale: string;
  decisionAuthority: string;
  authorityRole: EnterpriseKnowledgeAuthorityRole;
  decisionTimestamp: typeof EIP_SPRINT_5_APPROVAL_TIMESTAMP;
  conditions: readonly string[];
  restrictions: readonly string[];
  expirationOrReviewDate: string;
  evidenceReviewed: readonly string[];
  dissentOrUnresolvedConcerns: readonly string[];
  permittedNextAction: string;
  prohibitedActions: readonly string[];
  activationExplicitlyAuthorized: false;
  customerVisibilityAuthorized: false;
  runtimeConsumptionAuthorized: false;
  productionPersistenceAuthorized: false;
  supersedesDecisionId: string | null;
  decisionVersion: typeof EIP_SPRINT_5_APPROVAL_SYSTEM_VERSION;
  auditStatus: "AUDITABLE_INTERNAL_FIXTURE";
}>;

export type EnterpriseKnowledgeApprovalAuditEvent = Readonly<{
  auditEventId: string;
  eventType: EnterpriseKnowledgeAuditEventType;
  approvalRequestId: string;
  decisionId: string | null;
  eventTimestamp: typeof EIP_SPRINT_5_APPROVAL_TIMESTAMP;
  actorRole: EnterpriseKnowledgeAuthorityRole;
  immutableSequence: number;
  details: string;
  auditVersion: typeof EIP_SPRINT_5_APPROVAL_SYSTEM_VERSION;
}>;

export type EnterpriseKnowledgeApprovalPolicy = Readonly<{
  policyVersion: typeof EIP_SPRINT_5_APPROVAL_SYSTEM_VERSION;
  approvalAuthorities: Readonly<Record<EnterpriseKnowledgeApprovalType, readonly EnterpriseKnowledgeAuthorityRole[]>>;
  reviewerRequirements: Readonly<Record<EnterpriseKnowledgeApprovalType, readonly EnterpriseKnowledgeAuthorityRole[]>>;
  mandatoryEvidence: readonly string[];
  automaticallyBlockingConditions: readonly string[];
  decisionStates: readonly EnterpriseKnowledgeDecisionState[];
  postApprovalProhibitions: readonly string[];
  expirationDays: 31;
}>;

export type EnterpriseKnowledgeApprovalFixtureSet = Readonly<{
  requests: readonly EnterpriseKnowledgeApprovalRequest[];
  packets: readonly EnterpriseKnowledgeExecutiveReviewPacket[];
  recommendations: readonly { approvalRequestId: string; recommendation: EnterpriseKnowledgeRecommendation }[];
  decisions: readonly EnterpriseKnowledgeApprovalDecisionRecord[];
  auditHistory: readonly EnterpriseKnowledgeApprovalAuditEvent[];
  summary: {
    requestCount: number;
    packetCount: number;
    decisionCount: number;
    activeDecisionCount: 0;
    customerVisibleDecisionCount: 0;
    runtimeAuthorizedDecisionCount: 0;
    productionPersistenceAuthorizedCount: 0;
  };
}>;

const postApprovalProhibitions = Object.freeze([
  "DO_NOT_ACTIVATE_RUNTIME",
  "DO_NOT_CREATE_PRODUCTION_PERSISTENCE",
  "DO_NOT_EXPOSE_TO_CUSTOMERS",
  "DO_NOT_CHANGE_SEARCH",
  "DO_NOT_CHANGE_MAPS",
  "DO_NOT_CREATE_PROPERTY_RELATIONSHIPS",
  "DO_NOT_INDEX",
  "DO_NOT_ENABLE_ANALYTICS_CONSUMPTION",
  "DO_NOT_ENABLE_AI_CONSUMPTION",
]);

export const EIP_SPRINT_5_APPROVAL_POLICY: EnterpriseKnowledgeApprovalPolicy = Object.freeze({
  policyVersion: EIP_SPRINT_5_APPROVAL_SYSTEM_VERSION,
  approvalAuthorities: Object.freeze({
    APPROVE_FOR_INTERNAL_PROOF: roles(["CHIEF_ENTERPRISE_ARCHITECT", "EXECUTIVE_SPONSOR"]),
    APPROVE_FOR_INTERNAL_REVIEW: roles(["CHIEF_ENTERPRISE_ARCHITECT", "DOMAIN_STEWARD"]),
    APPROVE_FOR_PRODUCTION_INTERNAL_PERSISTENCE_REVIEW: roles(["EXECUTIVE_SPONSOR", "CHIEF_ENTERPRISE_ARCHITECT"]),
    APPROVE_FOR_RELATIONSHIP_PROOF_REVIEW: roles(["CHIEF_ENTERPRISE_ARCHITECT", "CHIEF_PRODUCT_OFFICER"]),
    APPROVE_FOR_RUNTIME_INTEGRATION_DESIGN: roles(["EXECUTIVE_SPONSOR", "CHIEF_PRODUCT_OFFICER"]),
    APPROVE_FOR_CUSTOMER_ACTIVATION_REVIEW: roles(["EXECUTIVE_SPONSOR"]),
    APPROVE_FOR_REVIEW_ONLY: roles(["DOMAIN_STEWARD", "DATA_GOVERNANCE_REVIEWER"]),
    APPROVE_EXCEPTION_REVIEW: roles(["EXECUTIVE_SPONSOR", "CHIEF_ENTERPRISE_ARCHITECT"]),
    APPROVE_REMEDIATION: roles(["DATA_GOVERNANCE_REVIEWER", "DOMAIN_STEWARD"]),
    APPROVE_RETIREMENT: roles(["CHIEF_ENTERPRISE_ARCHITECT", "DOMAIN_STEWARD"]),
    APPROVE_SUPERSESSION: roles(["CHIEF_ENTERPRISE_ARCHITECT", "EXECUTIVE_SPONSOR"]),
  }),
  reviewerRequirements: Object.freeze({
    APPROVE_FOR_INTERNAL_PROOF: roles(["DOMAIN_STEWARD"]),
    APPROVE_FOR_INTERNAL_REVIEW: roles(["DOMAIN_STEWARD", "DATA_GOVERNANCE_REVIEWER"]),
    APPROVE_FOR_PRODUCTION_INTERNAL_PERSISTENCE_REVIEW: roles(["DATA_GOVERNANCE_REVIEWER", "TECHNICAL_REVIEWER"]),
    APPROVE_FOR_RELATIONSHIP_PROOF_REVIEW: roles(["DATA_GOVERNANCE_REVIEWER", "TECHNICAL_REVIEWER"]),
    APPROVE_FOR_RUNTIME_INTEGRATION_DESIGN: roles(["TECHNICAL_REVIEWER", "SECURITY_OR_PRIVACY_REVIEWER"]),
    APPROVE_FOR_CUSTOMER_ACTIVATION_REVIEW: roles(["DATA_GOVERNANCE_REVIEWER", "LEGAL_OR_LICENSING_REVIEWER", "SECURITY_OR_PRIVACY_REVIEWER"]),
    APPROVE_FOR_REVIEW_ONLY: roles(["DOMAIN_STEWARD"]),
    APPROVE_EXCEPTION_REVIEW: roles(["LEGAL_OR_LICENSING_REVIEWER", "SECURITY_OR_PRIVACY_REVIEWER"]),
    APPROVE_REMEDIATION: roles(["DATA_GOVERNANCE_REVIEWER"]),
    APPROVE_RETIREMENT: roles(["DOMAIN_STEWARD"]),
    APPROVE_SUPERSESSION: roles(["DATA_GOVERNANCE_REVIEWER", "DOMAIN_STEWARD"]),
  }),
  mandatoryEvidence: Object.freeze(["readiness-ledger", "quality", "source-decision", "source-queue-item"]),
  automaticallyBlockingConditions: Object.freeze([
    "EDITORIAL_ONLY_BLOCKED_FROM_FACTUAL_ACTIVATION",
    "RESTRICTED_KNOWLEDGE_NOT_PUBLICLY_ELIGIBLE",
    "DUPLICATE_CANDIDATE_CANNOT_BECOME_CANONICAL",
    "CONFLICT_OR_DUPLICATE_PRESENT",
    "MISSING_OR_INSUFFICIENT_SOURCE",
  ]),
  decisionStates: decisionStates([
    "DRAFT",
    "SUBMITTED",
    "UNDER_REVIEW",
    "EVIDENCE_REQUIRED",
    "DEFERRED",
    "CONDITIONALLY_APPROVED",
    "APPROVED_FOR_DEFINED_NEXT_STEP",
    "REJECTED",
    "REVOKED",
    "EXPIRED",
    "SUPERSEDED",
    "CLOSED_WITHOUT_ACTION",
  ]),
  postApprovalProhibitions,
  expirationDays: 31,
});

export function createApprovalRequest(input: Omit<EnterpriseKnowledgeApprovalRequest, "submissionTimestamp" | "requestVersion">): EnterpriseKnowledgeApprovalRequest {
  const request: EnterpriseKnowledgeApprovalRequest = Object.freeze({
    ...input,
    submissionTimestamp: EIP_SPRINT_5_APPROVAL_TIMESTAMP,
    requestVersion: EIP_SPRINT_5_APPROVAL_SYSTEM_VERSION,
  });
  validateApprovalRequest(request);
  return request;
}

export function validateApprovalRequest(request: EnterpriseKnowledgeApprovalRequest): void {
  if (!request.approvalRequestId || !request.subjectId) throw new Error("Approval request must identify subject and request");
  if (!request.requestedNextStage.trim()) throw new Error("Approval request must reference a specific next step");
  if (request.scopeBoundaries.length === 0) throw new Error("Approval request scope must be bounded");
  if (request.supportingReadinessLedgerEntryIds.length === 0) throw new Error("Approval request requires readiness evidence");
  if (request.supportingQualityAssessmentRefs.length === 0) throw new Error("Approval request requires quality evidence");
  if (request.supportingSourceAndTrustEvidence.length === 0) throw new Error("Approval request requires source and trust evidence");
  if (request.businessRationale.trim().length < 12 || request.customerValueRationale.trim().length < 12 || request.enterpriseValueRationale.trim().length < 12) {
    throw new Error("Approval request requires business, customer, and enterprise rationale");
  }
  if (request.prohibitedOutcomes.some((item) => !item.startsWith("DO_NOT_"))) throw new Error("Approval request must preserve prohibited outcomes");
}

export function determineRequiredReviewers(request: EnterpriseKnowledgeApprovalRequest): readonly EnterpriseKnowledgeAuthorityRole[] {
  return Object.freeze([...new Set([
    ...EIP_SPRINT_5_APPROVAL_POLICY.reviewerRequirements[request.requestedApprovalType],
    ...request.requiredReviewers,
  ])].sort());
}

export function generateExecutiveReviewPacket(
  request: EnterpriseKnowledgeApprovalRequest,
  ledger: EipSprint4ReadinessLedger = createEipSprint4InternalGeographicActivationReadinessLedger(),
): EnterpriseKnowledgeExecutiveReviewPacket {
  validateApprovalRequest(request);
  const entry = ledgerEntryForRequest(request, ledger);
  const hasBlockingCondition = entry.blockingConditions.length > 0;
  const packet: EnterpriseKnowledgeExecutiveReviewPacket = Object.freeze({
    packetId: `EIP_SPRINT_5_PACKET|${request.approvalRequestId}`,
    approvalRequestId: request.approvalRequestId,
    identity: {
      subject: entry.canonicalName,
      objectType: entry.objectType,
      domain: request.domain,
      canonicalIdentityState: entry.conflictStatus === "DUPLICATE_CANDIDATE" ? "DUPLICATE_CANDIDATE_NOT_CANONICAL" : "INTERNAL_IDENTITY_ONLY",
      duplicateOrAmbiguityState: entry.conflictStatus,
    },
    knowledgeQuality: {
      overallInternalQualityStatus: entry.qualityEngineResult,
      qualityDimensions: Object.freeze(["IDENTITY", "SOURCE", "TRUST", "FRESHNESS", "COMPLETENESS", "CONFLICT", "REVIEW", "ACTIVATION_READINESS"]),
      warnings: entry.warnings,
      deficiencies: entry.requirementsFailed,
      recommendations: Object.freeze([entry.nextPermittedAction, "Approval does not authorize activation."]),
    },
    readiness: {
      requestedGate: entry.gate,
      currentGateStatus: entry.gateStatus,
      requirementsPassed: entry.requirementsPassed,
      requirementsFailed: entry.requirementsFailed,
      blockingConditions: entry.blockingConditions,
      nextPermittedAction: entry.nextPermittedAction,
    },
    trustAndEvidence: {
      sourceClass: entry.sourceStatus,
      sourceAuthority: entry.sourceStatus,
      confidence: entry.qualityEngineResult,
      freshness: entry.freshnessStatus,
      licensingOrUsageConstraints: entry.sourceStatus === "SOURCE_RESTRICTED" ? "RESTRICTED_INTERNAL_ONLY" : "INTERNAL_FIXTURE_ONLY",
      evidenceReferences: entry.supportingEvidenceReferences,
    },
    governance: {
      lifecycle: "INTERNAL_PROOF_ONLY",
      classification: entry.editorialSeparationStatus === "EDITORIAL_ONLY_BLOCKED" ? "EDITORIAL_KNOWLEDGE" : "GOVERNED_INTERNAL_KNOWLEDGE",
      editorialSeparationCompliance: entry.editorialSeparationStatus,
      restrictedKnowledgeStatus: entry.sourceStatus === "SOURCE_RESTRICTED" ? "RESTRICTED_INTERNAL_ONLY" : "NOT_RESTRICTED_FOR_INTERNAL_REVIEW",
      humanReviewStatus: entry.reviewStatus,
      conflictPreservationStatus: entry.conflictStatus,
    },
    risk: {
      customerRisk: "Contained because customer visibility remains prohibited.",
      runtimeRisk: "Contained because runtime consumption remains prohibited.",
      legalOrLicensingRisk: entry.sourceStatus === "SOURCE_RESTRICTED" ? "High until licensing review is complete." : "Low for internal review only.",
      dataIntegrityRisk: hasBlockingCondition ? "Open blockers require review before progression." : "Bounded by deterministic internal evidence.",
      reputationalRisk: "Contained while internal-only.",
      reversibility: "Fully reversible; no persistence or runtime mutation.",
    },
    decisionRequest: {
      exactDecisionRequested: request.requestedNextStage,
      allowableDecisions: decisionStates(["EVIDENCE_REQUIRED", "DEFERRED", "CONDITIONALLY_APPROVED", "APPROVED_FOR_DEFINED_NEXT_STEP", "REJECTED", "CLOSED_WITHOUT_ACTION"]),
      conditionsThatMayBeImposed: Object.freeze(["Maintain internal-only status", "Require re-review before implementation", "Resolve evidence blockers", "Preserve prohibited actions"]),
      actionsThatRemainProhibited: request.prohibitedOutcomes,
    },
    executiveValueStatement: `This request can create enterprise value by clarifying the next safe human decision for ${entry.canonicalName} while preserving customer trust through no activation, no runtime consumption, and no customer visibility.`,
    automatedRecommendation: generateAutomatedRecommendationFromEntry(request, entry),
    generatedTimestamp: EIP_SPRINT_5_APPROVAL_TIMESTAMP,
    packetVersion: EIP_SPRINT_5_APPROVAL_SYSTEM_VERSION,
  });
  return packet;
}

export function generateAutomatedRecommendation(packet: EnterpriseKnowledgeExecutiveReviewPacket): EnterpriseKnowledgeRecommendation {
  if (packet.readiness.blockingConditions.includes("MISSING_OR_INSUFFICIENT_SOURCE")) return "INSUFFICIENT_EVIDENCE_FOR_RECOMMENDATION";
  if (packet.readiness.blockingConditions.some((item) => item.includes("EDITORIAL") || item.includes("RESTRICTED") || item.includes("DUPLICATE"))) return "RECOMMEND_REJECTION";
  if (packet.readiness.blockingConditions.some((item) => item.includes("CONFLICT") || item.includes("AMBIGUOUS"))) return "RECOMMEND_DEFERRAL";
  if (packet.readiness.currentGateStatus === "READY_FOR_EXECUTIVE_REVIEW") return "RECOMMEND_CONDITIONAL_APPROVAL";
  return "RECOMMEND_APPROVAL_FOR_INTERNAL_PROOF";
}

export function validateDecisionAuthority(
  decision: EnterpriseKnowledgeApprovalDecisionRecord,
  request: EnterpriseKnowledgeApprovalRequest,
  policy: EnterpriseKnowledgeApprovalPolicy = EIP_SPRINT_5_APPROVAL_POLICY,
): void {
  if (decision.decisionVersion !== EIP_SPRINT_5_APPROVAL_SYSTEM_VERSION) throw new Error("Unsupported Sprint 5 decision version");
  if (!policy.approvalAuthorities[request.requestedApprovalType].includes(decision.authorityRole)) throw new Error("Authority role cannot approve requested approval type");
  if (!decision.decisionRationale.trim()) throw new Error("Decision rationale is mandatory");
  if (!decision.permittedNextAction.trim()) throw new Error("Approval decision must preserve a specific permitted next action");
  if (decision.prohibitedActions.length === 0 || decision.restrictions.length === 0) throw new Error("Decision restrictions and prohibited actions must be preserved");
  if (decision.activationExplicitlyAuthorized || decision.customerVisibilityAuthorized || decision.runtimeConsumptionAuthorized || decision.productionPersistenceAuthorized) {
    throw new Error("Sprint 5 decisions cannot authorize activation, customer visibility, runtime consumption, or production persistence");
  }
}

export function recordApprovalDecision(input: {
  request: EnterpriseKnowledgeApprovalRequest;
  packet: EnterpriseKnowledgeExecutiveReviewPacket;
  decisionId: string;
  decision: EnterpriseKnowledgeDecisionState;
  decisionRationale: string;
  decisionAuthority: string;
  authorityRole: EnterpriseKnowledgeAuthorityRole;
  conditions?: readonly string[];
  restrictions?: readonly string[];
  dissentOrUnresolvedConcerns?: readonly string[];
  permittedNextAction: string;
  supersedesDecisionId?: string | null;
}): EnterpriseKnowledgeApprovalDecisionRecord {
  const record: EnterpriseKnowledgeApprovalDecisionRecord = Object.freeze({
    decisionId: input.decisionId,
    approvalRequestId: input.request.approvalRequestId,
    subjectId: input.request.subjectId,
    domain: input.request.domain,
    requestedApprovalType: input.request.requestedApprovalType,
    decision: input.decision,
    decisionRationale: input.decisionRationale,
    decisionAuthority: input.decisionAuthority,
    authorityRole: input.authorityRole,
    decisionTimestamp: EIP_SPRINT_5_APPROVAL_TIMESTAMP,
    conditions: Object.freeze(input.conditions ?? []),
    restrictions: Object.freeze(input.restrictions ?? ["Internal-only", "No runtime activation", "No customer visibility"]),
    expirationOrReviewDate: EIP_SPRINT_5_REVIEW_DATE,
    evidenceReviewed: Object.freeze([...input.packet.trustAndEvidence.evidenceReferences, input.packet.packetId]),
    dissentOrUnresolvedConcerns: Object.freeze(input.dissentOrUnresolvedConcerns ?? []),
    permittedNextAction: input.permittedNextAction,
    prohibitedActions: input.request.prohibitedOutcomes,
    activationExplicitlyAuthorized: false as const,
    customerVisibilityAuthorized: false as const,
    runtimeConsumptionAuthorized: false as const,
    productionPersistenceAuthorized: false as const,
    supersedesDecisionId: input.supersedesDecisionId ?? null,
    decisionVersion: EIP_SPRINT_5_APPROVAL_SYSTEM_VERSION,
    auditStatus: "AUDITABLE_INTERNAL_FIXTURE",
  });
  validateDecisionAuthority(record, input.request);
  return record;
}

export function applyApprovalConditions(
  decision: EnterpriseKnowledgeApprovalDecisionRecord,
  conditions: readonly string[],
): EnterpriseKnowledgeApprovalDecisionRecord {
  return Object.freeze({ ...decision, conditions: Object.freeze([...decision.conditions, ...conditions]) });
}

export function expireDecision(decision: EnterpriseKnowledgeApprovalDecisionRecord): EnterpriseKnowledgeApprovalDecisionRecord {
  return Object.freeze({ ...decision, decision: "EXPIRED" as const, expirationOrReviewDate: EIP_SPRINT_5_EXPIRATION_DATE });
}

export function revokeDecision(decision: EnterpriseKnowledgeApprovalDecisionRecord, rationale: string): EnterpriseKnowledgeApprovalDecisionRecord {
  return Object.freeze({
    ...decision,
    decision: "REVOKED" as const,
    decisionRationale: rationale,
    permittedNextAction: "No further action until re-review.",
  });
}

export function supersedeDecision(
  previous: EnterpriseKnowledgeApprovalDecisionRecord,
  replacement: EnterpriseKnowledgeApprovalDecisionRecord,
): readonly EnterpriseKnowledgeApprovalDecisionRecord[] {
  return Object.freeze([
    Object.freeze({ ...previous, decision: "SUPERSEDED" as const }),
    Object.freeze({ ...replacement, supersedesDecisionId: previous.decisionId }),
  ]);
}

export function generateAuditHistory(
  request: EnterpriseKnowledgeApprovalRequest,
  packet: EnterpriseKnowledgeExecutiveReviewPacket,
  decisions: readonly EnterpriseKnowledgeApprovalDecisionRecord[],
): readonly EnterpriseKnowledgeApprovalAuditEvent[] {
  const events: EnterpriseKnowledgeApprovalAuditEvent[] = [
    auditEvent(1, "REQUEST_CREATED", request.approvalRequestId, null, request.submittingAuthority, "Approval request created."),
    auditEvent(2, "REVIEW_PACKET_GENERATED", request.approvalRequestId, null, "CHIEF_ENTERPRISE_ARCHITECT", packet.packetId),
    auditEvent(3, "REVIEWER_ASSIGNED", request.approvalRequestId, null, determineRequiredReviewers(request)[0] ?? "DOMAIN_STEWARD", "Reviewers assigned by policy."),
  ];
  for (const decision of decisions) {
    events.push(auditEvent(events.length + 1, eventTypeForDecision(decision.decision), request.approvalRequestId, decision.decisionId, decision.authorityRole, decision.decisionRationale));
  }
  return Object.freeze(events);
}

export function summarizeApprovalStatus(decisions: readonly EnterpriseKnowledgeApprovalDecisionRecord[]) {
  return Object.freeze({
    totalDecisions: decisions.length,
    byDecision: countBy(decisions, (decision) => decision.decision),
    activationAuthorized: decisions.filter((decision) => decision.activationExplicitlyAuthorized).length,
    customerVisibilityAuthorized: decisions.filter((decision) => decision.customerVisibilityAuthorized).length,
    runtimeAuthorized: decisions.filter((decision) => decision.runtimeConsumptionAuthorized).length,
    productionPersistenceAuthorized: decisions.filter((decision) => decision.productionPersistenceAuthorized).length,
  });
}

export function buildEipSprint5ApprovalSystemFixtures(
  ledger: EipSprint4ReadinessLedger = createEipSprint4InternalGeographicActivationReadinessLedger(),
): EnterpriseKnowledgeApprovalFixtureSet {
  const requests = Object.freeze([
    requestFor("001", "SEARCH", "APPROVE_FOR_RUNTIME_INTEGRATION_DESIGN", "Prepare search integration design review only."),
    requestFor("002", "MAP", "APPROVE_FOR_REVIEW_ONLY", "Resolve Gunbarrel object-type ambiguity through human review."),
    requestFor("004", "PRODUCTION_INTERNAL_ONLY_PERSISTENCE", "APPROVE_FOR_PRODUCTION_INTERNAL_PERSISTENCE_REVIEW", "Request evidence review for Niwot authority."),
    requestFor("009", "PUBLIC_PAGE", "APPROVE_FOR_CUSTOMER_ACTIVATION_REVIEW", "Evaluate editorial record for factual public-page request."),
    requestFor("003", "CUSTOMER_PRESENTATION", "APPROVE_FOR_CUSTOMER_ACTIVATION_REVIEW", "Evaluate restricted record for customer presentation request."),
    requestFor("005", "MARKET_ANALYTICS", "APPROVE_FOR_INTERNAL_REVIEW", "Defer conflict-preserved market-area evidence."),
    requestFor("007", "INTERNAL_MAPPING", "APPROVE_FOR_RELATIONSHIP_PROOF_REVIEW", "Approve internal alias proof review only."),
    requestFor("008", "PROPERTY_RELATIONSHIP", "APPROVE_FOR_RELATIONSHIP_PROOF_REVIEW", "Evaluate duplicate candidate for canonical progression."),
    requestFor("006", "INTERNAL_MAPPING", "APPROVE_FOR_INTERNAL_REVIEW", "Simulate stale or unknown boundary evidence review."),
    requestFor("001", "INTERNAL_MAPPING", "APPROVE_FOR_INTERNAL_PROOF", "Approve narrow internal mapping proof review without activation."),
  ]);
  const packets = Object.freeze(requests.map((request) => generateExecutiveReviewPacket(request, ledger)));
  const recommendations = Object.freeze(packets.map((packet) => Object.freeze({
    approvalRequestId: packet.approvalRequestId,
    recommendation: generateAutomatedRecommendation(packet),
  })));
  const decisions = Object.freeze([
    decisionFor(requests[0], packets[0], "001", "CONDITIONALLY_APPROVED", "Executive sponsor conditionally approves design review only.", "EXECUTIVE_SPONSOR", "Prepare internal design packet only."),
    decisionFor(requests[1], packets[1], "002", "DEFERRED", "Ambiguity requires architecture review and additional evidence.", "DOMAIN_STEWARD", "Collect evidence for human review."),
    decisionFor(requests[2], packets[2], "004", "EVIDENCE_REQUIRED", "Authority evidence is incomplete.", "EXECUTIVE_SPONSOR", "Collect authority and licensing evidence."),
    decisionFor(requests[3], packets[3], "009", "REJECTED", "Editorial-only knowledge cannot become factual public geography.", "EXECUTIVE_SPONSOR", "No factual public progression."),
    decisionFor(requests[4], packets[4], "003", "REJECTED", "Restricted knowledge cannot be approved for customer exposure.", "EXECUTIVE_SPONSOR", "No customer-facing progression."),
    decisionFor(requests[5], packets[5], "005", "DEFERRED", "Conflict remains preserved pending resolution.", "CHIEF_ENTERPRISE_ARCHITECT", "Resolve conflict evidence."),
    decisionFor(requests[6], packets[6], "007", "APPROVED_FOR_DEFINED_NEXT_STEP", "Alias candidate may proceed to internal alias proof review only.", "CHIEF_PRODUCT_OFFICER", "Prepare internal alias proof review."),
    decisionFor(requests[7], packets[7], "008", "REJECTED", "Duplicate candidate cannot become canonical or property-linked.", "CHIEF_PRODUCT_OFFICER", "No canonical progression."),
    expireDecision(decisionFor(requests[8], packets[8], "006", "CONDITIONALLY_APPROVED", "Unknown freshness requires short review window.", "CHIEF_ENTERPRISE_ARCHITECT", "Re-review boundary evidence.")),
    decisionFor(requests[9], packets[9], "010", "CLOSED_WITHOUT_ACTION", "Internal proof request closed without activation.", "CHIEF_ENTERPRISE_ARCHITECT", "No action."),
  ]);
  const replacement = decisionFor(requests[0], packets[0], "001B", "APPROVED_FOR_DEFINED_NEXT_STEP", "Superseding decision narrows the design review conditions.", "EXECUTIVE_SPONSOR", "Prepare narrower internal design packet.");
  const supersededPair = supersedeDecision(decisions[0], replacement);
  const finalDecisions = Object.freeze([supersededPair[0], ...decisions.slice(1), supersededPair[1], revokeDecision(decisions[6], "Alias proof approval revoked pending re-review.")]);
  const auditHistory = Object.freeze(requests.flatMap((request, index) => generateAuditHistory(request, packets[index], finalDecisions.filter((decision) => decision.approvalRequestId === request.approvalRequestId))));

  return Object.freeze({
    requests,
    packets,
    recommendations,
    decisions: finalDecisions,
    auditHistory,
    summary: {
      requestCount: requests.length,
      packetCount: packets.length,
      decisionCount: finalDecisions.length,
      activeDecisionCount: 0 as const,
      customerVisibleDecisionCount: 0 as const,
      runtimeAuthorizedDecisionCount: 0 as const,
      productionPersistenceAuthorizedCount: 0 as const,
    },
  });

  function requestFor(
    idSuffix: string,
    gate: EipSprint4ActivationGate,
    approvalType: EnterpriseKnowledgeApprovalType,
    nextStage: string,
  ) {
    const subjectId = `EIP_INTERNAL_GEO_PERSISTENCE|SPRINT_1|${idSuffix}`;
    const entry = ledger.entries.find((item) => item.knowledgeObjectId === subjectId && item.gate === gate);
    if (!entry) throw new Error(`Missing Sprint 4 ledger entry for ${subjectId} ${gate}`);
    return createApprovalRequest({
      approvalRequestId: `EIP_SPRINT_5_APPROVAL_REQUEST|${idSuffix}|${gate}`,
      domain: "GEOGRAPHIC_INTELLIGENCE",
      subjectType: "KNOWLEDGE_OBJECT",
      subjectId,
      requestedApprovalType: approvalType,
      requestedNextStage: nextStage,
      submittingAuthority: "DOMAIN_STEWARD",
      businessRationale: "Clarify the next governed enterprise decision.",
      customerValueRationale: "Protect future customers from premature or weak geographic claims.",
      enterpriseValueRationale: "Create reusable approval evidence for future enterprise domains.",
      scopeBoundaries: Object.freeze(["Internal fixture only", "No activation", "No production persistence", "No customer visibility"]),
      supportingReadinessLedgerEntryIds: Object.freeze([entry.ledgerEntryId]),
      supportingQualityAssessmentRefs: Object.freeze([`quality:${entry.qualityEngineResult}`]),
      supportingSourceAndTrustEvidence: entry.supportingEvidenceReferences,
      knownBlockers: entry.blockingConditions,
      knownWarnings: entry.warnings,
      unresolvedConflicts: entry.conflictStatus === "NO_CONFLICT" ? Object.freeze([]) : Object.freeze([entry.conflictStatus]),
      requiredReviewers: determinePolicyReviewers(approvalType, entry),
      decisionDeadlineOrReviewWindow: EIP_SPRINT_5_REVIEW_DATE,
      prohibitedOutcomes: postApprovalProhibitions,
    });
  }
}

function decisionFor(
  request: EnterpriseKnowledgeApprovalRequest,
  packet: EnterpriseKnowledgeExecutiveReviewPacket,
  idSuffix: string,
  decision: EnterpriseKnowledgeDecisionState,
  rationale: string,
  authorityRole: EnterpriseKnowledgeAuthorityRole,
  nextAction: string,
) {
  return recordApprovalDecision({
    request,
    packet,
    decisionId: `EIP_SPRINT_5_DECISION|${idSuffix}|${decision}`,
    decision,
    decisionRationale: rationale,
    decisionAuthority: `${authorityRole}|INTERNAL_FIXTURE`,
    authorityRole,
    conditions: Object.freeze(["Internal-only", "Re-review before implementation", "No activation"]),
    restrictions: Object.freeze(["No customer visibility", "No runtime consumption", "No production persistence"]),
    permittedNextAction: nextAction,
  });
}

function roles(items: readonly EnterpriseKnowledgeAuthorityRole[]): readonly EnterpriseKnowledgeAuthorityRole[] {
  return Object.freeze([...items]);
}

function decisionStates(items: readonly EnterpriseKnowledgeDecisionState[]): readonly EnterpriseKnowledgeDecisionState[] {
  return Object.freeze([...items]);
}

function determinePolicyReviewers(
  approvalType: EnterpriseKnowledgeApprovalType,
  entry: EipSprint4LedgerEntry,
): readonly EnterpriseKnowledgeAuthorityRole[] {
  const reviewers = new Set<EnterpriseKnowledgeAuthorityRole>(EIP_SPRINT_5_APPROVAL_POLICY.reviewerRequirements[approvalType]);
  if (entry.sourceStatus === "SOURCE_RESTRICTED") reviewers.add("LEGAL_OR_LICENSING_REVIEWER");
  if (entry.gate === "SEARCH" || entry.gate === "MAP" || entry.gate === "AI_ASSISTED_SYNTHESIS") reviewers.add("TECHNICAL_REVIEWER");
  if (entry.blockingConditions.length > 0) reviewers.add("DATA_GOVERNANCE_REVIEWER");
  return Object.freeze([...reviewers].sort());
}

function generateAutomatedRecommendationFromEntry(
  request: EnterpriseKnowledgeApprovalRequest,
  entry: EipSprint4LedgerEntry,
): EnterpriseKnowledgeRecommendation {
  if (entry.blockingConditions.includes("MISSING_OR_INSUFFICIENT_SOURCE")) return "INSUFFICIENT_EVIDENCE_FOR_RECOMMENDATION";
  if (entry.blockingConditions.some((item) => item.includes("EDITORIAL") || item.includes("RESTRICTED") || item.includes("DUPLICATE"))) return "RECOMMEND_REJECTION";
  if (entry.blockingConditions.some((item) => item.includes("CONFLICT") || item.includes("AMBIGUOUS"))) return "RECOMMEND_DEFERRAL";
  if (request.requestedApprovalType === "APPROVE_FOR_INTERNAL_PROOF") return "RECOMMEND_APPROVAL_FOR_INTERNAL_PROOF";
  return "RECOMMEND_CONDITIONAL_APPROVAL";
}

function ledgerEntryForRequest(
  request: EnterpriseKnowledgeApprovalRequest,
  ledger: EipSprint4ReadinessLedger,
): EipSprint4LedgerEntry {
  const entry = ledger.entries.find((item) => request.supportingReadinessLedgerEntryIds.includes(item.ledgerEntryId));
  if (!entry) throw new Error("Approval request references missing readiness-ledger entry");
  return entry;
}

function auditEvent(
  sequence: number,
  eventType: EnterpriseKnowledgeAuditEventType,
  approvalRequestId: string,
  decisionId: string | null,
  actorRole: EnterpriseKnowledgeAuthorityRole,
  details: string,
): EnterpriseKnowledgeApprovalAuditEvent {
  return Object.freeze({
    auditEventId: `EIP_SPRINT_5_AUDIT|${approvalRequestId}|${String(sequence).padStart(3, "0")}`,
    eventType,
    approvalRequestId,
    decisionId,
    eventTimestamp: EIP_SPRINT_5_APPROVAL_TIMESTAMP,
    actorRole,
    immutableSequence: sequence,
    details,
    auditVersion: EIP_SPRINT_5_APPROVAL_SYSTEM_VERSION,
  });
}

function eventTypeForDecision(decision: EnterpriseKnowledgeDecisionState): EnterpriseKnowledgeAuditEventType {
  if (decision === "CONDITIONALLY_APPROVED" || decision === "APPROVED_FOR_DEFINED_NEXT_STEP") return "CONDITIONAL_APPROVAL_RECORDED";
  if (decision === "REJECTED") return "REJECTION_RECORDED";
  if (decision === "DEFERRED" || decision === "EVIDENCE_REQUIRED") return "DEFERRAL_RECORDED";
  if (decision === "EXPIRED") return "EXPIRATION_RECORDED";
  if (decision === "REVOKED") return "REVOCATION_RECORDED";
  if (decision === "SUPERSEDED") return "SUPERSESSION_RECORDED";
  return "DECISION_RECORDED";
}

function countBy<T>(items: readonly T[], keyFor: (item: T) => string): Readonly<Record<string, number>> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const key = keyFor(item);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return Object.freeze(counts);
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/eip/enterpriseKnowledgeApprovalSystem.ts
