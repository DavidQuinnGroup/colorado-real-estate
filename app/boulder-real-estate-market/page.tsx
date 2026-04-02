export const metadata = {
  title: "Boulder Real Estate Market | Housing Trends",
  description:
    "Explore the latest Boulder real estate market trends including home prices, inventory, and buyer demand.",
};

export default function BoulderMarketPage() {
  return (
    <div className="max-w-5xl mx-auto pt-32 pb-24 px-6">

      <h1 className="text-4xl font-light mb-6">
        Boulder Real Estate Market
      </h1>

      <p className="text-gray-300 mb-6">
        The Boulder real estate market is known for strong demand, limited inventory,
        and long-term price appreciation.
      </p>

      <p className="text-gray-300 mb-6">
        Buyers relocating to Boulder are attracted to the city's quality of life,
        outdoor access, and strong economy driven by technology, research,
        and the University of Colorado.
      </p>

      <p className="text-gray-300">
        Understanding the Boulder housing market helps both buyers and sellers
        make informed real estate decisions.
      </p>

    </div>
  );
}