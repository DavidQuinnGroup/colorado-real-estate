import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const routePath = "app/api/admin/enterprise/geographic-persistence-pilot/route.ts";
const queuePath = "lib/gma/internalMappingReviewQueue.ts";
const fixturePath = "lib/gma/readOnlyMappingPreviewFixtures.ts";
const checkerPath = "scripts/checkGmaReadOnlyMappingPreview.ts";
const packageJsonPath = "package.json";
const workerTsconfigPath = "tsconfig.worker.json";

const routeSource = fs.readFileSync(routePath, "utf8");
const queueSource = fs.readFileSync(queuePath, "utf8");
const fixtureSource = fs.readFileSync(fixturePath, "utf8");
const checkerSource = fs.readFileSync(checkerPath, "utf8");
const packageJson = fs.readFileSync(packageJsonPath, "utf8");
const workerTsconfig = fs.readFileSync(workerTsconfigPath, "utf8");

assert.match(routeSource, /import\("@\/lib\/prisma"\)/);
assert.match(routeSource, /import\("@\/lib\/eip\/controlledProductionInternalGeographicPersistencePilot"\)/);
assert.equal(routeSource.includes("readFile"), false, "Protected route must not read repository files.");
assert.equal(routeSource.includes("readdir"), false, "Protected route must not scan repository directories.");
assert.equal(routeSource.includes("prisma/migrations"), false, "Protected route must not inspect migrations.");

assert.equal(queueSource.includes("../../scripts/"), false, "GMA review queue must not import scripts.");
assert.equal(queueSource.includes("checkGmaReadOnlyMappingPreview"), false, "GMA review queue must not import the GMA checker.");
assert.match(queueSource, /from "\.\/readOnlyMappingPreviewFixtures\.js"/);

assert.match(checkerSource, /from "\.\.\/lib\/gma\/readOnlyMappingPreviewFixtures\.js"/);
assert.match(checkerSource, /prisma\/migrations/);

for (const prohibited of ["node:fs", "fs.", "readFile", "readdir", "scandir", "@prisma/client", "process.env", "fetch(", "DATABASE_URL", "prisma/migrations", "prisma/schema.prisma", "../scripts", "../../scripts", "dist/scripts"]) {
  assert.equal(fixtureSource.includes(prohibited), false, `Runtime-safe fixture module contains prohibited dependency: ${prohibited}`);
}

for (const runtimeRoot of ["app", "components", "lib", "workers", "middleware.ts"]) {
  if (!fs.existsSync(runtimeRoot)) continue;
  for (const file of listFiles(runtimeRoot)) {
    if (!/\.(ts|tsx|js|jsx)$/.test(file)) continue;
    const contents = fs.readFileSync(file, "utf8");
    for (const specifier of importSpecifiers(contents)) {
      assert.equal(isScriptImport(file, specifier), false, `Runtime file imports script module: ${file} -> ${specifier}`);
      assert.equal(specifier.includes("dist/scripts"), false, `Runtime file imports dist script module: ${file} -> ${specifier}`);
      assert.equal(/^check[A-Z].*/.test(path.basename(specifier).replace(/\.(js|ts|tsx|jsx)$/, "")) && specifier.includes("script"), false, `Runtime file imports checker module: ${file} -> ${specifier}`);
    }
    assert.equal(contents.includes("from \"../../scripts/"), false, `Runtime file references ../../scripts import: ${file}`);
    assert.equal(contents.includes("from \"../scripts/"), false, `Runtime file references ../scripts import: ${file}`);
    assert.equal(contents.includes("from \"scripts/"), false, `Runtime file references scripts import: ${file}`);
  }
}

const prismaDiff = execFileSync("git", ["diff", "--name-only", "--", "prisma/schema.prisma", "prisma/migrations"], { encoding: "utf8" }).trim();
assert.equal(prismaDiff, "", "Sprint 6A.1 must not change Prisma schema or migrations.");

const fsAccesses: string[] = [];
const originalReadFileSync = fs.readFileSync;
const originalReaddirSync = fs.readdirSync;

