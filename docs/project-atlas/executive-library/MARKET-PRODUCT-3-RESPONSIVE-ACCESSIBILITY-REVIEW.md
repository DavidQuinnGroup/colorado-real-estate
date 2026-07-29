# Market Product 3.0 Responsive and Accessibility Review

Status: `MARKET_PRODUCT_3_RESPONSIVE_ACCESSIBILITY_REVIEW_COMPLETE`

## Review Targets

- `/market`
- `/market/boulder-co-housing-market`
- `/market/louisville-co-housing-market`
- `/market/lafayette-co-housing-market`
- `/market/broomfield-co-housing-market`

## Viewports

- Desktop: 1440
- Tablet: 1024 and 820
- Mobile: 390
- Narrow mobile: 320

## Accessibility Decisions

- The Market Pulse includes a semantic table alternative.
- The Confidence Layer uses native `details` and `summary`.
- The section has an `aria-labelledby` relationship.
- Decorative bars are hidden from assistive technology.
- CTA text is explicit and destination-oriented.

## Responsive Decisions

- The VIS panel uses scoped CSS and responsive grid tracks.
- The evidence table is horizontally scrollable inside the component only.
- The component sets `min-width: 0` for all descendants to prevent overflow.

## Boundaries

- No AI
- No public GIS
- No telemetry
- No source activation
- No provider activation

## Browser Evidence

Local Chrome DevTools Protocol review passed across `/market`, Boulder, Louisville, Lafayette, and Broomfield sparse routes at 1440, 1024, 820, 390, and 320 widths.

Results:

- No horizontal overflow.
- No console warnings or errors.
- Market Pulse rendered.
- Confidence Layer rendered.
- Accessible data table rendered.
- Certified-city routes rendered complete evidence.
- Broomfield rendered sparse evidence and rich interpretation disabled.

Screenshot directory: `/private/tmp/market-product-3-screenshots`
