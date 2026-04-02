export type KnowledgeNode = {
  id: string
  type: "city" | "neighborhood" | "guide" | "address"
  name: string
  slug: string
  city?: string
  related?: string[]
}

export const knowledgeGraph: KnowledgeNode[] = [

  {
    id: "boulder",
    type: "city",
    name: "Boulder",
    slug: "boulder-real-estate",
    related: [
      "mapleton-hill",
      "north-boulder",
      "moving-to-boulder",
      "cost-of-living-boulder"
    ]
  },

  {
    id: "mapleton-hill",
    type: "neighborhood",
    name: "Mapleton Hill",
    slug: "neighborhoods/boulder/mapleton-hill",
    city: "boulder"
  },

  {
    id: "north-boulder",
    type: "neighborhood",
    name: "North Boulder",
    slug: "neighborhoods/boulder/north-boulder",
    city: "boulder"
  }

]