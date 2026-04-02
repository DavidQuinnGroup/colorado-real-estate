import { cities } from "@/data/cities"
import { searchProperties } from "@/lib/search/searchProperties"
import PropertyCard from "@/components/PropertyCard"
import { notFound } from "next/navigation"

export default async function NewListingsPage({
  params
}: {
  params: Promise<{ city: string }>
}) {

  const { city } = await params

  const cityData = cities.find(c => c.slug === city)

  if (!cityData) {
    notFound()
  }

  const listings = await searchProperties({
    city: cityData.name,
    status: "Active"
  })

  return (
    <div className="max-w-6xl mx-auto p-10">

      <h1 className="text-3xl font-bold mb-6">
        New Listings in {cityData.name}
      </h1>

      <p className="text-gray-600 mb-8">
        Explore the newest homes for sale in {cityData.name}, Colorado.
      </p>

      {listings.length === 0 && (
        <p>No new listings available yet.</p>
      )}

      <div className="grid grid-cols-3 gap-6">
        {listings.map((property: any) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

    </div>
  )

  export function generateStaticParams() {

  const { cities } = require("@/data/cities")

  return cities.map((city: any) => ({
    city: city.slug
  }))
}

}