import { ENTERPRISE_KPI_REGISTRY, getEnterpriseKpi } from "./registry.js";
import { FIXTURE_OBSERVATION_TIMESTAMP } from "./health.js";
import {
  INTELLIGENCE_CALCULATION_VERSION,
  PROVISIONAL_DOMAIN_WEIGHTS,
  buildIntelligenceEvents,
  buildIntelligenceHealthSnapshot,
  detectKpiTransitions,
  detectOpportunitySignals,
  detectRiskSignals,
  getKpiTrends,
} from "./intelligence.js";
import type {
  ConfidenceAssessment,
  DomainHealthResult,
  EnterpriseHealthSnapshot,
  EvidenceReference,
  FreshnessAssessment,
  IntelligenceEvent,
  IntelligenceFreshnessState,
  KpiDomain,
  KpiEvaluation,
  KpiHealthContribution,
  KpiStatus,
  KpiTransition,
  KpiTrend,
  OpportunitySignal,
  ObservationProvenance,
  RiskSignal,
} from "./types.js";

export const EXECUTIVE_WORKSPACE_CALCULATION_VERSION = "EIF-1.0-executive-workspace-v1";
export const EXECUTIVE_WORKSPACE_ROUTE = "/admin/repository/executive-command-center";
export const EXECUTIVE_BRIEF_ROUTE = "/api/admin/enterprise/executive-brief";
export const EXECUTIVE_COMMAND_CENTER_ROUTE = "/api/admin/enterprise/executive-command-center";

const DOMAINS: KpiDomain[] = [
  "PLATFORM",
  "CUSTOMER",
  "OPERATIONS",
  "BUSINESS",
  "GROWTH",
  "GOVERNANCE",
];

const STATUS_RANK: Record<KpiStatus, number> = {
  CRITICAL: 5,
  WARNING: 4,
  UNKNOWN: 3,
  HEALTHY: 2,
  NOT_APPLICABLE: 1,
};

const SEVERITY_RANK = {
  CRITICAL: 5,
  HIGH: 4,
  MEDIUM: 3,
  LOW: 2,
} as const;

const CONFIDENCE_RANK = {
  HIGH: 4,
  MEDIUM: 3,
  LOW: 2,
  INSUFFICIENT: 1,
} as const;

const FRESHNESS_RANK: Record<IntelligenceFreshnessState, number> = {
  STALE: 4,
  UNKNOWN: 3,
  AGING: 2,
  FRESH: 1,
};

const ATTENTION_PRIORITY_RANK = {
  CRITICAL: 5,
  HIGH: 4,
  MEDIUM: 3,
  LOW: 2,
} as const;

const DOMAIN_IMPORTANCE: Record<KpiDomain, number> = {
  PLATFORM: PROVISIONAL_DOMAIN_WEIGHTS.PLATFORM,
  CUSTOMER: PROVISIONAL_DOMAIN_WEIGHTS.CUSTOMER,
  OPERATIONS: PROVISIONAL_DOMAIN_WEIGHTS.OPERATIONS,
  BUSINESS: PROVISIONAL_DOMAIN_WEIGHTS.BUSINESS,
  GROWTH: PROVISIONAL_DOMAIN_WEIGHTS.GROWTH,
  GOVERNANCE: PROVISIONAL_DOMAIN_WEIGHTS.GOVERNANCE,
};

export type ExecutiveMaterialChangeType =
  | "THRESHOLD_TRANSITION"
  | "TREND_CHANGE"
  | "FRESHNESS_CHANGE"
  | "AVAILABILITY_GAP"
  | "GOVERNANCE_SIGNAL"
  | "HEALTH_CHANGE";

export type ExecutiveAttentionItemType =
  | "CRITICAL_RISK"
  | "WARNING_RISK"
  | "NEGATIVE_TRANSITION"
  | "STALE_REQUIRED_DATA"
  | "UNKNOWN_DOMAIN"
  | "OPPORTUNITY_REVIEW"
  | "RECOVERY_REVIEW";

export type ExecutiveAttentionPriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type EvidenceDrillDown = {
  summaryId: string;
  intelligenceEventId: string | null;
  detectionRuleId: string;
  kpiIds: string[];
  evaluations: {
    kpiId: string;
    kpiName: string;
    status: KpiStatus;
    observation: KpiEvaluation["observation"];
    sourceAvailability: string;
    provenance: ObservationProvenance;
  }[];
  evidence: EvidenceReference[];
  missingEvidence: string[];
};

export type ExecutiveMaterialChange = {
  changeId: string;
  type: ExecutiveMaterialChangeType;
  title: string;
  summary: string;
  severity: keyof typeof SEVERITY_RANK;
  domain: KpiDomain;
  rankScore: number;
  rankingFactors: string[];
  intelligenceEventId: string | null;
  detectionRuleId: string;
  evidence: EvidenceReference[];
  confidence: ConfidenceAssessment;
  freshness: FreshnessAssessment;
  provenance: ObservationProvenance;
  drillDown: EvidenceDrillDown;
};

