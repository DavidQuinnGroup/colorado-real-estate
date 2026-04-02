import { locations } from "@/lib/landmarks"
import { properties } from "@/lib/properties"
import { notFound } from "next/navigation"
import NearbyHomes from "@/components/NearbyHomes"
import Link from "next/link"
import type { Metadata } from "next"

type Props = {
  params: { location: string }
}

const landmark = landmarks.find(
  (l) => l.slug === params.location
)

export function generateMetadata({ params }: Props): Metadata {

  const landmark = landmarks.find(
    (l) => l.slug === params.location
  )

  if (!landmark) return {}

  return {
    title: `Homes Near ${landmark.name} | Real Estate`,
    description: `Explore homes for sale near ${landmark.name} in ${landmark.city}, Colorado.`
  }
}

export default function HomesNearPage({ params }: Props) {

  const landmark = landmarks.find(
    (l) => l.slug === params.location
  )

  if (!landmark) return notFound()

  return (

    <main className="max-w-5xl mx-auto px-6 py-12">

      <h1 className="text-4xl font-bold mb-6">
        Homes Near {landmark.name}
      </h1>

      <p className="text-gray-600 mb-10">
        Browse homes for sale near {landmark.name} in {landmark.city}, Colorado.
      </p>

      <NearbyHomes city={landmark.city} />

      <section className="mt-16">

        <h2 className="text-2xl font-semibold mb-4">
          Explore Homes in {landmark.city}
        </h2>

        <Link
          href={`/homes/${landmark.city}/homes`}
          className="text-blue-600 hover:underline"
        >
          View homes for sale in {landmark.city} →
        </Link>

      </section>

    </main>
  )
}