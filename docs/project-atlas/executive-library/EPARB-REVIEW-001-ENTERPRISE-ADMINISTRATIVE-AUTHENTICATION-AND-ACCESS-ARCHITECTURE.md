# PROJECT ATLAS(tm) - EPARB Review 1 Enterprise Administrative Authentication and Access Architecture(tm)

Status: `EPARB_REVIEW_001_COMPLETE_IMPLEMENTATION_NOT_AUTHORIZED`

Date: July 28, 2026

Governed identifier:

`EPARB-REVIEW-001_ENTERPRISE_ADMINISTRATIVE_AUTHENTICATION_AND_ACCESS_ARCHITECTURE_REVIEW`

## 1. Executive Summary

EPARB Review 1 defines the recommended long-term enterprise architecture for administrative authentication and access across PROJECT ATLAS(tm).

The review was prompted by EOI Sprint 3 production certification being blocked: the protected Executive Operations Dashboard deployed successfully, unauthenticated production access failed closed with `401`, but no usable authenticated human browser session was available to review the protected dashboard in production.

Current repository evidence shows a simple shared admin-key model. The middleware accepts `x-admin-key`, `Authorization: Bearer`, and a `reie_admin_key` cookie for `/admin/:path*` and `/api/admin/:path*`. Many admin APIs also reuse route-local authorization helpers. This model is effective for machine/API checks and basic fail-closed protection, but it is not the correct long-term human administrator browser model.

Recommended enterprise architecture:

`MODEL_E_REPOSITORY_SUPPORTED_HYBRID`

The target model is:

- human browser sessions for protected administrative pages
- scoped API keys or bearer credentials for machine/API access
- authentication and authorization as separate layers
- role-based permissions for repository, executive, operations, broker-review, service-account, and certification-review responsibilities
- fail-closed production behavior
- auditable session lifecycle
- credential rotation and restricted machine scopes
- migration that preserves current protected behavior until implementation is separately authorized

No authentication implementation is authorized. No authorization implementation is authorized. No middleware change, credential change, session implementation, EOI Sprint 3 remediation, EOI Sprint 3 certification, deployment, database work, telemetry, AI, GIS, provider activation, production mutation, or customer-facing change is authorized by this review.

## 2. Current Authentication Inventory

| Method | Evidence | Current Use | Intended Long-Term Use |
|---|---|---|---|
| `x-admin-key` | `middleware.ts`; `app/api/admin/repository/auth.ts`; many safety scripts | Admin/API access with configured key | Machine/API access only |
| `Authorization: Bearer <key>` | `middleware.ts`; `app/api/admin/repository/auth.ts` | Admin/API access with configured key | Machine/API and service access |
| `reie_admin_key` cookie | `middleware.ts`; `app/api/admin/repository/auth.ts` | Browser-compatible reuse of same admin key | Replace with real human session model |
| Query-string admin key | No current canonical middleware/helper evidence | Not supported as canonical admin access | Reject; URL secrets leak |
| Human production admin session | Not implemented as repository-wide identity model | Missing; caused EOI Sprint 3 evidence blocker | Required for protected browser pages |
| External service bearer tokens | `lib/mls/mlsGridClient.ts`; `app/api/mls/status/route.ts`; `lib/ai/generateSellerMessage.ts` | Service/provider contexts | Keep separate from admin identity |
| Development no-key fallback | `middleware.ts`; `app/api/admin/repository/auth.ts` | Non-production may pass if no key configured | Local development only; production fails closed |

## 3. Current Authorization Inventory

Current authorization is coarse:

- configured admin key grants access to protected admin middleware scope
- route-local helper duplicates the same key check for many admin APIs
- no repository-wide human identity object is present
- no canonical role-to-route matrix is enforced at runtime
- CAO contracts define operational roles such as `OPERATIONS_LEAD` and `BROKER_REVIEW`
- EOI contracts define owners such as `EXECUTIVE_REVIEW` and `GOVERNANCE_REVIEW`
- EPARB now defines cross-program architecture authority but does not authorize runtime access

Recommended canonical roles:

