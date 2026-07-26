import { type GeographicIntelligenceActivationState } from "./activationContract.js";
import { type GeographicIntelligenceEvidenceSource } from "./evidenceContract.js";

export const GIS_PROVIDER_ADAPTER_BOUNDARY_LAYERS = Object.freeze([
  "ENTERPRISE_INTELLIGENCE_SEMANTICS",
  "PROVIDER_SPECIFIC_ACQUISITION",
  "PROVIDER_SPECIFIC_NORMALIZATION",
  "EVIDENCE_RETENTION",
  "INTELLIGENCE_DERIVATION",
  "PERSISTENCE",
  "RETRIEVAL",
  "RUNTIME_CONSUMPTION",
  "CUSTOMER_PRESENTATION",
] as const);

export type GeographicIntelligenceProviderAdapterBoundary = Readonly<{
  adapterIdentity: string;
  adapterVersion: string;
  providerIdentity: string;
  inventoryContextOnly: boolean;
  boundaryLayers: typeof GIS_PROVIDER_ADAPTER_BOUNDARY_LAYERS;
  activation: GeographicIntelligenceActivationState;
  mayCallExternalService: false;
  mayReadCredentials: false;
  mayReadEnvironmentVariables: false;
  mayScrape: false;
  mayWriteProductionData: false;
  mayRegisterRuntime: false;
  mayPresentToCustomers: false;
  evidenceOutputContract: GeographicIntelligenceEvidenceSource["evidenceIdentity"] | null;
}>;

export function assertGisProviderBoundaryInert(boundary: GeographicIntelligenceProviderAdapterBoundary): void {
  if (!boundary.adapterIdentity.trim()) throw new Error("GIS provider adapter identity is required.");
  if (!boundary.adapterVersion.trim()) throw new Error("GIS provider adapter version is required.");
  if (!boundary.providerIdentity.trim()) throw new Error("GIS provider identity is required.");
  if (boundary.inventoryContextOnly !== true) throw new Error("Provider inventory is context only in GIS Sprint 1.");
  if (
    boundary.mayCallExternalService
    || boundary.mayReadCredentials
    || boundary.mayReadEnvironmentVariables
    || boundary.mayScrape
    || boundary.mayWriteProductionData
    || boundary.mayRegisterRuntime
    || boundary.mayPresentToCustomers
  ) {
    throw new Error("GIS Sprint 1 provider boundary must remain inert.");
  }
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/geographic-intelligence/providerAdapterContract.ts
