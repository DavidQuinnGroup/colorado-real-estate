import { prisma } from '../prisma.js';
const UNKNOWN_ADDRESS = 'Unknown Address';
const UNKNOWN_CITY = 'Unknown City';
const DEFAULT_STATE = 'CO';
const DEFAULT_ZIP = '00000';
const DEFAULT_PROPERTY_TYPE = 'Residential';
const DEFAULT_STATUS = 'Active';
const DEFAULT_ALTITUDE = 5280;
const DEFAULT_SOIL_TYPE = 'Front Range Mixed';
const mlsIdFields = ['ListingKey', 'ListingId', 'MlsId', 'MLSNumber', 'ListingNumber', 'Id', 'mlsid'];
function isRecord(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function field(source, key) {
    return source[key];
}
function nestedField(source, parentKey, childKey) {
    const parent = field(source, parentKey);
    return isRecord(parent) ? parent[childKey] : null;
}
function firstValue(...values) {
    for (const value of values) {
        if (value !== undefined && value !== null && value !== '')
            return value;
    }
    return null;
}
function toCleanString(value, fallback = '') {
    if (value === undefined || value === null)
        return fallback;
    const cleaned = String(value).trim();
    return cleaned || fallback;
}
function toNumber(value) {
    if (value === undefined || value === null || value === '')
        return null;
    const parsed = Number(String(value).replace(/[$,]/g, ''));
    return Number.isFinite(parsed) ? parsed : null;
}
function toInteger(value) {
    const parsed = toNumber(value);
    return parsed === null ? null : Math.round(parsed);
}
function toBoundedScore(value) {
    return Math.max(0, Math.min(100, Math.round(value)));
}
function toSlugSegment(value) {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-+/g, '-');
}
function includesAny(value, needles) {
    return needles.some((needle) => value.includes(needle));
}
function normalizeCity(value) {
    return toCleanString(value, UNKNOWN_CITY);
}
function normalizeState(value) {
    return toCleanString(value, DEFAULT_STATE).toUpperCase();
}
function normalizeZip(value) {
    return toCleanString(value, DEFAULT_ZIP);
}
function getMlsId(listing) {
    return toCleanString(firstValue(...mlsIdFields.map((key) => field(listing, key))));
}
function getAddress(listing) {
    const unitNumber = toCleanString(field(listing, 'UnitNumber'));
    const streetParts = [
        field(listing, 'StreetNumber'),
        field(listing, 'StreetDirPrefix'),
        field(listing, 'StreetName'),
        field(listing, 'StreetSuffix'),
        field(listing, 'StreetDirSuffix'),
        unitNumber ? `Unit ${unitNumber}` : null,
    ]
        .map((part) => toCleanString(part))
        .filter(Boolean);
    return toCleanString(firstValue(field(listing, 'UnparsedAddress'), field(listing, 'FullAddress'), field(listing, 'StreetAddress'), field(listing, 'Address'), streetParts.length ? streetParts.join(' ') : null), UNKNOWN_ADDRESS);
}
function buildSlug(address, city, state, mlsId) {
    const locationSlug = [address, city, state].map(toSlugSegment).filter(Boolean).join('-') || 'colorado-property';
    const idSlug = toSlugSegment(mlsId) || mlsId.toLowerCase();
    return `${locationSlug}-${idSlug}`;
}
function getBathCount(listing) {
    const explicitBaths = toNumber(firstValue(field(listing, 'BathroomsTotalInteger'), field(listing, 'BathroomsTotalDecimal'), field(listing, 'BathroomsTotal'), field(listing, 'BathsTotal'), field(listing, 'baths')));
    if (explicitBaths !== null)
        return explicitBaths;
    const full = toNumber(field(listing, 'BathroomsFull')) ?? 0;
    const half = toNumber(field(listing, 'BathroomsHalf')) ?? 0;
    const threeQuarter = toNumber(field(listing, 'BathroomsThreeQuarter')) ?? 0;
    const oneQuarter = toNumber(field(listing, 'BathroomsOneQuarter')) ?? 0;
    const calculated = full + half * 0.5 + threeQuarter * 0.75 + oneQuarter * 0.25;
    return calculated || 0;
}
function getLotSizeAcres(listing) {
    const acres = toNumber(firstValue(field(listing, 'LotSizeAcres'), field(listing, 'LotSizeArea'), field(listing, 'LotAcres')));
    if (acres !== null)
        return acres;
    const squareFeet = toNumber(firstValue(field(listing, 'LotSizeSquareFeet'), field(listing, 'LotSqFt')));
    return squareFeet === null ? null : squareFeet / 43560;
}
function isUsableCoordinate(lat, lng) {
    return (Number.isFinite(lat) &&
        Number.isFinite(lng) &&
        Math.abs(Number(lat)) <= 90 &&
        Math.abs(Number(lng)) <= 180 &&
        !(Number(lat) === 0 && Number(lng) === 0));
}
function getRawCoordinates(listing) {
    const lat = toNumber(firstValue(field(listing, 'Latitude'), field(listing, 'lat'), field(listing, 'latitude'), nestedField(listing, 'PropertyLocation', 'Latitude'), nestedField(listing, 'Coordinates', 'Latitude'), nestedField(listing, 'Coordinates', 'lat')));
    const lng = toNumber(firstValue(field(listing, 'Longitude'), field(listing, 'lng'), field(listing, 'longitude'), nestedField(listing, 'PropertyLocation', 'Longitude'), nestedField(listing, 'Coordinates', 'Longitude'), nestedField(listing, 'Coordinates', 'lng')));
    return { lat, lng };
}
function getCoordinateDiagnostics(listing, existing) {
    const raw = getRawCoordinates(listing);
    if (isUsableCoordinate(raw.lat, raw.lng)) {
        return {
            coordinates: {
                lat: Number(raw.lat),
                lng: Number(raw.lng),
            },
            source: 'listing',
        };
    }
    if (isUsableCoordinate(raw.lng, raw.lat)) {
        return {
            coordinates: {
                lat: Number(raw.lng),
                lng: Number(raw.lat),
            },
            source: 'swapped',
        };
    }
    if (existing && isUsableCoordinate(existing.lat, existing.lng)) {
        return {
            coordinates: {
                lat: existing.lat,
                lng: existing.lng,
            },
            source: 'existing',
        };
    }
    return {
        coordinates: null,
        source: 'missing',
    };
}
function getListingAgent(listing) {
    const fullName = firstValue(field(listing, 'ListAgentFullName'), field(listing, 'ListingAgentName'), field(listing, 'AgentName'));
    if (fullName)
        return toCleanString(fullName);
    const firstName = toCleanString(firstValue(field(listing, 'ListAgentFirstName'), field(listing, 'AgentFirstName')));
    const lastName = toCleanString(firstValue(field(listing, 'ListAgentLastName'), field(listing, 'AgentLastName')));
    const joined = `${firstName} ${lastName}`.trim();
    return joined || null;
}
function getDescription(listing) {
    return toCleanString(firstValue(field(listing, 'PublicRemarks'), field(listing, 'PrivateRemarks'), field(listing, 'description')), '') || null;
}
function getAltitude(listing) {
    return toInteger(firstValue(field(listing, 'Elevation'), field(listing, 'Altitude'), field(listing, 'altitude'))) ?? DEFAULT_ALTITUDE;
}
function getRoofType(description) {
    if (includesAny(description, ['standing seam', 'standing-seam']))
        return 'Standing-Seam Metal';
    if (includesAny(description, ['metal roof', 'metal roofing']))
        return 'Metal';
    if (includesAny(description, ['tile roof', 'concrete tile']))
        return 'Concrete Tile';
    if (includesAny(description, ['slate roof', 'slate roofing']))
        return 'Slate';
    if (includesAny(description, ['flat roof', 'membrane roof', 'tpo roof']))
        return 'Flat/Membrane';
    return 'Unknown';
}
function getHvacType(description) {
    if (includesAny(description, ['radiant heat', 'radiant floor', 'radiant']))
        return 'Radiant';
    if (includesAny(description, ['heat pump', 'mini split', 'mini-split']))
        return 'Heat Pump';
    if (includesAny(description, ['boiler', 'hot water heat']))
        return 'Boiler';
    if (includesAny(description, ['forced air', 'central air', 'furnace']))
        return 'Forced Air';
    return 'Unknown';
}
function getElectricalAmperage(description) {
    if (includesAny(description, ['400 amp', '400-amp', '400a']))
        return 400;
    if (includesAny(description, ['320 amp', '320-amp', '320a']))
        return 320;
    if (includesAny(description, ['200 amp', '200-amp', '200a']))
        return 200;
    if (includesAny(description, ['150 amp', '150-amp', '150a']))
        return 150;
    if (includesAny(description, ['100 amp', '100-amp', '100a']))
        return 100;
    return null;
}
function getFinishGrade(description) {
    if (includesAny(description, ['architect designed', 'architect-designed', 'bespoke', 'designer', 'custom home'])) {
        return 'Designer-Grade';
    }
    if (includesAny(description, ['remodeled', 'renovated', 'updated', 'luxury finishes'])) {
        return 'Updated';
    }
    if (includesAny(description, ['fixer', 'as-is', 'as is', 'needs work'])) {
        return 'Needs Review';
    }
    return 'Unverified';
}
function getSoilType(description) {
    if (includesAny(description, ['expansive soil', 'bentonite', 'heaving soil']))
        return 'Expansive/Bentonite Risk';
    if (includesAny(description, ['rock outcropping', 'bedrock', 'mountain lot']))
        return 'Foothills Rock/Drainage Review';
    if (includesAny(description, ['floodplain', 'wetland', 'drainage']))
        return 'Drainage/Floodplain Review';
    return DEFAULT_SOIL_TYPE;
}
function getEfficiencyScore(description, yearBuilt) {
    if (includesAny(description, ['net zero', 'passive house', 'passivhaus']))
        return 95;
    if (includesAny(description, ['solar', 'geothermal', 'heat pump', 'mini split', 'mini-split']))
        return 82;
    if (includesAny(description, ['high efficiency', 'energy star', 'leed', 'hers']))
        return 76;
    if (yearBuilt && yearBuilt >= 2020)
        return 68;
    if (yearBuilt && yearBuilt >= 2000)
        return 54;
    return 0;
}
function getResilienceScore(description, yearBuilt, altitude, hasPolybutyleneRisk) {
    let score = 85;
    if (hasPolybutyleneRisk)
        score -= 25;
    if (includesAny(description, ['class 4 roof', 'impact resistant', 'fire resistant', 'defensible space']))
        score += 8;
    if (includesAny(description, ['needs work', 'fixer', 'as-is', 'as is', 'deferred maintenance']))
        score -= 12;
    if (yearBuilt && yearBuilt < 1980)
        score -= 6;
    if (altitude > 6500)
        score -= 4;
    return toBoundedScore(score);
}
function buildForensics(listing, description, yearBuilt) {
    const normalizedDescription = (description || '').toLowerCase();
    const altitude = getAltitude(listing);
    const hasPolybutyleneRisk = includesAny(normalizedDescription, ['polybutylene', 'quest piping']);
    const roofType = getRoofType(normalizedDescription);
    const hvacType = getHvacType(normalizedDescription);
    const electricalAmperage = getElectricalAmperage(normalizedDescription);
    const finishGrade = getFinishGrade(normalizedDescription);
    const soilType = getSoilType(normalizedDescription);
    const efficiencyScore = toBoundedScore(getEfficiencyScore(normalizedDescription, yearBuilt));
    const resilienceScore = getResilienceScore(normalizedDescription, yearBuilt, altitude, hasPolybutyleneRisk);
    return {
        altitude,
        efficiencyScore,
        gcForensics: {
            altitude,
            electricalAmperage,
            finishGrade,
            hasHighAltitudeRisk: altitude > 6500,
            hasPolybutyleneRisk,
            hvacType,
            roofType,
            soilType,
        },
        hasPolybutyleneRisk,
        resilienceScore,
        soilType,
    };
}
function normalizeStatus(listing) {
    return toCleanString(firstValue(field(listing, 'StandardStatus'), field(listing, 'MlsStatus'), field(listing, 'Status')), DEFAULT_STATUS);
}
function buildPropertyData(listing, existing, syncedAt) {
    return buildPropertyRecordWithDiagnostics(listing, existing, syncedAt).propertyData;
}
export function buildPropertyRecordWithDiagnostics(listing, existing = null, syncedAt = new Date()) {
    const mlsId = getMlsId(listing);
    const address = getAddress(listing);
    const city = normalizeCity(firstValue(field(listing, 'City'), field(listing, 'city')));
    const state = normalizeState(firstValue(field(listing, 'StateOrProvince'), field(listing, 'State'), field(listing, 'state')));
    const zip = normalizeZip(firstValue(field(listing, 'PostalCode'), field(listing, 'Zip'), field(listing, 'zip')));
    const description = getDescription(listing);
    const yearBuilt = toInteger(firstValue(field(listing, 'YearBuilt'), field(listing, 'EffectiveYearBuilt')));
    const intelligence = buildForensics(listing, description, yearBuilt);
    const coordinateDiagnostics = getCoordinateDiagnostics(listing, existing);
    const coordinates = coordinateDiagnostics.coordinates;
    const slug = mlsId && mlsId !== 'undefined' ? existing?.slug || buildSlug(address, city, state, mlsId) : null;
    const price = toInteger(firstValue(field(listing, 'ListPrice'), field(listing, 'CurrentPrice'), field(listing, 'price'))) ?? 0;
    const beds = toNumber(firstValue(field(listing, 'BedroomsTotal'), field(listing, 'BedsTotal'), field(listing, 'beds'))) ?? 0;
    const baths = getBathCount(listing);
    const sqft = toInteger(firstValue(field(listing, 'LivingArea'), field(listing, 'BuildingAreaTotal'), field(listing, 'AboveGradeFinishedArea')));
    const propertyType = toCleanString(firstValue(field(listing, 'PropertyType'), field(listing, 'PropertySubType')), DEFAULT_PROPERTY_TYPE);
    const status = normalizeStatus(listing);
    const skipReason = !mlsId || mlsId === 'undefined' ? 'missing_mls_id' : !coordinates ? 'missing_coordinates' : undefined;
    const diagnostics = {
        canUpsert: !skipReason,
        ...(skipReason ? { skipReason } : {}),
        mlsId: mlsId && mlsId !== 'undefined' ? mlsId : null,
        address,
        city,
        state,
        zip,
        slug,
        status,
        coordinatesSource: coordinateDiagnostics.source,
        usedExistingCoordinates: coordinateDiagnostics.source === 'existing',
        swappedCoordinates: coordinateDiagnostics.source === 'swapped',
        hasUsableCoordinates: Boolean(coordinates),
        price,
        beds,
        baths,
        sqft,
        yearBuilt,
        propertyType,
        intelligence,
    };
    if (!diagnostics.canUpsert || !coordinates || !mlsId || !slug) {
        return {
            diagnostics,
            propertyData: null,
        };
    }
    const propertyData = {
        mlsId,
        slug,
        address,
        city,
        state,
        zip,
        price,
        beds,
        baths,
        sqft,
        lotSize: getLotSizeAcres(listing),
        yearBuilt,
        propertyType,
        status,
        lat: coordinates.lat,
        lng: coordinates.lng,
        neighborhood: toCleanString(firstValue(field(listing, 'Neighborhood'), field(listing, 'MLSAreaMajor'), field(listing, 'Area')), '') || null,
        subdivision: toCleanString(firstValue(field(listing, 'SubdivisionName'), field(listing, 'Subdivision'), field(listing, 'SubArea')), '') || null,
        schoolDistrict: toCleanString(firstValue(field(listing, 'HighSchoolDistrict'), field(listing, 'SchoolDistrict'), field(listing, 'ElementarySchoolDistrict')), '') || null,
        description,
        listingAgent: getListingAgent(listing),
        listingOffice: toCleanString(firstValue(field(listing, 'ListOfficeName'), field(listing, 'ListingOfficeName'), field(listing, 'OfficeName')), '') || null,
        gcForensics: intelligence.gcForensics,
        efficiencyScore: intelligence.efficiencyScore,
        resilienceScore: intelligence.resilienceScore,
        altitude: intelligence.altitude,
        soilType: intelligence.soilType,
        hasPolybutyleneRisk: intelligence.hasPolybutyleneRisk,
        lastIntelligenceSync: syncedAt,
    };
    return {
        diagnostics,
        propertyData,
    };
}
async function getExistingProperty(mlsId) {
    return prisma.property.findUnique({
        where: {
            mlsId,
        },
        select: {
            id: true,
            lat: true,
            lng: true,
            slug: true,
        },
    });
}
export function buildPropertyRecord(listing, existing = null) {
    return buildPropertyData(listing, existing, new Date());
}
export function getUpsertListingDiagnostics(listing, existing = null) {
    return buildPropertyRecordWithDiagnostics(listing, existing).diagnostics;
}
export async function upsertListing(listing) {
    const mlsId = getMlsId(listing);
    if (!mlsId || mlsId === 'undefined') {
        console.error('MLS listing missing unique MLS ID.');
        return null;
    }
    const existing = await getExistingProperty(mlsId);
    const syncedAt = new Date();
    const { diagnostics, propertyData } = buildPropertyRecordWithDiagnostics(listing, existing, syncedAt);
    if (!propertyData) {
        if (diagnostics.skipReason === 'missing_coordinates') {
            console.warn(`MLS listing ${mlsId} skipped because it has no usable coordinates.`);
        }
        return null;
    }
    return prisma.property.upsert({
        where: {
            mlsId,
        },
        create: propertyData,
        update: {
            ...propertyData,
            mlsId,
            lastIntelligenceSync: syncedAt,
        },
    });
}
// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/upsertListing.ts
