import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";

const framework = fs.readFileSync("lib/enterprise-kpi/adapterFramework.ts", "utf8");
const repositoryAdapter = fs.readFileSync("lib/repository/governanceAdapter.ts", "utf8");
const route = fs.readFileSync(
  "app/api/admin/enterprise/repository-governance-adapter/route.ts",
  "utf8",
);
const packageJson = fs.readFileSync("package.json", "utf8");

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => `${JSON.stringify(key)}:${stableJson(item)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

function fingerprint(value: unknown) {
  return crypto.createHash("sha256").update(stableJson(value)).digest("hex");
}

assert.ok(framework.includes("EnterpriseAdapterLifecycleConfig"));
assert.ok(framework.includes("EnterpriseAdapterObservationPlan"));
assert.ok(framework.includes("invokeEnterpriseAdapter"));
assert.ok(framework.includes("inspectEnterpriseAdapter"));
assert.ok(framework.includes("fingerprintEnterpriseAdapterSourceState"));
assert.ok(framework.includes("freshnessForEnterpriseAdapterSource"));
assert.ok(framework.includes("currentEnterpriseAdapterEnvironment"));

assert.ok(framework.includes('dataOrigin: "LIVE"'));
assert.ok(framework.includes('privacy: "SYSTEM"'));
assert.ok(framework.includes('privacy: "INTERNAL"'));
assert.ok(framework.includes('sensitivity: "INTERNAL"'));
assert.ok(framework.includes('retention: "AUDIT"'));
assert.ok(framework.includes('retention: "HISTORICAL"'));
assert.ok(framework.includes("createEIAPersistenceRepository"));
assert.ok(framework.includes("createProvenance"));
assert.ok(framework.includes("upsertEvidenceReference"));
assert.ok(framework.includes("upsertKpiObservation"));
assert.ok(framework.includes("upsertKpiEvaluation"));
assert.ok(framework.includes("linkEvidence"));
assert.ok(framework.includes("process.env.VERCEL_GIT_COMMIT_SHA"));
assert.ok(framework.includes("sourceStateFingerprint"));
assert.ok(framework.includes("sourceStateFingerprint,"));
assert.ok(framework.includes("before?.id === observation.id"));

assert.ok(repositoryAdapter.includes("invokeEnterpriseAdapter(repositoryGovernanceAdapterConfig"));
assert.ok(repositoryAdapter.includes("inspectEnterpriseAdapter"));
assert.ok(repositoryAdapter.includes('invocationPrefix: "RGOV"'));
assert.ok(repositoryAdapter.includes('calculationVersion: REPOSITORY_GOVERNANCE_CALCULATION_VERSION'));
assert.ok(repositoryAdapter.includes("fingerprintRepositoryGovernanceSourceState"));

for (const repositorySource of [
  "repository_health_summary",
  "repository_object_health",
  "repository_object",
  "repository_governance_exception_candidates",
]) {
  assert.ok(repositoryAdapter.includes(repositorySource), `Repository adapter missing ${repositorySource}`);
  assert.equal(framework.includes(repositorySource), false, `Framework should not embed repository source ${repositorySource}`);
}

for (const kpi of ["KPI-GOV-001", "KPI-GOV-002", "KPI-GOV-003"]) {
  assert.ok(repositoryAdapter.includes(kpi), `Repository adapter missing ${kpi}`);
}
assert.equal(framework.includes("KPI-GOV-001"), false);

const first = fingerprint({
  health: { total_objects: 2, governance_completeness_pct: 100 },
  objectHealth: [
    { rid: "RID-B", has_governing_authority: true },
    { rid: "RID-A", has_governing_authority: true },
  ].sort((left, right) => left.rid.localeCompare(right.rid)),
});
const second = fingerprint({
  objectHealth: [
    { rid: "RID-A", has_governing_authority: true },
    { rid: "RID-B", has_governing_authority: true },
  ],
  health: { governance_completeness_pct: 100, total_objects: 2 },
});
const changed = fingerprint({
  objectHealth: [
    { rid: "RID-A", has_governing_authority: false },
    { rid: "RID-B", has_governing_authority: true },
  ],
  health: { governance_completeness_pct: 50, total_objects: 2 },
});
assert.equal(first, second);
assert.notEqual(first, changed);

for (const forbidden of [
  /\$executeRaw/,
  /\$executeRawUnsafe/,
  /repositorySupabase/,
  /setInterval\s*\(/,
  /setTimeout\s*\(/,
  /cron/i,
  /scheduler/i,
  /queue/i,
  /worker/i,
  /sendEmail/i,
  /typesense/i,
  /mls/i,
]) {
  assert.equal(forbidden.test(framework), false, `Forbidden framework reference detected: ${forbidden}`);
}

for (const sensitive of ["email", "phone", "password", "secret", "token", "customer"]) {
  assert.equal(framework.includes(sensitive), false, `Sensitive framework field reference detected: ${sensitive}`);
  assert.equal(repositoryAdapter.includes(sensitive), false, `Sensitive repository adapter field reference detected: ${sensitive}`);
}

assert.ok(route.includes("authorizeRepositoryAdminRequest"));
assert.ok(route.includes('searchParams.get("execute") === "true"'));
assert.ok(route.includes("dryRun: !execute"));
assert.equal(route.includes("export async function PUT"), false);
assert.equal(route.includes("export async function DELETE"), false);

assert.ok(packageJson.includes("check:enterprise-adapter-framework-safety"));

console.log(
  "[enterprise-adapter-framework-safety] ok: shared lifecycle, repository-specific source separation, live provenance, idempotency preservation, manual admin route, and forbidden activation checks passed.",
);
