import {
  createEvidenceDepthIdentity,
  evaluateEvidenceFreshness,
  finalizeEvidenceDepthItem,
  type EvidenceDepthAcquisitionMethod,
  type EvidenceDepthConflictStatus,
  type EvidenceDepthDomain,
  type EvidenceDepthEvidenceItem,
  type EvidenceDepthFreshnessStatus,
  type EvidenceDepthInspectionStatus,
  type EvidenceDepthLimitationCategory,
  type EvidenceDepthLineageReference,
  type EvidenceDepthRightsStatus,
  type EvidenceDepthSourceIdentity,
  type EvidenceDepthSourceType,
  type EvidenceDepthSubject,
  type EvidenceDepthSupportLevel,
  type EvidenceDepthSupersessionStatus,
} from "./evidencePosture.js";

export const EVIDENCE_DEPTH_REFERENCE_DATE = "2026-07-31T00:00:00.000Z";

type FixtureDraft = Readonly<{
  fixtureId: string;
  subject: EvidenceDepthSubject;
  domain: EvidenceDepthDomain;
  assertionId: string;
  source: EvidenceDepthSourceIdentity;
  acquisitionMethod: EvidenceDepthAcquisitionMethod;
  acquisitionTimestamp: string | null;
  observedOrEffectiveDate: string | null;
  freshnessStatus?: EvidenceDepthFreshnessStatus;
  supportLevel: EvidenceDepthSupportLevel;
  limitations: readonly EvidenceDepthLimitationCategory[];
  conflictStatus: EvidenceDepthConflictStatus;
  supersessionStatus: EvidenceDepthSupersessionStatus;
  lineage?: readonly EvidenceDepthLineageReference[];
  inspectionStatus: EvidenceDepthInspectionStatus;
}>;

const syntheticSubject: EvidenceDepthSubject = Object.freeze({
  subjectId: "REIE-EVIDENCE-DEPTH-FIXTURE-CITY",
  subjectType: "SYNTHETIC_FIXTURE",
  canonicalName: "Synthetic Evidence Depth Fixture",
  canonicalRoute: null,
});

