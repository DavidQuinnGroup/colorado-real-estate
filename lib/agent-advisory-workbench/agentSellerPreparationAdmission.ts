import {
  composeAgentBriefing,
  type AgentBriefingComposition,
  type AgentBriefingNextAction,
  type AgentBriefingStatement,
  type AgentBriefingTraceability,
} from "./agentBriefingComposition";

export const AGENT_SELLER_PREPARATION_CAPABILITY = "AGENT_SELLER_CONSULTATION_PREPARATION" as const;
export const AGENT_SELLER_PREPARATION_ROUTE = "/agent/prepare/seller" as const;

export const AGENT_SELLER_DISCUSSION_PRIORITIES = [
  "SELLING_PROCESS", "TIMING", "PROPERTY_CONDITION_PREPARATION", "PRICING_DISCUSSION",
  "CURRENT_MARKET_QUESTIONS", "PROPERTY_FACTS_RECORDS", "SHOWING_LAUNCH_PREPARATION",
  "SELLER_PROCEEDS_FINANCIAL_QUESTIONS", "OFFER_REVIEW_PROCESS", "DECISION_PROCESS",
  "REPRESENTATION_BROKERAGE_PROCESS", "PROFESSIONAL_QUESTIONS",
] as const;
export const AGENT_SELLER_TIMING_OPTIONS = [
  { value: "JUST_EXPLORING", label: "Just exploring", description: "An early conversation without an assumed launch date." },
  { value: "WITHIN_3_MONTHS", label: "Within 3 months", description: "Organize near-term readiness questions and preparation steps." },
  { value: "THREE_TO_SIX_MONTHS", label: "3-6 months", description: "Sequence records, condition questions, and market preparation." },
  { value: "SIX_TO_TWELVE_MONTHS", label: "6-12 months", description: "Keep a longer preparation horizon open to explicit updates." },
  { value: "MORE_THAN_TWELVE_MONTHS", label: "More than 12 months", description: "Use early planning and education before treating timing as settled." },
  { value: "TIMING_NOT_DECIDED", label: "Timing not decided yet", description: "Make timing clarification a direct consultation objective." },
] as const;
export const AGENT_SELLER_CONSULTATION_POSITIONS = ["STARTING_CONVERSATION", "MOVING_TOWARD_MARKET"] as const;
export type AgentSellerDiscussionPriority = (typeof AGENT_SELLER_DISCUSSION_PRIORITIES)[number];
export type AgentSellerTiming = (typeof AGENT_SELLER_TIMING_OPTIONS)[number]["value"];
export type AgentSellerPreparationRequest = Readonly<{
  actorIdentityType: "HUMAN_AGENT" | "OTHER"; actorRole: "AGENT" | "OTHER"; sessionMechanism: "HUMAN_AGENT_SESSION" | "OTHER";
  capability: string; route: string; position: (typeof AGENT_SELLER_CONSULTATION_POSITIONS)[number];
  priorities: readonly AgentSellerDiscussionPriority[]; timing: AgentSellerTiming | null;
  cityContext: "Boulder" | "Louisville" | "Lafayette" | null;
  propertyReadiness: "NOT_DISCUSSED" | "OWNER_OCCUPIED_REPORTED" | "VACANT_REPORTED" | "PREPARATION_NEEDS_DISCUSSION" | null;
  proceedsDiscussion: "NOT_DISCUSSED" | "PAYOFF_OR_LIEN_QUESTION" | "SELLING_COST_QUESTION" | "TAX_QUESTION" | "OTHER_REPORTED" | null;
  customerContext: boolean; persistenceRequested: boolean; providerRuntimeRequired: boolean; adminContext: boolean; mcpContext: boolean;
  protectedClassRequest: boolean; demographicInferenceRequested: boolean; suitabilityConclusionRequested: boolean;
  pricingRecommendationRequested: boolean; legalConclusionRequested: boolean; taxAdviceRequested: boolean;
}>;
export type AgentSellerPreparationPacket = Readonly<{
  admission: "ADMITTED" | "FAIL_CLOSED"; readiness: "READY" | "READY_WITH_LIMITATIONS" | "FAIL_CLOSED";
  reasons: readonly string[]; limitations: readonly string[]; request: AgentSellerPreparationRequest;
  protectedBoundaries: Readonly<{ customerData: false; persistence: false; providerActivity: false; recommendation: false; suitability: false; fairHousingInference: false; pricingConclusion: false; legalTaxConclusion: false; }>;
}>;
const boundaries = Object.freeze({ customerData: false, persistence: false, providerActivity: false, recommendation: false, suitability: false, fairHousingInference: false, pricingConclusion: false, legalTaxConclusion: false } as const);
const timingValues = new Set<string>(AGENT_SELLER_TIMING_OPTIONS.map((option) => option.value));
const priorityValues = new Set<string>(AGENT_SELLER_DISCUSSION_PRIORITIES);
function label(value: string) { return value.toLowerCase().replaceAll("_", " "); }
function trace(evidenceKeys: readonly string[], compositionRule: AgentBriefingTraceability["compositionRule"]): AgentBriefingTraceability {
  return { sourceReferences: ["REIE_DXT_3_SELLER_PROFESSIONAL_PREPARATION", "REIE_SELLER_READINESS_ADVANCEMENT"], evidenceKeys, freshness: "DATED_DURABLE_CONTEXT", compositionRule };
}
function statement(id: string, contentClass: AgentBriefingStatement["contentClass"], text: string, evidenceKeys: readonly string[], rule: AgentBriefingTraceability["compositionRule"]): AgentBriefingStatement { return { id, contentClass, text, traceability: trace(evidenceKeys, rule) }; }
function timingOption(timing: AgentSellerTiming | null) { return AGENT_SELLER_TIMING_OPTIONS.find((option) => option.value === timing) ?? null; }

