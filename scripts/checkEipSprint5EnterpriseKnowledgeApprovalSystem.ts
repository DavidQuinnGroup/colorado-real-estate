import assert from "node:assert/strict";
import fs from "node:fs";

import {
  EIP_SPRINT_5_APPROVAL_POLICY,
  EIP_SPRINT_5_APPROVAL_SYSTEM_VERSION,
  buildEipSprint5ApprovalSystemFixtures,
  createApprovalRequest,
  generateAutomatedRecommendation,
  recordApprovalDecision,
  summarizeApprovalStatus,
  validateApprovalRequest,
  validateDecisionAuthority,
} from "../lib/eip/enterpriseKnowledgeApprovalSystem.js";
import { createEipSprint4InternalGeographicActivationReadinessLedger } from "../lib/eip/internalGeographicActivationReadinessLedger.js";

const ledger = createEipSprint4InternalGeographicActivationReadinessLedger();
const fixtures = buildEipSprint5ApprovalSystemFixtures(ledger);
const repeatedFixtures = buildEipSprint5ApprovalSystemFixtures(ledger);

assert.deepEqual(fixtures, repeatedFixtures, "Sprint 5 approval fixtures must be deterministic");
assert.equal(fixtures.requests.length, 10);
assert.equal(fixtures.packets.length, 10);
assert.ok(fixtures.decisions.length >= 11);
assert.equal(fixtures.summary.activeDecisionCount, 0);
assert.equal(fixtures.summary.customerVisibleDecisionCount, 0);
assert.equal(fixtures.summary.runtimeAuthorizedDecisionCount, 0);
assert.equal(fixtures.summary.productionPersistenceAuthorizedCount, 0);

for (const request of fixtures.requests) {
  validateApprovalRequest(request);
  assert.equal(request.requestVersion, EIP_SPRINT_5_APPROVAL_SYSTEM_VERSION);
  assert.ok(request.scopeBoundaries.includes("No activation"));
  assert.ok(request.prohibitedOutcomes.includes("DO_NOT_ACTIVATE_RUNTIME"));
}

for (const packet of fixtures.packets) {
  assert.equal(packet.packetVersion, EIP_SPRINT_5_APPROVAL_SYSTEM_VERSION);
  assert.equal(packet.decisionRequest.actionsThatRemainProhibited.includes("DO_NOT_EXPOSE_TO_CUSTOMERS"), true);
  assert.notEqual(packet.automatedRecommendation, undefined);
  assert.equal(packet.automatedRecommendation, generateAutomatedRecommendation(packet));
}

for (const decision of fixtures.decisions) {
  const request = fixtures.requests.find((item) => item.approvalRequestId === decision.approvalRequestId);
  assert.ok(request, `Missing request for decision ${decision.decisionId}`);
  validateDecisionAuthority(decision, request);
  assert.equal(decision.activationExplicitlyAuthorized, false);
  assert.equal(decision.customerVisibilityAuthorized, false);
  assert.equal(decision.runtimeConsumptionAuthorized, false);
  assert.equal(decision.productionPersistenceAuthorized, false);
  assert.ok(decision.restrictions.length > 0);
  assert.ok(decision.prohibitedActions.length > 0);
}

assertRepresentativeOutcomes();
assertRequiredDecisionRules();
assertAuthorityAndRequestFailures();
assertAuditHistory();
assertSourceIsolation();

console.log(
  `[eip-sprint-5-enterprise-knowledge-approval-system] ok: ${fixtures.requests.length} requests, ${fixtures.packets.length} packets, ${fixtures.decisions.length} decisions, ${fixtures.auditHistory.length} audit events, automated recommendations separated from decisions, activation/customer/runtime/persistence authorization 0, no Prisma/migration/API/runtime imports.`,
);

