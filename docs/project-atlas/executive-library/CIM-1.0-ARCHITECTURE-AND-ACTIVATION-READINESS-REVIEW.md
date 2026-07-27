# PROJECT ATLAS(tm) - CIM 1.0 Architecture and Activation Readiness Review(tm)

Status: `CIM_1_0_ARCHITECTURE_AND_ACTIVATION_READINESS_REVIEW_COMPLETE_IMPLEMENTATION_NOT_AUTHORIZED`

Date: July 27, 2026

## 1. Executive Summary

Customer Intelligence and Measurement 1.0 is the recommended successor to the completed CEP 1.0 foundational customer-experience program.

CEP 1.0 produced five certified production sprints and established a coherent public journey:

`Search -> Property -> Market -> Seller -> Navigation Continuity`

CIM 1.0 defines how PROJECT ATLAS should measure that journey without changing customer-facing functionality. The repository already contains reusable measurement assets, but it does not yet contain an approved customer-behavior telemetry system.

Final review outcome:

`CIM_1_0_ARCHITECTURE_AND_ACTIVATION_READINESS_REVIEW_COMPLETE_IMPLEMENTATION_NOT_AUTHORIZED`

Implementation readiness decision:

`CIM_1_0_READY_FOR_SPRINT_1_ARCHITECTURE_IMPLEMENTATION_NOT_ACTIVATION`

Activation readiness decision:

`CIM_1_0_MEASUREMENT_ACTIVATION_NOT_READY`

Recommended Sprint 1:

`CIM_1_0_SPRINT_1_EVENT_TAXONOMY_AND_MEASUREMENT_CONTRACT`

This document does not authorize runtime implementation, analytics activation, telemetry activation, cookies, tracking systems, provider integration, deployment, production mutation, database changes, new persistence, or CIM Sprint 1 implementation.

## 2. Program Purpose

CIM 1.0 exists to govern customer intelligence before measurement is activated.

The program should answer:

- Which customer actions should PROJECT ATLAS measure?
- Which events can be measured with current passive handles?
- Which measurements require new persistence or external analytics?
- Which KPIs are customer, business, or enterprise KPIs?
- Which measurements are privacy-sensitive?
- Which measurements require consent or opt-out controls?
- Which activation boundaries must be cleared before telemetry is enabled?
- Which future enterprise programs depend on measured evidence?

CIM 1.0 must preserve the distinction between:

- measurement readiness
- measurement contract
- telemetry activation
- persistence
- reporting
- interpretation
- executive decisioning

Readiness does not equal activation.

## 3. Relationship to CEP

CEP 1.0 is complete as the foundational customer-experience program.

CEP 1.0 supplied the customer-facing surfaces and passive measurement handles that CIM can govern:

| CEP sprint | Customer surface | Measurement relevance |
| --- | --- | --- |
| Sprint 1 | Search and Map Experience | Search initiation, refinement, result engagement, map/list engagement, zero-result recovery, degraded-state awareness. |
| Sprint 2 | Property Intelligence Experience | Property view, property decision brief engagement, source/freshness trust engagement, related listing engagement. |
| Sprint 3 | Conversion and Seller Acquisition | Inquiry intent, tour intent, valuation intent, seller journey engagement, recovery path usage. |
| Sprint 4 | Market Intelligence Experience | City market engagement, neighborhood market engagement, market-to-search path, market-to-seller path. |
| Sprint 5 | Navigation, Conversion, and Measurement | Cross-journey continuity, `/market` discovery, passive journey measurement attributes, CTA consistency. |

CIM should not reopen CEP 1.0 implementation. It should establish a governed measurement architecture that can later evaluate the certified CEP journey.

## 4. Repository Inventory

Repository evidence reviewed:

