import {
  composeAgentBriefing,
  type AgentBriefingComposition,
  type AgentBriefingTraceability,
} from "./agentBriefingComposition";

export const AGENT_BUYER_PREPARATION_CAPABILITY =
  "AGENT_BUYER_CONSULTATION_PREPARATION" as const;
export const AGENT_BUYER_PREPARATION_ROUTE = "/agent/prepare/buyer" as const;

export const AGENT_BUYER_DISCUSSION_PRIORITIES = [
  "BUYING_PROCESS",
  "TIMING",
  "SEARCH_GEOGRAPHY",
  "PROPERTY_NEEDS",
  "FINANCING_READINESS",
  "MARKET_CONTEXT",
  "PLACE_CONTEXT",
  "SEARCH_STRATEGY",
  "TOURING_PROCESS",
  "DECISION_PROCESS",
  "PROFESSIONAL_DUE_DILIGENCE",
] as const;
export const AGENT_BUYER_FINANCING_STATUSES = [
  "NOT_DISCUSSED",
  "CASH_REPORTED",
  "FINANCING_EXPECTED",
  "PREAPPROVAL_REPORTED",
  "LENDER_CONVERSATION_REPORTED",
  "UNKNOWN_OR_OTHER",
] as const;
export const AGENT_BUYER_CERTIFIED_CITIES = [
  "Boulder",
  "Louisville",
  "Lafayette",
] as const;
const AGENT_BUYER_STAGES = ["DISCOVERY", "READINESS"] as const;
const AGENT_BUYER_PROPERTY_OBJECTIVES = [
  "SINGLE_FAMILY",
  "CONDO_TOWNHOME",
  "MULTI_FAMILY",
  "LAND",
  "UNSPECIFIED",
] as const;
const AGENT_BUYER_TIMING_VALUES = [
  "EXPLORING",
  "NEAR_TERM",
  "FLEXIBLE",
  "UNKNOWN",
] as const;
const AGENT_BUYER_MARKET_CONTEXTS = [
  "NONE",
  "CERTIFIED_POINT_IN_TIME",
  "STALE_OR_UNKNOWN",
] as const;

export type AgentBuyerDiscussionPriority =
  (typeof AGENT_BUYER_DISCUSSION_PRIORITIES)[number];
export type AgentBuyerFinancingStatus =
  (typeof AGENT_BUYER_FINANCING_STATUSES)[number];
export type AgentBuyerCertification =
  | "AGENT_PROCESS_EDUCATION"
  | "AGENT_DISCOVERY_QUESTION"
  | "CLIENT_REPORTED_CONTEXT"
  | "LENDER_VERIFICATION"
  | "NOT_AUTHORIZED_FOR_P0";

export const AGENT_BUYER_FINANCING_BOUNDARIES = Object.freeze({
  interestRates: "LENDER_VERIFICATION",
  loanProducts: "LENDER_VERIFICATION",
  qualification: "LENDER_VERIFICATION",
  underwriting: "LENDER_VERIFICATION",
  preapproval: "CLIENT_REPORTED_CONTEXT",
  monthlyPayment: "NOT_AUTHORIZED_FOR_P0",
  downPayment: "AGENT_DISCOVERY_QUESTION",
  closingCosts: "AGENT_DISCOVERY_QUESTION",
  affordability: "NOT_AUTHORIZED_FOR_P0",
  financingContingency: "AGENT_PROCESS_EDUCATION",
  lenderSelection: "NOT_AUTHORIZED_FOR_P0",
  credit: "LENDER_VERIFICATION",
  debtIncome: "LENDER_VERIFICATION",
  financialSuitability: "NOT_AUTHORIZED_FOR_P0",
} as const satisfies Record<string, AgentBuyerCertification>);

