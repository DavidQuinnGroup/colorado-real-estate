import type { Neighborhood } from './neighborhoods';

export const NEIGHBORHOOD_PRODUCT_3_STATUS = 'NEIGHBORHOOD_PRODUCT_3_IMPLEMENTATION_COMPLETE';

export type NeighborhoodProduct3EvidenceState = 'complete' | 'sparse' | 'missing' | 'conflict';
export type NeighborhoodProduct3Confidence = 'well-supported' | 'review-context' | 'limited';

export type NeighborhoodProduct3InventoryState = {
  count: number;
  source: 'typesense' | 'fallback';
};

export type NeighborhoodProduct3MarketInput = {
  inventoryLabel: string;
  competitivenessLabel: string;
  timingLabel: string;
};

export type NeighborhoodProduct3ProfileItem = {
  label: string;
  state: NeighborhoodProduct3EvidenceState;
  summary: string;
  verify: string;
};

export type NeighborhoodProduct3ConstellationDimension = {
  label: 'Place anchor' | 'Housing pattern' | 'Market relationship' | 'Inventory path' | 'Verification focus';
  evidence: NeighborhoodProduct3Confidence;
  orientation: string;
  verify: string;
};

export type NeighborhoodProduct3ConfidenceFacet = {
  label: 'Source basis' | 'Freshness' | 'Completeness' | 'Limitations' | 'Conflicts' | 'Verify next';
  confidence: NeighborhoodProduct3Confidence;
  detail: string;
};

export type NeighborhoodProduct3PropertyContext = {
  label: string;
  description: string;
  href: string;
  source: 'indexed-search' | 'search-path';
};

export type NeighborhoodProduct3ChecklistItem = {
  label: string;
  prompt: string;
};

export type NeighborhoodProduct3Model = {
  subject: string;
  city: string;
  evidenceState: NeighborhoodProduct3EvidenceState;
  richInterpretationAllowed: boolean;
  summary: string;
  profile: NeighborhoodProduct3ProfileItem[];
  constellation: NeighborhoodProduct3ConstellationDimension[];
  confidence: NeighborhoodProduct3ConfidenceFacet[];
  marketContext: {
    cityHref: string;
    summary: string;
  };
  propertyContext: NeighborhoodProduct3PropertyContext[];
  checklist: NeighborhoodProduct3ChecklistItem[];
  trustBoundary: string;
};

function hasSpecificNeighborhoodEvidence(neighborhood: Neighborhood) {
  return !neighborhood.lifestyleVibe.includes('locally specific Colorado lifestyle profile');
}

function getEvidenceState(neighborhood: Neighborhood, inventoryState: NeighborhoodProduct3InventoryState): NeighborhoodProduct3EvidenceState {
  if (!neighborhood.name || !neighborhood.city || !neighborhood.slug) return 'missing';
  if (!neighborhood.primaryAnchor || !neighborhood.era || !neighborhood.constructionDNA) return 'missing';
  if (inventoryState.source === 'typesense' && inventoryState.count < 0) return 'conflict';
  return hasSpecificNeighborhoodEvidence(neighborhood) ? 'complete' : 'sparse';
}

function getEvidenceLabel(state: NeighborhoodProduct3EvidenceState) {
  if (state === 'complete') return 'well-supported';
  if (state === 'conflict') return 'limited';
  return 'review-context';
}

function getInventoryDescription(neighborhood: Neighborhood, inventoryState: NeighborhoodProduct3InventoryState, searchHref: string) {
  if (inventoryState.source === 'typesense') {
    return {
      label: 'Indexed property path',
      description: `Existing search index reports ${inventoryState.count} matching listing signal${inventoryState.count === 1 ? '' : 's'} for this neighborhood name. Use the search page to verify current availability and listing detail.`,
      href: searchHref,
      source: 'indexed-search' as const,
    };
  }

  return {
    label: 'Property discovery path',
    description: `${neighborhood.name} has a direct search path, but this page is not presenting a live indexed count for the neighborhood. Use search results to verify current availability.`,
    href: searchHref,
    source: 'search-path' as const,
  };
}

