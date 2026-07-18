# RC1-UNSUBSCRIBE-001 - Invalid Token Produces HTTP 500

Date opened: 2026-07-18  
Current status: `CLOSED`
Severity: `Critical`

## Baseline

- Local starting HEAD: `36f4ecd Update RC1 restart handoff`.
- Production runtime baseline: `dae8f6d Fix production search runtime`.
- Branch: `main`.
- Starting branch state: `main...origin/main [ahead 1]`.
- Treatment of ahead-by-one commit: preserved as the documentation-only restart handoff commit and built this fix on top of it.

## Root Cause

Missing tokens were classified before database access and returned intentional HTTP 400. Syntactically valid unknown tokens still entered `prisma.unsubscribeToken.findUnique()` before client-error classification. In production, `DATABASE_URL` / `DIRECT_URL` were not exposed by name during RC1 diagnostics, so the Prisma lookup could throw before returning `null`; the route-level catch then converted the lookup failure into HTTP 500.

The smallest correction is to keep Prisma as the primary path, add a bounded Supabase REST fallback using the existing production Supabase read variables, and keep any remaining data-access outage in a controlled non-secret HTTP 503 response. Token contents, database detail, and stack traces are not exposed to the client.

## Affected Surface

- `app/api/unsubscribe/route.ts`.
- `lib/unsubscribe/safety.ts`.
- `lib/unsubscribe/store.ts`.
- `scripts/checkUnsubscribeSafety.ts`.

## Token-State Matrix

| Token state | Before | After |
| --- | --- | --- |
| Missing token | Intentional HTTP 400 before database access. | Intentional HTTP 400 before database access. |
| Malformed token | Intentional HTTP 400 before database access when normalization rejects it. | Intentional HTTP 400 before database access when normalization rejects it. |
| Unknown synthetic token | Could produce HTTP 500 if Prisma lookup threw before returning no match. | Prisma lookup first; Supabase REST fallback on Prisma failure; no match returns intentional HTTP 404. If both data paths are unavailable, returns controlled HTTP 503. |
| Expired token | No explicit expiry field exists in the current `UnsubscribeToken` model. | No explicit expiry field exists; behavior is unchanged and documented as unsupported by current model. |
| Revoked token | No explicit revoked field exists in the current `UnsubscribeToken` model. | No explicit revoked field exists; behavior is unchanged and documented as unsupported by current model. |
| Previously used token | HTTP 200 idempotent "Already Unsubscribed" response; no additional mutation. | HTTP 200 idempotent "Already Unsubscribed" response; no additional mutation. |
| Valid global token | Marks the exact token used and the exact owning user unsubscribed. | Same behavior through Prisma primary path, with Supabase REST fallback targeting the exact token and exact user if Prisma is unavailable. |
| Valid saved-search token | Marks the exact token used and the exact saved search inactive. | Same behavior through Prisma primary path, with Supabase REST fallback targeting the exact token and exact saved search if Prisma is unavailable. |

## Files Changed

- `app/api/unsubscribe/route.ts`: route now delegates lookup/mutation to the unsubscribe store and returns controlled HTTP 503 for unsubscribe data-access outages.
- `lib/unsubscribe/store.ts`: new Prisma-primary unsubscribe lookup/mutation helper with Supabase REST fallback.
- `scripts/checkUnsubscribeSafety.ts`: strengthened regression coverage for fallback lookup, malformed/unknown/idempotent behavior, and exact-row scope isolation.
- `dist/lib/unsubscribe/store.js` and `dist/scripts/checkUnsubscribeSafety.js`: generated worker/script output.
- `docs/project-atlas/executive-library/PROJECT-ATLAS-RELEASE-CANDIDATE-BOARD.md`.
- `docs/project-atlas/executive-library/release-candidate-board.json`.
- `docs/project-atlas/executive-library/RC1-UNSUBSCRIBE-001.md`.

## Local Validation

Passed:

- `npm run check:next-security-version`
- `npm run check:production-dependencies`
- `npm run check:prisma-client-parity`
- `npm run check:unsubscribe-safety`
- `npm run check:search-runtime-safety`
- `npx prisma validate`
- `npm run lint`
- `npm run typecheck`
- `npm run worker:build`
- `npm run build`
- `git diff --check`
- `git status --short`

## Production Verification

Deployment ID: `5503368803`.
Deployment status: `success`.
Canonical production domain validation: passed.

Production checks passed after deployment:

- Missing token returns intentional HTTP 400.
- Clearly malformed token returns intentional non-500 response.
- Synthetic unknown token returns intentional HTTP 404.
- Repeated synthetic unknown request remains intentional and non-500.
- Valid-token behavior proven only by safe fixture, non-customer, or separately authorized controlled proof.

## Scope Isolation Evidence

Focused safety tests assert that fallback mutation targets:

- `UnsubscribeToken` by exact token only.
- `SavedSearch` by exact `searchId` only for search-scoped tokens.
- `User` by exact `userId` only for global tokens.

The route does not process queues, send email, start workers, run schedulers, invoke OpenAI, call MLS Grid, reset/reindex Typesense, or mutate broad customer records.

## Residual Risks

- The current model has no explicit expired or revoked token fields, so those states cannot be distinguished beyond `usedAt`.
- Production valid-token proof must avoid real customer unsubscribe mutation unless separately authorized.

## Closure Decision

`UNSUBSCRIBE-001` is `CLOSED`. Production deployment and canonical-domain HTTP proof passed with intentional non-500 handling for missing, malformed, synthetic unknown, and repeated synthetic unknown token states. Valid-token production proof is governed separately by `UNSUBSCRIBE-002`.
