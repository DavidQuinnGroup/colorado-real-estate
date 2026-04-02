import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json(
        { error: "Invalid unsubscribe link" },
        { status: 400 }
      )
    }

    // ✅ 1. Find token
    const record = await prisma.unsubscribeToken.findUnique({
      where: { token },
      include: {
        user: true,
        search: true
      }
    })

    if (!record) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 404 }
      )
    }

    // ✅ 2. Mark token as used
    await prisma.unsubscribeToken.update({
      where: { token },
      data: {
        usedAt: new Date()
      }
    })

    // ✅ 3. If tied to a search → disable that search
    if (record.searchId) {
      await prisma.savedSearch.update({
        where: { id: record.searchId },
        data: {
          isActive: false
        }
      })

      return new Response(
        `
        <html>
          <body style="font-family:Arial;padding:40px;">
            <h2>You’ve been unsubscribed</h2>
            <p>You will no longer receive alerts for this search.</p>
          </body>
        </html>
        `,
        { headers: { "Content-Type": "text/html" } }
      )
    }

    // ✅ 4. Otherwise → global unsubscribe
    await prisma.user.update({
      where: { id: record.userId },
      data: {
        isUnsubscribed: true,
        unsubscribedAt: new Date()
      }
    })

    return new Response(
      `
      <html>
        <body style="font-family:Arial;padding:40px;">
          <h2>You’ve been unsubscribed</h2>
          <p>You will no longer receive any listing alerts.</p>
        </body>
      </html>
      `,
      { headers: { "Content-Type": "text/html" } }
    )

  } catch (error) {
    console.error("Unsubscribe error:", error)

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}