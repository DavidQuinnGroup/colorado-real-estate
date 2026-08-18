import { cities, getCityByMarketSlug, type CityData } from '../cities';
import { neighborhoods } from '../neighborhoods';
import { articles } from '../articles';
import { buildCityMarketExperience } from '../marketIntelligenceExperience';
import { buildCityMarketProduct3Experience } from '../marketProduct3';
import { getPublicSourceRegistryRecords, REIE_SOURCE_REGISTRY_REFERENCE_DATE } from '../sourceRegistry';

export const MARKET_NEWSLETTER_AGENT_REVIEW_PACKAGE_STATUS =
  'RECURRING_MARKET_NEWSLETTER_AGENT_REVIEW_PACKAGE_MVV';
export const MARKET_NEWSLETTER_AGENT_REVIEW_PACKAGE_VERSION = '1.0.0';
export const MARKET_NEWSLETTER_AGENT_REVIEW_PACKAGE_SUPPORTED_CITY_SLUG = 'boulder-co-housing-market';

export type MarketNewsletterPackageStatus = 'READY_FOR_AGENT_REVIEW' | 'FAIL_CLOSED';
export type MarketNewsletterEvidenceScenario =
  | 'NORMAL'
  | 'MISSING_MARKET_EVIDENCE'
  | 'STALE_SOURCE_EVIDENCE'
  | 'SOURCE_CONFLICT';

export type MarketNewsletterReviewFlagType =
  | 'STALE_EVIDENCE'
  | 'MISSING_EVIDENCE'
  | 'SOURCE_CONFLICT'
  | 'INSUFFICIENT_COMPARISON_PERIOD'
  | 'UNSUPPORTED_METRIC'
  | 'MANUAL_VERIFICATION_NEEDED'
  | 'UNSUPPORTED_GEOGRAPHY'
  | 'INVALID_PERIOD';

export type MarketNewsletterReviewFlag = Readonly<{
  type: MarketNewsletterReviewFlagType;
  section: string;
  severity: 'INFO' | 'WATCH' | 'BLOCKING';
  message: string;
  agentAction: string;
}>;

export type MarketNewsletterReportingPeriod = Readonly<{
  id: string;
  label: string;
  startsAt: string;
  endsAt: string;
}>;

export type MarketNewsletterSourceReference = Readonly<{
  sourceId: string;
  sourceName: string;
  sourceClass: string;
  freshness: string;
  effectivePeriod: string;
  limitation: string;
  claimEligible: boolean;
  sourcePath: string;
}>;

export type MarketNewsletterMetric = Readonly<{
  label: string;
  value: string;
  classification: 'FACT' | 'DERIVED_METRIC' | 'CONTEXT';
  sourceReferenceIds: readonly string[];
  explanation: string;
}>;

export type MarketNewsletterPackage = Readonly<{
  status: MarketNewsletterPackageStatus;
  contract: typeof MARKET_NEWSLETTER_AGENT_REVIEW_PACKAGE_STATUS;
  version: typeof MARKET_NEWSLETTER_AGENT_REVIEW_PACKAGE_VERSION;
  packageId: string;
  geography: {
    cityName: string;
    citySlug: string;
    marketSlug: string;
    supported: boolean;
    route: string;
  };
  reportingPeriod: MarketNewsletterReportingPeriod;
  generatedAt: string;
  evidenceEffectiveDate: string;
  customerCommunicationAuthorized: false;
  automaticPublicationAuthorized: false;
  emailSendingAuthorized: false;
  schedulerAuthorized: false;
  providerDependency: false;
  writeSideEffects: false;
  marketSnapshot: {
    metrics: readonly MarketNewsletterMetric[];
    chartReadyData: readonly { label: string; value: number; unit: string }[];
    sourcePosture: string;
  };
  periodComparison: {
    supported: boolean;
    summary: string;
    flags: readonly MarketNewsletterReviewFlag[];
  };
  sourceReferences: readonly MarketNewsletterSourceReference[];
  agentTalkingPointInputs: readonly string[];
  customerEducationInputs: readonly string[];
  reviewFlags: readonly MarketNewsletterReviewFlag[];
  editorialChecklist: readonly string[];
  humanJudgmentBoundary: readonly string[];
}>;

