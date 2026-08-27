# IRES Source Field and ListingContractDate Evidence Admission Certification

## A. Executive Result

`IRES_SOURCE_FIELD_LISTINGCONTRACTDATE_EVIDENCE_ADMISSION_CERTIFIED`

PROJECT ATLAS admits bounded repository evidence from the IRES Property IDX mapping export and direct IRES DOM guidance. This package records source-field availability, admits `ListingContractDate` as the IRES-supported original-list-date basis, demotes supplied `DaysOnMarket` to non-authoritative reference evidence, and preserves all rights, methodology, persistence, and runtime holds.

No Prisma schema, migration, mapper, MLS sync, provider call, historical persistence, live capture, public/client analytics, subscription, AI Addendum, deployment, or production behavior changed.

## B. Source Evidence

Mapping export:

- Source path: MLS Grid > Mappings > IRES > IDX > Property resource
- Export name: `iresToGridMappingsPropertyIDX (1).csv`
- Structural evidence: 2,282 rows, 290 unique Grid fields, 292 unique MLS fields
- Evidence date: 2026-08-27

Direct IRES methodology guidance:

- IRES recommends using Listing Contract Date to determine original list date.
- IRES recommends performing the elapsed-days calculation from that date.
- IRES highly recommends not relying on supplied days-on-market fields because they may not update unless a listing change triggers an update.

MLS Grid support guidance:

- `StandardStatus` is the primary RESO status field.
- `MlsStatus` provides local status context.
- Change-history-related fields vary by MLS and must be governed by the actual IRES IDX mapping export.

## C. Source Field Classification

| Field | Source Availability | Semantic Status | Current Persistence Status | Rights Status | Historical Value | Final Recommendation |
|-------|---------------------|-----------------|----------------------------|---------------|------------------|----------------------|
| `ListingKey` | Available | Admitted | Partly current projection | Retention unresolved | High | Historical observation candidate |
| `ListingId` | Available | Admitted | Partly current projection | Retention unresolved | High | Historical observation candidate |
| `StandardStatus` | Available | Admitted with limitations | Persisted current projection | Retention unresolved | High | Status observation candidate |
| `MlsStatus` | Available | Admitted with limitations | Persisted current projection | Retention unresolved | Medium | Local context candidate |
| `StatusChangeTimestamp` | Available | Admitted with limitations | Not persisted | Retention unresolved | High | Provenance candidate; not event ledger |
| `ListingContractDate` | Available | Admitted | Not persisted | Retention unresolved | High | Original-list-date basis |
| `OriginatingSystemModificationTimestamp` | Available | Admitted with limitations | Partly persisted as `sourceModifiedAt` | IDX current use unchanged | Medium | Source freshness/provenance candidate |
| `ListPrice` | Available | Admitted with limitations | Persisted current projection | Retention unresolved | High | Current/observation candidate |
| `OriginalListPrice` | Available | Admitted with limitations | Not persisted | Retention unresolved | High | Historical observation candidate |
| `PriceChangeTimestamp` | Available | Admitted with limitations | Not persisted | Retention unresolved | Medium | Provenance candidate; not price history |
| `CloseDate` | Available | Admitted with limitations | Not persisted | Retention unresolved | High | Historical observation candidate; sale analytics held |
| `ClosePrice` | Available | Admitted with limitations | Not persisted | Retention unresolved | High | Historical observation candidate; SP/LP held |
| `DaysOnMarket` | Available | Non-authoritative reference only | Not persisted | Retention unresolved | Low | Do not use for authoritative REIE DOM |
| `CumulativeDaysOnMarket` | Not available in current IRES Property IDX mapping export | Not applicable | Not applicable | Not applicable | None | Hold |
| `MajorChangeType` | Not available in current IRES Property IDX mapping export | Not applicable | Not applicable | Not applicable | None | Hold |
| `MajorChangeTimestamp` | Not available in current IRES Property IDX mapping export | Not applicable | Not applicable | Not applicable | None | Hold |
| `PurchaseContractDate` | Not available in current IRES Property IDX mapping export | Not applicable | Not applicable | Not applicable | None | Hold |
| `PreviousListPrice` | Not available in current IRES Property IDX mapping export | Not applicable | Not applicable | Not applicable | None | Hold |
| `OnMarketDate` | Not available in current IRES Property IDX mapping export | Not applicable | Not applicable | Not applicable | None | Hold |
| `OriginalEntryTimestamp` | Not available in current IRES Property IDX mapping export | Not applicable | Not applicable | Not applicable | None | Hold |
| `ExpirationDate` | Not available in current IRES Property IDX mapping export | Not applicable | Not applicable | Not applicable | None | Hold |
| `WithdrawnDate` | Not available in current IRES Property IDX mapping export | Not applicable | Not applicable | Not applicable | None | Hold |
| `CanceledDate` | Not available in current IRES Property IDX mapping export | Not applicable | Not applicable | Not applicable | None | Hold |
| `OffMarketDate` | Not available in current IRES Property IDX mapping export | Not applicable | Not applicable | Not applicable | None | Hold |
| `BedroomsTotal` | Available | Admitted with limitations | Persisted current projection | Retention unresolved | Medium | Current projection candidate |
| `BathroomsTotalInteger` | Available | Admitted with limitations | Persisted current projection | Retention unresolved | Medium | Current projection candidate |
| `LivingArea` | Available | Admitted with limitations | Persisted current projection | Retention unresolved | Medium | Current projection candidate |
| `YearBuilt` | Available | Admitted with limitations | Persisted current projection | Retention unresolved | Medium | Current projection candidate |
| `PropertyType` | Available | Admitted with limitations | Persisted current projection | Retention unresolved | Medium | Current projection candidate |
| `City` | Available | Admitted with limitations | Persisted current projection | IDX current use unchanged | Medium | No city-set expansion |
| `PostalCode` | Available | Admitted with limitations | Persisted current projection | IDX current use unchanged | Medium | No ZIP expansion |
| `CountyOrParish` | Available | Admitted with limitations | Not persisted | Retention unresolved | Medium | Future review only |
| `MLSAreaMajor` | Available | Source documentation required | Not persisted | Retention unresolved | Low | Methodology hold |
| `MLSAreaMinor` | Available | Source documentation required | Not persisted | Retention unresolved | Low | Methodology hold |
| `IRE_CityID` | Available | Admitted with limitations | Not persisted | Retention unresolved | Medium | Source-specific provenance candidate |

