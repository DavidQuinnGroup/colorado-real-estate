import { neighborhoods } from "@/data/neighborhoods"

export function getCities() {
  const cities = new Set(neighborhoods.map((n) => n.city))
  return Array.from(cities)
}