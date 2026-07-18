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

## Wave 4A Certification Update

Wave 4A keeps the certification outcome at `NOT_CERTIFIED`.

Local source remediation passed for robots, sitemap, unsubscribe invalid-token safety, and search API fallback behavior. Production was not deployed because hosted Vercel environment variables and the existing production deployment target could not be verified with available access.

Additional required remediation before certification:

1. Verify the existing Vercel project `david-quinn-group-8rde`.
2. Verify Production branch `main`.
3. Verify Production canonical URL, Typesense, Resend, tracking, and unsubscribe variables.
4. Deploy current `main` once through the existing production path.
5. Revalidate production route health.
6. Complete the controlled production-hosted email, tracked-click, and unsubscribe proof.

## Wave 4B Certification Update

Wave 4B keeps the certification outcome at `NOT_CERTIFIED`.

After Vercel was reconnected to `DavidQuinnGroup/colorado-real-estate`, the first automatic production deployment from commit `0f83ef4` failed before Ready because the generated Prisma Client used by Vercel did not expose `prisma.rEIEControlState`.

The source schema contains the active `REIEControlState` model, and local `npx prisma generate` produces the expected accessor. Wave 4B remediation adds explicit Prisma generation during install and immediately before `next build`, plus `npm run check:prisma-client-parity` to prevent this generated-client drift from recurring.

Internal Preview requires a successful Wave 4B production deployment and post-deploy route/readiness validation before certification can change.

## Wave 4C Certification Update

Wave 4C keeps the certification outcome at `NOT_CERTIFIED`.

The Wave 4B Prisma generation correction was confirmed in Vercel, but the deployment then failed because `components/MarketChart.tsx` imported `recharts` while the package was not declared in `package.json` or the lockfile.

Wave 4C remediation declares `recharts@3.9.2`, adds `npm run check:production-dependencies`, and validates a clean `npm ci` plus production build locally. Internal Preview still requires a successful production deployment and post-deploy route/readiness validation before certification can change.

## Wave 4D Certification Update

Wave 4D keeps the certification outcome at `NOT_CERTIFIED`.

The Wave 4C Recharts dependency correction was confirmed in Vercel, and the application build completed through static-page and serverless-function generation. Vercel then blocked deployment because `next@15.1.6` was vulnerable.

Wave 4D remediation updates Next.js exactly to `15.1.11`, keeps React and React DOM unchanged, adds `npm run check:next-security-version`, and validates a clean `npm ci` plus production build locally. Internal Preview still requires a successful production deployment and post-deploy route/readiness validation before certification can change.

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
