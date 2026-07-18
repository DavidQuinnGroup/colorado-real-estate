# PROJECT ATLAS - Enterprise Capability Verification Wave 4C

Recharts Dependency Alignment

Baseline: `170cab0`  
Verification date: 2026-07-18  
Outcome: `LOCAL_VALIDATED_READY_FOR_DEPLOYMENT`

## 1. Executive Summary

Wave 4C investigated the Vercel production build failure that followed the Wave 4B Prisma remediation. The Prisma generation error was resolved in Vercel, and the next deploy failed on an undeclared charting dependency.

The source imports `recharts` from two client chart components, but `recharts` was not declared in `package.json` or installed from the lockfile. Wave 4C declares Recharts as a production dependency, adds a bounded dependency parity check, and validates the result from a clean `npm ci` install and production build.

## 2. Baseline

| Field | Value |
| --- | --- |
| Branch | `main` |
| Local HEAD | `170cab0` |
| origin/main | `170cab0` |
| Ahead/behind | `0 0` |
| Working tree at start | clean |
| Latest failed deployment | `dpl_76jFbGtrc1GgH4MjXtakmSQmojAd` |
| Failed commit | `170cab0` |

`.env.local` remains ignored by `.gitignore`.

## 3. Vercel Build Failure

Vercel cloned `DavidQuinnGroup/colorado-real-estate` on branch `main` at commit `170cab0`.

The Wave 4B remediation succeeded in Vercel:

- `postinstall` ran `prisma generate`.
- `npm run build` ran `prisma generate && next build`.
- The prior `prisma.rEIEControlState` TypeScript error did not recur.

The next build blocker was:

```text
./components/MarketChart.tsx:12:8
Type error: Cannot find module 'recharts' or its corresponding type declarations.
```

## 4. Recharts Usage Evidence

Recharts import sites:

| File | Imported components |
| --- | --- |
| `components/MarketChart.tsx` | `Area`, `AreaChart`, `CartesianGrid`, `ResponsiveContainer`, `Tooltip`, `XAxis`, `YAxis` |
| `components/MarketPriceChart.tsx` | `CartesianGrid`, `Line`, `LineChart`, `ResponsiveContainer`, `Tooltip`, `XAxis`, `YAxis` |

Both files are client components with `"use client"`.

Repository search found no other Recharts source imports and no prior package-lock Recharts entry before Wave 4C.

## 5. Dependency Classification

Classification: `REQUIRED_PRODUCTION_DEPENDENCY`

Reason:

- Production `next build` type-checks these source files.
- The Vercel clean environment cannot resolve undeclared packages.
- Removing or redesigning chart code was not justified by dead-code evidence and was outside Wave 4C scope.

## 6. Version Selection

Selected version: `recharts@3.9.2`

Local package metadata after install:

| Field | Result |
| --- | --- |
| React peer range | `^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0` |
| React DOM peer range | `^16.0.0 || ^17.0.0 || ^18.0.0 || ^19.0.0` |
| React IS peer range | `^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0` |
| Type declarations | bundled, `types/index.d.ts` |
| `@types/recharts` needed | no |

Project compatibility:

- `react@19.2.5`.
- `react-dom@19.2.5`.
- `next@15.1.6`.
- `typescript@5.9.3`.
- Node local runtime: `v24.14.0`.
- npm local version: `11.9.0`.

## 7. Package Changes

Added:

```json
"recharts": "^3.9.2"
```

Updated:

- `package.json`.
- `package-lock.json`.

No React, React DOM, Next.js, TypeScript, npm registry, or package-manager override changes were made.

## 8. Chart Compatibility Findings

`npm run typecheck` passed after installing Recharts.

No chart source corrections were required:

- Tooltip formatter usage type-checks.
- Axis tick formatters type-check.
- Responsive containers are already inside fixed-height wrappers.
- Both Recharts consumers already declare `"use client"`.

## 9. Dependency Check

Added:

```text
npm run check:production-dependencies
```

The check verifies selected production-critical dependencies are declared in `package.json` and resolvable from the project:

- `recharts`.
- `@prisma/client`.
- `next`.
- `react`.
- `react-dom`.

It does not use network access, runtime services, database access, secrets, workers, queues, or email.

## 10. Clean-Install Validation

Clean install:

- `npm ci`: passed.
- `postinstall`: ran `prisma generate`.
- `npm ls recharts --depth=0`: `recharts@3.9.2`.

Clean-install validation passed:

- `npm run check:production-dependencies`.
- `npm run check:prisma-client-parity`.
- `npm run check:unsubscribe-safety`.
- `npm run lint`.
- `npm run typecheck`.
- `npm run worker:build`.
- `npm run build`.

The production build completed successfully and included `/api/admin/control-state`, `/search`, `/robots.txt`, and `/sitemap.xml`.

## 11. Safety Review

The Wave 4C install/build sequence did not:

- Apply migrations.
- Alter the database.
- Process queues.
- Start workers or schedulers.
- Send email.
- Invoke MLS Grid.
- Invoke OpenAI.
- Invoke TitlePro247.
- Reset or reindex Typesense.

The only package lifecycle script observed was `postinstall -> prisma generate`.

## 12. Files Changed

- `package.json`.
- `package-lock.json`.
- `tsconfig.worker.json`.
- `scripts/checkProductionDependencies.ts`.
- `dist/scripts/checkProductionDependencies.js`.
- `docs/project-atlas/executive-library/ENTERPRISE-CAPABILITY-VERIFICATION-WAVE-04C.md`.
- `docs/project-atlas/executive-library/PRODUCTION-DEPLOYMENT-ALIGNMENT-REPORT.md`.
- `docs/project-atlas/executive-library/ENTERPRISE-CAPABILITY-VERIFICATION-WAVE-04B.md`.
- `docs/project-atlas/executive-library/PROJECT-ATLAS-LAUNCH-READINESS-CERTIFICATION-V1.md`.

## 13. Deployment Plan

After final local validation, commit the focused dependency correction and push one normal fast-forward commit to:

```text
origin main -> DavidQuinnGroup/colorado-real-estate
```

Expected Vercel behavior:

- Project: `david-quinn-group-8rde`.
- Repository: `DavidQuinnGroup/colorado-real-estate`.
- Branch: `main`.
- Environment: Production.
- Deployment trigger: automatic Git integration.

## 14. Remaining Certification Gates

Internal Preview remains uncertified until:

1. The Wave 4C production deployment becomes Ready.
2. Production root, redirect, search, search API, robots, sitemap, and unsubscribe safety routes are revalidated.
3. Bounded readiness checks confirm queues, CRM, migrations, and dead-letter state without processing work.
4. A controlled production-hosted alert email is sent under owner authorization.
5. Exactly one production-domain tracked click is completed under owner authorization.

## 15. Commands Not Run

Not run in Wave 4C remediation:

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
