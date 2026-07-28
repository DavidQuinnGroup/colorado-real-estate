import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  BLOCKED_EXTERNAL_LISTING_MEDIA_HOSTS,
  getDisplaySafeListingPhotoUrl,
  getListingFallbackPhotoUrl,
  getListingPhotoUrl,
  isBlockedExternalListingMediaUrl,
} from '../lib/listingVisuals.js';

const governedStatus = 'PRODUCTION_MEDIA_RESILIENCE_CORRECTIVE_SPRINT_1';

function read(filePath: string) {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string) {
  assert(source.includes(value), message);
}

function assertNotIncludes(source: string, value: string, message: string) {
  assert(!source.includes(value), message);
}

function assertFileExists(filePath: string) {
  assert(fs.existsSync(filePath), `${filePath} must exist.`);
}

const mlsGridPhoto = 'https://media.mlsgrid.com/mls/photo/listing.jpg';
const safeExternalPhoto = 'https://images.example.com/listing.jpg';
const localFallbackPhoto = '/reie-listing-modern.svg';
const listingFixture = {
  id: 'media-resilience-fixture',
  address: '27383 Mildred Ln',
  city: 'Evergreen',
  propertyType: 'Residential',
  price: 975000,
  photos: [
    { url: mlsGridPhoto },
    { url: 'javascript:alert(1)' },
    { url: '' },
  ],
  mainPhoto: mlsGridPhoto,
  image: mlsGridPhoto,
};

function assertMediaContracts() {
  assert.deepEqual(
    BLOCKED_EXTERNAL_LISTING_MEDIA_HOSTS,
    ['media.mlsgrid.com'],
    'Expected the corrective sprint to govern the known production-failing MLSGrid media host.',
  );
  assert.equal(isBlockedExternalListingMediaUrl(mlsGridPhoto), true, 'Expected MLSGrid media URL to be classified as display-unsafe.');
  assert.equal(isBlockedExternalListingMediaUrl(safeExternalPhoto), false, 'Expected non-blocked HTTPS media URL to remain eligible.');
  assert.equal(getDisplaySafeListingPhotoUrl(mlsGridPhoto), null, 'Expected MLSGrid media URL to be removed from display paths.');
  assert.equal(getDisplaySafeListingPhotoUrl(safeExternalPhoto), safeExternalPhoto, 'Expected safe external photo to remain unchanged.');
  assert.equal(getDisplaySafeListingPhotoUrl(localFallbackPhoto), localFallbackPhoto, 'Expected local fallback photo to remain eligible.');

  const fallbackPhoto = getListingFallbackPhotoUrl(listingFixture);
  const resolvedPhoto = getListingPhotoUrl(listingFixture);
  assert(resolvedPhoto.startsWith('/reie-listing-'), 'Expected MLSGrid-only listing media to resolve to a local REIE fallback.');
  assert.equal(resolvedPhoto, fallbackPhoto, 'Expected MLSGrid-only listing media to use the governed local fallback pool.');
  assertNotIncludes(resolvedPhoto, 'media.mlsgrid.com', 'Expected resolved listing photo to avoid known-failing MLSGrid media host.');
}

