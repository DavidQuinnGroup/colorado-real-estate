import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

import {
  EVIDENCE_DEPTH_FIXTURES,
  EVIDENCE_DEPTH_REFERENCE_DATE,
} from "../lib/evidence-depth/evidenceDepthFixtures.js";
import {
  DEFAULT_EVIDENCE_DEPTH_FRESHNESS_POLICIES,
  EVIDENCE_DEPTH_FOUNDATION_STATUS,
  buildEvidencePostureSummary,
  evaluateEvidenceFreshness,
  inspectEvidenceDepthFoundation,
  normalizeSourceRights,
  type EvidenceDepthEvidenceItem,
  type EvidenceDepthPublicUseEligibility,
  type EvidenceDepthRightsStatus,
} from "../lib/evidence-depth/evidencePosture.js";
import { stableGisEvidenceFingerprint } from "../lib/geographic-intelligence/evidenceFingerprint.js";
import { SOURCE_RIGHTS_ACTIVATION_RECORDS } from "../lib/sourceRightsActivationReadiness.js";

function read(path: string) {
  return readFileSync(path, "utf8");
}

function assertIncludes(source: string, value: string, message: string) {
  assert(source.includes(value), message);
}

function assertNotIncludes(source: string, value: string, message: string) {
  assert(!source.includes(value), message);
}

function assertFileMissing(path: string) {
  assert(!existsSync(path), `${path} must remain absent.`);
}

function byFixture(fragment: string): EvidenceDepthEvidenceItem {
  const item = EVIDENCE_DEPTH_FIXTURES.find((fixture) => fixture.evidenceId.includes(fragment));
  assert(item, `Fixture containing ${fragment} must exist.`);
  return item;
}

const packageJson = JSON.parse(read("package.json")) as { scripts?: Record<string, string> };
const tsconfig = read("tsconfig.worker.json");
const postureSource = read("lib/evidence-depth/evidencePosture.ts");
const fixtureSource = read("lib/evidence-depth/evidenceDepthFixtures.ts");
const implementationDoc = read("docs/project-atlas/executive-library/REIE-EVIDENCE-DEPTH-AND-DATA-INTEGRATION-FOUNDATION-IMPLEMENTATION.md");
const chatStart = read("docs/CHAT_START.md");

assert.equal(
  packageJson.scripts?.["check:evidence-depth-data-integration-foundation"],
  "npm run worker:build && node dist/scripts/checkEvidenceDepthDataIntegrationFoundation.js",
  "package.json must expose Evidence Depth foundation validation.",
);
assertIncludes(
  tsconfig,
  "scripts/checkEvidenceDepthDataIntegrationFoundation.ts",
  "Worker config must compile Evidence Depth foundation validation.",
);
assertIncludes(tsconfig, "lib/evidence-depth/**/*.ts", "Worker config must compile Evidence Depth contracts.");

assertFileMissing("app/api/evidence-depth/route.ts");
assertFileMissing("app/evidence-depth/page.tsx");
assertFileMissing("prisma/migrations/evidence-depth");

assert.equal(EVIDENCE_DEPTH_FOUNDATION_STATUS, "EVIDENCE_DEPTH_AND_DATA_INTEGRATION_FOUNDATION_CERTIFIED");
assert(EVIDENCE_DEPTH_FIXTURES.length >= 10, "Evidence Depth fixtures must cover at least ten representative cases.");

const fixtureIds = EVIDENCE_DEPTH_FIXTURES.map((fixture) => fixture.evidenceId);
assert.equal(new Set(fixtureIds).size, fixtureIds.length, "Evidence identities must be unique.");
const versionIds = EVIDENCE_DEPTH_FIXTURES.map((fixture) => fixture.evidenceVersionId);
assert.equal(new Set(versionIds).size, versionIds.length, "Evidence version identities must be unique.");

