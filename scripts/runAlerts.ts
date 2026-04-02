import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email/sendEmail"
import { propertyAlertTemplate } from "@/lib/email/templates/propertyAlert"

export async function runAlerts() {
  console.log("🚀 Processing Alert Queue...")

  const alerts = await prisma.alertQueue.findMany({
    where: {
      status: "pending",
    },
    include: {
      user: true,
    },
  })

  console.log(`📦 Found ${alerts.length} pending alerts`)

  for (const alert of alerts) {
    try {
      console.log(`📨 Processing alert: ${alert.id}`)

      const { user, payload } = alert

      if (!user?.email) {
        throw new Error("User email missing")
      }

      const html = propertyAlertTemplate({
  address: payload.address,
  price: payload.price,
  beds: payload.beds,
  baths: payload.baths,
  sqft: payload.sqft,
  imageUrl: payload.imageUrl,
  link: `http://localhost:3000/api/track-click?alertId=${alert.id}`,
})

      await sendEmail({
        to: user.email,
        subject: "🏡 New Property Match",
        html,
      })

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

      await prisma.alertQueue.update({
        where: { id: alert.id },
        data: {
          status: "failed",
        },
      })
    }
  }

  console.log("🎉 Alert Queue Processing Complete")
}

runAlerts()
  .then(() => {
    console.log("✅ Done")
    process.exit(0)
  })
  .catch((err) => {
    console.error("❌ Fatal error:", err)
    process.exit(1)
  })