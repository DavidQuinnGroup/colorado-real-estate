import { neighborhoods, type Neighborhood } from "./neighborhoods";
import { buildArticleSchema } from "./schema/articleSchema";

export type ArticleIntent = "Lifestyle" | "Efficiency" | "Investment" | "Resilience";

export type ArticleTemplate = {
  titleTemplate: string;
  slugTemplate: string;
  intent: ArticleIntent;
};

export type ProgrammaticArticle = {
  title: string;
  slug: string;
  url: string;
  neighborhood: string;
  city: string;
  intent: ArticleIntent;
  author: string;
  experienceYears: number;
  description: string;
  contentBody: string;
  datePublished: string;
  dateModified: string;
  schema: ReturnType<typeof buildArticleSchema>;
};

const SITE_URL = "https://davidquinngroup.com";
const DEFAULT_AUTHOR = "David Quinn, GC";
const DEFAULT_EXPERIENCE_YEARS = 30;
const DEFAULT_DATE_PUBLISHED = "2026-05-01";
const DEFAULT_DATE_MODIFIED = "2026-05-23";

export const articleTemplates: ArticleTemplate[] = [
  {
    titleTemplate: "Living in [Neighborhood], [City]: The Efficiency & Lifestyle Audit",
    slugTemplate: "living-in-[neighborhood]-[city]",
    intent: "Lifestyle",
  },
  {
    titleTemplate: "Is [Neighborhood] Future-Proof? Local Resilience & Fire Risk Report",
    slugTemplate: "[neighborhood]-resilience-fire-risk",
    intent: "Resilience",
  },
  {
    titleTemplate: "Commute Impact: [Neighborhood] vs. [PrimaryAnchor] Time-Tax Analysis",
    slugTemplate: "[neighborhood]-commute-efficiency",
    intent: "Efficiency",
  },
  {
    titleTemplate: "[Neighborhood] Investment Readiness: Construction DNA & Value Risk",
    slugTemplate: "[neighborhood]-investment-readiness",
    intent: "Investment",
  },
];

function toTitleCase(value: string) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function toSlugSegment(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function generateSlug(template: ArticleTemplate, neighborhood: Neighborhood) {
  return template.slugTemplate
    .replace("[neighborhood]", neighborhood.slug)
    .replace("[city]", toSlugSegment(neighborhood.city))
    .replace("[primaryAnchor]", toSlugSegment(neighborhood.primaryAnchor));
}

function generateTitle(template: ArticleTemplate, neighborhood: Neighborhood) {
  return template.titleTemplate
    .replace("[Neighborhood]", neighborhood.name)
    .replace("[City]", toTitleCase(neighborhood.city))
    .replace("[PrimaryAnchor]", neighborhood.primaryAnchor);
}

function generateDynamicBody(neighborhood: Neighborhood, intent: ArticleIntent) {
  switch (intent) {
    case "Resilience":
      return `David Quinn Group evaluates ${neighborhood.name} through fire risk, insurance complexity, soil profile, altitude, and construction-era context. The current resilience score is ${neighborhood.resilienceScore}/100.`;
    case "Efficiency":
      return `${neighborhood.name} averages an efficiency score of ${neighborhood.avgEfficiencyScore}/100, with ${neighborhood.primaryAnchor} acting as a meaningful lifestyle and commute anchor.`;
    case "Investment":
      return `${neighborhood.name} requires a close look at construction DNA, lot quality, and replacement-cost exposure before treating surface-level comps as truth.`;
    case "Lifestyle":
      return `${neighborhood.lifestyleVibe} David Quinn Group tracks this micro-market through construction quality, time wealth, resilience, and location-specific lifestyle ROI.`;
  }
}

function generateArticleUrl(slug: string) {
  return `${SITE_URL}/articles/${slug}`;
}

function generateArticleSchema(title: string, slug: string, neighborhood: Neighborhood, intent: ArticleIntent) {
  const description = generateDynamicBody(neighborhood, intent);

  return buildArticleSchema({
    title,
    description,
    url: generateArticleUrl(slug),
    datePublished: DEFAULT_DATE_PUBLISHED,
    dateModified: DEFAULT_DATE_MODIFIED,
    section: `${intent} Real Estate Intelligence`,
    aboutName: `${neighborhood.name}, ${neighborhood.city}, Colorado`,
    city: neighborhood.city,
    neighborhood: neighborhood.name,
    keywords: [
      `${neighborhood.name} real estate`,
      `${neighborhood.name} ${neighborhood.city} homes`,
      `${neighborhood.city} real estate`,
      `${neighborhood.city} housing market`,
      `${intent.toLowerCase()} real estate intelligence`,
      "Colorado real estate",
      "David Quinn Group",
      "real estate intelligence",
    ],
  });
}

export function generateProgrammaticArticles(
  neighborhoodsList: Neighborhood[],
): ProgrammaticArticle[] {
  return neighborhoodsList.flatMap((neighborhood) =>
    articleTemplates.map((template) => {
      const title = generateTitle(template, neighborhood);
      const slug = generateSlug(template, neighborhood);
      const contentBody = generateDynamicBody(neighborhood, template.intent);
      const url = generateArticleUrl(slug);

      return {
        title,
        slug,
        url,
        neighborhood: neighborhood.name,
        city: neighborhood.city,
        intent: template.intent,
        author: DEFAULT_AUTHOR,
        experienceYears: DEFAULT_EXPERIENCE_YEARS,
        description: contentBody,
        contentBody,
        datePublished: DEFAULT_DATE_PUBLISHED,
        dateModified: DEFAULT_DATE_MODIFIED,
        schema: generateArticleSchema(title, slug, neighborhood, template.intent),
      };
    }),
  );
}

export const articles = generateProgrammaticArticles(neighborhoods);

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/articles.ts
