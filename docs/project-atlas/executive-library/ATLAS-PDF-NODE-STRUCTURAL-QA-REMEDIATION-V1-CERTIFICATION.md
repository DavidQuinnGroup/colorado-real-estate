# ATLAS PDF Node Structural QA Remediation V1 Certification

## Executive Result

`ATLAS_PDF_NODE_STRUCTURAL_QA_REMEDIATION_V1_CERTIFIED_WITH_LIMITATIONS`

The deployed Agent-internal Seller PDF renderer now certifies PDF bytes with the Node-compatible `pdfreader@3.0.8/pdf2json@3.1.4` structural parser. The former browser-dependent parser path and native/Python command fallbacks are absent from the active renderer path.

| Field | Evidence |
| --- | --- |
| Authorized baseline | `5a5a2a6028d776a1792e602f04d6f9ecf80c9de8` |
| Runtime commit certified | `53cf3706` |
| Production deployment | `dpl_3UVoWMooFX4VZibUB5bc5FMn2xnS` |
| Production deployment URL | `https://david-quinn-group-8rde-5shwxxisj-david-quinns-projects-a0953600.vercel.app` |
| QA engine | `ATLAS_PDF_STRUCTURAL_QA_ENGINE_V1` |
| Parser | `PDFREADER_PDF2JSON` / `pdfreader@3.0.8/pdf2json@3.1.4` |
| Persistence / delivery | Not activated; Agent-session result only |

## Production Evidence

| Product | Result | Generated at | Pages / bytes | SHA-256 evidence |
| --- | --- | --- | --- | --- |
| Seller Update PDF | `PDF_CERTIFIED`, `PDF_QA_PASSED` | `2026-08-29T18:12:25.685Z` | 6 / 95,888 | `8f87166b4762c79e...` displayed by the authenticated Agent workspace |
| Seller PDF | `PDF_CERTIFIED`, `PDF_QA_PASSED` | `2026-08-29T18:13:42.158Z` | 8 / 127,715 | `a2ef4b2d7cad3ea1...` displayed by the authenticated Agent workspace |

Both requests were made through the authenticated production Agent workspace at `/agent/prepare/seller/presentation`. The route returned the generated PDF only after structural QA passed. The result remained an ephemeral browser object URL with no OutputRender persistence, archive, delivery, CRM, provider, or customer mutation.

## Failure And Remediation Evidence

The first deployed Seller Update request failed closed with HTTP `409` and `QA_FAILURE`; no file was returned. Bounded diagnostics identified `PDF_TABLE_STRUCTURE_INVALID`, then the hash-only marker diagnostic identified the redundant `Content fingerprint` table-label extraction gap. The exact content fingerprint value was already required by, and passed, the product profile. The table assertion now requires the printed table caption and output-version label while the exact fingerprint remains a required profile marker.

Failure diagnostics retain only typed codes and allowlisted marker hashes. They do not retain PDF bytes, extracted text, source narrative, credentials, or request cookies.

## Validation

| Validation | Result |
| --- | --- |
| `npm run typecheck` | PASS |
| `npm run check:atlas-pdf-structural-qa-runtime` | PASS |
| `npm run check:atlas-pdf-renderer` | PASS |
| `npm run check:atlas-pdf-renderer-deployment-validation` | PASS |
| `npm run run:atlas-pdf-renderer-fixtures` | PASS for Seller, Seller Update, invalid signature, missing marker, wrong profile, truncated bytes, version mismatch, rights hold, freshness hold, and renderer-failure paths |
| `npm run build` | PASS with existing dynamic-require and unrelated lint warnings |
| `git diff --check` | PASS |

## Limitations And Boundaries

- QA is structural and text-based. It does not replace visual regression, tagged-PDF accessibility, bookmark-tree, or advanced raster-map/chart validation.
- Exact byte identity is not promised across separate renders because generated metadata can vary; SHA-256 verifies each returned byte stream.
- The source output is still reviewed, fixture-backed Agent-internal content. This certification does not authorize public PDF generation, file storage, sharing, customer delivery, persistence, provider calls, or financial-output activation.

## Parent Closure

`ATLAS_PDF_RENDERER_DEPLOYMENT_VALIDATION_V1_CERTIFIED_WITH_LIMITATIONS`

The original renderer deployment-validation gate is closed for the certified Seller and Seller Update Agent-internal products. Any future persistence, delivery, public exposure, advanced visual/accessibility QA, or broader product-family expansion requires separate authorization.
