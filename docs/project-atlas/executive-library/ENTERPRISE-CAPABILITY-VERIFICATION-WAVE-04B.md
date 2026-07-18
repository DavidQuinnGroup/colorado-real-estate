# PROJECT ATLAS - Enterprise Capability Verification Wave 4B

Vercel Prisma Client Generation Remediation

Baseline: `0f83ef4`  
Verification date: 2026-07-18  
Outcome: `LOCAL_VALIDATED_READY_FOR_DEPLOYMENT`

## 1. Executive Summary

Wave 4B investigated the Vercel production build failure for commit `0f83ef4`. The failure was isolated to Prisma Client generation order, not to a missing schema model or an application route defect.

The local schema contains `REIEControlState`, and a fresh local `prisma generate` produces the expected `prisma.rEIEControlState` accessor. The previous Vercel build path ran `next build` without a guaranteed Prisma generation step, allowing a stale generated client to be used during TypeScript compilation.

Wave 4B adds explicit Prisma generation before Vercel/Next compilation and a non-mutating Prisma Client parity check that fails when launch-critical generated model accessors are missing.

## 2. Baseline

| Field | Value |
| --- | --- |
| Branch | `main` |
| Local HEAD | `0f83ef4` |
| origin/main | `0f83ef4` |
| Ahead/behind | `0 0` |
| Working tree at start | clean |
| Vercel project | `david-quinn-group-8rde` |
| Vercel repository | `DavidQuinnGroup/colorado-real-estate` |
| Failed deployment | `dpl_F8PLN6vW3yXVsbG8xcV79in4qNFV` |
| Failed commit | `0f83ef4` |

`.env.local` remains ignored by `.gitignore`.

## 3. Vercel Build Failure

Vercel cloned `DavidQuinnGroup/colorado-real-estate` on branch `main` at commit `0f83ef4`, installed dependencies, and ran `npm run build`.

The production build failed during TypeScript compilation:

```text
app/api/admin/control-state/route.ts:232
Property 'rEIEControlState' does not exist on type PrismaClient
```

The failure occurred before deployment became Ready.

## 4. Prisma Model Evidence

| Evidence | Result |
| --- | --- |
| Prisma model name | `REIEControlState` |
| Expected generated accessor | `rEIEControlState` |
| Schema location | `prisma/schema.prisma` |
| Model status | Active model, not commented or conditional |
| Migration evidence | `prisma/migrations/20260520012000_add_reie_control_state/migration.sql` |
| Route usage | `app/api/admin/control-state/route.ts` uses `prisma.rEIEControlState` |
| Prisma import | Route imports the shared client from `@/lib/prisma` |
| Generated output | Default `prisma-client-js` output |

`npx prisma validate` passed against the authoritative schema.

## 5. Generated Client Evidence

After `npx prisma generate`, local inspection of `node_modules/.prisma/client/index.d.ts` confirmed:

| Model | Accessor |
| --- | --- |
| `REIEControlState` | `rEIEControlState` |
| `Property` | `property` |
| `User` | `user` |
| `CRMTask` | `cRMTask` |
| `UserPreference` | `userPreference` |
| `SavedSearch` | `savedSearch` |
| `AlertQueue` | `alertQueue` |
| `UnsubscribeToken` | `unsubscribeToken` |

No database connection is required to prove this type surface.

## 6. Root Cause

Classification: `PRISMA_GENERATE_NOT_RUN_IN_VERCEL`

Contributing risk: `STALE_VERCEL_BUILD_CACHE`

Evidence:

- The previous `package.json` build script was `next build`.
- No `postinstall` or `vercel-build` script generated Prisma Client.
- The failed Vercel build ran `npm run build` and failed while compiling a route that depends on a recently added Prisma model.
- Local `npx prisma generate` produced the expected `rEIEControlState` accessor without schema changes.
- Prisma and `@prisma/client` versions are matched at `5.22.0`.

No evidence was found for a wrong schema path, version mismatch, committed generated client shadowing, or multiple generated client outputs.

