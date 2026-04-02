export default function ThankYouPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">

      <div className="max-w-xl text-center">

        <h1 className="text-4xl font-light mb-6">
          Your Home Value Report Is Being Prepared
        </h1>

        <p className="text-gray-600 mb-8">
          Online estimates can be off by 5–12%.
          I can prepare a more precise value based on upgrades,
          condition, and buyer demand in your neighborhood.
        </p>

        <a
          href="/contact"
          className="inline-block bg-black text-white px-8 py-4 rounded-md"
        >
          Schedule a 15-Minute Home Value Review
        </a>

      </div>

    </main>
  );
}