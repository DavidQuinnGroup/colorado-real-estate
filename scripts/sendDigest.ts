import { prisma } from "@/lib/prisma"
import { sendAlert } from "@/lib/email/sendAlert"

async function runDigest() {
  const users = await prisma.user.findMany({
    include: {
      alertQueue: true,
    },
  })

  for (const user of users) {
    const listings = user.alertQueue
      .filter((a: any) => a.status === "pending")
      .map((a: any) => a.payload)

    if (!listings.length) continue

    await sendAlert({
      user,
      listings,
    })
  }
}

runDigest().catch((err) => {
  console.error("❌ Digest failed:", err)
  process.exit(1)
})