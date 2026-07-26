import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

import {
  GOF_WAVE_2_COLORADO_CANDIDATE_ID,
  buildGofWave2ColoradoGovernedInstanceFoundation,
} from "../lib/gof/coloradoGovernedInstanceFoundation.js";
import {
  EIP_SPRINT_6_AUTHORIZED_CANONICAL_NAME,
  EIP_SPRINT_6_WRITE_LIMITS,
  buildEipSprint6PilotPlan,
  validateEipSprint6Invocation,
} from "../lib/eip/controlledProductionInternalGeographicPersistencePilot.js";
import {
  EIP_SPRINT_7_CERTIFIED_CANONICAL_NAME,
  EIP_SPRINT_7_CERTIFIED_OBJECT_ID,
  EIP_SPRINT_7_CERTIFIED_SCOPE,
} from "../lib/eip/productionInternalGeographicReadAdapter.js";

const packageJson = fs.readFileSync("package.json", "utf8");
const workerTsconfig = fs.readFileSync("tsconfig.worker.json", "utf8");
const reportPath = "docs/project-atlas/executive-library/GOF-1.0-WAVE-2-COLORADO-GOVERNED-INSTANCE-FOUNDATION.md";
const report = fs.existsSync(reportPath) ? fs.readFileSync(reportPath, "utf8") : "";
const foundationSource = fs.readFileSync("lib/gof/coloradoGovernedInstanceFoundation.ts", "utf8");

const foundation = buildGofWave2ColoradoGovernedInstanceFoundation();

assert.equal(foundation.identity.enterpriseCandidateId, GOF_WAVE_2_COLORADO_CANDIDATE_ID);
assert.equal(foundation.identity.objectType, "STATE");
assert.equal(foundation.identity.canonicalName, "Colorado");
assert.equal(foundation.identity.displayName, "Colorado");
assert.equal(foundation.identity.canonicalSlug, "colorado");
assert.deepEqual([...foundation.identity.aliases], ["Colorado", "CO", "State of Colorado"]);
assert.deepEqual([...foundation.identity.officialSourceIdentifiers], ["US-CO", "ANSI_STATE_CODE_08", "GNIS_STATE_COLORADO"]);
assert.equal(foundation.identity.idempotencyKey, "GIO_OBJECT|STATE|colorado");
assert.equal(foundation.identity.lifecycleStatus, "GOVERNED_INTERNAL_CANDIDATE");

assert.equal(foundation.evidence.length, 5);
assert.deepEqual([...new Set(foundation.evidence.map((item) => item.provider))].sort(), [
  "Colorado GIS",
  "State of Colorado",
  "U.S. Census Bureau",
  "USGS/GNIS",
]);
for (const evidence of foundation.evidence) {
  assert.equal(evidence.providerInventory, "PROJECT ATLAS - REAL ESTATE DATA TOOLS");
  assert.equal(evidence.provenance, "REVIEWED_REPOSITORY_FIXTURE");
  assert.equal(evidence.confidence, "HIGH");
  assert.equal(evidence.conflictStatus, "NO_MATERIAL_CONFLICT");
  assert.equal(evidence.productionEligible, false);
}

assert.equal(foundation.readModelView.identity.id, foundation.identity.enterpriseCandidateId);
assert.equal(foundation.readModelView.identity.objectType, "STATE");
assert.equal(foundation.readModelView.classification.knowledgeClassification, "AUTHORITATIVE_FACT");
assert.equal(foundation.readModelView.trust.confidence, "HIGH");
assert.equal(foundation.readModelView.trust.authority, "INTERNAL_PROOF_ONLY");
assert.equal(foundation.readModelView.governance.noPersistenceMutation, true);
assert.equal(foundation.readModelView.governance.noCustomerRetrievalPath, true);
assert.equal(foundation.readModelView.governance.noRuntimeActivation, true);
assert.equal(foundation.readModelView.governance.noSearchVisibility, true);
assert.equal(foundation.readModelView.governance.noMapVisibility, true);
assert.equal(foundation.readModelView.governance.eligibility.customerEligible, false);
assert.equal(foundation.readModelView.governance.eligibility.searchEligible, false);
assert.equal(foundation.readModelView.governance.eligibility.mapEligible, false);
assert.equal(foundation.readModelView.governance.eligibility.propertyEnrichment, false);

assert.equal(foundation.mapping.enterpriseDomainRole, "COLORADO_STATEWIDE_ROOT_CANDIDATE");
assert.equal(foundation.mapping.currentEnterpriseRootInstanceCandidate, true);
assert.equal(foundation.mapping.automaticUniversalParent, false);
assert.equal(foundation.mapping.relationshipsCreated, 0);
assert.deepEqual([...foundation.mapping.subordinateRelationshipTypesDeferred], ["WITHIN", "CONTAINS", "OVERLAPS", "PARTIAL_CONTAINMENT"]);

