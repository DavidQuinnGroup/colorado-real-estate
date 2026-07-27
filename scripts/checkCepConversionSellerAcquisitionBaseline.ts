import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

function assertNoForbiddenRuntimeExpansion(source: string, label: string) {
  assert(
    !source.match(/OpenAI|chatbot|AI guidance|GIS Sprint 9|provider connection|automated valuation score|seller score|lead priority|mortgage calculator|favorite|saved property/i),
    `${label} must not introduce excluded Sprint 3 runtime capabilities.`,
  );
}

async function main() {
  const [
    inquiryForm,
    sellerForm,
    selectedPropertyDrawer,
    propertyInquiryRoute,
    valuationRoute,
    saveSearchRoute,
    packageJson,
  ] = await Promise.all([
    readFile('components/PropertyInquiryForm.tsx', 'utf8'),
    readFile('components/HomeValueEstimator.tsx', 'utf8'),
    readFile('components/maps/SelectedPropertyDrawer.tsx', 'utf8'),
    readFile('app/api/property-inquiry/route.ts', 'utf8'),
    readFile('app/api/valuation/route.ts', 'utf8'),
    readFile('app/api/save-search/route.ts', 'utf8'),
    readFile('package.json', 'utf8'),
  ]);

  assert(inquiryForm.includes('data-testid="cep-conversion-inquiry-guidance"'), 'Inquiry form must expose Sprint 3 pre-submit guidance.');
  assert(inquiryForm.includes('data-conversion-backend-route="/api/property-inquiry"'), 'Inquiry guidance must preserve the existing property inquiry endpoint.');
  assert(inquiryForm.includes('data-conversion-submission-required="true"'), 'Inquiry guidance must identify submission as required for conversion.');
  assert(inquiryForm.includes('data-testid="cep-conversion-inquiry-confirmation-recovery"'), 'Inquiry confirmation must expose recovery actions.');
  assert(inquiryForm.includes('Return to Property'), 'Inquiry confirmation must let customers return to the property.');
  assert(inquiryForm.includes('Continue Search'), 'Inquiry confirmation must let customers continue search.');
  assert(inquiryForm.includes("fetch('/api/property-inquiry'"), 'Inquiry form must preserve the existing property inquiry submission boundary.');

  assert(sellerForm.includes('data-testid="cep-conversion-seller-guidance"'), 'Seller intake must expose Sprint 3 pre-submit guidance.');
  assert(sellerForm.includes('data-conversion-backend-route="/api/valuation"'), 'Seller intake must preserve the existing valuation endpoint.');
  assert(sellerForm.includes('data-conversion-automated-valuation="false"'), 'Seller intake must explicitly avoid automated valuation positioning.');
  assert(sellerForm.includes('data-testid="cep-conversion-seller-confirmation-recovery"'), 'Seller confirmation must expose recovery actions.');
  assert(sellerForm.includes('Seller Page'), 'Seller confirmation must let customers return to the seller journey.');
  assert(sellerForm.includes('Continue Search'), 'Seller confirmation must let customers continue search.');
  assert(sellerForm.includes("fetch('/api/valuation'"), 'Seller intake must preserve the existing valuation submission boundary.');

  assert(
    selectedPropertyDrawer.includes('data-testid="cep-conversion-selected-property-guidance"'),
    'Selected property drawer must expose conversion guidance from search selection.',
  );
  assert(selectedPropertyDrawer.includes('data-conversion-detail-href={propertyHref}'), 'Selected property drawer must preserve detail navigation.');
  assert(selectedPropertyDrawer.includes('data-conversion-inquiry-href={inquiryHref}'), 'Selected property drawer must preserve inquiry navigation.');
  assert(selectedPropertyDrawer.includes('data-testid="reie-selected-property-detail-link"'), 'Selected property drawer must preserve the existing detail CTA.');
  assert(selectedPropertyDrawer.includes('data-testid="reie-selected-property-inquiry-link"'), 'Selected property drawer must preserve the existing inquiry CTA.');

  assert(propertyInquiryRoute.includes('export async function POST'), 'Property inquiry route must remain an existing POST handler.');
  assert(propertyInquiryRoute.includes('CRMTask'), 'Property inquiry route must preserve existing CRM task behavior without front-end expansion.');
  assert(valuationRoute.includes('export async function POST'), 'Valuation route must remain an existing POST handler.');
  assert(valuationRoute.includes('SellerLead'), 'Valuation route must preserve existing seller lead behavior without front-end expansion.');
  assert(saveSearchRoute.includes('VALID_INTAKE_SOURCES'), 'Saved-search route must preserve existing attribution architecture.');

  for (const [source, label] of [
    [inquiryForm, 'Inquiry form'],
    [sellerForm, 'Seller intake'],
    [selectedPropertyDrawer, 'Selected property drawer'],
  ] as const) {
    assertNoForbiddenRuntimeExpansion(source, label);
    assert(!source.match(/prisma\.|INSERT INTO|UPDATE "|DELETE FROM/), `${label} must not introduce direct database mutation.`);
  }

  const packageData = JSON.parse(packageJson) as { scripts?: Record<string, string> };
  assert.equal(
    packageData.scripts?.['check:cep-conversion-seller-acquisition-baseline'],
    'npm run worker:build && node dist/scripts/checkCepConversionSellerAcquisitionBaseline.js',
    'package.json must expose the CEP Sprint 3 conversion and seller acquisition baseline check.',
  );

  console.log('[cep-conversion-seller-acquisition-baseline] ok: conversion guidance, recovery states, existing endpoint boundaries, and protected exclusions verified.');
}

main().catch((error) => {
  console.error('[cep-conversion-seller-acquisition-baseline] failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
