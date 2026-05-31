export type ArticleSchemaOptions = {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  section?: string;
  keywords?: string[];
  aboutName?: string;
  city?: string;
  neighborhood?: string;
};

const SITE_URL = "https://davidquinngroup.com";
const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const AGENT_ID = `${SITE_URL}/#real-estate-agent`;
const AUTHOR_ID = `${SITE_URL}/#david-quinn`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const REIE_SERVICE_ID = `${SITE_URL}/#real-estate-intelligence-engine`;

function compactArray<T>(items: Array<T | null | undefined | false>) {
  return items.filter((item): item is T => Boolean(item));
}

function slugify(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function getImageUrl(options: ArticleSchemaOptions) {
  return options.image ?? `${SITE_URL}/placeholder-home.jpg`;
}

function getKeywords(options: ArticleSchemaOptions) {
  return options.keywords ?? [
    "Colorado real estate",
    "Boulder real estate",
    "Denver real estate",
    "David Quinn Group",
    "real estate intelligence",
    "construction forensics",
  ];
}

function buildOrganizationNode(imageUrl: string) {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: "David Quinn Group",
    legalName: "David Quinn Group",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: imageUrl,
    },
    founder: {
      "@id": AUTHOR_ID,
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

function buildAgentNode(options: ArticleSchemaOptions) {
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
      "@id": AUTHOR_ID,
    },
    areaServed: compactArray([
      options.city
        ? {
            "@type": "City",
            name: `${options.city}, Colorado`,
          }
        : null,
      {
        "@type": "AdministrativeArea",
        name: "Colorado Front Range",
      },
      {
        "@type": "State",
        name: "Colorado",
      },
    ]),
    knowsAbout: compactArray([
      options.city ? `${options.city} real estate` : null,
      options.neighborhood ? `${options.neighborhood} real estate` : null,
      "Colorado real estate",
      "Boulder real estate",
      "Denver real estate",
      "construction forensics",
      "market intelligence",
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

function buildAuthorNode() {
  return {
    "@type": "Person",
    "@id": AUTHOR_ID,
    name: "David Quinn",
    jobTitle: "General Contractor and Real Estate Strategist",
    worksFor: {
      "@id": ORGANIZATION_ID,
    },
    knowsAbout: [
      "Colorado real estate",
      "construction forensics",
      "Boulder real estate",
      "Denver real estate",
      "Front Range market intelligence",
      "neighborhood resilience",
      "building envelope analysis",
      "buyer strategy",
      "seller strategy",
    ],
  };
}

function buildReieServiceNode(options: ArticleSchemaOptions) {
  return {
    "@type": "Service",
    "@id": REIE_SERVICE_ID,
    name: "Real Estate Intelligence Engine",
    serviceType: "Colorado real estate intelligence",
    provider: {
      "@id": AGENT_ID,
    },
    areaServed: compactArray([
      options.city
        ? {
            "@type": "City",
            name: `${options.city}, Colorado`,
          }
        : null,
      options.neighborhood && options.city
        ? {
            "@type": "Place",
            name: `${options.neighborhood}, ${options.city}, Colorado`,
          }
        : null,
      {
        "@type": "AdministrativeArea",
        name: "Colorado Front Range",
      },
    ]),
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

function buildAboutNode(options: ArticleSchemaOptions) {
  const aboutId = `${options.url}#about`;

  if (options.city) {
    return {
      "@type": "Place",
      "@id": aboutId,
      name: options.aboutName ?? `${options.city}, Colorado real estate intelligence`,
      address: {
        "@type": "PostalAddress",
        addressLocality: options.city,
        addressRegion: "CO",
        addressCountry: "US",
      },
      containedInPlace: {
        "@type": "State",
        name: "Colorado",
      },
    };
  }

  return {
    "@type": "Thing",
    "@id": aboutId,
    name: options.aboutName ?? "Colorado real estate intelligence",
  };
}

function buildArticleNode(options: ArticleSchemaOptions, articleId: string, webpageId: string, aboutId: string, imageUrl: string) {
  return {
    "@type": "Article",
    "@id": articleId,
    headline: options.title,
    description: options.description,
    mainEntityOfPage: {
      "@id": webpageId,
    },
    image: imageUrl,
    datePublished: options.datePublished,
    dateModified: options.dateModified ?? options.datePublished,
    articleSection: options.section ?? "Colorado Real Estate Intelligence",
    keywords: getKeywords(options),
    author: {
      "@id": AUTHOR_ID,
    },
    publisher: {
      "@id": ORGANIZATION_ID,
    },
    about: [
      {
        "@id": aboutId,
      },
      {
        "@id": REIE_SERVICE_ID,
      },
    ],
  };
}

function buildWebPageNode(options: ArticleSchemaOptions, articleId: string, webpageId: string, aboutId: string, breadcrumbId: string) {
  return {
    "@type": "WebPage",
    "@id": webpageId,
    url: options.url,
    name: options.title,
    description: options.description,
    isPartOf: {
      "@id": WEBSITE_ID,
    },
    mainEntity: {
      "@id": articleId,
    },
    about: [
      {
        "@id": aboutId,
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

function buildBreadcrumbNode(options: ArticleSchemaOptions, breadcrumbId: string) {
  return {
    "@type": "BreadcrumbList",
    "@id": breadcrumbId,
    itemListElement: compactArray([
      {
        "@type": "ListItem",
        position: 1,
        name: "Colorado Real Estate",
        item: SITE_URL,
      },
      options.city
        ? {
            "@type": "ListItem",
            position: 2,
            name: `${options.city} Market Intelligence`,
            item: `${SITE_URL}/market/${slugify(options.city)}`,
          }
        : {
            "@type": "ListItem",
            position: 2,
            name: "Real Estate Intelligence",
            item: `${SITE_URL}/articles`,
          },
      {
        "@type": "ListItem",
        position: 3,
        name: options.title,
        item: options.url,
      },
    ]),
  };
}

export function buildArticleSchema(options: ArticleSchemaOptions) {
  const imageUrl = getImageUrl(options);
  const articleId = `${options.url}#article`;
  const webpageId = `${options.url}#webpage`;
  const breadcrumbId = `${options.url}#breadcrumb`;
  const aboutNode = buildAboutNode(options);

  return {
    "@context": "https://schema.org",
    "@graph": [
      buildOrganizationNode(imageUrl),
      buildWebsiteNode(),
      buildAgentNode(options),
      buildAuthorNode(),
      buildReieServiceNode(options),
      aboutNode,
      buildArticleNode(options, articleId, webpageId, aboutNode["@id"], imageUrl),
      buildWebPageNode(options, articleId, webpageId, aboutNode["@id"], breadcrumbId),
      buildBreadcrumbNode(options, breadcrumbId),
    ],
  };
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/schema/articleSchema.ts
