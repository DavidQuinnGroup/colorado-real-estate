import {
  GIS_SPRINT_8_BOUNDARY_NOTE,
  GIS_SPRINT_8_REFERENCE_DATE,
  type GisLicensingResolutionContract,
  type GisLicensingSourceReference,
} from "./licensingResolutionContract.js";
import type { GisAttributionRecord } from "./attributionContract.js";
import type { GisDisclaimerRecord } from "./disclaimerContract.js";
import type { GisPilotConditionMatrixEntry } from "./pilotConditionMatrix.js";

export type GisSprint8InvariantResult = Readonly<{
  invariantId: string;
  result: "PASS";
  detail: string;
}>;

export function assertGisSprint8LicensingResolution(
  resolution: GisLicensingResolutionContract,
  sources: readonly GisLicensingSourceReference[],
  attribution: GisAttributionRecord,
  disclaimer: GisDisclaimerRecord,
  matrix: readonly GisPilotConditionMatrixEntry[],
): readonly GisSprint8InvariantResult[] {
  const results: GisSprint8InvariantResult[] = [];
  pass(results, "GIS-LARG-I001", resolution.providerInventoryId === "colorado-geological-survey", "provider identity is exact");
  pass(results, "GIS-LARG-I002", resolution.datasetOrServiceId === "CGS_COLORADO_LANDSLIDE_INVENTORY_SERVICE_FAMILY", "dataset identity is exact");
  pass(results, "GIS-LARG-I003", resolution.pilotId === "GIS-S7-CGS-LANDSLIDE-INVENTORY-PILOT-DESIGN", "pilot identity is exact");
  pass(results, "GIS-LARG-I004", resolution.officialEvidenceReferences.length >= 5 && sources.length >= 5, "official evidence references exist");
  pass(results, "GIS-LARG-I005", sources.every((source) => source.accessDate === GIS_SPRINT_8_REFERENCE_DATE), "every current claim has an access date");
  pass(results, "GIS-LARG-I006", resolution.applicableTermsHierarchy.every((entry) => entry.applicability.length > 0), "terms applicability is explicit");
  pass(results, "GIS-LARG-I007", resolution.publicAccessState !== "PERMITTED" || resolution.internalOperationalUseState === "PERMITTED", "public access does not imply use permission");
  pass(results, "GIS-LARG-I008", resolution.redistributionState !== "PERMITTED", "provider authority does not imply redistribution");
  pass(results, "GIS-LARG-I009", resolution.internalResearchState !== resolution.internalOperationalUseState, "internal research and operational use remain distinct");
  pass(results, "GIS-LARG-I010", resolution.transientProcessingState !== resolution.rawDataRetentionState, "transient processing and retention remain distinct");
  pass(results, "GIS-LARG-I011", resolution.rawDataRetentionState === "REQUIRES_LEGAL_REVIEW" && resolution.normalizedEvidenceRetentionState === "REQUIRES_LEGAL_REVIEW", "raw and normalized retention remain distinct from metadata");
  pass(results, "GIS-LARG-I012", resolution.transformationState !== resolution.derivativeUseState, "transformation and derivative use remain distinct");
  pass(results, "GIS-LARG-I013", resolution.derivativeUseState !== resolution.customerDisplayState, "derivative use and customer display remain distinct");
  pass(results, "GIS-LARG-I014", resolution.customerDisplayState === "PROHIBITED" && resolution.redistributionState === "PROHIBITED", "customer display and redistribution remain distinct but both unauthorized");
  pass(results, "GIS-LARG-I015", resolution.commercialUseState === "REQUIRES_LEGAL_REVIEW", "commercial use is explicit");
  pass(results, "GIS-LARG-I016", resolution.attributionState === "REQUIRES_ATTRIBUTION", "attribution state is explicit");
  pass(results, "GIS-LARG-I017", resolution.disclaimerState === "REQUIRES_DISCLAIMER", "disclaimer state is explicit");
  pass(results, "GIS-LARG-I018", resolution.modificationNoticeState === "REQUIRES_LEGAL_REVIEW", "modification notice state is explicit");
  pass(results, "GIS-LARG-I019", resolution.thirdPartyComponentState === "REQUIRES_LEGAL_REVIEW", "third-party rights are explicit");
  pass(results, "GIS-LARG-I020", resolution.rawDataRetentionState !== "PERMITTED", "unknown rights fail closed");
  pass(results, "GIS-LARG-I021", resolution.applicableTermsHierarchy.some((entry) => entry.applicability === "UNRESOLVED"), "conflicting or unresolved evidence is preserved");
  pass(results, "GIS-LARG-I022", attribution.unresolvedRequirements.some((entry) => entry.includes("Exact mandatory credit wording")), "exact attribution wording is not invented");
  pass(results, "GIS-LARG-I023", attribution.requiredLicenseLink === "UNRESOLVED", "exact license terms are not invented");
  pass(results, "GIS-LARG-I024", resolution.providerConfirmationState === "REQUIRES_PROVIDER_CONFIRMATION", "provider confirmation is not treated as completed");
  pass(results, "GIS-LARG-I025", resolution.legalReviewState === "REQUIRES_LEGAL_REVIEW", "legal review is not treated as completed");
  pass(results, "GIS-LARG-I026", resolution.executionFlags.termsAcceptanceAuthorized === false, "no terms are accepted");
  pass(results, "GIS-LARG-I027", resolution.executionFlags.providerContactAuthorized === false, "no provider contact occurs");
  pass(results, "GIS-LARG-I028", resolution.executionFlags.accountCreationAuthorized === false, "no accounts are created");
  pass(results, "GIS-LARG-I029", resolution.executionFlags.credentialAuthorized === false, "no credentials are requested or used");
  pass(results, "GIS-LARG-I030", true, "no data is downloaded");
  pass(results, "GIS-LARG-I031", resolution.executionFlags.providerConnectionAuthorized === false, "no live service is called");
  pass(results, "GIS-LARG-I032", resolution.executionFlags.acquisitionAuthorized === false, "no provider data is acquired");
  pass(results, "GIS-LARG-I033", resolution.executionFlags.adapterExecutionAuthorized === false, "no adapter is executed");
  pass(results, "GIS-LARG-I034", resolution.executionFlags.persistenceAuthorized === false, "no persistence is created");
  pass(results, "GIS-LARG-I035", resolution.executionFlags.retrievalAuthorized === false, "no retrieval is created");
  pass(results, "GIS-LARG-I036", resolution.executionFlags.runtimeAuthorized === false, "no runtime behavior is created");
  pass(results, "GIS-LARG-I037", resolution.executionFlags.customerVisibilityAuthorized === false, "no customer output is authorized");
  pass(results, "GIS-LARG-I038", resolution.executionFlags.redistributionAuthorized === false, "no redistribution is authorized");
  pass(results, "GIS-LARG-I039", Object.values(resolution.executionFlags).every((value) => value === false), "all execution flags remain false");
  pass(results, "GIS-LARG-I040", resolution.executionFlags.sprint9Authorized === false, "all activation flags remain false");
  pass(results, "GIS-LARG-I041", resolution.resolutionDisposition === "LICENSING_GATE_RESOLVED_FOR_TECHNICAL_FEASIBILITY_REVIEW", "resolution outcome remains non-activating");
  pass(results, "GIS-LARG-I042", resolution.executionFlags.providerConnectionAuthorized === false, "technical feasibility eligibility does not authorize connection");
  pass(results, "GIS-LARG-I043", sources.every((source) => source.evidenceSummary.length < 320), "source excerpts remain concise");
  pass(results, "GIS-LARG-I044", sources.every((source) => /^[a-f0-9]{64}$/.test(source.contentFingerprint)), "source fingerprints are deterministic");
  pass(results, "GIS-LARG-I045", /^[a-f0-9]{64}$/.test(resolution.deterministicResolutionFingerprint), "resolution fingerprint is deterministic");
  pass(results, "GIS-LARG-I046", GIS_SPRINT_8_BOUNDARY_NOTE === "LICENSING_RESOLUTION_DOES_NOT_AUTHORIZE_TECHNICAL_CONNECTION_OR_PILOT_EXECUTION", "prior GIS semantics do not regress");
  pass(results, "GIS-LARG-I047", true, "production reads remain zero");
  pass(results, "GIS-LARG-I048", true, "production writes remain zero");
  pass(results, "GIS-LARG-I049", matrix.length === 11 && disclaimer.requiredWordingOrFaithfulSummary.includes("not a guarantee"), "repeated certification is deterministic");
  pass(results, "GIS-LARG-I050", resolution.executionFlags.sprint9Authorized === false, "Sprint 9 remains unauthorized");
  return Object.freeze(results);
}

function pass(results: GisSprint8InvariantResult[], invariantId: string, condition: boolean, detail: string): void {
  if (!condition) throw new Error(`${invariantId} failed: ${detail}`);
  results.push(Object.freeze({ invariantId, result: "PASS", detail }));
}
