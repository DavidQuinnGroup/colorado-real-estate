import { stableGisEvidenceFingerprint } from "../evidenceFingerprint.js";
import type { GisAttributionRecord } from "../attributionContract.js";
import type { GisDisclaimerRecord } from "../disclaimerContract.js";
import type { GisPilotConditionMatrixEntry } from "../pilotConditionMatrix.js";
import {
  GIS_SPRINT_8_IMPLEMENTATION_VERSION,
  GIS_SPRINT_8_REFERENCE_DATE,
  type GisLicensingExecutionFlags,
  type GisLicensingResolutionContract,
  type GisLicensingScenarioResults,
  type GisLicensingSourceReference,
  type GisTermsHierarchyEntry,
} from "../licensingResolutionContract.js";
import { buildGisSprint7ControlledProviderPilotDesign, GIS_SPRINT_7_PILOT_ID } from "./gisSprint7ControlledProviderPilotFixtures.js";

export const GIS_SPRINT_8_RESOLUTION_ID = "GIS-S8-CGS-LANDSLIDE-LICENSING-ATTRIBUTION-RESOLUTION";

export const GIS_SPRINT_8_SOURCE_REFERENCES: readonly GisLicensingSourceReference[] = Object.freeze([
  source(
    "GIS-S8-SRC-CGS-LANDSLIDE-PUBLICATION",
    "Colorado Geological Survey",
    "ON-006-01M Colorado Landslide Inventory (Map) - v20220201",
    "Colorado Geological Survey",
    "https://coloradogeologicalsurvey.org/publications/colorado-landslide-inventory-map/",
    "2022-02-01",
    "OFFICIAL_DATASET_PAGE",
    "Dataset-specific publication page for the selected Colorado Landslide Inventory map.",
    "Identifies the inventory as a GIS map, states GIS data is not available for download, provides limitations, and gives a citation.",
    "PERMITTED_WITH_CONDITIONS",
    "REQUIRES_ATTRIBUTION",
    "REQUIRES_DISCLAIMER",
    "HIGH",
    "DATASET_SPECIFIC_NOTICE_VERIFIED",
    [
      "Exact license link is not stated.",
      "Programmatic access rights are not addressed.",
      "Retention, redistribution, commercial use, and customer display are not expressly granted.",
    ],
  ),
  source(
    "GIS-S8-SRC-CGS-GIS-PORTAL",
    "Colorado Geological Survey",
    "GIS Data and Web Map Portal",
    "Colorado Geological Survey",
    "https://coloradogeologicalsurvey.org/geology/gis-data-map-portal/",
    "UNKNOWN",
    "OFFICIAL_PROVIDER_GIS_PORTAL",
    "CGS GIS portal covering online maps, GIS data packages, REST service families, public-domain REST service language, and the CGS general disclaimer.",
    "Supports public GIS-map discovery, portal-level terms hierarchy, and the general CGS data disclaimer.",
    "PERMITTED_WITH_CONDITIONS",
    "NOT_ADDRESSED",
    "REQUIRES_DISCLAIMER",
    "HIGH",
    "OFFICIAL_SOURCE_VERIFIED",
    [
      "Portal-level public-domain REST language does not by itself settle the exact landslide map service terms.",
      "Third-party map components and ArcGIS platform terms require separate review.",
    ],
  ),
  source(
    "GIS-S8-SRC-CGS-GEOLOGIC-MAPPING",
    "Colorado Geological Survey",
    "Geologic Mapping",
    "Colorado Geological Survey",
    "https://coloradogeologicalsurvey.org/geology/mapping/",
    "UNKNOWN",
    "OFFICIAL_PROVIDER_DISCLAIMER",
    "CGS geologic mapping page with broad GIS context and a detailed CGS data disclaimer.",
    "Supports disclaimer preservation and non-reliance treatment for CGS data or information.",
    "NOT_ADDRESSED",
    "NOT_ADDRESSED",
    "REQUIRES_DISCLAIMER",
    "MODERATE",
    "DISCLAIMER_VERIFIED",
    ["Applicability to this exact online map is supporting rather than dataset-specific."],
  ),
  source(
    "GIS-S8-SRC-STATE-CIM-TERMS",
    "State of Colorado",
    "Terms of Service Policy - State of Colorado",
    "Colorado Information Marketplace",
    "https://data.colorado.gov/terms",
    "UNKNOWN",
    "OFFICIAL_STATE_TERMS",
    "State open-data portal terms requiring disclaimers for applications using data supplied by that site and reserving feed modification or discontinuation rights.",
    "Supports state-wide conditional terms only if the selected source is supplied through that site or a future state feed.",
    "PERMITTED_WITH_CONDITIONS",
    "NOT_ADDRESSED",
    "REQUIRES_DISCLAIMER",
    "MODERATE",
    "APPLICABILITY_CONDITIONAL",
    ["The Sprint 8 selected CGS map was not verified as data supplied by data.colorado.gov."],
  ),
  source(
    "GIS-S8-SRC-COSPL-COPYRIGHT",
    "State of Colorado",
    "Copyright",
    "Colorado State Publications Digital Repository",
    "https://hermes.cde.state.co.us/copyright",
    "UNKNOWN",
    "OFFICIAL_STATE_REPOSITORY_POLICY",
    "State publications repository policy says public availability supports research, teaching, and private study, while users remain responsible for applicable terms and some materials may require permission.",
    "Supports public-access separation from operational, derivative, redistribution, and customer-display rights.",
    "PERMITTED_WITH_CONDITIONS",
    "NOT_ADDRESSED",
    "NOT_ADDRESSED",
    "LOW",
    "APPLICABILITY_CONDITIONAL",
    ["The selected CGS map was not verified as a CoSPL repository item."],
  ),
]);

