# Headless PDF Renderer Feasibility V1 Certification

## Executive Result

`HEADLESS_PDF_RENDERER_FEASIBILITY_V1_PASS_WITH_LIMITATIONS`

PROJECT ATLAS now has a repository-admitted technical feasibility proof for generating local PDF bytes from the certified Seller Print / PDF Render Foundation using a headless browser renderer.

Selected renderer:

`PLAYWRIGHT_CHROMIUM`

Prior PDF activation position:

`PRINT_PREVIEW_RENDER_DOMAIN_CERTIFIED_PDF_SPIKE_NEXT`

PDF activation position:

`ATLAS_PDF_RENDERER_V1_BOUNDED_AGENT_INTERNAL_ACTIVATION_RECOMMENDED_WITH_LIMITATIONS`

Local PDF status:

`LOCAL_PDF_GENERATED_QA_PASSED_HASH_VARIANCE_FROM_METADATA`

Deployment position:

`SUPPORTED_WITH_ADAPTER`

Next gate:

`ATLAS_PDF_RENDERER_V1`

Next primary package:

`ATLAS_PDF_RENDERER_V1`

## Starting Repository State

Expected certified baseline:

`25b20d8b2594aafa176cbf84cbf67e6427fb5d1d`

Starting gate verified:

| Field | Result |
| --- | --- |
| Branch | main |
| HEAD | 25b20d8b2594aafa176cbf84cbf67e6427fb5d1d |
| origin/main | 25b20d8b2594aafa176cbf84cbf67e6427fb5d1d |
| Divergence | 0 / 0 |
| Worktree | Clean |
| git diff --check | PASS |

## Implemented Artifacts

| Artifact | Path | Role |
| --- | --- | --- |
| Feasibility contract | `lib/headlessPdfRendererFeasibility.ts` | Inert renderer feasibility, proof, QA, limitation, deployment-adapter, and next-gate fixture |
| Proof harness | `scripts/runHeadlessPdfRendererFeasibilityProof.ts` | Local PDF generation and inspection harness using the admitted Seller Update print model |
| Checker | `scripts/checkHeadlessPdfRendererFeasibility.ts` | Deterministic validation of the feasibility contract, proof harness, report, package scripts, and protected boundaries |
| Package scripts | `package.json` | `npm run check:headless-pdf-renderer-feasibility` and `npm run run:headless-pdf-renderer-feasibility-proof` |

## Renderer Inventory

| Renderer | Decision | Availability | Repository State | Reason |
| --- | --- | --- | --- | --- |
| PLAYWRIGHT_CHROMIUM | SELECTED | AVAILABLE_FROM_BUNDLED_RUNTIME | NOT_PINNED | Generated an inspectable local Letter PDF from the admitted Seller Update print model using Chromium `page.pdf` |
| PUPPETEER_CHROMIUM | REJECTED | NOT_AVAILABLE_IN_REPOSITORY | NOT_PRESENT | No Puppeteer dependency or bundled Puppeteer runtime was found during the feasibility inventory |
| BROWSER_PRINT_ONLY | FALLBACK_ONLY | BUILT_IN_BROWSER_ACTION | NOT_REQUIRED | Existing browser print preview remains viable if server-side/headless PDF activation is deferred |

## Local Runtime Proof

| Field | Result |
| --- | --- |
| Renderer | PLAYWRIGHT_CHROMIUM |
| Playwright | 1.62.1 |
| Chromium | 151.0.7922.34 |
| Node | v24.14.0 |
| Platform | darwin-x64 |
| Chromium executable | `/Users/davidquinn/Library/Caches/ms-playwright/chromium-1234/chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing` |
| Sandbox launch | REQUIRES_DESKTOP_PERMISSION_ESCALATION_IN_CURRENT_CODEX_SANDBOX |

The repository does not yet pin Playwright or a Chromium binary. The proof used the bundled Codex runtime package path, so activation requires an explicit adapter/package/binary decision.

## Generated Local PDF

| Field | Result |
| --- | --- |
| Status | LOCAL_PDF_GENERATED |
| Path | `/private/tmp/atlas-headless-pdf-feasibility/Seller-Decision-Brief-subject-seller-decision-brief-subject-property-SELLER_UPDATE-2026-08-27-SELLER_UPDATE_PRINT_RENDER_V1.pdf` |
| Evidence path | `/private/tmp/atlas-headless-pdf-feasibility/Seller-Decision-Brief-subject-seller-decision-brief-subject-property-SELLER_UPDATE-2026-08-27-SELLER_UPDATE_PRINT_RENDER_V1.evidence.json` |
| MIME | application/pdf |
| File size | 172902 bytes |
| PDF version | 1.4 |
| Page size | 612 x 792 pts (letter) |
| Page count | 3 |
| Title | Seller Update Print Preview |
| Tagged | yes |

Source chain:

| Field | Result |
| --- | --- |
| Document model | seller-update-print-document-v1 |
| Source output version | seller-update-current-version |
| Render version | SELLER_UPDATE_PRINT_RENDER_V1 |
| Source content fingerprint | output-content-fingerprint-31dfccd3 |
| Render fingerprint | output-render-fingerprint-e11c57dd |

## Determinism Finding

Repeated local renders preserved:

| Stable Attribute | Result |
| --- | --- |
| Render fingerprint | output-render-fingerprint-e11c57dd |
| Page count | 3 |
| Page size | 612 x 792 pts (letter) |
| File size | 172902 bytes |
| Tagged status | yes |

