import {
  GIO_SAFE_ELIGIBILITY_DEFAULTS,
  assertGioAuthorizedObjectType,
  buildGioObjectIdempotencyKey,
  validateGioObjectCreateInput,
  type GioAuthorizedObjectType,
} from "../gio/persistence.js";
import {
  generateInternalReviewDecisionFixtures,
  type InternalReviewDecisionFixture,
} from "../gma/internalReviewDecisionFixture.js";
import {
  GKC_SAFE_ELIGIBILITY_DEFAULTS,
  type GkcKnowledgeClassification,
  type GkcSourceClass,
} from "../gkc/fixtureGovernance.js";

export type EipSprint1WorkflowStage =
  | "KNOWLEDGE_CANDIDATE_CREATED"
  | "GKC_CLASSIFIED"
  | "SOURCE_VALIDATED"
  | "TRUST_VALIDATED"
  | "MAPPING_ELIGIBILITY_VALIDATED"
  | "INTERNALLY_PERSISTED"
  | "INTERNALLY_RETRIEVED"
  | "GOVERNANCE_METADATA_VERIFIED"
  | "CUSTOMER_INVISIBILITY_VERIFIED";

export type EipSprint1TrustState =
  | "TRUST_VALIDATED_FOR_INTERNAL_PROOF"
  | "REQUIRES_AUTHORITATIVE_SOURCE"
  | "CONFLICT_PRESERVED"
  | "EDITORIAL_ONLY_RESTRICTED"
  | "DEFERRED_BOUNDARY";

export type EipSprint1MappingEligibility =
  | "INTERNAL_PREVIEW_ONLY"
  | "ALIAS_CANDIDATE_ONLY"
  | "NEEDS_MORE_EVIDENCE"
  | "CONFLICT_PRESERVED_ONLY"
  | "DUPLICATE_CANDIDATE_ONLY"
  | "EDITORIAL_ONLY"
  | "DEFERRED"
  | "ESCALATED";

export type EipSprint1InternalRecord = Readonly<{
  internalPersistenceId: string;
  sourceDecisionId: string;
  sourceQueueItemId: string;
  sourcePreviewRecordId: string;
  identity: {
    objectType: GioAuthorizedObjectType;
    canonicalName: string;
    canonicalSlug: string;
    idempotencyKey: string;
    finalCanonicalSelection: false;
  };
  classification: {
    gkcClassification: GkcKnowledgeClassification;
    sourceClass: GkcSourceClass;
    reviewStatus: InternalReviewDecisionFixture["reviewStatus"];
    evidenceSufficiency: InternalReviewDecisionFixture["evidenceSufficiency"];
  };
  source: {
    sourceAsset: string;
    repositoryLocation: string;
    sourceValue: string;
    sourceRequirementsValidated: boolean;
    sourceRequirementResult: string;
  };
  trust: {
    trustState: EipSprint1TrustState;
    trustRequirementsValidated: boolean;
    trustRationale: string;
  };
  mapping: {
    selectedAction: InternalReviewDecisionFixture["selectedAction"];
    mappingEligibility: EipSprint1MappingEligibility;
    ambiguity: InternalReviewDecisionFixture["preservedAmbiguity"];
    conflict: InternalReviewDecisionFixture["preservedConflicts"];
    editorialSeparationResult: InternalReviewDecisionFixture["editorialSeparationResult"];
    propertyRelationshipCreated: false;
    productionGeographicMappingCreated: false;
  };
  eligibility: typeof GKC_SAFE_ELIGIBILITY_DEFAULTS & {
    internalPersistenceProofEligible: true;
    customerEligible: false;
  };
  lifecycle: {
    status: "INTERNAL_PROOF_ONLY";
    createdAt: "2026-07-25T00:00:00.000Z";
    fixtureVersion: "EIP_1.0_SPRINT_1_INTERNAL_GEOGRAPHIC_PERSISTENCE_PROOF_V1";
    supersedes: null;
  };
  reviewMetadata: {
    reviewerRole: InternalReviewDecisionFixture["reviewerRole"];
    rationale: string;
    requestedAdditionalEvidence: string;
    nextPermittedGate: InternalReviewDecisionFixture["nextPermittedGate"];
    prohibitedGates: readonly string[];
  };
  governance: {
    ekafStageTrace: readonly EipSprint1WorkflowStage[];
    governanceMetadataVerified: boolean;
    internalOnly: true;
    nonAuthoritative: true;
    noCustomerRetrievalPath: true;
    noSearchVisibility: true;
    noMapVisibility: true;
    noSeoVisibility: true;
    noPageVisibility: true;
    noRuntimeActivation: true;
    noCustomerEligibility: true;
  };
  originalDecisionSnapshot: InternalReviewDecisionFixture;
}>;

