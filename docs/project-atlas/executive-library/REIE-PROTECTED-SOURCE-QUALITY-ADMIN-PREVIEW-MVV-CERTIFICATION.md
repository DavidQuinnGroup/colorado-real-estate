# REIE Protected Source Quality Admin Preview MVV Certification

## Certified scope

This MVV adds one protected server-rendered `/admin/source-quality` page, one deterministic fixture, one checker, and this certification. The page demonstrates only:

`PREVIEW_FIXTURE_ONLY → Source Quality Summary Assembly → Source Quality Report Composition → protected rendering`.

## Non-operational posture

- Fixture only; not an operational source inventory.
- Supplied reviewed fixture/manifest only; no statewide, provider, county, or source completeness claim.
- No source activation, rights grant, customer-display authority, approval action, workflow, persistence, provider call, county call, DB/CRM access, Search/Typesense access, communication, or deployment.
- Existing `/admin/:path*` authentication and login redirect are reused unchanged.

## Rendering boundary

The page is a server component with no client fetch or API route. It imports the fixture, calls canonical Assembly, passes canonical summaries to Report Composition, and renders only report-derived posture/count/queue/reference/firewall fields plus static fixture disclosures. It does not normalize, classify, count, order, score, rank, or infer source evidence.

## Fixture boundary

The fixture contains only controlled structured linkage/reference records for a deterministic internal demonstration of complete, review-required, conflict, and insufficient-evidence report states. It contains no customer data, personal contact data, credential, secret, raw provider/county correspondence, or protected county artifact content.

## Required validation

The dedicated Preview checker, Assembly/Report/Summary/Normalization checkers, TypeScript, production build, static safety scan, exact scope check, and existing-admin unauthenticated redirect validation must pass before certification. The fixture-only disclosure and activation/customer-display firewall must remain visible.
