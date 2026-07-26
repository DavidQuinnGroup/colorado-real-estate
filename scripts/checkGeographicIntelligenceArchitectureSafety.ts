import assert from "node:assert/strict";
import fs from "node:fs";

import {
  GIS_1_0_PROGRAM_AUTHORIZATION,
  GIS_1_0_SPRINT_1_CLASSIFICATION,
  GIS_FAIL_CLOSED_ACTIVATION,
  assertGisFailClosedActivation,
  isGisCustomerUseAllowed,
} from "../lib/geographic-intelligence/activationContract.js";
import {
  GIS_INITIAL_DOMAIN_REGISTRY,
  assertGisInitialDomainRegistryFailClosed,
} from "../lib/geographic-intelligence/domainRegistry.js";
import {
  GIS_SPRINT_1_CONTRACT_ONLY_COLORADO_SUBJECT,
  GIS_SPRINT_1_DERIVED_FIXTURE,
  GIS_SPRINT_1_FIXTURE_OBSERVATION,
  GIS_SPRINT_1_FORECAST_FIXTURE_OBSERVATION,
  GIS_SPRINT_1_PROVIDER_BOUNDARY_FIXTURE,
  GIS_SPRINT_1_SYNTHETIC_SUBJECT,
  GIS_SPRINT_1_UNKNOWN_LICENSE_EVIDENCE,
  assertGisSprint1FixturesGoverned,
  stableGisFingerprint,
} from "../lib/geographic-intelligence/fixtures/gisSprint1Fixtures.js";

const gisFiles = listSourceFiles("lib/geographic-intelligence");
const packageJson = fs.readFileSync("package.json", "utf8");
const workerTsconfig = fs.readFileSync("tsconfig.worker.json", "utf8");
const separatelyAuthorizedSprint6SourceReferenceFiles = new Set([
  "lib/geographic-intelligence/fixtures/gisSprint6ProviderDueDiligenceFixtures.ts",
]);

assert.equal(GIS_1_0_PROGRAM_AUTHORIZATION, "AUTHORIZED_FOR_ARCHITECTURE_AND_IMPLEMENTATION_PLANNING");
assert.equal(GIS_1_0_SPRINT_1_CLASSIFICATION, "GEOGRAPHIC_INTELLIGENCE_ARCHITECTURE_FOUNDATION");

