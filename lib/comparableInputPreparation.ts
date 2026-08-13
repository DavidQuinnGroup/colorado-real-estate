import {
  buildPropertyComparisonWorkspace,
  type PropertyComparisonEvidenceIntegrityState,
  type PropertyComparisonInput,
} from './propertyComparisonIntelligence';
import { getReieSourceRegistry, type ReieSourceRegistryRecord } from './sourceRegistry';

export const COMPARABLE_INPUT_PREPARATION_STATUS = 'EVIDENCE_BOUND_COMPARABLE_INPUT_PREPARATION_MVV';
export const COMPARABLE_INPUT_PREPARATION_VERSION = '1.0.0';

export type ComparableInputProperty = PropertyComparisonInput & {
  updatedAt?: Date | string | null;
  lastIntelligenceSync?: Date | string | null;
  sourceId?: ReieSourceRegistryRecord['sourceId'];
};

export type ComparableInputDifferenceState =
  | 'FACTUAL_DIFFERENCE'
  | 'CALCULATED_DIFFERENCE'
  | 'EVIDENCE_ASYMMETRY'
  | 'UNAVAILABLE_EVIDENCE'
  | 'VERIFICATION_REQUIRED';

export type ComparableInputAgentReviewStatus = 'READY_FOR_AGENT_REVIEW' | 'FAIL_CLOSED';

export type ComparableInputPacket = Readonly<{
  status: ComparableInputAgentReviewStatus;
  contract: typeof COMPARABLE_INPUT_PREPARATION_STATUS;
  version: typeof COMPARABLE_INPUT_PREPARATION_VERSION;
  packetId: string;
  generatedAt: string;
  failureReason: 'NO_CANDIDATES' | 'DUPLICATE_OR_SUBJECT_CANDIDATE' | null;
  subject: ComparableInputPropertyFacts | null;
  candidates: readonly ComparableInputPropertyFacts[];
  comparisons: readonly ComparableInputCandidateComparison[];
  limitations: readonly ComparableInputLimitation[];
  verificationQuestions: readonly string[];
  humanReviewChecklist: readonly string[];
  preparationBoundary: string;
}>;

export type ComparableInputPropertyFacts = Readonly<{
  identity: {
    id: string;
    address: string;
  };
  facts: {
    price: number | null;
    status: string | null;
    propertyType: string | null;
    beds: number | null;
    baths: number | null;
    squareFeet: number | null;
    lotSize: number | null;
    yearBuilt: number | null;
    geography: {
      city: string | null;
      state: string | null;
      neighborhood: string | null;
    };
    pricePerSquareFoot: number | null;
  };
  sourceAndFreshness: ComparableInputSourceAndFreshness;
}>;

export type ComparableInputSourceAndFreshness = Readonly<{
  sourceId: string | null;
  sourceName: string | null;
  sourceAuthorizationState: string | null;
  claimEligible: boolean | null;
  visibleTimestamp: string | null;
  visibleTimestampKind: 'LISTING_UPDATED' | 'REIE_INTELLIGENCE_SYNC' | 'NO_VISIBLE_TIMESTAMP';
}>;

export type ComparableInputDifference = Readonly<{
  field: string;
  state: ComparableInputDifferenceState;
  subjectValue: string;
  candidateValue: string;
  evidenceBasis: string;
  verificationPrompt: string;
}>;

export type ComparableInputCandidateComparison = Readonly<{
  candidateId: string;
  differences: readonly ComparableInputDifference[];
}>;

export type ComparableInputLimitation = Readonly<{
  candidateId: string;
  category: 'SOLD_VERIFICATION' | 'RECENCY' | 'CONDITION' | 'PUBLIC_RECORD' | 'PROPERTY_CHARACTERISTIC' | 'SOURCE_CONFIDENCE';
  state: 'UNAVAILABLE_EVIDENCE' | 'VERIFICATION_REQUIRED';
  detail: string;
}>;

