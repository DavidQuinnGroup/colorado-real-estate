# REIE Agent Work Replacement Phase 2 Candidate Feasibility

Program: `REIE_AGENT_WORK_REPLACEMENT_PHASE_2_CANDIDATE_SELECTION_AND_FEASIBILITY`

Date: 2026-08-13

Repository: `/Users/davidquinn/david-quinn-group/colorado-real-estate`

Canonical baseline before documentation: `HEAD = origin/main = 8b0a89bb954a0f69d636a7ea2ec2ccf6479bf422`, divergence `0 ahead / 0 behind`, working tree clean.

Status: `REIE_AGENT_WORK_REPLACEMENT_PHASE_2_CANDIDATE_FEASIBILITY_COMPLETE_LOCAL_DOCS_ONLY`

Primary next implementation candidate: `RECURRING_SOURCE_FRESH_MARKET_NEWSLETTER_AGENT_REVIEW_PACKAGE`

Secondary / follow-on candidate: `SAVED_SEARCH_ALERT_CADENCE_AND_CHANGED_LISTING_FOLLOW_UP_CERTIFICATION_AFTER_EXPLICIT_PROTECTED_SYSTEM_AUTHORIZATION`

Recommended next gate: `READY_FOR_RECURRING_MARKET_NEWSLETTER_AGENT_REVIEW_PACKAGE_IMPLEMENTATION_AUTHORIZATION`

## Scope Boundary

This review is candidate selection, feasibility, and bounded implementation definition only. It did not implement the winning candidate, modify runtime code, modify Prisma schema, run migrations, mutate production data, activate workers, activate queues, send email, activate notifications, mutate CRM, modify customer data, modify MLS, modify Typesense, modify Vercel, call LightBox, retrieve LightBox credentials, investigate ATTOM, activate county sources, or deploy.

Provider gates remain unchanged:

- LightBox: `WAITING_FOR_LIGHTBOX_SUPPORT_AUTH_SCOPE_CONFIRMATION`
- LightBox evaluation API calls consumed: `0`
- ATTOM: `PENDING_PROVIDER_RESPONSE`
- County assessor/source operations: separate dedicated workstream

## Governing Question

Which provider-independent Agent Labor Replacement capability should PROJECT ATLAS implement next to produce the greatest incremental reduction in repetitive agent work while maximizing reuse of existing certified REIE architecture and minimizing duplication, operational risk, compliance risk, and protected-system expansion?

## Executive Disposition

The strongest next implementation is not email distribution, not a new market product, and not provider/public-record retrieval. It is a small, non-sending, agent-review market/newsletter package generator that assembles a source-fresh weekly/monthly package from existing certified REIE market, city, neighborhood, search, article, and source-transparency foundations.

The minimum valuable implementation should produce an internal package artifact for agent review:

- market snapshot;
- city / neighborhood highlights;
- current inventory and price-context signals from existing REIE data where available;
- listing activity sections only where existing fields support them;
- reusable customer explanations;
- chart/table-ready data;
- explicit source/freshness/limitation notes;
- editorial approval checklist;
- no email sending;
- no scheduler activation;
- no customer personalization;
- no new provider access.

## Candidate 1 Current Posture

Candidate: recurring source-fresh market / newsletter package.

Current repository posture:

- Market Product 3.0 is production-certified for `/market` and selected city market routes.
- Market briefing foundation and city market briefing are production-certified through DXT Wave 1D.
- `app/market/page.tsx` and `app/market/[city]/page.tsx` render decision-oriented market context, source-freshness cues, city summaries, city market stats, market decision workspaces, and links back to Search / Property / Seller paths.
- `lib/cities.ts`, `lib/marketIntelligenceExperience.ts`, `lib/marketProduct3.ts`, `lib/marketDecisionWorkspace.ts`, `components/CityMarketStats.tsx`, and `components/MarketProduct3VisualIntelligence.tsx` already provide reusable deterministic market-intelligence foundations.
- `lib/articles.ts` already generates programmatic local-market articles from governed neighborhood data.
- `lib/content/generateMarketArticle.ts`, `lib/content/publishArticle.ts`, `lib/content/scheduleContent.ts`, and `lib/content/generateBuyerGuide.ts` are currently empty, while `lib/content/generateNeighborhoodArticle.ts` is non-empty. This is a meaningful content/workflow gap.
- `docs/email-system.md` documents email, digest, alert, and recurring traffic controls, but Candidate 1 should not start with email delivery.

