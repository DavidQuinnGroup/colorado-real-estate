import { prisma } from "@/lib/prisma"

const VARIANTS = ["A", "B"]
const EPSILON = 0.2

export async function selectVariantContextual(contextKey: string) {
  try {
    // 🎲 Exploration
    if (Math.random() < EPSILON) {
      return randomVariant()
    }

    const stats = await getContextStats(contextKey)

    let bestVariant = VARIANTS[0]
    let bestScore = -1

    for (const v of VARIANTS) {
      const s = stats[v]

      if (!s || s.total < 3) continue

      // 🧠 MULTI-SIGNAL SCORE
      const replyRate = s.replies / s.total
      const winRate = s.wins / s.total

      const score = replyRate * 0.7 + winRate * 0.3

      if (score > bestScore) {
        bestScore = score
        bestVariant = v
      }
    }

    return bestVariant
  } catch (err) {
    console.error("Contextual bandit error:", err)
    return randomVariant()
  }
}

function randomVariant() {
  return VARIANTS[Math.floor(Math.random() * VARIANTS.length)]
}

async function getContextStats(contextKey: string) {
  const leads = await prisma.sellerLead.findMany({
    where: {
      contextKey,
    },
  })

  const stats: Record<
    string,
    { total: number; replies: number; wins: number }
  > = {}

  for (const v of VARIANTS) {
    stats[v] = { total: 0, replies: 0, wins: 0 }
  }

  for (const l of leads) {
    const v = l.variant
    if (!v || !stats[v]) continue

    stats[v].total++

    if (l.repliedAt) stats[v].replies++
    if (l.status === "won") stats[v].wins++
  }

  return stats
}