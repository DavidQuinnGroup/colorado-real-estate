import assert from "node:assert/strict";
import fs from "node:fs";

import {
  EIP_SPRINT_3_ASSESSMENT_TIMESTAMP,
  EIP_SPRINT_3_QUALITY_ENGINE_VERSION,
  assessEnterpriseKnowledgeQuality,
  assessSprint2GeographicReadModelQuality,
  buildEipSprint3QualityValidationFixtures,
  qualityInputFromGeographicView,
  type EnterpriseKnowledgeQualityAssessment,
  type EnterpriseKnowledgeQualityInput,
  type EnterpriseKnowledgeQualityStatus,
} from "../lib/eip/enterpriseKnowledgeQualityEngine.js";
import { createEipSprint2InternalGeographicReadModel } from "../lib/eip/internalGeographicReadModel.js";

const readModel = createEipSprint2InternalGeographicReadModel();
const views = readModel.listAll();
const assessments = assessSprint2GeographicReadModelQuality(views);
const repeatedAssessments = assessSprint2GeographicReadModelQuality(views);
const validationFixtures = buildEipSprint3QualityValidationFixtures();
const validationAssessments = validationFixtures.map(assessEnterpriseKnowledgeQuality);

assert.equal(views.length, 10, "Sprint 3 must evaluate only Sprint 1/Sprint 2 geographic fixture knowledge");
assert.equal(assessments.length, 10);
assert.deepEqual(assessments, repeatedAssessments, "Quality assessments must be deterministic");
assert.deepEqual(assessments[0], assessEnterpriseKnowledgeQuality(qualityInputFromGeographicView(views[0])));

for (const assessment of assessments) {
  assertAssessmentSafety(assessment);
  assert.equal(assessment.domain, "GEOGRAPHIC_INTELLIGENCE");
  assert.equal(assessment.metadata.engineVersion, EIP_SPRINT_3_QUALITY_ENGINE_VERSION);
  assert.equal(assessment.metadata.assessmentTimestamp, EIP_SPRINT_3_ASSESSMENT_TIMESTAMP);
  assert.equal(assessment.metadata.customerVisibleQualityScore, false);
  assert.equal(assessment.metadata.runtimeActivation, false);
  assert.equal(assessment.metadata.persistenceMutation, false);
  assert.equal(assessment.activationReadiness.find((item) => item.target === "CUSTOMER_ACTIVATION")?.status, "NOT_ACTIVATABLE");
}

assertRequiredScenario("complete governed object", validationAssessments, "EIP_INTERNAL_GEO_PERSISTENCE|SPRINT_1|001", "READY");
assertRequiredScenario("missing source", validationAssessments, "EIP_SPRINT_3_QUALITY_FIXTURE|MISSING_SOURCE", "INSUFFICIENT_SOURCE");
assertRequiredScenario("stale knowledge", validationAssessments, "EIP_SPRINT_3_QUALITY_FIXTURE|STALE_KNOWLEDGE", "STALE");
assertRequiredScenario("conflict present", validationAssessments, "EIP_INTERNAL_GEO_PERSISTENCE|SPRINT_1|003", "CONFLICT_PRESENT");
assertRequiredScenario("duplicate candidate", validationAssessments, "EIP_INTERNAL_GEO_PERSISTENCE|SPRINT_1|008", "CONFLICT_PRESENT");
assertRequiredScenario("editorial-only knowledge", validationAssessments, "EIP_INTERNAL_GEO_PERSISTENCE|SPRINT_1|009", "NEEDS_REVIEW");
assertRequiredScenario("insufficient evidence", validationAssessments, "EIP_SPRINT_3_QUALITY_FIXTURE|INSUFFICIENT_EVIDENCE", "NEEDS_REVIEW");
assertRequiredScenario("fully activation-ready internal knowledge", validationAssessments, "EIP_SPRINT_3_QUALITY_FIXTURE|FULLY_INTERNAL_READY", "READY");

assertDimensionCoverage(validationAssessments);
assertFailureModes(validationFixtures[0]);
assertSourceIsolation();

console.log(
  `[eip-sprint-3-enterprise-knowledge-quality-engine] ok: ${assessments.length} Sprint 2 geographic records assessed through reusable quality contract, required quality scenarios verified, customer-visible quality scores 0, runtime activation 0, persistence mutations 0, no Prisma/migration/API/runtime imports.`,
);

function assertRequiredScenario(
  label: string,
  items: readonly EnterpriseKnowledgeQualityAssessment[],
  knowledgeId: string,
  expectedStatus: EnterpriseKnowledgeQualityStatus,
) {
  const assessment = items.find((item) => item.knowledgeId === knowledgeId);
  assert.ok(assessment, `Missing required scenario: ${label}`);
  assert.equal(assessment.overallInternalStatus, expectedStatus, `${label} expected ${expectedStatus}`);
  assertAssessmentSafety(assessment);
}

