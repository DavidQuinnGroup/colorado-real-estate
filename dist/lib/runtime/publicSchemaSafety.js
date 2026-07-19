export class PublicRuntimeSchemaUnavailableError extends Error {
    constructor(options) {
        super("Required public runtime database schema is unavailable.");
        this.code = "PUBLIC_RUNTIME_SCHEMA_UNAVAILABLE";
        this.name = "PublicRuntimeSchemaUnavailableError";
        this.missingTables = options.missingTables;
        this.missingColumns = options.missingColumns;
    }
}
export function isPublicRuntimeSchemaUnavailableError(error) {
    return error instanceof PublicRuntimeSchemaUnavailableError;
}
export async function assertPublicRuntimeSchema(client, requiredTables) {
    const missingTables = [];
    const missingColumns = [];
    for (const table of requiredTables) {
        const tableRows = await client.$queryRaw `
      SELECT to_regclass(${`"${table.tableName}"`}) IS NOT NULL AS "exists"
    `;
        if (!tableRows[0]?.exists) {
            missingTables.push(table.tableName);
            continue;
        }
        const columnRows = await client.$queryRaw `
      SELECT column_name AS "columnName"
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = ${table.tableName}
    `;
        const existingColumns = new Set(columnRows.map((row) => row.columnName));
        for (const columnName of table.columns) {
            if (!existingColumns.has(columnName)) {
                missingColumns.push({ tableName: table.tableName, columnName });
            }
        }
    }
    if (missingTables.length > 0 || missingColumns.length > 0) {
        throw new PublicRuntimeSchemaUnavailableError({
            missingTables,
            missingColumns,
        });
    }
}
