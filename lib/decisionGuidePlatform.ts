import type { CityData } from './cities.js';
import type { Neighborhood } from './neighborhoods.js';

export type DecisionGuideKey = 'boulder' | 'louisville' | 'lafayette';

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

export type DecisionGuide = {
  key: DecisionGuideKey;
  cityName: string;
  identity: string;
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
  tradeoffs: DecisionGuideTradeoff[];
  verificationQuestions: string[];
};

type DecisionGuideCityConfig = {
  key: DecisionGuideKey;
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

export const DECISION_GUIDE_FRAMEWORK = 'context-tradeoffs-questions-evidence-next-step';
export const DECISION_GUIDE_SOURCE = 'governed-city-and-neighborhood-data';

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

export const DECISION_GUIDE_CITY_CONFIGS: Record<DecisionGuideKey, DecisionGuideCityConfig> = {
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
        tradeoff: 'Customers should compare micro-location, property condition, and access needs instead of assuming city-wide fit.',
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
      'Which Boulder neighborhood pattern best matches the way I would use the city day to day?',
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
    attentionValue: 'Price, inventory, neighborhood fit, condition, and daily access',
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
        tradeoff: 'Customers should compare micro-location, property condition, and daily route needs instead of assuming city-wide fit.',
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
      'Which Louisville neighborhood pattern best matches the way I would use the city day to day?',
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
        tradeoff: 'Customers should compare micro-location, property condition, and daily route needs instead of assuming city-wide fit.',
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
      'Which Lafayette neighborhood pattern best matches the way I would use the city day to day?',
      'What property-specific condition, records, insurance, cost, or financing-readiness questions should be answered before I compare this home against alternatives?',
      'Does the current market signal change my search discipline or seller-preparation plan without creating urgency?',
      'Which neighborhood page, market evidence, property facts, financing preparation items, and advisor questions should I review before the next step?',
    ],
  },
};

export function getDecisionGuideKey(city: CityData): DecisionGuideKey | null {
  const normalizedCityName = city.name.trim().toLowerCase();

  if (normalizedCityName === 'boulder') return 'boulder';
  if (normalizedCityName === 'louisville') return 'louisville';
  if (normalizedCityName === 'lafayette') return 'lafayette';

  return null;
}

export function buildDecisionGuide({
  city,
  cityNeighborhoods,
  marketSignal,
}: {
  city: CityData;
  cityNeighborhoods: Neighborhood[];
  marketSignal: string;
}): DecisionGuide | null {
  const guideKey = getDecisionGuideKey(city);
  if (!guideKey) return null;

  const config = DECISION_GUIDE_CITY_CONFIGS[guideKey];
  const anchors = cityNeighborhoods
    .slice(0, 4)
    .map((neighborhood) => neighborhood.primaryAnchor)
    .join(', ');
  const housingEras = Array.from(new Set(cityNeighborhoods.map((neighborhood) => neighborhood.era))).slice(0, 3);

  return {
    key: config.key,
    cityName: city.name,
    identity: `${city.name} should be evaluated as a ${config.identityPattern} before a customer narrows into individual homes.`,
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
}) {
  return [
    { label: 'Market Context', href: marketHref, destination: 'market' },
    { label: `Search ${guide.cityName} Homes`, href: searchHref, destination: 'search' },
    { label: 'Buyer Guidance', href: '/buy', destination: 'search' },
    { label: 'Seller Guidance', href: '/sell', destination: 'seller' },
    { label: 'Financing Guidance', href: '/buy#financing-confidence', destination: 'inquiry' },
    { label: 'Grand Plan', href: '/grand-plan', destination: 'inquiry' },
  ] as const;
}
