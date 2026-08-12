# REIE LightBox Colorado Trial Evaluation Protocol

Program: `REIE_LIGHTBOX_COLORADO_PROPERTY_PUBLIC_RECORD_TRIAL_EVALUATION_PROTOCOL`

Date: 2026-08-12

Repository: `/Users/davidquinn/david-quinn-group/colorado-real-estate`

Canonical baseline after Workstream 1 sync: `HEAD = origin/main = ad790bc25406adc4d4e2edcc5dc46fcf2357fb70`, divergence `0 ahead / 0 behind`, working tree clean.

## Status

`LIGHTBOX_COLORADO_TRIAL_EVALUATION_PROTOCOL_COMPLETE_LOCAL_DOCS_ONLY`

This is a planning and feasibility protocol only. It does not activate a LightBox trial, create a Developer Portal account, handle API keys, call LightBox APIs, add provider integration code, create environment variables, write databases, index Typesense, mutate MLS/source/provider systems, deploy, or authorize customer-facing use. Trial data must be treated as `EVALUATION_ONLY` until provider terms and Executive HQ authorization say otherwise.

## Provider Correspondence Posture

Executive HQ reported direct LightBox correspondence stating that LightBox offers first-party data assets including parcel and zoning data, licensing flexibility based on intended use case, technical Customer Success support after implementation, pricing and packaging flexibility, self-service Developer Portal trial access, and a three-week trial with up to 2,000 API calls across available endpoints.

This protocol treats that as `COMMERCIAL_WILLINGNESS_TO_DISCUSS_RIGHTS`, not as production rights granted. ATTOM remains `PENDING_PROVIDER_RESPONSE` and must be evaluated separately.

## Governing Question

Use the finite three-week / 2,000-call LightBox trial to determine whether LightBox materially improves Colorado property and public-record intelligence while preserving source rights, customer trust, evidence provenance, fair-housing boundaries, operational safety, and future provider flexibility. The trial should maximize information gain per API call rather than prove generic connectivity.

## REIE Capability / Gap Reconciliation

| Area | Existing REIE capability | LightBox candidate gap coverage | Duplication rule |
| --- | --- | --- | --- |
| Property model | `Property` stores MLS-derived listing facts: address, city, state, ZIP, price, beds, baths, sqft, lot size, year built, type, status, lat/lng, neighborhood, subdivision, school district, photos, price history, open houses, and timestamps. | Candidate support for parcel identity, assessor/public-record facts, tax-related attributes, ownership-related fields only if legally and contractually permitted, and non-MLS property characteristics. | Do not duplicate listing facts unless LightBox proves independent public-record verification value or conflict detection value. |
| Search | Typesense-backed Search and map discovery are production-certified for listing discovery, filters, sorting, public visibility, and coordinates. | Candidate enrichment only if parcel, zoning, or public-record attributes become authorized search/filter context later. | Do not use trial data for production Search, Typesense indexing, ranking, scoring, or public claims. |
| Property intelligence | Property pages organize existing facts, source limitations, verification prompts, property decision support, comparison, and professional handoff. | Candidate evidence to reduce manual assessor, parcel, zoning, tax/public-record, and property-attribute verification work. | Keep professional review prompts; do not turn provider facts into valuation, suitability, legal-use, condition, title, tax, or appraisal conclusions. |
| Public-record architecture | `propertyPublicRecordEvidence.ts` routes assessor, tax, and permit domains but fails closed with source confirmation required and missing parcel/account/tax/permit identifiers. | Candidate coverage for address-to-parcel resolution, parcel/APN, property characteristics, assessor-related facts, zoning, and potentially tax/public-record attributes. | Use the trial to test gap coverage only; no persistence or customer display without later authorization. |
| Source registry / rights | Source registry tracks source class, activation state, permitted use, attribution, freshness, limitations, customer disclosure eligibility, and protected boundaries. | Candidate provider record and rights matrix if LightBox terms support internal, derived, cached, indexed, and customer-facing use. | Technical access never equals permitted use. |
| Geographic intelligence | Internal geographic models support objects, sources, observations, relationships, freshness, confidence, conflicts, eligibility, and property-geographic relationships. | Candidate support for parcel polygons, jurisdiction attribution, zoning geography, coordinates, and joins to existing geography contracts. | Do not activate public GIS or customer-facing geography from trial output. |
| Evidence provenance | Existing GIS/evidence contracts define provider identity, source identity, acquisition records, evidence versions, freshness, quality, licensing, permitted use, conflicts, and lineage. | Candidate evidence-source identity and lineage if provider docs expose source authority, update metadata, quality indicators, or source lineage. | Preserve conflicts; do not assume LightBox disagreement means LightBox is wrong. |
| County-direct source work | Boulder County assessor, treasurer, permit, and BCOD candidates are governed, blocked, or confirmation-gated. | Candidate statewide normalization or gap-filling layer across counties where county-direct integration is fragmented. | LightBox must not automatically replace county-direct sources. |
| Comparable inputs | Comparison uses visible property facts and related listing context with boundaries against scoring, ranking, suitability, valuation, and investment advice. | Candidate public-record facts could improve comparable fact reconciliation if rights and quality pass. | Do not build automated CMA, offer-price recommendation, or appraisal substitute. |
| City/neighborhood intelligence | City/neighborhood routes provide production-certified orientation and source-boundary context. | Candidate zoning/jurisdiction/geography evidence could improve verification prompts and future evidence depth. | Do not create protected-class, demographic, ranking, desirability, safety, or steering criteria. |
| Buyer/seller preparation | Buyer, seller, home-worth, offer-readiness, and handoff surfaces organize decisions and questions. | Candidate public-record evidence could reduce repeated manual due-diligence prep. | Keep fiduciary, pricing, negotiation, inspection, legal, lending, tax, and appraisal work human. |

