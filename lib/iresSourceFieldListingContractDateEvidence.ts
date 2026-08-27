export const IRES_SOURCE_FIELD_LISTING_CONTRACT_DATE_EVIDENCE_STATUS =
  'IRES_SOURCE_FIELD_LISTINGCONTRACTDATE_EVIDENCE_ADMISSION_CERTIFIED' as const;

export const IRES_PROPERTY_IDX_MAPPING_EVIDENCE_VERSION = 'IRES_PROPERTY_IDX_MAPPING_EVIDENCE_V1' as const;

export const IRES_PROPERTY_IDX_MAPPING_EVIDENCE_SOURCE = Object.freeze({
  sourceSystem: 'IRES',
  deliverySystem: 'MLS_GRID',
  subscriptionUseContext: 'IRES_PROPERTY_IDX',
  resource: 'Property',
  exportName: 'iresToGridMappingsPropertyIDX (1).csv',
  observedRows: 2282,
  observedUniqueGridFields: 290,
  observedUniqueMlsFields: 292,
  evidenceDate: '2026-08-27',
  sourcePath: 'MLS Grid > Mappings > IRES > IDX > Property resource',
});

export type IresSourceFieldAvailability = 'AVAILABLE' | 'NOT_AVAILABLE';
export type IresSourceFieldSemanticStatus =
  | 'SEMANTICALLY_ADMITTED'
  | 'SEMANTICALLY_ADMITTED_WITH_LIMITATIONS'
  | 'SEMANTICS_REQUIRE_SOURCE_DOCUMENTATION'
  | 'NON_AUTHORITATIVE_REFERENCE_ONLY'
  | 'NOT_APPLICABLE';
export type IresSourceFieldRightsStatus =
  | 'IDX_CURRENT_USE_UNCHANGED'
  | 'RIGHTS_UNRESOLVED_FOR_HISTORICAL_RETENTION'
  | 'RIGHTS_NOT_ADMITTED'
  | 'NOT_APPLICABLE';
export type IresSourceFieldPersistenceStatus = 'PERSISTED_CURRENT_PROJECTION' | 'PARTIALLY_PERSISTED_CURRENT_PROJECTION' | 'NOT_PERSISTED' | 'NOT_APPLICABLE';
export type IresHistoricalFieldImpact =
  | 'CONFIRMED_AVAILABLE'
  | 'CONFIRMED_UNAVAILABLE'
  | 'AVAILABLE_WITH_SEMANTIC_HOLD'
  | 'AVAILABLE_WITH_RIGHTS_HOLD'
  | 'DEFERRED';
export type IresFutureAction =
  | 'CURRENT_PROJECTION_CANDIDATE'
  | 'PROVENANCE_CANDIDATE'
  | 'HISTORICAL_OBSERVATION_CANDIDATE'
  | 'RIGHTS_BLOCKED'
  | 'METHODOLOGY_BLOCKED'
  | 'NO_ACTION';

export type IresSourceFieldEvidence = Readonly<{
  field: string;
  gridField: string;
  iresField: string | null;
  resource: 'Property';
  subscriptionUseContext: 'IRES_PROPERTY_IDX';
  availability: IresSourceFieldAvailability;
  sourceEvidence: string;
  semanticStatus: IresSourceFieldSemanticStatus;
  rightsStatus: IresSourceFieldRightsStatus;
  persistenceStatus: IresSourceFieldPersistenceStatus;
  historicalValue: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
  historicalFieldImpact: IresHistoricalFieldImpact;
  futureAction: IresFutureAction;
  limitations: readonly string[];
}>;

function field(input: Omit<IresSourceFieldEvidence, 'resource' | 'subscriptionUseContext'>): IresSourceFieldEvidence {
  return Object.freeze({
    ...input,
    resource: 'Property',
    subscriptionUseContext: 'IRES_PROPERTY_IDX',
  });
}

const rightsHold = 'Current IDX rights are unchanged; historical superseded-value retention remains unresolved pending MLS Grid/IRES rights alignment.';
const noProviderEquivalence = 'Source-field availability does not establish provider-equivalent methodology, ordered history, population, or report equivalence.';

