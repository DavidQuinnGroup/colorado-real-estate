# REIE Permit Candidate Lifecycle Non-Operational Firewall MVV Certification

## Classification

REIE_PERMIT_CANDIDATE_LIFECYCLE_NON_OPERATIONAL_FIREWALL_MVV_CERTIFICATION

## Scope

This certification covers the bounded lifecycle clarification for `SRC-BOULDER-PERMIT-CANDIDATES`.

The candidate source remains in the Source Registry as historical discovery and verification context. It is intentionally not an operational Source Quality source.

## Lifecycle Posture

`SRC-BOULDER-PERMIT-CANDIDATES` is explicitly classified as:

- `NON_OPERATIONAL_DISCOVERY_VERIFICATION_CONTEXT`
- `NOT_ELIGIBLE_NON_OPERATIONAL_CONTEXT`

The Registry posture remains unchanged:

- `AUTHORITATIVE_SOURCE`
- `BUILDING_PERMITS`
- `AWAITING_PROVIDER_CONFIRMATION`
- `BLOCKED_NOT_AUTHORIZED`
- `claimEligible=false`

## Exact Permit Channels

The candidate source does not operate as an aggregate, parent, member, or evidence-inheritance authority for exact permit sources.

Operational Source Quality review for permit sources is represented by independently governed exact channels:

- `SRC-BOULDER-COUNTY-ACCELA-PERMITS`
- `SRC-CITY-BOULDER-OPEN-DATA-PERMITS`
- `SRC-CITY-BOULDER-BUILDING-PERMITS-PORTAL`

Each channel retains its own Registry posture, conversion class, evidence module, firewalls, and Operational Manifest entry.

## Non-Operational Firewalls

The candidate source is not:

- Source Quality evidence authority
- conversion authority
- Operational Manifest source
- activation authority
- aggregate source
- parent source
- member source
- evidence-inheritance authority
- rights, access, freshness, attribution, or provenance authority

## Admin Preview Fixture

The protected Admin Preview regression fixture no longer uses `SRC-BOULDER-PERMIT-CANDIDATES` as an insufficient-evidence example.

The preview fixture remains `PREVIEW_FIXTURE_ONLY` and uses the existing blocked `SRC-BOULDER-COUNTY-TREASURER` Registry source for the insufficient-evidence row, so candidate lifecycle metadata cannot be confused with preview evidence.

## Certification Evidence

The local checkers certify:

- candidate remains in Registry
- candidate remains blocked and claim-ineligible
- candidate lifecycle metadata is explicit and finite
- candidate is absent from Public Record conversion allowlists
- County conversion rejects candidate with `COUNTY_NON_OPERATIONAL_CANDIDATE_REJECTED`
- County conversion rejection reason remains `NON_OPERATIONAL_PERMIT_CANDIDATE_NOT_CONVERSION_AUTHORITY`
- candidate appears zero times in the Operational Manifest
- exact permit sources remain independently governed
- exact permit evidence does not inherit candidate authority
- Admin Preview does not use the real candidate source as fixture evidence

## Protected Boundaries

This MVV does not authorize or perform:

- candidate Source Quality evidence module creation
- candidate Operational Manifest inclusion
- source activation
- provider calls
- permit retrieval
- external research
- database writes
- Prisma schema changes
- Search or Typesense mutation
- alerts, email, CRM, queues, or workers
- deployment
- production configuration changes

## Future Governance

Removal, retirement, or deprecation of `SRC-BOULDER-PERMIT-CANDIDATES` remains separately governed if a future business or governance need arises.

No further permit-candidate evidence, Manifest, activation, or runtime work is required by this MVV.

## Final Local Classification

PERMIT_CANDIDATE_LIFECYCLE_GOVERNANCE_COMPLETE
