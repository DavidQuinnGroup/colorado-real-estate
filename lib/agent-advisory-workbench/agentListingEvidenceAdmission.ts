import {
  AGENT_PROPERTY_LISTING_SOURCE_ID,
  buildAgentPropertyPreparationPacket,
  type AgentPropertyPreparationProperty,
  type AgentPropertyPreparationSourcePosture,
} from './agentPropertyPreparationAdmission';

export const AGENT_LISTING_EVIDENCE_ADMISSION_STATUS = 'REIE_AGENT_LISTING_EVIDENCE_AND_SOURCE_ADMISSION_READINESS_MVV' as const;
export const AGENT_LISTING_EVIDENCE_ADMISSION_CAPABILITY = 'AGENT_LISTING_EVIDENCE_PREPARATION' as const;
export const AGENT_LISTING_EVIDENCE_ADMISSION_ROUTE = '/agent/prepare/listing' as const;

export type AgentListingEvidenceAdmissionState =
  | 'ADMITTED'
  | 'ADMITTED_WITH_LIMITATIONS'
  | 'VERIFICATION_REQUIRED'
  | 'STALE'
  | 'CONFLICTING'
  | 'RIGHTS_RESTRICTED'
  | 'JURISDICTION_UNCERTAIN'
  | 'INSUFFICIENT_PROVENANCE'
  | 'IDENTITY_CONFLICT'
  | 'IDENTITY_MISSING'
  | 'NOT_ADMITTED';

export type AgentListingEvidenceAdmissionReason =
  | 'AGENT_CONTEXT_REQUIRED'
  | 'PERSISTENCE_PROHIBITED'
  | 'PROVIDER_RUNTIME_PROHIBITED'
  | 'PUBLIC_ACTIVATION_PROHIBITED'
  | 'IDENTITY_MISSING'
  | 'IDENTITY_CONFLICT'
  | 'CANONICAL_PROPERTY_REFERENCE_REQUIRED'
  | 'LISTING_REFERENCE_REQUIRED'
  | 'IDENTITY_PROVENANCE_REQUIRED'
  | 'UNSUPPORTED_JURISDICTION'
  | 'SOURCE_IDENTITY_REQUIRED'
  | 'SOURCE_CLASS_NOT_ADMITTED'
  | 'SOURCE_AUTHORITY_REQUIRED'
  | 'ACQUISITION_METHOD_REQUIRED'
  | 'RIGHTS_RESTRICTED'
  | 'DISPLAY_RIGHTS_REQUIRED'
  | 'ATTRIBUTION_REQUIRED'
  | 'OBSERVED_DATE_REQUIRED'
  | 'STALE_EVIDENCE'
  | 'CONFLICTING_EVIDENCE'
  | 'INSUFFICIENT_PROVENANCE'
  | 'PROFESSIONAL_VERIFICATION_REQUIRED';

export type AgentListingEvidenceItem = Readonly<{
  evidenceId: string;
  subjectReference: string;
  assertion: string;
  sourceId: typeof AGENT_PROPERTY_LISTING_SOURCE_ID;
  sourceClass: 'EXISTING_REPOSITORY_LISTING_FACTS';
  sourceAuthority: 'PROJECT_ATLAS_CERTIFIED_REPOSITORY_PROPERTY_PRODUCT';
  acquisitionMethod: 'EXISTING_REPOSITORY_READ';
  rights: 'PRIVATE_AGENT_PREPARATION_ONLY';
  displayRights: 'PRIVATE_AGENT_DISPLAY_WITH_SOURCE_REFERENCE';
  attributionRequirement: 'SOURCE_REFERENCE_REQUIRED';
  observedAt: string;
  effectiveAt: null;
  freshness: 'CURRENT';
  expiration: 'VERIFY_BEFORE_RELIANCE';
  jurisdiction: Readonly<{ state: 'CO'; municipalityOrCounty: string }>;
  listingReference: string;
  confidence: 'EXACT_REPOSITORY_PROPERTY';
  verificationState: 'DIRECT_VERIFICATION_REQUIRED';
  conflictState: 'NO_KNOWN_CONFLICT';
  professionalVerificationRequired: true;
  permittedUses: readonly ['PRIVATE_AGENT_LISTING_PREPARATION'];
  prohibitedUses: readonly ['PUBLIC_DISPLAY', 'MLS_ACTIVITY', 'LISTING_CREATION', 'MARKETING_ACTIVATION', 'PRICING_OR_VALUATION_CONCLUSION', 'SUITABILITY_OR_DEMOGRAPHIC_INFERENCE'];
  provenance: readonly string[];
  transformationLineage: readonly ['EXISTING_REPOSITORY_READ', 'LISTING_EVIDENCE_ADMISSION'];
  citation: string;
}>;

