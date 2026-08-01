/**
 * DQG Intelligence Engine: neighborhood authority layer.
 * Supports resilience scoring, altitude forensics, GC construction context,
 * and programmatic Boulder/Denver market intelligence pages.
 */

export type FireRisk = 'Low' | 'Moderate' | 'High' | 'Extreme';
export type InsuranceComplexity = 'Standard' | 'Elevated' | 'Complex';
export type SoilType = 'Bentonite' | 'Sandy' | 'Stable Rock' | 'Front Range Mixed';

export type Neighborhood = {
  name: string;
  slug: string;
  city: string;
  routeEnhancement?: NeighborhoodRouteEnhancement;
  lifestyleVibe: string;
  primaryAnchor: string;
  resilienceScore: number;
  fireRisk: FireRisk;
  waterRights: boolean;
  insuranceComplexity: InsuranceComplexity;
  avgEfficiencyScore: number;
  era: string;
  altitude: number;
  soilType: SoilType;
  constructionDNA: string;
  tacticalLever: string;
};

export type NeighborhoodRouteEnhancement = {
  contract: 'SOUTH_BOULDER_EXISTING_NEIGHBORHOOD_ROUTE_ENHANCEMENT';
  objectType: 'NEIGHBORHOOD';
  canonicalPath: string;
  canonicalUrl: string;
  parentContext: string;
  scopeClarification: string;
  decisionSnapshot: string;
  localCharacter: string;
  geographicBoundaries: string;
  housingAndPropertyContext: string;
  marketAndDecisionDrivers: string[];
  buyerPrompts: string[];
  sellerPrompts: string[];
  dueDiligencePrompts: string[];
  evidenceTransparency: string[];
  journeyLinks: ReadonlyArray<{
    label: string;
    href: string;
    note: string;
  }>;
  sourceRightsBoundary: string;
  protectedBoundary: string;
};

export type ResilienceAdvice = {
  score: number;
  altitudeAdvice: string;
  soilAnalysis: string;
  tacticalLever: string;
  analysis: string;
};

function createNeighborhood(profile: Neighborhood): Neighborhood {
  return profile;
}

function createDefaultNeighborhood({
  name,
  slug,
  city,
  primaryAnchor = 'local lifestyle anchors',
}: {
  name: string;
  slug: string;
  city: string;
  primaryAnchor?: string;
}): Neighborhood {
  return {
    name,
    slug,
    city,
    lifestyleVibe: `${name} offers a locally specific Colorado lifestyle profile with access to ${primaryAnchor}.`,
    primaryAnchor,
    resilienceScore: 80,
    fireRisk: city === 'Boulder' || city === 'Superior' ? 'Moderate' : 'Low',
    waterRights: false,
    insuranceComplexity: city === 'Boulder' || city === 'Superior' ? 'Elevated' : 'Standard',
    avgEfficiencyScore: 86,
    era: 'mixed-era residential',
    altitude: city === 'Boulder' ? 5400 : 5280,
    soilType: 'Front Range Mixed',
    constructionDNA: 'Mixed-age housing stock where drainage, roof age, mechanical systems, and remodel quality separate surface appeal from durable value.',
    tacticalLever: 'Use inspection diligence to separate cosmetic finish quality from structural, drainage, sewer, roof, and mechanical fundamentals.',
  };
}

