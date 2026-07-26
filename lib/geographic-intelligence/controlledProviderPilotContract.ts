export const GIS_1_0_SPRINT_7_AUTHORIZATION = "GIS_1_0_SPRINT_7_CONTROLLED_PROVIDER_PILOT_AUTHORIZATION_AND_DESIGN_AUTHORIZED";
export const GIS_1_0_SPRINT_7_CLASSIFICATION = "CONTROLLED_PROVIDER_PILOT_AUTHORIZATION_AND_DESIGN";
export const GIS_1_0_SPRINT_7_CERTIFICATION = "GIS_1_0_SPRINT_7_CONTROLLED_PROVIDER_PILOT_AUTHORIZATION_AND_DESIGN_CERTIFIED";
export const GIS_SPRINT_7_IMPLEMENTATION_VERSION = "GIS_1_0_SPRINT_7_CONTROLLED_PROVIDER_PILOT_DESIGN_V1";
export const GIS_SPRINT_7_REFERENCE_DATE = "2026-07-26";
export const GIS_SPRINT_7_BOUNDARY_NOTE = "CONTROLLED_PROVIDER_PILOT_DESIGN_DOES_NOT_AUTHORIZE_LIVE_EXECUTION";
export const GIS_SPRINT_7_CAPABILITY_ID = "ENVIRONMENTAL_GEOGRAPHIC_EVIDENCE_PROVIDER_EVALUATION";

export type GisControlledPilotDesignDisposition =
  | "NOT_DESIGNED"
  | "INSUFFICIENT_DUE_DILIGENCE_EVIDENCE"
  | "DATASET_SELECTION_REQUIRED"
  | "LICENSING_REVIEW_REQUIRED"
  | "LEGAL_REVIEW_REQUIRED"
  | "TECHNICAL_REVIEW_REQUIRED"
  | "ATTRIBUTION_REVIEW_REQUIRED"
  | "PILOT_SCOPE_DEFINED"
  | "PILOT_DESIGN_COMPLETE_EXECUTION_NOT_AUTHORIZED"
  | "DEFERRED"
  | "REJECTED";

export type GisControlledPilotAccessDesign =
  | "PUBLIC_WEB_DOCUMENTATION_ONLY"
  | "PUBLIC_FILE_DOWNLOAD"
  | "PUBLIC_GIS_SERVICE"
  | "PUBLIC_API"
  | "AUTHENTICATED_API"
  | "LICENSED_FEED"
  | "MANUAL_EXPORT"
  | "UNKNOWN";

export type GisControlledPilotDryRunResult =
  | "PILOT_DESIGN_DRY_RUN_VALID"
  | "FAILED_CLOSED_PILOT_NOT_AUTHORIZED"
  | "FAILED_CLOSED_DATASET_MISMATCH"
  | "FAILED_CLOSED_SCOPE_MISMATCH"
  | "FAILED_CLOSED_FIELD_SCOPE_MISMATCH"
  | "FAILED_CLOSED_LICENSING_UNRESOLVED"
  | "FAILED_CLOSED_ATTRIBUTION_UNRESOLVED"
  | "FAILED_CLOSED_SUBJECT_SCOPE_INVALID"
  | "FAILED_CLOSED_VOLUME_LIMIT_EXCEEDED"
  | "FAILED_CLOSED_RATE_LIMIT_UNDEFINED"
  | "FAILED_CLOSED_EXECUTION_AUTHORIZATION_FALSE"
  | "FAILED_CLOSED_PERSISTENCE_AUTHORIZATION_FALSE"
  | "FAILED_CLOSED_RUNTIME_AUTHORIZATION_FALSE"
  | "FAILED_CLOSED_CUSTOMER_VISIBILITY_FALSE"
  | "DETERMINISTIC_PILOT_AUDIT_DESIGN"
  | "ZERO_LIVE_PILOT_EXECUTION";

export type GisControlledPilotRightsState =
  | "REVIEW_REQUIRED"
  | "NOT_STATED"
  | "PUBLIC_ACCESS_STATED"
  | "UNKNOWN";

export type GisControlledPilotExecutionFlags = Readonly<{
  liveExecutionAuthorized: false;
  acquisitionAuthorized: false;
  persistenceAuthorized: false;
  retrievalAuthorized: false;
  enterpriseConsumptionAuthorized: false;
  runtimeAuthorized: false;
  downstreamAuthorized: false;
  customerVisibilityAuthorized: false;
  redistributionAuthorized: false;
}>;

export type GisControlledPilotSubjectSelection = Readonly<{
  selectionId: string;
  selectionMode: "SYNTHETIC_INTERNAL_GEOGRAPHY_ONLY";
  internalSubjectId: string;
  subjectName: string;
  allowedGeometry: "ONE_FIXED_SYNTHETIC_BOUNDING_BOX";
  hierarchyTraversalAllowed: false;
  relationshipCreationAllowed: false;
  coloradoRuntimeConsumptionAllowed: false;
}>;

export type GisControlledPilotLimits = Readonly<{
  maximumRecords: number;
  maximumRequests: number;
  maximumGeographicExtent: string;
  maximumExecutionDurationSeconds: number;
  rateLimitState: "UNDEFINED_FAIL_CLOSED";
}>;

