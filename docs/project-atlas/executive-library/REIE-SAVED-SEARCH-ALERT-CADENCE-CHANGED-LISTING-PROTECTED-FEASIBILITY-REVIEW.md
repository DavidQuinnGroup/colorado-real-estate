# REIE Saved Search Alert Cadence And Changed-Listing Protected Feasibility Review

Date: 2026-08-13

Status: `SAVED_SEARCH_ALERT_CADENCE_AND_CHANGED_LISTING_PROTECTED_FEASIBILITY_REVIEW_COMPLETE`

## Governing Question

What exactly is missing, if anything, from REIE's existing Saved Search / Alert / Changed-Listing architecture before it can materially reduce repetitive agent follow-up labor safely?

Primary disposition:

- `PARTIAL_GAP`
- `CERTIFICATION_GAP`
- `ACTIVATION_GAP`
- `RELIABILITY_GAP`
- `CUSTOMER_EXPERIENCE_GAP`

Not primary:

- `GENUINE_NEW_CAPABILITY`
- `PROTECTED_SYSTEM_GAP`
- `ALREADY_SUBSTANTIALLY_COMPLETE`

The architecture is materially present for saved-search intake, new-listing matching, alert queueing, dry-run review, one-row or bounded live sending, digest grouping, unsubscribe, click tracking, and CRM handoff. It is not yet safe to classify as production-ready for broad agent-labor replacement because cadence selection is not persisted on saved searches, recurring workers/schedulers are not active, changed-listing event classes beyond `NEW_LISTING` are not implemented, and pending alert backlog/operator-review gates remain explicit activation blockers.

## Canonical Baseline

Fresh repository truth at review start:

- Branch: `main`
- HEAD: `1b9817a90830bf102c774bf091c35d58613c1485`
- origin/main: `1b9817a90830bf102c774bf091c35d58613c1485`
- Divergence: `0 behind / 0 ahead`
- Worktree: clean

Provider tracks preserved:

- LightBox: `WAITING_FOR_LIGHTBOX_SUPPORT_AUTH_SCOPE_CONFIRMATION`
- LightBox evaluation calls consumed: `0`
- ATTOM: `PENDING_PROVIDER_RESPONSE`

## Evidence Reviewed

Repository evidence:

- `prisma/schema.prisma`
- `app/api/save-search/route.ts`
- `components/maps/SaveSearch.tsx`
- `lib/search/searchReturnContext.ts`
- `lib/mls/processListing.ts`
- `lib/alerts/matchSearches.ts`
- `lib/alerts/matchSavedSearches.ts`
- `lib/alerts/processAlertQueue.ts`
- `lib/alerts/intent/evaluateAlertIntent.ts`
- `lib/queue/alertQueue.ts`
- `lib/queue/enqueueAlert.ts`
- `workers/alertWorker.ts`
- `scripts/runAlerts.ts`
- `scripts/sendDigest.ts`
- `scripts/alertNotificationReadiness.ts`
- `app/api/process-alerts/route.ts`
- `app/api/unsubscribe/route.ts`
- `lib/unsubscribe/store.ts`
- `lib/unsubscribe/safety.ts`
- `lib/email/sendEmail.ts`
- `app/api/track-click/route.ts`
- `docs/alert-architecture.md`
- `docs/email-system.md`
- `docs/production-scheduler-plan.md`
- `docs/project-atlas/executive-library/REIE-SAVED-SEARCH-DECISION-CONTINUITY-PRODUCTION-CERTIFICATION.md`

No provider credentials were retrieved. No LightBox, ATTOM, county, MLS, Resend, database, queue, worker, scheduler, Typesense, Vercel, telemetry, or customer-data operation was executed.

## Saved Search Architecture Inventory