export type AgentBuyerPreparationRequest = Readonly<{
  actorIdentityType: "HUMAN_AGENT" | "OTHER";
  actorRole: "AGENT" | "OTHER";
  sessionMechanism: "HUMAN_AGENT_SESSION" | "OTHER";
  capability: string;
  route: string;
  stage: "DISCOVERY" | "READINESS";
  priorities: readonly AgentBuyerDiscussionPriority[];
  certifiedCity: (typeof AGENT_BUYER_CERTIFIED_CITIES)[number] | null;
  propertyObjective:
    | "SINGLE_FAMILY"
    | "CONDO_TOWNHOME"
    | "MULTI_FAMILY"
    | "LAND"
    | "UNSPECIFIED"
    | null;
  timing: "EXPLORING" | "NEAR_TERM" | "FLEXIBLE" | "UNKNOWN" | null;
  financingStatus: AgentBuyerFinancingStatus | null;
  marketContext: "NONE" | "CERTIFIED_POINT_IN_TIME" | "STALE_OR_UNKNOWN";
  supportedPropertyContext: boolean;
  customerContext: boolean;
  persistenceRequested: boolean;
  providerRuntimeRequired: boolean;
  adminContext: boolean;
  mcpContext: boolean;
  protectedClassRequest: boolean;
  schoolQualityRequest: boolean;
  safetyRequest: boolean;
  affordabilityConclusionRequested: boolean;
  loanRecommendationRequested: boolean;
  legalConclusionRequested: boolean;
  representationRequirementClaimRequested: boolean;
}>;

export type AgentBuyerPreparationPacket = Readonly<{
  admission: "ADMITTED" | "FAIL_CLOSED";
  readiness: "READY" | "READY_WITH_LIMITATIONS" | "FAIL_CLOSED";
  reasons: readonly string[];
  limitations: readonly string[];
  request: AgentBuyerPreparationRequest;
  protectedBoundaries: Readonly<{
    customerData: false;
    persistence: false;
    providerActivity: false;
    recommendation: false;
    suitability: false;
    fairHousingInference: false;
    externalAction: false;
  }>;
}>;
const BOUNDARIES = Object.freeze({
  customerData: false,
  persistence: false,
  providerActivity: false,
  recommendation: false,
  suitability: false,
  fairHousingInference: false,
  externalAction: false,
} as const);

function trace(
  evidenceKeys: readonly string[],
  rule: AgentBriefingTraceability["compositionRule"],
): AgentBriefingTraceability {
  return {
    sourceReferences: [
      "REIE_BUYER_FINANCING_READINESS",
      "REIE_DXT_3_PROFESSIONAL_PREPARATION",
    ],
    evidenceKeys,
    freshness: "DATED_DURABLE_CONTEXT",
    compositionRule: rule,
  };
}
function label(value: string) {
  return value.toLowerCase().replaceAll("_", " ");
}

