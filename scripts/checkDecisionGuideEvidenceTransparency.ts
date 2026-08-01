import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { cities } from '../lib/cities.js';
import { getDecisionGuideRegistryEntry } from '../lib/coloradoDecisionGuideRegistry.js';
import {
  buildDecisionGuide,
  buildDecisionGuideContinuityLinks,
  DECISION_GUIDE_CITY_CONFIGS,
  DECISION_GUIDE_EVIDENCE_TRANSPARENCY,
  DECISION_GUIDE_TRUST_BOUNDARIES,
  type DecisionGuideEvidenceTransparency,
} from '../lib/decisionGuidePlatform.js';
import { neighborhoods } from '../lib/neighborhoods.js';

const authorizedKeys = ['boulder', 'louisville', 'lafayette'] as const;
const expectedDimensions = [
  'geographic-scope',
  'evidence-scope',
  'recency',
  'source-use-boundary',
  'conflict-uncertainty',
  'property-professional-boundary',
] as const;

function assertIncludes(source: string, expected: string, message: string) {
  assert(source.includes(expected), message);
}

function assertNotIncludes(source: string, forbidden: string, message: string) {
  assert(!source.includes(forbidden), message);
}

function normalizeRouteSegment(value: string) {
  return value.trim().toLowerCase();
}

function buildAuthorizedGuide(key: (typeof authorizedKeys)[number]) {
  const config = DECISION_GUIDE_CITY_CONFIGS[key];
  const city = cities.find((item) => item.name === config.cityName);
  assert(city, `${config.cityName} city data must exist.`);

  const guide = buildDecisionGuide({
    city,
    cityNeighborhoods: neighborhoods.filter(
      (neighborhood) => normalizeRouteSegment(neighborhood.city) === normalizeRouteSegment(city.name),
    ),
    marketSignal: 'Balanced conditions',
    eligibility: getDecisionGuideRegistryEntry(city),
  });

  assert(guide, `${config.cityName} guide must build deterministically.`);
  return guide;
}

function assertNoInternalEvidenceMetadata(source: string, context: string) {
  const forbidden = [
    /evidence[-_ ]?id/i,
    /source[-_ ]?id/i,
    /provider[-_ ]?id/i,
    /version[-_ ]?id/i,
    /source[-_ ]?rights[-_ ]?enum/i,
    /support[-_ ]?level/i,
    /freshness[-_ ]?(enum|code)/i,
    /conflict[-_ ]?(enum|code)/i,
    /lineage[-_ ]?record/i,
    /eligibility[-_ ]?outcome/i,
    /fixture[-_ ]?(data|output|name)/i,
    /evaluator[-_ ]?result/i,
    /confidence[-_ ]?(score|percentage|bar)/i,
    /evidence[-_ ]?(score|ranking|grade)/i,
  ];

  for (const pattern of forbidden) {
    assert.doesNotMatch(source, pattern, `${context} must not expose internal Evidence Depth metadata: ${pattern}`);
  }
}

function assertNoProhibitedPublicClaims(source: string, context: string) {
  const prohibited = [
    /best match(?:es)?/i,
    /best neighborhood/i,
    /ideal for/i,
    /right for you/i,
    /perfect for/i,
    /safest/i,
    /best schools/i,
    /superiority claim/i,
    /desirability claim/i,
    /demographic targeting/i,
    /protected-class proxy/i,
    /suitability conclusion/i,
    /urgent/i,
    /investment recommendation/i,
    /appreciation forecast/i,
    /valuation conclusion/i,
    /definitive condition/i,
    /hazard conclusion/i,
    /school rating/i,
    /safety rating/i,
    /ranked evidence/i,
  ];

  for (const pattern of prohibited) {
    assert.doesNotMatch(source, pattern, `${context} must remain fair-housing safe and non-conclusive: ${pattern}`);
  }
}

