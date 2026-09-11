import { createHash } from 'node:crypto';

export const OUTPUT_REPORT_COMPOSITION_FOUNDATION_VERSION = 'OUTPUT_REPORT_COMPOSITION_FOUNDATION_V1' as const;
export const OUTPUT_REPORT_COMPOSITION_SCHEMA_VERSION = 'ATLAS_OUTPUT_REPORT_COMPOSITION_V1' as const;
export const OUTPUT_REPORT_COMPOSITION_SYNTHETIC_SUBJECT = 'ATLAS_SYNTHETIC_OUTPUT_FOUNDATION_V1' as const;
export const OUTPUT_REPORT_COMPOSITION_SYNTHETIC_SOURCE = 'ATLAS_SYNTHETIC_OUTPUT_FOUNDATION_V1_INITIAL' as const;

export type OutputCompositionBlock = Readonly<{
  id: string;
  kind: 'TEXT' | 'NOTICE' | 'LIST';
  value: string | readonly string[];
}>;

export type OutputCompositionSection = Readonly<{
  id: string;
  title: string;
  blocks: readonly OutputCompositionBlock[];
}>;

export type OutputReportComposition = Readonly<{
  schemaVersion: typeof OUTPUT_REPORT_COMPOSITION_SCHEMA_VERSION;
  title: string;
  summary: string;
  sections: readonly OutputCompositionSection[];
}>;

export class OutputReportCompositionError extends Error {
  constructor(readonly code: 'MALFORMED_PAYLOAD' | 'UNSUPPORTED_SCHEMA' | 'MISSING_REQUIRED_CONTENT', message: string) {
    super(message);
  }
}

function text(value: unknown, field: string) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new OutputReportCompositionError('MISSING_REQUIRED_CONTENT', `${field} is required.`);
  }
  if (value.length > 4_000) throw new OutputReportCompositionError('MALFORMED_PAYLOAD', `${field} is too long.`);
  return value.trim();
}

function block(value: unknown, index: number): OutputCompositionBlock {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new OutputReportCompositionError('MALFORMED_PAYLOAD', `sections[${index}].blocks contains an invalid block.`);
  }
  const input = value as Record<string, unknown>;
  const id = text(input.id, `sections[${index}].blocks.id`);
  if (input.kind !== 'TEXT' && input.kind !== 'NOTICE' && input.kind !== 'LIST') {
    throw new OutputReportCompositionError('MALFORMED_PAYLOAD', `sections[${index}].blocks.kind is unsupported.`);
  }
  if (input.kind === 'LIST') {
    if (!Array.isArray(input.value) || !input.value.length || input.value.some((item) => typeof item !== 'string' || !item.trim())) {
      throw new OutputReportCompositionError('MISSING_REQUIRED_CONTENT', `sections[${index}].blocks.value must contain list content.`);
    }
    return Object.freeze({ id, kind: input.kind, value: Object.freeze(input.value.map((item) => text(item, `sections[${index}].blocks.value`))) });
  }
  return Object.freeze({ id, kind: input.kind, value: text(input.value, `sections[${index}].blocks.value`) });
}

export function parseOutputReportComposition(value: unknown): OutputReportComposition {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new OutputReportCompositionError('MALFORMED_PAYLOAD', 'The composition must be an object.');
  }
  const input = value as Record<string, unknown>;
  if (input.schemaVersion !== OUTPUT_REPORT_COMPOSITION_SCHEMA_VERSION) {
    throw new OutputReportCompositionError('UNSUPPORTED_SCHEMA', 'The composition schema is unsupported.');
  }
  if (!Array.isArray(input.sections) || !input.sections.length) {
    throw new OutputReportCompositionError('MISSING_REQUIRED_CONTENT', 'At least one composition section is required.');
  }
  const sections = input.sections.map((section, index) => {
    if (!section || typeof section !== 'object' || Array.isArray(section)) {
      throw new OutputReportCompositionError('MALFORMED_PAYLOAD', `sections[${index}] is invalid.`);
    }
    const item = section as Record<string, unknown>;
    if (!Array.isArray(item.blocks) || !item.blocks.length) {
      throw new OutputReportCompositionError('MISSING_REQUIRED_CONTENT', `sections[${index}].blocks is required.`);
    }
    return Object.freeze({ id: text(item.id, `sections[${index}].id`), title: text(item.title, `sections[${index}].title`), blocks: Object.freeze(item.blocks.map((entry) => block(entry, index))) });
  });
  return Object.freeze({ schemaVersion: OUTPUT_REPORT_COMPOSITION_SCHEMA_VERSION, title: text(input.title, 'title'), summary: text(input.summary, 'summary'), sections: Object.freeze(sections) });
}

function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.entries(value as Record<string, unknown>).sort(([left], [right]) => left.localeCompare(right)).map(([key, entry]) => `${JSON.stringify(key)}:${stable(entry)}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

export function outputReportCompositionFingerprint(composition: OutputReportComposition) {
  return createHash('sha256').update(stable(composition)).digest('hex');
}

export function buildSyntheticOutputReportComposition(): OutputReportComposition {
  return parseOutputReportComposition({
    schemaVersion: OUTPUT_REPORT_COMPOSITION_SCHEMA_VERSION,
    title: 'ATLAS Synthetic Output - Foundation V1',
    summary: 'Inert synthetic composition for Project Atlas Output foundation certification.',
    sections: [
      { id: 'purpose', title: 'Purpose', blocks: [{ id: 'purpose-text', kind: 'TEXT', value: 'Verify immutable OutputProduct and OutputVersion orientation without client, property, market, financial, or transaction claims.' }] },
      { id: 'limitations', title: 'Certification limitations', blocks: [{ id: 'limitations-notice', kind: 'NOTICE', value: 'Synthetic internal certification only. This output is not a delivery, client authorization, market report, or external communication.' }] },
      { id: 'provenance', title: 'Provenance', blocks: [{ id: 'provenance-list', kind: 'LIST', value: ['SYNTHETIC_CERTIFICATION_INTERNAL_ONLY', 'No source-domain calculations were performed.', 'No evidence admission or external action occurred.'] }] },
    ],
  });
}
