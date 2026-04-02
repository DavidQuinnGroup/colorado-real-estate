import { propertySearchTypes } from "@/lib/propertySearchTypes"
import { notFound } from "next/navigation"
import HomesBlogLinks from "@/components/HomesBlogLinks"
import RelatedPropertyLinks from "@/components/RelatedPropertyLinks"
import type { Metadata } from "next"

type Props = {
  params: {
    city: string
    type: string
  }
}

export function generateStaticParams() {
  const cities = [
    "boulder",
    "louisville",
    "lafayette",
    "superior",
    "erie",
    "longmont"
  ]

  return cities.flatMap((city) =>
    propertySearchTypes.map((type) => ({
      city,
      type: type.slug
    }))
  )
}

export function generateMetadata({ params }: Props): Metadata {

  const searchType = propertySearchTypes.find(
    (t) => t.slug === params.type
  )

  if (!searchType) return {}

  const cityName =
    params.city.charAt(0).toUpperCase() + params.city.slice(1)

  return {
    title: searchType.title.replace("CITY", cityName),
    description: searchType.description.replace("CITY", cityName)
  }
}

export default function HomesPage({ params }: Props) {

  const searchType = propertySearchTypes.find(
    (t) => t.slug === params.type
  )

  if (!searchType) return notFound()

  const cityName =
    params.city.charAt(0).toUpperCase() + params.city.slice(1)

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">

      <h1 className="text-4xl font-bold mb-6">
        {searchType.title.replace("CITY", cityName)}
      </h1>

      <p className="text-gray-600 mb-10">
        {searchType.description.replace("CITY", cityName)}
      </p>

      {/* MLS Listings Placeholder */}

      <div className="border rounded-xl p-10 text-center mb-12">
        <p className="text-gray-500">
          Property listings will appear here once MLS integration is connected.
        </p>
      </div>

      {/* Zillow-Style Related Searches */}

      <RelatedPropertyLinks
        city={params.city}
        type={params.type}
      />

      {/* Blog Authority Links */}

      <HomesBlogLinks
        city={params.city}
        type={params.type}
      />

    </main>
  )
}