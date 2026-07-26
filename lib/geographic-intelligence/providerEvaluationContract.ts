import { type GeographicIntelligenceActivationState, type GeographicIntelligenceFreshness, type GeographicIntelligencePermittedUse } from "./activationContract.js";
import { type GeographicIntelligenceDomainId } from "./domainContract.js";
import { type GisEvidenceAuthorityClassification, type GisEvidenceLicensingClassification, type GisEvidenceQuality } from "./evidenceProvenanceContract.js";
import { type GisGeographicCoverageType, type GisProviderInventoryEntry } from "./providerInventoryContract.js";

export const GIS_1_0_SPRINT_5_AUTHORIZATION = "GIS_1_0_SPRINT_5_PROVIDER_EVALUATION_AND_SELECTION_GOVERNANCE_AUTHORIZED";
export const GIS_1_0_SPRINT_5_CLASSIFICATION = "PROVIDER_EVALUATION_AND_SELECTION_GOVERNANCE";
export const GIS_1_0_SPRINT_5_CERTIFICATION = "GIS_1_0_SPRINT_5_PROVIDER_EVALUATION_AND_SELECTION_GOVERNANCE_CERTIFIED";
export const GIS_SPRINT_5_SCORING_MODEL_ID = "GIS_SPRINT_5_PROVIDER_EVALUATION_SCORING_MODEL";
export const GIS_SPRINT_5_SCORING_MODEL_VERSION = "1.0.0";
export const GIS_SPRINT_5_EVALUATION_VERSION = "GIS_SPRINT_5_PROVIDER_EVALUATION_V1";
export const GIS_SPRINT_5_REFERENCE_DATE = "2026-07-26";
export const GIS_SPRINT_5_BOUNDARY_NOTE = "PROVIDER_EVALUATION_DOES_NOT_AUTHORIZE_PROVIDER_USE";

export type GisProviderEvaluationCriterionId =
  | "SOURCE_AUTHORITY"
  | "SUBJECT_RELEVANCE"
  | "DOMAIN_RELEVANCE"
  | "GEOGRAPHIC_COVERAGE"
  | "EVIDENCE_COMPLETENESS"
  | "FRESHNESS_POTENTIAL"
  | "QUALITY_POTENTIAL"
  | "LICENSING_CERTAINTY"
  | "PERMITTED_USE_CERTAINTY"
  | "ATTRIBUTION_BURDEN"
  | "TECHNICAL_ACCESS_CERTAINTY"
  | "CONTRACT_COMPLEXITY"
  | "COMMERCIAL_COST"
  | "IMPLEMENTATION_COMPLEXITY"
  | "CONTINUITY_RISK"
  | "DEPENDENCY_RISK"
  | "OVERLAP_OR_REDUNDANCY"
  | "UNIQUE_VALUE_CONTRIBUTION"
  | "RESILIENCE_CONTRIBUTION"
  | "CURRENT_VERIFICATION_STATE"
  | "PRIVACY_SECURITY_RISK"
  | "CUSTOMER_VALUE_POTENTIAL"
  | "EXPLAINABILITY"
  | "AUDITABILITY";

export type GisProviderEvaluationGateId =
  | "LICENSING_GATE"
  | "PERMITTED_USE_GATE"
  | "CAPABILITY_RELEVANCE_GATE"
  | "GEOGRAPHIC_COVERAGE_GATE"
  | "VERIFICATION_GATE"
  | "LEGAL_REVIEW_GATE"
  | "PRIVACY_SECURITY_GATE"
  | "TECHNICAL_FEASIBILITY_GATE"
  | "CONFLICT_OF_INTEREST_DISCLOSURE_GATE";

export type GisProviderEvaluationGateState = "PASS" | "CONDITIONAL" | "FAIL" | "UNKNOWN" | "NOT_APPLICABLE";
export type GisProviderEvaluationConflictState = "NONE_KNOWN" | "KNOWN_CONFLICT" | "UNKNOWN";