export const EVIDENCE_DEPTH_FIXTURES: readonly EvidenceDepthEvidenceItem[] = Object.freeze([
  makeFixture({
    fixtureId: "public-use-complete-provenance",
    subject: syntheticSubject,
    domain: "LOCAL_DECISION_INTELLIGENCE",
    assertionId: "city-market-context",
    source: source("repository-governed-market", "Repository governed market context", "MLS_DERIVED", "PUBLIC_DISPLAY_PERMITTED", true),
    acquisitionMethod: "EXISTING_CERTIFIED_PIPELINE",
    acquisitionTimestamp: "2026-07-30T12:00:00.000Z",
    observedOrEffectiveDate: "2026-07-15T00:00:00.000Z",
    supportLevel: "DIRECT",
    limitations: [],
    conflictStatus: "NO_KNOWN_CONFLICT",
    supersessionStatus: "CURRENT_VERSION",
    inspectionStatus: "REPOSITORY_LOCAL_REVIEWED",
  }),
  makeFixture({
    fixtureId: "attribution-required-evidence",
    subject: syntheticSubject,
    domain: "SOURCE_RIGHTS",
    assertionId: "owned-imagery-public-display",
    source: source("dqg-owned-imagery", "DQG owned imagery rights fixture", "IMAGERY", "PUBLIC_DISPLAY_PERMITTED_WITH_ATTRIBUTION", true),
    acquisitionMethod: "REPOSITORY_LOCAL_REFERENCE",
    acquisitionTimestamp: "2026-07-29T12:00:00.000Z",
    observedOrEffectiveDate: "2026-07-29T00:00:00.000Z",
    supportLevel: "DIRECT",
    limitations: ["ATTRIBUTION_REQUIRED"],
    conflictStatus: "NO_KNOWN_CONFLICT",
    supersessionStatus: "CURRENT_VERSION",
    inspectionStatus: "FOUNDATION_FIXTURE_VALIDATED",
  }),
  makeFixture({
    fixtureId: "internal-only-evidence",
    subject: syntheticSubject,
    domain: "PROPERTY_INTELLIGENCE",
    assertionId: "internal-property-context",
    source: source("internal-review-note", "Internal property review fixture", "REPOSITORY_GOVERNED", "INTERNAL_ANALYSIS_ONLY", false),
    acquisitionMethod: "GOVERNED_RECORD_REFERENCE",
    acquisitionTimestamp: "2026-07-28T12:00:00.000Z",
    observedOrEffectiveDate: "2026-07-28T00:00:00.000Z",
    supportLevel: "CONTEXTUAL",
    limitations: ["NON_PUBLIC_USE_RESTRICTION", "PROFESSIONAL_VERIFICATION_REQUIRED"],
    conflictStatus: "NO_KNOWN_CONFLICT",
    supersessionStatus: "CURRENT_VERSION",
    inspectionStatus: "REPOSITORY_LOCAL_REVIEWED",
  }),
  makeFixture({
    fixtureId: "unknown-rights-evidence",
    subject: syntheticSubject,
    domain: "NEIGHBORHOOD_INTELLIGENCE",
    assertionId: "municipal-planning-context",
    source: source("municipal-planning-unresolved", "Municipal planning unresolved fixture", "MUNICIPAL_RECORD", "UNKNOWN_OR_UNRESOLVED", false),
    acquisitionMethod: "NOT_ACQUIRED",
    acquisitionTimestamp: null,
    observedOrEffectiveDate: "2025-01-15T00:00:00.000Z",
    supportLevel: "CONTEXTUAL",
    limitations: ["UNCERTAIN_RIGHTS", "PROFESSIONAL_VERIFICATION_REQUIRED"],
    conflictStatus: "INSUFFICIENT_INFORMATION_TO_RECONCILE",
    supersessionStatus: "NOT_APPLICABLE",
    inspectionStatus: "PROVIDER_CONFIRMATION_REQUIRED",
  }),
  makeFixture({
    fixtureId: "stale-evidence",
    subject: syntheticSubject,
    domain: "MARKET_INTELLIGENCE",
    assertionId: "stale-market-context",
    source: source("stale-market-fixture", "Stale market fixture", "REPOSITORY_GOVERNED", "PUBLIC_DISPLAY_PERMITTED_WITH_ATTRIBUTION", true),
    acquisitionMethod: "REPOSITORY_LOCAL_REFERENCE",
    acquisitionTimestamp: "2026-01-01T12:00:00.000Z",
    observedOrEffectiveDate: "2025-01-01T00:00:00.000Z",
    supportLevel: "CORROBORATIVE",
    limitations: ["STALE_EVIDENCE", "INCOMPLETE_TEMPORAL_COVERAGE"],
    conflictStatus: "NO_KNOWN_CONFLICT",
    supersessionStatus: "CURRENT_VERSION",
    inspectionStatus: "REPOSITORY_LOCAL_REVIEWED",
  }),
  makeFixture({
    fixtureId: "undated-evidence",
    subject: syntheticSubject,
    domain: "DECISION_GUIDE",
    assertionId: "editorial-context-undated",
    source: source("editorial-guide-fixture", "Editorial guide fixture", "REPOSITORY_GOVERNED", "DERIVED_OR_SUMMARY_USE_ONLY", true),
    acquisitionMethod: "REPOSITORY_LOCAL_REFERENCE",
    acquisitionTimestamp: null,
    observedOrEffectiveDate: null,
    supportLevel: "CONTEXTUAL",
    limitations: ["INCOMPLETE_TEMPORAL_COVERAGE", "CITYWIDE_NOT_PROPERTY_SPECIFIC"],
    conflictStatus: "NO_KNOWN_CONFLICT",
    supersessionStatus: "CURRENT_VERSION",
    inspectionStatus: "REPOSITORY_LOCAL_REVIEWED",
  }),
  makeFixture({
    fixtureId: "conflicting-evidence-a",
    subject: syntheticSubject,
    domain: "GEOGRAPHIC_INTELLIGENCE",
    assertionId: "object-classification-conflict",
    source: source("classification-fixture-a", "Classification fixture A", "SYNTHETIC_FIXTURE", "PUBLIC_DISPLAY_PERMITTED", false),
    acquisitionMethod: "SYNTHETIC_FIXTURE",
    acquisitionTimestamp: "2026-07-31T00:00:00.000Z",
    observedOrEffectiveDate: "2026-07-31T00:00:00.000Z",
    supportLevel: "DIRECT",
    limitations: ["UNRESOLVED_CONFLICT"],
    conflictStatus: "UNRESOLVED_CONFLICT",
    supersessionStatus: "CURRENT_VERSION",
    lineage: [
      {
        relationship: "CONFLICTS_WITH",
        evidenceId: "edfi_conflicting_evidence_b",
        evidenceVersionId: "edfv_conflicting_evidence_b_v1",
        purpose: "Preserve fixture disagreement without selecting a winner.",
      },
    ],
    inspectionStatus: "FOUNDATION_FIXTURE_VALIDATED",
  }),
  makeFixture({
    fixtureId: "conflicting-evidence-b",
    subject: syntheticSubject,
    domain: "GEOGRAPHIC_INTELLIGENCE",
    assertionId: "object-classification-conflict",
    source: source("classification-fixture-b", "Classification fixture B", "SYNTHETIC_FIXTURE", "PUBLIC_DISPLAY_PERMITTED", false),
    acquisitionMethod: "SYNTHETIC_FIXTURE",
    acquisitionTimestamp: "2026-07-31T00:00:00.000Z",
    observedOrEffectiveDate: "2026-07-31T00:00:00.000Z",
    supportLevel: "DIRECT",
    limitations: ["UNRESOLVED_CONFLICT"],
    conflictStatus: "MATERIAL_CONFLICT",
    supersessionStatus: "CURRENT_VERSION",
    lineage: [
      {
        relationship: "CONFLICTS_WITH",
        evidenceId: "edfi_conflicting_evidence_a",
        evidenceVersionId: "edfv_conflicting_evidence_a_v1",
        purpose: "Preserve fixture disagreement without selecting a winner.",
      },
    ],
    inspectionStatus: "FOUNDATION_FIXTURE_VALIDATED",
  }),
  makeFixture({
    fixtureId: "superseded-evidence",
    subject: syntheticSubject,
    domain: "LOCAL_DECISION_INTELLIGENCE",
    assertionId: "superseded-city-context",
    source: source("historical-city-context", "Historical city context fixture", "REPOSITORY_GOVERNED", "PUBLIC_DISPLAY_PERMITTED_WITH_ATTRIBUTION", true),
    acquisitionMethod: "REPOSITORY_LOCAL_REFERENCE",
    acquisitionTimestamp: "2025-06-01T12:00:00.000Z",
    observedOrEffectiveDate: "2025-06-01T00:00:00.000Z",
    supportLevel: "CONTEXTUAL",
    limitations: ["SUPERSEDED_EVIDENCE"],
    conflictStatus: "SUPERSEDED_EVIDENCE",
    supersessionStatus: "SUPERSEDED_BY_NEWER",
    lineage: [
      {
        relationship: "SUPERSEDED_BY",
        evidenceId: "edfi_public_use_complete_provenance",
        evidenceVersionId: "edfv_public_use_complete_provenance_v1",
        purpose: "Retain historical evidence while blocking current support.",
      },
    ],
    inspectionStatus: "REPOSITORY_LOCAL_REVIEWED",
  }),
  makeFixture({
    fixtureId: "eligible-with-limitations",
    subject: syntheticSubject,
    domain: "CROSS_CITY_COMPARISON",
    assertionId: "comparison-context-limited",
    source: source("comparison-limited-fixture", "Comparison limited fixture", "REPOSITORY_GOVERNED", "DERIVED_OR_SUMMARY_USE_ONLY", true),
    acquisitionMethod: "REPOSITORY_LOCAL_REFERENCE",
    acquisitionTimestamp: "2026-07-15T12:00:00.000Z",
    observedOrEffectiveDate: "2026-07-15T00:00:00.000Z",
    supportLevel: "CORROBORATIVE",
    limitations: ["AGGREGATION_LIMITATION", "CITYWIDE_NOT_PROPERTY_SPECIFIC"],
    conflictStatus: "COMPATIBLE_EVIDENCE",
    supersessionStatus: "CURRENT_VERSION",
    inspectionStatus: "REPOSITORY_LOCAL_REVIEWED",
  }),
  makeFixture({
    fixtureId: "blocked-evidence",
    subject: syntheticSubject,
    domain: "PROPERTY_INTELLIGENCE",
    assertionId: "blocked-property-record",
    source: source("restricted-property-record", "Restricted property record fixture", "PUBLIC_RECORD", "RESTRICTED", false),
    acquisitionMethod: "NOT_ACQUIRED",
    acquisitionTimestamp: null,
    observedOrEffectiveDate: "2026-07-01T00:00:00.000Z",
    supportLevel: "UNSUPPORTED",
    limitations: ["NON_PUBLIC_USE_RESTRICTION", "UNCERTAIN_RIGHTS", "PROFESSIONAL_VERIFICATION_REQUIRED"],
    conflictStatus: "INSUFFICIENT_INFORMATION_TO_RECONCILE",
    supersessionStatus: "NOT_APPLICABLE",
    inspectionStatus: "BLOCKED",
  }),
]);

