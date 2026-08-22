import type {
  AgentBuyerPreparationPacket,
  AgentBuyerPreparationRequest,
} from "./agentBuyerPreparationAdmission";
import type {
  AgentBriefingComposition,
  AgentBriefingNextAction,
} from "./agentBriefingComposition";

export const AGENT_BUYER_PROFESSIONAL_PLAYBOOK_STATUS =
  "REIE_AGENT_BUYER_PREPARATION_AGENT_READY_CONTENT_MVV" as const;

export type AgentBuyerAgentReadyGuide = Readonly<{
  keyQuestions: readonly string[];
  talkingPoints: readonly string[];
  factsToConfirm: readonly string[];
  professionalCheckpoints: readonly string[];
  expectedOutcome: string;
}>;

export type AgentBuyerConsultationAgendaStep = Readonly<{
  id: string;
  title: string;
  summary: string;
  guide: AgentBuyerAgentReadyGuide;
}>;

export type AgentBuyerProfessionalPlaybookSection = Readonly<{
  id: string;
  title: string;
  level: "CORE" | "DETAIL";
  emphasis: "STANDARD" | "SELECTED_PRIORITY";
  summary: string;
  prompts: readonly string[];
  sourceReferences: readonly string[];
  guide?: AgentBuyerAgentReadyGuide;
}>;

export type AgentBuyerProfessionalPlaybook = Readonly<{
  status: typeof AGENT_BUYER_PROFESSIONAL_PLAYBOOK_STATUS;
  sections: readonly AgentBuyerProfessionalPlaybookSection[];
  consultationAgenda: readonly AgentBuyerConsultationAgendaStep[];
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
  guide?: AgentBuyerAgentReadyGuide,
): AgentBuyerProfessionalPlaybookSection {
  return Object.freeze({
    id,
    title,
    level,
    emphasis,
    summary,
    prompts: Object.freeze([...prompts]),
    sourceReferences: Object.freeze([...sourceReferences]),
    ...(guide ? { guide } : {}),
  });
}