| Item | Classification | Evidence |
| --- | --- | --- |
| `SavedSearch` model | `IMPLEMENTED_NOT_CERTIFIED` | `prisma/schema.prisma` stores `userId`, `city`, `minPrice`, `beds`, `type`, bounds, `isActive`, `createdAt`. |
| Saved criteria | `IMPLEMENTED_NOT_CERTIFIED` | `app/api/save-search/route.ts` persists city, price floor, beds, property type, and map bounds. |
| Ownership/customer association | `IMPLEMENTED_NOT_CERTIFIED` | `SavedSearch.userId` relates to `User`; save-search API upserts by email and creates a user-owned search. |
| Creation path | `IMPLEMENTED_NOT_CERTIFIED` | `POST /api/save-search` creates `SavedSearch`, `UserInteraction`, optional `CRMTask`, and North Star rows. |
| Update path | `NOT_PRESENT` | No saved-search update route was found in the inspected architecture. |
| Deletion path | `NOT_PRESENT` | No direct delete path was found; unsubscribe can deactivate a search through `SavedSearch.isActive=false` when token has `searchId`. |
| Instant cadence | `WORKER_DEPENDENT` | New matching listings can create immediate `AlertQueue` work, but live processing requires explicit script/API/worker activation. |
| Daily cadence | `WORKER_DEPENDENT` | `scripts/sendDigest.ts` groups pending alert rows by user, but scheduling is not active and digest rules remain gated. |
| Cadence fields | `NOT_PRESENT` | `SavedSearch` has no cadence/frequency/quiet-hour/timezone field. |
| Active/inactive state | `IMPLEMENTED_NOT_CERTIFIED` | `SavedSearch.isActive` gates matching; unsubscribe can set a saved search inactive. |
| Expiration | `NOT_PRESENT` | No saved-search expiration field or expiry worker was found. |
| Customer re-entry into Search | `PRODUCTION_CERTIFIED` | Saved Search decision-continuity certification covers safe Search return links and bounded query reconstruction. |
| Search URL/state reconstruction | `PRODUCTION_CERTIFIED` | `components/maps/SaveSearch.tsx` and `lib/search/searchReturnContext.ts` preserve allowed Search criteria and fail closed to `/search`. |
| Property handoff | `IMPLEMENTED_NOT_CERTIFIED` | Email payload URLs point to `/properties/{identity}` or `/search`; tracked links redirect safely. Saved Search success intentionally does not add a direct property link. |
| Decision continuity | `PRODUCTION_CERTIFIED` | `REIE-SAVED-SEARCH-DECISION-CONTINUITY-PRODUCTION-CERTIFICATION.md` certifies Search, Market, Grand Plan, Sources, and professional handoff continuation. |
| Privacy/consent posture | `PARTIAL` | Save-search submission requires email and customer action; customer-facing copy avoids alert promises. Explicit cadence/consent granularity is not persisted. |
| Unsubscribe relationship | `IMPLEMENTED_NOT_CERTIFIED` | Global and per-search unsubscribe behavior exists through `UnsubscribeToken.searchId`, `User.isUnsubscribed`, and `SavedSearch.isActive`. |

## Alert Event / Queue Architecture

Classification: `PARTIAL`

The event and queue architecture is strong enough for bounded preview and controlled live batches, but not mature enough for broad autonomous activation.

Implemented evidence:

- `AlertEvent` deduplicates by unique `userId`, `propertyId`, and `type`.
- Current event type is `NEW_LISTING`.
- `AlertQueue` persists `userId`, `status`, `payload`, `clickedAt`, and `createdAt`.
- Matching creates `AlertEvent` and `AlertQueue` in one transaction.
- BullMQ alert jobs use stable job ids shaped as `alert-{alertId}`.
- Job options include three attempts, exponential backoff, and bounded retention for completed and failed jobs.
- Live processing claims pending rows with `pending -> processing`.
- Terminal states include `sent`, `skipped`, and `failed`.
- Dry-run preview does not claim rows, create unsubscribe tokens, send email, or mutate alert status.
- Worker failure can enqueue alert dead-letter work after final retry.

Gaps:

- No `AlertQueue` relation to `SavedSearch`, so queue rows do not preserve the exact search that produced the alert unless payload/request metadata carries it indirectly.
- No event-specific stale/expiry field on `AlertQueue`.
- No first-class dead-letter status on `AlertQueue`; dead-letter is BullMQ-adjacent.
- No event taxonomy beyond `NEW_LISTING`.
- No customer-visible cadence state.

Queue architecture disposition:

- `PARTIAL`

## Changed-Listing Detection

Current support:

| Listing change | Classification | Evidence |
| --- | --- | --- |
| Newly matching listings | `IMPLEMENTED_NOT_CERTIFIED` | MLS processing calls `matchAndNotify(property)` after property upsert, search-index update, and photo processing. |
| Price changes | `NOT_PRESENT` | No price-change comparison event type or previous/current price event persistence found. |
| Status changes | `NOT_PRESENT` | No status-change event type or previous/current status comparison found. |
| Open-house changes | `NOT_PRESENT` | `OpenHouse` exists in schema, but no inspected alert event generator for open-house changes was found. |
| Listing removal | `NOT_PRESENT` | No removal/withdrawn/unavailable event generator found. |
| Back-on-market | `NOT_PRESENT` | No back-on-market event taxonomy or comparator found. |
| Pending | `NOT_PRESENT` | No pending-status alert taxonomy or comparator found. |
| Sold | `NOT_PRESENT` | No sold-status alert taxonomy or comparator found. |
| Meaningful property attribute changes | `NOT_PRESENT` | No attribute-diff engine or event persistence found. |
| Photo changes | `NOT_PRESENT` | Photo processing exists, but no photo-change alert event generator found. |
| Listing freshness changes | `PARTIAL` | Fixture-only alert intent can block stale properties, but production matching does not persist freshness-change events. |

Event source:

- MLS listing processing through `lib/mls/processListing.ts`.

Comparison mechanism:

- Matching compares current property fields against active saved-search criteria.
- Duplicate suppression relies on `AlertEvent(userId, propertyId, type)`.
- There is no proven previous-state diff mechanism for changed-listing event classes.

Previous-state source:

- `AlertEvent` proves prior notification for a user/property/type.
- No prior-value snapshot source was found for price/status/open-house/photo comparisons.

Current-state source:

- Current Postgres `Property` record passed through MLS processing.

Customer relevance logic:

- City, price floor, beds, property type, and map bounds.
- User email and unsubscribe status.
- Fixture-only intent checks also include freshness, payload validity, and delivery-blocked no-send mode.

## Cadence Behavior

Classification: `PARTIAL`

Supported:

- Instant-like alert work can be queued when MLS processing finds a new saved-search match.
- Bounded alert dry-run and live processing are available through API, scripts, and worker commands.
- Daily-style digest grouping exists in `scripts/sendDigest.ts`.
- Digest processing groups pending alert rows by user.
- Duplicate suppression for `NEW_LISTING` avoids repeated same user/property/type events.

Not supported or not active:

- Saved-search-level cadence preference.
- Timezone field.
- Quiet-hour field.
- Customer cadence UI.
- Scheduled recurring alert or digest activation.
- Same-day digest throttling beyond queue status and unique event suppression.
- Delivery-window semantics.
- Expiration of stale alert rows.

Cadence disposition:

- `WORKER_DEPENDENT`

## Email / Delivery Architecture

Classification: `IMPLEMENTED_NOT_CERTIFIED`

Implemented:

- Resend integration in `lib/email/sendEmail.ts`.
- Lazy Resend initialization.
- Required `RESEND_API_KEY` for live sends.
- Optional `RESEND_FROM_EMAIL` and `RESEND_REPLY_TO_EMAIL`.
- Default sender: `David Quinn Group <alerts@davidquinngroup.com>`.
- HTML and text email rendering.
- EmailLog creation for `PROPERTY_ALERT` and `PROPERTY_DIGEST`.
- Alert email composition through `sendEmail()`.
- Digest composition through `scripts/sendDigest.ts`.
- Global unsubscribe and per-search unsubscribe data model.
- Click tracking through `/api/track-click`.
- Safe redirect allowlist.
- Send failure sets alert rows to `failed`.
- Missing email or unsubscribed user is skipped.

