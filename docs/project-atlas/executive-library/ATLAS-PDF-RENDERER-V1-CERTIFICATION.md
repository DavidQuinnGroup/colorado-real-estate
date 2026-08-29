# ATLAS PDF Renderer V1 Certification

## Executive Result

`ATLAS_PDF_RENDERER_V1_CERTIFIED_WITH_LIMITATIONS`

## Deployment Validation Closure

`ATLAS_PDF_RENDERER_DEPLOYMENT_VALIDATION_V1_CERTIFIED_WITH_LIMITATIONS`

Production deployment `dpl_3UVoWMooFX4VZibUB5bc5FMn2xnS` at runtime commit `53cf3706` produced certified ephemeral PDF bytes for both supported products through the authenticated Agent workspace: Seller Update (6 pages / 95,888 bytes) and Seller (8 pages / 127,715 bytes). Both returned `PDF_QA_PASSED` under `ATLAS_PDF_STRUCTURAL_QA_ENGINE_V1` using `pdfreader@3.0.8/pdf2json@3.1.4`.

The deployment gate is closed with limitations for advanced visual, tagged-PDF accessibility, bookmark-tree, and raster-asset QA. See `ATLAS-PDF-NODE-STRUCTURAL-QA-REMEDIATION-V1-CERTIFICATION.md` for the production evidence and failure/remediation record.

PROJECT ATLAS now has a first reusable Agent-internal PDF renderer for the certified Seller and Seller Update output family.

| Field | Result |
| --- | --- |
| Starting commit | `8f1620075a035345131c01d6beec7fcefa47dd2a` |
| Package | `ATLAS_PDF_RENDERER_V1` |
| Selected renderer | `PLAYWRIGHT_CHROMIUM` |
| Renderer adapter | `PLAYWRIGHT_CHROMIUM_ADAPTER_V1` |
| Local package | `playwright@1.62.1` |
| Chromium version | `151.0.7922.34` |
| Agent PDF status | `AGENT_INTERNAL_PDF_GENERATION_ACTIVE_EPHEMERAL` |
| Seller PDF status | `SELLER_PDF_GENERATION_CERTIFIED_AGENT_INTERNAL_EPHEMERAL` |
| Seller Update PDF status | `SELLER_UPDATE_PDF_GENERATION_CERTIFIED_AGENT_INTERNAL_EPHEMERAL` |
| Deployment position | `DEPLOYMENT_VALIDATED_AGENT_INTERNAL_WITH_LIMITATIONS` |
| Persistence position | `EPHEMERAL_RESULT_ONLY_OUTPUT_RENDER_PERSISTENCE_DEFERRED` |
| Next gate | `SEPARATE_AUTHORIZATION_REQUIRED_FOR_PERSISTENCE_DELIVERY_OR_ADVANCED_PDF_QA` |
| Next primary package | `NONE_AUTHORIZED_BY_THIS_CERTIFICATION` |

## Dependency Chain

| Dependency | State |
| --- | --- |
| Output Version / Lineage / Invalidation Foundation | Consumed as source of reviewed output versions and content fingerprints |
| Seller Print / PDF Render Foundation | Consumed for DocumentModel, OutputRender, page templates, static assets, render fingerprints, and print CSS assumptions |
| Headless PDF Renderer Feasibility | `HEADLESS_PDF_RENDERER_FEASIBILITY_V1_PASS_WITH_LIMITATIONS` |
| Certified activation position | `ATLAS_PDF_RENDERER_V1_BOUNDED_AGENT_INTERNAL_ACTIVATION_RECOMMENDED_WITH_LIMITATIONS` |

## PDF Renderer Table

| Renderer Artifact | Version | Runtime | Source Output | Render Type | State | Reuse |
| --- | --- | --- | --- | --- | --- | --- |
| ATLAS PDF RENDERER | `ATLAS_PDF_RENDERER_CONTRACT_V1` | Node server runtime | Seller/Seller Update OutputVersion | PDF | PDF_RENDERER_READY | Product-neutral |
| PLAYWRIGHT CHROMIUM ADAPTER | `PLAYWRIGHT_CHROMIUM_ADAPTER_V1` | `playwright@1.62.1` | DocumentModel HTML | PDF | PDF_RENDERER_READY | DIRECT_RENDERER_REUSE |
| SELLER PDF | `SELLER_DECISION_BRIEF_V2` | `PLAYWRIGHT_CHROMIUM_ADAPTER_V1` | `seller-decision-brief-v2-reviewed` | PDF | PDF_CERTIFIED | Seller product certified |
| SELLER UPDATE PDF | `SELLER_UPDATE_PRODUCT_VERSION` | `PLAYWRIGHT_CHROMIUM_ADAPTER_V1` | `seller-update-current-version` | PDF | PDF_CERTIFIED | Seller Update product certified |

## PDF State Table