assert.equal(foundation.quality.knowledgeId, GOF_WAVE_2_COLORADO_CANDIDATE_ID);
assert.equal(foundation.quality.overallInternalStatus, "READY");
assert.equal(foundation.quality.metadata.customerVisibleQualityScore, false);
assert.equal(foundation.quality.metadata.runtimeActivation, false);
assert.equal(foundation.quality.metadata.persistenceMutation, false);

assert.equal(foundation.readinessEntry.knowledgeObjectId, GOF_WAVE_2_COLORADO_CANDIDATE_ID);
assert.equal(foundation.readinessEntry.gate, "INTERNAL_MAPPING");
assert.equal(foundation.readinessEntry.qualityEngineResult, "READY");
assert.equal(foundation.readinessEntry.gateStatus, "READY_FOR_INTERNAL_PROOF");
assert.equal(foundation.readinessEntry.authorized, false);
assert.equal(foundation.readinessEntry.active, false);
assert.equal(foundation.readinessEntry.authorizationStatus, "NOT_AUTHORIZED");
assert.ok(foundation.readinessEntry.blockingConditions.includes("READINESS_REQUIREMENTS_FAILED"));
assert.ok(foundation.readinessEntry.requirementsFailed.includes("GOVERNANCE:activation approval"));

assert.equal(foundation.approvalRequest.subjectId, GOF_WAVE_2_COLORADO_CANDIDATE_ID);
assert.equal(foundation.approvalRequest.requestedApprovalType, "APPROVE_FOR_INTERNAL_PROOF");
assert.equal(foundation.approvalPacket.identity.subject, "Colorado");
assert.equal(foundation.approvalDecision.decision, "APPROVED_FOR_DEFINED_NEXT_STEP");
assert.equal(foundation.approvalDecision.productionPersistenceAuthorized, false);
assert.equal(foundation.approvalDecision.runtimeConsumptionAuthorized, false);
assert.equal(foundation.approvalDecision.customerVisibilityAuthorized, false);
assert.equal(foundation.approvalDecision.activationExplicitlyAuthorized, false);
assert.ok(foundation.approvalDecision.prohibitedActions.includes("DO_NOT_CREATE_PRODUCTION_PERSISTENCE"));
assert.ok(foundation.approvalDecision.prohibitedActions.includes("DO_NOT_ENABLE_PRODUCTION_RETRIEVAL"));
assert.ok(foundation.approvalDecision.prohibitedActions.includes("DO_NOT_CREATE_RELATIONSHIPS"));

assert.deepEqual(Object.values(foundation.boundaries), [
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
]);

assert.deepEqual(EIP_SPRINT_6_WRITE_LIMITS, {
  geographicObjects: 1,
  aliases: 2,
  sources: 1,
  observations: 6,
  eligibilityRows: 1,
  relationships: 0,
  propertyRelationships: 0,
});
const sprint6Plan = buildEipSprint6PilotPlan();
assert.equal(sprint6Plan.subject.canonicalName, EIP_SPRINT_6_AUTHORIZED_CANONICAL_NAME);
assert.equal(sprint6Plan.subject.objectType, "MUNICIPALITY");
assert.throws(() => validateEipSprint6Invocation({
  mode: "execute",
  subject: "Colorado",
  scope: "CONTROLLED_PRODUCTION_INTERNAL_GEOGRAPHIC_PERSISTENCE_PILOT",
  invocationId: "GOF_WAVE_2_COLORADO_PRODUCTION_PERSISTENCE_BLOCKED",
  authorized: true,
}), /Thornton/);

assert.equal(EIP_SPRINT_7_CERTIFIED_OBJECT_ID, "cms10utak0002qa0l8mu7gr8i");
assert.equal(EIP_SPRINT_7_CERTIFIED_CANONICAL_NAME, "Thornton");
assert.equal(EIP_SPRINT_7_CERTIFIED_SCOPE, "PRODUCTION_INTERNAL_GEOGRAPHIC_READ_ADAPTER");

for (const prohibited of ["@prisma/client", "PrismaClient", "prisma.", "DATABASE_URL", "fetch(", "app/api", "route.ts"]) {
  assert.equal(foundationSource.includes(prohibited), false, `GOF Wave 2 foundation module contains prohibited runtime/persistence dependency: ${prohibited}`);
}

for (const runtimeRoot of ["app", "components", "lib/search", "lib/mls", "lib/typesense", "lib/alerts", "lib/email", "workers"]) {
  for (const file of listSourceFiles(runtimeRoot)) {
    const contents = fs.readFileSync(file, "utf8");
    assert.equal(contents.includes("GOF_WAVE_2"), false, `Runtime file references GOF Wave 2 fixture: ${file}`);
    assert.equal(contents.includes(GOF_WAVE_2_COLORADO_CANDIDATE_ID), false, `Runtime file references Colorado candidate id: ${file}`);
  }
}

