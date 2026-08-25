# IRES Agent Reporting Capability Reconciliation - Phase 1

Date: 2026-08-25

Program: `IRES_AGENT_REPORTING_CAPABILITY_RECONCILIATION_PHASE_1`

Status recommendation: `IRES_AGENT_REPORTING_CAPABILITY_RECONCILIATION_PHASE_1_ARCHITECTURE_CERTIFIED`

Next gate: `READY_FOR_ATLAS_COHORT_AND_COMPARATIVE_MARKET_INTELLIGENCE_CONTRACT_MVV_AUTHORIZATION`

## Executive Summary

This Phase 1 reconciliation maps the human-observed IRES reporting universe to reusable PROJECT ATLAS / REIE analytical primitives. The conclusion is that REIE should not clone IRES reports one by one. REIE should establish a provider-neutral analytical substrate that can define cohorts, admit metric definitions, preserve event/date basis, aggregate source observations, compare independently defined cohorts, and compose Agent/client outputs from certified evidence.

The repository already contains important foundations:

- market metric definition and observation separation;
- unresolved-market-semantics fail-closed behavior;
- session-only property criteria vocabulary;
- Agent Market, Place, Property, Buyer, Seller, Listing, open-house, comparable-input, seller-update, and newsletter preparation surfaces or packet patterns;
- listing-shaped Property runtime, public Search, Property, Market, and Neighborhood experiences;
- canonical physical-property identity and source-observation architecture;
- IRES CityID source-geography evidence admission;
- MLS source-freshness architecture; and
- prospective historical aggregate observation persistence architecture.

The repository does not yet contain a canonical ATLAS Market / Property Cohort contract, a general comparative market intelligence engine, independently defined multi-period cohort comparison, admitted DOM/CDOM/DTS/DTO methodology, admitted SP/LP methodology, IRES duplicate-suppression equivalence, or source-rights authority for derived Agent/client reporting beyond currently certified bounded uses.

The governing architecture remains:

```text
SOURCE OBSERVATIONS
  -> NORMALIZED / CANONICAL PROPERTY + LISTING + GEOGRAPHY IDENTITIES
  -> ATLAS COHORT DEFINITION
  -> METRIC DEFINITIONS
  -> PERIOD / EVENT BASIS
  -> ANALYTICAL ENGINES
  -> INTERPRETATION
  -> AGENT / CLIENT OUTPUTS
```

The certified domain separation also remains mandatory:

```text
PHYSICAL PROPERTY != MLS LISTING != COUNTY PARCEL/ACCOUNT != PROVIDER RECORD
```

## Repository Evidence Reviewed

| Evidence | Relevance |
| --- | --- |
| `lib/marketMetricDefinitionEvidence.ts` | Defines metric definitions separately from observations, with unresolved semantics, permitted uses, prohibited interpretations, freshness, and comparability states. |
| `docs/project-atlas/executive-library/REIE-AUTHORITATIVE-MARKET-METRIC-DEFINITION-AND-EVIDENCE-CONTRACT-MVV-CERTIFICATION.md` | Certifies metric definition/evidence separation and blocks derived calculation, historical comparison, comparative reporting, and public display until methodology is admitted. |
| `lib/agent-advisory-workbench/marketMetricSemantics.ts` | Preserves fail-closed Agent market semantics for inventory, days-on-market, and price signals. |
| `lib/agent-advisory-workbench/propertyCriteriaProfile.ts` | Provides session-only Buyer/Seller/Listing/Property criteria vocabulary and blocks persistence, saved-search creation, provider query, and customer profile mutation. |
| `docs/project-atlas/executive-library/REIE-MARKET-INTELLIGENCE-SEMANTICS-SUFFICIENCY-AND-PROPERTY-CRITERIA-FOUNDATION-CERTIFICATION.md` | Certifies unresolved market semantics and reusable property-criteria foundation. |
| `lib/property/canonicalPhysicalPropertyIdentity.ts` | Establishes provider-neutral physical-property identity, source identities, source observations, listing events, conflict/freshness/readiness states, and global gaps. |
| `docs/project-atlas/executive-library/REIE-CANONICAL-PHYSICAL-PROPERTY-IDENTITY-AND-SOURCE-OBSERVATION-ARCHITECTURE-MVV-CERTIFICATION.md` | Certifies the property/listing/parcel/provider separation and keeps historical listing evidence, public records, source activation, and public use not admitted. |
| `docs/project-atlas/executive-library/IRES-OFFICIAL-CITYID-EVIDENCE-ADMISSION-AND-SUPABASE-IO-DIAGNOSTIC-CERTIFICATION.md` | Admits IRES CityID as source-specific geography evidence only; no listing assignment, coverage claim, Search/Map use, or public activation. |
| `docs/project-atlas/executive-library/REIE-PROSPECTIVE-HISTORICAL-MARKET-OBSERVATION-PERSISTENCE-ARCHITECTURE-MVV-CERTIFICATION.md` | Defines future aggregate-only historical market observation persistence and comparison eligibility; no writer or scheduler implemented. |
| `docs/project-atlas/executive-library/REIE-SAVED-SEARCH-AUTHORITATIVE-MLS-FRESHNESS-SOURCE-ARCHITECTURE.md` | Defines source freshness architecture and the `sourceModifiedAt` future gate; no schema/migration/runtime activation in that package. |
| `components/agent/*`, `app/agent/prepare/*`, `lib/agent-advisory-workbench/*` | Existing Agent Workspace and preparation capabilities. |
| `docs/project-atlas/executive-library/AGENT-WORKSPACE-SHARED-BRIEFING-COMPOSITION-AND-PAGE-IDENTITY-RECONCILIATION-MVV-CERTIFICATION.md` | Certifies shared Agent briefing composition for Market, Place, and Property preparation. |
| `docs/project-atlas/executive-library/DQG-AGENT-MARKET-REAL-CERTIFIED-CONTEXT-PRODUCER-MVV-CERTIFICATION.md` | Certifies finite read-only Agent market context for Boulder, Louisville, Lafayette, Superior, Erie, and Longmont from repository-local evidence. |
| `docs/project-atlas/executive-library/REIE-OPEN-HOUSE-AGENT-PREPARATION-PACKET-MVV-CERTIFICATION.md` | Certifies pure open-house preparation packet behavior. |
| `docs/project-atlas/executive-library/REIE-PROTECTED-OPEN-HOUSE-AGENT-PREPARATION-PREVIEW-MVV-CERTIFICATION.md` | Certifies protected read-only open-house preview for explicitly selected Property ID. |
| `docs/project-atlas/executive-library/REIE-PROTECTED-COMPARABLE-INPUT-AGENT-PREVIEW-MVV-CERTIFICATION.md` | Certifies protected read-only comparable-input preview for explicitly selected IDs. |
| `docs/project-atlas/executive-library/REIE-PROTECTED-SELLER-UPDATE-PREPARATION-AGENT-PREVIEW-MVV-CERTIFICATION.md` | Certifies protected read-only seller-update preparation preview with no prior baseline and no market runtime. |
| `docs/project-atlas/executive-library/REIE-RECURRING-MARKET-NEWSLETTER-AGENT-REVIEW-PACKAGE-MVV-CERTIFICATION.md` | Certifies Boulder-only deterministic newsletter review package; comparison and activity inputs remain insufficient. |
| `docs/project-atlas/executive-library/MARKET-PRODUCT-3-PRODUCTION-CERTIFICATION.md` | Certifies existing public Market Product 3 routes and states that forecasting/provider activation/GIS/telemetry remain false. |
| `lib/mls/*`, `lib/search/*`, `app/api/search/route.ts`, `app/search/page.tsx` | Existing listing ingestion, Search runtime, and listing-oriented public Property path. |
| `prisma/schema.prisma` and property identity migrations | Confirms existing listing-shaped `Property` compatibility model plus later additive identity architecture. |

