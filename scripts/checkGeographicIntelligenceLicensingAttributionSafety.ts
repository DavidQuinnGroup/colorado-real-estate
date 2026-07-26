import assert from "node:assert/strict";
import fs from "node:fs";

import {
  GIS_1_0_SPRINT_8_AUTHORIZATION,
  GIS_1_0_SPRINT_8_CERTIFICATION,
  GIS_SPRINT_8_BOUNDARY_NOTE,
} from "../lib/geographic-intelligence/licensingResolutionContract.js";
import {
  GIS_SPRINT_8_SOURCE_REFERENCES,
  buildGisSprint8AttributionRecord,
  buildGisSprint8ConditionMatrix,
  buildGisSprint8DisclaimerRecord,
  buildGisSprint8LicensingResolution,
  certifyGisSprint8LicensingScenarios,
  gisSprint8LicensingResolutionFingerprint,
} from "../lib/geographic-intelligence/fixtures/gisSprint8LicensingAttributionFixtures.js";
import { assertGisSprint8LicensingResolution } from "../lib/geographic-intelligence/licensingResolutionValidation.js";

const sprint8Files = [
  "lib/geographic-intelligence/licensingResolutionContract.ts",
  "lib/geographic-intelligence/licensingResolutionValidation.ts",
  "lib/geographic-intelligence/attributionContract.ts",
  "lib/geographic-intelligence/disclaimerContract.ts",
  "lib/geographic-intelligence/pilotConditionMatrix.ts",
  "lib/geographic-intelligence/fixtures/gisSprint8LicensingAttributionFixtures.ts",
];
const packageJson = fs.readFileSync("package.json", "utf8");
const workerTsconfig = fs.readFileSync("tsconfig.worker.json", "utf8");

assert.equal(GIS_1_0_SPRINT_8_AUTHORIZATION, "GIS_1_0_SPRINT_8_LICENSING_AND_ATTRIBUTION_RESOLUTION_GATE_AUTHORIZED");
assert.equal(GIS_1_0_SPRINT_8_CERTIFICATION, "GIS_1_0_SPRINT_8_LICENSING_AND_ATTRIBUTION_RESOLUTION_GATE_CERTIFIED");
assert.equal(GIS_SPRINT_8_BOUNDARY_NOTE, "LICENSING_RESOLUTION_DOES_NOT_AUTHORIZE_TECHNICAL_CONNECTION_OR_PILOT_EXECUTION");

