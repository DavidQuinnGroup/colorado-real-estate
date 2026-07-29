import { assertDecisionGuidePlatformContract } from './decisionGuideValidation.js';

async function main() {
  await assertDecisionGuidePlatformContract({
    key: 'lafayette',
    cityName: 'Lafayette',
    expectedNeighborhoodEvidence: "Indian Peaks, Waneka Lake, Old Town Lafayette, and Anna's Farm",
    packageScriptName: 'check:lafayette-decision-guide',
  });

  console.log('[lafayette-decision-guide] ok: platform architecture, Lafayette continuity, fair-housing boundaries, and prohibited activations verified.');
}

main().catch((error) => {
  console.error('[lafayette-decision-guide] failed:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
