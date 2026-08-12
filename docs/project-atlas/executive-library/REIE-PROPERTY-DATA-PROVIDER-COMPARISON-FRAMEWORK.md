# REIE Property Data Provider Comparison Framework

Program: `REIE_LIGHTBOX_COLORADO_PROPERTY_PUBLIC_RECORD_TRIAL_EVALUATION_PROTOCOL`

Date: 2026-08-12

Status: `PROVIDER_COMPARISON_FRAMEWORK_COMPLETE_PLANNING_ONLY`

LightBox is evaluated from Executive HQ correspondence and future provider documentation/trial evidence. ATTOM remains `PENDING_PROVIDER_RESPONSE`. No ATTOM capability, term, or pricing value is inferred.

## Comparison Principles

- Compare providers by evidence, not reputation.
- Separate source authority from commercial aggregation.
- Preserve county-direct sources as distinct from commercial providers.
- Score technical access separately from permitted use.
- Treat customer-facing rights, derived-use rights, storage, caching, indexing, and retention as independent gates.
- Preserve provider flexibility; do not create single-provider lock-in without explicit Executive HQ decision.

## Provider Comparison Matrix

| Category | LightBox evaluation question | ATTOM status | County-direct reference |
| --- | --- | --- | --- |
| Parcel coverage | Does LightBox provide reliable APN/parcel identity and geometry across Colorado counties? | PENDING_PROVIDER_RESPONSE | County assessor/GIS sources may be originating authority but are fragmented. |
| Property facts | Does it add public-record attributes beyond MLS/listing facts? | PENDING_PROVIDER_RESPONSE | County assessor records are authoritative where rights and technical access are clear. |
| Zoning | Does it provide parcel-linked zoning code, district, description, geography, and freshness? | PENDING_PROVIDER_RESPONSE | Municipal/county planning sources may remain final authority. |
| Assessor/public-record depth | Are assessor, tax, sale, building, land, and ownership-related fields available and permitted? | PENDING_PROVIDER_RESPONSE | County assessor/treasurer/recorder sources vary by jurisdiction. |
| Geographic coverage | Is coverage statewide enough for PROJECT ATLAS Colorado objectives? | PENDING_PROVIDER_RESPONSE | County-direct coverage must be assessed county by county. |
| Colorado coverage | Does coverage remain useful in Boulder, Denver, Broomfield, Jefferson, Adams, Weld, Larimer, Douglas, El Paso, and selected rural/mountain counties? | PENDING_PROVIDER_RESPONSE | Direct sources are strongest locally but operationally uneven. |
| Freshness | Are update, effective, publication, or refresh indicators available by field/domain? | PENDING_PROVIDER_RESPONSE | County-direct freshness depends on each source. |
| Provenance | Does the provider expose source lineage, first-party status, quality, confidence, or authority signals? | PENDING_PROVIDER_RESPONSE | Direct sources often expose official identity but may lack normalized API metadata. |
| First-party ownership of data | Which fields are first-party LightBox data assets vs aggregated or licensed from others? | PENDING_PROVIDER_RESPONSE | County records are originating authority where directly sourced. |
| Permitted use | Are internal, customer-facing, derived, cached, stored, indexed, reported, and retained uses allowed? | PENDING_PROVIDER_RESPONSE | County terms vary and may require confirmation. |
| Derived-use rights | Can REIE summaries, comparisons, prompts, and AI-assisted derived outputs use provider data? | PENDING_PROVIDER_RESPONSE | County-direct derived-use posture must be reviewed source by source. |
| Customer-facing rights | Can field values, labels, source attributions, and freshness appear on property pages or reports? | PENDING_PROVIDER_RESPONSE | Direct public display may still be restricted by source terms. |
| API ergonomics | Are endpoints, auth, rate limits, pagination, errors, and documentation straightforward? | PENDING_PROVIDER_RESPONSE | County-direct APIs/portals vary widely. |
| Match/join quality | Does address/APN/coordinate/provider-ID matching produce low ambiguity? | PENDING_PROVIDER_RESPONSE | County-direct matching may be precise but fragmented. |
| Schema consistency | Are fields and types consistent across counties and property types? | PENDING_PROVIDER_RESPONSE | County-direct schemas are usually inconsistent. |
| Support | Does Customer Success materially help onboarding, joins, schema questions, interpretation, and best practices? | PENDING_PROVIDER_RESPONSE | County-direct support varies. |
| Pricing | Does pricing fit dataset, delivery method, volume, and customer-facing rights? | PENDING_PROVIDER_RESPONSE | County-direct sources may be free or low cost but operationally expensive. |
| Rate limits | Are call limits compatible with REIE usage and evaluation cadence? | PENDING_PROVIDER_RESPONSE | County-direct limits vary. |
| Bulk delivery | Is bulk or batch delivery available for authorized production use? | PENDING_PROVIDER_RESPONSE | County-direct bulk downloads vary by county. |
| Operational reliability | Does the provider reduce operational burden without excessive dependency risk? | PENDING_PROVIDER_RESPONSE | County-direct reliability is fragmented but authority is high. |

