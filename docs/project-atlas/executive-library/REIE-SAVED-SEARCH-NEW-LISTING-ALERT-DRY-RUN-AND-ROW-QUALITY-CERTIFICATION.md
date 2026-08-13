# REIE Saved Search NEW_LISTING Alert Dry-Run And Row-Quality Certification

Date: 2026-08-13

Status: `SAVED_SEARCH_NEW_LISTING_ALERT_DRY_RUN_CERTIFIED_WITH_NARROW_REMEDIATION_REQUIRED`

## Workstream 1 Synchronization

The prior local documentation-only feasibility commit was synchronized before this certification began.

- Commit: `0d9dd12c1f897513067093a8e55822d2548a060e`
- Message: `Review saved search alert cadence feasibility`
- Pre-push baseline: `HEAD = 0d9dd12c1f897513067093a8e55822d2548a060e`, `origin/main = 1b9817a90830bf102c774bf091c35d58613c1485`, divergence `0 behind / 1 ahead`, clean.
- Scope: `docs/CHAT_START.md` and `docs/project-atlas/executive-library/REIE-SAVED-SEARCH-ALERT-CADENCE-CHANGED-LISTING-PROTECTED-FEASIBILITY-REVIEW.md`.
- `git diff --check origin/main...HEAD`: passed.
- Push result: `1b9817a..0d9dd12 main -> main`.
- Post-sync baseline: `HEAD = origin/main = 0d9dd12c1f897513067093a8e55822d2548a060e`, divergence `0 behind / 0 ahead`, clean.

No deployment was performed.

## Governing Question

Can the existing `NEW_LISTING` Saved Search alert path deterministically identify appropriate alert candidates and produce safe, deduplicated, consent-aware, non-sending previews without releasing customer communications or activating recurring infrastructure?

Answer:

- Dry-run safety: certified for the existing pending-queue preview path.
- Fixture-level matching: certified for deterministic no-side-effect checks.
- Current production row posture: no pending rows are available for a real candidate preview.
- Future live proof: not ready until narrow semantic and freshness/remediation gates are resolved.

Final classification:

`DRY_RUN_CERTIFIED_WITH_NARROW_REMEDIATION_REQUIRED`

## Execution Path Trace

### Production Matching Path

Entry point:

- `lib/mls/processListing.ts`

Path:

1. MLS processing upserts a `Property`.
2. Search index update and photo processing run.
3. `queueSavedSearchAlerts(property, listingLabel)` calls `matchAndNotify(property)`.
4. `matchAndNotify()` validates property identity and city.
5. Active, subscribed saved searches are loaded by city.
6. `matchesAlertSearch()` evaluates city, price, beds, property type, and map bounds.
7. `queueAlert()` creates:
   - `AlertEvent` with `type = NEW_LISTING`;
   - `AlertQueue` with `status = pending`;
   - BullMQ job through `enqueueAlert()`.

Potential writes in matching path:

- `AlertEvent.create`
- `AlertQueue.create`
- BullMQ `alertQueue.add`

This production matching path was not executed during certification.

### Dry-Run Preview Path

Entry point:

- `node dist/scripts/runAlerts.js --dry-run --limit=25`

Source path:

1. `scripts/runAlerts.ts` parses `--dry-run`.
2. `processAlertQueue({ dryRun: true, limit })` is called.
3. `fetchPendingAlerts(limit)` reads pending `AlertQueue` rows and selected `User` fields.
4. `processAlert(alert, true)` returns immediately through `previewAlert(alert)`.
5. `previewAlert()` classifies each row as preview/skipped/failed using:
   - `AlertQueue.status`;
   - presence of user email;
   - `User.isUnsubscribed`;
   - usable listing payload.

Dry-run guards:

- `if (dryRun) return previewAlert(alert);`
- This guard occurs before claim/status mutation.
- It also occurs before unsubscribe token creation, `sendEmail()`, `AlertQueue.update`, and `EmailLog.create`.

Send boundary:

- `sendEmail()` is reachable only after `dryRun` is false, after claim, after email/unsubscribe/payload checks.

Resend boundary:

- `sendEmail()` calls `getResendClient().emails.send(...)`.
- The dry-run path does not invoke `sendEmail()`.

