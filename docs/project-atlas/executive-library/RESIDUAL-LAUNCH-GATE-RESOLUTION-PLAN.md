# PROJECT ATLAS - Residual Launch Gate Resolution Plan

Generated: 2026-07-17  
Source wave: Enterprise Capability Verification Wave 3E  
Mode: authorization plan only

## Purpose

This plan packages the remaining REIE launch gates into bounded owner decisions and execution packages. It is intentionally non-mutating. It does not authorize live operations by itself.

## Current Gate State

| Gate | Status | Required Before | Resolution Owner |
| --- | --- | --- | --- |
| Additive admin intake readiness indexes | `WATCH_RECOMMENDED_BEFORE_LAUNCH` | final migration/deploy sequence | technical operator |
| Synthetic/example.com strategy_intake CRM task | `WATCH_SAFE_CONTROLLED_COMPLETION` | scheduler cadence escalation | executive/admin operator |
| Production DNS/site URL | `WATCH_REQUIRED_BEFORE_PUBLIC_EMAIL` | public email and public launch | domain/hosting owner |
| AlertQueue operator review | `WATCH` | recurring saved-search email | operator |
| reie-alerts waiting backlog | `WATCH` | live queue-worker activation | operator |
| Final readiness refresh | `PENDING` | deployment and recurring operations | technical operator |

## Package A - Apply Admin Intake Readiness Indexes

Classification: `RECOMMENDED_BEFORE_LAUNCH`.

Scope:

- Apply `20260613093000_add_admin_intake_readiness_indexes`.
- Create five indexes on `CRMTask` and `UserInteraction`.
- Mutate zero application rows.

Execution rule:

- If it remains the sole pending migration, use `npx prisma migrate deploy`.
- If any additional pending migration appears, do not use broad deploy; apply exact reviewed SQL and mark only this migration applied.

Validation:

- Confirm the five indexes exist in `pg_indexes`.
- Confirm `_prisma_migrations` records the migration.
- Confirm `npx prisma migrate status` is clean or contains only explicitly deferred migrations.

Rollback:

- Use a new forward migration to drop these exact indexes if needed.

## Package B - Complete Controlled CRM Task

Classification: `SAFE_CONTROLLED_COMPLETION`.

Scope:

- One task: `751fa51e-4a2e-411f-97df-c320e974e058`.
- Current status: `pending`.
- Current priority: `medium`.
- Lead domain: `example.com`.

Authorized action:

- PATCH status to `completed`.
- Keep priority `medium`.
- Add review note: `Wave 3E controlled resolution: synthetic/example.com strategy_intake reviewed; no customer action required.`

Expected side effects:

- One `CRMTask` row updated.
- No email.
- No queue job.
- No scheduler activation.
- No lead scoring.

Validation:

- Admin task GET shows completed status and review metadata.
- `npm run run:crm:pending` shows zero pending `strategy_intake` tasks, unless another task appears.
- Launch readiness moves CRM active-review gate from watch to pass or explains any remaining watch.

Rollback:

- PATCH the same task back to `pending` with a rollback review note.

## Package C - Correct Production DNS and Site URL

Classification: `REQUIRED_BEFORE_PUBLIC_EMAIL` and `REQUIRED_BEFORE_PUBLIC_LAUNCH`.

Recommended canonical host:

- `https://davidquinngroup.com`.

Owner actions:

- Connect apex `davidquinngroup.com` to the production hosting project with provider-specified DNS.
- Configure `www.davidquinngroup.com` as alias or redirect to apex.
- Set production `NEXT_PUBLIC_SITE_URL` and `PUBLIC_SITE_URL` to `https://davidquinngroup.com`.
- Redeploy after environment changes.

Validation:

- Apex and www DNS resolve.
- HTTPS certificate is valid.
- `www` redirects or aliases according to the owner decision.
- Canonical metadata uses the chosen URL.
- A new controlled internal tracked-link test passes on the production domain.

## Package D - Stage Alert Activation

Classification: `CONTROLLED_MUTATION_REQUIRES_AUTHORIZATION`.

Prerequisites:

- DNS package complete for production-domain email links.
- CRM package complete or explicitly waived.
- Queue dashboard shows no failed/dead-letter surprise.
- Operator reviews pending rows before any broad live processing.

Stage 1:

- Dry-run/preview only.
- No row changes.
- Internal/test recipients only.
- Stop on any unexpected customer recipient or malformed payload.

Stage 2:

- Internal controlled live batch.
- 1 to 5 selected rows.
- Prefer exact row IDs over broad queue consumption.
- Verify EmailLog, tracking, unsubscribe, AlertQueue status, queue dashboard, and dead letters.

Stage 3:

- Limited customer pilot.
- 5 to 10 reviewed recipients unless authorization sets another cap.
- Daily review and readiness refresh.

Stage 4:

- Bounded recurring cadence.
- Low concurrency, per-run cap, documented stop conditions.

Stage 5:

- Normal production only after a clean observation window.

## Stop Conditions

Stop launch activation if any of these occur:

- DNS/SSL/canonical validation fails.
- Production-domain tracked link fails.
- Email sends to an unapproved recipient.
- Alert row fails, dead-letter job appears, or queue retries are required.
- Unsubscribe link fails.
- CRM task state changes unexpectedly.
- Launch or notification readiness reports an unaccepted failure.
- Any live worker consumes more than the authorized cap.

## Final Prelaunch Readiness Set

Run only after the authorized packages above are complete:

- `npx prisma validate`.
- `npm run lint`.
- `npm run typecheck`.
- `npm run worker:build`.
- `npm run check:alert-notification-readiness`.
- `npm run check:notification-readiness:strict-contract`.
- `npm run check:launch-readiness`.
- `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`.
- `npm run run:crm:pending`.
- `git diff --check`.
- `git status --short`.

## Explicit Non-Authorization

This plan does not authorize:

- Live workers.
- Live email sends.
- Queue retries.
- Scheduler activation.
- MLS Grid requests.
- OpenAI calls.
- TitlePro247 activation.
- Typesense reset/reindex.
- Deployment.
- CRM mutation.
- Migration application.
