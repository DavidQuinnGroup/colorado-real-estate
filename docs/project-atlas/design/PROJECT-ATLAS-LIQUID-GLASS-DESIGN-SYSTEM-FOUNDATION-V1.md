# PROJECT ATLAS(TM)

## Liquid Glass Design System Foundation V1

### Wave 0 Foundation Contract

**Design system:** `PROJECT_ATLAS_LIQUID_GLASS_DESIGN_SYSTEM_V1`  
**Scope:** shared, opt-in visual and interaction foundations only  
**Route migration:** none  
**Theme strategy:** system-aware CSS variables with no account preference or client theme runtime

## Source Of Truth

`app/atlas-design-system.css` is the canonical Wave 0 token source. Its roles
cover canvas, surface, text, border, action, field, status, information class,
focus, depth, typography, spacing, radius, and motion. The same semantic
contract receives light defaults and dark values through
`prefers-color-scheme`; it does not depend on a route-local theme model or
client hydration.

The stylesheet exposes selected canonical roles to Tailwind v4 using `@theme
inline`. CSS variables remain the single semantic authority; the Tailwind names
are a consumption bridge, not a duplicate color system.

## Shell Profiles

The profile classes are intentionally not attached to current layouts:

- `atlas-ds-shell-public`: calm, editorial reading width and comfortable density.
- `atlas-ds-shell-agent`: restrained analytical glass and operational density.
- `atlas-ds-shell-client`: decision-oriented calm with comfortable spacing.
- `atlas-ds-shell-admin`: compact, minimal operational density.

Each profile only adjusts material strength, reading width, or density. It does
not alter status, warning, error, focus, or information-class semantics.

## Shared Primitives

`components/design-system/AtlasDesignSystem.tsx` supplies opt-in server-safe
primitives for surfaces, actions, links, labelled fields, notices, statuses,
information classes, and loading, empty, and error states. Their styles use the
semantic roles instead of route-local hard-coded colors.

The foundation includes a solid data surface, a solid reading surface, and
restrained glass surfaces. Nested glass removes the second backdrop filter.
High-contrast and forced-color modes use opaque surfaces. Reduced-motion users
receive no component transition. Inputs, actions, links, and textareas have a
visible focus ring; labels are persistent; state labels remain textual rather
than color-only.

## Compatibility Boundary

Wave 0 does not migrate the Public, Agent, Client Private, or Admin shells, or
any page family. Existing route styling remains in `app/globals.css`; the new
foundation is imported there but affects a surface only when an authorized
consumer adopts an `atlas-ds-*` primitive or class. This preserves existing
route behavior while making the shared vocabulary available for later waves.

## Local Visual Baseline

**State:** `DEFERRED_WITH_REASON`.

The repository includes Playwright but has no deterministic non-public
design-system showcase or fixture route. Wave 0 does not create a discoverable
production destination or migrate a page solely to obtain screenshots. A local
visual baseline will be introduced only with an authorized fixture or consumer
surface that provides stable, synthetic, non-public content.

## Technical Checks

- `npm run check:liquid-glass-design-system-foundation`
- `npm run check:interactive-cursor-styles`
- `npm run check:tailwind-v4-style-pipeline`
- `npm run check:project-atlas-navigation-invariant`
- `npm run lint`
- `npm run typecheck`
- `npm run build`

## Human Certification Package

Human certification remains required before Wave 0 may be described as
certified. Inspect representative existing routes and any authorized future
consumer surface using this sequence:

1. **HC-LG0-01 Theme:** switch system light and dark preference. Confirm the
   foundation has coherent contrast, no visible flash, and related shell
   material language.
2. **HC-LG0-02 Typography:** verify a page title, major section, subsection,
   panel title, persistent label, and metadata remain visibly distinct.
3. **HC-LG0-03 Surfaces:** verify glass is spatial and restrained, while dense
   data uses an opaque high-contrast surface.
4. **HC-LG0-04 Actions and links:** inspect primary, secondary, ghost, secure,
   and destructive actions; confirm pointer, focus, disabled, and loading
   states are understandable.
5. **HC-LG0-05 Forms:** confirm labels persist, units are visible, focus is
   clear, help and validation are readable, and read-only/disabled fields are
   distinct.
6. **HC-LG0-06 Status and information classes:** confirm the eight
   information classes and lifecycle states remain understandable without
   color alone.
7. **HC-LG0-07 State surfaces:** verify loading preserves orientation, empty
   states explain next steps, and blocking versus non-blocking errors differ.
8. **HC-LG0-08 Responsive:** at a representative mobile width, confirm no
   horizontal layout failure, usable controls, and legible surfaces.
9. **HC-LG0-09 Accessibility interaction:** use Tab and keyboard activation;
   confirm focus visibility and reasonable reduced-motion behavior.
10. **HC-LG0-10 Legacy non-regression:** confirm representative existing pages
    remain operationally intact. Wave 0 must not appear as a broad redesign.

Requested screenshots: desktop light, desktop dark, mobile, focused form or
action state, and an information-class/status state from an authorized
consumer surface. Do not create production data or trigger a side-effecting
workflow for these screenshots.

## Next Gate

`PROJECT_ATLAS_LIQUID_GLASS_DESIGN_SYSTEM_FOUNDATION_V1_HUMAN_CERTIFICATION`

No shell migration, navigation migration, page-family redesign, or Wave 1 work
is authorized by this foundation contract.