export type ExecutiveAttentionItem = {
  stableId: string;
  type: ExecutiveAttentionItemType;
  title: string;
  priority: ExecutiveAttentionPriority;
  domain: KpiDomain;
  reasonForAttention: string;
  supportingIntelligenceEventId: string | null;
  evidence: EvidenceReference[];
  confidence: ConfidenceAssessment;
  freshness: FreshnessAssessment;
  provenance: ObservationProvenance;
  suggestedReviewAction:
    | "Investigate"
    | "Monitor"
    | "Validate data source"
    | "Review with engineering"
    | "Review with operations"
    | "Review with product"
    | "Acknowledge recovery"
    | "Defer pending evidence";
  rankScore: number;
};

export type DomainExecutiveSummary = DomainHealthResult & {
  primaryPositiveContributor: KpiHealthContribution | null;
  primaryNegativeContributor: KpiHealthContribution | null;
  drillDown: EvidenceDrillDown;
};

export type DataIntegritySummary = {
  overallProvenance: ObservationProvenance;
  fixtureBackedOutputCount: number;
  liveDataBackedOutputCount: number;
  definedButUnavailableKpiCount: number;
  unknownKpiCount: number;
  staleKpiCount: number;
  unknownDomainCount: number;
  overallCoveragePercentage: number;
  confidenceLimitations: string[];
  freshnessLimitations: string[];
  persistenceLimitations: string[];
  gap006Status: "OPEN_MATERIAL_REDUCED";
};

export type ExecutiveStatusHeader = {
  overallScore: number | null;
  overallStatus: KpiStatus;
  generatedAt: string;
  calculationVersion: string;
  provenance: ObservationProvenance;
  confidence: ConfidenceAssessment["level"];
  freshness: IntelligenceFreshnessState;
  coveragePercentage: number;
  internalPreviewState: "CERTIFIED_FOR_INTERNAL_PREVIEW";
  activeCriticalRisks: number;
  activeWarningRisks: number;
  unknownDomains: number;
  staleKpiCount: number;
};

export type ExecutiveCommandCenterPayload = {
  metadata: {
    generatedAt: string;
    calculationVersion: string;
    sourceCalculationVersion: string;
    route: string;
    access: "internal_admin";
    persistence: "READ_ONLY_NON_PERSISTENT";
  };
  enterpriseStatus: ExecutiveStatusHeader;
  health: EnterpriseHealthSnapshot;
  domains: DomainExecutiveSummary[];
  materialChanges: ExecutiveMaterialChange[];
  risks: RiskSignal[];
  opportunities: OpportunitySignal[];
  attentionItems: ExecutiveAttentionItem[];
  dataIntegrity: DataIntegritySummary;
  evidenceReferences: EvidenceReference[];
  knownLimitations: string[];
};

export type ExecutiveBriefSection = {
  heading: string;
  body: string;
  supportingIntelligenceEventIds: string[];
  evidence: EvidenceReference[];
};

export type ExecutiveBrief = {
  metadata: {
    title: "PROJECT ATLAS";
    subtitle: "Daily Executive Brief";
    generatedAt: string;
    calculationVersion: string;
    sourceCalculationVersion: string;
    provenance: ObservationProvenance;
    route: string;
  };
  sections: ExecutiveBriefSection[];
  renderedText: string;
  limitations: string[];
  confidence: ConfidenceAssessment["level"];
  freshness: IntelligenceFreshnessState;
};

export const MATERIAL_CHANGE_RANKING_RULES = [
  "Severity rank: CRITICAL 5, HIGH 4, MEDIUM 3, LOW 2.",
  "Confidence rank: HIGH 4, MEDIUM 3, LOW 2, INSUFFICIENT 1.",
  "Freshness risk rank: STALE 4, UNKNOWN 3, AGING 2, FRESH 1.",
  "Scope rank: event or signal evidence count capped at 5.",
  "Domain importance uses Sprint 2 provisional domain weights multiplied by 10.",
  "Recency rank is 3 for fixture-window changes with timestamps and 1 when missing.",
];

export const ATTENTION_ITEM_RULES = [
  "Critical risks become CRITICAL attention items.",
  "High and medium risks become HIGH or MEDIUM attention items.",
  "Negative threshold transitions require investigation.",
  "Stale KPI evidence requires source validation.",
  "Unknown domains require deferred review pending evidence.",
  "Opportunities require review only; they never become approvals or roadmap commands.",
  "Duplicate source identifiers are collapsed by stableId.",
];