export const IRES_SOURCE_FIELD_EVIDENCE: readonly IresSourceFieldEvidence[] = Object.freeze([
  field({ field: 'ListingKey', gridField: 'ListingKey', iresField: 'ListingID', availability: 'AVAILABLE', sourceEvidence: 'CSV maps ListingID to ListingKey.', semanticStatus: 'SEMANTICALLY_ADMITTED', rightsStatus: 'RIGHTS_UNRESOLVED_FOR_HISTORICAL_RETENTION', persistenceStatus: 'PARTIALLY_PERSISTED_CURRENT_PROJECTION', historicalValue: 'HIGH', historicalFieldImpact: 'AVAILABLE_WITH_RIGHTS_HOLD', futureAction: 'HISTORICAL_OBSERVATION_CANDIDATE', limitations: Object.freeze([rightsHold]) }),
  field({ field: 'ListingId', gridField: 'ListingId', iresField: 'MLSNumber', availability: 'AVAILABLE', sourceEvidence: 'CSV maps MLSNumber to ListingId.', semanticStatus: 'SEMANTICALLY_ADMITTED', rightsStatus: 'RIGHTS_UNRESOLVED_FOR_HISTORICAL_RETENTION', persistenceStatus: 'PARTIALLY_PERSISTED_CURRENT_PROJECTION', historicalValue: 'HIGH', historicalFieldImpact: 'AVAILABLE_WITH_RIGHTS_HOLD', futureAction: 'HISTORICAL_OBSERVATION_CANDIDATE', limitations: Object.freeze([rightsHold]) }),
  field({ field: 'StandardStatus', gridField: 'StandardStatus', iresField: 'ListingStatus', availability: 'AVAILABLE', sourceEvidence: 'CSV maps ListingStatus to StandardStatus with Active, Pending, Closed, Withdrawn, Expired, and Coming Soon values.', semanticStatus: 'SEMANTICALLY_ADMITTED_WITH_LIMITATIONS', rightsStatus: 'RIGHTS_UNRESOLVED_FOR_HISTORICAL_RETENTION', persistenceStatus: 'PERSISTED_CURRENT_PROJECTION', historicalValue: 'HIGH', historicalFieldImpact: 'AVAILABLE_WITH_RIGHTS_HOLD', futureAction: 'HISTORICAL_OBSERVATION_CANDIDATE', limitations: Object.freeze(['MLS Grid guidance treats StandardStatus as the primary RESO status grouping.', 'Current status is not a complete status-event ledger.', rightsHold]) }),
  field({ field: 'MlsStatus', gridField: 'MlsStatus', iresField: 'MLSStatus', availability: 'AVAILABLE', sourceEvidence: 'CSV maps MLSStatus to MlsStatus with local status context.', semanticStatus: 'SEMANTICALLY_ADMITTED_WITH_LIMITATIONS', rightsStatus: 'RIGHTS_UNRESOLVED_FOR_HISTORICAL_RETENTION', persistenceStatus: 'PERSISTED_CURRENT_PROJECTION', historicalValue: 'MEDIUM', historicalFieldImpact: 'AVAILABLE_WITH_RIGHTS_HOLD', futureAction: 'HISTORICAL_OBSERVATION_CANDIDATE', limitations: Object.freeze(['MLS Grid guidance treats MlsStatus as local context, not the primary RESO grouping.', rightsHold]) }),
  field({ field: 'StatusChangeTimestamp', gridField: 'StatusChangeTimestamp', iresField: 'StatusChangeDate', availability: 'AVAILABLE', sourceEvidence: 'CSV maps StatusChangeDate to StatusChangeTimestamp.', semanticStatus: 'SEMANTICALLY_ADMITTED_WITH_LIMITATIONS', rightsStatus: 'RIGHTS_UNRESOLVED_FOR_HISTORICAL_RETENTION', persistenceStatus: 'NOT_PERSISTED', historicalValue: 'HIGH', historicalFieldImpact: 'AVAILABLE_WITH_RIGHTS_HOLD', futureAction: 'PROVENANCE_CANDIDATE', limitations: Object.freeze(['Latest status-change timestamp does not supply prior status, full status history, relist history, or a transition ledger.', rightsHold]) }),
  field({ field: 'ListingContractDate', gridField: 'ListingContractDate', iresField: 'ListDate', availability: 'AVAILABLE', sourceEvidence: 'CSV maps ListDate to ListingContractDate; direct IRES guidance recommends Listing Contract Date to determine original list date.', semanticStatus: 'SEMANTICALLY_ADMITTED', rightsStatus: 'RIGHTS_UNRESOLVED_FOR_HISTORICAL_RETENTION', persistenceStatus: 'NOT_PERSISTED', historicalValue: 'HIGH', historicalFieldImpact: 'AVAILABLE_WITH_RIGHTS_HOLD', futureAction: 'HISTORICAL_OBSERVATION_CANDIDATE', limitations: Object.freeze(['Admitted as original-list-date basis only.', 'Does not establish provider-equivalent DOM endpoint, reset, population, CDOM, or IRES Average DOM equivalence.', rightsHold]) }),
  field({ field: 'OriginatingSystemModificationTimestamp', gridField: 'OriginatingSystemModificationTimestamp', iresField: 'ModificationTimestamp', availability: 'AVAILABLE', sourceEvidence: 'CSV maps ModificationTimestamp to OriginatingSystemModificationTimestamp.', semanticStatus: 'SEMANTICALLY_ADMITTED_WITH_LIMITATIONS', rightsStatus: 'IDX_CURRENT_USE_UNCHANGED', persistenceStatus: 'PARTIALLY_PERSISTED_CURRENT_PROJECTION', historicalValue: 'MEDIUM', historicalFieldImpact: 'CONFIRMED_AVAILABLE', futureAction: 'PROVENANCE_CANDIDATE', limitations: Object.freeze(['Current repository source freshness persists sourceModifiedAt from source modification evidence; this does not create historical observations.']) }),
  field({ field: 'ListPrice', gridField: 'ListPrice', iresField: 'ListPrice', availability: 'AVAILABLE', sourceEvidence: 'CSV maps ListPrice to ListPrice.', semanticStatus: 'SEMANTICALLY_ADMITTED_WITH_LIMITATIONS', rightsStatus: 'RIGHTS_UNRESOLVED_FOR_HISTORICAL_RETENTION', persistenceStatus: 'PERSISTED_CURRENT_PROJECTION', historicalValue: 'HIGH', historicalFieldImpact: 'AVAILABLE_WITH_RIGHTS_HOLD', futureAction: 'HISTORICAL_OBSERVATION_CANDIDATE', limitations: Object.freeze(['Current list price does not provide ordered asking-price history.', rightsHold]) }),
  field({ field: 'OriginalListPrice', gridField: 'OriginalListPrice', iresField: 'OriginalPrice', availability: 'AVAILABLE', sourceEvidence: 'CSV maps OriginalPrice to OriginalListPrice.', semanticStatus: 'SEMANTICALLY_ADMITTED_WITH_LIMITATIONS', rightsStatus: 'RIGHTS_UNRESOLVED_FOR_HISTORICAL_RETENTION', persistenceStatus: 'NOT_PERSISTED', historicalValue: 'HIGH', historicalFieldImpact: 'AVAILABLE_WITH_RIGHTS_HOLD', futureAction: 'HISTORICAL_OBSERVATION_CANDIDATE', limitations: Object.freeze(['Original list price availability does not establish SP/LP denominator or ordered price history.', rightsHold]) }),
  field({ field: 'PriceChangeTimestamp', gridField: 'PriceChangeTimestamp', iresField: 'PriceChangeDate', availability: 'AVAILABLE', sourceEvidence: 'CSV maps PriceChangeDate to PriceChangeTimestamp.', semanticStatus: 'SEMANTICALLY_ADMITTED_WITH_LIMITATIONS', rightsStatus: 'RIGHTS_UNRESOLVED_FOR_HISTORICAL_RETENTION', persistenceStatus: 'NOT_PERSISTED', historicalValue: 'MEDIUM', historicalFieldImpact: 'AVAILABLE_WITH_RIGHTS_HOLD', futureAction: 'PROVENANCE_CANDIDATE', limitations: Object.freeze(['Timestamp availability does not supply previous price, direction, amount, or ordered price-event history.', rightsHold]) }),
  field({ field: 'CloseDate', gridField: 'CloseDate', iresField: 'SoldDate', availability: 'AVAILABLE', sourceEvidence: 'CSV maps SoldDate to CloseDate.', semanticStatus: 'SEMANTICALLY_ADMITTED_WITH_LIMITATIONS', rightsStatus: 'RIGHTS_UNRESOLVED_FOR_HISTORICAL_RETENTION', persistenceStatus: 'NOT_PERSISTED', historicalValue: 'HIGH', historicalFieldImpact: 'AVAILABLE_WITH_RIGHTS_HOLD', futureAction: 'HISTORICAL_OBSERVATION_CANDIDATE', limitations: Object.freeze([noProviderEquivalence, rightsHold]) }),
  field({ field: 'ClosePrice', gridField: 'ClosePrice', iresField: 'SoldPrice', availability: 'AVAILABLE', sourceEvidence: 'CSV maps SoldPrice to ClosePrice.', semanticStatus: 'SEMANTICALLY_ADMITTED_WITH_LIMITATIONS', rightsStatus: 'RIGHTS_UNRESOLVED_FOR_HISTORICAL_RETENTION', persistenceStatus: 'NOT_PERSISTED', historicalValue: 'HIGH', historicalFieldImpact: 'AVAILABLE_WITH_RIGHTS_HOLD', futureAction: 'HISTORICAL_OBSERVATION_CANDIDATE', limitations: Object.freeze([noProviderEquivalence, rightsHold]) }),
  field({ field: 'DaysOnMarket', gridField: 'DaysOnMarket', iresField: 'DaysOnMarket', availability: 'AVAILABLE', sourceEvidence: 'CSV maps DaysOnMarket to DaysOnMarket; direct IRES guidance recommends not relying on supplied days-on-market fields because update behavior may make them incorrect.', semanticStatus: 'NON_AUTHORITATIVE_REFERENCE_ONLY', rightsStatus: 'RIGHTS_UNRESOLVED_FOR_HISTORICAL_RETENTION', persistenceStatus: 'NOT_PERSISTED', historicalValue: 'LOW', historicalFieldImpact: 'AVAILABLE_WITH_SEMANTIC_HOLD', futureAction: 'METHODOLOGY_BLOCKED', limitations: Object.freeze(['Do not use as authoritative REIE DOM.', 'Do not label universally wrong; retain only as source-available non-authoritative reference evidence.']) }),
  field({ field: 'CumulativeDaysOnMarket', gridField: 'CumulativeDaysOnMarket', iresField: null, availability: 'NOT_AVAILABLE', sourceEvidence: 'No CumulativeDaysOnMarket mapping found in current IRES Property IDX export.', semanticStatus: 'NOT_APPLICABLE', rightsStatus: 'NOT_APPLICABLE', persistenceStatus: 'NOT_APPLICABLE', historicalValue: 'NONE', historicalFieldImpact: 'CONFIRMED_UNAVAILABLE', futureAction: 'NO_ACTION', limitations: Object.freeze(['NOT AVAILABLE IN CURRENT IRES PROPERTY IDX MAPPING EXPORT.']) }),
  field({ field: 'MajorChangeType', gridField: 'MajorChangeType', iresField: null, availability: 'NOT_AVAILABLE', sourceEvidence: 'No MajorChangeType mapping found in current IRES Property IDX export.', semanticStatus: 'NOT_APPLICABLE', rightsStatus: 'NOT_APPLICABLE', persistenceStatus: 'NOT_APPLICABLE', historicalValue: 'NONE', historicalFieldImpact: 'CONFIRMED_UNAVAILABLE', futureAction: 'NO_ACTION', limitations: Object.freeze(['NOT AVAILABLE IN CURRENT IRES PROPERTY IDX MAPPING EXPORT.']) }),
  field({ field: 'MajorChangeTimestamp', gridField: 'MajorChangeTimestamp', iresField: null, availability: 'NOT_AVAILABLE', sourceEvidence: 'No MajorChangeTimestamp mapping found in current IRES Property IDX export.', semanticStatus: 'NOT_APPLICABLE', rightsStatus: 'NOT_APPLICABLE', persistenceStatus: 'NOT_APPLICABLE', historicalValue: 'NONE', historicalFieldImpact: 'CONFIRMED_UNAVAILABLE', futureAction: 'NO_ACTION', limitations: Object.freeze(['NOT AVAILABLE IN CURRENT IRES PROPERTY IDX MAPPING EXPORT.']) }),
  field({ field: 'PurchaseContractDate', gridField: 'PurchaseContractDate', iresField: null, availability: 'NOT_AVAILABLE', sourceEvidence: 'No PurchaseContractDate mapping found in current IRES Property IDX export.', semanticStatus: 'NOT_APPLICABLE', rightsStatus: 'NOT_APPLICABLE', persistenceStatus: 'NOT_APPLICABLE', historicalValue: 'NONE', historicalFieldImpact: 'CONFIRMED_UNAVAILABLE', futureAction: 'NO_ACTION', limitations: Object.freeze(['NOT AVAILABLE IN CURRENT IRES PROPERTY IDX MAPPING EXPORT.']) }),
  field({ field: 'PreviousListPrice', gridField: 'PreviousListPrice', iresField: null, availability: 'NOT_AVAILABLE', sourceEvidence: 'No PreviousListPrice mapping found in current IRES Property IDX export.', semanticStatus: 'NOT_APPLICABLE', rightsStatus: 'NOT_APPLICABLE', persistenceStatus: 'NOT_APPLICABLE', historicalValue: 'NONE', historicalFieldImpact: 'CONFIRMED_UNAVAILABLE', futureAction: 'NO_ACTION', limitations: Object.freeze(['NOT AVAILABLE IN CURRENT IRES PROPERTY IDX MAPPING EXPORT.']) }),
  field({ field: 'OnMarketDate', gridField: 'OnMarketDate', iresField: null, availability: 'NOT_AVAILABLE', sourceEvidence: 'No OnMarketDate mapping found in current IRES Property IDX export.', semanticStatus: 'NOT_APPLICABLE', rightsStatus: 'NOT_APPLICABLE', persistenceStatus: 'NOT_APPLICABLE', historicalValue: 'NONE', historicalFieldImpact: 'CONFIRMED_UNAVAILABLE', futureAction: 'NO_ACTION', limitations: Object.freeze(['NOT AVAILABLE IN CURRENT IRES PROPERTY IDX MAPPING EXPORT.']) }),
  field({ field: 'OriginalEntryTimestamp', gridField: 'OriginalEntryTimestamp', iresField: null, availability: 'NOT_AVAILABLE', sourceEvidence: 'No OriginalEntryTimestamp mapping found in current IRES Property IDX export.', semanticStatus: 'NOT_APPLICABLE', rightsStatus: 'NOT_APPLICABLE', persistenceStatus: 'NOT_APPLICABLE', historicalValue: 'NONE', historicalFieldImpact: 'CONFIRMED_UNAVAILABLE', futureAction: 'NO_ACTION', limitations: Object.freeze(['NOT AVAILABLE IN CURRENT IRES PROPERTY IDX MAPPING EXPORT.']) }),
  field({ field: 'ExpirationDate', gridField: 'ExpirationDate', iresField: null, availability: 'NOT_AVAILABLE', sourceEvidence: 'No ExpirationDate mapping found in current IRES Property IDX export.', semanticStatus: 'NOT_APPLICABLE', rightsStatus: 'NOT_APPLICABLE', persistenceStatus: 'NOT_APPLICABLE', historicalValue: 'NONE', historicalFieldImpact: 'CONFIRMED_UNAVAILABLE', futureAction: 'NO_ACTION', limitations: Object.freeze(['NOT AVAILABLE IN CURRENT IRES PROPERTY IDX MAPPING EXPORT.']) }),
  field({ field: 'WithdrawnDate', gridField: 'WithdrawnDate', iresField: null, availability: 'NOT_AVAILABLE', sourceEvidence: 'No WithdrawnDate mapping found in current IRES Property IDX export.', semanticStatus: 'NOT_APPLICABLE', rightsStatus: 'NOT_APPLICABLE', persistenceStatus: 'NOT_APPLICABLE', historicalValue: 'NONE', historicalFieldImpact: 'CONFIRMED_UNAVAILABLE', futureAction: 'NO_ACTION', limitations: Object.freeze(['NOT AVAILABLE IN CURRENT IRES PROPERTY IDX MAPPING EXPORT.']) }),
  field({ field: 'CanceledDate', gridField: 'CanceledDate', iresField: null, availability: 'NOT_AVAILABLE', sourceEvidence: 'No CanceledDate or CancelledDate mapping found in current IRES Property IDX export.', semanticStatus: 'NOT_APPLICABLE', rightsStatus: 'NOT_APPLICABLE', persistenceStatus: 'NOT_APPLICABLE', historicalValue: 'NONE', historicalFieldImpact: 'CONFIRMED_UNAVAILABLE', futureAction: 'NO_ACTION', limitations: Object.freeze(['NOT AVAILABLE IN CURRENT IRES PROPERTY IDX MAPPING EXPORT.']) }),
  field({ field: 'OffMarketDate', gridField: 'OffMarketDate', iresField: null, availability: 'NOT_AVAILABLE', sourceEvidence: 'No OffMarketDate mapping found in current IRES Property IDX export.', semanticStatus: 'NOT_APPLICABLE', rightsStatus: 'NOT_APPLICABLE', persistenceStatus: 'NOT_APPLICABLE', historicalValue: 'NONE', historicalFieldImpact: 'CONFIRMED_UNAVAILABLE', futureAction: 'NO_ACTION', limitations: Object.freeze(['NOT AVAILABLE IN CURRENT IRES PROPERTY IDX MAPPING EXPORT.']) }),
  field({ field: 'BedroomsTotal', gridField: 'BedroomsTotal', iresField: 'Bedrooms', availability: 'AVAILABLE', sourceEvidence: 'CSV maps Bedrooms to BedroomsTotal.', semanticStatus: 'SEMANTICALLY_ADMITTED_WITH_LIMITATIONS', rightsStatus: 'RIGHTS_UNRESOLVED_FOR_HISTORICAL_RETENTION', persistenceStatus: 'PERSISTED_CURRENT_PROJECTION', historicalValue: 'MEDIUM', historicalFieldImpact: 'AVAILABLE_WITH_RIGHTS_HOLD', futureAction: 'CURRENT_PROJECTION_CANDIDATE', limitations: Object.freeze([rightsHold]) }),
  field({ field: 'BathroomsTotalInteger', gridField: 'BathroomsTotalInteger', iresField: 'BathsTotal', availability: 'AVAILABLE', sourceEvidence: 'CSV maps BathsTotal to BathroomsTotalInteger.', semanticStatus: 'SEMANTICALLY_ADMITTED_WITH_LIMITATIONS', rightsStatus: 'RIGHTS_UNRESOLVED_FOR_HISTORICAL_RETENTION', persistenceStatus: 'PERSISTED_CURRENT_PROJECTION', historicalValue: 'MEDIUM', historicalFieldImpact: 'AVAILABLE_WITH_RIGHTS_HOLD', futureAction: 'CURRENT_PROJECTION_CANDIDATE', limitations: Object.freeze([rightsHold]) }),
  field({ field: 'LivingArea', gridField: 'LivingArea', iresField: 'TotalFinSqFt', availability: 'AVAILABLE', sourceEvidence: 'CSV maps TotalFinSqFt to LivingArea.', semanticStatus: 'SEMANTICALLY_ADMITTED_WITH_LIMITATIONS', rightsStatus: 'RIGHTS_UNRESOLVED_FOR_HISTORICAL_RETENTION', persistenceStatus: 'PERSISTED_CURRENT_PROJECTION', historicalValue: 'MEDIUM', historicalFieldImpact: 'AVAILABLE_WITH_RIGHTS_HOLD', futureAction: 'CURRENT_PROJECTION_CANDIDATE', limitations: Object.freeze([rightsHold]) }),
  field({ field: 'YearBuilt', gridField: 'YearBuilt', iresField: 'YearBuilt', availability: 'AVAILABLE', sourceEvidence: 'CSV maps YearBuilt to YearBuilt.', semanticStatus: 'SEMANTICALLY_ADMITTED_WITH_LIMITATIONS', rightsStatus: 'RIGHTS_UNRESOLVED_FOR_HISTORICAL_RETENTION', persistenceStatus: 'PERSISTED_CURRENT_PROJECTION', historicalValue: 'MEDIUM', historicalFieldImpact: 'AVAILABLE_WITH_RIGHTS_HOLD', futureAction: 'CURRENT_PROJECTION_CANDIDATE', limitations: Object.freeze([rightsHold]) }),
  field({ field: 'PropertyType', gridField: 'PropertyType', iresField: 'ListingTypeID', availability: 'AVAILABLE', sourceEvidence: 'CSV maps ListingTypeID to PropertyType.', semanticStatus: 'SEMANTICALLY_ADMITTED_WITH_LIMITATIONS', rightsStatus: 'RIGHTS_UNRESOLVED_FOR_HISTORICAL_RETENTION', persistenceStatus: 'PERSISTED_CURRENT_PROJECTION', historicalValue: 'MEDIUM', historicalFieldImpact: 'AVAILABLE_WITH_RIGHTS_HOLD', futureAction: 'CURRENT_PROJECTION_CANDIDATE', limitations: Object.freeze([rightsHold]) }),
  field({ field: 'City', gridField: 'City', iresField: 'City', availability: 'AVAILABLE', sourceEvidence: 'CSV maps City to City.', semanticStatus: 'SEMANTICALLY_ADMITTED_WITH_LIMITATIONS', rightsStatus: 'IDX_CURRENT_USE_UNCHANGED', persistenceStatus: 'PERSISTED_CURRENT_PROJECTION', historicalValue: 'MEDIUM', historicalFieldImpact: 'CONFIRMED_AVAILABLE', futureAction: 'CURRENT_PROJECTION_CANDIDATE', limitations: Object.freeze(['No city-set expansion is authorized by this evidence package.']) }),
  field({ field: 'PostalCode', gridField: 'PostalCode', iresField: 'PostalCode', availability: 'AVAILABLE', sourceEvidence: 'CSV maps PostalCode to PostalCode.', semanticStatus: 'SEMANTICALLY_ADMITTED_WITH_LIMITATIONS', rightsStatus: 'IDX_CURRENT_USE_UNCHANGED', persistenceStatus: 'PERSISTED_CURRENT_PROJECTION', historicalValue: 'MEDIUM', historicalFieldImpact: 'CONFIRMED_AVAILABLE', futureAction: 'CURRENT_PROJECTION_CANDIDATE', limitations: Object.freeze(['No ZIP activation expansion is authorized by this evidence package.']) }),
  field({ field: 'CountyOrParish', gridField: 'CountyOrParish', iresField: 'County', availability: 'AVAILABLE', sourceEvidence: 'CSV maps County to CountyOrParish.', semanticStatus: 'SEMANTICALLY_ADMITTED_WITH_LIMITATIONS', rightsStatus: 'RIGHTS_UNRESOLVED_FOR_HISTORICAL_RETENTION', persistenceStatus: 'NOT_PERSISTED', historicalValue: 'MEDIUM', historicalFieldImpact: 'AVAILABLE_WITH_RIGHTS_HOLD', futureAction: 'CURRENT_PROJECTION_CANDIDATE', limitations: Object.freeze(['No county activation expansion is authorized by this evidence package.', rightsHold]) }),
  field({ field: 'MLSAreaMajor', gridField: 'MLSAreaMajor', iresField: 'MLSAreaName', availability: 'AVAILABLE', sourceEvidence: 'CSV maps MLSAreaName to MLSAreaMajor.', semanticStatus: 'SEMANTICS_REQUIRE_SOURCE_DOCUMENTATION', rightsStatus: 'RIGHTS_UNRESOLVED_FOR_HISTORICAL_RETENTION', persistenceStatus: 'NOT_PERSISTED', historicalValue: 'LOW', historicalFieldImpact: 'AVAILABLE_WITH_SEMANTIC_HOLD', futureAction: 'METHODOLOGY_BLOCKED', limitations: Object.freeze(['MLS area semantics require source documentation before ATLAS geography use.']) }),
  field({ field: 'MLSAreaMinor', gridField: 'MLSAreaMinor', iresField: 'MLSSubAreaName', availability: 'AVAILABLE', sourceEvidence: 'CSV maps MLSSubAreaName to MLSAreaMinor.', semanticStatus: 'SEMANTICS_REQUIRE_SOURCE_DOCUMENTATION', rightsStatus: 'RIGHTS_UNRESOLVED_FOR_HISTORICAL_RETENTION', persistenceStatus: 'NOT_PERSISTED', historicalValue: 'LOW', historicalFieldImpact: 'AVAILABLE_WITH_SEMANTIC_HOLD', futureAction: 'METHODOLOGY_BLOCKED', limitations: Object.freeze(['MLS subarea semantics require source documentation before ATLAS geography use.']) }),
  field({ field: 'IRE_CityID', gridField: 'IRE_CityID', iresField: 'CityID', availability: 'AVAILABLE', sourceEvidence: 'CSV maps CityID to IRE_CityID with non-enumerated local values.', semanticStatus: 'SEMANTICALLY_ADMITTED_WITH_LIMITATIONS', rightsStatus: 'RIGHTS_UNRESOLVED_FOR_HISTORICAL_RETENTION', persistenceStatus: 'NOT_PERSISTED', historicalValue: 'MEDIUM', historicalFieldImpact: 'AVAILABLE_WITH_RIGHTS_HOLD', futureAction: 'PROVENANCE_CANDIDATE', limitations: Object.freeze(['IRES local source-specific field; not an ATLAS canonical geography identifier.', 'No city mapping or canonical-geography expansion is authorized.']) }),
]);

