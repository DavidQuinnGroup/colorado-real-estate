import { existsSync, readFileSync } from 'node:fs';

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

function assertOrdered(source: string, markers: string[], message: string): void {
  let previousIndex = -1;

  for (const marker of markers) {
    const index = source.indexOf(marker);
    assert(index >= 0, `Missing ordered marker: ${marker}`);
    assert(index > previousIndex, message);
    previousIndex = index;
  }
}

const contractPath =
  'docs/project-atlas/executive-library/REIE-DXT-WAVE-1C-BUYER-SELLER-SHARED-HIERARCHY-FOUNDATION-CONTRACT.md';
const implementationPath =
  'docs/project-atlas/executive-library/REIE-DXT-WAVE-1C-BUYER-SELLER-SHARED-HIERARCHY-FOUNDATION-IMPLEMENTATION.md';
const chatStartPath = 'docs/CHAT_START.md';
const packageJsonPath = 'package.json';
const tsconfigWorkerPath = 'tsconfig.worker.json';

const contract = read(contractPath);
const implementation = read(implementationPath);
const chatStart = read(chatStartPath);
const packageJson = read(packageJsonPath);
const tsconfigWorker = read(tsconfigWorkerPath);

assertIncludes(
  contract,
  'Status: `BUYER_SELLER_SHARED_HIERARCHY_FOUNDATION_IMPLEMENTED`',
  'Shared hierarchy contract must record implemented status.',
);
assertIncludes(
  implementation,
  'Status: `BUYER_SELLER_SHARED_HIERARCHY_FOUNDATION_IMPLEMENTED`',
  'Shared hierarchy implementation record must record implemented status.',
);

assertOrdered(
  contract,
  [
    '1. page orientation;',
    '2. governing decision question;',
    '3. concise opening promise;',
    '4. preparation themes;',
    '5. tool or evidence continuation;',
    '6. questions to verify;',
    '7. professional and trust boundaries;',
    '8. advisory transition;',
    '9. compact next-decision continuations.',
  ],
  'Shared Buyer/Seller hierarchy must preserve the canonical sequence.',
);

for (const requiredBoundary of [
  'Buyer content must not imply:',
  'qualification;',
  'approval;',
  'affordability conclusion;',
  'buying-power conclusion;',
  'Seller content must not imply:',
  'valuation certainty;',
  'price recommendation;',
  'guaranteed buyer behavior;',
  'disclosure sufficiency;',
  'no equal-weight CTA clusters',
  'semantic heading order',
  'protected-class steering',
  'EXTERNAL_COMPASS_MARKETING_REVIEW_PENDING',
]) {
  assertIncludes(contract, requiredBoundary, `Contract must include boundary: ${requiredBoundary}`);
}

for (const protectedRuntimeBoundary of [
  'Buyer runtime changes;',
  'Seller runtime changes;',
  'shared React components;',
  'shared rendering abstractions;',
  'route changes;',
  'Search changes;',
  'map or GIS changes;',
  'property page changes;',
  'API changes;',
  'Prisma or migration changes;',
  'persistence;',
  'telemetry;',
  'CRM;',
  'providers;',
  'AI activation;',
  'brokerage disclosure changes.',
]) {
  assertIncludes(contract, protectedRuntimeBoundary, `Contract must preserve protected boundary: ${protectedRuntimeBoundary}`);
}

for (const implementationMarker of [
  'DOCUMENTATION_AND_DETERMINISTIC_CONTRACT_ONLY',
  '`app/buy/page.tsx`',
  '`app/sell/page.tsx`',
  '`npm run check:dxt-wave-1c-buyer-seller-shared-hierarchy-foundation`',
  'no premature design system or shared runtime component was introduced',
]) {
  assertIncludes(implementation, implementationMarker, `Implementation record must include: ${implementationMarker}`);
}

assertIncludes(
  chatStart,
  'BUYER_SELLER_SHARED_HIERARCHY_FOUNDATION_IMPLEMENTED',
  'CHAT_START must record Wave 1C foundation implementation status.',
);
assertIncludes(
  packageJson,
  '"check:dxt-wave-1c-buyer-seller-shared-hierarchy-foundation"',
  'package.json must register Wave 1C shared hierarchy foundation check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxtWave1cBuyerSellerSharedHierarchyFoundation.ts',
  'tsconfig.worker.json must include Wave 1C shared hierarchy foundation check.',
);

for (const unauthorizedFoundationFile of [
  'components/BuyerSellerSharedHierarchy',
  'components/SharedBuyerSeller',
  'lib/buyerSellerSharedHierarchy',
  'lib/sharedBuyerSellerJourney',
  'app/buyer-seller',
]) {
  assert(!existsSync(unauthorizedFoundationFile), `Wave 1C foundation must not introduce ${unauthorizedFoundationFile}.`);
}

for (const prohibitedContractPattern of [
  'localStorage',
  'sessionStorage',
  'document.cookie',
  'new PrismaClient',
  'createSellerLead',
  'trackEvent(',
  'Mapbox',
  'OpenAI',
]) {
  assertNotIncludes(contract, prohibitedContractPattern, `Contract must not introduce runtime pattern: ${prohibitedContractPattern}`);
}

console.log('DXT Wave 1C Buyer/Seller shared hierarchy foundation check passed.');
