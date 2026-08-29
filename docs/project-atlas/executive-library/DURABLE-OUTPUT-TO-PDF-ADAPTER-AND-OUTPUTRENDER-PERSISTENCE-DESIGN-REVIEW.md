# Durable Output To PDF Adapter And OutputRender Persistence Design Review

## Executive Result

`DURABLE_OUTPUT_TO_PDF_ADAPTER_AND_OUTPUT_RENDER_PERSISTENCE_DESIGN_REVIEW` found that the missing durable-output PDF adapter cannot be truthfully implemented against `OUTPUT_PERSISTENCE_PAYLOAD_V1` without changing Core Output Persistence semantics.

The two authenticated deterministic production certification versions are durable, owner-scoped, reviewed, immutable, and retrievable. Their V1 payload is intentionally a reference manifest, however, not a reviewed semantic-content or document-model snapshot. The current PDF route instead resolves a static code fixture from a caller-selected product kind. An adapter written now would either omit material PDF content or retain the prohibited static-fixture dependency.

No adapter, schema migration, `OutputRender` table, private file asset, storage, delivery, Client Portal, Secure Document, financial persistence, backfill, provider action, or database mutation was performed by this review.

## Repository Truth

| Concern | Current path | Finding |
|---|---|---|
| Authenticated PDF route | `app/api/agent/output/pdf/route.ts` | Accepts `productKind`, not an owner-scoped persisted output-version ID. |
| Static PDF request | `lib/atlasPdfRenderer.ts` | `buildAtlasPdfRenderRequest()` calls `resolveAtlasPdfFixture()` and binds static fixture identity. |
| Static document model | `lib/sellerPrintPdfRenderFoundation.ts` | Pages, blocks, titles, section mapping, and source content references are code fixtures. |
| HTML renderer | `lib/atlasPdfRenderer.ts` | `renderAtlasPdfHtml()` resolves the static document model again. |
| Durable output service | `lib/outputPersistenceFoundation.ts` | `loadOwnedOutputForPdf()` enforces owner scope and reviewed lifecycle but returns only V1 manifest data. |
| Seller history UI | `components/agent/SellerDecisionBriefCompositionPreview.tsx` | Restores durable history but PDF action still submits only static `productKind`. |

## Persisted Contract Gap

The two production certification versions share one owner-scoped product and have `AGENT_REVIEWED` output lifecycle and independent approved `OutputReview` rows. Each contains:

- `OUTPUT_PERSISTENCE_PAYLOAD_V1` metadata: source version, content/composition/presentation versions, and reference groups.
- A JSON lineage object with eight historical lineage keys.
- An evidence snapshot with reference arrays, fingerprint, and the source evidence review posture.
- Dependencies, selected decisions, and completed checkpoints.

They do **not** persist the reviewed title, subject display data, effective-as-of display content, semantic module/section content, document pages/blocks, PDF profile, document template, page-template set, or document-model fingerprint. `OutputProduct.productKind` is `SELLER_PRESENTATION` for both the Brief and Seller Update, so it alone cannot select a safely typed document profile.

| Concern | Persisted OutputVersion V1 | Current PDF document model | Result |
|---|---|---|---|
| Exact version/owner | Durable ID and owner-scoped loader | Static fixture ID | Adapter seam exists |
| Reviewed lifecycle | Durable `AGENT_REVIEWED` plus review record | Assumed fixture reviewed | Adapter seam exists |
| Content fingerprint | Durable value | Static fixture value | Can compare, cannot recompute V1 content |
| Semantic content | Reference manifest only | Static pages, blocks, headings, narrative structure | Material gap |
| Title/subject/as-of | Not persisted as renderable content | Static document model | Material gap |
| Evidence/dependencies | Durable references | Static presentation references | Identity available; display mapping not durable |
| Decision/checkpoint | Durable rows | Static product presentation | Exact display binding not implemented |
| PDF profile/template | Not persisted | Static fixture | Material gap |

## Adapter Admission Decision

The correct future request path is:

`authenticated Agent -> owner-scoped exact OutputVersion -> reviewed/current-use eligibility -> typed content-schema validation -> persisted semantic/document snapshot -> product adapter -> existing Atlas PDF renderer -> structural QA -> ephemeral PDF`.

An opaque UUID remains insufficient authorization. The server must resolve the Agent subject before loading the version and must fail closed without revealing another Agent's version existence. Supported-product and schema checks must be typed; no generic JSON-to-PDF mapper is admissible.