Gaps:

- Reply handling exists as an email-reply webhook route, but it was not inspected deeply in this review and is not needed for MVV.
- Bounce/failure webhooks were not confirmed as active.
- Sender-domain verification is an operational prerequisite, not proven by source inspection.
- Legacy templates still exist; docs identify `sendEmail.ts` as active path.

No email was sent.

## Worker / Scheduler Architecture

Classification: `DORMANT_OR_PROTECTED_ACTIVATION`

Worker evidence:

- `workers/alertWorker.ts` supports `queue`, `batch`, and `hybrid` modes.
- Defaults: batch size `50`, interval `60000ms`, concurrency `2`, mode `hybrid`.
- `ALERT_WORKER_DRY_RUN=true` requires one-shot or batch mode so queue jobs are not silently consumed.
- `npm run run:worker:alerts:once` is dry-run batch one-shot.
- `npm run run:worker:alerts:once:live` is explicit live one-shot.
- `npm run run:worker:alerts` is continuous live worker.
- Startup requires database readiness.

Scheduler evidence:

- No active `vercel.json` cron or equivalent enabled scheduler file was found.
- `docs/production-scheduler-plan.md` defines conservative future schedules and preconditions.
- Package scripts exist for alert dry-run/live, worker once/live, digest dry-run/live, and CRM scheduler reporting.

Activation need:

- Existing dormant/protected worker.
- Scheduler/provider activation if recurring cadence is desired.
- Queue activation only after explicit approval.
- Deployment/configuration only if the runtime environment must host the recurring worker/scheduler.

## Consent / Unsubscribe / Privacy

Classification: `PARTIAL`

Strengths:

- Saved search requires a customer email and explicit form submission.
- User ownership exists through `SavedSearch.userId`.
- User unsubscribe state is checked before matching and before sending.
- Global unsubscribe persists to `User.isUnsubscribed` and `User.unsubscribedAt`.
- Per-search unsubscribe can set `SavedSearch.isActive=false` when a token includes `searchId`.
- Unsubscribe route validates token shape, handles missing/unknown/already-used tokens, emits no-store noindex pages, and avoids broad user-data exposure.
- Email and alert docs require dry-run review and readiness gates before live sends.
- Saved Search decision-continuity certification confirms customer-facing copy does not promise automated delivery.

Material gaps:

- Customer-facing cadence/alert consent granularity is not persisted.
- Current live alert/digest token creation appears global unless a future sender passes `searchId`.
- No retention/expiration policy for saved searches or old alert rows was found in the model.
- Accountless versus authenticated preference management is limited to email/token flows.

Any missing unsubscribe/consent requirement is a blocker for broad activation. The minimum next package should not send customer email until explicit consent/cadence posture is reviewed and certified.

## Agent-Labor Impact

Labor leverage: `HIGH`

This capability can reduce repetitive agent work in the Phase 1 labor matrix, but only after controlled activation and relevance rules are certified.

Likely reduced tasks:

- Manually checking saved searches for new matching listings.
- Manually identifying new listing matches by city, price, beds, type, and map bounds.
- Manually preparing simple daily match summaries.
- Re-opening prior customer criteria for repeat follow-up.
- Reconnecting customer activity to CRM context after email clicks.
- Reviewing alert-readiness metadata before follow-up.

Not yet reduced:

- Price-change monitoring.
- Status-change monitoring.
- Open-house change monitoring.
- Listing removal/unavailable monitoring.
- Back-on-market/pending/sold updates.
- Photo or material attribute-change monitoring.
- Professional judgment about whether a change deserves outreach.

No hours saved are asserted.

## Customer Value

Customer value is distinct from labor reduction.

Current value if activated narrowly:

- Faster notification when a new listing matches a saved search.
- Re-entry links into property/search context.
- Unsubscribe control.
- Factual property-intelligence framing without recommendation language.
- Digest grouping to reduce email volume.

