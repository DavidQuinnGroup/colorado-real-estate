import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

import {
  PROPERTY_SELLER_EVIDENCE_READINESS,
  PROPERTY_SELLER_EVIDENCE_READINESS_CONTRACT,
  inspectPropertySellerEvidenceReadiness,
  type PropertySellerEvidenceCategory,
  type PropertySellerReadinessDisposition,
} from "../lib/property-seller-evidence/propertySellerEvidenceReadiness.js";
import { PROPERTY_SELLER_EVIDENCE_FIXTURES } from "../lib/property-seller-evidence/propertySellerEvidenceReadinessFixtures.js";

function read(path: string) {
  return readFileSync(path, "utf8");
}

function assertIncludes(source: string, expected: string, message: string) {
  assert(source.includes(expected), message);
}

function assertNotIncludes(source: string, forbidden: string, message: string) {
  assert(!source.includes(forbidden), message);
}

function assertFileMissing(path: string) {
  assert(!existsSync(path), `${path} must remain absent.`);
}

const packageJson = JSON.parse(read("package.json")) as { scripts?: Record<string, string> };
const tsconfig = read("tsconfig.worker.json");
const readinessSource = read("lib/property-seller-evidence/propertySellerEvidenceReadiness.ts");
const fixtureSource = read("lib/property-seller-evidence/propertySellerEvidenceReadinessFixtures.ts");
const evidenceDepthSource = read("lib/evidence-depth/evidencePosture.ts");
const advisoryOperatingSource = read("lib/advisory-operating/advisoryOperatingReadiness.ts");
const sellerReadinessComponent = read("components/SellerReadinessGuide.tsx");
const homeWorthPage = read("app/home-worth/page.tsx");
const propertyRoute = read("app/properties/[id]/page.tsx");
const propertyRouteSafety = read("scripts/checkPropertyRouteSafety.ts");
const implementationDoc = read("docs/project-atlas/executive-library/REIE-PROPERTY-SELLER-EVIDENCE-READINESS-IMPLEMENTATION.md");
const chatStart = read("docs/CHAT_START.md");

assert.equal(
  packageJson.scripts?.["check:property-seller-evidence-readiness"],
  "npm run worker:build && node dist/scripts/checkPropertySellerEvidenceReadiness.js",
  "package.json must expose Property / Seller Evidence Readiness validation.",
);
assertIncludes(tsconfig, "scripts/checkPropertySellerEvidenceReadiness.ts", "Worker build must include Property / Seller Evidence validation.");
assertIncludes(tsconfig, "lib/property-seller-evidence/**/*.ts", "Worker build must include Property / Seller Evidence contracts.");

assertIncludes(readinessSource, "PROPERTY_SELLER_EVIDENCE_READINESS", "One authoritative Property / Seller Evidence Readiness contract must exist.");
assertIncludes(readinessSource, "EVIDENCE_DEPTH_FOUNDATION_STATUS", "Readiness contract must reuse Evidence Depth.");
assertIncludes(readinessSource, "ADVISORY_OPERATING_READINESS_STANDARD", "Readiness contract must preserve Advisory Operating boundary.");
assertIncludes(evidenceDepthSource, "EVIDENCE_DEPTH_AND_DATA_INTEGRATION_FOUNDATION_CERTIFIED", "Evidence Depth foundation must remain certified.");
assertIncludes(advisoryOperatingSource, "ADVISORY_OPERATING_READINESS_STANDARD", "Advisory Operating standard must remain present.");
assertNotIncludes(readinessSource, "export type EvidenceDepthRightsStatus =", "Readiness contract must not duplicate Evidence Depth rights model.");
assertNotIncludes(readinessSource, "export type EvidenceDepthFreshnessStatus =", "Readiness contract must not duplicate Evidence Depth freshness model.");
assertNotIncludes(readinessSource, "export type EvidenceDepthConflictStatus =", "Readiness contract must not duplicate Evidence Depth conflict model.");

for (const source of [readinessSource, fixtureSource]) {
  for (const forbidden of [
    "fetch(",
    "XMLHttpRequest",
    "PrismaClient",
    "DATABASE_URL",
    "process.env",
    "localStorage",
    "sessionStorage",
    "document.cookie",
    "createEmail",
    "sendEmail",
    "queue.add",
    "new Worker",
  ]) {
    assertNotIncludes(source, forbidden, `Property / Seller Evidence Readiness must not use ${forbidden}.`);
  }
}

for (const path of [
  "app/property-seller-evidence/page.tsx",
  "app/seller-evidence-readiness/page.tsx",
  "app/api/property-seller-evidence/route.ts",
  "app/api/seller-evidence-readiness/route.ts",
  "components/PropertySellerEvidenceReadiness.tsx",
  "prisma/migrations/property-seller-evidence-readiness",
]) {
  assertFileMissing(path);
}

