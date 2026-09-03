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

## Certification Defect Record

Production human Agent certification initially failed when the Agent selected `Create synthetic authorization`: the workspace displayed `Client authorizations are unavailable.` and no draft persisted. The authenticated profile/list path was healthy, but the draft mutation failed with Prisma `P2022` because the original secure-confirmation migration created `ClientAuthorizationSession` and `ClientAuthorizationConfirmationEvidence` without the nullable `clientAuthorizationPrincipalId` columns selected by the generated Prisma client.

Repair commit `94ccd475fb5896c5dfae324c92698da039b3b8e7` adds migration `20260904000000_repair_client_authorization_confirmation_principal_links`. It adds only those nullable columns, their `ON DELETE SET NULL` principal foreign keys, and lookup indexes. The focused checker now asserts that the schema and repair migration retain this contract. A production rollback-only draft creation proof succeeded after the repair, then deliberately aborted; a read-only query confirmed that no diagnostic authorization persisted. Human Agent positive-path certification remains pending and must not be reported as passed.

Before client-side confirmation, read-only certification found a separate scope-capture defect in the first human-created request: its internal row held `ATLAS_SYNTHETIC_PROPERTY_CERTIFICATION`, but the immutable snapshot and its fingerprint omitted that supplied property context. The pending record and unused capability remain historical defect evidence and must not be confirmed. The successor repair captures property and transaction context in both the frozen snapshot and draft idempotency fingerprint, and exposes the existing successor action for a `PENDING_CONFIRMATION` record so the prior capability is revoked atomically when the corrected draft is created.

Human Agent certification also found a shared interaction affordance defect: semantically clickable controls across Project Atlas did not consistently show a pointer cursor. The bounded repair adds a low-specificity global base rule for enabled links, buttons, button/link roles, summaries, and native click controls while preserving non-interactive containers, text entry, selectable text, explicit utility overrides, and disabled `not-allowed` behavior. `checkInteractiveCursorStyles.ts` guards that shared contract.

The next human certification attempt exposed an interaction-hierarchy defect: after a controlled secure link is issued, the raw bearer value is intentionally not recoverable after the issuing view is left, but the Agent workspace did not clearly distinguish that active, one-time capability from ordinary record information. The bounded repair introduces reusable Project Atlas action, status, current-record, historical-record, secure-link, and confirmation-surface styles. The issuing view now elevates `SECURE LINK READY`, provides the immediate secure-link action, and warns that leaving or refreshing ends safe display. A later workspace visit presents the active capability state and its limitation rather than a misleading reissue action. The already-issued successor capability remains untouched unless a separately authorized controlled recovery is performed.

Under `CONTROLLED_SUCCESSOR_CAPABILITY_RECOVERY_AUTHORIZATION`, the same Agent workspace can recover only an inaccessible, unexpired, unused active capability on the existing pending successor. The recovery action refuses any session, decision, downstream use, exchanged capability, expired capability, multiple active capabilities, or altered request. In one transaction it records revocation of the old capability and creates exactly one replacement with the same authorization and frozen fingerprint. The raw replacement bearer secret is returned only to the initiating authenticated Agent session and is not persisted, logged, or redisplayed after that view is left. This recovery control does not create an authorization or successor, change scope, perform confirmation, or invoke downstream action.

Positive-path confirmation exposed a resolver defect before any use was recorded: the client-confirmed successor had a future frozen `effectiveAt`, but the time-of-use resolver enforced expiration without denying pre-effective resolution. The bounded repair returns `NOT_EFFECTIVE` without persistence or consumption until the existing frozen effective time is reached. The Foundation checker covers the pre-effective denial and preserves the after-effective authorization path.

