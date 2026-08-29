# PROJECT ATLAS - Output Persistence Foundation V1 Certification

## Executive Result

`OUTPUT_PERSISTENCE_FOUNDATION_V1` establishes the first durable, owner-scoped persistence foundation for reviewed Seller output products and versions.

Certification classification:

`OUTPUT_PERSISTENCE_FOUNDATION_V1_CERTIFIED_WITH_MIGRATION_AUTHORIZATION_REQUIRED`

The application implementation, additive Prisma schema, checked-in migration, deterministic fixtures, Agent route, and Seller workspace activation are certified. No database migration was applied to any environment during this package. Production use remains blocked until the authorized migration process is separately executed and verified.

## Starting Gate

| Gate | Result |
|---|---|
| Branch | `main` |
| Required baseline | `0a9913e28b548edf8d372c0b657cfcc0ac3708b2` |
| Verified HEAD | `0a9913e28b548edf8d372c0b657cfcc0ac3708b2` |
| Verified origin/main | `0a9913e28b548edf8d372c0b657cfcc0ac3708b2` |
| Divergence | `0 ahead / 0 behind` |
| Worktree before implementation | clean |
| `git diff --check` before implementation | PASS |

## V1 Policy And Scope

Persistence policy: `PERSIST_REVIEWED_ONLY_V1`.

The only V1 write candidates are the server-derived, deterministic fixtures:

| Source version | Product | Persisted lifecycle state |
|---|---|---|
| `seller-decision-brief-v2-reviewed` | Seller Decision Brief | `AGENT_REVIEWED` |
| `seller-update-current-version` | Seller Update | `AGENT_REVIEWED` |

The POST request requires an explicit `AGENT_REVIEWED` confirmation. The browser never sends a generic content payload. The server derives the reviewed output, content fingerprint, evidence references, dependencies, decision references, and lineage from the existing canonical output-version foundation.

No automatic backfill occurs. No draft, composed, unreviewed, or generic client-submitted output can be persisted by this V1 route.

## Durable Model

| Entity | V1 responsibility |
|---|---|
| `OutputProduct` | Stable owner-scoped product lineage root keyed by product, audience, and subject reference. |
| `OutputVersion` | Immutable reviewed version with ordinal, idempotency key, content fingerprint, effective-as-of, versioned payload, and lineage. |
| `OutputEvidenceSnapshot` | One immutable evidence snapshot attached to an output version. |
| `OutputDependency` | Durable upstream dependency, materiality, version, and invalidation/review posture. |
| `OutputReview` | Agent approval record for the persisted reviewed version. |
| `OutputDecision` | Version-linked selected decision references. |
| `OutputCheckpoint` | Append-only reviewed-output persistence checkpoint. |

The models use additive Prisma enums, CUID identifiers, restrictive foreign keys, unique product/version ordinals, unique source-version-per-product protection, and an idempotency key. The checked-in migration also installs append-only database triggers for `OutputVersion` and each immutable child record, preventing update or delete after the migration is applied.

## Ownership, Authorization, And Concurrency

The owner identity is the signed `AgentSessionPayload.subject`. `POST /api/agent/outputs` is an explicit `HUMAN_AGENT` `MUTATING_ADMIN_API` surface and requires the signed `HUMAN_AGENT_SESSION`, the `AGENT` role, mutation permission, and same-origin protection. `GET /api/agent/outputs` returns only the requesting subject's history.

The persistence service uses a Prisma transaction. It creates or reuses the stable output product, resolves the idempotency key, assigns the next version ordinal, writes the immutable child records, and handles unique-key races by loading the already-created idempotent version. It contains no update or delete operation for `OutputVersion`.

The exported `loadOwnedOutputForPdf` adapter resolves an owned, immutable reviewed output by ID and fingerprint only. It does not change the existing PDF renderer, persist `OutputRender`, write a PDF file, store a PDF file, or deliver a PDF.

## Data Minimization And Evidence

The version payload is a versioned reference manifest containing only source version, content/composition/presentation versions, and canonical preparation, intelligence, analysis, narrative, recommendation, pricing, post-launch, and decision reference IDs.

Evidence snapshots retain source-snapshot, metric, analysis, agent-input, assumption, limitation, rights, and freshness reference IDs plus fingerprint and review state. V1 does not retain raw MLS payloads, raw provider payloads, financial calculation values, financial advice, customer delivery data, or rendered document/PDF bytes.

## Seller Workspace Activation

`/agent/prepare/seller/presentation` now has an Agent-only Output Persistence V1 panel. It restores the signed-in Agent's persisted reviewed history on load and provides explicit actions to persist either approved V1 source fixture. A repeated action returns the idempotent stored version rather than creating a duplicate.

