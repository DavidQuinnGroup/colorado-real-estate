import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { prepareAgentBuyerConsultation } from "../lib/agent-advisory-workbench/agentBuyerConsultationPreparation";
import { AGENT_BUYER_PREPARATION_FIXTURE } from "../lib/agent-advisory-workbench/agentBuyerPreparationAdmissionFixtures";

function source(path: string) {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

function includesAll(values: readonly string[], terms: readonly string[]) {
  const joined = values.join(" ");
  for (const term of terms)
    assert.match(joined, new RegExp(term, "i"), `Expected agent-ready content to include ${term}.`);
}

const executiveScenario = {
  ...AGENT_BUYER_PREPARATION_FIXTURE,
  stage: "READINESS" as const,
  priorities: [
    "BUYING_PROCESS",
    "FINANCING_READINESS",
    "SEARCH_STRATEGY",
    "PROFESSIONAL_DUE_DILIGENCE",
  ] as const,
  certifiedCity: "Louisville" as const,
  propertyObjective: "SINGLE_FAMILY" as const,
  timing: "THREE_TO_SIX_MONTHS" as const,
  financingStatus: "FINANCING_EXPECTED" as const,
  marketContext: "NONE" as const,
};

const experience = prepareAgentBuyerConsultation(executiveScenario);
assert.equal(experience.packet.admission, "ADMITTED");
assert.ok(experience.composition && experience.playbook);
if (!experience.composition || !experience.playbook)
  throw new Error("Expected admitted Buyer composition and agent-ready playbook.");

const playbook = experience.playbook;
assert.equal(playbook.status, "REIE_AGENT_BUYER_PREPARATION_AGENT_READY_CONTENT_MVV");
assert.equal(playbook.consultationAgenda.length, 6);

const section = (id: string) => {
  const result = playbook.sections.find((candidate) => candidate.id === id);
  assert.ok(result, `Missing section ${id}.`);
  assert.ok(result.guide, `${id} must include agent-ready guidance.`);
  return result;
};

const discovery = section("buyer-discovery-questions");
includesAll(discovery.guide!.keyQuestions, [
  "What are you hoping this purchase allows you to do",
  "what would make you decide to wait",
  "already clear",
  "still being worked through",
  "Who needs to participate",
]);

const finance = section("financial-readiness");
includesAll(finance.guide!.keyQuestions, ["lender", "purchase range", "down-payment", "closing-cost", "lender confirmation"]);
includesAll(finance.guide!.talkingPoints, ["client-reported", "Agent process question", "lender verification"]);
includesAll(finance.guide!.professionalCheckpoints, ["qualification", "underwriting", "approval"]);

const search = section("search-strategy");
includesAll(search.guide!.keyQuestions, ["How broad", "eliminate", "must-haves", "preferences", "flexible", "new listings", "strong candidate"]);
includesAll(search.guide!.factsToConfirm, ["must-haves", "preferences", "trade-offs"]);
includesAll(search.guide!.talkingPoints, ["saved search"]);

const place = section("place-geographic-context");
assert.match(place.summary, /Louisville is admitted as neutral City orientation/i);
includesAll(place.guide!.keyQuestions, ["Louisville", "daily-use", "specific property"]);
includesAll(place.guide!.talkingPoints, ["does not answer which neighborhood", "property is right", "separate layers"]);

const property = section("property-evaluation-framework");
includesAll(property.guide!.keyQuestions, ["must-haves", "preferences", "trade-offs", "open questions"]);
includesAll(property.guide!.keyQuestions, ["location.*size", "condition.*price", "outdoor space.*access", "turnkey.*renovation"]);

const buyingProcess = section("buying-process-roadmap");
includesAll(buyingProcess.guide!.talkingPoints, ["Consultation and readiness", "Search and touring", "Property evaluation", "Contract through closing"]);
const offer = section("offer-preparation-education");
includesAll(offer.guide!.talkingPoints, ["does not tell the buyer what to offer", "negotiate"]);
includesAll(offer.guide!.professionalCheckpoints, ["offer", "contract", "legal", "lender"]);

for (const agendaStep of playbook.consultationAgenda) {
  assert.ok(agendaStep.id && agendaStep.title && agendaStep.summary);
  assert.ok(agendaStep.guide.keyQuestions.length > 0);
  assert.ok(agendaStep.guide.talkingPoints.length > 0);
  assert.ok(agendaStep.guide.factsToConfirm.length > 0);
  assert.ok(agendaStep.guide.professionalCheckpoints.length > 0);
  assert.ok(agendaStep.guide.expectedOutcome);
}

const timingAgenda = playbook.consultationAgenda.find((step) => step.id === "agenda-objective-timing");
assert.ok(timingAgenda);
includesAll(timingAgenda.guide.keyQuestions, ["3-6 month", "target or flexible", "earlier", "later"]);

assert.equal(playbook.nextActionPlan.agentActions.length, 3);
includesAll(playbook.nextActionPlan.agentActions, ["three to six months", "must-haves", "preferences", "trade-offs", "listing-review cadence"]);
assert.ok(playbook.nextActionPlan.atlasContinuations.some((action) => action.href === "/agent/prepare/place"));
assert.ok(playbook.nextActionPlan.atlasContinuations.some((action) => action.href === "/agent/prepare/property"));
assert.ok(playbook.nextActionPlan.atlasContinuations.every((action) => !action.href || (!action.href.includes("?") && !action.href.includes("#"))));

assert.deepEqual(playbook.protectedBoundaries, {
  customerData: false,
  persistence: false,
  providerActivity: false,
  recommendation: false,
  suitability: false,
  fairHousingInference: false,
  affordabilityConclusion: false,
  qualificationConclusion: false,
});

const playbookSource = source("lib/agent-advisory-workbench/agentBuyerProfessionalPlaybook.ts");
const componentSource = source("components/agent/BuyerConsultationPlaybook.tsx");
const northStar = source("docs/project-atlas/executive-library/REIE-PRODUCT-EXPERIENCE-NORTH-STAR.md");
const certification = source("docs/project-atlas/executive-library/REIE-AGENT-BUYER-PREPARATION-AGENT-READY-CONSULTATION-CONTENT-MVV-CERTIFICATION.md");
const packageJson = JSON.parse(source("package.json")) as { scripts?: Record<string, string> };

for (const forbidden of [
  "fetch(",
  "prisma",
  "createClient",
  "localStorage",
  "sessionStorage",
  "document.cookie",
  "REIE_AGENT_CREDENTIAL",
  "customerName",
  "leadId",
])
  assert.equal(playbookSource.includes(forbidden), false, `Playbook must not introduce ${forbidden}.`);

assert.ok(componentSource.includes("agent-buyer-section-guide"));
assert.ok(componentSource.includes("agent-buyer-agenda-guide"));
assert.ok(componentSource.includes("<details"));
assert.ok(northStar.includes("Agent-Ready Work Product Principle"));
assert.equal(
  packageJson.scripts?.["check:agent-buyer-preparation-agent-ready-consultation-content"],
  "jiti scripts/checkAgentBuyerPreparationAgentReadyConsultationContent.ts",
);
assert.ok(certification.includes("REIE_AGENT_BUYER_PREPARATION_AGENT_READY_CONTENT_TECHNICALLY_CERTIFIED"));
assert.ok(certification.includes("READY_FOR_EXECUTIVE_BUYER_LIVE_CONSULTATION_UTILITY_REVIEW"));

console.log("AGENT_BUYER_PREPARATION_AGENT_READY_CONSULTATION_CONTENT_CHECK: PASS");
