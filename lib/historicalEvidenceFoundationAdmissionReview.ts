export const HISTORICAL_EVIDENCE_FOUNDATION_ADMISSION_REVIEW_STATUS =
  'HISTORICAL_EVIDENCE_FOUNDATION_ADMISSION_REVIEW_CERTIFIED' as const;

export const HISTORICAL_EVIDENCE_FOUNDATION_NEXT_GATE =
  'READY_FOR_PROSPECTIVE_LISTING_OBSERVATION_AND_EVENT_EVIDENCE_FOUNDATION' as const;

export const HISTORICAL_EVIDENCE_FOUNDATION_PROTECTED_BOUNDARIES = Object.freeze({
  productImplementation: false,
  runtimeHistoricalAnalytics: false,
  databaseMutation: false,
  schemaMigration: false,
  eventCapture: false,
  snapshotCapture: false,
  historicalBackfill: false,
  providerActivity: false,
  mlsGridActivity: false,
  iresActivity: false,
  supabaseMutation: false,
  typesenseMutation: false,
  crmMutation: false,
  customerDataMutation: false,
  publicReportActivation: false,
  exportActivation: false,
  deployment: false,
  secretsAccess: false,
});

export type HistoricalEvidenceReadiness =
  | 'ADMITTED_CURRENT_SNAPSHOT_ONLY'
  | 'SCHEMA_EXISTS_NOT_ADMITTED'
  | 'ARCHITECTURE_EXISTS_NOT_RUNTIME_EVIDENCE'
  | 'BLOCKED_BY_MISSING_FIELD'
  | 'BLOCKED_BY_MISSING_EVENT_LEDGER'
  | 'BLOCKED_BY_MISSING_SNAPSHOT_STORE'
  | 'BLOCKED_BY_METHODOLOGY'
  | 'BLOCKED_BY_RIGHTS'
  | 'SOURCE_REPORT_EXPORT_REQUIRED'
  | 'MLS_IRES_AUTHORIZED_HISTORY_REQUIRED'
  | 'NOT_RECONSTRUCTABLE_FROM_CURRENT_REPOSITORY';

export type HistoricalEvidenceFinding = Readonly<{
  id: string;
  subject: string;
  readiness: HistoricalEvidenceReadiness;
  repositoryFinding: string;
  consequence: string;
}>;

export const HISTORICAL_EVIDENCE_FOUNDATION_TRUTH_DISTINCTIONS = Object.freeze([
  'CURRENT_ROW_NOT_HISTORICAL_SNAPSHOT',
  'DATE_FIELD_NOT_EVENT_LEDGER',
  'CLOSE_DATE_NOT_COMPLETE_TRANSACTION_HISTORY',
  'PRICE_HISTORY_ROW_NOT_COMPLETE_LISTING_HISTORY_UNLESS_PROVEN',
  'CURRENT_ACTIVE_INVENTORY_NOT_PAST_ACTIVE_INVENTORY',
  'PROSPECTIVE_EVENT_CAPTURE_NOT_RETROSPECTIVE_HISTORY',
  'HISTORICAL_RECORD_EXISTS_NOT_HISTORICAL_METRIC_ADMITTED',
  'MLS_REPORT_OUTPUT_NOT_ATLAS_METHODOLOGY_ADMISSION',
  'IRES_AGENT_REPORTING_CAPABILITY_NOT_AUTHORIZED_MLS_GRID_HISTORICAL_EVIDENCE',
] as const);

