export type BuyerDecisionWorkspaceInput = {
  searchHref: string;
  marketHref: string;
  propertyHref: string;
  financingHref: string;
  advisorHref: string;
};

export type BuyerDecisionWorkspaceItem = {
  lens: 'readiness' | 'gather' | 'compare' | 'questions' | 'research' | 'next';
  label: string;
  guidance: string;
  action: string;
  href: string;
};

export type BuyerDecisionWorkspace = {
  headline: string;
  orientation: string;
  trustBoundary: string;
  items: BuyerDecisionWorkspaceItem[];
};

export function buildBuyerDecisionWorkspace(input: BuyerDecisionWorkspaceInput): BuyerDecisionWorkspace {
  return {
    headline: 'Prepare the decision before the market asks you to move.',
    orientation:
      'A stronger buying decision starts by separating readiness, information gathering, comparison, questions, research, and the next practical step.',
    trustBoundary:
      'This workspace is educational only. It does not qualify a buyer, calculate affordability, use AI, activate telemetry, recommend properties, or start a lender workflow.',
    items: [
      {
        lens: 'readiness',
        label: 'Am I prepared to purchase?',
        guidance: 'Review timeline, daily-life needs, decision partners, available cash, financing assumptions, and whether the search is exploratory or active.',
        action: 'Start search context',
        href: input.searchHref,
      },
      {
        lens: 'gather',
        label: 'What should I gather?',
        guidance: 'Collect budget assumptions, lender questions, tax and insurance questions, commute needs, must-haves, deal breakers, and ownership constraints.',
        action: 'Review financing education',
        href: input.financingHref,
      },
      {
        lens: 'compare',
        label: 'What should I compare?',
        guidance: 'Compare inventory, location fit, condition signals, market alternatives, timing pressure, HOA context, and long-term ownership tradeoffs.',
        action: 'Understand the market',
        href: input.marketHref,
      },
      {
        lens: 'questions',
        label: 'What should I ask?',
        guidance: 'Ask what the listing does not answer: inspection scope, records, systems, exterior exposure, financing terms, neighborhood fit, and offer strategy.',
        action: 'Open a property brief',
        href: input.propertyHref,
      },
      {
        lens: 'research',
        label: 'What research should I complete?',
        guidance: 'Review disclosures, comparable options, tax history, insurance considerations, commute patterns, local rules, and professional inspection priorities.',
        action: 'Continue market research',
        href: input.marketHref,
      },
      {
        lens: 'next',
        label: 'What is the next step?',
        guidance: 'Continue searching, review market context, open a property decision brief, or ask an advisor when a home deserves focused discussion.',
        action: 'Ask an Advisor',
        href: input.advisorHref,
      },
    ],
  };
}