| PDF State | Meaning | Entry Condition | Agent Action | Next State |
| --- | --- | --- | --- | --- |
| PDF_RENDERER_READY | Renderer contract and adapter are available | Agent route loads eligible output | Generate PDF | PDF_RENDER_REQUESTED |
| PDF_RENDER_REQUESTED | Agent requested PDF generation | POST `/api/agent/output/pdf` | Wait | PDF_RENDERING |
| PDF_RENDERING | Chromium is producing bytes | Version/rights/freshness gates passed | Wait | PDF_QA_REQUIRED |
| PDF_QA_REQUIRED | Bytes exist and structural QA runs | File hash computed | Inspect QA | PDF_READY or PDF_RENDER_FAILED |
| PDF_READY | PDF passed required structural checks | QA passed | Open/save | PDF_CERTIFIED |
| PDF_CERTIFIED | Ephemeral Agent PDF is ready | QA and provenance passed | View, save, regenerate | PDF_SUPERSEDED when replaced |
| PDF_RENDER_FAILED | No certified file returned | Typed failure | Review recovery | PDF_RENDER_REQUESTED after fix/retry |
| PDF_INVALIDATED | Source output invalidated | OutputVersion invalidation | Refresh output | PDF_RENDER_REQUESTED |
| PDF_SUPERSEDED | New render/output replaces prior PDF | Regeneration or output successor | View historical reference later | Future durable history |

## Generation Action Table

| Agent Action | Preconditions | PDF State | Result | Failure State |
| --- | --- | --- | --- | --- |
| GENERATE PDF | Reviewed output, version match, rights pass, freshness pass, renderer ready | PDF_RENDERER_READY | Certified ephemeral PDF | PDF_RENDER_FAILED |
| REGENERATE PDF | Same output with new render, expired result, or Agent intent | PDF_CERTIFIED | New PDF result and hash | PDF_RENDER_FAILED |
| VIEW PDF RESULT | PDF certified in current browser session | PDF_CERTIFIED | Open object URL | PDF_RENDER_FAILED if result missing |
| VIEW PDF QA | QA result returned | PDF_CERTIFIED | Agent sees QA state and file metadata | PDF_RENDER_FAILED |
| VIEW PDF PROVENANCE | Output/render metadata available | PDF_CERTIFIED | Agent sees output, content, render, evidence, pricing, decision, and hash | PDF_RENDER_FAILED |
| OPEN / SAVE PDF | Ephemeral blob available | PDF_CERTIFIED | Browser open/download | PDF_RENDER_FAILED if blob unavailable |

## PDF Result Table

| Field | Seller PDF | Seller Update PDF |
| --- | --- | --- |
| OUTPUT VERSION | `seller-decision-brief-v2-reviewed` | `seller-update-current-version` |
| CONTENT FINGERPRINT | OutputVersion content fingerprint | OutputVersion content fingerprint |
| DOCUMENT TEMPLATE | `SELLER_DECISION_BRIEF_PRINT_TEMPLATE_V1` | `SELLER_UPDATE_PRINT_TEMPLATE_V1` |
| PAGE TEMPLATE SET | `SELLER_PRINT_PAGE_TEMPLATE_SET_V1` | `SELLER_UPDATE_PRINT_PAGE_TEMPLATE_SET_V1` |
| RENDER VERSION | `SELLER_DECISION_BRIEF_PRINT_RENDER_V1` | `SELLER_UPDATE_PRINT_RENDER_V1` |
| RENDER FINGERPRINT | Source OutputRender fingerprint | Source OutputRender fingerprint |
| RENDERER VERSION | `PLAYWRIGHT_CHROMIUM_ADAPTER_V1` | `PLAYWRIGHT_CHROMIUM_ADAPTER_V1` |
| FILE NAME | Deterministic sanitized Seller filename | Deterministic sanitized Seller Update filename |
| PAGE COUNT | 8 | 6 |
| FILE SIZE | 220796 bytes | 187046 bytes |
| FILE HASH | `5b6a52dcb6954dd56b18bd0111ca213e397e6162d021a14e8ad4de64bd96b037` | `3ea5c0305f3320e0b289d439174e5ce92fd8f9adb7390a495accba799bd47426` |
| QA STATE | `PDF_QA_PASSED` | `PDF_QA_PASSED` |
| ACCESSIBILITY STATE | `PDF_ACCESSIBILITY_BASELINE_READY` | `PDF_ACCESSIBILITY_BASELINE_READY` |
| GENERATED AT | `2026-08-28T17:22:51.439Z` | `2026-08-28T17:22:52.473Z` |

## Version / Render / File Identity Table

| Identity | Meaning | Changes When | Persist Later |
| --- | --- | --- | --- |
| OUTPUT VERSION | Reviewed content unit | Material content/evidence/decision changes | Yes, OutputVersion |
| CONTENT FINGERPRINT | Exact content identity | Output content changes | Yes, OutputVersion |
| RENDER VERSION | Presentation/render identity | Layout/template/static asset renderer changes | Yes, OutputRender |
| RENDER FINGERPRINT | Exact render input identity | Render inputs change | Yes, OutputRender |
| PDF FILE HASH | Exact generated byte identity | PDF bytes change, including metadata variance | Yes, OutputRender/file storage |

