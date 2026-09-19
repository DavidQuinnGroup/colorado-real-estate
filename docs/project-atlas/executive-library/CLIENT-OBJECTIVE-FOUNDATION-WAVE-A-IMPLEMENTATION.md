# Client Objective Foundation Wave A

## Scope

`ClientCaseObjective` remains the canonical Client pursuit record. This Wave adds a generic, owner-scoped Objective projection and the Client Command Center as the single ordinary Objective write surface. It uses the existing Prisma schema and canonical context-record service without a migration, backfill, or production mutation.

## Objective type contract

`lib/clientCaseContextSemanticRegistry.ts` owns the type metadata. New pursuits are limited to `BUY_PRIMARY_HOME` (Buy), `SELL_CURRENT_HOME` (Sell), and `INVESTMENT_ACQUISITION` (Invest). `FINANCIAL_STRATEGY` remains visible as a preserved legacy/current capability-context record but is not creatable through the generic pursuit contract. Unknown future values use a non-creatable `Objective` fallback label.

Objective identity is always the canonical record ID. The Agent interface differentiates same-type records using their available title and creation date; it does not expose a raw ID as the primary label.

## Summary and lifecycle contract

`listObjectiveSummary` validates ownership of the Client Case before returning bounded Objective fields. Current means `ACTIVE`; historical means `COMPLETED` or `ARCHIVED`. A zero current count is only rendered after the authoritative response returns. Loading and error states remain distinct from zero, and the Objective section fails independently of other Client Command Center sections.

The existing lifecycle contract remains unchanged: `ACTIVE` may transition to `COMPLETED` or `ARCHIVED`; completed and archived records are immutable. No Objective is hard-deleted or reactivated.

`createPursuitObjective` validates owner scope, the governed creatable type set, title, and client mutation key before delegating to the existing canonical persistence semantics. The idempotency key protects a repeated submission with the same mutation key without prohibiting an intentional second Objective of the same type. Properties, scenarios, transactions, and outputs are not required for creation.

## Client experience

The Client Command Center preserves its `goals` URL section identity and now displays current and historical Objective instances, an inline add form, and supported lifecycle controls. Buyer and Seller links carry only `clientCaseId`; Invest deliberately has no domain-launch action. Readiness remains an existing Client-level computed capability and is not persisted on an Objective.

Client Information now displays a read-only Objective summary and links to the Command Center. It no longer creates, archives, or otherwise manages Objective records. Buyer criteria remain available only when an existing active Buy Objective is present.

## Deferred relationships

Objective-to-Property, Objective-to-Transaction, and Objective-to-Output relationships are not implemented. The existing versioned Scenario-to-Objective relation is preserved unchanged. Financial Position, financing, Investor workspace behavior, saved-search linkage, public intake, provider activity, and external actions remain outside Wave A.

## Local visual evidence

The protected static fixture at `/agent/design-system/visual-certification/client-objectives` covers zero, one Buy, Sell/Buy/Invest, two Buy, current-plus-historical, and legacy Financial Strategy fixtures. It contains only synthetic static content and makes no API or data access.
