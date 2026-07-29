export type FinancingDecisionWorkspaceInput = {
  buyerHref: string;
  searchHref: string;
  marketHref: string;
  advisorHref: string;
};

export type FinancingDecisionWorkspaceItem = {
  lens: 'readiness' | 'concepts' | 'terms' | 'documents' | 'questions' | 'research' | 'next';
  label: string;
  guidance: string;
  action: string;
  href: string;
};

export type FinancingDecisionWorkspace = {
  headline: string;
  orientation: string;
  trustBoundary: string;
  items: FinancingDecisionWorkspaceItem[];
};

export function buildFinancingDecisionWorkspace(input: FinancingDecisionWorkspaceInput): FinancingDecisionWorkspace {
  return {
    headline: 'Prepare the financing conversation before the financing process begins.',
    orientation:
      'A stronger financing decision starts by separating readiness, affordability concepts, terminology, documentation, questions, research, and the next practical step.',
    trustBoundary:
      'This workspace is educational only. It does not calculate payments, qualify customers, recommend lenders, compare rates, use AI, activate telemetry, or start a lender workflow.',
    items: [
      {
        lens: 'readiness',
        label: 'Am I financially ready?',
        guidance: 'Review timeline, comfort range, available cash, reserves, monthly-cost assumptions, and whether you are still researching or preparing for advice.',
        action: 'Review buyer readiness',
        href: input.buyerHref,
      },
      {
        lens: 'concepts',
        label: 'Which affordability concepts matter?',
        guidance: 'Separate purchase price, down payment, taxes, insurance, HOA dues, reserves, maintenance, escrow, and cash-to-close assumptions.',
        action: 'Return to search context',
        href: input.searchHref,
      },
      {
        lens: 'terms',
        label: 'Which terms should I understand?',
        guidance: 'Clarify principal, interest, escrow, PMI, points, closing costs, loan type, rate lock, reserves, and contingency timing with qualified professionals.',
        action: 'Review market context',
        href: input.marketHref,
      },
      {
        lens: 'documents',
        label: 'What should I prepare?',
        guidance: 'Organize income, asset, debt, tax, employment, gift-fund, insurance, HOA, and property-specific questions before sharing sensitive details.',
        action: 'Prepare advisor questions',
        href: input.advisorHref,
      },
      {
        lens: 'questions',
        label: 'What should I ask a lender?',
        guidance: 'Ask what assumptions are included, what is excluded, how scenarios change, which documents are needed, and when professional review is appropriate.',
        action: 'Ask a focused question',
        href: input.advisorHref,
      },
      {
        lens: 'research',
        label: 'What research should I complete?',
        guidance: 'Research taxes, insurance considerations, HOA obligations, utility costs, repair exposure, local market context, and ownership timelines.',
        action: 'Continue market research',
        href: input.marketHref,
      },
      {
        lens: 'next',
        label: 'What is the next step?',
        guidance: 'Continue comparing homes, refine assumptions, prepare questions, or speak with appropriate professionals when the financing conversation is ready.',
        action: 'Continue search',
        href: input.searchHref,
      },
    ],
  };
}
