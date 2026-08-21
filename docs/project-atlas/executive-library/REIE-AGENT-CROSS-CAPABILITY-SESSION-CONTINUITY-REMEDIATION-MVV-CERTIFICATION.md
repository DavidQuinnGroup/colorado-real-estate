# REIE Agent Cross-Capability Session Continuity Remediation MVV Certification

## Defect And Cause

Human production evidence established that an authenticated Agent navigating from Market Preparation to Property Preparation could be sent to Agent login. Both exact routes already used the same signed, root-scoped Agent session and exact read-only capability classification. The protected-route middleware responses, however, permitted public cache treatment and the workspace links automatically prefetched middleware-protected destinations. That allowed an earlier signed-out redirect to interfere with a later authenticated App Router navigation.

## Remediation

The two exact Agent workflow links now disable speculative prefetching. The existing Agent login redirect and successful middleware responses for the two exact preparation routes now set `Cache-Control: private, no-store` and `x-middleware-cache: no-cache`. A real navigation therefore evaluates the existing session and exact destination capability at request time.

## Retained Boundaries

One signed Agent session remains subject-bound, signed, HttpOnly, Secure in production, SameSite=Lax, root-scoped, time-limited, and session-version/subject/status validated. It does not contain customer or property state. Market and Property remain separately enumerated exact read-only capabilities. No generic `/agent/*` grant, Admin or MCP access, credential change, identity redesign, database change, provider/source activity, CRM activity, Property admission change, or Market intelligence change is included.

`/admin/agent-briefing-preparation` remains `DEPRECATE_PROOF_ONLY`; it is excluded from Agent login returns, fallbacks, and workspace navigation.

## Verification

The deterministic continuity checker creates one locally deterministic Agent session and exercises the shared authorization function across Market and Property in both directions and as refresh-equivalent repeat requests. It proves signed-out redirects, exact return paths, protected response cache controls, root-scoped secure session attributes, proof-harness exclusion, and denial for generic Agent, Admin, and Admin API/operational surfaces. The existing return-path, identity, operating-shell, Property, Market, Admin safety, visibility, Module 10, public-runtime, and public-trust checks remain required validation gates.

Technical certification is `REIE_AGENT_CROSS_CAPABILITY_SESSION_CONTINUITY_REMEDIATION_CERTIFIED`. Human production closure remains `READY_FOR_EXECUTIVE_CROSS_CAPABILITY_LIVE_PROOF` until the Executive completes the cross-capability navigation, refresh, direct-entry, and sign-out tests.
