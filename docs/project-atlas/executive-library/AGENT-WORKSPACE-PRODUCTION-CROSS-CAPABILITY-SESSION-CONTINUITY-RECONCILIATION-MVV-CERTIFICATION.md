# Agent Workspace Production Cross-Capability Session Continuity Reconciliation MVV Certification

## Production Evidence

Human production evidence controls: an authenticated Agent navigating from Market Preparation to Place Preparation was redirected to Agent Sign In. The three capabilities already shared one signed, root-scoped `reie_agent_session` and had exact, equivalent `HUMAN_AGENT`, `AGENT`, `HUMAN_AGENT_SESSION`, read-only authorization. This was not route-specific identity or capability state.

## Remediation

The Agent Workspace now uses ordinary same-origin document navigation for its three exact preparation capabilities. This removes those transitions from the App Router client-navigation and middleware-response cache path. Every destination therefore performs a fresh, cookie-bearing document request and applies the same existing server-side session validation and exact capability authorization.

## Session And Capability Model

The only current private capabilities are `/agent/prepare/place`, `/agent/prepare/property`, and `/agent/prepare/market`. They share one `reie_agent_session`, scoped to `/`, `HttpOnly`, `Secure` in production, `SameSite=Lax`, and eight-hour maximum age. The signed session carries the stable subject, `PER_USER_CREDENTIAL` issuer, `AGENT` role, expiry, and Agent session version. The configured Agent subject must remain active.

No generic `/agent/*` grant exists. Agent sessions remain denied for generic Admin, Admin APIs, MCP, machine operations, and mutation-capable routes. Login returns admit only the three exact capabilities and fail closed to Market Preparation; no external or Admin return value is accepted.

## Deterministic Proof

The cross-capability checker exercises one deterministic Agent session through every ordered pair: Place to Property, Place to Market, Property to Place, Property to Market, Market to Place, and Market to Property. It also proves direct-route and refresh-equivalent revalidation, signed-out redirects with exact return paths, root-scoped secure cookie issuance and expiry posture, Admin/MCP/generic-Agent denial, exact native workspace links, and no App Router `Link` import for the capability transitions.

`AGENT_WORKSPACE_CROSS_CAPABILITY_SESSION_CONTINUITY_TECHNICALLY_CERTIFIED` is a technical result only. Human production confirmation remains `READY_FOR_EXECUTIVE_CROSS_CAPABILITY_SESSION_RETEST` until the Executive signs in once, exercises all three capabilities, refreshes/direct-enters an authorized route, signs out, and confirms all private routes are protected again.
