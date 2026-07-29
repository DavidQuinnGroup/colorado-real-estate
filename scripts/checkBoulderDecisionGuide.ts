import { assertDecisionGuidePlatformContract } from './decisionGuideValidation.js';

async function main() {
  await assertDecisionGuidePlatformContract({
    key: 'boulder',
    cityName: 'Boulder',
    expectedNeighborhoodEvidence:
      'Downtown, North Boulder, South Boulder, Gunbarrel, Table Mesa, Mapleton Hill, Chautauqua, and Wonderland Hills',
    packageScriptName: 'check:boulder-decision-guide',
  });

  console.log('[boulder-decision-guide] ok: platform architecture, Boulder continuity, fair-housing boundaries, and prohibited activations verified.');
}

main().catch((error) => {
  console.error('[boulder-decision-guide] failed:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