for (const file of sprint8Files) {
  const contents = fs.readFileSync(file, "utf8");
  assert.equal(contents.includes("@prisma/client"), false, `Sprint 8 must not import Prisma: ${file}`);
  assert.equal(contents.includes("PrismaClient"), false, `Sprint 8 must not reference PrismaClient: ${file}`);
  assert.equal(/\bprisma\./.test(contents), false, `Sprint 8 must not call Prisma: ${file}`);
  assert.equal(/(?:^|[\s;])(?:SELECT|INSERT\s+INTO|UPDATE\s+\w|DELETE\s+FROM|CREATE\s+TABLE|ALTER\s+TABLE|DROP\s+TABLE)\b/i.test(contents), false, `Sprint 8 must not contain SQL: ${file}`);
  assert.equal(/\bmigrations?\b/i.test(contents), false, `Sprint 8 must not reference migrations: ${file}`);
  assert.equal(/\bfetch\s*\(/.test(contents), false, `Sprint 8 must not fetch: ${file}`);
  assert.equal(/\b(?:axios|undici|got|superagent|http\.request|https\.request)\b/i.test(contents), false, `Sprint 8 must not use HTTP clients: ${file}`);
  assert.equal(/playwright|puppeteer|chromium|browser/i.test(contents), false, `Sprint 8 must not use browser automation: ${file}`);
  assert.equal(/scrapingLibrary|cheerio|jsdom|crawler\s*\(|crawl\s*\(|scrape\s*\(/i.test(contents), false, `Sprint 8 must not scrape: ${file}`);
  assert.equal(/process\.env|DATABASE_URL|DIRECT_URL|SUPABASE|TYPESENSE|RESEND|SECRET|TOKEN|PASSWORD|API_KEY|providerApiKey/i.test(contents), false, `Sprint 8 must not read credentials or environment: ${file}`);
  assert.equal(/contactProvider\s*\(|createProviderAccount\s*\(|acceptContract\s*\(|purchaseProvider\s*\(|requestDemo\s*\(|obtainPricing\s*\(|registerProvider\s*\(/i.test(contents), false, `Sprint 8 must not create contact/account/procurement workflows: ${file}`);
  assert.equal(/providerAdapter\s*\(|connectProvider\s*\(|acquireProvider\s*\(|licensedDataFeed\s*\(|realProviderAdapter\s*\(/i.test(contents), false, `Sprint 8 must not connect providers or acquire data: ${file}`);
  assert.equal(/scheduler|setInterval|pollProvider|providerPolling|queue/i.test(contents), false, `Sprint 8 must not schedule, poll, or integrate queues: ${file}`);
  assert.equal(/runtimeRegistry\s*\(|dispatcher\s*\(|registerRuntime\s*\(|featureFlag\s*\(/i.test(contents), false, `Sprint 8 must not register runtime behavior: ${file}`);
  assert.equal(/(?:geographic|property|prisma)\w*\.(?:create|createMany|update|updateMany|upsert|delete|deleteMany)\s*\(|\$transaction|executeRaw/i.test(contents), false, `Sprint 8 must not contain production write patterns: ${file}`);
  assert.equal(/customerVisibilityAuthorized:\s*true|redistributionAuthorized:\s*true|runtimeAuthorized:\s*true|downstreamAuthorized:\s*true|acquisitionAuthorized:\s*true|persistenceAuthorized:\s*true|providerConnectionAuthorized:\s*true|adapterExecutionAuthorized:\s*true/i.test(contents), false, `Sprint 8 must not authorize execution or use: ${file}`);
}

for (const prohibitedPath of [
  "app/api/geographic-intelligence/licensing-attribution/route.ts",
  "app/api/admin/geographic-intelligence/licensing-attribution/route.ts",
  "app/geographic-intelligence/licensing-attribution/page.tsx",
  "app/gis/licensing-attribution/page.tsx",
]) {
  assert.equal(fs.existsSync(prohibitedPath), false, `Sprint 8 must not introduce route/page: ${prohibitedPath}`);
}

for (const runtimeRoot of ["app", "components", "lib/search", "lib/mls", "lib/typesense", "lib/runtime", "lib/alerts", "lib/email", "workers"]) {
  for (const file of listSourceFiles(runtimeRoot)) {
    const contents = fs.readFileSync(file, "utf8");
    assert.equal(contents.includes("licensingResolution"), false, `Runtime/downstream file must not import Sprint 8 licensing resolution: ${file}`);
    assert.equal(contents.includes("GIS_1_0_SPRINT_8"), false, `Runtime/downstream file must not reference Sprint 8: ${file}`);
  }
}

const resolution = buildGisSprint8LicensingResolution();
const attribution = buildGisSprint8AttributionRecord();
const disclaimer = buildGisSprint8DisclaimerRecord();
const matrix = buildGisSprint8ConditionMatrix();
const scenarios = certifyGisSprint8LicensingScenarios();
const invariants = assertGisSprint8LicensingResolution(resolution, GIS_SPRINT_8_SOURCE_REFERENCES, attribution, disclaimer, matrix);

assert.equal(GIS_SPRINT_8_SOURCE_REFERENCES.length, 5);
assert.equal(invariants.length, 50);
assert.equal(resolution.providerInventoryId, "colorado-geological-survey");
assert.equal(resolution.datasetOrServiceId, "CGS_COLORADO_LANDSLIDE_INVENTORY_SERVICE_FAMILY");
assert.equal(resolution.publicAccessState, "PERMITTED_WITH_CONDITIONS");
assert.equal(resolution.attributionState, "REQUIRES_ATTRIBUTION");
assert.equal(resolution.disclaimerState, "REQUIRES_DISCLAIMER");
assert.equal(resolution.customerDisplayState, "PROHIBITED");
assert.equal(resolution.redistributionState, "PROHIBITED");
assert.equal(Object.values(resolution.executionFlags).every((value) => value === false), true);
assert.equal(matrix.every((entry) => entry.allowedForSprint8 === false && entry.allowedForFutureExecution === false), true);
assert.equal(scenarios.scenarioL, "LICENSING_GATE_RESOLVED_FOR_TECHNICAL_FEASIBILITY_REVIEW");
assert.equal(scenarios.scenarioN, "ZERO_PROVIDER_CONTACT_AND_ZERO_DATA_ACQUISITION");
assert.equal(gisSprint8LicensingResolutionFingerprint(), gisSprint8LicensingResolutionFingerprint());

assert.equal(fs.readFileSync("lib/gof/coloradoProductionRetrievalReadinessAdapter.ts", "utf8").includes("GIS_1_0_SPRINT_8"), false, "Sprint 8 must not modify GOF behavior.");
assert.equal(fs.readFileSync("lib/ekcp/coloradoEnterpriseGeographicConsumptionReadiness.ts", "utf8").includes("GIS_1_0_SPRINT_8"), false, "Sprint 8 must not modify EKCP behavior.");
assert.equal(fs.readFileSync("lib/eip/productionInternalGeographicReadAdapter.ts", "utf8").includes("GIS_1_0_SPRINT_8"), false, "Sprint 8 must not modify EIP Sprint 7 behavior.");
assert.equal(fs.readFileSync("lib/gio/persistence.ts", "utf8").includes("GIS_1_0_SPRINT_8"), false, "Sprint 8 must not modify GIO behavior.");
assert.ok(packageJson.includes("check:geographic-intelligence-licensing-attribution-safety"));
assert.ok(packageJson.includes("certify:geographic-intelligence-licensing-attribution-resolution"));
assert.ok(workerTsconfig.includes("scripts/checkGeographicIntelligenceLicensingAttributionSafety.ts"));
assert.ok(workerTsconfig.includes("scripts/certifyGeographicIntelligenceLicensingAttributionResolution.ts"));

console.log("[geographic-intelligence-licensing-attribution-safety] ok: Sprint 8 licensing attribution gate is official-source-backed, deterministic, CGS landslide-only, attribution-preserving, disclaimer-preserving, no-contact, no-account, no-credential, no-terms-acceptance, no-live-call, acquisition-free, adapter-execution-free, persistence-free, retrieval-free, runtime-inert, relationship-free, customer-display-prohibited, redistribution-prohibited, Sprint-9-unauthorized, and isolated from certified GOF/EKCP/EIP/GIO/GIS Sprint 1-Sprint 7 behavior.");

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
