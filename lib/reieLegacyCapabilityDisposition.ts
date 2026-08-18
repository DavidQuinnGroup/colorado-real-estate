export const REIE_LEGACY_CAPABILITY_DISPOSITION_CATEGORIES = [
  'CERTIFIED_CURRENT_CAPABILITY',
  'SAFE_REUSABLE_PRIMITIVE',
  'LEGACY_UNCONSUMED',
  'QUARANTINED_INTERNAL',
  'DEPRECATED',
  'REWRITE_REQUIRED',
  'DELETE_AFTER_DEPENDENCY_CLEARANCE',
] as const;

export type ReieLegacyCapabilityDispositionCategory = (typeof REIE_LEGACY_CAPABILITY_DISPOSITION_CATEGORIES)[number];
export type ReieLegacyCapabilityRiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
export type ReieLegacyCapabilityDisposition =
  | 'KEEP_AND_GOVERN'
  | 'EXTRACT_SAFE_PRIMITIVES'
  | 'QUARANTINE_INTERNAL'
  | 'DEPRECATE'
  | 'REWRITE_BEFORE_USE'
  | 'DELETE_AFTER_DEPENDENCY_CLEARANCE';
export type ReieLegacyConsumerState = 'UNCONSUMED_RUNTIME_ARTIFACT' | 'LEGACY_INTERNAL_CONSUMER_ONLY';
export type ReieLegacyRuntimeReachability = 'NO_CERTIFIED_PUBLIC_REACHABILITY' | 'LEGACY_INTERNAL_REACHABILITY';
export type ReieLegacyCertificationState = 'LEGACY_UNCERTIFIED' | 'MIXED_UNCERTIFIED_CONTENT';

export type ReieLegacyCapabilityDispositionRecord = Readonly<{
  path: string;
  consumerState: ReieLegacyConsumerState;
  runtimeReachability: ReieLegacyRuntimeReachability;
  certificationState: ReieLegacyCertificationState;
  riskLevel: ReieLegacyCapabilityRiskLevel;
  allowedReuse: readonly string[];
  prohibitedReuse: readonly string[];
  disposition: ReieLegacyCapabilityDisposition;
  category: ReieLegacyCapabilityDispositionCategory;
  directConsumers: readonly string[];
  governedImportExceptions: readonly string[];
  rewritePrecondition: string;
  deletionPrecondition: string | null;
}>;

const NO_PUBLIC_REUSE = [
  'No public route or customer-facing component reuse.',
  'No import by certified decision-intelligence contracts or Module 8.',
] as const;

