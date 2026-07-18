import assert from "node:assert/strict";
import fs from "node:fs";
import { DECISION_CRITERIA, DECISION_SUPPORT_CALCULATION_VERSION, DECISION_SCORING_RULES, HUMAN_DECISION_REQUIRED, buildDecisionSupportSnapshot, getDecisionPackage, getDecisionPackageComparison, getDecisionPackageExpectedOutcomes, getDecisionPackageRecommendation, getDecisionPackages, getDecisionSituations, validateDecisionCriteriaWeights, } from "../lib/enterprise-kpi/index.js";
function assertSituations() {
    const snapshot = buildDecisionSupportSnapshot();
    assert.equal(snapshot.metadata.calculationVersion, DECISION_SUPPORT_CALCULATION_VERSION);
    assert.equal(snapshot.metadata.persistence, "READ_ONLY_NON_PERSISTENT");
    assert.ok(snapshot.metadata.labels.includes(HUMAN_DECISION_REQUIRED));
    assert.ok(snapshot.metadata.labels.includes("NON_PRODUCTION_FIXTURE"));
    assert.equal(snapshot.situations.length, 4);
    assert.ok(snapshot.situations.every((item) => item.evidence.length > 0));
    assert.ok(snapshot.situations.every((item) => item.provenance === "NON_PRODUCTION_FIXTURE"));
    assert.ok(snapshot.situations.every((item) => item.confidence.level !== "HIGH"));
    assert.ok(snapshot.situations.every((item) => item.freshness.state.length > 0));
    assert.equal(getDecisionSituations({ limit: 2 }).situations.length, 2);
    assert.ok(getDecisionSituations({ domain: "PLATFORM" }).situations.some((item) => item.relevantDomains.includes("PLATFORM")));
}
function assertScoring() {
    const validation = validateDecisionCriteriaWeights();
    assert.equal(validation.valid, true);
    assert.equal(validation.total, 1);
    assert.equal(DECISION_CRITERIA.length, 7);
    assert.ok(DECISION_CRITERIA.every((item) => item.provisional));
    assert.ok(DECISION_SCORING_RULES.some((item) => item.includes("Burden criteria invert")));
    const snapshot = buildDecisionSupportSnapshot();
    const allOptions = snapshot.packages.flatMap((item) => item.options);
    assert.ok(allOptions.length >= 8);
    for (const option of allOptions) {
        assert.equal(option.score.maximumPossibleScore, 100);
        assert.equal(option.score.calculationVersion, DECISION_SUPPORT_CALCULATION_VERSION);
        assert.equal(option.score.provenance, "NON_PRODUCTION_FIXTURE");
        assert.ok(Number.isInteger(option.score.totalScore ?? 0), "Decision score must avoid false precision.");
        assert.ok(option.score.coveragePercentage >= 0 && option.score.coveragePercentage <= 100);
        const effort = option.score.criterionContributions.find((item) => item.criterionId === "ENGINEERING_EFFORT");
        const risk = option.score.criterionContributions.find((item) => item.criterionId === "RISK");
        assert.ok(effort);
        assert.ok(risk);
        if (typeof effort.rawAssessment === "number") {
            assert.equal(effort.normalizedScore, 100 - effort.rawAssessment);
        }
        if (typeof risk.rawAssessment === "number") {
            assert.equal(risk.normalizedScore, 100 - risk.rawAssessment);
        }
        const financial = option.score.criterionContributions.find((item) => item.criterionId === "FINANCIAL_VALUE");
        assert.ok(financial);
        assert.equal(financial.rawAssessment, "UNKNOWN");
        assert.equal(financial.weightedContribution, null);
    }
}
function assertRecommendationsAndPackages() {
    const snapshot = buildDecisionSupportSnapshot();
    assert.equal(snapshot.packages.length, 4);
    assert.equal(snapshot.summary.liveDataBackedOutputs, 0);
    assert.equal(snapshot.summary.fixtureBackedOutputs, 4);
    assert.ok(snapshot.summary.definedButUnavailableOutputs > 0);
    assert.equal(getDecisionPackages({ limit: 2 }).packages.length, 2);
    for (const decisionPackage of snapshot.packages) {
        assert.ok(decisionPackage.labels.includes(HUMAN_DECISION_REQUIRED));
        assert.ok(decisionPackage.labels.includes("NON_PRODUCTION_FIXTURE"));
        assert.equal(decisionPackage.humanDecisionRequired, HUMAN_DECISION_REQUIRED);
        assert.equal(decisionPackage.provenance, "NON_PRODUCTION_FIXTURE");
        assert.ok(decisionPackage.options.length >= 2);
        assert.ok(decisionPackage.recommendation.humanReviewRequirement === HUMAN_DECISION_REQUIRED);
        assert.ok(decisionPackage.recommendation.confidence.level !== "HIGH");
        assert.ok(decisionPackage.recommendation.conditionsThatCouldChangeRecommendation.length > 0);
        assert.equal(decisionPackage.dispositionDemo.demonstrationOnly, true);
        assert.equal(decisionPackage.dispositionDemo.officialDecision, false);
        assert.equal(decisionPackage.dispositionDemo.rationaleRequired, true);
        assert.equal(decisionPackage.overrideDemo.demonstrationOnly, true);
        assert.ok(decisionPackage.overrideDemo.overrideRationale.includes("rationale"));
        assert.ok(decisionPackage.expectedOutcomes.every((item) => item.baseline === "UNAVAILABLE"));
        assert.ok(decisionPackage.expectedOutcomes.every((item) => item.target === "UNAVAILABLE"));
        assert.equal(decisionPackage.reviewSchedule.schedulingStatus, "SEMANTIC_ONLY_NOT_SCHEDULED");
        assert.ok(getDecisionPackage(decisionPackage.packageId));
        assert.ok(getDecisionPackageComparison(decisionPackage.packageId));
        assert.ok(getDecisionPackageRecommendation(decisionPackage.packageId));
        assert.ok(getDecisionPackageExpectedOutcomes(decisionPackage.packageId));
    }
    assert.equal(getDecisionPackage("DOES-NOT-EXIST"), null);
}
function assertEvidenceTraceability() {
    const snapshot = buildDecisionSupportSnapshot();
    for (const decisionPackage of snapshot.packages) {
        assert.ok(decisionPackage.situation.situationId.startsWith("DS-"));
        assert.ok(decisionPackage.situation.triggeringIntelligenceEventIds.length >= 0);
        assert.ok(decisionPackage.situation.relevantKpis.length > 0);
        assert.ok(decisionPackage.supportingEvidence.every((item) => item.evidenceId.startsWith("EVD-")));
        for (const option of decisionPackage.options) {
            assert.ok(option.evidence.length > 0);
            assert.ok(option.score.criterionContributions.every((item) => item.supportingEvidence.length > 0));
        }
    }
}
function assertApiUiContracts() {
    const routes = [
        "app/api/admin/enterprise/decision-situations/route.ts",
        "app/api/admin/enterprise/decision-packages/route.ts",
        "app/api/admin/enterprise/decision-packages/[id]/route.ts",
        "app/api/admin/enterprise/decision-packages/[id]/comparison/route.ts",
        "app/api/admin/enterprise/decision-packages/[id]/recommendation/route.ts",
        "app/api/admin/enterprise/decision-packages/[id]/expected-outcomes/route.ts",
    ];
    for (const route of routes) {
        const content = fs.readFileSync(route, "utf8");
        assert.ok(content.includes("authorizeRepositoryAdminRequest"), `${route} missing auth`);
        assert.ok(content.includes("repositoryAdminUnauthorizedResponse"), `${route} missing unauthorized response`);
        assert.ok(content.includes("export async function GET"), `${route} missing GET`);
        assert.ok(!content.includes("export async function POST"), `${route} must not expose POST`);
        assert.ok(!content.includes("export async function PATCH"), `${route} must not expose PATCH`);
        assert.ok(!content.includes("export async function DELETE"), `${route} must not expose DELETE`);
    }
    const page = fs.readFileSync("app/admin/repository/decision-support/page.tsx", "utf8");
    assert.ok(page.includes("NON_PRODUCTION_FIXTURE"));
    assert.ok(page.includes("HUMAN_DECISION_REQUIRED"));
    assert.ok(page.includes("Non-Persistent Disposition"));
    assert.ok(page.includes("Evidence Traceability"));
    assert.ok(!page.includes("use client"));
}
function assertNoMutationOrPublicExposure() {
    const service = fs.readFileSync("lib/enterprise-kpi/decisionSupport.ts", "utf8");
    assert.ok(!/prisma\.|supabase\.|insert\(|update\(|delete\(|upsert\(/i.test(service));
    assert.ok(!/openai|chat\.completions|responses\.create|scheduler|worker|queue|sendEmail|MLS|Typesense/i.test(service));
    assert.ok(!fs.existsSync("app/api/enterprise/decision-packages"));
    assert.ok(!fs.existsSync("app/decision-support"));
}
assertSituations();
assertScoring();
assertRecommendationsAndPackages();
assertEvidenceTraceability();
assertApiUiContracts();
assertNoMutationOrPublicExposure();
console.log("[enterprise-decision-support-safety] ok: situations, packages, scoring, recommendations, outcomes, traceability, auth, UI, fixture labels, human-review labels, and mutation boundaries passed.");
