import { properties } from "@/lib/properties"
import { notFound } from "next/navigation"
import Link from "next/link"

type Props = {
  params: { slug: string }
}

export function generateStaticParams() {
  return properties.map((p) => ({
    slug: p.slug
  }))
}

export default function PropertyPage({ params }: Props) {

  const property = properties.find(
    (p) => p.slug === params.slug
  )

  if (!property) return notFound()

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">

      <h1 className="text-4xl font-bold mb-4">
        {property.address}, {property.city.toUpperCase()}
      </h1>

      <p className="text-gray-600 mb-10">
        MLS Listing Details
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">

        <Stat label="Price" value={`$${property.price.toLocaleString()}`} />
        <Stat label="Beds" value={property.beds} />
        <Stat label="Baths" value={property.baths} />
        <Stat label="Sq Ft" value={property.sqft} />

      </div>

      <section className="prose mb-12">

        <h2>About This Property</h2>

        <p>
          Located in the {property.neighborhood} neighborhood of
          {` ${property.city}`}, this property offers
          {` ${property.beds} bedrooms and ${property.baths} bathrooms.`}
        </p>

      </section>

      <Link
        href={`/neighborhood/${property.neighborhood}`}
        className="text-blue-600 hover:underline"
      >
        View neighborhood guide →
      </Link>

    </main>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border rounded-xl p-6">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  )
}