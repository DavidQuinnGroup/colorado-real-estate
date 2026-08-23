export const PROPERTY_CRITERIA_PROFILE_STATUS = 'PROJECT_ATLAS_PROPERTY_CRITERIA_PROFILE_FOUNDATION_MVV' as const;

export const PROPERTY_CRITERIA_CONTEXTS = ['BUYER_PREFERENCE', 'SELLER_PROPERTY_FACT', 'LISTING_PROPERTY_FACT', 'PROPERTY_REVIEW'] as const;
export const PROPERTY_CRITERIA_INTENTS = ['MUST_HAVE', 'PREFERRED', 'FLEXIBLE', 'EXCLUDE', 'OPEN_QUESTION', 'UNKNOWN'] as const;
export const PROPERTY_CRITERIA_TYPES = ['SINGLE_FAMILY', 'CONDOMINIUM', 'TOWNHOUSE', 'MULTI_FAMILY', 'MANUFACTURED_HOME', 'LAND', 'OTHER_RESIDENTIAL'] as const;
export const PROPERTY_CRITERIA_BASEMENT_OPTIONS = ['FINISHED', 'PARTIALLY_FINISHED', 'UNFINISHED', 'WALKOUT', 'GARDEN_LEVEL', 'NONE_OR_NOT_APPLICABLE'] as const;
export const PROPERTY_CRITERIA_STORY_OPTIONS = ['SINGLE_LEVEL', 'TWO_STORY', 'MULTI_LEVEL', 'MAIN_FLOOR_LIVING'] as const;
export const PROPERTY_CRITERIA_CONDITION_OPTIONS = ['TURNKEY', 'COSMETIC_WORK_ACCEPTABLE', 'RENOVATION_ACCEPTABLE', 'MAJOR_PROJECT_TOLERANCE'] as const;

export type PropertyCriteriaContext = (typeof PROPERTY_CRITERIA_CONTEXTS)[number];
export type PropertyCriteriaIntent = (typeof PROPERTY_CRITERIA_INTENTS)[number];
export type PropertyCriteriaType = (typeof PROPERTY_CRITERIA_TYPES)[number];
export type PropertyCriteriaBasementOption = (typeof PROPERTY_CRITERIA_BASEMENT_OPTIONS)[number];
export type PropertyCriteriaStoryOption = (typeof PROPERTY_CRITERIA_STORY_OPTIONS)[number];
export type PropertyCriteriaConditionOption = (typeof PROPERTY_CRITERIA_CONDITION_OPTIONS)[number];

export type PropertyCriteriaRange = Readonly<{ min: number | null; max: number | null; intent: PropertyCriteriaIntent }>;
export type PropertyCriteriaChoice<T extends string> = Readonly<{ values: readonly T[]; intent: PropertyCriteriaIntent }>;

export type PropertyCriteriaProfile = Readonly<{
  status: typeof PROPERTY_CRITERIA_PROFILE_STATUS;
  context: PropertyCriteriaContext;
  sessionOnly: true;
  persistence: false;
  customerProfile: false;
  savedSearch: false;
  providerQuery: false;
  propertyTypes: PropertyCriteriaChoice<PropertyCriteriaType>;
  bedrooms: PropertyCriteriaRange;
  bathrooms: PropertyCriteriaRange;
  squareFeet: PropertyCriteriaRange;
  garageSpaces: PropertyCriteriaRange;
  yearBuilt: PropertyCriteriaRange;
  basement: PropertyCriteriaChoice<PropertyCriteriaBasementOption>;
  lotSquareFeet: PropertyCriteriaRange;
  outdoorSpace: PropertyCriteriaChoice<'YARD' | 'PATIO' | 'DECK' | 'BALCONY' | 'FENCED_YARD'>;
  stories: PropertyCriteriaChoice<PropertyCriteriaStoryOption>;
  condition: PropertyCriteriaChoice<PropertyCriteriaConditionOption>;
  officeOrFlexSpace: PropertyCriteriaIntent;
  hoa: PropertyCriteriaIntent;
}>;

const openRange = (): PropertyCriteriaRange => Object.freeze({ min: null, max: null, intent: 'OPEN_QUESTION' });
const openChoice = <T extends string>(): PropertyCriteriaChoice<T> => Object.freeze({ values: Object.freeze([]), intent: 'OPEN_QUESTION' });

export function createPropertyCriteriaProfile(context: PropertyCriteriaContext): PropertyCriteriaProfile {
  return Object.freeze({
    status: PROPERTY_CRITERIA_PROFILE_STATUS,
    context,
    sessionOnly: true,
    persistence: false,
    customerProfile: false,
    savedSearch: false,
    providerQuery: false,
    propertyTypes: openChoice<PropertyCriteriaType>(),
    bedrooms: openRange(), bathrooms: openRange(), squareFeet: openRange(), garageSpaces: openRange(), yearBuilt: openRange(), lotSquareFeet: openRange(),
    basement: openChoice<PropertyCriteriaBasementOption>(),
    outdoorSpace: openChoice<'YARD' | 'PATIO' | 'DECK' | 'BALCONY' | 'FENCED_YARD'>(),
    stories: openChoice<PropertyCriteriaStoryOption>(),
    condition: openChoice<PropertyCriteriaConditionOption>(),
    officeOrFlexSpace: 'OPEN_QUESTION',
    hoa: 'OPEN_QUESTION',
  });
}

function finite(value: number | null) {
  return value !== null && Number.isFinite(value) ? value : null;
}

export function updatePropertyCriteriaRange(profile: PropertyCriteriaProfile, field: 'bedrooms' | 'bathrooms' | 'squareFeet' | 'garageSpaces' | 'yearBuilt' | 'lotSquareFeet', update: Partial<PropertyCriteriaRange>): PropertyCriteriaProfile {
  const current = profile[field];
  const min = finite(update.min ?? current.min);
  const max = finite(update.max ?? current.max);
  const range = Object.freeze({ min, max: min !== null && max !== null && max < min ? min : max, intent: update.intent ?? current.intent });
  return Object.freeze({ ...profile, [field]: range });
}

export function updatePropertyCriteriaChoice<T extends PropertyCriteriaType | PropertyCriteriaBasementOption | PropertyCriteriaStoryOption | PropertyCriteriaConditionOption | 'YARD' | 'PATIO' | 'DECK' | 'BALCONY' | 'FENCED_YARD'>(profile: PropertyCriteriaProfile, field: 'propertyTypes' | 'basement' | 'outdoorSpace' | 'stories' | 'condition', values: readonly T[], intent: PropertyCriteriaIntent): PropertyCriteriaProfile {
  return Object.freeze({ ...profile, [field]: Object.freeze({ values: Object.freeze([...new Set(values)]), intent }) });
}
