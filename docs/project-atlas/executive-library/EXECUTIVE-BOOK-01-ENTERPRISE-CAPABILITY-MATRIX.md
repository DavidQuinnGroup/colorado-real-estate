# PROJECT ATLAS - Executive Book 01

## Enterprise Capability Matrix

Baseline: `ff590d4`  
Wave: Enterprise Capability Verification Program Wave 1 - Repository-to-Code Baseline  
Generated: 2026-07-17

## Purpose

The Enterprise Capability Matrix is the executive operating layer between Canon, the Enterprise Repository, and the REIE codebase. The Repository records what enterprise objects exist. This matrix records what the business can do, how mature each capability is, and whether current code evidence supports that maturity.

The Executive Library remains beside Canon, not inside Canon. Canon preserves architecture and identity. The Executive Library manages execution, readiness, and capability decisions.

## Verification Rules

Wave 1 used documentation, Google Docs source material, local static analysis, and bounded local validation only. It did not run live sync, live workers, live email sends, CRM mutations, OpenAI calls, MLS Grid requests, Typesense reset/reindex, queue retries, saved-search alert dry-runs, or `npm run smoke:property-inquiry`.

Verification statuses:

| Status | Meaning |
| --- | --- |
| `VERIFIED_COMPLETE` | Local evidence supports the capability as complete for the stated scope. |
| `VERIFIED_PARTIAL` | Meaningful evidence exists, but launch/runtime/customer/monitoring proof is incomplete. |
| `VERIFIED_MISSING` | Expected capability evidence is absent. |
| `VERIFIED_DEFERRED` | Capability is intentionally deferred and should not block REIE launch. |
| `NOT_YET_VERIFIED` | Source material names the capability, but Wave 1 evidence is insufficient. |
| `NOT_APPLICABLE` | Capability is not applicable to this baseline. |

Maturity scale:

| Level | Name |
| --- | --- |
| 1 | Defined |
| 2 | Governed |
| 3 | Architected |
| 4 | Implemented |
| 5 | Validated |
| 6 | Production |
| 7 | Optimized |

## Domain Summary

| Domain | Capabilities | Complete | Partial | Deferred | Not Yet Verified | Launch-Critical |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Product | 8 | 0 | 8 | 0 | 0 | 6 |
| Operations | 6 | 0 | 6 | 0 | 0 | 6 |
| Commercial | 5 | 0 | 3 | 0 | 2 | 2 |
| Enterprise Intelligence | 5 | 0 | 4 | 1 | 0 | 2 |
| Governance | 5 | 3 | 2 | 0 | 0 | 1 |
| AI | 4 | 0 | 0 | 4 | 0 | 0 |
| Executive Management | 5 | 1 | 4 | 0 | 0 | 3 |
| Total | 38 | 4 | 27 | 5 | 2 | 20 |

No capability was classified as `VERIFIED_MISSING` in Wave 1. That does not mean every capability is launch-ready; it means the baseline found either implementation evidence, intentional deferral, or insufficient evidence requiring later verification.

## Capability Matrix

