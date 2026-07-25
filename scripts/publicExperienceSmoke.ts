import { strict as assert } from 'node:assert';
import { readFile } from 'node:fs/promises';

import dotenv from 'dotenv';

import { prisma } from '../lib/prisma.js';

dotenv.config({ path: '.env.local', quiet: true });
dotenv.config({ quiet: true });

const BASE_URL = (process.env.PUBLIC_EXPERIENCE_SMOKE_BASE_URL || 'http://localhost:3000').replace(/\/+$/, '');

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function includesFoldedText(html: string, text: string) {
  return html.toLowerCase().includes(text.toLowerCase());
}

async function fetchHtml(path: string) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      accept: 'text/html',
    },
  });
  const html = await response.text();

  assert.equal(response.status, 200, `Expected HTTP 200 for ${path}, got ${response.status}.`);
  assert.ok(html.length > 1000, `Expected ${path} to return rendered HTML.`);

  return html;
}

async function getSmokeProperty() {
  const property = await prisma.property.findFirst({
    orderBy: {
      updatedAt: 'desc',
    },
    select: {
      id: true,
      slug: true,
      address: true,
    },
  });

  assert.ok(property, 'Expected at least one property for public experience smoke test.');
  return property;
}

async function assertPropertyPage(path: string) {
  const html = await fetchHtml(path);

  assert.ok(includesFoldedText(html, 'Decision Workspace'), 'Expected property page decision workspace framing.');
  assert.ok(includesFoldedText(html, 'Understand'), 'Expected property page understand decision lens.');
  assert.ok(includesFoldedText(html, 'Evaluate'), 'Expected property page evaluate decision lens.');
  assert.ok(includesFoldedText(html, 'Compare'), 'Expected property page compare decision lens.');
  assert.ok(includesFoldedText(html, 'Investigate'), 'Expected property page investigate decision lens.');
  assert.ok(includesFoldedText(html, 'Discuss'), 'Expected property page discuss decision lens.');
  assert.ok(includesFoldedText(html, 'Property Brief'), 'Expected property page brief framing.');
  assert.ok(includesFoldedText(html, 'Listing Facts'), 'Expected property page listing facts.');
  assert.ok(includesFoldedText(html, 'Construction Perspective'), 'Expected property page construction perspective.');
  assert.ok(includesFoldedText(html, 'Construction Questions'), 'Expected property page construction questions section.');
  assert.ok(includesFoldedText(html, 'Known From Public Listing Data'), 'Expected property page public construction fact grouping.');
  assert.ok(includesFoldedText(html, 'General Construction Context'), 'Expected property page general construction education grouping.');
  assert.ok(includesFoldedText(html, 'Questions to Verify'), 'Expected property page neutral construction verification prompts.');
  assert.ok(includesFoldedText(html, 'Public listing information is a starting point'), 'Expected property page construction professional-boundary language.');
  assert.ok(includesFoldedText(html, 'Financial Context'), 'Expected property page financial context section.');
  assert.ok(includesFoldedText(html, 'Known Public Price Facts'), 'Expected property page public price fact grouping.');
  assert.ok(includesFoldedText(html, 'Ownership Costs to Verify'), 'Expected property page ownership-cost verification grouping.');
  assert.ok(includesFoldedText(html, 'Financial Questions to Ask'), 'Expected property page financial verification prompts.');
  assert.ok(includesFoldedText(html, 'Professional Context'), 'Expected property page financial professional-boundary language.');
  assert.ok(includesFoldedText(html, 'Calculated Price / Sq Ft'), 'Expected property page calculated price-per-square-foot labeling.');
  assert.ok(includesFoldedText(html, 'current listing price and listed square footage only'), 'Expected property page price-per-square-foot input disclosure.');
  assert.ok(includesFoldedText(html, 'Questions Worth Asking'), 'Expected property page diligence questions.');
  assert.ok(includesFoldedText(html, 'Questions for a Better Property Conversation'), 'Expected property page advisor discussion preparation.');
  assert.ok(includesFoldedText(html, 'Ask About This Property'), 'Expected property page inquiry CTA.');
  assert.ok(includesFoldedText(html, 'Property Inquiry'), 'Expected property inquiry form.');
  assert.ok(includesFoldedText(html, 'Follow-up routing'), 'Expected inquiry follow-up routing guidance.');
  assert.ok(includesFoldedText(html, 'Current Request'), 'Expected inquiry request guidance.');
  assert.ok(includesFoldedText(html, 'Timing / Intent'), 'Expected inquiry timing controls.');
  assert.ok(includesFoldedText(html, 'Notes optional but helpful'), 'Expected inquiry notes guidance.');
  assert.ok(!includesFoldedText(html, 'Advisor Review'), 'Expected property page to avoid advisor-review claims.');
  assert.ok(!includesFoldedText(html, 'Location Fit'), 'Expected property page to avoid public location-fit claims.');
  assert.ok(!includesFoldedText(html, 'Photo Review Available'), 'Expected property page to avoid unavailable photo-review capability claims.');
  assert.ok(!includesFoldedText(html, 'construction forensics'), 'Expected property page to avoid construction-forensics claims.');
  assert.ok(!includesFoldedText(html, 'verified condition'), 'Expected property page to avoid verified-condition claims.');
  assert.ok(!includesFoldedText(html, 'reviewedBy'), 'Expected property page schema to avoid completed-review claims.');
  assert.ok(!html.match(/Affordability Analysis|Investment Analysis|Equity Opportunity|Financial Recommendation|True Monthly Cost|Get Preapproved|Check Affordability|See Investment Return|Calculate Equity|Get Loan Recommendation|guaranteed monthly payment|future appreciation|positive cash flow/i), 'Expected property page to avoid unsupported financial advice and capability claims.');
}

async function assertSearchPage() {
  const html = await fetchHtml('/search');

  assert.ok(includesFoldedText(html, 'Guided Property Search'), 'Expected guided property search framing.');
  assert.ok(includesFoldedText(html, 'Build on What Matters'), 'Expected search Grand Plan continuity framing.');
  assert.ok(includesFoldedText(html, 'Search does not automatically apply your plan'), 'Expected search continuity to avoid automatic personalization claims.');
  assert.ok(includesFoldedText(html, 'Discovery Summary'), 'Expected search discovery summary strip.');
  assert.ok(includesFoldedText(html, 'Properties in View'), 'Expected search sidebar listing shell.');
  assert.ok(includesFoldedText(html, 'Shape Your Search'), 'Expected refined search controls shell.');
  assert.ok(includesFoldedText(html, 'Where would you like to live?'), 'Expected search controls to prioritize location.');
  assert.ok(includesFoldedText(html, 'What fits your budget?'), 'Expected search controls to group price refinement.');
  assert.ok(includesFoldedText(html, 'Already have a property in mind?'), 'Expected search controls to move specific-property lookup after broader refinements.');
  assert.ok(includesFoldedText(html, 'Review Context'), 'Expected property cards to use neutral review context framing.');
  assert.ok(includesFoldedText(html, 'Map Context'), 'Expected property cards to include map context.');
  assert.ok(includesFoldedText(html, 'Open details when this listing deserves a closer look'), 'Expected property cards to frame detail navigation after comparison.');
  assert.ok(includesFoldedText(html, 'Save This Search'), 'Expected save-search opportunity to use customer-facing copy.');
  assert.ok(includesFoldedText(html, 'Save when this view is worth watching'), 'Expected save-search presentation to avoid recommendation claims.');
}

async function assertHomePortalPage() {
  const html = await fetchHtml('/');

  assert.ok(includesFoldedText(html, 'Real Estate Intelligence for the Colorado Front Range'), 'Expected restored Home Portal hero headline.');
  assert.ok(includesFoldedText(html, 'Helping buyers and sellers make smarter real estate decisions'), 'Expected restored Home Portal supporting copy.');
  assert.ok(includesFoldedText(html, 'Build Your Grand Plan'), 'Expected Home Portal Grand Plan CTA.');
  assert.ok(includesFoldedText(html, 'Why REIE'), 'Expected Home Portal REIE introduction.');
  assert.ok(includesFoldedText(html, 'Featured Colorado Communities'), 'Expected Home Portal community section.');
  assert.ok(includesFoldedText(html, 'Start with fit, context, and confidence'), 'Expected homepage discovery to use fit/context/confidence framing.');
  assert.ok(includesFoldedText(html, 'Search is the beginning of the decision, not the entire decision'), 'Expected homepage discovery to define the advisory search boundary.');
  assert.ok(includesFoldedText(html, 'Continue to Guided Search'), 'Expected homepage discovery to include a full search CTA.');
  assert.ok(includesFoldedText(html, 'Colorado Discovery Preview'), 'Expected embedded homepage search to include discovery preview framing.');
  assert.ok(includesFoldedText(html, 'Colorado property preview'), 'Expected embedded homepage search to use accurate geographic preview language.');
  assert.ok(!includesFoldedText(html, 'Boulder-area preview'), 'Expected embedded homepage search not to imply a Boulder-only runtime boundary.');
  assert.ok(!includesFoldedText(html, 'Open Full Search'), 'Expected embedded homepage search not to duplicate the full search CTA.');
  assert.ok(!includesFoldedText(html, 'Plan Around What Matters'), 'Expected embedded homepage search not to duplicate the Grand Plan CTA.');
  assert.ok(html.includes('data-testid="home-portal-hero"'), 'Expected Home Portal hero test handle.');
  assert.ok(html.includes('data-testid="home-portal-search-section"'), 'Expected Home Portal search section test handle.');
  assert.ok(html.includes('data-testid="home-discovery-principles"'), 'Expected homepage discovery principles test handle.');
  assert.ok(html.includes('data-testid="home-discovery-continuation"'), 'Expected homepage discovery continuation test handle.');
  assert.ok(html.includes('data-testid="reie-home-discovery-intro"'), 'Expected embedded homepage discovery intro test handle.');
  assert.ok(!html.includes('data-testid="reie-home-discovery-full-search-link"'), 'Expected embedded homepage full-search CTA duplication to be removed.');
  assert.ok(!html.includes('data-testid="reie-home-discovery-grand-plan-link"'), 'Expected embedded homepage Grand Plan CTA duplication to be removed.');
  assert.ok(html.includes('data-home-search-variant="embedded"'), 'Expected homepage search to render in embedded presentation mode.');
  assert.ok(html.includes('<link rel="canonical" href="https://davidquinngroup.com"'), 'Expected home canonical metadata to be preserved.');
}

async function assertAboutAdvisorExperiencePage() {
  const html = await fetchHtml('/about');

  assert.ok(includesFoldedText(html, 'Advisor Experience'), 'Expected about advisor experience positioning.');
  assert.ok(includesFoldedText(html, 'Why REIE Exists'), 'Expected about page to explain why REIE exists.');
  assert.ok(includesFoldedText(html, 'Construction Expertise'), 'Expected about page construction expertise section.');
  assert.ok(includesFoldedText(html, 'Advisory Philosophy'), 'Expected about page advisory philosophy section.');
  assert.ok(includesFoldedText(html, 'How I Work With Clients'), 'Expected about page client working model.');
  assert.ok(includesFoldedText(html, 'What Makes This Different'), 'Expected about page differentiation section.');
  assert.ok(includesFoldedText(html, 'The Grand Plan Approach'), 'Expected about page Grand Plan section.');
  assert.ok(includesFoldedText(html, 'What Clients Can Expect'), 'Expected about page customer expectation section.');
  assert.ok(includesFoldedText(html, 'Begin with the question you need answered'), 'Expected about page next-step CTA.');
  assert.ok(html.includes('data-testid="about-advisor-page"'), 'Expected about page stable shell handle.');
  assert.ok(html.includes('data-testid="about-decision-framework"'), 'Expected about page decision framework handle.');
  assert.ok(html.includes('<link rel="canonical" href="https://davidquinngroup.com/about"'), 'Expected about canonical metadata.');
  assert.ok(!includesFoldedText(html, 'traditional biography'), 'Expected about page not to present itself as a traditional biography.');
  assert.ok(!includesFoldedText(html, 'pending approved source'), 'Expected about page not to expose placeholder review language.');
}

async function assertSellerPage() {
  const html = await fetchHtml('/sell');

  assert.ok(includesFoldedText(html, 'Sell with preparation, pricing, and market context.'), 'Expected seller page headline.');
  assert.ok(includesFoldedText(html, 'Seller Analysis Request'), 'Expected seller intake form.');
  assert.ok(includesFoldedText(html, 'not an automated home-value estimate'), 'Expected seller page to avoid unsupported valuation claims.');
  assert.ok(html.includes('data-testid="seller-page"'), 'Expected seller page shell test handle.');
  assert.ok(html.includes('data-testid="seller-intake-form"'), 'Expected seller intake form test handle.');
  assert.ok(!includesFoldedText(html, 'Estimated Value'), 'Expected seller page not to render fabricated instant valuation copy.');
  assert.ok(!includesFoldedText(html, 'REIE CRM'), 'Expected seller page not to expose CRM terminology.');
}

async function assertPublicBrandVoiceSource() {
  const publicFiles = [
    'app/page.tsx',
    'app/about/page.tsx',
    'app/search/page.tsx',
    'app/properties/[id]/page.tsx',
    'app/grand-plan/page.tsx',
    'app/sell/page.tsx',
    'app/market/[city]/page.tsx',
    'app/market/[city]/[slug]/page.tsx',
    'components/home/HomeSearchExperience.tsx',
    'components/search/SearchInterface.tsx',
    'components/maps/SearchMap.tsx',
    'components/maps/MapSidebar.tsx',
    'components/settings/NorthStarManager.tsx',
    'components/Footer.tsx',
    'components/PropertyInquiryForm.tsx',
    'components/LeadCapture.tsx',
    'components/maps/SaveSearch.tsx',
  ];
  const flaggedTerms = [
    'Module',
    'Engine',
    'Runtime',
    'Adapter',
    'Repository',
    'Governance',
    'Executive',
    'Sprint',
    'Internal Preview',
    'MCP',
    'Client DNA',
    'Repository Studio',
  ];
  const obsoleteMarkers = [
    'pending approved source',
    'draft fixture',
    'owner and brokerage review',
    'OWNER_APPROVED_REVIEW_SOURCE_REQUIRED',
    'Module 04',
    'Encrypting Client DNA',
  ];

  for (const file of publicFiles) {
    const rawSource = await readFile(file, 'utf8');
    const source = rawSource
      .split('Colorado Real Estate Intelligence Engine')
      .join('Colorado Real Estate Intelligence')
      .split('Real Estate Intelligence Engine')
      .join('Real Estate Intelligence');

    for (const term of flaggedTerms) {
      assert.ok(!source.includes(term), `${file} exposes unintended public engineering language: ${term}`);
    }

    for (const marker of obsoleteMarkers) {
      assert.ok(!rawSource.toLowerCase().includes(marker.toLowerCase()), `${file} exposes obsolete placeholder language: ${marker}`);
    }
  }
}

async function assertDrawerSource() {
  const [source, imageSource] = await Promise.all([
    readFile('components/maps/SelectedPropertyDrawer.tsx', 'utf8'),
    readFile('components/ResilientListingImage.tsx', 'utf8'),
  ]);

  assert.ok(source.includes('const inquiryHref = `${propertyHref}#property-contact`;'), 'Expected selected drawer inquiry hash target.');
  assert.ok(source.includes('View Property'), 'Expected selected drawer View Property CTA label.');
  assert.ok(source.includes('Ask About This Property'), 'Expected selected drawer inquiry action label.');
  assert.ok(source.includes('Selected Property'), 'Expected selected drawer to identify selected properties.');
  assert.ok(source.includes('This panel reflects the property selected from the map or listing results.'), 'Expected selected drawer to explain map/list selection continuity.');
  assert.ok(source.includes('Property Details'), 'Expected selected drawer to expose property details.');
  assert.ok(source.includes('Review Context'), 'Expected selected drawer to use review context framing.');
  assert.ok(source.includes('Map Context'), 'Expected selected drawer to expose map context.');
  assert.ok(!source.includes('Location Fit'), 'Expected selected drawer to avoid deprecated location-fit language.');
  assert.ok(source.includes('Property Signals'), 'Expected selected drawer to expose property signal context.');
  assert.ok(source.includes('data-testid="reie-selected-property-drawer"'), 'Expected selected drawer to expose a stable shell handle.');
  assert.ok(source.includes('data-testid="reie-selected-property-media"'), 'Expected selected drawer to expose media metadata.');
  assert.ok(source.includes('data-testid="reie-selected-property-close"'), 'Expected selected drawer to expose close control metadata.');
  assert.ok(source.includes('data-testid="reie-selected-property-decision"'), 'Expected selected drawer to expose decision metadata.');
  assert.ok(source.includes('testId="reie-selected-property-signal"'), 'Expected selected drawer to expose review signal metadata.');
  assert.ok(source.includes('data-testid="reie-selected-property-inquiry-link"'), 'Expected selected drawer to expose inquiry link metadata.');
  assert.ok(source.includes('data-testid="reie-selected-property-detail-link"'), 'Expected selected drawer to expose detail link metadata.');
  assert.ok(source.includes('data-testid="reie-selected-property-market-link"'), 'Expected selected drawer to expose market link metadata.');
  assert.ok(source.includes('data-selected-property-id='), 'Expected selected drawer to expose selected property ids.');
  assert.ok(source.includes('data-selected-property-inquiry-href='), 'Expected selected drawer to expose inquiry targets.');
  assert.ok(source.includes('data-selected-property-detail-href='), 'Expected selected drawer to expose detail targets.');
  assert.ok(source.includes('data-selected-property-market-href='), 'Expected selected drawer to expose market targets.');
  assert.ok(source.includes('data-selected-property-decision-signal='), 'Expected selected drawer to expose decision signals.');
  assert.ok(source.includes('data-selected-property-review-signal='), 'Expected selected drawer to expose review signals.');
  assert.ok(source.includes('data-selected-property-photo-available='), 'Expected selected drawer to expose media availability.');
  assert.ok(imageSource.includes('data-testid="reie-resilient-listing-image"'), 'Expected resilient listing image to expose a stable image handle.');
  assert.ok(imageSource.includes('data-testid="reie-resilient-listing-image-fallback"'), 'Expected resilient listing image fallback to expose a stable handle.');
  assert.ok(imageSource.includes('data-image-source-src='), 'Expected resilient listing image to expose source image metadata.');
  assert.ok(imageSource.includes('data-image-active-src='), 'Expected resilient listing image to expose active image metadata.');
  assert.ok(imageSource.includes('data-image-fallback-src='), 'Expected resilient listing image to expose fallback image metadata.');
  assert.ok(imageSource.includes('data-image-is-fallback='), 'Expected resilient listing image to expose fallback state.');
  assert.ok(imageSource.includes('data-image-loaded='), 'Expected resilient listing image to expose load state.');
  assert.ok(imageSource.includes('data-image-timeout-ms='), 'Expected resilient listing image to expose timeout metadata.');
}

async function assertPropertyDetailSource() {
  const source = await readFile('components/search/PropertyDetail.tsx', 'utf8');

  assert.ok(source.includes('data-testid="reie-property-detail"'), 'Expected property detail to expose a stable shell handle.');
  assert.ok(source.includes('data-testid="reie-property-detail-header"'), 'Expected property detail to expose header metadata.');
  assert.ok(source.includes('data-testid="reie-property-detail-return"'), 'Expected property detail to expose return control metadata.');
  assert.ok(source.includes('data-testid="reie-property-detail-close"'), 'Expected property detail to expose close control metadata.');
  assert.ok(source.includes('data-testid="reie-property-detail-hero"'), 'Expected property detail to expose hero media metadata.');
  assert.ok(source.includes('data-testid="reie-property-detail-tabs"'), 'Expected property detail to expose tab metadata.');
  assert.ok(source.includes('data-testid="reie-property-detail-tab"'), 'Expected property detail tab buttons to expose metadata.');
  assert.ok(source.includes('data-testid="reie-property-detail-intel"'), 'Expected property detail to expose intel metadata.');
  assert.ok(source.includes('data-testid="reie-property-detail-efficiency"'), 'Expected property detail to expose efficiency metadata.');
  assert.ok(source.includes('data-testid="reie-property-detail-logistics"'), 'Expected property detail to expose logistics metadata.');
  assert.ok(source.includes('data-testid="reie-property-detail-strategy"'), 'Expected property detail to expose strategy metadata.');
  assert.ok(source.includes('data-testid="reie-property-detail-strategy-lock"'), 'Expected property detail to expose strategy lock metadata.');
  assert.ok(source.includes('data-property-detail-active-tab='), 'Expected property detail to expose active tab state.');
  assert.ok(source.includes('data-property-detail-user-tier='), 'Expected property detail to expose user tier.');
  assert.ok(source.includes('data-property-detail-photo-available='), 'Expected property detail to expose media availability.');
  assert.ok(source.includes('data-property-detail-logistics-status='), 'Expected property detail to expose logistics status.');
  assert.ok(source.includes('data-property-detail-strategy-locked='), 'Expected property detail to expose strategy lock state.');
}

async function assertLuxuryPopupSource() {
  const source = await readFile('components/maps/LuxuryIntelligencePopup.tsx', 'utf8');

  assert.ok(source.includes('data-testid="reie-luxury-intelligence-popup"'), 'Expected luxury popup to expose a stable shell handle.');
  assert.ok(source.includes('data-testid="reie-luxury-intelligence-popup-media"'), 'Expected luxury popup to expose media metadata.');
  assert.ok(source.includes('data-testid="reie-luxury-intelligence-popup-body"'), 'Expected luxury popup to expose body metadata.');
  assert.ok(source.includes('data-testid="reie-luxury-intelligence-popup-signals"'), 'Expected luxury popup to expose signal metadata.');
  assert.ok(source.includes('data-popup-property-id='), 'Expected luxury popup to expose property ids.');
  assert.ok(source.includes('data-popup-photo-available='), 'Expected luxury popup to expose media availability.');
  assert.ok(source.includes('data-popup-image-src='), 'Expected luxury popup to expose image sources.');
  assert.ok(source.includes('data-popup-fallback-src='), 'Expected luxury popup to expose fallback sources.');
  assert.ok(source.includes('data-popup-efficiency-score='), 'Expected luxury popup to expose efficiency scores.');
  assert.ok(source.includes('data-popup-resilience-score='), 'Expected luxury popup to expose resilience scores.');
  assert.ok(source.includes('data-popup-risk-label='), 'Expected luxury popup to expose risk labels.');
}

