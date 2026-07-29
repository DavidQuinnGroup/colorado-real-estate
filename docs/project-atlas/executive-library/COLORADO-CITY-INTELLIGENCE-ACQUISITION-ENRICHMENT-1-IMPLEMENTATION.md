# Colorado City Intelligence Acquisition & Enrichment System(tm) 1.0 Implementation

Status: `COLORADO_CITY_INTELLIGENCE_ACQUISITION_ENRICHMENT_1_COMPLETE`

Date: July 29, 2026

## Executive Summary

Colorado City Intelligence Acquisition & Enrichment System(tm) 1.0 establishes the governed architecture for a statewide City Intelligence Factory that can enrich future Colorado Decision Guides through evidence, provenance, completeness gates, and editorial certification instead of route-by-route manual city implementation.

The implementation is additive and contract-based. It does not activate external providers, customer-facing AI, public GIS, telemetry, personalization, customer accounts, durable persistence, schema changes, Prisma changes, scraping, deployment, or push.

## Current-State Assessment

Decision Guide Platform(tm) 1.0 and Colorado Decision Guide Generation System(tm) 1.0 made guide publication reusable, but the current public generator only has bounded foundation language unless a city has editorially reviewed override content.

The scaling gap is city-specific evidence. Statewide publication should not proceed by inventing generic city narratives. A city must earn maturity through domain completeness, source rights, provenance, imagery review, fair-housing review, and human editorial approval.

## Statewide Intelligence Architecture

The implemented factory follows this governed pipeline:

Source Discovery -> Acquisition -> Evidence Versioning -> Provenance -> Geographic Normalization -> City Intelligence -> Quality Certification -> Decision Guide Publication

| Layer | Implementation | Status |
| --- | --- | --- |
| Source Discovery | `CITY_INTELLIGENCE_SOURCE_DOMAIN_MATRIX` | Implemented as governed source-category registry |
| Acquisition | `CITY_INTELLIGENCE_ACQUISITION_ADAPTERS` and `runCityIntelligenceAcquisition` | Dry-run implemented; execute blocked |
| Evidence Versioning | `CityEvidenceReference` | Contract implemented |
| Provenance | Evidence references include source, acquisition, evidence version, observation date, subject, domain, confidence, freshness, permitted use, public eligibility, supersession, and conflict status | Implemented |
| Geographic Normalization | `CityGeographicKnowledge` | Contract implemented without public GIS activation |
| City Intelligence | `CityIntelligenceRecord` | Representative fixture baseline implemented |
| Quality Certification | `isEvidenceComplete`, `isEditorialCertificationEligible`, and validation harness | Implemented |
| Decision Guide Publication | Compatibility validated against the Colorado Decision Guide Registry | Implemented as gated compatibility only |

## Source-Domain Matrix

| Source Category | Primary Domains | Readiness | Priority |
| --- | --- | --- | --- |
| MLS/listing data | Housing patterns, market interpretation, verification questions | Ready fixture | Critical |
| County assessor | Housing patterns, neighborhood relationships, verification questions | Requires license review | High |
| County treasurer/tax | Verification questions | Requires license review | Medium |
| Recorder/deed | Verification questions | Requires credential | Medium |
| Building permits | Housing patterns, verification questions | Requires license review | High |
| Zoning/land use | Practical context, verification questions | Contract defined | High |
| Municipal planning | Practical context, balanced trade-offs, verification questions | Contract defined | High |
| Subdivision/parcel relationships | Neighborhood relationships, verification questions | Requires license review | Medium |
| Transportation/transit | Practical context, balanced trade-offs | Contract defined | Medium |
| Census/economic | Practical context | Contract defined | Low |
| Environmental/hazard | Verification questions | Requires license review | Deferred |
| Public amenities | Practical context, balanced trade-offs | Contract defined | Medium |
| School district boundaries | Verification questions only | Contract defined | Low |
| Local government information | Practical context, verification questions | Contract defined | Medium |
| Licensed editorial imagery | Local imagery | Requires license review | Critical |
| DQG-owned knowledge | Housing patterns, balanced trade-offs, verification questions, imagery | Contract defined | High |
| Approved secondary public research | Practical context, verification questions | Contract defined | Low |

All source categories document geographic coverage, authority, access method, licensing/permitted use, update frequency, reliability, public-display eligibility, storage eligibility, attribution requirement, known limitations, adapter readiness, and priority in code.

## Geographic Knowledge Model

The implemented model supports:

Colorado -> County -> Municipality / Census Place -> City -> Neighborhood -> Subdivision / District -> Parcel / Property

The contract preserves aliases, overlapping boundaries, source disagreements, temporal change support, and parcel/property relationship status. Public GIS remains explicitly inactive.

## City Intelligence Contract

`CityIntelligenceRecord` contains:

- canonical identity
- geographic relationships
- housing-pattern evidence
- neighborhood relationships
- practical-context evidence
- balanced trade-offs
- approved imagery
- market interpretation
- verification questions
- source and evidence references
- freshness
- confidence
- unresolved conflicts
- editorial status
- public eligibility
- completeness by domain

## Completeness and Maturity Model

The factory supports:

