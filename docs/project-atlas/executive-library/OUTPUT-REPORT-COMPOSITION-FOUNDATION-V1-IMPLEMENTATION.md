# Output Report Composition Foundation V1

## Scope

`OUTPUT_REPORT_COMPOSITION_FOUNDATION_V1` completes the private Agent-facing
composition and orientation layer on the existing canonical durable roots:

- `OutputProduct` remains the sole logical output root.
- `OutputVersion` remains the immutable semantic/version root.
- `OutputEvidenceSnapshot`, `OutputDependency`, `OutputReview`,
  `OutputDecision`, and `OutputCheckpoint` remain the existing provenance and
  review lineage primitives.
- `AtlasOutputRender` remains the sole derivative render/PDF seam.

This work adds neither an output root nor a render root. It does not add
delivery, sharing, public publication, Client Portal activation, document
storage, CRM activity, source activation, transaction workflow, or real-client
content.

## Composition Contract

The typed semantic contract is in
`lib/outputReportCompositionFoundation.ts`.

| Contract | Value |
| --- | --- |
| Composition schema | `ATLAS_OUTPUT_REPORT_COMPOSITION_V1` |
| Foundation version | `OUTPUT_REPORT_COMPOSITION_FOUNDATION_V1` |
| Section model | ordered `{ id, title, blocks }` |
| Block model | `TEXT`, `NOTICE`, or `LIST` |
| Validation | required title, summary, non-empty sections/blocks, supported schema and block kinds, bounded text |
| Storage | immutable `OutputVersion.contentPayload` with `payloadSchemaVersion` |
| Identity | SHA-256 fingerprint of stable semantic composition |

The contract is deliberately independent of React props. The UI parses an
already-persisted composition as a read-only semantic preview.

## Context Seams

Migration `20260911000000_add_output_report_composition_foundation` adds only
nullable `OutputProduct.clientCaseId` and `OutputProduct.transactionId` foreign
keys and owner/context indexes. It does not backfill historical outputs.

The service validates the selected Client Case and any future transaction seam
against the authenticated owner. A Client Case query is explicit in
`/agent/outputs?clientCaseId=<id>`; no cookie, local storage, or workspace-wide
active Output/Case state is used.

## Agent Experience

- `/agent/outputs` is the global owner-scoped Outputs list.
- `/agent/outputs?clientCaseId=<id>` is an explicit, owner-validated Client
  Case context.
- `/agent/outputs?productId=<id>` presents the OutputProduct detail,
  latest/current semantic version, independently identified reviewed version,
  immutable version history, read-only semantic preview, review/provenance
  orientation, and actual artifact state.
- Client Case navigation and the shared contextual strip now include Outputs.
- Workspace Home to Outputs is global and carries no prior Case context.

The Output API read paths use private `no-store` responses and are non-mutating.
Product and version lookups are owner-scoped. Foreign product, version, or Case
IDs fail closed without returning private metadata.

## Review and Rendering

The synthetic certification flow creates one `AGENT_REVIEW_REQUIRED` semantic
version only when an authenticated Agent explicitly selects **Prepare synthetic
output** in the retained synthetic Client Case. Selecting **Review exact
version** creates a new immutable `AGENT_REVIEWED` successor and an
`OutputReview`; it does not alter the earlier semantic version.

Review creates no delivery, email, sharing grant, Client Authorization,
source-domain calculation, render, PDF, or artifact. The exact UI states this
boundary.

`AtlasOutputRender` remains the derivative render seam. This V1 synthetic
composition has no registered product adapter in the existing PDF renderer, so
the truthful artifact state is `NO_ARTIFACT`; no render/download action is
offered. A future adapter must render an exact reviewed `OutputVersion` and
must not create a semantic version merely to regenerate a derivative PDF.

## V1 Adapters

The V1 composition experience reads the existing immutable output families
without recalculating them:

- legacy reviewed seller decision/update fixtures;
- Seller Financial output semantic profile;
- Seller Presentation Financial Module adapter;
- Buyer Decision Brief adapter;
- the bounded inert Output Report Composition synthetic fixture.

Existing product adapters remain their source-of-truth owners. This foundation
only orients and reads their persisted `OutputVersion` representations.

