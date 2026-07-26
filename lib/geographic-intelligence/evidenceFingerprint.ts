import { createHash } from "node:crypto";

export function stableGisEvidenceFingerprint(value: unknown): string {
  return createHash("sha256").update(stableNormalize(value)).digest("hex");
}

export function stableNormalize(value: unknown): string {
  return JSON.stringify(sortForFingerprint(value));
}

function sortForFingerprint(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortForFingerprint);
  if (value === null || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([key]) => ![
        "acquiredTime",
        "retrievedTime",
        "generatedAt",
        "databaseId",
        "localPath",
        "presentationLabel",
      ].includes(key))
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entry]) => [key, sortForFingerprint(entry)]),
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/geographic-intelligence/evidenceFingerprint.ts
