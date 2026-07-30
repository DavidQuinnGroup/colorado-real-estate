import { cities } from "@/lib/cities";
import { getBlogLinks } from "@/lib/linking/getBlogLinks";
import { neighborhoods, type Neighborhood } from "@/lib/neighborhoods";

export type LinkNodeType = "neighborhood" | "city-market" | "search" | "lifestyle" | "article-brief";

export type LinkNode = {
  title: string;
  href: string;
  type: LinkNodeType;
  description: string;
};

type NeighborhoodSchema = {
  "@context": "https://schema.org";
  "@type": "Place";
  name: string;
  description: string;
  address: {
    "@type": "PostalAddress";
    addressLocality: string;
    addressRegion: "CO";
  };
  potentialAction: {
    "@type": "SearchAction";
    target: string;
    "query-input": string;
  };
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function getCityMarketSlug(cityName: string) {
  const city = cities.find((item) => normalize(item.name) === normalize(cityName));
  return city?.marketSlug ?? `${normalize(cityName).replace(/\s+/g, "-")}-co-housing-market`;
}

function getNeighborhoodHref(neighborhood: Neighborhood) {
  return `/market/${normalize(neighborhood.city)}/${neighborhood.slug}`;
}

export function buildLinkGraph(currentSlug: string): LinkNode[] {
  const current = neighborhoods.find((neighborhood) => neighborhood.slug === currentSlug);

  if (!current) {
    return [];
  }

  const links: LinkNode[] = [];
  const peerNeighborhoods = neighborhoods
    .filter(
      (neighborhood) =>
        normalize(neighborhood.city) === normalize(current.city) &&
        neighborhood.slug !== current.slug,
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  for (const peer of peerNeighborhoods.slice(0, 3)) {
    links.push({
      title: `${peer.name} Neighborhood Intelligence`,
      href: getNeighborhoodHref(peer),
      type: "neighborhood",
      description: `${peer.primaryAnchor} / related neighborhood context / property verification path`,
    });
  }

  links.push({
    title: `${current.city} Real Estate Strategy & Market Pulse`,
    href: `/market/${getCityMarketSlug(current.city)}`,
    type: "city-market",
    description: "City-level pricing, inventory, local context, and verification path",
  });

  const articleBriefs = getBlogLinks({
    city: current.city,
    neighborhood: current.name,
    limit: 2,
  });

  for (const article of articleBriefs) {
    links.push({
      title: article.title,
      href: article.href,
      type: "article-brief",
      description: article.description,
    });
  }

  if (current.primaryAnchor) {
    links.push({
      title: `Properties near ${current.primaryAnchor}`,
      href: `/search?anchor=${encodeURIComponent(current.primaryAnchor)}`,
      type: "search",
      description: "Map-based inventory search tied to the local place anchor",
    });
  }

  const crossCityNeighborhoods = neighborhoods
    .filter((neighborhood) => normalize(neighborhood.city) !== normalize(current.city))
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 2);

  for (const neighborhood of crossCityNeighborhoods) {
    links.push({
      title: `Exploring Context in ${neighborhood.name}`,
      href: getNeighborhoodHref(neighborhood),
      type: "lifestyle",
      description: `${neighborhood.city} local context and construction intelligence`,
    });
  }

  return links;
}

export function generateNeighborhoodSchema(neighborhood: Neighborhood): NeighborhoodSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    name: neighborhood.name,
    description: neighborhood.lifestyleVibe,
    address: {
      "@type": "PostalAddress",
      addressLocality: neighborhood.city,
      addressRegion: "CO",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `https://davidquinngroup.com/search?q=${encodeURIComponent(neighborhood.slug)}`,
      "query-input": "required name=search_term_string",
    },
  };
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/linking/buildLinkGraph.ts
