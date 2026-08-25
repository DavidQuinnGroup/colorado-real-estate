import type { AgentCohortQuickFilters } from './agentCohortBuilder';

export type AgentComparisonSurfaceId = 'MARKET_UPDATE_PREPARATION' | 'MARKET_PREPARATION' | 'LOCATION_PREPARATION' | 'BUYER_PREPARATION' | 'AGENT_WORKSPACE';

export type AgentComparisonSurfaceConfig = Readonly<{
  surface: AgentComparisonSurfaceId;
  eyebrow: string;
  heading: string;
  supportingCopy: string;
  resultHeading: string;
  defaultLeft: AgentCohortQuickFilters;
  defaultRight: AgentCohortQuickFilters;
  leftLabel: string;
  rightLabel: string;
  generatedBandControl: boolean;
  boundaryCopy: string;
}>;

const baseFilters: AgentCohortQuickFilters = Object.freeze({
  city: 'boulder',
  propertyType: 'residential',
  statusScope: 'active',
  priceMin: null,
  priceMax: null,
  bedsMin: null,
  bathsMin: null,
  sqftMin: null,
  sqftMax: null,
  yearBuiltMin: null,
  yearBuiltMax: null,
});

export const AGENT_COMPARISON_SURFACE_CONFIGS: Readonly<Record<AgentComparisonSurfaceId, AgentComparisonSurfaceConfig>> = Object.freeze({
  MARKET_UPDATE_PREPARATION: Object.freeze({
    surface: 'MARKET_UPDATE_PREPARATION',
    eyebrow: 'Current-snapshot comparison',
    heading: 'Compare two current listing cohorts',
    supportingCopy: 'Agent-only side-by-side comparison using admitted current listing metrics, explicit cohort filters, coverage, and as-of metadata.',
    resultHeading: 'Principal differences',
    defaultLeft: baseFilters,
    defaultRight: Object.freeze({ ...baseFilters, city: 'louisville' }),
    leftLabel: 'Cohort A',
    rightLabel: 'Cohort B',
    generatedBandControl: true,
    boundaryCopy: 'Current listing-record observations only; not a publication, forecast, valuation, or recommendation.',
  }),
  MARKET_PREPARATION: Object.freeze({
    surface: 'MARKET_PREPARATION',
    eyebrow: 'Market comparison',
    heading: 'Compare current market cohorts',
    supportingCopy: 'Use the same admitted current metrics to inspect two market cohorts before an Agent conversation.',
    resultHeading: 'Current market cohort differences',
    defaultLeft: Object.freeze({ ...baseFilters, priceMin: 500000, priceMax: 1000000 }),
    defaultRight: Object.freeze({ ...baseFilters, priceMin: 1000000, priceMax: 2000000 }),
    leftLabel: 'Market cohort A',
    rightLabel: 'Market cohort B',
    generatedBandControl: true,
    boundaryCopy: 'Market Preparation remains an Agent analysis surface and does not create Market Update narrative or public reporting.',
  }),
  LOCATION_PREPARATION: Object.freeze({
    surface: 'LOCATION_PREPARATION',
    eyebrow: 'Location comparison',
    heading: 'Compare current listing context across locations',
    supportingCopy: 'Compare the same admitted current property criteria across Location-admitted cities without ranking places or recommending where to live.',
    resultHeading: 'Current location cohort differences',
    defaultLeft: baseFilters,
    defaultRight: Object.freeze({ ...baseFilters, city: 'louisville' }),
    leftLabel: 'Boulder current cohort',
    rightLabel: 'Louisville current cohort',
    generatedBandControl: false,
    boundaryCopy: 'Location comparison is current MLS listing context only; it does not assess desirability, schools, safety, quality of life, or future value.',
  }),
  BUYER_PREPARATION: Object.freeze({
    surface: 'BUYER_PREPARATION',
    eyebrow: 'Buyer search comparison',
    heading: 'Compare current listing context for this buyer search',
    supportingCopy: 'Map only supported session criteria into two current listing cohorts and surface unsupported criteria before the Agent relies on the comparison.',
    resultHeading: 'Current buyer-search cohort differences',
    defaultLeft: Object.freeze({ ...baseFilters, priceMin: 750000, priceMax: 1000000, bedsMin: 2, bathsMin: 2 }),
    defaultRight: Object.freeze({ ...baseFilters, city: 'louisville', priceMin: 750000, priceMax: 1000000, bedsMin: 2, bathsMin: 2 }),
    leftLabel: 'Buyer search A',
    rightLabel: 'Buyer search B',
    generatedBandControl: true,
    boundaryCopy: 'Buyer comparison is decision-support evidence only; it does not choose a city, property, offer, investment, or negotiation strategy.',
  }),
  AGENT_WORKSPACE: Object.freeze({
    surface: 'AGENT_WORKSPACE',
    eyebrow: 'Current-snapshot comparison',
    heading: 'Compare two current listing cohorts',
    supportingCopy: 'Agent-only side-by-side comparison using admitted current listing metrics and explicit cohort filters.',
    resultHeading: 'Principal differences',
    defaultLeft: baseFilters,
    defaultRight: Object.freeze({ ...baseFilters, city: 'louisville' }),
    leftLabel: 'Cohort A',
    rightLabel: 'Cohort B',
    generatedBandControl: true,
    boundaryCopy: 'Current listing-record observations only; not a publication, forecast, valuation, or recommendation.',
  }),
});

export function getAgentComparisonSurfaceConfig(surface: AgentComparisonSurfaceId): AgentComparisonSurfaceConfig {
  return AGENT_COMPARISON_SURFACE_CONFIGS[surface];
}