export type GisProviderEvaluationDisposition =
  | "NOT_EVALUATED"
  | "INSUFFICIENT_EVIDENCE"
  | "OUTSIDE_CAPABILITY_SCOPE"
  | "OPERATIONAL_TOOL_ONLY"
  | "RESEARCH_REFERENCE_ONLY"
  | "GOVERNANCE_REVIEW_REQUIRED"
  | "AUTHORITY_REVIEW_REQUIRED"
  | "LICENSING_REVIEW_REQUIRED"
  | "LEGAL_REVIEW_REQUIRED"
  | "TECHNICAL_REVIEW_REQUIRED"
  | "COMMERCIAL_REVIEW_REQUIRED"
  | "DEFERRED"
  | "REJECTED"
  | "RETAINED_AS_FALLBACK_CANDIDATE"
  | "RETAINED_AS_SUPPLEMENTAL_CANDIDATE"
  | "SELECTED_FOR_CONTROLLED_PROVIDER_DUE_DILIGENCE"
  | "FAILED_CLOSED_MANDATORY_GATE";

export type GisProviderMinimumSetClassification = "PROPOSED_MINIMUM_PROVIDER_SET_FOR_DUE_DILIGENCE";

export type GisProviderEvaluationCriterion = Readonly<{
  criterionId: GisProviderEvaluationCriterionId;
  label: string;
  weight: number;
  direction: "BENEFIT" | "BURDEN";
  unknownTreatment: "UNCERTAINTY_PENALTY" | "GOVERNANCE_BLOCK";
}>;

export type GisProviderEvaluationScore = Readonly<{
  criterionId: GisProviderEvaluationCriterionId;
  rawScore: number | "UNKNOWN";
  normalizedScore: number;
  weight: number;
  weightedContribution: number;
  evidenceReference: string;
}>;

export type GisProviderEvaluationGate = Readonly<{
  gateId: GisProviderEvaluationGateId;
  state: GisProviderEvaluationGateState;
  rationale: string;
}>;

export type GisProviderCapabilityRequirement = Readonly<{
  capabilityRequirementId: string;
  evaluationSubject: string;
  intendedInternalUse: "INTERNAL_GOVERNANCE_EVALUATION_ONLY";
  geographicCoverageRequirement: GisGeographicCoverageType;
  jurisdictionRequirement: string;
  requiredDomains: readonly GeographicIntelligenceDomainId[];
  requiredEvidenceCategories: readonly string[];
  requiredAuthorityLevel: GisEvidenceAuthorityClassification;
  minimumFreshnessExpectation: GeographicIntelligenceFreshness;
  minimumQualityExpectation: GisEvidenceQuality;
  licensingRequirement: GisEvidenceLicensingClassification;
  permittedUseRequirement: GeographicIntelligencePermittedUse;
  attributionConstraints: "UNKNOWN_ALLOWED_ONLY_AS_GATE";
  customerDisplayRequired: false;
  redistributionRequired: false;
  technicalAccessRequirement: "EVALUATION_ONLY_UNKNOWN_ALLOWED";
  continuityRequirement: "GOVERNANCE_REVIEW_REQUIRED";
  resilienceRequirement: "AT_LEAST_ONE_AUTHORITY_AND_ONE_FALLBACK_OR_SUPPLEMENTAL";
  budgetClassification: "UNKNOWN";
  implementationComplexityTolerance: "LOW" | "MODERATE" | "HIGH";
}>;

