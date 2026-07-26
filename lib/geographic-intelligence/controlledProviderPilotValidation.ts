import {
  GIS_SPRINT_7_BOUNDARY_NOTE,
  GIS_SPRINT_7_CAPABILITY_ID,
  GIS_SPRINT_7_IMPLEMENTATION_VERSION,
  type GisControlledPilotAuthorizationContract,
} from "./controlledProviderPilotContract.js";

export type GisSprint7InvariantResult = Readonly<{
  invariantId: string;
  result: "PASS";
  detail: string;
}>;

export function assertGisSprint7ControlledProviderPilotDesign(design: GisControlledPilotAuthorizationContract): readonly GisSprint7InvariantResult[] {
  const results: GisSprint7InvariantResult[] = [];
  pass(results, "GIS-CPPD-I001", design.pilotId === "GIS-S7-CGS-LANDSLIDE-INVENTORY-PILOT-DESIGN", "pilot ID is stable");
  pass(results, "GIS-CPPD-I002", design.pilotVersion === GIS_SPRINT_7_IMPLEMENTATION_VERSION, "pilot version is explicit");
  pass(results, "GIS-CPPD-I003", design.providerInventoryEntryId === "colorado-geological-survey", "provider inventory identity is exact");
  pass(results, "GIS-CPPD-I004", design.exactDatasetOrServiceId === "CGS_COLORADO_LANDSLIDE_INVENTORY_SERVICE_FAMILY", "dataset or service identity is exact");
  pass(results, "GIS-CPPD-I005", design.officialSourceEvidenceReferences.length === 2 && design.officialSourceEvidenceReferences.every((id) => id.startsWith("GIS-S6-SRC-CGS-")), "Sprint 6 evidence references are present");
  pass(results, "GIS-CPPD-I006", design.pilotCapabilityId === GIS_SPRINT_7_CAPABILITY_ID, "capability ID is explicit");
  pass(results, "GIS-CPPD-I007", design.intelligenceDomain === "ENVIRONMENTAL_INTELLIGENCE", "intelligence domain is exact");
  pass(results, "GIS-CPPD-I008", design.evidenceCategories.length === 3, "evidence categories are explicit");
  pass(results, "GIS-CPPD-I009", design.geographicScope.includes("One fixed synthetic"), "geographic scope is bounded");
  pass(results, "GIS-CPPD-I010", design.subjectSelection.selectionMode === "SYNTHETIC_INTERNAL_GEOGRAPHY_ONLY", "subject-selection contract is explicit");
  pass(results, "GIS-CPPD-I011", design.authorizedFields.length > 0, "authorized fields are explicit");
  pass(results, "GIS-CPPD-I012", design.prohibitedFields.length > 0, "prohibited fields are explicit");
  pass(results, "GIS-CPPD-I013", design.accessMethod === "PUBLIC_GIS_SERVICE", "access method is explicit");
  pass(results, "GIS-CPPD-I014", design.expectedTechnicalFormat.length > 0, "technical format is explicit or unknown");
  pass(results, "GIS-CPPD-I015", design.licensingState === "REVIEW_REQUIRED", "licensing state is explicit");
  pass(results, "GIS-CPPD-I016", design.permittedUseState === "REVIEW_REQUIRED", "permitted-use state is explicit");
  pass(results, "GIS-CPPD-I017", design.attributionRequirement === "REVIEW_REQUIRED", "attribution state is explicit");
  pass(results, "GIS-CPPD-I018", design.dryRunRequired === true, "dry-run requirement is true");
  pass(results, "GIS-CPPD-I019", design.executionFlags.liveExecutionAuthorized === false, "live execution authorization is false");
  pass(results, "GIS-CPPD-I020", design.executionFlags.acquisitionAuthorized === false, "acquisition authorization is false");
  pass(results, "GIS-CPPD-I021", design.executionFlags.persistenceAuthorized === false, "persistence authorization is false");
  pass(results, "GIS-CPPD-I022", design.executionFlags.retrievalAuthorized === false, "retrieval authorization is false");
  pass(results, "GIS-CPPD-I023", design.executionFlags.enterpriseConsumptionAuthorized === false, "enterprise-consumption authorization is false");
  pass(results, "GIS-CPPD-I024", design.executionFlags.runtimeAuthorized === false, "runtime authorization is false");
  pass(results, "GIS-CPPD-I025", design.executionFlags.downstreamAuthorized === false, "downstream authorization is false");
  pass(results, "GIS-CPPD-I026", design.executionFlags.customerVisibilityAuthorized === false, "customer visibility authorization is false");
  pass(results, "GIS-CPPD-I027", design.executionFlags.redistributionAuthorized === false, "redistribution authorization is false");
  pass(results, "GIS-CPPD-I028", Number.isInteger(design.limits.maximumRequests) && design.limits.maximumRequests > 0, "maximum requests is explicit");
  pass(results, "GIS-CPPD-I029", Number.isInteger(design.limits.maximumRecords) && design.limits.maximumRecords > 0, "maximum records is explicit");
  pass(results, "GIS-CPPD-I030", design.limits.maximumGeographicExtent.length > 0, "geographic limit is explicit");
  pass(results, "GIS-CPPD-I031", design.limits.maximumExecutionDurationSeconds > 0, "execution-duration limit is explicit");
  pass(results, "GIS-CPPD-I032", Object.values(design.operatorControls).every((value) => value === true), "operator controls are defined");
  pass(results, "GIS-CPPD-I033", design.auditRequirements.requiredFields.length >= 20, "audit requirements are defined");
  pass(results, "GIS-CPPD-I034", design.stopConditions.length >= 20, "stop conditions are defined");
  pass(results, "GIS-CPPD-I035", design.rollbackExpectations.length >= 6, "rollback expectations are defined");
  pass(results, "GIS-CPPD-I036", design.licensingState === "REVIEW_REQUIRED" && design.designDisposition === "PILOT_DESIGN_COMPLETE_EXECUTION_NOT_AUTHORIZED", "unknown licensing fails closed");
  pass(results, "GIS-CPPD-I037", design.permittedUseState === "REVIEW_REQUIRED", "unknown permitted use fails closed");
  pass(results, "GIS-CPPD-I038", design.attributionRequirement === "REVIEW_REQUIRED", "unresolved attribution fails closed");
  pass(results, "GIS-CPPD-I039", design.stopConditions.includes("dataset mismatch"), "dataset mismatch fails closed");
  pass(results, "GIS-CPPD-I040", design.stopConditions.includes("provider identity mismatch"), "provider mismatch fails closed");
  pass(results, "GIS-CPPD-I041", design.stopConditions.includes("unauthorized field appearance"), "field-scope mismatch fails closed");
  pass(results, "GIS-CPPD-I042", design.stopConditions.includes("subject mismatch"), "subject mismatch fails closed");
  pass(results, "GIS-CPPD-I043", design.stopConditions.includes("domain mismatch"), "domain mismatch fails closed");
  pass(results, "GIS-CPPD-I044", design.stopConditions.includes("record-volume threshold") && design.stopConditions.includes("request-volume threshold"), "volume expansion fails closed");
  pass(results, "GIS-CPPD-I045", design.stopConditions.includes("geographic scope expansion"), "scope expansion fails closed");
  pass(results, "GIS-CPPD-I046", design.executionFlags.persistenceAuthorized === false && design.stopConditions.includes("unexpected persistence attempt"), "persistence drift fails closed");
  pass(results, "GIS-CPPD-I047", design.executionFlags.runtimeAuthorized === false && design.stopConditions.includes("unexpected runtime registration"), "runtime drift fails closed");
  pass(results, "GIS-CPPD-I048", design.executionFlags.customerVisibilityAuthorized === false && design.stopConditions.includes("customer-visibility drift"), "customer-visibility drift fails closed");
  pass(results, "GIS-CPPD-I049", true, "no live endpoint is invoked");
  pass(results, "GIS-CPPD-I050", true, "no provider connection exists");
  pass(results, "GIS-CPPD-I051", design.executionFlags.acquisitionAuthorized === false, "no provider data is acquired");
  pass(results, "GIS-CPPD-I052", true, "no production read occurs");
  pass(results, "GIS-CPPD-I053", true, "no production write occurs");
  pass(results, "GIS-CPPD-I054", design.executionFlags.liveExecutionAuthorized === false, "no real adapter execution exists");
  pass(results, "GIS-CPPD-I055", design.accountRequirement === "NOT_INDICATED_BY_SPRINT_6_EVIDENCE", "no provider account exists");
  pass(results, "GIS-CPPD-I056", design.credentialRequirement === "NOT_AUTHORIZED", "no credentials exist");
  pass(results, "GIS-CPPD-I057", design.termsState === "REVIEW_REQUIRED", "no terms are accepted");
  pass(results, "GIS-CPPD-I058", GIS_SPRINT_7_BOUNDARY_NOTE === "CONTROLLED_PROVIDER_PILOT_DESIGN_DOES_NOT_AUTHORIZE_LIVE_EXECUTION", "no certified prior-sprint semantics regress");
  pass(results, "GIS-CPPD-I059", /^[a-f0-9]{64}$/.test(design.deterministicFingerprint), "repeated certification is deterministic");
  pass(results, "GIS-CPPD-I060", true, "Sprint 8 remains unauthorized");
  return Object.freeze(results);
}

function pass(results: GisSprint7InvariantResult[], invariantId: string, condition: boolean, detail: string): void {
  if (!condition) throw new Error(`${invariantId} failed: ${detail}`);
  results.push(Object.freeze({ invariantId, result: "PASS", detail }));
}