export type AgentListingEvidenceAdmissionInput = Readonly<{
  candidate: Readonly<{
    property: AgentPropertyPreparationProperty;
    sourcePosture: AgentPropertyPreparationSourcePosture;
  }> | null;
  actorRole: 'AGENT' | 'ADMIN' | 'UNKNOWN';
  sessionMechanism: 'HUMAN_AGENT_SESSION' | 'OTHER';
  persistenceRequested: boolean;
  providerRuntimeRequired: boolean;
  publicActivationRequested: boolean;
}>;

export type AgentListingEvidenceAdmissionResult = Readonly<{
  status: typeof AGENT_LISTING_EVIDENCE_ADMISSION_STATUS;
  capability: typeof AGENT_LISTING_EVIDENCE_ADMISSION_CAPABILITY;
  route: typeof AGENT_LISTING_EVIDENCE_ADMISSION_ROUTE;
  state: AgentListingEvidenceAdmissionState;
  admitted: boolean;
  identity: Readonly<{
    canonicalPropertyReference: string;
    listingReference: string;
    address: string;
    jurisdiction: string;
    provenance: string;
    confidence: 'EXACT_REPOSITORY_PROPERTY';
  }> | null;
  evidence: readonly AgentListingEvidenceItem[];
  verificationRequired: readonly string[];
  missingEvidence: readonly string[];
  professionalCheckpoints: readonly string[];
  reasons: readonly AgentListingEvidenceAdmissionReason[];
  protectedBoundaries: Readonly<{
    persistence: false;
    providerRuntime: false;
    publicActivation: false;
    mlsActivity: false;
    listingCreation: false;
    marketingActivation: false;
    pricingOrValuationConclusion: false;
    fairHousingOrSuitabilityInference: false;
  }>;
}>;

const PROTECTED_BOUNDARIES = Object.freeze({
  persistence: false,
  providerRuntime: false,
  publicActivation: false,
  mlsActivity: false,
  listingCreation: false,
  marketingActivation: false,
  pricingOrValuationConclusion: false,
  fairHousingOrSuitabilityInference: false,
} as const);

function propertyFailureState(reasons: readonly string[]): AgentListingEvidenceAdmissionState {
  if (reasons.includes('UNKNOWN_OR_AMBIGUOUS_PROPERTY')) return 'IDENTITY_CONFLICT';
  if (reasons.includes('CANONICAL_PROPERTY_SLUG_REQUIRED') || reasons.includes('CANONICAL_PROPERTY_IDENTITY_INCOMPLETE')) return 'IDENTITY_MISSING';
  if (reasons.includes('STALE_OR_UNKNOWN_MATERIAL_EVIDENCE')) return 'STALE';
  if (reasons.includes('CONFLICTING_MATERIAL_EVIDENCE')) return 'CONFLICTING';
  if (reasons.includes('SOURCE_RIGHTS_OR_CERTIFICATION_REQUIRED')) return 'RIGHTS_RESTRICTED';
  if (reasons.includes('PROPERTY_STATUS_NOT_ADMISSIBLE') || reasons.includes('PRIVATE_OR_NONPUBLIC_PROPERTY_PROHIBITED')) return 'JURISDICTION_UNCERTAIN';
  if (reasons.includes('MISSING_SOURCE_IDENTITY') || reasons.includes('LISTING_REFERENCE_MISMATCH') || reasons.includes('OBSERVED_DATE_REQUIRED')) return 'INSUFFICIENT_PROVENANCE';
  return 'NOT_ADMITTED';
}

