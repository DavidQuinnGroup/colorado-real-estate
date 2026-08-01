import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

import { ADVISORY_OPERATING_READINESS_FIXTURES } from "../lib/advisory-operating/advisoryOperatingReadinessFixtures.js";
import {
  ADVISORY_OPERATING_READINESS_STANDARD,
  ADVISORY_OPERATING_READINESS_STATUS,
  ADVISORY_CONSISTENCY_REQUIREMENTS,
  inspectAdvisoryOperatingReadiness,
  type AdvisoryOpenQuestionCategory,
  type AdvisoryOperatingStage,
  type AdvisoryProfessionalEscalationCategory,
  type ReieSurfaceCategory,
} from "../lib/advisory-operating/advisoryOperatingReadiness.js";

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

const packageJson = JSON.parse(read("package.json")) as { scripts?: Record<string, string> };
const tsconfig = read("tsconfig.worker.json");
const operatingSource = read("lib/advisory-operating/advisoryOperatingReadiness.ts");
const operatingFixtures = read("lib/advisory-operating/advisoryOperatingReadinessFixtures.ts");
const controlledIntegrationSource = read("lib/evidence-depth/advisoryEvidencePreparation.ts");
const controlledIntegrationCheck = read("scripts/checkControlledEvidenceDepthIntegration.ts");
const advisoryHandoffCheck = read("scripts/checkAdvisoryHandoffReadiness.ts");
const buyerReadinessCheck = read("scripts/checkBuyerFinancingReadinessAdvancement.ts");
const sellerReadinessCheck = read("scripts/checkSellerReadinessAdvancement.ts");
const contactPage = read("app/contact/page.tsx");
const advisoryGuide = read("components/AdvisoryHandoffGuide.tsx");
const buyerReadinessGuide = read("components/BuyerFinancingReadinessGuide.tsx");
const sellerReadinessGuide = read("components/SellerReadinessGuide.tsx");
const implementationDoc = read("docs/project-atlas/executive-library/REIE-ADVISORY-OPERATING-READINESS-IMPLEMENTATION.md");
const chatStart = read("docs/CHAT_START.md");

assert.equal(
  packageJson.scripts?.["check:advisory-operating-readiness"],
  "npm run worker:build && node dist/scripts/checkAdvisoryOperatingReadiness.js",
  "package.json must expose Advisory Operating Readiness validation.",
);
assertIncludes(tsconfig, "scripts/checkAdvisoryOperatingReadiness.ts", "Worker build must include Advisory Operating validation.");
assertIncludes(tsconfig, "lib/advisory-operating/**/*.ts", "Worker build must include Advisory Operating contracts.");

assertIncludes(operatingSource, "from \"../evidence-depth/advisoryEvidencePreparation.js\"", "Operating standard must reuse Controlled Evidence Integration.");
assertIncludes(operatingSource, "buildAdvisoryEvidencePreparation", "Operating builder must derive evidence prompts from certified integration.");
assertNotIncludes(operatingSource, "export type EvidenceDepthRightsStatus", "Operating standard must not duplicate Evidence Depth source-rights architecture.");
assertNotIncludes(operatingSource, "export type EvidenceDepthFreshnessStatus", "Operating standard must not duplicate Evidence Depth freshness architecture.");
assertNotIncludes(operatingSource, "export const ADVISORY_EVIDENCE_PREPARATION_TARGET", "Operating standard must not duplicate Controlled Evidence target.");
assertIncludes(controlledIntegrationSource, "ADVISORY_PREPARATION_INTERNAL_EVIDENCE_POSTURE", "Certified controlled integration must remain present.");
assertIncludes(controlledIntegrationCheck, "Public pages and readiness guides must not import internal advisory evidence preparation.", "Controlled integration check must remain public non-exposure oriented.");

for (const path of [
  "app/advisory-operating-readiness/page.tsx",
  "app/advisory-operating/page.tsx",
  "app/api/advisory-operating-readiness/route.ts",
  "app/api/advisory-operating/route.ts",
  "components/AdvisoryOperatingReadiness.tsx",
  "prisma/migrations/advisory-operating-readiness",
]) {
  assertFileMissing(path);
}

for (const publicSource of [contactPage, advisoryGuide, buyerReadinessGuide, sellerReadinessGuide]) {
  assertNotIncludes(publicSource, "advisoryOperatingReadiness", "Public surfaces must not import Advisory Operating Readiness.");
  assertNotIncludes(publicSource, "ADVISORY_OPERATING_READINESS_STANDARD", "Public surfaces must not expose internal operating standard.");
  assertNotIncludes(publicSource, "AdvisoryOperating", "Public surfaces must not expose internal operating contracts.");
}

const inspection = inspectAdvisoryOperatingReadiness(ADVISORY_OPERATING_READINESS_FIXTURES);