for (const publicSource of [sellerReadinessComponent, homeWorthPage, propertyRoute]) {
  assertNotIncludes(publicSource, "propertySellerEvidenceReadiness", "Public surfaces must not import internal Property / Seller Evidence Readiness.");
  assertNotIncludes(publicSource, "PROPERTY_SELLER_EVIDENCE_READINESS", "Public surfaces must not expose internal Property / Seller Evidence contract.");
}
assertIncludes(propertyRouteSafety, "property route", "Property route safety check must remain available.");
assertIncludes(implementationDoc, "no property lookup", "Implementation record must preserve no-lookup boundary.");
assertIncludes(chatStart, "PROPERTY_SELLER_EVIDENCE_READINESS_READY_FOR_PUSH", "CHAT_START must carry local certification handoff after implementation.");

const inspection = inspectPropertySellerEvidenceReadiness();

assert.equal(PROPERTY_SELLER_EVIDENCE_READINESS_CONTRACT.contract, PROPERTY_SELLER_EVIDENCE_READINESS);
assert.equal(PROPERTY_SELLER_EVIDENCE_READINESS_CONTRACT.scope.internal, true);
assert.equal(PROPERTY_SELLER_EVIDENCE_READINESS_CONTRACT.scope.nonPublic, true);
assert.equal(PROPERTY_SELLER_EVIDENCE_READINESS_CONTRACT.scope.fixtureBacked, true);
assert.equal(PROPERTY_SELLER_EVIDENCE_READINESS_CONTRACT.scope.readOnly, true);
assert.equal(PROPERTY_SELLER_EVIDENCE_READINESS_CONTRACT.scope.nonPersistent, true);
assert.equal(PROPERTY_SELLER_EVIDENCE_READINESS_CONTRACT.scope.conclusionFree, true);
assert.equal(PROPERTY_SELLER_EVIDENCE_READINESS_CONTRACT.scope.failClosed, true);

assert.equal(inspection.contract, PROPERTY_SELLER_EVIDENCE_READINESS);
assert.equal(inspection.fixtureCount, 24, "Twenty-four fixtures must cover the authorized scope.");
assert(inspection.evidenceCategoriesCovered.length >= 20, "All authorized evidence categories must be covered.");
assert(inspection.rightsFailClosedCount >= 10, "Rights fail-closed cases must be represented.");
assert(inspection.freshnessReviewCount >= 8, "Freshness review cases must be represented.");
assert(inspection.conflictReviewCount >= 3, "Conflict review cases must be represented.");
assert(inspection.professionalReviewCategoriesCovered.includes("TITLE"), "Title review category must be present.");
assert(inspection.professionalReviewCategoriesCovered.includes("LEGAL"), "Legal review category must be present.");
assert(inspection.professionalReviewCategoriesCovered.includes("INSURANCE"), "Insurance review category must be present.");
assert(inspection.professionalReviewCategoriesCovered.includes("INSPECTION"), "Inspection review category must be present.");
assert(inspection.professionalReviewCategoriesCovered.includes("ENGINEERING"), "Engineering review category must be present.");
assert(inspection.professionalReviewCategoriesCovered.includes("ENVIRONMENTAL"), "Environmental review category must be present.");
assert(inspection.professionalReviewCategoriesCovered.includes("MUNICIPAL"), "Municipal review category must be present.");
assert(inspection.professionalReviewCategoriesCovered.includes("HOA"), "HOA review category must be present.");
assert(inspection.professionalReviewCategoriesCovered.includes("APPRAISAL"), "Appraisal boundary category must be present.");
assert(inspection.valuationGuardCount >= 2, "Valuation guards must be represented.");
assert(inspection.conditionConclusionGuardCount >= 2, "Condition-conclusion guards must be represented.");
assert(inspection.customerDataGuardCount >= 1, "Customer-data guard must be represented.");
assert(inspection.providerDependencyGuardCount >= 1, "Provider-dependency guard must be represented.");
assert(inspection.publicNonExposureGuardCount >= 5, "Public non-exposure guards must be represented.");

