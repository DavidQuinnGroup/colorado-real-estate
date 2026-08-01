import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

import {
  ADVISORY_EVIDENCE_PREPARATION_FIXTURES,
  ADVISORY_EVIDENCE_PREPARATION_MIXED_FIXTURE_SET,
} from "../lib/evidence-depth/advisoryEvidencePreparationFixtures.js";
import {
  ADVISORY_EVIDENCE_PREPARATION_TARGET,
  CONTROLLED_EVIDENCE_DEPTH_INTEGRATION_STATUS,
  buildAdvisoryEvidencePreparation,
  inspectAdvisoryEvidencePreparation,
  type AdvisoryEvidenceQuestionCategory,
} from "../lib/evidence-depth/advisoryEvidencePreparation.js";
import {
  EVIDENCE_DEPTH_FOUNDATION_STATUS,
  inspectEvidenceDepthFoundation,
  type EvidenceDepthEvidenceItem,
} from "../lib/evidence-depth/evidencePosture.js";

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
  const fixture = ADVISORY_EVIDENCE_PREPARATION_FIXTURES.find((item) => item.evidenceId.includes(fragment));
  assert(fixture, `Fixture containing ${fragment} must exist.`);
  return fixture;
}

function hasCategory(fragment: string, category: AdvisoryEvidenceQuestionCategory) {
  const summary = buildAdvisoryEvidencePreparation([byFixture(fragment)]);
  return summary.prompts.some((prompt) => prompt.category === category);
}

const packageJson = JSON.parse(read("package.json")) as { scripts?: Record<string, string> };
const tsconfig = read("tsconfig.worker.json");
const integrationSource = read("lib/evidence-depth/advisoryEvidencePreparation.ts");
const integrationFixtures = read("lib/evidence-depth/advisoryEvidencePreparationFixtures.ts");
const evidencePosture = read("lib/evidence-depth/evidencePosture.ts");
const evidenceFoundationCheck = read("scripts/checkEvidenceDepthDataIntegrationFoundation.ts");
const sourceRightsCheck = read("scripts/checkSourceRightsActivationReadiness.ts");
const advisoryHandoffCheck = read("scripts/checkAdvisoryHandoffReadiness.ts");
const advisoryGuide = read("components/AdvisoryHandoffGuide.tsx");
const contactPage = read("app/contact/page.tsx");
const buyerReadinessGuide = read("components/BuyerFinancingReadinessGuide.tsx");
const sellerReadinessGuide = read("components/SellerReadinessGuide.tsx");
const implementationDoc = read("docs/project-atlas/executive-library/REIE-CONTROLLED-EVIDENCE-DEPTH-INTEGRATION-IMPLEMENTATION.md");
const chatStart = read("docs/CHAT_START.md");

assert.equal(
  packageJson.scripts?.["check:controlled-evidence-depth-integration"],
  "npm run worker:build && node dist/scripts/checkControlledEvidenceDepthIntegration.js",
  "package.json must expose Controlled Evidence Depth Integration validation.",
);
assertIncludes(tsconfig, "scripts/checkControlledEvidenceDepthIntegration.ts", "Worker build must include controlled integration validation.");
assertIncludes(tsconfig, "lib/evidence-depth/**/*.ts", "Worker build must include Evidence Depth contracts.");

assertIncludes(integrationSource, "from \"./evidencePosture.js\"", "Integration must reuse certified Evidence Depth contracts.");
assertNotIncludes(integrationSource, "export type EvidenceDepthRightsStatus", "Integration must not duplicate source-rights architecture.");
assertNotIncludes(integrationSource, "export type EvidenceDepthFreshnessStatus", "Integration must not duplicate freshness architecture.");
assert.equal(EVIDENCE_DEPTH_FOUNDATION_STATUS, "EVIDENCE_DEPTH_AND_DATA_INTEGRATION_FOUNDATION_CERTIFIED");

for (const path of [
  "app/controlled-evidence-depth-integration/page.tsx",
  "app/evidence-depth-integration/page.tsx",
  "app/advisory-evidence-preparation/page.tsx",
  "app/api/controlled-evidence-depth-integration/route.ts",
  "app/api/advisory-evidence-preparation/route.ts",
  "app/api/evidence-depth/route.ts",
  "prisma/migrations/controlled-evidence-depth-integration",
]) {
  assertFileMissing(path);
}

for (const publicSource of [contactPage, advisoryGuide, buyerReadinessGuide, sellerReadinessGuide]) {
  assertNotIncludes(publicSource, "advisoryEvidencePreparation", "Public pages and readiness guides must not import internal advisory evidence preparation.");
  assertNotIncludes(publicSource, "ADVISORY_PREPARATION_INTERNAL_EVIDENCE_POSTURE", "Public pages must not expose internal integration target.");
  assertNotIncludes(publicSource, "EvidenceDepth", "Public pages must not expose internal Evidence Depth metadata.");
  assertNotIncludes(publicSource, "PUBLIC_DISPLAY_PERMITTED", "Public pages must not expose source-rights enum values.");
  assertNotIncludes(publicSource, "AUTHORITATIVE", "Public pages must not expose support-level labels.");
  assertNotIncludes(publicSource, "UNRESOLVED_CONFLICT", "Public pages must not expose conflict-state codes.");
}

