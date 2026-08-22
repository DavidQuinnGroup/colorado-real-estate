import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  buildAgentBuyerPreparationPacket,
  composeAgentBuyerPreparationBriefing,
} from "../lib/agent-advisory-workbench/agentBuyerPreparationAdmission";
import { AGENT_BUYER_PREPARATION_FIXTURE } from "../lib/agent-advisory-workbench/agentBuyerPreparationAdmissionFixtures";
import { hasMaterialBriefingSection } from "../lib/agent-advisory-workbench/agentBriefingComposition";

const source = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

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

const packet = buildAgentBuyerPreparationPacket(executiveScenario);
const composition = composeAgentBuyerPreparationBriefing(packet);
assert.equal(packet.admission, "ADMITTED");
assert.ok(composition);
if (!composition) throw new Error("Expected an admitted Buyer synthesis composition.");

assert.match(composition.executiveBriefing.text, /readiness-focused planning conversation/i);
assert.match(composition.executiveBriefing.text, /planning checkpoints and steady readiness progression/i);
assert.match(composition.executiveBriefing.text, /Reported financing is a preparation boundary/i);
assert.match(composition.executiveBriefing.text, /Louisville and a single family objective provide an initial search frame/i);
assert.doesNotMatch(composition.executiveBriefing.text, /around buying process, financing readiness, search strategy/i);

assert.equal(hasMaterialBriefingSection(composition.whatCouldChangeInterpretation), true);
for (const id of [
  "buyer-timing-change",
  "buyer-financing-change",
  "buyer-city-change",
  "buyer-property-objective-change",
  "buyer-professional-question-change",
])
  assert.ok(
    composition.whatCouldChangeInterpretation.some((statement) => statement.id === id),
    `Expected supported interpretation-change factor: ${id}`,
  );

const placeAction = composition.nextActions?.find(
  (action) => action.id === "buyer-action-place",
);
const propertyAction = composition.nextActions?.find(
  (action) => action.id === "buyer-action-property",
);
assert.deepEqual(placeAction, {
  id: "buyer-action-place",
  category: "Future ATLAS action",
  text: "Review Louisville in Location Preparation.",
  href: "/agent/prepare/place",
});
assert.equal(propertyAction?.href, "/agent/prepare/property");
assert.ok(
  composition.nextActions?.every(
    (action) => !action.href || (!action.href.includes("?") && !action.href.includes("#")),
  ),
  "Contextual actions must not transfer unsupported state through URLs.",
);

const marketPacket = buildAgentBuyerPreparationPacket({
  ...executiveScenario,
  priorities: ["BUYING_PROCESS", "MARKET_CONTEXT"] as const,
});
const marketComposition = composeAgentBuyerPreparationBriefing(marketPacket);
assert.equal(
  marketComposition?.nextActions?.find(
    (action) => action.id === "buyer-action-market",
  )?.href,
  "/agent/prepare/market",
);

const renderer = source("components/agent/AgentBriefingComposition.tsx");
const buyerExperience = source("components/agent/BuyerConsultationExperience.tsx");
const northStar = source(
  "docs/project-atlas/executive-library/REIE-PRODUCT-EXPERIENCE-NORTH-STAR.md",
);
const certification = source(
  "docs/project-atlas/executive-library/REIE-AGENT-BUYER-PREPARATION-SYNTHESIS-INTERPRETATION-AND-CONTEXTUAL-ACTIONS-MVV-CERTIFICATION.md",
);

assert.ok(renderer.includes("hasInterpretationChanges ?"));
assert.ok(!buyerExperience.includes("Review {experience.cityContext.name} in Location Preparation"));
assert.ok(!buyerExperience.includes("Open Property Preparation when a specific property is in"));
assert.ok(
  northStar.includes("Contextual Capability Action Principle") &&
    northStar.includes("authorized ATLAS capability"),
);
assert.ok(
  certification.includes("SYNTHESIS_RECONCILED") &&
    certification.includes("EMPTY_SECTION_DISCIPLINE"),
);

console.log("AGENT_BUYER_PREPARATION_SYNTHESIS_INTERPRETATION_AND_CONTEXTUAL_ACTIONS_CHECK: PASS");
