import { prisma } from "@/lib/prisma"

interface SearchParams {
  city?: string
  minPrice?: number
  maxPrice?: number
  beds?: number
  baths?: number
  limit?: number
  offset?: number
}

export async function searchProperties(params: SearchParams) {

  const {
    city,
    minPrice,
    maxPrice,
    beds,
    baths,
    limit = 20,
    offset = 0
  } = params

  const results = await prisma.property.findMany({
    where: {
      city: city ? { equals: city, mode: "insensitive" } : undefined,

      price: {
        gte: minPrice ?? undefined,
        lte: maxPrice ?? undefined
      },

      bedrooms: beds ? { gte: beds } : undefined,

      bathrooms: baths ? { gte: baths } : undefined
    },

    include: {
      photos: {
        take: 1
      }
    },

    orderBy: {
      price: "desc"
    },

    take: limit,
    skip: offset
  })

  return results
}