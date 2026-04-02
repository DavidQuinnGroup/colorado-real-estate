import { getNewListings } from "@/lib/freshListings"
import Link from "next/link"

type Props = {
  params: { city: string }
}

export default function NewListingsPage({ params }: Props) {

  const listings = getNewListings(params.city)

  const city =
    params.city.charAt(0).toUpperCase() + params.city.slice(1)

  return (

    <main className="max-w-6xl mx-auto px-6 py-12">

      <h1 className="text-4xl font-bold mb-8">
        New Listings in {city}
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        {listings.map((p) => (

          <Link
            key={p.id}
            href={`/property/${p.slug}`}
            className="border rounded-xl p-4"
          >

            <p className="font-semibold">{p.address}</p>

            <p>${p.price.toLocaleString()}</p>

          </Link>

        ))}

      </div>

    </main>

  )
}