function assertTransparencyContract(transparency: DecisionGuideEvidenceTransparency, cityName: string) {
  assert.equal(
    transparency.contract,
    DECISION_GUIDE_EVIDENCE_TRANSPARENCY,
    `${cityName} transparency must use the shared governed contract.`,
  );
  assert.equal(transparency.maturityLabel, 'Editorially Certified', `${cityName} must use a customer-facing maturity label.`);
  assertIncludes(
    transparency.maturityExplanation,
    'governed editorial and product review',
    `${cityName} maturity explanation must describe editorial certification as governance.`,
  );
  assertIncludes(
    transparency.maturityExplanation,
    'not a guarantee, ranking, recommendation',
    `${cityName} maturity explanation must not imply superiority or certainty.`,
  );

  const dimensions = transparency.items.map((item) => item.dimension);
  assert.deepEqual(dimensions, [...expectedDimensions], `${cityName} transparency dimensions must stay deterministic.`);

  const publicCopy = [
    transparency.maturityLabel,
    transparency.maturityExplanation,
    transparency.heading,
    transparency.introduction,
    transparency.decisionBoundary,
    transparency.nextStepGuidance,
    ...transparency.items.flatMap((item) => [item.label, item.explanation]),
  ].join('\n');

  for (const expected of [
    'citywide',
    'Neighborhoods',
    'properties',
    'effective dates',
    'verified',
    'permitted to show publicly',
    'conflicts',
    'uncertainty',
    'condition',
    'title',
    'insurance',
    'structural',
    'environmental',
    'HOA',
    'municipal',
    'permit',
    'value',
    'financing',
    'legal',
    'tax',
    'inspection',
    'engineering',
    'appraisal',
    'questions',
  ]) {
    assertIncludes(publicCopy, expected, `${cityName} transparency must include ${expected} limitation language.`);
  }

  assertNoInternalEvidenceMetadata(publicCopy, `${cityName} public transparency copy`);
  assertNoProhibitedPublicClaims(publicCopy, `${cityName} public transparency copy`);
}

