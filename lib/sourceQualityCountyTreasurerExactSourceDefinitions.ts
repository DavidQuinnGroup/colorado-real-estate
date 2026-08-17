export const BOULDER_COUNTY_TREASURER_SOURCE_ID = 'SRC-BOULDER-COUNTY-TREASURER' as const;
export const ARAPAHOE_COUNTY_TREASURER_SOURCE_ID = 'SRC-ARAPAHOE-COUNTY-TREASURER' as const;
export const ADAMS_COUNTY_TREASURER_SOURCE_ID = 'SRC-ADAMS-COUNTY-TREASURER' as const;

export const COUNTY_TREASURER_EXACT_SOURCE_CLASS = 'COUNTY_TREASURER' as const;

export const COUNTY_TREASURER_EXACT_SOURCE_DEFINITIONS = Object.freeze([
  {
    sourceId: BOULDER_COUNTY_TREASURER_SOURCE_ID,
    sourceClass: COUNTY_TREASURER_EXACT_SOURCE_CLASS,
    jurisdiction: { state: 'Colorado', county: 'Boulder County' },
    responsibleOrganization: 'Boulder County Treasurer',
  },
  {
    sourceId: ARAPAHOE_COUNTY_TREASURER_SOURCE_ID,
    sourceClass: COUNTY_TREASURER_EXACT_SOURCE_CLASS,
    jurisdiction: { state: 'Colorado', county: 'Arapahoe County' },
    responsibleOrganization: 'Arapahoe County Treasurer',
  },
  {
    sourceId: ADAMS_COUNTY_TREASURER_SOURCE_ID,
    sourceClass: COUNTY_TREASURER_EXACT_SOURCE_CLASS,
    jurisdiction: { state: 'Colorado', county: 'Adams County' },
    responsibleOrganization: 'Adams County Treasurer / Treasurer Division',
  },
] as const);

export type CountyTreasurerExactSourceDefinition = (typeof COUNTY_TREASURER_EXACT_SOURCE_DEFINITIONS)[number];
export type CountyTreasurerExactSourceId = CountyTreasurerExactSourceDefinition['sourceId'];

export const COUNTY_TREASURER_EXACT_SOURCE_IDS = Object.freeze(
  COUNTY_TREASURER_EXACT_SOURCE_DEFINITIONS.map((definition) => definition.sourceId),
) as readonly CountyTreasurerExactSourceId[];

export const COUNTY_TREASURER_EXACT_SOURCE_CLASS_BY_ID = Object.freeze(
  Object.fromEntries(COUNTY_TREASURER_EXACT_SOURCE_DEFINITIONS.map((definition) => [definition.sourceId, definition.sourceClass])),
) as Readonly<Record<CountyTreasurerExactSourceId, typeof COUNTY_TREASURER_EXACT_SOURCE_CLASS>>;

export function isCountyTreasurerExactSourceId(sourceId: string): sourceId is CountyTreasurerExactSourceId {
  return Object.prototype.hasOwnProperty.call(COUNTY_TREASURER_EXACT_SOURCE_CLASS_BY_ID, sourceId);
}