for (const item of EVIDENCE_DEPTH_FIXTURES) {
  assert(item.evidenceId.startsWith("edfi_"), `${item.evidenceId} must use deterministic Evidence Depth identity prefix.`);
  assert(item.evidenceVersionId.startsWith("edfv_"), `${item.evidenceVersionId} must use deterministic Evidence Depth version prefix.`);
  assert(item.evidenceFamilyId.startsWith("edfi_"), `${item.evidenceFamilyId} must use deterministic family identity prefix.`);
  assert.equal(item.activation.providerCalls, 0, `${item.evidenceId} must not call providers.`);
  assert.equal(item.activation.networkAcquisition, false, `${item.evidenceId} must not acquire network data.`);
  assert.equal(item.activation.persistenceWrites, false, `${item.evidenceId} must not write persistence.`);
  assert.equal(item.activation.productionReads, false, `${item.evidenceId} must not read production data.`);
  assert.equal(item.activation.publicRouteIntegration, false, `${item.evidenceId} must not integrate with public routes.`);
  assert.equal(item.activation.customerDataAccess, false, `${item.evidenceId} must not access customer data.`);
  assert.equal(item.activation.publicConclusionGenerated, false, `${item.evidenceId} must not generate conclusions.`);
  assert.notEqual(item.source.sourceId, item.source.providerId, `${item.evidenceId} must keep source and provider identities distinct.`);
  assert(item.provenanceChain.length >= 5, `${item.evidenceId} must preserve provenance chain.`);
  assert(item.immutableContentFingerprint.length === 64, `${item.evidenceId} must have sha256 evidence fingerprint.`);
  const repeatFingerprint = stableGisEvidenceFingerprint({
    evidenceFamilyId: item.evidenceFamilyId,
    evidenceId: item.evidenceId,
    evidenceVersion: item.evidenceVersion,
    evidenceVersionId: item.evidenceVersionId,
    assertionId: item.assertionId,
    subject: item.subject,
    domain: item.domain,
    source: item.source,
    observedOrEffectiveDate: item.observedOrEffectiveDate,
    supportLevel: item.supportLevel,
    limitations: item.limitations,
    conflictStatus: item.conflictStatus,
    supersessionStatus: item.supersessionStatus,
    lineage: item.lineage,
  });
  assert.equal(item.immutableContentFingerprint, repeatFingerprint, `${item.evidenceId} fingerprint must be deterministic.`);
  assert(!["best", "superior", "guaranteed", "definitive"].includes(item.supportLevel.toLowerCase()), `${item.evidenceId} support level must be categorical and non-ranking.`);
}

const expectedEligibility = new Map<string, EvidenceDepthPublicUseEligibility>([
  ["public_use_complete_provenance", "ELIGIBLE"],
  ["attribution_required_evidence", "ELIGIBLE_WITH_LIMITATIONS"],
  ["internal_only_evidence", "INTERNAL_ONLY"],
  ["unknown_rights_evidence", "UNRESOLVED"],
  ["stale_evidence", "ELIGIBLE_WITH_LIMITATIONS"],
  ["undated_evidence", "ELIGIBLE_WITH_LIMITATIONS"],
  ["conflicting_evidence_a", "ELIGIBLE_WITH_LIMITATIONS"],
  ["conflicting_evidence_b", "ELIGIBLE_WITH_LIMITATIONS"],
  ["superseded_evidence", "BLOCKED"],
  ["eligible_with_limitations", "ELIGIBLE_WITH_LIMITATIONS"],
  ["blocked_evidence", "BLOCKED"],
]);

for (const [fragment, eligibility] of expectedEligibility) {
  assert.equal(byFixture(fragment).publicUseEligibility, eligibility, `${fragment} eligibility must be ${eligibility}.`);
}

const unknownRights = byFixture("unknown_rights");
assert.equal(unknownRights.source.sourceRights, "UNKNOWN_OR_UNRESOLVED");
assert.notEqual(unknownRights.publicUseEligibility, "ELIGIBLE", "Unknown rights must fail closed for public use.");

const restricted = byFixture("blocked_evidence");
assert.equal(restricted.source.sourceRights, "RESTRICTED");
assert.equal(restricted.publicUseEligibility, "BLOCKED", "Restricted evidence must be blocked from public use.");

const attribution = byFixture("attribution_required");
assert.equal(attribution.source.attributionRequired, true, "Attribution-required evidence must preserve attribution flag.");
assert(attribution.limitations.categories.includes("ATTRIBUTION_REQUIRED"), "Attribution limitation must be present.");

assert.equal(evaluateEvidenceFreshness("MARKET_INTELLIGENCE", "2025-01-01T00:00:00.000Z", EVIDENCE_DEPTH_REFERENCE_DATE), "STALE");
assert.equal(evaluateEvidenceFreshness("DECISION_GUIDE", null, EVIDENCE_DEPTH_REFERENCE_DATE), "UNDATED");
assert(
  DEFAULT_EVIDENCE_DEPTH_FRESHNESS_POLICIES.some((policy) => policy.domain === "MARKET_INTELLIGENCE" && policy.currentWithinDays !== policy.staleAfterDays),
  "Freshness policy must be domain-aware and not a single universal threshold.",
);

