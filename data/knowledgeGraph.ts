export type KnowledgeNodeType = "city" | "neighborhood" | "guide" | "address";

export type KnowledgeNode = {
  id: string;
  type: KnowledgeNodeType;
  name: string;
  slug: string;
  city?: string;
  related?: string[];
};

export const knowledgeGraph: KnowledgeNode[] = [
  {
    id: "boulder",
    type: "city",
    name: "Boulder",
    slug: "boulder-co-housing-market",
    related: [
      "mapleton-hill",
      "north-boulder",
      "moving-to-boulder",
      "cost-of-living-boulder",
    ],
  },
  {
    id: "mapleton-hill",
    type: "neighborhood",
    name: "Mapleton Hill",
    slug: "neighborhoods/boulder/mapleton-hill",
    city: "boulder",
    related: ["boulder", "north-boulder", "moving-to-boulder"],
  },
  {
    id: "north-boulder",
    type: "neighborhood",
    name: "North Boulder",
    slug: "neighborhoods/boulder/north-boulder",
    city: "boulder",
    related: ["boulder", "mapleton-hill", "cost-of-living-boulder"],
  },
  {
    id: "moving-to-boulder",
    type: "guide",
    name: "Moving to Boulder",
    slug: "guides/boulder/moving-to",
    city: "boulder",
    related: ["boulder", "mapleton-hill", "north-boulder"],
  },
  {
    id: "cost-of-living-boulder",
    type: "guide",
    name: "Cost of Living in Boulder",
    slug: "guides/boulder/cost-of-living",
    city: "boulder",
    related: ["boulder", "north-boulder", "mapleton-hill"],
  },
];

// data/knowledgeGraph.ts