## Disposition Framework

| Provider disposition | Required evidence |
| --- | --- |
| `PRIMARY_SOURCE_CANDIDATE` | Strong source authority or rights-backed first-party coverage, high completeness, strong provenance, stable joins, acceptable customer/derived rights, and manageable cost. |
| `NORMALIZATION_LAYER_CANDIDATE` | Strong cross-county consistency and join quality even if county-direct remains final authority. |
| `GAP_FILLING_PROVIDER_CANDIDATE` | Useful where county-direct access is blocked, fragmented, or operationally expensive. |
| `FALLBACK_OR_VERIFICATION_SOURCE_CANDIDATE` | Good for conflict detection, source discovery, or second-source verification but not primary reliance. |
| `INTERNAL_ONLY_RESEARCH_SOURCE` | Useful for agent/research workflow only; customer display, derived use, or retention not authorized. |
| `RIGHTS_OR_COST_BLOCKED` | Technical value exists but terms, permitted use, retention, attribution, price, or deletion obligations block use. |
| `QUALITY_OR_COVERAGE_BLOCKED` | Field availability, match quality, freshness, or coverage is insufficient. |
| `INSUFFICIENT_EVIDENCE` | Provider response, documentation, or trial evidence is incomplete. |

## REIE Decision Gates

1. `RIGHTS_GATE`: permitted use for internal, derived, customer display, caching, storage, indexing, retention, reports, and termination.
2. `SOURCE_AUTHORITY_GATE`: first-party vs aggregated posture, originating source identity, authority level, and attribution.
3. `TECHNICAL_GATE`: endpoint docs, join quality, schema stability, rate limits, pagination, errors, and support.
4. `DATA_QUALITY_GATE`: completeness, freshness, conflict rate, ambiguity, cross-county consistency, and recoverability.
5. `CUSTOMER_TRUST_GATE`: source labels, limitations, freshness, conflict preservation, no false certainty, fair-housing safety.
6. `OPERATIONS_GATE`: cost, metering, monitoring, support, deletion, audit, vendor continuity, and rollback.
7. `ARCHITECTURE_GATE`: fit with Source Registry, Evidence Provenance, Geographic Intelligence, Property, Search, and decision-preparation contracts without schema/API/runtime changes unless separately authorized.

## Required Evidence Packet For Any Future Production Recommendation

- Provider documentation reviewed and cited.
- Trial call log with no secret values.
- Call-budget reconciliation.
- County/sample coverage matrix.
- Field mapping and provider-doc references.
- Joinability results.
- Data-quality scorecard.
- Rights and permitted-use answer set.
- Retention/deletion and trial-data disposition.
- Cost/rate-limit/commercial posture.
- Comparison against ATTOM once ATTOM evidence exists.
- Recommendation with one of the disposition classifications above.

## Current Recommendation

Do not activate the LightBox trial until the pre-activation checklist in the protocol is complete. Do not evaluate ATTOM until provider correspondence or documentation exists. Preserve county-direct strategy as a parallel authority path and use the LightBox trial to test whether a commercial provider can reduce public-record and parcel due-diligence labor without weakening provenance, rights, or customer trust.