## Eligibility Table

| Source State | Generate PDF | Result | Agent Action |
| --- | --- | --- | --- |
| ELIGIBLE REVIEWED OUTPUT | Allowed | PDF_RENDER_REQUESTED | Generate PDF |
| AGENT REVIEW REQUIRED | Blocked | SOURCE_OUTPUT_NOT_READY | Complete review |
| RIGHTS REVIEW REQUIRED | Blocked | RIGHTS_BLOCK | Complete rights review |
| FRESHNESS REVIEW REQUIRED | Blocked | FRESHNESS_BLOCK | Refresh evidence |
| VERSION MISMATCH | Blocked | VERSION_MISMATCH | Refresh output/render |
| OUTPUT INVALIDATED | Blocked | SOURCE_OUTPUT_NOT_READY | Recompose output |
| OUTPUT SUPERSEDED | Blocked for current promotion | SOURCE_OUTPUT_NOT_READY | Use successor output |

## Failure Matrix

| Failure | Fail Closed | Retry Class | Agent Message | Recovery |
| --- | --- | --- | --- | --- |
| SOURCE_OUTPUT_NOT_READY | Yes | INPUT_FIX_REQUIRED | Output is not eligible | Complete review or use successor |
| VERSION_MISMATCH | Yes | INPUT_FIX_REQUIRED | Version/render mismatch | Refresh output and regenerate |
| RIGHTS_BLOCK | Yes | REVIEW_REQUIRED | Rights review required | Clear rights gate |
| FRESHNESS_BLOCK | Yes | REVIEW_REQUIRED | Freshness review required | Refresh current context |
| TEMPLATE_INCOMPATIBLE | Yes | INPUT_FIX_REQUIRED | Template incompatible | Correct document/template selection |
| STATIC_ASSET_FAILURE | Yes | RUNTIME_FIX_REQUIRED | Static asset failed | Use certified fallback or fix asset |
| MAP_RENDER_FAILURE | Yes | RUNTIME_FIX_REQUIRED | Map fallback failed | Use text fallback or fix map asset |
| CHART_RENDER_FAILURE | Yes | RUNTIME_FIX_REQUIRED | Chart fallback failed | Use table fallback or fix chart asset |
| FONT_FAILURE | Yes | RUNTIME_FIX_REQUIRED | Font readiness failed | Use system fallback or embed font |
| PAGINATION_FAILURE | Yes | RUNTIME_FIX_REQUIRED | Pagination failed | Correct page template |
| ACCESSIBILITY_FAILURE | Yes | REVIEW_REQUIRED | Accessibility review required | Fix tag/reading order/contrast |
| RENDERER_LAUNCH_FAILURE | Yes | SAFE_RETRY | Chromium launch failed | Retry once or browser print fallback |
| RENDERER_TIMEOUT | Yes | SAFE_RETRY | Renderer timed out | Retry once or inspect runtime |
| FILE_WRITE_FAILURE | Yes | SAFE_RETRY | Temp byte creation failed | Retry or inspect filesystem |
| QA_FAILURE | Yes | REVIEW_REQUIRED | PDF QA failed | Inspect QA details |

## Retry Table

| Failure Class | Safe Retry | Input Fix | Review | Runtime Fix |
| --- | --- | --- | --- | --- |
| SAFE_RETRY | Yes | No | No | Maybe |
| INPUT_FIX_REQUIRED | No | Yes | Maybe | No |
| REVIEW_REQUIRED | No | Maybe | Yes | No |
| RUNTIME_FIX_REQUIRED | No | No | Maybe | Yes |

## PDF QA Table

| QA Domain | Pass Condition | Hold / Limitation | Failure Effect |
| --- | --- | --- | --- |
| CONTENT MATCH | Expected markers extracted without OCR | None | QA_FAILURE |
| VERSION MATCH | Request render fingerprint equals OutputRender fingerprint | None | VERSION_MISMATCH |
| RIGHTS | Rights pass before render | None | RIGHTS_BLOCK |
| FRESHNESS | Freshness pass before render | None | FRESHNESS_BLOCK |
| PAGES | Structural page count is valid | Visual regression remains future seam | QA_FAILURE |
| TABLES | Identity/provenance table markers extract | None | QA_FAILURE |
| MAP | Static Map Fallback present | Raster map deferred | MAP_RENDER_FAILURE or QA_FAILURE |
| CHART | Static Chart Fallback present | Raster chart deferred | CHART_RENDER_FAILURE or QA_FAILURE |
| IMAGE | Controlled fallback used | Real property image not fetched | Static fallback |
| FONT | System fallback renders | Brand font embedding deferred | FONT_FAILURE |
| METADATA | Title present | Custom metadata post-process deferred | QA limitation |
| BOOKMARKS | `outline:true` accepted | Bookmark tree inspection partial | QA limitation |
| ACCESSIBILITY | Tagged PDF baseline present | Advanced accessibility partial | QA limitation |
| PROVENANCE | Output/render/evidence/pricing/decision/hash visible | None | QA_FAILURE |
| FILE HASH | SHA-256 matches exact bytes | Byte-identical reproducibility limited by metadata | QA_FAILURE |