fs.readFileSync = ((file: fs.PathOrFileDescriptor, ...args: unknown[]) => {
  const normalized = typeof file === "string" ? normalizePath(file) : "";
  if (isForbiddenRepositoryPrismaPath(normalized)) {
    fsAccesses.push(`readFileSync:${normalized}`);
    throw new Error(`Unexpected protected-route graph repository Prisma file read: ${normalized}`);
  }
  return originalReadFileSync.call(fs, file, ...(args as Parameters<typeof fs.readFileSync> extends [unknown, ...infer Rest] ? Rest : never));
}) as typeof fs.readFileSync;

fs.readdirSync = ((file: fs.PathLike, ...args: unknown[]) => {
  const normalized = typeof file === "string" ? normalizePath(file) : "";
  if (isForbiddenRepositoryPrismaPath(normalized)) {
    fsAccesses.push(`readdirSync:${normalized}`);
    throw new Error(`Unexpected protected-route graph repository Prisma directory scan: ${normalized}`);
  }
  return originalReaddirSync.call(fs, file, ...(args as Parameters<typeof fs.readdirSync> extends [unknown, ...infer Rest] ? Rest : never));
}) as typeof fs.readdirSync;

try {
  const pilot = await import("../lib/eip/controlledProductionInternalGeographicPersistencePilot.js");
  const plan = pilot.buildEipSprint6PilotPlan();
  pilot.validateEipSprint6PilotPlan(plan);
  assert.deepEqual(plan.limits, pilot.EIP_SPRINT_6_WRITE_LIMITS);
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
      throw new Error("Sprint 6A.1 validation must not enter execute transaction.");
    },
  };

  const result = await pilot.invokeEipSprint6Pilot(fakePrisma as never, {
    mode: "dry-run",
    subject: "Thornton, Colorado",
    scope: pilot.EIP_SPRINT_6_AUTHORIZED_SCOPE,
    invocationId: "EIP-S6A1-VALIDATION-DRY-RUN",
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
  fs.readdirSync = originalReaddirSync;
}

assert.deepEqual(fsAccesses, [], "Protected route dependency graph must not read prisma/schema.prisma or scan prisma/migrations.");

assert.ok(packageJson.includes("check:eip-sprint-6a-runtime-dependency-separation"));
assert.ok(workerTsconfig.includes("scripts/checkEipSprint6aRuntimeDependencySeparation.ts"));

console.log(
  "[eip-sprint-6a-runtime-dependency-separation] ok: runtime-to-scripts imports blocked, GMA preview fixtures separated into lib/gma, protected route graph does not read prisma/schema.prisma or scan prisma/migrations, Sprint 6 dry-run remains zero-mutation, false eligibility, and schema/migrations unchanged.",
);

function listFiles(root: string): string[] {
  if (!fs.existsSync(root)) return [];
  const stat = fs.statSync(root);
  if (stat.isFile()) return [root];
  return fs.readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(root, entry.name);
    return entry.isDirectory() ? listFiles(entryPath) : [entryPath];
  });
}

function importSpecifiers(contents: string): string[] {
  const specifiers: string[] = [];
  const importPattern = /(?:import|export)\s+(?:type\s+)?(?:[^'"]*?\s+from\s+)?["']([^"']+)["']|import\(\s*["']([^"']+)["']\s*\)|require\(\s*["']([^"']+)["']\s*\)/g;
  for (const match of contents.matchAll(importPattern)) {
    const specifier = match[1] ?? match[2] ?? match[3];
    if (specifier) specifiers.push(specifier);
  }
  return specifiers;
}

function isScriptImport(file: string, specifier: string): boolean {
  if (specifier.startsWith("scripts/") || specifier.includes("/scripts/")) return true;
  if (!specifier.startsWith(".")) return false;
  const resolved = normalizePath(path.resolve(path.dirname(file), specifier));
  return resolved.includes("/scripts/");
}

function isForbiddenRepositoryPrismaPath(value: string): boolean {
  if (!value) return false;
  if (value.includes("/node_modules/")) return false;
  return value.endsWith("prisma/schema.prisma") || value.includes("prisma/migrations");
}

function normalizePath(value: string): string {
  return value.replace(/\\/g, "/");
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/checkEipSprint6aRuntimeDependencySeparation.ts
