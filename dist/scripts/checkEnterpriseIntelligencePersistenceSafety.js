import assert from "node:assert/strict";
import fs from "node:fs";
import { EIA_MODEL_OWNERSHIP, assertExplicitClassification, assertNoMixedAggregation, buildKpiObservationIdempotencyKey, } from "../lib/enterprise-kpi/persistence.js";
const schema = fs.readFileSync("prisma/schema.prisma", "utf8");
const migration = fs.readFileSync("prisma/migrations/20260718164000_eia_wave1_persistence_foundation/migration.sql", "utf8");
const requiredModels = [
    "EIAProvenance",
    "EIAEvidenceReference",
    "EIAEvidenceLink",
    "EIAKpiObservation",
    "EIAKpiEvaluation",
    "EIAKpiThresholdEvaluation",
    "EIAKpiTransition",
    "EIAEnterpriseHealthSnapshot",
    "EIADomainHealthSnapshot",
    "EIAHealthContribution",
    "EIAIntelligenceEvent",
    "EIAIntelligenceSignal",
    "EIAExecutiveInsight",
    "EIADecisionSituation",
    "EIADecisionPackage",
    "EIADecisionOption",
    "EIADecisionCriterion",
    "EIADecisionScore",
    "EIADecisionRecommendation",
    "EIADecisionDisposition",
    "EIAEnterpriseInitiative",
    "EIAInitiativeStatusHistory",
    "EIAOutcomeObservation",
    "EIAOutcomeVariance",
    "EIAInitiativeReview",
    "EIADecisionEvaluation",
    "EIARecommendationEvaluation",
    "EIALessonLearned",
    "EIAImprovementAction",
    "EIAImprovementActionStatusHistory",
    "EIAContinuousImprovementBacklogItem",
];
for (const model of requiredModels) {
    assert.ok(schema.includes(`model ${model} `), `Missing Prisma model ${model}`);
    assert.ok(migration.includes(`CREATE TABLE "${model}"`), `Missing migration table ${model}`);
}
for (const enumName of [
    "EIAEnvironment",
    "EIADataOrigin",
    "EIAConfidence",
    "EIAFreshness",
    "EIAPrivacy",
    "EIASensitivity",
    "EIAPii",
    "EIARetention",
    "EIAImmutability",
]) {
    assert.ok(schema.includes(`enum ${enumName}`), `Missing enum ${enumName}`);
    assert.ok(migration.includes(`CREATE TYPE "${enumName}"`), `Missing migration enum ${enumName}`);
}
for (const value of ["LIVE", "FIXTURE", "MANUAL", "IMPORTED", "UNKNOWN"]) {
    assert.ok(schema.includes(value), `Missing data-origin classification ${value}`);
}
assert.throws(() => assertExplicitClassification({
    environment: "PRODUCTION",
    dataOrigin: "FIXTURE",
}));
assert.doesNotThrow(() => assertExplicitClassification({
    environment: "TEST",
    dataOrigin: "FIXTURE",
    fixtureSet: "EIF-SPRINT-5",
    fixtureScenario: "LEARNING_SYSTEM",
}));
assert.throws(() => assertNoMixedAggregation([
    { environment: "TEST", dataOrigin: "FIXTURE", fixtureSet: "A", fixtureScenario: "A" },
    { environment: "PRODUCTION", dataOrigin: "LIVE" },
]));
const key = buildKpiObservationIdempotencyKey({
    environment: "TEST",
    dataOrigin: "FIXTURE",
    fixtureSet: "EIF-SPRINT-5",
    fixtureScenario: "LEARNING_SYSTEM",
    kpiId: "KPI-PLAT-001",
    value: { kind: "UNAVAILABLE", unavailableReason: "No live source authorized." },
    status: "UNKNOWN",
    calculationVersion: "EIA-1.0-test",
    provenanceId: "prov-test",
    confidence: "LOW",
    freshness: "UNKNOWN",
    privacy: "INTERNAL",
    sensitivity: "INTERNAL",
    retention: "HISTORICAL",
});
assert.equal(key, "EIA-KPI-OBS|TEST|FIXTURE|EIF-SPRINT-5|LEARNING_SYSTEM|KPI-PLAT-001|NO_PERIOD_START|NO_PERIOD_END|NO_OBSERVED_AT|NO_SOURCE_STATE|EIA-1.0-test");
for (const destructive of [
    /DROP TABLE/i,
    /DROP COLUMN/i,
    /^DELETE FROM/im,
    /^TRUNCATE/im,
    /prisma db push/i,
]) {
    assert.equal(destructive.test(migration), false, `Destructive SQL detected: ${destructive}`);
}
const nonEiaAlter = migration
    .split("\n")
    .filter((line) => /^ALTER TABLE\s+"(?!EIA)/i.test(line));
assert.deepEqual(nonEiaAlter, []);
assert.ok((migration.match(/ON DELETE RESTRICT/g) ?? []).length >= 20);
assert.ok((migration.match(/CREATE UNIQUE INDEX/g) ?? []).length >= 15);
assert.ok((migration.match(/CREATE INDEX/g) ?? []).length >= 50);
assert.ok(schema.includes("@@unique([evidenceId, entityType, entityId, relationship])"));
assert.match(schema, /idempotencyKey\s+String\s+@unique/);
assert.match(schema, /dataOrigin\s+EIADataOrigin/);
assert.match(schema, /environment\s+EIAEnvironment/);
const existingSafety = fs.readFileSync("scripts/checkEnterpriseLearningSystemSafety.ts", "utf8");
assert.ok(existingSafety.includes("READ_ONLY_NON_PERSISTENT"));
assert.ok(existingSafety.includes("NON_PRODUCTION_FIXTURE"));
const routes = fs.existsSync("app/api/enterprise") ? fs.readdirSync("app/api/enterprise") : [];
assert.equal(routes.length, 0, "Wave 1 must not create public enterprise API routes.");
assert.ok(!fs.existsSync("app/eia"));
assert.ok(!fs.existsSync("app/enterprise-intelligence"));
const packageJson = fs.readFileSync("package.json", "utf8");
assert.ok(packageJson.includes("check:enterprise-intelligence-persistence-safety"));
assert.equal(/CREATE TABLE "(?!EIA)/i.test(migration), false);
assert.equal(/CREATE TABLE "EIA.*Worker|CREATE TABLE "EIA.*Queue|CREATE TABLE "EIA.*Cron/i.test(migration), false);
assert.equal(/sendEmail\(|typesense:reindex|prisma db push/i.test(migration), false);
assert.equal(/run:worker|run:alerts:live|run:mls-sync:live/.test(packageJson), true, "Existing scripts are unchanged and explicitly known.");
assert.equal(EIA_MODEL_OWNERSHIP.length, 5);
assert.ok(EIA_MODEL_OWNERSHIP.every((entry) => entry.canonicalOwner && entry.operationalSteward));
console.log("[enterprise-intelligence-persistence-safety] ok: models, provenance, fixture/live separation, idempotency, indexes, additive SQL, auth posture, public exposure, and activation guardrails passed.");
