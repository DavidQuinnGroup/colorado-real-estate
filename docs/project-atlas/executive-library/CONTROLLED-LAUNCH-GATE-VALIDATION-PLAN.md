# PROJECT ATLAS - Controlled Launch Gate Validation Plan

Generated: 2026-07-17
Baseline commit: `9aee27f`
Branch: `main`
Authorization state: controlled execution authorized and partially executed

## 1. Executive Boundary

This plan prepares the smallest controlled validations for tracked-email click handling, the pending `strategy_intake` CRM task, saved-search alert readiness, and recurring scheduler/email activation readiness.

Plan creation did not execute live actions. A later executive authorization approved one controlled alert send, one tracked click, one CRM task closure, and bounded readiness refreshes in strict sequence.

Wave 3 execution stopped at `W3-CLICK-001` after the tracked-link request failed before returning HTTP response headers. Wave 3B resolved the click gate through one authorized local host-substituted route validation. `W3-CRM-001` was not executed and remains in watch.

## 2. Preflight Evidence

| Check | Result |
| --- | --- |
| Branch | `main` |
| Working tree at preflight | Clean |
| HEAD | `9aee27f` |
| Latest commit | `9aee27f Close Repository verification hygiene gaps` |
| `.env.local` | Ignored by `.gitignore:46:.env*.local` |

Read-only planning refreshes:

| Command | Result |
| --- | --- |
| `npm run run:crm:pending` | Passed; one pending `strategy_intake` task found. |
| `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000` | Passed; `reie-alerts` has 273 waiting, 0 active, 0 delayed, 0 failed. |
| `npm run check:alert-notification-readiness` | Passed with `watch`; 197 pending alert rows, 0 failed, 0 processing. |

## 3. Gate W3-CLICK-001 - Tracked-Email Click Path

| Field | Plan |
| --- | --- |
| Gate ID | `W3-CLICK-001` |
| Capability | `PROD-007 Notifications`; `INTEL-002 Customer Intelligence`; `COMM-001 CRM` |
| Purpose | Validate that one controlled tracked listing click records analytics and lead-scoring evidence without recurring scheduler activation. |
| Exact command or UI action | After the one-email send in `W3-ALERT-001`, open exactly one tracked `/api/track-click?u=...&l=...&src=email_alert&to=...` link from the delivered email once. |
| Environment | Production site URL currently resolves to `https://davidquinngroup.com` in readiness output. |
| Target record | AlertQueue `cmq0wovon012dpw1p6ebtyrj9`; user `cmmuzx3kt00004hk64jytoihs`; listing `cmq0wov4p0115pw1pmo2139zu`. |
| Sender | `RESEND_FROM_EMAIL` readiness check resolves to masked `al***@davidquinngroup.com`. |
| Recipient | Controlled internal executive recipient, masked as `da***@gmail.com` in readiness output. |
| Expected database changes | One `UserInteraction` with `type='LISTING_CLICK'`; matching `AlertQueue.clickedAt` set if still null; `User.heatScore` increments by 5. |
| Expected queue changes | No BullMQ job consumption; no broad queue drain. The selected AlertQueue row should already be `sent` if paired with `W3-ALERT-001`. |
| Expected logs | Route may log only failures or non-tracked redirects; successful redirect is expected to return a redirect with `Cache-Control: no-store`. |
| Expected analytics | One listing click interaction with metadata containing listing id, source, destination, and tracked timestamp. |
| Duplicate-prevention mechanism | `AlertQueue.clickedAt` only updates when currently null; however repeated clicks are not fully idempotent because each click creates another `UserInteraction` and increments `User.heatScore` again. |
| Stop condition | Stop after one click and one evidence inspection. Do not click again. |
| Cleanup or rollback | If cleanup is explicitly required, delete the specific `UserInteraction` created during the test, subtract 5 from that user only if no other legitimate heat-score change occurred, and clear `AlertQueue.clickedAt` only for the selected row. |
| Success evidence | Redirect succeeds; one new `LISTING_CLICK`; selected `AlertQueue.clickedAt` is populated; selected user heat score increases by exactly 5. |
| Failure evidence | Redirect succeeds but no interaction; unexpected duplicate interaction; heat score changes by anything other than +5; unrelated alert rows updated. |
| Risk level | Medium, because click tracking mutates analytics and lead score. |
| Authorization status | `EXECUTED_PASS_WITH_FOLLOW_UP` - Wave 3 stopped on DNS exit code 6; Wave 3B resolved with exactly one local host-substituted click. `clickedAt` was populated, one click interaction persisted, and heat score increased by 5. Async preference refresh logged a separate `UserPreference.createdAt` schema drift follow-up. |