- `lib/customerJourneyMeasurement.ts`
- `app/market/page.tsx`
- `app/market/[city]/page.tsx`
- `app/market/[city]/[slug]/page.tsx`
- `app/properties/[id]/page.tsx`
- `app/sell/page.tsx`
- `components/search/SearchInterface.tsx`
- `components/maps/MapSidebar.tsx`
- `components/Footer.tsx`
- `components/HomeValueEstimator.tsx`
- `app/api/track-click/route.ts`
- `lib/tracking/store.ts`
- `lib/analytics/trackBehavior.ts`
- `lib/analytics/getLeadPerformance.ts`
- `lib/analytics/getVariantPerformance.ts`
- `lib/enterprise-kpi/registry.ts`
- `lib/enterprise-kpi/*`
- `app/admin/repository/enterprise-kpis/*`
- `app/admin/repository/executive-command-center/page.tsx`
- `app/privacy/page.tsx`
- `components/PropertyInquiryForm.tsx`
- `components/maps/SaveSearch.tsx`
- `components/LeadCapture.tsx`
- `scripts/checkCepNavigationConversionMeasurementBaseline.ts`
- `scripts/checkEnterpriseKpiSafety.ts`
- `scripts/checkTrackClickSafety.ts`
- `scripts/checkTrackClickRuntimeSafety.ts`
- `scripts/publicExperienceSmoke.ts`
- `package.json`
- `docs/project-atlas/executive-library/CEP-1.0-STRATEGIC-COMPLETION-REVIEW.md`
- `docs/project-atlas/executive-library/CEP-1.0-SPRINT-5-NAVIGATION-CONVERSION-AND-MEASUREMENT-BASELINE.md`

Reusable capability inventory:

| Capability | Evidence | Reusable for CIM | Activation posture |
| --- | --- | --- | --- |
| Passive journey attributes | `lib/customerJourneyMeasurement.ts`; CEP Sprint 5 surfaces | Yes | Ready but inactive |
| Journey stage/action taxonomy seed | `customerJourneyStages`, `customerJourneyActions` | Yes | Needs CIM contract hardening |
| Passive route-level handles | `/search`, `/market`, property, seller, market pages | Yes | Present without telemetry |
| Existing click-tracking route | `app/api/track-click/route.ts` | Limited | Mutation-bearing; not safe for CIM activation without governance |
| Tracking store | `lib/tracking/store.ts` | Limited | Writes `UserInteraction`, updates alert clicks and heat score |
| Forensic interaction helper | `lib/analytics/trackBehavior.ts` | No direct Sprint 1 use | Writes lead interactions; not approved for customer behavior activation |
| Lead performance read helper | `lib/analytics/getLeadPerformance.ts` | Yes for future reporting architecture | Reads seller leads; requires data-access governance |
| Variant performance read helper | `lib/analytics/getVariantPerformance.ts` | Yes for future experimentation governance | Reads seller leads; requires data-access governance |
| Enterprise KPI registry | `lib/enterprise-kpi/registry.ts` | Yes | Many customer/business KPIs are defined but unavailable |
| Enterprise KPI admin surfaces | `app/admin/repository/enterprise-kpis/*` | Yes for internal reporting pattern | Admin/protected; not customer analytics activation |
| Executive command center | `app/admin/repository/executive-command-center/page.tsx` | Yes for future reporting pattern | Existing internal surface; no new CIM activation |
| Privacy notice | `app/privacy/page.tsx` | Yes | Needs CIM-specific analytics/cookie/consent review before activation |
| Consent notices | inquiry, saved search, lead capture components | Yes as evidence of form consent patterns | Not sufficient for behavioral telemetry activation |
| Sprint 5 safety guard | `scripts/checkCepNavigationConversionMeasurementBaseline.ts` | Yes | Verifies measurement remains inactive |
| Public smoke coverage | `scripts/publicExperienceSmoke.ts` | Yes for route availability evidence | Not telemetry evidence |

## 5. Existing Measurement Capability

Existing capabilities fall into four classes.

### Class 1: Passive, Non-Mutating Readiness

The strongest CIM starting point is the Sprint 5 passive measurement layer:

- `data-cep-measurement-ready="true"`
- `data-cep-measurement-active="false"`
- `data-cep-measurement-surface`
- `data-cep-journey-stage`
- `data-cep-journey-action`
- `data-cep-journey-destination`

This supports architecture review and event-taxonomy design without collecting events.

### Class 2: Existing Mutation-Bearing Tracking

The repository includes pre-existing tracking behavior:

- `app/api/track-click/route.ts`
- `lib/tracking/store.ts`
- `lib/analytics/trackBehavior.ts`

These are not safe activation paths for CIM without separate authorization because they can write interaction records, update alert-click state, update heat score, or create lead interactions.

### Class 3: Existing Read-Based Reporting Helpers

The repository includes read helpers:

- `getLeadPerformance`
- `getVariantPerformance`

These can inform reporting architecture, but production use requires data-access, privacy, and purpose-limitation governance.

### Class 4: Enterprise KPI Framework

The enterprise KPI registry already distinguishes fixture-backed, unavailable, and governed KPI states. Several customer and business KPIs are explicitly defined but unavailable because no approved telemetry source exists.

CIM should reuse this pattern instead of inventing a separate measurement truth model.

## 6. Analytics Helper Inventory

| Helper or route | Behavior | CIM classification | Notes |
| --- | --- | --- | --- |
| `getJourneyMeasurementAttributes` | Emits passive `data-*` attributes with active flag set to false | Reusable architecture seed | Does not submit events or persist data. |
| `customerJourneyStages` | Defines search, property, market, seller, inquiry stages | Reusable taxonomy seed | Needs expansion only through authorized Sprint 1. |
| `customerJourneyActions` | Defines start-search, view-property, view-market, seller review, property question, continue journey | Reusable taxonomy seed | Needs governed event names and payload limits. |
| `/api/track-click` | Redirects and conditionally calls click tracking | Existing mutation-bearing route | Not a CIM activation target without explicit authorization. |
| `trackClick` | Writes `UserInteraction`, updates alert click state, can update heat score | Existing mutation-bearing tracking | Requires privacy, consent, persistence, and CRM/alert boundary review. |
| `trackForensicInteraction` | Creates lead interaction records | Existing mutation-bearing analytics | Not authorized for customer telemetry activation. |
| `getLeadPerformance` | Reads seller lead totals/contacted/converted | Reporting helper | Requires authorized read context. |
| `getVariantPerformance` | Reads seller lead performance by variant | Reporting helper | Requires experimentation governance before use. |
| `ENTERPRISE_KPI_REGISTRY` | Defines platform, search, customer, operations, business, growth, and governance KPIs | Reusable governance framework | Many customer/business KPIs remain unavailable by design. |
| `checkCepNavigationConversionMeasurementBaseline` | Verifies passive measurement and no activation | Safety guard | Should be preserved as a non-activation guard. |

## 7. KPI Inventory

Classification key:

- `MEASURABLE_NOW`: supported by existing non-mutating evidence or certified records without new persistence.
- `MEASURABLE_AFTER_ACTIVATION`: passive/event handles exist, but telemetry must be authorized.
- `REQUIRES_INFRASTRUCTURE`: needs event collector, storage, analytics vendor, logs, dashboard source, or identity/session system.
- `REQUIRES_GOVERNANCE`: needs privacy, consent, retention, data-use, or executive KPI approval before collection or interpretation.
- `DEFERRED`: should not be pursued until prior architecture or governance work is complete.

### Customer KPIs

| KPI | Classification | Current evidence | Activation requirement |
| --- | --- | --- | --- |
| Search engagement | `MEASURABLE_AFTER_ACTIVATION` | Passive search journey handles; `KPI-CUST-003` defined but unavailable | Event taxonomy, consent/privacy review, collector authorization |
| Property engagement | `MEASURABLE_AFTER_ACTIVATION` | Passive property journey handles; `KPI-CUST-004` defined but unavailable | Property-view event contract and activation |
| Market engagement | `MEASURABLE_AFTER_ACTIVATION` | `/market`, city, and neighborhood passive handles | Market-view event contract and activation |
| Seller engagement | `MEASURABLE_AFTER_ACTIVATION` | `/sell` passive handles and seller-intake surface | Seller-intent taxonomy and form-boundary governance |
| CTA engagement | `MEASURABLE_AFTER_ACTIVATION` | Passive journey action and destination attributes | CTA event contract and deduplication rules |
| Journey completion | `REQUIRES_INFRASTRUCTURE` | Cross-surface handles exist | Session/identity model, event sequencing, persistence |
| Abandonment | `REQUIRES_INFRASTRUCTURE` | No governed session telemetry | Session timeout model and consent review |
| Return visits | `REQUIRES_INFRASTRUCTURE` | `KPI-CUST-005` defined but unavailable | Identity/session governance, cookie or server-side alternative review |

### Business KPIs