Sub-capability disposition:

| Sub-capability | Finding |
| --- | --- |
| Data / intelligence generation | `PARTIAL_GAP`; market, city, neighborhood, article, and source-transparency primitives exist. Package assembly does not. |
| Content composition | `GENUINE_NEW_CAPABILITY`; empty content files and missing package workflow show room for a bounded generator. |
| Agent review workflow | `PARTIAL_GAP`; editorial approval and review boundaries exist in docs, but no concrete package checklist/output exists for this use. |
| Chart/table generation | `PARTIAL_GAP`; public components calculate/present market stats, but reusable internal export/package tables are absent. |
| Scheduled refresh | `ACTIVATION_GAP`; not required for MVV and should remain out of scope. |
| Email delivery / distribution | `ALREADY_EXISTS` as infrastructure but `OUT_OF_SCOPE`; using it would raise protected-system risk unnecessarily. |

High-value missing capability: recurring package assembly and approval-ready content composition, not email delivery.

## Candidate 2 Current Posture

Candidate: saved-search alert cadence and changed-listing follow-up.

Current repository posture:

- `SavedSearch`, `AlertEvent`, `AlertQueue`, `UnsubscribeToken`, and `EmailLog` models exist.
- `app/api/save-search/route.ts` persists saved search intake, captures alert-readiness metadata, updates user heat score, creates `UserInteraction`, and conditionally creates a CRM task.
- `lib/alerts/matchSavedSearches.ts` matches active saved searches against listing city, price, beds, type, and map bounds.
- `lib/alerts/processAlertQueue.ts`, `scripts/runAlerts.ts`, `workers/alertWorker.ts`, and `app/api/process-alerts/route.ts` provide dry-run/live alert queue processing, worker support, unsubscribe-token creation, EmailLog creation, admin authorization, and diagnostics.
- `docs/email-system.md` records that alert notification readiness has reached `watch`, with 197 pending saved-search alert rows historically requiring operator review before live processing.

Sub-capability disposition:

| Sub-capability | Finding |
| --- | --- |
| SavedSearch persistence | `ALREADY_EXISTS` |
| Saved criteria | `PARTIAL_GAP`; criteria are captured, but cadence and customer consent posture need certification. |
| New-match detection | `PARTIAL_GAP`; matcher exists, production cadence not certified. |
| Changed-property / price-change / status-change follow-up | `PARTIAL_GAP`; `PriceHistory` and status fields exist, but changed-listing follow-up is not fully certified. |
| Alert queues / workers | `ALREADY_EXISTS` plus `ACTIVATION_GAP`; live activation is protected. |
| Email delivery / unsubscribe / click tracking / reply handling | `ALREADY_EXISTS` with `CERTIFICATION_GAP` and high operational sensitivity. |
| Customer decision continuity | `ALREADY_EXISTS`; public Search re-entry and decision continuity are production-certified. |

This candidate is high-value but is primarily a certification / activation / reliability problem over existing protected systems. It should not win this phase because a meaningful implementation would touch customer persistence, queues, workers, Resend/email, unsubscribe, click tracking, and CRM handoff.

## Candidate 3 Current Posture

Candidate: CRM task workflow hardening.

Current repository posture:

- `CRMTask`, `SellerLead`, `UserInteraction`, and `LeadInteraction` models exist.
- `app/api/property-inquiry/route.ts` creates user records, interactions, lead interactions, CRM tasks, and high-priority property-inquiry notifications when required.
- `app/api/save-search/route.ts` creates strategy-intake CRM tasks when enough customer intent exists.
- `lib/crm/createTask.ts` builds pre-discovery task context from user behavior, saved-search intake, and alert/click data.
- `app/api/admin/crm-tasks/route.ts`, `app/api/admin/crm-tasks/[id]/route.ts`, `workers/runCRMTasks.ts`, and Master Control Panel surfaces expose admin review, task readiness, closure audit coverage, status transitions, and review-note requirements.
- `docs/email-system.md` specifies read-only CRM reports and indicates CRM readiness can block email engagement handoff if closure review coverage is incomplete.

