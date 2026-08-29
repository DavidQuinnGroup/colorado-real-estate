import { createRequire } from 'node:module';
import type { DataEntry, ItemHandler } from 'pdfreader';

const requireFromStructuralQa = createRequire(import.meta.url);
// Suppress parser-internal error output; the adapter returns only bounded failure codes.
process.env.PDF2JSON_DISABLE_LOGS ??= '1';
const { PdfReader } = requireFromStructuralQa('pdfreader') as { PdfReader: typeof import('pdfreader').PdfReader };

export const ATLAS_PDF_STRUCTURAL_QA_ENGINE_ID = 'ATLAS_PDF_STRUCTURAL_QA_ENGINE' as const;
export const ATLAS_PDF_STRUCTURAL_QA_ENGINE_VERSION = 'ATLAS_PDF_STRUCTURAL_QA_ENGINE_V1' as const;
export const ATLAS_PDF_STRUCTURAL_QA_PARSER_ID = 'PDFREADER_PDF2JSON' as const;
export const ATLAS_PDF_STRUCTURAL_QA_PARSER_VERSION = 'pdfreader@3.0.8/pdf2json@3.1.4' as const;
export const ATLAS_PDF_STRUCTURAL_QA_TIMEOUT_MS = 10_000 as const;

export const ATLAS_PDF_STRUCTURAL_QA_FAILURES = [
  'PDF_BYTES_EMPTY',
  'PDF_SIGNATURE_INVALID',
  'PDF_PARSE_FAILED',
  'PDF_QA_ENGINE_UNAVAILABLE',
  'PDF_PAGE_COUNT_INVALID',
  'PDF_REQUIRED_MARKER_MISSING',
  'PDF_PAGE_STRUCTURE_INVALID',
  'PDF_PROFILE_MISMATCH',
  'PDF_QA_INTERNAL_ERROR',
] as const;

export type AtlasPdfStructuralQaFailure = (typeof ATLAS_PDF_STRUCTURAL_QA_FAILURES)[number];

export type AtlasPdfQaProductKind = 'SELLER' | 'SELLER_UPDATE';

export type AtlasPdfPageInspection = Readonly<{
  pageNumber: number;
  normalizedText: string;
  textLength: number;
  isEmpty: boolean;
}>;

export type AtlasPdfStructuralInspection = Readonly<{
  isPdf: boolean;
  pageCount: number;
  pages: readonly AtlasPdfPageInspection[];
  documentText: string;
  parserId: typeof ATLAS_PDF_STRUCTURAL_QA_PARSER_ID;
  parserVersion: typeof ATLAS_PDF_STRUCTURAL_QA_PARSER_VERSION;
  inspectionVersion: typeof ATLAS_PDF_STRUCTURAL_QA_ENGINE_VERSION;
  warnings: readonly string[];
}>;

export type AtlasPdfQaCertificationProfile = Readonly<{
  id: 'SELLER_PDF_QA_PROFILE_V1' | 'SELLER_UPDATE_PDF_QA_PROFILE_V1';
  version: 'V1';
  productKind: AtlasPdfQaProductKind;
  requiredMarkers: readonly string[];
  requiredPageMarkers: readonly string[];
}>;

type PdfReaderLike = Readonly<{
  parseBuffer(buffer: Buffer, itemHandler: ItemHandler): void;
}>;

export type AtlasPdfStructuralQaEngineOptions = Readonly<{
  parserFactory?: () => PdfReaderLike;
  timeoutMs?: number;
}>;

export function normalizeAtlasPdfText(value: string) {
  return value
    .normalize('NFKC')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\s+/g, ' ')
    .replace(/\s*_\s*/g, '_')
    .replace(/\b([A-Za-z])\s+([a-z]{2,})\b/g, '$1$2')
    .trim();
}

export function atlasPdfTextIncludesMarker(documentText: string, marker: string) {
  const normalizedDocument = normalizeAtlasPdfText(documentText);
  const normalizedMarker = normalizeAtlasPdfText(marker);
  if (normalizedDocument.includes(normalizedMarker)) return true;

  // PDF text runs may wrap deterministic identifiers inside a table cell.
  if (/^[A-Za-z0-9_-]+$/.test(normalizedMarker)) {
    return normalizedDocument.replace(/\s+/g, '').includes(normalizedMarker.replace(/\s+/g, ''));
  }
  return false;
}

