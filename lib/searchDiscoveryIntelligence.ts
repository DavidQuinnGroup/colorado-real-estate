export const SEARCH_DISCOVERY_INTELLIGENCE_STATUS = 'SEARCH_DISCOVERY_INTELLIGENCE_ADVANCEMENT_IMPLEMENTED';

export type SearchDiscoveryInput = {
  visibleListingCount: number;
  activeCriteriaCount: number;
  criteriaSummary: string;
  evidenceLabel: string;
  hasZeroResults: boolean;
  isDegraded: boolean;
  selectedPropertyLabel: string;
};

export type SearchDiscoveryCue = {
  key: 'PROPERTY' | 'PLACE' | 'MARKET_CONTEXT' | 'EVIDENCE_AVAILABILITY' | 'COMPARISON_OPPORTUNITY' | 'NEXT_DECISION_STEP';
  label: string;
  fact: string;
  interpretation: string;
  nextStep: string;
  href: string;
};

export type SearchDiscoveryIntelligence = {
  status: typeof SEARCH_DISCOVERY_INTELLIGENCE_STATUS;
  summary: string;
  cues: SearchDiscoveryCue[];
  protectedBoundaries: {
    ranking: false;
    scoring: false;
    recommendation: false;
    suitabilityInference: false;
    protectedClassInference: false;
    hiddenPersonalization: false;
    persistence: false;
    telemetry: false;
    providerActivation: false;
    searchApiChange: false;
    mapBehaviorChange: false;
  };
};

export function buildSearchDiscoveryIntelligence(input: SearchDiscoveryInput): SearchDiscoveryIntelligence {
  const resultFact = input.hasZeroResults
    ? 'No matching public properties are available in the current view.'
    : `${input.visibleListingCount} public propert${input.visibleListingCount === 1 ? 'y is' : 'ies are'} visible in the current view.`;
  const criteriaFact = input.activeCriteriaCount
    ? `${input.activeCriteriaCount} visible criteria are shaping this search: ${input.criteriaSummary}.`
    : 'No visible criteria are narrowing the open Colorado view.';

  return {
    status: SEARCH_DISCOVERY_INTELLIGENCE_STATUS,
    summary:
      'Search Discovery Intelligence turns the current result set into property, place, market, evidence, comparison, and next-step cues without ranking properties or inferring customer suitability.',
    cues: [
      {
        key: 'PROPERTY',
        label: 'Property facts',
        fact: resultFact,
        interpretation: input.selectedPropertyLabel === 'No property selected'
          ? 'Select a property when one still appears relevant after visible criteria and map context are reviewed.'
          : `${input.selectedPropertyLabel} is selected for closer inspection in the current search workspace.`,
        nextStep: 'Open Property Intelligence for condition, records, source limits, and verification questions.',
        href: '#search-results',
      },
      {
        key: 'PLACE',
        label: 'Place orientation',
        fact: criteriaFact,
        interpretation: 'City and place context should help organize the search, not decide where a person should live.',
        nextStep: 'Use market or Local Decision Intelligence when a place needs more context.',
        href: '/market',
      },
      {
        key: 'MARKET_CONTEXT',
        label: 'Market context',
        fact: 'Market links remain the source for city context and market interpretation.',
        interpretation: 'Search should point to market context instead of duplicating a city or neighborhood guide inside every card.',
        nextStep: 'Review the relevant city market route before treating a result set as enough context.',
        href: '/market',
      },
      {
        key: 'EVIDENCE_AVAILABILITY',
        label: 'Evidence availability',
        fact: `${input.evidenceLabel}${input.isDegraded ? ' with fallback limits' : ''}.`,
        interpretation: 'Missing, fallback, or incomplete evidence should become a verification question instead of a recommendation.',
        nextStep: 'Carry condition, records, disclosures, insurance, HOA, tax, financing, and source questions into the property page or advisor review.',
        href: '/sources',
      },
      {
        key: 'COMPARISON_OPPORTUNITY',
        label: 'Comparison opportunity',
        fact: input.visibleListingCount >= 2 ? 'At least two visible properties can be compared as factual alternatives.' : 'Comparison needs at least two visible property alternatives.',
        interpretation: 'Comparison means visible differences and unanswered questions. It is not a winner, score, or best-property selection.',
        nextStep: 'Use property details and Compare only when the alternatives remain relevant after visible criteria.',
        href: '/compare',
      },
      {
        key: 'NEXT_DECISION_STEP',
        label: 'Next decision step',
        fact: input.hasZeroResults ? 'The current criteria need recovery before property comparison.' : 'The result set can support a next action.',
        interpretation: input.hasZeroResults
          ? 'Broaden criteria before drawing conclusions from an empty search.'
          : 'Choose whether to refine, open a property, compare alternatives, review market context, or bring questions to an advisor.',
        nextStep: input.hasZeroResults ? 'Clear or broaden criteria.' : 'Continue to Property, Compare, Market, Grand Plan, or Advisor.',
        href: '/grand-plan',
      },
    ],
    protectedBoundaries: {
      ranking: false,
      scoring: false,
      recommendation: false,
      suitabilityInference: false,
      protectedClassInference: false,
      hiddenPersonalization: false,
      persistence: false,
      telemetry: false,
      providerActivation: false,
      searchApiChange: false,
      mapBehaviorChange: false,
    },
  };
}
