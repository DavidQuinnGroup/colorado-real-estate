import { prisma } from "@/lib/prisma"

export async function getLeadPerformance() {
  const leads = await prisma.sellerLead.findMany()

  const total = leads.length
  const contacted = leads.filter((l) => l.contactedAt).length
  const replied = leads.filter((l) => l.repliedAt).length
  const won = leads.filter((l) => l.status === "won").length

  return {
    total,
    contactedRate: contacted / total,
    replyRate: replied / total,
    winRate: won / total,
  }
}