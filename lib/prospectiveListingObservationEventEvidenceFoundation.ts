export const PROSPECTIVE_LISTING_OBSERVATION_EVENT_EVIDENCE_FOUNDATION_STATUS =
  'PROSPECTIVE_LISTING_OBSERVATION_AND_EVENT_EVIDENCE_FOUNDATION_ADMISSION_REVIEW_CERTIFIED' as const;

export const PROSPECTIVE_LISTING_OBSERVATION_EVENT_EVIDENCE_NEXT_GATE =
  'READY_FOR_HISTORICAL_RETENTION_RIGHTS_AND_MINIMAL_OBSERVATION_SCHEMA_AUTHORIZATION' as const;

export const PROSPECTIVE_LISTING_OBSERVATION_EVENT_EVIDENCE_PROTECTED_BOUNDARIES = Object.freeze({
  databaseMutation: false,
  databaseSchemaMigration: false,
  newObservationTable: false,
  newIngestionRunTable: false,
  newEventTable: false,
  newSnapshotTable: false,
  sourceObservationCapture: false,
  priceEventCapture: false,
  statusEventCapture: false,
  closeEventCapture: false,
  baselineCapture: false,
  rawPayloadArchivalActivation: false,
  retrospectiveBackfill: false,
  historicalDataImport: false,
  mlsSyncModification: false,
  syncCadenceModification: false,
  cronOrWorkerCreation: false,
  webhookCreation: false,
  pollingChange: false,
  supabaseConfigurationMutation: false,
  mlsGridCall: false,
  iresCall: false,
  providerApiCall: false,
  sourceActivation: false,
  typesenseMutation: false,
  crmMutation: false,
  emailMutation: false,
  secretMutation: false,
  historicalApiImplementation: false,
  historicalUiImplementation: false,
  publicClientExportActivation: false,
  deployment: false,
});

export type ProspectiveEvidenceReadiness =
  | 'READY_FOR_ARCHITECTURE_ADMISSION'
  | 'READY_FOR_LATER_SCHEMA_IF_RIGHTS_APPROVED'
  | 'REQUIRES_EXECUTIVE_RIGHTS_DECISION'
  | 'DEFER_TO_EVENT_DERIVATION_WAVE'
  | 'BLOCKED_UNTIL_OBSERVATIONS_EXIST'
  | 'NOT_ADMITTED';

export type ProspectiveEvidenceDecision = Readonly<{
  id: string;
  recommendation: string;
  readiness: ProspectiveEvidenceReadiness;
  rationale: string;
}>;

export const PROSPECTIVE_EVIDENCE_TRUTH_MODEL = Object.freeze([
  'SOURCE_OBSERVATION_NOT_EVENT',
  'OBSERVED_AT_NOT_EFFECTIVE_AT',
  'SOURCE_NATIVE_EVENT_NOT_ATLAS_DERIVED_EVENT',
  'CURRENT_ROW_NOT_HISTORICAL_SNAPSHOT',
  'SNAPSHOT_NOT_EVENT_LEDGER',
  'EVENT_LEDGER_NOT_BASELINE_STATE',
  'FIRST_OBSERVED_NOT_ORIGINAL_MLS_STATE',
  'LISTING_DISAPPEARED_NOT_LISTING_CLOSED',
  'PRICE_CHANGED_BETWEEN_OBSERVATIONS_NOT_SOURCE_NATIVE_PRICE_EVENT',
  'STATUS_CHANGED_BETWEEN_OBSERVATIONS_NOT_SOURCE_NATIVE_STATUS_EVENT',
  'MLS_LISTING_CLOSE_EVENT_NOT_CANONICAL_PHYSICAL_PROPERTY_TRANSACTION',
  'CORRECTED_SOURCE_VALUE_NOT_ERASE_PRIOR_OBSERVATION',
  'PROSPECTIVE_HISTORY_NOT_RETROSPECTIVE_HISTORY',
] as const);

