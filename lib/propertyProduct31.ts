import {
  buildPropertyGeographicSourceIntelligence,
  type PropertyGeographicSourceIntelligence,
} from './property/propertyAuthoritativeSourceIntelligence';
import {
  buildPropertyComparisonWorkspace,
  type PropertyComparisonWorkspace,
} from './propertyComparisonIntelligence';
import {
  buildPropertyIntelligenceDeepening,
  type PropertyIntelligenceDeepening,
} from './sellerPropertyIntelligenceAdvancement';
import {
  buildPropertyEvidenceCompletenessVerification,
  type PropertyEvidenceCompletenessVerification,
} from './propertyEvidenceCompletenessVerification';

export type PropertyProduct31Input = {
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  neighborhood?: string | null;
  subdivision?: string | null;
  propertyType?: string | null;
  status?: string | null;
  price?: number | null;
  sqft?: number | null;
  beds?: number | null;
  baths?: number | null;
  yearBuilt?: number | null;
  lotSize?: number | null;
  updatedAt?: Date | null;
  lastIntelligenceSync?: Date | null;
  hasPolybutyleneRisk?: boolean | null;
  soilType?: string | null;
  altitude?: number | null;
  photoCount?: number;
  relatedListings?: PropertyProduct31ComparableInput[];
};

export type PropertyProduct31ComparableInput = {
  id: string;
  address: string;
  city: string;
  state: string;
  neighborhood?: string | null;
  price?: number | null;
  beds?: number | null;
  baths?: number | null;
  sqft?: number | null;
  status?: string | null;
};

export type PropertyProduct31EvidenceState = 'well-supported' | 'incomplete' | 'verify-next';
export type PropertyProduct31Confidence = 'high' | 'moderate' | 'limited';

export type PropertyProduct31ProfileItem = {
  label: string;
  state: PropertyProduct31EvidenceState;
  summary: string;
  verify: string;
};

export type PropertyProduct31DnaDimension = {
  label: string;
  evidence: PropertyProduct31Confidence;
  interpretation: string;
  verify: string;
};

export type PropertyProduct31ConfidenceFacet = {
  label: string;
  confidence: PropertyProduct31Confidence;
  detail: string;
  action: string;
};

export type PropertyProduct31Comparable = {
  id: string;
  address: string;
  context: string;
  similarities: string[];
  differences: string[];
  href: string;
};

export type PropertyProduct31ChecklistItem = {
  category: 'Financial' | 'Construction' | 'Market' | 'Property';
  prompt: string;
};

export type PropertyProduct31Model = {
  profile: PropertyProduct31ProfileItem[];
  dna: PropertyProduct31DnaDimension[];
  authoritativeSources: PropertyGeographicSourceIntelligence;
  comparisonIntelligence: PropertyComparisonWorkspace;
  deepening: PropertyIntelligenceDeepening;
  evidenceCompleteness: PropertyEvidenceCompletenessVerification;
  confidence: {
    summary: string;
    facets: PropertyProduct31ConfidenceFacet[];
  };
  comparables: PropertyProduct31Comparable[];
  checklist: PropertyProduct31ChecklistItem[];
  trustBoundary: string;
};

function hasValue(value: unknown) {
  return value !== null && value !== undefined && value !== '';
}

function formatCurrency(value: number | null | undefined) {
  if (!value) return 'price not provided';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number | null | undefined) {
  return typeof value === 'number' && Number.isFinite(value) ? value.toLocaleString('en-US') : null;
}

function getCompleteness(input: PropertyProduct31Input) {
  const coreFacts = [input.price, input.sqft, input.beds, input.baths, input.status, input.propertyType, input.city];
  const availableCount = coreFacts.filter(hasValue).length;
  return {
    availableCount,
    totalCount: coreFacts.length,
    confidence: availableCount >= 6 ? 'high' : availableCount >= 4 ? 'moderate' : 'limited',
  } satisfies {
    availableCount: number;
    totalCount: number;
    confidence: PropertyProduct31Confidence;
  };
}

function getSiteConfidence(input: PropertyProduct31Input): PropertyProduct31Confidence {
  const siteSignals = [input.yearBuilt, input.lotSize, input.soilType, input.altitude].filter(hasValue).length;
  if (input.hasPolybutyleneRisk) return 'moderate';
  if (siteSignals >= 3) return 'high';
  if (siteSignals >= 1) return 'moderate';
  return 'limited';
}

function compareNumber(subject: number | null | undefined, comparable: number | null | undefined, label: string) {
  if (!subject || !comparable) return null;
  if (subject === comparable) return `${label} matches the subject property.`;
  return comparable > subject ? `${label} is higher than the subject property.` : `${label} is lower than the subject property.`;
}

function compactList(values: Array<string | null | undefined>, fallback: string) {
  const filtered = values.filter((value): value is string => Boolean(value));
  return filtered.length ? filtered : [fallback];
}

