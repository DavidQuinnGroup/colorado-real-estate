import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { prepareAgentBuyerConsultation } from "../lib/agent-advisory-workbench/agentBuyerConsultationPreparation";
import { AGENT_BUYER_PREPARATION_FIXTURE } from "../lib/agent-advisory-workbench/agentBuyerPreparationAdmissionFixtures";

function source(path: string) {
  return readFileSync(resolve(process.cwd(), path), "utf8");
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
assert.ok(experience.composition);
assert.ok(experience.playbook);
if (!experience.composition || !experience.playbook)
  throw new Error("Expected admitted Buyer composition and professional playbook.");

assert.ok(
  experience.composition.executiveBriefing.text.length <= 1200,
  "Executive briefing must remain a concise first-pass synthesis.",
);
assert.match(experience.composition.executiveBriefing.text, /readiness-focused planning conversation/i);
assert.match(experience.composition.executiveBriefing.text, /reported financing is a preparation boundary/i);

assert.equal(
  experience.playbook.status,
  "REIE_AGENT_BUYER_PREPARATION_PROFESSIONAL_DEPTH_MVV",
);
assert.ok(experience.playbook.sections.length >= 12);
assert.ok(experience.playbook.sections.some((section) => section.level === "CORE"));
assert.ok(experience.playbook.sections.some((section) => section.level === "DETAIL"));
for (const section of experience.playbook.sections) {
  assert.ok(section.id && section.title && section.summary);
  assert.ok(section.prompts.length >= 2, `${section.id} must contain substantive preparation prompts.`);
  assert.ok(section.sourceReferences.length > 0, `${section.id} must retain certified source references.`);
}

for (const id of [
  "buyer-position-readiness",
  "buyer-discovery-questions",
  "financial-readiness",
  "search-strategy",
  "place-geographic-context",
  "current-market-context",
  "property-evaluation-framework",
  "buying-process-roadmap",
  "offer-preparation-education",
  "due-diligence-professional-checkpoints",
  "representation-process-checkpoints",
  "what-could-change-plan",
])
  assert.ok(
    experience.playbook.sections.some((section) => section.id === id),
    `Missing professional playbook section: ${id}`,
  );

for (const id of [
  "financial-readiness",
  "search-strategy",
  "due-diligence-professional-checkpoints",
  "buying-process-roadmap",
])
  assert.equal(
    experience.playbook.sections.find((section) => section.id === id)?.emphasis,
    "SELECTED_PRIORITY",
    `Selected topic must visibly control playbook emphasis: ${id}`,
  );

const place = experience.playbook.sections.find(
  (section) => section.id === "place-geographic-context",
);
assert.ok(place);
assert.match(place.summary, /Louisville is admitted as neutral City orientation/i);
assert.ok(place.prompts.some((prompt) => /city decision/i.test(prompt)));
assert.ok(place.prompts.some((prompt) => /specific property and neighborhood/i.test(prompt)));

const market = experience.playbook.sections.find(
  (section) => section.id === "current-market-context",
);
assert.ok(market);
assert.match(market.summary, /No current market observation is admitted/i);
assert.ok(market.prompts.some((prompt) => /IRES municipality work outside/i.test(prompt)));

const financing = experience.playbook.sections.find(
  (section) => section.id === "financial-readiness",
);
assert.ok(financing);
assert.ok(financing.prompts.some((prompt) => /lender must confirm/i.test(prompt)));
assert.ok(financing.prompts.some((prompt) => /Do not calculate buying power/i.test(prompt)));

const offer = experience.playbook.sections.find(
  (section) => section.id === "offer-preparation-education",
);
assert.ok(offer);
assert.ok(offer.prompts.some((prompt) => /No offer price, escalation, acceptance prediction/i.test(prompt)));

assert.equal(experience.playbook.consultationAgenda.length, 6);
assert.ok(experience.playbook.consultationAgenda.some((step) => /Financing readiness/i.test(step)));
assert.ok(experience.playbook.consultationAgenda.some((step) => /Representation/i.test(step)));
assert.ok(experience.playbook.nextActionPlan.agentActions.length >= 2);
assert.ok(experience.playbook.nextActionPlan.buyerClarifications.length >= 2);
assert.ok(experience.playbook.nextActionPlan.professionalVerification.length >= 1);
assert.ok(
  experience.playbook.nextActionPlan.atlasContinuations.some(
    (action) => action.href === "/agent/prepare/place",
  ),
);
assert.ok(
  experience.playbook.nextActionPlan.atlasContinuations.some(
    (action) => action.href === "/agent/prepare/property",
  ),
);
assert.ok(
  experience.playbook.nextActionPlan.atlasContinuations.every(
    (action) => !action.href || (!action.href.includes("?") && !action.href.includes("#")),
  ),
  "ATLAS continuation actions must not transfer unsupported state.",
);

assert.deepEqual(experience.playbook.protectedBoundaries, {
  customerData: false,
  persistence: false,
  providerActivity: false,
  recommendation: false,
  suitability: false,
  fairHousingInference: false,
  affordabilityConclusion: false,
  qualificationConclusion: false,
});

const playbookSource = source(
  "lib/agent-advisory-workbench/agentBuyerProfessionalPlaybook.ts",
);
const experienceSource = source("components/agent/BuyerConsultationExperience.tsx");
const playbookComponent = source("components/agent/BuyerConsultationPlaybook.tsx");
const sharedRenderer = source("components/agent/AgentBriefingComposition.tsx");
const packageJson = JSON.parse(source("package.json")) as {
  scripts?: Record<string, string>;
};
const certification = source(
  "docs/project-atlas/executive-library/REIE-AGENT-BUYER-PREPARATION-PROFESSIONAL-DEPTH-AND-CONSULTATION-PLAYBOOK-MVV-CERTIFICATION.md",
);

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
  assert.equal(
    playbookSource.includes(forbidden),
    false,
    `Professional playbook must not introduce ${forbidden}.`,
  );

assert.ok(experienceSource.includes("BuyerConsultationPlaybook"));
assert.ok(experienceSource.includes("showNextActions={false}"));
assert.ok(playbookComponent.includes("agent-buyer-professional-playbook"));
assert.ok(playbookComponent.includes("agent-buyer-playbook-detail"));
assert.ok(playbookComponent.includes("ATLAS continuation actions"));
assert.ok(sharedRenderer.includes("showNextActions = true"));
assert.equal(
  packageJson.scripts?.[
    "check:agent-buyer-preparation-professional-depth-and-consultation-playbook"
  ],
  "jiti scripts/checkAgentBuyerPreparationProfessionalDepthAndConsultationPlaybook.ts",
);
assert.ok(
  certification.includes(
    "REIE_AGENT_BUYER_PREPARATION_PROFESSIONAL_DEPTH_TECHNICALLY_CERTIFIED",
  ),
);

console.log("AGENT_BUYER_PREPARATION_PROFESSIONAL_DEPTH_AND_CONSULTATION_PLAYBOOK_CHECK: PASS");
