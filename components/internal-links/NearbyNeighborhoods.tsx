import Link from "next/link"
import { getNeighborhoodsByCity } from "@/lib/getNeighborhoodsByCity"

type Props = {
  city: string
  currentSlug: string
}

export default function NearbyNeighborhoods({
  city,
  currentSlug
}: Props) {

  const neighborhoods = getNeighborhoodsByCity(city)
    .filter(n => n.slug !== currentSlug)
    .slice(0, 6)

  return (
    <section className="mt-16">

      <h2 className="text-2xl font-semibold mb-4">
        Nearby Neighborhoods
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

        {neighborhoods.map(n => (
          <Link
            key={n.slug}
            href={`/neighborhoods/${city}/${n.slug}`}
            className="text-blue-600 hover:underline"
          >
            {n.name}
          </Link>
        ))}

      </div>

    </section>
  )
}