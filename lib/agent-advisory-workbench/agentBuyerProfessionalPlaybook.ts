import type {
  AgentBuyerPreparationPacket,
  AgentBuyerPreparationRequest,
} from "./agentBuyerPreparationAdmission";
import type {
  AgentBriefingComposition,
  AgentBriefingNextAction,
} from "./agentBriefingComposition";

export const AGENT_BUYER_PROFESSIONAL_PLAYBOOK_STATUS =
  "REIE_AGENT_BUYER_PREPARATION_PROFESSIONAL_DEPTH_MVV" as const;

export type AgentBuyerProfessionalPlaybookSection = Readonly<{
  id: string;
  title: string;
  level: "CORE" | "DETAIL";
  emphasis: "STANDARD" | "SELECTED_PRIORITY";
  summary: string;
  prompts: readonly string[];
  sourceReferences: readonly string[];
}>;

export type AgentBuyerProfessionalPlaybook = Readonly<{
  status: typeof AGENT_BUYER_PROFESSIONAL_PLAYBOOK_STATUS;
  sections: readonly AgentBuyerProfessionalPlaybookSection[];
  consultationAgenda: readonly string[];
  nextActionPlan: Readonly<{
    agentActions: readonly string[];
    buyerClarifications: readonly string[];
    professionalVerification: readonly string[];
    atlasContinuations: readonly AgentBriefingNextAction[];
  }>;
  protectedBoundaries: Readonly<{
    customerData: false;
    persistence: false;
    providerActivity: false;
    recommendation: false;
    suitability: false;
    fairHousingInference: false;
    affordabilityConclusion: false;
    qualificationConclusion: false;
  }>;
}>;

export type AgentBuyerPlaybookPlaceContext = Readonly<{
  name: string;
  summary: string;
  orientation: readonly string[];
  verificationQuestions: readonly string[];
}>;

function label(value: string) {
  return value.toLowerCase().replaceAll("_", " ");
}

function has(
  request: AgentBuyerPreparationRequest,
  priority: AgentBuyerPreparationRequest["priorities"][number],
) {
  return request.priorities.includes(priority);
}

function section(
  id: string,
  title: string,
  level: AgentBuyerProfessionalPlaybookSection["level"],
  emphasis: AgentBuyerProfessionalPlaybookSection["emphasis"],
  summary: string,
  prompts: readonly string[],
  sourceReferences: readonly string[],
): AgentBuyerProfessionalPlaybookSection {
  return Object.freeze({
    id,
    title,
    level,
    emphasis,
    summary,
    prompts: Object.freeze([...prompts]),
    sourceReferences: Object.freeze([...sourceReferences]),
  });
}

