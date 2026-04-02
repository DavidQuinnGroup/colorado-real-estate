import { localTopics } from "@/lib/localTopics"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import BlogNeighborhoodLinks from "@/components/BlogNeighborhoodLinks"

type Props = {
  params: {
    city: string
    topic: string
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
    localTopics.map((topic) => ({
      city,
      topic: topic.slug
    }))
  )
}

export function generateMetadata({ params }: Props): Metadata {

  const topic = localTopics.find(
    (t) => t.slug === params.topic
  )

  if (!topic) return {}

  const cityName =
    params.city.charAt(0).toUpperCase() + params.city.slice(1)

  return {
    title: topic.title.replace("CITY", cityName),
    description: `Discover the ${topic.slug.replace("-", " ")} in ${cityName}, Colorado.`
  }
}

export default function AreaPage({ params }: Props) {

  const topic = localTopics.find(
    (t) => t.slug === params.topic
  )

  if (!topic) return notFound()

  const cityName =
    params.city.charAt(0).toUpperCase() + params.city.slice(1)

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">

      <h1 className="text-4xl font-bold mb-6">
        {topic.title.replace("CITY", cityName)}
      </h1>

      <p className="text-lg text-gray-600 mb-10">
        {topic.intro.replace("CITY", cityName)}
      </p>

      <section className="prose max-w-none mb-12">

        <h2>Why People Love {cityName}</h2>

        <p>
          Residents of {cityName} enjoy a strong sense of community,
          access to outdoor recreation, and a vibrant local culture.
          Whether you’re visiting or considering moving here,
          exploring local favorites is a great way to get to know the area.
        </p>

      </section>

      {/* Link back into neighborhood authority */}

      <BlogNeighborhoodLinks city={params.city} />

    </main>
  )
}