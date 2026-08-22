import {
  composeAgentBriefing,
  type AgentBriefingComposition,
  type AgentBriefingNextAction,
  type AgentBriefingStatement,
  type AgentBriefingTraceability,
} from "./agentBriefingComposition";

export const AGENT_LISTING_PREPARATION_CAPABILITY = "AGENT_LISTING_PREPARATION" as const;
export const AGENT_LISTING_PREPARATION_ROUTE = "/agent/prepare/listing" as const;

export const AGENT_LISTING_PREPARATION_PRIORITIES = [
  "PRE_LISTING_READINESS",
  "PROPERTY_FACTS_RECORDS",
  "CONDITION_REPAIRS_IMPROVEMENTS",
  "PRESENTATION_MEDIA_ACCESS",
  "DISCLOSURES_DOCUMENTS",
  "PRICING_MARKET_INPUTS",
  "MARKETING_LISTING_DATA_PREPARATION",
  "LAUNCH_CHECKPOINTS",
  "PROFESSIONAL_VERIFICATION",
] as const;
export const AGENT_LISTING_LAUNCH_HORIZONS = [
  { value: "WITHIN_30_DAYS", label: "Within 30 days", description: "Sequence open questions without treating a launch date as committed." },
  { value: "ONE_TO_THREE_MONTHS", label: "1-3 months", description: "Organize preparation and verification before a launch decision." },
  { value: "MORE_THAN_THREE_MONTHS", label: "More than 3 months", description: "Keep preparation planning separate from a settled launch plan." },
  { value: "HORIZON_NOT_SETTLED", label: "Horizon not settled", description: "Make timing clarification an explicit preparation outcome." },
] as const;
export const AGENT_LISTING_PREPARATION_POSITIONS = ["AFTER_SELLER_ENGAGEMENT", "MOVING_TOWARD_LAUNCH"] as const;

export type AgentListingPreparationPriority = (typeof AGENT_LISTING_PREPARATION_PRIORITIES)[number];
export type AgentListingLaunchHorizon = (typeof AGENT_LISTING_LAUNCH_HORIZONS)[number]["value"];
export type AgentListingPreparationRequest = Readonly<{
  actorIdentityType: "HUMAN_AGENT" | "OTHER";
  actorRole: "AGENT" | "OTHER";
  sessionMechanism: "HUMAN_AGENT_SESSION" | "OTHER";
  capability: string;
  route: string;
  position: (typeof AGENT_LISTING_PREPARATION_POSITIONS)[number];
  identifiedSellerPropertyConfirmed: boolean;
  priorities: readonly AgentListingPreparationPriority[];
  launchHorizon: AgentListingLaunchHorizon | null;
  customerContext: boolean;
  persistenceRequested: boolean;
  providerRuntimeRequired: boolean;
  adminContext: boolean;
  mcpContext: boolean;
  propertyIdentityProvided: boolean;
  mlsDataRequested: boolean;
  publicActivationRequested: boolean;
  pricingRecommendationRequested: boolean;
  marketingRecommendationRequested: boolean;
  legalConclusionRequested: boolean;
  taxAdviceRequested: boolean;
  protectedClassRequest: boolean;
  demographicInferenceRequested: boolean;
  suitabilityConclusionRequested: boolean;
}>;
export type AgentListingPreparationPacket = Readonly<{
  admission: "ADMITTED" | "FAIL_CLOSED";
  readiness: "READY_WITH_LIMITATIONS" | "FAIL_CLOSED";
  reasons: readonly string[];
  limitations: readonly string[];
  request: AgentListingPreparationRequest;
  protectedBoundaries: Readonly<{
    customerData: false;
    persistence: false;
    providerActivity: false;
    propertyIdentity: false;
    mlsActivity: false;
    publicActivation: false;
    recommendation: false;
    suitability: false;
    fairHousingInference: false;
    pricingConclusion: false;
    legalTaxConclusion: false;
  }>;
}>;