export const REIE_LEGACY_CAPABILITY_DISPOSITIONS: readonly ReieLegacyCapabilityDispositionRecord[] = [
  {
    path: 'lib/financialEngine.ts',
    consumerState: 'UNCONSUMED_RUNTIME_ARTIFACT',
    runtimeReachability: 'NO_CERTIFIED_PUBLIC_REACHABILITY',
    certificationState: 'MIXED_UNCERTIFIED_CONTENT',
    riskLevel: 'CRITICAL',
    allowedReuse: ['Read-only code review and bounded replacement design.'],
    prohibitedReuse: [...NO_PUBLIC_REUSE, 'No lending qualification, rate, approval, suitability, or financial narrative output.'],
    disposition: 'REWRITE_BEFORE_USE',
    category: 'REWRITE_REQUIRED',
    directConsumers: [],
    governedImportExceptions: [],
    rewritePrecondition: 'Separate deterministic user-assumption illustration from lending and strategic narrative, then obtain compliance and professional-review authorization.',
    deletionPrecondition: 'Delete only after repository-wide import inspection confirms no consumer and the replacement contract is separately certified.',
  },
  {
    path: 'lib/marketMetrics.ts',
    consumerState: 'LEGACY_INTERNAL_CONSUMER_ONLY',
    runtimeReachability: 'LEGACY_INTERNAL_REACHABILITY',
    certificationState: 'LEGACY_UNCERTIFIED',
    riskLevel: 'HIGH',
    allowedReuse: ['Only the explicitly recorded legacy financialEngine import edge during review.'],
    prohibitedReuse: [...NO_PUBLIC_REUSE, 'No direct customer financing or valuation output.'],
    disposition: 'EXTRACT_SAFE_PRIMITIVES',
    category: 'QUARANTINED_INTERNAL',
    directConsumers: ['lib/financialEngine.ts'],
    governedImportExceptions: ['lib/financialEngine.ts'],
    rewritePrecondition: 'Extract independently testable arithmetic primitives with explicit user-assumption, freshness, rights, and professional-review boundaries.',
    deletionPrecondition: 'Delete the legacy module after financialEngine is removed or rewritten and the exact import edge is absent.',
  },
  {
    path: 'components/MarketChart.tsx',
    consumerState: 'UNCONSUMED_RUNTIME_ARTIFACT',
    runtimeReachability: 'NO_CERTIFIED_PUBLIC_REACHABILITY',
    certificationState: 'LEGACY_UNCERTIFIED',
    riskLevel: 'CRITICAL',
    allowedReuse: ['Read-only inspection of historical UI behavior.'],
    prohibitedReuse: [...NO_PUBLIC_REUSE, 'No hard-coded appreciation, portfolio, rental, equity, or investment claims.'],
    disposition: 'DEPRECATE',
    category: 'DEPRECATED',
    directConsumers: [],
    governedImportExceptions: [],
    rewritePrecondition: 'Replace with a separately authorized, user-entered illustration contract if a future product need remains.',
    deletionPrecondition: 'Delete after exact consumer inspection remains empty and any documentation or test references are updated under separate authorization.',
  },
  {
    path: 'lib/strategyGenerator.ts',
    consumerState: 'UNCONSUMED_RUNTIME_ARTIFACT',
    runtimeReachability: 'NO_CERTIFIED_PUBLIC_REACHABILITY',
    certificationState: 'MIXED_UNCERTIFIED_CONTENT',
    riskLevel: 'CRITICAL',
    allowedReuse: ['Read-only inspection of private legacy behavior.'],
    prohibitedReuse: [...NO_PUBLIC_REUSE, 'No negotiation playbook, leverage, suitability, investment, or recommendation output.'],
    disposition: 'QUARANTINE_INTERNAL',
    category: 'QUARANTINED_INTERNAL',
    directConsumers: [],
    governedImportExceptions: [],
    rewritePrecondition: 'Map only safe preparation questions into certified Module 8 primitives after expert, compliance, and professional-governance review.',
    deletionPrecondition: 'Delete only after exact consumer inspection confirms no dependency and executive disposition authorizes removal.',
  },
  {
    path: 'components/maps/MarketGauge.tsx',
    consumerState: 'UNCONSUMED_RUNTIME_ARTIFACT',
    runtimeReachability: 'NO_CERTIFIED_PUBLIC_REACHABILITY',
    certificationState: 'MIXED_UNCERTIFIED_CONTENT',
    riskLevel: 'CRITICAL',
    allowedReuse: ['Read-only inspection of historical UI behavior.'],
    prohibitedReuse: [...NO_PUBLIC_REUSE, 'No tactical leverage, dominance, concession, or negotiation guidance.'],
    disposition: 'DEPRECATE',
    category: 'DEPRECATED',
    directConsumers: [],
    governedImportExceptions: [],
    rewritePrecondition: 'Replace with bounded market context and verification questions only if separately authorized.',
    deletionPrecondition: 'Delete after exact consumer inspection remains empty and any documentation or test references are updated under separate authorization.',
  },
  {
    path: 'lib/getMarketData.ts',
    consumerState: 'UNCONSUMED_RUNTIME_ARTIFACT',
    runtimeReachability: 'NO_CERTIFIED_PUBLIC_REACHABILITY',
    certificationState: 'MIXED_UNCERTIFIED_CONTENT',
    riskLevel: 'CRITICAL',
    allowedReuse: ['Read-only inspection of legacy market context and calculation behavior.'],
    prohibitedReuse: [...NO_PUBLIC_REUSE, 'No appreciation projection, investment narrative, valuation reconciliation, or tactical recommendation.'],
    disposition: 'REWRITE_BEFORE_USE',
    category: 'REWRITE_REQUIRED',
    directConsumers: [],
    governedImportExceptions: [],
    rewritePrecondition: 'Separate source-backed market context from unsupported projections and tactical outputs, then certify each bounded primitive independently.',
    deletionPrecondition: 'Delete after exact consumer inspection confirms no dependency and a governed replacement exists where needed.',
  },
  {
    path: 'lib/marketData.ts',
    consumerState: 'LEGACY_INTERNAL_CONSUMER_ONLY',
    runtimeReachability: 'LEGACY_INTERNAL_REACHABILITY',
    certificationState: 'MIXED_UNCERTIFIED_CONTENT',
    riskLevel: 'HIGH',
    allowedReuse: ['Only the explicitly recorded legacy getMarketData and internal read-only mapping-fixture edges during review.'],
    prohibitedReuse: [...NO_PUBLIC_REUSE, 'No David Quinn Optimized Value, valuation, or investment conclusion output.'],
    disposition: 'EXTRACT_SAFE_PRIMITIVES',
    category: 'QUARANTINED_INTERNAL',
    directConsumers: ['lib/getMarketData.ts', 'lib/gma/readOnlyMappingPreviewFixtures.ts'],
    governedImportExceptions: ['lib/getMarketData.ts', 'lib/gma/readOnlyMappingPreviewFixtures.ts'],
    rewritePrecondition: 'Separate static market context data from legacy valuation functions and establish source, freshness, rights, and display posture.',
    deletionPrecondition: 'Delete the legacy data module only after both recorded consumers are removed or rewritten and replacement evidence is certified.',
  },
  {
    path: 'lib/marketAnalytics.ts',
    consumerState: 'LEGACY_INTERNAL_CONSUMER_ONLY',
    runtimeReachability: 'LEGACY_INTERNAL_REACHABILITY',
    certificationState: 'MIXED_UNCERTIFIED_CONTENT',
    riskLevel: 'CRITICAL',
    allowedReuse: ['Only the explicitly recorded legacy marketPulse import edge during review.'],
    prohibitedReuse: [...NO_PUBLIC_REUSE, 'No negotiation leverage, valuation reconciliation, tactical recommendation, or market dominance output.'],
    disposition: 'REWRITE_BEFORE_USE',
    category: 'REWRITE_REQUIRED',
    directConsumers: ['lib/marketPulse.ts'],
    governedImportExceptions: ['lib/marketPulse.ts'],
    rewritePrecondition: 'Replace leverage and reconciliation semantics with source-backed market context and bounded verification questions.',
    deletionPrecondition: 'Delete after marketPulse is removed or rewritten and the exact import edge is absent.',
  },
  {
    path: 'lib/marketPulse.ts',
    consumerState: 'UNCONSUMED_RUNTIME_ARTIFACT',
    runtimeReachability: 'NO_CERTIFIED_PUBLIC_REACHABILITY',
    certificationState: 'MIXED_UNCERTIFIED_CONTENT',
    riskLevel: 'CRITICAL',
    allowedReuse: ['Read-only inspection of historical market-pulse behavior.'],
    prohibitedReuse: [...NO_PUBLIC_REUSE, 'No social distribution, authority narrative, leverage, scarcity, or tactical advantage output.'],
    disposition: 'DEPRECATE',
    category: 'DEPRECATED',
    directConsumers: [],
    governedImportExceptions: [],
    rewritePrecondition: 'Replace with certified market context and professional-verification preparation if a future surface is authorized.',
    deletionPrecondition: 'Delete after exact consumer inspection remains empty and any documentation or test references are updated under separate authorization.',
  },
] as const;

export const REIE_LEGACY_CAPABILITY_PROTECTED_CONSUMER_ROOTS = [
  'app',
  'components',
  'app/grand-plan/page.tsx',
  'components/BuyerFinancingDecisionPlanner.tsx',
  'lib/reieDecisionContextContract.ts',
  'lib/reieDecisionEvidenceClassification.ts',
  'lib/reieProfessionalHandoffTaxonomy.ts',
  'lib/multiDimensionalStrategyOrchestration.ts',
  'lib/buyerDecisionWorkspace.ts',
  'lib/sellerDecisionWorkspace.ts',
  'lib/property/propertyDecisionWorkspace.ts',
  'lib/marketDecisionWorkspace.ts',
  'lib/financingDecisionWorkspace.ts',
] as const;
