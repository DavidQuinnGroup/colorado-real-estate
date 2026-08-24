/**
 * Provider-neutral, side-effect-free physical-property identity contract.
 * It describes a future read boundary; it neither retrieves nor admits source data.
 */

export const CANONICAL_PHYSICAL_PROPERTY_IDENTITY_STATUS =
  'REIE_CANONICAL_PHYSICAL_PROPERTY_IDENTITY_AND_SOURCE_OBSERVATION_ARCHITECTURE_MVV' as const;

export const PROPERTY_IDENTITY_GAPS = Object.freeze([
  'PROPERTY_IDENTITY_SOURCE_ADMISSION_REQUIRED',
  'STATEWIDE_PROPERTY_IDENTITY_DATA_REQUIRED',
  'HISTORICAL_MLS_USE_RECONCILIATION_REQUIRED',
] as const);

export type CanonicalIdentityState = 'UNRESOLVED' | 'REVIEW_REQUIRED' | 'CONFLICTING' | 'CERTIFICATION_READY';
export type CanonicalIdentityConfidence = 'UNVERIFIED' | 'POSSIBLE' | 'PROBABLE' | 'CONFIRMED' | 'CONFLICTING';
export type CanonicalAssociationType =
  | 'CANONICAL_PROPERTY_HAS_SOURCE_IDENTITY'
  | 'PROPERTY_ASSOCIATED_WITH_PARCEL'
  | 'PROPERTY_ASSOCIATED_WITH_STRUCTURE'
  | 'PROPERTY_ASSOCIATED_WITH_UNIT';
export type CanonicalObservationKind = 'IDENTITY' | 'ADDRESS' | 'PROPERTY_FACT' | 'LISTING_EVENT';
export type CanonicalListingEventStatus = 'CURRENT' | 'HISTORICAL' | 'UNRESOLVED' | 'CONFLICTING' | 'SUPERSEDED';
export type CanonicalFreshness = 'CURRENT' | 'AGING' | 'STALE' | 'UNKNOWN';

export type CanonicalPropertySourceIdentity = Readonly<{
  sourceIdentityId: string;
  sourceId: string;
  identifierType: 'ASSESSOR_ACCOUNT' | 'PARCEL' | 'BUILDING' | 'UNIT' | 'MLS_LISTING' | 'SOURCE_PROPERTY_RECORD' | 'OTHER';
  sourceValue: string;
  associationType: CanonicalAssociationType;
  associationStatus: 'OBSERVED' | 'POSSIBLE' | 'CONFIRMED' | 'CONFLICTING' | 'SUPERSEDED';
  confidence: CanonicalIdentityConfidence;
  rights: 'CERTIFIED' | 'UNKNOWN' | 'RESTRICTED';
  freshness: CanonicalFreshness;
  observedAt: string | null;
  conflictReference: string | null;
  verificationRequired: boolean;
}>;

export type CanonicalPropertyObservation = Readonly<{
  observationId: string;
  sourceId: string;
  sourceIdentityId: string | null;
  kind: CanonicalObservationKind;
  sourceRecordReference: string | null;
  fieldSemanticsReference: string | null;
  rightsPostureReference: string | null;
  attributionReference: string | null;
  freshness: CanonicalFreshness;
  confidence: CanonicalIdentityConfidence;
  observedAt: string | null;
  conflictReference: string | null;
}>;

export type CanonicalPropertyListingEvent = Readonly<{
  listingEventId: string;
  sourceId: string;
  sourceListingReference: string;
  status: CanonicalListingEventStatus;
  confidence: CanonicalIdentityConfidence;
  rights: 'CERTIFIED' | 'UNKNOWN' | 'RESTRICTED';
  freshness: CanonicalFreshness;
  observedAt: string | null;
  conflictReference: string | null;
  verificationRequired: boolean;
}>;

export type CanonicalPhysicalPropertyIdentityInput = Readonly<{
  canonicalPropertyId: string | null;
  displayAddress: string | null;
  normalizedAddress: string | null;
  jurisdiction: string | null;
  identityConfidence: CanonicalIdentityConfidence;
  sourceIdentities: readonly CanonicalPropertySourceIdentity[];
  observations: readonly CanonicalPropertyObservation[];
  listingEvents: readonly CanonicalPropertyListingEvent[];
  requestedActivation: boolean;
  requestedPublicUse: boolean;
  requestedHistoricalListingUse: boolean;
}>;

