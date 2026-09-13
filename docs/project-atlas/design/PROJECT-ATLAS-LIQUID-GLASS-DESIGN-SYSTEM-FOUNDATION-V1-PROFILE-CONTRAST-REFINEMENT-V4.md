# Liquid Glass Design System Foundation V1 Profile Contrast Refinement V4

`PROJECT_ATLAS_LIQUID_GLASS_DESIGN_SYSTEM_FOUNDATION_V1_PROFILE_CONTRAST_REFINEMENT_V4` is a bounded Wave 0 refinement of the opt-in Liquid Glass foundation. It does not implement a product shell, redesign navigation, change authentication or session behavior, or access production data.

## Root Cause

V3 differentiated profiles through density, opacity, blur, border strength, depth, and canvas wash. The canvas, glass, solid material, and field tokens still resolved from the same global semantic set for every profile. In dark appearance, that left Agent, Client, and Admin with insufficient environmental and surface separation, producing the observed near-black convergence.

Public is the preserved anchor. Its profile uses the existing global canonical aliases unchanged: `--atlas-canvas`, primary and secondary glass, elevated and floating surfaces, data and reading solids, field surfaces, global cyan actions, semantic colors, typography, and focus ring.

## Canonical Refinement

`app/atlas-design-system.css` now resolves each primitive through profile semantic aliases. The shared profile layer aliases Public to the existing global tokens. Agent, Client, and Admin override the same aliases for canvas, atmosphere, primary and secondary glass, elevated and floating surfaces, data and reading solids, fields, boundaries, and elevation in both Light and Dark appearances.

- Agent uses a blue-graphite operational environment with distinct analytical data and field surfaces.
- Client uses a softer, presentation-oriented environment with calmer reading and data surfaces.
- Admin uses a denser graphite structure with explicit boundaries and differentiated analytical surfaces.

All four remain one system: typography, component geometry, cyan action language, semantic status and information colors, focus treatment, and interaction rules remain shared. Nested glass still removes additional blur. Critical remains a separate semantic surface and is not conflated with destructive actions or ordinary errors.

## Protected Boundaries

This refinement changes only canonical Wave 0 CSS, its deterministic regression checks, and this record. It creates no schema, migration, data, auth, session, Outputs authorization, provider, MLS, CRM, email, SMS, PDF, navigation, environment, Vercel, or GitHub-permission change. The fixture remains static, synthetic, and local-only.

## Regression Coverage

`scripts/checkLiquidGlassProfileContrastRefinementV4.ts` verifies that all non-Public profiles define the same canonical material dimensions, Dark overrides exist for their environments, the shared primitives consume profile aliases, Public remains the base alias anchor, and the fixture does not redefine tokens.

Human visual certification remains required. The required next gate is `PROJECT_ATLAS_LIQUID_GLASS_DESIGN_SYSTEM_FOUNDATION_V1_HUMAN_CERTIFICATION`; Wave 1 remains unauthorized.
