export type Neighborhood = {
  slug: string
  city: string
  name: string
  medianPrice: number
  description: string
  lat: number
  lng: number
  featured?: boolean
  nearby?: string[]
}

export const neighborhoods: Neighborhood[] = [
  {
    slug: "mapleton-hill",
    city: "boulder",
    name: "Mapleton Hill",
    medianPrice: 2200000,
    description:
      "Historic homes near downtown Boulder with large lots and tree-lined streets.",
    lat: 40.0226,
    lng: -105.2833,
    nearby: ["newlands", "north-boulder"]
  },
  {
    slug: "north-boulder",
    city: "boulder",
    name: "North Boulder",
    medianPrice: 1450000,
    description:
      "Family-friendly neighborhood with parks, schools, and quick access to trails.",
    lat: 40.039,
    lng: -105.275,
    nearby: ["mapleton-hill"]
  }
]