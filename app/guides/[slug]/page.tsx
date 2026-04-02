import { neighborhoods } from "@/lib/neighborhoods"
import { notFound } from "next/navigation"

function createGuideSlug(name: string, city: string) {
  return `${name}-${city}-co-neighborhood-guide`
    .toLowerCase()
    .replace(/\s+/g, "-")
}

export function generateStaticParams() {
  return neighborhoods.map((n) => ({
    slug: createGuideSlug(n.name, n.city),
  }))
}

export default async function NeighborhoodGuide({
  params,
}: {
  params: Promise<{ slug: string }>
}) {

  const { slug } = await params

  const neighborhood = neighborhoods.find(
    (n) => createGuideSlug(n.name, n.city) === slug
  )

  if (!neighborhood) return notFound()

  return (
    <main className="max-w-5xl mx-auto p-6">

      <h1 className="text-4xl font-bold mb-6">
        Living in {neighborhood.name}, {neighborhood.city} CO
      </h1>

      <p className="mb-6">
        {neighborhood.name} is one of the most desirable neighborhoods in{" "}
        {neighborhood.city}, Colorado.
      </p>

    </main>
  )
}