- `REPOSITORY_ADMIN`
- `EXECUTIVE_REVIEWER`
- `OPERATIONS_LEAD`
- `BROKER_REVIEW`
- `SERVICE_ACCOUNT`
- `CERTIFICATION_REVIEWER`

Authorization should be implemented as a separate layer after authentication. Authentication proves identity; authorization determines allowed route, API, action, mutation, evidence, and certification scope.

## 4. Protected Surface Inventory

| Surface | Current Protection | Recommended Identity Layer |
|---|---|---|
| `/admin` | Middleware matcher | Human session |
| `/admin/repository` | Middleware matcher | Human session |
| `/admin/repository/executive-operations-dashboard` | Middleware matcher | Human session |
| `/api/admin/:path*` | Middleware plus many route-local checks | Scoped machine/API credential by default; human session where browser action requires it |
| `/api/admin/toggle-access` | Middleware plus route-local check; mutates user access | Human session plus explicit role/action authorization |
| `/api/process-alerts` | Route-local key check outside `/api/admin` matcher | Machine credential |
| `/api/mls/status`, `/api/mls/sync`, `/api/mls/retry` | Route-local key checks | Machine credential and explicit operational authorization |
| `/api/search` | Public route with optional admin-key context | Separate public/search governance review |

## 5. Human vs Machine Identity Analysis

Human administrators need:

- browser-native login/session flow
- session expiration
- renewal
- revocation
- visible authentication state
- route-aware authorization
- audit evidence for certification
- no secret copy/paste into browser URLs or visible UI

Machine/API clients need:

- scoped credentials
- rotation
- non-browser header use
- endpoint restrictions
- read-only certification modes
- mutation-specific authorization gates
- log redaction

The same raw administrative key should not remain the long-term identity for both humans and machines.

## 6. EOI Sprint 3 Certification Failure Analysis

EOI Sprint 3 did not fail because the dashboard implementation was known defective. It failed because authenticated production browser evidence was unavailable.

Observed certification state:

- deployment mapped to implementation commit `88e3a55c427f7bf0d7707a3167cb6d0ebde0d582`
- unauthenticated and dummy-header checks returned `401`
- public routes did not expose operational intelligence
- local protected dashboard review passed with throwaway local admin keys
- production authenticated dashboard render could not be observed through a usable human browser session

Root architectural issue:

The current repository has machine-friendly admin-key authentication, but it does not provide a governed human administrator session architecture suitable for protected browser page certification.

## 7. Security Findings

Findings:

- API keys are appropriate for machine/API access when scoped, rotated, and redacted.
- API keys are poor human browser identity because they are hard to audit per person and easy to mishandle.
- Query-string secrets should remain rejected.
- Cookie reuse of the raw admin key is browser-compatible but not a sufficient enterprise session model.
- Current production behavior fails closed when keys are absent or incorrect.
- Route-local helper duplication increases drift risk.
- Mutation-bearing admin APIs need stronger action-level authorization than read-only protected dashboards.

## 8. Candidate Architecture Models

### MODEL A - API keys for pages and APIs

Not recommended.

Strengths: simple, already present, good for scripts.

Weaknesses: weak human usability, weak per-person auditability, awkward browser certification, coarse revocation, encourages key handling in human workflows.

### MODEL B - Human browser sessions for pages; API keys for machine/API access

Recommended.

Strengths: clean human/machine separation, practical migration, preserves current machine checks, improves browser certification.

Weaknesses: requires new session lifecycle and role mapping.

### MODEL C - Unified identity provider and role-based access for pages and APIs

Conditionally acceptable.

Strengths: strongest long-term identity/audit model.

Weaknesses: heavier dependency, higher implementation and governance complexity, not the minimum EOI Sprint 3 remediation path.

### MODEL D - Existing authentication framework extension

Deferred.

Strengths: reuses middleware and admin helper concepts.

Weaknesses: does not solve human sessions unless extended into Model B/C behavior.

### MODEL E - Repository-supported hybrid

Recommended.

Model E combines Model B with repository-native role contracts, protected-surface classification, future IDP compatibility, and a migration path that preserves current protected behavior while separating human page access from machine API credentials.

