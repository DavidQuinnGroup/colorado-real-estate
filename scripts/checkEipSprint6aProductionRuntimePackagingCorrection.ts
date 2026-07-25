import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import {
  EIP_SPRINT_6_AUTHORIZED_SCOPE,
  EIP_SPRINT_6_WRITE_LIMITS,
  buildEipSprint6PilotPlan,
  invokeEipSprint6Pilot,
  validateEipSprint6PilotPlan,
} from "../lib/eip/controlledProductionInternalGeographicPersistencePilot.js";

const routePath = "app/api/admin/enterprise/geographic-persistence-pilot/route.ts";
const modulePath = "lib/eip/controlledProductionInternalGeographicPersistencePilot.ts";
const nextConfigPath = "next.config.ts";
const packageJsonPath = "package.json";
const workerTsconfigPath = "tsconfig.worker.json";

const nextConfig = fs.readFileSync(nextConfigPath, "utf8");
const routeSource = fs.readFileSync(routePath, "utf8");
const moduleSource = fs.readFileSync(modulePath, "utf8");
const packageJson = fs.readFileSync(packageJsonPath, "utf8");
const workerTsconfig = fs.readFileSync(workerTsconfigPath, "utf8");

assert.match(nextConfig, /outputFileTracingIncludes/);
assert.match(nextConfig, /['"]\/api\/admin\/enterprise\/geographic-persistence-pilot['"]/);
assert.match(nextConfig, /['"]\.\/prisma\/schema\.prisma['"]/);
assert.equal((nextConfig.match(/schema\.prisma/g) ?? []).length, 1, "Only one route-scoped schema asset include is allowed.");
assert.equal(nextConfig.includes("./prisma/**"), false, "Broad Prisma directory file tracing is not allowed.");
assert.equal(nextConfig.includes("./**"), false, "Broad repository file tracing is not allowed.");

assert.match(routeSource, /authorizeRepositoryAdminRequest/);
assert.match(routeSource, /repositoryAdminUnauthorizedResponse/);
assert.match(routeSource, /runtime = "nodejs"/);
assert.equal(routeSource.includes("readFile"), false, "Admin route must not read repository files.");
assert.equal(routeSource.includes("schema.prisma"), false, "Admin route must not inspect Prisma schema files.");
assert.equal(routeSource.includes("process.cwd()"), false, "Admin route must not depend on cwd-based file access.");

assert.equal(moduleSource.includes("readFile"), false, "Sprint 6 pilot module must not read repository files.");
assert.equal(moduleSource.includes("schema.prisma"), false, "Sprint 6 pilot module must not inspect Prisma schema files.");
assert.equal(moduleSource.includes("process.cwd()"), false, "Sprint 6 pilot module must not depend on cwd-based file access.");
assert.match(moduleSource, /geographicObjects: 1/);
assert.match(moduleSource, /relationships: 0/);
assert.match(moduleSource, /propertyRelationships: 0/);

const plan = buildEipSprint6PilotPlan();
validateEipSprint6PilotPlan(plan);
assert.deepEqual(plan.limits, EIP_SPRINT_6_WRITE_LIMITS);
assert.equal(plan.subject.canonicalName, "Thornton");
assert.equal(plan.subject.objectType, "MUNICIPALITY");
assert.equal(plan.aliases.length, 2);
assert.equal(plan.observations.length, 6);
assert.equal(Object.values(plan.eligibility).some(Boolean), false);

const fakePrisma = {
  geographicObject: {
    findUnique: async () => null,
    findMany: async () => [],
  },
  geographicSource: {
    findUnique: async () => null,
  },
  geographicAlias: {
    findMany: async () => [],
  },
  geographicObservation: {
    findMany: async () => [],
  },
  geographicEligibility: {
    findUnique: async () => null,
  },
  geographicRelationship: {
    count: async () => 0,
  },
  propertyGeographicRelationship: {
    count: async () => 0,
  },
  $transaction: async () => {
    throw new Error("Sprint 6A validation must not enter execute transaction.");
  },
};

const originalReadFileSync = fs.readFileSync;
const blockedSchemaReads: string[] = [];
fs.readFileSync = ((file: fs.PathOrFileDescriptor, ...args: unknown[]) => {
  if (typeof file === "string" && normalizePath(file).endsWith("prisma/schema.prisma")) {
    blockedSchemaReads.push(file);
    throw new Error(`Unexpected runtime schema read: ${file}`);
  }
  return originalReadFileSync.call(fs, file, ...(args as Parameters<typeof fs.readFileSync> extends [unknown, ...infer Rest] ? Rest : never));
}) as typeof fs.readFileSync;

try {
  const result = await invokeEipSprint6Pilot(fakePrisma as never, {
    mode: "dry-run",
    subject: "Thornton, Colorado",
    scope: EIP_SPRINT_6_AUTHORIZED_SCOPE,
    invocationId: "EIP-S6A-VALIDATION-DRY-RUN",
    authorized: true,
  });

  assert.equal(result.success, true);
  assert.equal(result.dryRun, true);
  assert.equal(result.executed, false);
  assert.equal(result.writesPerformed, 0);
  assert.deepEqual(result.plannedCreates, {
    geographicObjects: 1,
    aliases: 2,
    sources: 1,
    observations: 6,
    eligibilityRows: 1,
    relationships: 0,
    propertyRelationships: 0,
  });
  assert.equal(Object.values(result.eligibility).some(Boolean), false);
  assert.equal(result.activation.runtime, false);
  assert.equal(result.activation.customer, false);
  assert.equal(result.activation.search, false);
  assert.equal(result.activation.map, false);
  assert.equal(result.activation.publicPage, false);
  assert.equal(result.activation.propertyRelationship, false);
  assert.equal(result.rollbackPlan.available, true);
  assert.deepEqual(result.stopConditions, []);
} finally {
  fs.readFileSync = originalReadFileSync;
}

assert.deepEqual(blockedSchemaReads, [], "Dry-run plan construction must not read prisma/schema.prisma.");

const runtimeFiles = [
  "app/page.tsx",
  "app/search",
  "app/properties",
  "app/api/search",
  "app/api/unsubscribe",
  "app/api/track-click",
  "components",
  "lib/search",
  "lib/mls",
  "lib/typesense",
  "lib/alerts",
  "lib/email",
  "workers",
];

for (const root of runtimeFiles) {
  if (!fs.existsSync(root)) continue;
  for (const file of listFiles(root)) {
    if (!/\.(ts|tsx|js|jsx)$/.test(file)) continue;
    if (file === routePath) continue;
    const contents = fs.readFileSync(file, "utf8");
    assert.equal(contents.includes("controlledProductionInternalGeographicPersistencePilot"), false, `Runtime file imports Sprint 6 pilot: ${file}`);
    assert.equal(contents.includes("geographic-persistence-pilot"), false, `Runtime file references Sprint 6 pilot route: ${file}`);
  }
}

assert.ok(packageJson.includes("check:eip-sprint-6a-production-runtime-packaging-correction"));
assert.ok(workerTsconfig.includes("scripts/checkEipSprint6aProductionRuntimePackagingCorrection.ts"));
assert.equal(fs.existsSync("prisma/schema.prisma"), true);

console.log(
  "[eip-sprint-6a-production-runtime-packaging-correction] ok: route-scoped Prisma schema packaging, no app/pilot schema inspection, dry-run zero mutation contract, unchanged Sprint 6 limits, false eligibility, no public/runtime consumers, and validation wiring passed.",
);

function listFiles(root: string): string[] {
  const stat = fs.statSync(root);
  if (stat.isFile()) return [root];
  return fs.readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(root, entry.name);
    return entry.isDirectory() ? listFiles(entryPath) : [entryPath];
  });
}

function normalizePath(value: string): string {
  return value.replace(/\\/g, "/");
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/checkEipSprint6aProductionRuntimePackagingCorrection.ts