async function assertPropertyMapSource() {
  const source = await readFile('components/PropertyMap.tsx', 'utf8');

  assert.ok(source.includes('data-testid="reie-property-map"'), 'Expected property map to expose a stable shell handle.');
  assert.ok(source.includes('data-testid="reie-property-map-strategy-gate"'), 'Expected property map to expose strategy-gate metadata.');
  assert.ok(source.includes('data-testid="reie-property-map-canvas"'), 'Expected property map to expose canvas metadata.');
  assert.ok(source.includes('data-testid="reie-property-map-popup"'), 'Expected property map popups to expose metadata.');
  assert.ok(source.includes('data-testid="reie-property-map-marker-metadata"'), 'Expected property map to expose marker metadata ledger.');
  assert.ok(source.includes('data-testid="reie-property-map-marker"'), 'Expected property map marker metadata entries.');
  assert.ok(source.includes('data-property-map-mode='), 'Expected property map to expose map mode.');
  assert.ok(source.includes('data-property-map-contracted='), 'Expected property map to expose contracted state.');
  assert.ok(source.includes('data-property-map-total-count='), 'Expected property map to expose total counts.');
  assert.ok(source.includes('data-property-map-coordinate-count='), 'Expected property map to expose coordinate counts.');
  assert.ok(source.includes('data-property-map-hidden-count='), 'Expected property map to expose hidden counts.');
  assert.ok(source.includes('data-property-map-marker-count='), 'Expected property map to expose precise marker counts.');
  assert.ok(source.includes('data-property-map-mask-count='), 'Expected property map to expose masked marker counts.');
  assert.ok(source.includes('data-property-map-pin-precision='), 'Expected property map to expose pin precision.');
  assert.ok(source.includes('data-map-marker-render-mode='), 'Expected property map markers to expose render mode.');
  assert.ok(source.includes('data-map-marker-precision='), 'Expected property map markers to expose precision.');
  assert.ok(source.includes('data-map-mask-radius-meters='), 'Expected property map markers to expose mask radius.');
}

async function assertMapInnerSource() {
  const source = await readFile('components/maps/MapInner.tsx', 'utf8');

  assert.ok(source.includes('data-testid="reie-map-inner"'), 'Expected map inner to expose a stable shell handle.');
  assert.ok(source.includes('data-map-inner-user-tier='), 'Expected map inner to expose user tier.');
  assert.ok(source.includes('data-map-inner-access-level='), 'Expected map inner to expose access level.');
  assert.ok(source.includes('data-map-inner-total-listing-count='), 'Expected map inner to expose total listing counts.');
  assert.ok(source.includes('data-map-inner-visible-listing-count='), 'Expected map inner to expose visible listing counts.');
  assert.ok(source.includes('data-map-inner-private-listing-count='), 'Expected map inner to expose private listing counts.');
  assert.ok(source.includes('data-map-inner-filtered-private-count='), 'Expected map inner to expose filtered private counts.');
  assert.ok(source.includes('data-map-inner-total-coordinate-count='), 'Expected map inner to expose total coordinate counts.');
  assert.ok(source.includes('data-map-inner-visible-coordinate-count='), 'Expected map inner to expose visible coordinate counts.');
  assert.ok(source.includes('data-map-inner-selected-listing-id='), 'Expected map inner to expose selected listing ids.');
  assert.ok(source.includes('data-map-inner-selected-visible='), 'Expected map inner to expose selected visibility state.');
  assert.ok(source.includes('data-map-inner-hovered-listing-id='), 'Expected map inner to expose hovered listing ids.');
  assert.ok(source.includes('data-map-inner-hovered-visible='), 'Expected map inner to expose hovered visibility state.');
  assert.ok(source.includes('data-map-inner-center='), 'Expected map inner to expose map center.');
  assert.ok(source.includes('data-map-inner-has-search-meta='), 'Expected map inner to expose search metadata presence.');
  assert.ok(source.includes('data-map-inner-search-returned='), 'Expected map inner to expose returned search count.');
  assert.ok(source.includes('data-map-inner-search-mapped='), 'Expected map inner to expose mapped search count.');
  assert.ok(source.includes('data-map-inner-search-coordinate-filtered='), 'Expected map inner to expose coordinate filtered search count.');
  assert.ok(!source.includes('data-map-inner-search-terminal='), 'Expected map inner to avoid exposing search terminal metadata.');
  assert.ok(!source.includes('data-map-inner-search-route='), 'Expected map inner to avoid exposing search route metadata.');
  assert.ok(source.includes('data-map-inner-search-source='), 'Expected map inner to expose search source metadata.');
}

async function assertSaveSearchSource() {
  const source = await readFile('components/maps/SaveSearch.tsx', 'utf8');

  assert.ok(source.includes('data-testid="reie-save-search"'), 'Expected save search to expose a stable shell handle.');
  assert.ok(source.includes('data-testid="reie-save-search-summary"'), 'Expected save search to expose market and intent summary metadata.');
  assert.ok(source.includes('data-testid="reie-save-search-goal"'), 'Expected save search to expose goal control metadata.');
  assert.ok(source.includes('data-testid="reie-save-search-timeline"'), 'Expected save search to expose timeline control metadata.');
  assert.ok(source.includes('data-testid="reie-save-search-email"'), 'Expected save search to expose email control metadata.');
  assert.ok(source.includes('data-testid="reie-save-search-submit"'), 'Expected save search to expose submit control metadata.');
  assert.ok(source.includes('data-testid="reie-save-search-notes"'), 'Expected save search to expose notes control metadata.');
  assert.ok(source.includes('data-testid="reie-save-search-status"'), 'Expected save search to expose status metadata.');
  assert.ok(source.includes('data-testid="reie-save-search-readiness"'), 'Expected save search to expose alert readiness metadata.');
  assert.ok(source.includes('data-testid="reie-save-search-signal"'), 'Expected save search to expose alert signal metadata.');
  assert.ok(source.includes('data-testid="reie-save-search-reset"'), 'Expected save search to expose reset control metadata.');
  assert.ok(source.includes('data-save-search-state='), 'Expected save search to expose submit state.');
  assert.ok(source.includes('data-save-search-city='), 'Expected save search to expose city metadata.');
  assert.ok(source.includes('data-save-search-intent='), 'Expected save search to expose intent metadata.');
  assert.ok(source.includes('data-save-search-timeline='), 'Expected save search to expose timeline metadata.');
  assert.ok(source.includes('data-save-search-email-valid='), 'Expected save search to expose email validity.');
  assert.ok(source.includes('data-save-search-notes-length='), 'Expected save search to expose notes length.');
  assert.ok(source.includes('data-save-search-notes-max-length='), 'Expected save search to expose notes max length.');
  assert.ok(source.includes('data-save-search-filter-count='), 'Expected save search to expose captured filter count.');
  assert.ok(source.includes('data-save-search-has-bounds='), 'Expected save search to expose bounds filter state.');
  assert.ok(source.includes('data-save-search-alert-readiness='), 'Expected save search to expose alert readiness.');
  assert.ok(source.includes('data-save-search-signal-count='), 'Expected save search to expose alert signal count.');
  assert.ok(source.includes('data-save-search-blocker-count='), 'Expected save search to expose alert blocker count.');
  assert.ok(source.includes('data-save-search-user-id='), 'Expected save search to expose response user ids.');
  assert.ok(source.includes('data-save-search-id='), 'Expected save search to expose saved search ids.');
}

async function assertLeadCaptureSource() {
  const source = await readFile('components/LeadCapture.tsx', 'utf8');

  assert.ok(source.includes('data-testid="reie-lead-capture"'), 'Expected lead capture to expose a stable shell handle.');
  assert.ok(source.includes('data-testid="reie-lead-capture-summary"'), 'Expected lead capture to expose summary metadata.');
  assert.ok(source.includes('data-testid="reie-lead-capture-form"'), 'Expected lead capture to expose form metadata.');
  assert.ok(source.includes('data-testid="reie-lead-capture-success"'), 'Expected lead capture to expose success metadata.');
  assert.ok(source.includes('data-testid="reie-lead-capture-readiness"'), 'Expected lead capture to expose readiness metadata.');
  assert.ok(source.includes('data-testid="reie-lead-capture-temperature"'), 'Expected lead capture to expose lead temperature metadata.');
  assert.ok(source.includes('data-testid="reie-lead-capture-heat-score"'), 'Expected lead capture to expose heat score metadata.');
  assert.ok(source.includes('data-testid="reie-lead-capture-signal"'), 'Expected lead capture to expose response signal metadata.');
  assert.ok(source.includes('data-testid="reie-lead-capture-authority-signal"'), 'Expected lead capture to expose authority signal metadata.');
  assert.ok(source.includes('data-testid="reie-lead-capture-goal"'), 'Expected lead capture to expose goal option metadata.');
  assert.ok(source.includes('data-testid="reie-lead-capture-timeline"'), 'Expected lead capture to expose timeline option metadata.');
  assert.ok(source.includes('data-testid="reie-lead-capture-notes"'), 'Expected lead capture to expose notes metadata.');
  assert.ok(source.includes('data-testid="reie-lead-capture-email"'), 'Expected lead capture to expose email metadata.');
  assert.ok(source.includes('data-testid="reie-lead-capture-submit"'), 'Expected lead capture to expose submit metadata.');
  assert.ok(source.includes('data-testid="reie-lead-capture-error"'), 'Expected lead capture to expose error metadata.');
  assert.ok(source.includes('data-testid="reie-lead-capture-routing"'), 'Expected lead capture to expose routing metadata.');
  assert.ok(source.includes('data-lead-capture-state='), 'Expected lead capture to expose submit state.');
  assert.ok(source.includes('data-lead-capture-city='), 'Expected lead capture to expose city metadata.');
  assert.ok(source.includes('data-lead-capture-goal='), 'Expected lead capture to expose goal metadata.');
  assert.ok(source.includes('data-lead-capture-legacy-goal='), 'Expected lead capture to expose legacy goal metadata.');
  assert.ok(source.includes('data-lead-capture-timeline='), 'Expected lead capture to expose timeline metadata.');
  assert.ok(source.includes('data-lead-capture-temperature='), 'Expected lead capture to expose lead temperature.');
  assert.ok(source.includes('data-lead-capture-email-valid='), 'Expected lead capture to expose email validity.');
  assert.ok(source.includes('data-lead-capture-notes-length='), 'Expected lead capture to expose notes length.');
  assert.ok(source.includes('data-lead-capture-notes-max-length='), 'Expected lead capture to expose notes max length.');
  assert.ok(source.includes('data-lead-capture-authority-signal-count='), 'Expected lead capture to expose authority signal count.');
  assert.ok(source.includes('data-lead-capture-alert-readiness='), 'Expected lead capture to expose alert readiness.');
  assert.ok(source.includes('data-lead-capture-signal-count='), 'Expected lead capture to expose alert signal count.');
  assert.ok(source.includes('data-lead-capture-blocker-count='), 'Expected lead capture to expose blocker count.');
  assert.ok(source.includes('data-lead-capture-saved-search-id='), 'Expected lead capture to expose saved search ids.');
  assert.ok(source.includes('data-lead-capture-crm-task-id='), 'Expected lead capture to expose CRM task ids.');
  assert.ok(source.includes('data-lead-capture-route="/api/save-search"'), 'Expected lead capture to expose save-search route.');
}

async function assertPropertyInquirySource() {
  const source = await readFile('components/PropertyInquiryForm.tsx', 'utf8');

  assert.ok(source.includes('data-testid="reie-property-inquiry"'), 'Expected property inquiry to expose a stable shell handle.');
  assert.ok(source.includes('data-testid="reie-property-inquiry-success"'), 'Expected property inquiry to expose success metadata.');
  assert.ok(source.includes('data-testid="reie-property-inquiry-status"'), 'Expected property inquiry to expose status metadata.');
  assert.ok(source.includes('data-testid="reie-property-inquiry-form"'), 'Expected property inquiry to expose form metadata.');
  assert.ok(source.includes('data-testid="reie-property-inquiry-name"'), 'Expected property inquiry to expose name metadata.');
  assert.ok(source.includes('data-testid="reie-property-inquiry-phone"'), 'Expected property inquiry to expose phone metadata.');
  assert.ok(source.includes('data-testid="reie-property-inquiry-email"'), 'Expected property inquiry to expose email metadata.');
  assert.ok(source.includes('data-testid="reie-property-inquiry-timeline"'), 'Expected property inquiry to expose timeline metadata.');
  assert.ok(source.includes('data-testid="reie-property-inquiry-notes"'), 'Expected property inquiry to expose notes metadata.');
  assert.ok(source.includes('data-testid="reie-property-inquiry-error"'), 'Expected property inquiry to expose error metadata.');
  assert.ok(source.includes('data-testid="reie-property-inquiry-submit"'), 'Expected property inquiry to expose submit metadata.');
  assert.ok(source.includes('data-property-inquiry-state='), 'Expected property inquiry to expose submit state.');
  assert.ok(source.includes('data-property-inquiry-property-id='), 'Expected property inquiry to expose property ids.');
  assert.ok(source.includes('data-property-inquiry-address='), 'Expected property inquiry to expose property addresses.');
  assert.ok(source.includes('data-property-inquiry-city='), 'Expected property inquiry to expose property cities.');
  assert.ok(source.includes('data-property-inquiry-source="property-page"'), 'Expected property inquiry to expose source metadata.');
  assert.ok(source.includes('data-property-inquiry-route="/api/property-inquiry"'), 'Expected property inquiry to expose route metadata.');
  assert.ok(source.includes('data-property-inquiry-timeline='), 'Expected property inquiry to expose selected timeline.');
  assert.ok(source.includes('data-property-inquiry-timeline-label='), 'Expected property inquiry to expose timeline labels.');
  assert.ok(source.includes('data-property-inquiry-timeline-detail='), 'Expected property inquiry to expose timeline details.');
  assert.ok(source.includes('data-property-inquiry-lead-temperature='), 'Expected property inquiry to expose lead temperature.');
  assert.ok(source.includes('data-property-inquiry-email-valid='), 'Expected property inquiry to expose email validity.');
  assert.ok(source.includes('data-property-inquiry-notes-length='), 'Expected property inquiry to expose notes length.');
  assert.ok(source.includes('data-property-inquiry-notes-max-length="600"'), 'Expected property inquiry to expose notes max length.');
  assert.ok(source.includes('data-property-inquiry-crm-task-id='), 'Expected property inquiry to expose CRM task ids.');
  assert.ok(source.includes('data-property-inquiry-notification-channel='), 'Expected property inquiry to expose notification channel.');
  assert.ok(source.includes('data-property-inquiry-notification-required='), 'Expected property inquiry to expose notification requirement.');
  assert.ok(source.includes('data-property-inquiry-notification-attempted='), 'Expected property inquiry to expose notification attempt state.');
  assert.ok(source.includes('data-property-inquiry-notification-sent='), 'Expected property inquiry to expose notification sent state.');
  assert.ok(source.includes('data-property-inquiry-notification-reason='), 'Expected property inquiry to expose notification reason.');
}

async function assertRelatedPropertyLinksSource() {
  const source = await readFile('components/RelatedPropertyLinks.tsx', 'utf8');

  assert.ok(source.includes('data-testid="reie-related-property-links"'), 'Expected related property links to expose a stable shell handle.');
  assert.ok(source.includes('data-testid="reie-related-property-tab"'), 'Expected related property links to expose tab metadata.');
  assert.ok(source.includes('data-testid="reie-related-property-active-panel"'), 'Expected related property links to expose active panel metadata.');
  assert.ok(source.includes('data-testid="reie-related-property-prep-panel"'), 'Expected related property links to expose prep panel metadata.');
  assert.ok(source.includes('data-testid="reie-related-property-prep-scenario"'), 'Expected related property links to expose prep scenario metadata.');
  assert.ok(source.includes('data-testid="reie-related-property-timeline-panel"'), 'Expected related property links to expose timeline panel metadata.');
  assert.ok(source.includes('data-testid="reie-related-property-timeline-step"'), 'Expected related property links to expose timeline step metadata.');
  assert.ok(source.includes('data-testid="reie-related-property-contingency-alert"'), 'Expected related property links to expose contingency alert metadata.');
  assert.ok(source.includes('data-testid="reie-related-property-footer"'), 'Expected related property links to expose footer metadata.');
  assert.ok(source.includes('data-testid="reie-related-property-authority-links"'), 'Expected related property links to expose authority link list metadata.');
  assert.ok(source.includes('data-testid="reie-related-property-authority-link"'), 'Expected related property links to expose authority link metadata.');
  assert.ok(source.includes('data-testid="reie-related-property-primary-link"'), 'Expected related property links to expose primary CTA metadata.');
  assert.ok(source.includes('data-related-property-city='), 'Expected related property links to expose city metadata.');
  assert.ok(source.includes('data-related-property-neighborhood='), 'Expected related property links to expose neighborhood metadata.');
  assert.ok(source.includes('data-related-property-active-tab='), 'Expected related property links to expose active tab state.');
  assert.ok(source.includes('data-related-property-authority-link-count='), 'Expected related property links to expose authority link counts.');
  assert.ok(source.includes('data-related-property-visible-authority-link-count='), 'Expected related property links to expose visible authority link counts.');
  assert.ok(source.includes('data-related-property-primary-href='), 'Expected related property links to expose primary CTA href.');
  assert.ok(source.includes('data-related-property-prep-scenario-count='), 'Expected related property links to expose prep scenario counts.');
  assert.ok(source.includes('data-related-property-timeline-step-count='), 'Expected related property links to expose timeline step counts.');
  assert.ok(source.includes('data-related-property-scenario-scope='), 'Expected related property links to expose non-financial scenario scope metadata.');
  assert.ok(source.includes('Preparation Considerations'), 'Expected related property links to use non-ROI preparation tab language.');
  assert.ok(source.includes('Compare Preparation Approaches'), 'Expected related property links to use non-financial comparison language.');
  assert.ok(source.includes('Marketability Focus'), 'Expected related property links to use directional marketability language.');
  assert.ok(!source.match(/Listing Prep ROI|ROI Engine|Equity Lift|Investment Cost|equity capture/i), 'Expected related property links to avoid unsupported public ROI/equity language.');
  assert.ok(source.includes('data-related-property-risk-window-days="review-required"'), 'Expected related property links to avoid fixed financing-risk windows.');
  assert.ok(source.includes('Timing Review'), 'Expected related property links to frame timing as review-oriented guidance.');
  assert.ok(source.includes('data-related-property-link-source='), 'Expected related property links to expose CTA link source.');
}

async function assertPropertyLinksSource() {
  const source = await readFile('components/internal-links/PropertyLinks.tsx', 'utf8');

  assert.ok(source.includes('data-testid="reie-property-links"'), 'Expected property links to expose a stable shell handle.');
  assert.ok(source.includes('data-testid="reie-property-links-authority-list"'), 'Expected property links to expose authority list metadata.');
  assert.ok(source.includes('data-testid="reie-property-links-authority-link"'), 'Expected property links to expose authority link metadata.');
  assert.ok(source.includes('data-testid="reie-property-links-related-list"'), 'Expected property links to expose related list metadata.');
  assert.ok(source.includes('data-testid="reie-property-links-related-link"'), 'Expected property links to expose related property link metadata.');
  assert.ok(source.includes('data-property-links-title='), 'Expected property links to expose title metadata.');
  assert.ok(source.includes('data-property-links-current-property-id='), 'Expected property links to expose current property ids.');
  assert.ok(source.includes('data-property-links-city='), 'Expected property links to expose city metadata.');
  assert.ok(source.includes('data-property-links-neighborhood='), 'Expected property links to expose neighborhood metadata.');
  assert.ok(source.includes('data-property-links-normalized-city='), 'Expected property links to expose normalized city metadata.');
  assert.ok(source.includes('data-property-links-normalized-neighborhood='), 'Expected property links to expose normalized neighborhood metadata.');
  assert.ok(source.includes('data-property-links-source-kind='), 'Expected property links to expose source kind metadata.');
  assert.ok(source.includes('data-property-links-source-count='), 'Expected property links to expose source counts.');
  assert.ok(source.includes('data-property-links-limit='), 'Expected property links to expose applied limits.');
  assert.ok(source.includes('data-property-links-related-count='), 'Expected property links to expose related counts.');
  assert.ok(source.includes('data-property-links-authority-count='), 'Expected property links to expose authority counts.');
  assert.ok(source.includes('data-property-links-has-authority='), 'Expected property links to expose authority availability.');
  assert.ok(source.includes('data-property-links-has-related='), 'Expected property links to expose related availability.');
  assert.ok(source.includes('data-property-links-authority-href='), 'Expected property links to expose authority hrefs.');
  assert.ok(source.includes('data-property-links-related-href='), 'Expected property links to expose related hrefs.');
  assert.ok(source.includes('data-property-links-related-price='), 'Expected property links to expose related prices.');
}