export const neighborhoods: Neighborhood[] = [
  createDefaultNeighborhood({
    name: 'Downtown Boulder',
    slug: 'downtown-boulder',
    city: 'Boulder',
    primaryAnchor: 'Pearl Street Mall',
  }),
  createDefaultNeighborhood({
    name: 'North Boulder',
    slug: 'north-boulder',
    city: 'Boulder',
    primaryAnchor: 'North Boulder Park',
  }),
  createNeighborhood({
    name: 'South Boulder',
    slug: 'south-boulder',
    city: 'Boulder',
    lifestyleVibe: 'South Boulder is a neighborhood-level Boulder context with locally used labels, nearby subareas, and property-by-property variation that should be verified before a decision depends on it.',
    primaryAnchor: 'South Boulder Recreation Center',
    resilienceScore: 80,
    fireRisk: 'Moderate',
    waterRights: false,
    insuranceComplexity: 'Elevated',
    avgEfficiencyScore: 86,
    era: 'mixed-era residential',
    altitude: 5400,
    soilType: 'Front Range Mixed',
    constructionDNA: 'Postwar homes, later remodels, townhome and condo pockets, and infill-adjacent properties can differ materially by lot, association, improvements, and maintenance history.',
    tacticalLever: 'Separate neighborhood orientation from address-specific records, inspections, insurance questions, municipal review, HOA materials, and lender requirements.',
    routeEnhancement: {
      contract: 'SOUTH_BOULDER_EXISTING_NEIGHBORHOOD_ROUTE_ENHANCEMENT',
      objectType: 'NEIGHBORHOOD',
      canonicalPath: '/market/boulder/south-boulder',
      canonicalUrl: 'https://davidquinngroup.com/market/boulder/south-boulder',
      parentContext: 'Boulder city context with Boulder County and South Boulder market-area orientation.',
      scopeClarification:
        'South Boulder is presented as neighborhood-level orientation within Boulder. It is not a legal boundary, subdivision map, HOA determination, school-assignment source, insurance conclusion, or property-specific finding.',
      decisionSnapshot:
        'Use this page to understand the South Boulder context, then verify address-specific records, physical condition, insurance questions, financing fit, HOA materials, and municipal details before relying on the route for a property decision.',
      localCharacter:
        'South Boulder context often involves a mix of established residential streets, foothills access assumptions, local service nodes, and nearby subarea names. Those labels can be useful for orientation, but exact meaning can vary by address and source.',
      geographicBoundaries:
        'Neighborhood labels, subdivision names, school boundaries, HOA coverage, municipal records, trail access, and corridor references may not align. Treat the route as context and confirm property-specific facts through the appropriate source.',
      housingAndPropertyContext:
        'Housing context can include mixed-era single-family homes, attached homes, remodels, additions, and association-governed properties. The page does not determine condition, title, permits, value, insurance, financing, or suitability for any property.',
      marketAndDecisionDrivers: [
        'Confirm whether the property sits inside the neighborhood label, a subdivision, an HOA, a district, or another locally used area name.',
        'Separate citywide Boulder market context from the specific property condition, listing facts, and ownership documents.',
        'Review access, commute, maintenance, financing, and insurance assumptions against the actual address rather than the neighborhood label alone.',
      ],
      buyerPrompts: [
        'Verify the exact address context, property type, age, improvements, and association status before relying on neighborhood-level information.',
        'Confirm school-boundary, insurance, financing, municipal, permit, and inspection questions with the qualified source for the specific property.',
        'Use current search results as a discovery path, not as proof that every South Boulder property shares the same condition, cost, or constraints.',
      ],
      sellerPrompts: [
        'Prepare records for improvements, maintenance, permits, HOA materials, prior reports, disclosures, and access details before property-specific review.',
        'Separate neighborhood context from pricing, value, timing, disclosure, and marketability questions that require property-specific professional review.',
        'Identify documentation gaps early so an advisor can help route questions to the appropriate municipality, HOA, title, insurance, inspection, or legal source.',
      ],
      dueDiligencePrompts: [
        'Use Boulder city and county records, HOA materials where applicable, title review, insurance review, inspection professionals, lenders, and legal counsel for address-specific questions.',
        'Treat incomplete, stale, conflicting, or source-limited information as a prompt for qualified review rather than a conclusion.',
        'Confirm boundaries, labels, records, and property facts before applying neighborhood-level context to an offer or listing decision.',
      ],
      evidenceTransparency: [
        'This route uses public-facing neighborhood context and repository-supported route governance; it does not expose internal Evidence Depth metadata.',
        'Evidence availability, recency, and permitted public use can vary by topic, and missing or conflicting information remains a limitation.',
        'Neighborhood context does not establish property condition, value, title, ownership, insurability, permits, HOA status, school assignment, financing eligibility, or suitability.',
      ],
      journeyLinks: [
        { label: 'Boulder City Context', href: '/market/boulder-co-housing-market', note: 'Citywide market context' },
        { label: 'Search South Boulder', href: '/search?neighborhood=South%20Boulder', note: 'Existing search path' },
        { label: 'Buyer Guidance', href: '/buy', note: 'Buyer decision preparation' },
        { label: 'Financing Readiness', href: '/buy#financing-readiness', note: 'Financing questions' },
        { label: 'Seller Guidance', href: '/sell', note: 'Seller preparation' },
        { label: 'Seller Readiness', href: '/home-worth#seller-readiness', note: 'Documentation preparation' },
        { label: 'Grand Plan', href: '/grand-plan', note: 'Decision planning' },
        { label: 'Advisory Readiness', href: '/contact#advisory-readiness', note: 'Advisor conversation' },
      ],
      sourceRightsBoundary:
        'Public copy is limited to permitted, general neighborhood context and does not publish internal evidence metadata or source-rights governance details.',
      protectedBoundary:
        'No new route, alias, redirect, registry entry, sitemap entry, Search behavior, map layer, GIS boundary, valuation output, comparative claim, prediction, protected public-content claim, Niwot activation, Gunbarrel activation, or Local Decision Intelligence Wave 4 activation is created.',
    },
  }),
  createDefaultNeighborhood({
    name: 'Gunbarrel',
    slug: 'gunbarrel',
    city: 'Boulder',
    primaryAnchor: 'Boulder Reservoir',
  }),
  createDefaultNeighborhood({
    name: 'Table Mesa',
    slug: 'table-mesa',
    city: 'Boulder',
    primaryAnchor: 'Viele Lake',
  }),
  createNeighborhood({
    name: 'Mapleton Hill',
    slug: 'mapleton-hill',
    city: 'Boulder',
    lifestyleVibe: 'Historic craftsmanship meets high-canopy serenity with direct access to Boulder trail culture.',
    primaryAnchor: 'Mt. Sanitas Trailhead',
    resilienceScore: 88,
    fireRisk: 'Moderate',
    waterRights: true,
    insuranceComplexity: 'Standard',
    avgEfficiencyScore: 94,
    era: 'historic masonry and early twentieth-century',
    altitude: 5380,
    soilType: 'Stable Rock',
    constructionDNA: 'Older foundations, mature tree canopy, drainage management, and preservation-sensitive exterior systems.',
    tacticalLever: 'Use inspection leverage around sewer scope, roof age, drainage, and historic-envelope maintenance.',
  }),
  createNeighborhood({
    name: 'Chautauqua',
    slug: 'chautauqua',
    city: 'Boulder',
    lifestyleVibe: 'Legacy living at the foot of the Flatirons with cultural access and alpine immediacy.',
    primaryAnchor: 'Chautauqua Auditorium',
    resilienceScore: 72,
    fireRisk: 'High',
    waterRights: true,
    insuranceComplexity: 'Elevated',
    avgEfficiencyScore: 89,
    era: 'craftsman, cottage, and hillside custom',
    altitude: 5450,
    soilType: 'Bentonite',
    constructionDNA: 'Slope exposure, wildfire interface, older utility lines, and expansive-soil scrutiny near the foothills.',
    tacticalLever: 'Treat wildfire insurance, defensible space, foundation movement, and roof assembly as negotiation-critical diligence.',
  }),
  createDefaultNeighborhood({
    name: 'Wonderland Hills',
    slug: 'wonderland-hills',
    city: 'Boulder',
    primaryAnchor: 'Wonderland Lake',
  }),
  createDefaultNeighborhood({
    name: 'Old Town Louisville',
    slug: 'old-town-louisville',
    city: 'Louisville',
    primaryAnchor: 'Main Street Louisville',
  }),
  createDefaultNeighborhood({
    name: 'Coal Creek Ranch',
    slug: 'coal-creek-ranch',
    city: 'Louisville',
    primaryAnchor: 'Coal Creek Golf Course',
  }),
  createDefaultNeighborhood({
    name: 'Centennial Valley',
    slug: 'centennial-valley',
    city: 'Louisville',
    primaryAnchor: 'Davidson Mesa',
  }),
  createDefaultNeighborhood({
    name: 'North End',
    slug: 'north-end-louisville',
    city: 'Louisville',
    primaryAnchor: 'Hecla Lake Open Space',
  }),
  createDefaultNeighborhood({
    name: 'Steel Ranch',
    slug: 'steel-ranch',
    city: 'Louisville',
    primaryAnchor: 'Downtown Louisville',
  }),
  createDefaultNeighborhood({
    name: 'Indian Peaks',
    slug: 'lafayette-indian-peaks',
    city: 'Lafayette',
    primaryAnchor: 'Indian Peaks Golf Course',
  }),
  createDefaultNeighborhood({
    name: 'Waneka Lake',
    slug: 'waneka-lake',
    city: 'Lafayette',
    primaryAnchor: 'Waneka Lake Park',
  }),
  createDefaultNeighborhood({
    name: 'Old Town Lafayette',
    slug: 'old-town-lafayette',
    city: 'Lafayette',
    primaryAnchor: 'Public Road',
  }),
  createDefaultNeighborhood({
    name: "Anna's Farm",
    slug: 'annas-farm',
    city: 'Lafayette',
    primaryAnchor: 'Waneka Lake',
  }),
  createDefaultNeighborhood({
    name: 'Rock Creek',
    slug: 'rock-creek',
    city: 'Superior',
    primaryAnchor: 'Rock Creek Trail System',
  }),
  createDefaultNeighborhood({
    name: 'Sagmore',
    slug: 'sagmore',
    city: 'Superior',
    primaryAnchor: 'Superior Marketplace',
  }),
  createDefaultNeighborhood({
    name: 'Original Superior',
    slug: 'original-superior',
    city: 'Superior',
    primaryAnchor: 'Downtown Superior',
  }),
  createNeighborhood({
    name: 'Washington Park',
    slug: 'washington-park',
    city: 'Denver',
    lifestyleVibe: 'Classic Denver park living with strong walkability, mature streets, and enduring resale gravity.',
    primaryAnchor: 'Washington Park',
    resilienceScore: 82,
    fireRisk: 'Low',
    waterRights: false,
    insuranceComplexity: 'Standard',
    avgEfficiencyScore: 91,
    era: 'bungalow, tudor, and modern infill',
    altitude: 5280,
    soilType: 'Front Range Mixed',
    constructionDNA: 'Mixed-age housing stock where basement finish quality, sewer lines, and infill execution drive value separation.',
    tacticalLever: 'Compare original basement systems against newer infill envelopes to avoid overpaying for cosmetic updates.',
  }),
];

