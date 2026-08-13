import type {
  AlertIntentCounters,
  AlertIntentInput,
  AlertIntentProperty,
  AlertIntentReasonCode,
  AlertIntentResult,
  AlertIntentSavedSearch,
  AlertPayloadIntent,
  AlertQueueIntent,
} from './types.js';

const ALERT_TYPE = 'NEW_LISTING';
const ZERO_COUNTERS: AlertIntentCounters = {
  databaseReads: 0,
  databaseRowsCreated: 0,
  databaseRowsMutated: 0,
  queueJobsCreated: 0,
  queueJobsChanged: 0,
  providerCalls: 0,
  emailLogRowsCreated: 0,
  unsubscribeTokensCreated: 0,
  workersActivated: 0,
  savedSearchRecordsModified: 0,
  customerDataExposed: 0,
};

export function toCleanAlertString(value: unknown, fallback = '') {
  if (value === undefined || value === null) return fallback;

  const cleaned = String(value).trim();
  return cleaned || fallback;
}

export function toAlertNumber(value: unknown) {
  if (value === undefined || value === null || value === '') return null;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function sameValue(left: unknown, right: unknown) {
  return toCleanAlertString(left).toLowerCase() === toCleanAlertString(right).toLowerCase();
}

function hasCompleteBounds(search: AlertIntentSavedSearch) {
  return search.north !== null && search.south !== null && search.east !== null && search.west !== null;
}

export function matchesAlertBounds(search: AlertIntentSavedSearch, property: AlertIntentProperty) {
  if (!hasCompleteBounds(search)) return true;

  const lat = toAlertNumber(property.lat);
  const lng = toAlertNumber(property.lng);

  if (lat === null || lng === null) return false;

  return lat <= search.north! && lat >= search.south! && lng <= search.east! && lng >= search.west!;
}

export function getAlertMatchFailure(search: AlertIntentSavedSearch, property: AlertIntentProperty): AlertIntentReasonCode | null {
  const propertyPrice = toAlertNumber(property.price) ?? 0;
  const propertyBeds = toAlertNumber(property.beds) ?? 0;

  if (!sameValue(search.city, property.city)) return 'NO_MATCH_CITY';
  if (search.minPrice !== null && propertyPrice < search.minPrice) return 'NO_MATCH_PRICE';
  if (search.maxPrice !== undefined && search.maxPrice !== null && propertyPrice > search.maxPrice) return 'NO_MATCH_PRICE';
  if (search.beds !== null && propertyBeds < search.beds) return 'NO_MATCH_BEDS';
  if (search.type && !sameValue(search.type, property.propertyType)) return 'NO_MATCH_TYPE';
  if (!matchesAlertBounds(search, property)) return 'NO_MATCH_BOUNDS';

  return null;
}

export function matchesAlertSearch(search: AlertIntentSavedSearch, property: AlertIntentProperty) {
  return getAlertMatchFailure(search, property) === null;
}

export function isValidAlertProperty(property: AlertIntentProperty) {
  return Boolean(property.id && property.city);
}

function isActiveAlertProperty(property: AlertIntentProperty) {
  return toCleanAlertString(property.status).toLowerCase() === 'active';
}

function isPublicAlertProperty(property: AlertIntentProperty) {
  return property.isPrivateExclusive === false;
}

function hasAuthoritativeNewness(input: AlertIntentInput) {
  return input.freshnessPolicy.source !== 'ambiguous_repository_timestamp';
}

function isFreshAlertProperty(input: AlertIntentInput) {
  const evaluatedAt = Date.parse(input.evaluatedAt);
  const propertyTimestamp = Date.parse(input.freshnessPolicy.propertyTimestamp);
  const maxAgeMs = input.freshnessPolicy.maxAgeHours * 60 * 60 * 1000;

  if (!Number.isFinite(evaluatedAt) || !Number.isFinite(propertyTimestamp)) return false;
  if (!Number.isFinite(maxAgeMs) || maxAgeMs < 0) return false;

  return evaluatedAt - propertyTimestamp <= maxAgeMs;
}

function isJsonPrimitive(value: unknown): value is string | number | boolean {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
}

function addOptionalPayloadValue(payload: AlertPayloadIntent, key: string, value: unknown) {
  if (value === undefined || value === null || value === '') return;

  if (isJsonPrimitive(value)) {
    payload[key] = value;
    return;
  }

  payload[key] = String(value);
}

function getPublicBaseUrl(input: AlertIntentInput) {
  return input.publicBaseUrl.replace(/\/+$/, '') || 'https://davidquinngroup.com';
}

export function buildAlertPayloadIntent(property: AlertIntentProperty, publicBaseUrl: string): AlertPayloadIntent {
  const baseUrl = publicBaseUrl.replace(/\/+$/, '') || 'https://davidquinngroup.com';
  const identity = toCleanAlertString(property.slug || property.id || property.mlsId);
  const propertyUrl = identity ? `${baseUrl}/properties/${encodeURIComponent(identity)}` : `${baseUrl}/search`;
  const payload: AlertPayloadIntent = {
    id: String(property.id),
    propertyId: String(property.id),
    address: toCleanAlertString(property.address, 'Colorado property'),
    city: toCleanAlertString(property.city, 'Colorado'),
    state: toCleanAlertString(property.state, 'CO'),
    price: toAlertNumber(property.price) ?? 0,
    url: propertyUrl,
  };

  addOptionalPayloadValue(payload, 'mlsId', property.mlsId);
  addOptionalPayloadValue(payload, 'slug', property.slug);
  addOptionalPayloadValue(payload, 'beds', toAlertNumber(property.beds));
  addOptionalPayloadValue(payload, 'baths', toAlertNumber(property.baths));
  addOptionalPayloadValue(payload, 'sqft', toAlertNumber(property.sqft));
  addOptionalPayloadValue(payload, 'propertyType', property.propertyType);
  addOptionalPayloadValue(payload, 'image', property.image);
  addOptionalPayloadValue(payload, 'efficiencyScore', toAlertNumber(property.efficiencyScore));
  addOptionalPayloadValue(payload, 'resilienceScore', toAlertNumber(property.resilienceScore));
  addOptionalPayloadValue(payload, 'altitude', toAlertNumber(property.altitude));
  addOptionalPayloadValue(payload, 'soilType', property.soilType);
  addOptionalPayloadValue(payload, 'hasPolybutyleneRisk', property.hasPolybutyleneRisk);

  return payload;
}

function hasUsablePayload(payload: AlertPayloadIntent | null) {
  if (!payload) return false;
  return Boolean(payload.propertyId || payload.id || payload.slug || payload.mlsId || payload.address);
}

function getDedupeKey(input: AlertIntentInput) {
  return `${input.user?.id || input.savedSearch.userId}:${String(input.property.id)}:${ALERT_TYPE}`;
}

function getQueueIntent(): AlertQueueIntent {
  return {
    queueName: 'reie-alerts',
    jobName: 'process-alert',
    jobIdShape: 'alert-{alertId}',
    retryPlan: {
      attempts: 3,
      backoffType: 'exponential',
      backoffDelayMs: 3000,
      removeOnCompleteAgeSeconds: 604800,
      removeOnCompleteCount: 250,
      removeOnFailAgeSeconds: 2592000,
      removeOnFailCount: 500,
    },
    enqueueEligible: true,
  };
}

function getRenderSubject() {
  return `David Quinn Group: 1 property intelligence update`;
}

function blocked(reasonCodes: AlertIntentReasonCode[]): AlertIntentResult {
  return {
    reasonCodes,
    terminalDecision: reasonCodes.some((reason) => reason.startsWith('NO_MATCH')) ? 'no_match' : 'blocked',
    match: false,
    payloadIntent: null,
    queueIntent: null,
    deliveryEligible: false,
    renderReady: false,
    renderIntent: null,
    counters: ZERO_COUNTERS,
  };
}

export function evaluateAlertIntent(input: AlertIntentInput): AlertIntentResult {
  if (input.mode !== 'fixture_only_no_side_effect') {
    return blocked(['BLOCKED_UNSUPPORTED_DRY_RUN_SEAM']);
  }

  if (!isValidAlertProperty(input.property)) return blocked(['PROPERTY_INVALID']);
  if (!isActiveAlertProperty(input.property)) return blocked(['PROPERTY_INACTIVE']);
  if (!isPublicAlertProperty(input.property)) return blocked(['PROPERTY_PRIVATE']);
  if (!hasAuthoritativeNewness(input)) return blocked(['NEWNESS_UNSUPPORTED']);
  if (!isFreshAlertProperty(input)) return blocked(['PROPERTY_STALE']);
  if (!input.savedSearch.isActive) return blocked(['SEARCH_INACTIVE']);
  if (!input.user || input.user.isUnsubscribed) return blocked(['USER_UNSUBSCRIBED']);
  if (!toCleanAlertString(input.user.email)) return blocked(['USER_MISSING_EMAIL']);

  const matchFailure = getAlertMatchFailure(input.savedSearch, input.property);
  if (matchFailure) return blocked([matchFailure]);

  const dedupeKey = getDedupeKey(input);
  if (input.dedupeState.existingEventKeys.includes(dedupeKey)) {
    return {
      ...blocked(['DUPLICATE_EVENT']),
      terminalDecision: 'duplicate',
    };
  }

  const payloadIntent = buildAlertPayloadIntent(input.property, getPublicBaseUrl(input));
  const reasonCodes: AlertIntentReasonCode[] = ['MATCH_READY'];

  if (input.fixturePayloadValidity === 'invalid' || !hasUsablePayload(payloadIntent)) {
    return {
      ...blocked([...reasonCodes, 'PAYLOAD_INVALID']),
      match: true,
    };
  }

  reasonCodes.push('PAYLOAD_READY', 'QUEUE_INTENT_READY', 'RENDER_READY', 'DELIVERY_BLOCKED_NO_SEND_MODE');

  return {
    reasonCodes,
    terminalDecision: 'ready_no_send',
    match: true,
    payloadIntent,
    queueIntent: getQueueIntent(),
    deliveryEligible: false,
    renderReady: true,
    renderIntent: {
      subject: getRenderSubject(),
      htmlReady: true,
      textReady: true,
    },
    counters: ZERO_COUNTERS,
  };
}
