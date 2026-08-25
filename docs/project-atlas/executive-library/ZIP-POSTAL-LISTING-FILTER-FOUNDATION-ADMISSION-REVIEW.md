# PROJECT ATLAS - ZIP Postal Listing Filter Foundation Admission Review

Status: `ZIP_POSTAL_LISTING_FILTER_FOUNDATION_ADMISSION_REVIEW_CERTIFIED`

Review date: 2026-08-25

## 1. Workstream Identity

This is the ZIP postal listing filter foundation admission review following:

`ADMITTED_FILTER_REGISTRY_AND_PRIORITY_1_PROPERTY_SEGMENTATION_BOUNDED_IMPLEMENTATION_WAVE_7_CERTIFIED`

Canonical Wave 7 commit:

`80c374b8b106e0fd700758e75fbcd225d437d076`

## 2. Executive Objective

Determine whether ZIP can safely become a shared Agent cohort/filter dimension as a listing-level postal attribute, without becoming canonical ATLAS municipality, neighborhood, subdivision, county, MLS area, market area, or polygon geography.

## 3. Governing Certifications / Contracts

- `ATLAS_COHORT_AND_COMPARATIVE_MARKET_INTELLIGENCE_CONTRACT_MVV_CERTIFIED`
- `REUSABLE_AGENT_COHORT_BUILDER_BOUNDED_IMPLEMENTATION_WAVE_1_CERTIFIED`
- `ADMITTED_BASIC_AGGREGATION_BOUNDED_IMPLEMENTATION_WAVE_2_CERTIFIED`
- `CURRENT_SNAPSHOT_COMPARATIVE_INTELLIGENCE_BOUNDED_IMPLEMENTATION_WAVE_3_CERTIFIED`
- `AGENT_DECISION_COMPARISON_REUSE_AND_INTERVAL_SEMANTICS_BOUNDED_IMPLEMENTATION_WAVE_4_CERTIFIED`
- `COHORT_N_MULTI_MARKET_COMPARATIVE_INTELLIGENCE_BOUNDED_IMPLEMENTATION_WAVE_5_CERTIFIED`
- `CURRENT_COMPETING_LISTING_CONTEXT_BOUNDED_IMPLEMENTATION_WAVE_6_CERTIFIED`
- `ADVANCED_PROPERTY_SEGMENTATION_AND_GEOGRAPHY_ADMISSION_REVIEW_CERTIFIED`
- `ADMITTED_FILTER_REGISTRY_AND_PRIORITY_1_PROPERTY_SEGMENTATION_BOUNDED_IMPLEMENTATION_WAVE_7_CERTIFIED`
- `IRES_CITYID_VERSIONED_SOURCE_GEOGRAPHY_CONTRACT_CERTIFIED`

## 4. Starting Repository Truth

- branch: `main`
- HEAD: `80c374b8b106e0fd700758e75fbcd225d437d076`
- origin/main: `80c374b8b106e0fd700758e75fbcd225d437d076`
- divergence: `0 behind / 0 ahead`
- working tree: clean
- `git diff --check`: PASS

## 5. Current Geography Boundary

The current Agent cohort architecture admits the six-city scope only:

Boulder, Louisville, Lafayette, Superior, Erie, and Longmont.

ZIP admission must not activate Denver, Broomfield, Westminster, Niwot, Brighton, or any other municipality. ZIP-only runtime cohorts remain blocked unless the implementation explicitly constrains ZIP-only requests back to the admitted city scope. For Wave 8, the recommended model is city-required ZIP filtering.

## 6. Current Admitted-Filter Registry Baseline

`AGENT_ADMITTED_FILTER_REGISTRY_V1` admits legacy quick filters and Wave 7 Priority 1 property filters. `zip` remains in `AGENT_COHORT_UNADMITTED_FILTER_KEYS` at this review gate and is not activated in runtime query/UI behavior.

## 7. ZIP-Like Field Inventory

