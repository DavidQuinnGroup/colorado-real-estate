import Link from "next/link";
import { blogTopics } from "@/data/blogTopics";
import RelatedArticles from "@/components/RelatedArticles";
import Breadcrumbs from "@/components/Breadcrumbs";
import ArticleSchema from "@/components/schema/ArticleSchema"
import FAQSchema from "@/components/schema/FAQSchema";
import { generateFAQs } from "@/lib/generateFAQs";
import BlogNeighborhoodLinks from "@/components/BlogNeighborhoodLinks"
import AuthorByline from "@/components/AuthorByline"

type Params = {
  params: Promise<{
    city: string;
    topic: string;
  }>;
};

export async function generateStaticParams() {

  const cities = [
    "boulder",
    "louisville",
    "lafayette",
    "superior",
    "erie",
    "longmont",
    "broomfield",
    "westminster"
  ];

  const pages = [];

  for (const city of cities) {
    for (const topic of blogTopics) {
      pages.push({
        city,
        topic
      });
    }
  }

  return pages;
}

export async function generateMetadata({ params }: Params) {

  const faqs = generateFAQs(city, topic);
  
  const { city, topic } = await params;

  const cityName =
    city.charAt(0).toUpperCase() + city.slice(1);

  const topicName = topic
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `${topicName} in ${cityName}, Colorado`,
    description: `Learn about ${topicName.toLowerCase()} in ${cityName}, Colorado including housing, lifestyle, and local real estate insights.`,
  };
}

export default async function BlogPage({ params }: Params) {

  <FAQSchema faqs={faqs} />

  const { city, topic } = await params;

  const cityName =
    city.charAt(0).toUpperCase() + city.slice(1);

  const topicName = topic
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="max-w-5xl mx-auto pt-32 pb-24 px-6">

<ArticleSchema
  title={`${topicName} in ${cityName}, Colorado`}
  description={`Learn about ${topicName.toLowerCase()} in ${cityName}, Colorado including housing and lifestyle insights.`}
  url={`https://yourdomain.com/blog/${city}/${topic}`}
/>

<Breadcrumbs
  items={[
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: cityName, href: `/blog/${city}` },
    { name: topicName },
  ]}
/>

      <h1 className="text-4xl font-light mb-6">
        {topicName} in {cityName}, Colorado
      </h1>

      <p className="text-lg text-gray-300 mb-6">
        If you're considering moving to {cityName}, understanding {topicName.toLowerCase()} is essential.
      </p>

      <p className="text-gray-300 mb-6">
        {cityName} continues to attract homebuyers thanks to its strong real estate market,
        outdoor lifestyle, and proximity to Denver and the Rocky Mountains.
      </p>

      <h2 className="text-2xl mt-10 mb-4">
        Explore {cityName} Real Estate
      </h2>

<script
type="application/ld+json"
dangerouslySetInnerHTML={{
__html: JSON.stringify({
"@context": "https://schema.org",
"@type": "Article",
"author": {
"@type": "Person",
"name": "David Quinn"
}
})
}}
/>

      <ul className="space-y-2 text-gray-300">

        <li>
          <Link
            href={`/${city}-co-real-estate`}
            className="underline hover:text-white"
          >
            {cityName} Real Estate Guide
          </Link>
        </li>

        <li>
          <Link
            href={`/homes-for-sale-${city}-co`}
            className="underline hover:text-white"
          >
            Homes for Sale in {cityName}
          </Link>
        </li>

        <li>
          <Link
            href={`/market/${city}-co-housing-market`}
            className="underline hover:text-white"
          >
            {cityName} Real Estate Market
          </Link>
        </li>

      </ul>

      {/* RELATED ARTICLES ENGINE */}

      <RelatedArticles
        city={city}
        currentSlug={topic}
      />

    </div>
  );

  <section className="mt-16">

  <h2 className="text-2xl mb-6">
    Frequently Asked Questions About {cityName}
  </h2>

  <div className="space-y-6">

    {faqs.map((faq, index) => (

      <div key={index}>

        <h3 className="text-lg font-semibold mb-2">
          {faq.question}
        </h3>

        <p className="text-gray-300">
          {faq.answer}
        </p>

<BlogNeighborhoodLinks city={params.city} />

<AuthorByline />

      </div>

    ))}

  </div>

</section>

}