function getAltitudeAdvice(neighborhood: Neighborhood) {
  if (neighborhood.altitude > 6000) {
    return 'High-altitude acclimation required: HVAC humidification, UV-aware glazing, and envelope testing should be treated as core diligence.';
  }

  return 'Standard Front Range climate envelope applies, with drainage, roof age, and mechanical condition still carrying material value risk.';
}

function getSoilAnalysis(neighborhood: Neighborhood) {
  if (neighborhood.soilType === 'Bentonite') {
    return `Soil Profile: ${neighborhood.soilType}. Expansive-soil conditions require GC-grade foundation, drainage, and flatwork review.`;
  }

  if (neighborhood.soilType === 'Stable Rock') {
    return `Soil Profile: ${neighborhood.soilType}. Structural base is generally favorable, but older retaining, drainage, and utility systems still need verification.`;
  }

  return `Soil Profile: ${neighborhood.soilType}. Conditions should be verified against lot slope, historical grading, and visible movement.`;
}

export function getResilienceAdvice(neighborhood: Neighborhood): ResilienceAdvice {
  const altitudeAdvice = getAltitudeAdvice(neighborhood);
  const soilAnalysis = getSoilAnalysis(neighborhood);
  const waterRightsNote = neighborhood.waterRights
    ? 'Water-rights posture is stronger than a standard municipal-only profile.'
    : 'Municipal-only water posture should be reviewed for long-term cost and use constraints.';
  const insuranceNote =
    neighborhood.insuranceComplexity === 'Standard'
      ? 'Insurance underwriting is generally conventional for this micro-market.'
      : `Insurance underwriting is ${neighborhood.insuranceComplexity.toLowerCase()} and should be checked before offer strategy hardens.`;

  return {
    score: neighborhood.resilienceScore,
    altitudeAdvice,
    soilAnalysis,
    tacticalLever: neighborhood.tacticalLever,
    analysis: `${neighborhood.constructionDNA} ${soilAnalysis} ${waterRightsNote} ${insuranceNote}`,
  };
}

// lib/neighborhoods.ts
