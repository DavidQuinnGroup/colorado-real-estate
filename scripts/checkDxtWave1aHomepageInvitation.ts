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

function indexOfRequired(source: string, expected: string): number {
  const index = source.indexOf(expected);
  assert(index >= 0, `Missing required sequence marker: ${expected}`);
  return index;
}

const homepage = read('app/page.tsx');
const packageJson = read('package.json');
const tsconfigWorker = read('tsconfig.worker.json');

assertIncludes(
  homepage,
  'data-dxt-wave-1a-homepage-invitation="true"',
  'Homepage must expose the DXT Wave 1A implementation marker.',
);
assertIncludes(
  homepage,
  'data-dxt-wave-1a-selected-phase="homepage-invitation-and-post-hero-simplification"',
  'Homepage must identify the selected Wave 1A phase.',
);
assertIncludes(
  homepage,
  'data-homepage-brokerage-disclosure-change="false"',
  'Homepage must preserve the brokerage disclosure hold boundary.',
);
assertIncludes(homepage, 'data-dxt-first-viewport="invitation"', 'Hero must be marked as the invitation viewport.');
assertIncludes(homepage, 'data-dxt-primary-action="/search"', 'Hero must keep Search as the primary action.');
assertIncludes(
  homepage,
  'data-dxt-path-model="search-primary-buyer-seller-secondary"',
  'Homepage must mark Search as primary and Buyer/Seller as secondary.',
);

const sequence = [
  'data-testid="home-portal-hero"',
  'data-dxt-post-hero-sequence="primary-search"',
  'data-dxt-post-hero-sequence="decision-paths"',
  'data-dxt-post-hero-sequence="decision-continuity"',
  'data-dxt-post-hero-sequence="selective-proof"',
  'data-dxt-post-hero-sequence="market-context"',
  'data-testid="home-portal-grand-plan"',
  'data-testid="home-portal-david-quinn"',
].map((marker) => indexOfRequired(homepage, marker));

for (let index = 1; index < sequence.length; index += 1) {
  assert(sequence[index] > sequence[index - 1], 'Homepage DXT Wave 1A sequence must be hero, Search, paths, continuity, proof, market, Grand Plan, advisory close.');
}

assert(
  (homepage.match(/data-homepage-path-priority=\{entry\.priority\}/g) || []).length === 1,
  'Decision path cards must expose path priority through the mapped entry priority.',
);
assert(
  (homepage.match(/priority: 'primary'/g) || []).length === 1,
  'Exactly one decision path may be primary.',
);
assert(
  (homepage.match(/priority: 'secondary'/g) || []).length === 2,
  'Exactly two decision paths must be secondary.',
);

for (const requiredCopy of [
  'Find the right Colorado home with more context before you click.',
  'Discover Homes',
  'Start with criteria, context, and confidence.',
  'The full search product is where map, list, and property comparison belong.',
  'One discovery path, two preparation paths.',
  'Search is the primary doorway.',
  'Explore Colorado market and community pages when place context matters, without turning the homepage into a directory.',
]) {
  assertIncludes(homepage, requiredCopy, `Homepage must include DXT Wave 1A copy: ${requiredCopy}`);
}

for (const requiredRoute of ['/search', '/buy', '/sell', '/market', '/grand-plan', '/about', '/contact']) {
  assert(
    homepage.includes(`href="${requiredRoute}"`) || homepage.includes(`href: '${requiredRoute}'`),
    `Homepage must preserve route continuity to ${requiredRoute}.`,
  );
}

for (const protectedHandle of [
  'data-testid="home-portal-hero"',
  'data-testid="home-portal-journey"',
  'data-testid="home-djx-continuity"',
  'data-testid="home-portal-why-reie"',
  'data-testid="home-portal-search-section"',
  'data-testid="reie-home-discovery-intro"',
  'data-testid="home-search-handoff-contract"',
  'data-testid="home-portal-communities"',
  'data-testid="home-portal-grand-plan"',
  'data-testid="home-portal-david-quinn"',
]) {
  assertIncludes(homepage, protectedHandle, `Homepage must preserve certified handle ${protectedHandle}.`);
}

for (const prohibitedRuntimePattern of [
  'localStorage',
  'sessionStorage',
  'document.cookie',
  'fetch(',
  '/api/',
  'prisma',
  'telemetry',
  'trackingId',
  'trackEvent',
  'crm',
  'provider',
  'Mapbox',
  'mapbox',
]) {
  assertNotIncludes(homepage, prohibitedRuntimePattern, `Homepage Wave 1A must not introduce ${prohibitedRuntimePattern}.`);
}

for (const prohibitedClaim of [
  'best neighborhood',
  'safest neighborhood',
  'school ranking',
  'safety ranking',
  'guaranteed results',
  'guaranteed accuracy',
  'forecast appreciation',
  'investment recommendation',
  'approval guarantee',
  'qualification',
  'qualified buyer',
]) {
  assertNotIncludes(homepage.toLowerCase(), prohibitedClaim, `Homepage must not introduce prohibited claim: ${prohibitedClaim}`);
}

assertIncludes(
  packageJson,
  '"check:dxt-wave-1a-homepage-invitation"',
  'package.json must register the DXT Wave 1A homepage invitation check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxtWave1aHomepageInvitation.ts',
  'tsconfig.worker.json must include the DXT Wave 1A homepage invitation check.',
);

console.log('DXT Wave 1A homepage invitation check passed.');
