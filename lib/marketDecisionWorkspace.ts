export type MarketDecisionWorkspaceInput = {
  scope: 'state' | 'city' | 'neighborhood';
  name: string;
  city?: string;
  marketSignal: string;
  competitivenessSignal: string;
  timingSignal: string;
  pricingSignal?: string;
  inventorySignal?: string;
  neighborhoodCount?: number;
  resilienceSignal?: string;
  searchHref: string;
  marketHref: string;
  sellerHref?: string;
};

export type MarketDecisionWorkspaceItem = {
  lens: 'market-type' | 'buyer' | 'seller' | 'attention' | 'decision';
  label: string;
  explanation: string;
  action: string;
  href: string;
};

export type MarketDecisionWorkspace = {
  headline: string;
  orientation: string;
  trustBoundary: string;
  items: MarketDecisionWorkspaceItem[];
};

function getScopeLabel(input: MarketDecisionWorkspaceInput) {
  if (input.scope === 'state') return 'Colorado market path';
  if (input.scope === 'neighborhood') return `${input.name} neighborhood context`;
  return `${input.name} market context`;
}

function getBuyerExplanation(input: MarketDecisionWorkspaceInput) {
  const timing = input.timingSignal.toLowerCase();

  if (timing.includes('quick')) {
    return 'Buyers should prepare questions and financing assumptions before touring so speed does not replace diligence.';
  }

  if (timing.includes('diligence')) {
    return 'Buyers can use the additional time signal to compare condition, cost, records, and location fit more carefully.';
  }

  return 'Buyers should use market context to decide which properties deserve closer review and which assumptions need confirmation.';
}

function getSellerExplanation(input: MarketDecisionWorkspaceInput) {
  const competitiveness = input.competitivenessSignal.toLowerCase();

  if (competitiveness.includes('tight') || competitiveness.includes('competition')) {
    return 'Sellers should still prepare documentation and presentation because stronger demand does not remove buyer diligence.';
  }

  if (competitiveness.includes('selection') || competitiveness.includes('options')) {
    return 'Sellers should understand competing inventory, likely objections, and preparation needs before positioning the home.';
  }

  return 'Sellers should connect pricing, preparation, timing, and buyer questions before requesting a review.';
}

export function buildMarketDecisionWorkspace(input: MarketDecisionWorkspaceInput): MarketDecisionWorkspace {
  const scopeLabel = getScopeLabel(input);
  const sellerHref = input.sellerHref || '/sell';
  const inventoryContext = input.inventorySignal || `${input.neighborhoodCount ?? 0} local context paths`;
  const priceContext = input.pricingSignal || 'pricing context varies by property and location';
  const attentionContext = input.resilienceSignal || inventoryContext;

  return {
    headline: `Read ${scopeLabel} before the next property decision.`,
    orientation: `${input.name} is framed through ${input.marketSignal.toLowerCase()}, ${input.competitivenessSignal.toLowerCase()}, and ${input.timingSignal.toLowerCase()}. Use this as education before search, property review, or seller planning.`,
    trustBoundary:
      'Market guidance is explanatory only. It does not predict price movement, score a customer, recommend an offer, activate GIS, use AI, or start telemetry.',
    items: [
      {
        lens: 'market-type',
        label: 'What kind of market is this?',
        explanation: `${input.marketSignal} with ${input.competitivenessSignal}. ${inventoryContext} helps frame how much context to review before narrowing choices.`,
        action: 'Review market signals',
        href: input.marketHref,
      },
      {
        lens: 'buyer',
        label: 'What should buyers understand?',
        explanation: getBuyerExplanation(input),
        action: 'Search with context',
        href: input.searchHref,
      },
      {
        lens: 'seller',
        label: 'What should sellers understand?',
        explanation: getSellerExplanation(input),
        action: 'Request seller review',
        href: sellerHref,
      },
      {
        lens: 'attention',
        label: 'What deserves attention?',
        explanation: `${attentionContext} should be read alongside ${priceContext}, condition, timing, and property-specific records.`,
        action: 'Compare local context',
        href: input.marketHref,
      },
      {
        lens: 'decision',
        label: 'How should this influence my decision?',
        explanation: 'Use the market signal to decide whether to keep searching, open a property workspace, ask a focused question, or prepare for a seller strategy conversation.',
        action: 'Continue the decision path',
        href: input.searchHref,
      },
    ],
  };
}
