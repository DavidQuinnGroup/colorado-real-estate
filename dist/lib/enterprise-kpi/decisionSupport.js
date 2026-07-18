import { FIXTURE_OBSERVATION_TIMESTAMP } from "./health.js";
import { EXECUTIVE_WORKSPACE_CALCULATION_VERSION, buildExecutiveCommandCenterPayload, } from "./executiveWorkspace.js";
import { INTELLIGENCE_CALCULATION_VERSION } from "./intelligence.js";
export const DECISION_SUPPORT_CALCULATION_VERSION = "EIF-1.0-decision-support-v1";
export const DECISION_SUPPORT_ROUTE = "/admin/repository/decision-support";
export const HUMAN_DECISION_REQUIRED = "HUMAN_DECISION_REQUIRED";
export const DECISION_SUPPORT_PROVENANCE = "NON_PRODUCTION_FIXTURE";
export const DECISION_CRITERIA_VERSION = "EIF-1.0-decision-criteria-v1";
export const DECISION_CRITERIA = [
    {
        criterionId: "CUSTOMER_VALUE",
        label: "Customer Value",
        description: "Likely value to preview participants or future customers based on governed evidence.",
        weight: 0.25,
        direction: "BENEFIT",
        version: DECISION_CRITERIA_VERSION,
        provisional: true,
    },
    {
        criterionId: "STRATEGIC_ALIGNMENT",
        label: "Strategic Alignment",
        description: "Alignment with controlled Internal Preview and governed launch-readiness objectives.",
        weight: 0.2,
        direction: "BENEFIT",
        version: DECISION_CRITERIA_VERSION,
        provisional: true,
    },
    {
        criterionId: "ENTERPRISE_LEVERAGE",
        label: "Enterprise Leverage",
        description: "Reusable enterprise capability value unlocked by the option.",
        weight: 0.15,
        direction: "BENEFIT",
        version: DECISION_CRITERIA_VERSION,
        provisional: true,
    },
    {
        criterionId: "OPERATIONAL_IMPACT",
        label: "Operational Impact",
        description: "Positive operational clarity, safety, or control gained by the option.",
        weight: 0.1,
        direction: "BENEFIT",
        version: DECISION_CRITERIA_VERSION,
        provisional: true,
    },
    {
        criterionId: "ENGINEERING_EFFORT",
        label: "Engineering Effort",
        description: "Implementation burden; higher raw effort reduces normalized desirability.",
        weight: 0.1,
        direction: "BURDEN",
        version: DECISION_CRITERIA_VERSION,
        provisional: true,
    },
    {
        criterionId: "FINANCIAL_VALUE",
        label: "Financial Value",
        description: "Known financial value from trustworthy sources; UNKNOWN when unavailable.",
        weight: 0.1,
        direction: "BENEFIT",
        version: DECISION_CRITERIA_VERSION,
        provisional: true,
    },
    {
        criterionId: "RISK",
        label: "Risk",
        description: "Risk burden; higher raw risk reduces normalized desirability.",
        weight: 0.1,
        direction: "BURDEN",
        version: DECISION_CRITERIA_VERSION,
        provisional: true,
    },
];
export const DECISION_SCORING_RULES = [
    "Criterion weights are centralized, versioned, provisional, and must sum to 1.0.",
    "Beneficial criteria use raw score directly as normalized score.",
    "Burden criteria invert raw score so higher engineering effort or risk reduces desirability.",
    "UNKNOWN and INSUFFICIENT_EVIDENCE criteria are excluded from the score numerator and reduce coverage/confidence.",
    "NOT_APPLICABLE criteria are excluded from scoring and listed separately.",
    "Final option score is rounded to a whole number to avoid false precision.",
];
export function validateDecisionCriteriaWeights(criteria = DECISION_CRITERIA) {
    const total = Number(criteria.reduce((sum, item) => sum + item.weight, 0).toFixed(8));
    return {
        valid: total === 1,
        total,
        version: DECISION_CRITERIA_VERSION,
        provisional: true,
    };
}
export function buildDecisionSupportSnapshot() {
    const commandCenter = buildExecutiveCommandCenterPayload();
    const packages = buildDecisionPackages(commandCenter);
    return {
        metadata: {
            generatedAt: FIXTURE_OBSERVATION_TIMESTAMP,
            calculationVersion: DECISION_SUPPORT_CALCULATION_VERSION,
            sourceCalculationVersions: [
                INTELLIGENCE_CALCULATION_VERSION,
                EXECUTIVE_WORKSPACE_CALCULATION_VERSION,
            ],
            route: DECISION_SUPPORT_ROUTE,
            access: "internal_admin",
            persistence: "READ_ONLY_NON_PERSISTENT",
            labels: [HUMAN_DECISION_REQUIRED, DECISION_SUPPORT_PROVENANCE],
        },
        criteria: DECISION_CRITERIA,
        criteriaValidation: validateDecisionCriteriaWeights(),
        scoringRules: DECISION_SCORING_RULES,
        situations: packages.map((item) => item.situation),
        packages,
        summary: {
            packageCount: packages.length,
            decisionSituations: packages.length,
            recommendationsAwaitingHumanReview: packages.filter((item) => item.recommendation.humanReviewRequirement === HUMAN_DECISION_REQUIRED).length,
            moreEvidenceRequired: packages.filter((item) => item.recommendation.recommendationKind === "VALIDATE_DATA_BEFORE_DECISION" ||
                item.recommendation.recommendationKind === "DEFER_PENDING_EVIDENCE" ||
                item.recommendation.recommendationKind === "NO_RECOMMENDATION_INSUFFICIENT_EVIDENCE").length,
            highestPriorityPackageId: packages[0]?.packageId ?? null,
            liveDataBackedOutputs: 0,
            fixtureBackedOutputs: packages.length,
            definedButUnavailableOutputs: commandCenter.dataIntegrity.definedButUnavailableKpiCount,
        },
    };
}
export function getDecisionSituations(options = {}) {
    const snapshot = buildDecisionSupportSnapshot();
    const filtered = options.domain
        ? snapshot.situations.filter((item) => item.relevantDomains.includes(options.domain))
        : snapshot.situations;
    const limit = Math.min(Math.max(options.limit ?? 100, 1), 250);
    const offset = Math.max(options.offset ?? 0, 0);
    return {
        count: filtered.length,
        limit,
        offset,
        situations: filtered.slice(offset, offset + limit),
    };
}
export function getDecisionPackages(options = {}) {
    const snapshot = buildDecisionSupportSnapshot();
    const filtered = options.domain
        ? snapshot.packages.filter((item) => item.situation.relevantDomains.includes(options.domain))
        : snapshot.packages;
    const limit = Math.min(Math.max(options.limit ?? 100, 1), 250);
    const offset = Math.max(options.offset ?? 0, 0);
    return {
        count: filtered.length,
        limit,
        offset,
        packages: filtered.slice(offset, offset + limit),
    };
}
export function getDecisionPackage(packageId) {
    return buildDecisionSupportSnapshot().packages.find((item) => item.packageId === packageId) ?? null;
}
export function getDecisionPackageComparison(packageId) {
    const decisionPackage = getDecisionPackage(packageId);
    return decisionPackage?.optionComparison ?? null;
}
export function getDecisionPackageRecommendation(packageId) {
    const decisionPackage = getDecisionPackage(packageId);
    return decisionPackage?.recommendation ?? null;
}
export function getDecisionPackageExpectedOutcomes(packageId) {
    const decisionPackage = getDecisionPackage(packageId);
    return decisionPackage?.expectedOutcomes ?? null;
}
function buildDecisionPackages(commandCenter) {
    const platformRisk = commandCenter.risks.find((item) => item.affectedDomains.includes("PLATFORM")) ?? commandCenter.risks[0] ?? null;
    const customerOpportunity = commandCenter.opportunities.find((item) => item.relevantDomain === "CUSTOMER") ?? commandCenter.opportunities[0] ?? null;
    const staleAttention = commandCenter.attentionItems.find((item) => item.type === "STALE_REQUIRED_DATA") ?? null;
    const governanceOpportunity = commandCenter.opportunities.find((item) => item.relevantDomain === "GOVERNANCE") ?? null;
    const packages = [
        buildPlatformRiskPackage(commandCenter, platformRisk),
        buildCustomerOpportunityPackage(commandCenter, customerOpportunity),
        buildDataIntegrityPackage(commandCenter, staleAttention),
        buildGovernanceRecoveryPackage(commandCenter, governanceOpportunity),
    ];
    return packages.sort((left, right) => urgencyRank(right.situation.urgency) - urgencyRank(left.situation.urgency) ||
        left.packageId.localeCompare(right.packageId));
}
function buildPlatformRiskPackage(commandCenter, risk) {
    const evidence = decisionEvidence(risk?.evidence ?? commandCenter.materialChanges.find((item) => item.domain === "PLATFORM")?.evidence ?? []);
    const eventIds = eventIdsFromEvidence(commandCenter, evidence);
    const situation = buildSituation({
        situationId: "DS-PLATFORM-RISK",
        title: "Platform preview risk requires leadership review",
        executiveQuestion: "Should leadership investigate platform risk immediately, monitor one more window, or pause preview expansion?",
        situationSummary: risk?.condition ?? "Platform intelligence includes a governed risk condition requiring review.",
        triggeringIntelligenceEventIds: eventIds,
        relevantDomains: ["PLATFORM"],
        relevantKpis: kpis(evidence, ["KPI-PLAT-001"]),
        relevantRiskIds: risk ? [risk.signalId] : [],
        relevantOpportunityIds: [],
        urgency: "IMMEDIATE",
        decisionHorizon: "SEVEN_DAYS",
        constraints: ["No autonomous operational action is authorized.", "Fixture output cannot certify live platform condition."],
        assumptions: ["Platform risk evidence should be reviewed before preview expansion decisions."],
        evidence,
        confidence: risk?.confidence ?? confidence("LOW", evidence.length),
        freshness: freshnessFromDecisionEvidence(evidence),
    });
    const options = scoreOptions([
        optionDraft("OPT-PLATFORM-INVESTIGATE", "INVESTIGATE", "Investigate immediately", "Review platform evidence and assign human investigation outside this read-only sprint.", evidence, {
            CUSTOMER_VALUE: 65,
            STRATEGIC_ALIGNMENT: 90,
            ENTERPRISE_LEVERAGE: 70,
            OPERATIONAL_IMPACT: 85,
            ENGINEERING_EFFORT: 45,
            FINANCIAL_VALUE: "UNKNOWN",
            RISK: 30,
        }),
        optionDraft("OPT-PLATFORM-MONITOR", "OBSERVE", "Monitor one more observation window", "Maintain current preview boundary and wait for another governed evidence window.", evidence, {
            CUSTOMER_VALUE: 45,
            STRATEGIC_ALIGNMENT: 60,
            ENTERPRISE_LEVERAGE: 45,
            OPERATIONAL_IMPACT: 45,
            ENGINEERING_EFFORT: 10,
            FINANCIAL_VALUE: "UNKNOWN",
            RISK: 55,
        }),
        optionDraft("OPT-PLATFORM-PAUSE", "PAUSE", "Pause preview expansion", "Do not expand preview scope until platform evidence is reviewed by leadership.", evidence, {
            CUSTOMER_VALUE: 35,
            STRATEGIC_ALIGNMENT: 75,
            ENTERPRISE_LEVERAGE: 55,
            OPERATIONAL_IMPACT: 70,
            ENGINEERING_EFFORT: 20,
            FINANCIAL_VALUE: "UNKNOWN",
            RISK: 25,
        }),
    ]);
    return decisionPackage("DP-PLATFORM-RISK", situation, "Platform risk can affect preview trust, safety controls, and leadership confidence.", options);
}
function buildCustomerOpportunityPackage(commandCenter, opportunity) {
    const evidence = decisionEvidence(opportunity?.evidence ?? commandCenter.materialChanges.find((item) => item.domain === "CUSTOMER")?.evidence ?? []);
    const eventIds = eventIdsFromEvidence(commandCenter, evidence);
    const situation = buildSituation({
        situationId: "DS-CUSTOMER-OPPORTUNITY",
        title: "Customer opportunity requires bounded review",
        executiveQuestion: "Should leadership invest in the workflow, maintain observation, or validate the signal through participant interviews?",
        situationSummary: opportunity?.condition ?? "Customer opportunity intelligence is available but fixture-backed.",
        triggeringIntelligenceEventIds: eventIds,
        relevantDomains: ["CUSTOMER"],
        relevantKpis: kpis(evidence, ["KPI-CUST-001"]),
        relevantRiskIds: [],
        relevantOpportunityIds: opportunity ? [opportunity.signalId] : [],
        urgency: "NEAR_TERM",
        decisionHorizon: "THIRTY_DAYS",
        constraints: ["No roadmap modification or investment approval is authorized.", "Customer opportunity evidence remains fixture-backed."],
        assumptions: ["Participant validation is required before treating the opportunity as live demand."],
        evidence,
        confidence: opportunity?.confidence ?? confidence("LOW", evidence.length),
        freshness: freshnessFromDecisionEvidence(evidence),
    });
    const options = scoreOptions([
        optionDraft("OPT-CUSTOMER-INVEST", "INVEST", "Invest in the workflow", "Prepare a scoped investment proposal for human review without creating roadmap work.", evidence, {
            CUSTOMER_VALUE: 80,
            STRATEGIC_ALIGNMENT: 70,
            ENTERPRISE_LEVERAGE: 75,
            OPERATIONAL_IMPACT: 55,
            ENGINEERING_EFFORT: 70,
            FINANCIAL_VALUE: "UNKNOWN",
            RISK: 60,
        }),
        optionDraft("OPT-CUSTOMER-MAINTAIN", "MAINTAIN", "Maintain and observe", "Keep the workflow in controlled preview observation until more evidence exists.", evidence, {
            CUSTOMER_VALUE: 55,
            STRATEGIC_ALIGNMENT: 70,
            ENTERPRISE_LEVERAGE: 50,
            OPERATIONAL_IMPACT: 50,
            ENGINEERING_EFFORT: 10,
            FINANCIAL_VALUE: "UNKNOWN",
            RISK: 25,
        }),
        optionDraft("OPT-CUSTOMER-VALIDATE", "VALIDATE_DATA", "Validate through participant interviews", "Collect human feedback outside this sprint before making investment or roadmap decisions.", evidence, {
            CUSTOMER_VALUE: 70,
            STRATEGIC_ALIGNMENT: 85,
            ENTERPRISE_LEVERAGE: 65,
            OPERATIONAL_IMPACT: 65,
            ENGINEERING_EFFORT: 25,
            FINANCIAL_VALUE: "UNKNOWN",
            RISK: 20,
        }),
    ]);
    return decisionPackage("DP-CUSTOMER-OPPORTUNITY", situation, "Customer opportunity signals can shape preview learning only after human validation.", options);
}
function buildDataIntegrityPackage(commandCenter, attention) {
    const evidence = decisionEvidence(attention?.evidence ?? commandCenter.evidenceReferences.filter((item) => item.provenance === "NON_PRODUCTION_FIXTURE").slice(0, 2));
    const eventIds = eventIdsFromEvidence(commandCenter, evidence);
    const situation = buildSituation({
        situationId: "DS-DATA-INTEGRITY",
        title: "Data integrity limits dependent executive decisions",
        executiveQuestion: "Should leadership build a live-source adapter, continue fixture-only demonstration, or defer dependent executive decisions?",
        situationSummary: "Unknown domains, defined-but-unavailable KPIs, and fixture-only evidence constrain decision applicability.",
        triggeringIntelligenceEventIds: eventIds,
        relevantDomains: ["GOVERNANCE", "OPERATIONS", "BUSINESS", "GROWTH"],
        relevantKpis: commandCenter.health.unknownKpis.slice(0, 6),
        relevantRiskIds: commandCenter.risks.filter((item) => item.condition.toLowerCase().includes("coverage")).map((item) => item.signalId),
        relevantOpportunityIds: [],
        urgency: "IMMEDIATE",
        decisionHorizon: "THIRTY_DAYS",
        constraints: ["No live-source adapter is authorized in Sprint 4.", "No production persistence or migration is authorized."],
        assumptions: ["Live-source work requires separate authorization and schema/security review."],
        evidence,
        confidence: confidence("LOW", evidence.length),
        freshness: freshnessFromDecisionEvidence(evidence),
    });
    const options = scoreOptions([
        optionDraft("OPT-DATA-BUILD-ADAPTER", "IMPROVE", "Build a live-source adapter", "Prepare a future authorized adapter plan; do not implement live collection in Sprint 4.", evidence, {
            CUSTOMER_VALUE: 60,
            STRATEGIC_ALIGNMENT: 90,
            ENTERPRISE_LEVERAGE: 95,
            OPERATIONAL_IMPACT: 85,
            ENGINEERING_EFFORT: 85,
            FINANCIAL_VALUE: "UNKNOWN",
            RISK: 65,
        }),
        optionDraft("OPT-DATA-FIXTURE-ONLY", "OBSERVE", "Continue fixture-only demonstration", "Use current fixture-backed intelligence only for interface and governance validation.", evidence, {
            CUSTOMER_VALUE: 25,
            STRATEGIC_ALIGNMENT: 45,
            ENTERPRISE_LEVERAGE: 35,
            OPERATIONAL_IMPACT: 35,
            ENGINEERING_EFFORT: 5,
            FINANCIAL_VALUE: "UNKNOWN",
            RISK: 45,
        }),
        optionDraft("OPT-DATA-DEFER-DECISIONS", "DEFER", "Defer dependent executive decisions", "Defer decisions that require live KPI evidence until governed sources are connected.", evidence, {
            CUSTOMER_VALUE: 45,
            STRATEGIC_ALIGNMENT: 80,
            ENTERPRISE_LEVERAGE: 65,
            OPERATIONAL_IMPACT: 70,
            ENGINEERING_EFFORT: 10,
            FINANCIAL_VALUE: "UNKNOWN",
            RISK: 20,
        }),
    ]);
    return decisionPackage("DP-DATA-INTEGRITY", situation, "Data integrity determines whether leadership can rely on the decision package beyond fixture demonstration.", options);
}
function buildGovernanceRecoveryPackage(commandCenter, opportunity) {
    const evidence = decisionEvidence(opportunity?.evidence ?? commandCenter.domains.find((item) => item.domain === "GOVERNANCE")?.contributions?.flatMap((item) => item.evidence) ?? []);
    const eventIds = eventIdsFromEvidence(commandCenter, evidence);
    const situation = buildSituation({
        situationId: "DS-GOVERNANCE-RECOVERY",
        title: "Governance recovery should be reviewed without premature closure",
        executiveQuestion: "Should leadership maintain controls, increase monitoring, or close a gap only if evidence supports closure?",
        situationSummary: opportunity?.condition ?? "Governance coverage is visible as a fixture-backed recovery signal.",
        triggeringIntelligenceEventIds: eventIds,
        relevantDomains: ["GOVERNANCE"],
        relevantKpis: kpis(evidence, ["KPI-GOV-001"]),
        relevantRiskIds: [],
        relevantOpportunityIds: opportunity ? [opportunity.signalId] : [],
        urgency: "SCHEDULED",
        decisionHorizon: "NINETY_DAYS",
        constraints: ["GAP closure requires governed live evidence where applicable.", "Fixture evidence cannot close live-source or persistence gaps."],
        assumptions: ["Governance recovery can justify maintaining controls but not automatic closure."],
        evidence,
        confidence: opportunity?.confidence ?? confidence("MEDIUM", evidence.length),
        freshness: freshnessFromDecisionEvidence(evidence),
    });
    const options = scoreOptions([
        optionDraft("OPT-GOV-MAINTAIN", "MAINTAIN", "Maintain controls", "Keep existing governance controls and continue evidence review.", evidence, {
            CUSTOMER_VALUE: 45,
            STRATEGIC_ALIGNMENT: 85,
            ENTERPRISE_LEVERAGE: 70,
            OPERATIONAL_IMPACT: 70,
            ENGINEERING_EFFORT: 10,
            FINANCIAL_VALUE: "UNKNOWN",
            RISK: 20,
        }),
        optionDraft("OPT-GOV-INCREASE-MONITORING", "IMPROVE", "Increase monitoring", "Add future monitoring requirements for leadership review without activating any automated cadence.", evidence, {
            CUSTOMER_VALUE: 45,
            STRATEGIC_ALIGNMENT: 80,
            ENTERPRISE_LEVERAGE: 75,
            OPERATIONAL_IMPACT: 80,
            ENGINEERING_EFFORT: 35,
            FINANCIAL_VALUE: "UNKNOWN",
            RISK: 30,
        }),
        optionDraft("OPT-GOV-CLOSE-GAP", "DEFER", "Close gap only if evidence supports closure", "Do not close GAP-006 until live-source and persistence criteria are genuinely satisfied.", evidence, {
            CUSTOMER_VALUE: 35,
            STRATEGIC_ALIGNMENT: 65,
            ENTERPRISE_LEVERAGE: 55,
            OPERATIONAL_IMPACT: 55,
            ENGINEERING_EFFORT: 15,
            FINANCIAL_VALUE: "UNKNOWN",
            RISK: 70,
        }),
    ]);
    return decisionPackage("DP-GOVERNANCE-RECOVERY", situation, "Governance recovery can reduce risk, but premature closure would overstate fixture-backed evidence.", options);
}
function decisionPackage(packageId, situation, whyItMatters, options) {
    const optionComparison = buildOptionComparison(options);
    const recommendation = recommendOption(options);
    const expectedOutcomes = uniqueBy(options.flatMap((item) => item.expectedOutcomes), (item) => item.outcomeId);
    const risksAndTradeoffs = uniqueBy(options.flatMap((item) => item.risks), (item) => item.riskId);
    const knownLimitations = uniqueBy([...situation.knownLimitations, ...options.flatMap((item) => item.limitations)], (item) => item.limitationId);
    return {
        packageId,
        labels: [HUMAN_DECISION_REQUIRED, DECISION_SUPPORT_PROVENANCE],
        situation,
        whyItMatters,
        supportingEvidence: situation.evidence,
        options,
        optionComparison,
        recommendation,
        risksAndTradeoffs,
        expectedOutcomes,
        confidence: packageConfidence(options, situation),
        dataFreshness: situation.freshness,
        knownLimitations,
        humanDecisionRequired: HUMAN_DECISION_REQUIRED,
        reviewSchedule: reviewSchedule(packageId, expectedOutcomes),
        dispositionDemo: {
            status: "NO_DECISION",
            selectedOptionId: null,
            rationaleRequired: true,
            demonstrationOnly: true,
            officialDecision: false,
            note: "No official enterprise decision is persisted in Sprint 4.",
        },
        overrideDemo: {
            originalRecommendationOptionId: recommendation.recommendedOptionId,
            selectedOptionId: null,
            overrideRationale: "Role-based placeholder rationale required before any official future override.",
            decisionAuthority: "EXECUTIVE_ROLE_PLACEHOLDER",
            knownRisksAccepted: risksAndTradeoffs.map((item) => item.description).slice(0, 3),
            expectedOutcomes,
            reviewDate: "2026-08-17",
            evidenceAcknowledged: situation.evidence,
            timestamp: FIXTURE_OBSERVATION_TIMESTAMP,
            provenance: DECISION_SUPPORT_PROVENANCE,
            demonstrationOnly: true,
        },
        calculationVersion: DECISION_SUPPORT_CALCULATION_VERSION,
        provenance: DECISION_SUPPORT_PROVENANCE,
    };
}
function scoreOptions(options) {
    return options.map((option) => ({
        ...option,
        score: scoreOption(option),
    }));
}
function scoreOption(option) {
    const criterionContributions = DECISION_CRITERIA.map((criterion) => scoreCriterion(criterion, option));
    const scored = criterionContributions.filter((item) => item.normalizedScore !== null && item.weightedContribution !== null);
    const unknownCriteria = criterionContributions
        .filter((item) => item.missingDataStatus === "UNKNOWN" || item.missingDataStatus === "INSUFFICIENT_EVIDENCE")
        .map((item) => item.criterionId);
    const excludedCriteria = criterionContributions
        .filter((item) => item.missingDataStatus === "NOT_APPLICABLE")
        .map((item) => item.criterionId);
    const scoredWeight = scored.reduce((sum, item) => sum + item.weight, 0);
    const totalScore = scoredWeight > 0
        ? Math.round(scored.reduce((sum, item) => sum + (item.weightedContribution ?? 0), 0) / scoredWeight)
        : null;
    const coveragePercentage = Math.round(scoredWeight * 100);
    const level = coveragePercentage >= 85 && unknownCriteria.length === 0 ? "MEDIUM" : coveragePercentage >= 55 ? "LOW" : "INSUFFICIENT";
    return {
        totalScore,
        maximumPossibleScore: 100,
        coveragePercentage,
        confidence: confidence(level, option.evidence.length, [
            `${coveragePercentage}% criterion coverage`,
            `${unknownCriteria.length} unknown criterion/criteria`,
            "NON_PRODUCTION_FIXTURE provenance reduces real-world applicability",
        ]),
        calculationApplicabilityConfidence: level === "INSUFFICIENT" ? "INSUFFICIENT" : "MEDIUM",
        realWorldApplicabilityConfidence: level === "MEDIUM" ? "LOW" : level,
        criterionContributions,
        unknownCriteria,
        excludedCriteria,
        riskAdjusted: true,
        calculationVersion: DECISION_SUPPORT_CALCULATION_VERSION,
        provenance: DECISION_SUPPORT_PROVENANCE,
    };
}
function scoreCriterion(criterion, option) {
    const raw = option.criterionRawScores[criterion.criterionId] ?? "UNKNOWN";
    const state = raw === "UNKNOWN" ? "UNKNOWN" :
        raw === "NOT_APPLICABLE" ? "NOT_APPLICABLE" :
            raw === "INSUFFICIENT_EVIDENCE" ? "INSUFFICIENT_EVIDENCE" : "SCORED";
    const normalizedScore = typeof raw === "number"
        ? criterion.direction === "BURDEN"
            ? Math.max(0, Math.min(100, 100 - raw))
            : Math.max(0, Math.min(100, raw))
        : null;
    return {
        criterionId: criterion.criterionId,
        rawAssessment: raw,
        normalizedScore,
        weight: criterion.weight,
        weightedContribution: normalizedScore === null ? null : normalizedScore * criterion.weight,
        supportingEvidence: option.evidence,
        confidence: confidence(state === "SCORED" ? "LOW" : "INSUFFICIENT", option.evidence.length),
        assumptions: option.assumptions,
        missingDataStatus: state,
        explanation: state === "SCORED"
            ? criterion.direction === "BURDEN"
                ? `${criterion.label} is a burden criterion; raw ${raw} becomes normalized ${normalizedScore}.`
                : `${criterion.label} is a benefit criterion; raw ${raw} becomes normalized ${normalizedScore}.`
            : `${criterion.label} is ${state}; it is excluded from the final score and reduces coverage/confidence.`,
    };
}
function recommendOption(options) {
    const ranked = [...options].sort((left, right) => (right.score.totalScore ?? -1) - (left.score.totalScore ?? -1));
    const top = ranked[0] ?? null;
    const second = ranked[1] ?? null;
    const evidence = decisionEvidence(top?.evidence ?? []);
    const materialUnknowns = top?.score.unknownCriteria ?? [];
    const materialRisks = top?.risks.filter((item) => item.level === "HIGH" || item.level === "UNKNOWN") ?? [];
    if (!top || top.score.totalScore === null || top.score.coveragePercentage < 45) {
        return recommendation("NO_RECOMMENDATION_INSUFFICIENT_EVIDENCE", null, "Evidence coverage is insufficient for a deterministic preferred option.", [], materialRisks, materialUnknowns, null, evidence);
    }
    if (top.type === "VALIDATE_DATA" || materialUnknowns.length >= 2) {
        return recommendation("VALIDATE_DATA_BEFORE_DECISION", top.optionId, "The highest-ranked path is data validation because missing evidence materially limits decision confidence.", top.score.criterionContributions.map((item) => item.criterionId), materialRisks, materialUnknowns, second?.optionId ?? null, evidence);
    }
    if (second?.score.totalScore !== null && top.score.totalScore !== null && Math.abs(top.score.totalScore - second.score.totalScore) <= 3) {
        return recommendation("EXECUTIVE_JUDGMENT_REQUIRED", top.optionId, "Top options are effectively tied; leadership judgment is required.", top.score.criterionContributions.map((item) => item.criterionId), materialRisks, materialUnknowns, second.optionId, evidence);
    }
    if (top.type === "DEFER") {
        return recommendation("DEFER_PENDING_EVIDENCE", top.optionId, "Deferral is favored because current evidence is fixture-backed or incomplete.", top.score.criterionContributions.map((item) => item.criterionId), materialRisks, materialUnknowns, second?.optionId ?? null, evidence);
    }
    return recommendation("RECOMMEND_OPTION", top.optionId, `${top.title} has the strongest deterministic option score, subject to human review.`, top.score.criterionContributions.map((item) => item.criterionId), materialRisks, materialUnknowns, second?.optionId ?? null, evidence);
}
function recommendation(recommendationKind, recommendedOptionId, reason, supportingCriteria, materialRisks, materialUnknowns, alternativeOptionId, evidence) {
    return {
        recommendationKind,
        recommendedOptionId,
        reason,
        supportingCriteria,
        materialRisks,
        materialUnknowns,
        confidence: confidence(materialUnknowns.length > 0 ? "LOW" : "MEDIUM", evidence.length),
        alternativeOptionId,
        conditionsThatCouldChangeRecommendation: [
            "Live-source evidence replaces fixture evidence.",
            "Unknown financial value becomes trustworthy and material.",
            "Engineering effort or risk assessment changes after human review.",
            "Stale or unavailable KPI evidence becomes current.",
        ],
        humanReviewRequirement: HUMAN_DECISION_REQUIRED,
        evidence,
        calculationVersion: DECISION_SUPPORT_CALCULATION_VERSION,
        provenance: DECISION_SUPPORT_PROVENANCE,
    };
}
function buildOptionComparison(options) {
    const ranking = [...options]
        .sort((left, right) => (right.score.totalScore ?? -1) - (left.score.totalScore ?? -1) || left.optionId.localeCompare(right.optionId))
        .map((item, index) => ({ optionId: item.optionId, rank: index + 1, score: item.score.totalScore }));
    return {
        criteria: DECISION_CRITERIA,
        scores: options.map((option) => ({ optionId: option.optionId, score: option.score })),
        ranking,
    };
}
function optionDraft(optionId, type, title, proposedAction, evidence, criterionRawScores) {
    return {
        optionId,
        type,
        title,
        description: `${title} is a fixture-backed Sprint 4 decision-support option.`,
        proposedAction,
        expectedBenefit: "Clarifies leadership choice without executing or persisting a decision.",
        customerImpact: type === "INVEST" || type === "IMPROVE" ? "Potential customer value requires validation." : "Customer impact remains bounded by current preview controls.",
        enterpriseImpact: "Enterprise impact is decision clarity with human authority preserved.",
        engineeringImplications: criterionRawScores.ENGINEERING_EFFORT === "UNKNOWN" ? "UNKNOWN" : "Engineering effort is provisional and must be reviewed by humans.",
        operationalImplications: "No operational change is executed by this package.",
        financialImplications: "UNKNOWN",
        risks: risksForOption(optionId, evidence, criterionRawScores.RISK),
        dependencies: ["Human leadership review", "Governed evidence review", "Separate authorization for any execution"],
        reversibility: type === "PAUSE" || type === "DEFER" || type === "OBSERVE" ? "HIGH" : "MEDIUM",
        expectedOutcomes: outcomesForOption(optionId, evidence),
        evidence,
        assumptions: ["Scores are deterministic presentation rules.", "Fixture-backed evidence limits real-world applicability."],
        limitations: [
            limitation(`${optionId}-LIM-FIXTURE`, "Option is based on NON_PRODUCTION_FIXTURE evidence.", "HIGH"),
            limitation(`${optionId}-LIM-FINANCIAL`, "Financial value is UNKNOWN because no trustworthy source exists.", "MEDIUM"),
        ],
        criterionRawScores,
    };
}
function risksForOption(optionId, evidence, rawRisk) {
    const level = typeof rawRisk === "number" ? rawRisk >= 65 ? "HIGH" : rawRisk >= 35 ? "MEDIUM" : "LOW" : "UNKNOWN";
    return [
        {
            riskId: `${optionId}-RISK-TECH`,
            category: "TECHNICAL",
            level,
            description: "Technical risk requires engineering review before execution.",
            evidence,
        },
        {
            riskId: `${optionId}-RISK-OPS`,
            category: "OPERATIONAL",
            level: level === "HIGH" ? "MEDIUM" : level,
            description: "Operational risk remains bounded because Sprint 4 executes nothing.",
            evidence,
        },
        {
            riskId: `${optionId}-RISK-FIN`,
            category: "FINANCIAL_UNCERTAINTY",
            level: "UNKNOWN",
            description: "Financial impact is unknown and must not be fabricated.",
            evidence,
        },
    ];
}
function outcomesForOption(optionId, evidence) {
    const kpiId = evidence.find((item) => item.kpiId)?.kpiId ?? null;
    return [
        {
            outcomeId: `${optionId}-OUTCOME-REVIEW`,
            description: "Leadership has reviewed a deterministic decision package with evidence, risks, unknowns, and expected outcomes.",
            relevantKpiId: kpiId,
            baseline: "UNAVAILABLE",
            target: "UNAVAILABLE",
            timeHorizon: "THIRTY_DAYS",
            measurementMethod: "Future Sprint 5 outcome tracking requires authorized live evidence and persistence.",
            source: evidence[0]?.sourceSystem ?? "DEFINED_BUT_UNAVAILABLE",
            confidence: confidence("LOW", evidence.length),
            limitations: [limitation(`${optionId}-OUTCOME-LIM`, "Baseline and target are unavailable in Sprint 4.", "HIGH")],
            provenance: DECISION_SUPPORT_PROVENANCE,
        },
    ];
}
function buildSituation(input) {
    if (input.evidence.length === 0) {
        throw new Error(`Decision situation ${input.situationId} requires governed evidence.`);
    }
    return {
        ...input,
        provenance: DECISION_SUPPORT_PROVENANCE,
        knownLimitations: [
            limitation(`${input.situationId}-FIXTURE`, "Situation is generated from NON_PRODUCTION_FIXTURE evidence.", "HIGH"),
            limitation(`${input.situationId}-NO-PERSISTENCE`, "No decision, disposition, override, or review schedule is persisted.", "HIGH"),
        ],
    };
}
function decisionEvidence(evidence) {
    return uniqueBy(evidence, (item) => item.evidenceId).map((item) => ({
        ...item,
        decisionUse: "SITUATION",
    }));
}
function kpis(evidence, fallback) {
    const ids = evidence.map((item) => item.kpiId).filter((item) => Boolean(item));
    return [...new Set(ids.length > 0 ? ids : fallback)];
}
function eventIdsFromEvidence(commandCenter, evidence) {
    const evidenceIds = new Set(evidence.map((item) => item.evidenceId));
    return commandCenter.materialChanges
        .filter((item) => item.evidence.some((reference) => evidenceIds.has(reference.evidenceId)))
        .map((item) => item.intelligenceEventId)
        .filter((item) => Boolean(item));
}
function packageConfidence(options, situationValue) {
    const avgCoverage = options.reduce((sum, option) => sum + option.score.coveragePercentage, 0) / Math.max(options.length, 1);
    const level = avgCoverage >= 85 && situationValue.confidence.level !== "INSUFFICIENT" ? "MEDIUM" : avgCoverage >= 55 ? "LOW" : "INSUFFICIENT";
    return confidence(level, situationValue.evidence.length, [
        `${Math.round(avgCoverage)}% average option score coverage`,
        `${situationValue.confidence.level} source intelligence confidence`,
        "Fixture provenance limits real-world applicability",
    ]);
}
function confidence(level, evidenceCount, factors) {
    const score = level === "HIGH" ? 0.85 : level === "MEDIUM" ? 0.62 : level === "LOW" ? 0.36 : 0.12;
    return {
        level,
        score,
        factors: factors ?? [
            `${evidenceCount} evidence reference(s)`,
            "NON_PRODUCTION_FIXTURE provenance",
            "Decision Support deterministic rule",
        ],
    };
}
function freshnessFromDecisionEvidence(evidence) {
    const latest = [...evidence].sort((left, right) => right.timestamp.localeCompare(left.timestamp))[0] ?? null;
    if (!latest)
        return { state: "UNKNOWN", ageHours: null, expectationHours: null, assessedAt: FIXTURE_OBSERVATION_TIMESTAMP };
    const ageHours = (new Date(FIXTURE_OBSERVATION_TIMESTAMP).getTime() - new Date(latest.timestamp).getTime()) / 3600000;
    const state = Number.isNaN(ageHours) ? "UNKNOWN" : ageHours <= 24 ? "FRESH" : ageHours <= 48 ? "AGING" : "STALE";
    return { state, ageHours: Number.isNaN(ageHours) ? null : ageHours, expectationHours: 24, assessedAt: FIXTURE_OBSERVATION_TIMESTAMP };
}
function reviewSchedule(packageId, outcomes) {
    return {
        reviewDate: "2026-08-17",
        reviewTrigger: "Human leadership review or availability of governed live-source evidence.",
        relevantExpectedOutcomeIds: outcomes.map((item) => item.outcomeId),
        evidenceRequired: ["Current KPI observation", "Source provenance", "Human rationale for disposition"],
        responsibleLeadershipRole: "Executive Decision Authority",
        schedulingStatus: "SEMANTIC_ONLY_NOT_SCHEDULED",
    };
}
function limitation(limitationId, description, severity) {
    return { limitationId, description, severity };
}
function urgencyRank(urgency) {
    return urgency === "IMMEDIATE" ? 4 : urgency === "NEAR_TERM" ? 3 : urgency === "SCHEDULED" ? 2 : 1;
}
function uniqueBy(items, keyFor) {
    const seen = new Set();
    const result = [];
    for (const item of items) {
        const key = keyFor(item);
        if (seen.has(key))
            continue;
        seen.add(key);
        result.push(item);
    }
    return result;
}
