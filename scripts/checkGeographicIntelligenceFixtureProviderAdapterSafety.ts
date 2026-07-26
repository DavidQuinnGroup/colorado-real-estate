import assert from "node:assert/strict";
import fs from "node:fs";

import {
  GIS_1_0_SPRINT_4_AUTHORIZATION,
  GIS_1_0_SPRINT_4_CERTIFICATION,
  GIS_SPRINT_4_ADAPTER_ID,
  GIS_SPRINT_4_ADAPTER_VERSION,
  GIS_SPRINT_4_FIXTURE_SCHEMA_VERSION,
  GIS_SPRINT_4_SYNTHETIC_PROVIDER_ID,
} from "../lib/geographic-intelligence/fixtureProviderAdapterContract.js";
import {
  GIS_SPRINT_4_BOUNDARY_NOTE,
  GIS_SPRINT_4_VALID_FIXTURE_PAYLOAD,
  certifyGisSprint4FixtureProviderScenarios,
  gisSprint4FixtureProviderCertificationArtifacts,
} from "../lib/geographic-intelligence/fixtures/gisSprint4SyntheticProviderFixtures.js";
import { validateSprint4AdapterSuccess } from "../lib/geographic-intelligence/fixtureProviderValidation.js";

const sprint4Files = [
  "lib/geographic-intelligence/fixtureProviderAdapterContract.ts",
  "lib/geographic-intelligence/fixtureProviderNormalization.ts",
  "lib/geographic-intelligence/fixtureProviderValidation.ts",
  "lib/geographic-intelligence/syntheticFixtureProviderAdapter.ts",
  "lib/geographic-intelligence/fixtures/gisSprint4SyntheticProviderFixtures.ts",
];
const packageJson = fs.readFileSync("package.json", "utf8");
const workerTsconfig = fs.readFileSync("tsconfig.worker.json", "utf8");

assert.equal(GIS_1_0_SPRINT_4_AUTHORIZATION, "GIS_1_0_SPRINT_4_CONTROLLED_FIXTURE_PROVIDER_ADAPTER_AUTHORIZED");
assert.equal(GIS_1_0_SPRINT_4_CERTIFICATION, "GIS_1_0_SPRINT_4_CONTROLLED_FIXTURE_PROVIDER_ADAPTER_CERTIFIED");
assert.equal(GIS_SPRINT_4_BOUNDARY_NOTE, "FIXTURE_PROOF_IS_NOT_PROVIDER_APPROVAL");
assert.equal(GIS_SPRINT_4_ADAPTER_ID, "GIS_SPRINT_4_SYNTHETIC_PROVIDER_ADAPTER");
assert.equal(GIS_SPRINT_4_ADAPTER_VERSION, "1.0.0");
assert.equal(GIS_SPRINT_4_SYNTHETIC_PROVIDER_ID, "ATLAS_SYNTHETIC_GEO_EVIDENCE_PROVIDER");
assert.equal(GIS_SPRINT_4_FIXTURE_SCHEMA_VERSION, "GIS_SPRINT_4_SYNTHETIC_FIXTURE_SCHEMA_V1");

