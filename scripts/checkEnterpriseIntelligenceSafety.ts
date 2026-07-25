import assert from "node:assert/strict";
import fs from "node:fs";

import {
  EIF_DEMO_OBSERVATION_SERIES,
  analyzeKpiTrend,
  assessConfidence,
  assessFreshness,
  buildIntelligenceEvents,
  buildIntelligenceHealthSnapshot,
  detectKpiTransitions,
  detectOpportunitySignals,
  detectRiskSignals,
  evaluateKpi,
  getEnterpriseKpi,
  type KpiObservation,
} from "../lib/enterprise-kpi/index.js";

function obs(kpiId: string, value: number, observedAt: string): KpiObservation {
  return {
    kpiId,
    value,
    observedAt,
    provenance: "NON_PRODUCTION_FIXTURE",
    sourceAvailability: "FIXTURE_AVAILABLE",
    note: "Synthetic intelligence safety observation.",
  };
}

function assertHealth() {
  const snapshot = buildIntelligenceHealthSnapshot();
  assert.equal(snapshot.provenance, "NON_PRODUCTION_FIXTURE");
  assert.equal(snapshot.calculationVersion, "EIF-1.0-intelligence-v1");
  assert.equal(snapshot.domainWeights?.PLATFORM, 0.22);
  assert.ok(snapshot.domainResults.some((domain) => domain.domain === "PLATFORM" && domain.score !== null));
  assert.ok(snapshot.domainResults.some((domain) => domain.domain === "CUSTOMER" && domain.status === "UNKNOWN"));
  assert.ok(snapshot.excludedDomains?.includes("CUSTOMER"));
  assert.ok(snapshot.domainResults.every((domain) => typeof domain.coveragePercentage === "number"));
  assert.equal(snapshot.minimumDataRequirementMet, true);

  const insufficient = buildIntelligenceHealthSnapshot([obs("KPI-PLAT-001", 100, "2026-07-18T18:43:18Z")]);
  assert.equal(insufficient.minimumDataRequirementMet, false);
  assert.equal(insufficient.overallStatus, "UNKNOWN");
}

function assertTrends() {
  assert.equal(analyzeKpiTrend("KPI-PLAT-001").trend, "IMPROVING");
  assert.equal(analyzeKpiTrend("KPI-OPS-001").trend, "DECLINING");
  assert.equal(analyzeKpiTrend("KPI-PLAT-002").trend, "STABLE");
  assert.equal(analyzeKpiTrend("KPI-CUST-001").trend, "INSUFFICIENT_DATA");

  const lowerDefinition = getEnterpriseKpi("KPI-OPS-001");
  assert.ok(lowerDefinition);
  const improvingLower = analyzeKpiTrend("KPI-OPS-001", [
    obs("KPI-OPS-001", 2, "2026-07-18T16:43:18Z"),
    obs("KPI-OPS-001", 1, "2026-07-18T17:43:18Z"),
    obs("KPI-OPS-001", 0, "2026-07-18T18:43:18Z"),
  ]);
  assert.equal(improvingLower.trend, "IMPROVING");

  const volatile = analyzeKpiTrend("KPI-PLAT-001", [
    obs("KPI-PLAT-001", 100, "2026-07-18T16:43:18Z"),
    obs("KPI-PLAT-001", 98, "2026-07-18T17:43:18Z"),
    obs("KPI-PLAT-001", 100, "2026-07-18T18:43:18Z"),
  ]);
  assert.equal(volatile.trend, "VOLATILE");

  const zeroBaseline = analyzeKpiTrend("KPI-PLAT-001", [
    obs("KPI-PLAT-001", 0, "2026-07-18T16:43:18Z"),
    obs("KPI-PLAT-001", 10, "2026-07-18T18:43:18Z"),
  ]);
  assert.equal(zeroBaseline.percentageChange, null);

  assert.equal(analyzeKpiTrend("KPI-GOV-001").freshness.state, "STALE");
}

function assertTransitions() {
  const transitions = detectKpiTransitions();
  assert.ok(transitions.some((item) => item.previousStatus === "WARNING" && item.currentStatus === "HEALTHY"));
  assert.ok(transitions.some((item) => item.previousStatus === "WARNING" && item.currentStatus === "CRITICAL"));
  assert.equal(new Set(transitions.map((item) => item.transitionId)).size, transitions.length);

  const plat = getEnterpriseKpi("KPI-PLAT-001");
  assert.ok(plat);
  const fixtureNow = new Date("2026-07-18T18:43:18Z");
  assert.equal(evaluateKpi(plat, null, fixtureNow).status, "UNKNOWN");
  assert.equal(evaluateKpi(plat, obs("KPI-PLAT-001", 100, "2026-07-18T18:43:18Z"), fixtureNow).status, "HEALTHY");
}

function assertEventsSignalsEvidence() {
  const risks = detectRiskSignals();
  const opportunities = detectOpportunitySignals();
  const events = buildIntelligenceEvents();
  assert.ok(risks.some((item) => item.condition.includes("CRITICAL")));
  assert.ok(risks.some((item) => item.condition.includes("stale")));
  assert.ok(opportunities.some((item) => item.condition.includes("improves")));
  assert.ok(events.length >= risks.length + opportunities.length);
  assert.ok(events.every((item) => item.provenance === "NON_PRODUCTION_FIXTURE"));
  assert.ok(events.every((item) => item.evidence.length > 0));
  assert.ok(events.every((item) => !/caused|causes|will fix/i.test(item.summary)));
}

function assertConfidenceFreshness() {
  assert.equal(
    assessConfidence({
      observationCount: 3,
      provenance: "NON_PRODUCTION_FIXTURE",
      freshness: "FRESH",
      coveragePercentage: 100,
    }).level,
    "MEDIUM",
  );
  assert.equal(
    assessFreshness(
      EIF_DEMO_OBSERVATION_SERIES["KPI-GOV-001"][0],
      24,
      new Date("2026-07-18T18:43:18Z"),
    ).state,
    "STALE",
  );
}

function assertApiContracts() {
  const routes = [
    "app/api/admin/enterprise/health/route.ts",
    "app/api/admin/enterprise/health/domains/route.ts",
    "app/api/admin/enterprise/kpi-trends/route.ts",
    "app/api/admin/enterprise/kpi-transitions/route.ts",
    "app/api/admin/enterprise/intelligence-events/route.ts",
    "app/api/admin/enterprise/risks/route.ts",
    "app/api/admin/enterprise/opportunities/route.ts",
  ];
  for (const route of routes) {
    const content = fs.readFileSync(route, "utf8");
    assert.ok(content.includes("authorizeRepositoryAdminRequest"), `${route} missing auth`);
    assert.ok(content.includes("repositoryAdminUnauthorizedResponse"), `${route} missing unauthorized response`);
    assert.ok(!content.includes("export async function POST"), `${route} must not expose POST`);
    assert.ok(!content.includes("export async function PUT"), `${route} must not expose PUT`);
    assert.ok(!content.includes("export async function DELETE"), `${route} must not expose DELETE`);
  }
}

assertHealth();
assertTrends();
assertTransitions();
assertEventsSignalsEvidence();
assertConfidenceFreshness();
assertApiContracts();

console.log(
  "[enterprise-intelligence-safety] ok: health, trends, transitions, events, risk, opportunity, evidence, confidence, freshness, and API contracts passed.",
);