Observed file hashes:

| Render | SHA-256 |
| --- | --- |
| First proof | 38c479331b614a11ce01f0e77f85178fab51ce0fc014bb7f26f30391b6156a7c |
| Second proof | d905eec7b6a2784d4b8dcafda441b1295bbbd441a868f254194e4e102ca3d2fb |
| Final proof rerun | 098b616e64eeb05fffa9dbdcddbacc883e808fc81dc7460fe325f9baf02c0d1b |

Conclusion:

`CHROMIUM_PDF_EMBEDDED_GENERATION_METADATA`

The renderer is feasible for local PDF generation and deterministic render identity, but not for byte-stable file hashing without a future metadata normalization or post-processing decision.

## Text Marker QA

The generated PDF text extraction found every required marker:

| Marker | Result |
| --- | --- |
| Seller Update Print Preview | PASS |
| Seller Decision Brief subject seller-decision-brief-subject-property | PASS |
| seller-update-current-version | PASS |
| SELLER_UPDATE_PRINT_RENDER_V1 | PASS |
| output-content-fingerprint-31dfccd3 | PASS |
| output-render-fingerprint-e11c57dd | PASS |
| Static Map Fallback | PASS |
| Static Chart Fallback | PASS |
| Evidence and Provenance | PASS |

## Visual QA

Rendered page images were inspected locally:

| Page | Result |
| --- | --- |
| Page 1 | Clean cover, title, subject, as-of, display version, and fingerprint cards; no overlap |
| Page 2 | Clean document page map, static map/chart fallback panels, and resolved block layout |
| Page 3 | Clean recommendation, decision, evidence, provenance, and footer layout |

## Capability Matrix

| Capability | Status | Next-Gate Requirement |
| --- | --- | --- |
| Local PDF byte generation | READY_LOCALLY | Pin/package renderer adapter and binary policy |
| US Letter page sizing and page breaks | READY_LOCALLY | Promote CSS/page template constraints into ATLAS_PDF_RENDERER_V1 adapter tests |
| Text extraction and provenance markers | READY_LOCALLY | Require marker assertions for activated output products |
| Static map rendering | SUPPORTED_WITH_TEXT_FALLBACK | Decide whether raster map assets are required |
| Static chart rendering | SUPPORTED_WITH_TEXT_FALLBACK | Add chart rasterization only after source/data/version and accessibility rules are admitted |
| Fonts | PASS_WITH_LIMITATIONS | Admit brand font embedding or system-font policy before customer-facing delivery |
| PDF metadata | PARTIAL_REQUIRES_NEXT_GATE | Define metadata adapter or post-processing step |
| PDF bookmarks | PARTIAL_REQUIRES_NEXT_GATE | Add bookmark inspection and section-outline assertions |
| Tagged PDF and accessibility | PARTIAL_REQUIRES_NEXT_GATE | Add tag tree, reading order, alt text, and contrast validation |
| PDF/A | DEFERRED | Only add if durable archive/compliance requirements authorize it |

## Failure Taxonomy

| Failure | Classification | Disposition |
| --- | --- | --- |
| Playwright package missing | RENDERER_UNAVAILABLE | FAIL_FAST |
| Chromium executable missing | BROWSER_BINARY_UNAVAILABLE | FAIL_FAST |
| Chromium launch denied by desktop sandbox | SANDBOX_PERMISSION | FALLBACK_BROWSER_PRINT |
| PDF render timeout | TIMEOUT | RETRY_THEN_FAIL |
| Document model or render version not admitted | INVALID_INPUT | FAIL_FAST |
| Required extracted marker missing | TEXT_MARKER_MISSING | FAIL_FAST |
| pdfinfo and text extraction unavailable | PDF_INSPECTION_UNAVAILABLE | DEFER_TO_NEXT_GATE |
| Storage, delivery, or share target requested | STORAGE_OR_DELIVERY | DEFER_TO_NEXT_GATE |

Retry position:

`ONE_RETRY_FOR_BROWSER_LAUNCH_OR_TIMEOUT_ONLY`

## Deployment Position

`SUPPORTED_WITH_ADAPTER`

Activation requires:

| Requirement |
| --- |
| Choose repository-pinned Playwright/Chromium dependency strategy before production activation |
| Provide a server-side adapter that runs only inside an authorized Agent-internal PDF endpoint or worker |
| Keep persistence, storage, sharing, and customer delivery behind separate authorization gates |
| Add deterministic PDF QA that validates page count, Letter size, expected text, metadata, and accessibility scope |
| Document the browser binary/runtime policy for Vercel or any alternate execution environment |

## Protected-System Confirmation

No production route, API route, database mutation, schema migration, persistence implementation, file storage, provider runtime call, customer mutation, CRM mutation, email/message execution, delivery/share operation, deployment, cadence change, webhook, polling change, source activation, or public UI behavior was introduced by this package.

## PDF Skill Marker Gap

The PDF artifact operation marker helper requested by the local PDF skill was not present at:

`container_tools/mark_artifact_operation_started.mjs`

The missing marker helper was recorded as a local tooling gap. The generated PDF remained a local spike artifact outside committed production/client artifact paths.

## Final Position

`HEADLESS_PDF_RENDERER_FEASIBILITY_V1_PASS_WITH_LIMITATIONS`

`PLAYWRIGHT_CHROMIUM` is the selected renderer for the next authorized PDF activation gate.

`ATLAS_PDF_RENDERER_V1` is the next repository-aligned gate and next primary package.