## 7. Build-Order Correction

Previous order:

```text
npm run build -> next build
```

Corrected order:

```text
npm install -> postinstall -> prisma generate
npm run build -> prisma generate && next build
```

The build-time generation step is intentional because Vercel restored build cache in the failed deployment and TypeScript compilation must not depend on a previously generated client artifact.

The corrected build sequence does not run migrations, `prisma db push`, workers, schedulers, queue processing, email delivery, MLS Grid, OpenAI, TitlePro247, or Typesense reset/reindex.

## 8. Parity Check

Added:

```text
npm run check:prisma-client-parity
```

The check compiles worker scripts and runs `dist/scripts/checkPrismaClientParity.js`. It inspects `node_modules/.prisma/client/index.d.ts` for required launch-critical model names and generated Prisma accessors.

It does not connect to a database and does not read or print secrets.

## 9. Clean-Build Simulation

Clean-build simulation completed:

- Removed reproducible `.next` output.
- Removed reproducible generated Prisma Client output under `node_modules/.prisma/client`.
- Ran `npm run build`, which performed `prisma generate && next build`.

Result: passed. The generated Prisma Client was recreated before Next.js compilation, and `/api/admin/control-state` compiled successfully.

Final local validation passed:

- `npx prisma generate`.
- `npm run check:prisma-client-parity`.
- `npx prisma validate`.
- `npm run check:unsubscribe-safety`.
- `npm run lint`.
- `npm run typecheck`.
- `npm run worker:build`.
- `npm run build`.

## 10. Safety Review

Permitted operations used:

- Static Prisma/schema inspection.
- Prisma Client generation.
- TypeScript compilation.
- Next.js production build.
- Non-mutating generated-client parity inspection.

Not used:

- Database reset.
- `prisma db push`.
- Production database mutation.
- Email sends.
- Queue processing.
- Workers or schedulers.
- CRM mutation.
- MLS Grid.
- OpenAI.
- TitlePro247.
- Typesense reset or reindex.

## 11. Files Changed

- `package.json`.
- `tsconfig.worker.json`.
- `scripts/checkPrismaClientParity.ts`.
- `dist/scripts/checkPrismaClientParity.js`.
- `docs/project-atlas/executive-library/ENTERPRISE-CAPABILITY-VERIFICATION-WAVE-04B.md`.
- `docs/project-atlas/executive-library/PRODUCTION-DEPLOYMENT-ALIGNMENT-REPORT.md`.
- `docs/project-atlas/executive-library/ENTERPRISE-CAPABILITY-VERIFICATION-WAVE-04A.md`.
- `docs/project-atlas/executive-library/PROJECT-ATLAS-LAUNCH-READINESS-CERTIFICATION-V1.md`.

## 12. Deployment Plan

After final local validation, commit the focused remediation and push one normal fast-forward commit to:

```text
origin main -> DavidQuinnGroup/colorado-real-estate
```

Expected Vercel behavior:

- Project: `david-quinn-group-8rde`.
- Repository: `DavidQuinnGroup/colorado-real-estate`.
- Branch: `main`.
- Environment: Production.
- Deployment trigger: automatic Git integration.

## 13. Remaining Certification Gates

Internal Preview remains uncertified until:

1. The Wave 4B production deployment becomes Ready.
2. Production root, redirect, search, search API, robots, sitemap, and unsubscribe safety routes are revalidated.
3. Bounded readiness checks confirm queues, CRM, migrations, and dead-letter state without processing work.
4. A controlled production-hosted alert email is sent under owner authorization.
5. Exactly one production-domain tracked click is completed under owner authorization.

## 14. Commands Not Run

Not run in Wave 4B remediation:

- Production validation email.
- Manual Vercel redeploy.
- Live workers.
- Queue retries or queue processing.
- Alert dry-runs or live alert processing.
- CRM mutation.
- MLS Grid requests.
- OpenAI requests.
- TitlePro247 requests.
- Typesense reset or reindex.
- `prisma db push`.
- Database reset.