Sub-capability disposition:

| Sub-capability | Finding |
| --- | --- |
| CRMTask model / task generation | `ALREADY_EXISTS` |
| SellerLead relationships | `PARTIAL_GAP`; model exists, operational certainty is still bounded. |
| Inquiry capture | `ALREADY_EXISTS` but mutation-bearing and protected. |
| Lead prioritization | `PARTIAL_GAP`; heat score and priority exist, but professional qualification remains human. |
| Review / complete / dismiss lifecycle | `ALREADY_EXISTS` with `CERTIFICATION_GAP`; review-note closure controls exist. |
| Admin UX / operational observability | `PARTIAL_GAP`; admin APIs and control panel exist, further polish may be useful. |
| Automation | `ACTIVATION_GAP`; broad automation would mutate customer/CRM data and is not a low-risk next step. |

This candidate is useful but should not win because much of the capability already exists and the next meaningful progress is hardening/certification over protected customer-data and CRM mutation surfaces.

## Challenger Review

Reviewed challenger areas from Phase 1:

| Challenger | Finding |
| --- | --- |
| Open-house preparation | Strong future candidate, but scheduling/data handling is not implemented and would likely touch event/calendar, CRM, lead, and consent boundaries. Does not beat Candidate 1 on risk/reuse. |
| Listing/seller recurring updates | Very strong, but closely overlaps Candidate 1. Better treated as a later package variant after the market/newsletter generator exists. |
| Comparable / sold-comp preparation | High labor leverage, but professional-boundary and sold-data completeness issues make it riskier. It should remain a later candidate. |
| Geographic evidence expansion | Blocked by GIS/source/provider rights and public-record workstreams. Cannot win this provider-independent phase. |
| Admin/source quality control | Useful and low-risk, but mostly team-facing and less directly tied to repetitive customer-facing agent labor than Candidate 1. |
| Team knowledge standardization | Important, but much of it already exists in certified routes/docs. Candidate 1 can reuse it as package inputs. |

No challenger displaces Candidate 1.

## Duplication / Novelty Findings

Candidate 1 must not duplicate Market Product, city/neighborhood guides, Source Trust, or articles. The winning implementation should generate a review package that references and assembles existing REIE outputs rather than creating parallel market pages or separate public content.

Candidate 2 risks duplicating existing saved-search alert architecture if implemented as a new alert system. Its true gap is cadence, changed-listing follow-up semantics, final dry-run review, certification, and activation.

Candidate 3 risks duplicating existing CRM/admin readiness. Its true gap is operational certainty, review workflow hardening, stale/duplicate handling, and certification.

## Agent-Labor Impact

Candidate 1 maps to 50 deterministically countable Phase 1 rows: 31 Market Intelligence rows plus 19 Newsletters, Content, And Client Education rows. The most important likely transitions are:

- `Recurring market update preparation`: `INTELLIGENCE_ASSISTED -> PARTIALLY_SUPPORTED`
- `Recurring newsletter research`: `INTELLIGENCE_ASSISTED -> PARTIALLY_SUPPORTED`
- `Newsletter market summaries`: `INTELLIGENCE_ASSISTED -> PARTIALLY_SUPPORTED`
- `Market report preparation`: `PARTIALLY_SUPPORTED -> stronger PARTIALLY_SUPPORTED` or `AUTOMATED` for assembly only
- `Market-stat collection for content`: `PARTIALLY_SUPPORTED -> AUTOMATED` for package inputs
- `Source citation` and `Fact verification`: `PARTIALLY_SUPPORTED -> stronger PARTIALLY_SUPPORTED`
- `Agent talking-point preparation`: `INTELLIGENCE_ASSISTED -> PARTIALLY_SUPPORTED`

Labor leverage: `VERY_HIGH`, because it targets recurring per-customer/per-city/on-demand research and composition without needing provider activation.

Candidate 2 maps to 10 Saved Search / Follow-Up rows plus related Agent Daily Research rows for checking saved searches, price changes, and recent activity. Labor leverage is `HIGH`, but the first real step is protected-system certification/activation rather than a clean implementation.

