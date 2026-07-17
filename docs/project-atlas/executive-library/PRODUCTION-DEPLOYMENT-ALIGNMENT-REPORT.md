# PROJECT ATLAS - Production Deployment Alignment Report

Generated: 2026-07-17  
Baseline commit: `5b629c8`  
Classification: `STALE_DEPLOYMENT`

## Summary

Production `davidquinngroup.com` is active on Vercel but is not serving the current `main` route surface. Current `main` builds `/search`, `/robots.txt`, `/sitemap.xml`, `/api/search`, `/api/unsubscribe`, `/api/track-click`, and `/properties/[id]`. Production still returns 404 for `/search`, `/robots.txt`, and `/sitemap.xml`, returns 500 for an invalid unsubscribe token, and returns a raw Typesense DNS error from `/api/search?limit=1`.

## Local Vercel Linkage

| Field | Value |
| --- | --- |
| Project name | `david-quinn-group-8rde` |
| Project ID | `prj_Ry5WCDfamYUq1oO7t1CwCVwTvh4G` |
| Org/team ID | `team_53Do8TFrDJHK8AJsziDVZyRQ` |
| Expected Git repo | `DavidQuinnGroup/colorado-real-estate` |
| Expected production branch | `main` |
| Commit to deploy | `5b629c8` plus Wave 4A remediation commit |

No local `vercel.json` file exists.

## Production Evidence

| Route | Result |
| --- | --- |
| `https://davidquinngroup.com` | 200 |
| `https://www.davidquinngroup.com` | 308 to root |
| `https://davidquinngroup.com/search` | 404 |
| `https://davidquinngroup.com/api/search?limit=1` | Typesense DNS error |
| `https://davidquinngroup.com/robots.txt` | 404 |
| `https://davidquinngroup.com/sitemap.xml` | 404 |
| Invalid unsubscribe token | 500 |

## Required Owner Checkpoint

Before deployment:

1. Restore valid Vercel access.
2. Confirm project `david-quinn-group-8rde`, project ID `prj_Ry5WCDfamYUq1oO7t1CwCVwTvh4G`, team ID `team_53Do8TFrDJHK8AJsziDVZyRQ`.
3. Confirm Git integration points to `DavidQuinnGroup/colorado-real-estate`.
4. Confirm Production branch is `main`.
5. Verify Production environment variables for canonical URL, Typesense, Resend, tracking, and unsubscribe behavior.
6. Redeploy current `main` through the existing project only.

Do not create a new Vercel project. Do not change Preview or Development variables without evidence.

## Expected Post-Deploy Route State

| Route | Expected |
| --- | --- |
| `/` | 200 |
| `/search` | 200 |
| `/api/search?limit=1` | 200 with Typesense or intentional database fallback |
| `/robots.txt` | 200 |
| `/sitemap.xml` | 200 |
| missing unsubscribe token | 400 |
| unknown invalid unsubscribe token | 404 |
| already-used unsubscribe token | 200 idempotent response |

## Deployment Status

Deployment was not executed in Wave 4A because hosted environment variables and the existing Vercel production target could not be verified.