function assertRepresentativeOutcomes() {
  assertDecision("high-quality municipality", "EIP_SPRINT_5_APPROVAL_REQUEST|001|SEARCH", "SUPERSEDED");
  assertDecision("high-quality replacement", "EIP_SPRINT_5_APPROVAL_REQUEST|001|SEARCH", "APPROVED_FOR_DEFINED_NEXT_STEP");
  assertDecision("Gunbarrel ambiguity", "EIP_SPRINT_5_APPROVAL_REQUEST|002|MAP", "DEFERRED");
  assertDecision("Niwot missing authority", "EIP_SPRINT_5_APPROVAL_REQUEST|004|PRODUCTION_INTERNAL_ONLY_PERSISTENCE", "EVIDENCE_REQUIRED");
  assertDecision("editorial-only rejected", "EIP_SPRINT_5_APPROVAL_REQUEST|009|PUBLIC_PAGE", "REJECTED");
  assertDecision("restricted customer rejected", "EIP_SPRINT_5_APPROVAL_REQUEST|003|CUSTOMER_PRESENTATION", "REJECTED");
  assertDecision("conflict-preserved deferred", "EIP_SPRINT_5_APPROVAL_REQUEST|005|MARKET_ANALYTICS", "DEFERRED");
  assertDecision("alias approved then revoked", "EIP_SPRINT_5_APPROVAL_REQUEST|007|INTERNAL_MAPPING", "REVOKED");
  assertDecision("duplicate rejected", "EIP_SPRINT_5_APPROVAL_REQUEST|008|PROPERTY_RELATIONSHIP", "REJECTED");
  assertDecision("stale or unknown evidence expired", "EIP_SPRINT_5_APPROVAL_REQUEST|006|INTERNAL_MAPPING", "EXPIRED");
  assertDecision("closed without action", "EIP_SPRINT_5_APPROVAL_REQUEST|001|INTERNAL_MAPPING", "CLOSED_WITHOUT_ACTION");
}

function assertRequiredDecisionRules() {
  const readyPacket = requiredPacket("EIP_SPRINT_5_APPROVAL_REQUEST|001|SEARCH");
  assert.equal(readyPacket.readiness.currentGateStatus, "READY_FOR_EXECUTIVE_REVIEW");
  assert.notEqual(readyPacket.automatedRecommendation, "RECOMMEND_APPROVAL_FOR_INTERNAL_PROOF");
  assert.ok(fixtures.decisions.every((decision) => decision.activationExplicitlyAuthorized === false));
  assert.ok(fixtures.decisions.every((decision) => decision.customerVisibilityAuthorized === false));
  assert.ok(fixtures.decisions.every((decision) => decision.runtimeConsumptionAuthorized === false));
  assert.ok(fixtures.decisions.every((decision) => decision.productionPersistenceAuthorized === false));

  const editorialPacket = requiredPacket("EIP_SPRINT_5_APPROVAL_REQUEST|009|PUBLIC_PAGE");
  assert.ok(editorialPacket.readiness.blockingConditions.includes("EDITORIAL_ONLY_BLOCKED_FROM_FACTUAL_ACTIVATION"));
  const restrictedPacket = requiredPacket("EIP_SPRINT_5_APPROVAL_REQUEST|003|CUSTOMER_PRESENTATION");
  assert.ok(restrictedPacket.readiness.blockingConditions.includes("RESTRICTED_KNOWLEDGE_NOT_PUBLICLY_ELIGIBLE"));
  const duplicatePacket = requiredPacket("EIP_SPRINT_5_APPROVAL_REQUEST|008|PROPERTY_RELATIONSHIP");
  assert.ok(duplicatePacket.readiness.blockingConditions.includes("DUPLICATE_CANDIDATE_CANNOT_BECOME_CANONICAL"));
  const conflictPacket = requiredPacket("EIP_SPRINT_5_APPROVAL_REQUEST|005|MARKET_ANALYTICS");
  assert.ok(conflictPacket.readiness.blockingConditions.includes("CONFLICT_OR_DUPLICATE_PRESENT"));

  const summary = summarizeApprovalStatus(fixtures.decisions);
  assert.equal(summary.activationAuthorized, 0);
  assert.equal(summary.customerVisibilityAuthorized, 0);
  assert.equal(summary.runtimeAuthorized, 0);
  assert.equal(summary.productionPersistenceAuthorized, 0);
}

