# Seller Presentation Financial Module Adapter Certification

**Certification token:** `SELLER_PRESENTATION_FINANCIAL_MODULE_ADAPTER_CERTIFIED`

**Certified scope:** a reviewed Seller Financial semantic output can be embedded as an
immutable, owner-scoped Seller Presentation financial module. The adapter preserves the
reviewed calculation, qualifications, unknown/not-included states, limitations, evidence
snapshot, and exact OutputVersion dependency. It does not recalculate financials.

## Implemented boundary

- Adapter: `lib/sellerPresentationFinancialModuleAdapter.ts`
- Owner-scoped persistence: `lib/outputPersistenceFoundation.ts`
- Agent workflow: `components/agent/SellerDecisionBriefCompositionPreview.tsx`
- Focused contract check: `scripts/checkSellerPresentationFinancialModuleAdapter.ts`
- Product: `SELLER_PRESENTATION` / `SELLER`
- Module contract: `SELLER_PRESENTATION_FINANCIAL_MODULE_ADAPTER_V1`

The persistence path accepts only an owner-scoped, `AGENT_REVIEWED` Seller Financial
OutputVersion with the expected semantic profile. It creates a Seller Presentation
OutputVersion with one `OutputVersion:<id>` fact dependency, copies only the reviewed
evidence snapshot, and uses a source-output-specific idempotency key.

## Authorized deterministic runtime evidence

| Presentation version | Reviewed financial source | Estimated net proceeds | Presentation fingerprint |
| --- | --- | ---: | --- |
| `#5` | OutputVersion `#3` | `$423,448.69` | `6f0b4bf23b588ff6b4141355a885248f3b41a6fd2b7e6cca6ce12cc2db87d5a3` |
| `#6` | OutputVersion `#4` | `$433,448.69` | `343905a4792fb4e2b105d311ff47ddc3c2360031c3f35582c9340a3861358fbe` |

The semantic difference is exactly `1,000,000` cents, or `$10,000.00`. Each persisted
version has a distinct reviewed evidence snapshot, exactly one dependency on its source
financial OutputVersion, one review, one decision, and one persistence checkpoint.

## Runtime verification

- The authenticated production Agent UI persisted only the two explicitly authorized
  deterministic presentation modules.
- A fresh authenticated browser context restored both records in durable history as `#5`
  and `#6` with their respective financial source outputs.
- The authorized replay of Presentation B returned the existing `#6`; the target count
  remained two and no `#7` was created.
- An unauthenticated production request to `/api/agent/outputs` returned `401`.
- No-op update attempts against Presentation A, its evidence snapshot, and its dependency
  were each rejected by the append-only database triggers. Immediate readback proved all
  three records unchanged.

## Deployment and validation

- Implementation commit: `a9fbbfe0e3a1652be0dfe21259dd5030c4313dbf`
- Corrective commit: `99cbcfb5534db3786ca835d37aac85a3eea0cbac`
- The initial implementation deployment rejected the write before create because an
  effective-as-of date was assembled from a timestamp incorrectly. Its transaction rolled
  back and created no OutputVersion.
- The corrective deployment normalized the effective-as-of date and reached production
  readiness before either authorized record was persisted.
- Passed before runtime certification:
  - `npm run check:seller-presentation-financial-module-adapter`
  - `npm run check:seller-financial-output-integration`
  - `npm run check:output-persistence-foundation`
  - `npm run check:evidence-admission-foundation`
  - `npm run check:professional-input-foundation`
  - `npm run typecheck`
  - `npm run lint`
  - `npm run build`
  - `git diff --check`

## Protected boundaries retained

No Seller Financial scenario or result changed. No Evidence Admission, Professional Input,
Secure Document, client, CRM, MLS, Client Portal, OutputRender, PDF, provider, or external
party mutation occurred. This certification does not authorize any of those operations.

## Next authorized workstream

`BUYER_DECISION_BRIEF_FOUNDATION_V1` may begin under the existing multi-workstream package.
The Professional External Request workstream remains gated; no external send is authorized
until its separate certification gate and explicit approval.
