import { SUNDANCE_ARTICLE_INTERNAL_LINK_DESTINATIONS, type SundanceArticleAeoRole, type SundanceArticleCluster, type SundanceArticleInternalLinkDestination } from './sundanceArticleArchitecture';
import { SUNDANCE_CONTENT_GENERATION_PREREQUISITES } from './sundanceContentGenerationGate';
import type { ProfessionalHandoffSurface } from './professionalHandoffCohesion';

export const SUNDANCE_TOPIC_REGISTER_STATUS = 'IMPLEMENTED_NOT_ACTIVATED' as const;
export type SundanceTopicPriority = 'PILLAR_CRITICAL' | 'PHASE_1_SUPPORT' | 'PHASE_2_EXPANSION' | 'DEFER';
export type SundanceTopicJourneyStage = 'ORIENT' | 'FRAME_SCENARIO' | 'VERIFY_PROPERTY' | 'PREPARE_HANDOFF' | 'UNDERSTAND_SOURCES';
export type SundanceTopicRecord = Readonly<{
  topicId: string; customerQuestion: string; cluster: SundanceArticleCluster; priority: SundanceTopicPriority;
  customerJourneyStage: SundanceTopicJourneyStage; decisionMoment: string; pillarRelationship: 'SUPPORTING_ARTICLE' | 'PILLAR';
  sourceClassRequirements: readonly string[]; freshnessClass: 'DOMAIN_SPECIFIC' | 'VERIFIED_CURRENT' | 'OFFICIAL_SOURCE_REQUIRED';
  professionalHandoff: ProfessionalHandoffSurface; claimBoundary: 'EDITORIAL_ONLY'; aeoRole: SundanceArticleAeoRole;
  internalLinkTargets: readonly SundanceArticleInternalLinkDestination[]; generationGatePrerequisites: readonly string[];
  editorialOwner: string; specialistReviewRequirement: 'NONE' | 'REQUIRED'; retirementTrigger: string; planningOnly: boolean;
}>;
const prerequisites = SUNDANCE_CONTENT_GENERATION_PREREQUISITES;
const base = (topicId: string, customerQuestion: string, cluster: SundanceArticleCluster, priority: SundanceTopicPriority, customerJourneyStage: SundanceTopicJourneyStage, sourceClassRequirements: readonly string[], freshnessClass: SundanceTopicRecord['freshnessClass'], aeoRole: SundanceArticleAeoRole, planningOnly = false): SundanceTopicRecord => ({ topicId, customerQuestion, cluster, priority, customerJourneyStage, decisionMoment: 'SOURCE_AND_PROFESSIONAL_VERIFICATION', pillarRelationship: topicId === 'SUN-PILLAR-001' ? 'PILLAR' : 'SUPPORTING_ARTICLE', sourceClassRequirements, freshnessClass, professionalHandoff: 'advisory', claimBoundary: 'EDITORIAL_ONLY', aeoRole, internalLinkTargets: ['PILLAR', 'SOURCES', 'ADVISORY'], generationGatePrerequisites: prerequisites, editorialOwner: 'PROJECT_ATLAS_EDITORIAL', specialistReviewRequirement: planningOnly ? 'REQUIRED' : 'NONE', retirementTrigger: 'SOURCE_RIGHTS_FRESHNESS_OR_LIFECYCLE_CHANGE', planningOnly });
export const SUNDANCE_CONTENT_TOPIC_REGISTER = [
  base('SUN-PILLAR-001', 'What Sundance orientation requires governed source and professional verification?', 'SOURCE_METHODOLOGY', 'PILLAR_CRITICAL', 'ORIENT', ['SUNDANCE_GOVERNANCE'], 'DOMAIN_SPECIFIC', 'PILLAR_SUPPORT'),
  base('SUN-PLACE-001', 'What geographic context should I verify before treating Sundance as relevant to a housing decision?', 'PLACE_GEOGRAPHY', 'PHASE_1_SUPPORT', 'ORIENT', ['GOVERNED_PLACE_GEOGRAPHY'], 'VERIFIED_CURRENT', 'ANSWER_UNIT'),
  base('SUN-SEASON-001', 'How should I separate a temporary or seasonal housing need from a permanent purchase or move?', 'SEASONAL_TEMPORARY_PERMANENT', 'PHASE_1_SUPPORT', 'FRAME_SCENARIO', ['CONCEPTUAL_OR_APPROVED_TIME_BOUND'], 'DOMAIN_SPECIFIC', 'ANSWER_UNIT'),
  base('SUN-RELOCATE-001', 'Which timing, travel-pattern, commute, and daily-life questions should I prepare?', 'RELOCATION_TRAVEL_PATTERN', 'PHASE_1_SUPPORT', 'FRAME_SCENARIO', ['METHODOLOGY_AND_BOUNDED_CONTEXT'], 'DOMAIN_SPECIFIC', 'ANSWER_UNIT'),
  base('SUN-PROPERTY-001', 'Which property facts should be verified before treating a listing as decision evidence?', 'PROPERTY_VERIFICATION', 'PHASE_1_SUPPORT', 'VERIFY_PROPERTY', ['PROPERTY_EVIDENCE_AND_SOURCE_QUALITY'], 'VERIFIED_CURRENT', 'ANSWER_UNIT'),
  base('SUN-RULE-001', 'Which municipal or local-rule questions require an official source or qualified professional?', 'LOCAL_RULE_MUNICIPAL', 'PHASE_2_EXPANSION', 'PREPARE_HANDOFF', ['OFFICIAL_MUNICIPAL_OR_LEGAL_SOURCE_REQUIRED'], 'OFFICIAL_SOURCE_REQUIRED', 'METHODOLOGY_SUPPORT', true),
  base('SUN-PRO-001', 'What questions and evidence should I bring to the appropriate professional?', 'PROFESSIONAL_PREPARATION', 'PHASE_1_SUPPORT', 'PREPARE_HANDOFF', ['PROFESSIONAL_HANDOFF_TAXONOMY'], 'DOMAIN_SPECIFIC', 'PILLAR_SUPPORT'),
  base('SUN-SOURCE-001', 'How does REIE distinguish editorial orientation from governed geographic fact, and how are source identity, rights, freshness, correction, and retirement handled?', 'SOURCE_METHODOLOGY', 'PILLAR_CRITICAL', 'UNDERSTAND_SOURCES', ['SOURCE_REGISTRY_SOURCE_QUALITY_SOURCE_RIGHTS_PUBLIC_TRUST'], 'DOMAIN_SPECIFIC', 'METHODOLOGY_SUPPORT'),
] as const satisfies readonly SundanceTopicRecord[];
export function validateSundanceTopicRegister(records: readonly SundanceTopicRecord[]) { return records.every((record) => record.customerQuestion.trim() && record.sourceClassRequirements.length && record.generationGatePrerequisites.length && record.claimBoundary === 'EDITORIAL_ONLY' && record.internalLinkTargets.every((target) => SUNDANCE_ARTICLE_INTERNAL_LINK_DESTINATIONS.includes(target))) && new Set(records.map((record) => record.customerQuestion)).size === records.length; }
