import type {
  EnterpriseKpiDefinition,
  FreshnessState,
  KpiEvaluation,
  KpiObservation,
  KpiStatus,
} from "./types.js";

const STATUS_SCORE: Record<Exclude<KpiStatus, "UNKNOWN" | "NOT_APPLICABLE">, number> = {
  HEALTHY: 100,
  WARNING: 60,
  CRITICAL: 0,
};

export function scoreForStatus(status: KpiStatus): number | null {
  if (status === "UNKNOWN" || status === "NOT_APPLICABLE") return null;
  return STATUS_SCORE[status];
}

export function determineFreshness(
  definition: EnterpriseKpiDefinition,
  observation: KpiObservation | null,
  now = new Date(),
): FreshnessState {
  if (observation?.notApplicableReason) return "NOT_APPLICABLE";
  if (!observation?.observedAt || definition.freshnessExpectationHours === null) {
    return "UNKNOWN";
  }

  const observedAt = new Date(observation.observedAt);
  if (Number.isNaN(observedAt.getTime())) return "UNKNOWN";

  const ageHours = (now.getTime() - observedAt.getTime()) / 3_600_000;
  return ageHours <= definition.freshnessExpectationHours ? "FRESH" : "STALE";
}

export function evaluateStatus(
  definition: EnterpriseKpiDefinition,
  observation: KpiObservation | null,
): KpiStatus {
  if (observation?.notApplicableReason) return "NOT_APPLICABLE";
  if (!observation || observation.value === null) return "UNKNOWN";

  const { critical, warning } = definition.thresholds;
  if (critical === null || warning === null) return "UNKNOWN";

  if (definition.desiredTrend === "HIGHER_IS_BETTER") {
    if (observation.value <= critical) return "CRITICAL";
    if (observation.value < warning) return "WARNING";
    return "HEALTHY";
  }

  if (definition.desiredTrend === "LOWER_IS_BETTER") {
    if (observation.value >= critical) return "CRITICAL";
    if (observation.value > warning) return "WARNING";
    return "HEALTHY";
  }

  return "UNKNOWN";
}

export function evaluateKpi(
  definition: EnterpriseKpiDefinition,
  observation: KpiObservation | null,
  now = new Date(),
): KpiEvaluation {
  const freshness = determineFreshness(definition, observation, now);
  const status = freshness === "STALE" ? "UNKNOWN" : evaluateStatus(definition, observation);
  const includedInHealth = status !== "UNKNOWN" && status !== "NOT_APPLICABLE";

  let exclusionReason: string | null = null;
  if (!includedInHealth) {
    exclusionReason =
      status === "NOT_APPLICABLE"
        ? observation?.notApplicableReason ?? "KPI is not applicable by governed rule."
        : freshness === "STALE"
          ? "Latest observation is stale."
          : "No trustworthy observation is available.";
  }

  return {
    kpi: definition,
    observation,
    status,
    freshness,
    includedInHealth,
    exclusionReason,
  };
}