## IRES Capability Reconciliation Matrix

| IRES task / report family | Agent business purpose | Core analytical question | Required cohort / filters | Required observations and metric definitions | Period / event basis | Geography basis | Current REIE support | Blocking classification | Reusable primitive / engine | Downstream consumers | Readiness |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hotsheet Activity | Monitor market movement and prepare timely client follow-up. | What changed in a market or client segment since a prior cutoff? | Source, duplicate policy, listing type, status/event, date/event window, geography, property characteristics. | Listing event observations, source freshness, status transition definitions, duplicate resolution. | Status change, new listing, price change, back-on-market, pending, close, off-market. | City, county, ZIP, subdivision, IRES Area/SubArea, map polygon, ATLAS geography. | PARTIALLY SUPPORTED: Saved Search freshness architecture and listing sync exist, but hotsheet event engine is not implemented. | IMPLEMENTATION GAP; DATA GAP; SOURCE ADMISSION GAP; IDENTITY / DEDUPLICATION GAP; METRIC METHODOLOGY GAP. | Market Activity / Status Event Engine; Source / Duplicate Resolution Layer; ATLAS Cohort Engine. | Agent Market Update, saved-search review, client update prep, newsletter review. | READY AFTER REPOSITORY-LOCAL WORK for contract; source/data blocked for production accuracy. |
| Inventory | Explain available supply and competitive context. | What inventory exists for a defined cohort at a point in time? | Listing type, active-like status definition, price, beds/baths, property type, geography, duplicate policy. | Active listing observations, inventory definition, source freshness, listing/public eligibility. | Point-in-time as-of snapshot; optional source-change basis. | City, ZIP, subdivision, neighborhood, map polygon, MLS area. | PARTIALLY SUPPORTED: Market Product 3 and Agent market context expose inventory signals, but semantics are unresolved. | METRIC METHODOLOGY GAP; DATA GAP; SOURCE ADMISSION GAP. | Inventory / Supply Engine; Market Aggregation Engine; ATLAS Cohort Engine. | Market Product, Agent Market, newsletter, seller update, buyer briefing. | BLOCKED BY METHODOLOGY until active-inventory definition and source rights are admitted. |
| Open Houses | Prepare open-house facts and event conversation. | What factual property and context should the Agent verify before an open house? | Explicit property ID, optional event label/date, property facts, source posture, optional market/place context. | Property facts, source/timestamp posture, missing evidence, fair-housing guardrails. | Event date label only; no market event basis in current preview. | Property address/place; no automatic market geography fill. | ALREADY SUPPORTED for protected internal factual preparation. | NONE for current internal preview; DATA GAP for automatic market/place context. | Report / Presentation Composition Layer; Property Characteristic Segmentation Engine. | Protected Agent open-house preview, future listing prep. | READY NOW for current internal preview; blocked for customer/event operations. |
| DOM Analysis | Explain market pace and listing exposure. | How long do properties in a cohort take to sell or move through statuses? | Sold cohort, property type, source, duplicate policy, geography, date/event basis. | DOM/CDOM/DTS/DTO definitions, listing event timestamps, relist/reset rules, exclusions. | Must specify listing date, sold/close date, off-market date, or source-defined DOM basis. | MLS geography plus ATLAS geography mapping. | PARTIALLY SUPPORTED: REIE can label days-on-market signal as unresolved and prevent false specificity. | METRIC METHODOLOGY GAP; HISTORICAL DATA GAP; SOURCE ADMISSION GAP. | Market Duration Engine; Market Metric Definition Contract; ATLAS Cohort Engine. | Agent Market Update, seller prep, buyer prep, newsletter, market reports. | BLOCKED BY METHODOLOGY. |
| Sold, Status Statistics | Produce sold count, volume, high/low/median, status counts, and related market stats. | What aggregate outcomes occurred for a cohort? | Sold/status cohort, listing type, date/event basis, price band, property characteristics, source, duplicate policy. | Sold count, total volume, high/low/median, status event counts, SP/LP if admitted. | Sold/close date, listing date, status change date, off-market date must be explicit. | City, county, ZIP, subdivision, IRES Area/SubArea, map polygon. | PARTIALLY SUPPORTED: aggregation concepts and current market computations exist, but canonical cohort/status/statistics engine is absent. | IMPLEMENTATION GAP; METRIC METHODOLOGY GAP; HISTORICAL DATA GAP; IDENTITY / DEDUPLICATION GAP. | Market Aggregation Engine; Pricing / Sale Relationship Engine; Market Activity / Status Event Engine. | Agent reports, Market Product, seller updates, comparative market intelligence. | READY AFTER REPOSITORY-LOCAL WORK for defined safe metrics; methodology blocked for SP/LP and ambiguous statuses. |
| Market Penetration | Understand agent/office share or participation. | What share of a market cohort is represented by a brokerage, office, or listing/selling side? | Office/agent/source identifiers, listed/sold/co-broker classification, status, period, geography. | Office/agent relationship observations, side role semantics, duplicate logic, total market denominator. | Sold/close or listing event basis. | MLS market/area and canonical geography. | UNKNOWN / REPOSITORY EVIDENCE INSUFFICIENT: no canonical Agent/office share reporting found in reviewed evidence. | DATA GAP; RIGHTS / DISPLAY GAP; METRIC METHODOLOGY GAP; IMPLEMENTATION GAP. | Market Aggregation Engine; Source / Duplicate Resolution Layer; Report Composition Layer. | Agent business reporting, executive dashboard. | BLOCKED BY SOURCE/DATA and Executive decision. |
| Sales Terms | Review financing/concession/term patterns. | What terms appear in sold transactions for a cohort? | Sold cohort, financing/sale terms fields, property type, geography, period. | Sales terms field definitions, closed-sale records, rights to analyze/display terms. | Sold/close date. | MLS geography plus ATLAS geography. | UNKNOWN / REPOSITORY EVIDENCE INSUFFICIENT. | DATA GAP; RIGHTS / DISPLAY GAP; METRIC METHODOLOGY GAP. | Market Aggregation Engine; Report Composition Layer. | Agent negotiation prep, seller prep, buyer prep. | BLOCKED BY SOURCE/DATA and RIGHTS. |
| Compare Two Years | Compare independently defined periods. | How does Cohort A compare with Cohort B across compatible metrics? | Independently defined cohort A/B/N, each with its own event/date basis, filters, source, geography, duplicate policy. | Compatible metric definitions, observations, period metadata, historical evidence, sample sufficiency. | Explicit event/date basis per cohort; start/end alone is insufficient. | Comparable geography identity across periods. | PARTIALLY SUPPORTED: prospective historical observation architecture defines future comparison eligibility; no general engine exists. | IMPLEMENTATION GAP; HISTORICAL DATA GAP; METRIC METHODOLOGY GAP. | Comparative Market Intelligence Engine; Market Period / Event Basis; Market Aggregation Engine. | Market Update, newsletter, Agent reports, client presentations. | READY AFTER REPOSITORY-LOCAL WORK for contract; blocked for live historical calculations. |
| InfoSparks | Produce market charts and visual analytics. | What trends, comparisons, and distributions should an Agent explain? | Market/geography, property type, status, period, metric, segment filters. | Admitted aggregates, chart metadata, source/methodology, comparison eligibility. | Point-in-time, monthly, quarterly, YTD, trailing periods with event basis. | City/ZIP/neighborhood/MLS area/map polygon. | PARTIALLY SUPPORTED: Market Product 3 has charts/visual intelligence, but not InfoSparks-equivalent cohort engine. | IMPLEMENTATION GAP; HISTORICAL DATA GAP; METRIC METHODOLOGY GAP; RIGHTS / DISPLAY GAP. | Market Aggregation Engine; Comparative Market Intelligence Engine; Report Composition Layer. | Market Product, Agent Market, client presentations. | BLOCKED BY METHODOLOGY and historical observations for trend use. |
| Regional Snapshot / Graphs | Summarize regional market conditions. | What is happening at regional geography scope? | Region, city/county/ZIP rollups, status, property type, date/event basis. | Regional aggregate definitions, geography hierarchy, source rights. | Snapshot or period rollup with event basis. | Canonical ATLAS geography and MLS geography reconciliation. | PARTIALLY SUPPORTED: city routes and geographic object governance exist; regional rollup engine is not established. | GEOGRAPHY GAP; IMPLEMENTATION GAP; METRIC METHODOLOGY GAP. | Geographic Cohort Engine; Market Aggregation Engine; Report Composition Layer. | Market Product, Agent briefings, executive reports. | READY AFTER REPOSITORY-LOCAL WORK for architecture; blocked for source/admitted regional metrics. |
| ZIP Profiles | Profile market behavior by ZIP. | What are the market characteristics of a ZIP-defined cohort? | ZIP, property type, status, price, period, duplicate policy. | ZIP geography identity, listing observations, admitted metrics. | Snapshot and period rollups with event basis. | ZIP as geography; must not confuse postal city with ATLAS city. | PARTIALLY SUPPORTED: Search and property records include ZIP-like address dimensions; canonical ZIP market reporting not certified. | GEOGRAPHY GAP; METRIC METHODOLOGY GAP; IMPLEMENTATION GAP. | Geographic Cohort Engine; Market Aggregation Engine; Property Characteristic Segmentation Engine. | Market pages, Agent reports, Search filters. | READY AFTER REPOSITORY-LOCAL WORK for contract; source/methodology blocked for metrics. |
| Quarterly / Yearly Market Report | Produce durable professional market reporting. | What happened during a quarter/year and what changed from comparable periods? | Geography, property type, status, quarter/year, source, duplicate policy, segments. | Certified period aggregates, comparison periods, chart/narrative composition rules. | Quarter/year based on explicit listing/pending/sold/status basis. | Canonical geography plus source geography mapping. | PARTIALLY SUPPORTED: newsletter review package and prospective historical architecture exist; full report engine absent. | IMPLEMENTATION GAP; HISTORICAL DATA GAP; METRIC METHODOLOGY GAP; RIGHTS / DISPLAY GAP. | Comparative Market Intelligence Engine; Report Composition Layer; Market Aggregation Engine. | Agent/client reports, newsletter, public Market. | BLOCKED BY HISTORICAL DATA and METHODOLOGY for automated reports. |
| Sales by MLS Area | Analyze market outcomes by MLS area. | How do sales metrics differ by MLS-defined area? | MLS Area/SubArea, status, property type, date/event basis. | MLS area identity, listing observations, metric definitions, rights. | Sold/close or status basis. | IRES Area/SubArea and canonical ATLAS geography relationship. | PARTIALLY SUPPORTED: IRES CityID evidence exists; Area/SubArea reconciliation not certified. | GEOGRAPHY GAP; SOURCE ADMISSION GAP; METRIC METHODOLOGY GAP. | Geographic Cohort Engine; Source / Duplicate Resolution Layer; Market Aggregation Engine. | Agent reports, market comparisons. | BLOCKED BY SOURCE/DATA. |
| CAR Housing Statistics | Align with third-party/professional statistics. | How does REIE compare with externally published association statistics? | Association-defined geography, property type, period, status, metric. | CAR methodology, attribution, rights, metric definitions. | Association-defined period and event basis. | Association geography; must reconcile to ATLAS geography. | UNKNOWN / REPOSITORY EVIDENCE INSUFFICIENT. | SOURCE ADMISSION GAP; RIGHTS / DISPLAY GAP; METRIC METHODOLOGY GAP. | Source Observation Layer; Market Metric Definition Contract; Report Composition Layer. | Agent education, market credibility review. | BLOCKED BY SOURCE/DATA and RIGHTS. |
| Active Listings Snapshot | Explain present active supply. | What listings are active at a specific as-of moment? | Active status definition, source, duplicate suppression, property filters, geography. | Active listing observations, source freshness, public/private eligibility. | Point-in-time as-of. | City/ZIP/neighborhood/MLS area/map polygon. | PARTIALLY SUPPORTED: Search can list active/public property records; authoritative active snapshot semantics remain unresolved. | METRIC METHODOLOGY GAP; SOURCE FRESHNESS GAP; IDENTITY / DEDUPLICATION GAP. | Inventory / Supply Engine; ATLAS Cohort Engine; Source / Duplicate Resolution Layer. | Search, Agent Market, seller update, newsletter. | READY AFTER REPOSITORY-LOCAL WORK for internal explicit-source snapshot; blocked for IRES-equivalent claim. |
| My Transactions | Track agent/client transaction workload. | What client/transaction records need action or review? | Agent/customer/transaction status, task state, timeline. | Transaction records, CRM/task records, authorization and privacy controls. | Operational task/event timestamps. | Property/location optional. | PARTIALLY SUPPORTED: CRM task and inquiry/seller intake foundations exist, but transaction reporting is not certified. | IMPLEMENTATION GAP; CUSTOMER-DATA / RIGHTS GAP; EXECUTIVE DECISION. | Report Composition Layer; Operational/CRM Reporting Primitive. | Agent Workspace, CAO, executive ops. | BLOCKED BY EXECUTIVE DECISION. |
| My Listings | Manage agent listing portfolio. | Which listings need preparation, update, or follow-up? | Agent/listing ownership, status, source freshness, property facts. | Listing ownership/representation evidence, listing records, status/freshness. | Listing lifecycle basis. | Property/listing geography. | PARTIALLY SUPPORTED: listing preparation and seller-update prep exist; agent-owned listing portfolio reporting not certified. | DATA GAP; RIGHTS / DISPLAY GAP; IMPLEMENTATION GAP. | Source / Duplicate Resolution Layer; Listing Portfolio Primitive; Report Composition Layer. | Agent Workspace, listing prep, seller update. | BLOCKED BY SOURCE/DATA and Executive decision. |
| ColoProperty Usage | Review portal/customer engagement. | How are listings or customers using a portal? | Portal usage events, listing/customer identity, time window. | Portal analytics, consent/privacy, rights, attribution. | Usage event timestamps. | Listing/property optional. | UNKNOWN / REPOSITORY EVIDENCE INSUFFICIENT. | DATA GAP; RIGHTS / DISPLAY GAP; CUSTOMER-DATA GAP. | Operational/Engagement Reporting Primitive. | Agent Workspace, client reporting. | BLOCKED BY SOURCE/DATA and RIGHTS. |
| MySite Activity | Review owned-site engagement. | What user activity occurred on the Agent/site surface? | User/session/source, route, event, time window, consent. | First-party analytics events, privacy policy, consent/data minimization. | Interaction event basis. | Route/property/market context. | PARTIALLY SUPPORTED: public product surfaces and launch readiness exist; no broad customer telemetry activation is certified here. | IMPLEMENTATION GAP; RIGHTS / PRIVACY GAP; EXECUTIVE DECISION. | Operational/Engagement Reporting Primitive; Report Composition Layer. | Agent Workspace, CAO, marketing ops. | BLOCKED BY EXECUTIVE DECISION. |
| ListTrac | Review listing engagement analytics. | How much engagement did a listing receive across channels? | Listing identity, platform/source, engagement type, time window. | Third-party engagement observations, rights, privacy, attribution. | Engagement event basis. | Listing/property context. | UNKNOWN / REPOSITORY EVIDENCE INSUFFICIENT. | SOURCE ADMISSION GAP; RIGHTS / DISPLAY GAP; DATA GAP. | Operational/Engagement Reporting Primitive. | Listing reports, seller updates. | BLOCKED BY SOURCE/DATA and RIGHTS. |
| OneHomeowner | Homeowner intelligence and retention reporting. | What homeowner/property context should support retention and advice? | Homeowner identity, property identity, property facts, market context, communication permissions. | Customer/homeowner records, canonical property identity, source observations, consent. | Customer lifecycle and market period basis. | Canonical property and place. | PARTIALLY SUPPORTED: seller/home-worth flows and property identity architecture exist; homeowner reporting is not certified. | CUSTOMER-DATA GAP; PROPERTY_IDENTITY_SOURCE_ADMISSION_REQUIRED; RIGHTS / DISPLAY GAP; EXECUTIVE DECISION. | Canonical Physical Property Identity; Report Composition Layer; Operational/Engagement Reporting Primitive. | Seller experience, homeowner review, Agent Workspace. | BLOCKED BY EXECUTIVE DECISION and source/data. |
| Sales by Listing Type | Segment sold results by listing type. | How do results differ by listing type? | Listing type, status, period, geography, source, duplicate policy. | Listing type semantics, sold observations, aggregates. | Sold/close or event basis. | MLS/ATLAS geography. | PARTIALLY SUPPORTED: property/listing type exists in records and criteria vocabulary; aggregate engine absent. | IMPLEMENTATION GAP; METRIC METHODOLOGY GAP; IDENTITY / DEDUPLICATION GAP. | Market Aggregation Engine; Property Characteristic Segmentation Engine. | Agent reports, Market Product. | READY AFTER REPOSITORY-LOCAL WORK for contract. |
| Sales by MLS Area | Segment sales by MLS source geography. | Which MLS areas produced sold volume/count? | MLS Area/SubArea, status, period, property type. | MLS area definitions, sold observations, volume/count metrics. | Sold/close or listing basis. | IRES/MLS Area/SubArea. | PARTIALLY SUPPORTED as architecture need; no Area/SubArea source geography contract found. | GEOGRAPHY GAP; SOURCE ADMISSION GAP; METRIC METHODOLOGY GAP. | Geographic Cohort Engine; Market Aggregation Engine. | Agent reports, market comparisons. | BLOCKED BY SOURCE/DATA. |
| New & Sold Activity | Explain inflow and closed activity. | What new listings and sold events occurred in the period? | New/sold status definitions, source, date/event basis, property filters, geography. | New listing and sold/close observations, status event semantics, source freshness. | Listing date for new; close/sold date for sold; not interchangeable. | City/ZIP/neighborhood/MLS area/map polygon. | PARTIALLY SUPPORTED: saved-search new-listing semantics and source freshness are architected; sold activity engine absent. | IMPLEMENTATION GAP; METRIC METHODOLOGY GAP; HISTORICAL DATA GAP. | Market Activity / Status Event Engine; Market Aggregation Engine; Comparative Intelligence Engine. | Agent Market Update, newsletters, saved search, seller/buyer prep. | READY AFTER REPOSITORY-LOCAL WORK for internal new-listing contract; sold history blocked. |

