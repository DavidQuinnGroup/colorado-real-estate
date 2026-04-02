export default function BoulderHomesForSale() {
  return (
    <main className="pt-32 px-6 md:px-16 max-w-6xl mx-auto">

      <h1 className="text-4xl md:text-5xl font-light mb-6">
        Boulder Homes For Sale
      </h1>

      <p className="text-lg text-gray-600 mb-10 max-w-3xl">
        Search homes for sale in Boulder, Colorado including downtown condos,
        luxury mountain properties, and family homes in North Boulder and
        South Boulder neighborhoods.
      </p>

      {/* IDX SEARCH WILL GO HERE */}
      <div className="bg-gray-100 p-12 rounded-xl text-center mb-16">
        <p className="text-lg text-gray-600">
          Interactive MLS Search Coming Soon
        </p>
      </div>

      <section className="grid md:grid-cols-2 gap-12">

        <div>
          <h2 className="text-2xl mb-4">Living in Boulder</h2>
          <p className="text-gray-600 leading-relaxed">
            Boulder is one of Colorado’s most desirable places to live,
            known for its outdoor lifestyle, top-rated schools, and
            vibrant downtown along Pearl Street. Buyers relocating to
            Boulder often look for homes with mountain views, access to
            hiking trails, and walkable neighborhoods.
          </p>
        </div>

        <div>
          <h2 className="text-2xl mb-4">Boulder Real Estate Market</h2>
          <p className="text-gray-600 leading-relaxed">
            The Boulder real estate market is competitive with limited
            inventory and strong demand. Working with a local agent who
            understands neighborhood pricing trends can make the
            difference when buying a home in Boulder County.
          </p>
        </div>

      </section>

    </main>
  );
}