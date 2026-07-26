import {
  type GeographicIntelligenceActivationState,
  type GeographicIntelligenceLayerState,
  type GeographicIntelligenceLifecycle,
} from "./activationContract.js";

export type GeographicIntelligenceDomainId =
  | "COMMUNITY_INTELLIGENCE"
  | "EDUCATION_INTELLIGENCE"
  | "TRANSPORTATION_INTELLIGENCE"
  | "ENVIRONMENTAL_INTELLIGENCE"
  | "ECONOMIC_INTELLIGENCE"
  | "INFRASTRUCTURE_INTELLIGENCE"
  | "MARKET_INTELLIGENCE"
  | "LIFESTYLE_INTELLIGENCE";

export type GeographicIntelligenceDomain = Readonly<{
  domainId: GeographicIntelligenceDomainId;
  canonicalName: string;
  description: string;
  lifecycle: GeographicIntelligenceLifecycle;
  governanceState: GeographicIntelligenceLayerState;
  acquisitionState: GeographicIntelligenceLayerState;
  persistenceState: GeographicIntelligenceLayerState;
  retrievalState: GeographicIntelligenceLayerState;
  enterpriseConsumptionState: GeographicIntelligenceLayerState;
  runtimeState: GeographicIntelligenceLayerState;
  downstreamIntegrationState: GeographicIntelligenceLayerState;
  customerVisibilityState: GeographicIntelligenceLayerState;
  activation: GeographicIntelligenceActivationState;
  requiredEvidenceCharacteristics: readonly string[];
  likelyIntelligenceCategories: readonly string[];
  unsupportedInGisSprint1: readonly string[];
}>;

export type GeographicIntelligenceSubject = Readonly<{
  subjectIdentity: string;
  subjectSelectionContract: "SYNTHETIC_FIXTURE_SUBJECT" | "CONTRACT_ONLY_GOVERNED_SUBJECT_REFERENCE";
  objectType: "STATE" | "MUNICIPALITY" | "NEIGHBORHOOD" | "MARKET_AREA" | "ZIP_CODE" | "SUBDIVISION" | "SYNTHETIC";
  canonicalName: string;
  canonicalSlug: string;
  lifecycle: "DRAFT" | "SYNTHETIC_FIXTURE";
  visibility: "INTERNAL_ONLY";
  relationshipCount: 0;
  productionRuntimeRead: false;
}>;

export function assertGisSubjectIdentity(subject: GeographicIntelligenceSubject): void {
  if (!subject.subjectIdentity.trim()) throw new Error("GIS subject identity is required.");
  if (!subject.canonicalName.trim()) throw new Error("GIS subject canonical name is required.");
  if (!subject.canonicalSlug.trim()) throw new Error("GIS subject canonical slug is required.");
  if (subject.relationshipCount !== 0) throw new Error("GIS Sprint 1 must not create or infer relationships.");
  if (subject.productionRuntimeRead !== false) throw new Error("GIS Sprint 1 must not activate production runtime reads.");
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/geographic-intelligence/domainContract.ts
