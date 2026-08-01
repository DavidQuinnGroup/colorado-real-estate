import type { CityData } from './cities.js';
import type { Neighborhood } from './neighborhoods.js';

export type DecisionGuideKey = string;
type EditorialDecisionGuideKey = 'boulder' | 'louisville' | 'lafayette';
type EnhancedFoundationDecisionGuideKey = 'broomfield' | 'erie' | 'longmont' | 'denver' | 'superior' | 'westminster';
export type DecisionGuideMaturity = 'FOUNDATION' | 'ENHANCED_FOUNDATION' | 'EVIDENCE_BACKED' | 'EDITORIALLY_CERTIFIED';

export type DecisionGuideEligibility = {
  guideMaturity: DecisionGuideMaturity;
  publicEligibility: boolean;
};

export type DecisionGuideContinuityDestination =
  | 'market'
  | 'city-search'
  | 'buyer-guidance'
  | 'seller-guidance'
  | 'financing-confidence'
  | 'grand-plan'
  | 'advisory';

export type DecisionGuideContinuityLink = {
  label: string;
  href: string;
  destination: DecisionGuideContinuityDestination;
};

type DecisionGuideItem = {
  label: string;
  explanation: string;
};

type DecisionGuideSummaryItem = DecisionGuideItem & {
  value: string;
};

type DecisionGuideTradeoff = {
  strength: string;
  tradeoff: string;
};

type DecisionGuideSnapshot = {
  whereAmI: string;
  mattersMost: string;
  payAttention: string;
  verify: string;
  bestNextStep: string;
};

export type DecisionGuideEvidenceTransparencyDimension =
  | 'geographic-scope'
  | 'evidence-scope'
  | 'recency'
  | 'source-use-boundary'
  | 'conflict-uncertainty'
  | 'property-professional-boundary';

export type DecisionGuideEvidenceTransparencyItem = {
  dimension: DecisionGuideEvidenceTransparencyDimension;
  label: string;
  explanation: string;
};

export type DecisionGuideEvidenceTransparency = {
  contract: typeof DECISION_GUIDE_EVIDENCE_TRANSPARENCY;
  maturityLabel: string;
  maturityExplanation: string;
  heading: string;
  introduction: string;
  items: readonly DecisionGuideEvidenceTransparencyItem[];
  decisionBoundary: string;
  nextStepGuidance: string;
};

export type DecisionGuide = {
  key: DecisionGuideKey;
  maturity: DecisionGuideMaturity;
  publicEligibility: boolean;
  cityName: string;
  identity: string;
  decisionSnapshot: DecisionGuideSnapshot;
  summaryEyebrow: string;
  summaryHeadline: string;
  summaryIntro: string;
  neighborhoodsEyebrow: string;
  neighborhoodsHeadline: string;
  neighborhoodSectionId: string;
  continuitySurface: string;
  decisionSummary: DecisionGuideSummaryItem[];
  housingContext: DecisionGuideItem[];
  practicalContext: DecisionGuideItem[];
  marketContext: DecisionGuideItem[];
  communityContext: DecisionGuideItem[];
  buyerConsiderations: DecisionGuideItem[];
  sellerConsiderations: DecisionGuideItem[];
  evidenceLimitations: DecisionGuideItem[];
  evidenceTransparency?: DecisionGuideEvidenceTransparency;
  tradeoffs: DecisionGuideTradeoff[];
  verificationQuestions: string[];
};

type DecisionGuideCityConfig = {
  key: EditorialDecisionGuideKey;
  cityName: string;
  identityPattern: string;
  summaryHeadline: string;
  summaryIntro: string;
  distinctValue: string;
  attentionValue: string;
  verificationValue: string;
  verificationExplanation: string;
  housingPatternLabel: string;
  housingPatternFallback: string;
  housingVariationLabel: string;
  housingVariationExplanation: string;
  conditionExplanation: string;
  accessExplanation: string;
  specificityLabel: string;
  specificityExplanation: string;
  researchExplanation: string;
  tradeoffs: DecisionGuideTradeoff[];
  verificationQuestions: string[];
};

type EnhancedFoundationCityConfig = {
  key: EnhancedFoundationDecisionGuideKey;
  cityName: string;
  identityPattern: string;
  summaryHeadline: string;
  summaryIntro: string;
  distinctValue: string;
  attentionValue: string;
  verificationValue: string;
  localCharacter: DecisionGuideItem[];
  housingContext: DecisionGuideItem[];
  practicalContext: DecisionGuideItem[];
  marketContext: DecisionGuideItem[];
  communityContext: DecisionGuideItem[];
  buyerConsiderations: DecisionGuideItem[];
  sellerConsiderations: DecisionGuideItem[];
  evidenceLimitations: DecisionGuideItem[];
  tradeoffs: DecisionGuideTradeoff[];
  verificationQuestions: string[];
};

export const DECISION_GUIDE_FRAMEWORK = 'context-tradeoffs-questions-evidence-next-step';
export const DECISION_GUIDE_EVIDENCE_TRANSPARENCY = 'decision-guide-evidence-transparency';
export const DECISION_GUIDE_SOURCE = 'governed-city-and-neighborhood-data';
export const DECISION_GUIDE_FOUNDATION_SOURCE = 'governed-city-market-registry';
export const DECISION_GUIDE_ENHANCED_FOUNDATION_SOURCE = 'governed-city-market-registry-and-durable-local-context';

export const DECISION_GUIDE_TRUST_BOUNDARIES = {
  ai: false,
  gis: false,
  telemetry: false,
  ranking: false,
  demographicTargeting: false,
  schoolRanking: false,
  safetyRanking: false,
  investmentRecommendation: false,
} as const;

export const DECISION_GUIDE_FRAMEWORK_STEPS: Array<{ label: string; explanation: string }> = [
  {
    label: 'Context',
    explanation: 'Understand the city as a city and as a set of neighborhood patterns.',
  },
  {
    label: 'Trade-offs',
    explanation: 'Balance access, housing form, condition, and market signal.',
  },
  {
    label: 'Questions',
    explanation: 'Turn interest into specific facts to verify.',
  },
  {
    label: 'Evidence',
    explanation: 'Use market, neighborhood, property, and advisor evidence separately.',
  },
  {
    label: 'Next Step',
    explanation: 'Move into search, neighborhood review, buyer, seller, financing, or Grand Plan guidance.',
  },
];

