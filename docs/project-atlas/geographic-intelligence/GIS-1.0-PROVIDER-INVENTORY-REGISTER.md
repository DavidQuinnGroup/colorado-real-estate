# PROJECT ATLAS(tm)

## GIS 1.0 Provider Inventory Register

Status: `GIS_1_0_SPRINT_3_PROVIDER_INVENTORY_GOVERNANCE_CERTIFIED`

Date: July 26, 2026

---

## Register Boundary

This register is an internal governance inventory only. It does not authorize provider use, provider selection, licensing reliance, acquisition, persistence, retrieval, runtime activation, downstream integration, customer display, redistribution, scraping, browser automation, credentials, or relationships.

Canonical source: `PROJECT ATLAS - REAL ESTATE DATA TOOLS`

Boundary note: `PROVIDER_INVENTORY_DOES_NOT_AUTHORIZE_PROVIDER_USE`

## Certification Counts

- Canonical categories represented: `16`
- Inventory entries represented: `64`
- Generic source classes represented: `19`
- Overlap records represented: `3`
- Registry fingerprint: `288d89180b07708b4abc06445d2d7214276324252669c1d6b51611dcb15007dc`

## Canonical Categories

| Category | Representative entries |
| --- | --- |
| `MLS_SYSTEMS_AND_PRIMARY_LISTING_DATA` | IRES MLS; Matrix within IRES; ShowingTime; Supra eKEY; ColoProperty.com |
| `PUBLIC_RECORDS_AND_PROPERTY_RESEARCH` | TitlePro247; IRES Public Records; county assessor source class; county clerk and recorder source class; Colorado Open Records Act request channels |
| `GIS_AND_PARCEL_MAPPING` | Boulder County GIS; Broomfield GIS; Larimer County GIS; Weld County GIS; Adams County GIS; Jefferson County GIS |
| `COUNTY_ASSESSOR_SOURCES` | Boulder County Assessor; Broomfield Assessor; Larimer County Assessor; Weld County Assessor; Adams County Assessor; Jefferson County Assessor |
| `COUNTY_CLERK_AND_RECORDER_SOURCES` | County clerk and recorder source class |
| `MARKET_STATISTICS` | IRES Stats; Local REALTOR association source class |
| `DEMOGRAPHIC_ECONOMIC_EMPLOYMENT_AND_SCHOOL_RESEARCH` | U.S. Census Bureau; Esri; Colorado Department of Labor and Employment; U.S. Bureau of Labor Statistics; GreatSchools; Colorado SchoolView; school district source class |
| `ENVIRONMENTAL_AND_RISK_DATA` | FEMA flood-map source class; Colorado Geological Survey; wildfire-risk source class; air-quality source class; radon-map source class; water-rights source class; U.S. Geological Survey; National Weather Service |
| `BUILDING_AND_PERMIT_DATA` | Building-department source class |
| `PLANNING_AND_DEVELOPMENT` | Planning-department source class |
| `HOA_RESEARCH` | HOA source class |
| `TITLE_COMPANY_RESOURCES` | Title-company resource class |
| `MORTGAGE_AND_FINANCING_TOOLS` | Fannie Mae; Freddie Mac; mortgage and affordability-tool class |
| `CONSUMER_RESEARCH_SITES` | Zillow; Redfin; Realtor.com; Homes.com; Google Maps; Google Street View |
| `PROFESSIONAL_RESEARCH_AND_ANALYTICS_TOOLS` | Cloud CMA; Realtors Property Resource; Remine; InfoSparks; ShowingTime MarketStats; CoreLogic platform class; Black Knight analytics class; ATTOM Data |
| `INVESTMENT_RESEARCH` | Investment-analysis tool class; Opportunity Zone authority/source class; short-term-rental regulation source class; rental-licensing source class |

## Review Dispositions

Sprint 3 supports these governance dispositions without activating any entry:

- `INVENTORY_CONTEXT_ONLY`
- `RESEARCH_CANDIDATE`
- `GOVERNANCE_REVIEW_REQUIRED`
- `LICENSING_REVIEW_REQUIRED`
- `AUTHORITY_REVIEW_REQUIRED`
- `TECHNICAL_REVIEW_REQUIRED`
- `COMMERCIAL_REVIEW_REQUIRED`
- `DUPLICATE_OR_OVERLAPPING`
- `DEFERRED`
- `REJECTED`
- `RETIRED`
- `APPROVED_FOR_FUTURE_PROVIDER_EVALUATION`

## Source Preferences

Sprint 3 source preference is descriptive only:

- `POTENTIAL_PRIMARY_AUTHORITY` does not authorize use.
- `POTENTIAL_PRIMARY_SOURCE` does not authorize use.
- `OPERATIONAL_TOOL_ONLY` separates workflows from evidence authority.
- `RESEARCH_REFERENCE_ONLY` separates public/consumer research context from ingestion, display, and redistribution.
- `UNASSESSED` and `UNKNOWN` remain fail-closed.

## Overlap Records

| Overlap | Entries | Governance posture |
| --- | --- | --- |
| `GIS-S3-OVERLAP-LISTING` | IRES MLS; ColoProperty.com | Listing data may overlap, but roles and rights differ. |
| `GIS-S3-OVERLAP-PUBLIC-RECORDS` | IRES Public Records; county assessor source class; TitlePro247 | Public-record facts may overlap across distributor, office, and commercial aggregator contexts. |
| `GIS-S3-OVERLAP-GIS-ASSESSOR` | Boulder County GIS; Boulder County Assessor | Parcel and ownership layers may overlap, but authority and update cadence differ. |

All overlaps remain unresolved and non-equivalent.

## Stop Conditions

The following conditions block activation:

- Unknown licensing.
- Unknown permitted use.
- Missing stable identity.
- Missing source or dataset identity.
- Missing category, entity type, role, jurisdiction posture, or coverage posture.
- Generic source class without jurisdiction-specific review.
- Operational tool being treated as evidence authority.
- Consumer portal being treated as ingestion, display, or redistribution authority.
- `APPROVED_FOR_FUTURE_PROVIDER_EVALUATION` being treated as acquisition approval.
- Overlap being treated as equivalence.
- Rejected or retired candidate without retained reason or trace.
- Any activation, customer display, or redistribution flag set true.

## Retained Prohibitions

Sprint 3 does not authorize live providers, provider credentials, external calls, API usage, feeds, downloads, scraping, browser automation, provider adapters, provider polling, schema changes, migrations, production reads, production writes, runtime registration, customer-visible routes, Search, Maps, Property Intelligence, AI, Executive Intelligence, relationships, hierarchy traversal, Colorado runtime consumption, or GOF Wave 5.
