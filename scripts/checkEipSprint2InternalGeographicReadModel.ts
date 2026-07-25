import assert from "node:assert/strict";
import fs from "node:fs";

import {
  EIP_SPRINT_2_READ_MODEL_VERSION,
  EIP_SPRINT_2_RETRIEVAL_TIMESTAMP,
  createEipSprint2InternalGeographicReadModel,
  toReadModelView,
  validateEipSprint2ReadModelView,
  type EipSprint2InternalGeographicView,
} from "../lib/eip/internalGeographicReadModel.js";
import { executeEipSprint1InternalPersistenceProof } from "../lib/eip/internalGeographicPersistenceProof.js";

const sprint1Proof = executeEipSprint1InternalPersistenceProof();
const readModel = createEipSprint2InternalGeographicReadModel(sprint1Proof.retrieved);
const repeatedReadModel = createEipSprint2InternalGeographicReadModel(sprint1Proof.retrieved);
const allViews = readModel.listAll();
const repeatedViews = repeatedReadModel.listAll();

assert.equal(allViews.length, 10, "Sprint 2 must read only the Sprint 1 fixture records");
assert.deepEqual(allViews, repeatedViews, "Read model output must be deterministic");
assert.deepEqual(allViews, sprint1Proof.retrieved.map(toReadModelView), "Read model must be derived from Sprint 1 records");

for (const view of allViews) {
  validateEipSprint2ReadModelView(view);
  assert.equal(view.metadata.internalVersion, EIP_SPRINT_2_READ_MODEL_VERSION);
  assert.equal(view.metadata.retrievalTimestamp, EIP_SPRINT_2_RETRIEVAL_TIMESTAMP);
  assert.equal(view.metadata.retrievalStatus, "FOUND");
  assert.equal(view.identity.displayName, view.identity.canonicalName);
  assert.equal(view.governance.lifecycle, "INTERNAL_PROOF_ONLY");
  assert.equal(view.governance.editorialSeparationEnforced, true);
  assert.equal(view.governance.restrictedKnowledgeInternalOnly, true);
  assert.equal(view.governance.noCustomerRetrievalPath, true);
  assert.equal(view.governance.noSearchVisibility, true);
  assert.equal(view.governance.noMapVisibility, true);
  assert.equal(view.governance.noSeoVisibility, true);
  assert.equal(view.governance.noPageVisibility, true);
  assert.equal(view.governance.noRuntimeActivation, true);
  assert.equal(view.governance.noPersistenceMutation, true);
  assert.equal(view.governance.eligibility.customerEligible, false);
  assert.equal(view.governance.eligibility.searchEligible, false);
  assert.equal(view.governance.eligibility.mapEligible, false);
  assert.equal(view.governance.eligibility.publicPageEligible, false);
  assert.equal(view.governance.eligibility.indexingEligible, false);
  assert.equal(view.governance.eligibility.propertyEnrichment, false);
  assert.equal(view.relationships.relatedObservations.length, 3);
}

assertRetrievalByInternalId();
assertRetrievalByCanonicalName();
assertRetrievalByAlias();
assertRetrievalByObjectType();
assertRepresentativeGovernancePropagation();
assertFailureModes();
assertSourceIsolation();

console.log(
  `[eip-sprint-2-internal-geographic-read-model] ok: ${allViews.length} internal geographic views returned through stable contract, retrieval by id/name/alias/type verified, governance/trust/source propagation passed, runtime visibility 0, property consumption 0, persistence mutations 0, no Prisma/migration/API/runtime imports.`,
);

function assertRetrievalByInternalId() {
  const first = readModel.retrieveByInternalId("EIP_INTERNAL_GEO_PERSISTENCE|SPRINT_1|001");
  assert.equal(first.retrievalStatus, "FOUND");
  assert.ok(first.result);
  assert.equal(first.result.identity.canonicalName, "Thornton");
  assert.equal(first.result.identity.objectType, "MUNICIPALITY");
}

function assertRetrievalByCanonicalName() {
  const gunbarrel = readModel.retrieveByCanonicalName("gunbarrel");
  assert.equal(gunbarrel.retrievalStatus, "FOUND");
  assert.ok(gunbarrel.result);
  assert.equal(gunbarrel.result.identity.canonicalName, "Gunbarrel");
  assert.equal(gunbarrel.result.trust.authority, "REQUIRES_AUTHORITY_REVIEW");
}

function assertRetrievalByAlias() {
  const boulder = readModel.retrieveByAlias("alias:Boulder");
  assert.equal(boulder.retrievalStatus, "FOUND");
  assert.ok(boulder.result);
  assert.equal(boulder.result.identity.canonicalName, "Boulder");
  assert.equal(boulder.result.classification.intelligenceDomain, "GEOGRAPHIC_ALIAS");

  const duplicate = readModel.retrieveByAlias("duplicate:boulder / Mapleton Hill");
  assert.equal(duplicate.retrievalStatus, "RESTRICTED_INTERNAL_ONLY");
  assert.ok(duplicate.result);
  assert.equal(duplicate.result.governance.mappingEligibility, "DUPLICATE_CANDIDATE_ONLY");
}

function assertRetrievalByObjectType() {
  const municipalities = readModel.retrieveByObjectType("MUNICIPALITY");
  assert.equal(municipalities.retrievalStatus, "FOUND");
  assert.equal(municipalities.results.length, 5);
  assert.equal(municipalities.results.every((view) => view.identity.objectType === "MUNICIPALITY"), true);

  const zipCodes = readModel.retrieveByObjectType("ZIP_CODE");
  assert.equal(zipCodes.retrievalStatus, "NOT_FOUND");
  assert.equal(zipCodes.results.length, 0);
}

