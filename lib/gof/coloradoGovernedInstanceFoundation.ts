import {
  assessEnterpriseKnowledgeQuality,
  qualityInputFromGeographicView,
  type EnterpriseKnowledgeQualityAssessment,
} from "../eip/enterpriseKnowledgeQualityEngine.js";
import {
  createEipSprint4InternalGeographicActivationReadinessLedger,
  type EipSprint4LedgerEntry,
  type EipSprint4ReadinessLedger,
} from "../eip/internalGeographicActivationReadinessLedger.js";
import {
  createApprovalRequest,
  generateAuditHistory,
  generateExecutiveReviewPacket,
  recordApprovalDecision,
  type EnterpriseKnowledgeApprovalAuditEvent,
  type EnterpriseKnowledgeApprovalDecisionRecord,
  type EnterpriseKnowledgeApprovalRequest,
  type EnterpriseKnowledgeExecutiveReviewPacket,
} from "../eip/enterpriseKnowledgeApprovalSystem.js";
import {
  EIP_SPRINT_2_READ_MODEL_VERSION,
  EIP_SPRINT_2_RETRIEVAL_TIMESTAMP,
  validateEipSprint2ReadModelView,
  type EipSprint2InternalGeographicView,
} from "../eip/internalGeographicReadModel.js";
import { GIO_SAFE_ELIGIBILITY_DEFAULTS, buildGioObjectIdempotencyKey, validateGioObjectCreateInput } from "../gio/persistence.js";

export const GOF_WAVE_2_VERSION = "GOF_1.0_WAVE_2_COLORADO_GOVERNED_INSTANCE_FOUNDATION_V1";
export const GOF_WAVE_2_ASSESSMENT_TIMESTAMP = "2026-07-26T00:00:00.000Z";
export const GOF_WAVE_2_COLORADO_CANDIDATE_ID = "GOF_WAVE_2|STATE|COLORADO|GOVERNED_INSTANCE_CANDIDATE";

export type GofWave2AuthorityDomain =
  | "STATE_GOVERNMENT"
  | "STATE_GEOSPATIAL"
  | "FEDERAL_STATISTICAL"
  | "FEDERAL_GEOGRAPHIC";

export type GofWave2EvidenceItem = Readonly<{
  evidenceId: string;
  provider: "State of Colorado" | "Colorado GIS" | "U.S. Census Bureau" | "USGS/GNIS";
  providerInventory: "PROJECT ATLAS - REAL ESTATE DATA TOOLS";
  sourceIdentifier: string;
  authorityDomain: GofWave2AuthorityDomain;
  evidenceType: "IDENTITY" | "ALIAS" | "CLASSIFICATION" | "BOUNDARY_REFERENCE";
  sourceValue: string;
  effectiveDate: string;
  acquisitionDate: typeof GOF_WAVE_2_ASSESSMENT_TIMESTAMP;
  provenance: "REVIEWED_REPOSITORY_FIXTURE";
  confidence: "HIGH";
  licensingUseLimitations: string;
  refreshExpectation: "ANNUAL_REVIEW" | "EVENT_DRIVEN_REVIEW";
  conflictStatus: "NO_MATERIAL_CONFLICT";
  productionEligible: false;
}>;

export type GofWave2ColoradoIdentity = Readonly<{
  enterpriseCandidateId: typeof GOF_WAVE_2_COLORADO_CANDIDATE_ID;
  objectType: "STATE";
  canonicalName: "Colorado";
  displayName: "Colorado";
  canonicalSlug: "colorado";
  aliases: readonly ["Colorado", "CO", "State of Colorado"];
  officialSourceIdentifiers: readonly ["US-CO", "ANSI_STATE_CODE_08", "GNIS_STATE_COLORADO"];
  authorityDomain: "STATE_GOVERNMENT";
  lifecycleStatus: "GOVERNED_INTERNAL_CANDIDATE";
  effectivePeriod: { startsAt: "1876-08-01"; endsAt: null };
  provenance: "REVIEWED_REPOSITORY_FIXTURE";
  idempotencyKey: string;
}>;

