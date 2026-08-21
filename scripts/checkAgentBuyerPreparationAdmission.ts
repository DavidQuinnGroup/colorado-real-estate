import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  AGENT_BUYER_FINANCING_BOUNDARIES,
  buildAgentBuyerPreparationPacket,
  composeAgentBuyerPreparationBriefing,
  type AgentBuyerPreparationRequest,
} from "../lib/agent-advisory-workbench/agentBuyerPreparationAdmission";
import { AGENT_BUYER_PREPARATION_FIXTURE } from "../lib/agent-advisory-workbench/agentBuyerPreparationAdmissionFixtures";

const root = resolve(__dirname, "..");

function request(
  overrides: Partial<AgentBuyerPreparationRequest> = {},
): AgentBuyerPreparationRequest {
  return { ...AGENT_BUYER_PREPARATION_FIXTURE, ...overrides };
}

function assertRejected(
  overrides: Partial<AgentBuyerPreparationRequest>,
  reason: string,
) {
  const packet = buildAgentBuyerPreparationPacket(request(overrides));
  assert.equal(packet.admission, "FAIL_CLOSED");
  assert.ok(
    packet.reasons.includes(reason),
    `Expected ${reason}, received ${packet.reasons.join(", ")}`,
  );
  assert.equal(composeAgentBuyerPreparationBriefing(packet), null);
}

const readyPacket = buildAgentBuyerPreparationPacket(request());
assert.equal(readyPacket.admission, "ADMITTED");
assert.equal(readyPacket.readiness, "READY");
assert.deepEqual(readyPacket.protectedBoundaries, {
  customerData: false,
  persistence: false,
  providerActivity: false,
  recommendation: false,
  suitability: false,
  fairHousingInference: false,
  externalAction: false,
});

const composition = composeAgentBuyerPreparationBriefing(readyPacket);
assert.ok(composition);
assert.equal(composition.surface, "BUYER");
assert.equal(composition.protectedBoundaries.customerData, false);
assert.equal(composition.protectedBoundaries.persistence, false);
assert.equal(composition.protectedBoundaries.providerActivity, false);
assert.equal(composition.protectedBoundaries.recommendation, false);
assert.equal(composition.protectedBoundaries.suitability, false);
assert.equal(composition.protectedBoundaries.fairHousingInference, false);
assert.ok(
  composition.professionalCheckpoints.some(
    (checkpoint) => checkpoint.role === "LENDER",
  ),
);
assert.ok(
  composition.professionalCheckpoints.some((checkpoint) =>
    checkpoint.question.includes("brokerage"),
  ),
);

assert.equal(
  AGENT_BUYER_FINANCING_BOUNDARIES.interestRates,
  "LENDER_VERIFICATION",
);
assert.equal(
  AGENT_BUYER_FINANCING_BOUNDARIES.qualification,
  "LENDER_VERIFICATION",
);
assert.equal(
  AGENT_BUYER_FINANCING_BOUNDARIES.preapproval,
  "CLIENT_REPORTED_CONTEXT",
);
assert.equal(
  AGENT_BUYER_FINANCING_BOUNDARIES.affordability,
  "NOT_AUTHORIZED_FOR_P0",
);
assert.equal(
  AGENT_BUYER_FINANCING_BOUNDARIES.lenderSelection,
  "NOT_AUTHORIZED_FOR_P0",
);

assertRejected(
  { protectedClassRequest: true },
  "FAIR_HOUSING_REQUEST_PROHIBITED",
);
assertRejected(
  { schoolQualityRequest: true },
  "FAIR_HOUSING_REQUEST_PROHIBITED",
);
assertRejected({ safetyRequest: true }, "FAIR_HOUSING_REQUEST_PROHIBITED");
assertRejected({ customerContext: true }, "PROTECTED_CONTEXT_PROHIBITED");
assertRejected({ persistenceRequested: true }, "PROTECTED_CONTEXT_PROHIBITED");
assertRejected(
  { providerRuntimeRequired: true },
  "PROTECTED_CONTEXT_PROHIBITED",
);
assertRejected({ adminContext: true }, "PROTECTED_CONTEXT_PROHIBITED");
assertRejected({ mcpContext: true }, "PROTECTED_CONTEXT_PROHIBITED");
assertRejected(
  { affordabilityConclusionRequested: true },
  "PROFESSIONAL_CONCLUSION_PROHIBITED",
);
assertRejected(
  { loanRecommendationRequested: true },
  "PROFESSIONAL_CONCLUSION_PROHIBITED",
);
assertRejected(
  { legalConclusionRequested: true },
  "PROFESSIONAL_CONCLUSION_PROHIBITED",
);
assertRejected(
  { representationRequirementClaimRequested: true },
  "PROFESSIONAL_CONCLUSION_PROHIBITED",
);
assertRejected({ stage: "OTHER" as never }, "GOVERNED_BUYER_STAGE_REQUIRED");
assertRejected(
  { marketContext: "OTHER" as never },
  "GOVERNED_MARKET_CONTEXT_REQUIRED",
);

const limitedPacket = buildAgentBuyerPreparationPacket(
  request({
    certifiedCity: null,
    financingStatus: null,
    marketContext: "STALE_OR_UNKNOWN",
  }),
);
assert.equal(limitedPacket.admission, "ADMITTED");
assert.equal(limitedPacket.readiness, "READY_WITH_LIMITATIONS");
assert.deepEqual(limitedPacket.limitations, [
  "FINANCING_STATUS_NOT_DISCLOSED",
  "PLACE_CONTEXT_NOT_SELECTED",
  "STALE_MARKET_CONTEXT_OMITTED",
]);

const admissionSource = readFileSync(
  resolve(
    root,
    "lib/agent-advisory-workbench/agentBuyerPreparationAdmission.ts",
  ),
  "utf8",
);
for (const forbiddenToken of [
  "fetch(",
  "prisma",
  "createClient",
  "localStorage",
  "sessionStorage",
  "REIE_AGENT_CREDENTIAL",
]) {
  assert.equal(
    admissionSource.includes(forbiddenToken),
    false,
    `Forbidden runtime or secret dependency: ${forbiddenToken}`,
  );
}

assert.equal(
  existsSync(resolve(root, "app/agent/prepare/buyer/page.tsx")),
  false,
  "Buyer experience must not be introduced by this admission MVV",
);
const adminAuthSource = readFileSync(
  resolve(root, "lib/admin/adminAuth.ts"),
  "utf8",
);
assert.equal(
  adminAuthSource.includes("'/agent/prepare/buyer'"),
  false,
  "Admission must not alter active authorization visibility",
);

console.log("AGENT_BUYER_PREPARATION_ADMISSION_CHECK: PASS");
