import Link from "next/link"

export default function CityHubLink({
  city
}: {
  city: string
}) {

  const citySlug =
    city.toLowerCase() + "-real-estate"

  return (

    <div className="border-t mt-16 pt-8">

      <Link
        href={`/${citySlug}`}
        className="text-blue-600 hover:underline font-semibold"
      >
        Explore everything about living in {city}
      </Link>

    </div>

  )
}