## 4. Gate W3-CRM-001 - Pending Strategy Intake CRM Task

| Field | Plan |
| --- | --- |
| Gate ID | `W3-CRM-001` |
| Capability | `COMM-001 CRM` |
| Purpose | Validate controlled human-review closure for the single pending `strategy_intake` task without scheduler cadence escalation. |
| Exact command or UI action | `curl --max-time 8 -s -X PATCH "http://localhost:3000/api/admin/crm-tasks/751fa51e-4a2e-411f-97df-c320e974e058" -H "x-admin-key: $REIE_ADMIN_API_KEY" -H "Content-Type: application/json" -d '{"status":"completed","priority":"medium","reviewNote":"Wave 3 controlled validation: synthetic strategy_intake reviewed; no customer action required.","reviewedBy":"executive-approval"}'` |
| Environment | Local admin route against the configured database, with admin key. |
| Target record | CRMTask `751fa51e-4a2e-411f-97df-c320e974e058`; lead `cmpd902h3000b7pvbfc8ax6e8`. |
| Sender | Not applicable. |
| Recipient | Not applicable. |
| Expected database changes | `CRMTask.status` changes from `pending` to `completed`; priority remains `medium`; `metadata.review` receives status, priority, review note, reviewedBy, reviewedAt, and completedAt. |
| Expected queue changes | None. |
| Expected logs | Admin route should return JSON with `success: true`; no email send path is called by this route. |
| Expected analytics | None. |
| Duplicate-prevention mechanism | Closure requires an explicit review note for completed/dismissed states; task id is exact and singular. |
| Stop condition | Stop after the PATCH and one GET/read-only CRM refresh confirm only this task changed. |
| Cleanup or rollback | Compensating action is PATCH back to `pending` with a rollback review note. Full removal of review metadata would require a separate explicitly approved database maintenance action. |
| Success evidence | Task transitions to `completed`; pending `strategy_intake` count becomes 0; closure audit remains 100% note-covered. |
| Failure evidence | Task not found; route rejects review note; any additional CRM task changes; pending count remains 1. |
| Risk level | Low to medium. The record appears synthetic/test-like from masked `co***@example.com`, but it is still a database mutation. |
| Authorization status | `STOPPED` - authorized but not executed because `W3-CLICK-001` hit its stop condition. |

## 5. Gate W3-ALERT-001 - Isolated Saved-Search Alert Send

| Field | Plan |
| --- | --- |
| Gate ID | `W3-ALERT-001` |
| Capability | `PROD-007 Notifications`; `OPS-005 Reliability` |
| Purpose | Validate exactly one saved-search alert send to a controlled internal recipient without processing the 273-job backlog. |
| Exact command or UI action | `node --input-type=module -e 'import "./dist/lib/env/loadNodeEnv.js"; import { processAlertById } from "./dist/lib/alerts/processAlertQueue.js"; import { prisma } from "./dist/lib/prisma.js"; const result = await processAlertById("cmq0wovon012dpw1p6ebtyrj9", false); console.log(JSON.stringify(result, null, 2)); await prisma.$disconnect(); if (result.status !== "sent") process.exitCode = 1;'` |
| Environment | Local Node command using compiled worker library and configured production/staging env. |
| Target record | AlertQueue `cmq0wovon012dpw1p6ebtyrj9`; user `cmmuzx3kt00004hk64jytoihs`; listing `cmq0wov4p0115pw1pmo2139zu`. |
| Sender | `RESEND_FROM_EMAIL` readiness check resolves to masked `al***@davidquinngroup.com`. |
| Recipient | Controlled internal executive recipient, masked as `da***@gmail.com`. |
| Expected database changes | Selected AlertQueue row transitions from `pending` to `sent`; one `EmailLog` with type `PROPERTY_ALERT` is created for the selected user. |
| Expected queue changes | No BullMQ worker starts; no waiting job is consumed; `reie-alerts` waiting count should remain 273 unless a later approved cleanup removes or reconciles the selected queued job. |
| Expected logs | Command prints one JSON result with `status: "sent"` or an explicit failure reason. |
| Expected analytics | None until the recipient clicks the tracked link under `W3-CLICK-001`. |
| Duplicate-prevention mechanism | `processAlertById` claims only the selected alert row before send; non-pending/non-processing states are skipped. Stable BullMQ job id remains `alert-<alertId>` for queued-worker paths. |
| Stop condition | Stop immediately after one selected row result; do not run `run:worker:alerts`, `run:alerts:live`, queue retry, or recurring worker commands. |
| Cleanup or rollback | If rollback is explicitly required, set selected AlertQueue row back to `pending`, delete the matching `PROPERTY_ALERT` EmailLog created during the test, and document whether the untouched BullMQ waiting job remains. |
| Success evidence | One email delivered to controlled internal recipient; selected AlertQueue row `sent`; one EmailLog; queue dashboard still shows no active/delayed/failed alert jobs. |
| Failure evidence | Send fails; selected row becomes `failed`; any non-selected AlertQueue rows change; any queue worker drains jobs. |
| Risk level | Medium, because one live email is sent and one database row is mutated. |
| Authorization status | `EXECUTED_PASS` - one selected alert row sent to the controlled internal recipient; no BullMQ job was consumed. |