export function buildExecutiveCommandCenterPayload(): ExecutiveCommandCenterPayload {
  const health = buildIntelligenceHealthSnapshot();
  const trends = getKpiTrends();
  const transitions = detectKpiTransitions();
  const risks = sortRisks(detectRiskSignals()).slice(0, 8);
  const opportunities = sortOpportunities(detectOpportunitySignals()).slice(0, 8);
  const events = buildIntelligenceEvents();
  const eventBySource = buildEventSourceMap(events);
  const domains = buildDomainSummaries(health, events);
  const materialChanges = buildMaterialChanges({
    health,
    trends,
    transitions,
    events,
    eventBySource,
  });
  const attentionItems = buildExecutiveAttentionItems({
    health,
    transitions,
    risks,
    opportunities,
    events,
    eventBySource,
  });
  const evidenceReferences = uniqueEvidence([
    ...materialChanges.flatMap((item) => item.evidence),
    ...risks.flatMap((item) => item.evidence),
    ...opportunities.flatMap((item) => item.evidence),
    ...attentionItems.flatMap((item) => item.evidence),
    ...domains.flatMap((item) => item.contributions?.flatMap((contribution) => contribution.evidence) ?? []),
  ]);

  return {
    metadata: {
      generatedAt: FIXTURE_OBSERVATION_TIMESTAMP,
      calculationVersion: EXECUTIVE_WORKSPACE_CALCULATION_VERSION,
      sourceCalculationVersion: INTELLIGENCE_CALCULATION_VERSION,
      route: EXECUTIVE_WORKSPACE_ROUTE,
      access: "internal_admin",
      persistence: "READ_ONLY_NON_PERSISTENT",
    },
    enterpriseStatus: {
      overallScore: health.overallScore,
      overallStatus: health.overallStatus,
      generatedAt: health.generatedAt,
      calculationVersion: EXECUTIVE_WORKSPACE_CALCULATION_VERSION,
      provenance: health.provenance,
      confidence: health.confidence ?? "INSUFFICIENT",
      freshness: health.freshness ?? "UNKNOWN",
      coveragePercentage: Math.round(((health.includedDomains?.length ?? 0) / DOMAINS.length) * 100),
      internalPreviewState: "CERTIFIED_FOR_INTERNAL_PREVIEW",
      activeCriticalRisks: risks.filter((risk) => risk.severity === "CRITICAL").length,
      activeWarningRisks: risks.filter((risk) => risk.severity === "HIGH" || risk.severity === "MEDIUM").length,
      unknownDomains: health.domainResults.filter((domain) => domain.status === "UNKNOWN").length,
      staleKpiCount: health.evaluations.filter((evaluation) => evaluation.freshness === "STALE").length,
    },
    health,
    domains,
    materialChanges,
    risks,
    opportunities,
    attentionItems,
    dataIntegrity: buildDataIntegritySummary(health, events, risks, opportunities),
    evidenceReferences,
    knownLimitations: [
      "All Sprint 3 executive output is currently NON_PRODUCTION_FIXTURE.",
      "No live data adapter, worker, scheduler, queue consumer, or production persistence is active.",
      "Attention items are presentation-only and do not persist acknowledgment, assignment, notes, or history.",
      "Opportunity language requires human review and does not approve investments, roadmap changes, or public launch expansion.",
    ],
  };
}

export function buildDailyExecutiveBrief(): ExecutiveBrief {
  const commandCenter = buildExecutiveCommandCenterPayload();
  const topRisk = commandCenter.risks[0] ?? null;
  const topOpportunity = commandCenter.opportunities[0] ?? null;
  const customerChanges = commandCenter.materialChanges.filter((item) => item.domain === "CUSTOMER");
  const platformChanges = commandCenter.materialChanges.filter((item) => item.domain === "PLATFORM");
  const operationsChanges = commandCenter.materialChanges.filter((item) => item.domain === "OPERATIONS");
  const governanceChanges = commandCenter.materialChanges.filter((item) => item.domain === "GOVERNANCE");
  const firstAttention = commandCenter.attentionItems[0] ?? null;

  const sections: ExecutiveBriefSection[] = [
    section(
      "Enterprise Status",
      `Overall enterprise health is ${formatScore(commandCenter.enterpriseStatus.overallScore)} with ${commandCenter.enterpriseStatus.overallStatus} status. Current output is ${commandCenter.enterpriseStatus.provenance}, confidence is ${commandCenter.enterpriseStatus.confidence}, freshness is ${commandCenter.enterpriseStatus.freshness}, and coverage is ${commandCenter.enterpriseStatus.coveragePercentage}%.`,
      [],
      commandCenter.evidenceReferences.slice(0, 3),
    ),
    section(
      "Material Changes",
      summarizeChanges(commandCenter.materialChanges),
      commandCenter.materialChanges.map((item) => item.intelligenceEventId).filter((item): item is string => Boolean(item)),
      commandCenter.materialChanges.flatMap((item) => item.evidence).slice(0, 6),
    ),
    section("Customer Signals", summarizeDomain(customerChanges, "Customer"), ids(customerChanges), evidence(customerChanges)),
    section("Platform Signals", summarizeDomain(platformChanges, "Platform"), ids(platformChanges), evidence(platformChanges)),
    section("Operations Signals", summarizeDomain(operationsChanges, "Operations"), ids(operationsChanges), evidence(operationsChanges)),
    section("Governance Signals", summarizeDomain(governanceChanges, "Governance"), ids(governanceChanges), evidence(governanceChanges)),
    section(
      "Top Risk",
      topRisk
        ? `${topRisk.condition} affects ${topRisk.affectedDomains.join(", ")} with ${topRisk.severity} severity. The condition is associated with reduced preview confidence and requires investigation.`
        : "No active risk signal is available from the governed fixture set.",
      topRisk ? eventIdsForEvidence(commandCenter.materialChanges, topRisk.evidence) : [],
      topRisk?.evidence ?? [],
    ),
    section(
      "Top Opportunity",
      topOpportunity
        ? `${topOpportunity.condition} is visible in ${topOpportunity.relevantDomain}. It may support carefully scoped review, but it is not an approval or strategy command.`
        : "No active opportunity signal is available from the governed fixture set.",
      topOpportunity ? eventIdsForEvidence(commandCenter.materialChanges, topOpportunity.evidence) : [],
      topOpportunity?.evidence ?? [],
    ),
    section(
      "Executive Attention Required",
      firstAttention
        ? `${firstAttention.title} is priority ${firstAttention.priority}. Suggested review action: ${firstAttention.suggestedReviewAction}.`
        : "No executive attention item is currently generated by the deterministic fixture rules.",
      firstAttention?.supportingIntelligenceEventId ? [firstAttention.supportingIntelligenceEventId] : [],
      firstAttention?.evidence ?? [],
    ),
    section(
      "Data Confidence and Limitations",
      `The workspace is ${commandCenter.dataIntegrity.overallProvenance}. Unknown KPIs: ${commandCenter.dataIntegrity.unknownKpiCount}. Stale KPIs: ${commandCenter.dataIntegrity.staleKpiCount}. Defined-but-unavailable KPIs: ${commandCenter.dataIntegrity.definedButUnavailableKpiCount}. Persistence is intentionally unavailable in Sprint 3.`,
      [],
      [],
    ),
  ];

  return {
    metadata: {
      title: "PROJECT ATLAS",
      subtitle: "Daily Executive Brief",
      generatedAt: FIXTURE_OBSERVATION_TIMESTAMP,
      calculationVersion: EXECUTIVE_WORKSPACE_CALCULATION_VERSION,
      sourceCalculationVersion: INTELLIGENCE_CALCULATION_VERSION,
      provenance: commandCenter.enterpriseStatus.provenance,
      route: EXECUTIVE_BRIEF_ROUTE,
    },
    sections,
    renderedText: renderBrief(sections),
    limitations: commandCenter.knownLimitations,
    confidence: commandCenter.enterpriseStatus.confidence,
    freshness: commandCenter.enterpriseStatus.freshness,
  };
}

