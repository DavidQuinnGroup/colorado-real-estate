import type {
  AlertIntentDedupeState,
  AlertIntentFixture,
  AlertIntentFreshnessPolicy,
  AlertIntentInput,
  AlertIntentProperty,
  AlertIntentReasonCode,
  AlertIntentSavedSearch,
  AlertIntentUser,
} from './types.js';

export const ALERT_INTENT_BASELINE_SHA = '8fc84ea76e9a3436188c2de416079ff57d75b506';
export const ALERT_INTENT_EVALUATED_AT = '2026-07-31T12:00:00.000Z';
export const ALERT_INTENT_PROPERTY_TIMESTAMP = '2026-07-31T10:00:00.000Z';
export const ALERT_INTENT_PUBLIC_BASE_URL = 'https://davidquinngroup.com';
export const ALERT_INTENT_EXPECTED_CASE_COUNT = 21;

export const allAlertIntentReasonCodes: readonly AlertIntentReasonCode[] = [
  'PROPERTY_INVALID',
  'PROPERTY_INACTIVE',
  'PROPERTY_PRIVATE',
  'PROPERTY_STALE',
  'SEARCH_INACTIVE',
  'USER_UNSUBSCRIBED',
  'USER_MISSING_EMAIL',
  'NO_MATCH_CITY',
  'NO_MATCH_PRICE',
  'NO_MATCH_BEDS',
  'NO_MATCH_TYPE',
  'NO_MATCH_BOUNDS',
  'DUPLICATE_EVENT',
  'MATCH_READY',
  'PAYLOAD_READY',
  'PAYLOAD_INVALID',
  'QUEUE_INTENT_READY',
  'RENDER_READY',
  'NEWNESS_UNSUPPORTED',
  'DELIVERY_BLOCKED_NO_SEND_MODE',
  'BLOCKED_UNSUPPORTED_DRY_RUN_SEAM',
];

const baseInput: AlertIntentInput = {
  property: {
    id: 'fixture-property-001',
    mlsId: 'fixture-mls-001',
    slug: 'fixture-property-001',
    address: 'Fixture Property',
    city: 'Boulder',
    state: 'CO',
    price: 900000,
    beds: 3,
    baths: 2,
    sqft: 2100,
    propertyType: 'Single Family',
    status: 'Active',
    isPrivateExclusive: false,
    sourceModifiedAt: ALERT_INTENT_PROPERTY_TIMESTAMP,
    image: 'https://example.invalid/fixture-property.jpg',
    lat: 40.01,
    lng: -105.25,
    efficiencyScore: 72,
    resilienceScore: 81,
    altitude: 5400,
    soilType: 'fixture soil',
    hasPolybutyleneRisk: false,
  },
  savedSearch: {
    id: 'fixture-search-001',
    userId: 'fixture-user-001',
    city: 'Boulder',
    minPrice: 800000,
    maxPrice: null,
    beds: 3,
    type: 'Single Family',
    north: 40.1,
    south: 39.9,
    east: -105.1,
    west: -105.4,
    isActive: true,
  },
  user: {
    id: 'fixture-user-001',
    email: 'fixture-user@example.invalid',
    isUnsubscribed: false,
  },
  dedupeState: {
    existingEventKeys: [],
  },
  freshnessPolicy: {
    maxAgeHours: 24,
    propertyTimestamp: ALERT_INTENT_PROPERTY_TIMESTAMP,
    source: 'authoritative_source_timestamp',
  },
  evaluatedAt: ALERT_INTENT_EVALUATED_AT,
  publicBaseUrl: ALERT_INTENT_PUBLIC_BASE_URL,
  mode: 'fixture_only_no_side_effect',
};

type FixturePatch = Omit<Partial<AlertIntentInput>, 'property' | 'savedSearch' | 'user' | 'dedupeState' | 'freshnessPolicy'> & {
  property?: Partial<AlertIntentProperty>;
  savedSearch?: Partial<AlertIntentSavedSearch>;
  user?: Partial<AlertIntentUser> | null;
  dedupeState?: Partial<AlertIntentDedupeState>;
  freshnessPolicy?: Partial<AlertIntentFreshnessPolicy>;
};

