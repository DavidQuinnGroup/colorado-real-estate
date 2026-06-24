import { strict as assert } from 'node:assert';
import { sendPropertyInquiryNotification } from '../lib/email/sendPropertyInquiryNotification.js';
const originalPropertyInquiryNotifyTo = process.env.PROPERTY_INQUIRY_NOTIFY_TO;
const originalReieInternalEmail = process.env.REIE_INTERNAL_EMAIL;
const originalPropertyInquiryNotificationDryRun = process.env.PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN;
function buildInput() {
    return {
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
    };
}
async function main() {
    delete process.env.PROPERTY_INQUIRY_NOTIFY_TO;
    delete process.env.REIE_INTERNAL_EMAIL;
    delete process.env.PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN;
    const missingRecipientResult = await sendPropertyInquiryNotification(buildInput());
    assert.ok('sent' in missingRecipientResult, 'Expected notification helper to return a sent/skipped result.');
    assert.equal(missingRecipientResult.sent, false, 'Expected notification helper to skip without a configured recipient.');
    assert.equal(missingRecipientResult.reason, 'missing-property-inquiry-notification-recipient');
    process.env.PROPERTY_INQUIRY_NOTIFY_TO = 'internal-property-inquiries@example.com';
    process.env.PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN = 'true';
    const dryRunResult = await sendPropertyInquiryNotification(buildInput());
    assert.ok('sent' in dryRunResult, 'Expected notification helper to return a sent/skipped result in dry-run mode.');
    assert.equal(dryRunResult.sent, false, 'Expected notification helper to skip while dry-run is enabled.');
    assert.equal(dryRunResult.reason, 'property-inquiry-notification-dry-run');
    console.log(JSON.stringify({
        success: true,
        check: 'property-inquiry-notification-skip',
        missingRecipient: missingRecipientResult,
        dryRun: dryRunResult,
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
    if (originalPropertyInquiryNotificationDryRun === undefined) {
        delete process.env.PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN;
    }
    else {
        process.env.PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN = originalPropertyInquiryNotificationDryRun;
    }
})
    .catch((error) => {
    console.error(error);
    process.exit(1);
});
