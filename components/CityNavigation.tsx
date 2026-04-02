import Link from "next/link";
import { cities } from "@/lib/cities";

export default function CityNavigation() {

  return (
    <section className="mt-12">

      <h2 className="text-2xl mb-4">
        Explore Boulder County Cities
      </h2>

      <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">

        {cities.map((city) => (

          <li key={city.slug}>
            <Link
              href={`/${city.slug}`}
              className="underline hover:text-white"
            >
              {city.name} Real Estate
            </Link>
          </li>

        ))}

      </ul>

    </section>
  );
}