export const DECISION_GUIDE_CITY_CONFIGS: Record<EditorialDecisionGuideKey, DecisionGuideCityConfig> = {
  boulder: {
    key: 'boulder',
    cityName: 'Boulder',
    identityPattern:
      'high-context Colorado market: daily access, neighborhood pattern, housing condition, and market signal all matter',
    summaryHeadline: 'Decide what Boulder means before comparing homes.',
    summaryIntro:
      'Start with the city pattern, then use neighborhood pages, property facts, market evidence, and advisor questions as separate confirmation layers.',
    distinctValue: 'A compact Front Range city with multiple neighborhood patterns',
    attentionValue: 'Price, inventory, condition, access, and property-specific diligence',
    verificationValue: 'Fit, records, condition, commute pattern, and neighborhood evidence',
    verificationExplanation:
      'Use Boulder context as a starting point, then verify individual property facts, costs, records, and daily-life assumptions before acting.',
    housingPatternLabel: 'Mixed housing eras',
    housingPatternFallback: 'mixed-era residential',
    housingVariationLabel: 'Neighborhood-by-neighborhood variation',
    housingVariationExplanation:
      'Downtown, North Boulder, South Boulder, Gunbarrel, Table Mesa, Mapleton Hill, Chautauqua, and Wonderland Hills should be evaluated separately instead of treated as one uniform market.',
    conditionExplanation:
      'Older homes, hillside settings, mature landscaping, and remodel history can change the diligence questions that matter for a specific property.',
    accessExplanation:
      'Evaluate the relationship between the property, work patterns, neighborhood anchors, trail or open-space access, and the parts of Boulder used most often.',
    specificityLabel: 'Location specificity',
    specificityExplanation:
      'A Boulder address is not enough. The decision changes when the property sits near downtown activity, foothill edges, north/south corridors, or more residential neighborhood interiors.',
    researchExplanation:
      'Use market context, neighborhood pages, property records, disclosures, inspections, insurance review, and advisor discussion as separate evidence layers.',
    tradeoffs: [
      {
        strength: 'Strong local identity and neighborhood variety',
        tradeoff: 'Customers should compare micro-location, property condition, and access needs instead of assuming one city-wide answer.',
      },
      {
        strength: 'Established housing stock with distinctive character',
        tradeoff: 'Older systems, remodel quality, drainage, roof, sewer, and exterior-envelope questions can materially affect confidence.',
      },
      {
        strength: 'Clear continuity from city market to neighborhood and property review',
        tradeoff: 'Market statistics should inform the decision, not replace property-specific verification.',
      },
    ],
    verificationQuestions: [
      'Which Boulder neighborhood pattern should I compare against the way I would use the city day to day?',
      'What property-specific condition, records, insurance, or cost questions should be answered before I compare this home against alternatives?',
      'Does the current market signal change my timing, search discipline, or seller-preparation plan without creating urgency?',
      'Which neighborhood page, market evidence, property facts, and advisor questions should I review before the next step?',
    ],
  },
  louisville: {
    key: 'louisville',
    cityName: 'Louisville',
    identityPattern:
      'Boulder County decision market: neighborhood pattern, small-city access, property condition, and market signal should be reviewed together',
    summaryHeadline: 'Decide what Louisville means before comparing homes.',
    summaryIntro:
      'Start with Louisville as a city decision, then use neighborhood pages, property facts, market evidence, financing preparation, and advisor questions as separate confirmation layers.',
    distinctValue: 'A Boulder County city with established neighborhoods and practical access choices',
    attentionValue: 'Price, inventory, neighborhood context, condition, and daily access',
    verificationValue: 'Property facts, records, costs, financing readiness, and neighborhood evidence',
    verificationExplanation:
      'Use Louisville context as a starting point, then verify individual property facts, costs, disclosures, records, and daily-life assumptions before acting.',
    housingPatternLabel: 'Established neighborhood patterns',
    housingPatternFallback: 'established residential',
    housingVariationLabel: 'City identity with neighborhood variation',
    housingVariationExplanation:
      'Old Town Louisville, Coal Creek Ranch, Centennial Valley, North End, and Steel Ranch should be evaluated separately instead of treated as one uniform market.',
    conditionExplanation:
      'Property age, remodel history, exterior exposure, lot context, and maintenance records can change the diligence questions that matter for a specific Louisville home.',
    accessExplanation:
      'Evaluate the relationship between the property, work patterns, downtown Louisville, open-space access, Boulder County connections, and the routes used most often.',
    specificityLabel: 'Neighborhood specificity',
    specificityExplanation:
      'A Louisville address is not enough. The decision changes when the property sits near Old Town activity, open-space edges, golf-course adjacency, newer infill, or quieter residential interiors.',
    researchExplanation:
      'Use market context, neighborhood pages, property records, disclosures, inspection review, insurance questions, financing preparation, and advisor discussion as separate evidence layers.',
    tradeoffs: [
      {
        strength: 'Recognizable small-city identity with Boulder County access',
        tradeoff: 'Customers should compare micro-location, property condition, and daily route needs instead of assuming one city-wide answer.',
      },
      {
        strength: 'Established neighborhoods with different housing patterns',
        tradeoff: 'Older systems, remodel quality, drainage, exterior-envelope condition, and records review can materially affect confidence.',
      },
      {
        strength: 'Clear continuity from city market to neighborhood and property review',
        tradeoff: 'Market statistics should inform the decision, not replace property-specific verification or financing preparation.',
      },
    ],
    verificationQuestions: [
      'Which Louisville neighborhood pattern should I compare against the way I would use the city day to day?',
      'What property-specific condition, records, insurance, cost, or financing-readiness questions should be answered before I compare this home against alternatives?',
      'Does the current market signal change my search discipline or seller-preparation plan without creating urgency?',
      'Which neighborhood page, market evidence, property facts, financing preparation items, and advisor questions should I review before the next step?',
    ],
  },
  lafayette: {
    key: 'lafayette',
    cityName: 'Lafayette',
    identityPattern:
      'east Boulder County decision market: neighborhood pattern, housing condition, local access, and market signal should be reviewed together',
    summaryHeadline: 'Decide what Lafayette means before comparing homes.',
    summaryIntro:
      'Start with Lafayette as a city decision, then use neighborhood pages, property facts, market evidence, financing preparation, and advisor questions as separate confirmation layers.',
    distinctValue: 'An east Boulder County city with established neighborhoods and practical Front Range access',
    attentionValue: 'Price, inventory, neighborhood pattern, condition, and daily access',
    verificationValue: 'Property facts, records, costs, financing readiness, and neighborhood evidence',
    verificationExplanation:
      'Use Lafayette context as a starting point, then verify individual property facts, costs, disclosures, records, and daily-life assumptions before acting.',
    housingPatternLabel: 'Varied neighborhood patterns',
    housingPatternFallback: 'varied residential',
    housingVariationLabel: 'City identity with local variation',
    housingVariationExplanation:
      "Indian Peaks, Waneka Lake, Old Town Lafayette, and Anna's Farm should be evaluated separately instead of treated as one uniform market.",
    conditionExplanation:
      'Property age, remodel history, lot context, exterior exposure, and maintenance records can change the diligence questions that matter for a specific Lafayette home.',
    accessExplanation:
      'Evaluate the relationship between the property, work patterns, Old Town Lafayette, Waneka Lake, open-space access, Boulder County connections, and the routes used most often.',
    specificityLabel: 'Neighborhood specificity',
    specificityExplanation:
      'A Lafayette address is not enough. The decision changes when the property sits near Old Town activity, lake or open-space edges, golf-course adjacency, or quieter residential interiors.',
    researchExplanation:
      'Use market context, neighborhood pages, property records, disclosures, inspection review, insurance questions, financing preparation, and advisor discussion as separate evidence layers.',
    tradeoffs: [
      {
        strength: 'Recognizable east Boulder County identity with multiple neighborhood patterns',
        tradeoff: 'Customers should compare micro-location, property condition, and daily route needs instead of assuming one city-wide answer.',
      },
      {
        strength: 'Established neighborhoods with different housing forms',
        tradeoff: 'Older systems, remodel quality, drainage, exterior-envelope condition, and records review can materially affect confidence.',
      },
      {
        strength: 'Clear continuity from city market to neighborhood and property review',
        tradeoff: 'Market statistics should inform the decision, not replace property-specific verification or financing preparation.',
      },
    ],
    verificationQuestions: [
      'Which Lafayette neighborhood pattern should I compare against the way I would use the city day to day?',
      'What property-specific condition, records, insurance, cost, or financing-readiness questions should be answered before I compare this home against alternatives?',
      'Does the current market signal change my search discipline or seller-preparation plan without creating urgency?',
      'Which neighborhood page, market evidence, property facts, financing preparation items, and advisor questions should I review before the next step?',
    ],
  },
};

