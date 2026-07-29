import { assertDecisionGuidePlatformContract } from './decisionGuideValidation.js';

async function main() {
  await assertDecisionGuidePlatformContract({
    key: 'louisville',
    cityName: 'Louisville',
    expectedNeighborhoodEvidence: 'Old Town Louisville, Coal Creek Ranch, Centennial Valley, North End, and Steel Ranch',
    packageScriptName: 'check:louisville-decision-guide',
  });

  console.log('[louisville-decision-guide] ok: platform architecture, Louisville continuity, fair-housing boundaries, and prohibited activations verified.');
}

main().catch((error) => {
  console.error('[louisville-decision-guide] failed:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
