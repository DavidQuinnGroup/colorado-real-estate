export type MarketReport = {
  city: string
  county: string
  medianPrice: number
  priceChange: number
  avgDaysOnMarket: number
  inventory: number
  salesLast30: number
}

export const marketReports: Record<string, MarketReport> = {
  boulder: {
    city: "Boulder",
    county: "Boulder County",
    medianPrice: 1185000,
    priceChange: 4.2,
    avgDaysOnMarket: 22,
    inventory: 146,
    salesLast30: 84
  },

  louisville: {
    city: "Louisville",
    county: "Boulder County",
    medianPrice: 925000,
    priceChange: 5.3,
    avgDaysOnMarket: 14,
    inventory: 35,
    salesLast30: 22
  },

  superior: {
    city: "Superior",
    county: "Boulder County",
    medianPrice: 865000,
    priceChange: 4.7,
    avgDaysOnMarket: 16,
    inventory: 28,
    salesLast30: 19
  }
}