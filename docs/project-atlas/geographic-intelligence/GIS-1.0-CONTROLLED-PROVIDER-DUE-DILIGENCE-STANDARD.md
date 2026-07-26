# PROJECT ATLAS(tm)

## GIS 1.0 Controlled Provider Due Diligence Standard

Status: `GIS_1_0_SPRINT_6_CONTROLLED_PROVIDER_DUE_DILIGENCE_CERTIFIED`

Date: July 26, 2026

---

## Boundary

`CONTROLLED PROVIDER DUE DILIGENCE DOES NOT AUTHORIZE PROVIDER USE`

Controlled provider due diligence is an internal, evidence-backed review stage between Sprint 5 provider evaluation and any future provider-pilot authorization review. It may identify official sources, datasets, access methods, terms statements, uncertainty, and candidate dispositions. It does not approve providers, legal rights, acquisition, adapters, persistence, retrieval, runtime, downstream integration, customer visibility, relationships, hierarchy inference, Colorado runtime consumption, or Sprint 7.

## Principles

- `GIS-CPDD-P001 Official Evidence Principle`: material findings rely primarily on official provider or government sources.
- `GIS-CPDD-P002 Current Verification Principle`: current availability, identity, access methods, and publication status carry an explicit verification date.
- `GIS-CPDD-P003 Licensing Precision Principle`: public accessibility is not treated as rights approval.
- `GIS-CPDD-P004 Access Is Not Authorization Principle`: APIs, downloads, GIS services, and webpages do not authorize REIE acquisition or use.
- `GIS-CPDD-P005 Dataset-Level Review Principle`: exact datasets and source families are reviewed, not organizations alone.
- `GIS-CPDD-P006 Provider and Authority Separation Principle`: provider, authority, publisher, distributor, dataset, portal, and service remain distinct.
- `GIS-CPDD-P007 Unknown Preservation Principle`: unresolved licensing, technical, cost, coverage, and continuity questions remain unknown.
- `GIS-CPDD-P008 Terms Preservation Principle`: terms are referenced without acceptance.
- `GIS-CPDD-P009 Technical Readiness Separation Principle`: documented technical access does not imply integration readiness.
- `GIS-CPDD-P010 Coverage Verification Principle`: statewide, national, county, service-area, vector, raster, point, and variable coverage remain distinct.
- `GIS-CPDD-P011 Temporal Verification Principle`: update cadence, publication date, effective date, version date, and access date remain separate.
- `GIS-CPDD-P012 Source Suitability Principle`: each source is evaluated against environmental geographic evidence needs.
- `GIS-CPDD-P013 Evidence Reproducibility Principle`: conclusions trace to source references and deterministic snapshots.
- `GIS-CPDD-P014 No Contact Principle`: research does not escalate to contact, account creation, registration, sales engagement, or credentials.
- `GIS-CPDD-P015 No Acquisition Principle`: metadata and documentation may be inspected; operational datasets are not acquired.
- `GIS-CPDD-P016 Legal Review Boundary Principle`: Codex records legal questions but does not provide legal approval.
- `GIS-CPDD-P017 Comparative Neutrality Principle`: evidence may confirm, weaken, reorder, defer, or reject Sprint 5 candidates.
- `GIS-CPDD-P018 Decision Gate Principle`: the strongest result is `RECOMMENDED_FOR_CONTROLLED_PROVIDER_PILOT_AUTHORIZATION_REVIEW`, which does not authorize a pilot.

## Contract Requirements

Every due-diligence record must include:

- due-diligence ID, version, evaluation subject, and inventory-entry ID;
- canonical provider name and exact source or dataset reviewed;
- provider role, publisher, originating authority, jurisdiction, and coverage;
- intelligence domain and environmental evidence categories;
- official source references with URL, publisher, access date, content category, evidence summary, verification state, authority classification, and fingerprint;
- access method, authentication, account, cost, licensing, permitted-use, attribution, redistribution, derivative-use, and customer-display states;
- update cadence, technical formats, API or GIS-service state, documentation quality, source stability, continuity risk, and uncertainty;
- legal, commercial, and technical review requirements;
- findings, unresolved questions, disposition, deterministic fingerprint, internal-only state, and all authorization flags.

All authorization flags must remain false.

## Finding Categories

Supported categories include provider identity, authority identity, dataset identity, geographic coverage, subject coverage, evidence category, publication frequency, update cadence, access method, file format, API documentation, GIS service, authentication, account requirement, cost, license, terms, attribution, derivative use, customer display, redistribution, data quality, metadata quality, documentation quality, continuity, deprecation, technical limitation, legal question, commercial question, and unknown.

## Verification States

Required verification states include `NOT_RESEARCHED`, `OFFICIAL_SOURCE_IDENTIFIED`, `OFFICIAL_DOCUMENTATION_VERIFIED`, `CURRENT_AVAILABILITY_VERIFIED`, `DATASET_IDENTITY_VERIFIED`, `ACCESS_METHOD_VERIFIED`, `LICENSING_STATEMENT_IDENTIFIED`, `TERMS_IDENTIFIED`, `ATTRIBUTION_REQUIREMENT_IDENTIFIED`, `TECHNICAL_FORMAT_VERIFIED`, `PARTIALLY_VERIFIED`, `CONFLICTING_EVIDENCE`, `HISTORICAL_ONLY`, `VERIFICATION_REQUIRED`, and `UNRESOLVED`.

## Dispositions

Permitted dispositions include `NOT_RESEARCHED`, `INSUFFICIENT_OFFICIAL_EVIDENCE`, `OUTSIDE_CAPABILITY_SCOPE`, `DUPLICATIVE_WITH_STRONGER_SOURCE`, `SUPPLEMENTAL_SOURCE_ONLY`, `FALLBACK_SOURCE_CANDIDATE`, `LICENSING_REVIEW_REQUIRED`, `LEGAL_REVIEW_REQUIRED`, `TECHNICAL_REVIEW_REQUIRED`, `COMMERCIAL_REVIEW_REQUIRED`, `DEFERRED`, `REJECTED`, `RETAINED_FOR_MONITORING`, and `RECOMMENDED_FOR_CONTROLLED_PROVIDER_PILOT_AUTHORIZATION_REVIEW`.

## Required Controls

Sprint 6 safety validation must prove there are no Prisma imports, database clients, SQL, migrations, production access, environment-variable access, credentials, account creation, provider contact, procurement, purchasing, restricted downloads, scraping bypass, real provider adapters, polling, scheduling, queues, persistence, production retrieval, runtime registry, routes, pages, downstream integration, customer visibility, redistribution authorization, geographic relationships, hierarchy inference, Colorado runtime activation, GOF/EKCP/Sprint 7 modification, or GIS Sprint 1-5 semantic regression.

The certification must also prove all findings cite official evidence, all current claims have access dates, unknown rights fail closed, conflicting evidence is preserved, terms are not accepted, pilot-review recommendations are non-activating, all authorization flags remain false, provider data acquisition is zero, production effects are zero, repeated certification is deterministic, and Sprint 7 remains unauthorized.