export function buildAgentSellerPreparationPacket(request: AgentSellerPreparationRequest): AgentSellerPreparationPacket {
  const reasons: string[] = [];
  if (request.actorIdentityType !== "HUMAN_AGENT" || request.actorRole !== "AGENT" || request.sessionMechanism !== "HUMAN_AGENT_SESSION") reasons.push("AGENT_IDENTITY_REQUIRED");
  if (request.capability !== AGENT_SELLER_PREPARATION_CAPABILITY || request.route !== AGENT_SELLER_PREPARATION_ROUTE) reasons.push("EXACT_SELLER_CAPABILITY_REQUIRED");
  if (!AGENT_SELLER_CONSULTATION_POSITIONS.includes(request.position)) reasons.push("GOVERNED_SELLER_POSITION_REQUIRED");
  if (request.priorities.length < 2 || request.priorities.some((value) => !priorityValues.has(value)) || new Set(request.priorities).size !== request.priorities.length) reasons.push("GOVERNED_SELLER_TOPICS_REQUIRED");
  if (request.timing && !timingValues.has(request.timing)) reasons.push("GOVERNED_SELLER_TIMING_REQUIRED");
  if (request.customerContext || request.persistenceRequested || request.providerRuntimeRequired || request.adminContext || request.mcpContext) reasons.push("PROTECTED_CONTEXT_PROHIBITED");
  if (request.protectedClassRequest || request.demographicInferenceRequested || request.suitabilityConclusionRequested) reasons.push("FAIR_HOUSING_OR_SUITABILITY_PROHIBITED");
  if (request.pricingRecommendationRequested || request.legalConclusionRequested || request.taxAdviceRequested) reasons.push("PROFESSIONAL_CONCLUSION_PROHIBITED");
  const limitations = [
    ...(request.timing ? [] : ["TIMING_NOT_DISCLOSED"]),
    ...(request.cityContext ? [] : ["PLACE_CONTEXT_NOT_SELECTED"]),
    ...(request.propertyReadiness ? [] : ["PROPERTY_READINESS_NOT_DISCLOSED"]),
  ];
  return Object.freeze({ admission: reasons.length ? "FAIL_CLOSED" : "ADMITTED", readiness: reasons.length ? "FAIL_CLOSED" : limitations.length ? "READY_WITH_LIMITATIONS" : "READY", reasons: Object.freeze(reasons), limitations: Object.freeze(limitations), request, protectedBoundaries: boundaries });
}