const productionFiles = [
  "lib/eip/controlledProductionInternalGeographicPersistencePilot.ts",
  "lib/eip/productionInternalGeographicReadAdapter.ts",
  "lib/ekcp/enterpriseGeographicConsumerAdapter.ts",
];
for (const file of productionFiles) {
  const contents = fs.readFileSync(file, "utf8");
  assert.equal(contents.includes("GOF_WAVE_2"), false, `Production path references GOF Wave 2: ${file}`);
  assert.equal(contents.includes("Colorado Governed Instance"), false, `Production path references Colorado governed instance: ${file}`);
}

assert.ok(packageJson.includes("check:gof-wave-2-colorado-governed-instance-foundation"));
assert.ok(workerTsconfig.includes("scripts/checkGofWave2ColoradoGovernedInstanceFoundation.ts"));
assert.ok(workerTsconfig.includes("lib/gof/**/*.ts"));

assert.match(report, /COLORADO SUBJECT STATUS: `GOVERNED_INTERNAL_CANDIDATE_APPROVED`/);
assert.match(report, /PRODUCTION PERSISTENCE STATUS: `NOT_AUTHORIZED`/);
assert.match(report, /PRODUCTION RETRIEVAL STATUS: `NOT_AUTHORIZED`/);
assert.match(report, /RELATIONSHIP STATUS: `NOT_AUTHORIZED`/);
assert.match(report, /CUSTOMER VISIBILITY STATUS: `NOT_AUTHORIZED`/);

await assertProductionBoundary();

console.log(
  "[gof-wave-2-colorado-governed-instance-foundation] ok: Colorado STATE governed internal candidate, authoritative deterministic evidence, lifecycle separation, internal approval boundary, no production persistence/retrieval/relationships, Thornton-only Sprint 6/7 preservation, EKCP isolation, and no runtime/customer/downstream integration passed.",
);

function listSourceFiles(root: string): string[] {
  if (!fs.existsSync(root)) return [];
  const stat = fs.statSync(root);
  if (stat.isFile()) return /\.(ts|tsx|js|jsx)$/.test(root) ? [root] : [];
  return fs.readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const child = path.join(root, entry.name);
    return entry.isDirectory() ? listSourceFiles(child) : /\.(ts|tsx|js|jsx)$/.test(child) ? [child] : [];
  });
}

async function assertProductionBoundary(): Promise<void> {
  const prisma = new PrismaClient();
  try {
    const rows = await prisma.$queryRaw<readonly [{
      geographic_objects: number;
      geographic_relationships: number;
      property_geographic_relationships: number;
      state_objects: number;
      colorado_named_objects: number;
    }]>`
      SELECT
        (SELECT count(*)::int FROM "GeographicObject") AS geographic_objects,
        (SELECT count(*)::int FROM "GeographicRelationship") AS geographic_relationships,
        (SELECT count(*)::int FROM "PropertyGeographicRelationship") AS property_geographic_relationships,
        (SELECT count(*)::int FROM "GeographicObject" WHERE "objectType"::text = 'STATE') AS state_objects,
        (SELECT count(*)::int FROM "GeographicObject" WHERE "canonicalName" = 'Colorado') AS colorado_named_objects
    `;
    const counts = rows[0];
    assert.equal(counts.geographic_objects, 1);
    assert.equal(counts.geographic_relationships, 0);
    assert.equal(counts.property_geographic_relationships, 0);
    assert.equal(counts.state_objects, 0);
    assert.equal(counts.colorado_named_objects, 0);

    const thorntonRows = await prisma.$queryRaw<readonly [{
      id: string;
      object_type: string;
      canonical_name: string;
      canonical_slug: string;
      lifecycle_status: string;
      visibility: string;
      updated_at: Date;
    }]>`
      SELECT id, "objectType"::text AS object_type, "canonicalName" AS canonical_name, "canonicalSlug" AS canonical_slug,
        "lifecycleStatus"::text AS lifecycle_status, "visibility"::text AS visibility, "updatedAt" AS updated_at
      FROM "GeographicObject"
      WHERE id = 'cms10utak0002qa0l8mu7gr8i'
    `;
    assert.equal(thorntonRows.length, 1);
    assert.equal(thorntonRows[0].object_type, "MUNICIPALITY");
    assert.equal(thorntonRows[0].canonical_name, "Thornton");
    assert.equal(thorntonRows[0].canonical_slug, "thornton-colorado");
    assert.equal(thorntonRows[0].lifecycle_status, "DRAFT");
    assert.equal(thorntonRows[0].visibility, "INTERNAL_ONLY");
    assert.equal(thorntonRows[0].updated_at.toISOString(), "2026-07-25T23:50:19.341Z");
  } finally {
    await prisma.$disconnect();
  }
}
