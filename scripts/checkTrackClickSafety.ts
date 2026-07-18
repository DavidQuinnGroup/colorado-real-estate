import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local', quiet: true });
dotenv.config({ quiet: true });

const ALERT_ID = 'cmq0zp6up010gpd4uh5anfex5';
const USER_ID = 'cmmuzx3kt00004hk64jytoihs';
const PROPERTY_ID = 'cmpy48m3d047b129oeqh0r22m';
const PROPERTY_URL = 'https://davidquinngroup.com/properties/6137-baseline-rd-boulder-co-ire1349635';

type AlertRow = {
  id: string;
  userId: string;
  status: string;
  clickedAt: string | null;
  payload: {
    propertyId?: string;
    id?: string;
    mlsId?: string;
    slug?: string;
    url?: string;
  } | null;
};

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  assert(supabaseUrl, 'Expected NEXT_PUBLIC_SUPABASE_URL for track-click safety check.');
  assert(serviceRoleKey, 'Expected SUPABASE_SERVICE_ROLE_KEY for track-click safety check.');

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function getTrackingUrl() {
  const trackingUrl = new URL('/api/track-click', 'https://davidquinngroup.com');
  trackingUrl.searchParams.set('u', USER_ID);
  trackingUrl.searchParams.set('l', PROPERTY_ID);
  trackingUrl.searchParams.set('src', 'email_alert');
  trackingUrl.searchParams.set('to', PROPERTY_URL);
  return trackingUrl;
}

async function assertSourceFallbacks() {
  const route = await readFile('app/api/track-click/route.ts', 'utf8');
  const store = await readFile('lib/tracking/store.ts', 'utf8');
  const preferences = await readFile('lib/preferences/updateUserPreferences.ts', 'utf8');

  assert(route.includes("import { trackClick } from '@/lib/tracking/store'"), 'Expected route to use tracking store.');
  assert(store.includes('Prisma click tracking failed; attempting Supabase REST fallback'), 'Expected click fallback log.');
  assert(store.includes(".from('UserInteraction').insert"), 'Expected Supabase interaction insert fallback.');
  assert(store.includes(".from('AlertQueue').update"), 'Expected Supabase AlertQueue clickedAt update fallback.');
  assert(store.includes(".from('User')"), 'Expected Supabase user heat-score fallback.');
  assert(store.includes('markedAlertCount < 1'), 'Expected primary tracking to backfill clickedAt when Prisma marks no rows.');
  assert(store.includes('.range(from, to)'), 'Expected tracking fallback to page through bounded alert candidates.');
  assert(
    preferences.includes('Prisma preference update failed; attempting Supabase REST fallback'),
    'Expected preference fallback log.',
  );
  assert(preferences.includes(".from('UserPreference').upsert"), 'Expected Supabase UserPreference upsert fallback.');
}

async function assertSelectedAlert() {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('AlertQueue')
    .select('id,userId,status,clickedAt,payload')
    .eq('id', ALERT_ID)
    .maybeSingle();

  if (error) throw new Error(`Supabase selected alert lookup failed: ${error.message}`);

  const row = data as AlertRow | null;

  assert(row, 'Expected selected CLICK-001 AlertQueue row to exist.');
  assert.equal(row.userId, USER_ID, 'Expected selected row to belong to approved internal user.');
  assert.equal(row.status, 'sent', 'Expected selected row to be sent before CLICK-001.');
  assert.equal(row.clickedAt, null, 'Expected selected row clickedAt to remain null before CLICK-001.');
  assert.equal(row.payload?.propertyId || row.payload?.id, PROPERTY_ID, 'Expected selected row to identify controlled property.');
  assert.equal(row.payload?.url, PROPERTY_URL, 'Expected selected row URL to match controlled property URL.');
}

async function assertTrackingUrl() {
  const trackingUrl = getTrackingUrl();
  const destination = trackingUrl.searchParams.get('to');

  assert.equal(trackingUrl.hostname, 'davidquinngroup.com', 'Expected tracking URL host to be production host.');
  assert.equal(trackingUrl.searchParams.get('u'), USER_ID, 'Expected tracking URL user to match controlled user.');
  assert.equal(trackingUrl.searchParams.get('l'), PROPERTY_ID, 'Expected tracking URL listing to match controlled property.');
  assert.equal(trackingUrl.searchParams.get('src'), 'email_alert', 'Expected tracking URL source to match email alert source.');
  assert.equal(destination, PROPERTY_URL, 'Expected tracking destination to match controlled property URL.');

  const response = await fetch(PROPERTY_URL, { method: 'HEAD', redirect: 'manual' });
  assert.equal(response.status, 200, 'Expected controlled property destination to return HTTP 200.');
}

async function main() {
  await assertSourceFallbacks();
  await assertSelectedAlert();
  await assertTrackingUrl();

  console.log('[track-click-safety] ok: fallback source guards, selected alert preflight, and tracking URL destination passed.');
}

main().catch((error) => {
  console.error('[track-click-safety] failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});

// /Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/checkTrackClickSafety.ts