## D. ListingContractDate Evidence Admission

`ListingContractDate` is confirmed in the IRES Property IDX mapping as Grid `ListingContractDate` from IRES `ListDate`.

It is now admitted as the IRES-supported original-list-date basis. The updated repository artifacts are:

- `lib/iresSourceFieldListingContractDateEvidence.ts`
- `lib/marketMetricDefinitionEvidence.ts`
- `scripts/checkIresSourceFieldListingContractDateEvidence.ts`
- `scripts/checkMarketMetricDefinitionEvidence.ts`

Limitations preserved:

- no provider-equivalent DOM endpoint;
- no pending, sold, withdrawal, expiration, cancellation, or off-market treatment;
- no relist/reset policy;
- no CDOM;
- no IRES Average DOM population;
- no Compare Two Years equivalence;
- no runtime calculation or persistence.

## E. Days-On-Market Field Disposition

IRES-SUPPLIED DOM FIELD
-> AVAILABLE BUT NON-AUTHORITATIVE FOR REIE DOM

`DaysOnMarket` is present in the mapping, but repository evidence classifies it as `NON_AUTHORITATIVE_REFERENCE_ONLY`. IRES's direct reason is that supplied days-on-market fields may not automatically update unless a listing change triggers an update.

No existing mapper persistence currently relies on `DaysOnMarket`. No runtime behavior changed. Future remediation is limited to avoiding authoritative DOM claims unless a later methodology package supplies endpoint, reset, population, and rights evidence.

## F. DOM / Market-Time Matrix

| Subject | Status | Missing Evidence For Held Items |
|---------|--------|----------------------------------|
| Original list date | ADMITTED | None for original-list-date basis |
| `DAYS_SINCE_LISTING_CONTRACT_DATE` | ADMITTED_WITH_LIMITATIONS | Runtime exposure, population, rights, and provider-equivalence evidence |
| Supplied DOM | NON_AUTHORITATIVE_REFERENCE_ONLY | Authoritative update behavior |
| Active listing DOM | HELD | Endpoint, active population, off-market, pending, and reset evidence |
| Sold listing DOM | HELD | Sold endpoint, sold population, and reset evidence |
| Average DOM | HELD | Aggregation, population, period, and provider methodology |
| Median DOM | HELD | Aggregation, population, period, and provider methodology |
| CDOM | HELD | Field availability plus cumulative/reset methodology |
| Relist reset | HELD | Relist and identifier-reuse policy |
| Off-market treatment | HELD | Interval and exclusion evidence |
| Pending treatment | HELD | Pending endpoint and population evidence |
| IRES Compare Two Years Average DOM equivalence | HELD | IRES report population, period, aggregation, and methodology |

