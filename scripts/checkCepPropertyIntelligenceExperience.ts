import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function main() {
  const [propertyPage, relatedLinks, inquiryForm, packageJson] = await Promise.all([
    readFile('app/properties/[id]/page.tsx', 'utf8'),
    readFile('lib/linking/getPropertyLinks.ts', 'utf8'),
    readFile('components/PropertyInquiryForm.tsx', 'utf8'),
    readFile('package.json', 'utf8'),
  ]);

  assert(propertyPage.includes('data-testid="cep-property-decision-brief"'), 'Property page must expose the CEP Sprint 2 decision brief.');
  assert(propertyPage.includes('data-property-decision-brief-status="public-fact-context"'), 'Decision brief must preserve public-fact context status.');
  assert(propertyPage.includes('data-property-decision-brief-provider="none"'), 'Decision brief must not introduce a provider connection.');
  assert(propertyPage.includes('data-property-decision-brief-generated-guidance="false"'), 'Decision brief must not introduce generated guidance.');
  assert(propertyPage.includes('data-testid="cep-property-decision-brief-item"'), 'Decision brief must expose deterministic brief items.');
  assert(propertyPage.includes('data-property-decision-brief-related-count={relatedListings.length}'), 'Decision brief must reuse existing related-listing context.');
  assert(propertyPage.includes('data-testid="cep-property-intelligence-source-status"'), 'Property page must expose source and freshness status.');
  assert(propertyPage.includes('data-property-intelligence-source="public-listing-facts"'), 'Source status must remain public-listing-fact based.');
  assert(
    propertyPage.includes('data-property-intelligence-confidence-boundary="public-fact-confidence"'),
    'Source status must expose a customer-safe confidence boundary.',
  );

  const briefStart = propertyPage.indexOf('data-testid="cep-property-decision-brief"');
  const briefEnd = propertyPage.indexOf('data-testid="reie-property-decision-summary"');
  assert(briefStart > -1 && briefEnd > briefStart, 'Decision brief source block must be locatable before the existing decision summary.');
  const decisionBriefSource = propertyPage.slice(briefStart, briefEnd);

  for (const question of [
    'Is this property right for me?',
    'What should I know before touring?',
    'What is unique about this property?',
    'How does it compare with the market?',
    'What should I investigate further?',
  ]) {
    assert(propertyPage.includes(question), `Decision brief must include buyer question: ${question}`);
  }

  assert(propertyPage.includes('getPropertyDecisionBriefItems'), 'Property page must derive the Sprint 2 decision brief from local helper logic.');
  assert(propertyPage.includes('getPropertyIntelligenceSourceItems'), 'Property page must derive source and freshness status from existing property data.');
  assert(propertyPage.includes('formatDateTime(property.lastIntelligenceSync || property.updatedAt)'), 'Freshness must use existing sync/update timestamps.');
  assert(propertyPage.includes('getPropertyLinks({'), 'Property page must preserve existing property-link retrieval.');
  assert(propertyPage.includes('relatedListings = [...propertyLinks.neighborhoodHomes, ...propertyLinks.cityHomes]'), 'Property page must preserve related-listing reuse.');
  assert(relatedLinks.includes('neighborhoodHomes'), 'Related property links must continue to support neighborhood comparison context.');
  assert(relatedLinks.includes('cityHomes'), 'Related property links must continue to support city comparison context.');

  assert(!propertyPage.includes("fetch('/api/property-inquiry'"), 'Property page must not submit inquiries directly.');
  assert(inquiryForm.includes("fetch('/api/property-inquiry'"), 'Existing inquiry submission boundary must remain in the inquiry form.');
  assert(!propertyPage.match(/INSERT INTO|UPDATE "|DELETE FROM|prisma\.[a-zA-Z]+\.create|prisma\.[a-zA-Z]+\.update|prisma\.[a-zA-Z]+\.delete/), 'Property page must remain read-only.');
  assert(!propertyPage.match(/OpenAI|chatbot|AI guidance|GIS Sprint 9|provider connection|mortgage calculator|favorite|saved property/i), 'Property page must not introduce excluded Sprint 2 capabilities.');
  assert(
    !decisionBriefSource.match(/guaranteed|perfect home|recommended offer|automated valuation score|investment advice/i),
    'Sprint 2 decision brief must avoid unsupported certainty or advice claims.',
  );

  const packageData = JSON.parse(packageJson) as { scripts?: Record<string, string> };
  assert.equal(
    packageData.scripts?.['check:cep-property-intelligence-experience'],
    'npm run worker:build && node dist/scripts/checkCepPropertyIntelligenceExperience.js',
    'package.json must expose the CEP Sprint 2 property intelligence experience check.',
  );

  console.log('[cep-property-intelligence-experience] ok: property decision brief, source/freshness boundary, related-listing reuse, and protected mutation/provider boundaries verified.');
}

main().catch((error) => {
  console.error('[cep-property-intelligence-experience] failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
