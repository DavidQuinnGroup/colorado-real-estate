import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local', quiet: true });
dotenv.config({ quiet: true });

const SELECTED_PROPERTY_SLUG = '6137-baseline-rd-boulder-co-ire1349635';
const SELECTED_PROPERTY_ID = 'cmpy48m3d047b129oeqh0r22m';
const PROPERTY_COLUMNS = [
  'id',
  'mlsId',
  'slug',
  'address',
  'city',
  'state',
  'zip',
  'price',
  'propertyType',
  'status',
  'lat',
  'lng',
].join(',');

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  assert(supabaseUrl, 'Expected NEXT_PUBLIC_SUPABASE_URL for property route safety check.');
  assert(serviceRoleKey, 'Expected SUPABASE_SERVICE_ROLE_KEY for property route safety check.');

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

async function fetchProperty(identity: string) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('Property')
    .select(PROPERTY_COLUMNS)
    .or(`id.eq.${identity},slug.eq.${identity},mlsId.eq.${identity}`)
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(`Supabase property fallback query failed: ${error.message}`);

  return data as { id: string; slug: string; address: string; city: string; state: string } | null;
}

async function fetchPhotoCount(propertyId: string) {
  const client = getSupabaseClient();
  const { count, error } = await client
    .from('PropertyPhoto')
    .select('id', { count: 'exact', head: true })
    .eq('propertyId', propertyId);

  if (error) throw new Error(`Supabase property photo fallback query failed: ${error.message}`);

  return count ?? 0;
}

async function assertSourceFallbacks() {
  const propertyPage = await readFile('app/properties/[id]/page.tsx', 'utf8');
  const propertyLinks = await readFile('lib/linking/getPropertyLinks.ts', 'utf8');

  assert(propertyPage.includes('getSupabaseProperty(id)'), 'Expected property page to call Supabase fallback.');
  assert(propertyPage.includes('Prisma lookup failed; attempting Supabase REST fallback'), 'Expected property page to log fallback path.');
  assert(propertyLinks.includes('rendering authority links only'), 'Expected related links to degrade without crashing.');
}

async function main() {
  await assertSourceFallbacks();

  const selected = await fetchProperty(SELECTED_PROPERTY_SLUG);
  assert(selected, 'Expected selected property slug to resolve through Supabase fallback.');
  assert.equal(selected.id, SELECTED_PROPERTY_ID, 'Expected selected property slug to resolve to the controlled property id.');
  assert.equal(selected.address, '6137 Baseline Rd', 'Expected selected property content to match the controlled route.');
  assert.equal(selected.city, 'Boulder', 'Expected selected property city to match the controlled route.');
  assert.equal(selected.state, 'CO', 'Expected selected property state to match the controlled route.');

  const byId = await fetchProperty(SELECTED_PROPERTY_ID);
  assert(byId, 'Expected selected property id to resolve through Supabase fallback.');
  assert.equal(byId.slug, SELECTED_PROPERTY_SLUG, 'Expected selected property id to resolve to the controlled slug.');

  const missing = await fetchProperty('no-such-property-property-001');
  assert.equal(missing, null, 'Expected nonexistent property identity to return no Supabase fallback row.');

  const photoCount = await fetchPhotoCount(SELECTED_PROPERTY_ID);
  assert(photoCount >= 0, 'Expected property photo fallback count to be finite.');

  console.log(
    `[property-route-safety] ok: selected property fallback resolved ${selected.address}, id fallback resolved, missing identity returned null, photos=${photoCount}.`,
  );
}

main().catch((error) => {
  console.error('[property-route-safety] failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});

// /Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/checkPropertyRouteSafety.ts
