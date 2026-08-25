# PROJECT ATLAS - ZIP Postal Listing Filter Bounded Implementation Wave 8 Certification

Status: `ZIP_POSTAL_LISTING_FILTER_BOUNDED_IMPLEMENTATION_WAVE_8_CERTIFIED`

Certification date: 2026-08-25

## Workstream Identity

Wave 8 implements ZIP as an Agent-only listing postal-code filter under the existing admitted-filter registry and current six-city cohort boundary. Multi-select ZIP is included in the first implementation.

Starting repository truth:

- branch: `main`
- HEAD: `dc8778b5a501dbbf7b2dc90609a076df0c59e1e4`
- origin/main: `dc8778b5a501dbbf7b2dc90609a076df0c59e1e4`
- divergence: `0 behind / 0 ahead`
- working tree: clean
- `git diff --check`: PASS

## Governing Baseline

Wave 8 depends on:

- `AGENT_ADMITTED_FILTER_REGISTRY_V1`
- `LISTING_POSTAL_CODE_FILTER_V1`
- `ZIP_POSTAL_LISTING_FILTER_FOUNDATION_ADMISSION_REVIEW_CERTIFIED`
- `ADMITTED_FILTER_REGISTRY_AND_PRIORITY_1_PROPERTY_SEGMENTATION_BOUNDED_IMPLEMENTATION_WAVE_7_CERTIFIED`
- `CURRENT_COMPETING_LISTING_CONTEXT_BOUNDED_IMPLEMENTATION_WAVE_6_CERTIFIED`
- `COHORT_N_MULTI_MARKET_COMPARATIVE_INTELLIGENCE_BOUNDED_IMPLEMENTATION_WAVE_5_CERTIFIED`
- `CURRENT_SNAPSHOT_COMPARATIVE_INTELLIGENCE_BOUNDED_IMPLEMENTATION_WAVE_3_CERTIFIED`
- `ATLAS_COHORT_AND_COMPARATIVE_MARKET_INTELLIGENCE_CONTRACT_MVV_CERTIFIED`

The canonical repository field remains `Property.zip`, sourced from `PostalCode`, `Zip`, or `zip`, with `CURRENT_LISTING_PROPERTY_LOCATION_ADDRESS` semantics.

## ZIP Runtime Registry Registration

`zip` is registered in `lib/agentAdmittedFilterRegistry.ts` as:

- field basis: `Property.zip`
- value type: `STRING_IDENTIFIER`
- filter tier: `ADVANCED_PROPERTY_FILTER`
- operator: `IN`, supporting single ZIP and multi-select ZIP
- analytical grain: `MLS_LISTING`
- source scope: `CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION`
- rights audience: `AGENT_ONLY`
- geography activation: false
- aggregatable: false

ZIP is no longer in `AGENT_COHORT_UNADMITTED_FILTER_KEYS`.

## ZIP Normalizer

Runtime cohort normalization uses the certified ZIP postal normalizer:

- accepts string input only;
- trims surrounding whitespace;
- preserves leading zeros;
- accepts exactly five digits;
- normalizes valid ZIP+4 such as `80301-1234` to `80301`;
- rejects malformed values;
- rejects sentinel `00000`;
- never parses ZIP as a number;
- never infers ZIP from city, address, coordinates, or geography.

Malformed multi-select member policy:

If any member is malformed, the whole ZIP filter rejects. The implementation does not silently keep valid members and drop invalid members.

Empty multi-select policy:

Empty ZIP arrays normalize to no ZIP filter. ZIP without an admitted city only fails when a non-empty ZIP selection is supplied.

## Single and Multi-Select Implementation

Single ZIP:

`Boulder / Active / Residential / ZIP 80301`

normalizes to:

`zip: ["80301"]`

Multi-select:

`ZIP IN [80301, 80302]`

normalizes to:

`zip: ["80301", "80302"]`

Duplicate and ordering behavior:

`["80302", "80301", "80302"]`

normalizes to:

`["80301", "80302"]`

The query predicate maps through the shared cohort count path to:

`Property.zip IN normalizedZipSet`

alongside the existing admitted city predicate.

## City-Required Scope Enforcement

Wave 8 requires ZIP to be paired with one admitted city. ZIP-only cohort requests fail before query execution with:

`ZIP_REQUIRES_ADMITTED_CITY`

Unsupported city plus ZIP still fails closed through existing city validation. ZIP cannot activate Denver, Broomfield, Westminster, Niwot, Brighton, or any other non-admitted municipality.

