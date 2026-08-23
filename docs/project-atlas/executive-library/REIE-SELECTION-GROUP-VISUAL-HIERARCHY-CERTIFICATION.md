# PROJECT ATLAS Selection-Group Visual Hierarchy Certification

Program: `PLATFORM_SELECTION_HIERARCHY_REFINEMENT_AND_COMPARATIVE_MARKET_REPORTING_REQUIREMENT`

Status: `PROJECT_ATLAS_SELECTION_GROUP_VISUAL_HIERARCHY_V2_CERTIFIED`

## Purpose

This bounded refinement establishes a consistent distinction between a
selection-group title and the selectable controls it governs. It improves
Agent Preparation scanability and process orientation without redesigning
those pages or changing their authorization, data, or workflow boundaries.

## Contract

The shared Agent fieldset contract gives visible selection-group legends a
`22px` mobile and `30px` desktop title treatment, with semibold weight and a
tighter title-to-controls relationship. Selection-section titles remain above
the group-title scale. The Market Update selection grid retains a larger row
gap than its internal option gap, so group separation remains clear without
excessive whitespace.

The hierarchy is:

1. page title;
2. major section title;
3. selection-group or field-group title;
4. selectable option or control label;
5. helper or explanatory text.

## Applied Surfaces

- Buyer Preparation and Seller Preparation use unnumbered shared group titles
  and deliberate sequential group spacing.
- Listing Preparation inherits the shared visible-legend contract and a
  higher selection-section heading.
- Market Update Preparation uses the shared title token for Market, Audience,
  Purpose, and Topics to emphasize, with responsive `gap-y-8` group rhythm.
- Market Preparation, Location Preparation, and Property Preparation use the
  shared selection-heading token above their single selector groups.

## Responsive And Accessibility Boundaries

The contract changes typography and spacing only. It preserves native
fieldset/legend semantics, existing input focus rings, option labels, minimum
control sizes, and responsive grid behavior. It introduces no color system,
storage, API, customer-data, source, or authorization change.

## Future Requirement Preservation

`PROJECT_ATLAS_VISUAL_ORIENTATION_AND_CAPABILITY_DIFFERENTIATION_REQUIRED`
remains open. This refinement is not a broader visual-differentiation
redesign.

## Comparative Reporting Requirement

`PROJECT_ATLAS_COMPARATIVE_MARKET_REPORTING_AND_EXPORT_REQUIRED` is recorded
in `REIE-AGENT-WORK-GAP-AND-PRIORITY-REGISTER.md` as a future capability only.
It authorizes no comparative implementation, data acquisition, chart, print,
PDF, persistence, communication, or publication work.
