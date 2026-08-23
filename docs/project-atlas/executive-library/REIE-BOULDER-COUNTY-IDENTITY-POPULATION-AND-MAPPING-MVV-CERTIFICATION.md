# REIE Boulder County Account-Parcels Identity Readiness MVV Certification

Status: `BOULDER_COUNTY_OPEN_DATA_RIGHTS_AND_IDENTITY_SOURCE_CERTIFIED`

Importer status: `BOULDER_COUNTY_IDENTITY_IMPORTER_READY`

Database status: `BOULDER_COUNTY_DATABASE_POPULATION_PENDING_SUPABASE_RECOVERY`

This certification reconciles an exact, evidence-backed Boulder County Assessor data slice. It authorizes code preparation for `Account_Parcels.csv` only. It does not activate runtime retrieval, database population, property facts, property mapping, customer display, public display, or any other Assessor dataset.

## Official Evidence and Historical Transition

The prior generic `AWAITING_PROVIDER_CONFIRMATION` posture is retained as the historical and still-current posture for broader Assessor domains. It is no longer the governing posture for the exact `Account_Parcels.csv` identity slice because the following official evidence was reconciled on `2026-08-23`:

- [Open Data Terms of Use](https://bouldercounty.gov/government/open-data/terms-of-use/) publishes a worldwide, royalty-free, non-exclusive license for lawful dataset use, modification, and distribution, with attribution, non-endorsement, disclaimer, and user-reliance conditions.
- [Open Data Policy](https://bouldercounty.gov/government/open-data/open-data-policy/) describes public data made available online, in bulk, and in machine-readable form for public access and reuse.
- [Assessor Property Data Download](https://bouldercounty.gov/property-and-land/assessor/data-download/) publishes the Account and Parcel Numbers CSV and states that the downloadable datasets refresh daily at approximately 4 a.m.
- The [Property Data Download Help Manual](https://assets.bouldercounty.gov/wp-content/uploads/2017/02/ar-property-data-download-help.pdf) describes `Account_Parcels.csv`, `strap`, textual 12-character `Parcelno` or folio values, many-to-many account and parcel relationships, nightly updates, and its County disclaimer.
- The canonical official dataset reference is `https://assessor.boco.solutions/ASR_PublicDataFiles/Account_Parcels.csv`.

The manual's accuracy, completeness, reliability, suitability, and user-reliance language is retained as a limitation. It does not create a property-fact or display authorization.

## Bounded Rights and Technical Contract

- Rights: `RECONCILED_FOR_COVERED_BOULDER_OPEN_DATA`.
- Technical access: `OFFICIAL_PUBLIC_BULK_DOWNLOAD_PUBLISHED`.
- Identity dataset: `AUTHORIZED_FOR_BOUNDED_ACCOUNT_PARCEL_IDENTITY_USE`.
- Runtime activation: `NOT_ACTIVE`.
- Database population: `PENDING_SUPABASE_RECOVERY`.
- Property-fact admission, customer display, and public display: `NOT_AUTHORIZED_SEPARATE_GATE`.

The admitted fields are only `strap` and `Parcelno` plus the reported `ACCOUNT_TO_PARCEL` relationship. `Parcelno` remains text; numeric coercion is prohibited because the documented identifier is 12 characters and can contain letters. The parser fail-closes on an unexpected header, malformed CSV row, blank account identifier, or non-12-character nonblank parcel identifier.

## Attribution, Freshness, and Scope Limits

Every future observation must preserve: Boulder County Assessor, `Account_Parcels.csv`, source record date or `CreatedDate` when available, and ATLAS `observedAt` and `ingestedAt`. Use must not imply County endorsement. The County's disclaimer and user-reliance posture remain attached.

The source's stated daily 4 a.m. refresh and the manual's nightly-update description are source semantics, not an invented freshness interval. A future briefing may use a computed timestamp only with the preserved source and ingestion dates.

`Owners and Addresses` is excluded before retrieval. The package excludes owner names, owner mailing addresses, owner targeting, profiling, ownership inference, and ownership guarantees. It also excludes valuation, sales, permits, tax, title, legal description, GIS geometry, property mapping, Search, Map, public routes, and every customer-facing use.

## Importer and Mapping Boundaries

The importer accepts a local, explicitly supplied source file only. It never fetches the provider. Non-mutating validation is available through `--validate-only`. Every database-writing path also requires the explicit `--execute-governed-identity-import` confirmation and remains unauthorized until Supabase recovery and a separate execution decision.

Identity keys are `(sourceId, jurisdictionCode, identifierType, normalizedValue)`. Observations and relationships use SHA-256 fingerprints containing the source payload checksum, so replay is idempotent and changed payloads remain attributable. The bounded importer uses one database connection and an explicit resumable chunk range.

The admitted export contains no non-owner situs address or unit evidence. It therefore creates no `PropertyCountyIdentityMapping` rows. A future separately authorized non-owner source would require exact normalized situs address, exact unit when applicable, Boulder jurisdiction, and a non-conflicting account-to-parcel relationship. Missing evidence produces no candidate; conflicts remain `CONFLICTING`, `AMBIGUOUS`, or `UNMATCHED`.

## Observed Snapshot and Certification Limits

The previously observed source snapshot contained `134,887` Account_Parcels records, `62` blank parcel values, `599` parcels associated with multiple accounts, and `0` accounts with multiple nonblank parcels. Those observed facts guide parser and relationship handling; they do not certify a database population.

The deterministic checker covers parser shape, textual parcel preservation, fingerprints, replay behavior, bounded registry posture, import-write guard presence, and clean, multi-parcel, multi-account, unit, address, collision, and missing-evidence mapping fixtures.

No existing `Property` row is modified. No owner, customer, CRM, protected-trait, MLS Grid, IRES, Search, Map, public route, provider credential, or external communication behavior is activated.
