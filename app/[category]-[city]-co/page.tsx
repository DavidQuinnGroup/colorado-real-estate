import { cities } from "@/data/cities"
import { programmaticCategories } from "@/data/programmaticPages"
import { notFound } from "next/navigation"
import { searchProperties } from "@/lib/search/searchProperties"
import PropertyCard from "@/components/PropertyCard"

export default async function ProgrammaticPage({
  params
}: {
  params: Promise<{ category: string; city: string }>
}) {

  const { category, city } = await params

  const cityData = cities.find(c => c.slug === city)
  const categoryData = programmaticCategories.find(c => c.slug === category)

  if (!cityData || !categoryData) {
    notFound()
  }

  const listings = await searchProperties({
    city: cityData.name
  })

  const title = categoryData.title.replace("{city}", cityData.name)
  const description = categoryData.description.replace("{city}", cityData.name)

  return (
    <div className="max-w-6xl mx-auto p-10">

      <h1 className="text-3xl font-bold mb-4">
        {title}
      </h1>

      <p className="text-gray-600 mb-8">
        {description}
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

  const { cities } = require("@/data/cities")
  const { programmaticCategories } = require("@/data/programmaticPages")

  const pages: any[] = []

  for (const city of cities) {
    for (const category of programmaticCategories) {
      pages.push({
        city: city.slug,
        category: category.slug
      })
    }
  }

  return pages
}

    </div>
  )
}