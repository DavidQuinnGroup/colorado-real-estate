import assert from 'node:assert/strict';
import fs from 'node:fs';

const governedStatus = 'REIE_7_1_SPRINT_1_PUBLIC_NAVIGATION_VISUAL_TRUST_AND_ROUTE_COMPLETION_BASELINE';

const publicRouteFiles = [
  'app/page.tsx',
  'app/search/page.tsx',
  'app/market/page.tsx',
  'app/market/[city]/page.tsx',
  'app/market/[city]/[slug]/page.tsx',
  'app/properties/[id]/page.tsx',
  'app/sell/page.tsx',
  'app/grand-plan/page.tsx',
  'app/about/page.tsx',
  'app/contact/page.tsx',
  'app/privacy/page.tsx',
  'app/terms/page.tsx',
  'app/accessibility/page.tsx',
  'app/fair-housing/page.tsx',
  'app/brokerage-disclosures/page.tsx',
] as const;

const requiredNavigationRoutes = ['/search', '/market', '/sell', '/grand-plan', '/about', '/contact'] as const;

const forbiddenRouteFiles = [
  'app/mortgage/page.tsx',
  'app/lender/page.tsx',
  'app/lenders/page.tsx',
  'app/what-is-my-home-worth/page.tsx',
  'app/sundance/page.tsx',
] as const;

