export type FAQItem = {
  question: string;
  answer: string;
};

export type FAQSchemaOptions = {
  faqs: FAQItem[];
  pageUrl?: string;
};

const SITE_URL = "https://davidquinngroup.com";
const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const AGENT_ID = `${SITE_URL}/#real-estate-agent`;
const PERSON_ID = `${SITE_URL}/#david-quinn`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const REIE_SERVICE_ID = `${SITE_URL}/#real-estate-intelligence-engine`;

function cleanText(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function normalizeFaqs(faqs: FAQItem[]) {
  return faqs
    .map((faq) => ({
      question: cleanText(faq.question),
      answer: cleanText(faq.answer),
    }))
    .filter((faq) => faq.question.length > 0 && faq.answer.length > 0);
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
      "market intelligence",
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
        "@type": "AdministrativeArea",
        name: "Colorado Front Range",
      },
    ],
    knowsAbout: [
      "Colorado real estate",
      "Boulder real estate",
      "Denver real estate",
      "construction forensics",
      "residential property intelligence",
      "buyer strategy",
      "seller strategy",
    ],
  };
}

function buildReieServiceNode() {
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
      "buyer strategy",
      "seller strategy",
    ],
  };
}

function buildQuestionNode(faq: { question: string; answer: string }, pageUrl: string | undefined, index: number) {
  return {
    "@type": "Question",
    ...(pageUrl ? { "@id": `${pageUrl}#faq-question-${index + 1}` } : {}),
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
      author: {
        "@id": AGENT_ID,
      },
    },
  };
}

function buildFaqPageNode(normalizedFaqs: ReturnType<typeof normalizeFaqs>, pageUrl?: string) {
  return {
    "@type": "FAQPage",
    ...(pageUrl
      ? {
          "@id": `${pageUrl}#faq`,
          url: pageUrl,
          isPartOf: {
            "@id": `${pageUrl}#webpage`,
          },
        }
      : {}),
    mainEntity: normalizedFaqs.map((faq, index) => buildQuestionNode(faq, pageUrl, index)),
    about: {
      "@id": REIE_SERVICE_ID,
    },
    publisher: {
      "@id": ORGANIZATION_ID,
    },
    reviewedBy: {
      "@id": AGENT_ID,
    },
  };
}

function buildWebPageNode(pageUrl: string) {
  return {
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    isPartOf: {
      "@id": WEBSITE_ID,
    },
    hasPart: {
      "@id": `${pageUrl}#faq`,
    },
    about: {
      "@id": REIE_SERVICE_ID,
    },
    publisher: {
      "@id": ORGANIZATION_ID,
    },
    reviewedBy: {
      "@id": AGENT_ID,
    },
  };
}

export function buildFAQSchema({ faqs, pageUrl }: FAQSchemaOptions) {
  const normalizedFaqs = normalizeFaqs(faqs);
  const faqPage = buildFaqPageNode(normalizedFaqs, pageUrl);

  if (!pageUrl) {
    return {
      "@context": "https://schema.org",
      ...faqPage,
    };
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      buildOrganizationNode(),
      buildWebsiteNode(),
      buildPersonNode(),
      buildAgentNode(),
      buildReieServiceNode(),
      buildWebPageNode(pageUrl),
      faqPage,
    ],
  };
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/schema/faqSchema.ts
