import dotenv from 'dotenv';

import { searchSupabasePropertiesWithMeta } from '../lib/search/supabaseSearch.js';

dotenv.config({ path: '.env.local', quiet: true });
dotenv.config({ quiet: true });

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

async function main() {
  const basic = await searchSupabasePropertiesWithMeta({ limit: 1 }, 'public');

  assert(Array.isArray(basic.results), 'Expected search fallback results to be an array.');
  assert(basic.results.length <= 1, 'Expected search fallback to honor a bounded limit.');
  assert(Number.isFinite(basic.found), 'Expected search fallback to expose a finite found count.');
  assert(basic.rawReturned <= 1, 'Expected raw returned count to honor the requested limit.');

  for (const result of basic.results) {
    assert(result.id, 'Expected fallback result to include an id.');
    assert(result.address, 'Expected fallback result to include an address.');
    assert(result.city, 'Expected fallback result to include a city.');
    assert(result.isPrivateExclusive === false, 'Expected public fallback result to exclude private inventory.');
  }

  const empty = await searchSupabasePropertiesWithMeta(
    {
      city: 'NoSuchCitySearchRuntimeSafety',
      limit: 1,
    },
    'public',
  );

  assert(Array.isArray(empty.results), 'Expected empty-result search fallback results to be an array.');
  assert(empty.results.length === 0, 'Expected impossible city filter to return an empty result set.');
  assert(empty.found === 0, 'Expected impossible city filter to report zero found results.');

  console.log(
    `[search-runtime-safety] ok: fallback returned ${basic.results.length} bounded result(s), empty-result behavior verified.`
  );
}

main().catch((error) => {
  console.error('[search-runtime-safety] failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});

// /Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/checkSearchRuntimeSafety.ts
