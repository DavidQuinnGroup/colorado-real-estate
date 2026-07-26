import { createHash } from "node:crypto";

import {
  GIS_FAIL_CLOSED_ACTIVATION,
  assertGisFailClosedActivation,
  isGisCustomerUseAllowed,
} from "../activationContract.js";
import {
  assertGisDerivedLineage,
  type DerivedGeographicIntelligence,
} from "../derivedIntelligenceContract.js";
import {
  type GeographicIntelligenceSubject,
  assertGisSubjectIdentity,
} from "../domainContract.js";
import {
  assertGisEvidenceIdentity,
  isGisEvidenceRightsFailClosed,
  type GeographicIntelligenceEvidenceSource,
} from "../evidenceContract.js";
import {
  assertGisObservationIdentity,
  isGisForecastDistinguishable,
  type GeographicIntelligenceObservation,
} from "../observationContract.js";
import {
  GIS_PROVIDER_ADAPTER_BOUNDARY_LAYERS,
  assertGisProviderBoundaryInert,
  type GeographicIntelligenceProviderAdapterBoundary,
} from "../providerAdapterContract.js";

export const GIS_SPRINT_1_FIXTURE_TIMESTAMP = "2026-07-26T12:00:00.000Z";

export const GIS_SPRINT_1_SYNTHETIC_SUBJECT: GeographicIntelligenceSubject = Object.freeze({
  subjectIdentity: "GIS-S1-SYNTHETIC-SUBJECT-001",
  subjectSelectionContract: "SYNTHETIC_FIXTURE_SUBJECT",
  objectType: "SYNTHETIC",
  canonicalName: "Synthetic Planning Geography",
  canonicalSlug: "synthetic-planning-geography",
  lifecycle: "SYNTHETIC_FIXTURE",
  visibility: "INTERNAL_ONLY",
  relationshipCount: 0,
  productionRuntimeRead: false,
});

export const GIS_SPRINT_1_CONTRACT_ONLY_COLORADO_SUBJECT: GeographicIntelligenceSubject = Object.freeze({
  subjectIdentity: "GIS-S1-CONTRACT-ONLY-COLORADO-STATE",
  subjectSelectionContract: "CONTRACT_ONLY_GOVERNED_SUBJECT_REFERENCE",
  objectType: "STATE",
  canonicalName: "Colorado",
  canonicalSlug: "colorado",
  lifecycle: "DRAFT",
  visibility: "INTERNAL_ONLY",
  relationshipCount: 0,
  productionRuntimeRead: false,
});

export const GIS_SPRINT_1_UNKNOWN_LICENSE_EVIDENCE: GeographicIntelligenceEvidenceSource = Object.freeze({
  evidenceIdentity: "GIS-S1-EVIDENCE-SYNTHETIC-UNKNOWN-RIGHTS",
  sourceIdentity: "Synthetic GIS Sprint 1 Fixture Source",
  providerIdentity: "SYNTHETIC_FIXTURE_PROVIDER",
  sourceType: "SYNTHETIC_FIXTURE",
  sourceAuthority: "UNKNOWN",
  sourceLocator: null,
  sourceLocatorPermitted: false,
  licensingClassification: "UNKNOWN",
  permittedUse: "UNKNOWN",
  acquisitionMethod: "SYNTHETIC_FIXTURE",
  retrievedTime: GIS_SPRINT_1_FIXTURE_TIMESTAMP,
  publishedTime: null,
  effectiveTime: null,
  expirationTime: null,
  freshness: "UNKNOWN",
  jurisdiction: "SYNTHETIC",
  evidenceVersion: "GIS_SPRINT_1_SYNTHETIC_EVIDENCE_V1",
  checksumOrFingerprint: stableGisFingerprint("GIS-S1-EVIDENCE-SYNTHETIC-UNKNOWN-RIGHTS"),
  internalOnly: true,
});

export const GIS_SPRINT_1_FIXTURE_OBSERVATION: GeographicIntelligenceObservation = Object.freeze({
  observationIdentity: "GIS-S1-OBSERVATION-COMMUNITY-FIXTURE-001",
  subject: GIS_SPRINT_1_SYNTHETIC_SUBJECT,
  domainId: "COMMUNITY_INTELLIGENCE",
  metricOrAssertionIdentity: "synthetic.community.fixture.reported_context",
  observationKind: "REPORTED_FACT",
  value: Object.freeze({ representation: "STRING" as const, value: "Synthetic internal-only planning observation" }),
  unit: null,
  observationTime: GIS_SPRINT_1_FIXTURE_TIMESTAMP,
  effectiveInterval: { start: null, end: null },
  evidenceIdentities: Object.freeze([GIS_SPRINT_1_UNKNOWN_LICENSE_EVIDENCE.evidenceIdentity]),
  confidence: "UNKNOWN",
  freshness: "UNKNOWN",
  qualityState: "GOVERNED_FIXTURE",
  transformationLineage: Object.freeze(["GIS_SPRINT_1_SYNTHETIC_FIXTURE_ONLY"]),
  internalOnly: true,
});