function makeFixture(draft: FixtureDraft): EvidenceDepthEvidenceItem {
  const normalizedFixtureId = draft.fixtureId.split("-").join("_");
  const evidenceId = `edfi_${normalizedFixtureId}`;
  const evidenceVersionId = `edfv_${normalizedFixtureId}_v1`;
  const freshnessStatus = draft.freshnessStatus ?? evaluateEvidenceFreshness(draft.domain, draft.observedOrEffectiveDate, EVIDENCE_DEPTH_REFERENCE_DATE);
  return finalizeEvidenceDepthItem({
    evidenceId,
    evidenceVersionId,
    evidenceFamilyId: createEvidenceDepthIdentity({
      fixtureId: draft.fixtureId,
      subjectId: draft.subject.subjectId,
      domain: draft.domain,
      assertionId: draft.assertionId,
    }),
    subject: draft.subject,
    domain: draft.domain,
    assertionId: draft.assertionId,
    source: draft.source,
    acquisitionMethod: draft.acquisitionMethod,
    acquisitionTimestamp: draft.acquisitionTimestamp,
    observedOrEffectiveDate: draft.observedOrEffectiveDate,
    freshnessStatus,
    evidenceVersion: "1",
    provenanceChain: provenance(draft.fixtureId, draft.source, draft.acquisitionTimestamp),
    supportLevel: draft.supportLevel,
    limitations: Object.freeze({
      categories: Object.freeze([...draft.limitations]),
      notes: Object.freeze(draft.limitations.map((category) => `Fixture limitation: ${category}.`)),
    }),
    conflictStatus: draft.conflictStatus,
    supersessionStatus: draft.supersessionStatus,
    lineage: Object.freeze([...(draft.lineage ?? [])]),
    inspectionStatus: draft.inspectionStatus,
    activation: {
      providerCalls: 0,
      networkAcquisition: false,
      persistenceWrites: false,
      productionReads: false,
      publicRouteIntegration: false,
      customerDataAccess: false,
      publicConclusionGenerated: false,
    },
  });
}

