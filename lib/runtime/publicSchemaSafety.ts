type QueryClient = {
  $queryRaw<T = unknown>(strings: TemplateStringsArray, ...values: unknown[]): Promise<T>;
};

export type RequiredTableShape = {
  tableName: string;
  columns: string[];
};

export class PublicRuntimeSchemaUnavailableError extends Error {
  readonly code = "PUBLIC_RUNTIME_SCHEMA_UNAVAILABLE";
  readonly missingTables: string[];
  readonly missingColumns: Array<{ tableName: string; columnName: string }>;

  constructor(options: {
    missingTables: string[];
    missingColumns: Array<{ tableName: string; columnName: string }>;
  }) {
    super("Required public runtime database schema is unavailable.");
    this.name = "PublicRuntimeSchemaUnavailableError";
    this.missingTables = options.missingTables;
    this.missingColumns = options.missingColumns;
  }
}

export function isPublicRuntimeSchemaUnavailableError(
  error: unknown,
): error is PublicRuntimeSchemaUnavailableError {
  return error instanceof PublicRuntimeSchemaUnavailableError;
}

export async function assertPublicRuntimeSchema(
  client: QueryClient,
  requiredTables: RequiredTableShape[],
) {
  const missingTables: string[] = [];
  const missingColumns: Array<{ tableName: string; columnName: string }> = [];

  for (const table of requiredTables) {
    const tableRows = await client.$queryRaw<Array<{ exists: boolean }>>`
      SELECT to_regclass(${`"${table.tableName}"`}) IS NOT NULL AS "exists"
    `;

    if (!tableRows[0]?.exists) {
      missingTables.push(table.tableName);
      continue;
    }

    const columnRows = await client.$queryRaw<Array<{ columnName: string }>>`
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
