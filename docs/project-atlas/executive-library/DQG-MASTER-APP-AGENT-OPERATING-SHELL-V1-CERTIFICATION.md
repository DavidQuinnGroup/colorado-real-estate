# DQG Master App Agent Operating Shell V1 Certification

## Scope

This certification establishes the private Agent shell for the existing `/agent/prepare/market` workflow. It separates Agent product presentation from the public site and the Admin/MCP control plane without changing Agent intelligence, authorization, credentials, source activity, customer data, CRM, persistence, or MLS behavior.

## Shell Boundary

- `ApplicationShell` owns public attribution, navigation, main content, and footer only for public routes.
- `/agent` uses `AgentWorkspaceShell`; `/agent/login` uses its existing minimal authentication presentation.
- The nested market layout is a transparent pass-through. It no longer creates a fixed viewport that can overlap briefing content.
- The Agent shell contains only the existing Market Preparation route and the existing sign-out route.

## Authorization And Data Boundaries

- The existing exact `AGENT` authorization classification for `/agent/prepare/market` remains unchanged.
- Layout inheritance does not grant generic `/agent/*` authority.
- No Agent navigation to `/admin`, MCP, protected APIs, source controls, or provider controls exists.
- No customer, CRM, provider, source, database, local-storage, session-storage, or persistent workspace capability is introduced.

## Preserved Market Contract

The six certified markets, repository-local producer, Agent preparation adapter, three observations, verification prompts, professional handoff behavior, Sources and Limitations, and ephemeral state remain unchanged.

## Validation

- `npm run check:agent-operating-shell`
- `npm run check:market-conversation-experience`
- Agent context, producer, authorization, public-runtime, Public Trust, Tailwind, import-resolution, TypeScript, and production-build checks
- `git diff --check`

## Outcome

`DQG_MASTER_APP_AGENT_OPERATING_SHELL_V1_CERTIFIED`

`AGENT_PRODUCT_SHELL_REMEDIATION_COMPLETE`

This certification does not authorize additional Agent workflows, customer data, CRM, Seller or Offer workflows, MLS aggregation, public Agent display, or the final DQG Master App visual design.
