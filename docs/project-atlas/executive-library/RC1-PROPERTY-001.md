# RC1-PROPERTY-001 - Production Property Detail Route HTTP 500

Date opened: 2026-07-18  
Current status: `CLOSED`  
Severity: `High`  
Parent issue: `EMAIL-001`

## Baseline

- Baseline production/origin commit before correction: `9343f6d48c235db4f3a2be7e80f266842d621e21`.
- Correction commit: `def65373dc98e85b37e5afc6fed151db105fbfee`.
- Branch: `main`.
- Selected controlled alert row for EMAIL-001: `cmq0zp6up010gpd4uh5anfex5`.
- Approved internal recipient remains masked as `da***@gmail.com`.
- EMAIL-001 stayed `BLOCKED_PRE_SEND`; no email was sent.

## Root Cause

The selected production property route used by EMAIL-001 returned HTTP 500 because `/properties/[id]` still depended on Prisma for property detail and related-property reads. Vercel Production did not expose `DATABASE_URL` / `DIRECT_URL` by name during RC1 diagnostics, so Prisma-backed property reads could fail even though search and unsubscribe had bounded Supabase REST fallbacks.

The smallest correction in `def6537` preserved Prisma as the primary property-detail path, added a read-only Supabase REST fallback for the selected property and photos, and made related-property link generation degrade to authority links instead of crashing the page.

## Production Deployment

- Deployment source commit: `def6537`.
- GitHub deployment id: `5503459520`.
- Vercel/GitHub status: `success`.
- Deployment status description: `Deployment has completed`.

## Production Route Evidence

| Route | Result |
| --- | --- |
| Selected canonical property slug `/properties/6137-baseline-rd-boulder-co-ire1349635` | HTTP 200 |
| Selected property id `/properties/cmpy48m3d047b129oeqh0r22m` | HTTP 200 |
| Nonexistent property `/properties/no-such-property-property-001` | HTTP 404 |

The selected property route rendered the intended property rather than a generic error or unrelated record.

## Fallback and Degradation Evidence

- `app/properties/[id]/page.tsx` keeps Prisma primary and falls back to Supabase REST when Prisma lookup fails.
- The fallback reads one bounded `Property` row by `id`, `slug`, or `mlsId`, then reads `PropertyPhoto` rows for that exact property id.
- Invalid or overlong path identities are rejected before Supabase filter construction.
- `lib/linking/getPropertyLinks.ts` catches related-link Prisma failures and returns empty related home arrays plus static authority links, so related links cannot take down the page.
- `npm run check:property-route-safety` verifies selected property fallback data, selected id lookup, nonexistent identity null behavior, photo query safety, and related-link degradation source guard.

## Files Changed

- `app/properties/[id]/page.tsx`.
- `lib/linking/getPropertyLinks.ts`.
- `scripts/checkPropertyRouteSafety.ts`.
- `package.json`.
- `tsconfig.worker.json`.
- `dist/scripts/checkPropertyRouteSafety.js`.
- `docs/project-atlas/executive-library/PROJECT-ATLAS-RELEASE-CANDIDATE-BOARD.md`.
- `docs/project-atlas/executive-library/release-candidate-board.json`.
- `docs/project-atlas/executive-library/RC1-PROPERTY-001.md`.

## Local Validation

Passed:

- `npm run check:next-security-version`
- `npm run check:production-dependencies`
- `npm run check:prisma-client-parity`
- `npm run check:unsubscribe-safety`
- `npm run check:search-runtime-safety`
- `npm run check:property-route-safety`
- `npx prisma validate`
- `npm run lint`
- `npm run typecheck`
- `npm run worker:build`
- `npm run build`
- `git diff --check`
- `git status --short`

## Side-Effect Boundary

No email, queue processing, BullMQ retry/drain, CRM mutation, tracked click, unsubscribe request, worker, scheduler, MLS Grid request, OpenAI call, TitlePro247 call, Typesense reset/reindex, database reset, `prisma db push`, `npm audit fix`, or force-push was run during PROPERTY-001.

## Closure Decision

`PROPERTY-001` is production verified and closed. `EMAIL-001` remains `BLOCKED_PRE_SEND` and must not resume automatically.