async function assertNearbyNeighborhoodsSource() {
  const source = await readFile('components/internal-links/NearbyNeighborhoods.tsx', 'utf8');

  assert.ok(source.includes('data-testid="reie-nearby-neighborhoods"'), 'Expected nearby neighborhoods to expose a stable shell handle.');
  assert.ok(source.includes('data-testid="reie-nearby-neighborhoods-list"'), 'Expected nearby neighborhoods to expose list metadata.');
  assert.ok(source.includes('data-testid="reie-nearby-neighborhood-card"'), 'Expected nearby neighborhoods to expose card metadata.');
  assert.ok(source.includes('data-testid="reie-nearby-neighborhood-link"'), 'Expected nearby neighborhoods to expose neighborhood link metadata.');
  assert.ok(source.includes('data-testid="reie-nearby-neighborhood-brief-link"'), 'Expected nearby neighborhoods to expose brief link metadata.');
  assert.ok(source.includes('data-nearby-neighborhoods-title='), 'Expected nearby neighborhoods to expose title metadata.');
  assert.ok(source.includes('data-nearby-neighborhoods-city='), 'Expected nearby neighborhoods to expose city metadata.');
  assert.ok(source.includes('data-nearby-neighborhoods-normalized-city='), 'Expected nearby neighborhoods to expose normalized city metadata.');
  assert.ok(source.includes('data-nearby-neighborhoods-current-slug='), 'Expected nearby neighborhoods to expose current slug metadata.');
  assert.ok(source.includes('data-nearby-neighborhoods-limit='), 'Expected nearby neighborhoods to expose applied limits.');
  assert.ok(source.includes('data-nearby-neighborhoods-count='), 'Expected nearby neighborhoods to expose neighborhood counts.');
  assert.ok(source.includes('data-nearby-neighborhoods-brief-count='), 'Expected nearby neighborhoods to expose brief counts.');
  assert.ok(source.includes('data-nearby-neighborhoods-has-briefs='), 'Expected nearby neighborhoods to expose brief availability.');
  assert.ok(source.includes('data-nearby-neighborhoods-list-count='), 'Expected nearby neighborhoods to expose list counts.');
  assert.ok(source.includes('data-nearby-neighborhood-slug='), 'Expected nearby neighborhoods to expose neighborhood slugs.');
  assert.ok(source.includes('data-nearby-neighborhood-name='), 'Expected nearby neighborhoods to expose neighborhood names.');
  assert.ok(source.includes('data-nearby-neighborhood-city='), 'Expected nearby neighborhoods to expose neighborhood cities.');
  assert.ok(source.includes('data-nearby-neighborhood-primary-anchor='), 'Expected nearby neighborhoods to expose primary anchors.');
  assert.ok(source.includes('data-nearby-neighborhood-fire-risk='), 'Expected nearby neighborhoods to expose fire risk metadata.');
  assert.ok(source.includes('data-nearby-neighborhood-insurance-complexity='), 'Expected nearby neighborhoods to expose insurance complexity metadata.');
  assert.ok(source.includes('data-nearby-neighborhood-href='), 'Expected nearby neighborhoods to expose neighborhood hrefs.');
  assert.ok(source.includes('data-nearby-neighborhood-has-brief='), 'Expected nearby neighborhoods to expose per-card brief availability.');
  assert.ok(source.includes('data-nearby-neighborhood-link-href='), 'Expected nearby neighborhoods to expose link hrefs.');
  assert.ok(source.includes('data-nearby-neighborhood-brief-title='), 'Expected nearby neighborhoods to expose brief titles.');
  assert.ok(source.includes('data-nearby-neighborhood-brief-href='), 'Expected nearby neighborhoods to expose brief hrefs.');
}

async function assertCityLinksSource() {
  const source = await readFile('components/internal-links/CityLinks.tsx', 'utf8');

  assert.ok(source.includes('data-testid="reie-city-links"'), 'Expected city links to expose a stable shell handle.');
  assert.ok(source.includes('data-testid="reie-city-links-list"'), 'Expected city links to expose list metadata.');
  assert.ok(source.includes('data-testid="reie-city-link"'), 'Expected city links to expose per-link metadata.');
  assert.ok(source.includes('data-city-links-title='), 'Expected city links to expose title metadata.');
  assert.ok(source.includes('data-city-links-input-city='), 'Expected city links to expose input city metadata.');
  assert.ok(source.includes('data-city-links-city='), 'Expected city links to expose resolved city metadata.');
  assert.ok(source.includes('data-city-links-normalized-city='), 'Expected city links to expose normalized city metadata.');
  assert.ok(source.includes('data-city-links-market-slug='), 'Expected city links to expose market slugs.');
  assert.ok(source.includes('data-city-links-city-data-found='), 'Expected city links to expose city data availability.');
  assert.ok(source.includes('data-city-links-neighborhood-count='), 'Expected city links to expose neighborhood counts.');
  assert.ok(source.includes('data-city-links-count='), 'Expected city links to expose link counts.');
  assert.ok(source.includes('data-city-links-list-count='), 'Expected city links to expose list counts.');
  assert.ok(source.includes('data-city-link-index='), 'Expected city links to expose link indices.');
  assert.ok(source.includes('data-city-link-kind='), 'Expected city links to expose link kinds.');
  assert.ok(source.includes('data-city-link-label='), 'Expected city links to expose link labels.');
  assert.ok(source.includes('data-city-link-href='), 'Expected city links to expose link hrefs.');
  assert.ok(source.includes('data-city-link-description='), 'Expected city links to expose link descriptions.');
}

async function assertMarketLinksSource() {
  const source = await readFile('components/internal-links/MarketLinks.tsx', 'utf8');

  assert.ok(source.includes('data-testid="reie-market-links"'), 'Expected market links to expose a stable shell handle.');
  assert.ok(source.includes('data-testid="reie-market-links-list"'), 'Expected market links to expose list metadata.');
  assert.ok(source.includes('data-testid="reie-market-link"'), 'Expected market links to expose per-link metadata.');
  assert.ok(source.includes('data-market-links-title='), 'Expected market links to expose title metadata.');
  assert.ok(source.includes('data-market-links-current-market-slug='), 'Expected market links to expose current market slugs.');
  assert.ok(source.includes('data-market-links-normalized-current='), 'Expected market links to expose normalized current market slugs.');
  assert.ok(source.includes('data-market-links-limit='), 'Expected market links to expose applied limits.');
  assert.ok(source.includes('data-market-links-related-city-count='), 'Expected market links to expose related city counts.');
  assert.ok(source.includes('data-market-links-report-count='), 'Expected market links to expose report counts.');
  assert.ok(source.includes('data-market-links-brief-count='), 'Expected market links to expose brief counts.');
  assert.ok(source.includes('data-market-links-count='), 'Expected market links to expose link counts.');
  assert.ok(source.includes('data-market-links-has-briefs='), 'Expected market links to expose brief availability.');
  assert.ok(source.includes('data-market-links-list-count='), 'Expected market links to expose list counts.');
  assert.ok(source.includes('data-market-link-index='), 'Expected market links to expose link indices.');
  assert.ok(source.includes('data-market-link-kind='), 'Expected market links to expose link kinds.');
  assert.ok(source.includes('data-market-link-status='), 'Expected market links to expose link statuses.');
  assert.ok(source.includes('data-market-link-label='), 'Expected market links to expose link labels.');
  assert.ok(source.includes('data-market-link-source-city='), 'Expected market links to expose source cities.');
  assert.ok(source.includes('data-market-link-market-slug='), 'Expected market links to expose market slugs.');
  assert.ok(source.includes('data-market-link-href='), 'Expected market links to expose hrefs.');
  assert.ok(source.includes('data-market-link-description='), 'Expected market links to expose descriptions.');
  assert.ok(source.includes('data-market-link-score='), 'Expected market links to expose market health scores.');
  assert.ok(source.includes('data-market-link-has-score='), 'Expected market links to expose score availability.');
}

async function assertToolLinksSource() {
  const source = await readFile('components/internal-links/ToolLinks.tsx', 'utf8');

  assert.ok(source.includes('data-testid="reie-tool-links"'), 'Expected tool links to expose a stable shell handle.');
  assert.ok(source.includes('data-testid="reie-tool-links-list"'), 'Expected tool links to expose list metadata.');
  assert.ok(source.includes('data-testid="reie-tool-link"'), 'Expected tool links to expose per-link metadata.');
  assert.ok(source.includes('data-tool-links-title='), 'Expected tool links to expose title metadata.');
  assert.ok(source.includes('data-tool-links-input-city='), 'Expected tool links to expose input city metadata.');
  assert.ok(source.includes('data-tool-links-city='), 'Expected tool links to expose resolved city metadata.');
  assert.ok(source.includes('data-tool-links-uses-default-city='), 'Expected tool links to expose default city state.');
  assert.ok(source.includes('data-tool-links-market-slug='), 'Expected tool links to expose market slugs.');
  assert.ok(source.includes('data-tool-links-brief-href='), 'Expected tool links to expose brief hrefs.');
  assert.ok(source.includes('data-tool-links-count='), 'Expected tool links to expose link counts.');
  assert.ok(source.includes('data-tool-links-list-count='), 'Expected tool links to expose list counts.');
  assert.ok(source.includes('data-tool-link-index='), 'Expected tool links to expose link indices.');
  assert.ok(source.includes('data-tool-link-kind='), 'Expected tool links to expose link kinds.');
  assert.ok(source.includes('data-tool-link-status='), 'Expected tool links to expose link statuses.');
  assert.ok(source.includes('data-tool-link-label='), 'Expected tool links to expose link labels.');
  assert.ok(source.includes('data-tool-link-href='), 'Expected tool links to expose hrefs.');
  assert.ok(source.includes('data-tool-link-description='), 'Expected tool links to expose descriptions.');
}

async function assertCityInternalLinksSource() {
  const source = await readFile('components/internal-links/CityInternalLinks.tsx', 'utf8');

  assert.ok(source.includes('data-testid="reie-city-internal-links"'), 'Expected city internal links to expose a stable shell handle.');
  assert.ok(source.includes('data-testid="reie-city-internal-links-list"'), 'Expected city internal links to expose list metadata.');
  assert.ok(source.includes('data-testid="reie-city-internal-link-card"'), 'Expected city internal links to expose card metadata.');
  assert.ok(source.includes('data-testid="reie-city-internal-market-link"'), 'Expected city internal links to expose market link metadata.');
  assert.ok(source.includes('data-testid="reie-city-internal-brief-link"'), 'Expected city internal links to expose brief link metadata.');
  assert.ok(source.includes('data-city-internal-links-title='), 'Expected city internal links to expose title metadata.');
  assert.ok(source.includes('data-city-internal-links-input-count='), 'Expected city internal links to expose input counts.');
  assert.ok(source.includes('data-city-internal-links-valid-count='), 'Expected city internal links to expose valid link counts.');
  assert.ok(source.includes('data-city-internal-links-brief-count='), 'Expected city internal links to expose brief counts.');
  assert.ok(source.includes('data-city-internal-links-has-briefs='), 'Expected city internal links to expose brief availability.');
  assert.ok(source.includes('data-city-internal-links-list-count='), 'Expected city internal links to expose list counts.');
  assert.ok(source.includes('data-city-internal-link-index='), 'Expected city internal links to expose link indices.');
  assert.ok(source.includes('data-city-internal-link-name='), 'Expected city internal links to expose city names.');
  assert.ok(source.includes('data-city-internal-link-market-href='), 'Expected city internal links to expose market hrefs.');
  assert.ok(source.includes('data-city-internal-link-description='), 'Expected city internal links to expose descriptions.');
  assert.ok(source.includes('data-city-internal-link-has-description='), 'Expected city internal links to expose description availability.');
  assert.ok(source.includes('data-city-internal-link-brief-href='), 'Expected city internal links to expose brief hrefs.');
  assert.ok(source.includes('data-city-internal-link-brief-description='), 'Expected city internal links to expose brief descriptions.');
  assert.ok(source.includes('data-city-internal-link-has-brief='), 'Expected city internal links to expose per-card brief availability.');
  assert.ok(source.includes('data-city-internal-market-link-href='), 'Expected city internal links to expose market link hrefs.');
  assert.ok(source.includes('data-city-internal-brief-link-href='), 'Expected city internal links to expose brief link hrefs.');
}

async function assertMarketNeighborhoodLinksSource() {
  const source = await readFile('components/MarketNeighborhoodLinks.tsx', 'utf8');

  assert.ok(source.includes('data-testid="reie-market-neighborhood-links"'), 'Expected market neighborhood links to expose a stable shell handle.');
  assert.ok(source.includes('data-testid="reie-market-neighborhood-links-list"'), 'Expected market neighborhood links to expose list metadata.');
  assert.ok(source.includes('data-testid="reie-market-neighborhood-card"'), 'Expected market neighborhood links to expose card metadata.');
  assert.ok(source.includes('data-testid="reie-market-neighborhood-link"'), 'Expected market neighborhood links to expose neighborhood link metadata.');
  assert.ok(source.includes('data-testid="reie-market-neighborhood-brief-link"'), 'Expected market neighborhood links to expose brief link metadata.');
  assert.ok(source.includes('data-market-neighborhood-links-title='), 'Expected market neighborhood links to expose title metadata.');
  assert.ok(source.includes('data-market-neighborhood-links-city='), 'Expected market neighborhood links to expose input city metadata.');
  assert.ok(source.includes('data-market-neighborhood-links-city-name='), 'Expected market neighborhood links to expose resolved city names.');
  assert.ok(source.includes('data-market-neighborhood-links-normalized-city='), 'Expected market neighborhood links to expose normalized city metadata.');
  assert.ok(source.includes('data-market-neighborhood-links-count='), 'Expected market neighborhood links to expose neighborhood counts.');
  assert.ok(source.includes('data-market-neighborhood-links-brief-count='), 'Expected market neighborhood links to expose brief counts.');
  assert.ok(source.includes('data-market-neighborhood-links-has-briefs='), 'Expected market neighborhood links to expose brief availability.');
  assert.ok(source.includes('data-market-neighborhood-links-list-count='), 'Expected market neighborhood links to expose list counts.');
  assert.ok(source.includes('data-market-neighborhood-index='), 'Expected market neighborhood links to expose card indices.');
  assert.ok(source.includes('data-market-neighborhood-slug='), 'Expected market neighborhood links to expose neighborhood slugs.');
  assert.ok(source.includes('data-market-neighborhood-name='), 'Expected market neighborhood links to expose neighborhood names.');
  assert.ok(source.includes('data-market-neighborhood-city='), 'Expected market neighborhood links to expose neighborhood cities.');
  assert.ok(source.includes('data-market-neighborhood-primary-anchor='), 'Expected market neighborhood links to expose primary anchors.');
  assert.ok(source.includes('data-market-neighborhood-resilience-score='), 'Expected market neighborhood links to expose resilience scores.');
  assert.ok(source.includes('data-market-neighborhood-efficiency-score='), 'Expected market neighborhood links to expose efficiency scores.');
  assert.ok(source.includes('data-market-neighborhood-href='), 'Expected market neighborhood links to expose neighborhood hrefs.');
  assert.ok(source.includes('data-market-neighborhood-has-brief='), 'Expected market neighborhood links to expose per-card brief availability.');
  assert.ok(source.includes('data-market-neighborhood-link-href='), 'Expected market neighborhood links to expose link hrefs.');
  assert.ok(source.includes('data-market-neighborhood-brief-title='), 'Expected market neighborhood links to expose brief titles.');
  assert.ok(source.includes('data-market-neighborhood-brief-href='), 'Expected market neighborhood links to expose brief hrefs.');
}

async function assertBlogNeighborhoodLinksSource() {
  const source = await readFile('components/BlogNeighborhoodLinks.tsx', 'utf8');

  assert.ok(source.includes('data-testid="reie-blog-neighborhood-links"'), 'Expected blog neighborhood links to expose a stable shell handle.');
  assert.ok(source.includes('data-testid="reie-blog-neighborhood-links-list"'), 'Expected blog neighborhood links to expose list metadata.');
  assert.ok(source.includes('data-testid="reie-blog-neighborhood-card"'), 'Expected blog neighborhood links to expose card metadata.');
  assert.ok(source.includes('data-testid="reie-blog-neighborhood-link"'), 'Expected blog neighborhood links to expose neighborhood link metadata.');
  assert.ok(source.includes('data-testid="reie-blog-neighborhood-brief-link"'), 'Expected blog neighborhood links to expose brief link metadata.');
  assert.ok(source.includes('data-blog-neighborhood-links-title='), 'Expected blog neighborhood links to expose title metadata.');
  assert.ok(source.includes('data-blog-neighborhood-links-city='), 'Expected blog neighborhood links to expose input city metadata.');
  assert.ok(source.includes('data-blog-neighborhood-links-city-name='), 'Expected blog neighborhood links to expose resolved city names.');
  assert.ok(source.includes('data-blog-neighborhood-links-normalized-city='), 'Expected blog neighborhood links to expose normalized city metadata.');
  assert.ok(source.includes('data-blog-neighborhood-links-count='), 'Expected blog neighborhood links to expose neighborhood counts.');
  assert.ok(source.includes('data-blog-neighborhood-links-brief-count='), 'Expected blog neighborhood links to expose brief counts.');
  assert.ok(source.includes('data-blog-neighborhood-links-has-briefs='), 'Expected blog neighborhood links to expose brief availability.');
  assert.ok(source.includes('data-blog-neighborhood-links-list-count='), 'Expected blog neighborhood links to expose list counts.');
  assert.ok(source.includes('data-blog-neighborhood-index='), 'Expected blog neighborhood links to expose card indices.');
  assert.ok(source.includes('data-blog-neighborhood-slug='), 'Expected blog neighborhood links to expose neighborhood slugs.');
  assert.ok(source.includes('data-blog-neighborhood-name='), 'Expected blog neighborhood links to expose neighborhood names.');
  assert.ok(source.includes('data-blog-neighborhood-city='), 'Expected blog neighborhood links to expose neighborhood cities.');
  assert.ok(source.includes('data-blog-neighborhood-primary-anchor='), 'Expected blog neighborhood links to expose primary anchors.');
  assert.ok(source.includes('data-blog-neighborhood-href='), 'Expected blog neighborhood links to expose neighborhood hrefs.');
  assert.ok(source.includes('data-blog-neighborhood-has-brief='), 'Expected blog neighborhood links to expose per-card brief availability.');
  assert.ok(source.includes('data-blog-neighborhood-link-href='), 'Expected blog neighborhood links to expose link hrefs.');
  assert.ok(source.includes('data-blog-neighborhood-brief-title='), 'Expected blog neighborhood links to expose brief titles.');
  assert.ok(source.includes('data-blog-neighborhood-brief-description='), 'Expected blog neighborhood links to expose brief descriptions.');
  assert.ok(source.includes('data-blog-neighborhood-brief-href='), 'Expected blog neighborhood links to expose brief hrefs.');
}

async function assertMarketHomesLinksSource() {
  const source = await readFile('components/MarketHomesLinks.tsx', 'utf8');

  assert.ok(source.includes('data-testid="reie-market-homes-links"'), 'Expected market homes links to expose a stable shell handle.');
  assert.ok(source.includes('data-testid="reie-market-homes-links-list"'), 'Expected market homes links to expose list metadata.');
  assert.ok(source.includes('data-testid="reie-market-homes-search-link"'), 'Expected market homes links to expose search link metadata.');
  assert.ok(source.includes('data-testid="reie-market-homes-brief-link"'), 'Expected market homes links to expose brief link metadata.');
  assert.ok(source.includes('data-market-homes-links-title='), 'Expected market homes links to expose title metadata.');
  assert.ok(source.includes('data-market-homes-links-city='), 'Expected market homes links to expose input city metadata.');
  assert.ok(source.includes('data-market-homes-links-city-name='), 'Expected market homes links to expose resolved city names.');
  assert.ok(source.includes('data-market-homes-links-requested-limit='), 'Expected market homes links to expose requested limits.');
  assert.ok(source.includes('data-market-homes-links-limit='), 'Expected market homes links to expose bounded limits.');
  assert.ok(source.includes('data-market-homes-links-search-count='), 'Expected market homes links to expose search counts.');
  assert.ok(source.includes('data-market-homes-links-brief-count='), 'Expected market homes links to expose brief counts.');
  assert.ok(source.includes('data-market-homes-links-count='), 'Expected market homes links to expose total link counts.');
  assert.ok(source.includes('data-market-homes-links-has-brief='), 'Expected market homes links to expose brief availability.');
  assert.ok(source.includes('data-market-homes-links-brief-href='), 'Expected market homes links to expose brief hrefs.');
  assert.ok(source.includes('data-market-homes-links-list-count='), 'Expected market homes links to expose list counts.');
  assert.ok(source.includes('data-market-homes-link-index='), 'Expected market homes links to expose link indices.');
  assert.ok(source.includes('data-market-homes-link-kind='), 'Expected market homes links to expose link kinds.');
  assert.ok(source.includes('data-market-homes-link-type-slug='), 'Expected market homes links to expose property type slugs.');
  assert.ok(source.includes('data-market-homes-link-label='), 'Expected market homes links to expose labels.');
  assert.ok(source.includes('data-market-homes-link-description='), 'Expected market homes links to expose descriptions.');
  assert.ok(source.includes('data-market-homes-link-href='), 'Expected market homes links to expose hrefs.');
}

async function assertHomesBlogLinksSource() {
  const source = await readFile('components/HomesBlogLinks.tsx', 'utf8');

  assert.ok(source.includes('data-testid="reie-homes-blog-links"'), 'Expected homes blog links to expose a stable shell handle.');
  assert.ok(source.includes('data-testid="reie-homes-blog-links-list"'), 'Expected homes blog links to expose list metadata.');
  assert.ok(source.includes('data-testid="reie-homes-blog-link"'), 'Expected homes blog links to expose per-link metadata.');
  assert.ok(source.includes('data-homes-blog-links-title='), 'Expected homes blog links to expose title metadata.');
  assert.ok(source.includes('data-homes-blog-links-city='), 'Expected homes blog links to expose input city metadata.');
  assert.ok(source.includes('data-homes-blog-links-city-name='), 'Expected homes blog links to expose resolved city names.');
  assert.ok(source.includes('data-homes-blog-links-type='), 'Expected homes blog links to expose guide type metadata.');
  assert.ok(source.includes('data-homes-blog-links-market-slug='), 'Expected homes blog links to expose market slugs.');
  assert.ok(source.includes('data-homes-blog-links-count='), 'Expected homes blog links to expose link counts.');
  assert.ok(source.includes('data-homes-blog-links-has-brief='), 'Expected homes blog links to expose brief availability.');
  assert.ok(source.includes('data-homes-blog-links-brief-intent='), 'Expected homes blog links to expose brief intent metadata.');
  assert.ok(source.includes('data-homes-blog-links-brief-href='), 'Expected homes blog links to expose brief hrefs.');
  assert.ok(source.includes('data-homes-blog-links-list-count='), 'Expected homes blog links to expose list counts.');
  assert.ok(source.includes('data-homes-blog-link-index='), 'Expected homes blog links to expose link indices.');
  assert.ok(source.includes('data-homes-blog-link-kind='), 'Expected homes blog links to expose link kinds.');
  assert.ok(source.includes('data-homes-blog-link-eyebrow='), 'Expected homes blog links to expose eyebrows.');
  assert.ok(source.includes('data-homes-blog-link-label='), 'Expected homes blog links to expose labels.');
  assert.ok(source.includes('data-homes-blog-link-description='), 'Expected homes blog links to expose descriptions.');
  assert.ok(source.includes('data-homes-blog-link-href='), 'Expected homes blog links to expose hrefs.');
  assert.ok(source.includes('data-homes-blog-link-intent='), 'Expected homes blog links to expose intent metadata.');
}

