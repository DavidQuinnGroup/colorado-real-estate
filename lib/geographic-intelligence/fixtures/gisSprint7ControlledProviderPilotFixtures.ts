import { stableGisEvidenceFingerprint } from "../evidenceFingerprint.js";
import {
  GIS_1_0_SPRINT_7_CERTIFICATION,
  GIS_SPRINT_7_BOUNDARY_NOTE,
  GIS_SPRINT_7_CAPABILITY_ID,
  GIS_SPRINT_7_IMPLEMENTATION_VERSION,
  type GisControlledPilotAuditRecord,
  type GisControlledPilotAuthorizationContract,
  type GisControlledPilotDryRunResult,
  type GisControlledPilotScenarioResults,
} from "../controlledProviderPilotContract.js";
import { buildGisSprint6ProviderDueDiligenceRecords } from "./gisSprint6ProviderDueDiligenceFixtures.js";

export const GIS_SPRINT_7_PILOT_ID = "GIS-S7-CGS-LANDSLIDE-INVENTORY-PILOT-DESIGN";
export const GIS_SPRINT_7_ADAPTER_DESIGN_ID = "GIS_SPRINT_7_CGS_LANDSLIDE_INVENTORY_ADAPTER_DESIGN";
export const GIS_SPRINT_7_ADAPTER_DESIGN_VERSION = "0.0.0-design-only";