export type PropertyIdentityReadModel = Readonly<{
  status: typeof CANONICAL_PHYSICAL_PROPERTY_IDENTITY_STATUS;
  canonicalPropertyId: string | null;
  displayAddress: string | null;
  normalizedAddress: string | null;
  jurisdiction: string | null;
  identityState: CanonicalIdentityState;
  identityConfidence: CanonicalIdentityConfidence;
  sourceIdentities: readonly CanonicalPropertySourceIdentity[];
  parcelIdentities: readonly CanonicalPropertySourceIdentity[];
  currentListingEvidence: 'NOT_ADMITTED' | 'AVAILABLE_FOR_FUTURE_REVIEW';
  historicalListingEvidence: 'NOT_ADMITTED';
  publicRecordEvidence: 'NOT_ADMITTED';
  conflicts: readonly string[];
  freshness: CanonicalFreshness;
  verificationRequirements: readonly string[];
  readiness: 'NOT_READY' | 'REVIEW_REQUIRED' | 'CERTIFICATION_READY';
  activation: 'NOT_AUTHORIZED';
  globalGaps: readonly (typeof PROPERTY_IDENTITY_GAPS)[number][];
  protectedBoundaries: Readonly<{
    providerActivity: false;
    sourceActivation: false;
    dataPopulation: false;
    databaseMutation: false;
    runtimeActivation: false;
    publicActivation: false;
    historicalListingUse: false;
    ownerData: false;
    customerData: false;
    propertyCriteriaMutation: false;
  }>;
}>;

const protectedBoundaries = Object.freeze({
  providerActivity: false,
  sourceActivation: false,
  dataPopulation: false,
  databaseMutation: false,
  runtimeActivation: false,
  publicActivation: false,
  historicalListingUse: false,
  ownerData: false,
  customerData: false,
  propertyCriteriaMutation: false,
} as const);

const unique = (values: readonly string[]) => Object.freeze([...new Set(values.filter(Boolean))].sort());
const isTimestamp = (value: string | null) => Boolean(value && Number.isFinite(Date.parse(value)));

function minimumFreshness(values: readonly CanonicalFreshness[]): CanonicalFreshness {
  if (values.includes('STALE')) return 'STALE';
  if (values.includes('UNKNOWN')) return 'UNKNOWN';
  if (values.includes('AGING')) return 'AGING';
  return 'CURRENT';
}