assert(ADVISORY_EVIDENCE_PREPARATION_FIXTURES.length >= 11, "Integration fixtures must cover certified Evidence Depth fixture cases.");
assert.equal(ADVISORY_EVIDENCE_PREPARATION_MIXED_FIXTURE_SET.length, 11, "Mixed fixture set must cover all representative integration cases.");

const foundationInspection = inspectEvidenceDepthFoundation(ADVISORY_EVIDENCE_PREPARATION_FIXTURES);
assert.equal(foundationInspection.status, EVIDENCE_DEPTH_FOUNDATION_STATUS, "Certified Evidence Depth foundation must remain inspectable.");

const inspection = inspectAdvisoryEvidencePreparation(ADVISORY_EVIDENCE_PREPARATION_MIXED_FIXTURE_SET);
const summary = inspection.summary;
assert.equal(inspection.target, ADVISORY_EVIDENCE_PREPARATION_TARGET);
assert.equal(summary.status, CONTROLLED_EVIDENCE_DEPTH_INTEGRATION_STATUS);
assert.equal(summary.target, "ADVISORY_PREPARATION_INTERNAL_EVIDENCE_POSTURE");
assert.equal(summary.evidenceItemsReviewed, ADVISORY_EVIDENCE_PREPARATION_MIXED_FIXTURE_SET.length);
assert.equal(summary.generatedCustomerRecommendation, false, "Integration must not generate customer recommendations.");
assert.equal(summary.substantiveRealEstateConclusion, null, "Integration must not generate substantive real-estate conclusions.");
assert.equal(summary.compositeEvidenceScore, null, "Integration must not generate an evidence score.");
assert.equal(summary.leadScore, null, "Integration must not generate a lead score.");

assert.equal(summary.activation.providerCalls, 0, "Integration must not call providers.");
assert.equal(summary.activation.networkAcquisition, false, "Integration must not acquire network data.");
assert.equal(summary.activation.persistenceReads, false, "Integration must not read persistence.");
assert.equal(summary.activation.persistenceWrites, false, "Integration must not write persistence.");
assert.equal(summary.activation.productionReads, false, "Integration must not read production data.");
assert.equal(summary.activation.publicRouteIntegration, false, "Integration must not integrate public routes.");
assert.equal(summary.activation.publicApiCreated, false, "Integration must not create APIs.");
assert.equal(summary.activation.contactSubmissionChanges, false, "Integration must not alter Contact submission behavior.");
assert.equal(summary.activation.customerDataAccess, false, "Integration must not access customer data.");
assert.equal(summary.activation.crmTasks, false, "Integration must not create CRM tasks.");
assert.equal(summary.activation.leadScoring, false, "Integration must not score leads.");
assert.equal(summary.activation.leadRouting, false, "Integration must not route leads.");
assert.equal(summary.activation.tracking, false, "Integration must not track behavior.");
assert.equal(summary.activation.telemetry, false, "Integration must not emit telemetry.");
assert.equal(summary.activation.personalization, false, "Integration must not personalize output.");
assert.equal(summary.activation.publicConclusionGenerated, false, "Integration must not generate public conclusions.");

assert(hasCategory("public_use_complete_provenance", "SOURCE_AND_RIGHTS"), "Eligible current evidence must retain source and provenance preparation.");
assert(hasCategory("attribution_required_evidence", "ATTRIBUTION"), "Attribution-required evidence must create attribution guidance.");
assert(hasCategory("internal_only_evidence", "INTERNAL_ONLY_EVIDENCE"), "Internal-only evidence must create no-public-use guidance.");
assert(hasCategory("unknown_rights_evidence", "SOURCE_AND_RIGHTS"), "Unknown-rights evidence must create rights guidance.");
assert(hasCategory("blocked_evidence", "BLOCKED_EVIDENCE"), "Restricted evidence must remain blocked.");
assert(hasCategory("stale_evidence", "FRESHNESS"), "Stale evidence must create freshness questions.");
assert(hasCategory("undated_evidence", "TEMPORAL_SCOPE"), "Undated evidence must create temporal verification questions.");
assert(hasCategory("conflicting_evidence_a", "CONFLICTING_EVIDENCE"), "Conflicting evidence A must preserve conflict guidance.");
assert(hasCategory("conflicting_evidence_b", "CONFLICTING_EVIDENCE"), "Conflicting evidence B must preserve conflict guidance.");
assert(hasCategory("eligible_with_limitations", "CITYWIDE_VS_PROPERTY_SPECIFIC"), "Citywide evidence must create property-specific limitation prompts.");
assert(hasCategory("eligible_with_limitations", "UNRESOLVED_EVIDENCE"), "Eligible-with-limitations evidence must preserve limitations.");
assert(hasCategory("superseded_evidence", "PROVENANCE"), "Superseded evidence must preserve historical context.");

