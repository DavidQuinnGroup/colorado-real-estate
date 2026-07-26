# PROJECT ATLAS(tm)

## GIS 1.0 Environmental Provider Due-Diligence Register

Status: `GIS_1_0_SPRINT_6_CONTROLLED_PROVIDER_DUE_DILIGENCE_CERTIFIED`

Date: July 26, 2026

---

## Boundary

`CONTROLLED PROVIDER DUE DILIGENCE DOES NOT AUTHORIZE PROVIDER USE`

This register records official-source findings only. It contains no provider contact, form submission, account creation, registration, credential request, terms acceptance, contract acceptance, purchase, restricted download, operational acquisition, live adapter, production access, persistence, retrieval, runtime behavior, downstream integration, customer visibility, relationship creation, hierarchy inference, Colorado runtime activation, GOF Wave 5 work, or Sprint 7 work.

## Evaluation Subject

- Subject: `ENVIRONMENTAL_GEOGRAPHIC_EVIDENCE_PROVIDER_EVALUATION`
- Access date for certification snapshot: `2026-07-26`
- Implementation version: `GIS_1_0_SPRINT_6_CONTROLLED_PROVIDER_DUE_DILIGENCE_V1`
- Deterministic fingerprint: `8f436ae895b274528a67859b618e372fc55102a08ae3c28192202fee35650d8a`

## Official Evidence References

| Reference | Provider or authority | Source | URL | Access date | Verification state |
| --- | --- | --- | --- | --- | --- |
| `GIS-S6-SRC-CGS-GIS-PORTAL` | Colorado Geological Survey | GIS Data and Web Map Portal | `https://coloradogeologicalsurvey.org/geology/gis-data-map-portal/` | `2026-07-26` | `OFFICIAL_DOCUMENTATION_VERIFIED` |
| `GIS-S6-SRC-CGS-MAPPING` | Colorado Geological Survey | Geologic Mapping | `https://coloradogeologicalsurvey.org/geology/mapping/` | `2026-07-26` | `OFFICIAL_DOCUMENTATION_VERIFIED` |
| `GIS-S6-SRC-USGS-3DHP` | U.S. Geological Survey | Access 3DHP Data Products | `https://www.usgs.gov/3d-hydrography-program/access-3dhp-data-products` | `2026-07-26` | `CURRENT_AVAILABILITY_VERIFIED` |
| `GIS-S6-SRC-USGS-NHD` | U.S. Geological Survey | National Hydrography Dataset | `https://www.usgs.gov/national-hydrography/national-hydrography-dataset` | `2026-07-26` | `HISTORICAL_ONLY` |
| `GIS-S6-SRC-USGS-TNM-API` | U.S. Geological Survey | The National Map API FAQ | `https://www.usgs.gov/faqs/there-api-accessing-national-map-data` | `2026-07-26` | `ACCESS_METHOD_VERIFIED` |
| `GIS-S6-SRC-USGS-LICENSING` | U.S. Geological Survey | Data Licensing | `https://www.usgs.gov/data-management/data-licensing` | `2026-07-26` | `LICENSING_STATEMENT_IDENTIFIED` |
| `GIS-S6-SRC-FEMA-NFHL-DATAGOV` | FEMA | National Flood Hazard Layer catalog | `https://catalog.data.gov/dataset/national-flood-hazard-layer` | `2026-07-26` | `CURRENT_AVAILABILITY_VERIFIED` |
| `GIS-S6-SRC-FEMA-NFHL-MSC` | FEMA | National Flood Hazard Layer | `https://www.fema.gov/national-flood-hazard-layer-nfhl` | `2026-07-26` | `OFFICIAL_SOURCE_IDENTIFIED` |
| `GIS-S6-SRC-EPA-AQS-API` | EPA | Air Quality System API | `https://aqs.epa.gov/aqsweb/documents/data_api.html` | `2026-07-26` | `ACCESS_METHOD_VERIFIED` |
| `GIS-S6-SRC-CDPHE-AIR-MONITORING` | CDPHE | Air monitoring data and technical reports | `https://cdphe.colorado.gov/public-information/air-monitoring-data-and-technical-reports` | `2026-07-26` | `OFFICIAL_DOCUMENTATION_VERIFIED` |
| `GIS-S6-SRC-CDPHE-AQDX` | CDPHE | Air Quality Data Exchange | `https://cdphe.colorado.gov/air-quality-data-exchange` | `2026-07-26` | `TECHNICAL_FORMAT_VERIFIED` |

