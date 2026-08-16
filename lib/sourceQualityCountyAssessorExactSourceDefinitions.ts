export const BOULDER_COUNTY_ASSESSOR_SOURCE_ID = 'SRC-BOULDER-COUNTY-ASSESSOR' as const;
export const ADAMS_COUNTY_ASSESSOR_SOURCE_ID = 'SRC-ADAMS-COUNTY-ASSESSOR' as const;
export const ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID = 'SRC-ARAPAHOE-COUNTY-ASSESSOR' as const;
export const BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID = 'SRC-BROOMFIELD-COUNTY-ASSESSOR' as const;
export const JEFFERSON_COUNTY_ASSESSOR_SOURCE_ID = 'SRC-JEFFERSON-COUNTY-ASSESSOR' as const;
export const LARIMER_COUNTY_ASSESSOR_SOURCE_ID = 'SRC-LARIMER-COUNTY-ASSESSOR' as const;
export const WELD_COUNTY_ASSESSOR_SOURCE_ID = 'SRC-WELD-COUNTY-ASSESSOR' as const;

export const COUNTY_ASSESSOR_EXACT_SOURCE_CLASS = 'COUNTY_ASSESSOR' as const;

export const COUNTY_ASSESSOR_EXACT_SOURCE_DEFINITIONS = Object.freeze([
  {
    sourceId: BOULDER_COUNTY_ASSESSOR_SOURCE_ID,
    sourceClass: COUNTY_ASSESSOR_EXACT_SOURCE_CLASS,
    jurisdiction: { state: 'Colorado', county: 'Boulder County' },
    responsibleOrganization: 'Boulder County Assessor',
  },
  {
    sourceId: ADAMS_COUNTY_ASSESSOR_SOURCE_ID,
    sourceClass: COUNTY_ASSESSOR_EXACT_SOURCE_CLASS,
    jurisdiction: { state: 'Colorado', county: 'Adams County' },
    responsibleOrganization: "Adams County Assessor's Office",
  },
  {
    sourceId: ARAPAHOE_COUNTY_ASSESSOR_SOURCE_ID,
    sourceClass: COUNTY_ASSESSOR_EXACT_SOURCE_CLASS,
    jurisdiction: { state: 'Colorado', county: 'Arapahoe County' },
    responsibleOrganization: "Arapahoe County Assessor's Office",
  },
  {
    sourceId: BROOMFIELD_COUNTY_ASSESSOR_SOURCE_ID,
    sourceClass: COUNTY_ASSESSOR_EXACT_SOURCE_CLASS,
    jurisdiction: { state: 'Colorado', county: 'City and County of Broomfield' },
    responsibleOrganization: 'City and County of Broomfield Assessor Department',
  },
  {
    sourceId: JEFFERSON_COUNTY_ASSESSOR_SOURCE_ID,
    sourceClass: COUNTY_ASSESSOR_EXACT_SOURCE_CLASS,
    jurisdiction: { state: 'Colorado', county: 'Jefferson County' },
    responsibleOrganization: "Jefferson County Assessor's Office",
  },
  {
    sourceId: LARIMER_COUNTY_ASSESSOR_SOURCE_ID,
    sourceClass: COUNTY_ASSESSOR_EXACT_SOURCE_CLASS,
    jurisdiction: { state: 'Colorado', county: 'Larimer County' },
    responsibleOrganization: "Larimer County Assessor's Office",
  },
  {
    sourceId: WELD_COUNTY_ASSESSOR_SOURCE_ID,
    sourceClass: COUNTY_ASSESSOR_EXACT_SOURCE_CLASS,
    jurisdiction: { state: 'Colorado', county: 'Weld County' },
    responsibleOrganization: 'Weld County Assessor',
  },
] as const);

export type CountyAssessorExactSourceDefinition = (typeof COUNTY_ASSESSOR_EXACT_SOURCE_DEFINITIONS)[number];
export type CountyAssessorExactSourceId = CountyAssessorExactSourceDefinition['sourceId'];

export const COUNTY_ASSESSOR_EXACT_SOURCE_IDS = Object.freeze(
  COUNTY_ASSESSOR_EXACT_SOURCE_DEFINITIONS.map((definition) => definition.sourceId),
) as readonly CountyAssessorExactSourceId[];

export const COUNTY_ASSESSOR_EXACT_SOURCE_CLASS_BY_ID = Object.freeze(
  Object.fromEntries(COUNTY_ASSESSOR_EXACT_SOURCE_DEFINITIONS.map((definition) => [definition.sourceId, definition.sourceClass])),
) as Readonly<Record<CountyAssessorExactSourceId, typeof COUNTY_ASSESSOR_EXACT_SOURCE_CLASS>>;

export function isCountyAssessorExactSourceId(sourceId: string): sourceId is CountyAssessorExactSourceId {
  return Object.prototype.hasOwnProperty.call(COUNTY_ASSESSOR_EXACT_SOURCE_CLASS_BY_ID, sourceId);
}
