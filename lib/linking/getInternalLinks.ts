import { cities } from "@/data/cities"

export function getCityLinks(currentCity: string) {

  return cities
    .filter(c => c.slug !== currentCity)
    .slice(0, 5)
    .map(city => ({
      name: city.name,
      url: `/${city.slug}-real-estate`
    }))

}