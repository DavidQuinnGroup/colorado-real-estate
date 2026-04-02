import { addresses } from "@/lib/addresses"
import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"

type Props = {
  params: { slug: string }
}

export function generateStaticParams() {
  return addresses.map((home) => ({
    slug: home.slug
  }))
}

export function generateMetadata({ params }: Props): Metadata {
  const home = addresses.find((a) => a.slug === params.slug)

  if (!home) return {}

  return {
    title: `${home.street}, ${home.city} CO Home Value & Property Details`,
    description: `View property details, estimated value, nearby homes and neighborhood information for ${home.street} in ${home.city}, Colorado.`
  }
}

export default function AddressPage({ params }: Props) {
  const home = addresses.find((a) => a.slug === params.slug)

  if (!home) return notFound()

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">

      <h1 className="text-4xl font-bold mb-4">
        {home.street}, {home.city} CO
      </h1>

      <p className="text-gray-600 mb-10">
        Property details and home value estimate.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">

        <Stat label="Price" value={`$${home.price.toLocaleString()}`} />
        <Stat label="Bedrooms" value={home.beds} />
        <Stat label="Bathrooms" value={home.baths} />
        <Stat label="Square Feet" value={home.sqft.toLocaleString()} />

      </div>

      <section className="prose max-w-none mb-12">

        <h2>About this Home</h2>

        <p>
          This home located at {home.street} in {home.city}, Colorado offers
          {home.beds} bedrooms, {home.baths} bathrooms and approximately
          {home.sqft.toLocaleString()} square feet of living space.
        </p>

      </section>

      <section className="border rounded-xl p-6">

        <h2 className="text-xl font-semibold mb-3">
          Neighborhood
        </h2>

        <Link
          href={`/neighborhood/${home.neighborhood}`}
          className="text-blue-600 hover:underline"
        >
          View homes and market trends in this neighborhood →
        </Link>

      </section>

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