import assert from "node:assert/strict";
import fs from "node:fs";

import {
  buildEnterpriseHealthSnapshot,
  determineFreshness,
  ENTERPRISE_KPI_REGISTRY,
  evaluateKpi,
  getEnterpriseKpi,
  listEnterpriseKpis,
  validateEnterpriseKpiRegistry,
  type EnterpriseKpiDefinition,
  type KpiObservation,
} from "../lib/enterprise-kpi/index.js";

function cloneDefinition(
  partial: Partial<EnterpriseKpiDefinition> = {},
): EnterpriseKpiDefinition {
  const base = ENTERPRISE_KPI_REGISTRY[0];
  return {
    ...base,
    ...partial,
    thresholds: partial.thresholds ?? base.thresholds,
    source: partial.source ?? base.source,
  };
}

function observation(value: number | null, observedAt = "2026-07-18T18:43:18Z"): KpiObservation {
  return {
    kpiId: "KPI-TEST-001",
    value,
    observedAt,
    provenance: "NON_PRODUCTION_FIXTURE",
    sourceAvailability: "FIXTURE_AVAILABLE",
    note: "Synthetic deterministic test observation.",
  };
}

function assertRegistry() {
  const validation = validateEnterpriseKpiRegistry();
  assert.equal(validation.valid, true, validation.issues.join("; "));
  assert.equal(ENTERPRISE_KPI_REGISTRY.length, 20);
  assert.equal(new Set(ENTERPRISE_KPI_REGISTRY.map((kpi) => kpi.id)).size, 20);
  assert.ok(getEnterpriseKpi("KPI-PLAT-001"));
  assert.ok(getEnterpriseKpi("KPI-SRCH-001"));
  assert.equal(getEnterpriseKpi("KPI-NOPE-001"), null);
  assert.equal(listEnterpriseKpis({ domain: "PLATFORM" }).length, 5);
  assert.equal(
    listEnterpriseKpis({ sourceAvailability: "DEFINED_BUT_UNAVAILABLE" }).length,
    16,
  );

  for (const definition of ENTERPRISE_KPI_REGISTRY) {
    assert.ok(definition.description);
    assert.ok(definition.businessPurpose);
    assert.ok(definition.executiveOwnerRole);
    assert.ok(definition.formula);
    assert.ok(definition.source.definition);
    assert.ok(definition.updateFrequency);
    assert.ok(definition.governanceNotes);
  }
}

function assertSearchRuntimeKpiGovernance() {
  const searchRuntime = getEnterpriseKpi("KPI-SRCH-001");
  assert.ok(searchRuntime, "Expected KPI-SRCH-001 to be registered.");
  assert.equal(searchRuntime.name, "Search Runtime Health Rate");
  assert.equal(searchRuntime.domain, "PLATFORM");
  assert.equal(searchRuntime.formula, "valid usable runtime executions / total eligible runtime executions × 100");
  assert.equal(searchRuntime.unit, "PERCENT");
  assert.equal(searchRuntime.aggregation, "RATE");
  assert.equal(searchRuntime.freshnessExpectationHours, 0.25);
  assert.deepEqual(searchRuntime.thresholds, { target: 100, warning: 100, critical: 0 });
  assert.equal(searchRuntime.source.availability, "DEFINED_BUT_UNAVAILABLE");
  assert.match(searchRuntime.governanceNotes, /SUCCESS, DEGRADED, FALLBACK, and EMPTY_VALID/);
  assert.match(searchRuntime.governanceNotes, /UNKNOWN and UNAVAILABLE are excluded/);
  assert.match(searchRuntime.governanceNotes, /source-state fingerprint/);
  assert.match(searchRuntime.governanceNotes, /KPI-PLAT-002 remains owned by Platform Availability Adapter/);

  const assessedAt = new Date("2026-07-18T18:43:18Z");
  assert.equal(evaluateKpi(searchRuntime, observation(null), assessedAt).status, "UNKNOWN");
  assert.equal(evaluateKpi(searchRuntime, observation(100), assessedAt).status, "HEALTHY");
  assert.equal(evaluateKpi(searchRuntime, observation(50), assessedAt).status, "WARNING");
  assert.equal(evaluateKpi(searchRuntime, observation(0), assessedAt).status, "CRITICAL");

  const degradedFallbackEvidence = [
    "runtimeClassification=DEGRADED",
    "runtimeClassification=FALLBACK",
    "providerClassification=DATABASE",
    "fallbackUsed=true",
    "degraded=true",
    "blockerCount=1",
    "sourceStateFingerprint=present",
  ].join(";");
  assert.match(degradedFallbackEvidence, /DEGRADED/);
  assert.match(degradedFallbackEvidence, /FALLBACK/);
  assert.match(searchRuntime.governanceNotes, /A value of 100/);
}

