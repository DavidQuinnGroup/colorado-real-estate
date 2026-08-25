import type { AgentCohortQuickFilters } from './agentCohortBuilder';
import type { PropertyCriteriaProfile } from './agent-advisory-workbench/propertyCriteriaProfile';

export const AGENT_BUYER_CRITERIA_COMPARISON_ADAPTER_STATUS = 'AGENT_BUYER_CRITERIA_TO_COHORT_ADAPTER_WAVE_4_CERTIFIED' as const;

export type AgentBuyerCriteriaComparisonMapping = Readonly<{
  status: 'READY' | 'LIMITED_BY_UNMAPPED_CRITERIA';
  filters: AgentCohortQuickFilters;
  mappedCriteria: readonly string[];
  unmappedCriteria: readonly string[];
  limitations: readonly string[];
}>;

function hasChoice(values: readonly string[]) {
  return values.length > 0;
}

export function mapBuyerCriteriaToAgentCohort(profile: PropertyCriteriaProfile, base: AgentCohortQuickFilters): AgentBuyerCriteriaComparisonMapping {
  const mapped = new Set<string>();
  const unmapped = new Set<string>();
  const filters: AgentCohortQuickFilters = Object.freeze({
    ...base,
    propertyType: hasChoice(profile.propertyTypes.values) && profile.propertyTypes.values.every((value) => ['SINGLE_FAMILY', 'CONDOMINIUM', 'TOWNHOUSE', 'OTHER_RESIDENTIAL'].includes(value))
      ? 'residential'
      : base.propertyType,
    bedsMin: profile.bedrooms.min ?? base.bedsMin,
    bedsMax: profile.bedrooms.max ?? base.bedsMax,
    bathsMin: profile.bathrooms.min ?? base.bathsMin,
    bathsMax: profile.bathrooms.max ?? base.bathsMax,
    sqftMin: profile.squareFeet.min ?? base.sqftMin,
    sqftMax: profile.squareFeet.max ?? base.sqftMax,
    yearBuiltMin: profile.yearBuilt.min ?? base.yearBuiltMin,
    yearBuiltMax: profile.yearBuilt.max ?? base.yearBuiltMax,
  });
  if (hasChoice(profile.propertyTypes.values) && filters.propertyType === 'residential') mapped.add('residential property type');
  if (profile.bedrooms.min !== null) mapped.add('minimum bedrooms');
  if (profile.bedrooms.max !== null) mapped.add('maximum bedrooms');
  if (profile.bathrooms.min !== null) mapped.add('minimum bathrooms');
  if (profile.bathrooms.max !== null) mapped.add('maximum bathrooms');
  if (profile.squareFeet.min !== null) mapped.add('minimum listed square feet');
  if (profile.squareFeet.max !== null) mapped.add('maximum listed square feet');
  if (profile.yearBuilt.min !== null) mapped.add('minimum year built');
  if (profile.yearBuilt.max !== null) mapped.add('maximum year built');
  if (hasChoice(profile.propertyTypes.values) && filters.propertyType !== 'residential') unmapped.add('non-Residential property type');
  if (profile.garageSpaces.min !== null || profile.garageSpaces.max !== null) unmapped.add('garage or parking spaces');
  if (hasChoice(profile.basement.values)) unmapped.add('basement or lower level');
  if (profile.lotSquareFeet.min !== null || profile.lotSquareFeet.max !== null) unmapped.add('lot size');
  if (hasChoice(profile.outdoorSpace.values)) unmapped.add('outdoor space');
  if (hasChoice(profile.stories.values)) unmapped.add('stories or levels');
  if (hasChoice(profile.condition.values)) unmapped.add('condition or renovation tolerance');
  if (profile.officeOrFlexSpace !== 'OPEN_QUESTION' && profile.officeOrFlexSpace !== 'UNKNOWN') unmapped.add('office or flex space');
  if (profile.hoa !== 'OPEN_QUESTION' && profile.hoa !== 'UNKNOWN') unmapped.add('HOA');
  const unmappedCriteria = Object.freeze([...unmapped].sort());
  return Object.freeze({
    status: unmappedCriteria.length ? 'LIMITED_BY_UNMAPPED_CRITERIA' : 'READY',
    filters,
    mappedCriteria: Object.freeze([...mapped].sort()),
    unmappedCriteria,
    limitations: Object.freeze(unmappedCriteria.map((item) => `Buyer criterion not mapped to the current admitted cohort contract: ${item}.`)),
  });
}
