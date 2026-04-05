import { prisma } from "@/lib/prisma"

export async function getVariantPerformance() {
  const db = prisma as any

  const leads = await db.sellerLead.findMany()

  const grouped: Record<string, any> = {}

  for (const lead of leads as any[]) {
    const variant = lead.variant || "unknown"

    if (!grouped[variant]) {
      grouped[variant] = {
        total: 0,
        contacted: 0,
        converted: 0,
      }
    }

    grouped[variant].total++

    if (lead.contactedAt) grouped[variant].contacted++
    if (lead.convertedAt) grouped[variant].converted++
  }

  return Object.entries(grouped).map(([variant, stats]) => ({
    variant,
    ...stats,
    contactRate: stats.total ? stats.contacted / stats.total : 0,
    conversionRate: stats.total ? stats.converted / stats.total : 0,
  }))
}