export const GIS_SPRINT_1_FORECAST_FIXTURE_OBSERVATION: GeographicIntelligenceObservation = Object.freeze({
  ...GIS_SPRINT_1_FIXTURE_OBSERVATION,
  observationIdentity: "GIS-S1-OBSERVATION-MARKET-FORECAST-FIXTURE-001",
  domainId: "MARKET_INTELLIGENCE",
  metricOrAssertionIdentity: "synthetic.market.fixture.forecast_context",
  observationKind: "FORECAST",
});

export const GIS_SPRINT_1_DERIVED_FIXTURE: DerivedGeographicIntelligence = Object.freeze({
  transformationIdentity: "GIS-S1-DETERMINISTIC-FIXTURE-TRANSFORMATION",
  transformationVersion: "GIS_SPRINT_1_TRANSFORMATION_V1",
  inputEvidenceIdentities: Object.freeze([GIS_SPRINT_1_UNKNOWN_LICENSE_EVIDENCE.evidenceIdentity]),
  inputObservationIdentities: Object.freeze([GIS_SPRINT_1_FIXTURE_OBSERVATION.observationIdentity]),
  outputIdentity: "GIS-S1-DERIVED-COMMUNITY-FIXTURE-001",
  methodClassification: "DETERMINISTIC_FIXTURE_TRANSFORMATION",
  assumptions: Object.freeze(["Synthetic fixture only; no live provider data; no production read; no customer display."]),
  confidence: "UNKNOWN",
  reproducible: true,
  contentFingerprint: stableGisFingerprint("GIS-S1-DERIVED-COMMUNITY-FIXTURE-001"),
  explainabilitySummary: "Uses one synthetic evidence identity and one synthetic observation identity to prove lineage shape only.",
  internalOnly: true,
});

export const GIS_SPRINT_1_PROVIDER_BOUNDARY_FIXTURE: GeographicIntelligenceProviderAdapterBoundary = Object.freeze({
  adapterIdentity: "GIS-S1-PROVIDER-BOUNDARY-PLANNING-CONTRACT",
  adapterVersion: "GIS_SPRINT_1_PROVIDER_BOUNDARY_V1",
  providerIdentity: "INVENTORY_CONTEXT_ONLY",
  inventoryContextOnly: true,
  boundaryLayers: GIS_PROVIDER_ADAPTER_BOUNDARY_LAYERS,
  activation: GIS_FAIL_CLOSED_ACTIVATION,
  mayCallExternalService: false,
  mayReadCredentials: false,
  mayReadEnvironmentVariables: false,
  mayScrape: false,
  mayWriteProductionData: false,
  mayRegisterRuntime: false,
  mayPresentToCustomers: false,
  evidenceOutputContract: null,
});

export function stableGisFingerprint(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function assertGisSprint1FixturesGoverned(): void {
  for (const subject of [GIS_SPRINT_1_SYNTHETIC_SUBJECT, GIS_SPRINT_1_CONTRACT_ONLY_COLORADO_SUBJECT]) {
    assertGisSubjectIdentity(subject);
  }
  assertGisEvidenceIdentity(GIS_SPRINT_1_UNKNOWN_LICENSE_EVIDENCE);
  if (!isGisEvidenceRightsFailClosed(GIS_SPRINT_1_UNKNOWN_LICENSE_EVIDENCE)) {
    throw new Error("GIS Sprint 1 unknown licensing must fail closed.");
  }
  if (isGisCustomerUseAllowed(
    GIS_SPRINT_1_UNKNOWN_LICENSE_EVIDENCE.licensingClassification,
    GIS_SPRINT_1_UNKNOWN_LICENSE_EVIDENCE.permittedUse,
    GIS_FAIL_CLOSED_ACTIVATION,
  )) {
    throw new Error("GIS Sprint 1 unknown rights must not allow customer use.");
  }
  for (const observation of [GIS_SPRINT_1_FIXTURE_OBSERVATION, GIS_SPRINT_1_FORECAST_FIXTURE_OBSERVATION]) {
    assertGisObservationIdentity(observation);
    if (!isGisForecastDistinguishable(observation)) throw new Error("GIS forecast observations must be distinguishable.");
  }
  assertGisDerivedLineage(GIS_SPRINT_1_DERIVED_FIXTURE);
  assertGisProviderBoundaryInert(GIS_SPRINT_1_PROVIDER_BOUNDARY_FIXTURE);
  assertGisFailClosedActivation(GIS_SPRINT_1_PROVIDER_BOUNDARY_FIXTURE.activation);
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/geographic-intelligence/fixtures/gisSprint1Fixtures.ts
