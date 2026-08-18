# REIE Agent Per-User Credential Identity And Role Allowlist MVV Certification

Status: `REIE_AGENT_PER_USER_CREDENTIAL_IDENTITY_AND_ROLE_ALLOWLIST_CERTIFIED`

## Contract

`REIE_AGENT_CREDENTIAL` authenticates one human agent only when paired with the non-email stable subject in `REIE_AGENT_SUBJECT` and an active `REIE_AGENT_SUBJECT_STATUS=ACTIVE` allowlist entry. The browser never supplies the subject or role. Missing, changed, or disabled configuration denies access.

## Authorization

The signed `reie_agent_session` contains only the stable subject, `PER_USER_CREDENTIAL` issuer, `AGENT` role, expiry, and session version. It is accepted only for the exact read-only `/admin/agent-briefing-preparation` classification. It cannot access generic `/admin`, administrative dashboards, APIs, mutation routes, CRM, customer data, providers, sources, configuration, or deployment operations.

Existing `reie_admin_session` issuance and administrative roles remain separate. `AGENT` is not an administrative role and cannot be issued by the administrative login path.

## Future Identity Provider Seam

Role resolution accepts a verified identity issuer and stable internal subject separately. A future Google Workspace/OIDC or other verified issuer must establish the same internal subject before this resolver is used; authorization consumers remain subject-and-role based. OAuth is not implemented by this MVV.

## Provisioning Gate

No real credential was created, read, printed, or committed. Executive HQ must provision a unique high-entropy value for `REIE_AGENT_CREDENTIAL`, a non-email opaque identifier for `REIE_AGENT_SUBJECT`, `REIE_AGENT_SUBJECT_STATUS=ACTIVE`, and optionally `REIE_AGENT_SESSION_VERSION=1` in the protected production environment. The value must be assigned to one human only and must not equal the administrative credential.

After provisioning, authorize a separate non-mutating protected-route verification. Disable access by setting `REIE_AGENT_SUBJECT_STATUS=DISABLED` or rotating the credential/session version; no database or schema change is required.

## Non-Authorization

This certification does not authorize Agent Conversation Preparation activation, customer or public visibility, customer accounts, CRM, persistence, providers, source activation, multi-agent provisioning, Google/OAuth, deployment, or production verification.
