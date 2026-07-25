# PROJECT ATLAS(tm)

## Enterprise Knowledge Approval Policy(tm)

Status: `ACTIVE_INTERNAL_POLICY_FIXTURE`

Policy version: `EIP_1.0_SPRINT_5_ENTERPRISE_KNOWLEDGE_APPROVAL_SYSTEM_V1`

Implementation date: July 25, 2026

Policy source: `lib/eip/enterpriseKnowledgeApprovalSystem.ts`

---

## 1. Policy Purpose

The Enterprise Knowledge Approval Policy governs internal approval requests, executive review packets, approval decisions, audit history, and post-approval prohibitions.

The policy exists to prevent knowledge quality, readiness, automated recommendations, or internal proof completion from being mistaken for implementation authority, activation authority, or customer visibility.

---

## 2. Separation Rule

The following layers are distinct:

- knowledge quality;
- readiness;
- approval;
- authorization to implement;
- activation;
- customer visibility.

Approval is not activation.

Approval may define a next internal step. It may not create production persistence, runtime consumption, eligibility, public exposure, or customer-facing behavior.

---

## 3. Approval Types

Controlled approval types:

- `APPROVE_FOR_INTERNAL_PROOF`
- `APPROVE_FOR_INTERNAL_REVIEW`
- `APPROVE_FOR_PRODUCTION_INTERNAL_PERSISTENCE_REVIEW`
- `APPROVE_FOR_RELATIONSHIP_PROOF_REVIEW`
- `APPROVE_FOR_RUNTIME_INTEGRATION_DESIGN`
- `APPROVE_FOR_CUSTOMER_ACTIVATION_REVIEW`
- `APPROVE_FOR_REVIEW_ONLY`
- `APPROVE_EXCEPTION_REVIEW`
- `APPROVE_REMEDIATION`
- `APPROVE_RETIREMENT`
- `APPROVE_SUPERSESSION`

Every approval type requires a bounded scope and a specific requested next step.

---

## 4. Decision States

Controlled decision states:

- `DRAFT`
- `SUBMITTED`
- `UNDER_REVIEW`
- `EVIDENCE_REQUIRED`
- `DEFERRED`
- `CONDITIONALLY_APPROVED`
- `APPROVED_FOR_DEFINED_NEXT_STEP`
- `REJECTED`
- `REVOKED`
- `EXPIRED`
- `SUPERSEDED`
- `CLOSED_WITHOUT_ACTION`

Prohibited decision states:

- `ACTIVE`
- `LIVE`
- `PUBLIC`
- `CUSTOMER_VISIBLE`
- `RUNTIME_ENABLED`
- `AUTO_ACTIVATED`

---

## 5. Authority Roles

Policy-recognized roles:

- `EXECUTIVE_SPONSOR`
- `CHIEF_ENTERPRISE_ARCHITECT`
- `CHIEF_PRODUCT_OFFICER`
- `DOMAIN_STEWARD`
- `DATA_GOVERNANCE_REVIEWER`
- `TECHNICAL_REVIEWER`
- `LEGAL_OR_LICENSING_REVIEWER`
- `SECURITY_OR_PRIVACY_REVIEWER`
- `OPERATOR`
- `OBSERVER`

Operators and observers are workflow participants only. They are not approval authorities for governed progression.

---

## 6. Approval Authorities

| Approval type | Authorized approval roles |
| --- | --- |
| `APPROVE_FOR_INTERNAL_PROOF` | `CHIEF_ENTERPRISE_ARCHITECT`, `EXECUTIVE_SPONSOR` |
| `APPROVE_FOR_INTERNAL_REVIEW` | `CHIEF_ENTERPRISE_ARCHITECT`, `DOMAIN_STEWARD` |
| `APPROVE_FOR_PRODUCTION_INTERNAL_PERSISTENCE_REVIEW` | `EXECUTIVE_SPONSOR`, `CHIEF_ENTERPRISE_ARCHITECT` |
| `APPROVE_FOR_RELATIONSHIP_PROOF_REVIEW` | `CHIEF_ENTERPRISE_ARCHITECT`, `CHIEF_PRODUCT_OFFICER` |
| `APPROVE_FOR_RUNTIME_INTEGRATION_DESIGN` | `EXECUTIVE_SPONSOR`, `CHIEF_PRODUCT_OFFICER` |
| `APPROVE_FOR_CUSTOMER_ACTIVATION_REVIEW` | `EXECUTIVE_SPONSOR` |
| `APPROVE_FOR_REVIEW_ONLY` | `DOMAIN_STEWARD`, `DATA_GOVERNANCE_REVIEWER` |
| `APPROVE_EXCEPTION_REVIEW` | `EXECUTIVE_SPONSOR`, `CHIEF_ENTERPRISE_ARCHITECT` |
| `APPROVE_REMEDIATION` | `DATA_GOVERNANCE_REVIEWER`, `DOMAIN_STEWARD` |
| `APPROVE_RETIREMENT` | `CHIEF_ENTERPRISE_ARCHITECT`, `DOMAIN_STEWARD` |
| `APPROVE_SUPERSESSION` | `CHIEF_ENTERPRISE_ARCHITECT`, `EXECUTIVE_SPONSOR` |

