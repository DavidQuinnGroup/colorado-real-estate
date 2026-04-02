export type MarketStats = {
  slug: string
  name: string
  city: string
  county: string
  medianPrice: number
  priceChange: number
  avgDaysOnMarket: number
  inventory: number
  salesLast30: number
}

export const marketData: MarketStats[] = [
  {
    slug: "gunbarrel-boulder-co-housing-market",
    name: "Gunbarrel Housing Market",
    city: "Boulder",
    county: "Boulder County",
    medianPrice: 865000,
    priceChange: 4.8,
    avgDaysOnMarket: 18,
    inventory: 42,
    salesLast30: 26
  },
  {
    slug: "louisville-co-housing-market",
    name: "Louisville Housing Market",
    city: "Louisville",
    county: "Boulder County",
    medianPrice: 925000,
    priceChange: 5.3,
    avgDaysOnMarket: 14,
    inventory: 35,
    salesLast30: 22
  }
]