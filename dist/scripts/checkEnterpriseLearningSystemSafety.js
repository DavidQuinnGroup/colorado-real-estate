import assert from "node:assert/strict";
import fs from "node:fs";
import { BASELINE_UNAVAILABLE, HUMAN_REVIEW_REQUIRED, LEARNING_SYSTEM_CALCULATION_VERSION, buildLearningSystemSnapshot, calculateOutcomeVariance, getContinuousImprovementBacklog, getDecisionEvaluation, getImprovementActions, getInitiativeOutcomes, getInitiativeReview, getInitiativeVariances, getLearningInitiatives, getLearningLifecycle, getLessonsLearned, } from "../lib/enterprise-kpi/index.js";
function assertInitiatives() {
    const snapshot = buildLearningSystemSnapshot();
    assert.equal(snapshot.metadata.calculationVersion, LEARNING_SYSTEM_CALCULATION_VERSION);
    assert.equal(snapshot.metadata.persistence, "READ_ONLY_NON_PERSISTENT");
    assert.ok(snapshot.metadata.labels.includes(HUMAN_REVIEW_REQUIRED));
    assert.ok(snapshot.metadata.labels.includes("NON_PRODUCTION_FIXTURE"));
    assert.equal(snapshot.lifecycles.length, 4);
    assert.equal(snapshot.summary.liveDataBackedOutputs, 0);
    assert.equal(snapshot.summary.fixtureBackedOutputs, 4);
    assert.equal(snapshot.summary.gap006Status, "OPEN_MATERIAL_REDUCED");
    assert.equal(getLearningInitiatives({ limit: 2 }).initiatives.length, 2);
    assert.ok(getLearningInitiatives({ domain: "CUSTOMER" }).initiatives.every((item) => item.strategicDomain === "CUSTOMER"));
    for (const lifecycle of snapshot.lifecycles) {
        assert.equal(lifecycle.initiative.fixture, true);
        assert.equal(lifecycle.initiative.provenance, "NON_PRODUCTION_FIXTURE");
        assert.equal(lifecycle.initiative.humanReviewRequired, HUMAN_REVIEW_REQUIRED);
        assert.equal(lifecycle.review.humanReviewRequired, HUMAN_REVIEW_REQUIRED);
        assert.ok(lifecycle.review.labels.includes("NON_PRODUCTION_FIXTURE"));
        assert.equal(lifecycle.initiative.originatingDecisionPackageId, lifecycle.decisionPackage.packageId);
        assert.equal(lifecycle.initiative.selectedDecisionOptionId, lifecycle.selectedOption.optionId);
        assert.ok(lifecycle.decisionPackage.dispositionDemo.officialDecision === false);
        assert.ok(getLearningLifecycle(lifecycle.initiative.initiativeId));
        assert.ok(getInitiativeOutcomes(lifecycle.initiative.initiativeId));
        assert.ok(getInitiativeVariances(lifecycle.initiative.initiativeId));
        assert.ok(getInitiativeReview(lifecycle.initiative.initiativeId));
        assert.ok(getDecisionEvaluation(lifecycle.initiative.initiativeId));
        assert.ok(getRecommendationEvaluation(lifecycle.initiative.initiativeId));
    }
    assert.equal(getLearningLifecycle("DOES-NOT-EXIST"), null);
}
function getRecommendationEvaluation(initiativeId) {
    return buildLearningSystemSnapshot().lifecycles.find((item) => item.initiative.initiativeId === initiativeId)?.recommendationEvaluation ?? null;
}
function assertVariances() {
    const snapshot = buildLearningSystemSnapshot();
    const states = snapshot.lifecycles.flatMap((item) => item.variances.map((variance) => variance.state));
    assert.ok(states.includes("EXCEEDED"));
    assert.ok(states.includes("PARTIALLY_MET"));
    assert.ok(states.includes("NOT_MEASURABLE"));
    assert.ok(states.includes("MISSED"));
    const met = calculateOutcomeVariance({
        initiativeId: "TEST",
        expectedOutcomeId: "OUT",
        expectedValue: 10,
        actualValue: 10,
        desiredDirection: "HIGHER_IS_BETTER",
        confidence: "LOW",
        freshness: "FRESH",
        evidenceCoverage: 1,
        provenance: "NON_PRODUCTION_FIXTURE",
    });
    assert.equal(met.state, "MET");
    assert.equal(met.percentageVariance, 0);
    assert.equal(met.materiality, "NONE");
    const lowerIsBetter = calculateOutcomeVariance({
        initiativeId: "TEST",
        expectedOutcomeId: "OUT",
        expectedValue: 10,
        actualValue: 8,
        desiredDirection: "LOWER_IS_BETTER",
        confidence: "LOW",
        freshness: "FRESH",
        evidenceCoverage: 1,
        provenance: "NON_PRODUCTION_FIXTURE",
    });
    assert.equal(lowerIsBetter.state, "EXCEEDED");
    assert.equal(lowerIsBetter.interpretation, "FAVORABLE");
    const missingTarget = calculateOutcomeVariance({
        initiativeId: "TEST",
        expectedOutcomeId: "OUT",
        expectedValue: "UNAVAILABLE",
        actualValue: 7,
        desiredDirection: "HIGHER_IS_BETTER",
        confidence: "INSUFFICIENT",
        freshness: "UNKNOWN",
        evidenceCoverage: 0,
        provenance: "NON_PRODUCTION_FIXTURE",
    });
    assert.equal(missingTarget.state, "NOT_MEASURABLE");
    assert.equal(missingTarget.absoluteVariance, null);
    assert.equal(missingTarget.percentageVariance, null);
    const zeroTarget = calculateOutcomeVariance({
        initiativeId: "TEST",
        expectedOutcomeId: "OUT",
        expectedValue: 0,
        actualValue: 2,
        desiredDirection: "HIGHER_IS_BETTER",
        confidence: "LOW",
        freshness: "FRESH",
        evidenceCoverage: 1,
        provenance: "NON_PRODUCTION_FIXTURE",
    });
    assert.equal(zeroTarget.percentageVariance, null);
    assert.ok(zeroTarget.limitations.some((item) => item.description.includes("Percentage variance")));
}
function assertReviewsEvaluationsAndLessons() {
    const snapshot = buildLearningSystemSnapshot();
    const poorOutcomeStrongProcess = snapshot.lifecycles.find((item) => item.initiative.initiativeId === "INIT-GOVERNANCE-RECOVERY-FIXTURE");
    assert.ok(poorOutcomeStrongProcess);
    assert.equal(poorOutcomeStrongProcess.decisionEvaluation.result, "STRONG_PROCESS");
    assert.equal(poorOutcomeStrongProcess.decisionEvaluation.outcomeQuality, "MISSED");
    assert.ok(poorOutcomeStrongProcess.decisionEvaluation.explanation.includes("rather than the outcome alone"));
    assert.equal(poorOutcomeStrongProcess.recommendationEvaluation.calibrationFinding, "OVERCONFIDENT");
    assert.equal(poorOutcomeStrongProcess.recommendationEvaluation.proposedWeightAdjustment, "HUMAN_REVIEW_RECOMMENDATION_ONLY");
    const inconclusive = snapshot.lifecycles.find((item) => item.initiative.baselines.some((baseline) => baseline.value === BASELINE_UNAVAILABLE));
    assert.ok(inconclusive);
    assert.equal(inconclusive.variances[0]?.state, "NOT_MEASURABLE");
    assert.equal(inconclusive.recommendationEvaluation.calibrationFinding, "INCONCLUSIVE");
    assert.equal(snapshot.lessons.length, 4);
    assert.equal(new Set(snapshot.lessons.map((item) => item.lessonId)).size, snapshot.lessons.length);
    assert.ok(snapshot.lessons.every((item) => item.evidence.some((evidence) => evidence.evidenceType === "INITIATIVE_REVIEW")));
    assert.ok(snapshot.lessons.every((item) => item.evidence.some((evidence) => evidence.evidenceType === "OUTCOME_VARIANCE")));
    assert.ok(snapshot.lessons.every((item) => item.humanReviewRequired === HUMAN_REVIEW_REQUIRED));
    assert.ok(snapshot.lessons.every((item) => item.proposedGovernanceImpact.includes("do not auto-adopt")));
    assert.equal(snapshot.improvementActions.length, 4);
    assert.ok(snapshot.improvementActions.every((item) => item.currentState === "NEEDS_REVIEW"));
    assert.ok(snapshot.improvementActions.every((item) => item.description.includes("no task")));
    assert.ok(snapshot.improvementActions.some((item) => item.ranking.totalScore === null));
    assert.equal(getLessonsLearned({ limit: 1 }).lessons.length, 1);
    assert.equal(getImprovementActions({ state: "NEEDS_REVIEW" }).actions.length, 4);
    assert.equal(getContinuousImprovementBacklog({ limit: 2 }).backlog.length, 2);
}
function assertApiUiContracts() {
    const routes = [
        "app/api/admin/enterprise/initiatives/route.ts",
        "app/api/admin/enterprise/initiatives/[id]/route.ts",
        "app/api/admin/enterprise/initiatives/[id]/outcomes/route.ts",
        "app/api/admin/enterprise/initiatives/[id]/variances/route.ts",
        "app/api/admin/enterprise/initiatives/[id]/review/route.ts",
        "app/api/admin/enterprise/initiatives/[id]/decision-evaluation/route.ts",
        "app/api/admin/enterprise/initiatives/[id]/recommendation-evaluation/route.ts",
        "app/api/admin/enterprise/lessons/route.ts",
        "app/api/admin/enterprise/improvement-actions/route.ts",
        "app/api/admin/enterprise/continuous-improvement/route.ts",
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
    const page = fs.readFileSync("app/admin/repository/learning-system/page.tsx", "utf8");
    assert.ok(page.includes("NON_PRODUCTION_FIXTURE"));
    assert.ok(page.includes("HUMAN_REVIEW_REQUIRED"));
    assert.ok(page.includes("Expected vs Actual"));
    assert.ok(page.includes("Continuous Improvement Backlog"));
    assert.ok(page.includes("Evidence Drill-Down"));
    assert.ok(!page.includes("use client"));
    const commandCenter = fs.readFileSync("app/admin/repository/executive-command-center/page.tsx", "utf8");
    assert.ok(commandCenter.includes("buildLearningSystemSnapshot"));
    assert.ok(commandCenter.includes("Learning System"));
    assert.ok(commandCenter.includes("/admin/repository/learning-system"));
    const decisionSupport = fs.readFileSync("app/admin/repository/decision-support/page.tsx", "utf8");
    assert.ok(decisionSupport.includes("Learning review"));
    assert.ok(decisionSupport.includes("Linked conceptually"));
}
function assertNoMutationOrPublicExposure() {
    const service = fs.readFileSync("lib/enterprise-kpi/learningSystem.ts", "utf8");
    assert.ok(!/prisma\.|supabase\.|insert\(|update\(|delete\(|upsert\(/i.test(service));
    assert.ok(!/openai|chat\.completions|responses\.create|scheduler|worker|queue|sendEmail|MLS|Typesense/i.test(service));
    assert.ok(!fs.existsSync("app/api/enterprise/initiatives"));
    assert.ok(!fs.existsSync("app/api/enterprise/lessons"));
    assert.ok(!fs.existsSync("app/learning-system"));
}
assertInitiatives();
assertVariances();
assertReviewsEvaluationsAndLessons();
assertApiUiContracts();
assertNoMutationOrPublicExposure();
console.log("[enterprise-learning-system-safety] ok: initiatives, baselines, variances, reviews, evaluations, lessons, backlog, traceability, auth, fixture labels, human-review labels, and mutation boundaries passed.");
