import { type GeographicIntelligenceActivationState } from "./activationContract.js";

export const GIS_1_0_SPRINT_6_AUTHORIZATION = "GIS_1_0_SPRINT_6_CONTROLLED_PROVIDER_DUE_DILIGENCE_AUTHORIZED";
export const GIS_1_0_SPRINT_6_CLASSIFICATION = "CONTROLLED_PROVIDER_DUE_DILIGENCE";
export const GIS_1_0_SPRINT_6_CERTIFICATION = "GIS_1_0_SPRINT_6_CONTROLLED_PROVIDER_DUE_DILIGENCE_CERTIFIED";
export const GIS_SPRINT_6_IMPLEMENTATION_VERSION = "GIS_1_0_SPRINT_6_CONTROLLED_PROVIDER_DUE_DILIGENCE_V1";
export const GIS_SPRINT_6_REFERENCE_DATE = "2026-07-26";
export const GIS_SPRINT_6_BOUNDARY_NOTE = "CONTROLLED_PROVIDER_DUE_DILIGENCE_DOES_NOT_AUTHORIZE_PROVIDER_USE";
export const GIS_SPRINT_6_EVALUATION_SUBJECT = "ENVIRONMENTAL_GEOGRAPHIC_EVIDENCE_PROVIDER_EVALUATION";

export type GisDueDiligenceFindingCategory =
  | "PROVIDER_IDENTITY"
  | "AUTHORITY_IDENTITY"
  | "DATASET_IDENTITY"
  | "GEOGRAPHIC_COVERAGE"
  | "SUBJECT_COVERAGE"
  | "EVIDENCE_CATEGORY"
  | "PUBLICATION_FREQUENCY"
  | "UPDATE_CADENCE"
  | "ACCESS_METHOD"
  | "FILE_FORMAT"
  | "API_DOCUMENTATION"
  | "GIS_SERVICE"
  | "AUTHENTICATION"
  | "ACCOUNT_REQUIREMENT"
  | "COST"
  | "LICENSE"
  | "TERMS"
  | "ATTRIBUTION"
  | "DERIVATIVE_USE"
  | "CUSTOMER_DISPLAY"
  | "REDISTRIBUTION"
  | "DATA_QUALITY"
  | "METADATA_QUALITY"
  | "DOCUMENTATION_QUALITY"
  | "CONTINUITY"
  | "DEPRECATION"
  | "TECHNICAL_LIMITATION"
  | "LEGAL_QUESTION"
  | "COMMERCIAL_QUESTION"
  | "UNKNOWN";

export type GisDueDiligenceVerificationState =
  | "NOT_RESEARCHED"
  | "OFFICIAL_SOURCE_IDENTIFIED"
  | "OFFICIAL_DOCUMENTATION_VERIFIED"
  | "CURRENT_AVAILABILITY_VERIFIED"
  | "DATASET_IDENTITY_VERIFIED"
  | "ACCESS_METHOD_VERIFIED"
  | "LICENSING_STATEMENT_IDENTIFIED"
  | "TERMS_IDENTIFIED"
  | "ATTRIBUTION_REQUIREMENT_IDENTIFIED"
  | "TECHNICAL_FORMAT_VERIFIED"
  | "PARTIALLY_VERIFIED"
  | "CONFLICTING_EVIDENCE"
  | "HISTORICAL_ONLY"
  | "VERIFICATION_REQUIRED"
  | "UNRESOLVED";

export type GisDueDiligenceDisposition =
  | "NOT_RESEARCHED"
  | "INSUFFICIENT_OFFICIAL_EVIDENCE"
  | "OUTSIDE_CAPABILITY_SCOPE"
  | "DUPLICATIVE_WITH_STRONGER_SOURCE"
  | "SUPPLEMENTAL_SOURCE_ONLY"
  | "FALLBACK_SOURCE_CANDIDATE"
  | "LICENSING_REVIEW_REQUIRED"
  | "LEGAL_REVIEW_REQUIRED"
  | "TECHNICAL_REVIEW_REQUIRED"
  | "COMMERCIAL_REVIEW_REQUIRED"
  | "DEFERRED"
  | "REJECTED"
  | "RETAINED_FOR_MONITORING"
  | "RECOMMENDED_FOR_CONTROLLED_PROVIDER_PILOT_AUTHORIZATION_REVIEW";