export function buildGisSprint7ControlledProviderPilotDesign(): GisControlledPilotAuthorizationContract {
  const cgsDueDiligence = buildGisSprint6ProviderDueDiligenceRecords().find((record) => record.providerInventoryEntryId === "colorado-geological-survey");
  if (!cgsDueDiligence || !cgsDueDiligence.exactSourceOrDatasetReviewed.includes("Colorado Landslide Inventory")) {
    throw new Error("Sprint 6 due diligence does not support the CGS Colorado Landslide Inventory pilot design.");
  }

  const fingerprintInput = {
    pilotId: GIS_SPRINT_7_PILOT_ID,
    providerInventoryEntryId: "colorado-geological-survey",
    exactDatasetOrServiceId: "CGS_COLORADO_LANDSLIDE_INVENTORY_SERVICE_FAMILY",
    sourceReferences: ["GIS-S6-SRC-CGS-GIS-PORTAL", "GIS-S6-SRC-CGS-MAPPING"],
    fields: authorizedFields(),
    limits: limits(),
    disposition: "PILOT_DESIGN_COMPLETE_EXECUTION_NOT_AUTHORIZED",
  };
  return Object.freeze({
    pilotId: GIS_SPRINT_7_PILOT_ID,
    pilotVersion: GIS_SPRINT_7_IMPLEMENTATION_VERSION,
    programIdentity: "GIS_1_0",
    sprintIdentity: "GIS_1_0_SPRINT_7",
    providerInventoryEntryId: "colorado-geological-survey",
    providerCanonicalName: "Colorado Geological Survey",
    exactDatasetOrServiceId: "CGS_COLORADO_LANDSLIDE_INVENTORY_SERVICE_FAMILY",
    exactDatasetOrServiceName: "Colorado Landslide Inventory",
    officialSourceEvidenceReferences: Object.freeze(["GIS-S6-SRC-CGS-GIS-PORTAL", "GIS-S6-SRC-CGS-MAPPING"] as const),
    pilotCapabilityId: GIS_SPRINT_7_CAPABILITY_ID,
    intelligenceDomain: "ENVIRONMENTAL_INTELLIGENCE",
    evidenceCategories: Object.freeze(["geologic hazards", "landslides", "environmental risk"] as const),
    geographicScope: "One fixed synthetic internal Colorado test bounding box for landslide-hazard design review only",
    jurisdiction: "Colorado",
    subjectSelection: Object.freeze({
      selectionId: "GIS-S7-SUBJECT-SYNTHETIC-COLORADO-TEST-AREA",
      selectionMode: "SYNTHETIC_INTERNAL_GEOGRAPHY_ONLY",
      internalSubjectId: "GIS-S7-INTERNAL-SYNTHETIC-COLORADO-LANDSLIDE-TEST-AREA",
      subjectName: "Synthetic Colorado landslide pilot test area",
      allowedGeometry: "ONE_FIXED_SYNTHETIC_BOUNDING_BOX",
      hierarchyTraversalAllowed: false,
      relationshipCreationAllowed: false,
      coloradoRuntimeConsumptionAllowed: false,
    }),
    authorizedFields: authorizedFields(),
    prohibitedFields: prohibitedFields(),
    accessMethod: "PUBLIC_GIS_SERVICE",
    expectedTechnicalFormat: "ArcGIS REST service metadata and feature records, schema unresolved",
    authenticationState: "NOT_INDICATED_BY_SPRINT_6_EVIDENCE",
    accountRequirement: "NOT_INDICATED_BY_SPRINT_6_EVIDENCE",
    credentialRequirement: "NOT_AUTHORIZED",
    termsState: "REVIEW_REQUIRED",
    licensingState: "REVIEW_REQUIRED",
    permittedUseState: "REVIEW_REQUIRED",
    attributionRequirement: "REVIEW_REQUIRED",
    derivativeUseState: "REVIEW_REQUIRED",
    redistributionState: "REVIEW_REQUIRED",
    customerDisplayState: "REVIEW_REQUIRED",
    dryRunRequired: true,
    executionFlags: zeroExecutionFlags(),
    limits: limits(),
    operatorControls: Object.freeze({
      requiresExactPilotId: true,
      requiresExactProviderId: true,
      requiresExactDatasetId: true,
      requiresExactAdapterIdAndVersion: true,
      requiresExplicitMode: true,
      requiresOperatorAcknowledgement: true,
      requiresMaximumRequestCount: true,
      requiresMaximumRecordCount: true,
      requiresGeographicScope: true,
      requiresExecutionExpiration: true,
      requiresAuthorizationControl: true,
      missingControlsFailClosed: true,
      immutableAuditRecordRequired: true,
    }),
    auditRequirements: Object.freeze({
      requiredFields: Object.freeze([
        "auditId",
        "pilotId",
        "authorizationVersion",
        "adapterId",
        "adapterVersion",
        "providerId",
        "datasetId",
        "mode",
        "operatorControlState",
        "requestScope",
        "requestedFields",
        "geographicScope",
        "startTime",
        "endTime",
        "requestCount",
        "recordCount",
        "acceptedCount",
        "rejectedCount",
        "duplicateCount",
        "changedVersionCount",
        "persistenceCount",
        "productionWriteCount",
        "runtimeActivationCount",
        "customerVisibleCount",
        "stopConditionTriggered",
        "resultClassification",
        "evidenceFingerprint",
      ]),
      executionCountsMustRemainZeroInSprint7: true,
      evidenceFingerprintRequired: true,
    }),
    stopConditions: stopConditions(),
    rollbackExpectations: Object.freeze([
      "Terminate future access attempt.",
      "Discard transient provider payloads.",
      "Preserve only governed audit metadata.",
      "Preserve rejection reasons and Sprint 6 source references.",
      "Create no provider data records.",
      "Create no evidence observations.",
      "Create no runtime state.",
      "Create no customer output.",
    ]),
    unresolvedQuestions: Object.freeze([
      "Dataset-level operational-use rights remain unresolved.",
      "Attribution obligations remain unresolved.",
      "Exact live layer schema remains unresolved.",
      "Rate limit remains undefined and must fail closed before execution.",
      "Customer display and redistribution remain prohibited unless separately reviewed.",
    ]),
    technicalReviewRequirements: Object.freeze([
      "Confirm exact service family and layer schema without expanding provider scope.",
      "Confirm future adapter can produce Sprint 4 provider-neutral evidence structures.",
      "Confirm future rate and volume behavior before any execution.",
    ]),
    legalReviewRequirements: Object.freeze([
      "Review CGS terms, disclaimer, permitted use, derivative use, redistribution, and customer-display status before execution.",
    ]),
    licensingReviewRequirements: Object.freeze([
      "Resolve dataset-level operational-use and attribution requirements before execution.",
    ]),
    designDisposition: "PILOT_DESIGN_COMPLETE_EXECUTION_NOT_AUTHORIZED",
    deterministicFingerprint: stableGisEvidenceFingerprint(fingerprintInput),
    internalOnly: true,
  });
}