| Repository field | Type | Nullability | Role | Admission finding |
| --- | --- | --- | --- | --- |
| `Property.zip` | `String` | required | current listing/property-location postal field | candidate for Agent-only filtering |
| `CanonicalPhysicalProperty.postalCode` | `String?` | nullable | source-independent physical-property/situs future field | not current runtime source |
| Typesense `zip` | string facet/query field | optional in index | public search index field | existing search/index use only |
| Public/property schema `zip` | string | required in input type | property page/schema display | factual display only |

## 8. Canonical Repository ZIP Field

Canonical current listing field for this admission is:

`Property.zip`

The field is listing-shaped, not canonical physical-property identity and not governed geography identity.

## 9. Data Type / Nullability

`Property.zip` is a required Prisma `String`.

The MLS mapper uses `normalizeZip` and falls back to `00000` if source ZIP is absent. Current read-only coverage found zero `00000` rows. Future filtering must treat `00000` as unknown, not as a valid ZIP cohort.

## 10. Source Field / Mapping

The MLS mapper populates `Property.zip` from:

`PostalCode`, `Zip`, or `zip`

The mapping is implemented in `lib/mls/upsertListing.ts` and stores the cleaned string value without numeric parsing.

## 11. Address Role

`Property.zip` is built with `address`, `city`, and `state` inside the current MLS listing property record. Repository evidence supports classification as:

`CURRENT_LISTING_PROPERTY_LOCATION_ADDRESS`

It is not an owner mailing address, tax mailing address, agent office ZIP, or canonical geography object.

## 12. Analytical Grain / Source Scope / Rights

- analytical grain: `MLS_LISTING`
- source scope: `CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION`
- rights posture for this gate: Agent-only filtering and factual Agent display are supportable
- public/client/export/PDF rights: not admitted by this review

## 13. Current Usage

`Property.zip` is already used in public property display, structured-data input, Supabase search projection, Typesense query/facet schema, internal current-market read projection, and property preparation search. It is not yet an Agent cohort filter.

## 14. Read-Only Coverage Evidence

Read-only repository-local coverage was measured at `2026-08-25T20:16:38.270Z` using `Property` rows only. No database mutation, schema mutation, provider call, MLS call, IRES call, sync, Typesense mutation, CRM/email mutation, secret mutation, or deployment occurred.

| Scope | Total | Populated ZIP | Null/blank | Five digit | Distinct base ZIPs |
| --- | ---: | ---: | ---: | ---: | ---: |
| all `Property` rows | 75,490 | 75,490 | 0 | 75,490 | 419 |
| active Residential rows | 12,006 | 12,006 | 0 | 12,006 | 328 |
| six-city rows | 4,454 | 4,454 | 0 | 4,454 | 12 |
| six-city active Residential rows | 873 | 873 | 0 | 873 | 11 |

Additional findings:

- malformed rows: 0
- ZIP+4 rows: 0
- whitespace-padded rows: 0
- `00000` sentinel rows: 0
- current leading-zero rows: 0

## 15. Per-City ZIP Coverage

Active Residential six-city distribution:

| City | ZIP distribution |
| --- | --- |
| Boulder | `80304`: 96; `80302`: 89; `80301`: 74; `80303`: 63; `80305`: 31 |
| Louisville | `80027`: 46 |
| Lafayette | `80026`: 54 |
| Superior | `80027`: 43 |
| Erie | `80516`: 126; `80026`: 3 |
| Longmont | `80504`: 103; `80501`: 74; `80503`: 71 |

This confirms cross-city ZIP behavior: `80027` appears in both Louisville and Superior; `80026` appears in Lafayette and Erie. ZIP must not be modeled as one-to-one city identity.

## 16. Distinct ZIP Distribution

The six-city active Residential distribution has 11 base ZIP values:

`80026`, `80027`, `80301`, `80302`, `80303`, `80304`, `80305`, `80501`, `80503`, `80504`, `80516`

The broader repository has 419 distinct five-digit ZIP values. That breadth is not geography activation authority.

## 17. Format / Normalization Policy

