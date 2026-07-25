import assert from "node:assert/strict";
import fs from "node:fs";

import {
  buildEipSprint1KnowledgeCandidates,
  createEipSprint1InternalPersistenceStore,
  executeEipSprint1InternalPersistenceProof,
  summarizeEipSprint1PersistenceProof,
  validateEipSprint1InternalRecord,
  type EipSprint1InternalRecord,
} from "../lib/eip/internalGeographicPersistenceProof.js";
import { generateInternalReviewDecisionFixtures } from "../lib/gma/internalReviewDecisionFixture.js";

const decisions = generateInternalReviewDecisionFixtures();
const candidates = buildEipSprint1KnowledgeCandidates(decisions);
const repeatedCandidates = buildEipSprint1KnowledgeCandidates(decisions);
const proof = executeEipSprint1InternalPersistenceProof(decisions);
const repeatedProof = executeEipSprint1InternalPersistenceProof(decisions);
const summary = proof.summary;
const repeatedSummary = summarizeEipSprint1PersistenceProof(repeatedProof.retrieved);

assert.equal(candidates.length, 10, "Sprint 1 must use only the approved 10 decision fixtures");
assert.deepEqual(candidates, repeatedCandidates, "Knowledge candidate generation must be deterministic");
assert.deepEqual(proof.retrieved, repeatedProof.retrieved, "Persistence proof execution must be deterministic");
assert.deepEqual(summary, repeatedSummary, "Summary generation must be idempotent");
assert.equal(summary.recordsPersisted, 10);
assert.equal(summary.recordsRetrieved, 10);
assert.equal(summary.governanceRecordsVerified, 10);
assert.equal(summary.customerVisibleRecords, 0);
assert.equal(summary.propertyRelationshipsCreated, 0);
assert.equal(summary.runtimeEligibleRecords, 0);
assert.equal(summary.productionMappingsCreated, 0);
assert.equal(summary.finalCanonicalSelections, 0);

const decisionIds = new Set(decisions.map((decision) => decision.decisionId));
assert.equal(proof.retrieved.some((record) => !decisionIds.has(record.sourceDecisionId)), false, "Record exists outside approved decision fixtures");
assert.equal(new Set(proof.retrieved.map((record) => record.internalPersistenceId)).size, proof.retrieved.length, "Persistence IDs must be unique");
assert.equal(new Set(proof.retrieved.map((record) => record.sourceDecisionId)).size, proof.retrieved.length, "Decision fixtures must map one-to-one");

for (const record of proof.retrieved) {
  validateEipSprint1InternalRecord(record);
  assert.equal(record.eligibility.internalPersistenceProofEligible, true);
  assert.equal(record.eligibility.customerEligible, false);
  assert.equal(record.eligibility.searchEligible, false);
  assert.equal(record.eligibility.mapEligible, false);
  assert.equal(record.eligibility.publicPageEligible, false);
  assert.equal(record.eligibility.indexingEligible, false);
  assert.equal(record.eligibility.propertyEnrichment, false);
  assert.equal(record.identity.finalCanonicalSelection, false);
  assert.equal(record.mapping.propertyRelationshipCreated, false);
  assert.equal(record.mapping.productionGeographicMappingCreated, false);
  assert.equal(record.governance.noCustomerRetrievalPath, true);
  assert.equal(record.governance.noSearchVisibility, true);
  assert.equal(record.governance.noMapVisibility, true);
  assert.equal(record.governance.noSeoVisibility, true);
  assert.equal(record.governance.noPageVisibility, true);
  assert.equal(record.governance.noRuntimeActivation, true);
  assert.equal(record.governance.noCustomerEligibility, true);
  assert.equal(record.lifecycle.status, "INTERNAL_PROOF_ONLY");
}

assertCase("GMA_DECISION_FIXTURE|V1|001", {
  objectType: "MUNICIPALITY",
  gkcClassification: "PROVISIONAL_KNOWLEDGE",
  mappingEligibility: "INTERNAL_PREVIEW_ONLY",
  trustState: "TRUST_VALIDATED_FOR_INTERNAL_PROOF",
});
assertCase("GMA_DECISION_FIXTURE|V1|002", {
  objectType: "MUNICIPALITY",
  gkcClassification: "PROVISIONAL_KNOWLEDGE",
  mappingEligibility: "ESCALATED",
  trustState: "REQUIRES_AUTHORITATIVE_SOURCE",
});
assertCase("GMA_DECISION_FIXTURE|V1|003", {
  objectType: "MUNICIPALITY",
  gkcClassification: "RESTRICTED_KNOWLEDGE",
  mappingEligibility: "CONFLICT_PRESERVED_ONLY",
  trustState: "CONFLICT_PRESERVED",
});
assertCase("GMA_DECISION_FIXTURE|V1|004", {
  objectType: "MUNICIPALITY",
  gkcClassification: "PROVISIONAL_KNOWLEDGE",
  mappingEligibility: "NEEDS_MORE_EVIDENCE",
  trustState: "REQUIRES_AUTHORITATIVE_SOURCE",
});
assertCase("GMA_DECISION_FIXTURE|V1|005", {
  objectType: "MARKET_AREA",
  gkcClassification: "RESTRICTED_KNOWLEDGE",
  mappingEligibility: "CONFLICT_PRESERVED_ONLY",
  trustState: "CONFLICT_PRESERVED",
});
assertCase("GMA_DECISION_FIXTURE|V1|006", {
  objectType: "NEIGHBORHOOD",
  gkcClassification: "PROVISIONAL_KNOWLEDGE",
  mappingEligibility: "DEFERRED",
  trustState: "DEFERRED_BOUNDARY",
});
assertCase("GMA_DECISION_FIXTURE|V1|007", {
  objectType: "MUNICIPALITY",
  gkcClassification: "PROVISIONAL_KNOWLEDGE",
  mappingEligibility: "ALIAS_CANDIDATE_ONLY",
  trustState: "TRUST_VALIDATED_FOR_INTERNAL_PROOF",
});
assertCase("GMA_DECISION_FIXTURE|V1|008", {
  objectType: "NEIGHBORHOOD",
  gkcClassification: "RESTRICTED_KNOWLEDGE",
  mappingEligibility: "DUPLICATE_CANDIDATE_ONLY",
  trustState: "TRUST_VALIDATED_FOR_INTERNAL_PROOF",
});
assertCase("GMA_DECISION_FIXTURE|V1|009", {
  objectType: "NEIGHBORHOOD",
  gkcClassification: "EDITORIAL_KNOWLEDGE",
  mappingEligibility: "EDITORIAL_ONLY",
  trustState: "EDITORIAL_ONLY_RESTRICTED",
});
assertCase("GMA_DECISION_FIXTURE|V1|010", {
  objectType: "MARKET_AREA",
  gkcClassification: "PROVISIONAL_KNOWLEDGE",
  mappingEligibility: "DEFERRED",
  trustState: "DEFERRED_BOUNDARY",
});

