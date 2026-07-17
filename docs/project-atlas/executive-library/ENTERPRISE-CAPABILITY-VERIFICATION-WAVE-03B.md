# PROJECT ATLAS - Enterprise Capability Verification Wave 03B

## 1. Executive Summary

Wave 3B resolved the controlled tracked-link validation that stopped in Wave 3.

The production fallback host in the generated tracked URL was not reachable from DNS. `davidquinngroup.com` returned no A record and `curl` failed with host-resolution exit code 6. No hosted DNS or email replacement action was authorized.

The approved method was therefore Method B: a single local route validation with host substitution. The tracked route and destination host were changed to `localhost:3000` while preserving the selected user, listing, source, and destination path semantics. The route returned a 307 redirect and the localized property destination returned 200. The selected tracking mutation persisted exactly once.

Capability counts remain unchanged: 4 complete, 27 partial, 5 deferred, 2 not yet verified, 0 missing.

## 2. Scope and Boundaries

Authorized:

- Static route and environment inspection.
- DNS checks for the tracked host.
- Starting a confirmed local Next.js server.
- One controlled host-substituted tracked-click request for the already-sent controlled alert.
- Bounded non-mutating readiness checks after the click.

Not authorized and not performed:

- Replacement email send.
- Recurring worker or scheduler activation.
- Queue retry, queue drain, or broad alert processing.
- CRM task mutation.
- MLS Grid, OpenAI, TitlePro247, or Typesense reset/reindex activity.

## 3. Baseline

- Branch: `main`.
- Baseline commit: `0f75d97`.
- Working tree at preflight: clean.
- `.env.local`: ignored by `.gitignore:46`.
- Verification date: 2026-07-17.

## 4. DNS and Environment Finding

The existing controlled email generated a tracked route on `https://davidquinngroup.com`.

Environment inspection showed no present local value for `NEXT_PUBLIC_SITE_URL`, `PUBLIC_SITE_URL`, `VERCEL_URL`, or `NEXT_PUBLIC_VERCEL_URL`, so the email code used its production fallback host. DNS inspection then showed `davidquinngroup.com` had no A answer, and `curl` against the HTTPS host returned exit code 6.

Classification: `NONEXISTENT_HOST`.

Root cause: production fallback host was used for tracked-link generation while the apex host did not resolve.

## 5. Method Chosen

Method B - local route with host substitution.

Reason:

- The tracked route is host-independent after query validation.
- The route allow-list includes `localhost`.
- The generated link did not include an opaque token bound to the production host.
- Hosted DNS correction or replacement email send was outside Wave 3B authorization.

## 6. Controlled Target

- AlertQueue ID: `cmq0wovon012dpw1p6ebtyrj9`.
- User ID: `cmmuzx3kt00004hk64jytoihs`.
- Listing ID: `cmq0wov4p0115pw1pmo2139zu`.
- Controlled recipient: masked as `da***@gmail.com`.
- Source: `email_alert`.
- Destination path: `/properties/825-circle-dr-boulder-co-ire1328552`.

The full tracked URL is intentionally not reproduced in this evidence file.

## 7. Before State

- Selected AlertQueue row: `sent`.
- Selected `AlertQueue.clickedAt`: null.
- Selected listing click interaction count: 0.
- Selected user heat score: 0.
- Selected user's `PROPERTY_ALERT` EmailLog count: 34.
- AlertQueue status counts: 196 pending, 84 sent, 3 skipped.
- `reie-alerts`: 273 waiting, 0 active, 0 delayed, 0 failed.
- Pending `strategy_intake` CRM tasks: 1.

## 8. Route Probe

A missing-user-parameter request to `/api/track-click` on `localhost:3000` returned the expected 307 redirect to the localized property destination. Route inspection showed this path exits before tracking persistence when the user id is missing.

## 9. Controlled Click Execution

Command shape:

```sh
curl --max-time 20 --location --silent --show-error --dump-header - --output /dev/null "<host-substituted-controlled-url>"
```

Result:

- Tracking route response: 307 Temporary Redirect.
- Redirect location host: `localhost:3000`.
- Destination response: 200 OK.
- Request count with both selected user and listing identifiers: exactly 1.

## 10. After State

