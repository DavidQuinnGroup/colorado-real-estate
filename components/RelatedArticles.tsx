import Link from "next/link"
import { articles } from "@/lib/articles"

type Props = {
  city: string
  currentSlug: string
}

export default function RelatedArticles({
  city,
  currentSlug,
}: Props) {

  const related = articles
    .filter(
      (a) => a.city === city && a.slug !== currentSlug
    )
    .slice(0, 4)

  if (related.length === 0) return null

  return (
    <section className="mt-12">

      <h2 className="text-2xl font-semibold mb-4">
        Related {city.charAt(0).toUpperCase() + city.slice(1)} Articles
      </h2>

      <ul className="space-y-3">

        {related.map((article) => (
          <li key={article.slug}>
            <Link
              href={`/blog/${city}/${article.slug}`}
              className="text-blue-600 hover:underline"
            >
              {article.title}
            </Link>
          </li>
        ))}

      </ul>

    </section>
  )
}