| KPI | Classification | Current evidence | Activation requirement |
| --- | --- | --- | --- |
| Inquiry rate | `REQUIRES_GOVERNANCE` | Property inquiry flow exists; form submission is mutation-bearing | Read model, denominator definition, consent/purpose review |
| Tour request rate | `REQUIRES_GOVERNANCE` | Tour intent is represented in inquiry flow | Event taxonomy and mutation-boundary separation |
| Valuation request rate | `REQUIRES_GOVERNANCE` | Seller review/valuation flow exists | Seller lead read governance and denominator definition |
| Seller conversion | `REQUIRES_GOVERNANCE` | `getLeadPerformance` reads contacted/converted seller leads | CRM/seller-lead data-use approval |
| Buyer conversion | `REQUIRES_INFRASTRUCTURE` | Inquiry/tour surfaces exist | Buyer lead attribution model and event store |
| Lead attribution | `REQUIRES_INFRASTRUCTURE` | Existing click-tracking and lead helpers exist | First-touch/last-touch model, persistence, privacy review |
| Conversion funnel | `REQUIRES_INFRASTRUCTURE` | Certified journey surfaces exist | Session/event sequence model and reporting store |

### Enterprise KPIs

| KPI | Classification | Current evidence | Activation requirement |
| --- | --- | --- | --- |
| Architecture reuse | `MEASURABLE_NOW` | Documentation, route/component inventory, governed sprint records | Manual governance review is sufficient for now |
| Shared component usage | `MEASURABLE_NOW` | Repository inventory and static review | Static analysis can support planning without runtime telemetry |
| Production stability | `MEASURABLE_NOW` | `KPI-PLAT-001`, `KPI-PLAT-002`, smoke/certification records | Governed route checks; automated telemetry later optional |
| Accessibility | `MEASURABLE_NOW` | Sprint certification records and local review evidence | Further automation would require separate implementation |
| Regression coverage | `MEASURABLE_NOW` | package scripts and sprint safety checks | Static/test inventory can be measured now |
| Governance compliance | `MEASURABLE_NOW` | `KPI-GOV-001` fixture-backed registry pattern and docs | Repository governance audit |
| Search runtime health | `MEASURABLE_NOW` for deterministic checks; `MEASURABLE_AFTER_ACTIVATION` for live trend | `KPI-SRCH-001`, search runtime adapter safety | Live trend requires authorized observation source |

## 8. Privacy Model

CIM should adopt a privacy-by-design model:

- collect the minimum event payload required for a governed KPI
- avoid raw search text unless separately governed
- avoid sensitive financial, negotiation, family, protected-class, or confidential preference data
- avoid user-level tracking until identity, consent, retention, access, deletion, and opt-out rules are approved
- preserve the current public/private intelligence boundary
- keep CRM, alerts, saved search, inquiry, seller-lead, and email workflows separate from measurement unless explicitly authorized
- treat IP address, device identifiers, cookies, session identifiers, email identifiers, and raw query strings as sensitive until governed

The current privacy notice acknowledges existing public forms, saved-search and digest email click tracking, and unresolved external approval items for cookies, analytics, security contacts, data sale, targeted advertising, retention, deletion, correction, portability, and opt-out handling.

CIM activation cannot proceed until those boundaries are resolved for the selected measurement design.

## 9. Consent Model

Existing repository evidence includes consent notices around forms:

- property inquiry
- saved search
- lead capture
- seller intake paths

Those notices are form-purpose notices. They are not sufficient by themselves to authorize broad behavioral telemetry.

CIM should define consent states before activation:

| Consent state | Meaning | Activation posture |
| --- | --- | --- |
| `NO_TELEMETRY` | No behavioral event collection | Current safe state |
| `STRICTLY_NECESSARY` | Route health and security logging only | Requires legal/privacy confirmation |
| `FIRST_PARTY_ANALYTICS` | First-party product analytics with minimized payloads | Requires consent/privacy approval and technical guardrails |
| `ATTRIBUTION_ANALYTICS` | Lead/source attribution across journeys | Requires stronger consent, retention, and CRM boundary review |
| `EXTERNAL_VENDOR_ANALYTICS` | Third-party analytics platform | Requires vendor, DPA, cookie, consent, and legal review |

Until a consent model is approved, CIM must remain architecture-only.

## 10. Activation Boundaries

CIM activation requires separate authorization for each boundary crossed.