async function main() {
  const [marketPage, platformSource, crossCityCheck, packageJsonSource, workerConfig] = await Promise.all([
    readFile('app/market/[city]/page.tsx', 'utf8'),
    readFile('lib/decisionGuidePlatform.ts', 'utf8'),
    readFile('scripts/checkCrossCityDecisionComparison.ts', 'utf8'),
    readFile('package.json', 'utf8'),
    readFile('tsconfig.worker.json', 'utf8'),
  ]);
  const packageJson = JSON.parse(packageJsonSource) as { scripts?: Record<string, string> };

  assertIncludes(
    platformSource,
    "export const DECISION_GUIDE_EVIDENCE_TRANSPARENCY = 'decision-guide-evidence-transparency'",
    'One shared Decision Guide Evidence Transparency contract must exist.',
  );
  assertIncludes(
    platformSource,
    'export function buildDecisionGuideEvidenceTransparency',
    'The transparency layer must use a shared deterministic builder.',
  );
  assertIncludes(
    marketPage,
    'data-testid={`${cityDecisionGuide.key}-decision-guide-evidence-transparency`}',
    'The market guide route must render a deterministic transparency section.',
  );
  assertIncludes(
    marketPage,
    'data-decision-guide-evidence-transparency-internal-metadata="false"',
    'The public section must explicitly avoid internal metadata exposure.',
  );
  assertIncludes(
    marketPage,
    'data-decision-guide-evidence-transparency-score="false"',
    'The public section must explicitly avoid score output.',
  );
  assertIncludes(
    marketPage,
    'data-decision-guide-evidence-transparency-ranking="false"',
    'The public section must explicitly avoid ranking output.',
  );
  assertIncludes(
    marketPage,
    'data-decision-guide-evidence-transparency-provider="false"',
    'The public section must explicitly avoid provider activation.',
  );
  assertIncludes(
    marketPage,
    'data-decision-guide-evidence-transparency-api="false"',
    'The public section must explicitly avoid API activation.',
  );

  assert.equal(Object.keys(DECISION_GUIDE_CITY_CONFIGS).sort().join(','), 'boulder,lafayette,louisville', 'Only the three editorial guides may use this phase.');

  for (const key of authorizedKeys) {
    const guide = buildAuthorizedGuide(key);
    assert.equal(guide.maturity, 'EDITORIALLY_CERTIFIED', `${guide.cityName} maturity must remain editorially certified.`);
    assert(guide.evidenceTransparency, `${guide.cityName} must include the evidence transparency layer.`);
    assertTransparencyContract(guide.evidenceTransparency, guide.cityName);

    assert(guide.summaryIntro.length > 80, `${guide.cityName} substantive summary must remain present.`);
    assert(guide.tradeoffs.length >= 3, `${guide.cityName} trade-offs must remain present.`);
    assert(guide.verificationQuestions.length >= 3, `${guide.cityName} verification questions must remain present.`);

    const links = buildDecisionGuideContinuityLinks({
      guide,
      marketHref: `/market/${guide.cityName.toLowerCase()}-co-housing-market`,
      searchHref: `/search?city=${encodeURIComponent(guide.cityName)}`,
    });
    for (const expected of [
      { label: 'Market Context', href: `/market/${guide.cityName.toLowerCase()}-co-housing-market` },
      { label: `Search ${guide.cityName} Homes`, href: `/search?city=${encodeURIComponent(guide.cityName)}` },
      { label: 'Buyer Guidance', href: '/buy' },
      { label: 'Seller Guidance', href: '/sell' },
      { label: 'Financing Guidance', href: '/buy#financing-confidence' },
      { label: 'Grand Plan', href: '/grand-plan' },
      { label: 'Advisory Guidance', href: '/contact' },
    ]) {
      assert(
        links.some((link) => link.label === expected.label && link.href === expected.href),
        `${guide.cityName} must preserve ${expected.label} journey continuity.`,
      );
    }
  }

  for (const cityName of ['Broomfield', 'Superior', 'Longmont', 'Denver', 'Erie', 'Westminster']) {
    const city = cities.find((item) => item.name === cityName);
    assert(city, `${cityName} city data must exist.`);
    const guide = buildDecisionGuide({
      city,
      cityNeighborhoods: neighborhoods.filter(
        (neighborhood) => normalizeRouteSegment(neighborhood.city) === normalizeRouteSegment(city.name),
      ),
      marketSignal: 'Balanced conditions',
      eligibility: getDecisionGuideRegistryEntry(city),
    });
    assert(guide, `${cityName} enhanced guide must still build.`);
    assert.equal(guide.maturity, 'ENHANCED_FOUNDATION', `${cityName} must remain Enhanced Foundation.`);
    assert.equal(guide.evidenceTransparency, undefined, `${cityName} must not be activated for Decision Guide Evidence Transparency.`);
  }

  assert.equal(DECISION_GUIDE_TRUST_BOUNDARIES.ai, false, 'Decision Guides must not activate AI.');
  assert.equal(DECISION_GUIDE_TRUST_BOUNDARIES.gis, false, 'Decision Guides must not activate public GIS.');
  assert.equal(DECISION_GUIDE_TRUST_BOUNDARIES.telemetry, false, 'Decision Guides must not activate telemetry.');
  assert.equal(DECISION_GUIDE_TRUST_BOUNDARIES.ranking, false, 'Decision Guides must not rank places.');
  assert.equal(DECISION_GUIDE_TRUST_BOUNDARIES.schoolRanking, false, 'Decision Guides must not provide school rankings.');
  assert.equal(DECISION_GUIDE_TRUST_BOUNDARIES.safetyRanking, false, 'Decision Guides must not provide safety rankings.');
  assert.equal(
    DECISION_GUIDE_TRUST_BOUNDARIES.investmentRecommendation,
    false,
    'Decision Guides must not provide investment recommendations.',
  );

  assertIncludes(
    crossCityCheck,
    'Which Boulder neighborhood pattern should I compare against the way I would use the city day to day?',
    'Cross-City Comparison check must preserve the updated prohibited-copy-safe Boulder guide source.',
  );
  assertNotIncludes(
    platformSource,
    'Which Boulder neighborhood pattern best matches the way I would use the city day to day?',
    'The public guide source must remove the prohibited best-match wording.',
  );
  assertNotIncludes(
    platformSource,
    'Which Louisville neighborhood pattern best matches the way I would use the city day to day?',
    'The public guide source must remove the prohibited best-match wording.',
  );
  assertNotIncludes(
    platformSource,
    'Which Lafayette neighborhood pattern best matches the way I would use the city day to day?',
    'The public guide source must remove the prohibited best-match wording.',
  );

  assert.equal(
    packageJson.scripts?.['check:decision-guide-evidence-transparency'],
    'npm run worker:build && node dist/scripts/checkDecisionGuideEvidenceTransparency.js',
    'package.json must expose the Decision Guide Evidence Transparency validation check.',
  );
  assertIncludes(
    workerConfig,
    'scripts/checkDecisionGuideEvidenceTransparency.ts',
    'Worker build must include the Decision Guide Evidence Transparency check.',
  );

  console.log(
    '[decision-guide-evidence-transparency] ok: Boulder, Louisville, Lafayette transparency, maturity preservation, public-copy safety, evidence non-exposure, and protected boundaries verified.',
  );
}

main().catch((error) => {
  console.error('[decision-guide-evidence-transparency] failed:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