## Provenance Table

| Provenance | Agent UI | PDF Body | PDF Metadata | Future Persistence |
| --- | --- | --- | --- | --- |
| PRODUCT | Yes | Yes | Title | OutputProduct |
| SUBJECT | Yes | Yes | Subject seam | OutputVersion |
| DISPLAY VERSION | Yes | Yes | No | OutputVersion |
| OUTPUT VERSION | Yes | Yes | No | OutputRender |
| CONTENT FINGERPRINT | Yes | Yes | No | OutputVersion/OutputRender |
| EVIDENCE SNAPSHOT | Yes | Yes | No | OutputEvidenceSnapshot |
| PRICING VERSION | Yes | Yes | No | OutputVersion refs |
| POST-LAUNCH VERSION | Yes | Yes | No | OutputVersion refs |
| SELLER DECISION VERSION | Yes | Yes | No | OutputDecision |
| DOCUMENT TEMPLATE VERSION | Yes | Yes | No | OutputRender |
| PAGE TEMPLATE VERSIONS | Yes | Yes | No | OutputRender |
| RENDER VERSION | Yes | Yes | No | OutputRender |
| RENDERER VERSION | Yes | Yes | No | OutputRender |
| GENERATED AT | Yes | Response header | Chromium metadata | OutputRender |
| FILE HASH | Yes | Response header | No | OutputRender/file store |

## Security Table

| Security Area | Current Implementation | Production Rule | Validation |
| --- | --- | --- | --- |
| AUTHENTICATION | Exact Agent session on `/api/agent/output/pdf` | HUMAN_AGENT + AGENT only | Route, middleware, adminAuth checker |
| RENDER TARGET ACCESS | Server-side generator only | No arbitrary HTML PDF service | Request validation |
| UNTRUSTED CONTENT | Escaped HTML values | No raw user HTML | HTML renderer checker |
| NETWORK ACCESS | `LOCAL_DOCUMENT_ONLY_NO_REMOTE_FETCH` | No arbitrary remote fetch | Resource policy |
| REMOTE IMAGES | Disabled; fallbacks only | Resolve only versioned approved assets | Static asset policy |
| LOCAL FILE ACCESS | No browser file URL inputs | Controlled temp PDF only | Renderer contract |
| TEMP FILES | Controlled temp file cleaned on success/failure | No durable client artifact path | Fixture lifecycle |
| CHROMIUM SANDBOX | Local desktop may require permission | Deployment-specific proof required | Next gate |
| TIMEOUT | Central config | Bounded renderer request | Renderer config |
| RESOURCE CLEANUP | Page/browser close in finally | No orphan process from deterministic path | Fixture lifecycle |
| LOGGING | Operational metadata only | No seller narrative/source payload logs | Contract/checker |
| CLIENT DATA | Result blob in Agent session | No durable customer mutation | UI/route boundary |

## Resource Policy Table

| Resource Type | Allowed | Resolution | Versioned? | Failure Behavior |
| --- | --- | --- | --- | --- |
| LOCAL CSS | Yes | Inline render CSS | Yes | TEMPLATE_INCOMPATIBLE |
| LOCAL APPLICATION ASSETS | Yes | Static asset manifest | Yes | STATIC_ASSET_FAILURE |
| PROPERTY IMAGE | Yes | Certified fallback | Yes | CERTIFIED_FALLBACK |
| STATIC MAP | Yes | Text/table fallback | Yes | CERTIFIED_FALLBACK |
| STATIC CHART | Yes | Text/table fallback | Yes | CERTIFIED_FALLBACK |
| AGENT IMAGE | No | Not active | No | STATIC_ASSET_FAILURE |
| BRAND ASSET | Yes | Text/mark seam | Yes | CERTIFIED_FALLBACK |
| FONT | Yes | System fallback | No | FONT_FAILURE |
| REMOTE IMAGE | No | Not resolved | No | STATIC_ASSET_FAILURE |
| ARBITRARY REMOTE RESOURCE | No | Blocked by render target design | No | STATIC_ASSET_FAILURE |

## Temp / Byte Policy Table

| Artifact | Storage Mode | Lifetime | Cleanup | Durable? |
| --- | --- | --- | --- | --- |
| PDF BYTES | In-memory result returned to route/UI | Current request/session | Browser object URL revocation | No |
| TEMP PDF FILE | Controlled OS temp file | During render/QA only | Removed on success/failure | No |
| SCREEN / PAGE TEMP DATA | Playwright page/context | During render only | Page/browser close | No |
| STATIC ASSET TEMP DATA | Inline fallback only | Current render | No external temp asset | No |

