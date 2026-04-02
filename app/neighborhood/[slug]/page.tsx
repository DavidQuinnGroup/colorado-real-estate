import { neighborhoods } from "@/lib/neighborhoods"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import NearbyNeighborhoods from "@/components/NearbyNeighborhoods"
import NeighborhoodMarketStats from "@/components/NeighborhoodMarketStats";
import NeighborhoodArticles from "@/components/NeighborhoodArticles";
import NeighborhoodMarketLink from "@/components/NeighborhoodMarketLink"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {

  const { slug } = await params

  const neighborhood = neighborhoods.find(
    (n) => n.slug === slug
  )

  if (!neighborhood) return {}

  return {
    title: `${neighborhood.name} Homes for Sale | ${neighborhood.city} CO Real Estate`,
    description: `Explore homes for sale in ${neighborhood.name}, ${neighborhood.city}, Colorado. View listings, market trends, and neighborhood insights.`,
  }
}

export function generateStaticParams() {
  return neighborhoods.map((n) => ({
    slug: n.slug,
  }))
}

export default async function NeighborhoodPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {

  const { slug } = await params

  const cityName =
  neighborhood.city.charAt(0).toUpperCase() +
  neighborhood.city.slice(1)

const schema = {
  "@context": "https://schema.org",
  "@type": "Place",
  "name": `${neighborhood.name}, ${cityName}, Colorado`,
  "address": {
    "@type": "PostalAddress",
    "addressLocality": cityName,
    "addressRegion": "CO",
    "addressCountry": "US"
  }
}

  const neighborhood = neighborhoods.find(
    (n) => n.slug === slug
  )

  if (!neighborhood) {
    return <div>Neighborhood not found</div>
  }
  

<NearbyNeighborhoods
  city={neighborhood.city}
  currentSlug={neighborhood.slug}
/>

  return (
    <main className="max-w-4xl mx-auto p-6">

      <h1 className="text-4xl font-bold mb-4">
        {neighborhood.name} Real Estate
      </h1>

<NeighborhoodMarketStats
  neighborhood={neighborhood.name}
/>

<NeighborhoodArticles
  city={neighborhood.city}
/>

<SEOImage
  src="/images/gunbarrel-boulder.jpg"
  city="boulder"
  neighborhood="Gunbarrel"
/>

<NeighborhoodMarketLink city={neighborhood.city} />

      <p>
        Homes for sale in {neighborhood.name}, {neighborhood.city}, Colorado.
      </p>

    </main>
  )
}