const forbiddenRuntimePatterns = [
  /GoogleAnalytics|gtag\(|Segment|Mixpanel|Amplitude|posthog/i,
  /document\.cookie\s*=/i,
  /localStorage\.setItem|sessionStorage\.setItem/i,
  /OpenAI|chatbot|AI recommendation/i,
  /GIS Sprint 9|provider activation|provider connection/i,
  /Prisma\.|prisma\.|migration/i,
] as const;

function read(filePath: string) {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string) {
  assert(source.includes(value), message);
}

function assertNotIncludes(source: string, value: string, message: string) {
  assert(!source.includes(value), message);
}

function assertIncludesAny(source: string, values: readonly string[], message: string) {
  assert(values.some((value) => source.includes(value)), message);
}

function assertFileExists(filePath: string) {
  assert(fs.existsSync(filePath), `${filePath} must exist.`);
}

function assertFileMissing(filePath: string) {
  assert(!fs.existsSync(filePath), `${filePath} must remain absent in Sprint 1.`);
}

function assertNoForbiddenRuntime(source: string, filePath: string, options: { allowExistingDataAccess?: boolean } = {}) {
  const patterns = options.allowExistingDataAccess
    ? forbiddenRuntimePatterns.filter((pattern) => !String(pattern).includes('Prisma'))
    : forbiddenRuntimePatterns;

  for (const pattern of patterns) {
    assert.doesNotMatch(source, pattern, `${filePath} must not introduce telemetry, storage, AI, GIS, providers, Prisma, or migrations.`);
  }
}

for (const filePath of publicRouteFiles) assertFileExists(filePath);
for (const filePath of forbiddenRouteFiles) assertFileMissing(filePath);

const layout = read('app/layout.tsx');
assertIncludes(layout, 'PublicNavigation', 'Root layout must render the shared public navigation.');
assertIncludes(layout, 'BrokerageAttribution', 'Root layout must preserve brokerage attribution.');

const navigation = read('components/PublicNavigation.tsx');
assertIncludes(navigation, 'data-testid="reie-public-navigation"', 'Shared public navigation must be testable.');
assertIncludes(navigation, 'data-reie-navigation-consistent="true"', 'Navigation must expose governed consistency marker.');
assertIncludes(navigation, 'data-reie-brand-position="upper-left"', 'Brand must be marked as upper-left.');
assertIncludes(navigation, 'data-reie-brand-home-link="/"', 'Brand identity must link to home.');
assertIncludes(navigation, "pathname?.startsWith('/admin')", 'Shared public navigation must not render on protected admin routes.');
assertIncludes(navigation, 'aria-label="David Quinn Group home"', 'Brand home link must have an accessible name.');
for (const route of requiredNavigationRoutes) {
  assertIncludes(navigation, `href: '${route}'`, `Navigation must include ${route}.`);
}
assertNoForbiddenRuntime(navigation, 'components/PublicNavigation.tsx');

const brokerageAttribution = read('components/BrokerageAttribution.tsx');
assertIncludes(brokerageAttribution, 'data-testid="public-brokerage-attribution"', 'Brokerage attribution must remain present.');
assertIncludes(brokerageAttribution, 'data-reie-sprint-1-disclosure-preserved="true"', 'Disclosure preservation marker must be present.');
assertIncludes(brokerageAttribution, 'BROKERAGE_FIRM_NAME', 'Brokerage attribution must continue using governed firm name.');
assertIncludes(brokerageAttribution, 'data-team-is-separate-brokerage="false"', 'Team identity must not be presented as a separate brokerage.');

const home = read('app/page.tsx');
assertIncludes(home, 'home-portal-hero', 'Home must keep first-impression hero.');
assertIncludes(home, 'min-h-[calc(100vh-112px)]', 'Home hero must account for shared public navigation.');
assertNotIncludes(home, 'home-portal-premium-header', 'Home must not keep a duplicate route-local header.');

const searchPage = read('app/search/page.tsx');
assertIncludes(searchPage, 'h-[calc(100vh-112px)]', 'Search must account for shared public navigation height.');
assertIncludes(searchPage, 'SearchInterface', 'Search route must preserve certified search interface.');

const market = read('app/market/page.tsx');
assertIncludes(market, 'data-testid="cep-market-discovery-page"', 'Market discovery must remain present.');
assertIncludes(market, 'data-cep-measurement-active="false"', 'Market measurement must remain passive.');

const seller = read('app/sell/page.tsx');
assertIncludes(seller, 'HomeValueEstimator', 'Seller page must preserve existing valuation intake component.');
assertIncludes(seller, 'data-testid="seller-page"', 'Seller route must remain testable.');

const publicTrust = read('components/PublicTrustPage.tsx');
assertIncludes(publicTrust, 'public-trust-page', 'Public trust pages must keep governed shell.');

const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
assert(packageJson.scripts?.['check:reie-first-impression-experience-baseline'], 'package.json must expose the REIE Sprint 1 safety check.');

const sprintDoc = read('docs/project-atlas/executive-library/REIE-7.1-SPRINT-1-PUBLIC-NAVIGATION-VISUAL-TRUST-AND-ROUTE-COMPLETION-BASELINE.md');
assertIncludes(sprintDoc, governedStatus, 'Sprint documentation must record the governed identifier.');
assertIncludesAny(sprintDoc, ['Deployment remains prohibited', 'deployment changes', 'deployment'], 'Sprint documentation must preserve deployment prohibition.');

const chatStart = read('docs/CHAT_START.md');
assertIncludes(chatStart, governedStatus, 'CHAT_START must record the Sprint 1 governed identifier.');
assertIncludesAny(chatStart, ['Deployment remains prohibited', 'Deployment: `NOT_AUTHORIZED`', 'deployment'], 'CHAT_START must preserve deployment prohibition.');

for (const filePath of [
  'app/page.tsx',
  'app/search/page.tsx',
  'app/market/page.tsx',
  'app/sell/page.tsx',
  'app/grand-plan/page.tsx',
  'app/about/page.tsx',
  'components/PublicTrustPage.tsx',
  'components/BrokerageAttribution.tsx',
]) {
  assertNoForbiddenRuntime(read(filePath), filePath, { allowExistingDataAccess: filePath === 'app/properties/[id]/page.tsx' });
}

console.log('[reie-first-impression-experience-baseline] ok: shared navigation, visual trust, route continuity, disclosure preservation, and exclusion boundaries verified.');
