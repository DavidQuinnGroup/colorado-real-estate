# RC1-CERT-001 - Internal Preview Certification

Date opened: 2026-07-18
Certification timestamp: 2026-07-18T18:43:18Z
Current status: `CLOSED`
Severity: `High`

## Certification Identity

Release candidate: `RC1`
Issue: `CERT-001`
Certification type: controlled Internal Preview certification.
Certification decision: `CERTIFIED_FOR_INTERNAL_PREVIEW`.

## Certified Runtime

- Certified runtime commit: `e5394a6` (`Record READY-001 readiness refresh`).
- Certified production deployment: Git-triggered Vercel deployment for `e5394a6`, status `success`, description `Deployment has completed`.
- Branch at certification: `main...origin/main`.
- Working tree at certification start: clean.

## Closed-Issue Inventory

| Issue | Status | Certification basis |
| --- | --- | --- |
| `SEARCH-001` | `CLOSED` | Production `/search` and bounded `/api/search` health verified through the approved database fallback. |
| `UNSUBSCRIBE-001` | `CLOSED` | Missing, malformed, synthetic unknown, and repeated unknown token paths return intentional non-500 behavior. |
| `PROPERTY-001` | `CLOSED` | Production property detail, not-found handling, and database fallback verified. |
| `EMAIL-001` | `CLOSED` | Exactly one bounded internal provider-path send, one EmailLog increase, one controlled AlertQueue transition, and no backlog release. |
| `CLICK-RUNTIME-001` | `CLOSED` | First-100-row Supabase fallback defect identified, corrected, deployed, and covered by deterministic tests. |
| `CLICK-001` | `CLOSED` | Final controlled proof persisted `clickedAt`, redirected once to the selected property, incremented interaction and heat score exactly once, and preserved unrelated surfaces. |
| `UNSUBSCRIBE-002` | `CLOSED` | One controlled internal valid unsubscribe, one idempotency repeat, exact-scope isolation, stable token consumption, and one bounded internal-user restoration. |
| `READY-001` | `CLOSED` | Final readiness refresh confirmed deployment health, schema/migration alignment, CRM readiness, zero open dead-letter work, preserved backlogs, disabled workers/schedulers, and successful safety/build validations. |

## Production Health Summary

READY-001 and post-certification read-only checks confirmed:

- Root domain: healthy.
- Canonical `www` redirect: healthy.
- Selected property page: healthy.
- `/search`: healthy.
- Bounded search API: healthy through approved database fallback.
- Missing-token unsubscribe: intentional HTTP 400.
- Synthetic unknown-token unsubscribe: intentional HTTP 404.
- No valid unsubscribe token was invoked for certification.
- No production tracking URL was invoked for certification.

## Operational-Control Summary

- Recurring alert workers remain disabled.
- Alert schedulers remain disabled.
- AlertQueue backlog remains preserved.
- BullMQ backlog remains preserved.
- Dead-letter open count remains zero in READY-001 evidence.
- CRM readiness is `ready`.
- Rollback and stop procedures are documented in the production architecture, scheduler, and alert operations records.
- Master control state remained readable during READY-001 with `killSwitchActive: true`.

## Certification Scope

This certification authorizes only a controlled Internal Preview limited to:

- Approved internal users.
- Approved internal test accounts.
- Existing production deployment.
- Read-only property discovery and search.
- Bounded manual verification.
- Controlled internal feedback collection.
- Explicitly authorized individual tests.
- Continued operational monitoring.
- Defect reporting and governed remediation.

The Internal Preview must remain invitation-only and operationally supervised.

## Explicit Exclusions

This certification does not authorize:

- Public launch.
- Customer beta.
- Open registration.
- Broad customer invitations.
- Public marketing announcement.
- Recurring alert workers.
- Alert schedulers.
- AlertQueue backlog release.
- BullMQ backlog processing.
- Queue retry or drain.
- Broad customer email.
- Automated email campaigns.
- New production click testing.
- New valid unsubscribe testing.
- CRM automation activation.
- Live MLS synchronization unless separately authorized.
- OpenAI production invocation.
- TitlePro247 activation.
- Typesense reset or reindex.
- Database reset.
- `prisma db push`.
- `npm audit fix`.
- Force-push.
- Destructive Git operations.
- Any action beyond the explicit Internal Preview scope.

## Internal Preview Operating Conditions

1. Recurring alert workers and schedulers remain disabled.
2. AlertQueue and BullMQ backlogs remain preserved.
3. No backlog may be released without a separate rollout authorization.
4. Email sends require explicit bounded authorization.
5. Valid unsubscribe and tracked-link production requests require explicit bounded authorization.
6. CRM mutations remain controlled.
7. MLS, OpenAI, TitlePro247, and Typesense administrative actions remain governed separately.
8. Any new Critical defect immediately suspends Internal Preview.
9. Any new High defect that threatens customer data, search usability, email safety, privacy, or operational control suspends the affected preview capability.
10. Rollback and stop procedures must remain immediately available.
11. Internal Preview feedback must be captured as governed customer evidence rather than informal feature expansion.
12. No architectural expansion should occur during the preview unless required to remediate a verified launch defect.

## Suspension Triggers

Internal Preview must be suspended if any of the following occurs:

- Production root, property, or search routes become materially unavailable.
- The governed search fallback fails.
- A valid unsubscribe affects unintended scope.
- Tracking produces duplicate or unintended enrichment.
- An unauthorized email is sent.
- A worker or scheduler activates unexpectedly.
- AlertQueue or BullMQ backlog begins processing unexpectedly.
- Dead-letter open count becomes nonzero and is not immediately explained.
- A schema or migration regression appears.
- Sensitive information, credentials, or internal stack traces are exposed.
- A Critical defect is opened.
- A High defect threatens customer safety, privacy, data integrity, notification safety, or operational control.
- Rollback or stop controls become unavailable.

## Known Operational Watch Items

These are non-blocking for controlled Internal Preview:

- Typesense provider remains safely degraded behind the approved database fallback.
- AlertQueue pending backlog remains preserved.
- BullMQ waiting backlog remains preserved.
- Recurring workers and schedulers remain disabled.
- TitlePro247 remains deferred.
- Executive Dashboard/KPI expansion remains post-certification work.
- Independent mailbox confirmation for EMAIL-001 was unavailable, while provider acceptance, EmailLog creation, controlled queue transition, production-hosted URLs, and downstream click proof were verified.

These conditions do not block controlled Internal Preview because the affected capabilities are safely degraded, explicitly disabled, deferred, or bounded by proven safeguards.

## Rollback And Stop-Control Confirmation

Rollback and stop-control procedures remain available through the governed production architecture, production scheduler, and alert architecture records. Internal Preview must stop if rollback or stop controls are unavailable.

## Final Certification Conclusion

`CERT-001`: `CLOSED`.

`RC1`: `CERTIFIED_FOR_INTERNAL_PREVIEW`.

`READY-001`: `CLOSED`.

PROJECT ATLAS RC1 is certified for controlled Internal Preview only. No public launch, customer beta, alert rollout, queue operation, worker/scheduler activation, broad email, live MLS, OpenAI, TitlePro247, or Typesense administrative action is authorized by this record.

## Executive Authority Statement

The executive decision supplied for CERT-001 is `CERTIFIED_FOR_INTERNAL_PREVIEW`. This record governs that decision, binds it to the closed RC1 evidence inventory, and limits execution to the Internal Preview scope and operating conditions above.