export type GisControlledPilotOperatorControls = Readonly<{
  requiresExactPilotId: true;
  requiresExactProviderId: true;
  requiresExactDatasetId: true;
  requiresExactAdapterIdAndVersion: true;
  requiresExplicitMode: true;
  requiresOperatorAcknowledgement: true;
  requiresMaximumRequestCount: true;
  requiresMaximumRecordCount: true;
  requiresGeographicScope: true;
  requiresExecutionExpiration: true;
  requiresAuthorizationControl: true;
  missingControlsFailClosed: true;
  immutableAuditRecordRequired: true;
}>;

export type GisControlledPilotAuditRequirements = Readonly<{
  requiredFields: readonly string[];
  executionCountsMustRemainZeroInSprint7: true;
  evidenceFingerprintRequired: true;
}>;

export type GisControlledPilotAuditRecord = Readonly<{
  auditId: string;
  pilotId: string;
  authorizationVersion: string;
  adapterId: string;
  adapterVersion: string;
  providerId: string;
  datasetId: string;
  mode: "design-dry-run";
  operatorControlState: "DESIGNED_NOT_EXECUTED";
  requestScope: string;
  requestedFields: readonly string[];
  geographicScope: string;
  startTime: "NOT_EXECUTED";
  endTime: "NOT_EXECUTED";
  requestCount: 0;
  recordCount: 0;
  acceptedCount: 0;
  rejectedCount: 0;
  duplicateCount: 0;
  changedVersionCount: 0;
  persistenceCount: 0;
  productionWriteCount: 0;
  runtimeActivationCount: 0;
  customerVisibleCount: 0;
  stopConditionTriggered: "NOT_EXECUTED";
  resultClassification: GisControlledPilotDryRunResult;
  evidenceFingerprint: string;
}>;

export type GisControlledPilotAuthorizationContract = Readonly<{
  pilotId: string;
  pilotVersion: typeof GIS_SPRINT_7_IMPLEMENTATION_VERSION;
  programIdentity: "GIS_1_0";
  sprintIdentity: "GIS_1_0_SPRINT_7";
  providerInventoryEntryId: "colorado-geological-survey";
  providerCanonicalName: "Colorado Geological Survey";
  exactDatasetOrServiceId: "CGS_COLORADO_LANDSLIDE_INVENTORY_SERVICE_FAMILY";
  exactDatasetOrServiceName: "Colorado Landslide Inventory";
  officialSourceEvidenceReferences: readonly ["GIS-S6-SRC-CGS-GIS-PORTAL", "GIS-S6-SRC-CGS-MAPPING"];
  pilotCapabilityId: typeof GIS_SPRINT_7_CAPABILITY_ID;
  intelligenceDomain: "ENVIRONMENTAL_INTELLIGENCE";
  evidenceCategories: readonly ["geologic hazards", "landslides", "environmental risk"];
  geographicScope: string;
  jurisdiction: "Colorado";
  subjectSelection: GisControlledPilotSubjectSelection;
  authorizedFields: readonly string[];
  prohibitedFields: readonly string[];
  accessMethod: GisControlledPilotAccessDesign;
  expectedTechnicalFormat: "ArcGIS REST service metadata and feature records, schema unresolved";
  authenticationState: "NOT_INDICATED_BY_SPRINT_6_EVIDENCE";
  accountRequirement: "NOT_INDICATED_BY_SPRINT_6_EVIDENCE";
  credentialRequirement: "NOT_AUTHORIZED";
  termsState: GisControlledPilotRightsState;
  licensingState: GisControlledPilotRightsState;
  permittedUseState: GisControlledPilotRightsState;
  attributionRequirement: GisControlledPilotRightsState;
  derivativeUseState: GisControlledPilotRightsState;
  redistributionState: GisControlledPilotRightsState;
  customerDisplayState: GisControlledPilotRightsState;
  dryRunRequired: true;
  executionFlags: GisControlledPilotExecutionFlags;
  limits: GisControlledPilotLimits;
  operatorControls: GisControlledPilotOperatorControls;
  auditRequirements: GisControlledPilotAuditRequirements;
  stopConditions: readonly string[];
  rollbackExpectations: readonly string[];
  unresolvedQuestions: readonly string[];
  technicalReviewRequirements: readonly string[];
  legalReviewRequirements: readonly string[];
  licensingReviewRequirements: readonly string[];
  designDisposition: GisControlledPilotDesignDisposition;
  deterministicFingerprint: string;
  internalOnly: true;
}>;

export type GisControlledPilotScenarioResults = Readonly<{
  scenarioA: GisControlledPilotDesignDisposition;
  scenarioB: GisControlledPilotDesignDisposition;
  scenarioC: GisControlledPilotDesignDisposition;
  scenarioD: GisControlledPilotDesignDisposition;
  scenarioE: GisControlledPilotDryRunResult;
  scenarioF: GisControlledPilotDryRunResult;
  scenarioG: GisControlledPilotDryRunResult;
  scenarioH: GisControlledPilotDryRunResult;
  scenarioI: GisControlledPilotDryRunResult;
  scenarioJ: GisControlledPilotDryRunResult;
  scenarioK: GisControlledPilotDryRunResult;
  scenarioL: GisControlledPilotDryRunResult;
  scenarioM: GisControlledPilotDryRunResult;
  scenarioN: GisControlledPilotDryRunResult;
}>;
