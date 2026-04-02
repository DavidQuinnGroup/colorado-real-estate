import { fetchMLSListings } from "@/lib/mls/fetchMLS"
import { processListing } from "@/lib/mls/processListing"

export async function GET() {

  try {

    const listings = await fetchMLSListings()

    for (const listing of listings) {

      await processListing(listing)

    }

    return Response.json({
      success: true,
      processed: listings.length
    })

  } catch (error) {

    console.error(error)

    return Response.json({
      success: false
    })

  }

}