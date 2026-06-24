export function getAppDatabasePreflightErrorMessage(error) {
    if (error instanceof Error)
        return error.message.replace(/\s+/g, ' ').trim();
    return String(error || 'Unknown database preflight failure.');
}
export function shouldSkipAppDatabasePreflight(env = process.env) {
    const value = env.REIE_WORKER_SKIP_DATABASE_PREFLIGHT;
    return typeof value === 'string' && ['1', 'true', 'yes', 'y'].includes(value.trim().toLowerCase());
}
export function getAppDatabasePreflightFailureMessage(context, error) {
    return [
        `Database preflight failed for ${context.operation}.`,
        getAppDatabasePreflightErrorMessage(error),
        `Run ${context.recoveryCommand || 'npm run supabase:check'} and resolve Supabase before continuing.`,
    ].join(' ');
}
export function getAppDatabasePreflightDiagnostics() {
    const context = {
        operation: 'MLS sync API route before enqueue',
        recoveryCommand: 'npm run supabase:check:json',
    };
    const sampleError = new Error(' Supabase\nroute\tconnection failed ');
    const failureMessage = getAppDatabasePreflightFailureMessage(context, sampleError);
    return {
        module: 'appDatabasePreflight',
        skipVariable: 'REIE_WORKER_SKIP_DATABASE_PREFLIGHT',
        skipEnabledValues: ['1', 'true', 'yes', 'y'],
        skipDisabled: shouldSkipAppDatabasePreflight({ REIE_WORKER_SKIP_DATABASE_PREFLIGHT: '0' }),
        skipEnabled: shouldSkipAppDatabasePreflight({ REIE_WORKER_SKIP_DATABASE_PREFLIGHT: 'true' }),
        skipTrimsAndIgnoresCase: shouldSkipAppDatabasePreflight({ REIE_WORKER_SKIP_DATABASE_PREFLIGHT: ' YES ' }),
        operation: context.operation,
        recoveryCommand: context.recoveryCommand,
        defaultRecoveryCommand: 'npm run supabase:check',
        normalizedErrorMessage: getAppDatabasePreflightErrorMessage(sampleError),
        failureMessageIncludesOperation: failureMessage.includes(context.operation),
        failureMessageIncludesRecoveryCommand: failureMessage.includes(context.recoveryCommand),
    };
}
// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/appDatabasePreflightDiagnostics.ts