export type BuildMarketNewsletterPackageOptions = Readonly<{
  geographySlug?: string;
  reportingPeriod?: MarketNewsletterReportingPeriod;
  generatedAt?: string;
  evidenceScenario?: MarketNewsletterEvidenceScenario;
}>;

const DEFAULT_REPORTING_PERIOD: MarketNewsletterReportingPeriod = Object.freeze({
  id: '2026-08-agent-review',
  label: 'August 2026 agent-review package',
  startsAt: '2026-08-01',
  endsAt: '2026-08-31',
});

function normalizeSlug(value: string) {
  return value.trim().toLowerCase();
}

function numericStat(value: string) {
  const parsed = Number(value.replace(/[^0-9.]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function packageIdFor(city: CityData, period: MarketNewsletterReportingPeriod) {
  return `reie-market-newsletter-agent-review-${city.marketSlug}-${period.id}-v${MARKET_NEWSLETTER_AGENT_REVIEW_PACKAGE_VERSION}`;
}

function validPeriod(period: MarketNewsletterReportingPeriod) {
  return Boolean(period.id && period.label && period.startsAt <= period.endsAt);
}

function flag(
  type: MarketNewsletterReviewFlagType,
  section: string,
  severity: MarketNewsletterReviewFlag['severity'],
  message: string,
  agentAction: string,
): MarketNewsletterReviewFlag {
  return Object.freeze({ type, section, severity, message, agentAction });
}

function buildUnsupportedPackage({
  requestedSlug,
  reportingPeriod,
  generatedAt,
  reasonFlag,
}: {
  requestedSlug: string;
  reportingPeriod: MarketNewsletterReportingPeriod;
  generatedAt: string;
  reasonFlag: MarketNewsletterReviewFlag;
}): MarketNewsletterPackage {
  return Object.freeze({
    status: 'FAIL_CLOSED',
    contract: MARKET_NEWSLETTER_AGENT_REVIEW_PACKAGE_STATUS,
    version: MARKET_NEWSLETTER_AGENT_REVIEW_PACKAGE_VERSION,
    packageId: `reie-market-newsletter-agent-review-unsupported-${normalizeSlug(requestedSlug) || 'unknown'}-${reportingPeriod.id}`,
    geography: {
      cityName: requestedSlug || 'Unsupported geography',
      citySlug: requestedSlug || 'unsupported',
      marketSlug: requestedSlug || 'unsupported',
      supported: false,
      route: '',
    },
    reportingPeriod,
    generatedAt,
    evidenceEffectiveDate: REIE_SOURCE_REGISTRY_REFERENCE_DATE,
    customerCommunicationAuthorized: false,
    automaticPublicationAuthorized: false,
    emailSendingAuthorized: false,
    schedulerAuthorized: false,
    providerDependency: false,
    writeSideEffects: false,
    marketSnapshot: {
      metrics: [],
      chartReadyData: [],
      sourcePosture: 'Fail closed: no market package is generated for unsupported or invalid inputs.',
    },
    periodComparison: {
      supported: false,
      summary: 'No comparison is generated when the package fails closed.',
      flags: [reasonFlag],
    },
    sourceReferences: [],
    agentTalkingPointInputs: [],
    customerEducationInputs: [],
    reviewFlags: [reasonFlag],
    editorialChecklist: ['Do not use this failed package for customer communication.'],
    humanJudgmentBoundary: ['A human agent must request a supported geography and valid period before review.'],
  });
}

function sourceReference(sourceId: string): MarketNewsletterSourceReference {
  const source = getPublicSourceRegistryRecords().find((record) => record.sourceId === sourceId);

  if (!source) {
    return {
      sourceId,
      sourceName: 'REIE governed source record unavailable',
      sourceClass: 'MISSING_EVIDENCE',
      freshness: 'unavailable',
      effectivePeriod: REIE_SOURCE_REGISTRY_REFERENCE_DATE,
      limitation: 'Source registry reference is missing; package must be reviewed before use.',
      claimEligible: false,
      sourcePath: 'lib/sourceRegistry.ts',
    };
  }

  return {
    sourceId: source.sourceId,
    sourceName: source.publicName,
    sourceClass: source.sourceClass,
    freshness: source.freshnessExpectation,
    effectivePeriod: source.lastSuccessfulDataRefresh ?? source.lastSourceVerificationDate,
    limitation: source.limitations[0] ?? 'Source limitations must be reviewed by the agent.',
    claimEligible: source.claimEligible,
    sourcePath: source.sourcePaths[0] ?? 'lib/sourceRegistry.ts',
  };
}

function reieDerivedReference(sourceId: string, sourceName: string, sourcePath: string): MarketNewsletterSourceReference {
  return {
    sourceId,
    sourceName,
    sourceClass: 'REIE_DERIVED_INTELLIGENCE',
    freshness: 'inherits governed REIE source and repository evidence limitations',
    effectivePeriod: REIE_SOURCE_REGISTRY_REFERENCE_DATE,
    limitation: 'Derived package input; verify underlying listing, city, and source facts before customer use.',
    claimEligible: true,
    sourcePath,
  };
}

function freshnessFlags(scenario: MarketNewsletterEvidenceScenario): MarketNewsletterReviewFlag[] {
  if (scenario !== 'STALE_SOURCE_EVIDENCE') return [];

  return [
    flag(
      'STALE_EVIDENCE',
      'SOURCE/FRESHNESS',
      'BLOCKING',
      'The package is exercising stale-source posture; source facts are not presented as current.',
      'Refresh or independently verify the source record before using the affected section.',
    ),
  ];
}

function conflictFlags(scenario: MarketNewsletterEvidenceScenario): MarketNewsletterReviewFlag[] {
  if (scenario !== 'SOURCE_CONFLICT') return [];

  return [
    flag(
      'SOURCE_CONFLICT',
      'SOURCE/FRESHNESS',
      'BLOCKING',
      'The package is exercising source-conflict posture; conflicting evidence must not be resolved automatically.',
      'Manually inspect the conflicting sources and decide whether the section should be omitted.',
    ),
  ];
}

function missingEvidenceFlags(scenario: MarketNewsletterEvidenceScenario): MarketNewsletterReviewFlag[] {
  if (scenario !== 'MISSING_MARKET_EVIDENCE') return [];

  return [
    flag(
      'MISSING_EVIDENCE',
      'MARKET SNAPSHOT',
      'BLOCKING',
      'The package is exercising missing-market-evidence posture; required city market facts are unavailable.',
      'Do not use market metrics until the missing evidence is restored and verified.',
    ),
  ];
}

function buildMetrics(city: CityData, sourceIds: readonly string[]): MarketNewsletterMetric[] {
  const marketExperience = buildCityMarketExperience(
    city,
    neighborhoods.filter((neighborhood) => neighborhood.city.toLowerCase() === city.name.toLowerCase()).length,
  );
  const productExperience = buildCityMarketProduct3Experience({
    city,
    marketExperience,
    neighborhoodCount: neighborhoods.filter((neighborhood) => neighborhood.city.toLowerCase() === city.name.toLowerCase()).length,
  });

  return [
    {
      label: 'Active inventory signal',
      value: city.stats.inventory,
      classification: 'FACT',
      sourceReferenceIds: sourceIds,
      explanation: 'Uses the existing governed city inventory field as an orientation signal, not as a live MLS count.',
    },
    {
      label: 'Median price context',
      value: city.stats.medianPrice,
      classification: 'FACT',
      sourceReferenceIds: sourceIds,
      explanation: 'Frames current city-level price context while preserving property-specific verification.',
    },
    {
      label: 'Price per square foot context',
      value: city.stats.pricePerSqFt,
      classification: 'FACT',
      sourceReferenceIds: sourceIds,
      explanation: 'Uses the certified city market stat only as context; it is not a valuation or appraisal.',
    },
    {
      label: 'Days on market context',
      value: `${city.stats.daysOnMarket} days`,
      classification: 'FACT',
      sourceReferenceIds: sourceIds,
      explanation: 'Treats pace as preparation context, not as a promise about negotiation or timing.',
    },
    {
      label: 'Market posture',
      value: marketExperience.directionLabel,
      classification: 'DERIVED_METRIC',
      sourceReferenceIds: ['SRC-REIE-CITY-MARKET-EXPERIENCE'],
      explanation: `Derived from the existing market health score of ${city.stats.marketHealthScore}/100 using the certified market experience thresholds.`,
    },
    {
      label: 'Review condition',
      value: productExperience.evidenceState,
      classification: 'CONTEXT',
      sourceReferenceIds: ['SRC-REIE-MARKET-PRODUCT-3'],
      explanation: 'Carries the existing Market Product 3 evidence-state posture into the agent-review package.',
    },
  ];
}

export function buildMarketNewsletterAgentReviewPackage(
  options: BuildMarketNewsletterPackageOptions = {},
): MarketNewsletterPackage {
  const requestedSlug = normalizeSlug(options.geographySlug ?? MARKET_NEWSLETTER_AGENT_REVIEW_PACKAGE_SUPPORTED_CITY_SLUG);
  const reportingPeriod = options.reportingPeriod ?? DEFAULT_REPORTING_PERIOD;
  const generatedAt = options.generatedAt ?? `${REIE_SOURCE_REGISTRY_REFERENCE_DATE}T00:00:00.000Z`;
  const evidenceScenario = options.evidenceScenario ?? 'NORMAL';

  if (!validPeriod(reportingPeriod)) {
    return buildUnsupportedPackage({
      requestedSlug,
      reportingPeriod,
      generatedAt,
      reasonFlag: flag(
        'INVALID_PERIOD',
        'PACKAGE IDENTITY',
        'BLOCKING',
        'Reporting period is invalid or incomplete.',
        'Correct the reporting period before generating an agent-review package.',
      ),
    });
  }

  if (requestedSlug !== MARKET_NEWSLETTER_AGENT_REVIEW_PACKAGE_SUPPORTED_CITY_SLUG) {
    return buildUnsupportedPackage({
      requestedSlug,
      reportingPeriod,
      generatedAt,
      reasonFlag: flag(
        'UNSUPPORTED_GEOGRAPHY',
        'PACKAGE IDENTITY',
        'BLOCKING',
        `Only ${MARKET_NEWSLETTER_AGENT_REVIEW_PACKAGE_SUPPORTED_CITY_SLUG} is supported by this MVV.`,
        'Use the certified Boulder path or request a separate city-expansion authorization.',
      ),
    });
  }

  const city = getCityByMarketSlug(requestedSlug);
  if (!city || evidenceScenario === 'MISSING_MARKET_EVIDENCE') {
    return buildUnsupportedPackage({
      requestedSlug,
      reportingPeriod,
      generatedAt,
      reasonFlag: missingEvidenceFlags('MISSING_MARKET_EVIDENCE')[0],
    });
  }

  const cityNeighborhoods = neighborhoods.filter((neighborhood) => neighborhood.city.toLowerCase() === city.name.toLowerCase());
  const cityArticles = articles.filter((article) => article.city.toLowerCase() === city.name.toLowerCase()).slice(0, 4);
  const sourceReferences = [
    reieDerivedReference('SRC-REIE-CITY-MARKET-FACTS', 'REIE governed city market facts', 'lib/cities.ts'),
    reieDerivedReference('SRC-REIE-CITY-MARKET-EXPERIENCE', 'REIE City Market Experience', 'lib/marketIntelligenceExperience.ts'),
    reieDerivedReference('SRC-REIE-MARKET-PRODUCT-3', 'REIE Market Product 3 evidence state', 'lib/marketProduct3.ts'),
    sourceReference('SRC-MLS-LISTING-DATA'),
    sourceReference('SRC-MUNICIPAL-PLANNING-CONTEXT'),
    reieDerivedReference('SRC-REIE-PROGRAMMATIC-ARTICLES', 'REIE programmatic local-market articles', 'lib/articles.ts'),
  ];
  const metrics = buildMetrics(city, sourceReferences.map((source) => source.sourceId));
  const comparisonFlags = [
    flag(
      'INSUFFICIENT_COMPARISON_PERIOD',
      'PERIOD COMPARISON',
      'WATCH',
      'The certified city market contract does not expose prior-period Boulder facts for this package.',
      'Use the current snapshot only; do not claim month-over-month or year-over-year movement.',
    ),
  ];
  const unsupportedMetricFlags = [
    flag(
      'UNSUPPORTED_METRIC',
      'MARKET SNAPSHOT',
      'WATCH',
      'New listing, pending, sold, and period-change metrics are omitted because this MVV does not have certified period inputs for those fields.',
      'Do not add those metrics to customer materials unless a certified source supplies them.',
    ),
  ];
  const manualVerificationFlags = [
    flag(
      'MANUAL_VERIFICATION_NEEDED',
      'AGENT REVIEW',
      'WATCH',
      'All talking points are preparation inputs only and require human editorial approval.',
      'Verify facts, tone, timing, and customer relevance before using any section externally.',
    ),
  ];
  const scenarioFlags = [
    ...freshnessFlags(evidenceScenario),
    ...conflictFlags(evidenceScenario),
  ];
  const reviewFlags = [
    ...comparisonFlags,
    ...unsupportedMetricFlags,
    ...manualVerificationFlags,
    ...scenarioFlags,
  ];

  return Object.freeze({
    status: 'READY_FOR_AGENT_REVIEW',
    contract: MARKET_NEWSLETTER_AGENT_REVIEW_PACKAGE_STATUS,
    version: MARKET_NEWSLETTER_AGENT_REVIEW_PACKAGE_VERSION,
    packageId: packageIdFor(city, reportingPeriod),
    geography: {
      cityName: city.name,
      citySlug: city.slug,
      marketSlug: city.marketSlug,
      supported: true,
      route: `/market/${city.marketSlug}`,
    },
    reportingPeriod,
    generatedAt,
    evidenceEffectiveDate: REIE_SOURCE_REGISTRY_REFERENCE_DATE,
    customerCommunicationAuthorized: false,
    automaticPublicationAuthorized: false,
    emailSendingAuthorized: false,
    schedulerAuthorized: false,
    providerDependency: false,
    writeSideEffects: false,
    marketSnapshot: {
      metrics,
      chartReadyData: [
        { label: 'Active inventory signal', value: numericStat(city.stats.inventory), unit: 'listings' },
        { label: 'Days on market context', value: numericStat(city.stats.daysOnMarket), unit: 'days' },
        { label: 'Market health score', value: city.stats.marketHealthScore, unit: 'score' },
        { label: 'Average efficiency score', value: city.stats.avgEfficiency, unit: 'score' },
      ],
      sourcePosture:
        'Existing REIE city market facts, Market Product 3 evidence posture, public source registry records, and programmatic article architecture are assembled for agent review only.',
    },
    periodComparison: {
      supported: false,
      summary:
        'Current-vs-prior comparison is intentionally omitted because the certified Boulder city market contract does not expose prior-period facts for this MVV.',
      flags: comparisonFlags,
    },
    sourceReferences,
    agentTalkingPointInputs: [
      `${city.name} has ${city.stats.inventory} active inventory signal in the governed city market facts; verify live listing availability before using externally.`,
      `${city.name} price context is ${city.stats.medianPrice} median and ${city.stats.pricePerSqFt} per square foot in the current REIE snapshot.`,
      `${city.stats.daysOnMarket} days on market should be treated as preparation context, not a prediction of negotiating leverage.`,
      `${cityNeighborhoods.length} Boulder neighborhood context paths can help frame verification questions without ranking places.`,
    ],
    customerEducationInputs: [
      'How inventory helps frame selection depth without deciding whether a market is right for a customer.',
      'Why days-on-market is a preparation signal and not a guarantee of timing or negotiation outcome.',
      'How median price and price-per-square-foot orient expectations while property-specific condition still controls decisions.',
      `How to use ${cityArticles.length} existing Boulder article inputs as factual education prompts after agent review.`,
    ],
    reviewFlags,
    editorialChecklist: [
      'Confirm every metric is still appropriate for the intended reporting period.',
      'Remove any section that would require unsupported prior-period, pending, sold, or new-listing evidence.',
      'Keep all language factual, neutral, and free of predictions or recommendations.',
      'Verify source/freshness limitations before customer-facing use.',
      'Confirm final tone, timing, relevance, and distribution remain human decisions.',
    ],
    humanJudgmentBoundary: [
      'The package is not autonomous customer communication.',
      'The package does not choose recipients, personalize advice, or authorize sending.',
      'A human agent retains editorial selection, interpretation, customer relevance, and final communication control.',
      'The package does not provide legal, tax, lending, appraisal, valuation, investment, or suitability conclusions.',
    ],
  });
}

export function getSupportedMarketNewsletterPackageCities() {
  return cities.filter((city) => city.marketSlug === MARKET_NEWSLETTER_AGENT_REVIEW_PACKAGE_SUPPORTED_CITY_SLUG);
}
