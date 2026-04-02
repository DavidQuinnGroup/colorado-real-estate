import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendSellerOutreach } from "@/lib/outreach/sendSellerOutreach"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      )
    }

    // ==============================
    // 🧠 GET EXISTING LEAD
    // ==============================
    const existing = await prisma.sellerLead.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: "Lead not found" },
        { status: 404 }
      )
    }

    // ==============================
    // 🔁 PREVENT DUPLICATE OUTREACH
    // ==============================
    const alreadyContacted = existing.status === "contacted"

    // ==============================
    // 💾 UPDATE STATUS
    // ==============================
    const updated = await prisma.sellerLead.update({
      where: { id },
      data: { status },
    })

    // ==============================
    // 🚀 TRIGGER OUTREACH
    // ==============================
    if (status === "contacted" && !alreadyContacted) {
      await sendSellerOutreach({
        // ⚠️ You will later enrich with real owner data
        email: undefined,
        phone: undefined,
        city: existing.city,
        reason: existing.reason,
      })
    }

    return NextResponse.json(updated)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    )
  }
}