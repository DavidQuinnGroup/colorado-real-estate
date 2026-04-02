import { properties } from "@/lib/properties"
import Link from "next/link"
import { notFound } from "next/navigation"

type Props = {
  params: { city: string }
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

  return cities.map((city) => ({
    city
  }))
}

export default function CityHomesPage({ params }: Props) {

  const cityProperties = properties.filter(
    (p) => p.city === params.city
  )

  if (!cityProperties.length) return notFound()

  const cityName =
    params.city.charAt(0).toUpperCase() + params.city.slice(1)

  return (

    <main className="max-w-6xl mx-auto px-6 py-12">

      <h1 className="text-4xl font-bold mb-8">
        Homes For Sale in {cityName}
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        {cityProperties.map((p) => (

          <Link
            key={p.id}
            href={`/property/${p.slug}`}
            className="border rounded-xl p-4 hover:bg-gray-50"
          >

            <p className="font-semibold">
              {p.address}
            </p>

            <p className="text-gray-600">
              ${p.price.toLocaleString()}
            </p>

            <p className="text-sm text-gray-500">
              {p.beds} beds • {p.baths} baths • {p.sqft} sqft
            </p>

          </Link>

        ))}

      </div>

    </main>

  )
}