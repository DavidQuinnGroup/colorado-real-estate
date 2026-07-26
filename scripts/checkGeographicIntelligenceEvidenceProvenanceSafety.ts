import assert from "node:assert/strict";
import fs from "node:fs";

import { GIS_FAIL_CLOSED_ACTIVATION, assertGisFailClosedActivation } from "../lib/geographic-intelligence/activationContract.js";
import {
  GIS_1_0_SPRINT_2_AUTHORIZATION,
  GIS_1_0_SPRINT_2_CERTIFICATION,
} from "../lib/geographic-intelligence/evidenceProvenanceContract.js";
import {
  GIS_SPRINT_2_ACQUISITION_A,
  GIS_SPRINT_2_CONFLICT,
  GIS_SPRINT_2_EVIDENCE_VERSION_A,
  GIS_SPRINT_2_EXPIRED_VERSION,
  GIS_SPRINT_2_FIXTURE_TIME,
  GIS_SPRINT_2_INVALIDATED_VERSION,
  GIS_SPRINT_2_LINEAGE_A,
  GIS_SPRINT_2_PROVIDER_BOUNDARY_NOTE,
  GIS_SPRINT_2_REFERENCE_TIME,
  GIS_SPRINT_2_UNKNOWN_RIGHTS_VERSION,
  certifyGisSprint2EvidenceScenarios,
} from "../lib/geographic-intelligence/fixtures/gisSprint2EvidenceFixtures.js";
import { stableGisEvidenceFingerprint } from "../lib/geographic-intelligence/evidenceFingerprint.js";
import {
  evaluateGisEvidenceFreshness,
  validateGisConflictPreserved,
  validateGisEvidenceVersion,
  validateGisObservationLineage,
} from "../lib/geographic-intelligence/evidenceValidation.js";

const packageJson = fs.readFileSync("package.json", "utf8");
const workerTsconfig = fs.readFileSync("tsconfig.worker.json", "utf8");
const gisFiles = listSourceFiles("lib/geographic-intelligence");

assert.equal(GIS_1_0_SPRINT_2_AUTHORIZATION, "GIS_1_0_SPRINT_2_EVIDENCE_AND_PROVENANCE_FOUNDATION_AUTHORIZED");
assert.equal(GIS_1_0_SPRINT_2_CERTIFICATION, "GIS_1_0_SPRINT_2_EVIDENCE_AND_PROVENANCE_FOUNDATION_CERTIFIED");
assert.equal(GIS_SPRINT_2_FIXTURE_TIME, "2026-07-26T12:00:00.000Z");
assert.equal(GIS_SPRINT_2_REFERENCE_TIME, "2026-08-15T12:00:00.000Z");

