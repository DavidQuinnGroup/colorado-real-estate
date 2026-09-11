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
`cmtlsgepy00003yqsh1n54ltc`. Human review is intentionally not pre-consumed by
implementation or deployment automation.