export function buildAgentBuyerPreparationPacket(
  request: AgentBuyerPreparationRequest,
): AgentBuyerPreparationPacket {
  const reasons: string[] = [];
  if (request.actorIdentityType !== "HUMAN_AGENT")
    reasons.push("HUMAN_AGENT_IDENTITY_REQUIRED");
  if (request.actorRole !== "AGENT") reasons.push("AGENT_ROLE_REQUIRED");
  if (request.sessionMechanism !== "HUMAN_AGENT_SESSION")
    reasons.push("HUMAN_AGENT_SESSION_REQUIRED");
  if (
    request.capability !== AGENT_BUYER_PREPARATION_CAPABILITY ||
    request.route !== AGENT_BUYER_PREPARATION_ROUTE
  )
    reasons.push("EXACT_AGENT_BUYER_ROUTE_REQUIRED");
  if (!AGENT_BUYER_STAGES.includes(request.stage))
    reasons.push("GOVERNED_BUYER_STAGE_REQUIRED");
  if (
    request.priorities.length < 2 ||
    request.priorities.length > 4 ||
    new Set(request.priorities).size !== request.priorities.length ||
    request.priorities.some(
      (value) => !AGENT_BUYER_DISCUSSION_PRIORITIES.includes(value),
    )
  )
    reasons.push("GOVERNED_DISCUSSION_PRIORITIES_REQUIRED");
  if (
    request.certifiedCity &&
    !AGENT_BUYER_CERTIFIED_CITIES.includes(request.certifiedCity)
  )
    reasons.push("CERTIFIED_CITY_REQUIRED");
  if (
    request.propertyObjective &&
    !AGENT_BUYER_PROPERTY_OBJECTIVES.includes(request.propertyObjective)
  )
    reasons.push("GOVERNED_PROPERTY_OBJECTIVE_REQUIRED");
  if (request.timing && !AGENT_BUYER_TIMING_VALUES.includes(request.timing))
    reasons.push("GOVERNED_TIMING_REQUIRED");
  if (
    request.financingStatus &&
    !AGENT_BUYER_FINANCING_STATUSES.includes(request.financingStatus)
  )
    reasons.push("GOVERNED_FINANCING_STATUS_REQUIRED");
  if (!AGENT_BUYER_MARKET_CONTEXTS.includes(request.marketContext))
    reasons.push("GOVERNED_MARKET_CONTEXT_REQUIRED");
  if (
    [
      request.customerContext,
      request.persistenceRequested,
      request.providerRuntimeRequired,
      request.adminContext,
      request.mcpContext,
    ].some(Boolean)
  )
    reasons.push("PROTECTED_CONTEXT_PROHIBITED");
  if (
    [
      request.protectedClassRequest,
      request.schoolQualityRequest,
      request.safetyRequest,
    ].some(Boolean)
  )
    reasons.push("FAIR_HOUSING_REQUEST_PROHIBITED");
  if (
    [
      request.affordabilityConclusionRequested,
      request.loanRecommendationRequested,
      request.legalConclusionRequested,
      request.representationRequirementClaimRequested,
    ].some(Boolean)
  )
    reasons.push("PROFESSIONAL_CONCLUSION_PROHIBITED");
  const limitations: string[] = [];
  if (request.marketContext === "STALE_OR_UNKNOWN")
    limitations.push("STALE_MARKET_CONTEXT_OMITTED");
  if (!request.financingStatus)
    limitations.push("FINANCING_STATUS_NOT_DISCLOSED");
  if (!request.certifiedCity) limitations.push("PLACE_CONTEXT_NOT_SELECTED");
  return Object.freeze({
    admission: reasons.length ? "FAIL_CLOSED" : "ADMITTED",
    readiness: reasons.length
      ? "FAIL_CLOSED"
      : limitations.length
        ? "READY_WITH_LIMITATIONS"
        : "READY",
    reasons: Object.freeze(reasons.sort()),
    limitations: Object.freeze(limitations.sort()),
    request,
    protectedBoundaries: BOUNDARIES,
  });
}

