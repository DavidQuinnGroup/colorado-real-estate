# PROJECT ATLAS(TM)

## Liquid Glass Visual Certification Fixture V1

**Workstream:** `PROJECT_ATLAS_LIQUID_GLASS_DESIGN_SYSTEM_FOUNDATION_V1_VISUAL_CERTIFICATION_FIXTURE`
**Purpose:** direct human inspection of the opt-in Wave 0 foundation
**Lifecycle:** `DURABLE_INTERNAL_INFRASTRUCTURE`

## Access And Safety

The fixture route is `/agent/design-system/visual-certification`. It is protected
by the existing Agent session middleware and its explicit read-only Agent surface
classification. It is not linked from public, Agent, Client, or Admin navigation;
is absent from the sitemap; has noindex metadata; and has no data fetch, database
access, server action, mutation, contact, document, or external-link behavior.

The fixture is an internal design-system surface, not an Agent product workflow.
All displayed content is static, deterministic, and visibly synthetic.

## Foundation Fidelity

The fixture composes the actual Wave 0 primitives from
`components/design-system/AtlasDesignSystem.tsx` and consumes the canonical token
roles from `app/atlas-design-system.css`. Its CSS module controls only fixture
layout, section composition, and responsive arrangement. It does not define
canonical tokens, duplicate component semantics, alter theme values, or change
the foundation's system-aware theme strategy.

The system theme and reduced-motion indicators reflect the browser's real media
preferences. This deliberately preserves the canonical foundation behavior;
Executive inspection switches system preferences rather than using a fixture
theme override that would create a second theme mechanism.

## Direct Proof Coverage

The fixture provides direct, synthetic inspection of all four shell profile
classes using the same representative primitives in a comparison matrix. It
also exposes typography hierarchy, glass and solid material hierarchy, buttons
and links, field states, status and notice roles, all eight information classes,
loading/empty/error states, analytical data primitives, responsive behavior, and
keyboard focus/reduced-motion instructions.

## Validation

Run `npm run check:liquid-glass-visual-certification-fixture` and
`npm run check:liquid-glass-human-certification-remediation` with the existing
Wave 0 foundation, cursor, navigation, typecheck, lint, and build checks.

The repository includes Playwright, but it has no pre-existing authenticated
browser-storage or visual-snapshot convention for protected Agent routes. A
snapshot baseline is therefore intentionally deferred rather than creating an
authentication bypass, secret, or fixture-only public route. Executive human
review remains required and is not replaced by a static checker.
