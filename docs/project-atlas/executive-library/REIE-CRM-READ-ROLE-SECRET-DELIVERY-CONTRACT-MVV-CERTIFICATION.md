# PROJECT ATLAS(TM) - CRM Read-Role Secret Delivery Contract MVV Certification

## Scope

This MVV certifies a pure, deterministic, non-secret planning contract for the future delivery of one dedicated CRM read-only database role credential. It validates supplied metadata only.

It does not generate, retrieve, store, inspect, write, display, copy, or log a credential. It does not access macOS Keychain, environment values, shell commands, a database, SQL, Prisma, CRM, providers, routes, workers, queues, or communications.

## Certified future envelope

- The only secret purpose is `DEDICATED_CRM_DB_READ_ONLY_ROLE_CREDENTIAL`.
- The only structurally acceptable storage class is `MACOS_KEYCHAIN_OPERATOR_LOCAL`; the contract does not access it.
- Credential creation is a separate operator/platform action outside ChatGPT/Codex.
- Delivery is modeled only as direct approved-store-to-process-environment transfer for a foreground, one-shot Primary macOS process that disconnects and exits.
- Secondary Codex Terminal and uncontrolled destinations fail closed.
- The administrative provisioning session is structurally separate from the read-role credential and cannot be reused as it.
- Handling assertions prohibit prompt, command-argument, repository, clipboard, echo, log, and temp-file exposure.
- Target, role, canonical revision, Safe Access Plan fingerprint, delivery-plan fingerprint, expiry, and a future one-use authority are bound deterministically.

## Non-authorization posture

Every result preserves:

- `SAFE_ACCESS_PATH_NOT_YET_ESTABLISHED`
- `AGGREGATE_AUDIT_NOT_AUTHORIZED`
- `LIVE_PROOF_NOT_AUTHORIZED`
- `WRITE_CREDENTIAL_SEPARATE_AND_NOT_IN_SCOPE`
- `NO_PROVISIONING_AUTHORIZATION`

This contract never returns secret stored/retrieved, credential available, safe access established, provisioning authorized, audit authorized, or live proof authorized.

## Validation

The dedicated checker covers an approved structural plan, target and authority gates, rejected storage/delivery/destination/process/handling cases, admin/read-role separation, secret-purpose exclusivity, exact binding, deterministic fingerprints, and static absence of secret-store, environment, shell, database, network, CRM, provider, route, worker, queue, and communication runtime behavior.

## Final classification

`CRM_READ_ROLE_SECRET_DELIVERY_CONTRACT_MVV_IMPLEMENTED_AND_LOCALLY_CERTIFIED` is permitted only after the dedicated checker, canonical CRM safety checks, TypeScript, static safety, diff, and exact three-file scope checks pass.

## Next gate

`READY_FOR_CRM_READ_ROLE_SECRET_DELIVERY_PRIMARY_CANONICAL_INTEGRATION_REVIEW`.

Even after canonical integration, no password exists, no Keychain entry exists, no role is provisioned, safe access is not established, target environment remains an Executive decision, aggregate audit remains unauthorized, and live CRM proof remains unauthorized.
