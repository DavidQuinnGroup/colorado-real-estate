import Link from "next/link"
import { propertySearchTypes } from "@/lib/propertySearchTypes"

const nearbyCities = [
  "boulder",
  "louisville",
  "lafayette",
  "superior",
  "erie",
  "longmont"
]

export default function RelatedPropertyLinks({
  city,
  type
}: {
  city: string
  type: string
}) {

  const relatedTypes = propertySearchTypes.filter(
    (t) => t.slug !== type
  ).slice(0, 4)

  const nearby = nearbyCities.filter((c) => c !== city)

  return (
    <section className="mt-16">

      <h2 className="text-2xl font-semibold mb-4">
        Related Home Searches
      </h2>

      <div className="grid md:grid-cols-2 gap-6">

        <div>
          <h3 className="font-semibold mb-2">More in {city}</h3>

          <ul className="space-y-2">
            {relatedTypes.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/homes/${city}/${t.slug}`}
                  className="text-blue-600 hover:underline"
                >
                  {t.title.replace("CITY", city)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">
            Nearby Cities
          </h3>

          <ul className="space-y-2">
            {nearby.slice(0, 4).map((c) => (
              <li key={c}>
                <Link
                  href={`/homes/${c}/${type}`}
                  className="text-blue-600 hover:underline"
                >
                  {type.replace("-", " ")} in{" "}
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

      </div>

    </section>
  )
}