export const PROSPECTIVE_EVIDENCE_AUTHORITY_MODEL: readonly ProspectiveEvidenceDecision[] = Object.freeze([
  Object.freeze({
    id: 'source-ingestion-run-v1',
    recommendation: 'SOURCE_INGESTION_RUN_V1 is the future source coverage and capture provenance authority.',
    readiness: 'READY_FOR_LATER_SCHEMA_IF_RIGHTS_APPROVED',
    rationale: 'As-of reconstruction and disappearance semantics require run-level coverage, partial-failure, cursor, source scope, field-set, normalization, and retention-policy evidence.',
  }),
  Object.freeze({
    id: 'listing-source-observation-v1',
    recommendation: 'LISTING_SOURCE_OBSERVATION_V1 is the primary prospective listing-state evidence authority.',
    readiness: 'READY_FOR_LATER_SCHEMA_IF_RIGHTS_APPROVED',
    rationale: 'Primary observations preserve evidence before derived event rules are frozen and allow future replay under versioned methods.',
  }),
  Object.freeze({
    id: 'listing-event-evidence-v1',
    recommendation: 'LISTING_EVENT_EVIDENCE_V1 is the later source-native or derived event evidence authority.',
    readiness: 'DEFER_TO_EVENT_DERIVATION_WAVE',
    rationale: 'Event derivation should not precede durable observations and ingestion-run coverage evidence.',
  }),
  Object.freeze({
    id: 'property-current-projection',
    recommendation: 'Property remains the current normalized read projection.',
    readiness: 'READY_FOR_ARCHITECTURE_ADMISSION',
    rationale: 'Historical evidence capture must be additive and must not alter current property/search semantics.',
  }),
  Object.freeze({
    id: 'price-history',
    recommendation: 'PriceHistory remains legacy or specialized pending reconciliation; it is not the primary prospective evidence authority.',
    readiness: 'READY_FOR_ARCHITECTURE_ADMISSION',
    rationale: 'A future observation ledger prevents silent dual truth and can later feed or supersede a specialized price projection.',
  }),
]);

export const PROSPECTIVE_LISTING_EPISODE_IDENTITY = Object.freeze({
  basis: 'sourceSystem + sourceScope + sourceListingIdentity + listingEpisodeVersion',
  sourceIdentityPreference: Object.freeze(['ListingKey', 'ListingId', 'mlsId']),
  relistPolicy: 'Relist and identifier-reuse semantics require explicit source rules; do not merge episodes into canonical physical property identity.',
  physicalPropertyBoundary: 'Listing episode identity remains separate from canonical physical property identity and from transaction identity.',
});

export const LISTING_SOURCE_OBSERVATION_V1_RECOMMENDATION = Object.freeze({
  semanticDefinition: 'A durable record of the normalized state ATLAS observed for one listing episode from one source at one observation time.',
  requiredMetadata: Object.freeze([
    'observationId',
    'ingestionRunId',
    'listingEpisodeId',
    'sourceSystem',
    'sourceScope',
    'sourceRecordIdentity',
    'observedAt',
    'sourceModifiedAt',
    'effectiveAtWhenSourceProvidesIt',
    'historicalFieldSetVersion',
    'normalizationVersion',
    'contentHash',
    'rightsPolicyVersion',
    'retentionClass',
    'completenessState',
  ]),
  fullVersusSelective: 'SELECTIVE_NORMALIZED_OBSERVATION_PLUS_HASH',
  storageRecommendation: 'Typed columns for high-cardinality query fields plus normalized JSON for admitted supplemental evidence.',
  unchangedObservationPolicy: 'Do not duplicate unchanged content for every run unless coverage semantics require a run-observation join or heartbeat reference.',
  baselinePolicy: 'CAPTURE_EPOCH_BASELINE means state when prospective history began, not original MLS state.',
});

