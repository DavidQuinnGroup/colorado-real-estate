export type PropertySchemaPhoto = {
  url: string;
};

export type PropertySchemaInput = {
  id: string;
  slug?: string | null;
  mlsId?: string | null;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  beds?: number | null;
  baths?: number | null;
  sqft?: number | null;
  lotSize?: number | null;
  yearBuilt?: number | null;
  propertyType: string;
  status: string;
  lat: number;
  lng: number;
  neighborhood?: string | null;
  subdivision?: string | null;
  description?: string | null;
  listingAgent?: string | null;
  listingOffice?: string | null;
  photos?: PropertySchemaPhoto[];
};

const SITE_URL = "https://davidquinngroup.com";
const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const AGENT_ID = `${SITE_URL}/#real-estate-agent`;
const PERSON_ID = `${SITE_URL}/#david-quinn`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const REIE_SERVICE_ID = `${SITE_URL}/#real-estate-intelligence-engine`;

function compactArray<T>(items: Array<T | null | undefined | false>) {
  return items.filter((item): item is T => Boolean(item));
}

function hasValue(value: string | number | null | undefined) {
  return value !== null && value !== undefined && value !== "";
}

function toPropertyUrl(property: PropertySchemaInput) {
  return `${SITE_URL}/properties/${property.slug || property.id}`;
}

function buildAdditionalProperty(name: string, value: string | number | null | undefined) {
  if (!hasValue(value)) return null;

  return {
    "@type": "PropertyValue",
    name,
    value,
  };
}

function buildPlaceName(property: PropertySchemaInput) {
  return `${property.city}, ${property.state}`;
}

function buildOrganizationNode() {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: "David Quinn Group",
    legalName: "David Quinn Group",
    url: SITE_URL,
    founder: {
      "@id": PERSON_ID,
    },
  };
}

function buildWebsiteNode() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: "David Quinn Group",
    url: SITE_URL,
    publisher: {
      "@id": ORGANIZATION_ID,
    },
    about: {
      "@id": AGENT_ID,
    },
  };
}

function buildPersonNode() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: "David Quinn",
    jobTitle: "General Contractor and Real Estate Strategist",
    worksFor: {
      "@id": ORGANIZATION_ID,
    },
    knowsAbout: [
      "Colorado real estate",
      "Boulder real estate",
      "Denver real estate",
      "construction forensics",
      "building envelope analysis",
      "property intelligence",
      "buyer strategy",
      "seller strategy",
    ],
  };
}

function buildAgentNode(property: PropertySchemaInput) {
  return {
    "@type": "RealEstateAgent",
    "@id": AGENT_ID,
    name: "David Quinn Group",
    legalName: "David Quinn Group",
    url: SITE_URL,
    description:
      "David Quinn Group provides Colorado real estate intelligence for Boulder, Denver, and the greater Front Range, combining property search, market context, construction forensics, and buyer and seller strategy.",
    parentOrganization: {
      "@id": ORGANIZATION_ID,
    },
    employee: {
      "@id": PERSON_ID,
    },
    areaServed: [
      {
        "@type": "City",
        name: buildPlaceName(property),
        containedInPlace: {
          "@type": "State",
          name: "Colorado",
        },
      },
      {
        "@type": "State",
        name: "Colorado",
      },
      {
        "@type": "AdministrativeArea",
        name: "Colorado Front Range",
      },
    ],
    knowsAbout: compactArray([
      `${property.city} real estate`,
      `${property.city} Colorado homes`,
      property.neighborhood ? `${property.neighborhood} real estate` : null,
      "Colorado property intelligence",
      "Colorado construction forensics",
      "residential market intelligence",
      "buyer strategy",
      "seller strategy",
    ]),
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@id": REIE_SERVICE_ID,
        },
      },
    ],
  };
}

function buildReieServiceNode(property: PropertySchemaInput) {
  return {
    "@type": "Service",
    "@id": REIE_SERVICE_ID,
    name: "Real Estate Intelligence Engine",
    serviceType: "Colorado real estate intelligence",
    provider: {
      "@id": AGENT_ID,
    },
    areaServed: compactArray([
      {
        "@type": "City",
        name: buildPlaceName(property),
      },
      property.neighborhood
        ? {
            "@type": "Place",
            name: `${property.neighborhood}, ${property.city}, ${property.state}`,
          }
        : null,
      {
        "@type": "State",
        name: "Colorado",
      },
    ]),
    about: [
      "property search",
      "market intelligence",
      "construction forensics",
      "resilience scoring",
      "buyer strategy",
      "seller strategy",
    ],
  };
}

