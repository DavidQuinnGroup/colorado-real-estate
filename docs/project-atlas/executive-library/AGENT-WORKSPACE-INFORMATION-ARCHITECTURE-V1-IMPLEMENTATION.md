# PROJECT ATLAS - Agent Workspace Information Architecture V1

## Architecture

Agent Workspace is the authenticated navigation, orientation, start-work, and durable-work discovery layer. It does not own Client Case, Transaction, financial scenario, Output, Professional Input, Client Authorization, Property, task, or workflow truth.

The V1 primary work domains are Client Work, Buyer, Seller, Financial Strategy, Intelligence, and Transactions. Outputs is deferred until `OUTPUT_REPORT_COMPOSITION_FOUNDATION_V1`; Client Authorization is a utility/governance destination. Workspace Home is `/agent`, Client Work is `/agent/clients`, and Case identity remains explicit at `/agent/clients/[clientCaseId]`.

## Implementation

The shared Agent shell reads a typed in-code navigation registry, derives active state from the pathname, exposes `aria-current`, keeps Client Authorization and Public Site separate from work domains, and preserves responsive wrapping and keyboard focus. Workspace Home provides start-domain links and a small owner-scoped, active-only recent Case projection from the canonical Client Case API. It persists no Workspace copy and creates no work through navigation.

All `/agent/*` pages now use the existing Agent authentication boundary. Login returns safe Agent deep links when supplied; `/agent` remains the default. Public navigation continues to expose Agent Login or Agent Workspace based on existing session state.

## Authentication Continuity Recovery

During production human certification on 2026-09-03, an authenticated Agent was unexpectedly redirected to `/agent/login?next=%2Fagent` during ordinary Workspace navigation. The Workspace shell had rendered the destructive GET logout route with `next/link`; framework prefetch could therefore invoke the logout handler and expire the valid Agent session without an intentional sign-out. The correction renders Sign out as an ordinary anchor so its GET handler runs only on explicit activation. Agent session validation remains a stateless signed, HttpOnly, Secure-in-production, SameSite Lax cookie at path `/`; no private-access or Agent authentication boundary was weakened. Human retest is required before Workspace IA certification can close.

## Boundaries And Validation

No database migration, Workspace persistence, production-data mutation, automatic Case creation, Transaction creation, Output creation, or external action is introduced. The retained synthetic Client Case remains read-only for this certification. Focused static IA checks and typecheck passed. Human certification, production deployment, and final state remain pending.