export function composeAgentSellerPreparationBriefing(packet: AgentSellerPreparationPacket): AgentBriefingComposition | null {
  if (packet.admission !== "ADMITTED") return null;
  const { request } = packet; const timing = timingOption(request.timing); const topics = request.priorities.map(label).join(", ");
  const positionText = request.position === "MOVING_TOWARD_MARKET" ? "This is a market-readiness conversation: sequence the facts, preparation questions, and professional checkpoints before a listing plan is treated as settled." : "This is an early seller conversation: clarify goals, property situation, timing, and process before assuming a sale plan.";
  const timingText = timing ? `The stated ${timing.label.toLowerCase()} horizon should guide the depth and sequence of preparation without becoming a launch commitment.` : "Timing has not been stated, so timing clarification is a primary consultation task.";
  const nextActions: AgentBriefingNextAction[] = [
    { id: "seller-action-timing", category: "Agent action", text: timing ? `Use the ${timing.label.toLowerCase()} horizon to sequence the next preparation questions.` : "Clarify the Seller's timing horizon and the milestones that could change it." },
    { id: "seller-action-property", category: "Future ATLAS action", text: "Prepare property facts and records for review before relying on them.", href: "/agent/prepare/property" },
    { id: "seller-action-market", category: "Future ATLAS action", text: "Open Market Preparation for dated market context when it is needed.", href: "/agent/prepare/market" },
    ...(request.cityContext ? [{ id: "seller-action-place", category: "Future ATLAS action" as const, text: `Open Location Preparation for neutral ${request.cityContext} context.`, href: "/agent/prepare/place" as const }] : []),
  ];
  return composeAgentBriefing({
    surface: "SELLER", subject: "Seller consultation preparation",
    executiveBriefing: statement("seller-executive", "SUPPORTED_SYNTHESIS", `${positionText} ${timingText} Selected priorities: ${topics}. Use only the reported context; property, title, pricing, financial, and process conclusions remain subject to appropriate review.`, ["position", "timing", "priorities"], "FACT_AND_CONTEXT_SYNTHESIS"),
    whatMatters: [statement("seller-position", "GOVERNED_EDITORIAL_CONTEXT", positionText, ["position"], "GOVERNED_CONTEXT_RENDER"), statement("seller-priorities", "DIRECT_FACT", `The consultation is explicitly focused on ${topics}.`, ["priorities"], "DIRECT_RENDER")],
    whyItMatters: [statement("seller-boundary", "LIMITATION", "These selections are session-only preparation context. They do not establish property condition, marketability, pricing, title status, proceeds, or a recommendation to sell.", ["session-only-boundary"], "LIMITATION_RENDER")],
    keyEvidence: [
      { ...statement("seller-position-evidence", "DIRECT_FACT", label(request.position), ["position"], "DIRECT_RENDER"), label: "Consultation position", value: request.position === "MOVING_TOWARD_MARKET" ? "Preparing to move toward market" : "Starting the seller conversation" },
      { ...statement("seller-topics-evidence", "DIRECT_FACT", topics, ["priorities"], "DIRECT_RENDER"), label: "Selected Seller topics", value: topics },
      ...(timing ? [{ ...statement("seller-timing-evidence", "DIRECT_FACT", timing.label, ["timing"], "DIRECT_RENDER"), label: "Timing", value: timing.label }] : []),
      ...(request.cityContext ? [{ ...statement("seller-city-evidence", "DIRECT_FACT", request.cityContext, ["city"], "DIRECT_RENDER"), label: "City context", value: request.cityContext }] : []),
      ...(request.propertyReadiness ? [{ ...statement("seller-property-readiness-evidence", "DIRECT_FACT", label(request.propertyReadiness), ["property-readiness"], "DIRECT_RENDER"), label: "Property context", value: label(request.propertyReadiness) }] : []),
    ],
    whatCouldChangeInterpretation: [
      ...packet.limitations.map((value) => statement(`seller-limitation-${value}`, "LIMITATION", label(value), [value], "LIMITATION_RENDER")),
      statement("seller-change-timing", "VERIFICATION_TRIGGER", "Revisit the preparation sequence if the stated timing, property situation, or Seller objective changes.", ["timing", "property-readiness"], "VERIFICATION_TRIGGER_RENDER"),
      statement("seller-change-records", "VERIFICATION_TRIGGER", "Treat conflicting, incomplete, or unverified property, title, permit, insurance, HOA, payoff, or tax information as a question for qualified review rather than a settled fact.", ["records"], "VERIFICATION_TRIGGER_RENDER"),
    ],
    questionsWorthAsking: request.priorities.slice(0, 5).map((priority) => ({ id: `seller-question-${priority}`, text: sellerPriorityQuestion(priority), triggerEvidenceKeys: ["priorities"] })),
    nextActions, reviewSurfaces: [{ id: "seller-guidance", label: "Seller guidance", href: "/sell" }],
    sourcesFreshnessLimitations: [statement("seller-source-limit", "LIMITATION", "This briefing uses explicit Agent selections and certified repository preparation guidance only. Dated market evidence, property records, representation requirements, and professional determinations require their own current verification.", ["source-freshness-limit"], "LIMITATION_RENDER")],
    professionalCheckpoints: [
      { id: "seller-title", role: "TITLE_OR_LIENHOLDER", question: "Confirm ownership, title, payoff, lien, and closing questions with the appropriate title professional or lienholder.", traceability: trace(["title-payoff"], "PROFESSIONAL_CHECKPOINT_RENDER") },
      { id: "seller-tax", role: "TAX_OR_LEGAL_PROFESSIONAL", question: "Confirm tax, legal, estate, trust, and transaction-specific legal questions with the appropriate qualified professional.", traceability: trace(["tax-legal"], "PROFESSIONAL_CHECKPOINT_RENDER") },
      { id: "seller-property", role: "QUALIFIED_PROPERTY_PROFESSIONAL", question: "Confirm condition, inspection, engineering, insurance, permit, municipal, and HOA questions with the relevant qualified source or professional.", traceability: trace(["property-verification"], "PROFESSIONAL_CHECKPOINT_RENDER") },
    ],
  });
}