Candidate 3 maps to 11 Lead / CRM Work rows plus inquiry and admin-readiness support. Labor leverage is `MODERATE_TO_HIGH`, but current support is already substantial and further progress crosses customer-data mutation boundaries quickly.

## Human-Judgment Boundaries

For Candidate 1, humans retain final editorial approval, tone, timing, compliance review, customer relevance, fiduciary strategy, interpretation of market movement, and any recommendation about buying, selling, pricing, lending, tax, legal, appraisal, negotiation, or customer suitability.

For Candidate 2, humans retain communication judgment, cadence approval, customer consent interpretation, relevance of a changed listing, relationship follow-up, and the decision whether to contact a customer.

For Candidate 3, humans retain lead qualification, relationship management, priority judgment, outreach content, task closure rationale, professional accountability, and any brokerage/advisory decision.

## Architectural Leverage

| Candidate | Leverage | Reusable foundations |
| --- | --- | --- |
| Candidate 1 | `VERY_HIGH` | Market routes, city data, market Product 3.0, Market Decision Workspace, CityMarketStats, articles, Source Trust, search continuity, public certification docs. |
| Candidate 2 | `HIGH` | SavedSearch, AlertQueue, AlertEvent, processAlertQueue, alert worker, unsubscribe, click tracking, email templates, Search re-entry. |
| Candidate 3 | `HIGH` | CRMTask, SellerLead, property inquiry, save search intake, admin CRM APIs, CRM worker, Master Control Panel, advisory handoff. |

## Protected-System Exposure

| Candidate | Exposure | Risk |
| --- | --- | --- |
| Candidate 1 | Can be implemented without DB writes, schema changes, workers, queues, email, CRM mutation, MLS mutation, provider calls, or deployment until certification. | `LOW` for MVV; `MODERATE` if later scheduled or emailed. |
| Candidate 2 | Requires saved-search/customer persistence, AlertQueue, workers, Resend/email, unsubscribe, click tracking, and potentially CRM handoff. | `HIGH` |
| Candidate 3 | Requires CRM/customer persistence, task status mutation, inquiry/seller-lead relationships, admin review, and privacy controls. | `MODERATE_TO_HIGH` |

## Trust / Privacy / Fair-Housing Review

Candidate 1 has the best trust posture if it stays non-sending and agent-reviewed. It must preserve fair-housing caution by avoiding neighborhood rankings, protected-class proxies, steering language, or claims that market context determines suitability. It must label source/freshness limits and avoid AI-generated communication unless separately authorized.

Candidate 2 has direct communication-consent, unsubscribe, behavioral tracking, click tracking, and email deliverability obligations.

Candidate 3 has customer privacy, lead scoring/heat score, task prioritization, and CRM disclosure/role-boundary risk. It must avoid hidden customer profiling and must keep human review central.

## Implementation Size

| Candidate | Size | Notes |
| --- | --- | --- |
| Candidate 1 | `M` | Mostly runtime package generator, deterministic check, optional internal page/CLI output, documentation/certification. No schema or live ops required for MVV. |
| Candidate 2 | `L` | Runtime implementation may be small, but certification/activation across email, queue, workers, consent, and production observability is large. |
| Candidate 3 | `M` to `L` | Hardening scope could stay moderate, but CRM mutation and admin workflow certification expand quickly. |

## Reversibility

| Candidate | Reversibility | Rationale |
| --- | --- | --- |
| Candidate 1 | `HIGH` | Can be additive, non-sending, read-only, and certified before public/operational activation. |
| Candidate 2 | `LOW_TO_MODERATE` | Live sends and queue/status mutation are customer-visible and harder to reverse. |
| Candidate 3 | `MODERATE` | Admin UI/reporting changes are reversible; task/status/customer data mutations require more care. |

## Minimum Valuable Versions

### Candidate 1 MVV

In scope:

- Add a deterministic market/newsletter package contract and generator using existing REIE city, market, neighborhood, article, and source/freshness inputs.
- Produce a non-sending internal package object or static admin/review artifact with sections for market snapshot, city highlights, evidence/freshness, reusable explanation blocks, chart/table data, and editorial checklist.
- Add a check script that validates no AI/provider/GIS/email/CRM/customer-data activation and verifies required sections.
- Document certification evidence.