## Performance Table

| Fixture | Startup | Render Duration | Pages | File Size | Assets | Result |
| --- | --- | --- | ---: | ---: | ---: | --- |
| SELLER | 160 ms | 1543 ms total | 8 | 220796 bytes | 6 | PASS |
| SELLER UPDATE | 144 ms | 1033 ms total | 6 | 187046 bytes | 3 | PASS |
| TABLE HEAVY | Structural fixture path | Not separately rendered | Uses provenance tables | N/A | Fallback-only | PASS via structural coverage |

## Regression Table

| Fixture | Structural Markers | Page Expectation | Render Fingerprint | QA Expected |
| --- | --- | --- | --- | --- |
| STANDARD SELLER | Seller, Executive Summary, Property, Location, Market, Competition, Pricing, Recommendation, Seller Decision, Evidence | Nonzero pages | Seller OutputRender fingerprint | PASS |
| SELLER UPDATE | Seller Update, Change Summary, Current Market, Current Competition, Agent Interpretation, Updated Recommendation, Seller Decision, Next Checkpoint, Evidence | Nonzero pages | Seller Update OutputRender fingerprint | PASS |
| TABLE HEAVY | Identity/provenance table markers | Table extraction present | Same render fingerprint | PASS |
| NO IMAGE | Property image fallback | No remote image required | Same render fingerprint | PASS_WITH_LIMITATION |
| STATIC MAP FALLBACK | Static Map Fallback | Present | Same render fingerprint | PASS |
| STATIC CHART FALLBACK | Static Chart Fallback | Present | Same render fingerprint | PASS |
| RIGHTS HOLD | RIGHTS_BLOCK | No file returned | N/A | FAIL_CLOSED |
| FRESHNESS HOLD | FRESHNESS_BLOCK | No file returned | N/A | FAIL_CLOSED |

## Product-Family Reuse Table

| Product | Renderer | Document Template | Specialized Assets / Pages | Readiness |
| --- | --- | --- | --- | --- |
| SELLER | DIRECT_RENDERER_REUSE | Certified | Static map/chart fallbacks | Certified |
| SELLER UPDATE | DIRECT_RENDERER_REUSE | Certified | Static chart/map fallbacks | Certified |
| BUYER | DIRECT_RENDERER_REUSE | Document template extension | Buyer decision pages | Future product work |
| MARKET | DIRECT_RENDERER_REUSE | Document template extension | Market charts/maps | Future product work |
| PROPERTY | DIRECT_RENDERER_REUSE | Document template extension | Property image/map assets | Future product work |
| LOCATION | DOCUMENT_TEMPLATE_EXTENSION | New location template | Map/static geography assets | Future product work |
| INVESTMENT | DOCUMENT_TEMPLATE_EXTENSION | Investment template | Financial tables/charts | Future policy/product work |
| FINANCIAL | DIRECT_RENDERER_REUSE | Financial template needed | Tables, sensitivity, assumptions | Requires financial policy/product |
| ADVISORY | DOCUMENT_TEMPLATE_EXTENSION | Advisory packet template | Professional handoff pages | Future product work |

## Persistence Handoff Table

| PDF / Render Field | Domain Now | Future OutputRender Persistence | Required For |
| --- | --- | --- | --- |
| RENDER ID | Runtime result | `renderId` | Retrieval/history |
| OUTPUT VERSION | Request/result | `outputVersionId` | Traceability |
| RENDER VERSION | Request/result | `renderVersion` | Regeneration |
| RENDERER VERSION | Request/result | `rendererVersion` | Reproducibility |
| DOCUMENT TEMPLATE VERSION | Request | `documentTemplateVersion` | Compatibility |
| PAGE TEMPLATE VERSION SET | Request | `pageTemplateVersionSet` | Layout history |
| CONTENT FINGERPRINT | Request/result | `contentFingerprint` | Content identity |
| RENDER FINGERPRINT | Request/result | `renderFingerprint` | Render identity |
| STATIC ASSET MANIFEST | Request | `staticAssetManifest` | Asset traceability |
| GENERATED AT | Result | `generatedAt` | Audit |
| PAGE COUNT | Result | `pageCount` | QA/search |
| FILE NAME | Result | `fileName` | Display/download |
| MIME TYPE | Result | `mimeType` | Storage |
| FILE SIZE | Result | `fileSize` | Storage/hash validation |
| FILE HASH | Result | `fileHash` | Integrity |
| QA STATE | Result | `qaState` | Certification |
| ACCESSIBILITY STATE | Result | `accessibilityState` | Accessibility review |
| RIGHTS STATE | Request | `rightsState` | Delivery gate |
| SUPERSESSION | Existing render lineage seam | `supersedes/supersededBy` | History |
| STORAGE REF | Null current phase | `storageRef` | Archive/delivery |

## Delivery Handoff Table