export const HISTORICAL_EVIDENCE_FOUNDATION_REPOSITORY_FINDINGS: readonly HistoricalEvidenceFinding[] = Object.freeze([
  Object.freeze({
    id: 'property-current-row',
    subject: 'Property row',
    readiness: 'ADMITTED_CURRENT_SNAPSHOT_ONLY',
    repositoryFinding: 'Property stores current price, status, sourceModifiedAt, createdAt, and updatedAt, but no as-of listing snapshot grain.',
    consequence: 'Current inventory can be described only as current-row stock; past inventory as of a requested date is not admitted.',
  }),
  Object.freeze({
    id: 'property-close-fields',
    subject: 'Closed transaction fields',
    readiness: 'BLOCKED_BY_MISSING_FIELD',
    repositoryFinding: 'Property does not define closeDate, closePrice, salePrice, originalListPrice, listDate, pendingDate, withdrawnDate, expirationDate, DOM, or CDOM fields.',
    consequence: 'Sold-period statistics, sale/list relationship metrics, and duration metrics cannot be computed from current Property rows.',
  }),
  Object.freeze({
    id: 'price-history',
    subject: 'PriceHistory',
    readiness: 'SCHEMA_EXISTS_NOT_ADMITTED',
    repositoryFinding: 'PriceHistory contains propertyId, price, event, and date only; no admitted writer, source identity, old/new price, direction, observed/effective split, correction, or retention contract is present.',
    consequence: 'Price reductions/increases and original/current/final price methodology remain blocked.',
  }),
  Object.freeze({
    id: 'open-house',
    subject: 'OpenHouse',
    readiness: 'SCHEMA_EXISTS_NOT_ADMITTED',
    repositoryFinding: 'OpenHouse stores startTime and endTime only; no source event identity, observed/effective timing, correction, or retention proof is present.',
    consequence: 'Open-house history may not be used as a certified historical market event stream.',
  }),
  Object.freeze({
    id: 'canonical-listing-event',
    subject: 'CanonicalPropertyListingEvent',
    readiness: 'ARCHITECTURE_EXISTS_NOT_RUNTIME_EVIDENCE',
    repositoryFinding: 'CanonicalPropertyListingEvent supports property/listing identity governance, but it is not a status/price/close market-event ledger.',
    consequence: 'It helps future identity reconciliation but does not admit historical market analytics today.',
  }),
  Object.freeze({
    id: 'source-identity-observation',
    subject: 'PropertySourceIdentityObservation',
    readiness: 'ARCHITECTURE_EXISTS_NOT_RUNTIME_EVIDENCE',
    repositoryFinding: 'PropertySourceIdentityObservation has observedAt, effectiveAt, source references, and rights references for identity/source observations.',
    consequence: 'The architecture is reusable for future evidence capture, but current listing analytics still need a governed event/snapshot contract.',
  }),
  Object.freeze({
    id: 'mls-upsert',
    subject: 'MLS upsert mapper',
    readiness: 'ADMITTED_CURRENT_SNAPSHOT_ONLY',
    repositoryFinding: 'The mapper persists current ListPrice/CurrentPrice, StandardStatus/MlsStatus, geography, facts, and sourceModifiedAt into Property.',
    consequence: 'It does not preserve prior states, close facts, source listing-origin dates, DOM/CDOM, or ordered listing transitions.',
  }),
  Object.freeze({
    id: 'ires-reports',
    subject: 'IRES controlled report evidence',
    readiness: 'SOURCE_REPORT_EXPORT_REQUIRED',
    repositoryFinding: 'IRES report concepts are documented as workflow demand and controlled benchmark evidence, not as live source acquisition authority.',
    consequence: 'Imported reports can support future report-level comparison evidence only after an authorized report-evidence contract.',
  }),
  Object.freeze({
    id: 'rights',
    subject: 'Historical source rights',
    readiness: 'BLOCKED_BY_RIGHTS',
    repositoryFinding: 'Existing contracts preserve protected boundaries and do not authorize provider history activation, historical backfill, or public/client/export display.',
    consequence: 'Historical data acquisition, retention, and reporting need explicit Executive authorization and source-rights reconciliation.',
  }),
]);