ZIP is string identity, not numeric quantity. Leading zeros must be preserved even though no current Colorado leading-zero values were observed.

Future normalizer:

- accepts strings only;
- trims surrounding whitespace;
- accepts exactly five digits;
- normalizes valid ZIP+4 to the five-digit base ZIP for cohort filtering;
- rejects blank, null, numeric values, four digits, six digits, letters, embedded whitespace, malformed ZIP+4, and `00000`;
- never uses `parseInt`;
- never infers ZIP from city, address, coordinates, or geography objects.

## 18. ZIP+4 / Malformed / Null Policies

ZIP+4 policy: normalize only valid `NNNNN-NNNN` to base `NNNNN` for cohort filtering. Do not silently truncate malformed hyphenated values.

Malformed ZIP policy: fail closed before query construction.

Null/unknown policy: null, blank, and `00000` do not satisfy a specific ZIP predicate and must not be inferred or backfilled.

## 19. Proposed Filter Semantic Contract

`LISTING_POSTAL_CODE_FILTER_V1`:

"Exact postal code associated with the current MLS listing/property-location address as represented in the admitted current repository projection."

This is a postal listing attribute. It is not a municipality, neighborhood, subdivision, county, MLS area, market area, polygon, ZCTA, desirability claim, or comparable-selection methodology.

## 20. Operator / Control Policy

Allowed future operators:

- `EQUALS`
- `IN`

Blocked operators:

- numeric min/max/range;
- less-than/greater-than;
- prefix;
- contains;
- radius;
- polygon;
- map boundary;
- market-area inference.

Recommended control: searchable multi-select with single-value mode. Multi-ZIP sets should deduplicate and sort canonical values so `[80302,80301,80302]` and `[80301,80302]` serialize equivalently.

## 21. Geography Composition

`CITY + ZIP` means logical intersection:

`city predicate AND zip predicate`

It does not mean ZIP overrides city or that city is inferred from ZIP. A syntactically valid but inconsistent city/ZIP pair may truthfully return zero current listing records.

Recommended Wave 8 boundary:

`ZIP_ONLY_BLOCKED_BY_CURRENT_COHORT_GEOGRAPHY_CONTRACT`

`CITY_AND_ZIP_INTERSECTION_READY`

Require one admitted city in the first implementation so ZIP cannot backdoor non-admitted municipalities.

## 22. Property Filter Composition

ZIP can compose with currently admitted property filters:

property type, status, price, bedrooms, bathrooms, square feet, year built, and lot acreage.

ZIP must remain outside `agentNumericInterval`; ZIP-filtered cohorts may still use numeric interval filters for actual numeric fields.

## 23. Cohort Identity / Relationship Policy

ZIP must participate in deterministic cohort identity. Cohorts differing only by ZIP cannot serialize identically.

Relationship claims are listing-predicate relationships only, not geographic polygon relationships. Different single exact ZIP predicates can be disjoint at the listing-row predicate level because one listing has one stored `Property.zip`; this does not prove geographic disjointness.

## 24. Comparability / Cohort-N Readiness

ZIP-filtered cohorts can use existing admitted metrics where normal comparability rules pass:

same grain, source scope, current-snapshot class, metric identity, rights posture, and compatible cohort definitions.

Cohort-N can compare multiple ZIP-filtered cohorts as independent cohort definitions. Any ranking remains tied to admitted metrics, not ZIP desirability.

## 25. Buyer / Location / Market / Property Surface Findings

Buyer Preparation: no current Buyer criteria profile ZIP field exists, so Buyer ZIP mapping is `AGENT_REFINEMENT_ONLY` / `NEW_BUYER_INPUT_WOULD_BE_REQUIRED`.

Location Preparation: moderate value; future language must say postal-code listing context, not neighborhood.

Market Preparation: high value for current-snapshot segmentation if labeled as "current listings with postal code X" rather than "the X market."

Current Competing Listing Context: high value as Agent-adjusted refinement; default system-derived competing cohort must not automatically add subject ZIP.