## Reusable Analytical Primitive / Engine Map

| Primitive / engine | Architectural responsibility | Repository foundation | Required next work | Initial consumers |
| --- | --- | --- | --- | --- |
| ATLAS Cohort Engine | Provider-neutral definition of market/property/listing cohorts with explicit filter dimensions, source population, duplicate policy, geography, and event basis. | Property criteria profile; Search filters; canonical identity architecture. | New pure contract MVV. Must separate quick filters, advanced property filters, and expert/source filters. | Agent Market, Search, seller update, newsletter, comparative reports. |
| Market Period / Event Basis | Represents period semantics as event-basis plus range/as-of, not just start/end dates. | Market metric evidence contract; prospective historical observation architecture. | New event-basis enum and validation contract for listing date, pending date, sold/close date, status change date, off-market date, source-modified date, and admitted source-defined bases. | Cohort engine, aggregation, comparison, status events. |
| Market Aggregation Engine | Computes or represents count, sum/volume, min, max, median, average, percent, and sample sufficiency for admitted metrics. | Market metric definition/evidence contract; current market computation modules. | Build side-effect-free aggregation contract before runtime implementation. | Statistics, inventory, regional reports, ZIP profiles, newsletter. |
| Comparative Market Intelligence Engine | Compares Cohort A/B/N with independent filters/event bases and compatible metric definitions. | Prospective historical comparison eligibility architecture. | Create pure comparison contract for absolute delta, percent delta, trend windows, geography/segment comparisons, and fail-closed incompatibility reasons. | Compare Two Years replacement, Market Update 3.0, newsletters, client reports. |
| Market Activity / Status Event Engine | Classifies New, Pending, Sold, Withdrawn, Expired, Back on Market, price change, and other admitted status events. | Saved-search source freshness and new-listing semantics. | Admit status-event semantics and source timestamp basis; avoid assuming IRES meanings. | Hotsheet, New & Sold Activity, saved-search review, Agent updates. |
| Market Duration Engine | Handles DOM/CDOM/other duration metrics only with admitted methodology. | Market metric semantics contract. | Admit DOM/CDOM/DTS/DTO definitions, relist/reset rules, exclusions, population, and period basis. | DOM Analysis, seller prep, buyer prep, Market Update. |
| Inventory / Supply Engine | Point-in-time active/supply and future absorption/months-supply analysis where definitions permit. | Market Product 3 inventory signal and metric contract. | Admit active-status definition and snapshot basis before precise inventory or supply claims. | Inventory, Active Listings Snapshot, seller update, Market Product. |
| Pricing / Sale Relationship Engine | Sale price, list price, original price, price/sq.ft., SP/LP, concessions/terms where admitted. | Property/listing data, Market Product price contexts, metric contract. | Admit price field semantics, original/current/final/close definitions, SP/LP denominator, and rights. | Sold Statistics, seller prep, comparable input, pricing conversations. |
| Property Characteristic Segmentation Engine | Segment cohorts by beds, baths, square feet definitions, year built, lot, garage, construction, water, zoning, remarks/text, photos, and other traits. | Property Criteria Profile; Search controls; listing-shaped Property model. | Extend criteria vocabulary only after field semantics are admitted; preserve multiple square-footage definitions. | Search, seller/buyer prep, listing prep, cohort engine. |
| Geographic Cohort Engine | Resolves city, county, ZIP, subdivision/neighborhood, MLS Area/SubArea, map polygon, and canonical ATLAS geography. | IRES CityID evidence; neighborhood-submarket governance; geographic object contracts. | Add MLS Area/SubArea and ZIP/geography reconciliation contracts; do not map source geography to ATLAS objects without evidence. | Market reports, Search, Agent briefings, regional/ZIP reports. |
| Source / Duplicate Resolution Layer | Handles IRES/RECO/provider populations, source-specific IDs, source observations, duplicate suppression, and canonical identity mapping. | Canonical physical property identity architecture; property source identity architecture; MLS listing source quality. | Define duplicate policy options and evidence requirements; do not assume IRES duplicate hiding equals ATLAS identity. | All market/reporting engines. |
| Report / Presentation Composition Layer | Assembles tables, charts, talking points, narratives, PDFs, prints, and client presentation artifacts from reusable analytics. | Agent briefing composition; newsletter package; protected open-house/comparable/seller-update previews. | Generalize composition input contract with evidence references, limitations, and audience rights. | Agent Workspace, newsletters, client reports, public Market. |
| Operational / Engagement Reporting Primitive | Covers My Transactions, My Listings, MySite, ListTrac, and portal/customer engagement reporting where authorized. | CRM/task foundations; CAO docs; public journey surfaces. | Requires Executive decision, privacy/consent controls, and source admission before implementation. | Agent Workspace and operations reporting. |