The necessary remediation is a separately authorized Core Output Persistence revision that persists an immutable, validated reviewed-content snapshot or versioned document-model snapshot for each supported profile. It must also preserve exact content/evidence fingerprint validation and profile selection. This review does not authorize that schema/payload change or historical backfill.

## Product Adapter Registry Position

| Output profile | Current source | Adapter state | PDF state |
|---|---|---|---|
| Seller Brief V1 | `seller-decision-brief-v2-reviewed` | Remediation required: no persisted semantic snapshot | Not admissible from durable record |
| Seller Update V1 | `seller-update-current-version` | Remediation required: no persisted semantic snapshot | Not admissible from durable record |
| Buyer/Investment/Market/Location | No V1 durable PDF contract | Unsupported | Fail closed |

Static renderer fixtures remain valid for renderer unit and structural-QA testing. They must not remain the production authenticated durable-output source after the future adapter is admitted.

## Eligibility And Fingerprint Position

| Gate | Current evidence | Position |
|---|---|---|
| Owner scope | `loadOwnedOutputForPdf()` filters owner and reviewed lifecycle | Available |
| Output review | Durable reviewed lifecycle and approval records | Available |
| Content schema | Manifest schema version is durable | Insufficient for semantic rendering |
| Content fingerprint | Stored fingerprint | No V1 recomputation from semantic payload possible |
| Evidence fingerprint | Stored on evidence snapshot | No V1 document-display verification contract |
| Rights/freshness | Reference posture preserved | Current-use rendering policy not yet admitted |
| Document model fingerprint | Not persisted | Missing |
| Render fingerprint | Static fixture-derived | Must be derived from persisted snapshot and versioned adapter/template/runtime inputs |
| File hash | Existing renderer produces ephemeral hash | Available only after a future admissible render |

## OutputRender Design

`OutputRender` remains a valuable future metadata layer, but implementation is held. Its purpose is to record a certified presentation event for one immutable `OutputVersion`; it does not own semantic content, source truth, client grants, delivery recipients, or durable PDF bytes.

Recommended future V1 relation and policy:

| Concern | Recommendation |
|---|---|
| Relation | `OutputVersion 1:N OutputRender` with restrictive foreign key |
| Identity | UUID plus `outputVersionId`, deterministic render fingerprint, adapter/document/template/renderer versions |
| Immutability | Certified rows append-only; rerender creates a new row |
| Idempotency | Unique `(outputVersionId, renderFingerprint)` for one certified configuration; new runtime/template identity yields a new fingerprint |
| QA | Store structural QA profile/result, page count, generated/certified timestamp, and safe runtime provenance |
| File state | Explicit `EPHEMERAL`, later `DURABLE_PRIVATE`, `PURGED`, or `UNAVAILABLE` |
| File metadata | Hash, size, MIME type, filename, and page count describe a produced file but do not imply durable bytes |
| Private file seam | Future optional `privateFileAssetId`; keep storage/provider fields outside `OutputRender` |
| Failed renders | Do not create certified render history from a failed attempt |

`OutputRender` persistence does not require Client Portal, delivery, secure links, or private file bytes, but it depends on an admitted durable-output adapter. The Secondary shared-file direction remains `SHARED_PRIVATE_FILE_ASSET_RECOMMENDED`; no shared storage schema is created here.

## Validation And Boundaries

Repository inspection confirmed the static-fixture dependency and the V1 persisted payload shape. Aggregate-only production reads confirmed the two deterministic versions are present and contain only the V1 manifest fields described above. No target schema change or write was needed for this design conclusion.

The prior runtime certification remains valid: authenticated persistence, owner scoping, history restore, idempotency, append-only enforcement, and ephemeral static-fixture PDF rendering are unaffected. This review does not certify a durable-output-to-PDF path because one does not yet exist.

## Next Gate

`READY_FOR_OUTPUT_PERSISTENCE_SEMANTIC_CONTENT_SNAPSHOT_AND_DURABLE_PDF_ADAPTER_ADMISSION`

That package must first define the immutable persisted semantic/document contract for the admitted Seller profile, its migration/backfill posture, current-use rights/freshness policy, schema validation, fingerprint derivation, and exact owner-scoped route. Only after that contract is implemented and certified can `OUTPUT_RENDER_PERSISTENCE_V1` safely persist render metadata.
