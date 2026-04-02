export function tileToBBox(x: number, y: number, z: number) {
  const n = Math.pow(2, z)

  const lon1 = (x / n) * 360 - 180
  const lon2 = ((x + 1) / n) * 360 - 180

  const lat1 = (Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / n))) * 180) / Math.PI
  const lat2 = (Math.atan(Math.sinh(Math.PI * (1 - (2 * (y + 1)) / n))) * 180) / Math.PI

  return {
    west: lon1,
    south: lat2,
    east: lon2,
    north: lat1,
  }
}