Valid city + valid ZIP with zero matching rows remains a valid zero-result cohort. This is not malformed geography.

## Cohort Identity and Relationships

ZIP participates in deterministic cohort serialization. Cohorts differing only by ZIP do not share the same cohort identity.

Relationship inference is predicate-level only:

- `ZIP 80301` vs `ZIP IN [80301, 80302]` may be `SUBSET` / `SUPERSET`.
- `ZIP 80301` vs `ZIP 80302` may be `DISJOINT` because one listing row has one stored ZIP value.
- `ZIP IN [80301, 80302]` vs `ZIP IN [80302, 80303]` may be `OVERLAPPING`.

These are listing-predicate relationships, not polygon or canonical geography relationships.

## Query / Count / Aggregation / Comparison

The implementation extends the existing shared cohort definition, normalization, serialization, and Prisma where-builder. No surface-specific ZIP query engine was added.

Existing admitted metrics operate over ZIP-filtered cohorts. ZIP changes cohort selection, not metric definition. No ZIP metric, ZIP rank, ZIP score, ZIP market-strength measure, or ZIP desirability output was added.

Current-snapshot comparison and Cohort-N can carry ZIP-filtered cohorts. Ranking remains tied only to an admitted metric label, never to ZIP quality or desirability.

## Current Competing Listing Context

Current Competing Listing Context supports ZIP as an Agent-adjusted refinement.

Default competing cohort preservation:

The system-derived default remains unchanged and does not auto-apply subject ZIP.

Subject ZIP behavior:

Subject ZIP may display factually as listing metadata and can be applied only through the explicit Agent action `Use subject ZIP`.

Applied ZIP criteria are visible as:

- `ZIP: 80301`
- `ZIPs: 80301, 80302`

Subject exclusion remains based on deterministic listing reference where applicable.

## UI Architecture

Agent-facing labels/copy include:

- `Listing ZIPs`
- `Use subject ZIP`
- `ZIP: 80301`
- `ZIPs: 80301, 80302`

The UI marks ZIP as a postal attribute and explicitly not geography through stable data attributes. It does not label ZIP as neighborhood, municipality, market area, school area, safety area, or desirability indicator.

## Market / Location / Buyer Boundaries

Market Preparation receives ZIP capability through the shared Agent cohort builder where present. It remains current listing context, not a ZIP-defined market-area claim.

Location Preparation is not expanded in Wave 8. ZIP remains future surface-adapter work there to avoid relabeling postal codes as neighborhoods or places.

Buyer Preparation does not get automatic ZIP mapping because the current Buyer criteria profile has no truthful ZIP criterion. ZIP remains Agent refinement unless a future Buyer input is explicitly admitted.

## Runtime Proof Summary

Runtime proof is read-only and uses existing `Property` rows through already-authorized application paths. It must not mutate database records, schema, Supabase configuration, providers, MLS, IRES, Typesense, CRM, email, secrets, or deployment state.

Observed subject for Current Competing Listing Context proof:

- slug: `8929-tahoe-ln-boulder-co-ire1367102`
- MLS ID: `IRE1367102`
- address: `8929 Tahoe Ln`
- city/type/status/ZIP: Boulder / Residential / Active / `80301`
- price/beds/baths/sqft/lot acres/year: 2345000 / 3 / 3 / 3763 / 0.73 / 1978

Runtime examples:

- Single ZIP, Boulder Residential Active `ZIP 80301`: READY, count 74, existing count and median list-price metrics available, median list price 790000, 348 ms count, 336 ms aggregation.
- Multi-select ZIP, Boulder Residential Active `ZIP IN [80301, 80302]`: READY, count 163, normalized to `["80301", "80302"]`, 321 ms.
- Multi-ZIP normalization: `["80302", "80301", "80302"]` normalized to `80301,80302`.
- ZIP+4 contract proof: `80301-1234` normalized to `80301`.
- Leading-zero contract proof: `01234` preserved as `01234`.
- Valid zero-result city + ZIP: Boulder Residential Active `ZIP 99999`: READY, count 0, 341 ms.
- ZIP without city: rejected with `ZIP_REQUIRES_ADMITTED_CITY`.
- Unsupported city + ZIP: Denver/`80202` rejected with unsupported city validation and no city backdoor.
- ZIP + Priority 1 filters: Boulder Residential Active `ZIP 80301`, `bedsExact=3`, `bathsMin=2`, `lotSizeMin=0.1`: READY, count 6, 271 ms.
- Current Competing Listing Context ZIP refinement: READY, visible `ZIP: 80301`, post-exclusion count 73, subject exclusion `EXCLUDED_BY_LISTING_REFERENCE`, pre-minus-post 1, 667 ms.
- ZIP Cohort-N: Boulder `80301`, `80302`, `80303` comparison READY, 3 cohorts, 1 selected metric result, ranks `[2,1,3]`, 992 ms.
- Malformed ZIP examples `8030`, `803011`, `80A01`, `803 01`, and `00000` fail closed.
- Malformed multi-select member `["80301", "BADZIP"]` rejects the whole ZIP filter.

