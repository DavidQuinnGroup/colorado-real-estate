import { properties } from "./properties"

export function getNewListings(city: string) {
  return properties
    .filter((p) => p.city === city)
    .slice(0, 20)
}

export function getPriceDrops(city: string) {
  return properties
    .filter((p) => p.city === city && p.price < 1000000)
    .slice(0, 20)
}