export const IRES_ABSENT_PROPERTY_IDX_FIELDS = Object.freeze(
  IRES_SOURCE_FIELD_EVIDENCE.filter((item) => item.availability === 'NOT_AVAILABLE').map((item) => item.field),
);

export const IRES_DOM_EVIDENCE_MATRIX = Object.freeze([
  Object.freeze({ subject: 'ORIGINAL_LIST_DATE', status: 'ADMITTED', evidence: 'ListingContractDate is available and directly recommended by IRES as original-list-date basis.' }),
  Object.freeze({ subject: 'DAYS_SINCE_LISTING_CONTRACT_DATE', status: 'ADMITTED_WITH_LIMITATIONS', evidence: 'Atlas-defined metric candidate may measure elapsed days from ListingContractDate to an explicit evaluation/as-of timestamp; no provider equivalence is claimed.' }),
  Object.freeze({ subject: 'SUPPLIED_DOM', status: 'NON_AUTHORITATIVE_REFERENCE_ONLY', evidence: 'DaysOnMarket is available, but IRES recommends not relying on supplied DOM fields because update behavior may make them incorrect.' }),
  Object.freeze({ subject: 'ACTIVE_LISTING_DOM', status: 'HELD', evidence: 'Missing endpoint, active-population, off-market, pending, and reset evidence.' }),
  Object.freeze({ subject: 'SOLD_LISTING_DOM', status: 'HELD', evidence: 'Missing sold endpoint, population, and reset evidence.' }),
  Object.freeze({ subject: 'AVERAGE_DOM', status: 'HELD', evidence: 'Missing aggregation, population, period, and provider methodology evidence.' }),
  Object.freeze({ subject: 'MEDIAN_DOM', status: 'HELD', evidence: 'Missing aggregation, population, period, and provider methodology evidence.' }),
  Object.freeze({ subject: 'CDOM', status: 'HELD', evidence: 'CumulativeDaysOnMarket is not available in the current mapping and reset/cumulative methodology is not admitted.' }),
  Object.freeze({ subject: 'RELIST_RESET', status: 'HELD', evidence: 'Missing relist, identifier reuse, and reset policy evidence.' }),
  Object.freeze({ subject: 'OFF_MARKET_TREATMENT', status: 'HELD', evidence: 'Missing off-market interval and exclusion evidence.' }),
  Object.freeze({ subject: 'PENDING_TREATMENT', status: 'HELD', evidence: 'Missing pending endpoint and population evidence.' }),
  Object.freeze({ subject: 'IRES_COMPARE_TWO_YEARS_AVERAGE_DOM_EQUIVALENCE', status: 'HELD', evidence: 'Missing IRES report population, period, aggregation, and methodology evidence.' }),
]);

