import { GIS_FAIL_CLOSED_ACTIVATION } from "../activationContract.js";
import { stableGisEvidenceFingerprint } from "../evidenceFingerprint.js";
import {
  GIS_1_0_SPRINT_6_CERTIFICATION,
  GIS_SPRINT_6_BOUNDARY_NOTE,
  GIS_SPRINT_6_EVALUATION_SUBJECT,
  GIS_SPRINT_6_IMPLEMENTATION_VERSION,
  GIS_SPRINT_6_REFERENCE_DATE,
  type GisDueDiligenceAuthorizationFlags,
  type GisDueDiligenceComparisonRecord,
  type GisDueDiligenceDisposition,
  type GisDueDiligenceFinding,
  type GisDueDiligenceFindingCategory,
  type GisDueDiligenceReviewState,
  type GisDueDiligenceScenarioResults,
  type GisDueDiligenceSourceReference,
  type GisDueDiligenceVerificationState,
  type GisProviderDueDiligenceRecord,
} from "../providerDueDiligenceContract.js";

export const GIS_SPRINT_6_ZERO_AUTHORIZATION_FLAGS: GisDueDiligenceAuthorizationFlags = Object.freeze({
  providerUseAuthorized: false,
  providerApprovalAuthorized: false,
  providerContactAuthorized: false,
  accountCreationAuthorized: false,
  credentialAuthorized: false,
  termsAcceptanceAuthorized: false,
  contractAuthorized: false,
  purchaseAuthorized: false,
  dataAcquisitionAuthorized: false,
  liveAdapterAuthorized: false,
  persistenceAuthorized: false,
  retrievalAuthorized: false,
  runtimeAuthorized: false,
  downstreamIntegrationAuthorized: false,
  customerVisibilityAuthorized: false,
  redistributionAuthorized: false,
  relationshipCreationAuthorized: false,
  hierarchyInferenceAuthorized: false,
  sprint7Authorized: false,
});

