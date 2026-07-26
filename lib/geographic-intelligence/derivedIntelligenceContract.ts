import { type GeographicIntelligenceConfidence } from "./activationContract.js";

export type GeographicIntelligenceTransformationMethod =
  | "NONE"
  | "DETERMINISTIC_FIXTURE_TRANSFORMATION"
  | "NORMALIZATION"
  | "AGGREGATION"
  | "CLASSIFICATION"
  | "FORECAST_MODEL"
  | "QUALITATIVE_SYNTHESIS";

export type DerivedGeographicIntelligence = Readonly<{
  transformationIdentity: string;
  transformationVersion: string;
  inputEvidenceIdentities: readonly string[];
  inputObservationIdentities: readonly string[];
  outputIdentity: string;
  methodClassification: GeographicIntelligenceTransformationMethod;
  assumptions: readonly string[];
  confidence: GeographicIntelligenceConfidence;
  reproducible: boolean;
  contentFingerprint: string;
  explainabilitySummary: string;
  internalOnly: true;
}>;

export function assertGisDerivedLineage(derived: DerivedGeographicIntelligence): void {
  if (!derived.transformationIdentity.trim()) throw new Error("GIS transformation identity is required.");
  if (!derived.transformationVersion.trim()) throw new Error("GIS transformation version is required.");
  if (derived.inputEvidenceIdentities.length === 0) throw new Error("GIS derived intelligence requires input evidence.");
  if (derived.inputObservationIdentities.length === 0) throw new Error("GIS derived intelligence requires input observations.");
  if (!derived.outputIdentity.trim()) throw new Error("GIS derived output identity is required.");
  if (!derived.contentFingerprint.trim()) throw new Error("GIS derived content fingerprint is required.");
  if (!derived.explainabilitySummary.trim()) throw new Error("GIS derived explainability summary is required.");
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/geographic-intelligence/derivedIntelligenceContract.ts