EmailLog boundary:

- `EmailLog.create` is inside the live-send success transaction only.

Unsubscribe boundary:

- `createUnsubscribeUrl()` creates `UnsubscribeToken` only in live mode.
- Existing unsubscribe state is read for preview.

Queue boundary:

- Dry-run reads `AlertQueue` pending rows.
- Dry-run does not add BullMQ jobs.
- Dry-run does not consume workers.
- Dry-run does not change queue status.

## Dry-Run Safety Result

Certification result:

`DRY_RUN_ZERO_WRITE_ZERO_SEND_CONFIRMED`

The selected dry-run mechanism:

- cannot invoke Resend in the inspected path;
- cannot send email;
- cannot mark communication as sent;
- cannot release queue backlog;
- cannot activate worker/scheduler infrastructure;
- cannot mutate unsubscribe;
- cannot mutate `SavedSearch`;
- cannot mutate CRM;
- cannot create an intended or unintended customer-facing side effect.

Dry-run itself writes:

- `AlertEvent`: no.
- `AlertQueue`: no.
- `EmailLog`: no.
- `UnsubscribeToken`: no.
- `SavedSearch`: no.
- `CRMTask`: no.
- `User`: no.

Executed command:

```bash
node dist/scripts/runAlerts.js --dry-run --limit=25
```

Observed result:

- `scanned = 0`
- `sent = 0`
- `skipped = 0`
- `failed = 0`
- `dryRun = true`
- `success = true`
- recommendation: `Dry-run found no pending alert work.`

Pre/post aggregate counts were unchanged after dry-run:

- `AlertQueue`: `sent = 85`, `skipped = 198`
- `AlertEvent`: `NEW_LISTING = 273`
- `EmailLog`: `78`
- `UnsubscribeToken`: `128`
- `SavedSearch`: `5`

## Current Saved Search Posture

Read-only aggregate inspection:

| Metric | Count |
| --- | ---: |
| Total SavedSearch rows | 5 |
| Active SavedSearch rows | 5 |
| Inactive SavedSearch rows | 0 |
| SavedSearches with usable criteria | 5 |
| SavedSearches missing required criteria | 0 |
| SavedSearches with malformed criteria | 0 |
| Globally unsubscribed users | 0 |
| Used per-search unsubscribe tokens | 0 |
| Used global unsubscribe tokens | 1 |

Historical memory noted older pending-alert counts, but fresh database truth is authoritative for this certification.

## Saved Search Row Quality

Aggregate row classification:

| Classification | Count |
| --- | ---: |
| `ELIGIBLE_FOR_ALERT_EVALUATION` | 5 |
| `INACTIVE` | 0 |
| `UNSUBSCRIBED` | 0 |
| `MISSING_REQUIRED_CRITERIA` | 0 |
| `MALFORMED_CRITERIA` | 0 |
| `STALE_OR_EXPIRED_IF_DETERMINABLE` | 0 |
| `CUSTOMER_IDENTITY_OR_CONSENT_BLOCKED` | 0 |
| `OTHER_BLOCKED` | 0 |

Qualification basis:

- city present;
- at least one matching criterion present;
- active state present;
- user relationship present;
- no global unsubscribe block found.

Limit:

- No persisted cadence, timezone, quiet-hour, or per-search consent preference exists, so eligibility for matching is not the same as eligibility for broad recurring customer communication.

## Property / Listing Row Quality

Read-only sample:

- Latest `1000` `Property` rows by `updatedAt`.

Aggregate classification:

| Classification | Count |
| --- | ---: |
| Sampled rows | 1000 |
| Eligible minimum facts | 1000 |
| Private/non-public | 0 |
| Missing stable identifier | 0 |
| Missing/invalid status | 0 |
| Missing price | 0 |
| Missing geography | 0 |
| Missing beds or baths | 0 |
| Incomplete mapping | 0 |
| `lastIntelligenceSync` stale or missing over 30 days | 1000 |

Minimum facts present in the sampled property rows:

- stable identity: `id`, `mlsId`, `slug`;
- address;
- city;
- price;
- property type;
- status;
- latitude/longitude.

Freshness blocker:

- All sampled rows were stale or missing current `lastIntelligenceSync` under a 30-day freshness threshold. This does not invalidate dry-run safety, but it blocks live customer-facing proof unless the candidate event is freshly generated and explicitly authorized.

## NEW_LISTING Semantics

Current code meaning:

`NEW_LISTING` currently means:

- a currently processed `Property` matched an active subscribed saved search;
- no prior `AlertEvent(userId, propertyId, type = NEW_LISTING)` exists;
- an alert candidate was then queued for that user/property/type.

It does not strictly prove:

- newly ingested listing;
- newly active listing;
- listing date freshness;
- first time a specific saved search saw the listing;
- first time a customer saw the listing across all surfaces.

Event timestamp/source:

- `AlertEvent.sentAt` defaults to `now()` at event creation.
- This is event creation time, not a proven MLS list date or listing-status transition timestamp.

Semantic finding:

`NEW_LISTING` is acceptable for dry-run certification but ambiguous for live customer copy. Future live proof must describe the candidate as a "saved-search match" or must add a freshness/newness proof before using stronger "new listing" language.

## Matching Correctness

Deterministic no-side-effect fixture command:

```bash
node_modules/.bin/jiti scripts/runAlertIntentFixtures.ts
```

Result:

- `status = SUCCESS`
- `mode = FIXTURE_ONLY_NO_SIDE_EFFECT`
- baseline SHA: `8fc84ea76e9a3436188c2de416079ff57d75b506`
- cases evaluated: `17`
- database reads: `0`
- database rows created: `0`
- database rows mutated: `0`
- queue jobs created/changed: `0`
- provider calls: `0`
- email logs created: `0`
- unsubscribe tokens created: `0`
- workers activated: `0`
- customer data exposed: `0`

Fixture coverage:

| Scenario | Result |
| --- | --- |
| complete match | `ready_no_send` |
| city mismatch | `NO_MATCH_CITY` |
| price mismatch | `NO_MATCH_PRICE` |
| beds mismatch | `NO_MATCH_BEDS` |
| property-type mismatch | `NO_MATCH_TYPE` |
| bounds mismatch | `NO_MATCH_BOUNDS` |
| inactive search | `SEARCH_INACTIVE` |
| unsubscribed user | `USER_UNSUBSCRIBED` |
| missing email | `USER_MISSING_EMAIL` |
| stale property | `PROPERTY_STALE` |
| invalid property | `PROPERTY_INVALID` |
| duplicate event | `DUPLICATE_EVENT` |
| payload-ready path | `ready_no_send` |
| payload-invalid path | `PAYLOAD_INVALID` |
| queue-intent-ready path | `ready_no_send` |
| render-ready path | `ready_no_send` |
| mandatory delivery block in no-send mode | `DELIVERY_BLOCKED_NO_SEND_MODE` |

Criteria note:

- Current production `SavedSearch` criteria include city, minimum price, beds, property type, and map bounds.
- Fixture-only contract includes max price support, but the current `SavedSearch` model does not persist max price.
- Baths/status are property facts but are not current `SavedSearch` matching criteria.

## Deduplication Results

Current dedupe key:

```text
userId + propertyId + type
```

Read-only aggregate result:

- `AlertEvent` by type: `NEW_LISTING = 273`
- duplicate `userId/propertyId/type` groups: `0`

Fixture result:

- duplicate event scenario returned `DUPLICATE_EVENT`.

Sufficient for:

- preventing repeated `NEW_LISTING` alerts for the same user/property/type.

Not sufficient for:

- preserving which saved search generated the alert;
- allowing two distinct saved searches for the same user/property to produce two distinct alert contexts;
- per-search unsubscribe attribution in queued alerts;
- precise re-entry into the exact saved-search context.

## Saved Search Attribution Finding

Finding:

`SAVED_SEARCH_ATTRIBUTION_PARTIAL`

`AlertEvent` stores `userId`, `propertyId`, and `type`, but not `savedSearchId`. `AlertQueue` stores `userId`, `status`, `payload`, `clickedAt`, and timestamps, but not `savedSearchId`.

Impact:

- A listing matching multiple saved searches for the same user is deduped at user/property/type level.
- This reduces duplicate email risk.
- It also loses search-level attribution, can blur per-search unsubscribe semantics, and can make re-entry context less precise.

This is a blocker for broad multi-search customer activation, but not for a one-row internal proof if the candidate search and property are explicitly selected and documented before send authorization.

## Consent / Unsubscribe Results

Certified behavior:

- Active subscribed saved searches can be evaluated.
- Inactive searches are blocked in fixture tests.
- Globally unsubscribed users are excluded from candidate search fetches and skipped in dry-run/live processing.
- Missing email is blocked in fixture tests and skipped in queue preview.
- Existing unsubscribe route supports global unsubscribe and per-search unsubscribe when token has `searchId`.

Aggregate posture:

- Global unsubscribed users: `0`.
- Used per-search unsubscribe tokens: `0`.
- Used global unsubscribe tokens: `1`.

Remaining consent gap:

- No saved-search-level cadence/consent preference is persisted.
- Current live alert/digest unsubscribe token creation is global in the inspected active send paths.
- Broad customer activation requires explicit consent/cadence policy before recurring customer communications.

## Queue / Stale-Row Results

Current `AlertQueue` status counts:

| Status | Count |
| --- | ---: |
| `sent` | 85 |
| `skipped` | 198 |
| `pending` | 0 |
| `processing` | 0 |
| `failed` | 0 |

Current queue-quality findings:

- Pending over 7 days: `0`.
- Pending over 30 days: `0`.
- Abandoned processing over 1 hour: `0`.
- Failed malformed payloads sampled: `0`.
- Pending preview-eligible rows: `0`.

Backlog activation finding:

- No current production pending backlog exists to release.
- Future activation remains unsafe without a fresh candidate proof because there are no pending production rows to inspect today.

## Non-Sending Preview Results

Production queue preview:

- Existing dry-run scanned `0` pending rows.
- No customer PII was returned in preview evidence.
- No email, queue, unsubscribe, CRM, or customer-data mutation occurred.

Fixture preview:

- Five fixture cases reached `ready_no_send`.
- Every render-ready fixture also carried `DELIVERY_BLOCKED_NO_SEND_MODE`.
- Fixture counters proved zero database reads, writes, provider calls, queue jobs, email logs, unsubscribe tokens, worker activation, and customer-data exposure.

No production customer preview content was generated because there were no pending queue rows.

## Email Template Safety

Active render path:

- `lib/email/sendEmail.ts`

Findings:

- Subject is factual: `David Quinn Group: {n} property intelligence update(s)`.
- Body presents factual listing fields: address, location, price, beds, baths, square feet, efficiency, resilience, and review signal.
- Property links route to provided URL or fallback `/properties/{identity}` / `/search`.
- Tracking links use `/api/track-click` when `userId` and listing identity are available.
- Unsubscribe footer renders when `unsubscribeUrl` is provided.
- Sender default is `David Quinn Group <alerts@davidquinngroup.com>` unless configured otherwise.
- HTML values are escaped.
- No active `sendEmail.ts` copy includes suitability, offer advice, valuation certainty, protected-class implication, or investment recommendation.

Safety caveat:

- Legacy template files contain stronger marketing language and should remain out of the active production path unless separately remediated. The inspected active path is `sendEmail.ts`.

## Agent-Labor Value

Classification:

`MODERATE`

Reason:

- Existing architecture can reduce manual saved-search checking and new-match preparation after a candidate event exists.
- Current zero pending rows and ambiguous `NEW_LISTING` freshness semantics limit immediate labor replacement evidence.
- Changed-listing labor replacement is not certified.

## Activation Blockers

