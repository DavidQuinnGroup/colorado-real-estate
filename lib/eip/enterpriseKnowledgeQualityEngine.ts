import {
  createEipSprint2InternalGeographicReadModel,
  type EipSprint2Confidence,
  type EipSprint2Freshness,
  type EipSprint2InternalGeographicView,
} from "./internalGeographicReadModel.js";

export const EIP_SPRINT_3_QUALITY_ENGINE_VERSION = "EIP_1.0_SPRINT_3_ENTERPRISE_KNOWLEDGE_QUALITY_ENGINE_V1";
export const EIP_SPRINT_3_ASSESSMENT_TIMESTAMP = "2026-07-25T00:00:00.000Z";

export type EnterpriseKnowledgeDomain =
  | "GEOGRAPHIC_INTELLIGENCE"
  | "PROPERTY_INTELLIGENCE"
  | "MARKET_INTELLIGENCE"
  | "CONSTRUCTION_INTELLIGENCE"
  | "FINANCIAL_INTELLIGENCE"
  | "COMMUNITY_INTELLIGENCE"
  | "FUTURE_ENTERPRISE_DOMAIN";

export type EnterpriseKnowledgeQualityStatus =
  | "READY"
  | "READY_WITH_WARNINGS"
  | "NEEDS_REVIEW"
  | "INSUFFICIENT_SOURCE"
  | "CONFLICT_PRESENT"
  | "STALE"
  | "INCOMPLETE"
  | "NOT_ACTIVATABLE";

export type EnterpriseKnowledgeActivationTarget =
  | "INTERNAL_PERSISTENCE"
  | "INTERNAL_RETRIEVAL"
  | "INTERNAL_MAPPING"
  | "CUSTOMER_ACTIVATION";

export type EnterpriseKnowledgeQualityDimension =
  | "IDENTITY_QUALITY"
  | "SOURCE_QUALITY"
  | "TRUST_QUALITY"
  | "FRESHNESS_QUALITY"
  | "COMPLETENESS_QUALITY"
  | "CONFLICT_QUALITY"
  | "REVIEW_QUALITY"
  | "ACTIVATION_READINESS";

export type EnterpriseKnowledgeQualityInput = Readonly<{
  knowledgeId: string;
  domain: EnterpriseKnowledgeDomain;
  identity: {
    canonicalName: string;
    objectType?: string;
    aliases: readonly string[];
    duplicateCandidate: boolean;
    objectTypeCertain: boolean;
  };
  source: {
    sourceClass: string;
    authority: string;
    licensing: "CLEAR" | "RESTRICTED" | "UNKNOWN";
    provenance: "INTERNAL_FIXTURE" | "FIRST_PARTY" | "SECONDARY" | "LICENSED" | "AUTHORITATIVE" | "UNKNOWN";
    present: boolean;
  };
  trust: {
    confidence: EipSprint2Confidence;
    verified: boolean;
    reviewState: string;
    evidenceSufficiency: "SUFFICIENT" | "PARTIAL" | "INSUFFICIENT" | "CONFLICTED";
  };
  freshness: {
    freshness: EipSprint2Freshness;
    effectiveDatePresent: boolean;
    reviewDue: boolean;
    stale: boolean;
  };
  completeness: {
    requiredMetadata: boolean;
    requiredGovernance: boolean;
    requiredSource: boolean;
    requiredRelationships: boolean;
  };
  conflict: {
    conflictingObservations: boolean;
    unresolvedAmbiguity: boolean;
    duplicateCandidate: boolean;
    conflictPreserved: boolean;
  };
  review: {
    humanReviewed: boolean;
    rationalePresent: boolean;
    reviewComplete: boolean;
    approvalChainPresent: boolean;
  };
  activation: Record<EnterpriseKnowledgeActivationTarget, boolean>;
  governance: {
    internalOnly: boolean;
    customerVisible: boolean;
    runtimeVisible: boolean;
    searchVisible: boolean;
    mapVisible: boolean;
    propertyVisible: boolean;
    seoVisible: boolean;
    persistenceMutation: boolean;
  };
  metadata: {
    sourceRecordVersion: string;
    sourceRecordId: string;
  };
}>;

export type EnterpriseKnowledgeDimensionAssessment = Readonly<{
  dimension: EnterpriseKnowledgeQualityDimension;
  status: EnterpriseKnowledgeQualityStatus;
  score: number;
  findings: readonly string[];
}>;