---

## 7. Reviewer Requirements

| Approval type | Required reviewer roles |
| --- | --- |
| `APPROVE_FOR_INTERNAL_PROOF` | `DOMAIN_STEWARD` |
| `APPROVE_FOR_INTERNAL_REVIEW` | `DOMAIN_STEWARD`, `DATA_GOVERNANCE_REVIEWER` |
| `APPROVE_FOR_PRODUCTION_INTERNAL_PERSISTENCE_REVIEW` | `DATA_GOVERNANCE_REVIEWER`, `TECHNICAL_REVIEWER` |
| `APPROVE_FOR_RELATIONSHIP_PROOF_REVIEW` | `DATA_GOVERNANCE_REVIEWER`, `TECHNICAL_REVIEWER` |
| `APPROVE_FOR_RUNTIME_INTEGRATION_DESIGN` | `TECHNICAL_REVIEWER`, `SECURITY_OR_PRIVACY_REVIEWER` |
| `APPROVE_FOR_CUSTOMER_ACTIVATION_REVIEW` | `DATA_GOVERNANCE_REVIEWER`, `LEGAL_OR_LICENSING_REVIEWER`, `SECURITY_OR_PRIVACY_REVIEWER` |
| `APPROVE_FOR_REVIEW_ONLY` | `DOMAIN_STEWARD` |
| `APPROVE_EXCEPTION_REVIEW` | `LEGAL_OR_LICENSING_REVIEWER`, `SECURITY_OR_PRIVACY_REVIEWER` |
| `APPROVE_REMEDIATION` | `DATA_GOVERNANCE_REVIEWER` |
| `APPROVE_RETIREMENT` | `DOMAIN_STEWARD` |
| `APPROVE_SUPERSESSION` | `DATA_GOVERNANCE_REVIEWER`, `DOMAIN_STEWARD` |

Additional reviewers may be required when source restrictions, runtime implications, unresolved conflicts, ambiguity, licensing, security, or privacy concerns are present.

---

## 8. Mandatory Evidence

Every approval request must include:

- readiness-ledger evidence;
- quality evidence;
- source-decision evidence;
- source queue-item evidence.

Missing mandatory evidence blocks approval.

---

## 9. Automatic Blocking Conditions

Automatic blockers:

- `EDITORIAL_ONLY_BLOCKED_FROM_FACTUAL_ACTIVATION`
- `RESTRICTED_KNOWLEDGE_NOT_PUBLICLY_ELIGIBLE`
- `DUPLICATE_CANDIDATE_CANNOT_BECOME_CANONICAL`
- `CONFLICT_OR_DUPLICATE_PRESENT`
- `MISSING_OR_INSUFFICIENT_SOURCE`

These blockers may result in evidence-required, deferred, rejected, conditional, or closed-without-action outcomes depending on the approval type and decision authority.

---

## 10. Post-Approval Prohibitions

Every Sprint 5 decision preserves:

- `DO_NOT_ACTIVATE_RUNTIME`
- `DO_NOT_CREATE_PRODUCTION_PERSISTENCE`
- `DO_NOT_EXPOSE_TO_CUSTOMERS`
- `DO_NOT_CHANGE_SEARCH`
- `DO_NOT_CHANGE_MAPS`
- `DO_NOT_CREATE_PROPERTY_RELATIONSHIPS`
- `DO_NOT_INDEX`
- `DO_NOT_ENABLE_ANALYTICS_CONSUMPTION`
- `DO_NOT_ENABLE_AI_CONSUMPTION`

Every decision also preserves:

- `activationExplicitlyAuthorized: false`;
- `customerVisibilityAuthorized: false`;
- `runtimeConsumptionAuthorized: false`;
- `productionPersistenceAuthorized: false`.

---

## 11. Recommendation Boundary

Automated recommendations may be:

- `RECOMMEND_APPROVAL_FOR_INTERNAL_PROOF`
- `RECOMMEND_CONDITIONAL_APPROVAL`
- `RECOMMEND_DEFERRAL`
- `RECOMMEND_REJECTION`
- `INSUFFICIENT_EVIDENCE_FOR_RECOMMENDATION`

Recommendations are advisory evidence only. They are not decisions and do not authorize any action.

---

## 12. Decision Lifecycle

Decisions may be:

- conditionally approved;
- approved for a defined next step;
- evidence-required;
- deferred;
- rejected;
- expired after the policy review window;
- revoked pending re-review;
- superseded by a replacement decision;
- closed without action.

Supersession does not erase the prior decision. Rejection, deferral, expiration, revocation, and closure remain auditable.

---

## 13. Runtime And Customer Isolation

This policy does not authorize:

- production persistence;
- GIO row insertion;
- public APIs or routes;
- customer retrieval;
- property relationship creation;
- final canonical selection;
- search, map, page, SEO, Typesense, MLS, alert, CRM, email, indexing, market analytics, customer presentation, AI-assisted synthesis, or runtime activation;
- vendor integration or scraping.
