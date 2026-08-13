export type AlertIntentReasonCode =
  | 'PROPERTY_INVALID'
  | 'PROPERTY_INACTIVE'
  | 'PROPERTY_PRIVATE'
  | 'PROPERTY_STALE'
  | 'SEARCH_INACTIVE'
  | 'USER_UNSUBSCRIBED'
  | 'USER_MISSING_EMAIL'
  | 'NO_MATCH_CITY'
  | 'NO_MATCH_PRICE'
  | 'NO_MATCH_BEDS'
  | 'NO_MATCH_TYPE'
  | 'NO_MATCH_BOUNDS'
  | 'DUPLICATE_EVENT'
  | 'MATCH_READY'
  | 'PAYLOAD_READY'
  | 'PAYLOAD_INVALID'
  | 'QUEUE_INTENT_READY'
  | 'RENDER_READY'
  | 'NEWNESS_UNSUPPORTED'
  | 'DELIVERY_BLOCKED_NO_SEND_MODE'
  | 'BLOCKED_UNSUPPORTED_DRY_RUN_SEAM';

export type AlertIntentTerminalDecision =
  | 'blocked'
  | 'no_match'
  | 'duplicate'
  | 'ready_no_send';

export type AlertIntentProperty = {
  id?: unknown;
  mlsId?: unknown;
  slug?: unknown;
  address?: unknown;
  city?: unknown;
  state?: unknown;
  price?: unknown;
  beds?: unknown;
  baths?: unknown;
  sqft?: unknown;
  propertyType?: unknown;
  status?: unknown;
  isPrivateExclusive?: unknown;
  image?: unknown;
  lat?: unknown;
  lng?: unknown;
  efficiencyScore?: unknown;
  resilienceScore?: unknown;
  altitude?: unknown;
  soilType?: unknown;
  hasPolybutyleneRisk?: unknown;
  changedAt?: unknown;
  updatedAt?: unknown;
  listedAt?: unknown;
};

export type AlertIntentSavedSearch = {
  id: string;
  userId: string;
  city: string;
  minPrice: number | null;
  maxPrice?: number | null;
  beds: number | null;
  type: string | null;
  north: number | null;
  south: number | null;
  east: number | null;
  west: number | null;
  isActive: boolean;
};

export type AlertIntentUser = {
  id: string;
  email?: string | null;
  isUnsubscribed: boolean;
};

export type AlertIntentDedupeState = {
  existingEventKeys: readonly string[];
};

export type AlertIntentFreshnessPolicy = {
  maxAgeHours: number;
  propertyTimestamp: string;
  source?: 'authoritative_source_timestamp' | 'ambiguous_repository_timestamp';
};

export type AlertIntentInput = {
  property: AlertIntentProperty;
  savedSearch: AlertIntentSavedSearch;
  user: AlertIntentUser | null;
  dedupeState: AlertIntentDedupeState;
  freshnessPolicy: AlertIntentFreshnessPolicy;
  evaluatedAt: string;
  publicBaseUrl: string;
  mode: 'fixture_only_no_side_effect';
  fixturePayloadValidity?: 'valid' | 'invalid';
};

export type AlertPayloadIntent = Record<string, string | number | boolean>;

export type AlertQueueIntent = {
  queueName: 'reie-alerts';
  jobName: 'process-alert';
  jobIdShape: 'alert-{alertId}';
  retryPlan: {
    attempts: 3;
    backoffType: 'exponential';
    backoffDelayMs: 3000;
    removeOnCompleteAgeSeconds: 604800;
    removeOnCompleteCount: 250;
    removeOnFailAgeSeconds: 2592000;
    removeOnFailCount: 500;
  };
  enqueueEligible: boolean;
};

export type AlertRenderIntent = {
  subject: string;
  htmlReady: boolean;
  textReady: boolean;
};

export type AlertIntentCounters = {
  databaseReads: 0;
  databaseRowsCreated: 0;
  databaseRowsMutated: 0;
  queueJobsCreated: 0;
  queueJobsChanged: 0;
  providerCalls: 0;
  emailLogRowsCreated: 0;
  unsubscribeTokensCreated: 0;
  workersActivated: 0;
  savedSearchRecordsModified: 0;
  customerDataExposed: 0;
};

export type AlertIntentResult = {
  reasonCodes: AlertIntentReasonCode[];
  terminalDecision: AlertIntentTerminalDecision;
  match: boolean;
  payloadIntent: AlertPayloadIntent | null;
  queueIntent: AlertQueueIntent | null;
  deliveryEligible: boolean;
  renderReady: boolean;
  renderIntent: AlertRenderIntent | null;
  counters: AlertIntentCounters;
};

export type AlertIntentFixture = {
  name: string;
  input: AlertIntentInput;
  expectedReasonCodes: AlertIntentReasonCode[];
  expectedTerminalDecision: AlertIntentTerminalDecision;
};