function buildDomainSummaries(health: EnterpriseHealthSnapshot, events: IntelligenceEvent[]): DomainExecutiveSummary[] {
  return health.domainResults.map((domain) => {
    const included = domain.contributions?.filter((item) => item.included && item.normalizedScore !== null) ?? [];
    const primaryPositiveContributor =
      [...included].sort((left, right) => (right.weightedScore ?? -1) - (left.weightedScore ?? -1))[0] ?? null;
    const primaryNegativeContributor =
      [...included].sort((left, right) => (left.weightedScore ?? 101) - (right.weightedScore ?? 101))[0] ?? null;
    const domainEvent = events.find((event) => event.domain === domain.domain) ?? null;

    return {
      ...domain,
      primaryPositiveContributor,
      primaryNegativeContributor,
      drillDown: buildDrillDown({
        summaryId: `DOMAIN-${domain.domain}`,
        event: domainEvent,
        detectionRuleId: domainEvent?.detectionRuleId ?? "RULE-DOMAIN-HEALTH",
        kpiIds: [...new Set([...(domain.includedKpis ?? []), ...(domain.unknownKpis ?? [])])],
        evidence: domain.contributions?.flatMap((item) => item.evidence) ?? [],
        health,
      }),
    };
  });
}

function buildMaterialChanges(input: {
  health: EnterpriseHealthSnapshot;
  trends: KpiTrend[];
  transitions: KpiTransition[];
  events: IntelligenceEvent[];
  eventBySource: Map<string, IntelligenceEvent>;
}): ExecutiveMaterialChange[] {
  const changes: ExecutiveMaterialChange[] = [];

  for (const transition of input.transitions) {
    const kpi = getEnterpriseKpi(transition.kpiId);
    if (!kpi) continue;
    const event = input.eventBySource.get(transition.transitionId) ?? null;
    changes.push(
      materialChange({
        changeId: `CHG-${transition.transitionId}`,
        type: "THRESHOLD_TRANSITION",
        title: `${transition.kpiId} moved from ${transition.previousStatus} to ${transition.currentStatus}`,
        summary: `${transition.kpiId} crossed a governed threshold from ${transition.previousStatus} to ${transition.currentStatus}.`,
        severity: transition.currentStatus === "CRITICAL" ? "HIGH" : transition.currentStatus === "WARNING" ? "MEDIUM" : "LOW",
        domain: kpi.domain,
        evidence: transition.evidence,
        event,
        detectionRuleId: "RULE-KPI-TRANSITION",
        health: input.health,
        freshness: freshnessFromEvidence(transition.evidence),
      }),
    );
  }

  for (const trend of input.trends.filter((item) => ["IMPROVING", "DECLINING", "VOLATILE"].includes(item.trend))) {
    const kpi = getEnterpriseKpi(trend.kpiId);
    if (!kpi) continue;
    const event = input.eventBySource.get(`TREND-${trend.kpiId}-${trend.trend}`) ?? null;
    changes.push(
      materialChange({
        changeId: `CHG-TREND-${trend.kpiId}-${trend.trend}`,
        type: "TREND_CHANGE",
        title: `${trend.kpiId} trend ${trend.trend}`,
        summary: `${trend.kpiId} trend is ${trend.trend}; this is deterministic fixture intelligence, not a statistical claim.`,
        severity: trend.trend === "DECLINING" ? "MEDIUM" : "LOW",
        domain: kpi.domain,
        evidence: trend.evidence,
        event,
        detectionRuleId: "RULE-KPI-TREND",
        health: input.health,
        freshness: trend.freshness,
      }),
    );
  }

  for (const domain of input.health.domainResults.filter((item) => item.status === "UNKNOWN")) {
    changes.push(
      materialChange({
        changeId: `CHG-DOMAIN-${domain.domain}-UNKNOWN`,
        type: "AVAILABILITY_GAP",
        title: `${domain.domain} health is UNKNOWN`,
        summary: `${domain.domain} health is not calculable because governed KPI evidence is unavailable or insufficient.`,
        severity: "MEDIUM",
        domain: domain.domain,
        evidence: domain.contributions?.flatMap((item) => item.evidence) ?? [],
        event: null,
        detectionRuleId: "RULE-DOMAIN-COVERAGE",
        health: input.health,
        freshness: emptyFreshness(),
      }),
    );
  }

  return sortMaterialChanges(dedupeBy(changes, (item) => item.changeId)).slice(0, 10);
}

