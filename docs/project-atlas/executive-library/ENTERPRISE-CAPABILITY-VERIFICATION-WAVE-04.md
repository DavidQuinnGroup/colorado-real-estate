# PROJECT ATLAS - Enterprise Capability Verification Wave 4

Production Launch Validation

Baseline: `eeeba7e`  
Verification date: 2026-07-17  
Outcome: `NOT_CERTIFIED`

## 1. Executive Summary

Wave 4 verified that production DNS, SSL, and the approved `www` to root redirect are now active. Wave 4 did not certify Project Atlas for Internal Preview because the deployed production application does not expose the expected REIE routes and the production search API cannot reach its Typesense host.

Blocking findings:

- `https://davidquinngroup.com/search` returned 404.
- `https://davidquinngroup.com/api/search?limit=1` returned `getaddrinfo ENOTFOUND i34rne7jth2qgx5fp-1.a1.typesense.net`.
- `https://davidquinngroup.com/properties/test` returned 404.
- `https://davidquinngroup.com/robots.txt` returned 404.
- `https://davidquinngroup.com/sitemap.xml` returned 404.
- Homepage title was `David Quinn Group | Boulder Luxury Real Estate`, not the expected current REIE homepage title.
- Vercel CLI hosted-environment/deployment operations were blocked by invalid/no credentials.

No controlled email, tracked click, or live unsubscribe was executed.

## 2. Baseline

Preflight matched the requested baseline:

- Branch: `main`.
- HEAD: `eeeba7e`.
- Working tree: clean.
- `.env.local`: ignored by `.gitignore`.

Current durable operational state remains:

- Database migrations: current.
- CRM readiness: ready.
- `AlertQueue`: 196 pending, 84 sent, 3 skipped.
- `reie-alerts`: 273 waiting, 0 active, 0 delayed, 0 failed.
- Dead-letter open: 0.
- TitlePro247: deferred.

## 3. Domain and Redirect Verification

Domain verification passed:

- `davidquinngroup.com` resolves to `216.198.79.1`.
- `www.davidquinngroup.com` resolves through CNAME `3c3789c641a656b8.vercel-dns-017.com`.
- Root HTTPS returned `HTTP/2 200`.
- `www` HTTPS returned `HTTP/2 308`.
- `www` redirect location: `https://davidquinngroup.com/`.
- Following the redirect reached root with `HTTP/2 200`.
- Server: Vercel.
- SSL/HSTS headers were present.

## 4. URL Configuration Audit

Required canonical value:

- `https://davidquinngroup.com`.

Configuration map:

| Purpose | Source | Current Host Classification | Required Host | Action |
| --- | --- | --- | --- | --- |
| Public site URL | `NEXT_PUBLIC_SITE_URL` | Local readiness reports root domain; hosted value not inspectable because Vercel CLI credentials failed. | `https://davidquinngroup.com` | Verify/update in Vercel after credentials are restored. |
| Public fallback URL | `PUBLIC_SITE_URL` | Local readiness reports root domain; hosted value not inspectable because Vercel CLI credentials failed. | `https://davidquinngroup.com` | Verify/update in Vercel after credentials are restored. |
| Homepage canonical/Open Graph | `app/page.tsx` | root domain | `https://davidquinngroup.com` | No source change required. |
| Search canonical/Open Graph | `app/search/page.tsx` | root domain | `https://davidquinngroup.com/search` | No source change required; deployment must expose route. |
| Property canonical | `app/properties/[id]/page.tsx` | root domain | `https://davidquinngroup.com/properties/...` | No source change required; deployment/data route must validate. |
| JSON-LD | schema helpers and layout | root domain | `https://davidquinngroup.com` | No source change required. |
| Email tracking base URL | `lib/email/sendEmail.ts` | `NEXT_PUBLIC_SITE_URL || PUBLIC_SITE_URL || root fallback` | `https://davidquinngroup.com` | Requires hosted env verification before production email proof. |
| Unsubscribe base URL | `lib/alerts/processAlertQueue.ts`, `scripts/sendDigest.ts` | same public base URL chain | `https://davidquinngroup.com` | Requires hosted env verification before production email proof. |
| Auth callback | local search found no dedicated auth callback route | not verified | root domain if auth is enabled | Confirm in provider dashboard if auth is enabled. |
| Sitemap/robots | no local app route found | missing in production | root domain | Add/enable before certification if required for launch criteria. |

Source-code fallback values already use the root domain. No source-code correction was made.

## 5. Hosted Environment Changes

Hosted environment changes executed: 0.

Reason:

- `vercel` CLI was not installed locally.
- `npx vercel env ls` reported `The specified token is not valid`.
- `npx vercel project ls` started a device-login flow because no usable credentials were available; the flow was stopped.
- Therefore hosted production env values could not be safely inspected or changed.

Required next action:

- Restore valid Vercel CLI credentials.
- Verify Production `NEXT_PUBLIC_SITE_URL` and `PUBLIC_SITE_URL`.
- Update only those public URL variables if they are absent or noncanonical.
- Redeploy after hosted env correction if any value changes.

## 6. Source Corrections

Source files changed: none.

Reason:

- Current source fallback/canonical constants already point to `https://davidquinngroup.com`.
- The observed failures are deployment/configuration/search-service issues, not a confirmed source fallback defect.

## 7. Deployment

Deployment result: not executed.

Reason:

- Vercel CLI credentials were invalid/unavailable.
- The production deployment appears stale or misconfigured relative to the current repository because `/search` returned 404 while the local build includes `/search`.

