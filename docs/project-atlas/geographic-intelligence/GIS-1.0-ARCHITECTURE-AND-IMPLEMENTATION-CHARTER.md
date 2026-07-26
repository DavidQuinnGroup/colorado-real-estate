# PROJECT ATLAS(tm)

## Geographic Intelligence System(tm) 1.0

### Architecture and Implementation Charter

Status: `AUTHORIZED_FOR_ARCHITECTURE_AND_IMPLEMENTATION_PLANNING`

Sprint: `GIS_1_0_SPRINT_1`

Sprint classification: `GEOGRAPHIC_INTELLIGENCE_ARCHITECTURE_FOUNDATION`

Date: July 26, 2026

---

## 1. Executive Purpose

GIS 1.0 establishes the governed enterprise layer for geographic facts, evidence, observations, indicators, and derived intelligence. It is not a map feature and does not activate runtime geographic consumption.

## 2. Business Value

The architecture creates a reusable foundation for future community, education, transportation, environmental, economic, infrastructure, market, and lifestyle intelligence without tying enterprise semantics to one provider, runtime surface, or customer experience.

## 3. Relationship to REIE

The Real Estate Intelligence Engine may eventually compose GIS intelligence into search, maps, reports, internal decision support, and customer experiences. This charter does not authorize those integrations.

## 4. Relationship to the Geographic Constitution

GIS 1.0 preserves the existing geographic governance ladder: object-type capability, schema capability, governed object instance, production persistence, production retrieval, enterprise consumption, runtime activation, relationship approval, relationship persistence, hierarchy consumption, downstream integration, and customer visibility. No completed stage authorizes the next stage.

## 5. Relationship to GOF and EKCP

GOF remains the certified object and retrieval foundation. EKCP remains the certified enterprise-consumption readiness layer. GIS Sprint 1 does not modify certified GOF Wave 4, EKCP Sprint 1, EKCP Sprint 2R, or Sprint 7 behavior.

## 6. Scope

Authorized scope is additive architecture, provider-neutral contracts, internal-only deterministic fixtures, non-production validation, documentation, and implementation sequencing.

## 7. Exclusions

Excluded: migrations, production writes, provider acquisition, credentials, external APIs, scraping, browser automation, runtime activation, public routes, public pages, Search, Maps, Property Intelligence, AI, Executive Intelligence, Seller Intelligence, Market Intelligence runtime integration, geographic relationships, hierarchy traversal, Colorado runtime consumption, and GOF Wave 5.

## 8. Permanent Principles

- `GIS-P001 Intelligence Independence`: each domain is separately identified, governed, tested, and activatable.
- `GIS-P002 Provider Neutrality`: providers are evidence sources, not ontology owners.
- `GIS-P003 Evidence First`: assertions require evidence identity, authority, time, freshness, confidence, and lineage.
- `GIS-P004 Customer Separation`: internal availability does not imply customer availability.
- `GIS-P005 Intelligence Composition`: future experiences compose independent domains.
- `GIS-P006 Subject Integrity`: every record binds to an exact governed subject or selection contract.
- `GIS-P007 Temporal Integrity`: observed, effective, historical, estimated, and forecast states remain separate.
- `GIS-P008 Licensing and Use Rights`: accessible data is not automatically authorized data.
- `GIS-P009 Explainability`: derived intelligence must retain method, inputs, assumptions, confidence, and lineage.
- `GIS-P010 Fail-Closed Activation`: unknown authorization, licensing, provenance, freshness, subject identity, domain state, or lineage blocks activation.

## 9. Intelligence Domain Model

Initial domains are `COMMUNITY_INTELLIGENCE`, `EDUCATION_INTELLIGENCE`, `TRANSPORTATION_INTELLIGENCE`, `ENVIRONMENTAL_INTELLIGENCE`, `ECONOMIC_INTELLIGENCE`, `INFRASTRUCTURE_INTELLIGENCE`, `MARKET_INTELLIGENCE`, and `LIFESTYLE_INTELLIGENCE`. Each starts at lifecycle `PROPOSED`, governance state `FOUNDATION_DEFINED`, and every activation layer `NOT_AUTHORIZED`.

## 10. Subject Model

The subject model represents an exact synthetic fixture subject or contract-only governed subject reference. It does not enumerate production objects, activate Colorado or Thornton runtime consumption, or infer Thornton within Colorado.

## 11. Evidence Architecture

Evidence records include evidence identity, source identity, provider identity, source type, authority, source locator permission, licensing classification, permitted use, acquisition method, retrieved time, published time, effective time, expiration, freshness, jurisdiction, version, fingerprint, and internal-only status.

## 12. Observation Architecture

Observations bind subject, domain, metric or assertion identity, value, unit, observation time, effective interval, evidence identities, confidence, freshness, quality, transformation lineage, and internal-only status.

## 13. Derived-Intelligence Architecture

Derived intelligence requires transformation identity, version, input evidence identities, input observation identities, output identity, method classification, assumptions, confidence, reproducibility, content fingerprint, and explainability summary.