## 6. Gate W3-READINESS-001 - Bounded Readiness Refresh

| Field | Plan |
| --- | --- |
| Gate ID | `W3-READINESS-001` |
| Capability | `OPS-005 Reliability`; `PROD-007 Notifications`; `COMM-001 CRM` |
| Purpose | Refresh non-mutating launch evidence before and after any approved controlled actions. |
| Exact command or UI action | `npm run check:alert-notification-readiness`; `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`; `npm run run:crm:pending`; final static checks `npm run lint`, `npm run typecheck`, `npm run worker:build`, `git diff --check`. |
| Environment | Local Terminal 5. |
| Target record | Read-only aggregate checks; no write target. |
| Sender | Not applicable. |
| Recipient | Not applicable. |
| Expected database changes | None; readiness output declares `sendsEmail: false` and `mutatesRows: false` for alert readiness. |
| Expected queue changes | None; queue dashboard reads counts only. |
| Expected logs | JSON/human-readable readiness output. |
| Expected analytics | None. |
| Duplicate-prevention mechanism | Not applicable; read-only. |
| Stop condition | Stop if any readiness command reports blocked/fail or if counts differ unexpectedly before state-changing approvals. |
| Cleanup or rollback | None expected. |
| Success evidence | Alert readiness remains `watch` or improves after authorized actions; queue counts show no unexpected active/delayed/failed jobs; CRM pending count reflects only authorized CRM action. |
| Failure evidence | Unexpected mutations, queue activity, failed jobs, or blocked readiness. |
| Risk level | Low. |
| Authorization status | `PARTIAL` - queue and selected-record evidence were refreshed after the stopped click attempt; full post-CRM readiness refresh was not executed because sequencing stopped. |

## 7. Scheduler and Recurring Activation Readiness

Recurring scheduler/email activation is not part of this execution plan. It remains gated until:

- `W3-ALERT-001` and `W3-CLICK-001` pass, if authorized.
- `W3-CRM-001` passes or is consciously deferred.
- Queue dashboard shows no unexpected active/delayed/failed work.
- Alert readiness remains non-blocked and operator review of pending rows is complete.
- `UserPreference.createdAt` schema/runtime drift from the async post-click preference refresh is resolved or explicitly accepted.

No recurring worker, scheduler, digest sender, live alert batch, or broad backlog processor should be started during Wave 3.

## 8. Authorization Checkpoint

Separate executive authorization is required before any of the following:

1. Send exactly one selected saved-search alert email to the controlled internal recipient.
2. Click exactly one tracked email link.
3. Complete the selected synthetic-looking `strategy_intake` CRM task.
4. Run post-action readiness refreshes against the mutated state.

Suggested authorization wording:

> I authorize Wave 3 Gate W3-ALERT-001 for AlertQueue `cmq0wovon012dpw1p6ebtyrj9`, W3-CLICK-001 for one click by the controlled internal recipient, W3-CRM-001 for CRMTask `751fa51e-4a2e-411f-97df-c320e974e058`, and W3-READINESS-001 post-action refreshes. Do not execute any other live action.

## 9. Wave 3 Execution Record

Execution date: 2026-07-17
Baseline commit: `e50106e`