## ATLAS Cohort Contract - Architectural Requirements

An ATLAS Market / Property Cohort must be a named, versioned, immutable analytical input. It must not be a loose query-string or a generic date range.

Minimum required fields:

- cohort ID, name, version, and purpose;
- subject class: `PHYSICAL_PROPERTY`, `MLS_LISTING`, `LISTING_EVENT`, `PROPERTY_SOURCE_OBSERVATION`, `MARKET_AGGREGATE_OBSERVATION`, or admitted extension;
- source population: MLS Grid, IRES, RECO, IRES+RECO, repository-local market data, county source, provider source, or admitted composite;
- source admission and rights posture;
- duplicate policy: none, source-native hidden, ATLAS canonical identity, source listing event, or unresolved;
- geography basis: canonical ATLAS geography, source geography, ZIP, county, city, subdivision/neighborhood, MLS Area/SubArea, map polygon, or unresolved;
- temporal basis: event basis plus start/end/as-of/tolerance policy;
- listing status / event status filters;
- property type and listing type filters;
- price, price-per-square-foot, HOA, beds, baths, square-footage basis, lot size, garage, year built, construction, builder/model, water, zoning, main-floor/office, remarks/text, photos/media, geocoding, school, and other admitted dimensions;
- identity bridge requirements when moving between physical property, listing, parcel/account, and provider record;
- metric definitions permitted for the cohort;
- minimum sample and suppression policy;
- evidence references and calculation version;
- fail-closed reasons when required semantics are missing.