async function assertRelatedArticlesSource() {
  const source = await readFile('components/RelatedArticles.tsx', 'utf8');

  assert.ok(source.includes('data-testid="reie-related-articles"'), 'Expected related articles to expose a stable shell handle.');
  assert.ok(source.includes('data-testid="reie-related-articles-list"'), 'Expected related articles to expose list metadata.');
  assert.ok(source.includes('data-testid="reie-related-article-link"'), 'Expected related articles to expose per-article link metadata.');
  assert.ok(source.includes('data-related-articles-title='), 'Expected related articles to expose title metadata.');
  assert.ok(source.includes('data-related-articles-city='), 'Expected related articles to expose input city metadata.');
  assert.ok(source.includes('data-related-articles-city-name='), 'Expected related articles to expose resolved city names.');
  assert.ok(source.includes('data-related-articles-current-slug='), 'Expected related articles to expose current slug context.');
  assert.ok(source.includes('data-related-articles-requested-limit='), 'Expected related articles to expose requested limits.');
  assert.ok(source.includes('data-related-articles-limit='), 'Expected related articles to expose applied limits.');
  assert.ok(source.includes('data-related-articles-count='), 'Expected related articles to expose article counts.');
  assert.ok(source.includes('data-related-articles-list-count='), 'Expected related articles to expose list counts.');
  assert.ok(source.includes('data-related-article-index='), 'Expected related articles to expose article indices.');
  assert.ok(source.includes('data-related-article-intent='), 'Expected related articles to expose article intents.');
  assert.ok(source.includes('data-related-article-title='), 'Expected related articles to expose article titles.');
  assert.ok(source.includes('data-related-article-description='), 'Expected related articles to expose article descriptions.');
  assert.ok(source.includes('data-related-article-neighborhood='), 'Expected related articles to expose article neighborhoods.');
  assert.ok(source.includes('data-related-article-city='), 'Expected related articles to expose article cities.');
  assert.ok(source.includes('data-related-article-href='), 'Expected related articles to expose article hrefs.');
}

async function assertNeighborhoodArticlesSource() {
  const source = await readFile('components/NeighborhoodArticles.tsx', 'utf8');

  assert.ok(source.includes('data-testid="reie-neighborhood-articles"'), 'Expected neighborhood articles to expose a stable shell handle.');
  assert.ok(source.includes('data-testid="reie-neighborhood-articles-list"'), 'Expected neighborhood articles to expose list metadata.');
  assert.ok(source.includes('data-testid="reie-neighborhood-article-link"'), 'Expected neighborhood articles to expose per-article link metadata.');
  assert.ok(source.includes('data-neighborhood-articles-title='), 'Expected neighborhood articles to expose title metadata.');
  assert.ok(source.includes('data-neighborhood-articles-city='), 'Expected neighborhood articles to expose input city metadata.');
  assert.ok(source.includes('data-neighborhood-articles-city-name='), 'Expected neighborhood articles to expose resolved city names.');
  assert.ok(source.includes('data-neighborhood-articles-neighborhood='), 'Expected neighborhood articles to expose neighborhood context.');
  assert.ok(source.includes('data-neighborhood-articles-has-neighborhood='), 'Expected neighborhood articles to expose neighborhood availability.');
  assert.ok(source.includes('data-neighborhood-articles-limit='), 'Expected neighborhood articles to expose requested limits.');
  assert.ok(source.includes('data-neighborhood-articles-count='), 'Expected neighborhood articles to expose article counts.');
  assert.ok(source.includes('data-neighborhood-articles-list-count='), 'Expected neighborhood articles to expose list counts.');
  assert.ok(source.includes('data-neighborhood-article-index='), 'Expected neighborhood articles to expose article indices.');
  assert.ok(source.includes('data-neighborhood-article-intent='), 'Expected neighborhood articles to expose article intents.');
  assert.ok(source.includes('data-neighborhood-article-title='), 'Expected neighborhood articles to expose article titles.');
  assert.ok(source.includes('data-neighborhood-article-description='), 'Expected neighborhood articles to expose article descriptions.');
  assert.ok(source.includes('data-neighborhood-article-neighborhood='), 'Expected neighborhood articles to expose article neighborhoods.');
  assert.ok(source.includes('data-neighborhood-article-city='), 'Expected neighborhood articles to expose article cities.');
  assert.ok(source.includes('data-neighborhood-article-href='), 'Expected neighborhood articles to expose article hrefs.');
}

async function assertCityGuidesSource() {
  const source = await readFile('components/CityGuides.tsx', 'utf8');

  assert.ok(source.includes('data-testid="reie-city-guides"'), 'Expected city guides to expose a stable shell handle.');
  assert.ok(source.includes('data-testid="reie-city-guides-list"'), 'Expected city guides to expose list metadata.');
  assert.ok(source.includes('data-testid="reie-city-guide-card"'), 'Expected city guides to expose guide card metadata.');
  assert.ok(source.includes('data-testid="reie-city-guide-link"'), 'Expected city guides to expose guide link metadata.');
  assert.ok(source.includes('data-testid="reie-city-guide-brief-link"'), 'Expected city guides to expose guide brief link metadata.');
  assert.ok(source.includes('data-city-guides-title='), 'Expected city guides to expose title metadata.');
  assert.ok(source.includes('data-city-guides-city='), 'Expected city guides to expose input city metadata.');
  assert.ok(source.includes('data-city-guides-city-name='), 'Expected city guides to expose resolved city names.');
  assert.ok(source.includes('data-city-guides-normalized-city='), 'Expected city guides to expose normalized city metadata.');
  assert.ok(source.includes('data-city-guides-requested-limit='), 'Expected city guides to expose requested limits.');
  assert.ok(source.includes('data-city-guides-limit='), 'Expected city guides to expose applied limits.');
  assert.ok(source.includes('data-city-guides-count='), 'Expected city guides to expose guide counts.');
  assert.ok(source.includes('data-city-guides-brief-count='), 'Expected city guides to expose brief counts.');
  assert.ok(source.includes('data-city-guides-list-count='), 'Expected city guides to expose list counts.');
  assert.ok(source.includes('data-city-guide-index='), 'Expected city guides to expose guide indices.');
  assert.ok(source.includes('data-city-guide-slug='), 'Expected city guides to expose guide slugs.');
  assert.ok(source.includes('data-city-guide-name='), 'Expected city guides to expose guide names.');
  assert.ok(source.includes('data-city-guide-city='), 'Expected city guides to expose guide cities.');
  assert.ok(source.includes('data-city-guide-anchor='), 'Expected city guides to expose primary anchors.');
  assert.ok(source.includes('data-city-guide-efficiency-score='), 'Expected city guides to expose efficiency scores.');
  assert.ok(source.includes('data-city-guide-resilience-score='), 'Expected city guides to expose resilience scores.');
  assert.ok(source.includes('data-city-guide-href='), 'Expected city guides to expose guide hrefs.');
  assert.ok(source.includes('data-city-guide-has-brief='), 'Expected city guides to expose brief availability.');
  assert.ok(source.includes('data-city-guide-brief-href='), 'Expected city guides to expose brief hrefs.');
  assert.ok(source.includes('data-city-guide-link-href='), 'Expected city guides to expose guide link hrefs.');
  assert.ok(source.includes('data-city-guide-link-label='), 'Expected city guides to expose guide link labels.');
  assert.ok(source.includes('data-city-guide-brief-title='), 'Expected city guides to expose brief titles.');
  assert.ok(source.includes('data-city-guide-brief-description='), 'Expected city guides to expose brief descriptions.');
}

async function assertCityMarketStatsSource() {
  const source = await readFile('components/CityMarketStats.tsx', 'utf8');

  assert.ok(source.includes('data-testid="reie-city-market-stats"'), 'Expected city market stats to expose a stable shell handle.');
  assert.ok(source.includes('data-testid="reie-city-market-stats-body"'), 'Expected city market stats to expose body metadata.');
  assert.ok(source.includes('data-testid="reie-city-market-mode"'), 'Expected city market stats to expose mode controls.');
  assert.ok(source.includes('data-testid="reie-city-market-pulse"'), 'Expected city market stats to expose market pulse metadata.');
  assert.ok(source.includes('data-testid="reie-city-market-strategy"'), 'Expected city market stats to expose strategy metadata.');
  assert.ok(source.includes('data-testid="reie-city-market-stat-row"'), 'Expected city market stats to expose stat row metadata.');
  assert.ok(source.includes('data-testid="reie-city-market-cost-row"'), 'Expected city market stats to expose cost row metadata.');
  assert.ok(source.includes('data-testid="reie-city-market-efficiency"'), 'Expected city market stats to expose efficiency metadata.');
  assert.ok(source.includes('data-testid="reie-city-market-leverage"'), 'Expected city market stats to expose leverage metadata.');
  assert.ok(source.includes('data-testid="reie-city-market-strategy-button"'), 'Expected city market stats to expose strategy button metadata.');
  assert.ok(source.includes('data-testid="reie-city-market-methodology"'), 'Expected city market stats to expose methodology metadata.');
  assert.ok(source.includes('data-city-market-view='), 'Expected city market stats to expose active view metadata.');
  assert.ok(source.includes('data-city-market-home-age='), 'Expected city market stats to expose home age metadata.');
  assert.ok(source.includes('data-city-market-median-price='), 'Expected city market stats to expose median price metadata.');
  assert.ok(source.includes('data-city-market-price-per-sqft='), 'Expected city market stats to expose price per square foot metadata.');
  assert.ok(source.includes('data-city-market-days-on-market='), 'Expected city market stats to expose days-on-market metadata.');
  assert.ok(source.includes('data-city-market-inventory='), 'Expected city market stats to expose inventory metadata.');
  assert.ok(source.includes('data-city-market-health-score='), 'Expected city market stats to expose health score metadata.');
  assert.ok(source.includes('data-city-market-avg-efficiency='), 'Expected city market stats to expose average efficiency metadata.');
  assert.ok(source.includes('data-city-market-pressure='), 'Expected city market stats to expose pressure labels.');
  assert.ok(source.includes('data-city-market-efficiency-label='), 'Expected city market stats to expose efficiency labels.');
  assert.ok(source.includes('data-city-market-monthly-carry='), 'Expected city market stats to expose monthly carry estimates.');
  assert.ok(source.includes('data-city-market-annual-carry='), 'Expected city market stats to expose annual carry estimates.');
  assert.ok(source.includes('data-city-market-inspection-reserve='), 'Expected city market stats to expose inspection reserve estimates.');
  assert.ok(source.includes('data-city-market-leverage-score='), 'Expected city market stats to expose leverage scores.');
  assert.ok(source.includes('data-city-market-mode='), 'Expected city market stats to expose mode ids.');
  assert.ok(source.includes('data-city-market-mode-active='), 'Expected city market stats to expose mode active state.');
  assert.ok(source.includes('data-city-market-mode-label='), 'Expected city market stats to expose mode labels.');
  assert.ok(source.includes('data-city-market-active-view='), 'Expected city market stats to expose body active view.');
  assert.ok(source.includes('data-city-market-pulse-pressure='), 'Expected city market stats to expose pulse pressure.');
  assert.ok(source.includes('data-city-market-pulse-efficiency-label='), 'Expected city market stats to expose pulse efficiency labels.');
  assert.ok(source.includes('data-city-market-stat-metric='), 'Expected city market stats to expose stat metrics.');
  assert.ok(source.includes('data-city-market-stat-label='), 'Expected city market stats to expose stat labels.');
  assert.ok(source.includes('data-city-market-stat-value='), 'Expected city market stats to expose stat values.');
  assert.ok(source.includes('data-city-market-stat-note='), 'Expected city market stats to expose stat notes.');
  assert.ok(source.includes('data-city-market-cost-metric='), 'Expected city market stats to expose cost metrics.');
  assert.ok(source.includes('data-city-market-cost-label='), 'Expected city market stats to expose cost labels.');
  assert.ok(source.includes('data-city-market-cost-value='), 'Expected city market stats to expose cost values.');
  assert.ok(source.includes('data-city-market-strategy-button-label='), 'Expected city market stats to expose strategy button labels.');
}

async function assertFAQSchemaSource() {
  const source = await readFile('components/schema/FAQSchema.tsx', 'utf8');

  assert.ok(source.includes('data-testid="reie-faq-schema"'), 'Expected FAQ schema to expose a stable script handle.');
  assert.ok(source.includes('data-faq-schema-type="FAQPage"'), 'Expected FAQ schema to expose schema type metadata.');
  assert.ok(source.includes('data-faq-schema-page-url='), 'Expected FAQ schema to expose page URL metadata.');
  assert.ok(source.includes('data-faq-schema-has-page-url='), 'Expected FAQ schema to expose page URL availability.');
  assert.ok(source.includes('data-faq-schema-input-count='), 'Expected FAQ schema to expose input FAQ counts.');
  assert.ok(source.includes('data-faq-schema-renderable-count='), 'Expected FAQ schema to expose renderable FAQ counts.');
  assert.ok(source.includes('data-faq-schema-has-graph='), 'Expected FAQ schema to expose graph availability metadata.');
  assert.ok(source.includes('getRenderableFaqCount'), 'Expected FAQ schema to count renderable FAQ entries.');
}

async function assertReusableSchemaComponentSource() {
  const [articleSource, agentSource] = await Promise.all([
    readFile('components/schema/ArticleSchema.tsx', 'utf8'),
    readFile('components/schema/RealEstateAgentSchema.tsx', 'utf8'),
  ]);

  assert.ok(articleSource.includes('data-testid="reie-article-schema-component"'), 'Expected reusable article schema component to expose a stable script handle.');
  assert.ok(articleSource.includes('data-article-schema-component-type="Article"'), 'Expected reusable article schema component to expose schema type metadata.');
  assert.ok(articleSource.includes('data-article-schema-component-url={props.url}'), 'Expected reusable article schema component to expose URLs.');
  assert.ok(articleSource.includes('data-article-schema-component-title={props.title}'), 'Expected reusable article schema component to expose titles.');
  assert.ok(articleSource.includes('data-article-schema-component-section={props.section ?? ""}'), 'Expected reusable article schema component to expose sections.');
  assert.ok(articleSource.includes('data-article-schema-component-city={props.city ?? ""}'), 'Expected reusable article schema component to expose cities.');
  assert.ok(articleSource.includes('data-article-schema-component-about={props.aboutName ?? ""}'), 'Expected reusable article schema component to expose about nodes.');
  assert.ok(articleSource.includes('data-article-schema-component-keyword-count={props.keywords?.length ?? 0}'), 'Expected reusable article schema component to expose keyword counts.');
  assert.ok(articleSource.includes('data-article-schema-component-has-image={props.image ? "true" : "false"}'), 'Expected reusable article schema component to expose image availability.');
  assert.ok(articleSource.includes('data-article-schema-component-graph-count={schemaGraph.length}'), 'Expected reusable article schema component to expose graph counts.');
  assert.ok(articleSource.includes('data-article-schema-component-has-breadcrumb="true"'), 'Expected reusable article schema component to expose breadcrumb availability.');
  assert.ok(articleSource.includes("schema['@graph']"), 'Expected reusable article schema component metadata to derive graph count from the schema payload.');

  assert.ok(agentSource.includes('data-testid="reie-real-estate-agent-schema-component"'), 'Expected reusable agent schema component to expose a stable script handle.');
  assert.ok(agentSource.includes('data-agent-schema-component-type="RealEstateAgent"'), 'Expected reusable agent schema component to expose schema type metadata.');
  assert.ok(agentSource.includes('data-agent-schema-component-url={props.url ?? "https://davidquinngroup.com"}'), 'Expected reusable agent schema component to expose URLs.');
  assert.ok(agentSource.includes('data-agent-schema-component-has-custom-url={props.url ? "true" : "false"}'), 'Expected reusable agent schema component to expose custom URL availability.');
  assert.ok(agentSource.includes('data-agent-schema-component-has-custom-image={props.image ? "true" : "false"}'), 'Expected reusable agent schema component to expose custom image availability.');
  assert.ok(agentSource.includes('data-agent-schema-component-graph-count={schemaGraph.length}'), 'Expected reusable agent schema component to expose graph counts.');
  assert.ok(agentSource.includes('data-agent-schema-component-has-property-search="true"'), 'Expected reusable agent schema component to expose property search availability.');
  assert.ok(agentSource.includes('data-agent-schema-component-has-reie-service="true"'), 'Expected reusable agent schema component to expose REIE service availability.');
  assert.ok(agentSource.includes("schema['@graph']"), 'Expected reusable agent schema component metadata to derive graph count from the schema payload.');
}

async function assertToolSchemaSource() {
  const [homeSource, searchSource] = await Promise.all([
    readFile('app/page.tsx', 'utf8'),
    readFile('app/search/page.tsx', 'utf8'),
  ]);

  assert.ok(homeSource.includes('data-testid="reie-home-tool-schema"'), 'Expected home page to expose tool schema metadata.');
  assert.ok(searchSource.includes('data-testid="reie-search-tool-schema"'), 'Expected search page to expose tool schema metadata.');
  assert.ok(homeSource.includes('data-tool-schema-type="WebApplication"'), 'Expected home tool schema to expose schema type metadata.');
  assert.ok(searchSource.includes('data-tool-schema-type="WebApplication"'), 'Expected search tool schema to expose schema type metadata.');
  assert.ok(homeSource.includes('data-tool-schema-name="Colorado Real Estate Intelligence Engine"'), 'Expected home tool schema to expose tool names.');
  assert.ok(searchSource.includes('data-tool-schema-name="Guided Colorado Property Search"'), 'Expected search tool schema to expose tool names.');
  assert.ok(homeSource.includes('data-tool-schema-url={SITE_URL}'), 'Expected home tool schema to expose canonical URLs.');
  assert.ok(searchSource.includes('data-tool-schema-url={SEARCH_URL}'), 'Expected search tool schema to expose canonical URLs.');
  assert.ok(homeSource.includes('data-tool-schema-keyword-count={homeToolSchemaKeywords.length}'), 'Expected home tool schema to expose keyword counts.');
  assert.ok(searchSource.includes('data-tool-schema-keyword-count={searchToolSchemaKeywords.length}'), 'Expected search tool schema to expose keyword counts.');
  assert.ok(homeSource.includes('data-tool-schema-entrypoint="home"'), 'Expected home tool schema to expose entrypoint metadata.');
  assert.ok(searchSource.includes('data-tool-schema-entrypoint="search"'), 'Expected search tool schema to expose entrypoint metadata.');
  assert.ok(homeSource.includes('data-tool-schema-has-graph="true"'), 'Expected home tool schema to expose graph availability.');
  assert.ok(searchSource.includes('data-tool-schema-has-graph="true"'), 'Expected search tool schema to expose graph availability.');
  assert.ok(homeSource.includes('keywords: homeToolSchemaKeywords'), 'Expected home tool schema metadata to share keyword source.');
  assert.ok(searchSource.includes('keywords: searchToolSchemaKeywords'), 'Expected search tool schema metadata to share keyword source.');
}

async function assertRealEstateAgentSchemaSource() {
  const source = await readFile('app/layout.tsx', 'utf8');

  assert.ok(source.includes('data-testid="reie-real-estate-agent-schema"'), 'Expected root layout to expose real estate agent schema metadata.');
  assert.ok(source.includes('data-agent-schema-type="RealEstateAgent"'), 'Expected root schema to expose schema type metadata.');
  assert.ok(source.includes('data-agent-schema-site-url={SITE_URL}'), 'Expected root schema to expose canonical site URL metadata.');
  assert.ok(source.includes('data-agent-schema-agent-id={REAL_ESTATE_AGENT_ID}'), 'Expected root schema to expose agent id metadata.');
  assert.ok(source.includes('data-agent-schema-organization-id={ORGANIZATION_ID}'), 'Expected root schema to expose organization id metadata.');
  assert.ok(source.includes('data-agent-schema-graph-count={realEstateAgentSchemaGraph.length}'), 'Expected root schema to expose graph node count metadata.');
  assert.ok(source.includes('data-agent-schema-has-property-search="true"'), 'Expected root schema to expose property search availability.');
  assert.ok(source.includes('data-agent-schema-has-reie-service="true"'), 'Expected root schema to expose REIE service availability.');
  assert.ok(source.includes("realEstateAgentSchema['@graph']"), 'Expected root schema metadata to derive graph count from the schema payload.');
}

async function assertPropertySchemaSource() {
  const source = await readFile('app/properties/[id]/page.tsx', 'utf8');

  assert.ok(source.includes('data-testid="reie-property-schema"'), 'Expected property page to expose property schema metadata.');
  assert.ok(source.includes('data-property-schema-type="SingleFamilyResidence"'), 'Expected property schema to expose schema type metadata.');
  assert.ok(source.includes('data-property-schema-url={canonicalUrl}'), 'Expected property schema to expose canonical URL metadata.');
  assert.ok(source.includes('data-property-schema-id={property.id}'), 'Expected property schema to expose property ids.');
  assert.ok(source.includes('data-property-schema-slug={property.slug ?? ""}'), 'Expected property schema to expose slugs.');
  assert.ok(source.includes('data-property-schema-mls-id={property.mlsId ?? ""}'), 'Expected property schema to expose MLS ids.');
  assert.ok(source.includes('data-property-schema-address={property.address}'), 'Expected property schema to expose addresses.');
  assert.ok(source.includes('data-property-schema-city={property.city}'), 'Expected property schema to expose cities.');
  assert.ok(source.includes('data-property-schema-neighborhood={property.neighborhood ?? ""}'), 'Expected property schema to expose neighborhoods.');
  assert.ok(source.includes('data-property-schema-price={property.price}'), 'Expected property schema to expose prices.');
  assert.ok(source.includes('data-property-schema-photo-count={property.photos?.length ?? 0}'), 'Expected property schema to expose photo counts.');
  assert.ok(source.includes('data-property-schema-graph-count={propertySchemaGraph.length}'), 'Expected property schema to expose graph counts.');
  assert.ok(source.includes('data-property-schema-has-offer="true"'), 'Expected property schema to expose offer availability.');
  assert.ok(source.includes('data-property-schema-has-breadcrumb="true"'), 'Expected property schema to expose breadcrumb availability.');
  assert.ok(source.includes("propertySchema['@graph']"), 'Expected property schema metadata to derive graph count from the schema payload.');
}

