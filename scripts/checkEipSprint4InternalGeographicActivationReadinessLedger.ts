import assert from "node:assert/strict";
import fs from "node:fs";

import {
  EIP_SPRINT_4_ACTIVATION_GATES,
  EIP_SPRINT_4_EVALUATION_TIMESTAMP,
  EIP_SPRINT_4_LEDGER_VERSION,
  createEipSprint4InternalGeographicActivationReadinessLedger,
  validateEipSprint4LedgerEntry,
  type EipSprint4ActivationGate,
  type EipSprint4LedgerEntry,
} from "../lib/eip/internalGeographicActivationReadinessLedger.js";

const ledger = createEipSprint4InternalGeographicActivationReadinessLedger();
const repeatedLedger = createEipSprint4InternalGeographicActivationReadinessLedger();

assert.deepEqual(ledger, repeatedLedger, "Sprint 4 ledger output must be deterministic across repeated execution");
assert.equal(ledger.entries.length, 120, "Sprint 4 must evaluate 10 records across 12 gates");
assert.equal(ledger.objectSummaries.length, 10);
assert.equal(ledger.gateSummaries.length, 12);
assert.equal(ledger.history.length, 1);
assert.equal(ledger.history[0].ledgerVersion, EIP_SPRINT_4_LEDGER_VERSION);
assert.equal(ledger.history[0].deterministicEvaluationTimestamp, EIP_SPRINT_4_EVALUATION_TIMESTAMP);

for (const entry of ledger.entries) {
  validateEipSprint4LedgerEntry(entry);
  assert.equal(entry.ledgerVersion, EIP_SPRINT_4_LEDGER_VERSION);
  assert.equal(entry.deterministicEvaluationTimestamp, EIP_SPRINT_4_EVALUATION_TIMESTAMP);
  assert.equal(entry.authorizationStatus, "NOT_AUTHORIZED");
  assert.equal(entry.authorized, false);
  assert.equal(entry.active, false);
  assert.notEqual(entry.gateStatus, "NOT_EVALUATED");
  assert.equal(entry.requirementsEvaluated.length, 32);
  assert.ok(entry.supportingEvidenceReferences.some((item) => item.startsWith("read-model:")));
  assert.ok(entry.supportingEvidenceReferences.some((item) => item.startsWith("quality:")));
  assert.ok(entry.prohibitedActions.includes("DO_NOT_PRESENT_TO_CUSTOMERS"));
}

assertGateCoverage();
assertRepresentativeCases();
assertRequiredRules();
assertSourceIsolation();

console.log(
  `[eip-sprint-4-internal-geographic-activation-readiness-ledger] ok: ${ledger.entries.length} ledger entries across ${EIP_SPRINT_4_ACTIVATION_GATES.length} gates, authorization defaults NOT_AUTHORIZED, active entries 0, customer/runtime/search/map/property/indexing/AI activation 0, deterministic versioned history verified.`,
);

function assertGateCoverage() {
  for (const gate of EIP_SPRINT_4_ACTIVATION_GATES) {
    const entries = ledger.entries.filter((entry) => entry.gate === gate);
    assert.equal(entries.length, 10, `Expected 10 entries for gate ${gate}`);
    assert.equal(entries.filter((entry) => entry.authorized).length, 0);
    assert.equal(entries.filter((entry) => entry.active).length, 0);
  }
}