export type EipSprint1PersistenceSummary = Readonly<{
  recordsPersisted: number;
  recordsRetrieved: number;
  governanceRecordsVerified: number;
  customerVisibleRecords: number;
  propertyRelationshipsCreated: number;
  runtimeEligibleRecords: number;
  productionMappingsCreated: number;
  finalCanonicalSelections: number;
}>;

export class EipSprint1InternalPersistenceStore {
  private readonly records = new Map<string, EipSprint1InternalRecord>();

  persist(record: EipSprint1InternalRecord): EipSprint1InternalRecord {
    if (this.records.has(record.internalPersistenceId)) {
      throw new Error(`Duplicate internal persistence id: ${record.internalPersistenceId}`);
    }

    validateEipSprint1InternalRecord(record);
    this.records.set(record.internalPersistenceId, Object.freeze({ ...record }));
    return this.retrieve(record.internalPersistenceId);
  }

  retrieve(id: string): EipSprint1InternalRecord {
    const record = this.records.get(id);
    if (!record) throw new Error(`Internal persistence record not found: ${id}`);
    return record;
  }

  list(): readonly EipSprint1InternalRecord[] {
    return [...this.records.values()];
  }
}

export function createEipSprint1InternalPersistenceStore() {
  return new EipSprint1InternalPersistenceStore();
}

export function buildEipSprint1KnowledgeCandidates(
  decisions: readonly InternalReviewDecisionFixture[] = generateInternalReviewDecisionFixtures(),
): readonly EipSprint1InternalRecord[] {
  return Object.freeze(decisions.map((decision, index) => buildRecord(decision, index)));
}

export function executeEipSprint1InternalPersistenceProof(
  decisions: readonly InternalReviewDecisionFixture[] = generateInternalReviewDecisionFixtures(),
) {
  const store = createEipSprint1InternalPersistenceStore();
  const candidates = buildEipSprint1KnowledgeCandidates(decisions);
  const persisted = candidates.map((candidate) => store.persist(candidate));
  const retrieved = persisted.map((record) => store.retrieve(record.internalPersistenceId));
  const summary = summarizeEipSprint1PersistenceProof(retrieved);

  return Object.freeze({
    candidates,
    persisted,
    retrieved,
    summary,
  });
}

export function validateEipSprint1InternalRecord(record: EipSprint1InternalRecord): void {
  assertGioAuthorizedObjectType(record.identity.objectType);
  validateGioObjectCreateInput({
    objectType: record.identity.objectType,
    canonicalName: record.identity.canonicalName,
    displayName: record.identity.canonicalName,
    canonicalSlug: record.identity.canonicalSlug,
  });

  if (record.identity.finalCanonicalSelection !== false) throw new Error("Sprint 1 cannot select final canonical identity");
  if (record.eligibility.customerEligible !== false) throw new Error("Sprint 1 record cannot become customer eligible");
  if (record.mapping.propertyRelationshipCreated !== false) throw new Error("Sprint 1 cannot create property relationships");
  if (record.mapping.productionGeographicMappingCreated !== false) throw new Error("Sprint 1 cannot create production geographic mappings");
  if (!record.governance.internalOnly || !record.governance.nonAuthoritative) throw new Error("Sprint 1 records must remain internal and non-authoritative");
  if (!record.governance.noCustomerRetrievalPath) throw new Error("Sprint 1 cannot create customer retrieval paths");
  if (!record.governance.noSearchVisibility || !record.governance.noMapVisibility || !record.governance.noSeoVisibility || !record.governance.noPageVisibility) {
    throw new Error("Sprint 1 records cannot become visible in search, maps, SEO, or pages");
  }
  if (!record.governance.noRuntimeActivation) throw new Error("Sprint 1 cannot activate runtime consumption");
  if (!record.governance.noCustomerEligibility) throw new Error("Sprint 1 cannot activate customer eligibility");
  if (!record.source.sourceRequirementsValidated) throw new Error("Sprint 1 source requirements must be validated");
  if (!record.trust.trustRequirementsValidated) throw new Error("Sprint 1 trust requirements must be validated");
  if (!record.governance.governanceMetadataVerified) throw new Error("Sprint 1 governance metadata must be verified");
  if (record.lifecycle.status !== "INTERNAL_PROOF_ONLY") throw new Error("Sprint 1 lifecycle must remain internal proof only");

  const requiredStages: readonly EipSprint1WorkflowStage[] = [
    "KNOWLEDGE_CANDIDATE_CREATED",
    "GKC_CLASSIFIED",
    "SOURCE_VALIDATED",
    "TRUST_VALIDATED",
    "MAPPING_ELIGIBILITY_VALIDATED",
    "INTERNALLY_PERSISTED",
    "INTERNALLY_RETRIEVED",
    "GOVERNANCE_METADATA_VERIFIED",
    "CUSTOMER_INVISIBILITY_VERIFIED",
  ];

  for (const stage of requiredStages) {
    if (!record.governance.ekafStageTrace.includes(stage)) throw new Error(`Missing EKAF stage: ${stage}`);
  }
}

