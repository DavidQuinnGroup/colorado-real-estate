<h1>
Price Reductions in {cityData.name}
</h1>

export function generateStaticParams() {

  const { cities } = require("@/data/cities")

  return cities.map((city: any) => ({
    city: city.slug
  }))
}