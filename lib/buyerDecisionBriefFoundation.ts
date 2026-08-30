export const BUYER_DECISION_BRIEF_FOUNDATION_VERSION = 'BUYER_DECISION_BRIEF_V1' as const;
export const BUYER_DECISION_BRIEF_CERTIFICATION_FIXTURE_IDS = [
  'ATLAS_CERTIFICATION_BUYER_BRIEF_A',
  'ATLAS_CERTIFICATION_BUYER_BRIEF_B',
] as const;

export type BuyerDecisionBriefCertificationFixtureId = (typeof BUYER_DECISION_BRIEF_CERTIFICATION_FIXTURE_IDS)[number];

export type BuyerDecisionBrief = Readonly<{
  schemaVersion: typeof BUYER_DECISION_BRIEF_FOUNDATION_VERSION;
  fixtureId: BuyerDecisionBriefCertificationFixtureId;
  title: 'Buyer Decision Brief';
  qualifier: 'AGENT_REVIEW_REQUIRED';
  asOf: string;
  decisionContext: Readonly<{
    decisionType: 'PROPERTY_EVALUATION';
    objective: string;
    occupancyIntent: 'OWNER_OCCUPIED_REPORTED';
    timing: 'THREE_TO_SIX_MONTHS_REPORTED';
    offerPriceContextCents: number;
    priorities: readonly string[];
  }>;
  property: Readonly<{
    reference: 'psr_synthetic_property_reference';
    address: 'ADDRESS_WITHHELD_SYNTHETIC_FIXTURE';
    propertyType: 'SINGLE_FAMILY';
    beds: 'UNKNOWN';
    baths: 'UNKNOWN';
    squareFeet: 'UNKNOWN';
    listingStatus: 'NOT_REQUIRED_FOR_BRIEF';
    qualification: 'SYNTHETIC_IDENTITY_ONLY';
  }>;
  location: Readonly<{
    city: 'Boulder';
    qualification: 'SYNTHETIC_IDENTITY_ONLY';
    limitation: string;
  }>;
  market: Readonly<{
    status: 'OMITTED_PENDING_CURRENT_ADMITTED_SNAPSHOT';
    averageDom: 'UNKNOWN';
    limitation: string;
  }>;
  financing: Readonly<{
    status: 'DEFERRED_PENDING_CALCULATION_CONTRACT';
    lenderRate: 'UNKNOWN';
    estimatedPayment: 'NOT_CALCULATED';
    professionalInputBinding: 'NONE';
    limitation: string;
  }>;
  risksUncertainties: readonly string[];
  tradeoffs: readonly Readonly<{ topic: string; qualification: 'AGENT_CONSIDERATION'; question: string }>[];
  followUp: readonly string[];
  limitations: readonly string[];
}>;

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => `${JSON.stringify(key)}:${stableJson(item)}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

export function buyerDecisionBriefFingerprint(brief: BuyerDecisionBrief) {
  let hash = 2_166_136_261;
  for (const character of stableJson(brief)) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16_777_619);
  }
  return `buyer-decision-brief-v1-${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

function fixture(id: BuyerDecisionBriefCertificationFixtureId, offerPriceContextCents: number): BuyerDecisionBrief {
  return Object.freeze({
    schemaVersion: BUYER_DECISION_BRIEF_FOUNDATION_VERSION,
    fixtureId: id,
    title: 'Buyer Decision Brief',
    qualifier: 'AGENT_REVIEW_REQUIRED',
    asOf: '2026-08-30',
    decisionContext: Object.freeze({
      decisionType: 'PROPERTY_EVALUATION',
      objective: 'Organize a bounded property-evaluation conversation without an automated purchase recommendation.',
      occupancyIntent: 'OWNER_OCCUPIED_REPORTED',
      timing: 'THREE_TO_SIX_MONTHS_REPORTED',
      offerPriceContextCents,
      priorities: Object.freeze(['PROPERTY_NEEDS', 'FINANCING_READINESS', 'PROFESSIONAL_DUE_DILIGENCE']),
    }),
    property: Object.freeze({
      reference: 'psr_synthetic_property_reference',
      address: 'ADDRESS_WITHHELD_SYNTHETIC_FIXTURE',
      propertyType: 'SINGLE_FAMILY',
      beds: 'UNKNOWN',
      baths: 'UNKNOWN',
      squareFeet: 'UNKNOWN',
      listingStatus: 'NOT_REQUIRED_FOR_BRIEF',
      qualification: 'SYNTHETIC_IDENTITY_ONLY',
    }),
    location: Object.freeze({
      city: 'Boulder',
      qualification: 'SYNTHETIC_IDENTITY_ONLY',
      limitation: 'City context is a synthetic identity reference, not a location recommendation or neighborhood claim.',
    }),
    market: Object.freeze({
      status: 'OMITTED_PENDING_CURRENT_ADMITTED_SNAPSHOT',
      averageDom: 'UNKNOWN',
      limitation: 'No current market metric is bound to this certification fixture.',
    }),
    financing: Object.freeze({
      status: 'DEFERRED_PENDING_CALCULATION_CONTRACT',
      lenderRate: 'UNKNOWN',
      estimatedPayment: 'NOT_CALCULATED',
      professionalInputBinding: 'NONE',
      limitation: 'No Buyer payment calculation or lender ProfessionalInput is asserted by this brief.',
    }),
    risksUncertainties: Object.freeze(['PROPERTY_FACTS_REQUIRE_VERIFICATION', 'HOA_COST_UNKNOWN', 'LENDER_TERMS_UNKNOWN', 'MARKET_SNAPSHOT_NOT_BOUND']),
    tradeoffs: Object.freeze([
      Object.freeze({ topic: 'Property fit versus cost', qualification: 'AGENT_CONSIDERATION', question: 'Which property features are essential, flexible, or not yet known?' }),
      Object.freeze({ topic: 'Timing versus verification', qualification: 'AGENT_CONSIDERATION', question: 'Which lender and property questions must be resolved before the next decision?' }),
    ]),
    followUp: Object.freeze(['Confirm lender terms directly with a lender.', 'Verify property facts and condition through appropriate sources.', 'Obtain HOA information if applicable.']),
    limitations: Object.freeze(['Synthetic certification fixture only.', 'No automated recommendation, score, financing approval, payment calculation, or public delivery.']),
  });
}

export const BUYER_DECISION_BRIEF_CERTIFICATION_FIXTURES = Object.freeze({
  ATLAS_CERTIFICATION_BUYER_BRIEF_A: fixture('ATLAS_CERTIFICATION_BUYER_BRIEF_A', 650_000_00),
  ATLAS_CERTIFICATION_BUYER_BRIEF_B: fixture('ATLAS_CERTIFICATION_BUYER_BRIEF_B', 660_000_00),
} satisfies Record<BuyerDecisionBriefCertificationFixtureId, BuyerDecisionBrief>);

export function buyerDecisionBriefFixture(id: BuyerDecisionBriefCertificationFixtureId) {
  return BUYER_DECISION_BRIEF_CERTIFICATION_FIXTURES[id];
}

export function isBuyerDecisionBrief(value: unknown): value is BuyerDecisionBrief {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  return record.schemaVersion === BUYER_DECISION_BRIEF_FOUNDATION_VERSION
    && BUYER_DECISION_BRIEF_CERTIFICATION_FIXTURE_IDS.includes(record.fixtureId as BuyerDecisionBriefCertificationFixtureId)
    && record.title === 'Buyer Decision Brief';
}
