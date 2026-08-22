import type { CountyPropertyIdentityReadInput } from './propertyCountyIdentity';

const boulderAccount = {
  identifierType: 'ASSESSOR_ACCOUNT',
  sourceValue: 'STRAP-1001',
  normalizedValue: 'STRAP-1001',
  sourceId: 'SRC-BOULDER-COUNTY-ASSESSOR',
  jurisdictionCode: 'US-CO-BOULDER',
  freshness: 'FRESH' as const,
};

const boulderParcel = (sourceValue: string) => ({
  identifierType: 'PARCEL',
  sourceValue,
  normalizedValue: sourceValue,
  sourceId: 'SRC-BOULDER-COUNTY-ASSESSOR',
  jurisdictionCode: 'US-CO-BOULDER',
  freshness: 'FRESH' as const,
});

export const COUNTY_PROPERTY_IDENTITY_FIXTURES: Readonly<Record<string, CountyPropertyIdentityReadInput>> = Object.freeze({
  boulderTextParcel: {
    propertyReference: 'property:boulder-text-parcel',
    identifiers: [boulderAccount, boulderParcel('12AB34CD56EF')],
    mappings: [{ status: 'MATCHED', confidence: 'DETERMINISTIC_MATCH', basis: 'AUTHORITATIVE_IDENTIFIER', verificationRequired: false, conflictReference: null }],
  },
  multiAccountMultiParcel: {
    propertyReference: 'property:multi-account-multi-parcel',
    identifiers: [
      boulderAccount,
      { ...boulderAccount, sourceValue: 'STRAP-1002', normalizedValue: 'STRAP-1002' },
      boulderParcel('12AB34CD56EF'),
      boulderParcel('12AB34CD56F0'),
      { identifierType: 'BUILDING', sourceValue: 'BUILDING-A', normalizedValue: 'BUILDING-A', sourceId: 'SRC-BOULDER-COUNTY-ASSESSOR', jurisdictionCode: 'US-CO-BOULDER', freshness: 'FRESH' as const },
    ],
    mappings: [{ status: 'MATCHED', confidence: 'MANUAL_REVIEW_CONFIRMED', basis: 'ADDRESS_UNIT_LEGAL_CONFIRMATION', verificationRequired: false, conflictReference: null }],
  },
  fuzzyAddress: {
    propertyReference: 'property:fuzzy-address',
    identifiers: [boulderParcel('12AB34CD56EF')],
    mappings: [{ status: 'MATCHED', confidence: 'UNVERIFIED', basis: 'FUZZY_ADDRESS_CANDIDATE', verificationRequired: true, conflictReference: null }],
  },
  ambiguous: {
    propertyReference: 'property:ambiguous',
    identifiers: [boulderParcel('12AB34CD56EF')],
    mappings: [{ status: 'AMBIGUOUS', confidence: 'SOURCE_REPORTED', basis: 'UNKNOWN', verificationRequired: true, conflictReference: null }],
  },
  conflicting: {
    propertyReference: 'property:conflicting',
    identifiers: [boulderParcel('12AB34CD56EF')],
    mappings: [{ status: 'CONFLICTING', confidence: 'SOURCE_REPORTED', basis: 'MANUAL_REVIEW', verificationRequired: true, conflictReference: 'CONFLICT-ACCOUNT-PARCEL' }],
  },
  superseded: {
    propertyReference: 'property:superseded',
    identifiers: [boulderParcel('12AB34CD56EF')],
    mappings: [{ status: 'SUPERSEDED', confidence: 'SOURCE_REPORTED', basis: 'AUTHORITATIVE_IDENTIFIER', verificationRequired: true, conflictReference: null }],
  },
});