Not yet supported:

- Customer-selected cadence.
- Clear explanation of why a changed listing changed.
- Price-change/status-change/open-house/removal explanations.
- Quiet-hour/timezone-sensitive delivery.
- Stale/unavailable listing messaging.

Customer-value disposition:

- `MODERATE` now for new-match alerts.
- `HIGH` only after cadence choice, changed-listing explanations, and noise controls are added or certified.

## Alert Noise / Relevance Controls

Current controls:

- Saved-search criteria matching.
- Active-only saved searches.
- Unsubscribed users excluded.
- Unique `AlertEvent` for `userId/propertyId/type`.
- Pending row status and dry-run preview.
- Digest grouping can reduce single-message volume.
- Search smoke, launch readiness, queue dashboard, and ops smoke are documented gates.

Noise risks:

- No customer cadence preference.
- No quiet hours.
- No stale alert expiration.
- No same-day digest-vs-instant policy.
- No materiality threshold for price/status/attribute changes because those classes are not implemented.
- `NEW_LISTING` duplicate prevention could suppress a later materially changed listing unless new event types are introduced.
- Pending backlog requires review before customer-facing live reliance.

Minimum missing control:

- Persist or otherwise certify an explicit customer consent/cadence policy for one narrow alert class, plus deterministic stale-row and duplicate/noise review before live activation.

## Trust / Professional Boundary

Alert communications must stay factual, consent-based, and non-advisory.

The current active email path avoids direct "buy now" claims in `sendEmail.ts`, but legacy templates contain deal/urgency language and should remain out of active production paths unless remediated or removed in a separate cleanup. Future alert copy must not introduce:

- suitability recommendations;
- urgency manipulation;
- investment claims;
- acceptance probability;
- valuation certainty;
- protected-class inference;
- steering;
- fabricated scarcity;
- unsupported urgency.

## Current Production Posture

Active or certified:

- Public Save Search decision continuity.
- Safe Search return and handoff links.
- Saved-search API implementation.
- Admin/readiness scripts and docs.
- Protected alert status/dry-run/live API surface.
- Alert/digest scripts as explicit operator commands.
- Unsubscribe and click-tracking architecture from prior controlled certification records.

Inactive/protected:

- Broad customer alert sends.
- Recurring alert worker.
- Alert scheduler.
- Digest scheduler.
- Backlog release.
- Changed-listing event classes beyond `NEW_LISTING`.
- Provider-independent county/ATTOM/LightBox enrichment.

Do not confuse code existence with production activation. The architecture is implemented enough to justify a narrow protected activation review, not a broad automated rollout.

## Gap Register

| Gap | Current state | Evidence | Customer impact | Agent-labor impact | Protected systems touched | Implementation size | Operational risk | Compliance/privacy risk | Certification need | Activation need |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Customer cadence preference | Not present | `SavedSearch` has no cadence field | Customer cannot choose instant/digest/none per search | Agent cannot rely on customer-specific cadence | SavedSearch writes, UI/API, DB/schema if persisted | Medium | Moderate | High if emails sent without clear preference | Required | Required |
| New-match alert activation | Implemented but protected | `matchAndNotify`, `AlertQueue`, `processAlertQueue`, `runAlerts` | Faster new-match notification | High for manual new-listing checks | AlertEvent, AlertQueue, Resend, EmailLog, worker/scheduler | Low to medium | Moderate | Moderate | Required | Required |
| Pending backlog review | Existing watch gate | Docs/readiness history and alert readiness scripts | Prevents stale/noisy sends | Reduces rework after review | AlertQueue, possible dry-run reads | Low | Moderate | Moderate | Required | Required before live |
| Changed-listing price/status/open-house/removal events | Not present | No event taxonomy/comparator beyond `NEW_LISTING` | Missing high-value change notices | Leaves major manual monitoring intact | MLS processing, AlertEvent, AlertQueue, email | Medium to high | Moderate | Moderate | Required | Later activation |
| Stale-row expiration | Not present | No expiry field/policy on `AlertQueue` | Could notify old matches | Reduces manual cleanup if added | AlertQueue writes | Low to medium | Moderate | Low to moderate | Required | Required |
| Digest grouping business rules | Partial | `sendDigest.ts`, docs say rules need approval | Better email volume control | Reduces manual summaries | AlertQueue, Resend, EmailLog | Low to medium | Moderate | Moderate | Required | Required |
| Scheduler hosting | Planned only | No active cron file; scheduler plan docs only | No automatic cadence | Agent still runs manual checks | Worker/scheduler/Vercel or host config | Medium | Moderate to high | Low if non-sending; high if live | Required | Required |
| Per-search unsubscribe in live sends | Model-supported, not active path | `UnsubscribeToken.searchId`; alert/digest create global token only | Less granular preference control | Reduces support friction | UnsubscribeToken, SavedSearch | Low to medium | Low | Moderate | Required | Required for per-search MVV |

