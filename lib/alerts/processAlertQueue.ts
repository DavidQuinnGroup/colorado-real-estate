import { prisma } from "@/lib/prisma"

export async function processAlertQueue() {
  const db = prisma as any

  try {
    // 1. Get pending alerts
    const alerts = await db.alertQueue.findMany({
      where: {
        status: "pending",
      },
      take: 50,
    })

    console.log(`📦 Processing ${alerts.length} alerts`)

    for (const alert of alerts as any[]) {
      try {
        // 🔒 Mark as processing (optional safety)
        await db.alertQueue.update({
          where: { id: alert.id },
          data: { status: "processing" },
        })

        // 🚫 Worker/email sending disabled for now
        await Promise.resolve()

        // ✅ Mark as sent
        await db.alertQueue.update({
          where: { id: alert.id },
          data: {
            status: "sent",
            processedAt: new Date(),
          },
        })

      } catch (err) {
        console.error("❌ Alert failed:", err)

        // Mark failed
        await db.alertQueue.update({
          where: { id: alert.id },
          data: {
            status: "failed",
          },
        })
      }
    }

    return { success: true }

  } catch (error) {
    console.error("Queue processing error:", error)
    return { success: false }
  }
}