## 9. Weighted Comparison

Weights:

| Criterion | Weight | Rationale |
|---|---:|---|
| Security | 15 | Admin access protects sensitive operational and governance surfaces. |
| Human administrator usability | 10 | Protected browser evidence and daily admin work require usable sessions. |
| Machine-client suitability | 8 | Existing scripts and APIs need stable non-browser access. |
| Least privilege | 10 | Role/action boundaries must replace coarse key access over time. |
| Auditability | 10 | Certification and operations need evidence of who accessed what. |
| Architecture reuse | 8 | The migration should preserve current protected behavior. |
| Migration safety | 8 | Admin access cannot regress during transition. |
| Operational simplicity | 7 | The model must be operable by a small team. |
| Production risk | 9 | Access changes can block certification or expose protected surfaces. |
| Long-term enterprise value | 10 | EPARB must optimize platform architecture, not one sprint. |
| Reversibility | 3 | Changes should remain containable. |
| Implementation effort | 2 | Effort matters, but should not dominate security architecture. |

Scores are documented in `lib/eparb/authenticationAccessReviewContract.ts`. Model E scores highest because it separates human and machine identity while preserving a safe migration path.

## 10. Recommended Enterprise Architecture

Adopt Model E:

Human protected pages:

- authenticated browser sessions
- role-aware page access
- explicit expiration and renewal
- revocation
- audit trail
- protected route certification support

Machine/protected APIs:

- scoped API keys or bearer credentials
- route-specific and action-specific permission checks
- rotation and revocation
- redacted logs
- GET-only certification mode where applicable

Shared rules:

- authentication and authorization remain separate
- production fails closed
- no query-string secrets
- no public fallback
- no protected intelligence exposed through public routes
- no mutation path without explicit authorization

## 11. Role and Permission Model

Initial role model:

| Role | Purpose | Permission Examples |
|---|---|---|
| `REPOSITORY_ADMIN` | Repository governance and repository studio | View repository objects, relationships, coverage, lineage |
| `EXECUTIVE_REVIEWER` | Executive workspace and EOI review | View EOI KPI summaries and dashboard metadata |
| `OPERATIONS_LEAD` | CAO operational review | View CRM queues, SLA readiness, operational review metadata |
| `BROKER_REVIEW` | Broker/compliance oversight | Review closure, escalation, and disclosure-sensitive evidence |
| `SERVICE_ACCOUNT` | Machine/API access | Perform authorized GET checks and separately authorized scripts |
| `CERTIFICATION_REVIEWER` | Non-mutating production certification | Collect protected production evidence without mutation |

Future implementation should map each protected route to roles and each mutation-bearing route to explicit action permissions.

## 12. Session Architecture

Recommended human session properties:

- server-issued session
- secure HTTP-only cookie
- same-site protections
- expiration
- renewal window
- revocation path
- role claims or server-side role lookup
- audit events for login, renewal, revocation, failed access, and privileged action attempts
- no raw admin key stored as the session value

No session implementation is authorized by this review.

## 13. API Credential Architecture

Recommended machine credential properties:

- scoped to API classes or route groups
- separate read-only and mutation-capable credentials
- rotation schedule
- explicit revocation
- no browser-page dependency
- redaction in logs and documentation
- production certification GET mode
- no query-string transport

Existing `x-admin-key` and bearer behavior should be preserved until a separately authorized migration narrows or replaces it.

## 14. Migration Strategy

Recommended migration path:

1. Preserve current fail-closed middleware and route-local checks.
2. Define canonical protected-surface classification and role-to-route matrix.
3. Implement human admin session support for protected browser pages only, if separately authorized.
4. Keep machine/API credentials for `/api/admin` and operational scripts during transition.
5. Add audit and revocation evidence.
6. Move mutation-bearing admin actions to role/action authorization.
7. Certify EOI Sprint 3 dashboard with a human admin session or sanitized authenticated operator evidence.
8. Gradually reduce raw admin-key browser use.

## 15. Production Certification Strategy

Future protected production certification should support:

- non-mutating authenticated browser session review
- sanitized role and session evidence
- unauthenticated `401` verification
- machine/API GET checks with scoped read-only credentials
- no screenshots or payloads containing secrets
- no mutation-bearing workflow submission
- explicit route, status, identity class, role, and evidence classification

## 16. Risks

- Introducing sessions without route/action authorization could create a new broad admin identity.
- Overcorrecting into a full IDP immediately could delay EOI certification remediation.
- Keeping API keys for browser pages could preserve the current certification friction.
- Mutation-bearing admin APIs require stricter review than read-only pages.
- Credential rotation and auditability need operational ownership.

## 17. Deferred Work

Deferred until separate authorization:

- authentication implementation
- authorization implementation
- session implementation
- middleware changes
- credential rotation
- admin route remediation
- EOI Sprint 3 remediation or certification
- dashboard framework changes
- database schema or persistence changes
- production deployment

## 18. Authorization Boundaries

David retains final executive authorization.

No authentication implementation is authorized.

No authorization implementation is authorized.

No middleware modification is authorized.

No credential creation, rotation, or environment-variable change is authorized.

No EOI Sprint 3 remediation or certification is authorized.

No customer-facing requirement implementation is authorized.

No deployment, database work, telemetry, AI, GIS, provider activation, or production mutation is authorized.

## 19. Final EPARB Recommendation

EPARB Review 1 recommends Model E: a repository-supported hybrid architecture with human sessions for protected administrative browser pages and scoped API credentials for machine/API access.

Minimum safe implementation, if separately authorized:

`EPARB_ADMIN_AUTH_SESSION_FOUNDATION`

Objective:

Implement a human admin session layer for protected browser pages while preserving current machine/API admin-key behavior, adding role-to-route governance, and enabling non-mutating protected production certification without exposing raw keys to browser workflows.

This recommendation does not authorize implementation.

## 20. Requirements Traceability

The source document `PROJECT ATLAS REIE V 7.1 - ADJUSTMENTS & MODIFICATIONS` was reviewed through Google Drive read-only access:

- Document ID: `1jfTLWoRNuuQ0DhJZSjTWx96n72VLZGPqO371FCjbkBs`
- Modified time: `2026-07-26T12:29:10.522Z`
- Source reconciliation: `SOURCE_RECONCILED_GOOGLE_DOC_READ_ONLY`

The requirements register and traceability matrix created by this review are:

- `docs/project-atlas/executive-library/REIE-7.1-ADJUSTMENTS-AND-MODIFICATIONS-REQUIREMENTS-REGISTER.md`
- `docs/project-atlas/executive-library/REIE-7.1-ADJUSTMENTS-AND-MODIFICATIONS-TRACEABILITY-MATRIX.md`

Future strategic completion reviews for customer-experience or platform programs may not claim full completion without reconciling relevant open requirements in that register.

## 21. Controlled Administrative Authentication Implementation Addendum

Implementation authorization was later granted for:

`EPARB_REVIEW_001_CONTROLLED_ADMINISTRATIVE_AUTHENTICATION_AND_SESSION_FOUNDATION_IMPLEMENTATION`

Implementation record:

`docs/project-atlas/executive-library/EPARB-REVIEW-001-CONTROLLED-ADMINISTRATIVE-AUTHENTICATION-AND-SESSION-FOUNDATION-IMPLEMENTATION.md`

Implemented status:

`EPARB_REVIEW_001_CONTROLLED_ADMINISTRATIVE_AUTHENTICATION_AND_SESSION_FOUNDATION_IMPLEMENTED_DEPLOYMENT_NOT_AUTHORIZED`

The implementation follows `MODEL_E_REPOSITORY_SUPPORTED_HYBRID` by adding a signed human administrative browser-session foundation while preserving approved machine/API credential compatibility.

The implementation remains bounded:

- deployment is not authorized
- production certification is not authorized
- EOI Sprint 3 certification is not authorized
- production environment changes are not authorized
- production credential rotation is not authorized
- customer authentication changes are not authorized
- customer-facing workflow changes are not authorized
- broad RBAC expansion is not authorized
- database schema changes and migrations are not authorized
- telemetry, AI, GIS, provider activation, and production mutation are not authorized