export const GIS_SPRINT_6_SOURCE_REFERENCES: readonly GisDueDiligenceSourceReference[] = Object.freeze([
  source("GIS-S6-SRC-CGS-GIS-PORTAL", "Colorado Geological Survey", "GIS Data and Web Map Portal", "Colorado Geological Survey", "https://coloradogeologicalsurvey.org/geology/gis-data-map-portal/", "UNKNOWN", "OFFICIAL_PROVIDER_PAGE", "CGS identifies its GIS portal, current projects with GIS components, named Colorado geologic and hazard web maps, GIS data downloads, public REST services, and a general disclaimer.", "OFFICIAL_DOCUMENTATION_VERIFIED", "OFFICIAL_PROVIDER_OR_GOVERNMENT_SOURCE", ["CGS page lists landslide, debris-flow, earthquake/fault, geothermal, minerals, water, and GIS REST service families."]),
  source("GIS-S6-SRC-CGS-MAPPING", "Colorado Geological Survey", "Geologic Mapping", "Colorado Geological Survey", "https://coloradogeologicalsurvey.org/geology/mapping/", "UNKNOWN", "OFFICIAL_PROVIDER_PAGE", "CGS describes its STATEMAP geologic mapping program, GIS data in map products, publication-based GIS shapefiles, and a broad data disclaimer.", "OFFICIAL_DOCUMENTATION_VERIFIED", "OFFICIAL_PROVIDER_OR_GOVERNMENT_SOURCE", ["Used to separate organization identity from exact map product and GIS package identity."]),
  source("GIS-S6-SRC-USGS-3DHP", "U.S. Geological Survey", "Access 3DHP Data Products", "U.S. Geological Survey", "https://www.usgs.gov/3d-hydrography-program/access-3dhp-data-products", "2026-03", "OFFICIAL_DATASET_CATALOG", "USGS states 3DHP products are available through web services and downloads; new EDH data is added to services quarterly and downloadable products update early each fiscal year.", "CURRENT_AVAILABILITY_VERIFIED", "OFFICIAL_PROVIDER_OR_GOVERNMENT_SOURCE", ["3DHP is treated as the current hydrography source family; legacy NHD is retained as reference."]),
  source("GIS-S6-SRC-USGS-NHD", "U.S. Geological Survey", "National Hydrography Dataset", "U.S. Geological Survey", "https://www.usgs.gov/national-hydrography/national-hydrography-dataset", "2026-04-29", "OFFICIAL_DATASET_CATALOG", "USGS states NHD represents the U.S. drainage network, was retired from maintenance on October 1, 2023, and remains available as file geodatabase and shapefile downloads.", "HISTORICAL_ONLY", "OFFICIAL_PROVIDER_OR_GOVERNMENT_SOURCE", ["Used as conflicting/continuity evidence against treating NHD as current without 3DHP review."]),
  source("GIS-S6-SRC-USGS-TNM-API", "U.S. Geological Survey", "Is there an API for accessing The National Map data?", "U.S. Geological Survey", "https://www.usgs.gov/faqs/there-api-accessing-national-map-data", "UNKNOWN", "OFFICIAL_API_DOCUMENTATION", "USGS states The National Map has the TNMAccess API for downloadable products and that HTTP GET and POST can directly access products.", "ACCESS_METHOD_VERIFIED", "OFFICIAL_PROVIDER_OR_GOVERNMENT_SOURCE", ["Technical access evidence only; it does not authorize an adapter or acquisition."]),
  source("GIS-S6-SRC-USGS-LICENSING", "U.S. Geological Survey", "Data Licensing", "U.S. Geological Survey", "https://www.usgs.gov/data-management/data-licensing", "UNKNOWN", "OFFICIAL_TERMS_LICENSE_POLICY", "USGS data-management guidance distinguishes copyright from licensing, discusses U.S. Government public-domain data, and recommends CC0 or other explicit open licenses depending on dataset provenance.", "LICENSING_STATEMENT_IDENTIFIED", "OFFICIAL_PROVIDER_OR_GOVERNMENT_SOURCE", ["Requires dataset-level license confirmation before any future use."]),
  source("GIS-S6-SRC-FEMA-NFHL-DATAGOV", "Federal Emergency Management Agency", "National Flood Hazard Layer", "Department of Homeland Security Data.gov catalog", "https://catalog.data.gov/dataset/national-flood-hazard-layer", "2025-04-01", "OFFICIAL_DATASET_CATALOG", "The catalog identifies the National Flood Hazard Layer as public geospatial data published by FEMA/Resilience/Risk Management Directorate, with a distribution URL and government-works license URL.", "CURRENT_AVAILABILITY_VERIFIED", "OFFICIAL_GOVERNMENT_CATALOG", ["Catalog last checked May 6, 2026; dataset last updated April 1, 2025."]),
  source("GIS-S6-SRC-FEMA-NFHL-MSC", "Federal Emergency Management Agency", "National Flood Hazard Layer", "Federal Emergency Management Agency", "https://www.fema.gov/national-flood-hazard-layer-nfhl", "UNKNOWN", "OFFICIAL_PROVIDER_PAGE", "FEMA describes NFHL as geospatial flood-hazard data supporting the National Flood Insurance Program and points to viewing and obtaining flood-map data through official FEMA tools.", "OFFICIAL_SOURCE_IDENTIFIED", "OFFICIAL_PROVIDER_OR_GOVERNMENT_SOURCE", ["Current page availability should be rechecked during any future pilot gate."]),
  source("GIS-S6-SRC-EPA-AQS-API", "U.S. Environmental Protection Agency", "Air Quality System API", "U.S. Environmental Protection Agency", "https://aqs.epa.gov/aqsweb/documents/data_api.html", "2020-01-10", "OFFICIAL_API_DOCUMENTATION", "EPA states AQS contains ambient air sample data collected by state, local, tribal, and federal monitoring agencies; the API uses email and key parameters and includes request limits and terms.", "ACCESS_METHOD_VERIFIED", "OFFICIAL_PROVIDER_OR_GOVERNMENT_SOURCE", ["Key/email requirement creates technical and commercial-review gates; no key was requested."]),
  source("GIS-S6-SRC-CDPHE-AIR-MONITORING", "Colorado Department of Public Health and Environment", "Air monitoring data and technical reports", "Colorado Department of Public Health and Environment", "https://cdphe.colorado.gov/public-information/air-monitoring-data-and-technical-reports", "UNKNOWN", "OFFICIAL_AGENCY_PUBLICATION", "CDPHE states its Air Pollution Control Division collects air monitoring data across Colorado and lists annual data reports, network plans, assessments, and quality-assurance documents.", "OFFICIAL_DOCUMENTATION_VERIFIED", "OFFICIAL_PROVIDER_OR_GOVERNMENT_SOURCE", ["Supports Colorado authority/source-class review; exact machine-readable access remains unresolved."]),
  source("GIS-S6-SRC-CDPHE-AQDX", "Colorado Department of Public Health and Environment", "Air Quality Data Exchange", "Colorado Department of Public Health and Environment", "https://cdphe.colorado.gov/air-quality-data-exchange", "2024-07", "OFFICIAL_TECHNICAL_REFERENCE", "CDPHE describes AQDx CSV and JSON formats for air-quality data exchange and fields for source, observation, quality, and license metadata.", "TECHNICAL_FORMAT_VERIFIED", "OFFICIAL_PROVIDER_OR_GOVERNMENT_SOURCE", ["Format evidence only; it does not establish an operational Colorado air-data source."]),
]);