## Validation

`npm run check:output-report-composition-foundation` verifies:

- valid composition acceptance;
- missing required content rejection;
- unsupported schema/type rejection;
- malformed payload rejection;
- canonical context seams, owner-scoped API routes, non-hidden context, detail,
  preview, review, and no-artifact UI surfaces.

The existing `check:output-persistence-foundation` remains the persistence,
immutable-model, and private API regression check. The synthetic flow is
idempotent and cannot create a second active semantic fixture for the same
owner/product/subject identity.

## Certification Boundary

No synthetic OutputProduct, OutputVersion, OutputReview, or artifact is
created merely by opening Outputs. The human certification fixture is retained
only after an authenticated Agent explicitly prepares it against Client Case
`cmtlsgepy00003yqsh1n54itc`. Human review is intentionally not pre-consumed by
implementation or deployment automation.

## Final Production Certification Closure

`OUTPUT_REPORT_COMPOSITION_FOUNDATION_V1` was human-certified in production on
2026-09-11 and is closed. This record preserves the completed certification
history; it does not broaden the foundation into render, PDF, sharing,
delivery, Client Portal, or external communication work.

### Deployment and Migration

- Implementation commit: `5e1ea5c73816916d60d0db45767e570ae880a641`.
- Production deployment: Ready for that implementation commit.
- Migration: `20260911000000_add_output_report_composition_foundation`.
- Migration state: applied and additive. It adds nullable Client Case and
  transaction context foreign keys and indexes only; it performs no backfill,
  destructive statement, or database reset.

### Owner-Scoped Fixture Reconciliation

The initially supplied Case identifier, `cmtlsgepy00003yqsh1n54ltc`, did not
resolve in the canonical target. It was not reassigned, rewritten, or treated
as foreign data. The owner-scoped certification fixture is instead:

- Client Case: `cmtlsgepy00003yqsh1n54itc`.
- Display: `ATLAS Synthetic Client Case - Foundation V1`.
- State: `ACTIVE`.
- Parties: one synthetic party; properties: zero; transactions: zero.
- Output relation: present.
- Owner match: the Case and OutputProduct have the same safe owner subject
  fingerprint, `715d78b3f99f`.

This Case remains retained as a governed synthetic fixture for future,
explicitly authorized certification. It contains no real Client, property,
market, financial, transaction, or professional-input data.

### Human Certification Chronology

The authenticated Agent verified the contextual Outputs route,
`/agent/outputs?clientCaseId=<validated-case-id>`, then located the same
OutputProduct in global `/agent/outputs`. Context was explicit, owner-validated,
and cleared on return to Workspace Home; no local storage, cookie, or
workspace-global active Case or Output state was established.

The Agent opened the Output detail and read-only semantic preview, verified
Version 1's review-required state and recorded provenance, and selected
**Review exact version** exactly once. Production then reported that an
immutable reviewed successor was created and that no render or delivery
occurred. The Agent verified Version 2 as current and reviewed, Version 1 as
historical, the review/provenance orientation, global discovery, and Agent
authentication continuity.

### Canonical Output Evidence

The retained OutputProduct is `cmtxf46ym000212k3cvr9w5uh`:

- Product kind/audience: `AGENT_INTERNAL_ANALYSIS` / `AGENT_INTERNAL`.
- Subject: `ATLAS_SYNTHETIC_OUTPUT_FOUNDATION_V1`.
- Transaction: none.
- Composition schema: `ATLAS_OUTPUT_REPORT_COMPOSITION_V1`.
- Composition storage: immutable `OutputVersion.contentPayload` with
  `payloadSchemaVersion` and a stable content fingerprint.
- Section/block model: ordered sections with `TEXT`, `NOTICE`, and `LIST`
  blocks, validated before persistence.

Its canonical immutable history is ordered newest first in the Agent UI:

| Version | ID | State | Immutable at (UTC) | Relationship |
| --- | --- | --- | --- | --- |
| 2 | `cmtxfhuii0002bj0mwsu5t1xi` | `AGENT_REVIEWED` | `2026-09-11T20:48:28.602Z` | reviewed successor of Version 1; current and reviewed |
| 1 | `cmtxf47dc000412k3wcwnhsfu` | `AGENT_REVIEW_REQUIRED` | `2026-09-11T20:37:52.081Z` | retained immutable predecessor |

