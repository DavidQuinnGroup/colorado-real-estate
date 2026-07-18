import { ENTERPRISE_KPI_REGISTRY } from "./registry.js";
import { evaluateKpi, scoreForStatus } from "./evaluation.js";
import type {
  DomainHealthResult,
  EnterpriseHealthSnapshot,
  KpiDomain,
  KpiEvaluation,
  KpiObservation,
  KpiStatus,
} from "./types.js";

export const FIXTURE_OBSERVATION_TIMESTAMP = "2026-07-18T18:43:18Z";

export const EIF_FIXTURE_OBSERVATIONS: KpiObservation[] = [
  {
    kpiId: "KPI-PLAT-001",
    value: 100,
    observedAt: FIXTURE_OBSERVATION_TIMESTAMP,
    provenance: "NON_PRODUCTION_FIXTURE",
    sourceAvailability: "FIXTURE_AVAILABLE",
    note: "CERT-001 post-deployment root, property, search, and safe unsubscribe route checks passed.",
  },
  {
    kpiId: "KPI-PLAT-002",
    value: 100,
    observedAt: FIXTURE_OBSERVATION_TIMESTAMP,
    provenance: "NON_PRODUCTION_FIXTURE",
    sourceAvailability: "FIXTURE_AVAILABLE",
    note: "Bounded search API returned HTTP 200 with approved database fallback.",
  },
  {
    kpiId: "KPI-OPS-001",
    value: 0,
    observedAt: FIXTURE_OBSERVATION_TIMESTAMP,
    provenance: "NON_PRODUCTION_FIXTURE",
    sourceAvailability: "FIXTURE_AVAILABLE",
    note: "RC1 Critical/High defects were closed at certification; watch items remain non-blocking.",
  },
  {
    kpiId: "KPI-GOV-001",
    value: 100,
    observedAt: FIXTURE_OBSERVATION_TIMESTAMP,
    provenance: "NON_PRODUCTION_FIXTURE",
    sourceAvailability: "FIXTURE_AVAILABLE",
    note: "Repository governance closure evidence is fixture-labeled for Sprint 1 health demonstration.",
  },
];

const DOMAINS: KpiDomain[] = [
  "PLATFORM",
  "CUSTOMER",
  "OPERATIONS",
  "BUSINESS",
  "GROWTH",
  "GOVERNANCE",
];

function statusFromScore(score: number | null): KpiStatus {
  if (score === null) return "UNKNOWN";
  if (score >= 80) return "HEALTHY";
  if (score >= 50) return "WARNING";
  return "CRITICAL";
}

function average(values: number[]) {
  if (values.length === 0) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function buildEnterpriseHealthSnapshot(
  observations: KpiObservation[] = EIF_FIXTURE_OBSERVATIONS,
  now = new Date(FIXTURE_OBSERVATION_TIMESTAMP),
): EnterpriseHealthSnapshot {
  const byKpi = new Map(observations.map((observation) => [observation.kpiId, observation]));
  const evaluations = ENTERPRISE_KPI_REGISTRY.map((definition) =>
    evaluateKpi(definition, byKpi.get(definition.id) ?? null, now),
  );

  const domainResults: DomainHealthResult[] = DOMAINS.map((domain) => {
    const domainEvaluations = evaluations.filter((item) => item.kpi.domain === domain);
    const included = domainEvaluations.filter((item) => item.includedInHealth);
    const scores = included
      .map((item) => scoreForStatus(item.status))
      .filter((score): score is number => score !== null);
    const score = average(scores);

    return {
      domain,
      status: statusFromScore(score),
      includedKpis: included.map((item) => item.kpi.id),
      excludedKpis: domainEvaluations
        .filter((item) => !item.includedInHealth)
        .map((item) => item.kpi.id),
      unknownKpis: domainEvaluations
        .filter((item) => item.status === "UNKNOWN")
        .map((item) => item.kpi.id),
      score,
    };
  });

  const included = evaluations.filter((item) => item.includedInHealth);
  const includedDomains = new Set(included.map((item) => item.kpi.domain));
  const minimumDataRequirementMet = includedDomains.size >= 3 && included.length >= 4;
  const overallScore = minimumDataRequirementMet
    ? average(
        included
          .map((item) => scoreForStatus(item.status))
          .filter((score): score is number => score !== null),
      )
    : null;

  return {
    calculationVersion: "EIF-1.0-health-v1",
    generatedAt: now.toISOString(),
    provenance: "NON_PRODUCTION_FIXTURE",
    overallStatus: minimumDataRequirementMet ? statusFromScore(overallScore) : "UNKNOWN",
    overallScore,
    includedKpis: included.map((item) => item.kpi.id),
    excludedKpis: evaluations
      .filter((item) => !item.includedInHealth)
      .map((item) => item.kpi.id),
    unknownKpis: evaluations
      .filter((item) => item.status === "UNKNOWN")
      .map((item) => item.kpi.id),
    domainResults,
    evaluations,
    minimumDataRequirementMet,
    limitations: [
      "Sprint 1 health is a governed fixture demonstration, not live enterprise health.",
      "No telemetry stream, worker, scheduler, queue consumer, or production collection job is active.",
      "Defined-but-unavailable KPIs remain UNKNOWN until a trustworthy governed source is connected.",
    ],
  };
}

export function getLatestKpiEvaluations(): KpiEvaluation[] {
  return buildEnterpriseHealthSnapshot().evaluations;
}