export const SOURCE_INGESTION_RUN_V1_RECOMMENDATION = Object.freeze({
  semanticDefinition: 'A durable source/scope run record proving what capture attempted, what completed, and whether absence or completeness can be trusted.',
  requiredMetadata: Object.freeze([
    'runId',
    'sourceSystem',
    'startedAt',
    'completedAt',
    'status',
    'requestedScope',
    'effectiveQueryOrCursor',
    'recordCountReceived',
    'recordCountProcessed',
    'recordCountFailed',
    'continuationCursor',
    'partialFailure',
    'errorClass',
    'normalizationVersion',
    'historicalFieldSetVersion',
    'retentionPolicyVersion',
  ]),
  statusPolicy: Object.freeze(['COMPLETE', 'PARTIAL', 'FAILED', 'UNKNOWN', 'NOT_RUN']),
  coverageWindowPolicy: 'Coverage windows may be certified only when source protocol semantics prove the run consumed the intended source interval.',
});

export const LISTING_EVENT_EVIDENCE_V1_RECOMMENDATION = Object.freeze({
  semanticDefinition: 'A claim about a change or occurrence, backed by source-native event evidence or by before/after observations and a versioned derivation rule.',
  origins: Object.freeze(['SOURCE_NATIVE', 'ATLAS_DERIVED_FROM_OBSERVATIONS', 'SOURCE_REPORTED_CURRENT_STATE_ONLY', 'MANUAL_IMPORTED_EVIDENCE_IF_LATER_AUTHORIZED']),
  deferFirstWave: true,
  deferRationale: 'Observation-first preserves primary evidence, supports replay, and prevents prematurely freezing event methodology.',
});

export const HISTORICAL_FIELD_SET_V1_RECOMMENDATION = Object.freeze({
  include: Object.freeze([
    'listingEpisodeId',
    'sourceSystem',
    'sourceRecordIdentity',
    'normalizedStatus',
    'askingListPrice',
    'listingDateIfAuthoritative',
    'originalListDateIfAuthoritative',
    'pendingDateIfAuthoritative',
    'closeDateIfAuthoritative',
    'mlsReportedClosePriceIfAuthorized',
    'expirationDateIfAuthoritative',
    'withdrawnOrCanceledDateIfAuthoritative',
    'propertyType',
    'beds',
    'baths',
    'listedSqft',
    'yearBuilt',
    'lotAcreage',
    'listingCity',
    'zip',
    'sourceModifiedAt',
  ]),
  exclude: Object.freeze([
    'publicRemarks',
    'privateBrokerRemarks',
    'photos',
    'agentContactDetails',
    'officeContactDetails',
    'ownerInformation',
    'consumerPii',
    'crmInformation',
  ]),
  defer: Object.freeze([
    'rawPayload',
    'photoHistory',
    'remarksHistory',
    'agentOfficeHistory',
    'concessions',
    'deedConsideration',
    'canonicalTransactionIdentity',
  ]),
});

export const PROSPECTIVE_RETENTION_RIGHTS_MATRIX: readonly ProspectiveEvidenceDecision[] = Object.freeze([
  Object.freeze({ id: 'normalized-identity', recommendation: 'Retain in minimal core if source rights approve Agent-only normalized evidence.', readiness: 'REQUIRES_EXECUTIVE_RIGHTS_DECISION', rationale: 'Identity is required to make observations durable and deduplicated.' }),
  Object.freeze({ id: 'status', recommendation: 'Retain normalized status in minimal core if rights approve.', readiness: 'REQUIRES_EXECUTIVE_RIGHTS_DECISION', rationale: 'Status is essential for active, pending, closed, withdrawn, expired, canceled, and back-on-market evidence.' }),
  Object.freeze({ id: 'list-price', recommendation: 'Retain normalized asking/list price in minimal core if rights approve.', readiness: 'REQUIRES_EXECUTIVE_RIGHTS_DECISION', rationale: 'Price history and historical asking distributions depend on it.' }),
  Object.freeze({ id: 'close-date-price', recommendation: 'Retain close date and MLS-reported close price only if source rights and semantics approve.', readiness: 'REQUIRES_EXECUTIVE_RIGHTS_DECISION', rationale: 'Sold analytics require these fields, but they carry higher rights and methodology sensitivity.' }),
  Object.freeze({ id: 'raw-payload', recommendation: 'Exclude from first core unless separately admitted.', readiness: 'NOT_ADMITTED', rationale: 'Raw payload retention increases rights and storage exposure beyond minimal market evidence.' }),
  Object.freeze({ id: 'remarks-photos-contacts-pii', recommendation: 'Exclude from first core.', readiness: 'NOT_ADMITTED', rationale: 'These are unnecessary for the minimal historical market-evidence core and increase sensitivity.' }),
]);

