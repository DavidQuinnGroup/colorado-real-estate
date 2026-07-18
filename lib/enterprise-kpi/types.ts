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
export type IntelligenceFreshnessState = "FRESH" | "AGING" | "STALE" | "UNKNOWN";
export type ConfidenceLevel = "HIGH" | "MEDIUM" | "LOW" | "INSUFFICIENT";
export type IntelligenceSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type AttentionLevel = "MONITOR" | "REVIEW" | "ESCALATE";

export type KpiTrendDirection =
  | "IMPROVING"
  | "DECLINING"
  | "STABLE"
  | "VOLATILE"
  | "INSUFFICIENT_DATA"
  | "UNKNOWN";

export type IntelligenceEventClass =
  | "HEALTH_CHANGE"
  | "KPI_THRESHOLD_CROSSING"
  | "KPI_TREND_CHANGE"
  | "DATA_FRESHNESS_RISK"
  | "DATA_AVAILABILITY_CHANGE"
  | "ENTERPRISE_RISK"
  | "ENTERPRISE_OPPORTUNITY"
  | "GOVERNANCE_SIGNAL";

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
  staleKpis?: string[];
  notApplicableKpis?: string[];
  coveragePercentage?: number;
  confidence?: ConfidenceLevel;
  freshness?: IntelligenceFreshnessState;
  calculationVersion?: string;
  generatedAt?: string;
  provenance?: ObservationProvenance;
  contributions?: KpiHealthContribution[];
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
  domainWeights?: Record<KpiDomain, number>;
  includedDomains?: KpiDomain[];
  excludedDomains?: KpiDomain[];
  confidence?: ConfidenceLevel;
  freshness?: IntelligenceFreshnessState;
};

export type EvidenceReference = {
  evidenceId: string;
  evidenceType: "KPI_OBSERVATION" | "KPI_EVALUATION" | "HEALTH_RESULT" | "FIXTURE_SERIES";
  kpiId?: string;
  sourceSystem: string;
  timestamp: string;
  provenance: ObservationProvenance;
  calculationVersion: string;
  internalRoute?: string;
};

export type ConfidenceAssessment = {
  level: ConfidenceLevel;
  score: number;
  factors: string[];
};

export type FreshnessAssessment = {
  state: IntelligenceFreshnessState;
  ageHours: number | null;
  expectationHours: number | null;
  assessedAt: string;
};

export type KpiHealthContribution = {
  kpiId: string;
  status: KpiStatus;
  normalizedScore: number | null;
  weight: number;
  weightedScore: number | null;
  included: boolean;
  exclusionReason: string | null;
  evidence: EvidenceReference[];
};

export type KpiTrend = {
  kpiId: string;
  trend: KpiTrendDirection;
  rawDirection: "UP" | "DOWN" | "FLAT" | "MIXED" | "UNKNOWN";
  windowStart: string | null;
  windowEnd: string | null;
  observationCount: number;
  startingValue: number | null;
  endingValue: number | null;
  absoluteChange: number | null;
  percentageChange: number | null;
  staleObservationCount: number;
  confidence: ConfidenceAssessment;
  freshness: FreshnessAssessment;
  provenance: ObservationProvenance;
  evidence: EvidenceReference[];
  calculationVersion: string;
};

export type KpiTransition = {
  transitionId: string;
  kpiId: string;
  previousStatus: KpiStatus;
  currentStatus: KpiStatus;
  previousValue: number | null;
  currentValue: number | null;
  effectiveTimestamp: string;
  provenance: ObservationProvenance;
  threshold: KpiThreshold;
  calculationVersion: string;
  evidence: EvidenceReference[];
};

export type RiskSignal = {
  signalId: string;
  condition: string;
  severity: IntelligenceSeverity;
  confidence: ConfidenceAssessment;
  affectedDomains: KpiDomain[];
  potentialConsequence: string;
  suggestedInvestigationArea: string;
  evidence: EvidenceReference[];
  provenance: ObservationProvenance;
};

export type OpportunitySignal = {
  signalId: string;
  condition: string;
  confidence: ConfidenceAssessment;
  relevantDomain: KpiDomain;
  potentialEnterpriseValue: string;
  suggestedReviewArea: string;
  evidence: EvidenceReference[];
  provenance: ObservationProvenance;
};

export type IntelligenceEvent = {
  eventId: string;
  eventClass: IntelligenceEventClass;
  title: string;
  summary: string;
  severity: IntelligenceSeverity;
  domain: KpiDomain;
  kpiIds: string[];
  evidence: EvidenceReference[];
  confidence: ConfidenceAssessment;
  freshness: FreshnessAssessment;
  provenance: ObservationProvenance;
  detectionRuleId: string;
  calculationVersion: string;
  detectedAt: string;
  recommendedAttentionLevel: AttentionLevel;
};
