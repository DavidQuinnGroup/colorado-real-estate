import Link from "next/link";
import { neighborhoods } from "@/data/neighborhoods";

export const metadata = {
  title: "Boulder Neighborhood Map | Boulder CO Neighborhood Guide",
  description:
    "Explore every Boulder neighborhood including Mapleton Hill, Newlands, Table Mesa, and more. View homes for sale and neighborhood insights."
};

export default function BoulderNeighborhoodsPage() {

  const boulderNeighborhoods = neighborhoods["boulder"] || [];

  return (
    <div className="max-w-6xl mx-auto pt-32 pb-24 px-6">

      <h1 className="text-4xl font-light mb-8">
        Boulder Neighborhood Guide
      </h1>

      <p className="text-lg text-gray-300 mb-12">
        Boulder is home to dozens of unique neighborhoods, each offering its
        own character, architecture, and lifestyle. Explore the most popular
        areas below to learn more about living in Boulder.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        {boulderNeighborhoods.map((hood) => {

          const name = hood
            .split("-")
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");

          return (
            <Link
              key={hood}
              href={`/city/boulder/neighborhoods/${hood}`}
              className="border border-gray-700 p-6 hover:bg-[#1a1a1a] transition"
            >
              {name}
            </Link>
          );
        })}

      </div>

    </div>
  );
}