function assertSourceContracts() {
  for (const filePath of [
    'lib/listingVisuals.ts',
    'components/ResilientListingImage.tsx',
    'components/PropertyCard.tsx',
    'components/search/PropertyDetail.tsx',
    'app/properties/[id]/page.tsx',
    'package.json',
    'docs/project-atlas/executive-library/PRODUCTION-MEDIA-RESILIENCE-CORRECTIVE-SPRINT-1.md',
  ]) {
    assertFileExists(filePath);
  }

  const listingVisuals = read('lib/listingVisuals.ts');
  const resilientImage = read('components/ResilientListingImage.tsx');
  const propertyCard = read('components/PropertyCard.tsx');
  const searchPropertyDetail = read('components/search/PropertyDetail.tsx');
  const propertyPage = read('app/properties/[id]/page.tsx');
  const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
  const sprintDoc = read('docs/project-atlas/executive-library/PRODUCTION-MEDIA-RESILIENCE-CORRECTIVE-SPRINT-1.md');
  const chatStart = read('docs/CHAT_START.md');

  assertIncludes(listingVisuals, "new Set(['media.mlsgrid.com'])", 'Listing visuals must govern the known production-failing external media host.');
  assertIncludes(listingVisuals, 'getDisplaySafeListingPhotoUrl', 'Listing visuals must expose a display-safe photo helper.');
  assertIncludes(listingVisuals, 'isBlockedExternalListingMediaUrl', 'Listing visuals must expose blocked-host classification.');
  assertIncludes(listingVisuals, 'getDisplaySafeListingPhotoUrl(property.mainPhoto)', 'Listing mainPhoto must be display-safe.');
  assertIncludes(listingVisuals, 'getDisplaySafeListingPhotoUrl(property.image)', 'Listing image fallback must be display-safe.');

  assertIncludes(resilientImage, 'data-testid="reie-resilient-listing-image"', 'Resilient image component must remain test-addressable.');
  assertIncludes(resilientImage, 'data-image-is-fallback', 'Resilient image component must expose fallback state.');
  assertIncludes(resilientImage, 'data-image-fallback-label', 'Resilient image component must expose fallback label.');

  assertIncludes(propertyCard, 'ResilientListingImage', 'Property cards must use the shared resilient listing image component.');
  assertIncludes(propertyCard, 'fallbackLabel="Photo Pending"', 'Property cards must present customer-safe pending-photo language.');
  assertIncludes(propertyCard, 'getListingFallbackPhotoUrl(property)', 'Property cards must use governed local fallback visuals.');
  assertNotIncludes(propertyCard, 'onError={handleImageError}', 'Property cards must not rely on one-off image error state.');

  assertIncludes(searchPropertyDetail, 'getListingPhotoUrl', 'In-search property detail must use display-safe listing media.');
  assertNotIncludes(searchPropertyDetail, 'const imageSrc = property.mainPhoto || property.image || null', 'In-search property detail must not render raw provider media.');

  assertIncludes(propertyPage, 'getDisplaySafeListingPhotoUrl(photo.url) || fallbackPhoto', 'Property page secondary media must be display-safe.');
  assertIncludes(propertyPage, 'getListingPhotoUrl({', 'Property page primary media must use governed listing visuals.');

  for (const forbidden of [
    'document.cookie =',
    'localStorage.setItem',
    'sessionStorage.setItem',
    'createMany',
    'upsert',
    'sendEmail',
    'OpenAI',
    'GIS Sprint 9',
    'provider activation',
  ]) {
    assertNotIncludes(propertyCard + searchPropertyDetail + propertyPage, forbidden, `Media resilience runtime must not introduce unauthorized behavior: ${forbidden}`);
  }

  assert(packageJson.scripts?.['check:production-media-resilience'], 'package.json must expose the Production Media Resilience safety check.');
  assertIncludes(sprintDoc, governedStatus, 'Corrective sprint documentation must record the governed identifier.');
  assertIncludes(sprintDoc, 'Deployment remains prohibited', 'Corrective sprint documentation must preserve deployment prohibition.');
  assertIncludes(sprintDoc, 'No MLS data was modified', 'Corrective sprint documentation must preserve MLS data boundary.');
  assertIncludes(chatStart, governedStatus, 'CHAT_START must record the governed corrective sprint identifier.');
  assertIncludes(chatStart, 'Deployment remains prohibited', 'CHAT_START must preserve deployment prohibition.');
}

function main() {
  assertMediaContracts();
  assertSourceContracts();

  console.log(
    '[production-media-resilience] ok: known failing MLSGrid media host is blocked from display paths, local fallback visuals are selected, resilient image surfaces are governed, and no auth, database, provider, GIS, AI, telemetry, or workflow behavior was introduced.',
  );
}

main();
