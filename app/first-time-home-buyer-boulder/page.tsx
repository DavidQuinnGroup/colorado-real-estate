export default function FirstTimeBuyerPage() {
  return (
    <main className="pt-32 px-6 md:px-16 max-w-5xl mx-auto">

      <h1 className="text-4xl md:text-5xl font-light mb-8">
        First-Time Home Buyer in Boulder
      </h1>

      <p className="text-lg text-gray-600 mb-8">
        Buying your first home can feel overwhelming, but with the right
        strategy and guidance, it becomes an exciting step toward building
        long-term wealth.
      </p>

      <h2 className="text-2xl mt-12 mb-4">
        The Home Buying Process
      </h2>

      <ol className="list-decimal pl-6 text-gray-600 space-y-2">
        <li>Mortgage pre-approval</li>
        <li>Property search</li>
        <li>Home tours</li>
        <li>Offer and negotiation</li>
        <li>Inspection and closing</li>
      </ol>

      <div className="my-12 p-10 bg-gray-100">

        <h3 className="text-xl mb-4">
          Start Your Home Search
        </h3>

        <p className="mb-6 text-gray-600">
          Explore available properties across Boulder County.
        </p>

        <a
          href="/properties/search"
          className="bg-black text-white px-8 py-4 inline-block"
        >
          Search Homes
        </a>

      </div>

    </main>
  );
}