export function getOutreachStrategy(dealScore: number) {
  if (dealScore >= 60) {
    return "aggressive"
  }

  if (dealScore >= 40) {
    return "standard"
  }

  return "light"
}