assert.equal(inspection.standard, ADVISORY_OPERATING_READINESS_STANDARD, "One authoritative internal operating standard must exist.");
assert.equal(inspection.standard, "ADVISORY_OPERATING_READINESS_STANDARD");
assert.equal(inspection.status, ADVISORY_OPERATING_READINESS_STATUS);
assert.equal(inspection.fixtureCount, 12, "Twelve certified fixtures must cover required cases.");
assert.equal(inspection.prohibitedOutputAssertions.recommendations, false, "No recommendations may be generated.");
assert.equal(inspection.prohibitedOutputAssertions.leadScores, false, "No lead scores may be generated.");
assert.equal(inspection.prohibitedOutputAssertions.urgency, false, "No urgency may be generated.");
assert.equal(inspection.prohibitedOutputAssertions.salesScripts, false, "No sales scripts may be generated.");
assert.equal(inspection.prohibitedOutputAssertions.personalizedActionPlans, false, "No personalized action plans may be generated.");

const requiredStages: readonly AdvisoryOperatingStage[] = [
  "ORIENT",
  "REVIEW_REIE_CONTEXT",
  "IDENTIFY_OPEN_QUESTIONS",
  "REVIEW_EVIDENCE_POSTURE",
  "APPLY_PROFESSIONAL_BOUNDARIES",
  "PREPARE_CONVERSATION",
  "SEQUENCE_NEXT_STEPS",
  "RECORD_NO_CUSTOMER_DATA",
];
for (const stage of requiredStages) {
  assert(inspection.operatingStagesCovered.includes(stage), `Operating stage must be covered: ${stage}`);
}

const requiredSurfaces: readonly ReieSurfaceCategory[] = [
  "CROSS_CITY_COMPARISON",
  "CITY_OR_DECISION_GUIDE_CONTEXT",
  "SEARCH",
  "BUYER_GUIDANCE",
  "BUYER_FINANCING_READINESS",
  "SELLER_GUIDANCE",
  "SELLER_READINESS",
  "MARKET_CONTEXT",
  "PROPERTY_CONTEXT",
  "GRAND_PLAN",
  "ADVISORY_HANDOFF",
];
for (const surface of requiredSurfaces) {
  assert(inspection.reieSurfacesCovered.includes(surface), `REIE surface must be represented: ${surface}`);
}

const requiredQuestions: readonly AdvisoryOpenQuestionCategory[] = [
  "GOALS_AND_DECISION_CONTEXT",
  "MARKET_AND_GEOGRAPHIC_CONTEXT",
  "PROPERTY_SPECIFIC_REVIEW",
  "FINANCING",
  "SELLER_PREPARATION",
  "TIMING_AND_SEQUENCING",
  "EVIDENCE_LIMITATIONS",
  "SOURCE_AND_RIGHTS",
  "PROFESSIONAL_VERIFICATION",
  "NEXT_ACTIONS",
];
for (const category of requiredQuestions) {
  assert(inspection.openQuestionCategoriesCovered.includes(category), `Question category must be covered: ${category}`);
}

const requiredProfessionalCategories: readonly AdvisoryProfessionalEscalationCategory[] = [
  "LENDING",
  "LEGAL",
  "TAX",
  "APPRAISAL",
  "INSPECTION",
  "ENGINEERING",
  "INSURANCE",
  "TITLE",
  "ENVIRONMENTAL",
  "MUNICIPAL",
  "PROPERTY_CONDITION_SPECIALIST",
  "EVIDENCE_RIGHTS_REVIEW",
];
for (const category of requiredProfessionalCategories) {
  assert(inspection.professionalReviewCategoriesCovered.includes(category), `Professional category must be covered: ${category}`);
}

assert(inspection.evidenceBoundaryPromptCount >= 20, "Evidence limitation prompts must be represented.");
assert(inspection.blockedUseWarningCount >= 3, "Blocked or internal-only evidence must remain bounded.");
assert(inspection.attributionReminderCount >= 1, "Attribution reminders must be preserved.");
assert(inspection.unresolvedConflictNoticeCount >= 2, "Conflicting evidence must preserve unresolved conflict notices.");
assert(ADVISORY_CONSISTENCY_REQUIREMENTS.includes("AVOID_STEERING_OR_CODED_PREFERENCE_LANGUAGE"), "Fair-housing consistency requirement must be present.");