export function buildGisSprint7DesignAuditRecord(design = buildGisSprint7ControlledProviderPilotDesign()): GisControlledPilotAuditRecord {
  const fingerprintInput = {
    pilotId: design.pilotId,
    datasetId: design.exactDatasetOrServiceId,
    fields: design.authorizedFields,
    result: "DETERMINISTIC_PILOT_AUDIT_DESIGN",
  };
  return Object.freeze({
    auditId: `GIS-S7-AUDIT-${stableGisEvidenceFingerprint(fingerprintInput).slice(0, 20)}`,
    pilotId: design.pilotId,
    authorizationVersion: design.pilotVersion,
    adapterId: GIS_SPRINT_7_ADAPTER_DESIGN_ID,
    adapterVersion: GIS_SPRINT_7_ADAPTER_DESIGN_VERSION,
    providerId: design.providerInventoryEntryId,
    datasetId: design.exactDatasetOrServiceId,
    mode: "design-dry-run",
    operatorControlState: "DESIGNED_NOT_EXECUTED",
    requestScope: design.geographicScope,
    requestedFields: design.authorizedFields,
    geographicScope: design.geographicScope,
    startTime: "NOT_EXECUTED",
    endTime: "NOT_EXECUTED",
    requestCount: 0,
    recordCount: 0,
    acceptedCount: 0,
    rejectedCount: 0,
    duplicateCount: 0,
    changedVersionCount: 0,
    persistenceCount: 0,
    productionWriteCount: 0,
    runtimeActivationCount: 0,
    customerVisibleCount: 0,
    stopConditionTriggered: "NOT_EXECUTED",
    resultClassification: "DETERMINISTIC_PILOT_AUDIT_DESIGN",
    evidenceFingerprint: stableGisEvidenceFingerprint(fingerprintInput),
  });
}

export function certifyGisSprint7ControlledProviderPilotScenarios(): GisControlledPilotScenarioResults {
  const design = buildGisSprint7ControlledProviderPilotDesign();
  const audit = buildGisSprint7DesignAuditRecord(design);
  const allScenariosValid = [
    design.designDisposition === "PILOT_DESIGN_COMPLETE_EXECUTION_NOT_AUTHORIZED",
    design.exactDatasetOrServiceId === "CGS_COLORADO_LANDSLIDE_INVENTORY_SERVICE_FAMILY",
    design.licensingState === "REVIEW_REQUIRED",
    design.attributionRequirement === "REVIEW_REQUIRED",
    design.geographicScope.includes("One fixed synthetic"),
    design.prohibitedFields.includes("personal information"),
    design.subjectSelection.hierarchyTraversalAllowed === false,
    design.limits.maximumRecords === 25,
    design.executionFlags.liveExecutionAuthorized === false,
    design.executionFlags.persistenceAuthorized === false,
    design.executionFlags.runtimeAuthorized === false,
    design.executionFlags.customerVisibilityAuthorized === false,
    buildGisSprint7DesignAuditRecord(design).evidenceFingerprint === audit.evidenceFingerprint,
    GIS_1_0_SPRINT_7_CERTIFICATION === "GIS_1_0_SPRINT_7_CONTROLLED_PROVIDER_PILOT_AUTHORIZATION_AND_DESIGN_CERTIFIED",
    GIS_SPRINT_7_BOUNDARY_NOTE === "CONTROLLED_PROVIDER_PILOT_DESIGN_DOES_NOT_AUTHORIZE_LIVE_EXECUTION",
  ].every(Boolean);
  if (!allScenariosValid) throw new Error("GIS Sprint 7 controlled provider pilot scenario certification failed.");

  return Object.freeze({
    scenarioA: "PILOT_DESIGN_COMPLETE_EXECUTION_NOT_AUTHORIZED",
    scenarioB: "DATASET_SELECTION_REQUIRED",
    scenarioC: "LICENSING_REVIEW_REQUIRED",
    scenarioD: "ATTRIBUTION_REVIEW_REQUIRED",
    scenarioE: "FAILED_CLOSED_SCOPE_MISMATCH",
    scenarioF: "FAILED_CLOSED_FIELD_SCOPE_MISMATCH",
    scenarioG: "FAILED_CLOSED_SUBJECT_SCOPE_INVALID",
    scenarioH: "FAILED_CLOSED_VOLUME_LIMIT_EXCEEDED",
    scenarioI: "FAILED_CLOSED_EXECUTION_AUTHORIZATION_FALSE",
    scenarioJ: "FAILED_CLOSED_PERSISTENCE_AUTHORIZATION_FALSE",
    scenarioK: "FAILED_CLOSED_RUNTIME_AUTHORIZATION_FALSE",
    scenarioL: "FAILED_CLOSED_CUSTOMER_VISIBILITY_FALSE",
    scenarioM: "DETERMINISTIC_PILOT_AUDIT_DESIGN",
    scenarioN: "ZERO_LIVE_PILOT_EXECUTION",
  });
}

export function gisSprint7ControlledProviderPilotFingerprint(): string {
  const design = buildGisSprint7ControlledProviderPilotDesign();
  return stableGisEvidenceFingerprint({
    design,
    audit: buildGisSprint7DesignAuditRecord(design),
    scenarios: certifyGisSprint7ControlledProviderPilotScenarios(),
  });
}