function source(
  sourceId: string,
  sourceName: string,
  sourceType: EvidenceDepthSourceType,
  sourceRights: EvidenceDepthRightsStatus,
  attributionRequired: boolean,
): EvidenceDepthSourceIdentity {
  return Object.freeze({
    sourceId,
    sourceName,
    sourceType,
    providerId: sourceType === "SYNTHETIC_FIXTURE" ? "synthetic-fixture-provider" : null,
    providerName: sourceType === "SYNTHETIC_FIXTURE" ? "Synthetic Fixture Provider" : null,
    originatingAuthority: sourceType === "MLS_DERIVED" ? "Existing governed REIE MLS/listing pipeline" : null,
    sourceRights,
    attributionRequired,
    permittedUses: Object.freeze([sourceRights]),
    prohibitedUses: Object.freeze([
      "valuation conclusions",
      "property-condition conclusions",
      "ranking or scoring",
      "forecasting",
      "investment recommendations",
      "personalized suitability determinations",
    ]),
  });
}

function provenance(fixtureId: string, sourceIdentity: EvidenceDepthSourceIdentity, timestamp: string | null) {
  return Object.freeze([
    {
      stepId: `${fixtureId}:publisher`,
      role: "PUBLISHER" as const,
      identity: sourceIdentity.sourceId,
      timestamp,
    },
    {
      stepId: `${fixtureId}:acquisition`,
      role: "ACQUISITION" as const,
      identity: "fixture-or-repository-local-reference",
      timestamp,
    },
    {
      stepId: `${fixtureId}:normalization`,
      role: "NORMALIZATION" as const,
      identity: "evidence-depth-foundation-normalizer-v1",
      timestamp: EVIDENCE_DEPTH_REFERENCE_DATE,
    },
    {
      stepId: `${fixtureId}:version`,
      role: "VERSION" as const,
      identity: "immutable-fixture-version-v1",
      timestamp: EVIDENCE_DEPTH_REFERENCE_DATE,
    },
    {
      stepId: `${fixtureId}:inspection`,
      role: "INSPECTION" as const,
      identity: "checkEvidenceDepthDataIntegrationFoundation",
      timestamp: EVIDENCE_DEPTH_REFERENCE_DATE,
    },
  ]);
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/evidence-depth/evidenceDepthFixtures.ts
