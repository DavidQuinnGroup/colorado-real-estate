import { strict as assert } from 'node:assert';

import dotenv from 'dotenv';

import { prisma } from '../lib/prisma.js';

dotenv.config({ path: '.env.local', quiet: true });
dotenv.config({ quiet: true });

const SMOKE_MLS_ID = 'REIE-SMOKE-INQUIRY';
const SMOKE_SLUG = 'reie-smoke-property-inquiry';
const SMOKE_EMAIL = 'reie-property-inquiry-smoke@example.com';
const BASE_URL = (process.env.PROPERTY_INQUIRY_SMOKE_BASE_URL || 'http://localhost:3000').replace(/\/+$/, '');

type CleanupSummary = {
  crmTasks: number;
  userInteractions: number;
  leadInteractions: number;
  users: number;
  properties: number;
};

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

async function cleanup(): Promise<CleanupSummary> {
  const user = await prisma.user.findUnique({
    where: {
      email: SMOKE_EMAIL,
    },
    select: {
      id: true,
    },
  });

  const properties = await prisma.property.findMany({
    where: {
      mlsId: SMOKE_MLS_ID,
    },
    select: {
      id: true,
    },
  });

  const propertyIds = properties.map((property) => property.id);
  const leadInteractionConditions = [
    ...(user ? [{ clientId: user.id }] : []),
    ...(propertyIds.length > 0 ? [{ propertyId: { in: propertyIds } }] : []),
  ];

  const leadInteractions =
    leadInteractionConditions.length > 0
      ? await prisma.leadInteraction.deleteMany({
          where: {
            OR: leadInteractionConditions,
          },
        })
      : { count: 0 };

  const crmTasks = user
    ? await prisma.cRMTask.deleteMany({
        where: {
          leadId: user.id,
        },
      })
    : { count: 0 };

  const userInteractions = user
    ? await prisma.userInteraction.deleteMany({
        where: {
          userId: user.id,
        },
      })
    : { count: 0 };

  const users = user
    ? await prisma.user.deleteMany({
        where: {
          id: user.id,
        },
      })
    : { count: 0 };

  const propertiesDeleted = await prisma.property.deleteMany({
    where: {
      mlsId: SMOKE_MLS_ID,
    },
  });

  return {
    crmTasks: crmTasks.count,
    userInteractions: userInteractions.count,
    leadInteractions: leadInteractions.count,
    users: users.count,
    properties: propertiesDeleted.count,
  };
}

async function seedProperty() {
  return prisma.property.create({
    data: {
      mlsId: SMOKE_MLS_ID,
      slug: SMOKE_SLUG,
      address: '123 REIE Smoke Test Way',
      city: 'Boulder',
      state: 'CO',
      zip: '80302',
      price: 975000,
      beds: 4,
      baths: 3,
      sqft: 2650,
      lotSize: 0.18,
      yearBuilt: 1998,
      propertyType: 'Residential',
      status: 'Active',
      lat: 40.015,
      lng: -105.2705,
      neighborhood: 'REIE Smoke',
      description: 'Temporary listing used by the REIE property inquiry smoke test.',
    },
  });
}

async function postInquiry(propertyId: string): Promise<Record<string, unknown>> {
  const response = await fetch(`${BASE_URL}/api/property-inquiry`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      propertyId,
      email: SMOKE_EMAIL,
      name: 'REIE Property Inquiry Smoke',
      phone: '303-555-0199',
      timeline: 'research',
      notes: 'Non-sending smoke test for the property inquiry route.',
      source: 'smoke-test',
    }),
  });

  const payload = (await response.json().catch(() => null)) as unknown;

  assert.equal(response.status, 200, `Expected HTTP 200 from property inquiry route, got ${response.status}.`);
  assert.ok(isRecord(payload), 'Expected property inquiry route to return a JSON object.');
  assert.equal(payload.success, true, 'Expected property inquiry route success=true.');
  assert.ok(isRecord(payload.notification), 'Expected property inquiry route to return notification metadata.');
  assert.equal(payload.notification.sent, false, 'Expected research inquiry notification to be unsent.');
  assert.equal(payload.notification.reason, 'not-high-priority', 'Expected research inquiry notification skip reason.');
  assert.equal(payload.notification.attempted, false, 'Expected research inquiry notification to avoid delivery attempt.');
  assert.equal(payload.notification.required, false, 'Expected research inquiry notification to be optional.');
  assert.equal(payload.notification.priority, 'low', 'Expected research inquiry notification priority.');
  assert.equal(payload.notification.channel, 'property-inquiry-email', 'Expected property inquiry notification channel.');

  return payload;
}

async function assertPersistedRecords(payload: Record<string, unknown>, propertyId: string) {
  const user = await prisma.user.findUnique({
    where: {
      email: SMOKE_EMAIL,
    },
    include: {
      crmTasks: true,
      interactions: true,
      leadInteractions: true,
    },
  });

  assert.ok(user, 'Expected smoke lead user to be created.');
  assert.equal(user?.heatScore, 35, 'Expected smoke lead heat score to increase by 35.');
  assert.equal(user?.intentSchema, 'property-inquiry');

  const crmTask = user?.crmTasks.find((task) => task.id === payload.crmTaskId);
  assert.ok(crmTask, 'Expected property inquiry CRM task to be created.');
  assert.equal(crmTask?.type, 'property_inquiry');
  assert.equal(crmTask?.priority, 'low');
  assert.equal(crmTask?.status, 'pending');

  const userInteraction = user?.interactions.find((interaction) => interaction.id === payload.interactionId);
  assert.ok(userInteraction, 'Expected property inquiry user interaction to be created.');
  assert.equal(userInteraction?.type, 'property_inquiry');

  const leadInteraction = user?.leadInteractions.find((interaction) => interaction.id === payload.leadInteractionId);
  assert.ok(leadInteraction, 'Expected property inquiry lead interaction to be created.');
  assert.equal(leadInteraction?.propertyId, propertyId);
  assert.equal(leadInteraction?.interactionType, 'property_inquiry');
}

async function main() {
  const initialCleanup = await cleanup();

  const property = await seedProperty();

  try {
    const payload = await postInquiry(property.id);
    await assertPersistedRecords(payload, property.id);

    console.log(
      JSON.stringify(
        {
          success: true,
          check: 'property-inquiry-route-smoke',
          baseUrl: BASE_URL,
          sendsEmail: false,
          mutatesRows: true,
          cleanupAttempted: true,
          mutationScope: 'temporary smoke property, user, CRM task, user interaction, and lead interaction rows',
          initialCleanup,
          propertyId: property.id,
          email: SMOKE_EMAIL,
          crmTaskId: payload.crmTaskId,
          leadInteractionId: payload.leadInteractionId,
          notification: payload.notification,
        },
        null,
        2,
      ),
    );
  } finally {
    const finalCleanup = await cleanup();
    console.error(`Property inquiry smoke cleanup: ${JSON.stringify(finalCleanup)}`);
  }
}

main()
  .catch((error) => {
    console.error(`Property inquiry smoke failed: ${errorMessage(error)}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
