import { prisma } from "@/lib/prisma"
import { alertQueue } from "@/lib/queue/alertQueue"

export async function matchAndNotify(property: any) {
  // 1. Find matching saved searches
  const searches = await prisma.savedSearch.findMany({
    where: {
      isActive: true,
      city: property.city,
      AND: [
        {
          OR: [
            { minPrice: null },
            { minPrice: { lte: property.price } },
          ],
        },
        {
          OR: [
            { beds: null },
            { beds: { lte: property.beds } },
          ],
        },
      ],
    },
    include: {
      user: true,
    },
  })

  console.log(`🔎 Found ${searches.length} matching searches`)

  // 2. Loop through searches
  for (const search of searches) {
    if (!search.user?.email) continue

    // 🔒 Deduplication (event-level)
    const existing = await prisma.alertEvent.findUnique({
      where: {
        userId_propertyId_type: {
          userId: search.user.id,
          propertyId: property.id,
          type: "NEW_LISTING",
        },
      },
    })

    if (existing) {
      console.log(`⏭️ Skipping duplicate for ${search.user.email}`)
      continue
    }

    try {
      // ✅ 1. Create alert in DB (source of truth)
      await prisma.alertQueue.create({
        data: {
          userId: search.user.id,
          listingId: property.id,
          payload: property, // 🔥 REQUIRED for batching worker
          status: "pending",
        },
      })

      // ✅ 2. Enqueue (batched per user)
      await alertQueue.add(
        "alerts",
        {
          userId: search.user.id,
        },
        {
          delay: 1000 * 60 * 10, // ⏱ 10-minute batching window
          jobId: `alerts-${search.user.id}`, // 🔥 ensures ONE job per user
        }
      )

      // ✅ 3. Record deduplication event
      await prisma.alertEvent.create({
        data: {
          userId: search.user.id,
          propertyId: property.id,
          type: "NEW_LISTING",
        },
      })

      console.log(`📦 Batched alert for ${search.user.email}`)
    } catch (err) {
      console.error("Queue failed:", err)
    }
  }
}