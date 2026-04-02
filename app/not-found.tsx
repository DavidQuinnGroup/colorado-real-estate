export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#111111] text-white flex items-center justify-center px-6">
      <div className="text-center max-w-xl">

        <h1 className="text-5xl tracking-widest mb-6">
          404
        </h1>

        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist.
        </p>

        <a
          href="/"
          className="border border-white px-8 py-3 text-sm tracking-widest hover:bg-white hover:text-black transition"
        >
          Return Home
        </a>

      </div>
    </main>
  );
}