export type EnterpriseKnowledgeActivationAssessment = Readonly<{
  target: EnterpriseKnowledgeActivationTarget;
  status: EnterpriseKnowledgeQualityStatus;
  eligible: boolean;
  rationale: string;
}>;

export type EnterpriseKnowledgeQualityAssessment = Readonly<{
  knowledgeId: string;
  domain: EnterpriseKnowledgeDomain;
  identityQuality: EnterpriseKnowledgeDimensionAssessment;
  sourceQuality: EnterpriseKnowledgeDimensionAssessment;
  trustQuality: EnterpriseKnowledgeDimensionAssessment;
  freshnessQuality: EnterpriseKnowledgeDimensionAssessment;
  completenessQuality: EnterpriseKnowledgeDimensionAssessment;
  conflictQuality: EnterpriseKnowledgeDimensionAssessment;
  reviewQuality: EnterpriseKnowledgeDimensionAssessment;
  activationReadiness: readonly EnterpriseKnowledgeActivationAssessment[];
  overallInternalStatus: EnterpriseKnowledgeQualityStatus;
  overallScore: number;
  recommendations: readonly string[];
  metadata: {
    engineVersion: typeof EIP_SPRINT_3_QUALITY_ENGINE_VERSION;
    assessmentTimestamp: typeof EIP_SPRINT_3_ASSESSMENT_TIMESTAMP;
    sourceRecordVersion: string;
    sourceRecordId: string;
    customerVisibleQualityScore: false;
    runtimeActivation: false;
    persistenceMutation: false;
  };
}>;

export function assessEnterpriseKnowledgeQuality(input: EnterpriseKnowledgeQualityInput): EnterpriseKnowledgeQualityAssessment {
  validateQualityInputSafety(input);

  const identityQuality = assessIdentityQuality(input);
  const sourceQuality = assessSourceQuality(input);
  const trustQuality = assessTrustQuality(input);
  const freshnessQuality = assessFreshnessQuality(input);
  const completenessQuality = assessCompletenessQuality(input);
  const conflictQuality = assessConflictQuality(input);
  const reviewQuality = assessReviewQuality(input);
  const activationReadiness = assessActivationReadiness(input);
  const dimensions = [
    identityQuality,
    sourceQuality,
    trustQuality,
    freshnessQuality,
    completenessQuality,
    conflictQuality,
    reviewQuality,
  ];
  const overallScore = Math.round(dimensions.reduce((sum, item) => sum + item.score, 0) / dimensions.length);
  const overallInternalStatus = overallStatusFor(dimensions, activationReadiness, input);

  const assessment: EnterpriseKnowledgeQualityAssessment = {
    knowledgeId: input.knowledgeId,
    domain: input.domain,
    identityQuality,
    sourceQuality,
    trustQuality,
    freshnessQuality,
    completenessQuality,
    conflictQuality,
    reviewQuality,
    activationReadiness,
    overallInternalStatus,
    overallScore,
    recommendations: recommendationsFor(dimensions, activationReadiness, input),
    metadata: {
      engineVersion: EIP_SPRINT_3_QUALITY_ENGINE_VERSION,
      assessmentTimestamp: EIP_SPRINT_3_ASSESSMENT_TIMESTAMP,
      sourceRecordVersion: input.metadata.sourceRecordVersion,
      sourceRecordId: input.metadata.sourceRecordId,
      customerVisibleQualityScore: false as const,
      runtimeActivation: false as const,
      persistenceMutation: false as const,
    },
  };

  return Object.freeze(assessment);
}

export function assessSprint2GeographicReadModelQuality(
  views: readonly EipSprint2InternalGeographicView[] = createEipSprint2InternalGeographicReadModel().listAll(),
): readonly EnterpriseKnowledgeQualityAssessment[] {
  return Object.freeze(views.map((view) => assessEnterpriseKnowledgeQuality(qualityInputFromGeographicView(view))));
}

