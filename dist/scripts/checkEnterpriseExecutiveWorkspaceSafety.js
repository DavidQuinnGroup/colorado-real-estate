import assert from "node:assert/strict";
import fs from "node:fs";
import { ATTENTION_ITEM_RULES, EXECUTIVE_WORKSPACE_CALCULATION_VERSION, MATERIAL_CHANGE_RANKING_RULES, buildDailyExecutiveBrief, buildExecutiveCommandCenterPayload, } from "../lib/enterprise-kpi/index.js";
function assertCommandCenterComposition() {
    const payload = buildExecutiveCommandCenterPayload();
    assert.equal(payload.metadata.calculationVersion, EXECUTIVE_WORKSPACE_CALCULATION_VERSION);
    assert.equal(payload.metadata.persistence, "READ_ONLY_NON_PERSISTENT");
    assert.equal(payload.enterpriseStatus.provenance, "NON_PRODUCTION_FIXTURE");
    assert.equal(payload.enterpriseStatus.internalPreviewState, "CERTIFIED_FOR_INTERNAL_PREVIEW");
    assert.equal(payload.domains.length, 6);
    assert.ok(payload.domains.some((domain) => domain.status === "UNKNOWN"));
    assert.ok(payload.materialChanges.length > 0);
    assert.ok(payload.risks.length > 0);
    assert.ok(payload.opportunities.length > 0);
    assert.ok(payload.attentionItems.length > 0);
    assert.equal(new Set(payload.attentionItems.map((item) => item.stableId)).size, payload.attentionItems.length);
    assert.ok(payload.dataIntegrity.fixtureBackedOutputCount > 0);
    assert.equal(payload.dataIntegrity.liveDataBackedOutputCount, 0);
    assert.ok(payload.dataIntegrity.definedButUnavailableKpiCount > 0);
    assert.equal(payload.dataIntegrity.gap006Status, "OPEN_MATERIAL_REDUCED");
    assert.ok(payload.knownLimitations.some((item) => item.includes("NON_PRODUCTION_FIXTURE")));
}
function assertRankingAndAttentionRules() {
    const payload = buildExecutiveCommandCenterPayload();
    assert.ok(MATERIAL_CHANGE_RANKING_RULES.some((rule) => rule.includes("Severity rank")));
    assert.ok(ATTENTION_ITEM_RULES.some((rule) => rule.includes("Duplicate")));
    const ranks = payload.materialChanges.map((item) => item.rankScore);
    assert.deepEqual(ranks, [...ranks].sort((left, right) => right - left));
    assert.ok(payload.materialChanges.every((item) => item.rankingFactors.length === MATERIAL_CHANGE_RANKING_RULES.length));
    assert.ok(payload.attentionItems.every((item) => item.suggestedReviewAction.length > 0));
    assert.ok(payload.attentionItems.every((item) => item.provenance === "NON_PRODUCTION_FIXTURE"));
}
function assertEvidenceDrillDown() {
    const payload = buildExecutiveCommandCenterPayload();
    for (const change of payload.materialChanges) {
        assert.equal(change.drillDown.summaryId, change.changeId);
        assert.ok(change.drillDown.detectionRuleId.startsWith("RULE-"));
        assert.ok(change.drillDown.kpiIds.length > 0 || change.drillDown.missingEvidence.length === 0);
        for (const evidence of change.drillDown.evidence) {
            assert.ok(evidence.evidenceId.startsWith("EVD-"));
            assert.ok(evidence.calculationVersion.length > 0);
            assert.equal(evidence.provenance, "NON_PRODUCTION_FIXTURE");
        }
        for (const evaluation of change.drillDown.evaluations) {
            assert.ok(evaluation.kpiId.startsWith("KPI-"));
            assert.ok(evaluation.sourceAvailability.length > 0);
        }
    }
}
function assertDailyBrief() {
    const brief = buildDailyExecutiveBrief();
    assert.equal(brief.metadata.title, "PROJECT ATLAS");
    assert.equal(brief.metadata.subtitle, "Daily Executive Brief");
    assert.equal(brief.metadata.provenance, "NON_PRODUCTION_FIXTURE");
    assert.equal(brief.metadata.calculationVersion, EXECUTIVE_WORKSPACE_CALCULATION_VERSION);
    const headings = brief.sections.map((section) => section.heading);
    assert.deepEqual(headings, [
        "Enterprise Status",
        "Material Changes",
        "Customer Signals",
        "Platform Signals",
        "Operations Signals",
        "Governance Signals",
        "Top Risk",
        "Top Opportunity",
        "Executive Attention Required",
        "Data Confidence and Limitations",
    ]);
    assert.ok(brief.renderedText.includes("NON_PRODUCTION_FIXTURE"));
    assert.ok(brief.renderedText.includes("UNKNOWN"));
    assert.ok(brief.renderedText.includes("Persistence is intentionally unavailable"));
    assert.ok(!/\bcaused\b|\bcauses\b|\bwill fix\b/i.test(brief.renderedText));
    assert.ok(!/investment approval|roadmap command|strategic investment recommendation/i.test(brief.renderedText));
}
function assertApiAndUiContracts() {
    const routes = [
        "app/api/admin/enterprise/executive-command-center/route.ts",
        "app/api/admin/enterprise/executive-brief/route.ts",
    ];
    for (const route of routes) {
        const content = fs.readFileSync(route, "utf8");
        assert.ok(content.includes("authorizeRepositoryAdminRequest"), `${route} missing auth`);
        assert.ok(content.includes("repositoryAdminUnauthorizedResponse"), `${route} missing unauthorized response`);
        assert.ok(content.includes("export async function GET"), `${route} missing GET`);
        assert.ok(!content.includes("export async function POST"), `${route} must not expose POST`);
        assert.ok(!content.includes("export async function PUT"), `${route} must not expose PUT`);
        assert.ok(!content.includes("export async function DELETE"), `${route} must not expose DELETE`);
    }
    const middleware = fs.readFileSync("middleware.ts", "utf8");
    assert.ok(middleware.includes("/api/admin/enterprise/:path*"));
    const page = fs.readFileSync("app/admin/repository/executive-command-center/page.tsx", "utf8");
    assert.ok(page.includes("NON_PRODUCTION_FIXTURE"));
    assert.ok(page.includes("Executive Attention Queue"));
    assert.ok(page.includes("Data Integrity Panel"));
    assert.ok(page.includes("Evidence Drill-Down"));
    assert.ok(page.includes("Presentation-only"));
    assert.ok(!page.includes("use client"));
}
function assertNoPublicExposureOrMutation() {
    const apiFiles = fs.readdirSync("app/api/admin/enterprise", { recursive: true }).map(String);
    assert.ok(apiFiles.some((file) => file.includes("executive-command-center/route.ts")));
    assert.ok(apiFiles.some((file) => file.includes("executive-brief/route.ts")));
    assert.ok(!fs.existsSync("app/api/enterprise"));
    assert.ok(!fs.existsSync("app/executive-command-center"));
    const workspace = fs.readFileSync("lib/enterprise-kpi/executiveWorkspace.ts", "utf8");
    assert.ok(!/prisma\.|supabase\.|insert\(|update\(|delete\(|upsert\(/i.test(workspace));
    assert.ok(!/openai|chat\.completions|responses\.create/i.test(workspace));
}
assertCommandCenterComposition();
assertRankingAndAttentionRules();
assertEvidenceDrillDown();
assertDailyBrief();
assertApiAndUiContracts();
assertNoPublicExposureOrMutation();
console.log("[enterprise-executive-workspace-safety] ok: command center, daily brief, ranking, attention, evidence, provenance, auth, UI, and mutation boundaries passed.");
