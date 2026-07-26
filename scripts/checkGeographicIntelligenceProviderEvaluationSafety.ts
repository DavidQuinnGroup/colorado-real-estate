import assert from "node:assert/strict";
import fs from "node:fs";

import {
  GIS_1_0_SPRINT_5_AUTHORIZATION,
  GIS_1_0_SPRINT_5_CERTIFICATION,
  GIS_SPRINT_5_BOUNDARY_NOTE,
} from "../lib/geographic-intelligence/providerEvaluationContract.js";
import {
  GIS_SPRINT_5_CANDIDATE_COUNT,
  GIS_SPRINT_5_CRITERIA_COUNT,
  buildGisSprint5ProviderEvaluationFixture,
  certifyGisSprint5ProviderEvaluationScenarios,
  gisSprint5ProviderEvaluationFingerprint,
} from "../lib/geographic-intelligence/fixtures/gisSprint5ProviderEvaluationFixtures.js";
import { assertGisSprint5WeightsNormalized } from "../lib/geographic-intelligence/providerEvaluationScoring.js";
import { mandatoryGateBlocksImplementation } from "../lib/geographic-intelligence/providerEvaluationGates.js";

const sprint5Files = [
  "lib/geographic-intelligence/providerEvaluationContract.ts",
  "lib/geographic-intelligence/providerEvaluationScoring.ts",
  "lib/geographic-intelligence/providerEvaluationGates.ts",
  "lib/geographic-intelligence/providerSelectionGovernance.ts",
  "lib/geographic-intelligence/minimumProviderSet.ts",
  "lib/geographic-intelligence/fixtures/gisSprint5ProviderEvaluationFixtures.ts",
];
const packageJson = fs.readFileSync("package.json", "utf8");
const workerTsconfig = fs.readFileSync("tsconfig.worker.json", "utf8");

assert.equal(GIS_1_0_SPRINT_5_AUTHORIZATION, "GIS_1_0_SPRINT_5_PROVIDER_EVALUATION_AND_SELECTION_GOVERNANCE_AUTHORIZED");
assert.equal(GIS_1_0_SPRINT_5_CERTIFICATION, "GIS_1_0_SPRINT_5_PROVIDER_EVALUATION_AND_SELECTION_GOVERNANCE_CERTIFIED");
assert.equal(GIS_SPRINT_5_BOUNDARY_NOTE, "PROVIDER_EVALUATION_DOES_NOT_AUTHORIZE_PROVIDER_USE");

