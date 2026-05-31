export type RealEstateAgentSchemaOptions = {
  url?: string;
  image?: string;
};

function buildIds(siteUrl: string) {
  return {
    organizationId: `${siteUrl}/#organization`,
    agentId: `${siteUrl}/#real-estate-agent`,
    personId: `${siteUrl}/#david-quinn`,
    websiteId: `${siteUrl}/#website`,
    reieServiceId: `${siteUrl}/#real-estate-intelligence-engine`,
    propertySearchId: `${siteUrl}/search#tool`,
    buyerStrategyId: `${siteUrl}/#buyer-strategy-service`,
    sellerStrategyId: `${siteUrl}/#seller-strategy-service`,
  };
}

function buildPlaceNodes() {
  return [
    {
      "@type": "State",
      name: "Colorado",
    },
    {
      "@type": "City",
      name: "Boulder, Colorado",
      containedInPlace: {
        "@type": "State",
        name: "Colorado",
      },
    },
    {
      "@type": "City",
      name: "Denver, Colorado",
      containedInPlace: {
        "@type": "State",
        name: "Colorado",
      },
    },
    {
      "@type": "AdministrativeArea",
      name: "Colorado Front Range",
    },
  ];
}

function buildOrganizationNode(siteUrl: string, logoUrl: string, organizationId: string, personId: string) {
  return {
    "@type": "Organization",
    "@id": organizationId,
    name: "David Quinn Group",
    legalName: "David Quinn Group",
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: logoUrl,
    },
    founder: {
      "@id": personId,
    },
  };
}

function buildWebsiteNode(siteUrl: string, websiteId: string, organizationId: string, agentId: string) {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    name: "David Quinn Group",
    url: siteUrl,
    publisher: {
      "@id": organizationId,
    },
    about: {
      "@id": agentId,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

function buildPersonNode(organizationId: string, personId: string) {
  return {
    "@type": "Person",
    "@id": personId,
    name: "David Quinn",
    jobTitle: "General Contractor and Real Estate Strategist",
    worksFor: {
      "@id": organizationId,
    },
    knowsAbout: [
      "Colorado real estate",
      "Boulder real estate",
      "Denver real estate",
      "Front Range real estate",
      "construction forensics",
      "building envelope analysis",
      "residential property intelligence",
      "market intelligence",
      "buyer strategy",
      "seller strategy",
    ],
  };
}

function buildRealEstateAgentNode({
  agentId,
  buyerStrategyId,
  organizationId,
  personId,
  propertySearchId,
  reieServiceId,
  sellerStrategyId,
  siteUrl,
  logoUrl,
}: {
  agentId: string;
  buyerStrategyId: string;
  organizationId: string;
  personId: string;
  propertySearchId: string;
  reieServiceId: string;
  sellerStrategyId: string;
  siteUrl: string;
  logoUrl: string;
}) {
  return {
    "@type": "RealEstateAgent",
    "@id": agentId,
    name: "David Quinn Group",
    legalName: "David Quinn Group",
    url: siteUrl,
    image: logoUrl,
    logo: logoUrl,
    description:
      "David Quinn Group provides Colorado real estate intelligence for Boulder, Denver, and the greater Front Range, combining property search, market context, construction forensics, neighborhood resilience, and strategic buyer and seller guidance.",
    parentOrganization: {
      "@id": organizationId,
    },
    employee: {
      "@id": personId,
    },
    areaServed: buildPlaceNodes(),
    knowsAbout: [
      "Colorado real estate",
      "Boulder real estate",
      "Denver real estate",
      "Front Range relocation",
      "residential property intelligence",
      "construction forensics",
      "building envelope analysis",
      "neighborhood resilience",
      "market intelligence",
      "property search strategy",
      "buyer strategy",
      "seller strategy",
    ],
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@id": reieServiceId,
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@id": propertySearchId,
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@id": buyerStrategyId,
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@id": sellerStrategyId,
        },
      },
    ],
  };
}

function buildReieServiceNode(agentId: string, reieServiceId: string, propertySearchId: string) {
  return {
    "@type": "Service",
    "@id": reieServiceId,
    name: "Real Estate Intelligence Engine",
    serviceType: "Colorado real estate intelligence",
    provider: {
      "@id": agentId,
    },
    areaServed: buildPlaceNodes(),
    about: [
      "Colorado property search",
      "market intelligence",
      "neighborhood intelligence",
      "construction forensics",
      "resilience scoring",
      "lifestyle efficiency",
      "buyer strategy",
      "seller strategy",
    ],
    hasPart: {
      "@id": propertySearchId,
    },
  };
}

function buildPropertySearchNode(siteUrl: string, agentId: string, propertySearchId: string, reieServiceId: string) {
  return {
    "@type": "WebApplication",
    "@id": propertySearchId,
    name: "Colorado Real Estate Search",
    url: `${siteUrl}/search`,
    applicationCategory: "RealEstateApplication",
    operatingSystem: "Web",
    description:
      "David Quinn Group live property search for Colorado homes, combining MLS inventory, map-based discovery, and real estate intelligence for Boulder, Denver, and the Front Range.",
    provider: {
      "@id": agentId,
    },
    isPartOf: {
      "@id": reieServiceId,
    },
    featureList: [
      "Colorado property search",
      "Map-based MLS inventory discovery",
      "Market intelligence context",
      "Neighborhood authority paths",
      "Construction and resilience signals",
      "Buyer and seller strategy prompts",
    ],
  };
}

function buildStrategyServiceNode(agentId: string, serviceId: string, name: string, serviceType: string) {
  return {
    "@type": "Service",
    "@id": serviceId,
    name,
    serviceType,
    provider: {
      "@id": agentId,
    },
    areaServed: buildPlaceNodes(),
  };
}

export function buildRealEstateAgentSchema(options: RealEstateAgentSchemaOptions = {}) {
  const siteUrl = options.url ?? "https://davidquinngroup.com";
  const logoUrl = options.image ?? `${siteUrl}/placeholder-home.jpg`;
  const ids = buildIds(siteUrl);

  return {
    "@context": "https://schema.org",
    "@graph": [
      buildOrganizationNode(siteUrl, logoUrl, ids.organizationId, ids.personId),
      buildWebsiteNode(siteUrl, ids.websiteId, ids.organizationId, ids.agentId),
      buildPersonNode(ids.organizationId, ids.personId),
      buildRealEstateAgentNode({
        agentId: ids.agentId,
        buyerStrategyId: ids.buyerStrategyId,
        organizationId: ids.organizationId,
        personId: ids.personId,
        propertySearchId: ids.propertySearchId,
        reieServiceId: ids.reieServiceId,
        sellerStrategyId: ids.sellerStrategyId,
        siteUrl,
        logoUrl,
      }),
      buildReieServiceNode(ids.agentId, ids.reieServiceId, ids.propertySearchId),
      buildPropertySearchNode(siteUrl, ids.agentId, ids.propertySearchId, ids.reieServiceId),
      buildStrategyServiceNode(ids.agentId, ids.buyerStrategyId, "Colorado Buyer Strategy", "Buyer representation and property intelligence"),
      buildStrategyServiceNode(ids.agentId, ids.sellerStrategyId, "Colorado Seller Strategy", "Seller representation and listing strategy"),
    ],
  };
}

export const realEstateAgentSchema = buildRealEstateAgentSchema();

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/schema/realEstateAgentSchema.ts