for (const file of gisFiles) {
  const contents = fs.readFileSync(file, "utf8");
  assert.equal(contents.includes("@prisma/client"), false, `GIS architecture must not import Prisma: ${file}`);
  assert.equal(contents.includes("PrismaClient"), false, `GIS architecture must not reference PrismaClient: ${file}`);
  assert.equal(/\bprisma\./.test(contents), false, `GIS architecture must not call Prisma: ${file}`);
  assert.equal(/(?:^|[\s;])(?:SELECT|INSERT\s+INTO|UPDATE\s+\w|DELETE\s+FROM|CREATE\s+TABLE|ALTER\s+TABLE|DROP\s+TABLE)\b/i.test(contents), false, `GIS architecture must not contain SQL behavior: ${file}`);
  assert.equal(/\bfetch\s*\(/.test(contents), false, `GIS architecture must not fetch external resources: ${file}`);
  if (!separatelyAuthorizedSprint6SourceReferenceFiles.has(file)) {
    assert.equal(/http:\/\/|https:\/\//i.test(contents), false, `GIS architecture must not contain external URLs: ${file}`);
  }
  assert.equal(/process\.env|DATABASE_URL|DIRECT_URL|SUPABASE|TYPESENSE|RESEND|SECRET|TOKEN|PASSWORD|API_KEY/i.test(contents), false, `GIS architecture must not read credentials or environment: ${file}`);
  assert.equal(/playwright|puppeteer|chromium|browser/i.test(contents), false, `GIS architecture must not use browser automation: ${file}`);
  assert.equal(/mayScrape:\s*true|scrape\s*\(|crawler\s*\(|crawl\s*\(/i.test(contents), false, `GIS architecture must not scrape: ${file}`);
  assert.equal(/mayRegisterRuntime:\s*true|runtimeRegistry\s*\(|dispatcher\s*\(|registerRuntime\s*\(|featureFlag\s*\(/i.test(contents), false, `GIS architecture must not register runtime behavior: ${file}`);
  assert.equal(/(?:geographic|property|prisma)\w*\.(?:create|createMany|update|updateMany|upsert|delete|deleteMany)\s*\(|\$transaction|executeRaw/i.test(contents), false, `GIS architecture must not contain production write patterns: ${file}`);
}

for (const prohibitedPath of [
  "app/api/geographic-intelligence/route.ts",
  "app/api/admin/geographic-intelligence/route.ts",
  "app/geographic-intelligence/page.tsx",
  "app/gis/page.tsx",
]) {
  assert.equal(fs.existsSync(prohibitedPath), false, `GIS Sprint 1 must not introduce route/page: ${prohibitedPath}`);
}

for (const runtimeRoot of ["app", "components", "lib/search", "lib/mls", "lib/typesense", "lib/runtime", "lib/alerts", "lib/email", "workers"]) {
  for (const file of listSourceFiles(runtimeRoot)) {
    const contents = fs.readFileSync(file, "utf8");
    assert.equal(contents.includes("geographic-intelligence"), false, `Runtime/downstream file must not import GIS Sprint 1: ${file}`);
    assert.equal(contents.includes("GIS_1_0"), false, `Runtime/downstream file must not reference GIS Sprint 1: ${file}`);
  }
}

assertGisInitialDomainRegistryFailClosed();
assert.equal(GIS_INITIAL_DOMAIN_REGISTRY.length, 8);
for (const domain of GIS_INITIAL_DOMAIN_REGISTRY) {
  assert.equal(domain.lifecycle, "PROPOSED");
  assert.equal(domain.governanceState, "FOUNDATION_DEFINED");
  assert.equal(domain.acquisitionState, "NOT_AUTHORIZED");
  assert.equal(domain.persistenceState, "NOT_AUTHORIZED");
  assert.equal(domain.retrievalState, "NOT_AUTHORIZED");
  assert.equal(domain.enterpriseConsumptionState, "NOT_AUTHORIZED");
  assert.equal(domain.runtimeState, "NOT_AUTHORIZED");
  assert.equal(domain.downstreamIntegrationState, "NOT_AUTHORIZED");
  assert.equal(domain.customerVisibilityState, "NOT_AUTHORIZED");
  assertGisFailClosedActivation(domain.activation);
}

assertGisSprint1FixturesGoverned();
assert.equal(GIS_SPRINT_1_SYNTHETIC_SUBJECT.relationshipCount, 0);
assert.equal(GIS_SPRINT_1_CONTRACT_ONLY_COLORADO_SUBJECT.productionRuntimeRead, false);
assert.equal(GIS_SPRINT_1_UNKNOWN_LICENSE_EVIDENCE.internalOnly, true);
assert.equal(GIS_SPRINT_1_UNKNOWN_LICENSE_EVIDENCE.licensingClassification, "UNKNOWN");
assert.equal(GIS_SPRINT_1_UNKNOWN_LICENSE_EVIDENCE.permittedUse, "UNKNOWN");
assert.equal(isGisCustomerUseAllowed("UNKNOWN", "UNKNOWN", GIS_FAIL_CLOSED_ACTIVATION), false);
assert.equal(GIS_SPRINT_1_FIXTURE_OBSERVATION.internalOnly, true);
assert.equal(GIS_SPRINT_1_FIXTURE_OBSERVATION.evidenceIdentities.length > 0, true);
assert.equal(GIS_SPRINT_1_FORECAST_FIXTURE_OBSERVATION.observationKind, "FORECAST");
assert.ok(GIS_SPRINT_1_FORECAST_FIXTURE_OBSERVATION.metricOrAssertionIdentity.includes("forecast"));
assert.equal(GIS_SPRINT_1_DERIVED_FIXTURE.inputEvidenceIdentities.length > 0, true);
assert.equal(GIS_SPRINT_1_DERIVED_FIXTURE.inputObservationIdentities.length > 0, true);
assert.equal(GIS_SPRINT_1_DERIVED_FIXTURE.reproducible, true);
assert.equal(GIS_SPRINT_1_PROVIDER_BOUNDARY_FIXTURE.providerIdentity, "INVENTORY_CONTEXT_ONLY");
assert.equal(GIS_SPRINT_1_PROVIDER_BOUNDARY_FIXTURE.mayCallExternalService, false);
assert.equal(GIS_SPRINT_1_PROVIDER_BOUNDARY_FIXTURE.mayReadCredentials, false);
assert.equal(GIS_SPRINT_1_PROVIDER_BOUNDARY_FIXTURE.mayReadEnvironmentVariables, false);
assert.equal(GIS_SPRINT_1_PROVIDER_BOUNDARY_FIXTURE.mayScrape, false);
assert.equal(GIS_SPRINT_1_PROVIDER_BOUNDARY_FIXTURE.mayWriteProductionData, false);
assert.equal(GIS_SPRINT_1_PROVIDER_BOUNDARY_FIXTURE.mayRegisterRuntime, false);
assert.equal(GIS_SPRINT_1_PROVIDER_BOUNDARY_FIXTURE.mayPresentToCustomers, false);

assert.equal(stableGisFingerprint("GIS-S1-DETERMINISTIC"), stableGisFingerprint("GIS-S1-DETERMINISTIC"));
assert.notEqual(stableGisFingerprint("GIS-S1-DETERMINISTIC"), stableGisFingerprint("GIS-S1-DIFFERENT"));

assert.equal(fs.readFileSync("lib/enterprise-knowledge/geographicReadContract.ts", "utf8").includes("GIS_1_0"), false, "GIS Sprint 1 must not modify shared geographic read contract.");
assert.equal(fs.readFileSync("lib/gof/coloradoProductionRetrievalReadinessAdapter.ts", "utf8").includes("GIS_1_0"), false, "GIS Sprint 1 must not alter GOF Wave 4 behavior.");
assert.equal(fs.readFileSync("lib/ekcp/enterpriseGeographicConsumerAdapter.ts", "utf8").includes("GIS_1_0"), false, "GIS Sprint 1 must not alter EKCP Sprint 1 behavior.");
assert.equal(fs.readFileSync("lib/ekcp/coloradoEnterpriseGeographicConsumptionReadiness.ts", "utf8").includes("GIS_1_0"), false, "GIS Sprint 1 must not alter EKCP Sprint 2R behavior.");
assert.equal(fs.readFileSync("lib/eip/productionInternalGeographicReadAdapter.ts", "utf8").includes("GIS_1_0"), false, "GIS Sprint 1 must not alter Sprint 7 read behavior.");

assert.ok(packageJson.includes("check:geographic-intelligence-architecture-safety"));
assert.ok(packageJson.includes("certify:geographic-intelligence-architecture-foundation"));
assert.ok(workerTsconfig.includes("scripts/checkGeographicIntelligenceArchitectureSafety.ts"));
assert.ok(workerTsconfig.includes("scripts/certifyGeographicIntelligenceArchitectureFoundation.ts"));
assert.ok(workerTsconfig.includes("lib/geographic-intelligence/**/*.ts"));

console.log("[geographic-intelligence-architecture-safety] ok: GIS 1.0 Sprint 1 contracts are additive, deterministic, provider-neutral, fail-closed, internal-only, route-free, runtime-inert, relationship-free, and isolated from certified GOF/EKCP/Sprint 7 behavior.");

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

// /Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/checkGeographicIntelligenceArchitectureSafety.ts