| Delivery Requirement | Source | Gate |
| --- | --- | --- |
| REVIEWED OUTPUT VERSION | OutputVersion | OUTPUT_PERSISTENCE_FOUNDATION_V1 |
| CERTIFIED PDF | OutputRender result | OUTPUT_RENDER_PERSISTENCE |
| AUDIENCE | Request | Delivery gate |
| RIGHTS | Eligibility | Rights review |
| FRESHNESS | Eligibility | Freshness review |
| CLIENT / RECIPIENT IDENTITY | Not active | PDF_DELIVERY_SHARING |
| FILE HASH | PDF result | OutputRender/file storage |
| DELIVERY RECORD | Not active | PDF_DELIVERY_SHARING |

## Deployment Table

| Deployment Concern | Local | Build | Deployed | Next Action |
| --- | --- | --- | --- | --- |
| CHROMIUM | Proven locally | Package pinned | Not proven | `ATLAS_PDF_RENDERER_DEPLOYMENT_VALIDATION_V1` |
| EXECUTABLE | Playwright default executable | Build compiles adapter | Not proven | Validate deployed executable resolution |
| PACKAGE | `playwright@1.62.1` | Locked | Package size unknown | Deployment proof |
| FUNCTION RUNTIME | Node runtime route | `runtime = nodejs` | Not proven | Validate memory/timeout |
| MEMORY | Local fixture measured | Build only | Not proven | Runtime metrics |
| TIMEOUT | 30000 ms config | Build only | Not proven | Deployed timeout proof |
| FILESYSTEM | OS temp cleaned | Build only | Not proven | Validate temp write/delete |
| NETWORK | Local document only | Build only | Not proven | Confirm no remote fetch |
| ASSETS | Inline/static fallback | Build only | Not proven | Deployed static asset proof |
| FONTS | System fallback | Build only | Not proven | Deployed font check |

## Capability Readiness Table

| Capability | State | Evidence | Next Gate |
| --- | --- | --- | --- |
| SELLER PRINT PREVIEW | READY | Existing Agent page and render foundation | None |
| SELLER PDF | CERTIFIED_AGENT_INTERNAL_EPHEMERAL | Runtime fixture and route | Deployment validation |
| SELLER UPDATE PDF | CERTIFIED_AGENT_INTERNAL_EPHEMERAL | Runtime fixture and route | Deployment validation |
| AGENT GENERATE PDF | ACTIVE_AGENT_INTERNAL | UI + API route | Deployment validation |
| PDF QA | CERTIFIED_STRUCTURAL | `runAtlasPdfStructuralQa` | Visual regression seam |
| PDF PROVENANCE | READY | Request/result + PDF body + response headers | Persistence |
| FILE HASH | READY | SHA-256 over exact bytes | OutputRender persistence |
| STATIC MAP | STATIC_MAP_FALLBACK_CERTIFIED | Text/table fallback | Advanced static maps |
| STATIC CHART | STATIC_CHART_FALLBACK_CERTIFIED | Text/table fallback | Advanced static charts |
| FONT | PDF_FONTS_READY_WITH_FALLBACK | Arial/Helvetica fallback | Brand font policy |
| METADATA | PDF_METADATA_PARTIAL | Title present | Metadata post-process |
| BOOKMARKS | PDF_BOOKMARKS_PARTIAL | `outline:true` accepted | Bookmark inspection |
| ACCESSIBILITY | PDF_ACCESSIBILITY_BASELINE_READY | Tagged baseline and text extraction | Advanced accessibility |
| TAGGED PDF | TAGGED_PDF_READY_BASELINE | `tagged:true` and pdfinfo Tagged yes in feasibility | Dedicated tag validation |
| DEPLOYMENT | DEPLOYMENT_VALIDATION_REQUIRED | Local/build proven only | Deployment validation |
| OUTPUT PERSISTENCE | READY_TO_CONSUME | Request exposes OutputVersion fields | OUTPUT_PERSISTENCE_FOUNDATION_V1 |
| RENDER PERSISTENCE | READY_TO_HAND_OFF | Result exposes OutputRender fields | OUTPUT_RENDER_PERSISTENCE |
| DELIVERY | NOT_ACTIVE_READY_TO_HAND_OFF | Certified result fields exist | PDF_DELIVERY_SHARING |
| FINANCIAL PDF | RENDERER_READY_POLICY_HELD | Renderer is product-neutral | SELLER_FINANCIAL_ESTIMATED_SCENARIO_POLICY_V1 |

## Traceability Table

| PDF | Output Version | Evidence | Pricing | Decision | Render Version | File Hash |
| --- | --- | --- | --- | --- | --- | --- |
| Seller | `seller-decision-brief-v2-reviewed` | `evidence-snapshot-seller-v2` | `SELLER_PRICING_SCENARIO_VERSION` | `SELLER_DECISION_BRIEF_DECISION_SEAM_V1` | `SELLER_DECISION_BRIEF_PRINT_RENDER_V1` | Runtime fixture SHA-256 |
| Seller Update | `seller-update-current-version` | `evidence-snapshot-seller-update-current` | `SELLER_PRICING_SCENARIO_VERSION` | `SELLER_POST_LAUNCH_SELLER_DECISION_V1` | `SELLER_UPDATE_PRINT_RENDER_V1` | Runtime fixture SHA-256 |

