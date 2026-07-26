export const GIS_1_0_SPRINT_8_AUTHORIZATION = "GIS_1_0_SPRINT_8_LICENSING_AND_ATTRIBUTION_RESOLUTION_GATE_AUTHORIZED";
export const GIS_1_0_SPRINT_8_CLASSIFICATION = "LICENSING_AND_ATTRIBUTION_RESOLUTION_GATE";
export const GIS_1_0_SPRINT_8_CERTIFICATION = "GIS_1_0_SPRINT_8_LICENSING_AND_ATTRIBUTION_RESOLUTION_GATE_CERTIFIED";
export const GIS_SPRINT_8_IMPLEMENTATION_VERSION = "GIS_1_0_SPRINT_8_LICENSING_ATTRIBUTION_RESOLUTION_V1";
export const GIS_SPRINT_8_REFERENCE_DATE = "2026-07-26";
export const GIS_SPRINT_8_BOUNDARY_NOTE = "LICENSING_RESOLUTION_DOES_NOT_AUTHORIZE_TECHNICAL_CONNECTION_OR_PILOT_EXECUTION";

export type GisLicensingRightsState =
  | "UNKNOWN"
  | "NOT_ADDRESSED"
  | "PERMITTED"
  | "PERMITTED_WITH_CONDITIONS"
  | "RESTRICTED"
  | "PROHIBITED"
  | "REQUIRES_ATTRIBUTION"
  | "REQUIRES_DISCLAIMER"
  | "REQUIRES_LEGAL_REVIEW"
  | "REQUIRES_PROVIDER_CONFIRMATION"
  | "CONFLICTING_OFFICIAL_EVIDENCE"
  | "NOT_APPLICABLE";

export type GisLicensingResolutionDisposition =
  | "NOT_RESEARCHED"
  | "INSUFFICIENT_OFFICIAL_EVIDENCE"
  | "TERMS_APPLICABILITY_UNRESOLVED"
  | "LICENSING_REVIEW_REQUIRED"
  | "LEGAL_REVIEW_REQUIRED"
  | "ATTRIBUTION_REQUIREMENTS_IDENTIFIED"
  | "DISCLAIMER_REQUIREMENTS_IDENTIFIED"
  | "TRANSIENT_INTERNAL_PILOT_USE_CONDITIONALLY_SUPPORTED"
  | "INTERNAL_OPERATIONAL_USE_CONDITIONALLY_SUPPORTED"
  | "DERIVATIVE_USE_CONDITIONALLY_SUPPORTED"
  | "CUSTOMER_DISPLAY_NOT_SUPPORTED"
  | "REDISTRIBUTION_NOT_SUPPORTED"
  | "PROVIDER_CONFIRMATION_REQUIRED"
  | "CONFLICTING_OFFICIAL_EVIDENCE"
  | "LICENSING_GATE_RESOLVED_FOR_TECHNICAL_FEASIBILITY_REVIEW";

export type GisLicensingScenarioResult =
  | GisLicensingResolutionDisposition
  | "FAILED_CLOSED_RAW_RETENTION_UNRESOLVED"
  | "FAILED_CLOSED_ATTRIBUTION_REQUIRED"
  | "FAILED_CLOSED_DISCLAIMER_REQUIRED"
  | "FAILED_CLOSED_CUSTOMER_DISPLAY_NOT_AUTHORIZED"
  | "FAILED_CLOSED_REDISTRIBUTION_NOT_AUTHORIZED"
  | "FAILED_CLOSED_EXECUTION_AUTHORIZATION_FALSE"
  | "ZERO_PROVIDER_CONTACT_AND_ZERO_DATA_ACQUISITION";

export type GisLicensingSourceType =
  | "OFFICIAL_DATASET_PAGE"
  | "OFFICIAL_PROVIDER_GIS_PORTAL"
  | "OFFICIAL_PROVIDER_DISCLAIMER"
  | "OFFICIAL_STATE_TERMS"
  | "OFFICIAL_STATE_REPOSITORY_POLICY";

export type GisTermsHierarchyEntry = Readonly<{
  hierarchyLevel: "DATASET_SPECIFIC" | "PORTAL_WIDE" | "AGENCY_WIDE" | "STATE_WIDE" | "THIRD_PARTY_COMPONENT" | "METADATA_NOTICE" | "DISCLAIMER";
  referenceId: string;
  applicability: "DIRECT" | "CONDITIONAL" | "NOT_APPLICABLE" | "UNRESOLVED";
  conclusion: string;
}>;

