export const metadata = {
  title: "Boulder Luxury Homes Map Search",
  description:
    "Search Boulder luxury homes for sale using an interactive map. Explore luxury neighborhoods and high-end real estate across Boulder."
};

export default function BoulderLuxuryMapSearch() {
  return (
    <div className="max-w-6xl mx-auto pt-32 pb-24 px-6">

      <h1 className="text-4xl font-light mb-6">
        Boulder Luxury Homes Map Search
      </h1>

      <p className="text-lg text-gray-300 mb-10">
        Explore luxury homes for sale in Boulder using our interactive map.
        View properties, estates, and luxury real estate across Boulder neighborhoods.
      </p>

      <div className="w-full h-[700px] bg-[#1a1a1a] flex items-center justify-center text-gray-400">
        LUXURY IDX MAP WILL LOAD HERE
      </div>

    </div>
  );
}