function sellerPriorityQuestion(priority: AgentSellerDiscussionPriority) {
  const questions: Record<AgentSellerDiscussionPriority, string> = {
    SELLING_PROCESS: "Which parts of the selling process would be most useful to explain or clarify before deciding the next step?", TIMING: "What needs to happen before the Seller would feel ready to move toward market?", PROPERTY_CONDITION_PREPARATION: "Which known condition, repair, maintenance, presentation, or improvement questions should be organized first?", PRICING_DISCUSSION: "Which property facts and current market evidence are needed before a pricing discussion can be useful?", CURRENT_MARKET_QUESTIONS: "Which dated market questions should be separated from assumptions or forecasts?", PROPERTY_FACTS_RECORDS: "Which property, permit, HOA, ownership, or record questions need confirmation before being relied upon?", SHOWING_LAUNCH_PREPARATION: "What access, occupancy, presentation, and launch-readiness questions should be clarified?", SELLER_PROCEEDS_FINANCIAL_QUESTIONS: "Which payoff, cost-category, tax, or proceeds questions belong with a lender, title, tax, or other qualified professional?", OFFER_REVIEW_PROCESS: "Which future offer-review dimensions should the Seller understand before an offer is in hand?", DECISION_PROCESS: "Who needs to participate in the decision and which facts could change the plan?", REPRESENTATION_BROKERAGE_PROCESS: "Which representation, documentation, disclosure, or process questions need current governing-document review?", PROFESSIONAL_QUESTIONS: "Which questions require title, lender, inspection, insurance, tax, legal, municipal, HOA, or other professional verification?",
  }; return questions[priority];
}
