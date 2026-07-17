# PROJECT ATLAS - Enterprise Capability Verification Wave 3E

Residual Launch Gate Resolution Planning

Baseline: `b5c20f8`  
Verification date: 2026-07-17  
Mode: planning, inspection, and non-mutating validation only

## 1. Executive Summary

Wave 3E did not apply migrations, mutate CRM data, change DNS or environment variables, deploy, send email, process queue jobs, retry queue jobs, activate workers or schedulers, call MLS Grid, call OpenAI, call TitlePro247, or reset/reindex Typesense.

The remaining launch posture is `WATCH`, not `BLOCKED`, because the residual items are operational activation gates with bounded resolution paths:

- One unapplied additive index migration should be authorized before final launch deployment sequencing.
- One synthetic/example.com `strategy_intake` CRM task is safe for controlled completion after explicit authorization.
- Hosted DNS/site URL configuration must be corrected by the owner before production-domain email links are relied on.
- Saved-search alert activation must be staged because `AlertQueue` rows and `reie-alerts` BullMQ jobs both remain present.

No capability status was upgraded or downgraded.

## 2. Baseline

Repository baseline:

- Branch: `main`.
- Baseline commit: `b5c20f8`.
- Prior Wave 3D commit: `b5c20f8 Apply and verify UserPreference schema parity`.
- `.env.local`: ignored by `.gitignore` and not committed.

Operational baseline carried forward:

- `AlertQueue`: 196 pending, 84 sent, 3 skipped.
- `reie-alerts`: 273 waiting, 0 active, 0 delayed, 0 failed.
- Dead-letter open count: 0.
- CRM: one pending medium-priority `strategy_intake` task.
- Controlled tracked click: `RESOLVED_WITH_NONBLOCKING_DNS_FOLLOW_UP`.
- UserPreference schema parity: resolved in Wave 3D.
- TitlePro247: deferred.

## 3. Unapplied Migration Review

The only unapplied migration identified by `npx prisma migrate status` is:

`20260613093000_add_admin_intake_readiness_indexes`

Migration SQL:

```sql
CREATE INDEX IF NOT EXISTS "CRMTask_leadId_idx" ON "CRMTask"("leadId");
CREATE INDEX IF NOT EXISTS "CRMTask_type_createdAt_idx" ON "CRMTask"("type", "createdAt");
CREATE INDEX IF NOT EXISTS "CRMTask_status_type_createdAt_idx" ON "CRMTask"("status", "type", "createdAt");

CREATE INDEX IF NOT EXISTS "UserInteraction_userId_idx" ON "UserInteraction"("userId");
CREATE INDEX IF NOT EXISTS "UserInteraction_type_createdAt_idx" ON "UserInteraction"("type", "createdAt");
```

Affected tables and columns:

- `CRMTask.leadId`.
- `CRMTask(type, createdAt)`.
- `CRMTask(status, type, createdAt)`.
- `UserInteraction.userId`.
- `UserInteraction(type, createdAt)`.

Connected-database inspection found only primary-key indexes on the affected tables and no `_prisma_migrations` record for this migration. Current row counts are small: `CRMTask=1`, `UserInteraction=2`.

Wave 3D intentionally did not run `prisma migrate deploy` because that would have applied this unrelated older migration while the authorization covered only the UserPreference repair.

## 4. Migration Classification

Classification: `RECOMMENDED_BEFORE_LAUNCH`.

Rationale:

- Additive index-only migration.
- No schema-contract rewrite.
- No data mutation, deletion, or backfill.
- Supports admin intake, CRM, interaction, and readiness-query performance.
- Removes future `prisma migrate deploy` ordering friction because Prisma will apply older pending migrations before newer pending migrations.

Launch impact:

- Not a correctness blocker at current row counts.
- Recommended before final recurring/cadence operations and before any production deployment path that expects `migrate deploy` to be clean.

Authorization package:

- Preferred path: run `npx prisma migrate deploy` only if this remains the sole pending migration.
- If other pending migrations exist at execution time: apply the exact reviewed SQL and then run `npx prisma migrate resolve --applied 20260613093000_add_admin_intake_readiness_indexes`.
- Validation: inspect `pg_indexes` for the five expected indexes, confirm `_prisma_migrations` has the migration record, and rerun `npx prisma migrate status`.
- Rollback/compensation: use a forward migration that drops these specific indexes only if a proven issue appears.
- Risk: low at current row counts; `CREATE INDEX IF NOT EXISTS` still takes table/index locks, so execute during a low-traffic maintenance window.

