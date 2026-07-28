# PROJECT ATLAS(tm) - REIE 7.1 Adjustments and Modifications Traceability Matrix(tm)

Status: `REIE_7_1_ADJUSTMENTS_TRACEABILITY_MATRIX_ESTABLISHED`

Date: July 28, 2026

Source reconciliation:

`SOURCE_RECONCILED_GOOGLE_DOC_READ_ONLY`

## 1. Executive Summary

This matrix maps every requirement in the REIE 7.1 Adjustments and Modifications Requirements Register to repository implementation evidence, program ownership, certification evidence, remaining work, and future authorization path.

This is governance only. It does not authorize implementation, deployment, production mutation, telemetry, AI, GIS activation, provider activation, database work, authentication changes, or customer-facing changes.

## 2. Matrix

| ID | Program Ownership | Repository Implementation | Certification Evidence | Remaining Work | Future Authorization Path |
|---|---|---|---|---|---|
| REIE-ADJ-001 | CEP / design system | Public pages still use borders in many sections. | None specific to this requirement. | Global border/line audit and visual QA. | Future CEP visual polish review. |
| REIE-ADJ-002 | CEP | Separate routes exist for core capabilities; finance and Sundance routes missing. | CEP Sprints 1-5 certified implemented routes. | Add or reject missing requested pages through executive decision. | Future CEP/customer-content authorization. |
| REIE-ADJ-003 | CEP | Home pathway selector in `app/page.tsx`. | CEP Sprint 5 navigation continuity. | Maintain as new pathways are added. | Maintenance governance. |
| REIE-ADJ-004 | CEP | Home links out to capabilities without duplicating full pages. | CEP production certifications. | Preserve content discipline. | Maintenance governance. |
| REIE-ADJ-005 | CEP | Improved public presentation across certified CEP sprints. | Partial via CEP certifications. | Source-specific luxury design QA. | Future CEP visual polish review. |
| REIE-ADJ-006 | CEP | Responsive spacing exists but no global negative-space certification. | Partial via CEP responsive reviews. | Full desktop/tablet/mobile visual audit. | Future CEP visual polish review. |
| REIE-ADJ-007 | CEP | CTA and hierarchy improvements exist. | Partial via CEP certifications. | Global clutter reduction review. | Future CEP visual polish review. |
| REIE-ADJ-008 | CEP / map styling | Cyan UI accents; OpenTopoMap and optional Mapbox overlay. | Search/map certified, not Electric Caribbean Blue map styling. | Governed map style decision and QA. | Future Search/Map styling sprint. |
| REIE-ADJ-009 | CEP | No three-option map theme selector found. | None. | Define map theme architecture. | Future Search/Map map-theme authorization. |
| REIE-ADJ-010 | CEP | Search/map navigation continuity exists. | CEP Sprint 5 certification. | Keep current as routes evolve. | Maintenance governance. |
| REIE-ADJ-011 | CEP / EPARB | Global footer; route-specific headers. | Navigation continuity certified, not uniform menu bar. | Shared navigation standard. | Future EPARB/CEP navigation review. |
| REIE-ADJ-012 | CEP | Some pages show top-left company identity. | Not globally certified. | Route audit. | Future navigation-standard review. |
| REIE-ADJ-013 | CEP | Some brand links point home. | Not globally certified. | Route audit. | Future navigation-standard review. |
| REIE-ADJ-014 | CEP / content intelligence | Schema components, sitemap, FAQ/tool schemas. | SEO/AEO not fully certified. | AEO strategy, source review, measurement if authorized. | Future AEO/content authority sprint. |
| REIE-ADJ-015 | Future buyer financing | No mortgage route found. | None. | Mortgage calculator requirements and compliance review. | Future Buyer Financing Experience program. |
| REIE-ADJ-016 | Future buyer financing | No lender route found. | None. | Lender page governance, legal/affiliated-business review. | Future lender-governance authorization. |
| REIE-ADJ-017 | CEP / CAO | `/sell` and valuation API exist; no dedicated home-worth page. | Seller journey certified, dedicated page not certified. | Decide whether dedicated page is required. | Future seller valuation page sprint. |
| REIE-ADJ-018 | Public Trust / CEP | Global `BrokerageAttribution` still renders at top. | None. | Legal/brokerage decision before removal. | Future Public Trust disclosure review. |
| REIE-ADJ-019 | Public Trust / CEP | Summary/detail disclosure separation exists. | Not source-certified. | Simplification with counsel/brokerage approval. | Future Public Trust disclosure review. |
| REIE-ADJ-020 | Future editorial | No Sundance route found. | None. | Content, rights, URL, and editorial strategy. | Future Local Editorial Experience program. |
| REIE-ADJ-021 | Future editorial | No Sundance URL found. | None. | Independent route if page authorized. | Future Local Editorial Experience program. |
| REIE-ADJ-022 | Future editorial | Article framework exists; no Sundance content found. | None. | Editorial calendar and article production. | Future Local Editorial Experience program. |
| REIE-ADJ-023 | CEP | Responsive padding exists; exact mobile complaint not certified. | Partial via CEP responsive reviews. | Source-specific mobile spacing QA. | Future CEP mobile polish review. |
| REIE-ADJ-024 | CEP / map styling | SearchMap styling exists; initial color-filter behavior not certified. | Map rendering certified generally. | Visual map-state QA. | Future Search/Map styling sprint. |
| REIE-ADJ-025 | CEP / map styling | No governed water-color control found. | None. | Provider/style feasibility review. | Future Search/Map styling sprint. |
| REIE-ADJ-026 | GKM/GMA/EIP/GIS | Editorial separation is documented in governance records. | Prior GKM/GMA/EIP certifications. | Maintain boundary. | Separate authorization for any conversion/activation. |
| REIE-ADJ-027 | GKM | GKM inventory record exists. | GKM certified and closed. | Maintain no-activation boundary. | Separate activation authorization. |
| REIE-ADJ-028 | GMA | GMA architecture record exists. | GMA certified and closed. | Maintain prerequisite status. | Separate mapping implementation authorization. |
| REIE-ADJ-029 | GMA/GKC/EIP | Conversion prohibition documented. | Prior governance certifications. | Maintain fail-closed conversion rule. | Executive approval required for supersession/activation. |
| REIE-ADJ-030 | GIS/GMA/EIP/EKCP | Activation prohibitions documented. | Prior safety checks and certifications. | Maintain active prohibition. | Separate GIS/EIP/EKCP activation authorization. |
| REIE-ADJ-031 | GMA | Read-only preview fixtures exist. | GMA preview certified. | Future canonical selection review if authorized. | Separate GMA authorization. |
| REIE-ADJ-032 | GMA | Internal mapping review queue exists. | GMA queue certified. | Future decision/persistence authorization. | Separate GMA authorization. |
| REIE-ADJ-033 | GMA | Internal decision fixture exists. | GMA fixture certified. | No production activation without separate authorization. | Separate GMA/EIP authorization. |
| REIE-ADJ-034 | EIP | Quality engine exists. | EIP Sprint 3 certified. | Preserve quality-not-activation rule. | Separate activation authorization. |
| REIE-ADJ-035 | EIP | Activation readiness ledger exists. | EIP Sprint 4 certified. | Preserve readiness/auth/activation separation. | Separate activation authorization. |
| REIE-ADJ-036 | EIP | Enterprise Knowledge Approval System exists. | EIP Sprint 5 certified. | Preserve approval-not-activation rule. | Separate activation authorization. |
| REIE-ADJ-037 | EIP/GIS | Sprint 6 internal Thornton pilot records exist. | Sprint 6 closure certified. | Preserve row and scope boundaries. | Separate expansion authorization. |
| REIE-ADJ-038 | EIP/GIS/EKCP | No customer activation boundary documented. | Sprint 6/EKCP certification evidence. | Maintain zero customer visibility. | Separate customer activation authorization. |
| REIE-ADJ-039 | EIP/GIS | Rollback boundary documented. | Sprint 6 closure evidence. | Separate approval for rollback/retirement/deletion/expansion. | Executive authorization. |
| REIE-ADJ-040 | EKCP | Consumer adapter separation exists. | EKCP Sprint 1 certification. | Preserve no-runtime/customer activation. | Separate EKCP activation authorization. |

## 3. Completion Rule

No strategic completion review for a customer-experience or platform program may claim full completion without checking this matrix for relevant open or partially implemented requirements.

## 4. Supersession Rule

No requirement may be marked `SUPERSEDED` without documented rationale and executive approval.

## 5. Current Traceability Assessment

The register is reconciled to the accessible Google Doc source.

Open customer-facing work remains substantial and governed. The highest-risk unresolved items are:

- administrative access architecture, now reviewed by EPARB Review 1
- Mortgage Calculator and recommended lender page
- Sundance page and article strategy
- map theme/water-color requirements
- brokerage disclosure placement and simplification
- globally consistent navigation/header behavior

Certified geographic and enterprise-knowledge governance items remain binding and do not authorize GIS, AI, provider activation, customer visibility, runtime activation, or production mutation.