export type GisDueDiligenceSourceContentCategory =
  | "OFFICIAL_PROVIDER_PAGE"
  | "OFFICIAL_DATASET_CATALOG"
  | "OFFICIAL_API_DOCUMENTATION"
  | "OFFICIAL_GIS_SERVICE_DOCUMENTATION"
  | "OFFICIAL_TERMS_LICENSE_POLICY"
  | "OFFICIAL_AGENCY_PUBLICATION"
  | "OFFICIAL_TECHNICAL_REFERENCE";

export type GisDueDiligenceAuthorityClassification =
  | "OFFICIAL_PROVIDER_OR_GOVERNMENT_SOURCE"
  | "OFFICIAL_GOVERNMENT_CATALOG"
  | "OFFICIAL_TECHNICAL_SERVICE_METADATA"
  | "SUPPLEMENTAL_OFFICIAL_CONTEXT";

export type GisDueDiligenceProviderRole =
  | "ORIGINATING_AUTHORITY"
  | "PUBLISHER"
  | "DISTRIBUTOR"
  | "TECHNICAL_SERVICE_HOST"
  | "SUPPORTING_SOURCE_CLASS";

export type GisDueDiligenceReviewState =
  | "NOT_REQUIRED"
  | "REQUIRED"
  | "REQUIRED_BEFORE_ANY_PILOT"
  | "UNKNOWN";

export type GisDueDiligenceRightsState =
  | "NOT_STATED"
  | "PUBLIC_DOMAIN_STATED"
  | "PUBLIC_ACCESS_STATED"
  | "ATTRIBUTION_STATED"
  | "TERMS_STATED"
  | "REVIEW_REQUIRED"
  | "UNKNOWN";

export type GisDueDiligenceAccessState =
  | "PUBLIC_WEBPAGE"
  | "PUBLIC_DATASET_CATALOG"
  | "PUBLIC_API_DOCUMENTATION"
  | "PUBLIC_GIS_SERVICE_DOCUMENTATION"
  | "PUBLIC_DOWNLOAD_DOCUMENTATION"
  | "PUBLIC_DOCUMENTATION_ONLY"
  | "ACCOUNT_OR_KEY_INDICATED"
  | "UNKNOWN";

export type GisDueDiligenceFinding = Readonly<{
  findingId: string;
  provider: string;
  sourceReferenceIds: readonly string[];
  category: GisDueDiligenceFindingCategory;
  summary: string;
  confidence: "LOW" | "MODERATE" | "HIGH";
  verificationState: GisDueDiligenceVerificationState;
  unresolvedQuestions: readonly string[];
  material: boolean;
}>;

export type GisDueDiligenceSourceReference = Readonly<{
  referenceId: string;
  providerOrAuthority: string;
  title: string;
  officialPublisher: string;
  url: string;
  accessDate: typeof GIS_SPRINT_6_REFERENCE_DATE;
  publishedOrUpdatedDate: string | "UNKNOWN";
  contentCategory: GisDueDiligenceSourceContentCategory;
  evidenceSummary: string;
  verificationState: GisDueDiligenceVerificationState;
  authorityClassification: GisDueDiligenceAuthorityClassification;
  contentFingerprint: string;
  notes: readonly string[];
}>;

export type GisDueDiligenceAuthorizationFlags = Readonly<{
  providerUseAuthorized: false;
  providerApprovalAuthorized: false;
  providerContactAuthorized: false;
  accountCreationAuthorized: false;
  credentialAuthorized: false;
  termsAcceptanceAuthorized: false;
  contractAuthorized: false;
  purchaseAuthorized: false;
  dataAcquisitionAuthorized: false;
  liveAdapterAuthorized: false;
  persistenceAuthorized: false;
  retrievalAuthorized: false;
  runtimeAuthorized: false;
  downstreamIntegrationAuthorized: false;
  customerVisibilityAuthorized: false;
  redistributionAuthorized: false;
  relationshipCreationAuthorized: false;
  hierarchyInferenceAuthorized: false;
  sprint7Authorized: false;
}>;