function assertDimensionCoverage(items: readonly EnterpriseKnowledgeQualityAssessment[]) {
  for (const item of items) {
    assert.equal(item.identityQuality.dimension, "IDENTITY_QUALITY");
    assert.equal(item.sourceQuality.dimension, "SOURCE_QUALITY");
    assert.equal(item.trustQuality.dimension, "TRUST_QUALITY");
    assert.equal(item.freshnessQuality.dimension, "FRESHNESS_QUALITY");
    assert.equal(item.completenessQuality.dimension, "COMPLETENESS_QUALITY");
    assert.equal(item.conflictQuality.dimension, "CONFLICT_QUALITY");
    assert.equal(item.reviewQuality.dimension, "REVIEW_QUALITY");
    assert.ok(item.activationReadiness.some((readiness) => readiness.target === "INTERNAL_PERSISTENCE"));
    assert.ok(item.activationReadiness.some((readiness) => readiness.target === "INTERNAL_RETRIEVAL"));
    assert.ok(item.activationReadiness.some((readiness) => readiness.target === "INTERNAL_MAPPING"));
    assert.ok(item.activationReadiness.some((readiness) => readiness.target === "CUSTOMER_ACTIVATION"));
    assert.ok(item.recommendations.length > 0);
  }
}

function assertFailureModes(input: EnterpriseKnowledgeQualityInput) {
  assert.throws(() => assessEnterpriseKnowledgeQuality(mutatedInput(input, {
    governance: { ...input.governance, customerVisible: true },
  })), /customer-visible quality scores/);
  assert.throws(() => assessEnterpriseKnowledgeQuality(mutatedInput(input, {
    governance: { ...input.governance, runtimeVisible: true },
  })), /runtime visibility/);
  assert.throws(() => assessEnterpriseKnowledgeQuality(mutatedInput(input, {
    governance: { ...input.governance, persistenceMutation: true },
  })), /mutate persistence/);
  assert.throws(() => assessEnterpriseKnowledgeQuality(mutatedInput(input, {
    activation: { ...input.activation, CUSTOMER_ACTIVATION: true },
  })), /activate customers/);
}

function assertSourceIsolation() {
  const moduleContents = fs.readFileSync("lib/eip/enterpriseKnowledgeQualityEngine.ts", "utf8");
  assert.equal(/from ["']@prisma\/client["']|from ["']\.\.\/prisma|DATABASE_URL|Supabase|createClient/i.test(moduleContents), false, "Sprint 3 Quality Engine must not require database access");

  const schema = fs.readFileSync("prisma/schema.prisma", "utf8");
  const packageJson = fs.readFileSync("package.json", "utf8");
  assert.ok(packageJson.includes("check:eip-sprint-3-enterprise-knowledge-quality-engine"));
  assert.equal(/EipSprint3|EnterpriseKnowledgeQualityEngine|QualityAssessment/i.test(schema), false);

  const migrationNames = fs.readdirSync("prisma/migrations").join("\n");
  assert.equal(/eip|quality_engine|quality_assessment/i.test(migrationNames), false);

  for (const runtimeRoot of ["app", "components", "lib/search", "lib/mls", "lib/typesense", "lib/alerts", "lib/email", "lib/tracking", "workers"]) {
    if (!fs.existsSync(runtimeRoot)) continue;

    for (const file of listRuntimeSourceFiles(runtimeRoot)) {
      const contents = fs.readFileSync(file, "utf8");
      assert.equal(contents.includes("enterpriseKnowledgeQualityEngine"), false, `Runtime imports EIP Sprint 3 Quality Engine: ${file}`);
      assert.equal(contents.includes("EIP_SPRINT_3_ENTERPRISE_KNOWLEDGE_QUALITY_ENGINE"), false, `Runtime consumes EIP Sprint 3 Quality Engine: ${file}`);
    }
  }
}

function assertAssessmentSafety(assessment: EnterpriseKnowledgeQualityAssessment) {
  assert.equal(assessment.metadata.customerVisibleQualityScore, false);
  assert.equal(assessment.metadata.runtimeActivation, false);
  assert.equal(assessment.metadata.persistenceMutation, false);
  assert.equal(assessment.activationReadiness.find((item) => item.target === "CUSTOMER_ACTIVATION")?.eligible, false);
}

function mutatedInput(
  input: EnterpriseKnowledgeQualityInput,
  overrides: Record<string, unknown>,
): EnterpriseKnowledgeQualityInput {
  return { ...input, ...overrides } as EnterpriseKnowledgeQualityInput;
}

function listRuntimeSourceFiles(root: string): string[] {
  const entries = fs.readdirSync(root, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const path = `${root}/${entry.name}`;
    if (entry.isDirectory()) {
      files.push(...listRuntimeSourceFiles(path));
    } else if (entry.isFile() && /\.(ts|tsx|js|jsx)$/.test(path)) {
      files.push(path);
    }
  }

  return files;
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/checkEipSprint3EnterpriseKnowledgeQualityEngine.ts
