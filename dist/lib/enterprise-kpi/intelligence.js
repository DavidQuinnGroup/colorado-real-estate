import { ENTERPRISE_KPI_REGISTRY, getEnterpriseKpi } from "./registry.js";
import { evaluateKpi, scoreForStatus } from "./evaluation.js";
import { EIF_FIXTURE_OBSERVATIONS, FIXTURE_OBSERVATION_TIMESTAMP, buildEnterpriseHealthSnapshot, } from "./health.js";
export const INTELLIGENCE_CALCULATION_VERSION = "EIF-1.0-intelligence-v1";
const DOMAINS = [
    "PLATFORM",
    "CUSTOMER",
    "OPERATIONS",
    "BUSINESS",
    "GROWTH",
    "GOVERNANCE",
];
export const PROVISIONAL_DOMAIN_WEIGHTS = {
    PLATFORM: 0.22,
    CUSTOMER: 0.16,
    OPERATIONS: 0.2,
    BUSINESS: 0.14,
    GROWTH: 0.12,
    GOVERNANCE: 0.16,
};
export const EIF_DEMO_OBSERVATION_SERIES = {
    "KPI-PLAT-001": [
        fixture("KPI-PLAT-001", 97.5, "2026-07-18T16:43:18Z", "Platform availability warning demonstration."),
        fixture("KPI-PLAT-001", 99.1, "2026-07-18T17:43:18Z", "Platform availability recovering."),
        fixture("KPI-PLAT-001", 100, "2026-07-18T18:43:18Z", "Platform availability healthy."),
    ],
    "KPI-PLAT-002": [
        fixture("KPI-PLAT-002", 100, "2026-07-18T16:43:18Z", "Search success stable."),
        fixture("KPI-PLAT-002", 100, "2026-07-18T17:43:18Z", "Search success stable."),
        fixture("KPI-PLAT-002", 100, "2026-07-18T18:43:18Z", "Search success stable."),
    ],
    "KPI-OPS-001": [
        fixture("KPI-OPS-001", 0, "2026-07-18T16:43:18Z", "No open high operational issues."),
        fixture("KPI-OPS-001", 1.5, "2026-07-18T17:43:18Z", "Warning-level operational issue count introduced for demonstration."),
        fixture("KPI-OPS-001", 2, "2026-07-18T18:43:18Z", "Operational issue count crossing critical boundary in demonstration."),
    ],
    "KPI-GOV-001": [
        fixture("KPI-GOV-001", 100, "2026-07-09T18:43:18Z", "Stale governance coverage fixture."),
        fixture("KPI-GOV-001", 100, "2026-07-10T18:43:18Z", "Stale governance coverage fixture."),
    ],
    "KPI-CUST-001": [
        fixture("KPI-CUST-001", 1, "2026-07-18T18:43:18Z", "Single observation produces insufficient trend data."),
    ],
};
function fixture(kpiId, value, observedAt, note) {
    return {
        kpiId,
        value,
        observedAt,
        provenance: "NON_PRODUCTION_FIXTURE",
        sourceAvailability: "FIXTURE_AVAILABLE",
        note,
    };
}
export function evidenceForObservation(observation, calculationVersion = INTELLIGENCE_CALCULATION_VERSION) {
    return {
        evidenceId: `EVD-${observation.kpiId}-${observation.observedAt ?? "unknown"}`,
        evidenceType: "KPI_OBSERVATION",
        kpiId: observation.kpiId,
        sourceSystem: observation.sourceAvailability,
        timestamp: observation.observedAt ?? FIXTURE_OBSERVATION_TIMESTAMP,
        provenance: observation.provenance,
        calculationVersion,
        internalRoute: `/admin/repository/enterprise-kpis/${encodeURIComponent(observation.kpiId)}`,
    };
}
export function assessFreshness(observation, expectationHours, assessedAt = new Date(FIXTURE_OBSERVATION_TIMESTAMP)) {
    if (!observation?.observedAt || expectationHours === null) {
        return { state: "UNKNOWN", ageHours: null, expectationHours, assessedAt: assessedAt.toISOString() };
    }
    const observedAt = new Date(observation.observedAt);
    if (Number.isNaN(observedAt.getTime())) {
        return { state: "UNKNOWN", ageHours: null, expectationHours, assessedAt: assessedAt.toISOString() };
    }
    const ageHours = (assessedAt.getTime() - observedAt.getTime()) / 3600000;
    const state = ageHours <= expectationHours * 0.5 ? "FRESH" : ageHours <= expectationHours ? "AGING" : "STALE";
    return { state, ageHours, expectationHours, assessedAt: assessedAt.toISOString() };
}
export function assessConfidence(input) {
    let score = input.ruleCertainty ?? 0.8;
    if (input.observationCount < 2)
        score -= 0.35;
    else if (input.observationCount < 3)
        score -= 0.15;
    if (input.provenance === "NON_PRODUCTION_FIXTURE")
        score -= 0.2;
    if (input.freshness === "STALE")
        score -= 0.25;
    if (input.freshness === "UNKNOWN")
        score -= 0.2;
    if (input.coveragePercentage < 50)
        score -= 0.25;
    score = Math.max(0, Math.min(1, score));
    const level = score >= 0.8 ? "HIGH" : score >= 0.55 ? "MEDIUM" : score >= 0.25 ? "LOW" : "INSUFFICIENT";
    return {
        level,
        score,
        factors: [
            `${input.observationCount} observation(s)`,
            `${input.provenance} provenance`,
            `${input.freshness} freshness`,
            `${input.coveragePercentage}% evidence coverage`,
        ],
    };
}
function normalizeEvaluation(evaluation) {
    return scoreForStatus(evaluation.status);
}
function weightedAverage(items) {
    const weight = items.reduce((sum, item) => sum + item.weight, 0);
    if (weight <= 0)
        return null;
    return items.reduce((sum, item) => sum + item.score * item.weight, 0) / weight;
}
function statusFromScore(score) {
    if (score === null)
        return "UNKNOWN";
    if (score >= 80)
        return "HEALTHY";
    if (score >= 50)
        return "WARNING";
    return "CRITICAL";
}
export function calculateDomainHealth(domain, evaluations, now = new Date(FIXTURE_OBSERVATION_TIMESTAMP)) {
    const domainEvaluations = evaluations.filter((evaluation) => evaluation.kpi.domain === domain);
    const eligible = domainEvaluations.filter((evaluation) => evaluation.includedInHealth);
    const coveragePercentage = Math.round((eligible.length / Math.max(domainEvaluations.length, 1)) * 100);
    const minimumEvidenceMet = eligible.length >= 1 && coveragePercentage >= 25;
    const weighted = eligible
        .map((evaluation) => {
        const score = normalizeEvaluation(evaluation);
        const weight = evaluation.kpi.weight ?? 0;
        return score === null || weight <= 0 ? null : { score, weight };
    })
        .filter((item) => item !== null);
    const score = minimumEvidenceMet ? weightedAverage(weighted) : null;
    const latestObservation = eligible
        .map((evaluation) => evaluation.observation)
        .filter((observation) => observation !== null)
        .sort((left, right) => String(right.observedAt).localeCompare(String(left.observedAt)))[0] ?? null;
    const freshness = assessFreshness(latestObservation, latestObservation ? 24 : null, now);
    return {
        domain,
        status: minimumEvidenceMet ? statusFromScore(score) : "UNKNOWN",
        includedKpis: eligible.map((evaluation) => evaluation.kpi.id),
        excludedKpis: domainEvaluations.filter((evaluation) => !evaluation.includedInHealth).map((evaluation) => evaluation.kpi.id),
        unknownKpis: domainEvaluations.filter((evaluation) => evaluation.status === "UNKNOWN").map((evaluation) => evaluation.kpi.id),
        staleKpis: domainEvaluations.filter((evaluation) => evaluation.freshness === "STALE").map((evaluation) => evaluation.kpi.id),
        notApplicableKpis: domainEvaluations.filter((evaluation) => evaluation.status === "NOT_APPLICABLE").map((evaluation) => evaluation.kpi.id),
        coveragePercentage,
        confidence: assessConfidence({
            observationCount: eligible.length,
            provenance: latestObservation?.provenance ?? "DEFINED_ONLY",
            freshness: freshness.state,
            coveragePercentage,
        }).level,
        freshness: freshness.state,
        calculationVersion: INTELLIGENCE_CALCULATION_VERSION,
        generatedAt: now.toISOString(),
        provenance: latestObservation?.provenance ?? "DEFINED_ONLY",
        contributions: domainEvaluations.map((evaluation) => {
            const normalizedScore = normalizeEvaluation(evaluation);
            const weight = evaluation.kpi.weight ?? 0;
            return {
                kpiId: evaluation.kpi.id,
                status: evaluation.status,
                normalizedScore,
                weight,
                weightedScore: normalizedScore === null || weight <= 0 ? null : normalizedScore * weight,
                included: evaluation.includedInHealth && weight > 0,
                exclusionReason: evaluation.exclusionReason,
                evidence: evaluation.observation ? [evidenceForObservation(evaluation.observation)] : [],
            };
        }),
        score,
    };
}
export function buildIntelligenceHealthSnapshot(observations = EIF_FIXTURE_OBSERVATIONS, now = new Date(FIXTURE_OBSERVATION_TIMESTAMP), domainWeights = PROVISIONAL_DOMAIN_WEIGHTS) {
    const base = buildEnterpriseHealthSnapshot(observations, now);
    const domainResults = DOMAINS.map((domain) => calculateDomainHealth(domain, base.evaluations, now));
    const includedDomains = domainResults.filter((domain) => domain.score !== null);
    const weighted = includedDomains.map((domain) => ({
        score: domain.score ?? 0,
        weight: domainWeights[domain.domain],
    }));
    const minimumDataRequirementMet = includedDomains.length >= 3;
    const overallScore = minimumDataRequirementMet ? weightedAverage(weighted) : null;
    const latestFreshness = includedDomains.some((domain) => domain.freshness === "STALE")
        ? "STALE"
        : includedDomains.some((domain) => domain.freshness === "AGING")
            ? "AGING"
            : includedDomains.length > 0
                ? "FRESH"
                : "UNKNOWN";
    return {
        ...base,
        calculationVersion: INTELLIGENCE_CALCULATION_VERSION,
        domainResults,
        overallScore,
        overallStatus: minimumDataRequirementMet ? statusFromScore(overallScore) : "UNKNOWN",
        minimumDataRequirementMet,
        domainWeights,
        includedDomains: includedDomains.map((domain) => domain.domain),
        excludedDomains: domainResults.filter((domain) => domain.score === null).map((domain) => domain.domain),
        confidence: assessConfidence({
            observationCount: base.includedKpis.length,
            provenance: "NON_PRODUCTION_FIXTURE",
            freshness: latestFreshness,
            coveragePercentage: Math.round((includedDomains.length / DOMAINS.length) * 100),
        }).level,
        freshness: latestFreshness,
        limitations: [
            "Sprint 2 intelligence is deterministic and fixture-backed.",
            "No live collection adapter, scheduler, worker, or production persistence is active.",
            "Domain weights are provisional and configurable, not permanently authoritative.",
        ],
    };
}
export function analyzeKpiTrend(kpiId, observations = EIF_DEMO_OBSERVATION_SERIES[kpiId] ?? [], now = new Date(FIXTURE_OBSERVATION_TIMESTAMP)) {
    const definition = getEnterpriseKpi(kpiId);
    const ordered = [...observations].sort((left, right) => String(left.observedAt).localeCompare(String(right.observedAt)));
    const evidence = ordered.map((item) => evidenceForObservation(item));
    const latest = ordered[ordered.length - 1] ?? null;
    const freshness = assessFreshness(latest, definition?.freshnessExpectationHours ?? null, now);
    if (!definition || ordered.length < 2) {
        return trendResult(kpiId, "INSUFFICIENT_DATA", "UNKNOWN", ordered, freshness, evidence);
    }
    const values = ordered.map((item) => item.value).filter((value) => value !== null);
    if (values.length < 2)
        return trendResult(kpiId, "INSUFFICIENT_DATA", "UNKNOWN", ordered, freshness, evidence);
    const deltas = values.slice(1).map((value, index) => value - values[index]);
    const hasUp = deltas.some((delta) => delta > 0);
    const hasDown = deltas.some((delta) => delta < 0);
    const rawDirection = hasUp && hasDown ? "MIXED" : hasUp ? "UP" : hasDown ? "DOWN" : "FLAT";
    const absoluteChange = values[values.length - 1] - values[0];
    const improves = definition.desiredTrend === "HIGHER_IS_BETTER" ? absoluteChange > 0 : absoluteChange < 0;
    const declines = definition.desiredTrend === "HIGHER_IS_BETTER" ? absoluteChange < 0 : absoluteChange > 0;
    const trend = rawDirection === "MIXED" ? "VOLATILE" : absoluteChange === 0 ? "STABLE" : improves ? "IMPROVING" : declines ? "DECLINING" : "UNKNOWN";
    return trendResult(kpiId, trend, rawDirection, ordered, freshness, evidence);
}
function trendResult(kpiId, trend, rawDirection, ordered, freshness, evidence) {
    const values = ordered.map((item) => item.value).filter((value) => value !== null);
    const startingValue = values[0] ?? null;
    const endingValue = values[values.length - 1] ?? null;
    const absoluteChange = startingValue === null || endingValue === null ? null : endingValue - startingValue;
    const percentageChange = startingValue && absoluteChange !== null ? (absoluteChange / Math.abs(startingValue)) * 100 : null;
    return {
        kpiId,
        trend,
        rawDirection,
        windowStart: ordered[0]?.observedAt ?? null,
        windowEnd: ordered[ordered.length - 1]?.observedAt ?? null,
        observationCount: ordered.length,
        startingValue,
        endingValue,
        absoluteChange,
        percentageChange,
        staleObservationCount: freshness.state === "STALE" ? 1 : 0,
        confidence: assessConfidence({
            observationCount: ordered.length,
            provenance: ordered[0]?.provenance ?? "DEFINED_ONLY",
            freshness: freshness.state,
            coveragePercentage: ordered.length >= 3 ? 100 : 40,
        }),
        freshness,
        provenance: ordered[0]?.provenance ?? "DEFINED_ONLY",
        evidence,
        calculationVersion: INTELLIGENCE_CALCULATION_VERSION,
    };
}
export function getKpiTrends() {
    return ENTERPRISE_KPI_REGISTRY.map((definition) => analyzeKpiTrend(definition.id));
}
export function detectKpiTransitions() {
    const transitions = [];
    const seen = new Set();
    for (const [kpiId, observations] of Object.entries(EIF_DEMO_OBSERVATION_SERIES)) {
        const definition = getEnterpriseKpi(kpiId);
        if (!definition)
            continue;
        const ordered = [...observations].sort((left, right) => String(left.observedAt).localeCompare(String(right.observedAt)));
        for (let index = 1; index < ordered.length; index += 1) {
            const previous = evaluateKpi(definition, ordered[index - 1], new Date(FIXTURE_OBSERVATION_TIMESTAMP));
            const current = evaluateKpi(definition, ordered[index], new Date(FIXTURE_OBSERVATION_TIMESTAMP));
            if (previous.status === current.status && previous.freshness === current.freshness)
                continue;
            const transitionId = `TRN-${kpiId}-${previous.status}-TO-${current.status}-${ordered[index].observedAt}`;
            if (seen.has(transitionId))
                continue;
            seen.add(transitionId);
            transitions.push({
                transitionId,
                kpiId,
                previousStatus: previous.status,
                currentStatus: current.status,
                previousValue: ordered[index - 1].value,
                currentValue: ordered[index].value,
                effectiveTimestamp: ordered[index].observedAt ?? FIXTURE_OBSERVATION_TIMESTAMP,
                provenance: ordered[index].provenance,
                threshold: definition.thresholds,
                calculationVersion: INTELLIGENCE_CALCULATION_VERSION,
                evidence: [evidenceForObservation(ordered[index - 1]), evidenceForObservation(ordered[index])],
            });
        }
    }
    return transitions;
}
export function detectRiskSignals() {
    const snapshot = buildIntelligenceHealthSnapshot();
    const trends = getKpiTrends();
    const transitions = detectKpiTransitions();
    const signals = [];
    for (const evaluation of snapshot.evaluations) {
        if (evaluation.status === "CRITICAL") {
            signals.push(risk(`RISK-${evaluation.kpi.id}-CRITICAL`, "KPI enters CRITICAL", "HIGH", [evaluation.kpi.domain], evaluation.observation ? [evidenceForObservation(evaluation.observation)] : []));
        }
    }
    for (const trend of trends.filter((item) => item.trend === "DECLINING")) {
        const kpi = getEnterpriseKpi(trend.kpiId);
        if (kpi)
            signals.push(risk(`RISK-${trend.kpiId}-DECLINING`, "KPI declines across governed trend window", "MEDIUM", [kpi.domain], trend.evidence));
    }
    for (const transition of transitions.filter((item) => item.currentStatus === "CRITICAL")) {
        const kpi = getEnterpriseKpi(transition.kpiId);
        if (kpi)
            signals.push(risk(`RISK-${transition.kpiId}-ENTERED-CRITICAL`, "KPI enters CRITICAL", "HIGH", [kpi.domain], transition.evidence));
    }
    for (const domain of snapshot.domainResults.filter((item) => item.status === "CRITICAL")) {
        signals.push(risk(`RISK-${domain.domain}-DOMAIN-CRITICAL`, "Domain health falls below governed threshold", "HIGH", [domain.domain], domain.contributions?.flatMap((item) => item.evidence) ?? []));
    }
    for (const trend of trends.filter((item) => item.freshness.state === "STALE")) {
        const kpi = getEnterpriseKpi(trend.kpiId);
        if (kpi)
            signals.push(risk(`RISK-${trend.kpiId}-STALE`, "Required data becomes stale", "MEDIUM", [kpi.domain], trend.evidence));
    }
    if (!snapshot.minimumDataRequirementMet) {
        signals.push(risk("RISK-OVERALL-COVERAGE", "Overall evidence coverage falls below minimum", "HIGH", DOMAINS, []));
    }
    return signals;
}
function risk(signalId, condition, severity, affectedDomains, evidence) {
    return {
        signalId,
        condition,
        severity,
        confidence: assessConfidence({
            observationCount: evidence.length,
            provenance: evidence[0]?.provenance ?? "NON_PRODUCTION_FIXTURE",
            freshness: "FRESH",
            coveragePercentage: evidence.length > 0 ? 75 : 25,
        }),
        affectedDomains,
        potentialConsequence: "Condition is associated with reduced confidence in the affected preview capability and requires investigation.",
        suggestedInvestigationArea: "Review the supporting KPI evidence, source availability, and governed readiness records.",
        evidence,
        provenance: evidence[0]?.provenance ?? "NON_PRODUCTION_FIXTURE",
    };
}
export function detectOpportunitySignals() {
    const trends = getKpiTrends();
    const transitions = detectKpiTransitions();
    const signals = [];
    for (const trend of trends.filter((item) => item.trend === "IMPROVING")) {
        const kpi = getEnterpriseKpi(trend.kpiId);
        if (kpi)
            signals.push(opportunity(`OPP-${trend.kpiId}-IMPROVING`, "KPI improves consistently", kpi.domain, "Improving KPI behavior may support carefully scoped preview confidence.", trend.evidence));
    }
    for (const transition of transitions.filter((item) => item.previousStatus === "WARNING" && item.currentStatus === "HEALTHY")) {
        const kpi = getEnterpriseKpi(transition.kpiId);
        if (kpi)
            signals.push(opportunity(`OPP-${transition.kpiId}-RETURNED-HEALTHY`, "A formerly warning KPI returns to healthy", kpi.domain, "Recovery may indicate a stabilizing preview capability for human review.", transition.evidence));
    }
    const governance = buildIntelligenceHealthSnapshot().domainResults.find((item) => item.domain === "GOVERNANCE");
    if (governance?.status === "HEALTHY") {
        signals.push(opportunity("OPP-GOVERNANCE-TARGET", "Governance coverage reaches or maintains target", "GOVERNANCE", "Strong governance coverage may support controlled preview expansion review.", governance.contributions?.flatMap((item) => item.evidence) ?? []));
    }
    return signals;
}
function opportunity(signalId, condition, relevantDomain, value, evidence) {
    return {
        signalId,
        condition,
        confidence: assessConfidence({
            observationCount: evidence.length,
            provenance: evidence[0]?.provenance ?? "NON_PRODUCTION_FIXTURE",
            freshness: "FRESH",
            coveragePercentage: 75,
        }),
        relevantDomain,
        potentialEnterpriseValue: value,
        suggestedReviewArea: "Review the supporting evidence before making any roadmap, investment, or launch decision.",
        evidence,
        provenance: evidence[0]?.provenance ?? "NON_PRODUCTION_FIXTURE",
    };
}
export function buildIntelligenceEvents() {
    const detectedAt = FIXTURE_OBSERVATION_TIMESTAMP;
    const transitions = detectKpiTransitions();
    const trends = getKpiTrends();
    const risks = detectRiskSignals();
    const opportunities = detectOpportunitySignals();
    const events = [];
    for (const transition of transitions) {
        const kpi = getEnterpriseKpi(transition.kpiId);
        if (!kpi)
            continue;
        events.push(event(`EVT-${transition.transitionId}`, "KPI_THRESHOLD_CROSSING", `${transition.kpiId} threshold changed`, `${transition.kpiId} moved from ${transition.previousStatus} to ${transition.currentStatus}.`, transition.currentStatus === "CRITICAL" ? "HIGH" : "MEDIUM", kpi.domain, [transition.kpiId], transition.evidence, "RULE-KPI-TRANSITION", detectedAt));
    }
    for (const trend of trends.filter((item) => ["IMPROVING", "DECLINING", "VOLATILE"].includes(item.trend))) {
        const kpi = getEnterpriseKpi(trend.kpiId);
        if (!kpi)
            continue;
        events.push(event(`EVT-TREND-${trend.kpiId}-${trend.trend}`, "KPI_TREND_CHANGE", `${trend.kpiId} trend ${trend.trend}`, `${trend.kpiId} trend is ${trend.trend}; this is deterministic fixture intelligence, not a statistical claim.`, trend.trend === "DECLINING" ? "MEDIUM" : "LOW", kpi.domain, [trend.kpiId], trend.evidence, "RULE-KPI-TREND", detectedAt));
    }
    for (const signal of risks) {
        events.push(event(`EVT-${signal.signalId}`, "ENTERPRISE_RISK", signal.condition, signal.potentialConsequence, signal.severity, signal.affectedDomains[0] ?? "OPERATIONS", signal.evidence.map((item) => item.kpiId).filter((item) => Boolean(item)), signal.evidence, "RULE-RISK-SIGNAL", detectedAt));
    }
    for (const signal of opportunities) {
        events.push(event(`EVT-${signal.signalId}`, "ENTERPRISE_OPPORTUNITY", signal.condition, signal.potentialEnterpriseValue, "LOW", signal.relevantDomain, signal.evidence.map((item) => item.kpiId).filter((item) => Boolean(item)), signal.evidence, "RULE-OPPORTUNITY-SIGNAL", detectedAt));
    }
    return events;
}
function event(eventId, eventClass, title, summary, severity, domain, kpiIds, evidence, detectionRuleId, detectedAt) {
    const freshness = assessFreshness(evidence[0]
        ? {
            kpiId: evidence[0].kpiId ?? "UNKNOWN",
            value: null,
            observedAt: evidence[0].timestamp,
            provenance: evidence[0].provenance,
            sourceAvailability: "FIXTURE_AVAILABLE",
            note: "Evidence freshness proxy.",
        }
        : null, 24);
    return {
        eventId,
        eventClass,
        title,
        summary,
        severity,
        domain,
        kpiIds: [...new Set(kpiIds)],
        evidence,
        confidence: assessConfidence({
            observationCount: evidence.length,
            provenance: evidence[0]?.provenance ?? "NON_PRODUCTION_FIXTURE",
            freshness: freshness.state,
            coveragePercentage: evidence.length > 0 ? 75 : 25,
        }),
        freshness,
        provenance: evidence[0]?.provenance ?? "NON_PRODUCTION_FIXTURE",
        detectionRuleId,
        calculationVersion: INTELLIGENCE_CALCULATION_VERSION,
        detectedAt,
        recommendedAttentionLevel: severity === "CRITICAL" || severity === "HIGH" ? "ESCALATE" : severity === "MEDIUM" ? "REVIEW" : "MONITOR",
    };
}
