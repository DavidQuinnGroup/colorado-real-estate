import { prisma } from "@/lib/prisma"

export async function getLeadPerformance() {
  const db = prisma as any

  const leads = await db.sellerLead.findMany()

  const total = leads.length
  const contacted = leads.filter((l: any) => l.contactedAt).length
  const converted = leads.filter((l: any) => l.convertedAt).length

  return {
    total,
    contacted,
    converted,
    contactRate: total ? contacted / total : 0,
    conversionRate: total ? converted / total : 0,
  }
}