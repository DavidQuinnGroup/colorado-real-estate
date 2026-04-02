import Link from "next/link"

type Article = {
  title: string
  slug: string
}

const articleTopics: Record<string, Article[]> = {
  homes: [
    {
      title: "Cost of Living in CITY Colorado",
      slug: "cost-of-living"
    },
    {
      title: "Moving to CITY Colorado Guide",
      slug: "moving-to"
    },
    {
      title: "Best Neighborhoods in CITY",
      slug: "best-neighborhoods"
    }
  ],

  condos: [
    {
      title: "Best Condo Buildings in CITY",
      slug: "best-condo-buildings"
    },
    {
      title: "Buying a Condo in CITY",
      slug: "buying-a-condo"
    },
    {
      title: "CITY Condo Market Trends",
      slug: "condo-market-trends"
    }
  ],

  luxury: [
    {
      title: "Luxury Homes in CITY Colorado",
      slug: "luxury-homes-guide"
    },
    {
      title: "Most Expensive Neighborhoods in CITY",
      slug: "luxury-neighborhoods"
    }
  ]
}

export default function HomesBlogLinks({
  city,
  type
}: {
  city: string
  type: string
}) {

  const articles = articleTopics[type] || articleTopics["homes"]

  return (
    <section className="mt-16">

      <h2 className="text-2xl font-semibold mb-4">
        Real Estate Guides for {city}
      </h2>

      <div className="grid md:grid-cols-3 gap-4">

        {articles.map((article) => {

          const title = article.title.replace("CITY", city)

          return (
            <Link
              key={article.slug}
              href={`/blog/${city.toLowerCase()}/${article.slug}`}
              className="border rounded-lg p-4 hover:bg-gray-50"
            >
              {title}
            </Link>
          )
        })}

      </div>

    </section>
  )
}