export type GofWave2ColoradoMapping = Readonly<{
  mappingId: "GOF_WAVE_2_MAPPING|STATE|COLORADO";
  enterpriseDomainRole: "COLORADO_STATEWIDE_ROOT_CANDIDATE";
  objectType: "STATE";
  currentEnterpriseRootInstanceCandidate: true;
  automaticUniversalParent: false;
  subordinateRelationshipTypesDeferred: readonly ["WITHIN", "CONTAINS", "OVERLAPS", "PARTIAL_CONTAINMENT"];
  relationshipsCreated: 0;
  mappingEligibility: "INTERNAL_PREVIEW_ONLY";
}>;

export type GofWave2BoundaryState = Readonly<{
  productionPersistenceAuthorized: false;
  productionRetrievalAuthorized: false;
  relationshipsAuthorized: false;
  runtimeActivationAuthorized: false;
  customerVisibilityAuthorized: false;
  searchIntegrationAuthorized: false;
  mapIntegrationAuthorized: false;
  propertyIntelligenceIntegrationAuthorized: false;
  aiIntegrationAuthorized: false;
  executiveIntelligenceIntegrationAuthorized: false;
}>;

export type GofWave2ColoradoFoundation = Readonly<{
  version: typeof GOF_WAVE_2_VERSION;
  assessmentTimestamp: typeof GOF_WAVE_2_ASSESSMENT_TIMESTAMP;
  identity: GofWave2ColoradoIdentity;
  evidence: readonly GofWave2EvidenceItem[];
  readModelView: EipSprint2InternalGeographicView;
  mapping: GofWave2ColoradoMapping;
  quality: EnterpriseKnowledgeQualityAssessment;
  readinessLedger: EipSprint4ReadinessLedger;
  readinessEntry: EipSprint4LedgerEntry;
  approvalRequest: EnterpriseKnowledgeApprovalRequest;
  approvalPacket: EnterpriseKnowledgeExecutiveReviewPacket;
  approvalDecision: EnterpriseKnowledgeApprovalDecisionRecord;
  auditHistory: readonly EnterpriseKnowledgeApprovalAuditEvent[];
  boundaries: GofWave2BoundaryState;
}>;