export function buildNeighborhoodProduct3Model({
  neighborhood,
  inventoryState,
  market,
  cityMarketHref,
  searchHref,
}: {
  neighborhood: Neighborhood;
  inventoryState: NeighborhoodProduct3InventoryState;
  market: NeighborhoodProduct3MarketInput;
  cityMarketHref: string;
  searchHref: string;
}): NeighborhoodProduct3Model {
  const evidenceState = getEvidenceState(neighborhood, inventoryState);
  const richInterpretationAllowed = evidenceState === 'complete';
  const confidence = getEvidenceLabel(evidenceState);
  const hasIndexedInventory = inventoryState.source === 'typesense';
  const sourceBasis =
    'Existing neighborhood route data, public page content, city-market continuity, and listing-index availability when the neighborhood facet is available.';

  const summary = richInterpretationAllowed
    ? `${neighborhood.name} can be reviewed through its place anchor, housing pattern, city-market relationship, property discovery path, and verification questions before a customer narrows into specific listings.`
    : `${neighborhood.name} has useful neighborhood orientation, but richer interpretation is intentionally bounded until source freshness and completeness are stronger.`;

  return {
    subject: neighborhood.name,
    city: neighborhood.city,
    evidenceState,
    richInterpretationAllowed,
    summary,
    profile: [
      {
        label: 'Known orientation',
        state: evidenceState === 'missing' ? 'missing' : evidenceState,
        summary: `${neighborhood.primaryAnchor || neighborhood.city} provides the primary place anchor, while the page keeps the first decision focused on location context, housing pattern, property discovery, and verification.`,
        verify: 'Confirm the exact location, boundary assumptions, and services that matter to your individual search before relying on the neighborhood label.',
      },
      {
        label: 'Evidence limits',
        state: evidenceState === 'complete' ? 'sparse' : evidenceState,
        summary: hasIndexedInventory
          ? 'The property path can use the existing listing index, but listing availability can change quickly.'
          : 'The page is using route and editorial orientation without presenting a live neighborhood inventory count.',
        verify: 'Open the search path and confirm current listing status, availability, and property details.',
      },
      {
        label: 'Next decision',
        state: 'sparse',
        summary: `${neighborhood.city} market context and property search should be reviewed together before drawing conclusions from the neighborhood page alone.`,
        verify: 'Compare the city market page, current search results, and property detail pages before deciding what to investigate next.',
      },
    ],
    constellation: [
      {
        label: 'Place anchor',
        evidence: confidence,
        orientation: `${neighborhood.primaryAnchor || neighborhood.city} is the factual orientation point currently available on this page.`,
        verify: 'Verify exact access, distance, operating status, and seasonal conditions independently.',
      },
      {
        label: 'Housing pattern',
        evidence: neighborhood.era ? confidence : 'limited',
        orientation: `${neighborhood.era || 'Housing-pattern detail is limited'}; property condition still needs address-specific review.`,
        verify: 'Verify age, permits, systems, drainage, and maintenance records property by property.',
      },
      {
        label: 'Market relationship',
        evidence: 'review-context',
        orientation: `${neighborhood.name} should be read with the ${neighborhood.city} market page, not as a standalone market conclusion.`,
        verify: 'Use city market context and live search results to confirm current selection and timing.',
      },
      {
        label: 'Inventory path',
        evidence: hasIndexedInventory ? 'review-context' : 'limited',
        orientation: hasIndexedInventory
          ? 'Existing search infrastructure can provide a current property-discovery path for this neighborhood name.'
          : 'A search path is available, but this page is not treating static orientation as live inventory.',
        verify: 'Open search and confirm current availability, listing status, and property facts.',
      },
      {
        label: 'Verification focus',
        evidence: 'review-context',
        orientation: 'The most useful next step is to turn neighborhood context into property-specific questions.',
        verify: 'Verify boundaries, access, services, physical condition, disclosures, and source freshness based on your individual needs.',
      },
    ],
    confidence: [
      {
        label: 'Source basis',
        confidence,
        detail: sourceBasis,
      },
      {
        label: 'Freshness',
        confidence: hasIndexedInventory ? 'review-context' : 'limited',
        detail: hasIndexedInventory
          ? 'Listing-index availability is queried from the existing search index during page rendering; other neighborhood content is static orientation.'
          : 'Freshness is limited because this page is not presenting live indexed neighborhood inventory.',
      },
      {
        label: 'Completeness',
        confidence,
        detail: evidenceState === 'complete'
          ? 'Complete enough for bounded public interpretation across orientation, market path, property path, and verification prompts.'
          : 'Sparse or limited state; the page should support orientation and next steps without rich claims.',
      },
      {
        label: 'Limitations',
        confidence: 'limited',
        detail: 'No AI, public GIS, new provider data, telemetry, forecasts, valuation model, quality ordering, education-quality claims, safety-quality claims, or audience targeting is used.',
      },
      {
        label: 'Conflicts',
        confidence: evidenceState === 'conflict' ? 'limited' : 'well-supported',
        detail: evidenceState === 'conflict'
          ? 'Conflicting evidence requires review before richer interpretation.'
          : 'No conflict is represented by the current page model; unsupported facts remain verification items.',
      },
      {
        label: 'Verify next',
        confidence: 'review-context',
        detail: 'Confirm boundaries, current listings, property condition, disclosures, local services, and timing before relying on the page for a decision.',
      },
    ],
    marketContext: {
      cityHref: cityMarketHref,
      summary: `${neighborhood.name} is connected to ${neighborhood.city} market context through ${market.inventoryLabel.toLowerCase()}, ${market.competitivenessLabel.toLowerCase()}, and ${market.timingLabel.toLowerCase()}. This is preparation context, not a forecast or valuation claim.`,
    },
    propertyContext: [
      getInventoryDescription(neighborhood, inventoryState, searchHref),
      {
        label: 'Property detail bridge',
        description: 'Property pages provide address-level facts, confidence guidance, comparable context, and verification prompts after a listing is selected.',
        href: searchHref,
        source: hasIndexedInventory ? 'indexed-search' : 'search-path',
      },
    ],
    checklist: [
      {
        label: 'Property availability',
        prompt: 'Verify current listing status, availability, price, media, and showing instructions through the property detail and search experience.',
      },
      {
        label: 'Market freshness',
        prompt: 'Confirm city-market context and current inventory before relying on neighborhood-level orientation.',
      },
      {
        label: 'Boundaries and access',
        prompt: 'Verify boundary assumptions, commute routes, local services, and access details based on your individual needs.',
      },
      {
        label: 'Physical due diligence',
        prompt: 'Review property condition, drainage, roof, systems, permits, records, insurance questions, and professional inspection needs for each address.',
      },
      {
        label: 'Source limitations',
        prompt: 'Treat static neighborhood content as orientation and use current search/property facts before making a decision.',
      },
    ],
    trustBoundary:
      'Existing neighborhood routes, content, and search paths only; no AI, public GIS, provider activation, telemetry, forecasting, valuation model, quality ordering, personal scoring, education-quality claims, safety-quality claims, audience targeting, schema changes, Prisma changes, new APIs, or customer-visible test data.',
  };
}
