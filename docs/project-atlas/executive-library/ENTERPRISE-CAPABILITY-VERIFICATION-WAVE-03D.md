# PROJECT ATLAS - Enterprise Capability Verification Wave 03D

## 1. Executive Summary

Wave 3D applied and verified the authorized `UserPreference` schema-parity repair.

`prisma migrate deploy` was not used because it would have applied an unrelated pending migration. Instead, the reviewed `UserPreference` SQL from `20260717133000_repair_user_preference_schema_parity` was applied directly in one transaction, then that migration alone was marked applied in Prisma migration history.

The controlled `updateUserPreferences()` revalidation passed. The Wave 3B post-click `P2022` residual is resolved. Recurring alerts are still not production-ready because alert review, queue watch state, CRM review, and DNS/site URL follow-up remain separate gates.

## 2. Baseline

- Branch: `main`.
- Baseline commit: `d4a1081`.
- Working tree at preflight: clean.
- `.env.local`: ignored by `.gitignore:46`.
- Verification date: 2026-07-17.

## 3. Authorization

Executive authorization covered only controlled application of:

- `20260717133000_repair_user_preference_schema_parity`.

Not authorized and not performed:

- Any other pending migration.
- `prisma db push`, reset, or destructive drift repair.
- Queue processing, email sending, CRM mutation, workers, schedulers, MLS Grid, OpenAI, TitlePro247, or Typesense reset/reindex.

## 4. Migration Preflight

Repository preflight matched:

- Branch: `main`.
- HEAD: `d4a1081`.
- Working tree: clean.
- `.env.local`: ignored.

Migration review confirmed:

- No `DROP TABLE`.
- No destructive row deletion.
- No unrelated table alteration.
- No broad constraint removal.
- Only `UserPreference` and its direct defaults/FK definitions are modified.

`npx prisma migrate status` showed that `prisma migrate deploy` would apply an unrelated pending migration, `20260613093000_add_admin_intake_readiness_indexes`, so deploy was not used.

## 5. Existing Database State

Pre-application shared database state:

- Database class: configured Supabase/Postgres.
- Schema: `public`.
- `UserPreference` row count: 0.
- Missing column: `createdAt`.
- `avgBeds`: `double precision`.
- `topCities`: nullable, no default.
- `updatedAt`: nullable, default `now()`.
- `id`: no database default.
- FK: present as `fk_user`.
- Authorized migration record: not present.
- Active migrations: none.

## 6. Migration Application

Application method:

- Controlled exact SQL execution through Prisma in one transaction.
- Followed by `npx prisma migrate resolve --applied 20260717133000_repair_user_preference_schema_parity`.

Execution result:

- SQL start: `2026-07-17T19:49:46.640Z`.
- SQL completion: `2026-07-17T19:49:48.493Z`.
- Statements executed: 17.
- SQL exit status: success.
- Migration history: `20260717133000_repair_user_preference_schema_parity` marked applied.
- Unrelated migrations applied: 0.

## 7. Post-Migration Schema

Post-application `UserPreference` schema:

- `id`: text, non-null, default `(gen_random_uuid())::text`.
- `userId`: text, non-null, unique.
- `avgPrice`: integer, nullable.
- `avgBeds`: integer, nullable.
- `topCities`: text array, non-null, default `ARRAY[]::text[]`.
- `updatedAt`: timestamp, non-null, default `CURRENT_TIMESTAMP`.
- `createdAt`: timestamp, non-null, default `CURRENT_TIMESTAMP`.
- Primary key: `UserPreference_pkey`.
- FK: `UserPreference_userId_fkey` to `User(id)` with cascade delete.
- Unique constraint: `UserPreference_userId_key`.

Row count before functional test: 0.

## 8. Controlled Functional Test

Controlled test target:

- Classification: Wave 3B internal controlled recipient.
- Existing preference row before test: no.
- Expected behavior: insert one valid `UserPreference` row.
- Cleanup strategy: preserve the row because it represents valid controlled test state from the approved Wave 3B click.

Execution:

- Called `updateUserPreferences()` directly for the controlled internal user.
- No email send, queue processing, CRM mutation, worker, or scheduler was invoked.

Result:

- `updated`: true.
- Clicked alerts considered: 2.
- Usable alerts considered: 2.
- Preference rows: 0 -> 1.
- `createdAt`: populated.
- `updatedAt`: populated.
- `avgBeds`: stored as integer or null.
- `topCities`: non-null array.

## 9. P2022 Revalidation

Result: `not_observed`.

The prior Prisma `P2022` from missing `UserPreference.createdAt` did not recur.

Click-path residual classification: `RESOLVED_WITH_NONBLOCKING_DNS_FOLLOW_UP`.

## 10. Side-Effect Review

Observed side effects:

- One valid controlled `UserPreference` row inserted.

Not observed:

- EmailLog count changed: 0.
- Pending `strategy_intake` count changed: 0.
- AlertQueue rows processed: 0.
- BullMQ jobs processed: 0.
- CRM tasks mutated: 0.
- Recurring workers activated: no.
- Schedulers activated: no.
- MLS Grid/OpenAI/TitlePro247 calls: 0.
- Typesense reset/reindex: no.

## 11. Readiness Refresh

Post-test readiness:

- AlertQueue status counts: 196 pending, 84 sent, 3 skipped.
- `reie-alerts`: 273 waiting, 0 active, 0 delayed, 0 failed.
- Dead-letter queue: 0 waiting, 0 active, 0 delayed, 0 failed.
- Pending `strategy_intake` count: 1.
- Alert notification readiness: `watch`.
- Pending saved-search alert rows: 196.
- Failed alert rows: 0.
- Processing alert rows: 0.

## 12. Capability Impact

- `PROD-007 Notifications`: still `VERIFIED_PARTIAL`; click tracking and preference update are now verified, but recurring operation remains gated.
- `INTEL-002 Customer Intelligence`: improved; controlled click and preference enrichment now both persist.
- `OPS-005 Reliability`: unchanged partial; queue/readiness remains watch.
- `COMM-001 CRM`: unchanged partial; one pending strategy_intake task remains.

Capability counts remain unchanged: 4 complete, 27 partial, 5 deferred, 2 not yet verified, 0 missing.

## 13. Gap Impact

Closed:

- Preference-refresh schema alignment watch item.

Still open:

- `GAP-001`: saved-search alert review and broad live processing readiness.
- `GAP-002`: monitoring and reliability hardening.
- `GAP-004`: CRM strategy_intake review.

No recurring alert production-ready classification was granted in Wave 3D.

## 14. Remaining Conditional Gates

- 196 pending saved-search alert rows require operator review before broad live processing.
- `reie-alerts` remains 273 waiting.
- One pending medium-priority `strategy_intake` task remains.
- Production DNS/site URL correction remains separate.
- Full launch readiness refresh remains required before recurring operations.

## 15. DNS Follow-Up

DNS/site URL correction remains open and separate. Wave 3D did not change DNS, site URL configuration, email links, or production routing.

## 16. Commands Not Run

- `prisma db push`.
- `prisma migrate deploy`.
- Database reset.
- Unrelated pending migration application.
- Queue retries or processing.
- Saved-search alert dry-runs or live sends.
- CRM mutations.
- Recurring workers or schedulers.
- MLS Grid requests.
- OpenAI requests.
- TitlePro247 requests.
- Typesense reset/reindex.
- New tracked email click.
- Replacement email send.

## 17. Recommended Next Step

Proceed only with the next controlled launch-readiness gate: either operator review of the 196 pending saved-search alert rows, CRM strategy_intake review, or DNS/site URL correction. Do not activate recurring alert processing yet.
