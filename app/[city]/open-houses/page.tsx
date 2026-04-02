export function generateStaticParams() {

  const { cities } = require("@/data/cities")

  return cities.map((city: any) => ({
    city: city.slug
  }))
}