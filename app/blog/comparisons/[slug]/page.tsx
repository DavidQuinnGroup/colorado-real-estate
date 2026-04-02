import { comparisons } from "@/data/comparisons"
import Breadcrumbs from "@/components/Breadcrumbs"
import { notFound } from "next/navigation"

function formatName(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

export function generateStaticParams() {

  return comparisons.map((c) => ({
    slug: `${c.cityA}-vs-${c.cityB}`
  }))
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}) {

  const { slug } = await params

  const [cityA, , cityB] = slug.split("-")

  const nameA = formatName(cityA)
  const nameB = formatName(cityB)

  return {
    title: `${nameA} vs ${nameB}: Which Colorado Town Is Better?`,
    description: `Compare living in ${nameA} vs ${nameB}, Colorado including housing prices, lifestyle, commute, and real estate trends.`,
  }
}

export default async function ComparisonPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {

  const { slug } = await params

  const [cityA, , cityB] = slug.split("-")

  if (!cityA || !cityB) return notFound()

  const nameA = formatName(cityA)
  const nameB = formatName(cityB)

  return (
    <div className="max-w-5xl mx-auto pt-32 pb-24 px-6">

      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
          { name: "Comparisons", href: "/blog/comparisons" },
          { name: `${nameA} vs ${nameB}` }
        ]}
      />

      <h1 className="text-4xl font-light mb-6">
        {nameA} vs {nameB}: Which Colorado Town Is Better?
      </h1>

      <p className="text-gray-300 mb-6">
        Choosing between {nameA} and {nameB} can be challenging. Both
        communities offer strong real estate markets, outdoor lifestyle,
        and proximity to Boulder and Denver.
      </p>

      <h2 className="text-2xl mt-10 mb-4">
        Real Estate Comparison
      </h2>

      <p className="text-gray-300 mb-6">
        Home prices, inventory levels, and property styles vary between
        {nameA} and {nameB}. Buyers should evaluate price per square foot,
        neighborhood character, and long-term appreciation potential.
      </p>

      <h2 className="text-2xl mt-10 mb-4">
        Lifestyle Differences
      </h2>

      <p className="text-gray-300 mb-6">
        {nameA} and {nameB} each offer unique lifestyle advantages including
        access to outdoor recreation, community atmosphere, and proximity
        to major employment centers.
      </p>

      <h2 className="text-2xl mt-10 mb-4">
        Which Is Right For You?
      </h2>

      <p className="text-gray-300">
        The best choice ultimately depends on your budget, commute,
        lifestyle preferences, and long-term real estate goals.
      </p>

    </div>
  )
}