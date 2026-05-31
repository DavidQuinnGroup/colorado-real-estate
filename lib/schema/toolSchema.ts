export type ToolSchemaOptions = {
  name: string;
  description: string;
  url: string;
  applicationCategory?: string;
  operatingSystem?: string;
  keywords?: string[];
  audience?: string;
};

const SITE_URL = "https://davidquinngroup.com";
const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const AGENT_ID = `${SITE_URL}/#real-estate-agent`;
const PERSON_ID = `${SITE_URL}/#david-quinn`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const REIE_SERVICE_ID = `${SITE_URL}/#real-estate-intelligence-engine`;

function getKeywords(options: ToolSchemaOptions) {
  return options.keywords ?? [
    "Colorado real estate",
    "Boulder real estate",
    "Denver real estate",
    "real estate intelligence",
    "construction forensics",
    "Colorado property search",
    "David Quinn Group",
  ];
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
      "Front Range market intelligence",
      "construction forensics",
      "property search strategy",
      "buyer strategy",
      "seller strategy",
    ],
  };
}

function buildAgentNode() {
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
        "@type": "State",
        name: "Colorado",
      },
      {
        "@type": "City",
        name: "Boulder, Colorado",
      },
      {
        "@type": "City",
        name: "Denver, Colorado",
      },
      {
        "@type": "AdministrativeArea",
        name: "Colorado Front Range",
      },
    ],
    knowsAbout: [
      "Colorado real estate",
      "Boulder real estate",
      "Denver real estate",
      "Colorado property search",
      "market intelligence",
      "construction forensics",
      "buyer strategy",
      "seller strategy",
    ],
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

function buildReieServiceNode(toolId: string) {
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
        "@type": "State",
        name: "Colorado",
      },
      {
        "@type": "AdministrativeArea",
        name: "Colorado Front Range",
      },
    ],
    about: [
      "property search",
      "market intelligence",
      "construction forensics",
      "resilience scoring",
      "lifestyle efficiency",
      "buyer strategy",
      "seller strategy",
    ],
    hasPart: {
      "@id": toolId,
    },
  };
}

function buildToolNode(options: ToolSchemaOptions, toolId: string, offerId: string, webpageId: string) {
  const keywords = getKeywords(options);

  return {
    "@type": "WebApplication",
    "@id": toolId,
    name: options.name,
    description: options.description,
    url: options.url,
    applicationCategory: options.applicationCategory ?? "RealEstateApplication",
    operatingSystem: options.operatingSystem ?? "Web",
    browserRequirements: "Requires JavaScript and a modern web browser.",
    keywords,
    audience: {
      "@type": "Audience",
      audienceType: options.audience ?? "Colorado home buyers, sellers, homeowners, and relocation clients",
    },
    featureList: [
      "Colorado property search",
      "Map-based MLS inventory discovery",
      "Market intelligence context",
      "Neighborhood authority paths",
      "Construction and resilience signals",
      "Buyer and seller strategy prompts",
    ],
    provider: {
      "@id": AGENT_ID,
    },
    creator: {
      "@id": ORGANIZATION_ID,
    },
    offers: {
      "@id": offerId,
    },
    isPartOf: {
      "@id": REIE_SERVICE_ID,
    },
    mainEntityOfPage: {
      "@id": webpageId,
    },
  };
}

function buildOfferNode(toolId: string, offerId: string) {
  return {
    "@type": "Offer",
    "@id": offerId,
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    itemOffered: {
      "@id": toolId,
    },
    seller: {
      "@id": AGENT_ID,
    },
  };
}

function buildWebPageNode(options: ToolSchemaOptions, toolId: string, webpageId: string, breadcrumbId: string) {
  const keywords = getKeywords(options);

  return {
    "@type": "WebPage",
    "@id": webpageId,
    url: options.url,
    name: options.name,
    description: options.description,
    keywords,
    isPartOf: {
      "@id": WEBSITE_ID,
    },
    mainEntity: {
      "@id": toolId,
    },
    about: [
      {
        "@id": toolId,
      },
      {
        "@id": REIE_SERVICE_ID,
      },
    ],
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

function buildBreadcrumbNode(options: ToolSchemaOptions, breadcrumbId: string) {
  const isSearchPage = new URL(options.url).pathname === "/search";

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
      ...(isSearchPage
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: "Colorado Property Search",
              item: options.url,
            },
          ]
        : [
            {
              "@type": "ListItem",
              position: 2,
              name: "Real Estate Intelligence Engine",
              item: options.url,
            },
          ]),
    ],
  };
}

export function buildToolSchema(options: ToolSchemaOptions) {
  const toolId = `${options.url}#tool`;
  const offerId = `${options.url}#offer`;
  const webpageId = `${options.url}#webpage`;
  const breadcrumbId = `${options.url}#breadcrumb`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      buildOrganizationNode(),
      buildWebsiteNode(),
      buildPersonNode(),
      buildAgentNode(),
      buildReieServiceNode(toolId),
      buildToolNode(options, toolId, offerId, webpageId),
      buildOfferNode(toolId, offerId),
      buildWebPageNode(options, toolId, webpageId, breadcrumbId),
      buildBreadcrumbNode(options, breadcrumbId),
    ],
  };
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/schema/toolSchema.ts
