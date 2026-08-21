import type { RestrictionTriggeredSourceGovernanceInput } from './sourceGovernanceRestrictionTriggered';
import { MLS_GRID_RATE_LIMIT_RESTRICTION } from './sourceGovernanceRestrictionTriggered';

const internal = (overrides: Partial<RestrictionTriggeredSourceGovernanceInput> = {}): RestrictionTriggeredSourceGovernanceInput => ({
  sourceAccessAuthorized: true,
  professionalPurpose: true,
  proposedUse: 'CURRENT_AGGREGATE_STATISTIC',
  knownTermsMateriallyAmbiguous: false,
  restrictionEvidence: [],
  sourceQualitySufficient: true,
  historicalEvidenceAvailable: true,
  architectureReady: true,
  ...overrides,
});

export const RESTRICTION_TRIGGERED_SOURCE_GOVERNANCE_FIXTURES = Object.freeze({
  currentMlsComputation: internal(),
  currentAggregation: internal({ proposedUse: 'CURRENT_AGGREGATE_STATISTIC' }),
  currentAgentBriefing: internal({ proposedUse: 'AGENT_PROFESSIONAL_SYNTHESIS' }),
  pendingMlsGridInquiry: internal({ proposedUse: 'AGENT_PROFESSIONAL_SYNTHESIS' }),
  derivedSnapshotCreation: internal({ proposedUse: 'RETAINED_AGGREGATE_SNAPSHOT', architectureReady: false }),
  snapshotRetention: internal({ proposedUse: 'RETAINED_AGGREGATE_SNAPSHOT', architectureReady: false }),
  thirtyDayComparison: internal({ proposedUse: 'HISTORICAL_COMPARISON', historicalEvidenceAvailable: false }),
  ninetyDayComparison: internal({ proposedUse: 'HISTORICAL_COMPARISON', historicalEvidenceAvailable: false }),
  yearOverYearComparison: internal({ proposedUse: 'HISTORICAL_COMPARISON', historicalEvidenceAvailable: false }),
  publicMarketDisplay: internal({ proposedUse: 'PUBLIC_WEBSITE_DISPLAY' }),
  clientFacingProfessionalReport: internal({ proposedUse: 'CLIENT_FACING_PROFESSIONAL_WORK_PRODUCT' }),
  rawMlsRetention: internal({ proposedUse: 'RAW_SOURCE_RECORD', architectureReady: false }),
  rateLimitedProviderRetrieval: internal({ proposedUse: 'PROVIDER_RETRIEVAL', restrictionEvidence: [MLS_GRID_RATE_LIMIT_RESTRICTION] }),
  explicitRetentionRestriction: internal({
    proposedUse: 'RETAINED_AGGREGATE_SNAPSHOT',
    restrictionEvidence: [{ trigger: 'RETENTION_LIMIT', evidenceReference: 'MLS-agreement#retention', affectedUses: ['RETAINED_AGGREGATE_SNAPSHOT'] }],
  }),
  materiallyAmbiguousTerms: internal({ knownTermsMateriallyAmbiguous: true }),
  uncitedRestrictionAssertion: internal({
    restrictionEvidence: [{ trigger: 'AUTOMATION_RESTRICTION', evidenceReference: '', affectedUses: ['CURRENT_AGGREGATE_STATISTIC'] }],
  }),
  insufficientSourceQuality: internal({ sourceQualitySufficient: false }),
} satisfies Record<string, RestrictionTriggeredSourceGovernanceInput>);
