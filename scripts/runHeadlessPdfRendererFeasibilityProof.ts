import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { createRequire } from 'node:module';

import { buildSellerPrintPdfRenderFoundation } from '../lib/sellerPrintPdfRenderFoundation';

type PlaywrightChromium = {
  chromium: {
    executablePath(): string;
    launch(options: { headless: true }): Promise<{
      version(): string;
      newPage(options: { viewport: { width: number; height: number } }): Promise<{
        setContent(html: string, options: { waitUntil: 'load' }): Promise<void>;
        pdf(options: {
          path: string;
          format: 'Letter';
          printBackground: true;
          preferCSSPageSize: true;
          displayHeaderFooter: true;
          headerTemplate: string;
          footerTemplate: string;
          margin: { top: string; right: string; bottom: string; left: string };
          tagged?: boolean;
          outline?: boolean;
        }): Promise<Buffer>;
        close(): Promise<void>;
      }>;
      close(): Promise<void>;
    }>;
  };
};

const requireFromRuntime = createRequire(import.meta.url);
const { chromium } = requireFromRuntime('playwright') as PlaywrightChromium;
const foundation = buildSellerPrintPdfRenderFoundation();
const documentModel = foundation.documentModels.find((document) => document.id === 'seller-update-print-document-v1') ?? foundation.documentModels[0];
const render = foundation.outputRenders.find((item) => item.id === 'render-seller-update-print-preview-v1') ?? foundation.outputRenders[0];

const outputDir = process.env.ATLAS_HEADLESS_PDF_OUTPUT_DIR ?? '/private/tmp/atlas-headless-pdf-feasibility';
mkdirSync(outputDir, { recursive: true });

const fileName = sanitizeFileName(`${documentModel.subject}-${documentModel.productKind}-${documentModel.effectiveAsOf}-${render.renderVersion}.pdf`);
const pdfPath = join(outputDir, fileName);
const evidencePath = join(outputDir, `${fileName.replace(/\.pdf$/i, '')}.evidence.json`);