export function buildGofWave2ColoradoGovernedInstanceFoundation(): GofWave2ColoradoFoundation {
  const identity = buildColoradoIdentity();
  const evidence = buildColoradoEvidence();
  const readModelView = buildColoradoReadModelView(identity, evidence);
  const quality = assessEnterpriseKnowledgeQuality(qualityInputFromGeographicView(readModelView));
  const readinessLedger = createEipSprint4InternalGeographicActivationReadinessLedger([readModelView]);
  const readinessEntry = requiredReadinessEntry(readinessLedger);
  const approvalRequest = createApprovalRequest({
    approvalRequestId: "GOF_WAVE_2_APPROVAL_REQUEST|STATE|COLORADO|INTERNAL_GOVERNED_SUBJECT",
    domain: "GEOGRAPHIC_INTELLIGENCE",
    subjectType: "KNOWLEDGE_OBJECT",
    subjectId: identity.enterpriseCandidateId,
    requestedApprovalType: "APPROVE_FOR_INTERNAL_PROOF",
    requestedNextStage: "Approve Colorado as governed enterprise subject candidate for internal lifecycle proof only.",
    submittingAuthority: "DOMAIN_STEWARD",
    businessRationale: "Establish the statewide domain root candidate required for future governed geographic work.",
    customerValueRationale: "Prevent premature customer-facing geographic claims by requiring governed subject evidence first.",
    enterpriseValueRationale: "Create reusable state-subject governance evidence before any persistence, retrieval, or relationship decision.",
    scopeBoundaries: Object.freeze([
      "Internal governed subject candidate only",
      "No production persistence",
      "No production retrieval",
      "No relationships",
      "No runtime activation",
      "No customer visibility",
    ]),
    supportingReadinessLedgerEntryIds: Object.freeze([readinessEntry.ledgerEntryId]),
    supportingQualityAssessmentRefs: Object.freeze([`quality:${quality.overallInternalStatus}:${quality.overallScore}`]),
    supportingSourceAndTrustEvidence: Object.freeze(evidence.map((item) => item.evidenceId)),
    knownBlockers: readinessEntry.blockingConditions,
    knownWarnings: readinessEntry.warnings,
    unresolvedConflicts: Object.freeze([]),
    requiredReviewers: Object.freeze(["DATA_GOVERNANCE_REVIEWER", "LEGAL_OR_LICENSING_REVIEWER"]),
    decisionDeadlineOrReviewWindow: "2026-10-25T00:00:00.000Z",
    prohibitedOutcomes: Object.freeze([
      "DO_NOT_CREATE_PRODUCTION_PERSISTENCE",
      "DO_NOT_ENABLE_PRODUCTION_RETRIEVAL",
      "DO_NOT_CREATE_RELATIONSHIPS",
      "DO_NOT_ACTIVATE_RUNTIME",
      "DO_NOT_EXPOSE_TO_CUSTOMERS",
      "DO_NOT_CHANGE_SEARCH",
      "DO_NOT_CHANGE_MAPS",
      "DO_NOT_ENABLE_PROPERTY_INTELLIGENCE",
      "DO_NOT_ENABLE_AI_CONSUMPTION",
      "DO_NOT_ENABLE_EXECUTIVE_INTELLIGENCE_CONSUMPTION",
    ]),
  });
  const approvalPacket = generateExecutiveReviewPacket(approvalRequest, readinessLedger);
  const approvalDecision = recordApprovalDecision({
    request: approvalRequest,
    packet: approvalPacket,
    decisionId: "GOF_WAVE_2_APPROVAL_DECISION|STATE|COLORADO|INTERNAL_GOVERNED_SUBJECT",
    decision: "APPROVED_FOR_DEFINED_NEXT_STEP",
    decisionRationale: "Colorado may be treated as an approved internal governed subject candidate only; approval excludes production persistence, retrieval, relationships, runtime activation, and customer visibility.",
    decisionAuthority: "CHIEF_ENTERPRISE_ARCHITECT|PROJECT_ATLAS_INTERNAL_FIXTURE",
    authorityRole: "CHIEF_ENTERPRISE_ARCHITECT",
    conditions: Object.freeze([
      "Maintain non-production fixture status",
      "Require separate persistence authorization",
      "Require separate relationship authorization",
      "Require separate retrieval authorization",
    ]),
    restrictions: Object.freeze([
      "No production row",
      "No relationship row",
      "No runtime route",
      "No customer visibility",
      "No downstream integration",
    ]),
    permittedNextAction: "Prepare separate controlled Colorado persistence-planning authorization package; do not persist Colorado.",
  });
  const auditHistory = generateAuditHistory(approvalRequest, approvalPacket, [approvalDecision]);

  return Object.freeze({
    version: GOF_WAVE_2_VERSION,
    assessmentTimestamp: GOF_WAVE_2_ASSESSMENT_TIMESTAMP,
    identity,
    evidence,
    readModelView,
    mapping: buildColoradoMapping(),
    quality,
    readinessLedger,
    readinessEntry,
    approvalRequest,
    approvalPacket,
    approvalDecision,
    auditHistory,
    boundaries: buildBoundaryState(),
  });
}

function buildColoradoIdentity(): GofWave2ColoradoIdentity {
  const identity = validateGioObjectCreateInput({
    objectType: "STATE",
    canonicalName: "Colorado",
    displayName: "Colorado",
    canonicalSlug: "colorado",
  });
  return Object.freeze({
    enterpriseCandidateId: GOF_WAVE_2_COLORADO_CANDIDATE_ID,
    objectType: "STATE",
    canonicalName: "Colorado",
    displayName: "Colorado",
    canonicalSlug: "colorado",
    aliases: ["Colorado", "CO", "State of Colorado"] as const,
    officialSourceIdentifiers: ["US-CO", "ANSI_STATE_CODE_08", "GNIS_STATE_COLORADO"] as const,
    authorityDomain: "STATE_GOVERNMENT",
    lifecycleStatus: "GOVERNED_INTERNAL_CANDIDATE",
    effectivePeriod: Object.freeze({ startsAt: "1876-08-01", endsAt: null }),
    provenance: "REVIEWED_REPOSITORY_FIXTURE",
    idempotencyKey: buildGioObjectIdempotencyKey(identity),
  });
}