export function buildGisSprint6ProviderDueDiligenceRecords(): readonly GisProviderDueDiligenceRecord[] {
  return Object.freeze([
    record({
      providerInventoryEntryId: "colorado-geological-survey",
      canonicalProviderName: "Colorado Geological Survey",
      exactSourceOrDatasetReviewed: "CGS GIS Data and Web Map Portal source families: Colorado Landslide Inventory, debris-flow susceptibility maps, Colorado Earthquake and Fault Map, geologic-map GIS packages, and CGS REST service directories",
      providerRole: "ORIGINATING_AUTHORITY",
      publisher: "Colorado Geological Survey",
      originatingAuthority: "Colorado Geological Survey",
      jurisdiction: "Colorado",
      geographicCoverage: "Colorado statewide and county or publication-specific GIS map coverage; exact coverage varies by source family",
      evidenceCategories: ["geologic context", "geologic hazards", "landslides", "debris flow", "faults and earthquakes", "groundwater", "minerals"],
      officialSourceReferenceIds: ["GIS-S6-SRC-CGS-GIS-PORTAL", "GIS-S6-SRC-CGS-MAPPING"],
      currentVerificationState: "OFFICIAL_DOCUMENTATION_VERIFIED",
      accessMethod: "PUBLIC_GIS_SERVICE_DOCUMENTATION",
      authenticationRequirement: "NOT_INDICATED",
      accountRequirement: "NOT_INDICATED",
      costState: "NO_COST_STATED",
      licensingState: "PUBLIC_ACCESS_STATED",
      permittedUseState: "REVIEW_REQUIRED",
      attributionRequirement: "NOT_STATED",
      redistributionState: "REVIEW_REQUIRED",
      derivativeUseState: "REVIEW_REQUIRED",
      customerDisplayState: "REVIEW_REQUIRED",
      updateCadence: "Portal says CGS continues to assess GIS data space over time; exact cadence varies by dataset and is not uniformly stated.",
      technicalFormats: ["ArcGIS REST service", "GIS data package", "ESRI shapefile", "geodatabase", "PDF plate"],
      apiOrGisServiceState: "PUBLIC_GIS_SERVICE_DOCUMENTATION",
      documentationQuality: "HIGH",
      sourceStability: "MODERATE",
      continuityRisk: "MODERATE",
      technicalUncertainty: ["Exact layer schemas and stable service endpoints require a separately authorized technical review."],
      licensingUncertainty: ["CGS public accessibility and disclaimer do not settle REIE permitted use, redistribution, derivative use, or customer display."],
      legalReviewRequirement: "REQUIRED_BEFORE_ANY_PILOT",
      commercialReviewRequirement: "REQUIRED_BEFORE_ANY_PILOT",
      technicalReviewRequirement: "REQUIRED_BEFORE_ANY_PILOT",
      evidenceSufficiencyState: "SUFFICIENT_FOR_DUE_DILIGENCE",
      unresolvedQuestions: ["Which exact CGS source family should be scoped first?", "What attribution, redistribution, derivative-use, and customer-display terms apply per dataset?", "Which REST endpoints are stable enough for a future pilot review?"],
      disposition: "RECOMMENDED_FOR_CONTROLLED_PROVIDER_PILOT_AUTHORIZATION_REVIEW",
      findings: [
        finding("GIS-S6-F-CGS-001", "Colorado Geological Survey", "DATASET_IDENTITY", ["GIS-S6-SRC-CGS-GIS-PORTAL"], "CGS provides exact source families rather than one generic organization-level dataset.", "HIGH", "DATASET_IDENTITY_VERIFIED", []),
        finding("GIS-S6-F-CGS-002", "Colorado Geological Survey", "GIS_SERVICE", ["GIS-S6-SRC-CGS-GIS-PORTAL"], "CGS identifies public REST service families for AML, hazards, minerals, and water.", "HIGH", "ACCESS_METHOD_VERIFIED", ["Layer-by-layer schema review remains pending."]),
        finding("GIS-S6-F-CGS-003", "Colorado Geological Survey", "LICENSE", ["GIS-S6-SRC-CGS-GIS-PORTAL"], "CGS states public/free access for many GIS products and a disclaimer, but does not settle REIE rights.", "MODERATE", "LICENSING_STATEMENT_IDENTIFIED", ["Legal review required before any provider pilot."]),
      ],
    }),
    record({
      providerInventoryEntryId: "u-s-geological-survey",
      canonicalProviderName: "U.S. Geological Survey",
      exactSourceOrDatasetReviewed: "3D Hydrography Program data products, legacy National Hydrography Dataset, and The National Map access API",
      providerRole: "ORIGINATING_AUTHORITY",
      publisher: "U.S. Geological Survey",
      originatingAuthority: "U.S. Geological Survey",
      jurisdiction: "United States with Colorado subset possible through national products",
      geographicCoverage: "National hydrography and topographic products with Colorado extract/subset potential; NHD legacy status must be distinguished from current 3DHP coverage",
      evidenceCategories: ["hydrography", "topography", "water context", "geographic basemap context"],
      officialSourceReferenceIds: ["GIS-S6-SRC-USGS-3DHP", "GIS-S6-SRC-USGS-NHD", "GIS-S6-SRC-USGS-TNM-API", "GIS-S6-SRC-USGS-LICENSING"],
      currentVerificationState: "CONFLICTING_EVIDENCE",
      accessMethod: "PUBLIC_API_DOCUMENTATION",
      authenticationRequirement: "NOT_INDICATED",
      accountRequirement: "NOT_INDICATED",
      costState: "NO_COST_STATED",
      licensingState: "PUBLIC_DOMAIN_STATED",
      permittedUseState: "REVIEW_REQUIRED",
      attributionRequirement: "ATTRIBUTION_STATED",
      redistributionState: "REVIEW_REQUIRED",
      derivativeUseState: "REVIEW_REQUIRED",
      customerDisplayState: "REVIEW_REQUIRED",
      updateCadence: "3DHP services add EDH data quarterly and downloadable products update early each fiscal year; NHD is legacy and no longer maintained.",
      technicalFormats: ["web service", "downloadable product", "file geodatabase", "shapefile", "TNMAccess API"],
      apiOrGisServiceState: "PUBLIC_API_DOCUMENTATION",
      documentationQuality: "HIGH",
      sourceStability: "HIGH",
      continuityRisk: "MODERATE",
      technicalUncertainty: ["Future pilot must choose current 3DHP rather than silently using retired NHD.", "TNMAccess request design and product filters need separate technical proof."],
      licensingUncertainty: ["USGS public-domain guidance is strong but dataset-level license and non-USGS component checks remain required."],
      legalReviewRequirement: "REQUIRED_BEFORE_ANY_PILOT",
      commercialReviewRequirement: "NOT_REQUIRED",
      technicalReviewRequirement: "REQUIRED_BEFORE_ANY_PILOT",
      evidenceSufficiencyState: "SUFFICIENT_FOR_DUE_DILIGENCE",
      unresolvedQuestions: ["Which exact USGS product is most valuable for REIE environmental evidence?", "How should current 3DHP and legacy NHD references be separated in future records?", "Which attribution and citation form would be required in internal and customer contexts?"],
      disposition: "RECOMMENDED_FOR_CONTROLLED_PROVIDER_PILOT_AUTHORIZATION_REVIEW",
      findings: [
        finding("GIS-S6-F-USGS-001", "U.S. Geological Survey", "DATASET_IDENTITY", ["GIS-S6-SRC-USGS-3DHP", "GIS-S6-SRC-USGS-NHD"], "3DHP is the current hydrography source family; NHD remains available but retired from maintenance.", "HIGH", "CONFLICTING_EVIDENCE", ["Pilot design must avoid treating NHD as current."]),
        finding("GIS-S6-F-USGS-002", "U.S. Geological Survey", "API_DOCUMENTATION", ["GIS-S6-SRC-USGS-TNM-API"], "The National Map has an official TNMAccess API for downloadable products.", "HIGH", "ACCESS_METHOD_VERIFIED", []),
        finding("GIS-S6-F-USGS-003", "U.S. Geological Survey", "ATTRIBUTION", ["GIS-S6-SRC-USGS-LICENSING"], "USGS guidance supports public-domain/open-license treatment for many federal datasets but still requires dataset-level confirmation and citation.", "MODERATE", "ATTRIBUTION_REQUIREMENT_IDENTIFIED", ["Legal review required for exact dataset and any non-USGS components."]),
      ],
    }),
    record({
      providerInventoryEntryId: "fema-flood-map-source-class",
      canonicalProviderName: "FEMA flood mapping",
      exactSourceOrDatasetReviewed: "National Flood Hazard Layer",
      providerRole: "SUPPORTING_SOURCE_CLASS",
      publisher: "Federal Emergency Management Agency / Department of Homeland Security",
      originatingAuthority: "Federal Emergency Management Agency",
      jurisdiction: "United States with Colorado flood-map coverage where effective digital flood-hazard data exists",
      geographicCoverage: "National dataset with local FIRM and LOMR coverage; current catalog evidence does not by itself prove every Colorado parcel or jurisdiction has complete digital coverage",
      evidenceCategories: ["flood hazard", "flood insurance rate map context", "environmental risk"],
      officialSourceReferenceIds: ["GIS-S6-SRC-FEMA-NFHL-DATAGOV", "GIS-S6-SRC-FEMA-NFHL-MSC"],
      currentVerificationState: "CURRENT_AVAILABILITY_VERIFIED",
      accessMethod: "PUBLIC_DATASET_CATALOG",
      authenticationRequirement: "NOT_INDICATED",
      accountRequirement: "NOT_INDICATED",
      costState: "NO_COST_STATED",
      licensingState: "PUBLIC_DOMAIN_STATED",
      permittedUseState: "REVIEW_REQUIRED",
      attributionRequirement: "NOT_STATED",
      redistributionState: "REVIEW_REQUIRED",
      derivativeUseState: "REVIEW_REQUIRED",
      customerDisplayState: "REVIEW_REQUIRED",
      updateCadence: "Data.gov records dataset last updated April 1, 2025; service-level cadence requires future verification.",
      technicalFormats: ["dataset catalog distribution", "official flood map tools", "GIS service documentation to be separately verified"],
      apiOrGisServiceState: "PUBLIC_DATASET_CATALOG",
      documentationQuality: "HIGH",
      sourceStability: "HIGH",
      continuityRisk: "LOW",
      technicalUncertainty: ["Exact Colorado coverage, service endpoint stability, and layer schemas remain a future technical-review gate."],
      licensingUncertainty: ["Government-works license URL is identified, but REIE customer display and redistribution require legal review."],
      legalReviewRequirement: "REQUIRED_BEFORE_ANY_PILOT",
      commercialReviewRequirement: "NOT_REQUIRED",
      technicalReviewRequirement: "REQUIRED_BEFORE_ANY_PILOT",
      evidenceSufficiencyState: "SUFFICIENT_FOR_DUE_DILIGENCE",
      unresolvedQuestions: ["Which FEMA NFHL service endpoint is the authoritative pilot source?", "How should flood-map disclaimers and FIRM legal status be represented?", "What Colorado coverage gaps exist?"],
      disposition: "FALLBACK_SOURCE_CANDIDATE",
      findings: [
        finding("GIS-S6-F-FEMA-001", "Federal Emergency Management Agency", "DATASET_IDENTITY", ["GIS-S6-SRC-FEMA-NFHL-DATAGOV"], "Data.gov identifies NFHL as a public geospatial dataset published by FEMA/Resilience/Risk Management Directorate.", "HIGH", "DATASET_IDENTITY_VERIFIED", []),
        finding("GIS-S6-F-FEMA-002", "Federal Emergency Management Agency", "LICENSE", ["GIS-S6-SRC-FEMA-NFHL-DATAGOV"], "The catalog records a government-works license URL and public access level.", "MODERATE", "LICENSING_STATEMENT_IDENTIFIED", ["Legal review required before relying on customer-display or redistribution rights."]),
      ],
    }),
    record({
      providerInventoryEntryId: "air-quality-source-class",
      canonicalProviderName: "Authoritative Colorado air-quality sources",
      exactSourceOrDatasetReviewed: "EPA Air Quality System API and CDPHE air monitoring data, technical reports, and AQDx format guidance",
      providerRole: "SUPPORTING_SOURCE_CLASS",
      publisher: "U.S. Environmental Protection Agency and Colorado Department of Public Health and Environment",
      originatingAuthority: "State, local, tribal, and federal air pollution control agencies; CDPHE Air Pollution Control Division for Colorado monitoring context",
      jurisdiction: "United States and Colorado",
      geographicCoverage: "AQS national monitor data with Colorado filters possible; CDPHE provides Colorado monitoring reports, plans, and format guidance",
      evidenceCategories: ["air quality", "ambient monitoring", "stationary-source context", "data-quality context"],
      officialSourceReferenceIds: ["GIS-S6-SRC-EPA-AQS-API", "GIS-S6-SRC-CDPHE-AIR-MONITORING", "GIS-S6-SRC-CDPHE-AQDX"],
      currentVerificationState: "PARTIALLY_VERIFIED",
      accessMethod: "ACCOUNT_OR_KEY_INDICATED",
      authenticationRequirement: "INDICATED",
      accountRequirement: "INDICATED",
      costState: "COST_NOT_STATED",
      licensingState: "TERMS_STATED",
      permittedUseState: "REVIEW_REQUIRED",
      attributionRequirement: "NOT_STATED",
      redistributionState: "REVIEW_REQUIRED",
      derivativeUseState: "REVIEW_REQUIRED",
      customerDisplayState: "REVIEW_REQUIRED",
      updateCadence: "EPA AQS API documentation is dated 2020-01-10; CDPHE lists 2024 annual data and 2025 network plans, but exact API freshness needs separate review.",
      technicalFormats: ["EPA AQS API JSON", "AQDx CSV", "AQDx JSON", "PDF reports", "network plans", "quality-assurance documents"],
      apiOrGisServiceState: "PUBLIC_API_DOCUMENTATION",
      documentationQuality: "HIGH",
      sourceStability: "MODERATE",
      continuityRisk: "MODERATE",
      technicalUncertainty: ["EPA AQS API requires an email/key parameter; no key was requested.", "CDPHE report and AQDx evidence does not yet prove a current operational Colorado API."],
      licensingUncertainty: ["API terms and CDPHE data rights need legal review before acquisition or customer display."],
      legalReviewRequirement: "REQUIRED_BEFORE_ANY_PILOT",
      commercialReviewRequirement: "REQUIRED_BEFORE_ANY_PILOT",
      technicalReviewRequirement: "REQUIRED_BEFORE_ANY_PILOT",
      evidenceSufficiencyState: "PARTIAL",
      unresolvedQuestions: ["Should a future air source use EPA AQS, CDPHE-published records, AirNow, or another official source?", "Can a no-key source satisfy the capability?", "What rights apply to downstream display and derived scores?"],
      disposition: "SUPPLEMENTAL_SOURCE_ONLY",
      findings: [
        finding("GIS-S6-F-AIR-001", "U.S. Environmental Protection Agency", "API_DOCUMENTATION", ["GIS-S6-SRC-EPA-AQS-API"], "EPA documents AQS API access for ambient air sample data and monitor metadata.", "HIGH", "ACCESS_METHOD_VERIFIED", ["Email/key requirement blocks any no-credential pilot without separate approval."]),
        finding("GIS-S6-F-AIR-002", "Colorado Department of Public Health and Environment", "AUTHORITY_IDENTITY", ["GIS-S6-SRC-CDPHE-AIR-MONITORING"], "CDPHE states its Air Pollution Control Division collects air monitoring data across Colorado and publishes technical documents.", "HIGH", "OFFICIAL_DOCUMENTATION_VERIFIED", ["Machine-readable operational source remains unresolved."]),
        finding("GIS-S6-F-AIR-003", "Colorado Department of Public Health and Environment", "FILE_FORMAT", ["GIS-S6-SRC-CDPHE-AQDX"], "CDPHE describes AQDx CSV and JSON formats and fields covering source, observation, quality, and license metadata.", "MODERATE", "TECHNICAL_FORMAT_VERIFIED", ["AQDx is a format standard, not by itself a live source authorization."]),
      ],
    }),
  ]);
}

