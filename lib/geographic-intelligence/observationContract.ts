import {
  type GeographicIntelligenceConfidence,
  type GeographicIntelligenceFreshness,
  type GeographicIntelligenceQualityState,
} from "./activationContract.js";
import { type GeographicIntelligenceDomainId, type GeographicIntelligenceSubject } from "./domainContract.js";

export type GeographicIntelligenceObservationKind =
  | "OBSERVED_FACT"
  | "REPORTED_FACT"
  | "CALCULATED_FACT"
  | "ESTIMATED_FACT"
  | "FORECAST"
  | "QUALITATIVE_ASSESSMENT";

export type GeographicIntelligenceValue = Readonly<{
  representation: "NUMBER" | "STRING" | "BOOLEAN" | "RANGE" | "CATEGORY" | "NARRATIVE" | "UNKNOWN";
  value: string | number | boolean | null;
}>;

export type GeographicIntelligenceObservation = Readonly<{
  observationIdentity: string;
  subject: GeographicIntelligenceSubject;
  domainId: GeographicIntelligenceDomainId;
  metricOrAssertionIdentity: string;
  observationKind: GeographicIntelligenceObservationKind;
  value: GeographicIntelligenceValue;
  unit: string | null;
  observationTime: string;
  effectiveInterval: { start: string | null; end: string | null };
  evidenceIdentities: readonly string[];
  confidence: GeographicIntelligenceConfidence;
  freshness: GeographicIntelligenceFreshness;
  qualityState: GeographicIntelligenceQualityState;
  transformationLineage: readonly string[];
  internalOnly: true;
}>;

export function assertGisObservationIdentity(observation: GeographicIntelligenceObservation): void {
  if (!observation.observationIdentity.trim()) throw new Error("GIS observation identity is required.");
  if (!observation.domainId.trim()) throw new Error("GIS observation domain identity is required.");
  if (!observation.metricOrAssertionIdentity.trim()) throw new Error("GIS metric or assertion identity is required.");
  if (observation.evidenceIdentities.length === 0) throw new Error("GIS observation evidence identity is required.");
}

export function isGisForecastDistinguishable(observation: GeographicIntelligenceObservation): boolean {
  return observation.observationKind !== "FORECAST" || observation.metricOrAssertionIdentity.includes("forecast");
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/geographic-intelligence/observationContract.ts