function fixture(
  name: string,
  patch: FixturePatch,
  expectedReasonCodes: AlertIntentReasonCode[],
  expectedTerminalDecision: AlertIntentFixture['expectedTerminalDecision'],
): AlertIntentFixture {
  return {
    name,
    input: {
      ...baseInput,
      ...patch,
      property: {
        ...baseInput.property,
        ...patch.property,
      },
      savedSearch: {
        ...baseInput.savedSearch,
        ...patch.savedSearch,
      },
      user:
        patch.user === null
          ? null
          : {
              ...baseInput.user!,
              ...patch.user,
            },
      dedupeState: {
        ...baseInput.dedupeState,
        ...patch.dedupeState,
      },
      freshnessPolicy: {
        ...baseInput.freshnessPolicy,
        ...patch.freshnessPolicy,
      },
    },
    expectedReasonCodes,
    expectedTerminalDecision,
  };
}

const readyCodes: AlertIntentReasonCode[] = [
  'MATCH_READY',
  'PAYLOAD_READY',
  'QUEUE_INTENT_READY',
  'RENDER_READY',
  'DELIVERY_BLOCKED_NO_SEND_MODE',
];

export const alertIntentFixtures: readonly AlertIntentFixture[] = [
  fixture('complete match', {}, readyCodes, 'ready_no_send'),
  fixture('city mismatch', { property: { city: 'Lafayette' } }, ['NO_MATCH_CITY'], 'no_match'),
  fixture('price mismatch', { property: { price: 700000 } }, ['NO_MATCH_PRICE'], 'no_match'),
  fixture('beds mismatch', { property: { beds: 2 } }, ['NO_MATCH_BEDS'], 'no_match'),
  fixture('property-type mismatch', { property: { propertyType: 'Condo' } }, ['NO_MATCH_TYPE'], 'no_match'),
  fixture('bounds mismatch', { property: { lat: 40.5 } }, ['NO_MATCH_BOUNDS'], 'no_match'),
  fixture('inactive search', { savedSearch: { isActive: false } }, ['SEARCH_INACTIVE'], 'blocked'),
  fixture('unsubscribed user', { user: { isUnsubscribed: true } }, ['USER_UNSUBSCRIBED'], 'blocked'),
  fixture('missing email', { user: { email: '' } }, ['USER_MISSING_EMAIL'], 'blocked'),
  fixture(
    'stale property',
    { freshnessPolicy: { propertyTimestamp: '2026-07-28T10:00:00.000Z' } },
    ['PROPERTY_STALE'],
    'blocked',
  ),
  fixture(
    'missing freshness timestamp',
    { freshnessPolicy: { propertyTimestamp: '' } },
    ['PROPERTY_STALE'],
    'blocked',
  ),
  fixture('inactive listing', { property: { status: 'Closed' } }, ['PROPERTY_INACTIVE'], 'blocked'),
  fixture('private listing', { property: { isPrivateExclusive: true } }, ['PROPERTY_PRIVATE'], 'blocked'),
  fixture(
    'unsupported ambiguous newness timestamp',
    { freshnessPolicy: { source: 'ambiguous_repository_timestamp' } },
    ['NEWNESS_UNSUPPORTED'],
    'blocked',
  ),
  fixture('invalid property', { property: { id: '' } }, ['PROPERTY_INVALID'], 'blocked'),
  fixture(
    'duplicate event',
    { dedupeState: { existingEventKeys: ['fixture-user-001:fixture-property-001:NEW_LISTING'] } },
    ['DUPLICATE_EVENT'],
    'duplicate',
  ),
  fixture('payload-ready path', {}, readyCodes, 'ready_no_send'),
  fixture(
    'payload-invalid path',
    { fixturePayloadValidity: 'invalid' },
    ['MATCH_READY', 'PAYLOAD_INVALID'],
    'blocked',
  ),
  fixture('queue-intent-ready path', {}, readyCodes, 'ready_no_send'),
  fixture('render-ready path', {}, readyCodes, 'ready_no_send'),
  fixture('mandatory delivery block in no-send mode', {}, readyCodes, 'ready_no_send'),
];
