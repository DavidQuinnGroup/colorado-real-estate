import Link from "next/link"
import { neighborhoods } from "@/lib/neighborhoods"

type Props = {
  city: string
}

export default function CityNeighborhoods({ city }: Props) {

  const cityNeighborhoods = neighborhoods.filter(
    (n) => n.city === city
  )

  return (
    <section className="mt-10">

      <h2 className="text-2xl font-semibold mb-4">
        Neighborhoods in {city.charAt(0).toUpperCase() + city.slice(1)}
      </h2>

      <ul className="grid grid-cols-2 gap-2">

        {cityNeighborhoods.map((n) => (
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