function materialChange(input: {
  changeId: string;
  type: ExecutiveMaterialChangeType;
  title: string;
  summary: string;
  severity: keyof typeof SEVERITY_RANK;
  domain: KpiDomain;
  evidence: EvidenceReference[];
  event: IntelligenceEvent | null;
  detectionRuleId: string;
  health: EnterpriseHealthSnapshot;
  freshness: FreshnessAssessment;
}): ExecutiveMaterialChange {
  const confidence =
    input.event?.confidence ??
    confidenceFromEvidence(input.evidence, input.evidence.length >= 2 ? "MEDIUM" : "LOW");
  const rankScore = materialRankScore({
    severity: input.severity,
    confidence: confidence.level,
    freshness: input.freshness.state,
    evidenceCount: input.evidence.length,
    domain: input.domain,
    hasTimestamp: input.evidence.some((item) => Boolean(item.timestamp)),
  });

  return {
    changeId: input.changeId,
    type: input.type,
    title: input.title,
    summary: input.summary,
    severity: input.severity,
    domain: input.domain,
    rankScore,
    rankingFactors: MATERIAL_CHANGE_RANKING_RULES,
    intelligenceEventId: input.event?.eventId ?? null,
    detectionRuleId: input.event?.detectionRuleId ?? input.detectionRuleId,
    evidence: input.evidence,
    confidence,
    freshness: input.freshness,
    provenance: input.evidence[0]?.provenance ?? "NON_PRODUCTION_FIXTURE",
    drillDown: buildDrillDown({
      summaryId: input.changeId,
      event: input.event,
      detectionRuleId: input.event?.detectionRuleId ?? input.detectionRuleId,
      kpiIds: input.evidence.map((item) => item.kpiId).filter((item): item is string => Boolean(item)),
      evidence: input.evidence,
      health: input.health,
    }),
  };
}