export function buildGisSprint6DueDiligenceComparison(records = buildGisSprint6ProviderDueDiligenceRecords()): GisDueDiligenceComparisonRecord {
  const ordered = [...records].sort((left, right) => dispositionWeight(left.disposition) - dispositionWeight(right.disposition) || left.providerInventoryEntryId.localeCompare(right.providerInventoryEntryId));
  const review = records.filter((record) => record.disposition === "RECOMMENDED_FOR_CONTROLLED_PROVIDER_PILOT_AUTHORIZATION_REVIEW").map((record) => record.providerInventoryEntryId);
  const supplemental = records.filter((record) => record.disposition === "SUPPLEMENTAL_SOURCE_ONLY").map((record) => record.providerInventoryEntryId);
  const fallback = records.filter((record) => record.disposition === "FALLBACK_SOURCE_CANDIDATE").map((record) => record.providerInventoryEntryId);
  const deferred = records.filter((record) => record.disposition === "DEFERRED").map((record) => record.providerInventoryEntryId);
  const rejected = records.filter((record) => record.disposition === "REJECTED").map((record) => record.providerInventoryEntryId);
  const minimumSet = Object.freeze([...review, ...fallback, ...supplemental]);
  const fingerprintInput = {
    ordered: ordered.map((record) => record.providerInventoryEntryId),
    dispositions: records.map((record) => [record.providerInventoryEntryId, record.disposition]),
    minimumSet,
  };
  return Object.freeze({
    comparisonId: `GIS-S6-COMPARISON-${stableGisEvidenceFingerprint(fingerprintInput).slice(0, 20)}`,
    evaluationSubjectId: GIS_SPRINT_6_EVALUATION_SUBJECT,
    orderedProviderInventoryEntryIds: Object.freeze(ordered.map((record) => record.providerInventoryEntryId)),
    comparativeFindings: Object.freeze([
      "CGS provides the strongest Colorado-specific geologic and hazard source families but retains dataset-level rights and endpoint-review gates.",
      "USGS provides strong national authority and technical access, but current 3DHP and legacy NHD evidence must not be collapsed.",
      "FEMA NFHL contributes flood-hazard resilience and public catalog evidence but is narrower than the geologic capability.",
      "EPA/CDPHE air evidence is uniquely valuable but supplemental because account/key requirements and exact Colorado operational source choice remain unresolved.",
    ]),
    revisedProposedMinimumProviderSet: minimumSet,
    pilotAuthorizationReviewCandidates: Object.freeze(review),
    supplementalCandidates: Object.freeze(supplemental),
    fallbackCandidates: Object.freeze(fallback),
    deferredCandidates: Object.freeze(deferred),
    rejectedCandidates: Object.freeze(rejected),
    legalReviewRequirements: Object.freeze(records.filter((record) => requires(record.legalReviewRequirement)).map((record) => record.providerInventoryEntryId)),
    technicalReviewRequirements: Object.freeze(records.filter((record) => requires(record.technicalReviewRequirement)).map((record) => record.providerInventoryEntryId)),
    commercialReviewRequirements: Object.freeze(records.filter((record) => requires(record.commercialReviewRequirement)).map((record) => record.providerInventoryEntryId)),
    providerUseAuthorized: false,
    deterministicFingerprint: stableGisEvidenceFingerprint(fingerprintInput),
  });
}