Fail-closed semantics:

- Unknown source semantics return `SOURCE_SEMANTICS_UNRESOLVED`.
- Unknown metric definitions return `METRIC_METHODOLOGY_REQUIRED`.
- Missing event basis returns `EVENT_BASIS_REQUIRED`.
- Unadmitted geography mapping returns `GEOGRAPHY_RECONCILIATION_REQUIRED`.
- Unresolved duplicate handling returns `DUPLICATE_POLICY_REQUIRED`.
- Rights/display gaps return `SOURCE_RIGHTS_REQUIRED`.
- Historical comparisons without compatible observations return `HISTORICAL_EVIDENCE_REQUIRED`.

## Comparative Market Intelligence Engine - Requirements

The comparison engine must compare independently defined cohorts:

```text
Comparison = Cohort A + Cohort B + ... Cohort N + compatible metrics + comparison policy
```

Required capabilities:

- independent cohort definitions for each side of the comparison;
- compatible metric-definition verification before calculation;
- explicit event/date basis per cohort;
- absolute delta and percentage delta;
- sample size and suppression handling;
- month vs prior month;
- month vs same month prior year;
- quarter vs prior quarter;
- quarter vs same quarter prior year;
- YTD vs prior YTD;
- trailing-period comparison;
- multi-year trend series;
- market vs market;
- neighborhood vs city;
- subject-property segment vs broader market;
- source and duplicate-policy compatibility checks;
- geography-identity compatibility checks;
- rights and display eligibility checks;
- evidence references on every output.

