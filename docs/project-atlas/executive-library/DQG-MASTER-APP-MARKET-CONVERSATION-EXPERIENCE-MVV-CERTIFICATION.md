# DQG Master App Market Conversation Experience MVV Certification

## Status

`DQG_MASTER_APP_MARKET_CONVERSATION_EXPERIENCE_CERTIFIED`

`/agent/prepare/market` is the first read-only human Agent workflow. It is
available only to the existing `HUMAN_AGENT` / `AGENT` session classification.
It neither broadens `/agent/*` nor authorizes `/admin` or MCP access.

## Product Boundary

The experience presents six finite certified markets and retains selection only
in page memory. The workflow is select a market, prepare a briefing, then
review the concise briefing and optionally disclose Sources & Limitations.

Every briefing passes through `EXP-SRC-REIE-CITY-MARKET-DATA`, the certified
real market producer, the existing Agent preparation context adapter, and the
side-effect-free human briefing synthesis. It does not consume source records
or synthetic fixtures directly.

## Evidence and Review

The UI makes the certified evidence date visible in progressive disclosure and
does not claim live or real-time data. The producer's 31-day policy remains
authoritative: stale, unsupported, incomplete, conflicting, unauthorized, or
otherwise unavailable context shows a human failure state with no fallback.

The briefing presents inventory, days-on-market, and median-price context,
verification needs, neutral questions, authorized review surfaces, and the
conditional professional handoff. It does not make a prediction,
recommendation, ranking, score, urgency, suitability, pricing, offer,
negotiation, investment, provider, steering, or protected-class conclusion.

## Protected Systems

No customer data, CRM, persistence, URL state, browser storage, analytics,
provider activity, source activation, ingestion, database activity, or public
route behavior is introduced. The synthetic proof harness at
`/admin/agent-briefing-preparation` remains unchanged and unlinked.

## Verification

`npm run check:market-conversation-experience` verifies the exact route and
authorization, finite market selection, producer and adapter composition,
human workflow hierarchy, progressive evidence disclosure, fail-closed states,
and protected-system exclusions.

Technical certification establishes only
`READY_FOR_EXECUTIVE_HUMAN_USABILITY_REVIEW`. It does not establish Agent labor
replacement or authorize future Agent workflows.