function getComparableContext(input: PropertyProduct31Input, comparable: PropertyProduct31ComparableInput): PropertyProduct31Comparable {
  const subjectPlace = input.neighborhood || input.city || 'the same public search context';
  const comparablePlace = comparable.neighborhood || comparable.city;
  const similarities = compactList(
    [
      input.city && comparable.city === input.city ? `Same city: ${input.city}.` : null,
      input.neighborhood && comparable.neighborhood === input.neighborhood ? `Same neighborhood: ${input.neighborhood}.` : null,
      input.status && comparable.status === input.status ? `Same listing status: ${input.status}.` : null,
    ],
    `Useful because it appears in ${subjectPlace} related-listing context.`,
  );

  const differences = compactList(
    [
      comparablePlace && comparablePlace !== subjectPlace ? `Location context differs: ${comparablePlace}.` : null,
      compareNumber(input.price, comparable.price, 'Listing price'),
      compareNumber(input.sqft, comparable.sqft, 'Listed square footage'),
      compareNumber(input.beds, comparable.beds, 'Bedroom count'),
      compareNumber(input.baths, comparable.baths, 'Bathroom count'),
    ],
    'Public facts are similar enough that condition, records, and timing should carry the comparison.',
  );

  return {
    id: comparable.id,
    address: comparable.address,
    context: `${formatCurrency(comparable.price)} / ${formatNumber(comparable.sqft) || 'sq ft not provided'} sq ft / ${comparable.status || 'status not provided'}`,
    similarities,
    differences,
    href: `/properties/${comparable.id}`,
  };
}