const conflicts = EVIDENCE_DEPTH_FIXTURES.filter((fixture) => fixture.conflictStatus === "UNRESOLVED_CONFLICT" || fixture.conflictStatus === "MATERIAL_CONFLICT");
assert(conflicts.length >= 2, "Conflicts must be preserved with at least two evidence identities.");
assert(conflicts.every((fixture) => fixture.lineage.some((entry) => entry.relationship === "CONFLICTS_WITH")), "Conflicting evidence must preserve conflict lineage.");
assert(conflicts.every((fixture) => fixture.publicUseEligibility !== "ELIGIBLE"), "Conflicting evidence cannot become fully eligible without limitations.");

const superseded = byFixture("superseded");
assert.equal(superseded.supersessionStatus, "SUPERSEDED_BY_NEWER");
assert(superseded.lineage.some((entry) => entry.relationship === "SUPERSEDED_BY"), "Superseded fixture must preserve lineage.");
assert.equal(superseded.publicUseEligibility, "BLOCKED", "Superseded evidence must not support current public presentation.");

const normalizedRights = new Map<string, EvidenceDepthRightsStatus>(
  SOURCE_RIGHTS_ACTIVATION_RECORDS.map((record) => [record.sourceId, normalizeSourceRights(record)]),
);
assert.equal(normalizedRights.get("SRA-MLS-DERIVED-CITY-INTELLIGENCE"), "PUBLIC_DISPLAY_PERMITTED_WITH_ATTRIBUTION");
assert.notEqual(normalizedRights.get("SRA-BOULDER-COUNTY-ASSESSOR"), "PUBLIC_DISPLAY_PERMITTED");
assert.notEqual(normalizedRights.get("SRA-BOULDER-COUNTY-RECORDER"), "PUBLIC_DISPLAY_PERMITTED");
assert.notEqual(normalizedRights.get("SRA-BOULDER-COUNTY-ACCELA"), "PUBLIC_DISPLAY_PERMITTED");

const summary = buildEvidencePostureSummary(EVIDENCE_DEPTH_FIXTURES);
const inspection = inspectEvidenceDepthFoundation(EVIDENCE_DEPTH_FIXTURES);
assert.equal(inspection.status, EVIDENCE_DEPTH_FOUNDATION_STATUS);
assert.equal(summary.evidenceItemCount, EVIDENCE_DEPTH_FIXTURES.length);
assert.equal(summary.generatedConclusion, false, "Summary must not generate real-estate conclusions.");
assert.equal(summary.compositeScore, null, "Summary must not produce a composite evidence score.");
assert(summary.hasPublicUseBlockedEvidence, "Summary must report blocked/internal-only evidence.");
assert(summary.hasUnresolvedRights, "Summary must report unresolved rights.");
assert(summary.hasUnresolvedConflicts, "Summary must report unresolved conflicts.");
assert(summary.materialLimitations.includes("UNCERTAIN_RIGHTS"), "Summary must preserve uncertain-rights limitations.");
assert(summary.materialLimitations.includes("PROFESSIONAL_VERIFICATION_REQUIRED"), "Summary must preserve professional-verification limitations.");

for (const source of [postureSource, fixtureSource]) {
  for (const prohibited of [
    "fetch(",
    "XMLHttpRequest",
    "PrismaClient",
    "prisma.",
    "DATABASE_URL",
    "process.env",
    "INSERT INTO",
    "UPDATE ",
    "DELETE FROM",
    "sendEmail",
    "queue.add",
    "localStorage",
    "document.cookie",
    "navigator.sendBeacon",
  ]) {
    assertNotIncludes(source, prohibited, `Evidence Depth foundation must not include protected behavior: ${prohibited}`);
  }
}

for (const prohibitedConclusion of [
  "valuation conclusion",
  "property-condition conclusion",
  "neighborhood recommendation",
  "investment advice",
  "suitability result",
  "market score",
  "quality ranking",
]) {
  assertIncludes(
    implementationDoc,
    prohibitedConclusion,
    `Implementation governance must explicitly prohibit ${prohibitedConclusion}.`,
  );
}

assertIncludes(implementationDoc, "no provider activation", "Implementation record must preserve no-provider boundary.");
assertIncludes(implementationDoc, "no public-record retrieval", "Implementation record must preserve no-public-record boundary.");
assertIncludes(implementationDoc, "no production writes", "Implementation record must preserve no-production-write boundary.");
assertIncludes(chatStart, "Evidence Depth and Data Integration", "CHAT_START must record Evidence Depth foundation handoff.");

console.log(
  `[evidence-depth-data-integration-foundation] ok: ${EVIDENCE_DEPTH_FIXTURES.length} fixtures, deterministic identities, fail-closed rights, domain-aware freshness, preserved conflicts, supersession lineage, public-use eligibility, no scoring, no conclusions, and no protected activation verified.`,
);