| Boundary | Current state | Requirement before activation |
| --- | --- | --- |
| Passive attributes | Present and inactive | Sprint 1 can formalize taxonomy only if authorized |
| Event collector | Not authorized | Event contract, minimization, failure behavior, tests |
| New persistence | Not authorized | Database/schema authorization, retention policy, migration review |
| Existing tracking route reuse | Not authorized for CIM | Mutation, CRM, alert, heat-score, unsubscribe, and privacy review |
| Cookies/session identifiers | Not authorized | Consent model and privacy notice update |
| External analytics vendor | Not authorized | Vendor governance, DPA/legal review, consent implementation |
| Lead attribution | Not authorized | Attribution model and CRM/seller-lead boundary review |
| Dashboards | Internal patterns exist | Read-only source and authorization boundary |
| Production activation | Not authorized | Deployment and production certification review |

## 11. Production Safety Model

CIM must fail closed.

Safety requirements:

- measurement inactive by default
- no event submission unless an activation flag and authorization gate are both present
- no raw query capture unless separately governed
- no protected intelligence in event payloads
- no credentials, stack traces, provider details, or internal diagnostics in customer-visible output
- no writes to CRM, alerts, seller leads, inquiries, tours, valuations, users, or heat scores unless explicitly authorized
- no external analytics requests unless separately authorized
- no GIS, AI, provider, or new data-source activation
- no production mutation during architecture or readiness review

Current safe posture:

`MEASUREMENT_READY_PASSIVE_INACTIVE`

## 12. Measurement Architecture

Recommended CIM architecture:

1. Measurement Surface Registry

   Defines governed surfaces such as search, property, market, seller, inquiry, saved search, and navigation.

2. Event Taxonomy Contract

   Defines event names, stages, actions, destinations, allowed payload keys, sensitive-field exclusions, and event versions.

3. Consent and Privacy Gate

   Determines whether an event class is eligible for collection and under which public notice or consent posture.

4. Activation Gate

   Keeps each event family inactive until explicitly authorized, implemented, validated, deployed, and certified.

5. Collection Adapter

   Future implementation only. Could be first-party or vendor-backed, but no adapter is authorized by this review.

6. Persistence or Reporting Source

   Future implementation only. Must define retention, deletion, access control, and source-of-truth rules.

7. KPI Mapping Layer

   Maps event evidence to governed KPIs, reusing `lib/enterprise-kpi/registry.ts` patterns.

8. Executive Reporting Layer

   Future read-only dashboard or report. Should reuse enterprise KPI internal patterns once data sources are governed.

## 13. Readiness Assessment

| Area | Readiness | Evidence | Notes |
| --- | --- | --- | --- |
| Architecture readiness | `READY_FOR_SPRINT_1` | Passive attributes, enterprise KPI framework, certified CEP journey | Sprint 1 should formalize contracts only. |
| Activation readiness | `NOT_READY` | No approved telemetry source, no consent model, no persistence authorization | Activation must remain prohibited. |
| KPI readiness | `PARTIAL` | Enterprise KPIs exist; many customer/business KPIs unavailable | CIM must classify and map KPIs. |
| Privacy readiness | `PARTIAL` | Privacy page exists with unresolved external approval items | Needs analytics/cookie/consent decisions. |
| Consent readiness | `PARTIAL` | Form notices exist | Behavioral telemetry consent is not governed. |
| Reporting readiness | `PARTIAL` | Enterprise KPI admin/internal patterns exist | Needs governed source data. |
| Production safety readiness | `READY_FOR_NON_ACTIVATING_REVIEW` | Sprint 5 guard verifies measurement inactive | Must add future CIM guards before activation. |

## 14. Risks

| Risk | Severity | Mitigation |
| --- | --- | --- |
| Passive readiness confused with active analytics | High | Preserve `data-cep-measurement-active="false"` until separate activation. |
| Existing click-tracking route reused too broadly | High | Treat `/api/track-click` as mutation-bearing and out of Sprint 1 activation scope. |
| Raw search text captured without governance | High | Exclude raw query capture unless separately authorized. |
| Journey tracking creates personal profiling | High | Require privacy, consent, minimization, retention, and opt-out model. |
| KPI dashboards imply unavailable facts are known | Medium | Reuse defined-but-unavailable KPI states. |
| CRM/seller/alert data blended into analytics without approval | High | Keep mutation-bearing business systems separate from measurement activation. |
| External analytics vendor added without governance | High | Require vendor and legal review before any external script or endpoint. |
| AI or GIS programs depend on unmeasured assumptions | Medium | Require CIM evidence before those programs enter implementation. |