| Maturity | Meaning | Publication Gate |
| --- | --- | --- |
| `FOUNDATION` | Base city context exists, but evidence domains are incomplete | Fails closed for enrichment publication |
| `EVIDENCE_IN_PROGRESS` | Some evidence domains exist, but source or conflict gaps remain | Fails closed |
| `EVIDENCE_COMPLETE` | All seven required domains are complete | Eligible for editorial review, not automatically public |
| `EDITORIALLY_CERTIFIED` | Evidence complete plus rights, fair-housing, imagery, language, usefulness, freshness, and human approval | Public eligible when no blockers exist |
| `CONTINUOUSLY_MAINTAINED` | Certified plus repeatable freshness and maintenance operations | Future state |

A city cannot be evidence complete unless all seven required domains are complete. A city cannot be editorially certified without evidence completeness, permitted-use review, fair-housing review, imagery-rights review, balanced-language review, customer-usefulness review, freshness acceptance, and human editorial approval.

## Acquisition Framework

The implemented acquisition adapter contract supports:

- adapter identity
- source identity
- dry-run
- execute-mode boundary
- idempotency key pattern
- evidence deduplication
- versioning
- conflict preservation
- source failure isolation
- retry boundary
- no customer-visible partial claims
- controlled batch processing
- city/domain progress reporting

Execute mode is intentionally blocked until future authorization resolves provider credentials, source rights, storage, schema, and operational controls.

## Evidence and Provenance Model

Every assertion-ready evidence reference must trace to:

- source identity
- acquisition record
- evidence version
- observation date
- effective date where available
- geographic subject
- intelligence domain
- confidence
- freshness
- permitted use
- public-display eligibility
- supersession status
- conflict status

Unsupported synthesized claims are not stored as authoritative facts. Evidence remains internal until permitted use and public-display eligibility are approved.

## Synthesis Rules

`synthesizeCityGuideIntelligence` produces guide-ready intelligence only when completeness, conflicts, imagery, and blocked-reason gates pass.

When evidence is insufficient, synthesis returns:

- `publishable: false`
- missing domains
- evidence IDs used for internal review
- fail-closed reason

Synthesis distinguishes facts from interpretation, preserves uncertainty, avoids unsupported generalization, and does not use customer-facing generative AI.

## Imagery Governance

The imagery contract tracks:

- image identity
- city/location relationship
- role
- owner/provider
- license or permitted use
- attribution
- freshness
- editorial approval
- public eligibility
- fallback asset

No image is public eligible without confirmed public-display rights and editorial approval. Unknown rights fail closed to fallback behavior.

## Statewide Coverage Dashboard

`buildStatewideCityIntelligenceCoverageReport` provides a read-only coverage report with:

- total registered cities
- cities by maturity
- completeness by intelligence domain
- missing-source categories
- stale evidence
- unresolved conflicts
- missing imagery
- editorial-review queue
- publicly eligible guides
- blocked guides and reasons

The report is currently code-level and read-only. It does not activate a customer-facing or internal UI surface.

## Representative City Baseline

| City | Role | Result |
| --- | --- | --- |
| Boulder | Editorially certified reference | Evidence complete and publication compatible |
| Louisville | Second certified reference | Evidence complete and publication compatible |
| Broomfield | Current foundation city | Fails closed for enrichment publication until domains and imagery are complete |
| Superior | Incomplete source coverage | Fails closed and preserves unresolved boundary/source conflict |
| Niwot | Ineligible representative | Fails closed due missing search-city support and incomplete domains |

## Fair Housing and Trust Review

The factory blocks protected-class suitability, demographic targeting, school scoring, safety scoring, crime scoring, place-superlative claims, lifestyle stereotypes, appreciation predictions, investment recommendations, urgency claims, unsupported local claims, unlicensed imagery, customer-facing AI, public GIS, telemetry, personalization, provider activation, and schema mutation.

Neutral census or boundary information remains internal unless separately reviewed for lawful, necessary, governed, non-steering use.

## Licensing, Cost, and Credential Dependencies

Unresolved dependencies:

- county assessor licensing and access
- recorder/deed access and potential fees
- permit portal coverage and permitted use
- municipal planning/source citation rules
- subdivision and parcel relationship storage model
- transportation and amenity source terms
- hazard/environmental customer-display restrictions
- school boundary neutral-use review
- licensed imagery acquisition costs and attribution
- future durable persistence schema authorization
- future provider credentials, if any

## Validation Evidence

Primary validation:

- `npm run check:colorado-city-intelligence-acquisition-enrichment`

The final implementation response records the complete validation set.

## Remaining Blockers

- Durable persistence requires future schema authorization.
- External acquisition requires source/provider rights review.
- Public GIS remains unauthorized.
- Public city imagery requires confirmed rights and editorial approval.
- Statewide rollout should proceed by source category and domain completeness, not by publishing thin city narratives.

## Recommended Next Wave

Recommended next wave: City Intelligence Evidence Expansion 1.0.

Scope should remain non-public and focus on one or two high-value source categories, likely county assessor/building-permit discovery and imagery-rights governance, using dry-run adapters and legal/permitted-use review before any durable storage or public guide publication.