| Gate | Classification | Evidence |
| --- | --- | --- |
| `W3-ALERT-001` | `EXECUTED_PASS` | `processAlertById("cmq0wovon012dpw1p6ebtyrj9", false)` returned `status: "sent"` for the selected row and controlled recipient. |
| `W3-CLICK-001` | `EXECUTED_PASS_WITH_FOLLOW_UP` | Wave 3 stopped on DNS exit code 6. Wave 3B used one authorized local host-substituted tracked-click request, returned 307 then 200, set `clickedAt`, created exactly one listing click interaction, and increased heat score from 0 to 5. |
| `W3-CRM-001` | `STOPPED` | Not executed because `W3-CLICK-001` triggered the stop condition. CRMTask `751fa51e-4a2e-411f-97df-c320e974e058` remained `pending`. |
| `W3-READINESS-001` | `PARTIAL` | Queue, selected-record, and alert readiness evidence were refreshed after Wave 3B. Full post-CRM readiness refresh was not executed because CRM closure remains out of scope. |

Before `W3-ALERT-001`:

- Selected AlertQueue row `cmq0wovon012dpw1p6ebtyrj9`: `pending`.
- Selected recipient: controlled internal recipient masked as `da***@gmail.com`.
- AlertQueue status counts: 197 pending, 83 sent, 3 skipped.
- Selected user's `PROPERTY_ALERT` EmailLog count: 33.
- Selected listing click interaction count: 0.
- Selected user heat score: 0.
- `reie-alerts`: 273 waiting, 0 active, 0 delayed, 0 failed.
- CRMTask `751fa51e-4a2e-411f-97df-c320e974e058`: `pending`, synthetic/test-like masked `co***@example.com`, medium priority.

After `W3-ALERT-001`:

- Selected AlertQueue row: `sent`.
- Email sent count: 1.
- Recipient count: 1.
- Jobs processed by BullMQ worker: 0.
- AlertQueue status counts: 196 pending, 84 sent, 3 skipped.
- Selected user's `PROPERTY_ALERT` EmailLog count: 34.
- Unsubscribe-token count for the selected recipient increased through the approved email safety path; latest token id `cmrpbgp1n0001131seddqga0z`.
- `reie-alerts`: 273 waiting, 0 active, 0 delayed, 0 failed.
- No CRM state change.
- Valid tracked URL generated for `/api/track-click`.

`W3-CLICK-001` attempt:

- Command: `curl --max-time 20 -s -D - -o /dev/null "<tracked-url>"`.
- Result: curl exit code 6, no HTTP response headers returned.
- Post-check: `AlertQueue.clickedAt` remained null; selected listing click interaction count remained 0; selected user heat score remained 0; CRM task remained pending.

Unexpected effects:

- No unexpected queue drain, retry, CRM mutation, scheduler activation, MLS/Grid/OpenAI/TitlePro247 call, or Typesense action occurred.
- The email path created an unsubscribe token for the selected recipient; this is expected from `createUnsubscribeUrl()` during alert sending and stayed within the approved one-email path.

## 10. Wave 3B Tracked-Link Resolution

Execution date: 2026-07-17
Baseline commit: `0f75d97`

DNS/environment result:

- The generated tracked URL used the production fallback host.
- `davidquinngroup.com` returned no A answer and `curl` failed with host-resolution exit code 6.
- No hosted DNS correction or replacement email send was authorized.

Method:

- Method B - local route with host substitution.
- Started a local Next.js server on `localhost:3000`.
- Verified the route with a missing-user-parameter probe that returned 307 without tracking persistence.
- Executed exactly one controlled click request with the selected user/listing/source and localized destination host.

After Wave 3B:

- Route returned 307 to the localized property page.
- Localized destination returned 200.
- Selected `AlertQueue.clickedAt`: `2026-07-17T19:26:15.042Z`.
- Selected listing click interaction count: 1.
- Selected user heat score: 5.
- Selected user's `PROPERTY_ALERT` EmailLog count: 34.
- AlertQueue status counts: 196 pending, 84 sent, 3 skipped.
- `reie-alerts`: 273 waiting, 0 active, 0 delayed, 0 failed.
- Pending `strategy_intake` CRM count: 1.

Follow-up:

- The async `updateUserPreferences()` path logged Prisma `P2022` because the current database lacks `UserPreference.createdAt`. Tracking succeeded, but schema/runtime alignment should be addressed before relying on recurring engagement preference updates.
