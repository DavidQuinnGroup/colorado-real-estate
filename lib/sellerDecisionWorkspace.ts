export type SellerDecisionWorkspaceInput = {
  marketHref: string;
  searchHref: string;
  sellerHref: string;
  requestHref: string;
};

export type SellerDecisionWorkspaceItem = {
  lens: 'readiness' | 'gather' | 'questions' | 'factors' | 'next';
  label: string;
  guidance: string;
  action: string;
  href: string;
};

export type SellerDecisionWorkspace = {
  headline: string;
  orientation: string;
  trustBoundary: string;
  items: SellerDecisionWorkspaceItem[];
};

export function buildSellerDecisionWorkspace(input: SellerDecisionWorkspaceInput): SellerDecisionWorkspace {
  return {
    headline: 'Prepare the decision before asking for a price conversation.',
    orientation:
      'A stronger selling decision starts by separating readiness, market context, property preparation, buyer questions, and the next practical step.',
    trustBoundary:
      'This workspace is educational only. It does not produce an instant value, rank a homeowner, use AI, activate telemetry, or start a lender workflow.',
    items: [
      {
        lens: 'readiness',
        label: 'Am I ready to sell?',
        guidance: 'Review timeline, motivation, next-move constraints, and whether the decision is urgent or still exploratory.',
        action: 'Review seller strategy',
        href: input.sellerHref,
      },
      {
        lens: 'gather',
        label: 'What should I gather?',
        guidance: 'Collect improvement history, maintenance records, HOA details, utility context, known issues, and questions about preparation.',
        action: 'Prepare request details',
        href: input.requestHref,
      },
      {
        lens: 'questions',
        label: 'What should I ask?',
        guidance: 'Ask which buyer objections, repair items, presentation choices, timing factors, and market alternatives deserve attention.',
        action: 'Ask a focused question',
        href: input.requestHref,
      },
      {
        lens: 'factors',
        label: 'What influences the decision?',
        guidance: 'Market alternatives, property condition, launch timing, buyer confidence, financing context, and preparation discipline all matter.',
        action: 'View market context',
        href: input.marketHref,
      },
      {
        lens: 'next',
        label: 'What is the next step?',
        guidance: 'Continue researching inventory, review market context, or request a human seller review when the decision is ready for discussion.',
        action: 'Review inventory',
        href: input.searchHref,
      },
    ],
  };
}