export function qualityInputFromGeographicView(view: EipSprint2InternalGeographicView): EnterpriseKnowledgeQualityInput {
  const hasConflict = view.relationships.relatedObjects.some((item) => item.startsWith("conflict:") && item !== "conflict:NONE");
  const hasAmbiguity = view.relationships.relatedObjects.some((item) => item.startsWith("ambiguity:") && item !== "ambiguity:NONE");
  const duplicateCandidate = view.governance.mappingEligibility === "DUPLICATE_CANDIDATE_ONLY";
  const insufficientSource = view.trust.authority === "REQUIRES_AUTHORITY_REVIEW";
  const editorialOnly = view.trust.authority === "EDITORIAL_ONLY";

  const input: EnterpriseKnowledgeQualityInput = {
    knowledgeId: view.identity.id,
    domain: "GEOGRAPHIC_INTELLIGENCE" as const,
    identity: {
      canonicalName: view.identity.canonicalName,
      objectType: view.identity.objectType,
      aliases: view.relationships.aliases,
      duplicateCandidate,
      objectTypeCertain: !hasAmbiguity,
    },
    source: {
      sourceClass: view.source.sourceClass,
      authority: view.trust.authority,
      licensing: view.source.sourceClass === "LICENSED_COMMERCIAL" ? "RESTRICTED" as const : "CLEAR" as const,
      provenance: view.source.sourceClass === "FIRST_PARTY_REIE" ? "FIRST_PARTY" as const : "SECONDARY" as const,
      present: Boolean(view.source.sourceAsset && view.source.repositoryLocation && view.source.sourceValue),
    },
    trust: {
      confidence: view.trust.confidence,
      verified: view.trust.authority === "INTERNAL_PROOF_ONLY",
      reviewState: view.governance.reviewStatus,
      evidenceSufficiency: hasConflict ? "CONFLICTED" : insufficientSource || editorialOnly ? "INSUFFICIENT" : "SUFFICIENT",
    },
    freshness: {
      freshness: view.trust.freshness,
      effectiveDatePresent: view.trust.freshness !== "UNKNOWN",
      reviewDue: view.trust.authority === "REQUIRES_AUTHORITY_REVIEW" || hasConflict || duplicateCandidate,
      stale: view.trust.freshness === "STALE",
    },
    completeness: {
      requiredMetadata: Boolean(view.metadata.internalVersion && view.metadata.sourceDecisionId && view.metadata.sourceQueueItemId),
      requiredGovernance: view.governance.editorialSeparationEnforced && view.governance.restrictedKnowledgeInternalOnly,
      requiredSource: Boolean(view.source.sourceAsset && view.source.repositoryLocation),
      requiredRelationships: view.relationships.relatedObservations.length > 0,
    },
    conflict: {
      conflictingObservations: hasConflict,
      unresolvedAmbiguity: hasAmbiguity,
      duplicateCandidate,
      conflictPreserved: hasConflict || duplicateCandidate,
    },
    review: {
      humanReviewed: true,
      rationalePresent: Boolean(view.source.sourceRequirementResult),
      reviewComplete: view.governance.reviewStatus === "APPROVED_AS_PREVIEW_CANDIDATE" || view.governance.reviewStatus === "APPROVED_AS_ALIAS_CANDIDATE",
      approvalChainPresent: true,
    },
    activation: {
      INTERNAL_PERSISTENCE: view.governance.eligibility.internalPersistenceProofEligible,
      INTERNAL_RETRIEVAL: true,
      INTERNAL_MAPPING: view.governance.mappingEligibility === "INTERNAL_PREVIEW_ONLY" || view.governance.mappingEligibility === "ALIAS_CANDIDATE_ONLY",
      CUSTOMER_ACTIVATION: false,
    },
    governance: {
      internalOnly: true,
      customerVisible: false,
      runtimeVisible: false,
      searchVisible: !view.governance.noSearchVisibility,
      mapVisible: !view.governance.noMapVisibility,
      propertyVisible: view.governance.eligibility.propertyEnrichment,
      seoVisible: !view.governance.noSeoVisibility,
      persistenceMutation: false,
    },
    metadata: {
      sourceRecordVersion: view.metadata.internalVersion,
      sourceRecordId: view.identity.id,
    },
  };

  return Object.freeze(input);
}

