import { strict as assert } from 'node:assert';
import { readFile } from 'node:fs/promises';

import dotenv from 'dotenv';

import { prisma } from '../lib/prisma.js';

dotenv.config({ path: '.env.local', quiet: true });
dotenv.config({ quiet: true });

const BASE_URL = (process.env.PUBLIC_EXPERIENCE_SMOKE_BASE_URL || 'http://localhost:3000').replace(/\/+$/, '');

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function includesFoldedText(html: string, text: string) {
  return html.toLowerCase().includes(text.toLowerCase());
}

async function fetchHtml(path: string) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      accept: 'text/html',
    },
  });
  const html = await response.text();

  assert.equal(response.status, 200, `Expected HTTP 200 for ${path}, got ${response.status}.`);
  assert.ok(html.length > 1000, `Expected ${path} to return rendered HTML.`);

  return html;
}

async function getSmokeProperty() {
  const property = await prisma.property.findFirst({
    orderBy: {
      updatedAt: 'desc',
    },
    select: {
      id: true,
      slug: true,
      address: true,
    },
  });

  assert.ok(property, 'Expected at least one property for public experience smoke test.');
  return property;
}

async function assertPropertyPage(path: string) {
  const html = await fetchHtml(path);

  assert.ok(includesFoldedText(html, 'REIE Decision Snapshot'), 'Expected property page decision snapshot.');
  assert.ok(includesFoldedText(html, 'Property Inquiry'), 'Expected property inquiry form.');
  assert.ok(includesFoldedText(html, 'Routed To REIE CRM'), 'Expected inquiry CRM routing guidance.');
  assert.ok(includesFoldedText(html, 'Current Request'), 'Expected inquiry request guidance.');
  assert.ok(includesFoldedText(html, 'Timing / Intent'), 'Expected inquiry timing controls.');
  assert.ok(includesFoldedText(html, 'Notes optional but helpful'), 'Expected inquiry notes guidance.');
}

async function assertSearchPage() {
  const html = await fetchHtml('/search');

  assert.ok(includesFoldedText(html, 'Search Intelligence'), 'Expected search intelligence strip.');
  assert.ok(includesFoldedText(html, 'REIE Inventory'), 'Expected search sidebar inventory shell.');
  assert.ok(includesFoldedText(html, 'Filters'), 'Expected search filters shell.');
}

async function assertDrawerSource() {
  const source = await readFile('components/maps/SelectedPropertyDrawer.tsx', 'utf8');

  assert.ok(source.includes('const inquiryHref = `${propertyHref}#property-contact`;'), 'Expected selected drawer inquiry hash target.');
  assert.ok(source.includes('Inquire'), 'Expected selected drawer Inquire CTA label.');
}

async function main() {
  const property = await getSmokeProperty();
  const propertyPath = `/properties/${property.slug || property.id}`;

  await assertPropertyPage(propertyPath);
  await assertSearchPage();
  await assertDrawerSource();

  console.log(
    JSON.stringify(
      {
        success: true,
        check: 'public-experience-smoke',
        baseUrl: BASE_URL,
        property: {
          id: property.id,
          slug: property.slug,
          address: property.address,
          path: propertyPath,
        },
        assertions: {
          propertyDecisionSnapshot: true,
          propertyInquiryGuidance: true,
          searchIntelligence: true,
          selectedDrawerInquiryTarget: true,
        },
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error(`Public experience smoke failed: ${errorMessage(error)}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
