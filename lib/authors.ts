/**
 * DQG Authority Profiles.
 * Codifies verified experience, brokerage context, and E-E-A-T attribution for
 * REIE content and private strategy artifacts.
 */

export type Author = {
  slug: string;
  name: string;
  title: string;
  specialty: string;
  experienceYears: number;
  bio: string;
  city: string;
  brokerage: string;
  credentials: string[];
};

const defaultAuthorSlug = "david-quinn";

function createAuthor(author: Author): Author {
  return author;
}

function normalizeSlug(slug: string) {
  return slug.trim().toLowerCase();
}

export const authors: Author[] = [
  createAuthor({
    slug: defaultAuthorSlug,
    name: "David Quinn",
    title: "Real Estate Strategist & General Contractor",
    specialty: "High-Performance Envelopes & Investment Logistics",
    experienceYears: 30,
    city: "Boulder",
    brokerage: "Compass",
    credentials: [
      "Licensed General Contractor",
      "Alpine Summit Homes Founder",
      "Real Estate Strategic Consultant",
    ],
    bio: "David Quinn integrates a 30-year professional construction pedigree with an AI-driven real estate ecosystem. As the founder of Alpine Summit Homes, he applies a studs-out forensic logic to property valuation, identifying hidden equity and structural risks that standard aggregators miss.",
  }),
];

export function getAuthor(slug: string = defaultAuthorSlug) {
  const normalizedSlug = normalizeSlug(slug);
  return authors.find((author) => normalizeSlug(author.slug) === normalizedSlug) || null;
}

/**
 * Provides the verified attribution sentence used by automated REIE reports.
 */
export function getAuthorAttribution(slug: string = defaultAuthorSlug) {
  const author = getAuthor(slug);

  if (!author) {
    return "";
  }

  return `${author.name}, with ${author.experienceYears} years of construction expertise, verified this analysis.`;
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/authors.ts