const boundaries = Object.freeze({ customerData: false, persistence: false, providerActivity: false, propertyIdentity: false, mlsActivity: false, publicActivation: false, recommendation: false, suitability: false, fairHousingInference: false, pricingConclusion: false, legalTaxConclusion: false } as const);
const priorityValues = new Set<string>(AGENT_LISTING_PREPARATION_PRIORITIES);
const horizonValues = new Set<string>(AGENT_LISTING_LAUNCH_HORIZONS.map((option) => option.value));

function label(value: string) {
  return value.toLowerCase().replaceAll("_", " ");
}

function trace(evidenceKeys: readonly string[], compositionRule: AgentBriefingTraceability["compositionRule"]): AgentBriefingTraceability {
  return { sourceReferences: ["REIE_AGENT_LISTING_PREPARATION_READINESS_AND_ADMISSION_MVV", "REIE_DXT_3_SELLER_PROFESSIONAL_PREPARATION"], evidenceKeys, freshness: "DATED_DURABLE_CONTEXT", compositionRule };
}

function statement(id: string, contentClass: AgentBriefingStatement["contentClass"], text: string, evidenceKeys: readonly string[], rule: AgentBriefingTraceability["compositionRule"]): AgentBriefingStatement {
  return { id, contentClass, text, traceability: trace(evidenceKeys, rule) };
}

export function buildAgentListingPreparationPacket(request: AgentListingPreparationRequest): AgentListingPreparationPacket {
  const reasons: string[] = [];
  if (request.actorIdentityType !== "HUMAN_AGENT" || request.actorRole !== "AGENT" || request.sessionMechanism !== "HUMAN_AGENT_SESSION") reasons.push("AGENT_IDENTITY_REQUIRED");
  if (request.capability !== AGENT_LISTING_PREPARATION_CAPABILITY || request.route !== AGENT_LISTING_PREPARATION_ROUTE) reasons.push("EXACT_LISTING_CAPABILITY_REQUIRED");
  if (!AGENT_LISTING_PREPARATION_POSITIONS.includes(request.position)) reasons.push("GOVERNED_LISTING_POSITION_REQUIRED");
  if (!request.identifiedSellerPropertyConfirmed) reasons.push("AGENT_PROPERTY_CONFIRMATION_REQUIRED");
  if (request.priorities.length < 2 || request.priorities.some((value) => !priorityValues.has(value)) || new Set(request.priorities).size !== request.priorities.length) reasons.push("GOVERNED_LISTING_TOPICS_REQUIRED");
  if (request.launchHorizon && !horizonValues.has(request.launchHorizon)) reasons.push("GOVERNED_LISTING_HORIZON_REQUIRED");
  if (request.customerContext || request.persistenceRequested || request.providerRuntimeRequired || request.adminContext || request.mcpContext || request.propertyIdentityProvided || request.mlsDataRequested || request.publicActivationRequested) reasons.push("PROTECTED_CONTEXT_PROHIBITED");
  if (request.protectedClassRequest || request.demographicInferenceRequested || request.suitabilityConclusionRequested) reasons.push("FAIR_HOUSING_OR_SUITABILITY_PROHIBITED");
  if (request.pricingRecommendationRequested || request.marketingRecommendationRequested || request.legalConclusionRequested || request.taxAdviceRequested) reasons.push("PROFESSIONAL_CONCLUSION_PROHIBITED");
  const limitations = [
    "NO_PROPERTY_IDENTITY_OR_CUSTOMER_RECORD",
    "NO_STORED_OR_LIVE_LISTING_FACTS",
    "MEDIA_RIGHTS_AND_ATTRIBUTION_UNVERIFIED",
    "PRICING_MARKETING_LAUNCH_DECISIONS_REQUIRE_HUMAN_REVIEW",
    "TITLE_LIEN_TAX_INSURANCE_HOA_MUNICIPAL_AND_INSPECTION_REQUIRE_QUALIFIED_VERIFICATION",
    ...(request.launchHorizon ? [] : ["LAUNCH_HORIZON_NOT_DISCLOSED"]),
  ];
  return Object.freeze({ admission: reasons.length ? "FAIL_CLOSED" : "ADMITTED", readiness: reasons.length ? "FAIL_CLOSED" : "READY_WITH_LIMITATIONS", reasons: Object.freeze(reasons), limitations: Object.freeze(limitations), request, protectedBoundaries: boundaries });
}