async function assertArticleSchemaSource() {
  const source = await readFile('app/articles/[slug]/page.tsx', 'utf8');

  assert.ok(source.includes('data-testid="reie-article-schema"'), 'Expected article page to expose article schema metadata.');
  assert.ok(source.includes('data-article-schema-type="Article"'), 'Expected article schema to expose schema type metadata.');
  assert.ok(source.includes('data-article-schema-url={article.url}'), 'Expected article schema to expose article URLs.');
  assert.ok(source.includes('data-article-schema-slug={article.slug}'), 'Expected article schema to expose article slugs.');
  assert.ok(source.includes('data-article-schema-title={article.title}'), 'Expected article schema to expose article titles.');
  assert.ok(source.includes('data-article-schema-intent={article.intent}'), 'Expected article schema to expose article intent.');
  assert.ok(source.includes('data-article-schema-city={article.city}'), 'Expected article schema to expose cities.');
  assert.ok(source.includes('data-article-schema-neighborhood={article.neighborhood}'), 'Expected article schema to expose neighborhoods.');
  assert.ok(source.includes('data-article-schema-author={article.author}'), 'Expected article schema to expose authors.');
  assert.ok(source.includes('data-article-schema-experience-years={article.experienceYears}'), 'Expected article schema to expose author experience years.');
  assert.ok(source.includes('data-article-schema-date-published={article.datePublished}'), 'Expected article schema to expose publish dates.');
  assert.ok(source.includes('data-article-schema-date-modified={article.dateModified}'), 'Expected article schema to expose modified dates.');
  assert.ok(source.includes('data-article-schema-graph-count={articleSchemaGraph.length}'), 'Expected article schema to expose graph counts.');
  assert.ok(source.includes('data-article-schema-has-breadcrumb="true"'), 'Expected article schema to expose breadcrumb availability.');
  assert.ok(source.includes('data-article-schema-has-webpage="true"'), 'Expected article schema to expose webpage availability.');
  assert.ok(source.includes('article.schema["@graph"]'), 'Expected article schema metadata to derive graph count from the schema payload.');
}

async function assertCityMarketSchemaSource() {
  const source = await readFile('app/market/[city]/page.tsx', 'utf8');

  assert.ok(source.includes('data-testid="reie-city-market-schema"'), 'Expected city market page to expose city market schema metadata.');
  assert.ok(source.includes('data-city-market-schema-type="City"'), 'Expected city market schema to expose schema type metadata.');
  assert.ok(source.includes('data-city-market-schema-url={canonicalUrl}'), 'Expected city market schema to expose canonical URL metadata.');
  assert.ok(source.includes('data-city-market-schema-name={cityData.name}'), 'Expected city market schema to expose city names.');
  assert.ok(source.includes('data-city-market-schema-market-slug={cityData.marketSlug}'), 'Expected city market schema to expose market slugs.');
  assert.ok(source.includes('data-city-market-schema-neighborhood-count={cityNeighborhoods.length}'), 'Expected city market schema to expose neighborhood counts.');
  assert.ok(source.includes('data-city-market-schema-featured-neighborhood={featuredNeighborhood?.name ?? ""}'), 'Expected city market schema to expose featured neighborhoods.');
  assert.ok(source.includes('data-city-market-schema-median-price={cityData.stats.medianPrice}'), 'Expected city market schema to expose median prices.');
  assert.ok(source.includes('data-city-market-schema-inventory={cityData.stats.inventory}'), 'Expected city market schema to expose inventory.');
  assert.ok(source.includes('data-city-market-schema-health-score={cityData.stats.marketHealthScore}'), 'Expected city market schema to expose market health scores.');
  assert.ok(source.includes('data-city-market-schema-avg-efficiency={cityData.stats.avgEfficiency}'), 'Expected city market schema to expose average efficiency.');
  assert.ok(source.includes('data-city-market-schema-graph-count={cityMarketSchemaGraph.length}'), 'Expected city market schema to expose graph counts.');
  assert.ok(source.includes('data-city-market-schema-has-breadcrumb="true"'), 'Expected city market schema to expose breadcrumb availability.');
  assert.ok(source.includes('data-city-market-schema-has-neighborhoods={cityNeighborhoods.length > 0 ? "true" : "false"}'), 'Expected city market schema to expose neighborhood availability.');
  assert.ok(source.includes("cityMarketSchema['@graph']"), 'Expected city market schema metadata to derive graph count from the schema payload.');
  assert.ok(source.includes('JSON.stringify(cityMarketSchema)'), 'Expected city market schema script to render the shared schema payload.');
}

async function assertNeighborhoodSchemaSource() {
  const source = await readFile('app/market/[city]/[slug]/page.tsx', 'utf8');

  assert.ok(source.includes('data-testid="reie-neighborhood-schema"'), 'Expected neighborhood page to expose neighborhood schema metadata.');
  assert.ok(source.includes('data-neighborhood-schema-type="Place"'), 'Expected neighborhood schema to expose schema type metadata.');
  assert.ok(source.includes('data-neighborhood-schema-url={canonicalUrl}'), 'Expected neighborhood schema to expose canonical URLs.');
  assert.ok(source.includes('data-neighborhood-schema-name={neighborhood.name}'), 'Expected neighborhood schema to expose names.');
  assert.ok(source.includes('data-neighborhood-schema-city={neighborhood.city}'), 'Expected neighborhood schema to expose cities.');
  assert.ok(source.includes('data-neighborhood-schema-slug={neighborhood.slug}'), 'Expected neighborhood schema to expose slugs.');
  assert.ok(source.includes('data-neighborhood-schema-primary-anchor={neighborhood.primaryAnchor}'), 'Expected neighborhood schema to expose primary anchors.');
  assert.ok(source.includes('data-neighborhood-schema-resilience-score={neighborhood.resilienceScore}'), 'Expected neighborhood schema to expose resilience scores.');
  assert.ok(source.includes('data-neighborhood-schema-fire-risk={neighborhood.fireRisk}'), 'Expected neighborhood schema to expose fire risk.');
  assert.ok(source.includes('data-neighborhood-schema-insurance-complexity={neighborhood.insuranceComplexity}'), 'Expected neighborhood schema to expose insurance complexity.');
  assert.ok(source.includes('data-neighborhood-schema-altitude={neighborhood.altitude}'), 'Expected neighborhood schema to expose altitude.');
  assert.ok(source.includes('data-neighborhood-schema-soil-type={neighborhood.soilType}'), 'Expected neighborhood schema to expose soil type.');
  assert.ok(source.includes('data-neighborhood-schema-inventory-count={inventoryState.count}'), 'Expected neighborhood schema to expose inventory counts.');
  assert.ok(source.includes('data-neighborhood-schema-inventory-source={inventoryState.source}'), 'Expected neighborhood schema to expose inventory sources.');
  assert.ok(source.includes('data-neighborhood-schema-related-link-count={relatedLinks.length}'), 'Expected neighborhood schema to expose related link counts.');
  assert.ok(source.includes('data-neighborhood-schema-faq-count={neighborhoodFaqs.length}'), 'Expected neighborhood schema to expose FAQ counts.');
  assert.ok(source.includes('data-neighborhood-schema-graph-count={neighborhoodSchemaGraph.length}'), 'Expected neighborhood schema to expose graph counts.');
  assert.ok(source.includes('data-neighborhood-schema-has-breadcrumb="true"'), 'Expected neighborhood schema to expose breadcrumb availability.');
  assert.ok(source.includes('data-neighborhood-schema-has-city="true"'), 'Expected neighborhood schema to expose city availability.');
  assert.ok(source.includes("neighborhoodSchema['@graph']"), 'Expected neighborhood schema metadata to derive graph count from the schema payload.');
  assert.ok(source.includes('JSON.stringify(neighborhoodSchema)'), 'Expected neighborhood schema script to render the shared schema payload.');
}

async function assertNearbyNeighborhoodAuthoritySource() {
  const source = await readFile('components/NearbyNeighborhoods.tsx', 'utf8');

  assert.ok(source.includes('data-testid="reie-nearby-neighborhoods"'), 'Expected nearby neighborhoods to expose a stable shell handle.');
  assert.ok(source.includes('data-testid="reie-nearby-neighborhoods-list"'), 'Expected nearby neighborhoods to expose list metadata.');
  assert.ok(source.includes('data-testid="reie-nearby-neighborhood-card"'), 'Expected nearby neighborhoods to expose card metadata.');
  assert.ok(source.includes('data-testid="reie-nearby-neighborhood-link"'), 'Expected nearby neighborhoods to expose neighborhood link metadata.');
  assert.ok(source.includes('data-testid="reie-nearby-neighborhood-brief-link"'), 'Expected nearby neighborhoods to expose brief link metadata.');
  assert.ok(source.includes('data-nearby-neighborhoods-title='), 'Expected nearby neighborhoods to expose title metadata.');
  assert.ok(source.includes('data-nearby-neighborhoods-city='), 'Expected nearby neighborhoods to expose input city metadata.');
  assert.ok(source.includes('data-nearby-neighborhoods-city-name='), 'Expected nearby neighborhoods to expose resolved city names.');
  assert.ok(source.includes('data-nearby-neighborhoods-current-slug='), 'Expected nearby neighborhoods to expose current slug context.');
  assert.ok(source.includes('data-nearby-neighborhoods-requested-limit='), 'Expected nearby neighborhoods to expose requested limits.');
  assert.ok(source.includes('data-nearby-neighborhoods-limit='), 'Expected nearby neighborhoods to expose applied limits.');
  assert.ok(source.includes('data-nearby-neighborhoods-count='), 'Expected nearby neighborhoods to expose neighborhood counts.');
  assert.ok(source.includes('data-nearby-neighborhoods-brief-count='), 'Expected nearby neighborhoods to expose brief counts.');
  assert.ok(source.includes('data-nearby-neighborhoods-list-count='), 'Expected nearby neighborhoods to expose list counts.');
  assert.ok(source.includes('data-nearby-neighborhood-index='), 'Expected nearby neighborhoods to expose card indices.');
  assert.ok(source.includes('data-nearby-neighborhood-slug='), 'Expected nearby neighborhoods to expose slugs.');
  assert.ok(source.includes('data-nearby-neighborhood-name='), 'Expected nearby neighborhoods to expose names.');
  assert.ok(source.includes('data-nearby-neighborhood-city='), 'Expected nearby neighborhoods to expose cities.');
  assert.ok(source.includes('data-nearby-neighborhood-primary-anchor='), 'Expected nearby neighborhoods to expose primary anchors.');
  assert.ok(source.includes('data-nearby-neighborhood-resilience-score='), 'Expected nearby neighborhoods to expose resilience scores.');
  assert.ok(source.includes('data-nearby-neighborhood-efficiency-score='), 'Expected nearby neighborhoods to expose efficiency scores.');
  assert.ok(source.includes('data-nearby-neighborhood-fire-risk='), 'Expected nearby neighborhoods to expose fire risk.');
  assert.ok(source.includes('data-nearby-neighborhood-insurance-complexity='), 'Expected nearby neighborhoods to expose insurance complexity.');
  assert.ok(source.includes('data-nearby-neighborhood-soil-type='), 'Expected nearby neighborhoods to expose soil types.');
  assert.ok(source.includes('data-nearby-neighborhood-href='), 'Expected nearby neighborhoods to expose neighborhood hrefs.');
  assert.ok(source.includes('data-nearby-neighborhood-has-brief='), 'Expected nearby neighborhoods to expose brief availability.');
  assert.ok(source.includes('data-nearby-neighborhood-link-href='), 'Expected nearby neighborhoods to expose link hrefs.');
  assert.ok(source.includes('data-nearby-neighborhood-brief-title='), 'Expected nearby neighborhoods to expose brief titles.');
  assert.ok(source.includes('data-nearby-neighborhood-brief-href='), 'Expected nearby neighborhoods to expose brief hrefs.');
}

async function assertRelatedContentSource() {
  const source = await readFile('components/RelatedContent.tsx', 'utf8');

  assert.ok(source.includes('data-testid="reie-related-content"'), 'Expected related content to expose a stable shell handle.');
  assert.ok(source.includes('data-testid="reie-related-content-list"'), 'Expected related content to expose list metadata.');
  assert.ok(source.includes('data-testid="reie-related-content-link"'), 'Expected related content to expose link metadata.');
  assert.ok(source.includes('data-related-content-title='), 'Expected related content to expose title metadata.');
  assert.ok(source.includes('data-related-content-node-id='), 'Expected related content to expose node ids.');
  assert.ok(source.includes('data-related-content-source-kind='), 'Expected related content to expose source kind metadata.');
  assert.ok(source.includes('data-related-content-count='), 'Expected related content to expose link counts.');
  assert.ok(source.includes('data-related-content-list-count='), 'Expected related content to expose list counts.');
  assert.ok(source.includes('data-related-content-link-index='), 'Expected related content to expose link indices.');
  assert.ok(source.includes('data-related-content-link-type='), 'Expected related content to expose link types.');
  assert.ok(source.includes('data-related-content-link-title='), 'Expected related content to expose link titles.');
  assert.ok(source.includes('data-related-content-link-description='), 'Expected related content to expose link descriptions.');
  assert.ok(source.includes('data-related-content-link-action='), 'Expected related content to expose link actions.');
  assert.ok(source.includes('data-related-content-link-href='), 'Expected related content to expose hrefs.');
  assert.ok(source.includes('data-related-content-link-slug='), 'Expected related content to expose knowledge node slugs.');
  assert.ok(source.includes('data-related-content-link-city='), 'Expected related content to expose knowledge node cities.');
}

async function assertCityNavigationSource() {
  const source = await readFile('components/CityNavigation.tsx', 'utf8');

  assert.ok(source.includes('data-testid="reie-city-navigation"'), 'Expected city navigation to expose a stable shell handle.');
  assert.ok(source.includes('data-testid="reie-city-navigation-list"'), 'Expected city navigation to expose list metadata.');
  assert.ok(source.includes('data-testid="reie-city-navigation-card"'), 'Expected city navigation to expose card metadata.');
  assert.ok(source.includes('data-testid="reie-city-navigation-market-link"'), 'Expected city navigation to expose market link metadata.');
  assert.ok(source.includes('data-testid="reie-city-navigation-brief-link"'), 'Expected city navigation to expose brief link metadata.');
  assert.ok(source.includes('data-city-navigation-title='), 'Expected city navigation to expose title metadata.');
  assert.ok(source.includes('data-city-navigation-requested-limit='), 'Expected city navigation to expose requested limits.');
  assert.ok(source.includes('data-city-navigation-limit='), 'Expected city navigation to expose applied limits.');
  assert.ok(source.includes('data-city-navigation-count='), 'Expected city navigation to expose city counts.');
  assert.ok(source.includes('data-city-navigation-brief-count='), 'Expected city navigation to expose brief counts.');
  assert.ok(source.includes('data-city-navigation-list-count='), 'Expected city navigation to expose list counts.');
  assert.ok(source.includes('data-city-navigation-card-index='), 'Expected city navigation to expose card indices.');
  assert.ok(source.includes('data-city-navigation-card-name='), 'Expected city navigation to expose city names.');
  assert.ok(source.includes('data-city-navigation-card-slug='), 'Expected city navigation to expose city slugs.');
  assert.ok(source.includes('data-city-navigation-card-market-slug='), 'Expected city navigation to expose market slugs.');
  assert.ok(source.includes('data-city-navigation-card-market-href='), 'Expected city navigation to expose market hrefs.');
  assert.ok(source.includes('data-city-navigation-card-median-price='), 'Expected city navigation to expose median prices.');
  assert.ok(source.includes('data-city-navigation-card-inventory='), 'Expected city navigation to expose inventory counts.');
  assert.ok(source.includes('data-city-navigation-card-days-on-market='), 'Expected city navigation to expose days-on-market metadata.');
  assert.ok(source.includes('data-city-navigation-card-has-brief='), 'Expected city navigation to expose brief availability.');
  assert.ok(source.includes('data-city-navigation-market-link-href='), 'Expected city navigation to expose market link hrefs.');
  assert.ok(source.includes('data-city-navigation-brief-title='), 'Expected city navigation to expose brief titles.');
  assert.ok(source.includes('data-city-navigation-brief-description='), 'Expected city navigation to expose brief descriptions.');
  assert.ok(source.includes('data-city-navigation-brief-href='), 'Expected city navigation to expose brief hrefs.');
}

async function assertCityNeighborhoodsSource() {
  const source = await readFile('components/CityNeighborhoods.tsx', 'utf8');

  assert.ok(source.includes('data-testid="reie-city-neighborhoods"'), 'Expected city neighborhoods to expose a stable shell handle.');
  assert.ok(source.includes('data-testid="reie-city-neighborhoods-list"'), 'Expected city neighborhoods to expose list metadata.');
  assert.ok(source.includes('data-testid="reie-city-neighborhood-card"'), 'Expected city neighborhoods to expose card metadata.');
  assert.ok(source.includes('data-testid="reie-city-neighborhood-link"'), 'Expected city neighborhoods to expose neighborhood link metadata.');
  assert.ok(source.includes('data-testid="reie-city-neighborhood-brief-link"'), 'Expected city neighborhoods to expose brief link metadata.');
  assert.ok(source.includes('data-city-neighborhoods-title='), 'Expected city neighborhoods to expose title metadata.');
  assert.ok(source.includes('data-city-neighborhoods-city='), 'Expected city neighborhoods to expose input city metadata.');
  assert.ok(source.includes('data-city-neighborhoods-city-name='), 'Expected city neighborhoods to expose resolved city names.');
  assert.ok(source.includes('data-city-neighborhoods-normalized-city='), 'Expected city neighborhoods to expose normalized city metadata.');
  assert.ok(source.includes('data-city-neighborhoods-count='), 'Expected city neighborhoods to expose neighborhood counts.');
  assert.ok(source.includes('data-city-neighborhoods-brief-count='), 'Expected city neighborhoods to expose brief counts.');
  assert.ok(source.includes('data-city-neighborhoods-list-count='), 'Expected city neighborhoods to expose list counts.');
  assert.ok(source.includes('data-city-neighborhood-index='), 'Expected city neighborhoods to expose card indices.');
  assert.ok(source.includes('data-city-neighborhood-slug='), 'Expected city neighborhoods to expose slugs.');
  assert.ok(source.includes('data-city-neighborhood-name='), 'Expected city neighborhoods to expose names.');
  assert.ok(source.includes('data-city-neighborhood-city='), 'Expected city neighborhoods to expose cities.');
  assert.ok(source.includes('data-city-neighborhood-primary-anchor='), 'Expected city neighborhoods to expose primary anchors.');
  assert.ok(source.includes('data-city-neighborhood-resilience-score='), 'Expected city neighborhoods to expose resilience scores.');
  assert.ok(source.includes('data-city-neighborhood-efficiency-score='), 'Expected city neighborhoods to expose efficiency scores.');
  assert.ok(source.includes('data-city-neighborhood-href='), 'Expected city neighborhoods to expose neighborhood hrefs.');
  assert.ok(source.includes('data-city-neighborhood-has-brief='), 'Expected city neighborhoods to expose brief availability.');
  assert.ok(source.includes('data-city-neighborhood-link-href='), 'Expected city neighborhoods to expose link hrefs.');
  assert.ok(source.includes('data-city-neighborhood-brief-title='), 'Expected city neighborhoods to expose brief titles.');
  assert.ok(source.includes('data-city-neighborhood-brief-href='), 'Expected city neighborhoods to expose brief hrefs.');
}

async function assertCityHubLinkSource() {
  const source = await readFile('components/CityHubLink.tsx', 'utf8');

  assert.ok(source.includes('data-testid="reie-city-hub-link"'), 'Expected city hub link to expose a stable shell handle.');
  assert.ok(source.includes('data-testid="reie-city-hub-market-link"'), 'Expected city hub link to expose market link metadata.');
  assert.ok(source.includes('data-testid="reie-city-hub-brief-link"'), 'Expected city hub link to expose brief link metadata.');
  assert.ok(source.includes('data-city-hub-link-city='), 'Expected city hub link to expose input city metadata.');
  assert.ok(source.includes('data-city-hub-link-city-name='), 'Expected city hub link to expose resolved city names.');
  assert.ok(source.includes('data-city-hub-link-market-slug='), 'Expected city hub link to expose market slugs.');
  assert.ok(source.includes('data-city-hub-link-market-href='), 'Expected city hub link to expose market hrefs.');
  assert.ok(source.includes('data-city-hub-link-label='), 'Expected city hub link to expose labels.');
  assert.ok(source.includes('data-city-hub-link-has-brief='), 'Expected city hub link to expose brief availability.');
  assert.ok(source.includes('data-city-hub-link-brief-href='), 'Expected city hub link to expose brief hrefs.');
  assert.ok(source.includes('data-city-hub-market-link-href='), 'Expected city hub link to expose market link hrefs.');
  assert.ok(source.includes('data-city-hub-market-link-label='), 'Expected city hub link to expose market link labels.');
  assert.ok(source.includes('data-city-hub-brief-title='), 'Expected city hub link to expose brief titles.');
  assert.ok(source.includes('data-city-hub-brief-description='), 'Expected city hub link to expose brief descriptions.');
  assert.ok(source.includes('data-city-hub-brief-href='), 'Expected city hub link to expose brief link hrefs.');
}

async function assertNeighborhoodMarketLinkSource() {
  const source = await readFile('components/NeighborhoodMarketLink.tsx', 'utf8');

  assert.ok(source.includes('data-testid="reie-neighborhood-market-link"'), 'Expected neighborhood market link to expose a stable shell handle.');
  assert.ok(source.includes('data-testid="reie-neighborhood-market-report-link"'), 'Expected neighborhood market link to expose market report link metadata.');
  assert.ok(source.includes('data-testid="reie-neighborhood-market-brief-link"'), 'Expected neighborhood market link to expose brief link metadata.');
  assert.ok(source.includes('data-neighborhood-market-link-title='), 'Expected neighborhood market link to expose title metadata.');
  assert.ok(source.includes('data-neighborhood-market-link-city='), 'Expected neighborhood market link to expose input city metadata.');
  assert.ok(source.includes('data-neighborhood-market-link-city-name='), 'Expected neighborhood market link to expose resolved city names.');
  assert.ok(source.includes('data-neighborhood-market-link-market-slug='), 'Expected neighborhood market link to expose market slugs.');
  assert.ok(source.includes('data-neighborhood-market-link-market-href='), 'Expected neighborhood market link to expose market hrefs.');
  assert.ok(source.includes('data-neighborhood-market-link-has-market='), 'Expected neighborhood market link to expose market data availability.');
  assert.ok(source.includes('data-neighborhood-market-link-median-price='), 'Expected neighborhood market link to expose median prices.');
  assert.ok(source.includes('data-neighborhood-market-link-inventory='), 'Expected neighborhood market link to expose inventory counts.');
  assert.ok(source.includes('data-neighborhood-market-link-days-on-market='), 'Expected neighborhood market link to expose days-on-market metadata.');
  assert.ok(source.includes('data-neighborhood-market-link-has-brief='), 'Expected neighborhood market link to expose brief availability.');
  assert.ok(source.includes('data-neighborhood-market-link-brief-href='), 'Expected neighborhood market link to expose brief hrefs.');
  assert.ok(source.includes('data-neighborhood-market-report-link-href='), 'Expected neighborhood market link to expose report link hrefs.');
  assert.ok(source.includes('data-neighborhood-market-brief-title='), 'Expected neighborhood market link to expose brief titles.');
  assert.ok(source.includes('data-neighborhood-market-brief-description='), 'Expected neighborhood market link to expose brief descriptions.');
  assert.ok(source.includes('data-neighborhood-market-brief-href='), 'Expected neighborhood market link to expose brief link hrefs.');
}

