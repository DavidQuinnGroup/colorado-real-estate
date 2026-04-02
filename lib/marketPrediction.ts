export function predictMarketTrend(
  inventoryTrend: number,
  domTrend: number,
  priceReductionRate: number,
  absorptionRate: number,
  priceMomentum: number
) {

  let score = 50

  score += priceMomentum * 20
  score -= inventoryTrend * 10
  score -= domTrend * 10
  score -= priceReductionRate * 15
  score += absorptionRate * 5

  if (score > 100) score = 100
  if (score < 0) score = 0

  return Math.round(score)

}