function guide(
  keyQuestions: readonly string[],
  talkingPoints: readonly string[],
  factsToConfirm: readonly string[],
  professionalCheckpoints: readonly string[],
  expectedOutcome: string,
): AgentBuyerAgentReadyGuide {
  return Object.freeze({
    keyQuestions: Object.freeze([...keyQuestions]),
    talkingPoints: Object.freeze([...talkingPoints]),
    factsToConfirm: Object.freeze([...factsToConfirm]),
    professionalCheckpoints: Object.freeze([...professionalCheckpoints]),
    expectedOutcome,
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
      guide(
        [
          "What are you hoping this purchase allows you to do?",
          "What would make this purchase successful for you, and what would make you decide to wait?",
          "Which parts of the decision are already clear, and which parts are still being worked through?",
          "Who needs to participate in the decision, and what information will they need before the next step?",
          "What has been useful or frustrating in any search or touring done so far?",
        ],
        [
          "Use the buyer's own stated objective as the starting point; do not infer motivation, household composition, or preferred neighborhood.",
          "Treat uncertainty as useful consultation material, not as a signal to create urgency or narrow options prematurely.",
        ],
        [
          "Explicit objective, timing constraints, decision participants, prior search experience, and unresolved questions.",
        ],
        [
          "Bring financing, property-specific, legal, title, insurance, inspection, or representation questions to the appropriate later discussion or professional checkpoint.",
        ],
        "A shared understanding of the buyer's stated objective, decision process, and the questions that should shape the preparation plan.",
      ),
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
      guide(
        [
          "Have you spoken with a lender, and is there a current preapproval discussion to verify?",
          "What purchase range, down-payment approach, closing-cost expectations, or monthly-payment considerations have you discussed with the lender?",
          "Are there financing milestones, documents, program questions, or timing items that could affect the intended search window?",
          "Which financing facts still require direct lender confirmation before they guide the search?",
        ],
        [
          "Classify financing information as client-reported context, an Agent process question, or lender verification.",
          "Explain financing contingency and appraisal as process checkpoints rather than an approval or property conclusion.",
        ],
        [
          "Whether a lender has been consulted, preapproval status as reported, stated financing milestones, and questions to model with the lender.",
        ],
        [
          "Lender verifies rates, loan products, credit, debt-to-income, qualification, underwriting, approval, and property-specific financing implications.",
        ],
        "A lender-question list and a clear boundary between reported context and information that must be verified before it affects the plan.",
      ),
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
      guide(
        [
          "How broad should the first Louisville search be, and which explicit criteria should eliminate a property immediately?",
          "Which single-family needs are must-haves, which are preferences, and which should remain flexible initially?",
          "How would you like new listings reviewed, and how quickly would you want to see a strong candidate?",
          "What would make us expand or narrow the search after the first several listings or showings?",
          "What should we learn from the first several showings before changing criteria?",
        ],
        [
          "Start broad enough to test explicit criteria, then refine based on stated facts and observed property differences.",
          "A saved search is a later, customer-controlled workflow; this preparation only identifies whether its criteria are ready to discuss.",
        ],
        [
          "Initial geography, property type, must-haves, preferences, trade-offs, review cadence, and communication expectations.",
        ],
        [
          "Use Place, Market, and Property Preparation for their separate admitted context; do not transfer unsubmitted Buyer inputs.",
        ],
        "An initial search frame with explicit criteria, a review cadence, and clear signals for refinement rather than a recommendation.",
      ),
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
      guide(
        placeContext
          ? [
              "Which Louisville work, downtown, open-space, Boulder County, or other explicit daily-use destinations should be part of the location discussion?",
              "Which housing-type, property-condition, access, or neighborhood-pattern questions should be researched before comparing specific homes?",
              "Which City-level observations need address-specific verification before they affect a specific property decision?",
            ]
          : [
              "Which explicit locations, access patterns, and daily-use destinations should be part of the initial search discussion?",
              "Which City questions should be researched before comparing specific homes?",
            ],
        [
          "Louisville context is a starting point for City orientation. It does not answer which neighborhood or property is right for the buyer.",
          "Use City, neighborhood, property, market, financing, and professional-review evidence as separate layers rather than one citywide conclusion.",
        ],
        [
          "Explicit destinations, access patterns, housing form, property condition questions, and address-specific City or county facts to verify.",
        ],
        [
          "Municipal or county authorities, title, insurance, inspection, and property professionals handle their respective address-specific questions.",
        ],
        "A neutral Louisville research frame tied to explicit buyer-stated criteria, with clear City-to-property verification boundaries.",
      ),
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
      guide(
        [
          "Which current market questions would be useful to review before they affect search discipline or listing-review expectations?",
          "What date, freshness, limitations, or verification needs should accompany any Market Preparation evidence?",
        ],
        [
          "Current market context is dated preparation evidence, not a prediction, urgency signal, negotiation instruction, or offer recommendation.",
        ],
        [
          "Whether certified point-in-time Market evidence is available and current enough for the separate Market Preparation surface.",
        ],
        [
          "Review admitted Market Preparation evidence before relying on inventory, pace, price, or competition context.",
        ],
        "A precise market-question list that preserves freshness and limitation discipline without inventing current facts.",
      ),
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
      guide(
        [
          "Which single-family characteristics are must-haves, preferences, trade-offs, or open questions: layout, bedrooms, bathrooms, workspace, garage, lot, outdoor space, condition, age/style, HOA, or maintenance tolerance?",
          "Which trade-offs should remain visible: location versus size, condition versus price, outdoor space versus access, newer construction versus established housing, or turnkey versus renovation tolerance?",
          "Which listing facts, disclosures, costs, records, or condition questions should be verified before a property is treated as a strong candidate?",
        ],
        [
          "Use the must-have, preference, trade-off, and open-question structure to make criteria explicit without inferring needs.",
          "A property framework organizes evaluation; it does not select, rank, value, or conclude suitability for a home.",
        ],
        [
          "Objective property criteria, tolerance for condition or maintenance, HOA questions, and facts requiring property-specific verification.",
        ],
        [
          "Inspectors, title professionals, insurance professionals, municipal or county authorities, lenders, and other qualified professionals verify their domains.",
        ],
        "A reusable property-evaluation framework that makes explicit criteria and verification work visible before property-specific decisions.",
      ),
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
      guide(
        [
          "Which part of the process would be most useful to explain before active search begins?",
          "What should the buyer expect to decide or verify before moving from one stage to the next?",
        ],
        [
          "Consultation and readiness: establish explicit objectives, timing, questions, and professional verification needs.",
          "Search and touring: review listings and properties against visible criteria, then refine the search from explicit learning.",
          "Property evaluation and offer preparation: organize evidence, assumptions, contingencies, and professional questions before deciding how to proceed.",
          "Contract through closing: inspection, due diligence, appraisal, financing, title, and closing preparation involve separate process and professional checkpoints.",
        ],
        [
          "Current stage, next decision, documents or questions to prepare, and the conditions that need verification before progressing.",
        ],
        [
          "Lender, inspector, title, insurance, tax, legal, municipal, and other professionals address domain-specific questions as they arise.",
        ],
        "A process explanation the Agent can use live without promising an outcome, timing, approval, acceptance, or closing result.",
      ),
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
      guide(
        [
          "Which price, terms, earnest money, financing, inspection, appraisal, contingency, closing-timing, or possession topics would be useful to explain before a specific property is under discussion?",
          "Which assumptions, questions, and professional-review items should be organized before deciding whether and how to pursue a property?",
        ],
        [
          "Offer preparation explains the categories that shape a future decision; it does not tell the buyer what to offer or how to negotiate.",
          "Inspection, appraisal, financing, title, timing, and possession are process topics whose specifics depend on later facts and professional review.",
        ],
        [
          "Property-specific facts, evidence limitations, stated priorities, and questions requiring a professional or contractual review.",
        ],
        [
          "Use qualified professional and governing-document review for any offer, contract, legal, tax, lender, insurance, or title question.",
        ],
        "A clear conceptual offer-preparation conversation that remains educational, neutral, and outside specific offer advice.",
      ),
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
      guide(
        [
          "Which unresolved question belongs with a lender, inspector, title professional, insurance professional, tax professional, attorney, or municipal or county authority?",
          "What facts, documents, observations, or assumptions should be prepared for that conversation?",
        ],
        [
          "Professional checkpoints organize questions and evidence. They do not select a provider, create a referral, or trigger communication.",
        ],
        [
          "The question category, available facts, missing evidence, and any deadline or process dependency to raise with the appropriate professional.",
        ],
        [
          "Each professional or authority verifies only its own domain; the Agent retains professional judgment and process coordination.",
        ],
        "A practical verification plan with the right questions routed to the right domain, without a provider recommendation.",
      ),
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
      guide(
        [
          "Which representation, brokerage-process, compensation, disclosure, or documentation questions would the buyer like to understand?",
          "What should be clarified under current firm and governing policy before either party relies on a process assumption?",
        ],
        [
          "Explain the process and identify questions; do not state that a particular agreement, relationship, or term is required for this buyer.",
        ],
        [
          "Buyer questions about process, documentation, disclosures, and the appropriate next conversation.",
        ],
        [
          "Confirm current brokerage and legal requirements through governing and firm policy when they become material.",
        ],
        "A transparent process conversation that preserves brokerage and representation boundaries.",
      ),
    ),
    section(
      "what-could-change-plan",
      "What could change the plan",
      "DETAIL",
      "STANDARD",
      "Use supported changes in explicit context and verification findings to revisit the preparation plan rather than treating the first briefing as final.",
      composition.whatCouldChangeInterpretation.map((statement) => statement.text),
      ["REIE_AGENT_BUYER_PREPARATION_SYNTHESIS_RECONCILED"],
      guide(
        [
          "Has the target timing changed, and is the 3-6 month window a target or a flexible range?",
          "Has lender-confirmed information changed the reported financing context?",
          "Have City, property-type, search-priority, or professional-question assumptions changed?",
        ],
        [
          "Update the preparation plan when explicit facts change; do not preserve stale assumptions for convenience.",
        ],
        [
          "Updated explicit selections, dated Market evidence if admitted, and new professional verification findings.",
        ],
        [
          "Route changed financing, property, title, inspection, insurance, legal, tax, or municipal questions to the appropriate verification path.",
        ],
        "A deliberate update decision that keeps the briefing aligned with explicit facts rather than inferred conditions.",
      ),
    ),
  ];

  return Object.freeze({
    status: AGENT_BUYER_PROFESSIONAL_PLAYBOOK_STATUS,
    sections: Object.freeze(sections),
    consultationAgenda: Object.freeze([
      Object.freeze({
        id: "agenda-open",
        title: "Open and align",
        summary: "Set the consultation objective and confirm the explicit Buyer position before moving into advice, research, or next steps.",
        guide: guide(
          ["What would make this conversation useful today?", "What is already clear, and what needs to be worked through?"],
          ["Confirm the discussion is preparation-oriented and based on explicit, session-only context."],
          ["Stated objective, decision participants, timing, and selected consultation priorities."],
          ["Defer professional-domain questions until the relevant facts and question category are clear."],
          "A shared consultation objective and an agreed sequence for the conversation.",
        ),
      }),
      Object.freeze({
        id: "agenda-objective-timing",
        title: "Understand objective and timing",
        summary: "Clarify the purchase objective, the 3-6 month horizon, decision process, and the facts that could change preparation timing.",
        guide: guide(
          ["What needs to happen before actively touring feels appropriate?", "Is the 3-6 month window a target or flexible range, and what could move it earlier or later?"],
          ["Use timing as a preparation posture, not as an urgency conclusion."],
          ["Explicit milestones, constraints, flexibility, and unresolved decisions."],
          ["A lender or other professional may need to confirm milestones within their domain."],
          "A timing-aware preparation plan with no assumed urgency.",
        ),
      }),
      Object.freeze({
        id: "agenda-financing",
        title: "Financing readiness",
        summary: "Separate reported financing context from the questions that only a lender can answer before it shapes the search.",
        guide: guide(
          ["Have you spoken with a lender, and what still needs confirmation?", "Which purchase-range, down-payment, closing-cost, or payment questions should the lender model?"],
          ["The Agent organizes the process conversation; the lender verifies financing facts and outcomes."],
          ["Reported lender relationship, preapproval discussion, financing milestones, and open questions."],
          ["Lender confirms qualification, underwriting, approval, rates, terms, and property-specific financing implications."],
          "A lender-ready question set and no unsupported financing conclusion.",
        ),
      }),
      Object.freeze({
        id: "agenda-search-place-property",
        title: "Search, Place, and property needs",
        summary: "Set an initial Louisville single-family search frame, make criteria explicit, and define the learning loop for listings and showings.",
        guide: guide(
          ["Which Louisville access and daily-use criteria are explicit?", "Which single-family needs are must-haves, preferences, trade-offs, or open questions?", "How broad should the first search be and what should be learned from early showings?"],
          ["City context is orientation only; neighborhood and property evaluation remain separate and evidence-bound."],
          ["Criteria, trade-offs, review cadence, touring expectations, and triggers to refine the search."],
          ["Use Place and Property Preparation for separate admitted context and verification questions."],
          "An explicit initial search frame that can be refined without recommendation or hidden context.",
        ),
      }),
      Object.freeze({
        id: "agenda-process-offer",
        title: "Buying process and property evaluation",
        summary: "Explain the path from search through property evaluation and future offer preparation, with verification checkpoints before each material decision.",
        guide: guide(
          ["Which part of the buying process would be most useful to explain before search begins?", "Which property, offer, diligence, or process questions should be prepared before they become time-sensitive?"],
          ["Explain stages, expectations, and verification lanes without giving specific offer or negotiation advice."],
          ["Current process knowledge, property-evaluation questions, and future offer-preparation topics."],
          ["Inspection, lender, title, insurance, tax, legal, and municipal questions require the relevant professional or authority."],
          "A buyer who understands the next process stage and the work to prepare before it.",
        ),
      }),
      Object.freeze({
        id: "agenda-process-next-steps",
        title: "Representation, professional questions, and next steps",
        summary: "Identify process questions, verification owners, and concrete next actions without forming a relationship or claiming what is required.",
        guide: guide(
          ["Which representation or brokerage-process questions should be clarified?", "Which unresolved professional questions need a lender, inspector, title, insurance, tax, legal, or municipal follow-up?"],
          ["End by assigning a preparation action, clarification item, or professional verification question rather than leaving an abstract next step."],
          ["Open questions, ownership, timing, and the exact authorized ATLAS continuation when useful."],
          ["Current policy and governing requirements must be confirmed before reliance on representation or process assumptions."],
          "A clear, bounded next-action plan with ownership and no unauthorized transfer or communication.",
        ),
      }),
    ]),
    nextActionPlan: Object.freeze({
      agentActions: Object.freeze([
        `Clarify whether the ${selectedTiming} timing is a target or flexible window before establishing the first touring cadence.`,
        `Define initial ${selectedCity} ${selectedProperty} criteria, separating must-haves, preferences, trade-offs, and open questions.`,
        "Establish the initial listing-review cadence and what the first several showings should teach before criteria are refined.",
      ]),
      buyerClarifications: Object.freeze([
        "Confirm lender and preapproval status as reported, then identify the facts that still require lender confirmation.",
        "Identify unresolved professional questions before active search so verification can be sequenced deliberately.",
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
