import { prisma } from "@/lib/prisma"
import { propertyAlertTemplate } from "@/lib/email/templates/propertyAlert"

async function runAlerts() {
  const alerts = await prisma.alertQueue.findMany({
    where: { status: "pending" },
  })

  for (const alert of alerts) {
    try {
      const payload = alert.payload as any

      if (!payload) {
        console.warn("⚠️ Skipping alert — missing payload", alert.id)
        continue
      }

      const html = propertyAlertTemplate({
        address: payload.address ?? "",
        price: payload.price ?? 0,
        beds: payload.beds ?? 0,
        baths: payload.baths ?? 0,
        link: payload.url ?? "",
      })

      console.log("📧 Rendered alert for:", alert.id)

      await prisma.alertQueue.update({
        where: { id: alert.id },
        data: { status: "sent" },
      })
    } catch (err) {
      console.error("❌ Alert processing failed:", alert.id, err)

      await prisma.alertQueue.update({
        where: { id: alert.id },
        data: { status: "failed" },
      })
    }
  }
}

runAlerts()