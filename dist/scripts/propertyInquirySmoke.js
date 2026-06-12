import { strict as assert } from 'node:assert';
import dotenv from 'dotenv';
import { prisma } from '../lib/prisma.js';
dotenv.config({ path: '.env.local', quiet: true });
dotenv.config({ quiet: true });
const SMOKE_MLS_ID = 'REIE-SMOKE-INQUIRY';
const SMOKE_SLUG = 'reie-smoke-property-inquiry';
const SMOKE_EMAIL = 'reie-property-inquiry-smoke@example.com';
const BASE_URL = (process.env.PROPERTY_INQUIRY_SMOKE_BASE_URL || 'http://localhost:3000').replace(/\/+$/, '');
function errorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}
function isRecord(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
async function cleanup() {
    const user = await prisma.user.findUnique({
        where: {
            email: SMOKE_EMAIL,
        },
        select: {
            id: true,
        },
    });
    if (user) {
        await prisma.user.delete({
            where: {
                id: user.id,
            },
        });
    }
    await prisma.property.deleteMany({
        where: {
            mlsId: SMOKE_MLS_ID,
        },
    });
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
async function postInquiry(propertyId) {
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
    const payload = (await response.json().catch(() => null));
    assert.equal(response.status, 200, `Expected HTTP 200 from property inquiry route, got ${response.status}.`);
    assert.ok(isRecord(payload), 'Expected property inquiry route to return a JSON object.');
    assert.equal(payload.success, true, 'Expected property inquiry route success=true.');
    assert.equal(payload.notification && isRecord(payload.notification) ? payload.notification.reason : null, 'not-high-priority');
    return payload;
}
async function assertPersistedRecords(payload, propertyId) {
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
    await cleanup();
    const property = await seedProperty();
    try {
        const payload = await postInquiry(property.id);
        await assertPersistedRecords(payload, property.id);
        console.log(JSON.stringify({
            success: true,
            check: 'property-inquiry-route-smoke',
            baseUrl: BASE_URL,
            propertyId: property.id,
            email: SMOKE_EMAIL,
            crmTaskId: payload.crmTaskId,
            leadInteractionId: payload.leadInteractionId,
            notification: payload.notification,
        }, null, 2));
    }
    finally {
        await cleanup();
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
