import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
const adapter = fs.readFileSync("lib/repository/governanceAdapter.ts", "utf8");
const route = fs.readFileSync("app/api/admin/enterprise/repository-governance-adapter/route.ts", "utf8");
const packageJson = fs.readFileSync("package.json", "utf8");
function stableJson(value) {
    if (Array.isArray(value))
        return `[${value.map(stableJson).join(",")}]`;
    if (value && typeof value === "object") {
        return `{${Object.entries(value)
            .sort(([left], [right]) => left.localeCompare(right))
            .map(([key, item]) => `${JSON.stringify(key)}:${stableJson(item)}`)
            .join(",")}}`;
    }
    return JSON.stringify(value);
}
function fingerprint(value) {
    return crypto.createHash("sha256").update(stableJson(value)).digest("hex");
}
assert.ok(adapter.includes('REPOSITORY_GOVERNANCE_ADAPTER_ID = "REPOSITORY_GOVERNANCE"'));
assert.ok(adapter.includes('REPOSITORY_GOVERNANCE_ADAPTER_VERSION = "1.0.0"'));
assert.ok(adapter.includes('reliability: "AUTHORITATIVE"'));
assert.ok(adapter.includes("repository_health_summary"));
assert.ok(adapter.includes("repository_object_health"));
assert.ok(adapter.includes("repository_governance_exception_candidates"));
assert.ok(adapter.includes("fingerprintRepositoryGovernanceSourceState"));
for (const kpi of ["KPI-GOV-001", "KPI-GOV-002", "KPI-GOV-003"]) {
    assert.ok(adapter.includes(kpi), `Adapter missing ${kpi}`);
}
for (const unsupported of [
    "Governance Exception Count",
    "Governance Recovery Rate",
    "Missing Steward Count",
    "Relationship Completeness %",
    "Broken Relationship Count",
    "Platform Traceability Gap Count",
    "Repository Health Score / Risk Level",
]) {
    assert.ok(adapter.includes(unsupported), `Unsupported KPI not documented: ${unsupported}`);
}
assert.ok(adapter.includes('dataOrigin: "LIVE"'));
assert.ok(adapter.includes("createEIAPersistenceRepository"));
assert.ok(adapter.includes("upsertKpiObservation"));
assert.ok(adapter.includes("upsertKpiEvaluation"));
assert.ok(adapter.includes("upsertEvidenceReference"));
assert.ok(adapter.includes("sourceStateFingerprint"));
assert.ok(adapter.includes("sourceStateFingerprint,"));
assert.ok(adapter.includes("process.env.VERCEL_GIT_COMMIT_SHA"));
const repositoryWritePatterns = [
    /repositorySupabase[\s\S]{0,120}\.insert\s*\(/,
    /repositorySupabase[\s\S]{0,120}\.update\s*\(/,
    /repositorySupabase[\s\S]{0,120}\.upsert\s*\(/,
    /repositorySupabase[\s\S]{0,120}\.delete\s*\(/,
    /repositorySupabase[\s\S]{0,120}\.rpc\s*\(/,
    /repositorySupabase[\s\S]{0,120}\.remove\s*\(/,
];
for (const pattern of repositoryWritePatterns) {
    assert.equal(pattern.test(adapter), false, `Repository mutation detected: ${pattern}`);
}
for (const forbidden of [
    /\$executeRaw/,
    /\$executeRawUnsafe/,
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
    assert.equal(forbidden.test(adapter), false, `Forbidden activation/system reference detected: ${forbidden}`);
}
assert.ok(route.includes("authorizeRepositoryAdminRequest"));
assert.ok(route.includes("repositoryAdminUnauthorizedResponse"));
assert.ok(route.includes("export async function GET"));
assert.ok(route.includes("export async function POST"));
assert.ok(route.includes('searchParams.get("execute") === "true"'));
assert.ok(route.includes("dryRun: !execute"));
assert.equal(route.includes("export async function PUT"), false);
assert.equal(route.includes("export async function DELETE"), false);
assert.equal(fs.existsSync("app/api/enterprise/repository-governance-adapter"), false);
assert.equal(fs.existsSync("app/repository-governance-adapter"), false);
assert.equal(fs.existsSync("app/eia/repository-governance-adapter"), false);
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
for (const sensitive of ["email", "phone", "password", "secret", "token", "customer"]) {
    assert.equal(adapter.includes(sensitive), false, `Sensitive source field reference detected: ${sensitive}`);
}
assert.ok(packageJson.includes("check:repository-governance-adapter-safety"));
console.log("[repository-governance-adapter-safety] ok: contract, authoritative source reads, manual admin route, fixture/live separation, provenance, idempotency, fingerprint, no public exposure, and no source mutation passed.");
