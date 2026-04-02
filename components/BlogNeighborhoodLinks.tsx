import Link from "next/link"
import { neighborhoods } from "@/lib/neighborhoods"

export default function BlogNeighborhoodLinks({ city }: { city: string }) {
  const cityNeighborhoods = neighborhoods.filter(
    (n) => n.city.toLowerCase() === city.toLowerCase()
  )

  if (!cityNeighborhoods.length) return null

  return (
    <section className="mt-16">

      <h2 className="text-2xl font-semibold mb-4">
        Explore Neighborhoods in {city}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

        {cityNeighborhoods.map((n) => (
          <Link
            key={n.slug}
            href={`/neighborhood/${n.slug}`}
            className="border rounded-lg p-4 hover:bg-gray-50"
          >
            {n.name}
          </Link>
        ))}

      </div>

    </section>
  )
}