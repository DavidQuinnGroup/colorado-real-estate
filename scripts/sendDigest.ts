import { prisma } from "@/lib/prisma"
import { sendAlert } from "@/lib/email/sendAlert"

export async function sendDigest() {
  const users = await prisma.user.findMany({
    include: {
      AlertQueue: true,
    },
  })

  for (const user of users) {
    if (user.AlertQueue.length === 0) continue

    const listings = await prisma.property.findMany({
      where: {
        id: {
          in: user.AlertQueue.map((a) => a.listingId),
        },
      },
    })

    await sendAlert({
      user,
      listings,
    })

    // clear queue after sending
    await prisma.alertQueue.deleteMany({
      where: { userId: user.id },
    })

    console.log(`📨 Digest sent to ${user.email}`)
  }
}