export type GisProviderDueDiligenceRecord = Readonly<{
  dueDiligenceId: string;
  version: typeof GIS_SPRINT_6_IMPLEMENTATION_VERSION;
  evaluationSubjectId: typeof GIS_SPRINT_6_EVALUATION_SUBJECT;
  providerInventoryEntryId: string;
  canonicalProviderName: string;
  exactSourceOrDatasetReviewed: string;
  providerRole: GisDueDiligenceProviderRole;
  publisher: string;
  originatingAuthority: string;
  jurisdiction: string;
  geographicCoverage: string;
  intelligenceDomains: readonly string[];
  evidenceCategories: readonly string[];
  officialSourceReferenceIds: readonly string[];
  accessDate: typeof GIS_SPRINT_6_REFERENCE_DATE;
  currentVerificationState: GisDueDiligenceVerificationState;
  accessMethod: GisDueDiligenceAccessState;
  authenticationRequirement: "NOT_INDICATED" | "INDICATED" | "UNKNOWN";
  accountRequirement: "NOT_INDICATED" | "INDICATED" | "UNKNOWN";
  costState: "NO_COST_STATED" | "COST_NOT_STATED" | "PAYMENT_INDICATED" | "UNKNOWN";
  licensingState: GisDueDiligenceRightsState;
  permittedUseState: GisDueDiligenceRightsState;
  attributionRequirement: GisDueDiligenceRightsState;
  redistributionState: GisDueDiligenceRightsState;
  derivativeUseState: GisDueDiligenceRightsState;
  customerDisplayState: GisDueDiligenceRightsState;
  updateCadence: string;
  technicalFormats: readonly string[];
  apiOrGisServiceState: GisDueDiligenceAccessState;
  documentationQuality: "LOW" | "MODERATE" | "HIGH" | "UNKNOWN";
  sourceStability: "LOW" | "MODERATE" | "HIGH" | "UNKNOWN";
  continuityRisk: "LOW" | "MODERATE" | "HIGH" | "UNKNOWN";
  technicalUncertainty: readonly string[];
  licensingUncertainty: readonly string[];
  legalReviewRequirement: GisDueDiligenceReviewState;
  commercialReviewRequirement: GisDueDiligenceReviewState;
  technicalReviewRequirement: GisDueDiligenceReviewState;
  evidenceSufficiencyState: "SUFFICIENT_FOR_DUE_DILIGENCE" | "PARTIAL" | "INSUFFICIENT";
  unresolvedQuestions: readonly string[];
  findings: readonly GisDueDiligenceFinding[];
  disposition: GisDueDiligenceDisposition;
  deterministicFingerprint: string;
  internalOnly: true;
  activation: GeographicIntelligenceActivationState;
  authorizationFlags: GisDueDiligenceAuthorizationFlags;
}>;

export type GisDueDiligenceComparisonRecord = Readonly<{
  comparisonId: string;
  evaluationSubjectId: typeof GIS_SPRINT_6_EVALUATION_SUBJECT;
  orderedProviderInventoryEntryIds: readonly string[];
  comparativeFindings: readonly string[];
  revisedProposedMinimumProviderSet: readonly string[];
  pilotAuthorizationReviewCandidates: readonly string[];
  supplementalCandidates: readonly string[];
  fallbackCandidates: readonly string[];
  deferredCandidates: readonly string[];
  rejectedCandidates: readonly string[];
  legalReviewRequirements: readonly string[];
  technicalReviewRequirements: readonly string[];
  commercialReviewRequirements: readonly string[];
  providerUseAuthorized: false;
  deterministicFingerprint: string;
}>;

export type GisDueDiligenceScenarioResults = Readonly<{
  scenarioA: GisDueDiligenceVerificationState;
  scenarioB: GisDueDiligenceVerificationState;
  scenarioC: GisDueDiligenceDisposition;
  scenarioD: GisDueDiligenceVerificationState;
  scenarioE: GisDueDiligenceDisposition;
  scenarioF: GisDueDiligenceVerificationState;
  scenarioG: GisDueDiligenceVerificationState;
  scenarioH: GisDueDiligenceVerificationState;
  scenarioI: GisDueDiligenceDisposition;
  scenarioJ: GisDueDiligenceDisposition;
  scenarioK: GisDueDiligenceDisposition;
  scenarioL: GisDueDiligenceDisposition;
  scenarioM: GisDueDiligenceDisposition;
  scenarioN: "ZERO_PROVIDER_DATA_ACQUISITION";
}>;
