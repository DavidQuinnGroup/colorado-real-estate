import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateUserPreferences } from "@/lib/preferences/updateUserPreferences";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const listingId = searchParams.get("l");
    const userId = searchParams.get("u");

    if (!listingId || !userId) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    // 🔒 Update clickedAt for matching alerts
    const db = prisma as any

await db.alertQueue.updateMany({
      where: {
        listingId,
        userId,
        status: "sent",
        clickedAt: null,
      },
      data: {
        clickedAt: new Date(),
      },
    });

    // 🧠 Trigger preference learning (async, don't block redirect)
    updateUserPreferences(userId).catch((err) => {
      console.error("Preference update failed:", err);
    });

    // 🔁 Redirect to listing page
    const redirectUrl = `/listing/${listingId}`;

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Track click error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}