Out of scope:

- Email sending, Resend, digest scheduling, worker activation, queues, customer personalization, CRM mutation, database writes, schema changes, external news/provider calls, LightBox/ATTOM/county source activation, public route redesign, deployment.

### Candidate 2 MVV

In scope:

- Read-only certification of saved-search alert cadence semantics and changed-listing follow-up categories.
- Dry-run-only readiness check using existing alert architecture.
- No live sends.

Out of scope:

- Worker activation, live alert sends, queue retries, EmailLog mutation, unsubscribe-token creation, customer contact, CRM mutation, scheduler activation.

### Candidate 3 MVV

In scope:

- Read-only CRM lifecycle and stale/duplicate task audit.
- Deterministic contract for review-note coverage, status transitions, task evidence/context, and admin UX expectations.
- Optional admin read-only display polish only after separate authorization.

Out of scope:

- Customer-data mutation, task status changes, new lead scoring, automated qualification, new CRM task creation, schema changes, email/notification activation.

## Proposed Implementation Work Package

Name: `REIE_RECURRING_MARKET_NEWSLETTER_AGENT_REVIEW_PACKAGE_MVV`

Governing question: Can REIE assemble a source-fresh, non-sending, agent-review market/newsletter package from existing certified REIE data and explanation modules without adding provider dependencies or protected-system activation?

Customer / agent value:

- Reduces repeated agent work collecting market stats, city highlights, explanation language, evidence limits, and customer-ready talking points.
- Keeps human editorial judgment and relationship context intact.
- Creates a controlled foundation for later seller update, newsletter, or digest workflows without immediately touching email.

Likely files/modules:

- `lib/marketNewsletterPackage.ts` or `lib/content/marketNewsletterPackage.ts`
- `scripts/checkMarketNewsletterPackage.ts`
- `components/admin` or docs-only package preview only if explicitly authorized
- `docs/project-atlas/executive-library/*MARKET-NEWSLETTER-PACKAGE*`
- `package.json` check script

Protected systems:

- Must not touch Prisma schema, migrations, database writes, SavedSearch, AlertQueue, CRMTask mutation, EmailLog, Resend, workers, queues, MLS sync, Typesense reindex/reset, LightBox, ATTOM, county sources, Vercel env, telemetry, AI, GIS, or deployment.

Explicit prohibitions:

- No email sending.
- No scheduler.
- No customer personalization.
- No provider calls.
- No hidden persistence.
- No public claims that market context is a forecast, valuation, appraisal, legal/tax/lending advice, or recommendation.

Deterministic checks:

- Package shape check: required sections, source/freshness block, limitation block, editorial checklist, no forbidden strings.
- Provider independence check: no LightBox/ATTOM/county/provider imports.
- Protected-system check: no Prisma writes, no Resend/email imports, no worker/queue imports.
- Existing route reuse check: package references existing city/market/article/source modules.

Runtime validation:

- Local Node check renders one package for a representative city and confirms stable sections.
- Optional browser/admin preview only after separate authorization.

Deployment gate:

- No deployment in MVV unless separately authorized after local certification.

Production certification gate:

- Verify public routes unchanged, package output deterministic, no protected systems touched, no email sent, no provider calls, no customer data mutation.

Rollback:

- Revert additive package/check/docs files. No data rollback should be needed if MVV stays non-mutating.

Closure criteria:

- Local check passes.
- `git diff --check` passes.
- Secret scan passes.
- Documentation records provider independence and protected-system preservation.

## Provider Independence Confirmation

The selected Candidate 1 MVV can proceed without LightBox response, LightBox API access, ATTOM response, ATTOM integration, or new county-source activation. It should use only existing REIE market/city/neighborhood/article/source-transparency foundations and existing MLS-derived Property/Search data where already certified for public use.

## Executive Recommendation

Authorize Candidate 1 MVV next. Do not authorize email distribution, scheduling, saved-search live alerts, CRM mutation, provider calls, or public-record retrieval as part of that implementation. Treat Candidate 2 as the strongest follow-on once Executive HQ wants to spend protected-system authorization on email/queues/workers/customer-contact certification.
