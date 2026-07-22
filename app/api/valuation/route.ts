import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import {
  assertPublicRuntimeSchema,
  isPublicRuntimeSchemaUnavailableError,
} from '@/lib/runtime/publicSchemaSafety';

export const dynamic = 'force-dynamic';

type ValuationRequestBody = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  address?: unknown;
  city?: unknown;
  objective?: unknown;
  timeline?: unknown;
  notes?: unknown;
  source?: unknown;
};

type NormalizedValuationRequest = {
  name: string;
  email: string;
  phone: string | null;
  address: string;
  city: string;
  objective: string;
  timeline: string;
  notes: string | null;
  source: string;
};

const MAX_NAME_LENGTH = 120;
const MAX_PHONE_LENGTH = 40;
const MAX_ADDRESS_LENGTH = 180;
const MAX_CITY_LENGTH = 80;
const MAX_OBJECTIVE_LENGTH = 80;
const MAX_TIMELINE_LENGTH = 40;
const MAX_NOTES_LENGTH = 700;
const SELLER_HEAT_SCORE = 45;
const SELLER_NOTIFICATION_CHANNEL = 'seller-follow-up-workflow';

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status });
}

function getString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function getBoundedString(value: unknown, maxLength: number) {
  const text = getString(value);
  return text ? text.slice(0, maxLength) : null;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizePropertyKey(address: string, email: string) {
  const key = `${address}:${email}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);

  return `seller-${key || 'request'}`;
}

function getObjectiveLabel(objective: string) {
  if (objective === 'pricing') return 'Pricing and positioning';
  if (objective === 'prepare') return 'Preparation priorities';
  if (objective === 'timing') return 'Timing and market strategy';
  if (objective === 'equity') return 'Equity and next move planning';
  return 'Seller consultation';
}

function getTimelineLabel(timeline: string) {
  if (timeline === 'now') return 'Ready now';
  if (timeline === 'ninety-days') return 'Next 90 days';
  if (timeline === 'six-months') return 'Three to six months';
  if (timeline === 'research') return 'Researching options';
  return 'Timeline to discuss';
}

function getPriority(timeline: string) {
  if (timeline === 'now') return 'high';
  if (timeline === 'ninety-days') return 'medium';
  return 'low';
}

function normalizeRequestBody(body: ValuationRequestBody): NormalizedValuationRequest | { error: string } {
  const name = getBoundedString(body.name, MAX_NAME_LENGTH) ?? '';
  const email = getBoundedString(body.email, 160)?.toLowerCase() ?? '';
  const address = getBoundedString(body.address, MAX_ADDRESS_LENGTH) ?? '';
  const city = getBoundedString(body.city, MAX_CITY_LENGTH) ?? 'Colorado';
  const objective = getBoundedString(body.objective, MAX_OBJECTIVE_LENGTH) ?? 'consultation';
  const timeline = getBoundedString(body.timeline, MAX_TIMELINE_LENGTH) ?? 'research';

  if (!name) return { error: 'Please enter your name.' };
  if (!email || !isValidEmail(email)) return { error: 'Please enter a valid email address.' };
  if (!address) return { error: 'Please enter the property address.' };

  return {
    name,
    email,
    phone: getBoundedString(body.phone, MAX_PHONE_LENGTH),
    address,
    city,
    objective,
    timeline,
    notes: getBoundedString(body.notes, MAX_NOTES_LENGTH),
    source: getBoundedString(body.source, 80) ?? 'seller-page',
  };
}

async function assertSellerIntakeSchema() {
  await assertPublicRuntimeSchema(prisma, [
    { tableName: 'User', columns: ['id', 'email', 'name', 'isUnsubscribed', 'unsubscribedAt', 'heatScore', 'intentSchema', 'legacyGoal', 'status'] },
    { tableName: 'UserInteraction', columns: ['id', 'userId', 'type', 'metadata', 'createdAt'] },
    { tableName: 'CRMTask', columns: ['id', 'leadId', 'type', 'status', 'priority', 'title', 'metadata', 'createdAt'] },
  ]);
}

async function isSellerLeadSchemaAvailable() {
  try {
    await assertPublicRuntimeSchema(prisma, [
      { tableName: 'SellerLead', columns: ['id', 'city', 'beds', 'price', 'reason', 'propertyId'] },
    ]);

    return true;
  } catch (error) {
    if (isPublicRuntimeSchemaUnavailableError(error)) {
      console.error('Optional SellerLead schema unavailable for seller intake:', {
        code: error.code,
        missingTables: error.missingTables,
        missingColumns: error.missingColumns,
      });

      return false;
    }

    throw error;
  }
}

function buildMetadata(
  input: NormalizedValuationRequest,
  propertyKey: string,
  duplicateSellerRequest: boolean,
  sellerLeadStatus: 'available' | 'unavailable',
) {
  return {
    schemaVersion: 'reie-seller-intake-v1',
    capturedAt: new Date().toISOString(),
    source: input.source,
    propertyKey,
    leadType: 'seller',
    objective: input.objective,
    objectiveLabel: getObjectiveLabel(input.objective),
    timeline: input.timeline,
    timelineLabel: getTimelineLabel(input.timeline),
    phone: input.phone,
    notes: input.notes,
    property: {
      address: input.address,
      city: input.city,
    },
    duplicateSellerRequest,
    sellerLeadStatus,
    notification: {
      channel: SELLER_NOTIFICATION_CHANNEL,
      status: 'not_sent',
      reason: 'Seller requests are queued for advisor follow-up; live email delivery is not part of this public submission path.',
    },
    nextAction: 'Review seller objective, property context, preparation priorities, and pricing strategy before direct follow-up.',
  };
}

function getTaskTitle(input: NormalizedValuationRequest) {
  return `SELLER REQUEST: ${input.address}, ${input.city}`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as ValuationRequestBody;
    const input = normalizeRequestBody(body);

    if ('error' in input) {
      return jsonResponse({ error: input.error }, 400);
    }

    await assertSellerIntakeSchema();
    const sellerLeadSchemaAvailable = await isSellerLeadSchemaAvailable();

    const propertyKey = normalizePropertyKey(input.address, input.email);
    const result = await prisma.$transaction(async (tx) => {
      const existingSellerLead = sellerLeadSchemaAvailable
        ? await tx.sellerLead.findFirst({
            where: { propertyId: propertyKey },
          })
        : null;

      const existingUser = await tx.user.findUnique({
        where: { email: input.email },
        include: {
          crmTasks: {
            where: {
              type: 'strategy_intake',
              title: getTaskTitle(input),
            },
            take: 1,
          },
        },
      });

      const duplicateSellerRequest = Boolean(existingSellerLead || existingUser?.crmTasks[0]);
      const metadata = buildMetadata(
        input,
        propertyKey,
        duplicateSellerRequest,
        sellerLeadSchemaAvailable ? 'available' : 'unavailable',
      );

      const user = await tx.user.upsert({
        where: { email: input.email },
        update: {
          name: input.name,
          isUnsubscribed: false,
          unsubscribedAt: null,
          heatScore: {
            increment: duplicateSellerRequest ? 0 : SELLER_HEAT_SCORE,
          },
          intentSchema: 'seller-intake',
          legacyGoal: 'Seller strategy',
        },
        create: {
          email: input.email,
          name: input.name,
          status: 'Lead',
          heatScore: SELLER_HEAT_SCORE,
          intentSchema: 'seller-intake',
          legacyGoal: 'Seller strategy',
        },
      });

      const sellerLead = sellerLeadSchemaAvailable
        ? existingSellerLead ??
          (await tx.sellerLead.create({
            data: {
              propertyId: propertyKey,
              city: input.city,
              beds: null,
              price: null,
              reason: `${getObjectiveLabel(input.objective)} | ${getTimelineLabel(input.timeline)}`,
            },
          }))
        : null;

      const userInteraction = await tx.userInteraction.create({
        data: {
          userId: user.id,
          type: 'seller_valuation_request',
          metadata: {
            ...metadata,
            sellerLeadId: sellerLead?.id ?? null,
          },
        },
      });

      const crmTask = duplicateSellerRequest
        ? null
        : await tx.cRMTask.create({
            data: {
              leadId: user.id,
              type: 'strategy_intake',
              priority: getPriority(input.timeline),
              title: getTaskTitle(input),
              metadata: {
                ...metadata,
                sellerLeadId: sellerLead?.id ?? null,
                userInteractionId: userInteraction.id,
              },
            },
          });

      return {
        user,
        sellerLead,
        userInteraction,
        crmTask,
        duplicate: duplicateSellerRequest,
        sellerLeadSchemaAvailable,
      };
    });

    return jsonResponse({
      success: true,
      requestId: result.userInteraction.id,
      status: result.duplicate ? 'already-saved' : 'saved',
      sellerLeadStatus: result.sellerLeadSchemaAvailable
        ? result.duplicate
          ? 'existing'
          : 'created'
        : 'unavailable',
      followUp: {
        channel: SELLER_NOTIFICATION_CHANNEL,
        status: 'queued-for-advisor-review',
        emailSent: false,
        nextStep: 'David Quinn Group will review the property details and follow up through the submitted contact information.',
      },
    });
  } catch (error) {
    if (isPublicRuntimeSchemaUnavailableError(error)) {
      console.error('Seller intake schema unavailable:', {
        code: error.code,
        missingTables: error.missingTables,
        missingColumns: error.missingColumns,
      });

      return jsonResponse(
        {
          error: 'Seller requests are temporarily unavailable.',
          code: 'schema-unavailable',
        },
        503,
      );
    }

    console.error('Seller intake failed:', error instanceof Error ? error.message : String(error));
    return jsonResponse({ error: 'Unable to save this seller request right now.' }, 500);
  }
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/valuation/route.ts