export type GisLicensingSourceReference = Readonly<{
  referenceId: string;
  providerOrAuthority: string;
  title: string;
  officialPublisher: string;
  url: string;
  accessDate: typeof GIS_SPRINT_8_REFERENCE_DATE;
  publicationOrUpdatedDate: string;
  sourceType: GisLicensingSourceType;
  applicabilityScope: string;
  evidenceSummary: string;
  rightsFindingSupported: GisLicensingRightsState;
  attributionFindingSupported: GisLicensingRightsState;
  disclaimerFindingSupported: GisLicensingRightsState;
  confidence: "HIGH" | "MODERATE" | "LOW";
  verificationState: "OFFICIAL_SOURCE_VERIFIED" | "APPLICABILITY_CONDITIONAL" | "DATASET_SPECIFIC_NOTICE_VERIFIED" | "DISCLAIMER_VERIFIED";
  contentFingerprint: string;
  unresolvedAmbiguity: readonly string[];
}>;

export type GisLicensingExecutionFlags = Readonly<{
  providerContactAuthorized: false;
  accountCreationAuthorized: false;
  credentialAuthorized: false;
  termsAcceptanceAuthorized: false;
  providerConnectionAuthorized: false;
  acquisitionAuthorized: false;
  adapterExecutionAuthorized: false;
  persistenceAuthorized: false;
  retrievalAuthorized: false;
  enterpriseConsumptionAuthorized: false;
  runtimeAuthorized: false;
  downstreamAuthorized: false;
  customerVisibilityAuthorized: false;
  redistributionAuthorized: false;
  relationshipCreationAuthorized: false;
  hierarchyInferenceAuthorized: false;
  coloradoRuntimeConsumptionAuthorized: false;
  sprint9Authorized: false;
}>;

export type GisLicensingResolutionContract = Readonly<{
  resolutionId: string;
  resolutionVersion: typeof GIS_SPRINT_8_IMPLEMENTATION_VERSION;
  providerInventoryId: "colorado-geological-survey";
  providerCanonicalName: "Colorado Geological Survey";
  datasetOrServiceId: "CGS_COLORADO_LANDSLIDE_INVENTORY_SERVICE_FAMILY";
  datasetOrServiceName: "Colorado Landslide Inventory";
  pilotId: "GIS-S7-CGS-LANDSLIDE-INVENTORY-PILOT-DESIGN";
  officialEvidenceReferences: readonly string[];
  applicableTermsHierarchy: readonly GisTermsHierarchyEntry[];
  publicAccessState: GisLicensingRightsState;
  internalResearchState: GisLicensingRightsState;
  internalOperationalUseState: GisLicensingRightsState;
  transientProcessingState: GisLicensingRightsState;
  rawDataRetentionState: GisLicensingRightsState;
  normalizedEvidenceRetentionState: GisLicensingRightsState;
  metadataRetentionState: GisLicensingRightsState;
  transformationState: GisLicensingRightsState;
  derivativeUseState: GisLicensingRightsState;
  commercialUseState: GisLicensingRightsState;
  attributionState: GisLicensingRightsState;
  disclaimerState: GisLicensingRightsState;
  modificationNoticeState: GisLicensingRightsState;
  sourceLinkRequirement: GisLicensingRightsState;
  logoOrTrademarkRequirement: GisLicensingRightsState;
  redistributionState: GisLicensingRightsState;
  customerDisplayState: GisLicensingRightsState;
  thirdPartyComponentState: GisLicensingRightsState;
  legalReviewState: GisLicensingRightsState;
  licensingReviewState: GisLicensingRightsState;
  providerConfirmationState: GisLicensingRightsState;
  unresolvedQuestions: readonly string[];
  conditions: readonly string[];
  prohibitions: readonly string[];
  resolutionDisposition: GisLicensingResolutionDisposition;
  evidenceFingerprint: string;
  deterministicResolutionFingerprint: string;
  executionFlags: GisLicensingExecutionFlags;
  internalOnly: true;
}>;

export type GisLicensingScenarioResults = Readonly<{
  scenarioA: GisLicensingScenarioResult;
  scenarioB: GisLicensingScenarioResult;
  scenarioC: GisLicensingScenarioResult;
  scenarioD: GisLicensingScenarioResult;
  scenarioE: GisLicensingScenarioResult;
  scenarioF: GisLicensingScenarioResult;
  scenarioG: GisLicensingScenarioResult;
  scenarioH: GisLicensingScenarioResult;
  scenarioI: GisLicensingScenarioResult;
  scenarioJ: GisLicensingScenarioResult;
  scenarioK: GisLicensingScenarioResult;
  scenarioL: GisLicensingScenarioResult;
  scenarioM: GisLicensingScenarioResult;
  scenarioN: GisLicensingScenarioResult;
}>;