## 15. Deferred Capabilities

Deferred until separate authorization:

- telemetry collector implementation
- analytics activation
- cookies or browser storage
- external analytics vendor integration
- new event persistence
- schema changes or migrations
- lead attribution activation
- behavioral profile creation
- session tracking
- return-visitor identification
- funnel dashboard backed by live customer data
- raw search-text capture
- experiment assignment or variant optimization
- AI guidance activation
- GIS activation
- provider data activation
- CRM, alert, email, seller-lead, inquiry, tour, or valuation workflow changes

## 16. Recommended Sprint Sequence

Recommended CIM sequence:

| Sprint | Name | Purpose | Activation state |
| --- | --- | --- | --- |
| Sprint 1 | Event Taxonomy and Measurement Contract | Define governed surfaces, events, payload limits, KPI mapping, privacy exclusions, and activation gates. | No activation |
| Sprint 2 | Privacy, Consent, and Data-Minimization Gate | Resolve consent posture, privacy notice requirements, retention, opt-out, sensitive field exclusions, and raw-query policy. | No activation |
| Sprint 3 | First-Party Measurement Readiness Adapter | Build non-sending local adapter and deterministic guards, if separately authorized. | Local inactive only |
| Sprint 4 | Reporting and KPI Mapping Readiness | Map governed events to enterprise KPIs and define read-only report shape. | No production activation |
| Sprint 5 | Controlled Activation Pilot | Only if legal/privacy/data/persistence gates pass. | Limited activation subject to separate authorization |

Recommended Sprint 1 identifier:

`CIM_1_0_SPRINT_1_EVENT_TAXONOMY_AND_MEASUREMENT_CONTRACT`

Sprint 1 should produce documentation, contracts, and deterministic safety checks only if separately authorized. It should not collect, submit, persist, or report customer behavioral events.

## 17. Activation Prerequisites

Before any CIM measurement activation:

- executive authorization for the exact measurement scope
- approved event taxonomy
- approved sensitive-field exclusions
- privacy review
- consent model decision
- cookie/browser-storage decision
- raw-search-text policy
- retention and deletion policy
- opt-out/access/correction policy
- data-access owner and steward
- source-of-truth decision
- persistence authorization, if any
- database/schema review, if any
- external vendor/legal review, if any
- deterministic safety guards
- local validation
- deployment authorization
- non-mutating production certification

## 18. Executive Recommendation

Required decisions:

1. Is CIM ready for implementation?

   Yes, but only for a non-activating Sprint 1 architecture implementation that defines event taxonomy, payload boundaries, KPI mapping, privacy exclusions, and activation gates. CIM is not ready for measurement activation.

2. What must occur before activation?

   David must separately authorize privacy review, consent model decisions, event collection architecture, persistence or no-persistence design, retention policy, opt-out handling, analytics/vendor posture, deterministic safety checks, deployment, and production certification.

3. What should become Sprint 1?

   `CIM_1_0_SPRINT_1_EVENT_TAXONOMY_AND_MEASUREMENT_CONTRACT`

4. Which work must remain prohibited?

   Analytics activation, telemetry activation, cookies, external vendors, new persistence, schema changes, production mutation, provider activation, GIS, AI, CRM changes, seller-lead changes, alert/email changes, inquiry/tour/valuation backend changes, and customer-facing runtime changes.

5. Which future programs depend upon CIM?

   - Community and Neighborhood Intelligence
   - Market Intelligence Expansion
   - AI-Grounded Customer Guidance
   - Navigation Optimization
   - Conversion Optimization
   - Lead Attribution and Revenue Intelligence

Final executive recommendation:

Authorize only `CIM_1_0_SPRINT_1_EVENT_TAXONOMY_AND_MEASUREMENT_CONTRACT` as a separate, non-activating architecture sprint if David wants to proceed.

Do not authorize measurement activation until the activation prerequisites are complete.

## 19. Stop Conditions

Codex stopped before:

- CIM Sprint 1 implementation
- analytics activation
- telemetry activation
- cookies
- deployment
- production mutation
- database changes
- new persistence
- provider activation
- GIS
- AI
- unrelated work