## 5. CRM Task Review

The remaining CRM task is:

- ID: `751fa51e-4a2e-411f-97df-c320e974e058`.
- Type: `strategy_intake`.
- Status: `pending`.
- Priority: `medium`.
- Title: `REIE intake: Buy Strategy in Boulder (Research, Search Map)`.
- Lead email domain: `example.com`.
- Lead heat score: 9.
- Lead status: `Lead`.
- Lead unsubscribed: false.
- Related interaction count: 1.
- Metadata review status: `pending`.

Code inspection shows the authenticated admin `PATCH /api/admin/crm-tasks/[id]` route updates only the selected row's `status`, `priority`, and JSON `metadata.review`. Completion and dismissal require a review note.

## 6. CRM Classification

Classification: `SAFE_CONTROLLED_COMPLETION`.

Recommended controlled action, after explicit authorization:

- PATCH exactly `751fa51e-4a2e-411f-97df-c320e974e058`.
- Set `status` to `completed`.
- Preserve `priority` as `medium`.
- Use review note: `Wave 3E controlled resolution: synthetic/example.com strategy_intake reviewed; no customer action required.`
- Use reviewed-by value: `executive-approval` or the authenticated admin identity.

Expected effect:

- Maximum records changed: 1.
- No email send.
- No queue processing.
- No cadence enrollment.
- No lead-scoring action from this route.
- CRM active-review readiness should move from watch to pass if no other active CRM tasks exist.

Rollback:

- PATCH the same task back to `pending` with a rollback review note if the closure is rejected.
- Do not delete the record.

## 7. DNS Findings

DNS inspection:

- `davidquinngroup.com`: `NOERROR` with zero answer records; no apex A record observed.
- `www.davidquinngroup.com`: `NXDOMAIN`.
- Authoritative SOA observed at registrar-hosted DNS.

Code/config evidence:

- Metadata canonical URLs use `https://davidquinngroup.com`.
- Email sending, digest, alert readiness, and MLS status metadata fall back to `NEXT_PUBLIC_SITE_URL || PUBLIC_SITE_URL || https://davidquinngroup.com`.
- Click tracking allowlist includes both `davidquinngroup.com` and `www.davidquinngroup.com`.

Classification:

- `REQUIRED_BEFORE_PUBLIC_EMAIL`.
- `REQUIRED_BEFORE_PUBLIC_LAUNCH`.
- `REQUIRES_OWNER_DNS_ACTION`.

## 8. Canonical URL Decision Requirements

Recommendation: keep `https://davidquinngroup.com` as canonical because local metadata and email fallbacks already use the apex domain.

Required owner decisions:

- Confirm the production host in Vercel or the active hosting provider.
- Configure apex `davidquinngroup.com` with the provider-specified record.
- Configure `www.davidquinngroup.com` as an alias or redirect to apex.
- Set production environment variables consistently:
  - `NEXT_PUBLIC_SITE_URL=https://davidquinngroup.com`
  - `PUBLIC_SITE_URL=https://davidquinngroup.com`
- Redeploy after environment changes.
- Verify SSL certificate issuance and redirects.

Validation after owner action:

- `dig davidquinngroup.com`.
- `dig www.davidquinngroup.com`.
- `curl -I https://davidquinngroup.com`.
- `curl -I https://www.davidquinngroup.com`.
- Confirm canonical metadata.
- Perform one new controlled internal tracked-link validation against the production domain before recurring public email activation.

## 9. Queue and Alert Activation Readiness

Current queue posture:

- `AlertQueue`: 196 pending, 84 sent, 3 skipped.
- `reie-alerts`: 273 waiting, 0 active, 0 delayed, 0 failed.
- Dead-letter open count: 0.

Implementation controls:

- `runAlerts` defaults to dry-run and requires `--live` or `--execute` for sends.
- Alert worker dry-run is allowed only in once/batch-safe modes so queue jobs are not consumed.
- Live queue worker consumes `reie-alerts` jobs and calls `processAlertById(alertId, false)`.
- Alert job IDs are stable as `alert-<alertId>`.
- Live processing claims pending rows by updating `AlertQueue.status` from `pending` to `processing`.
- Non-pending/non-processing rows are skipped.
- Successful sends update `AlertQueue.status` to `sent` and create `EmailLog`.
- Failed sends mark rows `failed`.
- BullMQ attempts are bounded at 3 with exponential backoff, completed-job retention, failed-job retention, and dead-letter capture after final failure.