## G. Status Field Findings

`StandardStatus`, `MlsStatus`, and `StatusChangeTimestamp` are source-available. `StandardStatus` is the primary RESO status grouping; `MlsStatus` is local status context; `StatusChangeTimestamp` is a latest status-change timestamp candidate.

This does not admit full status history, previous status, event sequence, relisting history, or point-in-time historical state. `MajorChangeType` and `MajorChangeTimestamp` are not available in the current IRES Property IDX mapping export.

## H. Price Field Findings

`ListPrice`, `OriginalListPrice`, `PriceChangeTimestamp`, and `ClosePrice` are source-available. `ListPrice` is current/source list-price evidence. `OriginalListPrice` is source-available original-list-price evidence. `PriceChangeTimestamp` is a timestamp candidate, not an ordered price-history ledger. `PreviousListPrice` is not available in the current IRES Property IDX mapping export.

No complete historical price sequence, previous price, final-before-contract price, concessions, corrected transaction price, SP/LP denominator, SP/LP formula, or IRES sale-statistics population is admitted.

## I. Close / Sale Field Findings

`CloseDate` and `ClosePrice` are source-available and not currently persisted. They have high historical value, but rights and sale-statistics methodology remain held.

Source-field availability did not admit sold counts, dollar volume, sale-price statistics, SP/LP, quarterly sales, or Compare Two Years equivalence.

## J. Absent-Field Register

The following fields are `NOT AVAILABLE IN CURRENT IRES PROPERTY IDX MAPPING EXPORT`:

- `CumulativeDaysOnMarket`
- `MajorChangeType`
- `MajorChangeTimestamp`
- `PurchaseContractDate`
- `PreviousListPrice`
- `OnMarketDate`
- `OriginalEntryTimestamp`
- `ExpirationDate`
- `WithdrawnDate`
- `CanceledDate`
- `OffMarketDate`

This does not claim they are unavailable across all IRES products, subscriptions, uses, or resources.

## K. IRES CityID Status

`IRE_CityID` is source-available as an IRES local field from `CityID`. It is not persisted and remains source-specific. No canonical-geography authority changed, no city mapping changed, and there was `NO CANONICAL-GEOGRAPHY EXPANSION IN THIS PACKAGE`.

## L. Current Persistence Gap

| Source Field | Available | Persisted? | Current Target | Future Classification | Blocker |
|--------------|-----------|------------|----------------|-----------------------|---------|
| `ListingContractDate` | Yes | No | None | Historical observation candidate | Rights and schema gate |
| `OriginalListPrice` | Yes | No | None | Historical observation candidate | Rights and schema gate |
| `PriceChangeTimestamp` | Yes | No | None | Provenance candidate | Rights and methodology |
| `StatusChangeTimestamp` | Yes | No | None | Provenance candidate | Rights and event-ledger methodology |
| `CloseDate` | Yes | No | None | Historical observation candidate | Rights and sale methodology |
| `ClosePrice` | Yes | No | None | Historical observation candidate | Rights and sale methodology |
| `IRE_CityID` | Yes | No | None | Provenance candidate | Source-specific geography reconciliation |

## M. HISTORICAL_FIELD_SET_V1 Impact

| Field Area | Classification |
|------------|----------------|
| Listing identity | CONFIRMED_AVAILABLE with rights hold |
| Normalized status | CONFIRMED_AVAILABLE with rights hold |
| Asking list price | CONFIRMED_AVAILABLE with rights hold |
| Original list date | CONFIRMED_AVAILABLE with rights hold |
| Pending date | CONFIRMED_UNAVAILABLE |
| Close date | CONFIRMED_AVAILABLE with rights hold |
| MLS-reported close price | CONFIRMED_AVAILABLE with rights hold |
| Expiration date | CONFIRMED_UNAVAILABLE |
| Withdrawn/canceled date | CONFIRMED_UNAVAILABLE |
| Property facts | CONFIRMED_AVAILABLE with rights hold |
| Listing city and ZIP | CONFIRMED_AVAILABLE |
| Source modified timestamp | CONFIRMED_AVAILABLE |
| Raw payload / remarks / photos / contacts / PII | DEFERRED |

NO HISTORICAL RETENTION AUTHORIZATION WAS GRANTED.

## N. Rights-Boundary Result