for (const file of sprint5Files) {
  const contents = fs.readFileSync(file, "utf8");
  assert.equal(contents.includes("@prisma/client"), false, `Sprint 5 must not import Prisma: ${file}`);
  assert.equal(contents.includes("PrismaClient"), false, `Sprint 5 must not reference PrismaClient: ${file}`);
  assert.equal(/\bprisma\./.test(contents), false, `Sprint 5 must not call Prisma: ${file}`);
  assert.equal(/(?:^|[\s;])(?:SELECT|INSERT\s+INTO|UPDATE\s+\w|DELETE\s+FROM|CREATE\s+TABLE|ALTER\s+TABLE|DROP\s+TABLE)\b/i.test(contents), false, `Sprint 5 must not contain SQL: ${file}`);
  assert.equal(/\bmigrations?\b/i.test(contents), false, `Sprint 5 must not reference migrations: ${file}`);
  assert.equal(/\bfetch\s*\(/.test(contents), false, `Sprint 5 must not fetch: ${file}`);
  assert.equal(/\b(?:axios|undici|got|superagent|http\.request|https\.request)\b/i.test(contents), false, `Sprint 5 must not use HTTP clients: ${file}`);
  assert.equal(/playwright|puppeteer|chromium|browser/i.test(contents), false, `Sprint 5 must not use browser automation: ${file}`);
  assert.equal(/scrapingLibrary|cheerio|jsdom|crawler\s*\(|crawl\s*\(|scrape\s*\(/i.test(contents), false, `Sprint 5 must not scrape: ${file}`);
  assert.equal(/process\.env|DATABASE_URL|DIRECT_URL|SUPABASE|TYPESENSE|RESEND|SECRET|TOKEN|PASSWORD|API_KEY|providerApiKey/i.test(contents), false, `Sprint 5 must not read credentials or environment: ${file}`);
  assert.equal(/contactProvider\s*\(|createProviderAccount\s*\(|acceptContract\s*\(|purchaseProvider\s*\(|requestDemo\s*\(|obtainPricing\s*\(/i.test(contents), false, `Sprint 5 must not create contact/account/procurement workflows: ${file}`);
  assert.equal(/connectProvider\s*\(|acquireProvider\s*\(|licensedDataFeed\s*\(|realProviderAdapter\s*\(/i.test(contents), false, `Sprint 5 must not connect providers or acquire data: ${file}`);
  assert.equal(/scheduler|setInterval|pollProvider|providerPolling|queue/i.test(contents), false, `Sprint 5 must not schedule, poll, or integrate queues: ${file}`);
  assert.equal(/runtimeRegistry\s*\(|dispatcher\s*\(|registerRuntime\s*\(|featureFlag\s*\(/i.test(contents), false, `Sprint 5 must not register runtime behavior: ${file}`);
  assert.equal(/(?:geographic|property|prisma)\w*\.(?:create|createMany|update|updateMany|upsert|delete|deleteMany)\s*\(|\$transaction|executeRaw/i.test(contents), false, `Sprint 5 must not contain production write patterns: ${file}`);
  assert.equal(/customerDisplayAuthorized:\s*true|redistributionAuthorized:\s*true|runtimeAuthorized:\s*true|downstreamIntegrationAuthorized:\s*true|acquisitionAuthorized:\s*true/i.test(contents), false, `Sprint 5 must not authorize use: ${file}`);
}

for (const prohibitedPath of [
  "app/api/geographic-intelligence/provider-evaluation/route.ts",
  "app/api/admin/geographic-intelligence/provider-evaluation/route.ts",
  "app/geographic-intelligence/provider-evaluation/page.tsx",
  "app/gis/provider-evaluation/page.tsx",
]) {
  assert.equal(fs.existsSync(prohibitedPath), false, `Sprint 5 must not introduce route/page: ${prohibitedPath}`);
}

for (const runtimeRoot of ["app", "components", "lib/search", "lib/mls", "lib/typesense", "lib/runtime", "lib/alerts", "lib/email", "workers"]) {
  for (const file of listSourceFiles(runtimeRoot)) {
    const contents = fs.readFileSync(file, "utf8");
    assert.equal(contents.includes("providerEvaluation"), false, `Runtime/downstream file must not import Sprint 5 evaluation: ${file}`);
    assert.equal(contents.includes("GIS_1_0_SPRINT_5"), false, `Runtime/downstream file must not reference Sprint 5: ${file}`);
  }
}

assertGisSprint5WeightsNormalized();
const evaluation = buildGisSprint5ProviderEvaluationFixture();
const scenarios = certifyGisSprint5ProviderEvaluationScenarios();
assert.equal(evaluation.criteria.length, GIS_SPRINT_5_CRITERIA_COUNT);
assert.equal(evaluation.candidateEvaluations.length, GIS_SPRINT_5_CANDIDATE_COUNT);
assert.equal(Object.values(evaluation.activation).every((value) => value === false), true);
assert.equal(evaluation.customerDisplayAuthorized, false);
assert.equal(evaluation.redistributionAuthorized, false);
assert.equal(evaluation.recommendedMinimumProviderSet.providerUseAuthorized, false);
assert.equal(evaluation.recommendedMinimumProviderSet.dueDiligenceOnly, true);
assert.equal(evaluation.candidateEvaluations.every((candidate) => candidate.internalOnly && candidate.customerDisplayAuthorized === false && candidate.redistributionAuthorized === false), true);
assert.equal(evaluation.candidateEvaluations.every((candidate) => Object.values(candidate.activation).every((value) => value === false)), true);
assert.equal(evaluation.candidateEvaluations.some((candidate) => mandatoryGateBlocksImplementation(candidate.mandatoryGates)), true);
assert.equal(scenarios.scenarioN, "FAILED_CLOSED_MANDATORY_GATE");
assert.equal(gisSprint5ProviderEvaluationFingerprint(), gisSprint5ProviderEvaluationFingerprint());

assert.equal(fs.readFileSync("lib/gof/coloradoProductionRetrievalReadinessAdapter.ts", "utf8").includes("GIS_1_0_SPRINT_5"), false, "Sprint 5 must not modify GOF behavior.");
assert.equal(fs.readFileSync("lib/ekcp/coloradoEnterpriseGeographicConsumptionReadiness.ts", "utf8").includes("GIS_1_0_SPRINT_5"), false, "Sprint 5 must not modify EKCP behavior.");
assert.equal(fs.readFileSync("lib/eip/productionInternalGeographicReadAdapter.ts", "utf8").includes("GIS_1_0_SPRINT_5"), false, "Sprint 5 must not modify Sprint 7 behavior.");
assert.ok(packageJson.includes("check:geographic-intelligence-provider-evaluation-safety"));
assert.ok(packageJson.includes("certify:geographic-intelligence-provider-evaluation-governance"));
assert.ok(workerTsconfig.includes("scripts/checkGeographicIntelligenceProviderEvaluationSafety.ts"));
assert.ok(workerTsconfig.includes("scripts/certifyGeographicIntelligenceProviderEvaluationGovernance.ts"));

console.log("[geographic-intelligence-provider-evaluation-safety] ok: Sprint 5 provider evaluation is deterministic, capability-bounded, fixture-backed, uncertainty-preserving, gate-enforced, due-diligence-only, credential-free, network-free, acquisition-free, persistence-free, retrieval-free, runtime-inert, relationship-free, customer-invisible, and isolated from certified GOF/EKCP/Sprint 7/Sprint 1/Sprint 2/Sprint 3/Sprint 4 behavior.");

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