export function composeAgentBuyerPreparationBriefing(
  packet: AgentBuyerPreparationPacket,
): AgentBriefingComposition | null {
  if (packet.admission !== "ADMITTED") return null;
  const { request } = packet;
  const priorities = request.priorities.map(label).join(", ");
  const context = request.financingStatus
    ? ` Financing status is recorded only as Agent-entered reported context: ${label(request.financingStatus)}.`
    : "";
  return composeAgentBriefing({
    surface: "BUYER",
    subject: "Buyer consultation preparation",
    executiveBriefing: {
      id: "buyer-executive",
      contentClass: "SUPPORTED_SYNTHESIS",
      text: `Prepare a ${label(request.stage)} buyer consultation around ${priorities}.${context} Use the briefing to clarify lawful priorities, process questions, and verification needs without making a financing, legal, representation, or suitability conclusion.`,
      traceability: trace(
        ["stage", "priorities", "financing-status"],
        "FACT_AND_CONTEXT_SYNTHESIS",
      ),
    },
    whatMatters: [
      {
        id: "buyer-objective",
        contentClass: "GOVERNED_EDITORIAL_CONTEXT",
        text: "The consultation should establish the buyer journey position, the facts still to clarify, and the next professional conversation steps.",
        traceability: trace(
          ["consultation-objective"],
          "GOVERNED_CONTEXT_RENDER",
        ),
      },
    ],
    whyItMatters: [
      {
        id: "buyer-why",
        contentClass: "LIMITATION",
        text: "The selected inputs are preparation context only; they are not a customer profile, underwriting evidence, or a recommendation.",
        traceability: trace(["ephemeral-input-boundary"], "LIMITATION_RENDER"),
      },
    ],
    keyEvidence: [
      {
        id: "buyer-stage",
        label: "Consultation stage",
        value: label(request.stage),
        contentClass: "DIRECT_FACT",
        text: label(request.stage),
        traceability: trace(["stage"], "DIRECT_RENDER"),
      },
      {
        id: "buyer-priorities",
        label: "Discussion priorities",
        value: priorities,
        contentClass: "DIRECT_FACT",
        text: priorities,
        traceability: trace(["priorities"], "DIRECT_RENDER"),
      },
    ],
    whatCouldChangeInterpretation: [
      ...packet.limitations.map((value) => ({
        id: `buyer-limitation-${value}`,
        contentClass: "LIMITATION" as const,
        text: label(value),
        traceability: trace([value], "LIMITATION_RENDER"),
      })),
      ...(request.marketContext === "CERTIFIED_POINT_IN_TIME"
        ? [
            {
              id: "buyer-market-currentness",
              contentClass: "VERIFICATION_TRIGGER" as const,
              text: "Use any Market Preparation context only with its visible date, freshness, and limitations.",
              traceability: trace(
                ["market-context"],
                "VERIFICATION_TRIGGER_RENDER",
              ),
            },
          ]
        : []),
    ],
    questionsWorthAsking: [
      {
        id: "buyer-timing",
        text: "What timing and decision-process details need clarification before search activity begins?",
        triggerEvidenceKeys: ["stage", "priorities"],
      },
      {
        id: "buyer-financing",
        text: "Which financing questions should be confirmed with a lender rather than inferred here?",
        triggerEvidenceKeys: ["financing-status"],
      },
      {
        id: "buyer-process",
        text: "Which buying-process, documentation, or professional questions should the Agent prepare to explain?",
        triggerEvidenceKeys: ["consultation-objective"],
      },
    ],
    reviewSurfaces: [
      { id: "buyer-guidance", label: "Buyer guidance", href: "/buy" },
      {
        id: "market-preparation",
        label: "Market Preparation",
        href: "/agent/prepare/market",
      },
      ...(request.certifiedCity
        ? [
            {
              id: "place-preparation",
              label: "Place Preparation",
              href: "/agent/prepare/place",
            },
          ]
        : []),
      ...(request.supportedPropertyContext
        ? [
            {
              id: "property-preparation",
              label: "Property Preparation",
              href: "/agent/prepare/property",
            },
          ]
        : []),
    ],
    sourcesFreshnessLimitations: [
      {
        id: "buyer-source",
        contentClass: "LIMITATION",
        text: "This briefing uses certified repository preparation contracts and explicit Agent inputs only; it does not establish Compass, Colorado, or legal document requirements.",
        traceability: trace(["governing-document-limit"], "LIMITATION_RENDER"),
      },
    ],
    professionalCheckpoints: [
      {
        id: "buyer-lender",
        role: "LENDER",
        question:
          "Confirm any rate, loan-product, qualification, underwriting, credit, debt-to-income, or preapproval question directly with a lender.",
        traceability: trace(
          ["financing-boundary"],
          "PROFESSIONAL_CHECKPOINT_RENDER",
        ),
      },
      {
        id: "buyer-compliance",
        role: "OTHER_GOVERNED_ROLE",
        question:
          "Confirm any brokerage, representation, buyer-agreement, compensation, or disclosure requirement under current governing and firm policy.",
        traceability: trace(
          ["representation-boundary"],
          "PROFESSIONAL_CHECKPOINT_RENDER",
        ),
      },
    ],
  });
}
