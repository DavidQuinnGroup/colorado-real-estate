# PROJECT ATLAS - Enterprise Capability Verification Wave 03

## 1. Executive Summary

Wave 3 executed the first controlled launch-gate validation step and then stopped at the tracked-click gate. Wave 3B later resolved the tracked-click gate through one authorized local host-substituted route validation.

`W3-ALERT-001` passed: exactly one selected saved-search alert row was sent to the controlled internal recipient. No BullMQ worker was started, no queue job was consumed, no batch was run, and no retry or queue drain occurred.

`W3-CLICK-001` stopped during Wave 3 because the single tracked-link request failed at the curl/DNS layer with exit code 6 before HTTP response headers were returned. Wave 3B classified the root cause as a non-resolving production fallback host and proved the click route once through `localhost`.

Because `W3-CLICK-001` hit a Wave 3 stop condition, `W3-CRM-001` was not executed. Wave 3B refreshed selected-record, queue, and alert-readiness evidence after the controlled click.

No capability status was upgraded. Capability counts remain 4 complete, 27 partial, 5 deferred, 2 not yet verified, 0 missing.

## 2. Baseline

- Branch: `main`
- Baseline commit: `e50106e`
- Controlled validation plan: committed before execution
- Working tree at execution preflight: clean
- `.env.local`: ignored by `.gitignore:46`
- Verification date: 2026-07-17

## 3. Authorized Actions

| Gate | Authorized | Executed | Result |
| --- | --- | --- | --- |
| `W3-ALERT-001` | Yes | Yes | `EXECUTED_PASS` |
| `W3-CLICK-001` | Yes | Attempted once in Wave 3; resolved once in Wave 3B | `EXECUTED_PASS_WITH_FOLLOW_UP` |
| `W3-CRM-001` | Yes, conditional | No | `STOPPED` |
| `W3-READINESS-001` | Yes, conditional | Partial evidence refresh only | `PARTIAL` |

No recurring worker, scheduler, batch-processing, queue-draining, bulk-send, CRM cadence escalation, MLS Grid, OpenAI, TitlePro247, Typesense reset/reindex, or queue retry authorization was granted or used.

## 4. W3-ALERT-001 Evidence

Authorized target:

- AlertQueue ID: `cmq0wovon012dpw1p6ebtyrj9`
- User ID: `cmmuzx3kt00004hk64jytoihs`
- Controlled recipient: masked as `da***@gmail.com`
- Listing ID: `cmq0wov4p0115pw1pmo2139zu`

Command executed:

```sh
node --input-type=module -e 'import "./dist/lib/env/loadNodeEnv.js"; import { processAlertById } from "./dist/lib/alerts/processAlertQueue.js"; import { prisma } from "./dist/lib/prisma.js"; const result = await processAlertById("cmq0wovon012dpw1p6ebtyrj9", false); console.log(JSON.stringify(result, null, 2)); await prisma.$disconnect(); if (result.status !== "sent") process.exitCode = 1;'
```

Before:

- Selected AlertQueue row: `pending`.
- AlertQueue status counts: 197 pending, 83 sent, 3 skipped.
- Selected user's `PROPERTY_ALERT` EmailLog count: 33.
- Selected listing click interaction count: 0.
- Selected user heat score: 0.
- `reie-alerts`: 273 waiting, 0 active, 0 delayed, 0 failed.

After:

- Command result: `status: "sent"`.
- Selected AlertQueue row: `sent`.
- Email sent count: 1.
- Recipient count: 1.
- Selected user's `PROPERTY_ALERT` EmailLog count: 34.
- AlertQueue status counts: 196 pending, 84 sent, 3 skipped.
- `reie-alerts`: 273 waiting, 0 active, 0 delayed, 0 failed.
- Jobs processed by BullMQ worker: 0.
- Retries: 0.
- Open dead-letter records: 0.
- CRM changes: 0.
- Tracked link: present and well-formed.
- Additional expected email-safety side effect: one unsubscribe token was created for the selected user through `createUnsubscribeUrl()`.

Classification: `EXECUTED_PASS`.

## 5. W3-CLICK-001 Evidence

Tracked route:

```text
https://davidquinngroup.com/api/track-click?u=<selected-user>&l=<selected-listing>&src=email_alert&to=<encoded-property-destination>
```

Command executed:

```sh
curl --max-time 20 -s -D - -o /dev/null "<tracked-url>"
```

Result:

- Curl exit code: 6.
- HTTP status: none returned.
- Redirect destination: none returned.
- The request failed before response headers were captured.

Before click attempt:

- Selected `AlertQueue.clickedAt`: null.
- Selected listing click interaction count: 0.
- Selected user heat score: 0.
- CRMTask `751fa51e-4a2e-411f-97df-c320e974e058`: `pending`.

After click attempt:

- Selected `AlertQueue.clickedAt`: null.
- Selected listing click interaction count: 0.
- Selected user heat score: 0.
- CRMTask `751fa51e-4a2e-411f-97df-c320e974e058`: `pending`.
- Queue counts unchanged.

Acceptance criteria were not met because the tracked event was not persisted. Per the authorized stop conditions, execution stopped and did not proceed to CRM closure.

Classification after Wave 3: `STOPPED`.

Wave 3B resolution:

- DNS/root cause: `davidquinngroup.com` returned no A answer, so the original production fallback host was not reachable.
- Method used: Method B local route with host substitution.
- Tracking route response: 307 Temporary Redirect.
- Localized destination response: 200 OK.
- Selected `AlertQueue.clickedAt`: `2026-07-17T19:26:15.042Z`.
- Selected listing click interaction count: 1.
- Selected user heat score: 5.
- Selected user's `PROPERTY_ALERT` EmailLog count: 34.
- Queue counts unchanged at `reie-alerts` 273 waiting, 0 active, 0 delayed, 0 failed.
- CRMTask `751fa51e-4a2e-411f-97df-c320e974e058` remained `pending`.

Wave 3B classification: `EXECUTED_PASS_WITH_FOLLOW_UP`.

Follow-up: the async `updateUserPreferences()` post-click path logged Prisma `P2022` because the current database lacks `UserPreference.createdAt`. This did not block click tracking, but it is a separate schema/runtime alignment risk.

## 6. W3-CRM-001 Evidence

Authorized target:

- CRMTask ID: `751fa51e-4a2e-411f-97df-c320e974e058`
- Lead ID: `cmpd902h3000b7pvbfc8ax6e8`
- Masked lead email: `co***@example.com`
- Task type: `strategy_intake`
- Status before Wave 3: `pending`
- Priority: `medium`
- Classification before execution: synthetic/test-like based on masked `@example.com` address

Execution:

- Not executed.
- Reason: `W3-CLICK-001` stopped after the tracked-link request failed.

After:

- CRMTask remained `pending`.
- Pending `strategy_intake` count remained 1.
- Emails sent by CRM action: 0.
- New tasks created: 0.
- Queue jobs created by CRM action: 0.
- Cadence changes: 0.

Classification: `STOPPED`.

## 7. W3-READINESS-001 Evidence

Full bounded readiness refresh was not executed in Wave 3 because execution stopped at `W3-CLICK-001`. Wave 3B added bounded queue and alert-readiness refreshes after the resolved click.

Partial evidence refreshes executed:

- Selected-record inspection after alert send and click attempt.
- `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000` after alert send.

Results:

- `reie-alerts`: 273 waiting, 0 active, 0 delayed, 0 failed.
- Dead-letter queue: 0 waiting, 0 active, 0 delayed, 0 failed.
- AlertQueue status counts after Wave 3 stop: 196 pending, 84 sent, 3 skipped.
- CRM pending `strategy_intake` count: 1.
- Alert readiness after Wave 3B: `watch`; 196 pending, 0 failed, 0 processing.

Classification: `PARTIAL`.

## 8. Gap Effects

| Gap | Effect | Reason |
| --- | --- | --- |
| GAP-001 | `PARTIAL_REDUCED_STILL_OPEN` | One controlled alert send and one controlled tracked click succeeded, but 196 pending alert rows still require operator review before broad live processing. |
| GAP-002 | `UNCHANGED_OPEN` | Queue counts stayed stable and no dead letters appeared, but full readiness refresh and monitoring proof remain incomplete. |
| GAP-004 | `UNCHANGED_OPEN` | CRM task closure was not authorized in Wave 3B and remains a separate controlled launch gate. |

No capability gaps were closed in Wave 3B; the tracked-click gate was resolved, while alert operator review, queue/watch readiness, CRM review, and preference-refresh schema alignment remain open.

## 9. Launch Recommendation

Do not activate recurring email, alert workers, schedulers, or bulk saved-search processing yet.

Required next actions:

1. Resolve or explicitly accept the `UserPreference.createdAt` schema/runtime mismatch surfaced by the async preference refresh.
2. Complete or intentionally defer the CRM task with explicit authorization.
3. Keep saved-search backlog processing disabled until operator review and readiness refreshes are complete.
4. Correct hosted DNS/site URL configuration before relying on production-domain tracked links.

## 10. Commands Intentionally Not Run

- `npm run run:worker:alerts`
- `npm run run:worker:alerts:once`
- `npm run run:worker:alerts:once:live`
- `npm run run:alerts:dry`
- `npm run run:alerts:live`
- Queue retries
- Saved-search alert dry-runs
- CRM task PATCH/closure
- CRM scheduler activation
- Recurring email or digest activation
- MLS Grid requests
- OpenAI calls
- TitlePro247 calls
- Typesense reset/reindex
- `npm run smoke:property-inquiry`