Subject ZIP display: safe as factual listing metadata; not benchmark methodology.

Property Preparation: useful in advanced refinement/search context only.

Future seller/listing value: high for competition narrowing; not CMA geography.

Future subject benchmark value: possible only as one input after separate benchmark methodology, sold/historical evidence, rights, and Agent judgment.

## 26. Rights / Fair-Housing Boundary

Agent filter rights and factual Agent display are sufficient for the bounded next gate.

Client-private, public, export, and PDF rights remain separately blocked.

ZIP use must remain neutral listing/property segmentation. It must not create demographic, protected-class, desirability, safety, school-quality, socioeconomic, steering, suitability, recommendation, valuation, or fair-housing-sensitive inference semantics.

## 27. Filter-Registry Metadata Requirements

Future Wave 8 registration should use:

- filter id: `zip`
- field basis: `Property.zip`
- value type: `STRING_IDENTIFIER`
- canonical unit: none
- tier: `ADVANCED_PROPERTY_FILTER`
- operators: `EQUALS`, `IN`
- normalizer: five-digit postal string normalizer
- null policy: record must have populated, non-sentinel ZIP
- analytical grain: `MLS_LISTING`
- source scope: `CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION`
- rights posture: `AGENT_ONLY`
- surface availability: Current Competing Listing Context first; shared cohort and Cohort-N support; Buyer only as Agent refinement until a real Buyer ZIP criterion exists
- limitations: no geography identity, no metric, no default competing cohort derivation, no public/client/export activation

## 28. Implementation Readiness Matrix

| Capability | State |
| --- | --- |
| ZIP field semantics | `READY_NOW_FOR_BOUNDED_IMPLEMENTATION` |
| ZIP normalization | `READY_NOW_FOR_BOUNDED_IMPLEMENTATION` |
| exact ZIP filter | `READY_NOW_FOR_BOUNDED_IMPLEMENTATION` |
| multi-select ZIP filter | `READY_NOW_FOR_BOUNDED_IMPLEMENTATION` |
| ZIP-only cohort | `BLOCKED_BY_CURRENT_GEOGRAPHY_CONTRACT` |
| city + ZIP cohort | `READY_NOW_FOR_BOUNDED_IMPLEMENTATION` |
| ZIP + Priority 1 filters | `READY_NOW_FOR_BOUNDED_IMPLEMENTATION` |
| ZIP comparison | `READY_NOW_FOR_BOUNDED_IMPLEMENTATION` |
| ZIP Cohort-N | `READY_NOW_FOR_BOUNDED_IMPLEMENTATION` |
| Buyer ZIP mapping | `DEFER` |
| Location ZIP refinement | `READY_AFTER_SURFACE_ADAPTER` |
| Market ZIP segmentation | `READY_AFTER_SURFACE_ADAPTER` |
| Current Competing Listing Context ZIP refinement | `READY_NOW_FOR_BOUNDED_IMPLEMENTATION` |
| Subject ZIP display | `READY_AFTER_SURFACE_ADAPTER` |

## 29. Exact Next Implementation Boundary

Recommended next package:

`READY_FOR_ZIP_POSTAL_LISTING_FILTER_BOUNDED_IMPLEMENTATION_WAVE_8`

Certification target:

`ZIP_POSTAL_LISTING_FILTER_BOUNDED_IMPLEMENTATION_WAVE_8_CERTIFIED`

Included scope:

- register ZIP in the admitted filter registry;
- implement string ZIP normalizer;
- exact ZIP filtering;
- multi-select `IN` filtering with sorted deduplicated serialization;
- city-required scope enforcement for Wave 8;
- shared cohort identity and query/count mapping;
- existing metrics over ZIP-filtered cohorts;
- Current Competing Listing Context Agent refinement;
- Cohort-N compatibility;
- Buyer only as Agent refinement, not automatic mapping;
- deterministic checker and bounded read-only runtime proof.

Excluded scope:

- ZIP-only runtime cohorts;
- non-admitted city expansion;
- ZIP geography objects;
- ZIP polygons or ZCTA semantics;
- neighborhoods, subdivision, county, MLS area/subarea;
- public/client/export/PDF activation;
- historical analytics, sold comparables, subject benchmarking, CMA, valuation, or recommendations.

## 30. Expected Runtime Proofs for Wave 8

Wave 8 should prove:

- exact ZIP accepted;
- malformed ZIP rejected;
- `00000` and null excluded;
- leading-zero-safe normalization;
- ZIP+4 base normalization;
- city + ZIP intersection;
- valid zero-result city + ZIP combination remains valid;
- unsupported city fails closed;
- ZIP cannot expand six-city scope;
- ZIP + beds/baths/lot filters compose;
- ZIP participates in cohort identity;
- multi-ZIP normalization is stable;
- Cohort-N compatibility;
- existing metrics over ZIP-filtered cohorts;
- ZIP remains filter-only;
- Current Competing Listing Context default remains unchanged.

## 31. Checker / Fixture Results

The inert checker validates:

- ZIP string identity;
- leading-zero preservation with synthetic `01234`;
- exact five-digit acceptance;
- malformed rejection;
- ZIP+4 base normalization;
- null/blank/`00000` unknown behavior;
- ZIP is not municipality, neighborhood, subdivision, county, MLS area, numeric interval, metric, polygon, or default competing-cohort derivation;
- city + ZIP intersection readiness;
- multi-ZIP sorting and deduplication;
- runtime `zip` remains unadmitted until Wave 8.

## 32. Follow-On Priority

After Wave 8, recommended follow-on priority is:

`READY_FOR_VERSIONED_CITY_SET_EXPANSION_ADMISSION_REVIEW`

Reason: ZIP filtering will sharpen current admitted-city segmentation, but Agent value is constrained until municipality/city-set governance is versioned. Historical evidence and subject benchmarking remain higher-risk and should stay separate.

Secondary parallel recommendation:

`NO_SECONDARY_PARALLEL_WORK_RECOMMENDED`

## 33. Protected-System Confirmation

DATABASE MUTATION: NONE

DATABASE SCHEMA MIGRATION: NONE

SUPABASE CONFIGURATION MUTATION: NONE

MLS GRID CALL: NONE

IRES CALL: NONE

MLS SYNC: NONE

PROVIDER MUTATION: NONE

SOURCE ACTIVATION: NONE

TYPESENSE MUTATION: NONE

CRM MUTATION: NONE

EMAIL MUTATION: NONE

SECRET/API-KEY MUTATION: NONE

EXTERNAL OUTREACH: NONE

MANUAL VERCEL ACTION: NONE

MANUAL PRODUCTION DEPLOYMENT: NONE

ZIP RUNTIME FILTER IMPLEMENTATION: NONE

ZIP UI ACTIVATION: NONE

ZIP QUERY ACTIVATION: NONE

ZIP PRODUCTION REGISTRY ACTIVATION: NONE

NEW MUNICIPALITY ACTIVATION: NONE

COUNTY ACTIVATION: NONE

SUBDIVISION / NEIGHBORHOOD ACTIVATION: NONE

MLS AREA / SUBAREA ACTIVATION: NONE

MAP / POLYGON / RADIUS ACTIVATION: NONE

CANONICAL ZIP GEOGRAPHY ACTIVATION: NONE

POSTGIS MUTATION: NONE

GEOCODING MUTATION: NONE

HISTORICAL ANALYTICS IMPLEMENTATION: NONE

SOLD-COMPARABLE IMPLEMENTATION: NONE

SUBJECT-PROPERTY BENCHMARK IMPLEMENTATION: NONE

CMA IMPLEMENTATION: NONE

VALUATION IMPLEMENTATION: NONE

RECOMMENDATION IMPLEMENTATION: NONE

CLIENT/PUBLIC/EXPORT ACTIVATION: NONE

AUTHENTICATION-BOUNDARY MUTATION: NONE