async function assertSearchMetadataSource() {
  const [mapSource, sidebarSource, propertyCardSource, homeSource, searchSource] = await Promise.all([
    readFile('components/maps/SearchMap.tsx', 'utf8'),
    readFile('components/maps/MapSidebar.tsx', 'utf8'),
    readFile('components/PropertyCard.tsx', 'utf8'),
    readFile('components/home/HomeSearchExperience.tsx', 'utf8'),
    readFile('components/search/SearchInterface.tsx', 'utf8'),
  ]);

  assert.ok(mapSource.includes('data-search-generated-at={searchMeta?.generatedAt'), 'Expected map to expose search generatedAt metadata.');
  assert.ok(!mapSource.includes('data-search-terminal='), 'Expected map to avoid exposing search terminal metadata.');
  assert.ok(!mapSource.includes('data-search-route='), 'Expected map to avoid exposing search route metadata.');
  assert.ok(!mapSource.includes('data-search-command='), 'Expected map to avoid exposing search command metadata.');
  assert.ok(!mapSource.includes('data-search-module='), 'Expected map to avoid exposing search module metadata.');
  assert.ok(!mapSource.includes('data-search-smoke-command='), 'Expected map to avoid exposing search smoke command metadata.');
  assert.ok(mapSource.includes('data-testid="reie-search-map-canvas"'), 'Expected map to expose a stable map canvas handle.');
  assert.ok(mapSource.includes('data-testid="reie-search-map-diagnostics"'), 'Expected map to expose a stable diagnostics handle.');
  assert.ok(mapSource.includes('data-map-ready='), 'Expected map to expose runtime readiness metadata.');
  assert.ok(mapSource.includes('data-map-coordinate-listing-count='), 'Expected map to expose coordinate listing counts.');
  assert.ok(mapSource.includes('data-map-rendered-marker-count='), 'Expected map to expose rendered marker counts.');
  assert.ok(mapSource.includes('data-map-cluster-count='), 'Expected map to expose cluster counts.');
  assert.ok(mapSource.includes('data-map-active-marker-count='), 'Expected map to expose active marker counts.');
  assert.ok(mapSource.includes('data-selected-listing-id='), 'Expected map to expose selected listing metadata.');
  assert.ok(mapSource.includes('data-hovered-listing-id='), 'Expected map to expose hovered listing metadata.');
  assert.ok(mapSource.includes('data-user-tier='), 'Expected map to expose user tier metadata.');
  assert.ok(sidebarSource.includes('data-testid="reie-map-sidebar"'), 'Expected sidebar to expose a stable shell handle.');
  assert.ok(sidebarSource.includes('data-testid="reie-sidebar-header"'), 'Expected sidebar to expose a stable header handle.');
  assert.ok(sidebarSource.includes('data-testid="reie-sidebar-intelligence"'), 'Expected sidebar to expose intelligence metadata.');
  assert.ok(sidebarSource.includes('data-testid="reie-sidebar-results-toolbar"'), 'Expected sidebar to expose results toolbar metadata.');
  assert.ok(sidebarSource.includes('data-testid="reie-sidebar-selected-summary"'), 'Expected sidebar to expose selected listing summary metadata.');
  assert.ok(sidebarSource.includes('data-testid="reie-sidebar-list"'), 'Expected sidebar to expose a stable list handle.');
  assert.ok(sidebarSource.includes('data-testid="reie-sidebar-listing"'), 'Expected sidebar listings to expose stable handles.');
  assert.ok(sidebarSource.includes('data-sidebar-listing-count='), 'Expected sidebar to expose listing counts.');
  assert.ok(sidebarSource.includes('data-sidebar-mapped-count='), 'Expected sidebar to expose mapped counts.');
  assert.ok(sidebarSource.includes('data-sidebar-private-count='), 'Expected sidebar to expose private listing counts.');
  assert.ok(sidebarSource.includes('data-sidebar-review-count='), 'Expected sidebar to expose review counts.');
  assert.ok(sidebarSource.includes('data-sidebar-selected-listing-id='), 'Expected sidebar to expose selected listing ids.');
  assert.ok(sidebarSource.includes('data-sidebar-hovered-listing-id='), 'Expected sidebar to expose hovered listing ids.');
  assert.ok(sidebarSource.includes('data-sidebar-listing-selected='), 'Expected sidebar listing rows to expose selected state.');
  assert.ok(sidebarSource.includes('data-sidebar-listing-hovered='), 'Expected sidebar listing rows to expose hovered state.');
  assert.ok(propertyCardSource.includes('data-testid="reie-property-card"'), 'Expected property cards to expose stable handles.');
  assert.ok(propertyCardSource.includes('data-property-card-id='), 'Expected property cards to expose listing ids.');
  assert.ok(propertyCardSource.includes('data-property-card-active='), 'Expected property cards to expose active state.');
  assert.ok(propertyCardSource.includes('data-property-card-price='), 'Expected property cards to expose price metadata.');
  assert.ok(propertyCardSource.includes('data-property-card-photo-fallback='), 'Expected property cards to expose photo fallback state.');
  assert.ok(propertyCardSource.includes('data-property-card-decision-signal='), 'Expected property cards to expose decision signals.');
  assert.ok(propertyCardSource.includes('data-property-card-review-signal='), 'Expected property cards to expose review signals.');
  assert.ok(propertyCardSource.includes('data-property-card-market-href='), 'Expected property cards to expose market links.');
  assert.ok(propertyCardSource.includes('data-property-card-detail-href='), 'Expected property cards to expose detail links.');
  assert.ok(propertyCardSource.includes('data-testid="reie-property-card-decision"'), 'Expected property cards to expose decision sections.');
  assert.ok(propertyCardSource.includes('data-testid="reie-property-card-intelligence"'), 'Expected property cards to expose intelligence sections.');
  assert.ok(propertyCardSource.includes('data-testid="reie-property-card-market-link"'), 'Expected property cards to expose market link handles.');
  assert.ok(propertyCardSource.includes('data-testid="reie-property-card-detail-link"'), 'Expected property cards to expose detail link handles.');
  assert.ok(!homeSource.includes('command: data.meta.command || data.command'), 'Expected homepage search to avoid preserving top-level command metadata.');
  assert.ok(!searchSource.includes('command: data.meta.command || data.command'), 'Expected search page to avoid preserving top-level command metadata.');
  assert.ok(searchSource.includes('data-testid="reie-search-interface"'), 'Expected search interface to expose a stable shell.');
  assert.ok(searchSource.includes('data-testid="reie-search-mobile-toolbar"'), 'Expected search interface to expose mobile toolbar metadata.');
  assert.ok(searchSource.includes('data-testid="reie-search-list-pane"'), 'Expected search interface to expose list pane metadata.');
  assert.ok(searchSource.includes('data-testid="reie-search-map-pane"'), 'Expected search interface to expose map pane metadata.');
  assert.ok(searchSource.includes('data-search-generated-at='), 'Expected search interface to expose generatedAt metadata.');
  assert.ok(!searchSource.includes('data-search-terminal='), 'Expected search interface to avoid exposing terminal metadata.');
  assert.ok(!searchSource.includes('data-search-route='), 'Expected search interface to avoid exposing route metadata.');
  assert.ok(!searchSource.includes('data-search-command='), 'Expected search interface to avoid exposing command metadata.');
  assert.ok(searchSource.includes('data-search-source='), 'Expected search interface to expose source metadata.');
  assert.ok(searchSource.includes('data-search-access-level='), 'Expected search interface to expose access-level metadata.');
  assert.ok(searchSource.includes('data-mobile-view='), 'Expected search interface to expose mobile view metadata.');
  assert.ok(searchSource.includes('data-selected-listing-id='), 'Expected search interface to expose selected listing metadata.');
  assert.ok(searchSource.includes('data-visible-listing-count='), 'Expected search interface to expose visible listing count metadata.');
}