## Evaluation Domains

1. `PARCEL_IDENTITY`: APN or parcel identifiers, parcel geometry if available, address-to-parcel resolution, parcel-to-address resolution, parcel uniqueness, and multi-parcel property handling.
2. `PROPERTY_PUBLIC_RECORD_FACTS`: situs or property address, property characteristics, lot size, building area, year built, property type or use, assessor-related facts, ownership-related fields where permitted, and tax/public-record attributes. Actual field names are `PROVIDER_DOC_REQUIRED`.
3. `ZONING`: zoning code, district, geography, description, effective or freshness posture, and parcel-to-zoning relationship. Actual endpoint and field names are `PROVIDER_DOC_REQUIRED`.
4. `GEOGRAPHIC_SPATIAL_SUPPORT`: coordinates, parcel polygons, jurisdiction attribution, geographic identifiers, and join posture against existing PostGIS/geographic contracts.
5. `SOURCE_PROVENANCE_SUPPORT`: LightBox source identity, first-party vs aggregated posture, freshness/update metadata, quality/confidence indicators if available, attribution requirements, and lineage if available.
6. `CROSS_COUNTY_CONSISTENCY`: field availability, schema consistency, coverage consistency, lookup success, gaps, freshness differences, and normalization burden across Colorado counties.
7. `PROPERTY_DUE_DILIGENCE_VALUE`: reduction in assessor lookup, parcel lookup, zoning lookup, public-record fact verification, attribute reconciliation, geographic verification, source identification, and evidence-conflict handling.

## Colorado Test Geography Design

| Geography | Inclusion reason | Trial question |
| --- | --- | --- |
| Boulder County | Existing REIE source-candidate depth, BCOD blockers, assessor/treasurer/permit context, mixed city/suburban/mountain patterns. | Does LightBox materially reduce the known Boulder public-record and parcel gap without duplicating blocked county-source work? |
| Denver | Consolidated city/county, older urban housing, dense parcels, condos, small lots. | Can one provider normalize city/county property, parcel, and zoning evidence in a consolidated jurisdiction? |
| Broomfield | Consolidated city/county, fast-growth suburb, newer construction. | Does schema/coverage remain stable for compact but jurisdictionally distinct Front Range conditions? |
| Jefferson County | Front Range suburban/mountain edge, mixed municipalities, older and foothills properties. | Does parcel/zoning/geographic attribution handle urban-to-mountain transitions? |
| Adams County | Fast-growth suburbs, agricultural-to-suburban transition, multi-jurisdiction complexity. | Can lookups distinguish jurisdiction, parcel, and public-record facts across changing suburban patterns? |
| Weld County | Large geography, agricultural parcels, fast-growth communities, multi-county municipal complexity. | Does LightBox handle acreage, rural parcels, and multi-jurisdiction relationships consistently? |
| Larimer County | Front Range plus foothills/mountain properties. | Does coverage support both urban and lower-density property conditions? |
| Douglas County | Fast-growth suburbs, newer construction, planned communities, larger lots. | Does the provider improve lot, parcel, zoning, and property-characteristic verification? |
| El Paso County | Large Front Range county with urban, suburban, and rural conditions. | Does statewide coverage remain useful outside the north Denver/Boulder corridor? |
| Mesa County | Western Slope urban/rural mix and different county systems. | Does coverage degrade or require different normalization outside the Front Range? |
| Summit County | Mountain resort/condo/HOA complexity. | Does parcel and zoning evidence remain useful for resort and mountain conditions? |
| La Plata County | Mountain/rural, mixed incorporated and unincorporated patterns. | Does the provider help with rural parcel identity and jurisdiction attribution? |
| Pueblo County | Southern Front Range, older urban and lower-density mix. | Does field completeness remain comparable in a lower-density market? |

