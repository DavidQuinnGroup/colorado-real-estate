# PROJECT ATLAS - Enterprise Capability Verification Wave 4A

Production Deployment Alignment and Route Remediation

Baseline: `5b629c8`  
Verification date: 2026-07-17  
Outcome: `NOT_CERTIFIED`

## 1. Executive Summary

Wave 4A confirmed that production is still not serving the current `main` route surface. Local source remediation corrected the current-main robots, sitemap, and unsubscribe safety gaps, and local production validation passed for the bounded route checks. No production deployment was executed because hosted Vercel environment variables and the existing project deployment target could not be verified with available credentials.

Internal Preview remains blocked until the existing `david-quinn-group-8rde` Vercel project is verified, required Production variables are confirmed, and current `main` is deployed through the established production path.

## 2. Baseline

- Branch: `main`.
- Baseline commit: `5b629c8`.
- Working tree at start: clean.
- `.env.local`: ignored by `.gitignore`.
- Prior Wave 4 outcome: `NOT_CERTIFIED`.

## 3. Deployment Alignment Finding

Classification: `STALE_DEPLOYMENT`.

Evidence:

- Local build from current `main` includes `/search`, `/robots.txt`, `/sitemap.xml`, `/api/search`, `/api/unsubscribe`, `/api/track-click`, and `/properties/[id]`.
- Production `https://davidquinngroup.com/search` still returns 404.
- Production `https://davidquinngroup.com/robots.txt` still returns 404.
- Production `https://davidquinngroup.com/sitemap.xml` still returns 404.
- Production invalid unsubscribe token still returns 500.
- Production `/api/search?limit=1` still returns `getaddrinfo ENOTFOUND i34rne7jth2qgx5fp-1.a1.typesense.net`.

The existing local Vercel metadata points to:

- Project ID: `prj_Ry5WCDfamYUq1oO7t1CwCVwTvh4G`.
- Org/team ID: `team_53Do8TFrDJHK8AJsziDVZyRQ`.
- Project name: `david-quinn-group-8rde`.

## 4. Vercel Access Finding

Vercel CLI deployment and hosted environment inspection remain blocked because the available CLI credential state is invalid/unavailable from Wave 4. Wave 4A did not repeatedly attempt invalid authentication.

Smallest owner action:

1. Restore Vercel access for project `david-quinn-group-8rde`.
2. Verify the project is connected to `DavidQuinnGroup/colorado-real-estate`.
3. Verify Production deploys from branch `main`.
4. Verify the Production deployment target is the existing project ID `prj_Ry5WCDfamYUq1oO7t1CwCVwTvh4G`.
5. Verify Production environment variables before redeploy.

Do not create a new Vercel project. Do not relink to another project without proving the target IDs.

## 5. Local Route Inventory

Current `main` contains:

- `/search`: `app/search/page.tsx`.
- `/api/search`: `app/api/search/route.ts`.
- `/api/unsubscribe`: `app/api/unsubscribe/route.ts`.
- `/api/track-click`: `app/api/track-click/route.ts`.
- `/properties/[id]`: `app/properties/[id]/page.tsx`.

Wave 4A added:

- `/robots.txt`: `app/robots.ts`.
- `/sitemap.xml`: `app/sitemap.ts`.

## 6. Typesense Configuration Finding

Classification: `UNVERIFIED_HOSTED_CONFIGURATION`.

Local required variable set:

| Variable | Required | Client/Server | Local Present | Hosted Verified | Safe to Expose |
| --- | --- | --- | --- | --- | --- |
| `TYPESENSE_HOST` | yes | server | present via local env path during prior checks | no | no |
| `TYPESENSE_PORT` | yes | server | present/defaulted | no | yes |
| `TYPESENSE_PROTOCOL` | yes | server | present/defaulted | no | yes |
| `TYPESENSE_API_KEY` | yes | server | present/defaulted | no | no |
| Collection name | yes | server | `listings`/`properties` from schema | n/a | yes |

Current-main `/api/search` has an approved database fallback when Typesense is unavailable. Local production validation returned HTTP 200 with `source:"database"` and `fallbackReason:"fetch failed"` when Typesense was unavailable. The production DNS error therefore indicates stale deployment, stale hosted configuration, or both.

## 7. Hosted Environment Finding

Hosted Production variables were not changed.

Variables requiring owner verification:

