export type PropertyDecisionWorkspaceInput = {
  address?: string | null;
  city?: string | null;
  neighborhood?: string | null;
  propertyType?: string | null;
  status?: string | null;
  price?: number | null;
  sqft?: number | null;
  beds?: number | null;
  baths?: number | null;
  yearBuilt?: number | null;
  lotSize?: number | null;
  hasPolybutyleneRisk?: boolean | null;
  soilType?: string | null;
  altitude?: number | null;
  relatedListingCount?: number;
  authorityLinkCount?: number;
  marketPathwayLabel?: string;
  marketPathwayHref?: string;
};

export type PropertyDecisionReadinessItem = {
  stage: 'understand' | 'compare' | 'verify' | 'discuss' | 'next';
  label: string;
  prompt: string;
  evidence: string;
  action: string;
  href: string;
};

export type PropertyDecisionWorkspace = {
  posture: 'ready-to-compare' | 'verify-records' | 'complete-core-facts';
  headline: string;
  rationale: string;
  readinessItems: PropertyDecisionReadinessItem[];
  trustBoundary: string;
};

function hasCoreFacts(input: PropertyDecisionWorkspaceInput) {
  return Boolean(input.price && input.sqft && input.beds !== null && input.beds !== undefined && input.baths !== null && input.baths !== undefined);
}

function getPlaceLabel(input: PropertyDecisionWorkspaceInput) {
  return input.neighborhood?.trim() || input.city?.trim() || 'this Colorado market';
}

function getPropertyLabel(input: PropertyDecisionWorkspaceInput) {
  return input.propertyType?.trim() || 'Residential property';
}

function getVerificationFocus(input: PropertyDecisionWorkspaceInput) {
  if (input.hasPolybutyleneRisk) return 'plumbing records, system history, and appropriate professional review';
  if (input.yearBuilt && input.yearBuilt < 1980) return 'construction era, systems, permits, and maintenance records';
  if (input.soilType?.trim()) return 'site context, soil notes, drainage, and records';
  if (input.lotSize) return 'site use, maintenance expectations, boundaries, and records';
  if (input.altitude) return 'exposure, exterior systems, drainage, and elevation context';

  return 'condition, records, ownership costs, and market context';
}

export function buildPropertyDecisionWorkspace(input: PropertyDecisionWorkspaceInput): PropertyDecisionWorkspace {
  const placeLabel = getPlaceLabel(input);
  const propertyLabel = getPropertyLabel(input);
  const marketHref = input.marketPathwayHref || '/search';
  const marketLabel = input.marketPathwayLabel || 'Market Context';
  const relatedListingCount = input.relatedListingCount ?? 0;
  const authorityLinkCount = input.authorityLinkCount ?? 0;
  const coreFactsAvailable = hasCoreFacts(input);
  const verificationFocus = getVerificationFocus(input);

  const posture: PropertyDecisionWorkspace['posture'] = input.hasPolybutyleneRisk
    ? 'verify-records'
    : coreFactsAvailable
      ? 'ready-to-compare'
      : 'complete-core-facts';

  const headline =
    posture === 'verify-records'
      ? 'Start with the records that could change confidence.'
      : posture === 'complete-core-facts'
        ? 'Confirm the missing facts before comparing alternatives.'
        : 'Compare the property, then verify the assumptions.';

  const rationale =
    posture === 'verify-records'
      ? `This ${propertyLabel.toLowerCase()} has public signals that should move records and professional review ahead of speed.`
      : posture === 'complete-core-facts'
        ? `This ${propertyLabel.toLowerCase()} needs a complete fact picture before price, size, and fit can be compared clearly.`
        : `This ${propertyLabel.toLowerCase()} in ${placeLabel} has enough public context to compare fit, then verify assumptions.`;

  return {
    posture,
    headline,
    rationale,
    trustBoundary: 'Public listing facts and existing site context only; no AI, valuation, lender workflow, telemetry, or external data activation.',
    readinessItems: [
      {
        stage: 'understand',
        label: 'Understand the property',
        prompt: `What is known about the ${propertyLabel.toLowerCase()}, price, size, status, and location?`,
        evidence: coreFactsAvailable ? 'Core listing facts are available on this page.' : 'Some core listing facts are incomplete and should be confirmed.',
        action: 'Review listing facts',
        href: '#property-facts',
      },
      {
        stage: 'compare',
        label: 'Compare alternatives',
        prompt: `How does this option compare with other homes in ${placeLabel}?`,
        evidence:
          relatedListingCount > 0
            ? `${relatedListingCount} related listings are available through existing property links.`
            : `Use ${marketLabel} and search context for comparison.`,
        action: relatedListingCount > 0 ? 'Review related listings' : 'Open market context',
        href: marketHref,
      },
      {
        stage: 'verify',
        label: 'Verify assumptions',
        prompt: `Which facts need confirmation before relying on this property decision?`,
        evidence: `Focus on ${verificationFocus}.`,
        action: 'Review questions to verify',
        href: '#property-questions-forward',
      },
      {
        stage: 'discuss',
        label: 'Discuss with context',
        prompt: 'Which questions belong with an advisor or appropriate professional before next steps?',
        evidence:
          authorityLinkCount > 0
            ? `${authorityLinkCount} authority links are available for broader context.`
            : 'This page keeps discussion grounded in public listing facts and visible context.',
        action: 'Ask a focused question',
        href: '#property-contact',
      },
      {
        stage: 'next',
        label: 'Choose the next step',
        prompt: 'Should you keep searching, open market context, ask a question, or schedule a tour?',
        evidence: 'The page organizes next steps after education, comparison, and verification prompts.',
        action: 'Continue decision path',
        href: marketHref,
      },
    ],
  };
}
