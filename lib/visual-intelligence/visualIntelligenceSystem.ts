export const REIE_VISUAL_INTELLIGENCE_SYSTEM_STATUS =
  "REIE_VISUAL_INTELLIGENCE_SYSTEM_1_COMPLETE";

export type VisualIntelligenceReadiness =
  | "implemented"
  | "prototype"
  | "planned"
  | "deferred";

export type VisualConfidenceLevel = "high" | "moderate" | "limited";

export type VisualState =
  | "ready"
  | "loading"
  | "empty"
  | "sparse"
  | "stale"
  | "conflict"
  | "failure";

export type VisualComponentContract = {
  id: string;
  name: string;
  purpose: string;
  readiness: VisualIntelligenceReadiness;
  requiredInputs: string[];
  requiredOutputs: string[];
  requiredStates: VisualState[];
  accessibilityContract: string[];
  trustContract: string[];
};

export type VisualEvidenceFacet = {
  label: string;
  state: "available" | "limited" | "needs-review";
  explanation: string;
};

export type VisualIntelligenceTokens = {
  colors: Record<string, string>;
  spacing: Record<string, string>;
  typography: Record<string, string>;
  motion: Record<string, string>;
  shape: Record<string, string>;
};

export type VisualMetricBand = {
  label: string;
  value: number;
  benchmark: string;
  interpretation: string;
};

export type PropertyDnaDimension = {
  label: string;
  value: number;
  evidenceQuality: VisualConfidenceLevel;
  interpretation: string;
  verify: string;
};

export const VIS_DESIGN_TOKENS: VisualIntelligenceTokens = {
  colors: {
    background: "#0b0b0b",
    surface: "#12110f",
    surfaceElevated: "#191713",
    textPrimary: "#f5f1e8",
    textSecondary: "#c9c0b0",
    textMuted: "#8f8577",
    coloradoGold: "#d8a84f",
    pine: "#2f5d50",
    alpineBlue: "#5d7f95",
    clay: "#9a6247",
    snow: "#f6f3ec",
    confidenceHigh: "#6fa889",
    confidenceModerate: "#d8a84f",
    confidenceLimited: "#b9785d",
  },
  spacing: {
    section: "clamp(4rem, 7vw, 7rem)",
    panel: "clamp(1.25rem, 3vw, 2.5rem)",
    rhythm: "clamp(1rem, 2vw, 1.5rem)",
  },
  typography: {
    eyebrow: "0.75rem / 1.2",
    headline: "clamp(2.25rem, 6vw, 5rem) / 1",
    title: "clamp(1.4rem, 3vw, 2.4rem) / 1.1",
    body: "1rem / 1.65",
    datum: "clamp(2rem, 5vw, 4rem) / 1",
  },
  motion: {
    default: "160ms ease-out",
    reducedMotion: "no transform, no parallax, no animated chart draw",
  },
  shape: {
    panelRadius: "20px",
    controlRadius: "999px",
    visualRadius: "28px",
  },
};

