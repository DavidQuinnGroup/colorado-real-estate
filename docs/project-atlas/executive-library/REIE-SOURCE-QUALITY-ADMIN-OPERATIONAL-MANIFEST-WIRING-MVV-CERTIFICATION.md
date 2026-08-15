# REIE Source Quality Admin Operational Manifest Wiring MVV Certification

## Certified scope

This MVV wires the protected `/admin/source-quality` server page from the preview fixture input to the canonical Source Quality Operational Manifest input.

Runtime flow is:

`SOURCE_QUALITY_OPERATIONAL_MANIFEST_DATA -> Operational Manifest validation/adapter -> Source Quality Summary Assembly -> Source Quality Report Composition -> protected rendering`.

## Preserved boundaries

- The manifest remains a partial reviewed source set only.
- `/admin/source-quality` remains protected by existing `/admin/:path*` middleware.
- The page remains render-only and server-side.
- The preview fixture remains available for deterministic regression/checker coverage only.
- No fixture fallback is permitted if operational manifest validation fails.
- No source activation, legal-use approval, customer-display authority, quality score, provider ranking, completeness claim, report persistence, provider/county call, database access, CRM access, Search/Typesense mutation, or deployment is authorized.

## Disclosure posture

The page must visibly identify the operational reviewed manifest, partial reviewed source set, no completeness claim, current manifest source count, and manifest authority firewalls:

- `SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_MANIFEST`
- `CUSTOMER_DISPLAY_NOT_GRANTED_BY_MANIFEST`
- `LEGAL_USE_NOT_APPROVED_BY_MANIFEST`
- `NO_QUALITY_SCORE`
- `NO_PROVIDER_RANKING`
- `NO_COMPLETENESS_CLAIM`

## Validation

Certification requires the Admin Preview checker, Operational Manifest checker, Summary Assembly checker, Report checker, Source Quality Control checker, Evidence Normalization checker, TypeScript, production build, static safety scan, `git diff --check`, and exact authorized file-scope verification to pass.

## Final classification

`SOURCE_QUALITY_ADMIN_OPERATIONAL_MANIFEST_WIRING_MVV_IMPLEMENTED_AND_LOCALLY_CERTIFIED`