function buildExecutiveAttentionItems(input: {
  health: EnterpriseHealthSnapshot;
  transitions: KpiTransition[];
  risks: RiskSignal[];
  opportunities: OpportunitySignal[];
  events: IntelligenceEvent[];
  eventBySource: Map<string, IntelligenceEvent>;
}): ExecutiveAttentionItem[] {
  const items: ExecutiveAttentionItem[] = [];

  for (const risk of input.risks) {
    const sourceEvent = input.events.find((event) => event.eventId === `EVT-${risk.signalId}`) ?? null;
    const priority: ExecutiveAttentionPriority =
      risk.severity === "CRITICAL" ? "CRITICAL" : risk.severity === "HIGH" ? "HIGH" : "MEDIUM";
    items.push({
      stableId: `ATTN-${risk.signalId}`,
      type: risk.severity === "CRITICAL" ? "CRITICAL_RISK" : "WARNING_RISK",
      title: risk.condition,
      priority,
      domain: risk.affectedDomains[0] ?? "OPERATIONS",
      reasonForAttention: risk.potentialConsequence,
      supportingIntelligenceEventId: sourceEvent?.eventId ?? null,
      evidence: risk.evidence,
      confidence: risk.confidence,
      freshness: freshnessFromEvidence(risk.evidence),
      provenance: risk.provenance,
      suggestedReviewAction: risk.affectedDomains.includes("PLATFORM")
        ? "Review with engineering"
        : risk.affectedDomains.includes("OPERATIONS")
          ? "Review with operations"
          : "Investigate",
      rankScore: attentionRankScore(priority, risk.confidence.level, risk.evidence.length),
    });
  }

  for (const transition of input.transitions.filter((item) => STATUS_RANK[item.currentStatus] > STATUS_RANK[item.previousStatus])) {
    const kpi = getEnterpriseKpi(transition.kpiId);
    if (!kpi) continue;
    const event = input.eventBySource.get(transition.transitionId) ?? null;
    const priority: ExecutiveAttentionPriority = transition.currentStatus === "CRITICAL" ? "HIGH" : "MEDIUM";
    items.push({
      stableId: `ATTN-${transition.transitionId}`,
      type: "NEGATIVE_TRANSITION",
      title: `${transition.kpiId} worsened to ${transition.currentStatus}`,
      priority,
      domain: kpi.domain,
      reasonForAttention: `${transition.kpiId} moved from ${transition.previousStatus} to ${transition.currentStatus} and requires investigation.`,
      supportingIntelligenceEventId: event?.eventId ?? null,
      evidence: transition.evidence,
      confidence: event?.confidence ?? confidenceFromEvidence(transition.evidence, "MEDIUM"),
      freshness: freshnessFromEvidence(transition.evidence),
      provenance: transition.provenance,
      suggestedReviewAction: "Investigate",
      rankScore: attentionRankScore(priority, event?.confidence.level ?? "MEDIUM", transition.evidence.length),
    });
  }

  for (const evaluation of input.health.evaluations.filter((item) => item.freshness === "STALE")) {
    items.push({
      stableId: `ATTN-${evaluation.kpi.id}-STALE`,
      type: "STALE_REQUIRED_DATA",
      title: `${evaluation.kpi.id} evidence is stale`,
      priority: "MEDIUM",
      domain: evaluation.kpi.domain,
      reasonForAttention: "Required evidence is stale and should be validated before leadership relies on the signal.",
      supportingIntelligenceEventId: null,
      evidence: evaluation.observation ? [{
        evidenceId: `EVD-${evaluation.kpi.id}-${evaluation.observation.observedAt ?? "unknown"}`,
        evidenceType: "KPI_OBSERVATION",
        kpiId: evaluation.kpi.id,
        sourceSystem: evaluation.observation.sourceAvailability,
        timestamp: evaluation.observation.observedAt ?? FIXTURE_OBSERVATION_TIMESTAMP,
        provenance: evaluation.observation.provenance,
        calculationVersion: INTELLIGENCE_CALCULATION_VERSION,
        internalRoute: `/admin/repository/enterprise-kpis/${encodeURIComponent(evaluation.kpi.id)}`,
      }] : [],
      confidence: confidenceFromEvidence([], "LOW"),
      freshness: emptyFreshness("STALE"),
      provenance: evaluation.observation?.provenance ?? "NON_PRODUCTION_FIXTURE",
      suggestedReviewAction: "Validate data source",
      rankScore: attentionRankScore("MEDIUM", "LOW", 1),
    });
  }

  for (const domain of input.health.domainResults.filter((item) => item.status === "UNKNOWN")) {
    items.push({
      stableId: `ATTN-DOMAIN-${domain.domain}-UNKNOWN`,
      type: "UNKNOWN_DOMAIN",
      title: `${domain.domain} domain health is unknown`,
      priority: DOMAIN_IMPORTANCE[domain.domain] >= 0.16 ? "MEDIUM" : "LOW",
      domain: domain.domain,
      reasonForAttention: "Domain health cannot be calculated from current governed evidence.",
      supportingIntelligenceEventId: null,
      evidence: [],
      confidence: confidenceFromEvidence([], "INSUFFICIENT"),
      freshness: emptyFreshness("UNKNOWN"),
      provenance: "NON_PRODUCTION_FIXTURE",
      suggestedReviewAction: "Defer pending evidence",
      rankScore: attentionRankScore(DOMAIN_IMPORTANCE[domain.domain] >= 0.16 ? "MEDIUM" : "LOW", "INSUFFICIENT", 0),
    });
  }

  for (const opportunity of input.opportunities.filter((item) => CONFIDENCE_RANK[item.confidence.level] >= CONFIDENCE_RANK.MEDIUM)) {
    const sourceEvent = input.events.find((event) => event.eventId === `EVT-${opportunity.signalId}`) ?? null;
    items.push({
      stableId: `ATTN-${opportunity.signalId}`,
      type: opportunity.condition.toLowerCase().includes("return") ? "RECOVERY_REVIEW" : "OPPORTUNITY_REVIEW",
      title: opportunity.condition,
      priority: "LOW",
      domain: opportunity.relevantDomain,
      reasonForAttention: opportunity.potentialEnterpriseValue,
      supportingIntelligenceEventId: sourceEvent?.eventId ?? null,
      evidence: opportunity.evidence,
      confidence: opportunity.confidence,
      freshness: freshnessFromEvidence(opportunity.evidence),
      provenance: opportunity.provenance,
      suggestedReviewAction: opportunity.condition.toLowerCase().includes("return") ? "Acknowledge recovery" : "Review with product",
      rankScore: attentionRankScore("LOW", opportunity.confidence.level, opportunity.evidence.length),
    });
  }

  return dedupeBy(items, (item) => item.stableId).sort((left, right) => right.rankScore - left.rankScore || left.stableId.localeCompare(right.stableId)).slice(0, 12);
}