export function certifyGisSprint6ProviderDueDiligenceScenarios(): GisDueDiligenceScenarioResults {
  const records = buildGisSprint6ProviderDueDiligenceRecords();
  const byId = new Map(records.map((record) => [record.providerInventoryEntryId, record]));
  const allScenariosValid = [
    byId.get("colorado-geological-survey")?.currentVerificationState === "OFFICIAL_DOCUMENTATION_VERIFIED",
    byId.get("air-quality-source-class")?.currentVerificationState === "PARTIALLY_VERIFIED",
    byId.get("colorado-geological-survey")?.disposition === "RECOMMENDED_FOR_CONTROLLED_PROVIDER_PILOT_AUTHORIZATION_REVIEW",
    byId.get("u-s-geological-survey")?.currentVerificationState === "CONFLICTING_EVIDENCE",
    byId.get("air-quality-source-class")?.accountRequirement === "INDICATED",
    records.some((record) => record.attributionRequirement === "ATTRIBUTION_STATED"),
    byId.get("u-s-geological-survey")?.findings.some((finding) => finding.verificationState === "CONFLICTING_EVIDENCE"),
    byId.get("u-s-geological-survey")?.findings.some((finding) => finding.verificationState === "CONFLICTING_EVIDENCE"),
    byId.get("air-quality-source-class")?.disposition === "SUPPLEMENTAL_SOURCE_ONLY",
    byId.get("fema-flood-map-source-class")?.disposition === "FALLBACK_SOURCE_CANDIDATE",
    byId.get("colorado-geological-survey")?.disposition === "RECOMMENDED_FOR_CONTROLLED_PROVIDER_PILOT_AUTHORIZATION_REVIEW",
    records.every((record) => requires(record.legalReviewRequirement)),
    records.every((record) => requires(record.technicalReviewRequirement)),
    GIS_1_0_SPRINT_6_CERTIFICATION === "GIS_1_0_SPRINT_6_CONTROLLED_PROVIDER_DUE_DILIGENCE_CERTIFIED",
    GIS_SPRINT_6_BOUNDARY_NOTE === "CONTROLLED_PROVIDER_DUE_DILIGENCE_DOES_NOT_AUTHORIZE_PROVIDER_USE",
  ].every(Boolean);
  if (!allScenariosValid) throw new Error("GIS Sprint 6 provider due-diligence scenario certification failed.");

  return Object.freeze({
    scenarioA: "OFFICIAL_DOCUMENTATION_VERIFIED",
    scenarioB: "PARTIALLY_VERIFIED",
    scenarioC: "LICENSING_REVIEW_REQUIRED",
    scenarioD: "ACCESS_METHOD_VERIFIED",
    scenarioE: "COMMERCIAL_REVIEW_REQUIRED",
    scenarioF: "ATTRIBUTION_REQUIREMENT_IDENTIFIED",
    scenarioG: "CONFLICTING_EVIDENCE",
    scenarioH: "VERIFICATION_REQUIRED",
    scenarioI: "SUPPLEMENTAL_SOURCE_ONLY",
    scenarioJ: "FALLBACK_SOURCE_CANDIDATE",
    scenarioK: "RECOMMENDED_FOR_CONTROLLED_PROVIDER_PILOT_AUTHORIZATION_REVIEW",
    scenarioL: "LEGAL_REVIEW_REQUIRED",
    scenarioM: "TECHNICAL_REVIEW_REQUIRED",
    scenarioN: "ZERO_PROVIDER_DATA_ACQUISITION",
  });
}

