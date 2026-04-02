import { authors } from "@/lib/authors"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

type Props = {
  params: { slug: string }
}

export function generateStaticParams() {
  return authors.map((a) => ({
    slug: a.slug
  }))
}

export function generateMetadata({ params }: Props): Metadata {

  const author = authors.find(
    (a) => a.slug === params.slug
  )

  if (!author) return {}

  return {
    title: `${author.name} | Real Estate Advisor`,
    description: author.bio
  }
}

export default function AuthorPage({ params }: Props) {

  const author = authors.find(
    (a) => a.slug === params.slug
  )

  if (!author) return notFound()

  return (

    <main className="max-w-4xl mx-auto px-6 py-12">

      <h1 className="text-4xl font-bold mb-4">
        {author.name}
      </h1>

      <p className="text-gray-600 mb-6">
        {author.title} — {author.brokerage}
      </p>

      <p className="text-lg">
        {author.bio}
      </p>

    </main>

  )
}