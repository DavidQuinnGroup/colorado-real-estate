export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    // 🚨 NEVER import at top level
    const { searchListings } = await import("../../../lib/search/searchListings");

    const { searchParams } = new URL(req.url);

    const query = searchParams.get("q") || "";
    const minPrice = Number(searchParams.get("minPrice") || 0);
    const maxPrice = Number(searchParams.get("maxPrice") || 10000000);

    const results = await searchListings({
      query,
      minPrice,
      maxPrice,
    });

    return Response.json({ results });
  } catch (err) {
    console.error("❌ SEARCH ERROR", err);
    return new Response("Search failed", { status: 500 });
  }
}