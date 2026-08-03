# REIE DXT Wave 1E Advisory And Contact Architecture Readiness

Status: `DXT_WAVE_1E_ADVISORY_CONTACT_ARCHITECTURE_READY`

This record integrates the Advisory Handoff plan and Contact Decision Flow plan. It authorizes no runtime change.

## Advisory Versus Contact Responsibilities

Advisory is both a preparation layer and, in the current repository, a section hosted on the Contact destination.

Advisory owns:

- helping the customer understand what to prepare before a focused professional conversation;
- naming the decision context;
- separating REIE evidence from professional interpretation;
- identifying questions requiring professional discussion;
- preserving trust, professional, brokerage, legal, financial, valuation, and fair-housing boundaries.

Contact owns:

- the simplest appropriate way to begin the conversation;
- minimum necessary customer information if a future generic Contact form is authorized;
- direct-entry clarity for customers who arrive without prior REIE context;
- visible consent, privacy, brokerage, and relationship boundaries;
- alternatives for customers not ready to submit.

## Recommended Customer Flow

Default future flow:

1. Customer uses a decision surface: Search, Property, Buyer, Seller, Market, City Market, Neighborhood, Grand Plan, Compare, or Home Worth.
2. Decision surface links to Advisory when the customer needs to prepare questions before a conversation.
3. Advisory clarifies what to bring and what remains unresolved.
4. Contact begins the conversation with minimum necessary information.
5. Customers not ready to submit can return to the relevant REIE decision tool.

Direct Contact remains valid:

- A customer may enter `/contact` directly.
- Direct entry must not require prior journey state.
- Direct entry should still explain the Advisory preparation option without blocking the conversation-starting path.

## Cross-Route CTA Strategy

Future CTA strategy:

- Homepage: broad Contact or Advisory entry, low pressure.
- Search: `Ask an Advisor` should mean bring search tradeoffs, not request ranking or suitability conclusions.
- Property: in-page property inquiry remains primary for property-specific questions.
- Buyer: Advisory should focus on preparation, assumptions, and verification, not approval or qualification.
- Seller: Advisory should focus on property preparation, evidence, pricing context, and professional review, not valuation certainty.
- Market and City Market: Advisory should focus on evidence interpretation and directional-versus-verified context, not timing or investment advice.
- Neighborhood: Advisory should focus on neutral place questions and verification, not demographic fit or best-neighborhood claims.
- Contact: one dominant conversation-starting action with compact alternatives.

Duplicated contact pathways should be reduced by clearer labels and placement, not by removing existing routes or breaking existing form-specific workflows.

## Context-Handoff Strategy

Allowed context:

- visible source route labels;
- explicit customer-selected decision category;
- optional customer-entered notes;
- URL query or anchor identifying broad context, only if separately authorized.

Prohibited automatic data transfer:

- customer identity;
- email or phone;
- financial assumptions;
- affordability, credit, or lending details;
- saved searches;
- selected properties or favorites;
- planner inputs;
- protected characteristics;
- demographic preferences;
- hidden lead scores;
- CRM-derived status;
- confidential motivations;
- persistent decision history;
- localStorage, cookies, telemetry, analytics, or profile-derived context.

## Dominant Professional Handoff Ownership

Advisory owns the decision-preparation handoff.

Contact owns the conversation-starting action.

Property inquiry and city Market LeadCapture remain specialized workflows and should not be collapsed into a generic Contact form without separate authorization.

## Implementation Sequence

Recommended order:

1. Advisory Handoff foundation
2. Contact Decision Flow simplification
3. Cross-route CTA reconciliation
4. Production certification
5. Documentation closure

Reason for this order:

- Advisory defines what the customer should understand before conversation.
- Contact can then become simpler without losing preparation context.
- Cross-route CTA reconciliation should wait until both destination experiences are certified, reducing risk to certified Buyer, Seller, Market, City Market, Neighborhood, Search, and Property surfaces.

## Certification Sequence

1. Local Advisory implementation certification.
2. Push and production Advisory certification.
3. Contact planning certification, if not already closed.
4. Local Contact implementation certification.
5. Push and production Contact certification.
6. Cross-route CTA implementation authorization, if still needed.
7. Wave 1E documentation closure.

## Protected-System Boundaries

Wave 1E planning does not authorize:

- runtime implementation;
- route changes;
- navigation changes;
- form changes;
- CRM changes;
- email changes;
- scheduling changes;
- persistence;
- telemetry;
- analytics;
- lead-routing changes;
- provider integrations;
- shared runtime abstractions;
- brokerage disclosure changes;
- customer-data access;
- production-data mutation;
- form submissions or test lead creation.

Shared-file stop condition:

- Any runtime implementation requiring API, CRM, email, scheduling, persistence, telemetry, analytics, route, navigation, footer, Search, map, provider, schema, or brokerage-disclosure changes must stop and return a proposed authorization boundary.

## Deterministic Planning Contract

The Wave 1E planning contract must preserve:

- Advisory governing question;
- Contact governing question;
- both required hierarchies;
- Advisory/Contact relationship;
- Contact field assessment;
- direct-entry behavior;
- visible-only context handoff;
- prohibited automatic data transfer;
- protected-system boundaries;
- brokerage hold;
- implementation order;
- no runtime authorization.

## Accepted Limitations

- Advisory and Contact currently share the `/contact` route.
- No generic Contact form exists today.
- Existing property inquiry and city Market strategy-intake workflows already include persistence and CRM task behavior, but this session does not inspect production customer records or mutate those systems.
- Public phone, office address, and branded public email remain unavailable pending external approval.

## Planning Conclusion

Planning conclusion:

`READY_FOR_WAVE_1E_PLANNING_CERTIFICATION`

Primary next gate:

`READY_FOR_REIE_DXT_WAVE_1E_ADVISORY_HANDOFF_FOUNDATION_BOUNDED_IMPLEMENTATION_AUTHORIZATION`

Secondary next gate:

`READY_FOR_REIE_DXT_WAVE_1E_CONTACT_DECISION_FLOW_FOUNDATION_CERTIFICATION`
