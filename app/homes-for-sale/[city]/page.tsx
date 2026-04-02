import { searchProperties } from "@/lib/search/searchProperties"
import PropertyCard from "@/components/PropertyCard"

export default async function CityListings({ params }: { params: Promise<{ city: string }> }) {

  const { city } = await params

  const cleanCity = city.replace("-co", "")

  const listings = await searchProperties({ city: cleanCity })

  return (
    <div className="max-w-6xl mx-auto p-10">

      <h1 className="text-3xl font-bold mb-8">
        Homes for Sale in {cleanCity}
      </h1>

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