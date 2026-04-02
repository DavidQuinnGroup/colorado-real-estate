import { expansionQueries } from "@/data/expansionQueries"

type Props = {
  params: {
    city: string
    query: string
  }
}

export function generateStaticParams() {

  const cities = [
    "boulder",
    "louisville",
    "lafayette",
    "superior",
    "erie",
    "longmont"
  ]

  return cities.flatMap((city) =>
    expansionQueries.map((query) => ({
      city,
      query
    }))
  )
}

export default function SearchPage({ params }: Props) {

  const city =
    params.city.charAt(0).toUpperCase() + params.city.slice(1)

  return (

    <main className="max-w-6xl mx-auto px-6 py-12">

      <h1 className="text-4xl font-bold">
        {params.query.replace("-", " ")} in {city}
      </h1>

    </main>

  )
}