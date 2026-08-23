# Source Rights and Licensing Matrix(tm) 1.0

Status: `SOURCE_RIGHTS_AND_LICENSING_MATRIX_CREATED`

Date: July 29, 2026

## Executive Summary

This matrix converts the earlier source-rights inventory into a counsel-ready and provider-ready dossier. It does not authorize source activation, scraping, persistence, redistribution, or customer display. Codex does not issue final legal conclusions.

## Matrix

| Source | Legal Entity / Provider | Records Required | Storage | Public Display | Decision |
| --- | --- | --- | --- | --- | --- |
| Boulder County Open Data | Boulder County, Colorado | Parcels, zoning, property information, metadata | Likely eligible after dataset review | Requires dataset review | `APPROVE_WITH_CONDITIONS` |
| City of Boulder Open Data permits | City of Boulder | Construction permits, current project map data, planning case data | Provider confirmation required | Provider confirmation required | `PROVIDER_CONFIRMATION_REQUIRED` |
| Boulder County Assessor, broader record domains | Boulder County Assessor | Property type, parcel attributes, valuation context, subdivision relationships | Legal review required | Legal review required | `LEGAL_REVIEW_REQUIRED` |
| Boulder County Assessor, `Account_Parcels.csv` identity slice | Boulder County Assessor | `strap` account identifier, textual 12-character `Parcelno` identifier, and reported account-to-parcel relationships only | Bounded importer code readiness only; database population separately pending Supabase recovery | Not authorized | `RECONCILED_FOR_COVERED_BOULDER_OPEN_DATA` |
| Boulder County Accela | Boulder County CPP / Accela | Permit applications, license records, status metadata | Not approved | Not approved | `PROVIDER_CONFIRMATION_REQUIRED` |
| Boulder County Recorder | Boulder County Clerk and Recorder | Deeds, liens, plats, recorded document indexes | Legal review required | Legal review required | `LEGAL_REVIEW_REQUIRED` |
| Municipal planning records | City of Boulder and future municipalities | Plans, zoning references, projects, infrastructure context | Provider confirmation required | Provider confirmation required | `PROVIDER_CONFIRMATION_REQUIRED` |
| DQG-owned imagery | David Quinn Group | Asset files, ownership/release, location verification | Approve with documentation | Approve with documentation | `APPROVE_WITH_CONDITIONS` |
| Licensed third-party imagery | Image provider / photographer | Asset, license, attribution, renewal terms | Contract-specific | Contract-specific | `PROVIDER_CONFIRMATION_REQUIRED` |
| MLS-derived city intelligence | Existing governed REIE MLS/listing pipeline | Inventory, days on market, median price, market summaries | Already repository-local | Existing bounded market display | `APPROVE` |

## Official Source References

- Boulder County Open Data: `https://bouldercounty.gov/government/open-data/`
- Boulder County Assessor: `https://bouldercounty.gov/departments/assessor/`
- Boulder County Accela: `https://aca-prod.accela.com/BOCO/`
- Boulder County Clerk and Recorder search: `https://boulder.co.ds.search.govos.com/`
- City of Boulder P&DS records resources: `https://bouldercolorado.gov/planning-development-services-records-request-resources`
- City of Boulder Planning & Development Services: `https://bouldercolorado.gov/government/departments/planning-development-services`

## Boundary

This matrix is not legal advice and does not issue final legal conclusions. The `Account_Parcels.csv` row records the Executive-accepted, source-specific official publication and licensing evidence; it does not authorize external retrieval, database population, property facts, property mapping, customer display, public display, or any other Boulder County dataset. Attribution, non-endorsement, County disclaimer, and user-reliance limitations remain required.
