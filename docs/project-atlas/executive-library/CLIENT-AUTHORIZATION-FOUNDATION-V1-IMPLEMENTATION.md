# Client Authorization Foundation V1

## Executive Result

`CLIENT_AUTHORIZATION_FOUNDATION_V1: PRODUCTION_CERTIFIED_WITH_PROFILE_GATES`

Foundation V1 is a synthetic-only, profile-governed authorization substrate. It has no universal consent flag and activates no real-client profile, client-facing confirmation, email, document release, provider request, or protected transaction action.

## Policy and Persistence

- The only active Foundation V1 profile is `ATLAS_SYNTHETIC_AUTHORIZATION_CERTIFICATION_V1` version `1.0.0`. Its permitted scope is `SYNTHETIC_INFORMATION_DISCLOSURE` to `SYNTHETIC_CERTIFICATION_RECIPIENT` for `SYNTHETIC_NON_SENSITIVE_DATA` only.
- `ClientAuthorizationProfile`, `ClientAuthorization`, `ClientAuthorizationPrincipal`, `ClientAuthorizationSnapshot`, and `ClientAuthorizationUse` are additive schema primitives from migration `20260831110000_add_client_authorization_foundation`.
- Authorization terms are captured in an append-only normalized snapshot with a deterministic SHA-256 fingerprint. A used profile version and active material terms cannot be silently changed; material scope changes require a successor.
- Owner scope, explicit principal association, capture method, assurance, effective/expiration timestamps, revocation, supersession, reason-coded resolution, and idempotent time-of-use audit are persisted.
- Principal policy supports `SINGLE_REQUIRED_PRINCIPAL`, `ALL_REQUIRED_PRINCIPALS`, `ANY_ONE_AUTHORIZED_PRINCIPAL`, and `PROFILE_DEFINED_PRINCIPAL_SET`. The multi-principal policy modes have deterministic checker coverage; no multi-principal production fixture was required or created.

## Resolver and Separation Boundaries

- Resolver outcomes are fail-closed and reason-coded, including `PROFILE_DOES_NOT_REQUIRE_CLIENT_AUTHORIZATION`, `MISSING_REQUIRED_PRINCIPAL`, `SCOPE_MISMATCH`, `RECIPIENT_MISMATCH`, `DATA_CLASS_NOT_AUTHORIZED`, `ASSURANCE_INSUFFICIENT`, `EXPIRED`, `REVOKED`, `SUPERSEDED`, and `PROFILE_INACTIVE`.
- `PROPERTY_MANAGER_RENT_ESTIMATE_V1` and `BUYER_UNDER_CONTRACT_LOW_RISK_AGENT_RECORDED_DECISION` resolve as `NOT_REQUIRED_BY_PROFILE`; that is distinct from an authorization being present.
- The resolver performs no external action and creates no EvidenceAdmission, ProfessionalInput, TransactionDecision, client decision, contractual election, identity verification, brokerage approval, document release, provider request, or wire/funds action.
- Passwords, MFA codes, reusable or private tokens, banking credentials, card security codes, wire credentials, and payment-initiation secrets are rejected as unauthorized data classes.

## Production Synthetic Register

Synthetic profile: `ATLAS_SYNTHETIC_AUTHORIZATION_CERTIFICATION_V1` / `1.0.0` / `ACTIVE`.

| Record | ID | State | Evidence |
| --- | --- | --- | --- |
| Authorization A | `cmthuuis70002i2jjt5y9uj06` | `SUPERSEDED` | fingerprint `4af613340cf5853bd73593675a241bc033c34a4e359d75a74a3ec7839dca9418` |
| Authorization B | `cmthuuv9500011vfhlzwyc774` | `ACTIVE` | successor of A; fingerprint `994708fa24e095601825ee9e36c37386949b2636e648ef9df4be5505bebb4ffb` |
| Use for B | `cmthv3gf3000112wjqihi7vy5` | `AUTHORIZED` | exact scope, deterministic idempotency key, one persisted use |
| Revocation fixture C | `cmthv3l9s000312wjfqcnfy02` | `REVOKED` | distinct recipient and fingerprint `f9a944b4e60ef72c0b25ad2ba77928ac90cb17c9bbfdd8dc81dabc7c50a19569` |
| Use for C | `cmthv3uif000712wj3qv069ia` | `AUTHORIZED` before revocation | preserved history |

Production Agent workspace proof showed B as `AUTHORIZED`, C as `NOT_AUTHORIZED: REVOKED`, and A as `NOT_AUTHORIZED: SUPERSEDED`. Repeating B's deterministic use submission retained one use record. No real client record, real authorization, external delivery, EvidenceAdmission, ProfessionalInput, document, CRM, MLS, Client Portal, provider, or funds mutation occurred.

## Validation and Security

- Passed: `check:client-authorization-foundation`, `check:professional-external-request-foundation`, `check:buyer-under-contract-foundation`, Prisma validation/generation, typecheck, lint, build, and `git diff --check`.
- The client authorization checker proves exact-match authorization, owner-scoped query input, missing-principal denial, recipient and context mismatch denial, data-class denial, expiration, inactive-profile denial, profile-not-required behavior, assurance ordering, and each supported principal requirement mode.
- Production unauthenticated GET and POST to `/api/agent/client-authorizations` returned `401 Private access required.` with no mutation. Authenticated Agent workspace rendered the controlled synthetic boundary, scope, assurance, fingerprints, lifecycle, history, and resolver reasons.
- The Professional External Request foundation remains unchanged and continues to declare `PROPERTY_MANAGER_RENT_ESTIMATE_V1` as not requiring client authorization. Buyer Under Contract low-risk behavior remains unchanged; high-consequence actions remain independently policy-blocked.

## Active and Held Profiles

Active: `ATLAS_SYNTHETIC_AUTHORIZATION_CERTIFICATION_V1` only. It cannot authorize a real external action because its action, recipient class, and data class are all synthetic and non-sensitive, and no downstream executor is connected.

Held: secure client confirmation, Client Portal, e-signature, Secure Document, mortgage/title/insurance/financial-information release, document release, Buyer Under Contract high-assurance client decision, wire/closing funds, and authorization-retention mapping. These are profile/dependency gates, not failures of Foundation V1.

## DQG Archive Boundary

`DQG_TRANSACTION_ARCHIVE_POLICY_V1` remains unchanged: coverage is `ALL_TRANSACTION_DOCUMENTS`, retention is `INDEFINITE`, Secure Document runtime is inactive, and archive retention grants no external disclosure authority.

## Defect Repair

Production certification exposed a resolver-selection edge case when separate authorizations share a profile. The resolver now selects the exact action/context scope first, then reports recipient mismatch precisely and avoids allowing a revoked unrelated scope to shadow a matching active authorization. The correction is covered by the checker and requires no schema or data rewrite.

## Next Gate

Recommended Primary gate: `INVESTMENT_BREAKEVEN_ANALYSIS_V1`, subject to separate Executive authorization and confirmation that no unresolved security dependency changes its priority. Secondary gate: `NONE_PENDING_EXTERNAL_DEPENDENCY`.