Human certification found that the completed external confirmation route stranded the client without a visible return path. The bounded navigation repair establishes public/external and Agent shell invariants: ordinary public pages retain the public shell and canonical home brand link, Agent pages retain `Workspace Home` and `Public Site`, and the secure client-authorization and professional-request route trees inherit a shared public-only external shell. Terminal completion states expose a primary `Return to David Quinn Group` action; unavailable bearer-link responses and the professional bootstrap fallback return only the same public home path. The navigation controls never carry capability, session, or bearer data, never expose Agent navigation on external surfaces, and are GET-only links under the existing no-store/no-referrer secure-route protections. `checkProjectAtlasNavigationInvariant.ts` protects this architecture.

Human certification then found that the public return destination did not visibly expose an Agent entry, forcing manual route entry to resume the authorized Agent-only certification sequence. The shared public navigation now keeps a persistent, secondary top-right control: signed-out visitors see `Agent Login` and use the existing `/agent/login` flow; a valid same-origin Agent session changes that exact control to `Agent Workspace` at `/agent`. `Search Homes` remains the primary consumer action, while secure client-authorization and professional-request external shells remain public-home-only and never expose Agent navigation, session, or bearer data. `checkAgentPrimaryNavigationEntry.ts` verifies the placement, state-driven destinations, and existing authentication redirects.

Post-effective certification found that the Agent workspace rendered the result of `Resolve exact scope` only after reloading authorization history. A private-access failure during that follow-up reload could overwrite an already-successful resolver result with `Private access required.`, leaving the human certification outcome ambiguous. The bounded repair preserves the returned resolver result and appends any history-refresh failure; a private-gate denial of the resolver POST itself remains a denial. This changes neither private access, Agent authentication, owner scope, resolver semantics, nor any authorization record. `checkClientAuthorizationInteractionHierarchy.ts` verifies the result-precedence contract.

## Final Certification Closure

`POST_EFFECTIVE_HUMAN_RETEST: PASS` on 2026-09-03. The Executive hard-refreshed the Agent Client Authorization workspace, selected the current synthetic authorization with fingerprint `edcadbc9036b...`, and selected `Resolve exact scope` exactly once. The expected and visible result were both `AUTHORIZED: AUTHORIZED`; no fallback history-refresh failure was displayed and no other authorization control was used. `HUMAN_RETEST_REQUIRED: NO`.

The fresh canonical record verification was completed by the Executive outside Codex using a read-only terminal verifier (`Prisma findUnique` and `findMany` only; exit code 0; temporary verifier removed). The verified authorization is `cmtj3iitr0001ooz8u5dle3pj`, profile `SYNTHETIC_CLIENT_AUTHORIZATION_CONFIRMATION_V1` version `1.0.0`, fingerprint `edcadbc9036bdf56b2756e7570577eda2454b3614f463b5b279eab4b7fd2abe3`, and state `ACTIVE`. It is effective, unexpired, unrevoked, unconsumed, has zero `ClientAuthorizationUse` records, and retains exact synthetic purpose, action, recipient, data scope, principal, and property context. Its immutable confirmation evidence is `CONFIRMED` and matches the request fingerprint. The predecessor remains historical; no successor exists.

Final focused security and regression checks passed: private access, owner identity, resolver positive and negative matrix, interaction-hierarchy result preservation, Agent navigation, typecheck, cache-isolated lint, production build, and `git diff --check`. The owner-identity checker was compiled to an isolated temporary output directory to avoid repository `dist` writes; lint used an isolated temporary cache. Known unrelated lint warnings and the pre-existing dynamic PDF renderer dependency warning remain non-blocking. No real client, professional, transaction, downstream, CRM, MLS, document, or Client Portal action occurred.

`FINAL_HUMAN_CERTIFICATION: PASS`. `CLIENT_AUTHORIZATION_SECURE_CLIENT_CONFIRMATION_V1: PRODUCTION_CERTIFIED_AND_CLOSED`. The prior temporary-verifier tooling blocker is resolved by the Executive external read-only evidence. The following gate is `CANONICAL_CLIENT_CASE_CONTEXT_FOUNDATION_V1`; it is not begun by this package.
