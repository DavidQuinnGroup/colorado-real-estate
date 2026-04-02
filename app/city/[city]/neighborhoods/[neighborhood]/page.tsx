import Link from "next/link";

type Params = {
  params: {
    city: string;
    neighborhood: string;
  };
};

export default async function NeighborhoodPage({ params }: Params) {

  const { city, neighborhood } = await params;

  const cityName =
    city.charAt(0).toUpperCase() + city.slice(1);

  const neighborhoodName = neighborhood
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="max-w-5xl mx-auto pt-32 pb-24 px-6">

      <h1 className="text-4xl font-light mb-6">
        {neighborhoodName} Homes For Sale in {cityName}
      </h1>

      <p className="text-gray-300 mb-6">
        {neighborhoodName} is one of the most desirable neighborhoods in {cityName}.
      </p>

      <h2 className="text-2xl mt-10 mb-4">
        Explore {cityName} Real Estate
      </h2>

      <ul className="space-y-2 text-gray-300">

        <li>
          <Link href={`/city/${city}`}>
            {cityName} Real Estate
          </Link>
        </li>

        <li>
          <Link href="/homes-for-sale-boulder-co">
            Homes for Sale in Boulder
          </Link>
        </li>

        <li>
          <Link href="/boulder-real-estate-market">
            Boulder Real Estate Market
          </Link>
        </li>

        <li>
          <Link href="/boulder-luxury-homes">
            Boulder Luxury Homes
          </Link>
        </li>

      </ul>

    </div>
  );
}