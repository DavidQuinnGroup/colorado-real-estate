# EIA 1.0 Wave 2 Sprint 5 Internal Preview Adapter

Date opened: 2026-07-19
Implementation status: `IMPLEMENTED_NOT_CERTIFIED`

## Scope

Sprint 5 adds the Internal Preview Adapter for EIA 1.0. The adapter is internal-admin only and reads governed Project Atlas RC1 certification records to expose Internal Preview readiness evidence through the Enterprise Adapter Framework.

Authorized source records:

- `docs/project-atlas/executive-library/release-candidate-board.json`
- `docs/project-atlas/executive-library/RC1-CERT-001.md`

The adapter does not certify Sprint 5, does not close `GAP-006`, and does not authorize public launch, customer beta, workers, schedulers, live email, live MLS, OpenAI, TitlePro247, Typesense administrative work, queue retry or drain, database reset, `prisma db push`, `npm audit fix`, force-push, or any live operational expansion.

## Implementation

Files:

- `lib/internal-preview/previewAdapter.ts`
- `app/api/admin/enterprise/internal-preview-adapter/route.ts`
- `scripts/checkInternalPreviewAdapterSafety.ts`
- `package.json`
- `tsconfig.worker.json`
- `dist/lib/internal-preview/previewAdapter.js`
- `dist/scripts/checkInternalPreviewAdapterSafety.js`

Admin route:

`/api/admin/enterprise/internal-preview-adapter`

The route reuses Repository admin authorization. Unauthenticated invocation and inspection return `401`. No public route is added.

## KPI Ownership

Supported Internal Preview KPI set:

- `KPI-CUST-001` Active Preview Participants
- `KPI-CUST-002` Preview Sessions
- `KPI-CUST-003` Searches Performed
- `KPI-CUST-004` Property Detail Views
- `KPI-CUST-005` Repeat Preview Usage
- `KPI-OPS-001` Open Operational Issues
- `KPI-OPS-002` Critical Incident Count
- `KPI-BUS-001` Core Workflow Adoption
- `KPI-BUS-002` Feature Adoption Coverage
- `KPI-GROW-001` Preview Participant Activation Rate
- `KPI-GROW-002` Preview Participant Retention

The adapter maps `KPI-OPS-001` from governed RC1 certification records. Closed RC1 certification with `CERTIFIED_FOR_INTERNAL_PREVIEW` produces `openCriticalOrHighIssues=0`.

The adapter explicitly preserves unavailable source state for participant roster, session analytics, governed search events, governed property-view events, repeat usage, incident register, workflow analytics, feature-use taxonomy, activation, and retention. It does not infer these values from production users, email tracking, search rows, sessions, or customer data.

The adapter does not own `KPI-PLAT-001`, `KPI-PLAT-002`, `KPI-SRCH-001`, or governance KPIs. Those remain owned by their existing adapters.

## Safety Boundaries

Sprint 5 introduces:

- No Prisma schema changes.
- No migrations.
- No package dependencies.
- No public route.
- No customer data collection.
- No customer names, email addresses, phone numbers, user-entered searches, saved-search data, property-view payloads, user identifiers, session identifiers, IP addresses, cookies, or free-text feedback persistence.
- No live network calls.
- No MLS Grid request.
- No OpenAI call.
- No TitlePro247 call.
- No Typesense reset, reindex, or mutation.
- No queue, worker, scheduler, or email activation.
- No CRM mutation.

Persistence, when explicitly invoked with `execute=true` by an authorized admin, is limited to Enterprise Intelligence Adapter provenance, evidence, KPI observations, and KPI evaluations through the existing Enterprise Adapter Framework. Dry run remains non-persistent.

## Validation Command

```bash
npm run check:internal-preview-adapter-safety
```

## Certification Status

Sprint 5 is `IMPLEMENTED_NOT_CERTIFIED`.

Certification requires separate owner-run controlled activation evidence and executive reconciliation. `GAP-006` remains `OPEN_MATERIAL_REDUCED`.