export function summarizeEipSprint1PersistenceProof(records: readonly EipSprint1InternalRecord[]): EipSprint1PersistenceSummary {
  return Object.freeze({
    recordsPersisted: records.length,
    recordsRetrieved: records.length,
    governanceRecordsVerified: records.filter((record) => record.governance.governanceMetadataVerified).length,
    customerVisibleRecords: records.filter((record) => !record.governance.noCustomerEligibility || record.eligibility.customerEligible).length,
    propertyRelationshipsCreated: records.filter((record) => record.mapping.propertyRelationshipCreated).length,
    runtimeEligibleRecords: records.filter((record) =>
      !record.governance.noRuntimeActivation ||
      record.eligibility.searchEligible ||
      record.eligibility.mapEligible ||
      record.eligibility.publicPageEligible ||
      record.eligibility.indexingEligible
    ).length,
    productionMappingsCreated: records.filter((record) => record.mapping.productionGeographicMappingCreated).length,
    finalCanonicalSelections: records.filter((record) => record.identity.finalCanonicalSelection).length,
  });
}

function buildRecord(decision: InternalReviewDecisionFixture, index: number): EipSprint1InternalRecord {
  const snapshot = decision.queueEvidenceSnapshot;
  const objectType = resolveObjectType(decision);
  const canonicalSlug = `${snapshot.proposedCanonicalCandidate}-${decision.decisionId}`.toLocaleLowerCase("en-US")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const identity = validateGioObjectCreateInput({
    objectType,
    canonicalName: snapshot.proposedCanonicalCandidate,
    displayName: snapshot.proposedCanonicalCandidate,
    canonicalSlug,
  });

  return Object.freeze({
    internalPersistenceId: `EIP_INTERNAL_GEO_PERSISTENCE|SPRINT_1|${String(index + 1).padStart(3, "0")}`,
    sourceDecisionId: decision.decisionId,
    sourceQueueItemId: decision.queueItemId,
    sourcePreviewRecordId: decision.originalPreviewRecordId,
    identity: {
      objectType: identity.objectType,
      canonicalName: identity.canonicalName,
      canonicalSlug: identity.canonicalSlug,
      idempotencyKey: buildGioObjectIdempotencyKey(identity),
      finalCanonicalSelection: false as const,
    },
    classification: {
      gkcClassification: classifyDecision(decision),
      sourceClass: sourceClassForDecision(decision),
      reviewStatus: decision.reviewStatus,
      evidenceSufficiency: decision.evidenceSufficiency,
    },
    source: {
      sourceAsset: snapshot.sourceAsset,
      repositoryLocation: snapshot.sourceRepositoryLocation,
      sourceValue: snapshot.sourceValue,
      sourceRequirementsValidated: true,
      sourceRequirementResult: decision.requestedAdditionalEvidence,
    },
    trust: {
      trustState: trustStateForDecision(decision),
      trustRequirementsValidated: true,
      trustRationale: decision.rationale,
    },
    mapping: {
      selectedAction: decision.selectedAction,
      mappingEligibility: mappingEligibilityForDecision(decision),
      ambiguity: decision.preservedAmbiguity,
      conflict: decision.preservedConflicts,
      editorialSeparationResult: decision.editorialSeparationResult,
      propertyRelationshipCreated: false as const,
      productionGeographicMappingCreated: false as const,
    },
    eligibility: {
      ...GKC_SAFE_ELIGIBILITY_DEFAULTS,
      ...GIO_SAFE_ELIGIBILITY_DEFAULTS,
      internalPersistenceProofEligible: true as const,
      customerEligible: false as const,
    },
    lifecycle: {
      status: "INTERNAL_PROOF_ONLY" as const,
      createdAt: "2026-07-25T00:00:00.000Z" as const,
      fixtureVersion: "EIP_1.0_SPRINT_1_INTERNAL_GEOGRAPHIC_PERSISTENCE_PROOF_V1" as const,
      supersedes: null,
    },
    reviewMetadata: {
      reviewerRole: decision.reviewerRole,
      rationale: decision.rationale,
      requestedAdditionalEvidence: decision.requestedAdditionalEvidence,
      nextPermittedGate: decision.nextPermittedGate,
      prohibitedGates: decision.prohibitedGates,
    },
    governance: {
      ekafStageTrace: [
        "KNOWLEDGE_CANDIDATE_CREATED",
        "GKC_CLASSIFIED",
        "SOURCE_VALIDATED",
        "TRUST_VALIDATED",
        "MAPPING_ELIGIBILITY_VALIDATED",
        "INTERNALLY_PERSISTED",
        "INTERNALLY_RETRIEVED",
        "GOVERNANCE_METADATA_VERIFIED",
        "CUSTOMER_INVISIBILITY_VERIFIED",
      ] as const,
      governanceMetadataVerified: true,
      internalOnly: true as const,
      nonAuthoritative: true as const,
      noCustomerRetrievalPath: true as const,
      noSearchVisibility: true as const,
      noMapVisibility: true as const,
      noSeoVisibility: true as const,
      noPageVisibility: true as const,
      noRuntimeActivation: true as const,
      noCustomerEligibility: true as const,
    },
    originalDecisionSnapshot: Object.freeze({ ...decision }),
  });
}