export function buildGisSprint8LicensingResolution(): GisLicensingResolutionContract {
  const design = buildGisSprint7ControlledProviderPilotDesign();
  if (design.providerInventoryEntryId !== "colorado-geological-survey" || design.exactDatasetOrServiceId !== "CGS_COLORADO_LANDSLIDE_INVENTORY_SERVICE_FAMILY") {
    throw new Error("Sprint 8 licensing resolution requires the certified Sprint 7 CGS landslide pilot subject.");
  }
  const evidenceFingerprint = stableGisEvidenceFingerprint(GIS_SPRINT_8_SOURCE_REFERENCES);
  const base = {
    resolutionId: GIS_SPRINT_8_RESOLUTION_ID,
    resolutionVersion: GIS_SPRINT_8_IMPLEMENTATION_VERSION as typeof GIS_SPRINT_8_IMPLEMENTATION_VERSION,
    providerInventoryId: "colorado-geological-survey" as const,
    providerCanonicalName: "Colorado Geological Survey" as const,
    datasetOrServiceId: "CGS_COLORADO_LANDSLIDE_INVENTORY_SERVICE_FAMILY" as const,
    datasetOrServiceName: "Colorado Landslide Inventory" as const,
    pilotId: GIS_SPRINT_7_PILOT_ID as "GIS-S7-CGS-LANDSLIDE-INVENTORY-PILOT-DESIGN",
    officialEvidenceReferences: GIS_SPRINT_8_SOURCE_REFERENCES.map((reference) => reference.referenceId),
    applicableTermsHierarchy: termsHierarchy(),
    publicAccessState: "PERMITTED_WITH_CONDITIONS" as const,
    internalResearchState: "PERMITTED_WITH_CONDITIONS" as const,
    internalOperationalUseState: "REQUIRES_LEGAL_REVIEW" as const,
    transientProcessingState: "PERMITTED_WITH_CONDITIONS" as const,
    rawDataRetentionState: "REQUIRES_LEGAL_REVIEW" as const,
    normalizedEvidenceRetentionState: "REQUIRES_LEGAL_REVIEW" as const,
    metadataRetentionState: "PERMITTED_WITH_CONDITIONS" as const,
    transformationState: "REQUIRES_ATTRIBUTION" as const,
    derivativeUseState: "REQUIRES_LEGAL_REVIEW" as const,
    commercialUseState: "REQUIRES_LEGAL_REVIEW" as const,
    attributionState: "REQUIRES_ATTRIBUTION" as const,
    disclaimerState: "REQUIRES_DISCLAIMER" as const,
    modificationNoticeState: "REQUIRES_LEGAL_REVIEW" as const,
    sourceLinkRequirement: "REQUIRES_ATTRIBUTION" as const,
    logoOrTrademarkRequirement: "NOT_ADDRESSED" as const,
    redistributionState: "PROHIBITED" as const,
    customerDisplayState: "PROHIBITED" as const,
    thirdPartyComponentState: "REQUIRES_LEGAL_REVIEW" as const,
    legalReviewState: "REQUIRES_LEGAL_REVIEW" as const,
    licensingReviewState: "PERMITTED_WITH_CONDITIONS" as const,
    providerConfirmationState: "REQUIRES_PROVIDER_CONFIRMATION" as const,
    unresolvedQuestions: Object.freeze([
      "Exact license link is not published in the official evidence reviewed.",
      "Programmatic access rights are not expressly addressed for the selected online map.",
      "Raw and normalized retention beyond governed audit metadata requires legal review.",
      "Customer display, redistribution, commercial use, and third-party component terms remain not authorized.",
      "Provider confirmation may be required before any future live execution phase, but provider contact is not authorized in Sprint 8.",
    ]),
    conditions: Object.freeze([
      "Future technical-feasibility work must be non-acquiring and non-executing unless separately authorized.",
      "Any future output must retain CGS source identity, publication URL, access date, citation, and limitations.",
      "Any future derived output must preserve non-reliance, no-site-specific-opinion, and trained-user limitations.",
      "Only governed audit metadata may be retained by default before legal review resolves retention.",
    ]),
    prohibitions: Object.freeze([
      "No provider contact.",
      "No account or credential use.",
      "No terms acceptance.",
      "No live service call.",
      "No provider data acquisition.",
      "No persistence, retrieval, runtime, customer display, or redistribution.",
      "No Sprint 9 work.",
    ]),
    resolutionDisposition: "LICENSING_GATE_RESOLVED_FOR_TECHNICAL_FEASIBILITY_REVIEW" as const,
    evidenceFingerprint,
    executionFlags: zeroExecutionFlags(),
    internalOnly: true as const,
  };
  return Object.freeze({
    ...base,
    deterministicResolutionFingerprint: stableGisEvidenceFingerprint(base),
  });
}

