import { NextResponse } from 'next/server';

import { sendPropertyInquiryNotification } from '@/lib/email/sendPropertyInquiryNotification';
import { prisma } from '@/lib/prisma';

type PropertyInquiryBody = {
  propertyId?: unknown;
  email?: unknown;
  name?: unknown;
  phone?: unknown;
  timeline?: unknown;
  notes?: unknown;
  source?: unknown;
};

const MAX_NAME_LENGTH = 120;
const MAX_PHONE_LENGTH = 40;
const MAX_TIMELINE_LENGTH = 40;
const MAX_NOTES_LENGTH = 600;
const PROPERTY_INQUIRY_HEAT_SCORE = 35;
const PROPERTY_INQUIRY_NOTIFICATION_CHANNEL = 'property-inquiry-email';

type PropertyInquiryNotificationStatus = {
  sent: boolean;
  reason: string;
  attempted: boolean;
  required: boolean;
  priority: ReturnType<typeof getPriority>;
  channel: typeof PROPERTY_INQUIRY_NOTIFICATION_CHANNEL;
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status });
}

function getString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function getBoundedString(value: unknown, maxLength: number) {
  const text = getString(value);
  if (!text) return null;

  return text.slice(0, maxLength);
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getPriority(timeline: string | null) {
  if (timeline === 'now' || timeline === 'tour') return 'high';
  if (timeline === 'ninety-days') return 'medium';
  return 'low';
}

function shouldNotify(timeline: string | null) {
  return getPriority(timeline) === 'high';
}

function buildNotificationStatus({
  sent,
  reason,
  priority,
  required,
}: {
  sent: boolean;
  reason: string;
  priority: ReturnType<typeof getPriority>;
  required: boolean;
}): PropertyInquiryNotificationStatus {
  return {
    sent,
    reason,
    attempted: required,
    required,
    priority,
    channel: PROPERTY_INQUIRY_NOTIFICATION_CHANNEL,
  };
}

function getTimelineLabel(timeline: string | null) {
  if (timeline === 'now') return 'Ready now';
  if (timeline === 'tour') return 'Schedule tour';
  if (timeline === 'ninety-days') return '90 days';
  if (timeline === 'research') return 'Researching';
  return 'Not specified';
}

function buildTaskTitle(address: string, city: string, timeline: string | null) {
  const prefix = timeline === 'tour' ? 'TOUR REQUEST' : 'PROPERTY INQUIRY';
  return `${prefix}: ${address}, ${city}`;
}

async function ensurePropertyInquirySchema() {
  await prisma.$executeRawUnsafe('CREATE EXTENSION IF NOT EXISTS pgcrypto');
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "LeadInteraction" (
      "id" TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
      "clientId" TEXT NOT NULL,
      "propertyId" TEXT NOT NULL,
      "interactionType" TEXT NOT NULL,
      "metadata" JSONB,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "LeadInteraction_pkey" PRIMARY KEY ("id")
    )
  `);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as PropertyInquiryBody;
    const propertyId = getString(body.propertyId);
    const email = getString(body.email)?.toLowerCase() ?? null;
    const name = getBoundedString(body.name, MAX_NAME_LENGTH);
    const phone = getBoundedString(body.phone, MAX_PHONE_LENGTH);
    const timeline = getBoundedString(body.timeline, MAX_TIMELINE_LENGTH);
    const notes = getBoundedString(body.notes, MAX_NOTES_LENGTH);
    const source = getBoundedString(body.source, 80) || 'property-page';

    if (!propertyId) {
      return jsonResponse({ error: 'A property reference is required.' }, 400);
    }

    if (!email || !isValidEmail(email)) {
      return jsonResponse({ error: 'A valid email address is required.' }, 400);
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: {
        id: true,
        mlsId: true,
        slug: true,
        address: true,
        city: true,
        state: true,
        zip: true,
        price: true,
        propertyType: true,
        status: true,
      },
    });

    if (!property) {
      return jsonResponse({ error: 'Property could not be found.' }, 404);
    }

    await ensurePropertyInquirySchema();

    const metadata = {
      schemaVersion: 'reie-property-inquiry-v1',
      capturedAt: new Date().toISOString(),
      source,
      leadTemperature: timeline === 'now' || timeline === 'tour' ? 'hot' : 'warm',
      heatScoreIncrement: PROPERTY_INQUIRY_HEAT_SCORE,
      timeline,
      timelineLabel: getTimelineLabel(timeline),
      phone,
      notes,
      property: {
        id: property.id,
        mlsId: property.mlsId,
        slug: property.slug,
        address: property.address,
        city: property.city,
        state: property.state,
        zip: property.zip,
        price: property.price,
        propertyType: property.propertyType,
        status: property.status,
      },
      nextAction:
        timeline === 'tour'
          ? 'Confirm showing availability and prepare property-specific REIE brief.'
          : 'Follow up with property-specific context, risk review, and buyer strategy questions.',
    };

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.upsert({
        where: { email },
        update: {
          name: name ?? undefined,
          isUnsubscribed: false,
          unsubscribedAt: null,
          heatScore: {
            increment: PROPERTY_INQUIRY_HEAT_SCORE,
          },
          intentSchema: 'property-inquiry',
          legacyGoal: 'Property inquiry',
        },
        create: {
          email,
          name,
          status: 'Lead',
          heatScore: PROPERTY_INQUIRY_HEAT_SCORE,
          intentSchema: 'property-inquiry',
          legacyGoal: 'Property inquiry',
        },
      });

      const userInteraction = await tx.userInteraction.create({
        data: {
          userId: user.id,
          type: 'property_inquiry',
          metadata,
        },
      });

      const leadInteraction = await tx.leadInteraction.create({
        data: {
          clientId: user.id,
          propertyId: property.id,
          interactionType: 'property_inquiry',
          metadata,
        },
      });

      const [crmTask] = await tx.$queryRaw<{ id: string }[]>`
        INSERT INTO "CRMTask" ("leadId", "type", "priority", "title", "metadata")
        VALUES (
          ${user.id},
          'property_inquiry',
          ${getPriority(timeline)},
          ${buildTaskTitle(property.address, property.city, timeline)},
          ${JSON.stringify(metadata)}::jsonb
        )
        RETURNING "id"::text AS "id"
      `;

      if (!crmTask) throw new Error('Property inquiry CRM task could not be created.');

      return {
        user,
        userInteraction,
        leadInteraction,
        crmTask,
      };
    });

    const priority = getPriority(timeline);
    const notificationRequired = shouldNotify(timeline);
    let notification = buildNotificationStatus({
      sent: false,
      reason: 'not-high-priority',
      priority,
      required: notificationRequired,
    });

    if (notificationRequired) {
      try {
        const notificationResult = await sendPropertyInquiryNotification({
          inquiryId: result.leadInteraction.id,
          crmTaskId: result.crmTask.id,
          leadEmail: email,
          leadName: name,
          leadPhone: phone,
          timelineLabel: metadata.timelineLabel,
          leadTemperature: metadata.leadTemperature,
          notes,
          property: {
            id: property.id,
            mlsId: property.mlsId,
            slug: property.slug,
            address: property.address,
            city: property.city,
            state: property.state,
            zip: property.zip,
            price: property.price,
            propertyType: property.propertyType,
            status: property.status,
          },
        });

        notification =
          'sent' in notificationResult
            ? buildNotificationStatus({
                sent: notificationResult.sent,
                reason: notificationResult.reason || 'notification-skipped',
                priority,
                required: notificationRequired,
              })
            : buildNotificationStatus({
                sent: true,
                reason: 'sent',
                priority,
                required: notificationRequired,
              });
      } catch (notificationError) {
        console.error('[REIE PROPERTY INQUIRY NOTIFICATION]', notificationError);
        notification = buildNotificationStatus({
          sent: false,
          reason: 'notification-error',
          priority,
          required: notificationRequired,
        });
      }
    }

    return jsonResponse({
      success: true,
      userId: result.user.id,
      interactionId: result.userInteraction.id,
      leadInteractionId: result.leadInteraction.id,
      crmTaskId: result.crmTask.id,
      intake: {
        leadTemperature: metadata.leadTemperature,
        heatScoreIncrement: PROPERTY_INQUIRY_HEAT_SCORE,
        timeline,
        timelineLabel: metadata.timelineLabel,
      },
      notification,
    });
  } catch (error) {
    console.error('[REIE PROPERTY INQUIRY]', error);
    return jsonResponse({ error: 'Property inquiry could not be saved.' }, 500);
  }
}