function assertRepresentativeCases() {
  assertEntry("strong municipality preview candidate", "EIP_INTERNAL_GEO_PERSISTENCE|SPRINT_1|001", "INTERNAL_DEVELOPMENT_PERSISTENCE", "INTERNAL_PROOF_COMPLETE");
  assertEntry("quality ready remains externally unauthorized", "EIP_INTERNAL_GEO_PERSISTENCE|SPRINT_1|001", "SEARCH", "READY_FOR_EXECUTIVE_REVIEW");
  assertEntry("editorial-only record", "EIP_INTERNAL_GEO_PERSISTENCE|SPRINT_1|009", "PUBLIC_PAGE", "BLOCKED", "EDITORIAL_ONLY_BLOCKED_FROM_FACTUAL_ACTIVATION");
  assertEntry("restricted record", "EIP_INTERNAL_GEO_PERSISTENCE|SPRINT_1|003", "CUSTOMER_PRESENTATION", "BLOCKED", "RESTRICTED_KNOWLEDGE_NOT_PUBLICLY_ELIGIBLE");
  assertEntry("conflict-preserved record", "EIP_INTERNAL_GEO_PERSISTENCE|SPRINT_1|005", "MARKET_ANALYTICS", "BLOCKED", "CONFLICT_OR_DUPLICATE_PRESENT");
  assertEntry("ambiguous object-type record", "EIP_INTERNAL_GEO_PERSISTENCE|SPRINT_1|002", "MAP", "NEEDS_REVIEW", "AMBIGUOUS_MAPPING_REQUIRES_REVIEW");
  assertEntry("missing-authority record", "EIP_INTERNAL_GEO_PERSISTENCE|SPRINT_1|004", "PRODUCTION_INTERNAL_ONLY_PERSISTENCE", "EVIDENCE_INCOMPLETE", "MISSING_OR_INSUFFICIENT_SOURCE");
  assertEntry("deferred boundary record", "EIP_INTERNAL_GEO_PERSISTENCE|SPRINT_1|006", "INTERNAL_MAPPING", "EVIDENCE_INCOMPLETE");
  assertEntry("alias candidate", "EIP_INTERNAL_GEO_PERSISTENCE|SPRINT_1|007", "INTERNAL_RETRIEVAL", "INTERNAL_PROOF_COMPLETE");
  assertEntry("duplicate candidate", "EIP_INTERNAL_GEO_PERSISTENCE|SPRINT_1|008", "PROPERTY_RELATIONSHIP", "BLOCKED", "DUPLICATE_CANDIDATE_CANNOT_BECOME_CANONICAL");
}

function assertRequiredRules() {
  const readySearch = requiredEntry("EIP_INTERNAL_GEO_PERSISTENCE|SPRINT_1|001", "SEARCH");
  assert.equal(readySearch.qualityEngineResult, "READY");
  assert.equal(readySearch.authorizationStatus, "NOT_AUTHORIZED", "Quality READY must not grant authorization");
  assert.equal(readySearch.active, false);

  const editorialEntries = entriesFor("EIP_INTERNAL_GEO_PERSISTENCE|SPRINT_1|009");
  assert.ok(editorialEntries.some((entry) => entry.blockingConditions.includes("EDITORIAL_ONLY_BLOCKED_FROM_FACTUAL_ACTIVATION")));

  const restrictedEntries = entriesFor("EIP_INTERNAL_GEO_PERSISTENCE|SPRINT_1|003").filter((entry) => customerGate(entry.gate));
  assert.ok(restrictedEntries.every((entry) => entry.authorizationStatus === "NOT_AUTHORIZED"));
  assert.ok(restrictedEntries.every((entry) => entry.blockingConditions.includes("RESTRICTED_KNOWLEDGE_NOT_PUBLICLY_ELIGIBLE")));

  const conflictEntries = entriesFor("EIP_INTERNAL_GEO_PERSISTENCE|SPRINT_1|003").filter((entry) => customerGate(entry.gate));
  assert.ok(conflictEntries.every((entry) => entry.blockingConditions.includes("CONFLICT_OR_DUPLICATE_PRESENT")));

  const missingSource = requiredEntry("EIP_INTERNAL_GEO_PERSISTENCE|SPRINT_1|004", "CUSTOMER_PRESENTATION");
  assert.ok(missingSource.blockingConditions.includes("MISSING_OR_INSUFFICIENT_SOURCE"));

  const ambiguous = requiredEntry("EIP_INTERNAL_GEO_PERSISTENCE|SPRINT_1|002", "MAP");
  assert.ok(ambiguous.blockingConditions.includes("AMBIGUOUS_MAPPING_REQUIRES_REVIEW"));

  const duplicate = requiredEntry("EIP_INTERNAL_GEO_PERSISTENCE|SPRINT_1|008", "SEARCH");
  assert.ok(duplicate.blockingConditions.includes("DUPLICATE_CANDIDATE_CANNOT_BECOME_CANONICAL"));

  const productionPersistence = requiredEntry("EIP_INTERNAL_GEO_PERSISTENCE|SPRINT_1|001", "PRODUCTION_INTERNAL_ONLY_PERSISTENCE");
  assert.equal(productionPersistence.gateStatus, "READY_FOR_EXECUTIVE_REVIEW");
  assert.equal(productionPersistence.authorizationStatus, "NOT_AUTHORIZED");

  assert.equal(ledger.entries.filter((entry) => entry.active).length, 0);
  assert.equal(ledger.entries.filter((entry) => entry.authorized).length, 0);
  assert.ok(ledger.history[0].entryCount === ledger.entries.length);
}