function sanitizeFileName(value: string) {
  return value
    .trim()
    .replace(/[^A-Za-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function htmlForProof() {
  const rows = documentModel.pages.map((page) => `
    <tr>
      <td>${page.pageNumberIntent}</td>
      <td>${page.pageTemplateId}</td>
      <td>${escapeHtml(page.title)}</td>
      <td>${escapeHtml(page.sourceSectionIds.join(', '))}</td>
    </tr>
  `).join('');
  const blocks = documentModel.blocks.map((block) => `
    <article class="block ${block.breakPolicy === 'SECTION_START' ? 'section-start' : ''}">
      <p class="eyebrow">${block.printRole} / ${block.density}</p>
      <h2>${escapeHtml(block.component)}</h2>
      <p>Source section: ${escapeHtml(block.sourceSectionId)}. Source module: ${escapeHtml(block.sourceModuleId ?? 'none')}.</p>
      <p>Evidence: ${escapeHtml(block.evidenceReferenceIds.join(', '))}.</p>
    </article>
  `).join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(documentModel.title)}</title>
  <style>
    @page { size: letter; margin: 0.62in; }
    * { box-sizing: border-box; }
    body { margin: 0; background: #ffffff; color: #172025; font-family: Arial, Helvetica, sans-serif; font-size: 11px; line-height: 1.48; }
    main { width: 100%; }
    .cover { min-height: 8.1in; break-after: page; display: grid; align-content: center; border: 2px solid #172025; padding: 0.5in; }
    .brand { font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #49635e; }
    h1 { margin: 0.18in 0 0; font-size: 34px; line-height: 1.05; }
    h2 { margin: 0.08in 0; font-size: 18px; line-height: 1.15; }
    h3 { margin: 0.1in 0 0.05in; font-size: 14px; }
    .meta { margin-top: 0.24in; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.12in; }
    .card, .block { break-inside: avoid; page-break-inside: avoid; border: 1px solid #d8cfc0; background: #fffdf8; padding: 0.14in; margin: 0 0 0.12in; }
    .section-start { break-before: auto; }
    .eyebrow { margin: 0; font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #71624e; }
    table { width: 100%; border-collapse: collapse; break-inside: avoid; page-break-inside: avoid; margin: 0.12in 0; }
    thead { display: table-header-group; background: #efe5d4; }
    th, td { border: 1px solid #d8cfc0; padding: 0.06in; text-align: left; vertical-align: top; }
    .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.12in; }
    .fallback { border: 1px dashed #68756c; background: #edf2eb; padding: 0.18in; min-height: 1in; }
    .provenance { font-size: 9px; overflow-wrap: anywhere; }
  </style>
</head>
<body>
  <main>
    <section class="cover">
      <p class="brand">David Quinn Group / Project Atlas</p>
      <h1>${escapeHtml(documentModel.title)}</h1>
      <p>Subject: ${escapeHtml(documentModel.subject)}</p>
      <p>Prepared by: Agent workspace proof harness</p>
      <p>As of: ${documentModel.effectiveAsOf}</p>
      <p>Display version: ${render.displayVersion}</p>
      <div class="meta">
        <div class="card"><p class="eyebrow">Output version</p><p>${render.sourceOutputVersionId}</p></div>
        <div class="card"><p class="eyebrow">Render version</p><p>${render.renderVersion}</p></div>
        <div class="card"><p class="eyebrow">Content fingerprint</p><p>${render.sourceContentFingerprint}</p></div>
        <div class="card"><p class="eyebrow">Render fingerprint</p><p>${render.renderFingerprint}</p></div>
      </div>
    </section>
    <section>
      <h2>Document Page Map</h2>
      <table>
        <thead><tr><th>Page</th><th>Template</th><th>Title</th><th>Sections</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="grid">
        <div class="fallback"><h3>Static Map Fallback</h3><p>Location and competition map descriptors render as text/table fallbacks in this proof. No map tile fetch or provider call is used.</p></div>
        <div class="fallback"><h3>Static Chart Fallback</h3><p>Market chart descriptors render as print-safe metric/table summaries. Source data version: ${documentModel.pricingReferences.join(', ')}.</p></div>
      </div>
    </section>
    <section>
      <h2>Resolved Blocks</h2>
      ${blocks}
    </section>
    <section class="provenance">
      <h2>Evidence and Provenance</h2>
      <p>Evidence snapshots: ${documentModel.evidenceSnapshotReferences.join(', ')}.</p>
      <p>Pricing references: ${documentModel.pricingReferences.join(', ')}.</p>
      <p>Post-launch references: ${documentModel.postLaunchReferences.join(', ')}.</p>
      <p>Seller decision references: ${documentModel.sellerDecisionReferences.join(', ')}.</p>
      <p>PDF generation is local spike proof only. No persistence, delivery, provider call, or customer mutation is performed.</p>
    </section>
  </main>
</body>
</html>`;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character] ?? character);
}

function pdfInfo(path: string) {
  try {
    return execFileSync('pdfinfo', [path], { encoding: 'utf8' });
  } catch {
    return '';
  }
}

function pdfText(path: string) {
  try {
    return execFileSync('pdftotext', [path, '-'], { encoding: 'utf8' });
  } catch {
    const python = process.env.ATLAS_PDF_PYTHON ?? '/Users/davidquinn/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3';
    const script = [
      'import pdfplumber, sys',
      'with pdfplumber.open(sys.argv[1]) as pdf:',
      '    print("\\n".join(page.extract_text() or "" for page in pdf.pages))',
    ].join('\n');
    try {
      return execFileSync(python, ['-c', script, path], { encoding: 'utf8' });
    } catch {
      return '';
    }
  }
}

function field(info: string, name: string) {
  const line = info.split('\n').find((item) => item.startsWith(`${name}:`));
  return line ? line.slice(name.length + 1).trim() : '';
}

async function main() {
  const startedAt = new Date().toISOString();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 816, height: 1056 } });
  await page.setContent(htmlForProof(), { waitUntil: 'load' });
  await page.pdf({
    path: pdfPath,
    format: 'Letter',
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: true,
    headerTemplate: '<div style="width:100%;font-size:8px;color:#5d665f;padding:0 0.35in;">Seller Update / Project Atlas</div>',
    footerTemplate: '<div style="width:100%;font-size:8px;color:#5d665f;padding:0 0.35in;"><span class="pageNumber"></span> / <span class="totalPages"></span></div>',
    margin: { top: '0.55in', right: '0.5in', bottom: '0.55in', left: '0.5in' },
    tagged: true,
    outline: true,
  });
  await page.close();
  const browserVersion = browser.version();
  await browser.close();

  const pdfBytes = readFileSync(pdfPath);
  const info = pdfInfo(pdfPath);
  const text = pdfText(pdfPath);
  const expectedTextMarkers = [
    documentModel.title,
    documentModel.subject,
    render.sourceOutputVersionId,
    render.renderVersion,
    render.sourceContentFingerprint,
    render.renderFingerprint,
    'Static Map Fallback',
    'Static Chart Fallback',
    'Evidence and Provenance',
  ];
  const evidence = {
    status: 'LOCAL_PDF_GENERATED',
    renderer: 'PLAYWRIGHT_CHROMIUM',
    playwrightVersion: requireFromRuntime('playwright/package.json').version,
    browserVersion,
    executablePath: chromium.executablePath(),
    nodeVersion: process.version,
    platform: `${process.platform}-${process.arch}`,
    generatedAt: startedAt,
    outputPath: pdfPath,
    fileName: basename(pdfPath),
    mimeType: 'application/pdf',
    fileSize: pdfBytes.byteLength,
    fileHash: createHash('sha256').update(pdfBytes).digest('hex'),
    pdfVersion: field(info, 'PDF version'),
    pageSize: field(info, 'Page size'),
    pageCount: Number(field(info, 'Pages')),
    title: field(info, 'Title'),
    tagged: field(info, 'Tagged'),
    documentModelId: documentModel.id,
    sourceOutputVersionId: render.sourceOutputVersionId,
    renderVersion: render.renderVersion,
    sourceContentFingerprint: render.sourceContentFingerprint,
    renderFingerprint: render.renderFingerprint,
    expectedTextMarkers: Object.fromEntries(expectedTextMarkers.map((marker) => [marker, text.includes(marker)])),
    constraints: {
      persistence: false,
      delivery: false,
      providerRuntime: false,
      customerMutation: false,
    },
  };
  writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`);
  console.log(JSON.stringify(evidence, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