for (const file of sprint4Files) {
  const contents = fs.readFileSync(file, "utf8");
  assert.equal(contents.includes("@prisma/client"), false, `Sprint 4 must not import Prisma: ${file}`);
  assert.equal(contents.includes("PrismaClient"), false, `Sprint 4 must not reference PrismaClient: ${file}`);
  assert.equal(/\bprisma\./.test(contents), false, `Sprint 4 must not call Prisma: ${file}`);
  assert.equal(/(?:^|[\s;])(?:SELECT|INSERT\s+INTO|UPDATE\s+\w|DELETE\s+FROM|CREATE\s+TABLE|ALTER\s+TABLE|DROP\s+TABLE)\b/i.test(contents), false, `Sprint 4 must not contain SQL: ${file}`);
  assert.equal(/\bfetch\s*\(/.test(contents), false, `Sprint 4 must not fetch: ${file}`);
  assert.equal(/\b(?:axios|undici|got|superagent|http\.request|https\.request)\b/i.test(contents), false, `Sprint 4 must not use HTTP clients: ${file}`);
  assert.equal(/playwright|puppeteer|chromium|browser/i.test(contents), false, `Sprint 4 must not use browser automation: ${file}`);
  assert.equal(/scrapingLibrary|cheerio|jsdom|crawler\s*\(|crawl\s*\(|scrape\s*\(/i.test(contents), false, `Sprint 4 must not scrape: ${file}`);
  assert.equal(/process\.env|DATABASE_URL|DIRECT_URL|SUPABASE|TYPESENSE|RESEND|SECRET|TOKEN|PASSWORD|API_KEY|providerApiKey/i.test(contents), false, `Sprint 4 must not read credentials or environment: ${file}`);
  assert.equal(/scheduler|setInterval|pollProvider|providerPolling|queue/i.test(contents), false, `Sprint 4 must not schedule, poll, or integrate queues: ${file}`);
  assert.equal(/runtimeRegistry\s*\(|dispatcher\s*\(|registerRuntime\s*\(|featureFlag\s*\(/i.test(contents), false, `Sprint 4 must not register runtime behavior: ${file}`);
  assert.equal(/connectProvider\s*\(|acquireProvider\s*\(|licensedDataFeed\s*\(/i.test(contents), false, `Sprint 4 must not connect providers or acquire data: ${file}`);
  assert.equal(/(?:geographic|property|prisma)\w*\.(?:create|createMany|update|updateMany|upsert|delete|deleteMany)\s*\(|\$transaction|executeRaw/i.test(contents), false, `Sprint 4 must not contain production write patterns: ${file}`);
  for (const realProviderName of ["IRES", "Zillow", "Redfin", "Realtor.com", "Homes.com", "CoreLogic", "ATTOM", "Esri", "GreatSchools"]) {
    assert.equal(contents.includes(realProviderName), false, `Sprint 4 fixture implementation must not reference real provider identity ${realProviderName}: ${file}`);
  }
}

for (const prohibitedPath of [
  "app/api/geographic-intelligence/fixture-provider/route.ts",
  "app/api/admin/geographic-intelligence/fixture-provider/route.ts",
  "app/geographic-intelligence/fixture-provider/page.tsx",
  "app/gis/fixture-provider/page.tsx",
]) {
  assert.equal(fs.existsSync(prohibitedPath), false, `Sprint 4 must not introduce route/page: ${prohibitedPath}`);
}

for (const runtimeRoot of ["app", "components", "lib/search", "lib/mls", "lib/typesense", "lib/runtime", "lib/alerts", "lib/email", "workers"]) {
  for (const file of listSourceFiles(runtimeRoot)) {
    const contents = fs.readFileSync(file, "utf8");
    assert.equal(contents.includes("syntheticFixtureProviderAdapter"), false, `Runtime/downstream file must not import Sprint 4 adapter: ${file}`);
    assert.equal(contents.includes("GIS_1_0_SPRINT_4"), false, `Runtime/downstream file must not reference Sprint 4: ${file}`);
  }
}

const scenarios = certifyGisSprint4FixtureProviderScenarios();
const artifacts = gisSprint4FixtureProviderCertificationArtifacts();
assert.equal(scenarios.scenarioA, "NORMALIZED_FIXTURE_EVIDENCE_CREATED");
assert.equal(scenarios.scenarioB, "DETERMINISTIC_DUPLICATE_FIXTURE_EVIDENCE");
assert.equal(scenarios.scenarioC, "CHANGED_FIXTURE_EVIDENCE_VERSION_CREATED");
assert.equal(scenarios.scenarioD, "FAILED_CLOSED_MALFORMED_FIXTURE_INPUT");
assert.equal(scenarios.scenarioE, "FAILED_CLOSED_UNSUPPORTED_FIXTURE_SCHEMA");
assert.equal(scenarios.scenarioF, "FAILED_CLOSED_PROVIDER_ID_MISMATCH");
assert.equal(scenarios.scenarioG, "FAILED_CLOSED_FIXTURE_ONLY_MARKER_REQUIRED");
assert.equal(scenarios.scenarioH, "FAILED_CLOSED_LICENSING_UNKNOWN");
assert.equal(scenarios.scenarioI, "FAILED_CLOSED_SUBJECT_MISMATCH");
assert.equal(scenarios.scenarioJ, "FAILED_CLOSED_DOMAIN_MISMATCH");
assert.equal(scenarios.scenarioK, "FAILED_CLOSED_INVALID_TEMPORAL_RANGE");
assert.equal(scenarios.scenarioL, "FAILED_CLOSED_CONTENT_CHECKSUM_MISMATCH");
assert.equal(scenarios.scenarioM, "FAILED_CLOSED_INCOMPLETE_PROVENANCE");
assert.equal(scenarios.scenarioN, "FAILED_CLOSED_ACTIVATION_DRIFT");
assert.deepEqual(validateSprint4AdapterSuccess(artifacts.baseline), []);
assert.deepEqual(validateSprint4AdapterSuccess(artifacts.duplicate), []);
assert.deepEqual(validateSprint4AdapterSuccess(artifacts.changed), []);
assert.equal(artifacts.baseline.evidenceFamilyId, artifacts.duplicate.evidenceFamilyId);
assert.equal(artifacts.baseline.evidenceVersion.evidenceVersionId, artifacts.duplicate.evidenceVersion.evidenceVersionId);
assert.equal(artifacts.baseline.evidenceFamilyId, artifacts.changed.evidenceFamilyId);
assert.notEqual(artifacts.baseline.evidenceVersion.evidenceVersionId, artifacts.changed.evidenceVersion.evidenceVersionId);
assert.equal(Object.values(artifacts.baseline.acquisitionRecord.authorizationState).every((value) => value === false), true);
assert.equal(artifacts.baseline.evidenceVersion.internalOnly, true);
assert.equal(artifacts.baseline.evidenceVersion.customerDisplayAuthorized, false);
assert.equal(artifacts.baseline.evidenceVersion.redistributionAuthorized, false);
assert.equal(artifacts.baseline.evidenceVersion.runtimeActivationAuthorized, false);
assert.equal(GIS_SPRINT_4_VALID_FIXTURE_PAYLOAD.fixtureOnly, true);
assert.equal(artifacts.outputFingerprint, gisSprint4FixtureProviderCertificationArtifacts().outputFingerprint);

assert.equal(fs.readFileSync("lib/gof/coloradoProductionRetrievalReadinessAdapter.ts", "utf8").includes("GIS_1_0_SPRINT_4"), false, "Sprint 4 must not modify GOF behavior.");
assert.equal(fs.readFileSync("lib/ekcp/coloradoEnterpriseGeographicConsumptionReadiness.ts", "utf8").includes("GIS_1_0_SPRINT_4"), false, "Sprint 4 must not modify EKCP behavior.");
assert.equal(fs.readFileSync("lib/eip/productionInternalGeographicReadAdapter.ts", "utf8").includes("GIS_1_0_SPRINT_4"), false, "Sprint 4 must not modify Sprint 7 behavior.");
assert.ok(packageJson.includes("check:geographic-intelligence-fixture-provider-adapter-safety"));
assert.ok(packageJson.includes("certify:geographic-intelligence-fixture-provider-adapter"));
assert.ok(workerTsconfig.includes("scripts/checkGeographicIntelligenceFixtureProviderAdapterSafety.ts"));
assert.ok(workerTsconfig.includes("scripts/certifyGeographicIntelligenceFixtureProviderAdapter.ts"));

console.log("[geographic-intelligence-fixture-provider-adapter-safety] ok: Sprint 4 controlled fixture provider adapter is synthetic-only, deterministic, fixture-only, credential-free, network-free, acquisition-free, persistence-free, retrieval-free, runtime-inert, relationship-free, customer-invisible, and isolated from certified GOF/EKCP/Sprint 7/Sprint 1/Sprint 2/Sprint 3 behavior.");

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