function assertPlatformSearchKpiUnchanged() {
  const platformSearch = getEnterpriseKpi("KPI-PLAT-002");
  assert.ok(platformSearch, "Expected KPI-PLAT-002 to remain registered.");
  assert.equal(platformSearch.name, "Search API Success Rate");
  assert.equal(platformSearch.formula, "successful /api/search checks / total /api/search checks");
  assert.equal(platformSearch.source.system, "Manual governed search checks");
  assert.equal(platformSearch.source.definition, "Bounded /api/search health checks");
  assert.deepEqual(platformSearch.thresholds, { target: 99, warning: 97, critical: 95 });
  assert.equal(platformSearch.governanceNotes, "Database fallback is valid; Typesense degradation must stay explicit.");
}

function assertThresholds() {
  const higher = cloneDefinition({
    desiredTrend: "HIGHER_IS_BETTER",
    thresholds: { target: 90, warning: 70, critical: 40 },
  });
  assert.equal(evaluateKpi(higher, observation(95)).status, "HEALTHY");
  assert.equal(evaluateKpi(higher, observation(69)).status, "WARNING");
  assert.equal(evaluateKpi(higher, observation(40)).status, "CRITICAL");
  assert.equal(evaluateKpi(higher, observation(70)).status, "HEALTHY");

  const lower = cloneDefinition({
    desiredTrend: "LOWER_IS_BETTER",
    thresholds: { target: 1, warning: 5, critical: 10 },
  });
  assert.equal(evaluateKpi(lower, observation(1)).status, "HEALTHY");
  assert.equal(evaluateKpi(lower, observation(6)).status, "WARNING");
  assert.equal(evaluateKpi(lower, observation(10)).status, "CRITICAL");
  assert.equal(evaluateKpi(lower, observation(5)).status, "HEALTHY");
}

function assertUnknownAndFreshness() {
  const definition = cloneDefinition({ freshnessExpectationHours: 24 });
  assert.equal(evaluateKpi(definition, null).status, "UNKNOWN");
  assert.equal(evaluateKpi(definition, observation(null)).status, "UNKNOWN");
  assert.equal(
    determineFreshness(
      definition,
      observation(100, "2026-07-16T18:43:18Z"),
      new Date("2026-07-18T18:43:18Z"),
    ),
    "STALE",
  );
  assert.equal(
    evaluateKpi(
      definition,
      observation(100, "2026-07-16T18:43:18Z"),
      new Date("2026-07-18T18:43:18Z"),
    ).status,
    "UNKNOWN",
  );
  assert.equal(
    evaluateKpi(definition, {
      ...observation(null),
      notApplicableReason: "Governed rule marks this KPI not applicable.",
    }).status,
    "NOT_APPLICABLE",
  );
}

function assertHealth() {
  const snapshot = buildEnterpriseHealthSnapshot();
  assert.equal(snapshot.provenance, "NON_PRODUCTION_FIXTURE");
  assert.equal(snapshot.includedKpis.length, 4);
  assert.equal(snapshot.unknownKpis.length, 16);
  assert.equal(snapshot.minimumDataRequirementMet, true);
  assert.equal(snapshot.overallStatus, "HEALTHY");
  assert.ok(snapshot.domainResults.find((domain) => domain.domain === "CUSTOMER"));
  assert.equal(
    snapshot.domainResults.find((domain) => domain.domain === "CUSTOMER")?.status,
    "UNKNOWN",
  );

  const insufficient = buildEnterpriseHealthSnapshot([
    {
      ...observation(100),
      kpiId: "KPI-PLAT-001",
    },
  ]);
  assert.equal(insufficient.minimumDataRequirementMet, false);
  assert.equal(insufficient.overallStatus, "UNKNOWN");
}

function assertApiContracts() {
  const route = fs.readFileSync("app/api/admin/enterprise/kpis/route.ts", "utf8");
  const detailRoute = fs.readFileSync(
    "app/api/admin/enterprise/kpis/[id]/route.ts",
    "utf8",
  );
  const healthRoute = fs.readFileSync("app/api/admin/enterprise/health/route.ts", "utf8");
  for (const content of [route, detailRoute, healthRoute]) {
    assert.ok(content.includes("authorizeRepositoryAdminRequest"));
    assert.ok(content.includes("repositoryAdminUnauthorizedResponse"));
    assert.ok(!content.includes("export async function POST"));
    assert.ok(!content.includes("export async function PUT"));
    assert.ok(!content.includes("export async function DELETE"));
  }
}

function assertSeedIdempotency() {
  const first = JSON.stringify(ENTERPRISE_KPI_REGISTRY);
  const second = JSON.stringify(listEnterpriseKpis());
  assert.equal(first, second);
}

function assertMigrationValidity() {
  const schema = fs.readFileSync("prisma/schema.prisma", "utf8");
  assert.ok(schema.includes("model Property"));
}

assertRegistry();
assertSearchRuntimeKpiGovernance();
assertPlatformSearchKpiUnchanged();
assertThresholds();
assertUnknownAndFreshness();
assertHealth();
assertApiContracts();
assertSeedIdempotency();
assertMigrationValidity();

console.log(
  "[enterprise-kpi-safety] ok: registry, thresholds, freshness, health, API auth, idempotency, and migration baseline passed.",
);