export const HISTORICAL_EVIDENCE_FOUNDATION_QUESTION_READINESS: readonly HistoricalEvidenceFinding[] = Object.freeze([
  Object.freeze({
    id: 'active-inventory-as-of-date',
    subject: 'Active inventory as of a past date',
    readiness: 'BLOCKED_BY_MISSING_SNAPSHOT_STORE',
    repositoryFinding: 'No admitted retained listing-state snapshot exists for arbitrary past as-of dates.',
    consequence: 'Requires prospective snapshots or authorized historical reconstruction.',
  }),
  Object.freeze({
    id: 'status-flow-counts',
    subject: 'New, pending, closed, withdrawn, expired, and back-on-market counts',
    readiness: 'BLOCKED_BY_MISSING_EVENT_LEDGER',
    repositoryFinding: 'No admitted listing status event ledger or source-native status transition table exists.',
    consequence: 'Status-flow analytics require event evidence with source/effective/observed timing and duplicate policy.',
  }),
  Object.freeze({
    id: 'price-change-counts',
    subject: 'Price reductions and increases',
    readiness: 'SCHEMA_EXISTS_NOT_ADMITTED',
    repositoryFinding: 'PriceHistory exists but is not certified as complete, sourced, retained, or methodologically sufficient.',
    consequence: 'Price-change analytics require an admitted ordered price-event contract.',
  }),
  Object.freeze({
    id: 'sold-statistics',
    subject: 'Sale price distributions, dollar volume, high/low sale, and SP/LP',
    readiness: 'BLOCKED_BY_MISSING_FIELD',
    repositoryFinding: 'Current Property rows do not retain close price/date or sale/list denominator semantics.',
    consequence: 'Sold statistics require closed-transaction fields or authorized report/provider historical evidence.',
  }),
  Object.freeze({
    id: 'duration-metrics',
    subject: 'DOM, CDOM, DTS, and DTO',
    readiness: 'BLOCKED_BY_METHODOLOGY',
    repositoryFinding: 'No admitted definitions, source event dates, relist/reset policy, or duration population/exclusion rules are present.',
    consequence: 'Duration reporting must remain fail-closed until methodology and evidence are admitted together.',
  }),
  Object.freeze({
    id: 'supply-absorption',
    subject: 'Months of supply and absorption',
    readiness: 'BLOCKED_BY_MISSING_EVENT_LEDGER',
    repositoryFinding: 'No retained period denominator and closed/pending transition evidence is admitted.',
    consequence: 'Supply-rate metrics require certified current inventory plus comparable historical transition observations.',
  }),
  Object.freeze({
    id: 'period-comparisons',
    subject: 'MoM, QoQ, YoY, YTD, prior-YTD, rolling, multi-year, and period A versus period B',
    readiness: 'NOT_RECONSTRUCTABLE_FROM_CURRENT_REPOSITORY',
    repositoryFinding: 'Current repository state cannot reconstruct complete historical cohorts from overwritten current rows.',
    consequence: 'Comparison requires prospective observations, authorized retrospective history, or controlled report-level imports.',
  }),
]);

export const HISTORICAL_EVIDENCE_FOUNDATION_REQUIREMENTS = Object.freeze({
  prospective: Object.freeze([
    'Define listing observation grain with observedAt, effectiveAt, sourceModifiedAt, ingestion time, source, rights, completeness, and coverage metadata.',
    'Define market event grain for status, price, close, open-house, correction, disappearance, and duplicate/relist handling.',
    'Separate source-native events from ATLAS-derived events and preserve derivation provenance.',
    'Require no-data, count-zero, partial-coverage, stale-source, duplicate, correction, and restatement states.',
    'Keep runtime activation, database writes, provider calls, public/client/export reporting, and deployment behind later gates.',
  ]),
  retrospective: Object.freeze([
    'Identify the authorized source of historical truth before reconstruction: provider history, MLS/IRES authorized history, controlled report export, or retained ATLAS archive.',
    'Declare source rights, grain, period completeness, duplicate policy, metric methodology, and correction/restatement policy before any calculation.',
    'Reject current-row backfill when source fields do not preserve the requested historical state.',
  ]),
  reportEvidence: Object.freeze([
    'Treat imported IRES reports as controlled aggregate evidence with report metadata, source, period, filters, generated-at time, and metric definitions.',
    'Do not treat report output as row-level history or ATLAS-native methodology admission.',
  ]),
});
