import Link from "next/link";
import { blogTopics } from "@/data/blogTopics";

type Props = {
  city: string;
};

export default function NeighborhoodArticles({
  city,
}: Props) {

  const cityName =
    city.charAt(0).toUpperCase() + city.slice(1);

  return (

    <section className="mt-12">

      <h2 className="text-2xl mb-4">
        Related {cityName} Articles
      </h2>

      <ul className="space-y-2">

        {blogTopics.slice(0, 5).map((topic) => {

          const topicName = topic
            .split("-")
            .map(
              (w) => w.charAt(0).toUpperCase() + w.slice(1)
            )
            .join(" ");

          return (

            <li key={topic}>

              <Link
                href={`/blog/${city}/${topic}`}
                className="underline hover:text-white"
              >
                {topicName} in {cityName}
              </Link>

            </li>
          );

        })}

      </ul>

    </section>
  );
}