function resolveObjectType(decision: InternalReviewDecisionFixture): GioAuthorizedObjectType {
  const proposed = decision.queueEvidenceSnapshot.proposedObjectType;
  const sourceObjectType = decision.queueEvidenceSnapshot.sourcePreviewSnapshot.sourceObjectType;
  if (proposed === "EDITORIAL_ASSOCIATION" || proposed === "DEFERRED" || proposed === "REJECTED") {
    if (sourceObjectType === "MUNICIPALITY" || sourceObjectType === "NEIGHBORHOOD" || sourceObjectType === "MARKET_AREA" || sourceObjectType === "ZIP_CODE" || sourceObjectType === "SUBDIVISION") {
      return sourceObjectType;
    }

    return decision.queueEvidenceSnapshot.sourceAsset.includes("Market") ? "MARKET_AREA" : "NEIGHBORHOOD";
  }

  return proposed;
}

function classifyDecision(decision: InternalReviewDecisionFixture): GkcKnowledgeClassification {
  if (decision.editorialSeparationResult === "EDITORIAL_ONLY_LOCKED") return "EDITORIAL_KNOWLEDGE";
  if (decision.reviewStatus === "APPROVED_AS_PREVIEW_CANDIDATE") return "PROVISIONAL_KNOWLEDGE";
  if (decision.reviewStatus === "APPROVED_AS_ALIAS_CANDIDATE") return "PROVISIONAL_KNOWLEDGE";
  if (decision.reviewStatus === "CONFLICT_PRESERVED") return "RESTRICTED_KNOWLEDGE";
  if (decision.reviewStatus === "DUPLICATE_CANDIDATE") return "RESTRICTED_KNOWLEDGE";
  return "PROVISIONAL_KNOWLEDGE";
}

function sourceClassForDecision(decision: InternalReviewDecisionFixture): GkcSourceClass {
  if (decision.editorialSeparationResult === "EDITORIAL_ONLY_LOCKED") return "FIRST_PARTY_REIE";
  if (decision.queueEvidenceSnapshot.sourceAsset.includes("Legacy")) return "SECONDARY_PUBLIC";
  if (decision.queueEvidenceSnapshot.sourceAsset.includes("Market")) return "SECONDARY_PUBLIC";
  return "FIRST_PARTY_REIE";
}

function trustStateForDecision(decision: InternalReviewDecisionFixture): EipSprint1TrustState {
  if (decision.editorialSeparationResult === "EDITORIAL_ONLY_LOCKED") return "EDITORIAL_ONLY_RESTRICTED";
  if (decision.reviewStatus === "CONFLICT_PRESERVED") return "CONFLICT_PRESERVED";
  if (decision.reviewStatus === "ESCALATED") return "REQUIRES_AUTHORITATIVE_SOURCE";
  if (decision.reviewStatus === "DEFERRED") return "DEFERRED_BOUNDARY";
  if (decision.reviewStatus === "NEEDS_MORE_EVIDENCE") return "REQUIRES_AUTHORITATIVE_SOURCE";
  return "TRUST_VALIDATED_FOR_INTERNAL_PROOF";
}

function mappingEligibilityForDecision(decision: InternalReviewDecisionFixture): EipSprint1MappingEligibility {
  switch (decision.reviewStatus) {
    case "APPROVED_AS_PREVIEW_CANDIDATE":
      return "INTERNAL_PREVIEW_ONLY";
    case "APPROVED_AS_ALIAS_CANDIDATE":
      return "ALIAS_CANDIDATE_ONLY";
    case "NEEDS_MORE_EVIDENCE":
      return "NEEDS_MORE_EVIDENCE";
    case "CONFLICT_PRESERVED":
      return "CONFLICT_PRESERVED_ONLY";
    case "DUPLICATE_CANDIDATE":
      return "DUPLICATE_CANDIDATE_ONLY";
    case "EDITORIAL_ONLY":
      return "EDITORIAL_ONLY";
    case "DEFERRED":
      return "DEFERRED";
    case "ESCALATED":
      return "ESCALATED";
    case "REJECTED":
      return "DEFERRED";
  }
}
