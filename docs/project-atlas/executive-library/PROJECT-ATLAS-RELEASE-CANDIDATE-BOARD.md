# PROJECT ATLAS - Release Candidate Board

Generated: 2026-07-18  
Release candidate: `RC1`

## Summary

RC1 tracks production defects that block Internal Preview certification after the first Ready production deployment from the corrected `DavidQuinnGroup/colorado-real-estate` production source.

## Issues

| Issue | Severity | Status | Baseline | Summary |
| --- | --- | --- | --- | --- |
| `SEARCH-001` | Critical | `CLOSED` | `27a77b4` | Production `/search` and `/api/search` failed because Vercel Production lacked `DATABASE_URL`; deployed fix at `dae8f6d` now degrades safely to existing Supabase REST read variables when Prisma cannot initialize. |
| `UNSUBSCRIBE-001` | Critical | `CLOSED` | `dae8f6d` | Production safe-token validation passed after `9343f6d`: missing and malformed tokens returned 400, synthetic unknown and repeated unknown tokens returned 404, and valid-token scope isolation remains fixture-backed. |
| `UNSUBSCRIBE-002` | High | `CLOSED` | `684040f` | Controlled valid unsubscribe proof used one approved internal global-token fixture, made exactly two production GETs to the same redacted valid URL, changed only the selected token/user on Request 1, returned an idempotent already-unsubscribed response on Request 2, restored the internal user subscription state once, and preserved EmailLog, AlertQueue, BullMQ, CRM, saved-search, token-count, and user-count isolation. |
| `PROPERTY-001` | High | `CLOSED` | `9343f6d` | Production `/properties/[id]` failed because the property detail route still depended on Prisma while Vercel Production lacks `DATABASE_URL`; deployed fix at `def6537` adds read-only Supabase REST fallback and related-link degradation. |
| `EMAIL-001` | High | `CLOSED` | `def6537` | Controlled one-row production alert delivery proof passed from governed source `bd4f76c`: exactly `processAlertById("cmq0zp6up010gpd4uh5anfex5", false)` sent one email to the approved internal recipient, selected alert reached `sent`, EmailLog increased by one, and BullMQ/CRM/click side effects stayed isolated. |
| `CLICK-001` | High | `CLOSED` | `a4c2999` | Final controlled production proof after deployed correction `4c9d85c` made exactly one authorized tracked-link request, returned `307 -> 200`, persisted selected `AlertQueue.clickedAt`, added exactly one click interaction, increased heat score once, and preserved EmailLog, queue, CRM, token, saved-search, and BullMQ isolation. |
| `CLICK-RUNTIME-001` | High | `CLOSED` | `4e9cd1e` | Root cause verified and deployed: the Supabase fallback scanned only the first 100 unclicked alert rows while the selected row was row 118. Correction `4c9d85c` pages bounded candidates, marks before enrichment, suppresses duplicate enrichment, and final production proof persisted `clickedAt`. |
| `READY-001` | High | `CLOSED` | `2357656` | Final RC1 readiness refresh passed on current production source: root, canonical redirect, property, search, safe unsubscribe errors, schema/migrations, queue/dead-letter, CRM, typecheck, lint, and build all validated; launch readiness remains `watch` only for operator review of pending saved-search alerts before live processing. |
| `CERT-001` | High | `NEXT` | `2357656` | Certification is the next governed issue after READY-001 closure. RC1 remains not certified until CERT-001 is explicitly authorized and completed. |

## Status Definitions

| Status | Meaning |
| --- | --- |
| `OPEN` | Issue exists and is not yet diagnosed. |
| `ROOT_CAUSE_VERIFIED` | Evidence identifies the smallest confirmed cause. |
| `FIX_IN_PROGRESS` | A bounded correction is being implemented. |
| `READY_FOR_VERIFICATION` | Local validation passed and the issue is ready for production deployment verification. |
| `READY_FOR_DEPLOYMENT_VERIFICATION` | Local validation passed and the correction has been committed or is ready to be deployed for read-only production health verification. |
| `PRODUCTION_VERIFIED` | Production validation passed after deployment. |
| `CLOSED` | Issue is verified and release-board closure is recorded. |
| `BLOCKED_PRE_SEND` | Issue is intentionally stopped before sending or mutation because a prerequisite gate is not complete. |
| `READY_FOR_CONTROLLED_RETRY` | A bounded runtime correction is deployed, but the issue cannot close until a new explicitly authorized controlled request verifies the corrected behavior. |
| `NEXT` | Issue is the next governed work item but has not been started or authorized in this turn. |
| `BLOCKED_RUNTIME` | Production verification failed after the authorized bounded request; further mutation requires a new explicit assignment. |
| `BLOCKED` | Issue remains gated by a preceding governed issue or explicit authorization. |

## Current Release Decision

`RC1_NOT_CERTIFIED`

Reason: `SEARCH-001`, `UNSUBSCRIBE-001`, `UNSUBSCRIBE-002`, `PROPERTY-001`, `EMAIL-001`, `CLICK-RUNTIME-001`, `CLICK-001`, and `READY-001` are verified and closed. RC1 remains uncertified until CERT-001 is explicitly authorized and completed.
