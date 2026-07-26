import assert from "node:assert/strict";
import fs from "node:fs";

import {
  GIS_1_0_SPRINT_6_AUTHORIZATION,
  GIS_1_0_SPRINT_6_CERTIFICATION,
  GIS_SPRINT_6_BOUNDARY_NOTE,
} from "../lib/geographic-intelligence/providerDueDiligenceContract.js";
import {
  GIS_SPRINT_6_SOURCE_REFERENCES,
  buildGisSprint6DueDiligenceComparison,
  buildGisSprint6ProviderDueDiligenceRecords,
  certifyGisSprint6ProviderDueDiligenceScenarios,
  gisSprint6ProviderDueDiligenceFingerprint,
} from "../lib/geographic-intelligence/fixtures/gisSprint6ProviderDueDiligenceFixtures.js";
import { assertGisSprint6DueDiligenceRecords } from "../lib/geographic-intelligence/providerDueDiligenceValidation.js";

const sprint6Files = [
  "lib/geographic-intelligence/providerDueDiligenceContract.ts",
  "lib/geographic-intelligence/providerDueDiligenceValidation.ts",
  "lib/geographic-intelligence/fixtures/gisSprint6ProviderDueDiligenceFixtures.ts",
];
const packageJson = fs.readFileSync("package.json", "utf8");
const workerTsconfig = fs.readFileSync("tsconfig.worker.json", "utf8");

assert.equal(GIS_1_0_SPRINT_6_AUTHORIZATION, "GIS_1_0_SPRINT_6_CONTROLLED_PROVIDER_DUE_DILIGENCE_AUTHORIZED");
assert.equal(GIS_1_0_SPRINT_6_CERTIFICATION, "GIS_1_0_SPRINT_6_CONTROLLED_PROVIDER_DUE_DILIGENCE_CERTIFIED");
assert.equal(GIS_SPRINT_6_BOUNDARY_NOTE, "CONTROLLED_PROVIDER_DUE_DILIGENCE_DOES_NOT_AUTHORIZE_PROVIDER_USE");