## 14. Temporal Integrity

Observation kind distinguishes `OBSERVED_FACT`, `REPORTED_FACT`, `CALCULATED_FACT`, `ESTIMATED_FACT`, `FORECAST`, and `QUALITATIVE_ASSESSMENT`. Forecasts cannot be represented as current authoritative facts.

## 15. Confidence Model

Confidence values are `UNKNOWN`, `LOW`, `MODERATE`, `HIGH`, and `AUTHORITATIVE`. Confidence never implies truth, approval, recency, licensing permission, runtime activation, or customer visibility.

## 16. Freshness Model

Freshness values are `UNKNOWN`, `CURRENT`, `AGING`, `STALE`, and `EXPIRED`. Freshness remains separate from authority and confidence.

## 17. Quality State

Quality values include `UNKNOWN`, `UNVERIFIED`, `REVIEW_REQUIRED`, `GOVERNED_FIXTURE`, `APPROVED_INTERNAL`, and `REJECTED`.

## 18. Licensing and Permitted Use

Licensing and permitted-use classifications distinguish `UNKNOWN`, `INTERNAL_RESEARCH_ONLY`, `INTERNAL_OPERATIONAL_USE`, `DERIVED_USE_ONLY`, `CUSTOMER_DISPLAY_ALLOWED`, `REDISTRIBUTION_ALLOWED`, and `PROHIBITED`. Unknown rights fail closed.

## 19. Provider-Neutral Adapter Architecture

The provider boundary separates enterprise semantics, provider-specific acquisition, provider normalization, evidence retention, intelligence derivation, persistence, retrieval, runtime consumption, and customer presentation. Sprint 1 adapters are planning contracts only and cannot call services, read credentials, read environment variables, scrape, write production data, register runtime behavior, or present to customers.

## 20. Activation Ladder

Activation is independently represented for acquisition, persistence, retrieval, enterprise consumption, runtime, downstream integration, and customer visibility. Every Sprint 1 fixture defaults all fields to false.

## 21. Persistence Boundary

Persistence design may be discussed, but production persistence is not authorized. No Prisma schema, migrations, SQL, seeds, backfills, or production write paths are introduced.

## 22. Retrieval Boundary

Retrieval design may be discussed, but production retrieval for GIS intelligence is not authorized. Existing GOF retrieval certifications remain unchanged.

## 23. Enterprise-Consumption Boundary

Consumption readiness remains separate from runtime enablement. Colorado enterprise-consumption readiness does not authorize Colorado runtime consumption.

## 24. Runtime Boundary

No runtime registry, dispatcher, feature flag, route, page, worker, Search, Maps, Property Intelligence, AI, or Executive Intelligence integration is authorized.

## 25. Downstream-Integration Boundary

Downstream systems may only be represented as future decision gates. Sprint 1 performs no downstream integration.

## 26. Customer-Visibility Boundary

Internal intelligence availability does not authorize customer display. Customer visibility remains false and `NOT_AUTHORIZED`.

## 27. Explainability and Lineage

Derived intelligence preserves evidence inputs, observation inputs, transformation identity, version, assumptions, confidence, reproducibility, fingerprint, and explanation summary.

## 28. Security and Privacy Boundaries

Sprint 1 contains no credentials, environment-variable reads, provider calls, browser automation, scraping, production queries, production writes, or customer data mutation.

## 29. Auditability

Contracts, fixtures, scripts, and documentation form an audit trail for Sprint 1. Certification output is deterministic.

## 30. Fail-Closed Rules

Unknown licensing, unknown permitted use, missing identity, missing evidence, missing subject, missing lineage, non-internal fixture state, relationship presence, runtime activation, or customer visibility fails certification.

## 31. Implementation Sequencing

Sprint 1 creates the foundation only. Future sprints require separate authorization for evidence/provenance, provider inventory governance, fixture adapters, persistence design, internal retrieval design, enterprise consumer design, runtime activation, downstream integration, and customer visibility.

## 32. Testing and Certification

Validation uses `check:geographic-intelligence-architecture-safety` and `certify:geographic-intelligence-architecture-foundation`, plus applicable existing enterprise, geographic, GOF, EKCP, typecheck, lint, build, and diff checks.

## 33. Stop Conditions

Stop if implementation requires shared certified contract changes, Prisma schema changes, migrations, production access, provider credentials, live provider access, runtime registration, customer behavior changes, relationships, Colorado runtime consumption, certified GOF/EKCP/Sprint 7 behavior changes, validation failures caused by this work, assumed licensing, or scope expansion.

## 34. Retained Prohibitions

No production deployment, migration, production write, provider acquisition, runtime activation, downstream integration, customer visibility, geographic relationship authorization, Colorado runtime consumption, or GOF Wave 5 authorization.

## 35. Future Decision Gates

Provider selection, licensing validation, live acquisition, schema changes, migrations, production persistence, production retrieval, runtime use, downstream integration, and customer presentation each require separate governed approval.
