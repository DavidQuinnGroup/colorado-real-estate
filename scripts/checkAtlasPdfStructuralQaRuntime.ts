import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  ATLAS_PDF_STRUCTURAL_QA_ENGINE_ID,
  ATLAS_PDF_STRUCTURAL_QA_ENGINE_VERSION,
  ATLAS_PDF_STRUCTURAL_QA_FAILURES,
  ATLAS_PDF_STRUCTURAL_QA_PARSER_ID,
  ATLAS_PDF_STRUCTURAL_QA_PARSER_VERSION,
  AtlasPdfStructuralQaEngine,
  AtlasPdfStructuralQaError,
  atlasPdfTextIncludesMarker,
  normalizeAtlasPdfText,
} from '../lib/atlasPdfStructuralQa';

const structuralQa = readFileSync('lib/atlasPdfStructuralQa.ts', 'utf8');
const renderer = readFileSync('lib/atlasPdfRenderer.ts', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as {
  dependencies?: Record<string, string>;
  scripts?: Record<string, string>;
};

assert.equal(ATLAS_PDF_STRUCTURAL_QA_ENGINE_ID, 'ATLAS_PDF_STRUCTURAL_QA_ENGINE');
assert.equal(ATLAS_PDF_STRUCTURAL_QA_ENGINE_VERSION, 'ATLAS_PDF_STRUCTURAL_QA_ENGINE_V1');
assert.equal(ATLAS_PDF_STRUCTURAL_QA_PARSER_ID, 'PDFREADER_PDF2JSON');
assert.equal(ATLAS_PDF_STRUCTURAL_QA_PARSER_VERSION, 'pdfreader@3.0.8/pdf2json@3.1.4');
assert.deepEqual(ATLAS_PDF_STRUCTURAL_QA_FAILURES, [
  'PDF_BYTES_EMPTY',
  'PDF_SIGNATURE_INVALID',
  'PDF_PARSE_FAILED',
  'PDF_QA_ENGINE_UNAVAILABLE',
  'PDF_PAGE_COUNT_INVALID',
  'PDF_REQUIRED_MARKER_MISSING',
  'PDF_PAGE_STRUCTURE_INVALID',
  'PDF_PROFILE_MISMATCH',
  'PDF_QA_INTERNAL_ERROR',
]);

assert.equal(normalizeAtlasPdfText(' Seller\u00a0Update\n\u2014\u00a0Reviewed '), 'Seller Update - Reviewed');
assert.equal(atlasPdfTextIncludesMarker('Render SELLER_UPDA TE_PRINT_RENDER_V1', 'SELLER_UPDATE_PRINT_RENDER_V1'), true);

await assert.rejects(
  () => new AtlasPdfStructuralQaEngine().inspectPdf(Buffer.from('not a PDF', 'utf8')),
  (error: unknown) => error instanceof AtlasPdfStructuralQaError && error.code === 'PDF_SIGNATURE_INVALID',
);

const unavailableEngine = new AtlasPdfStructuralQaEngine({
  parserFactory: () => ({
    parseBuffer() {
      throw new Error('intentional parser fixture failure');
    },
  }),
});
await assert.rejects(
  () => unavailableEngine.inspectPdf(Buffer.from('%PDF-1.4\n', 'utf8')),
  (error: unknown) => error instanceof AtlasPdfStructuralQaError && error.code === 'PDF_QA_ENGINE_UNAVAILABLE',
);

for (const token of ["requireFromStructuralQa('pdfreader')", 'parseBuffer', 'PDF_SIGNATURE_INVALID', 'PDF_QA_ENGINE_UNAVAILABLE', 'atlasPdfTextIncludesMarker']) {
  assert(structuralQa.includes(token), `structural QA source missing ${token}`);
}
assert.doesNotMatch(structuralQa, /DOMMatrix|DOMParser|\bdocument\b|\bwindow\b|canvas|pdfjs-dist/);
assert.doesNotMatch(renderer, /pdfinfo|pdftotext|pdfplumber|pdfjs-dist/);
assert.equal(packageJson.dependencies?.pdfreader, '3.0.8');
assert.equal(packageJson.dependencies?.['pdfjs-dist'], undefined);
assert.equal(packageJson.scripts?.['check:atlas-pdf-structural-qa-runtime'], 'jiti scripts/checkAtlasPdfStructuralQaRuntime.ts');

console.log('ATLAS_PDF_STRUCTURAL_QA_RUNTIME_CHECK: PASS');
