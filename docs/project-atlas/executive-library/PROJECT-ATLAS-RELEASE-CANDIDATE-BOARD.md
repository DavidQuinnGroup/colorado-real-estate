# PROJECT ATLAS - Release Candidate Board

Generated: 2026-07-18  
Release candidate: `RC1`

## Summary

RC1 tracks production defects that block Internal Preview certification after the first Ready production deployment from the corrected `DavidQuinnGroup/colorado-real-estate` production source.

## Issues

| Issue | Severity | Status | Baseline | Summary |
| --- | --- | --- | --- | --- |
| `SEARCH-001` | Critical | `CLOSED` | `27a77b4` | Production `/search` and `/api/search` failed because Vercel Production lacked `DATABASE_URL`; deployed fix at `dae8f6d` now degrades safely to existing Supabase REST read variables when Prisma cannot initialize. |
| `UNSUBSCRIBE-001` | Critical | `OPEN` | `dae8f6d` | Invalid synthetic unsubscribe token still requires bounded diagnosis; do not begin without explicit authorization in the next work package. |

## Status Definitions

| Status | Meaning |
| --- | --- |
| `OPEN` | Issue exists and is not yet diagnosed. |
| `ROOT_CAUSE_VERIFIED` | Evidence identifies the smallest confirmed cause. |
| `FIX_IN_PROGRESS` | A bounded correction is being implemented. |
| `READY_FOR_VERIFICATION` | Local validation passed and the issue is ready for production deployment verification. |
| `PRODUCTION_VERIFIED` | Production validation passed after deployment. |
| `CLOSED` | Issue is verified and release-board closure is recorded. |

## Current Release Decision

`RC1_NOT_CERTIFIED`

Reason: `SEARCH-001` is production verified and closed. RC1 remains uncertified because `UNSUBSCRIBE-001` is still open.