The engine must reject the IRES Compare Two Years failure mode observed in the controlled benchmark: one retained 2026 listing-date range cannot be treated as a valid 2025 vs 2026 comparison. REIE must retrieve or evaluate two independently defined cohorts and compare compatible metric observations.

## Controlled IRES Benchmark Admission

The following human-observed benchmark values are recorded as controlled external observations for architecture design only. They are not admitted as REIE-calculated facts, not persisted source data, and not public display authority.

Benchmark cohort:

- Entire MLS;
- 2026-01-01 through 2026-08-25;
- Residential-Detached;
- Sold;
- Boulder Area (1);
- Mail City Boulder;
- IRES + RECO;
- duplicates hidden.

Observed IRES values:

- DOM Analysis: 353 sales; Average DOM 46; Average DTS 53; Average DTO 26.
- Sold Statistics: Count 353; Total Volume $583,338,762; High $14,100,000; Low $30,000; Median $1,325,000; SP/LP 97.64%.
- Population split: Listed and Sold 43; Co-Broker 310.
- Other Statistics: New 353; Pending 102; Withdrawn 7; Expired 0; Back On Market 47; Active Listings on 2026-08-25: 0.
- Compare Two Years: 2026 Sold Listings 353; Dollar Volume $583,338,762; Q1 59 / $95,751,393; Q2 198 / $326,844,495; Q3 through 2026-08-25 96 / $160,742,874.

