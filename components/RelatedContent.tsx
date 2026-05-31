import Link from "next/link";

import { cities } from "@/lib/cities";
import { getRelatedNodes, type RelatedKnowledgeNode } from "@/lib/knowledgeGraph";
import type { LinkNode } from "@/lib/linking/buildLinkGraph";
import { neighborhoods } from "@/lib/neighborhoods";

type RelatedContentItem = RelatedKnowledgeNode | LinkNode;

type RelatedContentProps = {
  nodeId: string;
  title?: string;
  items?: RelatedContentItem[];
};

function normalize(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

function getCityMarketHref(node: RelatedKnowledgeNode) {
  const city = cities.find(
    (item) => normalize(item.name) === normalize(node.name) || normalize(item.slug) === normalize(node.slug),
  );

  if (city) {
    return `/market/${city.marketSlug}`;
  }

  return `/search?city=${encodeURIComponent(node.name)}`;
}

function getNeighborhoodHref(node: RelatedKnowledgeNode) {
  const city = node.city ?? node.slug.split("/")[1] ?? "";
  const slug = node.slug.split("/").at(-1) ?? node.slug;
  const neighborhood = neighborhoods.find(
    (item) => normalize(item.city) === normalize(city) && normalize(item.slug) === normalize(slug),
  );

  if (neighborhood) {
    return `/market/${normalize(neighborhood.city)}/${neighborhood.slug}`;
  }

  return `/search?city=${encodeURIComponent(city || node.name)}`;
}

function isLinkNode(node: RelatedContentItem): node is LinkNode {
  return "href" in node;
}

function getNodeHref(node: RelatedContentItem) {
  if (isLinkNode(node)) {
    return node.href;
  }

  if (node.type === "city") {
    return getCityMarketHref(node);
  }

  if (node.type === "neighborhood") {
    return getNeighborhoodHref(node);
  }

  return `/search?q=${encodeURIComponent(node.name)}`;
}

function getNodeTitle(node: RelatedContentItem) {
  return isLinkNode(node) ? node.title : node.name;
}

function getNodeDescription(node: RelatedContentItem) {
  if (isLinkNode(node)) {
    if (node.type === "article-brief") {
      return `REIE strategy brief / ${node.description}`;
    }

    if (node.type === "city-market") {
      return `City market report / ${node.description}`;
    }

    return node.description;
  }

  if (node.type === "city") {
    return "City market report and local real estate intelligence";
  }

  if (node.type === "neighborhood") {
    return "Neighborhood authority report and resilience context";
  }

  if (node.type === "address") {
    return "Address-level property intelligence";
  }

  return "Related real estate search and guide context";
}

function getNodeAction(node: RelatedContentItem) {
  if (isLinkNode(node)) {
    if (node.type === "article-brief") {
      return "Brief";
    }

    if (node.type === "search") {
      return "Search";
    }

    return "Open";
  }

  if (node.type === "guide") {
    return "Guide";
  }

  return "Open";
}

function getNodeKey(node: RelatedContentItem) {
  if (isLinkNode(node)) {
    return `${node.type}-${node.href}`;
  }

  return node.id;
}

export default function RelatedContent({
  nodeId,
  title = "Related Real Estate Guides",
  items,
}: RelatedContentProps) {
  const related = items ?? getRelatedNodes(nodeId);

  if (!related.length) {
    return null;
  }

  return (
    <section className="mt-16 border border-white/10 bg-[#050505] p-6 text-white">
      <div className="mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#00ff80]">
          Knowledge Graph Links
        </p>
        <h3 className="mt-2 text-2xl font-black uppercase italic tracking-tight">
          {title}
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-2">
        {related.map((item) => (
          <Link
            key={getNodeKey(item)}
            href={getNodeHref(item)}
            className="group bg-black p-5 transition-colors hover:bg-white/[0.04]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-base font-black uppercase italic tracking-tight text-white">
                  {getNodeTitle(item)}
                </p>
                <p className="mt-2 text-[10px] font-bold uppercase leading-5 tracking-[0.18em] text-white/30">
                  {getNodeDescription(item)}
                </p>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#00ff80] opacity-70 transition-opacity group-hover:opacity-100">
                {getNodeAction(item)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/RelatedContent.tsx
