export const GIS_1_0_PROGRAM_AUTHORIZATION = "AUTHORIZED_FOR_ARCHITECTURE_AND_IMPLEMENTATION_PLANNING";
export const GIS_1_0_SPRINT_1_CLASSIFICATION = "GEOGRAPHIC_INTELLIGENCE_ARCHITECTURE_FOUNDATION";
export const GIS_1_0_SPRINT_1_CERTIFICATION = "GIS_1_0_SPRINT_1_ARCHITECTURE_FOUNDATION_CERTIFIED";

export type GeographicIntelligenceLifecycle =
  | "PROPOSED"
  | "GOVERNED"
  | "ACQUISITION_READY"
  | "PERSISTENCE_READY"
  | "RETRIEVAL_READY"
  | "CONSUMPTION_READY"
  | "RUNTIME_ENABLED"
  | "DOWNSTREAM_ENABLED"
  | "CUSTOMER_VISIBLE"
  | "RETIRED";

export type GeographicIntelligenceLayerState =
  | "NOT_AUTHORIZED"
  | "PLANNING_ONLY"
  | "FOUNDATION_DEFINED"
  | "AUTHORIZED"
  | "CERTIFIED"
  | "RETIRED";

export type GeographicIntelligenceActivationState = Readonly<{
  acquisitionAuthorized: boolean;
  persistenceAuthorized: boolean;
  retrievalAuthorized: boolean;
  enterpriseConsumptionAuthorized: boolean;
  runtimeAuthorized: boolean;
  downstreamIntegrationAuthorized: boolean;
  customerVisibilityAuthorized: boolean;
}>;

export const GIS_FAIL_CLOSED_ACTIVATION: GeographicIntelligenceActivationState = Object.freeze({
  acquisitionAuthorized: false,
  persistenceAuthorized: false,
  retrievalAuthorized: false,
  enterpriseConsumptionAuthorized: false,
  runtimeAuthorized: false,
  downstreamIntegrationAuthorized: false,
  customerVisibilityAuthorized: false,
});

export type GeographicIntelligenceConfidence =
  | "UNKNOWN"
  | "LOW"
  | "MODERATE"
  | "HIGH"
  | "AUTHORITATIVE";

export type GeographicIntelligenceFreshness =
  | "UNKNOWN"
  | "CURRENT"
  | "AGING"
  | "STALE"
  | "EXPIRED";

export type GeographicIntelligenceLicensingClassification =
  | "UNKNOWN"
  | "INTERNAL_RESEARCH_ONLY"
  | "INTERNAL_OPERATIONAL_USE"
  | "DERIVED_USE_ONLY"
  | "CUSTOMER_DISPLAY_ALLOWED"
  | "REDISTRIBUTION_ALLOWED"
  | "PROHIBITED";

export type GeographicIntelligencePermittedUse =
  | "UNKNOWN"
  | "INTERNAL_RESEARCH_ONLY"
  | "INTERNAL_OPERATIONAL_USE"
  | "DERIVED_USE_ONLY"
  | "CUSTOMER_DISPLAY_ALLOWED"
  | "REDISTRIBUTION_ALLOWED"
  | "PROHIBITED";

export type GeographicIntelligenceQualityState =
  | "UNKNOWN"
  | "UNVERIFIED"
  | "REVIEW_REQUIRED"
  | "GOVERNED_FIXTURE"
  | "APPROVED_INTERNAL"
  | "REJECTED";

export function isGisActivationClosed(state: GeographicIntelligenceActivationState): boolean {
  return Object.values(state).every((value) => value === false);
}

export function isGisCustomerUseAllowed(
  licensing: GeographicIntelligenceLicensingClassification,
  permittedUse: GeographicIntelligencePermittedUse,
  activation: GeographicIntelligenceActivationState,
): boolean {
  return licensing === "CUSTOMER_DISPLAY_ALLOWED"
    && permittedUse === "CUSTOMER_DISPLAY_ALLOWED"
    && activation.customerVisibilityAuthorized === true;
}

export function assertGisFailClosedActivation(state: GeographicIntelligenceActivationState): void {
  if (!isGisActivationClosed(state)) {
    throw new Error("GIS 1.0 Sprint 1 activation must remain fail-closed.");
  }
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/geographic-intelligence/activationContract.ts