export function buildAtlasPdfQaProfile(productKind: AtlasPdfQaProductKind, requiredMarkers: readonly string[]): AtlasPdfQaCertificationProfile {
  return Object.freeze({
    id: productKind === 'SELLER' ? 'SELLER_PDF_QA_PROFILE_V1' : 'SELLER_UPDATE_PDF_QA_PROFILE_V1',
    version: 'V1',
    productKind,
    requiredMarkers: Object.freeze([...requiredMarkers]),
    requiredPageMarkers: Object.freeze(
      productKind === 'SELLER'
        ? ['Executive Summary', 'Pricing', 'Evidence and Provenance']
        : ['Change Summary', 'Updated Recommendation', 'Evidence and Provenance'],
    ),
  });
}

function hasPdfSignature(bytes: Buffer) {
  return bytes.byteLength >= 5 && bytes.subarray(0, 5).toString('ascii') === '%PDF-';
}

export class AtlasPdfStructuralQaEngine {
  private readonly parserFactory: () => PdfReaderLike;
  private readonly timeoutMs: number;

  constructor(options: AtlasPdfStructuralQaEngineOptions = {}) {
    this.parserFactory = options.parserFactory ?? (() => new PdfReader());
    this.timeoutMs = options.timeoutMs ?? ATLAS_PDF_STRUCTURAL_QA_TIMEOUT_MS;
  }

  async inspectPdf(bytes: Buffer): Promise<AtlasPdfStructuralInspection> {
    if (bytes.byteLength === 0) throw new AtlasPdfStructuralQaError('PDF_BYTES_EMPTY', 'PDF bytes are empty.');
    if (!hasPdfSignature(bytes)) throw new AtlasPdfStructuralQaError('PDF_SIGNATURE_INVALID', 'PDF signature is invalid.');

    const pageTexts = await new Promise<Map<number, string>>((resolve, reject) => {
      const pages = new Map<number, string>();
      let currentPage = 0;
      const timer = setTimeout(() => reject(new AtlasPdfStructuralQaError('PDF_QA_ENGINE_UNAVAILABLE', 'PDF parser timed out.')), this.timeoutMs);
      const finish = (callback: () => void) => {
        clearTimeout(timer);
        callback();
      };

      try {
        this.parserFactory().parseBuffer(bytes, (error: string | null, item: DataEntry) => {
          if (error) {
            finish(() => reject(new AtlasPdfStructuralQaError('PDF_PARSE_FAILED', 'PDF parser could not inspect bytes.', new Error(error))));
            return;
          }
          if (!item) {
            finish(() => resolve(pages));
            return;
          }
          if (typeof item.page === 'number') {
            currentPage = item.page;
            if (!pages.has(currentPage)) pages.set(currentPage, '');
            return;
          }
          if (typeof item.text === 'string' && currentPage > 0) {
            pages.set(currentPage, `${pages.get(currentPage) ?? ''} ${item.text}`);
          }
        });
      } catch (error) {
        finish(() => reject(new AtlasPdfStructuralQaError('PDF_QA_ENGINE_UNAVAILABLE', 'PDF parser could not start.', error)));
      }
    });

    const pages = Object.freeze(
      [...pageTexts.entries()].sort(([left], [right]) => left - right).map(([pageNumber, text]) => {
        const normalizedText = normalizeAtlasPdfText(text);
        return Object.freeze({ pageNumber, normalizedText, textLength: normalizedText.length, isEmpty: normalizedText.length === 0 });
      }),
    );
    if (pages.length === 0) throw new AtlasPdfStructuralQaError('PDF_PAGE_COUNT_INVALID', 'PDF has no parsed pages.');

    return Object.freeze({
      isPdf: true,
      pageCount: pages.length,
      pages,
      documentText: normalizeAtlasPdfText(pages.map((page) => page.normalizedText).join('\n')),
      parserId: ATLAS_PDF_STRUCTURAL_QA_PARSER_ID,
      parserVersion: ATLAS_PDF_STRUCTURAL_QA_PARSER_VERSION,
      inspectionVersion: ATLAS_PDF_STRUCTURAL_QA_ENGINE_VERSION,
      warnings: Object.freeze([]),
    });
  }
}

export class AtlasPdfStructuralQaError extends Error {
  constructor(readonly code: AtlasPdfStructuralQaFailure, message: string, readonly cause?: unknown) {
    super(message);
    this.name = 'AtlasPdfStructuralQaError';
  }
}

export const atlasPdfStructuralQaEngine = new AtlasPdfStructuralQaEngine();