export function buildGisSprint8AttributionRecord(): GisAttributionRecord {
  const record = {
    attributionId: "GIS-S8-ATTR-CGS-LANDSLIDE-INVENTORY",
    provider: "Colorado Geological Survey" as const,
    datasetOrService: "Colorado Landslide Inventory" as const,
    requiredCreditText: "White, Jonathan L., Kassandra O. Lindsey, F. Scot Fitzgerald, and William Curtiss. ON-006-01M Colorado Landslide Inventory (Map) - V20220201. Colorado Geological Survey, February 1, 2022.",
    requiredSourceName: "Colorado Geological Survey" as const,
    requiredUrl: "https://coloradogeologicalsurvey.org/publications/colorado-landslide-inventory-map/",
    requiredPublicationDate: "2022-02-01" as const,
    requiredAccessDate: GIS_SPRINT_8_REFERENCE_DATE as typeof GIS_SPRINT_8_REFERENCE_DATE,
    requiredDisclaimer: "CGS limitations and non-reliance statements must remain attached.",
    requiredModificationNotice: "UNRESOLVED" as const,
    requiredLicenseLink: "UNRESOLVED" as const,
    logoRequirement: "UNRESOLVED" as const,
    placementRequirement: "ATTACH_TO_INTERNAL_OUTPUT_AND_ANY_FUTURE_DISPLAY" as const,
    persistenceRequirement: "PRESERVE_WITH_AUDIT_METADATA_AND_DERIVED_OUTPUT" as const,
    displayContextApplicability: "CUSTOMER_OUTPUT_NOT_AUTHORIZED" as const,
    internalOutputApplicability: "REQUIRED_IF_INTERNAL_OUTPUT_IS_CREATED_IN_FUTURE_PHASE" as const,
    customerOutputApplicability: "NOT_AUTHORIZED" as const,
    unresolvedRequirements: Object.freeze(["Exact mandatory credit wording is not separately prescribed beyond the official citation.", "Logo/trademark use is not addressed.", "Modification notice wording is unresolved."]),
    evidenceReferences: Object.freeze(["GIS-S8-SRC-CGS-LANDSLIDE-PUBLICATION", "GIS-S8-SRC-CGS-GIS-PORTAL"]),
  };
  return Object.freeze({ ...record, deterministicFingerprint: stableGisEvidenceFingerprint(record) });
}

