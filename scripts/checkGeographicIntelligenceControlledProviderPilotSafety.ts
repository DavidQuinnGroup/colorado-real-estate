import assert from "node:assert/strict";
import fs from "node:fs";

import {
  GIS_1_0_SPRINT_7_AUTHORIZATION,
  GIS_1_0_SPRINT_7_CERTIFICATION,
  GIS_SPRINT_7_BOUNDARY_NOTE,
} from "../lib/geographic-intelligence/controlledProviderPilotContract.js";
import {
  buildGisSprint7ControlledProviderPilotDesign,
  buildGisSprint7DesignAuditRecord,
  certifyGisSprint7ControlledProviderPilotScenarios,
  gisSprint7ControlledProviderPilotFingerprint,
} from "../lib/geographic-intelligence/fixtures/gisSprint7ControlledProviderPilotFixtures.js";
import { assertGisSprint7ControlledProviderPilotDesign } from "../lib/geographic-intelligence/controlledProviderPilotValidation.js";

const sprint7Files = [
  "lib/geographic-intelligence/controlledProviderPilotContract.ts",
  "lib/geographic-intelligence/controlledProviderPilotValidation.ts",
  "lib/geographic-intelligence/fixtures/gisSprint7ControlledProviderPilotFixtures.ts",
];
const packageJson = fs.readFileSync("package.json", "utf8");
const workerTsconfig = fs.readFileSync("tsconfig.worker.json", "utf8");

assert.equal(GIS_1_0_SPRINT_7_AUTHORIZATION, "GIS_1_0_SPRINT_7_CONTROLLED_PROVIDER_PILOT_AUTHORIZATION_AND_DESIGN_AUTHORIZED");
assert.equal(GIS_1_0_SPRINT_7_CERTIFICATION, "GIS_1_0_SPRINT_7_CONTROLLED_PROVIDER_PILOT_AUTHORIZATION_AND_DESIGN_CERTIFIED");
assert.equal(GIS_SPRINT_7_BOUNDARY_NOTE, "CONTROLLED_PROVIDER_PILOT_DESIGN_DOES_NOT_AUTHORIZE_LIVE_EXECUTION");

