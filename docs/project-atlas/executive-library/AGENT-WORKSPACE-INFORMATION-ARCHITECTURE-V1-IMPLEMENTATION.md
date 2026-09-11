# PROJECT ATLAS - Agent Workspace Information Architecture V1

## Architecture

Agent Workspace is the authenticated navigation, orientation, start-work, and durable-work discovery layer. It does not own Client Case, Transaction, financial scenario, Output, Professional Input, Client Authorization, Property, task, or workflow truth.

The V1 primary work domains are Client Work, Buyer, Seller, Financial Strategy, Intelligence, and Transactions. Outputs is deferred until `OUTPUT_REPORT_COMPOSITION_FOUNDATION_V1`; Client Authorization is a utility/governance destination. Workspace Home is `/agent`, Client Work is `/agent/clients`, and Case identity remains explicit at `/agent/clients/[clientCaseId]`.

## Implementation

The shared Agent shell reads a typed in-code navigation registry, derives active state from the pathname, exposes `aria-current`, keeps Client Authorization and Public Site separate from work domains, and preserves responsive wrapping and keyboard focus. Workspace Home provides start-domain links and a small owner-scoped, active-only recent Case projection from the canonical Client Case API. It persists no Workspace copy and creates no work through navigation.

All `/agent/*` pages now use the existing Agent authentication boundary. Login returns safe Agent deep links when supplied; `/agent` remains the default. Public navigation continues to expose Agent Login or Agent Workspace based on existing session state.

## Authentication Continuity Recovery

During production human certification on 2026-09-03, an authenticated Agent was unexpectedly redirected to `/agent/login?next=%2Fagent` during ordinary Workspace navigation. The Workspace shell had rendered the destructive GET logout route with `next/link`; framework prefetch could therefore invoke the logout handler and expire the valid Agent session without an intentional sign-out. The correction renders Sign out as an ordinary anchor so its GET handler runs only on explicit activation. Agent session validation remains a stateless signed, HttpOnly, Secure-in-production, SameSite Lax cookie at path `/`; no private-access or Agent authentication boundary was weakened. Human retest is required before Workspace IA certification can close.

## Client Case Context And Presentation

The Executive requested direct lateral work navigation from a Case without hidden state. The implementation preserves the opaque `clientCaseId` only in authenticated route-local URLs, validates the Case through the owner-scoped Case API, and never writes browser, cookie, database, or global React active-Case state. Contextual Buyer, Seller, Financial Strategy, Intelligence, and Transactions pages render the same prominent Client Case title, status, and contextual navigation; Workspace Home and global Client Work intentionally exit Case context. Case lifecycle actions remain distinct from contextual work navigation.

## Human Certification And Closure

On 2026-09-11, the Executive completed production certification on `davidquinngroup.com` against `24d3bfd727eb0c12be29a1e65068a72c1c45d43d`. Workspace Home, recent Client Work, the retained synthetic Case `cmtlsgepy00003yqsh1n54ltc`, authentication continuity, all five contextual work domains, explicit context exit, and global Buyer without stale Case context passed. The synthetic Case remained `ACTIVE` with one party, zero properties, and zero Transactions; it was not mutated.

The auth-session recovery is closed: root cause `DESTRUCTIVE_GET_LOGOUT_RENDERED_AS_PREFETCH_CAPABLE_NEXT_LINK`; correction `40cefe63267e58be115072b6f9579e2e50d07def`; human retest PASS. The route-local Case-context refinement is closed at `4bc4f46e8e253c561f475b135f74e7a4732cde9e`; the presentation-consistency refinement is closed at `24d3bfd727eb0c12be29a1e65068a72c1c45d43d`.

No database migration, Workspace persistence, production-data mutation, automatic Case creation, Transaction creation, Output creation, Client Authorization mutation, or external action occurred. `AGENT_WORKSPACE_INFORMATION_ARCHITECTURE_V1` is `PRODUCTION_CERTIFIED_AND_CLOSED`; `HUMAN_RETEST_REQUIRED: NO`; `FOUNDATION_BLOCKER: NONE`. `OUTPUT_REPORT_COMPOSITION_FOUNDATION_V1` is the following Primary gate and is not implemented by this record.