export function gisSprint6ProviderDueDiligenceFingerprint(): string {
  const records = buildGisSprint6ProviderDueDiligenceRecords();
  return stableGisEvidenceFingerprint({
    version: GIS_SPRINT_6_IMPLEMENTATION_VERSION,
    accessDate: GIS_SPRINT_6_REFERENCE_DATE,
    sources: GIS_SPRINT_6_SOURCE_REFERENCES,
    records: records.map((record) => ({
      id: record.dueDiligenceId,
      source: record.exactSourceOrDatasetReviewed,
      disposition: record.disposition,
      findings: record.findings.map((finding) => finding.findingId),
      fingerprint: record.deterministicFingerprint,
    })),
    comparison: buildGisSprint6DueDiligenceComparison(records),
    scenarios: certifyGisSprint6ProviderDueDiligenceScenarios(),
  });
}

function source(
  referenceId: string,
  providerOrAuthority: string,
  title: string,
  officialPublisher: string,
  url: string,
  publishedOrUpdatedDate: string | "UNKNOWN",
  contentCategory: GisDueDiligenceSourceReference["contentCategory"],
  evidenceSummary: string,
  verificationState: GisDueDiligenceVerificationState,
  authorityClassification: GisDueDiligenceSourceReference["authorityClassification"],
  notes: readonly string[],
): GisDueDiligenceSourceReference {
  const fingerprintInput = { referenceId, providerOrAuthority, title, officialPublisher, url, publishedOrUpdatedDate, evidenceSummary };
  return Object.freeze({
    referenceId,
    providerOrAuthority,
    title,
    officialPublisher,
    url,
    accessDate: GIS_SPRINT_6_REFERENCE_DATE,
    publishedOrUpdatedDate,
    contentCategory,
    evidenceSummary,
    verificationState,
    authorityClassification,
    contentFingerprint: stableGisEvidenceFingerprint(fingerprintInput),
    notes: Object.freeze(notes),
  });
}