| Blocker | Classification | Detail |
| --- | --- | --- |
| Ambiguous `NEW_LISTING` semantics | `BLOCKING` | Current type means first queued user/property/type match, not necessarily new listing date or newly active status. |
| Property freshness | `BLOCKING` | Latest 1000 sampled property rows were stale/missing under `lastIntelligenceSync` over 30 days. |
| No current pending candidate rows | `BLOCKING` | Dry-run safety passed, but no production preview candidates exist today. |
| SavedSearch attribution absent from AlertEvent/AlertQueue | `BLOCKING_FOR_BROAD_ACTIVATION` | User/property/type dedupe loses exact search attribution. |
| Consent/cadence granularity absent | `BLOCKING_FOR_BROAD_ACTIVATION` | No persisted cadence, timezone, quiet-hour, or per-search communication preference. |
| Per-search unsubscribe in active send path | `BLOCKING_FOR_BROAD_ACTIVATION` | Model supports search-level tokens, but active alert/digest token creation is global. |
| Scheduler absent | `FUTURE_ENHANCEMENT` | Not needed for internal live proof; required for recurring cadence. |
| Price/status/open-house/removal changed-listing taxonomy absent | `FUTURE_ENHANCEMENT` | Out of scope for `NEW_LISTING` certification. |

## Proposed Bounded Internal Live Proof

This is a proposal only. It was not executed.

Package name:

`REIE_SAVED_SEARCH_NEW_LISTING_ONE_ROW_INTERNAL_LIVE_PROOF`

Preconditions:

- Fresh MLS/search-index posture verified.
- One internal/test recipient and one authorized saved search selected.
- One known eligible fresh property/listing event selected or generated under explicit write authorization.
- Candidate payload inspected before send.
- `NEW_LISTING` copy constrained to "saved-search match" unless listing freshness is proven.
- Before/after counts captured for `AlertEvent`, `AlertQueue`, `EmailLog`, `UnsubscribeToken`, `UserInteraction`, and BullMQ.

Maximum mutation:

- one `AlertEvent`;
- one `AlertQueue`;
- one BullMQ alert job if queue path is used;
- one `UnsubscribeToken`;
- one `EmailLog`;
- one email to internal/test recipient only.

Explicit exclusions:

- no customer recipient;
- no scheduler;
- no continuous worker;
- no backlog release;
- no broad batch;
- no changed-listing expansion;
- no provider enrichment;
- no MLS volume increase;
- no Typesense modification;
- no CRM automation expansion.

Rollback/cleanup:

- Document before/after row ids.
- Mark test-only queue row skipped if needed under explicit authorization.
- Restore internal test user subscription state if the proof consumes a valid unsubscribe token under separate authorization.
- Do not delete audit rows unless Executive HQ separately authorizes cleanup.

## Validation Commands

Executed:

```bash
git fetch origin main
git diff --check origin/main...HEAD
git push origin main
git fetch origin main
node dist/scripts/runAlerts.js --dry-run --limit=25
node_modules/.bin/jiti scripts/runAlertIntentFixtures.ts
git diff --check
```

Additional read-only aggregate Prisma inspections were executed through direct Node/Prisma read queries. They returned aggregate counts only and did not print customer names, emails, or criteria.

## Provider Independence

Preserved:

- LightBox: `WAITING_FOR_LIGHTBOX_SUPPORT_AUTH_SCOPE_CONFIRMATION`
- LightBox evaluation calls consumed: `0`
- ATTOM: `PENDING_PROVIDER_RESPONSE`

No provider credentials were retrieved. No LightBox call was made. ATTOM was not investigated.

## Protected-System Confirmation

This certification did not:

- send email;
- call Resend send APIs;
- activate workers;
- activate scheduler/cron;
- release AlertQueue backlog;
- create production AlertEvent records;
- create production AlertQueue records;
- write EmailLog;
- modify SavedSearch;
- modify unsubscribe;
- mutate User/customer data;
- mutate CRM;
- modify Prisma schema;
- run migrations;
- modify MLS;
- modify Typesense;
- modify Vercel;
- deploy;
- call LightBox;
- retrieve LightBox credentials;
- investigate ATTOM.

## Executive Recommendation

Do not proceed directly to live customer alerts or recurring workers. The dry-run path is safe, but the next authorization should be either:

1. a narrow remediation/specification package to clarify `NEW_LISTING` semantics, fresh-candidate requirements, and saved-search attribution boundaries; or
2. a one-row internal live proof only after Executive HQ explicitly authorizes the minimal writes and one internal/test email.

Recommended next gate:

`READY_FOR_REIE_SAVED_SEARCH_NEW_LISTING_SEMANTICS_AND_INTERNAL_LIVE_PROOF_AUTHORIZATION`
