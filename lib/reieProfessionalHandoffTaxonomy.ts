export const REIE_PROFESSIONAL_HANDOFF_ROLES = [
  'REAL_ESTATE_AGENT',
  'LENDER',
  'TAX_PROFESSIONAL',
  'ATTORNEY',
  'TITLE_PROFESSIONAL',
  'INSURANCE_PROFESSIONAL',
  'APPRAISER',
  'INSPECTOR',
  'ENGINEER',
  'CONTRACTOR',
  'CARE_PROFESSIONAL',
  'ESTATE_PLANNING_PROFESSIONAL',
  'FINANCIAL_PROFESSIONAL',
  'MUNICIPAL_OR_COUNTY_AUTHORITY',
  'OTHER_GOVERNED_ROLE',
] as const;

export type ReieProfessionalHandoffRole = (typeof REIE_PROFESSIONAL_HANDOFF_ROLES)[number];

export type ReieProfessionalHandoffRequest = Readonly<{
  id: string;
  role: ReieProfessionalHandoffRole;
  questionCategory: string;
  whyVerificationIsNeeded: string;
  informationToBring: readonly string[];
  whatReieCannotDetermine: readonly string[];
  customerSelectedHandoff: boolean;
  agentPreparationOnly: boolean;
  contextItemIds: readonly string[];
  providerRecommendation: false;
  ranking: false;
  referralRelationship: false;
  automaticCommunication: false;
}>;

export function validateReieProfessionalHandoffRequest(request: ReieProfessionalHandoffRequest): readonly string[] {
  const reasons: string[] = [];
  if (!request.id.trim()) reasons.push('HANDOFF_ID_REQUIRED');
  if (!REIE_PROFESSIONAL_HANDOFF_ROLES.includes(request.role)) reasons.push('HANDOFF_ROLE_INVALID');
  if (!request.questionCategory.trim()) reasons.push('HANDOFF_QUESTION_CATEGORY_REQUIRED');
  if (!request.whyVerificationIsNeeded.trim()) reasons.push('HANDOFF_VERIFICATION_REASON_REQUIRED');
  if (request.informationToBring.length === 0) reasons.push('HANDOFF_INFORMATION_TO_BRING_REQUIRED');
  if (request.whatReieCannotDetermine.length === 0) reasons.push('HANDOFF_LIMITATION_REQUIRED');
  if (!request.customerSelectedHandoff && !request.agentPreparationOnly) reasons.push('HANDOFF_MUST_BE_CUSTOMER_SELECTED_OR_AGENT_PREPARATION');
  if (request.providerRecommendation !== false) reasons.push('HANDOFF_PROVIDER_RECOMMENDATION_PROHIBITED');
  if (request.ranking !== false) reasons.push('HANDOFF_RANKING_PROHIBITED');
  if (request.referralRelationship !== false) reasons.push('HANDOFF_REFERRAL_RELATIONSHIP_PROHIBITED');
  if (request.automaticCommunication !== false) reasons.push('HANDOFF_AUTOMATIC_COMMUNICATION_PROHIBITED');
  return Object.freeze([...new Set(reasons)]);
}
