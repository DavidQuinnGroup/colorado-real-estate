import { strict as assert } from 'node:assert';
import { spawnSync } from 'node:child_process';
function isRecord(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function parseJsonPayload(output) {
    const start = output.indexOf('{');
    const end = output.lastIndexOf('}');
    if (start < 0 || end <= start) {
        throw new Error('Expected notification readiness strict output to include JSON.');
    }
    const parsed = JSON.parse(output.slice(start, end + 1));
    assert.ok(isRecord(parsed), 'Expected notification readiness strict output to be a JSON object.');
    return parsed;
}
function getResult(payload, name) {
    const results = Array.isArray(payload.results) ? payload.results : [];
    return results.find((result) => isRecord(result) && result.name === name);
}
function getGate(payload, name) {
    const gates = Array.isArray(payload.gates) ? payload.gates : [];
    return gates.find((gate) => isRecord(gate) && gate.name === name);
}
function hasFailedCheck(result, name) {
    if (!isRecord(result) || !Array.isArray(result.failedChecks))
        return false;
    return result.failedChecks.some((check) => isRecord(check) && check.name === name && check.status === 'fail');
}
function hasCheckDetail(result, name, status, detail) {
    if (!isRecord(result) || !Array.isArray(result.checks))
        return false;
    return result.checks.some((check) => isRecord(check) && check.name === name && check.status === status && String(check.detail || '') === detail);
}
function hasBlockedBy(result, code, envVar) {
    if (!isRecord(result) || !Array.isArray(result.blockedBy))
        return false;
    return result.blockedBy.some((blocker) => isRecord(blocker) &&
        blocker.code === code &&
        Array.isArray(blocker.envVars) &&
        blocker.envVars.includes(envVar));
}
function runLaunchReadiness(env) {
    const result = spawnSync(process.execPath, ['dist/scripts/launchReadiness.js'], {
        cwd: process.cwd(),
        encoding: 'utf8',
        env,
    });
    const payload = parseJsonPayload(result.stdout || '');
    const readiness = isRecord(payload.readiness) ? payload.readiness : {};
    const readinessLevel = readiness.level;
    const expectedExitCode = readinessLevel === 'blocked' ? 1 : 0;
    assert.equal(payload.check, 'reie-launch-readiness', 'Expected launch readiness check name.');
    assert.equal(payload.sendsEmail, false, 'Expected launch readiness to be non-sending.');
    assert.equal(payload.mutatesRows, false, 'Expected launch readiness to avoid row mutation.');
    assert.equal(result.status, expectedExitCode, `Expected launch readiness exit ${expectedExitCode} when readiness is ${String(readinessLevel)}.`);
    return {
        exitCode: result.status,
        success: payload.success,
        readiness: readinessLevel,
        propertyInquiryGate: getGate(payload, 'Property-inquiry notification email'),
    };
}
function runStrictSummary(env) {
    const result = spawnSync(process.execPath, ['dist/scripts/notificationReadinessSummary.js', '--strict'], {
        cwd: process.cwd(),
        encoding: 'utf8',
        env,
    });
    const payload = parseJsonPayload(result.stdout || '');
    const readiness = isRecord(payload.readiness) ? payload.readiness : {};
    const readinessLevel = readiness.level;
    const expectedExitCode = readinessLevel === 'blocked' ? 1 : 0;
    assert.equal(payload.check, 'reie-notification-readiness-summary', 'Expected strict summary check name.');
    assert.equal(payload.sendsEmail, false, 'Expected strict summary to be non-sending.');
    assert.equal(payload.mutatesRows, false, 'Expected strict summary to avoid row mutation.');
    assert.equal(payload.strictMode, true, 'Expected strict summary to report strictMode=true.');
    assert.equal(payload.commandSuccess, true, 'Expected strict summary child commands to be parseable.');
    assert.equal(result.status, expectedExitCode, `Expected strict summary exit ${expectedExitCode} when readiness is ${String(readinessLevel)}.`);
    assert.equal(payload.success, readinessLevel !== 'blocked', 'Expected strict summary success to fail closed only when readiness is blocked.');
    return {
        exitCode: result.status,
        success: payload.success,
        readiness: readinessLevel,
        propertyInquiryResult: getResult(payload, 'Property-inquiry notification'),
        aggregateResult: getResult(payload, 'Aggregate launch notification readiness'),
    };
}
function main() {
    const currentEnvResult = runStrictSummary(process.env);
    const dryRunEnvResult = runStrictSummary({
        ...process.env,
        PROPERTY_INQUIRY_NOTIFY_TO: 'internal-property-inquiries@example.com',
        REIE_INTERNAL_EMAIL: '',
        PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN: 'true',
    });
    const noReplyToLaunchResult = runLaunchReadiness({
        ...process.env,
        PROPERTY_INQUIRY_NOTIFY_TO: 'internal-property-inquiries@example.com',
        REIE_INTERNAL_EMAIL: '',
        PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN: 'true',
        RESEND_REPLY_TO_EMAIL: '',
    });
    assert.equal(dryRunEnvResult.readiness, 'blocked', 'Expected dry-run strict summary to block.');
    assert.equal(dryRunEnvResult.exitCode, 1, 'Expected dry-run strict summary to exit 1.');
    assert.equal(dryRunEnvResult.success, false, 'Expected dry-run strict summary success=false.');
    assert.ok(hasFailedCheck(dryRunEnvResult.propertyInquiryResult, 'PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN'), 'Expected dry-run strict property-inquiry child to expose dry-run failed check.');
    assert.ok(hasBlockedBy(dryRunEnvResult.propertyInquiryResult, 'property_inquiry_dry_run_enabled', 'PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN'), 'Expected dry-run strict property-inquiry child to expose structured dry-run blocker.');
    assert.ok(hasFailedCheck(dryRunEnvResult.aggregateResult, 'PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN'), 'Expected dry-run strict aggregate child to expose dry-run failed check.');
    assert.ok(hasBlockedBy(currentEnvResult.propertyInquiryResult, 'property_inquiry_recipient_missing', 'PROPERTY_INQUIRY_NOTIFY_TO'), 'Expected current strict property-inquiry child to expose structured recipient blocker.');
    assert.ok(hasBlockedBy(currentEnvResult.aggregateResult, 'property_inquiry_recipient_missing', 'REIE_INTERNAL_EMAIL'), 'Expected current strict aggregate child to expose structured fallback recipient blocker.');
    assert.ok(hasCheckDetail(noReplyToLaunchResult.propertyInquiryGate, 'RESEND_REPLY_TO_EMAIL', 'warn', 'Not configured; property inquiry emails will reply directly to the lead email.'), 'Expected aggregate launch readiness to explain property-inquiry reply-to fallback behavior.');
    console.log(JSON.stringify({
        success: true,
        check: 'reie-notification-readiness-strict-contract',
        sendsEmail: false,
        mutatesRows: false,
        currentEnv: {
            readiness: currentEnvResult.readiness,
            exitCode: currentEnvResult.exitCode,
            success: currentEnvResult.success,
        },
        dryRunEnv: {
            readiness: dryRunEnvResult.readiness,
            exitCode: dryRunEnvResult.exitCode,
            success: dryRunEnvResult.success,
            propertyInquiryDryRunBlocked: true,
            aggregateDryRunBlocked: true,
        },
        launchReadinessContract: {
            readiness: noReplyToLaunchResult.readiness,
            exitCode: noReplyToLaunchResult.exitCode,
            success: noReplyToLaunchResult.success,
            propertyInquiryReplyToWarningAligned: true,
        },
    }, null, 2));
}
try {
    main();
}
catch (error) {
    console.error(error);
    process.exit(1);
}