- IDX current use: UNCHANGED
- REMA: RIGHTS ALIGNMENT PENDING PROVIDER RESPONSE
- Historical superseded-value retention: UNRESOLVED / HELD
- Live historical capture: NOT AUTHORIZED
- Post-termination retention: HELD
- AI Addendum: NOT ACCEPTED

## O. Required Evidence Table

| Field | Available | Semantically Admitted | Rights Admitted | Persisted | Historical Use |
|-------|-----------|------------------------|-----------------|-----------|----------------|
| `ListingContractDate` | Yes | Yes, original-list-date basis | No | No | Candidate after rights clearance |
| `DaysOnMarket` | Yes | Non-authoritative reference only | No | No | Not authoritative |
| `StatusChangeTimestamp` | Yes | With limitations | No | No | Provenance candidate only |
| `OriginalListPrice` | Yes | With limitations | No | No | Candidate after rights clearance |
| `PriceChangeTimestamp` | Yes | With limitations | No | No | Not ordered price history |
| `CloseDate` | Yes | With limitations | No | No | Candidate after rights clearance |
| `ClosePrice` | Yes | With limitations | No | No | Candidate after rights clearance |
| `IRE_CityID` | Yes | With limitations | No | No | Source-specific only |

## P. Required DOM Summary

IRES-SUPPLIED DOM FIELD
-> AVAILABLE BUT NON-AUTHORITATIVE FOR REIE DOM

IRES LISTING CONTRACT DATE
-> AUTHORITATIVE SOURCE-SUPPORTED ORIGINAL LIST DATE BASIS

ATLAS DAYS_SINCE_LISTING_CONTRACT_DATE
-> EXPLICIT ATLAS-DEFINED METRIC CANDIDATE / ADMITTED ONLY TO THE EXTENT SUPPORTED BY THE EVIDENCE CONTRACT

IRES PROVIDER-EQUIVALENT DOM
-> NOT YET ADMITTED

IRES AVERAGE DOM REPORT METRIC
-> NOT YET ADMITTED

CDOM
-> NOT YET ADMITTED

RELIST / RESET POLICY
-> NOT YET ADMITTED

## Q. Checker / Certification Result

Checker name: `check:ires-source-field-listingcontractdate-evidence`

Files:

- `lib/iresSourceFieldListingContractDateEvidence.ts`
- `lib/marketMetricDefinitionEvidence.ts`
- `scripts/checkIresSourceFieldListingContractDateEvidence.ts`
- `docs/project-atlas/executive-library/IRES-SOURCE-FIELD-LISTINGCONTRACTDATE-EVIDENCE-ADMISSION-CERTIFICATION.md`

Assertions:

- `ListingContractDate` is source-available.
- `ListingContractDate` is admitted as original-list-date basis.
- Supplied `DaysOnMarket` is not authoritative for DOM.
- `CloseDate` and `ClosePrice` availability does not admit sale analytics.
- `StatusChangeTimestamp` availability does not create a historical ledger.
- Absent fields remain explicitly unavailable in this mapping.
- Rights remain fail-closed for historical retention.
- Provider-equivalent DOM remains held.
- No schema, persistence, mapper, or capture admission occurred.

## R. Runtime Impact

This package changed no Prisma schema, mapper, MLS sync, API, Agent UI, public UI, current cohort calculations, historical capture, data retention, provider settings, subscription settings, deployment, or customer-facing behavior.

## S. Known Holds

Rights holds:

- Real Estate Market Analytics authorization.
- Historical superseded-value retention.
- Post-termination retained observation and derived-output disposition.
- CMA authorization for property-specific valuation/AVM output.

Methodology holds:

- Provider-equivalent DOM.
- IRES Average DOM.
- CDOM.
- Relist/reset.
- Off-market, pending, sold endpoint treatment.
- Sale analytics and SP/LP.

Data availability holds:

- `CumulativeDaysOnMarket`, `MajorChangeType`, `MajorChangeTimestamp`, `PurchaseContractDate`, `PreviousListPrice`, `OnMarketDate`, `OriginalEntryTimestamp`, `ExpirationDate`, `WithdrawnDate`, `CanceledDate`, and `OffMarketDate` for the current IRES Property IDX mapping.

Runtime implementation holds:

- Mapper expansion.
- Observation schema.
- Historical persistence.
- Live capture.
- Public/client historical analytics.

## T. Next Repository Gate

`READY_FOR_IRES_SOURCE_FIELD_MAPPER_ADMISSION_REVIEW_AFTER_RIGHTS_ALIGNMENT`

The next repository-local gate should remain an admission review, not implementation, unless the rights track returns explicit retention and lifecycle authority.
