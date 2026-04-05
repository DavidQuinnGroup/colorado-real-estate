import { prisma } from "@/lib/prisma"

const VARIANTS = ["A", "B"]
const EPSILON = 0.2 // exploration rate

export async function selectVariantBandit() {
  try {
    // 🎲 Exploration (random)
    if (Math.random() < EPSILON) {
      return randomVariant()
    }

    // 📊 Exploitation (best performer)
    const stats = await getVariantStats()

    let bestVariant = VARIANTS[0]
    let bestScore = -1

    for (const v of VARIANTS) {
      const s = stats[v]

      if (!s || s.total < 5) continue // avoid early bias

      const replyRate = s.replies / s.total

      if (replyRate > bestScore) {
        bestScore = replyRate
        bestVariant = v
      }
    }

    return bestVariant
  } catch (err) {
    console.error("Bandit error:", err)
    return randomVariant()
  }
}

function randomVariant() {
  return VARIANTS[Math.floor(Math.random() * VARIANTS.length)]
}

async function getVariantStats() {
  const db = prisma as any

const leads = await db.sellerLead.findMany()

  const stats: Record<
    string,
    { total: number; replies: number }
  > = {}

  for (const v of VARIANTS) {
    stats[v] = { total: 0, replies: 0 }
  }

  for (const l of leads) {
    const v = l.variant
    if (!v || !stats[v]) continue

    stats[v].total++

    if (l.repliedAt) {
      stats[v].replies++
    }
  }

  return stats
}