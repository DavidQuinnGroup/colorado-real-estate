import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const leads = await prisma.sellerLead.findMany({
      orderBy: [
        { dealScore: "desc" },
        { createdAt: "desc" },
      ],
    })

    return NextResponse.json(leads)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    )
  }
}