function buildColoradoEvidence(): readonly GofWave2EvidenceItem[] {
  return Object.freeze([
    evidence("IDENTITY", "State of Colorado", "US-CO", "STATE_GOVERNMENT", "Colorado is the canonical state name.", "EVENT_DRIVEN_REVIEW", "Official state identity fixture."),
    evidence("ALIAS", "State of Colorado", "CO", "STATE_GOVERNMENT", "CO is the postal abbreviation alias.", "EVENT_DRIVEN_REVIEW", "Official abbreviation fixture."),
    evidence("CLASSIFICATION", "U.S. Census Bureau", "ANSI_STATE_CODE_08", "FEDERAL_STATISTICAL", "Colorado is represented as a state-level geography.", "ANNUAL_REVIEW", "Federal statistical identity fixture."),
    evidence("BOUNDARY_REFERENCE", "Colorado GIS", "COLORADO_STATE_BOUNDARY_REFERENCE", "STATE_GEOSPATIAL", "Statewide boundary evidence is referenced for future governed geometry review.", "ANNUAL_REVIEW", "Boundary reference fixture; no geometry imported."),
    evidence("IDENTITY", "USGS/GNIS", "GNIS_STATE_COLORADO", "FEDERAL_GEOGRAPHIC", "GNIS identity corroborates Colorado as a state place subject.", "ANNUAL_REVIEW", "Federal geographic-name fixture."),
  ]);
}

function evidence(
  evidenceType: GofWave2EvidenceItem["evidenceType"],
  provider: GofWave2EvidenceItem["provider"],
  sourceIdentifier: string,
  authorityDomain: GofWave2AuthorityDomain,
  sourceValue: string,
  refreshExpectation: GofWave2EvidenceItem["refreshExpectation"],
  licensingUseLimitations: string,
): GofWave2EvidenceItem {
  return Object.freeze({
    evidenceId: `GOF_WAVE_2_EVIDENCE|STATE|COLORADO|${evidenceType}|${sourceIdentifier}`,
    provider,
    providerInventory: "PROJECT ATLAS - REAL ESTATE DATA TOOLS",
    sourceIdentifier,
    authorityDomain,
    evidenceType,
    sourceValue,
    effectiveDate: "2026-07-26",
    acquisitionDate: GOF_WAVE_2_ASSESSMENT_TIMESTAMP,
    provenance: "REVIEWED_REPOSITORY_FIXTURE",
    confidence: "HIGH",
    licensingUseLimitations,
    refreshExpectation,
    conflictStatus: "NO_MATERIAL_CONFLICT",
    productionEligible: false as const,
  });
}

