export function calculateMarketHealth(
  priceGrowth: number,
  inventory: number,
  daysOnMarket: number
) {

  const priceScore = Math.min(Math.max(priceGrowth * 10, 0), 40)

  const inventoryScore =
    inventory < 300 ? 30 :
    inventory < 500 ? 20 :
    inventory < 700 ? 10 : 5

  const domScore =
    daysOnMarket < 25 ? 30 :
    daysOnMarket < 40 ? 20 :
    daysOnMarket < 60 ? 10 : 5

  return Math.round(priceScore + inventoryScore + domScore)
}


export function calculateAbsorptionRate(
  inventory: number,
  monthlySales: number
) {
  return inventory / monthlySales
}


export function calculateDemandIndex(
  pendingSales: number,
  activeListings: number
) {
  return pendingSales / activeListings
}


export function calculateSellerCompetition(
  saleToListRatio: number
) {
  if (saleToListRatio > 1) return "High"
  if (saleToListRatio > 0.97) return "Moderate"
  return "Low"
}