## Local PDF Artifact Certification

| PDF | File Type | Generated Path | Page Count | File Size | SHA-256 |
| --- | --- | --- | ---: | ---: | --- |
| Seller | application/pdf | `/private/tmp/atlas-pdf-renderer-v1/Seller-Decision-Brief-subject-seller-decision-brief-subject-property-SELLER-2026-08-27-SELLER_DECISION_BRIEF_PRINT_RENDER_V1.pdf` | 8 | 220796 | `5b6a52dcb6954dd56b18bd0111ca213e397e6162d021a14e8ad4de64bd96b037` |
| Seller Update | application/pdf | `/private/tmp/atlas-pdf-renderer-v1/Seller-Decision-Brief-subject-seller-decision-brief-subject-property-SELLER_UPDATE-2026-08-27-SELLER_UPDATE_PRINT_RENDER_V1.pdf` | 6 | 187046 | `3ea5c0305f3320e0b289d439174e5ce92fd8f9adb7390a495accba799bd47426` |

## Local Agent Experience Certification

Safe localhost verification used a temporary local-only Agent credential and the repository Agent session helper. The route returned ephemeral PDF bytes directly to the authenticated Agent request.

| Product | Route | HTTP | Content Type | Output Version | Render Version | Page Count | File Size | Route SHA-256 | QA |
| --- | --- | --- | --- | --- | --- | ---: | ---: | --- | --- |
| Seller | `/api/agent/output/pdf` | 200 | application/pdf | `seller-decision-brief-v2-reviewed` | `SELLER_DECISION_BRIEF_PRINT_RENDER_V1` | 8 | 220796 | `328e0068013eafc4e065895f55a0e4b0a0ca793c20e4f49bad68a6fa75a03165` | PDF_QA_PASSED |
| Seller Update | `/api/agent/output/pdf` | 200 | application/pdf | `seller-update-current-version` | `SELLER_UPDATE_PRINT_RENDER_V1` | 6 | 187046 | `57cd93341d18d084c183a112ae5819fe5fec1213c5eb8c20921e46f3c1a1a3ad` | PDF_QA_PASSED |

Agent workflow proof:

| Step | Agent Action | System State | Result |
| ---: | --- | --- | --- |
| 1 | Opens Seller Presentation | Authenticated Agent route | Seller Print Preview visible |
| 2 | Selects PDF product | Exact OutputVersion and RenderVersion resolved | Eligibility visible |
| 3 | Selects Generate PDF | PDF_RENDER_REQUESTED | Request sent to `/api/agent/output/pdf` |
| 4 | Waits | PDF_RENDERING | Playwright Chromium renders canonical HTML |
| 5 | System computes hash | PDF_QA_REQUIRED | SHA-256 and structural QA run |
| 6 | Reviews result | PDF_CERTIFIED | File name, page count, size, hash, QA, and provenance returned |
| 7 | Opens or saves | PDF_CERTIFIED | Browser object URL open/download; no durable storage |

## PDF Reproducibility

Logical render inputs:

| Input | Source |
| --- | --- |
| OUTPUT VERSION | OutputVersion / request |
| CONTENT FINGERPRINT | OutputVersion / request |
| DOCUMENT TEMPLATE VERSION | DocumentModel |
| PAGE TEMPLATE VERSIONS | OutputRender |
| VISUAL VERSION | OutputRender |
| STATIC ASSET MANIFEST | Seller Print/PDF Render Foundation |
| RENDERER ID | `ATLAS_PDF_RENDERER` |
| RENDERER VERSION | `PLAYWRIGHT_CHROMIUM_ADAPTER_V1` |
| CHROMIUM VERSION | `151.0.7922.34` |
| LOCALE | `en-US` |
| TIMEZONE | `America/Denver` |
| PRINT OPTIONS | Letter, portrait, print background, margins, header/footer |
| ACCESSIBILITY OPTIONS | tagged true, outline true, text markers required |
| RENDER FINGERPRINT | OutputRender fingerprint |

Proven reproducibility level:

`INPUT_DETERMINISTIC_WITH_METADATA_VARIANCE`

## Historical PDF Position

Future reconstruction model:

`DURABLE OUTPUT PRODUCT -> DURABLE OUTPUT VERSION -> DURABLE EVIDENCE / DECISION REFERENCES -> VERSIONED DOCUMENT TEMPLATE -> VERSIONED PAGE TEMPLATES -> VERSIONED STATIC ASSETS -> VERSIONED RENDERER -> REGENERATED PDF -> FILE HASH / STRUCTURAL COMPARISON`

## Financial PDF Readiness