function buildResidenceNode(property: PropertySchemaInput, propertyId: string, offerId: string, webpageId: string) {
  const image = property.photos?.map((photo) => photo.url).filter(Boolean) ?? [];

  return {
    "@type": "SingleFamilyResidence",
    "@id": propertyId,
    name: `${property.address}, ${property.city}, ${property.state}`,
    url: toPropertyUrl(property),
    ...(image.length ? { image } : {}),
    description:
      property.description ||
      `${property.address} is a ${property.city}, Colorado property analyzed through the David Quinn Group Real Estate Intelligence Engine.`,
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address,
      addressLocality: property.city,
      addressRegion: property.state,
      postalCode: property.zip,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: property.lat,
      longitude: property.lng,
    },
    numberOfRooms: property.beds ?? undefined,
    numberOfBathroomsTotal: property.baths ?? undefined,
    floorSize: property.sqft
      ? {
          "@type": "QuantitativeValue",
          value: property.sqft,
          unitCode: "FTK",
        }
      : undefined,
    lotSize: property.lotSize
      ? {
          "@type": "QuantitativeValue",
          value: property.lotSize,
          unitText: "acres",
        }
      : undefined,
    yearBuilt: property.yearBuilt ?? undefined,
    additionalProperty: compactArray([
      buildAdditionalProperty("MLS ID", property.mlsId),
      buildAdditionalProperty("Property Type", property.propertyType),
      buildAdditionalProperty("Listing Status", property.status),
      buildAdditionalProperty("Neighborhood", property.neighborhood),
      buildAdditionalProperty("Subdivision", property.subdivision),
      buildAdditionalProperty("REIE source", "David Quinn Group Real Estate Intelligence Engine"),
    ]),
    offers: {
      "@id": offerId,
    },
    provider: {
      "@id": AGENT_ID,
    },
    mainEntityOfPage: {
      "@id": webpageId,
    },
  };
}

function buildOfferNode(property: PropertySchemaInput, propertyId: string, offerId: string) {
  const isSold = property.status.toLowerCase().includes("sold");

  return {
    "@type": "Offer",
    "@id": offerId,
    price: property.price,
    priceCurrency: "USD",
    availability: isSold ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
    url: toPropertyUrl(property),
    itemOffered: {
      "@id": propertyId,
    },
    seller: property.listingOffice
      ? {
          "@type": "Organization",
          name: property.listingOffice,
        }
      : {
          "@id": AGENT_ID,
        },
  };
}

function buildWebPageNode(property: PropertySchemaInput, propertyId: string, webpageId: string, breadcrumbId: string) {
  const description =
    property.description ||
    `${property.address} real estate intelligence for ${property.city}, Colorado by David Quinn Group.`;

  return {
    "@type": "WebPage",
    "@id": webpageId,
    url: toPropertyUrl(property),
    name: `${property.address} Real Estate Intelligence`,
    description,
    isPartOf: {
      "@id": WEBSITE_ID,
    },
    about: [
      {
        "@id": propertyId,
      },
      {
        "@id": REIE_SERVICE_ID,
      },
    ],
    mainEntity: {
      "@id": propertyId,
    },
    publisher: {
      "@id": ORGANIZATION_ID,
    },
    reviewedBy: {
      "@id": AGENT_ID,
    },
    breadcrumb: {
      "@id": breadcrumbId,
    },
  };
}

function buildBreadcrumbNode(property: PropertySchemaInput, breadcrumbId: string) {
  return {
    "@type": "BreadcrumbList",
    "@id": breadcrumbId,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Colorado Real Estate",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `${property.city} Real Estate Intelligence`,
        item: `${SITE_URL}/search?city=${encodeURIComponent(property.city)}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: property.address,
        item: toPropertyUrl(property),
      },
    ],
  };
}

export function buildPropertySchema(property: PropertySchemaInput) {
  const url = toPropertyUrl(property);
  const propertyId = `${url}#property`;
  const offerId = `${url}#offer`;
  const webpageId = `${url}#webpage`;
  const breadcrumbId = `${url}#breadcrumb`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      buildOrganizationNode(),
      buildWebsiteNode(),
      buildPersonNode(),
      buildAgentNode(property),
      buildReieServiceNode(property),
      buildResidenceNode(property, propertyId, offerId, webpageId),
      buildOfferNode(property, propertyId, offerId),
      buildWebPageNode(property, propertyId, webpageId, breadcrumbId),
      buildBreadcrumbNode(property, breadcrumbId),
    ],
  };
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/schema/propertySchema.ts