export function buildCanonicalPhysicalPropertyIdentityReadModel(
  input: CanonicalPhysicalPropertyIdentityInput,
): PropertyIdentityReadModel {
  const conflicts = unique([
    ...input.sourceIdentities.flatMap((identity) => identity.conflictReference ? [identity.conflictReference] : identity.associationStatus === 'CONFLICTING' ? [`IDENTITY_CONFLICT:${identity.sourceIdentityId}`] : []),
    ...input.observations.flatMap((observation) => observation.conflictReference ? [observation.conflictReference] : []),
    ...input.listingEvents.flatMap((event) => event.conflictReference ? [event.conflictReference] : event.status === 'CONFLICTING' ? [`LISTING_CONFLICT:${event.listingEventId}`] : []),
  ]);
  const verificationRequirements = unique([
    !input.canonicalPropertyId ? 'CANONICAL_PROPERTY_ID_REQUIRED' : '',
    input.identityConfidence !== 'CONFIRMED' ? 'CANONICAL_IDENTITY_CONFIRMATION_REQUIRED' : '',
    input.sourceIdentities.length === 0 ? 'SOURCE_IDENTITY_REQUIRED' : '',
    input.observations.length === 0 ? 'SOURCE_OBSERVATION_REQUIRED' : '',
    !input.normalizedAddress ? 'NORMALIZED_ADDRESS_SIGNAL_UNAVAILABLE' : '',
    ...input.sourceIdentities.flatMap((identity) => [
      identity.rights !== 'CERTIFIED' ? `SOURCE_RIGHTS_REQUIRED:${identity.sourceId}` : '',
      identity.freshness === 'STALE' || identity.freshness === 'UNKNOWN' ? `SOURCE_FRESHNESS_REVIEW_REQUIRED:${identity.sourceIdentityId}` : '',
      !isTimestamp(identity.observedAt) ? `IDENTITY_OBSERVED_AT_REQUIRED:${identity.sourceIdentityId}` : '',
      identity.verificationRequired ? `IDENTITY_VERIFICATION_REQUIRED:${identity.sourceIdentityId}` : '',
      identity.associationStatus === 'POSSIBLE' ? `POSSIBLE_MATCH_REVIEW_REQUIRED:${identity.sourceIdentityId}` : '',
      identity.associationStatus === 'SUPERSEDED' ? `SUPERSEDED_IDENTITY_REVIEW_REQUIRED:${identity.sourceIdentityId}` : '',
    ]),
    ...input.observations.flatMap((observation) => [
      !observation.sourceRecordReference ? `OBSERVATION_SOURCE_RECORD_REQUIRED:${observation.observationId}` : '',
      !observation.fieldSemanticsReference ? `OBSERVATION_SEMANTICS_REQUIRED:${observation.observationId}` : '',
      !observation.rightsPostureReference ? `OBSERVATION_RIGHTS_REQUIRED:${observation.observationId}` : '',
      !observation.attributionReference ? `OBSERVATION_ATTRIBUTION_REQUIRED:${observation.observationId}` : '',
      !isTimestamp(observation.observedAt) ? `OBSERVATION_TIME_REQUIRED:${observation.observationId}` : '',
    ]),
    input.requestedActivation ? 'ACTIVATION_NOT_AUTHORIZED' : '',
    input.requestedPublicUse ? 'PUBLIC_USE_NOT_AUTHORIZED' : '',
    input.requestedHistoricalListingUse ? 'HISTORICAL_MLS_USE_RECONCILIATION_REQUIRED' : '',
  ]);
  const freshness = input.sourceIdentities.length === 0 && input.observations.length === 0 && input.listingEvents.length === 0
    ? 'UNKNOWN'
    : minimumFreshness([
    ...input.sourceIdentities.map((identity) => identity.freshness),
    ...input.observations.map((observation) => observation.freshness),
    ...input.listingEvents.map((event) => event.freshness),
  ]);
  const identityState: CanonicalIdentityState = conflicts.length > 0
    ? 'CONFLICTING'
    : !input.canonicalPropertyId || input.identityConfidence === 'UNVERIFIED'
      ? 'UNRESOLVED'
      : verificationRequirements.length > 0 || input.identityConfidence !== 'CONFIRMED'
        ? 'REVIEW_REQUIRED'
        : 'CERTIFICATION_READY';
  const readiness = identityState === 'CERTIFICATION_READY'
    ? 'CERTIFICATION_READY'
    : identityState === 'UNRESOLVED'
      ? 'NOT_READY'
      : 'REVIEW_REQUIRED';
  const currentListingEvidence = input.listingEvents.some((event) => event.status === 'CURRENT' && event.rights === 'CERTIFIED' && event.freshness === 'CURRENT')
    ? 'AVAILABLE_FOR_FUTURE_REVIEW'
    : 'NOT_ADMITTED';

  return Object.freeze({
    status: CANONICAL_PHYSICAL_PROPERTY_IDENTITY_STATUS,
    canonicalPropertyId: input.canonicalPropertyId,
    displayAddress: input.displayAddress,
    normalizedAddress: input.normalizedAddress,
    jurisdiction: input.jurisdiction,
    identityState,
    identityConfidence: input.identityConfidence,
    sourceIdentities: Object.freeze([...input.sourceIdentities]),
    parcelIdentities: Object.freeze(input.sourceIdentities.filter((identity) => identity.identifierType === 'PARCEL')),
    currentListingEvidence,
    historicalListingEvidence: 'NOT_ADMITTED',
    publicRecordEvidence: 'NOT_ADMITTED',
    conflicts,
    freshness,
    verificationRequirements,
    readiness,
    activation: 'NOT_AUTHORIZED',
    globalGaps: PROPERTY_IDENTITY_GAPS,
    protectedBoundaries,
  });
}

export type PropertyIdentitySourceAdapterContract = Readonly<{
  adapterKind: 'COUNTY_IDENTITY_ADAPTER' | 'STATEWIDE_PROPERTY_PROVIDER_ADAPTER' | 'MLS_LISTING_EVENT_ADAPTER' | 'IRES_LISTING_EVENT_ADAPTER';
  sourceIdentityRequired: true;
  provenanceObservationRequired: true;
  rightsAndAttributionRequired: true;
  sourceAdmission: 'REQUIRED';
  dataPopulation: 'NOT_AUTHORIZED';
  activation: 'NOT_AUTHORIZED';
}>;

export const PROPERTY_IDENTITY_SOURCE_ADAPTER_CONTRACTS: readonly PropertyIdentitySourceAdapterContract[] = Object.freeze([
  'COUNTY_IDENTITY_ADAPTER',
  'STATEWIDE_PROPERTY_PROVIDER_ADAPTER',
  'MLS_LISTING_EVENT_ADAPTER',
  'IRES_LISTING_EVENT_ADAPTER',
].map((adapterKind) => Object.freeze({
  adapterKind: adapterKind as PropertyIdentitySourceAdapterContract['adapterKind'],
  sourceIdentityRequired: true,
  provenanceObservationRequired: true,
  rightsAndAttributionRequired: true,
  sourceAdmission: 'REQUIRED' as const,
  dataPopulation: 'NOT_AUTHORIZED' as const,
  activation: 'NOT_AUTHORIZED' as const,
})));