Build validation:

- `npm run build` passed.
- Build route table includes `/search`, `/properties/[id]`, `/api/search`, `/api/track-click`, and `/api/unsubscribe`.
- No worker or scheduler activation was observed during build.

## 8. Production Route Validation

| Route | Result | Classification |
| --- | --- | --- |
| `/` | `HTTP 200` | pass, but homepage content/title appears stale/non-REIE. |
| `/search` | `HTTP 404` | fail. |
| `/api/search?limit=1` | JSON error: `getaddrinfo ENOTFOUND i34rne7jth2qgx5fp-1.a1.typesense.net` | fail. |
| `/properties/test` | `HTTP 404` | inconclusive for a real property; no production search result was available to select a valid property. |
| `/robots.txt` | `HTTP 404` | fail/missing. |
| `/sitemap.xml` | `HTTP 404` | fail/missing. |
| `/api/track-click?...missing-user...` | `HTTP 400` | route exists, but current production behavior differs from earlier local route expectation for missing user. |
| `/api/unsubscribe?token=invalid-wave4-safety-token` | `HTTP 500` | fail; invalid token should not produce server error. |

## 9. Controlled Email Preflight

Controlled email preflight was not completed because production route validation failed before email execution.

No selected row was processed. No customer or internal recipient was emailed.

## 10. Controlled Email Result

Emails sent: 0.

Reason:

- Production application/search/unsubscribe validation failed.
- Hosted URL variables could not be verified.
- Sending a production-hosted alert before resolving these defects would violate the Wave 4 stop conditions and customer-data safeguards.

## 11. Tracked Click Result

Tracked clicks executed: 0.

Reason:

- No production email was sent.
- No tracked production email link was available to click exactly once.

## 12. Unsubscribe Safety Result

Live unsubscribe mutation executed: 0.

Implementation inspection:

- `app/api/unsubscribe/route.ts` mutates either `SavedSearch.isActive=false` for search-scoped tokens or `User.isUnsubscribed=true` for global tokens.
- The production invalid-token route returned `HTTP 500`, which is not acceptable for certification.

Result:

- Unsubscribe safety remains an open gate.

## 13. Queue and Side-Effect Review

No queue processing occurred.

Current queue state:

- `AlertQueue`: 196 pending, 84 sent, 3 skipped.
- `reie-alerts`: 273 waiting, 0 active, 0 delayed, 0 failed.
- Dead-letter open: 0.

Side effects:

- Emails sent: 0.
- AlertQueue rows processed: 0.
- BullMQ jobs processed: 0.
- CRM tasks changed: 0.
- Queue retries: 0.
- Workers/schedulers activated: no.

## 14. Final Readiness Refresh

Readiness results:

- Prisma validate: passed.
- Lint: passed after local cache access.
- Typecheck: passed.
- Worker build: passed.
- Production build: passed.
- Migration status: current.
- CRM readiness: ready.
- Queue dashboard: watch because `reie-alerts` has 273 waiting jobs.
- Launch readiness script: watch because 196 pending alert rows require operator review.
- Production domain DNS/SSL/redirect: ready.
- Production app route readiness: fail.
- Production search readiness: fail.
- Production unsubscribe safety: fail.

## 15. Launch Certification

Outcome: `NOT_CERTIFIED`.

Reasons:

- Production deployment does not expose required public REIE routes.
- Production search API cannot reach configured Typesense host.
- Production robots and sitemap routes are missing.
- Production unsubscribe invalid-token behavior returned 500.
- Hosted Vercel environment and deployment could not be inspected or corrected because CLI credentials were invalid/unavailable.
- Controlled production email/click proof was not executed because the production app gate failed first.

## 16. Gaps Closed

Closed in Wave 4:

- Production root DNS.
- Production SSL.
- `www` to root 308 redirect.

No email, click, unsubscribe, alert, or deployment proof gap was closed.

## 17. Gaps Remaining

Remaining gates:

- Restore valid Vercel CLI credentials.
- Verify/correct hosted Production `NEXT_PUBLIC_SITE_URL` and `PUBLIC_SITE_URL`.
- Deploy current `main` or otherwise align production with the current REIE app.
- Fix production search route and Typesense host resolution.
- Add or validate robots and sitemap.
- Fix unsubscribe invalid-token behavior.
- Complete exactly one controlled production-hosted alert email.
- Complete exactly one production tracked property-link click.
- Verify unsubscribe safety without affecting a real customer.
- Keep alert/backlog processing staged and separately authorized.

## 18. Internal Preview Recommendation

Recommendation: do not begin Internal Preview.

Required next step:

1. Restore Vercel credentials.
2. Deploy current `main` to production or identify why production does not match the current build.
3. Validate `/search`, `/api/search`, a real property route, robots, sitemap, tracking, and unsubscribe.
4. Only then proceed to the controlled production email and click proof.

## 19. Commands Not Run

Wave 4 did not run:

- Vercel hosted env mutation.
- Vercel deployment.
- Controlled alert email send.
- Tracked click.
- Live unsubscribe.
- AlertQueue processing.
- BullMQ job processing.
- Queue retries.
- Recurring workers.
- Recurring schedulers.
- CRM mutation.
- Live MLS synchronization.
- MLS Grid requests.
- OpenAI requests.
- TitlePro247 requests.
- Typesense reset/reindex.
- Database reset.
- Broad data cleanup.
