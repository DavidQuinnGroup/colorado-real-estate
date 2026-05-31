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
  createDefaultNeighborhood({
    name: 'South Boulder',
    slug: 'south-boulder',
    city: 'Boulder',
    primaryAnchor: 'South Boulder Recreation Center',
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