- Selected `AlertQueue.clickedAt`: `2026-07-17T19:26:15.042Z`.
- Selected listing click interaction count: 1.
- Selected user heat score: 5.
- Selected user's `PROPERTY_ALERT` EmailLog count: 34.
- AlertQueue status counts: 196 pending, 84 sent, 3 skipped.
- Pending `strategy_intake` CRM tasks: 1.
- CRMTask `751fa51e-4a2e-411f-97df-c320e974e058`: still `pending`.

## 11. Queue and Readiness Evidence

Post-click queue dashboard:

- `reie-alerts`: 273 waiting, 0 active, 0 delayed, 0 failed.
- Dead-letter queue: 0 waiting, 0 active, 0 delayed, 0 failed.

Post-click alert readiness:

- Readiness level: `watch`.
- Pending saved-search alert rows: 196.
- Failed alert rows: 0.
- Processing alert rows: 0.
- Readiness command declared `sendsEmail: false` and `mutatesRows: false`.

## 12. Side Effects

Expected and accepted:

- One `LISTING_CLICK` interaction was created.
- The matching selected AlertQueue row received `clickedAt`.
- The selected user heat score increased by exactly 5.

Not observed:

- No new email was sent.
- No EmailLog count increase occurred.
- No BullMQ job was consumed.
- No CRM task changed.
- No queue retry, scheduler, worker, MLS Grid, OpenAI, TitlePro247, or Typesense operation occurred.

## 13. Residual Finding

The click route calls `updateUserPreferences()` asynchronously after tracking. During the local validation, that preference-refresh path logged Prisma `P2022` because the current database lacks `UserPreference.createdAt`.

The error did not prevent click tracking, `clickedAt`, heat-score, redirect, or property-page success. It should be treated as a separate launch-readiness defect for schema/runtime alignment before recurring engagement analytics are relied on.

Wave 3D update: `20260717133000_repair_user_preference_schema_parity` was applied and `updateUserPreferences()` was revalidated successfully. The `P2022` preference-refresh residual is resolved. DNS/site URL correction remains separate.

## 14. Gate Result

`W3-CLICK-001`: `EXECUTED_PASS_WITH_FOLLOW_UP`.

The controlled tracked-email click requirement is resolved for prelaunch evidence. Recurring email/scheduler activation is still not recommended until the remaining gates are handled.

## 15. Remaining Launch Gates

- Saved-search alert review: `WATCH` - 196 pending rows remain for operator review before broad live processing.
- Alert queue backlog: `WATCH` - `reie-alerts` remains 273 waiting with no active, delayed, or failed jobs.
- Strategy intake CRM review: `WATCH` - one pending medium-priority `strategy_intake` task remains.
- Preference-refresh schema alignment: `RESOLVED` - Wave 3D applied schema parity and revalidated `updateUserPreferences()` without `P2022`.

## 16. Capability Effects

| Capability | Effect |
| --- | --- |
| PROD-007 Notifications | Controlled click evidence now passed; recurring operations remain gated by alert review/backlog readiness. |
| INTEL-002 Customer Intelligence | One click signal, `clickedAt`, and heat-score mutation persisted; preference-refresh schema drift remains a follow-up. |
| OPS-005 Reliability | Queue state stayed stable; full production monitoring proof remains incomplete. |
| COMM-001 CRM | No CRM mutation occurred; the pending strategy_intake task remains in watch. |

## 17. Recommendation

Do not activate recurring email, alert workers, schedulers, or bulk saved-search processing yet.

Next recommended controlled work:

1. Perform human/operator review of the 196 pending saved-search alert rows.
2. Complete or explicitly defer CRMTask `751fa51e-4a2e-411f-97df-c320e974e058`.
3. Correct hosted DNS/site URL configuration.
4. Refresh full launch readiness after the remaining gates are handled.

## 18. Commands Intentionally Not Run

- Replacement tracked email send.
- `npm run run:worker:alerts`.
- `npm run run:worker:alerts:once`.
- `npm run run:worker:alerts:once:live`.
- `npm run run:alerts:dry`.
- `npm run run:alerts:live`.
- Queue retries.
- Saved-search alert dry-runs.
- CRM task PATCH/closure.
- CRM scheduler activation.
- Recurring email or digest activation.
- MLS Grid requests.
- OpenAI calls.
- TitlePro247 calls.
- Typesense reset/reindex.
- `npm run smoke:property-inquiry`.