export const ENHANCED_FOUNDATION_CITY_CONFIGS: Record<EnhancedFoundationDecisionGuideKey, EnhancedFoundationCityConfig> = {
  broomfield: {
    key: 'broomfield',
    cityName: 'Broomfield',
    identityPattern:
      'regional corridor decision market where municipal structure, mixed housing eras, transportation access, commercial centers, and property-specific diligence should be evaluated separately',
    summaryHeadline: 'Use Broomfield as a structured local decision, not one broad corridor label.',
    summaryIntro:
      'Broomfield guidance now adds durable local context to the certified foundation route. It remains non-predictive, limitation-forward, and dependent on property-specific verification.',
    distinctValue:
      'A city and county with established areas, newer development, regional commercial centers, and practical access questions between Boulder and Denver corridors',
    attentionValue:
      'Housing age, location within the city, attached or detached form, transportation routes, municipal records, maintenance exposure, and property-specific context',
    verificationValue:
      'Property records, systems and remodel history, HOA documents where applicable, municipal requirements, insurance questions, commute assumptions, and advisory review',
    localCharacter: [
      {
        label: 'Municipal structure',
        explanation:
          'Broomfield functions as both a city and county, so property decisions can involve local records, municipal requirements, and service questions that should be checked for the specific address.',
      },
      {
        label: 'Development pattern',
        explanation:
          'Broomfield includes established residential areas, attached housing, newer subdivisions, and commercial or employment-area edges. Compare the immediate setting before relying on citywide context.',
      },
      {
        label: 'Regional access',
        explanation:
          'Many decisions involve access toward Boulder, Denver, and northern metro corridors. Route usefulness depends on address, timing, destination, and daily-use assumptions.',
      },
    ],
    housingContext: [
      {
        label: 'Mixed housing forms',
        explanation:
          'Broomfield inventory can include detached homes, townhomes, condos, established subdivisions, and newer construction. Compare property type, age, HOA structure, and maintenance exposure before narrowing options.',
      },
      {
        label: 'Established and newer areas',
        explanation:
          'Established homes may raise questions about systems, remodel quality, exterior condition, drainage, and records. Newer homes may shift review toward builder history, warranties, HOA documents, and nearby development context.',
      },
      {
        label: 'Location tradeoffs',
        explanation:
          'Properties can sit closer to regional corridors, commercial centers, quieter residential interiors, or open-space edges. Verify the practical effect from the address rather than treating the city as uniform.',
      },
    ],
    practicalContext: [
      {
        label: 'If commuting matters',
        explanation:
          'Compare actual routes toward Boulder, Denver, airport-area, and northern metro destinations at the times they would be used. This guide does not certify commute performance.',
      },
      {
        label: 'If newer construction matters',
        explanation:
          'Review builder history, warranty status, HOA obligations, lot exposure, nearby construction context, and municipal records before comparing newer homes against established alternatives.',
      },
      {
        label: 'If urban services matter',
        explanation:
          'Use commercial access, city services, recreation access, and daily errands as address-specific questions to verify rather than as a citywide suitability conclusion.',
      },
    ],
    marketContext: [
      {
        label: 'Inventory structure',
        explanation:
          'Broomfield market context can span different housing forms and ages. Compare similar property types before drawing conclusions from a citywide inventory signal.',
      },
      {
        label: 'Commercial and employment influences',
        explanation:
          'Regional employment centers, retail corridors, and transportation access can influence buyer attention, but this page does not forecast demand or assign investment value.',
      },
      {
        label: 'Municipal verification',
        explanation:
          'Planning, permitting, records, HOA, and jurisdictional questions should be checked through municipal sources, documents, inspections, and advisor review before decisions are made.',
      },
    ],
    communityContext: [
      {
        label: 'Local character',
        explanation:
          'Broomfield should be reviewed through property age, immediate surroundings, city services, commercial access, recreation access, and regional connections rather than demographic assumptions.',
      },
      {
        label: 'Evidence boundary',
        explanation:
          'The current page provides Enhanced Foundation citywide context. It does not replace property inspections, municipal research, title review, insurance review, or professional advice.',
      },
    ],
    buyerConsiderations: [
      {
        label: 'Before search',
        explanation:
          'Decide whether housing form, property age, commute route, HOA structure, lot pattern, or proximity to daily services matters most, then use search to test those criteria against active inventory.',
      },
      {
        label: 'Before offer decisions',
        explanation:
          'Verify records, condition, systems, HOA documents where applicable, municipal requirements, insurance questions, and route assumptions through qualified sources.',
      },
    ],
    sellerConsiderations: [
      {
        label: 'Property differentiation',
        explanation:
          'Document updates, systems, HOA details where applicable, lot features, location context, and maintenance history so buyers can compare the home against similar Broomfield options.',
      },
      {
        label: 'Preparation review',
        explanation:
          'Use local competition, property condition, presentation, documentation, and timing as advisor-review topics. This guide does not promise pricing results or market response.',
      },
    ],
    evidenceLimitations: [
      {
        label: 'Enhanced Foundation maturity',
        explanation:
          'This page is ENHANCED_FOUNDATION maturity. It adds durable Broomfield context to governed market data, but it is not editorial, predictive, regulatory, or provider certification.',
      },
      {
        label: 'Qualified-source review',
        explanation:
          'Construction, insurance, environmental, title, municipal, HOA, and property-record questions should be verified through qualified sources or professionals before decisions are made.',
      },
      {
        label: 'No protected activation',
        explanation:
          'No AI, public GIS, telemetry, provider activation, ranking, valuation, school rating, safety rating, or investment guidance is used.',
      },
    ],
    tradeoffs: [
      {
        strength: 'City-county structure with regional access',
        tradeoff: 'Municipal records, route assumptions, and address-specific service context still require direct verification.',
      },
      {
        strength: 'Range of established and newer housing options',
        tradeoff: 'Age, systems, HOA obligations, builder history, and maintenance exposure should be compared by property type.',
      },
      {
        strength: 'Access to Boulder and Denver corridor decisions',
        tradeoff: 'Actual route usefulness depends on address, timing, destination, and daily pattern rather than citywide labels.',
      },
    ],
    verificationQuestions: [
      'If commuting matters, which routes, destinations, and time-of-day assumptions should be checked from the specific address?',
      'If newer construction matters, what builder, warranty, HOA, lot, and nearby development questions should be verified?',
      'If established housing matters, what systems, remodel quality, exterior, drainage, and maintenance records need review?',
      'If urban services matter, which commercial, recreation, municipal, and daily-use assumptions should be verified?',
      'What property-specific due diligence belongs with a qualified inspector, insurance advisor, title professional, municipal source, HOA document review, or real estate advisor?',
    ],
  },
  erie: {
    key: 'erie',
    cityName: 'Erie',
    identityPattern:
      'northern corridor decision market where municipal growth, attached and detached housing options, newer development, regional access, and property-specific diligence should be evaluated separately',
    summaryHeadline: 'Use Erie as a structured local decision, not one growth-market shorthand.',
    summaryIntro:
      'Erie guidance now adds durable local context to the certified foundation route. It remains non-predictive, limitation-forward, and dependent on property-specific verification.',
    distinctValue:
      'A Front Range community spanning Boulder and Weld County context, with established areas, newer subdivisions, attached and detached housing, regional routes, and growth-related review questions',
    attentionValue:
      'Housing age, subdivision pattern, attached or detached form, county and municipal records, commute routes, HOA obligations, nearby development context, and property-specific condition review',
    verificationValue:
      'Property records, systems and remodel history, builder or warranty documents where applicable, HOA documents, municipal and county requirements, insurance questions, commute assumptions, and advisory review',
    localCharacter: [
      {
        label: 'Municipal and county context',
        explanation:
          'Erie decisions can involve municipal records and Boulder or Weld County context. Verify jurisdiction, taxes, services, permits, title, and property-record details for the specific address.',
      },
      {
        label: 'Development pattern',
        explanation:
          'Erie includes established residential areas, newer subdivisions, attached housing, and growth-edge settings. Compare the immediate setting before relying on a broad citywide signal.',
      },
      {
        label: 'Regional access',
        explanation:
          'Many Erie decisions involve routes toward Boulder, Longmont, Broomfield, Denver-area corridors, and northern Front Range services. Route usefulness depends on address, timing, destination, and daily pattern.',
      },
    ],
    housingContext: [
      {
        label: 'Varied housing forms',
        explanation:
          'Erie inventory can include detached homes, townhomes, newer subdivisions, established properties, and properties with different lot or HOA structures. Compare property type, age, documents, and maintenance exposure before narrowing options.',
      },
      {
        label: 'Established and newer areas',
        explanation:
          'Established homes may raise systems, exterior, drainage, remodel, and record-review questions. Newer homes may shift diligence toward builder history, warranty status, HOA documents, lot exposure, and nearby development context.',
      },
      {
        label: 'Location tradeoffs',
        explanation:
          'Properties can sit closer to regional corridors, newer development edges, commercial services, open-space access, or established residential interiors. Verify the practical effect from the address rather than treating the city as uniform.',
      },
    ],
    practicalContext: [
      {
        label: 'If commuting matters',
        explanation:
          'Compare actual routes toward Boulder, Longmont, Broomfield, Denver-area corridors, and northern Front Range destinations at the times they would be used. This guide does not certify commute performance.',
      },
      {
        label: 'If newer construction matters',
        explanation:
          'Review builder history, warranty status, HOA obligations, lot exposure, nearby construction context, municipal records, and county-specific records before comparing newer homes against established alternatives.',
      },
      {
        label: 'If lot size matters',
        explanation:
          'Review lot pattern, exterior exposure, drainage, landscaping, fencing, irrigation, HOA rules, and maintenance responsibilities as address-specific questions.',
      },
    ],
    marketContext: [
      {
        label: 'Inventory structure',
        explanation:
          'Erie market context can span established homes, newer detached homes, attached options, and different lot patterns. Compare similar property types before drawing conclusions from a citywide inventory signal.',
      },
      {
        label: 'Growth and development review',
        explanation:
          'New construction, nearby development, and municipal planning can influence comparison questions, but this page does not forecast demand, future development outcomes, or investment performance.',
      },
      {
        label: 'Jurisdictional verification',
        explanation:
          'Planning, permitting, property records, county context, HOA obligations, and service assumptions should be checked through municipal or county sources, documents, inspections, and advisor review before decisions are made.',
      },
    ],
    communityContext: [
      {
        label: 'Local character',
        explanation:
          'Erie should be reviewed through property age, immediate surroundings, municipal and county context, commercial access, recreation access, and regional connections rather than demographic assumptions.',
      },
      {
        label: 'Evidence boundary',
        explanation:
          'The current page provides Enhanced Foundation citywide context. It does not replace property inspections, municipal or county research, title review, insurance review, or professional advice.',
      },
    ],
    buyerConsiderations: [
      {
        label: 'Before search',
        explanation:
          'Decide whether housing form, property age, commute route, HOA structure, lot pattern, jurisdictional context, or proximity to daily services matters most, then use search to test those criteria against active inventory.',
      },
      {
        label: 'Before offer decisions',
        explanation:
          'Verify records, condition, systems, HOA documents where applicable, municipal and county requirements, insurance questions, route assumptions, and nearby development context through qualified sources.',
      },
    ],
    sellerConsiderations: [
      {
        label: 'Property differentiation',
        explanation:
          'Document updates, systems, HOA details where applicable, lot features, location context, maintenance history, and jurisdictional details so buyers can compare the home against similar Erie options.',
      },
      {
        label: 'Preparation review',
        explanation:
          'Use local competition, property condition, documentation, presentation, and timing as advisor-review topics. This guide does not promise pricing results or market response.',
      },
    ],
    evidenceLimitations: [
      {
        label: 'Enhanced Foundation maturity',
        explanation:
          'This page is ENHANCED_FOUNDATION maturity. It adds durable Erie context to governed market data, but it is not editorial, predictive, regulatory, or provider certification.',
      },
      {
        label: 'Qualified-source review',
        explanation:
          'Construction, insurance, environmental, title, municipal, county, HOA, and property-record questions should be verified through qualified sources or professionals before decisions are made.',
      },
      {
        label: 'No protected activation',
        explanation:
          'No AI, public GIS, telemetry, provider activation, ranking, valuation, school rating, safety rating, or investment guidance is used.',
      },
    ],
    tradeoffs: [
      {
        strength: 'Growth-area context with established and newer housing options',
        tradeoff: 'Age, systems, HOA obligations, builder history, nearby development, and maintenance exposure should be compared by property type.',
      },
      {
        strength: 'Regional access across Boulder, Weld, and northern metro decisions',
        tradeoff: 'Actual route usefulness depends on address, timing, destination, and daily pattern rather than citywide labels.',
      },
      {
        strength: 'Municipal and county context can support more specific diligence',
        tradeoff: 'Jurisdiction, records, title, taxes, services, and requirements still need address-specific verification.',
      },
    ],
    verificationQuestions: [
      'If commuting matters, which routes, destinations, and time-of-day assumptions should be checked from the specific address?',
      'If newer construction matters, what builder, warranty, HOA, lot, nearby development, and municipal-record questions should be verified?',
      'If established housing matters, what systems, remodel quality, exterior, drainage, and maintenance records need review?',
      'If county or municipal context matters, what jurisdiction, title, tax, service, permit, or record questions should be verified?',
      'What Erie-specific due diligence belongs with a qualified inspector, insurance advisor, title professional, municipal or county source, HOA document review, or real estate advisor?',
    ],
  },
  longmont: {
    key: 'longmont',
    cityName: 'Longmont',
    identityPattern:
      'northern Front Range decision market where varied housing stock, established areas, newer development, employment access, and Boulder County connections should be evaluated separately',
    summaryHeadline: 'Use Longmont as a structured local decision, not one uniform market.',
    summaryIntro:
      'Longmont guidance now adds durable local context to the certified foundation path. It remains non-predictive, limitation-forward, and dependent on property-specific verification.',
    distinctValue:
      'A Boulder County city with established neighborhoods, historic core context, newer edges, employment centers, and northern Front Range access',
    attentionValue:
      'Housing age, lot pattern, redevelopment context, new-construction differences, commuting routes, and property-specific condition review',
    verificationValue:
      'Property records, age, systems, remodel history, insurance questions, municipal requirements, commute pattern, and advisory review',
    localCharacter: [
      {
        label: 'Development pattern',
        explanation:
          'Longmont combines an older downtown and established residential areas with newer subdivision and employment-area growth. Evaluate the immediate setting before treating the citywide market signal as enough.',
      },
      {
        label: 'Transportation framework',
        explanation:
          'Regional decisions often involve north-south and east-west Front Range routes, access toward Boulder, and connections to northern Colorado employment or service centers.',
      },
      {
        label: 'Recreation and geography',
        explanation:
          'Open-space access, parks, trail connections, and views toward the Front Range can shape day-to-day questions, but they should be verified at the property and location level.',
      },
    ],
    housingContext: [
      {
        label: 'Varied housing stock',
        explanation:
          'Longmont includes older homes, established subdivisions, attached housing, infill, and newer construction. Compare age, systems, lot context, HOA structure where applicable, and maintenance history before narrowing choices.',
      },
      {
        label: 'Historic and established areas',
        explanation:
          'Older areas can carry different diligence questions around remodel quality, sewer or utility records, roof and exterior systems, drainage, and compatibility between updates and original construction.',
      },
      {
        label: 'Newer development',
        explanation:
          'Newer areas may shift the review toward builder history, warranty status, HOA documents, lot exposure, commute route, and future municipal or nearby development context.',
      },
    ],
    practicalContext: [
      {
        label: 'If commuting matters',
        explanation:
          'Compare actual routes toward Boulder, Denver, and northern Front Range destinations at the times the household would use them. This guide does not certify commute performance.',
      },
      {
        label: 'If lot size matters',
        explanation:
          'Review how lot size, alley or driveway pattern, exterior exposure, irrigation, landscaping, and maintenance responsibilities affect the specific property.',
      },
      {
        label: 'If access to recreation matters',
        explanation:
          'Use parks, trails, open-space access, and regional recreation as questions to verify from the address, not as citywide conclusions.',
      },
    ],
    marketContext: [
      {
        label: 'Inventory structure',
        explanation:
          'Longmont inventory can include older detached homes, newer detached homes, attached options, and infill or redevelopment candidates. Compare like property types before drawing conclusions.',
      },
      {
        label: 'Employment and commercial influences',
        explanation:
          'Local employment centers, retail corridors, and regional access can influence buyer attention, but this page does not forecast demand or assign investment value.',
      },
      {
        label: 'Growth considerations',
        explanation:
          'Redevelopment and growth questions should be checked through municipal planning materials, property records, inspections, and advisor review before a buyer or seller relies on them.',
      },
    ],
    communityContext: [
      {
        label: 'Local character',
        explanation:
          'Longmont should be reviewed through property age, immediate surroundings, city services, commercial access, recreation access, and regional connections rather than demographic assumptions.',
      },
      {
        label: 'Evidence boundary',
        explanation:
          'The current page provides Enhanced Foundation citywide context. It does not replace neighborhood-level certification, property inspections, municipal research, or professional advice.',
      },
    ],
    buyerConsiderations: [
      {
        label: 'Before search',
        explanation:
          'Decide whether established area, newer construction, attached housing, lot pattern, or commute route matters most, then use search to test those criteria against actual inventory.',
      },
      {
        label: 'Before offer decisions',
        explanation:
          'Verify property records, age, systems, maintenance exposure, HOA documents where applicable, insurance questions, and municipal context through qualified sources.',
      },
    ],
    sellerConsiderations: [
      {
        label: 'Property differentiation',
        explanation:
          'Document updates, systems, lot features, location context, and maintenance history so buyers can compare the home against similar Longmont options without relying on broad city assumptions.',
      },
      {
        label: 'Preparation review',
        explanation:
          'Use local competition, condition documentation, presentation, and timing as advisor-review topics. This guide does not promise pricing results or market response.',
      },
    ],
    evidenceLimitations: [
      {
        label: 'Enhanced Foundation maturity',
        explanation:
          'This page is ENHANCED_FOUNDATION maturity. It adds durable city-specific context to governed market data, but it is not editorial, predictive, regulatory, or provider certification.',
      },
      {
        label: 'Qualified-source review',
        explanation:
          'Construction, insurance, environmental, title, municipal, and property-record questions should be verified through qualified sources or professionals before decisions are made.',
      },
      {
        label: 'No protected activation',
        explanation:
          'No AI, public GIS, telemetry, provider activation, ranking, valuation, school rating, safety rating, or investment guidance is used.',
      },
    ],
    tradeoffs: [
      {
        strength: 'Range of housing eras and product types',
        tradeoff: 'Buyers and sellers should compare property age, updates, systems, and lot context instead of relying on citywide labels.',
      },
      {
        strength: 'Boulder County and northern Front Range access',
        tradeoff: 'Actual route usefulness depends on address, timing, destination, and transportation assumptions that need separate review.',
      },
      {
        strength: 'Established areas and newer growth both appear in the city pattern',
        tradeoff: 'Redevelopment, municipal planning, and nearby construction questions require direct verification.',
      },
    ],
    verificationQuestions: [
      'If historic housing matters, what records, systems, remodel quality, and maintenance items need review for this property?',
      'If newer construction matters, what builder, warranty, HOA, lot, and nearby development questions should be verified?',
      'If commuting matters, which routes and travel times should be checked from the specific address?',
      'If access to recreation matters, which parks, trails, or open-space assumptions should be verified before relying on them?',
      'What property-specific due diligence belongs with a qualified inspector, insurance advisor, title professional, municipal source, or real estate advisor?',
    ],
  },
  denver: {
    key: 'denver',
    cityName: 'Denver',
    identityPattern:
      'large citywide decision market where housing type, age, density, transportation access, redevelopment, and local submarket conditions vary materially',
    summaryHeadline: 'Treat Denver as a citywide frame that requires local follow-up.',
    summaryIntro:
      'Denver guidance provides a governed citywide starting point while explicitly avoiding neighborhood rankings or unsupported submarket claims. Citywide context cannot replace address-level and neighborhood-level review.',
    distinctValue:
      'A large Colorado city with varied density, housing age, redevelopment patterns, transportation corridors, employment centers, and urban services',
    attentionValue:
      'Housing type, age, density, parking, transit or route access, redevelopment context, municipal requirements, and neighborhood-specific review',
    verificationValue:
      'Property records, title, zoning or municipal questions, inspection scope, insurance review, local submarket context, and advisor discussion',
    localCharacter: [
      {
        label: 'Development pattern',
        explanation:
          'Denver includes urban core, established residential areas, attached housing, multifamily settings, newer infill, and redevelopment corridors. A citywide page cannot substitute for local submarket review.',
      },
      {
        label: 'Transportation framework',
        explanation:
          'Decisions may involve highways, arterial streets, transit access, parking, bike or pedestrian access, and commute timing. Those assumptions should be checked from the specific address.',
      },
      {
        label: 'Municipal structure',
        explanation:
          'Denver property decisions can involve city permitting, records, zoning, historic-area considerations, or redevelopment context. Verify requirements through municipal and qualified professional sources.',
      },
    ],
    housingContext: [
      {
        label: 'Housing-type variation',
        explanation:
          'Denver includes detached homes, attached homes, condos, townhomes, multifamily-adjacent settings, and new or renovated inventory. Compare property type before interpreting market context.',
      },
      {
        label: 'Age and condition spread',
        explanation:
          'Older homes, remodeled properties, newer infill, and condominium buildings can carry different inspection, HOA, insurance, record, and maintenance questions.',
      },
      {
        label: 'Density and local setting',
        explanation:
          'Density, parking, street pattern, nearby commercial activity, and redevelopment can vary block by block. Verify the immediate context before relying on a citywide impression.',
      },
    ],
    practicalContext: [
      {
        label: 'If walkability matters',
        explanation:
          'Check the specific address, route comfort, daily destinations, parking context, and seasonal practicality. This guide does not rate walkability or rank locations.',
      },
      {
        label: 'If urban services matter',
        explanation:
          'Review access to services, transit, employment centers, retail corridors, and municipal resources based on the property location and daily pattern.',
      },
      {
        label: 'If historic housing matters',
        explanation:
          'Verify construction age, records, renovations, systems, historic-area considerations where applicable, and maintenance exposure through qualified review.',
      },
    ],
    marketContext: [
      {
        label: 'Citywide signal limitation',
        explanation:
          'Denver market context is a citywide orientation. It should not be used as a conclusion about any one neighborhood, building type, or property condition.',
      },
      {
        label: 'Redevelopment and density',
        explanation:
          'Redevelopment, infill, and density patterns may influence local comparison questions, but this page does not forecast demand or recommend investment actions.',
      },
      {
        label: 'Submarket variation',
        explanation:
          'Housing type, age, price band, parking, transit access, and local inventory can vary materially. Use citywide context to decide what to verify next.',
      },
    ],
    communityContext: [
      {
        label: 'Citywide context only',
        explanation:
          'Denver is internally diverse. This page intentionally avoids neighborhood-by-neighborhood claims, rankings, or suitability comparisons until governed local evidence supports them.',
      },
      {
        label: 'Local follow-up required',
        explanation:
          'Use search, property facts, existing Denver neighborhood context where available, municipal records, and advisor review to move from citywide orientation into a specific decision.',
      },
    ],
    buyerConsiderations: [
      {
        label: 'Before search',
        explanation:
          'Clarify whether property type, age, density, parking, commute route, transit access, outdoor space, or building structure matters most before narrowing inventory.',
      },
      {
        label: 'Before offer decisions',
        explanation:
          'Verify HOA documents, records, inspection scope, insurance questions, title items, municipal requirements, and local submarket context through qualified sources.',
      },
    ],
    sellerConsiderations: [
      {
        label: 'Presentation and documentation',
        explanation:
          'Document condition, updates, systems, HOA or building details where applicable, parking, outdoor space, and local setting so buyers can compare the property accurately.',
      },
      {
        label: 'Competition review',
        explanation:
          'Compare the home against similar Denver property types and locations without assuming citywide metrics determine response. Use advisor review before pricing or timing decisions.',
      },
    ],
    evidenceLimitations: [
      {
        label: 'Enhanced Foundation maturity',
        explanation:
          'This page is ENHANCED_FOUNDATION maturity. It adds durable citywide Denver context to governed market data, but it is not neighborhood certification, prediction, valuation, or regulatory advice.',
      },
      {
        label: 'Neighborhood review boundary',
        explanation:
          'Denver citywide context cannot substitute for neighborhood-level, building-level, property-record, title, inspection, insurance, municipal, or advisor review.',
      },
      {
        label: 'No protected activation',
        explanation:
          'No AI, public GIS, telemetry, provider activation, ranking, valuation, school rating, safety rating, or investment guidance is used.',
      },
    ],
    tradeoffs: [
      {
        strength: 'Broad range of urban and residential housing options',
        tradeoff: 'Property type, age, building structure, parking, and local context must be compared before conclusions are drawn.',
      },
      {
        strength: 'Access to employment centers, services, transit, and regional routes',
        tradeoff: 'Actual usefulness depends on address, route, timing, parking, and daily-use assumptions that require separate verification.',
      },
      {
        strength: 'Multiple development eras and redevelopment patterns',
        tradeoff: 'Municipal records, construction history, title, HOA, insurance, and inspection questions should be reviewed through qualified sources.',
      },
    ],
    verificationQuestions: [
      'If walkability matters, what routes, destinations, parking assumptions, and daily-use details should be checked from this address?',
      'If housing age matters, what systems, records, renovation history, and inspection questions need qualified review?',
      'If urban services matter, which transit, route, employment, retail, or municipal-access assumptions should be verified?',
      'If density or redevelopment matters, what nearby construction, zoning, title, HOA, or municipal records should be reviewed?',
      'What Denver-specific questions belong with a qualified inspector, insurance advisor, title professional, municipal source, or real estate advisor?',
    ],
  },
  superior: {
    key: 'superior',
    cityName: 'Superior',
    identityPattern:
      'Boulder County decision market where planned-community patterns, housing form, redevelopment context, regional access, and sensitive property-specific verification must be kept separate',
    summaryHeadline: 'Use Superior as a governed local decision with explicit verification boundaries.',
    summaryIntro:
      'Superior guidance reconciles the canonical city-market route before publishing Enhanced Foundation context. It remains citywide, non-predictive, and unable to certify specific property, hazard, insurance, or condition facts.',
    distinctValue:
      'A Boulder County municipality with planned-community patterns, established and newer housing, redevelopment and rebuilding context, regional access, and nearby-market relationships',
    attentionValue:
      'Housing age and form, rebuilt or redeveloped context, HOA documents, lot and drainage questions, transportation routes, municipal records, and property-specific condition review',
    verificationValue:
      'Property records, permits, disclosures, inspections, insurance review, HOA documents, public records, municipal sources, and qualified professional review',
    localCharacter: [
      {
        label: 'Development pattern',
        explanation:
          'Superior includes planned-community and established residential patterns, attached and detached housing, and areas where redevelopment or rebuilding context may affect the questions to verify.',
      },
      {
        label: 'Regional access',
        explanation:
          'Decisions often involve access toward Boulder County, nearby employment centers, US 36 corridor destinations, and adjoining communities. Actual usefulness depends on the address and daily pattern.',
      },
      {
        label: 'Geographic setting',
        explanation:
          'Open-space edges, topography, drainage, and local setting can matter for individual properties, but this citywide page does not certify conditions at any specific address.',
      },
    ],
    housingContext: [
      {
        label: 'Planned-community and varied housing',
        explanation:
          'Superior inventory can include planned neighborhoods, detached homes, attached homes, and newer or updated construction. Compare property type, age, HOA structure, records, and maintenance exposure before narrowing choices.',
      },
      {
        label: 'Rebuilding and redevelopment context',
        explanation:
          'Some properties may require extra attention to permits, construction history, disclosures, warranties, insurance review, and records. Verify those facts for the specific property through qualified sources.',
      },
      {
        label: 'Condition before assumptions',
        explanation:
          'Citywide context cannot determine roof, foundation, drainage, soil, environmental, structural, or insurance conditions. Treat each item as a question for records, inspections, insurers, municipalities, and qualified professionals.',
      },
    ],
    practicalContext: [
      {
        label: 'If commuting matters',
        explanation:
          'Compare routes toward Boulder, Denver, nearby employment centers, and regional services from the specific address. This guide does not certify commute performance.',
      },
      {
        label: 'If newer construction matters',
        explanation:
          'Review permits, builder or contractor history where available, warranty status, HOA documents, lot exposure, drainage, and municipal records before relying on surface presentation.',
      },
      {
        label: 'If access to recreation matters',
        explanation:
          'Use parks, open space, trail access, and local geography as address-specific questions to verify, not as citywide rankings or suitability conclusions.',
      },
    ],
    marketContext: [
      {
        label: 'Citywide signal limitation',
        explanation:
          'Superior market context is a citywide orientation. It should not be used as a conclusion about any one neighborhood, property type, rebuild status, or property condition.',
      },
      {
        label: 'Housing-type distribution',
        explanation:
          'Attached homes, detached homes, established properties, newer construction, and rebuilt or redeveloped properties can require different comparison sets and diligence questions.',
      },
      {
        label: 'Nearby-market relationships',
        explanation:
          'Superior decisions may be compared against Boulder County and nearby market alternatives, but this page does not forecast demand, recommend investment actions, or rank communities.',
      },
    ],
    communityContext: [
      {
        label: 'Citywide context only',
        explanation:
          'Superior should not be treated as one homogeneous answer. This page intentionally avoids neighborhood rankings, suitability comparisons, safety ratings, and unsupported neighborhood-level conclusions.',
      },
      {
        label: 'Sensitive context boundary',
        explanation:
          'Rebuilding, hazard, insurance, environmental, drainage, soil, structural, and property-condition topics must be verified through public records, municipalities, insurers, inspections, and qualified professionals.',
      },
    ],
    buyerConsiderations: [
      {
        label: 'Before search',
        explanation:
          'Clarify whether housing form, property age, HOA structure, commute route, lot context, rebuilt or redeveloped history, or access to daily services matters most before narrowing inventory.',
      },
      {
        label: 'Before offer decisions',
        explanation:
          'Verify records, disclosures, permits, construction history, inspection scope, insurance questions, HOA documents, title items, and municipal requirements through qualified sources.',
      },
    ],
    sellerConsiderations: [
      {
        label: 'Documentation matters',
        explanation:
          'Document condition, updates, permits, warranties where applicable, systems, HOA details, maintenance history, and property-specific context so buyers can compare the home accurately.',
      },
      {
        label: 'Competition review',
        explanation:
          'Compare the home against similar Superior property types and conditions without assuming citywide metrics determine response. Use advisor review before pricing or timing decisions.',
      },
    ],
    evidenceLimitations: [
      {
        label: 'Enhanced Foundation maturity',
        explanation:
          'This page is ENHANCED_FOUNDATION maturity. It adds durable Superior context to governed market data, but it is not neighborhood certification, prediction, valuation, regulatory advice, hazard certification, or insurance advice.',
      },
      {
        label: 'Sensitive-context verification',
        explanation:
          'Wildfire, rebuilding, insurance, environmental, soil, drainage, structural, title, municipal, and property-record questions should be verified through qualified sources or professionals before decisions are made.',
      },
      {
        label: 'No protected activation',
        explanation:
          'No AI, public GIS, telemetry, provider activation, ranking, valuation, school rating, safety rating, hazard service, or investment guidance is used.',
      },
    ],
    tradeoffs: [
      {
        strength: 'Planned-community structure and Boulder County context',
        tradeoff: 'HOA documents, municipal records, lot context, and property-specific records still require direct review.',
      },
      {
        strength: 'Established, newer, and rebuilt or redeveloped housing contexts may coexist',
        tradeoff: 'Construction history, permits, warranties, inspections, insurance questions, and disclosures should be verified by property.',
      },
      {
        strength: 'Regional access to Boulder County and nearby markets',
        tradeoff: 'Actual usefulness depends on address, route, timing, destination, and daily-use assumptions that require separate verification.',
      },
    ],
    verificationQuestions: [
      'If commuting matters, which routes, destinations, and time-of-day assumptions should be checked from this address?',
      'If newer construction or rebuilding context matters, what permits, warranties, disclosures, contractor history, and municipal records should be verified?',
      'If lot or geographic context matters, what drainage, soil, environmental, open-space edge, or exterior-exposure questions belong with qualified professionals?',
      'If HOA structure matters, what documents, reserves, rules, insurance, fees, and maintenance responsibilities should be reviewed?',
      'What Superior-specific due diligence belongs with a qualified inspector, insurance advisor, title professional, municipal source, public-record source, HOA document review, or real estate advisor?',
    ],
  },
  westminster: {
    key: 'westminster',
    cityName: 'Westminster',
    identityPattern:
      'northwest metro decision market where housing age, city geography, regional corridors, attached and detached options, and jurisdictional due diligence should be evaluated separately',
    summaryHeadline: 'Use Westminster as a structured local decision across different city contexts.',
    summaryIntro:
      'Westminster guidance now adds durable local context to the certified foundation route. It remains non-predictive, limitation-forward, and dependent on property-specific verification.',
    distinctValue:
      'A northwest metro city with varied housing eras, attached and detached options, regional transportation corridors, commercial centers, recreation access, and county-context questions',
    attentionValue:
      'Property age, housing form, location within the city, corridor access, HOA structure, municipal and county records, maintenance exposure, and property-specific condition review',
    verificationValue:
      'Property records, systems and remodel history, HOA documents where applicable, municipal and county requirements, insurance questions, commute assumptions, and advisory review',
    localCharacter: [
      {
        label: 'Metro corridor context',
        explanation:
          'Westminster decisions can involve access toward Denver, Boulder, Broomfield, and northwest metro corridors. Route usefulness depends on address, timing, destination, and daily-use assumptions.',
      },
      {
        label: 'Development pattern',
        explanation:
          'Westminster includes established residential areas, attached housing, newer or updated homes, commercial corridors, and recreation-adjacent settings. Compare the immediate setting before relying on citywide context.',
      },
      {
        label: 'Jurisdictional review',
        explanation:
          'Property decisions may involve city records and county context. Verify permits, title, taxes, services, HOA obligations where applicable, and property records for the specific address.',
      },
    ],
    housingContext: [
      {
        label: 'Mixed housing eras',
        explanation:
          'Westminster inventory can include older homes, established subdivisions, townhomes, condos, and newer or renovated properties. Compare property type, age, systems, HOA structure, and maintenance exposure before narrowing options.',
      },
      {
        label: 'Established and updated properties',
        explanation:
          'Established homes may raise questions about systems, remodel quality, exterior condition, drainage, and records. Updated homes should still be reviewed for permit history, workmanship, disclosures, and inspection scope.',
      },
      {
        label: 'Location tradeoffs',
        explanation:
          'Properties can sit closer to regional corridors, commercial centers, open-space or recreation access, transit-oriented areas, or quieter residential interiors. Verify the practical effect from the address rather than treating the city as uniform.',
      },
    ],
    practicalContext: [
      {
        label: 'If commuting matters',
        explanation:
          'Compare actual routes toward Denver, Boulder, Broomfield, and northwest metro destinations at the times they would be used. This guide does not certify commute performance.',
      },
      {
        label: 'If urban services matter',
        explanation:
          'Review access to services, retail corridors, transit or route options, recreation, and municipal resources based on the property location and daily pattern.',
      },
      {
        label: 'If established housing matters',
        explanation:
          'Verify construction age, systems, remodel history, exterior condition, drainage, insurance questions, and maintenance exposure through records and qualified review.',
      },
    ],
    marketContext: [
      {
        label: 'Inventory structure',
        explanation:
          'Westminster market context can span different housing forms, age bands, and local settings. Compare similar property types before drawing conclusions from a citywide inventory signal.',
      },
      {
        label: 'Transportation and commercial influences',
        explanation:
          'Regional corridors, employment access, commercial centers, transit options, and recreation access can influence buyer attention, but this page does not forecast demand or assign investment value.',
      },
      {
        label: 'Municipal and county verification',
        explanation:
          'Planning, permitting, records, HOA, county, and jurisdictional questions should be checked through municipal or county sources, documents, inspections, and advisor review before decisions are made.',
      },
    ],
    communityContext: [
      {
        label: 'Local character',
        explanation:
          'Westminster should be reviewed through property age, immediate surroundings, city services, commercial access, recreation access, county context, and regional connections rather than demographic assumptions.',
      },
      {
        label: 'Evidence boundary',
        explanation:
          'The current page provides Enhanced Foundation citywide context. It does not replace property inspections, municipal or county research, title review, insurance review, or professional advice.',
      },
    ],
    buyerConsiderations: [
      {
        label: 'Before search',
        explanation:
          'Decide whether housing form, property age, commute route, HOA structure, location within the city, recreation access, or proximity to daily services matters most, then use search to test those criteria against active inventory.',
      },
      {
        label: 'Before offer decisions',
        explanation:
          'Verify records, condition, systems, HOA documents where applicable, municipal and county requirements, insurance questions, route assumptions, and local setting through qualified sources.',
      },
    ],
    sellerConsiderations: [
      {
        label: 'Property differentiation',
        explanation:
          'Document updates, systems, HOA details where applicable, location context, lot features, maintenance history, and relevant records so buyers can compare the home against similar Westminster options.',
      },
      {
        label: 'Preparation review',
        explanation:
          'Use local competition, property condition, presentation, documentation, and timing as advisor-review topics. This guide does not promise pricing results or market response.',
      },
    ],
    evidenceLimitations: [
      {
        label: 'Enhanced Foundation maturity',
        explanation:
          'This page is ENHANCED_FOUNDATION maturity. It adds durable Westminster context to governed market data, but it is not editorial, predictive, regulatory, or provider certification.',
      },
      {
        label: 'Qualified-source review',
        explanation:
          'Construction, insurance, environmental, title, municipal, county, HOA, and property-record questions should be verified through qualified sources or professionals before decisions are made.',
      },
      {
        label: 'No protected activation',
        explanation:
          'No AI, public GIS, telemetry, provider activation, ranking, valuation, school rating, safety rating, or investment guidance is used.',
      },
    ],
    tradeoffs: [
      {
        strength: 'Varied northwest metro access and housing options',
        tradeoff: 'Property type, age, route assumptions, HOA obligations, and local setting must be compared before conclusions are drawn.',
      },
      {
        strength: 'Established areas, updated homes, and attached options can coexist',
        tradeoff: 'Systems, remodel history, exterior condition, records, and maintenance exposure should be verified by property.',
      },
      {
        strength: 'Commercial, recreation, and regional corridor access can be decision factors',
        tradeoff: 'Actual usefulness depends on address, timing, destination, and daily pattern rather than citywide labels.',
      },
    ],
    verificationQuestions: [
      'If commuting matters, which routes, destinations, transit or parking assumptions, and time-of-day details should be checked from the specific address?',
      'If established housing matters, what systems, remodel quality, exterior, drainage, and maintenance records need review?',
      'If urban services matter, which commercial, recreation, municipal, transit, and daily-use assumptions should be verified?',
      'If county or municipal context matters, what jurisdiction, title, tax, service, permit, HOA, or record questions should be verified?',
      'What Westminster-specific due diligence belongs with a qualified inspector, insurance advisor, title professional, municipal or county source, HOA document review, or real estate advisor?',
    ],
  },
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function slugifyCity(value: string) {
  return normalize(value).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function isEditorialDecisionGuideKey(key: DecisionGuideKey): key is EditorialDecisionGuideKey {
  return key === 'boulder' || key === 'louisville' || key === 'lafayette';
}

function isEnhancedFoundationDecisionGuideKey(key: DecisionGuideKey): key is EnhancedFoundationDecisionGuideKey {
  return key === 'broomfield' || key === 'erie' || key === 'longmont' || key === 'denver' || key === 'superior' || key === 'westminster';
}

function getEditorialDecisionGuideKey(city: CityData): EditorialDecisionGuideKey | null {
  const normalizedCityName = normalize(city.name);

  if (normalizedCityName === 'boulder') return 'boulder';
  if (normalizedCityName === 'louisville') return 'louisville';
  if (normalizedCityName === 'lafayette') return 'lafayette';

  return null;
}

export function getDecisionGuideKey(city: CityData, eligibility?: DecisionGuideEligibility | null): DecisionGuideKey | null {
  if (eligibility) {
    if (!eligibility.publicEligibility) return null;
    return slugifyCity(city.name);
  }

  return getEditorialDecisionGuideKey(city);
}

function buildFoundationDecisionGuide({
  city,
  cityNeighborhoods,
  marketSignal,
  guideKey,
  maturity,
}: {
  city: CityData;
  cityNeighborhoods: Neighborhood[];
  marketSignal: string;
  guideKey: DecisionGuideKey;
  maturity: DecisionGuideMaturity;
}): DecisionGuide {
  const hasNeighborhoodEvidence = cityNeighborhoods.length > 0;
  const anchors = cityNeighborhoods
    .slice(0, 4)
    .map((neighborhood) => neighborhood.primaryAnchor)
    .join(', ');
  const housingEras = Array.from(new Set(cityNeighborhoods.map((neighborhood) => neighborhood.era))).slice(0, 3);
  const evidenceLabel = maturity === 'EVIDENCE_BACKED' ? 'Evidence-backed' : 'Foundation';

  return {
    key: guideKey,
    maturity,
    publicEligibility: true,
    cityName: city.name,
    identity: `${city.name} is published as a ${evidenceLabel.toLowerCase()} Colorado Decision Guide using governed city-market data, existing search continuity, and standard verification language. Use it as a starting point, then confirm property-specific facts before narrowing into individual homes.`,
    decisionSnapshot: {
      whereAmI: `${city.name} foundation Local Decision Intelligence.`,
      mattersMost: 'Use the city market signal as orientation before narrowing into properties.',
      payAttention: 'Price, inventory, timing, property facts, financing readiness, and the absence of certified neighborhood interpretation.',
      verify: 'Confirm individual listing facts, disclosures, records, condition, costs, insurance questions, and advisor context before acting.',
      bestNextStep: `Search ${city.name} homes with market context, then bring specific property questions into advisor review.`,
    },
    summaryEyebrow: `${city.name} Decision Summary`,
    summaryHeadline: `Start with a bounded ${city.name} decision foundation.`,
    summaryIntro:
      'This guide uses repository-supported city data and standard Decision Guide structure. It does not add unsupported local interpretation, rankings, predictions, or demographic guidance.',
    neighborhoodsEyebrow: hasNeighborhoodEvidence ? `Explore ${city.name} Neighborhoods` : `${city.name} Neighborhood Evidence`,
    neighborhoodsHeadline: hasNeighborhoodEvidence ? 'Move from city question to local context.' : 'Neighborhood-specific guide evidence is not yet certified.',
    neighborhoodSectionId: `${guideKey}-neighborhoods`,
    continuitySurface: `${guideKey}-decision-guide-continuity`,
    decisionSummary: [
      {
        label: `What distinguishes ${city.name}`,
        value: 'A governed Colorado city market with search and market continuity',
        explanation: `${city.name} has a valid market route, supported search path, and repository-local market statistics for a foundation-level Decision Guide.`,
      },
      {
        label: 'What deserves attention',
        value: 'Price, inventory, market signal, property facts, and next-step verification',
        explanation: `Current market context shows ${city.stats.medianPrice} median price, ${city.stats.inventory} active inventory signal, and ${marketSignal.toLowerCase()} as the current city-market interpretation.`,
      },
      {
        label: 'What to verify',
        value: 'Property records, condition, costs, financing readiness, and advisor questions',
        explanation:
          'Use the city guide as a decision starting point, then verify listing facts, disclosures, inspection findings, insurance questions, financing preparation, and advisor guidance before acting.',
      },
    ],
    housingContext: [
      {
        label: hasNeighborhoodEvidence ? 'Repository-supported housing evidence' : 'Foundation housing context',
        explanation: hasNeighborhoodEvidence
          ? `${city.name} neighborhood records include ${housingEras.join(', ') || 'repository-supported'} housing patterns and local anchors including ${anchors}. Treat those signals as starting evidence, not complete property diligence.`
          : `${city.name} does not yet have certified neighborhood-level housing interpretation in the repository. Compare age, condition, systems, lot context, records, and maintenance history at the individual property level.`,
      },
      {
        label: 'Local interpretation status',
        explanation:
          maturity === 'EVIDENCE_BACKED'
            ? 'Neighborhood evidence exists, but the guide should still avoid city-wide assumptions and move customers toward specific records and property review.'
            : 'Foundation-level guides intentionally avoid unsupported city-specific interpretation until editorial review or additional governed knowledge is available.',
      },
      {
        label: 'Condition before assumptions',
        explanation:
          'Property age, remodel history, roof condition, drainage, exterior exposure, mechanical systems, lot context, and records review can change the questions that matter for a specific home.',
      },
    ],
    practicalContext: [
      {
        label: 'Access relationships',
        explanation:
          'Evaluate the relationship between the property, work patterns, daily routes, city services, open-space or neighborhood access where relevant, and the places used most often.',
      },
      {
        label: 'Property-specific criteria',
        explanation:
          `${city.name} should not be treated as one uniform answer. Compare individual properties, local context, and daily-use assumptions before deciding whether a home deserves more attention.`,
      },
      {
        label: 'Research discipline',
        explanation:
          'Use market context, search results, property records, disclosures, inspection review, insurance questions, financing preparation, and advisor discussion as separate evidence layers.',
      },
    ],
    marketContext: [
      {
        label: 'Current market signal',
        explanation: `${city.name} is represented with governed city-market data, including ${city.stats.medianPrice} median price context, ${city.stats.inventory} inventory signal, and ${marketSignal.toLowerCase()}.`,
      },
      {
        label: 'How to use the signal',
        explanation:
          'Treat market context as orientation for search discipline and seller preparation. It is not a forecast, valuation, ranking, or statement about a specific property.',
      },
    ],
    communityContext: [
      {
        label: hasNeighborhoodEvidence ? 'Neighborhood continuity' : 'Foundation community context',
        explanation: hasNeighborhoodEvidence
          ? `${city.name} has existing governed neighborhood paths that can help customers move from city context into local anchors.`
          : `${city.name} does not yet have certified neighborhood-level community interpretation in the repository, so community context must stay broad and verification-focused.`,
      },
      {
        label: 'Assumptions to avoid',
        explanation:
          'Do not treat a city name as a complete answer. Access, property condition, costs, records, and daily-use assumptions still need property-specific review.',
      },
    ],
    buyerConsiderations: [
      {
        label: 'Before search',
        explanation:
          'Use the foundation guide to decide whether the city market context is relevant enough to open active inventory.',
      },
      {
        label: 'Before touring',
        explanation:
          'Compare each property against records, condition, costs, financing readiness, and the questions this guide surfaces.',
      },
    ],
    sellerConsiderations: [
      {
        label: 'Before pricing',
        explanation:
          'Use the city signal to frame preparation questions, but do not treat it as a property valuation or pricing recommendation.',
      },
      {
        label: 'Before requesting review',
        explanation:
          'Bring property condition, timing, competing inventory, and preparation questions into a seller strategy conversation.',
      },
    ],
    evidenceLimitations: [
      {
        label: 'Foundation maturity',
        explanation:
          'This page is FOUNDATION maturity. It uses existing governed city data and standard verification language without claiming complete local authority.',
      },
      {
        label: 'No protected activation',
        explanation:
          'No AI, public GIS, telemetry, provider activation, ranking, valuation, school rating, safety rating, or investment guidance is used.',
      },
    ],
    tradeoffs: [
      {
        strength: 'Clear starting point with governed city market and search continuity',
        tradeoff: 'Foundation guidance should not replace neighborhood-specific review, property condition diligence, or advisor discussion.',
      },
      {
        strength: 'Fast path from city context into search and property review',
        tradeoff: 'Customers should verify facts, costs, records, and financing readiness before comparing homes too narrowly.',
      },
      {
        strength: 'Standardized Decision Guide structure across eligible Colorado cities',
        tradeoff: 'City-specific interpretation remains limited unless repository evidence and editorial review support it.',
      },
    ],
    verificationQuestions: [
      `What does the current ${city.name} market context change about my search or preparation questions?`,
      'Which property facts, records, disclosures, costs, insurance questions, and condition items should be verified first?',
      'Does this home deserve more attention based on evidence, or only because it matched a broad search filter?',
      'Which search, market, property, buyer, seller, financing, or Grand Plan step should I use next?',
    ],
  };
}

function buildEnhancedFoundationDecisionGuide({
  city,
  marketSignal,
  guideKey,
}: {
  city: CityData;
  marketSignal: string;
  guideKey: EnhancedFoundationDecisionGuideKey;
}): DecisionGuide {
  const config = ENHANCED_FOUNDATION_CITY_CONFIGS[guideKey];

  return {
    key: config.key,
    maturity: 'ENHANCED_FOUNDATION',
    publicEligibility: true,
    cityName: city.name,
    identity: `${city.name} is published as an Enhanced Foundation Local Decision Intelligence guide: ${config.identityPattern}. It is a decision starting point, not a forecast, valuation, ranking, or substitute for property-specific review.`,
    decisionSnapshot: {
      whereAmI: `${city.name} Enhanced Foundation Local Decision Intelligence.`,
      mattersMost: config.distinctValue,
      payAttention: config.attentionValue,
      verify: config.verificationValue,
      bestNextStep: `Search ${city.name} homes with market context, then bring address-specific questions into advisor review.`,
    },
    summaryEyebrow: `${city.name} Decision Snapshot`,
    summaryHeadline: config.summaryHeadline,
    summaryIntro: config.summaryIntro,
    neighborhoodsEyebrow: `${city.name} Local Context`,
    neighborhoodsHeadline:
      city.name === 'Denver'
        ? 'Use citywide context before neighborhood-level review.'
        : 'Move from citywide context into property-level review.',
    neighborhoodSectionId: `${guideKey}-neighborhoods`,
    continuitySurface: `${guideKey}-decision-guide-continuity`,
    decisionSummary: [
      {
        label: `What materially shapes ${city.name}`,
        value: config.distinctValue,
        explanation: `Current market context shows ${city.stats.medianPrice} median price, ${city.stats.inventory} active inventory signal, and ${marketSignal.toLowerCase()} as bounded citywide orientation.`,
      },
      {
        label: 'What deserves deeper review',
        value: config.attentionValue,
        explanation:
          'Use the citywide signal to decide what to investigate next, then separate property condition, records, municipal questions, insurance review, and advisor context.',
      },
      {
        label: 'What the platform can conclude',
        value: 'Citywide context is useful, but property-specific conclusions require more evidence',
        explanation:
          'The platform can organize durable local considerations and market orientation. It cannot certify a specific property condition, forecast an outcome, rank locations, or replace qualified review.',
      },
    ],
    housingContext: config.housingContext,
    practicalContext: config.practicalContext,
    marketContext: config.marketContext,
    communityContext: [...config.localCharacter, ...config.communityContext],
    buyerConsiderations: config.buyerConsiderations,
    sellerConsiderations: config.sellerConsiderations,
    evidenceLimitations: config.evidenceLimitations,
    tradeoffs: config.tradeoffs,
    verificationQuestions: config.verificationQuestions,
  };
}

export function buildDecisionGuideEvidenceTransparency(guide: {
  key: EditorialDecisionGuideKey;
  cityName: string;
}): DecisionGuideEvidenceTransparency {
  return {
    contract: DECISION_GUIDE_EVIDENCE_TRANSPARENCY,
    maturityLabel: 'Editorially Certified',
    maturityExplanation:
      'Editorially Certified means this guide has passed the platform\'s governed editorial and product review. It is not a guarantee, ranking, recommendation, or statement that every topic has complete evidence.',
    heading: 'How to read this guide',
    introduction: `${guide.cityName} guidance is a structured decision aid. It explains city context, trade-offs, and questions to verify while preserving limits around evidence, timing, property facts, and professional review.`,
    items: [
      {
        dimension: 'geographic-scope',
        label: 'Citywide scope',
        explanation:
          'Guide context is generally citywide. Neighborhoods, subdivisions, HOAs, districts, overlapping jurisdictions, and individual properties may differ and still need their own review.',
      },
      {
        dimension: 'evidence-scope',
        label: 'Topic support varies',
        explanation:
          'Some topics have direct support, while others are contextual or incomplete. Missing information is not proof that a condition does or does not exist.',
      },
      {
        dimension: 'recency',
        label: 'Timing can vary',
        explanation:
          'Information may reflect different observation or effective dates. Current market, municipal, financing, and property conditions should be verified when timing matters.',
      },
      {
        dimension: 'source-use-boundary',
        label: 'Public-use boundary',
        explanation:
          'REIE presents only information it is permitted to show publicly. Some material may be summarized, limited, internally reviewed, unavailable, or excluded from public display.',
      },
      {
        dimension: 'conflict-uncertainty',
        label: 'Unresolved information',
        explanation:
          'Public sources and records may differ. When support conflicts or remains unavailable, the guide preserves that uncertainty instead of choosing an unsupported answer.',
      },
      {
        dimension: 'property-professional-boundary',
        label: 'Property and professional review',
        explanation:
          'City context does not establish condition, title, insurance, structural, environmental, HOA, municipal, permit, value, financing, legal, tax, inspection, engineering, or appraisal conclusions.',
      },
    ],
    decisionBoundary:
      'Use this guide to prepare better questions. It does not decide whether a city, neighborhood, property, listing decision, financing path, or investment outcome is appropriate for a person.',
    nextStepGuidance:
      'Continue with city search, buyer guidance, seller guidance, financing guidance, Grand Plan, or advisory support when a question needs property-specific or qualified review.',
  };
}

export function buildDecisionGuide({
  city,
  cityNeighborhoods,
  marketSignal,
  eligibility,
}: {
  city: CityData;
  cityNeighborhoods: Neighborhood[];
  marketSignal: string;
  eligibility?: DecisionGuideEligibility | null;
}): DecisionGuide | null {
  const guideKey = getDecisionGuideKey(city, eligibility);
  if (!guideKey) return null;

  const guideMaturity = eligibility?.guideMaturity ?? 'EDITORIALLY_CERTIFIED';
  const publicEligibility = eligibility?.publicEligibility ?? true;
  if (!publicEligibility) return null;

  if (guideMaturity === 'ENHANCED_FOUNDATION' && isEnhancedFoundationDecisionGuideKey(guideKey)) {
    return buildEnhancedFoundationDecisionGuide({
      city,
      marketSignal,
      guideKey,
    });
  }

  if (!isEditorialDecisionGuideKey(guideKey)) {
    return buildFoundationDecisionGuide({
      city,
      cityNeighborhoods,
      marketSignal,
      guideKey,
      maturity: guideMaturity,
    });
  }

  const config = DECISION_GUIDE_CITY_CONFIGS[guideKey];
  const anchors = cityNeighborhoods
    .slice(0, 4)
    .map((neighborhood) => neighborhood.primaryAnchor)
    .join(', ');
  const housingEras = Array.from(new Set(cityNeighborhoods.map((neighborhood) => neighborhood.era))).slice(0, 3);

  return {
    key: config.key,
    maturity: guideMaturity,
    publicEligibility,
    cityName: city.name,
    identity: `${city.name} should be evaluated as a ${config.identityPattern} before a customer narrows into individual homes.`,
    decisionSnapshot: {
      whereAmI: `${city.name} editorially certified Local Decision Intelligence.`,
      mattersMost: config.distinctValue,
      payAttention: config.attentionValue,
      verify: config.verificationValue,
      bestNextStep: `Compare ${city.name} neighborhood context, search active homes, or bring specific questions into advisory review.`,
    },
    summaryEyebrow: `${city.name} Decision Summary`,
    summaryHeadline: config.summaryHeadline,
    summaryIntro: config.summaryIntro,
    neighborhoodsEyebrow: `Explore ${city.name} Neighborhoods`,
    neighborhoodsHeadline: 'Move from city question to local context.',
    neighborhoodSectionId: `${config.key}-neighborhoods`,
    continuitySurface: `${config.key}-decision-guide-continuity`,
    decisionSummary: [
      {
        label: `What distinguishes ${city.name}`,
        value: config.distinctValue,
        explanation: `${cityNeighborhoods.length} governed neighborhood paths connect city context to local anchors including ${anchors}.`,
      },
      {
        label: 'What deserves attention',
        value: config.attentionValue,
        explanation: `Current market context shows ${city.stats.medianPrice} median price, ${city.stats.inventory} active inventory signal, and ${marketSignal.toLowerCase()} as the current city-market interpretation.`,
      },
      {
        label: 'What to verify',
        value: config.verificationValue,
        explanation: config.verificationExplanation,
      },
    ],
    housingContext: [
      {
        label: config.housingPatternLabel,
        explanation: `${city.name} neighborhood records include ${housingEras.join(', ') || config.housingPatternFallback} housing patterns. Compare remodel quality, systems age, drainage, roof condition, and exterior maintenance before relying on surface presentation.`,
      },
      {
        label: config.housingVariationLabel,
        explanation: config.housingVariationExplanation,
      },
      {
        label: 'Condition before assumptions',
        explanation: config.conditionExplanation,
      },
    ],
    practicalContext: [
      {
        label: 'Access relationships',
        explanation: config.accessExplanation,
      },
      {
        label: config.specificityLabel,
        explanation: config.specificityExplanation,
      },
      {
        label: 'Research discipline',
        explanation: config.researchExplanation,
      },
    ],
    marketContext: [
      {
        label: 'Current market signal',
        explanation: `Current market context shows ${city.stats.medianPrice} median price, ${city.stats.inventory} active inventory signal, and ${marketSignal.toLowerCase()} as the city-market interpretation.`,
      },
      {
        label: 'How to use the signal',
        explanation:
          'Use the signal to compare timing, inventory, preparation, and search discipline. It does not replace property-specific verification.',
      },
    ],
    communityContext: [
      {
        label: 'Local decision context',
        explanation: config.accessExplanation,
      },
      {
        label: 'Assumptions to avoid',
        explanation: config.specificityExplanation,
      },
    ],
    buyerConsiderations: [
      {
        label: 'Before search',
        explanation:
          'Use the guide to decide which neighborhood pattern and property questions should shape active inventory review.',
      },
      {
        label: 'Before touring',
        explanation:
          'Compare property facts, records, condition, financing readiness, and daily-use assumptions before giving a home more attention.',
      },
    ],
    sellerConsiderations: [
      {
        label: 'Before pricing',
        explanation:
          'Use the city and neighborhood context to frame preparation and competing-inventory questions, not as a valuation conclusion.',
      },
      {
        label: 'Before requesting review',
        explanation:
          'Bring property condition, timing, location context, and preparation questions into a seller strategy conversation.',
      },
    ],
    evidenceLimitations: [
      {
        label: 'Editorial certification',
        explanation:
          'This guide is editorially certified for local decision framing, but individual property facts, costs, records, disclosures, and financing assumptions still require verification.',
      },
      {
        label: 'No protected activation',
        explanation:
          'No AI, public GIS, telemetry, provider activation, ranking, valuation, school rating, safety rating, or investment guidance is used.',
      },
    ],
    evidenceTransparency: buildDecisionGuideEvidenceTransparency({
      key: config.key,
      cityName: city.name,
    }),
    tradeoffs: config.tradeoffs,
    verificationQuestions: config.verificationQuestions,
  };
}

export function buildDecisionGuideContinuityLinks({
  guide,
  marketHref,
  searchHref,
}: {
  guide: DecisionGuide;
  marketHref: string;
  searchHref: string;
}): readonly DecisionGuideContinuityLink[] {
  const baseLinks: readonly DecisionGuideContinuityLink[] = [
    { label: 'Market Context', href: marketHref, destination: 'market' },
    { label: `Search ${guide.cityName} Homes`, href: searchHref, destination: 'city-search' },
    { label: 'Buyer Guidance', href: '/buy', destination: 'buyer-guidance' },
    { label: 'Seller Guidance', href: '/sell', destination: 'seller-guidance' },
    { label: 'Financing Guidance', href: '/buy#financing-confidence', destination: 'financing-confidence' },
    { label: 'Grand Plan', href: '/grand-plan', destination: 'grand-plan' },
    { label: 'Advisory Guidance', href: '/contact', destination: 'advisory' },
  ];

  return baseLinks;
}
