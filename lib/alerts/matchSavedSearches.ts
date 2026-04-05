import { prisma } from "@/lib/prisma"

export async function matchSavedSearches(listing: any) {
  const db = prisma as any

const searches = await db.savedSearch.findMany({
    where: {
      isActive: true,
      city: listing.city,
    },
  })

  return searches.filter((search: any) => {
    if (search.minPrice && listing.price < search.minPrice) return false
    if (search.beds && listing.beds < search.beds) return false
    if (search.type && listing.propertyType !== search.type) return false

    // Bounding box filter
    if (
      search.north &&
      search.south &&
      search.east &&
      search.west
    ) {
      if (
        listing.lat > search.north ||
        listing.lat < search.south ||
        listing.lng > search.east ||
        listing.lng < search.west
      ) {
        return false
      }
    }

    return true
  })
}