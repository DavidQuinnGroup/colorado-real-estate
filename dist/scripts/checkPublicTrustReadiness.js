import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const reviewStatus = 'DRAFT_FOR_OWNER_AND_COUNSEL_REVIEW';
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
];
function read(filePath) {
    return fs.readFileSync(filePath, 'utf8');
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
    assert.match(source, /PUBLIC_TRUST_REVIEW_STATUS/, `${route.file} must include the governed draft review status constant.`);
    assert.doesNotMatch(source, /CERTIFIED|APPROVED_BY_COUNSEL|FINAL_LEGAL/i, `${route.file} must not claim legal approval.`);
}
const footer = read('components/Footer.tsx');
assert.match(footer, /data-testid="public-trust-footer-links"/, 'Footer must expose governed public trust links.');
assert.match(footer, /PUBLIC_TRUST_REVIEW_STATUS/, 'Footer must expose the public trust review status.');
for (const route of routes) {
    assert.match(footer, new RegExp(`href:\\s*'${route.href}'|"${route.href}"|route\\.href`), `Footer must link ${route.href}.`);
}
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
    assert.doesNotMatch(source, /defaultChecked|checked=\{true\}/, `${form.file} must not include prechecked consent.`);
}
const publicSources = [
    'components/Footer.tsx',
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
assert.match(publicTrustSource, /MLS_ATTRIBUTION_REQUIRES_OWNER_PROVIDER_REVIEW/, 'MLS attribution uncertainty must be explicit.');
assert.match(publicTrustSource, /Google Drive connector tools/, 'Unavailable Google Drive reconciliation must be recorded.');
assert.match(publicTrustSource, /Brokerage affiliation/, 'Owner-verification register must include brokerage confirmation.');
assert.match(publicTrustSource, /privacy\/accessibility request channel/, 'Owner-verification register must include contact channels.');
const appRoutes = fs
    .readdirSync('app', { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join('app', entry.name));
for (const route of routes) {
    assert.ok(appRoutes.includes(path.dirname(route.file)), `${route.href} must be a public app route.`);
}
console.log(`[public-trust-readiness] ok: ${routes.length} trust routes, footer links, sitemap inclusion, draft review status, owner-review register, and form notices verified.`);