const requiredCategories: readonly PropertySellerEvidenceCategory[] = [
  "CANONICAL_PROPERTY_IDENTITY",
  "OWNERSHIP_AND_TITLE_DOCUMENTATION_QUESTIONS",
  "IMPROVEMENTS_AND_RENOVATION_RECORDS",
  "PERMITS_AND_MUNICIPAL_RECORDS",
  "MAINTENANCE_AND_REPAIR_DOCUMENTATION",
  "WARRANTIES_AND_SERVICE_RECORDS",
  "SELLER_DISCLOSURES",
  "INSPECTION_AND_SPECIALIST_REPORTS",
  "STRUCTURAL_REVIEW_MATERIALS",
  "ENVIRONMENTAL_REVIEW_MATERIALS",
  "INSURANCE_QUESTIONS_AND_RECORDS",
  "HOA_OR_ASSOCIATION_MATERIALS",
  "SURVEYS_AND_SITE_PLANS",
  "UTILITIES_AND_SYSTEMS_DOCUMENTATION",
  "OCCUPANCY_AND_ACCESS_CONSIDERATIONS",
  "TAX_AND_ASSESSMENT_RECORDS",
  "MARKET_CONTEXT_MATERIALS",
  "LISTING_PREPARATION_DOCUMENTS",
  "UNRESOLVED_INFORMATION",
  "PROFESSIONAL_VERIFICATION_NEEDS",
];
for (const category of requiredCategories) {
  assert(inspection.evidenceCategoriesCovered.includes(category), `Evidence category must be covered: ${category}`);
}

const requiredDispositions: readonly PropertySellerReadinessDisposition[] = [
  "DOCUMENTATION_CATEGORY_READY",
  "DOCUMENTATION_INCOMPLETE",
  "IDENTITY_UNRESOLVED",
  "RIGHTS_UNRESOLVED",
  "FRESHNESS_REVIEW_REQUIRED",
  "CONFLICT_REVIEW_REQUIRED",
  "PROFESSIONAL_REVIEW_REQUIRED",
  "INTERNAL_ONLY",
  "PUBLIC_USE_BLOCKED",
  "VALUATION_PROHIBITED",
  "CONDITION_CONCLUSION_PROHIBITED",
  "CUSTOMER_DATA_REQUIRED_BUT_UNAUTHORIZED",
  "PROVIDER_DEPENDENCY_BLOCKED",
  "FUTURE_INTEGRATION_CANDIDATE",
  "DEFERRED",
  "UNRESOLVED",
];
for (const disposition of requiredDispositions) {
  assert(inspection.dispositionCoverage.includes(disposition), `Disposition must be covered: ${disposition}`);
}

assert.equal(inspection.activationAssertions.noPropertyLookup, true);
assert.equal(inspection.activationAssertions.noOwnershipLookup, true);
assert.equal(inspection.activationAssertions.noPublicRecordRetrieval, true);
assert.equal(inspection.activationAssertions.noProviderCalls, true);
assert.equal(inspection.activationAssertions.noUploads, true);
assert.equal(inspection.activationAssertions.noPersistence, true);
assert.equal(inspection.activationAssertions.noApiOrPublicRoute, true);
assert.equal(inspection.activationAssertions.noCustomerData, true);
assert.equal(inspection.activationAssertions.noCrmWorkflow, true);
assert.equal(inspection.activationAssertions.noTrackingOrTelemetry, true);
assert.equal(inspection.activationAssertions.noProductionWrites, true);

assert.equal(inspection.prohibitedOutputAssertions.valuation, false);
assert.equal(inspection.prohibitedOutputAssertions.pricing, false);
assert.equal(inspection.prohibitedOutputAssertions.sellerNetSheet, false);
assert.equal(inspection.prohibitedOutputAssertions.comparableSaleCalculation, false);
assert.equal(inspection.prohibitedOutputAssertions.conditionConclusion, false);
assert.equal(inspection.prohibitedOutputAssertions.repairScore, false);
assert.equal(inspection.prohibitedOutputAssertions.legalTitleInsuranceMunicipalHoaStructuralEnvironmentalConclusion, false);
assert.equal(inspection.prohibitedOutputAssertions.sellerReadinessScore, false);
assert.equal(inspection.prohibitedOutputAssertions.saleProbability, false);
assert.equal(inspection.prohibitedOutputAssertions.recommendation, false);
assert.equal(inspection.prohibitedOutputAssertions.ranking, false);

assert.equal(inspection.summary.propertyValue, null);
assert.equal(inspection.summary.listingPrice, null);
assert.equal(inspection.summary.conditionScore, null);
assert.equal(inspection.summary.repairPriority, null);
assert.equal(inspection.summary.sellerReadinessScore, null);
assert.equal(inspection.summary.saleProbability, null);
assert.equal(inspection.summary.urgency, null);
assert.equal(inspection.summary.recommendation, null);
assert.equal(inspection.summary.suitability, null);
assert.equal(inspection.summary.marketability, null);
assert.equal(inspection.summary.investmentValue, null);
assert.equal(inspection.summary.appraisalConclusion, null);
assert.equal(inspection.summary.legalConclusion, null);

