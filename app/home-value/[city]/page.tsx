import { cities } from "@/data/cities"
import { notFound } from "next/navigation"
import ValuationForm from "@/components/ValuationForm"

export async function generateStaticParams() {
  return cities.map((city) => ({
    city: city.slug,
  }))
}

export default function HomeValuePage({
  params,
}: {
  params: { city: string }
}) {
  const { city } = params

  const cityData = cities.find((c) => c.slug === city)

  if (!cityData) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-4">
        What is My {cityData.name} Home Worth?
      </h1>

      <p className="text-gray-600 mb-8">
        Get an instant home valuation estimate for your property in{" "}
        {cityData.name}, Colorado.
      </p>

      <ValuationForm city={cityData.name} />
    </div>
  )
}