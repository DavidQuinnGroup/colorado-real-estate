import Link from "next/link"
import { neighborhoods } from "@/lib/neighborhoods"

function createGuideSlug(name: string, city: string) {
  return `${name}-${city}-co-neighborhood-guide`
    .toLowerCase()
    .replace(/\s+/g, "-")
}

type Props = {
  city: string
}

export default function CityGuides({ city }: Props) {

  const cityGuides = neighborhoods.filter(
    (n) => n.city === city
  )

  return (
    <section className="mt-10">

      <h2 className="text-2xl font-semibold mb-4">
        Neighborhood Guides
      </h2>

      <ul className="grid grid-cols-2 gap-2">

        {cityGuides.map((n) => (
          <li key={n.slug}>
            <Link
              href={`/guides/${createGuideSlug(n.name, n.city)}`}
              className="text-blue-600 hover:underline"
            >
              Living in {n.name}
            </Link>
          </li>
        ))}

      </ul>

    </section>
  )
}