## Minimum Valuable Version

Implementation is justified only as a narrow, high-reversibility package.

Recommended MVV:

- One existing saved search or an explicitly bounded internal recipient cohort.
- One factual event class: `NEW_LISTING` only.
- Existing Postgres matching and `AlertEvent` duplicate suppression.
- Existing `AlertQueue` pending row preview.
- Non-sending dry-run certification first.
- Explicit operator review of pending rows.
- Existing unsubscribe route and click tracking.
- Existing Search/property re-entry links.
- No recommendation logic.
- No scheduler activation until a controlled live once-send is separately certified.

In scope for the next package:

- Documentation and certification of current `NEW_LISTING` alert dry-run behavior.
- Optional source-only reliability remediation if certification finds stale-row, payload, or per-search unsubscribe defects.
- One bounded internal live-send proof only if separately authorized after dry-run review.

Out of scope:

- Price/status/open-house/removal/back-on-market/pending/sold/photo-change alerts.
- Broad customer rollout.
- Recurring worker or scheduler activation.
- Provider enrichment.
- MLS volume changes.
- Typesense changes.
- CRM automation expansion.
- Telemetry.

## Activation Vs Implementation Classification

Best-supported classification:

`EXISTING_CAPABILITY_NEEDS_NARROW_RELIABILITY_REMEDIATION`

Secondary classifications:

- `EXISTING_CAPABILITY_NEEDS_CERTIFICATION_ONLY` for dry-run/status inspection paths.
- `EXISTING_CAPABILITY_NEEDS_PROTECTED_ACTIVATION` for live alert sends, worker consumption, and scheduler cadence.
- `PARTIAL_IMPLEMENTATION_REQUIRES_BOUNDED_MVV` for changed-listing alerts beyond `NEW_LISTING`.

Not supported:

- `ALREADY_PRODUCTION_READY_NO_NEW_WORK_REQUIRED`
- `MATERIAL_ARCHITECTURAL_GAP`

## Protected-System Authorization Map

Any recommended next step requires explicit authorization as follows:

| Protected system | Required for recommended next step? | Notes |
| --- | --- | --- |
| SavedSearch writes | Maybe | Required only if adding cadence/consent fields or per-search preference changes. |
| AlertEvent writes | Yes for live/new matching | Matching creates dedupe events. Dry-run review can avoid writes if only inspecting existing rows. |
| AlertQueue writes | Yes for live/new matching | Queue creation and status transitions are protected. |
| Worker activation | Yes | Any `run:worker:alerts*` command is protected; dry-run once is lower risk but still explicitly gated. |
| Scheduler/cron | Yes | Recurring cadence requires separate activation. |
| Resend/email | Yes | Any live send requires explicit approval. |
| EmailLog writes | Yes | Live sends create logs. |
| Customer-data mutation | Yes | Saved-search, unsubscribe, click, heat score, preferences, CRM effects can mutate customer data. |
| Unsubscribe mutation | Yes | Valid unsubscribe invocation mutates user or saved-search state. |
| CRM | Maybe | Existing save-search and click paths can influence CRM; broad activation increases CRM handoff volume. |
| Telemetry | No | Not needed for MVV and should remain excluded. |
| Production deployment | Maybe | Required only if code/remediation changes are made or scheduler/runtime config changes must be hosted. |

