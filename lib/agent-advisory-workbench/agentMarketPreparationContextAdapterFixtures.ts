import type { AgentMarketPreparationContextInput } from './agentMarketPreparationContextAdapter';

const observation = {
  id: 'boulder-market-observation', label: 'Certified market observation', sourceClass: 'CERTIFIED_MARKET_EVIDENCE' as const, observationDate: '2026-08-01', effectiveDate: '2026-07-31', freshness: 'CURRENT' as const, permittedUse: 'AGENT_MARKET_PREPARATION_APPROVED' as const, completeness: 'COMPLETE' as const, conflict: 'NO_CONFLICT' as const, certification: 'CERTIFIED' as const, professionalVerificationRequired: false,
  evidence: { id: 'boulder-market-evidence', label: 'Visible market fact', value: 'Certified current observation', classification: 'FACT' as const, provenance: { origin: 'GOVERNED_SOURCE_FACT' as const, reference: 'market-certification', sourceId: 'SRC-CERTIFIED-MARKET', freshness: 'CURRENT' as const, rights: 'REVIEWED' as const }, visibility: 'AGENT_ONLY' as const, verification: 'NOT_REQUIRED' as const, prohibitedUse: ['No recommendation or suitability conclusion.'] },
};

const context = (overrides: Partial<AgentMarketPreparationContextInput> = {}): AgentMarketPreparationContextInput => ({
  contextClass: 'AGENT_MARKET_PREPARATION_CONTEXT', task: 'MARKET_CONVERSATION', market: { id: 'boulder-market', label: 'Boulder market' }, observations: [observation], limitations: ['Point-in-time certified market context.'], verificationQuestions: ['Which visible date should be confirmed before relying on this context?'], professionalHandoffs: [], reviewSurfaces: ['MARKET', 'DECISION_GUIDES', 'SOURCES'], ...overrides,
});

export const AGENT_MARKET_PREPARATION_CONTEXT_FIXTURES = {
  complete: context(),
  incomplete: context({ observations: [{ ...observation, completeness: 'INCOMPLETE', evidence: { ...observation.evidence, classification: 'NOT_AVAILABLE', value: null, visibility: 'DATA_INSUFFICIENT', verification: 'REQUIRED', provenance: { origin: 'NONE', reference: 'market-certification', sourceId: 'SRC-CERTIFIED-MARKET', freshness: 'CURRENT', rights: 'REVIEWED' } } }] }),
  conflicting: context({ observations: [{ ...observation, conflict: 'CONFLICTING' }] }),
  stale: context({ observations: [{ ...observation, freshness: 'STALE', evidence: { ...observation.evidence, provenance: { ...observation.evidence.provenance, freshness: 'DATED' } } }] }),
  professional: context({ observations: [{ ...observation, professionalVerificationRequired: true, evidence: { ...observation.evidence, classification: 'PROFESSIONAL_VERIFICATION_REQUIRED', verification: 'REQUIRED' } }], professionalHandoffs: [{ id: 'market-review', role: 'REAL_ESTATE_AGENT', questionCategory: 'Market evidence review', whyVerificationIsNeeded: 'Certified context requires professional review before reliance.', informationToBring: ['Certified market observation'], whatReieCannotDetermine: ['Recommendation or prediction'], customerSelectedHandoff: false, agentPreparationOnly: true, contextItemIds: ['boulder-market-evidence'], providerRecommendation: false, ranking: false, referralRelationship: false, automaticCommunication: false }] }),
  missingProvenance: context({ observations: [{ ...observation, evidence: { ...observation.evidence, provenance: { ...observation.evidence.provenance, sourceId: null } } }] }),
  unauthorizedRights: context({ observations: [{ ...observation, permittedUse: 'UNKNOWN' as never }] }),
  unsupportedClass: context({ contextClass: 'ADMIN_MARKET_CONTEXT' as never }),
  customerData: { ...context(), customerName: 'Blocked' },
  behavioral: { ...context(), behavioralSignal: 'Blocked' },
  hiddenContext: { ...context(), hiddenUrlState: 'Blocked' },
  adminOnly: { ...context(), adminSessionContext: 'Blocked' },
  mcp: { ...context(), mcpState: 'Blocked' },
  mutation: { ...context(), mutationAuthority: true },
  providerRuntime: { ...context(), providerRuntime: 'Blocked' },
  recommendation: { ...context(), recommendation: 'Blocked' },
  ranking: { ...context(), ranking: 'Blocked' },
  protectedClass: { ...context(), protectedClass: 'Blocked' },
  sellerTask: context({ task: 'SELLER_UPDATE' as never }),
  offerTask: context({ task: 'OFFER_PREPARATION' as never }),
  fourthTask: context({ task: 'BUYER_CONSULTATION' as never }),
} as const;
