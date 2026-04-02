import { prisma } from "@/lib/prisma"
import { getOutreachStrategy } from "@/lib/outreach/getOutreachStrategy"

type Input = {
  listingId: string
  city?: string
  price?: number
  beds?: number
  dealScore: number
  reason?: string
}

function getPriority(score: number) {
  if (score >= 60) return "hot"
  if (score >= 40) return "warm"
  return "cold"
}

export async function createSellerLead(input: Input) {
  try {
    // 🔁 HARD DEDUP (by listingId)
    const existing = await prisma.sellerLead.findFirst({
      where: {
        listingId: input.listingId,
      },
    })

    if (existing) {
      return existing
    }

    const priority = getPriority(input.dealScore)

    const strategy = getOutreachStrategy(input.dealScore)

    const lead = await prisma.sellerLead.create({
      data: {
        listingId: input.listingId,
        city: input.city,
        price: input.price,
        beds: input.beds,
        dealScore: input.dealScore,
        reason: input.reason,
        status: "new",
        priority,
        strategy,
      },
    })

    return lead
  } catch (err) {
    console.error("createSellerLead error:", err)
    return null
  }
}