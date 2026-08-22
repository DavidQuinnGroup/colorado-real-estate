import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  AGENT_BUYER_TIMING_OPTIONS,
  buildAgentBuyerPreparationPacket,
  composeAgentBuyerPreparationBriefing,
} from "../lib/agent-advisory-workbench/agentBuyerPreparationAdmission";
import { AGENT_BUYER_PREPARATION_FIXTURE } from "../lib/agent-advisory-workbench/agentBuyerPreparationAdmissionFixtures";
import { prepareAgentBuyerConsultation } from "../lib/agent-advisory-workbench/agentBuyerConsultationPreparation";
import { sanitizeAgentReturnPath } from "../lib/admin/adminAuth";

function source(path: string) {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

const page = source("app/agent/prepare/buyer/page.tsx");
const experience = source("components/agent/BuyerConsultationExperience.tsx");
const adapter = source(
  "lib/agent-advisory-workbench/agentBuyerConsultationPreparation.ts",
);
const renderer = source("components/agent/AgentBriefingComposition.tsx");
const auth = source("lib/admin/adminAuth.ts");
const middleware = source("middleware.ts");
const agentShell = source("components/agent/AgentWorkspaceShell.tsx");
const publicBuyerPage = source("app/buy/page.tsx");
const marketPage = source("app/agent/prepare/market/page.tsx");
const placePage = source("app/agent/prepare/place/page.tsx");
const propertyPage = source("app/agent/prepare/property/page.tsx");
const buyerAdmission = source(
  "lib/agent-advisory-workbench/agentBuyerPreparationAdmission.ts",
);
const productNorthStar = source(
  "docs/project-atlas/executive-library/REIE-PRODUCT-EXPERIENCE-NORTH-STAR.md",
);
const certification = source(
  "docs/project-atlas/executive-library/REIE-AGENT-BUYER-PREPARATION-HUMAN-LANGUAGE-AND-SAME-PAGE-DECISION-CONTINUITY-MVV-CERTIFICATION.md",
);
const packageJson = JSON.parse(source("package.json")) as {
  scripts?: Record<string, string>;
};

const ready = prepareAgentBuyerConsultation(AGENT_BUYER_PREPARATION_FIXTURE);
assert.equal(ready.packet.admission, "ADMITTED");
assert.equal(ready.humanState.label, "Ready for your review");
assert.equal(ready.composition?.surface, "BUYER");
assert.ok((ready.composition?.questionsWorthAsking.length || 0) >= 3);
assert.ok((ready.composition?.questionsWorthAsking.length || 0) <= 5);
assert.ok((ready.composition?.nextActions?.length || 0) >= 1);
assert.ok((ready.composition?.nextActions?.length || 0) <= 5);
assert.equal(ready.packet.protectedBoundaries.customerData, false);
assert.equal(ready.packet.protectedBoundaries.persistence, false);
assert.equal(ready.packet.protectedBoundaries.providerActivity, false);
assert.equal(ready.packet.protectedBoundaries.recommendation, false);
assert.equal(ready.packet.protectedBoundaries.suitability, false);
assert.equal(ready.packet.protectedBoundaries.fairHousingInference, false);
assert.ok(ready.cityContext?.summary);

assert.equal(AGENT_BUYER_TIMING_OPTIONS.length, 6);
assert.deepEqual(
  AGENT_BUYER_TIMING_OPTIONS.map((option) => option.label),
  [
    "Just exploring",
    "Within 3 months",
    "3-6 months",
    "6-12 months",
    "More than 12 months",
    "Timing not decided yet",
  ],
);
for (const option of AGENT_BUYER_TIMING_OPTIONS) {
  const packet = buildAgentBuyerPreparationPacket({
    ...AGENT_BUYER_PREPARATION_FIXTURE,
    timing: option.value,
  });
  const composition = composeAgentBuyerPreparationBriefing(packet);
  assert.equal(packet.admission, "ADMITTED");
  assert.ok(composition?.executiveBriefing.text.includes(option.briefingFocus));
  assert.ok(
    composition?.keyEvidence.some(
      (evidence) =>
        evidence.id === "buyer-timing" && evidence.value === option.label,
    ),
  );
  assert.ok(
    composition?.nextActions?.some((action) => action.text === option.nextAction),
  );
}
assert.equal(
  buildAgentBuyerPreparationPacket({
    ...AGENT_BUYER_PREPARATION_FIXTURE,
    timing: "NEAR_TERM" as never,
  }).admission,
  "FAIL_CLOSED",
);

const missingStage = prepareAgentBuyerConsultation({
  ...AGENT_BUYER_PREPARATION_FIXTURE,
  stage: "OTHER" as never,
});
assert.equal(missingStage.packet.admission, "FAIL_CLOSED");
assert.equal(
  missingStage.humanState.label,
  "Complete the consultation choices",
);
const prohibited = prepareAgentBuyerConsultation({
  ...AGENT_BUYER_PREPARATION_FIXTURE,
  protectedClassRequest: true,
});
assert.equal(prohibited.packet.admission, "FAIL_CLOSED");
assert.equal(prohibited.humanState.label, "Buyer preparation unavailable");

assert.ok(
  existsSync(resolve(process.cwd(), "app/agent/prepare/buyer/page.tsx")),
);
assert.ok(page.includes("BuyerConsultationExperience"));
assert.ok(
  adapter.includes("buildAgentBuyerPreparationPacket") &&
    adapter.includes("composeAgentBuyerPreparationBriefing"),
);
assert.ok(
  !adapter.match(
    /fetch\(|prisma\.|createClient\(|localStorage|sessionStorage|document\.cookie/,
  ),
);

for (const marker of [
  "agent-buyer-consultation-experience",
  "agent-buyer-empty-state",
  "agent-buyer-prepare-briefing",
  "agent-buyer-briefing",
  "BUYER PREPARATION",
  "Prepare for a buyer consultation",
  "Consultation objective",
  "Buyer journey position",
  "Use only what was stated",
  "Starting the buyer conversation",
  "Preparing for an active search",
  "When might they want to buy?",
  "What is known about financing?",
  "Update my briefing",
  "agent-buyer-briefing-update-state",
  'data-persistence="false"',
  'data-customer-data="false"',
  'data-provider-activity="false"',
  'data-recommendation="false"',
  'data-suitability="false"',
  'data-fair-housing-inference="false"',
  'data-same-page-decision-continuity="true"',
])
  assert.ok(
    experience.includes(marker),
    `Missing Buyer experience marker: ${marker}`,
  );
assert.ok(
  renderer.includes("Questions worth asking") &&
    renderer.includes("Next actions"),
  "Buyer output must use the shared questions and next-actions renderer.",
);
for (const legacyTimingLabel of ["Near term", "Flexible", "Still unknown"])
  assert.equal(
    experience.includes(`"${legacyTimingLabel}"`),
    false,
    `Ambiguous legacy timing label remains visible: ${legacyTimingLabel}`,
  );
assert.ok(
  experience.includes("markBriefingForUpdate") &&
    experience.includes("briefingNeedsUpdate") &&
    experience.includes("setPreparedRequest"),
  "Buyer selections must remain editable and regenerate the same-page briefing.",
);
assert.equal(experience.includes("useRouter"), false);
assert.equal(experience.includes("router.push"), false);
assert.equal(experience.includes("window.location"), false);
assert.ok(
  !buyerAdmission.includes('"NEAR_TERM"') &&
    !buyerAdmission.includes('"FLEXIBLE"'),
  "The bounded timing contract must not retain ambiguous internal values.",
);
assert.ok(
  productNorthStar.includes("Same-Page Decision Continuity Principle") &&
    productNorthStar.includes("CHOOSE -> SEE -> UNDERSTAND -> ADJUST -> SEE THE EFFECT"),
  "The Product Experience North Star must govern same-page decision continuity.",
);
assert.ok(
  certification.includes("Human Language and Same-Page Decision Continuity") &&
    certification.includes("six-state model"),
  "Certification must record the bounded Buyer usability update.",
);

for (const forbidden of [
  "localStorage",
  "sessionStorage",
  "document.cookie",
  "fetch(",
  "XMLHttpRequest",
  "sendBeacon",
  "CRM",
  "customerName",
  "leadId",
  "MLS_GRID",
  "IRES",
  "ATTOM",
  "LightBox",
  "school ranking",
  "safety score",
  "family friendly",
  "recommendation score",
  'data-suitability="true"',
])
  assert.equal(
    experience.includes(forbidden),
    false,
    `Buyer experience must not introduce ${forbidden}.`,
  );

assert.ok(
  auth.includes(
    "surface('/agent/prepare/buyer', 'BROWSER_ADMIN_PAGE', ['HUMAN_AGENT'], ['AGENT'], ['HUMAN_AGENT_SESSION'], 'READ_ONLY'",
  ),
);
assert.ok(!auth.includes("surface('/agent/:path*'"));
assert.ok(
  middleware.includes('pathname === "/agent/prepare/buyer"') &&
    middleware.includes("buildAgentLoginRedirect"),
);
assert.equal(
  sanitizeAgentReturnPath("/agent/prepare/buyer"),
  "/agent/prepare/buyer",
);
assert.equal(
  sanitizeAgentReturnPath("/agent/prepare/unknown"),
  "/agent/prepare/market",
);
assert.ok(
  agentShell.includes('href="/agent/prepare/buyer"') &&
    agentShell.includes("Buyer Preparation"),
);
for (const retained of [
  "/agent/prepare/market",
  "/agent/prepare/place",
  "/agent/prepare/property",
])
  assert.ok(agentShell.includes(`href="${retained}"`));
assert.ok(publicBuyerPage.includes("Buyer"));
assert.ok(marketPage.includes("MarketConversationExperience"));
assert.ok(placePage.includes("PlaceConversationExperience"));
assert.ok(propertyPage.includes("PropertyConversationExperience"));
assert.equal(
  packageJson.scripts?.[
    "check:agent-buyer-consultation-preparation-experience"
  ],
  "jiti scripts/checkAgentBuyerConsultationPreparationExperience.ts",
);

console.log("AGENT_BUYER_CONSULTATION_PREPARATION_EXPERIENCE_CHECK: PASS");