function buildDataIntegritySummary(
  health: EnterpriseHealthSnapshot,
  events: IntelligenceEvent[],
  risks: RiskSignal[],
  opportunities: OpportunitySignal[],
): DataIntegritySummary {
  const allEvidence = uniqueEvidence([
    ...events.flatMap((item) => item.evidence),
    ...risks.flatMap((item) => item.evidence),
    ...opportunities.flatMap((item) => item.evidence),
  ]);
  return {
    overallProvenance: health.provenance,
    fixtureBackedOutputCount: allEvidence.filter((item) => item.provenance === "NON_PRODUCTION_FIXTURE").length,
    liveDataBackedOutputCount: allEvidence.filter((item) => item.provenance === "LIVE_INTERNAL").length,
    definedButUnavailableKpiCount: ENTERPRISE_KPI_REGISTRY.filter((item) => item.source.availability === "DEFINED_BUT_UNAVAILABLE").length,
    unknownKpiCount: health.unknownKpis.length,
    staleKpiCount: health.evaluations.filter((evaluation) => evaluation.freshness === "STALE").length,
    unknownDomainCount: health.domainResults.filter((domain) => domain.status === "UNKNOWN").length,
    overallCoveragePercentage: Math.round((health.includedKpis.length / ENTERPRISE_KPI_REGISTRY.length) * 100),
    confidenceLimitations: [
      "Fixture observations reduce confidence and cannot represent live enterprise outcomes.",
      "Unknown and defined-but-unavailable KPIs constrain domain and overall coverage.",
    ],
    freshnessLimitations: [
      "Stale evidence is surfaced explicitly and must not be treated as current.",
      "Missing timestamps produce UNKNOWN freshness rather than healthy status.",
    ],
    persistenceLimitations: [
      "Sprint 3 does not persist acknowledgments, assignments, notes, or brief history.",
      "Attention queue interactions are presentation-only until a separately authorized schema exists.",
    ],
    gap006Status: "OPEN_MATERIAL_REDUCED",
  };
}

function buildDrillDown(input: {
  summaryId: string;
  event: IntelligenceEvent | null;
  detectionRuleId: string;
  kpiIds: string[];
  evidence: EvidenceReference[];
  health: EnterpriseHealthSnapshot;
}): EvidenceDrillDown {
  const kpiIds = [...new Set(input.kpiIds)];
  const evaluations = kpiIds
    .map((kpiId) => input.health.evaluations.find((evaluation) => evaluation.kpi.id === kpiId))
    .filter((evaluation): evaluation is KpiEvaluation => Boolean(evaluation))
    .map((evaluation) => ({
      kpiId: evaluation.kpi.id,
      kpiName: evaluation.kpi.name,
      status: evaluation.status,
      observation: evaluation.observation,
      sourceAvailability: evaluation.observation?.sourceAvailability ?? evaluation.kpi.source.availability,
      provenance: evaluation.observation?.provenance ?? "DEFINED_ONLY",
    }));
  const missingEvidence = kpiIds.filter((kpiId) => !input.evidence.some((item) => item.kpiId === kpiId));

  return {
    summaryId: input.summaryId,
    intelligenceEventId: input.event?.eventId ?? null,
    detectionRuleId: input.event?.detectionRuleId ?? input.detectionRuleId,
    kpiIds,
    evaluations,
    evidence: uniqueEvidence(input.evidence),
    missingEvidence,
  };
}

function buildEventSourceMap(events: IntelligenceEvent[]) {
  const map = new Map<string, IntelligenceEvent>();
  for (const event of events) {
    if (event.eventId.startsWith("EVT-TRN-")) {
      map.set(event.eventId.slice("EVT-".length), event);
    }
    if (event.eventId.startsWith("EVT-TREND-")) {
      map.set(event.eventId.slice("EVT-".length), event);
    }
  }
  return map;
}

function materialRankScore(input: {
  severity: keyof typeof SEVERITY_RANK;
  confidence: keyof typeof CONFIDENCE_RANK;
  freshness: IntelligenceFreshnessState;
  evidenceCount: number;
  domain: KpiDomain;
  hasTimestamp: boolean;
}) {
  return (
    SEVERITY_RANK[input.severity] * 100 +
    CONFIDENCE_RANK[input.confidence] * 20 +
    FRESHNESS_RANK[input.freshness] * 10 +
    Math.min(input.evidenceCount, 5) * 3 +
    DOMAIN_IMPORTANCE[input.domain] * 10 +
    (input.hasTimestamp ? 3 : 1)
  );
}

function attentionRankScore(priority: ExecutiveAttentionPriority, confidence: keyof typeof CONFIDENCE_RANK, evidenceCount: number) {
  return ATTENTION_PRIORITY_RANK[priority] * 100 + CONFIDENCE_RANK[confidence] * 10 + Math.min(evidenceCount, 5);
}

