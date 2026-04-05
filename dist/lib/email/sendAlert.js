"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAlert = sendAlert;
const resend_1 = require("resend");
const prisma_1 = require("@/lib/prisma");
const listingDigest_1 = require("@/lib/email/templates/listingDigest");
const createSellerLead_1 = require("@/lib/seller/createSellerLead");
const createTask_1 = require("@/lib/crm/createTask");
async function sendAlert({ user, listings = [], }) {
    // ==============================
    // 🔒 VALIDATION
    // ==============================
    if (!process.env.RESEND_API_KEY)
        return;
    if (!user?.email || !user?.id)
        return;
    if (!Array.isArray(listings) || listings.length === 0)
        return;
    const db = prisma_1.prisma;
    const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    // ==============================
    // 🧠 MARKET BASELINE
    // ==============================
    const historical = await db.alertQueue.findMany({
        where: { payload: { not: null } },
        take: 500,
        select: { payload: true },
    });
    const market = {};
    for (const h of historical) {
        const p = h.payload;
        if (!p.city || !p.price || !p.beds)
            continue;
        const key = `${p.city}-${p.beds}`;
        if (!market[key])
            market[key] = [];
        market[key].push(p.price);
    }
    const baseline = {};
    for (const key in market) {
        const arr = market[key];
        baseline[key] =
            arr.reduce((a, b) => a + b, 0) / arr.length;
    }
    // ==============================
    // 💰 DEAL ENGINE
    // ==============================
    function analyzeDeal(listing) {
        if (!listing.city || !listing.price || !listing.beds) {
            return { score: 0, reason: "" };
        }
        const key = `${listing.city}-${listing.beds}`;
        const avg = baseline[key];
        if (!avg)
            return { score: 0, reason: "" };
        const diff = avg - listing.price;
        const percent = diff / avg;
        let score = 0;
        let reason = "";
        if (percent > 0.2) {
            score = 60;
            reason = `Priced ~${Math.round(percent * 100)}% below avg for ${listing.beds}-bed homes in ${listing.city}`;
        }
        else if (percent > 0.1) {
            score = 40;
            reason = `Below market average in ${listing.city}`;
        }
        else if (percent > 0.05) {
            score = 20;
            reason = `Slightly under market pricing`;
        }
        return { score, reason };
    }
    // ==============================
    // ⏱️ URGENCY ENGINE
    // ==============================
    function urgency(listing) {
        if (!listing.createdAt)
            return "";
        const hours = (Date.now() - new Date(listing.createdAt).getTime()) /
            (1000 * 60 * 60);
        if (hours < 24)
            return "New listing — likely to sell fast";
        if (hours < 72)
            return "High interest window";
        return "";
    }
    // ==============================
    // 🏡 SELLER OPPORTUNITY CHECK
    // ==============================
    function isSellerOpportunity(dealScore) {
        return dealScore >= 40;
    }
    // ==============================
    // 🚦 RATE LIMITING CONFIG
    // ==============================
    const MAX_LEADS_PER_RUN = 10;
    let leadsCreated = 0;
    // ==============================
    // 🧠 FINAL BUILD (ASYNC SAFE)
    // ==============================
    const enriched = [];
    for (const l of listings) {
        const deal = analyzeDeal(l);
        const urg = urgency(l);
        // ==============================
        // 🏡 SELLER LEAD PIPELINE
        // ==============================
        if (isSellerOpportunity(deal.score)) {
            if (leadsCreated < MAX_LEADS_PER_RUN) {
                try {
                    if (!l.id || !l.city) {
                        console.warn("⚠️ Skipping seller lead — missing required fields", {
                            id: l.id,
                            city: l.city,
                        });
                    }
                    else {
                        const lead = await (0, createSellerLead_1.createSellerLead)({
                            propertyId: l.id,
                            city: l.city,
                            price: l.price ?? null,
                            beds: l.beds ?? null,
                            reason: `Deal score ${deal.score}`,
                        });
                        // ⚠️ Always valid (existing OR new)
                        if (lead) {
                            await (0, createTask_1.createTask)(lead.id);
                            leadsCreated++;
                        }
                    }
                }
                catch (err) {
                    console.error("Seller lead pipeline error:", err);
                }
            }
        }
        enriched.push({
            ...l,
            __dealScore: deal.score,
            __dealReason: deal.reason,
            __urgency: urg,
            url: `${baseUrl}/api/track-click?l=${l.id}&u=${user.id}`,
        });
    }
    // ==============================
    // 📧 SEND EMAIL
    // ==============================
    try {
        const html = (0, listingDigest_1.ListingDigestEmail)({
            listings: enriched,
        });
        await resend.emails.send({
            from: process.env.EMAIL_FROM || "onboarding@resend.dev",
            to: user.email,
            subject: `🔥 Deals & Opportunities in Your Market`,
            html,
        });
        console.log(`📧 Sent DEAL DIGEST → ${user.email} | Leads created: ${leadsCreated}`);
    }
    catch (err) {
        console.error("❌ Email send failed:", err);
    }
}
