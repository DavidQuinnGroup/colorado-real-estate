# REIE Agent Property Conversation Preparation Experience MVV Certification

## Scope

`REIE_AGENT_PROPERTY_CONVERSATION_PREPARATION_EXPERIENCE_MVV` activates one private, read-only Agent Workspace workflow at `/agent/prepare/property`.

The route requires the certified `HUMAN_AGENT` identity, `AGENT` role, and `HUMAN_AGENT_SESSION` mechanism. It does not grant `/agent/*`, Admin, MCP, provider, or source-administration access.

## Selection And Admission

The experience presents only existing active, public Colorado repository properties. Human filtering operates over that bounded repository result set; preparation resolves only the selected exact `Property.slug`. It does not accept internal identifiers, MLS identifiers, guessed addresses, synthetic properties, or external geocoding.

The server-only repository adapter passes stored listing facts and their observation metadata to the certified property-preparation admission contract. The contract emits a briefing only for a unique repository property with current, complete, conflict-free certified listing facts, visible listing reference, and certified existing-repository use. No mutable source state is copied into a geographic object.

## Briefing And Boundaries

The Agent-facing briefing leads with a 60-second factual orientation, then separates supported facts, verification needs, preparation questions, Agent verification checkpoints, and progressive Sources & Limitations. It exposes only the contract-admitted identity, status, price, property type, and available configuration. Listing remarks, price history, open houses, public-record results, and condition interpretation are excluded.

No customer data, CRM, persistence, provider/source activity, public-record retrieval, recommendation, ranking, valuation, negotiation guidance, suitability, protected-class inference, or Fair Housing inference is introduced. The selection and briefing remain in React memory for the open page session only.

## Fail-Closed Behavior

Unknown or ambiguous identity, private or unsupported property, synthetic property, missing source identity, stale, incomplete, or conflicting evidence, Admin or customer context, public-record request, provider-runtime requirement, and recommendation or Fair Housing-sensitive request produce deterministic human states and no partial briefing.

## Certification

Technical certification requires the deterministic Property Conversation Experience checker, the certified Property Preparation Admission checker, the relevant property, professional handoff, Agent, authorization, public-runtime, trust, source-import, style, typecheck, build, and diff checks to pass.

`REIE_AGENT_PROPERTY_CONVERSATION_PREPARATION_EXPERIENCE_CERTIFIED` does not prove Agent labor replacement. The next non-technical state is `READY_FOR_EXECUTIVE_PROPERTY_PREPARATION_USABILITY_REVIEW`, where an Executive validates the workflow manually with a real admitted property.