export function buildPropertyProduct31Model(input: PropertyProduct31Input): PropertyProduct31Model {
  const completeness = getCompleteness(input);
  const siteConfidence = getSiteConfidence(input);
  const relatedListings = input.relatedListings ?? [];
  const hasRelatedListings = relatedListings.length > 0;
  const photoCount = input.photoCount ?? 0;
  const areaLabel = input.neighborhood || input.city || 'this Colorado market';
  const syncLabel = input.lastIntelligenceSync ? 'last intelligence sync' : input.updatedAt ? 'last listing update' : 'available public record';
  const authoritativeSources = buildPropertyGeographicSourceIntelligence({
    address: input.address,
    city: input.city,
    state: input.state,
    zip: input.zip,
    neighborhood: input.neighborhood,
    subdivision: input.subdivision,
    propertyType: input.propertyType,
    status: input.status,
    price: input.price,
    sqft: input.sqft,
    yearBuilt: input.yearBuilt,
    lotSize: input.lotSize,
    soilType: input.soilType,
    altitude: input.altitude,
    relatedListingCount: relatedListings.length,
  });
  const comparisonIntelligence = buildPropertyComparisonWorkspace({
    subject: {
      id: 'subject-property',
      address: input.address || 'Subject property',
      city: input.city,
      state: input.state,
      neighborhood: input.neighborhood,
      price: input.price,
      beds: input.beds,
      baths: input.baths,
      sqft: input.sqft,
      lotSize: input.lotSize,
      yearBuilt: input.yearBuilt,
      propertyType: input.propertyType,
      status: input.status,
    },
    comparisons: relatedListings.map((listing) => ({
      id: listing.id,
      address: listing.address,
      city: listing.city,
      state: listing.state,
      neighborhood: listing.neighborhood,
      price: listing.price,
      beds: listing.beds,
      baths: listing.baths,
      sqft: listing.sqft,
      propertyType: 'Related listing',
      status: listing.status,
    })),
  });
  const deepening = buildPropertyIntelligenceDeepening({
    address: input.address,
    city: input.city,
    neighborhood: input.neighborhood,
    propertyType: input.propertyType,
    status: input.status,
    price: input.price,
    sqft: input.sqft,
    beds: input.beds,
    baths: input.baths,
    yearBuilt: input.yearBuilt,
    lotSize: input.lotSize,
    updatedAt: input.updatedAt,
    lastIntelligenceSync: input.lastIntelligenceSync,
    photoCount,
    relatedListingCount: relatedListings.length,
  });
  const evidenceCompleteness = buildPropertyEvidenceCompletenessVerification({
    property: input,
    authoritativeSources,
    comparisonIntelligence,
  });

  const profile: PropertyProduct31ProfileItem[] = [
    {
      label: 'Decision profile',
      state: completeness.confidence === 'high' ? 'well-supported' : 'incomplete',
      summary:
        completeness.confidence === 'high'
          ? 'Core public facts are available for a first-pass property review.'
          : `${completeness.availableCount} of ${completeness.totalCount} core public facts are available; fill gaps before relying on comparison.`,
      verify: 'Confirm any missing listing facts, measurements, status, and property details before touring or writing.',
    },
    {
      label: 'Verification priority',
      state: input.hasPolybutyleneRisk || input.yearBuilt ? 'verify-next' : 'well-supported',
      summary: input.hasPolybutyleneRisk
        ? 'Public signals make records and plumbing review a priority.'
        : input.yearBuilt
          ? `The ${input.yearBuilt} construction era should guide systems and records questions.`
          : 'No special record-sensitive flag is exposed from the public property data.',
      verify: 'Review systems, permits, maintenance records, drainage, insurance, and inspection scope with appropriate professionals.',
    },
    {
      label: 'Comparison readiness',
      state: hasRelatedListings ? 'well-supported' : 'incomplete',
      summary: hasRelatedListings
        ? `${relatedListings.length} related public listing${relatedListings.length === 1 ? '' : 's'} can support factual comparison.`
        : 'No related public listings are available in the existing property-link context.',
      verify: 'Compare only factual similarities and differences; avoid treating related listings as a pricing conclusion.',
    },
  ];

  const dna: PropertyProduct31DnaDimension[] = [
    {
      label: 'Core public facts',
      evidence: completeness.confidence,
      interpretation: `${input.propertyType || 'Residential property'} in ${areaLabel} with ${formatNumber(input.beds) || 'bed count not provided'} beds, ${formatNumber(input.baths) || 'bath count not provided'} baths, and ${formatNumber(input.sqft) || 'square footage not provided'} listed square feet.`,
      verify: 'Confirm measurements, room counts, included spaces, status, and any listing updates.',
    },
    {
      label: 'Site and condition signals',
      evidence: siteConfidence,
      interpretation: input.hasPolybutyleneRisk
        ? 'Records-sensitive plumbing context should be separated from visual finishes.'
        : `Public site context includes ${input.soilType || 'limited soil text'} and ${input.altitude ? `${formatNumber(input.altitude)} ft elevation` : 'limited elevation context'}.`,
      verify: 'Review drainage, exterior exposure, roof, systems, permits, and site records with qualified professionals.',
    },
    {
      label: 'Ownership-cost questions',
      evidence: input.price ? 'moderate' : 'limited',
      interpretation: `${formatCurrency(input.price)} is a public listing fact, but ownership cost depends on taxes, insurance, HOA, financing terms, maintenance, and closing assumptions.`,
      verify: 'Confirm tax, insurance, HOA, financing, maintenance, and closing-cost assumptions independently.',
    },
    {
      label: 'Comparison context',
      evidence: hasRelatedListings ? 'moderate' : 'limited',
      interpretation: hasRelatedListings
        ? 'Related listings can help compare public facts, location context, size, and status.'
        : 'Search and market context are the available comparison path until related listings are present.',
      verify: 'Compare property type, size, condition, location, timing, and records before drawing conclusions.',
    },
  ];

  const confidenceFacets: PropertyProduct31ConfidenceFacet[] = [
    {
      label: 'Source',
      confidence: 'high',
      detail: 'Existing public listing facts, listing media, related property links, and public site context.',
      action: 'Use as orientation, not as inspection, appraisal, legal, tax, lending, insurance, or construction advice.',
    },
    {
      label: 'Freshness',
      confidence: input.lastIntelligenceSync || input.updatedAt ? 'moderate' : 'limited',
      detail: `Freshness is based on the ${syncLabel}; listing facts can change without this page becoming a complete record.`,
      action: 'Confirm status, price, availability, and updated records before relying on the page.',
    },
    {
      label: 'Completeness',
      confidence: completeness.confidence,
      detail: `${completeness.availableCount} of ${completeness.totalCount} core public facts are available for the decision profile.`,
      action: 'Treat missing facts as questions to verify before comparison.',
    },
    {
      label: 'Media and comparison',
      confidence: photoCount > 1 && hasRelatedListings ? 'moderate' : 'limited',
      detail: `${photoCount} listing photo${photoCount === 1 ? '' : 's'} and ${relatedListings.length} related public listing${relatedListings.length === 1 ? '' : 's'} are available.`,
      action: 'Use photos and related listings to prepare questions, not to decide condition or value.',
    },
  ];

  const checklist: PropertyProduct31ChecklistItem[] = [
    { category: 'Financial', prompt: 'Verify taxes, HOA, insurance, financing assumptions, closing costs, and maintenance expectations.' },
    { category: 'Construction', prompt: 'Verify roof, mechanical, electrical, plumbing, drainage, permits, exterior, and site records.' },
    { category: 'Market', prompt: 'Compare public listing facts, market context, timing, condition, and location before relying on a conclusion.' },
    { category: 'Property', prompt: 'Confirm measurements, listing status, included features, media accuracy, and professional review needs.' },
  ];

  return {
    profile,
    dna,
    authoritativeSources,
    comparisonIntelligence,
    deepening,
    evidenceCompleteness,
    confidence: {
      summary: 'Property Decision Profile uses existing public property data to reduce decision friction without scoring, ranking, valuing, forecasting, or recommending a property.',
      facets: confidenceFacets,
    },
    comparables: relatedListings.slice(0, 4).map((listing) => getComparableContext(input, listing)),
    checklist,
    trustBoundary:
      'Existing public property data only; no AI, no public GIS, no provider activation, no telemetry, no forecasting, no valuation model, no rankings, no schema changes, no Prisma changes, no API changes, and no fixture data.',
  };
}