export function buildGisSprint8DisclaimerRecord(): GisDisclaimerRecord {
  return Object.freeze({
    disclaimerId: "GIS-S8-DISC-CGS-LANDSLIDE-INVENTORY",
    datasetOrService: "Colorado Landslide Inventory",
    accuracyLimitation: "Inventory reflects landslides digitized from existing maps prepared by many authors.",
    completenessLimitation: "It does not include private consultant, academic, or professional publications outside CGS and USGS.",
    temporalLimitation: "Publication version is v20220201; future currency requires separate verification.",
    scaleLimitation: "The map is regional inventory context, not a site-specific investigation.",
    hazardOrSafetyLimitation: "Lack of a mapped landslide does not mean ground is stable.",
    legalRelianceLimitation: "CGS data is provided with liability and warranty disclaimers.",
    professionalAdviceLimitation: "Use should be by trained individuals with geologic and hydrologic context.",
    propertySpecificUseLimitation: "It must not replace site-specific slope-stability or land-use investigation.",
    requiredWordingOrFaithfulSummary: "Future outputs must state that the inventory is not a guarantee of safety, insurance determination, legal determination, engineering conclusion, or property-specific professional opinion.",
    applicableOutputTypes: Object.freeze(["future internal derived output", "future internal visualization", "future audit record"]),
    evidenceReferences: Object.freeze(["GIS-S8-SRC-CGS-LANDSLIDE-PUBLICATION", "GIS-S8-SRC-CGS-GIS-PORTAL", "GIS-S8-SRC-CGS-GEOLOGIC-MAPPING"]),
    unresolvedQuestions: Object.freeze(["Exact required disclaimer wording for derivative REIE output requires legal review."]),
  });
}

