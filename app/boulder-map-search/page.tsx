export const metadata = {
  title: "Boulder Map Search | Homes for Sale in Boulder CO",
  description:
    "Search homes for sale in Boulder Colorado using an interactive map. Explore neighborhoods, property types, and listings across Boulder."
};

export default function BoulderMapSearch() {
  return (
    <div className="max-w-6xl mx-auto pt-32 pb-24 px-6">

      <h1 className="text-4xl font-light mb-6">
        Boulder Map Search
      </h1>

      <p className="text-lg text-gray-300 mb-10">
        Use the interactive map below to explore homes for sale throughout Boulder Colorado.
        Zoom into neighborhoods, explore listings, and discover homes in real time.
      </p>

      {/* IDX MAP WILL GO HERE */}

      <div className="w-full h-[700px] bg-[#1a1a1a] flex items-center justify-center text-gray-400">
        IDX MAP SEARCH WILL LOAD HERE
      </div>

    </div>
  );
}