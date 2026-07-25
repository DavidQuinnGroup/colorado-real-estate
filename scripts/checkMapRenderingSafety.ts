import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function main() {
  const [
    homePage,
    homeSearch,
    searchInterface,
    globalsCss,
    searchMap,
    selectedDrawer,
    packageJson,
    searchControls,
    mapSidebar,
    propertyCard,
    saveSearch,
    propertyPage,
    propertyInquiryForm,
    relatedPropertyLinks,
    equityVision,
  ] = await Promise.all([
    readFile('app/page.tsx', 'utf8'),
    readFile('components/home/HomeSearchExperience.tsx', 'utf8'),
    readFile('components/search/SearchInterface.tsx', 'utf8'),
    readFile('app/globals.css', 'utf8'),
    readFile('components/maps/SearchMap.tsx', 'utf8'),
    readFile('components/maps/SelectedPropertyDrawer.tsx', 'utf8'),
    readFile('package.json', 'utf8'),
    readFile('components/search/SearchControls.tsx', 'utf8'),
    readFile('components/maps/MapSidebar.tsx', 'utf8'),
    readFile('components/PropertyCard.tsx', 'utf8'),
    readFile('components/maps/SaveSearch.tsx', 'utf8'),
    readFile('app/properties/[id]/page.tsx', 'utf8'),
    readFile('components/PropertyInquiryForm.tsx', 'utf8'),
    readFile('components/RelatedPropertyLinks.tsx', 'utf8'),
    readFile('components/EquityVision.tsx', 'utf8'),
  ]);

  for (const [label, source] of [
    ['home search', homeSearch],
    ['dedicated search', searchInterface],
  ] as const) {
    assert(source.includes('reie-search-experience-shell'), `${label} must use deterministic search shell flex CSS.`);
    assert(source.includes('reie-search-mobile-toolbar'), `${label} must use deterministic mobile toolbar display CSS.`);
    assert(source.includes('reie-search-list-pane'), `${label} must use deterministic list pane display CSS.`);
    assert(source.includes('reie-search-map-pane'), `${label} must use deterministic map pane display CSS.`);
    assert(!source.includes("hidden md:block' : 'block"), `${label} must not hide the map pane behind fragile responsive class composition.`);
    assert(!source.includes('md:hidden"'), `${label} must not rely on responsive hidden utility for the map toolbar.`);
  }

  assert(globalsCss.includes('.reie-search-experience-shell'), 'Global CSS must define public search shell layout.');
  assert(globalsCss.includes('.reie-search-discovery-intro'), 'Global CSS must define the dedicated search discovery intro.');
  assert(globalsCss.includes('.home-discovery-container'), 'Global CSS must define the homepage discovery container refinement.');
  assert(globalsCss.includes('flex-direction: row;'), 'Global CSS must force desktop search shell row layout.');
  assert(globalsCss.includes('.reie-search-map-pane'), 'Global CSS must define public search map pane visibility.');
  assert(globalsCss.includes(".reie-search-map-pane[data-mobile-view='list']"), 'Global CSS must preserve mobile list/map switching.');
  assert(globalsCss.includes('@media (min-width: 768px)'), 'Global CSS must force desktop map/list panes visible at the desktop breakpoint.');
  assert(globalsCss.includes('width: 35vw;'), 'Global CSS must preserve the desktop search sidebar width contract.');
  assert(globalsCss.includes('min-width: 440px;'), 'Global CSS must preserve the desktop search sidebar minimum width.');
  assert(globalsCss.includes('max-width: 560px;'), 'Global CSS must preserve the desktop search sidebar maximum width.');
  assert(globalsCss.includes('.reie-map-canvas .leaflet-tile'), 'Global CSS must include a scoped Leaflet tile reset.');
  assert(globalsCss.includes('max-width: none !important;'), 'Leaflet tile reset must prevent global image max-width rules from shrinking tiles.');
  assert(globalsCss.includes('object-fit: fill !important;'), 'Leaflet tile reset must preserve native tile geometry.');
  assert(globalsCss.includes('filter: none !important;'), 'Leaflet tile reset must not distort map tiles.');
  assert(globalsCss.includes('.reie-property-hero-grid'), 'Global CSS must define the property detail hero grid fallback.');
  assert(globalsCss.includes('align-items: start !important;'), 'Property detail hero grid must not stretch image and advisor panel to equal height.');
  assert(globalsCss.includes('grid-template-columns: minmax(0, 1fr) 420px !important;'), 'Property detail hero grid must preserve the desktop advisor panel column.');
  assert(globalsCss.includes('height: calc(100vh - 64px) !important;'), 'Property advisor panel must stay within the initial desktop viewport.');
  assert(globalsCss.includes('.reie-property-detail-grid'), 'Global CSS must define the property detail content grid fallback.');
  assert(globalsCss.includes('.reie-property-advisor-actions a'), 'Global CSS must preserve property advisor action touch-target sizing.');

  assert(!searchMap.includes('.reie-map-canvas::after'), 'SearchMap must not paint decorative overlays over map tiles.');
  assert(!searchMap.includes('.reie-map-canvas::before'), 'SearchMap must not paint decorative overlays over map tiles.');
  assert(!searchMap.includes('mix-blend-mode: screen'), 'SearchMap must not blend decorative overlays over geography.');
  assert(!searchMap.includes('invert(100%)'), 'SearchMap must not invert public basemap tiles.');
  assert(!searchMap.includes('hue-rotate'), 'SearchMap must not hue-shift public basemap tiles.');
  assert(!searchMap.includes('saturate(5.65)'), 'SearchMap must not heavily saturate public basemap tiles.');
  assert(!searchMap.includes('grayscale(1)'), 'SearchMap must not remove color from public basemap tiles.');
  assert(searchMap.includes('new ResizeObserver'), 'SearchMap must invalidate Leaflet size after container layout changes.');
  assert(searchMap.includes('map.invalidateSize({ animate: false, pan: false })'), 'SearchMap must explicitly recalculate Leaflet geometry.');
  assert(packageJson.includes('"check:map-rendering-safety"'), 'package.json must expose the map rendering safety check.');
  assert(searchInterface.includes('Guided Property Search'), 'Dedicated search must present guided property discovery framing.');
  assert(searchInterface.includes('Explore Colorado homes with fit, context, and confidence.'), 'Dedicated search must preserve the approved editorial headline.');
  assert(searchInterface.includes('Start with the places, homes, or criteria that matter.'), 'Dedicated search must orient customers before filters.');
  assert(searchInterface.includes('Build on What Matters'), 'Dedicated search must include Grand Plan continuity framing.');
  assert(searchInterface.includes('Search does not automatically apply your plan'), 'Dedicated search must avoid implying automatic Grand Plan personalization.');
  assert(searchInterface.includes('data-testid="reie-search-grand-plan-continuity"'), 'Dedicated search must expose a stable Grand Plan continuity handle.');
  assert(searchInterface.includes('data-testid="reie-search-orientation"'), 'Dedicated search must expose a stable search orientation handle.');
  assert(searchInterface.includes('Updating properties in view'), 'Dedicated search must use customer-facing loading language.');
  assert(searchInterface.includes("aria-pressed={mobileView === 'list'}"), 'Mobile list toggle must expose aria-pressed state.');
  assert(searchInterface.includes("aria-pressed={mobileView === 'map'}"), 'Mobile map toggle must expose aria-pressed state.');
  assert(!searchInterface.match(/public inventory command center|command center|internal diagnostics|smoke-ready|source-health|duration diagnostics/i), 'Dedicated search shell must avoid internal operational terminology.');
  assert(globalsCss.includes('.reie-search-continuity'), 'Global CSS must define the dedicated search Grand Plan continuity treatment.');
  assert(globalsCss.includes('.reie-search-orientation'), 'Global CSS must define the dedicated search orientation treatment.');
  assert(homePage.includes('Start with fit, context, and confidence.'), 'Homepage discovery section must use Wave 2D fit/context/confidence framing.');
  assert(homePage.includes('Search is the beginning of the decision, not the entire decision.'), 'Homepage discovery section must explain the advisory search boundary.');
  assert(homePage.includes('href="/search"'), 'Homepage discovery section must include a full search CTA.');
  assert(homePage.includes('href="/grand-plan"'), 'Homepage discovery section must preserve one subordinate Grand Plan path.');
  assert(homePage.includes('data-testid="home-discovery-principles"'), 'Homepage discovery principles must expose a stable verification handle.');
  assert(homePage.includes('data-testid="home-discovery-continuation"'), 'Homepage discovery continuation CTA must expose a stable verification handle.');
  assert(homeSearch.includes('Colorado Discovery Preview'), 'Embedded homepage search must include concise discovery preview framing.');
  assert(homeSearch.includes('Colorado property preview'), 'Embedded homepage search must use geographically accurate preview language.');
  assert(homeSearch.includes('data-testid="reie-home-discovery-intro"'), 'Embedded homepage search must expose a stable discovery intro handle.');
  assert(!homeSearch.includes('data-testid="reie-home-discovery-full-search-link"'), 'Embedded homepage search must not duplicate the section full-search CTA.');
  assert(!homeSearch.includes('data-testid="reie-home-discovery-grand-plan-link"'), 'Embedded homepage search must not duplicate the section Grand Plan CTA.');
  assert(!homeSearch.includes('Boulder-area preview'), 'Embedded homepage search must not imply a geographic limitation that runtime does not enforce.');
  assert(homeSearch.includes('onBoundsChange={fetchListings}'), 'Homepage embedded search must preserve map bounds search updates.');
  assert(homeSearch.includes('buildSearchUrl(bounds, nextFilters)'), 'Homepage embedded search must preserve existing search URL construction.');
  assert(searchControls.includes('Shape Your Search'), 'Search controls must use customer-facing refinement language.');
  assert(searchControls.includes('Build clarity by starting with place'), 'Search controls must frame refinement as decision-building.');
  assert(searchControls.includes('Where would you like to live?'), 'Search controls must prioritize location first.');
  assert(searchControls.includes('What fits your budget?'), 'Search controls must group price as budget refinement.');
  assert(searchControls.includes('What kind of home?'), 'Search controls must present property type before details.');
  assert(searchControls.includes('What do you need?'), 'Search controls must group bedrooms and bathrooms as details.');
  assert(searchControls.includes('Already have a property in mind?'), 'Search controls must position keyword search as specific-property refinement.');
  assert(searchControls.includes('Use this when you already know an address, ZIP code, keyword, or MLS number.'), 'Search controls must explain specific-property search without changing behavior.');
  assert(searchControls.includes('Share This Search'), 'Search controls must preserve share behavior with customer-facing labeling.');
  assert(searchControls.includes('Clear Search'), 'Search controls must preserve reset behavior with customer-facing labeling.');
  assert(searchControls.includes('<option value="Residential">Residential</option>'), 'Search controls must preserve residential filter semantics without abbreviations.');
  assert(searchControls.includes('<option value="Commercial">Commercial</option>'), 'Search controls must preserve commercial filter semantics without abbreviations.');
  assert(searchControls.includes('<option value="Multi-Family">Multi-Family</option>'), 'Search controls must preserve multi-family filter semantics without abbreviations.');
  assert(mapSidebar.includes('Completion Path'), 'Search sidebar must include customer-facing completion guidance.');
  assert(mapSidebar.includes('Properties to Explore'), 'Search sidebar must use customer-facing results language.');
  assert(mapSidebar.includes('Focused View'), 'Search sidebar must describe active filter context in customer language.');
  assert(mapSidebar.includes('No Properties Match This View'), 'Search sidebar must guide customers through empty filtered states.');
  assert(mapSidebar.includes('properties shown on this map'), 'Search sidebar must describe mapped properties without implying complete map coverage.');
  assert(mapSidebar.includes('Talk Through Your Search'), 'Search sidebar must preserve one restrained advisor pathway.');
  assert(propertyCard.includes('Review Context'), 'Property cards must use neutral review context framing.');
  assert(propertyCard.includes('Map Context'), 'Property cards must include plain-language map context.');
  assert(propertyCard.includes('data-testid="reie-property-card-core-facts"'), 'Property cards must expose compact core fact metadata.');
  assert(propertyCard.includes('Open details when this listing deserves a closer look'), 'Property cards must frame detail navigation as a follow-up after comparison.');
  assert(propertyCard.includes('Property Signals'), 'Property cards must include plain-language property signals.');
  assert(propertyCard.includes('View Property'), 'Property cards must retain a clear details action.');
  assert(propertyCard.includes('data-property-card-detail-href='), 'Property cards must retain detail navigation metadata.');
  assert(saveSearch.includes('Save This Search'), 'Save-search UI must use customer-facing save language.');
  assert(saveSearch.includes('Save when this view is worth watching.'), 'Save-search UI must position saving as a continuation after exploration.');
  assert(saveSearch.includes('Save this view when it reflects what you want to keep watching.'), 'Save-search UI must avoid guaranteed or instant alert claims.');
  assert(saveSearch.includes("fetch('/api/save-search'"), 'Save-search UI must preserve the existing save-search request route.');
  assert(saveSearch.includes('data-save-search-email-valid'), 'Save-search UI must preserve email validation metadata.');
  assert(searchMap.includes('data-testid="reie-property-map-popup"'), 'Search map popups must expose stable popup metadata.');
  assert(searchMap.includes('data-testid="reie-search-map-orientation"'), 'Search map must expose lightweight map orientation guidance.');
  assert(searchMap.includes('Properties shown here have public map coordinates.'), 'Search map guidance must ground mapped properties in public coordinates.');
  assert(searchMap.includes('Select a marker to compare it with the list.'), 'Search map guidance must connect markers to the list without introducing new state.');
  assert(searchMap.includes('Review Context'), 'Search map popups must use review context framing.');
  assert(searchMap.includes('Map Context'), 'Search map popups must use map context framing.');
  assert(!searchMap.includes('Location Fit'), 'Search map popups must avoid deprecated public location-fit language.');
  assert(!searchMap.includes('Listing Facts'), 'Search map popups must avoid duplicative listing-facts framing.');
  assert(searchMap.includes('Property Signals'), 'Search map popups must include property signal context.');
  assert(searchMap.includes('View Property'), 'Search map popups must retain a clear property detail action.');
  assert(searchMap.includes('href="${detailHref}"'), 'Search map popups must preserve property detail navigation.');
  assert(searchMap.includes('marker.bindPopup(buildPopupHtml(property)'), 'Search map markers must continue to bind property popups.');
  assert(searchMap.includes('marker.openPopup()'), 'Search map markers must continue to open popups from interaction.');
  assert(searchMap.includes('Map Ready'), 'Search map public status text must use customer-safe ready language.');
  assert(searchMap.includes('Explore on Map'), 'Search map public status text must avoid testing or diagnostic language.');
  assert(selectedDrawer.includes('Selected Property'), 'Selected-property drawer must clearly identify the selected property.');
  assert(selectedDrawer.includes('This panel reflects the property selected from the map or listing results.'), 'Selected-property drawer must explain map/list selection continuity.');
  assert(selectedDrawer.includes('Property Details'), 'Selected-property drawer must expose property details.');
  assert(selectedDrawer.includes('Review Context'), 'Selected-property drawer must use review context framing.');
  assert(selectedDrawer.includes('Map Context'), 'Selected-property drawer must expose map context.');
  assert(!selectedDrawer.includes('Location Fit'), 'Selected-property drawer must avoid deprecated public location-fit language.');
  assert(!selectedDrawer.includes('Listing Facts'), 'Selected-property drawer must avoid duplicative listing-facts framing.');
  assert(selectedDrawer.includes('Property Signals'), 'Selected-property drawer must expose property signal context.');
  assert(selectedDrawer.includes('View Property'), 'Selected-property drawer must retain a clear property detail action.');
  assert(selectedDrawer.includes('data-testid="reie-selected-property-drawer"'), 'Selected-property drawer must expose a stable shell handle.');
  assert(selectedDrawer.includes('data-testid="reie-selected-property-close"'), 'Selected-property drawer must expose a stable close control handle.');
  assert(selectedDrawer.includes('aria-label="Close selected listing"'), 'Selected-property drawer close control must remain accessible.');
  assert(selectedDrawer.includes('data-selected-property-detail-href='), 'Selected-property drawer must preserve detail navigation metadata.');
  assert(selectedDrawer.includes('data-selected-property-inquiry-href='), 'Selected-property drawer must preserve inquiry metadata.');
  assert(selectedDrawer.includes('data-selected-property-market-href='), 'Selected-property drawer must preserve market metadata.');
  assert(propertyPage.includes('Decision Workspace'), 'Property detail page must frame the page as a decision workspace.');
  assert(propertyPage.includes('What am I looking at?'), 'Property detail page must expose the Understand decision lens.');
  assert(propertyPage.includes('Why does this matter?'), 'Property detail page must expose the Evaluate decision lens.');
  assert(propertyPage.includes('How does this compare with other homes?'), 'Property detail page must expose the Compare decision lens.');
  assert(propertyPage.includes('What deserves a closer look?'), 'Property detail page must expose the Investigate decision lens.');
  assert(propertyPage.includes('What should I discuss with my advisor?'), 'Property detail page must expose the Discuss decision lens.');
  assert(propertyPage.includes('Property Brief'), 'Property detail page must use property brief framing.');
  assert(propertyPage.includes('data-testid="reie-property-decision-summary"'), 'Property detail page must expose Wave 5 decision summary.');
  assert(propertyPage.includes('Known facts, verification needs, and next steps'), 'Property detail page must frame the compact decision summary.');
  assert(propertyPage.includes('data-testid="reie-property-questions-forward"'), 'Property detail page must expose integrated questions-to-carry-forward treatment.');
  assert(propertyPage.includes('not findings, risks, or selected priorities'), 'Questions-to-carry-forward must avoid implying findings or automated prioritization.');
  assert(propertyPage.includes('Listing Facts'), 'Property detail page must expose listing facts.');
  assert(propertyPage.includes('Review Context'), 'Property detail page must expose review context framing.');
  assert(propertyPage.includes('Construction Perspective'), 'Property detail page must use construction perspective framing.');
  assert(propertyPage.includes('data-testid="reie-property-construction-intelligence"'), 'Property detail page must expose Wave 2 construction intelligence section.');
  assert(propertyPage.includes('Known From Public Listing Data'), 'Property detail page must separate public construction facts.');
  assert(propertyPage.includes('General Construction Context'), 'Property detail page must separate general construction education.');
  assert(propertyPage.includes('Mentioned in Listing Remarks'), 'Property detail page must distinguish listing remarks from verification.');
  assert(propertyPage.includes('Questions to Verify'), 'Property detail page must present construction prompts as questions.');
  assert(propertyPage.includes('Confirm condition, systems, permits, costs, and code questions'), 'Property detail page must direct customers to appropriate professional verification.');
  assert(propertyPage.includes('data-testid="reie-property-financial-intelligence"'), 'Property detail page must expose Wave 3 financial context section.');
  assert(propertyPage.includes('Known Public Price Facts'), 'Property detail page must separate known public price facts.');
  assert(propertyPage.includes('Ownership Costs to Verify'), 'Property detail page must separate ownership-cost verification categories.');
  assert(propertyPage.includes('Financial Questions to Ask'), 'Property detail page must present financial prompts as questions.');
  assert(propertyPage.includes('Professional Context'), 'Property detail page must include financial professional-boundary language.');
  assert(propertyPage.includes('Calculated Price / Sq Ft'), 'Property detail page must label price per square foot as a calculated comparison measure.');
  assert(propertyPage.includes('current listing price and listed square footage only'), 'Property detail page must disclose price-per-square-foot inputs.');
  assert(propertyPage.includes('Verify taxes,') && propertyPage.includes('HOA dues, closing costs'), 'Property detail page must direct customers to verify financial assumptions.');
  assert(propertyPage.includes('data-testid="reie-property-market-intelligence"'), 'Property detail page must expose Wave 4 market context section.');
  assert(propertyPage.includes('Known Listing and Market Facts'), 'Property detail page must separate public market facts.');
  assert(propertyPage.includes('Local Market Context'), 'Property detail page must separate local market education.');
  assert(propertyPage.includes('Market Questions to Investigate'), 'Property detail page must present market prompts as questions.');
  assert(propertyPage.includes('Market Pathway'), 'Property detail page must expose the public market or search pathway.');
  assert(propertyPage.includes('A dedicated public market page is not available for this city'), 'Property detail page must use Search fallback copy when no city market page is supported.');
  assert(propertyPage.includes('Public market context does not provide appraisal advice'), 'Property detail page must avoid presenting market context as appraisal or pricing advice.');
  assert(!propertyPage.includes('MarketChart'), 'Property detail page must not embed unsupported market-chart runtime in PIE Wave 4.');
  assert(propertyPage.includes('Questions Worth Asking'), 'Property detail page must present construction diligence as questions.');
  assert(propertyPage.includes('Questions for a Better Property Conversation'), 'Property detail page must prepare advisor discussion without implying review.');
  assert(propertyPage.includes('href="#property-contact"'), 'Property detail page must preserve inquiry hash navigation.');
  assert(propertyPage.includes('data-testid="reie-property-schema"'), 'Property detail page must preserve property schema metadata handle.');
  assert(propertyPage.includes('data-testid="listing-advertising-attribution"'), 'Property detail page must preserve listing attribution.');
  assert(propertyInquiryForm.includes('id="property-contact"'), 'Property inquiry form must preserve the property-contact hash target.');
  assert(propertyInquiryForm.includes('tabIndex={-1}'), 'Property inquiry hash target must be programmatically focusable.');
  assert(propertyInquiryForm.includes('Ask About This Property'), 'Property inquiry form must use customer-facing CTA language.');
  assert(propertyInquiryForm.includes('financial assumptions, construction records, market context'), 'Property inquiry form must frame allowed property-decision question categories.');
  assert(propertyInquiryForm.includes("fetch('/api/property-inquiry'"), 'Property inquiry form must preserve the existing inquiry API route.');
  assert(propertyInquiryForm.includes('data-property-inquiry-email-valid'), 'Property inquiry form must preserve email validation metadata.');
  assert(propertyInquiryForm.includes('data-public-trust-form-notice="property-inquiry"'), 'Property inquiry form must preserve public trust notice metadata.');
  assert(relatedPropertyLinks.includes('Preparation Considerations'), 'Related-property planning must avoid ROI tab language.');
  assert(relatedPropertyLinks.includes('Continue Comparing'), 'Related-property planning must frame the surface as continued comparison.');
  assert(relatedPropertyLinks.includes('Compare Review Paths'), 'Related-property planning must use directional review comparison language.');
  assert(relatedPropertyLinks.includes('Actual costs, timing, and outcomes vary.'), 'Related-property planning must qualify directional review guidance.');
  assert(relatedPropertyLinks.includes('Timing Review'), 'Related-property planning must frame timing as a review topic.');
  assert(relatedPropertyLinks.includes('data-related-property-risk-window-days="review-required"'), 'Related-property planning must avoid fixed financing-risk windows.');
  assert(equityVision.includes('Investigate'), 'Property review notes must align to the investigation decision lens.');
  assert(equityVision.includes('Area and Records Review'), 'Property review notes must avoid valuation-suite framing.');
  assert(equityVision.includes('not a valuation, inspection result, condition assessment, or return estimate'), 'Property review notes must qualify construction context as non-valuation and non-condition guidance.');
  assert(equityVision.includes('Plumbing Records to Verify'), 'Property review notes must frame plumbing flags as verification records, not defects.');
  assert(!equityVision.includes('Photo Review Placeholder'), 'Property review notes must avoid disabled photo-review placeholder language.');
  assert(!equityVision.includes('Advisor Review'), 'Property review notes must avoid implying completed advisor review.');
  assert(!equityVision.includes('Potential Polybutylene Risk Flag'), 'Property review notes must avoid alarmist plumbing flag language.');
  assert(!propertyPage.includes('Location Fit'), 'Property detail page must avoid public location-fit claims.');
  assert(!propertyPage.includes('Advisor Review Recommended'), 'Property detail page must avoid advisor-review claims.');
  assert(!propertyPage.includes('Detailed Review Suggested'), 'Property detail page must avoid unsupported review conclusions.');
  assert(!propertyPage.includes('reviewedBy'), 'Property detail schema must not imply completed review.');
  assert(!propertyPage.match(/good condition|verified condition|known defect|repair cost|remaining useful life|code compliant|structural soundness|construction score|condition score/i), 'Property detail page must avoid construction conclusions and scoring claims.');
  assert(!propertyPage.match(/Affordability Analysis|Investment Analysis|Equity Opportunity|Financial Recommendation|True Monthly Cost|Get Preapproved|Check Affordability|See Investment Return|Calculate Equity|Get Loan Recommendation|guaranteed monthly payment|future appreciation|positive cash flow/i), 'Property detail page must avoid unsupported public financial advice and capability claims.');
  assert(!propertyPage.match(/Market Forecast|Pricing Recommendation|Investment Outlook|Appraisal Estimate|Fair Market Value|undervalued|overvalued|hot market|cold market|seller motivation|likely bidding war/i), 'Property detail page must avoid unsupported public market predictions and valuation claims.');
  for (const [label, source] of [
    ['dedicated search', searchInterface],
    ['search controls', searchControls],
    ['map sidebar', mapSidebar],
    ['property card', propertyCard],
    ['save search', saveSearch],
  ] as const) {
    assert(!source.match(/\bEFF\b|\bRES\b|\bEff\b|\bRes\b|triage|priority stack|command center|source health|AI matching|predictive|heatmap|guaranteed fit|guaranteed-fit|ROI|traffic/i), `${label} must not expose unsupported or operational Wave 2B language.`);
  }
  for (const [label, source] of [
    ['dedicated search', searchInterface],
    ['search controls', searchControls],
    ['map sidebar', mapSidebar],
  ] as const) {
    assert(
      !source.match(
        /Grand Plan-powered|personalized results|best match|perfect home|dream home|exclusive listings|off-market|match score|fit score|AI-powered|automated recommendation|guaranteed outcome|permanent storage|cross-device synchronization/i,
      ),
      `${label} must not expose unsupported Guided Search Wave 1 continuity or claim language.`,
    );
  }
  const popupSource = searchMap.slice(searchMap.indexOf('function buildPopupHtml'), searchMap.indexOf('export default function SearchMap'));
  const prohibitedPublicPropertyLanguage =
    /Selected Signal|Property Scorecard|Asset Snapshot|Authority Paths|Decision Signal|Triage|\bEFF\b|\bRES\b|\bEff\b|\bRes\b|\bDiagnostic\b|Scorecard|\bPriority\b|Operational status|Smoke ready|Smoke review|AI analysis|AI inspection|predictive|heatmap|guaranteed fit|guaranteed-fit|guaranteed condition|guaranteed equity|ROI|live traffic|commute savings|Discuss This Asset|Altitude Forensics|Internal intelligence/i;
  for (const [label, source] of [
    ['search map popup', popupSource],
    ['selected-property drawer', selectedDrawer],
    ['property detail page', propertyPage],
    ['related-property planning', relatedPropertyLinks],
    ['property review notes', equityVision],
  ] as const) {
    assert(!source.match(prohibitedPublicPropertyLanguage), `${label} must not expose unsupported or operational Wave 2 property language.`);
  }
  for (const [label, source] of [
    ['related-property planning', relatedPropertyLinks],
    ['property review notes', equityVision],
  ] as const) {
    assert(
      !source.match(
        /Listing Prep ROI|ROI Engine|Equity Lift|Guaranteed return|Predictive value|Verified financial outcome|Optimized Value|Valuation Suite|Standard Portal Est\.|Investment Cost|equity capture/i,
      ),
      `${label} must not expose unsupported ROI, equity, or valuation outcome language.`,
    );
  }
  assert(
    !propertyInquiryForm.match(
      /Selected Signal|Property Scorecard|Asset Snapshot|Authority Paths|Decision Signal|Triage|\bEFF\b|\bRES\b|\bEff\b|\bRes\b|\bDiagnostic\b|Scorecard|Operational status|Smoke ready|Smoke review|AI analysis|AI inspection|predictive|heatmap|guaranteed fit|guaranteed-fit|guaranteed condition|guaranteed equity|ROI|live traffic|commute savings|Discuss This Asset|Altitude Forensics|Internal intelligence/i,
    ),
    'property inquiry form must not expose unsupported or operational Wave 2 property language.',
  );

  console.log(
    '[map-rendering-safety] ok: deterministic map pane visibility, dedicated search discovery framing, Wave 4 map guidance, popup/drawer language, native Leaflet tile reset, resize invalidation, and no decorative basemap overlays verified.',
  );
}

main().catch((error) => {
  console.error('[map-rendering-safety] failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