Readiness concern:

The selected Wave 3 alert was processed directly by row ID and did not consume a BullMQ job. Therefore, BullMQ waiting jobs may include jobs for rows already `sent` or `skipped` plus jobs for pending rows. A reconciliation pass is required before live queue-worker activation.

## 10. Staged Activation Proposal

Stage 0 - Dormant watch state:

- Authorization: none required for observation.
- Actions: queue dashboard, alert readiness, CRM pending, launch readiness.
- Max rows/jobs changed: 0.
- Stop condition: any readiness `fail`.
- Success: stable queue state and no failed/dead-letter jobs.

Stage 1 - Internal controlled preview:

- Authorization: explicit approval required.
- Actions: dry-run or preview only, limited to reviewed internal/test recipients.
- Max rows/jobs changed: 0.
- Recipient rule: internal/test only.
- Stop condition: unexpected real customer recipient, malformed payload, readiness `fail`, DNS unresolved for production-domain link validation.
- Success: reviewed preview rows and recipient list.

Stage 2 - Internal controlled live batch:

- Authorization: explicit approval required.
- Actions: process exact selected internal/test row IDs or a hard-limited batch after preview.
- Max rows changed: 1 to 5.
- Max BullMQ jobs consumed: 0 unless specifically authorizing queue-worker path.
- Recipient rule: internal/test only.
- Stop condition: send failure, tracking failure, unsubscribe failure, unexpected recipient, queue failure, dead letter.
- Success: sent rows, EmailLog entries, click tracking, unsubscribe safety, queue counts unchanged or explained.

Stage 3 - Limited customer pilot:

- Authorization: explicit approval required with recipient list or segment.
- Actions: hard-limited live batch after reviewed dry-run.
- Max rows changed: 5 to 10 unless authorization specifies otherwise.
- Recipient rule: known pilot recipients only.
- Stop condition: complaint, unsubscribe issue, bounce spike, failed rows, dead-letter job, DNS/SSL regression, readiness `fail`.
- Success: all sends logged, no failed jobs, no dead letters, tracking works, CRM remains stable.

Stage 4 - Bounded recurring:

- Authorization: explicit approval required.
- Actions: enable recurring scheduler or worker with low concurrency, per-run cap, daily review.
- Max jobs: per-run cap documented before activation.
- Recipient rule: subscribed users only, with unsubscribe links and tracking verified.
- Stop condition: readiness `fail`, failed queue jobs, email provider error, unsubscribe failure, tracking failure, unexplained backlog growth.
- Success: sustained clean runs through the observation window.

Stage 5 - Normal production:

- Authorization: post-observation approval.
- Actions: normal cadence with monitoring and incident runbooks.
- Max jobs: production policy.
- Recipient rule: subscribed eligible saved-search users only.
- Stop condition: production monitoring thresholds.
- Success: recurring operation remains stable with documented metrics.

## 11. Final Readiness Command Inventory

Safe non-mutating or local validation commands:

- `npx prisma validate`.
- `npm run lint`.
- `npm run typecheck`.
- `npm run worker:build`.
- `git diff --check`.
- `git status --short`.
- `git check-ignore -v .env.local`.
- JSON parse validation for changed JSON files.
- `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`.
- `npm run check:alert-notification-readiness`.
- `npm run check:notification-readiness`.
- `npm run check:notification-readiness:strict`.
- `npm run check:notification-readiness:strict-contract`.
- `npm run check:launch-readiness`.
- `npm run run:crm:pending`.
- `npm run supabase:check:json`.

Controlled mutation requiring explicit authorization:

- `npx prisma migrate deploy`.
- Exact SQL plus `npx prisma migrate resolve --applied 20260613093000_add_admin_intake_readiness_indexes`.
- Authenticated CRM task PATCH for `751fa51e-4a2e-411f-97df-c320e974e058`.
- `npm run run:alerts:dry` or alert dry-run previews when the operator-review gate is being actively executed.
- `npm run run:alerts:live`.
- `npm run run:worker:alerts:once:live`.
- Queue retry execution.
- Alert failed-row mutation commands.
- New controlled production-domain email/tracked-click validation.

Prohibited unless explicitly authorized:

- Live sync.
- Live workers.
- Live email sends.
- CRM mutations.
- OpenAI calls.
- MLS Grid requests.
- Typesense reset/reindex.
- Queue retries.
- Saved-search alert dry-runs outside an authorized operator-review package.
- `npm run smoke:property-inquiry`.
- TitlePro247 activation.
- Deployment.

