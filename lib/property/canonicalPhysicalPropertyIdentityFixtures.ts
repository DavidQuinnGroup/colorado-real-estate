import type { CanonicalPhysicalPropertyIdentityInput } from './canonicalPhysicalPropertyIdentity';

const identity = (overrides: Partial<CanonicalPhysicalPropertyIdentityInput['sourceIdentities'][number]> = {}) => ({
  sourceIdentityId: 'fixture:parcel:001',
  sourceId: 'FIXTURE-COUNTY-SOURCE',
  identifierType: 'PARCEL' as const,
  sourceValue: '12AB34CD56EF',
  associationType: 'PROPERTY_ASSOCIATED_WITH_PARCEL' as const,
  associationStatus: 'CONFIRMED' as const,
  confidence: 'CONFIRMED' as const,
  rights: 'CERTIFIED' as const,
  freshness: 'CURRENT' as const,
  observedAt: '2026-08-24T12:00:00.000Z',
  conflictReference: null,
  verificationRequired: false,
  ...overrides,
});

const observation = (overrides: Partial<CanonicalPhysicalPropertyIdentityInput['observations'][number]> = {}) => ({
  observationId: 'fixture:observation:001',
  sourceId: 'FIXTURE-COUNTY-SOURCE',
  sourceIdentityId: 'fixture:parcel:001',
  kind: 'IDENTITY' as const,
  sourceRecordReference: 'fixture:record:001',
  fieldSemanticsReference: 'fixture:identity-semantics:v1',
  rightsPostureReference: 'fixture:rights:v1',
  attributionReference: 'fixture:attribution:v1',
  freshness: 'CURRENT' as const,
  confidence: 'CONFIRMED' as const,
  observedAt: '2026-08-24T12:00:00.000Z',
  conflictReference: null,
  ...overrides,
});

const listingEvent = (overrides: Partial<CanonicalPhysicalPropertyIdentityInput['listingEvents'][number]> = {}) => ({
  listingEventId: 'fixture:listing:001',
  sourceId: 'FIXTURE-MLS-SOURCE',
  sourceListingReference: 'fixture-listing-001',
  status: 'CURRENT' as const,
  confidence: 'CONFIRMED' as const,
  rights: 'CERTIFIED' as const,
  freshness: 'CURRENT' as const,
  observedAt: '2026-08-24T12:00:00.000Z',
  conflictReference: null,
  verificationRequired: false,
  ...overrides,
});

const complete = {
  canonicalPropertyId: 'atlas-property:fixture-001',
  displayAddress: 'Fixture address',
  normalizedAddress: '3139 W 131ST CIR, BROOMFIELD, CO 80020',
  jurisdiction: 'Fixture jurisdiction',
  identityConfidence: 'CONFIRMED' as const,
  sourceIdentities: [identity()],
  observations: [observation()],
  listingEvents: [listingEvent()],
  requestedActivation: false,
  requestedPublicUse: false,
  requestedHistoricalListingUse: false,
};

export const CANONICAL_PHYSICAL_PROPERTY_IDENTITY_FIXTURES: Readonly<Record<string, CanonicalPhysicalPropertyIdentityInput>> = Object.freeze({
  completeInternalGovernanceReady: complete,
  multipleSourceIds: {
    ...complete,
    sourceIdentities: [identity(), identity({ sourceIdentityId: 'fixture:account:001', identifierType: 'ASSESSOR_ACCOUNT', sourceValue: 'STRAP-1001', associationType: 'CANONICAL_PROPERTY_HAS_SOURCE_IDENTITY' })],
  },
  multipleListingEvents: {
    ...complete,
    listingEvents: [listingEvent(), listingEvent({ listingEventId: 'fixture:listing:historic', sourceListingReference: 'fixture-listing-historic', status: 'HISTORICAL' })],
  },
  unknownRights: { ...complete, sourceIdentities: [identity({ rights: 'UNKNOWN' })] },
  staleSource: { ...complete, sourceIdentities: [identity({ freshness: 'STALE' })] },
  conflictingIdentity: { ...complete, sourceIdentities: [identity({ associationStatus: 'CONFLICTING', confidence: 'CONFLICTING', conflictReference: 'CONFLICT:PARCEL-001' })] },
  possibleMatch: { ...complete, identityConfidence: 'POSSIBLE', sourceIdentities: [identity({ associationStatus: 'POSSIBLE', confidence: 'POSSIBLE', verificationRequired: true })] },
  missingSourceIdentity: { ...complete, sourceIdentities: [], observations: [] },
  incompleteObservationProvenance: { ...complete, observations: [observation({ attributionReference: null })] },
  activationRequested: { ...complete, requestedActivation: true, requestedPublicUse: true, requestedHistoricalListingUse: true },
});
