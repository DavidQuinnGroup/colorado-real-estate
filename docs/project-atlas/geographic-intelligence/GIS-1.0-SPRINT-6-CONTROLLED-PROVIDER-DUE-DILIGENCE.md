# PROJECT ATLAS(tm)

## GIS 1.0 Sprint 6 Controlled Provider Due Diligence

Status: `GIS_1_0_SPRINT_6_CONTROLLED_PROVIDER_DUE_DILIGENCE_CERTIFIED`

Date: July 26, 2026

---

## Certification Summary

GIS Sprint 6 established a controlled, read-only, official-source-backed provider due-diligence framework for environmental geographic evidence. It reviewed Colorado Geological Survey, U.S. Geological Survey, FEMA flood mapping, and authoritative Colorado air-quality sources; recorded source references, access dates, findings, unknowns, comparison results, and dispositions; and certified that due diligence does not authorize provider use, legal approval, licensing approval, acquisition, adapters, persistence, retrieval, runtime, downstream integration, customer visibility, relationships, hierarchy inference, Colorado runtime consumption, GOF Wave 5, or Sprint 7.

## Implemented Surface

- `lib/geographic-intelligence/providerDueDiligenceContract.ts`
- `lib/geographic-intelligence/providerDueDiligenceValidation.ts`
- `lib/geographic-intelligence/fixtures/gisSprint6ProviderDueDiligenceFixtures.ts`
- `scripts/checkGeographicIntelligenceProviderDueDiligenceSafety.ts`
- `scripts/certifyGeographicIntelligenceProviderDueDiligence.ts`
- `docs/project-atlas/geographic-intelligence/GIS-1.0-CONTROLLED-PROVIDER-DUE-DILIGENCE-STANDARD.md`
- `docs/project-atlas/geographic-intelligence/GIS-1.0-SPRINT-6-CONTROLLED-PROVIDER-DUE-DILIGENCE.md`
- `docs/project-atlas/geographic-intelligence/GIS-1.0-ENVIRONMENTAL-PROVIDER-DUE-DILIGENCE-REGISTER.md`

## Relationship To Sprints 1-5

Sprint 6 reuses Sprint 1 fail-closed activation, Sprint 2 deterministic evidence fingerprints, Sprint 3 provider inventory identities, Sprint 4 isolation conventions, and Sprint 5 due-diligence candidates and proposed minimum-provider-set artifacts. It does not semantically modify certified Sprint 1-5 contracts.

## Research Method

Research used official provider or government webpages, official dataset catalogs, official API or GIS-service documentation, official terms or licensing guidance, and official agency publications. Search snippets, unofficial blogs, reseller descriptions, community posts, social media, and AI-generated summaries were not used as final evidence.

Material findings record URL, title, publisher, access date, evidence summary, verification state, unresolved questions, and deterministic fingerprint. The certification access date is fixed as `2026-07-26`.

## Due-Diligence Findings

### Colorado Geological Survey

- Authority: Colorado Geological Survey.
- Datasets/source families: GIS Data and Web Map Portal; geologic mapping products; Colorado Landslide Inventory; debris-flow susceptibility maps; Colorado Earthquake and Fault Map; geologic-map GIS packages; CGS REST service directories.
- Coverage: Colorado statewide and county or publication-specific coverage; exact coverage varies by source family.
- Categories: geologic context, geologic hazards, landslides, debris flow, faults and earthquakes, groundwater, minerals.
- Access: public GIS-service documentation, GIS packages, shapefiles, geodatabases, PDF plates.
- Authentication/accounts: not indicated.
- Cost: no cost stated for many downloads.
- Licensing/terms/attribution: public access and disclaimer identified; rights for REIE permitted use, redistribution, derivative use, and customer display remain review-required.
- Disposition: `RECOMMENDED_FOR_CONTROLLED_PROVIDER_PILOT_AUTHORIZATION_REVIEW`.