function assertAuthorityAndRequestFailures() {
  const request = fixtures.requests[0];
  const packet = fixtures.packets[0];
  assert.throws(() => validateApprovalRequest({ ...request, scopeBoundaries: [] }), /scope/);
  assert.throws(() => validateApprovalRequest({ ...request, supportingReadinessLedgerEntryIds: [] }), /readiness/);
  assert.throws(() => validateApprovalRequest({ ...request, businessRationale: "" }), /rationale/);

  const invalidDecision = { ...fixtures.decisions[0], decisionId: "EIP_SPRINT_5_INVALID_AUTHORITY", authorityRole: "OPERATOR" as const };
  assert.throws(() => validateDecisionAuthority(invalidDecision, request), /Authority role/);

  assert.throws(() => validateDecisionAuthority({ ...fixtures.decisions[0], decisionRationale: "" }, fixtures.requests[0]), /rationale/);
  assert.throws(() => validateDecisionAuthority({ ...fixtures.decisions[0], activationExplicitlyAuthorized: true as false }, fixtures.requests[0]), /cannot authorize/);
}

function assertAuditHistory() {
  assert.ok(fixtures.auditHistory.length >= fixtures.requests.length * 3);
  for (const request of fixtures.requests) {
    const events = fixtures.auditHistory.filter((event) => event.approvalRequestId === request.approvalRequestId);
    assert.equal(events[0].eventType, "REQUEST_CREATED");
    assert.ok(events.some((event) => event.eventType === "REVIEW_PACKET_GENERATED"));
    assert.deepEqual(events.map((event) => event.immutableSequence), [...events.map((_, index) => index + 1)]);
  }
  assert.ok(fixtures.auditHistory.some((event) => event.eventType === "EXPIRATION_RECORDED"));
  assert.ok(fixtures.auditHistory.some((event) => event.eventType === "REVOCATION_RECORDED"));
  assert.ok(fixtures.auditHistory.some((event) => event.eventType === "SUPERSESSION_RECORDED"));
}

function assertSourceIsolation() {
  const moduleContents = fs.readFileSync("lib/eip/enterpriseKnowledgeApprovalSystem.ts", "utf8");
  assert.equal(/from ["']@prisma\/client["']|from ["']\.\.\/prisma|DATABASE_URL|Supabase|createClient/i.test(moduleContents), false, "Sprint 5 approval system must not require database access");

  const schema = fs.readFileSync("prisma/schema.prisma", "utf8");
  const packageJson = fs.readFileSync("package.json", "utf8");
  assert.ok(packageJson.includes("check:eip-sprint-5-enterprise-knowledge-approval-system"));
  assert.equal(/EipSprint5|EnterpriseKnowledgeApproval|ApprovalDecision/i.test(schema), false);

  const migrationNames = fs.readdirSync("prisma/migrations").join("\n");
  assert.equal(/sprint_5|knowledge_approval|approval_system/i.test(migrationNames), false);

  for (const runtimeRoot of ["app", "components", "lib/search", "lib/mls", "lib/typesense", "lib/alerts", "lib/email", "lib/tracking", "workers"]) {
    if (!fs.existsSync(runtimeRoot)) continue;
    for (const file of listRuntimeSourceFiles(runtimeRoot)) {
      const contents = fs.readFileSync(file, "utf8");
      assert.equal(contents.includes("enterpriseKnowledgeApprovalSystem"), false, `Runtime imports Sprint 5 approval system: ${file}`);
      assert.equal(contents.includes("EIP_SPRINT_5_ENTERPRISE_KNOWLEDGE_APPROVAL_SYSTEM"), false, `Runtime consumes Sprint 5 approval system: ${file}`);
    }
  }
}

function assertDecision(label: string, requestId: string, expectedDecision: string) {
  const decision = fixtures.decisions.find((item) => item.approvalRequestId === requestId && item.decision === expectedDecision);
  assert.ok(decision, `${label} missing decision ${expectedDecision}`);
  assert.equal(decision.activationExplicitlyAuthorized, false);
}

function requiredPacket(requestId: string) {
  const packet = fixtures.packets.find((item) => item.approvalRequestId === requestId);
  assert.ok(packet, `Missing packet ${requestId}`);
  return packet;
}

function listRuntimeSourceFiles(root: string): string[] {
  const entries = fs.readdirSync(root, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const path = `${root}/${entry.name}`;
    if (entry.isDirectory()) {
      files.push(...listRuntimeSourceFiles(path));
    } else if (entry.isFile() && /\.(ts|tsx|js|jsx)$/.test(path)) {
      files.push(path);
    }
  }

  return files;
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/checkEipSprint5EnterpriseKnowledgeApprovalSystem.ts
