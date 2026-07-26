import assert from "node:assert/strict";
import fs from "node:fs";

import {
  GIS_1_0_SPRINT_3_AUTHORIZATION,
  GIS_1_0_SPRINT_3_CERTIFICATION,
} from "../lib/geographic-intelligence/providerInventoryContract.js";
import {
  GIS_SPRINT_3_CANONICAL_CATEGORY_COUNT,
  GIS_SPRINT_3_PROVIDER_BOUNDARY_NOTE,
  GIS_SPRINT_3_PROVIDER_INVENTORY,
  GIS_SPRINT_3_PROVIDER_OVERLAPS,
  certifyGisSprint3ProviderInventoryScenarios,
  gisSprint3ProviderInventoryFingerprint,
} from "../lib/geographic-intelligence/fixtures/gisSprint3ProviderInventoryFixtures.js";
import {
  deterministicProviderInventorySummary,
  validateGisProviderInventoryEntry,
  validateGisProviderOverlap,
} from "../lib/geographic-intelligence/providerInventoryValidation.js";

const packageJson = fs.readFileSync("package.json", "utf8");
const workerTsconfig = fs.readFileSync("tsconfig.worker.json", "utf8");
const gisFiles = listSourceFiles("lib/geographic-intelligence");
const separatelyAuthorizedSprint4FixtureAdapterFiles = new Set([
  "lib/geographic-intelligence/fixtureProviderAdapterContract.ts",
  "lib/geographic-intelligence/fixtureProviderNormalization.ts",
  "lib/geographic-intelligence/fixtureProviderValidation.ts",
  "lib/geographic-intelligence/syntheticFixtureProviderAdapter.ts",
  "lib/geographic-intelligence/fixtures/gisSprint4SyntheticProviderFixtures.ts",
]);

assert.equal(GIS_1_0_SPRINT_3_AUTHORIZATION, "GIS_1_0_SPRINT_3_PROVIDER_INVENTORY_GOVERNANCE_AUTHORIZED");
assert.equal(GIS_1_0_SPRINT_3_CERTIFICATION, "GIS_1_0_SPRINT_3_PROVIDER_INVENTORY_GOVERNANCE_CERTIFIED");
assert.equal(GIS_SPRINT_3_PROVIDER_BOUNDARY_NOTE, "PROVIDER_INVENTORY_DOES_NOT_AUTHORIZE_PROVIDER_USE");
assert.equal(new Set(GIS_SPRINT_3_PROVIDER_INVENTORY.map((entry) => entry.category)).size, GIS_SPRINT_3_CANONICAL_CATEGORY_COUNT);