| Future Financial Module | Document Model Support | Page Template Support | Table Support | Static Chart Support / Fallback | PDF Renderer Support | Additional Product Work |
| --- | --- | --- | --- | --- | --- | --- |
| Estimated net seller proceeds | Extension needed | Existing table page reusable | Yes | Static chart fallback | Yes | Policy/product certification |
| Estimated purchase cash required | Extension needed | Existing table page reusable | Yes | Static chart fallback | Yes | Policy/product certification |
| Estimated remaining liquidity | Extension needed | Existing table page reusable | Yes | Static chart fallback | Yes | Policy/product certification |
| Sell / buy timeline | Extension needed | Timeline page needed | Yes | Timeline fallback | Yes | Product certification |
| Dual carry | Extension needed | Table page reusable | Yes | Sensitivity fallback | Yes | Policy/product certification |
| Sell / buy / investment | Extension needed | Multi-scenario page needed | Yes | Static chart fallback | Yes | Policy/product certification |
| Investment acquisition cash | Extension needed | Table page reusable | Yes | Static chart fallback | Yes | Policy/product certification |
| NOI | Extension needed | Table page reusable | Yes | Static chart fallback | Yes | Policy/product certification |
| Investment cash flow | Extension needed | Table page reusable | Yes | Static chart fallback | Yes | Policy/product certification |
| Rent breakeven | Extension needed | Table page reusable | Yes | Static chart fallback | Yes | Policy/product certification |
| Occupancy breakeven | Extension needed | Table page reusable | Yes | Static chart fallback | Yes | Policy/product certification |
| Sensitivity | Extension needed | Table-heavy page reusable | Yes | Static chart fallback | Yes | Policy/product certification |
| Assumptions | Extension needed | Evidence/table page reusable | Yes | None required | Yes | Policy/product certification |
| Professional inputs | Extension needed | Evidence/table page reusable | Yes | None required | Yes | Policy/product certification |
| Agent interpretation | Extension needed | Narrative page reusable | Yes | Optional | Yes | Agent review gate |
| Seller decision | Extension needed | Decision page reusable | Yes | Optional | Yes | Policy/product certification |

## Next-Gate Prioritization Table

| Rank | Gate | Dependency | Agent Value | Client Value | Product-Family Value | Unlock |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | `ATLAS_PDF_RENDERER_DEPLOYMENT_VALIDATION_V1` | Local PDF renderer certified | Confirms production Agent PDF works | Indirect | High | Deployed Chromium, temp, memory, timeout proof |
| 2 | `OUTPUT_PERSISTENCE_FOUNDATION_V1` | Secondary blueprint complete | Cross-session reviewed outputs | High | High | Durable OutputVersion |
| 3 | `SELLER_FINANCIAL_ESTIMATED_SCENARIO_POLICY_V1` Primary certification | Secondary policy review | Financial PDF eligibility | High | High | Safe financial module gating |
| 4 | `SELLER_FINANCIAL_DECISION_PREPARATION_V1` | Financial policy certified | Agent financial prep | High | Medium | Seller financial pages |
| 5 | `OUTPUT_RENDER_PERSISTENCE` | Output persistence | Render history | High | High | Durable PDF metadata/hash |
| 6 | `FINANCIAL_DATA_PERSISTENCE` | Financial product policy | Financial continuity | High | Medium | Durable financial evidence |
| 7 | `ADVANCED_STATIC_MAP_CHART_RENDERING` | Renderer and asset policy | Better PDF fidelity | Medium | Medium | Raster map/chart assets |
| 8 | `PDF_DELIVERY_SHARING` | Durable render/storage/recipient | Delivery workflow | High | High | Client sharing |

## Next Primary Package

Package name:

`ATLAS_PDF_RENDERER_DEPLOYMENT_VALIDATION_V1`

Executive objective:

Prove the already-certified Agent-internal PDF renderer in the deployed runtime with one authenticated internal render target, one canonical Seller fixture, PDF bytes, SHA-256 file hash, structural QA, resource cleanup, and runtime metrics.

Workstreams:

| Workstream | Scope |
| --- | --- |
| 1 | Deployed Chromium executable resolution and launch proof |
| 2 | Authenticated internal PDF route fixture with exact Seller output/render |
| 3 | Deployed PDF bytes, file hash, structural QA, temp cleanup, memory, timeout, and log proof |
| 4 | Certification and go/no-go for broader Agent production use |

Collision boundary:

No durable persistence, file storage, delivery/sharing, customer mutation, provider calls, financial activation, or public PDF generation.

## Protected-System Confirmation

This package activates only Agent-internal ephemeral PDF generation for the certified Seller/Seller Update output family. It does not activate durable OutputVersion persistence, OutputRender persistence, file storage, PDF archive, delivery/sharing, customer mutation, CRM/email/message execution, provider runtime calls, MLS/IRES calls, Typesense mutation, cadence changes, webhook/polling changes, source activation, financial seller-facing outputs, or deployment.