function record(input: Omit<GisProviderDueDiligenceRecord, "dueDiligenceId" | "version" | "evaluationSubjectId" | "intelligenceDomains" | "accessDate" | "deterministicFingerprint" | "internalOnly" | "activation" | "authorizationFlags">): GisProviderDueDiligenceRecord {
  const fingerprintInput = {
    providerInventoryEntryId: input.providerInventoryEntryId,
    exactSourceOrDatasetReviewed: input.exactSourceOrDatasetReviewed,
    references: input.officialSourceReferenceIds,
    disposition: input.disposition,
    findings: input.findings.map((finding) => finding.findingId),
  };
  const deterministicFingerprint = stableGisEvidenceFingerprint(fingerprintInput);
  return Object.freeze({
    ...input,
    dueDiligenceId: `GIS-S6-DD-${deterministicFingerprint.slice(0, 20)}`,
    version: GIS_SPRINT_6_IMPLEMENTATION_VERSION,
    evaluationSubjectId: GIS_SPRINT_6_EVALUATION_SUBJECT,
    intelligenceDomains: Object.freeze(["ENVIRONMENTAL_INTELLIGENCE"]),
    accessDate: GIS_SPRINT_6_REFERENCE_DATE,
    findings: Object.freeze(input.findings),
    deterministicFingerprint,
    internalOnly: true,
    activation: GIS_FAIL_CLOSED_ACTIVATION,
    authorizationFlags: GIS_SPRINT_6_ZERO_AUTHORIZATION_FLAGS,
  });
}