This review crossed none of those gates.

## Rollback / Reversibility

Reversibility classification: `HIGH` for the recommended MVV.

Recommended path can be:

- isolated to one event class;
- feature-gated by command choice and explicit live flags;
- dry-run first;
- admin/operator-only;
- non-sending for certification;
- canary/bounded for an internal recipient;
- disabled by not running workers/schedulers;
- stopped by leaving queued rows pending or skipping further processing.

Reversibility becomes `MODERATE` if customer-facing live sends begin. It becomes `LOW` only if broad recurring scheduler activation proceeds without row-level review and rollback controls.

## Proposed Next Authorization Package

Package name:

`REIE_SAVED_SEARCH_NEW_LISTING_ALERT_DRY_RUN_AND_ROW_QUALITY_CERTIFICATION`

Governing question:

Can the existing `NEW_LISTING` saved-search alert path be certified as dry-run safe, row-quality sufficient, consent-aware, unsubscribe-aware, and ready for one separately authorized internal live proof without broad activation?

Exact missing capability:

- Certification of existing pending alert rows, payload quality, unsubscribe posture, duplicate/noise controls, and stale-row risk.

Authorized files/systems:

- Read-only source inspection.
- `docs/alert-architecture.md`
- `docs/email-system.md`
- `docs/project-atlas/executive-library/*`
- `docs/CHAT_START.md`
- Optional non-sending checks:
  - `npm run check:alert-notification-readiness`
  - `npm run check:notification-readiness:strict`
  - `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`
  - `npm run run:alerts:dry -- --limit 25` only if Executive HQ explicitly authorizes alert dry-run row inspection.

Protected systems:

- AlertQueue reads.
- BullMQ queue reads.
- Customer email addresses in masked output.
- No writes unless a later package explicitly allows remediation.

Explicit prohibitions:

- No live email.
- No worker live mode.
- No scheduler activation.
- No backlog release.
- No SavedSearch/AlertEvent/AlertQueue/EmailLog/CRM/customer-data writes.
- No provider calls.
- No deployment.

Test strategy:

- Source-level architecture consistency review.
- Consent/unsubscribe review.
- Duplicate/noise review.
- Protected-system review.
- Phase 1 labor linkage review.
- Secret scan.
- `git diff --check`.
- Optional bounded dry-run only under separate authorization.

Production gate:

- None in this package. Production live proof requires a later explicit one-row/internal-recipient authorization.

Rollback:

- Documentation-only rollback is a git revert.
- Dry-run-only package has no data rollback.

Closure criteria:

- Exact row-quality and consent posture recorded.
- Decision: certification-only, narrow remediation, or one-row internal live proof.

## Provider Independence

The recommended next step does not depend on:

- LightBox;
- ATTOM;
- new county-source activation.

LightBox credentials were not retrieved. LightBox was not called. ATTOM was not investigated.

## Final Recommendation

Do not implement broad changed-listing alerts yet. First certify the existing `NEW_LISTING` saved-search alert path with a bounded, non-sending row-quality and consent review. If that passes, the next safe activation step is a separately authorized one-row or very small internal live proof using existing alert processing, not a recurring scheduler.

Next authorization gate:

`READY_FOR_REIE_SAVED_SEARCH_NEW_LISTING_ALERT_DRY_RUN_AND_ROW_QUALITY_CERTIFICATION`

## Protected-System Confirmation

This review did not modify runtime code, Prisma schema, migrations, APIs, provider configuration, MLS, Typesense, Vercel, database rows, SavedSearch data, AlertEvent data, AlertQueue data, EmailLog data, unsubscribe state, CRM data, customer data, telemetry, workers, schedulers, or deployment state.