function reasonsForPropertyFailure(reasons: readonly string[]): AgentListingEvidenceAdmissionReason[] {
  const mapped: AgentListingEvidenceAdmissionReason[] = [];
  if (reasons.includes('UNKNOWN_OR_AMBIGUOUS_PROPERTY')) mapped.push('IDENTITY_CONFLICT');
  if (reasons.includes('CANONICAL_PROPERTY_SLUG_REQUIRED') || reasons.includes('CANONICAL_PROPERTY_IDENTITY_INCOMPLETE')) mapped.push('CANONICAL_PROPERTY_REFERENCE_REQUIRED');
  if (reasons.includes('STALE_OR_UNKNOWN_MATERIAL_EVIDENCE')) mapped.push('STALE_EVIDENCE');
  if (reasons.includes('CONFLICTING_MATERIAL_EVIDENCE')) mapped.push('CONFLICTING_EVIDENCE');
  if (reasons.includes('SOURCE_RIGHTS_OR_CERTIFICATION_REQUIRED')) mapped.push('RIGHTS_RESTRICTED');
  if (reasons.includes('PROPERTY_STATUS_NOT_ADMISSIBLE') || reasons.includes('PRIVATE_OR_NONPUBLIC_PROPERTY_PROHIBITED')) mapped.push('UNSUPPORTED_JURISDICTION');
  if (reasons.includes('MISSING_SOURCE_IDENTITY')) mapped.push('SOURCE_IDENTITY_REQUIRED');
  if (reasons.includes('LISTING_REFERENCE_MISMATCH')) mapped.push('IDENTITY_PROVENANCE_REQUIRED');
  if (reasons.includes('OBSERVED_DATE_REQUIRED')) mapped.push('OBSERVED_DATE_REQUIRED');
  return mapped.length ? mapped : ['INSUFFICIENT_PROVENANCE'];
}

function fail(state: AgentListingEvidenceAdmissionState, reasons: readonly AgentListingEvidenceAdmissionReason[]): AgentListingEvidenceAdmissionResult {
  return Object.freeze({
    status: AGENT_LISTING_EVIDENCE_ADMISSION_STATUS,
    capability: AGENT_LISTING_EVIDENCE_ADMISSION_CAPABILITY,
    route: AGENT_LISTING_EVIDENCE_ADMISSION_ROUTE,
    state,
    admitted: false,
    identity: null,
    evidence: [],
    verificationRequired: [],
    missingEvidence: ['No property or listing fact is admitted until identity, source, rights, freshness, and conflict gates pass.'],
    professionalCheckpoints: [],
    reasons: Object.freeze([...new Set(reasons)].sort()),
    protectedBoundaries: PROTECTED_BOUNDARIES,
  });
}

function evidenceItem(
  evidenceId: string,
  assertion: string,
  subjectReference: string,
  listingReference: string,
  observedAt: string,
  municipalityOrCounty: string,
): AgentListingEvidenceItem {
  return Object.freeze({
    evidenceId,
    subjectReference,
    assertion,
    sourceId: AGENT_PROPERTY_LISTING_SOURCE_ID,
    sourceClass: 'EXISTING_REPOSITORY_LISTING_FACTS',
    sourceAuthority: 'PROJECT_ATLAS_CERTIFIED_REPOSITORY_PROPERTY_PRODUCT',
    acquisitionMethod: 'EXISTING_REPOSITORY_READ',
    rights: 'PRIVATE_AGENT_PREPARATION_ONLY',
    displayRights: 'PRIVATE_AGENT_DISPLAY_WITH_SOURCE_REFERENCE',
    attributionRequirement: 'SOURCE_REFERENCE_REQUIRED',
    observedAt,
    effectiveAt: null,
    freshness: 'CURRENT',
    expiration: 'VERIFY_BEFORE_RELIANCE',
    jurisdiction: Object.freeze({ state: 'CO', municipalityOrCounty }),
    listingReference,
    confidence: 'EXACT_REPOSITORY_PROPERTY',
    verificationState: 'DIRECT_VERIFICATION_REQUIRED',
    conflictState: 'NO_KNOWN_CONFLICT',
    professionalVerificationRequired: true,
    permittedUses: Object.freeze(['PRIVATE_AGENT_LISTING_PREPARATION'] as const),
    prohibitedUses: Object.freeze(['PUBLIC_DISPLAY', 'MLS_ACTIVITY', 'LISTING_CREATION', 'MARKETING_ACTIVATION', 'PRICING_OR_VALUATION_CONCLUSION', 'SUITABILITY_OR_DEMOGRAPHIC_INFERENCE'] as const),
    provenance: Object.freeze([AGENT_PROPERTY_LISTING_SOURCE_ID, listingReference, subjectReference]),
    transformationLineage: Object.freeze(['EXISTING_REPOSITORY_READ', 'LISTING_EVIDENCE_ADMISSION'] as const),
    citation: `Stored repository listing facts, reference ${listingReference}.`,
  });
}

