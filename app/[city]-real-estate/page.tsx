import { cities } from "@/data/cities"
import { searchProperties } from "@/lib/search/searchProperties"
import PropertyCard from "@/components/PropertyCard"
import { notFound } from "next/navigation"
import CityInternalLinks from "@/components/internal-links/CityInternalLinks"
import { getCityLinks } from "@/lib/linking/getInternalLinks"

export default async function CityRealEstate({
  params
}: {
  params: Promise<{ city: string }>
}) {

  const links = getCityLinks(city)

  const { city } = await params

  const cityData = cities.find(c => c.slug === city)

  if (!cityData) {
    notFound()
  }

  const listings = await searchProperties({
    city: cityData.name
  })

  return (
    <div className="max-w-6xl mx-auto p-10">

      <h1 className="text-3xl font-bold mb-6">
        {cityData.name} Real Estate
      </h1>

      <p className="text-gray-600 mb-8">
        Homes for sale in {cityData.name}, Colorado.
      </p>

      {listings.length === 0 && (
        <p>No listings available yet.</p>
      )}

      <div className="grid grid-cols-3 gap-6">
        {listings.map((property: any) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

export function generateStaticParams() {
  return cities.map((city) => ({
    city: city.slug
  }))
}

<CityInternalLinks links={links} />

    </div>
  )
}