function assertRepresentativeGovernancePropagation() {
  assertView("EIP_INTERNAL_GEO_PERSISTENCE|SPRINT_1|001", {
    knowledgeClassification: "PROVISIONAL_KNOWLEDGE",
    intelligenceDomain: "GEOGRAPHIC_IDENTITY",
    authority: "INTERNAL_PROOF_ONLY",
    confidence: "MEDIUM",
    freshness: "FRESH",
  });
  assertView("EIP_INTERNAL_GEO_PERSISTENCE|SPRINT_1|003", {
    knowledgeClassification: "RESTRICTED_KNOWLEDGE",
    intelligenceDomain: "GEOGRAPHIC_IDENTITY",
    authority: "CONFLICT_PRESERVED",
    confidence: "LOW",
    freshness: "FRESH",
  });
  assertView("EIP_INTERNAL_GEO_PERSISTENCE|SPRINT_1|006", {
    knowledgeClassification: "PROVISIONAL_KNOWLEDGE",
    intelligenceDomain: "GEOGRAPHIC_BOUNDARY",
    authority: "REQUIRES_AUTHORITY_REVIEW",
    confidence: "LOW",
    freshness: "UNKNOWN",
  });
  assertView("EIP_INTERNAL_GEO_PERSISTENCE|SPRINT_1|009", {
    knowledgeClassification: "EDITORIAL_KNOWLEDGE",
    intelligenceDomain: "GEOGRAPHIC_EDITORIAL_CONTEXT",
    authority: "EDITORIAL_ONLY",
    confidence: "INSUFFICIENT",
    freshness: "NOT_APPLICABLE",
  });
}

function assertFailureModes() {
  assert.equal(readModel.retrieveByInternalId("missing").retrievalStatus, "NOT_FOUND");
  assert.equal(readModel.retrieveByCanonicalName("missing").retrievalStatus, "NOT_FOUND");
  assert.equal(readModel.retrieveByAlias("missing").retrievalStatus, "NOT_FOUND");
  const first = allViews[0];
  assert.throws(() => validateEipSprint2ReadModelView(mutatedView(first, {
    governance: { ...first.governance, noRuntimeActivation: false },
  })), /runtime/);
  assert.throws(() => validateEipSprint2ReadModelView(mutatedView(first, {
    governance: { ...first.governance, noPersistenceMutation: false },
  })), /mutate/);
  assert.throws(() => validateEipSprint2ReadModelView(mutatedView(first, {
    governance: { ...first.governance, eligibility: { ...first.governance.eligibility, customerEligible: true } },
  })), /customer eligibility/);
  assert.throws(() => validateEipSprint2ReadModelView(mutatedView(first, {
    governance: { ...first.governance, eligibility: { ...first.governance.eligibility, propertyEnrichment: true } },
  })), /property consumption/);
}

function assertSourceIsolation() {
  const moduleContents = fs.readFileSync("lib/eip/internalGeographicReadModel.ts", "utf8");
  assert.equal(/from ["']@prisma\/client["']|from ["']\.\.\/prisma|DATABASE_URL|Supabase|createClient/i.test(moduleContents), false, "Sprint 2 read model must not require database access");

  const schema = fs.readFileSync("prisma/schema.prisma", "utf8");
  const packageJson = fs.readFileSync("package.json", "utf8");
  assert.ok(packageJson.includes("check:eip-sprint-2-internal-geographic-read-model"));
  assert.equal(/EipSprint2|InternalGeographicReadModel|ReadModel/i.test(schema), false);

  const migrationNames = fs.readdirSync("prisma/migrations").join("\n");
  assert.equal(/eip|internal_geographic_read_model|read_model/i.test(migrationNames), false);

  for (const runtimeRoot of ["app", "components", "lib/search", "lib/mls", "lib/typesense", "lib/alerts", "lib/email", "lib/tracking", "workers"]) {
    if (!fs.existsSync(runtimeRoot)) continue;

    for (const file of listRuntimeSourceFiles(runtimeRoot)) {
      const contents = fs.readFileSync(file, "utf8");
      assert.equal(contents.includes("internalGeographicReadModel"), false, `Runtime imports EIP Sprint 2 read model: ${file}`);
      assert.equal(contents.includes("EIP_SPRINT_2_INTERNAL_GEOGRAPHIC_READ_MODEL"), false, `Runtime consumes EIP Sprint 2 read model: ${file}`);
    }
  }
}

function assertView(
  id: string,
  expected: Pick<EipSprint2InternalGeographicView["classification"], "knowledgeClassification" | "intelligenceDomain"> &
    Pick<EipSprint2InternalGeographicView["trust"], "authority" | "confidence" | "freshness">,
) {
  const result = readModel.retrieveByInternalId(id);
  assert.ok(result.result, `Missing read-model view for ${id}`);
  assert.equal(result.result.classification.knowledgeClassification, expected.knowledgeClassification);
  assert.equal(result.result.classification.intelligenceDomain, expected.intelligenceDomain);
  assert.equal(result.result.trust.authority, expected.authority);
  assert.equal(result.result.trust.confidence, expected.confidence);
  assert.equal(result.result.trust.freshness, expected.freshness);
}

function mutatedView(
  view: EipSprint2InternalGeographicView,
  overrides: Record<string, unknown>,
): EipSprint2InternalGeographicView {
  return { ...view, ...overrides } as EipSprint2InternalGeographicView;
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