export function buildAgentBuyerProfessionalPlaybook(
  packet: AgentBuyerPreparationPacket,
  composition: AgentBriefingComposition,
  placeContext: AgentBuyerPlaybookPlaceContext | null,
): AgentBuyerProfessionalPlaybook {
  const { request } = packet;
  const selectedTiming = request.timing
    ? request.timing.toLowerCase().replaceAll("_", " ")
    : "not yet stated";
  const selectedProperty = request.propertyObjective
    ? label(request.propertyObjective)
    : "not yet stated";
  const selectedCity = request.certifiedCity ?? "not yet stated";
  const financingReported = request.financingStatus
    ? `${label(request.financingStatus)} (reported, not verified)`
    : "not yet discussed";
  const sections = [
    section(
      "buyer-position-readiness",
      "Buyer position & readiness",
      "CORE",
      "STANDARD",
      "Separate the explicit consultation context from the questions to clarify and the items that require professional verification before active search.",
      [
        `Known context: ${label(request.stage)} stage; timing ${selectedTiming}; City ${selectedCity}; property objective ${selectedProperty}.`,
        `Reported financing context: ${financingReported}.`,
        "Clarify which stated priorities are settled, flexible, or still unresolved before treating the preparation plan as complete.",
        "Keep lender, legal, representation, and property-specific conclusions in their appropriate verification lane.",
      ],
      ["REIE_AGENT_BUYER_CONSULTATION_PREPARATION"],
    ),
    section(
      "buyer-discovery-questions",
      "Questions to understand the buyer",
      "CORE",
      "STANDARD",
      "Use organized discovery questions to establish objectives, timing, criteria, trade-offs, decision process, and uncertainty without inferring motivations or suitability.",
      [
        "What should this purchase accomplish, and which outcomes are important to discuss without assuming a preferred location or property?",
        "Which timing milestones, decision partners, or process constraints should shape the preparation sequence?",
        "Which property needs are essential, flexible, or still unknown, and which trade-offs need discussion before inventory review?",
        "What search or touring experience has occurred already, and what would make the next review more useful?",
        "Which process, inspection, title, financing, insurance, or representation questions should be answered before the next stage?",
      ],
      ["REIE_DXT_3_PROFESSIONAL_PREPARATION"],
    ),
    section(
      "financial-readiness",
      "Financial readiness",
      "CORE",
      has(request, "FINANCING_READINESS") ? "SELECTED_PRIORITY" : "STANDARD",
      "Organize reported financing context, lender questions, and process education without making an affordability, qualification, lending, or underwriting conclusion.",
      [
        "Client-reported context: distinguish what was stated from what a lender must confirm.",
        "Ask whether a lender relationship, preapproval discussion, expected down payment, closing-cost questions, or payment assumptions need to be addressed.",
        "Use financing contingencies and appraisal as process topics; confirm rates, loan products, credit, debt-to-income, qualification, and underwriting directly with a lender.",
        "Do not calculate buying power, conclude affordability, select a lender, or treat reported financing as verified approval.",
      ],
      ["REIE_BUYER_FINANCING_READINESS", "REIE_MODULE_6_FINANCIAL_PREPARATION_V1"],
    ),
    section(
      "search-strategy",
      "Search strategy",
      "CORE",
      has(request, "SEARCH_STRATEGY") || has(request, "SEARCH_GEOGRAPHY") || has(request, "PROPERTY_NEEDS")
        ? "SELECTED_PRIORITY"
        : "STANDARD",
      "Turn explicit City and property discussion context into a practical search conversation without ranking areas or treating criteria as fixed before they are clarified.",
      [
        `Use ${selectedCity} and ${selectedProperty} only as the initial discussion frame; test the frame through explicit criteria rather than recommendation.`,
        "Separate must-haves, preferences, and trade-offs; then define initial breadth, review cadence, and criteria that may need refinement.",
        "Set a listing-review and touring workflow that records questions for discussion rather than treating first impressions as conclusions.",
        "Discuss whether a read-only saved-search setup would be useful after criteria are explicit; this playbook does not create, save, or modify a search.",
      ],
      ["REIE_BUYER_DECISION_WORKSPACE", "REIE_AGENT_BUYER_CONSULTATION_PREPARATION"],
    ),
    section(
      "place-geographic-context",
      "Place / geographic context",
      "CORE",
      has(request, "PLACE_CONTEXT") || Boolean(placeContext) ? "SELECTED_PRIORITY" : "STANDARD",
      placeContext
        ? `${placeContext.name} is admitted as neutral City orientation. It frames questions for the conversation and never a neighborhood or property suitability conclusion.`
        : "No certified City was selected, so retain geographic questions for the consultation rather than supplying unsupported place context.",
      placeContext
        ? [
            placeContext.summary,
            ...placeContext.orientation,
            ...placeContext.verificationQuestions.slice(0, 2),
            "Keep City orientation separate from specific property and neighborhood evaluation; address-specific facts remain verification work.",
          ]
        : [
            "Ask for explicit geography, access, and daily-use criteria without inferring preferred neighborhoods.",
            "Use a certified City briefing only after the City is selected and keep address-specific facts for direct verification.",
          ],
      ["REIE_AGENT_PLACE_CONVERSATION_PREPARATION_EXPERIENCE_MVV"],
    ),
    section(
      "current-market-context",
      "Current market context",
      "CORE",
      has(request, "MARKET_CONTEXT") ? "SELECTED_PRIORITY" : "STANDARD",
      request.marketContext === "CERTIFIED_POINT_IN_TIME"
        ? "A point-in-time Market Preparation context is admitted only as dated evidence; review its visible freshness, limitations, and verification needs before relying on it."
        : "No current market observation is admitted to this Buyer briefing. Prepare the questions and use Market Preparation before relying on current inventory, pace, price, or competition context.",
      [
        "Frame market context as a dated preparation input, not a prediction, urgency signal, negotiation instruction, or offer recommendation.",
        "Ask which current market questions would change search discipline, listing review, or timing preparation if certified evidence is available.",
        "Keep the pending IRES municipality work outside this briefing and do not infer current market facts from it.",
      ],
      ["DQG_AGENT_PREPARATION_CONTEXT_ADAPTER_MARKET_ONLY_MVV"],
    ),
    section(
      "property-evaluation-framework",
      "Property evaluation framework",
      "DETAIL",
      has(request, "PROPERTY_NEEDS") || Boolean(request.propertyObjective)
        ? "SELECTED_PRIORITY"
        : "STANDARD",
      "Prepare a repeatable property-review framework for later use without selecting, ranking, or concluding that any property is suitable.",
      [
        "Review visible listing facts, configuration, condition questions, location and access, and material disclosures separately.",
        "Prepare verification topics for HOA, taxes, insurance, inspection, title, municipal or county records, and property-specific costs.",
        "Treat condition, records, costs, financing implications, and disclosures as verification work rather than a property conclusion.",
      ],
      ["REIE_PROPERTY_PRODUCT_3_1", "REIE_PROPERTY_EVIDENCE_COMPLETENESS_VERIFICATION"],
    ),
    section(
      "buying-process-roadmap",
      "Buying process roadmap",
      "DETAIL",
      has(request, "BUYING_PROCESS") ? "SELECTED_PRIORITY" : "STANDARD",
      "Prepare the Agent to explain the process sequence and distinguish the current preparation stage from later property, contract, and closing work.",
      [
        "Consultation and discovery -> readiness and financing preparation -> search setup -> listing review and touring.",
        "Property evaluation -> offer preparation -> contract -> inspection and due diligence.",
        "Appraisal and financing -> title and closing preparation -> closing.",
        "Explain what happens next as a process roadmap, not as a promise about timing, approval, acceptance, or outcome.",
      ],
      ["REIE_DXT_WAVE_1C_BUYER_JOURNEY", "REIE_DXT_3_PROFESSIONAL_PREPARATION"],
    ),
    section(
      "offer-preparation-education",
      "Offer-preparation education",
      "DETAIL",
      has(request, "BUYING_PROCESS") ? "SELECTED_PRIORITY" : "STANDARD",
      "Use offer preparation as neutral education about verification and professional discussion, never as a specific offer, bid, contract, valuation, or negotiation recommendation.",
      [
        "Explain that price, terms, earnest money, financing, inspection, appraisal, closing timing, possession, and contingencies are discussion categories.",
        "Prepare the buyer to identify assumptions, questions, and documents that require review before deciding how to pursue a property.",
        "No offer price, escalation, acceptance prediction, contract language, or submission action is generated here.",
      ],
      ["OFFER_PREPARATION_READINESS_IMPLEMENTED"],
    ),
    section(
      "due-diligence-professional-checkpoints",
      "Due-diligence / professional checkpoints",
      "DETAIL",
      has(request, "PROFESSIONAL_DUE_DILIGENCE") ? "SELECTED_PRIORITY" : "STANDARD",
      "Organize the questions that belong with appropriate professionals and public authorities; do not recommend a provider or form a referral relationship.",
      [
        "Inspector or engineer: condition, systems, repairs, and inspection findings.",
        "Lender: financing terms, approval, appraisal, contingencies, documentation, and property-specific financing questions.",
        "Title, insurance, tax, attorney, and municipal or county professionals: title, coverage, tax, legal, records, jurisdiction, and compliance questions in their respective domains.",
        "Bring explicit questions and available facts; this preparation does not select providers or communicate with them.",
      ],
      ["REIE_PROFESSIONAL_HANDOFF_COHESION_IMPLEMENTED", "REIE_PROFESSIONAL_HANDOFF_TAXONOMY"],
    ),
    section(
      "representation-process-checkpoints",
      "Representation / process checkpoints",
      "DETAIL",
      "STANDARD",
      "Prepare a lawful process conversation about representation, brokerage documentation, compensation topics, disclosures, and next steps without claiming what is required in a particular circumstance.",
      [
        "Identify which representation or brokerage-process questions the buyer wants to discuss.",
        "Confirm current brokerage, representation, buyer-agreement, compensation, and disclosure requirements through governing and firm policy.",
        "Keep this section educational and process-oriented; it does not establish a relationship or make a legal conclusion.",
      ],
      ["REIE_DXT_3_PROFESSIONAL_PREPARATION", "REIE_PROFESSIONAL_HANDOFF_COHESION_IMPLEMENTED"],
    ),
    section(
      "what-could-change-plan",
      "What could change the plan",
      "DETAIL",
      "STANDARD",
      "Use supported changes in explicit context and verification findings to revisit the preparation plan rather than treating the first briefing as final.",
      composition.whatCouldChangeInterpretation.map((statement) => statement.text),
      ["REIE_AGENT_BUYER_PREPARATION_SYNTHESIS_RECONCILED"],
    ),
  ];

  return Object.freeze({
    status: AGENT_BUYER_PROFESSIONAL_PLAYBOOK_STATUS,
    sections: Object.freeze(sections),
    consultationAgenda: Object.freeze([
      "Open: set the consultation objective and confirm the buyer position.",
      "Understand objective: clarify timing, decision process, and unresolved priorities.",
      "Financing readiness: separate reported context from lender verification.",
      "Search, location, and property needs: establish criteria, trade-offs, and review rhythm.",
      "Buying process and property evaluation: explain the next stages and verification framework.",
      "Representation, professional questions, and next steps: identify what requires follow-up and who owns it.",
    ]),
    nextActionPlan: Object.freeze({
      agentActions: Object.freeze([
        "Use the agenda to organize the consultation and record only what is discussed through authorized systems outside this tool.",
        "Keep current Market, Place, and Property review in their separate authorized Agent capabilities.",
      ]),
      buyerClarifications: Object.freeze([
        "Confirm timing, explicit search criteria, property trade-offs, decision process, and unresolved process questions.",
        "Clarify which reported financing and professional questions require follow-up before active search.",
      ]),
      professionalVerification: Object.freeze([
        "Route financing, title, inspection, insurance, tax, legal, municipal, and property-specific questions to the appropriate qualified professional or authority.",
      ]),
      atlasContinuations: Object.freeze([...(composition.nextActions ?? [])]),
    }),
    protectedBoundaries: Object.freeze({
      customerData: false,
      persistence: false,
      providerActivity: false,
      recommendation: false,
      suitability: false,
      fairHousingInference: false,
      affordabilityConclusion: false,
      qualificationConclusion: false,
    }),
  });
}
