# REIE Agent Listing Evidence and Source Admission Readiness MVV Certification

## Decision

`REIE_AGENT_LISTING_EVIDENCE_AND_SOURCE_ADMISSION_READINESS_MVV` adds a narrow, private Agent-only Listing evidence-readiness layer at `/agent/prepare/listing`. It composes only with the existing exact Agent Property candidate endpoint and evaluates an exact active public Colorado repository property in memory. No free-form address, owner, customer, or MLS identifier is accepted.

`ADMITTED_WITH_LIMITATIONS` means an identified repository property can be shown to the authenticated Agent with its stored listing reference, source, observed date, provenance, jurisdiction, and required verification prompts. It never grants public display, MLS activity, listing creation, marketing, pricing, valuation, launch, Search, Map, Property, route, or source activation authority.

## Dependency Reconciliation

| Dependency | Status | Treatment |
| --- | --- | --- |
| Listing Preparation MVV | Preserved | Generic session-only preparation and the complete playbook remain available with or without selected evidence. |
| Agent Property Preparation admission | Reused | The existing canonical property slug, listing reference, active-public-Colorado scope, source posture, freshness, rights, and conflict gates are the sole identity admission path. |
| Agent Property endpoint | Reused | Exact Agent-only `GET /api/agent/prepare/property`, private no-store, summary then canonical-slug detail read. No new endpoint or authorization grant. |
| Evidence Depth / Source Rights contracts | Reused semantically | Source identity, acquisition, rights, freshness, attribution, provenance, conflict, and protected-use concepts are represented without a parallel source registry or provider read. |
| Provider, IRES, MLS, public records, media, CRM, and listing systems | Blocked | No credential, source activation, synchronization, acquisition, mutation, or display pathway is added. |

## Source Readiness Contract

The canonical contract is `lib/agent-advisory-workbench/agentListingEvidenceAdmission.ts`. It is deterministic and in-memory. Each admitted item requires:

- exact repository property subject and canonical property reference;
- matching listing reference and identity provenance;
- `REIE_STORED_LISTING_FACTS` source identity, existing repository source class, and Project Atlas repository-property authority;
- existing-repository-read acquisition, private Agent display rights, source-reference attribution, observed date, and current freshness;
- Colorado jurisdiction, no known conflict, exact repository-property confidence, direct verification, and professional-verification requirement;
- explicit permitted use: private Agent Listing preparation only;
- explicit prohibited uses: public display, MLS activity, listing creation, marketing activation, pricing or valuation conclusion, and suitability or demographic inference;
- source citation and a two-step transformation lineage: repository read, then Listing evidence admission.

Unknown rights, missing source identity or attribution, stale facts, conflicts, missing or ambiguous identity, unsupported jurisdiction, incomplete provenance, provider runtime, persistence, and public activation all fail closed.

## Evidence / Rights / Freshness Model

The evidence view may render identity, stored status, stored list price, and stored property type only after the independent Property admission contract passes. Each item is private Agent preparation evidence, not public-display evidence. Its freshness is `CURRENT` only when the existing Property contract has accepted the stored observation within its established window; expiration remains `VERIFY_BEFORE_RELIANCE`.

Condition, measurements, inclusions, records, disclosures, access, tax, parcel, ownership, permits, title, HOA, insurance, flood, environmental material, price history, events, listing remarks, and media remain outside admission. The view labels those gaps and routes them to direct verification or the appropriate professional rather than manufacturing a fact or conclusion.

## Certification State Machine

1. `IDENTITY_MISSING`, `IDENTITY_CONFLICT`, `INSUFFICIENT_PROVENANCE`, `STALE`, `CONFLICTING`, `RIGHTS_RESTRICTED`, `JURISDICTION_UNCERTAIN`, or `NOT_ADMITTED`: do not render an identity or factual evidence.
2. `ADMITTED_WITH_LIMITATIONS`: render the exact repository identity and four bounded factual orientation items with source, observed date, provenance, limitations, and professional verification.
3. `ADMITTED`: reserved for a future separately authorized case with no limiting verification condition; it is not reached by this MVV.
4. `NOT_AUTHORIZED`: every activation and public-use disposition remains blocked regardless of readiness state.

An existing route, Source Registry identity, Source Quality, or technical source accessibility does not create permitted use or activation authority.

## Same-Page Composition

The Listing page retains the prior generic preparation path. An Agent may optionally select an existing supported repository property from the same no-store Property selector. The selected canonical slug is resolved only through the existing exact Agent endpoint and held in open-page state. After preparation, the same page shows What we know, What needs verification, What to prepare next, and progressive Source, freshness, and limitations detail; the complete Listing playbook remains visible.

No selection is required. A missing selector, failed detail read, or failed admission leaves the generic Listing briefing available and does not introduce an identity fallback.

## Deterministic Certification

`npm run check:agent-listing-evidence-admission` covers admitted evidence; missing identity or provenance; identity conflict; stale, restricted-rights, conflicting, and unsupported-jurisdiction evidence; provider-runtime rejection; source and freshness presentation; same-page continuity; canonical-slug-only lookup; private no-store endpoint reuse; and protected-system markers.

`npm run check:agent-listing-preparation` remains the regression gate for the original Listing MVV. The existing Buyer, Seller, Location, Property, Market, Agent-auth/navigation, Public Trust, Public Runtime, Source Rights, runtime source-import, typecheck, build, and diff checks remain separate validation gates.

## Protected-System Confirmation

This readiness MVV adds no database/schema change, provider or IRES access, synchronization, credentials/environment access, CRM/customer access or mutation, email, MLS activity, listing or marketing workflow, pricing/valuation/professional conclusion, deployment, or public-runtime activation. It changes no authorization role or generic route grant. All evidence selection and display are private, exact-Agent, read-only, no-store, and open-session only.
