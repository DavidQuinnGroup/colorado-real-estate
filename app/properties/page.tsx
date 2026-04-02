export default function Properties() {
  return (
    <main className="pt-32 px-6 md:px-16">

      {/* Page Header */}
      <section className="py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-light mb-6">
          Properties in Boulder County
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-600">
          Explore featured listings, search all available homes, and discover the best communities across Boulder, Louisville, Lafayette, Superior, Erie, and Longmont.
        </p>
      </section>

      {/* Featured Listings */}
      <section className="py-16">
        <h2 className="text-3xl font-light mb-8">Featured Listings</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="border p-6">Listing Card Placeholder</div>
          <div className="border p-6">Listing Card Placeholder</div>
          <div className="border p-6">Listing Card Placeholder</div>
        </div>
      </section>

      {/* IDX Search Placeholder */}
      <section className="py-20">
        <h2 className="text-3xl font-light mb-8 text-center">
          Search All Homes
        </h2>
        <div className="border p-10 text-center">
          IDX Integration Will Live Here
        </div>
      </section>

    </main>
  )
}