## 12. Authorization Packages

Package A - Admin intake readiness index migration:

- Objective: apply `20260613093000_add_admin_intake_readiness_indexes`.
- Method: `npx prisma migrate deploy` if sole pending migration; otherwise exact SQL plus `migrate resolve`.
- Mutations: five index creations and one migration-history record.
- Data rows changed: 0.
- Expected duration: brief at current row counts.
- Validation: `pg_indexes`, `_prisma_migrations`, `npx prisma migrate status`.

Package B - CRM task controlled completion:

- Objective: close synthetic/example.com `strategy_intake` watch item.
- Method: authenticated admin PATCH to the exact task ID.
- Mutations: one `CRMTask` row.
- Email/queue effects: none expected.
- Validation: `npm run run:crm:pending`, admin task GET, launch readiness.

Package C - DNS/site URL correction:

- Objective: make production-domain links and canonical URLs resolve.
- Method: owner updates DNS and hosting-domain settings, then environment variables and redeploy.
- Mutations: DNS/hosting/env/deploy only; no database rows.
- Validation: `dig`, `curl -I`, SSL, canonical metadata, new controlled production-domain tracked-link test.

Package D - Alert activation Stage 1/2:

- Objective: reconcile and prove alert operation without broad processing.
- Method: authorized dry-run preview and exact internal controlled live batch.
- Mutations: none in dry-run; 1 to 5 selected alert rows and EmailLog rows in controlled live.
- Validation: readiness checks, EmailLog, AlertQueue status, queue dashboard, dead letters, tracking, unsubscribe.

## 13. Launch Blockers

No new code-absence launch blocker was discovered in Wave 3E.

Current launch blockers/gates are operational:

- DNS/site URL must be corrected before public production email and public launch.
- Alert operator review and activation staging must precede recurring saved-search email.
- CRM task must be reviewed or explicitly waived before scheduler cadence escalation.
- Final readiness refresh must pass before deployment and recurring operations.

## 14. Conditional Gates

- `GATE-DNS-001`: apex and www production hosts resolve, SSL passes, env vars point to canonical URL, deployment reflects env.
- `GATE-CRM-001`: one pending synthetic/example.com `strategy_intake` task completed or explicitly waived.
- `GATE-MIGRATION-001`: additive readiness-index migration applied or consciously deferred with deploy-order acceptance.
- `GATE-ALERT-001`: 196 pending alert rows reviewed and staged activation approved.
- `GATE-QUEUE-001`: `reie-alerts` waiting-job backlog reconciled before live queue-worker activation.
- `GATE-READINESS-001`: launch, notification, queue, CRM, and public smoke readiness refreshed without unaccepted failures.

## 15. Nonblocking Post-Launch Items

- TitlePro247 activation.
- Dedicated executive dashboard.
- Dedicated KPI engine.
- Partnerships workflow.
- Customer Success workflow.
- Dedicated enterprise risk workflow.
- Repository feature work beyond maintenance.
- AI Brand Brain and other AI capability productization.

## 16. Recommended Execution Sequence

1. Obtain explicit authorization for Package A and apply the additive index migration.
2. Obtain explicit authorization for Package B and complete the single synthetic/example.com CRM task.
3. Owner completes Package C DNS/hosting/env/deploy correction.
4. Validate apex/www DNS, SSL, canonical metadata, and production env behavior.
5. Run one new controlled internal production-domain tracked-link validation.
6. Run non-mutating readiness refresh.
7. Reconcile `AlertQueue` rows against `reie-alerts` waiting jobs.
8. Execute authorized alert Stage 1 preview.
9. Execute authorized alert Stage 2 internal controlled live batch.
10. Run readiness refresh and document results.
11. Decide whether to proceed to limited customer pilot or hold in watch.

## 17. Commands Not Run

Wave 3E did not run:

- `npx prisma migrate deploy`.
- `npx prisma migrate resolve`.
- Any exact SQL migration application.
- Any CRM PATCH/mutation.
- Any DNS, hosting, environment, or deployment action.
- Any live alert command.
- Any alert dry-run/operator review command.
- Any live worker.
- Any scheduler.
- Any queue retry.
- Any live email send.
- Any MLS Grid request.
- Any OpenAI call.
- Any TitlePro247 call.
- Any Typesense reset/reindex.
- `npm run smoke:property-inquiry`.