- `NEXT_PUBLIC_SITE_URL=https://davidquinngroup.com`.
- `PUBLIC_SITE_URL=https://davidquinngroup.com`.
- `TYPESENSE_HOST`.
- `TYPESENSE_PORT`.
- `TYPESENSE_PROTOCOL`.
- `TYPESENSE_API_KEY`.
- `RESEND_API_KEY`.
- `RESEND_FROM_EMAIL`.
- `RESEND_REPLY_TO_EMAIL`.
- Tracking/unsubscribe base URL behavior through `NEXT_PUBLIC_SITE_URL || PUBLIC_SITE_URL || https://davidquinngroup.com`.

No secret values were printed or committed.

## 8. Unsubscribe Root Cause

Production still returns 500 for an invalid token, but current main did not intentionally expose that behavior. Wave 4A hardened current main by:

- Normalizing missing and malformed tokens before lookup.
- Returning intentional non-500 responses for missing, malformed, unknown, and already-used tokens.
- Treating already-used tokens as idempotent success without repeating mutation.
- Preserving the existing valid-token mutation path for active global and saved-search unsubscribe records.

## 9. Source Corrections

Files changed:

- `app/api/unsubscribe/route.ts`.
- `lib/unsubscribe/safety.ts`.
- `scripts/checkUnsubscribeSafety.ts`.
- `app/robots.ts`.
- `app/sitemap.ts`.
- `package.json`.
- `tsconfig.worker.json`.

Generated compiled outputs:

- `dist/lib/unsubscribe/safety.js`.
- `dist/scripts/checkUnsubscribeSafety.js`.

## 10. Tests Added

Added `npm run check:unsubscribe-safety`.

Coverage:

- Missing token.
- Malformed token.
- Unknown token.
- Already-used token.
- Valid global fixture token.
- Valid saved-search fixture token.
- Repeated valid fixture request after use.

## 11. Local Build Validation

Passed:

- `npx prisma validate`.
- `npm run check:unsubscribe-safety`.
- `npm run lint`.
- `npm run typecheck`.
- `npm run worker:build`.
- `npm run build`.

Local production server checks on `http://localhost:3020`:

- `/search`: 200.
- `/robots.txt`: 200.
- `/sitemap.xml`: 200.
- Missing unsubscribe token: 400.
- Unknown invalid unsubscribe token: 404.
- `/api/search?limit=1`: 200 with database fallback and no Typesense exception leakage.

## 12. Deployment

Deployment executed: no.

Reason:

- Hosted environment variables could not be verified.
- Existing production branch/project alignment could not be proven through authenticated Vercel access.
- Wave 4A deployment authorization criteria were not met.

## 13. Production Route Results

Observed after local remediation but before deployment:

- Root: 200.
- `www`: 308 to root.
- `/search`: 404.
- `/api/search?limit=1`: Typesense DNS error.
- `/robots.txt`: 404.
- `/sitemap.xml`: 404.
- Invalid unsubscribe token: 500.

These are expected to remain unresolved until current `main` is deployed with verified hosted variables.

## 14. Readiness Refresh

No queue or CRM readiness refresh was run in Wave 4A after source validation because deployment was blocked before production correction. The latest durable Wave 4 state remains:

- `AlertQueue`: 196 pending, 84 sent, 3 skipped.
- `reie-alerts`: 273 waiting, 0 active, 0 delayed, 0 failed.
- CRM readiness: ready.
- Dead-letter open: 0.

## 15. Certification Impact

Outcome remains `NOT_CERTIFIED`.

Closed locally:

- Current-main robots route defect.
- Current-main sitemap route defect.
- Current-main unsubscribe invalid-token safety defect.
- Current-main search API fallback proof.

Remaining:

- Production deployment alignment.
- Hosted Vercel environment verification.
- Production Typesense configuration verification.
- Production route revalidation after deploy.
- Controlled production-hosted alert email.
- Exactly one production-domain tracked-click proof.
- Safe unsubscribe proof without a real customer token.

## 16. Commands Not Run

Not run:

- Production deployment.
- Email sending.
- Tracked-link clicking.
- Live unsubscribe mutation.
- AlertQueue processing.
- BullMQ processing.
- Queue retries.
- Workers or schedulers.
- CRM mutation.
- MLS Grid requests.
- OpenAI requests.
- TitlePro247 requests.
- Typesense reset or reindex.
- Database reset.
- Customer pilot.
- Recurring-alert activation.