export function buildGisSprint8ConditionMatrix(): readonly GisPilotConditionMatrixEntry[] {
  return Object.freeze([
    matrix("GIS-S8-COND-001", "PUBLIC_DOCUMENTATION_REVIEW", "PERMITTED_WITH_CONDITIONS", ["GIS-S8-SRC-CGS-LANDSLIDE-PUBLICATION"], ["Read-only documentation review only."], false, false, "NOT_APPLICABLE", "NOT_APPLICABLE", true),
    matrix("GIS-S8-COND-002", "TECHNICAL_METADATA_INSPECTION", "PERMITTED_WITH_CONDITIONS", ["GIS-S8-SRC-CGS-GIS-PORTAL"], ["Future review must not acquire provider records."], true, true, "REQUIRES_LEGAL_REVIEW", "REQUIRES_PROVIDER_CONFIRMATION", true),
    matrix("GIS-S8-COND-003", "TRANSIENT_PAYLOAD_PROCESSING", "PERMITTED_WITH_CONDITIONS", ["GIS-S8-SRC-CGS-LANDSLIDE-PUBLICATION", "GIS-S8-SRC-CGS-GIS-PORTAL"], ["Future transient processing must attach attribution and disclaimers."], true, true, "REQUIRES_LEGAL_REVIEW", "REQUIRES_PROVIDER_CONFIRMATION", true),
    matrix("GIS-S8-COND-004", "RAW_PAYLOAD_RETENTION", "REQUIRES_LEGAL_REVIEW", ["GIS-S8-SRC-CGS-LANDSLIDE-PUBLICATION"], ["Default to no raw retention."], true, true, "REQUIRES_LEGAL_REVIEW", "REQUIRES_PROVIDER_CONFIRMATION", false),
    matrix("GIS-S8-COND-005", "NORMALIZED_EVIDENCE_RETENTION", "REQUIRES_LEGAL_REVIEW", ["GIS-S8-SRC-CGS-LANDSLIDE-PUBLICATION"], ["Default to audit metadata only."], true, true, "REQUIRES_LEGAL_REVIEW", "REQUIRES_PROVIDER_CONFIRMATION", false),
    matrix("GIS-S8-COND-006", "AUDIT_METADATA_RETENTION", "PERMITTED_WITH_CONDITIONS", ["GIS-S8-SRC-CGS-LANDSLIDE-PUBLICATION"], ["Retain source reference IDs, access date, and fingerprints only."], true, true, "REQUIRES_LEGAL_REVIEW", "NOT_APPLICABLE", true),
    matrix("GIS-S8-COND-007", "INTERNAL_DERIVED_OUTPUT", "REQUIRES_ATTRIBUTION", ["GIS-S8-SRC-CGS-LANDSLIDE-PUBLICATION"], ["Must attach citation, source link, limitations, and modification transparency."], true, true, "REQUIRES_LEGAL_REVIEW", "REQUIRES_PROVIDER_CONFIRMATION", true),
    matrix("GIS-S8-COND-008", "INTERNAL_VISUALIZATION", "REQUIRES_DISCLAIMER", ["GIS-S8-SRC-CGS-LANDSLIDE-PUBLICATION"], ["Must attach CGS source identity and non-reliance limitations."], true, true, "REQUIRES_LEGAL_REVIEW", "REQUIRES_PROVIDER_CONFIRMATION", true),
    matrix("GIS-S8-COND-009", "EXTERNAL_CUSTOMER_DISPLAY", "PROHIBITED", ["GIS-S8-SRC-CGS-LANDSLIDE-PUBLICATION"], ["Customer display is not authorized."], true, true, "REQUIRES_LEGAL_REVIEW", "REQUIRES_PROVIDER_CONFIRMATION", false),
    matrix("GIS-S8-COND-010", "REDISTRIBUTION", "PROHIBITED", ["GIS-S8-SRC-CGS-LANDSLIDE-PUBLICATION"], ["Redistribution is not authorized."], true, true, "REQUIRES_LEGAL_REVIEW", "REQUIRES_PROVIDER_CONFIRMATION", false),
    matrix("GIS-S8-COND-011", "COMMERCIAL_USE", "REQUIRES_LEGAL_REVIEW", ["GIS-S8-SRC-CGS-LANDSLIDE-PUBLICATION", "GIS-S8-SRC-STATE-CIM-TERMS"], ["Commercial applicability remains unresolved."], true, true, "REQUIRES_LEGAL_REVIEW", "REQUIRES_PROVIDER_CONFIRMATION", false),
  ]);
}