No protected-class, demographic, desirability, school-quality, safety, or steering criteria are part of the test geography design.

## Property Sample Framework

Use sample types and selection criteria only at this stage. Do not choose actual addresses until a later execution plan is authorized.

| Sample type | Selection criterion | Why it matters |
| --- | --- | --- |
| Standard detached residential | Recently listed or otherwise verifiable ordinary single-family record. | Establish baseline match, field completeness, and duplicate behavior. |
| Condo | Unitized property in Denver, Boulder, Summit, or similar. | Tests unit matching, parcel/account handling, HOA/public-record nuance. |
| Townhome | Attached residential with lot or common-interest nuance. | Tests property type/use and parcel distinction. |
| New construction | Recent build or active listing with newer subdivision context. | Tests freshness, year-built, and assessor lag. |
| Older property | Pre-1950 or materially older stock. | Tests historical record completeness and discrepancies. |
| Large lot | Suburban or semi-rural lot materially larger than typical. | Tests lot-size reconciliation and geometry value. |
| Small urban lot | Dense urban lot. | Tests address precision and parcel uniqueness. |
| Acreage | Rural or agricultural parcel. | Tests large-parcel geometry and use classification. |
| Multi-parcel | Known or suspected multi-parcel property condition. | Tests one-to-many parcel relationships and ambiguity handling. |
| Recent sale | Sold property if permitted. | Tests public-record vs listing/timing divergence. |
| Active listing | Current listing already in REIE. | Tests joinability to existing `Property` rows. |
| Off-market/public-record-only | Only if trial terms permit. | Tests whether LightBox can support non-MLS property evidence without production use. |
| Known discrepancy | Address, sqft, lot, year-built, or jurisdiction mismatch known from manual review. | Tests conflict preservation and reconciliation value. |
| Boundary-adjacent | Near city/county/jurisdiction boundary. | Tests jurisdiction attribution and false certainty controls. |
| Unusual zoning/use | Mixed use, planned development, agricultural, or unusual legal-use context. | Tests zoning usefulness without making legal-use conclusions. |
| Missing/ambiguous record | Missing APN, ambiguous address, or incomplete public record. | Tests fail-closed behavior and recoverability. |

## Trial Data Governance Boundary

Trial data posture: `EVALUATION_ONLY`.

- No customer-facing production display.
- No provider activation.
- No production database writes.
- No persistent ingestion architecture.
- No Typesense indexing.
- No MLS/source replacement.
- No public REIE claims based on trial results.
- No valuation, appraisal, tax, legal, lending, insurance, title, condition, suitability, safety, or investment conclusions.
- No owner identity display unless provider terms, privacy review, and Executive HQ separately authorize a specific use.

Later limited local/non-production persistence may be useful only as a separately authorized evaluation fixture containing sanitized request metadata, endpoint family, response schema inventory, match classification, field completeness, conflict notes, call count, and no reusable production provider payload unless trial terms allow retention.

## Source Rights / Permitted-Use Questions

Executive HQ should resolve these before production activation or persistent integration:

1. Is internal agent use permitted during trial and production?
2. Is customer-facing display permitted on property pages?
3. Is use in neighborhood/city synthesis permitted?
4. Are derived intelligence outputs permitted, including AI-assisted summaries or nonverbatim derived narratives?
5. Are caching, storage, retention, indexing, search, and batch processing permitted?
6. Can API-result transformations be persisted, and under what field-level restrictions?
7. Are screenshots, reports, PDFs, newsletters, and market reports permitted?
8. What attribution, source labeling, and freshness language are required?
9. Are redistribution, team-member access, contractor/vendor access, or agent-team access permitted?
10. What happens to historical retained data after contract termination?
11. What deletion, audit, metering, rate-limit, and usage-reporting obligations apply?
12. Can trial-derived mapping work, schemas, field observations, or test results be retained after the trial?
13. Can trial data migrate to production, or must production be reacquired after contract execution?
14. Are ownership-related fields available and, if so, what privacy and customer-display restrictions apply?
15. Are parcel geometries and zoning geometries displayable, transformable, and indexable?

