# PROJECT ATLAS - Launch Readiness Certification V1

Certification date: 2026-07-17  
Certification scope: Internal Preview readiness  
Outcome: `NOT_CERTIFIED`

## Certification Summary

Project Atlas is not certified for Internal Preview as of this Wave 4 validation.

The domain and redirect layer is now ready, but production application validation failed.

## Certification Criteria

| Area | Result | Evidence |
| --- | --- | --- |
| Domain | pass | `davidquinngroup.com` resolves to Vercel. |
| SSL | pass | Root and `www` HTTPS responded with HSTS. |
| Redirect | pass | `www` returns 308 to `https://davidquinngroup.com/`. |
| Deployment | fail | Production does not expose expected `/search`; Vercel CLI credentials prevented deployment correction. |
| Database | pass | Prisma/database checks remain healthy. |
| Migrations | pass | Migration history is current. |
| CRM | pass | CRM pending readiness is ready. |
| Alert rendering | not proven | No production email sent. |
| Email delivery | not proven | Controlled production email was not sent. |
| Tracked links | not proven | Production route exists but email-hosted click proof was not executed. |
| Unsubscribe safety | fail | Invalid-token production request returned 500. |
| Queues | watch | `reie-alerts` remains 273 waiting; no jobs processed. |
| Dead-letter handling | pass | Open dead-letter count remains 0. |
| Monitoring | partial | Queue dashboard and readiness scripts work; production app route health failed. |
| Rollback readiness | partial | No deployment was executed; rollback deployment reference unavailable. |
| Customer-data safeguards | pass | No customer email, alert row, queue job, CRM task, or unsubscribe mutation was executed. |
| Remaining known risks | fail | Production app/search/unsubscribe/deploy credentials remain unresolved. |

## Decision

`NOT_CERTIFIED`

Internal Preview must wait until production deployment and route health are corrected, then the controlled production-hosted alert email, tracked click, and unsubscribe safety proof are completed.

## Required Certification Remediation

1. Restore valid Vercel CLI credentials.
2. Verify or correct Production `NEXT_PUBLIC_SITE_URL` and `PUBLIC_SITE_URL`.
3. Deploy current `main` to production or identify the current production deployment source.
4. Confirm `/search` returns 200.
5. Confirm `/api/search?limit=1` can reach Typesense.
6. Confirm one valid public property route.
7. Add or validate `/robots.txt` and `/sitemap.xml`.
8. Fix invalid-token unsubscribe handling so it returns a controlled 400/404, not 500.
9. Run one controlled production-hosted alert email.
10. Click exactly one tracked property link.
11. Verify unsubscribe safety without affecting a real customer.

## Explicit Non-Certification Boundary

This certification does not approve:

- Recurring alerts.
- Customer pilot.
- Queue drain.
- BullMQ job processing.
- Queue retries.
- MLS Grid operations.
- OpenAI operations.
- TitlePro247.
- Typesense reset/reindex.