for (const file of gisFiles) {
  const contents = fs.readFileSync(file, "utf8");
  assert.equal(contents.includes("@prisma/client"), false, `Sprint 2 must not import Prisma: ${file}`);
  assert.equal(contents.includes("PrismaClient"), false, `Sprint 2 must not reference PrismaClient: ${file}`);
  assert.equal(/\bprisma\./.test(contents), false, `Sprint 2 must not call Prisma: ${file}`);
  assert.equal(/(?:^|[\s;])(?:SELECT|INSERT\s+INTO|UPDATE\s+\w|DELETE\s+FROM|CREATE\s+TABLE|ALTER\s+TABLE|DROP\s+TABLE)\b/i.test(contents), false, `Sprint 2 must not contain SQL: ${file}`);
  assert.equal(/\bfetch\s*\(/.test(contents), false, `Sprint 2 must not fetch: ${file}`);
  assert.equal(/\b(?:axios|undici|got|superagent|http\.request|https\.request)\b/i.test(contents), false, `Sprint 2 must not use network libraries: ${file}`);
  assert.equal(/process\.env|DATABASE_URL|DIRECT_URL|SUPABASE|TYPESENSE|RESEND|SECRET|TOKEN|PASSWORD|API_KEY/i.test(contents), false, `Sprint 2 must not read credentials or environment: ${file}`);
  assert.equal(/playwright|puppeteer|chromium|browser/i.test(contents), false, `Sprint 2 must not use browser automation: ${file}`);
  assert.equal(/mayScrape:\s*true|scrape\s*\(|crawler\s*\(|crawl\s*\(/i.test(contents), false, `Sprint 2 must not scrape: ${file}`);
  assert.equal(/scheduler|polling|pollProvider|setInterval/i.test(contents), false, `Sprint 2 must not schedule or poll providers: ${file}`);
  assert.equal(/runtimeRegistry\s*\(|dispatcher\s*\(|registerRuntime\s*\(|featureFlag\s*\(/i.test(contents), false, `Sprint 2 must not register runtime behavior: ${file}`);
  assert.equal(/(?:geographic|property|prisma)\w*\.(?:create|createMany|update|updateMany|upsert|delete|deleteMany)\s*\(|\$transaction|executeRaw/i.test(contents), false, `Sprint 2 must not contain production write patterns: ${file}`);
  assert.equal(/customerDisplayAuthorized:\s*true|redistributionAuthorized:\s*true|runtimeActivationAuthorized:\s*true/i.test(contents), false, `Sprint 2 must not authorize customer, redistribution, or runtime use: ${file}`);
}

for (const prohibitedPath of [
  "app/api/geographic-intelligence/evidence/route.ts",
  "app/api/admin/geographic-intelligence/evidence/route.ts",
  "app/geographic-intelligence/evidence/page.tsx",
  "app/gis/evidence/page.tsx",
]) {
  assert.equal(fs.existsSync(prohibitedPath), false, `Sprint 2 must not introduce route/page: ${prohibitedPath}`);
}

for (const runtimeRoot of ["app", "components", "lib/search", "lib/mls", "lib/typesense", "lib/runtime", "lib/alerts", "lib/email", "workers"]) {
  for (const file of listSourceFiles(runtimeRoot)) {
    const contents = fs.readFileSync(file, "utf8");
    assert.equal(contents.includes("evidenceProvenanceContract"), false, `Runtime/downstream file must not import Sprint 2: ${file}`);
    assert.equal(contents.includes("GIS_1_0_SPRINT_2"), false, `Runtime/downstream file must not reference Sprint 2: ${file}`);
  }
}

assertGisFailClosedActivation(GIS_FAIL_CLOSED_ACTIVATION);
assertGisFailClosedActivation(GIS_SPRINT_2_ACQUISITION_A.authorizationState);
assert.equal(GIS_SPRINT_2_PROVIDER_BOUNDARY_NOTE, "NO_LIVE_PROVIDER_NO_ACQUISITION_NO_ADAPTER");
assert.equal(GIS_SPRINT_2_EVIDENCE_VERSION_A.customerDisplayAuthorized, false);
assert.equal(GIS_SPRINT_2_EVIDENCE_VERSION_A.redistributionAuthorized, false);
assert.equal(GIS_SPRINT_2_EVIDENCE_VERSION_A.runtimeActivationAuthorized, false);
assert.ok(validateGisEvidenceVersion(GIS_SPRINT_2_EVIDENCE_VERSION_A).length === 0);
assert.ok(validateGisEvidenceVersion(GIS_SPRINT_2_UNKNOWN_RIGHTS_VERSION).includes("LICENSING_UNKNOWN_FAIL_CLOSED"));
assert.ok(validateGisEvidenceVersion(GIS_SPRINT_2_UNKNOWN_RIGHTS_VERSION).includes("PERMITTED_USE_UNKNOWN_FAIL_CLOSED"));
assert.equal(validateGisConflictPreserved(GIS_SPRINT_2_CONFLICT).length, 0);
assert.equal(evaluateGisEvidenceFreshness(GIS_SPRINT_2_EXPIRED_VERSION, GIS_SPRINT_2_REFERENCE_TIME), "EXPIRED");
assert.ok(validateGisObservationLineage(
  { ...GIS_SPRINT_2_LINEAGE_A, evidenceVersionIds: [GIS_SPRINT_2_INVALIDATED_VERSION.evidenceVersionId] },
  [GIS_SPRINT_2_INVALIDATED_VERSION],
).includes("INVALIDATED_EVIDENCE_CANNOT_SUPPORT_OBSERVATION"));
assert.deepEqual(certifyGisSprint2EvidenceScenarios(), {
  scenarioA: "VALIDATED_FIXTURE_EVIDENCE_CHAIN",
  scenarioB: "DETERMINISTIC_DUPLICATE_ACQUISITION",
  scenarioC: "VALIDATED_CHANGED_EVIDENCE_VERSION",
  scenarioD: "PRESERVED_UNRESOLVED_CONFLICT",
  scenarioE: "FAILED_CLOSED_LICENSING_UNKNOWN",
  scenarioF: "VALIDATED_DETERMINISTIC_FRESHNESS",
  scenarioG: "FAILED_CLOSED_INVALID_SUPERSESSION",
  scenarioH: "FAILED_CLOSED_SUBJECT_MISMATCH",
  scenarioI: "FAILED_CLOSED_INCOMPLETE_PROVENANCE",
  scenarioJ: "FAILED_CLOSED_INVALIDATED_EVIDENCE",
});
assert.equal(stableGisEvidenceFingerprint({ b: 2, a: 1 }), stableGisEvidenceFingerprint({ a: 1, b: 2 }));
assert.notEqual(stableGisEvidenceFingerprint({ value: "a" }), stableGisEvidenceFingerprint({ value: "b" }));

assert.equal(fs.readFileSync("lib/gof/coloradoProductionRetrievalReadinessAdapter.ts", "utf8").includes("GIS_1_0_SPRINT_2"), false, "Sprint 2 must not modify GOF behavior.");
assert.equal(fs.readFileSync("lib/ekcp/coloradoEnterpriseGeographicConsumptionReadiness.ts", "utf8").includes("GIS_1_0_SPRINT_2"), false, "Sprint 2 must not modify EKCP Sprint 2R behavior.");
assert.equal(fs.readFileSync("lib/eip/productionInternalGeographicReadAdapter.ts", "utf8").includes("GIS_1_0_SPRINT_2"), false, "Sprint 2 must not modify Sprint 7 behavior.");
assert.ok(packageJson.includes("check:geographic-intelligence-evidence-provenance-safety"));
assert.ok(packageJson.includes("certify:geographic-intelligence-evidence-provenance-foundation"));
assert.ok(workerTsconfig.includes("scripts/checkGeographicIntelligenceEvidenceProvenanceSafety.ts"));
assert.ok(workerTsconfig.includes("scripts/certifyGeographicIntelligenceEvidenceProvenanceFoundation.ts"));

console.log("[geographic-intelligence-evidence-provenance-safety] ok: Sprint 2 evidence/provenance contracts are synthetic, deterministic, fail-closed, route-free, network-free, persistence-inert, retrieval-inert, runtime-inert, relationship-free, customer-invisible, and isolated from certified GOF/EKCP/Sprint 7 behavior.");

function listSourceFiles(root: string): string[] {
  if (!fs.existsSync(root)) return [];
  const entries = fs.readdirSync(root, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const path = `${root}/${entry.name}`;
    if (entry.isDirectory()) files.push(...listSourceFiles(path));
    if (entry.isFile() && /\.(ts|tsx|js|jsx)$/.test(path)) files.push(path);
  }
  return files;
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/checkGeographicIntelligenceEvidenceProvenanceSafety.ts
