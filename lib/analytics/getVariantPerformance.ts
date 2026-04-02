import { prisma } from "@/lib/prisma"

export async function getVariantPerformance() {
  const leads = await prisma.sellerLead.findMany()

  const grouped: Record<string, any> = {}

  for (const l of leads) {
    const v = l.variant || "unknown"

    if (!grouped[v]) {
      grouped[v] = {
        total: 0,
        replies: 0,
        wins: 0,
      }
    }

    grouped[v].total++

    if (l.repliedAt) grouped[v].replies++
    if (l.status === "won") grouped[v].wins++
  }

  return Object.entries(grouped).map(([variant, data]) => ({
    variant,
    replyRate: data.replies / data.total,
    winRate: data.wins / data.total,
  }))
}