# Seller Financial Estimated Scenario Policy V1 Certification

## Executive Result

`SELLER_FINANCIAL_ESTIMATED_SCENARIO_POLICY_V1_CERTIFIED`

Seller Financial V1 is a private Agent-only, owner-scoped estimated-scenario workflow. It stores immutable reviewed scenarios, results, and audit events. It does not create a final settlement statement, tax/lending/title conclusion, client delivery, CRM action, SecureDocument, OutputVersion, or PDF/OutputRender artifact.

## Runtime Target Reconciliation

The configured migration target and authenticated Vercel Production runtime are the same physical database: PostgreSQL `postgres`, server `2600:1f14:359d:9302:23e1:fe60:8ad2:3846/128:5432`, with 23 applied Prisma migrations. The migration target and runtime each exposed the same owner-scoped certification anchors before successor creation: one Seller Financial scenario, eleven EvidenceAdmissions, and nine ProfessionalInputs.

The earlier zero-history observation was an Agent UI history-state defect: the initial empty array rendered as an empty persisted history while the private request was still pending. The workspace now renders `Loading persisted scenario history` until the request resolves; a fresh production context showed loading first and then restored V1 and V2 without a false empty state. It was not a database target, environment-variable, migration, owner-scope, API-filter, or deployment-assignment mismatch. No Vercel environment variable was changed and no database data was copied.

## Calculation Contract

`SELLER_FINANCIAL_ESTIMATED_SCENARIO_CALCULATION_V1` persists money in integer cents and net percentage in basis points. Required unknown sale-price or payoff input produces `INCOMPLETE_ESTIMATE`; an explicit zero remains a value. V1 includes only explicit admitted input categories and always labels the result as estimated.

Base fixture arithmetic: `$650,000.55 - $200,000.25 - $26,551.61 = $423,448.69`.

## Authenticated Fixture Proof

All persisted financial data is deterministic `ATLAS CERTIFICATION` data.

| Version | Sale price | Payoff | Seller costs | Estimated result | Historical |
|---|---:|---:|---:|---:|---|
| V1 | $650,000.55 | $200,000.25 | $26,551.61 | $423,448.69 | Preserved |
| V2 | $660,000.55 | $200,000.25 | $26,551.61 | $433,448.69 | Separate successor |

V2 supersedes V1 through the immutable scenario relation. It changes only the sale-price assumption and produces the expected `$10,000.00` result delta. A new authenticated context restored both rows. Replaying V2 produced no third scenario. A direct attempted V1 result update was rejected by the append-only database trigger; V1 input and result fingerprints were unchanged after the rejected attempt.

## Source and Boundary Status

| Concern | Result |
|---|---|
| ProfessionalInput binding | Exact-reference support implemented; V1 fixture used an explicit Agent estimate |
| Expired/conflicted payoff | Current professional source is rejected when expired or superseded; conflict selection is not automatic |
| Owner scope / IDOR | Service queries require `ownerAgentSubject`; UUID alone is insufficient |
| Unauthenticated access | Production private gate returned `401` without session |
| Public exposure | No public Seller Financial route references found |
| Client portal / CRM / SecureDocument | Not activated or mutated |
| Output/PDF | Not mutated; downstream integration remains additive-readiness work |

## Validation

Passed: Seller Financial checker; Evidence Admission checker; Professional Input checker; Output Persistence checker; Prisma validate; migration status; typecheck; lint with existing warnings only; production build with existing PDF dynamic-dependency warning; `git diff --check`; authenticated production V1/V2/history smoke.

## Next Gates

Primary: `SELLER_FINANCIAL_OUTPUT_INTEGRATION_V1` only after an additive OutputDependency/EvidenceSnapshot profile is admitted.

Secondary: `MALWARE_SCANNER_PROVIDER_SECURITY_DUE_DILIGENCE`.

## Certification Detail

AUTHENTICATED_AGENT_WORKFLOW: PASS  
POLICY_CONFORMANCE: PASS  
BASE_SCENARIO: PASS  
SUCCESSOR_SCENARIO: PASS  
V1_HISTORY_PRESERVED: PASS  
V2_HISTORY_RESTORED: PASS  
CALCULATION_CONTRACT: PASS  
INDEPENDENT_ARITHMETIC: PASS  
SOURCE_QUALIFICATION: PASS  
PAYOFF_CURRENTNESS: PASS  
UNKNOWN_ZERO_SEMANTICS: PASS  
SCENARIO_VERSIONING: PASS  
RESULT_VERSIONING: PASS  
PROFESSIONAL_INPUT_BINDING: PASS  
EXPIRATION: PASS  
CONFLICT_HANDLING: PASS  
IMMUTABILITY: PASS  
IDEMPOTENCY: PASS  
OWNER_SCOPE: PASS  
IDOR: PASS  
PUBLIC_ACCESS: PASS  
CLIENT_PORTAL: NOT_ACTIVATED  
SECURE_DOCUMENT_DEPENDENCY: NOT_REQUIRED  
OUTPUT_INTEGRATION_READINESS: ADDITIVE_DEPENDENCY_KIND_REQUIRED  
PDF_OUTPUTRENDER: NOT_MUTATED
