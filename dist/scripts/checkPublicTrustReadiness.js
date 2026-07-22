import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const reviewStatus = 'PUBLIC_TRUST_PRODUCTION_READY';
const obsoleteDraftStatus = 'DRAFT_FOR_OWNER' + '_AND_COUNSEL_REVIEW';
const prohibitedPublicContactEmail = 'davidquinngroup' + '@gmail.com';
const publicNotificationEmail = 'alerts@davidquinngroup.com';
const routes = [
    { href: '/privacy', file: 'app/privacy/page.tsx', title: 'Privacy Notice' },
    { href: '/terms', file: 'app/terms/page.tsx', title: 'Terms of Use' },
    { href: '/accessibility', file: 'app/accessibility/page.tsx', title: 'Accessibility' },
    { href: '/fair-housing', file: 'app/fair-housing/page.tsx', title: 'Fair Housing' },
    { href: '/brokerage-disclosures', file: 'app/brokerage-disclosures/page.tsx', title: 'Brokerage Disclosures' },
    { href: '/contact', file: 'app/contact/page.tsx', title: 'Contact' },
];
const formNoticeFiles = [
    { file: 'components/PropertyInquiryForm.tsx', marker: 'data-public-trust-form-notice="property-inquiry"' },
    { file: 'components/maps/SaveSearch.tsx', marker: 'data-public-trust-form-notice="save-search"' },
    { file: 'components/LeadCapture.tsx', marker: 'data-public-trust-form-notice="strategy-intake"' },
];
const prohibitedClaims = [
    'Fair Housing Bot Audited',
    'License: David Quinn Group, Colorado',
    'Content clusters verified',
    'REALTOR®',
    'EQUAL HOUSING',
    'full WCAG',
    'fully WCAG',
    'certified compliant',
    'guaranteed',
    '#1 agent',
    'top producer',
    'market leader',
    'most trusted',
    'Compass approved',
    'approved by Compass',
];
function read(filePath) {
    return fs.readFileSync(filePath, 'utf8');
}
function walk(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const fullPath = path.join(dir, entry.name);
        return entry.isDirectory() ? walk(fullPath) : [fullPath];
    });
}
function assertExists(filePath) {
    assert.ok(fs.existsSync(filePath), `Expected ${filePath} to exist.`);
}
function assertMetadata(source, filePath, title) {
    assert.match(source, /export const metadata/, `${filePath} must export metadata.`);
    assert.match(source, new RegExp(`title:\\s+\`?\\$?\\{?[^\\n]*${title}`), `${filePath} must include page title metadata.`);
    assert.match(source, /description:/, `${filePath} must include metadata description.`);
    assert.match(source, /robots:/, `${filePath} must include robots metadata.`);
    assert.match(source, /index:\s*true/, `${filePath} must explicitly index.`);
    assert.match(source, /follow:\s*true/, `${filePath} must explicitly follow.`);
}
for (const route of routes) {
    assertExists(route.file);
    const source = read(route.file);
    assertMetadata(source, route.file, route.title);
    assert.match(source, /PublicTrustPage/, `${route.file} must use the governed public trust layout.`);
    assert.match(source, /PUBLIC_TRUST_REVIEW_STATUS/, `${route.file} must include the governed public trust status constant.`);
    assert.doesNotMatch(source, /CERTIFIED|APPROVED_BY_COUNSEL|FINAL_LEGAL/i, `${route.file} must not claim legal approval.`);
    assert.equal(source.includes(obsoleteDraftStatus), false, `${route.file} must not expose obsolete draft review markers.`);
}
const footer = read('components/Footer.tsx');
assert.match(footer, /data-testid="public-trust-footer-links"/, 'Footer must expose governed public trust links.');
assert.match(footer, /PUBLIC_TRUST_REVIEW_STATUS/, 'Footer must expose the public trust review status.');
assert.match(footer, /BROKERAGE_FIRM_NAME/, 'Footer must include brokerage firm attribution.');
assert.match(footer, /\/contact/, 'Footer must route public contact requests through the contact page.');
assert.doesNotMatch(footer, /mailto:/, 'Footer must not publish a direct email link until a branded contact email is operational.');
for (const route of routes) {
    assert.match(footer, new RegExp(`href:\\s*'${route.href}'|"${route.href}"|route\\.href`), `Footer must link ${route.href}.`);
}
const layout = read('app/layout.tsx');
assert.match(layout, /BrokerageAttribution/, 'Shared root layout must render brokerage attribution on every viewable public page.');
const brokerageAttribution = read('components/BrokerageAttribution.tsx');
assert.match(brokerageAttribution, /data-testid="public-brokerage-attribution"/, 'Brokerage attribution component must be testable.');
assert.match(brokerageAttribution, /BROKERAGE_FIRM_NAME/, 'Brokerage attribution must use the verified brokerage firm constant.');
assert.match(brokerageAttribution, /data-team-is-separate-brokerage="false"/, 'Team identity must not be presented as a separate brokerage.');
const sitemap = read('app/sitemap.ts');
assert.match(sitemap, /publicTrustRoutes/, 'Sitemap must include public trust routes from the governed route list.');
const robots = read('app/robots.ts');
assert.match(robots, /allow:\s*'\/'|allow:\s*"\/"/, 'Robots must explicitly allow public pages.');
assert.match(robots, /disallow:\s*\['\/admin\/', '\/api\/'\]|disallow:\s*\["\/admin\/", "\/api\/"\]/, 'Robots must keep admin and API routes disallowed.');
for (const form of formNoticeFiles) {
    const source = read(form.file);
    assert.match(source, new RegExp(form.marker), `${form.file} must include its public trust form notice marker.`);
    assert.match(source, /href="\/privacy"/, `${form.file} must link the privacy notice.`);
    assert.match(source, /href="\/terms"/, `${form.file} must link the terms page.`);
    assert.match(source, /does not automatically create a brokerage relationship|follow-up routing/, `${form.file} must explain routing and relationship limits.`);
    assert.match(source, /Do not submit confidential negotiating positions/, `${form.file} must preserve confidential-information guardrails.`);
    assert.doesNotMatch(source, /defaultChecked|checked=\{true\}/, `${form.file} must not include prechecked consent.`);
}
const publicSources = [
    'components/Footer.tsx',
    'components/BrokerageAttribution.tsx',
    'components/PublicTrustPage.tsx',
    ...routes.map((route) => route.file),
    ...formNoticeFiles.map((form) => form.file),
].map((filePath) => ({ filePath, source: read(filePath) }));
for (const { filePath, source } of publicSources) {
    for (const claim of prohibitedClaims) {
        assert.equal(source.includes(claim), false, `${filePath} contains prohibited or unverified public claim: ${claim}`);
    }
}
const publicTrustSource = read('lib/publicTrust.ts');
assert.match(publicTrustSource, new RegExp(reviewStatus), 'Public trust source must record the production-ready trust status.');
assert.equal(publicTrustSource.includes(obsoleteDraftStatus), false, 'Obsolete draft marker must be removed from public trust source.');
assert.equal(publicTrustSource.includes(prohibitedPublicContactEmail), false, 'Personal Gmail address must not be published as the long-term public contact identity.');
assert.match(publicTrustSource, /Compass Colorado, LLC, d\/b\/a Compass/, 'Verified brokerage firm name must be recorded.');
assert.match(publicTrustSource, /BRANDED_CONTACT_EMAIL_PENDING/, 'Public trust source must record that branded contact email is pending.');
assert.match(publicTrustSource, /CONTACT_FORM_WORKFLOW/, 'Public trust source must route requests through the contact form workflow while branded email is pending.');
assert.match(publicTrustSource, new RegExp(publicNotificationEmail), 'Approved notification sender email must be recorded.');
assert.match(publicTrustSource, /COMPASS_MARKETING_EXTERNAL_APPROVAL_REQUIRED/, 'Compass marketing approval must remain an external approval item.');
assert.match(publicTrustSource, /COMPASS_BRANDING_EXTERNAL_ASSET_APPROVAL_REQUIRED/, 'Compass branding status must require external asset approval.');
assert.match(publicTrustSource, /PRIVACY_PRODUCTION_READY/, 'Privacy status must be production ready.');
assert.match(publicTrustSource, /LISTING_ADVERTISING_BASELINE_READY_EXTERNAL_ATTRIBUTION_APPROVAL_REQUIRED/, 'MLS and listing attribution uncertainty must be explicit.');
assert.match(publicTrustSource, /Brokerage legal or approved trade name/, 'Owner-verification register must include brokerage confirmation.');
assert.match(publicTrustSource, /privacy\/accessibility request channel/, 'Owner-verification register must include contact channels.');
assert.match(publicTrustSource, /Approved Compass logo asset/, 'Owner-verification register must include Compass logo confirmation.');
assert.match(publicTrustSource, /Approved Compass email address/, 'Owner-verification register must include Compass email confirmation.');
assert.match(publicTrustSource, /Compass Marketing external approval status and evidence date/, 'Owner-verification register must include Compass approval evidence date.');
const contactPage = read('app/contact/page.tsx');
assert.match(contactPage, /PUBLIC_CONTACT_EMAIL_STATUS/, 'Contact page must render branded contact email pending status.');
assert.match(contactPage, /PUBLIC_NOTIFICATION_EMAIL/, 'Contact page must render approved notification sender identity.');
assert.match(contactPage, /Public phone, office address, and branded contact email are not published/, 'Contact page must avoid unverified phone, office, and branded email values.');
assert.doesNotMatch(contactPage, /mailto:/, 'Contact page must not publish a direct email link until a branded contact email is operational.');
for (const { filePath, source } of publicSources) {
    assert.equal(source.includes(prohibitedPublicContactEmail), false, `${filePath} must not publish the personal Gmail contact address.`);
}
const fairHousingPage = read('app/fair-housing/page.tsx');
assert.match(fairHousingPage, /Equal Housing Opportunity/, 'Fair Housing page must display the Equal Housing Opportunity slogan.');
const propertyPage = read('app/properties/[id]/page.tsx');
assert.match(propertyPage, /data-testid="listing-advertising-attribution"/, 'Property pages must include listing attribution review.');
assert.match(propertyPage, /data-listing-source-authority="MLS_PROVIDER_REVIEW_REQUIRED"/, 'Property pages must report source-authority review gap.');
assert.match(propertyPage, /data-listing-compass-url-available="false"/, 'Property pages must not guess Compass.com listing URLs.');
assert.match(propertyPage, /Listing Brokerage/, 'Property pages must expose listing brokerage field support.');
assert.match(propertyPage, /Listing Broker/, 'Property pages must expose listing broker field support.');
assert.match(propertyPage, /Information is compiled from sources deemed reliable/, 'Property pages must include property information disclaimer control.');
const cityMarketPage = read('app/market/[city]/page.tsx');
const neighborhoodMarketPage = read('app/market/[city]/[slug]/page.tsx');
for (const [filePath, source] of [
    ['app/market/[city]/page.tsx', cityMarketPage],
    ['app/market/[city]/[slug]/page.tsx', neighborhoodMarketPage],
]) {
    assert.match(source, /data-market-sales-source-control="present"/, `${filePath} must include market data source controls.`);
    assert.match(source, /data-market-non-participation-disclaimer="present"/, `${filePath} must include non-participation disclaimer controls.`);
    assert.match(source, /do\s+not state or imply/, `${filePath} must avoid implying participation in all market-wide sales.`);
}
const realEstateAgentSchema = read('lib/schema/realEstateAgentSchema.ts');
assert.doesNotMatch(realEstateAgentSchema, /legalName:\s*"David Quinn Group"/, 'Structured data must not present David Quinn Group as the legal brokerage firm.');
assert.match(realEstateAgentSchema, /Compass Colorado, LLC, d\/b\/a Compass/, 'Structured data must identify the verified brokerage firm.');
const assetPaths = fs.existsSync('public') ? walk('public') : [];
const unapprovedCompassAssets = assetPaths.filter((filePath) => /compass/i.test(filePath));
assert.deepEqual(unapprovedCompassAssets, [], 'No unverified Compass logo or branding asset should be present.');
const appRoutes = fs
    .readdirSync('app', { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join('app', entry.name));
for (const route of routes) {
    assert.ok(appRoutes.includes(path.dirname(route.file)), `${route.href} must be a public app route.`);
}
console.log(`[public-trust-readiness] ok: ${routes.length} trust routes, branded contact email pending, contact form routing, shared brokerage attribution, Compass/MLS external approval watch, footer links, sitemap inclusion, production trust status, listing attribution controls, market source controls, verification register, and form notices verified.`);
