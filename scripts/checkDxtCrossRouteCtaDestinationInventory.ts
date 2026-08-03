import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string): void {
  assert(source.includes(value), message);
}

const inventory = read('docs/project-atlas/executive-library/REIE-DXT-CROSS-ROUTE-CTA-DESTINATION-INVENTORY.md');
const chatStart = read('docs/CHAT_START.md');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const phrase of [
  'DXT_CROSS_ROUTE_CTA_DESTINATION_INVENTORY_READY',
  'No runtime change',
  'CTA Inventory',
  'Language Normalization Review',
  'Destination Ownership Model',
  'Dead-End And Loop Review',
  'Disposition Summary',
  'SEARCH_PROPERTY_RETURN_CONTINUITY',
  'REPOINT_LATER',
  'ROUTE_SPECIFIC_EXCEPTION',
  'EXTERNAL_REVIEW_HOLD',
  '/properties/[id]',
  '/contact#advisory-readiness',
  'Property inquiry',
  'Back to Search',
  'Return to Search Results',
  'Advisory prepares the conversation; Contact begins it.',
]) {
  assertIncludes(inventory, phrase, `CTA inventory must include: ${phrase}`);
}

for (const route of ['`/`', '`/search`', '`/properties/[id]`', '`/buy`', '`/sell`', '`/market`', '`/market/[city]`', '`/market/[city]/[slug]`', '`/contact`', '`/grand-plan`', '`/home-worth`', '`/compare`']) {
  assertIncludes(inventory, route, `CTA inventory must cover route: ${route}`);
}

assertIncludes(
  chatStart,
  'DXT_CROSS_ROUTE_CTA_DESTINATION_INVENTORY_READY',
  'CHAT_START must record cross-route CTA inventory status.',
);
assert.equal(
  packageJson.scripts?.['check:dxt-cross-route-cta-destination-inventory'],
  'npm run worker:build && node dist/scripts/checkDxtCrossRouteCtaDestinationInventory.js',
  'package.json must register cross-route CTA inventory check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxtCrossRouteCtaDestinationInventory.ts',
  'tsconfig.worker.json must include cross-route CTA inventory check.',
);

console.log('[dxt-cross-route-cta-destination-inventory] ok: inventory, labels, destination ownership, dead-end review, boundaries, CHAT_START, and registry verified.');