export function buildEipSprint3QualityValidationFixtures(): readonly EnterpriseKnowledgeQualityInput[] {
  const views = createEipSprint2InternalGeographicReadModel().listAll();
  const complete = requiredView(views, "EIP_INTERNAL_GEO_PERSISTENCE|SPRINT_1|001");
  const conflict = requiredView(views, "EIP_INTERNAL_GEO_PERSISTENCE|SPRINT_1|003");
  const duplicate = requiredView(views, "EIP_INTERNAL_GEO_PERSISTENCE|SPRINT_1|008");
  const editorial = requiredView(views, "EIP_INTERNAL_GEO_PERSISTENCE|SPRINT_1|009");

  return Object.freeze([
    qualityInputFromGeographicView(complete),
    Object.freeze({
      ...qualityInputFromGeographicView(complete),
      knowledgeId: "EIP_SPRINT_3_QUALITY_FIXTURE|MISSING_SOURCE",
      source: {
        ...qualityInputFromGeographicView(complete).source,
        sourceClass: "",
        authority: "UNKNOWN",
        licensing: "UNKNOWN" as const,
        provenance: "UNKNOWN" as const,
        present: false,
      },
      completeness: {
        ...qualityInputFromGeographicView(complete).completeness,
        requiredSource: false,
      },
      metadata: {
        sourceRecordVersion: EIP_SPRINT_3_QUALITY_ENGINE_VERSION,
        sourceRecordId: "EIP_SPRINT_3_QUALITY_FIXTURE|MISSING_SOURCE",
      },
    }),
    Object.freeze({
      ...qualityInputFromGeographicView(complete),
      knowledgeId: "EIP_SPRINT_3_QUALITY_FIXTURE|STALE_KNOWLEDGE",
      freshness: {
        freshness: "STALE" as const,
        effectiveDatePresent: true,
        reviewDue: true,
        stale: true,
      },
      metadata: {
        sourceRecordVersion: EIP_SPRINT_3_QUALITY_ENGINE_VERSION,
        sourceRecordId: "EIP_SPRINT_3_QUALITY_FIXTURE|STALE_KNOWLEDGE",
      },
    }),
    qualityInputFromGeographicView(conflict),
    qualityInputFromGeographicView(duplicate),
    qualityInputFromGeographicView(editorial),
    Object.freeze({
      ...qualityInputFromGeographicView(complete),
      knowledgeId: "EIP_SPRINT_3_QUALITY_FIXTURE|INSUFFICIENT_EVIDENCE",
      trust: {
        ...qualityInputFromGeographicView(complete).trust,
        confidence: "LOW" as const,
        verified: false,
        evidenceSufficiency: "INSUFFICIENT" as const,
      },
      review: {
        ...qualityInputFromGeographicView(complete).review,
        reviewComplete: false,
      },
      metadata: {
        sourceRecordVersion: EIP_SPRINT_3_QUALITY_ENGINE_VERSION,
        sourceRecordId: "EIP_SPRINT_3_QUALITY_FIXTURE|INSUFFICIENT_EVIDENCE",
      },
    }),
    Object.freeze({
      ...qualityInputFromGeographicView(complete),
      knowledgeId: "EIP_SPRINT_3_QUALITY_FIXTURE|FULLY_INTERNAL_READY",
      activation: {
        INTERNAL_PERSISTENCE: true,
        INTERNAL_RETRIEVAL: true,
        INTERNAL_MAPPING: true,
        CUSTOMER_ACTIVATION: false,
      },
      metadata: {
        sourceRecordVersion: EIP_SPRINT_3_QUALITY_ENGINE_VERSION,
        sourceRecordId: "EIP_SPRINT_3_QUALITY_FIXTURE|FULLY_INTERNAL_READY",
      },
    }),
  ]);
}

function validateQualityInputSafety(input: EnterpriseKnowledgeQualityInput): void {
  if (!input.governance.internalOnly) throw new Error("Quality Engine input must remain internal-only");
  if (input.governance.customerVisible) throw new Error("Quality Engine cannot expose customer-visible quality scores");
  if (input.governance.runtimeVisible) throw new Error("Quality Engine cannot activate runtime visibility");
  if (input.governance.searchVisible || input.governance.mapVisible || input.governance.propertyVisible || input.governance.seoVisible) {
    throw new Error("Quality Engine cannot expose search, map, property, or SEO consumption");
  }
  if (input.governance.persistenceMutation) throw new Error("Quality Engine cannot mutate persistence");
  if (input.activation.CUSTOMER_ACTIVATION) throw new Error("Quality Engine cannot activate customers");
}

function assessIdentityQuality(input: EnterpriseKnowledgeQualityInput): EnterpriseKnowledgeDimensionAssessment {
  const findings: string[] = [];
  if (!input.identity.canonicalName.trim()) findings.push("Canonical identity is missing.");
  if (!input.identity.objectType) findings.push("Object type is missing.");
  if (!input.identity.objectTypeCertain) findings.push("Object type remains ambiguous.");
  if (input.identity.duplicateCandidate) findings.push("Duplicate candidate requires review.");
  return dimension("IDENTITY_QUALITY", findings.length === 0 ? "READY" : input.identity.duplicateCandidate ? "NEEDS_REVIEW" : "INCOMPLETE", 100 - findings.length * 25, findings);
}