const store = createEipSprint1InternalPersistenceStore();
const first = store.persist(candidates[0]);
assert.deepEqual(store.retrieve(first.internalPersistenceId), first, "Internal retrieval must return the persisted record");
assert.throws(() => store.persist(candidates[0]), /Duplicate internal persistence id/, "Duplicate persistence must fail");
assert.throws(() => store.retrieve("missing"), /not found/, "Missing retrieval must fail closed");
assert.throws(() => validateEipSprint1InternalRecord(mutatedRecord(first, {
  eligibility: { ...first.eligibility, customerEligible: true },
})), /customer eligible/);
assert.throws(() => validateEipSprint1InternalRecord(mutatedRecord(first, {
  mapping: { ...first.mapping, propertyRelationshipCreated: true },
})), /property relationships/);
assert.throws(() => validateEipSprint1InternalRecord(mutatedRecord(first, {
  governance: { ...first.governance, noRuntimeActivation: false },
})), /runtime consumption/);
assert.throws(() => validateEipSprint1InternalRecord(mutatedRecord(first, {
  identity: { ...first.identity, finalCanonicalSelection: true },
})), /final canonical identity/);

const moduleContents = fs.readFileSync("lib/eip/internalGeographicPersistenceProof.ts", "utf8");
assert.equal(/from ["']@prisma\/client["']|from ["']\.\.\/prisma|DATABASE_URL|Supabase|createClient/i.test(moduleContents), false, "Sprint 1 module must not require database access");

const schema = fs.readFileSync("prisma/schema.prisma", "utf8");
const packageJson = fs.readFileSync("package.json", "utf8");
assert.ok(packageJson.includes("check:eip-sprint-1-internal-geographic-persistence-proof"));
assert.equal(/EipSprint1|InternalGeographicPersistenceProof|PersistenceProof/i.test(schema), false);

const migrationNames = fs.readdirSync("prisma/migrations").join("\n");
assert.equal(/eip|internal_geographic_persistence|persistence_proof/i.test(migrationNames), false);

for (const runtimeRoot of ["app", "components", "lib/search", "lib/mls", "lib/typesense", "lib/alerts", "lib/email", "lib/tracking", "workers"]) {
  if (!fs.existsSync(runtimeRoot)) continue;

  for (const file of listRuntimeSourceFiles(runtimeRoot)) {
    const contents = fs.readFileSync(file, "utf8");
    assert.equal(contents.includes("internalGeographicPersistenceProof"), false, `Runtime imports EIP Sprint 1 proof: ${file}`);
    assert.equal(contents.includes("EIP_INTERNAL_GEO_PERSISTENCE"), false, `Runtime consumes EIP Sprint 1 records: ${file}`);
  }
}

console.log(
  `[eip-sprint-1-internal-geographic-persistence-proof] ok: ${summary.recordsPersisted} internal records persisted and retrieved, EKAF classification/source/trust/mapping/persistence/retrieval/governance stages verified, customer visibility ${summary.customerVisibleRecords}, property relationships ${summary.propertyRelationshipsCreated}, runtime eligible ${summary.runtimeEligibleRecords}, production mappings ${summary.productionMappingsCreated}, final canonical selections ${summary.finalCanonicalSelections}, no Prisma/migration changes, no runtime imports.`,
);

function assertCase(
  decisionId: string,
  expected: Pick<EipSprint1InternalRecord["identity"], "objectType"> &
    Pick<EipSprint1InternalRecord["classification"], "gkcClassification"> &
    Pick<EipSprint1InternalRecord["mapping"], "mappingEligibility"> &
    Pick<EipSprint1InternalRecord["trust"], "trustState">,
) {
  const record = proof.retrieved.find((item) => item.sourceDecisionId === decisionId);
  assert.ok(record, `Missing persisted record for ${decisionId}`);
  assert.equal(record.identity.objectType, expected.objectType);
  assert.equal(record.classification.gkcClassification, expected.gkcClassification);
  assert.equal(record.mapping.mappingEligibility, expected.mappingEligibility);
  assert.equal(record.trust.trustState, expected.trustState);
}

function mutatedRecord(
  record: EipSprint1InternalRecord,
  overrides: Record<string, unknown>,
): EipSprint1InternalRecord {
  return { ...record, ...overrides } as EipSprint1InternalRecord;
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