export type GisProviderCandidateEvaluation = Readonly<{
  inventoryEntryId: string;
  candidateCanonicalName: string;
  entityTypes: GisProviderInventoryEntry["entityTypes"];
  providerRoles: GisProviderInventoryEntry["providerRoles"];
  verificationState: GisProviderInventoryEntry["verificationState"];
  authorityAssessment: GisEvidenceAuthorityClassification;
  geographicCoverageAssessment: GisGeographicCoverageType;
  domainRelevance: readonly GeographicIntelligenceDomainId[];
  evidenceCategoryRelevance: readonly string[];
  freshnessAssessment: GeographicIntelligenceFreshness;
  qualityAssessment: GisEvidenceQuality | "UNKNOWN";
  licensingCertainty: GisEvidenceLicensingClassification;
  permittedUseCertainty: GeographicIntelligencePermittedUse;
  attributionRequirement: GisProviderInventoryEntry["attributionRequired"];
  technicalAccessCertainty: "UNKNOWN" | "LOW" | "MODERATE" | "HIGH";
  contractRequirement: GisProviderInventoryEntry["contractRequired"];
  accountRequirement: GisProviderInventoryEntry["accountOrMembershipRequired"];
  authenticationRequirement: GisProviderInventoryEntry["authenticationRequired"];
  costClassification: GisProviderInventoryEntry["costClassification"];
  implementationComplexity: "LOW" | "MODERATE" | "HIGH" | "UNKNOWN";
  dependencyRisk: readonly string[];
  continuityRisk: "UNKNOWN" | "LOW" | "MODERATE" | "HIGH";
  overlapReferences: readonly string[];
  uniqueValueAssessment: "NONE" | "LOW" | "MODERATE" | "HIGH" | "UNKNOWN";
  resilienceContribution: "NONE" | "LOW" | "MODERATE" | "HIGH" | "UNKNOWN";
  legalReviewRequired: boolean;
  commercialReviewRequired: boolean;
  technicalReviewRequired: boolean;
  authorityReviewRequired: boolean;
  dataGovernanceReviewRequired: boolean;
  knownUnknowns: readonly string[];
  disqualifyingConditions: readonly string[];
  criterionScores: readonly GisProviderEvaluationScore[];
  mandatoryGates: readonly GisProviderEvaluationGate[];
  weightedScore: number;
  confidenceInEvaluation: "LOW" | "MODERATE" | "HIGH";
  disposition: GisProviderEvaluationDisposition;
  rank: number;
  rationale: string;
  evidenceReferences: readonly string[];
  reconsiderationConditions: readonly string[];
  conflictOfInterestState: GisProviderEvaluationConflictState;
  internalOnly: true;
  activation: GeographicIntelligenceActivationState;
  customerDisplayAuthorized: false;
  redistributionAuthorized: false;
}>;

export type GisProviderMinimumProviderSet = Readonly<{
  setId: string;
  classification: GisProviderMinimumSetClassification;
  capabilityRequirementId: string;
  candidateInventoryEntryIds: readonly string[];
  evidenceCategoriesCovered: readonly string[];
  overlapPreserved: boolean;
  resilienceRationale: string;
  unresolvedGates: readonly string[];
  dueDiligenceOnly: true;
  providerUseAuthorized: false;
  activation: GeographicIntelligenceActivationState;
}>;

export type GisProviderEvaluationRecord = Readonly<{
  evaluationId: string;
  evaluationVersion: string;
  capabilityRequirement: GisProviderCapabilityRequirement;
  evaluationDate: typeof GIS_SPRINT_5_REFERENCE_DATE;
  evaluationEvidenceReferences: readonly string[];
  evaluatorIdentity: "PROJECT_ATLAS_GIS_SPRINT_5_FIXTURE_GOVERNANCE";
  conflictOfInterestState: GisProviderEvaluationConflictState;
  scoringModelId: typeof GIS_SPRINT_5_SCORING_MODEL_ID;
  scoringModelVersion: typeof GIS_SPRINT_5_SCORING_MODEL_VERSION;
  criteria: readonly GisProviderEvaluationCriterion[];
  candidateEvaluations: readonly GisProviderCandidateEvaluation[];
  recommendedMinimumProviderSet: GisProviderMinimumProviderSet;
  decisionRationale: string;
  finalGovernanceDisposition: "PROVIDER_EVALUATION_ONLY";
  deterministicFingerprint: string;
  internalOnly: true;
  activation: GeographicIntelligenceActivationState;
  customerDisplayAuthorized: false;
  redistributionAuthorized: false;
}>;

export type GisProviderEvaluationScenarioResult =
  | "SELECTED_FOR_CONTROLLED_PROVIDER_DUE_DILIGENCE"
  | "LICENSING_REVIEW_REQUIRED"
  | "COMMERCIAL_REVIEW_REQUIRED"
  | "RESEARCH_REFERENCE_ONLY"
  | "OPERATIONAL_TOOL_ONLY"
  | "OUTSIDE_CAPABILITY_SCOPE"
  | "RETAINED_AS_FALLBACK_CANDIDATE"
  | "RETAINED_AS_SUPPLEMENTAL_CANDIDATE"
  | "INSUFFICIENT_EVIDENCE"
  | "REJECTED"
  | "PROPOSED_MINIMUM_PROVIDER_SET_FOR_DUE_DILIGENCE"
  | "DETERMINISTIC_TIE_RESOLVED"
  | "GOVERNANCE_REVIEW_REQUIRED"
  | "TECHNICAL_REVIEW_REQUIRED"
  | "FAILED_CLOSED_MANDATORY_GATE";
