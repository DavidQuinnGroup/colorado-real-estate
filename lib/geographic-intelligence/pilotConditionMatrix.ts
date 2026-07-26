import type { GisLicensingRightsState } from "./licensingResolutionContract.js";

export type GisPilotConditionMatrixEntry = Readonly<{
  conditionId: string;
  activity:
    | "PUBLIC_DOCUMENTATION_REVIEW"
    | "TECHNICAL_METADATA_INSPECTION"
    | "TRANSIENT_PAYLOAD_PROCESSING"
    | "RAW_PAYLOAD_RETENTION"
    | "NORMALIZED_EVIDENCE_RETENTION"
    | "AUDIT_METADATA_RETENTION"
    | "INTERNAL_DERIVED_OUTPUT"
    | "INTERNAL_VISUALIZATION"
    | "EXTERNAL_CUSTOMER_DISPLAY"
    | "REDISTRIBUTION"
    | "COMMERCIAL_USE";
  currentRightsState: GisLicensingRightsState;
  evidenceReferences: readonly string[];
  conditions: readonly string[];
  requiredAttribution: boolean;
  requiredDisclaimer: boolean;
  legalReviewStatus: GisLicensingRightsState;
  providerConfirmationStatus: GisLicensingRightsState;
  allowedForSprint8: false;
  allowedForFutureTechnicalFeasibilityDesign: boolean;
  allowedForFutureExecution: false;
}>;
