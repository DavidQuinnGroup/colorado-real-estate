import type { CityData } from './cities.js';
import type { Neighborhood } from './neighborhoods.js';

export type DecisionGuideKey = string;
type EditorialDecisionGuideKey = 'boulder' | 'louisville' | 'lafayette';
export type DecisionGuideMaturity = 'FOUNDATION' | 'EVIDENCE_BACKED' | 'EDITORIALLY_CERTIFIED';

export type DecisionGuideEligibility = {
  guideMaturity: DecisionGuideMaturity;
  publicEligibility: boolean;
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

export type DecisionGuide = {
  key: DecisionGuideKey;
  maturity: DecisionGuideMaturity;
  publicEligibility: boolean;
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

export const DECISION_GUIDE_FRAMEWORK = 'context-tradeoffs-questions-evidence-next-step';
export const DECISION_GUIDE_SOURCE = 'governed-city-and-neighborhood-data';
export const DECISION_GUIDE_FOUNDATION_SOURCE = 'governed-city-market-registry';

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
      'Which Lafayette neighborhood pattern best matches the way I would use the city day to day?',
      'What property-specific condition, records, insurance, cost, or financing-readiness questions should be answered before I compare this home against alternatives?',
      'Does the current market signal change my search discipline or seller-preparation plan without creating urgency?',
      'Which neighborhood page, market evidence, property facts, financing preparation items, and advisor questions should I review before the next step?',
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