Boundedness finding:

The observed read-only runtime proof did not show material interaction degradation. No database index, schema change, cache, worker, or infrastructure change was made.

## Capabilities Certified

Wave 8 certifies:

- runtime `zip` registration in the admitted-filter registry;
- `Property.zip` as Agent-only listing postal filter;
- canonical ZIP normalizer;
- leading-zero-safe string semantics;
- valid ZIP+4 to base ZIP normalization;
- malformed/sentinel fail-closed behavior;
- single-ZIP `EQUALS` semantics through one-value set membership;
- multi-select ZIP `IN`;
- multi-select deduplication;
- canonical ZIP-set ordering;
- city-required ZIP scope;
- city + ZIP logical intersection;
- truthful valid zero-result city + ZIP cohorts;
- ZIP participation in cohort identity;
- predicate-level ZIP relationship inference;
- ZIP composition with Wave 7 filters;
- existing admitted metrics over ZIP-filtered cohorts;
- current-snapshot ZIP comparisons;
- ZIP Cohort-N;
- Current Competing Listing Context ZIP Agent refinement;
- factual subject ZIP display in the Agent context;
- Agent-only postal listing segmentation.

## Capabilities Still Blocked

Still blocked:

- ZIP-only cohorts;
- canonical ZIP geography;
- ZIP polygons;
- ZIP equals municipality, neighborhood, subdivision, county, MLS Area, or SubArea;
- new municipality activation;
- Denver, Broomfield, Westminster, Niwot, Brighton activation;
- county filtering;
- subdivision/neighborhood filtering;
- map/polygon/radius filtering;
- ZIP metric;
- ZIP desirability ranking;
- demographic inference;
- safety ranking;
- school-quality ranking;
- socioeconomic ranking;
- automatic Buyer ZIP preference;
- automatic subject ZIP comparable selection;
- sold comparables;
- subject-property benchmark;
- CMA;
- valuation;
- recommendations;
- historical analytics;
- public/client/export ZIP output.

## Next Gate

One primary next gate:

`READY_FOR_VERSIONED_CITY_SET_EXPANSION_ADMISSION_REVIEW`

Reason:

Wave 8 now gives Agent workflows a bounded postal listing filter inside the existing six-city scope. The next limiting factor is not another ZIP primitive; it is the versioned admitted city-set boundary that controls whether additional repository-supported municipalities can participate safely.

Secondary parallel recommendation:

`NO_SECONDARY_PARALLEL_WORK_RECOMMENDED`

## Protected-System Confirmation

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

NEW MUNICIPALITY ACTIVATION: NONE

ZIP-ONLY COHORT ACTIVATION: NONE

CANONICAL ZIP GEOGRAPHY ACTIVATION: NONE

COUNTY ACTIVATION: NONE

SUBDIVISION / NEIGHBORHOOD ACTIVATION: NONE

MLS AREA / SUBAREA ACTIVATION: NONE

MAP / POLYGON / RADIUS ACTIVATION: NONE

POSTGIS MUTATION: NONE

GEOCODING MUTATION: NONE

NEW AGGREGATION METRIC IMPLEMENTATION: NONE

ZIP METRIC IMPLEMENTATION: NONE

HISTORICAL ANALYTICS IMPLEMENTATION: NONE

SOLD-COMPARABLE IMPLEMENTATION: NONE

SUBJECT-PROPERTY BENCHMARK IMPLEMENTATION: NONE

CMA IMPLEMENTATION: NONE

VALUATION IMPLEMENTATION: NONE

RECOMMENDATION IMPLEMENTATION: NONE

DEMOGRAPHIC / PROTECTED-CLASS INFERENCE: NONE

SAFETY / SCHOOL-QUALITY / SOCIOECONOMIC RANKING: NONE

CLIENT/PUBLIC/EXPORT ACTIVATION: NONE

PDF/EXPORT IMPLEMENTATION: NONE

AUTHENTICATION-BOUNDARY MUTATION: NONE
