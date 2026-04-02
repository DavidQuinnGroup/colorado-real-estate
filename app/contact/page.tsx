export default function ContactPage() {
  return (
    <main className="pt-32 px-6 md:px-16 max-w-4xl mx-auto">

      <h1 className="text-4xl md:text-5xl font-light mb-10">
        Contact David Quinn
      </h1>

      <p className="text-lg text-gray-600 mb-10">
        Whether you're buying, selling, or just exploring the Boulder County
        market, I'm happy to help.
      </p>

      <div className="space-y-4 mb-12 text-lg">
        <p><strong>Phone:</strong> (303) 000-0000</p>
        <p><strong>Email:</strong> david@davidquinngroup.com</p>
        <p><strong>Office:</strong> Compass – Boulder County</p>
      </div>

      <form className="space-y-6">

        <input
          type="text"
          placeholder="Full Name"
          className="w-full border p-4"
        />

        <input
          type="email"
          placeholder="Email Address"
          className="w-full border p-4"
        />

        <input
          type="tel"
          placeholder="Phone Number"
          className="w-full border p-4"
        />

        <textarea
          placeholder="How can I help?"
          className="w-full border p-4 h-32"
        />

        <button
          type="submit"
          className="bg-black text-white px-8 py-4"
        >
          Send Message
        </button>

      </form>

    </main>
  );
}