export const IRES_SOURCE_FIELD_RIGHTS_BOUNDARY = Object.freeze({
  idxCurrentUse: 'UNCHANGED',
  realEstateMarketAnalytics: 'RIGHTS_ALIGNMENT_PENDING_PROVIDER_RESPONSE',
  historicalSupersededValueRetention: 'UNRESOLVED_HELD',
  liveHistoricalCapture: 'NOT_AUTHORIZED',
  postTerminationRetention: 'HELD',
  aiAddendum: 'NOT_ACCEPTED',
});

export const IRES_SOURCE_FIELD_PROTECTED_BOUNDARIES = Object.freeze({
  prismaSchemaChange: false,
  migration: false,
  mapperChange: false,
  databaseFieldCreation: false,
  observationTableCreation: false,
  historicalPersistence: false,
  liveCapture: false,
  mlsSyncChange: false,
  providerCall: false,
  subscriptionChange: false,
  rightsExpansion: false,
  aiAddendumAcceptance: false,
  publicClientHistoricalAnalytics: false,
  deployment: false,
});

export function iresSourceFieldEvidence(fieldName: string): IresSourceFieldEvidence | null {
  return IRES_SOURCE_FIELD_EVIDENCE.find((item) => item.field === fieldName) ?? null;
}

export function validateIresSourceFieldListingContractDateEvidence(): boolean {
  const listingContractDate = iresSourceFieldEvidence('ListingContractDate');
  const suppliedDom = iresSourceFieldEvidence('DaysOnMarket');
  const statusChangeTimestamp = iresSourceFieldEvidence('StatusChangeTimestamp');
  const closeDate = iresSourceFieldEvidence('CloseDate');
  const closePrice = iresSourceFieldEvidence('ClosePrice');

  return Boolean(IRES_SOURCE_FIELD_LISTING_CONTRACT_DATE_EVIDENCE_STATUS === 'IRES_SOURCE_FIELD_LISTINGCONTRACTDATE_EVIDENCE_ADMISSION_CERTIFIED'
    && IRES_PROPERTY_IDX_MAPPING_EVIDENCE_SOURCE.observedRows === 2282
    && IRES_PROPERTY_IDX_MAPPING_EVIDENCE_SOURCE.observedUniqueGridFields === 290
    && IRES_PROPERTY_IDX_MAPPING_EVIDENCE_SOURCE.observedUniqueMlsFields === 292
    && listingContractDate?.availability === 'AVAILABLE'
    && listingContractDate.semanticStatus === 'SEMANTICALLY_ADMITTED'
    && listingContractDate.sourceEvidence.includes('original list date')
    && suppliedDom?.availability === 'AVAILABLE'
    && suppliedDom.semanticStatus === 'NON_AUTHORITATIVE_REFERENCE_ONLY'
    && statusChangeTimestamp?.limitations.some((limitation) => limitation.includes('does not supply prior status'))
    && closeDate?.limitations.includes(noProviderEquivalence)
    && closePrice?.limitations.includes(noProviderEquivalence)
    && IRES_ABSENT_PROPERTY_IDX_FIELDS.includes('CumulativeDaysOnMarket')
    && IRES_ABSENT_PROPERTY_IDX_FIELDS.includes('MajorChangeType')
    && IRES_ABSENT_PROPERTY_IDX_FIELDS.includes('PreviousListPrice')
    && IRES_DOM_EVIDENCE_MATRIX.some((item) => item.subject === 'IRES_COMPARE_TWO_YEARS_AVERAGE_DOM_EQUIVALENCE' && item.status === 'HELD')
    && IRES_SOURCE_FIELD_RIGHTS_BOUNDARY.historicalSupersededValueRetention === 'UNRESOLVED_HELD'
    && IRES_SOURCE_FIELD_RIGHTS_BOUNDARY.liveHistoricalCapture === 'NOT_AUTHORIZED'
    && Object.values(IRES_SOURCE_FIELD_PROTECTED_BOUNDARIES).every((value) => value === false));
}
