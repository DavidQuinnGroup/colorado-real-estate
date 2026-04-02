import { prisma } from "@/lib/prisma"

export async function processAlertQueue() {
  console.log("🚀 Processing Alert Queue...")

  // 1. Get pending alerts
  const alerts = await prisma.alertQueue.findMany({
    where: {
      status: "pending",
    },
    take: 10,
    orderBy: {
      createdAt: "asc",
    },
  })

  console.log(`📦 Found ${alerts.length} pending alerts`)

  if (alerts.length === 0) {
    console.log("✅ No alerts to process")
    return
  }

  // 2. Process each alert
  for (const alert of alerts) {
    try {
      console.log("📨 Processing alert:", alert.id)

      // Get user
      const user = await prisma.user.findUnique({
        where: { id: alert.userId },
      })

      if (!user) {
        throw new Error("User not found")
      }

      // 🔥 Simulated email (safe for now)
      console.log("📧 Sending email to:", user.email)
      console.log({
        address: alert.address,
        price: alert.price,
      })

      // 3. Mark as sent
      await prisma.alertQueue.update({
        where: { id: alert.id },
        data: {
          status: "sent",
          sentAt: new Date(),
        },
      })

      console.log(`✅ Alert ${alert.id} processed`)
    } catch (error) {
      console.error(`❌ Failed alert ${alert.id}`, error)
    }
  }

  console.log("🎉 Alert Queue Processing Complete")
}