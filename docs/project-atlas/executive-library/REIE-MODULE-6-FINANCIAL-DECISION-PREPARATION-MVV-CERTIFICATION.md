# REIE Module 6 Financial Decision Preparation MVV Certification

Status: `REIE_MODULE_6_FINANCIAL_PREPARATION_MVV_CERTIFIED_LOCAL`

Module 6 prepares explicit financing, ownership-cost, moving-cost, and
net-proceeds questions. It reuses `lib/financingScenarioCalculator.ts`, whose
outputs are user-assumption arithmetic only. Assumptions remain visibly
classified, missing inputs remain explicit, and any professional verification
request uses the existing handoff taxonomy.

The contract is persistence-neutral and requires explicit decision context,
`NOT_PERSISTED`, and `PROHIBITED` hidden-transfer posture. It does not read the
legacy financial engine or market-metrics modules. It does not provide approval,
qualification, affordability, buying power, current rates, lender quotes,
tax/legal/investment advice, valuation, forecast, offer, or negotiation output.

No route, customer component, navigation surface, database, schema, provider,
lender, CRM, email, queue, Search, Typesense, or deployment behavior is changed.