export function certifyGisSprint8LicensingScenarios(): GisLicensingScenarioResults {
  const resolution = buildGisSprint8LicensingResolution();
  const attribution = buildGisSprint8AttributionRecord();
  const disclaimer = buildGisSprint8DisclaimerRecord();
  const matrixEntries = buildGisSprint8ConditionMatrix();
  const valid = [
    resolution.resolutionDisposition === "LICENSING_GATE_RESOLVED_FOR_TECHNICAL_FEASIBILITY_REVIEW",
    attribution.requiredCreditText.includes("ON-006-01M Colorado Landslide Inventory"),
    disclaimer.hazardOrSafetyLimitation.includes("stable"),
    matrixEntries.some((entry) => entry.activity === "RAW_PAYLOAD_RETENTION" && entry.allowedForFutureTechnicalFeasibilityDesign === false),
    matrixEntries.some((entry) => entry.activity === "EXTERNAL_CUSTOMER_DISPLAY" && entry.currentRightsState === "PROHIBITED"),
    Object.values(resolution.executionFlags).every((value) => value === false),
  ].every(Boolean);
  if (!valid) throw new Error("GIS Sprint 8 licensing scenario certification failed.");
  return Object.freeze({
    scenarioA: "ATTRIBUTION_REQUIREMENTS_IDENTIFIED",
    scenarioB: "LICENSING_REVIEW_REQUIRED",
    scenarioC: "TRANSIENT_INTERNAL_PILOT_USE_CONDITIONALLY_SUPPORTED",
    scenarioD: "FAILED_CLOSED_RAW_RETENTION_UNRESOLVED",
    scenarioE: "FAILED_CLOSED_ATTRIBUTION_REQUIRED",
    scenarioF: "FAILED_CLOSED_DISCLAIMER_REQUIRED",
    scenarioG: "FAILED_CLOSED_CUSTOMER_DISPLAY_NOT_AUTHORIZED",
    scenarioH: "FAILED_CLOSED_REDISTRIBUTION_NOT_AUTHORIZED",
    scenarioI: "TERMS_APPLICABILITY_UNRESOLVED",
    scenarioJ: "CONFLICTING_OFFICIAL_EVIDENCE",
    scenarioK: "PROVIDER_CONFIRMATION_REQUIRED",
    scenarioL: "LICENSING_GATE_RESOLVED_FOR_TECHNICAL_FEASIBILITY_REVIEW",
    scenarioM: "FAILED_CLOSED_EXECUTION_AUTHORIZATION_FALSE",
    scenarioN: "ZERO_PROVIDER_CONTACT_AND_ZERO_DATA_ACQUISITION",
  });
}

export function gisSprint8LicensingResolutionFingerprint(): string {
  return stableGisEvidenceFingerprint({
    resolution: buildGisSprint8LicensingResolution(),
    attribution: buildGisSprint8AttributionRecord(),
    disclaimer: buildGisSprint8DisclaimerRecord(),
    matrix: buildGisSprint8ConditionMatrix(),
    scenarios: certifyGisSprint8LicensingScenarios(),
  });
}

function source(
  referenceId: string,
  providerOrAuthority: string,
  title: string,
  officialPublisher: string,
  url: string,
  publicationOrUpdatedDate: string,
  sourceType: GisLicensingSourceReference["sourceType"],
  applicabilityScope: string,
  evidenceSummary: string,
  rightsFindingSupported: GisLicensingSourceReference["rightsFindingSupported"],
  attributionFindingSupported: GisLicensingSourceReference["attributionFindingSupported"],
  disclaimerFindingSupported: GisLicensingSourceReference["disclaimerFindingSupported"],
  confidence: GisLicensingSourceReference["confidence"],
  verificationState: GisLicensingSourceReference["verificationState"],
  unresolvedAmbiguity: readonly string[],
): GisLicensingSourceReference {
  const body = {
    referenceId,
    providerOrAuthority,
    title,
    officialPublisher,
    url,
    accessDate: GIS_SPRINT_8_REFERENCE_DATE as typeof GIS_SPRINT_8_REFERENCE_DATE,
    publicationOrUpdatedDate,
    sourceType,
    applicabilityScope,
    evidenceSummary,
    rightsFindingSupported,
    attributionFindingSupported,
    disclaimerFindingSupported,
    confidence,
    verificationState,
    unresolvedAmbiguity: Object.freeze([...unresolvedAmbiguity]),
  };
  return Object.freeze({ ...body, contentFingerprint: stableGisEvidenceFingerprint(body) });
}