export function evaluateAgentListingEvidenceAdmission(input: AgentListingEvidenceAdmissionInput): AgentListingEvidenceAdmissionResult {
  const contextReasons: AgentListingEvidenceAdmissionReason[] = [];
  if (input.actorRole !== 'AGENT' || input.sessionMechanism !== 'HUMAN_AGENT_SESSION') contextReasons.push('AGENT_CONTEXT_REQUIRED');
  if (input.persistenceRequested) contextReasons.push('PERSISTENCE_PROHIBITED');
  if (input.providerRuntimeRequired) contextReasons.push('PROVIDER_RUNTIME_PROHIBITED');
  if (input.publicActivationRequested) contextReasons.push('PUBLIC_ACTIVATION_PROHIBITED');
  if (contextReasons.length) return fail('NOT_ADMITTED', contextReasons);
  if (!input.candidate) return fail('IDENTITY_MISSING', ['IDENTITY_MISSING']);
  if (input.candidate.property.state !== 'CO') return fail('JURISDICTION_UNCERTAIN', ['UNSUPPORTED_JURISDICTION']);

  const packet = buildAgentPropertyPreparationPacket({
    property: input.candidate.property,
    sourcePosture: input.candidate.sourcePosture,
    request: {
      actorRole: 'AGENT',
      capability: 'AGENT_PROPERTY_CONVERSATION_PREPARATION',
      route: '/agent/prepare/property',
      adminContext: false,
      customerContext: false,
      persistenceRequested: false,
      providerRuntimeRequired: false,
      publicRecordRequested: false,
      recommendationRequested: false,
      fairHousingSensitiveRequest: false,
    },
  });
  const sourcePosture = packet.sourcePosture;
  const observedAt = sourcePosture?.observedAt;
  const listingReference = sourcePosture?.listingReference;
  if (packet.admission !== 'ADMITTED' || !packet.snapshot || !sourcePosture || !observedAt || !listingReference) {
    return fail(propertyFailureState(packet.failureReasons), reasonsForPropertyFailure(packet.failureReasons));
  }

  const { snapshot } = packet;
  const subjectReference = `property:${snapshot.slug}`;
  const municipalityOrCounty = snapshot.city;
  const identity = Object.freeze({
    canonicalPropertyReference: subjectReference,
    listingReference,
    address: `${snapshot.address}, ${snapshot.city}, ${snapshot.state} ${snapshot.zip}`,
    jurisdiction: `${snapshot.city}, Colorado`,
    provenance: `${AGENT_PROPERTY_LISTING_SOURCE_ID}:${listingReference}`,
    confidence: 'EXACT_REPOSITORY_PROPERTY' as const,
  });
  const evidence = Object.freeze([
    evidenceItem('listing-identity', `Repository property identity: ${identity.address}.`, subjectReference, listingReference, observedAt, municipalityOrCounty),
    evidenceItem('listing-position', `Stored listing status: ${snapshot.status}.`, subjectReference, listingReference, observedAt, municipalityOrCounty),
    evidenceItem('listing-price', `Stored list price: ${snapshot.price}.`, subjectReference, listingReference, observedAt, municipalityOrCounty),
    evidenceItem('listing-configuration', `Stored property type: ${snapshot.propertyType}.`, subjectReference, listingReference, observedAt, municipalityOrCounty),
  ]);

  return Object.freeze({
    status: AGENT_LISTING_EVIDENCE_ADMISSION_STATUS,
    capability: AGENT_LISTING_EVIDENCE_ADMISSION_CAPABILITY,
    route: AGENT_LISTING_EVIDENCE_ADMISSION_ROUTE,
    state: 'ADMITTED_WITH_LIMITATIONS',
    admitted: true,
    identity,
    evidence,
    verificationRequired: Object.freeze([
      'Confirm the current listing status, list price, and stated configuration directly before relying on them.',
      'Confirm condition, measurements, inclusions, records, disclosures, access, and any material change through the appropriate current source or professional.',
    ]),
    missingEvidence: Object.freeze([
      'No assessor, tax, parcel, ownership, permit, title, HOA, insurance, flood, environmental, price-history, event, listing-remarks, or media evidence is admitted here.',
      'No listing, MLS, marketing, launch, pricing, valuation, or public-display authority is created by this preparation view.',
    ]),
    professionalCheckpoints: Object.freeze(packet.professionalCheckpoints.map((checkpoint) => checkpoint.question)),
    reasons: Object.freeze(['PROFESSIONAL_VERIFICATION_REQUIRED'] as const),
    protectedBoundaries: PROTECTED_BOUNDARIES,
  });
}