function finding(
  findingId: string,
  provider: string,
  category: GisDueDiligenceFindingCategory,
  sourceReferenceIds: readonly string[],
  summary: string,
  confidence: GisDueDiligenceFinding["confidence"],
  verificationState: GisDueDiligenceVerificationState,
  unresolvedQuestions: readonly string[],
): GisDueDiligenceFinding {
  return Object.freeze({
    findingId,
    provider,
    sourceReferenceIds: Object.freeze(sourceReferenceIds),
    category,
    summary,
    confidence,
    verificationState,
    unresolvedQuestions: Object.freeze(unresolvedQuestions),
    material: true,
  });
}

function dispositionWeight(disposition: GisDueDiligenceDisposition): number {
  return {
    RECOMMENDED_FOR_CONTROLLED_PROVIDER_PILOT_AUTHORIZATION_REVIEW: 1,
    FALLBACK_SOURCE_CANDIDATE: 2,
    SUPPLEMENTAL_SOURCE_ONLY: 3,
    RETAINED_FOR_MONITORING: 4,
    LICENSING_REVIEW_REQUIRED: 5,
    LEGAL_REVIEW_REQUIRED: 6,
    TECHNICAL_REVIEW_REQUIRED: 7,
    COMMERCIAL_REVIEW_REQUIRED: 8,
    DEFERRED: 9,
    DUPLICATIVE_WITH_STRONGER_SOURCE: 10,
    INSUFFICIENT_OFFICIAL_EVIDENCE: 11,
    OUTSIDE_CAPABILITY_SCOPE: 12,
    REJECTED: 13,
    NOT_RESEARCHED: 14,
  }[disposition];
}

function requires(state: GisDueDiligenceReviewState): boolean {
  return state === "REQUIRED" || state === "REQUIRED_BEFORE_ANY_PILOT";
}