for (const file of sprint6Files) {
  const contents = fs.readFileSync(file, "utf8");
  assert.equal(contents.includes("@prisma/client"), false, `Sprint 6 must not import Prisma: ${file}`);
  assert.equal(contents.includes("PrismaClient"), false, `Sprint 6 must not reference PrismaClient: ${file}`);
  assert.equal(/\bprisma\./.test(contents), false, `Sprint 6 must not call Prisma: ${file}`);
  assert.equal(/(?:^|[\s;])(?:SELECT|INSERT\s+INTO|UPDATE\s+\w|DELETE\s+FROM|CREATE\s+TABLE|ALTER\s+TABLE|DROP\s+TABLE)\b/i.test(contents), false, `Sprint 6 must not contain SQL: ${file}`);
  assert.equal(/\bmigrations?\b/i.test(contents), false, `Sprint 6 must not reference migrations: ${file}`);
  assert.equal(/\bfetch\s*\(/.test(contents), false, `Sprint 6 must not fetch: ${file}`);
  assert.equal(/\b(?:axios|undici|got|superagent|http\.request|https\.request)\b/i.test(contents), false, `Sprint 6 must not use HTTP clients: ${file}`);
  assert.equal(/playwright|puppeteer|chromium|browser/i.test(contents), false, `Sprint 6 must not use browser automation: ${file}`);
  assert.equal(/scrapingLibrary|cheerio|jsdom|crawler\s*\(|crawl\s*\(|scrape\s*\(/i.test(contents), false, `Sprint 6 must not scrape: ${file}`);
  assert.equal(/process\.env|DATABASE_URL|DIRECT_URL|SUPABASE|TYPESENSE|RESEND|SECRET|TOKEN|PASSWORD|API_KEY|providerApiKey/i.test(contents), false, `Sprint 6 must not read credentials or environment: ${file}`);
  assert.equal(/contactProvider\s*\(|createProviderAccount\s*\(|acceptContract\s*\(|purchaseProvider\s*\(|requestDemo\s*\(|obtainPricing\s*\(/i.test(contents), false, `Sprint 6 must not create contact/account/procurement workflows: ${file}`);
  assert.equal(/providerAdapter\s*\(|connectProvider\s*\(|acquireProvider\s*\(|licensedDataFeed\s*\(|realProviderAdapter\s*\(/i.test(contents), false, `Sprint 6 must not connect providers or acquire data: ${file}`);
  assert.equal(/scheduler|setInterval|pollProvider|providerPolling|queue/i.test(contents), false, `Sprint 6 must not schedule, poll, or integrate queues: ${file}`);
  assert.equal(/runtimeRegistry\s*\(|dispatcher\s*\(|registerRuntime\s*\(|featureFlag\s*\(/i.test(contents), false, `Sprint 6 must not register runtime behavior: ${file}`);
  assert.equal(/(?:geographic|property|prisma)\w*\.(?:create|createMany|update|updateMany|upsert|delete|deleteMany)\s*\(|\$transaction|executeRaw/i.test(contents), false, `Sprint 6 must not contain production write patterns: ${file}`);
  assert.equal(/customerDisplayAuthorized:\s*true|redistributionAuthorized:\s*true|runtimeAuthorized:\s*true|downstreamIntegrationAuthorized:\s*true|acquisitionAuthorized:\s*true|providerUseAuthorized:\s*true/i.test(contents), false, `Sprint 6 must not authorize use: ${file}`);
}

for (const prohibitedPath of [
  "app/api/geographic-intelligence/provider-due-diligence/route.ts",
  "app/api/admin/geographic-intelligence/provider-due-diligence/route.ts",
  "app/geographic-intelligence/provider-due-diligence/page.tsx",
  "app/gis/provider-due-diligence/page.tsx",
]) {
  assert.equal(fs.existsSync(prohibitedPath), false, `Sprint 6 must not introduce route/page: ${prohibitedPath}`);
}

for (const runtimeRoot of ["app", "components", "lib/search", "lib/mls", "lib/typesense", "lib/runtime", "lib/alerts", "lib/email", "workers"]) {
  for (const file of listSourceFiles(runtimeRoot)) {
    const contents = fs.readFileSync(file, "utf8");
    assert.equal(contents.includes("providerDueDiligence"), false, `Runtime/downstream file must not import Sprint 6 due diligence: ${file}`);
    assert.equal(contents.includes("GIS_1_0_SPRINT_6"), false, `Runtime/downstream file must not reference Sprint 6: ${file}`);
  }
}

const records = buildGisSprint6ProviderDueDiligenceRecords();
const comparison = buildGisSprint6DueDiligenceComparison(records);
const invariants = assertGisSprint6DueDiligenceRecords(records, GIS_SPRINT_6_SOURCE_REFERENCES, comparison);
const scenarios = certifyGisSprint6ProviderDueDiligenceScenarios();

assert.equal(records.length, 4);
assert.equal(GIS_SPRINT_6_SOURCE_REFERENCES.length, 11);
assert.equal(invariants.length, 51);
assert.equal(scenarios.scenarioA, "OFFICIAL_DOCUMENTATION_VERIFIED");
assert.equal(scenarios.scenarioB, "PARTIALLY_VERIFIED");
assert.equal(scenarios.scenarioC, "LICENSING_REVIEW_REQUIRED");
assert.equal(scenarios.scenarioD, "ACCESS_METHOD_VERIFIED");
assert.equal(scenarios.scenarioE, "COMMERCIAL_REVIEW_REQUIRED");
assert.equal(scenarios.scenarioF, "ATTRIBUTION_REQUIREMENT_IDENTIFIED");
assert.equal(scenarios.scenarioG, "CONFLICTING_EVIDENCE");
assert.equal(scenarios.scenarioH, "VERIFICATION_REQUIRED");
assert.equal(scenarios.scenarioI, "SUPPLEMENTAL_SOURCE_ONLY");
assert.equal(scenarios.scenarioJ, "FALLBACK_SOURCE_CANDIDATE");
assert.equal(scenarios.scenarioK, "RECOMMENDED_FOR_CONTROLLED_PROVIDER_PILOT_AUTHORIZATION_REVIEW");
assert.equal(scenarios.scenarioL, "LEGAL_REVIEW_REQUIRED");
assert.equal(scenarios.scenarioM, "TECHNICAL_REVIEW_REQUIRED");
assert.equal(scenarios.scenarioN, "ZERO_PROVIDER_DATA_ACQUISITION");
assert.equal(gisSprint6ProviderDueDiligenceFingerprint(), gisSprint6ProviderDueDiligenceFingerprint());

for (const record of records) {
  assert.equal(record.internalOnly, true);
  assert.equal(Object.values(record.activation).every((value) => value === false), true);
  assert.equal(Object.values(record.authorizationFlags).every((value) => value === false), true);
  assert.equal(record.officialSourceReferenceIds.every((id) => GIS_SPRINT_6_SOURCE_REFERENCES.some((source) => source.referenceId === id)), true);
}

assert.equal(comparison.providerUseAuthorized, false);
assert.deepEqual([...comparison.pilotAuthorizationReviewCandidates].sort(), ["colorado-geological-survey", "u-s-geological-survey"]);
assert.equal(fs.readFileSync("lib/gof/coloradoProductionRetrievalReadinessAdapter.ts", "utf8").includes("GIS_1_0_SPRINT_6"), false, "Sprint 6 must not modify GOF behavior.");
assert.equal(fs.readFileSync("lib/ekcp/coloradoEnterpriseGeographicConsumptionReadiness.ts", "utf8").includes("GIS_1_0_SPRINT_6"), false, "Sprint 6 must not modify EKCP behavior.");
assert.equal(fs.readFileSync("lib/eip/productionInternalGeographicReadAdapter.ts", "utf8").includes("GIS_1_0_SPRINT_6"), false, "Sprint 6 must not modify Sprint 7 behavior.");
assert.ok(packageJson.includes("check:geographic-intelligence-provider-due-diligence-safety"));
assert.ok(packageJson.includes("certify:geographic-intelligence-provider-due-diligence"));
assert.ok(workerTsconfig.includes("scripts/checkGeographicIntelligenceProviderDueDiligenceSafety.ts"));
assert.ok(workerTsconfig.includes("scripts/certifyGeographicIntelligenceProviderDueDiligence.ts"));

console.log("[geographic-intelligence-provider-due-diligence-safety] ok: Sprint 6 due diligence is official-source-backed, deterministic, internal-only, no-contact, no-account, no-credential, no-terms-acceptance, acquisition-free, adapter-free, persistence-free, retrieval-free, runtime-inert, relationship-free, customer-invisible, Sprint-7-unauthorized, and isolated from certified GOF/EKCP/Sprint 7/Sprint 1-Sprint 5 behavior.");

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
