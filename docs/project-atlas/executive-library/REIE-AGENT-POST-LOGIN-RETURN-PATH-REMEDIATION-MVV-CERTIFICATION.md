# REIE Agent Post-Login Return Path Remediation MVV Certification

## Defect And Cause

Human production evidence established that a valid Agent login could land on the deprecated synthetic proof route, `/admin/agent-briefing-preparation`. The shared Agent return-path resolver both admitted that Admin path and used it as the fallback destination.

## Remediation

`sanitizeAgentReturnPath` now admits only the two exact current Agent capabilities:

- `/agent/prepare/market`
- `/agent/prepare/property`

Every missing, malformed, encoded, external, Admin, deprecated-harness, or unknown value resolves to `/agent/prepare/market`. Query strings are not admitted for the current routes. The existing login page, login POST handler, middleware redirect builder, and logout route all use this resolver.

## Retained Boundaries

The synthetic `/admin/agent-briefing-preparation` route remains separately governed `DEPRECATE_PROOF_ONLY`; it is not deleted or reclassified. It cannot be an Agent login return value or Agent fallback. Agent session signing, credential validation, identity, route classification, Admin/MCP boundaries, Property intelligence, and Market intelligence remain unchanged.

## Verification

The deterministic return-path checker invokes the shared successful-login response helper used by the Agent login POST handler with a local deterministic credential configuration. It proves exact Property and Market returns, direct-login fallback, malformed and malicious input fallback, no external redirect, no proof-harness admission, and continued signed Agent-session issuance.

Technical certification is `REIE_AGENT_POST_LOGIN_RETURN_PATH_REMEDIATION_CERTIFIED`. Human production closure remains `READY_FOR_EXECUTIVE_AGENT_RETURN_PATH_LIVE_PROOF` until the Executive completes the three positive credential tests.
