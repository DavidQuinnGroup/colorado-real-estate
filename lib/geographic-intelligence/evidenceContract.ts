import {
  type GeographicIntelligenceFreshness,
  type GeographicIntelligenceLicensingClassification,
  type GeographicIntelligencePermittedUse,
} from "./activationContract.js";

export type GeographicIntelligenceSourceType =
  | "AUTHORITATIVE_PUBLIC_RECORD"
  | "ENTERPRISE_INVENTORY_CONTEXT"
  | "SYNTHETIC_FIXTURE"
  | "PROVIDER_SUPPLIED"
  | "DERIVED_INTERNAL_RECORD";

export type GeographicIntelligenceEvidenceSource = Readonly<{
  evidenceIdentity: string;
  sourceIdentity: string;
  providerIdentity: string;
  sourceType: GeographicIntelligenceSourceType;
  sourceAuthority: "UNKNOWN" | "LOW" | "MODERATE" | "HIGH" | "AUTHORITATIVE";
  sourceLocator: string | null;
  sourceLocatorPermitted: boolean;
  licensingClassification: GeographicIntelligenceLicensingClassification;
  permittedUse: GeographicIntelligencePermittedUse;
  acquisitionMethod: "NONE" | "SYNTHETIC_FIXTURE" | "GOVERNED_RECORD_REFERENCE" | "FUTURE_PROVIDER_ADAPTER";
  retrievedTime: string;
  publishedTime: string | null;
  effectiveTime: string | null;
  expirationTime: string | null;
  freshness: GeographicIntelligenceFreshness;
  jurisdiction: string;
  evidenceVersion: string;
  checksumOrFingerprint: string;
  internalOnly: true;
}>;

export function assertGisEvidenceIdentity(evidence: GeographicIntelligenceEvidenceSource): void {
  if (!evidence.evidenceIdentity.trim()) throw new Error("GIS evidence identity is required.");
  if (!evidence.sourceIdentity.trim()) throw new Error("GIS source identity is required.");
  if (!evidence.providerIdentity.trim()) throw new Error("GIS provider identity is required.");
  if (!evidence.checksumOrFingerprint.trim()) throw new Error("GIS evidence fingerprint is required.");
}

export function isGisEvidenceRightsFailClosed(evidence: GeographicIntelligenceEvidenceSource): boolean {
  return evidence.licensingClassification === "UNKNOWN"
    || evidence.permittedUse === "UNKNOWN"
    || evidence.licensingClassification === "PROHIBITED"
    || evidence.permittedUse === "PROHIBITED";
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/geographic-intelligence/evidenceContract.ts