function assertSourceIsolation() {
  const moduleContents = fs.readFileSync("lib/eip/internalGeographicActivationReadinessLedger.ts", "utf8");
  assert.equal(/from ["']@prisma\/client["']|from ["']\.\.\/prisma|DATABASE_URL|Supabase|createClient/i.test(moduleContents), false, "Sprint 4 ledger must not require database access");

  const schema = fs.readFileSync("prisma/schema.prisma", "utf8");
  const packageJson = fs.readFileSync("package.json", "utf8");
  assert.ok(packageJson.includes("check:eip-sprint-4-internal-geographic-activation-readiness-ledger"));
  assert.equal(/EipSprint4|ActivationReadinessLedger|ReadinessLedger/i.test(schema), false);

  const migrationNames = fs.readdirSync("prisma/migrations").join("\n");
  assert.equal(/sprint_4|activation_readiness|readiness_ledger/i.test(migrationNames), false);

  for (const runtimeRoot of ["app", "components", "lib/search", "lib/mls", "lib/typesense", "lib/alerts", "lib/email", "lib/tracking", "workers"]) {
    if (!fs.existsSync(runtimeRoot)) continue;
    for (const file of listRuntimeSourceFiles(runtimeRoot)) {
      const contents = fs.readFileSync(file, "utf8");
      assert.equal(contents.includes("internalGeographicActivationReadinessLedger"), false, `Runtime imports Sprint 4 ledger: ${file}`);
      assert.equal(contents.includes("EIP_SPRINT_4_INTERNAL_GEOGRAPHIC_ACTIVATION_READINESS_LEDGER"), false, `Runtime consumes Sprint 4 ledger: ${file}`);
    }
  }
}

function assertEntry(
  label: string,
  id: string,
  gate: EipSprint4ActivationGate,
  expectedStatus: EipSprint4LedgerEntry["gateStatus"],
  expectedBlocker?: string,
) {
  const entry = requiredEntry(id, gate);
  assert.equal(entry.gateStatus, expectedStatus, `${label} expected ${expectedStatus}`);
  assert.equal(entry.authorizationStatus, "NOT_AUTHORIZED");
  assert.equal(entry.active, false);
  if (expectedBlocker) assert.ok(entry.blockingConditions.includes(expectedBlocker), `${label} missing blocker ${expectedBlocker}`);
}

function requiredEntry(id: string, gate: EipSprint4ActivationGate): EipSprint4LedgerEntry {
  const entry = ledger.entries.find((item) => item.knowledgeObjectId === id && item.gate === gate);
  assert.ok(entry, `Missing ledger entry ${id} ${gate}`);
  return entry;
}

function entriesFor(id: string): readonly EipSprint4LedgerEntry[] {
  return ledger.entries.filter((entry) => entry.knowledgeObjectId === id);
}

function customerGate(gate: EipSprint4ActivationGate) {
  return ["PROPERTY_RELATIONSHIP", "SEARCH", "MAP", "PUBLIC_PAGE", "INDEXING", "MARKET_ANALYTICS", "CUSTOMER_PRESENTATION", "AI_ASSISTED_SYNTHESIS"].includes(gate);
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

// /Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/checkEipSprint4InternalGeographicActivationReadinessLedger.ts
