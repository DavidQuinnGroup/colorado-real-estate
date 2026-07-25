import assert from "node:assert/strict";
import fs from "node:fs";

import {
  EIP_SPRINT_6_AUTHORIZED_CANONICAL_NAME,
  EIP_SPRINT_6_AUTHORIZED_SCOPE,
  EIP_SPRINT_6_WRITE_LIMITS,
  buildEipSprint6PilotPlan,
  validateEipSprint6Invocation,
  validateEipSprint6PilotPlan,
} from "../lib/eip/controlledProductionInternalGeographicPersistencePilot.js";

const plan = buildEipSprint6PilotPlan();
validateEipSprint6PilotPlan(plan);

assert.equal(plan.subject.canonicalName, "Thornton");
assert.equal(plan.subject.objectType, "MUNICIPALITY");
assert.equal(plan.subject.canonicalSlug, "thornton-colorado");
assert.equal(plan.evidence.qualityStatus, "READY");
assert.match(plan.evidence.readinessLedgerEntryId, /PRODUCTION_INTERNAL_ONLY_PERSISTENCE/);
assert.match(plan.evidence.approvalRequestId, /EIP_SPRINT_5_APPROVAL_REQUEST\|001\|SEARCH/);
assert.match(plan.evidence.approvalDecisionId, /APPROVED_FOR_DEFINED_NEXT_STEP/);
assert.deepEqual(plan.limits, EIP_SPRINT_6_WRITE_LIMITS);
assert.equal(plan.aliases.length, 2);
assert.equal(plan.observations.length, 6);
assert.equal(Object.values(plan.eligibility).some(Boolean), false);

assert.throws(() => validateEipSprint6Invocation({
  mode: "execute",
  subject: EIP_SPRINT_6_AUTHORIZED_CANONICAL_NAME,
  scope: EIP_SPRINT_6_AUTHORIZED_SCOPE,
  invocationId: "TEST",
  authorized: false,
}), /admin authorization/);
assert.throws(() => validateEipSprint6Invocation({
  mode: "execute",
  subject: "Boulder",
  scope: EIP_SPRINT_6_AUTHORIZED_SCOPE,
  invocationId: "TEST",
  authorized: true,
}), /Thornton/);
assert.throws(() => validateEipSprint6Invocation({
  mode: "execute",
  subject: EIP_SPRINT_6_AUTHORIZED_CANONICAL_NAME,
  scope: EIP_SPRINT_6_AUTHORIZED_SCOPE,
  authorized: true,
}), /invocation ID/);
assert.doesNotThrow(() => validateEipSprint6Invocation({
  mode: "dry-run",
  subject: "Thornton, Colorado",
  scope: EIP_SPRINT_6_AUTHORIZED_SCOPE,
  invocationId: "EIP_SPRINT_6_VALIDATION_DRY_RUN",
  authorized: true,
}));

const moduleSource = fs.readFileSync("lib/eip/controlledProductionInternalGeographicPersistencePilot.ts", "utf8");
const routeSource = fs.readFileSync("app/api/admin/enterprise/geographic-persistence-pilot/route.ts", "utf8");
const packageJson = fs.readFileSync("package.json", "utf8");
const workerTsconfig = fs.readFileSync("tsconfig.worker.json", "utf8");

assert.match(routeSource, /authorizeRepositoryAdminRequest/);
assert.match(routeSource, /repositoryAdminUnauthorizedResponse/);
assert.match(routeSource, /runtime = "nodejs"/);
assert.equal(routeSource.includes("GeographicObject"), false, "Route must not directly consume GIO model names.");
assert.equal(routeSource.includes("PropertyGeographicRelationship"), false, "Route must not directly consume property relationship model names.");
assert.equal(/app\/api\/enterprise\/geographic-persistence-pilot/.test(listFiles("app/api").join("\n")), false, "Public Sprint 6 pilot route must not exist.");

assert.match(moduleSource, /searchEligible: false/);
assert.match(moduleSource, /mapEligible: false/);
assert.match(moduleSource, /publicPageEligible: false/);
assert.match(moduleSource, /indexingEligible: false/);
assert.match(moduleSource, /propertyEnrichment: false/);
assert.match(moduleSource, /marketAnalytics: false/);
assert.match(moduleSource, /runtime: false/);
assert.match(moduleSource, /customer: false/);
assert.match(moduleSource, /ai: false/);

for (const runtimeRoot of ["app/page.tsx", "app/search", "app/properties", "components", "lib/search", "lib/mls", "lib/typesense", "lib/alerts", "lib/email", "workers"]) {
  if (!fs.existsSync(runtimeRoot)) continue;
  for (const file of listFiles(runtimeRoot)) {
    if (!/\.(ts|tsx|js|jsx)$/.test(file)) continue;
    if (file === "app/api/admin/enterprise/geographic-persistence-pilot/route.ts") continue;
    const contents = fs.readFileSync(file, "utf8");
    assert.equal(contents.includes("controlledProductionInternalGeographicPersistencePilot"), false, `Runtime file imports Sprint 6 pilot: ${file}`);
    assert.equal(contents.includes("geographic-persistence-pilot"), false, `Runtime file references Sprint 6 pilot route: ${file}`);
  }
}

assert.ok(packageJson.includes("check:eip-sprint-6-controlled-production-internal-geographic-persistence-pilot"));
assert.ok(workerTsconfig.includes("scripts/checkEipSprint6ControlledProductionInternalGeographicPersistencePilot.ts"));
assert.ok(workerTsconfig.includes("lib/eip/**/*.ts"));

console.log(
  "[eip-sprint-6-controlled-production-internal-geographic-persistence-pilot] ok: Thornton allowlist, approval evidence, write limits, false eligibility defaults, admin route boundary, dry-run/execute invocation requirements, rollback plan support, no public route, and runtime isolation passed.",
);

function listFiles(root: string): string[] {
  if (!fs.existsSync(root)) return [];
  const stat = fs.statSync(root);
  if (stat.isFile()) return [root];
  return fs.readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const path = `${root}/${entry.name}`;
    return entry.isDirectory() ? listFiles(path) : [path];
  });
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/checkEipSprint6ControlledProductionInternalGeographicPersistencePilot.ts