function buildColoradoReadModelView(
  identity: GofWave2ColoradoIdentity,
  evidence: readonly GofWave2EvidenceItem[],
): EipSprint2InternalGeographicView {
  const view: EipSprint2InternalGeographicView = Object.freeze({
    identity: {
      id: identity.enterpriseCandidateId,
      objectType: identity.objectType,
      canonicalName: identity.canonicalName,
      displayName: identity.displayName,
      canonicalSlug: identity.canonicalSlug,
    },
    classification: {
      knowledgeClassification: "AUTHORITATIVE_FACT",
      intelligenceDomain: "GEOGRAPHIC_IDENTITY",
    },
    trust: {
      trustState: "TRUST_VALIDATED_FOR_INTERNAL_PROOF",
      authority: "INTERNAL_PROOF_ONLY",
      confidence: "HIGH",
      freshness: "FRESH",
    },
    source: {
      sourceClass: "AUTHORITATIVE_GOVERNMENT",
      sourceAsset: "PROJECT ATLAS - REAL ESTATE DATA TOOLS",
      repositoryLocation: "lib/gof/coloradoGovernedInstanceFoundation.ts",
      sourceValue: evidence.map((item) => item.sourceIdentifier).join("|"),
      sourceRequirementResult: "Reviewed authoritative state and federal identity evidence; no material conflict found; no geometry imported.",
    },
    governance: {
      lifecycle: "INTERNAL_PROOF_ONLY",
      eligibility: Object.freeze({
        ...GIO_SAFE_ELIGIBILITY_DEFAULTS,
        internalPersistenceProofEligible: true as const,
        customerEligible: false as const,
      }),
      reviewStatus: "APPROVED_AS_PREVIEW_CANDIDATE",
      mappingEligibility: "INTERNAL_PREVIEW_ONLY",
      editorialSeparationEnforced: true,
      restrictedKnowledgeInternalOnly: true,
      noCustomerRetrievalPath: true,
      noSearchVisibility: true,
      noMapVisibility: true,
      noSeoVisibility: true,
      noPageVisibility: true,
      noRuntimeActivation: true,
      noPersistenceMutation: true,
    },
    relationships: {
      aliases: identity.aliases,
      relatedObjects: Object.freeze(["state-root-candidate:COLORADO", "relationship:DEFERRED", "conflict:NONE", "ambiguity:NONE"]),
      relatedObservations: Object.freeze(evidence.map((item) => item.evidenceId)),
    },
    metadata: {
      internalVersion: EIP_SPRINT_2_READ_MODEL_VERSION,
      retrievalTimestamp: EIP_SPRINT_2_RETRIEVAL_TIMESTAMP,
      retrievalStatus: "FOUND",
      sourceDecisionId: "GOF_WAVE_2_DECISION_SOURCE|STATE|COLORADO",
      sourceQueueItemId: "GOF_WAVE_2_MAPPING_QUEUE|STATE|COLORADO",
      sourcePreviewRecordId: "GOF_WAVE_2_PREVIEW|STATE|COLORADO",
    },
  });
  validateEipSprint2ReadModelView(view);
  return view;
}

function buildColoradoMapping(): GofWave2ColoradoMapping {
  return Object.freeze({
    mappingId: "GOF_WAVE_2_MAPPING|STATE|COLORADO",
    enterpriseDomainRole: "COLORADO_STATEWIDE_ROOT_CANDIDATE",
    objectType: "STATE",
    currentEnterpriseRootInstanceCandidate: true,
    automaticUniversalParent: false,
    subordinateRelationshipTypesDeferred: ["WITHIN", "CONTAINS", "OVERLAPS", "PARTIAL_CONTAINMENT"] as const,
    relationshipsCreated: 0,
    mappingEligibility: "INTERNAL_PREVIEW_ONLY",
  });
}

function buildBoundaryState(): GofWave2BoundaryState {
  return Object.freeze({
    productionPersistenceAuthorized: false,
    productionRetrievalAuthorized: false,
    relationshipsAuthorized: false,
    runtimeActivationAuthorized: false,
    customerVisibilityAuthorized: false,
    searchIntegrationAuthorized: false,
    mapIntegrationAuthorized: false,
    propertyIntelligenceIntegrationAuthorized: false,
    aiIntegrationAuthorized: false,
    executiveIntelligenceIntegrationAuthorized: false,
  });
}

function requiredReadinessEntry(ledger: EipSprint4ReadinessLedger): EipSprint4LedgerEntry {
  const entry = ledger.entries.find((item) =>
    item.knowledgeObjectId === GOF_WAVE_2_COLORADO_CANDIDATE_ID &&
    item.gate === "INTERNAL_MAPPING"
  );
  if (!entry) throw new Error("GOF Wave 2 Colorado readiness entry missing");
  return entry;
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/gof/coloradoGovernedInstanceFoundation.ts