function sortMaterialChanges(changes: ExecutiveMaterialChange[]) {
  return [...changes].sort((left, right) => right.rankScore - left.rankScore || left.changeId.localeCompare(right.changeId));
}

function sortRisks(risks: RiskSignal[]) {
  return [...risks].sort(
    (left, right) =>
      SEVERITY_RANK[right.severity] - SEVERITY_RANK[left.severity] ||
      CONFIDENCE_RANK[right.confidence.level] - CONFIDENCE_RANK[left.confidence.level] ||
      right.evidence.length - left.evidence.length ||
      left.signalId.localeCompare(right.signalId),
  );
}

function sortOpportunities(opportunities: OpportunitySignal[]) {
  return [...opportunities].sort(
    (left, right) =>
      CONFIDENCE_RANK[right.confidence.level] - CONFIDENCE_RANK[left.confidence.level] ||
      right.evidence.length - left.evidence.length ||
      left.signalId.localeCompare(right.signalId),
  );
}

function freshnessFromEvidence(evidence: EvidenceReference[]): FreshnessAssessment {
  const latest = [...evidence].sort((left, right) => right.timestamp.localeCompare(left.timestamp))[0];
  if (!latest) return emptyFreshness();
  const observedAt = new Date(latest.timestamp);
  const assessedAt = new Date(FIXTURE_OBSERVATION_TIMESTAMP);
  const ageHours = Number.isNaN(observedAt.getTime())
    ? null
    : (assessedAt.getTime() - observedAt.getTime()) / 3_600_000;
  const state: IntelligenceFreshnessState =
    ageHours === null ? "UNKNOWN" : ageHours <= 24 ? "FRESH" : ageHours <= 48 ? "AGING" : "STALE";
  return { state, ageHours, expectationHours: 24, assessedAt: FIXTURE_OBSERVATION_TIMESTAMP };
}

function emptyFreshness(state: IntelligenceFreshnessState = "UNKNOWN"): FreshnessAssessment {
  return { state, ageHours: null, expectationHours: null, assessedAt: FIXTURE_OBSERVATION_TIMESTAMP };
}

function confidenceFromEvidence(evidence: EvidenceReference[], fallback: ConfidenceAssessment["level"]): ConfidenceAssessment {
  const score = fallback === "HIGH" ? 0.82 : fallback === "MEDIUM" ? 0.62 : fallback === "LOW" ? 0.36 : 0.12;
  return {
    level: fallback,
    score,
    factors: [
      `${evidence.length} evidence reference(s)`,
      `${evidence[0]?.provenance ?? "NON_PRODUCTION_FIXTURE"} provenance`,
      "Executive Workspace presentation rule",
    ],
  };
}

function uniqueEvidence(evidence: EvidenceReference[]) {
  return dedupeBy(evidence, (item) => item.evidenceId);
}

function dedupeBy<T>(items: T[], keyFor: (item: T) => string) {
  const seen = new Set<string>();
  const result: T[] = [];
  for (const item of items) {
    const key = keyFor(item);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result;
}

function section(heading: string, body: string, supportingIntelligenceEventIds: string[], evidence: EvidenceReference[]): ExecutiveBriefSection {
  return {
    heading,
    body,
    supportingIntelligenceEventIds: [...new Set(supportingIntelligenceEventIds)],
    evidence: uniqueEvidence(evidence),
  };
}

function renderBrief(sections: ExecutiveBriefSection[]) {
  return [
    "PROJECT ATLAS",
    "Daily Executive Brief",
    "",
    ...sections.flatMap((item) => [item.heading, item.body, ""]),
  ].join("\n").trim();
}

function summarizeChanges(changes: ExecutiveMaterialChange[]) {
  if (changes.length === 0) return "No material change is available from the governed fixture set.";
  return changes
    .slice(0, 3)
    .map((item) => `${item.title} (${item.severity}, ${item.domain})`)
    .join("; ");
}

function summarizeDomain(changes: ExecutiveMaterialChange[], label: string) {
  if (changes.length === 0) return `${label} has no material change in the governed fixture set. Unknown or unavailable data remains visible elsewhere in the workspace.`;
  return changes
    .slice(0, 2)
    .map((item) => `${item.title} requires ${item.severity === "LOW" ? "monitoring" : "review"}.`)
    .join(" ");
}

function ids(changes: ExecutiveMaterialChange[]) {
  return changes.map((item) => item.intelligenceEventId).filter((item): item is string => Boolean(item));
}

function evidence(changes: ExecutiveMaterialChange[]) {
  return changes.flatMap((item) => item.evidence).slice(0, 5);
}

function eventIdsForEvidence(changes: ExecutiveMaterialChange[], evidenceReferences: EvidenceReference[]) {
  const evidenceIds = new Set(evidenceReferences.map((item) => item.evidenceId));
  return changes
    .filter((change) => change.evidence.some((item) => evidenceIds.has(item.evidenceId)))
    .map((change) => change.intelligenceEventId)
    .filter((item): item is string => Boolean(item));
}

function formatScore(score: number | null) {
  return score === null ? "UNKNOWN" : score.toFixed(1);
}
