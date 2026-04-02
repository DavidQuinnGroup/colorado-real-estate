import { neighborhoods } from "@/lib/neighborhoods"

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>
}) {

  const { city } = await params

  const cityName =
    city.charAt(0).toUpperCase() + city.slice(1)

  const cityNeighborhoods = neighborhoods.filter(
    (n) => n.city.toLowerCase() === city.toLowerCase()
  )

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">

      <h1 className="text-4xl font-bold mb-6">
        {cityName} Real Estate
      </h1>

      <p className="text-lg text-gray-600 mb-10">
        Explore homes and neighborhoods in {cityName}, Colorado.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {cityNeighborhoods.map((n) => (
          <a
            key={n.slug}
            href={`/neighborhood/${n.slug}`}
            className="border rounded-xl p-6 hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold">
              {n.name}
            </h2>

            <p className="text-gray-500">
              Homes in {n.name}, {cityName}
            </p>
          </a>
        ))}

      </div>
    </div>
  )
}