for (const preparation of inspection.preparations) {
  assert.equal(preparation.standard, ADVISORY_OPERATING_READINESS_STANDARD);
  assert.equal(preparation.evidencePreparationTarget, "ADVISORY_PREPARATION_INTERNAL_EVIDENCE_POSTURE");
  assert.equal(preparation.activation.publicUiChanged, false);
  assert.equal(preparation.activation.publicRouteCreated, false);
  assert.equal(preparation.activation.publicApiCreated, false);
  assert.equal(preparation.activation.contactFieldsChanged, false);
  assert.equal(preparation.activation.contactSubmissionChanged, false);
  assert.equal(preparation.activation.customerContextTransfer, false);
  assert.equal(preparation.activation.customerDataAccepted, false);
  assert.equal(preparation.activation.customerRecordCreated, false);
  assert.equal(preparation.activation.advisorDashboardCreated, false);
  assert.equal(preparation.activation.advisorAccountCreated, false);
  assert.equal(preparation.activation.crmTasks, false);
  assert.equal(preparation.activation.leadScoring, false);
  assert.equal(preparation.activation.leadRouting, false);
  assert.equal(preparation.activation.tracking, false);
  assert.equal(preparation.activation.telemetry, false);
  assert.equal(preparation.activation.profiling, false);
  assert.equal(preparation.activation.personalization, false);
  assert.equal(preparation.activation.persistenceReads, false);
  assert.equal(preparation.activation.persistenceWrites, false);
  assert.equal(preparation.activation.providerCalls, 0);
  assert.equal(preparation.activation.networkAcquisition, false);
  assert.equal(preparation.activation.queueJobs, false);
  assert.equal(preparation.activation.workers, false);
  assert.equal(preparation.activation.email, false);
  assert.equal(preparation.activation.publicEvidenceLabels, false);
  assert.equal(preparation.customerRecommendation, null);
  assert.equal(preparation.transactionRecommendation, null);
  assert.equal(preparation.cityOrPropertyRecommendation, null);
  assert.equal(preparation.leadScore, null);
  assert.equal(preparation.urgency, null);
  assert.equal(preparation.conversionProbability, null);
  assert.equal(preparation.salesScript, null);
  assert.equal(preparation.personalizedActionPlan, null);
  assert.equal(preparation.valuation, null);
  assert.equal(preparation.pricing, null);
  assert.equal(preparation.affordability, null);
  assert.equal(preparation.qualification, null);
  assert.equal(preparation.forecast, null);
  assert.equal(preparation.suitability, null);
  assert.equal(preparation.propertyConditionConclusion, null);
  assert.equal(preparation.investmentAdvice, null);
  assert(preparation.boundaryReminders.includes("EVIDENCE_POSTURE_IS_NOT_CERTAINTY"), "Evidence posture must not become certainty.");
  assert(preparation.boundaryReminders.includes("ADVISORY_DOES_NOT_REPLACE_PROFESSIONAL_REVIEW"), "Advisory boundaries must remain intact.");
  assert(preparation.boundaryReminders.includes("NO_CUSTOMER_PROFILING"), "Customer profiling must remain prohibited.");
}

for (const source of [operatingSource, operatingFixtures]) {
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
    "createTask",
    "calculateLead",
    "scoreLead",
  ]) {
    assertNotIncludes(source, prohibited, `Advisory Operating Readiness must remain internal and non-automated: ${prohibited}`);
  }
}

for (const required of [
  "ADVISORY_OPERATING_READINESS_STANDARD",
  "internal",
  "non-customer-specific",
  "fixture-backed",
  "deterministic",
  "read-only",
  "non-public",
  "non-persistent",
  "conclusion-free",
  "no CRM",
  "no tracking",
  "no customer data",
  "no advisor dashboard",
  "no provider activation",
]) {
  assertIncludes(implementationDoc, required, `Implementation governance record must include: ${required}`);
}

assertIncludes(chatStart, "PRIORITIZE_ADVISORY_OPERATING_READINESS", "CHAT_START must preserve strategic priority.");
assertIncludes(chatStart, "ADVISORY_OPERATING_READINESS_READY_FOR_PUSH", "CHAT_START must record local readiness handoff after implementation.");
assertIncludes(advisoryHandoffCheck, "no hidden context transfer", "Advisory Handoff validation must preserve Contact boundary.");
assertIncludes(buyerReadinessCheck, "/contact#advisory-readiness", "Buyer readiness advisory exit must remain certified.");
assertIncludes(sellerReadinessCheck, "/contact#advisory-readiness", "Seller readiness advisory exit must remain certified.");

console.log("Advisory Operating Readiness validation passed.");
console.log(JSON.stringify({
  standard: inspection.standard,
  status: inspection.status,
  fixtureCount: inspection.fixtureCount,
  operatingStagesCovered: inspection.operatingStagesCovered,
  reieSurfacesCovered: inspection.reieSurfacesCovered,
  openQuestionCategoriesCovered: inspection.openQuestionCategoriesCovered,
  professionalReviewCategoriesCovered: inspection.professionalReviewCategoriesCovered,
  evidenceBoundaryPromptCount: inspection.evidenceBoundaryPromptCount,
  blockedUseWarningCount: inspection.blockedUseWarningCount,
  attributionReminderCount: inspection.attributionReminderCount,
  unresolvedConflictNoticeCount: inspection.unresolvedConflictNoticeCount,
  prohibitedOutputAssertions: inspection.prohibitedOutputAssertions,
}, null, 2));