for (const file of gisFiles) {
  const contents = fs.readFileSync(file, "utf8");
  assert.equal(contents.includes("@prisma/client"), false, `Sprint 3 must not import Prisma: ${file}`);
  assert.equal(contents.includes("PrismaClient"), false, `Sprint 3 must not reference PrismaClient: ${file}`);
  assert.equal(/\bprisma\./.test(contents), false, `Sprint 3 must not call Prisma: ${file}`);
  assert.equal(/(?:^|[\s;])(?:SELECT|INSERT\s+INTO|UPDATE\s+\w|DELETE\s+FROM|CREATE\s+TABLE|ALTER\s+TABLE|DROP\s+TABLE)\b/i.test(contents), false, `Sprint 3 must not contain SQL: ${file}`);
  assert.equal(/\bfetch\s*\(/.test(contents), false, `Sprint 3 must not fetch: ${file}`);
  assert.equal(/\b(?:axios|undici|got|superagent|http\.request|https\.request)\b/i.test(contents), false, `Sprint 3 must not use HTTP clients: ${file}`);
  assert.equal(/playwright|puppeteer|chromium|browser/i.test(contents), false, `Sprint 3 must not use browser automation: ${file}`);
  assert.equal(/scrapingLibrary|cheerio|jsdom|crawler\s*\(|crawl\s*\(|scrape\s*\(/i.test(contents), false, `Sprint 3 must not scrape: ${file}`);
  assert.equal(/process\.env|DATABASE_URL|DIRECT_URL|SUPABASE|TYPESENSE|RESEND|SECRET|TOKEN|PASSWORD|API_KEY|providerApiKey/i.test(contents), false, `Sprint 3 must not read credentials or environment: ${file}`);
  assert.equal(/scheduler|setInterval|pollProvider|providerPolling/i.test(contents), false, `Sprint 3 must not schedule or poll providers: ${file}`);
  assert.equal(/runtimeRegistry\s*\(|dispatcher\s*\(|registerRuntime\s*\(|featureFlag\s*\(/i.test(contents), false, `Sprint 3 must not register runtime behavior: ${file}`);
  if (!separatelyAuthorizedSprint4FixtureAdapterFiles.has(file)) {
    assert.equal(/providerAdapter\s*\(|connectProvider\s*\(|acquireProvider\s*\(|licensedDataFeed\s*\(/i.test(contents), false, `Sprint 3 must not create provider adapters or acquisition: ${file}`);
  }
  assert.equal(/(?:geographic|property|prisma)\w*\.(?:create|createMany|update|updateMany|upsert|delete|deleteMany)\s*\(|\$transaction|executeRaw/i.test(contents), false, `Sprint 3 must not contain production write patterns: ${file}`);
  assert.equal(/customerDisplayAuthorized:\s*true|redistributionAuthorized:\s*true|runtimeAuthorized:\s*true|downstreamIntegrationAuthorized:\s*true|acquisitionAuthorized:\s*true/i.test(contents), false, `Sprint 3 must not authorize use: ${file}`);
}

for (const prohibitedPath of [
  "app/api/geographic-intelligence/providers/route.ts",
  "app/api/admin/geographic-intelligence/providers/route.ts",
  "app/geographic-intelligence/providers/page.tsx",
  "app/gis/providers/page.tsx",
]) {
  assert.equal(fs.existsSync(prohibitedPath), false, `Sprint 3 must not introduce route/page: ${prohibitedPath}`);
}

for (const runtimeRoot of ["app", "components", "lib/search", "lib/mls", "lib/typesense", "lib/runtime", "lib/alerts", "lib/email", "workers"]) {
  for (const file of listSourceFiles(runtimeRoot)) {
    const contents = fs.readFileSync(file, "utf8");
    assert.equal(contents.includes("providerInventoryContract"), false, `Runtime/downstream file must not import Sprint 3: ${file}`);
    assert.equal(contents.includes("GIS_1_0_SPRINT_3"), false, `Runtime/downstream file must not reference Sprint 3: ${file}`);
  }
}

const entryIds = GIS_SPRINT_3_PROVIDER_INVENTORY.map((entry) => entry.inventoryEntryId);
for (const entry of GIS_SPRINT_3_PROVIDER_INVENTORY) {
  const failures = validateGisProviderInventoryEntry(entry);
  assert.equal(failures.every((failure) => failure === "LICENSING_UNKNOWN_FAIL_CLOSED" || failure === "PERMITTED_USE_UNKNOWN_FAIL_CLOSED"), true, `${entry.inventoryEntryId} has unexpected failures: ${failures.join(",")}`);
  assert.equal(entry.internalOnly, true);
  assert.equal(entry.customerDisplayAuthorized, false);
  assert.equal(entry.redistributionAuthorized, false);
  assert.equal(Object.values(entry.activation).every((value) => value === false), true);
  assert.notEqual(entry.verificationState, "TECHNICALLY_VERIFIED");
  assert.notEqual(entry.verificationState, "CONTRACT_VERIFIED");
}
for (const overlap of GIS_SPRINT_3_PROVIDER_OVERLAPS) {
  assert.deepEqual(validateGisProviderOverlap(overlap, entryIds), []);
}

const scenarios = certifyGisSprint3ProviderInventoryScenarios();
assert.equal(scenarios.scenarioA, "GOVERNED_PROVIDER_INVENTORY_ENTRY");
assert.equal(scenarios.scenarioB, "COMMERCIAL_REVIEW_REQUIRED");
assert.equal(scenarios.scenarioC, "OPERATIONAL_TOOL_ONLY");
assert.equal(scenarios.scenarioD, "RESEARCH_REFERENCE_ONLY");
assert.equal(scenarios.scenarioE, "JURISDICTION_INSTANCE_REQUIRED_BEFORE_ACTIVATION");
assert.equal(scenarios.scenarioF, "FAILED_CLOSED_LICENSING_UNKNOWN");
assert.equal(scenarios.scenarioG, "OVERLAP_PRESERVED_NOT_EQUIVALENT");
assert.equal(scenarios.scenarioH, "APPROVED_FOR_FUTURE_PROVIDER_EVALUATION");
assert.equal(scenarios.scenarioI, "REJECTED_WITH_REASON_RETAINED");
assert.equal(scenarios.scenarioJ, "VERIFICATION_REQUIRED");
assert.equal(gisSprint3ProviderInventoryFingerprint(), gisSprint3ProviderInventoryFingerprint());
assert.equal(deterministicProviderInventorySummary(GIS_SPRINT_3_PROVIDER_INVENTORY, GIS_SPRINT_3_PROVIDER_OVERLAPS).categoryCount, 16);

assert.equal(fs.readFileSync("lib/gof/coloradoProductionRetrievalReadinessAdapter.ts", "utf8").includes("GIS_1_0_SPRINT_3"), false, "Sprint 3 must not modify GOF behavior.");
assert.equal(fs.readFileSync("lib/ekcp/coloradoEnterpriseGeographicConsumptionReadiness.ts", "utf8").includes("GIS_1_0_SPRINT_3"), false, "Sprint 3 must not modify EKCP behavior.");
assert.equal(fs.readFileSync("lib/eip/productionInternalGeographicReadAdapter.ts", "utf8").includes("GIS_1_0_SPRINT_3"), false, "Sprint 3 must not modify Sprint 7 behavior.");
assert.ok(packageJson.includes("check:geographic-intelligence-provider-inventory-safety"));
assert.ok(packageJson.includes("certify:geographic-intelligence-provider-inventory-governance"));
assert.ok(workerTsconfig.includes("scripts/checkGeographicIntelligenceProviderInventorySafety.ts"));
assert.ok(workerTsconfig.includes("scripts/certifyGeographicIntelligenceProviderInventoryGovernance.ts"));

console.log("[geographic-intelligence-provider-inventory-safety] ok: Sprint 3 provider inventory governance is deterministic, internal-only, verification-explicit, fail-closed, network-free, adapter-free, acquisition-free, runtime-inert, relationship-free, customer-invisible, and isolated from certified GOF/EKCP/Sprint 7/Sprint 1/Sprint 2 behavior.");

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

// /Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/checkGeographicIntelligenceProviderInventorySafety.ts
