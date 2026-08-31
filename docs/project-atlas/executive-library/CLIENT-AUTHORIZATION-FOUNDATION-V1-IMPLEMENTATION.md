# Client Authorization Foundation V1

## State

`CLIENT_AUTHORIZATION_FOUNDATION_V1_IMPLEMENTED_PENDING_PRODUCTION_SYNTHETIC_CERTIFICATION`

## Implemented Boundary

- A versioned `ClientAuthorizationProfile` registry supports explicit lifecycle state and rejects mutation of any version that has been used by an authorization.
- The only active Foundation V1 authorization profile is `ATLAS_SYNTHETIC_AUTHORIZATION_CERTIFICATION_V1`. It permits only a synthetic information disclosure with synthetic recipient and non-sensitive data; it has no external action.
- Owner-scoped `ClientAuthorization`, exact principal associations, immutable normalized snapshots, deterministic SHA-256 fingerprints, lifecycle state, expiration, revocation, supersession, and authorization-use audit are additive persistence primitives.
- The resolver is profile-first and reason-coded. `PROPERTY_MANAGER_RENT_ESTIMATE_V1` and Buyer Under Contract low-risk decision history resolve to `PROFILE_DOES_NOT_REQUIRE_CLIENT_AUTHORIZATION`; they do not need an authorization row.
- Material scope changes require a successor. Snapshots are append-only, used profile versions are immutable, and active authorization material terms cannot be silently rewritten.
- The Agent-only workspace shows synthetic authorization profile, scope, principal, capture method, assurance, lifecycle, predecessor/successor history, revocation, and resolver result. It does not expose a client-facing route, confirmation, capability, or session.
- The authorization resolver does not perform an external action and does not create EvidenceAdmission, ProfessionalInput, TransactionDecision, brokerage-compliance state, document release, provider request, or wire/funds action.

## Explicitly Inactive

- Real client authorization collection, Client Portal, client email, secure-link confirmation, e-signature, Secure Document, document release, external financial-information release, provider forms, mortgage/title/insurance release, high-consequence Buyer Under Contract action, and wire/closing-funds workflows.
- No new sensitive real-world authorization profile is active. `PROPERTY_MANAGER_RENT_ESTIMATE_V1` remains a separate property-only external-request profile with `NOT_REQUIRED_BY_PROFILE`.
- DQG transaction archive policy remains unchanged: David Quinn Group coverage of all transaction documents, indefinite retention, additive relationship to brokerage files, and inactive secure-document runtime. Archive retention is not disclosure authority.

## Required Production Certification

Use only synthetic principals, synthetic recipient, and synthetic non-sensitive data to prove exact-match resolution, scope denial, successor history, immutability, revocation, expiration, time-of-use denial, owner scope, secret-class rejection, and no external action. Do not create any real client authorization or contact any client or professional.

## Deferred Gates

- `CLIENT_AUTHORIZATION_SECURE_CLIENT_CONFIRMATION_V1`
- Shared provider/financial-release profile reconciliation
- `CLIENT_AUTHORIZATION_DOCUMENT_RELEASE_PROFILE_RECONCILIATION`
- `CLIENT_AUTHORIZATION_RETENTION_MAPPING`
- `SECURE_DOCUMENT_STORAGE_AND_SCANNER_CONFIGURATION_V1`
- Buyer Under Contract high-assurance client-decision workflow