export type ComparableInputPreparationRequest = Readonly<{
  generatedAt: string;
  subject: ComparableInputProperty;
  candidates: readonly ComparableInputProperty[];
}>;

const HUMAN_REVIEW_CHECKLIST = Object.freeze([
  'Comparable selection remains the human reviewer’s responsibility.',
  'Sold-data validation remains the human reviewer’s responsibility.',
  'Condition and location interpretation remain the human reviewer’s responsibility.',
  'CMA methodology remains the human reviewer’s responsibility.',
  'Pricing remains the human reviewer’s responsibility.',
  'Professional appraisal responsibility remains with qualified professionals.',
  'Negotiation remains the human reviewer’s responsibility.',
  'Offer strategy remains the human reviewer’s responsibility.',
  'Fiduciary advice remains the human reviewer’s responsibility.',
  'Customer communication remains the human reviewer’s responsibility.',
]);

function nullableNumber(value: number | null | undefined) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function nullableText(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed || null;
}

function pricePerSquareFoot(property: ComparableInputProperty) {
  const price = nullableNumber(property.price);
  const squareFeet = nullableNumber(property.sqft);
  if (price === null || squareFeet === null || price <= 0 || squareFeet <= 0) return null;
  return Math.round(price / squareFeet);
}

function toComparisonInput(property: ComparableInputProperty): PropertyComparisonInput {
  return {
    id: property.id,
    address: property.address,
    city: property.city,
    state: property.state,
    neighborhood: property.neighborhood,
    price: property.price,
    beds: property.beds,
    baths: property.baths,
    sqft: property.sqft,
    lotSize: property.lotSize,
    yearBuilt: property.yearBuilt,
    propertyType: property.propertyType,
    status: property.status,
  };
}