Explicit non-admissions:

- DTS and DTO definitions remain unresolved.
- SP/LP denominator methodology remains unresolved.
- The exact meaning of "New" in the report context remains unresolved.
- Active Listings = 0 is not evidence that Boulder had no active detached inventory.
- IRES duplicate-hidden behavior is not ATLAS canonical identity.
- IRES + RECO population is not assumed to equal the current ATLAS MLS Grid feed.

## Implementation Readiness Matrix

| Candidate capability | Readiness | Reason |
| --- | --- | --- |
| ATLAS Cohort Contract MVV | READY NOW | Pure architecture/contract work can be implemented without source calls, schema changes, or runtime activation. |
| Market Period / Event Basis Contract MVV | READY NOW | Can be defined as a side-effect-free contract with fixture validation. |
| Comparative Market Intelligence Contract MVV | READY NOW | Can define independent cohorts, compatibility, deltas, and fail-closed reasons without calculating live data. |
| Market Aggregation Contract MVV | READY AFTER REPOSITORY-LOCAL WORK | Needs careful integration with metric definitions and cohort contract but can remain fixture-only. |
| Property Characteristic Segmentation Contract | READY AFTER REPOSITORY-LOCAL WORK | Existing criteria vocabulary is a foundation; must add multiple square-footage and professional MLS dimensions conservatively. |
| Agent Hotsheet Preparation Preview | READY AFTER REPOSITORY-LOCAL WORK | Possible as a pure preview using supplied fixture/event observations; production events remain source/data blocked. |
| Active Listings Snapshot Internal Contract | READY AFTER REPOSITORY-LOCAL WORK | Can define snapshot semantics; live accuracy requires source freshness and active-status admission. |
| New Listing Activity Internal Contract | READY AFTER REPOSITORY-LOCAL WORK | Saved-search freshness and new-listing semantics are close, but broader event semantics need admission. |
| Open-House Agent Preparation | READY NOW | Already certified for protected internal factual preparation; future context enrichment requires separate authorization. |
| Comparable Input Agent Preview | READY NOW | Already certified for explicit, bounded, read-only internal comparison preparation; not a CMA/pricing engine. |
| Seller Update Preparation Preview | READY NOW | Already certified for explicit, bounded, read-only internal prep; no prior baseline or market runtime yet. |
| Recurring Market Newsletter Review Package | READY NOW for Boulder review package | Already certified as Boulder-only Agent review package; comparison/activity metrics remain insufficient. |
| DOM/CDOM/DTS/DTO Analytics | BLOCKED BY METHODOLOGY | Requires authoritative definitions, relist/reset rules, event basis, population/exclusions, and rights. |
| SP/LP and Sale/List Relationship Analytics | BLOCKED BY METHODOLOGY | Requires denominator and price-field semantics before derived reporting. |
| Two-Year / YoY / Trend Reporting from live history | BLOCKED BY SOURCE/DATA | Requires admitted historical observations or authorized historical data acquisition and comparison policy. |
| IRES + RECO combined population reporting | BLOCKED BY SOURCE/DATA | Current MLS Grid feed equivalence is not proven; IRES/RECO source population must be admitted. |
| MLS Area/SubArea reporting | BLOCKED BY SOURCE/DATA | Source geography identity and mapping to ATLAS geography are not certified. |
| CAR Housing Statistics alignment | BLOCKED BY RIGHTS | Requires CAR methodology, attribution, and usage rights. |
| Sales Terms analytics | BLOCKED BY SOURCE/DATA and RIGHTS | Requires terms field availability, methodology, and permitted use. |
| My Transactions / My Listings / portal usage reporting | BLOCKED BY EXECUTIVE DECISION | Requires customer/transaction/engagement authority, privacy controls, and source/data decisions. |
| OneHomeowner-style homeowner reporting | BLOCKED BY EXECUTIVE DECISION | Requires homeowner/customer data policy, canonical property identity admission, and rights. |