export function composeAgentListingPreparationBriefing(packet: AgentListingPreparationPacket): AgentBriefingComposition | null {
  if (packet.admission !== "ADMITTED") return null;
  const { request } = packet;
  const horizon = AGENT_LISTING_LAUNCH_HORIZONS.find((option) => option.value === request.launchHorizon) ?? null;
  const topics = request.priorities.map(label).join(", ");
  const positionText = request.position === "MOVING_TOWARD_LAUNCH"
    ? "This is a pre-launch preparation session. Organize the open evidence, review, and decision checkpoints without treating launch as authorized or settled."
    : "This is post-engagement listing preparation. Clarify the work required before an operational listing or launch plan is treated as settled.";
  const horizonText = horizon ? `The stated ${horizon.label.toLowerCase()} horizon guides sequencing only; it is not a launch commitment.` : "No launch horizon is stated, so timing clarification remains a preparation task.";
  const nextActions: AgentBriefingNextAction[] = [
    { id: "listing-seller", category: "Future ATLAS action", text: "Return to Seller Preparation for consultation goals, representation, and seller decision questions.", href: "/agent/prepare/seller" },
    { id: "listing-place", category: "Future ATLAS action", text: "Open Location Preparation for separately governed neutral place context when it is appropriate.", href: "/agent/prepare/place" },
    { id: "listing-property", category: "Future ATLAS action", text: "Use Property Preparation only when an independently admitted existing public property record is appropriate.", href: "/agent/prepare/property" },
    { id: "listing-market", category: "Future ATLAS action", text: "Open Market Preparation when dated market context is needed for agent review.", href: "/agent/prepare/market" },
  ];
  return composeAgentBriefing({
    surface: "LISTING",
    subject: "Listing preparation",
    executiveBriefing: statement("listing-executive", "SUPPORTED_SYNTHESIS", `${positionText} ${horizonText} Selected Priority Focus topics: ${topics}. This session stores no seller or property identity and produces no listing, MLS, marketing, pricing, or launch conclusion.`, ["position", "horizon", "priorities"], "FACT_AND_CONTEXT_SYNTHESIS"),
    whatMatters: [
      statement("listing-position", "GOVERNED_EDITORIAL_CONTEXT", positionText, ["position"], "GOVERNED_CONTEXT_RENDER"),
      statement("listing-topics", "DIRECT_FACT", `The preparation is explicitly focused on ${topics}.`, ["priorities"], "DIRECT_RENDER"),
    ],
    whyItMatters: [statement("listing-boundary", "LIMITATION", "Priority selections organize Agent attention. They do not establish property facts, disclosure sufficiency, condition, value, marketability, rights, a launch date, or a recommendation.", ["session-only-boundary"], "LIMITATION_RENDER")],
    keyEvidence: [
      { ...statement("listing-position-evidence", "DIRECT_FACT", label(request.position), ["position"], "DIRECT_RENDER"), label: "Preparation position", value: request.position === "MOVING_TOWARD_LAUNCH" ? "Moving toward a possible launch" : "After Seller engagement" },
      { ...statement("listing-property-confirmation", "DIRECT_FACT", "Agent-confirmed", ["property-confirmation"], "DIRECT_RENDER"), label: "Seller property", value: "Agent-confirmed; not identified or retained" },
      { ...statement("listing-topics-evidence", "DIRECT_FACT", topics, ["priorities"], "DIRECT_RENDER"), label: "Selected listing topics", value: topics },
      ...(horizon ? [{ ...statement("listing-horizon-evidence", "DIRECT_FACT", horizon.label, ["horizon"], "DIRECT_RENDER"), label: "Preparation horizon", value: horizon.label }] : []),
    ],
    whatCouldChangeInterpretation: [
      ...packet.limitations.map((value) => statement(`listing-limitation-${value}`, "LIMITATION", label(value), [value], "LIMITATION_RENDER")),
      statement("listing-verification", "VERIFICATION_TRIGGER", "A conflict, stale source, unknown rights, incomplete document, ambiguous identity, unsupported jurisdiction, or editorial-only material must remain unresolved until the appropriate current source or qualified professional verifies it.", ["verification"], "VERIFICATION_TRIGGER_RENDER"),
    ],
    questionsWorthAsking: request.priorities.slice(0, 5).map((priority) => ({ id: `listing-question-${priority}`, text: listingPriorityQuestion(priority), triggerEvidenceKeys: ["priorities"] })),
    nextActions,
    reviewSurfaces: [{ id: "listing-seller-guidance", label: "Seller guidance", href: "/sell" }],
    sourcesFreshnessLimitations: [statement("listing-source-limit", "LIMITATION", "This briefing is derived solely from explicit, ephemeral Agent selections and governed internal preparation guidance. It has no property, MLS, media, market, title, tax, insurance, HOA, municipal, inspection, or customer-data source input. Any such material requires identity, rights, freshness, evidence, attribution, conflict, and professional-review checks before reliance.", ["source-posture"], "LIMITATION_RENDER")],
    professionalCheckpoints: [
      { id: "listing-title", role: "TITLE_OR_LIENHOLDER", question: "Confirm ownership, title, lien, payoff, and closing questions with the appropriate title professional or lienholder.", traceability: trace(["title-lien-payoff"], "PROFESSIONAL_CHECKPOINT_RENDER") },
      { id: "listing-property", role: "QUALIFIED_PROPERTY_PROFESSIONAL", question: "Confirm condition, repairs, improvements, inspection, engineering, permits, municipal, HOA, and insurance questions with the relevant current source or qualified professional.", traceability: trace(["property-verification"], "PROFESSIONAL_CHECKPOINT_RENDER") },
      { id: "listing-legal", role: "TAX_OR_LEGAL_PROFESSIONAL", question: "Confirm disclosure, representation, tax, legal, estate, trust, and transaction-specific questions with the appropriate current governing material or qualified professional.", traceability: trace(["legal-tax-disclosure"], "PROFESSIONAL_CHECKPOINT_RENDER") },
    ],
  });
}

