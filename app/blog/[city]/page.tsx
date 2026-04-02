import { articles } from "@/lib/articles"
import { notFound } from "next/navigation"
import Link from "next/link"

export function generateStaticParams() {

  const cities = [...new Set(articles.map((a) => a.city))]

  return cities.map((city) => ({
    city,
  }))
}

export default async function BlogCityPage({
  params,
}: {
  params: Promise<{ city: string }>
}) {

  const { city } = await params

  const cityArticles = articles.filter(
    (a) => a.city === city
  )

  if (cityArticles.length === 0) return notFound()

  return (
    <main className="max-w-5xl mx-auto p-6">

      <h1 className="text-4xl font-bold mb-6">
        {city.charAt(0).toUpperCase() + city.slice(1)} Real Estate Blog
      </h1>

      <p className="mb-8">
        Explore guides, market insights, and neighborhood comparisons
        for living in {city.charAt(0).toUpperCase() + city.slice(1)}, Colorado.
      </p>

      <ul className="space-y-4">

        {cityArticles.map((article) => (
          <li key={article.slug}>

            <Link
              href={`/blog/${city}/${article.slug}`}
              className="text-blue-600 hover:underline text-lg"
            >
              {article.title}
            </Link>

            <p className="text-gray-600 text-sm">
              {article.description}
            </p>

          </li>
        ))}

      </ul>

    </main>
  )
}