| ID | Capability | Domain | Status | Maturity | Launch Critical | Primary Evidence |
| --- | --- | --- | --- | ---: | --- | --- |
| PROD-001 | Search & Discovery | Product | `VERIFIED_PARTIAL` | 5 | Yes | `app/search/page.tsx`, `app/api/search/route.ts`, `components/search/SearchInterface.tsx`, `lib/typesense/*` |
| PROD-002 | Property Experience | Product | `VERIFIED_PARTIAL` | 5 | Yes | `app/properties/[id]/page.tsx`, `components/search/PropertyDetail.tsx`, `app/api/property-inquiry/route.ts` |
| PROD-003 | Buyer Experience | Product | `VERIFIED_PARTIAL` | 4 | Yes | `app/api/save-search/route.ts`, `components/maps/SaveSearch.tsx`, `lib/alerts/matchSavedSearches.ts` |
| PROD-004 | Seller Experience | Product | `VERIFIED_PARTIAL` | 4 | No | `app/api/valuation/route.ts`, `components/HomeValueEstimator.tsx`, `lib/seller/createSellerLead.ts` |
| PROD-005 | Market Content | Product | `VERIFIED_PARTIAL` | 4 | No | `app/market/[city]/page.tsx`, `app/articles/[slug]/page.tsx`, `lib/content/*` |
| PROD-006 | Customer Accounts | Product | `VERIFIED_PARTIAL` | 4 | Yes | `prisma/schema.prisma`, `app/api/unsubscribe/route.ts`, `lib/preferences/updateUserPreferences.ts` |
| PROD-007 | Notifications | Product | `VERIFIED_PARTIAL` | 5 | Yes | `lib/alerts/*`, `lib/email/*`, `workers/alertWorker.ts`, `docs/email-system.md` |
| PROD-008 | Public Website | Product | `VERIFIED_PARTIAL` | 5 | Yes | `app/page.tsx`, `app/search/page.tsx`, `app/properties/[id]/page.tsx`, `scripts/publicExperienceSmoke.ts` |
| OPS-001 | Platform Infrastructure | Operations | `VERIFIED_PARTIAL` | 5 | Yes | `package.json`, `docker-compose.yml`, `lib/prisma.ts`, `lib/queue/redis.ts` |
| OPS-002 | Data Platform | Operations | `VERIFIED_PARTIAL` | 5 | Yes | `prisma/schema.prisma`, `prisma/migrations/*`, `scripts/checkSupabase.ts` |
| OPS-003 | MLS Operations | Operations | `VERIFIED_PARTIAL` | 5 | Yes | `lib/mls/*`, `workers/mlsWorker.ts`, `workers/mlsPageWorker.ts`, `docs/mls-ingestion.md` |
| OPS-004 | Security | Operations | `VERIFIED_PARTIAL` | 4 | Yes | `app/api/admin/repository/auth.ts`, `app/api/admin/control-state/route.ts`, `app/api/mls/retry/route.ts` |
| OPS-005 | Reliability | Operations | `VERIFIED_PARTIAL` | 5 | Yes | `scripts/launchReadiness.ts`, `scripts/queueDashboard.ts`, `components/admin/DeadLetterInspector.tsx` |
| OPS-006 | DevOps | Operations | `VERIFIED_PARTIAL` | 4 | Yes | `package.json`, `tsconfig.worker.json`, readiness scripts |
| COMM-001 | CRM | Commercial | `VERIFIED_PARTIAL` | 4 | Yes | `app/api/admin/crm-tasks/route.ts`, `app/api/admin/intake-signals/route.ts`, `scripts/runCRM.ts` |
| COMM-002 | Marketing | Commercial | `VERIFIED_PARTIAL` | 4 | No | `lib/content/*`, `lib/email/templates/*`, `components/LeadCapture.tsx` |
| COMM-003 | Sales | Commercial | `VERIFIED_PARTIAL` | 4 | Yes | `components/PropertyInquiryForm.tsx`, `app/api/valuation/route.ts`, `lib/seller/createSellerLead.ts` |
| COMM-004 | Partnerships | Commercial | `NOT_YET_VERIFIED` | 1 | No | Google Docs inventory only |
| COMM-005 | Customer Success | Commercial | `NOT_YET_VERIFIED` | 1 | No | Google Docs inventory only |
| INTEL-001 | Executive Intelligence | Enterprise Intelligence | `VERIFIED_PARTIAL` | 3 | Yes | `app/admin/page.tsx`, `scripts/launchReadiness.ts`, `docs/launch-core-checklist.md` |
| INTEL-002 | Customer Intelligence | Enterprise Intelligence | `VERIFIED_PARTIAL` | 3 | No | `lib/analytics/*`, `app/api/track-click/route.ts` |
| INTEL-003 | Market Intelligence | Enterprise Intelligence | `VERIFIED_PARTIAL` | 4 | No | `lib/marketAnalytics.ts`, `lib/forecastEngine.ts`, `lib/shadowInventory.ts` |
| INTEL-004 | Business Intelligence | Enterprise Intelligence | `VERIFIED_PARTIAL` | 3 | Yes | `scripts/launchReadiness.ts`, `scripts/queueDashboard.ts`, `app/admin/page.tsx` |
| INTEL-005 | AI Decision Support | Enterprise Intelligence | `VERIFIED_DEFERRED` | 1 | No | Google Docs assessment, `lib/ai/*` |
| GOV-001 | Enterprise Repository | Governance | `VERIFIED_COMPLETE` | 6 | No | `app/admin/repository/*`, `lib/repository/server.ts`, Repository Sprint docs |
| GOV-002 | Canon Governance | Governance | `VERIFIED_COMPLETE` | 6 | No | `docs/REPOSITORY_GOVERNANCE_CLOSURE_CYCLE_1.md`, Google Docs Executive Library |
| GOV-003 | Traceability | Governance | `VERIFIED_COMPLETE` | 6 | No | Repository closure cycle, validation SQL |
| GOV-004 | Enterprise Governance | Governance | `VERIFIED_PARTIAL` | 5 | No | Repository governance closure docs and SQL |
| GOV-005 | Knowledge Management | Governance | `VERIFIED_PARTIAL` | 5 | Yes | `docs/CHAT_START.md`, `docs/launch-core-checklist.md`, Executive Library files |
| AI-001 | AI Brand Brain | AI | `VERIFIED_DEFERRED` | 1 | No | Google Docs assessment |
| AI-002 | AI Customer Intelligence | AI | `VERIFIED_DEFERRED` | 1 | No | Google Docs assessment, `lib/ai/*` |
| AI-003 | AI Market Intelligence | AI | `VERIFIED_DEFERRED` | 1 | No | Google Docs assessment, `lib/ai/*` |
| AI-004 | AI Platform Intelligence | AI | `VERIFIED_DEFERRED` | 1 | No | Google Docs assessment |
| EXEC-001 | Executive Portfolio | Executive Management | `VERIFIED_PARTIAL` | 2 | No | Google Docs Executive Library, launch checklist |
| EXEC-002 | Capability Management | Executive Management | `VERIFIED_COMPLETE` | 4 | Yes | Executive Library books and JSON data |
| EXEC-003 | Strategic Planning | Executive Management | `VERIFIED_PARTIAL` | 2 | No | `docs/CHAT_START.md`, `docs/launch-core-checklist.md` |
| EXEC-004 | Enterprise Risk | Executive Management | `VERIFIED_PARTIAL` | 2 | Yes | Gap report, launch checklist |
| EXEC-005 | Executive Operations | Executive Management | `VERIFIED_PARTIAL` | 3 | Yes | `docs/CHAT_START.md`, `scripts/launchReadiness.ts` |

## Canonical Data

Structured capability records are maintained in:

- `docs/project-atlas/executive-library/data/enterprise-capabilities.json`
- `docs/project-atlas/executive-library/data/capability-verification-register.json`
- `docs/project-atlas/executive-library/data/launch-critical-capability-gaps.json`