export const VIS_COMPONENT_CONTRACTS: VisualComponentContract[] = [
  {
    id: "VIS-COMPONENT-MARKET-PULSE",
    name: "Market Pulse",
    purpose:
      "Summarize a local market condition as an interpretation-led visual before exposing supporting detail.",
    readiness: "prototype",
    requiredInputs: [
      "market label",
      "time period",
      "primary condition",
      "supporting metric bands",
      "buyer interpretation",
      "seller interpretation",
      "evidence facets",
    ],
    requiredOutputs: [
      "plain-language summary",
      "primary condition emphasis",
      "supporting metric table",
      "questions to verify",
    ],
    requiredStates: ["ready", "loading", "empty", "sparse", "stale", "conflict", "failure"],
    accessibilityContract: [
      "svg role and accessible title",
      "data table alternative",
      "no color-only meaning",
      "no hover-only disclosure",
    ],
    trustContract: [
      "non-predictive language",
      "source and freshness visible",
      "confidence state visible",
      "fixture status visible in internal prototype",
    ],
  },
  {
    id: "VIS-COMPONENT-PROPERTY-DNA",
    name: "Property DNA",
    purpose:
      "Translate a property into decision dimensions that clarify what to value, verify, and compare.",
    readiness: "prototype",
    requiredInputs: [
      "property context",
      "decision dimensions",
      "evidence quality",
      "verification prompts",
    ],
    requiredOutputs: [
      "decision profile",
      "dimension interpretations",
      "verification checklist",
      "accessible text alternative",
    ],
    requiredStates: ["ready", "loading", "empty", "sparse", "stale", "conflict", "failure"],
    accessibilityContract: [
      "semantic list of dimensions",
      "visible labels for every value",
      "screen-reader summary",
      "keyboard-reachable verification content",
    ],
    trustContract: [
      "no suitability scoring",
      "no investment recommendation",
      "separate facts from interpretation",
      "verification prompts required",
    ],
  },
  {
    id: "VIS-COMPONENT-CONFIDENCE-LAYER",
    name: "Confidence Layer",
    purpose:
      "Expose evidence quality, freshness, completeness, and limitations without overwhelming the primary story.",
    readiness: "prototype",
    requiredInputs: [
      "source authority",
      "freshness",
      "completeness",
      "conflict state",
      "permitted use",
      "review state",
    ],
    requiredOutputs: [
      "confidence summary",
      "facet-by-facet provenance",
      "limitations",
      "recommended verification action",
    ],
    requiredStates: ["ready", "loading", "empty", "sparse", "stale", "conflict", "failure"],
    accessibilityContract: [
      "plain text equivalent",
      "expandable details work without pointer hover",
      "status not conveyed by color alone",
      "reduced-motion stable",
    ],
    trustContract: [
      "source limitations visible",
      "unknowns named",
      "no final legal or compliance claim",
      "no provider activation implied",
    ],
  },
  {
    id: "VIS-COMPONENT-MARKET-REPORT-COMPOSITION",
    name: "Market Report Composition",
    purpose:
      "Arrange interpretation, visual evidence, audience guidance, confidence, and next steps into a reusable report grammar.",
    readiness: "prototype",
    requiredInputs: [
      "market summary",
      "primary visual",
      "supporting metrics",
      "buyer guidance",
      "seller guidance",
      "confidence layer",
      "next steps",
    ],
    requiredOutputs: [
      "first-viewport interpretation",
      "progressive evidence",
      "audience-specific guidance",
      "data alternative",
      "decision next step",
    ],
    requiredStates: ["ready", "loading", "empty", "sparse", "stale", "conflict", "failure"],
    accessibilityContract: [
      "logical heading order",
      "responsive single-column fallback",
      "data table alternative",
      "keyboard and reduced-motion safe",
    ],
    trustContract: [
      "education before conversion",
      "no forecasting",
      "methodology and limitations visible",
      "fixture data clearly identified",
    ],
  },
];

export const VIS_SIGNATURE_VISUAL_SPECS = [
  {
    id: "VIS-SIGNATURE-MARKET-PULSE",
    name: "Market Pulse",
    decisionQuestion: "What kind of market am I looking at?",
    bestUse: "City, neighborhood, and search-result market context.",
    prohibitedUse: "Forecasting, urgency, or price prediction.",
  },
  {
    id: "VIS-SIGNATURE-INVENTORY-HORIZON",
    name: "Inventory Horizon",
    decisionQuestion: "How much choice exists before I need to compare trade-offs?",
    bestUse: "Market pages and search education.",
    prohibitedUse: "Guaranteeing availability or timing outcomes.",
  },
  {
    id: "VIS-SIGNATURE-PROPERTY-DNA",
    name: "Property DNA",
    decisionQuestion: "What makes this property worth investigating further?",
    bestUse: "Property pages, comparison readiness, and advisor preparation.",
    prohibitedUse: "Suitability ranking, protected-class inference, or investment advice.",
  },
  {
    id: "VIS-SIGNATURE-CONFIDENCE-LAYER",
    name: "Confidence Layer",
    decisionQuestion: "How much should I rely on this information right now?",
    bestUse: "Every interpretive visual and report composition.",
    prohibitedUse: "Hiding missing evidence or implying external approval.",
  },
] as const;

export const VIS_STATE_HANDLING: Record<VisualState, string> = {
  ready: "Show interpretation, visual evidence, accessible data alternative, confidence, and next step.",
  loading: "Use stable skeleton regions with labels; do not shift layout or animate continuously.",
  empty: "Explain that the relevant data is unavailable and direct the user to verification.",
  sparse: "Show limited interpretation with lower confidence and visible missing fields.",
  stale: "Keep the visual visible only if the stale date is prominent and interpretation is conservative.",
  conflict: "Prefer a conflict explanation over a single conclusion; request verification.",
  failure: "Fail closed with no unsupported visual claim and a practical next step.",
};