function assessSourceQuality(input: EnterpriseKnowledgeQualityInput): EnterpriseKnowledgeDimensionAssessment {
  const findings: string[] = [];
  if (!input.source.present) findings.push("Source evidence is missing.");
  if (input.source.authority === "UNKNOWN" || input.source.authority === "REQUIRES_AUTHORITY_REVIEW") findings.push("Authority requires review.");
  if (input.source.licensing === "UNKNOWN") findings.push("Licensing posture is unknown.");
  if (input.source.provenance === "UNKNOWN") findings.push("Provenance is unknown.");
  const status: EnterpriseKnowledgeQualityStatus = !input.source.present ? "INSUFFICIENT_SOURCE" : findings.length > 0 ? "READY_WITH_WARNINGS" : "READY";
  return dimension("SOURCE_QUALITY", status, 100 - findings.length * 25, findings);
}

function assessTrustQuality(input: EnterpriseKnowledgeQualityInput): EnterpriseKnowledgeDimensionAssessment {
  const findings: string[] = [];
  if (!input.trust.verified) findings.push("Knowledge is not verified as internally ready.");
  if (input.trust.confidence === "INSUFFICIENT" || input.trust.confidence === "LOW") findings.push(`Confidence is ${input.trust.confidence}.`);
  if (input.trust.evidenceSufficiency === "INSUFFICIENT") findings.push("Evidence is insufficient.");
  if (input.trust.evidenceSufficiency === "CONFLICTED") findings.push("Evidence is conflicted.");
  const status: EnterpriseKnowledgeQualityStatus = input.trust.evidenceSufficiency === "CONFLICTED" ? "CONFLICT_PRESENT" : input.trust.evidenceSufficiency === "INSUFFICIENT" ? "NEEDS_REVIEW" : findings.length > 0 ? "READY_WITH_WARNINGS" : "READY";
  return dimension("TRUST_QUALITY", status, 100 - findings.length * 20, findings);
}

function assessFreshnessQuality(input: EnterpriseKnowledgeQualityInput): EnterpriseKnowledgeDimensionAssessment {
  const findings: string[] = [];
  if (input.freshness.stale || input.freshness.freshness === "STALE") findings.push("Knowledge is stale.");
  if (input.freshness.freshness === "UNKNOWN") findings.push("Freshness is unknown.");
  if (!input.freshness.effectiveDatePresent) findings.push("Effective date is not available.");
  if (input.freshness.reviewDue) findings.push("Review is due before activation.");
  const status: EnterpriseKnowledgeQualityStatus = input.freshness.stale || input.freshness.freshness === "STALE" ? "STALE" : findings.length > 0 ? "READY_WITH_WARNINGS" : "READY";
  return dimension("FRESHNESS_QUALITY", status, 100 - findings.length * 20, findings);
}

function assessCompletenessQuality(input: EnterpriseKnowledgeQualityInput): EnterpriseKnowledgeDimensionAssessment {
  const findings: string[] = [];
  if (!input.completeness.requiredMetadata) findings.push("Required metadata is incomplete.");
  if (!input.completeness.requiredGovernance) findings.push("Required governance is incomplete.");
  if (!input.completeness.requiredSource) findings.push("Required source is incomplete.");
  if (!input.completeness.requiredRelationships) findings.push("Required relationships are incomplete.");
  return dimension("COMPLETENESS_QUALITY", findings.length > 0 ? "INCOMPLETE" : "READY", 100 - findings.length * 25, findings);
}

function assessConflictQuality(input: EnterpriseKnowledgeQualityInput): EnterpriseKnowledgeDimensionAssessment {
  const findings: string[] = [];
  if (input.conflict.conflictingObservations) findings.push("Conflicting observations are present.");
  if (input.conflict.unresolvedAmbiguity) findings.push("Unresolved ambiguity is present.");
  if (input.conflict.duplicateCandidate) findings.push("Duplicate candidate is present.");
  if (input.conflict.conflictPreserved) findings.push("Conflict is preserved for internal review.");
  return dimension("CONFLICT_QUALITY", findings.length > 0 ? "CONFLICT_PRESENT" : "READY", 100 - findings.length * 20, findings);
}

