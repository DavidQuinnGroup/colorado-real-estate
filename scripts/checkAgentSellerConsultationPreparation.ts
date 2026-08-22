import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { authorizeAdminRequest, sanitizeAgentReturnPath } from "../lib/admin/adminAuth";
import { AGENT_SELLER_TIMING_OPTIONS, buildAgentSellerPreparationPacket, composeAgentSellerPreparationBriefing } from "../lib/agent-advisory-workbench/agentSellerPreparationAdmission";
import { AGENT_SELLER_PREPARATION_FIXTURE } from "../lib/agent-advisory-workbench/agentSellerPreparationAdmissionFixtures";
import { prepareAgentSellerConsultation } from "../lib/agent-advisory-workbench/agentSellerConsultationPreparation";

function source(path: string) { return readFileSync(resolve(process.cwd(), path), "utf8"); }
const page = source("app/agent/prepare/seller/page.tsx"); const experienceSource = source("components/agent/SellerConsultationExperience.tsx"); const playbookSource = source("components/agent/SellerConsultationPlaybook.tsx"); const contractSource = source("lib/agent-advisory-workbench/agentSellerPreparationAdmission.ts"); const middleware = source("middleware.ts"); const shell = source("components/agent/AgentWorkspaceShell.tsx"); const packageJson = JSON.parse(source("package.json")) as { scripts?: Record<string, string> };

assert.equal(existsSync(resolve(process.cwd(), "app/agent/prepare/seller/page.tsx")), true);
assert.ok(page.includes('title: "Seller Preparation | Project Atlas"'));
assert.ok(page.includes("SellerConsultationExperience"));
assert.equal(sanitizeAgentReturnPath("/agent/prepare/seller"), "/agent/prepare/seller");
assert.ok(middleware.includes('pathname === "/agent/prepare/seller"'));
assert.ok(shell.includes('href="/agent/prepare/seller"') && shell.includes("Seller Preparation"));

const ready = prepareAgentSellerConsultation(AGENT_SELLER_PREPARATION_FIXTURE);
assert.equal(ready.packet.admission, "ADMITTED"); assert.ok(ready.composition); assert.ok(ready.playbook); assert.equal(ready.composition?.surface, "SELLER");
assert.equal(ready.humanState.label, "Ready for your review");
assert.ok((ready.composition?.executiveBriefing.text.length ?? 0) <= 1200);
assert.equal(AGENT_SELLER_TIMING_OPTIONS.length, 6);
assert.deepEqual(AGENT_SELLER_TIMING_OPTIONS.map((option) => option.label), ["Just exploring", "Within 3 months", "3-6 months", "6-12 months", "More than 12 months", "Timing not decided yet"]);
for (const timing of AGENT_SELLER_TIMING_OPTIONS) { const packet = buildAgentSellerPreparationPacket({ ...AGENT_SELLER_PREPARATION_FIXTURE, timing: timing.value }); assert.equal(packet.admission, "ADMITTED"); assert.equal(composeAgentSellerPreparationBriefing(packet)?.keyEvidence.some((item) => item.value === timing.label), true); }
for (const [change, reason] of [[{ protectedClassRequest: true }, "FAIR_HOUSING_OR_SUITABILITY_PROHIBITED"], [{ demographicInferenceRequested: true }, "FAIR_HOUSING_OR_SUITABILITY_PROHIBITED"], [{ suitabilityConclusionRequested: true }, "FAIR_HOUSING_OR_SUITABILITY_PROHIBITED"], [{ persistenceRequested: true }, "PROTECTED_CONTEXT_PROHIBITED"], [{ providerRuntimeRequired: true }, "PROTECTED_CONTEXT_PROHIBITED"], [{ pricingRecommendationRequested: true }, "PROFESSIONAL_CONCLUSION_PROHIBITED"], [{ legalConclusionRequested: true }, "PROFESSIONAL_CONCLUSION_PROHIBITED"], [{ taxAdviceRequested: true }, "PROFESSIONAL_CONCLUSION_PROHIBITED"], [{ priorities: ["SELLING_PROCESS"] as never }, "GOVERNED_SELLER_TOPICS_REQUIRED"]] as const) assert.ok(buildAgentSellerPreparationPacket({ ...AGENT_SELLER_PREPARATION_FIXTURE, ...change }).reasons.includes(reason));
assert.equal(ready.playbook?.consultationAgenda.length, 6);
for (const id of ["seller-position-readiness", "seller-discovery-questions", "property-condition-preparation", "pricing-market-preparation", "property-facts-records", "selling-process-roadmap", "showing-launch-preparation", "seller-proceeds-financial-discussion", "offer-review-education", "professional-checkpoints", "representation-process"]) assert.ok(ready.playbook?.sections.some((section) => section.id === id), `Missing Seller section ${id}`);
for (const step of ready.playbook?.consultationAgenda ?? []) { assert.ok(step.guide.keyQuestions.length && step.guide.talkingPoints.length && step.guide.factsToConfirm.length && step.guide.professionalCheckpoints.length && step.guide.expectedOutcome); }
assert.ok(ready.playbook?.nextActionPlan.atlasContinuations.some((action) => action.href === "/agent/prepare/property")); assert.ok(ready.playbook?.nextActionPlan.atlasContinuations.some((action) => action.href === "/agent/prepare/market"));
for (const marker of ["agent-seller-consultation-experience", "agent-seller-empty-state", "agent-seller-prepare-briefing", "agent-seller-briefing", "SELLER PREPARATION", "Prepare for a seller consultation", "Starting the seller conversation", "Preparing to move toward market", "When might they want to sell?", "Update my briefing", "data-persistence=\"false\"", "data-same-page-decision-continuity=\"true\""]) assert.ok(experienceSource.includes(marker), `Missing Seller experience marker: ${marker}`);
for (const marker of ["agent-seller-professional-playbook", "agent-seller-playbook-detail", "Use in consultation", "ATLAS continuation actions", "DisclosureStateIndicator"]) assert.ok(playbookSource.includes(marker), `Missing Seller playbook marker: ${marker}`);
for (const forbidden of ["fetch(", "prisma", "createClient", "localStorage", "sessionStorage", "document.cookie", "REIE_AGENT_CREDENTIAL", "customerName", "leadId", "MLS_GRID", "IRES", "school ranking", "safety score", "family friendly"]) { assert.equal(contractSource.includes(forbidden), false, `Seller contract must not introduce ${forbidden}`); assert.equal(experienceSource.includes(forbidden), false, `Seller experience must not introduce ${forbidden}`); }
assert.equal(packageJson.scripts?.["check:agent-seller-consultation-preparation"], "jiti scripts/checkAgentSellerConsultationPreparation.ts");
console.log("AGENT_SELLER_CONSULTATION_PREPARATION_CHECK: PASS");