The sole review is `cmtxfhuii0005bj0m5wg3q8rd`: `APPROVED` by safe reviewer
subject `715d78b3f99f` at `2026-09-11T20:48:28.600Z`, under
`OUTPUT_REPORT_COMPOSITION_FOUNDATION_V1`. Version 2 records
`reviewedFromVersion: cmtxf47dc000412k3wcwnhsfu`.

Fresh canonical comparison confirms Version 1 and Version 2 have identical
semantic `contentPayload` and identical content fingerprint
`b11b024b868ae7b859f30de8c51d8717d4cc1d806ced671e78e0e123f8e7d6bd`.
The only differences are architecture-owned version, review, lineage,
snapshot, checkpoint, and review-record metadata. No business composition
field changed during review.

### Review Semantics and Provenance

Review is a versioned successor transition, not an in-place status mutation:

- Version 1 remains `AGENT_REVIEW_REQUIRED` and immutable.
- Version 2 is distinct, immutable, current, and `AGENT_REVIEWED`.
- The review did not mutate Version 1 in place.
- Repeating the historical Version 1 review action is intentional and
  idempotent: it resolves to the existing exact reviewed successor rather than
  creating another version.
- Canonical fixture counts after review: two versions, one review, two evidence
  snapshots, two dependencies, zero decisions, and two checkpoints.

`OutputProduct` remains the durable logical root; `OutputVersion` is immutable
semantic truth; `OutputReview`, `OutputEvidenceSnapshot`, `OutputDependency`,
`OutputDecision`, and `OutputCheckpoint` remain canonical lineage primitives.
`AtlasOutputRender` remains a derivative render seam, not a competing durable
output root.

### Render, Delivery, and External-Action Boundary

There is no persisted `AtlasOutputRender` model or instance for this fixture;
the render seam is code-level and derivative. Fresh reconciliation found no
durable render, PDF, delivery, public share, email, SMS, Client Portal
delivery, client contact, professional contact, or external action. Review and
preview do not create any of those artifacts or actions.

This certification proves render/PDF and delivery separation only. It does not
certify real delivery, recipient access, public share links, Client Portal
delivery, render generation, storage-provider selection, or malware scanning.
No secure-document storage provider, MetaDefender, iCloud, or malware-scanning
provider was selected or required for this semantic foundation.

### Bounded Authorization Regression Repair

Final automated reconciliation exposed a pre-existing Agent authorization
classification gap: the generic `/agent/:path*` classifier accepted a valid
Agent session for an unregistered path. This did not mutate the certification
fixture or expose another owner's data, but it violated the required
fail-closed unknown-route contract.

The bounded repair makes unrecognized Agent paths fail closed while preserving
the two legitimate dynamic destinations: Client Case detail and Buyer Decision
Brief. The Agent cross-capability session checker now proves both allowed
dynamic paths and the denied unknown path. This is the only application-source
change made during final closure. It requires the normal production deployment
of the closure commit; no database, render, delivery, external-system, or
synthetic Output mutation is involved.

### Final State

- `OUTPUT_REPORT_COMPOSITION_FOUNDATION_V1`:
  `PRODUCTION_CERTIFIED_AND_CLOSED`.
- Human certification: `PASS`; human retest required: `NO`.
- Foundation blocker: `NONE`; Executive decisions required: `NONE`.
- The closure includes only the bounded Agent authorization fail-closed repair,
  regression coverage for it, and this implementation record. No Prisma
  schema, migration, production business-data, render, delivery, or
  external-system mutation was made by this closure.
- The retained synthetic Case, OutputProduct, both OutputVersions,
  OutputReview, evidence snapshots, dependencies, and checkpoints remain
  governed certification evidence for future explicitly authorized work.

The next Primary gate is
`MULTI_PROPERTY_FINANCIAL_SCENARIO_FOUNDATION_V1`,
`READY_FOR_EXECUTIVE_HQ_WORK_PACKAGE`. It must not auto-start. Secondary work
remains `ON_HOLD` until Primary foundations advance.