function assessReviewQuality(input: EnterpriseKnowledgeQualityInput): EnterpriseKnowledgeDimensionAssessment {
  const findings: string[] = [];
  if (!input.review.humanReviewed) findings.push("Human review is missing.");
  if (!input.review.rationalePresent) findings.push("Review rationale is missing.");
  if (!input.review.reviewComplete) findings.push("Review is not complete.");
  if (!input.review.approvalChainPresent) findings.push("Approval chain is missing.");
  return dimension("REVIEW_QUALITY", findings.length > 0 ? "NEEDS_REVIEW" : "READY", 100 - findings.length * 25, findings);
}

function assessActivationReadiness(input: EnterpriseKnowledgeQualityInput): readonly EnterpriseKnowledgeActivationAssessment[] {
  const targets: EnterpriseKnowledgeActivationTarget[] = [
    "INTERNAL_PERSISTENCE",
    "INTERNAL_RETRIEVAL",
    "INTERNAL_MAPPING",
    "CUSTOMER_ACTIVATION",
  ];
  return Object.freeze(targets.map((target) => {
    const eligible = input.activation[target];
    const customer = target === "CUSTOMER_ACTIVATION";
    return Object.freeze({
      target,
      eligible,
      status: customer ? "NOT_ACTIVATABLE" as const : eligible ? "READY" as const : "NEEDS_REVIEW" as const,
      rationale: customer
        ? "Customer activation is prohibited in Sprint 3."
        : eligible
          ? `${target} is internally eligible.`
          : `${target} requires additional governed review.`,
    });
  }));
}

function dimension(
  dimensionName: EnterpriseKnowledgeQualityDimension,
  status: EnterpriseKnowledgeQualityStatus,
  score: number,
  findings: readonly string[],
): EnterpriseKnowledgeDimensionAssessment {
  return Object.freeze({
    dimension: dimensionName,
    status,
    score: Math.max(0, Math.min(100, score)),
    findings: Object.freeze(findings.length > 0 ? [...findings] : ["No quality issue detected."]),
  });
}

function overallStatusFor(
  dimensions: readonly EnterpriseKnowledgeDimensionAssessment[],
  activationReadiness: readonly EnterpriseKnowledgeActivationAssessment[],
  input: EnterpriseKnowledgeQualityInput,
): EnterpriseKnowledgeQualityStatus {
  if (input.governance.customerVisible || input.governance.runtimeVisible || input.governance.persistenceMutation) return "NOT_ACTIVATABLE";
  if (dimensions.some((item) => item.status === "INSUFFICIENT_SOURCE")) return "INSUFFICIENT_SOURCE";
  if (dimensions.some((item) => item.status === "STALE")) return "STALE";
  if (dimensions.some((item) => item.status === "CONFLICT_PRESENT")) return "CONFLICT_PRESENT";
  if (dimensions.some((item) => item.status === "INCOMPLETE")) return "INCOMPLETE";
  if (dimensions.some((item) => item.status === "NEEDS_REVIEW")) return "NEEDS_REVIEW";
  if (activationReadiness.some((item) => item.target !== "CUSTOMER_ACTIVATION" && item.status !== "READY")) return "READY_WITH_WARNINGS";
  if (dimensions.some((item) => item.status === "READY_WITH_WARNINGS")) return "READY_WITH_WARNINGS";
  return "READY";
}

function recommendationsFor(
  dimensions: readonly EnterpriseKnowledgeDimensionAssessment[],
  activationReadiness: readonly EnterpriseKnowledgeActivationAssessment[],
  input: EnterpriseKnowledgeQualityInput,
): readonly string[] {
  const recommendations = new Set<string>();
  for (const dimensionAssessment of dimensions) {
    if (dimensionAssessment.status !== "READY") {
      recommendations.add(`${dimensionAssessment.dimension}: ${dimensionAssessment.findings.join(" ")}`);
    }
  }
  for (const readiness of activationReadiness) {
    if (readiness.status !== "READY") recommendations.add(`${readiness.target}: ${readiness.rationale}`);
  }
  if (!input.activation.CUSTOMER_ACTIVATION) recommendations.add("Customer activation remains prohibited until a separate activation gate is authorized.");
  return Object.freeze([...recommendations]);
}

function requiredView(
  views: readonly EipSprint2InternalGeographicView[],
  id: string,
): EipSprint2InternalGeographicView {
  const view = views.find((item) => item.identity.id === id);
  if (!view) throw new Error(`Missing Sprint 2 geographic read-model view ${id}`);
  return view;
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/eip/enterpriseKnowledgeQualityEngine.ts