function asIso(value: Date | string | null | undefined) {
  if (!value) return null;
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function sourceAndFreshness(property: ComparableInputProperty): ComparableInputSourceAndFreshness {
  const registry = getReieSourceRegistry();
  const sourceId = property.sourceId ?? 'SRC-MLS-LISTING-DATA';
  const source = registry.records.find((record) => record.sourceId === sourceId) ?? null;
  const listingUpdated = asIso(property.updatedAt);
  const intelligenceSync = asIso(property.lastIntelligenceSync);

  return {
    sourceId: source?.sourceId ?? null,
    sourceName: source?.publicName ?? null,
    sourceAuthorizationState: source?.productionActivationState ?? null,
    claimEligible: source?.claimEligible ?? null,
    visibleTimestamp: listingUpdated ?? intelligenceSync,
    visibleTimestampKind: listingUpdated ? 'LISTING_UPDATED' : intelligenceSync ? 'REIE_INTELLIGENCE_SYNC' : 'NO_VISIBLE_TIMESTAMP',
  };
}

function propertyFacts(property: ComparableInputProperty): ComparableInputPropertyFacts {
  return {
    identity: {
      id: property.id,
      address: property.address,
    },
    facts: {
      price: nullableNumber(property.price),
      status: nullableText(property.status),
      propertyType: nullableText(property.propertyType),
      beds: nullableNumber(property.beds),
      baths: nullableNumber(property.baths),
      squareFeet: nullableNumber(property.sqft),
      lotSize: nullableNumber(property.lotSize),
      yearBuilt: nullableNumber(property.yearBuilt),
      geography: {
        city: nullableText(property.city),
        state: nullableText(property.state),
        neighborhood: nullableText(property.neighborhood),
      },
      pricePerSquareFoot: pricePerSquareFoot(property),
    },
    sourceAndFreshness: sourceAndFreshness(property),
  };
}

function differenceState(state: PropertyComparisonEvidenceIntegrityState): ComparableInputDifferenceState {
  if (state === 'SUPPORTED DIFFERENCE') return 'FACTUAL_DIFFERENCE';
  if (state === 'DERIVED / CALCULATED DIFFERENCE') return 'CALCULATED_DIFFERENCE';
  if (state === 'EVIDENCE ASYMMETRY') return 'EVIDENCE_ASYMMETRY';
  if (state === 'UNAVAILABLE COMPARISON') return 'UNAVAILABLE_EVIDENCE';
  return 'VERIFICATION_REQUIRED';
}

function verificationPromptFor(field: string) {
  const prompts: Record<string, string> = {
    Price: 'Confirm the listed price from the applicable current source.',
    'Price per square foot': 'Confirm measurements, finished-area treatment, condition context, and property details before relying on this arithmetic.',
    Beds: 'Confirm room counts and included spaces.',
    Baths: 'Confirm bathroom count, layout, and condition.',
    'Square footage': 'Confirm measurements, included spaces, and finished-area treatment.',
    'Lot size': 'Confirm lot size through current source records.',
    'Year built': 'Use construction era to focus inspection, permit, systems, and records questions.',
    'Property type': 'Confirm ownership structure, HOA, insurance, lending, and maintenance implications.',
    'Listing status': 'Confirm availability and timing before relying on status.',
    'Place context': 'Confirm location context from appropriate current sources.',
  };

  return prompts[field] ?? 'Confirm the displayed fact through an appropriate current source.';
}

function candidateLimitations(candidate: ComparableInputProperty): ComparableInputLimitation[] {
  const freshness = sourceAndFreshness(candidate);
  const limitations: ComparableInputLimitation[] = [
    {
      candidateId: candidate.id,
      category: 'SOLD_VERIFICATION',
      state: 'UNAVAILABLE_EVIDENCE',
      detail: 'Sold verification is not established by this packet; verify active or sold status from an authorized current record.',
    },
    {
      candidateId: candidate.id,
      category: 'RECENCY',
      state: 'VERIFICATION_REQUIRED',
      detail:
        freshness.visibleTimestamp === null
          ? 'No visible listing or intelligence timestamp is supplied; recency requires verification.'
          : 'A visible timestamp is supplied, but its sufficiency for the intended analysis requires human review.',
    },
    {
      candidateId: candidate.id,
      category: 'CONDITION',
      state: 'UNAVAILABLE_EVIDENCE',
      detail: 'Listing facts do not establish condition, improvements, systems, or inspection findings.',
    },
    {
      candidateId: candidate.id,
      category: 'PUBLIC_RECORD',
      state: 'UNAVAILABLE_EVIDENCE',
      detail: 'This packet does not retrieve public-record facts; source confirmation remains required.',
    },
  ];

  if (candidate.sqft === null || candidate.sqft === undefined || candidate.lotSize === null || candidate.lotSize === undefined || candidate.yearBuilt === null || candidate.yearBuilt === undefined) {
    limitations.push({
      candidateId: candidate.id,
      category: 'PROPERTY_CHARACTERISTIC',
      state: 'VERIFICATION_REQUIRED',
      detail: 'At least one displayed property characteristic is unavailable and requires source confirmation.',
    });
  }

  if (freshness.sourceId === null || freshness.claimEligible !== true) {
    limitations.push({
      candidateId: candidate.id,
      category: 'SOURCE_CONFIDENCE',
      state: 'VERIFICATION_REQUIRED',
      detail: 'A governed claim-eligible source posture is not established for this candidate input.',
    });
  }

  return limitations;
}

function questionsFor(candidate: ComparableInputProperty, limitations: readonly ComparableInputLimitation[]) {
  const questions = [
    `Is ${candidate.address} active or sold status verified from an authorized current record?`,
    `Is the visible timestamp for ${candidate.address} sufficient for the agent’s intended analysis?`,
    `Are square-footage sources for ${candidate.address} and the subject property comparable?`,
    `Are major condition or improvement differences for ${candidate.address} known?`,
    `Are location differences for ${candidate.address} material and verified?`,
  ];

  if (limitations.some((limitation) => limitation.category === 'PUBLIC_RECORD')) {
    questions.push(`Is public-record evidence for ${candidate.address} incomplete and in need of source confirmation?`);
  }

  return questions;
}

function invalidCandidateSet(subject: ComparableInputProperty, candidates: readonly ComparableInputProperty[]) {
  const ids = new Set<string>();
  for (const candidate of candidates) {
    if (candidate.id === subject.id || ids.has(candidate.id)) return true;
    ids.add(candidate.id);
  }
  return false;
}

function packetId(request: ComparableInputPreparationRequest, failureReason: ComparableInputPacket['failureReason']) {
  const candidates = request.candidates.map((candidate) => candidate.id).join(',') || 'NO_CANDIDATES';
  return `${COMPARABLE_INPUT_PREPARATION_STATUS}|${COMPARABLE_INPUT_PREPARATION_VERSION}|${request.subject.id}|${candidates}|${request.generatedAt}|${failureReason ?? 'READY'}`;
}

function validateRequest(request: ComparableInputPreparationRequest) {
  if (!request.subject.id || !request.subject.address) throw new Error('Comparable Input Preparation requires a subject identity and address.');
  if (!request.generatedAt || Number.isNaN(Date.parse(request.generatedAt))) throw new Error('Comparable Input Preparation requires an ISO-compatible generatedAt input.');
}

export function buildComparableInputPacket(request: ComparableInputPreparationRequest): ComparableInputPacket {
  validateRequest(request);

  const failureReason: ComparableInputPacket['failureReason'] =
    request.candidates.length === 0 ? 'NO_CANDIDATES' : invalidCandidateSet(request.subject, request.candidates) ? 'DUPLICATE_OR_SUBJECT_CANDIDATE' : null;

  if (failureReason) {
    return {
      status: 'FAIL_CLOSED',
      contract: COMPARABLE_INPUT_PREPARATION_STATUS,
      version: COMPARABLE_INPUT_PREPARATION_VERSION,
      packetId: packetId(request, failureReason),
      generatedAt: request.generatedAt,
      failureReason,
      subject: null,
      candidates: [],
      comparisons: [],
      limitations: [],
      verificationQuestions: [],
      humanReviewChecklist: HUMAN_REVIEW_CHECKLIST,
      preparationBoundary: 'No evidence packet is prepared until a human explicitly supplies a subject and one or more distinct candidates.',
    };
  }

  const comparison = buildPropertyComparisonWorkspace({
    subject: toComparisonInput(request.subject),
    comparisons: request.candidates.map(toComparisonInput),
  });
  const limitations = request.candidates.flatMap(candidateLimitations);

  return {
    status: 'READY_FOR_AGENT_REVIEW',
    contract: COMPARABLE_INPUT_PREPARATION_STATUS,
    version: COMPARABLE_INPUT_PREPARATION_VERSION,
    packetId: packetId(request, null),
    generatedAt: request.generatedAt,
    failureReason: null,
    subject: propertyFacts(request.subject),
    candidates: request.candidates.map(propertyFacts),
    comparisons: comparison.comparisons.map((candidate) => ({
      candidateId: candidate.propertyId,
      differences: candidate.dimensions
        .filter((dimension) => dimension.key !== 'financingScenario')
        .map((dimension) => ({
          field: dimension.label,
          state: differenceState(dimension.evidenceIntegrity),
          subjectValue: dimension.subjectValue,
          candidateValue: dimension.comparisonValue,
          evidenceBasis: dimension.evidenceBasis,
          verificationPrompt: verificationPromptFor(dimension.label),
        })),
    })),
    limitations,
    verificationQuestions: request.candidates.flatMap((candidate) => questionsFor(candidate, limitations.filter((limitation) => limitation.candidateId === candidate.id))),
    humanReviewChecklist: HUMAN_REVIEW_CHECKLIST,
    preparationBoundary: 'This packet organizes explicitly supplied factual evidence and verification prompts for agent review only.',
  };
}
