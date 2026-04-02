export function calculateAbsorptionRate(
  inventory: number,
  monthlySales: number
) {
  return (inventory / monthlySales).toFixed(1)
}