### U.S. Geological Survey

- Authority: U.S. Geological Survey.
- Datasets/source families: 3D Hydrography Program, legacy National Hydrography Dataset, and The National Map access API.
- Coverage: national products with Colorado subset potential.
- Categories: hydrography, topography, water context, geographic basemap context.
- Access: web services, downloadable products, file geodatabase, shapefile, TNMAccess API.
- Authentication/accounts: not indicated in reviewed official pages.
- Cost: no cost stated in reviewed official pages.
- Licensing/terms/attribution: public-domain/open-license guidance and attribution guidance identified; dataset-level license and non-USGS component checks remain required.
- Conflicting evidence: 3DHP is current while NHD is legacy and no longer maintained.
- Disposition: `RECOMMENDED_FOR_CONTROLLED_PROVIDER_PILOT_AUTHORIZATION_REVIEW`.

### FEMA Flood Mapping

- Authority: Federal Emergency Management Agency.
- Dataset: National Flood Hazard Layer.
- Coverage: national flood-hazard data with Colorado applicability where effective digital data exists; exact Colorado completeness remains unresolved.
- Categories: flood hazard, FIRM context, environmental risk.
- Access: public catalog and FEMA flood-map tools; GIS service endpoint review remains a technical gate.
- Authentication/accounts: not indicated.
- Cost: no cost stated.
- Licensing/terms/attribution: government-works license URL identified in Data.gov catalog; customer display and redistribution require legal review.
- Disposition: `FALLBACK_SOURCE_CANDIDATE`.

### Authoritative Colorado Air-Quality Sources

- Authority: EPA and CDPHE.
- Datasets/source families: EPA AQS API, CDPHE air monitoring data and technical reports, CDPHE AQDx format guidance.
- Coverage: national monitor data with Colorado filters possible; Colorado monitoring reports and format guidance.
- Categories: air quality, ambient monitoring, stationary-source context, data-quality context.
- Access: EPA AQS API JSON with email/key parameter; AQDx CSV/JSON; CDPHE reports and plans.
- Authentication/accounts: indicated for EPA AQS API email/key parameter; no key was requested.
- Cost: not stated.
- Licensing/terms/attribution: API terms and CDPHE data rights require review.
- Disposition: `SUPPLEMENTAL_SOURCE_ONLY`.

## Scenario Certification

| Scenario | Result |
| --- | --- |
| A Official Dataset Verified | `OFFICIAL_DOCUMENTATION_VERIFIED` |
| B Organization Identified but Dataset Unclear | `PARTIALLY_VERIFIED` |
| C Public Access, Rights Unclear | `LICENSING_REVIEW_REQUIRED` |
| D API or GIS Service Documented | `ACCESS_METHOD_VERIFIED` |
| E Authentication or Account Required | `COMMERCIAL_REVIEW_REQUIRED` |
| F Attribution Requirement | `ATTRIBUTION_REQUIREMENT_IDENTIFIED` |
| G Conflicting Official Evidence | `CONFLICTING_EVIDENCE` |
| H Current Verification Missing | `VERIFICATION_REQUIRED` |
| I Supplemental Source | `SUPPLEMENTAL_SOURCE_ONLY` |
| J Duplicative Source | `FALLBACK_SOURCE_CANDIDATE` |
| K Pilot Review Candidate | `RECOMMENDED_FOR_CONTROLLED_PROVIDER_PILOT_AUTHORIZATION_REVIEW` |
| L Legal Boundary | `LEGAL_REVIEW_REQUIRED` |
| M Technical Unknown | `TECHNICAL_REVIEW_REQUIRED` |
| N No Acquisition Proof | `ZERO_PROVIDER_DATA_ACQUISITION` |

## Invariant Certification