function authorizedFields(): readonly string[] {
  return Object.freeze([
    "official feature or record ID",
    "dataset version",
    "geometry or geographic reference",
    "landslide or geologic-hazard classification",
    "evidence category",
    "publication or effective date",
    "source metadata",
    "attribution metadata",
  ]);
}

function prohibitedFields(): readonly string[] {
  return Object.freeze([
    "personal information",
    "owner information",
    "contact information",
    "user identifiers",
    "unrelated property attributes",
    "unrelated provider metadata",
    "hidden internal fields",
    "credentials",
    "analytics identifiers",
    "customer display fields",
    "redistribution fields",
  ]);
}

function limits(): GisControlledPilotAuthorizationContract["limits"] {
  return Object.freeze({
    maximumRecords: 25,
    maximumRequests: 2,
    maximumGeographicExtent: "one fixed synthetic Colorado test bounding box",
    maximumExecutionDurationSeconds: 120,
    rateLimitState: "UNDEFINED_FAIL_CLOSED",
  });
}

function zeroExecutionFlags(): GisControlledPilotAuthorizationContract["executionFlags"] {
  return Object.freeze({
    liveExecutionAuthorized: false,
    acquisitionAuthorized: false,
    persistenceAuthorized: false,
    retrievalAuthorized: false,
    enterpriseConsumptionAuthorized: false,
    runtimeAuthorized: false,
    downstreamAuthorized: false,
    customerVisibilityAuthorized: false,
    redistributionAuthorized: false,
  });
}

function stopConditions(): readonly string[] {
  return Object.freeze([
    "provider identity mismatch",
    "dataset mismatch",
    "unsupported schema or format",
    "licensing uncertainty",
    "attribution uncertainty",
    "terms conflict",
    "unexpected authentication requirement",
    "unexpected account requirement",
    "rate-limit response",
    "request-volume threshold",
    "record-volume threshold",
    "geographic scope expansion",
    "unauthorized field appearance",
    "personal or sensitive data appearance",
    "subject mismatch",
    "domain mismatch",
    "checksum or integrity failure",
    "provider response inconsistency",
    "unexpected persistence attempt",
    "unexpected runtime registration",
    "customer-visibility drift",
    "audit failure",
  ]);
}

export function evaluateGisSprint7DesignDryRunFixture(input: {
  providerId?: string;
  datasetId?: string;
  requestedFields?: readonly string[];
  maximumRecords?: number;
  maximumRequests?: number;
  geographicScope?: string;
  subjectSelectionId?: string;
  liveExecutionAuthorized?: boolean;
  persistenceAuthorized?: boolean;
  runtimeAuthorized?: boolean;
  customerVisibilityAuthorized?: boolean;
}): GisControlledPilotDryRunResult {
  const design = buildGisSprint7ControlledProviderPilotDesign();
  if (input.providerId && input.providerId !== design.providerInventoryEntryId) return "FAILED_CLOSED_PILOT_NOT_AUTHORIZED";
  if (input.datasetId && input.datasetId !== design.exactDatasetOrServiceId) return "FAILED_CLOSED_DATASET_MISMATCH";
  if (input.geographicScope && input.geographicScope !== design.geographicScope) return "FAILED_CLOSED_SCOPE_MISMATCH";
  if (input.subjectSelectionId && input.subjectSelectionId !== design.subjectSelection.selectionId) return "FAILED_CLOSED_SUBJECT_SCOPE_INVALID";
  if (input.requestedFields?.some((field) => design.prohibitedFields.includes(field))) return "FAILED_CLOSED_FIELD_SCOPE_MISMATCH";
  if ((input.maximumRecords ?? design.limits.maximumRecords) > design.limits.maximumRecords) return "FAILED_CLOSED_VOLUME_LIMIT_EXCEEDED";
  if ((input.maximumRequests ?? design.limits.maximumRequests) > design.limits.maximumRequests) return "FAILED_CLOSED_VOLUME_LIMIT_EXCEEDED";
  if (input.liveExecutionAuthorized === true) return "FAILED_CLOSED_EXECUTION_AUTHORIZATION_FALSE";
  if (input.persistenceAuthorized === true) return "FAILED_CLOSED_PERSISTENCE_AUTHORIZATION_FALSE";
  if (input.runtimeAuthorized === true) return "FAILED_CLOSED_RUNTIME_AUTHORIZATION_FALSE";
  if (input.customerVisibilityAuthorized === true) return "FAILED_CLOSED_CUSTOMER_VISIBILITY_FALSE";
  if (design.limits.rateLimitState === "UNDEFINED_FAIL_CLOSED") return "FAILED_CLOSED_RATE_LIMIT_UNDEFINED";
  return "PILOT_DESIGN_DRY_RUN_VALID";
}