The existing PDF panel remains Agent-internal and ephemeral. It is deliberately separate from persistence and continues to state that no durable `OutputRender`, storage, or delivery occurs.

## Migration And Runtime Boundary

Checked-in migration:

`prisma/migrations/20260829190000_add_output_persistence_foundation/migration.sql`

This package validates the schema and generated client locally but does not run `prisma migrate deploy`, `prisma db push`, Supabase SQL, or any production database mutation. The endpoint will correctly fail closed as unavailable until the migration is applied through an explicitly authorized environment process.

## Validation

| Check | Result |
|---|---|
| `npx prisma validate` | PASS |
| `npx prisma generate` | PASS |
| `npm run check:output-persistence-foundation` | PASS |
| `npm run check:seller-decision-brief-composition-preview` | PASS |
| `npm run check:output-version-lineage-invalidation-foundation` | PASS |
| `npm run typecheck` | PASS |

The deterministic persistence checker covers schema/migration presence, fixture serialization, malformed request refusal, review-confirmation refusal, idempotent replay, version ordinal behavior, owner isolation, durable output-to-PDF adapter ownership, no output-version mutation/delete, auth-surface registration, same-origin protection, and the absence of PDF/render/MLS/email behavior.

## Protected Boundaries Confirmed

- No production or local database migration was applied.
- No automatic backfill or historical import occurred.
- No provider, MLS Grid, IRES, Supabase, Typesense, CRM, email, customer, or financial-system mutation occurred.
- No `OutputRender` persistence, PDF file storage, public PDF, portal, share/delivery, or public API was added.
- No deployment was performed.

## Next Authorization Gate

`READY_FOR_OUTPUT_PERSISTENCE_MIGRATION_AND_CONTROLLED_RUNTIME_VERIFICATION`

The next package must explicitly authorize a target database/environment, migration execution, migration inspection, and a controlled signed-Agent runtime proof. It must not expand V1 into draft persistence, raw payload retention, generic output authoring, PDF storage, delivery, provider activity, or automatic backfill without separate authorization.

## Controlled Target Runtime Addendum (2026-08-29)

`CANONICAL_PHYSICAL_PROPERTY_IDENTITY_MIGRATION_RECONCILIATION_V1` subsequently cleared the ordered predecessor migration and applied this output-persistence migration to the configured controlled production Supabase target. Both migration records are complete and Prisma reports the target schema up to date. The target contains all seven output tables, eight output enums, restrictive foreign keys, required indexes, and the six append-only triggers.

An authenticated Agent used the normal Seller Presentation workspace to persist only the two deterministic non-client V1 fixtures: `seller-decision-brief-v2-reviewed` and `seller-update-current-version`. The target now contains one owner-scoped `OutputProduct`, two immutable `AGENT_REVIEWED` `OutputVersion` rows, two evidence snapshots, seven dependency rows spanning seven dependency types, two approved reviews, two selected decisions, and two completed checkpoints. A replay of the Seller Brief created no third version. A fresh authenticated browser context restored the same two records.

The evidence snapshots preserve the source fixture's `AGENT_REVIEW_REQUIRED` evidence posture, while the durable output-version review records are independently `AGENT_REVIEWED` and approved. This is expected V1 provenance preservation, not a failed write.

The direct production database append-only proof attempted one `OutputVersion` update against a deterministic fixture. The database trigger rejected it with the expected append-only exception and post-check row counts remained unchanged. An unauthenticated production `POST /api/agent/outputs` request was rejected before a write. The existing deterministic checker separately exercises owner isolation and owned-PDF adapter refusal for a different Agent subject.

The authenticated existing PDF renderer also completed successfully for the Seller Update fixture: `PDF_CERTIFIED`, structural QA passed, six pages, and an ephemeral file hash was returned. The current PDF route renders from the static `seller-update-current-version` fixture and does not yet load the persisted `OutputVersion` through `loadOwnedOutputForPdf`. Accordingly, durable database truth is certified, but `DURABLE_OUTPUT_TO_PDF` remains `NOT_IMPLEMENTED_IN_CURRENT_PDF_ROUTE`. No `OutputRender` table, durable file storage, delivery, portal access, provider activity, customer data, financial persistence, or historical backfill was created.

Current runtime classification:

`OUTPUT_PERSISTENCE_FOUNDATION_V1_CERTIFIED_WITH_LIMITATIONS`

The next bounded admission gate is `READY_FOR_DURABLE_OUTPUT_TO_PDF_ADAPTER_AND_OUTPUT_RENDER_PERSISTENCE_DESIGN_REVIEW`. It must explicitly decide whether the existing renderer should load an owned immutable `OutputVersion` and, separately, whether a future `OutputRender` record, private file storage, or delivery capability is justified.
