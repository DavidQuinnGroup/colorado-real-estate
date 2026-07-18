export type KpiDomain =
  | "PLATFORM"
  | "CUSTOMER"
  | "OPERATIONS"
  | "BUSINESS"
  | "GROWTH"
  | "GOVERNANCE";

export type KpiStatus =
  | "HEALTHY"
  | "WARNING"
  | "CRITICAL"
  | "UNKNOWN"
  | "NOT_APPLICABLE";

export type TrendDirection = "HIGHER_IS_BETTER" | "LOWER_IS_BETTER" | "NEUTRAL";

export type MeasurementUnit =
  | "PERCENT"
  | "COUNT"
  | "MILLISECONDS"
  | "SECONDS"
  | "HOURS"
  | "DAYS"
  | "RATIO"
  | "SCORE"
  | "BOOLEAN";

export type AggregationType =
  | "POINT_IN_TIME"
  | "COUNT"
  | "SUM"
  | "AVERAGE"
  | "RATE"
  | "PERCENTILE"
  | "DERIVED";

export type ObservationProvenance =
  | "LIVE_INTERNAL"
  | "NON_PRODUCTION_FIXTURE"
  | "DEFINED_ONLY";

export type SourceAvailability =
  | "LIVE_AVAILABLE"
  | "FIXTURE_AVAILABLE"
  | "DEFINED_BUT_UNAVAILABLE";

export type FreshnessState = "FRESH" | "STALE" | "UNKNOWN" | "NOT_APPLICABLE";

export type KpiLifecycleState = "CANONICAL" | "DRAFT" | "DEPRECATED";

export type KpiThreshold = {
  target: number | null;
  warning: number | null;
  critical: number | null;
};

export type KpiSource = {
  system: string;
  definition: string;
  availability: SourceAvailability;
};

export type EnterpriseKpiDefinition = {
  id: string;
  name: string;
  description: string;
  businessPurpose: string;
  domain: KpiDomain;
  executiveOwnerRole: string;
  formula: string;
  unit: MeasurementUnit;
  aggregation: AggregationType;
  desiredTrend: TrendDirection;
  source: KpiSource;
  updateFrequency: string;
  freshnessExpectationHours: number | null;
  thresholds: KpiThreshold;
  weight: number | null;
  nonWeightedStatus: boolean;
  effectiveVersion: string;
  lifecycle: KpiLifecycleState;
  governanceNotes: string;
};

export type KpiObservation = {
  kpiId: string;
  value: number | null;
  observedAt: string | null;
  provenance: ObservationProvenance;
  sourceAvailability: SourceAvailability;
  note: string;
  notApplicableReason?: string;
};

export type KpiEvaluation = {
  kpi: EnterpriseKpiDefinition;
  observation: KpiObservation | null;
  status: KpiStatus;
  freshness: FreshnessState;
  includedInHealth: boolean;
  exclusionReason: string | null;
};

export type DomainHealthResult = {
  domain: KpiDomain;
  status: KpiStatus;
  includedKpis: string[];
  excludedKpis: string[];
  unknownKpis: string[];
  score: number | null;
};

export type EnterpriseHealthSnapshot = {
  calculationVersion: string;
  generatedAt: string;
  provenance: ObservationProvenance;
  overallStatus: KpiStatus;
  overallScore: number | null;
  includedKpis: string[];
  excludedKpis: string[];
  unknownKpis: string[];
  domainResults: DomainHealthResult[];
  evaluations: KpiEvaluation[];
  minimumDataRequirementMet: boolean;
  limitations: string[];
};
