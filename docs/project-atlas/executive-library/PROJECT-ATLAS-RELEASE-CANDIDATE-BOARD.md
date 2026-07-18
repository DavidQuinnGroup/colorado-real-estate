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
| `PROPERTY-001` | High | `CLOSED` | `9343f6d` | Production `/properties/[id]` failed because the property detail route still depended on Prisma while Vercel Production lacks `DATABASE_URL`; deployed fix at `def6537` adds read-only Supabase REST fallback and related-link degradation. |
| `EMAIL-001` | High | `CLOSED` | `def6537` | Controlled one-row production alert delivery proof passed from governed source `bd4f76c`: exactly `processAlertById("cmq0zp6up010gpd4uh5anfex5", false)` sent one email to the approved internal recipient, selected alert reached `sent`, EmailLog increased by one, and BullMQ/CRM/click side effects stayed isolated. |
| `CLICK-001` | High | `READY_FOR_CONTROLLED_RETRY` | `a4c2999` | The first controlled production tracking request reached `/api/track-click` once, redirected to the selected property URL, inserted one `LISTING_CLICK`, and increased heat score by 5, but `clickedAt` stayed null because the primary Prisma JSON-path mark matched zero rows. Fixes at `3d5d7aa` and `8dc4f87` add Supabase fallback marking and zero-row backfill; deployment `5503704415` reached success. |

## Status Definitions

| Status | Meaning |
| --- | --- |
| `OPEN` | Issue exists and is not yet diagnosed. |
| `ROOT_CAUSE_VERIFIED` | Evidence identifies the smallest confirmed cause. |
| `FIX_IN_PROGRESS` | A bounded correction is being implemented. |
| `READY_FOR_VERIFICATION` | Local validation passed and the issue is ready for production deployment verification. |
| `PRODUCTION_VERIFIED` | Production validation passed after deployment. |
| `CLOSED` | Issue is verified and release-board closure is recorded. |
| `BLOCKED_PRE_SEND` | Issue is intentionally stopped before sending or mutation because a prerequisite gate is not complete. |
| `READY_FOR_CONTROLLED_RETRY` | A bounded runtime correction is deployed, but the issue cannot close until a new explicitly authorized controlled request verifies the corrected behavior. |

## Current Release Decision

`RC1_NOT_CERTIFIED`

Reason: `SEARCH-001`, `UNSUBSCRIBE-001`, `PROPERTY-001`, and `EMAIL-001` are production verified and closed. `CLICK-001` has a deployed correction but needs explicit authorization for one controlled retry because the originally authorized click was already spent before `clickedAt` was marked. RC1 remains uncertified until `CLICK-001` and the remaining valid-unsubscribe proof issue are closed.