for (const file of sprint7Files) {
  const contents = fs.readFileSync(file, "utf8");
  assert.equal(contents.includes("@prisma/client"), false, `Sprint 7 must not import Prisma: ${file}`);
  assert.equal(contents.includes("PrismaClient"), false, `Sprint 7 must not reference PrismaClient: ${file}`);
  assert.equal(/\bprisma\./.test(contents), false, `Sprint 7 must not call Prisma: ${file}`);
  assert.equal(/(?:^|[\s;])(?:SELECT|INSERT\s+INTO|UPDATE\s+\w|DELETE\s+FROM|CREATE\s+TABLE|ALTER\s+TABLE|DROP\s+TABLE)\b/i.test(contents), false, `Sprint 7 must not contain SQL: ${file}`);
  assert.equal(/\bmigrations?\b/i.test(contents), false, `Sprint 7 must not reference migrations: ${file}`);
  assert.equal(/\bfetch\s*\(/.test(contents), false, `Sprint 7 must not fetch: ${file}`);
  assert.equal(/\b(?:axios|undici|got|superagent|http\.request|https\.request)\b/i.test(contents), false, `Sprint 7 must not use HTTP clients: ${file}`);
  assert.equal(/http:\/\/|https:\/\//i.test(contents), false, `Sprint 7 must not hard-code live URLs: ${file}`);
  assert.equal(/playwright|puppeteer|chromium|browser/i.test(contents), false, `Sprint 7 must not use browser automation: ${file}`);
  assert.equal(/scrapingLibrary|cheerio|jsdom|crawler\s*\(|crawl\s*\(|scrape\s*\(/i.test(contents), false, `Sprint 7 must not scrape: ${file}`);
  assert.equal(/process\.env|DATABASE_URL|DIRECT_URL|SUPABASE|TYPESENSE|RESEND|SECRET|TOKEN|PASSWORD|API_KEY|providerApiKey/i.test(contents), false, `Sprint 7 must not read credentials or environment: ${file}`);
  assert.equal(/contactProvider\s*\(|createProviderAccount\s*\(|acceptContract\s*\(|purchaseProvider\s*\(|requestDemo\s*\(|obtainPricing\s*\(/i.test(contents), false, `Sprint 7 must not create contact/account/procurement workflows: ${file}`);
  assert.equal(/providerAdapter\s*\(|connectProvider\s*\(|acquireProvider\s*\(|licensedDataFeed\s*\(|realProviderAdapter\s*\(/i.test(contents), false, `Sprint 7 must not connect providers or acquire data: ${file}`);
  assert.equal(/scheduler|setInterval|pollProvider|providerPolling|queue/i.test(contents), false, `Sprint 7 must not schedule, poll, or integrate queues: ${file}`);
  assert.equal(/runtimeRegistry\s*\(|dispatcher\s*\(|registerRuntime\s*\(|featureFlag\s*\(/i.test(contents), false, `Sprint 7 must not register runtime behavior: ${file}`);
  assert.equal(/(?:geographic|property|prisma)\w*\.(?:create|createMany|update|updateMany|upsert|delete|deleteMany)\s*\(|\$transaction|executeRaw/i.test(contents), false, `Sprint 7 must not contain production write patterns: ${file}`);
  assert.equal(/customerVisibilityAuthorized:\s*true|redistributionAuthorized:\s*true|runtimeAuthorized:\s*true|downstreamAuthorized:\s*true|acquisitionAuthorized:\s*true|persistenceAuthorized:\s*true|liveExecutionAuthorized:\s*true/i.test(contents), false, `Sprint 7 must not authorize execution or use: ${file}`);
}

for (const prohibitedPath of [
  "app/api/geographic-intelligence/controlled-provider-pilot/route.ts",
  "app/api/admin/geographic-intelligence/controlled-provider-pilot/route.ts",
  "app/geographic-intelligence/controlled-provider-pilot/page.tsx",
  "app/gis/controlled-provider-pilot/page.tsx",
]) {
  assert.equal(fs.existsSync(prohibitedPath), false, `Sprint 7 must not introduce route/page: ${prohibitedPath}`);
}

for (const runtimeRoot of ["app", "components", "lib/search", "lib/mls", "lib/typesense", "lib/runtime", "lib/alerts", "lib/email", "workers"]) {
  for (const file of listSourceFiles(runtimeRoot)) {
    const contents = fs.readFileSync(file, "utf8");
    assert.equal(contents.includes("controlledProviderPilot"), false, `Runtime/downstream file must not import Sprint 7 pilot design: ${file}`);
    assert.equal(contents.includes("GIS_1_0_SPRINT_7_CONTROLLED_PROVIDER"), false, `Runtime/downstream file must not reference GIS Sprint 7 pilot design: ${file}`);
  }
}

const design = buildGisSprint7ControlledProviderPilotDesign();
const audit = buildGisSprint7DesignAuditRecord(design);
const invariants = assertGisSprint7ControlledProviderPilotDesign(design);
const scenarios = certifyGisSprint7ControlledProviderPilotScenarios();

assert.equal(invariants.length, 60);
assert.equal(design.providerInventoryEntryId, "colorado-geological-survey");
assert.equal(design.exactDatasetOrServiceId, "CGS_COLORADO_LANDSLIDE_INVENTORY_SERVICE_FAMILY");
assert.equal(design.dryRunRequired, true);
assert.equal(Object.values(design.executionFlags).every((value) => value === false), true);
assert.equal(audit.requestCount, 0);
assert.equal(audit.recordCount, 0);
assert.equal(audit.persistenceCount, 0);
assert.equal(audit.productionWriteCount, 0);
assert.equal(audit.runtimeActivationCount, 0);
assert.equal(audit.customerVisibleCount, 0);
assert.equal(scenarios.scenarioA, "PILOT_DESIGN_COMPLETE_EXECUTION_NOT_AUTHORIZED");
assert.equal(scenarios.scenarioN, "ZERO_LIVE_PILOT_EXECUTION");
assert.equal(gisSprint7ControlledProviderPilotFingerprint(), gisSprint7ControlledProviderPilotFingerprint());

assert.equal(fs.readFileSync("lib/gof/coloradoProductionRetrievalReadinessAdapter.ts", "utf8").includes("GIS_1_0_SPRINT_7_CONTROLLED_PROVIDER"), false, "Sprint 7 must not modify GOF behavior.");
assert.equal(fs.readFileSync("lib/ekcp/coloradoEnterpriseGeographicConsumptionReadiness.ts", "utf8").includes("GIS_1_0_SPRINT_7_CONTROLLED_PROVIDER"), false, "Sprint 7 must not modify EKCP behavior.");
assert.equal(fs.readFileSync("lib/eip/productionInternalGeographicReadAdapter.ts", "utf8").includes("GIS_1_0_SPRINT_7_CONTROLLED_PROVIDER"), false, "Sprint 7 must not modify EIP Sprint 7 behavior.");
assert.equal(fs.readFileSync("lib/gio/persistence.ts", "utf8").includes("GIS_1_0_SPRINT_7_CONTROLLED_PROVIDER"), false, "Sprint 7 must not modify GIO behavior.");
assert.ok(packageJson.includes("check:geographic-intelligence-controlled-provider-pilot-safety"));
assert.ok(packageJson.includes("certify:geographic-intelligence-controlled-provider-pilot-design"));
assert.ok(workerTsconfig.includes("scripts/checkGeographicIntelligenceControlledProviderPilotSafety.ts"));
assert.ok(workerTsconfig.includes("scripts/certifyGeographicIntelligenceControlledProviderPilotDesign.ts"));

console.log("[geographic-intelligence-controlled-provider-pilot-safety] ok: Sprint 7 controlled provider pilot design is deterministic, CGS-only, landslide-inventory-only, design-only, dry-run-first, no-contact, no-account, no-credential, no-terms-acceptance, no-live-call, acquisition-free, adapter-execution-free, persistence-free, retrieval-free, runtime-inert, relationship-free, customer-invisible, Sprint-8-unauthorized, and isolated from certified GOF/EKCP/EIP/GIO/GIS Sprint 1-Sprint 6 behavior.");

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
