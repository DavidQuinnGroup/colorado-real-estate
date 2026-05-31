export type NeighborhoodSchemaInput = {
  name: string;
  city: string;
  slug: string;
  description: string;
  url: string;
  primaryAnchor?: string;
  resilienceScore?: number;
  fireRisk?: string;
  insuranceComplexity?: string;
  altitude?: number;
  soilType?: string;
};

export type CityMarketSchemaInput = {
  name: string;
  description: string;
  url: string;
  neighborhoods?: Array<{
    name: string;
    url: string;
  }>;
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

function slugify(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function buildPropertyValue(name: string, value: string | number | null | undefined) {
  if (!hasValue(value)) return null;

  return {
    "@type": "PropertyValue",
    name,
    value,
  };
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
      "Front Range neighborhood intelligence",
      "construction forensics",
      "building envelope analysis",
      "market intelligence",
      "buyer strategy",
      "seller strategy",
    ],
  };
}

function buildAgentNode(areaName: string, knowsAbout: string[]) {
  return {
    "@type": "RealEstateAgent",
    "@id": AGENT_ID,
    name: "David Quinn Group",
    legalName: "David Quinn Group",
    url: SITE_URL,
    description:
      "David Quinn Group provides Colorado real estate intelligence for Boulder, Denver, and the greater Front Range, combining market context, neighborhood resilience, construction forensics, and buyer and seller strategy.",
    parentOrganization: {
      "@id": ORGANIZATION_ID,
    },
    employee: {
      "@id": PERSON_ID,
    },
    areaServed: [
      {
        "@type": "Place",
        name: areaName,
      },
      {
        "@type": "AdministrativeArea",
        name: "Colorado Front Range",
      },
      {
        "@type": "State",
        name: "Colorado",
      },
    ],
    knowsAbout,
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

function buildReieServiceNode(areaName: string) {
  return {
    "@type": "Service",
    "@id": REIE_SERVICE_ID,
    name: "Real Estate Intelligence Engine",
    serviceType: "Colorado real estate intelligence",
    provider: {
      "@id": AGENT_ID,
    },
    areaServed: [
      {
        "@type": "Place",
        name: areaName,
      },
      {
        "@type": "AdministrativeArea",
        name: "Colorado Front Range",
      },
    ],
    about: [
      "market intelligence",
      "neighborhood intelligence",
      "construction forensics",
      "resilience scoring",
      "lifestyle efficiency",
      "buyer strategy",
      "seller strategy",
    ],
  };
}

function buildNeighborhoodPlaceNode(input: NeighborhoodSchemaInput, placeId: string) {
  const placeName = `${input.name}, ${input.city}, Colorado`;

  return {
    "@type": "Place",
    "@id": placeId,
    name: placeName,
    url: input.url,
    description: input.description,
    containedInPlace: {
      "@type": "City",
      name: `${input.city}, Colorado`,
      containedInPlace: {
        "@type": "State",
        name: "Colorado",
      },
    },
    additionalProperty: compactArray([
      buildPropertyValue("Primary lifestyle anchor", input.primaryAnchor),
      buildPropertyValue("REIE resilience score", input.resilienceScore),
      buildPropertyValue("Fire risk", input.fireRisk),
      buildPropertyValue("Insurance complexity", input.insuranceComplexity),
      buildPropertyValue("Altitude", typeof input.altitude === "number" ? `${input.altitude} ft` : undefined),
      buildPropertyValue("Soil profile", input.soilType),
      buildPropertyValue("REIE source", "David Quinn Group Real Estate Intelligence Engine"),
    ]),
  };
}

function buildCityNode(name: string, cityId: string, url?: string) {
  return {
    "@type": "City",
    "@id": cityId,
    name: `${name}, Colorado`,
    ...(url ? { url } : {}),
    containedInPlace: {
      "@type": "State",
      name: "Colorado",
    },
  };
}

function buildNeighborhoodWebPageNode(input: NeighborhoodSchemaInput, placeId: string, webpageId: string, breadcrumbId: string) {
  return {
    "@type": "WebPage",
    "@id": webpageId,
    url: input.url,
    name: `${input.name}, ${input.city} CO Real Estate Intelligence`,
    description: input.description,
    isPartOf: {
      "@id": WEBSITE_ID,
    },
    about: [
      {
        "@id": placeId,
      },
      {
        "@id": REIE_SERVICE_ID,
      },
    ],
    mainEntity: {
      "@id": placeId,
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

function buildCityWebPageNode(input: CityMarketSchemaInput, cityId: string, webpageId: string, breadcrumbId: string) {
  return {
    "@type": "WebPage",
    "@id": webpageId,
    url: input.url,
    name: `${input.name}, CO Housing Market Intelligence`,
    description: input.description,
    isPartOf: {
      "@id": WEBSITE_ID,
    },
    about: [
      {
        "@id": cityId,
      },
      {
        "@id": REIE_SERVICE_ID,
      },
    ],
    mainEntity: {
      "@id": cityId,
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

function buildNeighborhoodBreadcrumbNode(input: NeighborhoodSchemaInput, breadcrumbId: string) {
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
        name: `${input.city} Market Intelligence`,
        item: `${SITE_URL}/market/${slugify(input.city)}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${input.name} Neighborhood Intelligence`,
        item: input.url,
      },
    ],
  };
}

function buildCityBreadcrumbNode(input: CityMarketSchemaInput, breadcrumbId: string) {
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
        name: `${input.name} Market Intelligence`,
        item: input.url,
      },
    ],
  };
}

function buildNeighborhoodItemList(input: CityMarketSchemaInput) {
  if (!input.neighborhoods?.length) return null;

  return {
    "@type": "ItemList",
    "@id": `${input.url}#neighborhoods`,
    name: `${input.name} neighborhood intelligence`,
    itemListElement: input.neighborhoods.map((neighborhood, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: neighborhood.name,
      url: neighborhood.url,
    })),
  };
}

export function buildNeighborhoodSchema(input: NeighborhoodSchemaInput) {
  const placeName = `${input.name}, ${input.city}, Colorado`;
  const placeId = `${input.url}#place`;
  const webpageId = `${input.url}#webpage`;
  const breadcrumbId = `${input.url}#breadcrumb`;
  const cityId = `${SITE_URL}/market/${slugify(input.city)}#city`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      buildOrganizationNode(),
      buildWebsiteNode(),
      buildPersonNode(),
      buildAgentNode(placeName, [
        `${input.name} real estate`,
        `${input.name} ${input.city} homes`,
        `${input.city} CO housing market`,
        `${input.city} neighborhood intelligence`,
        "Colorado construction forensics",
        "Boulder and Denver neighborhood intelligence",
        "Colorado real estate intelligence",
      ]),
      buildReieServiceNode(placeName),
      buildCityNode(input.city, cityId),
      buildNeighborhoodPlaceNode(input, placeId),
      buildNeighborhoodWebPageNode(input, placeId, webpageId, breadcrumbId),
      buildNeighborhoodBreadcrumbNode(input, breadcrumbId),
    ],
  };
}

export function buildCityMarketSchema(input: CityMarketSchemaInput) {
  const cityId = `${input.url}#city`;
  const webpageId = `${input.url}#webpage`;
  const breadcrumbId = `${input.url}#breadcrumb`;
  const neighborhoodList = buildNeighborhoodItemList(input);

  return {
    "@context": "https://schema.org",
    "@graph": compactArray([
      buildOrganizationNode(),
      buildWebsiteNode(),
      buildPersonNode(),
      buildAgentNode(`${input.name}, Colorado`, [
        `${input.name} CO real estate`,
        `${input.name} housing market`,
        `${input.name} homes for sale`,
        `${input.name} neighborhood intelligence`,
        "Colorado construction forensics",
        "Boulder and Denver market intelligence",
        "Colorado neighborhood resilience",
      ]),
      buildReieServiceNode(`${input.name}, Colorado`),
      buildCityNode(input.name, cityId, input.url),
      buildCityWebPageNode(input, cityId, webpageId, breadcrumbId),
      buildCityBreadcrumbNode(input, breadcrumbId),
      neighborhoodList,
    ]),
  };
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/schema/neighborhoodSchema.ts
