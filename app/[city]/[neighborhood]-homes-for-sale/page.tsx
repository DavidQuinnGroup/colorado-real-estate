import { cities } from "@/data/cities"
import { neighborhoods } from "@/data/neighborhoods"
import { notFound } from "next/navigation"
import { searchProperties } from "@/lib/search/searchProperties"
import PropertyCard from "@/components/PropertyCard"

export default async function NeighborhoodPage({
  params
}: {
  params: Promise<{ city: string; neighborhood: string }>
}) {

  const { city, neighborhood } = await params

  const cityData = cities.find(c => c.slug === city)
  const neighborhoodData = neighborhoods.find(
    n => n.slug === neighborhood && n.city === city
  )

  if (!cityData || !neighborhoodData) {
    notFound()
  }

  const listings = await searchProperties({
    city: cityData.name
  })

  return (
    <div className="max-w-6xl mx-auto p-10">

      <h1 className="text-3xl font-bold mb-6">
        {neighborhoodData.name} Homes for Sale
      </h1>

      <p className="text-gray-600 mb-8">
        Browse homes for sale in the {neighborhoodData.name} neighborhood of {cityData.name}, Colorado.
      </p>

      {listings.length === 0 && (
        <p>No listings available yet.</p>
      )}

      <div className="grid grid-cols-3 gap-6">
        {listings.map((property: any) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

    </div>
  )
}

export function generateStaticParams() {
  return neighborhoods.map((n: any) => ({
    city: n.city,
    neighborhood: n.slug
  }))
}