## LightBox vs County-Direct Strategy

LightBox should be evaluated as a possible primary source, normalization layer, gap-filling provider, fallback source, verification source, or statewide coverage layer. It should not be presumed to replace county-direct sources. County-direct sources may remain best for originating authority, local legal meaning, official attribution, and final verification. LightBox may be strongest if it normalizes statewide lookup, reduces county-by-county operational burden, supplies consistent parcel/zoning joins, or identifies which county-direct source needs final review.

Potential hybrid posture:

- County-direct source: highest authority for final official record where rights and technical access are clear.
- LightBox: normalized statewide discovery, first-pass parcel/zoning/property fact retrieval, conflict detection, and coverage gap triage.
- REIE: provenance, limitations, customer-safe explanation, fail-closed decisions, and professional-review routing.

## Success / Failure Criteria

| Disposition | Objective evidence required |
| --- | --- |
| `LIGHTBOX_STRONG_PRODUCTION_CANDIDATE` | Strong lookup success, useful parcel/zoning/property fields, stable cross-county schema, clear source/freshness metadata, manageable joins, acceptable rights path, and clear agent-labor leverage. |
| `LIGHTBOX_STRONG_FOR_SELECTED_DATA_DOMAINS` | Strong evidence in one or more domains, such as parcel identity or zoning, but weaker or blocked in others. |
| `LIGHTBOX_USEFUL_AS_SECONDARY_OR_VERIFICATION_SOURCE` | Reliable for conflict detection, confirmation, or gap triage but not appropriate as primary source. |
| `LIGHTBOX_TECHNICALLY_STRONG_BUT_RIGHTS_OR_COST_BLOCKED` | Good technical results but unresolved/negative permitted use, display, retention, derived-use, pricing, or contract terms. |
| `LIGHTBOX_COVERAGE_OR_QUALITY_INSUFFICIENT` | Material gaps, low match rate, unstable schema, poor cross-county consistency, or frequent unresolved conflicts. |
| `LIGHTBOX_INTEGRATION_COMPLEXITY_OUTWEIGHS_VALUE` | Endpoint chaining, normalization, join ambiguity, or operational burden exceeds the labor value. |
| `INSUFFICIENT_EVIDENCE_AFTER_TRIAL` | Trial ended with too few representative tests, unresolved docs, blocked support questions, or inadequate call coverage. |

## Agent-Labor Value Connection

If suitable, LightBox could move these matrix tasks:

- `Assessor research`: `NOT_YET_SUPPORTED -> PARTIALLY_SUPPORTED` if parcel/account lookup and assessor attributes are available with rights.
- `Parcel research`: `NOT_YET_SUPPORTED -> PARTIALLY_SUPPORTED` if parcel identity and geometry are reliable.
- `Zoning research`: `NOT_YET_SUPPORTED -> PARTIALLY_SUPPORTED` if zoning district/geography/description are available and fresh enough.
- `Public-record fact retrieval`: `NOT_YET_SUPPORTED or INTELLIGENCE_ASSISTED -> PARTIALLY_SUPPORTED` if public-record attributes can be retrieved and attributed.
- `Property verification`: `PARTIALLY_SUPPORTED -> AUTOMATED` for narrow fields only if match, source, rights, freshness, and conflict rules pass.
- `Geographic verification`: `INTELLIGENCE_ASSISTED -> PARTIALLY_SUPPORTED` if jurisdiction and parcel/spatial joins are consistent.
- `Evidence reconciliation`: `PARTIALLY_SUPPORTED -> PARTIALLY_SUPPORTED with higher confidence` if conflicts can be detected and preserved.

No precise ROI or hour-savings claim is supported at this stage. Labor leverage is qualitative and tied to the existing Phase 1 matrix.

## Pre-Activation Readiness Checklist

- Trial protocol approved.
- Test sample approved.
- Call budget approved.
- Secure API-key storage method approved.
- Evaluation tooling prepared but not run.
- No-production-use boundary approved.
- Trial and permitted-use terms reviewed.
- Test-data handling and retention plan approved.
- Day 1 test sequence ready.
- Outcome scorecard ready.
- ATTOM comparison framework ready.
- Provider questions prepared for LightBox Customer Success.
- Stop criteria approved for rights, cost, quality, coverage, and complexity blockers.

## Next Authorization Gate

`READY_FOR_REIE_LIGHTBOX_TRIAL_PRE_ACTIVATION_READINESS_REVIEW`
