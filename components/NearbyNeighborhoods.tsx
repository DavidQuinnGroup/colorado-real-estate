import Link from "next/link"
import { neighborhoods } from "@/lib/neighborhoods"

type Props = {
  city: string
  currentSlug: string
}

export default function NearbyNeighborhoods({ city, currentSlug }: Props) {

  const nearby = neighborhoods
    .filter((n) => n.city === city && n.slug !== currentSlug)
    .slice(0, 5)

  if (nearby.length === 0) return null

  return (
    <section className="mt-10">

      <h2 className="text-2xl font-semibold mb-4">
        Nearby {city.charAt(0).toUpperCase() + city.slice(1)} Neighborhoods
      </h2>

      <ul className="list-disc ml-6">

        {nearby.map((n) => (
          <li key={n.slug}>
            <Link
              href={`/neighborhood/${n.slug}`}
              className="text-blue-600 hover:underline"
            >
              {n.name}
            </Link>
          </li>
        ))}

      </ul>

    </section>
  )
}