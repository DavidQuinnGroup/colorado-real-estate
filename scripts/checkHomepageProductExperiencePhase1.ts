import { readFileSync } from 'node:fs';

function read(path: string): string {
  return readFileSync(path, 'utf8');
}

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function assertIncludes(source: string, expected: string, message: string): void {
  assert(source.includes(expected), message);
}

function assertNotIncludes(source: string, prohibited: string, message: string): void {
  assert(!source.includes(prohibited), message);
}

const homepage = read('app/page.tsx');
const globals = read('app/globals.css');

assertIncludes(
  homepage,
  'data-homepage-phase-one="structural-simplification"',
  'Homepage must expose the Phase 1 structural simplification marker.',
);
assertIncludes(homepage, 'data-homepage-primary-cta="/search"', 'Homepage must preserve Search as the primary action.');
assertIncludes(homepage, 'data-homepage-community-grid="removed"', 'Homepage must mark the long Communities grid as removed.');
assertIncludes(homepage, 'data-homepage-mortgage-calculator="false"', 'Homepage must explicitly preserve the Mortgage Calculator boundary.');

for (const testHandle of [
  'data-testid="home-portal-hero"',
  'data-testid="home-portal-journey"',
  'data-testid="home-djx-continuity"',
  'data-testid="home-portal-why-reie"',
  'data-testid="home-portal-search-section"',
  'data-testid="home-portal-communities"',
  'data-testid="home-portal-grand-plan"',
  'data-testid="home-portal-david-quinn"',
]) {
  assertIncludes(homepage, testHandle, `Homepage must preserve certified test handle: ${testHandle}`);
}

for (const route of ['/search', '/market', '/buy', '/sell', '/grand-plan', '/about', '/contact']) {
  assert(
    homepage.includes(`href="${route}"`) || homepage.includes(`href: '${route}'`),
    `Homepage must preserve continuity to ${route}.`,
  );
}

for (const requiredCopy of [
  'Find the right Colorado home with more context before you click.',
  'Start with criteria, context, and confidence.',
  'The full search product is where map, list, and property comparison belong.',
  'Continue to Guided Search',
  'Colorado Discovery Preview',
  'Continue when you need the full search workspace',
  'Explore Colorado market and community pages when place context matters, without turning the homepage into a directory.',
]) {
  assertIncludes(homepage, requiredCopy, `Homepage must preserve public-experience smoke copy: ${requiredCopy}`);
}

for (const removedDensePattern of [
  'featuredCommunities',
  'home-community-card',
  'home-authority-links',
  'buildHomeAuthorityLinks',
  'getBlogLinks',
  'home-search-entry',
  'id="home-search-city"',
  'id="home-search-query"',
]) {
  assertNotIncludes(homepage, removedDensePattern, `Homepage must not retain dense Phase 1 pattern: ${removedDensePattern}`);
}

assertIncludes(
  homepage,
  'data-testid="home-search-handoff-contract"',
  'Homepage must preserve the non-visible Search handoff contract for existing route-safety checks.',
);

for (const prohibitedRoute of ['/how-reie-works', '/mortgage-calculator', '/tools/mortgage-calculator']) {
  assertNotIncludes(homepage, prohibitedRoute, `Homepage Phase 1 must not introduce route ${prohibitedRoute}.`);
}

for (const prohibitedCalculatorTerm of [
  'mortgage calculator',
  'payment estimate',
  'interest rate',
  'loan term',
  'affordability',
]) {
  assertNotIncludes(homepage.toLowerCase(), prohibitedCalculatorTerm, `Homepage must not implement calculator language: ${prohibitedCalculatorTerm}`);
}

for (const internalEvidenceTerm of [
  'evidenceId',
  'sourceId',
  'providerId',
  'rights enum',
  'confidence percentage',
  'eligibility outcome',
  'maturity code',
]) {
  assertNotIncludes(homepage, internalEvidenceTerm, `Homepage must not expose internal evidence metadata: ${internalEvidenceTerm}`);
}

for (const prohibitedClaim of [
  'best neighborhood',
  'safest neighborhood',
  'school ranking',
  'safety ranking',
  'guaranteed results',
  'forecast appreciation',
  'investment recommendation',
  'approval guarantee',
]) {
  assertNotIncludes(homepage.toLowerCase(), prohibitedClaim, `Homepage must not introduce prohibited claim: ${prohibitedClaim}`);
}

assertIncludes(globals, '.home-decision-grid', 'Homepage CSS must define the simplified decision grid.');
assertIncludes(globals, '.home-search-preview-simplified', 'Homepage CSS must define the simplified Search preview.');
assertIncludes(globals, '.home-market-teaser', 'Homepage CSS must define the market teaser treatment.');
assertIncludes(globals, '.home-djx-strip', 'Homepage CSS must define the lighter Decision Journey strip.');

assertNotIncludes(
  globals,
  '.home-phase-one .home-community-card',
  'Homepage Phase 1 must not preserve a scoped long community-card treatment.',
);

console.log('Homepage Product Experience Phase 1 check passed.');