function termsHierarchy(): readonly GisTermsHierarchyEntry[] {
  return Object.freeze([
    terms("DATASET_SPECIFIC", "GIS-S8-SRC-CGS-LANDSLIDE-PUBLICATION", "DIRECT", "Dataset page controls identity, citation, limitations, and map-specific no-download notice."),
    terms("PORTAL_WIDE", "GIS-S8-SRC-CGS-GIS-PORTAL", "DIRECT", "CGS GIS portal controls general GIS-map and service context plus general disclaimer."),
    terms("AGENCY_WIDE", "GIS-S8-SRC-CGS-GEOLOGIC-MAPPING", "CONDITIONAL", "CGS geologic mapping disclaimer supports but does not replace dataset-specific notices."),
    terms("STATE_WIDE", "GIS-S8-SRC-STATE-CIM-TERMS", "CONDITIONAL", "State open-data portal terms apply only if future source is supplied through that site or a state feed."),
    terms("THIRD_PARTY_COMPONENT", "GIS-S8-SRC-CGS-GIS-PORTAL", "UNRESOLVED", "ArcGIS and other map components require separate review."),
    terms("DISCLAIMER", "GIS-S8-SRC-CGS-LANDSLIDE-PUBLICATION", "DIRECT", "Landslide limitations and non-reliance warnings must be preserved."),
  ]);
}

function terms(hierarchyLevel: GisTermsHierarchyEntry["hierarchyLevel"], referenceId: string, applicability: GisTermsHierarchyEntry["applicability"], conclusion: string): GisTermsHierarchyEntry {
  return Object.freeze({ hierarchyLevel, referenceId, applicability, conclusion });
}

function matrix(
  conditionId: string,
  activity: GisPilotConditionMatrixEntry["activity"],
  currentRightsState: GisPilotConditionMatrixEntry["currentRightsState"],
  evidenceReferences: readonly string[],
  conditions: readonly string[],
  requiredAttribution: boolean,
  requiredDisclaimer: boolean,
  legalReviewStatus: GisPilotConditionMatrixEntry["legalReviewStatus"],
  providerConfirmationStatus: GisPilotConditionMatrixEntry["providerConfirmationStatus"],
  allowedForFutureTechnicalFeasibilityDesign: boolean,
): GisPilotConditionMatrixEntry {
  return Object.freeze({
    conditionId,
    activity,
    currentRightsState,
    evidenceReferences: Object.freeze([...evidenceReferences]),
    conditions: Object.freeze([...conditions]),
    requiredAttribution,
    requiredDisclaimer,
    legalReviewStatus,
    providerConfirmationStatus,
    allowedForSprint8: false,
    allowedForFutureTechnicalFeasibilityDesign,
    allowedForFutureExecution: false,
  });
}

function zeroExecutionFlags(): GisLicensingExecutionFlags {
  return Object.freeze({
    providerContactAuthorized: false,
    accountCreationAuthorized: false,
    credentialAuthorized: false,
    termsAcceptanceAuthorized: false,
    providerConnectionAuthorized: false,
    acquisitionAuthorized: false,
    adapterExecutionAuthorized: false,
    persistenceAuthorized: false,
    retrievalAuthorized: false,
    enterpriseConsumptionAuthorized: false,
    runtimeAuthorized: false,
    downstreamAuthorized: false,
    customerVisibilityAuthorized: false,
    redistributionAuthorized: false,
    relationshipCreationAuthorized: false,
    hierarchyInferenceAuthorized: false,
    coloradoRuntimeConsumptionAuthorized: false,
    sprint9Authorized: false,
  });
}
