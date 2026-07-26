import type { GIS_SPRINT_8_REFERENCE_DATE } from "./licensingResolutionContract.js";

export type GisAttributionRecord = Readonly<{
  attributionId: string;
  provider: "Colorado Geological Survey";
  datasetOrService: "Colorado Landslide Inventory";
  requiredCreditText: string;
  requiredSourceName: "Colorado Geological Survey";
  requiredUrl: string;
  requiredPublicationDate: "2022-02-01";
  requiredAccessDate: typeof GIS_SPRINT_8_REFERENCE_DATE;
  requiredDisclaimer: string;
  requiredModificationNotice: "UNRESOLVED";
  requiredLicenseLink: "UNRESOLVED";
  logoRequirement: "UNRESOLVED";
  placementRequirement: "ATTACH_TO_INTERNAL_OUTPUT_AND_ANY_FUTURE_DISPLAY";
  persistenceRequirement: "PRESERVE_WITH_AUDIT_METADATA_AND_DERIVED_OUTPUT";
  displayContextApplicability: "CUSTOMER_OUTPUT_NOT_AUTHORIZED";
  internalOutputApplicability: "REQUIRED_IF_INTERNAL_OUTPUT_IS_CREATED_IN_FUTURE_PHASE";
  customerOutputApplicability: "NOT_AUTHORIZED";
  unresolvedRequirements: readonly string[];
  evidenceReferences: readonly string[];
  deterministicFingerprint: string;
}>;