export const VIS_PROHIBITED_PATTERNS = [
  "predictive pricing claims",
  "guaranteed outcome language",
  "investment recommendation scoring",
  "school or safety ranking",
  "protected-class inference",
  "public GIS activation",
  "provider execution",
  "telemetry activation",
  "customer personalization",
  "decorative charts without decisions",
] as const;

export const VIS_DEI_REVIEW = {
  decisionClarity: 5,
  decisionConfidence: 4,
  educationalValue: 5,
  trust: 5,
  decisionReadiness: 4,
  decisionEfficiency: 4,
  total: 27,
  normalized: 4.5,
  rationale:
    "The prototype makes visual interpretation, confidence, and verification explicit while preserving fixture-only boundaries. Future production readiness depends on route-by-route adoption and live-data-specific copy review.",
};

export const VIS_PROTOTYPE_FIXTURE = {
  fixtureId: "VIS-FIXTURE-MARKET-REPORT-001",
  status: "NON_PRODUCTION_FIXTURE",
  publicActivation: false,
  providerActivation: false,
  schemaChange: false,
  market: {
    label: "Boulder County internal preview",
    period: "Deterministic fixture period",
    primaryCondition: "Measured choice with selective pressure",
    summary:
      "This internal fixture shows how REIE can explain market conditions before asking a customer to interpret raw statistics.",
    buyerInterpretation:
      "Buyers would compare choice, pricing discipline, and verification needs before deciding where to spend attention.",
    sellerInterpretation:
      "Sellers would prepare evidence, condition context, and pricing questions before assuming broad market momentum.",
    nextStep:
      "Use the market story to decide which neighborhoods or property types deserve a closer review.",
    metricBands: [
      {
        label: "Choice depth",
        value: 62,
        benchmark: "Moderate fixture band",
        interpretation: "Enough options to compare, but not enough to treat every segment as interchangeable.",
      },
      {
        label: "Pricing signal clarity",
        value: 54,
        benchmark: "Mixed fixture band",
        interpretation: "Price interpretation needs property-level verification before drawing conclusions.",
      },
      {
        label: "Pace pressure",
        value: 47,
        benchmark: "Measured fixture band",
        interpretation: "The fixture favors preparation and comparison over urgency.",
      },
    ] satisfies VisualMetricBand[],
  },
  property: {
    label: "Representative Colorado property fixture",
    summary:
      "Property DNA frames a home as decision dimensions rather than a single score.",
    dimensions: [
      {
        label: "Livability fit",
        value: 72,
        evidenceQuality: "moderate",
        interpretation: "Layout and daily-use assumptions should be compared against the buyer's actual routine.",
        verify: "Confirm room function, storage, noise, natural light, and daily movement through the home.",
      },
      {
        label: "Condition visibility",
        value: 58,
        evidenceQuality: "limited",
        interpretation: "Visible condition is useful, but inspections and disclosures matter more than presentation.",
        verify: "Review inspection history, disclosures, permits, roof, mechanicals, drainage, and remodel quality.",
      },
      {
        label: "Location context",
        value: 66,
        evidenceQuality: "moderate",
        interpretation: "Location should be read through commute, services, neighborhood fit, and market context.",
        verify: "Visit at different times and validate commute, parking, services, and nearby change activity.",
      },
      {
        label: "Financial readiness",
        value: 51,
        evidenceQuality: "limited",
        interpretation: "Affordability is not represented by list price alone.",
        verify: "Prepare lender-neutral questions about taxes, insurance, HOA, repairs, and cash reserves.",
      },
    ] satisfies PropertyDnaDimension[],
  },
  evidenceFacets: [
    {
      label: "Source authority",
      state: "available",
      explanation: "Internal fixture only; no provider activation or external acquisition occurs.",
    },
    {
      label: "Freshness",
      state: "limited",
      explanation: "Fixture period is deterministic and not a live market timestamp.",
    },
    {
      label: "Completeness",
      state: "limited",
      explanation: "Designed to test composition behavior across sparse and interpretive states.",
    },
    {
      label: "Conflict handling",
      state: "available",
      explanation: "The component contract requires visible conflict states before any conclusion.",
    },
    {
      label: "Permitted use",
      state: "needs-review",
      explanation: "Production adoption requires source-specific rights, attribution, and copy review.",
    },
  ] satisfies VisualEvidenceFacet[],
};

export function getVisualIntelligencePrototypeFixture() {
  return VIS_PROTOTYPE_FIXTURE;
}
