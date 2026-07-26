export const GIO_AUTHORIZED_OBJECT_TYPES = [
  "STATE",
  "MUNICIPALITY",
  "NEIGHBORHOOD",
  "MARKET_AREA",
  "ZIP_CODE",
  "SUBDIVISION",
] as const;

export type GioAuthorizedObjectType = (typeof GIO_AUTHORIZED_OBJECT_TYPES)[number];

export type GioEligibilityDefaults = {
  internalUse: boolean;
  searchEligible: boolean;
  mapEligible: boolean;
  publicPageEligible: boolean;
  indexingEligible: boolean;
  propertyEnrichment: boolean;
  marketAnalytics: boolean;
};

export const GIO_SAFE_ELIGIBILITY_DEFAULTS: GioEligibilityDefaults = {
  internalUse: false,
  searchEligible: false,
  mapEligible: false,
  publicPageEligible: false,
  indexingEligible: false,
  propertyEnrichment: false,
  marketAnalytics: false,
};

export type GioObjectCreateInput = {
  objectType: GioAuthorizedObjectType;
  canonicalName: string;
  displayName: string;
  canonicalSlug: string;
};

const authorizedObjectTypeSet = new Set<string>(GIO_AUTHORIZED_OBJECT_TYPES);

export function assertGioAuthorizedObjectType(objectType: string): asserts objectType is GioAuthorizedObjectType {
  if (!authorizedObjectTypeSet.has(objectType)) {
    throw new Error(`Unauthorized GIO object type: ${objectType}`);
  }
}

export function normalizeGioLookupValue(value: string): string {
  return value.trim().toLocaleLowerCase("en-US").replace(/\s+/g, " ");
}

export function validateGioObjectCreateInput(input: GioObjectCreateInput): GioObjectCreateInput {
  assertGioAuthorizedObjectType(input.objectType);

  for (const [field, value] of Object.entries({
    canonicalName: input.canonicalName,
    displayName: input.displayName,
    canonicalSlug: input.canonicalSlug,
  })) {
    if (!value.trim()) {
      throw new Error(`GIO ${field} is required.`);
    }
  }

  return {
    ...input,
    canonicalName: input.canonicalName.trim(),
    displayName: input.displayName.trim(),
    canonicalSlug: normalizeGioLookupValue(input.canonicalSlug).replace(/\s+/g, "-"),
  };
}

export function buildGioObjectIdempotencyKey(input: GioObjectCreateInput): string {
  const validated = validateGioObjectCreateInput(input);
  return `GIO_OBJECT|${validated.objectType}|${validated.canonicalSlug}`;
}

export function assertGioEffectiveDateRange(effectiveDate?: Date, expirationDate?: Date): void {
  if (effectiveDate && expirationDate && expirationDate.getTime() < effectiveDate.getTime()) {
    throw new Error("GIO expirationDate cannot be earlier than effectiveDate.");
  }
}