## Provider Findings

| Provider or source class | Exact source or dataset reviewed | Coverage | Access and formats | Rights state | Disposition |
| --- | --- | --- | --- | --- | --- |
| Colorado Geological Survey | CGS GIS portal source families: landslide inventory, debris-flow susceptibility maps, earthquake/fault map, geologic-map GIS packages, and CGS REST directories | Colorado statewide and county or publication-specific coverage; exact coverage varies by source family | Public GIS-service documentation; ArcGIS REST, GIS packages, shapefiles, geodatabases, PDF plates | Public access and disclaimer identified; permitted use, redistribution, derivative use, and customer display require review | `RECOMMENDED_FOR_CONTROLLED_PROVIDER_PILOT_AUTHORIZATION_REVIEW` |
| U.S. Geological Survey | 3DHP, legacy NHD, and The National Map API | National products with Colorado subset potential; 3DHP current, NHD legacy | Web services, downloadable products, file geodatabase, shapefile, TNMAccess API | Public-domain/open-license guidance identified; dataset-level license and attribution confirmation required | `RECOMMENDED_FOR_CONTROLLED_PROVIDER_PILOT_AUTHORIZATION_REVIEW` |
| FEMA flood mapping | National Flood Hazard Layer | National flood-hazard dataset with Colorado applicability where effective digital data exists | Public catalog and official FEMA flood-map tools; service endpoint review pending | Government-works license URL identified; customer display and redistribution still require legal review | `FALLBACK_SOURCE_CANDIDATE` |
| Authoritative Colorado air-quality sources | EPA AQS API, CDPHE monitoring documents, and CDPHE AQDx format guidance | National monitor data with Colorado filters possible; Colorado monitoring reports and format guidance | EPA AQS API JSON with email/key parameter; AQDx CSV/JSON; CDPHE reports and plans | API terms and Colorado data rights require review; account/key requirement blocks no-credential pilot | `SUPPLEMENTAL_SOURCE_ONLY` |

## Comparative Review

Colorado Geological Survey is the strongest Colorado-specific geologic and hazard candidate. U.S. Geological Survey is the strongest national authority and technical-access candidate, but the current 3DHP family must remain distinct from historical NHD. FEMA NFHL contributes flood-hazard resilience and public catalog evidence but is narrower than the geologic capability. EPA/CDPHE air evidence is uniquely valuable but supplemental because account/key requirements and the exact operational Colorado source choice remain unresolved.

Revised ordering:

1. `colorado-geological-survey`
2. `u-s-geological-survey`
3. `fema-flood-map-source-class`
4. `air-quality-source-class`

## Minimum Provider Set

Revised proposed set:

- `colorado-geological-survey`
- `u-s-geological-survey`
- `fema-flood-map-source-class`
- `air-quality-source-class`

Classification: due-diligence/pilot-review only. Provider use is not authorized.

## Review Gates

- Legal review required: all four records.
- Technical review required: all four records.
- Commercial review required: Colorado Geological Survey and authoritative Colorado air-quality sources.
- Pilot-authorization-review candidates: Colorado Geological Survey and U.S. Geological Survey.
- Supplemental candidate: authoritative Colorado air-quality sources.
- Fallback candidate: FEMA flood mapping.
- Deferred candidates: none.
- Rejected candidates: none.

## Retained Prohibitions

Provider contact, accounts, registration, credentials, terms acceptance, contracts, purchases, restricted downloads, operational acquisitions, live adapters, persistence, retrieval, enterprise consumption, runtime, downstream integration, customer visibility, Colorado runtime consumption, geographic relationships, hierarchy inference, GOF Wave 5, and Sprint 7 remain `NOT_AUTHORIZED`.