const unknown = buildAdvisoryEvidencePreparation([byFixture("unknown_rights")]);
assert(unknown.prompts.some((prompt) => prompt.publicUseWarning && prompt.blockedUse), "Unknown rights must fail closed through blocked or unresolved guidance.");

const restricted = buildAdvisoryEvidencePreparation([byFixture("blocked_evidence")]);
assert(restricted.prompts.some((prompt) => prompt.blockedUse && prompt.category === "BLOCKED_EVIDENCE"), "Restricted evidence must not create public-use guidance.");

const attribution = buildAdvisoryEvidencePreparation([byFixture("attribution_required")]);
assert(attribution.prompts.some((prompt) => prompt.promptType === "ATTRIBUTION_REMINDER"), "Attribution requirements must be preserved.");

const stale = buildAdvisoryEvidencePreparation([byFixture("stale_evidence")]);
assert(stale.prompts.some((prompt) => prompt.promptType === "FRESHNESS_REVIEW_NOTICE"), "Stale evidence must create prompts, not conclusions.");

const undated = buildAdvisoryEvidencePreparation([byFixture("undated_evidence")]);
assert(undated.prompts.some((prompt) => prompt.prompt.includes("Do not treat undated support as current")), "Undated evidence must not appear current.");

const conflicts = buildAdvisoryEvidencePreparation([byFixture("conflicting_evidence_a"), byFixture("conflicting_evidence_b")]);
assert.equal(conflicts.unresolvedConflictCount, 2, "Conflicts must be preserved.");
assert(conflicts.prompts.some((prompt) => prompt.prompt.includes("avoid selecting a winner")), "Conflicts must not select a winner.");

assert(summary.supportLevelDistribution.AUTHORITATIVE >= 0, "Support levels must remain categorical.");
assert(summary.prompts.some((prompt) => prompt.prompt.includes("does not convert support into certainty") || prompt.prompt.includes("even when the evidence relationship is direct or authoritative")), "Support levels must not create certainty.");
assert(summary.questionCategories.includes("PROFESSIONAL_VERIFICATION"), "Professional-review categories must remain bounded.");
assert(summary.questionCategories.includes("INTERNAL_ONLY_EVIDENCE"), "Internal-only evidence must remain internal.");
assert(summary.blockedUseCount >= 3, "Summary must transparently report blocked or internal-only use prompts.");

for (const source of [integrationSource, integrationFixtures]) {
  for (const prohibited of [
    "fetch(",
    "XMLHttpRequest",
    "PrismaClient",
    "DATABASE_URL",
    "process.env",
    "localStorage",
    "sessionStorage",
    "document.cookie",
    "navigator.sendBeacon",
    "<form",
    "type=\"hidden\"",
    "sendEmail",
  ]) {
    assertNotIncludes(source, prohibited, `Internal integration must remain provider-free, non-persistent, and non-automated: ${prohibited}`);
  }
}

for (const required of [
  "ADVISORY_PREPARATION_INTERNAL_EVIDENCE_POSTURE",
  "internal",
  "fixture-backed",
  "read-only",
  "non-public",
  "non-mutating",
  "conclusion-free",
  "no Contact UI",
  "no public API",
  "no CRM",
  "no tracking",
  "no customer data",
  "no provider activation",
]) {
  assertIncludes(implementationDoc, required, `Implementation governance record must include: ${required}`);
}

assertIncludes(chatStart, "CONTROLLED_EVIDENCE_DEPTH_INTEGRATION", "CHAT_START must reconcile active controlled integration status.");
assertIncludes(evidenceFoundationCheck, "providerCalls, 0", "Evidence Depth foundation validation must remain provider-free.");
assertIncludes(sourceRightsCheck, "unresolvedLanguage", "Source-rights readiness validation must preserve unresolved-rights review.");
assertIncludes(sourceRightsCheck, "must not receive final approval unless already governed", "Source-rights readiness validation must remain fail-closed.");
assertIncludes(advisoryHandoffCheck, "data-advisory-handoff-evidence-metadata-exposure=\"false\"", "Advisory Handoff validation must preserve Evidence Depth non-exposure.");

console.log("Controlled Evidence Depth Integration certification passed.");
console.log(JSON.stringify({
  target: summary.target,
  status: summary.status,
  evidenceItemsReviewed: summary.evidenceItemsReviewed,
  prompts: summary.prompts.length,
  questionCategories: summary.questionCategories,
  blockedUseCount: summary.blockedUseCount,
  generatedCustomerRecommendation: summary.generatedCustomerRecommendation,
  substantiveRealEstateConclusion: summary.substantiveRealEstateConclusion,
  compositeEvidenceScore: summary.compositeEvidenceScore,
}, null, 2));