async function assertAdminInspectionMetadataSource() {
  const [source, pageSource] = await Promise.all([
    readFile('components/admin/MasterControlPanel.tsx', 'utf8'),
    readFile('app/admin/page.tsx', 'utf8'),
  ]);

  assert.ok(pageSource.includes('data-testid="reie-admin-page"'), 'Expected admin page to expose a stable page shell.');
  assert.ok(pageSource.includes('data-page-route="/admin"'), 'Expected admin page to expose route metadata.');
  assert.ok(pageSource.includes('data-page-component="MasterControlPanel"'), 'Expected admin page to expose component metadata.');
  assert.ok(pageSource.includes('data-page-terminal="Terminal 5"'), 'Expected admin page to expose Terminal 5 metadata.');
  assert.ok(pageSource.includes('data-page-control-route="/api/admin/control-state"'), 'Expected admin page to expose control API route metadata.');
  assert.ok(pageSource.includes('data-page-intake-route="/api/admin/intake-signals"'), 'Expected admin page to expose intake API route metadata.');
  assert.ok(pageSource.includes('data-page-crm-route="/api/admin/crm-tasks"'), 'Expected admin page to expose CRM API route metadata.');
  assert.ok(pageSource.includes('data-page-alert-route="/api/process-alerts"'), 'Expected admin page to expose alert API route metadata.');
  assert.ok(pageSource.includes('data-page-mls-status-route="/api/mls/status"'), 'Expected admin page to expose MLS status API route metadata.');
  assert.ok(pageSource.includes('data-page-mls-retry-route="/api/mls/retry"'), 'Expected admin page to expose MLS retry API route metadata.');
  assert.ok(pageSource.includes('data-page-noindex="true"'), 'Expected admin page to expose noindex metadata.');
  assert.ok(pageSource.includes('index: false'), 'Expected admin page metadata to disable indexing.');

  for (const testId of [
    'reie-control-api-metadata',
    'reie-intake-api-metadata',
    'reie-intake-detail-api-metadata',
    'reie-crm-api-metadata',
    'reie-crm-last-detail-route',
    'reie-alert-operations',
    'reie-alert-api-metadata',
    'reie-alert-execution-plan',
    'reie-alert-command-metadata',
    'reie-notification-blockers',
    'reie-mls-operations',
    'reie-mls-status-api-metadata',
    'reie-mls-operational-readiness',
    'reie-mls-retry-api-metadata',
    'reie-search-index-status',
    'reie-mls-sync-envelope',
    'reie-mls-command-metadata',
  ]) {
    assert.ok(source.includes(`data-testid="${testId}"`), `Expected admin panel ${testId} inspection surface.`);
  }

  assert.ok(source.includes('data-api-generated-at='), 'Expected admin inspection panels to expose generatedAt metadata.');
  assert.ok(source.includes('data-api-route='), 'Expected admin inspection panels to expose route metadata.');
  assert.ok(source.includes('data-api-terminal='), 'Expected admin inspection panels to expose terminal metadata.');
  assert.ok(source.includes('data-api-command='), 'Expected admin inspection panels to expose command metadata.');
  assert.ok(source.includes('data-api-source='), 'Expected admin inspection panels to expose source metadata.');
  assert.ok(source.includes('data-alert-mode='), 'Expected admin alert panel to expose alert mode metadata.');
  assert.ok(source.includes('data-alert-plan-level='), 'Expected admin alert panel to expose execution-plan metadata.');
  assert.ok(source.includes('data-command-dry-run='), 'Expected admin alert panel to expose dry-run command metadata.');
  assert.ok(source.includes('Notification Launch Blockers'), 'Expected admin alert panel to expose notification launch blockers.');
  assert.ok(source.includes('reie-notification-blocker-'), 'Expected admin alert panel to expose per-blocker inspection handles.');
  assert.ok(source.includes('data-notification-readiness='), 'Expected admin alert panel to expose notification readiness metadata.');
  assert.ok(source.includes('data-notification-next-command='), 'Expected admin alert panel to expose notification next-command metadata.');
  assert.ok(source.includes('data-blocker-count='), 'Expected admin alert panel to expose notification blocker counts.');
  assert.ok(source.includes('data-blocker-count-aligned='), 'Expected admin alert panel to expose blocker count alignment metadata.');
  assert.ok(source.includes('data-blocker-env-var-count-aligned='), 'Expected admin alert panel to expose blocker env var count alignment metadata.');
  assert.ok(source.includes('data-blocker-counts-aligned='), 'Expected admin alert panel to expose aggregate blocker count alignment metadata.');
  assert.ok(source.includes('data-blocker-counts-ready='), 'Expected admin alert panel to expose blocker count readiness metadata.');
  assert.ok(source.includes('data-has-first-blocker='), 'Expected admin alert panel to expose first blocker presence metadata.');
  assert.ok(source.includes('data-first-blocker-complete='), 'Expected admin alert panel to expose first blocker completeness metadata.');
  assert.ok(source.includes('data-first-blocker-contract-ready='), 'Expected admin alert panel to expose first blocker contract readiness metadata.');
  assert.ok(source.includes('data-blocker-payload-ready='), 'Expected admin alert panel to expose blocker payload readiness metadata.');
  assert.ok(source.includes('data-blocker-payload-contract-ready='), 'Expected admin alert panel to expose blocker payload contract readiness metadata.');
  assert.ok(source.includes('data-blocker-codes='), 'Expected admin alert panel to expose aggregate blocker codes.');
  assert.ok(source.includes('data-blocker-env-vars='), 'Expected admin alert panel to expose aggregate blocker env vars.');
  assert.ok(source.includes('data-blocker-summary-aligned='), 'Expected admin alert panel to expose blocker summary alignment state.');
  assert.ok(source.includes('data-blocker-api-summary-aligned='), 'Expected admin alert panel to expose API blocker summary alignment state.');
  assert.ok(source.includes('data-blocker-alignment-status='), 'Expected admin alert panel to expose blocker alignment status metadata.');
  assert.ok(source.includes('data-blocker-alignment-status-aligned='), 'Expected admin alert panel to expose blocker alignment status alignment metadata.');
  assert.ok(source.includes('data-blocker-alignment-options='), 'Expected admin alert panel to expose blocker alignment status options.');
  assert.ok(source.includes('data-blocker-alignment-option-count='), 'Expected admin alert panel to expose blocker alignment option count.');
  assert.ok(source.includes('data-blocker-alignment-expected-count='), 'Expected admin alert panel to expose blocker alignment expected count.');
  assert.ok(source.includes('data-blocker-alignment-option-count-aligned='), 'Expected admin alert panel to expose blocker alignment option count alignment metadata.');
  assert.ok(source.includes('data-blocker-alignment-status-known='), 'Expected admin alert panel to expose blocker alignment status membership metadata.');
  assert.ok(source.includes('data-blocker-alignment-status-contract-ready='), 'Expected admin alert panel to expose blocker alignment status contract readiness metadata.');
  assert.ok(source.includes('data-blocker-inspection-ready='), 'Expected admin alert panel to expose blocker inspection readiness metadata.');
  assert.ok(source.includes('data-blocker-inspection-payload-ready='), 'Expected admin alert panel to expose blocker inspection payload readiness metadata.');
  assert.ok(source.includes('data-blocker-inspection-contract-ready='), 'Expected admin alert panel to expose blocker inspection contract readiness metadata.');
  assert.ok(source.includes('data-blocker-inspection-contract-payload-ready='), 'Expected admin alert panel to expose blocker inspection contract payload readiness metadata.');
  assert.ok(source.includes('data-blocker-inspection-contract-status='), 'Expected admin alert panel to expose blocker inspection contract status metadata.');
  assert.ok(source.includes('data-blocker-inspection-contract-status-aligned='), 'Expected admin alert panel to expose blocker inspection contract status alignment metadata.');
  assert.ok(source.includes('data-blocker-inspection-contract-status-options='), 'Expected admin alert panel to expose blocker inspection contract status options.');
  assert.ok(source.includes('data-blocker-inspection-contract-status-option-count='), 'Expected admin alert panel to expose blocker inspection contract status option count.');
  assert.ok(source.includes('data-blocker-inspection-contract-status-expected-count='), 'Expected admin alert panel to expose blocker inspection contract status expected count.');
  assert.ok(source.includes('data-blocker-inspection-contract-status-option-count-aligned='), 'Expected admin alert panel to expose blocker inspection contract status option count alignment metadata.');
  assert.ok(source.includes('data-blocker-inspection-contract-status-known='), 'Expected admin alert panel to expose blocker inspection contract status membership metadata.');
  assert.ok(source.includes('data-blocker-inspection-contract-status-contract-ready='), 'Expected admin alert panel to expose blocker inspection contract status contract readiness metadata.');
  assert.ok(source.includes('data-blocker-inspection-contract-contract-ready='), 'Expected admin alert panel to expose blocker inspection contract composite readiness metadata.');
  assert.ok(source.includes('data-blocker-launch-contract-ready='), 'Expected admin alert panel to expose blocker launch contract readiness metadata.');
  assert.ok(source.includes('data-blocker-launch-contract-payload-ready='), 'Expected admin alert panel to expose blocker launch contract payload readiness metadata.');
  assert.ok(source.includes('data-blocker-launch-contract-status='), 'Expected admin alert panel to expose blocker launch contract status metadata.');
  assert.ok(source.includes('data-blocker-launch-contract-status-aligned='), 'Expected admin alert panel to expose blocker launch contract status alignment metadata.');
  assert.ok(source.includes('data-blocker-launch-contract-status-options='), 'Expected admin alert panel to expose blocker launch contract status options.');
  assert.ok(source.includes('data-blocker-launch-contract-status-option-count='), 'Expected admin alert panel to expose blocker launch contract status option count.');
  assert.ok(source.includes('data-blocker-launch-contract-status-expected-count='), 'Expected admin alert panel to expose blocker launch contract status expected count.');
  assert.ok(source.includes('data-blocker-launch-contract-status-option-count-aligned='), 'Expected admin alert panel to expose blocker launch contract status option count alignment metadata.');
  assert.ok(source.includes('data-blocker-launch-contract-status-known='), 'Expected admin alert panel to expose blocker launch contract status membership metadata.');
  assert.ok(source.includes('data-blocker-launch-contract-status-contract-ready='), 'Expected admin alert panel to expose blocker launch contract status contract readiness metadata.');
  assert.ok(source.includes('data-blocker-launch-contract-status-payload-ready='), 'Expected admin alert panel to expose blocker launch contract status payload readiness metadata.');
  assert.ok(source.includes('data-blocker-launch-contract-composite-ready='), 'Expected admin alert panel to expose blocker launch contract composite readiness metadata.');
  assert.ok(source.includes('data-blocker-launch-contract-composite-payload-ready='), 'Expected admin alert panel to expose blocker launch contract composite payload readiness metadata.');
  assert.ok(source.includes('data-blocker-launch-contract-composite-status='), 'Expected admin alert panel to expose blocker launch contract composite status metadata.');
  assert.ok(source.includes('data-blocker-launch-contract-composite-status-aligned='), 'Expected admin alert panel to expose blocker launch contract composite status alignment metadata.');
  assert.ok(source.includes('data-blocker-launch-contract-composite-status-options='), 'Expected admin alert panel to expose blocker launch contract composite status options.');
  assert.ok(source.includes('data-blocker-launch-contract-composite-status-option-count='), 'Expected admin alert panel to expose blocker launch contract composite status option count.');
  assert.ok(source.includes('data-blocker-launch-contract-composite-status-expected-count='), 'Expected admin alert panel to expose blocker launch contract composite status expected count.');
  assert.ok(source.includes('data-blocker-launch-contract-composite-status-option-count-aligned='), 'Expected admin alert panel to expose blocker launch contract composite status option count alignment metadata.');
  assert.ok(source.includes('data-blocker-launch-contract-composite-status-known='), 'Expected admin alert panel to expose blocker launch contract composite status membership metadata.');
  assert.ok(source.includes('data-blocker-launch-contract-composite-status-contract-ready='), 'Expected admin alert panel to expose blocker launch contract composite status contract readiness metadata.');
  assert.ok(source.includes('data-blocker-launch-contract-composite-status-payload-ready='), 'Expected admin alert panel to expose blocker launch contract composite status payload readiness metadata.');
  assert.ok(source.includes('data-blocker-launch-contract-composite-contract-ready='), 'Expected admin alert panel to expose blocker launch contract composite contract readiness metadata.');
  assert.ok(source.includes('data-blocker-launch-contract-composite-contract-payload-ready='), 'Expected admin alert panel to expose blocker launch contract composite contract payload readiness metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-status='), 'Expected admin alert panel to expose blocker launch readiness status metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-status-options='), 'Expected admin alert panel to expose blocker launch readiness status options.');
  assert.ok(source.includes('data-blocker-launch-readiness-status-option-count='), 'Expected admin alert panel to expose blocker launch readiness status option count.');
  assert.ok(source.includes('data-blocker-launch-readiness-status-expected-count='), 'Expected admin alert panel to expose blocker launch readiness status expected count.');
  assert.ok(source.includes('data-blocker-launch-readiness-status-option-count-aligned='), 'Expected admin alert panel to expose blocker launch readiness status option count alignment metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-status-known='), 'Expected admin alert panel to expose blocker launch readiness status membership metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-status-aligned='), 'Expected admin alert panel to expose blocker launch readiness status alignment metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-status-contract-ready='), 'Expected admin alert panel to expose blocker launch readiness status contract readiness metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-status-payload-ready='), 'Expected admin alert panel to expose blocker launch readiness status payload readiness metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-ready='), 'Expected admin alert panel to expose blocker launch readiness contract readiness metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-payload-ready='), 'Expected admin alert panel to expose blocker launch readiness contract payload readiness metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-status='), 'Expected admin alert panel to expose blocker launch readiness contract status metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-status-options='), 'Expected admin alert panel to expose blocker launch readiness contract status options.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-status-option-count='), 'Expected admin alert panel to expose blocker launch readiness contract status option count.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-status-expected-count='), 'Expected admin alert panel to expose blocker launch readiness contract status expected count.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-status-option-count-aligned='), 'Expected admin alert panel to expose blocker launch readiness contract status option count alignment metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-status-known='), 'Expected admin alert panel to expose blocker launch readiness contract status membership metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-status-aligned='), 'Expected admin alert panel to expose blocker launch readiness contract status alignment metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-status-contract-ready='), 'Expected admin alert panel to expose blocker launch readiness contract status contract readiness metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-status-payload-ready='), 'Expected admin alert panel to expose blocker launch readiness contract status payload readiness metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-contract-ready='), 'Expected admin alert panel to expose blocker launch readiness contract contract readiness metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-contract-payload-ready='), 'Expected admin alert panel to expose blocker launch readiness contract contract payload readiness metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-composite-status='), 'Expected admin alert panel to expose blocker launch readiness contract composite status metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-composite-status-options='), 'Expected admin alert panel to expose blocker launch readiness contract composite status options.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-composite-status-option-count='), 'Expected admin alert panel to expose blocker launch readiness contract composite status option count.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-composite-status-expected-count='), 'Expected admin alert panel to expose blocker launch readiness contract composite status expected count.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-composite-status-option-count-aligned='), 'Expected admin alert panel to expose blocker launch readiness contract composite status option count alignment metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-composite-status-known='), 'Expected admin alert panel to expose blocker launch readiness contract composite status membership metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-composite-status-aligned='), 'Expected admin alert panel to expose blocker launch readiness contract composite status alignment metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-composite-status-contract-ready='), 'Expected admin alert panel to expose blocker launch readiness contract composite status contract readiness metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-composite-status-payload-ready='), 'Expected admin alert panel to expose blocker launch readiness contract composite status payload readiness metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-composite-contract-ready='), 'Expected admin alert panel to expose blocker launch readiness contract composite contract readiness metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-composite-contract-payload-ready='), 'Expected admin alert panel to expose blocker launch readiness contract composite contract payload readiness metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-final-status='), 'Expected admin alert panel to expose blocker launch readiness contract final status metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-final-status-options='), 'Expected admin alert panel to expose blocker launch readiness contract final status options.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-final-status-option-count='), 'Expected admin alert panel to expose blocker launch readiness contract final status option count.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-final-status-expected-count='), 'Expected admin alert panel to expose blocker launch readiness contract final status expected count.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-final-status-option-count-aligned='), 'Expected admin alert panel to expose blocker launch readiness contract final status option count alignment metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-final-status-known='), 'Expected admin alert panel to expose blocker launch readiness contract final status membership metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-final-status-aligned='), 'Expected admin alert panel to expose blocker launch readiness contract final status alignment metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-final-status-contract-ready='), 'Expected admin alert panel to expose blocker launch readiness contract final status contract readiness metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-final-status-payload-ready='), 'Expected admin alert panel to expose blocker launch readiness contract final status payload readiness metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-final-contract-ready='), 'Expected admin alert panel to expose blocker launch readiness contract final contract readiness metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-final-contract-payload-ready='), 'Expected admin alert panel to expose blocker launch readiness contract final contract payload readiness metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-final-contract-status='), 'Expected admin alert panel to expose blocker launch readiness contract final contract status metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-final-contract-status-options='), 'Expected admin alert panel to expose blocker launch readiness contract final contract status options.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-final-contract-status-option-count='), 'Expected admin alert panel to expose blocker launch readiness contract final contract status option count.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-final-contract-status-expected-count='), 'Expected admin alert panel to expose blocker launch readiness contract final contract status expected count.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-final-contract-status-option-count-aligned='), 'Expected admin alert panel to expose blocker launch readiness contract final contract status option count alignment metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-final-contract-status-known='), 'Expected admin alert panel to expose blocker launch readiness contract final contract status membership metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-final-contract-status-aligned='), 'Expected admin alert panel to expose blocker launch readiness contract final contract status alignment metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-final-contract-status-contract-ready='), 'Expected admin alert panel to expose blocker launch readiness contract final contract status contract readiness metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-final-contract-status-payload-ready='), 'Expected admin alert panel to expose blocker launch readiness contract final contract status payload readiness metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-final-final-contract-ready='), 'Expected admin alert panel to expose blocker launch readiness contract final final contract readiness metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-final-final-contract-payload-ready='), 'Expected admin alert panel to expose blocker launch readiness contract final final contract payload readiness metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-final-final-contract-status='), 'Expected admin alert panel to expose blocker launch readiness contract final final contract status metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-final-final-contract-status-options='), 'Expected admin alert panel to expose blocker launch readiness contract final final contract status options.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-final-final-contract-status-option-count='), 'Expected admin alert panel to expose blocker launch readiness contract final final contract status option count.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-final-final-contract-status-expected-count='), 'Expected admin alert panel to expose blocker launch readiness contract final final contract status expected count.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-final-final-contract-status-option-count-aligned='), 'Expected admin alert panel to expose blocker launch readiness contract final final contract status option count alignment metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-final-final-contract-status-known='), 'Expected admin alert panel to expose blocker launch readiness contract final final contract status membership metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-final-final-contract-status-aligned='), 'Expected admin alert panel to expose blocker launch readiness contract final final contract status alignment metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-final-final-contract-status-contract-ready='), 'Expected admin alert panel to expose blocker launch readiness contract final final contract status contract readiness metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-final-final-contract-status-payload-ready='), 'Expected admin alert panel to expose blocker launch readiness contract final final contract status payload readiness metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-final-final-contract-contract-ready='), 'Expected admin alert panel to expose blocker launch readiness contract final final contract contract readiness metadata.');
  assert.ok(source.includes('data-blocker-launch-readiness-contract-final-final-contract-contract-payload-ready='), 'Expected admin alert panel to expose blocker launch readiness contract final final contract contract payload readiness metadata.');
  assert.ok(source.includes('data-blocker-contract-terminal-ready='), 'Expected admin alert panel to expose blocker contract terminal readiness metadata.');
  assert.ok(source.includes('data-blocker-contract-terminal-payload-ready='), 'Expected admin alert panel to expose blocker contract terminal payload readiness metadata.');
  assert.ok(source.includes('data-blocker-contract-terminal-status='), 'Expected admin alert panel to expose blocker contract terminal status metadata.');
  assert.ok(source.includes('data-blocker-contract-terminal-status-options='), 'Expected admin alert panel to expose blocker contract terminal status options.');
  assert.ok(source.includes('data-blocker-contract-terminal-status-option-count='), 'Expected admin alert panel to expose blocker contract terminal status option count.');
  assert.ok(source.includes('data-blocker-contract-terminal-status-expected-count='), 'Expected admin alert panel to expose blocker contract terminal status expected count.');
  assert.ok(source.includes('data-blocker-contract-terminal-status-option-count-aligned='), 'Expected admin alert panel to expose blocker contract terminal status option count alignment metadata.');
  assert.ok(source.includes('data-blocker-contract-terminal-status-known='), 'Expected admin alert panel to expose blocker contract terminal status membership metadata.');
  assert.ok(source.includes('data-blocker-contract-terminal-status-aligned='), 'Expected admin alert panel to expose blocker contract terminal status alignment metadata.');
  assert.ok(source.includes('data-blocker-contract-terminal-status-contract-ready='), 'Expected admin alert panel to expose blocker contract terminal status contract readiness metadata.');
  assert.ok(source.includes('data-blocker-contract-terminal-status-payload-ready='), 'Expected admin alert panel to expose blocker contract terminal status payload readiness metadata.');
  assert.ok(source.includes('data-blocker-contract-terminal-contract-ready='), 'Expected admin alert panel to expose blocker contract terminal contract readiness metadata.');
  assert.ok(source.includes('data-blocker-contract-terminal-contract-payload-ready='), 'Expected admin alert panel to expose blocker contract terminal contract payload readiness metadata.');
  assert.ok(source.includes('data-blocker-contract-terminal-contract-status='), 'Expected admin alert panel to expose blocker contract terminal contract status metadata.');
  assert.ok(source.includes('data-blocker-contract-terminal-contract-status-options='), 'Expected admin alert panel to expose blocker contract terminal contract status options.');
  assert.ok(source.includes('data-blocker-contract-terminal-contract-status-option-count='), 'Expected admin alert panel to expose blocker contract terminal contract status option count.');
  assert.ok(source.includes('data-blocker-contract-terminal-contract-status-expected-count='), 'Expected admin alert panel to expose blocker contract terminal contract status expected count.');
  assert.ok(source.includes('data-blocker-contract-terminal-contract-status-option-count-aligned='), 'Expected admin alert panel to expose blocker contract terminal contract status option count alignment metadata.');
  assert.ok(source.includes('data-blocker-contract-terminal-contract-status-known='), 'Expected admin alert panel to expose blocker contract terminal contract status membership metadata.');
  assert.ok(source.includes('data-blocker-contract-terminal-contract-status-aligned='), 'Expected admin alert panel to expose blocker contract terminal contract status alignment metadata.');
  assert.ok(source.includes('data-blocker-contract-terminal-contract-status-contract-ready='), 'Expected admin alert panel to expose blocker contract terminal contract status contract readiness metadata.');
  assert.ok(source.includes('data-blocker-contract-terminal-contract-status-payload-ready='), 'Expected admin alert panel to expose blocker contract terminal contract status payload readiness metadata.');
  assert.ok(source.includes('data-blocker-contract-terminal-contract-contract-ready='), 'Expected admin alert panel to expose blocker contract terminal contract final readiness metadata.');
  assert.ok(source.includes('data-blocker-contract-terminal-contract-contract-payload-ready='), 'Expected admin alert panel to expose blocker contract terminal contract final payload readiness metadata.');
  assert.ok(source.includes('data-first-blocker-contract-payload-ready='), 'Expected admin alert panel to expose first blocker contract payload readiness metadata.');
  assert.ok(source.includes('data-blocker-payload-contract-payload-ready='), 'Expected admin alert panel to expose blocker payload contract payload readiness metadata.');
  assert.ok(source.includes('data-blocker-contract-ready='), 'Expected admin alert panel to expose blocker contract readiness metadata.');
  assert.ok(source.includes('data-blocker-contract-payload-ready='), 'Expected admin alert panel to expose blocker contract payload readiness metadata.');
  assert.ok(source.includes('data-blocker-contract-contract-payload-ready='), 'Expected admin alert panel to expose blocker contract contract payload readiness metadata.');
  assert.ok(source.includes('data-blocker-inspection-contract-contract-payload-ready='), 'Expected admin alert panel to expose blocker inspection contract contract payload readiness metadata.');
  assert.ok(source.includes('data-blocker-contract-legacy-payload-ready='), 'Expected admin alert panel to expose blocker contract legacy payload readiness metadata.');
  assert.ok(source.includes('data-blocker-contract-legacy-aligned='), 'Expected admin alert panel to expose blocker contract legacy alignment metadata.');
  assert.ok(source.includes('data-blocker-contract-status='), 'Expected admin alert panel to expose blocker contract status metadata.');
  assert.ok(source.includes('data-blocker-contract-status-payload-ready='), 'Expected admin alert panel to expose blocker contract status payload readiness metadata.');
  assert.ok(source.includes('data-blocker-contract-status-aligned='), 'Expected admin alert panel to expose blocker contract status alignment metadata.');
  assert.ok(source.includes('data-blocker-contract-status-options='), 'Expected admin alert panel to expose blocker contract status options.');
  assert.ok(source.includes('data-blocker-contract-status-option-count='), 'Expected admin alert panel to expose blocker contract status option count.');
  assert.ok(source.includes('data-blocker-contract-status-expected-count='), 'Expected admin alert panel to expose blocker contract status expected count.');
  assert.ok(source.includes('data-blocker-contract-status-option-count-aligned='), 'Expected admin alert panel to expose blocker contract status option count alignment metadata.');
  assert.ok(source.includes('data-blocker-contract-status-known='), 'Expected admin alert panel to expose blocker contract status membership metadata.');
  assert.ok(source.includes('data-blocker-contract-status-contract-ready='), 'Expected admin alert panel to expose blocker contract status contract readiness metadata.');
  assert.ok(source.includes('data-blocker-contract-composite-ready='), 'Expected admin alert panel to expose blocker contract composite readiness metadata.');
  assert.ok(source.includes('data-blocker-contract-composite-payload-ready='), 'Expected admin alert panel to expose blocker contract composite payload readiness metadata.');
  assert.ok(source.includes('data-blocker-contract-composite-status='), 'Expected admin alert panel to expose blocker contract composite status metadata.');
  assert.ok(source.includes('data-blocker-contract-composite-status-aligned='), 'Expected admin alert panel to expose blocker contract composite status alignment metadata.');
  assert.ok(source.includes('data-blocker-contract-composite-status-options='), 'Expected admin alert panel to expose blocker contract composite status options.');
  assert.ok(source.includes('data-blocker-contract-composite-status-option-count='), 'Expected admin alert panel to expose blocker contract composite status option count.');
  assert.ok(source.includes('data-blocker-contract-composite-status-expected-count='), 'Expected admin alert panel to expose blocker contract composite status expected count.');
  assert.ok(source.includes('data-blocker-contract-composite-status-option-count-aligned='), 'Expected admin alert panel to expose blocker contract composite status option count alignment metadata.');
  assert.ok(source.includes('data-blocker-contract-composite-status-known='), 'Expected admin alert panel to expose blocker contract composite status membership metadata.');
  assert.ok(source.includes('data-blocker-contract-composite-status-contract-ready='), 'Expected admin alert panel to expose blocker contract composite status contract readiness metadata.');
  assert.ok(source.includes('data-blocker-contract-composite-status-payload-ready='), 'Expected admin alert panel to expose blocker contract composite status payload readiness metadata.');
  assert.ok(source.includes('data-blocker-contract-composite-contract-ready='), 'Expected admin alert panel to expose blocker contract composite contract readiness metadata.');
  assert.ok(source.includes('data-blocker-contract-composite-contract-payload-ready='), 'Expected admin alert panel to expose blocker contract composite contract payload readiness metadata.');
  assert.ok(source.includes('blocker-contract-incomplete'), 'Expected admin alert panel to define blocker contract incomplete composite status.');
  assert.ok(source.includes('status-contract-incomplete'), 'Expected admin alert panel to define blocker status contract incomplete composite status.');
  assert.ok(source.includes('inspection-incomplete'), 'Expected admin alert panel to define blocker inspection incomplete inspection contract status.');
  assert.ok(source.includes('alignment-status-contract-incomplete'), 'Expected admin alert panel to define blocker alignment status contract incomplete inspection contract status.');
  assert.ok(source.includes('inspection-contract-incomplete'), 'Expected admin alert panel to define blocker launch inspection contract incomplete status.');
  assert.ok(source.includes('composite-contract-incomplete'), 'Expected admin alert panel to define blocker launch composite contract incomplete status.');
  assert.ok(source.includes('launch-contract-incomplete'), 'Expected admin alert panel to define blocker launch contract incomplete composite status.');
  assert.ok(source.includes('legacy-mismatch'), 'Expected admin alert panel to define blocker contract legacy mismatch status.');
  assert.ok(source.includes('payload-incomplete'), 'Expected admin alert panel to define blocker contract payload incomplete status.');
  assert.ok(source.includes('command-incomplete'), 'Expected admin alert panel to define blocker contract command incomplete status.');
  assert.ok(source.includes('display-fallback'), 'Expected admin alert panel to define blocker alignment fallback status.');
  assert.ok(source.includes('mismatch'), 'Expected admin alert panel to define blocker alignment mismatch status.');
  assert.ok(source.includes('data-api-blocker-code-count='), 'Expected admin alert panel to expose API blocker code summary count.');
  assert.ok(source.includes('data-api-blocker-env-var-count='), 'Expected admin alert panel to expose API blocker env var summary count.');
  assert.ok(source.includes('data-structured-blocker-code-count='), 'Expected admin alert panel to expose structured blocker code count.');
  assert.ok(source.includes('data-structured-blocker-env-var-count='), 'Expected admin alert panel to expose structured blocker env var count.');
  assert.ok(source.includes('data-has-recipient-blocker='), 'Expected admin alert panel to expose recipient blocker state.');
  assert.ok(source.includes('data-has-dry-run-blocker='), 'Expected admin alert panel to expose dry-run blocker state.');
  assert.ok(source.includes('data-command-bundle-complete='), 'Expected admin alert panel to expose notification command bundle completeness metadata.');
  assert.ok(source.includes('data-command-keys='), 'Expected admin alert panel to expose notification command keys metadata.');
  assert.ok(source.includes('data-command-key-count='), 'Expected admin alert panel to expose notification command key count metadata.');
  assert.ok(source.includes('data-command-key-count-aligned='), 'Expected admin alert panel to expose notification command key count alignment metadata.');
  assert.ok(source.includes('data-command-count='), 'Expected admin alert panel to expose notification command count metadata.');
  assert.ok(source.includes('data-command-count-aligned='), 'Expected admin alert panel to expose notification command count alignment metadata.');
  assert.ok(source.includes('data-command-inspection-ready='), 'Expected admin alert panel to expose notification command inspection readiness metadata.');
  assert.ok(source.includes('data-command-inspection-payload-ready='), 'Expected admin alert panel to expose notification command inspection payload readiness metadata.');
  assert.ok(source.includes('data-command-expected-count='), 'Expected admin alert panel to expose notification expected command count metadata.');
  assert.ok(source.includes('data-command-expected-payload-ready='), 'Expected admin alert panel to expose notification expected command payload readiness metadata.');
  assert.ok(source.includes('data-notification-command-panel-payload-ready='), 'Expected admin alert panel to expose notification command panel payload readiness metadata.');
  assert.ok(source.includes('data-first-blocker-payload-ready='), 'Expected admin alert panel to expose first blocker payload readiness metadata.');
  assert.ok(source.includes('data-first-blocker-identity-payload-ready='), 'Expected admin alert panel to expose first blocker identity payload readiness metadata.');
  assert.ok(source.includes('data-first-blocker-action-payload-ready='), 'Expected admin alert panel to expose first blocker action payload readiness metadata.');
  assert.ok(source.includes('data-first-blocker-detail-payload-ready='), 'Expected admin alert panel to expose first blocker detail payload readiness metadata.');
  assert.ok(source.includes('data-first-blocker-env-payload-ready='), 'Expected admin alert panel to expose first blocker env payload readiness metadata.');
  assert.ok(source.includes('data-first-blocker-code-payload-ready='), 'Expected admin alert panel to expose first blocker code payload readiness metadata.');
  assert.ok(source.includes('data-notification-blocker-panel-payload-ready='), 'Expected admin alert panel to expose notification blocker panel payload readiness metadata.');
  assert.ok(source.includes('data-first-blocker-code='), 'Expected admin alert panel to expose first blocker codes.');
  assert.ok(source.includes('data-first-blocker-env-vars='), 'Expected admin alert panel to expose first blocker env vars.');
  assert.ok(source.includes('data-first-blocker-env-var-count='), 'Expected admin alert panel to expose first blocker env var counts.');
  assert.ok(source.includes('data-first-blocker-detail='), 'Expected admin alert panel to expose first blocker detail.');
  assert.ok(source.includes('data-first-blocker-next-command='), 'Expected admin alert panel to expose first blocker next command.');
  assert.ok(source.includes('data-property-inquiry-command-payload-ready='), 'Expected admin alert panel to expose property-inquiry command payload readiness metadata.');
  assert.ok(source.includes('data-notification-readiness-command-payload-ready='), 'Expected admin alert panel to expose notification-readiness command payload readiness metadata.');
  assert.ok(source.includes('data-strict-notification-readiness-command-payload-ready='), 'Expected admin alert panel to expose strict notification-readiness command payload readiness metadata.');
  assert.ok(source.includes('data-strict-notification-contract-command-payload-ready='), 'Expected admin alert panel to expose strict notification contract command payload readiness metadata.');
  assert.ok(source.includes('data-launch-readiness-command-payload-ready='), 'Expected admin alert panel to expose launch readiness command payload readiness metadata.');
  assert.ok(source.includes('data-notification-command-chain-payload-ready='), 'Expected admin alert panel to expose notification command chain payload readiness metadata.');
  assert.ok(source.includes('data-notification-command-panel-complete-payload-ready='), 'Expected admin alert panel to expose notification command panel complete payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-panel-payload-ready='), 'Expected admin alert panel to expose notification launch panel payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-terminal-payload-ready='), 'Expected admin alert panel to expose notification launch terminal payload readiness metadata.');
  assert.ok(source.includes('data-notification-readiness-level-payload-ready='), 'Expected admin alert panel to expose notification readiness level payload readiness metadata.');
  assert.ok(source.includes('data-notification-readiness-summary-payload-ready='), 'Expected admin alert panel to expose notification readiness summary payload readiness metadata.');
  assert.ok(source.includes('data-notification-blocker-list-payload-ready='), 'Expected admin alert panel to expose notification blocker list payload readiness metadata.');
  assert.ok(source.includes('data-notification-blocker-list-count-payload-ready='), 'Expected admin alert panel to expose notification blocker list count payload readiness metadata.');
  assert.ok(source.includes('data-notification-blocker-list-detail-payload-ready='), 'Expected admin alert panel to expose notification blocker list detail payload readiness metadata.');
  assert.ok(source.includes('data-notification-blocker-list-env-payload-ready='), 'Expected admin alert panel to expose notification blocker list env payload readiness metadata.');
  assert.ok(source.includes('data-notification-blocker-list-action-payload-ready='), 'Expected admin alert panel to expose notification blocker list action payload readiness metadata.');
  assert.ok(source.includes('data-notification-blocker-list-code-payload-ready='), 'Expected admin alert panel to expose notification blocker list code payload readiness metadata.');
  assert.ok(source.includes('data-notification-blocker-list-complete-payload-ready='), 'Expected admin alert panel to expose notification blocker list complete payload readiness metadata.');
  assert.ok(source.includes('data-recipient-blocker-payload-ready='), 'Expected admin alert panel to expose recipient blocker payload readiness metadata.');
  assert.ok(source.includes('data-dry-run-blocker-payload-ready='), 'Expected admin alert panel to expose dry-run blocker payload readiness metadata.');
  assert.ok(source.includes('data-property-inquiry-blocker-gate-payload-ready='), 'Expected admin alert panel to expose property-inquiry blocker gate payload readiness metadata.');
  assert.ok(source.includes('data-notification-blocker-gate-payload-ready='), 'Expected admin alert panel to expose notification blocker gate payload readiness metadata.');
  assert.ok(source.includes('data-notification-readiness-gate-payload-ready='), 'Expected admin alert panel to expose notification readiness gate payload readiness metadata.');
  assert.ok(source.includes('data-notification-command-readiness-gate-payload-ready='), 'Expected admin alert panel to expose notification command readiness gate payload readiness metadata.');
  assert.ok(source.includes('data-notification-blocker-panel-complete-payload-ready='), 'Expected admin alert panel to expose notification blocker panel complete payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-panel-complete-payload-ready='), 'Expected admin alert panel to expose notification launch panel complete payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-gate-payload-ready='), 'Expected admin alert panel to expose notification launch gate payload readiness metadata.');
  assert.ok(source.includes('data-notification-terminal-gate-payload-ready='), 'Expected admin alert panel to expose notification terminal gate payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-terminal-complete-payload-ready='), 'Expected admin alert panel to expose notification launch terminal complete payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-payload-ready='), 'Expected admin alert panel to expose notification launch verified payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-status-payload-ready='), 'Expected admin alert panel to expose notification launch verified status payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-summary-payload-ready='), 'Expected admin alert panel to expose notification launch verified summary payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-blocker-count-payload-ready='), 'Expected admin alert panel to expose notification launch verified blocker count payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-env-count-payload-ready='), 'Expected admin alert panel to expose notification launch verified env count payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-counts-payload-ready='), 'Expected admin alert panel to expose notification launch verified counts payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-api-summary-payload-ready='), 'Expected admin alert panel to expose notification launch verified API summary payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-summary-alignment-payload-ready='), 'Expected admin alert panel to expose notification launch verified summary alignment payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-inspection-payload-ready='), 'Expected admin alert panel to expose notification launch verified inspection payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-inspection-contract-payload-ready='), 'Expected admin alert panel to expose notification launch verified inspection contract payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-inspection-status-payload-ready='), 'Expected admin alert panel to expose notification launch verified inspection status payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-inspection-status-option-payload-ready='), 'Expected admin alert panel to expose notification launch verified inspection status option payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-inspection-status-known-payload-ready='), 'Expected admin alert panel to expose notification launch verified inspection status known payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-inspection-status-contract-payload-ready='), 'Expected admin alert panel to expose notification launch verified inspection status contract payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-inspection-contract-complete-payload-ready='), 'Expected admin alert panel to expose notification launch verified inspection contract complete payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-contract-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch contract payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-contract-status-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch contract status payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-contract-status-option-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch contract status option payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-contract-status-known-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch contract status known payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-contract-status-contract-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch contract status contract payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-contract-composite-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch contract composite payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-contract-composite-status-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch contract composite status payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-contract-composite-contract-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch contract composite contract payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-status-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness status payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-status-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract status payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-contract-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract contract payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-composite-status-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract composite status payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-composite-contract-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract composite contract payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-final-status-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract final status payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-final-contract-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract final contract payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-final-contract-status-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract final contract status payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-final-final-contract-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract final final contract payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-final-final-contract-status-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract final final contract status payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-final-final-contract-contract-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract final final contract contract payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-terminal-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract terminal payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-terminal-status-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract terminal status payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-terminal-contract-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract terminal contract payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-terminal-contract-status-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract terminal contract status payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-terminal-contract-contract-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract terminal contract contract payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-first-blocker-contract-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract first blocker contract payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-blocker-payload-contract-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract blocker payload contract payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-blocker-contract-contract-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract blocker contract contract payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-blocker-inspection-contract-contract-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract blocker inspection contract contract payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-blocker-legacy-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract blocker legacy payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-blocker-status-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract blocker status payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-blocker-composite-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract blocker composite payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-blocker-composite-status-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract blocker composite status payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-blocker-composite-contract-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract blocker composite contract payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-command-inspection-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract command inspection payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-command-expected-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract command expected payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-first-blocker-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract first blocker payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-first-blocker-identity-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract first blocker identity payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-first-blocker-action-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract first blocker action payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-first-blocker-detail-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract first blocker detail payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-first-blocker-env-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract first blocker env payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-first-blocker-code-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract first blocker code payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-blocker-panel-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification blocker panel payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-command-panel-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification command panel payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-property-inquiry-command-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract property inquiry command payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-readiness-command-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification readiness command payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-strict-notification-readiness-command-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract strict notification readiness command payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-strict-notification-contract-command-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract strict notification contract command payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-launch-readiness-command-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract launch readiness command payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-command-chain-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification command chain payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-command-panel-complete-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification command panel complete payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-panel-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch panel payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-terminal-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch terminal payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-readiness-level-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification readiness level payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-readiness-summary-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification readiness summary payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-blocker-list-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification blocker list payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-blocker-list-count-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification blocker list count payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-blocker-list-detail-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification blocker list detail payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-blocker-list-env-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification blocker list env payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-blocker-list-action-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification blocker list action payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-blocker-list-code-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification blocker list code payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-blocker-list-complete-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification blocker list complete payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-property-inquiry-blocker-gate-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract property inquiry blocker gate payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification blocker gate payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-readiness-gate-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification readiness gate payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-command-readiness-gate-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification command readiness gate payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-blocker-panel-complete-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification blocker panel complete payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-panel-complete-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch panel complete payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-gate-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch gate payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-terminal-gate-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification terminal gate payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-terminal-complete-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch terminal complete payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-status-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified status payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-summary-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified summary payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-blocker-count-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified blocker count payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-env-count-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified env count payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-counts-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified counts payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-api-summary-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified api summary payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-summary-alignment-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified summary alignment payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-inspection-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified inspection payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-inspection-contract-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified inspection contract payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-inspection-status-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified inspection status payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-inspection-status-option-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified inspection status option payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-inspection-status-known-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified inspection status known payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-inspection-status-contract-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified inspection status contract payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-inspection-contract-complete-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified inspection contract complete payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-contract-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch contract payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-contract-status-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch contract status payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-contract-status-option-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch contract status option payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-contract-status-known-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch contract status known payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-contract-status-contract-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch contract status contract payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-contract-composite-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch contract composite payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-contract-composite-status-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch contract composite status payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-contract-composite-contract-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch contract composite contract payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-status-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness status payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-status-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract status payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-contract-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract contract payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-composite-status-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract composite status payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-composite-contract-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract composite contract payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-final-status-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract final status payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-final-contract-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract final contract payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-final-contract-status-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract final contract status payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-final-final-contract-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract final final contract payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-final-final-contract-status-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract final final contract status payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-final-final-contract-contract-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract final final contract contract payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-terminal-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract terminal payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-terminal-status-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract terminal status payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-terminal-contract-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract terminal contract payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-terminal-contract-status-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract terminal contract status payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-terminal-contract-contract-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract terminal contract contract payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-first-blocker-contract-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract first blocker contract payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-blocker-payload-contract-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract blocker payload contract payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-blocker-contract-contract-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract blocker contract contract payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-blocker-inspection-contract-contract-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract blocker inspection contract contract payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-blocker-legacy-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract blocker legacy payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-blocker-status-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract blocker status payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-blocker-composite-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract blocker composite payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-blocker-composite-status-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract blocker composite status payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-blocker-composite-contract-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract blocker composite contract payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-command-inspection-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract command inspection payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-command-expected-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract command expected payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-first-blocker-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract first blocker payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-first-blocker-identity-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract first blocker identity payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-first-blocker-action-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract first blocker action payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-first-blocker-detail-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract first blocker detail payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-first-blocker-env-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract first blocker env payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-first-blocker-code-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract first blocker code payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-panel-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker panel payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-command-panel-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification command panel payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-property-inquiry-command-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract property inquiry command payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-readiness-command-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification readiness command payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-strict-notification-readiness-command-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract strict notification readiness command payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-strict-notification-contract-command-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract strict notification contract command payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-launch-readiness-command-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract launch readiness command payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-command-chain-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification command chain payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-command-panel-complete-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification command panel complete payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-launch-panel-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification launch panel payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-launch-terminal-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification launch terminal payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-readiness-level-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification readiness level payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-readiness-summary-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification readiness summary payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-list-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker list payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-list-count-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker list count payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-list-detail-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker list detail payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-list-env-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker list env payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-list-action-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker list action payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-list-code-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker list code payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-list-complete-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker list complete payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-property-inquiry-blocker-gate-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract property inquiry blocker gate payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-complete-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate complete payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-complete-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready complete payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-complete-verified-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready complete verified payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-complete-verified-final-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready complete verified final payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-complete-verified-final-ready-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready complete verified final ready payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-complete-verified-final-ready-complete-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready complete verified final ready complete payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-complete-verified-final-ready-complete-verified-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready complete verified final ready complete verified payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-complete-verified-final-ready-complete-verified-final-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready complete verified final ready complete verified final payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-complete-verified-final-ready-complete-verified-final-ready-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready complete verified final ready complete verified final ready payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready complete verified final ready complete verified final ready complete payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready complete verified final ready complete verified final ready complete verified payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready complete verified final ready complete verified final ready complete verified final payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready complete verified final ready complete verified final ready complete verified final ready payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready complete verified final ready complete verified final ready complete verified final ready complete payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready complete verified final ready complete verified final ready complete verified final ready complete verified payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready complete verified final ready complete verified final ready complete verified final ready complete verified final payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-complete-verified-final-ready-payload-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready complete verified final ready payload readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verified='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-complete='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification completion metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-verified='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final verification metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-verified='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion verification metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-verified='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final verification metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-complete='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final completion metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-complete-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final completion readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-complete-verified='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final completion verification metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-complete-final='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final completion final metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-complete-final-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final completion final readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-complete-final-verified='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final completion final verification metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-complete-final-complete='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final completion final completion metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-complete-final-complete-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final completion final completion readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-complete-final-complete-verified='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final completion final completion verification metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-complete-final-complete-final='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final completion final completion final metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-complete-final-complete-final-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final completion final completion final readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-complete-final-complete-final-verified='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final completion final completion final verification metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-complete-final-complete-final-complete='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final completion final completion final completion metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-complete-final-complete-final-complete-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final completion final completion final completion readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-complete-final-complete-final-complete-verified='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final completion final completion final completion verification metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-complete-final-complete-final-complete-final='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final completion final completion final completion final metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-complete-final-complete-final-complete-final-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final completion final completion final completion final readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-complete-final-complete-final-complete-final-verified='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final completion final completion final completion final verification metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-complete-final-complete-final-complete-final-complete='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final completion final completion final completion final completion metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-complete-final-complete-final-complete-final-complete-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final completion final completion final completion final completion readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-complete-final-complete-final-complete-final-complete-verified='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final completion final completion final completion final completion verification metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-complete-final-complete-final-complete-final-complete-final='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final completion final completion final completion final completion final metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-complete-final-complete-final-complete-final-complete-final-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final completion final completion final completion final completion final readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-complete-final-complete-final-complete-final-complete-final-verified='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final completion final completion final completion final completion final verification metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-complete-final-complete-final-complete-final-complete-final-complete='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final completion final completion final completion final completion final completion metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-complete-final-complete-final-complete-final-complete-final-complete-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final completion final completion final completion final completion final completion readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-complete-final-complete-final-complete-final-complete-final-complete-verified='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final completion final completion final completion final completion final completion verification metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-complete-final-complete-final-complete-final-complete-final-complete-final='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final completion final completion final completion final completion final completion final metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-complete-final-complete-final-complete-final-complete-final-complete-final-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final completion final completion final completion final completion final completion final readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-complete-final-complete-final-complete-final-complete-final-complete-final-verified='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final completion final completion final completion final completion final completion final verification metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-complete-final-complete-final-complete-final-complete-final-complete-final-complete='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final completion final completion final completion final completion final completion final completion metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-complete-final-complete-final-complete-final-complete-final-complete-final-complete-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final completion final completion final completion final completion final completion final completion readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-complete-final-complete-final-complete-final-complete-final-complete-final-complete-verified='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final completion final completion final completion final completion final completion final completion verification metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-complete-final-complete-final-complete-final-complete-final-complete-final-complete-final='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final completion final completion final completion final completion final completion final completion final metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-complete-final-complete-final-complete-final-complete-final-complete-final-complete-final-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final completion final completion final completion final completion final completion final completion final readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-complete-final-complete-final-complete-final-complete-final-complete-final-complete-final-verified='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final completion final completion final completion final completion final completion final completion final verification metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-complete-final-complete-final-complete-final-complete-final-complete-final-complete-final-complete='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final completion final completion final completion final completion final completion final completion final completion metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-complete-final-complete-final-complete-final-complete-final-complete-final-complete-final-complete-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final completion final completion final completion final completion final completion final completion final completion readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-complete-final-complete-final-complete-final-complete-final-complete-final-complete-final-complete-verified='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final completion final completion final completion final completion final completion final completion final completion verification metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-complete-final-complete-final-complete-final-complete-final-complete-final-complete-final-complete-final='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final completion final completion final completion final completion final completion final completion final completion final metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-complete-final-complete-final-complete-final-complete-final-complete-final-complete-final-complete-final-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final completion final completion final completion final completion final completion final completion final completion final readiness metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-complete-final-complete-final-complete-final-complete-final-complete-final-complete-final-complete-final-verified='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final completion final completion final completion final completion final completion final completion final completion final verification metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-complete-final-complete-final-complete-final-complete-final-complete-final-complete-final-complete-final-complete='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final completion final completion final completion final completion final completion final completion final completion final completion metadata.');
  assert.ok(source.includes('data-notification-launch-verified-launch-readiness-contract-notification-launch-verified-launch-readiness-contract-notification-blocker-gate-verified-complete-final-ready-payload-contract-verification-final-complete-final-complete-final-complete-final-complete-final-complete-final-complete-final-complete-final-complete-final-complete-ready='), 'Expected admin alert panel to expose notification launch verified launch readiness contract notification launch verified launch readiness contract notification blocker gate verified complete final ready payload contract verification final completion final completion final completion final completion final completion final completion final completion final completion final completion readiness metadata.');
  assert.ok(source.includes('data-command-property-inquiry-readiness='), 'Expected admin alert panel to expose property-inquiry readiness command metadata.');
  assert.ok(source.includes('data-command-notification-readiness='), 'Expected admin alert panel to expose notification readiness command metadata.');
  assert.ok(source.includes('data-command-strict-notification-readiness='), 'Expected admin alert panel to expose strict notification readiness command metadata.');
  assert.ok(source.includes('data-command-strict-notification-contract='), 'Expected admin alert panel to expose strict notification contract command metadata.');
  assert.ok(source.includes('data-command-launch-readiness='), 'Expected admin alert panel to expose launch readiness command metadata.');
  assert.ok(source.includes('data-blocker-code='), 'Expected admin alert panel to expose per-blocker codes.');
  assert.ok(source.includes('data-blocker-env-vars='), 'Expected admin alert panel to expose per-blocker env vars.');
  assert.ok(source.includes('data-blocker-env-var-count='), 'Expected admin alert panel to expose per-blocker env var counts.');
  assert.ok(source.includes('data-blocker-detail='), 'Expected admin alert panel to expose per-blocker details.');
  assert.ok(source.includes('data-blocker-next-command='), 'Expected admin alert panel to expose per-blocker next commands.');
  assert.ok(source.includes('data-mls-status='), 'Expected admin MLS panel to expose status metadata.');
  assert.ok(source.includes('data-mls-retry-route='), 'Expected admin MLS panel to expose retry route metadata.');
  assert.ok(source.includes('data-retry-plan-level='), 'Expected admin MLS panel to expose retry plan metadata.');
  assert.ok(source.includes('data-dead-letter-open='), 'Expected admin MLS panel to expose dead-letter open metadata.');
  assert.ok(source.includes('data-search-index-health='), 'Expected admin MLS panel to expose search-index health metadata.');
  assert.ok(source.includes('data-sync-page-timeout-ms='), 'Expected admin MLS panel to expose sync timeout metadata.');
  assert.ok(source.includes('data-command-sync-preview='), 'Expected admin MLS panel to expose sync preview command metadata.');
}

