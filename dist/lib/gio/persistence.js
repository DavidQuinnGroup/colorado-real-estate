export const GIO_AUTHORIZED_OBJECT_TYPES = [
    "MUNICIPALITY",
    "NEIGHBORHOOD",
    "MARKET_AREA",
    "ZIP_CODE",
    "SUBDIVISION",
];
export const GIO_SAFE_ELIGIBILITY_DEFAULTS = {
    internalUse: false,
    searchEligible: false,
    mapEligible: false,
    publicPageEligible: false,
    indexingEligible: false,
    propertyEnrichment: false,
    marketAnalytics: false,
};
const authorizedObjectTypeSet = new Set(GIO_AUTHORIZED_OBJECT_TYPES);
export function assertGioAuthorizedObjectType(objectType) {
    if (!authorizedObjectTypeSet.has(objectType)) {
        throw new Error(`Unauthorized GIO object type: ${objectType}`);
    }
}
export function normalizeGioLookupValue(value) {
    return value.trim().toLocaleLowerCase("en-US").replace(/\s+/g, " ");
}
export function validateGioObjectCreateInput(input) {
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
export function buildGioObjectIdempotencyKey(input) {
    const validated = validateGioObjectCreateInput(input);
    return `GIO_OBJECT|${validated.objectType}|${validated.canonicalSlug}`;
}
export function assertGioEffectiveDateRange(effectiveDate, expirationDate) {
    if (effectiveDate && expirationDate && expirationDate.getTime() < effectiveDate.getTime()) {
        throw new Error("GIO expirationDate cannot be earlier than effectiveDate.");
    }
}
