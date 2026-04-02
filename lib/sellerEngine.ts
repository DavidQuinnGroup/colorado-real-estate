export function sellerTimingScore(
  marketHealth: number,
  demandIndex: number,
  absorptionRate: number
) {

  let score = 0

  score += marketHealth * 0.5
  score += demandIndex * 30
  score += (6 - absorptionRate) * 5

  return Math.max(0, Math.min(100, Math.round(score)))

}


export function sellerRecommendation(score: number) {

  if (score > 80) return "Excellent time to sell"
  if (score > 60) return "Good time to sell"
  if (score > 40) return "Neutral market"
  return "Waiting may be better"

}