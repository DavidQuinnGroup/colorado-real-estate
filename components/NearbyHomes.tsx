import Link from "next/link"
import { properties } from "@/lib/properties"

export default function NearbyHomes({
  city
}: {
  city: string
}) {

  const nearby = properties
    .filter((p) => p.city === city)
    .slice(0, 4)

  return (
    <section className="mt-16">

      <h2 className="text-2xl font-semibold mb-4">
        Nearby Homes
      </h2>

      <div className="grid md:grid-cols-2 gap-4">

        {nearby.map((p) => (
          <Link
            key={p.id}
            href={`/property/${p.slug}`}
            className="border rounded-lg p-4 hover:bg-gray-50"
          >
            {p.address}
          </Link>
        ))}

      </div>

    </section>
  )
}