## Proposed Implementation Waves

Wave 1 - Contract foundation, no runtime activation:

- implement `ATLAS_COHORT_CONTRACT_MVV`;
- implement `MARKET_PERIOD_EVENT_BASIS_CONTRACT_MVV`;
- implement `COMPARATIVE_MARKET_INTELLIGENCE_CONTRACT_MVV`;
- include fixture-only validation for independent cohort definitions and fail-closed comparisons.

Wave 2 - Safe Agent-labor replacement from supplied/admitted observations:

- implement a pure Market Aggregation Contract;
- implement a pure Market Activity / Status Event Contract using supplied fixture observations;
- extend Agent briefing composition to accept cohort/metric/evidence packages without live provider calls;
- keep outputs Agent-only and professional-review-required.

Wave 3 - Source methodology admission:

- admit authoritative DOM/CDOM/DTS/DTO, status event, price, SP/LP, active inventory, and original/current/final/close price semantics;
- admit source population boundaries for IRES, RECO, MLS Grid, and any combined population;
- admit duplicate policy and historical retention constraints;
- keep this as evidence/methodology work until separately authorized implementation.

Wave 4 - Historical aggregate observation implementation:

- implement bounded aggregate-only historical observation persistence only after schema/migration authorization;
- write certified derived aggregate observations from certified computations, not raw MLS payload copies;
- establish comparison tolerance, sample sufficiency, invalidation, and audit policy.

Wave 5 - Protected Agent reporting previews:

- add internal Hotsheet, Inventory Snapshot, Sold/Status Statistics, and Compare Cohorts previews;
- use explicit cohorts, admitted metrics, visible limitations, and no customer communication authority;
- validate admin/auth/noindex/read-only/no-write boundaries.

Wave 6 - Client/report composition:

- produce PDF/print/client presentation packages only after rights/display authority and professional review workflow are certified;
- keep public display, email, CRM, saved reports, customer targeting, and scheduler activation behind separate gates.

## Certification / Status Recommendation

Recommended Phase 1 statuses:

- `IRES_AGENT_REPORTING_CAPABILITY_RECONCILIATION_PHASE_1_ARCHITECTURE_CERTIFIED`
- `ATLAS_REUSABLE_ANALYTICAL_PRIMITIVE_ARCHITECTURE_RECOMMENDED`
- `ATLAS_COHORT_CONTRACT_REQUIRED`
- `MARKET_PERIOD_EVENT_BASIS_REQUIRED`
- `COMPARATIVE_MARKET_INTELLIGENCE_CONTRACT_REQUIRED`
- `SOURCE_METHODOLOGY_ADMISSION_STILL_REQUIRED`
- `PROPERTY_IDENTITY_SOURCE_ADMISSION_REQUIRED`
- `STATEWIDE_PROPERTY_IDENTITY_DATA_REQUIRED`
- `HISTORICAL_MLS_USE_RECONCILIATION_REQUIRED`
- `IRES_RECO_POPULATION_EQUIVALENCE_NOT_PROVEN`
- `IRES_DUPLICATE_SUPPRESSION_NOT_ATLAS_IDENTITY`
- `NO_RUNTIME_IMPLEMENTATION_AUTHORIZED`
- `NO_PROVIDER_OR_DATABASE_ACTIVITY_AUTHORIZED`

Recommended next authorization gate:

`READY_FOR_ATLAS_COHORT_AND_COMPARATIVE_MARKET_INTELLIGENCE_CONTRACT_MVV_AUTHORIZATION`

This next gate should authorize pure, deterministic, side-effect-free contract work only. It should not authorize provider calls, source activation, database migration, schema change, live MLS/IRES retrieval, historical data acquisition, Typesense mutation, CRM/customer-data mutation, email, public rendering, deployment, or Vercel activity.

## Executive Decisions Required

Before REIE can replace the recurring Agent reporting labor represented by IRES, Executive decisions are required on:

- whether ATLAS should prioritize pure cohort/comparison contracts before any report preview;
- which source populations are in scope: current MLS Grid only, IRES, RECO, IRES+RECO, county/provider observations, or admitted composites;
- whether and when to authorize source methodology admission for DOM/CDOM/DTS/DTO, status events, price fields, SP/LP, duplicate policy, and historical retention;
- whether to authorize historical aggregate observation persistence;
- whether Agent-only protected previews should precede client-facing report composition;
- which usage surfaces are allowed for each metric: Agent preparation, client professional report, public display, email/newsletter, or internal operations only;
- whether operational/client reports such as My Transactions, My Listings, MySite Activity, ListTrac, and OneHomeowner are in scope for the next ATLAS wave.

## Boundary Certification

This Phase 1 package made no production deployment, Vercel deployment, Supabase/database mutation, schema migration, MLS sync, provider mutation, Typesense mutation, email/CRM mutation, secret/key mutation, external outreach, runtime implementation, customer-data access, Search activation, public-route change, or authorization expansion.
