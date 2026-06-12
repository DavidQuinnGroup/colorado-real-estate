import { strict as assert } from 'node:assert';
import { sendPropertyInquiryNotification } from '../lib/email/sendPropertyInquiryNotification.js';
const originalPropertyInquiryNotifyTo = process.env.PROPERTY_INQUIRY_NOTIFY_TO;
const originalReieInternalEmail = process.env.REIE_INTERNAL_EMAIL;
async function main() {
    delete process.env.PROPERTY_INQUIRY_NOTIFY_TO;
    delete process.env.REIE_INTERNAL_EMAIL;
    const result = await sendPropertyInquiryNotification({
        inquiryId: 'test-inquiry',
        crmTaskId: 'test-crm-task',
        leadEmail: 'lead@example.com',
        leadName: 'REIE Test Lead',
        leadPhone: '303-555-0100',
        timelineLabel: 'Schedule tour',
        leadTemperature: 'hot',
        notes: 'This is a non-sending notification check.',
        property: {
            id: 'test-property',
            mlsId: 'TEST123',
            slug: 'test-property',
            address: '123 Test Property Way',
            city: 'Boulder',
            state: 'CO',
            zip: '80302',
            price: 1250000,
            propertyType: 'Residential',
            status: 'Active',
        },
    });
    assert.ok('sent' in result, 'Expected notification helper to return a sent/skipped result.');
    assert.equal(result.sent, false, 'Expected notification helper to skip without a configured recipient.');
    assert.equal(result.reason, 'missing-property-inquiry-notification-recipient');
    console.log(JSON.stringify({
        success: true,
        check: 'property-inquiry-notification-skip',
        result,
    }, null, 2));
}
main()
    .finally(() => {
    if (originalPropertyInquiryNotifyTo === undefined) {
        delete process.env.PROPERTY_INQUIRY_NOTIFY_TO;
    }
    else {
        process.env.PROPERTY_INQUIRY_NOTIFY_TO = originalPropertyInquiryNotifyTo;
    }
    if (originalReieInternalEmail === undefined) {
        delete process.env.REIE_INTERNAL_EMAIL;
    }
    else {
        process.env.REIE_INTERNAL_EMAIL = originalReieInternalEmail;
    }
})
    .catch((error) => {
    console.error(error);
    process.exit(1);
});