All 50 required CPDD invariants pass, plus activation-state verification. Findings have stable IDs, material findings cite official sources, URLs and access dates are present, provider/dataset/publisher/authority identities remain distinct, current claims carry access dates, unknowns and conflicting evidence are preserved, public access does not set rights, terms are not accepted, legal/licensing questions are not silently resolved, fingerprints are deterministic, production reads and writes are zero, provider data acquisitions are zero, and Sprint 7 remains unauthorized.

## Certification Output

- Classification: `GIS_1_0_SPRINT_6_CONTROLLED_PROVIDER_DUE_DILIGENCE_CERTIFIED`
- Providers reviewed: Colorado Geological Survey, U.S. Geological Survey, FEMA flood mapping, authoritative Colorado air-quality sources
- Source references: `11`
- Deterministic fingerprint: `8f436ae895b274528a67859b618e372fc55102a08ae3c28192202fee35650d8a`
- Provider contacts: `0`
- Forms submitted: `0`
- Accounts created: `0`
- Registrations: `0`
- Credentials requested: `0`
- Credentials used: `0`
- Terms accepted: `0`
- Contracts accepted: `0`
- Purchases: `0`
- Restricted downloads: `0`
- Provider data acquisitions: `0`
- Production reads: `0`
- Production writes: `0`
- Live adapters: `0`
- Runtime activations: `0`
- Downstream integrations: `0`
- Customer-visible changes: `0`
- Geographic relationships: `0`

## Governance State

- GIS Sprint 1: `CERTIFIED_AND_CLOSED`
- GIS Sprint 2: `CERTIFIED_AND_CLOSED`
- GIS Sprint 3: `CERTIFIED_AND_CLOSED`
- GIS Sprint 4: `CERTIFIED_AND_CLOSED`
- GIS Sprint 5: `CERTIFIED_AND_CLOSED`
- GIS Sprint 6: `GIS_1_0_SPRINT_6_CONTROLLED_PROVIDER_DUE_DILIGENCE_CERTIFIED`
- GIS Sprint 7: `NOT_AUTHORIZED`

Retained prohibitions: provider use, provider approval, provider contact, accounts, credentials, terms acceptance, contracts, purchasing, operational acquisition, live adapters, persistence, retrieval, enterprise consumption, runtime, downstream integration, customer visibility, Colorado runtime consumption, geographic relationships, hierarchy inference, GOF Wave 5, and Sprint 7 remain `NOT_AUTHORIZED`.

## Validation Commands

- `npm run worker:build`
- `npm run check:geographic-intelligence-provider-due-diligence-safety`
- `npm run certify:geographic-intelligence-provider-due-diligence`
- `npm run check:geographic-intelligence-provider-evaluation-safety`
- `npm run certify:geographic-intelligence-provider-evaluation-governance`
- `npm run check:geographic-intelligence-fixture-provider-adapter-safety`
- `npm run certify:geographic-intelligence-fixture-provider-adapter`
- `npm run check:geographic-intelligence-provider-inventory-safety`
- `npm run certify:geographic-intelligence-provider-inventory-governance`
- `npm run check:geographic-intelligence-evidence-provenance-safety`
- `npm run certify:geographic-intelligence-evidence-provenance-foundation`
- `npm run check:geographic-intelligence-architecture-safety`
- `npm run certify:geographic-intelligence-architecture-foundation`
- `npm run check:geographic-intelligence-object-safety`
- `npm run check:eip-sprint-7-production-internal-geographic-read-adapter`
- `npm run check:ekcp-sprint-1-enterprise-geographic-consumer-adapter`
- `npm run check:ekcp-sprint-2r-colorado-enterprise-geographic-consumption-readiness`
- `npm run typecheck`
- `npm run lint`
- `npx prisma validate`
- `npm run build`
- `git diff --check`
- `git diff --cached --check`

## Next Decision Gate

Recommended next governed phase based on findings: GIS 1.0 Sprint 7 Controlled Provider Pilot Authorization and Design. This recommendation does not authorize Sprint 7 and does not authorize any provider pilot.