export const PROSPECTIVE_IMPLEMENTATION_SELECTION = Object.freeze({
  selectedStrategy: 'INGESTION_RUN_PLUS_LISTING_OBSERVATION_FOUNDATION_FIRST',
  eventDecision: 'NO_EVENT_DERIVATION_IN_FIRST_PERSISTENCE_WAVE',
  sourceScopeRecommendation: 'EXECUTIVE_DECISION_REQUIRED',
  baselineScopeRecommendation: 'ALL_CURRENT_RETAINED_LISTING_EPISODES_IN_APPROVED_CAPTURE_SCOPE',
  firstTrustworthyHistoryBoundary: 'No historical claim predates the certified source/scope capture epoch, field-set version, normalization version, retention-policy version, and coverage status.',
  rightsGateDecision: 'Future persistence is blocked until Executive approves historical retention rights for the exact normalized field set and audience.',
  schemaGateDecision: 'Architecture is ready for bounded schema design only after rights approval; this review does not authorize schema mutation.',
  secondaryParallelRecommendation: 'EXPERT_MLS_FILTER_READINESS_READ_ONLY_RED_TEAM',
});

export const PROSPECTIVE_EVENT_ADMISSION_SUMMARY: readonly ProspectiveEvidenceDecision[] = Object.freeze([
  Object.freeze({ id: 'listing-first-observed', recommendation: 'Admit only as first ATLAS observation under prospective capture.', readiness: 'DEFER_TO_EVENT_DERIVATION_WAVE', rationale: 'It is not original MLS creation or new-listing evidence.' }),
  Object.freeze({ id: 'new-listing', recommendation: 'Require source-native new-listing evidence or authoritative listing date plus timely first observation under complete coverage.', readiness: 'BLOCKED_UNTIL_OBSERVATIONS_EXIST', rationale: 'First observed alone is insufficient.' }),
  Object.freeze({ id: 'status-transition', recommendation: 'Require same episode, ordered before/after statuses, and versioned derivation rule; preserve time uncertainty unless source effective time exists.', readiness: 'BLOCKED_UNTIL_OBSERVATIONS_EXIST', rationale: 'A diff proves a change between observations, not exact source-native event time.' }),
  Object.freeze({ id: 'price-change', recommendation: 'Require same episode, ordered prior/new admitted prices, direction, amount, and no duplicate unchanged observation.', readiness: 'BLOCKED_UNTIL_OBSERVATIONS_EXIST', rationale: 'Price changes must remain observation-derived unless source-native event identity exists.' }),
  Object.freeze({ id: 'close-event', recommendation: 'Separate close status, close date, and close price evidence.', readiness: 'BLOCKED_UNTIL_OBSERVATIONS_EXIST', rationale: 'Close status does not by itself prove transaction details.' }),
  Object.freeze({ id: 'disappearance-reappearance', recommendation: 'Treat disappearance/reappearance as observed-scope facts, not closed or back-on-market status without supporting event evidence.', readiness: 'BLOCKED_UNTIL_OBSERVATIONS_EXIST', rationale: 'Scope coverage and source protocol behavior must be known.' }),
  Object.freeze({ id: 'source-correction-restatement', recommendation: 'Append correction/restatement observations and supersede derived events rather than erasing prior observations.', readiness: 'BLOCKED_UNTIL_OBSERVATIONS_EXIST', rationale: 'Auditability requires as-reported and latest-restated modes.' }),
]);
