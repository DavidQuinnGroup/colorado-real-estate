export const dynamic = "force-dynamic"

export async function GET(req: Request) {

  // ✅ HARD STOP DURING BUILD
  if (process.env.NEXT_PHASE === "phase-production-build") {
    console.log("⛔ Skipping /api/search during build")
    return new Response(JSON.stringify({ results: [] }), {
      status: 200,
    })
  }

  // ✅ LAZY IMPORTS (CRITICAL)
  const { searchListings } = await import("@/lib/search/searchListings")

  // your logic
  const results = await searchListings()

  return new Response(JSON.stringify({ results }))
}