for (const fixture of PROPERTY_SELLER_EVIDENCE_FIXTURES) {
  assert(!fixture.propertyIdentity.addressPlaceholder.match(/\d+\s+\w+/), `${fixture.fixtureId} must not contain a real address.`);
  assert.equal(fixture.activation.propertyLookup, false);
  assert.equal(fixture.activation.ownershipLookup, false);
  assert.equal(fixture.activation.parcelLookup, false);
  assert.equal(fixture.activation.titleLookup, false);
  assert.equal(fixture.activation.publicRecordRetrieval, false);
  assert.equal(fixture.activation.providerCalls, 0);
  assert.equal(fixture.activation.externalAcquisition, false);
  assert.equal(fixture.activation.uploads, false);
  assert.equal(fixture.activation.documentStorage, false);
  assert.equal(fixture.activation.ocrOrDocumentAnalysis, false);
  assert.equal(fixture.activation.customerDataAccess, false);
  assert.equal(fixture.activation.customerRecordCreated, false);
  assert.equal(fixture.activation.sellerProfileCreated, false);
  assert.equal(fixture.activation.publicRouteCreated, false);
  assert.equal(fixture.activation.publicApiCreated, false);
  assert.equal(fixture.activation.persistenceReads, false);
  assert.equal(fixture.activation.persistenceWrites, false);
  assert.equal(fixture.activation.databaseWrites, false);
  assert.equal(fixture.activation.schemaChanged, false);
  assert.equal(fixture.activation.productionWrites, false);
  assert.equal(fixture.activation.crmWorkflow, false);
  assert.equal(fixture.activation.leadScoring, false);
  assert.equal(fixture.activation.leadRouting, false);
  assert.equal(fixture.activation.tracking, false);
  assert.equal(fixture.activation.telemetry, false);
  assert.equal(fixture.activation.personalization, false);
  assert.equal(fixture.activation.email, false);
  assert.equal(fixture.activation.queueJobs, false);
  assert.equal(fixture.activation.workers, false);

  assert.equal(fixture.prohibitedOutputs.propertyValue, null);
  assert.equal(fixture.prohibitedOutputs.listingPrice, null);
  assert.equal(fixture.prohibitedOutputs.sellerNetProceeds, null);
  assert.equal(fixture.prohibitedOutputs.repairPriority, null);
  assert.equal(fixture.prohibitedOutputs.conditionScore, null);
  assert.equal(fixture.prohibitedOutputs.sellerReadinessScore, null);
  assert.equal(fixture.prohibitedOutputs.saleProbability, null);
  assert.equal(fixture.prohibitedOutputs.urgency, null);
  assert.equal(fixture.prohibitedOutputs.recommendation, null);
  assert.equal(fixture.prohibitedOutputs.suitability, null);
  assert.equal(fixture.prohibitedOutputs.marketability, null);
  assert.equal(fixture.prohibitedOutputs.investmentValue, null);
  assert.equal(fixture.prohibitedOutputs.appraisalConclusion, null);
  assert.equal(fixture.prohibitedOutputs.legalConclusion, null);
  assert.equal(fixture.prohibitedOutputs.titleConclusion, null);
  assert.equal(fixture.prohibitedOutputs.insuranceConclusion, null);
  assert.equal(fixture.prohibitedOutputs.permitConclusion, null);
  assert.equal(fixture.prohibitedOutputs.environmentalConclusion, null);
  assert.equal(fixture.prohibitedOutputs.structuralConclusion, null);
}

console.log(JSON.stringify({
  status: "PROPERTY_SELLER_EVIDENCE_READINESS_READY_FOR_PUSH",
  contract: inspection.contract,
  fixtureCount: inspection.fixtureCount,
  evidenceCategoryCount: inspection.evidenceCategoriesCovered.length,
  incompleteCategoryCount: inspection.incompleteCategoryCount,
  rightsFailClosedCount: inspection.rightsFailClosedCount,
  freshnessReviewCount: inspection.freshnessReviewCount,
  conflictReviewCount: inspection.conflictReviewCount,
  professionalReviewCategories: inspection.professionalReviewCategoriesCovered,
  blockedUseWarningCount: inspection.blockedUseWarningCount,
  valuationGuardCount: inspection.valuationGuardCount,
  conditionConclusionGuardCount: inspection.conditionConclusionGuardCount,
  customerDataGuardCount: inspection.customerDataGuardCount,
  providerDependencyGuardCount: inspection.providerDependencyGuardCount,
  publicNonExposureGuardCount: inspection.publicNonExposureGuardCount,
  activationAssertions: inspection.activationAssertions,
  prohibitedOutputAssertions: inspection.prohibitedOutputAssertions,
}, null, 2));