function listingPriorityQuestion(priority: AgentListingPreparationPriority) {
  const questions: Record<AgentListingPreparationPriority, string> = {
    PRE_LISTING_READINESS: "What must be clarified before the work can move from preparation into an agent-reviewed listing plan?",
    PROPERTY_FACTS_RECORDS: "Which property facts, records, permits, HOA, or municipal questions need current-source confirmation before reliance?",
    CONDITION_REPAIRS_IMPROVEMENTS: "Which reported condition, maintenance, repair, or improvement questions need qualified review rather than a priority or return conclusion?",
    PRESENTATION_MEDIA_ACCESS: "What presentation, access, occupancy, photography, media-rights, and attribution questions must be resolved before any use?",
    DISCLOSURES_DOCUMENTS: "Which representation, disclosure, document, and acknowledgement requirements need current governing-document or qualified review?",
    PRICING_MARKET_INPUTS: "Which dated property and market inputs would an agent need to review before a pricing discussion, without producing a pricing conclusion here?",
    MARKETING_LISTING_DATA_PREPARATION: "Which factual listing-data, marketing, brand, Fair Housing, and approval questions must be verified before any marketing or MLS action?",
    LAUNCH_CHECKPOINTS: "Which timing, access, document, evidence, professional-review, and approval checkpoints could change whether a launch is appropriate?",
    PROFESSIONAL_VERIFICATION: "Which title, lien, tax, legal, inspection, insurance, municipal, HOA, or other qualified-professional checks remain open?",
  };
  return questions[priority];
}
