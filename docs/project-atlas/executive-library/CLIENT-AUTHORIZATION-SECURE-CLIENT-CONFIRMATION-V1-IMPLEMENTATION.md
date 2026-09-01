# PROJECT ATLAS - Client Authorization Secure Client Confirmation V1

## Scope

`CLIENT_AUTHORIZATION_SECURE_CLIENT_CONFIRMATION_V1` extends the existing Client Authorization Foundation with a client-confirmed, purpose-bound flow. It does not create a universal consent wall, a client portal, a delivery channel, an e-signature workflow, a document release, a transaction action, or a real authorization profile.

The only profile introduced by this package is `SYNTHETIC_CLIENT_AUTHORIZATION_CONFIRMATION_V1` version `1.0.0`. Its lifecycle is `SYNTHETIC_CERTIFICATION_ONLY`, its action is `SYNTHETIC_AUTHORIZED_ACTION_V1`, and its allowed recipient and data scope are synthetic and inert. The service rejects any other scope at draft creation. This profile cannot be used to contact a real client or recipient, invoke a network action, release a document, or mutate a transaction.

Foundation certification plus profile definition does not equal profile activation. A real profile must have its own governed definition, review, activation decision, minimum-necessary scope, and explicit Executive authorization.

## Request And Evidence

An Agent creates a draft with versioned profile semantics and a SHA-256 fingerprint of normalized material scope: profile/version, purpose, action, recipient, data classes, principals, property/transaction context, validity, client language, and limitations. Presentation implementation details are not fingerprinted.

The request moves from `DRAFT` to `PENDING_CONFIRMATION` only through prepare/freeze. A prepared request is not editable. A material change requires a successor request and a new decision; the predecessor remains historical and its outstanding capability/session is revoked.

Client confirmation creates exactly one append-only `ClientAuthorizationConfirmationEvidence` record. It stores the exact request fingerprint, profile/version, immutable client-visible snapshot, decision, timestamp, and safe capability/session references. It never stores the raw bearer capability.

## Capability And Session

The Agent can issue one active confirmation capability for a prepared request. The opaque 256-bit secret is returned only at issuance time, hashed with SHA-256 at rest, purpose-bound to `CLIENT_AUTHORIZATION_CONFIRMATION_V1`, authorization-bound, seven-day limited, and revocable. A new issuance revokes a prior active capability for the same request.

The public access route exchanges the bearer capability once for a 30-minute HttpOnly, Secure-in-production, SameSite=Strict scoped session cookie at `/client-authorization`, then redirects to a token-free confirmation route. The routes use no-store, no-referrer, and noindex protections. GET cannot decide; a decision requires same-origin POST plus a session-bound CSRF token.

Possession of the secure capability is confirmation evidence, not high-assurance client identity verification. Future client portal, email/SMS OTP, or another identity factor can compose with this evidence without rewriting it.

## Decision And Resolver

Confirm changes the exact frozen request to `ACTIVE` with `CLIENT_CONFIRMED` assurance. Decline changes it to `DECLINED` and cannot unlock a downstream action. Opening a link has no decision effect. Replayed decisions return the immutable existing evidence rather than creating another record.

The existing time-of-use resolver continues to resolve authorization only for the exact profile/version, action, purpose, recipient, data subset, property/transaction context, validity, principal requirement, and assurance. It denies draft, pending, declined, revoked, expired, superseded, and consumed records. One-time synthetic consumption is claimed atomically and produces the existing `ClientAuthorizationUse` record; an identical retry uses its idempotency key and a different subsequent action is denied.

## Record Boundaries And Deferrals

Authorization drafts are REIE/DQG internal working records. Capability/session metadata are internal security records. Confirmation evidence is client authorization evidence. Whether a particular completed artifact is separately required for a Compass transaction file or DQG transaction archive is a profile-specific record-classification decision; this package performs no automatic export or classification.

Deferred: real client delivery, SMS, Client Portal, MFA/strong identity, e-signature, receipt PDF, document release, real Professional External Request client-authorization profile, and high-consequence Buyer Under Contract profiles.