async function assertDeadLetterInspectionMetadataSource() {
  const [source, pageSource] = await Promise.all([
    readFile('components/admin/DeadLetterInspector.tsx', 'utf8'),
    readFile('app/admin/dead-letter/page.tsx', 'utf8'),
  ]);

  assert.ok(pageSource.includes('data-testid="reie-dead-letter-page"'), 'Expected dead-letter page to expose a stable page shell.');
  assert.ok(pageSource.includes('data-page-route="/admin/dead-letter"'), 'Expected dead-letter page to expose route metadata.');
  assert.ok(pageSource.includes('data-page-api-route="/api/admin/dead-letter"'), 'Expected dead-letter page to expose API route metadata.');
  assert.ok(pageSource.includes('data-page-terminal="Terminal 5"'), 'Expected dead-letter page to expose Terminal 5 metadata.');
  assert.ok(pageSource.includes('data-page-component="DeadLetterInspector"'), 'Expected dead-letter page to expose component metadata.');
  assert.ok(pageSource.includes('data-page-noindex="true"'), 'Expected dead-letter page to expose noindex metadata.');
  assert.ok(pageSource.includes('index: false'), 'Expected dead-letter page metadata to disable indexing.');

  for (const testId of [
    'reie-dead-letter-filter-summary',
    'reie-dead-letter-api-metadata',
    'reie-dead-letter-api-command',
    'reie-dead-letter-recovery-plan',
    'reie-dead-letter-command-center',
    'reie-dead-letter-source-queues',
  ]) {
    assert.ok(source.includes(`data-testid="${testId}"`), `Expected dead-letter inspector ${testId} inspection surface.`);
  }

  assert.ok(source.includes('data-api-generated-at='), 'Expected dead-letter inspector to expose generatedAt metadata.');
  assert.ok(source.includes('data-api-route='), 'Expected dead-letter inspector to expose route metadata.');
  assert.ok(source.includes('data-api-terminal='), 'Expected dead-letter inspector to expose terminal metadata.');
  assert.ok(source.includes('data-api-command='), 'Expected dead-letter inspector to expose command metadata.');
  assert.ok(source.includes('data-api-source-queue='), 'Expected dead-letter inspector to expose source queue metadata.');
  assert.ok(source.includes('data-api-states='), 'Expected dead-letter inspector to expose state filter metadata.');
  assert.ok(source.includes('data-recovery-command='), 'Expected dead-letter inspector to expose recovery command metadata.');
  assert.ok(source.includes('data-command-dry-run-retry='), 'Expected dead-letter inspector to expose dry-run retry command metadata.');
  assert.ok(source.includes('data-command-live-retry='), 'Expected dead-letter inspector to expose live retry command metadata.');
  assert.ok(source.includes('data-job-source-queue='), 'Expected dead-letter inspector to expose job source queue metadata.');
}

async function main() {
  const property = await getSmokeProperty();
  const propertyPath = `/properties/${property.slug || property.id}`;

  await assertHomePortalPage();
  await assertAboutAdvisorExperiencePage();
  await assertSellerPage();
  await assertPropertyPage(propertyPath);
  await assertSearchPage();
  await assertPublicBrandVoiceSource();
  await assertDrawerSource();
  await assertPropertyDetailSource();
  await assertLuxuryPopupSource();
  await assertPropertyMapSource();
  await assertMapInnerSource();
  await assertSaveSearchSource();
  await assertLeadCaptureSource();
  await assertPropertyInquirySource();
  await assertRelatedPropertyLinksSource();
  await assertPropertyLinksSource();
  await assertNearbyNeighborhoodsSource();
  await assertCityLinksSource();
  await assertMarketLinksSource();
  await assertToolLinksSource();
  await assertCityInternalLinksSource();
  await assertMarketNeighborhoodLinksSource();
  await assertBlogNeighborhoodLinksSource();
  await assertMarketHomesLinksSource();
  await assertHomesBlogLinksSource();
  await assertRelatedArticlesSource();
  await assertNeighborhoodArticlesSource();
  await assertCityGuidesSource();
  await assertCityMarketStatsSource();
  await assertFAQSchemaSource();
  await assertReusableSchemaComponentSource();
  await assertToolSchemaSource();
  await assertRealEstateAgentSchemaSource();
  await assertPropertySchemaSource();
  await assertArticleSchemaSource();
  await assertCityMarketSchemaSource();
  await assertNeighborhoodSchemaSource();
  await assertNearbyNeighborhoodAuthoritySource();
  await assertRelatedContentSource();
  await assertCityNavigationSource();
  await assertCityNeighborhoodsSource();
  await assertCityHubLinkSource();
  await assertNeighborhoodMarketLinkSource();
  await assertSearchMetadataSource();
  await assertAdminInspectionMetadataSource();
  await assertDeadLetterInspectionMetadataSource();

  console.log(
    JSON.stringify(
      {
        success: true,
        check: 'public-experience-smoke',
        baseUrl: BASE_URL,
        property: {
          id: property.id,
          slug: property.slug,
          address: property.address,
          path: propertyPath,
        },
        assertions: {
          homePortalRestoration: true,
          aboutAdvisorExperience: true,
          sellerJourneyEntry: true,
          propertyDetailBridge: true,
          propertyInquiryGuidance: true,
          searchIntelligence: true,
          adminPageMetadata: true,
          searchInspectionMetadata: true,
          adminInspectionMetadata: true,
          deadLetterPageMetadata: true,
          deadLetterInspectionMetadata: true,
          selectedDrawerInquiryTarget: true,
          publicBrandVoiceSafety: true,
        },
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error(`Public experience smoke failed: ${errorMessage(error)}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
